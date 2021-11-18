var RegexVisualizerPanel = function (options) {
    var inputRegex = document.getElementById('input');
    var visualBtn = document.getElementById('visualizeClick');
    var exportBtn = document.getElementById('exportIt');

    const isPanelShared = !inputRegex && !visualBtn;
    if (isPanelShared) {
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

    var paper = new Raphael('visualizer-graphView', 10, 10);
    paper.canvas.id = 'visualizer-graphSVG';

    var svg_graph_controller, svg_thumb_controller, destroyAllHandler_ThumbnailSVGControl;
    const visualizeRegex = () => {
        var regExpresion = inputRegex.value;
        var regEXSON = parseRegex(regExpresion);
        if (regEXSON) {
            visualBtn.disabled = true;
            $loader_view.classList.add("loading");
            let updateProgressBar = function (newValue) {
                this.attributes.getNamedItem("data-value").value = `${newValue}`;
                this.style.transform = `scaleX(${newValue / 100})`;
            }
            $progress_bar.updateProgressBar = updateProgressBar;
            var raphael_items = {};

            let hideLoader = function () {
                $loader_view.classList.remove("loading");
                $progress_bar.attributes.getNamedItem("data-value").value = "0";
                $progress_bar.style.transform = "";
                visualBtn.disabled = false;
            }

            window.setTimeout(() => {

                raphael_items = RegexVisualizer(regEXSON, getFlags(), paper, $progress_bar);
                _updateRaphaelItemsJSON(raphael_items);
                if (destroyAllHandler_ThumbnailSVGControl) {
                    destroyAllHandler_ThumbnailSVGControl();
                }
                [svg_graph_controller, svg_thumb_controller, destroyAllHandler_ThumbnailSVGControl] = CustomThumbnailSVGControl({
                    mainViewId: 'visualizer-graphView',
                    mainSVGId: 'visualizer-graphSVG',
                    thumbContainerId: 'thumbViewContainer',
                });
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
            var raphael_items = {};

            let hideLoader = function () {
                $loader_view.classList.remove("loading");
                $progress_bar.attributes.getNamedItem("data-value").value = "0";
                $progress_bar.style.transform = "";
            }

            raphael_items = RegexVisualizer(regEXSON, getFlags(), paper, $progress_bar);
            [svg_graph_controller, svg_thumb_controller, destroyAllHandler_ThumbnailSVGControl] = CustomThumbnailSVGControl({
                mainViewId: 'visualizer-graphView',
                mainSVGId: 'visualizer-graphSVG',
                thumbContainerId: 'thumbViewContainer',
            });
            hideLoader();

            return true;
        }
        else {
            return false;
        }
    }

    const generatePanelURL = function () {
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
        const src = `${location.href}/panels/visualizer`
        const iframeLink = `<iframe frameborder="0" 
            width="500px" height="300px" 
            src="${src}#!embed=true&flags=${flags}&re=${encodeURIComponent(re)}&reLang=${reLang}">
            </iframe>`;

        return iframeLink;
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

    const generateImageOn = async ($canvas, $img, $anchor, imageType="svg") => {
        let $svg = paper.canvas.cloneNode(true);

        let svgViewPort = $svg.querySelector("g#mainSVGViewPort");
        svgViewPort.removeAttribute("transform");
        svgViewPort.removeAttribute("style");
        let svgViewContainer = svgViewPort.querySelector("g#mainSVGContainer");
        svgViewContainer.removeChild(svgViewContainer.querySelector("desc"));
        svgViewContainer.removeChild(svgViewContainer.querySelector("defs"));
        let rectBackground = svgViewContainer.firstElementChild;
        rectBackground.style.stroke = "none";
        rectBackground.style.strokeWidth = "";
        const updateBackgroundStyle = (rectBack, _imageType, fill = "", stroke = "", strokeWidth = "") => {
            rectBack.style.fill = fill || rectBack.style.fill || rectBack.getAttribute("fill");
            rectBack.style.stroke = stroke || rectBack.style.stroke || rectBack.getAttribute("stroke");
            rectBack.style.strokeWidth = strokeWidth || rectBack.style.strokeWidth || rectBack.getAttribute("stroke-width");

            let ratio = window.devicePixelRatio || 1;
            let w = $svg.clientWidth || parseInt(getComputedStyle($svg).width);
            let h = $svg.clientHeight || parseInt(getComputedStyle($svg).height);
            $svg.removeAttribute("xmlns:xlink");
            if (_imageType === "svg") {
                let url_blob = _exportAsImgSVG($svg)
                $img.setAttribute('src', url_blob);
                $anchor.setAttribute('href', url_blob);
            }
            if (_imageType === "png") {

                let svgOuter = $svg.outerHTML;
                canvgv2($canvas, svgOuter, {
                    ignoreAnimation: true,
                    ignoreMouse: true,
                });
                const getPng = async () => {
                    var ctx = $canvas.getContext("2d");
                    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
                    const canVinst = await canvg.Canvg.from(ctx, svgOuter);
                    canVinst.resize(w * ratio, h * ratio, "xMidYMid meet");
                    await canVinst.render();
                    let url_blob = $canvas.toDataURL("image/png");
                    $img.setAttribute('src', url_blob);
                    $anchor.setAttribute('href', url_blob);
                }
                let url_blob = $canvas.toDataURL("image/png");
                $img.setAttribute('src', url_blob);
                $anchor.setAttribute('href', url_blob);
            }
        }
        updateBackgroundStyle(rectBackground, imageType);

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

        exportBtn.addEventListener("click", (event) => {

            Swal.fire({
                title: 'Share the Image Graph (PNG)!',
                icon: "info",
                iconHtml: `<span class="sweetalert-icon material-icons">share</span>`,
                html: `
                <canvas style="display:none; width: 100%; height: unset;" id="export-image"></canvas>
                
                <a class="anchor-export-img" href="" download="graph-regex.png"><img id="exported-img" src=""><span><i class="fas fa-download"></i>PNG</span></a>
                `,
                showCancelButton: true,
                showConfirmButton: false,
                showCloseButton: true,
                cancelButtonText: 'Close',
                didOpen: () => {
                    Swal.showLoading();

                    let { $img, rectBackground, updateBackgroundStyle } = generateImageOn(
                        document.querySelector("canvas#export-image"),
                        document.querySelector("img#exported-img"),
                        document.querySelector("img#exported-img").parentElement,
                        imageType="png"
                    );

                    Swal.hideLoading();
                }
            });

        }); 
    }
    document.querySelector("#share-visualize").addEventListener("click", (event) => {
        const exportedIframeURL = new Promise((resolve) => {
            resolve({
                panelURL: generatePanelURL()
            });
        });

        exportedIframeURL.then((res) => {
            Swal.fire({
                title: 'Share the interactive graph!',
                icon: "info",
                iconHtml: `<span class="sweetalert-icon material-icons">share</span>`,
                html: `
                <div id="visualizer-iframe-copy" class="container-copy">
                    <div class="iframe-copier">
                        <div class="iframe-content">
                            <span>${escapeHTML(res.panelURL)}</span>
                        </div>
                        <div class="wrap-copy-iframe"><button class="copy-iframe"><i class="far fa-copy"></i></button></div>
                    </div>
                </div>
                <canvas style="display:none; width: 100%; height: unset;" id="export-image"></canvas>
                
                <a class="anchor-export-img" href="" download="graph-regex.png"><img id="exported-img" src=""><span><i class="fas fa-download"></i>SVG</span></a>
                `,
                showCancelButton: true,
                showConfirmButton: false,
                showCloseButton: true,
                cancelButtonText: 'Close',
                didOpen: () => {
                    Swal.showLoading();
                    document.querySelector("#visualizer-iframe-copy button.copy-iframe").addEventListener("click", function () {
                        navigator.clipboard.writeText(res.panelURL);

                        document.querySelector("#visualizer-iframe-copy .copy-iframe>i").className = "fas fa-check";
                        document.querySelector("#visualizer-iframe-copy .iframe-copier").classList.add("copied");
                        setTimeout(function () {
                            let icon_copy = document.querySelector("#visualizer-iframe-copy .copy-iframe>i");
                            let iframe_copier = document.querySelector("#visualizer-iframe-copy .iframe-copier");
                            if (icon_copy && iframe_copier) {
                                icon_copy = "far fa-copy";
                                iframe_copier.classList.remove("copied");
                            }
                        }, 1000);
                    });
                    let { $img, rectBackground, updateBackgroundStyle } = generateImageOn(
                        document.querySelector("canvas#export-image"),
                        document.querySelector("img#exported-img"),
                        document.querySelector("img#exported-img").parentElement,
                        imageType="svg"
                    );

                    Swal.hideLoading();
                }
            });
        })
    });


    if (isPanelShared) {
        visualizeSharedRegex();
    }
    else {
        initEventsListener();
        visualizeRegex();
    }




    return {
        generatePanelURL: generatePanelURL
    }
};

