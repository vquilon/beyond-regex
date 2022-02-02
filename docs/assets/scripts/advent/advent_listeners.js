const advent_listeners=()=>{let n=document.querySelector("#editor > div");document.querySelectorAll(".challenge:not(.uknown)").forEach(t=>{t.addEventListener("click",e=>{Swal.fire({title:t.getAttribute("ch-title"),html:`
                    <div id="challenge-editor">
                    <p>${t.getAttribute("ch-description")}</p>
                    <input type="text" id="input-answer" placeholder="Write the Regex (Javascript)" />
                    </div>
                `,showCancelButton:!0,showConfirmButton:!1,showCloseButton:!0,cancelButtonText:"Close",didOpen:()=>{Swal.showLoading();var e=n.cloneNode(!0);let t=document.querySelector("#challenge-editor");t.appendChild(e),Swal.hideLoading()}})})})};