importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js");const SW_VERSION="0.0.alpha.12",CACHE=`pwa-beyond_regex-v${SW_VERSION}`;self.addEventListener("message",e=>{e.data&&"GET_VERSION"===e.data.type&&e.ports[0].postMessage(SW_VERSION),e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting(),e.data&&"CACHE_UPDATED"===e.data.type&&(e=e.data.payload["updatedURL"],console.log(`A newer version of ${e} is available!`))}),workbox.navigationPreload.isSupported()&&workbox.navigationPreload.enable(),workbox.routing.registerRoute(new RegExp("/*"),new workbox.strategies.StaleWhileRevalidate({cacheName:CACHE})),workbox.routing.registerRoute(new RegExp(".*\\.(?:js)"),new workbox.strategies.NetworkFirst),workbox.routing.registerRoute(new RegExp(".*\\.(?:png|jpg|jpeg|svg|gif)"),new workbox.strategies.CacheFirst({cacheName:"image-cache",plugins:[new workbox.expiration.ExpirationPlugin({maxEntries:3})]}));