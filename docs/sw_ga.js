importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js");const SW_VERSION="0.0.alpha.13",CACHE=`pwa-beyond_regex-v${SW_VERSION}`;self.addEventListener("message",e=>{e.data&&"GET_VERSION"===e.data.type&&e.ports[0].postMessage(SW_VERSION),e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting(),e.data&&"CACHE_UPDATED"===e.data.type&&(e=e.data.payload["updatedURL"],console.log(`A newer version of ${e} is available!`))}),workbox.navigationPreload.isSupported()&&workbox.navigationPreload.enable(),workbox.routing.registerRoute(({request:e})=>"document"===e.destination||"script"===e.destination||"style"===e.destination,new workbox.strategies.NetworkFirst),workbox.routing.registerRoute(({request:e})=>"image"===e.destination,new workbox.strategies.CacheFirst({cacheName:`${CACHE}_images`,plugins:[new workbox.cacheableResponse.CacheableResponsePlugin({statuses:[0,200]}),new workbox.expiration.ExpirationPlugin({maxEntries:60,maxAgeSeconds:2592e3})]})),workbox.routing.registerRoute(new RegExp("/*"),new workbox.strategies.StaleWhileRevalidate({cacheName:CACHE})),workbox.googleAnalytics.initialize({parameterOverrides:{cd1:"offline"},hitFilter:e=>{var t=Math.round(e.get("qt")/1e3);e.set("cm1",t)}});