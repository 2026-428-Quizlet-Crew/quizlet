/** A problem with a card's data. The editor blocks saving until there are none. */
export type ValidationIssue = {
  /** Which part is wrong, e.g. "question" or "content.options[2]". */
  field: string;
  message: string;
};
