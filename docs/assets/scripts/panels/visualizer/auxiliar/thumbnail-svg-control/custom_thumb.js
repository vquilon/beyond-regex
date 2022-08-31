var CustomThumbnailSVGControl=function(r){var d,p,C,s={viewportSelector:"."+r.mainViewPortClass,panEnabled:!0,controlIconsEnabled:!1,zoomEnabled:!0,dblClickZoomEnabled:!0,mouseWheelZoomEnabled:!0,preventMouseEventsDefault:!0,zoomScaleSensitivity:.1,minZoom:.5,maxZoom:10,fit:!0,contain:!1,center:!0,refreshRate:"auto",beforeZoom:null,onZoom:null,beforePan:null,onPan:null,customEventsHandler:null,eventsListenerElement:null,onUpdatedCTM:null},h=(void 0===r.thumbnailViewport&&(r.thumbnailViewport=s),!0),L={pan:!0,zoom:!0},u=document.getElementById(r.mainViewId),y=document.getElementById(r.mainSVGId),a=document.getElementById(r.thumbSVGId),o=!1;r.thumbContainerId;let i={pan:{x:0,y:0},zoom:0};var l,c,m,n,v=[],S=EventTarget.prototype.addEventListener,k=(EventTarget.prototype.addEventListener=function(e,t,n){null==n&&(n=!1),this._addEventListener_original=S,this._addEventListener_original(e,t,n),this.eventListenerList||(this.eventListenerList={},v.push(this)),this.eventListenerList[e]||(this.eventListenerList[e]=[]),this.eventListenerList[e].push({listener:t,options:n})},EventTarget.prototype.removeEventListener);function g(e,t,n){let o=document.createElement(t);return o.id=n,o.appendChild(e),o}function b(e,t,n,o){return n*(e/o)+t}function w(t,n,o,i){var l=1e3/t,r=0,s=null,a=1/t;function c(e){r+=a,null===s&&(s=e),Math.floor((e-s)/l),r<n?(o(this,r),this.requestAnimationRef=requestAnimationFrame(c)):(cancelAnimationFrame(this.requestAnimationRef),this.requestAnimationRef=void 0,i&&i())}this.requestAnimationRef=void 0,this.isPlaying=!1,this.frameRate=function(e){if(!arguments.length)return t;l=1e3/(t=e),a=1/t,s=null},this.start=function(){this.isPlaying||(this.isPlaying=!0,this.requestAnimationRef=requestAnimationFrame(c))},this.stop=function(){this.isPlaying&&(cancelAnimationFrame(this.requestAnimationRef),this.isPlaying=!1,s=null,r=0)}}function E(n,o,i,e,t=void 0){var l,r;L.pan?0===i?(n.panFPScontrol&&n.panFPScontrol.stop(),n.pan(o),t&&t()):(n.panFPScontrol&&n.panFPScontrol.stop(),i=i||.5,e=e||60,l=n.getPan(),r=n.getPan(),n.panFPScontrol=new w(e,i,(e,t)=>{r.x=b(t,l.x,o.x-l.x,i),r.y=b(t,l.y,o.y-l.y,i),n.pan(r)},t),n.panFPScontrol.start()):(n.pan(o),t&&t())}function z(n,o,i,e,t=void 0){var l,r;L.zoom?(n.zoomFPScontrol&&n.zoomFPScontrol.stop(),0===i?(n.zoom(o),t&&t()):(i=i||.5,e=e||60,l=n.getZoom(),r=l,n.zoomFPScontrol=new w(e,i,(e,t)=>{r=b(t,l,o-l,i),Math.abs(o-l)<.001?(r=o,n.zoom(r),e.stop()):n.zoom(r)},t),n.zoomFPScontrol.start())):(n.zoom(o),t&&t())}function e(e){var t=e.contentDocument;return t||"function"==typeof e.getSVGDocument&&(t=e.getSVGDocument()),t}EventTarget.prototype.removeEventListener=function(t,e,n){null==n&&(n=!1),this._removeEventListener_original=k,this._removeEventListener_original(t,e,n),this.eventListenerList||(this.eventListenerList={}),this.eventListenerList[t]||(this.eventListenerList[t]=[]);for(let e=0;e<this.eventListenerList[t].length;e++)if(this.eventListenerList[t][e].listener,this.eventListenerList[t][e].options==n){this.eventListenerList[t].splice(e,1);break}0==this.eventListenerList[t].length&&(delete this.eventListenerList[t],v.splice(v.indexOf(this),1))},EventTarget.prototype.removeAllEventListener=function(){Object.keys(this.eventListenerList).forEach(e=>{for(;0<this.eventListenerList[e].length;){var t=this.eventListenerList[e][0].listener,n=this.eventListenerList[e][0].options;if(this.removeEventListener(e,t,n),!(e in this.eventListenerList))break}})},P=e(y),r.onMainViewSVGLoaded&&r.onMainViewSVGLoaded(P),C=P=svgPanZoom("#"+r.mainSVGId,{viewportSelector:s.viewportSelector,zoomEnabled:!0,controlIconsEnabled:!1,fit:!0,center:!0,beforeZoom:function(e,t){return h=!0},preventMouseEventsDefault:!0,minZoom:.8,maxZoom:1/0,mouseWheelZoomEnabled:!1,zoomScaleSensitivity:.2,customEventsHandler:{haltEventListeners:["wheel"],init:function(e){var t="onwheel"in document.createElement("div")?"wheel":void 0!==document.onmousewheel?"mousewheel":"DOMMouseScroll";n=function(t){let n=C;if(n.isZoomEnabled()){t.preventDefault();var o,i,l=t.deltaY||1,r=Date.now()-n.lastMouseWheelEventTime,r=3+Math.max(0,30-r),r=(n.lastMouseWheelEventTime=Date.now(),l=-.3<(l="deltaMode"in t&&0===t.deltaMode&&t.wheelDelta?0===t.deltaY?0:Math.abs(t.wheelDelta)/t.deltaY:l)&&l<.3?l:(0<l?1:-1)*Math.log(Math.abs(l)+10)/r,y.getScreenCTM().inverse()),s=y.createSVGPoint(),a=(F.getBoundingClientRect(),C.getSizes().realZoom,N.getSizes().width,N.getSizes().height,N.getSizes().realZoom,y.getBoundingClientRect());let e={x:a.x+a.width/2,y:a.y+a.height/2};this===y?(s.x=t.clientX,s.y=t.clientY,e=s.matrixTransform(r)):this===f&&(g=t.clientX,t=t.clientY,o=document.querySelector("#scope").getBoundingClientRect(),m=a.width/o.width,i=a.height/o.height,s.x=a.x-(o.x-g)*m,s.y=a.y-(o.y-t)*i,e=s.matrixTransform(r));var c,m,u,d,p,h,v,S,g=Math.pow(1+n.zoomScaleSensitivity,-1*l);C.zoomFPScontrol&&C.zoomFPScontrol.stop(),c=n,m=g,u=e,a=void(d=animationDuration=0),L.zoom?(c.zoomFPScontrol&&c.zoomFPScontrol.stop(),0===d?(c.zoomAtPoint(c.getZoom()*m,u),a&&a()):(d=d||.5,p=p||60,h=c.getZoom(),v=h*m,c.zoomFPScontrol=new w(p,d,(e,t)=>{S=b(t,h,v-h,d),c.zoomAtPoint(S,u)},a),c.zoomFPScontrol.start())):(c.zoomAtPointBy(m,u),a&&a())}},y.eventListenerList=[],u.eventListenerList=[],e.svgElement.eventListenerList=[],e.svgElement.addEventListener(t,n)},destroy:function(e){C.zoomFPScontrol&&C.zoomFPScontrol.stop(),C.panFPScontrol&&C.panFPScontrol.stop(),e.svgElement.removeAllEventListener(),u.removeAllEventListener(),$.unobserve(u),y.removeAllEventListener();let t=document.querySelector("#zoom-in"),n=document.querySelector("#zoom-out"),o=document.querySelector("#zoom-reset");t.removeEventListener("click",m),n.removeEventListener("click",c),o.removeEventListener("click",l)}}});{var f=document.getElementById(r.thumbContainerId),x="http://www.w3.org/2000/svg";(P=document.createElementNS(x,"rect")).id="scope",P.setAttributeNS(null,"x","0"),P.setAttributeNS(null,"y","0"),P.setAttributeNS(null,"height","0"),P.setAttributeNS(null,"width","0"),P.setAttributeNS(null,"fill","#ff00ff"),P.setAttributeNS(null,"fill-opacity","0.4"),P.setAttributeNS(null,"stroke","none"),(M=document.createElementNS(x,"line")).id="line1",M.setAttributeNS(null,"stroke","none"),M.setAttributeNS(null,"x1","0"),M.setAttributeNS(null,"y1","0"),M.setAttributeNS(null,"x2","0"),M.setAttributeNS(null,"y2","0");(T=document.createElementNS(x,"line")).id="line2",T.setAttributeNS(null,"stroke","none"),T.setAttributeNS(null,"x1","0"),T.setAttributeNS(null,"y1","0"),T.setAttributeNS(null,"x2","0"),T.setAttributeNS(null,"y2","0");var P,A=document.createElementNS(x,"g");A.appendChild(P),A.appendChild(M),A.appendChild(T),(P=document.createElementNS(x,"svg")).id="scopeContainer",P.classList.add("thumbViewClass"),P.appendChild(A),a=document.createElementNS(x,"svg");let e=document.createElementNS(x,"use"),t=(e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href","#"+r.mainSVGContainer),document.createElementNS(x,"g")),n=(t.id="thumbnail-viewport",r.thumbnailViewport.viewportSelector||s),o=(t.classList.add(n.slice(1)),t.appendChild(e),a.style="",a.id="thumbSVG",a.appendChild(t),(M=g(a,newWrapType="div",newWrapId="thumbView")).classList.add("thumbViewClass"),document.createElement("div")),i=(o.id="masked",f?(f.appendChild(o),f.appendChild(P)):(f=g(o,newWrapType="div",newWrapId="thumbViewContainer")).appendChild(P),f.appendChild(M),document.createElement("div"));function Z(e,t){let n=document.createElementNS(x,"svg"),o=document.createElementNS(x,"g"),i=(n.classList.add("lens"),o.classList.add("main"),document.createElementNS(x,"circle")),l=document.createElementNS(x,"clipPath"),r=document.createElementNS(x,"g"),s=(i.setAttributeNS(null,"r","100%"),i.setAttributeNS(null,"cx","50%"),i.setAttributeNS(null,"cy","50%"),i.setAttributeNS(null,"style",`clip-path: url(#clip-${t});opacity: 0.6; fill: black;`),l.id="clip-"+t,r.classList.add("gradient"),document.createElement("div")),a=(s.id=t,s.classList.add("icon"),document.createElementNS(x,"path")),c=(a.setAttributeNS(null,"d",e),document.createElementNS(x,"path"));return c.setAttributeNS(null,"d",e),c.style.transform="translate(-35%, -35%) scale(0.06)",c.style.transformOrigin="center",l.appendChild(c),r.appendChild(a),o.appendChild(r),o.style.transform="translate(-35%, -35%) scale(0.06)",o.style.transformOrigin="center",n.appendChild(i),n.appendChild(l),n.appendChild(o),s.appendChild(n),s}i.classList.add("control-zoom"),T=Z("M 420.67 210.335 C 420.67 257.269 405.298 300.613 379.313 335.606 L 502.948 459.241 C 515.017 471.31 515.017 490.879 502.948 502.948 C 490.879 515.017 471.31 515.017 459.241 502.948 L 335.606 379.313 C 300.613 405.298 257.269 420.67 210.335 420.67 C 94.17 420.67 0 326.5 0 210.335 C 0 94.17 94.17 0 210.335 0 C 326.5 0 420.67 94.17 420.67 210.335 Z M 323.979 185.927 L 239.965 185.927 C 237.236 185.927 235.022 183.715 235.022 180.986 L 235.022 96.971 C 235.022 83.325 223.959 72.261 210.312 72.261 C 196.666 72.261 185.602 83.325 185.602 96.971 L 185.602 180.986 C 185.602 183.715 183.39 185.927 180.661 185.927 L 96.646 185.927 C 83 185.927 71.936 196.991 71.936 210.637 C 71.936 224.284 83 235.349 96.646 235.349 L 180.661 235.349 C 183.39 235.349 185.602 237.561 185.602 240.29 L 185.602 324.305 C 185.602 337.951 196.666 349.015 210.312 349.015 C 223.959 349.015 235.022 337.951 235.022 324.305 L 235.022 240.29 C 235.022 237.561 237.236 235.349 239.965 235.349 L 323.979 235.349 C 337.625 235.349 348.69 224.284 348.69 210.637 C 348.69 196.991 337.625 185.927 323.979 185.927 Z","zoom-in"),A=Z("M 420.67 210.335 C 420.67 257.269 405.298 300.613 379.313 335.606 L 502.948 459.241 C 515.017 471.31 515.017 490.879 502.948 502.948 C 490.879 515.017 471.31 515.017 459.241 502.948 L 335.606 379.313 C 300.613 405.298 257.269 420.67 210.335 420.67 C 94.17 420.67 0 326.5 0 210.335 C 0 94.17 94.17 0 210.335 0 C 326.5 0 420.67 94.17 420.67 210.335 Z M 323.979 185.927 L 96.646 185.927 C 83 185.927 71.936 196.991 71.936 210.637 C 71.936 224.284 83 235.349 96.646 235.349 L 323.979 235.349 C 337.625 235.349 348.69 224.284 348.69 210.637 C 348.69 196.991 337.625 185.927 323.979 185.927 Z","zoom-out"),P=Z("M 420.67 210.335 C 420.67 257.269 405.298 300.613 379.313 335.606 L 502.948 459.241 C 515.017 471.31 515.017 490.879 502.948 502.948 C 490.879 515.017 471.31 515.017 459.241 502.948 L 335.606 379.313 C 300.613 405.298 257.269 420.67 210.335 420.67 C 94.17 420.67 0 326.5 0 210.335 C 0 94.17 94.17 0 210.335 0 C 326.5 0 420.67 94.17 420.67 210.335 Z M 348.273 94.961 C 338.364 94.961 330.333 102.994 330.333 112.902 L 330.333 141.72 C 319.644 123.116 304.763 107.22 286.708 95.246 C 264.036 80.21 237.619 72.261 210.313 72.261 C 191.639 72.261 173.515 75.923 156.445 83.144 C 139.964 90.114 125.167 100.088 112.465 112.791 C 99.763 125.494 89.788 140.291 82.817 156.77 C 75.597 173.842 71.936 191.966 71.936 210.638 C 71.936 229.311 75.597 247.435 82.817 264.506 C 89.788 280.987 99.764 295.783 112.465 308.485 C 125.168 321.188 139.965 331.163 156.445 338.134 C 173.515 345.354 191.64 349.015 210.313 349.015 C 226.259 349.015 241.899 346.322 256.798 341.009 C 271.197 335.874 284.579 328.416 296.574 318.845 C 308.449 309.366 318.628 298.085 326.828 285.314 C 335.181 272.303 341.246 258.105 344.853 243.113 C 347.171 233.48 341.242 223.791 331.608 221.473 C 321.973 219.155 312.285 225.085 309.967 234.719 C 304.682 256.689 291.976 276.605 274.19 290.799 C 265.306 297.891 255.399 303.413 244.747 307.211 C 233.726 311.141 222.141 313.134 210.313 313.134 C 182.936 313.134 157.196 302.472 137.838 283.113 C 118.479 263.754 107.817 238.015 107.817 210.637 C 107.817 183.261 118.479 157.521 137.838 138.163 C 157.197 118.804 182.936 108.142 210.313 108.142 C 230.542 108.142 250.102 114.022 266.876 125.148 C 281.332 134.735 293.04 147.704 301.051 162.925 L 281.223 162.925 C 271.314 162.925 263.282 170.957 263.282 180.865 C 263.282 190.774 271.314 198.806 281.223 198.806 L 348.273 198.806 C 358.182 198.806 366.214 190.774 366.214 180.865 L 366.214 112.902 C 366.214 102.994 358.182 94.961 348.273 94.961 Z","zoom-reset"),i.appendChild(T),i.appendChild(A),i.appendChild(P);let l=u.parentElement.querySelector(".control-panel");l.appendChild(f),l.appendChild(i)}s=e(a),r.onThumbnailSVGLoaded&&r.onThumbnailSVGLoaded(s),s=svgPanZoom("#"+a.id,{zoomEnabled:!0,panEnabled:!0,controlIconsEnabled:!1,dblClickZoomEnabled:!1,preventMouseEventsDefault:!1,customEventsHandler:{init:function(e){var t="onwheel"in document.createElement("div")?"wheel":void 0!==document.onmousewheel?"mousewheel":"DOMMouseScroll";a.eventListenerList=[],f.eventListenerList=[],f.addEventListener(t,n)},destroy:function(e){N.zoomFPScontrol&&N.zoomFPScontrol.stop(),N.panFPScontrol&&N.panFPScontrol.stop(),a.removeAllEventListener(),f.removeAllEventListener(),F.removeAllEventListener()}}});var N,F=document.getElementById("scopeContainer"),M=C,T=N=s;if(!N&&T&&(N=T),(C=!C&&M?M:C)&&N){C.setOnZoom(function(e){N.updateThumbScope()}),C.setOnPan(function(e){N.updateThumbScope()}),C.setZoomScaleSensitivityAux=function(e){C.zoomScaleSensitivity=e,C.setZoomScaleSensitivity(e)},N.updateThumbScope=function(){var e,t,n,o,i,l=document.getElementById("scope"),r=document.getElementById("line1"),s=document.getElementById("line2"),a=(m=N,u=(a=C).getPan().x,e=a.getPan().y,t=a.getSizes().width,n=a.getSizes().height,a=a.getSizes().realZoom,o=m.getPan().x,e=(i=m.getPan().y)-e*(a=m.getSizes().realZoom/a),t*=a,n*=a,l.setAttribute("x",u=o-u*a),l.setAttribute("y",e),l.setAttribute("width",t),l.setAttribute("height",n),r.setAttribute("x1",1+u),r.setAttribute("y1",1+e),r.setAttribute("x2",1+u+t-2),r.setAttribute("y2",1+e+n-2),s.setAttribute("x1",1+u),s.setAttribute("y1",1+e+n-2),s.setAttribute("x2",1+u+t-2),s.setAttribute("y2",1+e),h&&(l=(a=document.querySelector("#scope").getBoundingClientRect()).x+a.width/2,r=a.y+a.height/2,n=F.getBoundingClientRect(),t=m.getSizes().width,s=m.getSizes().height,d=u-(o+(l-n.left-t/2)),p=e-(i+(r-n.top-s/2)),h=!1),document.querySelector("#scope").getBBox());let c=document.querySelector("#masked");a.x,a.y,a.width,a.height,a.x,a.y,a.width,a.height;var m="linear-gradient(to top,"+` transparent calc(100% - ${a.y}px),`+` white calc(100% - ${a.y}px)`+"),linear-gradient(to bottom,"+` transparent calc(${a.y}px + ${a.height}px),`+` white calc(${a.y}px + ${a.height}px)`+"),linear-gradient(to left,"+` transparent calc(100% - ${a.x}px),`+` white calc(100% - ${a.x}px)`+"),linear-gradient(to right,"+` transparent calc(${a.x}px + ${a.width}px),`+` white calc(${a.x}px + ${a.width}px)`+")",u="polygon(0% 0%, 0% 100%, "+a.x+"px 100%, "+`${a.x}px ${a.y}px, `+`calc(${a.x}px + ${a.width}px) ${a.y}px, `+`calc(${a.x}px + ${a.width}px) calc(${a.y}px + ${a.height}px), `+`${a.x}px calc(${a.y}px + ${a.height}px), `+a.x+"px 100%, "+a.x+"px 100%, 100% 100%, 100% 0%)";c.style.clipPath=u,c.style.webkitMask=m,c.style.mask=m},N.updateThumbScope();function V(e,t=!1){if(0==e.buttons&&0==e.button||1!=e.buttons)return!1;var[e,t,n,o,i=!1]=[e.clientX,e.clientY,C,N,t],l=F.getBoundingClientRect(),r=(u.getBoundingClientRect(),n.getSizes().width,n.getSizes().height,n.getSizes().realZoom),s=o.getSizes().width,a=o.getSizes().height,o=o.getSizes().realZoom,c=(m=document.querySelector("#scope").getBoundingClientRect()).x+m.width/2,m=m.y+m.height/2,c=-((e=e||c)-(l.left+s/2-d))*r/o,e=-((t=t||m)-(l.top+a/2-p))*r/o;C.getPan(),i?n.panFPScontrol.isPlaying?n.panFPScontrol.stop():n.pan({x:c,y:e}):E(n,{x:c,y:e},animateTime=.1)}A=function(e){e.preventDefault(),V(e,move=!(o=!0))},s=function(e){e.preventDefault(),o&&V(e,move=!0)};F.addEventListener("mouseup",P=function(e){e.preventDefault(),o=!1}),F.addEventListener("mousedown",A),F.addEventListener("mousemove",s);let e=document.querySelector("#zoom-in"),t=document.querySelector("#zoom-out"),n=document.querySelector("#zoom-reset");m=function(e){z(C,C.getZoom()+C.zoomScaleSensitivity)},c=function(e){z(C,C.getZoom()-C.zoomScaleSensitivity)},l=function(e){z(C,i.zoom),E(C,i.pan)},e.addEventListener("click",m),t.addEventListener("click",c),n.addEventListener("click",l)}C.setZoomScaleSensitivityAux(.2),r.onMainViewShown&&r.onMainViewShown(mainViewSVGDoc,_main_svg),C.lastMouseWheelEventTime=Date.now(),r.onThumbnailShown&&r.onThumbnailShown(thumbViewSVGDoc,N),C.zoomBy(.95),i.pan=C.getPan(),i.zoom=C.getZoom(),N.zoomBy(.9),N.updateThumbScope();var B=!0;const $=new ResizeObserver(e=>{for(var t of e){var n=t.target.getBoundingClientRect(),o=F.getBoundingClientRect();0<n.width&&0<n.height&&t.target===u&&(h=!0,B||(B=!1,C.zoomFPScontrol&&C.zoomFPScontrol.stop(),C.panFPScontrol&&C.panFPScontrol.stop(),N.zoomFPScontrol&&N.zoomFPScontrol.stop(),N.panFPScontrol&&N.panFPScontrol.stop()),C.resize(),0<o.width&&0<o.height&&(N.resize(),N.resetZoom(),N.zoomOut(),N.zoomOut(),N.center(!0),N.updateThumbScope()),n={zoom:C.getZoom(),pan:C.getPan()},C.reset(),C.zoomBy(.8),i.pan=C.getPan(),i.zoom=C.getZoom(),C.zoom(n.zoom),C.pan(n.pan))}});return $.observe(u),[C,N,function(){C.viewport.simpleViewBoxCache(),C.viewport.setCTM(C.viewport.processCTM()),C.viewport.updateCTMOnNextFrame(C.viewport.processCTM());var e={zoom:C.getZoom(),pan:C.getPan()};C.reset(),C.zoomBy(.8),i.pan=C.getPan(),i.zoom=C.getZoom(),C.zoom(e.zoom),C.pan(e.pan),N.viewport.simpleViewBoxCache(),N.viewport.setCTM(N.viewport.processCTM()),N.viewport.updateCTMOnNextFrame(N.viewport.processCTM()),N.resize(),N.resetZoom(),N.zoomOut(),N.zoomOut(),N.center(!0),N.updateThumbScope()}]};