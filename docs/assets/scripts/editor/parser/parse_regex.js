// (function () {
// var { Kit } = require("./auxiliar_functions");
// var { NFA }  = require("./NFA_parser");

// if (define("parse", ["./NFA", "./Kit"], function(t, e) {
function RegexParser() {
  var auxKit = Kit();
  var nodeType = {};
  var cachedNFA = {};
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
  function analizeForErrors(_processedStack, _raw_regex_input, _error_lastState) {
    if (_processedStack._parentGroup) {
      let errorObject = {
        type: "UnterminatedGroup",
        message: "Unterminated group!",
        lastIndex: _processedStack._parentGroup.indices[0],
        lastState: _error_lastState,
        indices: [_processedStack._parentGroup.indices[0], _processedStack._parentGroup.indices[0]],
        // lastStack: _processedStack
      }
      init_object.RegexSyntaxThrows.push(errorObject);
      if (!_processedStack._parentGroup.errors) _processedStack._parentGroup.errors = [];
      _processedStack._parentGroup.errors.push(errorObject);

      // Se parsea el ultimo grupo
      _processedStack = elementsCallback.groupEnd(_processedStack, "", _raw_regex_input.length, _error_lastState, _raw_regex_input);
    }
    else if (_processedStack._parentChoice) {
      let errorObject = {
        type: "UnterminatedGroup",
        message: "Unterminated group!",
        lastIndex: _processedStack._parentChoice.indices[0],
        lastState: _error_lastState,
        indices: [_processedStack._parentChoice.indices[0], _processedStack._parentChoice.indices[0]],
        // lastStack: _processedStack
      }
      init_object.RegexSyntaxThrows.push(errorObject);
      if (!_processedStack._parentChoice.errors) _processedStack._parentChoice.errors = [];
      _processedStack._parentChoice.errors.push(errorObject);

      // Se parsea el ultimo choice
      _processedStack = elementsCallback.endChoice(_processedStack, "", _raw_regex_input.length, _error_lastState, _raw_regex_input);
    }
    else {
      return _processedStack;
    }
    return analizeForErrors(_processedStack, _raw_regex_input, _error_lastState = null);
  }
  function init_object(raw_regex_input, debug, language) {
    init_object.RegexSyntaxThrows = [];
    d = debug;
    var processedRegex, processedStack;
    var error_lastState;
    var NFA_instance = load_NFA_Parser(language);
    processedRegex = NFA_instance.input(raw_regex_input, 0, debug);
    processedStack = processedRegex.stack;
    processedStack = elementsCallback.endChoice(processedStack);
    error_lastState = processedRegex.lastState;

    // Gestor errores al final del parseo
    var wellParsed = processedRegex.acceptable && processedRegex.lastIndex === raw_regex_input.length - 1;
    if (!wellParsed) {
      var errorObj;
      switch (error_lastState) {
        case "charsetRangeEndWithNullChar":
          errorObj = {
            type: "CharsetRangeEndWithNullChar",
            message:
              "Charset range end with NUL char does not make sense!\nBecause [a-\\0] is not a valid range.\nAnd [\\0-\\0] should be rewritten into [\\0]."
          };
          break;
        case "tokenIncomplete":
          errorObj = {
            type: "TokenIncomplete",
            message: "The token is not completed!"
          };
          break;
        case "repeatErrorFinal":
          errorObj = {
            type: "NothingRepeat",
            message: "Nothing to repeat!"
          };
          break;
        case "digitFollowNullError":
          errorObj = {
            type: "DigitFollowNullError",
            message:
              "The '\\0' represents the <NUL> char and cannot be followed by a decimal digit!"
          };
          break;
        case "charsetRangeEndClass":
          errorObj = {
            type: "CharsetRangeEndClass",
            message:
              'Charset range ends with class such as "\\w\\W\\d\\D\\s\\S" is invalid!'
          };
          break;
        case "charsetOctEscape":
          errorObj = {
            type: "DecimalEscape",
            message:
              "Decimal escape appears in charset is invalid.Because it can't be explained as  backreference.And octal escape is deprecated!"
          };
          break;
        default:
          0 === error_lastState.indexOf("charset")
            ? (errorObj = {
              type: "UnclosedCharset",
              message: "Unterminated character class!"
            })
            : ")" === raw_regex_input[processedRegex.lastIndex]
              ? (errorObj = {
                type: "UnmatchedParen",
                message: "Unmatched end parenthesis!"
              })
              : ((errorObj = {
                type: "UnexpectedChar",
                message: "Unexpected char!"
              }),
                processedRegex.lastIndex++);
      }
      if (errorObj) {
        errorObj.lastIndex = processedRegex.lastIndex;
        // x.lastStack = r.stack
        errorObj.lastState = error_lastState;
        errorObj.indices = [processedRegex.lastIndex, processedRegex.lastIndex];

        init_object.RegexSyntaxThrows.push(errorObj);
      }
    }

    processedStack = analizeForErrors(processedStack, raw_regex_input, error_lastState)

    // Check if no errors, but we want to parse and return
    // the regex procesed after, we check the errors
    // if (g) {
    var y = processedStack.groupCounter ? processedStack.groupCounter.i : 0;
    delete processedStack.groupCounter,
      h(processedStack, raw_regex_input, raw_regex_input.length),
      (processedStack = o(processedStack));
    var m = new create_regexObject({
      raw: raw_regex_input,
      groupCount: y,
      tree: processedStack
    });
    return (
      m.traverse(define_error_out_order_charset, CHARSET_NODE, language),
      m.traverse(define_error_assert_non_quantificable, ASSERT_NODE, language),
      c(processedStack),
      (d = !1),
      m
    );
    // }
  }
  function load_NFA_Parser(language = "javascript6") {
    // TODO: Check no existing language
    var selected_language_validStructs = validStructs[language];
    if (cachedNFA.hasOwnProperty(language)) {
      NFAparser = cachedNFA[language];
    }
    else {
      NFAparser = new NFA(selected_language_validStructs);
    }
    return NFAparser;
  }
  function setProperty(t, e, r) {
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
   * @param {*} assertToken
   */
  function define_error_assert_non_quantificable(assertToken, regex_language) {
    // Defino en que idiomas esto es posible
    if (assertToken.repeat && regex_language != "python") {
      var e = assertToken.assertionType,
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
      let errorObj = {
        type: "NothingRepeat",
        lastIndex: assertToken.indices[1] - 1,
        message: r,
        indices: assertToken.indices
      }
      init_object.RegexSyntaxThrows.push(errorObj);
      if (!assertToken.errors) assertToken.errors = [];
      assertToken.push(errorObj);
    }
  }
  function define_error_out_order_charset(charsetToken, regex_language) {
    charsetToken.ranges = auxKit.sortUnique(
      charsetToken.ranges.map(function (rangeChars) {
        if (rangeChars[0] > rangeChars[1]) {
          let errorObj = {
            type: "OutOfOrder",
            lastIndex: rangeChars.lastIndex,
            message: "Range [" + rangeChars.join("-") + "] out of order in character class!",
            indices: charsetToken.indices
          }
          init_object.RegexSyntaxThrows.push(errorObj);
          if (!charsetToken.errors) charsetToken.errors = [];
          charsetToken.errors.push(errorObj)

        }
        return rangeChars.join("");
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
    ASSERT_NODE: "assert",
    BACKREF_NODE: "backref",
    CHARSET_NODE: "charset",
    CHOICE_NODE: "choice",
    DOT_NODE: "dot",
    EMPTY_NODE: "empty",
    EXACT_NODE: "exact",
    GROUP_NODE: "group",
    HEXADECIMAL_NODE: "hexadecimal",
    UNICODE_NODE: "unicode",
    OCTAL_NODE: "octal",
    GROUP_COMMENT: "comment",
    UNEXPECTED_NODE: "unexpected",
    // assert subtypes
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
    function f_exact(lastStack, actualChar, lastIndex) {
      var n = lastStack[0];
      (!n || n.type != EXACT_NODE || n.repeat || (n.chars && !n.concatTemp)) &&
        lastStack.unshift({
          id: Math.random().toString(36).substr(2, 9),
          type: EXACT_NODE,
          indices: [lastIndex]
        }),
        n && n.concatTemp && (n.chars += actualChar);
    }
    function f_dot(lastStack, actualChar, lastIndex) {
      lastStack.unshift({
        id: Math.random().toString(36).substr(2, 9),
        type: DOT_NODE,
        indices: [lastIndex]
      });
    }
    function f_nullChar(lastStack, actualChar, lastIndex) {
      lastStack.unshift({
        id: Math.random().toString(36).substr(2, 9),
        type: EXACT_NODE,
        chars: "\0",
        indices: [lastIndex - 1]
      });
    }
    function f_assertBegin(lastStack, actualChar, lastIndex) {
      lastStack.unshift({
        id: Math.random().toString(36).substr(2, 9),
        type: ASSERT_NODE,
        indices: [lastIndex],
        assertionType: AssertBegin
      });
    }
    function f_assertEnd(lastStack, actualChar, lastIndex, lastState, regexRaw) {
      lastStack.unshift({
        id: Math.random().toString(36).substr(2, 9),
        type: ASSERT_NODE,
        indices: [lastIndex],
        assertionType: AssertEnd
      });
    }
    function f_assertWordBoundary(lastStack, actualChar, lastIndex) {
      lastStack.unshift({
        id: Math.random().toString(36).substr(2, 9),
        type: ASSERT_NODE,
        indices: [lastIndex - 1],
        assertionType: "b" == actualChar ? AssertWordBoundary : AssertNonWordBoundary
      });
    }
    function f_repeatnStart(lastStack, actualChar, lastIndex) {
      lastStack[0].type !== EXACT_NODE &&
        lastStack.unshift({
          id: Math.random().toString(36).substr(2, 9),
          type: EXACT_NODE,
          indices: [lastIndex]
        });
    }
    /**
     *
     * @param {*} lastStack
     * @param {*} actualChar
     * @param {*} lastIndex
     */
    function f_repeatnComma(lastStack, actualChar, lastIndex) {
      setProperty(lastStack[0], "_commaIndex", lastIndex);
    }
    /**
     * Captura las repeticiones dentro de llaves, como {}
     * @summary If the description is long, write your summary here. Otherwise, feel free to remove this.
     * @param {*} lastStack
     * @param {*} actualChar
     * @param {*} lastIndex
     * @param {*} lastState
     * @param {*} regexRaw
     */
    function f_repeatnEnd(lastStack, actualChar, lastIndex, lastState, regexRaw) {
      let maxRepeat;
      let prevToken = lastStack[0];
      let startRepeatIndex = regexRaw.lastIndexOf("{", lastIndex);
      let minRepeat = parseInt(regexRaw.slice(startRepeatIndex + 1, prevToken._commaIndex || lastIndex), 10);
      if (prevToken._commaIndex) {
        if (
          (maxRepeat =
            prevToken._commaIndex + 1 == lastIndex
              ? 1 / 0
              : parseInt(regexRaw.slice(prevToken._commaIndex + 1, lastIndex), 10)) < minRepeat
        ) {
          let errObj = {
            type: "OutOfOrder",
            lastState: lastState,
            lastIndex: lastIndex,
            indices: [startRepeatIndex, lastIndex],
            // lastStack: t,
            message: "Numbers out of order in {} quantifier!"
          }
          init_object.RegexSyntaxThrows.push(errObj);
          if (!prevToken.errors) prevToken.errors = [];
          prevToken.errors.push(errObj);
        }
        delete prevToken._commaIndex;
      } else maxRepeat = minRepeat;
      let repeatRaw = regexRaw.substr(startRepeatIndex, lastIndex - startRepeatIndex + 1);
      prevToken.indices[0] >= startRepeatIndex && lastStack.shift(), f_aux_repeated(lastStack, minRepeat, maxRepeat, startRepeatIndex, repeatRaw, regexRaw);
    }
    function f_repeat0ToInf(lastStack, actualChar, lastIndex, lastState, regexRaw) {
      f_aux_repeated(lastStack, 0, 1 / 0, lastIndex, actualChar, regexRaw);
    }
    function f_repeat0To1(lastStack, actualChar, lastIndex, lastState, regexRaw) {
      f_aux_repeated(lastStack, 0, 1, lastIndex, actualChar, regexRaw);
    }
    function f_repeat1ToInf(lastStack, actualChar, lastIndex, lastState, regexRaw) {
      f_aux_repeated(lastStack, 1, 1 / 0, lastIndex, actualChar, regexRaw);
    }
    function f_aux_repeated(lastStack, minRepeat, maxRepeat, startRepeatIndex, repeatRaw, regexRaw) {
      let prevToken = lastStack[0];
      let middleComment = false;
      if (prevToken.type === GROUP_COMMENT) {
        prevToken = lastStack[1];
        middleComment = true;
      }
      let repeatTimes = {
        min: minRepeat,
        max: maxRepeat,
        nonGreedy: false
      }
      let exactPrevIndex = startRepeatIndex - 1;
      if (
        (prevToken.chars && 1 === prevToken.chars.length && (exactPrevIndex = prevToken.indices[0]),
          prevToken.type === EXACT_NODE)
      ) {
        let commentToken;
        if (middleComment) {
          // Restar la longitud del comentario
          commentToken = lastStack.shift();
          exactPrevIndex = commentToken.indices[0] - 1;
        }
        var exactTokenRepeated = {
          id: Math.random().toString(36).substr(2, 9),
          type: EXACT_NODE,
          repeat: repeatTimes,
          chars: prevToken.chars ? prevToken.chars : regexRaw[exactPrevIndex],
          indices: [exactPrevIndex]
        };
        prevToken.indices[0] === exactPrevIndex && lastStack.shift();
        lastStack.unshift(exactTokenRepeated);
        prevToken = lastStack[0];
        if (middleComment) {
          lastStack.unshift(commentToken);
          exactTokenRepeated.errors = commentToken.errors;
        }

      }
      else prevToken.repeat = repeatTimes;
      setProperty(repeatTimes, "raw", repeatRaw);
      setProperty(repeatTimes, "beginIndex", startRepeatIndex - prevToken.indices[0]);
      setProperty(repeatTimes, "beginAbsIndex", startRepeatIndex);
      if (middleComment) setProperty(prevToken, "commentRepeatId", lastStack[0].id);
    }
    function f_repeatNonGreedy(lastStack) {
      let prevToken = lastStack[0];
      let middleComment = false;
      if (prevToken.type === GROUP_COMMENT) {
        prevToken = lastStack[1];
        middleComment = true;
      }
      prevToken.repeat.nonGreedy = true;
      prevToken.repeat.raw = `${prevToken.repeat.raw}?`;
    }
    function f_escapeStart(lastStack, actualChar, lastIndex) {
      lastStack.unshift({
        concatTemp: !0,
        id: Math.random().toString(36).substr(2, 9),
        type: EXACT_NODE,
        chars: "",
        indices: [lastIndex]
      });
    }
    function f_normalEscape(lastStack, actualChar, lastIndex) {
      specialChars.hasOwnProperty(actualChar) && (actualChar = specialChars[actualChar]),
        lastStack.unshift({
          id: Math.random().toString(36).substr(2, 9),
          type: EXACT_NODE,
          chars: actualChar,
          indices: [lastIndex - 1]
        });
    }
    function f_charClassEscape(lastStack, actualChar, lastIndex) {
      lastStack.unshift({
        id: Math.random().toString(36).substr(2, 9),
        type: CHARSET_NODE,
        indices: [lastIndex - 1],
        chars: "",
        ranges: [],
        classes: [actualChar],
        exclude: !1
      });
    }
    function f_hexEscape(lastStack, actualChar, lastIndex, lastState, regexRaw) {
      (actualChar = String.fromCharCode(parseInt(regexRaw[lastIndex - 1] + actualChar, 16))),
        lastStack.shift(),
        lastStack.unshift({
          id: Math.random().toString(36).substr(2, 9),
          type: HEXADECIMAL_NODE,
          chars: actualChar,
          indices: [lastIndex - 3]
        });
    }
    function f_unicodeEscape(lastStack, actualChar, lastIndex, lastState, regexRaw) {
      (actualChar = String.fromCharCode(parseInt(regexRaw.slice(lastIndex - 3, lastIndex + 1), 16))),
        lastStack.shift(),
        lastStack.unshift({
          id: Math.random().toString(36).substr(2, 9),
          type: UNICODE_NODE,
          chars: actualChar,
          indices: [lastIndex - 5]
        });
    }
    function f_groupStart(lastStack, actualChar, lastIndex) {
      var n = (lastStack.groupCounter = lastStack.groupCounter || {
        i: 0
      });
      n.i++;
      var i = {
        id: Math.random().toString(36).substr(2, 9),
        type: GROUP_NODE,
        name: "",
        num: n.i,
        sub: [],
        indices: [lastIndex],
        _parentStack: lastStack
      };
      return (lastStack = i.sub), setProperty(lastStack, "_parentGroup", i), (lastStack.groupCounter = n), lastStack;
    }
    function f_groupNonCapture(lastStack) {
      var parentGroup = lastStack._parentGroup;
      (parentGroup.nonCapture = !0), (parentGroup.num = void 0), lastStack.groupCounter.i--;
    }
    function f_groupNamedContent(lastStack, actualChar) {
      var n = lastStack._parentGroup;
      n.name += actualChar;
    }
    function f_groupNamedBadName(lastStack, actualChar, lastIndex, lastState, regexRaw, callback) {
      let objectError = {
        type: "GroupBadName",
        lastIndex: lastIndex,
        // lastStack: lastStack,
        lastState: lastState,
        message: `The group name cannot has the char "${actualChar}"`,
        indices: [lastIndex, lastIndex]
      }
      init_object.RegexSyntaxThrows.push(objectError);
      var parentGroup = lastStack._parentGroup;
      parentGroup.name += actualChar;

      if (!parentGroup.errors) parentGroup.errors = [];
      parentGroup.errors.push(objectError);

    }
    function f_groupComment(lastStack) {
      var parentGroup = lastStack._parentGroup;
      parentGroup.num = void 0;
      lastStack.groupCounter.i--;
      parentGroup.type = GROUP_COMMENT;
      parentGroup.comment = "";
      delete parentGroup.sub;
    }
    function f_groupCommentContent(lastStack, actualChar, lastIndex) {
      var parentGroup = lastStack._parentGroup;
      parentGroup.comment += actualChar;
    }
    function f_groupCommentEnd(lastStack, actualChar, lastIndex, lastState, regexRaw, callback) {
      var parentGroup = lastStack._parentGroup;
      return (
        delete lastStack._parentGroup,
        delete lastStack.groupCounter,
        (lastStack = parentGroup._parentStack),
        delete parentGroup._parentStack,
        lastStack.unshift(parentGroup),
        (parentGroup.endParenIndex = lastIndex),
        lastStack
      );
    }
    function f_groupToAssertion(lastStack, actualChar, lastIndex) {
      var n = lastStack._parentGroup;
      (n.type = ASSERT_NODE),
        (n.assertionType =
          "=" == actualChar ? AssertLookahead : AssertNegativeLookahead),
        (n.num = void 0),
        lastStack.groupCounter.i--;
    }
    function f_groupEnd(lastStack, actualChar, lastIndex, lastState, regexRaw) {
      lastStack = f_endChoice(lastStack);
      var parentGroup = lastStack._parentGroup;
      if (!parentGroup) {
        let errObj = {
          type: "UnexpectedChar",
          lastIndex: lastIndex,
          lastState: lastState,
          // lastStack: t,
          message: "Unexpected end parenthesis!",
          indices: [lastIndex, lastIndex]
        }
        init_object.RegexSyntaxThrows.push(errObj);
        if (!lastStack[0].errors) lastStack[0].errors = [];
        lastStack[0].errors.push(errObj);
        return lastStack;
      }

      return (
        delete lastStack._parentGroup,
        delete lastStack.groupCounter,
        (lastStack = parentGroup._parentStack),
        delete parentGroup._parentStack,
        lastStack.unshift(parentGroup),
        (parentGroup.endParenIndex = lastIndex),
        lastStack
      );
    }
    function f_choice(lastStack, actualChar, lastIndex) {
      var n,
        i = [];
      if (lastStack._parentChoice)
        (n = lastStack._parentChoice),
          n.branches.unshift(i),
          setProperty(i, "_parentChoice", n),
          setProperty(i, "_parentGroup", n),
          (i.groupCounter = lastStack.groupCounter),
          delete lastStack._parentChoice,
          delete lastStack.groupCounter;
      else {
        var a = lastStack[lastStack.length - 1];
        (n = {
          id: Math.random().toString(36).substr(2, 9),
          type: CHOICE_NODE,
          indices: [a ? a.indices[0] : lastIndex - 1],
          branches: []
        }),
          setProperty(n, "_parentStack", lastStack),
          n.branches.unshift(lastStack.slice()),
          (lastStack.length = 0),
          lastStack.unshift(n),
          (i.groupCounter = lastStack.groupCounter),
          setProperty(i, "_parentChoice", n),
          setProperty(i, "_parentGroup", n),
          n.branches.unshift(i);
      }
      return i;
    }
    function f_endChoice(lastStack) {
      if (lastStack._parentChoice) {
        var e = lastStack._parentChoice;
        delete lastStack._parentChoice, delete lastStack._parentGroup, delete lastStack.groupCounter;
        var r = e._parentStack;
        return delete e._parentStack, r;
      }
      return lastStack;
    }
    function f_charsetStart(lastStack, actualChar, lastIndex) {
      lastStack.unshift({
        id: Math.random().toString(36).substr(2, 9),
        type: CHARSET_NODE,
        indices: [lastIndex],
        classes: [],
        ranges: [],
        tokens: [],
        chars: ""
      });
    }
    function f_charsetExclude(lastStack) {
      lastStack[0].exclude = !0;
    }
    function f_charsetContent(lastStack, actualChar, lastIndex) {
      lastStack[0].chars += actualChar;
      lastStack[0].tokens.push({
        type: "char",
        indices: [lastIndex, lastIndex + 1],
        raw: actualChar
      });
    }
    function f_charsetNormalEscape(lastStack, actualChar, lastIndex) {
      lastStack[0].tokens.push({
        type: "escape",
        indices: [lastIndex - 1, lastIndex + 1],
        raw: `\\${actualChar}`
      });
      specialChars.hasOwnProperty(actualChar) && (actualChar = specialChars[actualChar]), (lastStack[0].chars += actualChar);
    }
    function f_charsetNullChar(lastStack, actualChar, lastIndex) {
      lastStack[0].chars += "\0";
      lastStack[0].tokens.push({
        type: "escape",
        indices: [lastIndex - 1, lastIndex + 1],
        raw: "\\0"
      });
    }
    function f_charsetClassEscape(lastStack, actualChar, lastIndex) {
      lastStack[0].classes.push(actualChar);
      lastStack[0].tokens.push({
        type: "shorthand",
        indices: [lastIndex - 1, lastIndex + 1],
        raw: `\\${actualChar}`
      });
    }
    function f_charsetHexEscape(lastStack, actualChar, lastIndex, lastState, regexRaw) {
      var actualToken = lastStack[0];
      let hexChar = actualToken.chars.slice(-1) + actualChar;
      let actualCharEscaped = String.fromCharCode(parseInt(hexChar, 16));
      actualToken.chars = actualToken.chars.slice(0, -2);
      actualToken.chars += actualCharEscaped;

      actualToken.tokens = actualToken.tokens.slice(2);
      actualToken.tokens.push({
        type: "char-hexadecimal",
        escaped: actualCharEscaped,
        indices: [lastIndex - 3, lastIndex + 1],
        raw: `\\x${hexChar}`
      });
    }
    function f_charsetUnicodeEscape(lastStack, actualChar, lastIndex, lastState, regexRaw) {
      var actualToken = lastStack[0];
      let unicodeChar = actualToken.chars.slice(-3) + actualChar;
      let actualCharEscaped = String.fromCharCode(parseInt(unicodeChar, 16));
      actualToken.chars = actualToken.chars.slice(0, -4);
      actualToken.chars += actualCharEscaped;

      actualToken.tokens = actualToken.tokens.slice(4);
      actualToken.tokens.push({
        type: "char-unicode",
        escaped: actualCharEscaped,
        indices: [lastIndex - 5, lastIndex + 1],
        raw: `\\u${unicodeChar}`
      });
    }
    function f_charsetRangeEnd(lastStack, actualChar, lastIndex, lastState, regexRaw, lastEscaped = false) {
      let actualToken = lastStack[0];
      let charRangeStart = actualToken.chars.slice(-2);
      charRangeStart = [charRangeStart[0], actualChar],
        charRangeStart.lastIndex = lastIndex;
      actualToken.ranges.push(charRangeStart);
      actualToken.chars = actualToken.chars.slice(0, -2);

      let startToken = actualToken.tokens.slice(-2)[0];
      let endToken = {
        type: "char",
        indices: [lastEscaped ? lastIndex - 1 : lastIndex, lastIndex + 1],
        raw: lastEscaped ? escapeSpecialChars(actualChar) : actualChar
      }
      actualToken.tokens = actualToken.tokens.slice(0, -2);
      actualToken.tokens.push({
        type: "range",
        range: [startToken, endToken],
        indices: [startToken.indices[0], lastIndex + 1],
        raw: `${startToken.raw}-${endToken.raw}`
      });
    }
    function f_charsetRangeEndNormalEscape(lastStack, actualChar, lastIndex, lastState, regexRaw) {
      if (specialChars.hasOwnProperty(actualChar)) {
        let prevChar = actualChar;
        actualChar = specialChars[actualChar];
        return f_charsetRangeEnd(lastStack, actualChar, lastIndex, lastState, regexRaw, lastEscaped = true);
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
        indices: [lastIndex - 5, lastIndex + 1],
        raw: `\\u${charsRangeEnd}`
      }
      actualToken.tokens = actualToken.tokens.slice(0, -4);
      actualToken.tokens.push({
        type: "range",
        range: [startToken, endToken],
        indices: [rangeToken.indices[0], lastIndex + 1],
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
        indices: [lastIndex - 3, lastIndex + 1],
        raw: `\\x${charsRangeEnd}`
      }
      actualToken.tokens = actualToken.tokens.slice(0, -2);
      actualToken.tokens.push({
        type: "range",
        range: [startToken, endToken],
        indices: [rangeToken.indices[0], lastIndex + 1],
        raw: `${startToken.raw}-${endToken.raw}`
      });
    }
    function f_backref(lastStack, actualChar, lastIndex, lastState) {
      function i(t, e) {
        return (
          !!e._parentGroup &&
          (e._parentGroup.num == t ? t : i(t, e._parentGroup._parentStack))
        );
      }
      var prevToken = lastStack[0],
        s = parseInt(actualChar, 10),
        o = "escape" === lastState,
        c = lastStack.groupCounter,
        h = (c && c.i) || 0;
      if (
        (o
          ? ((prevToken = {
            id: Math.random().toString(36).substr(2, 9),
            type: BACKREF_NODE,
            indices: [lastIndex - 1]
          }),
            lastStack.unshift(prevToken))
          : (s = parseInt(prevToken.num + "" + s, 10)),
          s > h)
      ) {
        let errObj = {
          type: "InvalidBackReference",
          lastIndex: lastIndex,
          // lastStack: lastStack,
          lastState: lastState,
          message:
            "Back reference number(" +
            s +
            ") greater than current groups count(" +
            h +
            ").",
          indices: [lastIndex - 1, lastIndex]
        }
        init_object.RegexSyntaxThrows.push(errObj);
        if (!prevToken.errors) prevToken.errors = [];
        prevToken.errors.push(errObj);
      }
      if (i(s, lastStack)) {
        let errObj = {
          type: "InvalidBackReference",
          lastIndex: lastIndex,
          // lastStack: lastStack,
          lastState: lastState,
          message: "Recursive back reference in group (" + s + ") itself.",
          indices: [lastIndex, lastIndex]
        }
        init_object.RegexSyntaxThrows.push(errObj);
        if (!prevToken.errors) prevToken.errors = [];
        prevToken.errors.push(errObj);
      }
      prevToken.num = s;
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
      if (names_hexEscape.split(",").indexOf(lastState) !== -1) {
        return f_tokenIncompleteHex(
          lastStack, actualChar, lastIndex, lastState, regexRaw, callbackToken
        );
      }
      if (names_unicodeEscape.split(",").indexOf(lastState) !== -1) {
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
        let errObj = {
          type: "TokenIncomplete",
          lastIndex: lastIndexIncomplete,
          // lastStack: lastStack,
          lastState: lastState,
          message: `The ${tokenClass} escaped char is incomplete!`,
          indices: [lastIndexIncomplete, lastIndex]
        }
        init_object.RegexSyntaxThrows.push(errObj);
        if (!lastStack[0].errors) lastStack[0].errors = [];
        lastStack[0].errors.push(errObj);

        // We need to add to the `chars` field the chars non escape chars, and left the \xAA not added
        let badCharsCaptured = lastStack[0].chars.slice(lastStack[0].chars.length - numberIncomplete,).slice(1,);
        if (badCharsCaptured) {
          lastStack[0].chars = lastStack[0].chars.slice(0, -numberIncomplete);
        }
        lastStack[0].chars += badCharsCaptured;

        // Capture the wrong token at -2 positions
        let wrongToken = lastStack[0].tokens[lastStack[0].tokens.length - 1 - (numberIncomplete - 1)]
        // Modify type to hexadecimal/unicode escaped and wrong
        wrongToken.type = `char-${tokenClass}`;
        wrongToken.indices = [wrongToken.indices[0] - 1, wrongToken.indices[1]];
        wrongToken.raw = `\\${wrongToken.raw}`;
      };
      const _charsetEndRangeIncompleteEscaped = (tokenEscaped, tokenClass) => {
        let actualToken = lastStack[0];
        let lastIndexIncomplete = regexRaw.slice(0, lastIndex).lastIndexOf(`\\${tokenEscaped}`) + 1;
        let numberIncomplete = lastIndex - lastIndexIncomplete;

        // We need to add to the `chars` field the chars non escape chars, and left the \u not added but XXX added
        let badCharsCaptured = actualToken.chars.slice(actualToken.chars.length - numberIncomplete,).slice(1,);
        if (badCharsCaptured !== "") {
          // Use the length of badCharsCaptured because the \u is added to the range end
          actualToken.chars = actualToken.chars.slice(0, -badCharsCaptured.length);
        }


        let charsRangeStart = actualToken.ranges.pop();
        // Add the chars Raged start to list chars because no longer is a valid range
        actualToken.chars += charsRangeStart[0];
        // After add the bad captured chars of \uXXX , XXX because arent a valid escaped char
        actualToken.chars += badCharsCaptured;

        // Now add the errors, first a bad range
        let errObj1 = {
          type: "InvalidRange",
          // -2 because the lastIndexIncomplete is for the letter u, and this error is for the `-` range
          lastIndex: lastIndexIncomplete - 2,
          // lastStack: lastStack,
          lastState: lastState,
          message: `The right ${tokenClass} escaped token is invalid!`,
          indices: [lastIndexIncomplete, lastIndexIncomplete - 2]
        }
        // Then the token incomplete error
        let errObj2 = {
          type: "TokenIncomplete",
          lastIndex: lastIndexIncomplete,
          // lastStack: lastStack,
          lastState: lastState,
          message: `The ${tokenClass} escaped char is incomplete!`,
          indices: [lastIndexIncomplete, lastIndexIncomplete]
        }
        init_object.RegexSyntaxThrows.push(errObj1);
        init_object.RegexSyntaxThrows.push(errObj2);
        if (!lastStack[0].errors) lastStack[0].errors = [];
        lastStack[0].errors.push(errObj1);
        lastStack[0].errors.push(errObj2);

        // Charset Tokens
        // Capture the wrong token at -2 positions
        let wrongToken = lastStack[0].tokens[lastStack[0].tokens.length - 1 - (numberIncomplete - 1)]
        // Modify type to hexadecimal/unicode escaped and wrong
        wrongToken.range[1].type = `char-${tokenClass}`;
        wrongToken.range[1].indices = [wrongToken.range[1].indices[0] - 1, wrongToken.range[1].indices[1]];
        wrongToken.range[1].raw = `\\${tokenEscaped}`;
        wrongToken.raw = `${wrongToken.range[0].raw}-${wrongToken.range[1].raw}`;
      };

      // Charset Hexadecimal
      if (["charsetHexEscape1", "charsetHexEscape2"].indexOf(lastState) !== -1) {
        _charsetIncompleteEscaped("x", "hexadecimal");
      }
      // Charset Unicode
      if (["charsetUnicodeEscape1", "charsetUnicodeEscape2", "charsetUnicodeEscape3", "charsetUnicodeEscape4"].indexOf(lastState) !== -1) {
        _charsetIncompleteEscaped("u", "unicode");
      }

      if (["charsetRangeEndUnicodeEscape1", "charsetRangeEndUnicodeEscape2", "charsetRangeEndUnicodeEscape3", "charsetRangeEndUnicodeEscape4"].indexOf(lastState) !== -1) {
        _charsetEndRangeIncompleteEscaped("u", "unicode");
      }
      if (["charsetRangeEndHexEscape1", "charsetRangeEndHexEscape2"].indexOf(lastState) !== -1) {
        _charsetEndRangeIncompleteEscaped("x", "hexadecimal");
      }

      if (callbackToken) {
        return callbackToken(lastStack, actualChar, lastIndex, lastState, regexRaw);
      }
    }

    // Incomplete escaped characters
    function f_tokenIncompleteHex(lastStack, actualChar, lastIndex, lastState, regexRaw, callback) {
      let lastIndexIncomplete = regexRaw.slice(0, lastIndex).lastIndexOf("\\x") + 1;

      let errObj = {
        type: "TokenIncomplete",
        lastIndex: lastIndexIncomplete,
        // lastStack: lastStack,
        lastState: lastState,
        message: "The hexadecimal escaped char is incomplete!",
        indices: [lastIndex, lastIndex]
      }
      init_object.RegexSyntaxThrows.push(errObj);
      // lastStack.shift();
      // Add the wrong escaped hex
      lastStack.unshift({
        id: Math.random().toString(36).substr(2, 9),
        type: HEXADECIMAL_NODE,
        chars: regexRaw.slice(lastIndexIncomplete + 1, lastIndex),
        indices: [lastIndexIncomplete - 1],
        errors: [errObj]
      });
      // Add the other tokens
      // if (regexRaw.slice(lastIndexIncomplete + 1, lastIndex) !== "") {
      //   lastStack.unshift({
      //     id: Math.random().toString(36).substr(2, 9),
      //     type: EXACT_NODE,
      //     chars: regexRaw.slice(lastIndexIncomplete + 1, lastIndex),
      //     indices: [lastIndexIncomplete + 1]
      //   });
      // }

      return callback(lastStack, actualChar, lastIndex, lastState, regexRaw);
    }
    function f_tokenIncompleteUnicode(lastStack, actualChar, lastIndex, lastState, regexRaw, callback) {
      let lastIndexIncomplete = regexRaw.slice(0, lastIndex).lastIndexOf("\\u") + 1;
      let errObj = {
        type: "TokenIncomplete",
        lastIndex: lastIndexIncomplete,
        // lastStack: lastStack,
        lastState: lastState,
        message: "The unicode escaped char is incomplete!",
        lastIndex: [lastIndexIncomplete, lastIndex]
      }
      init_object.RegexSyntaxThrows.push(errObj);
      // lastStack.shift();
      // Add the wrong escaped hex
      lastStack.unshift({
        id: Math.random().toString(36).substr(2, 9),
        type: UNICODE_NODE,
        chars: regexRaw.slice(lastIndexIncomplete + 1, lastIndex),
        indices: [lastIndexIncomplete - 1],
        errors: [errObj]
      });
      // Add the other tokens only can be exact, because the others are added in the callback function
      // if (regexRaw.slice(lastIndexIncomplete + 1, lastIndex) !== "") {
      //   lastStack.unshift({
      //     id: Math.random().toString(36).substr(2, 9),
      //     type: EXACT_NODE,
      //     chars: regexRaw.slice(lastIndexIncomplete + 1, lastIndex),
      //     indices: [lastIndexIncomplete + 1]
      //   });
      // }

      return callback(lastStack, actualChar, lastIndex, lastState, regexRaw);
    }

    function f_tokenIncompleteCharsetHex(lastStack, actualChar, lastIndex, lastState, regexRaw, callback) {
      init_object.RegexSyntaxThrows.push({
        type: "TokenIncomplete",
        lastIndex: lastIndexIncomplete,
        // lastStack: lastStack,
        lastState: lastState,
        message: "The hexadecimal escaped char is incomplete!",
        indices: [lastIndex, lastIndex]
      });

      var actualToken = lastStack[0];
      actualChar = String.fromCharCode(parseInt(actualToken.chars.slice(-1) + actualChar, 16));
      actualToken.chars = actualToken.chars.slice(0, -2);
      actualToken.chars += actualChar;
    }
    function f_tokenIncompleteCharsetUnicode(lastStack, actualChar, lastIndex, lastState, regexRaw, callback) {
      let errObj = {
        type: "TokenIncomplete",
        lastIndex: lastIndexIncomplete,
        // lastStack: lastStack,
        lastState: lastState,
        message: "The unicode escaped char is incomplete!",
        indices: [lastIndex, lastIndex]
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
        message: `Unexpected character ${actualChar}!`,
        indices: [lastIndex, lastIndex]
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
      groupComment: f_groupComment,
      groupCommentContent: f_groupCommentContent,
      groupCommentEnd: f_groupCommentEnd,
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
      ["repeat0,repeat1,repeat01,repeatn>repeatNonGreedy", "?", elementsCallback.repeatNonGreedy],
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
        "charsetNullChar,charsetContent>charsetRangeStart", "-", elementsCallback.charsetContent
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
      "groupQualify": "groupQualifiedStart"
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
      "groupQualify": "groupQualifiedStart"
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
      ["groupNamedBadName,groupNamedContent>groupQualifiedStart", ">"],
      // Group comment
      ["groupQualify>groupCommentContent", "#", elementsCallback.groupComment],
      [
        "groupCommentContent>groupCommentEscape",
        "\\"
      ],
      [
        "groupCommentEscape>groupCommentContent",
        ")",
        elementsCallback.groupCommentContent
      ],
      [
        "groupCommentEscape>groupCommentContent",
        "^)",
        elementsCallback.groupCommentContent
      ],
      [
        "groupCommentContent>groupCommentContent",
        "^)",
        elementsCallback.groupCommentContent
      ],
      [
        "groupCommentContent>exact",
        ")",
        elementsCallback.groupCommentEnd
      ]
    ]),
    unexpectedToken: elementsCallback.unexpectedChar,
    unexpectedRouter: {
      "groupQualify": "groupQualifiedStart"
    }
  };
  var validStructs = {
    javascript6: javascript_validStructs,
    python: python_validStructs
  };

  return {
    parse: init_object,
  };
}
// ),

// module.exports = {parse};
