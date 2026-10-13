import type { Card } from "../Card/Card";
import type { Deck } from "../Deck/Deck";

/**
 * Immutable state of a run through a deck. Every transition returns a new
 * session, so it can be stored directly in React state.
 *
 * `index === total` means the deck is finished.
 */
export class QuizSession {
  private constructor(
    readonly deck: Deck,
    readonly index: number,
    readonly revealed: boolean,
  ) {}

  static start(deck: Deck): QuizSession {
    return new QuizSession(deck, 0, false);
  }

  get total(): number {
    return this.deck.cards.length;
  }

  get current(): Card | null {
    return this.deck.cards[this.index] ?? null;
  }

  get isFinished(): boolean {
    return this.index >= this.total;
  }

  get hasPrevious(): boolean {
    return this.index > 0;
  }

  get hasNext(): boolean {
    return !this.isFinished;
  }

  flip(): QuizSession {
    if (this.isFinished) return this;
    return new QuizSession(this.deck, this.index, !this.revealed);
  }

  next(): QuizSession {
    if (!this.hasNext) return this;
    return new QuizSession(this.deck, this.index + 1, false);
  }

  previous(): QuizSession {
    if (!this.hasPrevious) return this;
    return new QuizSession(this.deck, this.index - 1, false);
  }

  restart(): QuizSession {
    return QuizSession.start(this.deck);
  }
}
