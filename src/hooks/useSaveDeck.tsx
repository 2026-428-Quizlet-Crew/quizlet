"use client";

import { useCallback } from "react";
import { DeckService } from "@/service";
import type { StorageLocation } from "@/shared/types/StorageLocation";
import { BaseDeck } from "@/shared/classes";

/** Returns a function that saves a deck to its `storage` location. Pass `previous` if the deck moved. */
export const useSaveDeck = () =>
  useCallback(
    (deck: BaseDeck, previous?: StorageLocation): Promise<void> =>
      DeckService.getInstance().save(deck, previous),
    [],
  );
