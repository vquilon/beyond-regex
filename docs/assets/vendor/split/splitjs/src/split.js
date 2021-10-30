const global = typeof window !== 'undefined' ? window : null
const ssr = global === null
const document = !ssr ? global.document : undefined
const addEventListener = 'addEventListener'
const removeEventListener = 'removeEventListener'
const getBoundingClientRect = 'getBoundingClientRect'
const gutterStartDragging = '_a'
const aGutterSize = '_b'
const bGutterSize = '_c'
const HORIZONTAL = 'horizontal'
const NOOP = () => false
const calc = ssr
    ? 'calc'
    : `${['', '-webkit-', '-moz-', '-o-']
          .filter(prefix => {
              const el = document.createElement('div')
              el.style.cssText = `width:${prefix}calc(9px)`

              return !!el.style.length
          })
          .shift()}calc`
const isString = v => typeof v === 'string' || v instanceof String
const elementOrSelector = el => {
    if (isString(el)) {
        const ele = document.querySelector(el)
        if (!ele) {
            throw new Error(`Selector ${el} did not match a DOM element`)
        }
        return ele
    }

    return el
}
const getOption = (options, propName, def) => {
    const value = options[propName]
    if (value !== undefined) {
        return value
    }
    return def
}

const getGutterSize = (gutterSize, isFirst, isLast, gutterAlign) => {
    if (isFirst) {
        if (gutterAlign === 'end') {
            return 0
        }
        if (gutterAlign === 'center') {
            return gutterSize / 2
        }
    } else if (isLast) {
        if (gutterAlign === 'start') {
            return 0
        }
        if (gutterAlign === 'center') {
            return gutterSize / 2
        }
    }

    return gutterSize
}
const defaultGutterFn = (i, gutterDirection) => {
    const gut = document.createElement('div')
    gut.className = `gutter gutter-${gutterDirection}`
    return gut
}

const defaultElementStyleFn = (dim, size, gutSize) => {
    const style = {}

    if (!isString(size)) {
        style[dim] = `${calc}(${size}% - ${gutSize}px)`
    } else {
        style[dim] = size
    }

    return style
}

const defaultGutterStyleFn = (dim, gutSize) => ({ [dim]: `${gutSize}px` })
const Split = (idsOption, options = {}) => {
    if (ssr) return {}

    let ids = idsOption
    let dimension
    let clientAxis
    let position
    let positionEnd
    let clientSize
    let elements
    if (Array.from) {
        ids = Array.from(ids)
    }
    const firstElement = elementOrSelector(ids[0])
    const parent = firstElement.parentNode
    const parentStyle = getComputedStyle ? getComputedStyle(parent) : null
    const parentFlexDirection = parentStyle ? parentStyle.flexDirection : null
    let sizes = getOption(options, 'sizes') || ids.map(() => 100 / ids.length)
    const minSize = getOption(options, 'minSize', 100)
    const minSizes = Array.isArray(minSize) ? minSize : ids.map(() => minSize)
    const maxSize = getOption(options, 'maxSize', Infinity)
    const maxSizes = Array.isArray(maxSize) ? maxSize : ids.map(() => maxSize)
    const expandToMin = getOption(options, 'expandToMin', false)
    const gutterSize = getOption(options, 'gutterSize', 10)
    const gutterAlign = getOption(options, 'gutterAlign', 'center')
    const snapOffset = getOption(options, 'snapOffset', 30)
    const dragInterval = getOption(options, 'dragInterval', 1)
    const direction = getOption(options, 'direction', HORIZONTAL)
    const cursor = getOption(
        options,
        'cursor',
        direction === HORIZONTAL ? 'col-resize' : 'row-resize',
    )
    const gutter = getOption(options, 'gutter', defaultGutterFn)
    const elementStyle = getOption(
        options,
        'elementStyle',
        defaultElementStyleFn,
    )
    const gutterStyle = getOption(options, 'gutterStyle', defaultGutterStyleFn)
    if (direction === HORIZONTAL) {
        dimension = 'width'
        clientAxis = 'clientX'
        position = 'left'
        positionEnd = 'right'
        clientSize = 'clientWidth'
    } else if (direction === 'vertical') {
        dimension = 'height'
        clientAxis = 'clientY'
        position = 'top'
        positionEnd = 'bottom'
        clientSize = 'clientHeight'
    }

    function setElementSize(el, size, gutSize, i) {
        const style = elementStyle(dimension, size, gutSize, i)

        Object.keys(style).forEach(prop => {
            el.style[prop] = style[prop]
        })
    }

    function setGutterSize(gutterElement, gutSize, i) {
        const style = gutterStyle(dimension, gutSize, i)

        Object.keys(style).forEach(prop => {
            gutterElement.style[prop] = style[prop]
        })
    }

    function getSizes() {
        return elements.map(element => element.size)
    }
    function getMousePosition(e) {
        if ('touches' in e) return e.touches[0][clientAxis]
        return e[clientAxis]
    }
    function adjust(offset) {
        const a = elements[this.a]
        const b = elements[this.b]
        const percentage = a.size + b.size

        a.size = (offset / this.size) * percentage
        b.size = percentage - (offset / this.size) * percentage

        setElementSize(a.element, a.size, this[aGutterSize], a.i)
        setElementSize(b.element, b.size, this[bGutterSize], b.i)
    }
    function drag(e) {
        let offset
        const a = elements[this.a]
        const b = elements[this.b]

        if (!this.dragging) return
        offset =
            getMousePosition(e) -
            this.start +
            (this[aGutterSize] - this.dragOffset)

        if (dragInterval > 1) {
            offset = Math.round(offset / dragInterval) * dragInterval
        }
        if (offset <= a.minSize + snapOffset + this[aGutterSize]) {
            offset = a.minSize + this[aGutterSize]
        } else if (
            offset >=
            this.size - (b.minSize + snapOffset + this[bGutterSize])
        ) {
            offset = this.size - (b.minSize + this[bGutterSize])
        }

        if (offset >= a.maxSize - snapOffset + this[aGutterSize]) {
            offset = a.maxSize + this[aGutterSize]
        } else if (
            offset <=
            this.size - (b.maxSize - snapOffset + this[bGutterSize])
        ) {
            offset = this.size - (b.maxSize + this[bGutterSize])
        }
        adjust.call(this, offset)
        getOption(options, 'onDrag', NOOP)(getSizes())
    }
    function calculateSizes() {
        const a = elements[this.a].element
        const b = elements[this.b].element

        const aBounds = a[getBoundingClientRect]()
        const bBounds = b[getBoundingClientRect]()

        this.size =
            aBounds[dimension] +
            bBounds[dimension] +
            this[aGutterSize] +
            this[bGutterSize]
        this.start = aBounds[position]
        this.end = aBounds[positionEnd]
    }

    function innerSize(element) {
        if (!getComputedStyle) return null

        const computedStyle = getComputedStyle(element)

        if (!computedStyle) return null

        let size = element[clientSize]

        if (size === 0) return null

        if (direction === HORIZONTAL) {
            size -=
                parseFloat(computedStyle.paddingLeft) +
                parseFloat(computedStyle.paddingRight)
        } else {
            size -=
                parseFloat(computedStyle.paddingTop) +
                parseFloat(computedStyle.paddingBottom)
        }

        return size
    }
    function trimToMin(sizesToTrim) {
        const parentSize = innerSize(parent)
        if (parentSize === null) {
            return sizesToTrim
        }

        if (minSizes.reduce((a, b) => a + b, 0) > parentSize) {
            return sizesToTrim
        }
        let excessPixels = 0
        const toSpare = []

        const pixelSizes = sizesToTrim.map((size, i) => {
            const pixelSize = (parentSize * size) / 100
            const elementGutterSize = getGutterSize(
                gutterSize,
                i === 0,
                i === sizesToTrim.length - 1,
                gutterAlign,
            )
            const elementMinSize = minSizes[i] + elementGutterSize
            if (pixelSize < elementMinSize) {
                excessPixels += elementMinSize - pixelSize
                toSpare.push(0)
                return elementMinSize
            }
            toSpare.push(pixelSize - elementMinSize)
            return pixelSize
        })
        if (excessPixels === 0) {
            return sizesToTrim
        }

        return pixelSizes.map((pixelSize, i) => {
            let newPixelSize = pixelSize
            if (excessPixels > 0 && toSpare[i] - excessPixels > 0) {
                const takenPixels = Math.min(
                    excessPixels,
                    toSpare[i] - excessPixels,
                )
                excessPixels -= takenPixels
                newPixelSize = pixelSize - takenPixels
            }
            return (newPixelSize / parentSize) * 100
        })
    }
    function stopDragging() {
        const self = this
        const a = elements[self.a].element
        const b = elements[self.b].element

        if (self.dragging) {
            getOption(options, 'onDragEnd', NOOP)(getSizes())
        }

        self.dragging = false
        global[removeEventListener]('mouseup', self.stop)
        global[removeEventListener]('touchend', self.stop)
        global[removeEventListener]('touchcancel', self.stop)
        global[removeEventListener]('mousemove', self.move)
        global[removeEventListener]('touchmove', self.move)
        self.stop = null
        self.move = null

        a[removeEventListener]('selectstart', NOOP)
        a[removeEventListener]('dragstart', NOOP)
        b[removeEventListener]('selectstart', NOOP)
        b[removeEventListener]('dragstart', NOOP)

        a.style.userSelect = ''
        a.style.webkitUserSelect = ''
        a.style.MozUserSelect = ''
        a.style.pointerEvents = ''

        b.style.userSelect = ''
        b.style.webkitUserSelect = ''
        b.style.MozUserSelect = ''
        b.style.pointerEvents = ''

        self.gutter.style.cursor = ''
        self.parent.style.cursor = ''
        document.body.style.cursor = ''
    }
    function startDragging(e) {
        if ('button' in e && e.button !== 0) {
            return
        }
        const self = this
        const a = elements[self.a].element
        const b = elements[self.b].element
        if (!self.dragging) {
            getOption(options, 'onDragStart', NOOP)(getSizes())
        }
        e.preventDefault()
        self.dragging = true
        self.move = drag.bind(self)
        self.stop = stopDragging.bind(self)
        global[addEventListener]('mouseup', self.stop)
        global[addEventListener]('touchend', self.stop)
        global[addEventListener]('touchcancel', self.stop)
        global[addEventListener]('mousemove', self.move)
        global[addEventListener]('touchmove', self.move)
        a[addEventListener]('selectstart', NOOP)
        a[addEventListener]('dragstart', NOOP)
        b[addEventListener]('selectstart', NOOP)
        b[addEventListener]('dragstart', NOOP)

        a.style.userSelect = 'none'
        a.style.webkitUserSelect = 'none'
        a.style.MozUserSelect = 'none'
        a.style.pointerEvents = 'none'

        b.style.userSelect = 'none'
        b.style.webkitUserSelect = 'none'
        b.style.MozUserSelect = 'none'
        b.style.pointerEvents = 'none'
        self.gutter.style.cursor = cursor
        self.parent.style.cursor = cursor
        document.body.style.cursor = cursor
        calculateSizes.call(self)
        self.dragOffset = getMousePosition(e) - self.end
    }
    sizes = trimToMin(sizes)
    const pairs = []
    elements = ids.map((id, i) => {
        const element = {
            element: elementOrSelector(id),
            size: sizes[i],
            minSize: minSizes[i],
            maxSize: maxSizes[i],
            i,
        }

        let pair

        if (i > 0) {
            pair = {
                a: i - 1,
                b: i,
                dragging: false,
                direction,
                parent,
            }

            pair[aGutterSize] = getGutterSize(
                gutterSize,
                i - 1 === 0,
                false,
                gutterAlign,
            )
            pair[bGutterSize] = getGutterSize(
                gutterSize,
                false,
                i === ids.length - 1,
                gutterAlign,
            )
            if (
                parentFlexDirection === 'row-reverse' ||
                parentFlexDirection === 'column-reverse'
            ) {
                const temp = pair.a
                pair.a = pair.b
                pair.b = temp
            }
        }
        if (i > 0) {
            const gutterElement = gutter(i, direction, element.element)
            setGutterSize(gutterElement, gutterSize, i)
            pair[gutterStartDragging] = startDragging.bind(pair)
            gutterElement[addEventListener](
                'mousedown',
                pair[gutterStartDragging],
            )
            gutterElement[addEventListener](
                'touchstart',
                pair[gutterStartDragging],
            )

            parent.insertBefore(gutterElement, element.element)

            pair.gutter = gutterElement
        }

        setElementSize(
            element.element,
            element.size,
            getGutterSize(
                gutterSize,
                i === 0,
                i === ids.length - 1,
                gutterAlign,
            ),
            i,
        )
        if (i > 0) {
            pairs.push(pair)
        }

        return element
    })

    function adjustToMin(element) {
        const isLast = element.i === pairs.length
        const pair = isLast ? pairs[element.i - 1] : pairs[element.i]

        calculateSizes.call(pair)

        const size = isLast
            ? pair.size - element.minSize - pair[bGutterSize]
            : element.minSize + pair[aGutterSize]

        adjust.call(pair, size)
    }

    elements.forEach(element => {
        const computedSize = element.element[getBoundingClientRect]()[dimension]

        if (computedSize < element.minSize) {
            if (expandToMin) {
                adjustToMin(element)
            } else {
                element.minSize = computedSize
            }
        }
    })

    function setSizes(newSizes) {
        const trimmed = trimToMin(newSizes)
        trimmed.forEach((newSize, i) => {
            if (i > 0) {
                const pair = pairs[i - 1]

                const a = elements[pair.a]
                const b = elements[pair.b]

                a.size = trimmed[i - 1]
                b.size = newSize

                setElementSize(a.element, a.size, pair[aGutterSize], a.i)
                setElementSize(b.element, b.size, pair[bGutterSize], b.i)
            }
        })
    }

    function destroy(preserveStyles, preserveGutter) {
        pairs.forEach(pair => {
            if (preserveGutter !== true) {
                pair.parent.removeChild(pair.gutter)
            } else {
                pair.gutter[removeEventListener](
                    'mousedown',
                    pair[gutterStartDragging],
                )
                pair.gutter[removeEventListener](
                    'touchstart',
                    pair[gutterStartDragging],
                )
            }

            if (preserveStyles !== true) {
                const style = elementStyle(
                    dimension,
                    pair.a.size,
                    pair[aGutterSize],
                )

                Object.keys(style).forEach(prop => {
                    elements[pair.a].element.style[prop] = ''
                    elements[pair.b].element.style[prop] = ''
                })
            }
        })
    }

    return {
        setSizes,
        getSizes,
        collapse(i) {
            adjustToMin(elements[i])
        },
        destroy,
        parent,
        pairs,
    }
}

export default Split
