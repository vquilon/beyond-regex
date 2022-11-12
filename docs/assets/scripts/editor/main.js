var EditorParser=e=>{var t=e.noneditor||!1;const l=e.debug||!1;let r=null;let i=!1;const n=e=>e.replace(/^\s+/,"").replace(/\s+$/,"");var d,a,u,p,g,y,o,s,h,f,c,m,x,v,w,S=()=>{var e=location.hash;return!e||e.length<2?e={reLang:"python",embed:!1,re:"",highlight:!0,flags:""}:((e=(e=e.slice(2)).split("&").reduce(function(e,t){var r=t.substring(t.indexOf("=")+1);return e[t.substring(0,t.indexOf("="))]=r,e},{})).raLang=e.reLang,e.embed="true"===e.embed,e.flags=e.flags||"",e.re=e.re?n(decodeURIComponent(e.re)):""),e},b={re:"",reLang:"",flags:""},L=(t?(P=S(),b={re:P.re,reLang:P.reLang,flags:P.flags}):(d=document.querySelector(e.containerSelector),a=d.querySelector("#editor-input > ."+e.inputClass),u=a.querySelector(".editor"),p=EditorSyntaxis({$editorRegex:u,$syntaxRegex:a.querySelector(".syntax")}),EditorAdvance({$containerEditor:d,$inputRegex:u,$syntaxRegex:a.querySelector(".syntax"),debugInputClass:l?".input-debug":void 0}),g=EditorLinter({$editorLinter:a.querySelector(".linters")}),d.querySelector("#editor-terminal"),y=d.querySelector("#editor-stats"),o=d.querySelector("#real-time-check"),s=d.querySelector("#highlighted-editor"),h=d.querySelector("#terminal-error"),f=h.querySelector("#errorDef"),c=d.querySelectorAll('input[name="flag"]'),m=d.querySelector("#shareIt"),x=document.querySelector("#visualizeClick"),v=e.raphaelJSONId||"raphael-json",w=e.regexSONId||"regex-json"),document.querySelector("#"+e.loader_view_id));const C=function(e,t){e.innerHTML="";var r=document.createTextNode("");return r.nodeValue=t,e.appendChild(r),t},D=function(e,t){var r=document.createTextNode("");return r.nodeValue=t,e.appendChild(r),t},q=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),$=function(e,t){l&&window.hasOwnProperty("JsonView")&&window.setTimeout(()=>{e.innerHTML="",JsonView.renderJSON(t,e)},50)};const k=t=>{i=!1,C(f,""),h.classList.add("correct-syntax"),g.cleanLinter();var r=null;try{var e=RegexParser(),n=document.querySelector("[name='languageRegex']:checked").value;if(0!==(r=e(t,l,n)).errors.length){var a=t;var o=r;g.onRegexErrors(a,o);let e=o.errors;h.classList.remove("correct-syntax"),f.innerHTML="",e.forEach(e=>{h.style.display="block";let t=[];"number"==typeof e.lastIndex&&[].push(" "+a),t.push(`Error [${e.lastIndex}]: `+e.message),t.push(""),D(f,t.join("\n"))});Swal.fire({toast:!0,icon:"error",title:"Error: See the editor console error!",position:"top-right",iconColor:"white",customClass:{popup:"colored-toast"},showConfirmButton:!1,timer:1e3,timerProgressBar:!0})}var s=t,c=r;s=""+t.length,c=""+c.groupCount,C(y.querySelector("#re-len .stat-value"),s),C(y.querySelector("#re-groups .stat-value"),c),b={re:t,reLang:n,flags:T()}}catch(e){console.error(e)}r&&(e={raw:(e=r).raw.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),groupCount:e.groupCount,tree:e.tree},o=document.querySelector("#"+w),$(o,e),d.regexson=r),p.onInput(r,E(),{target:u}),i=!0};const R=()=>b.re,E=()=>u.innerText.replace(/\n$/,"");function T(){for(var e="",t=0,r=c.length;t<r;t++)c[t].checked&&(e+=c[t].value);return e}const I=()=>b.flags;function J(e){for(var t=0;t<c.length;t++)~e.indexOf(c[t].value)?c[t].checked=!0:c[t].checked=!1}const B=()=>b.reLang;function A(e){document.querySelector(`[value="${e}"]`).checked=!0}const N=()=>{k(E()),window.hasChanges=!0,null!==x&&(x.disabled=!1),r&&clearTimeout(r),o.checked&&(r=setTimeout(()=>{x.click()},300))};if(!t){{u.addEventListener("keydown",e=>{"enter"===e.key.toLowerCase()&&e.ctrlKey&&(null!==x&&(x.disabled=!1),x.click())}),u.addEventListener("input",e=>{N()}),u.addEventListener("paste",e=>{e.preventDefault();let t=e.clipboardData||window.clipboardData;e=t.getData("Text");document.execCommand("insertText",!1,e),N()}),m.addEventListener("click",function(){if(!i)return!1;var e=(t=location.href).indexOf("#"),t=0<e?t.slice(0,e):t,e=R(),t=`${t}#!embed=true&flags=${T()}&re=`+encodeURIComponent(e),e=`
            <iframe frameborder="0" width="500px" height="300px"
            src="${t}">
            </iframe>`,e=q(e);Swal.fire({title:"Share your visual regex",html:`
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
                `,icon:"info",iconHtml:'<span class="sweetalert-icon material-icons">share</span>',showCancelButton:!0,showConfirmButton:!1,showCloseButton:!0,cancelButtonText:"Close",didOpen:()=>{Swal.showLoading(),document.querySelectorAll("#beyond-regex-editor-copy button.copy-btn").forEach(a=>{a.addEventListener("click",e=>{var t=a.dataset.copy;navigator.clipboard.writeText(t);let r=a.querySelector("i"),n=r.className;r.className="fas fa-check",document.querySelector("#beyond-regex-editor-copy .copy-container").classList.add("copied"),a.classList.add("copied"),setTimeout(function(){let e=document.querySelector("#beyond-regex-editor-copy .copy-container");r&&e&&(r.className=n,e.classList.remove("copied"),a.classList.remove("copied"))},1e3)})}),Swal.hideLoading()}})});let e=document.querySelectorAll("[name='languageRegex']");for(var O=0,H=e.length;O<H;O++)e[O].onclick=function(){N(),null===L||L.classList.contains("loading")||null!==x&&(x.disabled=!1,x.click())};s.addEventListener("change",e=>{s.checked?a.classList.remove("no-highlighted"):a.classList.add("no-highlighted")})}var P=S();!P.embed&&"export"!=P.cmd||(document.body.className+=" embed"),P.flags?J(P.flags):J("g"),P.re&&(e=P.re+`
`,u.innerText=e),P.reLang?A(P.reLang):A("python"),k(E())}return{parseRegex:k,getRegex:E,parseSharedRegex:(r,n="python")=>{var a,o,e=null;try{var s=RegexParser(),e=s(r,l,n)}catch(t){if(!(t instanceof s.RegexSyntaxError))throw t;{n=r;s=t;let e="";"number"==typeof s.lastIndex&&(r=q(n.slice(0,s.lastIndex)),a=q(n[s.lastIndex]),n=q(n.slice(s.lastIndex+1)),o=location.origin+"/beyond-regex/",editLink=o+`#!flags=${I()}&re=${encodeURIComponent(R())}&reLang=${B()}"`,e=`
                <p style="text-align: left;">Regex Flags: <strong>${I()}</strong></p>        
                <p style="text-align: left;">Regex Language syntax: <strong>${B()}</strong></p>    
                <p style="text-align:left; margin-top: 1em">${s.message}</p>
                <div style="overflow-x: auto; overflow-y: hidden; white-space: nowrap; margin-top: 1em;">${r}<strong style="
                    color: red;
                    text-decoration: underline 1px wavy;">${a}</strong>${n}</div>
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
            ${e}<a target="_black" class="cool-anchor" href="${editLink}">Correct with the editor!</a>
            `,showCancelButton:!0,showConfirmButton:!1,showCloseButton:!0,cancelButtonText:"Close"})}}return e},trim:n,getParams:S,getCorrectedFlags:I,getCorrectedReLanguage:B,getCorrectedRegex:R,_updateRaphaelItemsJSON:e=>{var t=document.querySelector("#"+v);$(t,e)},$containerEditor:d,$input:a}};