import { Deck } from "@/shared/classes/Deck/Deck";
import { Flashcard } from "@/shared/classes/Flashcard/Flashcard";

/**
 * Immutable state of a run through a deck. Every transition returns a new
 * session, so it can be stored directly in React state.
 *
 * `index === total` means the deck is finished.
 */
export class StudySession {
  private constructor(
    readonly deck: Deck,
    readonly index: number,
    readonly revealed: boolean,
  ) {}

  static start(deck: Deck): StudySession {
    return new StudySession(deck, 0, false);
  }

  get total(): number {
    return this.deck.cards.length;
  }

  get current(): Flashcard | null {
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

  flip(): StudySession {
    if (this.isFinished) return this;
    return new StudySession(this.deck, this.index, !this.revealed);
  }

  next(): StudySession {
    if (!this.hasNext) return this;
    return new StudySession(this.deck, this.index + 1, false);
  }

  previous(): StudySession {
    if (!this.hasPrevious) return this;
    return new StudySession(this.deck, this.index - 1, false);
  }

  restart(): StudySession {
    return StudySession.start(this.deck);
  }
}
