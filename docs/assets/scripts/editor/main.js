var EditorParser=e=>{var r=e.noneditor||!1;const t=e.debug||!1;var o=document.querySelector("#input"),n=document.querySelector("#terminal-error"),c=n.querySelector("#errorDef"),i=n.querySelector("#errorBox"),l=document.querySelector("#editor-terminal").querySelector("#terminal-stats"),a=document.getElementsByName("flag"),s=document.querySelector("#iframeIt");let u=e.raphaelJSONId||"raphael-json",d=e.regexSONId||"regex-json";function m(){for(var e="",r=0,t=a.length;r<t;r++)a[r].checked&&(e+=a[r].value);return e}function p(e,r){n.classList.remove("correct-syntax"),(async()=>{const e=Swal.mixin({toast:!0,position:"top-right",iconColor:"white",customClass:{popup:"colored-toast"},showConfirmButton:!1,timer:1500,timerProgressBar:!0});await e.fire({icon:"error",title:"Error: See the editor console error!"})})(),n.style.display="block";var t=[],o=[];"number"==typeof r.lastIndex&&t.push(` ${e}`),o.push("Error:"+r.message),o.push(""),i.style.setProperty("--position-error-ch",`${r.lastIndex+1}ch`),h(i,t.join("\n")),h(c,o.join("\n"))}var g=document.querySelector("#visualizeClick"),f=document.querySelector(`#${e.loader_view_id}`),e=function(e){for(var r=0,t=e.length;r<t;r++)~e.indexOf(a[r].value)?a[r].checked=!0:a[r].checked=!1};const y=()=>document.querySelector("[name='languageRegex']:checked").value;function h(e,r){e.innerHTML="";var t=document.createTextNode("");return t.nodeValue=r,e.appendChild(t),r}function v(e,r){t&&(e.innerHTML="",window.setTimeout(()=>JsonView.renderJSON(r,e),50))}const x=e=>{h(i,""),h(c,"Correct syntax"),n.classList.add("correct-syntax");var r,t,o=null;try{var a=RegexParser(),o=a(e,null,y());t=o,r=`${(r=e).length}`,t=`${o.groupCount}`,h(l.querySelector("#re-len .stat-value"),r),h(l.querySelector("#re-groups .stat-value"),t)}catch(o){if(!(o instanceof a.RegexSyntaxError))throw o;p(e,o)}return o&&(e={raw:(e=o).raw.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),groupCount:e.groupCount,tree:e.tree},v(document.querySelector(`#${d}`),e)),o};function S(e){return e.replace(/^\s+/,"").replace(/\s+$/,"")}function w(){return S(o.value)}function b(){var e=location.hash;return!e||e.length<2?e={reLang:"python",embed:!1,re:"",highlight:!0,flags:""}:((e=(e=e.slice(2)).split("&").reduce(function(e,r){return e[(r=r.split("="))[0]]=r[1],e},{})).raLang=e.reLang,e.embed="true"===e.embed,e.flags=e.flags||"",e.re=e.re?S(decodeURIComponent(e.re)):""),e}return r||(function(){o.addEventListener("input",function(e){x(),window.hasChanges=!0,g.disabled=!1}),s.addEventListener("click",function(){if(!x(o.value))return!1;var e=0<(r=(e=location.href).indexOf("#"))?e.slice(0,r):e,r=w();const t=`
            <iframe frameborder="0" width="500px" height="300px"
            src="${e}#!embed=true&flags=${m()}&re=${encodeURIComponent(r)}">
            </iframe>`;r=t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),Swal.fire({title:"Share your visual regex",html:`
                <div id="beyond-regex-iframe-copy" class="container-copy">
                    <div class="iframe-copier">
                        <div class="iframe-content">
                            <span>${r}</span>
                        </div>
                        <div class="wrap-copy-iframe"><button class="copy-iframe"><i class="far fa-copy"></i></button></div>
                    </div>
                </div>
                `,icon:"info",iconHtml:'<span class="sweetalert-icon material-icons">share</span>',showCancelButton:!0,showConfirmButton:!1,showCloseButton:!0,cancelButtonText:"Close",didOpen:()=>{Swal.showLoading(),document.querySelector("#beyond-regex-iframe-copy button.copy-iframe").addEventListener("click",function(){navigator.clipboard.writeText(t),document.querySelector("#beyond-regex-iframe-copy .copy-iframe>i").className="fas fa-check",document.querySelector("#beyond-regex-iframe-copy .iframe-copier").classList.add("copied"),setTimeout(function(){var e=document.querySelector("#beyond-regex-iframe-copy .copy-iframe>i");let r=document.querySelector("#beyond-regex-iframe-copy .iframe-copier");e&&r&&r.classList.remove("copied")},1e3)}),Swal.hideLoading()}})}),i.addEventListener("scroll",e=>{o.scrollLeft=e.currentTarget.scrollLeft});let e=document.querySelectorAll("[name='languageRegex']");for(var r=0,t=e.length;r<t;r++)e[r].onclick=function(){f.classList.contains("loading")||g.disabled&&(g.disabled=!1)}}(),!(r=b()).embed&&"export"!=r.cmd||(document.body.className+=" embed"),r.flags&&e(r.flags),r.re&&(r=r.re,o.value=S(r))),{parseSharedRegex:(e,r="python")=>{var t=null;try{var o=RegexParser(),t=o(e,null,r)}catch(e){if(!(e instanceof o.RegexSyntaxError))throw e}return t},getParams:b,trim:S,parseRegex:x,getFlags:m,setFlags:e,getReLanguage:y,getInputValue:w,_updateRaphaelItemsJSON:e=>{v(document.querySelector(`#${u}`),e)}}};