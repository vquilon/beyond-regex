var DOMPhysicsBox2D = function (options) {
	var e_shapeBit = 0x0001;
	var e_jointBit = 0x0002;
	var e_aabbBit = 0x0004;
	var e_pairBit = 0x0008;
	var e_centerOfMassBit = 0x0010;

	var canvasView = document.getElementById(options.debug_DOM_id);
	var VIEW = {};
	VIEW.width = canvasView.getBoundingClientRect().width;
	// Cambiar por la altura que contenga el view que se quiere del elemento en este caso toda la pagina
	VIEW.height = document.documentElement.scrollHeight;
	VIEW.centerX = VIEW.width / 2;
	VIEW.centerY = VIEW.height / 2;
	VIEW.offsetX = VIEW.width / 2;
	VIEW.offsetY = VIEW.height / 2;

	var PTM = 32;

	var world = null;
	var mouseJointGroundBody;
	var canvas;
	var Box2D_context;
	var myDebugDraw;
	var myQueryCallback;
	var mouseJoint = null;
	var run = true;
	var frameTime60 = 0;
	var statusUpdateCounter = 0;
	var showStats = options.debug;
	var mouseDown = false;
	var shiftDown = false;
	var mousePosPixel = {
		x: 0,
		y: 0
	};
	var prevMousePosPixel = {
		x: 0,
		y: 0
	};
	var mousePosWorld = {
		x: 0,
		y: 0
	};
	var canvasOffset = {
		x: VIEW.offsetX,
		y: VIEW.offsetY
	};
	var viewCenterPixel = {
		x: VIEW.centerX,
		y: VIEW.centerY
	};
	var currentTest = null;

	var dpi = 227;
	// This gives us the gravity acceleration in pixels per square second
	var gravityFactor = dpi * 9.81 * 100 / 2.54;
	var gravityFactor = 0.0
	var precision = 9;
	var fps = 60;

	var bodies = [];
	var savedBodies = [];
	var previous = undefined;


	// Funciones auxiliares
	function myRound(val, places) {
		var c = 1;
		for (var i = 0; i < places; i++)
			c *= 10;
		return Math.round(val * c) / c;
	}

	function getWorldPointFromPixelPoint(pixelPoint) {
		return {
			x: (pixelPoint.x - canvasOffset.x) / PTM,
			y: (pixelPoint.y - (canvas.height - canvasOffset.y)) / PTM
		};
	}

	function updateMousePos(canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		mousePosPixel = {
			x: evt.clientX - rect.left,
			y: VIEW.height - (evt.clientY - rect.top)
		};

		mousePosWorld = getWorldPointFromPixelPoint(mousePosPixel);
	}

	function setViewCenterWorld(b2vecpos, instantaneous) {
		var currentViewCenterWorld = getWorldPointFromPixelPoint(viewCenterPixel);
		var toMoveX = b2vecpos.get_x() - currentViewCenterWorld.x;
		var toMoveY = b2vecpos.get_y() - currentViewCenterWorld.y;
		var fraction = instantaneous ? 1 : 0.25;
		canvasOffset.x -= myRound(fraction * toMoveX * PTM, 0);
		canvasOffset.y += myRound(fraction * toMoveY * PTM, 0);
	}

	function onMouseMove(canvas, evt) {
		prevMousePosPixel = mousePosPixel;
		updateMousePos(canvas, evt);
		// updateStats();
		if (shiftDown) {
			canvasOffset.x += (mousePosPixel.x - prevMousePosPixel.x);
			canvasOffset.y -= (mousePosPixel.y - prevMousePosPixel.y);
			// draw();
		}
		else if (mouseDown && mouseJoint != null) {
			mouseJoint.SetTarget(new window.Box2D.b2Vec2(mousePosWorld.x, mousePosWorld.y));
		}
	}

	function startMouseJoint() {

		if (mouseJoint != null)
			return;

		// Make a small box.
		var aabb = new window.Box2D.b2AABB();
		var d = 0.001;
		aabb.set_lowerBound(new b2Vec2(mousePosWorld.x - d, mousePosWorld.y - d));
		aabb.set_upperBound(new b2Vec2(mousePosWorld.x + d, mousePosWorld.y + d));

		// Query the world for overlapping shapes.            
		myQueryCallback.m_fixture = null;
		myQueryCallback.m_point = new window.Box2D.b2Vec2(mousePosWorld.x, mousePosWorld.y);
		world.QueryAABB(myQueryCallback, aabb);

		if (myQueryCallback.m_fixture) {
			var body = myQueryCallback.m_fixture.GetBody();
			var md = new window.Box2D.b2MouseJointDef();
			md.set_bodyA(mouseJointGroundBody);
			md.set_bodyB(body);
			md.set_target(new window.Box2D.b2Vec2(mousePosWorld.x, mousePosWorld.y));
			md.set_maxForce(1000 * body.GetMass());
			md.set_collideConnected(true);

			mouseJoint = window.Box2D.castObject(world.CreateJoint(md), window.Box2D.b2MouseJoint);
			body.SetAwake(true);
		}
	}

	function onMouseDown(canvas, evt) {
		updateMousePos(canvas, evt);
		if (!mouseDown)
			startMouseJoint();
		mouseDown = true;
		// updateStats();
	}

	function onMouseUp(canvas, evt) {
		mouseDown = false;
		updateMousePos(canvas, evt);
		// updateStats();
		if (mouseJoint != null) {
			world.DestroyJoint(mouseJoint);
			mouseJoint = null;
		}
	}

	function onMouseOut(canvas, evt) {
		onMouseUp(canvas, evt);
	}

	function onKeyDown(canvas, evt) {
		//console.log(evt.keyCode);
		if (evt.keyCode == 80) {//p
			pause();
		}
		// else if ( evt.keyCode == 82 ) {//r
		// 		resetScene();
		// }
		else if (evt.keyCode == 83) {//s
			step();
		}
		else if (evt.keyCode == 88) {//x
			zoomIn();
		}
		else if (evt.keyCode == 90) {//z
			zoomOut();
		}
		else if (evt.keyCode == 37) {//left
			canvasOffset.x += 32;
		}
		else if (evt.keyCode == 39) {//right
			canvasOffset.x -= 32;
		}
		else if (evt.keyCode == 38) {//up
			canvasOffset.y += 32;
		}
		else if (evt.keyCode == 40) {//down
			canvasOffset.y -= 32;
		}
		else if (evt.keyCode == 16) {//shift
			shiftDown = true;
		}

		if (currentTest && currentTest.onKeyDown)
			currentTest.onKeyDown(canvas, evt);

		// draw();
	}

	function onKeyUp(canvas, evt) {
		if (evt.keyCode == 16) {//shift
			shiftDown = false;
		}

		if (currentTest && currentTest.onKeyUp)
			currentTest.onKeyUp(canvas, evt);
	}

	function zoomIn() {
		var currentViewCenterWorld = getWorldPointFromPixelPoint(viewCenterPixel);
		PTM *= 1.1;
		var newViewCenterWorld = getWorldPointFromPixelPoint(viewCenterPixel);
		canvasOffset.x += (newViewCenterWorld.x - currentViewCenterWorld.x) * PTM;
		canvasOffset.y -= (newViewCenterWorld.y - currentViewCenterWorld.y) * PTM;
		// draw();
	}

	function zoomOut() {
		var currentViewCenterWorld = getWorldPointFromPixelPoint(viewCenterPixel);
		PTM /= 1.1;
		var newViewCenterWorld = getWorldPointFromPixelPoint(viewCenterPixel);
		canvasOffset.x += (newViewCenterWorld.x - currentViewCenterWorld.x) * PTM;
		canvasOffset.y -= (newViewCenterWorld.y - currentViewCenterWorld.y) * PTM;
		// draw();
	}

	function updateWorldFromDebugDrawCheckboxes() {
		var flags = 0;
		// if ( document.getElementById('drawShapesCheck').checked )
		flags |= e_shapeBit;
		// if ( document.getElementById('drawJointsCheck').checked )
		flags |= e_jointBit;
		// if ( document.getElementById('drawAABBsCheck').checked )
		flags |= e_aabbBit;
		/*if ( document.getElementById('drawPairsCheck').checked )
				flags |= e_pairBit;*/
		// if ( document.getElementById('drawTransformsCheck').checked )
		flags |= e_centerOfMassBit;

		myDebugDraw.SetFlags(flags);
	}

	// Funciones principales
	function init() {
		// For debugging
		if (!options.debug) {
			canvasView.style.display = "none";
		}

		canvas = document.createElement('canvas');
		canvas.width = VIEW.width;
		canvas.height = VIEW.height;
		canvas.oncontextmenu = function () { return false; };
		canvas.onselectstart = function () { return false; };

		canvasView.appendChild(canvas);
		Box2D_context = canvas.getContext('2d');

		canvasOffset.x = VIEW.width / 2;
		canvasOffset.y = VIEW.height / 2;

		// Controladores del mouse
		controlZone = document.documentElement;
		controlZone.addEventListener('mousemove', function (evt) {
			onMouseMove(controlZone, evt);
		}, false);

		controlZone.addEventListener('mousedown', function (evt) {
			onMouseDown(controlZone, evt);
		}, false);

		controlZone.addEventListener('mouseup', function (evt) {
			onMouseUp(controlZone, evt);
		}, false);

		// controlZone.addEventListener('mouseout', function(evt) {
		// 		onMouseOut(controlZone, evt);
		// }, false);

		controlZone.addEventListener('keydown', function (evt) {
			onKeyDown(controlZone, evt);
		}, false);

		controlZone.addEventListener('keyup', function (evt) {
			onKeyUp(controlZone, evt);
		}, false);

		myDebugDraw = getCanvasDebugDraw(Box2D_context);
		myDebugDraw.SetFlags(e_shapeBit);

		myQueryCallback = new window.Box2D.JSQueryCallback();

		myQueryCallback.ReportFixture = function (fixturePtr) {
			var fixture = window.Box2D.wrapPointer(fixturePtr, b2Fixture);
			if (fixture.GetBody().GetType() != window.Box2D.b2_dynamicBody) //mouse cannot drag static bodies around
				return true;
			if (!fixture.TestPoint(this.m_point))
				return true;
			this.m_fixture = fixture;
			return false;
		};

		// Se coloca el centro de la camara
		setViewCenterWorld(new b2Vec2(0, 0), true);

	}

	function createWorld() {
		if (world != null)
			window.Box2D.destroy(world);

		world = new window.Box2D.b2World(new window.Box2D.b2Vec2(0.0, -gravityFactor));
		// world.SetVelocityThreshold(0.0);
		world.SetDebugDraw(myDebugDraw);

		mouseJointGroundBody = world.CreateBody(new window.Box2D.b2BodyDef());

		// Creacion del suelo y las paredes
		var bd_ground = new window.Box2D.b2BodyDef();
		bd_ground.restitution = 1.0;
		var ground = world.CreateBody(bd_ground);
		var groundShape = new window.Box2D.b2EdgeShape();

		worldWidth = VIEW.width / PTM;
		worldHeight = VIEW.height / PTM;
		groundShape.Set(new window.Box2D.b2Vec2(-worldWidth / 2, -worldHeight / 2), new window.Box2D.b2Vec2(worldWidth / 2, -worldHeight / 2));
		ground.CreateFixture(groundShape, 0.0);

		groundShape.Set(new window.Box2D.b2Vec2(-worldWidth / 2, worldHeight / 2), new window.Box2D.b2Vec2(worldWidth / 2, worldHeight / 2));
		ground.CreateFixture(groundShape, 0.0);

		groundShape.Set(new window.Box2D.b2Vec2(-worldWidth / 2, worldHeight / 2), new window.Box2D.b2Vec2(-worldWidth / 2, -worldHeight / 2));
		ground.CreateFixture(groundShape, 0.0);

		groundShape.Set(new window.Box2D.b2Vec2(worldWidth / 2, worldHeight / 2), new window.Box2D.b2Vec2(worldWidth / 2, -worldHeight / 2));
		ground.CreateFixture(groundShape, 0.0);
	}

	function create_new_body($nodeBody, opts) {
		// $('p').each(function () {
		// $(this).html('<span>' + $(this).text().split(' ').join('</span> <span>') + '</span>');
		// $(this).find('span').each(function () {
		// 	$(this).css('display', 'inline-block');

		// var margin = {
		// 	top: window.getComputedStyle($nodeBody).marginTop,
		// 	left: window.getComputedStyle($nodeBody).marginLeft,
		// 	bottom: window.getComputedStyle($nodeBody).marginBottom,
		// 	right: window.getComputedStyle($nodeBody).marginRight,
		// }
		// if (margin.top.indexOf("px")){
		// 	margin.top = parseFloat(margin.top.slice(0, margin.top.indexOf("px")));
		// }
		// if (margin.left.indexOf("px")){
		// 	margin.left = parseFloat(margin.left.slice(0, margin.left.indexOf("px")));
		// }
		// if (margin.bottom.indexOf("px")){
		// 	margin.bottom = parseFloat(margin.bottom.slice(0, margin.bottom.indexOf("px")));
		// }
		// if (margin.right.indexOf("px")){
		// 	margin.right = parseFloat(margin.right.slice(0, margin.right.indexOf("px")));
		// }

		// var boxShadow = [];
		// while ( style = reBoxShadow.exec(window.getComputedStyle($rbody).boxShadow) ) {
		// 	let args = style[4].replace(/^\s+|\s+$|px/g, '').split(' ');
		// 	let [hShadow, vShadow, blur, spread] = args.map(function(item){
		// 		return parseFloat(item);
		// 	});
		// 	boxShadow.push({
		// 		top: (spread - vShadow + 0.5*blur),
		// 		right: (spread + hShadow + 0.5*blur),
		// 		bottom: (spread + vShadow + 0.5*blur),
		// 		left: (spread - hShadow + 0.5*blur),
		// 	});
		// }
		let ZERO = new b2Vec2(0, 0);
		var boundings = $nodeBody.getBoundingClientRect();

		var lineHeight = window.getComputedStyle($nodeBody).lineHeight;
		if (lineHeight.indexOf("px")) {
			lineHeight = parseFloat(lineHeight.slice(0, lineHeight.indexOf("px")));
			if (lineHeight !== 0) {
				lineHeight = lineHeight + boundings.height / 2;
			}
		}

		// var left = boundings.left / PTM;
		// var top = boundings.top / PTM;
		var width = (boundings.width) / PTM;
		var height = (boundings.height) / PTM;
		var angle = 0;
		if (width === 0 || height === 0) {
			return;
		}
		var coordinates = {
			x: (boundings.left + window.scrollX - VIEW.width / 2 + boundings.width / 2) / PTM,
			y: (- boundings.top - window.scrollY + VIEW.height / 2 + boundings.height / 2 - lineHeight) / PTM
		};

		// Se le agregan estilos absolutos para que el translate funcione
		$nodeBody.style.height = "fit-content";
		$nodeBody.style.width = "fit-content";
		// $nodeBody.style.height = `${boundings.height}px`;
		// $nodeBody.style.width = `${boundings.width}px`;
		$nodeBody.style.position = "absolute";
		$nodeBody.style.margin = "0";
		$nodeBody.style.top = "0";
		$nodeBody.style.left = "0";
		$nodeBody.style.right = "0";
		$nodeBody.style.bottom = "0";
		$nodeBody.style.boxShadow = "none";
		$nodeBody.style.transition = "none";

		var shape = new window.Box2D.b2PolygonShape();
		shape.SetAsBox(width / 2, height / 2);

		var bodyDefinition = new window.Box2D.b2BodyDef();
		bodyDefinition.set_type(Module.b2_dynamicBody);
		// bodyDefinition.set_position(ZERO);
		bodyDefinition.set_position(new window.Box2D.b2Vec2(coordinates.x, coordinates.y));

		var body = world.CreateBody(bodyDefinition);
		body.CreateFixture(shape, 5.0);

		// temp.Set(16*(Math.random()-0.5), 4.0 + 2.5*i);
		// body.SetTransform(temp, 0.0);
		body.SetLinearVelocity(ZERO);
		body.SetAwake(1);
		body.SetActive(1);

		if (opts.randomForce) {
			let newForce = new b2Vec2(
				Math.floor(Math.random() * 500) + 100,
				- Math.floor(Math.random() * 1000) + 500
			);
			body.ApplyForce(newForce);
		}

		// width_bounding = (1/(Math.cos(angle)^2-Math.sin(angle)^2)) * (  bounds.width * Math.cos(angle) - bounds.height * Math.sin(angle));
		// height_bounding = (1/(Math.cos(angle)^2-Math.sin(angle)^2)) * (- bounds.width * Math.sin(angle) + bounds.height * Math.cos(angle));

		return {
			coordinates: coordinates,
			domElement: $nodeBody,
			domSizes: { width: width * PTM, height: height * PTM },
			box: body
		}
	}

	function init_bodies() {
		// Se cargan los objetos que tenga una clase dada
		var i = 0;
		document.querySelectorAll(`.${options.rigid_DOM_class}`).forEach(function ($rbody, key, parent) {
			let rbody_props = create_new_body($rbody, {});

			bodies.push(rbody_props);
			i += 1;
		});
	}

	function save_bodies() {
		bodies.forEach(function (body) {
			body.lastVel = {
				x: body.box.GetLinearVelocity().get_x(),
				y: body.box.GetLinearVelocity().get_y(),
				angular: body.box.GetAngularVelocity()
			}
			body.box.SetAwake(0);
			body.box.SetActive(0);
			body.coordinates = { x: body.box.GetPosition().get_x(), y: body.box.GetPosition().get_y() };

			body.angle = body.box.GetAngle();

			savedBodies.push(body);
		});

		bodies = [];

	}

	function recreate_bodies() {
		savedBodies.forEach(function (body) {
			let shape = new window.Box2D.b2PolygonShape();
			shape.SetAsBox(body.domSizes.width / (2 * PTM), body.domSizes.height / (2 * PTM));

			let bodyDefinition = new window.Box2D.b2BodyDef();
			bodyDefinition.set_type(Module.b2_dynamicBody);
			bodyDefinition.set_position(new window.Box2D.b2Vec2(body.coordinates.x, body.coordinates.y));
			bodyDefinition.set_angle(body.angle);

			let newBoxBody = world.CreateBody(bodyDefinition);
			newBoxBody.CreateFixture(shape, 5.0);

			newBoxBody.SetAwake(1);
			newBoxBody.SetActive(1);
			newBoxBody.SetLinearVelocity(new b2Vec2(body.lastVel.x, body.lastVel.y));
			newBoxBody.SetAngularVelocity(body.lastVel.angular);

			bodies.push({
				coordinates: body.coordinates,
				domElement: body.domElement,
				domSizes: { width: body.domSizes.width, height: body.domSizes.height },
				box: newBoxBody
			});


		});
		savedBodies = [];
	}

	function step_bodies(timestamp) {
		// if (!previous) previous = timestamp;
		// var progress = timestamp - previous;
		// previous = timestamp;
		// world.Step(progress/(fps*1000), precision, precision);

		var x, y, position, angle, bounds, width, height;
		for (var body of bodies) {
			position = body.box.GetPosition();
			angle = - body.box.GetAngle();
			bounds = body.domElement.getBoundingClientRect();
			width = body.domSizes.width;
			height = body.domSizes.height;
			x = VIEW.width / 2 + position.get_x() * PTM - width / 2;
			y = - (-VIEW.height / 2 + position.get_y() * PTM + height / 2);

			// JQuery way
			// $(body.domElement).css({
			// 	transform: 'translate(' + x + 'px, ' + y + 'px) rotate(' + angle + 'rad)'
			// });
			// Javascript way
			body.domElement.style.transform = 'translate(' + x + 'px, ' + y + 'px) rotate(' + angle + 'rad)';
		}
	}

	function step() {
		// if (currentTest && currentTest.step) 
		// currentTest.step();
		step_bodies();

		world.Step(1 / 60, precision, precision);
		if (options.debug) {
			draw();
		}

		if (showStats) {
			var current = Date.now();
			world.Step(1 / 60, precision, precision);
			var frametime = (Date.now() - current);
			frameTime60 = frameTime60 * (59 / 60) + frametime * (1 / 60);

			// draw();
			statusUpdateCounter++;
			if (statusUpdateCounter > 20) {
				// updateStats();
				statusUpdateCounter = 0;
			}
		}

	}

	function draw() {
		//black background
		Box2D_context.fillStyle = 'rgba(0,0,0, 0.8)';
		Box2D_context.fillRect(0, 0, canvas.width, canvas.height);

		Box2D_context.save();
		Box2D_context.translate(canvasOffset.x, canvasOffset.y);
		Box2D_context.scale(1, -1);
		Box2D_context.scale(PTM, PTM);
		Box2D_context.lineWidth = 1;
		Box2D_context.lineWidth /= PTM;

		drawAxes(Box2D_context);

		Box2D_context.fillStyle = 'rgb(255,255,0)';
		world.DrawDebugData();

		if (mouseJoint != null) {
			//mouse joint is not drawn with regular joints in debug draw
			var p1 = mouseJoint.GetAnchorB();
			var p2 = mouseJoint.GetTarget();
			Box2D_context.strokeStyle = 'rgb(204,204,204)';
			Box2D_context.beginPath();
			Box2D_context.moveTo(p1.get_x(), p1.get_y());
			Box2D_context.lineTo(p2.get_x(), p2.get_y());
			Box2D_context.stroke();
		}

		Box2D_context.restore();
	}

	window.requestAnimFrame = (function () {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function (callback) {
				callback();
				// window.setTimeout(callback, 1000 / fps);
			};
	})();

	function animate() {
		if (run)
			requestAnimFrame(animate);

		step();
	}


	function pause() {
		run = !run;
		if (run)
			animate();
		// updateStats();
	}

	if (!window.Box2D) window.Box2D = (typeof window.Box2D !== 'undefined' ? window.Box2D : null) || window.Module;

	const afterDocumentLoaded = function () {
		using(window.Box2D, "b2.+");
		init();
		createWorld();
		init_bodies();
		// changeTest();
		animate();
	};

	window.Box2D().then(function (r) {
		window.Box2D = r;
		window.Module = window.Box2D;
		// afterDocumentLoaded();

		// NO HACE FALTA ESPERAR SIEMPRE SE DEBE CARGAR DESPUES
		if (document.readyState === "complete") {
			afterDocumentLoaded()
		} else {
			window.onload = afterDocumentLoaded
		}
	});



	function exported_init_new_body($newBodyNode, opts) {
		$newBodyNode.classList.add(options.rigid_DOM_class);
		let rbody_props = create_new_body($newBodyNode, opts);
		step_bodies();
		bodies.push(rbody_props);
	}

	function exported_resize_world() {
		save_bodies();
		canvasView.style.display = "";
		VIEW.width = canvasView.getBoundingClientRect().width;
		// Cambiar por la altura que contenga el view que se quiere del elemento en este caso toda la pagina
		VIEW.height = document.documentElement.scrollHeight;
		canvas.width = VIEW.width;
		canvas.height = VIEW.height;
		Box2D_context = canvas.getContext('2d');
		createWorld();
		recreate_bodies();
		canvasView.style.display = "none";
	}

	return [exported_resize_world, exported_init_new_body];
}