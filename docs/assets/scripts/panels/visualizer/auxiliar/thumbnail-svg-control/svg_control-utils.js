let Utils = {
    /**
   * Extends an object
   *
   * @param  {Object} target object to extend
   * @param  {Object} source object to take properties from
   * @return {Object}        extended object
   */
    extend: function (target, source) {
        target = target || {};
        for (var prop in source) {
            // Go recursively
            if (this.isObject(source[prop])) {
                target[prop] = this.extend(target[prop], source[prop])
            } else {
                target[prop] = source[prop]
            }
        }
        return target;
    }

    /**
   * Checks if an object is a DOM element
   *
   * @param  {Object}  o HTML element or String
   * @return {Boolean}   returns true if object is a DOM element
   */
    , isElement: function (o) {
        return (
            o instanceof HTMLElement || o instanceof SVGElement || o instanceof SVGSVGElement || //DOM2
            (o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string')
        );
    }

    /**
    * Checks if an object is an Object
    *
    * @param  {Object}  o Object
    * @return {Boolean}   returns true if object is an Object
    */
    , isObject: function (o) {
        return Object.prototype.toString.call(o) === '[object Object]';
    }

    /**
    * Checks if variable is Number
    *
    * @param  {Integer|Float}  n
    * @return {Boolean}   returns true if variable is Number
    */
    , isNumber: function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    /**
    * Search for an SVG element
    *
    * @param  {Object|String} elementOrSelector DOM Element or selector String
    * @return {Object|Null}                   SVG or null
    */
    , getSvg: function (elementOrSelector) {
        var element
            , svg;

        if (!this.isElement(elementOrSelector)) {
            // If selector provided
            if (typeof elementOrSelector === 'string' || elementOrSelector instanceof String) {
                // Try to find the element
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

    /**
    * Attach a given context to a function
    * @param  {Function} fn      Function
    * @param  {Object}   context Context
    * @return {Function}           Function with certain context
    */
    , proxy: function (fn, context) {
        return function () {
            return fn.apply(context, arguments)
        }
    }

    /**
    * Returns object type
    * Uses toString that returns [object SVGPoint]
    * And than parses object type from string
    *
    * @param  {Object} o Any object
    * @return {String}   Object type
    */
    , getType: function (o) {
        return Object.prototype.toString.apply(o).replace(/^\[object\s/, '').replace(/\]$/, '')
    }

    /**
    * If it is a touch event than add clientX and clientY to event object
    *
    * @param  {Event} evt
    * @param  {SVGSVGElement} svg
    */
    , mouseAndTouchNormalize: function (evt, svg) {
        // If no clientX then fallback
        if (evt.clientX === void 0 || evt.clientX === null) {
            // Fallback
            evt.clientX = 0
            evt.clientY = 0

            // If it is a touch event
            if (evt.touches !== void 0 && evt.touches.length) {
                if (evt.touches[0].clientX !== void 0) {
                    evt.clientX = evt.touches[0].clientX
                    evt.clientY = evt.touches[0].clientY
                } else if (evt.touches[0].pageX !== void 0) {
                    var rect = svg.getBoundingClientRect();

                    evt.clientX = evt.touches[0].pageX - rect.left
                    evt.clientY = evt.touches[0].pageY - rect.top
                }
                // If it is a custom event
            } else if (evt.originalEvent !== void 0) {
                if (evt.originalEvent.clientX !== void 0) {
                    evt.clientX = evt.originalEvent.clientX
                    evt.clientY = evt.originalEvent.clientY
                }
            }
        }
    }

    /**
    * Check if an event is a double click/tap
    * TODO: For touch gestures use a library (hammer.js) that takes in account other events
    * (touchmove and touchend). It should take in account tap duration and traveled distance
    *
    * @param  {Event}  evt
    * @param  {Event}  prevEvt Previous Event
    * @return {Boolean}
    */
    , isDblClick: function (evt, prevEvt) {
        // Double click detected by browser
        if (evt.detail === 2) {
            return true;
        }
        // Try to compare events
        else if (prevEvt !== void 0 && prevEvt !== null) {
            var timeStampDiff = evt.timeStamp - prevEvt.timeStamp // should be lower than 250 ms
                , touchesDistance = Math.sqrt(Math.pow(evt.clientX - prevEvt.clientX, 2) + Math.pow(evt.clientY - prevEvt.clientY, 2))

            return timeStampDiff < 250 && touchesDistance < 10
        }

        // Nothing found
        return false;
    }

    /**
    * Returns current timestamp as an integer
    *
    * @return {Number}
    */
    , now: Date.now || function () {
        return new Date().getTime();
    }

    // From underscore.
    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time. Normally, the throttled function will run
    // as much as it can, without ever going more than once per `wait` duration;
    // but if you'd like to disable the execution on the leading edge, pass
    // `{leading: false}`. To disable execution on the trailing edge, ditto.
    // jscs:disable
    // jshint ignore:start
    , throttle: function (func, wait, options) {
        var that = this;
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) options = {};
        var later = function () {
            previous = options.leading === false ? 0 : that.now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
        return function () {
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
    // jshint ignore:end
    // jscs:enable

    /**
    * Create a requestAnimationFrame simulation
    *
    * @param  {Number|String} refreshRate
    * @return {Function}
    */
    , createRequestAnimationFrame: function (refreshRate) {
        var timeout = null

        // Convert refreshRate to timeout
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

/**
* Create a callback that will execute after a given timeout
*
* @param  {Function} timeout
* @return {Function}
*/
function requestTimeout(timeout) {
    return function (callback) {
        window.setTimeout(callback, timeout)
    }
}

let _browser = "unknown";
// http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
if (/*@cc_on!@*/false || !!document.documentMode) { // internet explorer
    _browser = 'ie';
}
let SVGUtils = {
    svgNS: 'http://www.w3.org/2000/svg',
    xmlNS: 'http://www.w3.org/XML/1998/namespace',
    xmlnsNS: 'http://www.w3.org/2000/xmlns/',
    xlinkNS: 'http://www.w3.org/1999/xlink',
    evNS: 'http://www.w3.org/2001/xml-events',

    /**
    * Get svg dimensions: width and height
    *
    * @param  {SVGSVGElement} svg
    * @return {Object}     {width: 0, height: 0}
    */
    getBoundingClientRectNormalized: function (svg) {
        if (svg.clientWidth && svg.clientHeight) {
            return { width: svg.clientWidth, height: svg.clientHeight }
        } else
            if (!!svg.getBoundingClientRect()) {
                return svg.getBoundingClientRect();
            } else {
                throw new Error('Cannot get BoundingClientRect for SVG.');
            }
    },

    /**
    * Gets g element with class of "viewport" or creates it if it doesn't exist
    *
    * @param  {SVGSVGElement} svg
    * @return {SVGElement}     g (group) element
    */
    getOrCreateViewport: function (svg, selector) {
        var viewport = null

        if (Utils.isElement(selector)) {
            viewport = selector
        } else {
            viewport = svg.querySelector(selector)
        }

        // Check if there is just one main group in SVG
        if (!viewport) {
            var childNodes = Array.prototype.slice.call(svg.childNodes || svg.children).filter(function (el) {
                return el.nodeName !== 'defs' && el.nodeName !== '#text'
            })

            // Node name should be SVGGElement and should have no transform attribute
            // Groups with transform are not used as viewport because it involves parsing of all transform possibilities
            if (childNodes.length === 1 && childNodes[0].nodeName === 'g' && childNodes[0].getAttribute('transform') === null) {
                viewport = childNodes[0]
            }
        }

        // If no favorable group element exists then create one
        if (!viewport) {
            var viewportId = 'viewport-' + new Date().toISOString().replace(/\D/g, '');
            viewport = document.createElementNS(this.svgNS, 'g');
            viewport.setAttribute('id', viewportId);

            // Internet Explorer (all versions?) can't use childNodes, but other browsers prefer (require?) using childNodes
            var svgChildren = svg.childNodes || svg.children;
            if (!!svgChildren && svgChildren.length > 0) {
                for (var i = svgChildren.length; i > 0; i--) {
                    // Move everything into viewport except defs
                    if (svgChildren[svgChildren.length - i].nodeName !== 'defs') {
                        viewport.appendChild(svgChildren[svgChildren.length - i]);
                    }
                }
            }
            svg.appendChild(viewport);
        }

        // Parse class names
        var classNames = [];
        if (viewport.getAttribute('class')) {
            classNames = viewport.getAttribute('class').split(' ')
        }

        // Set class (if not set already)
        if (!~classNames.indexOf('svg-pan-zoom_viewport')) {
            classNames.push('svg-pan-zoom_viewport')
            viewport.setAttribute('class', classNames.join(' '))
        }

        return viewport
    },

    /**
    * Set SVG attributes
    *
    * @param  {SVGSVGElement} svg
    */
    setupSvgAttributes: function (svg) {
        // Setting default attributes
        svg.setAttribute('xmlns', this.svgNS);
        svg.setAttributeNS(this.xmlnsNS, 'xmlns:xlink', this.xlinkNS);
        svg.setAttributeNS(this.xmlnsNS, 'xmlns:ev', this.evNS);

        // Needed for Internet Explorer, otherwise the viewport overflows
        if (svg.parentNode !== null) {
            var style = svg.getAttribute('style') || '';
            if (style.toLowerCase().indexOf('overflow') === -1) {
                svg.setAttribute('style', 'overflow: hidden; ' + style);
            }
        }
    },

    /**
    * How long Internet Explorer takes to finish updating its display (ms).
    */
    internetExplorerRedisplayInterval: 300,

    /**
* Forces the browser to redisplay all SVG elements that rely on an
* element defined in a 'defs' section. It works globally, for every
* available defs element on the page.
* The throttling is intentionally global.
*
* This is only needed for IE. It is as a hack to make markers (and 'use' elements?)
* visible after pan/zoom when there are multiple SVGs on the page.
* See bug report: https://connect.microsoft.com/IE/feedback/details/781964/
* also see svg-pan-zoom issue: https://github.com/ariutta/svg-pan-zoom/issues/62
*/
    refreshDefsGlobal: Utils.throttle(function () {
        var allDefs = document.querySelectorAll('defs');
        var allDefsCount = allDefs.length;
        for (var i = 0; i < allDefsCount; i++) {
            var thisDefs = allDefs[i];
            thisDefs.parentNode.insertBefore(thisDefs, thisDefs);
        }
    }, this ? this.internetExplorerRedisplayInterval : null),

    /**
* Sets the current transform matrix of an element
*
* @param {SVGElement} element
* @param {SVGMatrix} matrix  CTM
* @param {SVGElement} defs
*/
    setCTM: function (element, matrix, defs) {
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

        // IE has a bug that makes markers disappear on zoom (when the matrix "a" and/or "d" elements change)
        // see http://stackoverflow.com/questions/17654578/svg-marker-does-not-work-in-ie9-10
        // and http://srndolha.wordpress.com/2013/11/25/svg-line-markers-may-disappear-in-internet-explorer-11/

        if (_browser === 'ie' && !!defs) {
            // this refresh is intended for redisplaying the SVG during zooming
            defs.parentNode.insertBefore(defs, defs);
            // this refresh is intended for redisplaying the other SVGs on a page when panning a given SVG
            // it is also needed for the given SVG itself, on zoomEnd, if the SVG contains any markers that
            // are located under any other element(s).
            window.setTimeout(function () {
                that.refreshDefsGlobal();
            }, that.internetExplorerRedisplayInterval);
        }
    },

    /**
    * Instantiate an SVGPoint object with given event coordinates
    *
    * @param {Event} evt
    * @param  {SVGSVGElement} svg
    * @return {SVGPoint}     point
    */
    getEventPoint: function (evt, svg) {
        var point = svg.createSVGPoint()

        Utils.mouseAndTouchNormalize(evt, svg)

        point.x = evt.clientX
        point.y = evt.clientY

        return point
    },

    /**
    * Get SVG center point
    *
    * @param  {SVGSVGElement} svg
    * @return {SVGPoint}
    */
    getSvgCenterPoint: function (svg, width, height) {
        return this.createSVGPoint(svg, width / 2, height / 2)
    },

    /**
    * Create a SVGPoint with given x and y
    *
    * @param  {SVGSVGElement} svg
    * @param  {Number} x
    * @param  {Number} y
    * @return {SVGPoint}
    */
    createSVGPoint: function (svg, x, y) {
        var point = svg.createSVGPoint()
        point.x = x
        point.y = y

        return point
    },
};

// export { Utils, SVGUtils };
