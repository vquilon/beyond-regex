var RegexVisualizer = function (options) {
    var $loader_view = document.querySelector(`#${options.loader_view_id}`);
    var $progress_bar = $loader_view.querySelector(`.${options.progress_bar_class}`);

    var paper = new Raphael('graphCtView', 10, 10);
    paper.canvas.id = 'graphCtSVG';
    // var paper = new Raphael('RaphaelPaperContainer', 10, 10);
    // paper.canvas.id = 'raphaelSVG';
    // TODO: Dibujar un boton que sea el de visualizar para dar por entendido que hay
    // que pulsarlo si se quiere ver algo	
    var svg_graph_controller, svg_thumb_controller, destroyAllHandler_ThumbnailSVGControl;
    
    var inputRegex = document.getElementById('input');
    var inputCt = document.getElementById('inputCt');
    // var visualBtn = document.getElementById('visualIt');
    // var parseBtn = document.getElementById('parseClick');
    var visualBtn = document.getElementById('visualizeClick');
    var embedBtn = document.getElementById('embedIt');
    // var exportBtn = document.getElementById('exportIt');
    var errorBox = document.getElementById('errorBox');
    var flags = document.getElementsByName('flag');
    var flagBox = document.getElementById('flagBox');

    // var languageRegex = document.getElementById('languageRegex');


    // SET DE FUNCIONES AUXILIARES
    var showExportImage = function () {
        var ratio = window.devicePixelRatio || 1;
        svg = paper.getElementsByTagName('svg')[0];
        var w = svg.clientWidth || parseInt(getComputedStyle(svg).width);
        var h = svg.clientHeight || parseInt(getComputedStyle(svg).height);
        var img = new Image;
        img.width = w;
        img.height = h;
        img.setAttribute('src', svgDataURL(svg));

        var canvas = document.createElement("canvas");

        canvas.width = w * ratio;
        canvas.height = h * ratio;
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        canvas.className = "exportCanvas";
        var ctx = canvas.getContext("2d");
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
            paper.style.display = 'none';
            document.body.appendChild(canvas);
        }
            ;
    }
    var svgDataURL = function (svg) {
        var svgAsXML = (new XMLSerializer).serializeToString(svg);
        return "data:image/svg+xml," + encodeURIComponent(svgAsXML);
    }
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
    var getInnerText = function (ele) {
        if (!ele)
            return '';
        var node = ele.firstChild
            , results = [];
        if (!node)
            return '';
        do {
            if (node.nodeType === document.TEXT_NODE)
                results.push(node.nodeValue);
            else
                results.push(getInnerText(node));
        } while (node = node.nextSibling); return results.join('');
    }
    var setInnerText = function (ele, s) {
        ele.innerHTML = '';
        var t = document.createTextNode('');
        t.nodeValue = s;
        ele.appendChild(t);
        return s;
    }
    // var clearSelect = function () {
    //     if (window.getSelection) {
    //         if (window.getSelection().empty) {
    //             // Chrome
    //             window.getSelection().empty();
    //         } else if (window.getSelection().removeAllRanges) {
    //             // Firefox
    //             window.getSelection().removeAllRanges();
    //         }
    //     } else if (document.selection) {
    //         // IE
    //         document.selection.empty();
    //     }
    // }
    var hideError = function () {
        errorBox.style.display = 'none';
    }
    var showError = function (re, err) {
        errorBox.style.display = 'block';
        var msg = ["Error:" + err.message, ""];
        if (typeof err.lastIndex === 'number') {
            msg.push(re);
            msg.push(Kit().repeats('-', err.lastIndex) + "^");
        }
        setInnerText(errorBox, msg.join("\n"));
    }
    var serializeHash = function (params) {
        var re = getInputValue();
        var flags = getFlags();
        return "#!" + (params.debug ? "debug=true&" : "") + (params.cmd ? "cmd=" + params.cmd + "&" : "") + (params.embed ? "embed=true&" : "") + "flags=" + flags + "&re=" + encodeURIComponent(params.re = re);

    }
    var changeHash = function () {
        location.hash = serializeHash(params);
    }


    var getFlags = function () {
        var fg = '';
        for (var i = 0, l = flags.length; i < l; i++) {
            if (flags[i].checked)
                fg += flags[i].value;
        }
        return fg;
    }
    var setFlags = function (fg) {
        for (var i = 0, l = fg.length; i < l; i++) {
            if (~fg.indexOf(flags[i].value))
                flags[i].checked = true;
            else
                flags[i].checked = false;
        }
        setInnerText(flagBox, fg);
    }
    // flags.forEach(flag => flag.addEventListener('change', (event) => {
    //     setInnerText(flagBox, getFlags());
    // }));

    var _updateJSONViewer = function($elem, jsonData) {
        if(options.debug) {
            $elem.innerHTML = "";
            window.setTimeout(() => JsonView.renderJSON(jsonData, $elem), 50);
        }
    }
    var _updateRaphaelItemsJSON = function(_raphaelItems) {
        const $elemRaphael = document.querySelector(`#${options.raphaelJSONId}`);
        _updateJSONViewer($elemRaphael, _raphaelItems)
    }

    var _updateREGEXSON = function (_regexTree) {
        function escapteHTML(inHTMLtext) {
            return inHTMLtext.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
        // Se obtiene sin una funcion traverse
        _regexTree = {
            raw: escapteHTML(_regexTree.raw),
            groupCount: _regexTree.groupCount,
            tree: _regexTree.tree
        }
        const $regexSON = document.querySelector(`#${options.regexSONId}`);
        _updateJSONViewer($regexSON, _regexTree);
    };

    var _parseRegex = function (regExpresion) {
        // Aqui se realiza el parseo
        var skipError = false;

        // changeHash();
        hideError();
        var regEXSON = null;
        try {
            var init_parse = parse();
            var language_selected = document.querySelector("[name='languageRegex']:checked").value
            regEXSON = init_parse(regExpresion, null, language_selected);
        } catch (e) {
            if (e instanceof init_parse.RegexSyntaxError) {
                if (!skipError) {
                    showError(regExpresion, e);
                }
            } else {
                throw e;
            }
            // return false;
        }
        if (regEXSON) {
            _updateREGEXSON(regEXSON);
        }

        return regEXSON
    };

    var parseEvent = function (event) {
        var regExpresion = inputRegex.value;
        _parseRegex(regExpresion);
    };

    // FUNCIONES DE VISUALIZACION
    var _parseVisualizeRegex = function () {
        var regExpresion = inputRegex.value;
        var regEXSON = _parseRegex(regExpresion);
        if (regEXSON) {
            // Antes hay que disponer un loader con una pequeña barra de carga
            // Esta se obtiene el objeto barra que se vaya cargando
            $loader_view.classList.add("loading");
            // console.log("Agregar clase loading");
            let updateProgressBar =function(newValue) {
                // console.log(`Actualizando valor de progreso: ${newValue}`);
                this.attributes.getNamedItem("data-value").value = `${newValue}`;
                this.style.transform = `scaleX(${newValue/100})`;
            }
            $progress_bar.updateProgressBar = updateProgressBar;
            
            // Se destruye el controlador svg
            // if (svg_graph_controller && svg_thumb_controller && destroyAllHandler_ThumbnailSVGControl) {
            //     destroyAllHandler_ThumbnailSVGControl();
            //     destroyAllHandler_ThumbnailSVGControl = undefined;
            // }
            
            // Se le pasa como argumento el loader
            var raphael_items = {};
            let paintRegex = function() {
                raphael_items = visualize(regEXSON, getFlags(), paper, $progress_bar);
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
                if ( destroyAllHandler_ThumbnailSVGControl ) {
                    destroyAllHandler_ThumbnailSVGControl();
                }
                [svg_graph_controller, svg_thumb_controller, destroyAllHandler_ThumbnailSVGControl] = CustomThumbnailSVGControl({
                    mainViewId: 'graphCtView',
                    mainSVGId: 'graphCtSVG',
                    // Dejamos que lo autogenere con el id
                    thumbContainerId: 'thumbViewContainer',
                });
                
            }
            window.setTimeout(paintRegex, 100);
            
            // Se vuelve a ocultar el loader
            let hideLoader = function() {
                // console.log("Ocultar loader");
                $loader_view.classList.remove("loading");
                $progress_bar.attributes.getNamedItem("data-value").value = "0";
                $progress_bar.style.transform = "";
            }
            window.setTimeout(hideLoader, 200);

            return true;
        }
        else {
            return false;
        }
    };


    function initMainEventsListener() {
        inputRegex.addEventListener('change', function(event){
            // parseEvent();
            window.hasChanges = true;
        });
        
        var parseVisualizeEvent = function (event) {
            if (!event.detail || event.detail == 1) {
                this.disabled = true;

                _parseVisualizeRegex();
                // groupRaphItems();

                this.disabled = false;
            }
        };
        // parseBtn.addEventListener("click", parseEvent);
        visualBtn.addEventListener("click", parseVisualizeEvent);

        // dragGraphListeners(document.getElementById('graphCt'));

    }

    initMainEventsListener();


    // PARAMETROS GLOBALES DE JEX
    var params = getParams();
    if (params.embed || params.cmd == "export") {
        document.body.className += " embed";
    }

    function trim(s) {
        return s.replace(/^\s+/, '').replace(/\s+$/, '');
    }

    var getInputValue = function () {
        return trim(inputRegex.value);
    };
    var setInputValue = function (v) {
        return inputRegex.value = trim(v);
    };

    function getParams() {
        var params = location.hash;
        if (!params || params.length < 2) {
            params = {
                embed: false,
                re: "",
                highlight: true,
                flags: ''
            };
        } else {
            params = params.slice(2);
            params = params.split("&").reduce(function (p, a) {
                a = a.split("=");
                p[a[0]] = a[1];
                return p;
            }, {});
            params.embed = params.embed === 'true';
            params.flags = params.flags || '';
            params.re = params.re ? trim(decodeURIComponent(params.re)) : '';
        }
        return params;
    }
    if (params.embed || params.cmd === "export") {
        var embedFooterLink = document.getElementById("embedFooterLink");
        embedFooterLink.href = `${document.location.origin}${document.location.pathname}` + location.hash.replace(/\bembed=true\b/ig, "").replace(/\bcmd=export\b/ig, '');
    }
    function initEventsListener() {
        embedBtn.addEventListener('click', function () {
            if (!_parseRegex(inputRegex.value))
                return false;
            var src = location.href;
            var i = src.indexOf('#');
            src = i > 0 ? src.slice(0, i) : src;
            changeHash();
            var re = getInputValue();
            var html = '<iframe frameborder="0" width="' + Math.ceil(paper.width) + '" height="' + Math.ceil(paper.height) + '" src="' + src + '#!embed=true&flags=' + getFlags() + '&re=' + encodeURIComponent(re) + '"></iframe>'
            window.prompt("Copy the html code:", html);
        });

        // exportBtn.addEventListener('click', function () {
        //     var newParams = Object.assign({}, params);
        //     newParams.cmd = 'export';
        //     var hash = serializeHash(newParams);
        //     window.open(location.href.split('#!')[0] + hash, "_blank");
        // });
    }

    if (params.flags) {
        setFlags(params.flags);
    }
    if (params.re) {
        setInputValue(params.re);
    }
    if (params.cmd == 'export') {
        showExportImage();
        return;
    } else {
        initEventsListener();
    }


    // Una vez todo cargado y configurado, parseamos la de ejemplo
    _parseVisualizeRegex();
};