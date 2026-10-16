"use client";

import { useCallback } from "react";
import { DeckService } from "@/service";
import type { BaseDeck } from "@/shared/classes";

/** Returns a function that deletes a deck from wherever it is stored. */
export const useDeleteDeck = () =>
  useCallback(
    (deck: BaseDeck): Promise<void> => DeckService.getInstance().delete(deck),
    [],
  );
