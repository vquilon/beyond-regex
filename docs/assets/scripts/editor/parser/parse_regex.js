function RegexParser(){var t,o,a,r=Kit();function e(){var e=Object.keys(t).map(function(e){return e+"="+JSON.stringify(t[e])}).join(";");!function(){return this}().eval(e)}function p(e){this.raw=e.raw,this.tree=e.tree,this.groupCount=e.groupCount}function n(e,t,a){var r;o=t;var n,s=(r=i(a).input(e,0,t)).stack,s=l.endChoice(s),c=r.lastState;if(!(t=r.acceptable&&r.lastIndex===e.length-1)){switch(c){case"charsetRangeEndWithNullChar":n={type:"CharsetRangeEndWithNullChar",message:"Charset range end with NUL char does not make sense!\nBecause [a-\\0] is not a valid range.\nAnd [\\0-\\0] should be rewritten into [\\0]."};break;case"repeatErrorFinal":n={type:"NothingRepeat",message:"Nothing to repeat!"};break;case"digitFollowNullError":n={type:"DigitFollowNullError",message:"The '\\0' represents the <NUL> char and cannot be followed by a decimal digit!"};break;case"charsetRangeEndClass":n={type:"CharsetRangeEndClass",message:'Charset range ends with class such as "\\w\\W\\d\\D\\s\\S" is invalid!'};break;case"charsetOctEscape":n={type:"DecimalEscape",message:"Decimal escape appears in charset is invalid.Because it can't be explained as  backreference.And octal escape is deprecated!"};break;default:0===c.indexOf("charset")?n={type:"UnclosedCharset",message:"Unterminated character class!"}:")"===e[r.lastIndex]?n={type:"UnmatchedParen",message:"Unmatched end parenthesis!"}:(n={type:"UnexpectedChar",message:"Unexpected char!"},r.lastIndex++)}if(n)throw n.lastIndex=r.lastIndex,n.lastStack=r.stack,n.lastState=c,new g(n)}if(s._parentGroup)throw new g({type:"UnterminatedGroup",message:"Unterminated group!",lastIndex:s._parentGroup.indices[0],lastState:c,lastStack:s});if(t)return t=s.groupCounter?s.groupCounter.i:0,delete s.groupCounter,function a(e,r,t){return e.length?(e.reduce(function(e,t){return t.indices.push(e),t.raw=r.slice(t.indices[0],e),t.type===GROUP_NODE||t.type===ASSERT_NODE&&t.sub?a(t.sub,r,t.endParenIndex):t.type===CHOICE_NODE?(t.branches.reduce(function(e,t){return a(t,r,e),((t=t[0])?t.indices[0]:e)-1},e),t.branches.reverse()):t.type===EXACT_NODE&&(t.concatTemp||(t.chars=t.chars||t.raw)),t.indices[0]},t),void e.reverse()):(e.push({type:EMPTY_NODE,indices:[t,t]}),0)}(s,e,e.length),(t=new p({raw:e,groupCount:t,tree:s=h(s)})).traverse(E,CHARSET_NODE,a),t.traverse(u,ASSERT_NODE,a),d(s),o=!1,t}function i(e="javascript6"){return e=R[e],a=a||new NFA(e)}function c(e,t,a){Object.defineProperty(e,t,{value:a,enumerable:o,writable:!0,configurable:!0})}function h(e){return e.filter(function(e){return e.type==EXACT_NODE&&e.concatTemp?(delete e.concatTemp,!!e.chars):(e.sub?e.sub=h(e.sub):e.branches&&(e.branches=e.branches.map(h)),!0)})}function d(e){function t(e){e.sub?d(e.sub):e.branches&&e.branches.map(d)}var a=e[0];t(a);for(var r,n=1,s=1,c=e.length;n<c;n++){if((r=e[n]).type===EXACT_NODE){if(a.type===EXACT_NODE&&!a.repeat&&!r.repeat){a.indices[1]=r.indices[1],a.raw+=r.raw,a.chars+=r.chars;continue}}else t(r);a=e[s++]=r}a&&(e.length=s)}function u(e,t){if(e.repeat&&"python"!=t){var a=e.assertionType,t="Nothing to repeat! Repeat after assertion doesn't make sense!";throw"AssertLookahead"!==a&&"AssertNegativeLookahead"!==a||(t+="\n/a"+(a="("+("AssertLookahead"===a?"?=":"?!")+"b)")+"+/、/a"+a+"{1,n}/ are the same as /a"+a+"/。\n/a"+a+"*/、/a"+a+"{0,n}/、/a"+a+"?/ are the same as /a/。"),new g({type:"NothingRepeat",lastIndex:e.indices[1]-1,message:t})}}function E(e,t){e.ranges=r.sortUnique(e.ranges.map(function(e){if(e[0]>e[1])throw new g({type:"OutOfOrder",lastIndex:e.lastIndex,message:"Range ["+e.join("-")+"] out of order in character class!"});return e.join("")}))}function g(e){this.name="RegexSyntaxError",this.type=e.type,this.lastIndex=e.lastIndex,this.lastState=e.lastState,this.lastStack=e.lastStack,this.message=e.message,Object.defineProperty(this,"stack",{value:new Error(e.message).stack,enumerable:!1})}t={EXACT_NODE:"exact",CHARSET_NODE:"charset",CHOICE_NODE:"choice",GROUP_NODE:"group",ASSERT_NODE:"assert",DOT_NODE:"dot",BACKREF_NODE:"backref",EMPTY_NODE:"empty",AssertLookahead:"AssertLookahead",AssertNegativeLookahead:"AssertNegativeLookahead",AssertNonWordBoundary:"AssertNonWordBoundary",AssertWordBoundary:"AssertWordBoundary",AssertEnd:"AssertEnd",AssertBegin:"AssertBegin"},e(),p.prototype.traverse=function(e,n,t){!function t(e,a,r){e.forEach(function(e){n&&e.type!==n||a(e,r),e.sub?t(e.sub,a,r):e.branches&&e.branches.forEach(function(e){t(e,a,r)})})}(this.tree,e,t)},n.Constants=t,n.exportConstants=e,n.RegexSyntaxError=g,n.getNFAParser=i,g.prototype.toString=function(){return this.name+" "+this.type+":"+this.message};var s={n:"\n",r:"\r",t:"\t",v:"\v",f:"\f"},l={escapeStart:function(e,t,a){e.unshift({concatTemp:!0,id:Math.random().toString(36).substr(2,9),type:EXACT_NODE,chars:"",indices:[a]})},exact:function(e,t,a){var r=e[0];(!r||r.type!=EXACT_NODE||r.repeat||r.chars&&!r.concatTemp)&&e.unshift({id:Math.random().toString(36).substr(2,9),type:EXACT_NODE,indices:[a]}),r&&r.concatTemp&&(r.chars+=t)},dot:function(e,t,a){e.unshift({id:Math.random().toString(36).substr(2,9),type:DOT_NODE,indices:[a]})},nullChar:function(e,t,a){e.unshift({id:Math.random().toString(36).substr(2,9),type:EXACT_NODE,chars:"\0",indices:[a-1]})},assertBegin:function(e,t,a){e.unshift({id:Math.random().toString(36).substr(2,9),type:ASSERT_NODE,indices:[a],assertionType:AssertBegin})},assertEnd:function(e,t,a,r,n){e.unshift({id:Math.random().toString(36).substr(2,9),type:ASSERT_NODE,indices:[a],assertionType:AssertEnd})},assertWordBoundary:function(e,t,a){e.unshift({id:Math.random().toString(36).substr(2,9),type:ASSERT_NODE,indices:[a-1],assertionType:"b"==t?AssertWordBoundary:AssertNonWordBoundary})},repeatnStart:function(e,t,a){e[0].type!==EXACT_NODE&&e.unshift({id:Math.random().toString(36).substr(2,9),type:EXACT_NODE,indices:[a]})},repeatnComma:function(e,t,a){c(e[0],"_commaIndex",a)},repeatNonGreedy:function(e){e[0].repeat.nonGreedy=!0},repeatnEnd:function(e,t,a,r,n){var s,c=e[0],o=n.lastIndexOf("{",a),p=parseInt(n.slice(o+1,c._commaIndex||a),10);if(c._commaIndex){if((s=c._commaIndex+1==a?1/0:parseInt(n.slice(c._commaIndex+1,a),10))<p)throw new g({type:"OutOfOrder",lastState:r,lastIndex:a,lastStack:e,message:"Numbers out of order in {} quantifier!"});delete c._commaIndex}else s=p;c.indices[0]>=o&&e.shift(),f(e,p,s,o,n)},repeat1ToInf:function(e,t,a,r,n){f(e,1,1/0,a,n)},repeat0To1:function(e,t,a,r,n){f(e,0,1,a,n)},repeat0ToInf:function(e,t,a,r,n){f(e,0,1/0,a,n)},charClassEscape:function(e,t,a){e.unshift({id:Math.random().toString(36).substr(2,9),type:CHARSET_NODE,indices:[a-1],chars:"",ranges:[],classes:[t],exclude:!1})},normalEscape:function(e,t,a){s.hasOwnProperty(t)&&(t=s[t]),e.unshift({id:Math.random().toString(36).substr(2,9),type:EXACT_NODE,chars:t,indices:[a-1]})},unicodeEscape:function(e,t,a,r,n){t=String.fromCharCode(parseInt(n.slice(a-3,a+1),16)),e.shift(),e.unshift({id:Math.random().toString(36).substr(2,9),type:EXACT_NODE,chars:t,indices:[a-5]})},hexEscape:function(e,t,a,r,n){t=String.fromCharCode(parseInt(n[a-1]+t,16)),e.shift(),e.unshift({id:Math.random().toString(36).substr(2,9),type:EXACT_NODE,chars:t,indices:[a-3]})},groupStart:function(e,t,a){var r=e.groupCounter=e.groupCounter||{i:0};return r.i++,c(e=(a={id:Math.random().toString(36).substr(2,9),type:GROUP_NODE,name:"",num:r.i,sub:[],indices:[a],_parentStack:e}).sub,"_parentGroup",a),e.groupCounter=r,e},groupNonCapture:function(e){var t=e._parentGroup;t.nonCapture=!0,t.num=void 0,e.groupCounter.i--},groupNamedContent:function(e,t){e._parentGroup.name+=t},backref:function(e,t,a,r){var n=e[0],s=parseInt(t,10),t=(t=e.groupCounter)&&t.i||0;if("escape"===r?(n={id:Math.random().toString(36).substr(2,9),type:BACKREF_NODE,indices:[a-1]},e.unshift(n)):s=parseInt(n.num+""+s,10),t<s)throw new g({type:"InvalidBackReference",lastIndex:a,lastStack:e,lastState:r,message:"Back reference number("+s+") greater than current groups count("+t+")."});if(function e(t,a){return!!a._parentGroup&&(a._parentGroup.num==t?t:e(t,a._parentGroup._parentStack))}(s,e))throw new g({type:"InvalidBackReference",lastIndex:a,lastStack:e,lastState:r,message:"Recursive back reference in group ("+s+") itself."});n.num=s},groupToAssertion:function(e,t,a){var r=e._parentGroup;r.type=ASSERT_NODE,r.assertionType="="==t?AssertLookahead:AssertNegativeLookahead,r.num=void 0,e.groupCounter.i--},groupEnd:function(e,t,a,r,n){var s=(e=C(e))._parentGroup;if(!s)throw new g({type:"UnexpectedChar",lastIndex:a,lastState:r,lastStack:e,message:"Unexpected end parenthesis!"});return delete e._parentGroup,delete e.groupCounter,e=s._parentStack,delete s._parentStack,e.unshift(s),s.endParenIndex=a,e},choice:function(e,t,a){var r,n,s=[];return e._parentChoice?((n=e._parentChoice).branches.unshift(s),c(s,"_parentChoice",n),c(s,"_parentGroup",n),s.groupCounter=e.groupCounter,delete e._parentChoice,delete e.groupCounter):(r=e[e.length-1],c(n={id:Math.random().toString(36).substr(2,9),type:CHOICE_NODE,indices:[r?r.indices[0]:a-1],branches:[]},"_parentStack",e),n.branches.unshift(e.slice()),e.length=0,e.unshift(n),s.groupCounter=e.groupCounter,c(s,"_parentChoice",n),c(s,"_parentGroup",n),n.branches.unshift(s)),s},endChoice:C,charsetStart:function(e,t,a){e.unshift({id:Math.random().toString(36).substr(2,9),type:CHARSET_NODE,indices:[a],classes:[],ranges:[],chars:""})},charsetExclude:function(e){e[0].exclude=!0},charsetContent:function(e,t,a){e[0].chars+=t},charsetNullChar:function(e,t,a){e[0].chars+="\0"},charsetClassEscape:function(e,t){e[0].classes.push(t)},charsetHexEscape:function(e,t,a,r,n){e=e[0],t=String.fromCharCode(parseInt(e.chars.slice(-1)+t,16)),e.chars=e.chars.slice(0,-2),e.chars+=t},charsetUnicodeEscape:function(e,t,a,r,n){e=e[0],t=String.fromCharCode(parseInt(e.chars.slice(-3)+t,16)),e.chars=e.chars.slice(0,-4),e.chars+=t},charsetRangeEnd:x,charsetNormalEscape:function(e,t,a){s.hasOwnProperty(t)&&(t=s[t]),e[0].chars+=t},charsetRangeEndNormalEscape:function(e,t){s.hasOwnProperty(t)&&(t=s[t]),x.apply(this,arguments)},charsetRangeEndUnicodeEscape:function(e,t,a){var r=e[0],n=r.chars.slice(-3)+t;r.chars=r.chars.slice(0,-3),e=r.ranges.pop(),t=String.fromCharCode(parseInt(n,16)),(e=[e[0],t]).lastIndex=a,r.ranges.push(e)},charsetRangeEndHexEscape:function(e,t,a){var r=e[0],n=r.chars.slice(-1)+t;r.chars=r.chars.slice(0,-1),e=r.ranges.pop(),t=String.fromCharCode(parseInt(n,16)),(e=[e[0],t]).lastIndex=a,r.ranges.push(e)}};function f(e,t,a,r,n){var s=e[0],t={min:t,max:a,nonGreedy:!1},a=r-1;s.chars&&1===s.chars.length&&(a=s.indices[0]),s.type===EXACT_NODE?(n={id:Math.random().toString(36).substr(2,9),type:EXACT_NODE,repeat:t,chars:s.chars||n[a],indices:[a]},s.indices[0]===a&&e.shift(),e.unshift(n)):s.repeat=t,c(t,"beginIndex",r-e[0].indices[0])}function C(e){if(e._parentChoice){var t=e._parentChoice;delete e._parentChoice,delete e._parentGroup,delete e.groupCounter;var a=t._parentStack;return delete t._parentStack,a}return e}function x(e,t,a,r,n){var s=e[0];(e=[(e=s.chars.slice(-2))[0],t]).lastIndex=a,s.ranges.push(e),s.chars=s.chars.slice(0,-2)}var S="0-9a-fA-F",m="repeatnStart,repeatn_1,repeatn_2,repeatnErrorStart,repeatnError_1,repeatnError_2",N="hexEscape1,hexEscape2",_="unicodeEscape1,unicodeEscape2,unicodeEscape3,unicodeEscape4",y="charsetUnicodeEscape1,charsetUnicodeEscape2,charsetUnicodeEscape3,charsetUnicodeEscape4,charsetHexEscape1,charsetHexEscape2",R={javascript6:{compact:!0,accepts:(y={compact:!0,accepts:"start,begin,end,repeat0,repeat1,exact,repeatn,repeat01,repeatNonGreedy,choice,"+m+",nullChar,digitBackref,"+_+","+N,trans:[["start,begin,end,exact,repeatNonGreedy,repeat0,repeat1,repeat01,groupStart,groupQualifiedStart,choice,repeatn>exact","^+*?^$.|(){[\\",l.exact],["hexEscape1,hexEscape2,unicodeEscape1,unicodeEscape2,unicodeEscape3,unicodeEscape4>exact","^+*?^$.|(){[\\0-9a-fA-F",l.exact],["nullChar>exact","^+*?^$.|(){[\\0-9",l.exact],[m+",nullChar,digitBackref,"+_+","+N+",start,begin,end,exact,repeatNonGreedy,repeat0,repeat1,repeat01,groupStart,groupQualifiedStart,choice,repeatn>exact",".",l.dot],["start,groupStart,groupQualifiedStart,end,begin,exact,repeat0,repeat1,repeat01,repeatn,repeatNonGreedy,choice,"+m+",nullChar,digitBackref,"+_+","+N+">begin","^",l.assertBegin],[m+",nullChar,digitBackref,"+_+","+N+",exact>repeatnStart","{",l.repeatnStart],["start,begin,end,groupQualifiedStart,groupStart,repeat0,repeat1,repeatn,repeat01,repeatNonGreedy,choice>repeatnErrorStart","{",l.exact],["repeatnStart>repeatn_1","0-9",l.exact],["repeatn_1>repeatn_1","0-9",l.exact],["repeatn_1>repeatn_2",",",l.repeatnComma],["repeatn_2>repeatn_2","0-9",l.exact],["repeatn_1,repeatn_2>repeatn","}",l.repeatnEnd],["repeatnStart,repeatnErrorStart>exact","}",l.exact],["repeatnStart,repeatnErrorStart>exact","^+*?^$.|(){[\\0-9}",l.exact],["repeatnErrorStart>repeatnError_1","0-9",l.exact],["repeatnError_1>repeatnError_1","0-9",l.exact],["repeatnError_1>repeatnError_2",",",l.exact],["repeatnError_2>repeatnError_2","0-9",l.exact],["repeatnError_2,repeatnError_1>repeatErrorFinal","}"],["repeatn_1,repeatnError_1>exact","^+*?^$.|(){[\\0-9,}",l.exact],["repeatn_2,repeatnError_2>exact","^+*?^$.|(){[\\0-9}",l.exact],["exact,"+m+",nullChar,digitBackref,"+_+","+N+">repeat0","*",l.repeat0ToInf],["exact,"+m+",nullChar,digitBackref,"+_+","+N+">repeat1","+",l.repeat1ToInf],["exact,"+m+",nullChar,digitBackref,"+_+","+N+">repeat01","?",l.repeat0To1],["choice>repeatErrorFinal","*+?"],["repeat0,repeat1,repeat01,repeatn>repeatNonGreedy","?",l.repeatNonGreedy],["repeat0,repeat1,repeat01,repeatn>repeatErrorFinal","+*"],["start,begin,end,groupStart,groupQualifiedStart,exact,repeatNonGreedy,repeat0,repeat1,repeat01,repeatn,choice,"+m+",nullChar,digitBackref,"+_+","+N+">escape","\\",l.escapeStart],["escape>nullChar","0",l.nullChar],["nullChar>digitFollowNullError","0-9"],["escape>exact","^dDwWsSux0-9bB1-9",l.normalEscape],["escape>exact","bB",l.assertWordBoundary],["escape>exact","dDwWsS",l.charClassEscape],["escape>unicodeEscape1","u",l.exact],["unicodeEscape1>unicodeEscape2",S,l.exact],["unicodeEscape2>unicodeEscape3",S,l.exact],["unicodeEscape3>unicodeEscape4",S,l.exact],["unicodeEscape4>exact",S,l.unicodeEscape],["escape>hexEscape1","x",l.exact],["hexEscape1>hexEscape2",S,l.exact],["hexEscape2>exact",S,l.hexEscape],["escape>digitBackref","1-9",l.backref],["digitBackref>digitBackref","0-9",l.backref],["digitBackref>exact","^+*?^$.|(){[\\0-9",l.exact],["exact,begin,end,repeat0,repeat1,repeat01,repeatn,repeatNonGreedy,start,groupStart,groupQualifiedStart,choice,"+m+",nullChar,digitBackref,"+_+","+N+">groupStart","(",l.groupStart],["groupStart>groupQualify","?"],["groupQualify>groupQualifiedStart",":",l.groupNonCapture],["groupQualify>groupQualifiedStart","=",l.groupToAssertion],["groupQualify>groupQualifiedStart","!",l.groupToAssertion],[m+",nullChar,digitBackref,"+_+","+N+",groupStart,groupQualifiedStart,begin,end,exact,repeat1,repeat0,repeat01,repeatn,repeatNonGreedy,choice>exact",")",l.groupEnd],["start,begin,end,groupStart,groupQualifiedStart,exact,repeat0,repeat1,repeat01,repeatn,repeatNonGreedy,choice,"+m+",nullChar,digitBackref,"+_+","+N+">choice","|",l.choice],["start,groupStart,groupQualifiedStart,begin,exact,repeat0,repeat1,repeat01,repeatn,repeatNonGreedy,choice,"+m+",nullChar,digitBackref,"+_+","+N+">end","$",l.assertEnd],["exact,begin,end,repeat0,repeat1,repeat01,repeatn,repeatNonGreedy,groupQualifiedStart,groupStart,start,choice,"+m+",nullChar,digitBackref,"+_+","+N+">charsetStart","[",l.charsetStart],["charsetStart>charsetExclude","^",l.charsetExclude],["charsetStart>charsetContent","^\\]^",l.charsetContent],["charsetExclude>charsetContent","^\\]",l.charsetContent],["charsetContent,charsetClass>charsetContent","^\\]-",l.charsetContent],["charsetClass>charsetContent","-",l.charsetContent],[y+",charsetStart,charsetContent,charsetNullChar,charsetClass,charsetExclude,charsetRangeEnd>charsetEscape","\\"],["charsetEscape>charsetContent","^dDwWsSux0-9",l.charsetNormalEscape],["charsetEscape>charsetNullChar","0",l.charsetNullChar],["charsetEscape>charsetOctEscape","1-9"],["charsetRangeEndEscape>charsetOctEscape","1-9"],["charsetNullChar>digitFollowNullError","0-9"],["charsetNullChar>charsetContent","^0-9\\]-",l.charsetContent],["charsetEscape>charsetClass","dDwWsS",l.charsetClassEscape],["charsetEscape>charsetUnicodeEscape1","u",l.charsetContent],["charsetUnicodeEscape1>charsetUnicodeEscape2",S,l.charsetContent],["charsetUnicodeEscape2>charsetUnicodeEscape3",S,l.charsetContent],["charsetUnicodeEscape3>charsetUnicodeEscape4",S,l.charsetContent],["charsetUnicodeEscape4>charsetContent",S,l.charsetUnicodeEscape],["charsetEscape>charsetHexEscape1","x",l.charsetContent],["charsetHexEscape1>charsetHexEscape2",S,l.charsetContent],["charsetHexEscape2>charsetContent",S,l.charsetHexEscape],[y+">charsetContent","^\\]0-9a-fA-F-",l.charsetContent],[y+",charsetNullChar,charsetContent>charsetRangeStart","-",l.charsetContent],["charsetRangeStart>charsetRangeEnd","^\\]",l.charsetRangeEnd],["charsetRangeEnd>charsetContent","^\\]",l.charsetContent],["charsetRangeStart>charsetRangeEndEscape","\\"],["charsetRangeEndEscape>charsetRangeEnd","^dDwWsSux0-9bB1-9",l.charsetRangeEndNormalEscape],["charsetRangeEndEscape>charsetRangeEndWithNullChar","0"],["charsetRangeEndEscape>charsetRangeEndUnicodeEscape1","u",l.charsetRangeEnd],["charsetRangeEndUnicodeEscape1>charsetRangeEndUnicodeEscape2",S,l.charsetContent],["charsetRangeEndUnicodeEscape2>charsetRangeEndUnicodeEscape3",S,l.charsetContent],["charsetRangeEndUnicodeEscape3>charsetRangeEndUnicodeEscape4",S,l.charsetContent],["charsetRangeEndUnicodeEscape4>charsetRangeEnd",S,l.charsetRangeEndUnicodeEscape],["charsetRangeEndEscape>charsetRangeEndHexEscape1","x",l.charsetRangeEnd],["charsetRangeEndHexEscape1>charsetRangeEndHexEscape2",S,l.charsetContent],["charsetRangeEndHexEscape2>charsetRangeEnd",S,l.charsetRangeEndHexEscape],["charsetRangeEndEscape>charsetRangeEndClass","dDwWsS"],["charsetRangeEndUnicodeEscape1,charsetRangeEndHexEscape1>charsetContent","^\\]0-9a-fA-F",l.charsetContent],["charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4,charsetRangeEndHexEscape2>charsetRangeStart","-",l.charsetContent],[y+",charsetRangeEndUnicodeEscape1,charsetRangeEndHexEscape1,charsetRangeEndUnicodeEscape2,charsetRangeEndUnicodeEscape3,charsetRangeEndUnicodeEscape4,charsetRangeEndHexEscape2,charsetNullChar,charsetRangeStart,charsetContent,charsetClass,charsetExclude,charsetRangeEnd>exact","]"]]}).accepts,trans:y.trans.concat([])},python:{compact:!0,accepts:y.accepts,trans:y.trans.concat([["groupQualify>groupNamedDefined","P"],["groupNamedDefined>groupNamedStart","<"],["groupNamedStart,groupNamedContent>groupNamedContent","0-9a-zA-Z_",l.groupNamedContent],["groupNamedContent>groupNamedEnd","0-9a-zA-Z_",l.groupNamedContent],["groupNamedEnd,groupNamedContent>groupQualifiedStart",">"]])}};return n}