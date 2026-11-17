import type { ReactNode } from "react";
import type { Json } from "../../types/Json";
import type { UUID } from "../../types/UUID";
import type { CardTypeId, FlashcardData } from "./FlashcardData";
import type { GradeResult } from "./GradeResult";
import type { RenderContext } from "./RenderContext";
import type { ValidationIssue } from "@/shared/classes";

/**
 * One card, as the runners and the editor see it. Built-in cards implement this
 * directly in React; custom cards are wrapped by an adapter that forwards each
 * call into their iframe, which is why everything except rendering is async.
 *
 * `C` and `A` are the card type's content and answer shapes (see
 * {@link FlashcardData}); `R` is what the student submits in a quiz.
 */
export interface Flashcard<
  C extends Json = Json,
  A extends Json = Json,
  R extends Json = Json,
> {
  readonly id: UUID;
  readonly type: CardTypeId;
  /** Plain text, for the deck list, search and screen readers. */
  readonly question: string;

  renderEdit(props: EditProps<C, A>): ReactNode;
  renderStudyFront(props: StudyProps): ReactNode;
  renderStudyBack(props: StudyProps): ReactNode;
  renderQuizFront(props: QuizFrontProps<R>): ReactNode;
  renderQuizBack(props: QuizBackProps<R>): ReactNode;

  /** The runner's starting draft, before the student touches the input. */
  emptyResponse(): Promise<R>;
  grade(response: R): Promise<GradeResult>;
  validate(): Promise<ValidationIssue[]>;
  /** The card as stored and exported. */
  toData(): FlashcardData<C, A>;
}

// Callbacks in the props below use method syntax on purpose. TypeScript checks
// methods' parameters loosely, which lets a card with specific shapes still fit
// in a registry typed with the Json defaults. Arrow-function properties would
// reject it.

/** The editor owns the draft; the card shows it and reports edits. */
export interface EditProps<C extends Json, A extends Json> {
  value: FlashcardData<C, A>;
  onChange(data: FlashcardData<C, A>): void;
  ctx: RenderContext;
}

export interface StudyProps {
  ctx: RenderContext;
}

/** The runner owns the draft response and the Submit button. */
export interface QuizFrontProps<R extends Json> {
  response: R;
  /** `complete` tells the runner whether Submit can be enabled. */
  onChange(response: R, complete: boolean): void;
  /** E.g. Enter pressed in the input. The runner decides whether to submit. */
  onSubmitRequest(): void;
  ctx: RenderContext;
}

export interface QuizBackProps<R extends Json> {
  response: R;
  result: GradeResult;
  ctx: RenderContext;
}
