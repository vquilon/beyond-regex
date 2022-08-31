var EditorParser=e=>{var t=e.noneditor||!1;const D=e.debug||!1,r=e=>e.replace(/^\s+/,"").replace(/\s+$/,"");var c,n,l,i,d,o,a,u,p,g,s,f,y,h,m,x=()=>{var e=location.hash;return!e||e.length<2?e={reLang:"python",embed:!1,re:"",highlight:!0,flags:""}:((e=(e=e.slice(2)).split("&").reduce(function(e,t){var r=t.substring(t.indexOf("=")+1);return e[t.substring(0,t.indexOf("="))]=r,e},{})).raLang=e.reLang,e.embed="true"===e.embed,e.flags=e.flags||"",e.re=e.re?r(decodeURIComponent(e.re)):""),e},v={re:"",reLang:"",flags:""},w=(t?(P=x(),v={re:P.re,reLang:P.reLang,flags:P.flags}):(c=document.querySelector(e.containerSelector),n=c.querySelector("#editor-input > ."+e.inputClass),l=n.querySelector(".editor"),i=EditorSyntaxis({$containerEditor:c,$inputRegex:l,$syntaxRegex:n.querySelector(".syntax")}),d=c.querySelector("#editor-terminal").querySelector("#terminal-stats"),o=c.querySelector("#real-time-check"),a=c.querySelector("#mobile-edit"),u=c.querySelector("#terminal-error"),p=u.querySelector("#errorDef"),g=u.querySelector("#errorBox"),s=c.querySelectorAll('input[name="flag"]'),f=c.querySelector("#shareIt"),y=document.querySelector("#visualizeClick"),h=e.raphaelJSONId||"raphael-json",m=e.regexSONId||"regex-json"),document.querySelector("#"+e.loader_view_id));function S(e,t){e.innerHTML="";var r=document.createTextNode("");r.nodeValue=t,e.appendChild(r)}function b(e,t){D&&window.hasOwnProperty("JsonView")&&window.setTimeout(()=>{e.innerHTML="",JsonView.renderJSON(t,e)},50)}function L(e,t){u.classList.remove("correct-syntax"),Swal.fire({toast:!0,icon:"error",title:"Error: See the editor console error!",position:"top-right",iconColor:"white",customClass:{popup:"colored-toast"},showConfirmButton:!1,timer:1500,timerProgressBar:!0}),u.style.display="block";var r=[],n=[],e=("number"==typeof t.lastIndex&&r.push(" "+e),n.push("Error:"+t.message),n.push(""),g.style.setProperty("--position-error-ch",t.lastIndex+1+"ch"),g.scrollLeft);S(g,r.join("\n")),S(p,n.join("\n")),g.scrollLeft=e,g.scrollWidth,g.clientWidth,r=g.scrollWidth/g.textContent.length*(t.lastIndex+1)-g.clientWidth/2,g.scrollLeft=r}const C=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),q=t=>{S(g,""),S(p,"Correct syntax"),u.classList.add("correct-syntax");var r,n,o=null;try{var a=RegexParser(),s=document.querySelector("[name='languageRegex']:checked").value;let e=(o=a(t,null,s)).errors;0!==e.length&&e.forEach(e=>{L(t,e)}),r=o,n=""+(n=t).length,r=""+r.groupCount,S(d.querySelector("#re-len .stat-value"),n),S(d.querySelector("#re-groups .stat-value"),r),v={re:t,reLang:s,flags:E()}}catch(e){if(e instanceof a.RegexSyntaxError)return L(t,e),!1;throw e}return o&&(n={raw:(n=o).raw.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),groupCount:n.groupCount,tree:n.tree},b(document.querySelector("#"+m),n),c.regexson=o),i.onInput(o,k(),{target:l}),!0},$=()=>v.re,k=()=>l.innerText.replace(/\n$/,"");function R(e){l.innerText=e}function E(){for(var e="",t=0,r=s.length;t<r;t++)s[t].checked&&(e+=s[t].value);return e}const T=()=>v.flags;function I(e){for(var t=0;t<s.length;t++)~e.indexOf(s[t].value)?s[t].checked=!0:s[t].checked=!1}const B=()=>v.reLang;function O(e){document.querySelector(`[value="${e}"]`).checked=!0}if(!t){{let r=!1,t=null,e=(l.addEventListener("keydown",e=>{"enter"===e.key.toLowerCase()&&e.ctrlKey&&(null!==y&&(y.disabled=!1),y.click())}),l.addEventListener("input",e=>{q(k()),r=!0,window.hasChanges=!0,null!==y&&(y.disabled=!1),t&&clearTimeout(t),o.checked&&(t=setTimeout(()=>{y.click()},500))}),l.addEventListener("paste",e=>{e.preventDefault();let t=e.clipboardData||window.clipboardData;e=t.getData("Text"),document.execCommand("insertText",!1,e),q(k()),r=!0}),f.addEventListener("click",function(){if(!q(k()))return!1;var e=0<(t=(e=location.href).indexOf("#"))?e.slice(0,t):e,t=$(),t=`
            <iframe frameborder="0" width="500px" height="300px"
            src="${e=`${e}#!embed=true&flags=${E()}&re=`+encodeURIComponent(t)}">
            </iframe>`,t=C(t);Swal.fire({title:"Share your visual regex",html:`
                <div id="beyond-regex-editor-copy" class="container-copy">
                    <div class="copy-container">
                        <div class="copy-content">
                            <span>${e}</span>
                        </div>
                        <div class="wrap-copy-btn">
                            <button title="Copy link" data-copy="${e}" class="copy-btn">
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
                            <button title="Copy iframe" data-copy="${t}" class="copy-btn">
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
                `,icon:"info",iconHtml:'<span class="sweetalert-icon material-icons">share</span>',showCancelButton:!0,showConfirmButton:!1,showCloseButton:!0,cancelButtonText:"Close",didOpen:()=>{Swal.showLoading(),document.querySelectorAll("#beyond-regex-editor-copy button.copy-btn").forEach(o=>{o.addEventListener("click",e=>{var t=o.dataset.copy;navigator.clipboard.writeText(t);let r=o.querySelector("i"),n=r.className;r.className="fas fa-check",document.querySelector("#beyond-regex-editor-copy .copy-container").classList.add("copied"),o.classList.add("copied"),setTimeout(function(){let e=document.querySelector("#beyond-regex-editor-copy .copy-container");r&&e&&(r.className=n,e.classList.remove("copied"),o.classList.remove("copied"))},1e3)})}),Swal.hideLoading()}})}),g.addEventListener("scroll",e=>{l.scrollLeft=e.currentTarget.scrollLeft}),document.querySelectorAll("[name='languageRegex']"));for(var N=0,J=e.length;N<J;N++)e[N].onclick=function(){q(k()),r=!0,null===w||w.classList.contains("loading")||null!==y&&(y.disabled=!1,y.click())};a.addEventListener("change",e=>{a.checked?n.classList.add("editing"):n.classList.remove("editing")})}var P=x();!P.embed&&"export"!=P.cmd||(document.body.className+=" embed"),P.flags?I(P.flags):I("g"),P.re?R(P.re+`
`):R("^BEYOND ReGex(?P<TOOLS>builder|[bv]isualize|(?=de)bugger) Born to be a RegEx editor$\n"),P.reLang?O(P.reLang):O("python"),q(k())}return{parseRegex:q,getRegex:k,parseSharedRegex:(r,n="python")=>{var o,a,e=null;try{var s=RegexParser(),e=s(r,null,n)}catch(t){if(!(t instanceof s.RegexSyntaxError))throw t;{n=r;let e="";"number"==typeof(s=t).lastIndex&&(r=C(n.slice(0,s.lastIndex)),o=C(n[s.lastIndex]),n=C(n.slice(s.lastIndex+1)),a=location.origin+"/beyond-regex/",editLink=a+`#!flags=${T()}&re=${encodeURIComponent($())}&reLang=${B()}"`,e=`
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
            `,showCancelButton:!0,showConfirmButton:!1,showCloseButton:!0,cancelButtonText:"Close"})}}return e},trim:r,getParams:x,getCorrectedFlags:T,getCorrectedReLanguage:B,getCorrectedRegex:$,_updateRaphaelItemsJSON:e=>{b(document.querySelector("#"+h),e)},$containerEditor:c,$input:n}};