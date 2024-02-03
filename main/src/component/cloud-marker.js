
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
      objectID: {default: ''},
      model: {default: ''},
      scale: {default: 1},
      description: {default: ''},
      allowMods: {default: false}
    },
    init: function () {
    //   console.log("tryna set a cloudmarker with scale " + this.data.scale);
     var sceneEl = document.querySelector('a-scene'); 
      //let calloutString = this.data.calloutString;
      this.cursor = document.querySelector('[cursor]');
      this.calloutEntity = document.createElement("a-entity");
      // this.calloutPanel = document.createElement("a-entity");
      this.calloutText = document.createElement("a-entity");
      this.viewportHolder = document.getElementById("viewportPlaceholder3");
      let thisEl = this.el;
      this.isSelected = false;
    //   this.data.scale = (this.data.scale != undefined && this.data.scale != 'undefined' && this.data.scale != null) ? this.data.scale : 1;
      this.objectElementID = null;
      this.font1 = "Acme.woff";
      this.font2 = "Acme.woff";

    this.scale = this.data.scale + " " + this.data.scale + " " + this.data.scale;
    // this.scale = "1 1 1";
      if (settings && settings.sceneFontWeb1) {
        this.font1 = settings.sceneFontWeb1;
      }
      if (settings && settings.sceneFontWeb1) {
        this.font2 = settings.sceneFontWeb2;
      }
      this.timestamp = this.data.timestamp;
        
        this.phID = this.data.phID; //nm
        // console.log("cloudmarker phID " + this.phID); 
  
  
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
  
        //   console.log("CLOUDMARKER " + this.data.modelID + " " + this.data.name);
          
            if ((!this.data.modelID || this.data.modelID == undefined || this.data.modelID == "" || this.data.modelID == "none") && !this.data.modelID.toString().includes("primitive")) {
            // console.log("CLOUDMARKER PLACEHOLDER GEO " + this.data.modelID);
            if (this.data.markerType.toLowerCase() == "placeholder") {
                  this.el.setAttribute('gltf-model', '#poi1');
                } else if (this.data.markerType.toLowerCase() == "poi") {
                  this.el.setAttribute('gltf-model', '#poi1');
                } else if (this.data.markerType.toLowerCase() == "waypoint") {
                  this.el.setAttribute('gltf-model', '#poi1');
                  this.el.classList.add("waypoint");
                } else if (this.data.markerType.toLowerCase().includes("trigger")) {
                  this.el.setAttribute('gltf-model', '#poi1');  
                  this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: this.data.scale});
                } else if (this.data.markerType.toLowerCase() == "gate") {
                  // this.el.setAttribute("obb-collider", {size: '1 1 1'});
                  this.el.setAttribute('gltf-model', '#gate2');
                  this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: this.data.scale});
                  
                } else if (this.data.markerType.toLowerCase() == "link") {
                  this.el.setAttribute("gltf-model", "#links");
                  this.el.setAttribute("material", {color: "aqua", transparent: true, opacity: .5});
                } else if (this.data.markerType.toLowerCase() == "portal") {
                this.el.setAttribute('gltf-model', '#poi1');
                } else if (this.data.markerType.toLowerCase() == "mailbox") {
                // console.log("TRYNA SET MODEL TO MAILBOX!")
                this.el.setAttribute('gltf-model', '#mailbox');
                } else if (this.data.markerType == "3D text") {
                  console.log("tryna set 3D text!");
                  this.el.setAttribute("text_geometry", {value: this.data.description, font: '#optimerBoldFont'});
                } else if (this.data.markerType == "light") {
                  console.log("tryna set a light!");
                  // let color = "yellow";
                  let color1 = "yellow";
                  let color2 = "white";
                  let intensity = 1.25;
                  let duration = 1500;
                  if (settings && settings.sceneColor3) {
                    color1 = settings.sceneColor3;
                  }
                  if (settings && settings.sceneColor4) {
                    color2 = settings.sceneColor4;
                  }
                  if (this.data.tags && (this.data.tags.includes("this") || this.data.tags.includes("event"))) {
                    color1 = this.data.eventData;
                  }
                  if (this.data.tags && (this.data.tags.includes("dim"))) {
                    intensity = .5;
                  }
                  if (this.data.tags && (this.data.tags.includes("bright"))) {
                    intensity = 2;
                  }
                  if (this.data.tags && (this.data.tags.includes("very bright"))) {
                    intensity = 4;
                  }
                  if (this.data.tags && (this.data.tags.includes("slow"))) {
                    duration = 5000;
                  }
                  if (this.data.tags && (this.data.tags.includes("fast"))) {
                    duration = 500;
                  }
                  if (!this.data.tags.includes("hide gizmo") && (settings && !settings.hideGizmos)) { //ain't not hiding!
                    this.el.setAttribute("geometry", {primitive: "sphere", radius: this.data.scale * .1});
                    // this.el.setAttribute("light", {type: "point", intensity: .5, distance: 3, castShadow: true, decay: 1, color: "yellow"});
                    // this.el.setAttribute("mod_flicker", {type: "candle"});
                    this.el.setAttribute("material", {color: color1, wireframe: true});
                  } 
                  if (this.data.tags.includes("candle")) {
                    this.el.setAttribute("mod_particles", {type: "candle", color: color1, scale: this.data.scale, addLight: true});
                  } else if (this.data.tags.includes("fire")) {
                    this.el.setAttribute("mod_particles", {type: "fire", color: color1, scale: this.data.scale, addLight: true});
                  } else {
                    
                    this.el.setAttribute("light", {type: "point", intensity: intensity, distance: this.data.scale * 4, castShadow: true, decay: this.data.scale / 2, color: color2});
                    if (this.data.tags && this.data.tags.includes("anim") && this.data.tags.includes("color")) {
                      this.el.setAttribute("animation__color", {property: 'light.color', from: color1, to: color2, dur: duration, easing: 'easeInOutSine', loop: true, dir: 'alternate', autoplay: true});
                    } 
                    if (this.data.tags && this.data.tags.includes("anim") && this.data.tags.includes("intensity")) {
    
                      this.el.setAttribute("animation__intensity", {property: 'light.intensity', from: intensity - intensity/2, to: intensity + intensity/2, dur: duration, easing: 'easeInOutSine', loop: true, dir: 'alternate', autoplay: true});
                    } 
                          
                  }
                  if (this.data.tags.includes("flicker")) {
                    this.el.setAttribute("mod_flicker", {type: "candle"});
                  }
                }

                if (this.data.tags.includes("hide gizmo") || (settings && settings.hideGizmos)) {
                  if (this.data.markerType != "mailbox" && this.data.markerType != "light") {
                    this.el.object3D.visible = false;
                  }
                }
          } else {
            if (this.data.modelID != "none") {
              if (this.data.modelID.toString().includes("primitive")) {   
                // console.log("CLOUDMARKER PRIMITIVE " + this.data.modelID);
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
                } else if (this.data.markerType.toLowerCase() == "waypoint") {
                    this.el.setAttribute("material", {color: "green", transparent: true, opacity: .5});
                    this.el.classList.add("waypoint");
                    // this.el.setAttribute("color", "purple");
                } else if (this.data.markerType.toLowerCase().includes("link")) {
                  this.el.setAttribute("material", {color: "Gold", transparent: true, opacity: .5});
                } else if (this.data.markerType.toLowerCase().includes("trigger")) {
                    this.el.setAttribute("material", {color: "lime", transparent: true, opacity: .5});
                } else if (this.data.markerType.toLowerCase() == "gate") {
                    this.el.setAttribute("material", {color: "orange", transparent: true, opacity: .5});
                    this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder"});
                    // this.el.setAttribute("obb-collider", {size: '1 1 1'});
                } else if (this.data.markerType.toLowerCase() == "portal") {
                
                } else if (this.data.markerType.toLowerCase() == "mailbox") {
                
                } else if (this.data.markerType.toLowerCase() == "light") {
                    this.el.setAttribute("material", {color: "yellow", wireframe: true});
                } else {

                }
              } else {
                  this.loadModel(this.data.modelID);
                  if (this.data.markerType.toLowerCase() == "gate" || this.data.markerType.toLowerCase().includes("trigger")) {
                    
                    // this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder"});
                    
                  }
                  
              }
            }
            if (this.data.tags.includes("hide gizmo") || (settings && settings.hideGizmos)) {
              if (this.data.markerType != "mailbox" && this.data.markerType != "light") {
                this.el.object3D.visible = false;
              }
            }
        }
        if (this.data.objectID != undefined && this.data.objectID != null && this.data.objectID != "none" && this.data.objectID != "") { //hrm, cloudmarker objex?

        }
          this.el.setAttribute('scale', this.scale);
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
      // this.el.addEventListener('obbcollisionstarted	', (evt) => {
      //     this.obbHit(evt);
      // });
      // this.el.addEventListener('obbcollisionended	', (evt) => {
      //     this.obbHit(evt);
      // });
  
      this.el.addEventListener('model-loaded', (evt) => { //load placeholder model first (which is an a-asset) before calling external
        evt.preventDefault();
        console.log(this.data.modelID + " model-loaded for CLOUDMARKER " + this.el.id);
        if (this.data.modelID && this.data.modelID != '' & this.data.modelID != 'none') {
          this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"mesh", scaleFactor: this.data.scale});
        } else {
          this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: this.data.scale});

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
        }
      });
       
      this.el.addEventListener('mouseenter', (evt) => {
        
        if (evt.detail.intersection) {
          this.clientX = evt.clientX;
          this.clientY = evt.clientY;
          // console.log("tryna mouseover placeholder");
          this.calloutToggle = !this.calloutToggle;
          let pos = evt.detail.intersection.point; //hitpoint on model
          this.hitPosition = pos;
          let name = evt.detail.intersection.object.name;
        //   this.distance = window.playerPosition.distanceTo(pos);
            this.distance = evt.detail.intersection.distance;
          this.rayhit(evt.detail.intersection.object.name, this.distance, evt.detail.intersection.point);
       
          this.selectedAxis = name;
  
          // let elPos = this.el.getAttribute('position');
          // console.log(pos);
          if (!name.includes("handle") && this.calloutEntity != null && this.data.markerType != "light") { // umm...
    
            if (this.distance < 66) {
            this.calloutEntity.setAttribute("position", pos);
            this.calloutEntity.setAttribute('visible', true);
            this.calloutEntity.setAttribute('scale', {x: this.distance * .25, y: this.distance * .25, z: this.distance * .25} );
            // if (this.data.markerType == "poi" && !this.data.modelID) {
            //   this.el.setAttribute('scale', {x: this.distance * .25, y: this.distance * .25, z: this.distance * .25} );
            // }
           
            let theLabel = this.data.name != undefined ? this.data.name : "";
            let calloutString = theLabel;
            console.log("tryna show the callout " + this.distance + " " + calloutString);
            // if (this.calloutToggle) {
            //   // calloutString = "x : " + elPos.x.toFixed(2) + "\n" +"y : " + elPos.y.toFixed(2) + "\n" +"z : " + elPos.z.toFixed(2);
            //   calloutString = this.data.description != '' ? this.data.description : theLabel;
            // }
            this.calloutText.setAttribute("troika-text", {value: calloutString});
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
            selectedLocationTimestamp = that.timestamp;
            // ShowLocationModal(that.timestamp);
            SceneManglerModal('Location');
        } else { 
          let transform_controls_component = that.el.components.transform_controls;
          if (transform_controls_component) {
              if (transform_controls_component.data.isAttached) {
                  // transform_controls_component.detachTransformControls();
                  return; //don't do stuff below if transform enabled
              }
          }
          if (that.data.markerType == "link" && !that.data.isNew) {
            if (that.data.eventData.includes("href~")) {

                let urlSplit = that.data.eventData.split("~");
                let url = urlSplit[1];
                this.dialogEl = document.getElementById('mod_dialog');
                if (this.dialogEl) {
                  this.dialogEl.components.mod_dialog.showPanel("Open " + url +" in new window?", that.data.eventData, "linkOpen", 10000 ); 
                }
              } 
          }
          if (that.data.markerType == "gate") {
            if (evt.detail.intersection.distance > 1 && evt.detail.intersection.distance < 20) {
            this.dialogEl = document.getElementById('mod_dialog');
            if (this.dialogEl) {
              let ascenesEl = document.getElementById("availableScenesControl");
              if (ascenesEl) {
                let asControl = ascenesEl.components.available_scenes_control;
                if (asControl) {
                  if (asControl) {
                    let scene = asControl.returnRandomScene();
                    let url = "/webxr/" + scene.sceneKey;
                    // window.location.href = url; 
                    this.dialogEl.components.mod_dialog.showPanel("Go to " + scene.sceneTitle +" ?", "href~"+ url, "gatePass", 5000 ); //param 2 is objID when needed
                    console.log("good " + evt.detail.intersection.distance);
                    // WaitAndHideDialogPanel(4000);
                  }
                }
              }
            }
            } else {
              console.log("bad " + evt.detail.intersection.distance);
            }
          
          } else if (that.data.markerType == "poi") {
            GoToLocation(that.data.timestamp);
          }
        }
      });
      this.el.addEventListener('mouseup', function (evt) {
        console.log("mouseup cloudmarker "+ that.data.markerType);
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
  
        // // that.isSelected = false;
        // that.hitPosition = null;
        // that.mouseDownPos.x = 0;
        // that.mouseDownPos.y = 0;
        // that.selectedAxis = null;

        // that.mousePos = null;
        // if (keydown == "T") {
        //     ToggleTransformControls(that.timestamp);
        // } else if (keydown == "Shift") {
        //     selectedLocationTimestamp = that.timestamp;
        //     // ShowLocationModal(that.timestamp);
        //     SceneManglerModal('Location');
        // } else { 
        //   if (that.data.markerType == "gate") {
        //     if (evt.detail.intersection.distance > 1 && evt.detail.intersection.distance < 20) {
        //     this.dialogEl = document.getElementById('mod_dialog');
        //     if (this.dialogEl) {
        //       let ascenesEl = document.getElementById("availableScenesControl");
        //       if (ascenesEl) {
        //         let asControl = ascenesEl.components.available_scenes_control;
        //         if (asControl) {
        //           if (asControl) {
        //             let scene = asControl.returnRandomScene();
        //             let url = "/webxr/" + scene.sceneKey;
        //             // window.location.href = url; 
        //             this.dialogEl.components.mod_dialog.showPanel("Go to " + scene.sceneTitle +" ?", "href~"+ url, "gatePass", 5000 ); //param 2 is objID when needed
        //             console.log("good " + evt.detail.intersection.distance);
        //             // WaitAndHideDialogPanel(4000);
        //           }
        //         }
        //       }
        //     }
        //     } else {
        //       console.log("bad " + evt.detail.intersection.distance);
        //     }
          
        //   } else if (that.data.markerType == "poi") {
        //     GoToLocation(that.data.timestamp);
        //   }
        // }

  
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
    remove: function () {
        console.log("removing something!");
    },
    updateAndLoad: function (name, description, tags, eventData, markerType, scale, modelID) {
        this.data.name = name;
        this.data.description = description;
        this.data.tags = tags;
        this.data.eventData = eventData;
        this.data.markerType = markerType;
        this.data.scale = scale;
        this.data.modelID = modelID;
        // setTimeout(() => {
            this.loadModel(modelID);
        // }, 2000);
    },
    updateMaterials: function () {
        console.log("tryna update material for markertype " + this.data.markerType);
        if (this.data.markerType.toLowerCase() == "placeholder") {
            this.el.setAttribute("material", {color: "yellow", transparent: true, opacity: .5});
        } else if (this.data.markerType.toLowerCase() == "poi") {
            this.el.setAttribute("material", {color: "purple", transparent: true, opacity: .5});
        } else if (this.data.markerType.toLowerCase() == "waypoint") {
            this.el.setAttribute("material", {color: "green", transparent: true, opacity: .5});
            // this.el.setAttribute("color", "purple");
        } else if (this.data.markerType.toLowerCase() == "link") {
          this.el.setAttribute("material", {color: "Gold", transparent: true, opacity: .5});
        } else if (this.data.markerType.toLowerCase().includes("trigger")) {
          this.el.setAttribute("material", {color: "lime", transparent: true, opacity: .5});
        } else if (this.data.markerType.toLowerCase() == "gate") {
          this.el.setAttribute("material", {color: "orange", transparent: true, opacity: .5});
        } else if (this.data.markerType.toLowerCase() == "light") {
          this.el.setAttribute("material", {color: "yellow", wireframe: true, transparent: true, opacity: .5});
        } else if (this.data.markerType.toLowerCase() == "portal") {
            
        } else if (this.data.markerType.toLowerCase() == "mailbox") {
        
        } else {

        }
    },
    loadModel: function (modelID) {
        let transform_controls_component = this.el.components.transform_controls;
        if (transform_controls_component) {
            if (transform_controls_component.data.isAttached) {
                transform_controls_component.detachTransformControls();
            }
        }
        this.el.classList.remove("waypoint");
        this.el.removeAttribute("transform_controls");
        this.el.removeAttribute("geometry");
        this.el.removeAttribute("gltf-model");
        this.el.removeAttribute("mod_particles");
        this.el.removeAttribute("light");
        if (modelID != undefined && modelID != null & modelID != "none" && modelID != "") {  
          if (modelID.toString().includes("primitive")) {
              console.log("CLOUDMARKER PRIMITIVE " + modelID + " scale " + 1);
              this.el.removeAttribute("geometry");
              if (modelID.toString().includes("cube")) {
                  this.el.setAttribute("geometry", {primitive: "box", width: 1, height: 1, depth: 1});
              } else if (modelID.toString().includes("sphere")) {
                  this.el.setAttribute("geometry", {primitive: "sphere", radius: 1});
              } else if (modelID.toString().includes("cylinder")) {
                  this.el.setAttribute("geometry", {primitive: "cylinder", height: 1, radius: 1 / 2});
              } else {
  
              }
              if (this.data.markerType.toLowerCase() == "placeholder") {
                  this.el.setAttribute("material", {color: "yellow", transparent: true, opacity: .5});
              } else if (this.data.markerType.toLowerCase() == "poi") {
                  this.el.setAttribute("material", {color: "purple", transparent: true, opacity: .5});
                  // this.el.setAttribute("color", "purple");
              } else if (this.data.markerType.toLowerCase() == "waypoint") {
                  this.el.setAttribute("material", {color: "green", transparent: true, opacity: .5});
                  this.el.classList.add("waypoint");
                  // this.el.setAttribute("color", "purple");
              } else if (this.data.markerType.toLowerCase().includes("trigger")) {
                  this.el.setAttribute("material", {color: "lime", transparent: true, opacity: .5});
                //   this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder"});
                  // this.el.setAttribute("color", "lime");
                  
              } else if (this.data.markerType.toLowerCase() == "gate") {
                  this.el.setAttribute("material", {color: "orange", transparent: true, opacity: .5});
                  this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder"});
                  // this.el.setAttribute("color", "orange");
              } else if (this.data.markerType.toLowerCase() == "portal") {
              
              } else if (this.data.markerType.toLowerCase() == "mailbox") {
              
              } else {
  
              }
              if (this.data.tags.includes("hide gizmo") || (settings && settings.hideGizmos)) {
                if (this.data.markerType != "mailbox" && this.data.markerType != "light") {
                  this.el.object3D.visible = false;
                }
              }
          } else {
              for (let i = 0; i < sceneModels.length; i++) {
              if (sceneModels[i]._id == modelID) {
                  this.el.setAttribute('gltf-model', sceneModels[i].url);
                  if (this.data.markerType.toLowerCase() == "gate") {
                    // this.el.setAttribute("material", {color: "orange", transparent: true, opacity: .5});
                    // this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder"});
                    
                  }
                  break;
              }
              }
          }
        } else { //if "none"
            // console.log("CLOUDMARKER tryna set default model " + modelID);
            if (this.data.markerType.toLowerCase() == "placeholder") {
                this.el.setAttribute("gltf-model", "#poi1");
                this.el.setAttribute("material", {color: "yellow", transparent: true, opacity: .5});
                
            } else if (this.data.markerType.toLowerCase() == "poi") {
                this.el.setAttribute("gltf-model", "#poi1");
                this.el.setAttribute("material", {color: "purple", transparent: true, opacity: .5});
                // this.el.setAttribute("color", "purple");
            } else if (this.data.markerType.toLowerCase() == "waypoint") {
                this.el.setAttribute("gltf-model", "#poi1");
                this.el.setAttribute("material", {color: "green", transparent: true, opacity: .5});
                // this.el.setAttribute("color", "purple");
            } else if (this.data.markerType.toLowerCase().includes("trigger")) {
                this.el.setAttribute("gltf-model", "#poi1");
                this.el.setAttribute("material", {color: "lime", transparent: true, opacity: .5});
                this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: this.data.scale});
                // this.el.setAttribute("color", "lime");
                
            } else if (this.data.markerType.toLowerCase() == "gate") {
              
                this.el.setAttribute("gltf-model", "#gate2");
                this.el.setAttribute("material", {color: "orange", transparent: true, opacity: .5});
                this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: this.data.scale});
                // this.el.setAttribute("color", "orange");
            } else if (this.data.markerType.toLowerCase() == "link") {
              this.el.setAttribute("gltf-model", "#links");
              this.el.setAttribute("material", {color: "aqua", transparent: true, opacity: .5});
            } else if (this.data.markerType.toLowerCase() == "portal") {
                this.el.setAttribute("gltf-model", "#poi1");
                this.el.setAttribute("material", {color: "aqua", transparent: true, opacity: .5});
            } else if (this.data.markerType.toLowerCase() == "mailbox") {
                this.el.setAttribute("gltf-model", "#mailbox");
            } else if (this.data.markerType == "3D text") {
                console.log("tryna set 3D text!");
                this.el.setAttribute("text-geometry", {value: this.data.description, font: '#optimerBoldFont'});
            } else if (this.data.markerType == "light") {
              console.log("tryna set a light!");
              // let color = "yellow";
              let color1 = "yellow";
              let color2 = "white";
              let intensity = 1.25;
              let duration = 1500;
              if (settings && settings.sceneColor3) {
                color1 = settings.sceneColor3;
              }
              if (settings && settings.sceneColor4) {
                color2 = settings.sceneColor4;
              }
              if (this.data.tags && (this.data.tags.includes("this") || this.data.tags.includes("event"))) {
                color1 = this.data.eventData;
              }
              if (this.data.tags && (this.data.tags.includes("dim"))) {
                intensity = .5;
              }
              if (this.data.tags && (this.data.tags.includes("bright"))) {
                intensity = 2;
              }
              if (this.data.tags && (this.data.tags.includes("very bright"))) {
                intensity = 4;
              }
              if (this.data.tags && (this.data.tags.includes("slow"))) {
                duration = 5000;
              }
              if (this.data.tags && (this.data.tags.includes("fast"))) {
                duration = 500;
              }
              if (!this.data.tags.includes("hide gizmo") && (settings && !settings.hideGizmos)) {
                this.el.setAttribute("geometry", {primitive: "sphere", radius: this.data.scale * .1});
                // this.el.setAttribute("light", {type: "point", intensity: .5, distance: 3, castShadow: true, decay: 1, color: "yellow"});
                // this.el.setAttribute("mod_flicker", {type: "candle"});
                this.el.setAttribute("material", {color: color1, wireframe: true});
              } 
              if (this.data.tags.includes("candle")) {
                this.el.setAttribute("mod_particles", {type: "candle", color: color1, scale: this.data.scale, addLight: true});
              } else if (this.data.tags.includes("fire")) {
                this.el.setAttribute("mod_particles", {type: "fire", color: color1, scale: this.data.scale, addLight: true});
              } else {
                
                this.el.setAttribute("light", {type: "point", intensity: intensity, distance: this.data.scale * 4, castShadow: true, decay: this.data.scale / 2, color: color2});
                if (this.data.tags && this.data.tags.includes("anim") && this.data.tags.includes("color")) {
                  this.el.setAttribute("animation__color", {property: 'light.color', from: color1, to: color2, dur: duration, easing: 'easeInOutSine', loop: true, dir: 'alternate', autoplay: true});
                } 
                if (this.data.tags && this.data.tags.includes("anim") && this.data.tags.includes("intensity")) {

                  this.el.setAttribute("animation__intensity", {property: 'light.intensity', from: intensity - intensity/2, to: intensity + intensity/2, dur: duration, easing: 'easeInOutSine', loop: true, dir: 'alternate', autoplay: true});
                } 
                      
              }
              if (this.data.tags.includes("flicker")) {
                this.el.setAttribute("mod_flicker", {type: "candle"});
              }    
          }
          if (this.data.tags.includes("hide gizmo") || (settings && settings.hideGizmos)) {
            if (this.data.markerType != "mailbox" && this.data.markerType != "light") {
              this.el.object3D.visible = false;
            }
          }
        }
        this.updateMaterials();

    },
    deselect: function () {
      this.isSelected = false;
      console.log("cloudmarker this.isSelected " + this.isSelected);
    },
    obbHit: function (evt) {
      console.log("obbHit!! " + evt.detail.withEl );
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
        } else {
          let ascenesEl = document.getElementById("availableScenesControl");
          if (ascenesEl) {
            let asControl = ascenesEl.components.available_scenes_control;
            if (asControl) {
              let scene = asControl.returnRandomScene();
              let url = "/webxr/" + scene.sceneKey;
              window.location.href = url; 
              
            }
          }
        }
      }
    },
    physicsTriggerHit: function () {  
    //   console.log("gotsa physics trigger hit!"); //maybe check the layer of colliding entity or something...
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
  
  