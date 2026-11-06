import { BaseDeck } from "@/shared/classes";
import { StorageLocation } from "@/shared/types/StorageLocation";
import type { User } from "@/shared/types/User";
import { newId, type UUID } from "@/shared/types/UUID";
import type { DeckRepository } from "@/storage";
import { AuthService } from "./auth/AuthService";
import { DeckService } from "./DeckService";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";

/** In-memory repository so tests never touch localStorage or the network. */
class FakeRepository implements DeckRepository {
  readonly decks = new Map<UUID, BaseDeck>();

  constructor(readonly location: StorageLocation) {}

  async list() {
    return [...this.decks.values()];
  }

  async get(id: UUID) {
    return this.decks.get(id) ?? null;
  }

  async save(deck: BaseDeck) {
    this.decks.set(deck.id, deck);
  }

  async delete(id: UUID) {
    this.decks.delete(id);
  }
}

const user: User = { id: "user-1", name: "Test User" };

const makeDeck = (storage: StorageLocation, updated_at = 1) =>
  new BaseDeck({
    id: newId(),
    name: "Deck",
    belongs_to: null,
    storage,
    cards: [],
    created_at: 1,
    updated_at,
  });

let auth: AuthService;
let local: FakeRepository;
let cloud: FakeRepository;
let service: DeckService;

beforeEach(() => {
  auth = AuthService.resetForTests();
  local = new FakeRepository(StorageLocation.Local);
  cloud = new FakeRepository(StorageLocation.Cloud);
  service = DeckService.resetForTests({ auth, local, cloud: () => cloud });
});

describe("DeckService", () => {
  test("getInstance always returns the same instance", () => {
    expect(DeckService.getInstance()).toBe(service);
    expect(DeckService.getInstance()).toBe(DeckService.getInstance());
  });

  test("starts with only local storage when logged out", () => {
    expect(service.getLocations()).toEqual([StorageLocation.Local]);
  });

  test("adds the cloud repository on login and removes it on logout", () => {
    const listener = jest.fn();
    service.subscribe(listener);

    auth.setUser(user);
    expect(service.getLocations()).toEqual([
      StorageLocation.Local,
      StorageLocation.Cloud,
    ]);
    expect(listener).toHaveBeenCalledTimes(1);

    auth.setUser(null);
    expect(service.getLocations()).toEqual([StorageLocation.Local]);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  test("returns the same locations array until it changes", () => {
    const before = service.getLocations();
    expect(service.getLocations()).toBe(before);

    auth.setUser(user);
    expect(service.getLocations()).not.toBe(before);
  });

  test("routes saves by storage location and bumps the version", async () => {
    auth.setUser(user);
    const version = service.getVersion();
    const localDeck = makeDeck(StorageLocation.Local);
    const cloudDeck = makeDeck(StorageLocation.Cloud);

    await service.save(localDeck);
    await service.save(cloudDeck);

    expect(local.decks.has(localDeck.id)).toBe(true);
    expect(cloud.decks.has(cloudDeck.id)).toBe(true);
    expect(service.getVersion()).toBe(version + 2);
  });

  test("removes the old copy when a deck moves location", async () => {
    auth.setUser(user);
    const deck = makeDeck(StorageLocation.Local);
    await service.save(deck);

    await service.save(
      deck.update({ storage: StorageLocation.Cloud }),
      StorageLocation.Local,
    );

    expect(local.decks.has(deck.id)).toBe(false);
    expect(cloud.decks.has(deck.id)).toBe(true);
  });

  test("refuses to save to the cloud while logged out", async () => {
    await expect(service.save(makeDeck(StorageLocation.Cloud))).rejects.toThrow(
      'No access to "cloud" storage.',
    );
  });

  test("lists decks from every repository, newest first", async () => {
    auth.setUser(user);
    const older = makeDeck(StorageLocation.Local, 1);
    const newer = makeDeck(StorageLocation.Cloud, 2);
    await service.save(older);
    await service.save(newer);

    expect((await service.list()).map((d) => d.id)).toEqual([
      newer.id,
      older.id,
    ]);
  });

  test("imports decks as new decks owned by the current user", async () => {
    auth.setUser(user);
    const file = new File(
      [
        JSON.stringify({
          version: 1,
          decks: [
            {
              name: "Imported",
              cards: [
                {
                  type: "definition",
                  question: { format: "plain", source: "Q" },
                  answer: { format: "plain", source: "A" },
                },
              ],
            },
          ],
        }),
      ],
      "decks.json",
    );

    const result = await service.importDecks(file, StorageLocation.Local);

    expect(result.errors).toEqual([]);
    const [saved] = [...local.decks.values()];
    expect(saved.name).toBe("Imported");
    expect(saved.belongs_to).toBe(user.id);
    expect(saved.storage).toBe(StorageLocation.Local);
  });

  test("rejects files in an unsupported format", async () => {
    const result = await service.importDecks(
      new File(["x"], "notes.txt"),
      StorageLocation.Local,
    );

    expect(result.decks).toEqual([]);
    expect(result.errors).toEqual([
      '"notes.txt" isn\'t a supported file (JSON).',
    ]);
    expect(local.decks.size).toBe(0);
  });
});
