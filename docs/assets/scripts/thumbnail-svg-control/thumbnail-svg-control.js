var ThumbnailSVGControl = function (options) {
	var flagFirstReset = true;
	var $mainView = document.getElementById(options.mainViewId);
	var $mainSVG = document.getElementById(options.mainSVGId);
	var $thumbSVG = document.getElementById(options.thumbSVGId);
	const scopeContainerId = "scopeContainer";
	const thumbContainerId = options.thumbContainerId || "thumbViewContainer";

	let scaleZoomSen = 0.2;
	let initialState = {
		pan: { x: 0, y: 0 },
		zoom: 0
	};
	var resetTumbPanOffsetX, resetTumbPanOffsetY;
	var main_svg, thumb_svg;

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
		animationTime = animationTime || 0.5;
		fps = fps || 60;
		var iterations = fps * animationTime, // ms duration
			// animationStepTime = 15,  // one per 30 frames
			animationStepTime = animationTime / iterations,
			animationStep = 0,
			time = 0,
			intervalID = null,
			_oldPan = $svg_inst.getPan(),
			actualPan = $svg_inst.getPan(),
			stepX = (_newPan.x - _oldPan.x) / iterations,
			stepy = (_newPan.y - _oldPan.y) / iterations

		intervalID = setInterval(function () {
			time += animationStepTime;
			actualPan.x = linear(time, _oldPan.x, _newPan.x - _oldPan.x, animationTime);
			actualPan.y = linear(time, _oldPan.y, _newPan.y - _oldPan.y, animationTime);
			// actualZoom += step;
			let dirPan = {
				x: ((_newPan.x - _oldPan.x) / Math.abs(_newPan.x - _oldPan.x)),
				y: ((_newPan.y - _oldPan.y) / Math.abs(_newPan.y - _oldPan.y)),
			};
			if (dirPan.x * (actualPan.x - _newPan.x) < 0 && dirPan.y * (actualPan.y - _newPan.y) < 0) {
				$svg_inst.pan(actualPan);
			} else {
				// Cancel interval
				clearInterval(intervalID)
			}
		}, animationStepTime)
	}
	function animatePanBy($svg_inst, amount, animationTime, fps, callback = undefined) { // {x: 1, y: 2}
		animationTime = animationTime || 0.5;
		fps = fps || 60;
		var iterations = fps * animationTime, // ms duration
			// animationStepTime = 15,  // one per 30 frames
			animationStepTime = animationTime / iterations,
			animationStep = 0,
			time = 0,
			intervalID = null,
			_oldPan = $svg_inst.getPan(),
			actualPan = _oldPan,
			_newPan = { x: _oldPan.x + amount.x, y: _oldPan.y + amount.y },
			stepX = (_newPan.x - _oldPan.x) / iterations,
			stepy = (_newPan.y - _oldPan.y) / iterations

		intervalID = setInterval(function () {
			time += animationStepTime;
			actualPan.x = linear(time, _oldPan.x, _newPan.x - _oldPan.x, animationTime);
			actualPan.y = linear(time, _oldPan.y, _newPan.y - _oldPan.y, animationTime);
			// actualZoom += step;
			let dirPan = {
				x: ((_newPan.x - _oldPan.x) / Math.abs(_newPan.x - _oldPan.x)),
				y: ((_newPan.y - _oldPan.y) / Math.abs(_newPan.y - _oldPan.y)),
			};
			if (dirPan.x * (actualPan.x - _newPan.x) < 0 && dirPan.y * (actualPan.y - _newPan.y) < 0) {
				$svg_inst.pan(actualPan);
			} else {
				// Cancel interval
				clearInterval(intervalID)
			}
		}, animationStepTime)
	}
	// FUNCIONES ANIMACION DE ZOOM
	function animateZoom($svg_inst, _newZoom, animationTime, fps, callback = undefined) { // {x: 1, y: 2}
		animationTime = animationTime || 0.5;
		fps = fps || 60;
		var // animationStepTime = 15,  // one per 30 frames
			iterations = fps * animationTime,
			animationStepTime = animationTime / iterations,
			animationStep = 0,
			time = 0,
			intervalID = null,
			_oldZoom = $svg_inst.getZoom(),
			actualZoom = _oldZoom,
			step = (_newZoom - _oldZoom) / iterations;
		intervalID = setInterval(function () {
			time += animationStepTime;
			actualZoom = linear(time, _oldZoom, _newZoom - _oldZoom, animationTime);
			let change = _newZoom - _oldZoom;
			if (Math.abs(change) < 0.001) {
				actualZoom = _newZoom;
				$svg_inst.zoom(actualZoom);
				clearInterval(intervalID);
				if (callback) callback();
			}
			// actualZoom += step;
			let dirZoom = ((_newZoom - _oldZoom) / Math.abs(_newZoom - _oldZoom));
			if (dirZoom * (actualZoom - _newZoom) < 0) {
				$svg_inst.zoom(actualZoom);
			} else {
				// Cancel interval
				clearInterval(intervalID);
				if (callback) callback();
			}
		}, animationStepTime)
	}
	function animateZoomAtPointBy($svg_inst, _newZoomPercent, atPoint, animationTime, fps, callback = undefined) { // {x: 1, y: 2}
		animationTime = animationTime || 0.5;
		fps = fps || 60;
		var // animationStepTime = 15,  // one per 30 frames
			iterations = fps * animationTime,
			animationStepTime = animationTime / iterations,
			animationStep = 0,
			time = 0,
			intervalID = null,
			_oldZoom = $svg_inst.getZoom(),
			_newZoom = _oldZoom * _newZoomPercent,
			actualZoom = _oldZoom,
			step = (_newZoom - _oldZoom) / iterations;
		intervalID = setInterval(function () {
			time += animationStepTime;
			actualZoom = linear(time, _oldZoom, _newZoom - _oldZoom, animationTime);
			// actualZoom += step;
			let dirZoom = ((_newZoom - _oldZoom) / Math.abs(_newZoom - _oldZoom));
			if (dirZoom * (actualZoom - _newZoom) < 0) {
				$svg_inst.zoomAtPoint(actualZoom, atPoint)
			} else {
				// Cancel interval
				clearInterval(intervalID)
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
	var bindThumbnailSVGControlListeners = function (_main_svg, _thumb_svg, _scopeContainerId) {
		if (!main_svg && _main_svg) {
			main_svg = _main_svg;
		}
		if (!thumb_svg && _thumb_svg) {
			thumb_svg = _thumb_svg;
		}
		if (!main_svg || !thumb_svg) {
			return;
		}

		const ro = new ResizeObserver(entries => {
			for (let entry of entries) {
				let mainView_bCR = entry.target.getBoundingClientRect();
				let scopeContainer_bCR = document.querySelector(`#${scopeContainerId}`).getBoundingClientRect();
				if (mainView_bCR.width > 0 && mainView_bCR.height > 0 && entry.target === $mainView) {
					flagFirstReset = true;
					// Ajustar tamaño del SVG
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
				let scopeContainerBounds = document.querySelector(`#${_scopeContainerId}`).getBoundingClientRect();
				let thumbWidth = _thumb_svg.getSizes().width;
				let thumbHeight = _thumb_svg.getSizes().height;
				resetTumbPanOffsetX = scopeX - (thumbPanX + (clientVirtX - scopeContainerBounds.left - thumbWidth / 2));
				resetTumbPanOffsetY = scopeY - (thumbPanY + (clientVirtY - scopeContainerBounds.top - thumbHeight / 2));
				flagFirstReset = false;
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
				` transparent calc(100% ${signs_sub.bb_y}${bound_scope_box.y}px),` +
				` white calc(100% ${signs_sub.bb_y}${bound_scope_box.y}px)` +
				`),` +
				`linear-gradient(to bottom,` +
				` transparent calc(${bound_scope_box.y}px ${signs_plus.bb_h}${bound_scope_box.height}px),` +
				` white calc(${bound_scope_box.y}px ${signs_plus.bb_h}${bound_scope_box.height}px)` +
				`),` +
				`linear-gradient(to left,` +
				` transparent calc(100% ${signs_sub.bb_x}${bound_scope_box.x}px),` +
				` white calc(100% ${signs_sub.bb_x}${bound_scope_box.x}px)` +
				`),` +
				`linear-gradient(to right,` +
				` transparent calc(${bound_scope_box.x}px ${signs_plus.bb_w}${bound_scope_box.width}px),` +
				` white calc(${bound_scope_box.x}px ${signs_plus.bb_w}${bound_scope_box.width}px)` +
				`)`;

			$mask_thumb_scope.style.webkitMask = mask_gradient;
			$mask_thumb_scope.style.mask = mask_gradient;
		}
		thumb_svg.updateThumbScope();

		var _updateMainViewPan = function (clientX, clientY, $scopeContainer, _main_svg, _thumb_svg) {
			var dim = $scopeContainer.getBoundingClientRect(),
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

			let thumbPanX = clientX - (dim.left + thumbWidth / 2 - resetTumbPanOffsetX);
			let thumbPanY = clientY - (dim.top + thumbHeight / 2 - resetTumbPanOffsetY);
			let mainPanX = - thumbPanX * mainZoom / thumbZoom;
			let mainPanY = - thumbPanY * mainZoom / thumbZoom;
			_main_svg.pan({ x: mainPanX, y: mainPanY });
		};

		var updateMainViewPan = function (event, _scopeContainerId) {
			// event.which == 0 En firefox es siempre 1....
			// buttons 1: el click izquierdo
			if (event.buttons == 0 && event.button == 0 || event.buttons != 1) {
				return false;
			}

			let $scopeContainer = document.getElementById(_scopeContainerId);
			_updateMainViewPan(event.clientX, event.clientY, $scopeContainer, main_svg, thumb_svg);
		}

		let $scopeContainer = document.getElementById(_scopeContainerId);
		$scopeContainer.addEventListener('mousedown', function (event) {
			event.preventDefault();
			updateMainViewPan(event, scopeContainerId);
		});
		$scopeContainer.addEventListener('mousemove', function (event) {
			event.preventDefault();
			updateMainViewPan(event, scopeContainerId);
		});

		function resizeThumbView(event) {
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

		}
		$scopeContainer.addEventListener('mouseenter', resizeThumbView);
		$scopeContainer.addEventListener('mouseleave', resizeThumbView);
		$mainView.addEventListener('mouseleave', resizeThumbView);


		let _$zoom_in = document.querySelector(`#zoom-in`);
		let _$zoom_out = document.querySelector(`#zoom-out`);
		let _$zoom_reset = document.querySelector(`#zoom-reset`);

		_$zoom_in.addEventListener('click', function (event) {
			// main_svg.zoomIn();
			animateZoom(main_svg, main_svg.getZoom() + main_svg.zoomScaleSensitivity);
		});
		_$zoom_out.addEventListener('click', function (event) {
			// main_svg.zoomOut();
			animateZoom(main_svg, main_svg.getZoom() - main_svg.zoomScaleSensitivity);
		})
		_$zoom_reset.addEventListener('click', function (event) {
			// main_svg.resetZoom();
			animateZoom(main_svg, initialState.zoom);
			animatePan(main_svg, initialState.pan);
		})
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
				init: function (options) {
					// Init Hammer
					// this.hammer = Hammer(options.svgElement)
					// Handle double tap
					// this.hammer.on('doubletap', function(ev){
					// 	options.instance.zoomIn()
					// })
					let support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
						document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
							"DOMMouseScroll";

					function wheelHandler(event) {
						let that = options.instance;
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

						var inversedScreenCTM = this.getScreenCTM().inverse();
						var point = this.createSVGPoint();
						point.x = event.clientX
						point.y = event.clientY
						let relativeMousePoint = point.matrixTransform(inversedScreenCTM);
						let zoom = Math.pow(1 + that.zoomScaleSensitivity, (-1) * delta); // multiplying by neg. 1 so as to make zoom in/out behavior match Google maps behavior

						// that.zoomAtPointBy(zoom, relativeMousePoint);
						animateZoomAtPointBy(that, zoom, relativeMousePoint, animationTime = 0.2);
					}

					options.svgElement.addEventListener(support, wheelHandler);
				},
				// Destroy custom events handler
				destroy: function () {
					let support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
						document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
							"DOMMouseScroll";
					options.svgElement.removeEventListener(support, wheelHandler);
				}
			}
		});

		return _main_svg;
	};



	// Control del Thumbnail
	// Creacionn del thumbnail a partir del mismo SVG del main
	var createThumbnail = function () {
		// Crear el esqueleto de divs
		var $thumbContainer = document.getElementById(options.thumbContainerId);

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
			$svg_icon.setAttributeNS(null, 'viewBox', '0 0 550 550');
			$g_main.classList.add("main");
			let $g_shineLight = document.createElementNS(svgns, 'g');
			let $g_shineDark = document.createElementNS(svgns, 'g');
			let $g_gradient = document.createElementNS(svgns, 'g');
			$g_shineLight.classList.add("shine-accent-light");
			$g_shineDark.classList.add("shine-accent-dark");
			$g_gradient.classList.add("gradient");

			// Zoom Icon
			let $zoom_icon = document.createElement('div');
			$zoom_icon.id = icon_id;
			$zoom_icon.classList.add("icon");
			let $path_icon = document.createElementNS(svgns, 'path');
			$path_icon.setAttributeNS(null, 'd', _path);

			$g_shineLight.appendChild($path_icon);
			$g_shineDark.appendChild($path_icon);
			$g_gradient.appendChild($path_icon);
			$g_main.appendChild($g_shineLight);
			$g_main.appendChild($g_shineDark);
			$g_main.appendChild($g_gradient);

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
		$control_panel.classList.add("control-panel");
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
			preventMouseEventsDefault: false
		});

		return _thumb_svg;

	};

	createThumbnail();
	// TODO: Agregar appendChild de un svg relativo al main

	$mainSVG.addEventListener("load", function (event) {
		main_svg = initMainView();
	}, false);

	$thumbSVG.addEventListener("load", function (event) {
		thumb_svg = initThumbView();
	}, false);

	// Se inicializan los controles
	// TODO: Condicion de solo se inician si son etiquetas SVG inline
	main_svg = initMainView();
	thumb_svg = initThumbView();


	bindThumbnailSVGControlListeners(main_svg, thumb_svg, scopeContainerId);

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


	return [main_svg, thumb_svg];
};