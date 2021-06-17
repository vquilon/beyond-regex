var ThumbnailSVGControl = function (options) {
    var flagFirstReset = true;
    var $mainView = document.getElementById(options.mainViewId);
    var $mainSVG = document.getElementById(options.mainSVGId);
    var $thumbSVG = document.getElementById(options.thumbSVGId);
    const scopeContainerId = "scopeContainer";
    const controlPanelClass = "control-panel";
    var $scopeContainer;

    var scope_mouseDown = false;

    const thumbContainerId = options.thumbContainerId || "thumbViewContainer";
    var $thumbContainer;

    let scaleZoomSen = 0.2;
    let initialState = {
        pan: { x: 0, y: 0 },
        zoom: 0
    };
    var resetTumbPanOffsetX, resetTumbPanOffsetY;
    var main_svg, thumb_svg;


    // VARIABLES DE FUNCIONES LISTENERS
    var elements_with_listeners = [];
    // EventTarget.prototype._addEventListener = EventTarget.prototype.addEventListener;
    var _addEventListener_original = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (a, b, c) {
        if (c == undefined) c = false;
        this._addEventListener_original = _addEventListener_original;
        this._addEventListener_original(a, b, c);
        if (!this.eventListenerList) this.eventListenerList = {}, elements_with_listeners.push(this);
        if (!this.eventListenerList[a]) this.eventListenerList[a] = [];
        this.eventListenerList[a].push({ listener: b, options: c });
    };

    var _removeEventListener_original = EventTarget.prototype.removeEventListener;
    // EventTarget.prototype._removeEventListener = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.removeEventListener = function (a, b, c) {
        if (c == undefined) c = false;
        this._removeEventListener_original = _removeEventListener_original;
        this._removeEventListener_original(a, b, c);
        if (!this.eventListenerList) this.eventListenerList = {};
        if (!this.eventListenerList[a]) this.eventListenerList[a] = [];

        for (let i = 0; i < this.eventListenerList[a].length; i++) {
            if (this.eventListenerList[a][i].listener == b, this.eventListenerList[a][i].options == c) {
                this.eventListenerList[a].splice(i, 1);
                break;
            }
        }
        if (this.eventListenerList[a].length == 0) {
            delete this.eventListenerList[a];
            elements_with_listeners.splice(elements_with_listeners.indexOf(this), 1);
        }
    };

    EventTarget.prototype.removeAllEventListener = function () {
        Object.keys(this.eventListenerList).forEach(event_type => {
            while (this.eventListenerList[event_type].length > 0) {
                let listener = this.eventListenerList[event_type][0].listener;
                let options = this.eventListenerList[event_type][0].options;
                this.removeEventListener(event_type, listener, options);
                if (!(event_type in this.eventListenerList)) break;
            }
        });
    }

    var _zoom_reset_Listener,
        _zoom_out_Listener,
        _zoom_in_Listener,
        resizeThumbViewListener,
        scope_mousemoveListener,
        scope_mousedownListener,
        scope_mouseupListener,
        loadThumbSVGListener,
        loadMainSVGListener,
        wheelHandlerListener;

    // FUNCIONES AUXILIARES
    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    function wrapElementWith($element, newWrapType, newWrapId) {
        let newWrap = document.createElement(newWrapType);
        newWrap.id = newWrapId;
        var resWrap = $element.parentElement.insertBefore(newWrap, null);
        resWrap.appendChild($element);
        return resWrap;
    }
    function wrapElementWithNoDOM($element, newWrapType, newWrapId) {
        let $newWrap = document.createElement(newWrapType);
        $newWrap.id = newWrapId;
        $newWrap.appendChild($element);
        return $newWrap;
    }

    // FUNCIONES DE COMPORTAMIENTO DE LAS ANIMACIONES EN PAN O ZOOM
    function linear(time, begin, change, duration) {
        return change * (time / duration) + begin;
    }
    function easeInOutQuad(time, startPosition, distance, duration) {
        if ((time /= duration / 2) < 1) {
            return distance / 2 * time * time + startPosition;
        } else {
            return -distance / 2 * ((--time) * (time - 2) - 1) + startPosition;
        }
    }
    function easeInQuad(time, startPosition, change, duration) {
        return change * (time /= duration) * time + startPosition;
    }
    function easeOutQuad(time, startPosition, change, duration) {
        return -change * (time /= duration) * (time - 2) + startPosition;
    }
    function easeInElastic(time, startPosition, change, duration) {
        var s = 1.70158, p = 0, a = change;
        if (time == 0) return startPosition;
        if ((time /= duration) == 1) return startPosition + change;
        if (!p) p = duration * .3;
        if (a < Math.abs(change)) {
            a = change; var s = p / 4;
        }
        else {
            var s = p / (2 * Math.PI) * Math.asin(change / a);
        }
        return -(a * Math.pow(2, 10 * (time -= 1)) * Math.sin((time * duration - s) * (2 * Math.PI) / p)) + startPosition;
    }

    // FUNCIONES ANIMACION DE PAN
    function animatePan($svg_inst, _newPan, animationTime, fps, callback = undefined) { // {x: 1, y: 2}
        if (animationTime === 0) {
            if ($svg_inst.intervalPanID) {
                clearInterval($svg_inst.intervalPanID)
                $svg_inst.intervalPanID = null;
            }
            $svg_inst.pan(_newPan);
            return;
        }

        if ($svg_inst.intervalPanID) {
            clearInterval($svg_inst.intervalPanID)
            $svg_inst.intervalPanID = null;
        }

        animationTime = animationTime || 0.5;
        fps = fps || 60;
        var iterations = fps * animationTime, // ms duration
            // animationStepTime = 15,  // one per 30 frames
            animationStepTime = animationTime / iterations,
            animationStep = 0,
            time = 0,
            _oldPan = $svg_inst.getPan(),
            actualPan = $svg_inst.getPan(),
            stepX = (_newPan.x - _oldPan.x) / iterations,
            stepy = (_newPan.y - _oldPan.y) / iterations

        $svg_inst.intervalPanID = setInterval(function () {
            time += animationStepTime;
            actualPan.x = linear(time, _oldPan.x, _newPan.x - _oldPan.x, animationTime);
            actualPan.y = linear(time, _oldPan.y, _newPan.y - _oldPan.y, animationTime);
            // actualZoom += step;
            // let dirPan = {
            // 	x: ((_newPan.x - _oldPan.x) / Math.abs(_newPan.x - _oldPan.x)),
            // 	y: ((_newPan.y - _oldPan.y) / Math.abs(_newPan.y - _oldPan.y)),
            // };
            // if (dirPan.x * (actualPan.x - _newPan.x) < 0 && dirPan.y * (actualPan.y - _newPan.y) < 0) {
            if (time < animationTime) {
                $svg_inst.pan(actualPan);
            } else {
                // Cancel interval
                clearInterval($svg_inst.intervalPanID)
                $svg_inst.intervalPanID = null;
            }
        }, animationStepTime)
    }
    function animatePanBy($svg_inst, amount, animationTime, fps, callback = undefined) { // {x: 1, y: 2}
        if (animationTime === 0) {
            if ($svg_inst.intervalPanID) {
                clearInterval($svg_inst.intervalPanID)
                $svg_inst.intervalPanID = null;
            }
            let actualPan = svg_inst.getPan();
            $svg_inst.pan({ x: actualPan.x + amount.x, y: actualPan.y + amount.y });
            return;
        }

        if ($svg_inst.intervalPanID) {
            clearInterval($svg_inst.intervalPanID)
            $svg_inst.intervalPanID = null;
        }

        animationTime = animationTime || 0.5;
        fps = fps || 60;
        var iterations = fps * animationTime, // ms duration
            // animationStepTime = 15,  // one per 30 frames
            animationStepTime = animationTime / iterations,
            animationStep = 0,
            time = 0,
            _oldPan = $svg_inst.getPan(),
            actualPan = _oldPan,
            _newPan = { x: _oldPan.x + amount.x, y: _oldPan.y + amount.y },
            stepX = (_newPan.x - _oldPan.x) / iterations,
            stepy = (_newPan.y - _oldPan.y) / iterations

        $svg_inst.intervalPanID = setInterval(function () {
            time += animationStepTime;
            actualPan.x = linear(time, _oldPan.x, _newPan.x - _oldPan.x, animationTime);
            actualPan.y = linear(time, _oldPan.y, _newPan.y - _oldPan.y, animationTime);
            // actualZoom += step;
            // let dirPan = {
            // 	x: ((_newPan.x - _oldPan.x) / Math.abs(_newPan.x - _oldPan.x)),
            // 	y: ((_newPan.y - _oldPan.y) / Math.abs(_newPan.y - _oldPan.y)),
            // };
            // if (dirPan.x * (actualPan.x - _newPan.x) < 0 && dirPan.y * (actualPan.y - _newPan.y) < 0) {
            if (time < animationTime) {
                $svg_inst.pan(actualPan);
            } else {
                // Cancel interval
                clearInterval(intervalID)
                $svg_inst.intervalPanID = null;
            }
        }, animationStepTime)
    }
    // FUNCIONES ANIMACION DE ZOOM
    function animateZoom($svg_inst, _newZoom, animationTime, fps, callback = undefined) { // {x: 1, y: 2}
        if (animationTime === 0) {
            if ($svg_inst.intervalZoomID) {
                clearInterval($svg_inst.intervalZoomID)
                $svg_inst.intervalZoomID = null;
            }
            $svg_inst.zoom(_newZoom);
            return;
        }

        if ($svg_inst.intervalZoomID) {
            clearInterval($svg_inst.intervalZoomID)
            $svg_inst.intervalZoomID = null;
        }

        animationTime = animationTime || 0.5;
        fps = fps || 60;
        var // animationStepTime = 15,  // one per 30 frames
            iterations = fps * animationTime,
            animationStepTime = animationTime / iterations,
            animationStep = 0,
            time = 0,
            _oldZoom = $svg_inst.getZoom(),
            actualZoom = _oldZoom,
            step = (_newZoom - _oldZoom) / iterations;

        $svg_inst.intervalZoomID = setInterval(function () {
            time += animationStepTime;
            actualZoom = linear(time, _oldZoom, _newZoom - _oldZoom, animationTime);
            let change = _newZoom - _oldZoom;
            if (Math.abs(change) < 0.001) {
                actualZoom = _newZoom;
                $svg_inst.zoom(actualZoom);
                clearInterval($svg_inst.intervalZoomID);
                $svg_inst.intervalZoomID = null;
                if (callback) callback();
            }
            // actualZoom += step;
            // let dirZoom = ((_newZoom - _oldZoom) / Math.abs(_newZoom - _oldZoom));
            // if (dirZoom * (actualZoom - _newZoom) < 0) {
            if (time < animationTime) {
                // TODO: UTILIZAR SIEMPRE EL zoomBy
                $svg_inst.zoom(actualZoom);
            } else {
                // Cancel interval
                clearInterval($svg_inst.intervalZoomID);
                $svg_inst.intervalZoomID = null;
                if (callback) callback();
            }
        }, animationStepTime)
    }
    function animateZoomAtPointBy($svg_inst, _newZoomPercent, atPoint, animationTime, fps, callback = undefined) { // {x: 1, y: 2}
        if (animationTime === 0) {
            if ($svg_inst.intervalZoomID) {
                clearInterval($svg_inst.intervalZoomID)
                $svg_inst.intervalZoomID = null;
            }
            $svg_inst.zoomAtPoint($svg_inst.getZoom() * _newZoomPercent, atPoint);
            return;
        }

        if ($svg_inst.intervalZoomID) {
            clearInterval($svg_inst.intervalZoomID)
            $svg_inst.intervalZoomID = null;
        }

        animationTime = animationTime || 0.5;
        fps = fps || 60;
        var // animationStepTime = 15,  // one per 30 frames
            iterations = fps * animationTime,
            animationStepTime = animationTime / iterations,
            animationStep = 0,
            time = 0,
            _oldZoom = $svg_inst.getZoom(),
            _newZoom = _oldZoom * _newZoomPercent,
            actualZoom = _oldZoom,
            step = (_newZoom - _oldZoom) / iterations;

        $svg_inst.intervalZoomID = setInterval(function () {
            time += animationStepTime;
            actualZoom = linear(time, _oldZoom, _newZoom - _oldZoom, animationTime);
            // actualZoom += step;
            // let dirZoom = ((_newZoom - _oldZoom) / Math.abs(_newZoom - _oldZoom));
            // if (dirZoom * (actualZoom - _newZoom) < 0) {
            if (time < animationTime) {
                $svg_inst.zoomAtPoint(actualZoom, atPoint);
            } else {
                // Cancel interval
                clearInterval($svg_inst.intervalZoomID);
                $svg_inst.intervalZoomID = null;
            }
        }, animationStepTime)
    }

    var getSVGDocument = function (objectElem) {
        var svgDoc = objectElem.contentDocument;
        if (!svgDoc) {
            if (typeof objectElem.getSVGDocument === "function") {
                svgDoc = objectElem.getSVGDocument();
            }
        }
        return svgDoc;
    }
    var bindThumbnailSVGControlListeners = function (_main_svg, _thumb_svg) {
        if (!main_svg && _main_svg) {
            main_svg = _main_svg;
        }
        if (!thumb_svg && _thumb_svg) {
            thumb_svg = _thumb_svg;
        }
        if (!main_svg || !thumb_svg) {
            return;
        }

        // Se crean los atributos de intervalos para las animaciones de pan y zoom
        // main_svg.intervalPanID = null;
        // main_svg.intervalZoomID = null;

        // thumb_svg.intervalPanID = null;
        // thumb_svg.intervalZoomID = null;

        // 		var resizeTimer;
        // 		var interval = 0; //msec
        // 		window.addEventListener('resize', function(event){
        // 			if (resizeTimer !== false) {
        // 				clearTimeout(resizeTimer);
        // 			}
        // 			resizeTimer = setTimeout(function () {
        // 				// Variables globales

        // 				flagFirstReset = true;
        // 				// Ajustar tamaño del SVG
        // 				main_svg.resize();
        // 				thumb_svg.resize();
        // 				// Centrar pan y zoom del thumbnail
        // 				thumb_svg.resetZoom();
        // 				thumb_svg.zoomOut();
        // 				thumb_svg.zoomOut();
        // 				thumb_svg.center(true);
        // 				// Actualizar el recuardo del viewbox del thumbnail
        // 				thumb_svg.updateThumbScope();
        // 			}, interval);
        // 		});

        main_svg.setOnZoom(function (level) {
            thumb_svg.updateThumbScope();
            // if(options.onZoom){
            // 	options.onZoom(main_svg, thumb_svg, level);
            // }
        });

        main_svg.setOnPan(function (point) {
            thumb_svg.updateThumbScope();
            // if(options.onPan){
            // 	options.onPan(main_svg, thumb_svg, point);
            // }
        });

        // Override del setZoom
        main_svg.setZoomScaleSensitivityAux = function (scale) {
            main_svg.zoomScaleSensitivity = scale;
            main_svg.setZoomScaleSensitivity(scale);
        }

        var _updateThumbScope = function (_main_svg, _thumb_svg, _$scope, _$line1, _$line2) {
            let mainPanX = _main_svg.getPan().x,
                mainPanY = _main_svg.getPan().y,
                mainWidth = _main_svg.getSizes().width,
                mainHeight = _main_svg.getSizes().height,
                mainZoom = _main_svg.getSizes().realZoom,
                thumbPanX = _thumb_svg.getPan().x,
                thumbPanY = _thumb_svg.getPan().y,
                thumbZoom = _thumb_svg.getSizes().realZoom;

            let thumByMainZoomRatio = thumbZoom / mainZoom;
            let scopeX = thumbPanX - mainPanX * thumByMainZoomRatio;
            let scopeY = thumbPanY - mainPanY * thumByMainZoomRatio;
            let scopeWidth = mainWidth * thumByMainZoomRatio;
            let scopeHeight = mainHeight * thumByMainZoomRatio;

            _$scope.setAttribute("x", scopeX);
            _$scope.setAttribute("y", scopeY);
            _$scope.setAttribute("width", scopeWidth);
            _$scope.setAttribute("height", scopeHeight);
            _$line1.setAttribute("x1", scopeX + 1);
            _$line1.setAttribute("y1", scopeY + 1);
            _$line1.setAttribute("x2", scopeX + 1 + scopeWidth - 2);
            _$line1.setAttribute("y2", scopeY + 1 + scopeHeight - 2);
            _$line2.setAttribute("x1", scopeX + 1);
            _$line2.setAttribute("y1", scopeY + 1 + scopeHeight - 2);
            _$line2.setAttribute("x2", scopeX + 1 + scopeWidth - 2);
            _$line2.setAttribute("y2", scopeY + 1);

            if (flagFirstReset) {
                let scopeBounds = document.querySelector("#scope").getBoundingClientRect();
                let clientVirtX = scopeBounds.x + scopeBounds.width / 2;
                let clientVirtY = scopeBounds.y + scopeBounds.height / 2;
                let scopeContainerBounds = $scopeContainer.getBoundingClientRect();
                let thumbWidth = _thumb_svg.getSizes().width;
                let thumbHeight = _thumb_svg.getSizes().height;
                resetTumbPanOffsetX = scopeX - (thumbPanX + (clientVirtX - scopeContainerBounds.left - thumbWidth / 2));
                resetTumbPanOffsetY = scopeY - (thumbPanY + (clientVirtY - scopeContainerBounds.top - thumbHeight / 2));
                flagFirstReset = false;

                // Just for tests
                // resetMainPanOffsetX = scopeX - (thumbPanX + (clientVirtX - scopeContainerBounds.left - thumbWidth / 2));
                // resetMainPanOffsetY = scopeY - (thumbPanY + (clientVirtY - scopeContainerBounds.top - thumbHeight / 2));
            }

        };

        thumb_svg.updateThumbScope = function () {
            // TODO: Parametrizar estas varibales id del html
            let $scope = document.getElementById('scope');
            let $line1 = document.getElementById('line1');
            let $line2 = document.getElementById('line2');
            _updateThumbScope(main_svg, thumb_svg, $scope, $line1, $line2);

            // -webkit-mask: linear-gradient(to top, transparent calc(100% - 41px), #fff calc(100% - 41px)),linear-gradient(to bottom, transparent calc(41px + 57px), #fff calc(41px + 57px)),linear-gradient(to left, transparent calc(100% - 25px), #fff calc(100% - 25px)),linear-gradient(to right, transparent calc(25px + 71px), #fff calc(25px + 71px));
            let bound_scope_box = document.querySelector('#scope').getBBox();
            let $mask_thumb_scope = document.querySelector("#masked");
            let signs_sub = {
                bb_x: bound_scope_box.x > 0 ? '- ' : '',
                bb_y: bound_scope_box.y > 0 ? '- ' : '',
                bb_w: bound_scope_box.width > 0 ? '- ' : '',
                bb_h: bound_scope_box.height > 0 ? '- ' : ''
            }
            let signs_plus = {
                bb_x: bound_scope_box.x > 0 ? '+ ' : '',
                bb_y: bound_scope_box.y > 0 ? '+ ' : '',
                bb_w: bound_scope_box.width > 0 ? '+ ' : '',
                bb_h: bound_scope_box.height > 0 ? '+ ' : ''
            }

            let mask_gradient = `` +
                `linear-gradient(to top,` +
                ` transparent calc(100% - ${bound_scope_box.y}px),` +
                ` white calc(100% - ${bound_scope_box.y}px)` +
                `),` +
                `linear-gradient(to bottom,` +
                ` transparent calc(${bound_scope_box.y}px + ${bound_scope_box.height}px),` +
                ` white calc(${bound_scope_box.y}px + ${bound_scope_box.height}px)` +
                `),` +
                `linear-gradient(to left,` +
                ` transparent calc(100% - ${bound_scope_box.x}px),` +
                ` white calc(100% - ${bound_scope_box.x}px)` +
                `),` +
                `linear-gradient(to right,` +
                ` transparent calc(${bound_scope_box.x}px + ${bound_scope_box.width}px),` +
                ` white calc(${bound_scope_box.x}px + ${bound_scope_box.width}px)` +
                `)`;
            
            let clip_path = `polygon(` +
            `0% 0%, 0% 100%, ` +
            `${bound_scope_box.x}px 100%, ` +
            `${bound_scope_box.x}px ${bound_scope_box.y}px, ` +
            `calc(${bound_scope_box.x}px + ${bound_scope_box.width}px) ${bound_scope_box.y}px, ` +
            `calc(${bound_scope_box.x}px + ${bound_scope_box.width}px) calc(${bound_scope_box.y}px + ${bound_scope_box.height}px), ` +
            `${bound_scope_box.x}px calc(${bound_scope_box.y}px + ${bound_scope_box.height}px), ` +
            `${bound_scope_box.x}px 100%, ` +
            `${bound_scope_box.x}px 100%, ` +
            `100% 100%, 100% 0%)`;
            
            $mask_thumb_scope.style.clipPath = clip_path;
            $mask_thumb_scope.style.webkitMask = mask_gradient;
            $mask_thumb_scope.style.mask = mask_gradient;
        }
        thumb_svg.updateThumbScope();

        var _updateMainViewPan = function (clientX, clientY, _main_svg, _thumb_svg, move = false) {
            var dimThumb = $scopeContainer.getBoundingClientRect(),
                dimMain = $mainView.getBoundingClientRect(),
                mainWidth = _main_svg.getSizes().width,
                mainHeight = _main_svg.getSizes().height,
                mainZoom = _main_svg.getSizes().realZoom,
                thumbWidth = _thumb_svg.getSizes().width,
                thumbHeight = _thumb_svg.getSizes().height,
                thumbZoom = _thumb_svg.getSizes().realZoom;

            let scopeBounds = document.querySelector("#scope").getBoundingClientRect();
            let scopePosX = scopeBounds.x + scopeBounds.width / 2;
            let scopePosY = scopeBounds.y + scopeBounds.height / 2;
            clientX = clientX || scopePosX;
            clientY = clientY || scopePosY;

            let thumbPanX = clientX - (dimThumb.left + thumbWidth / 2 - resetTumbPanOffsetX);
            let thumbPanY = clientY - (dimThumb.top + thumbHeight / 2 - resetTumbPanOffsetY);
            let mainPanX = - thumbPanX * mainZoom / thumbZoom;
            let mainPanY = - thumbPanY * mainZoom / thumbZoom;

            let actualMainPan = main_svg.getPan();
            if (!move) {
                animatePan(_main_svg, { x: mainPanX, y: mainPanY }, animateTime = 0.5);
            }
            else {
                if (!_main_svg.intervalPanID) {
                    _main_svg.pan({ x: mainPanX, y: mainPanY });
                }
            }
        };

        var updateMainViewPan = function (event, move = false) {
            // event.which == 0 En firefox es siempre 1....
            // buttons 1: el click izquierdo
            if (event.buttons == 0 && event.button == 0 || event.buttons != 1) {
                return false;
            }
            _updateMainViewPan(event.clientX, event.clientY, main_svg, thumb_svg, move = move);
        }

        scope_mousedownListener = function (event) {
            event.preventDefault();
            scope_mouseDown = true;
            updateMainViewPan(event, move = false);
        };
        scope_mouseupListener = function (event) {
            event.preventDefault();
            scope_mouseDown = false;
        };
        scope_mousemoveListener = function (event) {
            event.preventDefault();
            if (scope_mouseDown) {
                updateMainViewPan(event, move = true);
            }
        };
        $scopeContainer.addEventListener('mouseup', scope_mouseupListener);
        $scopeContainer.addEventListener('mousedown', scope_mousedownListener);
        $scopeContainer.addEventListener('mousemove', scope_mousemoveListener);

        resizeThumbViewListener = function (event) {
            // Para saber cuando se hizo click
            scope_mouseDown = false;

            event.preventDefault();
            let _transition_duration = getComputedStyle(document.querySelector(`#${thumbContainerId}`)).transitionDuration;
            let _transition_match = _transition_duration.match(/(\d*(?:\.\d+)?)(.+)/);
            let _all_transition, _trasnsition_number = 0, _trasnsition_unit;
            if (_transition_duration && _transition_match) {
                [_all_transition, _trasnsition_number, _trasnsition_unit] = _transition_match;
                _trasnsition_number = parseFloat(_trasnsition_number);
                if (_trasnsition_unit === "s") {
                    _trasnsition_number = _trasnsition_number * 1000;
                }
            }

            let thumbView_interval = setInterval(function () {
                thumb_svg.resize();
                thumb_svg.center();
                thumb_svg.updateThumbScope();
            }, 15);
            setTimeout(function () {
                clearInterval(thumbView_interval);
            }, _trasnsition_number);

        };
        $scopeContainer.addEventListener('mouseenter', resizeThumbViewListener);
        $scopeContainer.addEventListener('mouseleave', resizeThumbViewListener);
        $mainView.addEventListener('mouseleave', resizeThumbViewListener);


        let _$zoom_in = document.querySelector(`#zoom-in`);
        let _$zoom_out = document.querySelector(`#zoom-out`);
        let _$zoom_reset = document.querySelector(`#zoom-reset`);

        _zoom_in_Listener = function (event) {
            // main_svg.zoomIn();
            animateZoom(main_svg, main_svg.getZoom() + main_svg.zoomScaleSensitivity);
        };
        _zoom_out_Listener = function (event) {
            // main_svg.zoomOut();
            animateZoom(main_svg, main_svg.getZoom() - main_svg.zoomScaleSensitivity);
        };
        _zoom_reset_Listener = function (event) {
            // main_svg.resetZoom();
            animateZoom(main_svg, initialState.zoom);
            animatePan(main_svg, initialState.pan);
        }
        _$zoom_in.addEventListener('click', _zoom_in_Listener);
        _$zoom_out.addEventListener('click', _zoom_out_Listener);
        _$zoom_reset.addEventListener('click', _zoom_reset_Listener);
    };


    var prepareMainStructure = function () {
        var $mainView = document.getElementById(options.mainViewId);
        if (!$mainView) {
            $mainView = wrapElementWith($mainSVG, newWrapType = "div", newWrapId = options.mainViewId);
        }
        var $mainContainer = document.getElementById(options.mainContainerId);

        if (!$mainContainer) {
            $mainContainer = wrapElementWith($mainView, newWrapType = "div", newWrapId = options.mainContainerId);
        }
    }
    var initMainView = function () {
        var mainViewSVGDoc = getSVGDocument($mainSVG);
        if (options.onMainViewSVGLoaded) {
            options.onMainViewSVGLoaded(mainViewSVGDoc);
        }
        // var beforePan = function(oldPan, newPan){
        // 	var stopHorizontal = false
        // 	, stopVertical = false
        // 	, gutterWidth = 100
        // 	, gutterHeight = 100
        // 	// Computed variables
        // 	, sizes = this.getSizes()
        // 	, leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth
        // 	, rightLimit = sizes.width - gutterWidth - (sizes.viewBox.x * sizes.realZoom)
        // 	, topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight
        // 	, bottomLimit = sizes.height - gutterHeight - (sizes.viewBox.y * sizes.realZoom);
        // 	customPan = {};
        // 	customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x));
        // 	customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y));
        // 	return customPan;
        // };

        let _main_svg = svgPanZoom('#' + options.mainSVGId, {
            zoomEnabled: true,
            controlIconsEnabled: false,
            fit: true,
            center: true,
            beforeZoom: function (oldZoom, newZoom) {
                flagFirstReset = true;
                return true;
            },
            preventMouseEventsDefault: true,
            // beforePan: beforePan,
            // minZoom: 0.25,
            // onZoom: function() {
            // 		var zoomLevel = panZoomInstance.getZoom();
            // 		if ( zoomLevel <= 0.25 ) {
            // 		   panZoomInstance.disablePan();
            // 		}
            //    if (!panZoomInstance.isPanEnabled() && zoomLevel > 0.25 ) {
            //       panZoomInstance.enablePan();
            //    }
            // },
            mouseWheelZoomEnabled: false,
            zoomScaleSensitivity: scaleZoomSen,
            customEventsHandler: {
                // Halt all touch events
                // haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel'];
                haltEventListeners: ['wheel'],
                // Init custom events handler
                init: function (_options) {
                    // Init Hammer
                    // this.hammer = Hammer(options.svgElement)
                    // Handle double tap
                    // this.hammer.on('doubletap', function(ev){
                    // 	options.instance.zoomIn()
                    // })
                    let support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
                        document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
                            "DOMMouseScroll";

                    wheelHandlerListener = function (event) {
                        // let that = _options.instance;
                        let that = main_svg;
                        if (!that.isZoomEnabled()) {
                            return;
                        }

                        event.preventDefault();

                        // Default delta in case that deltaY is not available
                        var delta = event.deltaY || 1
                            , timeDelta = Date.now() - that.lastMouseWheelEventTime
                            , divider = 3 + Math.max(0, 30 - timeDelta)

                        // Update cache
                        that.lastMouseWheelEventTime = Date.now()

                        // Make empirical adjustments for browsers that give deltaY in pixels (deltaMode=0)
                        if ('deltaMode' in event && event.deltaMode === 0 && event.wheelDelta) {
                            delta = event.deltaY === 0 ? 0 : Math.abs(event.wheelDelta) / event.deltaY
                        }

                        delta = -0.3 < delta && delta < 0.3 ? delta : (delta > 0 ? 1 : -1) * Math.log(Math.abs(delta) + 10) / divider


                        var inversedScreenCTM = $mainSVG.getScreenCTM().inverse();
                        var point = $mainSVG.createSVGPoint();


                        // Se coge el zoom del centro
                        let dimThumb = $scopeContainer.getBoundingClientRect(),
                            mainZoom = main_svg.getSizes().realZoom,
                            thumbWidth = thumb_svg.getSizes().width,
                            thumbHeight = thumb_svg.getSizes().height,
                            thumbZoom = thumb_svg.getSizes().realZoom;

                        let mainSVGBounds = $mainSVG.getBoundingClientRect();
                        let mainZeroPosX = mainSVGBounds.x + mainSVGBounds.width / 2;
                        let mainZeroPosY = mainSVGBounds.y + mainSVGBounds.height / 2;

                        let relativeMousePoint = {
                            x: mainZeroPosX,
                            y: mainZeroPosY
                        };

                        if (this === $mainSVG) {
                            point.x = event.clientX
                            point.y = event.clientY
                            relativeMousePoint = point.matrixTransform(inversedScreenCTM);
                        }
                        else if (this === $thumbContainer) {
                            // Intento de calculo del punto en el main a partir del thumb
                            let thumbPanX = event.clientX - (dimThumb.left + thumbWidth / 2 - resetTumbPanOffsetX);
                            let thumbPanY = event.clientY - (dimThumb.top + thumbHeight / 2 - resetTumbPanOffsetY);
                            let mainPanX = thumbPanX * mainZoom / thumbZoom;
                            let mainPanY = thumbPanY * mainZoom / thumbZoom;

                            point.x = mainPanX;
                            point.y = mainPanY;

                            relativeMousePoint = {
                                x: mainPanX,
                                y: mainPanY
                            };
                        }


                        let zoom = Math.pow(1 + that.zoomScaleSensitivity, (-1) * delta); // multiplying by neg. 1 so as to make zoom in/out behavior match Google maps behavior

                        // that.zoomAtPointBy(zoom, relativeMousePoint);
                        animateZoomAtPointBy(that, zoom, relativeMousePoint, animationTime = 0.2);
                    }

                    _options.svgElement.addEventListener(support, wheelHandlerListener);
                },
                // Destroy custom events handler
                destroy: function (_options) {
                    if (main_svg.intervalZoomID) {
                        clearInterval(main_svg.intervalZoomID);
                        main_svg.intervalZoomID = null;
                    }
                    if (main_svg.intervalPanID) {
                        clearInterval(main_svg.intervalPanID);
                        main_svg.intervalPanID = null;
                    }


                    // Borrado de Event Listeners relacionados
                    // let support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
                    //     document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
                    //         "DOMMouseScroll";
                    // _options.svgElement.removeEventListener(support, wheelHandlerListener);

                    _options.svgElement.removeAllEventListener();

                    // #mainView, #mainSVG -> mouseleave (422), load (746)
                    // $mainView.removeEventListener('mouseleave', resizeThumbViewListener);
                    // $mainSVG.removeEventListener('load', loadMainSVGListener);
                    $mainView.removeAllEventListener();
                    ro.unobserve($mainView);

                    $mainSVG.removeAllEventListener();

                    // Control Panel Listeners
                    let _$zoom_in = document.querySelector(`#zoom-in`);
                    let _$zoom_out = document.querySelector(`#zoom-out`);
                    let _$zoom_reset = document.querySelector(`#zoom-reset`);

                    // #zoom-in -> click (454)
                    _$zoom_in.removeEventListener('click', _zoom_in_Listener)
                    // #zoom-out -> click (458)
                    _$zoom_out.removeEventListener('click', _zoom_out_Listener)
                    // #zoom-reset -> click (462)
                    _$zoom_reset.removeEventListener('click', _zoom_reset_Listener)
                }
            }
        });

        return _main_svg;
    };



    // Control del Thumbnail
    // Creacionn del thumbnail a partir del mismo SVG del main
    var createThumbnail = function () {
        // Crear el esqueleto de divs
        $thumbContainer = document.getElementById(options.thumbContainerId);

        // Crear el svg scope
        var svgns = "http://www.w3.org/2000/svg";
        var $rect = document.createElementNS(svgns, 'rect');
        $rect.id = 'scope';
        $rect.setAttributeNS(null, 'x', '0');
        $rect.setAttributeNS(null, 'y', '0');
        $rect.setAttributeNS(null, 'height', '0');
        $rect.setAttributeNS(null, 'width', '0');
        $rect.setAttributeNS(null, 'fill', '#ff00ff');
        $rect.setAttributeNS(null, 'fill-opacity', '0.4');
        $rect.setAttributeNS(null, 'stroke', 'none');
        // $rect.setAttributeNS(null, 'stroke-width', '2px');
        var $line1 = document.createElementNS(svgns, 'line');
        $line1.id = 'line1';
        $line1.setAttributeNS(null, 'stroke', 'none');
        // $line1.setAttributeNS(null, 'stroke-width', '2px');
        $line1.setAttributeNS(null, 'x1', '0');
        $line1.setAttributeNS(null, 'y1', '0');
        $line1.setAttributeNS(null, 'x2', '0');
        $line1.setAttributeNS(null, 'y2', '0');
        var $line2 = document.createElementNS(svgns, 'line');
        $line2.id = 'line2';
        $line2.setAttributeNS(null, 'stroke', 'none');
        // $line2.setAttributeNS(null, 'stroke-width', '2px');
        $line2.setAttributeNS(null, 'x1', '0');
        $line2.setAttributeNS(null, 'y1', '0');
        $line2.setAttributeNS(null, 'x2', '0');
        $line2.setAttributeNS(null, 'y2', '0');
        var $g = document.createElementNS(svgns, 'g');
        $g.appendChild($rect);
        $g.appendChild($line1);
        $g.appendChild($line2);
        var $svg = document.createElementNS(svgns, 'svg');
        $svg.id = 'scopeContainer';
        $svg.classList.add("thumbViewClass");
        $svg.appendChild($g);

        // Crear el thumbSVG
        $thumbSVG = $mainSVG.cloneNode(true);
        $thumbSVG.style = "";
        $thumbSVG.id = 'thumbSVG';
        var $thumbView = wrapElementWithNoDOM($thumbSVG, newWrapType = "div", newWrapId = 'thumbView');
        $thumbView.classList.add("thumbViewClass");

        // Agregar la mascara desenfocada
        let $mask_scope_thumb = document.createElement('div');
        $mask_scope_thumb.id = "masked";

        if (!$thumbContainer) {
            // Crear un container en el mismo parent que el svg
            $thumbContainer = wrapElementWithNoDOM($mask_scope_thumb, newWrapType = "div", newWrapId = 'thumbViewContainer');
            $thumbContainer.appendChild($svg);
            $thumbContainer.appendChild($thumbView);
        }
        else {
            $thumbContainer.appendChild($mask_scope_thumb);
            $thumbContainer.appendChild($svg);
            $thumbContainer.appendChild($thumbView);
        }

        // CREAR EL PANEL DE CONTROL
        let $control_zoom = document.createElement('div');
        $control_zoom.classList.add("control-zoom");

        let _createIconZoom = function (_path, icon_id) {
            let $svg_icon = document.createElementNS(svgns, 'svg');
            let $g_main = document.createElementNS(svgns, 'g');
            $svg_icon.classList.add("lens");
            // $svg_icon.setAttributeNS(null, 'viewBox', '0 0 550 550');
            $g_main.classList.add("main");

            let $g_circle = document.createElementNS(svgns, 'circle');
            let $g_clipPath = document.createElementNS(svgns, 'clipPath');
            // let $g_shineLight = document.createElementNS(svgns, 'g');
            // let $g_shineDark = document.createElementNS(svgns, 'g');
            let $g_gradient = document.createElementNS(svgns, 'g');

            $g_circle.setAttributeNS(null, 'r', '100%');
            $g_circle.setAttributeNS(null, 'cx', '50%');
            $g_circle.setAttributeNS(null, 'cy', '50%');
            $g_circle.setAttributeNS(null, 'style', `clip-path: url(#clip-${icon_id});opacity: 0.5;fill: rgb(255 255 255);`);
            $g_clipPath.id = `clip-${icon_id}`;
            // $g_shineLight.classList.add("shine-accent-light");
            // $g_shineDark.classList.add("shine-accent-dark");
            $g_gradient.classList.add("gradient");

            // Zoom Icon
            let $zoom_icon = document.createElement('div');
            $zoom_icon.id = icon_id;
            $zoom_icon.classList.add("icon");
            let $path_icon = document.createElementNS(svgns, 'path');
            $path_icon.setAttributeNS(null, 'd', _path);

            let $clipPath_icon = document.createElementNS(svgns, 'path');
            $clipPath_icon.setAttributeNS(null, 'd', _path);
            $clipPath_icon.style.transform = "translate(-35%, -35%) scale(0.06)";
            $clipPath_icon.style.transformOrigin = "center";
            
            // $g_shineLight.appendChild($path_icon);
            // $g_shineDark.appendChild($path_icon);
            $g_clipPath.appendChild($clipPath_icon);
            $g_gradient.appendChild($path_icon);
            // $g_main.appendChild($g_shineLight);
            // $g_main.appendChild($g_shineDark);
            $g_main.appendChild($g_gradient);
            $g_main.style.transform = "translate(-35%, -35%) scale(0.06)";
            $g_main.style.transformOrigin = "center";

            $svg_icon.appendChild($g_circle);
            $svg_icon.appendChild($g_clipPath);
            $svg_icon.appendChild($g_main);
            $zoom_icon.appendChild($svg_icon);

            return $zoom_icon;
        }

        // Zoom In
        let $zoom_in = _createIconZoom(
            'M 420.67 210.335 C 420.67 257.269 405.298 300.613 379.313 335.606 L 502.948 459.241 C 515.017 471.31 515.017 490.879 502.948 502.948 C 490.879 515.017 471.31 515.017 459.241 502.948 L 335.606 379.313 C 300.613 405.298 257.269 420.67 210.335 420.67 C 94.17 420.67 0 326.5 0 210.335 C 0 94.17 94.17 0 210.335 0 C 326.5 0 420.67 94.17 420.67 210.335 Z M 323.979 185.927 L 239.965 185.927 C 237.236 185.927 235.022 183.715 235.022 180.986 L 235.022 96.971 C 235.022 83.325 223.959 72.261 210.312 72.261 C 196.666 72.261 185.602 83.325 185.602 96.971 L 185.602 180.986 C 185.602 183.715 183.39 185.927 180.661 185.927 L 96.646 185.927 C 83 185.927 71.936 196.991 71.936 210.637 C 71.936 224.284 83 235.349 96.646 235.349 L 180.661 235.349 C 183.39 235.349 185.602 237.561 185.602 240.29 L 185.602 324.305 C 185.602 337.951 196.666 349.015 210.312 349.015 C 223.959 349.015 235.022 337.951 235.022 324.305 L 235.022 240.29 C 235.022 237.561 237.236 235.349 239.965 235.349 L 323.979 235.349 C 337.625 235.349 348.69 224.284 348.69 210.637 C 348.69 196.991 337.625 185.927 323.979 185.927 Z',
            "zoom-in"
        );

        // Zoom Out
        let $zoom_out = _createIconZoom('M 420.67 210.335 C 420.67 257.269 405.298 300.613 379.313 335.606 L 502.948 459.241 C 515.017 471.31 515.017 490.879 502.948 502.948 C 490.879 515.017 471.31 515.017 459.241 502.948 L 335.606 379.313 C 300.613 405.298 257.269 420.67 210.335 420.67 C 94.17 420.67 0 326.5 0 210.335 C 0 94.17 94.17 0 210.335 0 C 326.5 0 420.67 94.17 420.67 210.335 Z M 323.979 185.927 L 96.646 185.927 C 83 185.927 71.936 196.991 71.936 210.637 C 71.936 224.284 83 235.349 96.646 235.349 L 323.979 235.349 C 337.625 235.349 348.69 224.284 348.69 210.637 C 348.69 196.991 337.625 185.927 323.979 185.927 Z',
            "zoom-out"
        );

        // Zoom Reset
        let $zoom_reset = _createIconZoom('M 420.67 210.335 C 420.67 257.269 405.298 300.613 379.313 335.606 L 502.948 459.241 C 515.017 471.31 515.017 490.879 502.948 502.948 C 490.879 515.017 471.31 515.017 459.241 502.948 L 335.606 379.313 C 300.613 405.298 257.269 420.67 210.335 420.67 C 94.17 420.67 0 326.5 0 210.335 C 0 94.17 94.17 0 210.335 0 C 326.5 0 420.67 94.17 420.67 210.335 Z M 348.273 94.961 C 338.364 94.961 330.333 102.994 330.333 112.902 L 330.333 141.72 C 319.644 123.116 304.763 107.22 286.708 95.246 C 264.036 80.21 237.619 72.261 210.313 72.261 C 191.639 72.261 173.515 75.923 156.445 83.144 C 139.964 90.114 125.167 100.088 112.465 112.791 C 99.763 125.494 89.788 140.291 82.817 156.77 C 75.597 173.842 71.936 191.966 71.936 210.638 C 71.936 229.311 75.597 247.435 82.817 264.506 C 89.788 280.987 99.764 295.783 112.465 308.485 C 125.168 321.188 139.965 331.163 156.445 338.134 C 173.515 345.354 191.64 349.015 210.313 349.015 C 226.259 349.015 241.899 346.322 256.798 341.009 C 271.197 335.874 284.579 328.416 296.574 318.845 C 308.449 309.366 318.628 298.085 326.828 285.314 C 335.181 272.303 341.246 258.105 344.853 243.113 C 347.171 233.48 341.242 223.791 331.608 221.473 C 321.973 219.155 312.285 225.085 309.967 234.719 C 304.682 256.689 291.976 276.605 274.19 290.799 C 265.306 297.891 255.399 303.413 244.747 307.211 C 233.726 311.141 222.141 313.134 210.313 313.134 C 182.936 313.134 157.196 302.472 137.838 283.113 C 118.479 263.754 107.817 238.015 107.817 210.637 C 107.817 183.261 118.479 157.521 137.838 138.163 C 157.197 118.804 182.936 108.142 210.313 108.142 C 230.542 108.142 250.102 114.022 266.876 125.148 C 281.332 134.735 293.04 147.704 301.051 162.925 L 281.223 162.925 C 271.314 162.925 263.282 170.957 263.282 180.865 C 263.282 190.774 271.314 198.806 281.223 198.806 L 348.273 198.806 C 358.182 198.806 366.214 190.774 366.214 180.865 L 366.214 112.902 C 366.214 102.994 358.182 94.961 348.273 94.961 Z',
            "zoom-reset"
        );


        $control_zoom.appendChild($zoom_in);
        $control_zoom.appendChild($zoom_out);
        $control_zoom.appendChild($zoom_reset);

        let $control_panel = document.createElement('div');
        $control_panel.classList.add(controlPanelClass);
        $control_panel.appendChild($thumbContainer);
        $control_panel.appendChild($control_zoom);

        insertAfter($mainView, $control_panel);

    }
    var initThumbView = function () {
        var thumbViewSVGDoc = getSVGDocument($thumbSVG);
        if (options.onThumbnailSVGLoaded) {
            options.onThumbnailSVGLoaded(thumbViewSVGDoc);
        }

        let _thumb_svg = svgPanZoom(`#${$thumbSVG.id}`, {
            zoomEnabled: true,
            panEnabled: false,
            controlIconsEnabled: false,
            dblClickZoomEnabled: false,
            preventMouseEventsDefault: false,
            customEventsHandler: {
                init: function (_options) {
                    let support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
                        document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
                            "DOMMouseScroll";
                    $thumbContainer.addEventListener(support, wheelHandlerListener);
                },
                destroy: function (_options) {
                    if (thumb_svg.intervalZoomID) {
                        clearInterval(thumb_svg.intervalZoomID);
                        thumb_svg.intervalZoomID = null;
                    }
                    if (thumb_svg.intervalPanID) {
                        clearInterval(thumb_svg.intervalPanID);
                        thumb_svg.intervalPanID = null;
                    }
                    // $thumbSVG.removeEventListener('load', loadThumbSVGListener);
                    $thumbSVG.removeAllEventListener();

                    // let support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
                    //     document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
                    //         "DOMMouseScroll";
                    // $thumbContainer.removeEventListener(support, wheelHandlerListener);

                    $thumbContainer.removeAllEventListener();
                    // #scopeContainer -> mousedown (413), mouseleave (422), mouseenter (422), mousemove (417)
                    // $scopeContainer.removeEventListener('mouseleave', resizeThumbViewListener);
                    // $scopeContainer.removeEventListener('mouseenter', resizeThumbViewListener);
                    // $scopeContainer.removeEventListener('mousedown', scope_mousedownListener);
                    // $scopeContainer.removeEventListener('mouseup', scope_mouseupListener);
                    // $scopeContainer.removeEventListener('mousemove', scope_mousemoveListener);

                    $scopeContainer.removeAllEventListener();
                }
            }
        });

        $scopeContainer = document.getElementById(scopeContainerId);

        return _thumb_svg;

    };

    createThumbnail();
    // TODO: Agregar appendChild de un svg relativo al main

    loadMainSVGListener = function (event) {
        main_svg = initMainView();
    };
    loadThumbSVGListener = function (event) {
        thumb_svg = initThumbView();
    };
    $mainSVG.addEventListener("load", loadMainSVGListener, false);
    $thumbSVG.addEventListener("load", loadThumbSVGListener, false);

    // Se inicializan los controles
    // TODO: Condicion de solo se inician si son etiquetas SVG inline
    main_svg = initMainView();
    thumb_svg = initThumbView();


    bindThumbnailSVGControlListeners(main_svg, thumb_svg);

    // Inicializacion de parametros
    main_svg.setZoomScaleSensitivityAux(scaleZoomSen);
    if (options.onMainViewShown) {
        options.onMainViewShown(mainViewSVGDoc, _main_svg);
    }
    main_svg.lastMouseWheelEventTime = Date.now();


    if (options.onThumbnailShown) {
        options.onThumbnailShown(thumbViewSVGDoc, thumb_svg);
    }

    // Preparacion inicial del estado de zoom
    animateZoom(main_svg, 0.8 * main_svg.getZoom(), animationTime = 2, fps = 60, callback = function () {
        initialState.pan = main_svg.getPan();
        initialState.zoom = main_svg.getZoom();
    });

    thumb_svg.zoomBy(0.8);
    thumb_svg.updateThumbScope();

    function destroyAll() {
        main_svg.destroy();
        delete main_svg;
        thumb_svg.destroy();
        delete thumb_svg;

        $mainView.parentElement.getElementsByClassName(controlPanelClass)[0].remove();
        // $mainSVG.remove();
    }

    var firstResize = true;
    const ro = new ResizeObserver(entries => {
        for (let entry of entries) {
            let mainView_bCR = entry.target.getBoundingClientRect();
            let scopeContainer_bCR = $scopeContainer.getBoundingClientRect();
            if (mainView_bCR.width > 0 && mainView_bCR.height > 0 && entry.target === $mainView) {
                flagFirstReset = true;
                // Ajustar tamaño del SVG
                if (!firstResize) {
                    firstResize = false;
                    if (main_svg.intervalZoomID) {
                        clearInterval(main_svg.intervalZoomID);
                        main_svg.intervalZoomID = null;
                    }
                    if (main_svg.intervalPanID) {
                        clearInterval(main_svg.intervalPanID);
                        main_svg.intervalPanID = null;
                    }

                    if (thumb_svg.intervalZoomID) {
                        clearInterval(thumb_svg.intervalZoomID);
                        thumb_svg.intervalZoomID = null;
                    }
                    if (thumb_svg.intervalPanID) {
                        clearInterval(thumb_svg.intervalPanID);
                        thumb_svg.intervalPanID = null;
                    }
                }
                main_svg.resize();
                if (scopeContainer_bCR.width > 0 && scopeContainer_bCR.height > 0) {
                    thumb_svg.resize();
                    // Centrar pan y zoom del thumbnail
                    thumb_svg.resetZoom();
                    thumb_svg.zoomOut();
                    thumb_svg.zoomOut();
                    thumb_svg.center(true);
                    // Actualizar el recuardo del viewbox del thumbnail
                    thumb_svg.updateThumbScope();
                }

                let temp_state = {
                    zoom: main_svg.getZoom(),
                    pan: main_svg.getPan()
                }
                main_svg.reset();
                main_svg.zoomBy(0.8);
                initialState.pan = main_svg.getPan();
                initialState.zoom = main_svg.getZoom();


                main_svg.zoom(temp_state.zoom);
                main_svg.pan(temp_state.pan);
            }
        }
    });
    // Only observe the 2nd box
    ro.observe($mainView);

    return [main_svg, thumb_svg, destroyAll];
};