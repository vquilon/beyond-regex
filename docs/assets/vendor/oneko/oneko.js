!async function(){const d=document.createElement("div");let e=1;var t=document.currentScript;t&&t.dataset.scale&&(e=t.dataset.scale);let u=32,g=32,p=0,m=0,y=0,o=0,a=null,i=0,h=!1,v=!1,f=!0,k=!1,n=!1,r="conguito";function l(e,t){try{var n=JSON.parse(localStorage.getItem("oneko:"+e));return typeof n==typeof t?n:t}catch(e){return console.error(e),t}}function s(){if(h=!h,k=!1,localStorage.setItem("oneko:forceSleep",h),h){const e=document.querySelector(".playback-progressbar");e&&(p=e.getBoundingClientRect().right-16,m=e.getBoundingClientRect().top-8)}else E()}const c=10*e,b=[["classic","Classic"],["dog","Dog"],["tora","Tora"],["maia","Maia (maia.crimew.gay)"],["vaporwave","Vaporwave (nya.rest)"],["conguito","Conguito"]],w={idle:[[-3,-3]],alert:[[-7,-3]],scratchSelf:[[-5,0],[-6,0],[-7,0]],scratchWallN:[[0,0],[0,-1]],scratchWallS:[[-7,-1],[-6,-2]],scratchWallE:[[-2,-2],[-2,-3]],scratchWallW:[[-4,0],[-4,-1]],tired:[[-3,-2]],sleeping:[[-2,0],[-2,-1]],N:[[-1,-2],[-1,-3]],NE:[[0,-2],[0,-3]],E:[[-3,0],[-3,-1]],SE:[[-5,-1],[-5,-2]],S:[[-6,-3],[-7,-2]],SW:[[-5,-3],[-6,-1]],W:[[-4,-2],[-4,-3]],NW:[[-1,0],[-1,-1]]},x=Object.keys(w).filter(e=>1<w[e].length),S=new Set;function s(){if(h=!h,k=!1,localStorage.setItem("oneko:forceSleep",h),h){const s=document.getElementById("fad-progress");if(s)p=s.getBoundingClientRect().right-16,m=s.getBoundingClientRect().top-12;else{const c=document.querySelector(".main-nowPlayingBar-center .playback-progressbar");var e=c.getBoundingClientRect().right,t=c.getBoundingClientRect().top,n=c.getBoundingClientRect().bottom;p=e-16,m=t-8;const d=document.querySelector(".main-playbackBarRemainingTime-container");var o=d.getBoundingClientRect().left,a=d.getBoundingClientRect().bottom,i=d.getBoundingClientRect().top;const u=document.querySelector(".playback-bar__progress-time-elapsed");var r=u.getBoundingClientRect().right,l=u.getBoundingClientRect().left;o<e&&i<n&&t-a<32&&(p=o-r<32?l-16:o-16)}}else E()}function W(e,t){return w[e][t%w[e].length]}function C(e,t){e=W(e,t);d.style.backgroundPosition=`${32*e[0]}px ${32*e[1]}px`}function E(){a=null,i=0}function M(){if(10<(o+=1)&&0==Math.floor(200*Math.random())&&null==a){let e=["sleeping","scratchSelf"];u<32&&e.push("scratchWallW"),g<32&&e.push("scratchWallN"),u>window.innerWidth-32&&e.push("scratchWallE"),g>window.innerHeight-32&&e.push("scratchWallS"),a=e[Math.floor(Math.random()*e.length)]}switch(h&&(avalibleIdleAnimations=["sleeping"],a="sleeping"),a){case"sleeping":if(i<8&&k&&h){C("idle",0);break}if(k&&(k=!1,E()),i<8){C("tired",0);break}C("sleeping",Math.floor(i/4)),192<i&&!h&&E();break;case"scratchWallN":case"scratchWallS":case"scratchWallE":case"scratchWallW":case"scratchSelf":C(a,i),9<i&&E();break;default:return void C("idle",0)}i+=1}function B(){var e,t,n;y+=1,v?f&&C("alert",0):(e=u-p,t=g-m,n=Math.sqrt(e**2+t**2),h&&Math.abs(t)<c&&Math.abs(e)<c?(u=p,g=m,d.style.left=u-16+"px",d.style.top=g-16+"px",M()):(n<c||n<48)&&!h?M():(a=null,i=0,1<o?(C("alert",0),o=Math.min(o,7),--o):(direction=.5<t/n?"N":"",C(direction=(direction+=t/n<-.5?"S":"")+(.5<e/n?"W":"")+(e/n<-.5?"E":""),y),u-=e/n*c,g-=t/n*c,u=Math.min(Math.max(16,u),window.innerWidth-16),g=Math.min(Math.max(16,g),window.innerHeight-16),d.style.left=u-16+"px",d.style.top=g-16+"px")))}function I(){const e=document.createElement("div"),t=(e.className="oneko-variant-container",document.createElement("style")),[o,a]=(t.innerHTML=`
        .oneko-variant-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
        }
        .oneko-variant-button {
          width: 64px;
          height: 64px;
          margin: 8px;
          cursor: pointer;
          background-size: 800%;
          border-radius: 25%;
          transition: background-color 0.2s ease-in-out;
          background-position: var(--idle-x) var(--idle-y);
          image-rendering: pixelated;
        }
        .oneko-variant-button:hover, .oneko-variant-button-selected {
          background-color: var(--spice-main-elevated);
        }
        .oneko-variant-button:hover {
          background-position: var(--active-x) var(--active-y);
        }
      `,e.appendChild(t),function(){let e=x.filter(e=>!S.has(e));0===e.length&&(S.clear(),e=x);var t=Math.floor(Math.random()*e.length),t=e[t];return S.add(t),[W(t,0),W(t,1)]}());function n(t){const n=document.createElement("div");return n.className="oneko-variant-button",n.id=t[0],n.style.backgroundImage=`url('/beyond-regex/assets/vendor/oneko/assets/oneko-${t[0]}.gif')`,n.style.setProperty("--idle-x",64*o[0]+"px"),n.style.setProperty("--idle-y",64*o[1]+"px"),n.style.setProperty("--active-x",64*a[0]+"px"),n.style.setProperty("--active-y",64*a[1]+"px"),n.onclick=()=>{var e;e=t,console.log(e),r=e[0],localStorage.setItem("oneko:variant",`"${r}"`),d.style.backgroundImage=`url('/beyond-regex/assets/vendor/oneko/assets/oneko-${r}.gif')`,document.querySelector(".oneko-variant-button-selected")?.classList.remove("oneko-variant-button-selected"),n.classList.add("oneko-variant-button-selected")},t[0]===r&&n.classList.add("oneko-variant-button-selected"),tippy(n,{content:t[1]}),n}for(const r of b)e.appendChild(n(r));return e}if(r=l("variant","conguito"),n=l("kuroneko",!1),b.some(e=>e[0]===r)||(r="conguito"),d.id="oneko",d.style.width="32px",d.style.height="32px",d.style.position="fixed",d.style.backgroundImage=`url('/beyond-regex/assets/vendor/oneko/assets/oneko-${r}.gif')`,d.style.imageRendering="pixelated",d.style.scale=e,d.style.left=u-16+"px",d.style.top=g-16+"px",d.style.filter=n?"invert(100%)":"none",d.style.zIndex="99",document.body.appendChild(d),window.addEventListener("mousemove",e=>{h||(p=e.clientX,m=e.clientY)}),window.addEventListener("resize",()=>{h&&(h=!1,s())}),d.addEventListener("mousedown",e=>{if(0===e.button){v=!0;let i=e.clientX,r=e.clientY,l=u,s=g,c;const t=e=>{var t=e.clientX-i,n=e.clientY-r,o=Math.abs(t),a=Math.abs(n);a<o&&10<o?C(0<t?"scratchWallW":"scratchWallE",y):o<a&&10<a&&C(0<n?"scratchWallN":"scratchWallS",y),(f||10<o||10<a||10<Math.sqrt(t**2+n**2))&&(f=!1,clearTimeout(c),c=setTimeout(()=>{f=!0,k=!1,i=e.clientX,r=e.clientY,l=u,s=g},150)),u=l+e.clientX-i,g=s+e.clientY-r,d.style.left=u-16+"px",d.style.top=g-16+"px"},n=()=>{v=!1,k=!0,E(),window.removeEventListener("mousemove",t),window.removeEventListener("mouseup",n)};window.addEventListener("mousemove",t),window.addEventListener("mouseup",n)}}),d.addEventListener("contextmenu",e=>{e.preventDefault(),n=!n,localStorage.setItem("oneko:kuroneko",n),d.style.filter=n?"invert(100%)":"none"}),d.addEventListener("dblclick",s),window.onekoInterval=setInterval(B,100),(async()=>{for(;!document.body;)await new Promise(e=>setTimeout(e,100));let o=[],a;const i=["o","n","e","k","o"];window.addEventListener("keydown",e=>{e=e.key.toLowerCase();if(o.push(e),a&&clearTimeout(a),a=setTimeout(()=>{o=[]},1e3),o.join(" ")===i.join(" ")){{e=I();const t=document.createElement("div"),n=(t.style.position="fixed",t.style.top="50%",t.style.left="50%",t.style.transform="translate(-50%, -50%)",t.style.padding="20px",t.style.backgroundColor="#fff",t.style.zIndex="1000",t.appendChild(e),document.createElement("div"));n.style.position="fixed",n.style.top="0",n.style.left="0",n.style.width="100%",n.style.height="100%",n.style.backgroundColor="rgba(0, 0, 0, 0.5)",n.style.zIndex="999",n.onclick=()=>{document.body.removeChild(t),document.body.removeChild(n)},document.body.appendChild(n),document.body.appendChild(t)}o=[],clearTimeout(a)}})})(),l("forceSleep",!1)){for(;!document.querySelector(".main-nowPlayingBar-center .playback-progressbar");)await new Promise(e=>setTimeout(e,100));s()}}();