function EditorSyntaxis(options = {}) {
    let $containerEditor = options.$containerEditor;
    let $inputCarets = $containerEditor.querySelector(".input-carets");
    let $editor = options.$inputRegex;
    let $syntax = options.$syntaxRegex;
    let synxtaxHighlighter = RegexHighlighter($editor, $syntax);

    // Catch Listeners
    const init_listeners = () => {
        const getTextNodeRelPos = (caretPos, $parent) => {
            let textNodes = $parent.childNodes;
            let offsetStart = 0;
            let offsetEnd = 0;
            for (let tIndex = 0; tIndex < textNodes.length; tIndex++) {
                let tNode = textNodes[tIndex];
                offsetEnd += tNode.textContent.length;
                if (caretPos <= offsetEnd) {
                    return [tNode, caretPos - offsetStart];
                }
                offsetStart += tNode.textContent.length;
            }
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
                        let sel = getSelection();
                        let position = sel.anchorNode.compareDocumentPosition(sel.focusNode);
                        backward = false;
                        // position == 0 if nodes are the same
                        if (!position && sel.anchorOffset > sel.focusOffset ||
                            position === Node.DOCUMENT_POSITION_PRECEDING)
                            backward = true;
    
                        // Store the original range
                        const range = window.getSelection().getRangeAt(0);
    
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
    
        // HANDLE MULTIEDIT
        // mouseup - Get caret positions from $syntax to $editor
        // input - If ctrl pressed saved in queue the position of caret
        // input - Control updates of caret with arrow keys
        const getFontSize = () => {
            let comptStyle = window.getComputedStyle(document.documentElement);
            let fontSizeRaw = comptStyle.getPropertyValue("--font-size");
            return parseFloat(fontSizeRaw.substring(0, fontSizeRaw.length - 2));
        }
        const getLineHeight = (fontSize=0) => {
            if (fontSize === 0 ) fontSize = getFontSize();
            let comptStyle = window.getComputedStyle(document.documentElement);
            let ratioLineHeight =  parseFloat(comptStyle.getPropertyValue("--line-height-ratio"));
            return fontSize * ratioLineHeight
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
            // TODO: Generar el html para los background de seleccion
        };

        const selectSyntaxFromPoint = (startX, startY, endX, endY) => {
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

                if (caretStart > caretEnd) {
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
            let [caretStart, caretEnd] = selectSyntaxFromPoint(startX, startY, endX, endY);
            selectEditorFromSyntax(caretStart, caretEnd);
            return [caretStart, caretEnd];
        }
        const getCaretPosFromSelection = () => {
            let caretRect = window.getSelection().getRangeAt(0).getClientRects();
            return {x: caretRect.x, y: caretRect.y};
        }
        const getCaretStartEndFromPos = (startX, startY, endX, endY) => {
            let [caretStart, caretEnd] = selectSyntaxFromPoint(startX, startY, endX, endY);
            window.getSelection().removeAllRanges();
            return [caretStart, caretEnd];
        }

        const getCharWidthAt = ($element) => {
            let auxNode = document.createElement("span");
            auxNode.innerText = "0";
            auxNode.style.opacity = "0";
            $element.appendChild(auxNode);
            let _width = auxNode.getBoundingClientRect().width;
            auxNode.remove();
            return  _width;
        }

        const _reduceCaretRects = (caretRects) => {
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

        const getCaretPositions = (range, caretStart, caretEnd) => {
            let fontSize = getFontSize();
            let caretRects = Array.from(range.getClientRects());
            let isBackwards = caretEnd < caretStart ? true : false;

            // Ahora se crean los caret en funcion de la ultima la ultima posicion de los clientRects
            if (caretRects.length > 1) {
                caretRects = _reduceCaretRects(caretRects);

                if (!$editor.widthCharMap.hasOwnProperty(fontSize)) {
                    let widthChar = [...caretRects].reduce((a, b) => a + b.width, 0) / selectionCaret.toString().length;
                    $editor.widthCharMap[fontSize] = widthChar;
                }
            }
            else {
                $editor.widthCharMap[fontSize] = getCharWidthAt($syntax);
            }

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

        const generateCaretPositions = (firstCaretPos, lastCaretPos) => {
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

        // $syntax.addEventListener("selectionchange", (event) => {
        const updateSelectionRendered = () => {
            if ($editor.widthCharMap === undefined) $editor.widthCharMap = {};

            let selectionCaret = window.getSelection();
            let range = selectionCaret.getRangeAt(0);

            // Obtengo los caret index relativos al padre de la seleccion, para que esto fuincione
            // Tengo que tener una seleccion cargada en algun nodo hijo del element que se le pasa
            // en este caso se le pasa $syntax, porque mi seleccion se hace en $syntax
            let [caretStart, caretEnd] = getCaretParentIndex($syntax);

            let [caretRects, caretPosX, caretPosY] = getCaretPositions(range, caretStart, caretEnd);

            // FUNCIONAL: SE AGREGA A $editor LA SELECCION DE $syntax
            selectEditorFromSyntax(caretStart, caretEnd);
            
            // VISUAL: SE CREA EL ELEMENTO CARET AL DOM
            let fontSize = getFontSize();
            let lineHeight = getLineHeight(fontSize);
            let editorBBounds = $editor.getBoundingClientRect();
            let caretChar = Math.round((caretPosX - editorBBounds.x) / $editor.widthCharMap[fontSize]);
            let caretLine = parseInt((caretPosY - editorBBounds.y) / lineHeight);
            addCaretElementWith(caretChar, caretLine);

            // Si esta collapsado no se generan los rects de seleccion
            if (!range.collapsed) {
                // Se agregan a container-carets dos span con clase caret-selection
                addSelectionElement(caretRects);
            }
        };

        function logSelection() {  
            console.log(document.getSelection().toString());
        }

        // document.addEventListener("click", event => {
        //     let $inputEditor = $containerEditor.querySelector(".input");
        //     if ($inputEditor !== event.target && !$inputEditor.contains(event.target)) {
        //         $inputEditor.querySelector(".input-carets").innerHTML = "";
        //     }
        // });
        $containerEditor.querySelector('.input').addEventListener("blur", event => {
            if (!$containerEditor.querySelector('.input').editing) {
                $containerEditor.querySelector('.input').querySelector(".input-carets").innerHTML = "";
            }
        });

        const calculateActualRect = (clientY) => {
            if (!window.hasOwnProperty("selRects")) window.selRects = [];
            if (window.selRects.length === 0) {
                // Se comprueba que donde se ha hecho mousedown no corresponde con la posicion de una seleccion
                let sel = window.getSelection();
                sel.selectAllChildren($syntax);
                let allRects = Array.from(sel.getRangeAt(0).getClientRects());
                sel.removeAllRanges();
                allRects = allRects.sort((a, b) => a.y - b.y );
                window.selRects = allRects;
            }

            let selRect;
            for (let i in window.selRects) {
                var _rect = window.selRects[i];
                if (clientY >= _rect.y) selRect = _rect;
            }

            return selRect;
        }
        const updateCaretPos = (caretPos, firstCaret=false, dragStyle=false) => {
            let selRect = calculateActualRect(caretPos.y);
            if(selRect !== undefined) {
                caretPos = {
                    x: Math.min(caretPos.x, selRect.x + selRect.width),
                    y: selRect.y + selRect.height/2
                };
    
                let charWidth = getCharWidthAt($syntax);
                let lineHeight = getLineHeight();
                let editorBBounds = $editor.getBoundingClientRect();
    
                let caretLine = parseInt((caretPos.y - editorBBounds.y) / lineHeight);
                let caretChar = Math.round((caretPos.x - editorBBounds.x) / charWidth);
    
                let $caret;
                if (dragStyle) {
                    if ($editor.dragCaret === undefined) {
                        $caret = addCaretElementWith(caretChar, caretLine, dragStyle=true);
                        $editor.dragCaret = $caret;
                    }
                    else {
                        // Se edita el previo solamente
                        $caret = $editor.dragCaret;
                    }
                    $caret.style.setProperty("--pos-char", caretChar);
                    $caret.style.setProperty("--pos-line", caretLine);
                }
                else {
                    // CTRL pulsado
                    if (false) {
                        $caret = addCaretElementWith(caretChar, caretLine);
                    }
                    else if ($inputCarets.children.length === 0) {
                        $caret = addCaretElementWith(caretChar, caretLine);
                    }
                    else {
                        // Se edita el ultimo solamente, ya que implica que no se agrega uno nuevo sino que se
                        // mueve el caret actual
                        // Si hubiera mas de uno y no se ha pulsado CTRL, entonces habria que borrarlos todos menos el ultimo
                        let carets = Array.from($inputCarets.children);
                        for (let i=0; i<carets.length-1; i++) {
                            $inputCarets.removeChild(carets[i]);
                        }
                        $caret = $inputCarets.children[0];
                        $caret.style.setProperty("--pos-char", caretChar);
                        $caret.style.setProperty("--pos-line", caretLine);
                    }
                    if (firstCaret) {
                        $caret.style.setProperty("--first-pos-x", caretPos.x);
                        $caret.style.setProperty("--first-pos-y", caretPos.y);
                    }
                }
            }

            return caretPos;
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
                let [startCaretChar, endCaretChar, startCaretLine, endCaretLine, backward] = generateCaretPositions(caretPos, caretPos);
                // Modificar las propiedades del caret
                $caret.style.setProperty("--pos-char", endCaretChar);
                $caret.style.setProperty("--pos-line", endCaretLine);
                sel.removeAllRanges();
            }
        }

        $syntax.addEventListener("mousedown", (event) => {
            $editor.selecting = true;
            updateCaretPos({x: event.clientX, y: event.clientY}, firstCaret=true);
        }, true);
        $syntax.addEventListener("mousemove", (event) => {
            if (!$editor.hasOwnProperty("selecting")) $editor.selecting = false;
            if ($editor.selecting) {
                updateCaretPos({x: event.clientX, y: event.clientY});
            }
        }, true);
        $syntax.addEventListener("mouseup", (event) => {
            $editor.selecting = false;
        }, true);

        
        $syntax.addEventListener("dragstart", function(event) {
            $editor.selecting = false;
            $editor.dragging = true;
        }, false);
        
        // $syntax.addEventListener("dragend", function(event) {
        //   // reset the transparency
        // }, false);
        
        /* events fired on the drop targets */
        $syntax.addEventListener("dragover", function(event) {
          // prevent default to allow drop
          event.preventDefault();

          if (!$editor.hasOwnProperty("dragging")) $editor.dragging = false;
          if ($editor.dragging) {
            $editor.dragCaretPos = {x: event.clientX, y: event.clientY};
            $editor.dragCaretPos = updateCaretPos($editor.dragCaretPos, dragStyle=true);
            $editor.dragCaret.classList.add("drag");
          }
        }, false);
        
        $syntax.addEventListener("dragenter", function(event) {
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
                    $editor.dragging = true;
                }
            }
        }, false);
        
        $containerEditor.addEventListener("dragleave", function(event) {
            let syntaxBB = $syntax.getBoundingClientRect();
            let targetBB = event.target.getBoundingClientRect();
            let insideCondition = (
                targetBB.left >= syntaxBB.left &&
                targetBB.right <= syntaxBB.right &&
                targetBB.top >= syntaxBB.top &&
                targetBB.bottom <= syntaxBB.bottom
            )

            if(!insideCondition) {
                if ($editor.dragging && $editor.dragCaret) {
                    $editor.dragging = false; 
                    $containerEditor.querySelector('.input').querySelector(".input-carets").removeChild($editor.dragCaret);
                    $editor.dragCaret = undefined;
                }
            }
            
        }, false);
        
        $syntax.addEventListener("drop", function(event) {
            // prevent default action (open as link for some elements)
            event.preventDefault();
            let textDragged = event.dataTransfer.getData("Text");
            let caretBBounds = $editor.dragCaret.getBoundingClientRect();
            selectEditorFromPoint(caretBBounds.x, caretBBounds.y, caretBBounds.x, caretBBounds.y, $syntax);
            document.execCommand('insertHTML', false, textDragged);
            
            let [caretStart, caretEnd] = getCaretParentIndex($editor);
            selectSyntaxFromEditor(caretStart, caretEnd);
            let caretPos = getCaretPosFromSelection();
            addCaretElementAt(caretPos);

            $containerEditor.querySelector('.input').querySelector(".input-carets").removeChild($editor.dragCaret);
            $editor.dragCaret = undefined;
          
        }, false);

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
        const keydownEditor = (event, $containerEl) => {
            // console.log(event.key);
            const _ProcessInput = (event) => {
                let that = event.target;
                // Ctrl
                if (event.keyCode === 17) {
                    // console.log(getCaretIndex($editor));
                }
                // tab key
                // Falta implementar con rango diferente inicial y final en la misma linea y diferente
                if (event.keyCode === 9) {
                    // This will prevent us from tabbing out of the editor
                    event.preventDefault();
                    // Obtengo las posiciones de la seleccion de $containerEl, ya que tengo la seleccion cargado
                    // en los nodos hijos de texto de $containerEl
                    var [caretStartPos, caretEndPos] = getCaretParentIndex($editor);

                    // now insert four non-breaking spaces for the tab key
                    if (!event.shiftKey) {
                        if (caretStartPos === caretEndPos) {
                            let doc = $editor.ownerDocument.defaultView;
                            let sel = doc.getSelection();
                            let range = sel.getRangeAt(0);
                            // let tabNode = document.createTextNode("\t");
                            // range.insertNode(tabNode);
                            document.execCommand('insertHTML', false, "\t");
                            // range.setStartAfter(tabNode);
                            // range.setEndAfter(tabNode); 
                            // sel.removeAllRanges();
                            // sel.addRange(range);
                        }
                        else {
                            // TODO: Identar la linea entera, es decir agregar un tab al inicio
                            // // let start = that.selectionStart;
                            // // let end = that.selectionEnd;

                            // // set textarea value to: text before caret + tab + text after caret
                            // that.value = that.value.substring(0, start) +
                            //     "\t" + that.value.substring(end);

                            // // put caret at right position again
                            // that.selectionStart = that.selectionEnd = start + 1;
                        } 

                    }
                    else {
                        let rawContent = $editor.innerText.slice(0, caretStartPos);
                        let indexTab = rawContent.lastIndexOf("\t");
                        if (indexTab !== -1) {
                            let doc = $editor.ownerDocument.defaultView;
                            let sel = doc.getSelection();
                            let range = sel.getRangeAt(0);
                            // TODO: Check
                            let [$tNodeStart, indexTab] = getTextNodeRelPos(indexTab, $editor);
                            range.setStart($tNodeStart, indexTab);
                            range.setEnd($tNodeStart, indexTab + 1);
                            sel.removeAllRanges();
                            sel.addRange(range);
                            document.execCommand('delete', false, null);
                        }
                    }
                }
                // Shift
                // if (event.keyCode === 16) {
                //     event.preventDefault();
                //     that.shift_pressed = !that.shift_pressed;
                // }

            }
            const _ProcessMoveCarets = (event) => {
                event.preventDefault();
                updateCarets(event);
            }

            // Si mi containerEl no es $editor entonces tengo que obtener el foco de este para cada caret
            if ($containerEl !== $editor) {
                $containerEditor.querySelector('.input').editing = true;
                let carets = getCaretsElements();
                for (let c in carets) {
                    let $caret = carets[c];
                    let caretChar = parseInt($caret.style.getPropertyValue("--pos-char"));
                    let caretLine = parseInt($caret.style.getPropertyValue("--pos-line"));

                    // TODO: almacenar parametros necesarios en cada Caret y actualizarlos
                    let caretBBounds = $caret.getBoundingClientRect();

                    // Se carga de cada caret a una seleccion de editor
                    selectEditorFromPoint(caretBBounds.x, caretBBounds.y, caretBBounds.x, caretBBounds.y);

                    // addCaretElementWith(caretChar, caretLine);
                }
            }

            if(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'End', 'Home', 'PageUp', 'PageDown'].includes(event.key)) {
                if ($containerEl !== $editor) {
                    _ProcessMoveCarets(event);
                }
            }
            else {
                _ProcessInput(event);
            }
            if ($containerEl !== $editor) {
                // Quito la seleccion de Editor y le devuelvo el foco al syntax
                window.getSelection().removeAllRanges();
                // Recuperamos el foco del input
                $containerEditor.querySelector('.input').focus();
                $containerEditor.querySelector('.input').editing = false;
            }
        }


        // $editor.addEventListener('keydown', event => {keydownEditor(event, $editor)});
        $containerEditor.querySelector(".input").addEventListener('keydown', event => {keydownEditor(event, event.target)});
    }

    init_listeners();

    // Main Function
    // Hihglight the editor
    // synxtaxHighlighter.onInput($containerEditor.regexson, { target: $editor });

    return {
        onInput: synxtaxHighlighter.onInput
    }
}