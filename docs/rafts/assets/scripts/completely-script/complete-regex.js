if (!window.getComputedStyle) {
    window.getComputedStyle = function (el, pseudo) {
        this.el = el;
        this.getPropertyValue = function (prop) {
            var re = /(\-([a-z]){1})/g;
            if (prop == 'float')
                prop = 'styleFloat';
            if (re.test(prop)) {
                prop = prop.replace(re, function () {
                    return arguments[2].toUpperCase();
                });
            }
            return el.currentStyle[prop] ? el.currentStyle[prop] : null;
        }
        return this;
    }
}

var input_comp_style = window.getComputedStyle(document.getElementById('input'), "");


var c2h = {

};
var storedVal = document.getElementById('input').value


var config_completely = {
    idInput: document.getElementById('input').id,
    classNameInput: document.getElementById('input').className,
    initValue: document.getElementById('input').value,

    fontSize: input_comp_style.fontSize,
    fontFamily: input_comp_style.fontFamily,
    promptInnerHTML: input_comp_style.promptInnerHTML,
    color: input_comp_style.color,
    hintColor: input_comp_style.hintColor,
    backgroundColor: input_comp_style.backgroundColor,
    dropDownBorderColor: input_comp_style.dropDownBorderColor,
    dropDownZIndex: input_comp_style.dropDownZIndex,
    dropDownOnHoverBackgroundColor: input_comp_style.dropDownOnHoverBackgroundColor
}




var auto_regex = completely(
    document.getElementById('container-input'),
    config_completely
);

document.getElementById('input').value = storedVal;

function getCaretIndex(element) {
    let prePosition = 0;
    let postPosition = 0;
    let backward = false;
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
    if (backward) {
        return [postPosition, prePosition];
    }
    return [prePosition, postPosition];
}

var regex_syntax = [
    "(", "(?"
];

auto_regex.options = regex_syntax;

var prevText = "";
auto_regex.onChange = function (text) {
    let [preCaret, postCaret] = getCaretIndex(document.querySelector("#container-input").childNodes[0].childNodes[2])
    
    auto_regex.startFrom = postCaret;
    // auto_regex.startFrom = text.lastIndexOf(' ') + 1;

    
    // var c;
    // var twocolors = text.split(',');
    // c = c2h[twocolors[0]];
    // if (c) document.body.style.backgroundColor = c;
    // else document.body.style.backgroundColor = '#fff';
    // c = c2h[twocolors[1]];

    // if (c) document.getElementById('btm').style.backgroundColor = c;
    // else document.getElementById('btm').style.backgroundColor = '#fff';
    auto_regex.repaint();
    prevText = text;
};

// auto_regex.onChange = function (text) {
//     auto_regex.startFrom = text.lastIndexOf(' ')+1;
//     auto_regex.repaint();
// };	

// setTimeout(function () { p.input.focus(); p.repaint(); }, 0);

// auto_regex.input.maxLength = 50; // limit the max number of characters in the input text 