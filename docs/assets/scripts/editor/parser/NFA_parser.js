class NFA{constructor(e){var t=Kit(),[t,r]=(this.auxKit=t,this.prepareValidStructs(e));this.router=r,this.accepts=t,this.unexpectedRouter=e.unexpectedRouter,this.unexpectedToken=e.unexpectedToken}prepareValidStructs(e){let c=this.auxKit;for(var t,r={},a=(e=e.compact?this._expandNames(e):e).trans,i={},o=0,s=e.accepts.length;o<s;o++)r[e.accepts[o]]=!0;for(o=0,s=a.length;o<s;o++)(t=a[o]).charset?t.ranges="string"==typeof t.charset?this.auxKit.parseCharset(t.charset):t.charset:t.eMove=!0,t.from.forEach(function(e){e=i[e]=i[e]||{eMoveStates:[],eMove:[],charMove:{},trans:[],ranges:[]};t.eMove?e.eMoveStates=e.eMoveStates.concat(t.to):e.ranges=e.ranges.concat(t.ranges),e.trans.push(t)});return Object.keys(i).forEach(function(e){var e=i[e],t=e.trans,o=e.charMove,r=e.eMove,a=e.ranges,s=c.classify(a),n=s.map;t.forEach(function(t){t.eMove?t.to.forEach(function(e){r.push({to:e,action:t.action,assert:t.assert,eMove:!0})}):c.flatten2(t.ranges.map(function(e){return n[e]})).forEach(function(e){(o[e]=o[e]||[]).push(t)})}),a=c.Set(s.ranges.filter(function(e){return!!e[1]})),e.ranges=a,Object.keys(o).forEach(function(e){var r=o[e],a=[];t.forEach(function(t){t.to.forEach(function(e){(t.eMove||~r.indexOf(t))&&a.push({to:e,action:t.action,assert:t.assert,eMove:t.eMove})})}),o[e]=a}),delete e.trans,delete e.eMoveStates}),[r,i]}accept(e){return this.accepts.hasOwnProperty(e)}assertDFA(){for(var e,t=this.router,r=Object.keys(t),a=0,o=r.length;a<o;a++){if(1<(e=t[r[a]]).eMove.length)throw new Error("DFA Assertion Fail!\nFrom state `"+r[a]+"` can goto to multi ε-move states!");for(var s=e.charMove,n=Object.keys(s),c=0,i=n.length;c<i;c++)if(1!==s[n[c]].length)throw this.auxKit.log(s),new Error("DFA Assertion Fail!\nFrom state `"+r[a]+"` via charset `"+n[c]+"` can goto to multi states!");if(n.length&&e.eMove.length)throw new Error("DFA Assertion Fail!\nFrom state `"+r[a]+"` can goto extra ε-move state!")}return!0}input(e,t,m){var E=this;return function e(t,r,a,o,s){e:for(;;){var n,c,i=E.router[a];if(!i)break;for(var h,u,f,p=i.eMove,l=i.charMove,v=r<t.length?(n=t[r],l.hasOwnProperty(n)?l[n]:(i=E._escapeChar(i.ranges,n))?l[i]:0===p.length?[{action:E.unexpectedToken,assert:void 0,eMove:void 0,to:"exact"}]:p):p,g=o.length,M=s,x=0,d=v.length;x<d;x++){if(u=(h=v[x]).eMove?0:1,s=M,o.splice(0,o.length-g),g=o.length,h.assert){if(!(f=h.assert(o,n,r,a,t)))continue;"number"==typeof f&&(r+=f,s+=f)}if(h.action&&(f=h.action(o,n,r,a,t))&&(o=f),s=h.eMove?s:r,m&&E.auxKit.log(n+`:${a}>`+h.to),x===d-1){r+=u,a=h.to;continue e}if((u=e(t,r+u,h.to,o,s)).acceptable)return u;c=u}if(c)return c;break}return{stack:o,lastIndex:s,lastState:a,acceptable:E.accept(a)}}(e,t=t||0,"start",[],t-1)}_aux_escapeChar(e,t){var r=t[0];return e>t[1]?1:e<r?-1:0}_escapeChar(e,t){t=e.indexOf(t,this._aux_escapeChar);return!!~t&&e[t]}_expandNames(e){e.accepts=e.accepts.split(",");for(var t,r,a,o=e.trans,s=o.length;s--;)r=(a=(t=o[s])[0].split(">"))[0].split(","),a=a[1].split(","),o[s]={from:r,to:a,charset:t[1],action:t[2],assert:t[3]};return e.compact=!1,e}}