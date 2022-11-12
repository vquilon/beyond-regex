function EditorAdvance(e={}){let h=[{date:Date.now(),zActions:1,name:"init"}],p=0,y=[],x=[],w=e.$containerEditor,C=w.querySelector(".input-carets"),S=w.querySelector(".input-selects"),A=e.$inputRegex,u=e.$syntaxRegex,P=C.parentElement,r=w.querySelector("#editor-input"),f=void 0,t=(e.debugInputClass&&((f=document.createElement("div")).classList.add(e.debugInputClass),P.appendChild(f)),{});const b=()=>{C.timeoutBlink&&clearTimeout(C.timeoutBlink),C.classList.remove("blink"),C.timeoutBlink=window.setTimeout(()=>{C.classList.add("blink")},500)},i=()=>{let e=window.getComputedStyle(document.documentElement),t=e.getPropertyValue("--font-size");return parseFloat(t.substring(0,t.length-2))},g=e=>{if(e.hasOwnProperty("charWidth")&&e.charWidth)return e.charWidth;let t=document.createElement("span");t.innerText="0",t.style.opacity="0",e.appendChild(t);var r=t.getBoundingClientRect().width;return t.remove(),e.charWidth=r},c=(e=0)=>(0===e&&(e=i()),t.hasOwnProperty(e)||(t[e]=g(u)),t[e]),v=(e=0)=>{0===e&&(e=i());let t=window.getComputedStyle(document.documentElement);return e*parseFloat(t.getPropertyValue("--line-height-ratio"))},N=(r,n,e=!1)=>{var o=Array.from(C.children);let i;for(let t=0;t<o.length;t++){let e=o[t];if(parseInt(e.style.getPropertyValue("--pos-char"))===r&&parseInt(e.style.getPropertyValue("--pos-line"))===n){i=e;break}}return!i||e?((i=document.createElement("span")).classList.add("caret"),C.appendChild(i)):(C.removeChild(i),i=void 0),i},l=(r,n,o=void 0)=>{var i=r,a=n;if(0===r&&0===n){let e=document.createRange(),t=window.getSelection();t.removeAllRanges(),e.setStart(o,r),e.setEnd(o,n),t.addRange(e)}else{r=Math.min(o.innerText.length,r),n=Math.min(o.innerText.length,n);var[l,r]=D(r,o),[s,n]=D(n,o);r=Math.min(o.innerText.length,r),n=Math.min(o.innerText.length,n);let e=document.createRange(),t=window.getSelection();t.removeAllRanges(),a<i?(e.setStart(s,n),e.setEnd(l,r),e.collapse(!1),t.addRange(e),t.extend(s,n)):(e.setStart(l,r),e.setEnd(s,n),t.addRange(e))}},R=(e,t,r,n)=>{var o,[e,t,r]=T(e,t,r,n);return n=e,o=t,(r=r)&&(r=n,n=o,o=r),l(n,o,$toNode=A),[e,t]},D=(t,e)=>{if(3===e.nodeType)return[e,t];var r=e.childNodes;let n=0,o=0,i=void 0;for(let e=0;e<r.length;e++){if(i=r[e],t<=(o+=i.textContent.length)){if(t-n>i.childNodes.length)return D(t-n,i);break}n+=i.textContent.length}return[i,t-n]},E=e=>{let t=0,r=0,n=!1;if("TEXTAREA"===e.nodeName)t=e.selectionStart,r=e.selectionEnd,n="backward"===e.selectionDirection;else if(void 0!==window.getSelection){const i=window.getSelection();if(0!==i.rangeCount){var o=i.anchorNode.compareDocumentPosition(i.focusNode);n=!1,(!o&&i.anchorOffset>i.focusOffset||o===Node.DOCUMENT_POSITION_PRECEDING)&&(n=!0);const a=i.getRangeAt(0),l=a.cloneRange(),s=(l.selectNodeContents(e),l.setEnd(a.startContainer,a.startOffset),t=l.toString().length,a.cloneRange());s.selectNodeContents(e),s.setEnd(a.endContainer,a.endOffset),r=s.toString().length}}return n?[r,t]:[t,r]},L=()=>Array.from(C.children),k=()=>{var t=window.getSelection().getRangeAt(0).getClientRects();v();if(0!==t.length)return{x:t[0].x,y:t[0].y,width:t[0].width,height:t[0].height};{t=A;let e={x:0,y:0,width:1,height:v()};if("TEXTAREA"===t.nodeName)prePosition=t.selectionStart,postPosition=t.selectionEnd,t.selectionDirection;else if(void 0!==window.getSelection){const i=window.getSelection();if(0!==i.rangeCount){const a=i.getRangeAt(0);var[r,n]=E(t),[r,o]=D(r,t),[n,t]=D(n,t);a.setStart(r,o),a.setEnd(n,t),e=a.getClientRects()[0]}}return{x:e.x,y:e.y,width:e.width,height:e.height}}},T=(e,t,r,n)=>{var[e,t,r,n]=I({x:e,y:t},{x:r,y:n}),[e,t]=M(e,t,r,n);return[e,t,t<e]},M=(t,e,r,n)=>{0===x.length&&m();var o=c();let i=0,a=0;for(let e=0;e<x.length;e++){var l=x[e],l=parseInt((l.width+2)/o);e<t&&(i+=l),e<r&&(a+=l)}return i+=e,a+=n,[i,a]},s=(e,t)=>{0===x.length&&m();var r=c();let n=0,o=Math.min(e,A.innerText.length),i=0,a=Math.min(t,A.innerText.length),l=!0,s=!0;for(let e=0;e<x.length;e++){var d=x[e],d=parseInt((d.width+2)/r);o>d&&l?(o-=d,n++):l=!1,a>d&&s?(a-=d,i++):s=!1}return[n,o,i,a]},Z=(e,t)=>{var r=i(),n=v(r),r=c(r),o=A.getBoundingClientRect();return caretPosX=r*t+o.x,caretPosY=n*e+o.y,[caretPosX,caretPosY]},I=(e,t)=>{var r=g(u),n=v(),o=A.getBoundingClientRect();let i=parseInt((e.y-o.y)/n),a=parseInt((t.y-o.y)/n),l=e,s=t,d=!1;return i===a&&e.x>t.x&&(s=e,l=t,d=!0),i>a&&(s=e,l=t,n=i,i=a,a=n,d=!0),e=i,t=a,[e,Math.round((l.x-o.x)/r),t,Math.round((s.x-o.x)/r),d]},m=()=>{var e,t,r,n=A.getBoundingClientRect();let o=window.getSelection(),i=void 0,a=(1<=o.rangeCount&&(i=o.getRangeAt(0)),o.selectAllChildren(u),Array.from(o.getRangeAt(0).getClientRects())),l=(o.removeAllRanges(),i&&o.addRange(i),a=a.sort((e,t)=>e.y-t.y),x=[],window.newLines={},0===a.length&&a.push({bottom:n.bottom,height:n.height,left:n.left,right:n.left,top:n.top,width:0,x:n.x,y:n.y}),a[0].y),s={bottom:0,height:0,left:1/0,right:0,top:1/0,width:0,x:1/0,y:0};for(d in a){var d=parseInt(d),g=a[d];g.y>l&&(l=g.y,s.width=s.right-s.left,s.height=s.bottom-s.top,x.push(s),s={bottom:0,height:0,left:1/0,right:0,top:1/0,width:0,x:1/0,y:0}),s={bottom:Math.max(g.bottom,s.bottom),left:Math.min(g.left,s.left),right:Math.max(g.right,s.right),top:Math.min(g.top,s.top),x:Math.min(g.x,s.x),y:Math.max(g.y,s.y)},d>=a.length-1&&(s.width=s.right-s.left,s.height=s.bottom-s.top,x.push(s))}for(e of x)e.y-=n.y,e.x-=n.x,e.top-=n.top,e.bottom=e.height+e.top,e.left-=n.left,e.right=e.width+e.left;if("\n\n"===A.textContent.slice(-2)&&(t=x[x.length-1],r=x[0],x.push({bottom:t.bottom+r.top+t.height,height:t.height,left:t.left,right:t.left,top:t.bottom+r.top,width:0,x:t.x,y:t.bottom+r.top})),void 0!==f){f.innerHTML="";for(var c of x){let e=document.createElement("span");e.style.width=c.width+"px",e.style.height=c.height+"px",e.style.left=c.left+"px",e.style.top=c.top+"px",e.style.position="absolute",e.style.background="#0000ff1f",e.classList.add("boxSel"),f.appendChild(e)}}},V=(e,t=!1)=>{0===x.length&&m();let r;for(var n in x)e>=(n=x[n]).y&&(r=n);return r&&(r=Object.keys(r).reduce((e,t)=>(e[t]=r[t],e),{}),t&&(t=A.getBoundingClientRect(),r.y+=t.y,r.x+=t.x,r.top+=t.top,r.bottom+=t.top,r.left+=t.left,r.right+=t.left)),r},H=()=>(0===x.length&&m(),x.length-1),X=(e,t)=>{var r=g(u),n=v(),o=H();let i=o<e?o:e;if(i=Math.max(i,0),!(n=V(i*n+n/2)))return[t,1/0,e];e=Math.round((n.x+n.width)/r);let a=Math.min(t,e);return t!==1/0&&e<t&&i!=o&&(i+=1,a=0),[i,a,e]},$=(e,{$caret:t=void 0,ctrlKey:r=!1,wheelKey:n=!1,dragStyle:o=!1,resetFirst:i=!1})=>{var a,l=A.getBoundingClientRect();return e={x:e.x-l.x,y:e.y-l.y},void 0!==(l=V(e.y))&&(e={x:Math.min(e.x,l.x+l.width),y:l.y+l.height/2},l=g(u),a=v(),a=parseInt(e.y/a),l=Math.round(e.x/l),t=O(a,l,{$caret:t,ctrlKey:r,wheelKey:n,dragStyle:o,resetFirst:i})),[e,t]},O=(t,r,{$caret:n=void 0,ctrlKey:o=!1,dragStyle:i=!1,resetFirst:e=!1})=>{var a,l=void 0===n;let s=void 0,d=void 0;if(void 0===n){let e=L();if(0===e.length||o&&!i||i)n=N(r,t,i);else{n=e.pop();for(var g of e)C.removeChild(g);s=t,d=r}}return void 0!==n&&(o=parseInt(n.style.getPropertyValue("--pos-char"))||r,a=parseInt(n.style.getPropertyValue("--pos-line"))||t,s=l||e?t:s,d=l||e?r:d,l=a===t?r:o,B(n,t,r,s,d,l),i||U()),n},U=()=>{var e,t=L(),r=v();let n=[];S.innerHTML="";for(e of t){var o=parseInt(e.style.getPropertyValue("--fpos-line")),i=parseInt(e.style.getPropertyValue("--pos-line")),[a,l]=Z(o,parseInt(e.style.getPropertyValue("--fpos-char"))),[s,d]=Z(i,parseInt(e.style.getPropertyValue("--pos-char")));if(i!==o){let e=!1;i<o&&(e=!0);var g=V(o*r+r/2,absolutePos=!0),c=V(i*r+r/2,absolutePos=!0);if(g&&c&&(e?(n.push({top:l,bottom:l+r,height:r,width:a-g.left,left:g.left,right:a,x:g.left,y:l}),n.push({bottom:c.bottom,top:c.top,height:r,width:c.right-s,left:s,right:c.right,x:s,y:c.y})):(n.push({top:g.top,bottom:g.bottom,height:r,width:g.right-a,left:a,right:g.right,x:a,y:g.y}),n.push({top:c.top,bottom:c.bottom,height:r,width:s-c.left,left:c.left,right:s,x:c.x,y:c.y}))),0<Math.abs(i-o))for(let e=Math.min(o,i)+1;e<Math.max(o,i);e++){var h=V(e*r+r/2,absolutePos=!0);h&&n.push(h)}}else a!==s&&(l=s<a,n.push({top:d,bottom:d+r,height:r,width:Math.abs(s-a),left:l?s:a,right:l?a:s,x:l?s:a,y:d}))}var p,t=n,y=v(),u=A.getBoundingClientRect();S.innerHTML="";for(p of t)($caretSelection=document.createElement("span")).classList.add("caret-selection"),$caretSelection.style.setProperty("--pos-x",p.x-u.x),$caretSelection.style.setProperty("--pos-y",p.y-u.y),$caretSelection.style.setProperty("--size-width",p.width),$caretSelection.style.setProperty("--size-height",y),S.append($caretSelection)},B=(e,t,r,n,o,i)=>{e.style.setProperty("--pos-line",t),e.style.setProperty("--pos-char",r),void 0!==n&&e.style.setProperty("--fpos-line",n),void 0!==o&&e.style.setProperty("--fpos-char",o),e.style.setProperty("--max-pos-char",i);var i=n||parseFloat(e.style.getPropertyValue("--fpos-line")),n=o||parseFloat(e.style.getPropertyValue("--fpos-char")),o=t,t=r,[r,i]=M(i,n,o,t);e.style.setProperty("--offset-start",r),e.style.setProperty("--offset-end",i)},K=e=>{var t=parseInt(e.style.getPropertyValue("--pos-char")),r=parseInt(e.style.getPropertyValue("--pos-line")),n=parseFloat(e.style.getPropertyValue("--fpos-char")),e=parseFloat(e.style.getPropertyValue("--fpos-line")),o=A.getBoundingClientRect(),i=g(u),a=v();return[{x:n*i+o.x,y:e*a+o.y},{x:t*i+o.x,y:r*a+o.y}]},o=(e,t)=>{var r=Array.from(S.children);let n;var o=A.getBoundingClientRect();for(n of r){var i=parseFloat(n.style.getPropertyValue("--pos-x"))+o.x,a=parseFloat(n.style.getPropertyValue("--pos-y"))+o.y,l=parseFloat(n.style.getPropertyValue("--size-width")),s=parseFloat(n.style.getPropertyValue("--size-height"));if(i<e&&e<i+l&&a<t&&t<a+s)return[n,{sx:i,sy:a,ex:i+l,ey:a+s}]}return[void 0,{sx:0,sy:0,ex:0,ey:0}]},n=(e,t)=>{A.internalDrag&&!getSelection().isCollapsed&&F(A.ownerDocument,"delete",{keepZAction:!1});var r,n=A.dragCaret.getBoundingClientRect(),[n,o]=(R(n.x,n.y,n.x,n.y),F(A.ownerDocument,"insertHTML",{value:e,nameZAction:"DroppedElement"}),x=[],E(A)),n=(r=n-e.length,o=o,l(r,o,$toNode=u),k()),e=(C.contains(A.dragCaret)&&C.removeChild(A.dragCaret),A.dragging=!1,A.dragCaret=void 0,A.internalDrag=!1,A.textSelection={sx:0,sy:0,ex:0,ey:0},$({x:n.x,y:n.y+n.height/2},{}),Array.from(C.children).slice(-1)[0]);$({x:n.x+n.width,y:n.y+n.height/2},{$caret:e}),P.focus()},d=e=>{var t=u.getBoundingClientRect();(e=e.target.getBoundingClientRect()).left>=t.left&&e.right<=t.right&&e.top>=t.top&&e.bottom<=t.bottom||(P.blur(),A.dragging&&A.dragCaret&&(C.contains(A.dragCaret)&&C.removeChild(A.dragCaret),A.dragging=!1,A.dragCaret=void 0,A.internalDrag=!1))},z=e=>{C.innerHTML="",S.innerHTML="";for(var t of e){var[r,n,o,i]=s(t.startOffset,t.endOffset),r=O(r,n,{ctrlKey:!0});t.startOffset!==t.endOffset&&O(o,i,{$caret:r,ctrlKey:!0})}},Y=(t,{showUI:r=!1,value:n=null})=>{if(0<p){var e=h[p].caretsOffset;for(let e=0;e<h[p].zActions;e++)t.execCommand("undo",r,n);--p,z(e)}},W=(t,{showUI:r=!1,value:n=null})=>{if(p<h.length-1){p+=1;for(let e=0;e<h[p].zActions;e++)t.execCommand("redo",r,n);var e=h[p].caretsOffset;z(e)}},F=(r,n,{showUI:o=!1,value:e=null,keepZAction:t=!0,nameZAction:i=""})=>{if("undo"===n)return Y(r,{showUI:o,value:e});if("redo"===n)return W(r,{showUI:o,value:e});if(r.execCommand(n,o,e),""===i&&(i=n),t){var l;let e=[];for(l of L()){var[s,d]=K(l),[s,d,g,c]=I(s,d),[s,d]=M(s,d,g,c);e.push({startOffset:s,endOffset:d})}r=[...y,{commandName:n}],y=[],p+=1,o=h[0];let t=0;1e4<=h.length&&(t=1),a=[o,...h.slice(t+1,p)],p=h.length,h.push({comands:r,date:Date.now(),zActions:r.length,name:i,caretsOffset:e})}else y.push({commandName:n})},q=(e,t,r,{showUI:n=!1,value:o=null,keepZAction:i=!0,nameZAction:a=""})=>{var l=t.ownerDocument;let s=t.ownerDocument.defaultView,d=s.getSelection(),g=new Range;[t,e]=D(e,t),g.setStart(t,e),g.setEnd(t,e),d.removeAllRanges(),d.addRange(g),F(l,r,{showUI:n,value:o,keepZAction:i,nameZAction:a})},j=(t,e,{pressedEvent:r=!1})=>{if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","End","Home","PageUp","PageDown"].includes(t.key)){if(e!==A){b();{var i=t;var a;i.preventDefault();for(a of L()){let o=parseInt(a.style.getPropertyValue("--max-pos-char"));var l=parseInt(a.style.getPropertyValue("--pos-char")),s=parseInt(a.style.getPropertyValue("--pos-line"));if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(i.key)){let e={ArrowLeft:(e,t)=>(--e<0&&(e=1/0,--t),[e,t]),ArrowRight:(e,t)=>[e+1,t],ArrowUp:(e,t)=>[e=Math.max(e,o),t-1],ArrowDown:(e,t)=>[e=Math.max(e,o),t+1]};var[d,g]=e[i.key](l,s);let[t,r,n]=X(g,d);n===1/0&&(r=l,t=s),o=["ArrowLeft","ArrowRight"].includes(i.key)?r:o,g=i.shiftKey?void 0:t,d=i.shiftKey?void 0:r,B(a,t,r,g,d,o)}else["End","Home","PageUp","PageDown"].includes(i.key)}U()}}}else if(t.ctrlKey&&!r){if(w!==A){var n=t;var o,c,h;if("A"===n.key.toUpperCase()&&(n.preventDefault(),[m,c,h]=X(H(),1/0),o=O(0,0,{}),O(m,c,{$caret:o})),"C"===n.key.toUpperCase()){let n,o=[];for(n of Array.from(C.children)){var[p,y]=K(n);let[e,t,r]=T(p.x,p.y,y.x,y.y);r&&(p=e,e=t,t=p),y=A.innerText.slice(e,t),o.push(y)}0!==o.length?(A.copiedText=o,navigator.clipboard.writeText(o.join("\n"))):console.error("Something was wrong")}"V"===n.key.toUpperCase()&&(x=[],S.innerHTML="",(async()=>{A.focus();let o=await navigator.clipboard.readText();var e=L();o=o.split("\n").length<e.length||o.split("\n").length>e.length?Array(e.length).fill(o):[o];for(let n=0;n<e.length;n++){var i=e[n],[i,a]=K(i),[i,a,l,s]=I(i,a),[i,a]=M(i,a,l,s);{var s=void 0,d=void 0,[i,a,d,g,{showUI:c=!1,value:h=null,keepZAction:p=!0,nameZAction:y=""}]=[i,a,A,"insertText",{value:o[n]}];l=d.ownerDocument;let e=d.ownerDocument.defaultView,t=e.getSelection(),r=new Range;[s,i]=D(i,d),[d,a]=D(a,d),r.setStart(s,i),r.setEnd(d,a),t.removeAllRanges(),t.addRange(r),F(l,g,{showUI:c,value:h,keepZAction:p,nameZAction:y})}}P.focus()})())}m=t,"Z"===m.key.toUpperCase()&&(x=[],m.preventDefault(),(m.shiftKey?W:Y)(A.ownerDocument,{}))}else if(!["Shift","CapsLock"].includes(t.key)&&e!==A){b(),P.editing=!0,L();for(let e=0;e<Array.from(C.children).length;e++){var u=Array.from(C.children)[e],[f,v]=K(u);R(f.x,f.y,v.x,v.y),((e,{pressedEvent:o=!1})=>{if(x=[],e.target,["Shift","Alt"].includes(e.key))e.preventDefault();else if(o){if("Enter"===e.key)return F(A.ownerDocument,"insertText",{value:"\n"}),!0;if(1===e.key.length)return F(A.ownerDocument,"insertText",{value:e.key}),!0}else{if("Tab"===e.key){e.preventDefault();var[o,i]=E(A);if(e.shiftKey)if(o===i)"\t"===A.innerText[o-1]&&F(A.ownerDocument,"delete",{});else{let e=[];var a,l,s=A.innerText.slice(0,Math.min(o,i)).lastIndexOf("\n");0<s&&"\t"===A.innerText[s-1]&&e.push(s);let t=A.innerText.slice(Math.min(o,i),Math.max(o,i)),r=0;for(a of t.split("\n"))""!==a?("\t"===a[1]&&e.push(r),r+=a):r+=1;let n=0;for(l of e)n<e.length?q(l,A,"delete",{keepZAction:!1}):q(l,A,"delete",{nameZAction:"outdent multiple lines"}),n+=1}else o===i&&F(A.ownerDocument,"insertHTML",{value:"\t"});return!0}if("Backspace"===e.key)return F(A.ownerDocument,"delete",{}),!0;if("Delete"===e.key)return F(A.ownerDocument,"forwardDelete",{}),!0}return!1})(t,{pressedEvent:r})&&(t.preventDefault(),v=k(),$(v,{$caret:u,resetFirst:!0}))}}var m;e!==A&&(window.getSelection().removeAllRanges(),P.focus(),P.editing=!1)};{u.addEventListener("mousedown",e=>{A.mousedown=!0,A.dragging&&(C.contains(A.dragCaret)&&C.removeChild(A.dragCaret),A.dragging=!1,A.dragCaret=void 0,A.internalDrag=!1,A.textSelection={sx:0,sy:0,ex:0,ey:0});let[t,r]=o(e.clientX,e.clientY);var n;void 0!==t?(n=parseFloat(t.style.getPropertyValue("--size-height")),A.textSelection={sx:r.sx,sy:r.sy+n/2,ex:r.ex,ey:r.ey-n/2},A.selecting=!1,A.internalDrag=!0,A.initSelecting=!0):(b(),A.initSelecting=!0,$({x:e.clientX,y:e.clientY},{$caret:void 0,ctrlKey:e.ctrlKey}))},!0),u.addEventListener("mousemove",r=>{if(0===r.which)A.selecting=!1;else if(A.initSelecting&&!A.internalDrag&&(A.initSelecting=!1,A.selecting=!0),A.selecting&&(e=C.lastChild,$({x:r.clientX,y:r.clientY},{$caret:e,wheelKey:2===r.which})),(A.internalDrag||A.dragging)&&1===r.which){var[e]=o(r.clientX,r.clientY);if(void 0===e){A.dragCaretPos={x:r.clientX,y:r.clientY};let[e,t]=$(A.dragCaretPos,{$caret:A.dragCaret,ctrlKey:!1,dragStyle:!0});A.dragCaretPos=e,t.classList.add("drag"),A.dragCaret=t}else C.contains(A.dragCaret)&&C.removeChild(A.dragCaret),A.dragging=!0,A.dragCaret=void 0,A.initSelecting=!1}},!0),u.addEventListener("mouseup",e=>{var t,r;A.selecting=!1,A.mousedown=!1,A.dragging?([r,t]=o(e.clientX,e.clientY),void 0===r?(S.innerHTML="",window.getSelection().removeAllRanges(),R(A.textSelection.sx,A.textSelection.sy,A.textSelection.ex,A.textSelection.ey),r=window.getSelection().toString(),n(r)):(A.dragging=!1,A.dragCaret=void 0,A.internalDrag=!1,A.textSelection={sx:0,sy:0,ex:0,ey:0})):!e.ctrlKey&&A.initSelecting?(A.initSelecting=!1,A.internalDrag=!1,b(),$({x:e.clientX,y:e.clientY},{$caret:void 0})):A.initSelecting=!1},!0),u.addEventListener("dragstart",function(e){e.preventDefault()},!1),P.addEventListener("mouseleave",e=>{A.dragging&&d(e)},!1),u.addEventListener("dragover",e=>{e.preventDefault(),A.dragCaretPos={x:e.clientX,y:e.clientY};let[t,r]=$(A.dragCaretPos,{$caret:A.dragCaret,ctrlKey:!1,dragStyle:!0});A.dragCaretPos=t,r.classList.add("drag"),A.dragCaret=r},!1),u.addEventListener("dragenter",e=>{var t=u.getBoundingClientRect();(e=e.target.getBoundingClientRect()).left>=t.left&&e.right<=t.right&&e.top>=t.top&&e.bottom<=t.bottom&&(A.dragging||(A.selecting=!1,C.innerHTML="",S.innerHTML="",A.dragging=!0,A.mousedown&&(A.internalDrag=!0)),P.focus())},!1),u.addEventListener("dragleave",d,!1),u.addEventListener("drop",function(e){e.preventDefault(),e=e.dataTransfer.getData("Text"),A.internalDrag&&(S.innerHTML="",window.getSelection().removeAllRanges(),R(A.textSelection.sx,A.textSelection.sy,A.textSelection.ex,A.textSelection.ey)),n(e)},!1),P.addEventListener("blur",e=>{P.editing||(C.timeoutBlink&&clearTimeout(C.timeoutBlink),C.classList.remove("blink"),C.classList.add("nofocus"),S.classList.add("nofocus"))}),P.addEventListener("focus",e=>{C.classList.remove("nofocus"),S.classList.remove("nofocus"),b()}),A.addEventListener("change",e=>{x=[]}),P.addEventListener("keypress",e=>{j(e,e.target,{pressedEvent:!0})}),P.addEventListener("keydown",e=>{j(e,e.target,{})}),document.addEventListener("keydown",e=>{!e.ctrlKey||"Z"!==e.key.toUpperCase()&&"Y"!==e.key.toUpperCase()||e.preventDefault()});const _=new ResizeObserver(e=>{var t;x=[],m();for(t of L()){r=t;var[r,n]=[parseFloat(r.style.getPropertyValue("--offset-start")),parseFloat(r.style.getPropertyValue("--offset-end"))],[r,n,o,i]=s(r,n);B(t,o,i,r,n,i)}U()});_.observe(r)}}