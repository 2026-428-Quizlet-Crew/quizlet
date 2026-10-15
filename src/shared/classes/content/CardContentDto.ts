import type { ContentFormat } from "./ContentFormat";

/** Data transfer object for a {@link CardContent}: what gets stored or sent to the backend. */
export interface CardContentDto {
  format: ContentFormat;
  source: string;
}
