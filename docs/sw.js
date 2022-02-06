importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');
importScripts('./changelog.js');

const SW_VERSION = '0.0.alpha';
const SW_BUILD = '15'

const CACHE_IMAGES = "beyond_regex-images";
const CACHE_FONTS = "beyond_regex-fonts";
const CACHE_VERSIONED = `beyond_regex-v${SW_VERSION}.${SW_BUILD}`;
workbox.setConfig({ debug: true });

workbox.core.setCacheNameDetails({
  prefix: 'beyond-regex',
  suffix: `v${SW_VERSION}.${SW_BUILD}`,
  precache: 'precache',
  runtime: 'runtime',
  googleAnalytics: 'google-analytics'
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage(`${SW_VERSION}.${SW_BUILD}`);
  }
  if (event.data && event.data.type === 'GET_VERSION_NEW') {
    let lastVersion = Object.keys(CHANGELOG).sort(function (a, b) {
      return parseInt(a) - parseInt(b);
    });
    lastVersion = lastVersion[lastVersion.length - 1]
    let lastBuild = Object.keys(CHANGELOG[lastVersion]).sort(function (a, b) {
      return parseInt(a) - parseInt(b);
    });
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
    lastVersion = lastVersion[lastVersion.length - 1]
    let lastBuild = Object.keys(CHANGELOG[lastVersion]).sort(function (a, b) {
      return parseInt(a) - parseInt(b);
    });
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

const regexChangelog = "/changelog\\.js"
const regexBeyondFiles = "/beyond-regex/(.+\\.html|(?!changelog).+\\.js|.+\\.css)?"
const regexFonts = "/fonts/.*\\.svg|.*\\.(?:eot|otf|ttf|woff|woff2)|^https://unpkg.com/ionicons.+|^https://fonts.googleapis.com/.+"
const regexImages = "/.+\\.(png|jpe?g|svg|ico)"
workbox.routing.registerRoute(
  new RegExp(`.+${regexChangelog}$`),
  new workbox.strategies.NetworkFirst({
    cacheName: CACHE_VERSIONED,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 4 * 30 * 24 * 60 * 60, 
      }),
    ],
  })
);
workbox.routing.registerRoute(
  new RegExp(`.+${regexBeyondFiles}$`),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE_VERSIONED,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 4 * 30 * 24 * 60 * 60, 
      }),
    ]
  })
);
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
        maxAgeSeconds: 4 * 30 * 24 * 60 * 60, 
      }),
    ],
  }),
);
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
        maxAgeSeconds: 365 * 24 * 60 * 60, 
      }),
    ],
  }),
);
workbox.routing.setDefaultHandler(({ url, event, params }) => {
  new workbox.strategies.CacheFirst({
    cacheName: CACHE_VERSIONED,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 365 * 24 * 60 * 60, 
      }),
    ],
  })
});
