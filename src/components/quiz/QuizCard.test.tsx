import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BaseCard, CardType } from "@/shared/classes";
import { newId } from "@/shared/types/UUID";
import { QuizCard } from "./QuizCard";

const card = BaseCard.fromDto({
  id: newId(),
  question: { format: "plain", source: "Powerhouse of the cell" },
  answer: { format: "plain", source: "Mitochondria" },
  type: CardType.Definition,
});

describe("QuizCard", () => {
  test("submits the typed answer with Enter", async () => {
    const onSubmit = jest.fn();
    render(<QuizCard card={card} response={null} onSubmit={onSubmit} />);

    await userEvent.type(
      screen.getByRole("textbox", { name: "Your answer" }),
      "mitochondria{Enter}",
    );

    expect(onSubmit).toHaveBeenCalledWith("mitochondria");
  });

  test("disables Submit until something is typed", async () => {
    const onSubmit = jest.fn();
    render(<QuizCard card={card} response={null} onSubmit={onSubmit} />);
    const submit = screen.getByRole("button", { name: "Submit" });

    expect(submit).toBeDisabled();
    await userEvent.type(screen.getByRole("textbox"), "x");
    expect(submit).toBeEnabled();
    await userEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledWith("x");
  });

  test("shows the correct answer and the given one once answered", () => {
    render(
      <QuizCard
        card={card}
        response={{ answer: "ribosome", grade: null }}
        onSubmit={jest.fn()}
      />,
    );

    expect(screen.getByText("Mitochondria")).toBeInTheDocument();
    expect(screen.getByText("ribosome")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});
