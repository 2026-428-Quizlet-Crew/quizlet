"use client";

import { useEffect } from "react";

/** Maps `KeyboardEvent.key` values (e.g. " ", "ArrowLeft") to actions. */
export type KeyboardShortcuts = Partial<Record<string, () => void>>;

const isTextEntry = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

/**
 * Binds window-level shortcuts. Ignored while typing in a form field.
 * Pass a memoized object so listeners aren't re-bound on every render.
 */
export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handles = (event: KeyboardEvent) =>
      !isTextEntry(event.target) &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      shortcuts[event.key] !== undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (!handles(event)) return;
      event.preventDefault();
      if (!event.repeat) shortcuts[event.key]?.();
    };

    // A focused button activates on Space keyup; cancel it so the shortcut
    // doesn't fire twice (e.g. flipping the card and clicking "next").
    const onKeyUp = (event: KeyboardEvent) => {
      if (handles(event)) event.preventDefault();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [shortcuts]);
};
