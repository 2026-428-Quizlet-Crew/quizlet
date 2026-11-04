import type { CardContent } from "../content/CardContent";
import type { CardContentDto } from "@/shared/classes";
import { CardType } from "./CardType";
import type { UUID } from "../../types/UUID";

/**
 * Shape of a card. `C` is the content type: live {@link CardContent} instances
 * by default, or {@link CardContentDto} for the DTO.
 */
export interface Flashcard<
  C extends CardContent | CardContentDto = CardContent,
> {
  id: UUID;
  question: C;
  answer: C;
  type: CardType;
}
