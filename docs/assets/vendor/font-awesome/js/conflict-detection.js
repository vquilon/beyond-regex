!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e["fontawesome-free-conflict-detection"]={})}(this,function(e){"use strict";function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(o){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{},t=Object.keys(r);(t="function"==typeof Object.getOwnPropertySymbols?t.concat(Object.getOwnPropertySymbols(r).filter(function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable})):t).forEach(function(e){var t,n=o;e=r[t=e],t in n?Object.defineProperty(n,t,{value:e,enumerable:!0,configurable:!0,writable:!0}):n[t]=e})}return o}var n={},o={};try{"undefined"!=typeof window&&(n=window),"undefined"!=typeof document&&(o=document)}catch(e){}var r=void 0===(r=(n.navigator||{}).userAgent)?"":r,l=n,u=o,i=!!l.document,a=!!u.documentElement&&!!u.head&&"function"==typeof u.addEventListener&&"function"==typeof u.createElement,s=(~r.indexOf("MSIE")||r.indexOf("Trident/"),[]),r=function e(){u.removeEventListener("DOMContentLoaded",e),f=1,s.map(function(e){return e()})},f=!1;function d(e){a&&(f?setTimeout(e,0):s.push(e))}a&&!(f=(u.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(u.readyState))&&u.addEventListener("DOMContentLoaded",r);var m="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},g=((o=n={exports:{}}).exports?o.exports=O:m.md5=O,n.exports);function h(e,t){var n=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(n>>16)<<16|65535&n}function p(e,t,n,o,r,i){return h((i=h(h(t,e),h(o,i)))<<r|i>>>32-r,n)}function y(e,t,n,o,r,i,c){return p(t&n|~t&o,e,t,r,i,c)}function w(e,t,n,o,r,i,c){return p(t&o|n&~o,e,t,r,i,c)}function b(e,t,n,o,r,i,c){return p(t^n^o,e,t,r,i,c)}function v(e,t,n,o,r,i,c){return p(n^(t|~o),e,t,r,i,c)}function x(e,t){var n,o,r,i;e[t>>5]|=128<<t%32,e[14+(t+64>>>9<<4)]=t;for(var c=1732584193,a=-271733879,s=-1732584194,f=271733878,l=0;l<e.length;l+=16)c=y(n=c,o=a,r=s,i=f,e[l],7,-680876936),f=y(f,c,a,s,e[l+1],12,-389564586),s=y(s,f,c,a,e[l+2],17,606105819),a=y(a,s,f,c,e[l+3],22,-1044525330),c=y(c,a,s,f,e[l+4],7,-176418897),f=y(f,c,a,s,e[l+5],12,1200080426),s=y(s,f,c,a,e[l+6],17,-1473231341),a=y(a,s,f,c,e[l+7],22,-45705983),c=y(c,a,s,f,e[l+8],7,1770035416),f=y(f,c,a,s,e[l+9],12,-1958414417),s=y(s,f,c,a,e[l+10],17,-42063),a=y(a,s,f,c,e[l+11],22,-1990404162),c=y(c,a,s,f,e[l+12],7,1804603682),f=y(f,c,a,s,e[l+13],12,-40341101),s=y(s,f,c,a,e[l+14],17,-1502002290),c=w(c,a=y(a,s,f,c,e[l+15],22,1236535329),s,f,e[l+1],5,-165796510),f=w(f,c,a,s,e[l+6],9,-1069501632),s=w(s,f,c,a,e[l+11],14,643717713),a=w(a,s,f,c,e[l],20,-373897302),c=w(c,a,s,f,e[l+5],5,-701558691),f=w(f,c,a,s,e[l+10],9,38016083),s=w(s,f,c,a,e[l+15],14,-660478335),a=w(a,s,f,c,e[l+4],20,-405537848),c=w(c,a,s,f,e[l+9],5,568446438),f=w(f,c,a,s,e[l+14],9,-1019803690),s=w(s,f,c,a,e[l+3],14,-187363961),a=w(a,s,f,c,e[l+8],20,1163531501),c=w(c,a,s,f,e[l+13],5,-1444681467),f=w(f,c,a,s,e[l+2],9,-51403784),s=w(s,f,c,a,e[l+7],14,1735328473),c=b(c,a=w(a,s,f,c,e[l+12],20,-1926607734),s,f,e[l+5],4,-378558),f=b(f,c,a,s,e[l+8],11,-2022574463),s=b(s,f,c,a,e[l+11],16,1839030562),a=b(a,s,f,c,e[l+14],23,-35309556),c=b(c,a,s,f,e[l+1],4,-1530992060),f=b(f,c,a,s,e[l+4],11,1272893353),s=b(s,f,c,a,e[l+7],16,-155497632),a=b(a,s,f,c,e[l+10],23,-1094730640),c=b(c,a,s,f,e[l+13],4,681279174),f=b(f,c,a,s,e[l],11,-358537222),s=b(s,f,c,a,e[l+3],16,-722521979),a=b(a,s,f,c,e[l+6],23,76029189),c=b(c,a,s,f,e[l+9],4,-640364487),f=b(f,c,a,s,e[l+12],11,-421815835),s=b(s,f,c,a,e[l+15],16,530742520),c=v(c,a=b(a,s,f,c,e[l+2],23,-995338651),s,f,e[l],6,-198630844),f=v(f,c,a,s,e[l+7],10,1126891415),s=v(s,f,c,a,e[l+14],15,-1416354905),a=v(a,s,f,c,e[l+5],21,-57434055),c=v(c,a,s,f,e[l+12],6,1700485571),f=v(f,c,a,s,e[l+3],10,-1894986606),s=v(s,f,c,a,e[l+10],15,-1051523),a=v(a,s,f,c,e[l+1],21,-2054922799),c=v(c,a,s,f,e[l+8],6,1873313359),f=v(f,c,a,s,e[l+15],10,-30611744),s=v(s,f,c,a,e[l+6],15,-1560198380),a=v(a,s,f,c,e[l+13],21,1309151649),c=v(c,a,s,f,e[l+4],6,-145523070),f=v(f,c,a,s,e[l+11],10,-1120210379),s=v(s,f,c,a,e[l+2],15,718787259),a=v(a,s,f,c,e[l+9],21,-343485551),c=h(c,n),a=h(a,o),s=h(s,r),f=h(f,i);return[c,a,s,f]}function A(e){for(var t="",n=32*e.length,o=0;o<n;o+=8)t+=String.fromCharCode(e[o>>5]>>>o%32&255);return t}function T(e){var t=[];for(t[(e.length>>2)-1]=void 0,o=0;o<t.length;o+=1)t[o]=0;for(var n=8*e.length,o=0;o<n;o+=8)t[o>>5]|=(255&e.charCodeAt(o/8))<<o%32;return t}function D(e){for(var t,n="0123456789abcdef",o="",r=0;r<e.length;r+=1)t=e.charCodeAt(r),o+=n.charAt(t>>>4&15)+n.charAt(15&t);return o}function E(e){return unescape(encodeURIComponent(e))}function C(e){return A(x(T(e=E(e)),8*e.length))}function F(e,t){var n,e=E(e),t=E(t),o=T(e),r=[],i=[];for(r[15]=i[15]=void 0,16<o.length&&(o=x(o,8*e.length)),n=0;n<16;n+=1)r[n]=909522486^o[n],i[n]=1549556828^o[n];return t=x(r.concat(T(t)),512+8*t.length),A(x(i.concat(t),640))}function O(e,t,n){return t?n?F(t,e):D(F(t,e)):n?C(e):D(C(e))}function N(e){if(null!==e&&"object"===t(e))return e.src?g(e.src):e.href?g(e.href):e.innerText&&""!==e.innerText?g(e.innerText):void 0}function j(e){e.preventDefault(),e.stopPropagation()}var S="fa-kits-diag",M="fa-kits-node-under-test",k="data-md5",I="data-fa-detection-ignore",P="data-fa-detection-timeout",W="data-fa-detection-results-collection-max-wait";function _(e){var t=e.fn,i=void 0===t?function(){return!0}:t,n=void 0===(t=e.initialDuration)?1:t,c=void 0===(t=e.maxDuration)?l.FontAwesomeDetection.timeout:t,a=void 0!==(t=e.showProgress)&&t,s=e.progressIndicator;return new Promise(function(o,r){!function t(e,n){setTimeout(function(){var e=i();a&&console.info(s),e?o(e):(e=250+n)<=c?t(250,e):r("timeout")},e)}(n,0)})}function B(e){var t=e.nodesTested,e=e.nodesFound;l.FontAwesomeDetection=l.FontAwesomeDetection||{},l.FontAwesomeDetection.nodesTested=t,l.FontAwesomeDetection.nodesFound=e,l.FontAwesomeDetection.detectionDone=!0}function L(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:function(){},n={conflict:{},noConflict:{}},e=(l.onmessage=function(e){"file://"!==l.location.origin&&e.origin!==l.location.origin||e&&e.data&&("fontawesome-conflict"===e.data.type?n.conflict[e.data.md5]=e.data:"no-conflict"===e.data.type&&(n.noConflict[e.data.md5]=e.data))},function(t){for(var i=Array.from(u.scripts).filter(function(e){return!e.hasAttribute(I)&&e!==t}),c={},e=0;e<i.length;e++)!function(e){var t=u.createElement("iframe"),n=(t.setAttribute("style","display:none;"),u.createElement("script")),o=(n.setAttribute("id",M),N(i[e])),r=(n.setAttribute(k,o),c[o]=i[e],""!==i[e].src&&(n.src=i[e].src),""!==i[e].innerText&&(n.innerText=i[e].innerText),n.async=!0,u.createElement("script"));r.setAttribute("id",S),e="file://"===l.location.origin?"*":l.location.origin,r.innerText="(".concat(function(n,o,r){parent.FontAwesomeDetection.__pollUntil({fn:function(){return!!window.FontAwesomeConfig||!!window.FontAwesomeKitConfig}}).then(function(){var e=document.getElementById(n);parent.postMessage({type:"fontawesome-conflict",technology:"js",src:e.src,innerText:e.innerText,tagName:e.tagName,md5:o},r)}).catch(function(e){var t=document.getElementById(n);"timeout"===e?parent.postMessage({type:"no-conflict",src:t.src,innerText:t.innerText,tagName:t.tagName,md5:o},r):console.error(e)})}.toString(),")('").concat(M,"', '").concat(o,"', '").concat(e,"');"),t.onload=function(){t.contentWindow.addEventListener("error",j,!0),t.contentDocument.head.appendChild(r),t.contentDocument.head.appendChild(n)},d(function(){return u.body.appendChild(t)})}(e);return c}(u.currentScript)),o=c({},e,i=function(){var e=Array.from(u.getElementsByTagName("link")).filter(function(e){return!e.hasAttribute(I)}),t=Array.from(u.getElementsByTagName("style")).filter(function(e){return!(e.hasAttribute(I)||l.FontAwesomeConfig&&e.innerText.match(new RegExp("svg:not\\(:root\\)\\.".concat(l.FontAwesomeConfig.replacementClass))))});function n(e,t){var n=u.createElement("iframe"),o=(n.setAttribute("style","visibility: hidden; position: absolute; height: 0; width: 0;"),"fa-test-icon-"+t),r=u.createElement("i"),i=(r.setAttribute("class","fa fa-coffee"),r.setAttribute("id",o),u.createElement("script")),c=(i.setAttribute("id",S),"file://"===l.location.origin?"*":l.location.origin);i.innerText="(".concat(function(n,t,o,r){parent.FontAwesomeDetection.__pollUntil({fn:function(){var e=document.getElementById(t);return!(!(e=window.getComputedStyle(e).getPropertyValue("font-family")).match(/FontAwesome/)&&!e.match(/Font Awesome 5/))}}).then(function(){var e=document.getElementById(n);parent.postMessage({type:"fontawesome-conflict",technology:"webfont",href:e.href,innerText:e.innerText,tagName:e.tagName,md5:o},r)}).catch(function(e){var t=document.getElementById(n);"timeout"===e?parent.postMessage({type:"no-conflict",technology:"webfont",href:t.src,innerText:t.innerText,tagName:t.tagName,md5:o},r):console.error(e)})}.toString(),")('").concat(M,"', '").concat(o||"foo","', '").concat(t,"', '").concat(c,"');"),n.onload=function(){n.contentWindow.addEventListener("error",j,!0),n.contentDocument.head.appendChild(i),n.contentDocument.head.appendChild(e),n.contentDocument.body.appendChild(r)},d(function(){return u.body.appendChild(n)})}for(var o={},r=0;r<e.length;r++){var i=u.createElement("link"),c=(i.setAttribute("id",M),i.setAttribute("href",e[r].href),i.setAttribute("rel",e[r].rel),N(e[r]));i.setAttribute(k,c),o[c]=e[r],n(i,c)}for(var a=0;a<t.length;a++){var s=u.createElement("style"),f=(s.setAttribute("id",M),N(t[a]));s.setAttribute(k,f),s.innerText=t[a].innerText,o[f]=t[a],n(s,f)}return o}()),r=Object.keys(e).length+Object.keys(i).length,i=l.FontAwesomeDetection.timeout+l.FontAwesomeDetection.resultsCollectionMaxWait;console.group("Font Awesome Detector"),0===r?(console.info("%cAll Good!","color: green; font-size: large"),console.info("We didn't find anything that needs testing for conflicts. Ergo, no conflicts.")):(console.info("Testing ".concat(r," possible conflicts.")),console.info("We'll wait about ".concat(Math.round(l.FontAwesomeDetection.timeout/10)/100," seconds while testing these and\n")+"then up to another ".concat(Math.round(l.FontAwesomeDetection.resultsCollectionMaxWait/10)/100," to allow the browser time\n")+"to accumulate the results. But we'll probably be outta here way before then.\n\n"),console.info("You can adjust those durations by assigning values to these attributes on the <script> element that loads this detection:"),console.info("\t%c".concat(P,"%c: milliseconds to wait for each test before deciding whether it's a conflict."),"font-weight: bold;","font-size: normal;"),console.info("\t%c".concat(W,"%c: milliseconds to wait for the browser to accumulate test results before giving up."),"font-weight: bold;","font-size: normal;"),_({maxDuration:i,showProgress:!0,progressIndicator:"waiting...",fn:function(){return Object.keys(n.conflict).length+Object.keys(n.noConflict).length>=r}}).then(function(){console.info("DONE!"),B({nodesTested:n,nodesFound:o}),t({nodesTested:n,nodesFound:o}),console.groupEnd()}).catch(function(e){"timeout"===e?console.info("TIME OUT! We waited until we got tired. Here's what we found:"):(console.info("Whoops! We hit an error:",e),console.info("Here's what we'd found up until that error:")),B({nodesTested:n,nodesFound:o}),t({nodesTested:n,nodesFound:o}),console.groupEnd()}))}r=l.FontAwesomeDetection||{},r=c({},{report:function(e){var t,n=e.nodesTested,o=e.nodesFound,r={};for(t in o)n.conflict[t]||n.noConflict[t]||(r[t]=o[t]);if(0<(e=Object.keys(n.conflict).length)){console.info("%cConflict".concat(1<e?"s":""," found:"),"color: darkred; font-size: large");var i,c={};for(i in n.conflict){var a=n.conflict[i];c[i]={tagName:a.tagName,"src/href":a.src||a.href||"n/a","innerText excerpt":a.innerText&&""!==a.innerText?a.innerText.slice(0,200)+"...":"(empty)"}}console.table(c)}if(0<(e=Object.keys(n.noConflict).length)){console.info("%cNo conflict".concat(1<e?"s":""," found with ").concat(1==e?"this":"these",":"),"color: green; font-size: large");var s,f={};for(s in n.noConflict){var l=n.noConflict[s];f[s]={tagName:l.tagName,"src/href":l.src||l.href||"n/a","innerText excerpt":l.innerText&&""!==l.innerText?l.innerText.slice(0,200)+"...":"(empty)"}}console.table(f)}if(0<(e=Object.keys(r).length)){console.info("%cLeftovers--we timed out before collecting test results for ".concat(1==e?"this":"these",":"),"color: blue; font-size: large");var u,d={};for(u in r){var m=r[u];d[u]={tagName:m.tagName,"src/href":m.src||m.href||"n/a","innerText excerpt":m.innerText&&""!==m.innerText?m.innerText.slice(0,200)+"...":"(empty)"}}console.table(d)}},timeout:+(u.currentScript.getAttribute(P)||"2000"),resultsCollectionMaxWait:+(u.currentScript.getAttribute(W)||"5000")},r,{__pollUntil:_,md5ForNode:N,detectionDone:!1,nodesTested:null,nodesFound:null}),l.FontAwesomeDetection=r,o=function(){try{return"production"===process.env.NODE_ENV}catch(e){return!1}}();try{i&&a&&L(window.FontAwesomeDetection.report)}catch(e){if(!o)throw e}e.conflictDetection=L,Object.defineProperty(e,"__esModule",{value:!0})});