import { CardType, isCardType } from "./CardType";
import type { CardDto } from "./CardDto";
import type { CardContent } from "../content/CardContent";
import { CardContentFactory } from "../content/CardContentFactory";
import { newId, type UUID } from "@/types/UUID";
import { Card } from "./Card";

export class BaseCard implements Card {
  readonly id: UUID;
  readonly question: CardContent;
  readonly answer: CardContent;
  readonly type: CardType;

  constructor({ id, question, answer, type }: Card) {
    this.id = id;
    this.question = question;
    this.answer = answer;
    this.type = type;
  }

  static create(
    question: CardContent,
    answer: CardContent,
    type: CardType = CardType.Definition,
  ): BaseCard {
    return new BaseCard({ id: newId(), question, answer, type });
  }

  static fromDto(dto: CardDto): BaseCard {
    return new BaseCard({
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
