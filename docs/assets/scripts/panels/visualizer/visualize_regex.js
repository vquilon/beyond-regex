function RegexVisualizer(e,i,n,r,h,a){var s,o=Kit();function c(t,e){if(e=e||"normal",I[t]&&I[t][e])return I[t][e];s.attr({"font-size":t,"font-weight":e});var i=s.getBBox();return I[t]=I[t]||{},I[t][e]={width:i.width/((s.attr("text").length-1)/2),height:i.height/2}}function p(i,t,n){var e,r=[],h=[],a=0,s=t,o=n,c=n;if(!i.length)return _.empty(i,t,n);i.forEach(function(t){t=t.repeat?_.repeat(t,s,n):_[t.type](t,s,n),r.push(t),s+=t.width+16,a+=t.width,o=Math.min(o,t.y),c=Math.max(c,t.y+t.height),h=h.concat(t.items)}),e=c-o,r.reduce(function(t,e){return a+=16,t=g(i,t.lineOutX,n,e.lineInX,_fromItem=t,_toItem=e),h.push(t),e});var l=r[0].lineInX,u=r[r.length-1].lineOutX;return{items:h,width:a,height:e,x:t,y:o,lineInX:l,lineOutX:u}}function k(t,e,i){t.forEach(function(t){t._translate?t._translate(e,i):(t.x+=e,t.y+=i)})}function l(t,e,i,n,r,h){return{type:"group",id:t.id||"",dataset:{indices:[t.indices[0]+1,t.indices[1]-1].join(",")},class:`g:${t.type}:`+[t.indices[0]+1,t.indices[1]-1].join(";"),children:e,transform:`t${i},`+n,x:i,y:n,width:r,height:h,_translate:function(t,e){this.x+=t,this.y+=e,this.transform=`t${this.x},`+this.y}}}function v(t,e,i,n,r,h){e=o.toPrint(e);var a=c(16),s=e.length*a.width,a=a.height+12,s=12+s,r={type:"rect",class:`rect:${t.type}:`+t.indices.join(";"),x:0,y:0,width:s,height:a,stroke:"none",fill:r||"transparent"};return{text:e={type:"text",class:`text:${t.type}:`+t.indices.join(";"),x:s/2,y:a/2,text:e,"font-size":16,"font-family":b,fill:h||"black"},rect:r,items:[h=l(t,[r,e],i,n-a/2,s,a)],width:s,height:a,x:i,y:h.y,lineInX:i,lineOutX:i+s}}function X(t,e,i,n,r){var h=c(14),a=(s=n.split("\n")).length*h.height,s=1<s.length?Math.max.apply(Math,s.map(function(t){return t.length})):n.length;return s*=h.width,{label:{type:"text",class:`text:${t.type}:`+t.indices.join(";"),x:e,y:i-a/2-4,text:n,"font-size":14,"font-family":b,fill:r||"#444"},x:e-s/2,y:i-a-4,width:s,height:4+a}}function g(t,e,i,n,r=null,h=null){let a="linejoint";return null!==r&&(a=a+"::"+r.items.map(t=>t.class).join("_")),null!==h&&(a=`${a}::${h.items.map(t=>t.class).join("_")}::`),{type:"path",class:"path:"+(a=t.hasOwnProperty("indices")?"any:"+t.indices.join(";"):a),x:e,y:i,path:["M",e,i,"H",n],"stroke-linecap":"butt","stroke-linejoin":"round",stroke:"#333","stroke-width":2,_translate:function(t,e){var i=this.path;i[1]+=t,i[2]+=e,i[4]+=t}}}function y(t,e,i,n,r){var h,a=n<e?-1:1,s=r<i?-1:1,i=Math.abs(i-r)<15?(h=["M",e,i,"C",e+Math.min(Math.abs(n-e)/2,10)*a,i,n-(n-e)/2,r,n,r],function(t,e){var i=this.path;i[1]+=t,i[2]+=e,i[4]+=t,i[5]+=e,i[6]+=t,i[7]+=e,i[8]+=t,i[9]+=e}):(h=["M",e,i,"Q",e+10*a,i,e+10*a,i+10*s,"V",Math.abs(i-r)<20?i+10*s:r-10*s,"Q",e+10*a,r,e+10*a*2,r,"H",n],function(t,e){var i=this.path;i[1]+=t,i[2]+=e,i[4]+=t,i[5]+=e,i[6]+=t,i[7]+=e,i[9]+=e,i[11]+=t,i[12]+=e,i[13]+=t,i[14]+=e,i[16]+=t});return{type:"path",class:"path:curve:"+t.indices.join(";"),path:h,"stroke-linecap":"butt","stroke-linejoin":"round",stroke:"#333","stroke-width":2,_translate:i}}function u(t,e,i,n){return n={type:"circle",id:t.id,class:`circle:${t.type}:`+t.indices.join(";"),fill:n,cx:10,cy:0,r:10,stroke:"none",_translate:function(t,e){this.cx+=t,this.cy+=e}},{items:[container_group=l(t,[n],e,i,20,20)],width:container_group.width,height:container_group.height,x:e,y:i,lineInX:container_group.x,lineOutX:container_group.x+container_group.width}}function m(t){if(Array.isArray(t)){for(var e=t,i=0;i<e.length;i++)if(!m(e[i]))return!1;return!0}return t.type===EMPTY_NODE||(t.type===GROUP_NODE&&void 0===t.num?m(t.sub):t.type===CHOICE_NODE?m(t.branches):void 0)}var d,f,x,w,b="DejaVu Sans Mono,monospace",M="#e2e2e2",O=!1,I={},_={startPoint:function(t,e,i){return u({type:"startPoint",id:"startPoint",indices:[-1,-1]},e,i,j.startRegex)},endPoint:function(t,e,i){return u({type:"endPoint",id:"endPoint",indices:[1/0,1/0]},e,i,j.endRegex)},empty:function(t,e,i){return{items:[g(t,e,i,e+10)],width:10,height:2,x:e,y:i,lineInX:e,lineOutX:e+10}},exact:function(t,e,i){return v(t,t.chars,e,i,"skyblue")},dot:function(t,e,i){return(t=v(t,"AnyCharExceptNewLine",e,i,"DarkGreen","white")).rect.r=10,t.rect.tip="AnyChar except CR LF",t},backref:function(t,e,i){return(t=v(t,"Backref #"+t.num,e,i,"navy","white")).rect.r=8,t},repeat:function(t,e,i){function n(t){return t+(t<2?" time":" times")}function r(t,e){var i=this.path;i[1]+=t,i[2]+=e,i[4]+=t,i[5]+=e,i[6]+=t,i[7]+=e,i[9]+=e,i[11]+=t,i[12]+=e,i[13]+=t,i[14]+=e,i[16]+=t,i[18]+=t,i[19]+=e,i[20]+=t,i[21]+=e,i[23]+=e,i[25]+=t,i[26]+=e,i[27]+=t,i[28]+=e}if(m(t))return _.empty(t,e,i);var h=t.repeat,a="",s=[];if(h.min===h.max&&0===h.min)return _.empty(t,e,i);var o=_[t.type](t,e,i),c=o.width,l=o.height;if(h.min===h.max&&1===h.min)return o;h.min===h.max?a+=n(h.min):(a+=h.min,isFinite(h.max)?a+=(1<h.max-h.min?" to ":" or ")+n(h.max):a+=" or more times");var u,d,p=10,g=0,y=o.y+o.height-i,f=20+o.width,c=f;return 1!==h.max?(y+=10,l+=10,u={type:"path",class:"path:repeat:"+t.indices.join(";"),path:["M",o.x+10,i,"Q",e,i,e,i+10,"V",i+y-10,"Q",e,i+y,e+10,i+y,"H",e+f-10,"Q",e+f,i+y,e+f,i+y-10,"V",i+10,"Q",e+f,i,o.x+o.width+10,i],_translate:r,stroke:"maroon","stroke-width":2},h.nonGreedy&&(u.stroke="Brown",u["stroke-dasharray"]="-"),s.push(u)):a=!1,0===h.min&&(d=i-o.y+10,p+=10,g=-12,c=f+=20,l+=10,d={type:"path",class:"path:repeat:"+t.indices.join(";"),path:["M",e,i,"Q",e+10,i,e+10,i-10,"V",i-d+10,"Q",e+10,i-d,e+20,i-d,"H",e+f-20,"Q",e+f-10,i-d,e+f-10,i-d+10,"V",i-10,"Q",e+f-10,i,e+f,i],_translate:r,stroke:h.nonGreedy?"darkgreen":"#333","stroke-width":2},u&&k([u],10,0),s.push(d)),a&&(k([(f=X(t,e+c/2,i,a)).label],0,y+f.height+4),s.push(f.label),l+=4+f.height,(h=(Math.max(f.width,c)-c)/2)&&k(s,h,0),c=Math.max(f.width,c),p+=h),k(o.items,p,0),{items:s=s.concat(o.items),width:c,height:l,x:e,y:o.y+g,lineInX:o.lineInX+p,lineOutX:o.lineOutX+p}},choice:function(h,a,s){if(m(h))return _.empty(h,a,s);var e=0,o=0,t=h.branches.map(function(t){return t=p(t,a,s),e+=t.height,o=Math.max(o,t.width),t}),c=(e+=6*(t.length-1)+8,a+(o+=40)/2),l=s-e/2+4,u=a+o,d=[];return t.forEach(function(t){var e=c-t.width/2,i=(k(t.items,e-t.x,l-t.y),d=d.concat(t.items),s+l-t.y),n=y(h,a,s,a+20,i),r=y(h,u,s,a+o-20,i);d.push(n,r),a+20!==e-t.x+t.lineInX&&d.push(g(h,a+20,i,e-t.x+t.lineInX)),t.lineOutX+e-t.x!=a+o-20&&d.push(g(h,t.lineOutX+e-t.x,i,a+o-20)),t.x=e,t.y=l,l+=t.height+6}),{items:d,width:o,height:e,x:a,y:s-e/2,lineInX:a,lineOutX:u}},charset:function(e,i,n){var t,r={d:"Digit",D:"NonDigit",w:"Word",W:"NonWord",s:"WhiteSpace",S:"NonWhiteSpace"},h=e.exclude?"Pink":"Khaki",a=e.exclude?"#C00":"";if(!(t=e).chars&&!t.ranges.length&&1===t.classes.length)return(g=v(e,r[e.classes[0]],i,n,"Green","white")).rect.r=5,e.exclude?(m=X(e,g.x+g.width/2,g.y,"None of:",a),(f=g.items).push(m.label),x=g.width,l=Math.max(m.width,g.width),k(f,w=(l-x)/2,0),{items:f,width:l,height:g.height+m.height,x:Math.min(m.x,g.x),y:m.y,lineInX:w+g.x,lineOutX:w+g.x+g.width}):g;if(!e.chars&&!e.ranges.length&&!e.classes.length)return(g=v(e,"AnyChar",i,n,"green","white")).rect.r=5,g;var s,o,c=[],l=0,u=0,d=(e.chars&&((g=v(e,e.chars,i,n,"LightSkyBlue","black")).rect.r=5,c.push(g),l=g.width),e.ranges.forEach(function(t){t=t.split("").join("-"),(t=v(e,t,i,n,"teal","white")).rect.r=5,c.push(t),l=Math.max(t.width,l)}),e.classes.forEach(function(t){(t=v(e,r[t],i,n,"Green","white")).rect.r=5,c.push(t),l=Math.max(t.width,l)}),g=c[0].height,[]),p=[];for(c.sort(function(t,e){return e.width-t.width}),c.forEach(function(t){(2*t.width+4>l?d:p).push(t)}),c=d;p.length;){if(s=p.pop(),!(o=p.pop())){c.push(s);break}2<s.width-o.width?(c.push(s),p.push(o)):(k(o.items,s.width+4,0),c.push({items:s.items.concat(o.items),width:s.width+o.width+4,height:s.height,x:s.x,y:s.y}),u-=s.height)}l+=12;var u=4*(c.length-1)+c.length*g+12,g={type:"rect",class:"rect:charsetgroup:"+e.indices.join(";"),x:i,y:n-u/2,r:4,width:l,height:u,stroke:"none",fill:h},y=g.y+6,f=[g];c.forEach(function(t){k(t.items,i-t.x+(l-t.width)/2,y-t.y),f=f.concat(t.items),y+=t.height+4});var m=X({type:"charsetgroup",indices:e.indices},g.x+g.width/2,g.y,(e.exclude?"None":"One")+" of:",a),x=(f.push(m.label),l),w=((l=Math.max(m.width,l))-x)/2;return k(f,w,0),{items:f,width:l,height:u+m.height,x:Math.min(m.x,i),y:m.y,lineInX:w+i,lineOutX:w+i+g.width}},group:function(t,e,i){if(m(t))return _.empty(t,e,i);var n,r,h,a,s,o=p(t.sub,0,0),c=l(t,o.items,0,0,o.width,o.height);return t.num?(k([c],10,0),n=o.width+20,r=o.height+20,s={type:"rect",id:t.id,indices:t.indices,class:`rect:${t.type}:`+t.indices.join(";"),x:0,y:o.y-10,r:6,width:n,height:r,"stroke-dasharray":".",stroke:"silver","stroke-width":2},h=X(t,s.width/2,s.y-2,`Group ${t.name}#`+t.num),a=Math.max(h.width,n),{items:[s=l(t,[c,s,h.label],e+(t=(a-n)/2),i,a,r+h.height+4)],width:s.width,height:s.height,x:s.x,y:s.y+h.y,lineInX:e+t+o.lineInX+10,lineOutX:e+t+o.lineOutX+10}):(k([c],e,i),{items:[c],width:c.width,height:c.height,x:e+o.x,y:i+o.y,lineInX:e+o.lineInX,lineOutX:e+o.lineOutX})},assert:function(t,e,i){var n,r=(a=t.assertionType).replace("Assert","")+"!";if(h={AssertNonWordBoundary:{bg:"maroon",fg:"white"},AssertWordBoundary:{bg:"purple",fg:"white"},AssertEnd:{bg:"Indigo",fg:"white"},AssertBegin:{bg:"Indigo",fg:"white"}}[a])return v(t,r=!O||"AssertBegin"!==a&&"AssertEnd"!==a?r:"Line"+r,e,i,h.bg,h.fg);a===AssertLookahead?(s="CornflowerBlue",n="darkgreen",r="Followed by:"):a===AssertNegativeLookahead&&(s="#F63",n="Purple",r="Not followed by:");var h=_.group(t,e,i),a=h.height+16,i=h.width+16,a={type:"rect",class:`rect:${t.type}:`+t.indices.join(";"),x:e,y:h.y-8,r:6,width:i,height:a,"stroke-dasharray":"-",stroke:s,"stroke-width":2},s=X(t,a.x+i/2,a.y,r,n),r=((t=Math.max(i,s.width))-i)/2;return k(h.items,8+r,0),r&&k([a,s.label],r,0),{items:h.items.concat([a,s.label]),width:t,height:a.height+s.height,x:e,y:s.y,lineInX:r+h.lineInX+8,lineOutX:r+h.lineOutX+8}}},j={startRegex:"#03a9f4",endRegex:"#ff0058",delimiter:"Indigo",flags:"darkgreen",exact:"#334",dot:"darkblue",backref:"teal",$:"purple","^":"purple","\\b":"#F30","\\B":"#F30","(":"blue",")":"blue","?=":"darkgreen","?!":"red","?:":"grey","[":"navy","]":"navy","|":"blue","{":"maroon",",":"maroon","}":"maroon","*":"maroon","+":"maroon","?":"maroon",repeatNonGreedy:"#F61",defaults:"black",charsetRange:"olive",charsetClass:"navy",charsetExclude:"red",charsetChars:"#534"};{var[i,E]=function(t,e){let i=[],n=(t.forEach(t=>{i.push(t)}),i.forEach(t=>t.remove()),t.rect(0,0,0,0)),r=(n.attr("fill",M),n.attr("stroke",M),s=t.text(-1e3,-1e3,"XgfTlM|.q\nXgfTlM|.q").attr({"font-family":b,"font-size":16}),c(16,"bold"));return O=!!~e.indexOf("m"),[n,r]}(n,i),e=(a.updateProgressBar(10),d=n,E=E,i=i,(w=[...(f=e).tree]).unshift({type:"startPoint"}),w.push({type:"endPoint"}),f=p(w,0,0),w=Math.max(f.height+30+E.height,0),x=Math.max(f.width+20,0),d.setSize(x,w),i.attr("width",x),i.attr("height",w),k(f.items,10,20+E.height-f.y),f);a.updateProgressBar(50),s.remove(),a.updateProgressBar(60),n.addv2(e.items),a.updateProgressBar(90);let t=Array.from(n.canvas.childNodes);return t.forEach(t=>{t!==r&&h.appendChild(t)}),a.updateProgressBar(100),e}}