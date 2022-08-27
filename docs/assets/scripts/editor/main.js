var EditorParser=e=>{var t=e.noneditor||!1;const D=e.debug||!1,r=e=>e.replace(/^\s+/,"").replace(/\s+$/,"");var a,n,s,c,o,l,i,d,u,p,g,f,y,h,m,x=()=>{var e=location.hash;return!e||e.length<2?e={reLang:"python",embed:!1,re:"",highlight:!0,flags:""}:((e=(e=e.slice(2)).split("&").reduce(function(e,t){var r=t.substring(t.indexOf("=")+1);return e[t.substring(0,t.indexOf("="))]=r,e},{})).raLang=e.reLang,e.embed="true"===e.embed,e.flags=e.flags||"",e.re=e.re?r(decodeURIComponent(e.re)):""),e},v={re:"",reLang:"",flags:""},w=(t?(P=x(),v={re:P.re,reLang:P.reLang,flags:P.flags}):(a=document.querySelector(e.containerSelector),n=a.querySelector("#editor-input > ."+e.inputClass),s=n.querySelector(".editor"),c=EditorSyntaxis({$containerEditor:a,$inputRegex:s,$syntaxRegex:n.querySelector(".syntax")}),o=a.querySelector("#editor-terminal").querySelector("#terminal-stats"),l=a.querySelector("#real-time-check"),i=a.querySelector("#mobile-edit"),d=a.querySelector("#terminal-error"),u=d.querySelector("#errorDef"),p=d.querySelector("#errorBox"),g=a.querySelectorAll('input[name="flag"]'),f=a.querySelector("#shareIt"),y=document.querySelector("#visualizeClick"),h=e.raphaelJSONId||"raphael-json",m=e.regexSONId||"regex-json"),document.querySelector("#"+e.loader_view_id));function S(e,t){e.innerHTML="";var r=document.createTextNode("");r.nodeValue=t,e.appendChild(r)}function b(e,t){D&&window.hasOwnProperty("JsonView")&&window.setTimeout(()=>{e.innerHTML="",JsonView.renderJSON(t,e)},50)}const J=function(e,t){e=""+e.length,t=""+t.groupCount;S(o.querySelector("#re-len .stat-value"),e),S(o.querySelector("#re-groups .stat-value"),t)},j=function(){S(p,""),S(u,"Correct syntax"),d.classList.add("correct-syntax")},L=function(e,t){d.classList.remove("correct-syntax");Swal.fire({toast:!0,icon:"error",title:"Error: See the editor console error!",position:"top-right",iconColor:"white",customClass:{popup:"colored-toast"},showConfirmButton:!1,timer:1500,timerProgressBar:!0}),d.style.display="block";var r=[],n=[],e=("number"==typeof t.lastIndex&&r.push(" "+e),n.push("Error:"+t.message),n.push(""),p.style.setProperty("--position-error-ch",t.lastIndex+1+"ch"),p.scrollLeft);S(p,r.join("\n")),S(u,n.join("\n")),p.scrollLeft=e;p.scrollWidth,p.clientWidth;r=p.scrollWidth/p.textContent.length*(t.lastIndex+1)-p.clientWidth/2;p.scrollLeft=r},C=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");const W=e=>{e={raw:e.raw.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),groupCount:e.groupCount,tree:e.tree};var t=document.querySelector("#"+m);b(t,e)},q=t=>{j();var r=null;try{var n=RegexParser(),o=_();let e=(r=n(t,null,o)).errors;0!==e.length&&e.forEach(e=>{L(t,e)}),J(t,r),v={re:t,reLang:o,flags:E()}}catch(e){if(e instanceof n.RegexSyntaxError)return L(t,e),!1;throw e}return r&&(W(r),a.regexson=r),c.onInput(r,k(),{target:s}),!0};const $=()=>v.re,k=()=>s.innerText.replace(/\n$/,"");function R(e){s.innerText=e}const E=function(){for(var e="",t=0,r=g.length;t<r;t++)g[t].checked&&(e+=g[t].value);return e},T=()=>v.flags;function I(e){for(var t=0;t<g.length;t++)~e.indexOf(g[t].value)?g[t].checked=!0:g[t].checked=!1}const _=()=>document.querySelector("[name='languageRegex']:checked").value,B=()=>v.reLang;function O(e){document.querySelector(`[value="${e}"]`).checked=!0}if(!t){{let r=!1,t=null,e=(s.addEventListener("keydown",e=>{"enter"===e.key.toLowerCase()&&e.ctrlKey&&(null!==y&&(y.disabled=!1),y.click())}),s.addEventListener("input",e=>{q(k()),r=!0,window.hasChanges=!0,null!==y&&(y.disabled=!1),t&&clearTimeout(t),l.checked&&(t=setTimeout(()=>{y.click()},500))}),s.addEventListener("paste",e=>{e.preventDefault();let t=e.clipboardData||window.clipboardData;e=t.getData("Text");document.execCommand("insertText",!1,e),q(k()),r=!0}),f.addEventListener("click",function(){if(!q(k()))return!1;var e=(t=location.href).indexOf("#"),t=0<e?t.slice(0,e):t,e=$(),t=`${t}#!embed=true&flags=${E()}&re=`+encodeURIComponent(e),e=`
            <iframe frameborder="0" width="500px" height="300px"
            src="${t}">
            </iframe>`,e=C(e);Swal.fire({title:"Share your visual regex",html:`
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
                `,icon:"info",iconHtml:'<span class="sweetalert-icon material-icons">share</span>',showCancelButton:!0,showConfirmButton:!1,showCloseButton:!0,cancelButtonText:"Close",didOpen:()=>{Swal.showLoading(),document.querySelectorAll("#beyond-regex-editor-copy button.copy-btn").forEach(o=>{o.addEventListener("click",e=>{var t=o.dataset.copy;navigator.clipboard.writeText(t);let r=o.querySelector("i"),n=r.className;r.className="fas fa-check",document.querySelector("#beyond-regex-editor-copy .copy-container").classList.add("copied"),o.classList.add("copied"),setTimeout(function(){let e=document.querySelector("#beyond-regex-editor-copy .copy-container");r&&e&&(r.className=n,e.classList.remove("copied"),o.classList.remove("copied"))},1e3)})}),Swal.hideLoading()}})}),p.addEventListener("scroll",e=>{s.scrollLeft=e.currentTarget.scrollLeft}),document.querySelectorAll("[name='languageRegex']"));for(var N=0,A=e.length;N<A;N++)e[N].onclick=function(){q(k()),r=!0,null===w||w.classList.contains("loading")||null!==y&&(y.disabled=!1,y.click())};i.addEventListener("change",e=>{i.checked?n.classList.add("editing"):n.classList.remove("editing")})}var P=x();!P.embed&&"export"!=P.cmd||(document.body.className+=" embed"),P.flags?I(P.flags):I("g"),P.re?R(P.re+`
`):R("^BEYOND ReGex(?P<TOOLS>builder|[bv]isualize|(?=de)bugger) Born to be a RegEx editor$\n"),P.reLang?O(P.reLang):O("python"),q(k())}return{parseRegex:q,getRegex:k,parseSharedRegex:(r,n="python")=>{var o,a,e=null;try{var s=RegexParser(),e=s(r,null,n)}catch(t){if(!(t instanceof s.RegexSyntaxError))throw t;{n=r;s=t;let e="";"number"==typeof s.lastIndex&&(r=C(n.slice(0,s.lastIndex)),o=C(n[s.lastIndex]),n=C(n.slice(s.lastIndex+1)),a=location.origin+"/beyond-regex/",editLink=a+`#!flags=${T()}&re=${encodeURIComponent($())}&reLang=${B()}"`,e=`
                <p style="text-align: left;">Regex Flags: <strong>${T()}</strong></p>        
                <p style="text-align: left;">Regex Language syntax: <strong>${B()}</strong></p>    
                <p style="text-align:left; margin-top: 1em">${s.message}</p>
                <div style="overflow-x: auto; overflow-y: hidden; white-space: nowrap; margin-top: 1em;">${r}<strong style="
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
            `,showCancelButton:!0,showConfirmButton:!1,showCloseButton:!0,cancelButtonText:"Close"})}}return e},trim:r,getParams:x,getCorrectedFlags:T,getCorrectedReLanguage:B,getCorrectedRegex:$,_updateRaphaelItemsJSON:e=>{var t=document.querySelector("#"+h);b(t,e)},$containerEditor:a,$input:n}};