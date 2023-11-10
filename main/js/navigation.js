// import { Pathfinding } from '/three/pathfinding/three-pathfinding.umd.js';

// 
// const Pathfinding = window.threePathfinding.Pathfinding; //UMD
// const pathfinding = new Pathfinding();

/**
 * nav-mesh
 *
 * Waits for a mesh to be loaded on the current entity, then sets it as the
 * nav mesh in the pathfinding system.
 */
// AFRAME.registerComponent('nav-mesh', {
//   schema: {
//     nodeName: {type: 'string'}
//   },

//   init: function () {
//     this.system = this.el.sceneEl.systems.nav;
//     this.hasLoadedNavMesh = false;
//     this.nodeName = this.data.nodeName;
//     this.el.addEventListener('object3dset', this.loadNavMesh.bind(this));
//   },

//   play: function () {
//     if (!this.hasLoadedNavMesh) this.loadNavMesh();
//   },

//   loadNavMesh: function () {
//     var self = this;
//     const object = this.el.getObject3D('mesh');
//     const scene = this.el.sceneEl.object3D;

//     if (!object) return;

//     let navMesh;
//     object.traverse((node) => {
//       if (node.isMesh &&
//           (!self.nodeName || node.name === self.nodeName)) navMesh = node;
//     });

//     if (!navMesh) return;

//     scene.updateMatrixWorld();
//     this.system.setNavMeshGeometry(navMesh.geometry);
//     this.hasLoadedNavMesh = true;
//   }
// });

if (location.hostname !== 'localhost' && window.location.protocol === 'http:') window.location.protocol = 'https:';

function DetectiOS() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
} 


class Joystick
{
	// stickID: ID of HTML element (representing joystick) that will be dragged
	// maxDistance: maximum amount joystick can move in any direction
	// deadzone: joystick must move at least this amount from origin to register value change
	constructor( stickID, maxDistance, deadzone )
	{
		this.id = stickID;
        console.log("tryna get joystick el callede " + this.id);
		let stick = document.getElementById(stickID);

		// location from which drag begins, used to calculate offsets
		this.dragStart = null;

		// track touch identifier in case multiple joysticks present
		this.touchId = null;
		
		this.active = false;
		this.value = { x: 0, y: 0 }; 

		let self = this;

		function handleDown(event)
		{
		    self.active = true;

			// all drag movements are instantaneous
			stick.style.transition = '0s';

			// touch event fired before mouse event; prevent redundant mouse event from firing
			event.preventDefault();

		    if (event.changedTouches)
		    	self.dragStart = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
		    else
		    	self.dragStart = { x: event.clientX, y: event.clientY };

			// if this is a touch event, keep track of which one
		    if (event.changedTouches)
		    	self.touchId = event.changedTouches[0].identifier;
		}
		
		function handleMove(event) 
		{
		    if ( !self.active ) return;

		    // if this is a touch event, make sure it is the right one
		    // also handle multiple simultaneous touchmove events
		    let touchmoveId = null;
		    if (event.changedTouches)
		    {
		    	for (let i = 0; i < event.changedTouches.length; i++)
		    	{
		    		if (self.touchId == event.changedTouches[i].identifier)
		    		{
		    			touchmoveId = i;
		    			event.clientX = event.changedTouches[i].clientX;
		    			event.clientY = event.changedTouches[i].clientY;
		    		}
		    	}

		    	if (touchmoveId == null) return;
		    }

		    const xDiff = event.clientX - self.dragStart.x;
		    const yDiff = event.clientY - self.dragStart.y;
		    const angle = Math.atan2(yDiff, xDiff);
			const distance = Math.min(maxDistance, Math.hypot(xDiff, yDiff));
			const xPosition = distance * Math.cos(angle);
			const yPosition = distance * Math.sin(angle);

			// move stick image to new position
		    stick.style.transform = `translate3d(${xPosition}px, ${yPosition}px, 0px)`;

			// deadzone adjustment
			const distance2 = (distance < deadzone) ? 0 : maxDistance / (maxDistance - deadzone) * (distance - deadzone);
		    const xPosition2 = distance2 * Math.cos(angle);
			const yPosition2 = distance2 * Math.sin(angle);
		    const xPercent = parseFloat((xPosition2 / maxDistance).toFixed(4));
		    const yPercent = parseFloat((yPosition2 / maxDistance).toFixed(4));
		    
		    self.value = { x: xPercent, y: yPercent };
		  }

		function handleUp(event) 
		{
		    if ( !self.active ) return;

		    // if this is a touch event, make sure it is the right one
		    if (event.changedTouches && self.touchId != event.changedTouches[0].identifier) return;
        event.preventDefault();
		    // transition the joystick position back to center
		    stick.style.transition = '.2s';
		    stick.style.transform = `translate3d(0px, 0px, 0px)`;

		    // reset everything
		    self.value = { x: 0, y: 0 };
		    self.touchId = null;
		    self.active = false;
		}

		stick.addEventListener('mousedown', handleDown);
		stick.addEventListener('touchstart', handleDown);
		document.addEventListener('mousemove', handleMove, {passive: false});
		document.addEventListener('touchmove', handleMove, {passive: false});
		document.addEventListener('mouseup', handleUp);
		document.addEventListener('touchend', handleUp);
	}
}

AFRAME.registerComponent('screen-controls-nilch', //deprecated
{
	schema: 
	{
		isMobile: {default: false},
		camType: {default: "first"}
	},
    init: function () 
    {

        // let isIOS = DetectiOS();
		this.component = null;
		this.jsContainer = null;
		this.isMobile = false;
		
		this.el.addEventListener('loaded', (e) => {
		e.preventDefault();	
		this.component = null;
		this.jsContainer = document.getElementById('joystickContainer');
		this.isMobile = AFRAME.utils.device.isMobile();
		
			if (this.isMobile) {  //passed in above//nm	
				if (this.jsContainer != null) {
					this.jsContainer.style.visibility = 'visible';
					this.component = this.el.components.extended_wasd_controls;
					if (this.component == null) {
						this.component = this.el.components.extended_wasd_thirdperson;
						if (this.component) {
							this.component.setJoystickInput();
						} else {
							console.log("caint find no ewasd component!");
						}
					} else {
						this.component.setJoystickInput();
					}
					this.joystick1 = new Joystick("joystickEl", 64, 8);
					
					console.log("controls initialized : JOYSTICK" );
				//   this.isMobile = true;
				}
			} else {
				// let jsContainer = document.getElementById('joystickContainer');
				if (this.jsContainer != null) {
					this.jsContainer.style.display = 'none';
				}
				console.log("controls initialized : KEYBOID" );
				
			}
		});
      },

      tick: function(time, deltaTime)
      {
          
          if (this.isMobile && this.component != null && this.jsContainer) {

            this.component.movePercent.x =  this.joystick1.value.x;
            this.component.movePercent.z = -this.joystick1.value.y;
          }
          
      }
});
AFRAME.registerComponent('screen-controls-thirdperson', 
{
	schema: 
	{
		isMobile: {default: false},
		camType: {default: "first"}
	},
    init: function () 
    {

        // let isIOS = DetectiOS();
		this.component = null;
		this.jsContainer = null;
		this.isMobile = false;
		
		// this.el.addEventListener('loaded', (e) => {
			// e.preventDefault();	
			this.component = null;
			this.jsContainer = document.getElementById('joystickContainer');
			this.isMobile = AFRAME.utils.device.isMobile();
		
		
			if (this.isMobile) {  //passed in above//nm	
				if (this.jsContainer != null) {
					this.jsContainer.style.visibility = 'visible';
					this.component = this.el.components.extended_wasd_thirdperson;
				
					this.joystick1 = new Joystick("joystickEl", 64, 8);
					this.component.setJoystickInput();
					console.log("controls initialized : JOYSTICK" );
				//   this.isMobile = true;

				}
			} else {
				// let jsContainer = document.getElementById('joystickContainer');
				if (this.jsContainer != null) {
					this.jsContainer.style.display = 'none';
				}
				console.log("controls initialized : KEYBOID" );
			}
		// });
		this.triggerAudioEl  = document.getElementById("triggerAudio");
		this.triggerAudioController = null;
		
		if (this.triggerAudioEl != null) {
			this.triggerAudioController = this.triggerAudioEl.components.trigger_audio_control;
		}

      },

      tick: function(time, deltaTime)
      {
          if (this.isMobile && this.component != null && this.jsContainer) {
            this.component.movePercent.x =  this.joystick1.value.x;
            this.component.movePercent.z = -this.joystick1.value.y;
			if (this.triggerAudioController && this.component.movePercent.z != 0) {
				this.triggerAudioController.modLoop("rate", this.component.movePercent.z );
			} else {
				this.triggerAudioController.modLoop("rate", 0);
			}

          }
      }
});

AFRAME.registerComponent('screen-controls-firstperson', 
{
	schema: 
	{
		isMobile: {default: false},
		camType: {default: "first"}
	},
    init: function () 
    {

        // let isIOS = DetectiOS();
		this.component = null;
		this.jsContainer = null;
		this.isMobile = false;
		
		// this.el.addEventListener('loaded', (e) => {
			// e.preventDefault();	
			this.component = null;
			this.jsContainer = document.getElementById('joystickContainer');
			this.isMobile = AFRAME.utils.device.isMobile();
		
		
			if (this.isMobile) {  //passed in above//nm	
				if (this.jsContainer != null) {
					this.jsContainer.style.visibility = 'visible';
					this.component = this.el.components.extended_wasd_controls;
				
					this.joystick1 = new Joystick("joystickEl", 64, 8);
					this.component.setJoystickInput();
					console.log("controls initialized : JOYSTICK" );
				//   this.isMobile = true;
				}
			} else {
				// let jsContainer = document.getElementById('joystickContainer');
				if (this.jsContainer != null) {
					this.jsContainer.style.display = 'none';
				}
				console.log("controls initialized : KEYBOID" );
			}
		// });
      },

      tick: function(time, deltaTime)
      {
          if (this.isMobile && this.component != null && this.jsContainer) {
            this.component.movePercent.x =  this.joystick1.value.x;
            this.component.movePercent.z = -this.joystick1.value.y;
          }
      }
});
AFRAME.registerComponent('extended_wasd_controls', {

	schema: 
	{
		/*
			Default key assignments: WASDQERFTG. 
			(Pronounced: "wahz-dee-kerf-tig")
			WASD: standard forward/left/backward/right movement
			Mnemonics:
			QE: turn left/right (positioned above move left/right keys)
			RF: move up/down ("R"ise / "F"all)
			TG: look up/down (look at "T"ower / "G"round.
		*/
		moveForwardKey:  {type: 'string', default: "W"},
		moveBackwardKey: {type: 'string', default: "S"},
		moveLeftKey:     {type: 'string', default: "A"},
		moveRightKey:    {type: 'string', default: "D"},
		moveUpKey:       {type: 'string', default: "R"},
		moveDownKey:     {type: 'string', default: "F"},
		turnLeftKey:     {type: 'string', default: "Q"},
		turnRightKey:    {type: 'string', default: "E"},
		lookUpKey:       {type: 'string', default: "T"},
		lookDownKey:     {type: 'string', default: "G"},
		
  		flyEnabled:  {type: 'boolean', default: true},
  		turnEnabled: {type: 'boolean', default: true},
  		lookEnabled: {type: 'boolean', default: true},

  		maxLookEnabled: {type: 'boolean', default: true},
  		maxLookAngle:   {type: 'number',  default: 60},

  		moveSpeed: {type: 'number', default: 1},  // A-Frame units/second
		turnSpeed: {type: 'number', default: 30}, // degrees/second
		lookSpeed: {type: 'number', default: 30},  // degrees/second

		// use keyboard or other (e.g. joystick) to activate these controls
		inputType: {type: 'string', default: "keyboard"}
	},

	convertKeyName: function(keyName)
	{
		if (keyName != undefined && keyName != null) {
			if (keyName == " ")
				return "Space";
			else if (keyName.length == 1)
				return keyName.toUpperCase();
			else
				return keyName;
		}
	},

	registerKeyDown: function(keyName)
	{
		// avoid adding duplicates of keys
		if ( !this.keyPressedSet.has(keyName) )
        	this.keyPressedSet.add(keyName);
	},

	registerKeyUp: function(keyName)
	{
       	this.keyPressedSet.delete(keyName);
	},

	isKeyPressed: function(keyName)
	{
       	return this.keyPressedSet.has(keyName);
	},

	init: function()
	{
		// register key down/up events 
		//  and keep track of all keys currently pressed
		this.el.setAttribute('screen-controls-firstperson', true);

		this.keyPressedSet = new Set();
				
		let self = this;
		
		document.addEventListener( "keydown", 
			function(eventData) 
			{ 
				self.registerKeyDown( self.convertKeyName(eventData.key) );
			}
		);
		
		document.addEventListener( "keyup", 
			function(eventData) 
			{ 
				self.registerKeyUp( self.convertKeyName(eventData.key) );
			} 
		);

		// movement-related data

		this.moveVector  = new THREE.Vector3(0,0,0);
		this.movePercent = new THREE.Vector3(0,0,0);
		// z = forward/backward
		// x = left/right
		// y = up/down

		this.rotateVector  = new THREE.Vector2(0,0);
		this.rotatePercent = new THREE.Vector2(0,0);
		// y = turn angle
		// x = look angle

		// used as reference vector when turning
		this.upVector = new THREE.Vector3(0,1,0);
		
		// current rotation amounts
		this.turnAngle = 0; // around global Y axis
		this.lookAngle = 0; // around local X axis

		// this will = null or an object
		this.lookControls = this.el.components["look-controls"];
		
		// allows easy extraction of turn angle
		this.el.object3D.rotation.order = 'YXZ';
		
		this.lookControlElement = document.querySelectorAll("[look-controls]")[0];
		this.lookControls = null;
		if (this.lookControlElement) {
		  this.lookControls = this.lookControlElement.components["look-controls"];
		}
	},
	setJoystickInput: function () {
        console.log("setting ewasd controller input to JOYSTICK!");
        this.data.inputType = "joystick";
    },

	tick: function (time, timeDelta) 
	{
		let moveAmount = (timeDelta/1000) * this.data.moveSpeed;
		// need to convert angle measures from degrees to radians
		let turnAmount = (timeDelta/1000) * THREE.MathUtils.degToRad(this.data.turnSpeed);
		let lookAmount = (timeDelta/1000) * THREE.MathUtils.degToRad(this.data.lookSpeed);
		let maxLookAngle = THREE.MathUtils.degToRad(this.data.maxLookAngle);
		
		// rotations
		
		// reset values
		let totalTurnAngle = 0;
		let totalLookAngle = 0;

		// look-controls and extended_wasd_controls are compatible
		//   with desktop/mouse combo but not for tablet/gyroscope combo ("magic window" effect)
		//   (at least not with this code)
		// thus, look/turn automatically disabled when look-controls present

		if ( this.lookControls ) // take into account look-controls, if they exist
		{
			// this code is only useful when trying to combine 
			//   look-controls with extended-wasd rotation
			// totalTurnAngle += this.lookControls.yawObject.rotation.y;
			// totalLookAngle += this.lookControls.pitchObject.rotation.x;
		}
		else
		{
			if (this.data.inputType == "keyboard")
			{
				// need to reset rotatePercent values
				//   when querying which keys are currently pressed
				this.rotatePercent.set(0,0);

				if (this.isKeyPressed(this.data.lookUpKey))
					this.rotatePercent.x += 1;
				if (this.isKeyPressed(this.data.lookDownKey))
					this.rotatePercent.x -= 1;

				if (this.isKeyPressed(this.data.turnLeftKey))
					this.rotatePercent.y += 1;
				if (this.isKeyPressed(this.data.turnRightKey))
					this.rotatePercent.y -= 1;

				// center on horizon
				if (this.isKeyPressed(this.data.lookUpKey) && this.isKeyPressed(this.data.lookDownKey))
					this.lookAngle *= 0.90;
			}
			else // other, e.g. "joystick"
			{
				// assume this.rotatePercent values have been set/reset elsewhere (outside of this function)
			}

			if ( this.data.lookEnabled )
			{
				this.lookAngle += this.rotatePercent.x * lookAmount;
				this.el.object3D.rotation.x = this.lookAngle;
			}

			if ( this.data.turnEnabled )
			{
				this.turnAngle += this.rotatePercent.y * turnAmount;
				this.el.object3D.rotation.y = this.turnAngle;
			}

			// enforce bounds on look angle (avoid upside-down perspective) 
			if ( this.data.maxLookEnabled )
			{
				if (this.lookAngle > maxLookAngle)
					this.lookAngle = maxLookAngle;
				if (this.lookAngle < -maxLookAngle)
					this.lookAngle = -maxLookAngle;
			}
		}

		// translations

		// this only works when rotation order = "YXZ"
		let finalTurnAngle = this.el.object3D.rotation.y;
		
		let c = Math.cos(finalTurnAngle);
		let s = Math.sin(finalTurnAngle);

		if (this.data.inputType == "keyboard")
		{
			// need to reset movePercent values
			//   when querying which keys are currently pressed
			this.movePercent.set(0,0,0)

			if (this.isKeyPressed(this.data.moveForwardKey))
				this.movePercent.z += 1;
			if (this.isKeyPressed(this.data.moveBackwardKey))
				this.movePercent.z -= 1;

			if (this.isKeyPressed(this.data.moveRightKey))
				this.movePercent.x += 1;
			if (this.isKeyPressed(this.data.moveLeftKey))
				this.movePercent.x -= 1;

			if ( this.data.flyEnabled )
			{
				if (this.isKeyPressed(this.data.moveUpKey))
					this.movePercent.y += 1;
				if (this.isKeyPressed(this.data.moveDownKey))
					this.movePercent.y -= 1;
			}
		}
		else // other, e.g. "joystick"
		{
			// assume this.movePercent values have been set/reset elsewhere (outside of this function)
		}

		// forward(z) direction: [ -s,  0, -c ]
		//   right(x) direction: [  c,  0, -s ]
		//      up(y) direction: [  0,  1,  0 ]
		// multiply each by (maximum) movement amount and percentages (how much to move in that direction)

		this.moveVector.set( -s * this.movePercent.z + c * this.movePercent.x,
							  1 * this.movePercent.y,
							 -c * this.movePercent.z - s * this.movePercent.x ).multiplyScalar( moveAmount );

		this.el.object3D.position.add( this.moveVector );
	}
});

AFRAME.registerComponent('extended_wasd_thirdperson', {

	schema: 
	{
		/*
			Default key assignments: WASDQERFTG. 
			(Pronounced: "wahz-dee-kerf-tig")

			WASD: standard forward/left/backward/right movement
			Mnemonics:
			QE: turn left/right (positioned above move left/right keys)
			RF: move up/down ("R"ise / "F"all)
			TG: look up/down (look at "T"ower / "G"round.
		*/
		moveForwardKey:  {type: 'string', default: "W"},
		moveBackwardKey: {type: 'string', default: "S"},
		moveLeftKey:     {type: 'string', default: "A"},
		moveRightKey:    {type: 'string', default: "D"},
		moveUpKey:       {type: 'string', default: "R"},
		moveDownKey:     {type: 'string', default: "F"},
		turnLeftKey:     {type: 'string', default: "Q"},
		turnRightKey:    {type: 'string', default: "E"},
		lookUpKey:       {type: 'string', default: "T"},
		lookDownKey:     {type: 'string', default: "G"},
		
  		flyEnabled:  {type: 'boolean', default: true},
  		turnEnabled: {type: 'boolean', default: true},
  		lookEnabled: {type: 'boolean', default: true},

  		maxLookEnabled: {type: 'boolean', default: true},
  		maxLookAngle:   {type: 'number',  default: 60},

  		moveSpeed: {type: 'number', default: 1},  // A-Frame units/second
		turnSpeed: {type: 'number', default: 30}, // degrees/second
		lookSpeed: {type: 'number', default: 30},  // degrees/second

		// use keyboard or other (e.g. joystick) to activate these controls
		inputType: {type: 'string', default: "keyboard"}
	},

	convertKeyName: function(keyName)
	{
    if (keyName != undefined) {
		if (keyName == " ")
			return "Space";
		else if (keyName.length == 1)
			return keyName.toUpperCase();
		else
			return keyName;
    }
	},

	registerKeyDown: function(keyName)
	{
		// avoid adding duplicates of keys
		if ( !this.keyPressedSet.has(keyName) )
        	this.keyPressedSet.add(keyName);
	},

	registerKeyUp: function(keyName)
	{
       	this.keyPressedSet.delete(keyName);
	},

	isKeyPressed: function(keyName)
	{
       	return this.keyPressedSet.has(keyName);
	},

	resetAudio: function (keyName) {
		if (!keyName) return;
		if (this.triggerAudioController) {
			console.log("checkn keyups " + keyName + " vs " + this.data.moveForwardKey );
			if (keyName.toString().toLowerCase() == this.data.moveForwardKey.toString().toLowerCase()) {
				console.log("resetting audioloop");
				this.triggerAudioController.modLoop("rate", 0 );
			}
		}
	}, 
	init: function()
	{

		this.el.setAttribute('screen-controls-thirdperson', true);
		this.triggerAudioEl  = document.getElementById("triggerAudio");
		this.triggerAudioController = null;
		
		if (this.triggerAudioEl != null) {
			this.triggerAudioController = this.triggerAudioEl.components.trigger_audio_control;
		}
		
		// register key down/up events 
		//  and keep track of all keys currently pressed
		this.keyPressedSet = new Set();
				
		let self = this;
		
		document.addEventListener( "keydown", 
			function(eventData) 
			{ 
				self.registerKeyDown( self.convertKeyName(eventData.key) );
			}
		);
		
		document.addEventListener( "keyup", 
			function(eventData) 
			{ 
				self.registerKeyUp( self.convertKeyName(eventData.key) );
				self.resetAudio( self.resetAudio(eventData.key) );
				
			} 
		);

		// movement-related data

		this.moveVector  = new THREE.Vector3(0,0,0);
		this.movePercent = new THREE.Vector3(0,0,0);
		// z = forward/backward
		// x = left/right
		// y = up/down

		this.rotateVector  = new THREE.Vector2(0,0);
		this.rotatePercent = new THREE.Vector2(0,0);
		// y = turn angle
		// x = look angle

		// used as reference vector when turning
		this.upVector = new THREE.Vector3(0,1,0);
		
		// current rotation amounts
		this.turnAngle = 0; // around global Y axis
		this.lookAngle = 0; // around local X axis

		// this will = null or an object
		this.lookControlElement = document.querySelectorAll("[look-controls]")[0]; 
		this.lookControls = null;
		if (this.lookControlElement) {
			this.lookControls = this.lookControlElement.components["look-controls"];
			// this.lookControls.reverseTouchDrag = true;
		}
		
		
		// allows easy extraction of turn angle
		this.el.object3D.rotation.order = 'YXZ';

		this.isFlyable = false;
		if (settings != undefined && settings != null && settings.sceneCameraFlyable) {
			this.isFlyable = true;
		}
	},
	setJoystickInput: function () {
        console.log("setting ewasd controller input to JOYSTICK!");
        this.data.inputType = "joystick";
    },
	tick: function (time, timeDelta) 
	{

		let moveAmount = (timeDelta/1000) * this.data.moveSpeed;
		// need to convert angle measures from degrees to radians
		let turnAmount = (timeDelta/1000) * THREE.MathUtils.degToRad(this.data.turnSpeed);
		let lookAmount = (timeDelta/1000) * THREE.MathUtils.degToRad(this.data.lookSpeed);
		let maxLookAngle = THREE.MathUtils.degToRad(this.data.maxLookAngle);
		
		// rotations
		
		// reset values
		let totalTurnAngle = 0;
		let totalLookAngle = 0;

		// look-controls and extended_wasd_controls are compatible
		//   with desktop/mouse combo but not for tablet/gyroscope combo ("magic window" effect)
		//   (at least not with this code)
		// thus, look/turn automatically disabled when look-controls present

		if ( this.lookControls ) // take into account look-controls, if they exist
		{
			// this code is only useful when trying to combine 
			//   look-controls with extended-wasd rotation
			totalTurnAngle += this.lookControls.yawObject.rotation.y; 
			totalLookAngle += this.lookControls.pitchObject.rotation.x;
      // console.log(totalLookAngle);
		}
		// else
		// {
			if (this.data.inputType == "keyboard") {
				// need to reset rotatePercent values
				//   when querying which keys are currently pressed
				this.rotatePercent.set(0,0);

				if (this.isKeyPressed(this.data.lookUpKey))
					this.rotatePercent.x += 1;
				if (this.isKeyPressed(this.data.lookDownKey))
					this.rotatePercent.x -= 1;

				if (this.isKeyPressed(this.data.turnLeftKey))
					this.rotatePercent.y += 1;
				if (this.isKeyPressed(this.data.turnRightKey))
					this.rotatePercent.y -= 1;

				// center on horizon
				if (this.isKeyPressed(this.data.lookUpKey) && this.isKeyPressed(this.data.lookDownKey))
					this.lookAngle *= 0.90;
			} else { // other, e.g. "joystick"
			
				// assume this.rotatePercent values have been set/reset elsewhere (outside of this function)
			}

			if ( this.data.lookEnabled )
			{
				this.lookAngle += this.rotatePercent.x * lookAmount;
				this.el.object3D.rotation.x = this.lookAngle;
			}

			if ( this.data.turnEnabled )
			{
        if (this.lookControls) {
          	this.turnAngle = totalTurnAngle; //for third person cam, has look controller on parent, just need to mod the y
			if (this.isFlyable) { //unless we can fly!
				this.lookAngle = totalLookAngle;
			}
			
		} else {
          	this.turnAngle += this.rotatePercent.y * turnAmount;
			this.lookAngle += this.rotatePercent.x * lookAmount;
        }
        this.el.object3D.rotation.y = this.turnAngle;
		this.el.object3D.rotation.x = this.lookAngle;
			
		}

		// enforce bounds on look angle (avoid upside-down perspective) 
		if ( this.data.maxLookEnabled )
		{
			if (this.lookAngle > maxLookAngle)
				this.lookAngle = maxLookAngle;
			if (this.lookAngle < -maxLookAngle)
				this.lookAngle = -maxLookAngle;
		}
		// }

		// translations

		// this only works when rotation order = "YXZ"
		let finalTurnAngle = this.el.object3D.rotation.y;
		
		let c = Math.cos(finalTurnAngle);
		let s = Math.sin(finalTurnAngle);

		if (this.data.inputType == "keyboard")
		{
			// need to reset movePercent values
			//   when querying which keys are currently pressed
			this.movePercent.set(0,0,0)

			if (this.isKeyPressed(this.data.moveForwardKey))
				this.movePercent.z += 1;
			if (this.isKeyPressed(this.data.moveBackwardKey))
				this.movePercent.z -= 1;

			if (this.isKeyPressed(this.data.moveRightKey))
				this.movePercent.x += .5;
			if (this.isKeyPressed(this.data.moveLeftKey))
				this.movePercent.x -= .5;

			if ( this.data.flyEnabled )
			{
				if (this.isKeyPressed(this.data.moveUpKey))
					this.movePercent.y += 1;
				if (this.isKeyPressed(this.data.moveDownKey))
					this.movePercent.y -= 1;
			}
		}
		else // other, e.g. "joystick"
		{
			// assume this.movePercent values have been set/reset elsewhere (outside of this function)
		}

		// forward(z) direction: [ -s,  0, -c ]
		//   right(x) direction: [  c,  0, -s ]
		//      up(y) direction: [  0,  1,  0 ]
		// multiply each by (maximum) movement amount and percentages (how much to move in that direction)

		this.moveVector.set( -s * this.movePercent.z + c * this.movePercent.x,
							  1 * this.movePercent.y,
							 -c * this.movePercent.z - s * this.movePercent.x ).multiplyScalar( moveAmount );

		this.el.object3D.position.add( this.moveVector );

		if (this.triggerAudioController) {
			if (this.isKeyPressed(this.data.moveForwardKey)) {
				this.triggerAudioController.modLoop("rate", this.movePercent.z );
			}
			// } else {
			// 	if (this.registerKeyUp(this.data.moveForwardKey)) {
			// 		this.triggerAudioController.modLoop("rate", 0 );
			// 	}
			// }
		}
	}
});


/* 
from https://github.com/AdaRoseCannon/aframe-xr-boilerplate/blob/glitch/simple-navmesh-constraint.js
*/
AFRAME.registerComponent('simple-navmesh-constraint', {
    schema: {
      navmesh: {
        default: ''
      },
      fall: {
        default: 0.5
      },
      height: {
        default: 1.6
      },
      exclude: {
        default: ''
      }
    },
    init: function () {
      
	//   if (this.data.navmesh != '') {
	// 	this.hasNavmesh = true; //might get applied without a navmesh assigned
	// 	console.log("tryna init simple navmesh with a navmesh");
	//   } else {
	// 	console.log("tryna init simple navmesh no navmesh found!");
	//   }
	  
    },
    update: function () {
		// if (this.hasNavmesh) {
			this.lastPosition = null;
			this.excludes = this.data.exclude ? Array.from(document.querySelectorAll(this.data.exclude)):[];
			const els = Array.from(document.querySelectorAll(this.data.navmesh));
			if (els === null) {
				console.warn('navmesh-physics: Did not match any elements');
				this.objects = [];
			} else {
				this.objects = els.map(el => el.object3D).concat(this.excludes.map(el => el.object3D));
			}
		// }
    },
  
    tick: (function () {
	// if (this.hasNavmesh) {
      const nextPosition = new THREE.Vector3();
      const tempVec = new THREE.Vector3();
      const scanPattern = [
        [0,1], // Default the next location
        [0,0.5], // Check that the path to that location was fine
        [30,0.4], // A little to the side shorter range
        [-30,0.4], // A little to the side shorter range
        [60,0.2], // Moderately to the side short range
        [-60,0.2], // Moderately to the side short range
        [80,0.06], // Perpendicular very short range
        [-80,0.06], // Perpendicular very short range
      ];
      const down = new THREE.Vector3(0,-1,0);
      const raycaster = new THREE.Raycaster();
      const gravity = -1;
      const maxYVelocity = 0.5;
      const results = [];
      let yVel = 0;
      let firstTry = true;
      
      return function tick(time, delta) {
        if (this.lastPosition === null) {
          firstTry = true;
          this.lastPosition = new THREE.Vector3();
          this.el.object3D.getWorldPosition(this.lastPosition);
		 
        }
        // console.log("position: " + this.lastPosition.x);
        const el = this.el;
        if (this.objects.length === 0) return;
  
        this.el.object3D.getWorldPosition(nextPosition);
        if (nextPosition.distanceTo(this.lastPosition) === 0) return;
        
        let didHit = false;
        // So that it does not get stuck it takes as few samples around the user and finds the most appropriate
        scanPatternLoop:
        for (const [angle, distance] of scanPattern) {
          tempVec.subVectors(nextPosition, this.lastPosition);
          tempVec.applyAxisAngle(down, angle*Math.PI/180);
          tempVec.multiplyScalar(distance);
          tempVec.add(this.lastPosition);
          tempVec.y += maxYVelocity;
          tempVec.y -= this.data.height;
          raycaster.set(tempVec, down);
          raycaster.far = this.data.fall > 0 ? this.data.fall + maxYVelocity : Infinity;
          raycaster.intersectObjects(this.objects, true, results);
          
          if (results.length) {
            // If it hit something we want to avoid then ignore it and stop looking
            for (const result of results) {
              if(this.excludes.includes(result.object.el)) {
                results.splice(0);
                continue scanPatternLoop;
              }
            }
            const hitPos = results[0].point;
            results.splice(0);
            hitPos.y += this.data.height;
            if (nextPosition.y - (hitPos.y - yVel*2) > 0.01) {
              yVel += Math.max(gravity * delta * 0.001, -maxYVelocity);
              hitPos.y = nextPosition.y + yVel;
            } else {
              yVel = 0;
            }
            el.object3D.position.copy(hitPos);
            this.el.object3D.parent.worldToLocal(this.el.object3D.position);
            this.lastPosition.copy(hitPos);
            didHit = true;
            break;
          }
          
        }
        
        if (didHit) {
          firstTry = false;
        }
        
        if (!firstTry && !didHit) {
          this.el.object3D.position.copy(this.lastPosition);
          this.el.object3D.parent.worldToLocal(this.el.object3D.position);
        }
      }
	// } else {
	// 	console.log("no navmesh found!");
	// }
    }())
	
  });


//////////////// raycast from object for collision detection //////// //NM, maybe later...
AFRAME.registerComponent('object_raycaster', {
    schema: {
		init: {default: false},
		lookfor: {
			default: ''
		},
    //   fall: {
    //     default: 0.5
    //   },
    //   height: {
    //     default: 1.6
    //   },
      exclude: {
        default: ''
      }
    },
    init: function () {
      console.log("tryna init object raycaster");
	  this.lastPosition = null;
		this.sceneEl = document.querySelector('a-scene');
		this.objects = [];
		this.arrow = null;
		// this.objexRegistered = false;
		// for (var object of this.sceneEl.object3D.children) {
		// 	if (object.userData != null) {
		// 		console.log("GOTSOME USERDATA OBEJX :" + JSON.stringify(object.userData));
		// 	}
		// 	// console.log
		// }
    },
	registerObjects: function () {
		console.log("tryna registerObjects ");
		for (var object of this.sceneEl.object3D.children) {
			if (object.userData != null) {
				
				if (object.userData.collide) {
					console.log("GOTSOME USERDATA OBEJX :" + JSON.stringify(object.userData));
					this.objects.push(object);
				}
				
			}
			// console.log

		}
	},
    update: function () {
		this.lastPosition = null;
		for (var object of this.sceneEl.object3D.children) {
			if (object.userData != null) {
				
				if (object.userData.collide) {
					console.log("GOTSOME USERDATA OBEJX :" + JSON.stringify(object.userData));
					this.objects.push(object);
				}
				
			}
			// console.log

		}
		// for (var object of this.sceneEl.object3D.children) {
		// 	if (object.userData != null) {
		// 		console.log("GOTSOME USERDATA OBEJX :" + object.userData);
		// 	}
		// 	// console.log
		// }
		// this.excludes = this.data.exclude ? Array.from(document.querySelectorAll(this.data.exclude)):[];
		// const els = Array.from(document.querySelectorAll(this.data.navmesh));
		// if (els === null) {
		//   console.warn('navmesh-physics: Did not match any elements');
		//   this.objects = [];
		// } else {
		//   this.objects = els.map(el => el.object3D).concat(this.excludes.map(el => el.object3D));
		// }
    },
  
    tick: (function () {
      const nextPosition = new THREE.Vector3();
      const tempVec = new THREE.Vector3();

    //   const scanPattern = [
    //     [0,1], // Default the next location
    //     [0,0.5], // Check that the path to that location was fine
    //     [30,0.4], // A little to the side shorter range
    //     [-30,0.4], // A little to the side shorter range
    //     [60,0.2], // Moderately to the side short range
    //     [-60,0.2], // Moderately to the side short range
    //     [80,0.06], // Perpendicular very short range
    //     [-80,0.06], // Perpendicular very short range
    //   ];
      const down = new THREE.Vector3(0,-1,0);
      const raycaster = new THREE.Raycaster();
    //   const gravity = -1;
    //   const maxYVelocity = 0.5;
    //   const results = [];
    //   let yVel = 0;
      let firstTry = true;
	  const results = [];
      return function tick(time, delta) {
        // if (this.lastPosition === null) {
        //   firstTry = true;
        //   this.lastPosition = new THREE.Vector3();
        //   this.el.object3D.getWorldPosition(this.lastPosition);
        // }
        
        const el = this.el;
        if (this.objects.length === 0) return;

		this.el.object3D.getWorldPosition(nextPosition);
        this.el.object3D.getWorldDirection(tempVec);
        // if (nextPosition.distanceTo(this.lastPosition) === 0) return;
        
        // let didHit = false;
        // So that it does not get stuck it takes as few samples around the user and finds the most appropriate
        // scanPatternLoop:
        // for (const [angle, distance] of scanPattern) {
        //   tempVec.subVectors(nextPosition, this.lastPosition);
        //   tempVec.applyAxisAngle(down, angle*Math.PI/180);
        //   tempVec.multiplyScalar(distance);
        //   tempVec.add(this.lastPosition);
        //   tempVec.y += maxYVelocity;
        //   tempVec.y -= this.data.height;
		tempVec.normalize();
		// console.log("tryna set raycaster from " + JSON.stringify(nextPosition) + " dir " + JSON.stringify(tempVec));
          raycaster.set(nextPosition, tempVec);
          raycaster.far = 1.5;
		  if (this.arrow) {
			this.sceneEl.object3D.remove(this.arrow);
		  }
		  this.arrow = new THREE.ArrowHelper( raycaster.ray.direction, raycaster.ray.origin, 1.5, 0xff0000 );
		  this.sceneEl.object3D.add( this.arrow );
          raycaster.intersectObjects(this.objects, true, results);
          
          if (results.length) {
			console.log("results: "+ results[0].instanceId);
            // If it hit something we want to avoid then ignore it and stop looking
            // for (const result of results) {
			// 	//instanceId>

			// 	console.log("object_raycaster hitresult : "+ result.object.instanceId);
            // //   if(this.excludes.includes(result.object.el)) {
            // //     // results.splice(0);
            // //     // continue scanPatternLoop;
            // //   }
            // }
            // const hitPos = results[0].point;
            // results.splice(0);
            // hitPos.y += this.data.height;
            // if (nextPosition.y - (hitPos.y - yVel*2) > 0.01) {
            //   yVel += Math.max(gravity * delta * 0.001, -maxYVelocity);
            //   hitPos.y = nextPosition.y + yVel;
            // } else {
            //   yVel = 0;
            // }
            // el.object3D.position.copy(hitPos);
            // this.el.object3D.parent.worldToLocal(this.el.object3D.position);
            // this.lastPosition.copy(hitPos);
            // didHit = true;
            // break;
          }
          
        // }
        
        // if (didHit) {
        //   firstTry = false;
        // }
        
        // if (!firstTry && !didHit) {
        // //   this.el.object3D.position.copy(this.lastPosition);
        // //   this.el.object3D.parent.worldToLocal(this.el.object3D.position);
        // }
      }
    }())
  });

//uses threejs pathfinding, from aframe-extras //?
AFRAME.registerComponent('nav_mesh', { 
    schema: {
      initialized: {default: false},
      show: {default: false}
    },
    init: function(){
        // this.tick = AFRAME.utils.throttleTick(this.tick, 100, this);
        this.navmesh = null;
        console.log("tryna init navmesh + show " + this.data.show);
        this.navmeshIsActive = true;
        this.showMesh = false;
        this.el.addEventListener('model-loaded', () => {
            const obj = this.el.getObject3D('mesh');
        
            // _navmesh.material.visible = false;
            if (!this.data.show) {
                // obj.visible = false;
            }
            obj.traverse((node) => {
                if (node.isMesh) this.navmesh = node;
                this.initPathfinding();
            });     
        });
        
    },
    initPathfinding: function () {
        THREE.Pathfinding = window.threePathfinding.Pathfinding;
        THREE.PathfindingHelper = threePathfinding.PathfindingHelper;
        const pathfinder = new THREE.Pathfinding();
        const helper = new THREE.PathfindingHelper();
        const ZONE = 'level';
  
        if (this.navmesh != null) {
            console.time('createZone()');
            const zone = THREE.Pathfinding.createZone(this.navmesh.geometry);
            console.timeEnd('createZone()');
            pathfinder.setZoneData( ZONE, zone );
            this.pathfinder = pathfinder;
            this.helper = helper;
            this.player = document.getElementById("player");
            this.zone = ZONE;
            this.lastPosition = null;
            this.clamped = new THREE.Vector3();  
            this.closestPlayerNode = null;
            this.groupID = null;
            this.distance = 0;
            this.get_pos_rot = document.getElementById("player").components.get_pos_rot; 
            this.posReader = null;
            if (this.get_pos_rot != null) {
                this.posReader = this.get_pos_rot.returnPos();
            }
        // this.resetNavmesh();
            
        }
    },
    stick: function () {
      
        // console.log(this.navmeshIsActive + " this.distance " + this.distance);// + " " + JSON.stringify(this.lastPosition) + " " + this.posReader);
        // if (this.navmeshIsActive) {
            if (this.posReader != null && this.pathfinder != null) {
                // console.log("tyrna tick" + JSON.stringify(this.lastPosition ));
                
                if (this.lastPosition != null && this.lastPosition.x != 0 && this.lastPosition .z != 0) {
                this.helper.reset();
                this.helper.setPlayerPosition(this.lastPosition);
                this.groupID = this.pathfinder.getGroup( this.zone, this.lastPosition);
                // this.lastPosition = null;
                if (this.groupID != null && this.lastPosition != null) {
                    this.closestPlayerNode = this.pathfinder.getClosestNode( this.lastPosition, this.zone, this.groupID );
                        if (this.closestPlayerNode != null && this.lastPosition != null) {
                        this.pathfinder.clampStep(this.lastPosition, this.posReader, this.closestPlayerNode, this.zone, this.groupID, this.clamped );
                        this.clamped.y = (this.clamped.y + 1.6).toFixed(2);
                        this.clamped.x = this.clamped.x.toFixed(2);
                        this.clamped.z = this.clamped.z.toFixed(2);
                        
                        // console.log(JSON.stringify(window.playerPosition) + " vs clamped :" + JSON.stringify(this.clamped));
                        // this.player.object3D.position.copy(this.clamped);
                        if (this.lastPosition != null && this.clamped != null) {
                            this.distance = this.lastPosition.distanceTo(this.clamped); 
                            console.log(JSON.stringify(this.lastPosition) + " vs clamped :" + JSON.stringify(this.clamped) + 'distance: ' + this.distance);
                            
                            if (this.distance > .2) {
                                this.player.components.player_mover.move('player', this.clamped, null, 0);
                            } 
                            if (this.distance > 2) {
                                console.log("navmeshIsActive false");
                                // that.navmeshIsActive = null;
                                this.resetNavmesh(); //elsewise she gets lost...
                                
                                // this.resetNavmesh();
                                }
                            }
                        }
                    }
                    this.lastPosition = this.posReader;         
                } else {
                    this.lastPosition = this.posReader;
                }
            
        } else { 
            this.get_pos_rot = document.getElementById("player").components.get_pos_rot; 
            if (this.get_pos_rot) {
                this.posReader = this.get_pos_rot.returnPos();
            }    
        }
    // }//navmeshisactive
    },
    resetNavmesh: function () {
        // this.navmeshIsActive = false;
        this.pasthfinder = null;
        this.posReader = null;
        this.lastPosition = null;
        this.clamped = null;
        this.distance = 0;
        GoToNext();
        this.initPathfinding();
        // setTimeout(function () {
            
        //     this.navmeshIsActive = true;
        //     console.log(this.navmeshIsActive);
        // }, 1000);
    },
    showHideNavmesh: function () {
        this.showMesh = !this.showMesh;
        this.el.getObject3D('mesh').visible = this.showMesh;
    }

});

AFRAME.registerComponent('rotate_player_camera', { 
    schema: {
      initialized: {default: false},

    },
    init: function(){
		initialized = true;
		this.rotate = false;
		this.rotateOn();
	},
	rotateOn: function() {
		// this.rotate == !this.rotate;
		// if (this)
		console.log("tryna ROTATE_PLAYER_CAMERA");
		this.el.setAttribute('animation', 'property: rotation; to: 0 -360 0; dur: 50000; easing: easeInOutSine; loop: true;');
		// cannedAnim = "animation=\x22property: rotation; to: 0 360 0; loop: true; dur: "+duration+"\x22";
	},

});

AFRAME.registerComponent('waypoint-snap', {
	init: function(){
	let navEl = document.getElementById("nav-mesh");
	navEl.addEventListener('model-loaded', () => {
		let results = [];
	
	let navElObj = navEl.getObject3D('mesh');
          
	if (navElObj) {
		let position = this.el.getAttribute('position');
		let raycaster = new THREE.Raycaster();
		raycaster.set(new THREE.Vector3(position.x, position.y + 10, position.z), new THREE.Vector3(0, -1, 0));
		// var intersects = raycaster.intersectObject(navElObj);
		raycaster.intersectObjects(navElObj, true, results);
			
		// if (results.length) {
		if(results.length > 0) {
			console.log("gotsan navmesh intersect: " + results.length, results[0].object.name, results[0].point.y);
			position.y = results[0].point.y; //snap y of waypoint to navmesh y
			this.el.setAttribute('position', position);
			// data.waypoints[i].
			} else {
				console.log('Nope.');
			}
		} else {
			console.log("cain't find no navmesh!");
		}
		});
	}
}); 
AFRAME.registerComponent('nav_mesh_controller', {
	schema:{
		  waypoints:{type:'array', default:[]},
		  debug: {default: false}

	  },
	init: function() {
		this.isReady = false;
		this.goodWaypoints = [];
		this.waypoints = [];
		this.waypoints = document.getElementsByClassName('waypoint');
		this.el.addEventListener('model-loaded', () => {
			// this.isReady = true;
			console.log("Nav mesh loaddded!!");
			if (this.waypoints.length > 0) {
				this.registerWaypoints();
			} else {
				this.createRandomWaypoints();
			}
			this.pathfinding = this.el.sceneEl.systems.nav;
		});
		// if (this.el.object3D) {
		// 	this.isReady = true;
		// }
		
	},
	amIReady: function () {
		return this.isReady;
	},
	returnRandomNumber: function (min, max) {
		return Math.random() * (max - min) + min;
	},
	registerWaypoints: function() {
		// let waypoints = this.waypoints;
		console.log("tryna registerWaypoints...");
		results = [];
		for (let i = 0; i < this.waypoints.length; i++) {

				let position = this.waypoints[i].getAttribute('position');
				var testLineMaterial = new THREE.LineBasicMaterial({ color: 0xFF0000 });
				var points = [];
				points.push(new THREE.Vector3(position.x, position.y + 10, position.z));
				points.push(new THREE.Vector3(position.x, position.y - 10, position.z));
				var geometry = new THREE.BufferGeometry().setFromPoints(points);
				var line = new THREE.Line(geometry, testLineMaterial);

			if (this.data.debug) {
				this.el.sceneEl.object3D.add(line);
			}
			let raycaster = new THREE.Raycaster();
			raycaster.set(new THREE.Vector3(position.x, position.y + 5, position.z), new THREE.Vector3(0, -1, 0.01));
			// var intersects = raycaster.intersectObject(navElObj);
			let results = raycaster.intersectObject(this.el.getObject3D('mesh'), true);
				
			// if (results.length) {
			if(results.length > 0) {
				console.log("gotsa navmesh intersect: " + results.length, results[0].object.name, results[0].point.y);
				position.y = results[0].point.y; //snap y of waypoint to navmesh y
				this.waypoints[i].setAttribute('position', position);
				this.goodWaypoints.push(this.waypoints[i]);
				// data.waypoints[i].
			} else {
				console.log('bad nav waypoint');
				// waypoints.splice(i, 1);
			}
		}
	
		this.isReady = true;
	},
	createRandomWaypoints: function () {

		console.log("tryna createRandomWaypoints...");
		// let testPositions = [];
		let goodWaypointCount = 0;
		for (let i = 0; i < 300; i++) {
			if (goodWaypointCount > 20) {
				console.log("gots enough random waypoints...");
				break;
			}
			let testPosition = new THREE.Vector3();
			testPosition.x = this.returnRandomNumber(-100, 100);
			testPosition.y = 10;
			testPosition.z = this.returnRandomNumber(-100, 100);
			let raycaster = new THREE.Raycaster();
			raycaster.set(new THREE.Vector3(testPosition.x, testPosition.y, testPosition.z), new THREE.Vector3(0, -1, 0.01));
			let results = raycaster.intersectObject(this.el.getObject3D('mesh'), true);

			if(results.length > 0) {
				console.log("gotsa navmesh intersect: " + results.length, results[0].object.name, results[0].point.y);
				testPosition.y = results[0].point.y; //snap y of waypoint to navmesh y
				let waypointEl = document.createElement("a-box");
				waypointEl.setAttribute('scale', '.1 .1 .1');
				waypointEl.setAttribute('position', testPosition);
				this.el.sceneEl.appendChild(waypointEl);
				this.goodWaypoints.push(waypointEl);
				goodWaypointCount++;
				// data.waypoints[i].
			} else {
				console.log('bad nav waypoint');
				// waypoints.splice(i, 1);
			}
				// console.log("randomWaypoint : " + position);
			
		}
		
	},
	registerAgents: function () {
		//todo
	}

});

AFRAME.registerComponent('nav-agent-controller', {
	schema:{
		//   waypoints:{type:'array', default:[]},
		  progress:{type:'number', default:0},
		  animations:{type:'array', default:['Idle01', 'Walking01']},
		  actionType:{type:'string', default:'random'},
		  navStart:{type:'boolean', default:false}
	  },
	
	
	/*************************************************************/
  
	init: function() {
		const el = this.el;
		const data = this.data;
		const scene = document.querySelector('a-scene')
		this.initialized = false;
		this.navMeshController = null;
	  	// Get waypoints in array
		//   let raycaster = new THREE.Raycaster();
		this.navMeshControllerEl = null;
		let interval = setInterval( () => { //make sure we gotsa navmesh and it's ready
		let navMeshControllerEl = document.getElementById("nav-mesh");
		this.agentState = "Idle";
		if (navMeshControllerEl) {
			this.navMeshControllerEl = navMeshControllerEl;
			this.navMeshController = navMeshControllerEl.components["nav_mesh_controller"];
			if (this.navMeshController) {
				// console.log("gotsa NAVMESHCONTROLLER ");
				if (this.navMeshController.goodWaypoints != undefined && this.navMeshController.goodWaypoints.length > 0) {		
					this.checkPosition(); //make sure the agent is in a good spot
					clearInterval(interval);
				}
			} 
		}
	}, 1000);

	//   console.log("gotsome waypoints " + this.navMeshController.waypoints.length);
	let modModelComponent = this.el.components.mod_model; //in content-utils.js

	if (modModelComponent) {
		this.agentAction();
		el.addEventListener('navigation-start', (e)=>{
			if(!data.navStart){
				data.navStart=true;
				modModelComponent.playWalkAnimation();
			}
		});
		el.addEventListener('navigation-end', (e)=>{
			this.agentAction();
		})
		el.addEventListener('navigation-null', (e)=>{
			console.log("Nav Null");
			// this.actorAnimation(data.animations[0], 2.4);
		});		
	} else {
		let modObjectComponent = this.el.components.mod_object; //in content-utils.js
		if (modObjectComponent) {
			this.agentAction();
			el.addEventListener('navigation-start', (e)=>{
			if(!data.navStart){
				data.navStart=true;
				modObjectComponent.playWalkAnimation();
			}
			});
	
			/****************************************/
			el.addEventListener('navigation-end', (e)=>{
			this.agentAction();
			})
	
			/****************************************/
			el.addEventListener('navigation-null', (e)=>{
			console.log("Nav Null");
			});
		} else { //i.e. test/external assets
			this.agentAction();
			el.addEventListener('navigation-start', (e)=>{
			
			});
	
			/****************************************/
			el.addEventListener('navigation-end', (e)=>{
			this.agentAction();
			})
	
			/****************************************/
			el.addEventListener('navigation-null', (e)=>{
			console.log("Nav Null");
			});
		}
	}
	},
	
	checkPosition: function () { //starting from legit spot?
		let testPosition = this.el.getAttribute("position");

		let raycaster = new THREE.Raycaster();
		raycaster.set(new THREE.Vector3(testPosition.x, testPosition.y + 3, testPosition.z), new THREE.Vector3(0, -1, 0.01));
		let results = raycaster.intersectObject(this.navMeshControllerEl.getObject3D('mesh'), true);

		if(results.length > 0) {
			console.log("good spot to start from!");
			this.agentAction();
		} else {
			
			// waypoints.splice(i, 1);
			let wpIndex = Math.floor(Math.random()*this.navMeshController.goodWaypoints.length); //snap to random waypoint if pos no good...
			let position = this.navMeshController.goodWaypoints[wpIndex].getAttribute("position");
			console.log('bad agent start point! moving to ' + position);
			this.el.setAttribute("position", position);
			this.agentAction();
		}
	},
	// /*************************************************************/
	
	// actorAnimation: function(animation, time){
	//   // console.log("Start animation");
	//   // console.log("Animation =", animation);
	//   const el=this.el;
	//   const data = this.data;
	//   el.setAttribute('animation-mixer', 'clip', animation);
	//   el.setAttribute('animation-mixer', 'timeScale', time);
	//   el.setAttribute('animation-mixer', 'crossFadeDuration', 0);
	// },
	
	// /*************************************************************/
	
	agentAction: function(){

		if (this.navMeshController && this.navMeshController.goodWaypoints.length > 0) {

				let nextWaypointIndex = Math.floor(Math.random()*this.navMeshController.goodWaypoints.length); //random for now
				//   };

				this.el.setAttribute('nav-agent', {
					active:true,
					destination:this.navMeshController.goodWaypoints[nextWaypointIndex].getAttribute('position')
				});
				//   console.log("trynna nextWaypointIndex " + nextWaypointIndex);
				// } else {
				// 	console.log("no waypoints found");
				// }
			
			} else {
				console.log("cain't find navmensch controllern waypoints");	
			}
		}
  });