function EditorSyntaxis(e={}){let s=[{date:Date.now(),zActions:1,name:"init"}],d=0,P=e.$containerEditor,l=P.querySelector(".input-carets"),A=e.$inputRegex,E=e.$syntaxRegex,S=l.parentElement,t=P.querySelector("#editor-input");var n=RegexHighlighter(A,E);let g=void 0;e.hasOwnProperty("debugInputClass")&&((g=document.createElement("div")).classList.add(e.debugInputClass),S.appendChild(g));{const p=(t,e)=>{if(3===e.nodeType)return[e,t];var n=e.childNodes;let r=0,o=0,i=void 0;for(let e=0;e<n.length;e++){if(i=n[e],t<=(o+=i.textContent.length)){if(t-r>i.childNodes.length)return p(t-r,i);break}r+=i.textContent.length}return[i,t-r]},D=t=>{let n=0,r=0,o=!1;if("TEXTAREA"===t.nodeName)n=t.selectionStart,r=t.selectionEnd,o="backward"===t.selectionDirection;else{var i=void 0!==window.getSelection;if(i)if(0!==window.getSelection().rangeCount){let e=getSelection();i=e.anchorNode.compareDocumentPosition(e.focusNode);o=!1,(!i&&e.anchorOffset>e.focusOffset||i===Node.DOCUMENT_POSITION_PRECEDING)&&(o=!0);const a=window.getSelection().getRangeAt(0),l=a.cloneRange(),s=(l.selectNodeContents(t),l.setEnd(a.startContainer,a.startOffset),n=l.toString().length,a.cloneRange());s.selectNodeContents(t),s.setEnd(a.endContainer,a.endOffset),r=s.toString().length}}return o?[r,n]:[n,r]},M=()=>{return l=P.querySelector(".input").querySelector(".input-carets"),Array.from(l.querySelectorAll(".caret"))},r=()=>{let e=window.getComputedStyle(document.documentElement),t=e.getPropertyValue("--font-size");return parseFloat(t.substring(0,t.length-2))},T=(e=0)=>{if(A.hasOwnProperty("fontSize")&&A.fontSize)return A.fontSize;0===e&&(e=r());let t=window.getComputedStyle(document.documentElement);return e*parseFloat(t.getPropertyValue("--line-height-ratio"))},c=(t,n,e=!1)=>{var r=Array.from(l.children);let o;for(let e=0;e<r.length;e++)if($caretAux=r[e],parseInt($caretAux.style.getPropertyValue("--pos-char"))===t&&parseInt($caretAux.style.getPropertyValue("--pos-line"))===n){o=$caretAux;break}return!o||e?((o=document.createElement("span")).classList.add("caret"),e=parseInt(o.style.getPropertyValue("--pos-char"))||0,e=Math.max(t,e),o.style.setProperty("--max-pos-char",e),o.style.setProperty("--pos-char",t),o.style.setProperty("--pos-line",n),l.appendChild(o)):(l.removeChild(o),o=void 0),o},y=(e,t,n,r)=>{let o=document,i,a,l=null;var s;return void 0!==o.caretPositionFromPoint?(i=o.caretPositionFromPoint(e,t),a=o.caretPositionFromPoint(n,r),(l=o.createRange()).setStart(i.offsetNode,i.offset),l.setEnd(a.offsetNode,a.offset)):void 0!==o.caretRangeFromPoint&&(i=o.caretRangeFromPoint(e,t),a=o.caretRangeFromPoint(n,r),(l=o.createRange()).setStart(i.startContainer,i.startOffset),l.setEnd(a.startContainer,a.startOffset)),null!==l&&void 0!==window.getSelection?((s=window.getSelection()).removeAllRanges(),s.addRange(l)):void 0!==o.body.createTextRange&&((l=o.body.createTextRange()).moveToPoint(e,t),(s=l.duplicate()).moveToPoint(n,r),l.setEndPoint("EndToEnd",s),l.select()),D(E)},o=(n,r,o=void 0)=>{if(0===n&&0===r){let e=document.createRange(),t=window.getSelection();t.removeAllRanges(),e.setStart(o,n),e.setEnd(o,r),t.addRange(e)}else{n=Math.min(o.innerText.length,n),r=Math.min(o.innerText.length,r);var[i,n]=p(n,o),[a,r]=p(r,o);n=Math.min(o.innerText.length,n),r=Math.min(o.innerText.length,r);let e=document.createRange(),t=window.getSelection();t.removeAllRanges(),r<n?(e.setStart(a,r),e.setEnd(i,n),e.collapse(!1),t.addRange(e),t.extend(a,r)):(e.setStart(i,n),e.setEnd(a,r),t.addRange(e))}},i=(e,t)=>{o(e,t,$toNode=A)},b=(e,t,n,r)=>{var[e,t]=y(e,t,n,r);return i(e,t),[e,t]},L=()=>{var e=window.getSelection().getRangeAt(0).getClientRects()[0];return{x:e.x,y:e.y}},k=e=>{if(e.hasOwnProperty("charWidth")&&e.charWidth)return e.charWidth;let t=document.createElement("span");t.innerText="0",t.style.opacity="0",e.appendChild(t);var n=t.getBoundingClientRect().width;return t.remove(),e.charWidth=n},u=(P.querySelector(".input").addEventListener("blur",e=>{P.querySelector(".input").editing||(P.querySelector(".input").querySelector(".input-carets").innerHTML="")}),()=>{var e,t,n,r=A.getBoundingClientRect();let o=window.getSelection(),i=(o.selectAllChildren(E),Array.from(o.getRangeAt(0).getClientRects())),a=(o.removeAllRanges(),i=i.sort((e,t)=>e.y-t.y),window.selRects=[],window.newLines={},i[0].y),l={bottom:0,height:0,left:1/0,right:0,top:1/0,width:0,x:1/0,y:0};for(e in i){e=parseInt(e);var s=i[e];s.y>a&&(a=s.y,l.width=l.right-l.left,l.height=l.bottom-l.top,window.selRects.push(l),l={bottom:0,height:0,left:1/0,right:0,top:1/0,width:0,x:1/0,y:0}),l={bottom:Math.max(s.bottom,l.bottom),left:Math.min(s.left,l.left),right:Math.max(s.right,l.right),top:Math.min(s.top,l.top),x:Math.min(s.x,l.x),y:Math.max(s.y,l.y)},e>=i.length-1&&(l.width=l.right-l.left,l.height=l.bottom-l.top,window.selRects.push(l))}for(t of window.selRects.sort((e,t)=>e.y-t.y)){var d=(t.top+t.bottom)/2,[,d]=y(t.left+1,d,t.right,d);A.innerText[d+1],window.getSelection().removeAllRanges()}for(n of window.selRects)n.y-=r.y,n.x-=r.x,n.top-=r.top,n.bottom=n.height+n.top,n.left-=r.left,n.right=n.width+n.left;if(void 0!==g){g.innerHTML="";for(var c of window.selRects){let e=document.createElement("span");e.style.width=c.width+"px",e.style.height=c.height+"px",e.style.left=c.left+"px",e.style.top=c.top+"px",e.style.position="absolute",e.style.background="#0000ff1f",e.classList.add("boxSel"),g.appendChild(e)}}}),h=e=>{window.hasOwnProperty("selRects")||(window.selRects=[]),0===window.selRects.length&&u();let t;for(var n in window.selRects){n=window.selRects[n];e>=n.y&&(t=n)}return t},I=(e,t)=>{var n=k(E),r=T(),o=(0===window.selRects.length&&u(),window.selRects.length-1);let i=o<t?o:t;i=Math.max(i,0);r=h(i*r+r/2);if(!r)return[e,1/0,t];t=Math.round((r.x+r.width)/n);let a=Math.min(e,t);return e!==1/0&&t<e&&i!=o&&(i+=1,a=0),[a,t,i]},a=(e,t=void 0,n=!1,r=!1)=>{var o,i,a=A.getBoundingClientRect(),a=(e.x,e.y,e={x:e.x-a.x,y:e.y-a.y},h(e.y));return void 0!==a&&(e={x:Math.min(e.x,a.x+a.width),y:a.y+a.height/2},a=void 0===t,i=k(E),o=T(),o=parseInt(e.y/o),i=Math.round(e.x/i),void 0===t&&(n||r||(l.innerHTML=""),t=c(i,o,r),r&&(A.dragCaret=t)),n=parseInt(t.style.getPropertyValue("--pos-char"))||0,r=Math.max(i,n),t.style.setProperty("--max-pos-char",r),t.style.setProperty("--pos-char",i),t.style.setProperty("--pos-line",o),a&&(t.style.setProperty("--fpos-char",i),t.style.setProperty("--fpos-line",o))),e},O=(E.addEventListener("mousedown",e=>{A.selecting=!0,a({x:e.clientX,y:e.clientY},$caret=void 0,ctrlKey=e.ctrlKey)},!0),E.addEventListener("mousemove",e=>{var t;A.hasOwnProperty("selecting")||(A.selecting=!1),A.selecting&&(t=Array.from(l.children),a({x:e.clientX,y:e.clientY},$caret=t[t.length-1],ctrlKey=e.ctrlKey))},!0),E.addEventListener("mouseup",e=>{A.selecting=!1},!0),E.addEventListener("dragstart",function(e){A.selecting=!1,A.dragging=!0,A.internalDrag=!0},!1),E.addEventListener("dragover",function(e){e.preventDefault(),A.hasOwnProperty("dragging")||(A.dragging=!1),A.dragging&&(A.dragCaretPos={x:e.clientX,y:e.clientY},A.dragCaretPos=a(A.dragCaretPos,firstCaret=!1,dragStyle=!0),A.dragCaret.classList.add("drag"))},!1),E.addEventListener("dragenter",function(e){var t=E.getBoundingClientRect(),e=e.target.getBoundingClientRect();e.left>=t.left&&e.right<=t.right&&e.top>=t.top&&e.bottom<=t.bottom&&!A.dragging&&(A.dragging=!0)},!1),P.addEventListener("dragleave",function(e){var t=E.getBoundingClientRect(),e=e.target.getBoundingClientRect();e.left>=t.left&&e.right<=t.right&&e.top>=t.top&&e.bottom<=t.bottom||A.dragging&&A.dragCaret&&(l.contains(A.dragCaret)&&l.removeChild(A.dragCaret),A.dragging=!1,A.dragCaret=void 0)},!1),E.addEventListener("drop",function(e){e.preventDefault(),customZActions=0,A.internalDrag&&(V(A.ownerDocument,["delete"],!1,null,keepZAction=!1,customZActions=0),customZActions++);var t,n,e=e.dataTransfer.getData("Text"),r=A.dragCaret.getBoundingClientRect(),[r,e]=(b(r.x,r.y,r.x,r.y),V(A.ownerDocument,["insertHTML"],!1,e,keepZAction=!0,customZActions+=1,nameZAction="DroppedElement"),D(A)),r=(r=r,e=e,o(r,e,$toNode=E),L());e=r,r=k(E),t=T(),n=A.getBoundingClientRect(),t=parseInt((e.y-n.y)/t),e=Math.round((e.x-n.x)/r),c(e,t),l.contains(A.dragCaret)&&l.removeChild(A.dragCaret),A.dragging=!1,A.dragCaret=void 0,A.internalDrag=!1},!1),(t,n=!1,r=null)=>{if(0<d){for(let e=0;e<s[d].zActions;e++)t.execCommand("undo",n,r);--d}}),N=(t,n=!1,r=null)=>{if(d<s.length-1){d+=1;for(let e=0;e<s[d].zActions;e++)t.execCommand("redo",n,r)}},V=(e,t,n=!1,r=null,o=!0,i=0,a="")=>{for(var l of t){if("undo"===l)return O(e,n,r);if("redo"===l)return N(e,n,r);e.execCommand(l,n,r)}0===i&&(i=t.length),""===a&&(a=t.join("_")),o&&(d+=1,s.push({date:Date.now(),zActions:i,name:a}))},Z=(e,t,n,r=!1,o=null,i=!0,a=0,l="")=>{let s=t.ownerDocument;t.ownerDocument.defaultView;let d=s.getSelection(),c=d.getRangeAt(0);[t,e]=p(e,t),c.setStart(t,e),c.setEnd(t,e),d.removeAllRanges(),d.addRange(c),V(s,n,r,o,noZAction,i,a,l)},f=(t,e)=>{var n,r=k(E),o=T();if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","End","Home","PageUp","PageDown"].includes(t.key)){if(e!==A){var a=t;a.preventDefault();var l,s=M();for(l in s){let o=s[l],i=parseInt(o.style.getPropertyValue("--max-pos-char"));var d=parseInt(o.style.getPropertyValue("--pos-char")),c=parseInt(o.style.getPropertyValue("--pos-line"));if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(a.key)){let e={ArrowLeft:(e,t)=>(--e<0&&(e=1/0,--t),[e,t]),ArrowRight:(e,t)=>[e+1,t],ArrowUp:(e,t)=>[e=Math.max(e,i),t-1],ArrowDown:(e,t)=>[e=Math.max(e,i),t+1]};var[g,p]=e[a.key](d,c);let[t,n,r]=I(g,p);n===1/0&&(t=d,r=c,limitCaretChar),["ArrowLeft","ArrowRight"].includes(a.key)&&o.style.setProperty("--max-pos-char",t),o.style.setProperty("--pos-char",t),o.style.setProperty("--pos-line",r),a.shiftKey||(o.style.setProperty("--fpos-char",t),o.style.setProperty("--fpos-line",r))}else["End","Home","PageUp","PageDown"].includes(a.key)}}}else if(t.ctrlKey)(n=t).preventDefault(),"Z"===n.key.toUpperCase()&&(n.shiftKey?N:O)(A.ownerDocument);else if(e!==A){P.querySelector(".input").editing=!0;var i,y=M();for(i in y){let e=y[i];var u=parseInt(e.style.getPropertyValue("--pos-char")),h=parseInt(e.style.getPropertyValue("--pos-line")),f=parseFloat(e.style.getPropertyValue("--fpos-char")),m=parseFloat(e.style.getPropertyValue("--fpos-line")),w=A.getBoundingClientRect(),f={x:f*r+w.x,y:m*o+w.y},m={x:u*r+w.x,y:h*o+w.y},v=(b(f.x,f.y,m.x,m.y),R=x=C=f=w=void 0,t);if(window.selRects=[],v.target,"Tab"===v.key){v.preventDefault();var[w,f]=D(A);if(v.shiftKey)if(w===f)"\t"===A.innerText[w-1]&&V(A.ownerDocument,["delete"],!1,null);else{let e=[];var x,R,C=A.innerText.slice(0,Math.min(w,f)).lastIndexOf("\n");0<C&&"\t"===A.innerText[C-1]&&e.push(C);let t=A.innerText.slice(Math.min(w,f),Math.max(w,f)),n=0;for(x of t.split("\n"))""!==x?("\t"===x[1]&&e.push(n),n+=x):n+=1;let r=0;for(R of e)r<e.length?Z(R,A,["delete"],keepZAction=!1):Z(R,A,["delete"],keepZAction=!0,customZActions=e.length,nameZAction="outdent multiple lines"),r+=1}else w===f&&V(A.ownerDocument,["insertHTML"],!1,"\t")}else"Enter"===v.key?V(A.ownerDocument,["insertHTML"],!1,"\n"):"Backspace"===v.key?V(A.ownerDocument,["delete"],!1):"Delete"===v.key?V(A.ownerDocument,["forwardDelete"],!1):1==v.key.length&&(V(A.ownerDocument,["insertHTML"],!1,v.key),v.preventDefault());m=L(),[u,h]=(C=m,f=v=f=w=void 0,w=k(E),f=T(),v=A.getBoundingClientRect(),f=parseInt((C.y-v.y)/f),[Math.round((C.x-v.x)/w),f]),e.style.setProperty("--pos-char",u),e.style.setProperty("--pos-line",h),e.style.setProperty("--fpos-char",u),e.style.setProperty("--fpos-line",h)}}e!==A&&(window.getSelection().removeAllRanges(),S.focus(),S.editing=!1)},m=(A.addEventListener("change",e=>{window.selRects=[]}),S.addEventListener("keydown",e=>{f(e,e.target)}),document.addEventListener("keydown",e=>{!e.ctrlKey||"Z"!==e.key.toUpperCase()&&"Y"!==e.key.toUpperCase()||e.preventDefault()}),new ResizeObserver(e=>{window.selRects=[]}));m.observe(t)}return{onInput:n.onInput}}