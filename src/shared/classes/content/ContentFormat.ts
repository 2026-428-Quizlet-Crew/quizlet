/** How the source text of a question or answer should be parsed and rendered. */
export const ContentFormat = {
  Plain: "plain",
  Markdown: "markdown",
  Code: "code",
  Latex: "latex",
} as const;

export type ContentFormat = (typeof ContentFormat)[keyof typeof ContentFormat];

export interface ContentFormatInfo {
  label: string;
  /** Whether a real renderer exists yet. Unimplemented formats render their raw source. */
  implemented: boolean;
}

export const CONTENT_FORMAT_INFO: Record<ContentFormat, ContentFormatInfo> = {
  [ContentFormat.Plain]: { label: "Plain text", implemented: true },
  [ContentFormat.Markdown]: { label: "Markdown", implemented: false },
  [ContentFormat.Code]: { label: "Code", implemented: false },
  [ContentFormat.Latex]: { label: "LaTeX", implemented: false },
};

export const CONTENT_FORMATS: readonly ContentFormat[] =
  Object.values(ContentFormat);

export const isContentFormat = (value: unknown): value is ContentFormat =>
  CONTENT_FORMATS.includes(value as ContentFormat);
