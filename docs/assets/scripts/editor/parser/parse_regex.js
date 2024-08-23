function RegexParser(){var a,o,r=Kit(),t={};function e(){var e=Object.keys(a).map(function(e){return e+"="+JSON.stringify(a[e])}).join(";");!function(){return this}().eval(e)}function p(e){this.raw=e.raw,this.tree=e.tree,this.groupCount=e.groupCount,this.errors=E.RegexSyntaxThrows}function E(e,a,t){E.RegexSyntaxThrows=[],o=a;var r,n,a=(r=i(t).input(e,0,a)).stack,s=(a=C.endChoice(a),r.lastState);if(!(r.acceptable&&r.lastIndex===e.length-1)){switch(s){case"charsetRangeEndWithNullChar":n={type:"CharsetRangeEndWithNullChar",message:"Charset range end with NUL char does not make sense!\nBecause [a-\\0] is not a valid range.\nAnd [\\0-\\0] should be rewritten into [\\0]."};break;case"tokenIncomplete":n={type:"TokenIncomplete",message:"The token is not completed!"};break;case"repeatErrorFinal":n={type:"NothingRepeat",message:"Nothing to repeat!"};break;case"digitFollowNullError":n={type:"DigitFollowNullError",message:"The '\\0' represents the <NUL> char and cannot be followed by a decimal digit!"};break;case"charsetRangeEndClass":n={type:"CharsetRangeEndClass",message:'Charset range ends with class such as "\\w\\W\\d\\D\\s\\S" is invalid!'};break;case"charsetOctEscape":n={type:"DecimalEscape",message:"Decimal escape appears in charset is invalid.Because it can't be explained as  backreference.And octal escape is deprecated!"};break;default:0===s.indexOf("charset")?n={type:"UnclosedCharset",message:"Unterminated character class!"}:")"===e[r.lastIndex]?n={type:"UnmatchedParen",message:"Unmatched end parenthesis!"}:(n={type:"UnexpectedChar",message:"Unexpected char!"},r.lastIndex++)}n&&(n.lastIndex=r.lastIndex,n.lastState=s,n.indices=[r.lastIndex,r.lastIndex],E.RegexSyntaxThrows.push(n))}var c=(a=function e(a,t,r){if(a._parentGroup){var n={type:"UnterminatedGroup",message:"Unterminated group!",lastIndex:a._parentGroup.indices[0],lastState:r,indices:[a._parentGroup.indices[0],a._parentGroup.indices[0]]};E.RegexSyntaxThrows.push(n),a._parentGroup.errors||(a._parentGroup.errors=[]),a._parentGroup.errors.push(n),a=C.groupEnd(a,"",t.length,r,t)}else{if(!a._parentChoice)return a;n={type:"UnterminatedGroup",message:"Unterminated group!",lastIndex:a._parentChoice.indices[0],lastState:r,indices:[a._parentChoice.indices[0],a._parentChoice.indices[0]]},E.RegexSyntaxThrows.push(n),a._parentChoice.errors||(a._parentChoice.errors=[]),a._parentChoice.errors.push(n),a=C.endChoice(a,"",t.length,r,t)}return e(a,t,r=null)}(a,e,s)).groupCounter?a.groupCounter.i:0,c=(delete a.groupCounter,function t(e,r,a){if(!e.length)return void e.push({type:EMPTY_NODE,indices:[a,a]});e.reduce(function(e,a){return a.indices.push(e),a.raw=r.slice(a.indices[0],e),a.type===GROUP_NODE||a.type===ASSERT_NODE&&a.sub?t(a.sub,r,a.endParenIndex):a.type===CHOICE_NODE?(a.branches.reduce(function(e,a){t(a,r,e);a=a[0];return(a?a.indices[0]:e)-1},e),a.branches.reverse()):a.type!==EXACT_NODE||a.concatTemp||(a.chars=a.chars||a.raw),a.indices[0]},a),e.reverse()}(a,e,e.length),new p({raw:e,groupCount:c,tree:a=h(a)}));return c.traverse(H,CHARSET_NODE,t),c.traverse(G,ASSERT_NODE,t),u(a),o=!1,c}function i(e="javascript6"){var a=P[e];return t.hasOwnProperty(e)?t[e]:new NFA(a)}function d(e,a,t){Object.defineProperty(e,a,{value:t,enumerable:o,writable:!0,configurable:!0})}function h(e){return e.filter(function(e){return e.type==EXACT_NODE&&e.concatTemp?(delete e.concatTemp,!!e.chars):(e.sub?e.sub=h(e.sub):e.branches&&(e.branches=e.branches.map(h)),!0)})}function u(e){function a(e){e.sub?u(e.sub):e.branches&&e.branches.map(u)}var t=e[0];a(t);for(var r,n=1,s=1,c=e.length;n<c;n++){if((r=e[n]).type===EXACT_NODE){if(t.type===EXACT_NODE&&!t.repeat&&!r.repeat){t.indices[1]=r.indices[1],t.raw+=r.raw,t.chars+=r.chars;continue}}else a(r);t=e[s++]=r}t&&(e.length=s)}function G(e,a){var t;e.repeat&&"python"!=a&&(a="Nothing to repeat! Repeat after assertion doesn't make sense!","AssertLookahead"!==(t=e.assertionType)&&"AssertNegativeLookahead"!==t||(a+="\n/a"+(t="("+("AssertLookahead"===t?"?=":"?!")+"b)")+"+/、/a"+t+"{1,n}/ are the same as /a"+t+"/。\n/a"+t+"*/、/a"+t+"{0,n}/、/a"+t+"?/ are the same as /a/。"),t={type:"NothingRepeat",lastIndex:e.indices[1]-1,message:a,indices:e.indices},E.RegexSyntaxThrows.push(t),e.errors||(e.errors=[]),e.push(t))}function H(t,e){t.ranges=r.sortUnique(t.ranges.map(function(e){var a;return e[0]>e[1]&&(a={type:"OutOfOrder",lastIndex:e.lastIndex,message:"Range ["+e.join("-")+"] out of order in character class!",indices:t.indices},E.RegexSyntaxThrows.push(a),t.errors||(t.errors=[]),t.errors.push(a)),e.join("")}))}function n(e){this.name="RegexSyntaxError",this.type=e.type,this.lastIndex=e.lastIndex,this.lastState=e.lastState,this.lastStack=e.lastStack,this.message=e.message,Object.defineProperty(this,"stack",{value:new Error(e.message).stack,enumerable:!1})}a={ASSERT_NODE:"assert",BACKREF_NODE:"backref",CHARSET_NODE:"charset",CHOICE_NODE:"choice",DOT_NODE:"dot",EMPTY_NODE:"empty",EXACT_NODE:"exact",GROUP_NODE:"group",HEXADECIMAL_NODE:"hexadecimal",UNICODE_NODE:"unicode",OCTAL_NODE:"octal",GROUP_COMMENT:"comment",UNEXPECTED_NODE:"unexpected",AssertLookahead:"AssertLookahead",AssertNegativeLookahead:"AssertNegativeLookahead",AssertNonWordBoundary:"AssertNonWordBoundary",AssertWordBoundary:"AssertWordBoundary",AssertEnd:"AssertEnd",AssertBegin:"AssertBegin"},e(),p.prototype.traverse=function(e,n,a){!function a(e,t,r){e.forEach(function(e){n&&e.type!==n||t(e,r),e.sub?a(e.sub,t,r):e.branches&&e.branches.forEach(function(e){a(e,t,r)})})}(this.tree,e,a)},E.Constants=a,E.exportConstants=e,E.RegexSyntaxError=n,E.RegexSyntaxThrows=[],E.getNFAParser=i,n.prototype.toString=function(){return this.name+" "+this.type+":"+this.message};var s={n:"\n",r:"\r",t:"\t",v:"\v",f:"\f"};const M=e=>e.replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t").replace(/(\v)/g,"\\v").replace(/(\f)/g,"\\f");var c="0-9a-fA-F",g="repeatnStart,repeatn_1,repeatn_2,repeatnErrorStart,repeatnError_1,repeatnError_2",l="hexEscape1,hexEscape2",m="unicodeEscape1,unicodeEscape2,unicodeEscape3,unicodeEscape4",x="charsetUnicodeEscape1,charsetUnicodeEscape2,charsetUnicodeEscape3,charsetUnicodeEscape4,charsetHexEscape1,charsetHexEscape2",C={escapeStart:b,exact:f,dot:S,nullChar:function(e,a,t){e.unshift({id:Math.random().toString(36).substr(2,9),type:EXACT_NODE,chars:"\0",indices:[t-1]})},assertBegin:R,assertEnd:y,assertWordBoundary:function(e,a,t){e.unshift({id:Math.random().toString(36).substr(2,9),type:ASSERT_NODE,indices:[t-1],assertionType:"b"==a?AssertWordBoundary:AssertNonWordBoundary})},repeatnStart:N,repeatnComma:function(e,a,t){d(e[0],"_commaIndex",t)},repeatNonGreedy:function(e){let a=e[0];(a=a.type===GROUP_COMMENT?e[1]:a).repeat.nonGreedy=!0,a.repeat.raw=a.repeat.raw+"?"},repeatnEnd:function(e,a,t,r,n){let s,c=e[0];var o=n.lastIndexOf("{",t),p=parseInt(n.slice(o+1,c._commaIndex||t),10),r=(c._commaIndex?((s=c._commaIndex+1==t?1/0:parseInt(n.slice(c._commaIndex+1,t),10))<p&&(E.RegexSyntaxThrows.push(r={type:"OutOfOrder",lastState:r,lastIndex:t,indices:[o,t],message:"Numbers out of order in {} quantifier!"}),c.errors||(c.errors=[]),c.errors.push(r)),delete c._commaIndex):s=p,n.substr(o,t-o+1));c.indices[0]>=o&&e.shift(),O(e,p,s,o,r,n)},repeat1ToInf:I,repeat0To1:k,repeat0ToInf:_,charClassEscape:Q,normalEscape:function(e,a,t){s.hasOwnProperty(a)&&(a=s[a]),e.unshift({id:Math.random().toString(36).substr(2,9),type:EXACT_NODE,chars:a,indices:[t-1]})},unicodeEscape:function(e,a,t,r,n){a=String.fromCharCode(parseInt(n.slice(t-3,t+1),16)),e.shift(),e.unshift({id:Math.random().toString(36).substr(2,9),type:UNICODE_NODE,chars:a,indices:[t-5]})},hexEscape:function(e,a,t,r,n){a=String.fromCharCode(parseInt(n[t-1]+a,16)),e.shift(),e.unshift({id:Math.random().toString(36).substr(2,9),type:HEXADECIMAL_NODE,chars:a,indices:[t-3]})},groupStart:T,groupNonCapture:function(e){var a=e._parentGroup;a.nonCapture=!0,a.num=void 0,e.groupCounter.i--},groupNamedContent:function(e,a){e._parentGroup.name+=a},groupNamedBadName:function(e,a,t,r,n,s){r={type:"GroupBadName",lastIndex:t,lastState:r,message:`The group name cannot has the char "${a}"`,indices:[t,t]},E.RegexSyntaxThrows.push(r),(t=e._parentGroup).name+=a,t.errors||(t.errors=[]),t.errors.push(r)},groupComment:function(e){var a=e._parentGroup;a.num=void 0,e.groupCounter.i--,a.type=GROUP_COMMENT,a.comment="",delete a.sub},groupCommentContent:function(e,a,t){e._parentGroup.comment+=a},groupCommentEnd:function(e,a,t,r,n,s){var c=e._parentGroup;return delete e._parentGroup,delete e.groupCounter,e=c._parentStack,delete c._parentStack,e.unshift(c),c.endParenIndex=t,e},backref:function(e,a,t,r){var n=e[0],a=parseInt(a,10),s=(s=e.groupCounter)&&s.i||0;"escape"===r?(n={id:Math.random().toString(36).substr(2,9),type:BACKREF_NODE,indices:[t-1]},e.unshift(n)):a=parseInt(n.num+""+a,10),s<a&&(E.RegexSyntaxThrows.push(s={type:"InvalidBackReference",lastIndex:t,lastState:r,message:"Back reference number("+a+") greater than current groups count("+s+").",indices:[t-1,t]}),n.errors||(n.errors=[]),n.errors.push(s)),function e(a,t){return!!t._parentGroup&&(t._parentGroup.num==a?a:e(a,t._parentGroup._parentStack))}(a,e)&&(E.RegexSyntaxThrows.push(s={type:"InvalidBackReference",lastIndex:t,lastState:r,message:"Recursive back reference in group ("+a+") itself.",indices:[t,t]}),n.errors||(n.errors=[]),n.errors.push(s)),n.num=a},groupToAssertion:function(e,a,t){var r=e._parentGroup;r.type=ASSERT_NODE,r.assertionType="="==a?AssertLookahead:AssertNegativeLookahead,r.num=void 0,e.groupCounter.i--},groupEnd:U,choice:w,endChoice:A,charsetStart:D,charsetExclude:function(e){e[0].exclude=!0},charsetContent:v,charsetNullChar:function(e,a,t){e[0].chars+="\0",e[0].tokens.push({type:"escape",indices:[t-1,t+1],raw:"\\0"})},charsetClassEscape:function(e,a,t){e[0].classes.push(a),e[0].tokens.push({type:"shorthand",indices:[t-1,t+1],raw:"\\"+a})},charsetHexEscape:function(e,a,t,r,n){var a=(e=e[0]).chars.slice(-1)+a,s=String.fromCharCode(parseInt(a,16));e.chars=e.chars.slice(0,-2),e.chars+=s,e.tokens=e.tokens.slice(2),e.tokens.push({type:"char-hexadecimal",escaped:s,indices:[t-3,t+1],raw:"\\x"+a})},charsetUnicodeEscape:function(e,a,t,r,n){var a=(e=e[0]).chars.slice(-3)+a,s=String.fromCharCode(parseInt(a,16));e.chars=e.chars.slice(0,-4),e.chars+=s,e.tokens=e.tokens.slice(4),e.tokens.push({type:"char-unicode",escaped:s,indices:[t-5,t+1],raw:"\\u"+a})},charsetRangeEnd:B,charsetNormalEscape:function(e,a,t){e[0].tokens.push({type:"escape",indices:[t-1,t+1],raw:"\\"+a}),s.hasOwnProperty(a)&&(a=s[a]),e[0].chars+=a},charsetRangeEndNormalEscape:function(e,a,t,r,n){if(s.hasOwnProperty(a))return B(e,a=s[a],t,0,0,lastEscaped=!0)},charsetRangeEndUnicodeEscape:function(e,a,t){let r=e[0];var e=r.chars.slice(-3)+a,n=(r.chars=r.chars.slice(0,-3),r.ranges.pop());a=String.fromCharCode(parseInt(e,16)),(n=[n[0],a]).lastIndex=t,r.ranges.push(n);var s=(n=r.tokens.slice(-4)[0]).range[0],a={type:"char",escaped:a,indices:[t-5,t+1],raw:"\\u"+e};r.tokens=r.tokens.slice(0,-4),r.tokens.push({type:"range",range:[s,a],indices:[n.indices[0],t+1],raw:s.raw+"-"+a.raw})},charsetRangeEndHexEscape:function(e,a,t){var r=(e=e[0]).chars.slice(-1)+a,n=(e.chars=e.chars.slice(0,-1),e.ranges.pop());a=String.fromCharCode(parseInt(r,16)),(n=[n[0],a]).lastIndex=t,e.ranges.push(n);var s=(n=e.tokens.slice(-2)[0]).range[0],a={type:"char",escaped:a,indices:[t-3,t+1],raw:"\\x"+r};e.tokens=e.tokens.slice(0,-2),e.tokens.push({type:"range",range:[s,a],indices:[n.indices[0],t+1],raw:s.raw+"-"+a.raw})},tokenIncomlpete:function(e,a,t,r,n){let s=f;var c,o,p,i,d,h,u,g={"+":I,"*":_,"?":k,"^":R,$:y,".":S,"|":w,"(":T,")":U,"{":N,"[":D,"\\":b};return a in g&&(s=g[a]),-1!==l.split(",").indexOf(r)?(g=e,i=a,d=t,h=r,u=n,p=s,c=u.slice(0,d).lastIndexOf("\\x")+1,o={type:"TokenIncomplete",lastIndex:c,lastState:h,message:"The hexadecimal escaped char is incomplete!",indices:[d,d]},E.RegexSyntaxThrows.push(o),g.unshift({id:Math.random().toString(36).substr(2,9),type:HEXADECIMAL_NODE,chars:u.slice(c+1,d),indices:[c-1],errors:[o]}),p(g,i,d,h,u)):-1!==m.split(",").indexOf(r)?(c=e,o=a,p=t,g=r,i=n,d=s,h=i.slice(0,p).lastIndexOf("\\u")+1,u={type:"TokenIncomplete",lastIndex:[h,p],lastState:g,message:"The unicode escaped char is incomplete!"},E.RegexSyntaxThrows.push(u),c.unshift({id:Math.random().toString(36).substr(2,9),type:UNICODE_NODE,chars:i.slice(h+1,p),indices:[h-1],errors:[u]}),d(c,o,p,g,i)):void 0},tokenIncompleteCharset:function(p,e,i,d,h){let a=v;e in(t={"]":void 0,"\\":void 0})&&(a=t[e]);var t=(e,a)=>{var e=h.slice(0,i).lastIndexOf("\\"+e)+1,t=i-e,e={type:"TokenIncomplete",lastIndex:e,lastState:d,message:`The ${a} escaped char is incomplete!`,indices:[e,i]},e=(E.RegexSyntaxThrows.push(e),p[0].errors||(p[0].errors=[]),p[0].errors.push(e),p[0].chars.slice(p[0].chars.length-t).slice(1));e&&(p[0].chars=p[0].chars.slice(0,-t)),p[0].chars+=e;let r=p[0].tokens[p[0].tokens.length-1-(t-1)];r.type="char-"+a,r.indices=[r.indices[0]-1,r.indices[1]],r.raw="\\"+r.raw},r=(e,a)=>{let t=p[0];var r=h.slice(0,i).lastIndexOf("\\"+e)+1,n=i-r,s=t.chars.slice(t.chars.length-n).slice(1),c=(""!==s&&(t.chars=t.chars.slice(0,-s.length)),t.ranges.pop()),c=(t.chars+=c[0],t.chars+=s,{type:"InvalidRange",lastIndex:r-2,lastState:d,message:`The right ${a} escaped token is invalid!`,indices:[r,r-2]}),s={type:"TokenIncomplete",lastIndex:r,lastState:d,message:`The ${a} escaped char is incomplete!`,indices:[r,r]};E.RegexSyntaxThrows.push(c),E.RegexSyntaxThrows.push(s),p[0].errors||(p[0].errors=[]),p[0].errors.push(c),p[0].errors.push(s);let o=p[0].tokens[p[0].tokens.length-1-(n-1)];o.range[1].type="char-"+a,o.range[1].indices=[o.range[1].indices[0]-1,o.range[1].indices[1]],o.range[1].raw="\\"+e,o.raw=o.range[0].raw+"-"+o.range[1].raw};if(-1!==["charsetHexEscape1","charsetHexEscape2"].indexOf(d)&&t("x","hexadecimal"),-1!==["charsetUnicodeEscape1","charsetUnicodeEscape2","charsetUnicodeEscape3","charsetUnicodeEscape4"].indexOf(d)&&t("u","unicode"),-1!==["charsetRangeEndUnicodeEscape1","charsetRangeEndUnicodeEscape2","charsetRangeEndUnicodeEscape3","charsetRangeEndUnicodeEscape4"].indexOf(d)&&r("u","unicode"),-1!==["charsetRangeEndHexEscape1","charsetRangeEndHexEscape2"].indexOf(d)&&r("x","hexadecimal"),a)return a(p,e,i,d,h)},unexpectedChar:function(e,a,t,r,n){e[0],r={type:"UnexpectedChar",lastIndex:t,lastState:r,message:`Unexpected character ${a}!`,indices:[t,t]},e.unshift({id:Math.random().toString(36).substr(2,9),type:UNEXPECTED_NODE,indices:[t],errors:[r]}),E.RegexSyntaxThrows.push(r)}};function f(e,a,t){var r=e[0];(!r||r.type!=EXACT_NODE||r.repeat||r.chars&&!r.concatTemp)&&e.unshift({id:Math.random().toString(36).substr(2,9),type:EXACT_NODE,indices:[t]}),r&&r.concatTemp&&(r.chars+=a)}function S(e,a,t){e.unshift({id:Math.random().toString(36).substr(2,9),type:DOT_NODE,indices:[t]})}function R(e,a,t){e.unshift({id:Math.random().toString(36).substr(2,9),type:ASSERT_NODE,indices:[t],assertionType:AssertBegin})}function y(e,a,t,r,n){e.unshift({id:Math.random().toString(36).substr(2,9),type:ASSERT_NODE,indices:[t],assertionType:AssertEnd})}function N(e,a,t){e[0].type!==EXACT_NODE&&e.unshift({id:Math.random().toString(36).substr(2,9),type:EXACT_NODE,indices:[t]})}function _(e,a,t,r,n){O(e,0,1/0,t,a,n)}function k(e,a,t,r,n){O(e,0,1,t,a,n)}function I(e,a,t,r,n){O(e,1,1/0,t,a,n)}function O(a,t,r,e,n,s){let c=a[0],o=!1;c.type===GROUP_COMMENT&&(c=a[1],o=!0);t={min:t,max:r,nonGreedy:!1};let p=e-1;if(c.chars&&1===c.chars.length&&(p=c.indices[0]),c.type===EXACT_NODE){let e;o&&(e=a.shift(),p=e.indices[0]-1);r={id:Math.random().toString(36).substr(2,9),type:EXACT_NODE,repeat:t,chars:c.chars||s[p],indices:[p]};c.indices[0]===p&&a.shift(),a.unshift(r),c=a[0],o&&(a.unshift(e),r.errors=e.errors)}else c.repeat=t;d(t,"raw",n),d(t,"beginIndex",e-c.indices[0]),d(t,"beginAbsIndex",e),o&&d(c,"commentRepeatId",a[0].id)}function b(e,a,t){e.unshift({concatTemp:!0,id:Math.random().toString(36).substr(2,9),type:EXACT_NODE,chars:"",indices:[t]})}function Q(e,a,t){e.unshift({id:Math.random().toString(36).substr(2,9),type:CHARSET_NODE,indices:[t-1],chars:"",ranges:[],classes:[a],exclude:!1})}function T(e,a,t){var r=e.groupCounter=e.groupCounter||{i:0},t=(r.i++,{id:Math.random().toString(36).substr(2,9),type:GROUP_NODE,name:"",num:r.i,sub:[],indices:[t],_parentStack:e});return d(e=t.sub,"_parentGroup",t),e.groupCounter=r,e}function U(e,a,t,r,n){var s=(e=A(e))._parentGroup;return s?(delete e._parentGroup,delete e.groupCounter,e=s._parentStack,delete s._parentStack,e.unshift(s),s.endParenIndex=t):(E.RegexSyntaxThrows.push(s={type:"UnexpectedChar",lastIndex:t,lastState:r,message:"Unexpected end parenthesis!",indices:[t,t]}),e[0].errors||(e[0].errors=[]),e[0].errors.push(s)),e}function w(e,a,t){var r,n,s=[];return e._parentChoice?((n=e._parentChoice).branches.unshift(s),d(s,"_parentChoice",n),d(s,"_parentGroup",n),s.groupCounter=e.groupCounter,delete e._parentChoice,delete e.groupCounter):(r=e[e.length-1],d(n={id:Math.random().toString(36).substr(2,9),type:CHOICE_NODE,indices:[r?r.indices[0]:t-1],branches:[]},"_parentStack",e),n.branches.unshift(e.slice()),e.length=0,e.unshift(n),s.groupCounter=e.groupCounter,d(s,"_parentChoice",n),d(s,"_parentGroup",n),n.branches.unshift(s)),s}function A(e){var a,t;return e._parentChoice?(a=e._parentChoice,delete e._parentChoice,delete e._parentGroup,delete e.groupCounter,t=a._parentStack,delete a._parentStack,t):e}function D(e,a,t){e.unshift({id:Math.random().toString(36).substr(2,9),type:CHARSET_NODE,indices:[t],classes:[],ranges:[],tokens:[],chars:""})}function v(e,a,t){e[0].chars+=a,e[0].tokens.push({type:"char",indices:[t,t+1],raw:a})}function B(e,a,t,r,n,s=!1){let c=e[0],o=c.chars.slice(-2);(o=[o[0],a]).lastIndex=t,c.ranges.push(o),c.chars=c.chars.slice(0,-2);e=c.tokens.slice(-2)[0],s={type:"char",indices:[s?t-1:t,t+1],raw:s?M(a):a};c.tokens=c.tokens.slice(0,-2),c.tokens.push({type:"range",range:[e,s],indices:[e.indices[0],t+1],raw:e.raw+"-"+s.raw})}var g={compact:!0,accepts:"start,begin,end,repeat0,repeat1,exact,repeatn,repeat01,repeatNonGreedy,choice,"+g+",nullChar,digitBackref",trans:[["start,begin,end,exact,repeatNonGreedy,repeat0,repeat1,repeat01,groupStart,groupQualifiedStart,choice,repeatn>exact","^+*?^$.|(){[\\",C.exact],["nullChar>exact","^+*?^$.|(){[\\0-9",C.exact],[g+",nullChar,digitBackref,start,begin,end,exact,repeatNonGreedy,repeat0,repeat1,repeat01,groupStart,groupQualifiedStart,choice,repeatn>exact",".",C.dot],["start,groupStart,groupQualifiedStart,end,begin,exact,repeat0,repeat1,repeat01,repeatn,repeatNonGreedy,choice,"+g+",nullChar,digitBackref>begin","^",C.assertBegin],[g+",nullChar,digitBackref,exact>repeatnStart","{",C.repeatnStart],["start,begin,end,groupQualifiedStart,groupStart,repeat0,repeat1,repeatn,repeat01,repeatNonGreedy,choice>repeatnErrorStart","{",C.exact],["repeatnStart>repeatn_1","0-9",C.exact],["repeatn_1>repeatn_1","0-9",C.exact],["repeatn_1>repeatn_2",",",C.repeatnComma],["repeatn_2>repeatn_2","0-9",C.exact],["repeatn_1,repeatn_2>repeatn","}",C.repeatnEnd],["repeatnStart,repeatnErrorStart>exact","}",C.exact],["repeatnStart,repeatnErrorStart>exact","^+*?^$.|(){[\\0-9}",C.exact],["repeatnErrorStart>repeatnError_1","0-9",C.exact],["repeatnError_1>repeatnError_1","0-9",C.exact],["repeatnError_1>repeatnError_2",",",C.exact],["repeatnError_2>repeatnError_2","0-9",C.exact],["repeatnError_2,repeatnError_1>repeatErrorFinal","}"],["repeatn_1,repeatnError_1>exact","^+*?^$.|(){[\\0-9,}",C.exact],["repeatn_2,repeatnError_2>exact","^+*?^$.|(){[\\0-9}",C.exact],["exact,"+g+",nullChar,digitBackref>repeat0","*",C.repeat0ToInf],["exact,"+g+",nullChar,digitBackref>repeat1","+",C.repeat1ToInf],["exact,"+g+",nullChar,digitBackref>repeat01","?",C.repeat0To1],["choice>repeatErrorFinal","*+?"],["repeatErrorFinal>exact",""],["repeat0,repeat1,repeat01,repeatn>repeatNonGreedy","?",C.repeatNonGreedy],["repeat0,repeat1,repeat01,repeatn>repeatErrorFinal","+*"],["start,begin,end,groupStart,groupQualifiedStart,exact,repeatNonGreedy,repeat0,repeat1,repeat01,repeatn,choice,"+g+",nullChar,digitBackref>escape","\\",C.escapeStart],["escape>nullChar","0",C.nullChar],["nullChar>digitFollowNullError","0-9"],["escape>exact","^dDwWsSux0-9bB1-9",C.normalEscape],["escape>exact","bB",C.assertWordBoundary],["escape>exact","dDwWsS",C.charClassEscape],["escape>unicodeEscape1","u",C.exact],["unicodeEscape1>unicodeEscape2",c,C.exact],["unicodeEscape2>unicodeEscape3",c,C.exact],["unicodeEscape3>unicodeEscape4",c,C.exact],["unicodeEscape4>exact",c,C.unicodeEscape],["escape>hexEscape1","x",C.exact],["hexEscape1>hexEscape2",c,C.exact],["hexEscape2>exact",c,C.hexEscape],["escape>digitBackref","1-9",C.backref],["digitBackref>digitBackref","0-9",C.backref],["digitBackref>exact","^+*?^$.|(){[\\0-9",C.exact],["exact,begin,end,repeat0,repeat1,repeat01,repeatn,repeatNonGreedy,start,groupStart,groupQualifiedStart,choice,"+g+",nullChar,digitBackref>groupStart","(",C.groupStart],["groupStart>groupQualify","?"],["groupQualify>groupQualifiedStart",":",C.groupNonCapture],["groupQualify>groupQualifiedStart","=",C.groupToAssertion],["groupQualify>groupQualifiedStart","!",C.groupToAssertion],[g+",nullChar,digitBackref,groupStart,groupQualifiedStart,begin,end,exact,repeat1,repeat0,repeat01,repeatn,repeatNonGreedy,choice>exact",")",C.groupEnd],["start,begin,end,groupStart,groupQualifiedStart,exact,repeat0,repeat1,repeat01,repeatn,repeatNonGreedy,choice,"+g+",nullChar,digitBackref>choice","|",C.choice],["start,groupStart,groupQualifiedStart,begin,end,exact,repeat0,repeat1,repeat01,repeatn,repeatNonGreedy,choice,"+g+",nullChar,digitBackref>end","$",C.assertEnd],["exact,begin,end,repeat0,repeat1,repeat01,repeatn,repeatNonGreedy,groupQualifiedStart,groupStart,start,choice,"+g+",nullChar,digitBackref>charsetStart","[",C.charsetStart],["charsetStart>charsetExclude","^",C.charsetExclude],["charsetStart>charsetContent","^\\]^",C.charsetContent],["charsetExclude>charsetContent","^\\]",C.charsetContent],["charsetContent,charsetClass>charsetContent","^\\]-",C.charsetContent],["charsetClass>charsetContent","-",C.charsetContent],["charsetStart,charsetContent,charsetNullChar,charsetClass,charsetExclude,charsetRangeEnd>charsetEscape","\\"],["charsetEscape>charsetContent","^dDwWsSux0-9",C.charsetNormalEscape],["charsetEscape>charsetNullChar","0",C.charsetNullChar],["charsetEscape>charsetOctEscape","1-9"],["charsetRangeEndEscape>charsetOctEscape","1-9"],["charsetNullChar>digitFollowNullError","0-9"],["charsetNullChar>charsetContent","^0-9\\]-",C.charsetContent],["charsetEscape>charsetClass","dDwWsS",C.charsetClassEscape],["charsetEscape>charsetUnicodeEscape1","u",C.charsetContent],["charsetUnicodeEscape1>charsetUnicodeEscape2",c,C.charsetContent],["charsetUnicodeEscape2>charsetUnicodeEscape3",c,C.charsetContent],["charsetUnicodeEscape3>charsetUnicodeEscape4",c,C.charsetContent],["charsetUnicodeEscape4>charsetContent",c,C.charsetUnicodeEscape],["charsetEscape>charsetHexEscape1","x",C.charsetContent],["charsetHexEscape1>charsetHexEscape2",c,C.charsetContent],["charsetHexEscape2>charsetContent",c,C.charsetHexEscape],["charsetNullChar,charsetContent>charsetRangeStart","-",C.charsetContent],["charsetRangeStart>charsetRangeEnd","^\\]",C.charsetRangeEnd],["charsetRangeEnd>charsetContent","^\\]",C.charsetContent],["charsetRangeStart>charsetRangeEndEscape","\\"],["charsetRangeEndEscape>charsetRangeEnd","^dDwWsSux0-9bB1-9",C.charsetRangeEndNormalEscape],["charsetRangeEndEscape>charsetRangeEndWithNullChar","0"],["charsetRangeEndEscape>charsetRangeEndUnicodeEscape1","u",C.charsetRangeEnd],["charsetRangeEndUnicodeEscape1>charsetRangeEndUnicodeEscape2",c,C.charsetContent],["charsetRangeEndUnicodeEscape2>charsetRangeEndUnicodeEscape3",c,C.charsetContent],["charsetRangeEndUnicodeEscape3>charsetRangeEndUnicodeEscape4",c,C.charsetContent],["charsetRangeEndUnicodeEscape4>charsetRangeEnd",c,C.charsetRangeEndUnicodeEscape],["charsetRangeEndEscape>charsetRangeEndHexEscape1","x",C.charsetRangeEnd],["charsetRangeEndHexEscape1>charsetRangeEndHexEscape2",c,C.charsetContent],["charsetRangeEndHexEscape2>charsetRangeEnd",c,C.charsetRangeEndHexEscape],["charsetRangeEndEscape>charsetRangeEndClass","dDwWsS"],["charsetNullChar,charsetRangeStart,charsetContent,charsetClass,charsetExclude,charsetRangeEnd>exact","]"]],unexpectedToken:C.unexpectedChar,unexpectedRouter:{groupQualify:"groupQualifiedStart"}},P={javascript6:{compact:!0,accepts:g.accepts,trans:g.trans.concat([["hexEscape1,hexEscape2,unicodeEscape1,unicodeEscape2,unicodeEscape3,unicodeEscape4>exact","^+*?^$.|(){[\\0-9a-fA-F",C.exact],[x+">charsetContent","^\\]0-9a-fA-F-",C.charsetContent],[x+">charsetEscape","\\"],[x+">charsetRangeStart","-",C.charsetContent],["charsetRangeEndUnicodeEscape1,charsetRangeEndHexEscape1,charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4,charsetRangeEndHexEscape2>charsetContent","^\\]0-9a-fA-F-",C.charsetContent],["charsetRangeEndHexEscape1,charsetRangeEndHexEscape2,charsetRangeEndUnicodeEscape1,charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4>charsetEscape","\\"],["charsetRangeEndHexEscape1,charsetRangeEndHexEscape2,charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4,charsetRangeEndHexEscape2>charsetRangeStart","-",C.charsetContent],[x+",charsetRangeEndHexEscape1,charsetRangeEndHexEscape2,charsetRangeEndUnicodeEscape1,charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4>exact","]"],["groupQualify>groupNamedStart","<"],["groupNamedStart,groupNamedContent>groupNamedContent","0-9a-zA-Z_",C.groupNamedContent],["groupNamedContent,groupNamedBadName>groupNamedBadName","^0-9a-zA-Z_>",C.groupNamedBadName],["groupNamedBadName>groupNamedContent","0-9a-zA-Z_",C.groupNamedContent],["groupNamedBadName,groupNamedContent>groupQualifiedStart",">"]]),unexpectedToken:C.unexpectedChar,unexpectedRouter:{groupQualify:"groupQualifiedStart"}},python:{compact:!0,accepts:g.accepts,trans:g.trans.concat([[m+","+l+">exact","^0-9a-fA-F",C.tokenIncomlpete],[m+","+l+">begin","^",C.tokenIncomlpete],[m+","+l+">repeatnStart","{",C.tokenIncomlpete],[m+","+l+">repeat0","*",C.tokenIncomlpete],[m+","+l+">repeat1","+",C.tokenIncomlpete],[m+","+l+">repeat01","?",C.tokenIncomlpete],[m+","+l+">escape","\\",C.tokenIncomlpete],[m+","+l+">groupStart","(",C.tokenIncomlpete],[m+","+l+">exact",")",C.tokenIncomlpete],[m+","+l+">choice","|",C.tokenIncomlpete],[m+","+l+">end","$",C.tokenIncomlpete],[m+","+l+">charsetStart","[",C.tokenIncomlpete],[x+">charsetContent","^\\]0-9a-fA-F-",C.tokenIncompleteCharset],[x+">charsetEscape","\\",C.tokenIncompleteCharset],[x+">charsetRangeStart","-",C.tokenIncompleteCharset],["charsetRangeEndHexEscape1,charsetRangeEndHexEscape2,charsetRangeEndUnicodeEscape1,charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4>charsetContent","^\\]0-9a-fA-F-",C.tokenIncompleteCharset],["charsetRangeEndHexEscape1,charsetRangeEndHexEscape2,charsetRangeEndUnicodeEscape1,charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4>charsetEscape","\\",C.tokenIncompleteCharset],["charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4,charsetRangeEndHexEscape2>charsetRangeStart","-",C.tokenIncompleteCharset],[x+",charsetRangeEndHexEscape1,charsetRangeEndHexEscape2,charsetRangeEndUnicodeEscape1,charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4>exact","]",C.tokenIncompleteCharset],["groupQualify>groupNamedDefined","P"],["groupNamedDefined>groupNamedStart","<"],["groupNamedStart,groupNamedContent>groupNamedContent","0-9a-zA-Z_",C.groupNamedContent],["groupNamedContent,groupNamedBadName>groupNamedBadName","^0-9a-zA-Z_>",C.groupNamedBadName],["groupNamedBadName>groupNamedContent","0-9a-zA-Z_",C.groupNamedContent],["groupNamedBadName,groupNamedContent>groupQualifiedStart",">"],["groupQualify>groupCommentContent","#",C.groupComment],["groupCommentContent>groupCommentEscape","\\"],["groupCommentEscape>groupCommentContent",")",C.groupCommentContent],["groupCommentEscape>groupCommentContent","^)",C.groupCommentContent],["groupCommentContent>groupCommentContent","^)",C.groupCommentContent],["groupCommentContent>exact",")",C.groupCommentEnd]]),unexpectedToken:C.unexpectedChar,unexpectedRouter:{groupQualify:"groupQualifiedStart"}}};return{parse:E}}