import type { User } from "@/shared/types/User";
import { Observable } from "../Observable";

/** Tracks who is logged in. Login is not implemented yet, so the user starts as null. */
// TODO: Replace with supabase logins?
export class AuthService extends Observable {
  private static instance: AuthService | null = null;

  private user: User | null = null;

  private constructor() {
    super();
  }

  /** The app-wide AuthService, created on first use. */
  static getInstance(): AuthService {
    AuthService.instance ??= new AuthService();
    return AuthService.instance;
  }

  /** Test seam: replaces the instance with a fresh one for the given user. */
  static resetForTests(user: User | null = null): AuthService {
    AuthService.instance = new AuthService();
    AuthService.instance.user = user;
    return AuthService.instance;
  }

  /** Arrow property so hooks can pass it straight to `useSyncExternalStore`. */
  getUser = (): User | null => this.user;

  /** Called by the login flow (once one exists) on sign-in and sign-out. */
  setUser(user: User | null): void {
    if (user === this.user) return;
    this.user = user;
    this.notify();
  }
}
