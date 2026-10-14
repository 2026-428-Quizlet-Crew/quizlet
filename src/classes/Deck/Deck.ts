import { type CardDto } from "../Card/CardDto";
import { Card } from "../Card/Card";
import type { UUID } from "@/types/UUID";
import type { StorageLocation } from "@/storage";

/**
 * Shape of a deck. `C` is the card type: {@link Card} instances by default,
 * or {@link CardDto} for the DTO.
 */
export interface Deck<C extends Card | CardDto = Card> {
  id: UUID;
  name: string;
  belongs_to: UUID | null;
  storage: StorageLocation;
  cards: C[];
  created_at: number;
  updated_at: number;
}
