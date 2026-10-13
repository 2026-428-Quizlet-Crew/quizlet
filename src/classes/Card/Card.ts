import { CardType, isCardType } from "./CardType";
import type { CardDto } from "./CardDto";
import type { CardContent } from "../content/CardContent";
import { CardContentFactory } from "../content/CardContentFactory";
import type { CardContentDto } from "../content/CardContentDto";
import { newId, type UUID } from "../types";

/**
 * Shape of a card. `C` is the content type: live {@link CardContent} instances
 * by default, or {@link CardContentDto} for the DTO.
 */
export interface ICard<C extends CardContent | CardContentDto = CardContent> {
  id: UUID;
  question: C;
  answer: C;
  type: CardType;
}

export class Card implements ICard {
  readonly id: UUID;
  readonly question: CardContent;
  readonly answer: CardContent;
  readonly type: CardType;

  constructor({ id, question, answer, type }: ICard) {
    this.id = id;
    this.question = question;
    this.answer = answer;
    this.type = type;
  }

  static create(
    question: CardContent,
    answer: CardContent,
    type: CardType = CardType.Definition,
  ): Card {
    return new Card({ id: newId(), question, answer, type });
  }

  static fromDto(dto: CardDto): Card {
    return new Card({
      id: dto.id,
      question: CardContentFactory.fromDto(dto.question),
      answer: CardContentFactory.fromDto(dto.answer),
      type: isCardType(dto.type) ? dto.type : CardType.Definition,
    });
  }

  toDto(): CardDto {
    return {
      id: this.id,
      question: this.question.toDto(),
      answer: this.answer.toDto(),
      type: this.type,
    };
  }

  /** Called by `JSON.stringify`, so stringifying a card always yields its DTO. */
  toJSON(): CardDto {
    return this.toDto();
  }
}
