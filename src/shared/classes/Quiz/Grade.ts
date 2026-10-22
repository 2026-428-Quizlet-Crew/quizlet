export type StarRating = 1 | 2 | 3 | 4 | 5;

export const STAR_RATINGS: readonly StarRating[] = [1, 2, 3, 4, 5];

/** How well a quiz answer went: right/wrong, or self-graded stars. */
export type Grade =
  { kind: "correct"; correct: boolean } | { kind: "stars"; stars: StarRating };

/** What the user typed for a card, and its grade once known. */
export interface CardResponse {
  answer: string;
  grade: Grade | null;
}
