// This is the "Offline copy of assets" service worker

const CACHE = "pwa-beyond_regex-v.alpha";
const QUEUE_NAME = "bgSyncQueue";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

//Precaching
// workbox.precaching.precacheAndRoute([
//   { url: 'index.html', revision: '0000' },
//   { url: 'manifest.json', revision: '0000' },
//   { url: 'images/icons/icon-48x48.png', revision: '0000' },
// ]);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

const showNotification = () => {
  self.registration.showNotification('Online', {
    body: 'You are back online!',
    // icon: 'assets/icon/256.png',
    // badge: 'assets/icon/32png.png'
  });
};

//BackgroundSync
//On https://ptsv2.com/t/n5y9f-1556037444 you can check for received posts
const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin(QUEUE_NAME, {
  maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
  // the new bit
  callbacks: {
    queueDidReplay: showNotification
  }
});

workbox.routing.registerRoute(
  new RegExp('/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE,
    plugins: [
      bgSyncPlugin
    ]
  })
);

// workbox.routing.registerRoute(
//     'https://ptsv2.com/t/n5y9f-1556037444/post',
//     new workbox.strategies.NetworkOnly({
//         plugins: [bgSyncPlugin]
//     }),
//     'POST'
// );