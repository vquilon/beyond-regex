window.onbeforeunload = function (e) {
    var areChanges = window.hasChanges || false;
    var areUnsavedData = window.hasUnsavedData || true;
    if (areChanges & areUnsavedData) {
        var confirmationMessage = "You have made changes since you last saved, leaving the website will result in a permanent loss of the data.";
        (e || window.event).returnValue = confirmationMessage; //Gecko + IE
        return confirmationMessage; //Webkit, Safari, Chrome
    }
}

window.onload = function () {
    // UBICAR TODOS LOS SCRIPTS QUE NECESITEN ESPERAR A LA CARGA DEL DOM

    // OFFLINE HANDLER
    offlineHandler();


    let editorParser = EditorParser({
        debug: false,
        regexSONId: "regex-json",
        raphaelJSONId: "raphael-json",

        loader_view_id: "graph-loader",
    });

    // VISUALIZER PANEL
    RegexVisualizerPanel({
        editorParser: editorParser,

        loader_view_id: "graph-loader",
        progress_bar_class: "progress"
    });
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