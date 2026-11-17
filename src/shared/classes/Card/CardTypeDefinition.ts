import type { Json } from "../../types/Json";
import type { Flashcard } from "./Flashcard";
import type { CardTypeId, FlashcardData } from "./FlashcardData";

/**
 * A kind of card (e.g. "Select all that apply"), as opposed to one card. Covers
 * everything needed before a {@link Flashcard} exists. There is one per card
 * type; built-ins are written by hand, and every custom type shares a generic
 * one built from its manifest.
 */
export interface CardTypeDefinition<
  C extends Json = Json,
  A extends Json = Json,
  R extends Json = Json,
> {
  readonly id: CardTypeId;
  readonly version: number;
  readonly label: string;
  readonly description: string;
  readonly builtIn: boolean;

  createEmpty(): Promise<FlashcardData<C, A>>;
  fromData(data: FlashcardData<C, A>): Flashcard<C, A, R>;
  migrate?(
    data: FlashcardData,
    fromVersion: number,
  ): Promise<FlashcardData<C, A>>;
}
