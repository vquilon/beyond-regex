
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
	var svgPanZoom = require('./svg-pan-zoom.js');
	(function(window, document){
		if (typeof define === 'function' && define.amd) {
			define('svg-pan-zoom', function () {
				return svgPanZoom;
			});
		} else if (typeof module !== 'undefined' && module.exports) {
			module.exports = svgPanZoom;
			window.svgPanZoom = svgPanZoom;
		}
	})(window, document)

},{"./svg-pan-zoom.js":4}],2:[function(require,module,exports){
	var SvgUtils = require('./svg-utilities');

	module.exports = {
		enable: function(instance) {
			var defs = instance.svg.querySelector('defs')
			if (!defs) {
				defs = document.createElementNS(SvgUtils.svgNS, 'defs')
				instance.svg.appendChild(defs)
			}
			var styleEl = defs.querySelector('style#svg-pan-zoom-controls-styles');
			if (!styleEl) {
				var style = document.createElementNS(SvgUtils.svgNS, 'style')
				style.setAttribute('id', 'svg-pan-zoom-controls-styles')
				style.setAttribute('type', 'text/css')
				style.textContent = '.svg-pan-zoom-control { cursor: pointer; fill: black; fill-opacity: 0.333; } .svg-pan-zoom-control:hover { fill-opacity: 0.8; } .svg-pan-zoom-control-background { fill: white; fill-opacity: 0.5; } .svg-pan-zoom-control-background { fill-opacity: 0.8; }'
				defs.appendChild(style)
			}
			var zoomGroup = document.createElementNS(SvgUtils.svgNS, 'g');
			zoomGroup.setAttribute('id', 'svg-pan-zoom-controls');
			zoomGroup.setAttribute('transform', 'translate(' + ( instance.width - 70 ) + ' ' + ( instance.height - 76 ) + ') scale(0.75)');
			zoomGroup.setAttribute('class', 'svg-pan-zoom-control');
			zoomGroup.appendChild(this._createZoomIn(instance))
			zoomGroup.appendChild(this._createZoomReset(instance))
			zoomGroup.appendChild(this._createZoomOut(instance))
			instance.svg.appendChild(zoomGroup)
			instance.controlIcons = zoomGroup
		}

		, _createZoomIn: function(instance) {
			var zoomIn = document.createElementNS(SvgUtils.svgNS, 'g');
			zoomIn.setAttribute('id', 'svg-pan-zoom-zoom-in');
			zoomIn.setAttribute('transform', 'translate(30.5 5) scale(0.015)');
			zoomIn.setAttribute('class', 'svg-pan-zoom-control');
			zoomIn.addEventListener('click', function() {instance.getPublicInstance().zoomIn()}, {passive: true})
			zoomIn.addEventListener('touchstart', function() {instance.getPublicInstance().zoomIn()}, {passive: true})

			var zoomInBackground = document.createElementNS(SvgUtils.svgNS, 'rect'); 
			zoomInBackground.setAttribute('x', '0');
			zoomInBackground.setAttribute('y', '0');
			zoomInBackground.setAttribute('width', '1500'); 
			zoomInBackground.setAttribute('height', '1400');
			zoomInBackground.setAttribute('class', 'svg-pan-zoom-control-background');
			zoomIn.appendChild(zoomInBackground);

			var zoomInShape = document.createElementNS(SvgUtils.svgNS, 'path');
			zoomInShape.setAttribute('d', 'M1280 576v128q0 26 -19 45t-45 19h-320v320q0 26 -19 45t-45 19h-128q-26 0 -45 -19t-19 -45v-320h-320q-26 0 -45 -19t-19 -45v-128q0 -26 19 -45t45 -19h320v-320q0 -26 19 -45t45 -19h128q26 0 45 19t19 45v320h320q26 0 45 19t19 45zM1536 1120v-960 q0 -119 -84.5 -203.5t-203.5 -84.5h-960q-119 0 -203.5 84.5t-84.5 203.5v960q0 119 84.5 203.5t203.5 84.5h960q119 0 203.5 -84.5t84.5 -203.5z');
			zoomInShape.setAttribute('class', 'svg-pan-zoom-control-element');
			zoomIn.appendChild(zoomInShape);

			return zoomIn
		}

		, _createZoomReset: function(instance){
			var resetPanZoomControl = document.createElementNS(SvgUtils.svgNS, 'g');
			resetPanZoomControl.setAttribute('id', 'svg-pan-zoom-reset-pan-zoom');
			resetPanZoomControl.setAttribute('transform', 'translate(5 35) scale(0.4)');
			resetPanZoomControl.setAttribute('class', 'svg-pan-zoom-control');
			resetPanZoomControl.addEventListener('click', function() {instance.getPublicInstance().reset()}, {passive: true});
			resetPanZoomControl.addEventListener('touchstart', function() {instance.getPublicInstance().reset()}, {passive: true});

			var resetPanZoomControlBackground = document.createElementNS(SvgUtils.svgNS, 'rect'); 
			resetPanZoomControlBackground.setAttribute('x', '2');
			resetPanZoomControlBackground.setAttribute('y', '2');
			resetPanZoomControlBackground.setAttribute('width', '182'); 
			resetPanZoomControlBackground.setAttribute('height', '58');
			resetPanZoomControlBackground.setAttribute('class', 'svg-pan-zoom-control-background');
			resetPanZoomControl.appendChild(resetPanZoomControlBackground);

			var resetPanZoomControlShape1 = document.createElementNS(SvgUtils.svgNS, 'path');
			resetPanZoomControlShape1.setAttribute('d', 'M33.051,20.632c-0.742-0.406-1.854-0.609-3.338-0.609h-7.969v9.281h7.769c1.543,0,2.701-0.188,3.473-0.562c1.365-0.656,2.048-1.953,2.048-3.891C35.032,22.757,34.372,21.351,33.051,20.632z');
			resetPanZoomControlShape1.setAttribute('class', 'svg-pan-zoom-control-element');
			resetPanZoomControl.appendChild(resetPanZoomControlShape1);

			var resetPanZoomControlShape2 = document.createElementNS(SvgUtils.svgNS, 'path');
			resetPanZoomControlShape2.setAttribute('d', 'M170.231,0.5H15.847C7.102,0.5,0.5,5.708,0.5,11.84v38.861C0.5,56.833,7.102,61.5,15.847,61.5h154.384c8.745,0,15.269-4.667,15.269-10.798V11.84C185.5,5.708,178.976,0.5,170.231,0.5z M42.837,48.569h-7.969c-0.219-0.766-0.375-1.383-0.469-1.852c-0.188-0.969-0.289-1.961-0.305-2.977l-0.047-3.211c-0.03-2.203-0.41-3.672-1.142-4.406c-0.732-0.734-2.103-1.102-4.113-1.102h-7.05v13.547h-7.055V14.022h16.524c2.361,0.047,4.178,0.344,5.45,0.891c1.272,0.547,2.351,1.352,3.234,2.414c0.731,0.875,1.31,1.844,1.737,2.906s0.64,2.273,0.64,3.633c0,1.641-0.414,3.254-1.242,4.84s-2.195,2.707-4.102,3.363c1.594,0.641,2.723,1.551,3.387,2.73s0.996,2.98,0.996,5.402v2.32c0,1.578,0.063,2.648,0.19,3.211c0.19,0.891,0.635,1.547,1.333,1.969V48.569z M75.579,48.569h-26.18V14.022h25.336v6.117H56.454v7.336h16.781v6H56.454v8.883h19.125V48.569z M104.497,46.331c-2.44,2.086-5.887,3.129-10.34,3.129c-4.548,0-8.125-1.027-10.731-3.082s-3.909-4.879-3.909-8.473h6.891c0.224,1.578,0.662,2.758,1.316,3.539c1.196,1.422,3.246,2.133,6.15,2.133c1.739,0,3.151-0.188,4.236-0.562c2.058-0.719,3.087-2.055,3.087-4.008c0-1.141-0.504-2.023-1.512-2.648c-1.008-0.609-2.607-1.148-4.796-1.617l-3.74-0.82c-3.676-0.812-6.201-1.695-7.576-2.648c-2.328-1.594-3.492-4.086-3.492-7.477c0-3.094,1.139-5.664,3.417-7.711s5.623-3.07,10.036-3.07c3.685,0,6.829,0.965,9.431,2.895c2.602,1.93,3.966,4.73,4.093,8.402h-6.938c-0.128-2.078-1.057-3.555-2.787-4.43c-1.154-0.578-2.587-0.867-4.301-0.867c-1.907,0-3.428,0.375-4.565,1.125c-1.138,0.75-1.706,1.797-1.706,3.141c0,1.234,0.561,2.156,1.682,2.766c0.721,0.406,2.25,0.883,4.589,1.43l6.063,1.43c2.657,0.625,4.648,1.461,5.975,2.508c2.059,1.625,3.089,3.977,3.089,7.055C108.157,41.624,106.937,44.245,104.497,46.331z M139.61,48.569h-26.18V14.022h25.336v6.117h-18.281v7.336h16.781v6h-16.781v8.883h19.125V48.569z M170.337,20.14h-10.336v28.43h-7.266V20.14h-10.383v-6.117h27.984V20.14z');
			resetPanZoomControlShape2.setAttribute('class', 'svg-pan-zoom-control-element');
			resetPanZoomControl.appendChild(resetPanZoomControlShape2);

			return resetPanZoomControl
		}

		, _createZoomOut: function(instance){
			var zoomOut = document.createElementNS(SvgUtils.svgNS, 'g');
			zoomOut.setAttribute('id', 'svg-pan-zoom-zoom-out');
			zoomOut.setAttribute('transform', 'translate(30.5 70) scale(0.015)');
			zoomOut.setAttribute('class', 'svg-pan-zoom-control');
			zoomOut.addEventListener('click', function() {instance.getPublicInstance().zoomOut()}, {passive: true});
			zoomOut.addEventListener('touchstart', function() {instance.getPublicInstance().zoomOut()}, {passive: true});

			var zoomOutBackground = document.createElementNS(SvgUtils.svgNS, 'rect'); 
			zoomOutBackground.setAttribute('x', '0');
			zoomOutBackground.setAttribute('y', '0');
			zoomOutBackground.setAttribute('width', '1500'); 
			zoomOutBackground.setAttribute('height', '1400');
			zoomOutBackground.setAttribute('class', 'svg-pan-zoom-control-background');
			zoomOut.appendChild(zoomOutBackground);

			var zoomOutShape = document.createElementNS(SvgUtils.svgNS, 'path');
			zoomOutShape.setAttribute('d', 'M1280 576v128q0 26 -19 45t-45 19h-896q-26 0 -45 -19t-19 -45v-128q0 -26 19 -45t45 -19h896q26 0 45 19t19 45zM1536 1120v-960q0 -119 -84.5 -203.5t-203.5 -84.5h-960q-119 0 -203.5 84.5t-84.5 203.5v960q0 119 84.5 203.5t203.5 84.5h960q119 0 203.5 -84.5 t84.5 -203.5z');
			zoomOutShape.setAttribute('class', 'svg-pan-zoom-control-element');
			zoomOut.appendChild(zoomOutShape);

			return zoomOut
		}

		, disable: function(instance) {
			if (instance.controlIcons) {
				instance.controlIcons.parentNode.removeChild(instance.controlIcons)
				instance.controlIcons = null
			}
		}
	}

},{"./svg-utilities":5}],3:[function(require,module,exports){
	var SvgUtils = require('./svg-utilities')
	, Utils = require('./utilities')
	;

	var ShadowViewport = function(viewport, options){
		this.init(viewport, options)
	}
	ShadowViewport.prototype.init = function(viewport, options) {
		this.viewport = viewport
		this.options = options
		this.originalState = {zoom: 1, x: 0, y: 0}
		this.activeState = {zoom: 1, x: 0, y: 0}

		this.updateCTMCached = Utils.proxy(this.updateCTM, this)
		this.requestAnimationFrame = Utils.createRequestAnimationFrame(this.options.refreshRate)
		this.viewBox = {x: 0, y: 0, width: 0, height: 0}
		this.cacheViewBox()
		var newCTM = this.processCTM()
		this.setCTM(newCTM)
		this.updateCTM()
	}
	ShadowViewport.prototype.cacheViewBox = function() {
		var svgViewBox = this.options.svg.getAttribute('viewBox')

		if (svgViewBox) {
			var viewBoxValues = svgViewBox.split(/[\s\,]/).filter(function(v){return v}).map(parseFloat)
			this.viewBox.x = viewBoxValues[0]
			this.viewBox.y = viewBoxValues[1]
			this.viewBox.width = viewBoxValues[2]
			this.viewBox.height = viewBoxValues[3]

			var zoom = Math.min(this.options.width / this.viewBox.width, this.options.height / this.viewBox.height)
			this.activeState.zoom = zoom
			this.activeState.x = (this.options.width - this.viewBox.width * zoom) / 2
			this.activeState.y = (this.options.height - this.viewBox.height * zoom) / 2
			this.updateCTMOnNextFrame()

			this.options.svg.removeAttribute('viewBox')
		} else {
			this.simpleViewBoxCache()
		}
	}
	ShadowViewport.prototype.simpleViewBoxCache = function() {
		var bBox = this.viewport.getBBox()

		this.viewBox.x = bBox.x
		this.viewBox.y = bBox.y
		this.viewBox.width = bBox.width
		this.viewBox.height = bBox.height
	}
	ShadowViewport.prototype.getViewBox = function() {
		return Utils.extend({}, this.viewBox)
	}
	ShadowViewport.prototype.processCTM = function() {
		var newCTM = this.getCTM()

		if (this.options.fit || this.options.contain) {
			var newScale;
			if (this.options.fit) {
				newScale = Math.min(this.options.width/this.viewBox.width, this.options.height/this.viewBox.height);
			} else {
				newScale = Math.max(this.options.width/this.viewBox.width, this.options.height/this.viewBox.height);
			}

			newCTM.a = newScale; 
			newCTM.d = newScale; 
			newCTM.e = -this.viewBox.x * newScale; 
			newCTM.f = -this.viewBox.y * newScale; 
		}

		if (this.options.center) {
			var offsetX = (this.options.width - (this.viewBox.width + this.viewBox.x * 2) * newCTM.a) * 0.5
			, offsetY = (this.options.height - (this.viewBox.height + this.viewBox.y * 2) * newCTM.a) * 0.5

			newCTM.e = offsetX
			newCTM.f = offsetY
		}
		this.originalState.zoom = newCTM.a
		this.originalState.x = newCTM.e
		this.originalState.y = newCTM.f

		return newCTM
	}
	ShadowViewport.prototype.getOriginalState = function() {
		return Utils.extend({}, this.originalState)
	}
	ShadowViewport.prototype.getState = function() {
		return Utils.extend({}, this.activeState)
	}
	ShadowViewport.prototype.getZoom = function() {
		return this.activeState.zoom
	}
	ShadowViewport.prototype.getRelativeZoom = function() {
		return this.activeState.zoom / this.originalState.zoom
	}
	ShadowViewport.prototype.computeRelativeZoom = function(scale) {
		return scale / this.originalState.zoom
	}
	ShadowViewport.prototype.getPan = function() {
		return {x: this.activeState.x, y: this.activeState.y}
	}
	ShadowViewport.prototype.getCTM = function() {
		var safeCTM = this.options.svg.createSVGMatrix()
		safeCTM.a = this.activeState.zoom
		safeCTM.b = 0
		safeCTM.c = 0
		safeCTM.d = this.activeState.zoom
		safeCTM.e = this.activeState.x
		safeCTM.f = this.activeState.y

		return safeCTM
	}
	ShadowViewport.prototype.setCTM = function(newCTM) {
		var willZoom = this.isZoomDifferent(newCTM)
		, willPan = this.isPanDifferent(newCTM)

		if (willZoom || willPan) {
			if (willZoom) {
				if (this.options.beforeZoom(this.getRelativeZoom(), this.computeRelativeZoom(newCTM.a)) === false) {
					newCTM.a = newCTM.d = this.activeState.zoom
					willZoom = false
				} else {
					this.updateCache(newCTM);
					this.options.onZoom(this.getRelativeZoom())
				}
			}
			if (willPan) {
				var preventPan = this.options.beforePan(this.getPan(), {x: newCTM.e, y: newCTM.f})
				, preventPanX = false
				, preventPanY = false
				if (preventPan === false) {
					newCTM.e = this.getPan().x
					newCTM.f = this.getPan().y

					preventPanX = preventPanY = true
				} else if (Utils.isObject(preventPan)) {
					if (preventPan.x === false) {
						newCTM.e = this.getPan().x
						preventPanX = true
					} else if (Utils.isNumber(preventPan.x)) {
						newCTM.e = preventPan.x
					}
					if (preventPan.y === false) {
						newCTM.f = this.getPan().y
						preventPanY = true
					} else if (Utils.isNumber(preventPan.y)) {
						newCTM.f = preventPan.y
					}
				}
				if ((preventPanX && preventPanY) || !this.isPanDifferent(newCTM)) {
					willPan = false
				} else {
					this.updateCache(newCTM);
					this.options.onPan(this.getPan());
				}
			}
			if (willZoom || willPan) {
				this.updateCTMOnNextFrame()
			}
		}
	}

	ShadowViewport.prototype.isZoomDifferent = function(newCTM) {
		return this.activeState.zoom !== newCTM.a
	}

	ShadowViewport.prototype.isPanDifferent = function(newCTM) {
		return this.activeState.x !== newCTM.e || this.activeState.y !== newCTM.f
	}
	ShadowViewport.prototype.updateCache = function(newCTM) {
		this.activeState.zoom = newCTM.a
		this.activeState.x = newCTM.e
		this.activeState.y = newCTM.f
	}

	ShadowViewport.prototype.pendingUpdate = false
	ShadowViewport.prototype.updateCTMOnNextFrame = function() {
		if (!this.pendingUpdate) {
			this.pendingUpdate = true
			this.requestAnimationFrame.call(window, this.updateCTMCached)
		}
	}
	ShadowViewport.prototype.updateCTM = function() {
		var ctm = this.getCTM()
		SvgUtils.setCTM(this.viewport, ctm, this.defs)
		this.pendingUpdate = false
		if(this.options.onUpdatedCTM) {
			this.options.onUpdatedCTM(ctm)
		}
	}

	module.exports = function(viewport, options){
		return new ShadowViewport(viewport, options)
	}

},{"./svg-utilities":5,"./utilities":7}],4:[function(require,module,exports){
	var Wheel = require('./uniwheel')
	, ControlIcons = require('./control-icons')
	, Utils = require('./utilities')
	, SvgUtils = require('./svg-utilities')
	, ShadowViewport = require('./shadow-viewport')

	var SvgPanZoom = function(svg, options) {
		this.init(svg, options)
	}

	var optionsDefaults = {
		viewportSelector: '.svg-pan-zoom_viewport' 
		, panEnabled: true 
		, controlIconsEnabled: false 
		, zoomEnabled: true 
		, dblClickZoomEnabled: true 
		, mouseWheelZoomEnabled: true 
		, preventMouseEventsDefault: true 
		, zoomScaleSensitivity: 0.1 
		, minZoom: 0.5 
		, maxZoom: 10 
		, fit: true 
		, contain: false 
		, center: true 
		, refreshRate: 'auto' 
		, beforeZoom: null
		, onZoom: null
		, beforePan: null
		, onPan: null
		, customEventsHandler: null
		, eventsListenerElement: null
		, onUpdatedCTM: null
	}

	var passiveListenerOption = {passive: true};

	SvgPanZoom.prototype.init = function(svg, options) {
		var that = this

		this.svg = svg
		this.defs = svg.querySelector('defs')
		SvgUtils.setupSvgAttributes(this.svg)
		this.options = Utils.extend(Utils.extend({}, optionsDefaults), options)
		this.state = 'none'
		var boundingClientRectNormalized = SvgUtils.getBoundingClientRectNormalized(svg)
		this.width = boundingClientRectNormalized.width
		this.height = boundingClientRectNormalized.height
		this.viewport = ShadowViewport(SvgUtils.getOrCreateViewport(this.svg, this.options.viewportSelector), {
			svg: this.svg
			, width: this.width
			, height: this.height
			, fit: this.options.fit
			, contain: this.options.contain
			, center: this.options.center
			, refreshRate: this.options.refreshRate
			, beforeZoom: function(oldScale, newScale) {
				if (that.viewport && that.options.beforeZoom) {return that.options.beforeZoom(oldScale, newScale)}
			}
			, onZoom: function(scale) {
				if (that.viewport && that.options.onZoom) {return that.options.onZoom(scale)}
			}
			, beforePan: function(oldPoint, newPoint) {
				if (that.viewport && that.options.beforePan) {return that.options.beforePan(oldPoint, newPoint)}
			}
			, onPan: function(point) {
				if (that.viewport && that.options.onPan) {return that.options.onPan(point)}
			}
			, onUpdatedCTM: function(ctm) {
				if (that.viewport && that.options.onUpdatedCTM) {return that.options.onUpdatedCTM(ctm)}
			}
		})
		var publicInstance = this.getPublicInstance()
		publicInstance.setBeforeZoom(this.options.beforeZoom)
		publicInstance.setOnZoom(this.options.onZoom)
		publicInstance.setBeforePan(this.options.beforePan)
		publicInstance.setOnPan(this.options.onPan)
		publicInstance.setOnUpdatedCTM(this.options.onUpdatedCTM)

		if (this.options.controlIconsEnabled) {
			ControlIcons.enable(this)
		}
		this.lastMouseWheelEventTime = Date.now()
		this.setupHandlers()
	}
	SvgPanZoom.prototype.setupHandlers = function() {
		var that = this
		, prevEvt = null 
		;

		this.eventListeners = {
			mousedown: function(evt) {
				var result = that.handleMouseDown(evt, prevEvt);
				prevEvt = evt
				return result;
			}
			, touchstart: function(evt) {
				var result = that.handleMouseDown(evt, prevEvt);
				prevEvt = evt
				return result;
			}
			, mouseup: function(evt) {
				return that.handleMouseUp(evt);
			}
			, touchend: function(evt) {
				return that.handleMouseUp(evt);
			}
			, mousemove: function(evt) {
				return that.handleMouseMove(evt);
			}
			, touchmove: function(evt) {
				return that.handleMouseMove(evt);
			}
			, mouseleave: function(evt) {
				return that.handleMouseUp(evt);
			}
			, touchleave: function(evt) {
				return that.handleMouseUp(evt);
			}
			, touchcancel: function(evt) {
				return that.handleMouseUp(evt);
			}
		}
		if (this.options.customEventsHandler != null) { 
			this.options.customEventsHandler.init({
				svgElement: this.svg
				, eventsListenerElement: this.options.eventsListenerElement
				, instance: this.getPublicInstance()
			})
			var haltEventListeners = this.options.customEventsHandler.haltEventListeners
			if (haltEventListeners && haltEventListeners.length) {
				for (var i = haltEventListeners.length - 1; i >= 0; i--) {
					if (this.eventListeners.hasOwnProperty(haltEventListeners[i])) {
						delete this.eventListeners[haltEventListeners[i]]
					}
				}
			}
		}
		for (var event in this.eventListeners) {
			(this.options.eventsListenerElement || this.svg)
				.addEventListener(event, this.eventListeners[event], !this.options.preventMouseEventsDefault ? passiveListenerOption : false)
		}
		if (this.options.mouseWheelZoomEnabled) {
			this.options.mouseWheelZoomEnabled = false 
			this.enableMouseWheelZoom()
		}
	}
	SvgPanZoom.prototype.enableMouseWheelZoom = function() {
		if (!this.options.mouseWheelZoomEnabled) {
			var that = this
			this.wheelListener = function(evt) {
				return that.handleMouseWheel(evt);
			}
			var isPassiveListener = !this.options.preventMouseEventsDefault
			Wheel.on(this.options.eventsListenerElement || this.svg, this.wheelListener, isPassiveListener)

			this.options.mouseWheelZoomEnabled = true
		}
	}
	SvgPanZoom.prototype.disableMouseWheelZoom = function() {
		if (this.options.mouseWheelZoomEnabled) {
			var isPassiveListener = !this.options.preventMouseEventsDefault
			Wheel.off(this.options.eventsListenerElement || this.svg, this.wheelListener, isPassiveListener)
			this.options.mouseWheelZoomEnabled = false
		}
	}
	SvgPanZoom.prototype.handleMouseWheel = function(evt) {
		if (!this.options.zoomEnabled || this.state !== 'none') {
			return;
		}

		if (this.options.preventMouseEventsDefault){
			if (evt.preventDefault) {
				evt.preventDefault();
			} else {
				evt.returnValue = false;
			}
		}
		var delta = evt.deltaY || 1
		, timeDelta = Date.now() - this.lastMouseWheelEventTime
		, divider = 3 + Math.max(0, 30 - timeDelta)
		this.lastMouseWheelEventTime = Date.now()
		if ('deltaMode' in evt && evt.deltaMode === 0 && evt.wheelDelta) {
			delta = evt.deltaY === 0 ? 0 :  Math.abs(evt.wheelDelta) / evt.deltaY
		}

		delta = -0.3 < delta && delta < 0.3 ? delta : (delta > 0 ? 1 : -1) * Math.log(Math.abs(delta) + 10) / divider

		var inversedScreenCTM = this.svg.getScreenCTM().inverse()
		, relativeMousePoint = SvgUtils.getEventPoint(evt, this.svg).matrixTransform(inversedScreenCTM)
		, zoom = Math.pow(1 + this.options.zoomScaleSensitivity, (-1) * delta); 

		this.zoomAtPoint(zoom, relativeMousePoint)
	}
	SvgPanZoom.prototype.zoomAtPoint = function(zoomScale, point, zoomAbsolute) {
		var originalState = this.viewport.getOriginalState()

		if (!zoomAbsolute) {
			if (this.getZoom() * zoomScale < this.options.minZoom * originalState.zoom) {
				zoomScale = (this.options.minZoom * originalState.zoom) / this.getZoom()
			} else if (this.getZoom() * zoomScale > this.options.maxZoom * originalState.zoom) {
				zoomScale = (this.options.maxZoom * originalState.zoom) / this.getZoom()
			}
		} else {
			zoomScale = Math.max(this.options.minZoom * originalState.zoom, Math.min(this.options.maxZoom * originalState.zoom, zoomScale))
			zoomScale = zoomScale/this.getZoom()
		}

		var oldCTM = this.viewport.getCTM()
		, relativePoint = point.matrixTransform(oldCTM.inverse())
		, modifier = this.svg.createSVGMatrix().translate(relativePoint.x, relativePoint.y).scale(zoomScale).translate(-relativePoint.x, -relativePoint.y)
		, newCTM = oldCTM.multiply(modifier)

		if (newCTM.a !== oldCTM.a) {
			this.viewport.setCTM(newCTM)
		}
	}
	SvgPanZoom.prototype.zoom = function(scale, absolute) {
		this.zoomAtPoint(scale, SvgUtils.getSvgCenterPoint(this.svg, this.width, this.height), absolute)
	}
	SvgPanZoom.prototype.publicZoom = function(scale, absolute) {
		if (absolute) {
			scale = this.computeFromRelativeZoom(scale)
		}

		this.zoom(scale, absolute)
	}
	SvgPanZoom.prototype.publicZoomAtPoint = function(scale, point, absolute) {
		if (absolute) {
			scale = this.computeFromRelativeZoom(scale)
		}
		if (Utils.getType(point) !== 'SVGPoint') {
			if('x' in point && 'y' in point) {
				point = SvgUtils.createSVGPoint(this.svg, point.x, point.y)
			} else {
				throw new Error('Given point is invalid')
			}
		}

		this.zoomAtPoint(scale, point, absolute)
	}
	SvgPanZoom.prototype.getZoom = function() {
		return this.viewport.getZoom()
	}
	SvgPanZoom.prototype.getRelativeZoom = function() {
		return this.viewport.getRelativeZoom()
	}
	SvgPanZoom.prototype.computeFromRelativeZoom = function(zoom) {
		return zoom * this.viewport.getOriginalState().zoom
	}
	SvgPanZoom.prototype.resetZoom = function() {
		var originalState = this.viewport.getOriginalState()

		this.zoom(originalState.zoom, true);
	}
	SvgPanZoom.prototype.resetPan = function() {
		this.pan(this.viewport.getOriginalState());
	}
	SvgPanZoom.prototype.reset = function() {
		this.resetZoom()
		this.resetPan()
	}
	SvgPanZoom.prototype.handleDblClick = function(evt) {
		if (this.options.preventMouseEventsDefault) {
			if (evt.preventDefault) {
				evt.preventDefault()
			} else {
				evt.returnValue = false
			}
		}
		if (this.options.controlIconsEnabled) {
			var targetClass = evt.target.getAttribute('class') || ''
			if (targetClass.indexOf('svg-pan-zoom-control') > -1) {
				return false
			}
		}

		var zoomFactor

		if (evt.shiftKey) {
			zoomFactor = 1/((1 + this.options.zoomScaleSensitivity) * 2) 
		} else {
			zoomFactor = (1 + this.options.zoomScaleSensitivity) * 2
		}

		var point = SvgUtils.getEventPoint(evt, this.svg).matrixTransform(this.svg.getScreenCTM().inverse())
		this.zoomAtPoint(zoomFactor, point)
	}
	SvgPanZoom.prototype.handleMouseDown = function(evt, prevEvt) {
		if (this.options.preventMouseEventsDefault) {
			if (evt.preventDefault) {
				evt.preventDefault()
			} else {
				evt.returnValue = false
			}
		}

		Utils.mouseAndTouchNormalize(evt, this.svg)
		if (this.options.dblClickZoomEnabled && Utils.isDblClick(evt, prevEvt)){
			this.handleDblClick(evt)
		} else {
			this.state = 'pan'
			this.firstEventCTM = this.viewport.getCTM()
			this.stateOrigin = SvgUtils.getEventPoint(evt, this.svg).matrixTransform(this.firstEventCTM.inverse())
		}
	}
	SvgPanZoom.prototype.handleMouseMove = function(evt) {
		if (this.options.preventMouseEventsDefault) {
			if (evt.preventDefault) {
				evt.preventDefault()
			} else {
				evt.returnValue = false
			}
		}

		if (this.state === 'pan' && this.options.panEnabled) {
			var point = SvgUtils.getEventPoint(evt, this.svg).matrixTransform(this.firstEventCTM.inverse())
			, viewportCTM = this.firstEventCTM.translate(point.x - this.stateOrigin.x, point.y - this.stateOrigin.y)

			this.viewport.setCTM(viewportCTM)
		}
	}
	SvgPanZoom.prototype.handleMouseUp = function(evt) {
		if (this.options.preventMouseEventsDefault) {
			if (evt.preventDefault) {
				evt.preventDefault()
			} else {
				evt.returnValue = false
			}
		}

		if (this.state === 'pan') {
			this.state = 'none'
		}
	}
	SvgPanZoom.prototype.fit = function() {
		var viewBox = this.viewport.getViewBox()
		, newScale = Math.min(this.width/viewBox.width, this.height/viewBox.height)

		this.zoom(newScale, true)
	}
	SvgPanZoom.prototype.contain = function() {
		var viewBox = this.viewport.getViewBox()
		, newScale = Math.max(this.width/viewBox.width, this.height/viewBox.height)

		this.zoom(newScale, true)
	}
	SvgPanZoom.prototype.center = function() {
		var viewBox = this.viewport.getViewBox()
		, offsetX = (this.width - (viewBox.width + viewBox.x * 2) * this.getZoom()) * 0.5
		, offsetY = (this.height - (viewBox.height + viewBox.y * 2) * this.getZoom()) * 0.5

		this.getPublicInstance().pan({x: offsetX, y: offsetY})
	}
	SvgPanZoom.prototype.updateBBox = function() {
		this.viewport.simpleViewBoxCache()
	}
	SvgPanZoom.prototype.pan = function(point) {
		var viewportCTM = this.viewport.getCTM()
		viewportCTM.e = point.x
		viewportCTM.f = point.y
		this.viewport.setCTM(viewportCTM)
	}
	SvgPanZoom.prototype.panBy = function(point) {
		var viewportCTM = this.viewport.getCTM()
		viewportCTM.e += point.x
		viewportCTM.f += point.y
		this.viewport.setCTM(viewportCTM)
	}
	SvgPanZoom.prototype.getPan = function() {
		var state = this.viewport.getState()

		return {x: state.x, y: state.y}
	}
	SvgPanZoom.prototype.resize = function() {
		var boundingClientRectNormalized = SvgUtils.getBoundingClientRectNormalized(this.svg)
		this.width = boundingClientRectNormalized.width
		this.height = boundingClientRectNormalized.height
		var viewport = this.viewport
		viewport.options.width = this.width
		viewport.options.height = this.height
		viewport.processCTM()
		if (this.options.controlIconsEnabled) {
			this.getPublicInstance().disableControlIcons()
			this.getPublicInstance().enableControlIcons()
		}
	}
	SvgPanZoom.prototype.destroy = function() {
		var that = this
		this.beforeZoom = null
		this.onZoom = null
		this.beforePan = null
		this.onPan = null
		this.onUpdatedCTM = null
		if (this.options.customEventsHandler != null) { 
			this.options.customEventsHandler.destroy({
				svgElement: this.svg
				, eventsListenerElement: this.options.eventsListenerElement
				, instance: this.getPublicInstance()
			})
		}
		for (var event in this.eventListeners) {
			(this.options.eventsListenerElement || this.svg)
				.removeEventListener(event, this.eventListeners[event], !this.options.preventMouseEventsDefault ? passiveListenerOption : false)
		}
		this.disableMouseWheelZoom()
		this.getPublicInstance().disableControlIcons()
		this.reset()
		instancesStore = instancesStore.filter(function(instance){
			return instance.svg !== that.svg
		})
		delete this.options
		delete this.viewport
		delete this.publicInstance
		delete this.pi
		this.getPublicInstance = function(){
			return null
		}
	}
	SvgPanZoom.prototype.getPublicInstance = function() {
		var that = this
		if (!this.publicInstance) {
			this.publicInstance = this.pi = {
				enablePan: function() {that.options.panEnabled = true; return that.pi}
				, disablePan: function() {that.options.panEnabled = false; return that.pi}
				, isPanEnabled: function() {return !!that.options.panEnabled}
				, pan: function(point) {that.pan(point); return that.pi}
				, panBy: function(point) {that.panBy(point); return that.pi}
				, getPan: function() {return that.getPan()}
				, setBeforePan: function(fn) {that.options.beforePan = fn === null ? null : Utils.proxy(fn, that.publicInstance); return that.pi}
				, setOnPan: function(fn) {that.options.onPan = fn === null ? null : Utils.proxy(fn, that.publicInstance); return that.pi}
				, enableZoom: function() {that.options.zoomEnabled = true; return that.pi}
				, disableZoom: function() {that.options.zoomEnabled = false; return that.pi}
				, isZoomEnabled: function() {return !!that.options.zoomEnabled}
				, enableControlIcons: function() {
					if (!that.options.controlIconsEnabled) {
						that.options.controlIconsEnabled = true
						ControlIcons.enable(that)
					}
					return that.pi
				}
				, disableControlIcons: function() {
					if (that.options.controlIconsEnabled) {
						that.options.controlIconsEnabled = false;
						ControlIcons.disable(that)
					}
					return that.pi
				}
				, isControlIconsEnabled: function() {return !!that.options.controlIconsEnabled}
				, enableDblClickZoom: function() {that.options.dblClickZoomEnabled = true; return that.pi}
				, disableDblClickZoom: function() {that.options.dblClickZoomEnabled = false; return that.pi}
				, isDblClickZoomEnabled: function() {return !!that.options.dblClickZoomEnabled}
				, enableMouseWheelZoom: function() {that.enableMouseWheelZoom(); return that.pi}
				, disableMouseWheelZoom: function() {that.disableMouseWheelZoom(); return that.pi}
				, isMouseWheelZoomEnabled: function() {return !!that.options.mouseWheelZoomEnabled}
				, setZoomScaleSensitivity: function(scale) {that.options.zoomScaleSensitivity = scale; return that.pi}
				, setMinZoom: function(zoom) {that.options.minZoom = zoom; return that.pi}
				, setMaxZoom: function(zoom) {that.options.maxZoom = zoom; return that.pi}
				, setBeforeZoom: function(fn) {that.options.beforeZoom = fn === null ? null : Utils.proxy(fn, that.publicInstance); return that.pi}
				, setOnZoom: function(fn) {that.options.onZoom = fn === null ? null : Utils.proxy(fn, that.publicInstance); return that.pi}
				, zoom: function(scale) {that.publicZoom(scale, true); return that.pi}
				, zoomBy: function(scale) {that.publicZoom(scale, false); return that.pi}
				, zoomAtPoint: function(scale, point) {that.publicZoomAtPoint(scale, point, true); return that.pi}
				, zoomAtPointBy: function(scale, point) {that.publicZoomAtPoint(scale, point, false); return that.pi}
				, zoomIn: function() {this.zoomBy(1 + that.options.zoomScaleSensitivity); return that.pi}
				, zoomOut: function() {this.zoomBy(1 / (1 + that.options.zoomScaleSensitivity)); return that.pi}
				, getZoom: function() {return that.getRelativeZoom()}
				, setOnUpdatedCTM: function(fn) {that.options.onUpdatedCTM = fn === null ? null : Utils.proxy(fn, that.publicInstance); return that.pi}
				, resetZoom: function() {that.resetZoom(); return that.pi}
				, resetPan: function() {that.resetPan(); return that.pi}
				, reset: function() {that.reset(); return that.pi}
				, fit: function() {that.fit(); return that.pi}
				, contain: function() {that.contain(); return that.pi}
				, center: function() {that.center(); return that.pi}
				, updateBBox: function() {that.updateBBox(); return that.pi}
				, resize: function() {that.resize(); return that.pi}
				, getSizes: function() {
					return {
						width: that.width
						, height: that.height
						, realZoom: that.getZoom()
						, viewBox: that.viewport.getViewBox()
					}
				}
				, destroy: function() {that.destroy(); return that.pi}
			}
		}

		return this.publicInstance
	}
	var instancesStore = []

	var svgPanZoom = function(elementOrSelector, options){
		var svg = Utils.getSvg(elementOrSelector)

		if (svg === null) {
			return null
		} else {
			for(var i = instancesStore.length - 1; i >= 0; i--) {
				if (instancesStore[i].svg === svg) {
					return instancesStore[i].instance.getPublicInstance()
				}
			}
			instancesStore.push({
				svg: svg
				, instance: new SvgPanZoom(svg, options)
			})
			return instancesStore[instancesStore.length - 1].instance.getPublicInstance()
		}
	}

	module.exports = svgPanZoom;

},{"./control-icons":2,"./shadow-viewport":3,"./svg-utilities":5,"./uniwheel":6,"./utilities":7}],5:[function(require,module,exports){
	var Utils = require('./utilities')
	, _browser = 'unknown'
	;
	if (false || !!document.documentMode) { 
		_browser = 'ie';
	}

	module.exports = {
		svgNS:  'http://www.w3.org/2000/svg'
		, xmlNS:  'http://www.w3.org/XML/1998/namespace'
		, xmlnsNS:  'http://www.w3.org/2000/xmlns/'
		, xlinkNS:  'http://www.w3.org/1999/xlink'
		, evNS:  'http://www.w3.org/2001/xml-events'
		, getBoundingClientRectNormalized: function(svg) {
			if (svg.clientWidth && svg.clientHeight) {
				return {width: svg.clientWidth, height: svg.clientHeight}
			} else 
				if (!!svg.getBoundingClientRect()) {
					return svg.getBoundingClientRect();
				} else {
					throw new Error('Cannot get BoundingClientRect for SVG.');
				}
		}
		, getOrCreateViewport: function(svg, selector) {
			var viewport = null

			if (Utils.isElement(selector)) {
				viewport = selector
			} else {
				viewport = svg.querySelector(selector)
			}
			if (!viewport) {
				var childNodes = Array.prototype.slice.call(svg.childNodes || svg.children).filter(function(el){
					return el.nodeName !== 'defs' && el.nodeName !== '#text'
				})
				if (childNodes.length === 1 && childNodes[0].nodeName === 'g' && childNodes[0].getAttribute('transform') === null) {
					viewport = childNodes[0]
				}
			}
			if (!viewport) {
				var viewportId = 'viewport-' + new Date().toISOString().replace(/\D/g, '');
				viewport = document.createElementNS(this.svgNS, 'g');
				viewport.setAttribute('id', viewportId);
				var svgChildren = svg.childNodes || svg.children;
				if (!!svgChildren && svgChildren.length > 0) {
					for (var i = svgChildren.length; i > 0; i--) {
						if (svgChildren[svgChildren.length - i].nodeName !== 'defs') {
							viewport.appendChild(svgChildren[svgChildren.length - i]);
						}
					}
				}
				svg.appendChild(viewport);
			}
			var classNames = [];
			if (viewport.getAttribute('class')) {
				classNames = viewport.getAttribute('class').split(' ')
			}
			if (!~classNames.indexOf('svg-pan-zoom_viewport')) {
				classNames.push('svg-pan-zoom_viewport')
				viewport.setAttribute('class', classNames.join(' '))
			}

			return viewport
		}
		, setupSvgAttributes: function(svg) {
			svg.setAttribute('xmlns', this.svgNS);
			svg.setAttributeNS(this.xmlnsNS, 'xmlns:xlink', this.xlinkNS);
			svg.setAttributeNS(this.xmlnsNS, 'xmlns:ev', this.evNS);
			if (svg.parentNode !== null) {
				var style = svg.getAttribute('style') || '';
				if (style.toLowerCase().indexOf('overflow') === -1) {
					svg.setAttribute('style', 'overflow: hidden; ' + style);
				}
			}
		}
		, internetExplorerRedisplayInterval: 300
		, refreshDefsGlobal: Utils.throttle(function() {
			var allDefs = document.querySelectorAll('defs');
			var allDefsCount = allDefs.length;
			for (var i = 0; i < allDefsCount; i++) {
				var thisDefs = allDefs[i];
				thisDefs.parentNode.insertBefore(thisDefs, thisDefs);
			}
		}, this ? this.internetExplorerRedisplayInterval : null)
		, setCTM: function(element, matrix, defs) {
			var that = this
			, s = 'matrix(' + matrix.a + ',' + matrix.b + ',' + matrix.c + ',' + matrix.d + ',' + matrix.e + ',' + matrix.f + ')';

			element.setAttributeNS(null, 'transform', s);
			if ('transform' in element.style) {
				element.style.transform = s;
			} else if ('-ms-transform' in element.style) {
				element.style['-ms-transform'] = s;
			} else if ('-webkit-transform' in element.style) {
				element.style['-webkit-transform'] = s;
			}
			if (_browser === 'ie' && !!defs) {
				defs.parentNode.insertBefore(defs, defs);
				window.setTimeout(function() {
					that.refreshDefsGlobal();
				}, that.internetExplorerRedisplayInterval);
			}
		}
		, getEventPoint: function(evt, svg) {
			var point = svg.createSVGPoint()

			Utils.mouseAndTouchNormalize(evt, svg)

			point.x = evt.clientX
			point.y = evt.clientY

			return point
		}
		, getSvgCenterPoint: function(svg, width, height) {
			return this.createSVGPoint(svg, width / 2, height / 2)
		}
		, createSVGPoint: function(svg, x, y) {
			var point = svg.createSVGPoint()
			point.x = x
			point.y = y

			return point
		}
	}

},{"./utilities":7}],6:[function(require,module,exports){

	module.exports = (function(){

		var prefix = "", _addEventListener, _removeEventListener, support, fns = [];
		var passiveOption = {passive: true};
		if ( window.addEventListener ) {
			_addEventListener = "addEventListener";
			_removeEventListener = "removeEventListener";
		} else {
			_addEventListener = "attachEvent";
			_removeEventListener = "detachEvent";
			prefix = "on";
		}
		support = "onwheel" in document.createElement("div") ? "wheel" : 
		document.onmousewheel !== undefined ? "mousewheel" : 
		"DOMMouseScroll"; 


		function createCallback(element,callback) {

			var fn = function(originalEvent) {

				!originalEvent && ( originalEvent = window.event );
				var event = {
					originalEvent: originalEvent,
					target: originalEvent.target || originalEvent.srcElement,
					type: "wheel",
					deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
					deltaX: 0,
					delatZ: 0,
					preventDefault: function() {
						originalEvent.preventDefault ?
							originalEvent.preventDefault() :
						originalEvent.returnValue = false;
					}
				};
				if ( support == "mousewheel" ) {
					event.deltaY = - 1/40 * originalEvent.wheelDelta;
					originalEvent.wheelDeltaX && ( event.deltaX = - 1/40 * originalEvent.wheelDeltaX );
				} else {
					event.deltaY = originalEvent.detail;
				}
				return callback( event );

			};

			fns.push({
				element: element,
				fn: fn,
			});

			return fn;
		}

		function getCallback(element) {
			for (var i = 0; i < fns.length; i++) {
				if (fns[i].element === element) {
					return fns[i].fn;
				}
			}
			return function(){};
		}

		function removeCallback(element) {
			for (var i = 0; i < fns.length; i++) {
				if (fns[i].element === element) {
					return fns.splice(i,1);
				}
			}
		}

		function _addWheelListener(elem, eventName, callback, isPassiveListener ) {
			var cb;

			if (support === "wheel") {
				cb = callback;
			} else {
				cb = createCallback(elem, callback);
			}

			elem[_addEventListener](prefix + eventName, cb, isPassiveListener ? passiveOption : false);
		}

		function _removeWheelListener(elem, eventName, callback, isPassiveListener ) {

			var cb;

			if (support === "wheel") {
				cb = callback;
			} else {
				cb = getCallback(elem);
			}

			elem[_removeEventListener](prefix + eventName, cb, isPassiveListener ? passiveOption : false);

			removeCallback(elem);
		}

		function addWheelListener( elem, callback, isPassiveListener ) {
			_addWheelListener(elem, support, callback, isPassiveListener );
			if( support == "DOMMouseScroll" ) {
				_addWheelListener(elem, "MozMousePixelScroll", callback, isPassiveListener );
			}
		}

		function removeWheelListener(elem, callback, isPassiveListener){
			_removeWheelListener(elem, support, callback, isPassiveListener);
			if( support == "DOMMouseScroll" ) {
				_removeWheelListener(elem, "MozMousePixelScroll", callback, isPassiveListener);
			}
		}

		return {
			on: addWheelListener,
			off: removeWheelListener
		};

	})();

},{}],7:[function(require,module,exports){
	module.exports = {
		extend: function(target, source) {
			target = target || {};
			for (var prop in source) {
				if (this.isObject(source[prop])) {
					target[prop] = this.extend(target[prop], source[prop])
				} else {
					target[prop] = source[prop]
				}
			}
			return target;
		}
		, isElement: function(o){
			return (
				o instanceof HTMLElement || o instanceof SVGElement || o instanceof SVGSVGElement || 
				(o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string')
			);
		}
		, isObject: function(o){
			return Object.prototype.toString.call(o) === '[object Object]';
		}
		, isNumber: function(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		}
		, getSvg: function(elementOrSelector) {
			var element
			, svg;

			if (!this.isElement(elementOrSelector)) {
				if (typeof elementOrSelector === 'string' || elementOrSelector instanceof String) {
					element = document.querySelector(elementOrSelector)

					if (!element) {
						throw new Error('Provided selector did not find any elements. Selector: ' + elementOrSelector)
						return null
					}
				} else {
					throw new Error('Provided selector is not an HTML object nor String')
					return null
				}
			} else {
				element = elementOrSelector
			}

			if (element.tagName.toLowerCase() === 'svg') {
				svg = element;
			} else {
				if (element.tagName.toLowerCase() === 'object') {
					svg = element.contentDocument.documentElement;
				} else {
					if (element.tagName.toLowerCase() === 'embed') {
						svg = element.getSVGDocument().documentElement;
					} else {
						if (element.tagName.toLowerCase() === 'img') {
							throw new Error('Cannot script an SVG in an "img" element. Please use an "object" element or an in-line SVG.');
						} else {
							throw new Error('Cannot get SVG.');
						}
						return null
					}
				}
			}

			return svg
		}
		, proxy: function(fn, context) {
			return function() {
				return fn.apply(context, arguments)
			}
		}
		, getType: function(o) {
			return Object.prototype.toString.apply(o).replace(/^\[object\s/, '').replace(/\]$/, '')
		}
		, mouseAndTouchNormalize: function(evt, svg) {
			if (evt.clientX === void 0 || evt.clientX === null) {
				evt.clientX = 0
				evt.clientY = 0
				if (evt.touches !== void 0 && evt.touches.length) {
					if (evt.touches[0].clientX !== void 0) {
						evt.clientX = evt.touches[0].clientX
						evt.clientY = evt.touches[0].clientY
					} else if (evt.touches[0].pageX !== void 0) {
						var rect = svg.getBoundingClientRect();

						evt.clientX = evt.touches[0].pageX - rect.left
						evt.clientY = evt.touches[0].pageY - rect.top
					}
				} else if (evt.originalEvent !== void 0) {
					if (evt.originalEvent.clientX !== void 0) {
						evt.clientX = evt.originalEvent.clientX
						evt.clientY = evt.originalEvent.clientY
					}
				}
			}
		}
		, isDblClick: function(evt, prevEvt) {
			if (evt.detail === 2) {
				return true;
			}
			else if (prevEvt !== void 0 && prevEvt !== null) {
				var timeStampDiff = evt.timeStamp - prevEvt.timeStamp 
				, touchesDistance = Math.sqrt(Math.pow(evt.clientX - prevEvt.clientX, 2) + Math.pow(evt.clientY - prevEvt.clientY, 2))

				return timeStampDiff < 250 && touchesDistance < 10
			}
			return false;
		}
		, now: Date.now || function() {
			return new Date().getTime();
		}
		, throttle: function(func, wait, options) {
			var that = this;
			var context, args, result;
			var timeout = null;
			var previous = 0;
			if (!options) options = {};
			var later = function() {
				previous = options.leading === false ? 0 : that.now();
				timeout = null;
				result = func.apply(context, args);
				if (!timeout) context = args = null;
			};
			return function() {
				var now = that.now();
				if (!previous && options.leading === false) previous = now;
				var remaining = wait - (now - previous);
				context = this;
				args = arguments;
				if (remaining <= 0 || remaining > wait) {
					clearTimeout(timeout);
					timeout = null;
					previous = now;
					result = func.apply(context, args);
					if (!timeout) context = args = null;
				} else if (!timeout && options.trailing !== false) {
					timeout = setTimeout(later, remaining);
				}
				return result;
			};
		}
		, createRequestAnimationFrame: function(refreshRate) {
			var timeout = null
			if (refreshRate !== 'auto' && refreshRate < 60 && refreshRate > 1) {
				timeout = Math.floor(1000 / refreshRate)
			}

			if (timeout === null) {
				return window.requestAnimationFrame || requestTimeout(33)
			} else {
				return requestTimeout(timeout)
			}
		}
	}
	function requestTimeout(timeout) {
		return function(callback) {
			window.setTimeout(callback, timeout)
		}
	}

},{}]},{},[1]);