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
	var ground;

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
	var bodyTypes = {
		RECTANGLE_ROUNDED: "rectangle_rounded",
		RECTANGLE: "rectangle"
	}

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

	function createWalls() {
		mouseJointGroundBody = world.CreateBody(new window.Box2D.b2BodyDef());

		// Creacion del suelo y las paredes
		let bd_ground = new window.Box2D.b2BodyDef();
		bd_ground.restitution = 1.0;
		ground = world.CreateBody(bd_ground);
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
	function createWorld() {
		if (world != null)
			window.Box2D.destroy(world);

		world = new window.Box2D.b2World(new window.Box2D.b2Vec2(0.0, -gravityFactor));
		// world.SetVelocityThreshold(0.0);
		world.SetDebugDraw(myDebugDraw);
		createWalls();
		
	}

	function resizeWalls() {
		if(mouseJointGroundBody) {
			world.DestroyBody(mouseJointGroundBody);
			mouseJointGroundBody = undefined;
		}
		if(ground) {
			world.DestroyBody(ground);
			ground = undefined;
		}

		createWalls();
	}

	function _create_rounded_rectangle(posX, posY, width, height, radius) {
		//1. Create rigid body requirement b2BodyDef
		let bodyDefinition = new window.Box2D.b2BodyDef();
		//Remember the conversion relationship between meters and pixels
		bodyDefinition.set_type(Module.b2_dynamicBody);
		bodyDefinition.set_position(new window.Box2D.b2Vec2(posX/PTM, posY/PTM));
		
		//2. Box2D world factory has more demand to create createBody () production rigid body
		let body = world.CreateBody(bodyDefinition);
		
		//3. Create subclasses that dare to mention shape requirements b2ShapeDef
		/* Detail our needs
			Create multiple b2Shape requirements
			Then the b2Body rigid body factory creates shapes based on demand createShape
		*/
		//Convert pixels to meters in Box2D
		// Se ajusta el radio a un maximo
		let minSize = Math.min(width, height);
		let minRadius = Math.min(width, height)*0.99;
		let topLeftRadius = radius.topLeft>=minSize ? minRadius : radius.topLeft;
		let topRightRadius = radius.topRight>=minSize ? minRadius : radius.topRight;
		let bottomLeftRadius = radius.bottomLeft>=minSize ? minRadius : radius.bottomLeft;
		let bottomRightRadius = radius.bottomRight>=minSize ? minRadius : radius.bottomRight;

		let b2Width = width/2/PTM;
		let b2Height = height/2/PTM;

		let b2TopLeftRadius = topLeftRadius/PTM;
		let b2TopRightRadius = topRightRadius/PTM;
		let b2BottomLeftRadius = bottomLeftRadius/PTM;
		let b2BottomRightRadius = bottomRightRadius/PTM;
		
		let offsetTopLeftX = b2Width-b2TopLeftRadius;
		let offsetTopLeftY = b2Height-b2TopLeftRadius;

		let offsetTopRightX = b2Width-b2TopRightRadius;
		let offsetTopRightY = b2Height-b2TopRightRadius;

		let offsetBottomLeftX = b2Width-b2BottomLeftRadius;
		let offsetBottomLeftY = b2Height-b2BottomLeftRadius;

		let offsetBottomRightX = b2Width-b2BottomRightRadius;
		let offsetBottomRightY = b2Height-b2BottomRightRadius;

		//------------------------------------
		//First create two rectangles. I subtracted radius from their height and width separately for rounded corners. You can comment out the code to create rounded corners below to see the effect
		var shape = new window.Box2D.b2PolygonShape();
		var fd = new window.Box2D.b2FixtureDef();
		fd.set_density(3.0);
        fd.set_friction(0.3);
		fd.set_restitution(0.3);

		//Create two rectangles
		shape.SetAsBox(b2Width, b2Height-Math.min(b2BottomLeftRadius, b2BottomRightRadius));
		fd.set_shape(shape);
		body.CreateFixture(fd);
		shape.SetAsBox(b2Width-Math.min(b2TopRightRadius, b2BottomRightRadius), b2Height);
		fd.set_shape(shape);
		body.CreateFixture(fd);
		//------------------------------------
		//Then, create four circles on the four corners to achieve the rounded corner effect
		var circleShape = new window.Box2D.b2CircleShape();

		circleShape.set_m_p(new window.Box2D.b2Vec2(-offsetTopLeftX, offsetTopLeftY));
		circleShape.set_m_radius(b2TopLeftRadius);
		fd.set_shape(circleShape);
		body.CreateFixture(fd);

		circleShape.set_m_p(new window.Box2D.b2Vec2(offsetTopRightX, offsetTopRightY));
		circleShape.set_m_radius(b2TopRightRadius);
		fd.set_shape(circleShape);
		body.CreateFixture(fd);
		
		circleShape.set_m_p(new window.Box2D.b2Vec2(-offsetBottomLeftX, -offsetBottomLeftY));
		circleShape.set_m_radius(b2BottomLeftRadius);
		fd.set_shape(circleShape);
		body.CreateFixture(fd);
		
		circleShape.set_m_p(new window.Box2D.b2Vec2(offsetBottomRightX, -offsetBottomRightY));
		circleShape.set_m_radius(b2BottomRightRadius);
		fd.set_shape(circleShape);
		body.CreateFixture(fd);

		// body.ResetMassData();
		return body;
	}

	function _create_rectangle(posX, posY, width, height) {
		var shape = new window.Box2D.b2PolygonShape();
		var fd = new window.Box2D.b2FixtureDef();
		fd.set_density(3.0);
        fd.set_friction(0.3);
		fd.set_restitution(0.3);

		shape.SetAsBox(width/2/PTM, height/2/PTM);
		fd.set_shape(shape);
		var bodyDefinition = new window.Box2D.b2BodyDef();
		bodyDefinition.set_type(Module.b2_dynamicBody);
		bodyDefinition.set_position(new window.Box2D.b2Vec2(posX/PTM, posY/PTM));

		var body = world.CreateBody(bodyDefinition);
		body.CreateFixture(fd);

		// temp.Set(16*(Math.random()-0.5), 4.0 + 2.5*i);
		// body.SetTransform(temp, 0.0);
		return body;
	}

	function _create_pill(posX, posY, width, height, radius) {
		let bodyDefinition = new window.Box2D.b2BodyDef();
		bodyDefinition.set_type(Module.b2_dynamicBody);
		bodyDefinition.set_position(new window.Box2D.b2Vec2(posX/PTM, posY/PTM));
		
		let body = world.CreateBody(bodyDefinition);
		
		let minSize = Math.min(width, height);
		let minRadius = Math.min(width, height)*0.99;
		let maxRadiusLeft, maxRadiusRight;
		if (typeof radius !== 'object') {
			maxRadiusLeft = radius;
			maxRadiusRight = radius;
		} else{
			maxRadiusLeft = Math.max(radius.topLeft, radius.bottomLeft);
			maxRadiusRight = Math.max(radius.bottomRight, radius.bottomRight)
		}
		let leftRadius = maxRadiusLeft>=minSize ? minRadius : maxRadiusLeft;
		let rightRadius = maxRadiusRight>=minSize ? minRadius : maxRadiusRight;

		let b2Width = width/2/PTM;
		let b2Height = height/2/PTM;

		let b2LeftRadius = leftRadius/PTM;
		let b2RightRadius = rightRadius/PTM;
		
		let offsetLeftX = b2Width-b2LeftRadius;
		let offsetRightX = b2Width-b2RightRadius;

		var shape = new window.Box2D.b2PolygonShape();
		var fd = new window.Box2D.b2FixtureDef();
		fd.set_density(3.0);
        fd.set_friction(0.3);
		fd.set_restitution(0.3);

		shape.SetAsBox(b2Width-b2LeftRadius-b2RightRadius, b2Height);
		fd.set_shape(shape);
		body.CreateFixture(fd);

		var circleShape = new window.Box2D.b2CircleShape();

		circleShape.set_m_p(new window.Box2D.b2Vec2(-offsetLeftX, 0));
		circleShape.set_m_radius(b2LeftRadius);
		fd.set_shape(circleShape);
		body.CreateFixture(fd);

		circleShape.set_m_p(new window.Box2D.b2Vec2(offsetRightX, 0));
		circleShape.set_m_radius(b2RightRadius);
		fd.set_shape(circleShape);
		body.CreateFixture(fd);

		return body;
	}

	function _create_ellipse(posX, posY, width, height) {
		let bodyDefinition = new window.Box2D.b2BodyDef();
		bodyDefinition.set_type(Module.b2_dynamicBody);
		bodyDefinition.set_position(new window.Box2D.b2Vec2(posX/PTM, posY/PTM));
		
		let body = world.CreateBody(bodyDefinition);

		var fd = new window.Box2D.b2FixtureDef();
		fd.set_density(3.0);
        fd.set_friction(0.3);
		fd.set_restitution(0.3);

		var circleShape = new window.Box2D.b2CircleShape();

		circleShape.set_m_p(new window.Box2D.b2Vec2(-offsetLeftX, 0));
		circleShape.set_m_radius(b2LeftRadius);
		fd.set_shape(circleShape);
		body.CreateFixture(fd);

		circleShape.set_m_p(new window.Box2D.b2Vec2(offsetRightX, 0));
		circleShape.set_m_radius(b2RightRadius);
		fd.set_shape(circleShape);
		body.CreateFixture(fd);

		return body;
	}


	function _getNumberFromStyle(styleNumber) {
		try {
			// Si tiene px, em ...
			// Si tiene %
			// TODO Realizar las conversiones
			let num = parseFloat(styleNumber.replace(/%|[cm]m|in|p[xtc]|r?em|v(?:[hw]|min|max)|ch|ex/g, ''));
			let unit = styleNumber.match(/%|[cm]m|in|p[xtc]|r?em|v(?:[hw]|min|max)|ch|ex/g);
			if (unit) {
				unit = unit[0];
			}

			return [num, unit];
		} catch (e) {
			return 0;
		}
	}

	function get_data_from_DOMNode($nodeBody) {
		
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
		let nodeStyles = window.getComputedStyle($nodeBody);
		let boundings = $nodeBody.getBoundingClientRect();
		// Se obtienen las medidas del nodo del DOM
		if (boundings.width === 0 || boundings.height === 0) {
			return undefined;
		}

		let calculateAvgBorder = function(styleBorder, w, h) {
			let arrBorder = styleBorder.split(" ");
			let arrUnit = [];
			if (arrBorder.length <= 1) {
				if(arrBorder[0] === ""){
					arrBorder[0] = "0";
				}
				arrBorder[1] = arrBorder[0];
			}

			[arrBorder[0], arrUnit[0]] = _getNumberFromStyle(arrBorder[0]);
			[arrBorder[1], arrUnit[1]] = _getNumberFromStyle(arrBorder[1]);

			return [Math.max(arrBorder[0], arrBorder[1]), arrUnit[0]];
		}

		var borderRadius = {
			topLeft: calculateAvgBorder(nodeStyles.borderTopLeftRadius),
			topRight: calculateAvgBorder(nodeStyles.borderTopRightRadius),
			bottomLeft: calculateAvgBorder(nodeStyles.borderBottomLeftRadius),
			bottomRight: calculateAvgBorder(nodeStyles.borderBottomRightRadius)
		}
		let borderRadiusAvg = Object.values(borderRadius).map((v,i,a) => v[0]).reduce((a, b) => a + b) / Object.values(borderRadius).length;
		let borderUnits = {
			topLeft: borderRadius.topLeft[1],
			topRight: borderRadius.topRight[1],
			bottomLeft: borderRadius.bottomLeft[1],
			bottomRight: borderRadius.bottomRight[1]
		}
		borderRadius = {
			topLeft: borderRadius.topLeft[0],
			topRight: borderRadius.topRight[0],
			bottomLeft: borderRadius.bottomLeft[0],
			bottomRight: borderRadius.bottomRight[0]
		}


		let lineHeight = nodeStyles.lineHeight;
		if (lineHeight.indexOf("px")) {
			lineHeight = parseFloat(lineHeight.slice(0, lineHeight.indexOf("px")));
			if (lineHeight !== 0) {
				lineHeight = lineHeight + boundings.height / 2;
			}
		}

		
		let coordinates = {
			x: boundings.left + window.scrollX - VIEW.width / 2 + boundings.width / 2,
			y: - boundings.top - window.scrollY + VIEW.height / 2 + boundings.height / 2 - lineHeight
		};

		return {
			coordinates: coordinates,
			boundings: boundings,
			borderAvg: borderRadiusAvg,
			borderRadius: borderRadius,
			borderUnits: borderUnits,
			borderDifferentUnits: Object.values(borderUnits).join("") !== borderUnits.topLeft.repeat(4)
		};
	}

	function create_new_body($nodeBody, opts) {
		let ZERO = new b2Vec2(0, 0);
		let nodeData = get_data_from_DOMNode($nodeBody);
		if (nodeData===undefined){
			return;
		}
		let coordinates = nodeData.coordinates;
		let boundings = nodeData.boundings;
		let borderRadius = nodeData.borderRadius;
		
		// Se le agregan estilos absolutos para que el translate funcione
		$nodeBody.style.height = "fit-content";
		$nodeBody.style.width = "fit-content";
		// TODO
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

		// Se crea el cuerpo
		let body;

		if (!nodeData.borderDifferentUnits) {
			// Si el borde viene en porcentajes y es igual o superior a 50% es una elipse
			if (nodeData.borderUnits.topLeft === "%" && nodeData.borderAvg >= 50) {
				// body = _create_ellipse(coordinates.x, coordinates.y, boundings.width, boundings.height);
				body = _create_pill(
					coordinates.x, coordinates.y, boundings.width, boundings.height,
					nodeData.borderAvg/100 * Math.min(boundings.width, boundings.height)
				);
			}
			// Si el radius border es superior a la mitad del minimo ancho/alto entonces es un pill
			else if (nodeData.borderAvg >= Math.min(boundings.width, boundings.height)) {
				body = _create_pill(coordinates.x, coordinates.y, boundings.width, boundings.height, borderRadius);
			} 
		}
		// Si los bordes tiene diferentes unidades de medida se hace un rounded directamente
		else {
			body = _create_rounded_rectangle(coordinates.x, coordinates.y, boundings.width, boundings.height, borderRadius);
		}
		// Si no el radio del borde es 0 entonces es un rectangulo normal
		if (Object.values(borderRadius).reduce((a, b) => a[0] + b[0]) === 0) {
			body = _create_rectangle(coordinates.x, coordinates.y, boundings.width, boundings.height);
		}
		// Si no son cero y no se ha creado el body entonces es un rounded
		else if (body === undefined) {
			body = _create_rounded_rectangle(coordinates.x, coordinates.y, boundings.width, boundings.height, borderRadius);
		}


		// Se aplican fuerzas
		body.SetLinearVelocity(ZERO);
		body.SetAwake(1);
		body.SetActive(1);
		if (opts.randomForce) {
			let newForce = new b2Vec2(
				0,
				- Math.floor(Math.random() * 1000) + 500
			);
			body.ApplyForce(newForce);
		}

		// width_bounding = (1/(Math.cos(angle)^2-Math.sin(angle)^2)) * (  bounds.width * Math.cos(angle) - bounds.height * Math.sin(angle));
		// height_bounding = (1/(Math.cos(angle)^2-Math.sin(angle)^2)) * (- bounds.width * Math.sin(angle) + bounds.height * Math.cos(angle));

		return {
			type: bodyTypes.RECTANGLE_ROUNDED,
			coordinates: coordinates,
			domElement: $nodeBody,
			domSizes: { width: boundings.width, height: boundings.height, borderRadius: borderRadius},
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
			body.coordinates = { x: body.box.GetPosition().get_x()*PTM, y: body.box.GetPosition().get_y()*PTM };

			body.angle = body.box.GetAngle();
			world.DestroyBody(body.box);
			savedBodies.push(body);
		});

		bodies = [];

	}

	function recreate_bodies() {
		savedBodies.forEach(function (body) {
			let newBoxBody;
			if (body.type === bodyTypes.RECTANGLE_ROUNDED) {
				newBoxBody = _create_rounded_rectangle(
					body.coordinates.x, body.coordinates.y,
					body.domSizes.width, body.domSizes.height,
					body.domSizes.borderRadius
				);
			}
			else if (body.type === bodyTypes.RECTANGLE) {
				newBoxBody = _create_rectangle(
					body.coordinates.x, body.coordinates.y,
					body.domSizes.width, body.domSizes.height
				);
			}
			else {
				return;
			}

			newBoxBody.SetAwake(1);
			newBoxBody.SetActive(1);
			newBoxBody.SetLinearVelocity(new b2Vec2(body.lastVel.x, body.lastVel.y));
			newBoxBody.SetAngularVelocity(body.lastVel.angular);

			bodies.push({
				type: body.type,
				coordinates: body.coordinates,
				domElement: body.domElement,
				domSizes: body.domSizes,
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
		// canvasView.style.display = "";
		// VIEW.width = canvasView.getBoundingClientRect().width;
		VIEW.width = window.innerWidth;
		// if (!options.debug) {
		// 	canvasView.style.display = "none";
		// }
		// Cambiar por la altura que contenga el view que se quiere del elemento en este caso toda la pagina
		canvas.height = 0;
		canvas.style.height = "0";

		VIEW.height = document.documentElement.scrollHeight;
		canvas.width = VIEW.width;
		canvas.height = VIEW.height;
		canvas.style.height = "";
		VIEW.centerX = VIEW.width / 2;
		VIEW.centerY = VIEW.height / 2;
		VIEW.offsetX = VIEW.width / 2;
		VIEW.offsetY = VIEW.height / 2;
		canvasOffset = {
			x: VIEW.offsetX,
			y: VIEW.offsetY
		};
		viewCenterPixel = {
			x: VIEW.centerX,
			y: VIEW.centerY
		};

		// createWorld();
		resizeWalls();

		// Se coloca el centro de la camara
		setViewCenterWorld(new b2Vec2(0, 0), true);
		recreate_bodies();
	}

	return [exported_resize_world, exported_init_new_body];
}