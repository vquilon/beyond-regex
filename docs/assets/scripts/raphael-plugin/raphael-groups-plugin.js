!function(){"use strict";Raphael.fn.group=function(t,e){if(1==Raphael.svg){this.svg="http://www.w3.org/2000/svg",this.dv=document.getElementById(t),this.defs=this.dv.getElementsByTagName("defs")[0];var a=this.defs,n=this.svg;this.svgcanv=this.dv.getElementsByTagName("svg")[0],this.svgcanv.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink");var t=this.svgcanv.getElementsByTagName("g").length,s=(u=/[xy]/g,l=function(t){var e=16*Math.random()|0;return("x"==t?e:3&e|8).toString(16)},function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(u,l).toUpperCase()});for(this.group.attrs={},0==t?(this.masterGroup=document.createElementNS(this.svg,"g"),this.svgcanv.appendChild(this.masterGroup)):this.masterGroup=this.svgcanv.getElementsByTagName("g")[0],this.group=document.createElementNS(this.svg,"g"),i=0;i<e.length;i++)this.group.appendChild(e[i].node);this.masterGroup.appendChild(this.group),this.group.set=[];var r=this.masterGroup;this.group.getMaster=function(){return r},this.group.remove=function(){this.parentNode.removeChild(this)};var o={translate:{x:0,y:0},scale:{x:1,y:1},rotate:{x:0,y:0,z:0}},h=function(){return"translate("+o.translate.x+","+o.translate.y+") scale("+o.scale.x+","+o.scale.y+") rotate("+o.rotate.x+","+o.rotate.y+","+o.rotate.z+")"};return this.group.translate=function(t,e){o.translate.x=t,o.translate.y=e,this.setAttribute("transform",h())},this.group.rotate=function(t,e,r){o.rotate.x=t,o.rotate.y=e,o.rotate.z=r,this.setAttribute("transform",h())},this.group.scale=function(t,e){o.scale.x=t,o.scale.y=e,this.setAttribute("transform",h())},this.group.push=function(){for(i=0;i<arguments.length;i++)this.appendChild(arguments[i].node)},this.group.addElement=function(){for(i=0;i<arguments.length;i++)this.appendChild(arguments[i])},this.group.getAttr=function(t){return o[t]},this.group.copy=function(t){this.copy=t.node.cloneNode(!0),this.appendChild(this.copy)},this.group.toFront=function(){this.getMaster().appendChild(this)},this.group.clipPath=function(t){var e=document.createElementNS(n,"clipPath"),r=s();e.setAttribute("id",r),e.appendChild(t.node),a.appendChild(e),this.setAttribute("clip-path","url(#"+r+")")},this.group.animate=function(){var t=this,e=arguments,r=e[0],i=e[2];void 0!==o&&clearInterval(o);var a,n=r.x,s=t.getAttr("translate").x,o=setInterval(function(){n<s?(a=(s-n)/10,t.getAttr("translate").x-a>n?t.translate(t.getAttr("translate").x-a,0):(t.translate(n,0),clearInterval(o),i())):(a=(n-s)/10,t.getAttr("translate").x+a<n?t.translate(t.getAttr("translate").x+a,0):(t.translate(n,0),clearInterval(o),i()))},10)},this.group.attr=function(t,e){if(this.attrs&&null==e&&"array"==typeof t){for(out={},i=0,ii=t.length;i<ii;i++)out[t[i]]=this.attr(t[i]);return out}var r;if(null!=e&&((r={})[t]=e),r=null==e&&"object"==typeof t?t:r)for(var a in r)this.group.attrs[a]=r[a],this.group.setAttribute(a,r[a]);return this.group},this.group}var u,l}}(),function(){Raphael.fn.group=function(t){if(1==Raphael.svg){var a=this.defs,n=this.svg,s=(r=/[xy]/g,u=function(t){var e=16*Math.random()|0;return("x"==t?e:3&e|8).toString(16)},function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(r,u).toUpperCase()});for(this.group.attrs={},this.group=document.createElementNS(this.svg,"g"),i=0;i<t.length;i++)this.group.appendChild(t[i].node);this.masterGroup.appendChild(this.group),this.group.set=[];var e=this.masterGroup;this.group.getMaster=function(){return e},this.group.remove=function(){this.parentNode.removeChild(this)};function o(){return"translate("+h.translate.x+","+h.translate.y+") scale("+h.scale.x+","+h.scale.y+") rotate("+h.rotate.x+","+h.rotate.y+","+h.rotate.z+")"}var h={translate:{x:0,y:0},scale:{x:1,y:1},rotate:{x:0,y:0,z:0}};return this.group.translate=function(t,e){h.translate.x=t,h.translate.y=e,this.setAttribute("transform",o())},this.group.rotate=function(t,e,r){h.rotate.x=t,h.rotate.y=e,h.rotate.z=r,this.setAttribute("transform",o())},this.group.scale=function(t,e){h.scale.x=t,h.scale.y=e,this.setAttribute("transform",o())},this.group.push=function(){for(i=0;i<arguments.length;i++)this.appendChild(arguments[i].node)},this.group.addElement=function(){for(i=0;i<arguments.length;i++)this.appendChild(arguments[i])},this.group.getAttr=function(t){return h[t]},this.group.copy=function(t){this.copy=t.node.cloneNode(!0),this.appendChild(this.copy)},this.group.toFront=function(){this.getMaster().appendChild(this)},this.group.clipPath=function(t){var e=document.createElementNS(n,"clipPath"),r=s();e.setAttribute("id",r),e.appendChild(t.node),a.appendChild(e),this.setAttribute("clip-path","url(#"+r+")")},this.group.animate=function(){var t=this,e=arguments,r=e[0],i=e[2];void 0!==o&&clearInterval(o);var a,n=r.x,s=t.getAttr("translate").x,o=setInterval(function(){n<s?(a=(s-n)/10,t.getAttr("translate").x-a>n?t.translate(t.getAttr("translate").x-a,0):(t.translate(n,0),clearInterval(o),i())):(a=(n-s)/10,t.getAttr("translate").x+a<n?t.translate(t.getAttr("translate").x+a,0):(t.translate(n,0),clearInterval(o),i()))},10)},this.group.attr=function(t,e){if(this.attrs&&null==e&&"array"==typeof t){for(out={},i=0,ii=t.length;i<ii;i++)out[t[i]]=this.attr(t[i]);return out}var r;if(null!=e&&((r={})[t]=e),r=null==e&&"object"==typeof t?t:r)for(var a in r)this.group.attrs[a]=r[a],this.group.setAttribute(a,r[a]);return this.group},this.group}var r,u},Raphael._availableAttrs={...Raphael._availableAttrs,id:""};function o(t,e){if(e)for(var r in"string"==typeof t&&(t=o(t)),e)e.hasOwnProperty(r)&&("xlink:"==r.substring(0,6)?t.setAttributeNS(xlink,r.substring(6),String(e[r])):t.setAttribute(r,String(e[r])));else(t=Raphael._g.doc.createElementNS("http://www.w3.org/2000/svg",t)).style&&(t.style.webkitTapHighlightColor="rgba(0,0,0,0)");return t}Raphael._engine.group=function(t,e,r,i,a,n){var s=o("g");t.canvas&&t.canvas.appendChild(s);t=new Raphael.el.constructor(s,t);return e&&(t.attrs={id:e}),t.attrs={...t.attrs,x:r,y:i,width:a,height:n,fill:"none",stroke:"none"},t.type="group",o(s,t.attrs),t},Raphael.fn.group=function(t,e,r,i,a){a=Raphael._engine.group(this,e||0,r||0,i||0,a||0);return this.__set__&&this.__set__.push(a),a},Raphael.fn.addv2=function(t){var u={circle:1,rect:1,path:1,ellipse:1,text:1,image:1,group:1},l="hasOwnProperty";function p(e,t){for(var r,i,a=e.set(),n=0,s=t.length;n<s;n++)if("group"===(i=t[n]||{}).type){var o=p(e,i.children);let t=i.indices;var h=i.id;delete i.indices,delete i.id,(r=e[i.type](o).attr(i)).node.setAttribute("data-id",h),r.node.setAttribute("data-indices",t.join(",")),function(t,e){const r=document.createDocumentFragment();e.forEach(t=>{t=t[0];Array.isArray(t)?t.forEach(t=>r.appendChild(t)):r.appendChild(t)}),t.appendChild(r)}(r[0],o.items),o=a.push(r)}else u[l](i.type)&&(i=e[i.type]().attr(i),o=a.push(i));return o}Raphael.is(t,"array")&&p(this,t)}}();