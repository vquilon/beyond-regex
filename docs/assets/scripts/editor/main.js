var EditorParser=e=>{var t=e.noneditor||!1;const c=e.debug||!1;let r=null;let i=!1;const n=e=>e.replace(/^\s+/,"").replace(/\s+$/,"");var l,a,d,u,g,p,h,o,s,y,f,m,x,v,L,S,w,b,q=()=>{var e=location.hash;return!e||e.length<2?e={reLang:"python",embed:!1,re:"",highlight:!0,flags:""}:((e=(e=e.slice(2)).split("&").reduce(function(e,t){var r=t.substring(t.indexOf("=")+1);return e[t.substring(0,t.indexOf("="))]=r,e},{})).raLang=e.reLang,e.embed="true"===e.embed,e.flags=e.flags||"",e.re=e.re?n(decodeURIComponent(e.re)):""),e},C={re:"",reLang:"",flags:""},$=(t?(P=q(),C={re:P.re,reLang:P.reLang,flags:P.flags}):(l=document.querySelector(e.containerSelector),a=l.querySelector("#editor-input > ."+e.inputClass),d=a.querySelector(".editor"),u=RegexParser(),g=EditorSyntaxis({$editorRegex:d,$syntaxRegex:a.querySelector(".syntax")}),p=EditorLinter({$editorLinter:a.querySelector(".linters")}),l.querySelector("#editor-terminal"),h=l.querySelector("#editor-stats"),o=l.querySelector("#real-time-check"),s=l.querySelector("#highlighted-editor"),y=l.querySelector("#terminal-error"),f=y.querySelector("#errorDef"),m=l.querySelectorAll('input[name="flag"]'),x=l.querySelector("#shareIt"),v=l.querySelector("#advance-editor"),L=document.querySelector("#visualizeClick"),S=e.raphaelJSONId||"raphael-json",w=e.regexSONId||"regex-json",b=EditorAdvance({$containerEditor:l,$inputRegex:d,$syntaxRegex:a.querySelector(".syntax"),debugInputClass:c?".input-debug":void 0,processInput:B})),document.querySelector("#"+e.loader_view_id));const k=function(e,t){e.innerHTML="";var r=document.createTextNode("");return r.nodeValue=t,e.appendChild(r),t},A=function(e,t){var r=document.createTextNode("");return r.nodeValue=t,e.appendChild(r),t},E=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),j=function(e,t){c&&window.hasOwnProperty("JsonView")&&window.setTimeout(()=>{e.innerHTML="",JsonView.renderJSON(t,e)},50)};const D=t=>{i=!1,k(f,""),y.classList.add("correct-syntax"),p.cleanLinter();var r=null;try{var e=H();if(0!==(r=u.parse(t,c,e)).errors.length){var n=t;var a=r;p.onRegexErrors(n,a);let e=a.errors;y.classList.remove("correct-syntax"),f.innerHTML="",e.forEach(e=>{y.style.display="block";let t=[];"number"==typeof e.lastIndex&&[].push(" "+n),t.push(`Error [${e.lastIndex}]: `+e.message),t.push(""),A(f,t.join("\n"))});Swal.fire({toast:!0,icon:"error",title:"Error: See the editor console error!",position:"top-right",iconColor:"white",customClass:{popup:"colored-toast"},showConfirmButton:!1,timer:1e3,timerProgressBar:!0})}var o=t,s=r;o=""+t.length,s=""+s.groupCount,k(h.querySelector("#re-len .stat-value"),o),k(h.querySelector("#re-groups .stat-value"),s),C={re:t,reLang:e,flags:J()}}catch(e){console.error(e)}r&&(a={raw:(a=r).raw.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),groupCount:a.groupCount,tree:a.tree},o=document.querySelector("#"+w),j(o,a),l.regexson=r),g.onInput(r,R(),{target:d}),i=!0};const T=()=>C.re,R=()=>d.innerText.replace(/\n$/,"");function J(){for(var e="",t=0,r=m.length;t<r;t++)m[t].checked&&(e+=m[t].value);return e}const I=()=>C.flags;function _(e){for(var t=0;t<m.length;t++)~e.indexOf(m[t].value)?m[t].checked=!0:m[t].checked=!1}const H=()=>document.querySelector("[name='languageRegex']:checked").value,O=()=>C.reLang;function Q(e){document.querySelector(`[value="${e}"]`).checked=!0}function V(){D(R())}function B(){V(),window.hasChanges=!0,null!==L&&(L.disabled=!1),r&&clearTimeout(r),o.checked&&(r=setTimeout(()=>{L.click()},300))}const N=(e,t,r)=>{var n=H();reLangQuotes={python:['"',"'",'"""',"'''"],javascript6:["/","'",'"',"`"]},reLangPrev={python:"r",javascript6:""};let a=e.innerText;e.innerText[0]===reLangPrev[n]&&(a=e.innerText.slice(reLangPrev[n].length));var o=reLangQuotes[n].indexOf(a),o=reLangQuotes[n][(o+1)%reLangQuotes[n].length];let s=r[(t+1)%r.length];0===t?(s.innerText=o,e.innerText=""+reLangPrev[n]+o):(e.innerText=o,s.innerText=""+reLangPrev[n]+o),b.updateEditor()};var P;return t||(d.addEventListener("keydown",e=>{"enter"===e.key.toLowerCase()&&e.ctrlKey&&(null!==L&&(L.disabled=!1),L.click())}),d.addEventListener("input",e=>{B()}),d.addEventListener("paste",e=>{e.preventDefault();let t=e.clipboardData||window.clipboardData;e=t.getData("Text");document.execCommand("insertText",!1,e),B()}),x.addEventListener("click",function(){if(!i)return!1;var e=(t=location.href).indexOf("#"),t=0<e?t.slice(0,e):t,e=T(),t=`${t}#!embed=true&flags=${J()}&re=`+encodeURIComponent(e),e=`
            <iframe frameborder="0" width="500px" height="300px"
            src="${t}">
            </iframe>`,e=E(e);Swal.fire({title:"Share your visual regex",html:`
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
                `,icon:"info",iconHtml:'<span class="sweetalert-icon material-icons">share</span>',showCancelButton:!0,showConfirmButton:!1,showCloseButton:!0,cancelButtonText:"Close",didOpen:()=>{Swal.showLoading(),document.querySelectorAll("#beyond-regex-editor-copy button.copy-btn").forEach(a=>{a.addEventListener("click",e=>{var t=a.dataset.copy;navigator.clipboard.writeText(t);let r=a.querySelector("i"),n=r.className;r.className="fas fa-check",document.querySelector("#beyond-regex-editor-copy .copy-container").classList.add("copied"),a.classList.add("copied"),setTimeout(function(){let e=document.querySelector("#beyond-regex-editor-copy .copy-container");r&&e&&(r.className=n,e.classList.remove("copied"),a.classList.remove("copied"))},1e3)})}),Swal.hideLoading()}})}),P=Array.from(l.querySelectorAll("#editor-input .regex-quotes")),N(P[0],0,P),document.querySelectorAll("[name='languageRegex']").forEach(e=>{e.addEventListener("click",e=>{var t=Array.from(l.querySelectorAll("#editor-input .regex-quotes"));N(t[0],0,t),B(),null===$||$.classList.contains("loading")||null!==L&&(L.disabled=!1,L.click())})}),s.addEventListener("change",e=>{b.cleanEditor(),s.checked?a.classList.remove("no-highlighted"):(a.classList.add("no-highlighted"),a.classList.remove("new-advance"),v.checked=!1)}),v.addEventListener("change",e=>{v.checked?(b.cleanEditor(),a.classList.add("new-advance")):a.classList.remove("new-advance")}),l.querySelectorAll("#editor-input .regex-quotes").forEach((t,r,n)=>{t.addEventListener("click",e=>{N(t,r,n)})}),!(e=q()).embed&&"export"!=e.cmd||(document.body.className+=" embed"),e.flags?_(e.flags):_("g"),e.re&&(t=e.re+`
`,d.innerText=t),e.reLang?Q(e.reLang):Q("python"),V()),{parseRegex:D,getRegex:R,parseSharedRegex:(r,n="python")=>{var a,o,s,e=null;try{e=u.parse(r,c,n)}catch(t){if(!(t instanceof init_parse.RegexSyntaxError))throw t;{n=r;r=t;let e="";"number"==typeof r.lastIndex&&(a=E(n.slice(0,r.lastIndex)),o=E(n[r.lastIndex]),n=E(n.slice(r.lastIndex+1)),s=location.origin+"/beyond-regex/",editLink=s+`#!flags=${I()}&re=${encodeURIComponent(T())}&reLang=${O()}"`,e=`
                <p style="text-align: left;">Regex Flags: <strong>${I()}</strong></p>        
                <p style="text-align: left;">Regex Language syntax: <strong>${O()}</strong></p>    
                <p style="text-align:left; margin-top: 1em">${r.message}</p>
                <div style="overflow-x: auto; overflow-y: hidden; white-space: nowrap; margin-top: 1em;">${a}<strong style="
                    color: red;
                    text-decoration: underline 1px wavy;">${o}</strong>${n}</div>
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
            `,showCancelButton:!0,showConfirmButton:!1,showCloseButton:!0,cancelButtonText:"Close"})}}return e},trim:n,getParams:q,getCorrectedFlags:I,getCorrectedReLanguage:O,getCorrectedRegex:T,_updateRaphaelItemsJSON:e=>{var t=document.querySelector("#"+S);j(t,e)},$containerEditor:l,$input:a}};