"use client";

import { useSyncExternalStore } from "react";
import { DeckService } from "@/service";

/**
 * A number that changes whenever decks may have changed (save, delete, import,
 * login or logout). Data hooks re-fetch when it changes.
 */
export const useDeckVersion = (): number => {
  const service = DeckService.getInstance();
  return useSyncExternalStore(
    service.subscribe,
    service.getVersion,
    service.getVersion,
  );
};
