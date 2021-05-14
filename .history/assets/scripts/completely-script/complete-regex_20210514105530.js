var regex_syntax = [
    "(", "(?", ""
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