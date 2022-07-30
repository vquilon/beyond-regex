var JsonView=function(e){"use strict";function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(e){0<e.children.length&&(e=e.el.querySelector(".fas"))&&e.classList.replace("fa-caret-right","fa-caret-down")}function o(e){0<e.children.length&&(e=e.el.querySelector(".fas"))&&e.classList.replace("fa-caret-down","fa-caret-right")}function a(e){var n=c(e);return Array.isArray(e)&&(n="array"),null===e?"null":n}function i(e,n){n(e),0<e.children.length&&e.children.forEach(function(e){i(e,n)})}function d(e){return{key:(e=0<arguments.length&&void 0!==e?e:{}).key||null,parent:e.parent||null,value:e.hasOwnProperty("value")?e.value:null,isExpanded:e.isExpanded||!1,type:e.type||null,children:e.children||[],el:e.el||null,depth:e.depth||0}}function t(e){var n="string"==typeof e?JSON.parse(e):e;return function e(n,t){if("object"===c(n))for(var i in n){var r=d({value:n[i],key:i,depth:t.depth+1,type:a(n[i]),parent:t});t.children.push(r),e(n[i],r)}}(n,e=d({value:n,key:a(n),type:a(n)})),e}function r(e,n){(t=document.createElement("div")).className="json-container";var t,a=t;i(e,function(e){var n,t,i,r;e.el=(n=e,r=document.createElement("div"),0<n.children.length?(r.innerHTML=function(e){var e=(n=0<arguments.length&&void 0!==e?e:{}).key,n=n.size;return'\n    <div class="line">\n      <div class="caret-icon"><i class="fas fa-caret-right"></i></div>\n      <div class="json-key">'.concat(e,'</div>\n      <div class="json-size">').concat(n,"</div>\n    </div>\n  ")}({key:n.key,size:(i=(t=n).children.length,"array"===t.type?"[".concat(i,"]"):"object"===t.type?"{".concat(i,"}"):null)}),r.querySelector(".caret-icon").addEventListener("click",function(){var e;(e=n).isExpanded?(e.isExpanded=!1,o(e),function n(e){e.children.forEach(function(e){e.el.classList.add("hide"),e.isExpanded&&n(e)})}(e)):(e.isExpanded=!0,l(e),function n(e){e.children.forEach(function(e){e.el.classList.remove("hide"),e.isExpanded&&n(e)})}(e))})):r.innerHTML=function(e){var n=(t=0<arguments.length&&void 0!==e?e:{}).key,e=t.value,t=t.type;return'\n    <div class="line">\n      <div class="empty-icon"></div>\n      <div class="json-key">'.concat(n,'</div>\n      <div class="json-separator">:</div>\n      <div class="json-value json-').concat(t,'">').concat(e,"</div>\n    </div>\n  ")}({key:n.key,value:n.value,type:c(n.value)}),r=r.children[0],null!==n.parent&&r.classList.add("hide"),r.style="margin-left: "+18*n.depth+"px;",r),a.appendChild(e.el)}),n.appendChild(a)}return e.collapseChildren=function(n){i(n,function(e){e.isExpanded=!1,e.depth>n.depth&&e.el.classList.add("hide"),o(e)})},e.createTree=t,e.expandChildren=function(e){i(e,function(e){e.el.classList.remove("hide"),e.isExpanded=!0,l(e)})},e.render=r,e.renderJSON=function(e,n){return r(e=t("string"==typeof e?JSON.parse(e):e),n),e},e.traverseTree=i,e}({});