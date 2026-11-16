import { useEffect, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Cross-platform helpers                                            */
/* ------------------------------------------------------------------ */
const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPod|iPhone|iPad/.test(navigator.platform);
export const kbdGlyph = isMac ? "⌘" : "Ctrl";

export const formatHotkey = (hk: string): string =>
  hk
    ?.replace(/mod\+/i, kbdGlyph + "+")
    .replace(/\+/g, "+")
    .toUpperCase() ?? "";

export const normaliseHotkey = (hk: string): string =>
  hk.toLowerCase().replace(/mod\+/i, "ctrl+").replace(/\s+/g, "");

/* ------------------------------------------------------------------ */
/*  Hook: register global hotkeys                                     */
/* ------------------------------------------------------------------ */
export function useGlobalHotkeys(map: Map<string, () => void>) {
  const handler = useCallback(
    (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const combo =
        (e.metaKey || e.ctrlKey ? "ctrl+" : "") + e.key.toLowerCase();

      const exec = map.get(combo);
      if (exec) {
        e.preventDefault();
        exec();
      }
    },
    [map],
  );

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);
}
