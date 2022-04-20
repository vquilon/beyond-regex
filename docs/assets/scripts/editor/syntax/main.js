function EditorSyntaxis(options = {}) {
    let $containerEditor = options.$containerEditor;
    let $editor = options.$inputRegex;
    let $syntax = options.$syntaxRegex;
    let synxtaxHighlighter = RegexHighlighter($editor, $syntax);

    const getRangeFromMouse = (event) => {
        let onRange = undefined;
        if (document.caretRangeFromPoint) { // Chrome
            onRange = document.caretRangeFromPoint(event.clientX, event.clientY);
        }
        else if (event.rangeParent) { // Firefox
            onRange = document.createRange();
            onRange.setStart(event.rangeParent, event.rangeOffset);
        }
        return onRange;
    };
    const getCaretIndex = (element) => {
        let prePosition = 0;
        let postPosition = 0;
        let backward = false;

        if (element.nodeName === "TEXTAREA") {
            prePosition = element.selectionStart;
            postPosition = element.selectionEnd;
            backward = element.selectionDirection === "backward";
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
                    preCaretRange.selectNodeContents(element);
                    // And set the range end to the original clicked position
                    preCaretRange.setEnd(range.startContainer, range.startOffset);
                    // Return the text length from contenteditable start to the range end
                    prePosition = preCaretRange.toString().length;

                    // Clone the range
                    const postCaretRange = range.cloneRange();
                    // Select all textual contents from the contenteditable element
                    postCaretRange.selectNodeContents(element);
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

    const getTextNodePos = (caretPos, $parent) => {
        let textNodes = $parent.childNodes;
        let offsetStart = 0;
        let offsetEnd = 0;
        for (let tIndex=0; tIndex<textNodes.length;tIndex++) {
            let tNode = textNodes[tIndex];
            offsetEnd += tNode.textContent.length;
            if (caretPos <= offsetEnd) {
                return [tNode, caretPos-offsetStart];
            }
            offsetStart += tNode.textContent.length;
        }
    }

    // Catch Listeners
    const init_listeners = () => {
        // HANDLE MULTIEDIT
        // mouseup - Get caret positions from $syntax to $editor
        // input - If ctrl pressed saved in queue the position of caret
        // input - Control updates of caret with arrow keys

        $syntax.addEventListener("mousedown", (event) => {
            // let [caretStart, caretEnd] = getCaretIndex($syntax);
            // let range = document.createRange();
            // let sel = window.getSelection();
            // range.setStart($editor.childNodes[0], caretStart);
            // range.setEnd($editor.childNodes[0], caretEnd);
            // // range.collapse(true);
            // sel.removeAllRanges();
            // sel.addRange(range);
        }, true);
        $syntax.addEventListener("mousemove", (event) => {
            // let [caretStart, caretEnd] = getCaretIndex($syntax);
            // let range = document.createRange();
            // let sel = window.getSelection();
            // range.setStart($editor.childNodes[0], caretStart);
            // range.setEnd($editor.childNodes[0], caretEnd);
            // // range.collapse(true);
            // sel.removeAllRanges();
            // sel.addRange(range);
        }, true);
        $syntax.addEventListener("mouseup", (event) => {
            var [caretStart, caretEnd] = getCaretIndex($syntax);
            if (caretStart === 0  && caretEnd === 0) {
                let range = document.createRange();
                let sel = window.getSelection();
                
                sel.removeAllRanges();

                range.setStart($editor, caretStart);
                range.setEnd($editor, caretEnd);
                sel.addRange(range);
            }
            else{
                caretStart = caretStart > $editor.innerText.length ? $editor.innerText.length : caretStart;
                caretEnd = caretEnd > $editor.innerText.length ? $editor.innerText.length : caretEnd;
    
                var [$tNodeStart, caretStart] = getTextNodePos(caretStart, $editor);
                var [$tNodeEnd, caretEnd] = getTextNodePos(caretEnd, $editor);
    
                caretStart = caretStart > $tNodeStart.textContent.length ? $tNodeStart.textContent.length : caretStart;
                caretEnd = caretEnd > $tNodeEnd.textContent.length ? $tNodeEnd.textContent.length : caretEnd;
                let range = document.createRange();
                let sel = window.getSelection();
                
                sel.removeAllRanges();
                
                if (caretStart > caretEnd ) {
                    range.setStart($tNodeEnd, caretEnd);
                    range.setEnd($tNodeStart, caretStart);
                    range.collapse(false);
                    sel.addRange(range);
                    sel.extend($tNodeEnd, caretEnd);
                }
                else {
                    range.setStart($tNodeStart, caretStart);
                    range.setEnd($tNodeEnd, caretEnd);
                    sel.addRange(range);
                }
            }
        }, true);

        $editor.addEventListener("focus", (event) => {
            let that = event.target;
            let [caretStart, caretEnd] = getCaretIndex(that);
            let $caret = document.createElement("span");
            $caret.classList.add("caret");

            let comptStyle = window.getComputedStyle(document.documentElement)
            let fontSizeRaw = comptStyle.getPropertyValue('--font-size');
            let fontSize = parseFloat(fontSizeRaw.substring(0, fontSizeRaw.length - 2));
            let ratioLineHeight = parseFloat(comptStyle.getPropertyValue('--line-height-ratio'));

            let lineHeight = fontSize * ratioLineHeight;
            let editorHeight = that.getBoundingClientRect().height;

            let numberLines = editorHeight / lineHeight;
            // Set position
            $caret.style.left = `${1}px`;
            $caret.style.top = `${2}px`;

            $containerEditor.querySelector(".input-carets").appendChild($caret);
        }, true);
        $editor.addEventListener("blur", (event) => {
            $containerEditor.querySelectorAll(".input-carets span.caret").forEach((elem) => {
                elem.remove();
            });
        });

        // $editor.addEventListener('input', (event) => {
        //     synxtaxHighlighter.onInput($containerEditor.regexson, event);
        // });
        $editor.addEventListener('keydown', (event) => {
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
                let [caretStartPos, caretEndPos] = getCaretIndex($editor);
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
                        // let start = that.selectionStart;
                        // let end = that.selectionEnd;

                        // set textarea value to: text before caret + tab + text after caret
                        that.value = that.value.substring(0, start) +
                            "\t" + that.value.substring(end);

                        // put caret at right position again
                        that.selectionStart = that.selectionEnd = start + 1;
                    }

                }
                else {
                    let rawContent = $editor.innerText.slice(0, caretStartPos);
                    let indexTab = rawContent.lastIndexOf("\t");
                    if (indexTab !== -1) {
                        let doc = $editor.ownerDocument.defaultView;
                        let sel = doc.getSelection();
                        let range = sel.getRangeAt(0);
                        range.setStart($editor.childNodes[0], indexTab);
                        range.setEnd($editor.childNodes[0], indexTab + 1);
                        sel.removeAllRanges();
                        sel.addRange(range);
                        document.execCommand('delete', false, null);
                    }
                }
            }
            // Shift
            if (event.keyCode === 16) {
                event.preventDefault();
                that.shift_pressed = !that.shift_pressed;
            }

            // synxtaxHighlighter.onInput($containerEditor.regexson, { target: $editor });
        });

        $editor.addEventListener('keyup', (event) => {
        });
    }

    init_listeners();

    // Main Function
    // Hihglight the editor
    // synxtaxHighlighter.onInput($containerEditor.regexson, { target: $editor });

    return {
        onInput: synxtaxHighlighter.onInput
    }
}