
'use client';

import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase';
import { useEffect } from 'react';
import { levels } from '@/lib/levels';
import { getImageUrl } from '@/lib/levels';


// This is our "silent agent" for image pre-caching.
const ImageCacheAgent = () => {
  useEffect(() => {
    const cacheImages = async () => {
      if ('caches' in window) {
        try {
          const cacheName = 'image-cache-v1';
          const cache = await caches.open(cacheName);
          // Get all image URLs from our new centralized source
          const imageUrls = levels.flatMap(level => {
            // Generate all 4 variations for each level
            const urls = [];
            for (let i = 0; i < 4; i++) {
                urls.push(getImageUrl(level.imageId, i).url);
            }
            return urls;
          });
          
          const uniqueImageUrls = [...new Set(imageUrls)];

          // A loop with `cache.add` is more resilient than `cache.addAll`.
          for (const url of uniqueImageUrls) {
            // `add` fetches and caches. If the request is already in the cache, it's a no-op.
            try {
              // We use 'no-cors' because we are caching opaque responses from a third-party domain.
              // This is fine for images we just want to display.
              await cache.add(new Request(url));
            } catch (error) {
              console.warn(`Image caching agent failed for URL: ${url}`, error);
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
