import type { CardDto } from "../Card/CardDto";
import type { IDeck } from "./Deck";

/** Data transfer object for a {@link Deck}: what gets stored or sent to the backend. */
export type DeckDto = IDeck<CardDto>;
