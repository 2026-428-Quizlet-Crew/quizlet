import type { Json } from "../../types/Json";
import type { FlashcardData } from "@/shared/classes";
import type { GradeResult } from "@/shared/classes";
import type { ValidationIssue } from "@/shared/classes";
import type { CardViewState } from "./CardViewState";

/**
 * What a custom card type's author writes. It runs inside the iframe, where a
 * small runtime turns host messages into calls on it. Nothing is kept between
 * calls, so each one receives the data it needs.
 */
export interface CustomCardModule<
  C extends Json = Json,
  A extends Json = Json,
  R extends Json = Json,
> {
  createEmpty(): Pick<FlashcardData<C, A>, "question" | "content" | "answer">;
  render(
    root: HTMLElement,
    state: CardViewState<C, A, R>,
    actions: CardActions<C, A, R>,
  ): void;
  unmount?(root: HTMLElement): void;
  emptyResponse(content: C): R;
  isComplete(content: C, response: R): boolean;
  grade(
    data: FlashcardData<C, A>,
    response: R,
  ): GradeResult | Promise<GradeResult>;
  validate(data: FlashcardData<C, A>): ValidationIssue[];
  migrate?(data: FlashcardData, fromVersion: number): FlashcardData<C, A>;
}

/**
 * The only way a custom card can reach the host. The runtime provides these;
 * each one posts a single message from the fixed protocol.
 */
export interface CardActions<C extends Json, A extends Json, R extends Json> {
  setResponse(response: R): void;
  setData(data: FlashcardData<C, A>): void;
  requestSubmit(): void;
}
