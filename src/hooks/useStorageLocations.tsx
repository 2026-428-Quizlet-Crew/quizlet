"use client";

import { useSyncExternalStore } from "react";
import { DeckService } from "@/service";
import type { StorageLocation } from "@/shared/types/StorageLocation";

/**
 * Where the current user can save decks, in display order. Cloud only appears
 * while logged in; re-renders on login and logout.
 */
export const useStorageLocations = (): readonly StorageLocation[] => {
  const service = DeckService.getInstance();
  return useSyncExternalStore(
    service.subscribe,
    service.getLocations,
    service.getLocations,
  );
};
