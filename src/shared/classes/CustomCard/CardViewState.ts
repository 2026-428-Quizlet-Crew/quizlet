import type { Json } from "../../types/Json";
import type { FlashcardData } from "@/shared/classes";
import type { GradeResult } from "@/shared/classes";
import type { RenderContext } from "@/shared/classes";

/**
 * Everything a custom card needs to draw one view, sent in each "render"
 * message. Switching on `view` narrows it, so e.g. `result` only exists on
 * the quiz back.
 */
export type CardViewState<
  C extends Json = Json,
  A extends Json = Json,
  R extends Json = Json,
> =
  | { view: "edit"; data: FlashcardData<C, A>; ctx: RenderContext }
  | { view: "studyFront"; data: FlashcardData<C, A>; ctx: RenderContext }
  | { view: "studyBack"; data: FlashcardData<C, A>; ctx: RenderContext }
  | {
      view: "quizFront";
      data: FlashcardData<C, A>;
      response: R;
      ctx: RenderContext;
    }
  | {
      view: "quizBack";
      data: FlashcardData<C, A>;
      response: R;
      result: GradeResult;
      ctx: RenderContext;
    };

export type CardView = CardViewState["view"];
