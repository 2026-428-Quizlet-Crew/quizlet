import type { CardContentDto } from "../content/CardContentDto";
import type { ICard } from "./Card";

/** Data transfer object for a {@link Card}: what gets stored or sent to the backend. */
export type CardDto = ICard<CardContentDto>;
