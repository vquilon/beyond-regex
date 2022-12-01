var EditorParser=e=>{var t=e.noneditor||!1;const l=e.debug||!1;let r=null;let i=!1;const n=e=>e.replace(/^\s+/,"").replace(/\s+$/,"");var d,a,u,g,o,p,y,s,c,h,f,m,x,v,L,S,w=()=>{var e=location.hash;return!e||e.length<2?e={reLang:"python",embed:!1,re:"",highlight:!0,flags:""}:((e=(e=e.slice(2)).split("&").reduce(function(e,t){var r=t.substring(t.indexOf("=")+1);return e[t.substring(0,t.indexOf("="))]=r,e},{})).raLang=e.reLang,e.embed="true"===e.embed,e.flags=e.flags||"",e.re=e.re?n(decodeURIComponent(e.re)):""),e},b={re:"",reLang:"",flags:""},q=(t?(N=w(),b={re:N.re,reLang:N.reLang,flags:N.flags}):(d=document.querySelector(e.containerSelector),a=d.querySelector("#editor-input > ."+e.inputClass),u=a.querySelector(".editor"),g=EditorSyntaxis({$editorRegex:u,$syntaxRegex:a.querySelector(".syntax")}),o=EditorAdvance({$containerEditor:d,$inputRegex:u,$syntaxRegex:a.querySelector(".syntax"),debugInputClass:l?".input-debug":void 0}),p=EditorLinter({$editorLinter:a.querySelector(".linters")}),d.querySelector("#editor-terminal"),y=d.querySelector("#editor-stats"),s=d.querySelector("#real-time-check"),c=d.querySelector("#highlighted-editor"),h=d.querySelector("#terminal-error"),f=h.querySelector("#errorDef"),m=d.querySelectorAll('input[name="flag"]'),x=d.querySelector("#shareIt"),v=document.querySelector("#visualizeClick"),L=e.raphaelJSONId||"raphael-json",S=e.regexSONId||"regex-json"),document.querySelector("#"+e.loader_view_id));const C=function(e,t){e.innerHTML="";var r=document.createTextNode("");return r.nodeValue=t,e.appendChild(r),t},A=function(e,t){var r=document.createTextNode("");return r.nodeValue=t,e.appendChild(r),t},$=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),k=function(e,t){l&&window.hasOwnProperty("JsonView")&&window.setTimeout(()=>{e.innerHTML="",JsonView.renderJSON(t,e)},50)};const E=t=>{i=!1,C(f,""),h.classList.add("correct-syntax"),p.cleanLinter();var r=null;try{var e=RegexParser(),n=J();if(0!==(r=e(t,l,n)).errors.length){var a=t;var o=r;p.onRegexErrors(a,o);let e=o.errors;h.classList.remove("correct-syntax"),f.innerHTML="",e.forEach(e=>{h.style.display="block";let t=[];"number"==typeof e.lastIndex&&[].push(" "+a),t.push(`Error [${e.lastIndex}]: `+e.message),t.push(""),A(f,t.join("\n"))});Swal.fire({toast:!0,icon:"error",title:"Error: See the editor console error!",position:"top-right",iconColor:"white",customClass:{popup:"colored-toast"},showConfirmButton:!1,timer:1e3,timerProgressBar:!0})}var s=t,c=r;s=""+t.length,c=""+c.groupCount,C(y.querySelector("#re-len .stat-value"),s),C(y.querySelector("#re-groups .stat-value"),c),b={re:t,reLang:n,flags:j()}}catch(e){console.error(e)}r&&(e={raw:(e=r).raw.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),groupCount:e.groupCount,tree:e.tree},o=document.querySelector("#"+S),k(o,e),d.regexson=r),g.onInput(r,R(),{target:u}),i=!0};const T=()=>b.re,R=()=>u.innerText.replace(/\n$/,"");function j(){for(var e="",t=0,r=m.length;t<r;t++)m[t].checked&&(e+=m[t].value);return e}const I=()=>b.flags;function D(e){for(var t=0;t<m.length;t++)~e.indexOf(m[t].value)?m[t].checked=!0:m[t].checked=!1}const J=()=>document.querySelector("[name='languageRegex']:checked").value,O=()=>b.reLang;function H(e){document.querySelector(`[value="${e}"]`).checked=!0}const P=()=>{E(R()),window.hasChanges=!0,null!==v&&(v.disabled=!1),r&&clearTimeout(r),s.checked&&(r=setTimeout(()=>{v.click()},300))},B=(e,t,r)=>{var n=J();reLangQuotes={python:['"',"'",'"""',"'''"],javascript6:["/","'",'"',"`"]},reLangPrev={python:"r",javascript6:""};let a=e.innerText;e.innerText[0]===reLangPrev[n]&&(a=e.innerText.slice(reLangPrev[n].length));var o=reLangQuotes[n].indexOf(a),o=reLangQuotes[n][(o+1)%reLangQuotes[n].length];let s=r[(t+1)%r.length];0===t?(s.innerText=o,e.innerText=""+reLangPrev[n]+o):(e.innerText=o,s.innerText=""+reLangPrev[n]+o)};var N;return t||(u.addEventListener("keydown",e=>{"enter"===e.key.toLowerCase()&&e.ctrlKey&&(null!==v&&(v.disabled=!1),v.click())}),u.addEventListener("input",e=>{P()}),u.addEventListener("paste",e=>{e.preventDefault();let t=e.clipboardData||window.clipboardData;e=t.getData("Text");document.execCommand("insertText",!1,e),P()}),x.addEventListener("click",function(){if(!i)return!1;var e=(t=location.href).indexOf("#"),t=0<e?t.slice(0,e):t,e=T(),t=`${t}#!embed=true&flags=${j()}&re=`+encodeURIComponent(e),e=`
            <iframe frameborder="0" width="500px" height="300px"
            src="${t}">
            </iframe>`,e=$(e);Swal.fire({title:"Share your visual regex",html:`
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
                `,icon:"info",iconHtml:'<span class="sweetalert-icon material-icons">share</span>',showCancelButton:!0,showConfirmButton:!1,showCloseButton:!0,cancelButtonText:"Close",didOpen:()=>{Swal.showLoading(),document.querySelectorAll("#beyond-regex-editor-copy button.copy-btn").forEach(a=>{a.addEventListener("click",e=>{var t=a.dataset.copy;navigator.clipboard.writeText(t);let r=a.querySelector("i"),n=r.className;r.className="fas fa-check",document.querySelector("#beyond-regex-editor-copy .copy-container").classList.add("copied"),a.classList.add("copied"),setTimeout(function(){let e=document.querySelector("#beyond-regex-editor-copy .copy-container");r&&e&&(r.className=n,e.classList.remove("copied"),a.classList.remove("copied"))},1e3)})}),Swal.hideLoading()}})}),N=Array.from(d.querySelectorAll("#editor-input .regex-quotes")),B(N[0],0,N),document.querySelectorAll("[name='languageRegex']").forEach(e=>{e.addEventListener("click",e=>{var t=Array.from(d.querySelectorAll("#editor-input .regex-quotes"));B(t[0],0,t),P(),null===q||q.classList.contains("loading")||null!==v&&(v.disabled=!1,v.click())})}),c.addEventListener("change",e=>{o.cleanEditor(),c.checked?a.classList.remove("no-highlighted"):a.classList.add("no-highlighted")}),d.querySelectorAll("#editor-input .regex-quotes").forEach((t,r,n)=>{t.addEventListener("click",e=>{B(t,r,n)})}),!(e=w()).embed&&"export"!=e.cmd||(document.body.className+=" embed"),e.flags?D(e.flags):D("g"),e.re&&(t=e.re+`
`,u.innerText=t),e.reLang?H(e.reLang):H("python"),E(R())),{parseRegex:E,getRegex:R,parseSharedRegex:(r,n="python")=>{var a,o,e=null;try{var s=RegexParser(),e=s(r,l,n)}catch(t){if(!(t instanceof s.RegexSyntaxError))throw t;{n=r;s=t;let e="";"number"==typeof s.lastIndex&&(r=$(n.slice(0,s.lastIndex)),a=$(n[s.lastIndex]),n=$(n.slice(s.lastIndex+1)),o=location.origin+"/beyond-regex/",editLink=o+`#!flags=${I()}&re=${encodeURIComponent(T())}&reLang=${O()}"`,e=`
                <p style="text-align: left;">Regex Flags: <strong>${I()}</strong></p>        
                <p style="text-align: left;">Regex Language syntax: <strong>${O()}</strong></p>    
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
            `,showCancelButton:!0,showConfirmButton:!1,showCloseButton:!0,cancelButtonText:"Close"})}}return e},trim:n,getParams:w,getCorrectedFlags:I,getCorrectedReLanguage:O,getCorrectedRegex:T,_updateRaphaelItemsJSON:e=>{var t=document.querySelector("#"+L);k(t,e)},$containerEditor:d,$input:a}};