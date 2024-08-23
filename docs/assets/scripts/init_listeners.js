window.onbeforeunload = function (e) {
    var areChanges = window.hasChanges || false;
    var areUnsavedData = window.hasUnsavedData || true;
    if (areChanges & areUnsavedData) {
        var confirmationMessage = "You have made changes since you last saved, leaving the website will result in a permanent loss of the data.";
        (e || window.event).returnValue = confirmationMessage; //Gecko + IE
        return confirmationMessage; //Webkit, Safari, Chrome
    }
    // var data = JSON.stringify( graph.serialize() );
	// localStorage.setItem("litegraphg demo backup", data );
}


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


    let beyondEditor = Editor({
        // debug: window.DEBUG
    });
    let beyondEditorIns = beyondEditor.init();
    // CREAR UN FICHERO CON VARIABLES GLOBALES CON LOS NOMBRES DE CLASES o IDs
    document.addEventListener("keyup", (event) => {
        if (event.key === "[") {
            if(!isDescendant(beyondEditorIns.editorParser.$input, window.getSelection().anchorNode)) {
                document.querySelector("#close-side").click();
            }
        }
    })


    // VISUALIZER PANEL
    panelVisualizer({editorParser: beyondEditorIns.editorParser}).init();
}



// const startPhysicsEngine = () => {
//     let [resize_world, create_body_cb, remove_rbodies, playpause_world] = DOMPhysicsBox2D({
//         initPause: true,
//         debug: false, keyListeners: false,
//         debug_DOM_id: "debug",
//         rigid_DOM_class: "box2d-object"
//     });

//     let makeRObject = function(event) {
//         playpause_world();
//         document.querySelector(".heading h1 em").addEventListener("click", stopPhysicEngine, false);
//         try {
//             create_body_cb($version, {randomForce: true});
//             document.querySelectorAll(".social-icon").forEach(function($el){
//                 create_body_cb($el, {randomForce: false});
//             });
//             setTimeout(function(){ resize_world(); }, 100);
//         } catch (e) {
//             console.error(e);
//         } 
//         event.target.removeEventListener("click", makeRObject, false);
//     };

//     let $version = document.querySelector(".heading span.version");
//     $version.addEventListener("click", makeRObject, false);

//     let reportWindowSize = function() {
//         resize_world();
//     }
//     window.addEventListener('resize', reportWindowSize);

//     let stopPhysicEngine = function(event) {
//         remove_rbodies();
//         $version.addEventListener("click", makeRObject, false);
//         event.target.removeEventListener("click", stopPhysicEngine, false);
//     }
// }

/* < body onbeforeunload = "ConfirmClose()" onunload = "HandleOnClose()" > */

// var myclose = false;

// function ConfirmClose() {
//     if (event.clientY < 0) {
//         event.returnValue = 'You have closed the browser. Do you want to logout from your application?';
//         setTimeout('myclose=false', 10);
//         myclose = true;
//     }
// }

// function HandleOnClose() {
//     if (myclose == true) {
//         //the url of your logout page which invalidate session on logout 
//         location.replace('/contextpath/j_spring_security_logout');
//     }
// }