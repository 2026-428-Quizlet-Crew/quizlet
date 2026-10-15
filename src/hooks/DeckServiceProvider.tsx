"use client";

import { createContext, useMemo, type ReactNode } from "react";
import { useCurrentUser } from "@/auth/AuthProvider";
import { CloudDeckRepository } from "@/storage";
import type { DeckRepository } from "@/storage";
import { DeckService } from "@/service";
import { LocalStorageDeckRepository } from "@/storage";

export const DeckServiceContext = createContext<DeckService | null>(null);

/** Builds the repositories the current user may use: local always, cloud only when logged in. */
export const DeckServiceProvider = ({ children }: { children: ReactNode }) => {
  const user = useCurrentUser();

  const service = useMemo(() => {
    const repositories: DeckRepository[] = [new LocalStorageDeckRepository()];
    if (user) repositories.push(new CloudDeckRepository(user));
    return new DeckService(repositories);
  }, [user]);

  return <DeckServiceContext value={service}>{children}</DeckServiceContext>;
};
