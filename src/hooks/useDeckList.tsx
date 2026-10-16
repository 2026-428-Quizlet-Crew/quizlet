"use client";

import { useEffect, useState } from "react";
import { DeckService } from "@/service";
import type { BaseDeck } from "@/shared/classes";
import { useDeckVersion } from "./useDeckVersion";

export const useDeckList = () => {
  const version = useDeckVersion();
  const [decks, setDecks] = useState<BaseDeck[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    DeckService.getInstance()
      .list()
      .then((result) => {
        if (!cancelled) setDecks(result);
      });
    return () => {
      cancelled = true;
    };
  }, [version]);

  return { decks };
};
