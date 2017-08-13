const { assets } = global.serviceWorkerOption;

const CACHE_NAME = new Date().toISOString();

let assetsToCache = [...assets, './'];

assetsToCache = assetsToCache.map(path => new URL(path, global.location).toString());

self.addEventListener('install', (e) => {
  e.waitUntil(
    global.caches.open(CACHE_NAME).then(cache => cache.addAll(assetsToCache)).then(() => {
    }).catch((err) => {
      throw err;
    }),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    global.caches.keys().then(cacheNames => Promise.all(
      cacheNames.map((cacheName) => {
        if (cacheName.indexOf(CACHE_NAME) === 0) {
          return null;
        }
        return global.caches.delete(cacheName);
      }),
    )),
  );
});

self.addEventListener('message', (e) => {
  switch (e.data.action) {
    case 'skipWaiting':
    {
      if (self.skipWaiting) {
        self.skipWaiting();
        self.clients.claim();
      }
      break;
    }
    default:
    {
      break;
    }
  }
});

self.addEventListener('fetch', (e) => {
  const request = e.request;
  if (request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(request.url);

  if (requestUrl.origin !== location.origin) {
    return;
  }

  const resource = global.caches.match(request).then((response) => {
    if (response) {
      return response;
    }

    return fetch(request).then((responseNetwork) => {
      if (!responseNetwork || !responseNetwork.ok) {
        return responseNetwork;
      }

      const responseCache = responseNetwork.clone();

      global.caches.open(CACHE_NAME).then(cache => cache.put(request, responseCache));

      return responseNetwork;
    }).catch(() => {
      if (e.request.mode === 'navigate') {
        return global.caches.match('./');
      }
      return null;
    });
  });

  e.respondWith(resource);
});
