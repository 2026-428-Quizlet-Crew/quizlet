import type { CardTypeId } from "@/shared/classes";

/**
 * Describes a custom card type. Ships in the export next to the type's bundle,
 * so the host can list, install and version-check a type without running any
 * of its code.
 */
export type CustomCardManifest = {
  id: CardTypeId;
  version: number;
  label: string;
  description: string;
  /** Path to the type's HTML/JS bundle inside the export. */
  entry: string;
  /** Iframe height to reserve before the card reports its real height. */
  minHeight?: number;
};
