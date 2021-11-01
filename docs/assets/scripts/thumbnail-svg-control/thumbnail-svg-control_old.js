var ThumbnailSVGControl=function(r){var m,v=!0,d=document.getElementById(r.mainViewId),h=document.getElementById(r.mainSVGId),s=document.getElementById(r.thumbSVGId);const t="scopeContainer",u="control-panel";var p,g,C,S,L,a=!1;const c=r.thumbContainerId||"thumbViewContainer";let n=.2,o={pan:{x:0,y:0},zoom:0};var i=[],l=EventTarget.prototype.addEventListener;EventTarget.prototype.addEventListener=function(e,t,n){null==n&&(n=!1),this._addEventListener_original=l,this._addEventListener_original(e,t,n),this.eventListenerList||(this.eventListenerList={},i.push(this)),this.eventListenerList[e]||(this.eventListenerList[e]=[]),this.eventListenerList[e].push({listener:t,options:n})};var y,I,b,f,E,x,e,D,w,Z=EventTarget.prototype.removeEventListener;function z(e,t,n){let i=document.createElement(t);return i.id=n,i.appendChild(e),i}function A(e,t,n,i){return n*(e/i)+t}function P(e,t,n,i){if(0===n)return e.intervalPanID&&(clearInterval(e.intervalPanID),e.intervalPanID=null),e.pan(t),0;e.intervalPanID&&(clearInterval(e.intervalPanID),e.intervalPanID=null);var i=(i=i||60)*(n=n||.5),o=n/i,l=0,a=e.getPan(),r=e.getPan();t.x,a.x,t.y,a.y,e.intervalPanID=setInterval(function(){l+=o,r.x=A(l,a.x,t.x-a.x,n),r.y=A(l,a.y,t.y-a.y,n),l<n?e.pan(r):(clearInterval(e.intervalPanID),e.intervalPanID=null)},o)}function N(e,t,n,i,o=void 0){if(0===n)return e.intervalZoomID&&(clearInterval(e.intervalZoomID),e.intervalZoomID=null),e.zoom(t),0;e.intervalZoomID&&(clearInterval(e.intervalZoomID),e.intervalZoomID=null);var i=(i=i||60)*(n=n||.5),l=n/i,a=0,r=e.getZoom(),s=r;e.intervalZoomID=setInterval(function(){s=A(a+=l,r,t-r,n),Math.abs(t-r)<.001&&(s=t,e.zoom(s),clearInterval(e.intervalZoomID),e.intervalZoomID=null,o&&o()),a<n?e.zoom(s):(clearInterval(e.intervalZoomID),e.intervalZoomID=null,o&&o())},l)}function $(){var e=T(h);return r.onMainViewSVGLoaded&&r.onMainViewSVGLoaded(e),svgPanZoom("#"+r.mainSVGId,{zoomEnabled:!0,controlIconsEnabled:!1,fit:!0,center:!0,beforeZoom:function(e,t){return v=!0},preventMouseEventsDefault:!0,mouseWheelZoomEnabled:!1,zoomScaleSensitivity:n,customEventsHandler:{haltEventListeners:["wheel"],init:function(e){var t="onwheel"in document.createElement("div")?"wheel":void 0!==document.onmousewheel?"mousewheel":"DOMMouseScroll";w=function(t){let n=S;if(n.isZoomEnabled()){t.preventDefault();var i=t.deltaY||1,o=Date.now()-n.lastMouseWheelEventTime,l=3+Math.max(0,30-o);n.lastMouseWheelEventTime=Date.now();var i=-.3<(i="deltaMode"in t&&0===t.deltaMode&&t.wheelDelta?0===t.deltaY?0:Math.abs(t.wheelDelta)/t.deltaY:i)&&i<.3?i:(0<i?1:-1)*Math.log(Math.abs(i)+10)/l,a=h.getScreenCTM().inverse(),r=h.createSVGPoint(),s=m.getBoundingClientRect(),u=S.getSizes().realZoom,o=(L.getSizes().width,L.getSizes().height,L.getSizes().realZoom);let e={x:(l=h.getBoundingClientRect()).x+l.width/2,y:l.y+l.height/2};this===h?(r.x=t.clientX,r.y=t.clientY,e=r.matrixTransform(a)):this===p&&(l=t.clientX,t=t.clientY,l-=s.left+s.width/2,s=(t-=s.top+s.height/2)*u/o,r.x=l*u/o,r.y=s,e=r.matrixTransform(a),console.log({t:"thumb",x:l,y:t}),console.log({t:"mouse"},e)),i=Math.pow(1+n.zoomScaleSensitivity,-1*i),function(e,t,n){e.intervalZoomID&&(clearInterval(e.intervalZoomID),e.intervalZoomID=null);var i,o=0,l=e.getZoom(),a=l*t;e.intervalZoomID=setInterval(function(){i=A(o+=.2/12,l,a-l,.2),o<.2?e.zoomAtPoint(i,n):(clearInterval(e.intervalZoomID),e.intervalZoomID=null)},.2/12)}(n,i,e,animationTime=.2)}},e.svgElement.addEventListener(t,w)},destroy:function(e){S.intervalZoomID&&(clearInterval(S.intervalZoomID),S.intervalZoomID=null),S.intervalPanID&&(clearInterval(S.intervalPanID),S.intervalPanID=null),e.svgElement.removeAllEventListener(),d.removeAllEventListener(),B.unobserve(d),h.removeAllEventListener();let t=document.querySelector("#zoom-in"),n=document.querySelector("#zoom-out"),i=document.querySelector("#zoom-reset");t.removeEventListener("click",b),n.removeEventListener("click",I),i.removeEventListener("click",y)}}})}function M(){var e=T(s);return r.onThumbnailSVGLoaded&&r.onThumbnailSVGLoaded(e),e=svgPanZoom(`#${s.id}`,{zoomEnabled:!0,panEnabled:!1,controlIconsEnabled:!1,dblClickZoomEnabled:!1,preventMouseEventsDefault:!1,customEventsHandler:{init:function(e){var t="onwheel"in document.createElement("div")?"wheel":void 0!==document.onmousewheel?"mousewheel":"DOMMouseScroll";p.addEventListener(t,w)},destroy:function(e){L.intervalZoomID&&(clearInterval(L.intervalZoomID),L.intervalZoomID=null),L.intervalPanID&&(clearInterval(L.intervalPanID),L.intervalPanID=null),s.removeAllEventListener(),p.removeAllEventListener(),m.removeAllEventListener()}}}),m=document.getElementById(t),e}EventTarget.prototype.removeEventListener=function(t,e,n){null==n&&(n=!1),this._removeEventListener_original=Z,this._removeEventListener_original(t,e,n),this.eventListenerList||(this.eventListenerList={}),this.eventListenerList[t]||(this.eventListenerList[t]=[]);for(let e=0;e<this.eventListenerList[t].length;e++)if(this.eventListenerList[t][e].listener,this.eventListenerList[t][e].options==n){this.eventListenerList[t].splice(e,1);break}0==this.eventListenerList[t].length&&(delete this.eventListenerList[t],i.splice(i.indexOf(this),1))},EventTarget.prototype.removeAllEventListener=function(){Object.keys(this.eventListenerList).forEach(e=>{for(;0<this.eventListenerList[e].length;){var t=this.eventListenerList[e][0].listener,n=this.eventListenerList[e][0].options;if(this.removeEventListener(e,t,n),!(e in this.eventListenerList))break}})};var T=function(e){var t=e.contentDocument;return t||"function"==typeof e.getSVGDocument&&(t=e.getSVGDocument()),t};!function(){p=document.getElementById(r.thumbContainerId);var c="http://www.w3.org/2000/svg",e=document.createElementNS(c,"rect");e.id="scope",e.setAttributeNS(null,"x","0"),e.setAttributeNS(null,"y","0"),e.setAttributeNS(null,"height","0"),e.setAttributeNS(null,"width","0"),e.setAttributeNS(null,"fill","#ff00ff"),e.setAttributeNS(null,"fill-opacity","0.4"),e.setAttributeNS(null,"stroke","none");var t=document.createElementNS(c,"line");t.id="line1",t.setAttributeNS(null,"stroke","none"),t.setAttributeNS(null,"x1","0"),t.setAttributeNS(null,"y1","0"),t.setAttributeNS(null,"x2","0"),t.setAttributeNS(null,"y2","0");var n=document.createElementNS(c,"line");n.id="line2",n.setAttributeNS(null,"stroke","none"),n.setAttributeNS(null,"x1","0"),n.setAttributeNS(null,"y1","0"),n.setAttributeNS(null,"x2","0"),n.setAttributeNS(null,"y2","0");var i=document.createElementNS(c,"g");i.appendChild(e),i.appendChild(t),i.appendChild(n),(t=document.createElementNS(c,"svg")).id="scopeContainer",t.classList.add("thumbViewClass"),t.appendChild(i),(s=h.cloneNode(!0)).style="",s.id="thumbSVG",(n=z(s,newWrapType="div",newWrapId="thumbView")).classList.add("thumbViewClass");let o=document.createElement("div");o.id="masked",p?(p.appendChild(o),p.appendChild(t)):(p=z(o,newWrapType="div",newWrapId="thumbViewContainer")).appendChild(t),p.appendChild(n);let l=document.createElement("div");l.classList.add("control-zoom"),t=(i=function(e,t){let n=document.createElementNS(c,"svg"),i=document.createElementNS(c,"g");n.classList.add("lens"),i.classList.add("main");let o=document.createElementNS(c,"circle"),l=document.createElementNS(c,"clipPath"),a=document.createElementNS(c,"g");o.setAttributeNS(null,"r","100%"),o.setAttributeNS(null,"cx","50%"),o.setAttributeNS(null,"cy","50%"),o.setAttributeNS(null,"style",`clip-path: url(#clip-${t});opacity: 0.6; fill: black;`),l.id=`clip-${t}`,a.classList.add("gradient");let r=document.createElement("div");r.id=t,r.classList.add("icon");let s=document.createElementNS(c,"path");s.setAttributeNS(null,"d",e);let u=document.createElementNS(c,"path");return u.setAttributeNS(null,"d",e),u.style.transform="translate(-35%, -35%) scale(0.06)",u.style.transformOrigin="center",l.appendChild(u),a.appendChild(s),i.appendChild(a),i.style.transform="translate(-35%, -35%) scale(0.06)",i.style.transformOrigin="center",n.appendChild(o),n.appendChild(l),n.appendChild(i),r.appendChild(n),r})("M 420.67 210.335 C 420.67 257.269 405.298 300.613 379.313 335.606 L 502.948 459.241 C 515.017 471.31 515.017 490.879 502.948 502.948 C 490.879 515.017 471.31 515.017 459.241 502.948 L 335.606 379.313 C 300.613 405.298 257.269 420.67 210.335 420.67 C 94.17 420.67 0 326.5 0 210.335 C 0 94.17 94.17 0 210.335 0 C 326.5 0 420.67 94.17 420.67 210.335 Z M 323.979 185.927 L 239.965 185.927 C 237.236 185.927 235.022 183.715 235.022 180.986 L 235.022 96.971 C 235.022 83.325 223.959 72.261 210.312 72.261 C 196.666 72.261 185.602 83.325 185.602 96.971 L 185.602 180.986 C 185.602 183.715 183.39 185.927 180.661 185.927 L 96.646 185.927 C 83 185.927 71.936 196.991 71.936 210.637 C 71.936 224.284 83 235.349 96.646 235.349 L 180.661 235.349 C 183.39 235.349 185.602 237.561 185.602 240.29 L 185.602 324.305 C 185.602 337.951 196.666 349.015 210.312 349.015 C 223.959 349.015 235.022 337.951 235.022 324.305 L 235.022 240.29 C 235.022 237.561 237.236 235.349 239.965 235.349 L 323.979 235.349 C 337.625 235.349 348.69 224.284 348.69 210.637 C 348.69 196.991 337.625 185.927 323.979 185.927 Z","zoom-in"),n=i("M 420.67 210.335 C 420.67 257.269 405.298 300.613 379.313 335.606 L 502.948 459.241 C 515.017 471.31 515.017 490.879 502.948 502.948 C 490.879 515.017 471.31 515.017 459.241 502.948 L 335.606 379.313 C 300.613 405.298 257.269 420.67 210.335 420.67 C 94.17 420.67 0 326.5 0 210.335 C 0 94.17 94.17 0 210.335 0 C 326.5 0 420.67 94.17 420.67 210.335 Z M 323.979 185.927 L 96.646 185.927 C 83 185.927 71.936 196.991 71.936 210.637 C 71.936 224.284 83 235.349 96.646 235.349 L 323.979 235.349 C 337.625 235.349 348.69 224.284 348.69 210.637 C 348.69 196.991 337.625 185.927 323.979 185.927 Z","zoom-out"),i=i("M 420.67 210.335 C 420.67 257.269 405.298 300.613 379.313 335.606 L 502.948 459.241 C 515.017 471.31 515.017 490.879 502.948 502.948 C 490.879 515.017 471.31 515.017 459.241 502.948 L 335.606 379.313 C 300.613 405.298 257.269 420.67 210.335 420.67 C 94.17 420.67 0 326.5 0 210.335 C 0 94.17 94.17 0 210.335 0 C 326.5 0 420.67 94.17 420.67 210.335 Z M 348.273 94.961 C 338.364 94.961 330.333 102.994 330.333 112.902 L 330.333 141.72 C 319.644 123.116 304.763 107.22 286.708 95.246 C 264.036 80.21 237.619 72.261 210.313 72.261 C 191.639 72.261 173.515 75.923 156.445 83.144 C 139.964 90.114 125.167 100.088 112.465 112.791 C 99.763 125.494 89.788 140.291 82.817 156.77 C 75.597 173.842 71.936 191.966 71.936 210.638 C 71.936 229.311 75.597 247.435 82.817 264.506 C 89.788 280.987 99.764 295.783 112.465 308.485 C 125.168 321.188 139.965 331.163 156.445 338.134 C 173.515 345.354 191.64 349.015 210.313 349.015 C 226.259 349.015 241.899 346.322 256.798 341.009 C 271.197 335.874 284.579 328.416 296.574 318.845 C 308.449 309.366 318.628 298.085 326.828 285.314 C 335.181 272.303 341.246 258.105 344.853 243.113 C 347.171 233.48 341.242 223.791 331.608 221.473 C 321.973 219.155 312.285 225.085 309.967 234.719 C 304.682 256.689 291.976 276.605 274.19 290.799 C 265.306 297.891 255.399 303.413 244.747 307.211 C 233.726 311.141 222.141 313.134 210.313 313.134 C 182.936 313.134 157.196 302.472 137.838 283.113 C 118.479 263.754 107.817 238.015 107.817 210.637 C 107.817 183.261 118.479 157.521 137.838 138.163 C 157.197 118.804 182.936 108.142 210.313 108.142 C 230.542 108.142 250.102 114.022 266.876 125.148 C 281.332 134.735 293.04 147.704 301.051 162.925 L 281.223 162.925 C 271.314 162.925 263.282 170.957 263.282 180.865 C 263.282 190.774 271.314 198.806 281.223 198.806 L 348.273 198.806 C 358.182 198.806 366.214 190.774 366.214 180.865 L 366.214 112.902 C 366.214 102.994 358.182 94.961 348.273 94.961 Z","zoom-reset"),l.appendChild(t),l.appendChild(n),l.appendChild(i);let a=document.createElement("div");a.classList.add(u),a.appendChild(p),a.appendChild(l),n=d,i=a,n.parentNode.insertBefore(i,n.nextSibling)}(),D=function(e){S=$()},e=function(e){L=M()},h.addEventListener("load",D,!1),s.addEventListener("load",e,!1),S=$(),L=M(),function(){if(S&&L){function i(e,t=!1){var n,i,o,l,a,r,s,u,c;0==e.buttons&&0==e.button||1!=e.buttons||([n,i,o,l,a=!1]=[e.clientX,e.clientY,S,L,t],r=m.getBoundingClientRect(),d.getBoundingClientRect(),o.getSizes().width,o.getSizes().height,s=o.getSizes().realZoom,u=l.getSizes().width,c=l.getSizes().height,e=l.getSizes().realZoom,l=(t=document.querySelector("#scope").getBoundingClientRect()).x+t.width/2,t=t.y+t.height/2,u=-((n||l)-(r.left+u/2-g))*s/e,e=-((i||t)-(r.top+c/2-C))*s/e,S.getPan(),a?o.intervalPanID||o.pan({x:u,y:e}):P(o,{x:u,y:e},animateTime=.5))}S.setOnZoom(function(e){L.updateThumbScope()}),S.setOnPan(function(e){L.updateThumbScope()}),S.setZoomScaleSensitivityAux=function(e){S.zoomScaleSensitivity=e,S.setZoomScaleSensitivity(e)},L.updateThumbScope=function(){var e=document.getElementById("scope"),t=document.getElementById("line1"),n=document.getElementById("line2"),i=L,o=e,l=t,a=n,r=(c=S).getPan().x,s=c.getPan().y,u=c.getSizes().width,e=c.getSizes().height,t=c.getSizes().realZoom,n=i.getPan().x,c=i.getPan().y,r=n-r*(t=i.getSizes().realZoom/t),s=c-s*t;u*=t,t*=e,o.setAttribute("x",r),o.setAttribute("y",s),o.setAttribute("width",u),o.setAttribute("height",t),l.setAttribute("x1",1+r),l.setAttribute("y1",1+s),l.setAttribute("x2",1+r+u-2),l.setAttribute("y2",1+s+t-2),a.setAttribute("x1",1+r),a.setAttribute("y1",1+s+t-2),a.setAttribute("x2",1+r+u-2),a.setAttribute("y2",1+s),v&&(t=(l=document.querySelector("#scope").getBoundingClientRect()).x+l.width/2,u=l.y+l.height/2,a=m.getBoundingClientRect(),l=i.getSizes().width,i=i.getSizes().height,g=r-(n+(t-a.left-l/2)),C=s-(c+(u-a.top-i/2)),v=!1),a=document.querySelector("#scope").getBBox();let d=document.querySelector("#masked");a.x,a.y,a.width,a.height,a.x,a.y,a.width,a.height,i="linear-gradient(to top,"+` transparent calc(100% - ${a.y}px),`+` white calc(100% - ${a.y}px)`+"),linear-gradient(to bottom,"+` transparent calc(${a.y}px + ${a.height}px),`+` white calc(${a.y}px + ${a.height}px)`+"),linear-gradient(to left,"+` transparent calc(100% - ${a.x}px),`+` white calc(100% - ${a.x}px)`+"),linear-gradient(to right,"+` transparent calc(${a.x}px + ${a.width}px),`+` white calc(${a.x}px + ${a.width}px)`+")",a="polygon(0% 0%, 0% 100%, "+`${a.x}px 100%, `+`${a.x}px ${a.y}px, `+`calc(${a.x}px + ${a.width}px) ${a.y}px, `+`calc(${a.x}px + ${a.width}px) calc(${a.y}px + ${a.height}px), `+`${a.x}px calc(${a.y}px + ${a.height}px), `+`${a.x}px 100%, `+`${a.x}px 100%, `+"100% 100%, 100% 0%)",d.style.clipPath=a,d.style.webkitMask=i,d.style.mask=i},L.updateThumbScope(),E=function(e){e.preventDefault(),i(e,move=!(a=!0))},x=function(e){e.preventDefault(),a=!1},f=function(e){e.preventDefault(),a&&i(e,move=!0)},m.addEventListener("mouseup",x),m.addEventListener("mousedown",E),m.addEventListener("mousemove",f),f=function(e){a=!1,e.preventDefault();let t=getComputedStyle(document.querySelector(`#${c}`)).transitionDuration;e=t.match(/(\d*(?:\.\d+)?)(.+)/);let n,i=0,o;t&&e&&([n,i,o]=e,i=parseFloat(i),"s"===o&&(i*=1e3));let l=setInterval(function(){L.resize(),L.fit(),L.center(),L.updateThumbScope()},15);setTimeout(function(){clearInterval(l)},i)},m.addEventListener("mouseenter",f),m.addEventListener("mouseleave",f),d.addEventListener("mouseleave",f);let e=document.querySelector("#zoom-in"),t=document.querySelector("#zoom-out"),n=document.querySelector("#zoom-reset");b=function(e){N(S,S.getZoom()+S.zoomScaleSensitivity)},I=function(e){N(S,S.getZoom()-S.zoomScaleSensitivity)},y=function(e){N(S,o.zoom),P(S,o.pan)},e.addEventListener("click",b),t.addEventListener("click",I),n.addEventListener("click",y)}}(),S.setZoomScaleSensitivityAux(n),r.onMainViewShown&&r.onMainViewShown(mainViewSVGDoc,_main_svg),S.lastMouseWheelEventTime=Date.now(),r.onThumbnailShown&&r.onThumbnailShown(thumbViewSVGDoc,L),N(S,.9*S.getZoom(),animationTime=1,fps=60,callback=function(){o.pan=S.getPan(),o.zoom=S.getZoom()}),L.zoomBy(.8),L.updateThumbScope();var V=!0;const B=new ResizeObserver(e=>{for(var t of e){var n=t.target.getBoundingClientRect(),i=m.getBoundingClientRect();0<n.width&&0<n.height&&t.target===d&&(v=!0,V||(V=!1,S.intervalZoomID&&(clearInterval(S.intervalZoomID),S.intervalZoomID=null),S.intervalPanID&&(clearInterval(S.intervalPanID),S.intervalPanID=null),L.intervalZoomID&&(clearInterval(L.intervalZoomID),L.intervalZoomID=null),L.intervalPanID&&(clearInterval(L.intervalPanID),L.intervalPanID=null)),S.resize(),0<i.width&&0<i.height&&(L.resize(),L.resetZoom(),L.zoomOut(),L.zoomOut(),L.center(!0),L.updateThumbScope()),i={zoom:S.getZoom(),pan:S.getPan()},S.reset(),S.zoomBy(.8),o.pan=S.getPan(),o.zoom=S.getZoom(),S.zoom(i.zoom),S.pan(i.pan))}});return B.observe(d),[S,L,function(){S.destroy(),delete S,L.destroy(),delete L,d.parentElement.getElementsByClassName(u)[0].remove()}]};