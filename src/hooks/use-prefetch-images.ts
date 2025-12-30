
import { useEffect } from "react";
import { levels } from "@/lib/levels";
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
  const arr = Array.from(set);
  localStorage.setItem(PREFETCH_KEY, JSON.stringify(arr));
}

export function usePrefetchNextImages(currentLevelIndex: number) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefetched = getPrefetchedIds();

    // Decide how many levels ahead to prefetch
    const PREFETCH_AHEAD = 5;

    const start = currentLevelIndex;
    const end = Math.min(levels.length, currentLevelIndex + PREFETCH_AHEAD);

    for (let i = start; i < end; i++) {
      const level = levels[i];
      if (!level) continue;

      if (!prefetched.has(level.imageId)) {
        const { url } = getImageUrl(level.imageId);

        // Preload into browser cache
        const img = new (window as any).Image();
        img.src = url;

        prefetched.add(level.imageId);
      }
    }

    savePrefetchedIds(prefetched);
  }, [currentLevelIndex]);
}
