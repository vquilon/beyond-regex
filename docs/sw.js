// This is the "Offline page" service worker

//  importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

const SW_VERSION = '0.0.alpha.13';
const CACHE = `pwa-beyond_regex-v${SW_VERSION}`;
const OFFLINE_INDEX = "/offline/";

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


// PRECACHING DE ENLACES EXTERNOS
// workbox.precaching.precacheAndRoute([
//   'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css',
// ]);

// ESTRATEGIA NETWORK FIRST, DESPUES TIRARIA DEL CACHE DE ARRIBA StaleWithRevalidate
workbox.routing.registerRoute(
  ({request}) =>
    request.destination === 'document' ||
    request.destination === 'script' ||
    request.destination === 'style',
    new workbox.strategies.NetworkFirst()
    // new RegExp('.*\\.(?:js)'),
    // new workbox.strategies.NetworkFirst(),
);

// CACHE UNICO PARA IMAGENES
workbox.routing.registerRoute(
  ({request}) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: `${CACHE}_images`,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  }),
);

// Cacheo de todas las URLs propias
workbox.routing.registerRoute(
  new RegExp('/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
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