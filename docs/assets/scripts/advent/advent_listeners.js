const advent_listeners = () => {
    let $editor = document.querySelector("#editor > div");
    document.querySelectorAll(".challenge:not(.uknown)").forEach($challenge => {
        $challenge.addEventListener("click", (event) => {
            Swal.fire({
                title: $challenge.getAttribute("ch-title"),
                // icon: "info",
                // iconHtml: `<span class="sweetalert-icon material-icons">image</span>`,
                html: `
                    <div id="challenge-editor">
                    <p>${$challenge.getAttribute("ch-description")}</p>
                    <input type="text" id="input-answer" placeholder="Write the Regex (Javascript)" />
                    </div>
                `,
                showCancelButton: true,
                showConfirmButton: false,
                showCloseButton: true,
                cancelButtonText: 'Close',
                didOpen: () => {
                    Swal.showLoading();
    
                    // Listeners button copy
                    // Se copia el elemento de $editor


                    let $cloneEditor = $editor.cloneNode(true)
                    let $challengeEditor = document.querySelector("#challenge-editor");
                    $challengeEditor.appendChild($cloneEditor);
    
                    Swal.hideLoading();
                }
            });
        });  
    })



}