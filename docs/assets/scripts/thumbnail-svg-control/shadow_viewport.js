function ShadowViewport(t,i){this.Utils=Utils,this.init(t,i)}ShadowViewport.prototype.init=function(t,i){this.viewport=t,this.options=i,this.originalState={zoom:1,x:0,y:0},this.activeState={zoom:1,x:0,y:0},this.updateCTMCached=this.Utils.proxy(this.updateCTM,this),this.requestAnimationFrame=this.Utils.createRequestAnimationFrame(this.options.refreshRate),this.viewBox={x:0,y:0,width:0,height:0},this.cacheViewBox();i=this.processCTM();this.setCTM(i),this.updateCTM()},ShadowViewport.prototype.cacheViewBox=function(){var t=this.options.svg.getAttribute("viewBox");t?(t=t.split(/[\s\,]/).filter(function(t){return t}).map(parseFloat),this.viewBox.x=t[0],this.viewBox.y=t[1],this.viewBox.width=t[2],this.viewBox.height=t[3],t=Math.min(this.options.width/this.viewBox.width,this.options.height/this.viewBox.height),this.activeState.zoom=t,this.activeState.x=(this.options.width-this.viewBox.width*t)/2,this.activeState.y=(this.options.height-this.viewBox.height*t)/2,this.updateCTMOnNextFrame(),this.options.svg.removeAttribute("viewBox")):this.simpleViewBoxCache()},ShadowViewport.prototype.simpleViewBoxCache=function(){var t=this.viewport.getBBox();this.viewBox.x=t.x,this.viewBox.y=t.y,this.viewBox.width=t.width,this.viewBox.height=t.height},ShadowViewport.prototype.getViewBox=function(){return this.Utils.extend({},this.viewBox)},ShadowViewport.prototype.processCTM=function(){var t,i,e=this.getCTM();return(this.options.fit||this.options.contain)&&(i=this.options.fit?Math.min(this.options.width/this.viewBox.width,this.options.height/this.viewBox.height):Math.max(this.options.width/this.viewBox.width,this.options.height/this.viewBox.height),e.a=i,e.d=i,e.e=-this.viewBox.x*i,e.f=-this.viewBox.y*i),this.options.center&&(t=.5*(this.options.width-(this.viewBox.width+2*this.viewBox.x)*e.a),i=.5*(this.options.height-(this.viewBox.height+2*this.viewBox.y)*e.a),e.e=t,e.f=i),this.originalState.zoom=e.a,this.originalState.x=e.e,this.originalState.y=e.f,e},ShadowViewport.prototype.getOriginalState=function(){return this.Utils.extend({},this.originalState)},ShadowViewport.prototype.getState=function(){return this.Utils.extend({},this.activeState)},ShadowViewport.prototype.getZoom=function(){return this.activeState.zoom},ShadowViewport.prototype.getRelativeZoom=function(){return this.activeState.zoom/this.originalState.zoom},ShadowViewport.prototype.computeRelativeZoom=function(t){return t/this.originalState.zoom},ShadowViewport.prototype.getPan=function(){return{x:this.activeState.x,y:this.activeState.y}},ShadowViewport.prototype.getCTM=function(){var t=this.options.svg.createSVGMatrix();return t.a=this.activeState.zoom,t.b=0,t.c=0,t.d=this.activeState.zoom,t.e=this.activeState.x,t.f=this.activeState.y,t},ShadowViewport.prototype.setCTM=function(t){var i,e,o,h=this.isZoomDifferent(t),s=this.isPanDifferent(t);(h||s)&&(h&&(!1===this.options.beforeZoom(this.getRelativeZoom(),this.computeRelativeZoom(t.a))?(t.a=t.d=this.activeState.zoom,h=!1):(this.updateCache(t),this.options.onZoom(this.getRelativeZoom()))),s&&((o=e=!1)===(i=this.options.beforePan(this.getPan(),{x:t.e,y:t.f}))?(t.e=this.getPan().x,t.f=this.getPan().y,e=o=!0):Utils.isObject(i)&&(!1===i.x?(t.e=this.getPan().x,e=!0):Utils.isNumber(i.x)&&(t.e=i.x),!1===i.y?(t.f=this.getPan().y,o=!0):Utils.isNumber(i.y)&&(t.f=i.y)),e&&o||!this.isPanDifferent(t)?s=!1:(this.updateCache(t),this.options.onPan(this.getPan()))),(h||s)&&this.updateCTMOnNextFrame())},ShadowViewport.prototype.isZoomDifferent=function(t){return this.activeState.zoom!==t.a},ShadowViewport.prototype.isPanDifferent=function(t){return this.activeState.x!==t.e||this.activeState.y!==t.f},ShadowViewport.prototype.updateCache=function(t){this.activeState.zoom=t.a,this.activeState.x=t.e,this.activeState.y=t.f},ShadowViewport.prototype.pendingUpdate=!1,ShadowViewport.prototype.updateCTMOnNextFrame=function(){this.pendingUpdate||(this.pendingUpdate=!0,this.requestAnimationFrame.call(window,this.updateCTMCached))},ShadowViewport.prototype.updateCTM=function(){var t=this.getCTM();SVGUtils.setCTM(this.viewport,t,this.defs),this.pendingUpdate=!1,this.options.onUpdatedCTM&&this.options.onUpdatedCTM(t)};