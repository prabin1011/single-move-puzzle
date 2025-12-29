
'use client';

import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase';
import { useEffect } from 'react';
import { levels } from '@/lib/levels';

// This is our "silent agent" for image pre-caching.
const ImageCacheAgent = () => {
  useEffect(() => {
    const cacheImages = async () => {
      if ('caches' in window) {
        try {
          const cacheName = 'image-cache-v1';
          const cache = await caches.open(cacheName);
          const imageUrls = levels.map(level => level.image.url);
          
          // A loop with `cache.add` is more resilient than `cache.addAll`.
          for (const url of imageUrls) {
            // `add` fetches and caches. If the request is already in the cache, it's a no-op.
            try {
              await cache.add(url);
            } catch (error) {
              console.error(`Image caching agent failed for URL: ${url}`, error);
            }
          }
        } catch (error) {
          console.error('Image caching agent failed to open cache:', error);
        }
      }
    };

    cacheImages();
  }, []); // Runs only once when the app layout mounts.

  return null; // This component renders nothing.
}


export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ImageCacheAgent />
      <FirebaseClientProvider>
        {children}
      </FirebaseClientProvider>
      <Toaster />
    </>
  );
}
