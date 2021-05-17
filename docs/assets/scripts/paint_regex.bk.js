// (function () {
    // var { Kit } = require("./auxiliar_functions");
    // var { NFA }  = require("./NFA_parser");

    // if (define("parse", ["./NFA", "./Kit"], function(t, e) {
    function parse(tp, ep) {
        var auxKit = Kit();
        var nodeType = {};
        function r() {
            var t = Object.keys(nodeType).map(function (t) {
                return t + "=" + JSON.stringify(nodeType[t])
            }).join(";");
            (function () {
                return this
            }
            )().eval(t)
        }
        function create_regexObject(_regexObject) {
            this.raw = _regexObject.raw;
            this.tree = _regexObject.tree;
            this.groupCount = _regexObject.groupCount;
        }
        function init_object(t, e) {
            d = e;
            var r, i, error_lastState, p = load_NFA_Parser();
            r = p.input(t, 0, e),
                i = r.stack,
                i = elementsCallback.endChoice(i),
                error_lastState = r.lastState;
            var g = r.acceptable && r.lastIndex === t.length - 1;
            if (!g) {
                var x;
                switch (error_lastState) {
                    case "charsetRangeEndWithNullChar":
                        x = {
                            type: "CharsetRangeEndWithNullChar",
                            message: "Charset range end with NUL char does not make sense!\nBecause [a-\\0] is not a valid range.\nAnd [\\0-\\0] should be rewritten into [\\0]."
                        };
                        break;
                    case "repeatErrorFinal":
                        x = {
                            type: "NothingRepeat",
                            message: "Nothing to repeat!"
                        };
                        break;
                    case "digitFollowNullError":
                        x = {
                            type: "DigitFollowNullError",
                            message: "The '\\0' represents the <NUL> char and cannot be followed by a decimal digit!"
                        };
                        break;
                    case "charsetRangeEndClass":
                        x = {
                            type: "CharsetRangeEndClass",
                            message: 'Charset range ends with class such as "\\w\\W\\d\\D\\s\\S" is invalid!'
                        };
                        break;
                    case "charsetOctEscape":
                        x = {
                            type: "DecimalEscape",
                            message: "Decimal escape appears in charset is invalid.Because it can't be explained as  backreference.And octal escape is deprecated!"
                        };
                        break;
                    default:
                        0 === error_lastState.indexOf("charset") ? x = {
                            type: "UnclosedCharset",
                            message: "Unterminated character class!"
                        } : ")" === t[r.lastIndex] ? x = {
                            type: "UnmatchedParen",
                            message: "Unmatched end parenthesis!"
                        } : (x = {
                            type: "UnexpectedChar",
                            message: "Unexpected char!"
                        },
                            r.lastIndex++)
                }
                if (x)
                    throw x.lastIndex = r.lastIndex,
                    x.lastStack = r.stack,
                    x.lastState = error_lastState,
                    new define_regexError(x)
            }
            if (i._parentGroup)
                throw new define_regexError({
                    type: "UnterminatedGroup",
                    message: "Unterminated group!",
                    lastIndex: i._parentGroup.indices[0],
                    lastState: error_lastState,
                    lastStack: i
                });
            if (g) {
                var y = i.groupCounter ? i.groupCounter.i : 0;
                delete i.groupCounter,
                    h(i, t, t.length),
                    i = o(i);
                var m = new create_regexObject({
                    raw: t,
                    groupCount: y,
                    tree: i
                });
                return m.traverse(l, CHARSET_NODE),
                    m.traverse(u, ASSERT_NODE),
                    c(i),
                    d = !1,
                    m
            }
        }
        function load_NFA_Parser() {
            return NFAparser || (NFAparser = new NFA(validStructs)), NFAparser
        }
        function s(t, e, r) {
            Object.defineProperty(t, e, {
                value: r,
                enumerable: d,
                writable: !0,
                configurable: !0
            })
        }
        function o(t) {
            return t.filter(function (t) {
                return t.type == EXACT_NODE && t.concatTemp ? (delete t.concatTemp,
                    !!t.chars) : (t.sub ? t.sub = o(t.sub) : t.branches && (t.branches = t.branches.map(o)),
                        !0)
            })
        }
        function c(t) {
            function e(t) {
                t.sub ? c(t.sub) : t.branches && t.branches.map(c)
            }
            var r = t[0];
            e(r);
            for (var n, i = 1, a = 1, s = t.length; i < s; i++) {
                if (n = t[i],
                    n.type === EXACT_NODE) {
                    if (r.type === EXACT_NODE && !r.repeat && !n.repeat) {
                        r.indices[1] = n.indices[1],
                            r.raw += n.raw,
                            r.chars += n.chars;
                        continue
                    }
                } else
                    e(n);
                t[a++] = n,
                    r = n
            }
            r && (t.length = a)
        }
        function h(t, e, r) {
            if (!t.length)
                return void t.push({
                    type: EMPTY_NODE,
                    indices: [r, r]
                });
            t.reduce(function (t, r) {
                return r.indices.push(t),
                    r.raw = e.slice(r.indices[0], t),
                    r.type === GROUP_NODE || r.type === ASSERT_NODE && r.sub ? h(r.sub, e, r.endParenIndex) : r.type === CHOICE_NODE ? (r.branches.reduce(function (t, r) {
                        h(r, e, t);
                        var n = r[0];
                        return (n ? n.indices[0] : t) - 1
                    }, t),
                        r.branches.reverse()) : r.type === EXACT_NODE && (r.concatTemp || (r.chars = r.chars || r.raw)),
                    r.indices[0]
            }, r),
                t.reverse()
        }
        function u(t) {
            if (t.repeat) {
                var e = t.assertionType
                    , r = "Nothing to repeat! Repeat after assertion doesn't make sense!";
                if ("AssertLookahead" === e || "AssertNegativeLookahead" === e) {
                    var n = "AssertLookahead" === e ? "?=" : "?!"
                        , i = "(" + n + "b)";
                    r += "\n/a" + i + "+/、/a" + i + "{1,n}/ are the same as /a" + i + "/。\n/a" + i + "*/、/a" + i + "{0,n}/、/a" + i + "?/ are the same as /a/。"
                }
                throw new define_regexError({
                    type: "NothingRepeat",
                    lastIndex: t.indices[1] - 1,
                    message: r
                })
            }
        }
        function l(t) {
            t.ranges = auxKit.sortUnique(t.ranges.map(function (t) {
                if (t[0] > t[1])
                    throw new define_regexError({
                        type: "OutOfOrder",
                        lastIndex: t.lastIndex,
                        message: "Range [" + t.join("-") + "] out of order in character class!"
                    });
                return t.join("")
            }))
        }
        function define_regexError(t) {
            this.name = "RegexSyntaxError",
                this.type = t.type,
                this.lastIndex = t.lastIndex,
                this.lastState = t.lastState,
                this.lastStack = t.lastStack,
                this.message = t.message,
                Object.defineProperty(this, "stack", {
                    value: new Error(t.message).stack,
                    enumerable: !1
                })
        }
        nodeType = {
            EXACT_NODE: "exact",
            CHARSET_NODE: "charset",
            CHOICE_NODE: "choice",
            GROUP_NODE: "group",
            ASSERT_NODE: "assert",
            DOT_NODE: "dot",
            BACKREF_NODE: "backref",
            EMPTY_NODE: "empty",
            AssertLookahead: "AssertLookahead",
            AssertNegativeLookahead: "AssertNegativeLookahead",
            AssertNonWordBoundary: "AssertNonWordBoundary",
            AssertWordBoundary: "AssertWordBoundary",
            AssertEnd: "AssertEnd",
            AssertBegin: "AssertBegin"
        };
        r(),
            create_regexObject.prototype.traverse = function (t, e) {
                function r(t, n) {
                    t.forEach(function (t) {
                        e && t.type !== e || n(t),
                            t.sub ? r(t.sub, n) : t.branches && t.branches.forEach(function (t) {
                                r(t, n)
                            })
                    })
                }
                r(this.tree, t)
            };

        var d;
        init_object.Constants = nodeType,
            init_object.exportConstants = r,
            init_object.RegexSyntaxError = define_regexError,
            init_object.getNFAParser = load_NFA_Parser;

        var NFAparser;
        define_regexError.prototype.toString = function () {
            return this.name + " " + this.type + ":" + this.message
        };
        var specialChars = {
            n: "\n",
            r: "\r",
            t: "\t",
            v: "\v",
            f: "\f"
        }
        var elementsCallback = function () {
            function f_exact(t, e, r) {
                var n = t[0];
                (!n || n.type != EXACT_NODE || n.repeat || n.chars && !n.concatTemp) && t.unshift({
                    id: Math.random().toString(36).substr(2, 9),
                    type: EXACT_NODE,
                    indices: [r]
                }),
                    n && n.concatTemp && (n.chars += e)
            }
            function f_dot(t, e, r) {
                t.unshift({
                    id: Math.random().toString(36).substr(2, 9),
                    type: DOT_NODE,
                    indices: [r]
                })
            }
            function f_nullChar(t, e, r) {
                t.unshift({
                    id: Math.random().toString(36).substr(2, 9),
                    type: EXACT_NODE,
                    chars: "\0",
                    indices: [r - 1]
                })
            }
            function f_assertBegin(t, e, r) {
                t.unshift({
                    id: Math.random().toString(36).substr(2, 9),
                    type: ASSERT_NODE,
                    indices: [r],
                    assertionType: AssertBegin
                })
            }
            function f_assertEnd(t, e, r, n, i) {
                t.unshift({
                    id: Math.random().toString(36).substr(2, 9),
                    type: ASSERT_NODE,
                    indices: [r],
                    assertionType: AssertEnd
                })
            }
            function f_assertWordBoundary(t, e, r) {
                t.unshift({
                    id: Math.random().toString(36).substr(2, 9),
                    type: ASSERT_NODE,
                    indices: [r - 1],
                    assertionType: "b" == e ? AssertWordBoundary : AssertNonWordBoundary
                })
            }
            function f_repeatnStart(t, e, r) {
                t[0].type !== EXACT_NODE && t.unshift({
                    id: Math.random().toString(36).substr(2, 9),
                    type: EXACT_NODE,
                    indices: [r]
                })
            }
            /**
             * 
             * @param {*} t 
             * @param {*} e 
             * @param {*} r 
             */
            function f_repeatnComma(t, e, r) {
                s(t[0], "_commaIndex", r)
            }
            /**
             * Captura las repeticiones dentro de llaves, como {}
             * @summary If the description is long, write your summary here. Otherwise, feel free to remove this.
             * @param {*} t 
             * @param {*} e 
             * @param {*} r 
             * @param {*} n 
             * @param {*} i 
             */
            function f_repeatnEnd(t, e, r, n, i) {
                var a, s = t[0], o = i.lastIndexOf("{", r), c = parseInt(i.slice(o + 1, s._commaIndex || r), 10);
                if (s._commaIndex) {
                    if ((a = s._commaIndex + 1 == r ? 1 / 0 : parseInt(i.slice(s._commaIndex + 1, r), 10)) < c)
                        throw new define_regexError({
                            type: "OutOfOrder",
                            lastState: n,
                            lastIndex: r,
                            lastStack: t,
                            message: "Numbers out of order in {} quantifier!"
                        });
                    delete s._commaIndex
                } else
                    a = c;
                s.indices[0] >= o && t.shift(),
                    f_aux_repeated(t, c, a, o, i)
            }
            function f_repeat0ToInf(t, e, r, n, i) {
                f_aux_repeated(t, 0, 1 / 0, r, i)
            }
            function f_repeat0To1(t, e, r, n, i) {
                f_aux_repeated(t, 0, 1, r, i)
            }
            function f_repeat1ToInf(t, e, r, n, i) {
                f_aux_repeated(t, 1, 1 / 0, r, i)
            }
            function f_aux_repeated(t, e, r, n, i) {
                var a = t[0]
                    , o = {
                        min: e,
                        max: r,
                        nonGreedy: !1
                    }
                    , c = n - 1;
                if (a.chars && 1 === a.chars.length && (c = a.indices[0]),
                    a.type === EXACT_NODE) {
                    var h = {
                        id: Math.random().toString(36).substr(2, 9),
                        type: EXACT_NODE,
                        repeat: o,
                        chars: a.chars ? a.chars : i[c],
                        indices: [c]
                    };
                    a.indices[0] === c && t.shift(),
                        t.unshift(h)
                } else
                    a.repeat = o;
                s(o, "beginIndex", n - t[0].indices[0])
            }
            function f_repeatNonGreedy(t) {
                t[0].repeat.nonGreedy = !0
            }
            function f_escapeStart(t, e, r) {
                t.unshift({
                    concatTemp: !0,
                    id: Math.random().toString(36).substr(2, 9),
                    type: EXACT_NODE,
                    chars: "",
                    indices: [r]
                })
            }
            function f_normalEscape(t, e, r) {
                specialChars.hasOwnProperty(e) && (e = specialChars[e]),
                    t.unshift({
                        id: Math.random().toString(36).substr(2, 9),
                        type: EXACT_NODE,
                        chars: e,
                        indices: [r - 1]
                    })
            }
            function f_charClassEscape(t, e, r) {
                t.unshift({
                    id: Math.random().toString(36).substr(2, 9),
                    type: CHARSET_NODE,
                    indices: [r - 1],
                    chars: "",
                    ranges: [],
                    classes: [e],
                    exclude: !1
                })
            }
            function f_hexEscape(t, e, r, n, i) {
                e = String.fromCharCode(parseInt(i[r - 1] + e, 16)),
                    t.shift(),
                    t.unshift({
                        id: Math.random().toString(36).substr(2, 9),
                        type: EXACT_NODE,
                        chars: e,
                        indices: [r - 3]
                    })
            }
            function f_unicodeEscape(t, e, r, n, i) {
                e = String.fromCharCode(parseInt(i.slice(r - 3, r + 1), 16)),
                    t.shift(),
                    t.unshift({
                        id: Math.random().toString(36).substr(2, 9),
                        type: EXACT_NODE,
                        chars: e,
                        indices: [r - 5]
                    })
            }
            function f_groupStart(t, e, r) {
                var n = t.groupCounter = t.groupCounter || {
                    i: 0
                };
                n.i++;
                var i = {
                    id: Math.random().toString(36).substr(2, 9),
                    type: GROUP_NODE,
                    name: "",
                    num: n.i,
                    sub: [],
                    indices: [r],
                    _parentStack: t
                };
                return t = i.sub,
                    s(t, "_parentGroup", i),
                    t.groupCounter = n,
                    t
            }
            function f_groupNonCapture(t) {
                var e = t._parentGroup;
                e.nonCapture = !0,
                    e.num = void 0,
                    t.groupCounter.i--
            }
            function f_groupNamedContent(t, e) {
                var n = t._parentGroup;
                n.name += e;
            }
            function f_groupToAssertion(t, e, r) {
                var n = t._parentGroup;
                n.type = ASSERT_NODE,
                    n.assertionType = "=" == e ? AssertLookahead : AssertNegativeLookahead,
                    n.num = void 0,
                    t.groupCounter.i--
            }
            function f_groupEnd(t, e, r, n, i) {
                t = f_endChoice(t);
                var a = t._parentGroup;
                if (!a)
                    throw new define_regexError({
                        type: "UnexpectedChar",
                        lastIndex: r,
                        lastState: n,
                        lastStack: t,
                        message: "Unexpected end parenthesis!"
                    });
                return delete t._parentGroup,
                    delete t.groupCounter,
                    t = a._parentStack,
                    delete a._parentStack,
                    t.unshift(a),
                    a.endParenIndex = r,
                    t
            }
            function f_choice(t, e, r) {
                var n, i = [];
                if (t._parentChoice)
                    n = t._parentChoice,
                        n.branches.unshift(i),
                        s(i, "_parentChoice", n),
                        s(i, "_parentGroup", n),
                        i.groupCounter = t.groupCounter,
                        delete t._parentChoice,
                        delete t.groupCounter;
                else {
                    var a = t[t.length - 1];
                    n = {
                        id: Math.random().toString(36).substr(2, 9),
                        type: CHOICE_NODE,
                        indices: [a ? a.indices[0] : r - 1],
                        branches: []
                    },
                        s(n, "_parentStack", t),
                        n.branches.unshift(t.slice()),
                        t.length = 0,
                        t.unshift(n),
                        i.groupCounter = t.groupCounter,
                        s(i, "_parentChoice", n),
                        s(i, "_parentGroup", n),
                        n.branches.unshift(i)
                }
                return i
            }
            function f_endChoice(t) {
                if (t._parentChoice) {
                    var e = t._parentChoice;
                    delete t._parentChoice,
                        delete t._parentGroup,
                        delete t.groupCounter;
                    var r = e._parentStack;
                    return delete e._parentStack,
                        r
                }
                return t
            }
            function f_charsetStart(t, e, r) {
                t.unshift({
                    id: Math.random().toString(36).substr(2, 9),
                    type: CHARSET_NODE,
                    indices: [r],
                    classes: [],
                    ranges: [],
                    chars: ""
                })
            }
            function f_charsetExclude(t) {
                t[0].exclude = !0
            }
            function f_charsetContent(t, e, r) {
                t[0].chars += e
            }
            function f_charsetNormalEscape(t, e, r) {
                specialChars.hasOwnProperty(e) && (e = specialChars[e]),
                    t[0].chars += e
            }
            function f_charsetNullChar(t, e, r) {
                t[0].chars += "\0"
            }
            function f_charsetClassEscape(t, e) {
                t[0].classes.push(e)
            }
            function f_charsetHexEscape(t, e, r, n, i) {
                var a = t[0];
                e = String.fromCharCode(parseInt(a.chars.slice(-1) + e, 16)),
                    a.chars = a.chars.slice(0, -2),
                    a.chars += e
            }
            function f_charsetUnicodeEscape(t, e, r, n, i) {
                var a = t[0];
                e = String.fromCharCode(parseInt(a.chars.slice(-3) + e, 16)),
                    a.chars = a.chars.slice(0, -4),
                    a.chars += e
            }
            function f_charsetRangeEnd(t, e, r, n, i) {
                var a = t[0]
                    , s = a.chars.slice(-2);
                s = [s[0], e],
                    s.lastIndex = r,
                    a.ranges.push(s),
                    a.chars = a.chars.slice(0, -2)
            }
            function f_charsetRangeEndNormalEscape(t, e) {
                specialChars.hasOwnProperty(e) && (e = specialChars[e]),
                    f_charsetRangeEnd.apply(this, arguments)
            }
            function f_charsetRangeEndUnicodeEscape(t, e, r) {
                var n = t[0]
                    , i = n.chars.slice(-3) + e;
                n.chars = n.chars.slice(0, -3);
                var a = n.ranges.pop();
                e = String.fromCharCode(parseInt(i, 16)),
                    a = [a[0], e],
                    a.lastIndex = r,
                    n.ranges.push(a)
            }
            function f_charsetRangeEndHexEscape(t, e, r) {
                var n = t[0]
                    , i = n.chars.slice(-1) + e;
                n.chars = n.chars.slice(0, -1);
                var a = n.ranges.pop();
                e = String.fromCharCode(parseInt(i, 16)),
                    a = [a[0], e],
                    a.lastIndex = r,
                    n.ranges.push(a)
            }
            function f_backref(t, e, r, n) {
                function i(t, e) {
                    return !!e._parentGroup && (e._parentGroup.num == t ? t : i(t, e._parentGroup._parentStack))
                }
                var a = t[0]
                    , s = parseInt(e, 10)
                    , o = "escape" === n
                    , c = t.groupCounter
                    , h = c && c.i || 0;
                if (o ? (a = {
                    id: Math.random().toString(36).substr(2, 9),
                    type: BACKREF_NODE,
                    indices: [r - 1]
                },
                    t.unshift(a)) : s = parseInt(a.num + "" + s, 10),
                    s > h)
                    throw new define_regexError({
                        type: "InvalidBackReference",
                        lastIndex: r,
                        lastStack: t,
                        lastState: n,
                        message: "Back reference number(" + s + ") greater than current groups count(" + h + ")."
                    });
                if (i(s, t))
                    throw new define_regexError({
                        type: "InvalidBackReference",
                        lastIndex: r,
                        lastStack: t,
                        lastState: n,
                        message: "Recursive back reference in group (" + s + ") itself."
                    });
                a.num = s
            }
            return {
                escapeStart: f_escapeStart,
                exact: f_exact,
                dot: f_dot,
                nullChar: f_nullChar,
                assertBegin: f_assertBegin,
                assertEnd: f_assertEnd,
                assertWordBoundary: f_assertWordBoundary,
                repeatnStart: f_repeatnStart,
                repeatnComma: f_repeatnComma,
                repeatNonGreedy: f_repeatNonGreedy,
                repeatnEnd: f_repeatnEnd,
                repeat1ToInf: f_repeat1ToInf,
                repeat0To1: f_repeat0To1,
                repeat0ToInf: f_repeat0ToInf,
                charClassEscape: f_charClassEscape,
                normalEscape: f_normalEscape,
                unicodeEscape: f_unicodeEscape,
                hexEscape: f_hexEscape,
                charClassEscape: f_charClassEscape,
                groupStart: f_groupStart,
                groupNonCapture: f_groupNonCapture,
                groupNamedContent: f_groupNamedContent,
                backref: f_backref,
                groupToAssertion: f_groupToAssertion,
                groupEnd: f_groupEnd,
                choice: f_choice,
                endChoice: f_endChoice,
                charsetStart: f_charsetStart,
                charsetExclude: f_charsetExclude,
                charsetContent: f_charsetContent,
                charsetNullChar: f_charsetNullChar,
                charsetClassEscape: f_charsetClassEscape,
                charsetHexEscape: f_charsetHexEscape,
                charsetUnicodeEscape: f_charsetUnicodeEscape,
                charsetRangeEnd: f_charsetRangeEnd,
                charsetNormalEscape: f_charsetNormalEscape,
                charsetRangeEndNormalEscape: f_charsetRangeEndNormalEscape,
                charsetRangeEndUnicodeEscape: f_charsetRangeEndUnicodeEscape,
                charsetRangeEndHexEscape: f_charsetRangeEndHexEscape
            }
        }()
        var charset_hex = "0-9a-fA-F"
        var names_repeat = "repeatnStart,repeatn_1,repeatn_2,repeatnErrorStart,repeatnError_1,repeatnError_2"
        var names_hexEscape = "hexEscape1,hexEscape2"
        var names_unicodeEscape = "unicodeEscape1,unicodeEscape2,unicodeEscape3,unicodeEscape4"
        var names_charsetUnicodeEscape = "charsetUnicodeEscape1,charsetUnicodeEscape2,charsetUnicodeEscape3,charsetUnicodeEscape4,charsetHexEscape1,charsetHexEscape2"
        // Estas estructuras componen el arbol de posibilidades que puede tener cada caracter
        var validStructs = {
            compact: !0,
            accepts: "start,begin,end,repeat0,repeat1,exact,repeatn,repeat01,repeatNonGreedy,choice," + names_repeat + ",nullChar,digitBackref," + names_unicodeEscape + "," + names_hexEscape,
            trans: [
                ["start,begin,end,exact,repeatNonGreedy,repeat0,repeat1,repeat01,groupStart,groupQualifiedStart,choice,repeatn>exact", "^+*?^$.|(){[\\", elementsCallback.exact],
                ["hexEscape1,hexEscape2,unicodeEscape1,unicodeEscape2,unicodeEscape3,unicodeEscape4>exact", "^+*?^$.|(){[\\0-9a-fA-F", elementsCallback.exact],
                ["nullChar>exact", "^+*?^$.|(){[\\0-9", elementsCallback.exact],
                [names_repeat + ",nullChar,digitBackref," + names_unicodeEscape + "," + names_hexEscape + ",start,begin,end,exact,repeatNonGreedy,repeat0,repeat1,repeat01,groupStart,groupQualifiedStart,choice,repeatn>exact", ".", elementsCallback.dot],
                ["start,groupStart,groupQualifiedStart,end,begin,exact,repeat0,repeat1,repeat01,repeatn,repeatNonGreedy,choice," + names_repeat + ",nullChar,digitBackref," + names_unicodeEscape + "," + names_hexEscape + ">begin", "^", elementsCallback.assertBegin],
                [names_repeat + ",nullChar,digitBackref," + names_unicodeEscape + "," + names_hexEscape + ",exact>repeatnStart", "{", elementsCallback.repeatnStart],
                ["start,begin,end,groupQualifiedStart,groupStart,repeat0,repeat1,repeatn,repeat01,repeatNonGreedy,choice>repeatnErrorStart", "{", elementsCallback.exact],
                ["repeatnStart>repeatn_1", "0-9", elementsCallback.exact],
                ["repeatn_1>repeatn_1", "0-9", elementsCallback.exact],
                ["repeatn_1>repeatn_2", ",", elementsCallback.repeatnComma],
                ["repeatn_2>repeatn_2", "0-9", elementsCallback.exact],
                ["repeatn_1,repeatn_2>repeatn", "}", elementsCallback.repeatnEnd],
                ["repeatnStart,repeatnErrorStart>exact", "}", elementsCallback.exact],
                ["repeatnStart,repeatnErrorStart>exact", "^+*?^$.|(){[\\0-9}", elementsCallback.exact],
                ["repeatnErrorStart>repeatnError_1", "0-9", elementsCallback.exact],
                ["repeatnError_1>repeatnError_1", "0-9", elementsCallback.exact],
                ["repeatnError_1>repeatnError_2", ",", elementsCallback.exact],
                ["repeatnError_2>repeatnError_2", "0-9", elementsCallback.exact],
                ["repeatnError_2,repeatnError_1>repeatErrorFinal", "}"],
                ["repeatn_1,repeatnError_1>exact", "^+*?^$.|(){[\\0-9,}", elementsCallback.exact],
                ["repeatn_2,repeatnError_2>exact", "^+*?^$.|(){[\\0-9}", elementsCallback.exact],
                ["exact," + names_repeat + ",nullChar,digitBackref," + names_unicodeEscape + "," + names_hexEscape + ">repeat0", "*", elementsCallback.repeat0ToInf],
                ["exact," + names_repeat + ",nullChar,digitBackref," + names_unicodeEscape + "," + names_hexEscape + ">repeat1", "+", elementsCallback.repeat1ToInf],
                ["exact," + names_repeat + ",nullChar,digitBackref," + names_unicodeEscape + "," + names_hexEscape + ">repeat01", "?", elementsCallback.repeat0To1],
                ["choice>repeatErrorFinal", "*+?"],
                ["repeat0,repeat1,repeat01,repeatn>repeatNonGreedy", "?", elementsCallback.repeatNonGreedy],
                ["repeat0,repeat1,repeat01,repeatn>repeatErrorFinal", "+*"],
                ["start,begin,end,groupStart,groupQualifiedStart,exact,repeatNonGreedy,repeat0,repeat1,repeat01,repeatn,choice," + names_repeat + ",nullChar,digitBackref," + names_unicodeEscape + "," + names_hexEscape + ">escape", "\\", elementsCallback.escapeStart],
                ["escape>nullChar", "0", elementsCallback.nullChar],
                ["nullChar>digitFollowNullError", "0-9"],
                ["escape>exact", "^dDwWsSux0-9bB1-9", elementsCallback.normalEscape],
                ["escape>exact", "bB", elementsCallback.assertWordBoundary],
                ["escape>exact", "dDwWsS", elementsCallback.charClassEscape],
                ["escape>unicodeEscape1", "u", elementsCallback.exact],
                ["unicodeEscape1>unicodeEscape2", charset_hex, elementsCallback.exact],
                ["unicodeEscape2>unicodeEscape3", charset_hex, elementsCallback.exact],
                ["unicodeEscape3>unicodeEscape4", charset_hex, elementsCallback.exact],
                ["unicodeEscape4>exact", charset_hex, elementsCallback.unicodeEscape],
                ["escape>hexEscape1", "x", elementsCallback.exact],
                ["hexEscape1>hexEscape2", charset_hex, elementsCallback.exact],
                ["hexEscape2>exact", charset_hex, elementsCallback.hexEscape],
                ["escape>digitBackref", "1-9", elementsCallback.backref],
                ["digitBackref>digitBackref", "0-9", elementsCallback.backref],
                ["digitBackref>exact", "^+*?^$.|(){[\\0-9", elementsCallback.exact],
                ["exact,begin,end,repeat0,repeat1,repeat01,repeatn,repeatNonGreedy,start,groupStart,groupQualifiedStart,choice," + names_repeat + ",nullChar,digitBackref," + names_unicodeEscape + "," + names_hexEscape + ">groupStart", "(", elementsCallback.groupStart],
                ["groupStart>groupQualify", "?"],
                ["groupQualify>groupQualifiedStart", ":", elementsCallback.groupNonCapture],
                ["groupQualify>groupQualifiedStart", "=", elementsCallback.groupToAssertion],
                ["groupQualify>groupQualifiedStart", "!", elementsCallback.groupToAssertion],
                [names_repeat + ",nullChar,digitBackref," + names_unicodeEscape + "," + names_hexEscape + ",groupStart,groupQualifiedStart,begin,end,exact,repeat1,repeat0,repeat01,repeatn,repeatNonGreedy,choice>exact", ")", elementsCallback.groupEnd],
                ["start,begin,end,groupStart,groupQualifiedStart,exact,repeat0,repeat1,repeat01,repeatn,repeatNonGreedy,choice," + names_repeat + ",nullChar,digitBackref," + names_unicodeEscape + "," + names_hexEscape + ">choice", "|", elementsCallback.choice],
                ["start,groupStart,groupQualifiedStart,begin,exact,repeat0,repeat1,repeat01,repeatn,repeatNonGreedy,choice," + names_repeat + ",nullChar,digitBackref," + names_unicodeEscape + "," + names_hexEscape + ">end", "$", elementsCallback.assertEnd],
                ["exact,begin,end,repeat0,repeat1,repeat01,repeatn,repeatNonGreedy,groupQualifiedStart,groupStart,start,choice," + names_repeat + ",nullChar,digitBackref," + names_unicodeEscape + "," + names_hexEscape + ">charsetStart", "[", elementsCallback.charsetStart],
                ["charsetStart>charsetExclude", "^", elementsCallback.charsetExclude],
                ["charsetStart>charsetContent", "^\\]^", elementsCallback.charsetContent],
                ["charsetExclude>charsetContent", "^\\]", elementsCallback.charsetContent],
                ["charsetContent,charsetClass>charsetContent", "^\\]-", elementsCallback.charsetContent],
                ["charsetClass>charsetContent", "-", elementsCallback.charsetContent],
                [names_charsetUnicodeEscape + ",charsetStart,charsetContent,charsetNullChar,charsetClass,charsetExclude,charsetRangeEnd>charsetEscape", "\\"],
                ["charsetEscape>charsetContent", "^dDwWsSux0-9", elementsCallback.charsetNormalEscape],
                ["charsetEscape>charsetNullChar", "0", elementsCallback.charsetNullChar],
                ["charsetEscape>charsetOctEscape", "1-9"],
                ["charsetRangeEndEscape>charsetOctEscape", "1-9"],
                ["charsetNullChar>digitFollowNullError", "0-9"],
                ["charsetNullChar>charsetContent", "^0-9\\]-", elementsCallback.charsetContent],
                ["charsetEscape>charsetClass", "dDwWsS", elementsCallback.charsetClassEscape],
                ["charsetEscape>charsetUnicodeEscape1", "u", elementsCallback.charsetContent],
                ["charsetUnicodeEscape1>charsetUnicodeEscape2", charset_hex, elementsCallback.charsetContent],
                ["charsetUnicodeEscape2>charsetUnicodeEscape3", charset_hex, elementsCallback.charsetContent],
                ["charsetUnicodeEscape3>charsetUnicodeEscape4", charset_hex, elementsCallback.charsetContent],
                ["charsetUnicodeEscape4>charsetContent", charset_hex, elementsCallback.charsetUnicodeEscape],
                ["charsetEscape>charsetHexEscape1", "x", elementsCallback.charsetContent],
                ["charsetHexEscape1>charsetHexEscape2", charset_hex, elementsCallback.charsetContent],
                ["charsetHexEscape2>charsetContent", charset_hex, elementsCallback.charsetHexEscape],
                [names_charsetUnicodeEscape + ">charsetContent", "^\\]0-9a-fA-F-", elementsCallback.charsetContent],
                [names_charsetUnicodeEscape + ",charsetNullChar,charsetContent>charsetRangeStart", "-", elementsCallback.charsetContent],
                ["charsetRangeStart>charsetRangeEnd", "^\\]", elementsCallback.charsetRangeEnd],
                ["charsetRangeEnd>charsetContent", "^\\]", elementsCallback.charsetContent],
                ["charsetRangeStart>charsetRangeEndEscape", "\\"],
                ["charsetRangeEndEscape>charsetRangeEnd", "^dDwWsSux0-9bB1-9", elementsCallback.charsetRangeEndNormalEscape],
                ["charsetRangeEndEscape>charsetRangeEndWithNullChar", "0"],
                ["charsetRangeEndEscape>charsetRangeEndUnicodeEscape1", "u", elementsCallback.charsetRangeEnd],
                ["charsetRangeEndUnicodeEscape1>charsetRangeEndUnicodeEscape2", charset_hex, elementsCallback.charsetContent],
                ["charsetRangeEndUnicodeEscape2>charsetRangeEndUnicodeEscape3", charset_hex, elementsCallback.charsetContent],
                ["charsetRangeEndUnicodeEscape3>charsetRangeEndUnicodeEscape4", charset_hex, elementsCallback.charsetContent],
                ["charsetRangeEndUnicodeEscape4>charsetRangeEnd", charset_hex, elementsCallback.charsetRangeEndUnicodeEscape],
                ["charsetRangeEndEscape>charsetRangeEndHexEscape1", "x", elementsCallback.charsetRangeEnd],
                ["charsetRangeEndHexEscape1>charsetRangeEndHexEscape2", charset_hex, elementsCallback.charsetContent],
                ["charsetRangeEndHexEscape2>charsetRangeEnd", charset_hex, elementsCallback.charsetRangeEndHexEscape],
                ["charsetRangeEndEscape>charsetRangeEndClass", "dDwWsS"],
                ["charsetRangeEndUnicodeEscape1,charsetRangeEndHexEscape1>charsetContent", "^\\]0-9a-fA-F", elementsCallback.charsetContent],
                ["charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4,charsetRangeEndHexEscape2>charsetRangeStart", "-", elementsCallback.charsetContent],
                [names_charsetUnicodeEscape + ",charsetRangeEndUnicodeEscape1,charsetRangeEndHexEscape1,charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4,charsetRangeEndHexEscape2,charsetNullChar,charsetRangeStart,charsetContent,charsetClass,charsetExclude,charsetRangeEnd>exact", "]"],
                // Nuevas ramas para que acepte python
                ["groupQualify>groupNamedDefined", "P"],
                ["groupNamedDefined>groupNamedStart", "<"],
                ["groupNamedStart,groupNamedContent>groupNamedContent", "0-9a-zA-Z_", elementsCallback.groupNamedContent],
                ["groupNamedContent>groupNamedEnd", "0-9a-zA-Z_", elementsCallback.groupNamedContent],
                ["groupNamedEnd,groupNamedContent>groupQualifiedStart", ">"],
            ]
        };

        return init_object
    }
    // ),

    // if (define("visualize", ["./Kit", "./parse"], function(t, e) {
    function visualize(regexson_tree, regex_flags, canvas_Raphael_paper) {
        var _aux_Kit = Kit();
        // var e = parse();
        function setFontStyles(t, e) {
            if (e = e || "normal", map_font_style[t] && map_font_style[t][e])
                return map_font_style[t][e];
            actual_element.attr({
                "font-size": t,
                "font-weight": e
            });
            var r = actual_element.getBBox();
            return map_font_style[t] = map_font_style[t] || {},
                map_font_style[t][e] = {
                    width: r.width / ((actual_element.attr("text").length - 1) / 2),
                    height: r.height / 2
                }
        }
        function setFontFamilySize(canvas_Raphael) {
            actual_element = canvas_Raphael.text(-1e3, -1e3, "XgfTlM|.q\nXgfTlM|.q").attr({
                "font-family": font_family,
                "font-size": graph_fontsize
            })
        }
        function paintRegex(regexson, regex_flags, canvas_Raph) {
            canvas_Raph.clear(), canvas_Raph.setSize(0, 0);
            var container_regex_rect = canvas_Raph.rect(0, 0, 0, 0);
            container_regex_rect.attr("fill", stroke_color), container_regex_rect.attr("stroke", stroke_color);
            setFontFamilySize(canvas_Raph);

            have_multiline_flag = !!~regex_flags.indexOf("m");
            var regex_text_items = generateItemsRegexText(regexson.tree);
            regex_text_items.unshift(createItemRegexText("/", colors_map.delimiter));
            regex_text_items.unshift(createItemRegexText("RegExp: "));
            regex_text_items.push(createItemRegexText("/", colors_map.delimiter));
            regex_flags && regex_text_items.push(createItemRegexText(regex_flags, colors_map.flags));
            
            var height_regex_text = setFontStyles(graph_fontsize, "bold")
                , u = offset_height
                , l = height_regex_text.height / 2 + offset_height
                , max_item_width = 0
                , max_item_height = 0;
            max_item_width = regex_text_items.reduce(function (t, e) {
                return e.x = t,
                    e.y = l,
                    t + e.text.length * height_regex_text.width
            }, u);
            max_item_width += offset_height;
            max_item_height = height_regex_text.height + 2 * offset_height;
            regex_text_items = canvas_Raph.add(regex_text_items);

            // Establece la altura para el size generado por el texto de la regex
            canvas_Raph.setSize(max_item_width, height_regex_text.height + 2 * offset_height);
            
            // Se procesa el regexson para generar los items con formato json que despues procesara Raphael
            var raphael_items = generateRaphaelSVGItems(regexson.tree, 0, 0);
            
            max_item_height = Math.max(raphael_items.height + 3 * offset_height + height_regex_text.height, max_item_height);
            max_item_width = Math.max(raphael_items.width + 2 * offset_height, max_item_width);

            // Establece el size del canvas al maximo que hay generado por las regex
            // TODO: Se puede cambiar y dejarlo fijo, ya que en un futuro tendra control zooming y panning.
            canvas_Raph.setSize(max_item_width, max_item_height);
            container_regex_rect.attr("width", max_item_width);
            container_regex_rect.attr("height", max_item_height);
            addsOffset(raphael_items.items, offset_height, 2 * offset_height + height_regex_text.height - raphael_items.y);
            
            // Se pintan todos los items en el canvas de Raphael
            canvas_Raph.addv2(raphael_items.items)
        }
        function generateRaphaelSVGItems(regexson_tree, _offset_x, _offset_y) {
            regexson_tree.unshift({
                type: "startPoint"
            });
            regexson_tree.push({
                type: "endPoint"
            });

            return processRegexJSONToRaphaelSVG(regexson_tree, _offset_x, _offset_y)
        }

        function addsOffset(t, offsetX, offsetY) {
            t.forEach(function (t) {
                t._translate ? t._translate(offsetX, offsetY) : (t.x += offsetX, t.y += offsetY)
            })
        }

        // Funcion ultima que pinta todo
        function processRegexJSONToRaphaelSVG(regexJSONInfo, offset_x, offset_y) {
            var n = []
                , raphaelItems = []
                , itemsWidth = 0
                , itemsHeight = 0
                , o = offset_x
                , itemsPosY = offset_y
                , _actualHeight = offset_y;
            if (!regexJSONInfo.length)
                return generator_Raph_map.empty(regexJSONInfo, offset_x, offset_y);
            regexJSONInfo.forEach(function (t) {
                var elementSVGRaphael;
                elementSVGRaphael = t.repeat ? generator_Raph_map.repeat(t, o, offset_y) : generator_Raph_map[t.type](t, o, offset_y);
                // Agregar un grupo que envuelva a los elementos creados por la funcion
                n.push(elementSVGRaphael);
                o += elementSVGRaphael.width + _,
                    itemsWidth += elementSVGRaphael.width,
                    itemsPosY = Math.min(itemsPosY, elementSVGRaphael.y),
                    _actualHeight = Math.max(_actualHeight, elementSVGRaphael.y + elementSVGRaphael.height),
                    raphaelItems = raphaelItems.concat(elementSVGRaphael.items)
            }),
                // Aqui se generan los paths que unen los diferentes elementos (horizontalmente)
                itemsHeight = _actualHeight - itemsPosY,
                n.reduce(function (firstElement, nextElement) {
                    itemsWidth += _;
                    var n = generatePathLines(regexJSONInfo, firstElement.lineOutX, offset_y, nextElement.lineInX, _fromItem = firstElement, _toItem = nextElement);
                    return raphaelItems.push(n), nextElement
                });
            var itemsLineInX = n[0].lineInX;
            var itemsLineOutX = n[n.length - 1].lineOutX;
            return {
                items: raphaelItems,
                width: itemsWidth,
                height: itemsHeight,
                x: offset_x,
                y: itemsPosY,
                lineInX: itemsLineInX,
                lineOutX: itemsLineOutX
            }
        }
        function createItemExactChar(regexJSONInfo, rawText, _offsetX, _offsetY, backgroundColor, textColor) {
            rawText = _aux_Kit.toPrint(rawText);
            var o = setFontStyles(graph_fontsize)
                , c = rawText.length * o.width
                , h = o.height + 12
                , u = c + 12
                , l = {
                    type: "rect",
                    class: `rect:${regexJSONInfo.type}:${regexJSONInfo.indices.join(';')}`,
                    x: _offsetX,
                    y: _offsetY - h / 2,
                    width: u,
                    height: h,
                    stroke: "none",
                    fill: backgroundColor || "transparent"
                }
                , f = {
                    type: "text",
                    class: `text:${regexJSONInfo.type}:${regexJSONInfo.indices.join(';')}`,
                    x: _offsetX + u / 2,
                    y: _offsetY,
                    text: rawText,
                    "font-size": graph_fontsize,
                    "font-family": font_family,
                    fill: textColor || "black"
                };
            return {
                text: f,
                rect: l,
                items: [l, f],
                width: u,
                height: h,
                x: _offsetX,
                y: l.y,
                lineInX: _offsetX,
                lineOutX: _offsetX + u
            }
        }
        function createItemText(regexJSONInfo, t, e, n, i) {
            var a, s = setFontStyles(regex_fontsize), o = n.split("\n"), c = o.length * s.height;
            a = o.length > 1 ? Math.max.apply(Math, o.map(function (t) {
                return t.length
            })) : n.length,
                a *= s.width;
            return {
                label: {
                    type: "text",
                    class: `text:${regexJSONInfo.type}:${regexJSONInfo.indices.join(';')}`,
                    x: t,
                    y: e - c / 2 - 4,
                    text: n,
                    "font-size": regex_fontsize,
                    "font-family": font_family,
                    fill: i || "#444"
                },
                x: t - a / 2,
                y: e - c - 4,
                width: a,
                height: c + 4
            }
        }
        function generatePathLines(regexJSONInfo, xOffset, yOffset, xOffsetTo, _fromItem = null, _toItem = null) {
            // Se generan al final todos los paths por lo que no hay informacion en los paths util
            let idInfo = "linejoint";
            if (_fromItem !== null) {
                // El filter es para comprobar que tiene la propiedad
                idInfo = `${idInfo}::${_fromItem.items.map(item => item.class)/*.filter(x => x)*/.join('_')}`;
            }
            if (_toItem !== null) {
                idInfo = `${idInfo}::${_toItem.items.map(item => item.class)/*.filter(x => x)*/.join('_')}::`;
            }

            if (regexJSONInfo.hasOwnProperty('indices')) {
                idInfo = `curve:${regexJSONInfo.indices.join(';')}`;
            }
            return {
                type: "path",
                class: `path:${idInfo}`,
                x: xOffset,
                y: yOffset,
                path: ["M", xOffset, yOffset, "H", xOffsetTo],
                "stroke-linecap": "butt",
                "stroke-linejoin": "round",
                stroke: "#333",
                "stroke-width": 2,
                _translate: function (t, e) {
                    var r = this.path;
                    r[1] += t,
                        r[2] += e,
                        r[4] += t
                }
            }
        }
        function generatePathChoice(regexJSONInfo, t, e, r, n) {
            var i, a, s = t > r ? -1 : 1, o = e > n ? -1 : 1;
            return Math.abs(e - n) < 15 ? (i = ["M", t, e, "C", t + Math.min(Math.abs(r - t) / 2, 10) * s, e, r - (r - t) / 2, n, r, n],
                a = function (t, e) {
                    var r = this.path;
                    r[1] += t,
                        r[2] += e,
                        r[4] += t,
                        r[5] += e,
                        r[6] += t,
                        r[7] += e,
                        r[8] += t,
                        r[9] += e
                }
            ) : (i = ["M", t, e, "Q", t + 10 * s, e, t + 10 * s, e + 10 * o, "V", Math.abs(e - n) < 20 ? e + 10 * o : n - 10 * o, "Q", t + 10 * s, n, t + 10 * s * 2, n, "H", r],
                a = function (t, e) {
                    var r = this.path;
                    r[1] += t,
                        r[2] += e,
                        r[4] += t,
                        r[5] += e,
                        r[6] += t,
                        r[7] += e,
                        r[9] += e,
                        r[11] += t,
                        r[12] += e,
                        r[13] += t,
                        r[14] += e,
                        r[16] += t
                }
            ),
            {
                type: "path",
                class: `path:curve:${regexJSONInfo.indices.join(';')}`,
                path: i,
                "stroke-linecap": "butt",
                "stroke-linejoin": "round",
                stroke: "#333",
                "stroke-width": 2,
                _translate: a
            }
        }
        function circleSVG(regexJSONInfo, _offsetX, _offsetY, radialGradientColor) {
            var _circle_radius = 10;
            return {
                items: [{
                    type: "circle",
                    class: `circle:${regexJSONInfo.type}:${regexJSONInfo.indices.join(';')}`,
                    fill: radialGradientColor,
                    cx: _offsetX + _circle_radius,
                    cy: _offsetY,
                    r: 10,
                    stroke: "none",
                    _translate: function (t, e) {
                        this.cx += t, this.cy += e
                    }
                }],
                width: _circle_radius * 2,
                height: _circle_radius * 2,
                x: _offsetX,
                y: _offsetY,
                lineInX: _offsetX,
                lineOutX: _offsetX + _circle_radius * 2
            }
        }
        function checkRegexJSONInfo(t) {
            if (Array.isArray(t)) {
                for (var e = t, r = 0; r < e.length; r++)
                    if (!checkRegexJSONInfo(e[r]))
                        return !1;
                return !0
            }
            var n = t;
            return n.type === EMPTY_NODE || (n.type === GROUP_NODE && void 0 === n.num ? checkRegexJSONInfo(n.sub) : n.type === CHOICE_NODE ? checkRegexJSONInfo(n.branches) : void 0)
        }
        function generateItemsRegexText(regexson_tree) {
            var regex_items_text = [];
            return regexson_tree.forEach(function (item_regexson) {
                if (item_regexson.sub)
                    regex_items_text.push(createItemRegexText("(")),
                        item_regexson.type === ASSERT_NODE ? item_regexson.assertionType === AssertLookahead ? regex_items_text.push(createItemRegexText("?=")) : regex_items_text.push(createItemRegexText("?!")) : item_regexson.name !== "" ? regex_items_text.push(createItemRegexText(`?P<${item_regexson.name}>`)) : item_regexson.nonCapture && regex_items_text.push(createItemRegexText("?:")),
                        regex_items_text = regex_items_text.concat(generateItemsRegexText(item_regexson.sub)),
                        regex_items_text.push(createItemRegexText(")"));
                else if (item_regexson.branches)
                    item_regexson.branches.map(generateItemsRegexText).forEach(function (t) {
                        regex_items_text = regex_items_text.concat(t),
                            regex_items_text.push(createItemRegexText("|"))
                    }),
                        regex_items_text.pop();
                else {
                    var n = colors_map[item_regexson.type] || colors_map.defaults;
                    switch (item_regexson.type) {
                        case CHARSET_NODE:
                            var i = checkCharsetNotEmpty(item_regexson);
                            (!i || item_regexson.exclude) && regex_items_text.push(createItemRegexText("[")),
                                item_regexson.exclude && regex_items_text.push(createItemRegexText("^", colors_map.charsetExclude)),
                                item_regexson.ranges.forEach(function (t) {
                                    regex_items_text.push(createItemRegexText(escapeCharsetBrackets(t[0] + "-" + t[1]), colors_map.charsetRange))
                                }),
                                item_regexson.classes.forEach(function (t) {
                                    regex_items_text.push(createItemRegexText("\\" + t, colors_map.charsetClass))
                                }),
                                regex_items_text.push(createItemRegexText(escapeCharsetBrackets(item_regexson.chars), colors_map.charsetChars)),
                                (!i || item_regexson.exclude) && regex_items_text.push(createItemRegexText("]"));
                            break;
                        default:
                            var a = item_regexson.raw || "";
                            item_regexson.repeat && (a = a.slice(0, item_regexson.repeat.beginIndex)),
                                a = _aux_Kit.toPrint(a, !0),
                                regex_items_text.push(createItemRegexText(a, n))
                    }
                }
                if (item_regexson.repeat) {
                    var s = item_regexson.repeat.min
                        , o = item_regexson.repeat.max;
                    0 === s && o === 1 / 0 ? regex_items_text.push(createItemRegexText("*")) : 1 === s && o === 1 / 0 ? regex_items_text.push(createItemRegexText("+")) : 0 === s && 1 === o ? regex_items_text.push(createItemRegexText("?")) : (regex_items_text.push(createItemRegexText("{")),
                        regex_items_text.push(createItemRegexText(s)),
                        s === o ? regex_items_text.push(createItemRegexText("}")) : (regex_items_text.push(createItemRegexText(",")),
                            isFinite(o) && regex_items_text.push(createItemRegexText(o)),
                            regex_items_text.push(createItemRegexText("}")))),
                        item_regexson.repeat.nonGreedy && regex_items_text.push(createItemRegexText("?", colors_map.repeatNonGreedy))
                }
            }), regex_items_text
        }
        function escapeCharsetBrackets(e) {
            return e = _aux_Kit.toPrint(e),
                e.replace(/\[/g, "\\[").replace(/\]/g, "\\]")
        }
        function createItemRegexText(t, e) {
            return e = e || colors_map[t] || colors_map.defaults,
            {
                type: "text",
                "font-size": graph_fontsize,
                "font-family": font_family,
                text: t + "",
                fill: e,
                "text-anchor": "start",
                "font-weight": "bold"
            }
        }
        function checkCharsetNotEmpty(charset_item) {
            return !charset_item.chars && !charset_item.ranges.length && 1 === charset_item.classes.length
        }

        var actual_element;
        var font_family = "DejaVu Sans Mono,monospace";
        var graph_fontsize = 16, regex_fontsize = 14, _ = 16;
        var stroke_color = "#EEE", have_multiline_flag = !1, offset_height = 10, map_font_style = {};
        var generator_Raph_map = {
            startPoint: function (regexJSONInfo, offsetX, offsetY) {
                return circleSVG({ type: "startPoint", indices: [-1, -1] }, offsetX, offsetY, "r(0.5,0.5)#EFE-green")
            },
            endPoint: function (regexJSONInfo, offsetX, offsetY) {
                return circleSVG({ type: "endPoint", indices: [Infinity, Infinity] }, offsetX, offsetY, "r(0.5,0.5)#FFF-#000")
            },
            empty: function (regexJSONInfo, offsetX, offsetY) {
                return {
                    items: [generatePathLines(regexJSONInfo, offsetX, offsetY, offsetX + 10)],
                    width: 10,
                    height: 2,
                    x: offsetX,
                    y: offsetY,
                    lineInX: offsetX,
                    lineOutX: offsetX + 10
                }
            },
            exact: function (regexJSONInfo, offsetX, r) {
                return createItemExactChar(regexJSONInfo, regexJSONInfo.chars, offsetX, r, "skyblue",)
            },
            dot: function (regexJSONInfo, offsetX, offsetY) {
                var n = createItemExactChar(regexJSONInfo, "AnyCharExceptNewLine", offsetX, offsetY, "DarkGreen", "white");
                return n.rect.r = 10,
                    n.rect.tip = "AnyChar except CR LF",
                    n
            },
            backref: function (regexJSONInfo, offsetX, offsetY) {
                var n = createItemExactChar(regexJSONInfom, "Backref #" + regexJSONInfo.num, offsetX, offsetY, "navy", "white");
                return n.rect.r = 8,
                    n
            },
            repeat: function (regexJSONInfo, offsetX, offsetY) {
                function n(t) {
                    return t + (t < 2 ? " time" : " times")
                }
                function i(t, e) {
                    var r = this.path;
                    r[1] += t,
                        r[2] += e,
                        r[4] += t,
                        r[5] += e,
                        r[6] += t,
                        r[7] += e,
                        r[9] += e,
                        r[11] += t,
                        r[12] += e,
                        r[13] += t,
                        r[14] += e,
                        r[16] += t,
                        r[18] += t,
                        r[19] += e,
                        r[20] += t,
                        r[21] += e,
                        r[23] += e,
                        r[25] += t,
                        r[26] += e,
                        r[27] += t,
                        r[28] += e
                }
                if (checkRegexJSONInfo(regexJSONInfo))
                    return generator_Raph_map.empty(regexJSONInfo, offsetX, offsetY);
                var a = regexJSONInfo.repeat
                    , o = ""
                    , c = [];
                if (a.min === a.max && 0 === a.min)
                    return generator_Raph_map.empty(regexJSONInfo, offsetX, offsetY);
                var u = generator_Raph_map[regexJSONInfo.type](regexJSONInfo, offsetX, offsetY)
                    , l = u.width
                    , f = u.height;
                if (a.min === a.max && 1 === a.min)
                    return u;
                a.min === a.max ? o += n(a.min) : (o += a.min,
                    isFinite(a.max) ? o += (a.max - a.min > 1 ? " to " : " or ") + n(a.max) : o += " or more times");
                var d = 10
                    , g = 0
                    , x = 10
                    , v = u.y + u.height - offsetY
                    , y = 20 + u.width;
                l = y;
                var m;
                1 !== a.max ? (v += 10,
                    f += 10,
                    m = {
                        type: "path",
                        class: `path:curve:${regexJSONInfo.indices.join(';')}`,
                        path: ["M", u.x + 10, offsetY, "Q", offsetX, offsetY, offsetX, offsetY + x, "V", offsetY + v - x, "Q", offsetX, offsetY + v, offsetX + x, offsetY + v, "H", offsetX + y - x, "Q", offsetX + y, offsetY + v, offsetX + y, offsetY + v - x, "V", offsetY + x, "Q", offsetX + y, offsetY, u.x + u.width + 10, offsetY],
                        _translate: i,
                        stroke: "maroon",
                        "stroke-width": 2
                    },
                    a.nonGreedy && (m.stroke = "Brown",
                        m["stroke-dasharray"] = "-"),
                    c.push(m)) : o = !1;
                var b;
                if (0 === a.min) {
                    var _ = offsetY - u.y + 10
                        , w = y + 20;
                    d += 10,
                        g = -12,
                        l = w,
                        f += 10,
                        b = {
                            type: "path",
                            class: `path:curve:${regexJSONInfo.indices.join(';')}`,
                            path: ["M", offsetX, offsetY, "Q", offsetX + x, offsetY, offsetX + x, offsetY - x, "V", offsetY - _ + x, "Q", offsetX + x, offsetY - _, offsetX + 20, offsetY - _, "H", offsetX + w - 20, "Q", offsetX + w - x, offsetY - _, offsetX + w - x, offsetY - _ + x, "V", offsetY - x, "Q", offsetX + w - x, offsetY, offsetX + w, offsetY],
                            _translate: i,
                            stroke: a.nonGreedy ? "darkgreen" : "#333",
                            "stroke-width": 2
                        },
                        m && addsOffset([m], 10, 0),
                        c.push(b)
                }
                if (o) {
                    var E = createItemText(regexJSONInfo, offsetX + l / 2, offsetY, o);
                    addsOffset([E.label], 0, v + E.height + 4),
                        c.push(E.label),
                        f += 4 + E.height;
                    var C = (Math.max(E.width, l) - l) / 2;
                    C && addsOffset(c, C, 0),
                        l = Math.max(E.width, l),
                        d += C
                }
                return addsOffset(u.items, d, 0),
                    c = c.concat(u.items),
                {
                    items: c,
                    width: l,
                    height: f,
                    x: offsetX,
                    y: u.y + g,
                    lineInX: u.lineInX + d,
                    lineOutX: u.lineOutX + d
                }
            },
            choice: function (regexJSONInfo, offsetX, offsetY) {
                if (checkRegexJSONInfo(regexJSONInfo))
                    return generator_Raph_map.empty(regexJSONInfo, offsetX, offsetY);
                var n = 0
                    , i = 0
                    , a = regexJSONInfo.branches.map(function (regexBranch) {
                        var a = processRegexJSONToRaphaelSVG(regexBranch, offsetX, offsetY);
                        return n += a.height,
                            i = Math.max(i, a.width),
                            a
                    });
                n += 6 * (a.length - 1) + 8,
                    i += 40;
                var c = offsetX + i / 2
                    , h = offsetY - n / 2 + 4
                    , f = offsetX + i
                    , d = [];
                return a.forEach(function (t) {
                    var n = c - t.width / 2;
                    addsOffset(t.items, n - t.x, h - t.y),
                        d = d.concat(t.items);
                    var a = offsetY + h - t.y
                        , o = generatePathChoice(regexJSONInfo, offsetX, offsetY, offsetX + 20, a)
                        , p = generatePathChoice(regexJSONInfo, f, offsetY, offsetX + i - 20, a);
                    d.push(o, p),
                        offsetX + 20 !== n - t.x + t.lineInX && d.push(generatePathLines(regexJSONInfo, offsetX + 20, a, n - t.x + t.lineInX)),
                        t.lineOutX + n - t.x != offsetX + i - 20 && d.push(generatePathLines(regexJSONInfo, t.lineOutX + n - t.x, a, offsetX + i - 20)),
                        t.x = n,
                        t.y = h,
                        h += t.height + 6
                }),
                {
                    items: d,
                    width: i,
                    height: n,
                    x: offsetX,
                    y: offsetY - n / 2,
                    lineInX: offsetX,
                    lineOutX: f
                }
            },
            charset: function (regexJSONInfo, offsetX, offsetY) {
                var n = {
                    d: "Digit",
                    D: "NonDigit",
                    w: "Word",
                    W: "NonWord",
                    s: "WhiteSpace",
                    S: "NonWhiteSpace"
                }
                    , i = regexJSONInfo.exclude ? "Pink" : "Khaki"
                    , a = regexJSONInfo.exclude ? "#C00" : "";
                if (checkCharsetNotEmpty(regexJSONInfo)) {
                    var o = createItemExactChar(regexJSONInfo, n[regexJSONInfo.classes[0]], offsetX, offsetY, "Green", "white");
                    if (o.rect.r = 5,
                        regexJSONInfo.exclude) {
                        var u = createItemText(regexJSONInfo, o.x + o.width / 2, o.y, "None of:", a)
                            , l = o.items;
                        l.push(u.label);
                        var f = o.width
                            , p = Math.max(u.width, o.width)
                            , d = (p - f) / 2;
                        return addsOffset(l, d, 0),
                        {
                            items: l,
                            width: p,
                            height: o.height + u.height,
                            x: Math.min(u.x, o.x),
                            y: u.y,
                            lineInX: d + o.x,
                            lineOutX: d + o.x + o.width
                        }
                    }
                    return o
                }
                if (!regexJSONInfo.chars && !regexJSONInfo.ranges.length && !regexJSONInfo.classes.length) {
                    var o = createItemExactChar(regexJSONInfo, "AnyChar", offsetX, offsetY, "green", "white");
                    return o.rect.r = 5,
                        o
                }
                var g, x, y = [], p = 0, m = 0;
                regexJSONInfo.chars && (g = createItemExactChar(regexJSONInfo, regexJSONInfo.chars, offsetX, offsetY, "LightSkyBlue", "black"),
                    g.rect.r = 5,
                    y.push(g),
                    p = g.width),
                    regexJSONInfo.ranges.forEach(function (t) {
                        t = t.split("").join("-");
                        var n = createItemExactChar(regexJSONInfo, t, offsetX, offsetY, "teal", "white");
                        n.rect.r = 5,
                            y.push(n),
                            p = Math.max(n.width, p)
                    }),
                    regexJSONInfo.classes.forEach(function (t) {
                        var i = createItemExactChar(regexJSONInfo, n[t], offsetX, offsetY, "Green", "white");
                        i.rect.r = 5,
                            y.push(i),
                            p = Math.max(i.width, p)
                    }),
                    x = y[0].height;
                var b = []
                    , _ = [];
                y.sort(function (t, e) {
                    return e.width - t.width
                }),
                    y.forEach(function (t) {
                        2 * t.width + 4 > p ? b.push(t) : _.push(t)
                    }),
                    y = b;
                for (var w, E; _.length;) {
                    if (w = _.pop(),
                        !(E = _.pop())) {
                        y.push(w);
                        break
                    }
                    w.width - E.width > 2 ? (y.push(w),
                        _.push(E)) : (addsOffset(E.items, w.width + 4, 0),
                            y.push({
                                items: w.items.concat(E.items),
                                width: w.width + E.width + 4,
                                height: w.height,
                                x: w.x,
                                y: w.y
                            }),
                            m -= w.height)
                }
                p += 12, m = 4 * (y.length - 1) + y.length * x + 12;
                var C = {
                    type: "rect",
                    class: `rect:charsetgroup:${regexJSONInfo.indices.join(';')}`,
                    x: offsetX,
                    y: offsetY - m / 2,
                    r: 4,
                    width: p,
                    height: m,
                    stroke: "none",
                    fill: i
                }
                    , k = C.y + 6
                    , l = [C];
                y.forEach(function (t) {
                    addsOffset(t.items, offsetX - t.x + (p - t.width) / 2, k - t.y),
                        l = l.concat(t.items),
                        k += t.height + 4
                });
                let infoCharset = { type: "charsetgroup", indices: regexJSONInfo.indices };
                var u = createItemText(infoCharset, C.x + C.width / 2, C.y, (regexJSONInfo.exclude ? "None" : "One") + " of:", a);
                l.push(u.label);
                var f = p;
                p = Math.max(u.width, p);
                var d = (p - f) / 2;
                return addsOffset(l, d, 0),
                {
                    items: l,
                    width: p,
                    height: m + u.height,
                    x: Math.min(u.x, offsetX),
                    y: u.y,
                    lineInX: d + offsetX,
                    lineOutX: d + offsetX + C.width
                }
            },
            group: function (regexJSONInfo, offsetX, offsetY) {
                if (checkRegexJSONInfo(regexJSONInfo)) {
                    return generator_Raph_map.empty(regexJSONInfo, offsetX, offsetY);
                }
                // Puede que haya que quitar los offset, y agregarlos al grupo g
                // var item_subgroup = processRaphaelRegexJSON(regexJSONInfo.sub, offsetX, offsetY);
                var element_subgroup = processRegexJSONToRaphaelSVG(regexJSONInfo.sub, 0, 0);
                var container_group = {
                    type: "group",
                    class: `g:${regexJSONInfo.type}:${[regexJSONInfo.indices[0] + 1, regexJSONInfo.indices[1] - 1].join(';')}:t${element_subgroup.x},${element_subgroup.y}`,
                    subs: element_subgroup.items,
                    transform: `t${element_subgroup.x},${element_subgroup.y}`,
                    x: element_subgroup.x,
                    y: element_subgroup.y,
                    width: element_subgroup.width,
                    height: element_subgroup.height
                };
                if (regexJSONInfo.num) {
                    // Agrega un offset a la izquierda para mover todos los items a la derecha y que se centre el dashed group que lo engloba
                    addsOffset(element_subgroup.items, 10, 0);
                    var rect_width = element_subgroup.width + 20;
                    var rect_height = element_subgroup.height + 20;
                    var item_rect = {
                        type: "rect",
                        class: `rect:${regexJSONInfo.type}:${regexJSONInfo.indices.join(';')}`,
                        x: offsetX,
                        y: element_subgroup.y - 10,
                        r: 6,
                        width: rect_width,
                        height: rect_height,
                        "stroke-dasharray": ".",
                        stroke: "silver",
                        "stroke-width": 2
                    };
                    var item_text = createItemText(regexJSONInfo, item_rect.x + item_rect.width / 2, item_rect.y - 2, `Group ${regexJSONInfo.name}#${regexJSONInfo.num}`);
                    var max_width = Math.max(item_text.width, rect_width);
                    var offset_x_width = (max_width - rect_width) / 2;

                    var container_item = {
                        type: "group",
                        class: `g:${regexJSONInfo.type}:${regexJSONInfo.indices.join(';')}`,
                        subs: [container_group, item_rect, item_text.label],
                        transform: `t${offsetX + offset_x_width},${offsetY}`,
                        x: offsetX + offset_x_width,
                        y: offsetY,
                        width: max_width,
                        height: rect_height + item_text.height + 4
                    };

                    var all_items = element_subgroup.items.concat([item_rect, item_text.label]);
                    offset_x_width && addsOffset(all_items, offset_x_width, 0);

                    return {
                        items: [container_item],
                        width: container_item.width,
                        height: container_item.height,
                        x: offsetX + offset_x_width,
                        y: offsetY,
                        lineInX: offset_x_width + element_subgroup.lineInX + 10,
                        lineOutX: offset_x_width + element_subgroup.lineOutX + 10
                    }
                }
                // Llega aqui si es grupo un non-capturing

                return {
                    items: [container_group],
                    width: container_group.width,
                    height: container_group.height,
                    x: element_subgroup.x,
                    y: element_subgroup.y,
                    lineInX: element_subgroup.lineInX,
                    lineOutX: element_subgroup.lineOutX
                }; // items_subgroup
            },
            assert: function (regexJSONInfo, offsetX, offsetY) {
                var n, i = {
                    AssertNonWordBoundary: {
                        bg: "maroon",
                        fg: "white"
                    },
                    AssertWordBoundary: {
                        bg: "purple",
                        fg: "white"
                    },
                    AssertEnd: {
                        bg: "Indigo",
                        fg: "white"
                    },
                    AssertBegin: {
                        bg: "Indigo",
                        fg: "white"
                    }
                }, a = regexJSONInfo.assertionType, o = a.replace("Assert", "") + "!";
                if (n = i[a])
                    return !have_multiline_flag || "AssertBegin" !== a && "AssertEnd" !== a || (o = "Line" + o),
                        createItemExactChar(regexJSONInfo, o, offsetX, offsetY, n.bg, n.fg);
                var u, l;
                a === AssertLookahead ? (u = "CornflowerBlue",
                    l = "darkgreen",
                    o = "Followed by:") : a === AssertNegativeLookahead && (u = "#F63",
                        l = "Purple",
                        o = "Not followed by:");
                var f = generator_Raph_map.group(regexJSONInfo, offsetX, offsetY)
                    , p = f.height + 16
                    , d = f.width + 16
                    , g = {
                        type: "rect",
                        class: `rect:${regexJSONInfo.type}:${regexJSONInfo.indices.join(';')}`,
                        x: offsetX,
                        y: f.y - 8,
                        r: 6,
                        width: d,
                        height: p,
                        "stroke-dasharray": "-",
                        stroke: u,
                        "stroke-width": 2
                    }
                    , x = createItemText(regexJSONInfo, g.x + d / 2, g.y, o, l)
                    , v = Math.max(d, x.width)
                    , y = (v - d) / 2;
                return addsOffset(f.items, y + 8, 0),
                    y && addsOffset([g, x.label], y, 0),
                {
                    items: f.items.concat([g, x.label]),
                    width: v,
                    height: g.height + x.height,
                    x: offsetX,
                    y: x.y,
                    lineInX: y + f.lineInX + 8,
                    lineOutX: y + f.lineOutX + 8
                }
            }
        };
        var colors_map = {
            delimiter: "Indigo",
            flags: "darkgreen",
            exact: "#334",
            dot: "darkblue",
            backref: "teal",
            $: "purple",
            "^": "purple",
            "\\b": "#F30",
            "\\B": "#F30",
            "(": "blue",
            ")": "blue",
            "?=": "darkgreen",
            "?!": "red",
            "?:": "grey",
            "[": "navy",
            "]": "navy",
            "|": "blue",
            "{": "maroon",
            ",": "maroon",
            "}": "maroon",
            "*": "maroon",
            "+": "maroon",
            "?": "maroon",
            repeatNonGreedy: "#F61",
            defaults: "black",
            charsetRange: "olive",
            charsetClass: "navy",
            charsetExclude: "red",
            charsetChars: "#534"
        };

        return paintRegex(regexson_tree, regex_flags, canvas_Raphael_paper);
    }
    // ),

    //  ),
    // "function" != typeof define)
    //     var define = require("amdefine")(module);


    // module.exports = {parse, visualize};

// });