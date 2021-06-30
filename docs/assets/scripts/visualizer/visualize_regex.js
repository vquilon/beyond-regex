// (function () {
// var { Kit } = require("./auxiliar_functions");
// var { NFA }  = require("./NFA_parser");

// if (define("parse", ["./NFA", "./Kit"], function(t, e) {
function parse() {
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
    function init_object(raw_regex_input, e, language) {
        d = e;
        var r, i;
        var error_lastState;
        var NFA_instance = load_NFA_Parser(language = language);
        r = NFA_instance.input(raw_regex_input, 0, e);
        i = r.stack;
        i = elementsCallback.endChoice(i);
        error_lastState = r.lastState;

        var g = r.acceptable && r.lastIndex === raw_regex_input.length - 1;
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
                    } : ")" === raw_regex_input[r.lastIndex] ? x = {
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
                h(i, raw_regex_input, raw_regex_input.length),
                i = o(i);
            var m = new create_regexObject({
                raw: raw_regex_input,
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
    function load_NFA_Parser(language = "javascript") {
        var selected_language_validStructs = validStructs[language];
        return NFAparser || (NFAparser = new NFA(selected_language_validStructs)), NFAparser
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
        this.name = "RegexSyntaxError";
        this.type = t.type;
        this.lastIndex = t.lastIndex;
        this.lastState = t.lastState;
        this.lastStack = t.lastStack;
        this.message = t.message;
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
    var base_validStructs = {
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
        ]
    }
    var javascript_validStructs = {
        compact: !0,
        accepts: base_validStructs.accepts,
        trans: base_validStructs.trans.concat([

        ])
    }
    var python_validStricts = {
        compact: !0,
        accepts: base_validStructs.accepts,
        trans: base_validStructs.trans.concat([
            ["groupQualify>groupNamedDefined", "P"],
            ["groupNamedDefined>groupNamedStart", "<"],
            ["groupNamedStart,groupNamedContent>groupNamedContent", "0-9a-zA-Z_", elementsCallback.groupNamedContent],
            ["groupNamedContent>groupNamedEnd", "0-9a-zA-Z_", elementsCallback.groupNamedContent],
            ["groupNamedEnd,groupNamedContent>groupQualifiedStart", ">"],
        ])
    }
    var validStructs = {
        javascript: javascript_validStructs,
        python: python_validStricts
    };

    return init_object
}
// ),

// if (define("visualize", ["./Kit", "./parse"], function(t, e) {
function visualize(regexson_tree, regex_flags, canvas_Raphael_paper) {
    var _aux_Kit = Kit();
    // var e = parse();
    function getFontStyles(font_size, font_weight) {
        if (font_weight = font_weight || "normal", map_font_style[font_size] && map_font_style[font_size][font_weight])
            return map_font_style[font_size][font_weight];
        font_style_aux_element.attr({
            "font-size": font_size,
            "font-weight": font_weight
        });
        var font_style_aux_bbox = font_style_aux_element.getBBox();
        return map_font_style[font_size] = map_font_style[font_size] || {},
            map_font_style[font_size][font_weight] = {
                width: font_style_aux_bbox.width / ((font_style_aux_element.attr("text").length - 1) / 2),
                height: font_style_aux_bbox.height / 2
            }
    }
    function setFontFamilySize(canvas_Raphael) {
        // Se crea este elemento vacio para determiar el tamaño que tienen los caracteres
        // dentro del grafo para un familia de fuente y tamaño, despues se cambia el 
        // estilo
        font_style_aux_element = canvas_Raphael.text(-1e3, -1e3, "XgfTlM|.q\nXgfTlM|.q").attr({
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
        var regex_text_items = processRegexTextItems(regexson.tree);
        regex_text_items.unshift(createRegexTextItem("/", colors_map.delimiter));
        regex_text_items.unshift(createRegexTextItem("RegExp: "));
        regex_text_items.push(createRegexTextItem("/", colors_map.delimiter));
        regex_flags && regex_text_items.push(createRegexTextItem(regex_flags, colors_map.flags));

        var size_item_text = getFontStyles(graph_fontsize, "bold"),
            u = margin_items,
            l = size_item_text.height / 2 + margin_items,
            max_item_width = 0,
            max_item_height = 0;
        max_item_width = regex_text_items.reduce(function (t, e) {
            return e.x = t,
                e.y = l,
                t + e.text.length * size_item_text.width
        }, u);
        max_item_width += margin_items;
        max_item_height = size_item_text.height + 2 * margin_items;
        regex_text_items = canvas_Raph.add(regex_text_items);

        // Establece la altura para el size generado por el texto de la regex
        canvas_Raph.setSize(max_item_width, size_item_text.height + 2 * margin_items);

        // Se procesa el regexson para generar los items con formato json que despues procesara Raphael
        var raphael_items = generateRaphaelSVGItems(regexson.tree, 0, 0);

        max_item_height = Math.max(raphael_items.height + 3 * margin_items + size_item_text.height, max_item_height);
        max_item_width = Math.max(raphael_items.width + 2 * margin_items, max_item_width);

        // Establece el size del canvas al maximo que hay generado por las regex
        // TODO: Se puede cambiar y dejarlo fijo, ya que en un futuro tendra control zooming y panning.
        canvas_Raph.setSize(max_item_width, max_item_height);
        container_regex_rect.attr("width", max_item_width);
        container_regex_rect.attr("height", max_item_height);
        addsOffset(raphael_items.items, margin_items, 2 * margin_items + size_item_text.height - raphael_items.y);
        
        // Se borra finalmente ya que no se va a utilizar
        font_style_aux_element.remove();

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

    function addsOffset(raphael_items, offset_x, offset_y) {
        raphael_items.forEach(function (raph_item) {
            raph_item._translate ? raph_item._translate(offset_x, offset_y) : (raph_item.x += offset_x, raph_item.y += offset_y);
        });
    }

    // Funcion que ordena y crea los paths
    function processRegexJSONToRaphaelSVG(regexJSONInfo, offset_x, offset_y) {
        var processed_items_result = [];
        var raphael_items = [];
        var items_width = 0;
        var items_height = 0;
        var _offset_x = offset_x;
        var _offset_y = offset_y;
        var _actualHeight = offset_y;

        if (!regexJSONInfo.length) {
            return generator_Raph_map.empty(regexJSONInfo, offset_x, offset_y);
        }
        // Creacion de cada item
        regexJSONInfo.forEach(function (single_regexjson_info) {
            var raphael_element;
            if (single_regexjson_info.repeat) {
                raphael_element = generator_Raph_map.repeat(single_regexjson_info, _offset_x, offset_y);
            } else {
                raphael_element = generator_Raph_map[single_regexjson_info.type](single_regexjson_info, _offset_x, offset_y);
            }
            // Agregar un grupo que envuelva a los elementos creados por la funcion
            processed_items_result.push(raphael_element);
            _offset_x += raphael_element.width + gap_lines_items;
            items_width += raphael_element.width;
            _offset_y = Math.min(_offset_y, raphael_element.y);
            _actualHeight = Math.max(_actualHeight, raphael_element.y + raphael_element.height);
            raphael_items = raphael_items.concat(raphael_element.items)
        });

        // Aqui se generan los paths que unen los diferentes elementos (horizontalmente)
        items_height = _actualHeight - _offset_y;
        processed_items_result.reduce(function (firstElement, nextElement) {
            items_width += gap_lines_items;
            var line_path_item = createLinesPathItem(regexJSONInfo, firstElement.lineOutX, offset_y, nextElement.lineInX, _fromItem = firstElement, _toItem = nextElement);
            return raphael_items.push(line_path_item), nextElement;
        });
        var items_linein_x = processed_items_result[0].lineInX;
        var items_lineout_x = processed_items_result[processed_items_result.length - 1].lineOutX;
        return {
            items: raphael_items,
            width: items_width,
            height: items_height,
            x: offset_x,
            y: _offset_y,
            lineInX: items_linein_x,
            lineOutX: items_lineout_x
        }
    }

    function createGroupContainerItem(regexJSONInfo, children_items, offset_x, offset_y, width, height) {
        return {
            type: "group",
            class: `g:${regexJSONInfo.type}:${[regexJSONInfo.indices[0] + 1, regexJSONInfo.indices[1] - 1].join(';')}`,
            children: children_items,
            transform: `t${offset_x},${offset_y}`,
            x: offset_x,
            y: offset_y,
            width: width,
            height: height,
            _translate: function (offset_x, offset_y) {
                this.x += offset_x;
                this.y += offset_y;
                this.transform = `t${this.x},${this.y}`;
            }
        };
    }

    function createExactCharItem(regexJSONInfo, rawText, offset_x, offset_y, background_color, text_color) {
        rawText = _aux_Kit.toPrint(rawText);
        var size_item_text = getFontStyles(graph_fontsize);
        var text_item_width = rawText.length * size_item_text.width;

        var rect_item_height = size_item_text.height + 12;
        var rect_item_width = text_item_width + 12;
        var rect_item = {
            type: "rect",
            class: `rect:${regexJSONInfo.type}:${regexJSONInfo.indices.join(';')}`,
            x: 0,// offset_x,
            y: 0, // offset_y - rect_item_height / 2,
            width: rect_item_width,
            height: rect_item_height,
            stroke: "none",
            fill: background_color || "transparent"
        };
        var text_item = {
            type: "text",
            class: `text:${regexJSONInfo.type}:${regexJSONInfo.indices.join(';')}`,
            x: rect_item_width / 2, // offset_x + text_item_width / 2,
            y: rect_item_height / 2, // offset_y,
            text: rawText,
            "font-size": graph_fontsize,
            "font-family": font_family,
            fill: text_color || "black"
        };

        var container_item = createGroupContainerItem(regexJSONInfo, [rect_item, text_item], offset_x, offset_y - rect_item_height / 2, rect_item_width, rect_item_height);

        return {
            text: text_item,
            rect: rect_item,
            items: [container_item],
            width: rect_item_width,
            height: rect_item_height,
            x: offset_x,
            y: container_item.y,
            lineInX: offset_x,
            lineOutX: offset_x + rect_item_width
        }
    }
    function createTextItemElement(regexJSONInfo, offset_x, offset_y, raw_text, background_color) {
        var text_width, text_size_attr = getFontStyles(regex_fontsize);
        var text_splitted = raw_text.split("\n");
        var textlines_height = text_splitted.length * text_size_attr.height;
        text_width = text_splitted.length > 1 ? Math.max.apply(Math, text_splitted.map(function (t) {
            return t.length
        })) : raw_text.length,
            text_width *= text_size_attr.width;
        return {
            label: {
                type: "text",
                class: `text:${regexJSONInfo.type}:${regexJSONInfo.indices.join(';')}`,
                x: offset_x,
                y: offset_y - textlines_height / 2 - 4,
                text: raw_text,
                "font-size": regex_fontsize,
                "font-family": font_family,
                fill: background_color || "#444"
            },
            x: offset_x - text_width / 2,
            y: offset_y - textlines_height - 4,
            width: text_width,
            height: textlines_height + 4
        }
    }
    function createLinesPathItem(regexJSONInfo, offset_x, offset_y, offset_x_to, _fromItem = null, _toItem = null) {
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
            x: offset_x,
            y: offset_y,
            path: ["M", offset_x, offset_y, "H", offset_x_to],
            "stroke-linecap": "butt",
            "stroke-linejoin": "round",
            stroke: "#333",
            "stroke-width": 2,
            _translate: function (_offset_x, _offset_y) {
                var path = this.path;
                path[1] += _offset_x, path[2] += _offset_y, path[4] += _offset_x
            }
        }
    }
    function createChoicesPathItem(regexJSONInfo, offset_x, offset_y, width, height) {
        var path, _translate_path;
        var width_direction = offset_x > width ? -1 : 1;
        var height_direction = offset_y > height ? -1 : 1;

        if (Math.abs(offset_y - height) < 15) {
            path = ["M", offset_x, offset_y, "C", offset_x + Math.min(Math.abs(width - offset_x) / 2, 10) * width_direction, offset_y, width - (width - offset_x) / 2, height, width, height];
            _translate_path = function (_offset_x, _offset_y) {
                var path = this.path;
                path[1] += _offset_x, path[2] += _offset_y, path[4] += _offset_x, path[5] += _offset_y;
                path[6] += _offset_x, path[7] += _offset_y, path[8] += _offset_x, path[9] += _offset_y;
            }
        }
        else {
            path = ["M", offset_x, offset_y, "Q", offset_x + 10 * width_direction, offset_y, offset_x + 10 * width_direction, offset_y + 10 * height_direction, "V", Math.abs(offset_y - height) < 20 ? offset_y + 10 * height_direction : height - 10 * height_direction, "Q", offset_x + 10 * width_direction, height, offset_x + 10 * width_direction * 2, height, "H", width];
            _translate_path = function (_offset_x, _offset_y) {
                var path = this.path;
                path[1] += _offset_x, path[2] += _offset_y, path[4] += _offset_x, path[5] += _offset_y;
                path[6] += _offset_x, path[7] += _offset_y, path[9] += _offset_y, path[11] += _offset_x;
                path[12] += _offset_y, path[13] += _offset_x, path[14] += _offset_y, path[16] += _offset_x;
            };
        }
        return {
            type: "path",
            class: `path:curve:${regexJSONInfo.indices.join(';')}`,
            path: path,
            "stroke-linecap": "butt",
            "stroke-linejoin": "round",
            stroke: "#333",
            "stroke-width": 2,
            _translate: _translate_path
        }
    }
    function createCircleItem(regexJSONInfo, offset_x, offset_y, radialGradientColor) {
        var _circle_radius = 10;
        var circle_item = {
            type: "circle",
            class: `circle:${regexJSONInfo.type}:${regexJSONInfo.indices.join(';')}`,
            fill: radialGradientColor,
            cx: _circle_radius, // offset_x + _circle_radius,
            cy: 0, // offset_y,
            r: _circle_radius,
            stroke: "none",
            _translate: function (_offset_x, _offset_y) {
                this.cx += _offset_x, this.cy += _offset_y
            }
        };
        container_group = createGroupContainerItem(regexJSONInfo, [circle_item], offset_x, offset_y, _circle_radius * 2, _circle_radius * 2);
        return {
            items: [container_group],
            width: container_group.width,
            height: container_group.height,
            x: offset_x,
            y: offset_y,
            lineInX: container_group.x,
            lineOutX: container_group.x + container_group.width
        }
    }
    function checkRegexJSONInfo(regexJSONInfo) {
        if (Array.isArray(regexJSONInfo)) {
            for (var e = regexJSONInfo, r = 0; r < e.length; r++)
                if (!checkRegexJSONInfo(e[r]))
                    return !1;
            return !0
        }
        var _regex_json_info = regexJSONInfo;
        return _regex_json_info.type === EMPTY_NODE || (_regex_json_info.type === GROUP_NODE && void 0 === _regex_json_info.num ? checkRegexJSONInfo(_regex_json_info.sub) : _regex_json_info.type === CHOICE_NODE ? checkRegexJSONInfo(_regex_json_info.branches) : void 0)
    }
    function processRegexTextItems(regexson_tree) {
        var regex_items_text = [];
        return regexson_tree.forEach(function (item_regexson) {
            if (item_regexson.sub)
                regex_items_text.push(createRegexTextItem("(")),
                    item_regexson.type === ASSERT_NODE ? item_regexson.assertionType === AssertLookahead ? regex_items_text.push(createRegexTextItem("?=")) : regex_items_text.push(createRegexTextItem("?!")) : item_regexson.name !== "" ? regex_items_text.push(createRegexTextItem(`?P<${item_regexson.name}>`)) : item_regexson.nonCapture && regex_items_text.push(createRegexTextItem("?:")),
                    regex_items_text = regex_items_text.concat(processRegexTextItems(item_regexson.sub)),
                    regex_items_text.push(createRegexTextItem(")"));
            else if (item_regexson.branches)
                item_regexson.branches.map(processRegexTextItems).forEach(function (t) {
                    regex_items_text = regex_items_text.concat(t),
                        regex_items_text.push(createRegexTextItem("|"))
                }),
                    regex_items_text.pop();
            else {
                var n = colors_map[item_regexson.type] || colors_map.defaults;
                switch (item_regexson.type) {
                    case CHARSET_NODE:
                        var i = checkCharsetNotEmpty(item_regexson);
                        (!i || item_regexson.exclude) && regex_items_text.push(createRegexTextItem("[")),
                            item_regexson.exclude && regex_items_text.push(createRegexTextItem("^", colors_map.charsetExclude)),
                            item_regexson.ranges.forEach(function (t) {
                                regex_items_text.push(createRegexTextItem(escapeCharsetBrackets(t[0] + "-" + t[1]), colors_map.charsetRange))
                            }),
                            item_regexson.classes.forEach(function (t) {
                                regex_items_text.push(createRegexTextItem("\\" + t, colors_map.charsetClass))
                            }),
                            regex_items_text.push(createRegexTextItem(escapeCharsetBrackets(item_regexson.chars), colors_map.charsetChars)),
                            (!i || item_regexson.exclude) && regex_items_text.push(createRegexTextItem("]"));
                        break;
                    default:
                        var a = item_regexson.raw || "";
                        item_regexson.repeat && (a = a.slice(0, item_regexson.repeat.beginIndex)),
                            a = _aux_Kit.toPrint(a, !0),
                            regex_items_text.push(createRegexTextItem(a, n))
                }
            }
            if (item_regexson.repeat) {
                var s = item_regexson.repeat.min
                    , o = item_regexson.repeat.max;
                0 === s && o === 1 / 0 ? regex_items_text.push(createRegexTextItem("*")) : 1 === s && o === 1 / 0 ? regex_items_text.push(createRegexTextItem("+")) : 0 === s && 1 === o ? regex_items_text.push(createRegexTextItem("?")) : (regex_items_text.push(createRegexTextItem("{")),
                    regex_items_text.push(createRegexTextItem(s)),
                    s === o ? regex_items_text.push(createRegexTextItem("}")) : (regex_items_text.push(createRegexTextItem(",")),
                        isFinite(o) && regex_items_text.push(createRegexTextItem(o)),
                        regex_items_text.push(createRegexTextItem("}")))),
                    item_regexson.repeat.nonGreedy && regex_items_text.push(createRegexTextItem("?", colors_map.repeatNonGreedy))
            }
        }), regex_items_text
    }
    function escapeCharsetBrackets(e) {
        return e = _aux_Kit.toPrint(e),
            e.replace(/\[/g, "\\[").replace(/\]/g, "\\]")
    }
    function createRegexTextItem(t, e) {
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

    var font_style_aux_element;

    var font_family = "DejaVu Sans Mono,monospace";
    var graph_fontsize = 16, regex_fontsize = 14, gap_lines_items = 16;
    var stroke_color = "#e2e2e2", have_multiline_flag = !1, margin_items = 10, map_font_style = {};
    var generator_Raph_map = {
        startPoint: function (regexJSONInfo, offset_x, offset_y) {
            return createCircleItem({ type: "startPoint", indices: [-1, -1] }, offset_x, offset_y, "r(0.5,0.5)#EFE-green")
        },
        endPoint: function (regexJSONInfo, offset_x, offset_y) {
            return createCircleItem({ type: "endPoint", indices: [Infinity, Infinity] }, offset_x, offset_y, "r(0.5,0.5)#FFF-#000")
        },
        empty: function (regexJSONInfo, offset_x, offset_y) {
            return {
                items: [createLinesPathItem(regexJSONInfo, offset_x, offset_y, offset_x + 10)],
                width: 10,
                height: 2,
                x: offset_x,
                y: offset_y,
                lineInX: offset_x,
                lineOutX: offset_x + 10
            }
        },
        exact: function (regexJSONInfo, offset_x, offset_y) {
            return createExactCharItem(regexJSONInfo, regexJSONInfo.chars, offset_x, offset_y, "skyblue",)
        },
        dot: function (regexJSONInfo, offset_x, offset_y) {
            var dot_item = createExactCharItem(regexJSONInfo, "AnyCharExceptNewLine", offset_x, offset_y, "DarkGreen", "white");

            return dot_item.rect.r = 10,
                dot_item.rect.tip = "AnyChar except CR LF",
                dot_item
        },
        backref: function (regexJSONInfo, offset_x, offset_y) {
            var backref_item = createExactCharItem(regexJSONInfo, "Backref #" + regexJSONInfo.num, offset_x, offset_y, "navy", "white");
            return backref_item.rect.r = 8,
                backref_item
        },
        repeat: function (regexJSONInfo, offset_x, offset_y) {
            function timesText(t) {
                return t + (t < 2 ? " time" : " times")
            }
            function _translateFunc(_offset_x, _offset_y) {
                var r = this.path;
                r[1] += _offset_x,
                    r[2] += _offset_y,
                    r[4] += _offset_x,
                    r[5] += _offset_y,
                    r[6] += _offset_x,
                    r[7] += _offset_y,
                    r[9] += _offset_y,
                    r[11] += _offset_x,
                    r[12] += _offset_y,
                    r[13] += _offset_x,
                    r[14] += _offset_y,
                    r[16] += _offset_x,
                    r[18] += _offset_x,
                    r[19] += _offset_y,
                    r[20] += _offset_x,
                    r[21] += _offset_y,
                    r[23] += _offset_y,
                    r[25] += _offset_x,
                    r[26] += _offset_y,
                    r[27] += _offset_x,
                    r[28] += _offset_y
            }
            if (checkRegexJSONInfo(regexJSONInfo))
                return generator_Raph_map.empty(regexJSONInfo, offset_x, offset_y);
            var repeat_info = regexJSONInfo.repeat
                , o = ""
                , c = [];
            if (repeat_info.min === repeat_info.max && 0 === repeat_info.min)
                return generator_Raph_map.empty(regexJSONInfo, offset_x, offset_y);
            var u = generator_Raph_map[regexJSONInfo.type](regexJSONInfo, offset_x, offset_y)
                , l = u.width
                , f = u.height;
            if (repeat_info.min === repeat_info.max && 1 === repeat_info.min)
                return u;
            repeat_info.min === repeat_info.max ? o += timesText(repeat_info.min) : (o += repeat_info.min,
                isFinite(repeat_info.max) ? o += (repeat_info.max - repeat_info.min > 1 ? " to " : " or ") + timesText(repeat_info.max) : o += " or more times");
            var d = 10
                , g = 0
                , x = 10
                , v = u.y + u.height - offset_y
                , y = 20 + u.width;
            l = y;
            var m;
            1 !== repeat_info.max ? (v += 10,
                f += 10,
                m = {
                    type: "path",
                    class: `path:curve:${regexJSONInfo.indices.join(';')}`,
                    path: ["M", u.x + 10, offset_y, "Q", offset_x, offset_y, offset_x, offset_y + x, "V", offset_y + v - x, "Q", offset_x, offset_y + v, offset_x + x, offset_y + v, "H", offset_x + y - x, "Q", offset_x + y, offset_y + v, offset_x + y, offset_y + v - x, "V", offset_y + x, "Q", offset_x + y, offset_y, u.x + u.width + 10, offset_y],
                    _translate: _translateFunc,
                    stroke: "maroon",
                    "stroke-width": 2
                },
                repeat_info.nonGreedy && (m.stroke = "Brown",
                    m["stroke-dasharray"] = "-"),
                c.push(m)) : o = !1;
            var b;
            if (0 === repeat_info.min) {
                var _ = offset_y - u.y + 10
                    , w = y + 20;
                d += 10,
                    g = -12,
                    l = w,
                    f += 10,
                    b = {
                        type: "path",
                        class: `path:curve:${regexJSONInfo.indices.join(';')}`,
                        path: ["M", offset_x, offset_y, "Q", offset_x + x, offset_y, offset_x + x, offset_y - x, "V", offset_y - _ + x, "Q", offset_x + x, offset_y - _, offset_x + 20, offset_y - _, "H", offset_x + w - 20, "Q", offset_x + w - x, offset_y - _, offset_x + w - x, offset_y - _ + x, "V", offset_y - x, "Q", offset_x + w - x, offset_y, offset_x + w, offset_y],
                        _translate: _translateFunc,
                        stroke: repeat_info.nonGreedy ? "darkgreen" : "#333",
                        "stroke-width": 2
                    },
                    m && addsOffset([m], 10, 0),
                    c.push(b)
            }
            if (o) {
                var E = createTextItemElement(regexJSONInfo, offset_x + l / 2, offset_y, o);
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
                x: offset_x,
                y: u.y + g,
                lineInX: u.lineInX + d,
                lineOutX: u.lineOutX + d
            }
        },
        choice: function (regexJSONInfo, offset_x, offset_y) {
            if (checkRegexJSONInfo(regexJSONInfo))
                return generator_Raph_map.empty(regexJSONInfo, offset_x, offset_y);
            var n = 0
                , i = 0
                , a = regexJSONInfo.branches.map(function (regexBranch) {
                    var a = processRegexJSONToRaphaelSVG(regexBranch, offset_x, offset_y);
                    return n += a.height,
                        i = Math.max(i, a.width),
                        a
                });
            n += 6 * (a.length - 1) + 8,
                i += 40;
            var c = offset_x + i / 2
                , h = offset_y - n / 2 + 4
                , f = offset_x + i
                , d = [];
            return a.forEach(function (t) {
                var n = c - t.width / 2;
                addsOffset(t.items, n - t.x, h - t.y),
                    d = d.concat(t.items);
                var a = offset_y + h - t.y
                    , o = createChoicesPathItem(regexJSONInfo, offset_x, offset_y, offset_x + 20, a)
                    , p = createChoicesPathItem(regexJSONInfo, f, offset_y, offset_x + i - 20, a);
                d.push(o, p),
                    offset_x + 20 !== n - t.x + t.lineInX && d.push(createLinesPathItem(regexJSONInfo, offset_x + 20, a, n - t.x + t.lineInX)),
                    t.lineOutX + n - t.x != offset_x + i - 20 && d.push(createLinesPathItem(regexJSONInfo, t.lineOutX + n - t.x, a, offset_x + i - 20)),
                    t.x = n,
                    t.y = h,
                    h += t.height + 6
            }),
            {
                items: d,
                width: i,
                height: n,
                x: offset_x,
                y: offset_y - n / 2,
                lineInX: offset_x,
                lineOutX: f
            }
        },
        charset: function (regexJSONInfo, offset_x, offset_y) {
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
                var o = createExactCharItem(regexJSONInfo, n[regexJSONInfo.classes[0]], offset_x, offset_y, "Green", "white");
                if (o.rect.r = 5,
                    regexJSONInfo.exclude) {
                    var u = createTextItemElement(regexJSONInfo, o.x + o.width / 2, o.y, "None of:", a)
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
                var o = createExactCharItem(regexJSONInfo, "AnyChar", offset_x, offset_y, "green", "white");
                return o.rect.r = 5,
                    o
            }
            var g, x, y = [], p = 0, m = 0;
            regexJSONInfo.chars && (g = createExactCharItem(regexJSONInfo, regexJSONInfo.chars, offset_x, offset_y, "LightSkyBlue", "black"),
                g.rect.r = 5,
                y.push(g),
                p = g.width),
                regexJSONInfo.ranges.forEach(function (t) {
                    t = t.split("").join("-");
                    var n = createExactCharItem(regexJSONInfo, t, offset_x, offset_y, "teal", "white");
                    n.rect.r = 5,
                        y.push(n),
                        p = Math.max(n.width, p)
                }),
                regexJSONInfo.classes.forEach(function (t) {
                    var i = createExactCharItem(regexJSONInfo, n[t], offset_x, offset_y, "Green", "white");
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
                x: offset_x,
                y: offset_y - m / 2,
                r: 4,
                width: p,
                height: m,
                stroke: "none",
                fill: i
            }
                , k = C.y + 6
                , l = [C];
            y.forEach(function (t) {
                addsOffset(t.items, offset_x - t.x + (p - t.width) / 2, k - t.y),
                    l = l.concat(t.items),
                    k += t.height + 4
            });
            let infoCharset = { type: "charsetgroup", indices: regexJSONInfo.indices };
            var u = createTextItemElement(infoCharset, C.x + C.width / 2, C.y, (regexJSONInfo.exclude ? "None" : "One") + " of:", a);
            l.push(u.label);
            var f = p;
            p = Math.max(u.width, p);
            var d = (p - f) / 2;
            return addsOffset(l, d, 0),
            {
                items: l,
                width: p,
                height: m + u.height,
                x: Math.min(u.x, offset_x),
                y: u.y,
                lineInX: d + offset_x,
                lineOutX: d + offset_x + C.width
            }
        },
        group: function (regexJSONInfo, offset_x, offset_y) {
            if (checkRegexJSONInfo(regexJSONInfo)) {
                return generator_Raph_map.empty(regexJSONInfo, offset_x, offset_y);
            }
            // Puede que haya que quitar los offset, y agregarlos al grupo g
            var subgroups_items_element = processRegexJSONToRaphaelSVG(regexJSONInfo.sub, 0, 0);
            var container_group_item = createGroupContainerItem(
                regexJSONInfo, subgroups_items_element.items,
                0, 0,
                subgroups_items_element.width, subgroups_items_element.height
            )
            if (regexJSONInfo.num) {
                // Agrega un offset a la izquierda para mover todos los items a la derecha y que se centre el dashed group que lo engloba
                addsOffset([container_group_item], 10, 0);
                var group_decorator_width = subgroups_items_element.width + 20;
                var group_decorator_height = subgroups_items_element.height + 20;

                var groupinfo_rect_item = {
                    type: "rect",
                    class: `rect:${regexJSONInfo.type}:${regexJSONInfo.indices.join(';')}`,
                    x: 0,
                    y: subgroups_items_element.y - 10,
                    r: 6,
                    width: group_decorator_width,
                    height: group_decorator_height,
                    "stroke-dasharray": ".",
                    stroke: "silver",
                    "stroke-width": 2
                };
                var groupinfo_text_item = createTextItemElement(
                    regexJSONInfo,
                    groupinfo_rect_item.width / 2, groupinfo_rect_item.y - 2,
                    `Group ${regexJSONInfo.name}#${regexJSONInfo.num}`
                );

                var max_width = Math.max(groupinfo_text_item.width, group_decorator_width);
                var offset_x_width = (max_width - group_decorator_width) / 2;

                var container_item = createGroupContainerItem(
                    regexJSONInfo, [container_group_item, groupinfo_rect_item, groupinfo_text_item.label],
                    offset_x + offset_x_width, offset_y,
                    max_width, group_decorator_height + groupinfo_text_item.height + 4
                );

                // offset_x_width && addsOffset([container_item], offset_x_width, 0);

                return {
                    items: [container_item],
                    width: container_item.width,
                    height: container_item.height,
                    x: container_item.x,
                    y: container_item.y + groupinfo_text_item.y,
                    lineInX: offset_x + offset_x_width + subgroups_items_element.lineInX + 10,
                    lineOutX: offset_x + offset_x_width + subgroups_items_element.lineOutX + 10
                }
            }
            // Llega aqui si es grupo un non-capturing
            addsOffset([container_group_item], offset_x, offset_y);
            return {
                items: [container_group_item],
                width: container_group_item.width,
                height: container_group_item.height,
                x: offset_x + subgroups_items_element.x,
                y: offset_y + subgroups_items_element.y,
                lineInX: offset_x + subgroups_items_element.lineInX,
                lineOutX: offset_x + subgroups_items_element.lineOutX
            };
        },
        assert: function (regexJSONInfo, offsetX, offsetY) {
            var n;
            var i = {
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
            };
            var assertion_type = regexJSONInfo.assertionType;
            var raw_text = assertion_type.replace("Assert", "") + "!";
            if (n = i[assertion_type]) {
                return !have_multiline_flag || "AssertBegin" !== assertion_type && "AssertEnd" !== assertion_type || (raw_text = "Line" + raw_text),
                    createExactCharItem(regexJSONInfo, raw_text, offsetX, offsetY, n.bg, n.fg);
            }
            var stroke_color, background_color;
            if (assertion_type === AssertLookahead) {
                stroke_color = "CornflowerBlue";
                background_color = "darkgreen";
                raw_text = "Followed by:";
            } else if (assertion_type === AssertNegativeLookahead) {
                stroke_color = "#F63";
                background_color = "Purple";
                raw_text = "Not followed by:";
            }
            // assertion_type === AssertLookahead ? (
            //     stroke_color = "CornflowerBlue",
            //     background_color = "darkgreen",
            //     raw_text = "Followed by:"
            //     ) : assertion_type === AssertNegativeLookahead && (
            //         stroke_color = "#F63",
            //         background_color = "Purple",
            //         raw_text = "Not followed by:");
            var group_items_result = generator_Raph_map.group(regexJSONInfo, offsetX, offsetY)
            var rect_item_height = group_items_result.height + 16;
            var rect_item_width = group_items_result.width + 16;

            var rect_item = {
                type: "rect",
                class: `rect:${regexJSONInfo.type}:${regexJSONInfo.indices.join(';')}`,
                x: offsetX,
                y: group_items_result.y - 8,
                r: 6,
                width: rect_item_width,
                height: rect_item_height,
                "stroke-dasharray": "-",
                stroke: stroke_color,
                "stroke-width": 2
            };
            var text_item = createTextItemElement(regexJSONInfo, rect_item.x + rect_item_width / 2, rect_item.y, raw_text, background_color);
            var max_width_items = Math.max(rect_item_width, text_item.width);
            var y = (max_width_items - rect_item_width) / 2;

            return addsOffset(group_items_result.items, y + 8, 0),
                y && addsOffset([rect_item, text_item.label], y, 0),
            {
                items: group_items_result.items.concat([rect_item, text_item.label]),
                width: max_width_items,
                height: rect_item.height + text_item.height,
                x: offsetX,
                y: text_item.y,
                lineInX: y + group_items_result.lineInX + 8,
                lineOutX: y + group_items_result.lineOutX + 8
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