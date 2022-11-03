function RegexParser(){var a,o,r=Kit(),t={};function e(){var e=Object.keys(a).map(function(e){return e+"="+JSON.stringify(a[e])}).join(";");!function(){return this}().eval(e)}function p(e){this.raw=e.raw,this.tree=e.tree,this.groupCount=e.groupCount,this.errors=E.RegexSyntaxThrows}function E(e,a,t){E.RegexSyntaxThrows=[],o=a;var r,n,s=(r=i(t).input(e,0,a)).stack,s=S.endChoice(s),c=r.lastState;if(!r.acceptable||r.lastIndex!==e.length-1){switch(c){case"charsetRangeEndWithNullChar":n={type:"CharsetRangeEndWithNullChar",message:"Charset range end with NUL char does not make sense!\nBecause [a-\\0] is not a valid range.\nAnd [\\0-\\0] should be rewritten into [\\0]."};break;case"tokenIncomplete":n={type:"TokenIncomplete",message:"The token is not completed!"};break;case"repeatErrorFinal":n={type:"NothingRepeat",message:"Nothing to repeat!"};break;case"digitFollowNullError":n={type:"DigitFollowNullError",message:"The '\\0' represents the <NUL> char and cannot be followed by a decimal digit!"};break;case"charsetRangeEndClass":n={type:"CharsetRangeEndClass",message:'Charset range ends with class such as "\\w\\W\\d\\D\\s\\S" is invalid!'};break;case"charsetOctEscape":n={type:"DecimalEscape",message:"Decimal escape appears in charset is invalid.Because it can't be explained as  backreference.And octal escape is deprecated!"};break;default:0===c.indexOf("charset")?n={type:"UnclosedCharset",message:"Unterminated character class!"}:")"===e[r.lastIndex]?n={type:"UnmatchedParen",message:"Unmatched end parenthesis!"}:(n={type:"UnexpectedChar",message:"Unexpected char!"},r.lastIndex++)}n&&(n.lastIndex=r.lastIndex,n.lastState=c,n.indices=[r.lastIndex,r.lastIndex],E.RegexSyntaxThrows.push(n))}return a=(s=function e(a,t,r){if(a._parentGroup){var n={type:"UnterminatedGroup",message:"Unterminated group!",lastIndex:a._parentGroup.indices[0],lastState:r,indices:[a._parentGroup.indices[0],a._parentGroup.indices[0]]};E.RegexSyntaxThrows.push(n),a._parentGroup.errors||(a._parentGroup.errors=[]),a._parentGroup.errors.push(n),a=S.groupEnd(a,"",t.length,r,t)}else{if(!a._parentChoice)return a;n={type:"UnterminatedGroup",message:"Unterminated group!",lastIndex:a._parentChoice.indices[0],lastState:r,indices:[a._parentChoice.indices[0],a._parentChoice.indices[0]]},E.RegexSyntaxThrows.push(n),a._parentChoice.errors||(a._parentChoice.errors=[]),a._parentChoice.errors.push(n),a=S.endChoice(a,"",t.length,r,t)}return e(a,t,r=null)}(s,e,c)).groupCounter?s.groupCounter.i:0,delete s.groupCounter,function t(e,r,a){return e.length?(e.reduce(function(e,a){return a.indices.push(e),a.raw=r.slice(a.indices[0],e),a.type===GROUP_NODE||a.type===ASSERT_NODE&&a.sub?t(a.sub,r,a.endParenIndex):a.type===CHOICE_NODE?(a.branches.reduce(function(e,a){return t(a,r,e),((a=a[0])?a.indices[0]:e)-1},e),a.branches.reverse()):a.type===EXACT_NODE&&(a.concatTemp||(a.chars=a.chars||a.raw)),a.indices[0]},a),void e.reverse()):(e.push({type:EMPTY_NODE,indices:[a,a]}),0)}(s,e,e.length),(a=new p({raw:e,groupCount:a,tree:s=h(s)})).traverse(l,CHARSET_NODE,t),a.traverse(g,ASSERT_NODE,t),u(s),o=!1,a}function i(e="javascript6"){var a=$[e];return t.hasOwnProperty(e)?t[e]:new NFA(a)}function d(e,a,t){Object.defineProperty(e,a,{value:t,enumerable:o,writable:!0,configurable:!0})}function h(e){return e.filter(function(e){return e.type==EXACT_NODE&&e.concatTemp?(delete e.concatTemp,!!e.chars):(e.sub?e.sub=h(e.sub):e.branches&&(e.branches=e.branches.map(h)),!0)})}function u(e){function a(e){e.sub?u(e.sub):e.branches&&e.branches.map(u)}var t=e[0];a(t);for(var r,n=1,s=1,c=e.length;n<c;n++){if((r=e[n]).type===EXACT_NODE){if(t.type===EXACT_NODE&&!t.repeat&&!r.repeat){t.indices[1]=r.indices[1],t.raw+=r.raw,t.chars+=r.chars;continue}}else a(r);t=e[s++]=r}t&&(e.length=s)}function g(e,a){var t;e.repeat&&"python"!=a&&(t="Nothing to repeat! Repeat after assertion doesn't make sense!","AssertLookahead"!==(a=e.assertionType)&&"AssertNegativeLookahead"!==a||(t+="\n/a"+(a="("+("AssertLookahead"===a?"?=":"?!")+"b)")+"+/、/a"+a+"{1,n}/ are the same as /a"+a+"/。\n/a"+a+"*/、/a"+a+"{0,n}/、/a"+a+"?/ are the same as /a/。"),t={type:"NothingRepeat",lastIndex:e.indices[1]-1,message:t,indices:e.indices},E.RegexSyntaxThrows.push(t),e.errors||(e.errors=[]),e.push(t))}function l(t,e){t.ranges=r.sortUnique(t.ranges.map(function(e){var a;return e[0]>e[1]&&(a={type:"OutOfOrder",lastIndex:e.lastIndex,message:"Range ["+e.join("-")+"] out of order in character class!",indices:t.indices},E.RegexSyntaxThrows.push(a),t.errors||(t.errors=[]),t.errors.push(a)),e.join("")}))}function n(e){this.name="RegexSyntaxError",this.type=e.type,this.lastIndex=e.lastIndex,this.lastState=e.lastState,this.lastStack=e.lastStack,this.message=e.message,Object.defineProperty(this,"stack",{value:new Error(e.message).stack,enumerable:!1})}a={ASSERT_NODE:"assert",BACKREF_NODE:"backref",CHARSET_NODE:"charset",CHOICE_NODE:"choice",DOT_NODE:"dot",EMPTY_NODE:"empty",EXACT_NODE:"exact",GROUP_NODE:"group",HEXADECIMAL_NODE:"hexadecimal",UNICODE_NODE:"unicode",OCTAL_NODE:"octal",GROUP_COMMENT:"comment",UNEXPECTED_NODE:"unexpected",AssertLookahead:"AssertLookahead",AssertNegativeLookahead:"AssertNegativeLookahead",AssertNonWordBoundary:"AssertNonWordBoundary",AssertWordBoundary:"AssertWordBoundary",AssertEnd:"AssertEnd",AssertBegin:"AssertBegin"},e(),p.prototype.traverse=function(e,n,a){!function a(e,t,r){e.forEach(function(e){n&&e.type!==n||t(e,r),e.sub?a(e.sub,t,r):e.branches&&e.branches.forEach(function(e){a(e,t,r)})})}(this.tree,e,a)},E.Constants=a,E.exportConstants=e,E.RegexSyntaxError=n,E.RegexSyntaxThrows=[],E.getNFAParser=i,n.prototype.toString=function(){return this.name+" "+this.type+":"+this.message};var s={n:"\n",r:"\r",t:"\t",v:"\v",f:"\f"},c="0-9a-fA-F",m="repeatnStart,repeatn_1,repeatn_2,repeatnErrorStart,repeatnError_1,repeatnError_2",x="hexEscape1,hexEscape2",C="unicodeEscape1,unicodeEscape2,unicodeEscape3,unicodeEscape4",f="charsetUnicodeEscape1,charsetUnicodeEscape2,charsetUnicodeEscape3,charsetUnicodeEscape4,charsetHexEscape1,charsetHexEscape2",S={escapeStart:U,exact:R,dot:y,nullChar:function(e,a,t){e.unshift({id:Math.random().toString(36).substr(2,9),type:EXACT_NODE,chars:"\0",indices:[t-1]})},assertBegin:N,assertEnd:_,assertWordBoundary:function(e,a,t){e.unshift({id:Math.random().toString(36).substr(2,9),type:ASSERT_NODE,indices:[t-1],assertionType:"b"==a?AssertWordBoundary:AssertNonWordBoundary})},repeatnStart:k,repeatnComma:function(e,a,t){d(e[0],"_commaIndex",t)},repeatNonGreedy:function(e){let a=e[0];a.type===GROUP_COMMENT&&(a=e[1]),a.repeat.nonGreedy=!0,a.repeat.raw=`${a.repeat.raw}?`},repeatnEnd:function(e,a,t,r,n){let s,c=e[0];var o=n.lastIndexOf("{",t),p=parseInt(n.slice(o+1,c._commaIndex||t),10);c._commaIndex?((s=c._commaIndex+1==t?1/0:parseInt(n.slice(c._commaIndex+1,t),10))<p&&(E.RegexSyntaxThrows.push(r={type:"OutOfOrder",lastState:r,lastIndex:t,indices:[o,t],message:"Numbers out of order in {} quantifier!"}),c.errors||(c.errors=[]),c.errors.push(r)),delete c._commaIndex):s=p,t=n.substr(o,t-o+1),c.indices[0]>=o&&e.shift(),T(e,p,s,o,t,n)},repeat1ToInf:b,repeat0To1:O,repeat0ToInf:I,charClassEscape:function(e,a,t){e.unshift({id:Math.random().toString(36).substr(2,9),type:CHARSET_NODE,indices:[t-1],chars:"",ranges:[],classes:[a],exclude:!1})},normalEscape:function(e,a,t){s.hasOwnProperty(a)&&(a=s[a]),e.unshift({id:Math.random().toString(36).substr(2,9),type:EXACT_NODE,chars:a,indices:[t-1]})},unicodeEscape:function(e,a,t,r,n){a=String.fromCharCode(parseInt(n.slice(t-3,t+1),16)),e.shift(),e.unshift({id:Math.random().toString(36).substr(2,9),type:UNICODE_NODE,chars:a,indices:[t-5]})},hexEscape:function(e,a,t,r,n){a=String.fromCharCode(parseInt(n[t-1]+a,16)),e.shift(),e.unshift({id:Math.random().toString(36).substr(2,9),type:HEXADECIMAL_NODE,chars:a,indices:[t-3]})},groupStart:w,groupNonCapture:function(e){var a=e._parentGroup;a.nonCapture=!0,a.num=void 0,e.groupCounter.i--},groupNamedContent:function(e,a){e._parentGroup.name+=a},groupNamedBadName:function(e,a,t,r,n,s){E.RegexSyntaxThrows.push(t={type:"GroupBadName",lastIndex:t,lastState:r,message:`The group name cannot has the char "${a}"`,indices:[t,t]}),(e=e._parentGroup).name+=a,e.errors||(e.errors=[]),e.errors.push(t)},groupComment:function(e){var a=e._parentGroup;a.num=void 0,e.groupCounter.i--,a.type=GROUP_COMMENT,a.comment="",delete a.sub},groupCommentContent:function(e,a,t){e._parentGroup.comment+=a},groupCommentEnd:function(e,a,t,r,n,s){var c=e._parentGroup;return delete e._parentGroup,delete e.groupCounter,e=c._parentStack,delete c._parentStack,e.unshift(c),c.endParenIndex=t,e},backref:function(e,a,t,r){var n=e[0],s=parseInt(a,10),a=(a=e.groupCounter)&&a.i||0;"escape"===r?(n={id:Math.random().toString(36).substr(2,9),type:BACKREF_NODE,indices:[t-1]},e.unshift(n)):s=parseInt(n.num+""+s,10),a<s&&(E.RegexSyntaxThrows.push(a={type:"InvalidBackReference",lastIndex:t,lastState:r,message:"Back reference number("+s+") greater than current groups count("+a+").",indices:[t-1,t]}),n.errors||(n.errors=[]),n.errors.push(a)),function e(a,t){return!!t._parentGroup&&(t._parentGroup.num==a?a:e(a,t._parentGroup._parentStack))}(s,e)&&(E.RegexSyntaxThrows.push(t={type:"InvalidBackReference",lastIndex:t,lastState:r,message:"Recursive back reference in group ("+s+") itself.",indices:[t,t]}),n.errors||(n.errors=[]),n.errors.push(t)),n.num=s},groupToAssertion:function(e,a,t){var r=e._parentGroup;r.type=ASSERT_NODE,r.assertionType="="==a?AssertLookahead:AssertNegativeLookahead,r.num=void 0,e.groupCounter.i--},groupEnd:A,choice:D,endChoice:v,charsetStart:B,charsetExclude:function(e){e[0].exclude=!0},charsetContent:G,charsetNullChar:function(e,a,t){e[0].chars+="\0",e[0].tokens.push({type:"escape",indices:[t-1,t+1],raw:"\\0"})},charsetClassEscape:function(e,a,t){e[0].classes.push(a),e[0].tokens.push({type:"shorthand",indices:[t-1,t+1],raw:`\\${a}`})},charsetHexEscape:function(e,a,t,r,n){var s=e[0],e=s.chars.slice(-1)+a,a=String.fromCharCode(parseInt(e,16));s.chars=s.chars.slice(0,-2),s.chars+=a,s.tokens=s.tokens.slice(2),s.tokens.push({type:"char-hexadecimal",escaped:a,indices:[t-3,t+1],raw:`\\x${e}`})},charsetUnicodeEscape:function(e,a,t,r,n){var s=e[0],e=s.chars.slice(-3)+a,a=String.fromCharCode(parseInt(e,16));s.chars=s.chars.slice(0,-4),s.chars+=a,s.tokens=s.tokens.slice(4),s.tokens.push({type:"char-unicode",escaped:a,indices:[t-5,t+1],raw:`\\u${e}`})},charsetRangeEnd:H,charsetNormalEscape:function(e,a,t){e[0].tokens.push({type:"escape",indices:[t-1,t+1],raw:`\\${a}`}),s.hasOwnProperty(a)&&(a=s[a]),e[0].chars+=a},charsetRangeEndNormalEscape:function(e,a,t,r,n){if(s.hasOwnProperty(a))return H(e,a=s[a],t,0,0,lastEscaped=!0)},charsetRangeEndUnicodeEscape:function(e,a,t){let r=e[0];var n=r.chars.slice(-3)+a;r.chars=r.chars.slice(0,-3);var s=r.ranges.pop();a=String.fromCharCode(parseInt(n,16)),(s=[s[0],a]).lastIndex=t,r.ranges.push(s),s=(e=r.tokens.slice(-4)[0]).range[0],n={type:"char",escaped:a,indices:[t-5,t+1],raw:`\\u${n}`},r.tokens=r.tokens.slice(0,-4),r.tokens.push({type:"range",range:[s,n],indices:[e.indices[0],t+1],raw:`${s.raw}-${n.raw}`})},charsetRangeEndHexEscape:function(e,a,t){var r=e[0],n=r.chars.slice(-1)+a;r.chars=r.chars.slice(0,-1);var s=r.ranges.pop();a=String.fromCharCode(parseInt(n,16)),(s=[s[0],a]).lastIndex=t,r.ranges.push(s),s=(e=r.tokens.slice(-2)[0]).range[0],n={type:"char",escaped:a,indices:[t-3,t+1],raw:`\\x${n}`},r.tokens=r.tokens.slice(0,-2),r.tokens.push({type:"range",range:[s,n],indices:[e.indices[0],t+1],raw:`${s.raw}-${n.raw}`})},tokenIncomlpete:function(e,a,t,r,n){let s=R;var c,o,p,i,d,h,u,g={"+":b,"*":I,"?":O,"^":N,$:_,".":y,"|":D,"(":w,")":A,"{":k,"[":B,"\\":U};return a in g&&(s=g[a]),-1!==x.split(",").indexOf(r)?(c=e,o=a,d=t,h=r,u=n,p=s,i=u.slice(0,d).lastIndexOf("\\x")+1,E.RegexSyntaxThrows.push(g={type:"TokenIncomplete",lastIndex:i,lastState:h,message:"The hexadecimal escaped char is incomplete!",indices:[d,d]}),c.unshift({id:Math.random().toString(36).substr(2,9),type:HEXADECIMAL_NODE,chars:u.slice(i+1,d),indices:[i-1],errors:[g]}),p(c,o,d,h,u)):-1!==C.split(",").indexOf(r)?(d=e,h=a,u=t,e=r,a=n,t=s,r=a.slice(0,u).lastIndexOf("\\u")+1,E.RegexSyntaxThrows.push(n={type:"TokenIncomplete",lastIndex:[r,u],lastState:e,message:"The unicode escaped char is incomplete!"}),d.unshift({id:Math.random().toString(36).substr(2,9),type:UNICODE_NODE,chars:a.slice(r+1,u),indices:[r-1],errors:[n]}),t(d,h,u,e,a)):void 0},tokenIncompleteCharset:function(p,e,i,d,h){let a=G;e in(r={"]":void 0,"\\":void 0})&&(a=r[e]);var t=(e,a)=>{var t=h.slice(0,i).lastIndexOf(`\\${e}`)+1,e=i-t;E.RegexSyntaxThrows.push(t={type:"TokenIncomplete",lastIndex:t,lastState:d,message:`The ${a} escaped char is incomplete!`,indices:[t,i]}),p[0].errors||(p[0].errors=[]),p[0].errors.push(t),(t=p[0].chars.slice(p[0].chars.length-e).slice(1))&&(p[0].chars=p[0].chars.slice(0,-e)),p[0].chars+=t;let r=p[0].tokens[p[0].tokens.length-1-(e-1)];r.type=`char-${a}`,r.indices=[r.indices[0]-1,r.indices[1]],r.raw=`\\${r.raw}`},r=(e,a)=>{let t=p[0];var r=h.slice(0,i).lastIndexOf(`\\${e}`)+1,n=i-r,s=t.chars.slice(t.chars.length-n).slice(1);""!==s&&(t.chars=t.chars.slice(0,-s.length));var c=t.ranges.pop();t.chars+=c[0],t.chars+=s,s={type:"InvalidRange",lastIndex:r-2,lastState:d,message:`The right ${a} escaped token is invalid!`,indices:[r,r-2]},r={type:"TokenIncomplete",lastIndex:r,lastState:d,message:`The ${a} escaped char is incomplete!`,indices:[r,r]},E.RegexSyntaxThrows.push(s),E.RegexSyntaxThrows.push(r),p[0].errors||(p[0].errors=[]),p[0].errors.push(s),p[0].errors.push(r);let o=p[0].tokens[p[0].tokens.length-1-(n-1)];o.range[1].type=`char-${a}`,o.range[1].indices=[o.range[1].indices[0]-1,o.range[1].indices[1]],o.range[1].raw=`\\${e}`,o.raw=`${o.range[0].raw}-${o.range[1].raw}`};if(-1!==["charsetHexEscape1","charsetHexEscape2"].indexOf(d)&&t("x","hexadecimal"),-1!==["charsetUnicodeEscape1","charsetUnicodeEscape2","charsetUnicodeEscape3","charsetUnicodeEscape4"].indexOf(d)&&t("u","unicode"),-1!==["charsetRangeEndUnicodeEscape1","charsetRangeEndUnicodeEscape2","charsetRangeEndUnicodeEscape3","charsetRangeEndUnicodeEscape4"].indexOf(d)&&r("u","unicode"),-1!==["charsetRangeEndHexEscape1","charsetRangeEndHexEscape2"].indexOf(d)&&r("x","hexadecimal"),a)return a(p,e,i,d,h)},unexpectedChar:function(e,a,t,r,n){e[0],a={type:"UnexpectedChar",lastIndex:t,lastState:r,message:`Unexpected character ${a}!`,indices:[t,t]},e.unshift({id:Math.random().toString(36).substr(2,9),type:UNEXPECTED_NODE,indices:[t],errors:[a]}),E.RegexSyntaxThrows.push(a)}};function R(e,a,t){var r=e[0];(!r||r.type!=EXACT_NODE||r.repeat||r.chars&&!r.concatTemp)&&e.unshift({id:Math.random().toString(36).substr(2,9),type:EXACT_NODE,indices:[t]}),r&&r.concatTemp&&(r.chars+=a)}function y(e,a,t){e.unshift({id:Math.random().toString(36).substr(2,9),type:DOT_NODE,indices:[t]})}function N(e,a,t){e.unshift({id:Math.random().toString(36).substr(2,9),type:ASSERT_NODE,indices:[t],assertionType:AssertBegin})}function _(e,a,t,r,n){e.unshift({id:Math.random().toString(36).substr(2,9),type:ASSERT_NODE,indices:[t],assertionType:AssertEnd})}function k(e,a,t){e[0].type!==EXACT_NODE&&e.unshift({id:Math.random().toString(36).substr(2,9),type:EXACT_NODE,indices:[t]})}function I(e,a,t,r,n){T(e,0,1/0,t,a,n)}function O(e,a,t,r,n){T(e,0,1,t,a,n)}function b(e,a,t,r,n){T(e,1,1/0,t,a,n)}function T(a,e,t,r,n,s){let c=a[0],o=!1;c.type===GROUP_COMMENT&&(c=a[1],o=!0),t={min:e,max:t,nonGreedy:!1};let p=r-1;if(c.chars&&1===c.chars.length&&(p=c.indices[0]),c.type===EXACT_NODE){let e;o&&(e=a.shift(),p=e.indices[0]-1),s={id:Math.random().toString(36).substr(2,9),type:EXACT_NODE,repeat:t,chars:c.chars||s[p],indices:[p]},c.indices[0]===p&&a.shift(),a.unshift(s),c=a[0],o&&(a.unshift(e),s.errors=e.errors)}else c.repeat=t;d(t,"raw",n),d(t,"beginIndex",r-c.indices[0]),d(t,"beginAbsIndex",r),o&&d(c,"commentRepeatId",a[0].id)}function U(e,a,t){e.unshift({concatTemp:!0,id:Math.random().toString(36).substr(2,9),type:EXACT_NODE,chars:"",indices:[t]})}function w(e,a,t){var r=e.groupCounter=e.groupCounter||{i:0};return r.i++,d(e=(t={id:Math.random().toString(36).substr(2,9),type:GROUP_NODE,name:"",num:r.i,sub:[],indices:[t],_parentStack:e}).sub,"_parentGroup",t),e.groupCounter=r,e}function A(e,a,t,r,n){var s=(e=v(e))._parentGroup;return s?(delete e._parentGroup,delete e.groupCounter,e=s._parentStack,delete s._parentStack,e.unshift(s),s.endParenIndex=t):(E.RegexSyntaxThrows.push(t={type:"UnexpectedChar",lastIndex:t,lastState:r,message:"Unexpected end parenthesis!",indices:[t,t]}),e[0].errors||(e[0].errors=[]),e[0].errors.push(t)),e}function D(e,a,t){var r,n,s=[];return e._parentChoice?((n=e._parentChoice).branches.unshift(s),d(s,"_parentChoice",n),d(s,"_parentGroup",n),s.groupCounter=e.groupCounter,delete e._parentChoice,delete e.groupCounter):(r=e[e.length-1],d(n={id:Math.random().toString(36).substr(2,9),type:CHOICE_NODE,indices:[r?r.indices[0]:t-1],branches:[]},"_parentStack",e),n.branches.unshift(e.slice()),e.length=0,e.unshift(n),s.groupCounter=e.groupCounter,d(s,"_parentChoice",n),d(s,"_parentGroup",n),n.branches.unshift(s)),s}function v(e){if(e._parentChoice){var a=e._parentChoice;delete e._parentChoice,delete e._parentGroup,delete e.groupCounter;var t=a._parentStack;return delete a._parentStack,t}return e}function B(e,a,t){e.unshift({id:Math.random().toString(36).substr(2,9),type:CHARSET_NODE,indices:[t],classes:[],ranges:[],tokens:[],chars:""})}function G(e,a,t){e[0].chars+=a,e[0].tokens.push({type:"char",indices:[t,t+1],raw:a})}function H(e,a,t,r,n,s=!1){let c=e[0],o=c.chars.slice(-2);o=[o[0],a],o.lastIndex=t,c.ranges.push(o),c.chars=c.chars.slice(0,-2),e=c.tokens.slice(-2)[0],a={type:"char",indices:[s?t-1:t,t+1],raw:s?a.replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t").replace(/(\v)/g,"\\v").replace(/(\f)/g,"\\f"):a},c.tokens=c.tokens.slice(0,-2),c.tokens.push({type:"range",range:[e,a],indices:[e.indices[0],t+1],raw:`${e.raw}-${a.raw}`})}var $={javascript6:{compact:!0,accepts:(c={compact:!0,accepts:"start,begin,end,repeat0,repeat1,exact,repeatn,repeat01,repeatNonGreedy,choice,"+m+",nullChar,digitBackref",trans:[["start,begin,end,exact,repeatNonGreedy,repeat0,repeat1,repeat01,groupStart,groupQualifiedStart,choice,repeatn>exact","^+*?^$.|(){[\\",S.exact],["nullChar>exact","^+*?^$.|(){[\\0-9",S.exact],[m+",nullChar,digitBackref,start,begin,end,exact,repeatNonGreedy,repeat0,repeat1,repeat01,groupStart,groupQualifiedStart,choice,repeatn>exact",".",S.dot],["start,groupStart,groupQualifiedStart,end,begin,exact,repeat0,repeat1,repeat01,repeatn,repeatNonGreedy,choice,"+m+",nullChar,digitBackref>begin","^",S.assertBegin],[m+",nullChar,digitBackref,exact>repeatnStart","{",S.repeatnStart],["start,begin,end,groupQualifiedStart,groupStart,repeat0,repeat1,repeatn,repeat01,repeatNonGreedy,choice>repeatnErrorStart","{",S.exact],["repeatnStart>repeatn_1","0-9",S.exact],["repeatn_1>repeatn_1","0-9",S.exact],["repeatn_1>repeatn_2",",",S.repeatnComma],["repeatn_2>repeatn_2","0-9",S.exact],["repeatn_1,repeatn_2>repeatn","}",S.repeatnEnd],["repeatnStart,repeatnErrorStart>exact","}",S.exact],["repeatnStart,repeatnErrorStart>exact","^+*?^$.|(){[\\0-9}",S.exact],["repeatnErrorStart>repeatnError_1","0-9",S.exact],["repeatnError_1>repeatnError_1","0-9",S.exact],["repeatnError_1>repeatnError_2",",",S.exact],["repeatnError_2>repeatnError_2","0-9",S.exact],["repeatnError_2,repeatnError_1>repeatErrorFinal","}"],["repeatn_1,repeatnError_1>exact","^+*?^$.|(){[\\0-9,}",S.exact],["repeatn_2,repeatnError_2>exact","^+*?^$.|(){[\\0-9}",S.exact],["exact,"+m+",nullChar,digitBackref>repeat0","*",S.repeat0ToInf],["exact,"+m+",nullChar,digitBackref>repeat1","+",S.repeat1ToInf],["exact,"+m+",nullChar,digitBackref>repeat01","?",S.repeat0To1],["choice>repeatErrorFinal","*+?"],["repeatErrorFinal>exact",""],["repeat0,repeat1,repeat01,repeatn>repeatNonGreedy","?",S.repeatNonGreedy],["repeat0,repeat1,repeat01,repeatn>repeatErrorFinal","+*"],["start,begin,end,groupStart,groupQualifiedStart,exact,repeatNonGreedy,repeat0,repeat1,repeat01,repeatn,choice,"+m+",nullChar,digitBackref>escape","\\",S.escapeStart],["escape>nullChar","0",S.nullChar],["nullChar>digitFollowNullError","0-9"],["escape>exact","^dDwWsSux0-9bB1-9",S.normalEscape],["escape>exact","bB",S.assertWordBoundary],["escape>exact","dDwWsS",S.charClassEscape],["escape>unicodeEscape1","u",S.exact],["unicodeEscape1>unicodeEscape2",c,S.exact],["unicodeEscape2>unicodeEscape3",c,S.exact],["unicodeEscape3>unicodeEscape4",c,S.exact],["unicodeEscape4>exact",c,S.unicodeEscape],["escape>hexEscape1","x",S.exact],["hexEscape1>hexEscape2",c,S.exact],["hexEscape2>exact",c,S.hexEscape],["escape>digitBackref","1-9",S.backref],["digitBackref>digitBackref","0-9",S.backref],["digitBackref>exact","^+*?^$.|(){[\\0-9",S.exact],["exact,begin,end,repeat0,repeat1,repeat01,repeatn,repeatNonGreedy,start,groupStart,groupQualifiedStart,choice,"+m+",nullChar,digitBackref>groupStart","(",S.groupStart],["groupStart>groupQualify","?"],["groupQualify>groupQualifiedStart",":",S.groupNonCapture],["groupQualify>groupQualifiedStart","=",S.groupToAssertion],["groupQualify>groupQualifiedStart","!",S.groupToAssertion],[m+",nullChar,digitBackref,groupStart,groupQualifiedStart,begin,end,exact,repeat1,repeat0,repeat01,repeatn,repeatNonGreedy,choice>exact",")",S.groupEnd],["start,begin,end,groupStart,groupQualifiedStart,exact,repeat0,repeat1,repeat01,repeatn,repeatNonGreedy,choice,"+m+",nullChar,digitBackref>choice","|",S.choice],["start,groupStart,groupQualifiedStart,begin,end,exact,repeat0,repeat1,repeat01,repeatn,repeatNonGreedy,choice,"+m+",nullChar,digitBackref>end","$",S.assertEnd],["exact,begin,end,repeat0,repeat1,repeat01,repeatn,repeatNonGreedy,groupQualifiedStart,groupStart,start,choice,"+m+",nullChar,digitBackref>charsetStart","[",S.charsetStart],["charsetStart>charsetExclude","^",S.charsetExclude],["charsetStart>charsetContent","^\\]^",S.charsetContent],["charsetExclude>charsetContent","^\\]",S.charsetContent],["charsetContent,charsetClass>charsetContent","^\\]-",S.charsetContent],["charsetClass>charsetContent","-",S.charsetContent],["charsetStart,charsetContent,charsetNullChar,charsetClass,charsetExclude,charsetRangeEnd>charsetEscape","\\"],["charsetEscape>charsetContent","^dDwWsSux0-9",S.charsetNormalEscape],["charsetEscape>charsetNullChar","0",S.charsetNullChar],["charsetEscape>charsetOctEscape","1-9"],["charsetRangeEndEscape>charsetOctEscape","1-9"],["charsetNullChar>digitFollowNullError","0-9"],["charsetNullChar>charsetContent","^0-9\\]-",S.charsetContent],["charsetEscape>charsetClass","dDwWsS",S.charsetClassEscape],["charsetEscape>charsetUnicodeEscape1","u",S.charsetContent],["charsetUnicodeEscape1>charsetUnicodeEscape2",c,S.charsetContent],["charsetUnicodeEscape2>charsetUnicodeEscape3",c,S.charsetContent],["charsetUnicodeEscape3>charsetUnicodeEscape4",c,S.charsetContent],["charsetUnicodeEscape4>charsetContent",c,S.charsetUnicodeEscape],["charsetEscape>charsetHexEscape1","x",S.charsetContent],["charsetHexEscape1>charsetHexEscape2",c,S.charsetContent],["charsetHexEscape2>charsetContent",c,S.charsetHexEscape],["charsetNullChar,charsetContent>charsetRangeStart","-",S.charsetContent],["charsetRangeStart>charsetRangeEnd","^\\]",S.charsetRangeEnd],["charsetRangeEnd>charsetContent","^\\]",S.charsetContent],["charsetRangeStart>charsetRangeEndEscape","\\"],["charsetRangeEndEscape>charsetRangeEnd","^dDwWsSux0-9bB1-9",S.charsetRangeEndNormalEscape],["charsetRangeEndEscape>charsetRangeEndWithNullChar","0"],["charsetRangeEndEscape>charsetRangeEndUnicodeEscape1","u",S.charsetRangeEnd],["charsetRangeEndUnicodeEscape1>charsetRangeEndUnicodeEscape2",c,S.charsetContent],["charsetRangeEndUnicodeEscape2>charsetRangeEndUnicodeEscape3",c,S.charsetContent],["charsetRangeEndUnicodeEscape3>charsetRangeEndUnicodeEscape4",c,S.charsetContent],["charsetRangeEndUnicodeEscape4>charsetRangeEnd",c,S.charsetRangeEndUnicodeEscape],["charsetRangeEndEscape>charsetRangeEndHexEscape1","x",S.charsetRangeEnd],["charsetRangeEndHexEscape1>charsetRangeEndHexEscape2",c,S.charsetContent],["charsetRangeEndHexEscape2>charsetRangeEnd",c,S.charsetRangeEndHexEscape],["charsetRangeEndEscape>charsetRangeEndClass","dDwWsS"],["charsetNullChar,charsetRangeStart,charsetContent,charsetClass,charsetExclude,charsetRangeEnd>exact","]"]],unexpectedToken:S.unexpectedChar,unexpectedRouter:{groupQualify:"groupQualifiedStart"}}).accepts,trans:c.trans.concat([["hexEscape1,hexEscape2,unicodeEscape1,unicodeEscape2,unicodeEscape3,unicodeEscape4>exact","^+*?^$.|(){[\\0-9a-fA-F",S.exact],[f+">charsetContent","^\\]0-9a-fA-F-",S.charsetContent],[f+">charsetEscape","\\"],[f+">charsetRangeStart","-",S.charsetContent],["charsetRangeEndUnicodeEscape1,charsetRangeEndHexEscape1,charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4,charsetRangeEndHexEscape2>charsetContent","^\\]0-9a-fA-F-",S.charsetContent],["charsetRangeEndHexEscape1,charsetRangeEndHexEscape2,charsetRangeEndUnicodeEscape1,charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4>charsetEscape","\\"],["charsetRangeEndHexEscape1,charsetRangeEndHexEscape2,charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4,charsetRangeEndHexEscape2>charsetRangeStart","-",S.charsetContent],[f+",charsetRangeEndHexEscape1,charsetRangeEndHexEscape2,charsetRangeEndUnicodeEscape1,charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4>exact","]"],["groupQualify>groupNamedStart","<"],["groupNamedStart,groupNamedContent>groupNamedContent","0-9a-zA-Z_",S.groupNamedContent],["groupNamedContent,groupNamedBadName>groupNamedBadName","^0-9a-zA-Z_>",S.groupNamedBadName],["groupNamedBadName>groupNamedContent","0-9a-zA-Z_",S.groupNamedContent],["groupNamedBadName,groupNamedContent>groupQualifiedStart",">"]]),unexpectedToken:S.unexpectedChar,unexpectedRouter:{groupQualify:"groupQualifiedStart"}},python:{compact:!0,accepts:c.accepts,trans:c.trans.concat([[C+","+x+">exact","^0-9a-fA-F",S.tokenIncomlpete],[C+","+x+">begin","^",S.tokenIncomlpete],[C+","+x+">repeatnStart","{",S.tokenIncomlpete],[C+","+x+">repeat0","*",S.tokenIncomlpete],[C+","+x+">repeat1","+",S.tokenIncomlpete],[C+","+x+">repeat01","?",S.tokenIncomlpete],[C+","+x+">escape","\\",S.tokenIncomlpete],[C+","+x+">groupStart","(",S.tokenIncomlpete],[C+","+x+">exact",")",S.tokenIncomlpete],[C+","+x+">choice","|",S.tokenIncomlpete],[C+","+x+">end","$",S.tokenIncomlpete],[C+","+x+">charsetStart","[",S.tokenIncomlpete],[f+">charsetContent","^\\]0-9a-fA-F-",S.tokenIncompleteCharset],[f+">charsetEscape","\\",S.tokenIncompleteCharset],[f+">charsetRangeStart","-",S.tokenIncompleteCharset],["charsetRangeEndHexEscape1,charsetRangeEndHexEscape2,charsetRangeEndUnicodeEscape1,charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4>charsetContent","^\\]0-9a-fA-F-",S.tokenIncompleteCharset],["charsetRangeEndHexEscape1,charsetRangeEndHexEscape2,charsetRangeEndUnicodeEscape1,charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4>charsetEscape","\\",S.tokenIncompleteCharset],["charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4,charsetRangeEndHexEscape2>charsetRangeStart","-",S.tokenIncompleteCharset],[f+",charsetRangeEndHexEscape1,charsetRangeEndHexEscape2,charsetRangeEndUnicodeEscape1,charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4>exact","]",S.tokenIncompleteCharset],["groupQualify>groupNamedDefined","P"],["groupNamedDefined>groupNamedStart","<"],["groupNamedStart,groupNamedContent>groupNamedContent","0-9a-zA-Z_",S.groupNamedContent],["groupNamedContent,groupNamedBadName>groupNamedBadName","^0-9a-zA-Z_>",S.groupNamedBadName],["groupNamedBadName>groupNamedContent","0-9a-zA-Z_",S.groupNamedContent],["groupNamedBadName,groupNamedContent>groupQualifiedStart",">"],["groupQualify>groupCommentContent","#",S.groupComment],["groupCommentContent>groupCommentEscape","\\"],["groupCommentEscape>groupCommentContent",")",S.groupCommentContent],["groupCommentEscape>groupCommentContent","^)",S.groupCommentContent],["groupCommentContent>groupCommentContent","^)",S.groupCommentContent],["groupCommentContent>exact",")",S.groupCommentEnd]]),unexpectedToken:S.unexpectedChar,unexpectedRouter:{groupQualify:"groupQualifiedStart"}}};return E}
