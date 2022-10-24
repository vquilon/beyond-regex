var RegexVisualizerPanel=function(a){var s=document.getElementById("visualizeClick"),e=document.getElementById("exportIt");let r=a.editorParser.$containerEditor;var t,n=!r&&!s;n&&(t=a.editorParser.parseSharedRegex);const i=a.editorParser.getCorrectedReLanguage,o=a.editorParser.getCorrectedFlags,l=a.editorParser.getCorrectedRegex,c=a.editorParser._updateRaphaelItemsJSON;var d=document.querySelector("#"+a.loader_view_id),p=d.querySelector("."+a.progress_bar_class);let u="visualizer-graphView",g="visualizer-graphSVG",m="mainSVGContainer",v="mainSVGViewPort",f="svg-pan-zoom_viewport";var h,y,w,S,b=new Raphael("visualizer-graphView",10,10);b.canvas.id=g;let x=document.createElementNS("http://www.w3.org/2000/svg","g"),L=document.createElementNS("http://www.w3.org/2000/svg","g");x.id=m,L.id=v,L.classList.add(f),L.appendChild(x),b.canvas.appendChild(L);const C=()=>{w?w():[h,y,w]=CustomThumbnailSVGControl({mainViewId:u,mainSVGId:g,mainSVGContainer:m,mainSVGViewPort:v,mainViewPortClass:f,thumbContainerId:"thumbViewContainer"})},R=()=>{r.regexson||a.editorParser.parseRegex(a.editorParser.getRegex());var e,t=r.regexson;return t&&0===t.errors.length?(s.disabled=!0,d.classList.add("loading"),window.setTimeout(()=>{e=RegexVisualizer(t,o(),b,L,x,p,C),c(e)},0),!0):!(s.disabled=!0)};function q(e=!1){var t=l(),a=o(),s=i();let r=location.href;var n=r.indexOf("#");return r=0<n?r.slice(0,n):r,r+="panels/visualizer",e?`<iframe frameborder="0" 
                width="500px" height="300px" 
                src="${r}#!embed=true&flags=${a}&re=${encodeURIComponent(t)}&reLang=${s}">
                </iframe>`:`${r}#!embed=true&flags=${a}&re=${encodeURIComponent(t)}&reLang=`+s}function k(e){return(new XMLSerializer).serializeToString(e)}const V=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),z=async(c,d,p,e="svg")=>{let u=b.canvas.cloneNode(!0),t=u.querySelector("g#mainSVGViewPort"),a=(t.removeAttribute("transform"),t.removeAttribute("style"),t.querySelector("g#mainSVGContainer")),s=(a.removeChild(a.querySelector("desc")),a.removeChild(a.querySelector("defs")),a.firstElementChild);s.style.stroke="none",s.style.strokeWidth="";var r=(e,t,n="",a="",i="")=>{e.style.fill=n||e.style.fill||e.getAttribute("fill"),e.style.stroke=a||e.style.stroke||e.getAttribute("stroke"),e.style.strokeWidth=i||e.style.strokeWidth||e.getAttribute("stroke-width"),n=window.devicePixelRatio||1;let o=parseFloat(e.getAttribute("width")),l=parseFloat(e.getAttribute("height"));if(u.removeAttribute("xmlns:xlink"),"svg"===t&&(a="data:image/svg+xml,"+encodeURIComponent(k(u)),d.setAttribute("src",a),p.setAttribute("href",a)),"png"===t){i=u.outerHTML,c.width=o*n,c.height=l*n;let t=c.getContext("2d"),a=(t.setTransform(n,0,0,n,0,0),k(u),self.URL||self.webkitURL||self),s=new Image,r=(e=new Blob([i],{type:"image/svg+xml;charset=utf-8"}),a.createObjectURL(e));s.onload=function(){t.drawImage(s,0,0,o,l);var e=c.toDataURL("image/png");a.revokeObjectURL(r),d.setAttribute("src",e),p.setAttribute("href",e)},s.src=r}};return r(s,e),{$img:d,rectBackground:s,updateBackgroundStyle:r}};return S=n,p.updateProgressBar=function(e){d.classList.contains("loading")||d.classList.add("loading"),this.attributes.getNamedItem("data-value").value=""+e,this.style.transform=`scaleX(${e/100})`,100===e&&(d.classList.remove("loading"),p.attributes.getNamedItem("data-value").value="0",p.style.transform="",s&&(s.disabled=!1))},S||(s.addEventListener("click",e=>{e.detail&&1!=e.detail||R()}),e.addEventListener("click",e=>{Swal.fire({title:"Share the Image Graph (PNG)!",icon:"info",iconHtml:'<span class="sweetalert-icon material-icons">image</span>',html:`
                    <canvas style="display:none; width: 100%; height: unset;" id="export-image"></canvas>
                    
                    <a class="anchor-export-img" href="" download="graph-regex.png"><img id="exported-img" src=""><span><i class="fas fa-download"></i>PNG</span></a>
                    `,showCancelButton:!0,showConfirmButton:!1,showCloseButton:!0,cancelButtonText:"Close",didOpen:()=>{Swal.showLoading();var{}=z(document.querySelector("canvas#export-image"),document.querySelector("img#exported-img"),document.querySelector("img#exported-img").parentElement,imageType="png");Swal.hideLoading()}})})),document.querySelector("#share-visualize").addEventListener("click",e=>{const t=new Promise(e=>{e({panelIframeURL:q(iframe=!0),panelURL:q(iframe=!1)})});t.then(e=>{Swal.fire({title:"Share the interactive graph!",icon:"info",iconHtml:'<span class="sweetalert-icon material-icons">image</span>',html:`
                    <div id="visualizer-copy" class="container-copy">
                        <div class="copy-container">
                            <div class="copy-content">
                                <span>${V(e.panelURL)}</span>
                            </div>
                            <div class="wrap-copy-btn">
                                <button title="Copy link" data-copy="${e.panelURL}" class="copy-btn">
                                    <i class="far fa-copy"></i>
                                    <span class="confetti-container">
                                        <span class="confetti"></span>
                                        <span class="confetti"></span>
                                        <span class="confetti"></span>
                                        <span class="confetti"></span>
                                        <span class="confetti"></span>
                                        <span class="confetti"></span>
                                    </span>
                                </button>
                                <button title="Copy iframe" data-copy="${V(e.panelIframeURL)}" class="copy-btn">
                                    <i class="far fa-code"></i>
                                    <span class="confetti-container">
                                        <span class="confetti"></span>
                                        <span class="confetti"></span>
                                        <span class="confetti"></span>
                                        <span class="confetti"></span>
                                        <span class="confetti"></span>
                                        <span class="confetti"></span>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <canvas style="display:none; width: 100%; height: unset;" id="export-image"></canvas>
                    
                    <a class="anchor-export-img" href="" download="graph-regex.svg"><img id="exported-img" src=""><span><i class="fas fa-download"></i>SVG</span></a>
                    `,showCancelButton:!0,showConfirmButton:!1,showCloseButton:!0,cancelButtonText:"Close",didOpen:()=>{Swal.showLoading(),document.querySelectorAll("#visualizer-copy button.copy-btn").forEach(s=>{s.addEventListener("click",function(){var e=s.dataset.copy;navigator.clipboard.writeText(e);let t=s.querySelector("i"),a=t.className;t.className="fas fa-check",document.querySelector("#visualizer-copy .copy-container").classList.add("copied"),s.classList.add("copied"),setTimeout(function(){let e=document.querySelector("#visualizer-copy .copy-container");t&&e&&(t.className=a,e.classList.remove("copied"),s.classList.remove("copied"))},1e3)})});var{}=z(document.querySelector("canvas#export-image"),document.querySelector("img#exported-img"),document.querySelector("img#exported-img").parentElement,imageType="svg");Swal.hideLoading()}})})}),document.querySelector("#full-screen").addEventListener("click",e=>{let t=document.querySelector("#visualizer-graph");t.classList.toggle("full-screen"),t.classList.contains("full-screen")?document.querySelector("#full-screen").textContent="close_fullscreen":document.querySelector("#full-screen").textContent="open_in_full"}),document.querySelector("#visualizer-graph .control-panel .hide-button").addEventListener("click",e=>{document.querySelector("#visualizer-graph").classList.toggle("hide-control")}),n?(S=t(l(),language_selected=i()))&&RegexVisualizer(S,o(),b,L,x,p,C):R(),{generatePanelURL:q}};