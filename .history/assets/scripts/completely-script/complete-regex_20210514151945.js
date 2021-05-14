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


var regex_syntax = [
    "(", "(?"
];

var c2h = {

};

var config_completely = {
    idInput: document.getElementById('input').id,
    classNameInput: document.getElementById('input').className,

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
var p = completely(
    document.getElementById('input'),
    config_completely
);

// p.options = colors;
// p.onChange = function (text) {
//     var c;
//     p.startFrom = text.indexOf(',') + 1;
//     var twocolors = text.split(',');
//     c = c2h[twocolors[0]];
//     if (c) document.body.style.backgroundColor = c;
//     else document.body.style.backgroundColor = '#fff';
//     c = c2h[twocolors[1]];

//     if (c) document.getElementById('btm').style.backgroundColor = c;
//     else document.getElementById('btm').style.backgroundColor = '#fff';
//     p.repaint();
// };
// setTimeout(function () { p.input.focus(); p.repaint(); }, 0);