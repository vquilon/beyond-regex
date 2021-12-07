const init_menu_listeners = () => {

    document.querySelector("#close-side").addEventListener("click", (event) => {
        document.querySelector("#container-main").classList.toggle("menu-open")
    });

    document.querySelector("#container-main > #sidebar-overlay").addEventListener("click", (event) => {
        document.querySelector("#container-main").classList.remove("menu-open")
    });

    // UBICAR TODOS LOS SCRIPTS QUE NECESITEN ESPERAR A LA CARGA DEL DOM
}