
'use client';

import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase';
import { useEffect } from 'react';
import { levels } from '@/lib/levels';
import { getImageUrl } from '@/lib/levels';
import { ThemeProvider } from '@/components/theme-provider';


// This is our "silent agent" for image pre-caching.
const ImageCacheAgent = () => {
  useEffect(() => {
    const cacheImages = async () => {
      if (typeof window !== 'undefined' && 'caches' in window) {
        try {
          const cacheName = 'image-cache-v1';
          const cache = await caches.open(cacheName);
          
          const gameRound = parseInt(localStorage.getItem('gameRound') || '0', 10);

          // Get all image URLs from our new centralized source
          const imageUrls = levels.flatMap(level => {
            // Generate all 4 variations for each level to pre-cache them all
            const urls = [];
            for (let i = 0; i < 4; i++) {
                urls.push(getImageUrl(level.imageId, i).url);
            }
            return urls;
          });
          
          const uniqueImageUrls = [...new Set(imageUrls)];

          // A loop with `cache.add` is more resilient than `cache.addAll`.
          for (const url of uniqueImageUrls) {
            try {
              // We use 'no-cors' because we are caching opaque responses from a third-party domain.
              // This is fine for images we just want to display.
              // We check if the image is already in cache to avoid re-fetching
              const match = await cache.match(url);
              if (!match) {
                await cache.add(new Request(url));
              }
            } catch (error) {
              // It's normal for some requests to fail if images don't exist, so we warn instead of error.
              console.warn(`Image caching agent failed for URL: ${url}`, error);
            }
          }
        } catch (error) {
          console.error('Image caching agent failed to open cache:', error);
        }
      }
    };

    // Give the main app a moment to load before starting the background cache
    const timer = setTimeout(() => {
        cacheImages();
    }, 2000); 

    return () => clearTimeout(timer);
  }, []); // Runs only once when the app layout mounts.

  return null; // This component renders nothing.
}


export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ImageCacheAgent />
      <FirebaseClientProvider>
        {children}
      </FirebaseClientProvider>
      <Toaster />
    </ThemeProvider>
  );
}
