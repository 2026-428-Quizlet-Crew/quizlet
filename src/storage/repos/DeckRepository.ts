import type { Deck, UUID } from "@/classes";
import type { StorageLocation } from "../StorageLocation";

/** A place decks can be persisted. Async so network-backed stores fit the same shape. */
export interface DeckRepository {
  readonly location: StorageLocation;
  list(): Promise<Deck[]>;
  get(id: UUID): Promise<Deck | null>;
  save(deck: Deck): Promise<void>;
  delete(id: UUID): Promise<void>;
}
