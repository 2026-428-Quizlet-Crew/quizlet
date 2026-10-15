"use client";

import { useContext } from "react";
import type { DeckService } from "@/service";
import { DeckServiceContext } from "./DeckServiceProvider";

export const useDeckService = (): DeckService => {
  const service = useContext(DeckServiceContext);
  if (!service) {
    throw new Error(
      "useDeckService must be used inside a DeckServiceProvider.",
    );
  }
  return service;
};
