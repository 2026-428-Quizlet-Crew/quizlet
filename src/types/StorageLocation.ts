/** Where a deck is persisted. */
export const StorageLocation = {
  Local: "local",
  Cloud: "cloud",
} as const;

export type StorageLocation =
  (typeof StorageLocation)[keyof typeof StorageLocation];

export interface StorageLocationInfo {
  saveLabel: string;
  label: string;
  requiresAuth: boolean;
}

export const STORAGE_LOCATION_INFO: Record<
  StorageLocation,
  StorageLocationInfo
> = {
  [StorageLocation.Local]: {
    saveLabel: "Save locally",
    label: "Local",
    requiresAuth: false,
  },
  [StorageLocation.Cloud]: {
    saveLabel: "Save on the cloud",
    label: "Cloud",
    requiresAuth: true,
  },
};
