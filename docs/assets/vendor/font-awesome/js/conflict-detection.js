!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e["fontawesome-free-conflict-detection"]={})}(this,function(e){"use strict";function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(o){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{},t=Object.keys(r);(t="function"==typeof Object.getOwnPropertySymbols?t.concat(Object.getOwnPropertySymbols(r).filter(function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable})):t).forEach(function(e){var t,n;t=o,e=r[n=e],n in t?Object.defineProperty(t,n,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[n]=e})}return o}var n={},o={};try{"undefined"!=typeof window&&(n=window),"undefined"!=typeof document&&(o=document)}catch(e){}var r=(n.navigator||{}).userAgent,r=void 0===r?"":r,l=n,u=o,i=!!l.document,a=!!u.documentElement&&!!u.head&&"function"==typeof u.addEventListener&&"function"==typeof u.createElement,s=(~r.indexOf("MSIE")||r.indexOf("Trident/"),[]),r=function e(){u.removeEventListener("DOMContentLoaded",e),f=1,s.map(function(e){return e()})},f=!1;function d(e){a&&(f?setTimeout(e,0):s.push(e))}a&&((f=(u.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(u.readyState))||u.addEventListener("DOMContentLoaded",r));var p="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};var m,g=(function(e){function u(e,t){var n=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(n>>16)<<16|65535&n}function a(e,t,n,o,r,i){return u((i=u(u(t,e),u(o,i)))<<r|i>>>32-r,n)}function d(e,t,n,o,r,i,c){return a(t&n|~t&o,e,t,r,i,c)}function m(e,t,n,o,r,i,c){return a(t&o|n&~o,e,t,r,i,c)}function g(e,t,n,o,r,i,c){return a(t^n^o,e,t,r,i,c)}function h(e,t,n,o,r,i,c){return a(n^(t|~o),e,t,r,i,c)}function c(e,t){var n,o,r,i;e[t>>5]|=128<<t%32,e[14+(t+64>>>9<<4)]=t;for(var c=1732584193,a=-271733879,s=-1732584194,f=271733878,l=0;l<e.length;l+=16)c=d(n=c,o=a,r=s,i=f,e[l],7,-680876936),f=d(f,c,a,s,e[l+1],12,-389564586),s=d(s,f,c,a,e[l+2],17,606105819),a=d(a,s,f,c,e[l+3],22,-1044525330),c=d(c,a,s,f,e[l+4],7,-176418897),f=d(f,c,a,s,e[l+5],12,1200080426),s=d(s,f,c,a,e[l+6],17,-1473231341),a=d(a,s,f,c,e[l+7],22,-45705983),c=d(c,a,s,f,e[l+8],7,1770035416),f=d(f,c,a,s,e[l+9],12,-1958414417),s=d(s,f,c,a,e[l+10],17,-42063),a=d(a,s,f,c,e[l+11],22,-1990404162),c=d(c,a,s,f,e[l+12],7,1804603682),f=d(f,c,a,s,e[l+13],12,-40341101),s=d(s,f,c,a,e[l+14],17,-1502002290),c=m(c,a=d(a,s,f,c,e[l+15],22,1236535329),s,f,e[l+1],5,-165796510),f=m(f,c,a,s,e[l+6],9,-1069501632),s=m(s,f,c,a,e[l+11],14,643717713),a=m(a,s,f,c,e[l],20,-373897302),c=m(c,a,s,f,e[l+5],5,-701558691),f=m(f,c,a,s,e[l+10],9,38016083),s=m(s,f,c,a,e[l+15],14,-660478335),a=m(a,s,f,c,e[l+4],20,-405537848),c=m(c,a,s,f,e[l+9],5,568446438),f=m(f,c,a,s,e[l+14],9,-1019803690),s=m(s,f,c,a,e[l+3],14,-187363961),a=m(a,s,f,c,e[l+8],20,1163531501),c=m(c,a,s,f,e[l+13],5,-1444681467),f=m(f,c,a,s,e[l+2],9,-51403784),s=m(s,f,c,a,e[l+7],14,1735328473),c=g(c,a=m(a,s,f,c,e[l+12],20,-1926607734),s,f,e[l+5],4,-378558),f=g(f,c,a,s,e[l+8],11,-2022574463),s=g(s,f,c,a,e[l+11],16,1839030562),a=g(a,s,f,c,e[l+14],23,-35309556),c=g(c,a,s,f,e[l+1],4,-1530992060),f=g(f,c,a,s,e[l+4],11,1272893353),s=g(s,f,c,a,e[l+7],16,-155497632),a=g(a,s,f,c,e[l+10],23,-1094730640),c=g(c,a,s,f,e[l+13],4,681279174),f=g(f,c,a,s,e[l],11,-358537222),s=g(s,f,c,a,e[l+3],16,-722521979),a=g(a,s,f,c,e[l+6],23,76029189),c=g(c,a,s,f,e[l+9],4,-640364487),f=g(f,c,a,s,e[l+12],11,-421815835),s=g(s,f,c,a,e[l+15],16,530742520),c=h(c,a=g(a,s,f,c,e[l+2],23,-995338651),s,f,e[l],6,-198630844),f=h(f,c,a,s,e[l+7],10,1126891415),s=h(s,f,c,a,e[l+14],15,-1416354905),a=h(a,s,f,c,e[l+5],21,-57434055),c=h(c,a,s,f,e[l+12],6,1700485571),f=h(f,c,a,s,e[l+3],10,-1894986606),s=h(s,f,c,a,e[l+10],15,-1051523),a=h(a,s,f,c,e[l+1],21,-2054922799),c=h(c,a,s,f,e[l+8],6,1873313359),f=h(f,c,a,s,e[l+15],10,-30611744),s=h(s,f,c,a,e[l+6],15,-1560198380),a=h(a,s,f,c,e[l+13],21,1309151649),c=h(c,a,s,f,e[l+4],6,-145523070),f=h(f,c,a,s,e[l+11],10,-1120210379),s=h(s,f,c,a,e[l+2],15,718787259),a=h(a,s,f,c,e[l+9],21,-343485551),c=u(c,n),a=u(a,o),s=u(s,r),f=u(f,i);return[c,a,s,f]}function s(e){for(var t="",n=32*e.length,o=0;o<n;o+=8)t+=String.fromCharCode(e[o>>5]>>>o%32&255);return t}function f(e){var t=[];for(t[(e.length>>2)-1]=void 0,o=0;o<t.length;o+=1)t[o]=0;for(var n=8*e.length,o=0;o<n;o+=8)t[o>>5]|=(255&e.charCodeAt(o/8))<<o%32;return t}function o(e){for(var t,n="0123456789abcdef",o="",r=0;r<e.length;r+=1)t=e.charCodeAt(r),o+=n.charAt(t>>>4&15)+n.charAt(15&t);return o}function n(e){return unescape(encodeURIComponent(e))}function r(e){return s(c(f(e=n(e)),8*e.length))}function i(e,t){return function(e,t){var n,o=f(e),r=[],i=[];for(r[15]=i[15]=void 0,16<o.length&&(o=c(o,8*e.length)),n=0;n<16;n+=1)r[n]=909522486^o[n],i[n]=1549556828^o[n];return t=c(r.concat(f(t)),512+8*t.length),s(c(i.concat(t),640))}(n(e),n(t))}function t(e,t,n){return t?n?i(t,e):o(i(t,e)):n?r(e):o(r(e))}var l;l=p,e.exports?e.exports=t:l.md5=t}(m={exports:{}}),m.exports);function h(e){if(null!==e&&"object"===t(e))return e.src?g(e.src):e.href?g(e.href):e.innerText&&""!==e.innerText?g(e.innerText):void 0}var y="fa-kits-diag",w="fa-kits-node-under-test",b="data-md5",v="data-fa-detection-ignore",x="data-fa-detection-timeout",A="data-fa-detection-results-collection-max-wait",T=function(e){e.preventDefault(),e.stopPropagation()};function D(e){var t=e.fn,i=void 0===t?function(){return!0}:t,t=e.initialDuration,n=void 0===t?1:t,t=e.maxDuration,c=void 0===t?l.FontAwesomeDetection.timeout:t,t=e.showProgress,a=void 0!==t&&t,s=e.progressIndicator;return new Promise(function(o,r){!function t(e,n){setTimeout(function(){var e=i();a&&console.info(s),e?o(e):(e=250+n)<=c?t(250,e):r("timeout")},e)}(n,0)})}function E(t){for(var i=Array.from(u.scripts).filter(function(e){return!e.hasAttribute(v)&&e!==t}),c={},e=0;e<i.length;e++)!function(e){var t=u.createElement("iframe");t.setAttribute("style","display:none;");var n=u.createElement("script");n.setAttribute("id",w);var o=h(i[e]);n.setAttribute(b,o),c[o]=i[e],""!==i[e].src&&(n.src=i[e].src),""!==i[e].innerText&&(n.innerText=i[e].innerText),n.async=!0;var r=u.createElement("script");r.setAttribute("id",y);e="file://"===l.location.origin?"*":l.location.origin;r.innerText="(".concat(function(n,o,r){parent.FontAwesomeDetection.__pollUntil({fn:function(){return!!window.FontAwesomeConfig||!!window.FontAwesomeKitConfig}}).then(function(){var e=document.getElementById(n);parent.postMessage({type:"fontawesome-conflict",technology:"js",src:e.src,innerText:e.innerText,tagName:e.tagName,md5:o},r)}).catch(function(e){var t=document.getElementById(n);"timeout"===e?parent.postMessage({type:"no-conflict",src:t.src,innerText:t.innerText,tagName:t.tagName,md5:o},r):console.error(e)})}.toString(),")('").concat(w,"', '").concat(o,"', '").concat(e,"');"),t.onload=function(){t.contentWindow.addEventListener("error",T,!0),t.contentDocument.head.appendChild(r),t.contentDocument.head.appendChild(n)},d(function(){return u.body.appendChild(t)})}(e);return c}function C(e){var t=e.nodesTested,e=e.nodesFound;l.FontAwesomeDetection=l.FontAwesomeDetection||{},l.FontAwesomeDetection.nodesTested=t,l.FontAwesomeDetection.nodesFound=e,l.FontAwesomeDetection.detectionDone=!0}function F(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:function(){},n={conflict:{},noConflict:{}};l.onmessage=function(e){"file://"!==l.location.origin&&e.origin!==l.location.origin||e&&e.data&&("fontawesome-conflict"===e.data.type?n.conflict[e.data.md5]=e.data:"no-conflict"===e.data.type&&(n.noConflict[e.data.md5]=e.data))};var e=E(u.currentScript),o=function(){var e=Array.from(u.getElementsByTagName("link")).filter(function(e){return!e.hasAttribute(v)}),t=Array.from(u.getElementsByTagName("style")).filter(function(e){return!e.hasAttribute(v)&&(!l.FontAwesomeConfig||!e.innerText.match(new RegExp("svg:not\\(:root\\)\\.".concat(l.FontAwesomeConfig.replacementClass))))});function n(e,t){var n=u.createElement("iframe");n.setAttribute("style","visibility: hidden; position: absolute; height: 0; width: 0;");var o="fa-test-icon-"+t,r=u.createElement("i");r.setAttribute("class","fa fa-coffee"),r.setAttribute("id",o);var i=u.createElement("script");i.setAttribute("id",y);var c="file://"===l.location.origin?"*":l.location.origin;i.innerText="(".concat(function(n,t,o,r){parent.FontAwesomeDetection.__pollUntil({fn:function(){var e=document.getElementById(t),e=window.getComputedStyle(e).getPropertyValue("font-family");return!(!e.match(/FontAwesome/)&&!e.match(/Font Awesome 5/))}}).then(function(){var e=document.getElementById(n);parent.postMessage({type:"fontawesome-conflict",technology:"webfont",href:e.href,innerText:e.innerText,tagName:e.tagName,md5:o},r)}).catch(function(e){var t=document.getElementById(n);"timeout"===e?parent.postMessage({type:"no-conflict",technology:"webfont",href:t.src,innerText:t.innerText,tagName:t.tagName,md5:o},r):console.error(e)})}.toString(),")('").concat(w,"', '").concat(o||"foo","', '").concat(t,"', '").concat(c,"');"),n.onload=function(){n.contentWindow.addEventListener("error",T,!0),n.contentDocument.head.appendChild(i),n.contentDocument.head.appendChild(e),n.contentDocument.body.appendChild(r)},d(function(){return u.body.appendChild(n)})}for(var o={},r=0;r<e.length;r++){var i=u.createElement("link");i.setAttribute("id",w),i.setAttribute("href",e[r].href),i.setAttribute("rel",e[r].rel);var c=h(e[r]);i.setAttribute(b,c),o[c]=e[r],n(i,c)}for(var a=0;a<t.length;a++){var s=u.createElement("style");s.setAttribute("id",w);var f=h(t[a]);s.setAttribute(b,f),s.innerText=t[a].innerText,o[f]=t[a],n(s,f)}return o}(),r=c({},e,o),i=Object.keys(e).length+Object.keys(o).length,o=l.FontAwesomeDetection.timeout+l.FontAwesomeDetection.resultsCollectionMaxWait;console.group("Font Awesome Detector"),0===i?(console.info("%cAll Good!","color: green; font-size: large"),console.info("We didn't find anything that needs testing for conflicts. Ergo, no conflicts.")):(console.info("Testing ".concat(i," possible conflicts.")),console.info("We'll wait about ".concat(Math.round(l.FontAwesomeDetection.timeout/10)/100," seconds while testing these and\n")+"then up to another ".concat(Math.round(l.FontAwesomeDetection.resultsCollectionMaxWait/10)/100," to allow the browser time\n")+"to accumulate the results. But we'll probably be outta here way before then.\n\n"),console.info("You can adjust those durations by assigning values to these attributes on the <script> element that loads this detection:"),console.info("\t%c".concat(x,"%c: milliseconds to wait for each test before deciding whether it's a conflict."),"font-weight: bold;","font-size: normal;"),console.info("\t%c".concat(A,"%c: milliseconds to wait for the browser to accumulate test results before giving up."),"font-weight: bold;","font-size: normal;"),D({maxDuration:o,showProgress:!0,progressIndicator:"waiting...",fn:function(){return Object.keys(n.conflict).length+Object.keys(n.noConflict).length>=i}}).then(function(){console.info("DONE!"),C({nodesTested:n,nodesFound:r}),t({nodesTested:n,nodesFound:r}),console.groupEnd()}).catch(function(e){"timeout"===e?console.info("TIME OUT! We waited until we got tired. Here's what we found:"):(console.info("Whoops! We hit an error:",e),console.info("Here's what we'd found up until that error:")),C({nodesTested:n,nodesFound:r}),t({nodesTested:n,nodesFound:r}),console.groupEnd()}))}r=l.FontAwesomeDetection||{},r=c({},{report:function(e){var t,n=e.nodesTested,o=e.nodesFound,r={};for(t in o)n.conflict[t]||n.noConflict[t]||(r[t]=o[t]);if(0<(e=Object.keys(n.conflict).length)){console.info("%cConflict".concat(1<e?"s":""," found:"),"color: darkred; font-size: large");var i,c={};for(i in n.conflict){var a=n.conflict[i];c[i]={tagName:a.tagName,"src/href":a.src||a.href||"n/a","innerText excerpt":a.innerText&&""!==a.innerText?a.innerText.slice(0,200)+"...":"(empty)"}}console.table(c)}if(0<(e=Object.keys(n.noConflict).length)){console.info("%cNo conflict".concat(1<e?"s":""," found with ").concat(1==e?"this":"these",":"),"color: green; font-size: large");var s,f={};for(s in n.noConflict){var l=n.noConflict[s];f[s]={tagName:l.tagName,"src/href":l.src||l.href||"n/a","innerText excerpt":l.innerText&&""!==l.innerText?l.innerText.slice(0,200)+"...":"(empty)"}}console.table(f)}if(0<(e=Object.keys(r).length)){console.info("%cLeftovers--we timed out before collecting test results for ".concat(1==e?"this":"these",":"),"color: blue; font-size: large");var u,d={};for(u in r){var m=r[u];d[u]={tagName:m.tagName,"src/href":m.src||m.href||"n/a","innerText excerpt":m.innerText&&""!==m.innerText?m.innerText.slice(0,200)+"...":"(empty)"}}console.table(d)}},timeout:+(u.currentScript.getAttribute(x)||"2000"),resultsCollectionMaxWait:+(u.currentScript.getAttribute(A)||"5000")},r,{__pollUntil:D,md5ForNode:h,detectionDone:!1,nodesTested:null,nodesFound:null});l.FontAwesomeDetection=r;var O=function(){try{return"production"===process.env.NODE_ENV}catch(e){return!1}}();!function(e){try{e()}catch(e){if(!O)throw e}}(function(){i&&a&&F(window.FontAwesomeDetection.report)}),e.conflictDetection=F,Object.defineProperty(e,"__esModule",{value:!0})});