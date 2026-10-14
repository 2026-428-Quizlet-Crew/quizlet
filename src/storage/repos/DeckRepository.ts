import type { BaseDeck } from "@/classes";
import type { StorageLocation } from "@/types/StorageLocation";
import type { UUID } from "@/types/UUID";

/** A place decks can be persisted. Async so network-backed stores fit the same shape. */
export interface DeckRepository {
  readonly location: StorageLocation;
  list(): Promise<BaseDeck[]>;
  get(id: UUID): Promise<BaseDeck | null>;
  save(deck: BaseDeck): Promise<void>;
  delete(id: UUID): Promise<void>;
}
