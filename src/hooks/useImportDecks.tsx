"use client";

import { useCallback } from "react";
import { DeckService } from "@/service";
import type { ImportResult } from "@/shared/classes";
import type { StorageLocation } from "@/shared/types/StorageLocation";

/**
 * Returns a function that imports every readable deck in `file` into
 * `storage`, owned by the current user. Unreadable decks come back in `errors`.
 */
export const useImportDecks = () =>
  useCallback(
    (file: File, storage: StorageLocation): Promise<ImportResult> =>
      DeckService.getInstance().importDecks(file, storage),
    [],
  );
