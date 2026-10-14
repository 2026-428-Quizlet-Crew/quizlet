import { BaseCard } from "../Card/BaseCard";
import type { DeckDto } from "./DeckDto";
import { newId, type UUID } from "@/types/UUID";
import type { StorageLocation } from "@/storage";
import { Deck } from "./Deck";

export type DeckChanges = Partial<Pick<Deck, "name" | "cards" | "storage">>;

export class BaseDeck implements Deck {
  readonly id: UUID;
  readonly name: string;
  readonly belongs_to: UUID | null;
  readonly storage: StorageLocation;
  readonly cards: BaseCard[];
  readonly created_at: number;
  readonly updated_at: number;

  constructor(deck: Deck) {
    this.id = deck.id;
    this.name = deck.name;
    this.belongs_to = deck.belongs_to;
    this.storage = deck.storage;
    this.cards = deck.cards;
    this.created_at = deck.created_at;
    this.updated_at = deck.updated_at;
  }

  static create(
    deck: Pick<Deck, "name" | "cards" | "belongs_to" | "storage">,
  ): BaseDeck {
    const now = Date.now();
    return new BaseDeck({
      ...deck,
      id: newId(),
      created_at: now,
      updated_at: now,
    });
  }

  static fromDto(dto: DeckDto): BaseDeck {
    return new BaseDeck({ ...dto, cards: dto.cards.map(BaseCard.fromDto) });
  }

  /** Returns a copy with the given changes applied and `updated_at` bumped. */
  update(changes: DeckChanges): BaseDeck {
    return new BaseDeck({ ...this, ...changes, updated_at: Date.now() });
  }

  toDto(): DeckDto {
    return { ...this, cards: this.cards.map((card) => card.toDto()) };
  }

  /** Called by `JSON.stringify`, so stringifying a deck always yields its DTO. */
  toJSON(): DeckDto {
    return this.toDto();
  }
}
