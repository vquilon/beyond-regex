function isDescendant(e,n){for(var t=n.parentNode;null!=t;){if(t==e)return!0;t=t.parentNode}return!1}window.onbeforeunload=function(e){var n;if((window.hasChanges||!1)&(window.hasUnsavedData||!0))return n="You have made changes since you last saved, leaving the website will result in a permanent loss of the data.",(e||window.event).returnValue=n},window.onload=function(){changeDark2LightTheme(),document.querySelector("#title .version").innerText=window.SW_VERSION+"."+window.SW_BUILD;let[n,t]=init_menu_listeners(),e=(document.addEventListener("mousemove",e=>{n(e,touch=!1)}),document.addEventListener("touchmove",e=>{n(e,touch=!0)},{passive:!1}),document.addEventListener("mouseup",e=>{t(e,touch=!1)}),document.addEventListener("touchend",e=>{t(e,touch=!0)}),offlineHandler(),Editor({debug:window.DEBUG})),o=e.init();document.addEventListener("keyup",e=>{"["!==e.key||isDescendant(o.editorParser.$input,window.getSelection().anchorNode)||document.querySelector("#close-side").click()}),panelVisualizer({editorParser:o.editorParser}).init()};
