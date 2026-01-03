
const CACHE_NAME = 'one-move-puzzle-cache-v1';
const urlsToCache = [
  '/',
  '/play',
  '/manifest.json',
  '/favicon.ico',
  '/logo.png',
  '/logo-192.png',
  '/logo-512.png',
  '/sounds/click.wav',
  '/sounds/ui.wav',
  '/sounds/success.wav',
  '/sounds/fail.wav',
  '/sounds/win.wav',
  '/sounds/start.wav',
  '/sounds/preview_done.wav',
  '/sounds/swap.wav',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // AddAll can fail if one of the resources fails to be fetched.
        // For a more robust solution, fetch and cache one by one.
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it's a stream and can only be consumed once.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
