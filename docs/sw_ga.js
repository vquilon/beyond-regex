// This is the "Offline page" service worker

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

// Google Analytics Service Worker
// Base Initialize with dimension
// workbox.googleAnalytics.initialize({
//   parameterOverrides: {
//     cd1: 'offline',
//   },
// });
// With time consumed offline mode
workbox.googleAnalytics.initialize({
  hitFilter: (params) => {
    const queueTimeInSeconds = Math.round(params.get('qt') / 1000);
    params.set('cm1', queueTimeInSeconds);
  },
});