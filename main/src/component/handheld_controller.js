/* global AFRAME, THREE */

/**
 * Handles events coming from the hand-controls.
 * Determines if the entity is grabbed or released.
 * Updates its position to move along the controller.
 */
AFRAME.registerComponent("handheld_controller", {
    schema: {
      hand: {default: 'right', oneOf: ['left', 'right']},
    },
    after: ["tracked-controls-webxr"],
    before: ["aabb-collider"],
    init: function () {
      this.GRABBED_STATE = "grabbed";
      this.trigger_state = "triggered";
      this.grip_state = "gripped";
      // Bind event handlers
      this.onHit = this.onHit.bind(this);
      this.onGripOpen = this.onGripOpen.bind(this);
      this.onGripClose = this.onGripClose.bind(this);
      this.currentPosition = new THREE.Vector3();
      this.isEquipped = false;
      this.equipmentElements = [];
      this.handEl = this.el;
      this.otherHandEl = null;
      this.handText = null;
      this.handPosition = new THREE.Vector3();
      this.otherHandPosition = new THREE.Vector3();
      this.handColor = "#EF2D5E"
      this.bothHandsComponent = null;
      
      if (this.data.hand == "left") {
        this.otherHandEl = document.querySelector("#right-hand");
        this.handColor = "#3aa832";
        this.handText = document.getElementById("leftHandText");
        // let controllersEl = document.createElement("a-entity");
        // this.el.sceneEl.appendChild(controllersEl);
        // controllersEl.setAttribute("both_handheld_controllers", ""); //single entity to manage bothhands-fu, add here so handheld_controllers are ready
        // this.bothHandsComponent = controllersEl.components.both_handheld_controllers;
      } else {
          this.otherHandEl = document.querySelector("#left-hand");
         this.handText = document.getElementById("rightHandText");
      }
  
     this.mainText = document.getElementById("mainText");
  
      for (let event of [
        "abuttondown",
        "abuttonup",
        "bbuttondown",
        "bbuttonup",
        "xbuttondown",
        "xbuttonup",
        "ybuttondown",
        "ybuttonup",
        "triggerdown",
        "triggerup",
        "gripdown",
        "gripup",
        "pointup",
        "pointdown",
        "thumbup",
        "thumbdown",
        "pointingstart",
        "pointingend",
        "pistolstart",
        "pistolend",
      ]) {
        this.handEl.addEventListener(event, () => {
          // if (this.data.hand == "right") {
            this.mainText.setAttribute("color", "#EF2D5E");
            this.mainText.setAttribute("text", {"value": this.data.hand + " " + event});
          // }
  
          // console.log(this.data.hand + event);
          if (event == "ybuttonup") {
            this.equip();
          }
          if (event == "bbuttonup") {
            this.equip();
          }
          if (event == "triggerdown") {
            this.el.addState("triggered");
          }
          if (event == "triggerup") {
            this.el.removeState("triggered");
          }
          
        });
      }
    },
  
    equip: function () {
      this.isEquipped = !this.isEquipped;
      let equippableEl = this.el.querySelector(".equippable");
      if (this.isEquipped) {
        console.log("tryna equip " + this.data.hand);
  
        if (!equippableEl) {
          let equipmentEl = document.createElement("a-entity");
          this.el.appendChild(equipmentEl);
          equipmentEl.setAttribute("controller_ball_blaster", "");
          equipmentEl.classList.add("equippable");
          equipmentEl.setAttribute("rotation", "-80 0 0");
          equipmentEl.setAttribute("position", "-0.02 0 -0.01");
        } else {
          let blasterControl = equippableEl.components.controller_ball_blaster;
          // equippableEl.setAttribute('visible', true);
          if (blasterControl) {
            blasterControl.equip();
          }
        }
      } else {
        console.log("tryna de-quip " + this.data.hand);
  
        if (equippableEl) {
          let blasterControl = equippableEl.components.controller_ball_blaster;
          if (blasterControl) {
            blasterControl.dequip();
          }
        }
      }
    },
    play: function () {
      var el = this.el;
      el.addEventListener("hit", this.onHit);
      el.addEventListener("buttondown", this.onGripClose);
      el.addEventListener("buttonup", this.onGripOpen);
    },
  
    pause: function () {
      var el = this.el;
      el.removeEventListener("hit", this.onHit);
      el.addEventListener("buttondown", this.onGripClose);
      el.addEventListener("buttonup", this.onGripOpen);
    },
  
    onGripClose: function (evt) {
      // console.log("button down" + evt.detail.id);
      if (this.grabbing) {
        return;
      }
      this.grabbing = true;
      this.pressedButtonId = evt.detail.id;
      delete this.previousPosition;
      // console.log(this.data.hand + "grip close");
    },
  
    onGripOpen: function (evt) {
      // console.log("button up" + evt.detail.id);
      var hitEl = this.hitEl;
      if (this.pressedButtonId !== evt.detail.id) {
        return;
      }
      this.grabbing = false;
      if (!hitEl) {
        return;
      }
      hitEl.removeState(this.GRABBED_STATE);
      hitEl.emit("grabend");
      this.hitEl = undefined;
      // console.log(this.data.hand + 'grip open');
    },
  
    onHit: function (evt) {
      var hitEl = evt.detail.el;
      // If the element is already grabbed (it could be grabbed by another controller).
      // If the hand is not grabbing the element does not stick.
      // If we're already grabbing something you can't grab again.
      if (
        !hitEl ||
        hitEl.is(this.GRABBED_STATE) ||
        !this.grabbing ||
        this.hitEl
      ) {
        return;
      }
      hitEl.addState(this.GRABBED_STATE);
      this.hitEl = hitEl;
      console.log(this.data.hand + " hit el " + hitEl.id);
    },
    
    handDistance: function () {
  
      // if (this.handEl.is(this.trigger_state) && (this.otherHandEl.is(this.trigger_state))) {
      var handEl = this.el;
      var handPosition = this.handPosition;
      var otherHandEl = this.otherHandEl;
      var otherHandPosition = this.otherHandPosition;
  
      
      otherHandPosition.copy(otherHandEl.object3D.position);
      otherHandEl.object3D.parent.updateMatrixWorld();
      otherHandEl.object3D.parent.localToWorld(otherHandPosition);
  
      handPosition.copy(handEl.object3D.position);
      handEl.object3D.parent.updateMatrixWorld();
      handEl.object3D.parent.localToWorld(handPosition);
      
      let distance = handPosition.distanceTo(otherHandPosition);
      
      console.log("distance between hands is " + distance);
      // this.mainText.setAttribute("text", {"value": "distance is " + distance});
      return distance;
      // }
    },
  
    spawnElement: function () {

    },
    tick: function () {
      if (this.el.is("triggered")) {
          var handEl = this.el;
          var handPosition = this.handPosition;
           handPosition.copy(handEl.object3D.position);
          handEl.object3D.parent.updateMatrixWorld();
          handEl.object3D.parent.localToWorld(handPosition);
          // this.handPosition = handPosition;
          let positionString = "x: " + handPosition.x.toFixed(2) + " y: " + handPosition.y.toFixed(2) + " z: " + handPosition.z.toFixed(2); 
          this.handText.setAttribute("text", {"value": positionString});
          
          // if (this.data.hand == "left" && this.bothHandsComponent) {
          //   this.bothHandsComponent.updateLeftHandPosition(position);
          // } else if (this.data.hand == "right" && this.bothHandsComponent) {
          //   this.bothHandsComponent.updateRightHandPosition(position);
          // }
          console.log(this.data.hand + " this.handPosition " + JSON.stringify(handPosition));
          if (this.data.hand == "right" && this.otherHandEl.is("triggered")) {
              this.mainText.setAttribute("text", {"value": "distance is " + this.handDistance().toFixed(2)});

            // this.bothHandsComponent.handDistance();
            let spawnableEls = document.querySelectorAll('.spawnable'); //location with "spawnable" tag - make into 
            if (spawnableEls.length) {
              const index = getRandomInt(spawnableEls.length);
              const spawnableEl = spawnableEls[index];
              if (spawnableEl) {
                self.spawnElement(position, rotation, scaleMod, spawnableEl);
              }
            }
          }
      }
  
      
      var hitEl = this.hitEl;
      var position;
      if (!hitEl) {
        return;
      }
      this.updateDelta();
      position = hitEl.getAttribute("position");
      hitEl.setAttribute("position", {
        x: position.x + this.deltaPosition.x,
        y: position.y + this.deltaPosition.y,
        z: position.z + this.deltaPosition.z,
      });
      hitEl.object3D.updateMatrixWorld();
      
  
    },
  
    updateDelta: function () {
      var currentPosition = this.currentPosition;
      this.el.object3D.updateMatrixWorld();
      currentPosition.setFromMatrixPosition(this.el.object3D.matrixWorld);
      if (!this.previousPosition) {
        this.previousPosition = new THREE.Vector3();
        this.previousPosition.copy(currentPosition);
      }
      var previousPosition = this.previousPosition;
      var deltaPosition = {
        x: currentPosition.x - previousPosition.x,
        y: currentPosition.y - previousPosition.y,
        z: currentPosition.z - previousPosition.z,
      };
      this.previousPosition.copy(currentPosition);
      this.deltaPosition = deltaPosition;
    },
  });
  