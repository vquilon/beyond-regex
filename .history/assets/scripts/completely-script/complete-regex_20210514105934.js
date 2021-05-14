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

var compStyle = window.getComputedStyle(document.getElementById('FilterBox'), "");
alert(compStyle.getPropertyValue("display"));


var regex_syntax = [
    "(", "(?"
];

var c2h = {

};
var p = completely(
    document.getElementById('input'),
    {
        fontFamily: 'VictorMono',
        fontSize: '24px',
        "font-variant-ligatures": "none",
        promptInnerHTML: ''
    });
p.options = colors;
p.onChange = function (text) {
    var c;
    p.startFrom = text.indexOf(',') + 1;
    var twocolors = text.split(',');
    c = c2h[twocolors[0]];
    if (c) document.body.style.backgroundColor = c;
    else document.body.style.backgroundColor = '#fff';
    c = c2h[twocolors[1]];
    if (c) document.getElementById('btm').style.backgroundColor = c;
    else document.getElementById('btm').style.backgroundColor = '#fff';
    p.repaint();
};
setTimeout(function () { p.input.focus(); p.repaint(); },
    0);