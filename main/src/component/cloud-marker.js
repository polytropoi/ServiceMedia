
AFRAME.registerComponent('cloud_marker', { //special items saved upstairs
    schema: {
      phID: {default: ''}, // now just uses location timestamp
      eventData: {default: ''},
      selectedAxis: {default: 'all'},
      timestamp: {default: ''},
      name: {default: ''},
      label: {default: ''},
      isNew: {default: true},
      markerType: {default: 'placeholder'},
      tags: {default: ''},
      modelID: {default: ''},
      model: {default: ''},
      scale: {default: 1},
      description: {default: ''},
      allowMods: {default: false}
    },
    init: function () {
      console.log("tryna set a cloudmarker with scale " + this.data.scale);
     var sceneEl = document.querySelector('a-scene'); 
      //let calloutString = this.data.calloutString;
      this.cursor = document.querySelector('[cursor]');
      this.calloutEntity = document.createElement("a-entity");
      // this.calloutPanel = document.createElement("a-entity");
      this.calloutText = document.createElement("a-entity");
      this.viewportHolder = document.getElementById("viewportPlaceholder3");
      let thisEl = this.el;
      this.isSelected = false;
      this.data.scale = (this.data.scale != undefined && this.data.scale != 'undefined' && this.data.scale != null) ? this.data.scale : 1;
      this.objectElementID = null;
      this.font1 = "Acme.woff";
      this.font2 = "Acme.woff";
      if (settings && settings.sceneFontWeb1) {
        this.font1 = settings.sceneFontWeb1;
      }
      if (settings && settings.sceneFontWeb1) {
        this.font2 = settings.sceneFontWeb2;
      }
      this.timestamp = this.data.timestamp;
        
        this.phID = this.data.phID;
        console.log("cloudmarker phID " + this.phID); 
  
  
        if (this.data.allowMods) {
          this.el.classList.add("allowMods");
        }
      
            let locItem = {};
            let position = this.el.getAttribute('position'); //
            let rotation = this.el.getAttribute('rotation');
            locItem.x = position.x.toFixed(2);
            locItem.eulerx = rotation.x.toFixed(2);
            locItem.y = position.y.toFixed(2);
            locItem.eulery = rotation.y.toFixed(2);
            locItem.z = position.z.toFixed(2);
            locItem.eulerz = rotation.z.toFixed(2);
            locItem.scale = this.data.scale;
            locItem.type = "Worldspace";
            locItem.name = this.data.name;
            locItem.label = this.data.label;
            locItem.eventData = this.data.eventData;
            locItem.description = this.data.description;
            locItem.timestamp = this.data.timestamp;
            locItem.markerType = this.data.markerType;
            locItem.modelID = this.data.modelID;
            locItem.model = this.data.model;
            locItem.objectID = this.data.objectID;
            locItem.objName = this.data.objName;
            locItem.phID = this.phID;
  
            // storedVars = locItem;
          // }
          
          // console.log("this.data " + JSON.stringify(this.data));
          if (this.data.modelID == null || this.data.modelID == undefined || this.data.model == "" || this.data.model == "none" || this.data.model == "undefined") {
            if (this.data.markerType.toLowerCase() == "placeholder") {
                this.el.setAttribute('gltf-model', '#poi1');
              } else if (this.data.markerType.toLowerCase() == "poi") {
                this.el.setAttribute('gltf-model', '#poi1');
              } else if (this.data.markerType.toLowerCase().includes("trigger")) {
                this.el.setAttribute('gltf-model', '#poi1');  
              } else if (this.data.markerType.toLowerCase() == "gate") {
                this.el.setAttribute('gltf-model', '#gate2');
              } else if (this.data.markerType.toLowerCase() == "portal") {
                this.el.setAttribute('gltf-model', '#poi1');
              } else if (this.data.markerType.toLowerCase() == "mailbox") {
                // console.log("TRYNA SET MODEL TO MAILBOX!")
                this.el.setAttribute('gltf-model', '#mailbox');
              }

              //  else if (this.data.markerType.toLowerCase() == "player") {
              //   // console.log("playerobj")
              //   this.el.setAttribute('gltf-model', '#poi1');
              //   this.el.classList.remove("activeObjectRay");
              // } else {
              //   // this.el.setAttribute('gltf-model', '#poi1');
              // }
            
            // this.el.setAttribute('scale', {x: this.data.scale, y: this.data.scale, z: this.data.scale });
          } else {
            
            if (this.data.modelID != "none") {
              for (let i = 0; i < sceneModels.length; i++) {
                if (sceneModels[i]._id == this.data.modelID) {
                  this.el.setAttribute("gltf-model", sceneModels[i].url);
                  // this.el.setAttribute('position', {x: this.data.x, y: this.data.y, z: this.data.z});
                  // this.el.setAttribute('rotation', {x: this.data.eulerx, y: this.data.eulery, z: this.data.eulerz});
                  this.el.setAttribute('scale', {x: this.data.scale, y: this.data.scale, z: this.data.scale });
                  console.log("tryna set new locModel for cloudmarker " + this.data.model + " " + sceneModels[i].url);
  
                }
              }
            }
          }
          if (this.data.objectID != undefined && this.data.objectID != null && this.data.objectID != "none" && this.data.objectID != "") { //hrm, cloudmarker objex?
  
          }
        
          // localStorage.setItem(this.phID, JSON.stringify(locItem)); 
        
        if (this.data.markerType.toLowerCase() == "player") {
          // console.log("playerobj")
          // this.el.setAttribute('gltf-model', '#poi1');
          this.el.classList.remove("activeObjectRay");
        }
        // if (this.data.markerType.toLowerCase() == "placeholder") {
        //   this.el.setAttribute('gltf-model', '#savedplaceholder');
        // } else if (this.data.markerType.toLowerCase() == "poi") {
        //   this.el.setAttribute('gltf-model', '#poi1');
        // } else if (this.data.markerType.toLowerCase().includes("trigger")) {
        //   this.el.setAttribute('gltf-model', '#poi1');  
        // } else if (this.data.markerType.toLowerCase() == "gate") {
        //   this.el.setAttribute('gltf-model', '#poi1');
        // } else if (this.data.markerType.toLowerCase() == "portal") {
        //   this.el.setAttribute('gltf-model', '#poi1');
        // } else if (this.data.markerType.toLowerCase() == "mailbox") {
        //   this.el.setAttribute('gltf-model', '#mailbox');
        // }
        if (this.data.name == '') {
          this.data.name = this.data.timestamp;
        }
        if (this.data.eventData.toLowerCase().includes('beat')) {
          this.el.classList.add('beatme');
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
  
      let that = this;
  
  
      this.el.addEventListener('model-loaded', (evt) => { //load placeholder model first (which is an a-asset) before calling external
        evt.preventDefault();
        console.log("MODEL LOADED FOR CLOUDMARKER!!!" + this.el.id);
        this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder"});

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
            //   this.el.setObject3D('mesh', obj);
            //   if (this.data.markerType == "gate") {
            //     this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder"});
            //   }
        // this.el.setAttribute("ammo-body", {type: "kinematic"});
        // this.el.setAttribute('ammo-body', {type: 'kinematic', emitCollisionEvents: true});
      });
  
      // this.el.addEventListener('body-loaded', (evt) => { //load placeholder model first (which is an a-asset) before calling external
      //   evt.preventDefault();
      //   console.log("boduy LOADED FOR CLOUDMARKER!!!");
      //   // this.el.setAttribute("mod_physics", {body: "kinematic", shape: "sphere", isTrigger: true, model:"placeholder"});
      //   // this.el.setAttribute("ammo-body", {type: "kinematic"});
      //   this.el.setAttribute("ammo-shape", {type: "sphere", fit: "all"});
  
      // });
     
      this.el.addEventListener('mouseenter', (evt) => {
        
        if (posRotReader != null) {
          this.playerPosRot = posRotReader.returnPosRot(); 
          window.playerPosition = this.playerPosRot.pos; 
        } else {
            posRotReader = document.getElementById("player").components.get_pos_rot; 
            this.playerPosRot = posRotReader.returnPosRot(); 
            window.playerPosition = this.playerPosRot.pos; 
        }
    
        if (evt.detail.intersection) {
          this.clientX = evt.clientX;
          this.clientY = evt.clientY;
          // console.log("tryna mouseover placeholder");
          that.calloutToggle = !that.calloutToggle;
          let pos = evt.detail.intersection.point; //hitpoint on model
          that.hitPosition = pos;
          let name = evt.detail.intersection.object.name;
          that.distance = window.playerPosition.distanceTo(pos);
          that.rayhit(evt.detail.intersection.object.name, that.distance, evt.detail.intersection.point);
       
          that.selectedAxis = name;
  
          // let elPos = that.el.getAttribute('position');
          // console.log(pos);
          if (!name.includes("handle") && that.calloutEntity != null) {
            console.log("tryna show the callout " + that.distance);
            if (that.distance < 66) {
            that.calloutEntity.setAttribute("position", pos);
            that.calloutEntity.setAttribute('visible', true);
            that.calloutEntity.setAttribute('scale', {x: that.distance * .25, y: that.distance * .25, z: that.distance * .25} );
            // if (this.data.markerType == "poi" && !this.data.modelID) {
            //   this.el.setAttribute('scale', {x: that.distance * .25, y: that.distance * .25, z: that.distance * .25} );
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
        // that.selectedAxis = null;
        // if (that.selectedAxis != null) {
        //   console.log(that.selectedAxis);
        // }
        that.calloutEntity.setAttribute('visible', false);
      });
  
      this.el.addEventListener('mousedown', function (evt) {
  
        if (keydown == "T") {
            ToggleTransformControls(that.timestamp);
          } else if (keydown == "Shift") {
            ShowLocationModal(that.timestamp);
          }    
      });
      this.el.addEventListener('mouseup', function (evt) {
        console.log("mouseup cloudmarker ");
        // that.isSelected = false;
        // if (that.data.markerType.toLowerCase() == "placeholder") {
        //   that.hitPosition = null;
        //   if (this.mouseDownPos != undefined) {
        //     this.mouseDownPos.x = 0;
        //     this.mouseDownPos.y = 0;
        //     this.selectedAxis = null;
        //   }
        //   // let keyName = "placeholder_" + this.data.timestamp;
        //   let position = that.el.getAttribute("position");
        //   console.log("tryna set position " + position + " for key " + that.phID);
        //   let storedVars = JSON.parse(localStorage.getItem(that.phID));
        //   if (storedVars != null) { //already modded this cloud placeholder
        //     storedVars.x = position.x.toFixed(2);
        //     storedVars.y = position.y.toFixed(2);
        //     storedVars.z = position.z.toFixed(2);
        //     that.data.name = storedVars.name;
        //     console.log("modded storedvars " + JSON.stringify(storedVars));
        //   } 
  
        //   localStorage.setItem(that.phID, JSON.stringify(storedVars));
        //   if (that.isSelected && that.selectedAxis != null && !that.selectedAxis.includes("handle")) { //don't pop the dialog if just dragging
        //     ShowLocationModal(that.phID); 
        //   }
        //   AddLocalMarkers();
        // } else 
        
        if (that.data.markerType.toLowerCase() == "mailbox") {
          console.log('tryna sho0w messages modal');
          SceneManglerModal('Messages');
        }
        // that.deselect();
  
      });
                                                                       
      this.el.addEventListener('click', function (evt) {
        // console.log("tryna mousedouwn");
  
        // that.isSelected = false;
        that.hitPosition = null;
        that.mouseDownPos.x = 0;
        that.mouseDownPos.y = 0;
        that.selectedAxis = null;
        // that.mousePos = null;
  
      });
      sceneEl.addEventListener("mousemove", (event) =>{
            that.mousePos.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            that.mousePos.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
          // console.log(that.mouse);
      })
  
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
                // let position = that.el.getAttribute("position");
                this.locData = {};
                this.locData.x = this.el.object3D.position.x;
                this.locData.y = this.el.object3D.position.y;
                this.locData.z = this.el.object3D.position.z;
                this.locData.timestamp = Date.now();
                
                let objEl = document.createElement("a-entity");
                
                objEl.setAttribute("mod_object", {'locationData': this.locData, 'objectData': this.objectData});
                objEl.id = "obj" + objectData._id + "_" + this.locData.timestamp;
                sceneEl.appendChild(objEl);
              }
            }
          }
        }
      } 
    },
    loadModel: function (modelID) {
      console.log("tryna load modeID " + modelID);
      // console.log("tryna load modeID " + modelID);
      if (modelID != undefined && modelID != null & modelID != "none" && modelID != "") {  
        for (let i = 0; i < sceneModels.length; i++) {
          if (sceneModels[i]._id == modelID) {
            this.el.setAttribute("gltf-model", sceneModels[i].url);
            // this.el.
          }
        }
      } else {
        this.el.setAttribute("gltf-model", "https://servicemedia.s3.amazonaws.com/assets/models/savedplaceholder.glb");
      }
    },
    deselect: function () {
      this.isSelected = false;
      console.log("cloudmarker this.isSelected " + this.isSelected);
    },
    playerTriggerHit: function () { //this uses AABB collider//nope, all physics now...
      console.log("gotsa player trigger hit on type " + this.data.markerType); 
      var triggerAudioController = document.getElementById("triggerAudio");
      if (triggerAudioController != null) {
        if (window.playerPosition && this.el.object3D) {
          triggerAudioController.components.trigger_audio_control.playAudioAtPosition(this.el.object3D.position, window.playerPosition.distanceTo(this.el.object3D.position), this.data.tags);
        }
        
      }  
      if (this.data.markerType.toLowerCase() == "spawntrigger") {
  
            let objexEl = document.getElementById('sceneObjects');    
            objexEl.components.mod_objex.spawnObject(this.data.eventData); //eventdata should have the name of a location with spawn markertype
      }
      if (this.data.markerType.toLowerCase() == "gate") {
        if (this.data.eventData != null && this.data.eventData != "") {
          let url = "/webxr/" + this.data.eventData;
          window.location.href = url;
        }
      }
    },
    physicsTriggerHit: function () {  
      console.log("gotsa physics trigger hit!"); //maybe check the layer of colliding entity or something...
      var triggerAudioController = document.getElementById("triggerAudio");
      if (triggerAudioController != null) {
        triggerAudioController.components.trigger_audio_control.playAudioAtPosition(this.el.object3D.position, window.playerPosition.distanceTo(this.el.object3D.position), this.data.tags);
      }
       
    },
    tick: function() {
      if (this.isSelected && this.mousePos != null && this.mouseDownPos != null) {
        // console.log("meese " + JSON.stringify(this.mouseDownPos) + " " + JSON.stringify(this.mousePos));
        // var startingTop = this.hitPosition.x,
        //   startingLeft = this.hitPosition.y,
        //   // math = Math.round(Math.sqrt(Math.pow(startingTop - this.clientY, 2) +Math.pow(startingLeft - this.clientX, 2))) + 'px';
        this.distance = this.mousePos.distanceTo(this.mouseDownPos);
          // console.log(this.distance); 
    //     if (this.selectedAxis == "x_plus_handle") { //ha just use threejs transformcontrols now
    //       this.el.object3D.translateX(this.distance / 4);
    //     }
    //     if (this.selectedAxis == "x_minus_handle") {
    //       this.el.object3D.translateX(-this.distance / 4);
    //     }
    //     if (this.selectedAxis == "y_plus_handle") {
    //       this.el.object3D.translateY(this.distance / 4);
    //     }
    //     if (this.selectedAxis == "y_minus_handle") {
    //       this.el.object3D.translateY(-this.distance / 4);
    //     }
    //     if (this.selectedAxis == "z_plus_handle") {
    //       this.el.object3D.translateZ(this.distance / 4);
    //     }
    //     if (this.selectedAxis == "z_minus_handle") {
    //       this.el.object3D.translateZ(-this.distance / 4);
    //     }
      } 
    },
    beat: function (volume) {
      // console.log("tryna beat " + this.el.id + " " + volume);
      if (this.data.eventData.toLowerCase().includes("beat")) {
        // let oScale = this.el.getAttribute('data-scale');
        // oScale = parseFloat(oScale);
        let oScale = this.data.scale;
        volume = volume.toFixed(2) * .2;
        let scale = {};
          scale.x = oScale + volume;
          scale.y = oScale + volume;
          scale.z = oScale + volume;
          this.el.setAttribute('scale', scale);
          this.el.setAttribute('animation', 'property: scale; to: '+oScale+' '+oScale+' '+oScale+'; dur: 500; startEvents: beatRecover; easing: easeInOutQuad');
          this.el.emit('beatRecover');
  
      }
    },
    rayhit: function (hitID, distance, hitpoint) {
      // if (this.hitID != hitID) {
      //   this.hitID = hitID;
        // console.log("new hit " + hitID + " " + distance + " " + JSON.stringify(hitpoint));
        distance = window.playerPosition.distanceTo(hitpoint);
        console.log("new hit " + hitID + " " + distance + " " + JSON.stringify(hitpoint));
        if (this.data.eventData.toLowerCase().includes("audiotrigger")) {
          console.log("gotsa audio trigger hit");
          var triggerAudioControllerEl = document.getElementById("triggerAudio");
          
          if (triggerAudioControllerEl != null) {
            console.log("gotsa audio trigger controller el");
            let triggerAudioController = triggerAudioControllerEl.components.trigger_audio_control;
            if (triggerAudioController  != null) {
              console.log("gotsa audio trigger controller " + distance);
              let triggertags = this.data.tags != null && this.data.tags != "" ? this.data.tags : "click";
              triggerAudioController.playAudioAtPosition(hitpoint, distance, triggertags);
            }
           
          }
        }
      }
  
  }); //////// end cloud_marker /////////////////////
  
  