import {
  BaseFlashcard,
  type FlashcardDto,
  CardType,
  ContentFormat,
  type BaseDeck,
} from "@/shared/classes";

import { newId } from "@/shared/types/UUID";

/**
 * Editable, plain-data form of a deck. The editor works on this and only
 * converts to {@link BaseFlashcard} instances when saving.
 */
export interface DeckDraft {
  name: string;
  cards: FlashcardDto[];
}

export const emptyCardDto = (): FlashcardDto => ({
  id: newId(),
  type: CardType.Definition,
  question: { format: ContentFormat.Plain, source: "" },
  answer: { format: ContentFormat.Plain, source: "" },
});

export const DeckDraft = {
  empty(): DeckDraft {
    return { name: "", cards: [emptyCardDto()] };
  },

  fromDeck(deck: BaseDeck): DeckDraft {
    return { name: deck.name, cards: deck.cards.map((card) => card.toDto()) };
  },

  toCards(draft: DeckDraft): BaseFlashcard[] {
    return draft.cards.map(BaseFlashcard.fromDto);
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
