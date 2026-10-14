import { BaseDeck, type DeckDto } from "@/classes";
import type { DeckRepository } from "./DeckRepository";
import { StorageLocation } from "../../types/StorageLocation";
import { type UUID } from "@/types/UUID";

const STORAGE_KEY = "quizlet-bb.decks";

type StoredDeckDtos = Record<UUID, DeckDto>;

export class LocalStorageDeckRepository implements DeckRepository {
  readonly location = StorageLocation.Local;

  async list(): Promise<BaseDeck[]> {
    return Object.values(this.read()).map(BaseDeck.fromDto);
  }

  async get(id: UUID): Promise<BaseDeck | null> {
    const dto = this.read()[id];
    return dto ? BaseDeck.fromDto(dto) : null;
  }

  async save(deck: BaseDeck): Promise<void> {
    this.write({ ...this.read(), [deck.id]: deck.toDto() });
  }

  async delete(id: UUID): Promise<void> {
    const decks = this.read();
    delete decks[id];
    this.write(decks);
  }

  private read(): StoredDeckDtos {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    try {
      return JSON.parse(raw) as StoredDeckDtos;
    } catch (error) {
      console.error("Could not parse saved decks; ignoring them.", error);
      return {};
    }
  }

  private write(decks: StoredDeckDtos): void {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
  }
}
