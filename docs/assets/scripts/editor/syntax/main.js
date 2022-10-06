function EditorSyntaxis(options = {}) {
    // Tendra claves como la fecha 
    let editorHistory = [{"date": Date.now(), "zActions": 1, "name": "init"}];
    let actualHist = 0;


    let $containerEditor = options.$containerEditor;
    let $inputCarets = $containerEditor.querySelector(".input-carets");
    let $inputSelections = $containerEditor.querySelector(".input-selects");
    let $editor = options.$inputRegex;
    let $syntax = options.$syntaxRegex;
    let $input = $inputCarets.parentElement;
    let $editorInput = $containerEditor.querySelector("#editor-input");
    let synxtaxHighlighter = RegexHighlighter($editor, $syntax);
    let debug = false;
    let $debugCont = undefined;
    if (options.hasOwnProperty('debugInputClass')) {
        debug = true;
        $debugCont = document.createElement("div");
        $debugCont.classList.add(options.debugInputClass);
        $input.appendChild($debugCont);
    }

    let widthCharMap = {};

    // Catch Listeners
    const init_listeners = () => {
        const pauseCaretsBlink = () => {
            if ($inputCarets.timeoutBlink) {
                clearTimeout($inputCarets.timeoutBlink);
            }
            $inputCarets.classList.remove("blink");
            
            $inputCarets.timeoutBlink = window.setTimeout(() => {
                $inputCarets.classList.add("blink");
            }, 500);
        }
        const skipCaretsBlink = () => {
            $inputCarets.classList.remove("blink");
            
            $inputCarets.timeoutBlink = window.setTimeout(() => {
                $inputCarets.classList.add("blink");
            }, 500);
        }
        const disableCaretsBlink = () => {
            if ($inputCarets.timeoutBlink) {
                clearTimeout($inputCarets.timeoutBlink);
            }
            $inputCarets.classList.remove("blink");
        }
        const enableCaretsBlink = () => {
            $inputCarets.classList.add("blink");
            if ($inputCarets.timeoutBlink) {
                clearTimeout($inputCarets.timeoutBlink);
            }
        }

        const getTextNodeRelPos = (caretOffset, $parent) => {
            if ($parent.nodeType === 3) return [$parent, caretOffset];
            let textNodes = $parent.childNodes;
            let offsetStart = 0;
            let offsetEnd = 0;
            let tNode = undefined;
            for (let tIndex = 0; tIndex < textNodes.length; tIndex++) {
                tNode = textNodes[tIndex];
                offsetEnd += tNode.textContent.length;
                if (caretOffset <= offsetEnd) {
                    if (caretOffset - offsetStart > tNode.childNodes.length) {
                        return getTextNodeRelPos(caretOffset-offsetStart, tNode);
                    }
                    break
                }
                offsetStart += tNode.textContent.length;
            }
            return [tNode, caretOffset - offsetStart];
        }
        
        const getCaretParentIndex = ($element) => {
            let prePosition = 0;
            let postPosition = 0;
            let backward = false;
    
            if ($element.nodeName === "TEXTAREA") {
                prePosition = $element.selectionStart;
                postPosition = $element.selectionEnd;
                backward = $element.selectionDirection === "backward";
            }
            else {
                const isSupported = typeof window.getSelection !== "undefined";
                if (isSupported) {
                    const selection = window.getSelection();
                    // Check if there is a selection (i.e. cursor in place)
                    if (selection.rangeCount !== 0) {
                        let position = selection.anchorNode.compareDocumentPosition(selection.focusNode);
                        backward = false;
                        // position == 0 if nodes are the same
                        if (!position && selection.anchorOffset > selection.focusOffset ||
                            position === Node.DOCUMENT_POSITION_PRECEDING)
                            backward = true;
    
                        // Store the original range
                        const range = selection.getRangeAt(0);
    
                        // Clone the range
                        const preCaretRange = range.cloneRange();
                        // Select all textual contents from the contenteditable element
                        preCaretRange.selectNodeContents($element);
                        // And set the range end to the original clicked position
                        preCaretRange.setEnd(range.startContainer, range.startOffset);
                        // Return the text length from contenteditable start to the range end
                        prePosition = preCaretRange.toString().length;
    
                        // Clone the range
                        const postCaretRange = range.cloneRange();
                        // Select all textual contents from the contenteditable element
                        postCaretRange.selectNodeContents($element);
                        // And set the range end to the original clicked position
                        postCaretRange.setEnd(range.endContainer, range.endOffset);
                        // Return the text length from contenteditable start to the range end
                        postPosition = postCaretRange.toString().length;
                    }
                }
            }
    
            if (backward) {
                return [postPosition, prePosition];
            }
    
            return [prePosition, postPosition];
        };

        const getCaretsElements = () => {
            $inputCarets = $containerEditor.querySelector('.input').querySelector(".input-carets");
            let carets = Array.from($inputCarets.querySelectorAll(".caret"));
            return carets;
        }
        
        const getFontSize = () => {
            let comptStyle = window.getComputedStyle(document.documentElement);
            let fontSizeRaw = comptStyle.getPropertyValue("--font-size");
            return parseFloat(fontSizeRaw.substring(0, fontSizeRaw.length - 2));
        }
        const cacheWidthChar = () => {
            if (!window.hasOwnProperty("selRects")) window.selRects = [];
            if (window.selRects.length === 0) calculateAllRects();

            let widthChar = [...window.selRects].reduce((a, b) => a + b.width, 0) / selectionCaret.toString().length;
            widthCharMap[fontSize] = widthChar;
        }
        const getCharWidthAt = ($element) => {
            if ($element.hasOwnProperty('charWidth')) {
                if ($element.charWidth) {
                    return $element.charWidth;
                }
            }
                
            let auxNode = document.createElement("span");
            auxNode.innerText = "0";
            auxNode.style.opacity = "0";
            $element.appendChild(auxNode);
            let _width = auxNode.getBoundingClientRect().width;
            auxNode.remove();
            $element.charWidth = _width;
            return _width;
        }
        const getCharWidth = (fontSize=0) => {
            if (fontSize === 0) fontSize = getFontSize();
            if (!widthCharMap.hasOwnProperty(fontSize)) {
                widthCharMap[fontSize] = getCharWidthAt($syntax);
            }
            return widthCharMap[fontSize];
        }

        const getLineHeight = (fontSize=0) => {
            if (fontSize === 0) fontSize = getFontSize();
            let comptStyle = window.getComputedStyle(document.documentElement);
            let ratioLineHeight =  parseFloat(comptStyle.getPropertyValue("--line-height-ratio"));
            return fontSize * ratioLineHeight
        }
        const getCaretCharLine = (caretPos) => {
            let charWidth = getCharWidthAt($syntax);
            let lineHeight = getLineHeight();
            let editorBBounds = $editor.getBoundingClientRect();

            let caretLine = parseInt((caretPos.y - editorBBounds.y) / lineHeight);
            let caretChar = Math.round((caretPos.x - editorBBounds.x) / charWidth);

            return [caretChar, caretLine];
        }

        const addCaretElementWith = (caretChar, caretLine, dragStyle=false)  => {
            // Calculo de la posicion del ultimo caret
            let carets = Array.from($inputCarets.children);
            let $caret;
            for (let i=0; i<carets.length; i++) {
                $caretAux = carets[i];
                if (
                    parseInt($caretAux.style.getPropertyValue("--pos-char")) === caretChar &&
                    parseInt($caretAux.style.getPropertyValue("--pos-line")) === caretLine
                ) {
                    $caret = $caretAux;
                    break;
                }
            }
            if (!$caret || dragStyle) {
                $caret = document.createElement("span");
                $caret.classList.add("caret");
                let actualCaretChar = parseInt($caret.style.getPropertyValue("--pos-char")) || 0;
                let maxCaretChar = Math.max(caretChar, actualCaretChar)
                $caret.style.setProperty("--max-pos-char", maxCaretChar);
                $caret.style.setProperty("--pos-char", caretChar);
                $caret.style.setProperty("--pos-line", caretLine);
                $inputCarets.appendChild($caret);
            }
            else {
                $inputCarets.removeChild($caret);
                $caret = undefined;
            }
            return $caret;
        }
        const addCaretElementAt = (caretPos) => {
            let charWidth = getCharWidthAt($syntax);
            let lineHeight = getLineHeight();
            let editorBBounds = $editor.getBoundingClientRect();

            let caretLine = parseInt((caretPos.y - editorBBounds.y) / lineHeight);
            let caretChar = Math.round((caretPos.x - editorBBounds.x) / charWidth);
            return addCaretElementWith(caretChar, caretLine);
        }
        const addSelectionElement = (caretRects) => {
            let lineHeight = getLineHeight();
            let editorBBounds = $editor.getBoundingClientRect();
            $inputSelections.innerHTML = "";
            for (let _caretRect of caretRects) {
                $caretSelection = document.createElement("span");
                $caretSelection.classList.add("caret-selection");
                $caretSelection.style.setProperty("--pos-x", _caretRect.x - editorBBounds.x);
                $caretSelection.style.setProperty("--pos-y", _caretRect.y - editorBBounds.y);
                $caretSelection.style.setProperty("--size-width", _caretRect.width);
                $caretSelection.style.setProperty("--size-height", lineHeight);
                $inputSelections.append($caretSelection);
            }
        };

        const selectSyntaxFromPoint = (startX, startY, endX, endY) => {
            // TODO: Solo funciona si esta el viewport visible, si hay scroll no funcionaria
            let doc = document;
            let start, end, range = null;
            if (typeof doc.caretPositionFromPoint != "undefined") {
                start = doc.caretPositionFromPoint(startX, startY);
                end = doc.caretPositionFromPoint(endX, endY);
                range = doc.createRange();
                range.setStart(start.offsetNode, start.offset);
                range.setEnd(end.offsetNode, end.offset);
            } else if (typeof doc.caretRangeFromPoint != "undefined") {
                start = doc.caretRangeFromPoint(startX, startY);
                end = doc.caretRangeFromPoint(endX, endY);
                range = doc.createRange();
                range.setStart(start.startContainer, start.startOffset);
                range.setEnd(end.startContainer, end.startOffset);
            }

            if (range !== null && typeof window.getSelection != "undefined") {
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (typeof doc.body.createTextRange != "undefined") {
                range = doc.body.createTextRange();
                range.moveToPoint(startX, startY);
                var endRange = range.duplicate();
                endRange.moveToPoint(endX, endY);
                range.setEndPoint("EndToEnd", endRange);
                range.select();
            }

            return getCaretParentIndex($syntax);
        };
        const selectWith = (caretStart, caretEnd, $toNode=undefined) => {
            let initCaretStart = caretStart;
            let initCaretEnd = caretEnd;
            if (caretStart === 0 && caretEnd === 0) {
                let range = document.createRange();
                let sel = window.getSelection();

                sel.removeAllRanges();

                range.setStart($toNode, caretStart);
                range.setEnd($toNode, caretEnd);
                sel.addRange(range);
            }
            else {
                caretStart = Math.min($toNode.innerText.length, caretStart);
                caretEnd = Math.min($toNode.innerText.length, caretEnd);
                var [$tNodeStart, caretStart] = getTextNodeRelPos(caretStart, $toNode);
                var [$tNodeEnd, caretEnd] = getTextNodeRelPos(caretEnd, $toNode);
                caretStart = Math.min($toNode.innerText.length, caretStart);
                caretEnd = Math.min($toNode.innerText.length, caretEnd);

                let range = document.createRange();
                let sel = window.getSelection();

                sel.removeAllRanges();

                if (initCaretStart > initCaretEnd) {
                    range.setStart($tNodeEnd, caretEnd);
                    range.setEnd($tNodeStart, caretStart);
                    range.collapse(false);
                    sel.addRange(range);
                    sel.extend($tNodeEnd, caretEnd);
                } else {
                    range.setStart($tNodeStart, caretStart);
                    range.setEnd($tNodeEnd, caretEnd);
                    sel.addRange(range);
                }
            }
        }
        const selectSyntaxFromEditor = (caretStart, caretEnd) => {
            selectWith(caretStart, caretEnd, $toNode=$syntax);
        };
        const selectEditorFromSyntax = (caretStart, caretEnd) => {
            selectWith(caretStart, caretEnd, $toNode=$editor);
        };
        const selectEditorFromPoint = (startX, startY, endX, endY) => {
            // Needs to are a global reference
            let [caretStart, caretEnd] = selectSyntaxFromPoint(startX, startY, endX, endY);
            selectEditorFromSyntax(caretStart, caretEnd);
            return [caretStart, caretEnd];
        }
        const getCaretPosFromSelection = () => {
            let caretRects = window.getSelection().getRangeAt(0).getClientRects();
            let caretPos = {x: 0, y: 0, width: 1, height: getLineHeight()};
            if (caretRects.length === 0) {
                caretPos = getPosFromRelativeSelection($editor);
            }
            else {
                caretPos = {x: caretRects[0].x, y: caretRects[0].y, width: caretRects[0].width, height: caretRects[0].height};
            }
            return caretPos;
        }

        const getPosFromRelativeSelection = ($element) => {
            let caretRect = {x: 0, y: 0, width: 1, height: getLineHeight()};
            let backward = false;
    
            if ($element.nodeName === "TEXTAREA") {
                prePosition = $element.selectionStart;
                postPosition = $element.selectionEnd;
                backward = $element.selectionDirection === "backward";
            }
            else {
                const isSupported = typeof window.getSelection !== "undefined";
                if (isSupported) {
                    const selection = window.getSelection();
                    // Check if there is a selection (i.e. cursor in place)
                    if (selection.rangeCount !== 0) {
                        // Store the original range
                        const range = selection.getRangeAt(0);
                        let [caretStart, caretEnd] = getCaretParentIndex($element)
                        let [containerStart, offsetStart] = getTextNodeRelPos(caretStart, $element);
                        let [containerEnd, offsetEnd] = getTextNodeRelPos(caretEnd, $element);
                        range.setStart(containerStart, offsetStart);
                        range.setEnd(containerEnd, offsetEnd);
                        caretRect = range.getClientRects()[0];
                    }
                }
            }
    
            return {x: caretRect.x, y: caretRect.y, width: caretRect.width, height: caretRect.height};
        };

        const getCaretStartEndFromPos = (startX, startY, endX, endY) => {
            let [caretStart, caretEnd] = selectSyntaxFromPoint(startX, startY, endX, endY);
            window.getSelection().removeAllRanges();
            return [caretStart, caretEnd];
        }
        const getCaretPosFromCharLine = (caretChar, caretLine) => {
            let fontSize = getFontSize();
            let lineHeight = getLineHeight(fontSize);
            let charWidth = getCharWidth(fontSize);
            let editorBBounds = $editor.getBoundingClientRect();
            caretPosX = (charWidth * caretChar) + editorBBounds.x;
            caretPosY = (lineHeight * caretLine) + editorBBounds.y;

            return [caretPosX, caretPosY];
        }

        
        const _reduceCaretRects = (caretRects, isBackwards) => {
            caretRects = caretRects.sort((a, b) => { return isBackwards ? a.y - b.y : b.y - a.y });

            // Hay que eliminar aquellos rects que correspondan a la misma linea horizontalmente
            let yAux = caretRects[0].y;
            let xMin = caretRects[0].x;
            let xMax = 0;
            let reducedCRects = [];
            for (let i = 0; i < caretRects.length; i++) {
                let cRect = caretRects[i];
                if (cRect.y !== yAux || i === caretRects.length - 1) {
                    if (i === caretRects.length - 1) {
                        if (cRect.x + cRect.width > xMax) xMax = cRect.x + cRect.width;
                        if (cRect.x < xMin) xMin = cRect.x;
                    }
                    reducedCRects.push({
                        bottom: caretRects[i-1].bottom,
                        height: caretRects[i-1].height,
                        left: xMin,
                        right: xMax,
                        top: yAux,
                        width: xMax - xMin,
                        x: xMin,
                        y: yAux
                    });
                    yAux = cRect.y;
                    xMin = cRect.x;
                    xMax = 0;

                };
                if (cRect.x + cRect.width > xMax) xMax = cRect.x + cRect.width;
                if (cRect.x < xMin) xMin = cRect.x;
            }
            return reducedCRects;
        }
        
        const getCaretPosWithRangeNOffsets = (range, caretStart, caretEnd) => {
            let fontSize = getFontSize();
            let caretRects = Array.from(range.getClientRects());
            let isBackwards = caretEnd < caretStart ? true : false;
            // Ahora se crean los caret en funcion de la ultima la ultima posicion de los clientRects
            caretRects = _reduceCaretRects(caretRects, isBackwards);

            let actualSel = caretRects[0];
            let caretPosX = 0;
            let caretPosY = actualSel.y + actualSel.height / 2;
            if (isBackwards | caretStart === caretEnd) {
                // Se selecciona la posicion x => x
                caretPosX = actualSel.x;
            }
            else {
                // Se selecciona la posicion x => x + width
                caretPosX = actualSel.x + actualSel.width;
            }

            return [caretRects, caretPosX, caretPosY];
        };

        const processCaretPositions = (firstCaretPos, lastCaretPos) => {
            // Obtengo el tamaño de caracter en pixel
            let charWidth = getCharWidthAt($syntax);
            // Obtengo el tamaño por linea en pixels
            let lineHeight = getLineHeight();

            let editorBBounds = $editor.getBoundingClientRect();

            // let totalLines = lineHeight / editorBBounds.height;
            let firstCaretLine = parseInt((firstCaretPos.y - editorBBounds.y) / lineHeight);
            let lastCaretLine = parseInt((lastCaretPos.y - editorBBounds.y) / lineHeight);

            let startCaretPos = firstCaretPos;
            let endCaretPos = lastCaretPos;
            let backward = false;

            // Genero los rects en funcion de las posiciones del caret y los caretStart y caretEnd
            if (firstCaretLine === lastCaretLine) {
                if (firstCaretPos.x > lastCaretPos.x) {
                    endCaretPos = firstCaretPos;
                    startCaretPos = lastCaretPos;
                    backward = true;
                }
            }
            if (firstCaretLine > lastCaretLine) {
                endCaretPos = firstCaretPos;
                startCaretPos = lastCaretPos;

                let _auxLine = firstCaretLine
                firstCaretLine = lastCaretLine;
                lastCaretLine = _auxLine;

                backward = true;
            }
            
            // TODO
            let startCaretLine = firstCaretLine;
            let endCaretLine = lastCaretLine;

            let startCaretChar = Math.round((startCaretPos.x - editorBBounds.x) / charWidth);
            let endCaretChar = Math.round((endCaretPos.x - editorBBounds.x) / charWidth);

            return [startCaretChar, endCaretChar, startCaretLine, endCaretLine, backward];
        };

        const calculateAllRects = () => {
            let editorBBounds = $editor.getBoundingClientRect();
            let sel = window.getSelection();
            sel.selectAllChildren($syntax);
            let allRects = Array.from(sel.getRangeAt(0).getClientRects());
            sel.removeAllRanges();
            allRects = allRects.sort((a, b) => a.y - b.y );
            window.selRects = [];
            window.newLines = {};
            
            if (allRects.length === 0) {
                // Generar un cuadro vacio de ancho para poder seleccionar, de momento se coje el alto del editor
                allRects.push({
                    bottom: editorBBounds.bottom,
                    height: editorBBounds.height,
                    left: editorBBounds.left,
                    right: editorBBounds.left,
                    top: editorBBounds.top,
                    width: 0,
                    x: editorBBounds.x,
                    y: editorBBounds.y
                });
            }

            let y = allRects[0].y;
            let _wholeRectLine = {
                bottom: 0,
                height: 0,
                left: Infinity,
                right: 0,
                top: Infinity,
                width: 0,
                x: Infinity,
                y: 0
            };
            for (let i in allRects) {
                i = parseInt(i)
                let rect = allRects[i];

                if (rect.y > y) {
                    y = rect.y;
                    _wholeRectLine.width = _wholeRectLine.right - _wholeRectLine.left;
                    _wholeRectLine.height = _wholeRectLine.bottom - _wholeRectLine.top;
                    window.selRects.push(_wholeRectLine);
                    _wholeRectLine = {
                        bottom: 0,
                        height: 0,
                        left: Infinity,
                        right: 0,
                        top: Infinity,
                        width: 0,
                        x: Infinity,
                        y: 0
                    };
                }

                _wholeRectLine = {
                    bottom: Math.max(rect.bottom, _wholeRectLine.bottom),
                    left: Math.min(rect.left, _wholeRectLine.left),
                    right: Math.max(rect.right, _wholeRectLine.right),
                    top: Math.min(rect.top, _wholeRectLine.top),
                    x: Math.min(rect.x, _wholeRectLine.x),
                    y: Math.max(rect.y, _wholeRectLine.y)
                }

                if (i >= allRects.length - 1) {
                    _wholeRectLine.width = _wholeRectLine.right - _wholeRectLine.left;
                    _wholeRectLine.height = _wholeRectLine.bottom - _wholeRectLine.top;
                    window.selRects.push(_wholeRectLine);
                }
            }

            // Para calcular que es una new line o visual line se tiene que hacer un split de los \n
            // y se cuentan los indices, despues teniendo en cuenta los selRects, se obtendran los contenidos
            // de cada linea
            // if(debug) {
            //     for (let rect of window.selRects.sort((a, b) => a.y - b.y )) {
            //         let midHeight = (rect.top + rect.bottom) / 2;
            //         let [caretStart, caretEnd] = selectSyntaxFromPoint(rect.left+1, midHeight, rect.right, midHeight);
            //         let newLine = false;
            //         if ($editor.innerText[caretEnd+1] === "\n") {
            //             // New Line the next
            //             newLine = true;
            //         }
            //         console.log("LINE", caretStart, caretEnd, newLine);
            //         window.getSelection().removeAllRanges();
            //     }
            // }
            
            for (let rect of window.selRects) {
                rect.y -= editorBBounds.y;
                rect.x -= editorBBounds.x;
                rect.top -= editorBBounds.top;
                rect.bottom = rect.height + rect.top;
                rect.left -= editorBBounds.left;
                rect.right = rect.width + rect.left;
            }

            if ($editor.textContent.slice(-2) === "\n\n") {
                // Hay una nueva linea al final, por lo que hay que agregar un nuevo sel rect win width
                let lastRect = window.selRects[window.selRects.length - 1];
                let firstRect = window.selRects[0];
                window.selRects.push({
                    bottom: lastRect.bottom + firstRect.top + lastRect.height,
                    height: lastRect.height,
                    left: lastRect.left,
                    right: lastRect.left,
                    top: lastRect.bottom + firstRect.top,
                    width: 0,
                    x: lastRect.x,
                    y: lastRect.bottom + firstRect.top
                });

            }

            if ($debugCont !== undefined) {
                $debugCont.innerHTML = "";
                for (let rect of window.selRects) {
                    let $boxSel = document.createElement("span");
                    $boxSel.style.width = `${rect.width}px`;
                    $boxSel.style.height = `${rect.height}px`;
                    //$boxSel.style.left = `${rect.left - inputBB.left - parseFloat(window.getComputedStyle($input).paddingLeft)}px`;
                    $boxSel.style.left = `${rect.left}px`;
                    $boxSel.style.top = `${rect.top}px`;

                    $boxSel.style.position = 'absolute';
                    $boxSel.style.background = '#0000ff1f';
                    $boxSel.classList.add("boxSel");
                    $debugCont.appendChild($boxSel);
                }
            }
        }

        const calculateActualRect = (clientY, absolutePos=false) => {
            if (!window.hasOwnProperty("selRects")) window.selRects = [];
            // Se comprueba que donde se ha hecho mousedown no corresponde con la posicion de una seleccion
            if (window.selRects.length === 0) calculateAllRects();

            let selRect;
            // let lineHeight = getLineHeight();

            // TODO: Hay que ordenar los rects, y quedarse con los cuadros de las diferentes lineas, despues
            // Generar una funcion que los pinte para obvservar bien como se van cambiando y generando
            // modificar en la funcion de resize, y de input, es decir cada vez que se cambia el window.selRects

            for (let i in window.selRects) {
                var _rect = window.selRects[i];
                if (clientY >= _rect.y) selRect = _rect;
            }
            if (selRect) {
                selRect = Object.keys(selRect).reduce((obj, _key) => {
                    obj[_key] = selRect[_key];
                    return obj;
                }, {});
    
                if (absolutePos) {
                    let editorBBounds = $editor.getBoundingClientRect();
                    selRect.y += editorBBounds.y;
                    selRect.x += editorBBounds.x;
                    selRect.top += editorBBounds.top;
                    selRect.bottom += editorBBounds.top;
                    selRect.left += editorBBounds.left;
                    selRect.right += editorBBounds.left;
                }
                // let inputBB = $input.getBoundingClientRect();
            }

            return selRect;
        }

        const getLastVisualLine = () => {
            if (window.selRects.length === 0) calculateAllRects();
            // window.selRects.sort((a, b) => b.y - a.y);
            // let lastPosLine = window.selRects[0].y;
            // let lineHeight = getLineHeight();
            // return parseInt(lastPosLine / lineHeight);
            return window.selRects.length-1;
        }

        const getFixedCharLine = (caretChar, caretLine) => {
            let charWidth = getCharWidthAt($syntax);
            let lineHeight = getLineHeight();

            let limitCaretLine = getLastVisualLine();
            let fixedCaretLine = limitCaretLine < caretLine ? limitCaretLine : caretLine;
            fixedCaretLine = Math.max(fixedCaretLine, 0);

            let selRect = calculateActualRect((fixedCaretLine * lineHeight) + lineHeight/2);
            if (!selRect) return [caretChar, Infinity, caretLine];

            let newLimitCaretChar = Math.round((selRect.x + selRect.width) / charWidth);
            let fixedCaretChar = Math.min(caretChar, newLimitCaretChar);
            if (caretChar !== Infinity && caretChar > newLimitCaretChar && fixedCaretLine != limitCaretLine) {
                fixedCaretLine += 1;
                fixedCaretChar = 0;
            }
            // fixedCaretChar = newLimitCaretChar < caretChar ? newLimitCaretChar : caretChar;
            // fixedCaretChar = Math.max(fixedCaretChar, 0);

            return [fixedCaretChar, newLimitCaretChar, fixedCaretLine];
        }

        const refreshCarets = () => {
            
        }

        const updateCaretPos = (caretPos, {$caret=undefined, ctrlKey=false, dragStyle=false, resetFirst=false}) => {
            let editorBBounds = $editor.getBoundingClientRect();
            // let globalCaretPos = {
            //     x: caretPos.x,
            //     y: caretPos.y
            // };
            caretPos = {
                x: caretPos.x - editorBBounds.x,
                y: caretPos.y - editorBBounds.y
            };
            let selRect = calculateActualRect(caretPos.y);
            if(selRect !== undefined) {
                caretPos = {
                    x: Math.min(caretPos.x, selRect.x + selRect.width),
                    y: selRect.y + selRect.height/2
                };
                let firstCaret = $caret === undefined ? true : false;

                let charWidth = getCharWidthAt($syntax);
                let lineHeight = getLineHeight();
    
                let caretLine = parseInt(caretPos.y / lineHeight);
                let caretChar = Math.round(caretPos.x / charWidth);
                
                if ($caret === undefined) {
                    if (!ctrlKey && !dragStyle) {
                        // Se edita el ultimo solamente, ya que implica que no se agrega uno nuevo sino que se
                        // mueve el caret actual
                        // Si hubiera mas de uno y no se ha pulsado CTRL, entonces habria que borrarlos todos menos el ultimo
                        // let carets = Array.from($inputCarets.children);
                        // for (let _$caret of carets) {
                        //     $inputCarets.removeChild(_$caret);
                        // }
                        $inputCarets.innerHTML = "";
                    }
                    // if (dragStyle) {
                    //     let carets = Array.from($inputCarets.children);
                    //     for (let c of carets) {
                    //         if (! c.classList.contains("drag")) {
                    //             c.remove();
                    //         }
                    //     }
                    // }
                    $caret = addCaretElementWith(caretChar, caretLine, dragStyle=dragStyle);

                    if (dragStyle) {
                        $caret.classList.add("drag");
                        $editor.dragCaret = $caret;
                    }
                }

                if ($caret !== undefined) {
                    let actualCaretChar = parseInt($caret.style.getPropertyValue("--pos-char")) || 0;
                    let maxCaretChar = Math.max(caretChar, actualCaretChar)
                    $caret.style.setProperty("--max-pos-char", maxCaretChar);
                    $caret.style.setProperty("--pos-char", caretChar);
                    $caret.style.setProperty("--pos-line", caretLine);
    
                    if (firstCaret || resetFirst) {
                        // $inputSelections.innerHTML = "";
                        $caret.style.setProperty("--fpos-char", caretChar);
                        $caret.style.setProperty("--fpos-line", caretLine);
                    }
                    if (!dragStyle) updateSelectionCarets();
                }
            }

            return caretPos;
        }

        const updateSelectionCarets = () => {
            let carets = Array.from($inputCarets.children);
            let lineHeight = getLineHeight();
            let caretRects = []
            $inputSelections.innerHTML = "";
            for (let $caret of carets) {
                let cFirstPosLine = parseInt($caret.style.getPropertyValue("--fpos-line"));
                let cPosLine = parseInt($caret.style.getPropertyValue("--pos-line"));
                let [caretFirstPosX, caretFirstPosY] = getCaretPosFromCharLine(
                    parseInt($caret.style.getPropertyValue("--fpos-char")),
                    cFirstPosLine
                );
                let [caretPosX, caretPosY] = getCaretPosFromCharLine(
                    parseInt($caret.style.getPropertyValue("--pos-char")),
                    cPosLine
                );
                if (cPosLine !== cFirstPosLine) {
                    // Se tiene que calcular si la seleccion en backward o no
                    let isBackwards = false;
                    if (cFirstPosLine > cPosLine) {
                        isBackwards = true;
                    }
                    // Una vez con esta informacion obtener los selRects de cada linea
                    let firstSelRect = calculateActualRect((cFirstPosLine * lineHeight) + lineHeight/2, absolutePos=true);
                    let lastSelRect = calculateActualRect((cPosLine * lineHeight) + lineHeight/2, absolutePos=true);
                    // Agregar los caretRects teniendo en cuenta donde empieza y acaba
                    if (firstSelRect && lastSelRect) {
                        if (isBackwards) {
                            // First selection
                            caretRects.push({
                                top: caretFirstPosY,
                                bottom: caretFirstPosY + lineHeight,
                                height: lineHeight,
                                width: caretFirstPosX - firstSelRect.left,
                                left: firstSelRect.left,
                                right: caretFirstPosX,
                                x: firstSelRect.left,
                                y: caretFirstPosY
                            });
                            // Last selection
                            caretRects.push({
                                bottom: lastSelRect.bottom,
                                top: lastSelRect.top,
                                height: lineHeight,
                                width: lastSelRect.right - caretPosX,
                                left: caretPosX,
                                right: lastSelRect.right,
                                x: caretPosX,
                                y: lastSelRect.y
                            });
                        }
                        else {
                            caretRects.push({
                                top: firstSelRect.top,
                                bottom: firstSelRect.bottom,
                                height: lineHeight,
                                width: firstSelRect.right - caretFirstPosX ,
                                left: caretFirstPosX,
                                right: firstSelRect.right,
                                x: caretFirstPosX,
                                y: firstSelRect.y
                            });
                            // Last selection
                            caretRects.push({
                                top: lastSelRect.top,
                                bottom: lastSelRect.bottom,
                                height: lineHeight,
                                width: caretPosX - lastSelRect.left,
                                left: lastSelRect.left,
                                right: caretPosX,
                                x: lastSelRect.x,
                                y: lastSelRect.y
                            });
                        }
                    }
                    if (Math.abs(cPosLine - cFirstPosLine) > 0) {
                        // Por ultimo si se abarcan mas de 2 lineas se agregan los cuadros de seleccion de las lineas intermedias
                        for (let iLine=Math.min(cFirstPosLine, cPosLine) + 1; iLine < Math.max(cFirstPosLine, cPosLine); iLine++) {
                            let selRect = calculateActualRect((iLine * lineHeight) + lineHeight/2, absolutePos=true);
                            if (selRect) caretRects.push(selRect);
                        }
                    }
                }
                else {
                    if (caretFirstPosX === caretPosX) continue; // Son misma linea y misma posicion de char no hay seleccion
                    let isBackwards = false;
                    if (caretFirstPosX > caretPosX) {
                        isBackwards = true;
                    }
                    caretRects.push({
                        top: caretPosY,
                        bottom: caretPosY + lineHeight,
                        height: lineHeight,
                        width: Math.abs(caretPosX - caretFirstPosX),
                        left: isBackwards ? caretPosX : caretFirstPosX,
                        right: isBackwards ? caretFirstPosX : caretPosX,
                        x: isBackwards ? caretPosX : caretFirstPosX,
                        y: caretPosY
                    });
                }
            }
            // TODO: Aplicar una reduccion de numero de carets a usar, es decir fusionar estos selectionRects si hay dos que se solapan
            //  y mantener unicamente el caret de la fusion
            // Si hay un caret moviendose con el raton es decir estoy moviendo solo 1 caret este absorve el resto de carets si entra
            //  dentro del rango de seleccion de otros
            // Pero si se estan moviendo todos los carets, y se solapan, entonces se fusionan y se queda el caret activo que en el que se realizaba
            // la seleccion
            addSelectionElement(caretRects);
        }

        const updateCarets = (_event) => {
            let $inputCarets = $containerEditor.querySelector(".input-carets");
            let carets = Array.from($inputCarets.children);
            for (let i=0; i<carets.length; i++) {
                let $caret = carets[i];
                // Actualizo la posicion del caret por el caretEndOffset
                // Obtener el caretEnd de este caret e incrementarlo
                let caretBB = $caret.getBoundingClientRect()
                let [caretStart, caretEnd] = selectSyntaxFromPoint(caretBB.x, caretBB.y, caretBB.x, caretBB.y);
                selectEditorFromSyntax(caretStart, caretEnd);

                // Propago la accion
                // Mover cuando se pulsa el control hasta el siguiente caracter que sea [\w _(]

                let sel = window.getSelection();
                let selRects = sel.getRangeAt(0).getClientRects();
                let caretEndOffset = 0;

                $caret.style.setProperty("--caret-index", caretEnd + caretEndOffset);
                let caretPos = {x: selRects[0].x, y: selRects[0].y};
                // Convertir las coordenadas de caretEnd a Posicion de Char y Line
                let [startCaretChar, endCaretChar, startCaretLine, endCaretLine, backward] = processCaretPositions(caretPos, caretPos);
                // Modificar las propiedades del caret
                let actualCaretChar = parseInt($caret.style.getPropertyValue("--pos-char")) || 0;
                let maxCaretChar = Math.max(endCaretChar, actualCaretChar)
                $caret.style.setProperty("--max-pos-char", maxCaretChar);
                $caret.style.setProperty("--pos-char", endCaretChar);
                $caret.style.setProperty("--pos-line", endCaretLine);
                sel.removeAllRanges();
            }
        }

        const getCaretPositions = ($caret) => {
            let caretChar = parseInt($caret.style.getPropertyValue("--pos-char"));
            let caretLine = parseInt($caret.style.getPropertyValue("--pos-line"));
            let firstCaretChar = parseFloat($caret.style.getPropertyValue("--fpos-char"));
            let firstCaretLine = parseFloat($caret.style.getPropertyValue("--fpos-line"));

            let editorBBounds = $editor.getBoundingClientRect();
            let charWidth = getCharWidthAt($syntax);
            let lineHeight = getLineHeight();
            // TODO: De momento no se tiene en cuenta el editorBBounds debido a que el metodo que selecciona
            // lo hace unicamente teniendo el x y el y en cuenta del viewport del render del html
            // Por lo que de momento se necesita tener en cuenta el scroll
            let firstCaretPos = {
                x: (firstCaretChar * charWidth) + editorBBounds.x,
                y: (firstCaretLine * lineHeight) + editorBBounds.y
            };
            let caretPos = {
                x: (caretChar * charWidth) + editorBBounds.x,
                y: (caretLine * lineHeight) + editorBBounds.y
            }
            return [firstCaretPos, caretPos];
        }

        const isMousePosInSelection = (mouseX, mouseY) => {
            let selections = Array.from($inputSelections.children);
            let $selection;
            let editorBBounds = $editor.getBoundingClientRect();
            for ($selection of selections) {
                let posX = parseFloat($selection.style.getPropertyValue("--pos-x")) + editorBBounds.x;
                let posY = parseFloat($selection.style.getPropertyValue("--pos-y")) + editorBBounds.y;
                let sizeWidth = parseFloat($selection.style.getPropertyValue("--size-width"));
                let sizeHeight = parseFloat($selection.style.getPropertyValue("--size-height"));
                if (mouseX > posX && mouseX < posX + sizeWidth && mouseY > posY && mouseY < posY + sizeHeight) {
                    return [$selection, {sx: posX, sy: posY, ex: posX + sizeWidth, ey: posY + sizeHeight}]
                }
            }
            return [undefined, {sx: 0, sy: 0, ex: 0, ey: 0}];
        }

        const dragDropEvent = (text, event) => {
            customZActions = 0;
            if($editor.internalDrag) {
                execCommands($editor.ownerDocument, ["delete"], false, null, keepZAction=false, customZActions=0);
                customZActions++;
            }
            let caretBBounds = $editor.dragCaret.getBoundingClientRect();
            selectEditorFromPoint(caretBBounds.x, caretBBounds.y, caretBBounds.x, caretBBounds.y);
            execCommands($editor.ownerDocument, ["insertHTML"], false, text, keepZAction=true, customZActions=customZActions+1, nameZAction="DroppedElement");
            window.selRects = [];
            let [caretStart, caretEnd] = getCaretParentIndex($editor);
            selectSyntaxFromEditor(caretStart - text.length, caretEnd);
            let caretPos = getCaretPosFromSelection();
            // addCaretElementAt(caretPos);
            if ($inputCarets.contains($editor.dragCaret)) {
                $inputCarets.removeChild($editor.dragCaret);
            }
            $editor.dragging = false;
            $editor.dragCaret = undefined;
            $editor.internalDrag = false;

            // Se crea la seleccion para el texto arrastrado
            $input.focus();
            updateCaretPos({x: caretPos.x, y: caretPos.y + caretPos.height/2}, {});
            let $caret = Array.from($inputCarets.children).slice(-1)[0];
            updateCaretPos({x: caretPos.x + caretPos.width, y: caretPos.y + caretPos.height/2}, {$caret: $caret});
        }
        const dragEnterEvent = (event) => {
            let syntaxBB = $syntax.getBoundingClientRect();
            let targetBB = event.target.getBoundingClientRect();
            let insideCondition = (
                targetBB.left >= syntaxBB.left &&
                targetBB.right <= syntaxBB.right &&
                targetBB.top >= syntaxBB.top &&
                targetBB.bottom <= syntaxBB.bottom
            )
            if (insideCondition) {
                if (! $editor.dragging) {
                    $editor.selecting = false;
                    $inputCarets.innerHTML = "";
                    $inputSelections.innerHTML = "";
                    $editor.dragging = true;
                    $editor.internalDrag = true;
                }
                $input.focus();
            }
        }
        const dragOverEvent = (event) => {
            event.preventDefault();
            // if (!$editor.hasOwnProperty("dragging")) $editor.dragging = false;
            $editor.dragCaretPos = {x: event.clientX, y: event.clientY};
            $editor.dragCaretPos = updateCaretPos($editor.dragCaretPos, {$caret: $editor.dragCaret, ctrlKey: false, dragStyle: true});
        }
        const dragLeaveEvent = (event) => {
            let syntaxBB = $syntax.getBoundingClientRect();
            let targetBB = event.target.getBoundingClientRect();
            let insideCondition = (
                targetBB.left >= syntaxBB.left &&
                targetBB.right <= syntaxBB.right &&
                targetBB.top >= syntaxBB.top &&
                targetBB.bottom <= syntaxBB.bottom
            )
            if(!insideCondition) {
                $input.blur();
                if ($editor.dragging && $editor.dragCaret) {
                    if ($inputCarets.contains($editor.dragCaret)) {
                        $inputCarets.removeChild($editor.dragCaret);
                    }
                    $editor.dragging = false;
                    $editor.dragCaret = undefined;
                    $editor.internalDrag = false;
                }
            }
        }

        const execCommandUndo = (doc, showUI=false, value=null) => {
            // Colocar el caret en la posicion que se esta editando
            if (actualHist > 0) {
                for (let i=0; i < editorHistory[actualHist]["zActions"]; i++) doc.execCommand("undo", showUI, value);
                actualHist -= 1;
            }
        }

        const execCommandRedo = (doc, showUI=false, value=null) => {
            // Colocar el caret en la posicion que se esta editando
            if (actualHist < editorHistory.length-1){
                actualHist += 1;
                for (let i=0; i < editorHistory[actualHist]["zActions"]; i++) doc.execCommand("redo", showUI, value);
            }
        }

        const execCommands = (doc, commands, showUI=false, value=null, keepZAction=true, customZActions=0, nameZAction="") => {
            for (let command of commands) {
                if (command === "undo") return execCommandUndo(doc, showUI, value);
                if (command === "redo") return execCommandRedo(doc, showUI, value);    
                doc.execCommand(command, showUI, value);
            }
            if (customZActions === 0) customZActions = commands.length;
            if (nameZAction === "") nameZAction = commands.join("_");
            if (keepZAction) {
                actualHist += 1;
                editorHistory.push({"date": Date.now(), "zActions": customZActions, "name": nameZAction});
            }
        }

        const execCommandsAt = (index, $el, commands, showUI=false, value=null, keepZAction=true, customZActions=0, nameZAction="") => {
            let doc = $el.ownerDocument;
            let docView = $el.ownerDocument.defaultView;
            let sel = doc.getSelection();
            let range = sel.getRangeAt(0);
            let $tNodeStart;
            [$tNodeStart, index] = getTextNodeRelPos(index, $el);
            range.setStart($tNodeStart, index);
            range.setEnd($tNodeStart, index);
            sel.removeAllRanges();
            sel.addRange(range);
            execCommands(doc, commands, showUI, value, noZAction, keepZAction, customZActions, nameZAction);
        }

        const execCommandsWithin = (indexStart, indexEnd, $el, commands, showUI=false, value=null, keepZAction=true, customZActions=0, nameZAction="") => {
            let doc = $el.ownerDocument;
            let docView = $el.ownerDocument.defaultView;
            let sel = docView.getSelection();
            let range = sel.getRangeAt(0);
            let $tNodeStart, $tNodeEnd;
            [$tNodeStart, indexStart] = getTextNodeRelPos(indexStart, $el);
            [$tNodeEnd, indexEnd] = getTextNodeRelPos(indexEnd, $el);
            range.setStart($tNodeStart, index);
            range.setEnd($tNodeEnd, index);
            sel.removeAllRanges();
            sel.addRange(range);
            execCommands(doc, commands, showUI, value, noZAction, keepZAction, customZActions, nameZAction);
        }

        const _ProcessInput = (event, {pressedEvent=false}) => {
            window.selRects = [];
            let that = event.target;

            if (["Shift"].includes(event.key)) {
                return false;
            }

            // Falta implementar con rango diferente inicial y final en la misma linea y diferente
            if (event.key === "Tab") {
                // This will prevent us from tabbing out of the editor
                event.preventDefault();
                // Obtengo las posiciones de la seleccion de $containerEl, ya que tengo la seleccion cargado
                // en los nodos hijos de texto de $containerEl
                var [caretStartPos, caretEndPos] = getCaretParentIndex($editor);

                // now insert four non-breaking spaces for the tab key
                if (!event.shiftKey) {
                    if (caretStartPos === caretEndPos) {
                        execCommands($editor.ownerDocument, ["insertHTML"], false, "\t");
                    }
                    else {
                        // TODO: Para cada linea que este el rango hay que agregar en el frimer \n de cada linea un \t
                        // Identar la linea entera, es decir agregar un tab al inicio
                        // let rawContent = $editor.innerText.slice(0, caretEndPos);
                        // let indexNewLine = rawContent.lastIndexOf("\n");
                        // rawContent = $editor.innerText.slice(indexNewLine === -1 ? 0 : indexNewLine, caretStartPos);
                        // let indexTab = rawContent.lastIndexOf("\t");

                        // if (indexNewLine !== -1) {
                        //     let doc = $editor.ownerDocument;
                        //     let docView = $editor.ownerDocument.defaultView;
                        //     let sel = docView.getSelection();
                        //     let range = sel.getRangeAt(0);
                        //     let $tNodeStart;
                        //     [$tNodeStart, indexNewLine] = getTextNodeRelPos(indexNewLine, $editor);
                        //     range.setStart($tNodeStart, indexNewLine);
                        //     range.setEnd($tNodeStart, indexNewLine);
                        //     sel.removeAllRanges();
                        //     sel.addRange(range);
                        //     document.execCommand('delete', false, null);
                        // }
                    }
                }
                else {
                    if (caretStartPos === caretEndPos) {
                        if ($editor.innerText[caretStartPos-1] === "\t") {
                            execCommands($editor.ownerDocument, ["delete"], false, null);
                        }
                    }
                    else {
                        // TODO: Para cada linea que este el rango hay que agregar en el frimer \n de cada linea un \t
                        let indexNewLines = [];
                        let firstNewLine = $editor.innerText.slice(0, Math.min(caretStartPos, caretEndPos)).lastIndexOf("\n");
                        if (firstNewLine > 0){
                            if ($editor.innerText[firstNewLine-1] === "\t") indexNewLines.push(firstNewLine);
                        }

                        let rawContent = $editor.innerText.slice(Math.min(caretStartPos, caretEndPos), Math.max(caretStartPos, caretEndPos));
                        let actualIndex = 0;
                        for (let line of rawContent.split("\n")) {
                            if (line !== "") {
                                if (line[1] === "\t") {
                                    indexNewLines.push(actualIndex);
                                }
                                actualIndex += line
                            }
                            else {
                                actualIndex += 1;
                            }
                        }

                        let i = 0;
                        for (let indexLine of indexNewLines) {
                            if (i < indexNewLines.length) { 
                                execCommandsAt(indexLine, $editor, ["delete"], keepZAction=false);
                            }
                            else {
                                execCommandsAt(indexLine, $editor, ["delete"], keepZAction=true, customZActions=indexNewLines.length, nameZAction="outdent multiple lines");
                            }
                            i += 1;
                        }
                    }
                }
            }
            else if (event.key === "Enter" && !pressedEvent) {
                execCommands($editor.ownerDocument, ["insertHTML"], false, "\n");
            }
            else if (event.key === "Backspace") {
                execCommands($editor.ownerDocument, ["delete"], false);
            }
            else if (event.key === "Delete") {
                execCommands($editor.ownerDocument, ["forwardDelete"], false);
            }
            else {
                // Input normal
                if (event.key.length === 1) {
                    execCommands($editor.ownerDocument, ["insertHTML"], false, event.key);
                    event.preventDefault();
                }
            }
            return true;
        }
        const _ProcessMoveCarets = (event) => {
            event.preventDefault();
            // TODO: Make different actions for move the carets in the visual spans, after, it will be updated
            let carets = getCaretsElements();
            for (let c in carets) {
                let $caret = carets[c];
                let maxCaretChar = parseInt($caret.style.getPropertyValue("--max-pos-char"));
                let caretChar = parseInt($caret.style.getPropertyValue("--pos-char"));
                let caretLine = parseInt($caret.style.getPropertyValue("--pos-line"));

                // TODO: Hay que realizar el cambio y limitar donde se ubicara el caret, de igual forma que se hace
                //  cuando se hace click, es decir utilizar el selRects, para determinar si se pasa a la siguiente linea o no
                if(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
                    let moveArrowMap = {
                        "ArrowLeft": (_char, _line) => {
                            _char -= 1;
                            if (_char < 0) {
                                _char = Infinity;
                                _line -= 1;
                            }
                            return [_char, _line];
                        },
                        "ArrowRight": (_char, _line) => {
                            return [_char + 1, _line];
                        },
                        "ArrowUp": (_char, _line) => {
                            _char = Math.max(_char, maxCaretChar);
                            return [_char, _line-1];
                        },
                        "ArrowDown": (_char, _line) => {
                            _char = Math.max(_char, maxCaretChar);
                            return [_char, _line+1];
                        },
                    }
                    let [modCaretChar, modCaretLine] = moveArrowMap[event.key](caretChar, caretLine);
                    // TODO: Arreglar seleccionar el maxChar correctamente
                    let [newCaretChar, newLimitCaretChar, newCaretLine] = getFixedCharLine(modCaretChar, modCaretLine);
                    if (newLimitCaretChar === Infinity) {
                        newCaretChar = caretChar;
                        newCaretLine = caretLine;
                        newLimitCaretChar = limitCaretChar;
                    }
                    if(['ArrowLeft', 'ArrowRight'].includes(event.key)) {
                        $caret.style.setProperty("--max-pos-char", newCaretChar);
                    }
                    // $caret.style.setProperty("--limit-pos-char", newLimitCaretChar);
                    $caret.style.setProperty("--pos-char", newCaretChar);
                    $caret.style.setProperty("--pos-line", newCaretLine);
                    if(!event.shiftKey) {
                        $caret.style.setProperty("--fpos-char", newCaretChar);
                        $caret.style.setProperty("--fpos-line", newCaretLine);
                    }
                }
                else if (['End', 'Home', 'PageUp', 'PageDown'].includes(event.key)) {
                    // TODO: Use this functions to make the operations, finally load visual carets
                    // sel.modify("move", "backward", "lineboundary");
                    // sel.modify("extend", "forward", "lineboundary");
                }
            }
            updateSelectionCarets();
            // updateCarets(event);
        }
        const _ProcessHistory = (event) => {
            if (event.key.toUpperCase() === "Z") {
                event.preventDefault();
                // Mirar en un historico privado variable local, el numero de veces que se tiene que realizar un undo
                if(event.shiftKey) {
                    execCommandRedo($editor.ownerDocument);
                }
                else {
                    execCommandUndo($editor.ownerDocument);
                }
            }
        }
        const _ProcessSpecialActions = (event) => {
            if (event.key.toUpperCase() === "A") {
                event.preventDefault();
                // Select all
                let $caret;
                // var startTime = performance.now();
                // FORMA 1 : (1.5, 0.5) ms
                $inputCarets.innerHTML = "";
                let [caretChar, newLimitCaretChar, caretLine] = getFixedCharLine(Infinity, getLastVisualLine());
                $caret = addCaretElementWith(caretChar, caretLine);
                $caret.style.setProperty("--fpos-char", 0);
                $caret.style.setProperty("--fpos-line", 0);
                updateSelectionCarets();

                // // FORMA 2 : (2.19999, 1.1000) ms
                // let editorBBounds = $editor.getBoundingClientRect();
                // updateCaretPos({x: editorBBounds.x, y: editorBBounds.y + getLineHeight()/2});
                // let carets = Array.from($inputCarets.children);
                // updateCaretPos(
                //     {x: editorBBounds.x + editorBBounds.width, y: editorBBounds.y + editorBBounds.height - getLineHeight()/2},
                //     $caret=carets[carets.length-1]
                // );
                // var endTime = performance.now();
                // console.log(`Select All Form 1 ${endTime - startTime} milliseconds`)
            }
            if (event.key.toUpperCase() === "C") {
                let carets = Array.from($inputCarets.children);
                let $caret;
                for ($caret of carets) {
                    let [firstCaretPos, caretPos] = getCaretPositions($caret);
                    // Se carga de cada caret a una seleccion de editor
                    selectSyntaxFromPoint(
                        firstCaretPos.x, firstCaretPos.y,
                        caretPos.x, caretPos.y
                    );
                    let text = window.getSelection().toString();
                    selectedText.push(text);
                }

                if (selectedText.length !== 0) {
                    $editor.copiedText = selectedText;
                    navigator.clipboard.writeText(selectedText.join("\n"));
                }
                else {
                    // Notificar de utilizar el editor normal con un popup, y notificar el error via firebase
                    console.error("Something was wrong");
                }
            }
            if (event.key.toUpperCase() === "V") {
                let carets = Array.from($inputCarets.children);
                let $caret;
                $inputSelections.innerHTML = "";
                for ($caret of carets) {
                    let [firstCaretPos, caretPos] = getCaretPositions($caret);
                    // Se carga de cada caret a una seleccion de editor
                    selectSyntaxFromPoint(
                        firstCaretPos.x, firstCaretPos.y,
                        caretPos.x, caretPos.y
                    );
                    let text = window.getSelection().toString();
                    selectedText.push(text);
                }

                if (selectedText.length !== 0) {
                    $editor.copiedText = selectedText;
                    navigator.clipboard.writeText(selectedText.join("\n"));
                }
                else {
                    // Notificar de utilizar el editor normal con un popup, y notificar el error via firebase
                    console.error("Something was wrong");
                }
            }
        }

        // $syntax.addEventListener("selectstart", () => {
        //     console.log("Selection started in targetDiv");
        //     document.addEventListener("selectionchange", logSelection);
        // });
        // $syntax.addEventListener("mouseleave", () => {
        //     document.removeEventListener("selectionchange", updateSyntaxSelectionBasedOnEditor);
        // });

        // $editor.addEventListener("click", (event) => {
        //   let that = event.target;
        //   let focusRange = getRangeFromMouse(event);
        //   // console.log(focusRange);
        // }, true);

        // $editor.addEventListener('input', (event) => {
        //     synxtaxHighlighter.onInput($containerEditor.regexson, event);
        // });
        const keydownEditor = (event, $containerEl, {pressedEvent=false}) => {
            // if ($containerEl !== $editor) return;
            // console.log(event);
            window.scrollY = 0;
            window.scrollX = 0;

            if(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'End', 'Home', 'PageUp', 'PageDown'].includes(event.key)) {
                if ($containerEl !== $editor) {
                    pauseCaretsBlink();
                    _ProcessMoveCarets(event);
                }
            }
            else if (event.ctrlKey && !pressedEvent) {
                if ($containerEditor !== $editor) {
                    _ProcessSpecialActions(event);
                }
                _ProcessHistory(event);
            }
            else {
                if (["Shift", "CapsLock"].includes(event.key)) {
                    // Nothing
                }
                // Si mi containerEl no es $editor entonces tengo que obtener el foco de este para cada caret
                else if ($containerEl !== $editor) {
                    pauseCaretsBlink();
                    $input.editing = true;
                    let carets = getCaretsElements();
                    for (let $caret of carets) {
                        let [firstCaretPos, caretPos] = getCaretPositions($caret);
                        // Se carga de cada caret a una seleccion de editor
                        selectEditorFromPoint(
                            firstCaretPos.x, firstCaretPos.y,
                            caretPos.x, caretPos.y
                        );
                        let changed = _ProcessInput(event, {pressedEvent: pressedEvent});
                        // Se actualiza la posicion del caret
                        if (changed) {
                            caretPos = getCaretPosFromSelection();
                            updateCaretPos(caretPos, {$caret: $caret, resetFirst: true});
                        }
                    }
                }
            }

            if ($containerEl !== $editor) {
                // Quito la seleccion de Editor y le devuelvo el foco al syntax
                window.getSelection().removeAllRanges();
                // Recuperamos el foco ya que si no se quedaria en el $editor que esta oculto
                // Para que funcione tiene que estar el foco en $input
                $input.focus();
                $input.editing = false;
            }
        }

        $syntax.addEventListener("mousedown", (event) => {
            // TODO: El metodo isMousePosInSelection, hay que perfeccionar para que un $selection tenga asociado un id de $caret
            //  y de esta forma obtener el caret correspondiente de una seleccion, o agregar los mismos datos de start end del $caret
            let [$selection, caretPos] = isMousePosInSelection(event.clientX, event.clientY);
            if ($selection !== undefined) {
                window.getSelection().removeAllRanges();
                let selHeight = parseFloat($selection.style.getPropertyValue("--size-height"));
                selectEditorFromPoint(
                    caretPos.sx, caretPos.sy - selHeight/2,
                    caretPos.ex, caretPos.ey - selHeight/2
                );
                // Get dataset from event.target and select from Point
                $editor.textDragged = window.getSelection().toString();

                $editor.selecting = false;
                $inputCarets.innerHTML = "";
                $editor.dragging = true;
                $editor.internalDrag = true;
            }
            else {
                pauseCaretsBlink();
                $editor.selecting = true;
                updateCaretPos({x: event.clientX, y: event.clientY}, {$caret: undefined, ctrlKey: event.ctrlKey});
            }

        }, true);
        $syntax.addEventListener("mousemove", (event) => {
            // which === 2 // Check if middle wheel is pressed
            if (!$editor.hasOwnProperty("selecting") && event.which === 1) $editor.selecting = false;
            window.getSelection().removeAllRanges();
            if ($editor.selecting) {
                let carets = Array.from($inputCarets.children);
                updateCaretPos({x: event.clientX, y: event.clientY}, {$caret: carets[carets.length-1], ctrlKey: event.ctrlKey});
            }
            if ($editor.dragging) {
                $editor.dragCaretPos = {x: event.clientX, y: event.clientY};
                $editor.dragCaretPos = updateCaretPos($editor.dragCaretPos, {$caret: $editor.dragCaret, ctrlKey: false, dragStyle: true});
            }
        }, true);
        $syntax.addEventListener("mouseup", (event) => {
            window.getSelection().removeAllRanges();
            if ($editor.selecting) {
                $editor.selecting = false;
            }
            if ($editor.dragging) {
                // TODO: Seleccionar antes
                $inputSelections.innerHTML = "";
                dragDropEvent("TODO", event);
            }
        }, true);
        $syntax.addEventListener("dragstart", function(event) {
            // Nunca se tendra este evento, a no ser que se seleccione texto interno
            $editor.selecting = false;
            $inputCarets.innerHTML = "";
            $editor.dragging = true;
            $editor.internalDrag = true;
        }, false);
        // $syntax.addEventListener("dragend", function(event) {
        //   // reset the transparency
        // }, false);
        
        /* events fired on the drop targets */
        // $syntax.addEventListener("mouseenter", event => { if ($editor.dragging) dragEnterEvent(event)}, false);
        // Si hay mouseleave tiene que detectar a nivel de document, si se hace un mouseup;
        $syntax.addEventListener("mouseleave", event => { if ($editor.dragging) dragLeaveEvent(event)}, false);
        $syntax.addEventListener("dragover", dragOverEvent, false);
        $syntax.addEventListener("dragenter", dragEnterEvent, false);
        $syntax.addEventListener("dragleave", dragLeaveEvent, false);
        $syntax.addEventListener("drop", function(event) {
            // prevent default action (open as link for some elements)
            event.preventDefault();
            let textDragged = event.dataTransfer.getData("Text");
            dragDropEvent(textDragged, event);
        }, false);

        // document.addEventListener("click", event => {
        //     let $inputEditor = $containerEditor.querySelector(".input");
        //     if ($inputEditor !== event.target && !$inputEditor.contains(event.target)) {
        //         $inputEditor.querySelector(".input-carets").innerHTML = "";
        //     }
        // });
        $containerEditor.querySelector('.input').addEventListener("blur", event => {
            if (!$input.editing) {
                // $inputCarets.innerHTML = "";
                disableCaretsBlink();
                $inputCarets.classList.add("nofocus");
                $inputSelections.classList.add("nofocus");
            }
        });
        $containerEditor.querySelector('.input').addEventListener("focus", event => {
            $inputCarets.classList.remove("nofocus");
            $inputSelections.classList.remove("nofocus");
            skipCaretsBlink();
        });

        $editor.addEventListener('change', event => {window.selRects = []});
        $input.addEventListener('keypress', event => {keydownEditor(event, event.target, {pressedEvent: true})});
        $input.addEventListener('keydown', event => {keydownEditor(event, event.target, {})});

        // REMOVE CTRL Z DEFAULT
        document.addEventListener('keydown', event => {
            if (event.ctrlKey) {
                if (event.key.toUpperCase() === "Z" || event.key.toUpperCase() === "Y") {
                    event.preventDefault();
                }
            }
        });

        const ro = new ResizeObserver(entries => {
            window.selRects = [];
            console.log()
        });
        ro.observe($editorInput);
    }

    init_listeners();

    // Main Function
    // Hihglight the editor
    // synxtaxHighlighter.onInput($containerEditor.regexson, { target: $editor });

    return {
        onInput: synxtaxHighlighter.onInput
    }
}