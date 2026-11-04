import { CardType, isCardType } from "./CardType";
import type { FlashcardDto } from "./FlashcardDto";
import type { CardContent } from "../content/CardContent";
import { CardContentFactory } from "../content/CardContentFactory";
import { type UUID } from "../../types/UUID";
import { Flashcard } from "./Flashcard";

export class BaseFlashcard implements Flashcard {
  readonly id: UUID;
  readonly question: CardContent;
  readonly answer: CardContent;
  readonly type: CardType;

  constructor({ id, question, answer, type }: Flashcard) {
    this.id = id;
    this.question = question;
    this.answer = answer;
    this.type = type;
  }

  static fromDto(dto: FlashcardDto): BaseFlashcard {
    return new BaseFlashcard({
      id: dto.id,
      question: CardContentFactory.fromDto(dto.question),
      answer: CardContentFactory.fromDto(dto.answer),
      type: isCardType(dto.type) ? dto.type : CardType.Definition,
    });
  }

  toDto(): FlashcardDto {
    return {
      id: this.id,
      question: this.question.toDto(),
      answer: this.answer.toDto(),
      type: this.type,
    };
  }

  /** Called by `JSON.stringify`, so stringifying a card always yields its DTO. */
  toJSON(): FlashcardDto {
    return this.toDto();
  }
}
