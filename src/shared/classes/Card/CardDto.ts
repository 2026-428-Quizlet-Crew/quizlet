import type { CardContentDto } from "../content/CardContentDto";

import { Card } from "./Card";

/** Data transfer object for a {@link Card}: what gets stored or sent to the backend. */
export type CardDto = Card<CardContentDto>;
