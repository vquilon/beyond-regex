var EditorParser=e=>{var t=e.noneditor||!1;const r=e.debug||!1,n=e=>e.replace(/^\s+/,"").replace(/\s+$/,"");var c,o,l,i,d,a,s,u,p,g,f,y,h,m,x,v=()=>{var e=location.hash;return!e||e.length<2?e={reLang:"python",embed:!1,re:"",highlight:!0,flags:""}:((e=(e=e.slice(2)).split("&").reduce(function(e,t){var r=t.substring(t.indexOf("=")+1);return e[t.substring(0,t.indexOf("="))]=r,e},{})).raLang=e.reLang,e.embed="true"===e.embed,e.flags=e.flags||"",e.re=e.re?n(decodeURIComponent(e.re)):""),e},w={re:"",reLang:"",flags:""},S=(t?(J=v(),w={re:J.re,reLang:J.reLang,flags:J.flags}):(c=document.querySelector(e.containerSelector),o=c.querySelector("#editor-input > ."+e.inputClass),l=o.querySelector(".editor"),i=EditorSyntaxis({$containerEditor:c,$inputRegex:l,$syntaxRegex:o.querySelector(".syntax")}),d=c.querySelector("#editor-terminal").querySelector("#terminal-stats"),a=c.querySelector("#real-time-check"),s=c.querySelector("#mobile-edit"),u=c.querySelector("#terminal-error"),p=u.querySelector("#errorDef"),g=u.querySelector("#errorBox"),f=c.querySelectorAll('input[name="flag"]'),y=c.querySelector("#shareIt"),h=document.querySelector("#visualizeClick"),m=e.raphaelJSONId||"raphael-json",x=e.regexSONId||"regex-json"),document.querySelector("#"+e.loader_view_id));function b(e,t){e.innerHTML="";var r=document.createTextNode("");r.nodeValue=t,e.appendChild(r)}function L(e,t){r&&window.hasOwnProperty("JsonView")&&window.setTimeout(()=>{e.innerHTML="",JsonView.renderJSON(t,e)},50)}function C(e,t){u.classList.remove("correct-syntax"),Swal.fire({toast:!0,icon:"error",title:"Error: See the editor console error!",position:"top-right",iconColor:"white",customClass:{popup:"colored-toast"},showConfirmButton:!1,timer:1500,timerProgressBar:!0}),u.style.display="block";var r=[],n=[],e=("number"==typeof t.lastIndex&&r.push(" "+e),n.push("Error:"+t.message),n.push(""),g.style.setProperty("--position-error-ch",t.lastIndex+1+"ch"),g.scrollLeft);b(g,r.join("\n")),b(p,n.join("\n")),g.scrollLeft=e,g.scrollWidth,g.clientWidth,r=g.scrollWidth/g.textContent.length*(t.lastIndex+1)-g.clientWidth/2,g.scrollLeft=r}const q=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),$=t=>{b(g,""),b(p,"Correct syntax"),u.classList.add("correct-syntax");var r,n,o=null;try{var a=RegexParser(),s=document.querySelector("[name='languageRegex']:checked").value;let e=(o=a(t,null,s)).errors;0!==e.length&&e.forEach(e=>{C(t,e)}),r=o,n=""+(n=t).length,r=""+r.groupCount,b(d.querySelector("#re-len .stat-value"),n),b(d.querySelector("#re-groups .stat-value"),r),w={re:t,reLang:s,flags:T()}}catch(e){if(e instanceof a.RegexSyntaxError)return C(t,e),!1;throw e}return o&&(n={raw:(n=o).raw.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),groupCount:n.groupCount,tree:n.tree},L(document.querySelector("#"+x),n),c.regexson=o),i.onInput(o,R(),{target:l}),!0},k=()=>w.re,R=()=>l.innerText.replace(/\n$/,"");function E(e){l.innerText=e}function T(){for(var e="",t=0,r=f.length;t<r;t++)f[t].checked&&(e+=f[t].value);return e}const I=()=>w.flags;function B(e){for(var t=0;t<f.length;t++)~e.indexOf(f[t].value)?f[t].checked=!0:f[t].checked=!1}const O=()=>w.reLang;function N(e){document.querySelector(`[value="${e}"]`).checked=!0}if(!t){{let r=!1,t=null,e=(l.addEventListener("keydown",e=>{"enter"===e.key.toLowerCase()&&e.ctrlKey&&(null!==h&&(h.disabled=!1),h.click())}),l.addEventListener("input",e=>{$(R()),r=!0,window.hasChanges=!0,null!==h&&(h.disabled=!1),t&&clearTimeout(t),a.checked&&(t=setTimeout(()=>{h.click()},500))}),l.addEventListener("paste",e=>{e.preventDefault();let t=e.clipboardData||window.clipboardData;e=t.getData("Text"),document.execCommand("insertText",!1,e),$(R()),r=!0}),y.addEventListener("click",function(){if(!$(R()))return!1;var e=0<(t=(e=location.href).indexOf("#"))?e.slice(0,t):e,t=k(),t=`
            <iframe frameborder="0" width="500px" height="300px"
            src="${e=`${e}#!embed=true&flags=${T()}&re=`+encodeURIComponent(t)}">
            </iframe>`,t=q(t);Swal.fire({title:"Share your visual regex",html:`
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
                `,icon:"info",iconHtml:'<span class="sweetalert-icon material-icons">share</span>',showCancelButton:!0,showConfirmButton:!1,showCloseButton:!0,cancelButtonText:"Close",didOpen:()=>{Swal.showLoading(),document.querySelectorAll("#beyond-regex-editor-copy button.copy-btn").forEach(o=>{o.addEventListener("click",e=>{var t=o.dataset.copy;navigator.clipboard.writeText(t);let r=o.querySelector("i"),n=r.className;r.className="fas fa-check",document.querySelector("#beyond-regex-editor-copy .copy-container").classList.add("copied"),o.classList.add("copied"),setTimeout(function(){let e=document.querySelector("#beyond-regex-editor-copy .copy-container");r&&e&&(r.className=n,e.classList.remove("copied"),o.classList.remove("copied"))},1e3)})}),Swal.hideLoading()}})}),g.addEventListener("scroll",e=>{l.scrollLeft=e.currentTarget.scrollLeft}),document.querySelectorAll("[name='languageRegex']"));for(var P=0,D=e.length;P<D;P++)e[P].onclick=function(){$(R()),r=!0,null===S||S.classList.contains("loading")||null!==h&&(h.disabled=!1,h.click())};s.addEventListener("change",e=>{s.checked?o.classList.add("editing"):o.classList.remove("editing")})}var J=v();!J.embed&&"export"!=J.cmd||(document.body.className+=" embed"),J.flags?B(J.flags):B("g"),J.re?E(J.re+`
`):E("^BEYOND ReGex(?P<TOOLS>builder|[bv]isualize|(?=de)bugger) Born to be a RegEx editor$\n"),J.reLang?N(J.reLang):N("python"),$(R())}return{parseRegex:$,getRegex:R,parseSharedRegex:(r,n="python")=>{var o,a,e=null;try{var s=RegexParser(),e=s(r,null,n)}catch(t){if(!(t instanceof s.RegexSyntaxError))throw t;{n=r;let e="";"number"==typeof(s=t).lastIndex&&(r=q(n.slice(0,s.lastIndex)),o=q(n[s.lastIndex]),n=q(n.slice(s.lastIndex+1)),a=location.origin+"/beyond-regex/",editLink=a+`#!flags=${I()}&re=${encodeURIComponent(k())}&reLang=${O()}"`,e=`
                <p style="text-align: left;">Regex Flags: <strong>${I()}</strong></p>        
                <p style="text-align: left;">Regex Language syntax: <strong>${O()}</strong></p>    
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
            `,showCancelButton:!0,showConfirmButton:!1,showCloseButton:!0,cancelButtonText:"Close"})}}return e},trim:n,getParams:v,getCorrectedFlags:I,getCorrectedReLanguage:O,getCorrectedRegex:k,_updateRaphaelItemsJSON:e=>{L(document.querySelector("#"+m),e)},$containerEditor:c,$input:o}};