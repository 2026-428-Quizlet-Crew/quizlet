import { type CardDto } from "../Card/CardDto";
import { BaseCard } from "../Card/BaseCard";
import type { UUID } from "@/types/UUID";
import type { StorageLocation } from "@/types/StorageLocation";

/**
 * Shape of a deck. `C` is the card type: {@link BaseCard} instances by default,
 * or {@link CardDto} for the DTO.
 */
export interface Deck<C extends BaseCard | CardDto = BaseCard> {
  id: UUID;
  name: string;
  belongs_to: UUID | null;
  storage: StorageLocation;
  cards: C[];
  created_at: number;
  updated_at: number;
}
