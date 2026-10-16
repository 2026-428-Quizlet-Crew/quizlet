"use client";

import { useEffect, useState } from "react";
import { DeckService } from "@/service";
import type { BaseDeck } from "@/shared/classes";
import type { UUID } from "@/shared/types/UUID";
import { useDeckVersion } from "./useDeckVersion";

export type DeckState =
  | { status: "loading" }
  | { status: "missing" }
  | { status: "ready"; deck: BaseDeck };

export const useDeck = (id: UUID): DeckState => {
  const version = useDeckVersion();
  const [state, setState] = useState<DeckState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    DeckService.getInstance()
      .get(id)
      .then((deck) => {
        if (cancelled) return;
        setState(deck ? { status: "ready", deck } : { status: "missing" });
      });
    return () => {
      cancelled = true;
    };
  }, [id, version]);

  return state;
};
