var _addEventListener,_removeEventListener,prefix="",fns=[],passiveOption={passive:!0};function createCallback(e,n){function t(e){var t={originalEvent:e=e||window.event,target:e.target||e.srcElement,type:"wheel",deltaMode:"MozMousePixelScroll"==e.type?0:1,deltaX:0,delatZ:0,preventDefault:function(){e.preventDefault?e.preventDefault():e.returnValue=!1}};return"mousewheel"==support?(t.deltaY=-.025*e.wheelDelta,e.wheelDeltaX&&(t.deltaX=-.025*e.wheelDeltaX)):t.deltaY=e.detail,n(t)}return fns.push({element:e,fn:t}),t}function getCallback(e){for(var t=0;t<fns.length;t++)if(fns[t].element===e)return fns[t].fn;return function(){}}function removeCallback(e){for(var t=0;t<fns.length;t++)if(fns[t].element===e)return fns.splice(t,1)}function _addWheelListener(e,t,n,r){n="wheel"===support?n:createCallback(e,n);e[_addEventListener](prefix+t,n,!!r&&passiveOption)}function _removeWheelListener(e,t,n,r){n="wheel"===support?n:getCallback(e);e[_removeEventListener](prefix+t,n,!!r&&passiveOption),removeCallback(e)}function addWheelListener(e,t,n){_addWheelListener(e,support,t,n),"DOMMouseScroll"==support&&_addWheelListener(e,"MozMousePixelScroll",t,n)}function removeWheelListener(e,t,n){_removeWheelListener(e,support,t,n),"DOMMouseScroll"==support&&_removeWheelListener(e,"MozMousePixelScroll",t,n)}window.addEventListener?(_addEventListener="addEventListener",_removeEventListener="removeEventListener"):(_addEventListener="attachEvent",_removeEventListener="detachEvent",prefix="on");var support="onwheel"in document.createElement("div")?"wheel":void 0!==document.onmousewheel?"mousewheel":"DOMMouseScroll",Wheel={on:addWheelListener,off:removeWheelListener};