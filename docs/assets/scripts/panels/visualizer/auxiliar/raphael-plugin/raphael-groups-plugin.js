!function(){"use strict";Raphael.fn.group=function(t,e){if(1==Raphael.svg){this.svg="http://www.w3.org/2000/svg",this.dv=document.getElementById(t),this.defs=this.dv.getElementsByTagName("defs")[0];var a=this.defs,n=this.svg,t=(this.svgcanv=this.dv.getElementsByTagName("svg")[0],this.svgcanv.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink"),this.svgcanv.getElementsByTagName("g").length);h=/[xy]/g,l=function(t){var e=16*Math.random()|0;return("x"==t?e:3&e|8).toString(16)};for(this.group.attrs={},0==t?(this.masterGroup=document.createElementNS(this.svg,"g"),this.svgcanv.appendChild(this.masterGroup)):this.masterGroup=this.svgcanv.getElementsByTagName("g")[0],this.group=document.createElementNS(this.svg,"g"),i=0;i<e.length;i++)this.group.appendChild(e[i].node);this.masterGroup.appendChild(this.group),this.group.set=[];var r=this.masterGroup,s=(this.group.getMaster=function(){return r},this.group.remove=function(){this.parentNode.removeChild(this)},{translate:{x:0,y:0},scale:{x:1,y:1},rotate:{x:0,y:0,z:0}}),o=function(){return"translate("+s.translate.x+","+s.translate.y+") scale("+s.scale.x+","+s.scale.y+") rotate("+s.rotate.x+","+s.rotate.y+","+s.rotate.z+")"};return this.group.translate=function(t,e){s.translate.x=t,s.translate.y=e,this.setAttribute("transform",o())},this.group.rotate=function(t,e,r){s.rotate.x=t,s.rotate.y=e,s.rotate.z=r,this.setAttribute("transform",o())},this.group.scale=function(t,e){s.scale.x=t,s.scale.y=e,this.setAttribute("transform",o())},this.group.push=function(){for(i=0;i<arguments.length;i++)this.appendChild(arguments[i].node)},this.group.addElement=function(){for(i=0;i<arguments.length;i++)this.appendChild(arguments[i])},this.group.getAttr=function(t){return s[t]},this.group.copy=function(t){this.copy=t.node.cloneNode(!0),this.appendChild(this.copy)},this.group.toFront=function(){this.getMaster().appendChild(this)},this.group.clipPath=function(t){var e=document.createElementNS(n,"clipPath"),r="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(h,l).toUpperCase();e.setAttribute("id",r),e.appendChild(t.node),a.appendChild(e),this.setAttribute("clip-path","url(#"+r+")")},this.group.animate=function(){var t,e=this,r=arguments,a=r[0],i=r[2],n=(void 0!==o&&clearInterval(o),a.x),s=e.getAttr("translate").x,o=setInterval(function(){n<s?(t=(s-n)/10,e.getAttr("translate").x-t>n?e.translate(e.getAttr("translate").x-t,0):(e.translate(n,0),clearInterval(o),i())):(t=(n-s)/10,e.getAttr("translate").x+t<n?e.translate(e.getAttr("translate").x+t,0):(e.translate(n,0),clearInterval(o),i()))},10)},this.group.attr=function(t,e){if(this.attrs&&null==e&&"array"==typeof t){for(out={},i=0,ii=t.length;i<ii;i++)out[t[i]]=this.attr(t[i]);return out}var r;if(null!=e&&((r={})[t]=e),r=null==e&&"object"==typeof t?t:r)for(var a in r)this.group.attrs[a]=r[a],this.group.setAttribute(a,r[a]);return this.group},this.group}var h,l}}(),function(){function o(t,e){if(e)for(var r in"string"==typeof t&&(t=o(t)),e)e.hasOwnProperty(r)&&("xlink:"==r.substring(0,6)?t.setAttributeNS(xlink,r.substring(6),String(e[r])):t.setAttribute(r,String(e[r])));else(t=Raphael._g.doc.createElementNS("http://www.w3.org/2000/svg",t)).style&&(t.style.webkitTapHighlightColor="rgba(0,0,0,0)");return t}Raphael.fn.group=function(t){if(1==Raphael.svg){var a=this.defs,n=this.svg;h=/[xy]/g,l=function(t){var e=16*Math.random()|0;return("x"==t?e:3&e|8).toString(16)};for(this.group.attrs={},this.group=document.createElementNS(this.svg,"g"),i=0;i<t.length;i++)this.group.appendChild(t[i].node);function s(){return"translate("+o.translate.x+","+o.translate.y+") scale("+o.scale.x+","+o.scale.y+") rotate("+o.rotate.x+","+o.rotate.y+","+o.rotate.z+")"}this.masterGroup.appendChild(this.group),this.group.set=[];var e=this.masterGroup,o=(this.group.getMaster=function(){return e},this.group.remove=function(){this.parentNode.removeChild(this)},{translate:{x:0,y:0},scale:{x:1,y:1},rotate:{x:0,y:0,z:0}});return this.group.translate=function(t,e){o.translate.x=t,o.translate.y=e,this.setAttribute("transform",s())},this.group.rotate=function(t,e,r){o.rotate.x=t,o.rotate.y=e,o.rotate.z=r,this.setAttribute("transform",s())},this.group.scale=function(t,e){o.scale.x=t,o.scale.y=e,this.setAttribute("transform",s())},this.group.push=function(){for(i=0;i<arguments.length;i++)this.appendChild(arguments[i].node)},this.group.addElement=function(){for(i=0;i<arguments.length;i++)this.appendChild(arguments[i])},this.group.getAttr=function(t){return o[t]},this.group.copy=function(t){this.copy=t.node.cloneNode(!0),this.appendChild(this.copy)},this.group.toFront=function(){this.getMaster().appendChild(this)},this.group.clipPath=function(t){var e=document.createElementNS(n,"clipPath"),r="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(h,l).toUpperCase();e.setAttribute("id",r),e.appendChild(t.node),a.appendChild(e),this.setAttribute("clip-path","url(#"+r+")")},this.group.animate=function(){var t,e=this,r=arguments,a=r[0],i=r[2],n=(void 0!==o&&clearInterval(o),a.x),s=e.getAttr("translate").x,o=setInterval(function(){n<s?(t=(s-n)/10,e.getAttr("translate").x-t>n?e.translate(e.getAttr("translate").x-t,0):(e.translate(n,0),clearInterval(o),i())):(t=(n-s)/10,e.getAttr("translate").x+t<n?e.translate(e.getAttr("translate").x+t,0):(e.translate(n,0),clearInterval(o),i()))},10)},this.group.attr=function(t,e){if(this.attrs&&null==e&&"array"==typeof t){for(out={},i=0,ii=t.length;i<ii;i++)out[t[i]]=this.attr(t[i]);return out}var r;if(null!=e&&((r={})[t]=e),r=null==e&&"object"==typeof t?t:r)for(var a in r)this.group.attrs[a]=r[a],this.group.setAttribute(a,r[a]);return this.group},this.group}var h,l},Raphael._availableAttrs={...Raphael._availableAttrs,id:""},Raphael._engine.group=function(t,e,r,a,i,n){var s=o("g"),t=(t.canvas&&t.canvas.appendChild(s),new Raphael.el.constructor(s,t));return e&&(t.attrs={id:e}),t.attrs={...t.attrs,x:r,y:a,width:i,height:n,fill:"none",stroke:"none"},t.type="group",o(s,t.attrs),t},Raphael.fn.group=function(t,e,r,a,i){return e=Raphael._engine.group(this,e||0,r||0,a||0,i||0),this.__set__&&this.__set__.push(e),e},Raphael.fn.addv2=function(t){var u={circle:1,rect:1,path:1,ellipse:1,text:1,image:1,group:1},p="hasOwnProperty";Raphael.is(t,"array")&&function e(r,t){var a=r.set();if(void 0!==t)for(var i,n,s=0,o=t.length;s<o;s++)if("group"===(n=t[s]||{}).type){var h=e(r,n.children);let t;if(n[p]("dataset")&&(t=n.dataset,delete n.dataset),i=r[n.type](h).attr(n),void 0!==t)for(var l of Object.keys(t))i.node.setAttribute("data-"+l,t[l]);void 0!==h&&function(t,e){const r=document.createDocumentFragment();e.forEach(t=>{t=t[0],Array.isArray(t)?t.forEach(t=>r.appendChild(t)):r.appendChild(t)}),t.appendChild(r)}(i[0],h.items),h=a.push(i)}else u[p](n.type)&&(n=r[n.type]().attr(n),h=a.push(n));return h}(this,t)}}();