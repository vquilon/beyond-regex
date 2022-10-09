const init_menu_listeners = () => {
    let $sidebar = document.querySelector("#sidebar");
    let $closeSide = document.querySelector("#close-side");
    let $mainContainer = document.querySelector("#container-main");

    $closeSide.addEventListener("click", (event) => {
        $mainContainer.classList.toggle("menu-open");
    });

    document.querySelector("#container-main > #sidebar-overlay").addEventListener("click", (event) => {
        $mainContainer.classList.remove("menu-open");
    });

    $sidebar.isDragging = false;
    $sidebar.offsetX = 0, $sidebar.sideOffset = 0;
    const dragSidebar = (_x) => {
        let translateSidebar = $sidebar.sideOffset + _x - $sidebar.offsetX;
        let closeBounds = $closeSide.getBoundingClientRect();
        let lefPaddingSidebar = parseInt(window.getComputedStyle($sidebar).paddingLeft);
        
        // Limites de movimiento
        if ( translateSidebar + lefPaddingSidebar < 0 && _x > closeBounds.width*2 ) {
            $sidebar.style.setProperty("transform", `translateX(${translateSidebar}px)`, "important");
        }
    }

    const sideDown = (e, touch) => {
        let _posX = 0;
        if (touch && e.touches.length == 1) {
            _posX = e.touches[0].clientX;
        }
        else {
            e.preventDefault();
            _posX = e.clientX;
        }

        $sidebar.offsetX = _posX;
        let sideComputedStyles = window.getComputedStyle($sidebar);
        let sideTrfMatrix = new WebKitCSSMatrix(sideComputedStyles.transform);
        $sidebar.sideOffset = sideTrfMatrix.m41;
        $sidebar.isGrabbed = true;
        // dragSidebar(_posX);
    };

    $closeSide.addEventListener('mousedown', e => {
        sideDown(e, touch=false);
    });
    $closeSide.addEventListener('touchstart', e => {
        sideDown(e, touch=true);
    },  {passive: true});

    const sideMove = (e, touch) => {
        let $sidebar = document.querySelector("#sidebar");
        if ( $sidebar.isGrabbed ) {
            e.preventDefault();
            $sidebar.style.transition = "none";
            $sidebar.isDragging = true;

            let _posX = 0;
            if (touch && e.touches.length == 1) {
                _posX = e.touches[0].clientX;
            }
            else {
                _posX = e.clientX;
            }
            $sidebar.posX = _posX;

            dragSidebar(_posX);
        }
    };

     const sideUp = (e, touch) => {
        let $sidebar = document.querySelector("#sidebar");
        let $closeSide = document.querySelector("#close-side");
        if ( $sidebar.isDragging ) {
            let _posX = $sidebar.posX;

            $sidebar.isGrabbed = false;
            $sidebar.isDragging = false;
            $sidebar.style.transform = "";
            $sidebar.style.transition = "";
            
            $sidebar.sideOffset = 0;
            $sidebar.posX = 0;

            // Check si se encuentra cerrado, y se mueve mas de 100px respecto al mousedown
            // se abre el menu
            if ( e.target != $closeSide || touch ) {
                if ( ! $mainContainer.classList.contains("menu-open") ) {
                    if ( _posX - $sidebar.offsetX > 100 ) {
                        $mainContainer.classList.add("menu-open");
                    }
                }
                // Check si se encuentra abierto, y se ha movido mas de 100px respecto al mousedown
                // Se cierra
                if ( $mainContainer.classList.contains("menu-open") ) {
                    if ( _posX - $sidebar.offsetX < -100 ) {
                        $mainContainer.classList.remove("menu-open");
                    }
                }
            }
            
            $sidebar.offsetX = 0;
        }
        else if ( $sidebar.isGrabbed ) {
            $sidebar.isGrabbed = false;
            $sidebar.style.transform = "";
            $sidebar.style.transition = "";
        }
    };
    return [sideMove, sideUp];
}