import type { BaseFlashcard } from "@/shared/classes/Flashcard/BaseFlashcard";
import { CardType } from "@/shared/classes/Flashcard/CardType";
import type { Grade } from "./Grade";
import { Flashcard } from "@/shared/classes/Flashcard/Flashcard";

const normalize = (text: string): string =>
  text.trim().replace(/\s+/g, " ").toLowerCase();

export abstract class CardGrader {
  abstract readonly kind: Grade["kind"];
  abstract readonly quizzable: boolean;

  // Grade right after submitting, or `null` when the user grades themselves. TODO: Update when Connor's AI model is used for concept grading
  abstract autoGrade(card: Flashcard, answer: string): Grade | null;

  abstract isMissed(grade: Grade): boolean;
}

export class DefinitionGrader extends CardGrader {
  readonly kind = "correct";
  readonly quizzable = true;

  autoGrade(card: BaseFlashcard, answer: string): Grade {
    return {
      kind: "correct",
      correct: normalize(answer) === normalize(card.answer.source),
    };
  }

  isMissed(grade: Grade): boolean {
    return grade.kind === "correct" && !grade.correct;
  }
}

export class ConceptGrader extends CardGrader {
  readonly kind = "stars";
  readonly quizzable = true;

  autoGrade(): null {
    return null;
  }

  isMissed(grade: Grade): boolean {
    return grade.kind === "stars" && grade.stars <= 2;
  }
}

// TODO: May not be implemented. Left out of quizzes until it is.
export class FunctionGrader extends CardGrader {
  readonly kind = "correct";
  readonly quizzable = false;

  autoGrade(): null {
    return null;
  }

  isMissed(): boolean {
    return false;
  }
}

export const CARD_GRADERS: Record<CardType, CardGrader> = {
  [CardType.Definition]: new DefinitionGrader(),
  [CardType.Concept]: new ConceptGrader(),
  [CardType.Function]: new FunctionGrader(),
};
