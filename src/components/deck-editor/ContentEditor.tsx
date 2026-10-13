"use client";

import {
  type CardContentDto,
  CONTENT_FORMAT_INFO,
  CONTENT_FORMATS,
  type ContentFormat,
} from "@/classes";

interface ContentEditorProps {
  label: string;
  value: CardContentDto;
  onChange: (value: CardContentDto) => void;
}

/** Edits one side of a card: its format and raw source. */
const ContentEditor = ({ label, value, onChange }: ContentEditorProps) => {
  return (
    <div className="flex flex-1 flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </span>
        <select
          aria-label={`${label} format`}
          className="rounded border border-slate-300 bg-white px-1 py-0.5 text-xs"
          value={value.format}
          onChange={(e) =>
            onChange({ ...value, format: e.target.value as ContentFormat })
          }
        >
          {CONTENT_FORMATS.map((format) => {
            const info = CONTENT_FORMAT_INFO[format];
            return (
              <option key={format} value={format} disabled={!info.implemented}>
                {info.label}
                {info.implemented ? "" : " (coming soon)"}
              </option>
            );
          })}
        </select>
      </div>
      <textarea
        aria-label={label}
        className="min-h-20 rounded-md border border-slate-300 bg-white p-2 text-sm"
        value={value.source}
        onChange={(e) => onChange({ ...value, source: e.target.value })}
      />
    </div>
  );
};

export default ContentEditor;
