import type { FlashcardDto } from "@/shared/classes/Flashcard/FlashcardDto";

import { Deck } from "./Deck";

/** Data transfer object for a {@link Deck}: what gets stored or sent to the backend. */
export type DeckDto = Deck<FlashcardDto>;
