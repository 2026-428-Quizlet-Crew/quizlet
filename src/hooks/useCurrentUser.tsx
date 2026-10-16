"use client";

import { useSyncExternalStore } from "react";
import { AuthService } from "@/service";
import type { User } from "@/shared/types/User";

/** The logged-in user, or null. Re-renders on login and logout. */
export const useCurrentUser = (): User | null => {
  const auth = AuthService.getInstance();
  return useSyncExternalStore(auth.subscribe, auth.getUser, auth.getUser);
};
