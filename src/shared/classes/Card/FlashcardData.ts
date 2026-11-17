import type { Json } from "../../types/Json";
import type { UUID } from "../../types/UUID";

/** Key of a card type in the registry, e.g. "definition" or "select-all". */
export type CardTypeId = string;

/**
 * Data transfer object for a card: what gets stored in IndexedDB and exported.
 * `C` is the type's setup (options, blanks template, tolerance...) and `A` its
 * correct answer. Each card type picks both shapes.
 */
export type FlashcardData<C extends Json = Json, A extends Json = Json> = {
  id: UUID;
  type: CardTypeId;
  version: number;
  question: string;
  content: C;
  answer: A;
};
