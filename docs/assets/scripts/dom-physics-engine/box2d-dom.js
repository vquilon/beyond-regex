var DOMPhysicsBox2D=function(i){var e=document.getElementById(i.debug_DOM_id),a={};a.width=e.getBoundingClientRect().width,a.height=document.documentElement.scrollHeight,a.centerX=a.width/2,a.centerY=a.height/2,a.offsetX=a.width/2,a.offsetY=a.height/2;var n,o,d,r,t,s,f=32,b=null,w=null,l=!0,h=0,c=0,P=i.debug,u=!1,x=!1,m={x:0,y:0},y={x:0,y:0},g={x:0,y:0},p={x:a.offsetX,y:a.offsetY},_={x:a.centerX,y:a.centerY},B=9,D=[],C=[],E={RECTANGLE_ROUNDED:"rectangle_rounded",RECTANGLE:"rectangle",PILL:"pill",ELLIPSE:"ellipse"};function S(e,t){for(var o=1,i=0;i<t;i++)o*=10;return Math.round(e*o)/o}function L(e){return{x:(e.x-p.x)/f,y:(e.y-(d.height-p.y))/f}}function R(e,t,o=!1){e=e.getBoundingClientRect(),m=o&&1==t.touches.length?{x:t.touches[0].clientX-e.left,y:a.height-(t.touches[0].clientY-e.top)}:{x:t.clientX-e.left,y:a.height-(t.clientY-e.top)},g=L(m)}function v(e,t){var o=L(_),i=e.get_x()-o.x,o=e.get_y()-o.y,t=t?1:.25;p.x-=S(t*i*f,0),p.y+=S(t*o*f,0)}function A(e,t,o=!1){y=m,R(e,t,o),x&&i.keyListeners?(p.x+=m.x-y.x,p.y-=m.y-y.y):u&&null!=w&&(t.preventDefault(),w.SetTarget(new window.Box2D.b2Vec2(g.x,g.y)))}function V(e,t,o=!1){R(e,t,o),u||null==w&&((t=new window.Box2D.b2AABB).set_lowerBound(new b2Vec2(g.x-.001,g.y-.001)),t.set_upperBound(new b2Vec2(g.x+.001,g.y+.001)),s.m_fixture=null,s.m_point=new window.Box2D.b2Vec2(g.x,g.y),b.QueryAABB(s,t),s.m_fixture&&(o=s.m_fixture.GetBody(),(t=new window.Box2D.b2MouseJointDef).set_bodyA(n),t.set_bodyB(o),t.set_target(new window.Box2D.b2Vec2(g.x,g.y)),t.set_maxForce(1e3*o.GetMass()),t.set_collideConnected(!0),w=window.Box2D.castObject(b.CreateJoint(t),window.Box2D.b2MouseJoint),o.SetAwake(!0))),u=!0}function T(e,t,o=!1){u=!1,R(e,t,o),null!=w&&(b.DestroyJoint(w),w=null)}function z(){n=b.CreateBody(new window.Box2D.b2BodyDef);let e=new window.Box2D.b2BodyDef;e.restitution=1,o=b.CreateBody(e);var t=new window.Box2D.b2EdgeShape;worldWidth=a.width/f,worldHeight=a.height/f,t.Set(new window.Box2D.b2Vec2(-worldWidth/2,-worldHeight/2),new window.Box2D.b2Vec2(worldWidth/2,-worldHeight/2)),o.CreateFixture(t,0),t.Set(new window.Box2D.b2Vec2(-worldWidth/2,worldHeight/2),new window.Box2D.b2Vec2(worldWidth/2,worldHeight/2)),o.CreateFixture(t,0),t.Set(new window.Box2D.b2Vec2(-worldWidth/2,worldHeight/2),new window.Box2D.b2Vec2(-worldWidth/2,-worldHeight/2)),o.CreateFixture(t,0),t.Set(new window.Box2D.b2Vec2(worldWidth/2,worldHeight/2),new window.Box2D.b2Vec2(worldWidth/2,-worldHeight/2)),o.CreateFixture(t,0)}function F(e,t,o,i,n){let d=new window.Box2D.b2BodyDef,r=(d.set_type(Module.b2_dynamicBody),d.set_position(new window.Box2D.b2Vec2(e/f,t/f)),b.CreateBody(d));var s=Math.min(o,i)/2,w=.99*Math.min(o,i)/2,a=n.topLeft>=s?w:n.topLeft,l=n.topRight>=s?w:n.topRight,h=n.bottomLeft>=s?w:n.bottomLeft,c=n.bottomRight>=s?w:n.bottomRight,u=o/2/f,x=i/2/f,m=a/f,y=l/f,g=h/f,t=u-m,s=x-m,w=u-y,n=x-y,o=u-g,i=x-g,a=u-(e=c/f),l=x-e,h=new window.Box2D.b2PolygonShape;return(c=new window.Box2D.b2FixtureDef).set_density(3),c.set_friction(.3),c.set_restitution(.3),h.SetAsBox(u,x-Math.min(g,e)),c.set_shape(h),r.CreateFixture(c),h.SetAsBox(u-Math.min(y,e),x),c.set_shape(h),r.CreateFixture(c),(h=new window.Box2D.b2CircleShape).set_m_p(new window.Box2D.b2Vec2(-t,s)),h.set_m_radius(m),c.set_shape(h),r.CreateFixture(c),h.set_m_p(new window.Box2D.b2Vec2(w,n)),h.set_m_radius(y),c.set_shape(h),r.CreateFixture(c),h.set_m_p(new window.Box2D.b2Vec2(-o,-i)),h.set_m_radius(g),c.set_shape(h),r.CreateFixture(c),h.set_m_p(new window.Box2D.b2Vec2(a,-l)),h.set_m_radius(e),c.set_shape(h),r.CreateFixture(c),r}function O(e,t,o,i){var n=new window.Box2D.b2PolygonShape,d=new window.Box2D.b2FixtureDef;return d.set_density(3),d.set_friction(.3),d.set_restitution(.3),n.SetAsBox(o/2/f,i/2/f),d.set_shape(n),(n=new window.Box2D.b2BodyDef).set_type(Module.b2_dynamicBody),n.set_position(new window.Box2D.b2Vec2(e/f,t/f)),(n=b.CreateBody(n)).CreateFixture(d),n}function M(e,t,o,i,n){let d=new window.Box2D.b2BodyDef,r=(d.set_type(Module.b2_dynamicBody),d.set_position(new window.Box2D.b2Vec2(e/f,t/f)),b.CreateBody(d));var s=Math.min(o,i),w=s===o&&o!==i,e=.99*s/2;s/=2;let a,l;l="object"!=typeof n?a=n:(a=Math.max(n.topLeft,n.bottomLeft),Math.max(n.bottomRight,n.bottomRight)),t=a>=s?e:a,n=s<=l?e:l,s=o/2/f,e=i/2/f,o=t/f,i=n/f;let h,c;return c=w?(h=e-o,e-i):(h=s-o,s-i),t=new window.Box2D.b2PolygonShape,(n=new window.Box2D.b2FixtureDef).set_density(3),n.set_friction(.3),n.set_restitution(.3),w?t.SetAsBox(s,e-o):t.SetAsBox(s-o,e),n.set_shape(t),r.CreateFixture(n),t=new window.Box2D.b2CircleShape,w?t.set_m_p(new window.Box2D.b2Vec2(0,-h)):t.set_m_p(new window.Box2D.b2Vec2(-h,0)),t.set_m_radius(o),n.set_shape(t),r.CreateFixture(n),w?t.set_m_p(new window.Box2D.b2Vec2(0,c)):t.set_m_p(new window.Box2D.b2Vec2(c,0)),t.set_m_radius(i),n.set_shape(t),r.CreateFixture(n),r}function N(t){try{var o=parseFloat(t.replace(/%|[cm]m|in|p[xtc]|r?em|v(?:[hw]|min|max)|ch|ex/g,""));let e=t.match(/%|[cm]m|in|p[xtc]|r?em|v(?:[hw]|min|max)|ch|ex/g);return[o,e=e&&e[0]]}catch(e){return 0}}function H(o,i){var n=new b2Vec2(0,0),d=function(o){var i=window.getComputedStyle(o),n=o.getBoundingClientRect();if(0!==n.width&&0!==n.height){var o={topLeft:(d=function(e,t,o){let i=e.split(" "),n=[];return i.length<=1&&(""===i[0]&&(i[0]="0"),i[1]=i[0]),[i[0],n[0]]=N(i[0]),[i[1],n[1]]=N(i[1]),[Math.max(i[0],i[1]),n[0]]})(i.borderTopLeftRadius),topRight:d(i.borderTopRightRadius),bottomLeft:d(i.borderBottomLeftRadius),bottomRight:d(i.borderBottomRightRadius)},d=Object.values(o).map((e,t,o)=>e[0]).reduce((e,t)=>e+t)/Object.values(o).length;let e={topLeft:o.topLeft[1],topRight:o.topRight[1],bottomLeft:o.bottomLeft[1],bottomRight:o.bottomRight[1]},t=(o={topLeft:o.topLeft[0],topRight:o.topRight[0],bottomLeft:o.bottomLeft[0],bottomRight:o.bottomRight[0]},i.lineHeight);return t.indexOf("px")&&(0===(t=parseFloat(t.slice(0,t.indexOf("px"))))||isNaN(t)||(t+=n.height/2),isNaN(t)&&(t=0)),{coordinates:{x:n.left+window.scrollX-a.width/2+n.width/2,y:-n.top-window.scrollY+a.height/2+n.height/2-t},boundings:n,borderRadiusAvg:d,borderRadius:o,borderUnits:e,borderDifferentUnits:Object.values(e).join("")!==e.topLeft.repeat(4)}}}(o);if(void 0!==d){var r=d.coordinates,s=d.boundings,w=d.borderRadius;o.style.height=s.height+"px",o.style.width=s.width+"px",o.style.lineHeight=s.height+"px",o.style.position="absolute",o.style.margin="0",o.style.padding="0",o.style.inset="0",o.style.boxShadow="none",o.style.transition="none";let e,t;return d.borderDifferentUnits?(e=F(r.x,r.y,s.width,s.height,w),t=E.RECTANGLE_ROUNDED):"%"===d.borderUnits.topLeft&&50<=d.borderRadiusAvg?(e=M(r.x,r.y,s.width,s.height,d.borderRadiusAvg/100*Math.min(s.width,s.height)),t=E.PILL):d.borderRadiusAvg>=Math.min(s.width,s.height)&&(e=M(r.x,r.y,s.width,s.height,w),t=E.PILL),0===Object.values(w).reduce((e,t)=>e[0]+t[0])?(e=O(r.x,r.y,s.width,s.height),t=E.RECTANGLE):void 0===e&&(e=F(r.x,r.y,s.width,s.height,w),t=E.RECTANGLE_ROUNDED),e.SetLinearVelocity(n),e.SetAwake(1),e.SetActive(1),i.randomForce&&(i=new b2Vec2(0,500-Math.floor(1e3*Math.random())),e.ApplyForce(i)),{type:t,origCoordinates:{x:s.x,y:s.y},coordinates:r,domElement:o,domSizes:{width:s.width,height:s.height,borderRadius:w},box:e}}}function W(){var e,t,o,i,n;for(n of D)e=n.box.GetPosition(),t=-n.box.GetAngle(),n.domElement.getBoundingClientRect(),o=n.domSizes.width,i=n.domSizes.height,o=a.width/2+e.get_x()*f-o/2,i=-(-a.height/2+e.get_y()*f+i/2),n.domElement.style.transform="translate("+o+"px, "+i+"px) rotate("+t+"rad)"}function X(){var e,t;W(),b.Step(1/60,B,B),i.debug&&(r.fillStyle="rgba(0,0,0, 0.8)",r.fillRect(0,0,d.width,d.height),r.save(),r.translate(p.x,p.y),r.scale(1,-1),r.scale(f,f),r.lineWidth=1,r.lineWidth/=f,drawAxes(r),r.fillStyle="rgb(255,255,0)",b.DrawDebugData(),null!=w&&(e=w.GetAnchorB(),t=w.GetTarget(),r.strokeStyle="rgb(204,204,204)",r.beginPath(),r.moveTo(e.get_x(),e.get_y()),r.lineTo(t.get_x(),t.get_y()),r.stroke()),r.restore()),P&&(t=Date.now(),b.Step(1/60,B,B),t=Date.now()-t,h=h*(59/60)+1/60*t,20<++c&&(c=0))}function G(){l&&requestAnimFrame(G),X()}function k(){(l=!l)&&G()}function Z(){using(window.Box2D,"b2.+"),i.debug||(e.style.display="none"),(d=document.createElement("canvas")).width=a.width,d.height=a.height,d.oncontextmenu=function(){return!1},d.onselectstart=function(){return!1},e.appendChild(d),r=d.getContext("2d"),p.x=a.width/2,p.y=a.height/2,(controlZone=document.documentElement).addEventListener("mousemove",function(e){A(controlZone,e,touch=!1)},!1),controlZone.addEventListener("mousedown",function(e){V(controlZone,e,touch=!1)},!1),controlZone.addEventListener("mouseup",function(e){T(controlZone,e,touch=!1)},!1),window.addEventListener("touchmove",function(e){A(controlZone,e,touch=!0)},{passive:!1}),window.addEventListener("touchstart",function(e){V(controlZone,e,touch=!0)},!1),window.addEventListener("touchend",function(e){T(controlZone,e),touch=!0},!1),i.keyListeners&&(controlZone.addEventListener("keydown",function(e){var t,o;controlZone;83==e.keyCode?X():88==e.keyCode?(t=L(_),f*=1.1,o=L(_),p.x+=(o.x-t.x)*f,p.y-=(o.y-t.y)*f):90==e.keyCode?(o=L(_),f/=1.1,t=L(_),p.x+=(t.x-o.x)*f,p.y-=(t.y-o.y)*f):37==e.keyCode?p.x+=32:39==e.keyCode?p.x-=32:38==e.keyCode?p.y+=32:40==e.keyCode?p.y-=32:16==e.keyCode&&(x=!0)},!1),controlZone.addEventListener("keyup",function(e){controlZone;16==e.keyCode&&(x=!1),80==e.keyCode&&k()},!1)),(t=getCanvasDebugDraw(r)).SetFlags(1),(s=new window.Box2D.JSQueryCallback).ReportFixture=function(e){return(e=window.Box2D.wrapPointer(e,b2Fixture)).GetBody().GetType()!=window.Box2D.b2_dynamicBody||!e.TestPoint(this.m_point)||(this.m_fixture=e,!1)},v(new b2Vec2(0,0),!0),null!=b&&window.Box2D.destroy(b),(b=new window.Box2D.b2World(new window.Box2D.b2Vec2(0,-0))).SetDebugDraw(t),z(),document.querySelectorAll("."+i.rigid_DOM_class).forEach(function(e,t,o){e=H(e,{}),D.push(e)}),G(),i.initPause&&k()}return window.requestAnimFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e){e()},window.Box2D||(window.Box2D=(void 0!==window.Box2D?window.Box2D:null)||window.Module),window.Box2D().then(function(e){window.Box2D=e,window.Module=window.Box2D,"complete"===document.readyState?Z():window.onload=Z}),[function(){D.forEach(function(e){e.lastVel={x:e.box.GetLinearVelocity().get_x(),y:e.box.GetLinearVelocity().get_y(),angular:e.box.GetAngularVelocity()},e.box.SetAwake(0),e.box.SetActive(0),e.coordinates={x:e.box.GetPosition().get_x()*f,y:e.box.GetPosition().get_y()*f},e.angle=e.box.GetAngle(),b.DestroyBody(e.box),C.push(e)}),D=[],a.width=window.innerWidth,d.height=0,d.style.height="0",a.height=document.documentElement.scrollHeight,d.width=a.width,d.height=a.height,d.style.height="",a.centerX=a.width/2,a.centerY=a.height/2,a.offsetX=a.width/2,a.offsetY=a.height/2,p={x:a.offsetX,y:a.offsetY},_={x:a.centerX,y:a.centerY},n&&(b.DestroyBody(n),n=void 0),o&&(b.DestroyBody(o),o=void 0),z(),v(new b2Vec2(0,0),!0),C.forEach(function(e){let t;if(e.type===E.RECTANGLE_ROUNDED)t=F(e.coordinates.x,e.coordinates.y,e.domSizes.width,e.domSizes.height,e.domSizes.borderRadius);else if(e.type===E.RECTANGLE)t=O(e.coordinates.x,e.coordinates.y,e.domSizes.width,e.domSizes.height);else if(e.type===E.PILL)t=M(e.coordinates.x,e.coordinates.y,e.domSizes.width,e.domSizes.height,e.domSizes.borderRadius);else{if(e.type!==E.ELLIPSE)return;t=function(e,t){let o=new window.Box2D.b2BodyDef,i=(o.set_type(Module.b2_dynamicBody),o.set_position(new window.Box2D.b2Vec2(e/f,t/f)),b.CreateBody(o));return(e=new window.Box2D.b2FixtureDef).set_density(3),e.set_friction(.3),e.set_restitution(.3),(t=new window.Box2D.b2CircleShape).set_m_p(new window.Box2D.b2Vec2(-offsetLeftX,0)),t.set_m_radius(b2LeftRadius),e.set_shape(t),i.CreateFixture(e),t.set_m_p(new window.Box2D.b2Vec2(offsetRightX,0)),t.set_m_radius(b2RightRadius),e.set_shape(t),i.CreateFixture(e),i}(e.coordinates.x,e.coordinates.y,(e.domSizes.width,e.domSizes.height))}t.SetAwake(1),t.SetActive(1),t.SetLinearVelocity(new b2Vec2(e.lastVel.x,e.lastVel.y)),t.SetAngularVelocity(e.lastVel.angular),D.push({type:e.type,origCoordinates:e.origCoordinates,coordinates:e.coordinates,domElement:e.domElement,domSizes:e.domSizes,box:t})}),C=[]},function(e,t){e.classList.add(i.rigid_DOM_class),t=H(e,t),W(),D.push(t)},function(){k(),D.forEach(function(w){b.DestroyBody(w.box),w.domElement.style.transition="all 0.5s",window.setTimeout(function(){w.domElement.style.margin="",w.domElement.style.padding="",w.domElement.style.boxShadow=""},200),window.setTimeout(function(){let e=a.width/2+w.box.GetPosition().get_x()*f-w.domSizes.width/2,t=-(-a.height/2+w.box.GetPosition().get_y()*f+w.domSizes.height/2);var o=Math.max(w.origCoordinates.x,w.origCoordinates.y,e,t);let i=0,n=0,d=10;function r(){e<=0&&(e+=d),0<=e&&(e-=d),t<=0&&(t+=d),0<=t&&(t-=d),i<=w.origCoordinates.x&&(i+=d),i>=w.origCoordinates.x&&(i-=d),n<=w.origCoordinates.y&&(n+=d),n>=w.origCoordinates.y&&(n-=d),w.domElement.style.left=i+"px",w.domElement.style.top=n+"px",w.domElement.style.transform=`translate(${e}px, ${t}px)`}let s=100;for(let e=0;e<=o;e+=d)window.setTimeout(r,s+=10);window.setTimeout(function(){w.domElement.style.transform="",w.domElement.style.left="",w.domElement.style.top="",w.domElement.style.inset="",w.domElement.style.position="",w.domElement.style.height="",w.domElement.style.width="",w.domElement.style.lineHeight="",w.domElement.style.transition=""},s+=200)},400),w.domElement.classList.remove(i.rigid_DOM_class)}),D=[]},function(){k()}]};