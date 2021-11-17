// This is the "Offline page" service worker

//  importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');
importScripts('./changelog.js');

const SW_VERSION = '0.0.alpha';
const SW_BUILD = '14'

const CACHE_IMAGES = "beyond_regex-images";
const CACHE_FONTS = "beyond_regex-fonts";
const CACHE_VERSIONED = `beyond_regex-v${SW_VERSION}.${SW_BUILD}`;


// Force development  builds
workbox.setConfig({ debug: true });

workbox.core.setCacheNameDetails({
  prefix: 'beyond-regex',
  suffix: `v${SW_VERSION}.${SW_BUILD}`,
  precache: 'precache',
  runtime: 'runtime',
  googleAnalytics: 'google-analytics'
});

// const urlsToCache = [
// ];

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage(`${SW_VERSION}.${SW_BUILD}`);
  }
  if (event.data && event.data.type === 'GET_VERSION_NEW') {
    let lastVersion = Object.keys(CHANGELOG).sort(function (a, b) {
      return parseInt(a) - parseInt(b);
    });
    // Ultima version
    lastVersion = lastVersion[lastVersion.length - 1]
    let lastBuild = Object.keys(CHANGELOG[lastVersion]).sort(function (a, b) {
      return parseInt(a) - parseInt(b);
    });

    // Ultimo build
    lastBuild = lastBuild[lastBuild.length - 1]

    event.ports[0].postMessage(`${lastVersion}.${lastBuild}`);
  }
  if (event.data && event.data.type === 'GET_CHANGELOG') {
    event.ports[0].postMessage(CHANGELOG[SW_VERSION][SW_BUILD]);
  }
  if (event.data && event.data.type === 'GET_CHANGELOG_NEW') {
    let lastVersion = Object.keys(CHANGELOG).sort(function (a, b) {
      return parseInt(a) - parseInt(b);
    });
    // Ultima version
    lastVersion = lastVersion[lastVersion.length - 1]
    let lastBuild = Object.keys(CHANGELOG[lastVersion]).sort(function (a, b) {
      return parseInt(a) - parseInt(b);
    });

    // Ultimo build
    lastBuild = lastBuild[lastBuild.length - 1]

    event.ports[0].postMessage(CHANGELOG[lastVersion][lastBuild]);
  }
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CACHE_UPDATED') {
    const { updatedURL } = event.data.payload;
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

// Developers who are already handling navigations by responding with precached HTML
// We use the local cache to handle the differents versions
// if (workbox.navigationPreload.isSupported()) {
//   workbox.navigationPreload.enable();
// }


// PRECACHING DE ENLACES EXTERNOS
// workbox.precaching.precacheAndRoute([
//   'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css',
// ]);

const regexChangelog = "/changelog\\.js"
const regexBeyondFiles = "/beyond-regex/(.+\\.html|(?!changelog).+\\.js|.+\\.css)"
const regexFonts = "/fonts/.*\\.svg|.*\\.(?:eot|otf|ttf|woff|woff2)"
const regexImages = "/.+\\.(png|jpe?g|svg|ico)"

// MANTENDREMOS EL CHANGELOG ACTUALIZADO
workbox.routing.registerRoute(
  new RegExp(`.+${regexChangelog}$`),
  new workbox.strategies.NetworkFirst({
    cacheName: CACHE_VERSIONED,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 4 * 30 * 24 * 60 * 60, // 4 Months
      }),
    ],
  })
);

// CON STALE WITH REVALIDATE COMPROBAREMOS SI HAY QUE ACTUALIZAR A UNA NUEVA VERSION
// ESTRATEGIA NETWORK FIRST, DESPUES TIRARIA DEL CACHE VERSIONADO DE ARRIBA StaleWithRevalidate
workbox.routing.registerRoute(
  new RegExp(`.+${regexBeyondFiles}$`),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE_VERSIONED,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 4 * 30 * 24 * 60 * 60, // 4 Months
      }),
    ]
  })
);

// CACHE UNICO PARA IMAGENES
workbox.routing.registerRoute(
  new RegExp(`.+${regexImages}$`),
  new workbox.strategies.CacheFirst({
    cacheName: CACHE_IMAGES,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 4 * 30 * 24 * 60 * 60, // 4 Months
      }),
    ],
  }),
);

// CACHING PARA LAS FUENTES
workbox.routing.registerRoute(
  new RegExp(`.+${regexFonts}$`),
  new workbox.strategies.CacheFirst({
    cacheName: CACHE_FONTS,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 año
      }),
    ],
  }),
);

// CACHEO EL RESTO DE URLS A MI CACHE VERSIONADA
// LA CUAL SE BORRARA CADA VEZ QUE SE ACTUALICE
// NEW
workbox.routing.setDefaultHandler(({ url, event, params }) => {
  new workbox.strategies.CacheFirst({
    cacheName: CACHE_VERSIONED,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 año
      }),
    ],
  })
});
// OLD
// workbox.routing.registerRoute(
//   new RegExp(`.+${regexRemaining}$`),
//   new workbox.strategies.CacheFirst({
//     cacheName: CACHE_VERSIONED,
//     plugins: [
//       new workbox.cacheableResponse.CacheableResponsePlugin({
//         statuses: [0, 200],
//       }),
//       new workbox.expiration.ExpirationPlugin({
//         maxAgeSeconds: 365 * 24 * 60 * 60, // 1 año
//       }),
//     ],
//   })
// );

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