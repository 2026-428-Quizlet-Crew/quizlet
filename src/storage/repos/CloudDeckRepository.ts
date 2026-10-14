import type { User } from "@/auth/User";
import type { BaseDeck } from "@/classes";
import type { DeckRepository } from "./DeckRepository";
import { StorageLocation } from "../StorageLocation";

/** Placeholder for the future backend. Only constructed for logged-in users. */
// TODO: Connect to supabase
export class CloudDeckRepository implements DeckRepository {
  readonly location = StorageLocation.Cloud;

  constructor(private readonly user: User) {}

  async list(): Promise<BaseDeck[]> {
    throw this.notImplemented();
  }

  async get(): Promise<BaseDeck | null> {
    throw this.notImplemented();
  }

  async save(): Promise<void> {
    throw this.notImplemented();
  }

  async delete(): Promise<void> {
    throw this.notImplemented();
  }

  private notImplemented(): Error {
    return new Error(
      `Cloud storage is not implemented (user ${this.user.id}).`,
    );
  }
}
