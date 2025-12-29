
// src/hooks/useLandmarkImages.ts
"use client";

import { useEffect, useState, useCallback } from "react";

export function useLandmarkImages(place: string) {
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!place) return;

      setLoading(true);
      setError(null);
      setImages([]);
      setIndex(0);

      try {
        const res = await fetch(
          `/api/landmark-images?title=${encodeURIComponent(place)}&limit=15`
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }
        const data = await res.json();

        if (!cancelled) {
          if (Array.isArray(data.images) && data.images.length > 0) {
            setImages(data.images);
          } else {
            setError("No images found for this landmark.");
          }
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message || "Failed to load images.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [place]);

  const nextImage = useCallback(() => {
    setIndex((prev) => {
      if (images.length === 0) return prev;
      return (prev + 1) % images.length;
    });
  }, [images.length]);

  const currentImage = images.length > 0 ? images[index] : null;

  return { currentImage, nextImage, loading, error, hasImages: images.length > 0 };
}
