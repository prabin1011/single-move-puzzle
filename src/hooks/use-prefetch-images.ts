
import { useEffect } from "react";
import type { Level } from "@/lib/levels";
import { getImageUrl } from "@/lib/levels";

const PREFETCH_KEY = "landmark-prefetched-ids";

function getPrefetchedIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(PREFETCH_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function savePrefetchedIds(set: Set<string>) {
  if (typeof window === "undefined") return;
  const arr = Array.from(set);
  localStorage.setItem(PREFETCH_KEY, JSON.stringify(arr));
}

export function usePrefetchNextImages(currentLevelIndex: number, levels: Level[]) {
  useEffect(() => {
    if (typeof window === "undefined" || levels.length === 0) return;

    const prefetched = getPrefetchedIds();
    const gameRound = parseInt(localStorage.getItem('gameRound') || '0', 10);

    // Decide how many levels ahead to prefetch
    const PREFETCH_AHEAD = 5;

    const start = currentLevelIndex;
    const end = Math.min(levels.length, currentLevelIndex + PREFETCH_AHEAD);

    for (let i = start; i < end; i++) {
      const level = levels[i];
      if (!level) continue;

      // The identifier should be unique per image variation
      const imageIdentifier = `${level.imageId}-r${gameRound}`;

      if (!prefetched.has(imageIdentifier)) {
        // We now get the URL from the centralized getImageUrl function
        const { url } = getImageUrl(level.imageId, level.variations, gameRound);

        // Preload into browser cache
        const img = new (window as any).Image();
        img.src = url;

        prefetched.add(imageIdentifier);
      }
    }

    savePrefetchedIds(prefetched);
  }, [currentLevelIndex, levels]);
}
