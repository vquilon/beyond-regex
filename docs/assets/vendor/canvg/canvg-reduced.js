!function (t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e(require("rgbcolor"), require("stackblur-canvas")) : "function" == typeof define && define.amd ? define(["rgbcolor", "stackblur-canvas"], e) : t.canvgv2 = e(t.RGBColor, t.StackBlur)
}(this, function (t, e) {
    "use strict";
    var i;
    return t = t && t.hasOwnProperty("default") ? t.default : t,
        e = e && e.hasOwnProperty("default") ? e.default : e,
        function (i) {
            i.exports;
            var n, s = !1;
            (n = window).DOMParser = window.DOMParser;
            var a = n.document
                , r = 800
                , o = 600;
            var l, u = function (t, e, i) {
                if (null != t || null != e || null != i) {
                    var n = x(i || {});
                    "string" == typeof t && (t = a.getElementById(t)),
                        null != t.svg && t.svg.stop(),
                        t.childNodes && 1 == t.childNodes.length && "OBJECT" == t.childNodes[0].nodeName || (t.svg = n);
                    var s = t.getContext("2d");
                    void 0 !== e.documentElement ? n.loadXmlDoc(s, e) : "<" == e.substr(0, 1) ? n.loadXml(s, e) : n.load(s, e)
                } else
                    for (var r = a.querySelectorAll("svg"), o = 0; o < r.length; o++) {
                        var h = r[o]
                            , l = a.createElement("canvas");
                        if (void 0 !== h.clientWidth && void 0 !== h.clientHeight)
                            l.width = h.clientWidth,
                                l.height = h.clientHeight;
                        else {
                            var c = h.getBoundingClientRect();
                            l.width = c.width,
                                l.height = c.height
                        }
                        h.parentNode.insertBefore(l, h),
                            h.parentNode.removeChild(h);
                        var f = a.createElement("div");
                        f.appendChild(h),
                            u(l, f.innerHTML)
                    }
            };
            "undefined" == typeof Element || (void 0 !== Element.prototype.matches ? l = function (t, e) {
                return t.matches(e)
            }
                : void 0 !== Element.prototype.webkitMatchesSelector ? l = function (t, e) {
                    return t.webkitMatchesSelector(e)
                }
                    : void 0 !== Element.prototype.mozMatchesSelector ? l = function (t, e) {
                        return t.mozMatchesSelector(e)
                    }
                        : void 0 !== Element.prototype.msMatchesSelector ? l = function (t, e) {
                            return t.msMatchesSelector(e)
                        }
                            : void 0 !== Element.prototype.oMatchesSelector ? l = function (t, e) {
                                return t.oMatchesSelector(e)
                            }
                                : ("function" != typeof jQuery && "function" != typeof Zepto || (l = function (t, e) {
                                    return $(t).is(e)
                                }
                                ),
                                    void 0 === l && "undefined" != typeof Sizzle && (l = Sizzle.matchesSelector)));
            var c = /(\[[^\]]+\])/g
                , f = /(#[^\s\+>~\.\[:]+)/g
                , p = /(\.[^\s\+>~\.\[:]+)/g
                , d = /(::[^\s\+>~\.\[:]+|:first-line|:first-letter|:before|:after)/gi
                , m = /(:[\w-]+\([^\)]*\))/gi
                , y = /(:[^\s\+>~\.\[:]+)/g
                , v = /([^\s\+>~\.\[:]+)/g;