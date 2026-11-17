import type { Json } from "../../types/Json";
import type { CardTypeId, FlashcardData } from "@/shared/classes";
import type { CardViewState } from "./CardViewState";

/**
 * Messages the host sends into a custom card's iframe. Every request carries a
 * `requestId`, and the card answers with a "result" message carrying the same
 * id.
 */
export type HostToCard =
  | { type: "render"; state: CardViewState }
  | { type: "createEmpty"; requestId: string }
  | { type: "emptyResponse"; requestId: string; content: Json }
  | {
      type: "grade";
      requestId: string;
      data: FlashcardData;
      response: Json;
    }
  | { type: "validate"; requestId: string; data: FlashcardData }
  | {
      type: "migrate";
      requestId: string;
      data: FlashcardData;
      fromVersion: number;
    };

/**
 * Messages a custom card's iframe may send out. The host validates each one and
 * ignores anything not on this list.
 */
export type CardToHost =
  | { type: "ready"; cardType: CardTypeId; version: number }
  | { type: "result"; requestId: string; ok: true; value: Json }
  | { type: "result"; requestId: string; ok: false; error: string }
  | { type: "responseChanged"; response: Json; complete: boolean }
  | { type: "dataChanged"; data: FlashcardData }
  | { type: "submitRequested" }
  | { type: "resize"; height: number }
  | { type: "error"; message: string };
