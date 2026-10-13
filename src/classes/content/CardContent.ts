import type { ReactNode } from "react";
import type { ContentFormat } from "@/classes";
import type { CardContentDto } from "./CardContentDto";

/**
 * One side of a card (question or answer). Subclasses decide how the raw
 * source is parsed and rendered, e.g. plain text, markdown, code, or LaTeX.
 */
export abstract class CardContent {
  abstract readonly format: ContentFormat;

  constructor(readonly source: string) {}

  abstract render(): ReactNode;

  isEmpty(): boolean {
    return this.source.trim().length === 0;
  }

  toDto(): CardContentDto {
    return { format: this.format, source: this.source };
  }

  /** Called by `JSON.stringify`, so stringifying content always yields its DTO. */
  toJSON(): CardContentDto {
    return this.toDto();
  }
}
