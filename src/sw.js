/* eslint-disable no-underscore-dangle */
const { assets } = global.serviceWorkerOption;
const { getSearchResults } = require('./api/search');

const CACHE_NAME = new Date().toISOString();

let assetsToCache = [...assets, './'];

const delay = 5000;

let query = '';
let visited = [];
let whitelist = [];
let blacklist = [];
let current;

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
      data: {
        renotify: true,
      },
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

const addToWhitelist = (categories) => {
  categories.forEach((category) => {
    if (!blacklist.includes(category)) {
      if (!whitelist.includes(category)) {
        whitelist.push(category);
      }
    } else {
      const index = blacklist.indexOf(category);
      if (index > -1) {
        blacklist.splice(index, 1);
      }
    }
  });
};

const addToBlacklist = (categories) => {
  categories.forEach((category) => {
    if (!whitelist.includes(category)) {
      if (!blacklist.includes(category)) {
        blacklist.push(category);
      }
    } else {
      const index = whitelist.indexOf(category);
      if (index > -1) {
        whitelist.splice(index, 1);
      }
    }
  });
};

const openWebsite = url => clients.openWindow(url);

const handleNotificationActions = (coin) => new Promise((resolve) => {
  const { categories } = current;
  if (coin) {
    addToWhitelist(categories);
  } else {
    addToBlacklist(categories);
  }
  getSearchResults(query, whitelist, blacklist, visited).then((results) => {
    if (results.length > 0) {
      current = results[0]._source;
      pushNotification();
      resolve(current.url);
    } else {
      self.registration.showNotification('ASE Search', {
        dir: 'ltr',
        lang: 'en-US',
        body: 'We have run out of records! Please try another query! (Click me to dismiss)',
        tag: 'ASE',
        badge: '/images/favicon/icon_96x96.png',
        icon: '/images/favicon/icon_96x96.png',
        data: {
          renotify: false,
        },
        renotify: true,
        requireInteraction: false,
        silent: false,
        vibrate: [200, 100, 200],
      });
      resolve(null);
    }
  });
});

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
      current = result;
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
  e.waitUntil(new Promise((resolve, reject) => {
    switch (e.action) {
      case 'more' : {
        handleNotificationActions(true).then(resolve);
        break;
      }
      case 'no': {
        handleNotificationActions(false).then(resolve);
        break;
      }
      default: {
        if (e.notification.data.renotify) {
          pushNotification();
          reject();
        }
        break;
      }
    }
  }).then((url) => {
    if (url) {
      visited.push(url);
      return openWebsite(url);
    }
    return openWebsite(`${e.srcElement.origin}/?query=${query}`);
  }).catch());
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
