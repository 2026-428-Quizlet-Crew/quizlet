import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type {
  CardTypeDefinition,
  CardTypeId,
  EditProps,
  Flashcard,
  FlashcardData,
  QuizBackProps,
  QuizFrontProps,
  RenderContext,
} from "@/shared/classes";
import { newId } from "@/shared/types/UUID";

// A sample built-in card type, written against the interfaces the way
// definition and concept will be.

type NoContent = Record<string, never>;
type TrueFalseData = FlashcardData<NoContent, boolean>;
type TrueFalseResponse = boolean | null;

class TrueFalseCard implements Flashcard<
  NoContent,
  boolean,
  TrueFalseResponse
> {
  readonly type = "true-false";

  constructor(private readonly data: TrueFalseData) {}

  get id() {
    return this.data.id;
  }

  get question() {
    return this.data.question;
  }

  renderEdit({ value, onChange }: EditProps<NoContent, boolean>) {
    return (
      <input
        aria-label="Question"
        value={value.question}
        onChange={(e) => onChange({ ...value, question: e.target.value })}
      />
    );
  }

  renderStudyFront() {
    return <p>{this.data.question}</p>;
  }

  renderStudyBack() {
    return <p>{this.data.answer ? "True" : "False"}</p>;
  }

  renderQuizFront({ response, onChange }: QuizFrontProps<TrueFalseResponse>) {
    return [true, false].map((value) => (
      <button
        key={String(value)}
        aria-pressed={response === value}
        onClick={() => onChange(value, true)}
      >
        {value ? "True" : "False"}
      </button>
    ));
  }

  renderQuizBack({ result }: QuizBackProps<TrueFalseResponse>) {
    return <p>{result.correct ? "Correct" : "Incorrect"}</p>;
  }

  async emptyResponse() {
    return null;
  }

  async grade(response: TrueFalseResponse) {
    const correct = response === this.data.answer;
    return { score: correct ? 1 : 0, correct };
  }

  async validate() {
    return this.data.question.trim()
      ? []
      : [{ field: "question", message: "Write a question." }];
  }

  toData() {
    return this.data;
  }
}

const TrueFalseType = {
  id: "true-false",
  version: 1,
  label: "True / false",
  description: "The student picks true or false.",
  builtIn: true,
  createEmpty: async () => ({
    id: newId(),
    type: "true-false",
    version: 1,
    question: "",
    content: {},
    answer: true,
  }),
  fromData: (data) => new TrueFalseCard(data),
} satisfies CardTypeDefinition<NoContent, boolean, TrueFalseResponse>;

// Runners and the editor only see the default (Json) generics.
const registry: Record<CardTypeId, CardTypeDefinition> = {
  "true-false": TrueFalseType,
};

const ctx: RenderContext = { theme: "light", seed: 1 };

const sampleCard = () =>
  TrueFalseType.fromData({
    id: newId(),
    type: "true-false",
    version: 1,
    question: "The sun is a star.",
    content: {},
    answer: true,
  });

describe("Flashcard interfaces", () => {
  test("a registered type creates a blank card that fails validation", async () => {
    const definition = registry["true-false"];
    const card = definition.fromData(await definition.createEmpty());

    expect(card.type).toBe("true-false");
    expect(await card.validate()).toEqual([
      { field: "question", message: "Write a question." },
    ]);
  });

  test("the quiz front reports the response and that it is complete", async () => {
    const onChange = jest.fn();
    const card = sampleCard();
    render(
      <>
        {card.renderQuizFront({
          response: await card.emptyResponse(),
          onChange,
          onSubmitRequest: jest.fn(),
          ctx,
        })}
      </>,
    );

    await userEvent.click(screen.getByRole("button", { name: "True" }));

    expect(onChange).toHaveBeenCalledWith(true, true);
  });

  test("grades the response and shows the result on the back", async () => {
    const card = sampleCard();
    const result = await card.grade(false);
    render(<>{card.renderQuizBack({ response: false, result, ctx })}</>);

    expect(result).toEqual({ score: 0, correct: false });
    expect(screen.getByText("Incorrect")).toBeInTheDocument();
  });

  test("toData returns what fromData was given", () => {
    const card = sampleCard();

    expect(TrueFalseType.fromData(card.toData()).toData()).toEqual(
      card.toData(),
    );
  });
});
