function SVGPanZoom(t,e){this.init(t,e)}var optionsDefaults={viewportSelector:".svg-pan-zoom_viewport",panEnabled:!0,controlIconsEnabled:!1,zoomEnabled:!0,dblClickZoomEnabled:!0,mouseWheelZoomEnabled:!0,preventMouseEventsDefault:!0,zoomScaleSensitivity:.1,minZoom:.5,maxZoom:10,fit:!0,contain:!1,center:!0,refreshRate:"auto",beforeZoom:null,onZoom:null,beforePan:null,onPan:null,customEventsHandler:null,eventsListenerElement:null,onUpdatedCTM:null},passiveListenerOption={passive:!0},instancesStore=(SVGPanZoom.prototype.init=function(t,e){var o=this;this.svg=t,this.defs=t.querySelector("defs"),SVGUtils.setupSvgAttributes(this.svg),this.options=Utils.extend(Utils.extend({},optionsDefaults),e),this.state="none",t=SVGUtils.getBoundingClientRectNormalized(t),this.width=t.width,this.height=t.height,this.viewport=new ShadowViewport(SVGUtils.getOrCreateViewport(this.svg,this.options.viewportSelector),{svg:this.svg,width:this.width,height:this.height,fit:this.options.fit,contain:this.options.contain,center:this.options.center,refreshRate:this.options.refreshRate,beforeZoom:function(t,e){if(o.viewport&&o.options.beforeZoom)return o.options.beforeZoom(t,e)},onZoom:function(t){if(o.viewport&&o.options.onZoom)return o.options.onZoom(t)},beforePan:function(t,e){if(o.viewport&&o.options.beforePan)return o.options.beforePan(t,e)},onPan:function(t){if(o.viewport&&o.options.onPan)return o.options.onPan(t)},onUpdatedCTM:function(t){if(o.viewport&&o.options.onUpdatedCTM)return o.options.onUpdatedCTM(t)}}),(t=this.getPublicInstance()).setBeforeZoom(this.options.beforeZoom),t.setOnZoom(this.options.onZoom),t.setBeforePan(this.options.beforePan),t.setOnPan(this.options.onPan),t.setOnUpdatedCTM(this.options.onUpdatedCTM),this.options.controlIconsEnabled&&ControlIcons.enable(this),this.lastMouseWheelEventTime=Date.now(),this.setupHandlers()},SVGPanZoom.prototype.setupHandlers=function(){var t,o=this,n=null;if(this.eventListeners={mousedown:function(t){var e=o.handleMouseDown(t,n);return n=t,e},touchstart:function(t){var e=o.handleMouseDown(t,n);return n=t,e},mouseup:function(t){return o.handleMouseUp(t)},touchend:function(t){return o.handleMouseUp(t)},mousemove:function(t){return o.handleMouseMove(t)},touchmove:function(t){return o.handleMouseMove(t)},mouseleave:function(t){return o.handleMouseUp(t)},touchleave:function(t){return o.handleMouseUp(t)},touchcancel:function(t){return o.handleMouseUp(t)}},null!=this.options.customEventsHandler){this.options.customEventsHandler.init({svgElement:this.svg,eventsListenerElement:this.options.eventsListenerElement,instance:this.getPublicInstance()});var e=this.options.customEventsHandler.haltEventListeners;if(e&&e.length)for(var i=e.length-1;0<=i;i--)this.eventListeners.hasOwnProperty(e[i])&&delete this.eventListeners[e[i]]}for(t in this.eventListeners)(this.options.eventsListenerElement||this.svg).addEventListener(t,this.eventListeners[t],this.options.preventMouseEventsDefault?{passive:!1}:passiveListenerOption);this.options.mouseWheelZoomEnabled&&(this.options.mouseWheelZoomEnabled=!1,this.enableMouseWheelZoom())},SVGPanZoom.prototype.enableMouseWheelZoom=function(){var e,t;this.options.mouseWheelZoomEnabled||((e=this).wheelListener=function(t){return e.handleMouseWheel(t)},t=!this.options.preventMouseEventsDefault,Wheel.on(this.options.eventsListenerElement||this.svg,this.wheelListener,t),this.options.mouseWheelZoomEnabled=!0)},SVGPanZoom.prototype.disableMouseWheelZoom=function(){var t;this.options.mouseWheelZoomEnabled&&(t=!this.options.preventMouseEventsDefault,Wheel.off(this.options.eventsListenerElement||this.svg,this.wheelListener,t),this.options.mouseWheelZoomEnabled=!1)},SVGPanZoom.prototype.handleMouseWheel=function(t){var e,o;this.options.zoomEnabled&&"none"===this.state&&(this.options.preventMouseEventsDefault&&(t.preventDefault?t.preventDefault():t.returnValue=!1),o=t.deltaY||1,e=Date.now()-this.lastMouseWheelEventTime,e=3+Math.max(0,30-e),this.lastMouseWheelEventTime=Date.now(),o=-.3<(o="deltaMode"in t&&0===t.deltaMode&&t.wheelDelta?0===t.deltaY?0:Math.abs(t.wheelDelta)/t.deltaY:o)&&o<.3?o:(0<o?1:-1)*Math.log(Math.abs(o)+10)/e,e=this.svg.getScreenCTM().inverse(),e=SVGUtils.getEventPoint(t,this.svg).matrixTransform(e),o=Math.pow(1+this.options.zoomScaleSensitivity,-1*o),this.zoomAtPoint(o,e))},SVGPanZoom.prototype.zoomAtPoint=function(t,e,o){var n=this.viewport.getOriginalState();o?(t=Math.max(this.options.minZoom*n.zoom,Math.min(this.options.maxZoom*n.zoom,t)),t/=this.getZoom()):this.getZoom()*t<this.options.minZoom*n.zoom?t=this.options.minZoom*n.zoom/this.getZoom():this.getZoom()*t>this.options.maxZoom*n.zoom&&(t=this.options.maxZoom*n.zoom/this.getZoom()),n=this.viewport.getCTM(),e=e.matrixTransform(n.inverse()),e=this.svg.createSVGMatrix().translate(e.x,e.y).scale(t).translate(-e.x,-e.y),(e=n.multiply(e)).a!==n.a&&this.viewport.setCTM(e)},SVGPanZoom.prototype.zoom=function(t,e){this.zoomAtPoint(t,SVGUtils.getSvgCenterPoint(this.svg,this.width,this.height),e)},SVGPanZoom.prototype.publicZoom=function(t,e){e&&(t=this.computeFromRelativeZoom(t)),this.zoom(t,e)},SVGPanZoom.prototype.publicZoomAtPoint=function(t,e,o){if(o&&(t=this.computeFromRelativeZoom(t)),"SVGPoint"!==Utils.getType(e)){if(!("x"in e&&"y"in e))throw new Error("Given point is invalid");e=SVGUtils.createSVGPoint(this.svg,e.x,e.y)}this.zoomAtPoint(t,e,o)},SVGPanZoom.prototype.getZoom=function(){return this.viewport.getZoom()},SVGPanZoom.prototype.getRelativeZoom=function(){return this.viewport.getRelativeZoom()},SVGPanZoom.prototype.computeFromRelativeZoom=function(t){return t*this.viewport.getOriginalState().zoom},SVGPanZoom.prototype.resetZoom=function(){var t=this.viewport.getOriginalState();this.zoom(t.zoom,!0)},SVGPanZoom.prototype.resetPan=function(){this.pan(this.viewport.getOriginalState())},SVGPanZoom.prototype.reset=function(){this.resetZoom(),this.resetPan()},SVGPanZoom.prototype.handleDblClick=function(t){if(this.options.preventMouseEventsDefault&&(t.preventDefault?t.preventDefault():t.returnValue=!1),this.options.controlIconsEnabled&&-1<(t.target.getAttribute("class")||"").indexOf("svg-pan-zoom-control"))return!1;var e=t.shiftKey?1/(2*(1+this.options.zoomScaleSensitivity)):2*(1+this.options.zoomScaleSensitivity),t=SVGUtils.getEventPoint(t,this.svg).matrixTransform(this.svg.getScreenCTM().inverse());this.zoomAtPoint(e,t)},SVGPanZoom.prototype.handleMouseDown=function(t,e){this.options.preventMouseEventsDefault&&(t.preventDefault?t.preventDefault():t.returnValue=!1),Utils.mouseAndTouchNormalize(t,this.svg),this.options.dblClickZoomEnabled&&Utils.isDblClick(t,e)?this.handleDblClick(t):(this.state="pan",this.firstEventCTM=this.viewport.getCTM(),this.stateOrigin=SVGUtils.getEventPoint(t,this.svg).matrixTransform(this.firstEventCTM.inverse()))},SVGPanZoom.prototype.handleMouseMove=function(t){this.options.preventMouseEventsDefault&&(t.preventDefault?t.preventDefault():t.returnValue=!1),"pan"===this.state&&this.options.panEnabled&&(t=SVGUtils.getEventPoint(t,this.svg).matrixTransform(this.firstEventCTM.inverse()),t=this.firstEventCTM.translate(t.x-this.stateOrigin.x,t.y-this.stateOrigin.y),this.viewport.setCTM(t))},SVGPanZoom.prototype.handleMouseUp=function(t){this.options.preventMouseEventsDefault&&(t.preventDefault?t.preventDefault():t.returnValue=!1),"pan"===this.state&&(this.state="none")},SVGPanZoom.prototype.fit=function(){var t=this.viewport.getViewBox(),t=Math.min(this.width/t.width,this.height/t.height);this.zoom(t,!0)},SVGPanZoom.prototype.contain=function(){var t=this.viewport.getViewBox(),t=Math.max(this.width/t.width,this.height/t.height);this.zoom(t,!0)},SVGPanZoom.prototype.center=function(){var t=this.viewport.getViewBox(),e=.5*(this.width-(t.width+2*t.x)*this.getZoom()),t=.5*(this.height-(t.height+2*t.y)*this.getZoom());this.getPublicInstance().pan({x:e,y:t})},SVGPanZoom.prototype.updateBBox=function(){this.viewport.simpleViewBoxCache()},SVGPanZoom.prototype.pan=function(t){var e=this.viewport.getCTM();e.e=t.x,e.f=t.y,this.viewport.setCTM(e)},SVGPanZoom.prototype.panBy=function(t){var e=this.viewport.getCTM();e.e+=t.x,e.f+=t.y,this.viewport.setCTM(e)},SVGPanZoom.prototype.getPan=function(){var t=this.viewport.getState();return{x:t.x,y:t.y}},SVGPanZoom.prototype.resize=function(){var t=SVGUtils.getBoundingClientRectNormalized(this.svg);this.width=t.width,this.height=t.height,(t=this.viewport).options.width=this.width,t.options.height=this.height,t.processCTM(),this.options.controlIconsEnabled&&(this.getPublicInstance().disableControlIcons(),this.getPublicInstance().enableControlIcons())},SVGPanZoom.prototype.destroy=function(){var t,e=this;for(t in this.beforeZoom=null,this.onZoom=null,this.beforePan=null,this.onPan=null,(this.onUpdatedCTM=null)!=this.options.customEventsHandler&&this.options.customEventsHandler.destroy({svgElement:this.svg,eventsListenerElement:this.options.eventsListenerElement,instance:this.getPublicInstance()}),this.eventListeners)(this.options.eventsListenerElement||this.svg).removeEventListener(t,this.eventListeners[t],!this.options.preventMouseEventsDefault&&passiveListenerOption);this.disableMouseWheelZoom(),this.getPublicInstance().disableControlIcons(),this.reset(),instancesStore=instancesStore.filter(function(t){return t.svg!==e.svg}),delete this.options,delete this.viewport,delete this.publicInstance,delete this.pi,this.getPublicInstance=function(){return null}},SVGPanZoom.prototype.getPublicInstance=function(){var o=this;return this.publicInstance||(this.publicInstance=this.pi={viewport:o.viewport,enablePan:function(){return o.options.panEnabled=!0,o.pi},disablePan:function(){return o.options.panEnabled=!1,o.pi},isPanEnabled:function(){return!!o.options.panEnabled},pan:function(t){return o.pan(t),o.pi},panBy:function(t){return o.panBy(t),o.pi},getPan:function(){return o.getPan()},setBeforePan:function(t){return o.options.beforePan=null===t?null:Utils.proxy(t,o.publicInstance),o.pi},setOnPan:function(t){return o.options.onPan=null===t?null:Utils.proxy(t,o.publicInstance),o.pi},enableZoom:function(){return o.options.zoomEnabled=!0,o.pi},disableZoom:function(){return o.options.zoomEnabled=!1,o.pi},isZoomEnabled:function(){return!!o.options.zoomEnabled},enableControlIcons:function(){return o.options.controlIconsEnabled||(o.options.controlIconsEnabled=!0,ControlIcons.enable(o)),o.pi},disableControlIcons:function(){return o.options.controlIconsEnabled&&(o.options.controlIconsEnabled=!1,ControlIcons.disable(o)),o.pi},isControlIconsEnabled:function(){return!!o.options.controlIconsEnabled},enableDblClickZoom:function(){return o.options.dblClickZoomEnabled=!0,o.pi},disableDblClickZoom:function(){return o.options.dblClickZoomEnabled=!1,o.pi},isDblClickZoomEnabled:function(){return!!o.options.dblClickZoomEnabled},enableMouseWheelZoom:function(){return o.enableMouseWheelZoom(),o.pi},disableMouseWheelZoom:function(){return o.disableMouseWheelZoom(),o.pi},isMouseWheelZoomEnabled:function(){return!!o.options.mouseWheelZoomEnabled},setZoomScaleSensitivity:function(t){return o.options.zoomScaleSensitivity=t,o.pi},setMinZoom:function(t){return o.options.minZoom=t,o.pi},setMaxZoom:function(t){return o.options.maxZoom=t,o.pi},setBeforeZoom:function(t){return o.options.beforeZoom=null===t?null:Utils.proxy(t,o.publicInstance),o.pi},setOnZoom:function(t){return o.options.onZoom=null===t?null:Utils.proxy(t,o.publicInstance),o.pi},zoom:function(t){return o.publicZoom(t,!0),o.pi},zoomBy:function(t){return o.publicZoom(t,!1),o.pi},zoomAtPoint:function(t,e){return o.publicZoomAtPoint(t,e,!0),o.pi},zoomAtPointBy:function(t,e){return o.publicZoomAtPoint(t,e,!1),o.pi},zoomIn:function(){return this.zoomBy(1+o.options.zoomScaleSensitivity),o.pi},zoomOut:function(){return this.zoomBy(1/(1+o.options.zoomScaleSensitivity)),o.pi},getZoom:function(){return o.getRelativeZoom()},setOnUpdatedCTM:function(t){return o.options.onUpdatedCTM=null===t?null:Utils.proxy(t,o.publicInstance),o.pi},resetZoom:function(){return o.resetZoom(),o.pi},resetPan:function(){return o.resetPan(),o.pi},reset:function(){return o.reset(),o.pi},fit:function(){return o.fit(),o.pi},contain:function(){return o.contain(),o.pi},center:function(){return o.center(),o.pi},updateBBox:function(){return o.updateBBox(),o.pi},resize:function(){return o.resize(),o.pi},getSizes:function(){return{width:o.width,height:o.height,realZoom:o.getZoom(),viewBox:o.viewport.getViewBox()}},destroy:function(){return o.destroy(),o.pi}}),this.publicInstance},[]),svgPanZoom=function(t,e){var o=Utils.getSvg(t);if(null===o)return null;for(var n=instancesStore.length-1;0<=n;n--)if(instancesStore[n].svg===o)return instancesStore[n].instance.getPublicInstance();return instancesStore.push({svg:o,instance:new SVGPanZoom(o,e)}),instancesStore[instancesStore.length-1].instance.getPublicInstance()};