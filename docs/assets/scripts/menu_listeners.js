const init_menu_listeners=()=>{let o=document.querySelector("#sidebar"),i=document.querySelector("#close-side"),r=document.querySelector("#container-main");i.addEventListener("click",e=>{r.classList.toggle("menu-open")}),document.querySelector("#container-main > #sidebar-overlay").addEventListener("click",e=>{r.classList.remove("menu-open")}),o.isDragging=!1,o.offsetX=0,o.sideOffset=0;const t=(e,t)=>{var s=t&&1==e.touches.length?e.touches[0].clientX:(e.preventDefault(),e.clientX);o.offsetX=s,t=window.getComputedStyle(o),e=new WebKitCSSMatrix(t.transform),o.sideOffset=e.m41,o.isGrabbed=!0};return i.addEventListener("mousedown",e=>{t(e,touch=!1)}),i.addEventListener("touchstart",e=>{t(e,touch=!0)},{passive:!0}),[(e,t)=>{let s=document.querySelector("#sidebar");var n;s.isGrabbed&&(e.preventDefault(),s.style.transition="none",s.isDragging=!0,n=(t&&1==e.touches.length?e.touches[0]:e).clientX,t=s.posX=n,e=o.sideOffset+t-o.offsetX,n=i.getBoundingClientRect(),e+parseInt(window.getComputedStyle(o).paddingLeft)<0&&t>2*n.width&&o.style.setProperty("transform",`translateX(${e}px)`,"important"))},(e,t)=>{let s=document.querySelector("#sidebar");var n,o=document.querySelector("#close-side");s.isDragging?(n=s.posX,s.isGrabbed=!1,s.isDragging=!1,s.style.transform="",s.style.transition="",s.sideOffset=0,s.posX=0,e.target==o&&!t||(r.classList.contains("menu-open")||100<n-s.offsetX&&r.classList.add("menu-open"),r.classList.contains("menu-open")&&n-s.offsetX<-100&&r.classList.remove("menu-open")),s.offsetX=0):s.isGrabbed&&(s.isGrabbed=!1,s.style.transform="",s.style.transition="")}]};