var EditorParser=e=>{var t=e.noneditor||!1;const s=e.debug||!1;let r=null,c=!1;const n=e=>e.replace(/^\s+/,"").replace(/\s+$/,"");var l,a,i,d,u,p,o,g,y,h,f,m,x,v,w,S=()=>{var e=location.hash;return!e||e.length<2?e={reLang:"python",embed:!1,re:"",highlight:!0,flags:""}:((e=(e=e.slice(2)).split("&").reduce(function(e,t){var r=t.substring(t.indexOf("=")+1);return e[t.substring(0,t.indexOf("="))]=r,e},{})).raLang=e.reLang,e.embed="true"===e.embed,e.flags=e.flags||"",e.re=e.re?n(decodeURIComponent(e.re)):""),e},$={re:"",reLang:"",flags:""};t?(N=S(),$={re:N.re,reLang:N.reLang,flags:N.flags}):(l=document.querySelector(e.containerSelector),a=l.querySelector(`#editor-input > .${e.inputClass}`),i=a.querySelector(".editor"),d=EditorSyntaxis({$editorRegex:i,$syntaxRegex:a.querySelector(".syntax")}),EditorAdvance({$containerEditor:l,$inputRegex:i,$syntaxRegex:a.querySelector(".syntax"),debugInputClass:s?".input-debug":void 0}),u=EditorLinter({$editorLinter:a.querySelector(".linters")}),p=l.querySelector("#editor-terminal").querySelector("#terminal-stats"),o=l.querySelector("#real-time-check"),g=l.querySelector("#highlighted-editor"),y=l.querySelector("#terminal-error"),h=y.querySelector("#errorDef"),f=l.querySelectorAll('input[name="flag"]'),m=l.querySelector("#shareIt"),x=document.querySelector("#visualizeClick"),v=e.raphaelJSONId||"raphael-json",w=e.regexSONId||"regex-json");var b=document.querySelector(`#${e.loader_view_id}`);const L=function(e,t){e.innerHTML="";var r=document.createTextNode("");return r.nodeValue=t,e.appendChild(r),t},C=function(e,t){var r=document.createTextNode("");return r.nodeValue=t,e.appendChild(r),t},q=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),k=function(e,t){s&&window.hasOwnProperty("JsonView")&&window.setTimeout(()=>{e.innerHTML="",JsonView.renderJSON(t,e)},50)},R=e=>{c=!1,L(h,"Correct syntax"),y.classList.add("correct-syntax"),u.cleanLinter();var t,r,n=null;try{var a=RegexParser(),o=document.querySelector("[name='languageRegex']:checked").value;0!==(n=a(e,s,o)).errors.length&&function(r,e){u.onRegexErrors(r,e);let t=e.errors;y.classList.remove("correct-syntax"),h.innerHTML="",t.forEach(e=>{y.style.display="block";let t=[];"number"==typeof e.lastIndex&&[].push(` ${r}`),t.push(`Error [${e.lastIndex}]: ${e.message}`),t.push(""),C(h,t.join("\n"))}),Swal.fire({toast:!0,icon:"error",title:"Error: See the editor console error!",position:"top-right",iconColor:"white",customClass:{popup:"colored-toast"},showConfirmButton:!1,timer:1e3,timerProgressBar:!0})}(e,n),r=n,t=`${e.length}`,r=`${r.groupCount}`,L(p.querySelector("#re-len .stat-value"),t),L(p.querySelector("#re-groups .stat-value"),r),$={re:e,reLang:o,flags:I()}}catch(e){console.error(e)}n&&((e=>{e={raw:e.raw.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),groupCount:e.groupCount,tree:e.tree};var t=document.querySelector(`#${w}`);k(t,e)})(n),l.regexson=n),d.onInput(n,T(),{target:i}),c=!0},E=()=>$.re,T=()=>i.innerText.replace(/\n$/,"");function I(){for(var e="",t=0,r=f.length;t<r;t++)f[t].checked&&(e+=f[t].value);return e}const B=()=>$.flags;var N=function(e){for(var t=0;t<f.length;t++)~e.indexOf(f[t].value)?f[t].checked=!0:f[t].checked=!1};const O=()=>$.reLang;e=function(e){document.querySelector(`[value="${e}"]`).checked=!0};const P=()=>{R(T()),window.hasChanges=!0,null!==x&&(x.disabled=!1),r&&clearTimeout(r),o.checked&&(r=setTimeout(()=>{x.click()},300))};return t||((()=>{i.addEventListener("keydown",e=>{"enter"===e.key.toLowerCase()&&e.ctrlKey&&(null!==x&&(x.disabled=!1),x.click())}),i.addEventListener("input",e=>{P()}),i.addEventListener("paste",e=>{e.preventDefault();let t=e.clipboardData||window.clipboardData;e=t.getData("Text"),document.execCommand("insertText",!1,e),P()}),m.addEventListener("click",function(){if(!c)return!1;var e=0<(t=(e=location.href).indexOf("#"))?e.slice(0,t):e,t=E(),t=`
            <iframe frameborder="0" width="500px" height="300px"
            src="${e=`${e}#!embed=true&flags=${I()}&re=${encodeURIComponent(t)}`}">
            </iframe>`,t=q(t);Swal.fire({title:"Share your visual regex",html:`
                <div id="beyond-regex-editor-copy" class="container-copy">
                    <div class="copy-container">
                        <div class="copy-content">
                            <span>${t}</span>
                        </div>
                        <div class="wrap-copy-btn">
                            <button title="Copy link" data-copy="${t}" class="copy-btn">
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
                            <button title="Copy iframe" data-copy="${e}" class="copy-btn">
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
                `,icon:"info",iconHtml:'<span class="sweetalert-icon material-icons">share</span>',showCancelButton:!0,showConfirmButton:!1,showCloseButton:!0,cancelButtonText:"Close",didOpen:()=>{Swal.showLoading(),document.querySelectorAll("#beyond-regex-editor-copy button.copy-btn").forEach(a=>{a.addEventListener("click",e=>{var t=a.dataset.copy;navigator.clipboard.writeText(t);let r=a.querySelector("i"),n=r.className;r.className="fas fa-check",document.querySelector("#beyond-regex-editor-copy .copy-container").classList.add("copied"),a.classList.add("copied"),setTimeout(function(){let e=document.querySelector("#beyond-regex-editor-copy .copy-container");r&&e&&(r.className=n,e.classList.remove("copied"),a.classList.remove("copied"))},1e3)})}),Swal.hideLoading()}})});let e=document.querySelectorAll("[name='languageRegex']");for(var t=0,r=e.length;t<r;t++)e[t].onclick=function(){P(),null!==b&&(b.classList.contains("loading")||null!==x&&(x.disabled=!1,x.click()))};g.addEventListener("change",e=>{g.checked?a.classList.remove("no-highlighted"):a.classList.add("no-highlighted")})})(),!(t=S()).embed&&"export"!=t.cmd||(document.body.className+=" embed"),t.flags?N(t.flags):N("g"),t.re&&(N=`${t.re}\n`,i.innerText=N),t.reLang?e(t.reLang):e("python"),R(T())),{parseRegex:R,getRegex:T,parseSharedRegex:(e,t="python")=>{var r=null;try{var n=RegexParser(),r=n(e,s,t)}catch(t){if(!(t instanceof n.RegexSyntaxError))throw t;((e,t)=>{let r="";var n,a,o;"number"==typeof t.lastIndex&&(n=q(e.slice(0,t.lastIndex)),a=q(e[t.lastIndex]),o=q(e.slice(t.lastIndex+1)),e=`${location.origin}/beyond-regex/`,editLink=`${e}#!flags=${B()}&re=${encodeURIComponent(E())}&reLang=${O()}"`,r=`
                <p style="text-align: left;">Regex Flags: <strong>${B()}</strong></p>        
                <p style="text-align: left;">Regex Language syntax: <strong>${O()}</strong></p>    
                <p style="text-align:left; margin-top: 1em">${t.message}</p>
                <div style="overflow-x: auto; overflow-y: hidden; white-space: nowrap; margin-top: 1em;">${n}<strong style="
                    color: red;
                    text-decoration: underline 1px wavy;">${a}</strong>${o}</div>
            `),Swal.fire({title:"Shared regex is wrong",icon:"error",html:`
            <style>
            a.cool-anchor {
                color: white;
                height: 1em;
                display: block;
                margin-top: 1em;
                padding: 0.5em;
                border-radius: 0.5em;
                text-decoration: none;
                line-height: 1;
                background: linear-gradient(45deg, #03a9f4, #ff0058);
            }
            </style>
            ${r}<a target="_black" class="cool-anchor" href="${editLink}">Correct with the editor!</a>
            `,showCancelButton:!0,showConfirmButton:!1,showCloseButton:!0,cancelButtonText:"Close"})})(e,t)}return r},trim:n,getParams:S,getCorrectedFlags:B,getCorrectedReLanguage:O,getCorrectedRegex:E,_updateRaphaelItemsJSON:e=>{var t=document.querySelector(`#${v}`);k(t,e)},$containerEditor:l,$input:a}};
