import type { CardContent } from "../content/CardContent";
import type { CardContentDto } from "../content/CardContentDto";
import { CardType } from "./CardType";
import type { UUID } from "@/types/UUID";

/**
 * Shape of a card. `C` is the content type: live {@link CardContent} instances
 * by default, or {@link CardContentDto} for the DTO.
 */
export interface Card<C extends CardContent | CardContentDto = CardContent> {
  id: UUID;
  question: C;
  answer: C;
  type: CardType;
}
