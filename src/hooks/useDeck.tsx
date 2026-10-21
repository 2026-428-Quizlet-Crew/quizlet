"use client";

import { useEffect, useState } from "react";
import { DeckService } from "@/service";
import type { BaseDeck } from "@/shared/classes";
import type { UUID } from "@/shared/types/UUID";
import { useDeckVersion } from "./useDeckVersion";

export type DeckResult =
    | { status: "missing" }
    | { status: "error"; message: string }
    | { status: "ready"; deck: BaseDeck };

export type DeckState = { status: "loading" } | DeckResult;

export const useDeck = (id: UUID): DeckState => {
  const version = useDeckVersion();
  const [result, setResult] = useState<{
    id: UUID;
    version: number;
    state: DeckResult;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadDeck = async () => {
      let state: DeckResult;
      try {
        const deck = await DeckService.getInstance().get(id);
        state = deck ? { status: "ready", deck } : { status: "missing" };
      } catch (error) {
        state = {
          status: "error",
          message: error instanceof Error ? error.message : String(error),
        };
      }
      if (!cancelled) setResult({ id, version, state });
    };

    loadDeck();

    return () => {
      cancelled = true;
    };
  }, [id, version]);

  return result?.id === id && result.version === version
      ? result.state
      : { status: "loading" };
};
