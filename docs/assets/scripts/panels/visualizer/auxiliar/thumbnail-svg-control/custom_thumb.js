var CustomThumbnailSVGControl=function(r){var C,s={viewportSelector:"."+r.mainViewPortClass,panEnabled:!0,controlIconsEnabled:!1,zoomEnabled:!0,dblClickZoomEnabled:!0,mouseWheelZoomEnabled:!0,preventMouseEventsDefault:!0,zoomScaleSensitivity:.1,minZoom:.5,maxZoom:10,fit:!0,contain:!1,center:!0,refreshRate:"auto",beforeZoom:null,onZoom:null,beforePan:null,onPan:null,customEventsHandler:null,eventsListenerElement:null,onUpdatedCTM:null},d=(void 0===r.thumbnailViewport&&(r.thumbnailViewport=s),!0),L={pan:!0,zoom:!0},u=document.getElementById(r.mainViewId),y=document.getElementById(r.mainSVGId),a=document.getElementById(r.thumbSVGId);const c="control-panel";var b,p,h,w,o=!1;r.thumbContainerId;let i={pan:{x:0,y:0},zoom:0};var l,m,v,n,S=[],k=EventTarget.prototype.addEventListener,q=(EventTarget.prototype.addEventListener=function(e,t,n){null==n&&(n={passive:!1}),this._addEventListener_original=k,this._addEventListener_original(e,t,n),this.eventListenerList||(this.eventListenerList={},S.push(this)),this.eventListenerList[e]||(this.eventListenerList[e]=[]),this.eventListenerList[e].push({listener:t,options:n})},EventTarget.prototype.removeEventListener);function g(e,t,n){let o=document.createElement(t);return o.id=n,o.appendChild(e),o}function E(e,t,n,o){return n*(e/o)+t}function z(t,n,o,i){var l=1e3/t,r=0,s=null,a=1/t;function c(e){r+=a,null===s&&(s=e);Math.floor((e-s)/l);r<n?(o(this,r),this.requestAnimationRef=requestAnimationFrame(c)):(cancelAnimationFrame(this.requestAnimationRef),this.requestAnimationRef=void 0,i&&i())}this.requestAnimationRef=void 0,this.isPlaying=!1,this.frameRate=function(e){if(!arguments.length)return t;l=1e3/(t=e),a=1/t,s=null},this.start=function(){this.isPlaying||(this.isPlaying=!0,this.requestAnimationRef=requestAnimationFrame(c))},this.stop=function(){this.isPlaying&&(cancelAnimationFrame(this.requestAnimationRef),this.isPlaying=!1,s=null,r=0,0)}}function f(n,o,i,e,t=void 0){var l,r;L.pan?0===i?(n.panFPScontrol&&n.panFPScontrol.stop(),n.pan(o),t&&t()):(n.panFPScontrol&&n.panFPScontrol.stop(),i=i||.5,e=e||60,l=n.getPan(),r=n.getPan(),n.panFPScontrol=new z(e,i,(e,t)=>{r.x=E(t,l.x,o.x-l.x,i),r.y=E(t,l.y,o.y-l.y,i),n.pan(r)},t),n.panFPScontrol.start()):(n.pan(o),t&&t())}function x(n,o,i,e,t=void 0){var l,r;L.zoom?(n.zoomFPScontrol&&n.zoomFPScontrol.stop(),0===i?(n.zoom(o),t&&t()):(i=i||.5,e=e||60,l=n.getZoom(),r=l,n.zoomFPScontrol=new z(e,i,(e,t)=>{r=E(t,l,o-l,i),Math.abs(o-l)<.001?(r=o,n.zoom(r),e.stop()):n.zoom(r)},t),n.zoomFPScontrol.start())):(n.zoom(o),t&&t())}EventTarget.prototype.removeEventListener=function(t,e,n){null==n&&(n=!1),this._removeEventListener_original=q,this._removeEventListener_original(t,e,n),this.eventListenerList||(this.eventListenerList={}),this.eventListenerList[t]||(this.eventListenerList[t]=[]);for(let e=0;e<this.eventListenerList[t].length;e++)if(this.eventListenerList[t][e].listener,this.eventListenerList[t][e].options==n){this.eventListenerList[t].splice(e,1);break}0==this.eventListenerList[t].length&&(delete this.eventListenerList[t],S.splice(S.indexOf(this),1))},EventTarget.prototype.removeAllEventListener=function(){Object.keys(this.eventListenerList).forEach(e=>{for(;0<this.eventListenerList[e].length;){var t=this.eventListenerList[e][0].listener,n=this.eventListenerList[e][0].options;if(this.removeEventListener(e,t,n),!(e in this.eventListenerList))break}})};function e(e){var t=e.contentDocument;return t||"function"==typeof e.getSVGDocument&&(t=e.getSVGDocument()),t}A=e(y),r.onMainViewSVGLoaded&&r.onMainViewSVGLoaded(A),w=A=svgPanZoom("#"+r.mainSVGId,{viewportSelector:s.viewportSelector,zoomEnabled:!0,controlIconsEnabled:!1,fit:!0,center:!0,beforeZoom:function(e,t){return d=!0},preventMouseEventsDefault:!0,minZoom:.8,maxZoom:1/0,mouseWheelZoomEnabled:!1,zoomScaleSensitivity:.2,customEventsHandler:{haltEventListeners:["wheel"],init:function(e){var t="onwheel"in document.createElement("div")?"wheel":void 0!==document.onmousewheel?"mousewheel":"DOMMouseScroll";n=function(t){let n=w;if(n.isZoomEnabled()){t.preventDefault();var o,i,l=t.deltaY||1,r=Date.now()-n.lastMouseWheelEventTime,r=3+Math.max(0,30-r),r=(n.lastMouseWheelEventTime=Date.now(),l=-.3<(l="deltaMode"in t&&0===t.deltaMode&&t.wheelDelta?0===t.deltaY?0:Math.abs(t.wheelDelta)/t.deltaY:l)&&l<.3?l:(0<l?1:-1)*Math.log(Math.abs(l)+10)/r,y.getScreenCTM().inverse()),s=y.createSVGPoint(),a=(C.getBoundingClientRect(),w.getSizes().realZoom,T.getSizes().width,T.getSizes().height,T.getSizes().realZoom,y.getBoundingClientRect());let e={x:a.x+a.width/2,y:a.y+a.height/2};this===y?(s.x=t.clientX,s.y=t.clientY,e=s.matrixTransform(r)):this===b&&(g=t.clientX,t=t.clientY,o=document.querySelector("#scope").getBoundingClientRect(),m=a.width/o.width,i=a.height/o.height,s.x=a.x-(o.x-g)*m,s.y=a.y-(o.y-t)*i,e=s.matrixTransform(r));var c,m,u,d,p,h,v,S,g=Math.pow(1+n.zoomScaleSensitivity,-1*l);w.zoomFPScontrol&&w.zoomFPScontrol.stop(),c=n,m=g,u=e,d=animationDuration=0,a=void 0,L.zoom?(c.zoomFPScontrol&&c.zoomFPScontrol.stop(),0===d?(c.zoomAtPoint(c.getZoom()*m,u),a&&a()):(d=d||.5,p=p||60,h=c.getZoom(),v=h*m,S=h,c.zoomFPScontrol=new z(p,d,(e,t)=>{S=E(t,h,v-h,d),c.zoomAtPoint(S,u)},a),c.zoomFPScontrol.start())):(c.zoomAtPointBy(m,u),a&&a())}},y.eventListenerList=[],u.eventListenerList=[],e.svgElement.eventListenerList=[],e.svgElement.addEventListener(t,n,{passive:!1})},destroy:function(e){w.zoomFPScontrol&&w.zoomFPScontrol.stop(),w.panFPScontrol&&w.panFPScontrol.stop(),e.svgElement.removeAllEventListener(),u.removeAllEventListener(),$.unobserve(u),y.removeAllEventListener();let t=document.querySelector("#zoom-in"),n=document.querySelector("#zoom-out"),o=document.querySelector("#zoom-reset");t.removeEventListener("click",v),n.removeEventListener("click",m),o.removeEventListener("click",l)}}});{b=document.getElementById(r.thumbContainerId);var P="http://www.w3.org/2000/svg",A,Z;(A=document.createElementNS(P,"rect")).id="scope",A.setAttributeNS(null,"x","0"),A.setAttributeNS(null,"y","0"),A.setAttributeNS(null,"height","0"),A.setAttributeNS(null,"width","0"),A.setAttributeNS(null,"fill","#ff00ff"),A.setAttributeNS(null,"fill-opacity","0.4"),A.setAttributeNS(null,"stroke","none"),(Z=document.createElementNS(P,"line")).id="line1",Z.setAttributeNS(null,"stroke","none"),Z.setAttributeNS(null,"x1","0"),Z.setAttributeNS(null,"y1","0"),Z.setAttributeNS(null,"x2","0"),Z.setAttributeNS(null,"y2","0");var N,F=((N=document.createElementNS(P,"line")).id="line2",N.setAttributeNS(null,"stroke","none"),N.setAttributeNS(null,"x1","0"),N.setAttributeNS(null,"y1","0"),N.setAttributeNS(null,"x2","0"),N.setAttributeNS(null,"y2","0"),document.createElementNS(P,"g")),A;F.appendChild(A),F.appendChild(Z),F.appendChild(N),(A=document.createElementNS(P,"svg")).id="scopeContainer",A.classList.add("thumbViewClass"),A.appendChild(F),a=document.createElementNS(P,"svg");let e=document.createElementNS(P,"use"),t=(e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href","#"+r.mainSVGContainer),document.createElementNS(P,"g")),n=(t.id="thumbnail-viewport",r.thumbnailViewport.viewportSelector||s),o=(t.classList.add(n.slice(1)),t.appendChild(e),a.style="",a.id="thumbSVG",a.appendChild(t),(Z=g(a,newWrapType="div",newWrapId="thumbView")).classList.add("thumbViewClass"),document.createElement("div")),i=(o.id="masked",b?(b.appendChild(o),b.appendChild(A)):(b=g(o,newWrapType="div",newWrapId="thumbViewContainer")).appendChild(A),b.appendChild(Z),document.createElement("div"));function M(e,t){let n=document.createElementNS(P,"svg"),o=document.createElementNS(P,"g"),i=(n.classList.add("lens"),o.classList.add("main"),document.createElementNS(P,"circle")),l=document.createElementNS(P,"clipPath"),r=document.createElementNS(P,"g"),s=(i.setAttributeNS(null,"r","100%"),i.setAttributeNS(null,"cx","50%"),i.setAttributeNS(null,"cy","50%"),i.setAttributeNS(null,"style",`clip-path: url(#clip-${t});opacity: 0.6; fill: black;`),l.id="clip-"+t,r.classList.add("gradient"),document.createElement("div")),a=(s.id=t,s.classList.add("icon"),document.createElementNS(P,"path")),c=(a.setAttributeNS(null,"d",e),document.createElementNS(P,"path"));return c.setAttributeNS(null,"d",e),c.style.transform="translate(-35%, -35%) scale(0.06)",c.style.transformOrigin="center",l.appendChild(c),r.appendChild(a),o.appendChild(r),o.style.transform="translate(-35%, -35%) scale(0.06)",o.style.transformOrigin="center",n.appendChild(i),n.appendChild(l),n.appendChild(o),s.appendChild(n),s}i.classList.add("control-zoom"),N=M("M 420.67 210.335 C 420.67 257.269 405.298 300.613 379.313 335.606 L 502.948 459.241 C 515.017 471.31 515.017 490.879 502.948 502.948 C 490.879 515.017 471.31 515.017 459.241 502.948 L 335.606 379.313 C 300.613 405.298 257.269 420.67 210.335 420.67 C 94.17 420.67 0 326.5 0 210.335 C 0 94.17 94.17 0 210.335 0 C 326.5 0 420.67 94.17 420.67 210.335 Z M 323.979 185.927 L 239.965 185.927 C 237.236 185.927 235.022 183.715 235.022 180.986 L 235.022 96.971 C 235.022 83.325 223.959 72.261 210.312 72.261 C 196.666 72.261 185.602 83.325 185.602 96.971 L 185.602 180.986 C 185.602 183.715 183.39 185.927 180.661 185.927 L 96.646 185.927 C 83 185.927 71.936 196.991 71.936 210.637 C 71.936 224.284 83 235.349 96.646 235.349 L 180.661 235.349 C 183.39 235.349 185.602 237.561 185.602 240.29 L 185.602 324.305 C 185.602 337.951 196.666 349.015 210.312 349.015 C 223.959 349.015 235.022 337.951 235.022 324.305 L 235.022 240.29 C 235.022 237.561 237.236 235.349 239.965 235.349 L 323.979 235.349 C 337.625 235.349 348.69 224.284 348.69 210.637 C 348.69 196.991 337.625 185.927 323.979 185.927 Z","zoom-in"),F=M("M 420.67 210.335 C 420.67 257.269 405.298 300.613 379.313 335.606 L 502.948 459.241 C 515.017 471.31 515.017 490.879 502.948 502.948 C 490.879 515.017 471.31 515.017 459.241 502.948 L 335.606 379.313 C 300.613 405.298 257.269 420.67 210.335 420.67 C 94.17 420.67 0 326.5 0 210.335 C 0 94.17 94.17 0 210.335 0 C 326.5 0 420.67 94.17 420.67 210.335 Z M 323.979 185.927 L 96.646 185.927 C 83 185.927 71.936 196.991 71.936 210.637 C 71.936 224.284 83 235.349 96.646 235.349 L 323.979 235.349 C 337.625 235.349 348.69 224.284 348.69 210.637 C 348.69 196.991 337.625 185.927 323.979 185.927 Z","zoom-out"),A=M("M 420.67 210.335 C 420.67 257.269 405.298 300.613 379.313 335.606 L 502.948 459.241 C 515.017 471.31 515.017 490.879 502.948 502.948 C 490.879 515.017 471.31 515.017 459.241 502.948 L 335.606 379.313 C 300.613 405.298 257.269 420.67 210.335 420.67 C 94.17 420.67 0 326.5 0 210.335 C 0 94.17 94.17 0 210.335 0 C 326.5 0 420.67 94.17 420.67 210.335 Z M 348.273 94.961 C 338.364 94.961 330.333 102.994 330.333 112.902 L 330.333 141.72 C 319.644 123.116 304.763 107.22 286.708 95.246 C 264.036 80.21 237.619 72.261 210.313 72.261 C 191.639 72.261 173.515 75.923 156.445 83.144 C 139.964 90.114 125.167 100.088 112.465 112.791 C 99.763 125.494 89.788 140.291 82.817 156.77 C 75.597 173.842 71.936 191.966 71.936 210.638 C 71.936 229.311 75.597 247.435 82.817 264.506 C 89.788 280.987 99.764 295.783 112.465 308.485 C 125.168 321.188 139.965 331.163 156.445 338.134 C 173.515 345.354 191.64 349.015 210.313 349.015 C 226.259 349.015 241.899 346.322 256.798 341.009 C 271.197 335.874 284.579 328.416 296.574 318.845 C 308.449 309.366 318.628 298.085 326.828 285.314 C 335.181 272.303 341.246 258.105 344.853 243.113 C 347.171 233.48 341.242 223.791 331.608 221.473 C 321.973 219.155 312.285 225.085 309.967 234.719 C 304.682 256.689 291.976 276.605 274.19 290.799 C 265.306 297.891 255.399 303.413 244.747 307.211 C 233.726 311.141 222.141 313.134 210.313 313.134 C 182.936 313.134 157.196 302.472 137.838 283.113 C 118.479 263.754 107.817 238.015 107.817 210.637 C 107.817 183.261 118.479 157.521 137.838 138.163 C 157.197 118.804 182.936 108.142 210.313 108.142 C 230.542 108.142 250.102 114.022 266.876 125.148 C 281.332 134.735 293.04 147.704 301.051 162.925 L 281.223 162.925 C 271.314 162.925 263.282 170.957 263.282 180.865 C 263.282 190.774 271.314 198.806 281.223 198.806 L 348.273 198.806 C 358.182 198.806 366.214 190.774 366.214 180.865 L 366.214 112.902 C 366.214 102.994 358.182 94.961 348.273 94.961 Z","zoom-reset"),i.appendChild(N),i.appendChild(F),i.appendChild(A);let l=u.parentElement.querySelector("."+c);l.appendChild(b),l.appendChild(i)}s=e(a),r.onThumbnailSVGLoaded&&r.onThumbnailSVGLoaded(s),s=svgPanZoom("#"+a.id,{zoomEnabled:!0,panEnabled:!0,controlIconsEnabled:!1,dblClickZoomEnabled:!1,preventMouseEventsDefault:!1,customEventsHandler:{init:function(e){var t="onwheel"in document.createElement("div")?"wheel":void 0!==document.onmousewheel?"mousewheel":"DOMMouseScroll";a.eventListenerList=[],b.eventListenerList=[],b.addEventListener(t,n)},destroy:function(e){T.zoomFPScontrol&&T.zoomFPScontrol.stop(),T.panFPScontrol&&T.panFPScontrol.stop(),a.removeAllEventListener(),b.removeAllEventListener(),C.removeAllEventListener()}}}),C=document.getElementById("scopeContainer");var T,Z=w,N=T=s;if(!T&&N&&(T=N),(w=!w&&Z?Z:w)&&T){w.setOnZoom(function(e){T.updateThumbScope()}),w.setOnPan(function(e){T.updateThumbScope()}),w.setZoomScaleSensitivityAux=function(e){w.zoomScaleSensitivity=e,w.setZoomScaleSensitivity(e)};T.updateThumbScope=function(){var e,t,n,o,i,l=document.getElementById("scope"),r=document.getElementById("line1"),s=document.getElementById("line2"),a=(m=T,l=l,r=r,s=s,u=(a=w).getPan().x,e=a.getPan().y,t=a.getSizes().width,n=a.getSizes().height,a=a.getSizes().realZoom,o=m.getPan().x,i=m.getPan().y,a=m.getSizes().realZoom/a,u=o-u*a,e=i-e*a,t*=a,n*=a,l.setAttribute("x",u),l.setAttribute("y",e),l.setAttribute("width",t),l.setAttribute("height",n),r.setAttribute("x1",1+u),r.setAttribute("y1",1+e),r.setAttribute("x2",1+u+t-2),r.setAttribute("y2",1+e+n-2),s.setAttribute("x1",1+u),s.setAttribute("y1",1+e+n-2),s.setAttribute("x2",1+u+t-2),s.setAttribute("y2",1+e),d&&(l=(a=document.querySelector("#scope").getBoundingClientRect()).x+a.width/2,r=a.y+a.height/2,n=C.getBoundingClientRect(),t=m.getSizes().width,s=m.getSizes().height,p=u-(o+(l-n.left-t/2)),h=e-(i+(r-n.top-s/2)),d=!1),document.querySelector("#scope").getBBox());let c=document.querySelector("#masked");a.x,a.y,a.width,a.height,a.x,a.y,a.width,a.height;var m="linear-gradient(to top,"+` transparent calc(100% - ${a.y}px),`+` white calc(100% - ${a.y}px)`+"),linear-gradient(to bottom,"+` transparent calc(${a.y}px + ${a.height}px),`+` white calc(${a.y}px + ${a.height}px)`+"),linear-gradient(to left,"+` transparent calc(100% - ${a.x}px),`+` white calc(100% - ${a.x}px)`+"),linear-gradient(to right,"+` transparent calc(${a.x}px + ${a.width}px),`+` white calc(${a.x}px + ${a.width}px)`+")",u="polygon(0% 0%, 0% 100%, "+a.x+"px 100%, "+`${a.x}px ${a.y}px, `+`calc(${a.x}px + ${a.width}px) ${a.y}px, `+`calc(${a.x}px + ${a.width}px) calc(${a.y}px + ${a.height}px), `+`${a.x}px calc(${a.y}px + ${a.height}px), `+a.x+"px 100%, "+a.x+"px 100%, 100% 100%, 100% 0%)";c.style.clipPath=u,c.style.webkitMask=m,c.style.mask=m},T.updateThumbScope();var V=function(e,t=!1){if(0==e.buttons&&0==e.button||1!=e.buttons)return!1;var[e,t,n,o,i=!1]=[e.clientX,e.clientY,w,T,t],l=C.getBoundingClientRect(),r=(u.getBoundingClientRect(),n.getSizes().width,n.getSizes().height,n.getSizes().realZoom),s=o.getSizes().width,a=o.getSizes().height,o=o.getSizes().realZoom,c=(m=document.querySelector("#scope").getBoundingClientRect()).x+m.width/2,m=m.y+m.height/2,c=-((e=e||c)-(l.left+s/2-p))*r/o,e=-((t=t||m)-(l.top+a/2-h))*r/o;w.getPan(),i?n.panFPScontrol.isPlaying?n.panFPScontrol.stop():n.pan({x:c,y:e}):f(n,{x:c,y:e},animateTime=.1)};F=function(e){e.preventDefault(),V(e,move=!(o=!0))},A=function(e){e.preventDefault(),o=!1},s=function(e){e.preventDefault(),o&&V(e,move=!0)},C.addEventListener("mouseup",A),C.addEventListener("mousedown",F),C.addEventListener("mousemove",s),0;let e=document.querySelector("#zoom-in"),t=document.querySelector("#zoom-out"),n=document.querySelector("#zoom-reset");v=function(e){x(w,w.getZoom()+w.zoomScaleSensitivity)},m=function(e){x(w,w.getZoom()-w.zoomScaleSensitivity)},l=function(e){x(w,i.zoom),f(w,i.pan)},e.addEventListener("click",v),t.addEventListener("click",m),n.addEventListener("click",l)}w.setZoomScaleSensitivityAux(.2),r.onMainViewShown&&r.onMainViewShown(mainViewSVGDoc,_main_svg),w.lastMouseWheelEventTime=Date.now(),r.onThumbnailShown&&r.onThumbnailShown(thumbViewSVGDoc,T),w.zoomBy(.95),i.pan=w.getPan(),i.zoom=w.getZoom(),T.zoomBy(.9),T.updateThumbScope();var B=!0;const $=new ResizeObserver(e=>{for(var t of e){var n=t.target.getBoundingClientRect(),o=C.getBoundingClientRect();0<n.width&&0<n.height&&t.target===u&&(d=!0,B||(B=!1,w.zoomFPScontrol&&w.zoomFPScontrol.stop(),w.panFPScontrol&&w.panFPScontrol.stop(),T.zoomFPScontrol&&T.zoomFPScontrol.stop(),T.panFPScontrol&&T.panFPScontrol.stop()),w.resize(),0<o.width&&0<o.height&&(T.resize(),T.resetZoom(),T.zoomOut(),T.zoomOut(),T.center(!0),T.updateThumbScope()),n={zoom:w.getZoom(),pan:w.getPan()},w.reset(),w.zoomBy(.8),i.pan=w.getPan(),i.zoom=w.getZoom(),w.zoom(n.zoom),w.pan(n.pan))}});return $.observe(u),[w,T,function(){w.viewport.simpleViewBoxCache(),w.viewport.setCTM(w.viewport.processCTM()),w.viewport.updateCTMOnNextFrame(w.viewport.processCTM());var e={zoom:w.getZoom(),pan:w.getPan()};w.reset(),w.zoomBy(.8),i.pan=w.getPan(),i.zoom=w.getZoom(),w.zoom(e.zoom),w.pan(e.pan),T.viewport.simpleViewBoxCache(),T.viewport.setCTM(T.viewport.processCTM()),T.viewport.updateCTMOnNextFrame(T.viewport.processCTM()),T.resize(),T.resetZoom(),T.zoomOut(),T.zoomOut(),T.center(!0),T.updateThumbScope()}]};
