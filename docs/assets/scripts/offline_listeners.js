var offlineHandler = () => {
    // Almacenar en cache un parametro que si ha aceptado que esta offline
    // no vuelva a notificarle que vuelve a estar offline
    window._acceptedOffline = false;
    const $connectionStatus = document.querySelector("#connection-status-box");
    const $offlineButton = document.querySelector("#offline-button");
    const $minimizedArrow = document.querySelector("#connection-arrow");

    const showOfflineInfo = () => {
        Swal.fire({
            title: 'No connection',
            text: "You dont have connection! but dont worry, we saved your progress when back your connection, while you can work with any problem and we cache all your changes",
            icon: 'warning',
            showCloseButton: true,
            confirmButtonText: 'Ok, thanks!',
        }).then((result) => {
            // if (result.isConfirmed) {

            // } else if (result.dismiss === Swal.DismissReason.cancel) {

            // }
            window._acceptedOffline = true;
            // Mostrar Fixed Box Connection
            $connectionStatus.classList.add("offline");
        });
    }

    const callbackOnline = () => {
        $connectionStatus.classList.add("online");
        $offlineButton.disabled = true;
        // Update your UI to reflect that the connection is back.
        // Actualiza el fixed box y lo oculta
        setTimeout(() => {
            // Oculto la caja de conexion
            $connectionStatus.classList.remove("offline");
            $connectionStatus.classList.remove("online");
        }, 2000);
    }
    const callbackOffline = () => {
        // Update your UI to reflect that there's no connection.
        if (!window._acceptedOffline) {
            // Mostrar un Seewt alert 2
            showOfflineInfo();
        }
        else {
            $connectionStatus.classList.add("offline");
            $offlineButton.disabled = false;
        }
        // Agregar un fixed box con la informacion, que abre otra vez el sweet alert si se hace click
        // en ver informacion
    }

    // navigator.connection.onchange = () => {
    //     if (navigator.onLine) {
    //         callbackOnline();
    //     }
    //     else {
    //         callbackOffline();
    //     }
    // }

    // CONTROL VISTA OFFLINE (POPUP)
    window.addEventListener('offline', () => {
        callbackOffline();
    });

    window.addEventListener('online', () => {
        callbackOnline();
    });

    $offlineButton.addEventListener('click', (event) => {
        showOfflineInfo();
    })

    $minimizedArrow.addEventListener('click', (event) => {
        $connectionStatus.classList.toggle("minimized");
    });

    if ( !navigator.onLine ) {
        showOfflineInfo();
    }
};