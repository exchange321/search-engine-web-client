const { assets } = global.serviceWorkerOption;

const CACHE_NAME = new Date().toISOString();

let assetsToCache = [...assets, './'];

const delay = 100;

let query = '';
let visited = [];
let whitelist = [];
let blacklist = [];

const pushNotification = () => {
  setTimeout(() => {
    self.registration.showNotification('ASE Search', {
      dir: 'ltr',
      lang: 'en-US',
      body: 'Are you satisfied with the content? (Click me to snooze)',
      tag: 'ASE',
      badge: '/images/favicon/icon_96x96.png',
      icon: '/images/favicon/icon_96x96.png',
      renotify: true,
      requireInteraction: true,
      actions: [
        {
          action: 'more',
          title: 'Yes! But I need more!',
          icon: 'https://cdn.shopify.com/s/files/1/1061/1924/products/Heart_Eyes_Emoji_large.png?v=1480481053',
        },
        {
          action: 'no',
          title: 'No... I need others...',
          icon: 'http://icons.iconarchive.com/icons/designbolts/emoji/512/Emoji-Consoling-icon.png',
        },
      ],
      silent: false,
      vibrate: [200, 100, 200],
    });
  }, delay);
};

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
    case 'skipWaiting': {
      if (self.skipWaiting) {
        self.skipWaiting();
        self.clients.claim();
      }
      break;
    }
    case 'root': {
      const { query: q, result } = e.data.info;
      query = q;
      visited = [result.url];
      whitelist = [];
      blacklist = [];
      pushNotification();
      break;
    }
    default: {
      break;
    }
  }
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  switch (e.action) {
    case 'more' : {
      console.log('More!!!');
      break;
    }
    case 'no': {
      console.log('Nope...');
      break;
    }
    default: {
      pushNotification();
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
