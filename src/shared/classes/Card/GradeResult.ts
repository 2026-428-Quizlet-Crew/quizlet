/** How a quiz response went, as decided by the card's `grade`. */
export type GradeResult = {
  score: number;
  correct: boolean;
  feedback?: string;
  parts?: { correct: boolean; expected?: string }[];
};
