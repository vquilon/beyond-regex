
function isDescendant(parent, child) {
    var node = child.parentNode;
    while (node != null) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

window.onload = function () {
    changeDark2LightTheme();

    document.querySelector("#title .version").innerText = `${window.SW_VERSION}.${window.SW_BUILD}`;

    let [sidebarMove, sidebarUp] = init_menu_listeners();
    document.addEventListener('mousemove', e => {
        sidebarMove(e, touch=false);

    });
    document.addEventListener('touchmove', e => {
        sidebarMove(e, touch=true);
    }, {passive: false});
    document.addEventListener('mouseup', e => {
        sidebarUp(e, touch=false);
    });
    document.addEventListener('touchend', e => {
        sidebarUp(e, touch=true);

    });

    // UBICAR TODOS LOS SCRIPTS QUE NECESITEN ESPERAR A LA CARGA DEL DOM

    // OFFLINE HANDLER
    offlineHandler();

    // CREAR UN FICHERO CON VARIABLES GLOBALES CON LOS NOMBRES DE CLASES o IDs
    document.addEventListener("keyup", (event) => {
        if (event.key === "[") {
            if(!isDescendant(beyondEditorIns.editorParser.$input, window.getSelection().anchorNode)) {
                document.querySelector("#close-side").click();
            }
        }
    })

}