import {screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type {
  CardActions,
  CardToHost,
  CardViewState,
  CustomCardModule,
  FlashcardData,
  HostToCard,
} from "@/shared/classes";
import type {Json} from "@/shared/types/Json";
import {newId} from "@/shared/types/UUID";

// A sample custom card type, written the way an author would inside the iframe.

type NoContent = Record<string, never>;
type TrueFalseResponse = boolean | null;

const trueFalse: CustomCardModule<NoContent, boolean, TrueFalseResponse> = {
  createEmpty: () => ({ question: "", content: {}, answer: true }),

  render(root, state, actions) {
    const question = document.createElement("p");
    question.textContent = state.data.question;
    root.replaceChildren(question);

    switch (state.view) {
      case "quizFront":
        for (const value of [true, false]) {
          const button = document.createElement("button");
          button.textContent = value ? "True" : "False";
          button.setAttribute("aria-pressed", String(state.response === value));
          button.addEventListener("click", () => actions.setResponse(value));
          root.append(button);
        }
        break;
      case "quizBack":
        root.append(state.result.correct ? "Correct" : "Incorrect");
        break;
      case "studyBack":
        root.append(state.data.answer ? "True" : "False");
        break;
    }
  },

  emptyResponse: () => null,
  isComplete: (_content, response) => response !== null,

  grade(data, response) {
    const correct = response === data.answer;
    return { score: correct ? 1 : 0, correct };
  },

  validate: (data) =>
    data.question.trim()
      ? []
      : [{ field: "question", message: "Write a question." }],
};

/**
 * Stand-in for the runtime that will load inside every iframe: turns host
 * messages into module calls, and module output into card messages.
 */
const createRuntime = (
  module: CustomCardModule,
  root: HTMLElement,
  post: (message: CardToHost) => void,
) => {
  const actionsFor = (state: CardViewState): CardActions<Json, Json, Json> => ({
    setResponse: (response) =>
      post({
        type: "responseChanged",
        response,
        complete: module.isComplete(state.data.content, response),
      }),
    setData: (data) => post({ type: "dataChanged", data }),
    requestSubmit: () => post({ type: "submitRequested" }),
  });

  const reply = async (requestId: string, work: () => Json | Promise<Json>) => {
    try {
      post({ type: "result", requestId, ok: true, value: await work() });
    } catch (error) {
      post({ type: "result", requestId, ok: false, error: String(error) });
    }
  };

  return async (message: HostToCard): Promise<void> => {
    switch (message.type) {
      case "render":
        module.unmount?.(root);
        module.render(root, message.state, actionsFor(message.state));
        return;
      case "createEmpty":
        return reply(message.requestId, () => module.createEmpty());
      case "emptyResponse":
        return reply(message.requestId, () =>
          module.emptyResponse(message.content),
        );
      case "grade":
        return reply(message.requestId, () =>
          module.grade(message.data, message.response),
        );
      case "validate":
        return reply(message.requestId, () => module.validate(message.data));
      case "migrate":
        return reply(message.requestId, () => {
          if (!module.migrate) throw new Error("This card type can't migrate.");
          return module.migrate(message.data, message.fromVersion);
        });
      default: {
        throw new Error(`Unhandled message: ${JSON.stringify(message)}`);
      }
    }
  };
};

const data: FlashcardData<NoContent, boolean> = {
  id: newId(),
  type: "true-false",
  version: 1,
  question: "The sun is a star.",
  content: {},
  answer: true,
};

const setup = () => {
  const root = document.createElement("div");
  document.body.replaceChildren(root);
  const post = jest.fn<void, [CardToHost]>();
  // Runtimes hold any module, so a specific one must fit the Json defaults.
  const send = createRuntime(trueFalse, root, post);
  return { send, post };
};

const ctx = { theme: "light", seed: 1 } as const;

describe("Custom card interfaces", () => {
  test("a quiz answer is sent out with whether it is complete", async () => {
    const { send, post } = setup();
    await send({
      type: "render",
      state: { view: "quizFront", data, response: null, ctx },
    });

    await userEvent.click(screen.getByRole("button", { name: "True" }));

    expect(post).toHaveBeenCalledWith({
      type: "responseChanged",
      response: true,
      complete: true,
    });
  });

  test("the quiz back shows the grade it was given", async () => {
    const { send } = setup();
    await send({
      type: "render",
      state: {
        view: "quizBack",
        data,
        response: false,
        result: { score: 0, correct: false },
        ctx,
      },
    });

    expect(screen.getByText("Incorrect", { exact: false })).toBeInTheDocument();
  });

  test("requests are answered with a result carrying the same id", async () => {
    const { send, post } = setup();
    await send({ type: "grade", requestId: "1", data, response: true });
    await send({
      type: "validate",
      requestId: "2",
      data: { ...data, question: " " },
    });

    expect(post.mock.calls).toEqual([
      [
        {
          type: "result",
          requestId: "1",
          ok: true,
          value: { score: 1, correct: true },
        },
      ],
      [
        {
          type: "result",
          requestId: "2",
          ok: true,
          value: [{ field: "question", message: "Write a question." }],
        },
      ],
    ]);
  });

  test("a failed request is answered with an error result", async () => {
    const { send, post } = setup();
    await send({ type: "migrate", requestId: "3", data, fromVersion: 0 });

    expect(post).toHaveBeenCalledWith({
      type: "result",
      requestId: "3",
      ok: false,
      error: "Error: This card type can't migrate.",
    });
  });
});
