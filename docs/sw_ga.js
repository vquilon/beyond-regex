// This is the "Offline page" service worker

//  importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

const SW_VERSION = '0.0.alpha.9';
const CACHE = `pwa-beyond_regex-v${SW_VERSION}`;
// const urlsToCache = [

// ];

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage(SW_VERSION);
  }
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CACHE_UPDATED') {
    const {updatedURL} = event.data.payload;
    console.log(`A newer version of ${updatedURL} is available!`);
  }
});

// self.addEventListener('install', function(event) {
//   // Perform install steps
//   event.waitUntil(
//     caches.open(CACHE)
//       .then(function(cache) {
//         console.log('Opened cache');
//         return cache.addAll(urlsToCache);
//       })
//   );
// });

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}


// Registro de las urls para cachear
workbox.routing.registerRoute(
  new RegExp('/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
);

// workbox.precaching.precacheAndRoute([
//   'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css',
// ]);

// Demonstrates using default cache
workbox.routing.registerRoute(
    new RegExp('.*\\.(?:js)'),
    new workbox.strategies.NetworkFirst(),
);

// Demonstrates a custom cache name for a route.
workbox.routing.registerRoute(
    new RegExp('.*\\.(?:png|jpg|jpeg|svg|gif)'),
    new workbox.strategies.CacheFirst({
      cacheName: 'image-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 3,
        }),
      ],
    }),
);

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then(function(response) {
//         // Cache hit - return response
//         if (response) {
//           return response;
//         }

//         // IMPORTANT: Clone the request. A request is a stream and
//         // can only be consumed once. Since we are consuming this
//         // once by cache and once by the browser for fetch, we need
//         // to clone the response.
//         var fetchRequest = event.request.clone();

//         return fetch(fetchRequest).then(
//           function(response) {
//             // Check if we received a valid response
//             if(!response || response.status !== 200 || response.type !== 'basic') {
//               return response;
//             }

//             // IMPORTANT: Clone the response. A response is a stream
//             // and because we want the browser to consume the response
//             // as well as the cache consuming the response, we need
//             // to clone it so we have two streams.
//             var responseToCache = response.clone();

//             caches.open(CACHE)
//               .then(function(cache) {
//                 cache.put(event.request, responseToCache);
//               });

//             return response;
//           }
//         );
//       })
//     );
// });


// Google Analytics Service Worker
// Base Initialize with dimension
// workbox.googleAnalytics.initialize({
//   parameterOverrides: {
//     cd1: 'offline',
//   },
// });
// With time consumed offline mode
workbox.googleAnalytics.initialize({
  parameterOverrides: {
    cd1: 'offline',
  },
  hitFilter: (params) => {
    const queueTimeInSeconds = Math.round(params.get('qt') / 1000);
    params.set('cm1', queueTimeInSeconds);
  },
});