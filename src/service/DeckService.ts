import {
  BaseDeck,
  DECK_FILE_FORMATS,
  formatForFile,
  type ImportResult,
} from "@/shared/classes";
import {
  CloudDeckRepository,
  type DeckRepository,
  LocalStorageDeckRepository,
} from "@/storage";
import { StorageLocation } from "@/shared/types/StorageLocation";
import type { User } from "@/shared/types/User";
import type { UUID } from "@/shared/types/UUID";
import { AuthService } from "./auth/AuthService";
import { Observable } from "./Observable";

/** What a DeckService is built from. Swappable in tests via {@link DeckService.resetForTests}. */
export interface DeckServiceDependencies {
  auth: AuthService;
  local: DeckRepository;
  cloud: (user: User) => DeckRepository;
}

const defaultDependencies = (): DeckServiceDependencies => ({
  auth: AuthService.getInstance(),
  local: new LocalStorageDeckRepository(),
  cloud: (user) => new CloudDeckRepository(user),
});

export class DeckService extends Observable {
  private static instance: DeckService | null = null;

  private readonly repositories = new Map<StorageLocation, DeckRepository>();
  private readonly createCloud: (user: User) => DeckRepository;
  private readonly auth: AuthService;
  private readonly unsubscribeAuth: () => void;
  private locations: readonly StorageLocation[] = [];
  private version = 0;

  private constructor({ auth, local, cloud }: DeckServiceDependencies) {
    super();
    this.auth = auth;
    this.createCloud = cloud;
    this.repositories.set(StorageLocation.Local, local);
    this.syncUser();
    this.unsubscribeAuth = auth.subscribe(() => this.syncUser());
  }

  static getInstance(): DeckService {
    // TODO: on the server this instance is shared by every request. That's fine
    DeckService.instance ??= new DeckService(defaultDependencies());
    return DeckService.instance;
  }

  /** Test seam: replaces the instance with one built from the given (fake) dependencies. */
  static resetForTests(
    overrides: Partial<DeckServiceDependencies> = {},
  ): DeckService {
    DeckService.instance?.unsubscribeAuth();
    DeckService.instance = new DeckService({
      ...defaultDependencies(),
      ...overrides,
    });
    return DeckService.instance;
  }

  getLocations = (): readonly StorageLocation[] => this.locations;

  getVersion = (): number => this.version;

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

  async save(deck: BaseDeck, previous?: StorageLocation): Promise<void> {
    await this.repository(deck.storage).save(deck);
    if (previous && previous !== deck.storage) {
      await this.repository(previous).delete(deck.id);
    }
    this.changed();
  }

  async delete(deck: BaseDeck): Promise<void> {
    await this.repository(deck.storage).delete(deck.id);
    this.changed();
  }

  async importDecks(
    file: File,
    storage: StorageLocation,
  ): Promise<ImportResult> {
    const format = formatForFile(file);
    if (!format) {
      const supported = DECK_FILE_FORMATS.map((f) => f.label).join(", ");
      return {
        decks: [],
        errors: [`"${file.name}" isn't a supported file (${supported}).`],
      };
    }

    const result = await format.import(file, {
      storage,
      belongs_to: this.auth.getUser()?.id ?? null,
    });
    const repo = this.repository(storage);
    for (const dto of result.decks) {
      await repo.save(BaseDeck.fromDto(dto));
    }
    if (result.decks.length > 0) this.changed();
    return result;
  }

  /** Adds the cloud repository on login and drops it on logout. */
  private syncUser(): void {
    const user = this.auth.getUser();
    if (user) {
      this.repositories.set(StorageLocation.Cloud, this.createCloud(user));
    } else {
      this.repositories.delete(StorageLocation.Cloud);
    }
    this.locations = [...this.repositories.keys()];
    this.changed();
  }

  private changed(): void {
    this.version++;
    this.notify();
  }

  private repository(location: StorageLocation): DeckRepository {
    const repo = this.repositories.get(location);
    if (!repo) throw new Error(`No access to "${location}" storage.`);
    return repo;
  }
}
