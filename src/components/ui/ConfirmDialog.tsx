"use client";

import { buttonStyles } from "./buttonStyles";

interface ConfirmDialogProps {
  /** The question shown to the user, e.g. "Delete "Biology"?" */
  message: string;
  /** Label for the destructive action button. Defaults to "Delete". */
  confirmLabel?: string;
  /** Called when the user confirms the action. */
  onConfirm: () => void;
  /** Called when the user cancels. */
  onCancel: () => void;
}

/** A modal confirmation dialog that replaces `window.confirm`. */
const ConfirmDialog = ({
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    onClick={onCancel}
    role="alertdialog"
    aria-modal="true"
    aria-label={message}
  >
    <div
      className="mx-4 flex max-w-sm flex-col gap-4 rounded-lg bg-white p-6 shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="text-sm text-slate-800">{message}</p>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className={buttonStyles.secondary}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={buttonStyles.danger}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmDialog;
