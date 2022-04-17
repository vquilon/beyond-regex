// (function () {
// var { Kit } = require("./auxiliar_functions");
// var { NFA }  = require("./NFA_parser");

// if (define("parse", ["./NFA", "./Kit"], function(t, e) {
  function RegexParser() {
    var auxKit = Kit();
    var nodeType = {};
    function r() {
      var t = Object.keys(nodeType)
        .map(function (t) {
          return t + "=" + JSON.stringify(nodeType[t]);
        })
        .join(";");
      (function () {
        return this;
      })().eval(t);
    }
    function create_regexObject(_regexObject) {
      this.raw = _regexObject.raw;
      this.tree = _regexObject.tree;
      this.groupCount = _regexObject.groupCount;
      this.errors = init_object.RegexSyntaxThrows;
    }
    function init_object(raw_regex_input, e, language) {
      init_object.RegexSyntaxThrows = [];
      d = e;
      var r, i;
      var error_lastState;
      var NFA_instance = load_NFA_Parser((language = language));
      r = NFA_instance.input(raw_regex_input, 0, e);
      i = r.stack;
      i = elementsCallback.endChoice(i);
      error_lastState = r.lastState;
  
      // Gestor errores al final del parseo
      var g = r.acceptable && r.lastIndex === raw_regex_input.length - 1;
      if (!g) {
        var x;
        switch (error_lastState) {
          case "charsetRangeEndWithNullChar":
            x = {
              type: "CharsetRangeEndWithNullChar",
              message:
                "Charset range end with NUL char does not make sense!\nBecause [a-\\0] is not a valid range.\nAnd [\\0-\\0] should be rewritten into [\\0]."
            };
            break;
          case "tokenIncomplete":
            x = {
              type: "TokenIncomplete",
              message: "The token is not completed!"
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
              message:
                "The '\\0' represents the <NUL> char and cannot be followed by a decimal digit!"
            };
            break;
          case "charsetRangeEndClass":
            x = {
              type: "CharsetRangeEndClass",
              message:
                'Charset range ends with class such as "\\w\\W\\d\\D\\s\\S" is invalid!'
            };
            break;
          case "charsetOctEscape":
            x = {
              type: "DecimalEscape",
              message:
                "Decimal escape appears in charset is invalid.Because it can't be explained as  backreference.And octal escape is deprecated!"
            };
            break;
          default:
            0 === error_lastState.indexOf("charset")
              ? (x = {
                  type: "UnclosedCharset",
                  message: "Unterminated character class!"
                })
              : ")" === raw_regex_input[r.lastIndex]
              ? (x = {
                  type: "UnmatchedParen",
                  message: "Unmatched end parenthesis!"
                })
              : ((x = {
                  type: "UnexpectedChar",
                  message: "Unexpected char!"
                }),
                r.lastIndex++);
        }
        if (x) {
          x.lastIndex = r.lastIndex
          // x.lastStack = r.stack
          x.lastState = error_lastState
          
          init_object.RegexSyntaxThrows.push(x);
        }
      }
      if (i._parentGroup) {
        let errorObject = {
          type: "UnterminatedGroup",
          message: "Unterminated group!",
          lastIndex: i._parentGroup.indices[0],
          lastState: error_lastState,
          // lastStack: i
        }
        init_object.RegexSyntaxThrows.push(errorObject);
        if (!i._parentGroup.errors) i._parentGroup.errors=[];
        i._parentGroup.errors.push(errorObject);
        
        // Se parsea el ultimo grupo
        i = elementsCallback.groupEnd(i, "", raw_regex_input.length, r.lastState, raw_regex_input);
        
      }
      // Check if no errors, but we want to parse and return
      // the regex procesed after, we check the errors
      // if (g) {
      var y = i.groupCounter ? i.groupCounter.i : 0;
      delete i.groupCounter,
        h(i, raw_regex_input, raw_regex_input.length),
        (i = o(i));
      var m = new create_regexObject({
        raw: raw_regex_input,
        groupCount: y,
        tree: i
      });
      return (
        m.traverse(define_error_out_order_charset, CHARSET_NODE, language),
        m.traverse(
          define_error_assert_non_quantificable,
          ASSERT_NODE,
          language
        ),
        c(i),
        (d = !1),
        m
      );
      // }
    }
    function load_NFA_Parser(language = "javascript6") {
      // TODO: Check no existing language
      var selected_language_validStructs = validStructs[language];
      return (
        NFAparser || (NFAparser = new NFA(selected_language_validStructs)),
        NFAparser
      );
    }
    function s(t, e, r) {
      Object.defineProperty(t, e, {
        value: r,
        enumerable: d,
        writable: !0,
        configurable: !0
      });
    }
    function o(t) {
      return t.filter(function (t) {
        return t.type == EXACT_NODE && t.concatTemp
          ? (delete t.concatTemp, !!t.chars)
          : (t.sub
              ? (t.sub = o(t.sub))
              : t.branches && (t.branches = t.branches.map(o)),
            !0);
      });
    }
    function c(t) {
      function e(t) {
        t.sub ? c(t.sub) : t.branches && t.branches.map(c);
      }
      var r = t[0];
      e(r);
      for (var n, i = 1, a = 1, s = t.length; i < s; i++) {
        if (((n = t[i]), n.type === EXACT_NODE)) {
          if (r.type === EXACT_NODE && !r.repeat && !n.repeat) {
            (r.indices[1] = n.indices[1]), (r.raw += n.raw), (r.chars += n.chars);
            continue;
          }
        } else e(n);
        (t[a++] = n), (r = n);
      }
      r && (t.length = a);
    }
    function h(t, e, r) {
      if (!t.length)
        return void t.push({
          type: EMPTY_NODE,
          indices: [r, r]
        });
      t.reduce(function (t, r) {
        return (
          r.indices.push(t),
          (r.raw = e.slice(r.indices[0], t)),
          r.type === GROUP_NODE || (r.type === ASSERT_NODE && r.sub)
            ? h(r.sub, e, r.endParenIndex)
            : r.type === CHOICE_NODE
            ? (r.branches.reduce(function (t, r) {
                h(r, e, t);
                var n = r[0];
                return (n ? n.indices[0] : t) - 1;
              }, t),
              r.branches.reverse())
            : r.type === EXACT_NODE &&
              (r.concatTemp || (r.chars = r.chars || r.raw)),
          r.indices[0]
        );
      }, r),
        t.reverse();
    }
    /**
     * Comprueba si un assert tiene un quantificador, si es asi lanza un error
     * @param {*} regex_object
     */
    function define_error_assert_non_quantificable(regex_object, regex_language) {
      // Defino en que idiomas esto es posible
      if (regex_object.repeat && regex_language != "python") {
        var e = regex_object.assertionType,
          r = "Nothing to repeat! Repeat after assertion doesn't make sense!";
        if ("AssertLookahead" === e || "AssertNegativeLookahead" === e) {
          var n = "AssertLookahead" === e ? "?=" : "?!",
            i = "(" + n + "b)";
          r +=
            "\n/a" +
            i +
            "+/、/a" +
            i +
            "{1,n}/ are the same as /a" +
            i +
            "/。\n/a" +
            i +
            "*/、/a" +
            i +
            "{0,n}/、/a" +
            i +
            "?/ are the same as /a/。";
        }
        init_object.RegexSyntaxThrows.push({
          type: "NothingRepeat",
          lastIndex: regex_object.indices[1] - 1,
          message: r
        });
      }
    }
    function define_error_out_order_charset(regex_json_tree, regex_language) {
      regex_json_tree.ranges = auxKit.sortUnique(
        regex_json_tree.ranges.map(function (t) {
          if (t[0] > t[1])
            init_object.RegexSyntaxThrows.push({
              type: "OutOfOrder",
              lastIndex: t.lastIndex,
              message:
                "Range [" + t.join("-") + "] out of order in character class!"
            });
          return t.join("");
        })
      );
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
      });
    }
    nodeType = {
      UNEXPECTED_NODE: "unexpected",
      EXACT_NODE: "exact",
      HEXADECIMAL_NODE: "hexadecimal",
      UNICODE_NODE: "unicode",
      OCTAL_NODE: "octal",
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
      (create_regexObject.prototype.traverse = function (
        has_error_callback,
        re_token_type,
        re_language
      ) {
        function recursive_search_tree(regex_tree, _error_cb, _re_language) {
          regex_tree.forEach(function (branch) {
            (re_token_type && branch.type !== re_token_type) ||
              _error_cb(branch, _re_language),
              branch.sub
                ? recursive_search_tree(branch.sub, _error_cb, _re_language)
                : branch.branches &&
                  branch.branches.forEach(function (branch_leaf) {
                    recursive_search_tree(branch_leaf, _error_cb, _re_language);
                  });
          });
        }
        recursive_search_tree(this.tree, has_error_callback, re_language);
      });
  
    var d;
    (init_object.Constants = nodeType),
      (init_object.exportConstants = r),
      (init_object.RegexSyntaxError = define_regexError),
      (init_object.RegexSyntaxThrows = []),
      (init_object.getNFAParser = load_NFA_Parser);
  
    var NFAparser;
    define_regexError.prototype.toString = function () {
      return this.name + " " + this.type + ":" + this.message;
    };
    var specialChars = {
      n: "\n",
      r: "\r",
      t: "\t",
      v: "\v",
      f: "\f"
    };
    const escapeSpecialChars = (specialRaw) => {
      return specialRaw
        .replace(/(\n)/g, "\\n")
        .replace(/(\r)/g, "\\r")
        .replace(/(\t)/g, "\\t")
        .replace(/(\v)/g, "\\v")
        .replace(/(\f)/g, "\\f")
    }
    
    var charset_hex = "0-9a-fA-F";
    var names_repeat = "repeatnStart,repeatn_1,repeatn_2,repeatnErrorStart,repeatnError_1,repeatnError_2";
    var names_hexEscape = "hexEscape1,hexEscape2";
    var names_unicodeEscape = "unicodeEscape1,unicodeEscape2,unicodeEscape3,unicodeEscape4";
    var names_charsetUnicodeHexEscape = "charsetUnicodeEscape1,charsetUnicodeEscape2,charsetUnicodeEscape3,charsetUnicodeEscape4,charsetHexEscape1,charsetHexEscape2";
    
    var elementsCallback = (function () {
      function f_exact(t, e, r) {
        var n = t[0];
        (!n || n.type != EXACT_NODE || n.repeat || (n.chars && !n.concatTemp)) &&
          t.unshift({
            id: Math.random().toString(36).substr(2, 9),
            type: EXACT_NODE,
            indices: [r]
          }),
          n && n.concatTemp && (n.chars += e);
      }
      function f_dot(t, e, r) {
        t.unshift({
          id: Math.random().toString(36).substr(2, 9),
          type: DOT_NODE,
          indices: [r]
        });
      }
      function f_nullChar(t, e, r) {
        t.unshift({
          id: Math.random().toString(36).substr(2, 9),
          type: EXACT_NODE,
          chars: "\0",
          indices: [r - 1]
        });
      }
      function f_assertBegin(t, e, r) {
        t.unshift({
          id: Math.random().toString(36).substr(2, 9),
          type: ASSERT_NODE,
          indices: [r],
          assertionType: AssertBegin
        });
      }
      function f_assertEnd(t, e, r, n, i) {
        t.unshift({
          id: Math.random().toString(36).substr(2, 9),
          type: ASSERT_NODE,
          indices: [r],
          assertionType: AssertEnd
        });
      }
      function f_assertWordBoundary(t, e, r) {
        t.unshift({
          id: Math.random().toString(36).substr(2, 9),
          type: ASSERT_NODE,
          indices: [r - 1],
          assertionType: "b" == e ? AssertWordBoundary : AssertNonWordBoundary
        });
      }
      function f_repeatnStart(t, e, r) {
        t[0].type !== EXACT_NODE &&
          t.unshift({
            id: Math.random().toString(36).substr(2, 9),
            type: EXACT_NODE,
            indices: [r]
          });
      }
      /**
       *
       * @param {*} t
       * @param {*} e
       * @param {*} r
       */
      function f_repeatnComma(t, e, r) {
        s(t[0], "_commaIndex", r);
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
        var a,
          s = t[0],
          o = i.lastIndexOf("{", r),
          c = parseInt(i.slice(o + 1, s._commaIndex || r), 10);
        if (s._commaIndex) {
          if (
            (a =
              s._commaIndex + 1 == r
                ? 1 / 0
                : parseInt(i.slice(s._commaIndex + 1, r), 10)) < c
          )
            init_object.RegexSyntaxThrows.push({
              type: "OutOfOrder",
              lastState: n,
              lastIndex: r,
              // lastStack: t,
              message: "Numbers out of order in {} quantifier!"
            });
          delete s._commaIndex;
        } else a = c;
        s.indices[0] >= o && t.shift(), f_aux_repeated(t, c, a, o, i);
      }
      function f_repeat0ToInf(t, e, r, n, i) {
        f_aux_repeated(t, 0, 1 / 0, r, i);
      }
      function f_repeat0To1(t, e, r, n, i) {
        f_aux_repeated(t, 0, 1, r, i);
      }
      function f_repeat1ToInf(t, e, r, n, i) {
        f_aux_repeated(t, 1, 1 / 0, r, i);
      }
      function f_aux_repeated(t, e, r, n, i) {
        var a = t[0],
          o = {
            min: e,
            max: r,
            nonGreedy: !1
          },
          c = n - 1;
        if (
          (a.chars && 1 === a.chars.length && (c = a.indices[0]),
          a.type === EXACT_NODE)
        ) {
          var h = {
            id: Math.random().toString(36).substr(2, 9),
            type: EXACT_NODE,
            repeat: o,
            chars: a.chars ? a.chars : i[c],
            indices: [c]
          };
          a.indices[0] === c && t.shift(), t.unshift(h);
        } else a.repeat = o;
        s(o, "beginIndex", n - t[0].indices[0]);
      }
      function f_repeatNonGreedy(t) {
        t[0].repeat.nonGreedy = !0;
      }
      function f_escapeStart(t, e, r) {
        t.unshift({
          concatTemp: !0,
          id: Math.random().toString(36).substr(2, 9),
          type: EXACT_NODE,
          chars: "",
          indices: [r]
        });
      }
      function f_normalEscape(t, e, r) {
        specialChars.hasOwnProperty(e) && (e = specialChars[e]),
          t.unshift({
            id: Math.random().toString(36).substr(2, 9),
            type: EXACT_NODE,
            chars: e,
            indices: [r - 1]
          });
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
        });
      }
      function f_hexEscape(t, e, r, n, i) {
        (e = String.fromCharCode(parseInt(i[r - 1] + e, 16))),
          t.shift(),
          t.unshift({
            id: Math.random().toString(36).substr(2, 9),
            type: HEXADECIMAL_NODE,
            chars: e,
            indices: [r - 3]
          });
      }
      function f_unicodeEscape(t, e, r, n, i) {
        (e = String.fromCharCode(parseInt(i.slice(r - 3, r + 1), 16))),
          t.shift(),
          t.unshift({
            id: Math.random().toString(36).substr(2, 9),
            type: UNICODE_NODE,
            chars: e,
            indices: [r - 5]
          });
      }
      function f_groupStart(t, e, r) {
        var n = (t.groupCounter = t.groupCounter || {
          i: 0
        });
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
        return (t = i.sub), s(t, "_parentGroup", i), (t.groupCounter = n), t;
      }
      function f_groupNonCapture(t) {
        var e = t._parentGroup;
        (e.nonCapture = !0), (e.num = void 0), t.groupCounter.i--;
      }
      function f_groupNamedContent(t, e) {
        var n = t._parentGroup;
        n.name += e;
      }
      function f_groupNamedBadName(lastStack, actualChar, lastIndex, lastState, regexRaw, callback) {
        let objectError = {
          type: "GroupBadName",
          lastIndex: lastIndex,
          // lastStack: lastStack,
          lastState: lastState,
          message: `The group name cannot has the char "${actualChar}"`
        }
        init_object.RegexSyntaxThrows.push(objectError);
        var n = lastStack._parentGroup;
        n.name += actualChar;
        
        if ( !n.errors ) {
          n.errors = [];
        }
        n.errors.push(objectError);
        
      }
      function f_groupToAssertion(t, e, r) {
        var n = t._parentGroup;
        (n.type = ASSERT_NODE),
          (n.assertionType =
            "=" == e ? AssertLookahead : AssertNegativeLookahead),
          (n.num = void 0),
          t.groupCounter.i--;
      }
      function f_groupEnd(t, e, r, n, i) {
        t = f_endChoice(t);
        var a = t._parentGroup;
        if (!a)
          init_object.RegexSyntaxThrows.push({
            type: "UnexpectedChar",
            lastIndex: r,
            lastState: n,
            // lastStack: t,
            message: "Unexpected end parenthesis!"
          });
        return (
          delete t._parentGroup,
          delete t.groupCounter,
          (t = a._parentStack),
          delete a._parentStack,
          t.unshift(a),
          (a.endParenIndex = r),
          t
        );
      }
      function f_choice(t, e, r) {
        var n,
          i = [];
        if (t._parentChoice)
          (n = t._parentChoice),
            n.branches.unshift(i),
            s(i, "_parentChoice", n),
            s(i, "_parentGroup", n),
            (i.groupCounter = t.groupCounter),
            delete t._parentChoice,
            delete t.groupCounter;
        else {
          var a = t[t.length - 1];
          (n = {
            id: Math.random().toString(36).substr(2, 9),
            type: CHOICE_NODE,
            indices: [a ? a.indices[0] : r - 1],
            branches: []
          }),
            s(n, "_parentStack", t),
            n.branches.unshift(t.slice()),
            (t.length = 0),
            t.unshift(n),
            (i.groupCounter = t.groupCounter),
            s(i, "_parentChoice", n),
            s(i, "_parentGroup", n),
            n.branches.unshift(i);
        }
        return i;
      }
      function f_endChoice(t) {
        if (t._parentChoice) {
          var e = t._parentChoice;
          delete t._parentChoice, delete t._parentGroup, delete t.groupCounter;
          var r = e._parentStack;
          return delete e._parentStack, r;
        }
        return t;
      }
      function f_charsetStart(t, e, r) {
        t.unshift({
          id: Math.random().toString(36).substr(2, 9),
          type: CHARSET_NODE,
          indices: [r],
          classes: [],
          ranges: [],
          tokens: [],
          chars: ""
        });
      }
      function f_charsetExclude(t) {
        t[0].exclude = !0;
      }
      function f_charsetContent(t, e, r) {
        t[0].chars += e;
        t[0].tokens.push({
          type: "char",
          indices: [r, r+1],
          raw: e
        });
      }
      function f_charsetNormalEscape(t, e, r) {
        t[0].tokens.push({
          type: "escape",
          indices: [r-1, r+1],
          raw: `\\${e}`
        });
        specialChars.hasOwnProperty(e) && (e = specialChars[e]), (t[0].chars += e);
      }
      function f_charsetNullChar(t, e, r) {
        t[0].chars += "\0";
        t[0].tokens.push({
          type: "escape",
          indices: [r-1, r+1],
          raw: "\\0"
        });
      }
      function f_charsetClassEscape(t, e, r) {
        t[0].classes.push(e);
        t[0].tokens.push({
          type: "shorthand",
          indices: [r-1, r+1],
          raw: `\\${e}`
        });
      }
      function f_charsetHexEscape(lastStack, actualChar, r, n, i) {
        var actualToken = lastStack[0];
        let hexChar = actualToken.chars.slice(-1) + actualChar;
        let actualCharEscaped = String.fromCharCode(parseInt(hexChar, 16));
        actualToken.chars = actualToken.chars.slice(0, -2);
        actualToken.chars += actualCharEscaped;
        
        actualToken.tokens = actualToken.tokens.slice(2);
        actualToken.tokens.push({
          type: "char-hexadecimal",
          escaped: actualCharEscaped,
          indices: [r-3, r+1],
          raw: `\\x${hexChar}`
        });
      }
      function f_charsetUnicodeEscape(lastStack, actualChar, r, n, i) {
        var actualToken = lastStack[0];
        let unicodeChar = actualToken.chars.slice(-3) + actualChar;
        let actualCharEscaped = String.fromCharCode(parseInt(unicodeChar, 16));
        actualToken.chars = actualToken.chars.slice(0, -4);
        actualToken.chars += actualCharEscaped;
        
        actualToken.tokens = actualToken.tokens.slice(4);
        actualToken.tokens.push({
          type: "char-unicode",
          escaped: actualCharEscaped,
          indices: [r-5, r+1],
          raw: `\\u${unicodeChar}`
        });
      }
      function f_charsetRangeEnd(lastStack, actualChar, lastIndex, n, i, lastEscaped=false) {
        let actualToken = lastStack[0];
        let charRangeStart = actualToken.chars.slice(-2);
        charRangeStart = [charRangeStart[0], actualChar],
        charRangeStart.lastIndex = lastIndex;
        actualToken.ranges.push(charRangeStart);
        actualToken.chars = actualToken.chars.slice(0, -2);
        
        let startToken = actualToken.tokens.slice(-2)[0];
        let endToken = {
          type: "char",
          indices: [lastEscaped ? lastIndex-1:lastIndex, lastIndex+1],
          raw: lastEscaped ? escapeSpecialChars(actualChar) : actualChar
        }
        actualToken.tokens = actualToken.tokens.slice(0, -2);
        actualToken.tokens.push({
          type: "range",
          range: [startToken, endToken],
          indices: [startToken.indices[0], lastIndex+1],
          raw: `${startToken.raw}-${endToken.raw}`
        });
      }
      function f_charsetRangeEndNormalEscape(lastStack, actualChar, lastIndex, n, i) {
        if (specialChars.hasOwnProperty(actualChar)) {
          let prevChar = actualChar;
          actualChar = specialChars[actualChar];
          return f_charsetRangeEnd(lastStack, actualChar, lastIndex, n, i, lastEscaped=true);
        }
        
      }
      function f_charsetRangeEndUnicodeEscape(lastStack, actualChar, lastIndex) {
        let actualToken = lastStack[0];
        let charsRangeEnd = actualToken.chars.slice(-3) + actualChar;
        actualToken.chars = actualToken.chars.slice(0, -3);
        var charsRangeStart = actualToken.ranges.pop();
        actualChar = String.fromCharCode(parseInt(charsRangeEnd, 16));
        charsRangeStart = [charsRangeStart[0], actualChar];
        charsRangeStart.lastIndex = lastIndex;
        actualToken.ranges.push(charsRangeStart);
        
        let rangeToken = actualToken.tokens.slice(-4)[0];
        let startToken = rangeToken.range[0];
        let endToken = {
          type: "char",
          escaped: actualChar,
          indices: [lastIndex-5, lastIndex+1],
          raw: `\\u${charsRangeEnd}`
        }
        actualToken.tokens = actualToken.tokens.slice(0, -4);
        actualToken.tokens.push({
          type: "range",
          range: [startToken, endToken],
          indices: [rangeToken.indices[0], lastIndex+1],
          raw: `${startToken.raw}-${endToken.raw}`
        });
      }
      function f_charsetRangeEndHexEscape(lastStack, actualChar, lastIndex) {
        var actualToken = lastStack[0];
        let charsRangeEnd = actualToken.chars.slice(-1) + actualChar;
        actualToken.chars = actualToken.chars.slice(0, -1);
        var charsRangeStart = actualToken.ranges.pop();
        actualChar = String.fromCharCode(parseInt(charsRangeEnd, 16));
        charsRangeStart = [charsRangeStart[0], actualChar];
        charsRangeStart.lastIndex = lastIndex;
        actualToken.ranges.push(charsRangeStart);
        
        let rangeToken = actualToken.tokens.slice(-2)[0];
        let startToken = rangeToken.range[0];
        let endToken = {
          type: "char",
          escaped: actualChar,
          indices: [lastIndex-3, lastIndex+1],
          raw: `\\x${charsRangeEnd}`
        }
        actualToken.tokens = actualToken.tokens.slice(0, -2);
        actualToken.tokens.push({
          type: "range",
          range: [startToken, endToken],
          indices: [rangeToken.indices[0], lastIndex+1],
          raw: `${startToken.raw}-${endToken.raw}`
        });
      }
      function f_backref(t, e, r, n) {
        function i(t, e) {
          return (
            !!e._parentGroup &&
            (e._parentGroup.num == t ? t : i(t, e._parentGroup._parentStack))
          );
        }
        var a = t[0],
          s = parseInt(e, 10),
          o = "escape" === n,
          c = t.groupCounter,
          h = (c && c.i) || 0;
        if (
          (o
            ? ((a = {
                id: Math.random().toString(36).substr(2, 9),
                type: BACKREF_NODE,
                indices: [r - 1]
              }),
              t.unshift(a))
            : (s = parseInt(a.num + "" + s, 10)),
          s > h)
        )
          init_object.RegexSyntaxThrows.push({
            type: "InvalidBackReference",
            lastIndex: r,
            lastStack: t,
            lastState: n,
            message:
              "Back reference number(" +
              s +
              ") greater than current groups count(" +
              h +
              ")."
          });
        if (i(s, t))
          init_object.RegexSyntaxThrows.push({
            type: "InvalidBackReference",
            lastIndex: r,
            lastStack: t,
            lastState: n,
            message: "Recursive back reference in group (" + s + ") itself."
          });
        a.num = s;
      }
  
      function f_tokenIncomlpete(lastStack, actualChar, lastIndex, lastState, regexRaw) {
        // +*?^$.|(){[\\
        let callbackToken = f_exact;
        let callbackMap = {
          "+": f_repeat1ToInf,
          "*": f_repeat0ToInf,
          "?": f_repeat0To1,
          "^": f_assertBegin,
          "$": f_assertEnd,
          ".": f_dot,
          "|": f_choice,
          "(": f_groupStart,
          ")": f_groupEnd,
          "{": f_repeatnStart,
          "[": f_charsetStart,
          "\\": f_escapeStart,
        }
        if (actualChar in callbackMap) {
          callbackToken = callbackMap[actualChar]
        }
        if ( names_hexEscape.split(",").indexOf(lastState) !== -1 ) {
          return f_tokenIncompleteHex(
            lastStack, actualChar, lastIndex, lastState, regexRaw, callbackToken
          );
        }
        if ( names_unicodeEscape.split(",").indexOf(lastState) !== -1 ) {
          return f_tokenIncompleteUnicode(
            lastStack, actualChar, lastIndex, lastState, regexRaw, callbackToken
          );
        }
      }
      
      function f_tokenIncompleteCharset(lastStack, actualChar, lastIndex, lastState, regexRaw) {
        let callbackToken = f_charsetContent;
        let callbackMap = {
          "]": undefined,
          "\\": undefined,
        }
        if (actualChar in callbackMap) {
          callbackToken = callbackMap[actualChar]
        }
  
        const _charsetIncompleteEscaped = (tokenEscaped, tokenClass) => {
          let lastIndexIncomplete = regexRaw.slice(0, lastIndex).lastIndexOf(`\\${tokenEscaped}`) + 1;
          let numberIncomplete = lastIndex - lastIndexIncomplete;
          init_object.RegexSyntaxThrows.push({
            type: "TokenIncomplete",
            lastIndex: lastIndexIncomplete,
            lastStack: lastStack,
            lastState: lastState,
            message: `The ${tokenClass} escaped char is incomplete!`
          });
          
          // We need to add to the `chars` field the chars non escape chars, and left the \xAA not added
          let badCharsCaptured = lastStack[0].chars.slice(lastStack[0].chars.length - numberIncomplete, ).slice(1,);
          if ( badCharsCaptured ) {
            lastStack[0].chars = lastStack[0].chars.slice(0, -numberIncomplete);
          }
          lastStack[0].chars += badCharsCaptured;
          
          // Capture the wrong token at -2 positions
          let wrongToken = lastStack[0].tokens[lastStack[0].tokens.length-1 - (numberIncomplete-1)]
          // Modify type to hexadecimal/unicode escaped and wrong
          wrongToken.type = `char-${tokenClass}`;
          wrongToken.indices = [wrongToken.indices[0]-1, wrongToken.indices[1]];
          wrongToken.raw = `\\${wrongToken.raw}`;
        };
        const _charsetEndRangeIncompleteEscaped = (tokenEscaped, tokenClass) => {
          let actualToken = lastStack[0];
          let lastIndexIncomplete = regexRaw.slice(0, lastIndex).lastIndexOf(`\\${tokenEscaped}`) + 1;
          let numberIncomplete = lastIndex - lastIndexIncomplete;
          
          // We need to add to the `chars` field the chars non escape chars, and left the \u not added but XXX added
          let badCharsCaptured = actualToken.chars.slice(actualToken.chars.length - numberIncomplete, ).slice(1,);
          if ( badCharsCaptured !== "" ) {
            // Use the length of badCharsCaptured because the \u is added to the range end
            actualToken.chars = actualToken.chars.slice(0, -badCharsCaptured.length);
          }
          
          
          let charsRangeStart = actualToken.ranges.pop();
          // Add the chars Raged start to list chars because no longer is a valid range
          actualToken.chars += charsRangeStart[0];
          // After add the bad captured chars of \uXXX , XXX because arent a valid escaped char
          actualToken.chars += badCharsCaptured;
  
          // Now add the errors, first a bad range
          init_object.RegexSyntaxThrows.push({
            type: "InvalidRange",
            // -2 because the lastIndexIncomplete is for the letter u, and this error is for the `-` range
            lastIndex: lastIndexIncomplete - 2,
            lastStack: lastStack,
            lastState: lastState,
            message: `The right ${tokenClass} escaped token is invalid!`
          });
          // Then the token incomplete error
          init_object.RegexSyntaxThrows.push({
            type: "TokenIncomplete",
            lastIndex: lastIndexIncomplete,
            lastStack: lastStack,
            lastState: lastState,
            message: `The ${tokenClass} escaped char is incomplete!`
          });
          
          // Charset Tokens
          // Capture the wrong token at -2 positions
          let wrongToken = lastStack[0].tokens[lastStack[0].tokens.length-1 - (numberIncomplete-1)]
          // Modify type to hexadecimal/unicode escaped and wrong
          wrongToken.range[1].type = `char-${tokenClass}`;
          wrongToken.range[1].indices = [wrongToken.range[1].indices[0]-1, wrongToken.range[1].indices[1]];
          wrongToken.range[1].raw = `\\${tokenEscaped}`;
          wrongToken.raw = `${wrongToken.range[0].raw}-${wrongToken.range[1].raw}`;
        };
        
        // Charset Hexadecimal
        if ( ["charsetHexEscape1", "charsetHexEscape2"].indexOf(lastState) !== -1 ) {
          _charsetIncompleteEscaped("x", "hexadecimal");
        }
        // Charset Unicode
        if ( ["charsetUnicodeEscape1", "charsetUnicodeEscape2", "charsetUnicodeEscape3", "charsetUnicodeEscape4"].indexOf(lastState) !== -1 ) {
          _charsetIncompleteEscaped("u", "unicode");
        }
        
        if ( ["charsetRangeEndUnicodeEscape1", "charsetRangeEndUnicodeEscape2", "charsetRangeEndUnicodeEscape3","charsetRangeEndUnicodeEscape4"].indexOf(lastState) !== -1) {
          _charsetEndRangeIncompleteEscaped("u", "unicode");
        }
        if ( ["charsetRangeEndHexEscape1", "charsetRangeEndHexEscape2"].indexOf(lastState) !== -1 ) {
          _charsetEndRangeIncompleteEscaped("x", "hexadecimal");
        }
        
        if (callbackToken) {
          return callbackToken(lastStack, actualChar, lastIndex, lastState, regexRaw);
        }
      }
      
      // Incomplete escaped characters
      function f_tokenIncompleteHex(lastStack, actualChar, lastIndex, lastState, regexRaw, callback) {
        let lastIndexIncomplete = regexRaw.slice(0, lastIndex).lastIndexOf("\\x") + 1;
        
        init_object.RegexSyntaxThrows.push({
          type: "TokenIncomplete",
          lastIndex: lastIndexIncomplete,
          // lastStack: lastStack,
          lastState: lastState,
          message: "The hexadecimal escaped char is incomplete!"
        });
        lastStack.shift();
        // Add the wrong escaped hex
        lastStack.unshift({
          id: Math.random().toString(36).substr(2, 9),
          type: HEXADECIMAL_NODE,
          chars: "",
          indices: [lastIndexIncomplete-1]
        });
        // Add the other tokens
        if (regexRaw.slice(lastIndexIncomplete+1, lastIndex) !== "") {
          lastStack.unshift({
            id: Math.random().toString(36).substr(2, 9),
            type: EXACT_NODE,
            chars: regexRaw.slice(lastIndexIncomplete+1, lastIndex),
            indices: [lastIndexIncomplete + 1]
          });
        }
  
        return callback(lastStack, actualChar, lastIndex, lastState, regexRaw);
      }
      function f_tokenIncompleteUnicode(lastStack, actualChar, lastIndex, lastState, regexRaw, callback) {
        let lastIndexIncomplete = regexRaw.slice(0, lastIndex).lastIndexOf("\\u") + 1;
        
        init_object.RegexSyntaxThrows.push({
          type: "TokenIncomplete",
          lastIndex: lastIndexIncomplete,
          // lastStack: lastStack,
          lastState: lastState,
          message: "The unicode escaped char is incomplete!"
        });
        lastStack.shift();
        // Add the wrong escaped hex
        lastStack.unshift({
          id: Math.random().toString(36).substr(2, 9),
          type: UNICODE_NODE,
          chars: "",
          indices: [lastIndexIncomplete-1]
        });
        // Add the other tokens only can be exact, because the others are added in the callback function
        if (regexRaw.slice(lastIndexIncomplete+1, lastIndex) !== "") {
          lastStack.unshift({
            id: Math.random().toString(36).substr(2, 9),
            type: EXACT_NODE,
            chars: regexRaw.slice(lastIndexIncomplete+1, lastIndex),
            indices: [lastIndexIncomplete + 1]
          });
        }
  
        return callback(lastStack, actualChar, lastIndex, lastState, regexRaw);
      }
      
      function f_tokenIncompleteCharsetHex(lastStack, actualChar, lastIndex, lastState, regexRaw, callback) {
        init_object.RegexSyntaxThrows.push({
          type: "TokenIncomplete",
          lastIndex: lastIndexIncomplete,
          // lastStack: lastStack,
          lastState: lastState,
          message: "The hexadecimal escaped char is incomplete!"
        });
  
        var actualToken = lastStack[0];
        actualChar = String.fromCharCode(parseInt(actualToken.chars.slice(-1) + actualChar, 16));
        actualToken.chars = actualToken.chars.slice(0, -2);
        actualToken.chars += actualChar;
      }
      function f_tokenIncompleteCharsetUnicode(lastStack, actualChar, lastIndex, lastState, regexRaw, callback) {
        let errObj = {
          type : "TokenIncomplete",
          lastIndex: lastIndexIncomplete,
          // lastStack: lastStack,
          lastState: lastState,
          message: "The unicode escaped char is incomplete!"
        }
        init_object.RegexSyntaxThrows.push(errObj);
  
        var actualToken = t[0];
        actualChar = String.fromCharCode(parseInt(actualToken.chars.slice(-3) + actualChar, 16));
        actualToken.chars = actualToken.chars.slice(0, -4);
        actualToken.chars += actualChar;
        actualToken.errors.push(errObj)
      }
      
      function f_unexpectedChar(lastStack, actualChar, lastIndex, lastState, regexRaw) {
        let actualToken = lastStack[0];
        let errorObj = {
          type: "UnexpectedChar",
          lastIndex: lastIndex,
          // lastStack: lastStack,
          lastState: lastState,
          message: `Unexpected character ${actualChar}!`
        };
        lastStack.unshift({
          id: Math.random().toString(36).substr(2, 9),
          type: UNEXPECTED_NODE,
          indices: [lastIndex],
          errors: [errorObj]
        });
        init_object.RegexSyntaxThrows.push(errorObj);
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
        groupNamedBadName: f_groupNamedBadName,
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
        charsetRangeEndHexEscape: f_charsetRangeEndHexEscape,
        tokenIncomlpete: f_tokenIncomlpete,
        tokenIncompleteCharset: f_tokenIncompleteCharset,
        // tokenIncompleteHex: f_tokenIncompleteHex,
        // tokenIncompleteUnicode: f_tokenIncompleteUnicode,
        // tokenIncompleteCharsetHex: f_tokenIncompleteCharsetHex,
        // tokenIncompleteCharsetUnicode: f_tokenIncompleteCharsetUnicode,
        unexpectedChar: f_unexpectedChar
      };
    })();
    
    // Estas estructuras componen el arbol de posibilidades que puede tener cada caracter
    var base_validStructs = {
      compact: true,
      // Estos estados se aceptan como finales para considerar bien la regex, si estan en otro estado final se analiza si pertenece a un error
      accepts:
        "start,begin,end,repeat0,repeat1,exact,repeatn,repeat01,repeatNonGreedy,choice"
        + "," + names_repeat + ",nullChar,digitBackref"
        // + "," + names_unicodeEscape + "," + names_hexEscape
      ,
      trans: [
        [
          "start,begin,end,exact,repeatNonGreedy,repeat0,repeat1,repeat01,groupStart,groupQualifiedStart,choice,repeatn>exact",
          "^+*?^$.|(){[\\",
          elementsCallback.exact
        ],
        ["nullChar>exact", "^+*?^$.|(){[\\0-9", elementsCallback.exact],
        [
          names_repeat + ",nullChar,digitBackref"
          // + "," + names_unicodeEscape + "," + names_hexEscape
          + ",start,begin,end,exact,repeatNonGreedy,repeat0,repeat1,repeat01,groupStart,groupQualifiedStart,choice,repeatn>exact",
          ".",
          elementsCallback.dot
        ],
        [
          "start,groupStart,groupQualifiedStart,end,begin,exact,repeat0,repeat1,repeat01,repeatn,repeatNonGreedy,choice," +
          names_repeat + ",nullChar,digitBackref"
          // + "," + names_unicodeEscape + "," + names_hexEscape
          + ">begin",
          "^",
          elementsCallback.assertBegin
        ],
        [
          names_repeat +
          ",nullChar,digitBackref"
          // + "," + names_unicodeEscape + "," + names_hexEscape
          + ",exact>repeatnStart",
          "{",
          elementsCallback.repeatnStart
        ],
        [
          "start,begin,end,groupQualifiedStart,groupStart,repeat0,repeat1,repeatn,repeat01,repeatNonGreedy,choice>repeatnErrorStart",
          "{",
          elementsCallback.exact
        ],
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
        [
          "exact," + names_repeat + ",nullChar,digitBackref"
          // + "," + names_unicodeEscape + "," + names_hexEscape
          + ">repeat0",
          "*",
          elementsCallback.repeat0ToInf
        ],
        [
          "exact," + names_repeat + ",nullChar,digitBackref"
          // + "," + names_unicodeEscape + "," + names_hexEscape
          + ">repeat1",
          "+",
          elementsCallback.repeat1ToInf
        ],
        [
          "exact," + names_repeat + ",nullChar,digitBackref"
          // + "," + names_unicodeEscape + "," + names_hexEscape
          + ">repeat01",
          "?",
          elementsCallback.repeat0To1
        ],
        ["choice>repeatErrorFinal", "*+?"],
        // Se devuelve el estado de error al inicio para que continue parseando
        // TODO: Hay que agregar una funcion para almacenar el error
        ["repeatErrorFinal>exact", ""],
        ["repeat0,repeat1,repeat01,repeatn>repeatNonGreedy","?",elementsCallback.repeatNonGreedy],
        ["repeat0,repeat1,repeat01,repeatn>repeatErrorFinal", "+*"],
        [
          "start,begin,end,groupStart,groupQualifiedStart,exact,repeatNonGreedy,repeat0,repeat1,repeat01,repeatn,choice," +
          names_repeat +
          ",nullChar,digitBackref"
          // + "," + names_unicodeEscape + "," + names_hexEscape
          + ">escape",
          "\\",
          elementsCallback.escapeStart
        ],
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
        [
          "exact,begin,end,repeat0,repeat1,repeat01,repeatn,repeatNonGreedy,start,groupStart,groupQualifiedStart,choice," +
          names_repeat +
          ",nullChar,digitBackref"
          // + "," + names_unicodeEscape + "," + names_hexEscape
          + ">groupStart",
          "(",
          elementsCallback.groupStart
        ],
        ["groupStart>groupQualify", "?"],
        [
          "groupQualify>groupQualifiedStart",
          ":",
          elementsCallback.groupNonCapture
        ],
        ["groupQualify>groupQualifiedStart", "=", elementsCallback.groupToAssertion],
        ["groupQualify>groupQualifiedStart", "!", elementsCallback.groupToAssertion],
        [
          names_repeat +
          ",nullChar,digitBackref"
          // + "," + names_unicodeEscape + "," + names_hexEscape
          + ",groupStart,groupQualifiedStart,begin,end,exact,repeat1,repeat0,repeat01,repeatn,repeatNonGreedy,choice>exact",
          ")",
          elementsCallback.groupEnd
        ],
        [
          "start,begin,end,groupStart,groupQualifiedStart,exact,repeat0,repeat1,repeat01,repeatn,repeatNonGreedy,choice," +
          names_repeat +
          ",nullChar,digitBackref"
          // + "," + names_unicodeEscape + "," + names_hexEscape
          + ">choice",
          "|",
          elementsCallback.choice
        ],
        [
          "start,groupStart,groupQualifiedStart,begin,end,exact,repeat0,repeat1,repeat01,repeatn,repeatNonGreedy,choice," +
          names_repeat + ",nullChar,digitBackref"
          // + "," + names_unicodeEscape + "," + names_hexEscape
          + ">end",
          "$",
          elementsCallback.assertEnd
        ],
        [
          "exact,begin,end,repeat0,repeat1,repeat01,repeatn,repeatNonGreedy,groupQualifiedStart,groupStart,start,choice," +
          names_repeat + ",nullChar,digitBackref"
          // + "," + names_unicodeEscape + "," + names_hexEscape
          + ">charsetStart",
          "[",
          elementsCallback.charsetStart
        ],
        // CHARSET
        ["charsetStart>charsetExclude", "^", elementsCallback.charsetExclude],
        ["charsetStart>charsetContent", "^\\]^", elementsCallback.charsetContent],
        ["charsetExclude>charsetContent", "^\\]", elementsCallback.charsetContent],
        ["charsetContent,charsetClass>charsetContent", "^\\]-", elementsCallback.charsetContent],
        ["charsetClass>charsetContent", "-", elementsCallback.charsetContent],
        [
          // names_charsetUnicodeHexEscape + "," +
          "charsetStart,charsetContent,charsetNullChar,charsetClass,charsetExclude,charsetRangeEnd>charsetEscape",
          "\\"
        ],
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
        [
          // names_charsetUnicodeHexEscape + "," +
          "charsetNullChar,charsetContent>charsetRangeStart","-",elementsCallback.charsetContent
        ],
        [
          "charsetRangeStart>charsetRangeEnd",
          "^\\]",
          elementsCallback.charsetRangeEnd
        ],
        [
          "charsetRangeEnd>charsetContent",
          "^\\]",
          elementsCallback.charsetContent
        ],
        ["charsetRangeStart>charsetRangeEndEscape", "\\"],
        [
          "charsetRangeEndEscape>charsetRangeEnd",
          "^dDwWsSux0-9bB1-9",
          elementsCallback.charsetRangeEndNormalEscape
        ],
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
        
        // ["charsetRangeEndUnicodeEscape1,charsetRangeEndHexEscape1>charsetContent", "^\\]0-9a-fA-F", elementsCallback.charsetContent],
        // [
        //   "charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4,charsetRangeEndHexEscape2>charsetRangeStart",
        //   "-",
        //   elementsCallback.charsetContent
        // ],
        
        // Estado para salir afuera del charset
        [
          // names_charsetUnicodeHexEscape + "," + 
          // "charsetRangeEndHexEscape1,charsetRangeEndHexEscape2" + "," +
          // "charsetRangeEndUnicodeEscape1,charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4" + "," +
          "charsetNullChar,charsetRangeStart,charsetContent,charsetClass,charsetExclude,charsetRangeEnd>exact",
          "]"
        ],
        // [
        //   "groupQualifiedStart>start",
        //   "+*?^$.|(){[\\",
        //   elementsCallback.unexpectedChar
        // ],
      ],
      unexpectedToken: elementsCallback.unexpectedChar,
      unexpectedRouter: {
        "groupQualify" : "groupQualifiedStart"
      }
    };
    var javascript_validStructs = {
      compact: true,
      accepts: base_validStructs.accepts,
      trans: base_validStructs.trans.concat([
        // Permite escapar hexadecimal y unicade sin estar completo
        // "hexEscape1,hexEscape2,unicodeEscape1,unicodeEscape2,unicodeEscape3,unicodeEscape4"
        [
          "hexEscape1,hexEscape2,unicodeEscape1,unicodeEscape2,unicodeEscape3,unicodeEscape4>exact",
          "^+*?^$.|(){[\\0-9a-fA-F",
          elementsCallback.exact
        ],
        // Charset
        [names_charsetUnicodeHexEscape + ">charsetContent", "^\\]0-9a-fA-F-", elementsCallback.charsetContent],
        [names_charsetUnicodeHexEscape + ">charsetEscape", "\\"],
        [names_charsetUnicodeHexEscape + ">charsetRangeStart", "-", elementsCallback.charsetContent],
  
        [
          "charsetRangeEndUnicodeEscape1,charsetRangeEndHexEscape1" +
          ",charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4,charsetRangeEndHexEscape2" +
          ">charsetContent",
          "^\\]0-9a-fA-F-",
          elementsCallback.charsetContent],
        [
          "charsetRangeEndHexEscape1,charsetRangeEndHexEscape2" + "," +
          "charsetRangeEndUnicodeEscape1,charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4" +
          ">charsetEscape",
          "\\"
        ],
        [
         "charsetRangeEndHexEscape1,charsetRangeEndHexEscape2" + "," + "charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4,charsetRangeEndHexEscape2" +
          ">charsetRangeStart",
          "-",
          elementsCallback.charsetContent
        ],
        [
          names_charsetUnicodeHexEscape + "," + 
          "charsetRangeEndHexEscape1,charsetRangeEndHexEscape2" + "," +
          "charsetRangeEndUnicodeEscape1,charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4" +
          ">exact",
          "]"
        ],
        // Grupos con nombre en Javascript
        ["groupQualify>groupNamedStart", "<"],
        [
          "groupNamedStart,groupNamedContent>groupNamedContent",
          "0-9a-zA-Z_",
          elementsCallback.groupNamedContent
        ],
        [
          "groupNamedContent,groupNamedBadName>groupNamedBadName",
          "^0-9a-zA-Z_>",
          elementsCallback.groupNamedBadName
        ],
        [
          "groupNamedBadName>groupNamedContent",
          "0-9a-zA-Z_",
          elementsCallback.groupNamedContent
        ],
        ["groupNamedBadName,groupNamedContent>groupQualifiedStart", ">"]
      ]),
      unexpectedToken: elementsCallback.unexpectedChar,
      unexpectedRouter: {
        "groupQualify" : "groupQualifiedStart"
      }
    };
    var python_validStructs = {
      compact: true,
      accepts: base_validStructs.accepts,
      trans: base_validStructs.trans.concat([
        // Token incomplete
        [
          names_unicodeEscape + "," + names_hexEscape + ">exact",
          "^0-9a-fA-F",
          elementsCallback.tokenIncomlpete
        ],
        [
          names_unicodeEscape + "," + names_hexEscape + ">begin",
          "^",
          elementsCallback.tokenIncomlpete
        ],
        [
          names_unicodeEscape + "," + names_hexEscape + ">repeatnStart",
          "{",
          elementsCallback.tokenIncomlpete
        ],
        [
          names_unicodeEscape + "," + names_hexEscape + ">repeat0",
          "*",
          elementsCallback.tokenIncomlpete
        ],
        [
          names_unicodeEscape + "," + names_hexEscape + ">repeat1",
          "+",
          elementsCallback.tokenIncomlpete
        ],
        [
          names_unicodeEscape + "," + names_hexEscape + ">repeat01",
          "?",
          elementsCallback.tokenIncomlpete
        ],
        [
          names_unicodeEscape + "," + names_hexEscape + ">escape",
          "\\",
          elementsCallback.tokenIncomlpete
        ],
        [
          names_unicodeEscape + "," + names_hexEscape + ">groupStart",
          "(",
          elementsCallback.tokenIncomlpete
        ],
        [
          names_unicodeEscape + "," + names_hexEscape + ">exact",
          ")",
          elementsCallback.tokenIncomlpete
        ],
        [
          names_unicodeEscape + "," + names_hexEscape + ">choice",
          "|",
          elementsCallback.tokenIncomlpete
        ],
        [
          names_unicodeEscape + "," + names_hexEscape + ">end",
          "$",
          elementsCallback.tokenIncomlpete
        ],
        [
          names_unicodeEscape + "," + names_hexEscape + ">charsetStart",
          "[",
          elementsCallback.tokenIncomlpete
        ],
        
        // Charset Incomplete
        [
          names_charsetUnicodeHexEscape + ">charsetContent",
          "^\\]0-9a-fA-F-",
          elementsCallback.tokenIncompleteCharset
          // elementsCallback.charsetContent
        ],
        [
          names_charsetUnicodeHexEscape + ">charsetEscape",
          "\\",
          elementsCallback.tokenIncompleteCharset
        ],
        [
          names_charsetUnicodeHexEscape + ">charsetRangeStart",
          "-",
          elementsCallback.tokenIncompleteCharset
          // elementsCallback.charsetContent
        ],
  
        [
          "charsetRangeEndHexEscape1,charsetRangeEndHexEscape2" + "," +
          "charsetRangeEndUnicodeEscape1,charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4" +
          ">charsetContent",
          "^\\]0-9a-fA-F-",
          elementsCallback.tokenIncompleteCharset
          // elementsCallback.charsetContent
        ],
        [
          "charsetRangeEndHexEscape1,charsetRangeEndHexEscape2" + "," +
          "charsetRangeEndUnicodeEscape1,charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4" +
          ">charsetEscape",
          "\\",
          elementsCallback.tokenIncompleteCharset
        ],
        [
        "charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4,charsetRangeEndHexEscape2>charsetRangeStart",
          "-",
          elementsCallback.tokenIncompleteCharset
          // elementsCallback.charsetContent
        ],
        [
          names_charsetUnicodeHexEscape + "," + 
          "charsetRangeEndHexEscape1,charsetRangeEndHexEscape2" + "," +
          "charsetRangeEndUnicodeEscape1,charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4" +
          ">exact",
          "]",
          elementsCallback.tokenIncompleteCharset
        ],
        
        // Grupos con nombre en Python
        ["groupQualify>groupNamedDefined", "P"],
        ["groupNamedDefined>groupNamedStart", "<"],
        [
          "groupNamedStart,groupNamedContent>groupNamedContent",
          "0-9a-zA-Z_",
          elementsCallback.groupNamedContent
        ],
        [
          "groupNamedContent,groupNamedBadName>groupNamedBadName",
          "^0-9a-zA-Z_>",
          elementsCallback.groupNamedBadName
        ],
        [
          "groupNamedBadName>groupNamedContent",
          "0-9a-zA-Z_",
          elementsCallback.groupNamedContent
        ],
        ["groupNamedBadName,groupNamedContent>groupQualifiedStart", ">"]
      ]),
      unexpectedToken: elementsCallback.unexpectedChar,
      unexpectedRouter: {
        "groupQualify" : "groupQualifiedStart"
      }
    };
    var validStructs = {
      javascript6: javascript_validStructs,
      python: python_validStructs
    };
  
    return init_object;
  }
// ),

// module.exports = {parse};
