import { type FlashcardDto } from "@/shared/classes/Flashcard/FlashcardDto";
import { BaseFlashcard } from "@/shared/classes/Flashcard/BaseFlashcard";
import type { UUID } from "../../types/UUID";
import type { StorageLocation } from "../../types/StorageLocation";
import { Flashcard } from "@/shared/classes/Flashcard/Flashcard";

export type DeckChanges = Partial<Pick<Deck, "name" | "cards" | "storage">>;

/**
 * Shape of a deck. `C` is the card type: {@link BaseFlashcard} instances by default,
 * or {@link FlashcardDto} for the DTO.
 */
export interface Deck<C extends Flashcard | FlashcardDto = BaseFlashcard> {
  id: UUID;
  name: string;
  belongs_to: UUID | null;
  storage: StorageLocation;
  cards: C[];
  created_at: number;
  updated_at: number;
}
