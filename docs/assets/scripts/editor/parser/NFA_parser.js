// (function () {

// if (define("NFA", ["./Kit"], function(t) {
class NFA {
    constructor(validStructs) {
        // Inicializacion de funciones auxiliares
        let _auxKit = Kit();
        this.auxKit = _auxKit;

        // Parseo y preparacion de las transiciones de estado
        let [accepts, router] = this.prepareValidStructs(validStructs);

        this.router = router;
        this.accepts = accepts;
        this.unexpectedRouter = validStructs.unexpectedRouter;
        this.unexpectedToken = validStructs.unexpectedToken;
    }
    prepareValidStructs(validStructs) {
        let auxKit = this.auxKit;

        validStructs = validStructs.compact ? this._expandNames(validStructs) : validStructs;
        var s, accepts = {}, h = validStructs.trans, router = {}
        var n;
        for (s = 0, n = validStructs.accepts.length; s < n; s++) {
            accepts[validStructs.accepts[s]] = !0;
        }

        var l;
        for (s = 0, n = h.length; s < n; s++)
            l = h[s],
                l.charset ? l.ranges = "string" == typeof l.charset ? this.auxKit.parseCharset(l.charset) : l.charset : l.eMove = !0,
                l.from.forEach(function (t) {
                    var e = router[t] = router[t] || {
                        eMoveStates: [],
                        eMove: [],
                        charMove: {},
                        trans: [],
                        ranges: []
                    };
                    l.eMove ? e.eMoveStates = e.eMoveStates.concat(l.to) : e.ranges = e.ranges.concat(l.ranges),
                        e.trans.push(l)
                });
        Object.keys(router).forEach(function (e) {
            var r = router[e],
                n = r.trans,
                i = r.charMove,
                a = r.eMove,
                s = r.ranges,
                o = auxKit.classify(s),
                c = o.map;
            n.forEach(function (e) {
                e.eMove ? e.to.forEach(function (t) {
                    a.push({
                        to: t,
                        action: e.action,
                        assert: e.assert,
                        eMove: !0
                    })
                }) : auxKit.flatten2(e.ranges.map(function (t) {
                    return c[t]
                })).forEach(function (t) {
                    (i[t] = i[t] || []).push(e)
                })
            }),
                s = auxKit.Set(o.ranges.filter(function (t) {
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
        return [accepts, router];
    }
    accept(prop) {
        return this.accepts.hasOwnProperty(prop)
    }
    assertDFA() {
        for (var e, r = this.router, n = Object.keys(r), i = 0, a = n.length; i < a; i++) {
            if (e = r[n[i]],
                e.eMove.length > 1)
                throw new Error("DFA Assertion Fail!\nFrom state `" + n[i] + "` can goto to multi ε-move states!");
            for (var s = e.charMove, o = Object.keys(s), c = 0, h = o.length; c < h; c++) {
                if (1 !== s[o[c]].length)
                    throw this.auxKit.log(s),
                    new Error("DFA Assertion Fail!\nFrom state `" + n[i] + "` via charset `" + o[c] + "` can goto to multi states!")
            }
            if (o.length && e.eMove.length)
                throw new Error("DFA Assertion Fail!\nFrom state `" + n[i] + "` can goto extra ε-move state!")
        }
        return !0
    }
    input(inRegexRaw, inLastIndex, debug) {
        function parseInput(regexRaw, lastIndex, lastState, lastStack, prevIndex) {
            t: for (; ;) {
                var actualChar, l, f, regexObj, nodeMove = that.router[lastState];
                if (!nodeMove) break;
                var nextStates, _eMove = nodeMove.eMove, _charMove = nodeMove.charMove;
                if (lastIndex < regexRaw.length) {
                    actualChar = regexRaw[lastIndex];
                    if (_charMove.hasOwnProperty(actualChar)) {
                        nextStates = _charMove[actualChar];
                    }
                    else {
                        l = that._escapeChar(nodeMove.ranges, actualChar);
                        if (l) {
                            nextStates = _charMove[l];
                        }
                        else {
                            // No se tiene este caracter, el nextStates debera ser unexpected_char
                            nextStates = _eMove.length === 0 ? [{
                                action: that.unexpectedToken,
                                assert: undefined,
                                eMove: undefined,
                                to: "exact"
                            }] : _eMove;
                        }
                    }
                }
                else {
                    nextStates = _eMove;
                }
                for (var _hypState, resAssertedState, _regexObj, lastStackLength = lastStack.length, w = prevIndex, iState = 0, sizeStates = nextStates.length; iState < sizeStates; iState++) {
                    if (_hypState = nextStates[iState], f = _hypState.eMove ? 0 : 1, prevIndex = w, lastStack.splice(0, lastStack.length - lastStackLength), lastStackLength = lastStack.length, _hypState.assert) {
                        resAssertedState = _hypState.assert(lastStack, actualChar, lastIndex, lastState, regexRaw);
                        if (!resAssertedState) continue;
                        if (typeof resAssertedState == "number") {
                            lastIndex += resAssertedState;
                            prevIndex += resAssertedState;
                        }
                    }
                    // 
                    if (_hypState.action) {
                        let _nAction = _hypState.action(lastStack, actualChar, lastIndex, lastState, regexRaw);
                        if (_nAction) lastStack = _nAction;
                    }
                    prevIndex = _hypState.eMove ? prevIndex : lastIndex;
                    debug && that.auxKit.log(`${actualChar}:${lastState}>${_hypState.to}`);
                    if (iState === sizeStates - 1) {
                        lastIndex += f;
                        lastState = _hypState.to;
                        continue t
                    }
                    if (_regexObj = parseInput(regexRaw, lastIndex + f, _hypState.to, lastStack, prevIndex), _regexObj.acceptable)
                        return _regexObj;
                    regexObj = _regexObj
                }
                if (regexObj)
                    return regexObj;
                break
            }
            return {
                stack: lastStack,
                lastIndex: prevIndex,
                lastState: lastState,
                acceptable: that.accept(lastState)
            }
        }
        inLastIndex = inLastIndex || 0;
        // Capturo el objeto en una variable accesible a la funcion interior, ya que es recursiva
        var that = this;
        return parseInput(inRegexRaw, inLastIndex, "start", [], inLastIndex - 1)
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