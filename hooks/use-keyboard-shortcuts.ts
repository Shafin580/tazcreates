"use client";

import { useEffect, useCallback } from "react";

export type KeyCombo = {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
};

export type ShortcutHandler = () => void;

export type ShortcutConfig = {
  combo: KeyCombo;
  handler: ShortcutHandler;
  description: string;
  enabled?: boolean;
};

/**
 * Hook for registering keyboard shortcuts.
 * Shortcuts are disabled when focus is inside an input/textarea/select.
 *
 * Usage:
 * ```
 * useKeyboardShortcuts([
 *   { combo: { key: "n", ctrl: true }, handler: () => openNew(), description: "New item" },
 *   { combo: { key: "s", ctrl: true }, handler: () => save(), description: "Save" },
 * ]);
 * ```
 */
export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      if (tagName === "input" || tagName === "textarea" || tagName === "select" || target.isContentEditable) {
        return;
      }

      for (const shortcut of shortcuts) {
        if (shortcut.enabled === false) continue;

        const { combo } = shortcut;
        const ctrlMatch = combo.ctrl ? (event.ctrlKey || event.metaKey) : !(event.ctrlKey || event.metaKey);
        const shiftMatch = combo.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = combo.alt ? event.altKey : !event.altKey;

        if (event.key.toLowerCase() === combo.key.toLowerCase() && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault();
          shortcut.handler();
          return;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
