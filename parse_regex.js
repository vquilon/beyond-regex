window.onload = function() {
  var paper = new Raphael('graphCt', 10, 10);
  var input = document.getElementById('input');
  var inputCt = document.getElementById('inputCt');
  // var visualBtn = document.getElementById('visualIt');
  var parseBtn = document.getElementById('parseClick');
  var visualBtn = document.getElementById('visualizeClick');
  var embedBtn = document.getElementById('embedIt');
  var exportBtn = document.getElementById('exportIt');
  var errorBox = document.getElementById('errorBox');
  var flags = document.getElementsByName('flag');
  var flagBox = document.getElementById('flagBox');

  // if (define("Kit", [], function() {
  function Kit() {
    function t(e, a) {
      return e._Set ? e : (a || (e = n(e)),
                           e.contains = function(t, n) {
        return !!~r(e, t, n)
      }
                           ,
                           e.indexOf = function(t, n) {
        return r(e, t, n)
      }
                           ,
                           e.toArray = function() {
        return i(e)
      }
                           ,
                           e.union = function(r) {
        r = t(r);
        for (var n = e.length + r.length, a = new e.constructor(n), s = 0, o = 0, c = 0; c < n; c++)
          e[s] === r[o] ? (a[c] = e[s++],
                           o++,
                           n--) : e[s] < r[o] ? a[c] = e[s++] : a[c] = r[o++];
        return a.length = n,
          t(a.length === n ? a : i(a, n), !0)
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
      } while (s <= c);return -1
    }
    function n(t) {
      var e = t.length;
      if (e <= 1)
        return t;
      for (var r, n, a, s = 1, o = e / 3 | 0; s < o; )
        s = 3 * s + 1;
      for (; s > 0; ) {
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
      for (var r = new t.constructor(e), n = e; n--; )
        r[n] = t[n];
      return r
    }
    function a(t) {
      for (var e, r = {}, n = 0, i = 0, a = t.length; n < a; n++)
        e = t[n],
          r.hasOwnProperty(e) || (r[e] = 1,
                                  t[i++] = e);
      return t.length = i,
        t
    }
    function s(t) {
      var e, r, n, i = t.length, a = (1e10 * Math.random()).toString(32) + (+new Date).toString(32);
      for (e = r = 0; e < i; e++)
        null != (n = t[e]) && (n.hasOwnProperty(a) || (Object.defineProperty(n, a, {
          value: 1,
          enumerable: !1
        }),
                                                       t[r++] = n));
      for (e = r; e--; )
        t[e][a] = void 0;
      return t.length = r,
        t
    }
    function o(t) {
      t = t.map(function(t) {
        return t[1] ? t : t + t
      });
      var e, r, i, a, s, o;
      t = n(t),
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
      var g = n(t.join("").split(""))
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
            f[c] && (c = d(c)),
            l[h] && (h = p(h)),
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
      x = n(x);
      for (i in y)
        m[i[0] === i[1] ? i[0] : i] = y[i];
      return {
        ranges: x,
        map: m
      }
    }
    function c(t) {
      var e = String.fromCharCode(65535);
      t = o(t).ranges;
      var r = [];
      if (!t.length)
        return r;
      "\0" !== t[0][0] && t.unshift(e);
      var n = t.length - 1;
      return (t[n][1] || t[n][0]) !== e && t.push("\0"),
        t.reduce(function(t, e) {
        var n = d(t[1] || t[0])
        , i = p(e[0]);
        return n < i && r.push(n + i),
          n === i && r.push(n),
          e
      }),
        r
    }
    function h(t) {
      t = t.split("");
      var e = []
      , r = []
      , n = "^" === t[0] && t.length > 1 && t.shift();
      return t.forEach(function(t) {
        if ("-" == e[0] && e.length > 1) {
          if (e[1] > t)
            throw new Error("Charset range out of order:" + e[1] + "-" + t + "!");
          r.push(e[1] + t),
            e.splice(0, 2)
        } else
          e.unshift(t)
      }),
        r = r.concat(e),
        n ? c(r) : o(r).ranges
    }
    function u(t) {
      if (!t.length)
        return [];
      var e = [t[0]];
      return t.reduce(function(t, r) {
        var n = e.length - 1;
        return t[t.length - 1] === p(r[0]) ? e[n] = e[n][0] + r[r.length - 1] : (e.push(r),
                                                                                 r)
      }),
        e.reduce(function(t, e) {
        return 2 === e.length && e[0] === p(e[1]) ? (t.push(e[0]),
                                                     t.push(e[1])) : t.push(e),
          t
      }, [])
    }
    function l(t) {
      return String.fromCharCode(t)
    }
    function f(t) {
      return t.charCodeAt(0)
    }
    function p(t) {
      return String.fromCharCode(t.charCodeAt(0) - 1)
    }
    function d(t) {
      return String.fromCharCode(t.charCodeAt(0) + 1)
    }
    function g(t, e) {
      var r = /[\x00-\x1F\x7F-\x9F]/
      , n = /[\u009F-\uFFFF]/;
      return t = t.split("").map(function(t) {
        return !e && S.hasOwnProperty(t) ? S[t] : n.test(t) ? "\\u" + ("00" + f(t).toString(16).toUpperCase()).slice(-4) : r.test(t) ? "\\x" + ("0" + f(t).toString(16).toUpperCase()).slice(-2) : t
      }).join("")
    }
    function x(t) {
      return [].concat.apply([], t)
    }
    function v(t, e) {
      return new Array(e + 1).join(t)
    }
    function y() {
      var t = _.call(arguments);
      if (w)
        Function.prototype.apply.apply(console.log, [console, t]);
      else {
        var e = require("util");
        t.forEach(function(t) {
          console.log(e.inspect(t, {
            showHidden: !1,
            customInspect: !0,
            depth: 64,
            colors: !0
          }))
        })
      }
    }
    function m(t) {
      for (var e, r = t.toString(), n = /^\s+function\s+([a-zA-Z]\w+)\s*\(/gm, i = []; e = n.exec(r); )
        i.push(e[1]);
      for (var t, a = []; t = i.pop(); )
        a.push(t + ":" + t);
      return "{\n" + a.join(",\n") + "\n}"
    }
    var b = Array.prototype
    , _ = b.slice
    , w = function() {
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
      sortUnique: n,
      idUnique: s,
      hashUnique: a,
      Set: t,
      repeats: v,
      negate: c,
      coalesce: u,
      classify: o,
      parseCharset: h,
      chr: l,
      ord: f,
      pred: p,
      succ: d,
      toPrint: g,
      flatten2: x,
      log: y,
      isBrowser: w,
      locals: m
    }
  }
  // ),

  // if (define("NFA", ["./Kit"], function(t) {
  // function NFA() {
  //   var t = Kit();
  //   function e(e) {
  //     e = e.compact ? c(e) : e;
  //     var s, o = {}, h = e.trans, u = {};
  //     for (s = 0,
  //          n = e.accepts.length; s < n; s++)
  //       o[e.accepts[s]] = !0;
  //     var l;
  //     for (s = 0,
  //          n = h.length; s < n; s++)
  //       l = h[s],
  //         l.charset ? l.ranges = "string" == typeof l.charset ? t.parseCharset(l.charset) : l.charset : l.eMove = !0,
  //         l.from.forEach(function(t) {
  //         var e = u[t] = u[t] || {
  //           eMoveStates: [],
  //           eMove: [],
  //           charMove: {},
  //           trans: [],
  //           ranges: []
  //         };
  //         l.eMove ? e.eMoveStates = e.eMoveStates.concat(l.to) : e.ranges = e.ranges.concat(l.ranges),
  //           e.trans.push(l)
  //       });
  //     return Object.keys(u).forEach(function(e) {
  //       var r = u[e]
  //       , n = r.trans
  //       , i = r.charMove
  //       , a = r.eMove
  //       , s = r.ranges
  //       , o = t.classify(s)
  //       , c = o.map;
  //       n.forEach(function(e) {
  //         e.eMove ? e.to.forEach(function(t) {
  //           a.push({
  //             to: t,
  //             action: e.action,
  //             assert: e.assert,
  //             eMove: !0
  //           })
  //         }) : t.flatten2(e.ranges.map(function(t) {
  //           return c[t]
  //         })).forEach(function(t) {
  //           (i[t] = i[t] || []).push(e)
  //         })
  //       }),
  //         s = t.Set(o.ranges.filter(function(t) {
  //         return !!t[1]
  //       })),
  //         r.ranges = s,
  //         Object.keys(i).forEach(function(t) {
  //         var e = i[t]
  //         , r = [];
  //         n.forEach(function(t) {
  //           t.to.forEach(function(n) {
  //             (t.eMove || ~e.indexOf(t)) && r.push({
  //               to: n,
  //               action: t.action,
  //               assert: t.assert,
  //               eMove: t.eMove
  //             })
  //           })
  //         }),
  //           i[t] = r
  //       }),
  //         delete r.trans,
  //         delete r.eMoveStates
  //     }),
  //       {
  //       accepts: o,
  //       router: u,
  //       input: a,
  //       assertDFA: i,
  //       accept: r
  //     }
  //   }
  //   function r(t) {
  //     return this.accepts.hasOwnProperty(t)
  //   }
  //   function i() {
  //     for (var e, r = this.router, n = Object.keys(r), i = 0, a = n.length; i < a; i++) {
  //       if (e = r[n[i]],
  //           e.eMove.length > 1)
  //         throw new Error("DFA Assertion Fail!\nFrom state `" + n[i] + "` can goto to multi ε-move states!");
  //       for (var s = e.charMove, o = Object.keys(s), c = 0, h = o.length; c < h; c++) {
  //         if (1 !== s[o[c]].length)
  //           throw t.log(s),
  //             new Error("DFA Assertion Fail!\nFrom state `" + n[i] + "` via charset `" + o[c] + "` can goto to multi states!")
  //       }
  //       if (o.length && e.eMove.length)
  //         throw new Error("DFA Assertion Fail!\nFrom state `" + n[i] + "` can goto extra ε-move state!")
  //     }
  //     return !0
  //   }
  //   function a(e, r, n) {
  //     function i(e, r, o, c, h) {
  //       t: for (; ; ) {
  //         var u, l, f, p, d = a.router[o];
  //         if (!d)
  //           break;
  //         var g, x = d.eMove, v = d.charMove;
  //         r < e.length ? (u = e[r], g = v.hasOwnProperty(u) ? v[u] : (l = s(d.ranges, u)) ? v[l] : x) : g = x;
  //         for (var y, m, b, _ = c.length, w = h, E = 0, C = g.length; E < C; E++) {
  //           if (y = g[E], f = y.eMove ? 0 : 1, h = w, c.splice(0, c.length - _), _ = c.length, y.assert) {
  //             if (!1 === (m = y.assert(c, u, r, o, e)))
  //               continue;
  //             "number" == typeof m && (r += m, h += m)
  //           }
  //           if (y.action && (c = y.action(c, u, r, o, e) || c),
  //               h = y.eMove ? h : r,
  //               n && t.log(u + ":" + o + ">" + y.to),
  //               E === C - 1) {
  //             r += f,
  //               o = y.to;
  //             continue t
  //           }
  //           if (b = i(e, r + f, y.to, c, h), b.acceptable)
  //             return b;
  //           p = b
  //         }
  //         if (p)
  //           return p;
  //         break
  //       }
  //       return {
  //         stack: c,
  //         lastIndex: h,
  //         lastState: o,
  //         acceptable: a.accept(o)
  //       }
  //     }
  //     r = r || 0;
  //     var a = this;
  //     return i(e, r, "start", [], r - 1)
  //   }
  //   function s(t, e) {
  //     var r = t.indexOf(e, o);
  //     return !!~r && t[r]
  //   }
  //   function o(t, e) {
  //     var r = e[0];
  //     return t > e[1] ? 1 : t < r ? -1 : 0
  //   }
  //   function c(t) {
  //     t.accepts = t.accepts.split(",");
  //     for (var e, r, n, i, a = t.trans, s = a.length; s--; )
  //       e = a[s],
  //         r = e[0].split(">"),
  //         n = r[0].split(","),
  //         i = r[1].split(","),
  //         a[s] = {
  //         from: n,
  //         to: i,
  //         charset: e[1],
  //         action: e[2],
  //         assert: e[3]
  //       };
  //     return t.compact = !1,
  //       t
  //   }
  //   return e;
  // }
  
  class NFA {
    constructor(e) {
      // Inicializacion de funciones auxiliares
      var _auxKit = Kit();

      e = e.compact ? this._expandNames(e) : e;
      var s, o = {}, h = e.trans, _router={}
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
      function i(e, r, o, c, h) {
        t: for (; ;) {
          var u, l, f, p, d = a.router[o];
          if (!d)
            break;
          var g, x = d.eMove, v = d.charMove;
          r < e.length ? (u = e[r], g = v.hasOwnProperty(u) ? v[u] : (l = a._escapeChar(d.ranges, u)) ? v[l] : x) : g = x;
          for (var y, m, b, _ = c.length, w = h, E = 0, C = g.length; E < C; E++) {
            if (y = g[E], f = y.eMove ? 0 : 1, h = w, c.splice(0, c.length - _), _ = c.length, y.assert) {
              if (!1 === (m = y.assert(c, u, r, o, e)))
                continue;
              "number" == typeof m && (r += m, h += m)
            }
            if (y.action && (c = y.action(c, u, r, o, e) || c),
              h = y.eMove ? h : r,
              n && _auxKit.log(u + ":" + o + ">" + y.to),
              E === C - 1) {
              r += f,
                o = y.to;
              continue t
            }
            if (b = i(e, r + f, y.to, c, h), b.acceptable)
              return b;
            p = b
          }
          if (p)
            return p;
          break
        }
        return {
          stack: c,
          lastIndex: h,
          lastState: o,
          acceptable: a.accept(o)
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
  
  // ),
  //     "function" != typeof define)
  //   var define def= require("amdefine")(module);
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
      // return g || (g = NFA(validStructs, d)), g
      // return NFAparser || (NFAparser = new NFA(validStructs).NFAobject), NFAparser
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
        ["groupNamedStart,groupNamedContent>groupNamedContent", "0-9a-zA-Z_",  elementsCallback.groupNamedContent],
        ["groupNamedContent>groupNamedEnd", "0-9a-zA-Z_",  elementsCallback.groupNamedContent],
        ["groupNamedEnd,groupNamedContent>groupQualifiedStart", ">"],
      ]
    };
  
    return init_object
  }
  // ),

  // if (define("visualize", ["./Kit", "./parse"], function(t, e) {
  function visualize(tp, fp, ep) {
    var kitInstance = Kit();
    // var e = parse();
    function r(t, e) {
      if (e = e || "normal", S[t] && S[t][e])
        return S[t][e];
      y.attr({
        "font-size": t,
        "font-weight": e
      });
      var r = y.getBBox();
      return S[t] = S[t] || {},
        S[t][e] = {
        width: r.width / ((y.attr("text").length - 1) / 2),
        height: r.height / 2
      }
    }
    function n(t) {
      y = t.text(-1e3, -1e3, "XgfTlM|.q\nXgfTlM|.q").attr({
        "font-family": E,
        "font-size": m
      })
    }
    function paintRegex(regexJson, e, canvasRaph) {
      canvasRaph.clear(),
        canvasRaph.setSize(0, 0);
      var o = canvasRaph.rect(0, 0, 0, 0);
      o.attr("fill", w),
        o.attr("stroke", w),
        n(canvasRaph),
        C = !!~e.indexOf("m");
      var c = d(regexJson.tree);
      c.unshift(createItemTextSpecial("/", B.delimiter)),
        c.unshift(createItemTextSpecial("RegExp: ")),
        c.push(createItemTextSpecial("/", B.delimiter)),
        e && c.push(createItemTextSpecial(e, B.flags));
      var h = r(m, "bold")
      , u = k
      , l = h.height / 2 + k
      , f = 0
      , p = 0;
      f = c.reduce(function(t, e) {
        return e.x = t,
          e.y = l,
          t + e.text.length * h.width
      }, u),
        f += k,
        p = h.height + 2 * k,
        c = canvasRaph.add(c),
        canvasRaph.setSize(f, h.height + 2 * k);
      var g = generateRaphaelSVG(regexJson.tree, 0, 0);
      p = Math.max(g.height + 3 * k + h.height, p),
        f = Math.max(g.width + 2 * k, f),
        canvasRaph.setSize(f, p),
        o.attr("width", f),
        o.attr("height", p),
        addsOffset(g.items, k, 2 * k + h.height - g.y),
        canvasRaph.add(g.items)
    }
    function generateRaphaelSVG(t, e, r) {
      return t.unshift({
        type: "startPoint"
      }),
        t.push({
        type: "endPoint"
      }),
        processRaphaelRegexJSON(t, e, r)
    }
    function addsOffset(t, offsetX, offsetY) {
      t.forEach(function(t) {
        t._translate ? t._translate(offsetX, offsetY) : (t.x += offsetX, t.y += offsetY)
      })
    }
    // Funcion ultima que pinta todo
    function processRaphaelRegexJSON(regexJSONInfo, itemsPosX, offsetHeight) {
      var n = []
      , raphaelItems = []
      , itemsWidth = 0
      , itemsHeight = 0
      , o = itemsPosX
      , itemsPosY = offsetHeight
      , _actualHeight = offsetHeight;
      if (!regexJSONInfo.length)
        return A.empty(regexJSONInfo, itemsPosX, offsetHeight);
      regexJSONInfo.forEach(function(t) {
        var elementSVGRaphael;
        elementSVGRaphael = t.repeat ? A.repeat(t, o, offsetHeight) : A[t.type](t, o, offsetHeight);
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
        n.reduce(function(firstElement, nextElement) {
          itemsWidth += _;
          var n = generatePathLines(regexJSONInfo, firstElement.lineOutX, offsetHeight, nextElement.lineInX, _fromItem=firstElement, _toItem=nextElement);
          return raphaelItems.push(n), nextElement
      });
      var itemsLineInX = n[0].lineInX;
      var itemsLineOutX = n[n.length - 1].lineOutX;
      return {
        items: raphaelItems,
        width: itemsWidth,
        height: itemsHeight,
        x: itemsPosX,
        y: itemsPosY,
        lineInX: itemsLineInX,
        lineOutX: itemsLineOutX
      }
    }
    function createItemExactChar(regexJSONInfo, rawText, _offsetX, _offsetY, backgroundColor, textColor) {
      rawText = kitInstance.toPrint(rawText);
      var o = r(m)
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
        "font-size": m,
        "font-family": E,
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
      var a, s = r(b), o = n.split("\n"), c = o.length * s.height;
      a = o.length > 1 ? Math.max.apply(Math, o.map(function(t) {
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
          "font-size": b,
          "font-family": E,
          fill: i || "#444"
        },
        x: t - a / 2,
        y: e - c - 4,
        width: a,
        height: c + 4
      }
    }
    function generatePathLines(regexJSONInfo, xOffset, yOffset, xOffsetTo, _fromItem=null, _toItem=null) {
      // Se generan al final todos los paths por lo que no hay informacion en los paths util
      let idInfo = "linejoint";
      if (_fromItem !== null){
        // El filter es para comprobar que tiene la propiedad
        idInfo = `${idInfo}::${_fromItem.items.map(item => item.class)/*.filter(x => x)*/.join('_')}`;
      }
      if (_toItem !== null){
        idInfo = `${idInfo}::${_toItem.items.map(item => item.class)/*.filter(x => x)*/.join('_')}::`;
      }
      
        if(regexJSONInfo.hasOwnProperty('indices')){
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
        _translate: function(t, e) {
          var r = this.path;
          r[1] += t,
            r[2] += e,
            r[4] += t
        }
      }
    }
    function l(regexJSONInfo, t, e, r, n) {
      var i, a, s = t > r ? -1 : 1, o = e > n ? -1 : 1;
      return Math.abs(e - n) < 15 ? (i = ["M", t, e, "C", t + Math.min(Math.abs(r - t) / 2, 10) * s, e, r - (r - t) / 2, n, r, n],
                                     a = function(t, e) {
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
                                         a = function(t, e) {
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
      return {
        items: [{
          type: "circle",
          class: `circle:${regexJSONInfo.type}:${regexJSONInfo.indices.join(';')}`,
          fill: radialGradientColor,
          cx: _offsetX + 10,
          cy: _offsetY,
          r: 10,
          stroke: "none",
          _translate: function(t, e) {
            this.cx += t,
              this.cy += e
          }
        }],
        width: 20,
        height: 20,
        x: _offsetX,
        y: _offsetY,
        lineInX: _offsetX,
        lineOutX: _offsetX + 20
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
    function d(e) {
      var r = [];
      return e.forEach(function(e) {
        if (e.sub)
          r.push(createItemTextSpecial("(")),
            e.type === ASSERT_NODE ? e.assertionType === AssertLookahead ? r.push(createItemTextSpecial("?=")) : r.push(createItemTextSpecial("?!")) : e.name !== "" ? r.push(createItemTextSpecial(`?P<${e.name}>`)): e.nonCapture && r.push(createItemTextSpecial("?:")),
            r = r.concat(d(e.sub)),
            r.push(createItemTextSpecial(")"));
        else if (e.branches)
          e.branches.map(d).forEach(function(t) {
            r = r.concat(t),
              r.push(createItemTextSpecial("|"))
          }),
            r.pop();
        else {
          var n = B[e.type] || B.defaults;
          switch (e.type) {
            case CHARSET_NODE:
              var i = defineSVGRegexItems(e);
              (!i || e.exclude) && r.push(createItemTextSpecial("[")),
                e.exclude && r.push(createItemTextSpecial("^", B.charsetExclude)),
                e.ranges.forEach(function(t) {
                r.push(createItemTextSpecial(g(t[0] + "-" + t[1]), B.charsetRange))
              }),
                e.classes.forEach(function(t) {
                r.push(createItemTextSpecial("\\" + t, B.charsetClass))
              }),
                r.push(createItemTextSpecial(g(e.chars), B.charsetChars)),
                (!i || e.exclude) && r.push(createItemTextSpecial("]"));
              break;
            default:
              var a = e.raw || "";
              e.repeat && (a = a.slice(0, e.repeat.beginIndex)),
                a = kitInstance.toPrint(a, !0),
                r.push(createItemTextSpecial(a, n))
          }
        }
        if (e.repeat) {
          var s = e.repeat.min
          , o = e.repeat.max;
          0 === s && o === 1 / 0 ? r.push(createItemTextSpecial("*")) : 1 === s && o === 1 / 0 ? r.push(createItemTextSpecial("+")) : 0 === s && 1 === o ? r.push(createItemTextSpecial("?")) : (r.push(createItemTextSpecial("{")),
                                                                                                                                     r.push(createItemTextSpecial(s)),
                                                                                                                                     s === o ? r.push(createItemTextSpecial("}")) : (r.push(createItemTextSpecial(",")),
                            isFinite(o) && r.push(createItemTextSpecial(o)),
                            r.push(createItemTextSpecial("}")))),
            e.repeat.nonGreedy && r.push(createItemTextSpecial("?", B.repeatNonGreedy))
        }
      }),
        r
    }
    function g(e) {
      return e = kitInstance.toPrint(e),
        e.replace(/\[/g, "\\[").replace(/\]/g, "\\]")
    }
    function createItemTextSpecial(t, e) {
      return e = e || B[t] || B.defaults,
        {
        type: "text",
        "font-size": m,
        "font-family": E,
        text: t + "",
        fill: e,
        "text-anchor": "start",
        "font-weight": "bold"
      }
    }
    function defineSVGRegexItems(t) {
      return !t.chars && !t.ranges.length && 1 === t.classes.length
    }
    // e("", t).exportConstants();
    var y, m = 16, b = 14, _ = 16, w = "#EEE", E = "DejaVu Sans Mono,monospace", C = !1, k = 10, S = {}, A = {
      startPoint: function(regexJSONInfo, offsetX, offsetY) {
        return circleSVG({type: "startPoint", indices:[-1, -1]}, offsetX, offsetY, "r(0.5,0.5)#EFE-green")
      },
      endPoint: function(regexJSONInfo, offsetX, offsetY) {
        return circleSVG({type: "endPoint", indices:[Infinity, Infinity]}, offsetX, offsetY, "r(0.5,0.5)#FFF-#000")
      },
      empty: function(regexJSONInfo, offsetX, offsetY) {
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
      exact: function(regexJSONInfo, offsetX, r) {
        return createItemExactChar(regexJSONInfo, regexJSONInfo.chars, offsetX, r, "skyblue", )
      },
      dot: function(regexJSONInfo, offsetX, offsetY) {
        var n = createItemExactChar(regexJSONInfo, "AnyCharExceptNewLine", offsetX, offsetY, "DarkGreen", "white");
        return n.rect.r = 10,
          n.rect.tip = "AnyChar except CR LF",
          n
      },
      backref: function(regexJSONInfo, offsetX, offsetY) {
        var n = createItemExactChar(regexJSONInfom, "Backref #" + regexJSONInfo.num, offsetX, offsetY, "navy", "white");
        return n.rect.r = 8,
          n
      },
      repeat: function(regexJSONInfo, offsetX, offsetY) {
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
          return A.empty(regexJSONInfo, offsetX, offsetY);
        var a = regexJSONInfo.repeat
        , o = ""
        , c = [];
        if (a.min === a.max && 0 === a.min)
          return A.empty(regexJSONInfo, offsetX, offsetY);
        var u = A[regexJSONInfo.type](regexJSONInfo, offsetX, offsetY)
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
      choice: function(regexJSONInfo, offsetX, offsetY) {
        if (checkRegexJSONInfo(regexJSONInfo))
          return A.empty(regexJSONInfo, offsetX, offsetY);
        var n = 0
        , i = 0
        , a = regexJSONInfo.branches.map(function(regexBranch) {
          var a = processRaphaelRegexJSON(regexBranch, offsetX, offsetY);
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
        return a.forEach(function(t) {
          var n = c - t.width / 2;
          addsOffset(t.items, n - t.x, h - t.y),
            d = d.concat(t.items);
          var a = offsetY + h - t.y
          , o = l(regexJSONInfo, offsetX, offsetY, offsetX + 20, a)
          , p = l(regexJSONInfo, f, offsetY, offsetX + i - 20, a);
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
      charset: function(regexJSONInfo, offsetX, offsetY) {
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
        if (defineSVGRegexItems(regexJSONInfo)) {
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
          regexJSONInfo.ranges.forEach(function(t) {
          t = t.split("").join("-");
          var n = createItemExactChar(regexJSONInfo, t, offsetX, offsetY, "teal", "white");
          n.rect.r = 5,
            y.push(n),
            p = Math.max(n.width, p)
        }),
          regexJSONInfo.classes.forEach(function(t) {
          var i = createItemExactChar(regexJSONInfo, n[t], offsetX, offsetY, "Green", "white");
          i.rect.r = 5,
            y.push(i),
            p = Math.max(i.width, p)
        }),
          x = y[0].height;
        var b = []
        , _ = [];
        y.sort(function(t, e) {
          return e.width - t.width
        }),
          y.forEach(function(t) {
          2 * t.width + 4 > p ? b.push(t) : _.push(t)
        }),
          y = b;
        for (var w, E; _.length; ) {
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
        y.forEach(function(t) {
          addsOffset(t.items, offsetX - t.x + (p - t.width) / 2, k - t.y),
            l = l.concat(t.items),
            k += t.height + 4
        });
        let infoCharset = {type:"charsetgroup", indices: regexJSONInfo.indices};
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
      group: function(regexJSONInfo, offsetX, offsetY) {
        if (checkRegexJSONInfo(regexJSONInfo))
          return A.empty(regexJSONInfo, offsetX, offsetY);
        var n = processRaphaelRegexJSON(regexJSONInfo.sub, offsetX, offsetY);
        if (regexJSONInfo.num) {
          addsOffset(n.items, 10, 0);
          var i = n.width + 20, a = n.height + 20;
          var c = {
            type: "rect",
            class: `rect:${regexJSONInfo.type}:${regexJSONInfo.indices.join(';')}`,
            indmin: regexJSONInfo.indices[0],
            indmax: regexJSONInfo.indices[1],
            x: offsetX,
            y: n.y - 10,
            r: 6,
            width: i,
            height: a,
            "stroke-dasharray": ".",
            stroke: "silver",
            "stroke-width": 2
          };
          var u = createItemText(regexJSONInfo, c.x + c.width / 2, c.y - 2, `Group ${regexJSONInfo.name}#${regexJSONInfo.num}`);
          var items = n.items.concat([c, u.label]);
          var f = Math.max(u.width, i), d = (f - i) / 2;
          return d && addsOffset(items, d, 0),
          {
            items: items,
            width: f,
            height: a + u.height + 4,
            x: offsetX,
            y: u.y,
            lineInX: d + n.lineInX + 10,
            lineOutX: d + n.lineOutX + 10
          }
        }
        return n
      },
      assert: function(regexJSONInfo, offsetX, offsetY) {
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
          return !C || "AssertBegin" !== a && "AssertEnd" !== a || (o = "Line" + o),
            createItemExactChar(regexJSONInfo, o, offsetX, offsetY, n.bg, n.fg);
        var u, l;
        a === AssertLookahead ? (u = "CornflowerBlue",
                                 l = "darkgreen",
                                 o = "Followed by:") : a === AssertNegativeLookahead && (u = "#F63",
                                                                                         l = "Purple",
                                                                                         o = "Not followed by:");
        var f = A.group(regexJSONInfo, offsetX, offsetY)
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
    }, B = {
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
    return paintRegex(tp, fp, ep);
  }
  // ),

  //  ),
  // "function" != typeof define)
  //     var define = require("amdefine")(module);

  const inputRegex = document.querySelector('#input');

  // SET DE FUNCIONES AUXILIARES
  var showExportImage = function() {
    var ratio = window.devicePixelRatio || 1;
    svg = graphCt.getElementsByTagName('svg')[0];
    var w = svg.clientWidth || parseInt(getComputedStyle(svg).width);
    var h = svg.clientHeight || parseInt(getComputedStyle(svg).height);
    var img = new Image;
    img.width = w;
    img.height = h;
    img.setAttribute('src', svgDataURL(svg));

    var canvas = document.createElement("canvas");

    canvas.width = w * ratio;
    canvas.height = h * ratio;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    canvas.className = "exportCanvas";
    var ctx = canvas.getContext("2d");
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    img.onload = function() {
      ctx.drawImage(img, 0, 0);
      graphCt.style.display = 'none';
      document.body.appendChild(canvas);
    }
    ;
  }
  var svgDataURL = function(svg) {
    var svgAsXML = (new XMLSerializer).serializeToString(svg);
    return "data:image/svg+xml," + encodeURIComponent(svgAsXML);
  }
  var dragGraph = function(g) {
    g.addEventListener('mousedown', startMove);

    function startMove(e) {
      clearSelect();
      var x = e.clientX
      , y = e.clientY;
      g.addEventListener('mousemove', onMove);

      document.addEventListener('mouseup', unbind, true);
      window.addEventListener('mouseup', unbind, true);
      function unbind(e) {
        g.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', unbind, true);
        window.removeEventListener('mouseup', unbind, true);
      }

      function onMove(e) {
        var dx = x - e.clientX
        , dy = y - e.clientY;
        if (dx > 0 && g.scrollWidth - g.scrollLeft - g.clientWidth < 2 || dx < 0 && g.scrollLeft < 1) {
          document.documentElement.scrollLeft += dx;
          document.body.scrollLeft += dx;
        } else {
          g.scrollLeft += dx;
        }
        if (dy > 0 && g.scrollHeight - g.scrollTop - g.clientHeight < 2 || dy < 0 && g.scrollTop < 1) {
          document.documentElement.scrollTop += dy;
          document.body.scrollTop += dy;
        } else {
          g.scrollTop += dy;
        }
        x = e.clientX;
        y = e.clientY;
      }
    }
  }
  var getInnerText = function(ele) {
    if (!ele)
      return '';
    var node = ele.firstChild
    , results = [];
    if (!node)
      return '';
    do {
      if (node.nodeType === document.TEXT_NODE)
        results.push(node.nodeValue);
      else
        results.push(getInnerText(node));
    } while (node = node.nextSibling);return results.join('');
  }
  var setInnerText = function(ele, s) {
    ele.innerHTML = '';
    var t = document.createTextNode('');
    t.nodeValue = s;
    ele.appendChild(t);
    return s;
  }
  var clearSelect = function() {
    if (window.getSelection) {
      if (window.getSelection().empty) {
        // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {
        // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {
      // IE
      document.selection.empty();
    }
  }
  var hideError = function() {
    errorBox.style.display = 'none';
  }
  var showError = function(re, err) {
    errorBox.style.display = 'block';
    var msg = ["Error:" + err.message, ""];
    if (typeof err.lastIndex === 'number') {
      msg.push(re);
      msg.push(Kit().repeats('-', err.lastIndex) + "^");
    }
    setInnerText(errorBox, msg.join("\n"));
  }
  var serializeHash = function(params) {
    var re = getInputValue();
    var flags = getFlags();
    return "#!" + (params.debug ? "debug=true&" : "") + (params.cmd ? "cmd=" + params.cmd + "&" : "") + (params.embed ? "embed=true&" : "") + "flags=" + flags + "&re=" + encodeURIComponent(params.re = re);

  }
  var changeHash = function() {
    location.hash = serializeHash(params);
  }

  
  var getFlags = function() {
    var fg = '';
    for (var i = 0, l = flags.length; i < l; i++) {
      if (flags[i].checked)
        fg += flags[i].value;
    }
    return fg;
  }
  var setFlags = function(fg) {
    for (var i = 0, l = fg.length; i < l; i++) {
      if (~fg.indexOf(flags[i].value))
        flags[i].checked = true;
      else
        flags[i].checked = false;
    }
    setInnerText(flagBox, fg);
  }
  flags.forEach(flag => flag.addEventListener('change', (event) => {
    setInnerText(flagBox, getFlags());
  }));


  var _updateREGEXSON = function(_regexTree) {
    function escapteHTML(inHTMLtext){
      return inHTMLtext.replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
    }
    // Se obtiene sin una funcion traverse
    _regexTree = {
      raw: escapteHTML(_regexTree.raw), 
      groupCount: _regexTree.groupCount, 
      tree: _regexTree.tree
    }
    const treeRegex = document.querySelector('#treeRegex');
    const jsonRegex = document.querySelector('#jsonRegex');
    treeRegex.innerHTML = "";
    const treeData = JsonView.renderJSON(_regexTree, treeRegex);
    jsonRegex.innerHTML = JSON.stringify(_regexTree, undefined, 2);
    // jsonRegex.textContent = JSON.stringify(_data, undefined, 2);
    // hljs.highlightBlock(treeRegex);
  };

  var _parseRegex = function(regExpresion){
    // Aqui se realiza el parseo
    var skipError = false;

    // changeHash();
    hideError();
    var regEXSON=null;
    try {
      var init_parse = parse();
      regEXSON = init_parse(regExpresion);
    } catch (e) {
      if (e instanceof init_parse.RegexSyntaxError) {
        if (!skipError) {
          showError(regExpresion, e);
        }
      } else {
        throw e;
      }
      // return false;
    }
    if (regEXSON){
      _updateREGEXSON(regEXSON);
    }
    
    return regEXSON
  };

  var parseEvent = function(event) {
    var regExpresion = inputRegex.value;
    _parseRegex(regExpresion);
  };

  // FUNCIONES DE VISUALIZACION
  var _parseVisualizeRegex = function() {
    var regExpresion = inputRegex.value;
    var regEXSON = _parseRegex(regExpresion);
    if(regEXSON){
      visualize(regEXSON, getFlags(), paper);
      return true;
    }
  };

 
  function initMainEventsListener(){
    // inputRegex.addEventListener('change', parseEvent);
    var parseVisualizeEvent = function(event) {
      _parseVisualizeRegex();
      groupRaphItems();
    };
    parseBtn.addEventListener("click", parseEvent);
    visualBtn.addEventListener("click", parseVisualizeEvent);
  }
  initMainEventsListener();
  dragGraph(document.getElementById('graphCt'));








  
   // PARAMETROS GLOBALES DE JEX
   var params = getParams();
   if (params.embed || params.cmd == "export") {
       document.body.className += " embed";
   }
 
   function trim(s) {
     return s.replace(/^\s+/, '').replace(/\s+$/, '');
   }
 
   var getInputValue = function() {
     return trim(input.value);
   };
   var setInputValue = function(v) {
       return input.value = trim(v);
   };
  
  function getParams() {
    var params = location.hash;
    if (!params || params.length < 2) {
        params = {
            embed: false,
            re: "",
            highlight: true,
            flags: ''
        };
    } else {
        params = params.slice(2);
        params = params.split("&").reduce(function(p, a) {
            a = a.split("=");
            p[a[0]] = a[1];
            return p;
        }, {});
        params.embed = params.embed === 'true';
        params.flags = params.flags || '';
        params.re = params.re ? trim(decodeURIComponent(params.re)) : '';
    }
    return params;
  }
  if (params.embed || params.cmd === "export") {
    var embedFooterLink = document.getElementById("embedFooterLink");
    embedFooterLink.href = "https://jex.im/regulex/" + location.hash.replace(/\bembed=true\b/ig, "").replace(/\bcmd=export\b/ig, '');
  }
  function initEventsListener(){
    embedBtn.addEventListener('click', function() {
      if (!_parseRegex(inputRegex.value))
          return false;
      var src = location.href;
      var i = src.indexOf('#');
      src = i > 0 ? src.slice(0, i) : src;
      changeHash();
      var re = getInputValue();
      var html = '<iframe frameborder="0" width="' + Math.ceil(paper.width) + '" height="' + Math.ceil(paper.height) + '" src="' + src + '#!embed=true&flags=' + getFlags() + '&re=' + encodeURIComponent(re) + '"></iframe>'
      window.prompt("Copy the html code:", html);
    });

    exportBtn.addEventListener('click', function() {
      var newParams = Object.assign({}, params);
      newParams.cmd = 'export';
      var hash = serializeHash(newParams);
      window.open(location.href.split('#!')[0] + hash, "_blank");
    });
  }
  
  if (params.flags) {
    setFlags(params.flags);
  }
  if (params.re) {
    setInputValue(params.re);
  } 
  if (params.cmd == 'export') {
    showExportImage();
    return;
  } else {
    initEventsListener();
    dragGraph(document.getElementById('graphCt'));
  }
};

