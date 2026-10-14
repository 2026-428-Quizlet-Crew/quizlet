import {
  Card,
  type CardDto,
  CardType,
  ContentFormat,
  type Deck,
} from "@/classes";

import { newId } from "@/types/UUID";

/**
 * Editable, plain-data form of a deck. The editor works on this and only
 * converts to {@link Card} instances when saving.
 */
export interface DeckDraft {
  name: string;
  cards: CardDto[];
}

export const emptyCardDto = (): CardDto => ({
  id: newId(),
  type: CardType.Definition,
  question: { format: ContentFormat.Plain, source: "" },
  answer: { format: ContentFormat.Plain, source: "" },
});

export const DeckDraft = {
  empty(): DeckDraft {
    return { name: "", cards: [emptyCardDto()] };
  },

  fromDeck(deck: Deck): DeckDraft {
    return { name: deck.name, cards: deck.cards.map((card) => card.toDto()) };
  },

  toCards(draft: DeckDraft): Card[] {
    return draft.cards.map(Card.fromDto);
  },

  /** Returns a list of problems; empty when the draft can be saved. */
  validate(draft: DeckDraft): string[] {
    const errors: string[] = [];
    if (!draft.name.trim()) errors.push("Give the deck a name.");
    if (draft.cards.length === 0) errors.push("Add at least one card.");
    DeckDraft.toCards(draft).forEach((card, i) => {
      if (card.question.isEmpty() || card.answer.isEmpty()) {
        errors.push(`Card ${i + 1} needs both a question and an answer.`);
      }
    });
    return errors;
  },
};
