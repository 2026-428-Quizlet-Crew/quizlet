import type { CardContentDto } from "@/shared/classes";

import { Flashcard } from "./Flashcard";

/** Data transfer object for a {@link Flashcard}: what gets stored or sent to the backend. */
export type FlashcardDto = Flashcard<CardContentDto>;
