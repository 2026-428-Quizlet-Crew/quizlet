"use client";

import { useCallback, useEffect, useState } from "react";
import type { BaseDeck } from "@/shared/classes";
import { useDeckService } from "./useDeckService";

/** All decks the current user can see. `decks` is null while loading. */
export const useDeckList = () => {
  const service = useDeckService();
  const [decks, setDecks] = useState<BaseDeck[] | null>(null);

  const reload = useCallback(() => service.list().then(setDecks), [service]);

  useEffect(() => {
    let cancelled = false;
    service.list().then((result) => {
      if (!cancelled) setDecks(result);
    });
    return () => {
      cancelled = true;
    };
  }, [service]);

  return { decks, reload };
};
