import { BaseCard, BaseDeck, CardType, QuizAttempt } from "@/shared/classes";
import { StorageLocation } from "@/shared/types/StorageLocation";
import { newId } from "@/shared/types/UUID";

const card = (type: CardType, question: string, answer: string) =>
  BaseCard.fromDto({
    id: newId(),
    question: { format: "plain", source: question },
    answer: { format: "plain", source: answer },
    type,
  });

const definition = card(
  CardType.Definition,
  "Powerhouse of the cell",
  "Mitochondria",
);
const concept = card(
  CardType.Concept,
  "Why is the sky blue?",
  "Rayleigh scattering",
);
const fn = card(CardType.Function, "x + 1 where x = 2", "3");

const deckOf = (...cards: BaseCard[]) =>
  BaseDeck.create({
    name: "Biology",
    cards,
    belongs_to: null,
    storage: StorageLocation.Local,
  });

describe("QuizAttempt", () => {
  test("leaves function cards out", () => {
    const attempt = QuizAttempt.start(deckOf(definition, fn, concept));

    expect(attempt.total).toBe(2);
    expect(attempt.cards).toEqual([definition, concept]);
  });

  test("auto-grades definitions ignoring case and extra whitespace", () => {
    const attempt = QuizAttempt.start(deckOf(definition));

    expect(attempt.submit("  mitoCHONDRIA \n").currentResponse).toEqual({
      answer: "  mitoCHONDRIA \n",
      grade: { kind: "correct", correct: true },
    });
    expect(attempt.submit("ribosome").currentResponse?.grade).toEqual({
      kind: "correct",
      correct: false,
    });
  });

  test("lets an auto-grade be overridden", () => {
    const attempt = QuizAttempt.start(deckOf(definition))
      .submit("ribosome")
      .grade({ kind: "correct", correct: true });

    expect(attempt.currentResponse?.grade).toEqual({
      kind: "correct",
      correct: true,
    });
  });

  test("ignores a grade of the wrong kind", () => {
    const attempt = QuizAttempt.start(deckOf(definition)).submit("ribosome");

    expect(attempt.grade({ kind: "stars", stars: 5 })).toBe(attempt);
  });

  test("does not allow skipping an unanswered or ungraded card", () => {
    const start = QuizAttempt.start(deckOf(concept, definition));
    expect(start.hasNext).toBe(false);
    expect(start.next()).toBe(start);

    const answered = start.submit("light scatters");
    expect(answered.revealed).toBe(true);
    expect(answered.hasNext).toBe(false);

    const graded = answered.grade({ kind: "stars", stars: 4 });
    expect(graded.hasNext).toBe(true);
    expect(graded.next().current).toBe(definition);
  });

  test("keeps answers when going back, and allows regrading", () => {
    const back = QuizAttempt.start(deckOf(concept, definition))
      .submit("light scatters")
      .grade({ kind: "stars", stars: 4 })
      .next()
      .previous();

    expect(back.current).toBe(concept);
    expect(back.revealed).toBe(true);
    expect(back.submit("something else").currentResponse?.answer).toBe(
      "light scatters",
    );
    expect(
      back.grade({ kind: "stars", stars: 2 }).currentResponse?.grade,
    ).toEqual({ kind: "stars", stars: 2 });
  });

  test("summarizes results and lists missed cards", () => {
    const wrong = card(CardType.Definition, "H2O", "Water");
    const weak = card(CardType.Concept, "Explain entropy", "Disorder");
    let attempt = QuizAttempt.start(deckOf(definition, wrong, concept, weak))
      .submit("mitochondria")
      .next()
      .submit("fire")
      .next()
      .submit("scattering")
      .grade({ kind: "stars", stars: 3 })
      .next()
      .submit("no idea")
      .grade({ kind: "stars", stars: 2 });
    attempt = attempt.next();

    expect(attempt.isFinished).toBe(true);
    expect(attempt.results).toEqual({
      definitions: { correct: 1, total: 2 },
      concepts: { averageStars: 2.5, total: 2 },
      missed: [
        {
          card: wrong,
          response: {
            answer: "fire",
            grade: { kind: "correct", correct: false },
          },
        },
        {
          card: weak,
          response: { answer: "no idea", grade: { kind: "stars", stars: 2 } },
        },
      ],
    });
  });

  test("restart clears every answer", () => {
    const attempt = QuizAttempt.start(deckOf(definition))
      .submit("mitochondria")
      .restart();

    expect(attempt.index).toBe(0);
    expect(attempt.responses.size).toBe(0);
  });
});
