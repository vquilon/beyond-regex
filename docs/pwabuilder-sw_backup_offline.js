const CACHE="pwa-beyond_regex-v.alpha";importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js");const offlineFallbackPage="offline.html";self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),self.addEventListener("install",async e=>{e.waitUntil(caches.open(CACHE).then(e=>e.add(offlineFallbackPage)))}),workbox.navigationPreload.isSupported()&&workbox.navigationPreload.enable(),workbox.routing.registerRoute(new RegExp("/*"),new workbox.strategies.StaleWhileRevalidate({cacheName:CACHE})),self.addEventListener("fetch",e=>{"navigate"===e.request.mode&&e.respondWith((async()=>{try{return await e.preloadResponse||await fetch(e.request)}catch(e){const a=await caches.open(CACHE);return a.match(offlineFallbackPage)}})())});