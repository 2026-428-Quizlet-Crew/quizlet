import type { BaseCard } from "../Card/BaseCard";
import { CardType } from "../Card/CardType";
import type { BaseDeck } from "../Deck/BaseDeck";
import type { UUID } from "../../types/UUID";
import { CARD_GRADERS } from "./CardGrader";
import type { CardResponse, Grade } from "./Grade";

export interface MissedCard {
  card: BaseCard;
  response: CardResponse;
}

export interface QuizResults {
  definitions: { correct: number; total: number };
  concepts: { averageStars: number | null; total: number };
  missed: MissedCard[];
}

export class QuizAttempt {
  private constructor(
    readonly deck: BaseDeck,
    readonly cards: readonly BaseCard[],
    readonly index: number,
    readonly responses: ReadonlyMap<UUID, CardResponse>,
  ) {}

  static start(deck: BaseDeck): QuizAttempt {
    const cards = deck.cards.filter(
      (card) => CARD_GRADERS[card.type].quizzable,
    );
    return new QuizAttempt(deck, cards, 0, new Map());
  }

  get total(): number {
    return this.cards.length;
  }

  get current(): BaseCard | null {
    return this.cards[this.index] ?? null;
  }

  get currentResponse(): CardResponse | null {
    const card = this.current;
    return (card && this.responses.get(card.id)) ?? null;
  }

  /** Whether the current card has been answered (and so shows its answer). */
  get revealed(): boolean {
    return this.currentResponse !== null;
  }

  get isFinished(): boolean {
    return this.index >= this.total;
  }

  get hasPrevious(): boolean {
    return this.index > 0;
  }

  /** No skipping: the current card must be answered and graded first. */
  get hasNext(): boolean {
    return !this.isFinished && this.currentResponse?.grade != null;
  }

  submit(answer: string): QuizAttempt {
    const card = this.current;
    if (!card || this.revealed) return this;
    const grade = CARD_GRADERS[card.type].autoGrade(card, answer);
    return this.withResponse(card, { answer, grade });
  }

  /** Grades (or regrades) the current card. It must be answered first. */
  grade(grade: Grade): QuizAttempt {
    const card = this.current;
    const response = this.currentResponse;
    if (!card || !response || grade.kind !== CARD_GRADERS[card.type].kind) {
      return this;
    }
    return this.withResponse(card, { ...response, grade });
  }

  next(): QuizAttempt {
    if (!this.hasNext) return this;
    return new QuizAttempt(
      this.deck,
      this.cards,
      this.index + 1,
      this.responses,
    );
  }

  previous(): QuizAttempt {
    if (!this.hasPrevious) return this;
    return new QuizAttempt(
      this.deck,
      this.cards,
      this.index - 1,
      this.responses,
    );
  }

  restart(): QuizAttempt {
    return QuizAttempt.start(this.deck);
  }

  get results(): QuizResults {
    const results: QuizResults = {
      definitions: { correct: 0, total: 0 },
      concepts: { averageStars: null, total: 0 },
      missed: [],
    };
    let starTotal = 0;

    for (const card of this.cards) {
      const response = this.responses.get(card.id);
      const grade = response?.grade;
      if (!response || !grade) continue;

      if (card.type === CardType.Definition) {
        results.definitions.total++;
        if (grade.kind === "correct" && grade.correct) {
          results.definitions.correct++;
        }
      } else if (card.type === CardType.Concept && grade.kind === "stars") {
        results.concepts.total++;
        starTotal += grade.stars;
      }

      if (CARD_GRADERS[card.type].isMissed(grade)) {
        results.missed.push({ card, response });
      }
    }

    if (results.concepts.total > 0) {
      results.concepts.averageStars = starTotal / results.concepts.total;
    }
    return results;
  }

  private withResponse(card: BaseCard, response: CardResponse): QuizAttempt {
    const responses = new Map(this.responses).set(card.id, response);
    return new QuizAttempt(this.deck, this.cards, this.index, responses);
  }
}
