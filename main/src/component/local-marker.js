

AFRAME.registerComponent('local_marker', { //special items with local mods
    schema: {
      // eventData: {default: ''},
      modelID: {default: 'none'},
      selectedAxis: {default: 'all'},
      timestamp: {default: ''},
      name: {default: 'local placeholder'},
      description: {default: ''},
      markerType: {default: 'placeholder'},
      eventData: {default: ''},
      isLocal: {default: true},
      isSelected: {default: false},
      tags: {default: ''},
      position: {default: ''},
      rotation: {default: ''},
      scale: {default: '1'},
      isNew: {default: false}
  
    },
    init: function () {
     
      this.timestamp = this.data.timestamp;
      if (this.timestamp == '') {
        this.timestamp = Math.round(Date.now() / 1000).toString();
        this.data.timestamp = this.timestamp;
      }
      
      if (this.data.eventData.includes("navmesh")) {
        return;
      }
      // this.scale = {x: this.data.scale.x, y: this.data.scale.y, z: this.data.scale.z};
      this.scale = "1 1 1";
  
      var sceneEl = document.querySelector('a-scene');
  
      this.calloutEntity = document.createElement("a-entity");
      // this.calloutPanel = document.createElement("a-entity");
      this.calloutText = document.createElement("a-entity");
      this.viewportHolder = document.getElementById('viewportPlaceholder3');
      var cameraPosition = new THREE.Vector3(); 
      this.viewportHolder.object3D.getWorldPosition( cameraPosition );
  
      this.calloutEntity.setAttribute('visible', false);
      this.selectedAxis = null;
      this.isSelected = false;
      this.hitPosition = null;
      this.mouseDownPos = new THREE.Vector2();
      this.mousePos = new THREE.Vector2();
      this.distance = 0;
  
      this.el.classList.add('activeObjexRay');
      this.el.classList.add('activeObjexGrab');
      this.clientX = 0;
      this.clientY = 0;
  
      
      sceneEl.appendChild(this.calloutEntity);
      
      this.calloutEntity.appendChild(this.calloutText);
  
      this.calloutText.setAttribute("position", '0 0 1.25'); //offset the child on z toward camera, to prevent overlap on model
  
      this.calloutText = document.createElement("a-entity");
      this.calloutText.setAttribute("overlay");
      let theElement = this.el;
      // this.el.setAttribute('skybox-env-map');
      // 
      this.el.classList.add("allowMods");
        this.phID = this.timestamp; //"placeholder" id, for client side location mods
        this.el.id = this.phID;
  
            if (this.data.isNew) { //just created, not loaded from db
              this.el.setAttribute("gltf-model", "#poi1");
              this.el.setAttribute('position', this.data.position);
              // if (this.data.markerType != "none" && this.data.markerType != "player") {
              //   this.el.setAttribute('gltf-model', '#poi1');
              // }
              // this.el.setAttribute('gltf-model', '#poi1');
              // this.el.setAttribute('scale', this.scale);
              this.el.id = this.timestamp;
              // console.log("tryna set new localmarker with phID " + this.timestamp + " and markerType " + this.data.markerType);
               //check for tag?
            } else { //it's been saved to localDB, w/ position
  
              // this.el.setAttribute("gltf-model", "#poi1");
              this.el.setAttribute('position', this.data.position);
              this.el.setAttribute('rotation', this.data.rotation);
              this.el.setAttribute('scale', this.scale);
              if (this.data.modelID != 'none') {
                if (this.data.modelID.toString().includes("primitive")) {
                    if (this.data.modelID.toString().includes("cube")) {
                        this.el.setAttribute("geometry", {primitive: "box", width: 1, height: 1, depth: 1});
                        
                    } else if (this.data.modelID.toString().includes("sphere")) {
                        this.el.setAttribute("geometry", {primitive: "sphere", radius: 1});
                      
                    } else if (this.data.modelID.toString().includes("cylinder")) {
                        this.el.setAttribute("geometry", {primitive: "cylinder", height: 1, radius: .5});
                       
                    } else {
                        
                    }
                    if (this.data.markerType.toLowerCase() == "placeholder") {
                        this.el.setAttribute("material", {color: "yellow", transparent: true, opacity: .5});
                    } else if (this.data.markerType.toLowerCase() == "poi") {
                        this.el.setAttribute("material", {color: "purple", transparent: true, opacity: .5});
                    } else if (this.data.markerType.toLowerCase().includes("trigger")) {
                        this.el.setAttribute("material", {color: "lime", transparent: true, opacity: .5});
                    } else if (this.data.markerType.toLowerCase() == "gate") {
                        this.el.setAttribute("material", {color: "orange", transparent: true, opacity: .5});
                    } else if (this.data.markerType.toLowerCase() == "portal") {
                    
                    } else if (this.data.markerType.toLowerCase() == "mailbox") {
                    
                    } else {
                        
                    }
                } else {
                    this.loadModel(this.data.modelID);
                }
              } else {
                this.el.setAttribute('position', this.data.position);
                this.el.setAttribute('rotation', this.data.rotation);
                this.el.setAttribute('scale', this.scale);
                if (this.data.markerType == "none" || this.data.markerType == "player") {
                    //skip
                    
                } else if (this.data.markerType == "waypoint") {
                    this.el.setAttribute("gltf-model", "#poi1");
                    this.el.classList.add("waypoint");
                } else if (this.data.markerType == "mailbox") {
                    this.el.setAttribute("gltf-model", "#mailbox");
                    this.el.classList.add("mailbox");
                } else if (this.data.markerType == "gate") {
                    this.el.setAttribute("gltf-model", "#gate2");
                    
                } else {
                    this.el.setAttribute("gltf-model", "#poi1");
                } 
            }
             
  
              this.el.id = this.data.timestamp;
              console.log("tryna set localmarker with phID " + this.timestamp + " and markerType " + this.data.markerType);
              // this.waitAndLoad();
            }
  
  
            this.clientX = 0;
            this.clientY = 0;
            this.selectedAxis = null;
            this.isSelected = false;
            this.hitPosition = null;
            this.mouseDownPos = new THREE.Vector2();
            this.mousePos = new THREE.Vector2();
            this.distance = 0;
      
            if (!this.data.tags.includes("hide callout") && !this.data.tags.includes("hide callout")) {
           
              this.calloutEntity.setAttribute("look-at", "#player");
              this.calloutEntity.setAttribute('visible', false);
            
              sceneEl.appendChild(this.calloutEntity);
              // this.calloutEntity.appendChild(this.calloutPanel);
              this.calloutEntity.appendChild(this.calloutText);
      
              this.calloutText.setAttribute("position", '0 0 1.25'); //offset the child on z toward camera, to prevent overlap on model
              this.font2 = "Acme.woff";
      
              if (settings && settings.sceneFontWeb1) {
                this.font2 = settings.sceneFontWeb2;
              }
              this.calloutText.setAttribute('troika-text', {
                // width: .5,
                baseline: "bottom",
                align: "left",
                fontSize: .1,
                font: "/fonts/web/"+ this.font2,
                anchor: "center",
                color: "white",
                outlineColor: "black",
                outlineWidth: "2%",
                value: ""
              });
            }
      
          this.calloutText.setAttribute("overlay");
          this.calloutToggle = false;
          this.calloutToggle = false;
          let that = this;
          // that.calloutEntity = this.calloutEntity;
          // that.calloutText = this.calloutText;
          this.el.addEventListener("model-loaded", (e) => {
            // e.preventDefault();
  
            console.log("local_marker geo is loaded for markertype " + this.data.markerType);
            if (this.data.isNew) {
              this.el.setAttribute("transform_controls", "");
            }
            this.el.setAttribute("visible", true);
            const obj = this.el.getObject3D('mesh');
          // Go over the submeshes and modify materials we want.
              obj.traverse(node => {
                if (node.isMesh && node.material) {
                  if (this.data.markerType == "waypoint") {
                    node.material.color.set('lime');
                  } else if  (this.data.markerType == "placeholder") {
                    node.material.color.set('yellow');
                  } else if  (this.data.markerType == "poi") {
                    node.material.color.set('purple');
                  } 
                }
              });
              this.el.setObject3D('mesh', obj);
              if (this.data.markerType == "gate") {
                this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder"});
              }
            // this.el.setAttribute("transform_controls", ""); //check for tag?
          });
         this.el.addEventListener('mouseenter', function (evt) {
  
  
        if (evt.detail.intersection) {
          this.clientX = evt.clientX;
          this.clientY = evt.clientY;
          // console.log("tryna mouseover placeholder");
          that.calloutToggle = !that.calloutToggle;
          let pos = evt.detail.intersection.point; //hitpoint on model
          that.hitPosition = pos;
          let name = evt.detail.intersection.object.name;
          // that.distance = window.playerPosition.distanceTo(pos);
          that.distance = evt.detail.intersection.distance;
          that.rayhit(evt.detail.intersection.object.name, that.distance, evt.detail.intersection.point);
       
          that.selectedAxis = name;
  
          // let elPos = that.el.getAttribute('position');
          // console.log(pos);
          if (that.calloutEntity != null) {
            console.log("tryna show the callout " + that.distance);
            if (that.distance < 66) {
            that.calloutEntity.setAttribute("position", pos);
            that.calloutEntity.setAttribute('visible', true);
            that.calloutEntity.setAttribute('scale', {x: that.distance * .25, y: that.distance * .25, z: that.distance * .25} );
            // if (that.data.markerType == "poi" && !that.data.modelID) {
            //   // that.el.setAttribute('scale', {x: that.distance * .25, y: that.distance * .25, z: that.distance * .25} );
            // }
           
            let theLabel = that.data.name != undefined ? that.data.name : "";
            let calloutString = theLabel;
            if (that.calloutToggle) {
              // calloutString = "x : " + elPos.x.toFixed(2) + "\n" +"y : " + elPos.y.toFixed(2) + "\n" +"z : " + elPos.z.toFixed(2);
              calloutString = that.data.description != '' ? that.data.description : theLabel;
            }
            that.calloutText.setAttribute("troika-text", {value: calloutString});
            }
          }
        }
      });
  
      this.el.addEventListener('mouseleave', function (evt) {
        that.calloutEntity.setAttribute('visible', false);
        // if (that.selectedAxis != null && !that.selectedAxis.includes('handle')) {
        //   that.isSelected = false;
  
        // }
      });
  
      this.el.addEventListener('mousedown', function (evt) {
        if (keydown == "T") {
          ToggleTransformControls(that.timestamp);
        } else if (keydown == "Shift") {
          ShowLocationModal(that.timestamp);
        }
      });
      this.el.addEventListener('mouseup', function (evt) {
        console.log("tryna mouseup localmarker type " + that.data.markerType);
  
        if (that.data.markerType.toLowerCase() == "mailbox") {
          console.log('tryna sho0w messages modal');
          SceneManglerModal('Messages');
        }
        // that.deselect(); 
      });
  
  
    },
    loadObject: function (objectID) { //local object swap (maybe with child model...);
      console.log("tryna load modeID " + objectID);
      if (objectID != undefined && objectID != null & objectID != "none" && objectID != "") {  
        for (let i = 0; i < sceneObjects.length; i++) {
          if (sceneObjects[i]._id == objectID) {
            // this.el.setAttribute('gltf-model', sceneObjects[i].url);
  
            let objexEl = document.getElementById('sceneObjects');    
            if (objexEl) { 
              this.objectData = objexEl.components.mod_objex.returnObjectData(objectID);
              if (this.objectData) {
                if (this.objectElementID != null) {
                  document.getElementById(this.objectElementID).remove(); //wait, what?
                }
                this.locData = {};
                this.locData.x = this.el.object3D.position.x;
                this.locData.y = this.el.object3D.position.y;
                this.locData.z = this.el.object3D.position.z;
                this.locData.timestamp = Date.now();
                
                let objEl = document.createElement("a-entity");
                
                objEl.setAttribute("mod_object", {'locationData': this.locData, 'objectData': this.objectData});
                objEl.id = "obj" + objectData._id + "_" + this.locData.timestamp;
                this.objectElementID = objEl.id; //USED AS A REFERENCE TO GET AND REMOVE (above) EXISTING PLACEHOLDER OBJECT
                sceneEl.appendChild(objEl);
              }
            }
          }
        }
      } 
    },
    loadModel: function (modelID) { //local model swap
      console.log("tryna load modeID " + modelID);
      if (modelID != undefined && modelID != null & modelID != "none" && modelID != "") {  
        for (let i = 0; i < sceneModels.length; i++) {
          if (sceneModels[i]._id == modelID) {
            this.el.setAttribute('gltf-model', sceneModels[i].url);
          }
        }
      } else { //if "none"
        if (this.data.markerType == "poi" || this.data.markerType == "waypoint" || this.data.markerType == "placeholder") {
            this.el.setAttribute("gltf-model", "#poi1");
        } else if (this.data.markerType == "gate"){
            this.el.setAttribute("gltf-model", "#gate2");
        }
        
      }
    },
    waitAndLoad: function () {
      let random = Math.random() * 1000;  
      setTimeout( () => {
        console.log("TRYNA WAIT AND LOAD THE TINEY MODEL>>>");
        this.el.setAttribute("gltf-model", "#poi1");
  
      }, random);
    },
    deselect: function () {
      this.isSelected = false;
    },
    playerTriggerHit: function () { //might use AABB collider or physics
      console.log("gotsa player trigger hit on local marker with type " + this.data.markerType.toLowerCase()); 
        if (this.data.markerType.toLowerCase() == "spawntrigger") {
  
            let objexEl = document.getElementById('sceneObjects');    
            objexEl.components.mod_objex.spawnObject(this.data.eventData);
        }
        if (this.data.markerType.toLowerCase() == "gate") {
          if (this.data.eventData != null && this.data.eventData != "") {
            let url = "https://servicemedia.net/webxr/" + this.data.eventData;
            window.location.href = url;
          }
        }
    },
    physicsTriggerHit: function (id) {  
      console.log("gotsa physics trigger hit on " + id); //maybe check the layer of colliding entity or something...
      var triggerAudioController = document.getElementById("triggerAudio");
      if (triggerAudioController != null) {
        triggerAudioController.components.trigger_audio_control.playAudioAtPosition(this.el.object3D.position, window.playerPosition.distanceTo(this.el.object3D.position), this.data.tags);
      }
       
    },
    tick: function() {
      // if (this.isSelected && this.mousePos != null && this.mouseDownPos != null) { //Done, use threejs transform controls instead...
  
      //   this.distance = this.mousePos.distanceTo(this.mouseDownPos);
      
      //     // console.log(this.distance);
      //   if (this.selectedAxis == "x_plus_handle") {
      //     this.el.object3D.translateX(this.distance / 4);
      //   }
      //   if (this.selectedAxis == "x_minus_handle") {
      //     this.el.object3D.translateX(-this.distance / 4);
      //   }
      //   if (this.selectedAxis == "y_plus_handle") {
      //     this.el.object3D.translateY(this.distance / 4);
      //   }
      //   if (this.selectedAxis == "y_minus_handle") {
      //     this.el.object3D.translateY(-this.distance / 4);
      //   }
      //   if (this.selectedAxis == "z_plus_handle") {
      //     this.el.object3D.translateZ(this.distance / 4);
      //   }
      //   if (this.selectedAxis == "z_minus_handle") {
      //     this.el.object3D.translateZ(-this.distance / 4);
      //   }
      // } 
    },
    rayhit: function (hitID, distance, hitpoint) {
      // if (this.hitID != hitID) {
      //   this.hitID = hitID;
        // console.log("new hit " + hitID + " " + distance + " " + JSON.stringify(hitpoint));
        // distance = window.playerPosition.distanceTo(hitpoint);
        console.log("new hit " + hitID + " " + distance + " " + JSON.stringify(hitpoint));
        if (this.data.eventData.toLowerCase().includes("audiotrigger")) {
          var triggerAudioController = document.getElementById("triggerAudio");
          if (triggerAudioController != null) {
            triggerAudioController.components.trigger_audio_control.playAudioAtPosition(hitpoint, distance, this.data.triggerTag);
          }
        }
      }
  
  });