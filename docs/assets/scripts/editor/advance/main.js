function EditorAdvance(options = {}) {
    // Tendra claves como la fecha 
    let editorHistory = [{ date: Date.now(), zActions: 1, name: "init" }];
    let actualHist = 0;
    let maxHistory = 10000;
    let _commandsExecuted = [];

    let selRects = [];

    let $containerEditor = options.$containerEditor;
    let $inputCarets = $containerEditor.querySelector(".input-carets");
    let $inputSelections = $containerEditor.querySelector(".input-selects");
    let $editor = options.$inputRegex;
    let $syntax = options.$syntaxRegex;
    let $input = $inputCarets.parentElement;
    let $editorInput = $containerEditor.querySelector("#editor-input");
    let $debugCont = undefined;

    if (options.debugInputClass) {
        $debugCont = document.createElement("div");
        $debugCont.classList.add(options.debugInputClass);
        $input.appendChild($debugCont);
    }

    let widthCharMap = {};

    // FUNCTIONS
    const escapeHTML = (unsafe) => {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    const pauseCaretsBlink = () => {
        if ($inputCarets.timeoutBlink) {
            clearTimeout($inputCarets.timeoutBlink);
        }
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

    const getFontSize = () => {
        let comptStyle = window.getComputedStyle(document.documentElement);
        let fontSizeRaw = comptStyle.getPropertyValue("--font-size");
        return parseFloat(fontSizeRaw.substring(0, fontSizeRaw.length - 2));
    }
    const cacheWidthChar = () => {
        if (!window.hasOwnProperty("selRects")) selRects = [];
        if (selRects.length === 0) calculateAllRects();

        let widthChar = [...selRects].reduce((a, b) => a + b.width, 0) / selectionCaret.toString().length;
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
    const getCharWidth = (fontSize = 0) => {
        if (fontSize === 0) fontSize = getFontSize();
        if (!widthCharMap.hasOwnProperty(fontSize)) {
            widthCharMap[fontSize] = getCharWidthAt($syntax);
        }
        return widthCharMap[fontSize];
    }
    const getLineHeight = (fontSize = 0) => {
        if (fontSize === 0) fontSize = getFontSize();
        let comptStyle = window.getComputedStyle(document.documentElement);
        let ratioLineHeight = parseFloat(comptStyle.getPropertyValue("--line-height-ratio"));
        return fontSize * ratioLineHeight
    }

    // Add Caret/Selection to DOM
    const addCaretElementWith = (caretChar, caretLine, dragStyle = false) => {
        // Calculo de la posicion del ultimo caret
        let carets = Array.from($inputCarets.children);
        let $caret;
        for (let i = 0; i < carets.length; i++) {
            let $caretAux = carets[i];
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
            $inputCarets.appendChild($caret);
        }
        else {
            $inputCarets.removeChild($caret);
            $caret = undefined;
        }
        return $caret;
    }
    const addCaretElementAt = (caretPos) => {
        let [startCaretLine, startCaretChar, endCaretLine, endCaretChar, backward] = convertXYPosToLineCharOffset(caretPos, caretPos);
        return addCaretElementWith(startCaretChar, startCaretLine);
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

    const selectSyntaxAt = (startX, startY, endX, endY) => {
        // TODO: Solo funciona si esta el viewport visible, si hay scroll no funcionaria
        // Needs to are a global reference
        window.scrollTo(0, 0);
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

        return getTextOffsetFrom($syntax);
    };
    const selectWith = (caretStart, caretEnd, $toNode = undefined) => {
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
    const selectSyntaxFromEditorWith = (caretStart, caretEnd) => {
        selectWith(caretStart, caretEnd, $toNode = $syntax);
    };
    const selectEditorFromSyntaxWith = (caretStart, caretEnd, isBackwards) => {
        if (isBackwards) {
            let _aux = caretStart;
            caretStart = caretEnd;
            caretEnd = _aux;
        }
        selectWith(caretStart, caretEnd, $toNode = $editor);
    };
    const selectEditorAt = (startX, startY, endX, endY) => {
        // let [caretStart, caretEnd] = selectSyntaxAt(startX, startY, endX, endY);
        let [caretStart, caretEnd, isBackwards] = convertXYPosToTextOffset(startX, startY, endX, endY)
        selectEditorFromSyntaxWith(caretStart, caretEnd, isBackwards);
        return [caretStart, caretEnd];
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
                    return getTextNodeRelPos(caretOffset - offsetStart, tNode);
                }
                break
            }
            offsetStart += tNode.textContent.length;
        }
        return [tNode, caretOffset - offsetStart];
    }
    const getTextOffsetFrom = ($element) => {
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
        let carets = Array.from($inputCarets.children);
        // Se ordenan por el offset

        return carets;
    }

    // READ CARET POSITION FROM ACTUAL SELECTION
    const getCaretPosFromSelection = () => {
        let caretRects = window.getSelection().getRangeAt(0).getClientRects();
        let caretPos = { x: 0, y: 0, width: 1, height: getLineHeight() };
        if (caretRects.length === 0) {
            caretPos = getPosFromRelativeSelection($editor);
        }
        else {
            caretPos = { x: caretRects[0].x, y: caretRects[0].y, width: caretRects[0].width, height: caretRects[0].height };
        }
        return caretPos;
    }
    const getPosFromRelativeSelection = ($element) => {
        let caretRect = { x: 0, y: 0, width: 1, height: getLineHeight() };
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
                    let [caretStart, caretEnd] = getTextOffsetFrom($element)
                    let [containerStart, offsetStart] = getTextNodeRelPos(caretStart, $element);
                    let [containerEnd, offsetEnd] = getTextNodeRelPos(caretEnd, $element);
                    range.setStart(containerStart, offsetStart);
                    range.setEnd(containerEnd, offsetEnd);
                    caretRect = range.getClientRects()[0];
                }
            }
        }

        return { x: caretRect.x, y: caretRect.y, width: caretRect.width, height: caretRect.height };
    };

    // CONVERTS X/Y POSITIONS - TEXT OFFSETS - LINE/CHAR OFFSETS
    const convertXYPosToTextOffset = (startX, startY, endX, endY) => {
        // let [caretStart, caretEnd] = selectSyntaxAt(startX, startY, endX, endY);
        // window.getSelection().removeAllRanges();
        let [startCaretLine, startCaretChar, endCaretLine, endCaretChar, backward] = convertXYPosToLineCharOffset({ x: startX, y: startY }, { x: endX, y: endY });
        let [startOffset, endOffset] = convertLineCharOffsetToTextOffset(startCaretLine, startCaretChar, endCaretLine, endCaretChar);
        return [startOffset, endOffset, endOffset < startOffset];
    }
    const convertTextOffsetToXYPosition = (caretStart, caretEnd) => {
        let [startCaretLine, startCaretChar, endCaretLine, endCaretChar] = convertTextOffsetToLineCharOffset(caretStart, caretEnd);
        let [startPosX, startPosY] = convertLineCharOffsetToXYPos(startCaretLine, startCaretChar);
        let [endPosX, endPosY] = convertLineCharOffsetToXYPos(endCaretLine, endCaretChar);
        return [startPosX, startPosY, endPosX, endPosY];
    };
    const convertLineCharOffsetToTextOffset = (initCaretLine, initCaretChar, caretLine, caretChar) => {
        // Se puede obtener el offfset sin utilizar la api de seleccion ya que tenemos la informacion de todos los selRects
        if (selRects.length === 0) calculateAllRects();
        let charWidth = getCharWidth();
        let startOffset = 0;
        let endOffset = 0;
        for (let i = 0; i < selRects.length; i++) {
            let rect = selRects[i];
            let charsInLine = parseInt((rect.width + 2) / charWidth);
            if (i < initCaretLine) startOffset += charsInLine;
            if (i < caretLine) endOffset += charsInLine;
        }
        startOffset += initCaretChar;
        endOffset += caretChar;
        return [startOffset, endOffset];
    }
    const convertTextOffsetToLineCharOffset = (caretStart, caretEnd) => {
        if (selRects.length === 0) calculateAllRects();
        let charWidth = getCharWidth();
        let startCaretLine = 0;
        let startCaretChar = Math.min(caretStart, $editor.innerText.length);
        let endCaretLine = 0;
        let endCaretChar = Math.min(caretEnd, $editor.innerText.length);
        let startOffFlag = true;
        let endOffFlag = true
        for (let i = 0; i < selRects.length; i++) {
            let rect = selRects[i];
            let charsInLine = parseInt((rect.width + 2) / charWidth);
            if (startCaretChar > charsInLine && startOffFlag) {
                startCaretChar -= charsInLine;
                startCaretLine++;
            }
            else {
                startOffFlag = false;
            }
            if (endCaretChar > charsInLine && endOffFlag) {
                endCaretChar -= charsInLine;
                endCaretLine++;
            }
            else {
                endOffFlag = false;
            }
        }

        return [startCaretLine, startCaretChar, endCaretLine, endCaretChar];
    }
    const convertLineCharOffsetToXYPos = (caretLine, caretChar) => {
        let fontSize = getFontSize();
        let lineHeight = getLineHeight(fontSize);
        let charWidth = getCharWidth(fontSize);
        let editorBBounds = $editor.getBoundingClientRect();
        caretPosX = (charWidth * caretChar) + editorBBounds.x;
        caretPosY = (lineHeight * caretLine) + editorBBounds.y;

        return [caretPosX, caretPosY];
    }
    const convertXYPosToLineCharOffset = (firstCaretPos, lastCaretPos) => {
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

        return [startCaretLine, startCaretChar, endCaretLine, endCaretChar, backward];
    };

    // TEXT LINES/RECTS (NO SELECTION ENGINE REQUIRED)
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
                    bottom: caretRects[i - 1].bottom,
                    height: caretRects[i - 1].height,
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
    const calculateAllRects = () => {
        let editorBBounds = $editor.getBoundingClientRect();
        let sel = window.getSelection();
        let prevRange = undefined;
        if (sel.rangeCount >= 1) prevRange = sel.getRangeAt(0);
        sel.selectAllChildren($syntax);
        let allRects = Array.from(sel.getRangeAt(0).getClientRects());
        sel.removeAllRanges();
        if (prevRange) sel.addRange(prevRange);
        allRects = allRects.sort((a, b) => a.y - b.y);
        selRects = [];
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
                selRects.push(_wholeRectLine);
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
                selRects.push(_wholeRectLine);
            }
        }

        // Para calcular que es una new line o visual line se tiene que hacer un split de los \n
        // y se cuentan los indices, despues teniendo en cuenta los selRects, se obtendran los contenidos
        // de cada linea
        // if(debug) {
        //     for (let rect of selRects.sort((a, b) => a.y - b.y )) {
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

        for (let rect of selRects) {
            rect.y -= editorBBounds.y;
            rect.x -= editorBBounds.x;
            rect.top -= editorBBounds.top;
            rect.bottom = rect.height + rect.top;
            rect.left -= editorBBounds.left;
            rect.right = rect.width + rect.left;
        }

        if ($editor.textContent.slice(-2) === "\n\n") {
            // Hay una nueva linea al final, por lo que hay que agregar un nuevo sel rect win width
            let lastRect = selRects[selRects.length - 1];
            let firstRect = selRects[0];
            selRects.push({
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
            for (let rect of selRects) {
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
    const calculateActualRect = (clientY, absolutePos = false) => {
        // Se comprueba que donde se ha hecho mousedown no corresponde con la posicion de una seleccion
        if (selRects.length === 0) calculateAllRects();

        let selRect;
        // let lineHeight = getLineHeight();

        // TODO: Hay que ordenar los rects, y quedarse con los cuadros de las diferentes lineas, despues
        // Generar una funcion que los pinte para obvservar bien como se van cambiando y generando
        // modificar en la funcion de resize, y de input, es decir cada vez que se cambia el selRects

        for (let i in selRects) {
            var _rect = selRects[i];
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
        if (selRects.length === 0) calculateAllRects();
        // selRects.sort((a, b) => b.y - a.y);
        // let lastPosLine = selRects[0].y;
        // let lineHeight = getLineHeight();
        // return parseInt(lastPosLine / lineHeight);
        return selRects.length - 1;
    }
    // FIXED LINE CHAR OFFSETS
    const fixLineCharOffset = (caretLine, caretChar) => {
        let charWidth = getCharWidthAt($syntax);
        let lineHeight = getLineHeight();

        let limitCaretLine = getLastVisualLine();
        let fixedCaretLine = limitCaretLine < caretLine ? limitCaretLine : caretLine;
        fixedCaretLine = Math.max(fixedCaretLine, 0);

        let selRect = calculateActualRect((fixedCaretLine * lineHeight) + lineHeight / 2);
        if (!selRect) return [caretChar, Infinity, caretLine];

        let newLimitCaretChar = Math.round((selRect.x + selRect.width) / charWidth);
        let fixedCaretChar = Math.min(caretChar, newLimitCaretChar);
        if (caretChar !== Infinity && caretChar > newLimitCaretChar && fixedCaretLine != limitCaretLine) {
            fixedCaretLine += 1;
            fixedCaretChar = 0;
        }
        // fixedCaretChar = newLimitCaretChar < caretChar ? newLimitCaretChar : caretChar;
        // fixedCaretChar = Math.max(fixedCaretChar, 0);

        return [fixedCaretLine, fixedCaretChar, newLimitCaretChar];
    }

    const refreshCarets = () => {
        // TODO: Actualizar los carets teniendo en cuenta sus posiciones x/y a las actuales que valen
        //  para evitar el layout sifting con texto que se borre etc etc. U operaciones que se elimina o se agrega
        //  texto de repente.
        let carets = getCaretsElements();
        for (let $caret of carets) {
            let [startOffset, endOffset] = readCaretTextOffset($caret);
            let [fPosLine, fPosChar, posLine, posChar] = convertTextOffsetToLineCharOffset(startOffset, endOffset);
            writeCaretProps($caret, posLine, posChar, fPosLine, fPosChar, posChar);
        }
        updateSelectionCarets();

    }
    // CARETS/SELECTIONS CREATE/UPDATE
    const updateCaretPos = (caretPos, { $caret = undefined, ctrlKey = false, wheelKey = false, dragStyle = false, resetFirst = false }) => {
        let editorBBounds = $editor.getBoundingClientRect();
        caretPos = {
            x: caretPos.x - editorBBounds.x,
            y: caretPos.y - editorBBounds.y
        };
        let selRect = calculateActualRect(caretPos.y);
        if (selRect !== undefined) {
            caretPos = {
                x: Math.min(caretPos.x, selRect.x + selRect.width),
                y: selRect.y + selRect.height / 2
            };

            let charWidth = getCharWidthAt($syntax);
            let lineHeight = getLineHeight();

            let caretLine = parseInt(caretPos.y / lineHeight);
            let caretChar = Math.round(caretPos.x / charWidth);

            $caret = updateCaretLineChar(
                caretLine, caretChar,
                { $caret: $caret, ctrlKey: ctrlKey, wheelKey: wheelKey, dragStyle: dragStyle, resetFirst: resetFirst }
            );
        }

        return [caretPos, $caret];
    }
    const updateCaretLineChar = (caretLine, caretChar, { $caret = undefined, ctrlKey = false, wheelKey = false, dragStyle = false, resetFirst = false }) => {
        let firstCaret = $caret === undefined ? true : false;
        let caretFLine = undefined;
        let caretFChar = undefined;

        if ($caret === undefined) {
            let carets = getCaretsElements();
            if (carets.length === 0 || (ctrlKey && !dragStyle) || dragStyle) {
                $caret = addCaretElementWith(caretChar, caretLine, dragStyle = dragStyle);
            }
            else {
                // Se edita el ultimo solamente, ya que implica que no se agrega uno nuevo sino que se
                // mueve el caret actual
                // Si hubiera mas de uno y no se ha pulsado CTRL, entonces habria que borrarlos todos menos el ultimo
                $caret = carets.pop();
                for (let _$caret of carets) {
                    $inputCarets.removeChild(_$caret);
                }
                caretFLine = caretLine;
                caretFChar = caretChar;
            }
        }
        if ($caret !== undefined) {
            let actualCaretChar = parseInt($caret.style.getPropertyValue("--pos-char")) || caretChar;
            let actualCaretLine = parseInt($caret.style.getPropertyValue("--pos-line")) || caretLine;
            caretFLine = firstCaret || resetFirst ? caretLine : caretFLine;
            caretFChar = firstCaret || resetFirst ? caretChar : caretFChar;
            let maxCaretChar = actualCaretLine === caretLine ? caretChar : actualCaretChar;

            writeCaretProps($caret, caretLine, caretChar, caretFLine, caretFChar, maxCaretChar)

            if (!dragStyle) updateSelectionCarets();
        }
        return $caret;
    }
    const updateSelectionCarets = () => {
        let carets = getCaretsElements();
        let lineHeight = getLineHeight();
        let caretRects = []
        $inputSelections.innerHTML = "";
        for (let $caret of carets) {
            let cFirstPosLine = parseInt($caret.style.getPropertyValue("--fpos-line"));
            let cPosLine = parseInt($caret.style.getPropertyValue("--pos-line"));
            let [caretFirstPosX, caretFirstPosY] = convertLineCharOffsetToXYPos(
                cFirstPosLine,
                parseInt($caret.style.getPropertyValue("--fpos-char"))
            );
            let [caretPosX, caretPosY] = convertLineCharOffsetToXYPos(
                cPosLine,
                parseInt($caret.style.getPropertyValue("--pos-char"))
            );
            if (cPosLine !== cFirstPosLine) {
                // Se tiene que calcular si la seleccion en backward o no
                let isBackwards = false;
                if (cFirstPosLine > cPosLine) {
                    isBackwards = true;
                }
                // Una vez con esta informacion obtener los selRects de cada linea
                let firstSelRect = calculateActualRect((cFirstPosLine * lineHeight) + lineHeight / 2, absolutePos = true);
                let lastSelRect = calculateActualRect((cPosLine * lineHeight) + lineHeight / 2, absolutePos = true);
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
                            width: firstSelRect.right - caretFirstPosX,
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
                    for (let iLine = Math.min(cFirstPosLine, cPosLine) + 1; iLine < Math.max(cFirstPosLine, cPosLine); iLine++) {
                        let selRect = calculateActualRect((iLine * lineHeight) + lineHeight / 2, absolutePos = true);
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

    const writeCaretProps = ($caret, posLine, posChar, fPosLine, fPosChar, maxPosChar) => {
        $caret.style.setProperty("--pos-line", posLine);
        $caret.style.setProperty("--pos-char", posChar);
        if (fPosLine !== undefined) $caret.style.setProperty("--fpos-line", fPosLine);
        if (fPosChar !== undefined) $caret.style.setProperty("--fpos-char", fPosChar);
        $caret.style.setProperty("--max-pos-char", maxPosChar);

        let initCaretLine = fPosLine || parseFloat($caret.style.getPropertyValue("--fpos-line"));
        let initCaretChar = fPosChar || parseFloat($caret.style.getPropertyValue("--fpos-char"));
        let caretLine = posLine;
        let caretChar = posChar;
        let [startOffset, endOffset] = convertLineCharOffsetToTextOffset(initCaretLine, initCaretChar, caretLine, caretChar);
        $caret.style.setProperty("--offset-start", startOffset);
        $caret.style.setProperty("--offset-end", endOffset);
    }

    const readCaretXYPos = ($caret) => {
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
    const readCaretTextOffset = ($caret) => {
        let startOffset = parseFloat($caret.style.getPropertyValue("--offset-start"));
        let endOffset = parseFloat($caret.style.getPropertyValue("--offset-end"));
        return [startOffset, endOffset];
    }

    const isMouseInSelection = (mouseX, mouseY) => {
        let selections = Array.from($inputSelections.children);
        let $selection;
        let editorBBounds = $editor.getBoundingClientRect();
        for ($selection of selections) {
            let posX = parseFloat($selection.style.getPropertyValue("--pos-x")) + editorBBounds.x;
            let posY = parseFloat($selection.style.getPropertyValue("--pos-y")) + editorBBounds.y;
            let sizeWidth = parseFloat($selection.style.getPropertyValue("--size-width"));
            let sizeHeight = parseFloat($selection.style.getPropertyValue("--size-height"));
            if (mouseX > posX && mouseX < posX + sizeWidth && mouseY > posY && mouseY < posY + sizeHeight) {
                return [$selection, { sx: posX, sy: posY, ex: posX + sizeWidth, ey: posY + sizeHeight }]
            }
        }
        return [undefined, { sx: 0, sy: 0, ex: 0, ey: 0 }];
    }

    // DRAGS API
    const dragDropEvent = (text, event) => {
        if ($editor.internalDrag && !getSelection().isCollapsed) {
            execCommand($editor.ownerDocument, "delete", { keepZAction: false });
        }
        // if ($editor.dragCaret === undefined) {
        //     let [_pos, _$caret]  = updateCaretPos({x: event.clientX, y: event.clientY}, {$caret: $editor.dragCaret, ctrlKey: false, dragStyle: true});
        //     $editor.dragCaretPos = _pos;
        //     _$caret.classList.add("drag");
        //     $editor.dragCaret = _$caret;
        // }
        let caretBBounds = $editor.dragCaret.getBoundingClientRect();
        // TOOD: Hay que corregir el numero de caracteres que se han borrado, para ajustar donde se
        // pone el texto dragged
        selectEditorAt(caretBBounds.x, caretBBounds.y, caretBBounds.x, caretBBounds.y);
        execCommand($editor.ownerDocument, "insertHTML", { value: text, nameZAction: "DroppedElement" });
        selRects = [];
        let [caretStart, caretEnd] = getTextOffsetFrom($editor);
        selectSyntaxFromEditorWith(caretStart - text.length, caretEnd);
        let caretPos = getCaretPosFromSelection();
        // addCaretElementAt(caretPos);
        if ($inputCarets.contains($editor.dragCaret)) {
            $inputCarets.removeChild($editor.dragCaret);
        }
        $editor.dragging = false;
        $editor.dragCaret = undefined;
        $editor.internalDrag = false;
        $editor.textSelection = { sx: 0, sy: 0, ex: 0, ey: 0 };

        // Se crea la seleccion para el texto arrastrado
        updateCaretPos({ x: caretPos.x, y: caretPos.y + caretPos.height / 2 }, {});
        let $caret = Array.from($inputCarets.children).slice(-1)[0];
        updateCaretPos({ x: caretPos.x + caretPos.width, y: caretPos.y + caretPos.height / 2 }, { $caret: $caret });
        $input.focus();
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
            if (!$editor.dragging) {
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
        $editor.dragCaretPos = { x: event.clientX, y: event.clientY };
        let [_pos, _$caret] = updateCaretPos($editor.dragCaretPos, { $caret: $editor.dragCaret, ctrlKey: false, dragStyle: true });
        $editor.dragCaretPos = _pos;
        _$caret.classList.add("drag")
        $editor.dragCaret = _$caret;
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
        if (!insideCondition) {
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

    // COMMANDS API
    const recoverCaretElementsFrom = (caretsOffset) => {
        $inputCarets.innerHTML = "";
        $inputSelections.innerHTML = "";
        for (let cOffset of caretsOffset) {
            let [startCaretLine, startCaretChar, endCaretLine, endCaretChar] = convertTextOffsetToLineCharOffset(cOffset.startOffset, cOffset.endOffset);
            let $caret = updateCaretLineChar(startCaretLine, startCaretChar, { ctrlKey: true });
            if (cOffset.startOffset !== cOffset.endOffset) {
                updateCaretLineChar(endCaretLine, endCaretChar, { $caret: $caret, ctrlKey: true });
            }
        }
    }
    const execCommandUndo = (doc, { showUI = false, value = null }) => {
        // Colocar el caret en la posicion que se esta editando
        if (actualHist > 0) {
            let caretsOffset = editorHistory[actualHist].caretsOffset;

            for (let i = 0; i < editorHistory[actualHist].zActions; i++) doc.execCommand("undo", showUI, value);
            actualHist -= 1;

            recoverCaretElementsFrom(caretsOffset);
        }
    }
    const execCommandRedo = (doc, { showUI = false, value = null }) => {
        if (actualHist < editorHistory.length - 1) {
            actualHist += 1;
            for (let i = 0; i < editorHistory[actualHist].zActions; i++) doc.execCommand("redo", showUI, value);

            let caretsOffset = editorHistory[actualHist].caretsOffset;
            recoverCaretElementsFrom(caretsOffset);
        }
    }
    const execCommand = (doc, command, { showUI = false, value = null, keepZAction = true, nameZAction = "" }) => {
        if (command === "undo") return execCommandUndo(doc, { showUI: showUI, value: value });
        if (command === "redo") return execCommandRedo(doc, { showUI: showUI, value: value });
        doc.execCommand(command, showUI, value);
        if (nameZAction === "") nameZAction = command;
        if (keepZAction) {
            // Almacenar la posicion de todos los caracteres actuales
            let carets = getCaretsElements();
            let caretsOffset = [];
            for (let $caret of carets) {
                let [firstCaretPos, caretPos] = readCaretXYPos($caret);
                let [startCaretLine, startCaretChar, endCaretLine, endCaretChar, backward] = convertXYPosToLineCharOffset(firstCaretPos, caretPos);
                let [startOffset, endOffset] = convertLineCharOffsetToTextOffset(startCaretLine, startCaretChar, endCaretLine, endCaretChar);
                caretsOffset.push({ startOffset: startOffset, endOffset: endOffset });
            }
            let commandsExecuted = [..._commandsExecuted, { commandName: command }];
            _commandsExecuted = [];
            actualHist += 1;
            let initHistory = editorHistory[0];
            let firstHist = 0;
            if (editorHistory.length >= maxHistory) {
                // TODO: Controlar que si se hace undo o redo se compruebe que ha hecho cambios
                // Actualmente solo se quita el primer historico despues del inicial, mantenemos el primero que es el abrir la regex
                // No se puede poner el texto original de la regex, ya que para hacerlo habria que borrar toda la regex y generar
                // otro pseudo hitosrico en el cual cuando se baya a hacer un undo de 1 a init, borrar y poner, generando 2 zActions
                // despues si se quiere volver a generar el siguiente paso, se tiene que hacer 2 undo actions en un redo, ya que pasas de un init muy antigou
                // a un paso mas nuevo, como lo hace photoshop, pero salvamos memoria ya que no almacenamos cada estado del texto, solo el numero de zActions
                firstHist = 1;
            }
            a = [initHistory, ...editorHistory.slice(firstHist + 1, actualHist)];
            actualHist = editorHistory.length;
            editorHistory.push({ comands: commandsExecuted, date: Date.now(), zActions: commandsExecuted.length, name: nameZAction, caretsOffset: caretsOffset });
        }
        else {
            _commandsExecuted.push({ commandName: command });
        }
    }
    const execCommandAt = (index, $el, command, { showUI = false, value = null, keepZAction = true, nameZAction = "" }) => {
        let doc = $el.ownerDocument;
        let docView = $el.ownerDocument.defaultView;
        let sel = docView.getSelection();
        let range = new Range();
        let $tNodeStart;
        [$tNodeStart, index] = getTextNodeRelPos(index, $el);
        range.setStart($tNodeStart, index);
        range.setEnd($tNodeStart, index);
        sel.removeAllRanges();
        sel.addRange(range);
        execCommand(doc, command, { showUI: showUI, value: value, keepZAction: keepZAction, nameZAction: nameZAction });
    }
    const execCommandWithin = (indexStart, indexEnd, $el, command, { showUI = false, value = null, keepZAction = true, nameZAction = "" }) => {
        let doc = $el.ownerDocument;
        let docView = $el.ownerDocument.defaultView;
        let sel = docView.getSelection();
        let range = new Range();
        let $tNodeStart, $tNodeEnd;
        [$tNodeStart, indexStart] = getTextNodeRelPos(indexStart, $el);
        [$tNodeEnd, indexEnd] = getTextNodeRelPos(indexEnd, $el);
        range.setStart($tNodeStart, indexStart);
        range.setEnd($tNodeEnd, indexEnd);
        sel.removeAllRanges();
        sel.addRange(range);
        execCommand(doc, command, { showUI: showUI, value: value, keepZAction: keepZAction, nameZAction: nameZAction });
    }

    // MAIN BEHAVIOUR
    const ProcessInput = (event, { pressedEvent = false }) => {
        selRects = [];
        let that = event.target;

        if (["Shift", "Alt"].includes(event.key)) {
            event.preventDefault();
            return false;
        }
        if (pressedEvent) {
            if (event.key === "Enter") {
                execCommand($editor.ownerDocument, "insertText", { value: "\n" });
                return true;
            }
            if (event.key.length === 1) {
                execCommand($editor.ownerDocument, "insertText", { value: event.key });
                return true;
            }
        }
        else {
            if (event.key === "Tab") {
                // This will prevent us from tabbing out of editor
                event.preventDefault();
                // Obtengo las posiciones de la seleccion de $containerEl, ya que tengo la seleccion cargado
                // en los nodos hijos de texto de $containerEl
                var [caretStartPos, caretEndPos] = getTextOffsetFrom($editor);

                // now insert four non-breaking spaces for the tab key
                if (!event.shiftKey) {
                    if (caretStartPos === caretEndPos) {
                        execCommand($editor.ownerDocument, "insertHTML", { value: "\t" });
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
                        if ($editor.innerText[caretStartPos - 1] === "\t") {
                            execCommand($editor.ownerDocument, "delete", {});
                        }
                    }
                    else {
                        // TODO: Para cada linea que este el rango hay que agregar en el frimer \n de cada linea un \t
                        let indexNewLines = [];
                        let firstNewLine = $editor.innerText.slice(0, Math.min(caretStartPos, caretEndPos)).lastIndexOf("\n");
                        if (firstNewLine > 0) {
                            if ($editor.innerText[firstNewLine - 1] === "\t") indexNewLines.push(firstNewLine);
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
                                execCommandAt(indexLine, $editor, "delete", { keepZAction: false });
                            }
                            else {
                                execCommandAt(indexLine, $editor, "delete", { nameZAction: "outdent multiple lines" });
                            }
                            i += 1;
                        }
                    }
                }
                return true;
            }
            else if (event.key === "Backspace") {
                execCommand($editor.ownerDocument, "delete", {});
                return true;
            }
            else if (event.key === "Delete") {
                execCommand($editor.ownerDocument, "forwardDelete", {});
                return true;
            }
        }

        return false;
    }
    const ProcessMoveCarets = (event) => {
        event.preventDefault();
        // TODO: Make different actions for move the carets in the visual spans, after, it will be updated
        let carets = getCaretsElements();
        for (let $caret of carets) {
            let maxCaretChar = parseInt($caret.style.getPropertyValue("--max-pos-char"));
            let caretChar = parseInt($caret.style.getPropertyValue("--pos-char"));
            let caretLine = parseInt($caret.style.getPropertyValue("--pos-line"));

            // TODO: Hay que realizar el cambio y limitar donde se ubicara el caret, de igual forma que se hace
            //  cuando se hace click, es decir utilizar el selRects, para determinar si se pasa a la siguiente linea o no
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
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
                        return [_char, _line - 1];
                    },
                    "ArrowDown": (_char, _line) => {
                        _char = Math.max(_char, maxCaretChar);
                        return [_char, _line + 1];
                    },
                }
                let [modCaretChar, modCaretLine] = moveArrowMap[event.key](caretChar, caretLine);
                // TODO: Arreglar seleccionar el maxChar correctamente
                let [newCaretLine, newCaretChar, newLimitCaretChar] = fixLineCharOffset(modCaretLine, modCaretChar);
                if (newLimitCaretChar === Infinity) {
                    newCaretChar = caretChar;
                    newCaretLine = caretLine;
                    // newLimitCaretChar = limitCaretChar;
                }
                maxCaretChar = ['ArrowLeft', 'ArrowRight'].includes(event.key) ? newCaretChar : maxCaretChar;
                let newCaretFLine = !event.shiftKey ? newCaretLine : undefined;
                let newCaretFChar = !event.shiftKey ? newCaretChar : undefined;
                writeCaretProps($caret, newCaretLine, newCaretChar, newCaretFLine, newCaretFChar, maxCaretChar)
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
    const ProcessHistory = (event) => {
        if (event.key.toUpperCase() === "Z") {
            selRects = [];
            event.preventDefault();
            // Mirar en un historico privado variable local, el numero de veces que se tiene que realizar un undo
            if (event.shiftKey) {
                execCommandRedo($editor.ownerDocument, {});
            }
            else {
                execCommandUndo($editor.ownerDocument, {});
            }
        }
    }
    const ProcessSpecialActions = (event) => {
        if (event.key.toUpperCase() === "A") {
            event.preventDefault();
            // Select all
            let $caret;
            // let startTime, endTime;
            let caretLine, caretChar, newLimitCaretChar;

            // startTime = performance.now();
            [caretLine, caretChar, newLimitCaretChar] = fixLineCharOffset(getLastVisualLine(), Infinity);
            $caret = updateCaretLineChar(0, 0, {});
            $caret = updateCaretLineChar(caretLine, caretChar, { $caret: $caret });
            // endTime = performance.now();
            // console.log(`Select All Form 3 ${endTime - startTime} milliseconds`)

            // FORMA 1 : (1.5, 0.5) ms
            // startTime = performance.now();
            // $inputCarets.innerHTML = "";
            // [caretLine, caretChar, newLimitCaretChar] = fixLineCharOffset(Infinity, getLastVisualLine());
            // $caret = addCaretElementWith(caretChar, caretLine);
            // writeCaretProps($caret, caretLine, caretChar, 0, 0, caretChar);
            // updateSelectionCarets();
            // endTime = performance.now();
            // console.log(`Select All Form 1 ${endTime - startTime} milliseconds`)

            // // FORMA 2 : (2.19999, 1.1000) ms
            // let editorBBounds = $editor.getBoundingClientRect();
            // updateCaretPos({x: editorBBounds.x, y: editorBBounds.y + getLineHeight()/2});
            // let carets = Array.from($inputCarets.children);
            // updateCaretPos(
            //     {x: editorBBounds.x + editorBBounds.width, y: editorBBounds.y + editorBBounds.height - getLineHeight()/2},
            //     $caret=carets[carets.length-1]
            // );
            // endTime = performance.now();
            // console.log(`Select All Form 2 ${endTime - startTime} milliseconds`)
        }
        if (event.key.toUpperCase() === "C") {
            let carets = Array.from($inputCarets.children);
            let $caret;
            let selectedText = [];
            for ($caret of carets) {
                let [firstCaretPos, caretPos] = readCaretXYPos($caret);
                // Se carga de cada caret a una seleccion de editor
                // selectSyntaxAt(
                //     firstCaretPos.x, firstCaretPos.y,
                //     caretPos.x, caretPos.y
                // );
                // let text = window.getSelection().toString();
                let [startOffset, endOffset, isBackwards] = convertXYPosToTextOffset(
                    firstCaretPos.x, firstCaretPos.y,
                    caretPos.x, caretPos.y
                );
                if (isBackwards) {
                    let _aux = startOffset;
                    startOffset = endOffset;
                    endOffset = _aux;
                }
                let text = $editor.innerText.slice(startOffset, endOffset);
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
            selRects = [];
            $inputSelections.innerHTML = "";

            // Si el numero de elementos copiados es 2 y el numero total de carets actuales es igual a 2
            // Entonces pega cada parte en en el orden de carets ordenado por la linea y despues el char, osea por el offset

            // Es decir, por cada salto de linea de mi clipboard seran n saltos(clipboard) === n elementos
            // Por lo que, tendre este comportamiento, siendo m los carets actuales.
            // | Si n > m o n < m -> Pegar el contenido en cada uno de los m carets y mover la longitud del contenido copiado a los carets
            // | Si n === m -> Se pega cada linea en cada caret
            const readClipboard = async () => {
                $editor.focus();
                let textCopied = await navigator.clipboard.readText();
                let carets = getCaretsElements();
                if (textCopied.split("\n").length < carets.length || textCopied.split("\n").length > carets.length) {
                    textCopied = Array(carets.length).fill(textCopied)
                }
                else {
                    textCopied = [textCopied];
                }
                for (let i = 0; i < carets.length; i++) {
                    let $caret = carets[i];
                    let [firstCaretPos, caretPos] = readCaretXYPos($caret);
                    let [startCaretLine, startCaretChar, endCaretLine, endCaretChar, backward] = convertXYPosToLineCharOffset(firstCaretPos, caretPos);
                    let [startOffset, endOffset] = convertLineCharOffsetToTextOffset(startCaretLine, startCaretChar, endCaretLine, endCaretChar);
                    // Por cada caret se agrega la informacion del clipboard
                    // Seleccionar el texto e insertarlo
                    execCommandWithin(startOffset, endOffset, $editor, "insertText", { value: textCopied[i] })
                    // Actualizar todos los carets en el DOM la posicion, incrementada a cada caret
                }
                $input.focus();
            }
            readClipboard();
        }
    }

    const keydownEditor = (event, $containerEl, { pressedEvent = false }) => {
        // if ($containerEl !== $editor) return;
        // console.log(event);

        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'End', 'Home', 'PageUp', 'PageDown'].includes(event.key)) {
            if ($containerEl !== $editor) {
                pauseCaretsBlink();
                ProcessMoveCarets(event);
            }
        }
        else if (event.ctrlKey && !pressedEvent) {
            if ($containerEditor !== $editor) {
                ProcessSpecialActions(event);
            }
            ProcessHistory(event);
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
                for (let i = 0; i < Array.from($inputCarets.children).length; i++) {
                    let $caret = Array.from($inputCarets.children)[i];
                    let [firstCaretPos, caretPos] = readCaretXYPos($caret);
                    // Se carga de cada caret a una seleccion de editor
                    selectEditorAt(
                        firstCaretPos.x, firstCaretPos.y,
                        caretPos.x, caretPos.y
                    );
                    let changed = ProcessInput(event, { pressedEvent: pressedEvent });
                    // Se actualiza la posicion de todos los carets
                    if (changed) {
                        event.preventDefault();
                        caretPos = getCaretPosFromSelection();
                        updateCaretPos(caretPos, { $caret: $caret, resetFirst: true });
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

    // Catch Listeners
    const init_listeners = () => {
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
        $syntax.addEventListener("mousedown", (event) => {
            // TODO: El metodo isMousePosInSelection, hay que perfeccionar para que un $selection tenga asociado un id de $caret
            //  y de esta forma obtener el caret correspondiente de una seleccion, o agregar los mismos datos de start end del $caret
            if ($editor.dragging) {
                if ($inputCarets.contains($editor.dragCaret)) {
                    $inputCarets.removeChild($editor.dragCaret);
                }
                $editor.dragging = false;
                $editor.dragCaret = undefined;
                $editor.internalDrag = false;
                $editor.textSelection = { sx: 0, sy: 0, ex: 0, ey: 0 };
            }

            let [$selection, caretPos] = isMouseInSelection(event.clientX, event.clientY);
            if ($selection !== undefined) {
                let selHeight = parseFloat($selection.style.getPropertyValue("--size-height"));
                $editor.textSelection = { sx: caretPos.sx, sy: caretPos.sy + selHeight / 2, ex: caretPos.ex, ey: caretPos.ey - selHeight / 2 }
                $editor.selecting = false;
                $editor.internalDrag = true;
                $editor.initSelecting = true;
            }
            else {
                pauseCaretsBlink();
                $editor.initSelecting = true;
                updateCaretPos({ x: event.clientX, y: event.clientY }, { $caret: undefined, ctrlKey: event.ctrlKey });
            }

        }, true);
        $syntax.addEventListener("mousemove", (event) => {
            if(event.which === 0) {
                $editor.selecting = false;
                return
            }
            if ($editor.initSelecting && !$editor.internalDrag) {
                $editor.initSelecting = false;
                $editor.selecting = true;
            }
            if ($editor.selecting) {
                let $caret = $inputCarets.lastChild;
                updateCaretPos({ x: event.clientX, y: event.clientY }, { $caret: $caret, wheelKey: event.which === 2 });
            }
            if (($editor.internalDrag || $editor.dragging) && event.which === 1) {
                let [$selection, caretPos] = isMouseInSelection(event.clientX, event.clientY);
                if ($selection === undefined) {
                    $editor.dragCaretPos = { x: event.clientX, y: event.clientY };
                    let [_pos, _$caret] = updateCaretPos($editor.dragCaretPos, { $caret: $editor.dragCaret, ctrlKey: false, dragStyle: true });
                    $editor.dragCaretPos = _pos;
                    _$caret.classList.add("drag");
                    $editor.dragCaret = _$caret;
                }
                else {
                    if ($inputCarets.contains($editor.dragCaret)) {
                        $inputCarets.removeChild($editor.dragCaret);
                    }
                    $editor.dragging = true;
                    $editor.dragCaret = undefined;
                    $editor.initSelecting = false;
                }
            }
        }, true);
        $syntax.addEventListener("mouseup", (event) => {
            $editor.selecting = false;

            if ($editor.dragging) {
                let [$selection, caretPos] = isMouseInSelection(event.clientX, event.clientY);
                if ($selection === undefined) {
                    $inputSelections.innerHTML = "";
                    window.getSelection().removeAllRanges();
                    selectEditorAt(
                        $editor.textSelection.sx, $editor.textSelection.sy,
                        $editor.textSelection.ex, $editor.textSelection.ey,
                    );
                    // Get dataset from event.target and select from Point
                    let textDragged = window.getSelection().toString();
                    dragDropEvent(textDragged, event);
                }
                else {
                    // Recover the selecting state
                    $editor.dragging = false;
                    $editor.dragCaret = undefined;
                    $editor.internalDrag = false;
                    $editor.textSelection = { sx: 0, sy: 0, ex: 0, ey: 0 };
                }
            }
            else {
                if (!event.ctrlKey && $editor.initSelecting) {
                    $editor.initSelecting = false;
                    $editor.internalDrag = false;
                    pauseCaretsBlink();
                    updateCaretPos({ x: event.clientX, y: event.clientY }, { $caret: undefined });
                }
                else {
                    $editor.initSelecting = false;
                }
            }
        }, true);
        $syntax.addEventListener("dragstart", function (event) {
            event.preventDefault();
            // Nunca se tendra este evento, a no ser que se seleccione texto interno
            // $editor.selecting = false;
            // $inputCarets.innerHTML = "";
            // $editor.dragging = true;
            // $editor.internalDrag = true;

            // let [$selection, caretPos] = isMousePosInSelection(event.clientX, event.clientY);
            // let selHeight = parseFloat($selection.style.getPropertyValue("--size-height"));
            // $editor.textSelection = {sx:caretPos.sx, sy: caretPos.sy + selHeight/2, ex: caretPos.ex, ey: caretPos.ey - selHeight/2}
        }, false);
        // $syntax.addEventListener("dragend", function(event) {
        //   // reset the transparency
        // }, false);

        /* events fired on the drop targets */
        // $syntax.addEventListener("mouseenter", event => { if ($editor.dragging) dragEnterEvent(event)}, false);
        // Si hay mouseleave tiene que detectar a nivel de document, si se hace un mouseup;
        $input.addEventListener("mouseleave", event => { if ($editor.dragging) dragLeaveEvent(event) }, false);
        $syntax.addEventListener("dragover", dragOverEvent, false);
        $syntax.addEventListener("dragenter", dragEnterEvent, false);
        $syntax.addEventListener("dragleave", dragLeaveEvent, false);
        $syntax.addEventListener("drop", function (event) {
            // prevent default action (open as link for some elements)
            event.preventDefault();
            let textDragged = event.dataTransfer.getData("Text");
            if ($editor.internalDrag) {
                $inputSelections.innerHTML = "";
                window.getSelection().removeAllRanges();
                selectEditorAt(
                    $editor.textSelection.sx, $editor.textSelection.sy,
                    $editor.textSelection.ex, $editor.textSelection.ey,
                );
            }
            dragDropEvent(textDragged, event);
        }, false);

        // document.addEventListener("click", event => {
        //     let $inputEditor = $containerEditor.querySelector(".input");
        //     if ($inputEditor !== event.target && !$inputEditor.contains(event.target)) {
        //         $inputEditor.querySelector(".input-carets").innerHTML = "";
        //     }
        // });
        $input.addEventListener("blur", event => {
            if (!$input.editing) {
                // $inputCarets.innerHTML = "";
                disableCaretsBlink();
                $inputCarets.classList.add("nofocus");
                $inputSelections.classList.add("nofocus");
            }
        });
        $input.addEventListener("focus", event => {
            $inputCarets.classList.remove("nofocus");
            $inputSelections.classList.remove("nofocus");
            pauseCaretsBlink();
        });

        $editor.addEventListener('change', event => { selRects = [] });
        $input.addEventListener('keypress', event => { keydownEditor(event, event.target, { pressedEvent: true }) });
        $input.addEventListener('keydown', event => { keydownEditor(event, event.target, {}) });

        // REMOVE CTRL Z DEFAULT
        document.addEventListener('keydown', event => {
            if (event.ctrlKey) {
                if (event.key.toUpperCase() === "Z" || event.key.toUpperCase() === "Y") {
                    event.preventDefault();
                }
            }
        });

        const ro = new ResizeObserver(entries => {
            selRects = [];
            calculateAllRects();
            refreshCarets();
        });
        ro.observe($editorInput);
    }

    init_listeners();
}