// (function () {

// if (define("Kit", [], function() {
function Kit() {
    function Set(e, a) {
        return e._Set ? e : (a || (e = sortUnique(e)),
            e.contains = function (t, n) {
                return !!~r(e, t, n)
            }
            ,
            e.indexOf = function (t, n) {
                return r(e, t, n)
            }
            ,
            e.toArray = function () {
                return i(e)
            }
            ,
            e.union = function (r) {
                r = Set(r);
                for (var n = e.length + r.length, a = new e.constructor(n), s = 0, o = 0, c = 0; c < n; c++)
                    e[s] === r[o] ? (a[c] = e[s++],
                        o++,
                        n--) : e[s] < r[o] ? a[c] = e[s++] : a[c] = r[o++];
                return a.length = n,
                    Set(a.length === n ? a : i(a, n), !0)
            }
            ,
            e.inspect = e.toArray,
            e._Set = !0,
            e)
    }
    function e(t, e) {
        return t < e ? E : t === e ? C : k
    }
    function r(t, r, n) {
        var i, a, s = 0, o = t.length, c = o - 1;
        if (o < 1)
            return -1;
        if (n = n || e,
            1 === o)
            return n(r, t[s]) === C ? s : -1;
        if (n(r, t[s]) === E || n(r, t[c]) === k)
            return -1;
        do {
            if (i = s + (c - s + 1 >> 1),
                (a = n(r, t[i])) === C)
                return i;
            a === E ? c = i - 1 : s = i + 1
        } while (s <= c); return -1
    }
    function sortUnique(t) {
        var e = t.length;
        if (e <= 1)
            return t;
        for (var r, n, a, s = 1, o = e / 3 | 0; s < o;)
            s = 3 * s + 1;
        for (; s > 0;) {
            for (r = s; r < e; r++)
                for (n = r; n >= s && t[n] < t[n - s]; n -= s)
                    a = t[n],
                        t[n] = t[n - s],
                        t[n - s] = a;
            s = s / 3 | 0
        }
        var c = t[0];
        for (r = 1,
            n = 1; r < e; r++)
            t[r] !== c && (c = t[n++] = t[r]);
        return t.length = n,
            t.length === n ? t : i(t, n)
    }
    function i(t, e) {
        e = void 0 === e ? t.length : e;
        for (var r = new t.constructor(e), n = e; n--;)
            r[n] = t[n];
        return r
    }
    function hasUnique(t) {
        for (var e, r = {}, n = 0, i = 0, a = t.length; n < a; n++)
            e = t[n],
                r.hasOwnProperty(e) || (r[e] = 1,
                    t[i++] = e);
        return t.length = i,
            t
    }
    function idUnique(t) {
        var e, r, n, i = t.length, a = (1e10 * Math.random()).toString(32) + (+new Date).toString(32);
        for (e = r = 0; e < i; e++)
            null != (n = t[e]) && (n.hasOwnProperty(a) || (Object.defineProperty(n, a, {
                value: 1,
                enumerable: !1
            }),
                t[r++] = n));
        for (e = r; e--;)
            t[e][a] = void 0;
        return t.length = r,
            t
    }
    function classify(t) {
        t = t.map(function (t) {
            return t[1] ? t : t + t
        });
        var e, r, i, a, s, o;
        t = sortUnique(t),
            o = t.length;
        var c, h, u = Object.create(null), l = Object.create(null), f = Object.create(null);
        for (e = 0; e < o; e++)
            for (s = t[e],
                h = s[1],
                l[s[0]] = !0,
                f[h] = !0,
                r = e; r < o; r++)
                if ((c = t[r][0]) >= h) {
                    c === h && (u[h] = !0);
                    break
                }
        var g = sortUnique(t.join("").split(""))
            , x = Object.keys(u)
            , v = g[0]
            , y = Object.create(null)
            , m = Object.create(null);
        for (e = 0; e < o; e++)
            y[t[e]] = [];
        if (u[v])
            for (e = 0; e < o; e++)
                if (s = t[e],
                    s[0] === v)
                    y[s].push(v);
                else if (s[0] > v)
                    break;
        for (e = 0,
            a = g.length - 1; e < a; e++) {
            if (c = g[e],
                h = g[e + 1],
                f[c] && (c = succ(c)),
                l[h] && (h = pred(h)),
                c <= h)
                for (v = c === h ? c : c + h,
                    r = 0; r < o && (s = t[r],
                        !(s[0] > h)); r++)
                    s[0] <= c && h <= s[1] && (y[s].push(v),
                        x.push(v));
            if (c = g[e],
                h = g[e + 1],
                u[h])
                for (r = 0; r < o && (s = t[r],
                    !(s[0] > h)); r++)
                    s[0] <= h && h <= s[1] && y[s].push(h)
        }
        x = sortUnique(x);
        for (i in y)
            m[i[0] === i[1] ? i[0] : i] = y[i];
        return {
            ranges: x,
            map: m
        }
    }
    function negate(t) {
        var e = String.fromCharCode(65535);
        t = classify(t).ranges;
        var r = [];
        if (!t.length)
            return r;
        "\0" !== t[0][0] && t.unshift(e);
        var n = t.length - 1;
        return (t[n][1] || t[n][0]) !== e && t.push("\0"),
            t.reduce(function (t, e) {
                var n = succ(t[1] || t[0])
                    , i = pred(e[0]);
                return n < i && r.push(n + i),
                    n === i && r.push(n),
                    e
            }),
            r
    }
    function parseCharset(t) {
        t = t.split("");
        var e = []
            , r = []
            , n = "^" === t[0] && t.length > 1 && t.shift();
        return t.forEach(function (t) {
            if ("-" == e[0] && e.length > 1) {
                if (e[1] > t)
                    throw new Error("Charset range out of order:" + e[1] + "-" + t + "!");
                r.push(e[1] + t),
                    e.splice(0, 2)
            } else
                e.unshift(t)
        }),
            r = r.concat(e),
            n ? negate(r) : classify(r).ranges
    }
    function coalesce(t) {
        if (!t.length)
            return [];
        var e = [t[0]];
        return t.reduce(function (t, r) {
            var n = e.length - 1;
            return t[t.length - 1] === pred(r[0]) ? e[n] = e[n][0] + r[r.length - 1] : (e.push(r),
                r)
        }),
            e.reduce(function (t, e) {
                return 2 === e.length && e[0] === pred(e[1]) ? (t.push(e[0]),
                    t.push(e[1])) : t.push(e),
                    t
            }, [])
    }
    function chr(t) {
        return String.fromCharCode(t)
    }
    function ord(t) {
        return t.charCodeAt(0)
    }
    function pred(t) {
        return String.fromCharCode(t.charCodeAt(0) - 1)
    }
    function succ(t) {
        return String.fromCharCode(t.charCodeAt(0) + 1)
    }
    function toPrint(t, e) {
        var r = /[\x00-\x1F\x7F-\x9F]/
            , n = /[\u009F-\uFFFF]/;
        return t = t.split("").map(function (t) {
            return !e && S.hasOwnProperty(t) ? S[t] : n.test(t) ? "\\u" + ("00" + ord(t).toString(16).toUpperCase()).slice(-4) : r.test(t) ? "\\x" + ("0" + ord(t).toString(16).toUpperCase()).slice(-2) : t
        }).join("")
    }
    function flatten2(t) {
        return [].concat.apply([], t)
    }
    function repeats(t, e) {
        return new Array(e + 1).join(t)
    }
    function log() {
        var t = _.call(arguments);
        if (isBrowser)
            Function.prototype.apply.apply(console.log, [console, t]);
        else {
            var e = require("util");
            t.forEach(function (t) {
                console.log(e.inspect(t, {
                    showHidden: !1,
                    customInspect: !0,
                    depth: 64,
                    colors: !0
                }))
            })
        }
    }
    function locals(t) {
        for (var e, r = t.toString(), n = /^\s+function\s+([a-zA-Z]\w+)\s*\(/gm, i = []; e = n.exec(r);)
            i.push(e[1]);
        for (var t, a = []; t = i.pop();)
            a.push(t + ":" + t);
        return "{\n" + a.join(",\n") + "\n}"
    }
    var b = Array.prototype
        , _ = b.slice
        , isBrowser = function () {
            return "[object Window]" === this.toString()
        }()
        , E = -1
        , C = 0
        , k = 1
        , S = {
            "\n": "\\n",
            "\t": "\\t",
            "\f": "\\f",
            "\r": "\\r",
            " ": " ",
            "\\": "\\\\",
            "\0": "\\0"
        };
    return {
        sortUnique: sortUnique,
        idUnique: idUnique,
        hashUnique: hasUnique,
        Set: Set,
        repeats: repeats,
        negate: negate,
        coalesce: coalesce,
        classify: classify,
        parseCharset: parseCharset,
        chr: chr,
        ord: ord,
        pred: pred,
        succ: succ,
        toPrint: toPrint,
        flatten2: flatten2,
        log: log,
        isBrowser: isBrowser,
        locals: locals
    }
}
    // })),

    // module.exports = {Kit};
// });
