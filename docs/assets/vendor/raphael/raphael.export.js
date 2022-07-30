!function(u){function v(t){if("number"==typeof t)return t.toString();var r,a={"<":"lt",">":"gt",'"':"quot","'":"apos"};for(r in a)t=t.replace(new RegExp(r,"g"),"&"+a[r]+";");return t}function l(t,r){var a=[];if(void 0!==t.unshift)for(var e,n=t.length,i=0;i<n;i++)void 0!==t[i]&&null!==(e=r.call(this,t[i],i))&&a.push(e);else for(i in t)t.hasOwnProperty(i)&&null!==(e=r.call(this,t[i],i))&&a.push(e);return a}function f(t,r,a){for(var e in t)t.hasOwnProperty(e)&&(a=r.call(this,a,t[e],e));return a}function c(t,r,a,e){return null==e&&(e=""),"object"==typeof r&&(r=l(r,function(t,r){switch(r){case"transform":return;case"fill":var a;t.match(/^hsb/)&&3===(a=t.replace(/^hsb\(|\)$/g,"").split(",")).length&&(t=u.hsb2rgb(a[0],a[1],a[2]).toString())}return r+'="'+v(t)+'"'}).join(" ")),"<"+t+(a?' transform="matrix('+a.toString().replace(/^matrix\(|\)$/g,"")+')" ':" ")+r+">"+e+"</"+t+">"}function m(t){return/^[0-9A-F]{6}$/i.test(t)?"#"+t:t}var x={text:function(n){var i={font:{family:void 0===(t=n).attrs.font?null:t.attrs.font.replace(/^.?"(\w+)".$/,"$1"),size:void 0===t.attrs["font-size"]?null:parseInt(t.attrs["font-size"]),style:void 0===t.attrs["font-style"]?null:t.attrs["font-style"],weight:void 0===t.attrs["font-weight"]?null:t.attrs["font-weight"]},anchor:void 0===t.attrs["text-anchor"]?null:t.attrs["text-anchor"]},s=new Array,t=n.attrs.text.toString().split("\n"),o=t.length;return l(t,function(t,r){var a,e=f(n.attrs,function(t,r,a){return"text"!==a&&"w"!==a&&"h"!==a&&("font-size"===a&&(r=parseInt(r)+"px"),"stroke"===a&&(r=m(r)),t[a]=v(r.toString())),t},{style:(a="normal","text-anchor: "+((e=i).anchor||"middle")+"; "+["font:",(e=e.font).style||a,a,e.weight||a,(e.size?e.size+"px":"10px")+"/normal",e.family].join(" ")+";")});""!=n.node.className.baseVal&&void 0!==n.node.className.baseVal&&(e.class=n.node.className.baseVal),s.push(c("text",e,n.matrix,c("tspan",{dy:4.5*(e=null===(e=i.font.size)?10:e)/13*(r+1-.2-o/2)*3.5},null,t.replace(/&/g,"&amp;"))))}),s},path:function(t){return 1===t.matrix.a&&1===t.matrix.d||t.matrix.toString(),c("path",f(t.attrs,function(t,r,a){return"stroke"===(a="path"===a?"d":a)&&(r=m(r)),t[a]=r.toString(),t},{}),t.matrix)}};u.fn.toSVG=function(){var t={svg:u.svg,vml:u.vml},r='<svg style="overflow: hidden; position: relative;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="'+this.width+'" version="1.1" height="'+this.height+'">';u.svg=!0,u.vml=!1;for(var a=this.bottom;null!=a;a=a.next)if("none"!==a.node.style.display){var e="";if("function"!=typeof x[a.type]){for(i in"image"===a.type&&(e+=' preserveAspectRatio="none"'),a.attrs){var n=i,s="";switch(i){case"r":if("rect"!=a.type)break;s=a.attrs.r,a.attrs.rx=s,a.attrs.ry=s;continue;case"src":n="xlink:href";break;case"transform":n="";break;case"fill":if(a.attrs.gradient)continue;break;case"gradient":var o=a.id,l=a.attrs.gradient,f=.5,c=.5,l=(l=String(l).replace(u._radial_gradient,function(t,r,a){return type="radial",r&&a&&(f=parseFloat(r),a=2*(.5<(c=parseFloat(a)))-1,.25<Math.pow(f-.5,2)+Math.pow(c-.5,2)&&(c=Math.sqrt(.25-Math.pow(f-.5,2))*a+.5)&&.5!=c&&(c=c.toFixed(5)-1e-5*a)),""})).split(/\s*\-\s*/);if(a.attrs.gradient.match(/^r/g)){if(!(d=u._parseDots(l)))continue;for(var r=r+"<defs>"+('\t    <radialGradient id="radialgradient'+o+'" fx="'+f+'" fy="'+c+'" >'),h=0;h<d.length;h++){var p=h/(d.length-1)*100+"%";d[h].offset&&(p=d[h].offset),r+='<stop stop-color="'+d[h].color+'" offset="'+p+'"/>'}r=r+"    </radialGradient>"+"</defs>",n="fill",s="url(#radialgradient"+o+")"}else{var d,g=l.shift(),g=-1*parseFloat(g);if(isNaN(g))continue;if(!(d=u._parseDots(l)))continue;for(l=[0,0,Math.cos(u.rad(g)),Math.sin(u.rad(g))],g=1/(Math.max(Math.abs(l[2]),Math.abs(l[3]))||1),l[2]*=g,l[3]*=g,l[2]<0&&(l[0]=-l[2],l[2]=0),l[3]<0&&(l[1]=-l[3],l[3]=0),r=(r+="<defs>")+('\t    <linearGradient id="lineargradient'+o+'" x1="'+l[0]+'" y1="'+l[1]+'" x2="'+l[2]+'" y2="'+l[3]+'">'),h=0;h<d.length;h++)p=h/(d.length-1)*100+"%",d[h].offset&&(p=d[h].offset),r+='<stop stop-color="'+d[h].color+'" offset="'+p+'"/>';r=r+"    </linearGradient>"+"</defs>",n="fill",s="url(#lineargradient"+o+")"}break;case"stroke":s=m(s||a.attrs[i].toString())}n&&(e+=s?" "+n+'="'+v(s)+'"':" "+n+'="'+v(a.attrs[i].toString())+'"')}""!=a.node.className.baseVal&&(e+=' class="'+a.node.className.baseVal+'"'),r+="<"+a.type+' transform="matrix('+a.matrix.toString().replace(/^matrix\(|\)$/g,"")+')"'+e+"></"+a.type+">"}else r+=x[a.type](a)}return r+="</svg>",u.svg=t.svg,u.vml=t.vml,r}}(window.Raphael);