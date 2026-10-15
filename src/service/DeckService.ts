import type { BaseDeck } from "@/shared/classes";
import type { DeckRepository } from "@/storage";
import type { StorageLocation } from "@/shared/types/StorageLocation";
import type { UUID } from "@/shared/types/UUID";

/**
 * Single entry point for deck persistence. Routes each deck to the repository
 * for its `storage` location, and only knows about the repositories the
 * current user is allowed to use.
 */
export class DeckService {
  private readonly repositories: Map<StorageLocation, DeckRepository>;

  constructor(repositories: DeckRepository[]) {
    this.repositories = new Map(repositories.map((r) => [r.location, r]));
  }

  get locations(): StorageLocation[] {
    return [...this.repositories.keys()];
  }

  async list(): Promise<BaseDeck[]> {
    const decks = await Promise.all(
      [...this.repositories.values()].map((repo) => repo.list()),
    );
    return decks.flat().sort((a, b) => b.updated_at - a.updated_at);
  }

  async get(id: UUID): Promise<BaseDeck | null> {
    for (const repo of this.repositories.values()) {
      const deck = await repo.get(id);
      if (deck) return deck;
    }
    return null;
  }

  /**
   * Saves the deck to its `storage` location. Pass `previous` when the deck
   * has moved so the old copy is removed.
   */
  async save(deck: BaseDeck, previous?: StorageLocation): Promise<void> {
    await this.repository(deck.storage).save(deck);
    if (previous && previous !== deck.storage) {
      await this.repository(previous).delete(deck.id);
    }
  }

  async delete(deck: BaseDeck): Promise<void> {
    await this.repository(deck.storage).delete(deck.id);
  }

  private repository(location: StorageLocation): DeckRepository {
    const repo = this.repositories.get(location);
    if (!repo) throw new Error(`No access to "${location}" storage.`);
    return repo;
  }
}
