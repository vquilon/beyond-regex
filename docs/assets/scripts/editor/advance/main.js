function EditorAdvance(e={}){let h=[{date:Date.now(),zActions:1,name:"init"}],p=0,y=[],u=[],l=e.$containerEditor,c=l.querySelector(".input-carets"),f=l.querySelector(".input-selects"),v=e.$inputRegex,m=e.$syntaxRegex,x=c.parentElement,r=l.querySelector("#editor-input"),w=void 0,t=(e.debugInputClass&&((w=document.createElement("div")).classList.add(e.debugInputClass),x.appendChild(w)),{});const s=()=>{c.timeoutBlink&&clearTimeout(c.timeoutBlink),c.classList.remove("blink"),c.timeoutBlink=window.setTimeout(()=>{c.classList.add("blink")},500)};const i=()=>{let e=window.getComputedStyle(document.documentElement),t=e.getPropertyValue("--font-size");return parseFloat(t.substring(0,t.length-2))};const g=e=>{if(e.hasOwnProperty("charWidth")&&e.charWidth)return e.charWidth;let t=document.createElement("span");t.innerText="0",t.style.opacity="0",e.appendChild(t);var r=t.getBoundingClientRect().width;return t.remove(),e.charWidth=r},C=(e=0)=>(0===e&&(e=i()),t.hasOwnProperty(e)||(t[e]=g(m)),t[e]),S=(e=0)=>{0===e&&(e=i());let t=window.getComputedStyle(document.documentElement);return e*parseFloat(t.getPropertyValue("--line-height-ratio"))},B=(r,n,e=!1)=>{var o=Array.from(c.children);let i;for(let t=0;t<o.length;t++){let e=o[t];if(parseInt(e.style.getPropertyValue("--pos-char"))===r&&parseInt(e.style.getPropertyValue("--pos-line"))===n){i=e;break}}return!i||e?((i=document.createElement("span")).classList.add("caret"),c.appendChild(i)):(c.removeChild(i),i=void 0),i};const K=e=>{var t,r=S(),n=v.getBoundingClientRect();f.innerHTML="";for(t of e)($caretSelection=document.createElement("span")).classList.add("caret-selection"),$caretSelection.style.setProperty("--pos-x",t.x-n.x),$caretSelection.style.setProperty("--pos-y",t.y-n.y),$caretSelection.style.setProperty("--size-width",t.width),$caretSelection.style.setProperty("--size-height",r),f.append($caretSelection)};const n=(r,n,o=void 0)=>{var i=r,a=n;if(0===r&&0===n){let e=document.createRange(),t=window.getSelection();t.removeAllRanges(),e.setStart(o,r),e.setEnd(o,n),t.addRange(e)}else{r=Math.min(o.innerText.length,r),n=Math.min(o.innerText.length,n);var[l,r]=A(r,o),[s,n]=A(n,o);r=Math.min(o.innerText.length,r),n=Math.min(o.innerText.length,n);let e=document.createRange(),t=window.getSelection();t.removeAllRanges(),a<i?(e.setStart(s,n),e.setEnd(l,r),e.collapse(!1),t.addRange(e),t.extend(s,n)):(e.setStart(l,r),e.setEnd(s,n),t.addRange(e))}},F=(e,t)=>{n(e,t,$toNode=m)},N=(e,t,r)=>{r&&(r=e,e=t,t=r),n(e,t,$toNode=v)},d=(e,t,r,n)=>{var[e,t,r]=D(e,t,r,n);return N(e,t,r),[e,t]},A=(t,e)=>{if(3===e.nodeType)return[e,t];var r=e.childNodes;let n=0,o=0,i=void 0;for(let e=0;e<r.length;e++){if(i=r[e],t<=(o+=i.textContent.length)){if(t-n>i.childNodes.length)return A(t-n,i);break}n+=i.textContent.length}return[i,t-n]},P=e=>{let t=0,r=0,n=!1;if("TEXTAREA"===e.nodeName)t=e.selectionStart,r=e.selectionEnd,n="backward"===e.selectionDirection;else if(void 0!==window.getSelection){const i=window.getSelection();if(0!==i.rangeCount){var o=i.anchorNode.compareDocumentPosition(i.focusNode);n=!1,(!o&&i.anchorOffset>i.focusOffset||o===Node.DOCUMENT_POSITION_PRECEDING)&&(n=!0);const a=i.getRangeAt(0),l=a.cloneRange(),s=(l.selectNodeContents(e),l.setEnd(a.startContainer,a.startOffset),t=l.toString().length,a.cloneRange());s.selectNodeContents(e),s.setEnd(a.endContainer,a.endOffset),r=s.toString().length}}return n?[r,t]:[t,r]},b=()=>{return Array.from(c.children)},R=()=>{var e=window.getSelection().getRangeAt(0).getClientRects();let t={x:0,y:0,width:1,height:S()};return t=0===e.length?(a=>{let l={x:0,y:0,width:1,height:S()},e=false;if(a.nodeName==="TEXTAREA"){prePosition=a.selectionStart;postPosition=a.selectionEnd;e=a.selectionDirection==="backward"}else{const t=typeof window.getSelection!=="undefined";if(t){const s=window.getSelection();if(s.rangeCount!==0){const d=s.getRangeAt(0);let[e,t]=P(a);let[r,n]=A(e,a);let[o,i]=A(t,a);d.setStart(r,n);d.setEnd(o,i);l=d.getClientRects()[0]}}}return{x:l.x,y:l.y,width:l.width,height:l.height}})(v):{x:e[0].x,y:e[0].y,width:e[0].width,height:e[0].height}},D=(e,t,r,n)=>{var[e,t,r,n]=L({x:e,y:t},{x:r,y:n}),[e,t]=E(e,t,r,n);return[e,t,t<e]};const E=(t,e,r,n)=>{0===u.length&&k();var o=C();let i=0,a=0;for(let e=0;e<u.length;e++){var l=u[e],l=parseInt((l.width+2)/o);e<t&&(i+=l),e<r&&(a+=l)}return i+=e,a+=n,[i,a]},Z=(e,t)=>{0===u.length&&k();var r=C();let n=0,o=Math.min(e,v.innerText.length),i=0,a=Math.min(t,v.innerText.length),l=!0,s=!0;for(let e=0;e<u.length;e++){var d=u[e],d=parseInt((d.width+2)/r);o>d&&l?(o-=d,n++):l=!1,a>d&&s?(a-=d,i++):s=!1}return[n,o,i,a]},H=(e,t)=>{var r=i(),n=S(r),r=C(r),o=v.getBoundingClientRect();return caretPosX=r*t+o.x,caretPosY=n*e+o.y,[caretPosX,caretPosY]},L=(e,t)=>{var r=g(m),n=S(),o=v.getBoundingClientRect();let i=parseInt((e.y-o.y)/n),a=parseInt((t.y-o.y)/n),l=e,s=t,d=!1;i===a&&e.x>t.x&&(s=e,l=t,d=!0),i>a&&(s=e,l=t,n=i,i=a,a=n,d=!0);e=i,t=a;return[e,Math.round((l.x-o.x)/r),t,Math.round((s.x-o.x)/r),d]};const k=()=>{var e,t,r,n,o=v.getBoundingClientRect();let i=window.getSelection(),a=void 0,l=(1<=i.rangeCount&&(a=i.getRangeAt(0)),i.selectAllChildren(m),Array.from(i.getRangeAt(0).getClientRects())),s=(i.removeAllRanges(),a&&i.addRange(a),l=l.sort((e,t)=>e.y-t.y),u=[],window.newLines={},0===l.length&&l.push({bottom:o.bottom,height:o.height,left:o.left,right:o.left,top:o.top,width:0,x:o.x,y:o.y}),l[0].y),d={bottom:0,height:0,left:1/0,right:0,top:1/0,width:0,x:1/0,y:0};for(e in l){e=parseInt(e);var g=l[e];g.y>s&&(s=g.y,d.width=d.right-d.left,d.height=d.bottom-d.top,u.push(d),d={bottom:0,height:0,left:1/0,right:0,top:1/0,width:0,x:1/0,y:0}),d={bottom:Math.max(g.bottom,d.bottom),left:Math.min(g.left,d.left),right:Math.max(g.right,d.right),top:Math.min(g.top,d.top),x:Math.min(g.x,d.x),y:Math.max(g.y,d.y)},e>=l.length-1&&(d.width=d.right-d.left,d.height=d.bottom-d.top,u.push(d))}for(t of u)t.y-=o.y,t.x-=o.x,t.top-=o.top,t.bottom=t.height+t.top,t.left-=o.left,t.right=t.width+t.left;if("\n\n"===v.textContent.slice(-2)&&(r=u[u.length-1],n=u[0],u.push({bottom:r.bottom+n.top+r.height,height:r.height,left:r.left,right:r.left,top:r.bottom+n.top,width:0,x:r.x,y:r.bottom+n.top})),void 0!==w){w.innerHTML="";for(var c of u){let e=document.createElement("span");e.style.width=c.width+"px",e.style.height=c.height+"px",e.style.left=c.left+"px",e.style.top=c.top+"px",e.style.position="absolute",e.style.background="#0000ff1f",e.classList.add("boxSel"),w.appendChild(e)}}},T=(e,t=!1)=>{0===u.length&&k();let r;for(var n in u){n=u[n];e>=n.y&&(r=n)}return r&&(r=Object.keys(r).reduce((e,t)=>(e[t]=r[t],e),{}),t&&(t=v.getBoundingClientRect(),r.y+=t.y,r.x+=t.x,r.top+=t.top,r.bottom+=t.top,r.left+=t.left,r.right+=t.left)),r},X=()=>(0===u.length&&k(),u.length-1),z=(e,t)=>{var r=g(m),n=S(),o=X();let i=o<e?o:e;i=Math.max(i,0);n=T(i*n+n/2);if(!n)return[t,1/0,e];e=Math.round((n.x+n.width)/r);let a=Math.min(t,e);return t!==1/0&&e<t&&i!=o&&(i+=1,a=0),[i,a,e]},M=(e,{$caret:t=void 0,ctrlKey:r=!1,wheelKey:n=!1,dragStyle:o=!1,resetFirst:i=!1})=>{var a,l=v.getBoundingClientRect(),l=(e={x:e.x-l.x,y:e.y-l.y},T(e.y));return void 0!==l&&(e={x:Math.min(e.x,l.x+l.width),y:l.y+l.height/2},l=g(m),a=S(),a=parseInt(e.y/a),l=Math.round(e.x/l),t=I(a,l,{$caret:t,ctrlKey:r,wheelKey:n,dragStyle:o,resetFirst:i})),[e,t]},I=(t,r,{$caret:n=void 0,ctrlKey:o=!1,dragStyle:i=!1,resetFirst:e=!1})=>{var a,l=void 0===n;let s=void 0,d=void 0;if(void 0===n){let e=b();if(0===e.length||o&&!i||i)n=B(r,t,i);else{n=e.pop();for(var g of e)c.removeChild(g);s=t,d=r}}return void 0!==n&&(o=parseInt(n.style.getPropertyValue("--pos-char"))||r,a=parseInt(n.style.getPropertyValue("--pos-line"))||t,s=l||e?t:s,d=l||e?r:d,l=a===t?r:o,$(n,t,r,s,d,l),i||V()),n},V=()=>{var e,t=b(),r=S();let n=[];f.innerHTML="";for(e of t){var o=parseInt(e.style.getPropertyValue("--fpos-line")),i=parseInt(e.style.getPropertyValue("--pos-line")),[a,l]=H(o,parseInt(e.style.getPropertyValue("--fpos-char"))),[s,d]=H(i,parseInt(e.style.getPropertyValue("--pos-char")));if(i!==o){let e=!1;i<o&&(e=!0);var g=T(o*r+r/2,absolutePos=!0),c=T(i*r+r/2,absolutePos=!0);if(g&&c&&(e?(n.push({top:l,bottom:l+r,height:r,width:a-g.left,left:g.left,right:a,x:g.left,y:l}),n.push({bottom:c.bottom,top:c.top,height:r,width:c.right-s,left:s,right:c.right,x:s,y:c.y})):(n.push({top:g.top,bottom:g.bottom,height:r,width:g.right-a,left:a,right:g.right,x:a,y:g.y}),n.push({top:c.top,bottom:c.bottom,height:r,width:s-c.left,left:c.left,right:s,x:c.x,y:c.y}))),0<Math.abs(i-o))for(let e=Math.min(o,i)+1;e<Math.max(o,i);e++){var h=T(e*r+r/2,absolutePos=!0);h&&n.push(h)}}else if(a!==s){let e=s<a?!0:!1;n.push({top:d,bottom:d+r,height:r,width:Math.abs(s-a),left:e?s:a,right:e?a:s,x:e?s:a,y:d})}}K(n)},$=(e,t,r,n,o,i)=>{e.style.setProperty("--pos-line",t),e.style.setProperty("--pos-char",r),void 0!==n&&e.style.setProperty("--fpos-line",n),void 0!==o&&e.style.setProperty("--fpos-char",o),e.style.setProperty("--max-pos-char",i);var i=n||parseFloat(e.style.getPropertyValue("--fpos-line")),n=o||parseFloat(e.style.getPropertyValue("--fpos-char")),o=t,t=r,[r,i]=E(i,n,o,t);e.style.setProperty("--offset-start",r),e.style.setProperty("--offset-end",i)},O=e=>{var t=parseInt(e.style.getPropertyValue("--pos-char")),r=parseInt(e.style.getPropertyValue("--pos-line")),n=parseFloat(e.style.getPropertyValue("--fpos-char")),e=parseFloat(e.style.getPropertyValue("--fpos-line")),o=v.getBoundingClientRect(),i=g(m),a=S();return[{x:n*i+o.x,y:e*a+o.y},{x:t*i+o.x,y:r*a+o.y}]},Y=e=>{return[parseFloat(e.style.getPropertyValue("--offset-start")),parseFloat(e.style.getPropertyValue("--offset-end"))]},o=(e,t)=>{var r=Array.from(f.children);let n;var o=v.getBoundingClientRect();for(n of r){var i=parseFloat(n.style.getPropertyValue("--pos-x"))+o.x,a=parseFloat(n.style.getPropertyValue("--pos-y"))+o.y,l=parseFloat(n.style.getPropertyValue("--size-width")),s=parseFloat(n.style.getPropertyValue("--size-height"));if(i<e&&e<i+l&&a<t&&t<a+s)return[n,{sx:i,sy:a,ex:i+l,ey:a+s}]}return[void 0,{sx:0,sy:0,ex:0,ey:0}]},W=(e,t)=>{v.internalDrag&&!getSelection().isCollapsed&&U(v.ownerDocument,"delete",{keepZAction:!1});var r=v.dragCaret.getBoundingClientRect(),[r,n]=(d(r.x,r.y,r.x,r.y),U(v.ownerDocument,"insertHTML",{value:e,nameZAction:"DroppedElement"}),u=[],P(v)),r=(F(r-e.length,n),R()),e=(c.contains(v.dragCaret)&&c.removeChild(v.dragCaret),v.dragging=!1,v.dragCaret=void 0,v.internalDrag=!1,v.textSelection={sx:0,sy:0,ex:0,ey:0},M({x:r.x,y:r.y+r.height/2},{}),Array.from(c.children).slice(-1)[0]);M({x:r.x+r.width,y:r.y+r.height/2},{$caret:e}),x.focus()},q=e=>{var t=m.getBoundingClientRect(),e=e.target.getBoundingClientRect();e.left>=t.left&&e.right<=t.right&&e.top>=t.top&&e.bottom<=t.bottom&&(v.dragging||(v.selecting=!1,c.innerHTML="",f.innerHTML="",v.dragging=!0,v.mousedown&&(v.internalDrag=!0)),x.focus())},j=e=>{e.preventDefault(),v.dragCaretPos={x:e.clientX,y:e.clientY};let[t,r]=M(v.dragCaretPos,{$caret:v.dragCaret,ctrlKey:!1,dragStyle:!0});v.dragCaretPos=t,r.classList.add("drag"),v.dragCaret=r},_=e=>{var t=m.getBoundingClientRect(),e=e.target.getBoundingClientRect();e.left>=t.left&&e.right<=t.right&&e.top>=t.top&&e.bottom<=t.bottom||(x.blur(),v.dragging&&v.dragCaret&&(c.contains(v.dragCaret)&&c.removeChild(v.dragCaret),v.dragging=!1,v.dragCaret=void 0,v.internalDrag=!1))},G=e=>{c.innerHTML="",f.innerHTML="";for(var t of e){var[r,n,o,i]=Z(t.startOffset,t.endOffset),r=I(r,n,{ctrlKey:!0});t.startOffset!==t.endOffset&&I(o,i,{$caret:r,ctrlKey:!0})}},J=(t,{showUI:r=!1,value:n=null})=>{if(0<p){var e=h[p].caretsOffset;for(let e=0;e<h[p].zActions;e++)t.execCommand("undo",r,n);--p,G(e)}},Q=(t,{showUI:r=!1,value:n=null})=>{if(p<h.length-1){p+=1;for(let e=0;e<h[p].zActions;e++)t.execCommand("redo",r,n);var e=h[p].caretsOffset;G(e)}},U=(r,n,{showUI:o=!1,value:e=null,keepZAction:t=!0,nameZAction:i=""})=>{if("undo"===n)return J(r,{showUI:o,value:e});if("redo"===n)return Q(r,{showUI:o,value:e});if(r.execCommand(n,o,e),""===i&&(i=n),t){var l;let e=[];for(l of b()){var[s,d]=O(l),[s,d,g,c]=L(s,d),[s,d]=E(s,d,g,c);e.push({startOffset:s,endOffset:d})}r=[...y,{commandName:n}],o=(y=[],p+=1,h[0]);let t=0;1e4<=h.length&&(t=1),a=[o,...h.slice(t+1,p)],p=h.length,h.push({comands:r,date:Date.now(),zActions:r.length,name:i,caretsOffset:e})}else y.push({commandName:n})},ee=(e,t,r,{showUI:n=!1,value:o=null,keepZAction:i=!0,nameZAction:a=""})=>{var l=t.ownerDocument;let s=t.ownerDocument.defaultView,d=s.getSelection(),g=new Range;[t,e]=A(e,t),g.setStart(t,e),g.setEnd(t,e),d.removeAllRanges(),d.addRange(g),U(l,r,{showUI:n,value:o,keepZAction:i,nameZAction:a})},te=(e,{pressedEvent:o=!1})=>{u=[];e.target;if(["Shift","Alt"].includes(e.key))e.preventDefault();else if(o){if("Enter"===e.key)return U(v.ownerDocument,"insertText",{value:"\n"}),!0;if(1===e.key.length)return U(v.ownerDocument,"insertText",{value:e.key}),!0}else{if("Tab"===e.key){e.preventDefault();var[o,i]=P(v);if(e.shiftKey)if(o===i)"\t"===v.innerText[o-1]&&U(v.ownerDocument,"delete",{});else{let e=[];var a,l,s=v.innerText.slice(0,Math.min(o,i)).lastIndexOf("\n");0<s&&"\t"===v.innerText[s-1]&&e.push(s);let t=v.innerText.slice(Math.min(o,i),Math.max(o,i)),r=0;for(a of t.split("\n"))""!==a?("\t"===a[1]&&e.push(r),r+=a):r+=1;let n=0;for(l of e)n<e.length?ee(l,v,"delete",{keepZAction:!1}):ee(l,v,"delete",{nameZAction:"outdent multiple lines"}),n+=1}else o===i&&U(v.ownerDocument,"insertHTML",{value:"\t"});return!0}if("Backspace"===e.key)return U(v.ownerDocument,"delete",{}),!0;if("Delete"===e.key)return U(v.ownerDocument,"forwardDelete",{}),!0}return!1},re=i=>{var a;i.preventDefault();for(a of b()){let o=parseInt(a.style.getPropertyValue("--max-pos-char"));var l=parseInt(a.style.getPropertyValue("--pos-char")),s=parseInt(a.style.getPropertyValue("--pos-line"));if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(i.key)){let e={ArrowLeft:(e,t)=>(--e<0&&(e=1/0,--t),[e,t]),ArrowRight:(e,t)=>[e+1,t],ArrowUp:(e,t)=>[e=Math.max(e,o),t-1],ArrowDown:(e,t)=>[e=Math.max(e,o),t+1]};var[d,g]=e[i.key](l,s);let[t,r,n]=z(g,d);n===1/0&&(r=l,t=s),o=["ArrowLeft","ArrowRight"].includes(i.key)?r:o;g=i.shiftKey?void 0:t,d=i.shiftKey?void 0:r;$(a,t,r,g,d,o)}else["End","Home","PageUp","PageDown"].includes(i.key)}V()},ne=e=>{"Z"===e.key.toUpperCase()&&(u=[],e.preventDefault(),(e.shiftKey?Q:J)(v.ownerDocument,{}))},oe=e=>{var t,r,n,o;if("A"===e.key.toUpperCase()&&(e.preventDefault(),[r,n,o]=z(X(),1/0),t=I(0,0,{}),I(r,n,{$caret:t})),"C"===e.key.toUpperCase()){let n,o=[];for(n of Array.from(c.children)){var[i,a]=O(n);let[e,t,r]=D(i.x,i.y,a.x,a.y);r&&(i=e,e=t,t=i);a=v.innerText.slice(e,t);o.push(a)}0!==o.length?(v.copiedText=o,navigator.clipboard.writeText(o.join("\n"))):console.error("Something was wrong")}"V"===e.key.toUpperCase()&&(u=[],f.innerHTML="",(async()=>{v.focus();let o=await navigator.clipboard.readText();var e=b();o=o.split("\n").length<e.length||o.split("\n").length>e.length?Array(e.length).fill(o):[o];for(let n=0;n<e.length;n++){var i=e[n],[i,a]=O(i),[i,a,l,s]=L(i,a),[i,a]=E(i,a,l,s);{l=void 0;s=void 0;d=void 0;var[i,a,d,g,{showUI:c=!1,value:h=null,keepZAction:p=!0,nameZAction:y=""}]=[i,a,v,"insertText",{value:o[n]}];l=d.ownerDocument;let e=d.ownerDocument.defaultView,t=e.getSelection(),r=new Range;[s,i]=A(i,d),[d,a]=A(a,d),r.setStart(s,i),r.setEnd(d,a),t.removeAllRanges(),t.addRange(r),U(l,g,{showUI:c,value:h,keepZAction:p,nameZAction:y})}}x.focus()})())},ie=(t,e,{pressedEvent:r=!1})=>{if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","End","Home","PageUp","PageDown"].includes(t.key))e!==v&&(s(),re(t));else if(t.ctrlKey&&!r)l!==v&&oe(t),ne(t);else if(!["Shift","CapsLock"].includes(t.key)&&e!==v){s(),x.editing=!0;b();for(let e=0;e<Array.from(c.children).length;e++){var n=Array.from(c.children)[e],[o,i]=O(n),o=(d(o.x,o.y,i.x,i.y),te(t,{pressedEvent:r}));o&&(t.preventDefault(),i=R(),M(i,{$caret:n,resetFirst:!0}))}}e!==v&&(window.getSelection().removeAllRanges(),x.focus(),x.editing=!1)};{m.addEventListener("mousedown",e=>{v.mousedown=!0,v.dragging&&(c.contains(v.dragCaret)&&c.removeChild(v.dragCaret),v.dragging=!1,v.dragCaret=void 0,v.internalDrag=!1,v.textSelection={sx:0,sy:0,ex:0,ey:0});let[t,r]=o(e.clientX,e.clientY);var n;void 0!==t?(n=parseFloat(t.style.getPropertyValue("--size-height")),v.textSelection={sx:r.sx,sy:r.sy+n/2,ex:r.ex,ey:r.ey-n/2},v.selecting=!1,v.internalDrag=!0,v.initSelecting=!0):(s(),v.initSelecting=!0,M({x:e.clientX,y:e.clientY},{$caret:void 0,ctrlKey:e.ctrlKey}))},!0),m.addEventListener("mousemove",r=>{if(0===r.which)v.selecting=!1;else if(v.initSelecting&&!v.internalDrag&&(v.initSelecting=!1,v.selecting=!0),v.selecting&&(e=c.lastChild,M({x:r.clientX,y:r.clientY},{$caret:e,wheelKey:2===r.which})),(v.internalDrag||v.dragging)&&1===r.which){var[e]=o(r.clientX,r.clientY);if(void 0===e){v.dragCaretPos={x:r.clientX,y:r.clientY};let[e,t]=M(v.dragCaretPos,{$caret:v.dragCaret,ctrlKey:!1,dragStyle:!0});v.dragCaretPos=e,t.classList.add("drag"),v.dragCaret=t}else c.contains(v.dragCaret)&&c.removeChild(v.dragCaret),v.dragging=!0,v.dragCaret=void 0,v.initSelecting=!1}},!0),m.addEventListener("mouseup",e=>{var t,r;v.selecting=!1,v.mousedown=!1,v.dragging?([r,t]=o(e.clientX,e.clientY),void 0===r?(f.innerHTML="",window.getSelection().removeAllRanges(),d(v.textSelection.sx,v.textSelection.sy,v.textSelection.ex,v.textSelection.ey),r=window.getSelection().toString(),W(r)):(v.dragging=!1,v.dragCaret=void 0,v.internalDrag=!1,v.textSelection={sx:0,sy:0,ex:0,ey:0})):!e.ctrlKey&&v.initSelecting?(v.initSelecting=!1,v.internalDrag=!1,s(),M({x:e.clientX,y:e.clientY},{$caret:void 0})):v.initSelecting=!1},!0),m.addEventListener("dragstart",function(e){e.preventDefault()},!1),x.addEventListener("mouseleave",e=>{v.dragging&&_(e)},!1),m.addEventListener("dragover",j,!1),m.addEventListener("dragenter",q,!1),m.addEventListener("dragleave",_,!1),m.addEventListener("drop",function(e){e.preventDefault();e=e.dataTransfer.getData("Text");v.internalDrag&&(f.innerHTML="",window.getSelection().removeAllRanges(),d(v.textSelection.sx,v.textSelection.sy,v.textSelection.ex,v.textSelection.ey)),W(e)},!1),x.addEventListener("blur",e=>{x.editing||(c.timeoutBlink&&clearTimeout(c.timeoutBlink),c.classList.remove("blink"),c.classList.add("nofocus"),f.classList.add("nofocus"))}),x.addEventListener("focus",e=>{c.classList.remove("nofocus"),f.classList.remove("nofocus"),s()}),v.addEventListener("change",e=>{u=[]}),x.addEventListener("keypress",e=>{ie(e,e.target,{pressedEvent:!0})}),x.addEventListener("keydown",e=>{ie(e,e.target,{})}),document.addEventListener("keydown",e=>{!e.ctrlKey||"Z"!==e.key.toUpperCase()&&"Y"!==e.key.toUpperCase()||e.preventDefault()});const ae=new ResizeObserver(e=>{var t;u=[],k();for(t of b()){var[r,n]=Y(t),[r,n,o,i]=Z(r,n);$(t,o,i,r,n,i)}V()});ae.observe(r)}}