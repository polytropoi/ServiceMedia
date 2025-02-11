/* global AFRAME, THREE, Ammo */

/**
 * Handles events coming from the hand-controls.
 * Determines if the entity is grabbed or released.
 * Updates its position to move along the controller.
 * Calcs hand positions and distance, and handles equipment
 */
AFRAME.registerComponent("handheld_inputs", {
    dependencies: ['raycaster'],
    schema: {
      hand: { default: "right", oneOf: ["left", "right"] },
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
      this.showHandLine = true;
      this.equipmentElements = [];
      this.handEl = this.el;
      this.otherHandEl = null;
      this.handText = null;
      this.handPosition = new THREE.Vector3();
      this.handDirection = new THREE.Vector3();
      this.moveTarget = new THREE.Vector3();
      this.otherHandPosition = new THREE.Vector3();
      this.handColor = "#EF2D5E";
      this.bothHandsComponent = null; //nah
      this.rayHitEl = null;
      this.equipEl = null;
      this.fatlineEl = null;
      
      // this.gazeCursorEl = document.getElementById("gazeCursorEl");
      // this.raycaster = this.el.components.raycaster;
      if (this.data.hand == "left") {
        this.otherHandEl = document.querySelector("#right-hand");
        this.handColor = "#3aa832";
        this.handText = document.getElementById("leftHandText");
      } else {
        this.otherHandEl = document.querySelector("#left-hand");
        this.handText = document.getElementById("rightHandText");
      }
      
      // let handcaster = this.el.querySelector(".handcaster");
      // handcaster.components.raycaster.enabled = true;
      // // this.controllerIsConnected = false;
      // this.el.addEventListener('controllerconnected', () => {
      //   // this.controllerIsConnected = true;
      //   console.log(this.data.hand +  "controller connected!")
      //   this.el.addState("controllerConnected");
      //   // this.el.removeAttribute("hand_input");
      //   // this.el.components.raycaster.enabled = true;
      //   // this.gazeCursorEl.components.raycaster.enabled = false;
      // });
      // this.el.addEventListener('controllerdisconnected', () => {
      //   // this.controllerIsConnected = false;
      //   this.el.removeState("controllerConnected");
      //   console.log(this.data.hand +  " controllerDisconnected");
      //   this.el.setAttribute("hand-tracking-controls", {"hand": this.data.hand});
      //   // this.el.setAttribute("hand_input", {"hand": this.data.hand});
      //   // this.el.components.raycaster.enabled = false;
      //   // this.gazeCursorEl.components.raycaster.enabled = true;
      // });
      
  
      // this.el.sceneEl.addEventListener('enter-vr', () =>{
        
           this.equipEl = document.createElement("a-entity");
           this.equipEl.classList.add("equippable");
           this.el.appendChild(this.equipEl);
  
        
           this.fatlineEl = document.createElement("a-entity");
           this.fatlineEl.classList.add("fatline");
           this.el.appendChild(this.fatlineEl);
           this.fatlineEl.setAttribute("handheld_fatline", "");
          // this.equipEl.setAttribute("visible", false);
      
      // });
      
  
      this.mainText = document.getElementById("mainText");
      this.modSynth = null;
      let modSynthEl = document.getElementById("modSynth");
      if (modSynthEl) {
        this.modSynth = modSynthEl.components.mod_synth;
      }
  
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
        "gripup"
        // "pointup",
        // "pointdown",
        // "thumbup",
        // "thumbdown",
        // "pointingstart",
        // "pointingend",
        // "pistolstart",
        // "pistolend"
  
      ]) {
        this.handEl.addEventListener(event, () => {
          // if (this.data.hand == "right") {
          this.mainText.setAttribute("color", "#EF2D5E");
          this.mainText.setAttribute("text", {
            value: this.data.hand + " " + event,
          });
          // }
  
          console.log(this.data.hand + event);
          if (event === "ybuttonup") {
            this.toggleEquipped();
          }
          if (event === "bbuttonup") {
            this.toggleEquipped();
          }
          if (event === "xbuttonup") {
            this.toggleHandLine();
            
          }
          if (event === "abuttonup") {
            this.toggleHandLine();
          }
          if (event === "triggerdown") {
            this.el.addState("triggered");
            if (this.hitEl) {
              this.hitEl.emit("click");
              console.log("tryna click on hitEl " + this.hitEl.id);
            }
          }
          if (event == "triggerup") {
            this.el.removeState("triggered");
          }
          // if (event == "pinchstarted") {
          //   if (this.hitEl) {
          //     this.hitEl.emit("click");
          //     console.log("tryna click on hitEl " + this.hitEl.id);
          //   }
          // }
        });
      }
  
      
      this.el.addEventListener('raycaster-intersection', (e) => {
        // if (this.el.is("controllerConnected")) {
          console.log('raycast hit '+ e.detail.els[0].id +' at distance ' + e.detail.intersections[0].distance );
          this.mainText.setAttribute("text", { value: "hit "+ e.detail.intersections[0].distance});
  
          e.detail.els[0].setAttribute('material', 'color', Math.random() * 0xFFFFFF);
        // this.rayHitEl = e.detail.els[0];
          if (this.modSynth) {
            // console.log("hit obj w/ tonic " + e.detail.els[0].dataset.tonic);
            if (e.detail.els[0].getAttribute("data-tonic")) {
              // this.modSynth.pChordOnOff(e.detail.intersections[0].distance, e.detail.els[0].dataset.tonic, e.detail.els[0].dataset.type, 2);
              this.modSynth.data.keyTonic = e.detail.els[0].dataset.tonic;
               this.modSynth.data.keyType = e.detail.els[0].dataset.type;
              // this.modSynth.pChordHit(e.detail.intersections[0].distance);
              // this.modSynth.pChordArp();
              console.log("gotsa key trigger")
            } else {
              
              // this.modSynth.pChordHit(e.detail.intersections[0].distance);
            }
            if (e.detail.els[0].id == "mainText") {
              // this.modSynth.toggleTransport();
            }
          }
        // }
        // let mod_el = e.detail.els[0].components.mod_el; 
        // if (mod_el) {
        //   mod_el.push();
        // }
      });
      this.el.addEventListener('raycaster-intersection-cleared', (e) => {
        // console.log('raycast hit cleared');
        // this.rayHitEl = null;
      });
  
    },
    toggleHandLine: function () {
      this.showHandLine = !this.showHandLine;
      console.log("tryna toggle handline " + this.data.hand + " " + this.showHandLine);
  
        this.fatlineEl.setAttribute("visible", this.showHandLine);
    },
    toggleEquipped: function () {
  
      console.log("tryna toggle equip " + this.data.hand + " " + this.isEquipped);
  
      if (this.equipEl) {
        if (this.equipEl.components.equip_controller) {
          this.isEquipped = !this.isEquipped;
          if (this.isEquipped) {
            this.equipEl.components.equip_controller.equip();
          } else {
            this.equipEl.components.equip_controller.dequip();
          }
        } else {
          this.equipEl.setAttribute("equip_controller", "");
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
      
      // let modSynthComponent = this.hitEl.components.mod_synth;
      if (this.modSynth) {
        this.modSynth.amNoteOff();
      }
      let modElComponent = this.hitEl.components.mod_el;
      if (modElComponent) {
        modElComponent.ungrabbed();
      }
      
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
      let modElComponent = this.hitEl.components.mod_el;
      if (modElComponent) {
        modElComponent.grabbed();
      }
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
  
      // console.log("distance between hands is " + distance);
      // this.mainText.setAttribute("text", {"value": "distance is " + distance});
      return distance;
      // }
    },
    grabDistance: function () {
      
    },
  
    tick: function () {
      if (this.el.is("triggered")) {
        var handEl = this.el;
        var handPosition = this.handPosition;
        var handDirection = this.handDirection;
  
        handPosition.copy(handEl.object3D.position);
        handEl.object3D.parent.updateMatrixWorld();
        handEl.object3D.parent.localToWorld(handPosition);
  
        handEl.object3D.getWorldDirection(handDirection);
        handDirection.normalize();
        handDirection.negate();
        var distance = this.handDistance();
        // this.handPosition = handPosition;
        let positionString =
          "x: " +
          handPosition.x.toFixed(2) +
          " y: " +
          handPosition.y.toFixed(2) +
          " z: " +
          handPosition.z.toFixed(2);
        let directionString =
          "x: " +
          handDirection.x.toFixed(2) +
          " y: " +
          handDirection.y.toFixed(2) +
          " z: " +
          handDirection.z.toFixed(2);
  
        this.handText.setAttribute("text", {
          value: positionString + "\n" + directionString,
        });
  
        // console.log(
        //   this.data.hand +
        //     " this.handPosition " +
        //     JSON.stringify(handPosition) +
        //     " this.handDirection " +
        //     JSON.stringify(handDirection)
        // );
        if (this.data.hand == "right" && this.otherHandEl.is("triggered")) {
          this.mainText.setAttribute("text", {
            value: "distance is " + distance.toFixed(2),
          });
        }
  
  
      }
  
      var hitEl = this.hitEl;
      var position;
      if (!hitEl) {
        return;
      }
      this.updateDelta();
      position = hitEl.getAttribute("position");
      // if (hitEl.)
      if (hitEl.components.mod_el && hitEl.components.mod_el.data.eltype == "slider") {
        let sliderComponent = hitEl.parentNode.components.slider;
        this.moveTarget.x = position.x + this.deltaPosition.x;
        this.moveTarget.y = position.y + this.deltaPosition.y;
        this.moveTarget.z = position.z + this.deltaPosition.z;
        
        if (sliderComponent) {
          
           var currentPosition = this.currentPosition;
          this.el.object3D.updateMatrixWorld();
          currentPosition.setFromMatrixPosition(this.el.object3D.matrixWorld);
          sliderComponent.grabbedMoved(currentPosition);
          console.log("delta grab " + JSON.stringify(currentPosition));
          
          // sliderComponent.grabbedMoved({
          //   x: position.x + this.deltaPosition.x,
          //   y: position.y + this.deltaPosition.y,
          //   z: position.z + this.deltaPosition.z,
          // });
          hitEl.object3D.updateMatrixWorld();
        }
      } else {
      
        hitEl.setAttribute("position", {
          x: position.x + this.deltaPosition.x,
          y: position.y + this.deltaPosition.y,
          z: position.z + this.deltaPosition.z,
        });
       hitEl.object3D.updateMatrixWorld();
       
      }
   
        // let modSynthComponent = hitEl.components.mod_synth;
        // if (modSynthComponent) {
        //   modSynthComponent.amNoteOn(position, handDirection, distance);
        // }
            
        if (this.modSynth) {
          if (hitEl.components.mod_el) {
            if (hitEl.components.mod_el.data.eltype == "triggerSynth") {
              this.modSynth.amNoteOn(position, handDirection, distance);
            }
            if (hitEl.components.mod_el.data.eltype == "keyTrigger") {
              // this.modSynth.toggleTransport();
            
            }
          }
          
        }
      
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
        
    }
  });
  