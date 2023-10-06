const version = "v.0.14.0";

var dataCacheName = 'tiny-sweeper';
var cacheName = 'tiny-sweeper';
var filesToCache = [
  //'/',
  './index.html',
  './index.js',
  './style.css'
];

/*
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});
*/

// trying to solve the problem of never refreshing
self.addEventListener('install', function (e) {
    //console.log('[Service Worker] Install');

    if (e.request.cache === 'only-if-cached' && e.request.mode !== 'same-origin') {
      return;
    }


    e.waitUntil(
      caches.open(dataCacheName).then(function (cache) {
          //console.log('[Service Worker] Caching app shell');
          return cache.addAll(filesToCache);
      }).then(function(e){
        return self.skipWaiting();
      })
    );
});

/*
self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});
*/

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // Return true if you want to remove this cache,
          // but remember that caches are shared across
          // the whole origin
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(e) {
  //console.log('[Service Worker] Fetch', e.request.url);
  
  if (e.request.cache === 'only-if-cached' && e.request.mode !== 'same-origin') {
    return;
  }

  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

