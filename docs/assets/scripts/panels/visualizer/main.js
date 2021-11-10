var RegexVisualizerPanel = function (options) {
    var inputRegex = document.getElementById('input');
    var visualBtn = document.getElementById('visualizeClick');
    var embedBtn = document.getElementById('embedIt');
    // var exportBtn = document.getElementById('exportIt');

    const isPanelShared = !inputRegex && !visualBtn && !embedBtn;
    if (isPanelShared) {
        // ES UN SHARED
        var params = options.editorParser.getParams();
        var parseRegex = options.editorParser.parseSharedRegex;
    }
    else {
        var parseRegex = options.editorParser.parseRegex;
    }

    const trim = options.editorParser.trim;
    const getReLanguage = options.editorParser.getReLanguage;
    const getFlags = options.editorParser.getFlags;
    const setFlags = options.editorParser.setFlags;
    const getInputValue = options.editorParser.getInputValue;
    const _updateRaphaelItemsJSON = options.editorParser._updateRaphaelItemsJSON;

    var $loader_view = document.querySelector(`#${options.loader_view_id}`);
    var $progress_bar = $loader_view.querySelector(`.${options.progress_bar_class}`);

    var paper = new Raphael('graphCtView', 10, 10);
    paper.canvas.id = 'graphCtSVG';

    var svg_graph_controller, svg_thumb_controller, destroyAllHandler_ThumbnailSVGControl;


    // SET DE FUNCIONES AUXILIARES
    // var dragGraphListeners = function (g) {
    //     g.addEventListener('mousedown', startMove);
    //     function startMove(e) {
    //         clearSelect();
    //         var x = e.clientX
    //             , y = e.clientY;
    //         g.addEventListener('mousemove', onMove);
    //         document.addEventListener('mouseup', unbind, true);
    //         window.addEventListener('mouseup', unbind, true);
    //         function unbind(e) {
    //             g.removeEventListener('mousemove', onMove);
    //             document.removeEventListener('mouseup', unbind, true);
    //             window.removeEventListener('mouseup', unbind, true);
    //         }
    //         function onMove(e) {
    //             var dx = x - e.clientX
    //                 , dy = y - e.clientY;
    //             if (dx > 0 && g.scrollWidth - g.scrollLeft - g.clientWidth < 2 || dx < 0 && g.scrollLeft < 1) {
    //                 document.documentElement.scrollLeft += dx;
    //                 document.body.scrollLeft += dx;
    //             } else {
    //                 g.scrollLeft += dx;
    //             }
    //             if (dy > 0 && g.scrollHeight - g.scrollTop - g.clientHeight < 2 || dy < 0 && g.scrollTop < 1) {
    //                 document.documentElement.scrollTop += dy;
    //                 document.body.scrollTop += dy;
    //             } else {
    //                 g.scrollTop += dy;
    //             }
    //             x = e.clientX;
    //             y = e.clientY;
    //         }
    //     }
    // }

    // FUNCIONES DE VISUALIZACION
    const visualizeRegex = () => {
        var regExpresion = inputRegex.value;
        var regEXSON = parseRegex(regExpresion);
        if (regEXSON) {
            // Se desactiva el boton
            visualBtn.disabled = true;

            // Antes hay que disponer un loader con una pequeña barra de carga
            // Esta se obtiene el objeto barra que se vaya cargando
            $loader_view.classList.add("loading");
            // console.log("Agregar clase loading");
            let updateProgressBar = function (newValue) {
                // console.log(`Actualizando valor de progreso: ${newValue}`);
                this.attributes.getNamedItem("data-value").value = `${newValue}`;
                this.style.transform = `scaleX(${newValue / 100})`;
            }
            $progress_bar.updateProgressBar = updateProgressBar;

            // Se destruye el controlador svg
            // if (svg_graph_controller && svg_thumb_controller && destroyAllHandler_ThumbnailSVGControl) {
            //     destroyAllHandler_ThumbnailSVGControl();
            //     destroyAllHandler_ThumbnailSVGControl = undefined;
            // }

            // Se le pasa como argumento el loader
            var raphael_items = {};

            let hideLoader = function () {
                // console.log("Ocultar loader");
                $loader_view.classList.remove("loading");
                $progress_bar.attributes.getNamedItem("data-value").value = "0";
                $progress_bar.style.transform = "";
                // Se le da al boton otra vez el aspecto normal
                visualBtn.disabled = false;
            }

            window.setTimeout(() => {

                raphael_items = RegexVisualizer(regEXSON, getFlags(), paper, $progress_bar);
                _updateRaphaelItemsJSON(raphael_items);
                // Una vez que se pinta actualizar el plugin de visualizador SVG
                // if (!svg_graph_controller && !svg_thumb_controller && !destroyAllHandler_ThumbnailSVGControl) {
                // [svg_graph_controller, svg_thumb_controller, destroyAllHandler_ThumbnailSVGControl] = ThumbnailSVGControl({
                //     mainViewId: 'graphCtView',
                //     mainSVGId: 'graphCtSVG',
                //     // Dejamos que lo autogenere con el id
                //     thumbContainerId: 'thumbViewContainer',
                // });
                // }
                if (destroyAllHandler_ThumbnailSVGControl) {
                    destroyAllHandler_ThumbnailSVGControl();
                }
                [svg_graph_controller, svg_thumb_controller, destroyAllHandler_ThumbnailSVGControl] = CustomThumbnailSVGControl({
                    mainViewId: 'graphCtView',
                    mainSVGId: 'graphCtSVG',
                    // Dejamos que lo autogenere con el id
                    thumbContainerId: 'thumbViewContainer',
                });

                // Se vuelve a ocultar el loader
                hideLoader();
            }, 0);
            return true;
        }
        else {
            visualBtn.disabled = true;
            return false;
        }

    };

    const visualizeSharedRegex = () => {
        var regExpresion = params.re;
        var regEXSON = parseRegex(regExpresion, language_selected = params.reLang);
        if (regEXSON) {
            $loader_view.classList.add("loading");
            let updateProgressBar = function (newValue) {
                this.attributes.getNamedItem("data-value").value = `${newValue}`;
                this.style.transform = `scaleX(${newValue / 100})`;
            }
            $progress_bar.updateProgressBar = updateProgressBar;

            // Se le pasa como argumento el loader
            var raphael_items = {};

            let hideLoader = function () {
                $loader_view.classList.remove("loading");
                $progress_bar.attributes.getNamedItem("data-value").value = "0";
                $progress_bar.style.transform = "";
            }

            raphael_items = RegexVisualizer(regEXSON, getFlags(), paper, $progress_bar);
            [svg_graph_controller, svg_thumb_controller, destroyAllHandler_ThumbnailSVGControl] = CustomThumbnailSVGControl({
                mainViewId: 'graphCtView',
                mainSVGId: 'graphCtSVG',
                thumbContainerId: 'thumbViewContainer',
            });
            // Se oculta el loader
            hideLoader();

            return true;
        }
        else {
            return false;
        }
    }

    const generatePanelURL = function (params) {
        let re = "";
        let flags = "";
        let reLang = "";
        if (isPanelShared) {
            re = params.re;
            flags = params.flags;
            reLang = params.reLang;
        }
        else {
            re = getInputValue();
            flags = getFlags();
            reLang = getReLanguage();
        }
        return `/panels/visualizer#!flags=${flags}&re=${encodeURIComponent(re)}&reLang=${reLang}`;
    }

    const escapeHTML = (unsafe) => {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    const _exportAsImgSVG = function (svg) {
        var svgAsXML = (new XMLSerializer).serializeToString(svg);
        return "data:image/svg+xml," + encodeURIComponent(svgAsXML);
    }
    const _exportAsImgPNG = function (svg) {
        var svgAsXML = (new XMLSerializer).serializeToString(svg);
        return "data:image/png," + encodeURIComponent(svgAsXML);
    }

    const generateImageOn = async ($canvas, $img) => {
        //Use raphael.export to fetch the SVG from the paper
        // let svg = paper.toSVG();
        let $svg = paper.canvas.cloneNode(true);

        let svgViewPort = $svg.querySelector("g#mainSVGViewPort");
        svgViewPort.removeAttribute("transform");
        svgViewPort.removeAttribute("style");
        let svgViewContainer = svgViewPort.querySelector("g#mainSVGContainer");
        svgViewContainer.removeChild(svgViewContainer.querySelector("desc"));
        svgViewContainer.removeChild(svgViewContainer.querySelector("defs"));

        // Determines if wants transparent PNG or Custom Background
        let rectBackground = svgViewContainer.firstElementChild;
        rectBackground.style.stroke = "none";
        rectBackground.style.strokeWidth = "";
        const updateBackgroundStyle = (rectBack, fill = "", stroke = "", strokeWidth = "") => {
            rectBack.style.fill = fill || rectBack.style.fill || rectBack.getAttribute("fill");
            rectBack.style.stroke = stroke || rectBack.style.stroke || rectBack.getAttribute("stroke");
            rectBack.style.strokeWidth = strokeWidth || rectBack.style.strokeWidth || rectBack.getAttribute("stroke-width");

            let ratio = window.devicePixelRatio || 1;
            let w = $svg.clientWidth || parseInt(getComputedStyle($svg).width);
            let h = $svg.clientHeight || parseInt(getComputedStyle($svg).height);

            // Due to a bug because is duplicated
            $svg.removeAttribute("xmlns:xlink");

            let svgOuter = $svg.outerHTML;
            //Use canvg to draw the SVG onto the empty canvas
            // Legacy Version
            // canvgv2($canvas, svgOuter, {
            //     ignoreAnimation: freeze,
            //     ignoreMouse: freeze,
            //     // renderCallback() {
            //     //     renderSource(svg);
            //     // }
            // });

            // New version
            // const canVinst = await canvg.Canvg.from(ctx, svgOuter);
            // canVinst.resize(w * ratio, h * ratio, custom.preserveAspectRatio.value);
            // // With Animations elements from the SVG
            // // await v.start();
            // // No animations (Normal render)
            // await canVinst.render();

            // //fetch the dataURL from the canvas and set it as src on the image
            // let dataURL = $canvas.toDataURL("image/png");
            // $img.setAttribute("src", dataURL);

            // Old Method
            let img = new Image;
            img.width = w;
            img.height = h;

            var ctx = $canvas.getContext("2d");
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
            img.onload = function () {
                ctx.drawImage(img, 0, 0);
            };
            $img.setAttribute('src', _exportAsImgSVG($svg));
        }
        updateBackgroundStyle(rectBackground);

        return {
            $img: $img,
            rectBackground: rectBackground,
            updateBackgroundStyle: updateBackgroundStyle
        }

    }
    function initEventsListener() {
        visualBtn.addEventListener("click", (event) => {
            if (!event.detail || event.detail == 1) {
                visualizeRegex();
            }
        });

        // dragGraphListeners(document.getElementById('graphCt'));

        embedBtn.addEventListener('click', function () {
            if (!parseRegex(inputRegex.value)) return false;

            var src = location.href;
            var i = src.indexOf('#');
            src = i > 0 ? src.slice(0, i) : src;
            var re = getInputValue();
            // window.prompt("Copy the html code:", html);

            const iframeLink = `<iframe frameborder="0" 
            width="${Math.ceil(paper.width)}" height="${Math.ceil(paper.height)}" 
            src="${src}#!embed=true&flags=${getFlags()}&re=${encodeURIComponent(re)}">
            </iframe>`;

            const iframeLinkLiteral = escapeHTML(iframeLink);
            Swal.fire({
                title: 'Share your visual regex',
                html: `
                <style>
                    #copy-link {
                        background: #00000029;
                        border-top-right-radius: 10px;
                        border-top-left-radius: 10px;
                        word-break: break-all;
                    }
                    #iframe-link {
                        width: 100%;
                    }
                    #iframe-link > iframe {
                        width: 80%;
                        border-bottom-left-radius: 10px;
                        border-bottom-right-radius: 10px;
                    }
                </style>
                <div>Copy the html code</div>
                <div id="copy-link">${iframeLinkLiteral}</div>`,
                // <div id="iframe-link">${iframeLink}</div>
                // `,
                icon: 'info',
                showCancelButton: true,
                showCloseButton: true,
                confirmButtonText: 'Export IMG',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    // updateLocationURL();
                    showExportImage()
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // Swal.fire(
                    //     'Cancelled',
                    //     `Your Service Worker version is ${swVersion}.`,
                    //     'info'
                    // )
                }
            });
        });

        // exportBtn.addEventListener('click', function () {
        //     var newParams = Object.assign({}, params);
        //     newParams.cmd = 'export';
        //     var hash = serializeHash(newParams);
        //     window.open(location.href.split('#!')[0] + hash, "_blank");
        // });
    }

    // Listeners
    document.querySelector("#share-visualize").addEventListener("click", (event) => {
        // OPEN SWAL WITH IFRAME LINK AND IMAGE EXPORT
        const exportedIframeURL = new Promise((resolve) => {
            resolve({
                panelURL: generatePanelURL()
            });
        })

        exportedIframeURL.then((res) => {
            Swal.fire({
                title: 'Share the interactive graph!',
                icon: "info",
                iconHtml: `<span class="sweetalert-icon material-icons">share</span>`,
                html: `
                <div class="copy-text">
                    <div id="iframe-visualizer" class="iframe-url">
                        <span>${res.panelURL}</span>
                        <div id="wrap-copy-iframe"><button id="copy-iframe"><i class="far fa-copy"></i></button></div>
                    </div>
                </div>
                
                <canvas style="width: 100%; height: unset;" id="export-image"></canvas>
                <img style="width: 100%; height: unset;" id="exported-img" src="">
                `,
                showCancelButton: true,
                showCloseButton: true,
                cancelButtonText: 'Close',
                didOpen: () => {
                    Swal.showLoading();

                    // Listeners button copy
                    document.querySelector("button#copy-iframe").addEventListener("click", function () {
                        // let input = document.querySelector("input#iframe-visualizer");
                        // input.select();
                        // document.execCommand("copy");
                        navigator.clipboard.writeText(res.panelURL);

                        document.querySelector("#iframe-visualizer").classList.add("copied");
                        // window.getSelection().removeAllRanges();
                        setTimeout(function () {
                            document.querySelector("#iframe-visualizer").classList.remove("copied");
                        }, 2500);
                    });
                    let { $img, rectBackground, updateBackgroundStyle } = generateImageOn(
                        document.querySelector("canvas#export-image"),
                        document.querySelector("img#exported-img")
                    );
                    Swal.hideLoading();
                }
            })
        })



        // Swal.fire({
        //     title: 'Share the interactive graph!',
        //     html: "",
        //     icon: 'info',
        //     showCancelButton: true,
        //     showCloseButton: true,
        //     confirmButtonText: 'Yes, update it!',
        //     cancelButtonText: 'No, cancel!',
        //     reverseButtons: true
        // }).then((result) => {
        //     if (result.isConfirmed) {
        //         Swal.fire(
        //             'Updating...',
        //             'Beyond Regex will be updated when the page reload, now!',
        //             'success'
        //         )
        //     } else if (result.dismiss === Swal.DismissReason.cancel) {
        //         Swal.fire(
        //             'Cancelled',
        //             `Your Service Worker version is ${swVersion}.`,
        //             'info'
        //         )

        //     }
        // })
    });


    if (isPanelShared) {
        visualizeSharedRegex();
    }
    else {
        initEventsListener();

        // Una vez todo cargado y configurado, parseamos la de ejemplo
        visualizeRegex();
    }




    return {
        generatePanelURL: generatePanelURL
    }
};

