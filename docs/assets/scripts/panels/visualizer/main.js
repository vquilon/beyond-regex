var RegexVisualizerPanel=function(a){var r=document.getElementById("visualizeClick"),e=document.getElementById("exportIt");let s=a.editorParser.$containerEditor;var t,n=!s&&!r;n&&(t=a.editorParser.parseSharedRegex);const o=a.editorParser.getCorrectedReLanguage,l=a.editorParser.getCorrectedFlags,c=a.editorParser.getCorrectedRegex,i=a.editorParser._updateRaphaelItemsJSON;var d,u,p,m=document.querySelector("#"+a.loader_view_id),g=m.querySelector("."+a.progress_bar_class),f=new Raphael("visualizer-graphView",10,10);f.canvas.id="visualizer-graphSVG";const h=()=>{s.regexson||a.editorParser.parseRegex(a.editorParser.getRegex());var e=s.regexson;if(e&&0===e.errors.length){r.disabled=!0,m.classList.add("loading");var t;g.updateProgressBar=function(e){this.attributes.getNamedItem("data-value").value=""+e,this.style.transform=`scaleX(${e/100})`};return window.setTimeout(()=>{t=RegexVisualizer(e,l(),f,g),i(t),p&&p(),[d,u,p]=CustomThumbnailSVGControl({mainViewId:"visualizer-graphView",mainSVGId:"visualizer-graphSVG",thumbContainerId:"thumbViewContainer"}),m.classList.remove("loading"),g.attributes.getNamedItem("data-value").value="0",g.style.transform="",r.disabled=!1},0),!0}return!(r.disabled=!0)};function v(e=!1){var t=c(),a=l(),r=o();let s=location.href;var n=s.indexOf("#");s=0<n?s.slice(0,n):s,s+="panels/visualizer";let i="";return i=e?`<iframe frameborder="0" 
                width="500px" height="300px" 
                src="${s}#!embed=true&flags=${a}&re=${encodeURIComponent(t)}&reLang=${r}">
                </iframe>`:`${s}#!embed=true&flags=${a}&re=${encodeURIComponent(t)}&reLang=`+r}function y(e){return(new XMLSerializer).serializeToString(e)}const w=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),S=async(c,d,u,e="svg")=>{let p=f.canvas.cloneNode(!0),t=p.querySelector("g#mainSVGViewPort"),a=(t.removeAttribute("transform"),t.removeAttribute("style"),t.querySelector("g#mainSVGContainer")),r=(a.removeChild(a.querySelector("desc")),a.removeChild(a.querySelector("defs")),a.firstElementChild);r.style.stroke="none",r.style.strokeWidth="";var s=(e,t,n="",a="",i="")=>{e.style.fill=n||e.style.fill||e.getAttribute("fill"),e.style.stroke=a||e.style.stroke||e.getAttribute("stroke"),e.style.strokeWidth=i||e.style.strokeWidth||e.getAttribute("stroke-width");n=window.devicePixelRatio||1;let o=parseFloat(e.getAttribute("width")),l=parseFloat(e.getAttribute("height"));if(p.removeAttribute("xmlns:xlink"),"svg"===t&&(a="data:image/svg+xml,"+encodeURIComponent(y(p)),d.setAttribute("src",a),u.setAttribute("href",a)),"png"===t){i=p.outerHTML;c.width=o*n,c.height=l*n;let t=c.getContext("2d");t.setTransform(n,0,0,n,0,0);y(p);let a=self.URL||self.webkitURL||self,r=new Image;e=new Blob([i],{type:"image/svg+xml;charset=utf-8"});let s=a.createObjectURL(e);r.onload=function(){t.drawImage(r,0,0,o,l);var e=c.toDataURL("image/png");a.revokeObjectURL(s),d.setAttribute("src",e),u.setAttribute("href",e)},r.src=s}};return s(r,e),{$img:d,rectBackground:r,updateBackgroundStyle:s}};return document.querySelector("#share-visualize").addEventListener("click",e=>{const t=new Promise(e=>{e({panelIframeURL:v(iframe=!0),panelURL:v(iframe=!1)})});t.then(e=>{Swal.fire({title:"Share the interactive graph!",icon:"info",iconHtml:'<span class="sweetalert-icon material-icons">image</span>',html:`
                <div id="visualizer-copy" class="container-copy">
                    <div class="copy-container">
                        <div class="copy-content">
                            <span>${w(e.panelURL)}</span>
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
                            <button title="Copy iframe" data-copy="${w(e.panelIframeURL)}" class="copy-btn">
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
                `,showCancelButton:!0,showConfirmButton:!1,showCloseButton:!0,cancelButtonText:"Close",didOpen:()=>{Swal.showLoading(),document.querySelectorAll("#visualizer-copy button.copy-btn").forEach(r=>{r.addEventListener("click",function(){var e=r.dataset.copy;navigator.clipboard.writeText(e);let t=r.querySelector("i"),a=t.className;t.className="fas fa-check",document.querySelector("#visualizer-copy .copy-container").classList.add("copied"),r.classList.add("copied"),setTimeout(function(){let e=document.querySelector("#visualizer-copy .copy-container");t&&e&&(t.className=a,e.classList.remove("copied"),r.classList.remove("copied"))},1e3)})});var{}=S(document.querySelector("canvas#export-image"),document.querySelector("img#exported-img"),document.querySelector("img#exported-img").parentElement,imageType="svg");Swal.hideLoading()}})})}),document.querySelector("#full-screen").addEventListener("click",e=>{let t=document.querySelector("#visualizer-graph");t.classList.toggle("full-screen"),t.classList.contains("full-screen")?document.querySelector("#full-screen").textContent="close_fullscreen":document.querySelector("#full-screen").textContent="open_in_full"}),document.querySelector("#visualizer-graph .control-panel .hide-button").addEventListener("click",e=>{document.querySelector("#visualizer-graph").classList.toggle("hide-control")}),n?(n=c(),(n=t(n,language_selected=o()))&&(m.classList.add("loading"),g.updateProgressBar=function(e){this.attributes.getNamedItem("data-value").value=""+e,this.style.transform=`scaleX(${e/100})`},RegexVisualizer(n,l(),f,g),[d,u,p]=CustomThumbnailSVGControl({mainViewId:"visualizer-graphView",mainSVGId:"visualizer-graphSVG",thumbContainerId:"thumbViewContainer"}),m.classList.remove("loading"),g.attributes.getNamedItem("data-value").value="0",g.style.transform="")):(r.addEventListener("click",e=>{e.detail&&1!=e.detail||h()}),e.addEventListener("click",e=>{Swal.fire({title:"Share the Image Graph (PNG)!",icon:"info",iconHtml:'<span class="sweetalert-icon material-icons">image</span>',html:`
                <canvas style="display:none; width: 100%; height: unset;" id="export-image"></canvas>
                
                <a class="anchor-export-img" href="" download="graph-regex.png"><img id="exported-img" src=""><span><i class="fas fa-download"></i>PNG</span></a>
                `,showCancelButton:!0,showConfirmButton:!1,showCloseButton:!0,cancelButtonText:"Close",didOpen:()=>{Swal.showLoading();var{}=S(document.querySelector("canvas#export-image"),document.querySelector("img#exported-img"),document.querySelector("img#exported-img").parentElement,imageType="png");Swal.hideLoading()}})}),h()),{generatePanelURL:v}};