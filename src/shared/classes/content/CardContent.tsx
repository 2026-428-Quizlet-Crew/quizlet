import type { ReactNode } from "react";
import type { ContentFormat } from "./ContentFormat";
import type { CardContentDto } from "./CardContentDto";

export interface ContentInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

/**
 * One side of a card (question or answer). Subclasses decide how the raw
 * source is parsed and rendered, e.g. plain text, markdown, code, or LaTeX.
 */
export abstract class CardContent {
  abstract readonly format: ContentFormat;

  constructor(readonly source: string) {}

  abstract render(): ReactNode;

  /**
   * Field for typing an answer in this format. Plain text by default;
   * subclasses can override it (e.g. a code editor).
   */
  renderInput({ value, onChange, label }: ContentInputProps): ReactNode {
    return (
      <input
        type="text"
        aria-label={label}
        autoComplete="off"
        autoFocus
        className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-base"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

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
