// (function () {

// if (define("NFA", ["./Kit"], function(t) {
class NFA {
    constructor(e) {
        // Inicializacion de funciones auxiliares
        var _auxKit = Kit();

        e = e.compact ? this._expandNames(e) : e;
        var s, o = {}, h = e.trans, _router = {}
        var n;
        for (s = 0, n = e.accepts.length; s < n; s++) {
            o[e.accepts[s]] = !0;
        }

        var l;
        for (s = 0, n = h.length; s < n; s++)
            l = h[s],
                l.charset ? l.ranges = "string" == typeof l.charset ? _auxKit.parseCharset(l.charset) : l.charset : l.eMove = !0,
                l.from.forEach(function (t) {
                    var e = _router[t] = _router[t] || {
                        eMoveStates: [],
                        eMove: [],
                        charMove: {},
                        trans: [],
                        ranges: []
                    };
                    l.eMove ? e.eMoveStates = e.eMoveStates.concat(l.to) : e.ranges = e.ranges.concat(l.ranges),
                        e.trans.push(l)
                });
        Object.keys(_router).forEach(function (e) {
            var r = _router[e],
                n = r.trans,
                i = r.charMove,
                a = r.eMove,
                s = r.ranges,
                o = _auxKit.classify(s),
                c = o.map;
            n.forEach(function (e) {
                e.eMove ? e.to.forEach(function (t) {
                    a.push({
                        to: t,
                        action: e.action,
                        assert: e.assert,
                        eMove: !0
                    })
                }) : _auxKit.flatten2(e.ranges.map(function (t) {
                    return c[t]
                })).forEach(function (t) {
                    (i[t] = i[t] || []).push(e)
                })
            }),
                s = _auxKit.Set(o.ranges.filter(function (t) {
                    return !!t[1]
                })),
                r.ranges = s,
                Object.keys(i).forEach(function (t) {
                    var e = i[t]
                        , r = [];
                    n.forEach(function (t) {
                        t.to.forEach(function (n) {
                            (t.eMove || ~e.indexOf(t)) && r.push({
                                to: n,
                                action: t.action,
                                assert: t.assert,
                                eMove: t.eMove
                            })
                        })
                    }),
                        i[t] = r
                }),
                delete r.trans,
                delete r.eMoveStates
        });

        this.router = _router;
        this.accepts = o;
        // this.NFAobject = {
        //   accepts: this.accepts,
        //   router: _router,
        //   input: this.input,
        //   assertDFA: this.assertDFA,
        //   accept: this.accept
        // }
    }
    accept(t) {
        return this.accepts.hasOwnProperty(t)
    }
    assertDFA() {
        for (var e, r = this.router, n = Object.keys(r), i = 0, a = n.length; i < a; i++) {
            if (e = r[n[i]],
                e.eMove.length > 1)
                throw new Error("DFA Assertion Fail!\nFrom state `" + n[i] + "` can goto to multi ε-move states!");
            for (var s = e.charMove, o = Object.keys(s), c = 0, h = o.length; c < h; c++) {
                if (1 !== s[o[c]].length)
                    throw _auxKit.log(s),
                    new Error("DFA Assertion Fail!\nFrom state `" + n[i] + "` via charset `" + o[c] + "` can goto to multi states!")
            }
            if (o.length && e.eMove.length)
                throw new Error("DFA Assertion Fail!\nFrom state `" + n[i] + "` can goto extra ε-move state!")
        }
        return !0
    }
    input(e, r, n) {
        function i(regexRaw, lastIndex, lastState, lastStack, h) {
            t: for (; ;) {
                var actualChar, l, f, p, d = a.router[lastState];
                if (!d)
                    break;
                var g, x = d.eMove, v = d.charMove;
                lastIndex < regexRaw.length ? (actualChar = regexRaw[lastIndex], g = v.hasOwnProperty(actualChar) ? v[actualChar] : (l = a._escapeChar(d.ranges, actualChar)) ? v[l] : x) : g = x;
                for (var y, m, b, _ = lastStack.length, w = h, E = 0, C = g.length; E < C; E++) {
                    if (y = g[E], f = y.eMove ? 0 : 1, h = w, lastStack.splice(0, lastStack.length - _), _ = lastStack.length, y.assert) {
                        if (!1 === (m = y.assert(lastStack, actualChar, lastIndex, lastState, regexRaw)))
                            continue;
                        "number" == typeof m && (lastIndex += m, h += m)
                    }
                    if (y.action && (lastStack = y.action(lastStack, actualChar, lastIndex, lastState, regexRaw) || lastStack),
                        h = y.eMove ? h : lastIndex,
                        n && _auxKit.log(actualChar + ":" + lastState + ">" + y.to),
                        E === C - 1) {
                        lastIndex += f,
                            lastState = y.to;
                        continue t
                    }
                    if (b = i(regexRaw, lastIndex + f, y.to, lastStack, h), b.acceptable)
                        return b;
                    p = b
                }
                if (p)
                    return p;
                break
            }
            return {
                stack: lastStack,
                lastIndex: h,
                lastState: lastState,
                acceptable: a.accept(lastState)
            }
        }
        r = r || 0;
        // Capturo el objeto en una variable accesible a la funcion interior, ya que es recursiva
        var a = this;
        return i(e, r, "start", [], r - 1)
    }

    // Funciones auxiliares
    _aux_escapeChar(t, e) {
        var r = e[0];
        return t > e[1] ? 1 : t < r ? -1 : 0
    }
    _escapeChar(t, e) {
        var r = t.indexOf(e, this._aux_escapeChar);
        return !!~r && t[r]
    }
    _expandNames(validNames) {
        validNames.accepts = validNames.accepts.split(",");
        for (var e, r, n, i, a = validNames.trans, s = a.length; s--;)
            e = a[s],
                r = e[0].split(">"),
                n = r[0].split(","),
                i = r[1].split(","),
                a[s] = {
                    from: n,
                    to: i,
                    charset: e[1],
                    action: e[2],
                    assert: e[3]
                };
        return validNames.compact = !1, validNames
    }
}

    // module.exports = {NFA};
// });