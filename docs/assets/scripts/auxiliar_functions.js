function Kit(){function f(n,r){return n<r?l:n===r?s:h}function t(n,r,t){var e,o,u=0,i=n.length,c=i-1;if(!(i<1)){if(t=t||f,1===i)return t(r,n[u])===s?u:-1;if(t(r,n[u])!==l&&t(r,n[c])!==h)do{if((o=t(r,n[e=u+(c-u+1>>1)]))===s)return e}while(o===l?c=e-1:u=e+1,u<=c)}return-1}function y(n){var r=n.length;if(r<=1)return n;for(var t,e=1,o=r/3|0;e<o;)e=3*e+1;for(;0<e;){for(i=e;i<r;i++)for(c=i;e<=c&&n[c]<n[c-e];c-=e)t=n[c],n[c]=n[c-e],n[c-e]=t;e=e/3|0}for(var u=n[0],i=1,c=1;i<r;i++)n[i]!==u&&(u=n[c++]=n[i]);return n.length=c,n.length===c?n:a(n,c)}function a(n,r){r=void 0===r?n.length:r;for(var t=new n.constructor(r),e=r;e--;)t[e]=n[e];return t}function o(n){for(var r,t,e,o,u,i,c=(n=y(n=n.map(function(n){return n[1]?n:n+n}))).length,f=Object.create(null),a=Object.create(null),l=Object.create(null),s=0;s<c;s++)for(i=(o=n[s])[1],a[o[0]]=!0,l[i]=!0,r=s;r<c;r++)if((u=n[r][0])>=i){u===i&&(f[i]=!0);break}for(var h=y(n.join("").split("")),p=Object.keys(f),g=h[0],d=Object.create(null),v=Object.create(null),s=0;s<c;s++)d[n[s]]=[];if(f[g])for(s=0;s<c;s++)if((o=n[s])[0]===g)d[o].push(g);else if(o[0]>g)break;for(s=0,e=h.length-1;s<e;s++){if(u=h[s],i=h[s+1],(u=l[u]?w(u):u)<=(i=a[i]?C(i):i))for(g=u===i?u:u+i,r=0;r<c&&!((o=n[r])[0]>i);r++)o[0]<=u&&i<=o[1]&&(d[o].push(g),p.push(g));if(u=h[s],f[i=h[s+1]])for(r=0;r<c&&!((o=n[r])[0]>i);r++)o[0]<=i&&i<=o[1]&&d[o].push(i)}for(t in p=y(p),d)v[t[0]===t[1]?t[0]:t]=d[t];return{ranges:p,map:v}}function u(n){var r,t=String.fromCharCode(65535),e=(n=o(n).ranges,[]);return n.length&&("\0"!==n[0][0]&&n.unshift(t),(n[r=n.length-1][1]||n[r][0])!==t&&n.push("\0"),n.reduce(function(n,r){var n=w(n[1]||n[0]),t=C(r[0]);return n<t&&e.push(n+t),n===t&&e.push(n),r})),e}function i(n){return n.charCodeAt(0)}function C(n){return String.fromCharCode(n.charCodeAt(0)-1)}function w(n){return String.fromCharCode(n.charCodeAt(0)+1)}var e=Array.prototype.slice,c=function(){return"[object Window]"===this.toString()}(),l=-1,s=0,h=1,p={"\n":"\\n","\t":"\\t","\f":"\\f","\r":"\\r"," ":" ","\\":"\\\\","\0":"\\0"};return{sortUnique:y,idUnique:function(n){for(var r,t,e=n.length,o=(1e10*Math.random()).toString(32)+(+new Date).toString(32),u=r=0;u<e;u++)null==(t=n[u])||t.hasOwnProperty(o)||(Object.defineProperty(t,o,{value:1,enumerable:!1}),n[r++]=t);for(u=r;u--;)n[u][o]=void 0;return n.length=r,n},hashUnique:function(n){for(var r,t={},e=0,o=0,u=n.length;e<u;e++)r=n[e],t.hasOwnProperty(r)||(t[r]=1,n[o++]=r);return n.length=o,n},Set:function i(c,n){return c._Set||((c=n?c:y(c)).contains=function(n,r){return!!~t(c,n,r)},c.indexOf=function(n,r){return t(c,n,r)},c.toArray=function(){return a(c)},c.union=function(n){n=i(n);for(var r=c.length+n.length,t=new c.constructor(r),e=0,o=0,u=0;u<r;u++)c[e]===n[o]?(t[u]=c[e++],o++,r--):c[e]<n[o]?t[u]=c[e++]:t[u]=n[o++];return t.length=r,i(t.length===r?t:a(t,r),!0)},c.inspect=c.toArray,c._Set=!0),c},repeats:function(n,r){return new Array(r+1).join(n)},negate:u,coalesce:function(n){if(!n.length)return[];var e=[n[0]];return n.reduce(function(n,r){var t=e.length-1;return n[n.length-1]===C(r[0])?e[t]=e[t][0]+r[r.length-1]:(e.push(r),r)}),e.reduce(function(n,r){return 2===r.length&&r[0]===C(r[1])?(n.push(r[0]),n.push(r[1])):n.push(r),n},[])},classify:o,parseCharset:function(n){n=n.split("");var r=[],t=[],e="^"===n[0]&&1<n.length&&n.shift();return n.forEach(function(n){if("-"==r[0]&&1<r.length){if(r[1]>n)throw new Error("Charset range out of order:"+r[1]+"-"+n+"!");t.push(r[1]+n),r.splice(0,2)}else r.unshift(n)}),t=t.concat(r),e?u(t):o(t).ranges},chr:function(n){return String.fromCharCode(n)},ord:i,pred:C,succ:w,toPrint:function(n,r){var t=/[\x00-\x1F\x7F-\x9F]/,e=/[\u009F-\uFFFF]/;return n.split("").map(function(n){return!r&&p.hasOwnProperty(n)?p[n]:e.test(n)?"\\u"+("00"+i(n).toString(16).toUpperCase()).slice(-4):t.test(n)?"\\x"+("0"+i(n).toString(16).toUpperCase()).slice(-2):n}).join("")},flatten2:function(n){return[].concat.apply([],n)},log:function(){var r,n=e.call(arguments);c?Function.prototype.apply.apply(console.log,[console,n]):(r=require("util"),n.forEach(function(n){console.log(r.inspect(n,{showHidden:!1,customInspect:!0,depth:64,colors:!0}))}))},isBrowser:c,locals:function(n){for(var r,t=n.toString(),e=/^\s+function\s+([a-zA-Z]\w+)\s*\(/gm,o=[];r=e.exec(t);)o.push(r[1]);for(var u=[];n=o.pop();)u.push(n+":"+n);return"{\n"+u.join(",\n")+"\n}"}}}