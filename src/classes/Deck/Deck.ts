import { Card } from "../Card/Card";
import type { CardDto } from "../Card/CardDto";
import type { DeckDto } from "./DeckDto";
import { newId, type UUID } from "../types";
import type { StorageLocation } from "@/storage";

/**
 * Shape of a deck. `C` is the card type: {@link Card} instances by default,
 * or {@link CardDto} for the DTO.
 */
export interface IDeck<C extends Card | CardDto = Card> {
  id: UUID;
  name: string;
  belongs_to: UUID | null;
  storage: StorageLocation;
  cards: C[];
  created_at: number;
  updated_at: number;
}

export type DeckChanges = Partial<Pick<IDeck, "name" | "cards" | "storage">>;

export class Deck implements IDeck {
  readonly id: UUID;
  readonly name: string;
  readonly belongs_to: UUID | null;
  readonly storage: StorageLocation;
  readonly cards: Card[];
  readonly created_at: number;
  readonly updated_at: number;

  constructor(deck: IDeck) {
    this.id = deck.id;
    this.name = deck.name;
    this.belongs_to = deck.belongs_to;
    this.storage = deck.storage;
    this.cards = deck.cards;
    this.created_at = deck.created_at;
    this.updated_at = deck.updated_at;
  }

  static create(
    deck: Pick<IDeck, "name" | "cards" | "belongs_to" | "storage">,
  ): Deck {
    const now = Date.now();
    return new Deck({ ...deck, id: newId(), created_at: now, updated_at: now });
  }

  static fromDto(dto: DeckDto): Deck {
    return new Deck({ ...dto, cards: dto.cards.map(Card.fromDto) });
  }

  /** Returns a copy with the given changes applied and `updated_at` bumped. */
  update(changes: DeckChanges): Deck {
    return new Deck({ ...this, ...changes, updated_at: Date.now() });
  }

  toDto(): DeckDto {
    return { ...this, cards: this.cards.map((card) => card.toDto()) };
  }

  /** Called by `JSON.stringify`, so stringifying a deck always yields its DTO. */
  toJSON(): DeckDto {
    return this.toDto();
  }
}
