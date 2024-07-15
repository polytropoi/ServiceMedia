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
      mediaID: {default: ''},
      mediaName: {default: ''},
      scale: {default: 1},
        // position: {default: ''},
      xpos: {type: 'number', default: 0}, //for modding...
      ypos: {type: 'number', default: 0},
      zpos: {type: 'number', default: 0},

      xrot: {type: 'number', default: 0},//in degrees, trans to radians below
      yrot: {type: 'number', default: 0},
      zrot: {type: 'number', default: 0},
        // rotation: {default: ''},
      xscale: {type: 'number', default: 1},
      yscale: {type: 'number', default: 1},
      zscale: {type: 'number', default: 1},
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

      this.isSelected = false;

      this.objectElementID = null;
      this.font1 = "Acme.woff";
      this.font2 = "Acme.woff";
      this.data.scale = this.data.xscale;
      this.picData = null;
     
      if (settings && settings.sceneFontWeb1) {
        this.font1 = settings.sceneFontWeb1;
      }
      if (settings && settings.sceneFontWeb1) {
        this.font2 = settings.sceneFontWeb2;
      }
      if (this.data.timestamp != '') {
        this.timestamp = this.data.timestamp;
      } else {
        this.timestamp = this.el.id
      }
      this.phID = this.data.phID; //nm
      // console.log("cloudmarker phID " + this.phID); 
      if (this.data.allowMods) {
        this.el.classList.add("allowMods");
      }
      if (this.data.markerType == "collider") {
        this.data.modelID = "primitive_cube";
      } 
      if (this.data.tags && this.data.tags.includes("follow curve")) {
        this.el.setAttribute("mod_curve", {"origin": "location", "isClosed": true, "spreadFactor": 2})
      }
  
          console.log("CLOUDMARKER " + this.data.markerType + " " + this.data.mediaID );

          
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
                } else if (this.data.markerType.toLowerCase().includes("object")) {
                  this.el.setAttribute('gltf-model', '#poi1');  
                  
                } else if (this.data.markerType.toLowerCase() == "gate") {
                  // this.el.setAttribute("obb-collider", {size: '1 1 1'});
                  this.el.setAttribute('gltf-model', '#gate2');
                  this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: this.data.scale});
                  
                } else if (this.data.markerType.toLowerCase() == "link") {
                  this.el.setAttribute("gltf-model", "#links");
                  this.el.setAttribute("material", {color: "aqua", transparent: true, opacity: .5});
                } else if (this.data.markerType.toLowerCase() == "text") {
                  this.el.setAttribute("gltf-model", "#texticon");
                  this.el.setAttribute("material", {color: "black", transparent: true, opacity: .5});
                
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
                  if (!this.data.tags.includes("hide")) {
                    this.radius = this.data.xscale * .05;
                    this.el.setAttribute("geometry", {"primitive": "sphere", "radius": this.radius});
                    this.el.setAttribute("material", {color: color1, wireframe: true});
                  } 
                  // let color = "yellow";
                  // this.el.classList.remove("activeObjexRay"); //too much clutter, no need on a cloud light
                  
                  let color1 = "yellow";
                  let color2 = "white";
                  let intensity = 1.25;
                  let duration = 1500;
                  if (this.data.tags.includes("color"))  {
                    if (this.data.eventData.includes("~")) {
                      color1 = this.data.eventData.split("~")[0];
                      color2 = this.data.eventData.split("~")[1];
                    } else {
                      color1 = this.data.eventData;
                    }
                  }
                  let lighttype = "point";
                  let markerLightShadow = true;
                  if (this.data.tags.includes("spot")) {
                    lighttype = "spot";
                    markerLightShadow = false;
                  } 
                  if (this.data.tags.includes("ambient")) {
                    lighttype = "ambient";
                    markerLightShadow = false;

                  }
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
                    intensity = 5;
                  }
                  if (this.data.tags && (this.data.tags.includes("slow"))) {
                    duration = 5000;
                  }
                  if (this.data.tags && (this.data.tags.includes("fast"))) {
                    duration = 500;
                  }

                  if (this.data.tags.includes("candle")) {
                    this.el.setAttribute("mod_particles", {type: "candle", color: color1, scale: this.data.xscale, addLight: true});
                  } else if (this.data.tags.includes("fire")) {
                    this.el.setAttribute("mod_particles", {type: "fire", color: color1, scale: this.data.xscale, addLight: true, intensity: intensity});
                  } else {
                    let markerLightShadow = true;
                    let lighttype = "point";
                    if (this.data.tags.includes("spot")) {
                      lighttype = "spot";
                      markerLightShadow = false;
                    } 
                    if (this.data.tags.includes("ambient")) {
                      lighttype = "ambient";
                      markerLightShadow = false;
                    }
                    if (this.data.tags.includes("ambient")) {
                      lighttype = "ambient";
                      markerLightShadow = false;
                    }
                    if (this.data.tags.includes("color"))  {
                      if (this.data.eventData.includes("~")) {
                        color1 = this.data.eventData.split("~")[0];
                        color2 = this.data.eventData.split("~")[1];
                      } else {
                        color1 = this.data.eventData;
                      }
                    }
                    this.el.setAttribute("light", {type: lighttype, intensity: intensity, distance: this.data.xscale * 4, castShadow: markerLightShadow, decay: this.data.xscale / 2, color: color1});
                    if (this.data.tags && this.data.tags.includes("anim")) {
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
                } else {
                  this.el.object3D.visible = true;
                }
          } else {
            if (this.data.modelID != "none") {
              if (this.data.modelID.toString().includes("primitive")) {   
                console.log("CLOUDMARKER PRIMITIVE " + this.data.modelID);
                if (this.data.modelID.toString().includes("cube")) {
                    this.el.setAttribute("geometry", {"primitive": "box", "width": 1, "height": 1, "depth": 1});
                } else if (this.data.modelID.toString().includes("sphere")) {
                    this.el.setAttribute("geometry", {"primitive": "sphere", "radius": 1});
                } else if (this.data.modelID.toString().includes("cylinder")) {
                    this.el.setAttribute("geometry", {"primitive": "cylinder", "height": 1, "radius": .5});
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
                  this.el.setAttribute("material", {color: "gold", transparent: true, opacity: .5});
                } else if (this.data.markerType.toLowerCase().includes("trigger")) {
                    this.el.setAttribute("material", {color: "lime", transparent: true, opacity: .5});
                } else if (this.data.markerType.includes("collider")) {
                  this.el.setAttribute("material", {color: "firebrick", transparent: true, opacity: .5});
                  this.el.setAttribute("mod_physics", {body: "static", isTrigger: false, model:"collider", scaleFactor: this.data.scale});
                } else if (this.data.markerType.toLowerCase() == "gate") {
                    this.el.setAttribute("material", {color: "orange", transparent: true, opacity: .5});
                    this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder"});
                    // this.el.setAttribute("obb-collider", {size: '1 1 1'});
                } else if (this.data.markerType.toLowerCase() == "portal") {
                
                } else if (this.data.markerType.toLowerCase() == "mailbox") {
                
                } else if (this.data.markerType.toLowerCase() == "light") {
                    // this.el.setAttribute("material", {color: "yellow", wireframe: true});
                } else {

                }
              } else {
                  this.loadModel(this.data.modelID);
                  // if (this.data.markerType.toLowerCase() == "gate" || this.data.markerType.toLowerCase().includes("trigger")) {
                    
                  //   // this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder"});
                    
                  // }
                  
              }
              // if (this.data.xscale) {
              //   this.scaleVector.x = this.data.xscale;
              //   this.scaleVector.y = this.data.yscale;
              //   this.scaleVector.z = this.data.zscale;
              // }
                // this.el.object3D.scale.set(this.scaleVector);
              // this.el.setAttribute("scale", this.scaleVector.x + " " + this.scaleVector.y + " " +this.scaleVector.z);
              // this.el.object3D.position.set(this.data.xpos, this.data.ypos, this.data.zpos);
              // // this.el.object3D.rotation.set(THREE.MathUtils.degToRad(this.data.xrot), THREE.MathUtils.degToRad(this.data.xrot), THREE.MathUtils.degToRad(this.data.xrot));
              // this.el.setAttribute("rotation", this.data.xrot + " " + this.data.yrot + " " +this.data.zrot);
              // console.log("TRYNA SCALE TO " + this.data.xscale + " " + this.data.yscale + " " + this.data.zscale);
              // if (this.data.xscale) {
              //   this.scaleVector.x = this.data.xscale;
              //   this.scaleVector.y = this.data.yscale;
              //   this.scaleVector.z = this.data.zscale;
              // }
              this.el.setAttribute("scale", this.data.xscale + " " + this.data.yscale + " " + this.data.zscale);
              this.el.object3D.position.set(this.data.xpos, this.data.ypos, this.data.zpos);
              // this.el.object3D.rotation.set(THREE.MathUtils.degToRad(this.data.xrot), THREE.MathUtils.degToRad(this.data.xrot), THREE.MathUtils.degToRad(this.data.xrot));
              this.el.setAttribute("rotation", this.data.xrot + " " + this.data.yrot + " " +this.data.zrot);
            }
            if (this.data.tags.includes("hide gizmo") || (settings && settings.hideGizmos)) {
              if (this.data.markerType != "mailbox" && this.data.markerType != "light") {
                this.el.object3D.visible = false;
              }
            }
            if (this.data.markerType == "navmesh"  || this.data.markerType == "surface") {
              if (!this.data.tags.includes("show")) {
                this.el.object3D.visible = false;
              } 
            }
        }
        if (this.data.objectID != undefined && this.data.objectID != null && this.data.objectID != "none" && this.data.objectID != "") { //hrm, cloudmarker objex? //NO!

        }
        // this.el.setAttribute('scale', this.scale);
          // localStorage.setItem(this.phID, JSON.stringify(locItem)); 
        
        if (this.data.markerType.toLowerCase() == "player") {
          // console.log("playerobj")
          // this.el.setAttribute('gltf-model', '#poi1');
          this.el.classList.remove("activeObjexRay");
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
        if (this.data.tags.toLowerCase().includes("beat") || this.data.eventData.toLowerCase().includes('beat')) {
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
       
            if (settings && settings.sceneCameraMode == "Third Person") {
              this.calloutEntity.setAttribute("look-at", "#thirdPersonCamera");
            } else {
              this.calloutEntity.setAttribute("look-at", "#player");
            }
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
      if (this.data.markerType.toLowerCase().includes("picture")) {
        this.loadMedia(); //if tags == etc...

      }
      if (this.data.markerType == "picture group") {
        this.el.classList.add("picgroup");
      }
  
      this.el.addEventListener('model-loaded', (evt) => { //load placeholder model first (which is an a-asset) before calling external
        evt.preventDefault();
        this.el.removeAttribute("animation-mixer");
        console.log(this.data.modelID + " model-loaded for CLOUDMARKER " + this.data.markerType);
        if (this.data.markerType != "object") {
          const obj = this.el.getObject3D('mesh');
          if (this.data.modelID && this.data.modelID != '' & this.data.modelID != 'none') {
            this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"mesh", scaleFactor: this.data.scale});
            let clips = obj.animations;
            if (clips != null && clips.length) { 
              this.el.setAttribute('animation-mixer', {
                "clip": clips[Math.floor(Math.random()*clips.length)].name,
                "loop": "repeat",
              });
            }
          } else {
            this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: this.data.scale});

            
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

        }
        if (this.data.markerType.toLowerCase().includes("picture")) {
          this.loadPicture();
         }

        // if (this.data.markerType == "picture") {
        //   console.log("mediaID " + this.data.mediaID);
        //   if (this.data.mediaID && this.data.mediaID.includes("local_")) {
        //     this.el.classList.add("hasLocalFile");
        //     let mediaID = this.data.mediaID.substring(6);
        //     console.log("CLOUDMARKER SHOUDL HAVE MediaID " + mediaID + " from localFiles " + localData.localFiles[mediaID]);
        //     for (const key in localData.localFiles) {
        //       console.log("tryna get localMedia named " + mediaID + " vs " + localData.localFiles[key].name);
        //       if (localData.localFiles[key].name == mediaID) {
                
        //         const picBuffer = localData.localFiles[key].data;
        //         const picBlob = new Blob([picBuffer]);
        //         picUrl = URL.createObjectURL(picBlob);
        //         const obj = this.el.getObject3D('mesh');
                
        //         var texture = new THREE.TextureLoader().load(picUrl);
        //         texture.encoding = THREE.sRGBEncoding; 
        //         // UVs use the convention that (0, 0) corresponds to the upper left corner of a texture.
        //         texture.flipY = false; 
        //         // immediately use the texture for material creation
        //         var material = new THREE.MeshStandardMaterial( { map: texture, envMapIntensity: .1, flatShading: true } ); 
        //         // Go over the submeshes and modify materials we want.
        //         obj.traverse(node => {
        //           node.material = material;
                  
        //           if (!this.data.tags.includes("fixed")) {
        //             this.el.setAttribute("look-at", "#player");
        //           }
        //         });
        //       }
        //     }
        //   } else {
        //     console.log('tryna load picData : '+this.picData);
        //     if (this.picData) {
        //       const obj = this.el.getObject3D('mesh');
                
        //         var texture = new THREE.TextureLoader().load(this.picData.url);
        //         texture.encoding = THREE.sRGBEncoding; 
        //         // UVs use the convention that (0, 0) corresponds to the upper left corner of a texture.
        //         texture.flipY = false; 
        //         // immediately use the texture for material creation
        //         var material = new THREE.MeshStandardMaterial( { map: texture, envMapIntensity: .1, flatShading: true } );  
        //         // Go over the submeshes and modify materials we want.
        //         obj.traverse(node => {
        //           node.material = material;
        //           if (!this.data.tags.includes("fixed")) {
        //             this.el.setAttribute("look-at", "#player");
        //           }
        //         });
        //       }
        //     }
        //   }

      });
       
      this.el.addEventListener('mouseenter', (evt) => {
        evt.preventDefault();
        // if (this.data.markerType == "object") {
        //   return;
        // }
        if (evt.detail.intersection) {
          this.clientX = evt.clientX;
          this.clientY = evt.clientY;
          console.log("mousenter cloudmarker " +  this.data.name + this.data.tags);
          this.calloutToggle = !this.calloutToggle;
          let pos = evt.detail.intersection.point; //hitpoint on model
          this.hitPosition = pos;
          // let name = evt.detail.intersection.object.name;
        //   this.distance = window.playerPosition.distanceTo(pos);
            this.distance = evt.detail.intersection.distance;
          this.rayhit(evt.detail.intersection.object.name, this.distance, evt.detail.intersection.point);
       
          // this.selectedAxis = name;
          
          // let elPos = this.el.getAttribute('position');
          // console.log(pos);
          let hideCallout = false;
          if (this.data.tags) {
            if (this.data.tags.includes("hide callout")) {
              hideCallout = true;
            }
          }
          if (!hideCallout && this.calloutEntity != null && this.data.markerType != "light") { // umm...
            console.log("tryna show the callout " + this.distance);
            if (this.distance < 66) {
            this.calloutEntity.setAttribute("position", pos);
            this.calloutEntity.setAttribute('visible', true);
            this.calloutEntity.setAttribute('scale', {x: this.distance * .25, y: this.distance * .25, z: this.distance * .25} );
              
            if (this.data.tags.toLowerCase().includes("description")) {
              if (this.data.description.includes("~")) {
                let cSplit = this.data.description.split("~");
                this.calloutText.setAttribute("troika-text", {value: cSplit[(Math.floor(Math.random()*cSplit.length))]}); //or increment index...
              } else {
                this.calloutText.setAttribute("troika-text", {value: this.data.description});
              }
             
            } else {
              let theLabel = this.data.name != undefined ? this.data.name : "";
              let calloutString = theLabel;
              this.calloutText.setAttribute("troika-text", {value: calloutString});
            }

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
  
      this.el.addEventListener('mousedown', (evt) => { 
        // evt.stopPropogation();
        // if (that.data.markerType == "object") {
        //   return;
        // }
        console.log("click on " + this.data.name + " keydown " + keydown + this.timestamp);
        if (keydown == "T") {
          ToggleTransformControls(this.timestamp);
        } else if (keydown == "Shift") {
            selectedLocationTimestamp = this.timestamp;
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
          if (that.data.markerType == "link") {
            if (that.data.eventData.includes("href~")) {

                let urlSplit = that.data.eventData.split("~");
                let url = urlSplit[1];
                this.dialogEl = document.getElementById('mod_dialog');
                if (this.dialogEl) {
                  this.dialogEl.components.mod_dialog.showPanel("Open " + url +" in new window?", that.data.eventData, "linkOpen", 10000 ); 
                }
              } 
          }
          if (this.data.markerType == "text") {
            let textString = this.data.description;
            let textTitle = this.data.name;
            let textMode = "paged";
            if (this.data.tags.includes("split")) {
              textMode = "split";
            }
            if (this.data.mediaID && sceneTextItems.length) {
              for (let i = 0; i < sceneTextItems.length; i++) {                
                if (this.data.mediaID == sceneTextItems[i]._id) {  
                  textString = sceneTextItems[i].textstring;
                  textTitle = sceneTextItems[i].title;
                  textMode = sceneTextItems[i].mode;
                  console.log("gotsa textstring " + JSON.stringify(sceneTextItems[i]));
                  break;
                }
              }
              
            }
            // let mode = "paged";
            // if (textString.includes("~")) {
            //   mode = "split";
            // }
            // console.log("textString " + textString);
            let textDisplayComponent = this.el.components.scene_text_display;
            if (!textDisplayComponent) {
              this.el.setAttribute("scene_text_display", {"textString": textString, "mode": textMode, "title": textTitle, "scale": this.data.yscale});
            } else {
              console.log("tryna toggle vis for textdata");
              textDisplayComponent.toggleVisibility();
              this.el.setAttribute("scene_text_display", {"textString": textString, "mode": textMode, "title": textTitle, "scale": this.data.yscale});
            }
            
          }
          if (this.data.markerType == "picture group") {
            // if (this.data.tags.includes("random")){
              this.loadMedia();
            // }
          }
          if (that.data.markerType == "gate" && !that.data.tags.includes("no prompt")) {
            if (evt.detail.intersection && evt.detail.intersection.distance > 1 && evt.detail.intersection.distance < 20) {
            this.dialogEl = document.getElementById('mod_dialog');
            if (this.dialogEl) {
              if (that.data.eventData && that.data.eventData.length > 2) {
                let url = "/webxr/" + that.data.eventData;
                this.dialogEl.components.mod_dialog.showPanel("Enter the gate ?", "href~"+ url, "gatePass", 5000 );
              } else {
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
            }
            } else {
              console.log("bad distance ");
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
      if (this.data.tags.includes("billboard")) {
        if (this.data.tags.includes("yonly")) {
          this.el.setAttribute("look-at-y", "#player");
        } else {
          this.el.setAttribute("look-at", "#player");
        }
        
      }
    },//end init()
    loadObject: function (objectID) { //local object swap (maybe with child model...);
      console.log("tryna load object id " + objectID);
      if (objectID != undefined && objectID != null & objectID != "none" && objectID != "") {  
        // sceneObjects = objexEl.components.mod_objex.returnObjexData(); //!
        // for (let i = 0; i < sceneObjects.length; i++) {
        //   console.log(sceneObjects[i]._id +" vs "+ objectID);
        //   if (sceneObjects[i]._id == objectID) {
            // this.el.setAttribute('gltf-model', sceneObjects[i].url);
            
            let objexEl = document.getElementById('sceneObjects');    
            if (objexEl) { 
              this.objectData = objexEl.components.mod_objex.returnObjectData(objectID);
              if (this.objectData) {
                console.log("gots objectdata for " + this.objectData.name);
                // let position = that.el.getAttribute("position");
                this.locData = {};
                // this.locData.x = this.el.object3D.position.x;
                // this.locData.y = this.el.object3D.position.y;
                // this.locData.z = this.el.object3D.position.z;
                this.locData.x = this.data.xpos;
                this.locData.y = this.data.ypos;
                this.locData.z = this.data.zpos;
                // this.locData.eulerx = THREE.MathUtils.radToDeg(this.el.object3D.rotation.x);
                // this.locData.eulery = THREE.MathUtils.radToDeg(this.el.object3D.rotation.y);
                // this.locData.eulerz = THREE.MathUtils.radToDeg(this.el.object3D.rotation.z);
                this.locData.eulerx = this.data.xrot;
                this.locData.eulery = this.data.yrot;
                this.locData.eulerz = this.data.zrot;
                this.locData.timestamp = this.data.timestamp;
                
                let objEl = document.createElement("a-entity");
                
                objEl.setAttribute("mod_object", {'locationData': this.locData, 'objectData': this.objectData});
                // objEl.id = "obj" + objectData._id + "_" + this.locData.timestamp;
                // this.objectElementID = objEl.id; 
                sceneEl.appendChild(objEl);
                // let objEl = document.createElement("a-entity");
                // let modObjectComponent = this.el.components.mod_object;
                // if (!modObjectComponent) {
                // this.el.setAttribute("mod_object", {'locationData': this.locData, 'objectData': this.objectData, 'timestamp': this.data.timestamp});
                // let modObjectComponent = this.el.components.mod_object;
                // // if (modObjectComponent) {
                //   modObjectComponent.loadObject();
                // }
                // }
               
                // objEl.id = "obj" + objectData._id + "_" + this.locData.timestamp;
                // sceneEl.appendChild(objEl);
              }
            }
        //   }
        // }
      } 
    },
    remove: function () {
        console.log("removing something!");
    },
    // loadMedia: function (mediaID) {
    //   if (!mediaID) {
    //     mediaID = this.data.mediaID;
    //   } else {
    //     this.data.mediaID = mediaID;
    //   }
    //   this.el.removeAttribute("transform_controls");
    //   this.el.removeAttribute("geometry");
    //   this.el.removeAttribute("gltf-model");
    //   console.log("tryna load mediaID "+ this.data.mediaID);
    //   // let picUrl = null;
    //   if (this.data.markerType.toLowerCase().includes("picture")) {
    //     this.el.setAttribute('gltf-model', '#flatsquare');

       
    //   }
    // },
    loadLocalFile: function () { //change to loadLocalModel...
      if (this.data.modelID && this.data.modelID != "none") {
        console.log("really tryna loadLocalFile " + this.data.modelID);
        this.loadModel();
      } else if (this.data.mediaID && this.data.mediaID != "none") {
        this.loadMedia();
      }
    },
    //when there's a local change
    updateAndLoad: function (name, description, tags, eventData, markerType, scale, xpos, ypos, zpos, xrot, yrot, zrot, xscale, yscale, zscale, modelID, objectID, mediaID) {
        this.data.name = name;
        this.data.description = description;
        this.data.tags = tags;
        this.data.eventData = eventData;
        this.data.markerType = markerType;
        this.data.scale = scale;
        this.data.modelID = modelID;
        this.data.xpos = xpos;
        this.data.ypos = ypos;
        this.data.zpos = zpos;
        this.data.xrot = xrot;
        this.data.yrot = yrot;
        this.data.zrot = zrot;
        this.data.xscale = xscale;
        this.data.yscale = yscale;
        this.data.zscale = zscale;
        this.data.mediaID = mediaID;
        // console.log("tryna scale to " + xscale + " " + yscale+ " " + zscale);
        console.log("cloudmarker updateAndLoad tags " + this.data.tags + " markertype " + markerType + " mediaID " + mediaID);
        // setTimeout(() => {
        if (this.data.markerType == "object" && objectID.length > 8) {
          this.loadObject(objectID);
        } 

      // else {
        this.loadModel(modelID);
        if (mediaID && mediaID != "none") {
          this.loadMedia(mediaID);
        } else if (markerType.includes("picture")) {
          this.loadMedia();
        }
        if (this.data.tags && this.data.tags.includes("billboard")) {
          if (this.data.tags.includes("yonly")) {
            this.el.setAttribute("look-at-y", "#player");
          } else {
            this.el.setAttribute("look-at", "#player");
          }
          
        }
       
    },
    updateMaterials: function () {
      if (this.data.tags && this.data.tags.includes("color")) {
        this.el.setAttribute("material", {color: this.data.eventData.toLowerCase(), transparent: true, opacity: .5});
      } else if (this.data.modelID && this.data.modelID.toLowerCase().includes("primitive")) {
        this.el.removeAttribute("material");
        console.log("tryna update material for markertype " + this.data.markerType);
        if (this.data.markerType.toLowerCase() == "placeholder") {
          
            this.el.setAttribute("material", {color: "yellow", transparent: true, opacity: .5});
        } else if (this.data.markerType.toLowerCase() == "poi") {
            this.el.setAttribute("material", {color: "purple", transparent: true, opacity: .5});
        } else if (this.data.markerType.toLowerCase() == "waypoint") {
            this.el.setAttribute("material", {color: "green", transparent: true, opacity: .5});
            // this.el.setAttribute("color", "purple");
        } else if (this.data.markerType.toLowerCase() == "link") {
          this.el.setAttribute("material", {color: "gold", transparent: true, opacity: .5});
        } else if (this.data.markerType.toLowerCase() == "text") {
          // this.el.setAttribute("gltf-model", "#texticon");
          this.el.setAttribute("material", {color: "black", transparent: true, opacity: .5});
        
        }else if (this.data.markerType.toLowerCase().includes("trigger")) {
          this.el.setAttribute("material", {color: "lime", transparent: true, opacity: .5});
        } else if (this.data.markerType.toLowerCase().includes("object")) {
          this.el.setAttribute("material", {color: "tomato", transparent: true, opacity: .5});
        } else if (this.data.markerType.toLowerCase().includes("collider")) {

            this.el.setAttribute("material", {color: "firebrick", transparent: true, opacity: .5});
            
            
          
        } else if (this.data.markerType.toLowerCase() == "gate") {
          this.el.setAttribute("material", {color: "orange", transparent: true, opacity: .5});
        } else if (this.data.markerType.toLowerCase() == "light") {
          this.el.setAttribute("material", {color: "yellow", wireframe: true, transparent: true, opacity: .5});
        } else if (this.data.markerType.toLowerCase() == "portal") {
            
        } else if (this.data.markerType.toLowerCase() == "mailbox") {
        
        } else {

        }
      }
    },
    loadPicture: function () { //called from model-loaded event
      // if (!mediaID) {
      //   mediaID = this.data.mediaID;
      // }
      // if (this.data.markerType == "picture") {

        console.log("mediaID " + this.data.mediaID);
        if (this.data.mediaID && this.data.mediaID.includes("local_")) {
          this.el.classList.add("hasLocalFile");
          let mediaID = this.data.mediaID.substring(6);
          console.log("CLOUDMARKER SHOUDL HAVE MediaID " + mediaID + " from localFiles " + localData.localFiles[mediaID]);
          for (const key in localData.localFiles) {
            console.log("tryna get localMedia named " + mediaID + " vs " + localData.localFiles[key].name);
            if (localData.localFiles[key].name == mediaID) {
              
              const picBuffer = localData.localFiles[key].data;
              const picBlob = new Blob([picBuffer]);
              picUrl = URL.createObjectURL(picBlob);
              const obj = this.el.getObject3D('mesh');
              
              var texture = new THREE.TextureLoader().load(picUrl);
              texture.colorSpace = THREE.SRGBColorSpace;
              // UVs use the convention that (0, 0) corresponds to the upper left corner of a texture.
              texture.flipY = false; 
              // immediately use the texture for material creation
              var material = new THREE.MeshStandardMaterial( { map: texture, transparent: this.picData.hasAlphaChannel, envMapIntensity: .1 } );  
              // Go over the submeshes and modify materials we want.
              material.needsUpdate = true;
              obj.traverse(node => {
                node.material = material;
                

              });
              if (!this.data.tags.includes("fixed")) {
                this.el.setAttribute("look-at", "#player");
              } else {
                this.el.removeAttribute("look-at");
              }
            }
          }
        } else {

          if (this.picData) {
            const obj = this.el.getObject3D('mesh');
              if (obj) {
                console.log('gotsa mesh to show picData : '+ obj.name);
                var texture = new THREE.TextureLoader().load(this.picData.url);
                texture.colorSpace = THREE.SRGBColorSpace;
                // UVs use the convention that (0, 0) corresponds to the upper left corner of a texture.
                texture.flipY = false; 
                // immediately use the texture for material creation
                var material = new THREE.MeshStandardMaterial( { map: texture, transparent: this.picData.hasAlphaChannel, envMapIntensity: .1} );  
                // Go over the submeshes and modify materials we want.
                material.needsUpdate = true;
                obj.traverse(node => {
                  node.material = material;
                  
                });
                if (!this.data.tags.includes("fixed")) {
                  this.el.setAttribute("look-at", "#player");
                } else {
                  this.el.removeAttribute("look-at");
                }
              }
            }
          }
      // }

    },
    loadMedia: function (mediaID) {
      if (mediaID == undefined || mediaID == null) {
        mediaID = this.data.mediaID;
      }
      // if (this.data.markerType == "picture") { 
      this.el.removeAttribute("transform_controls");
      // this.el.removeAttribute("geometry");

      console.log("tryna load mediaID "+ this.data.mediaID +" for markerType "+ this.data.markerType);
  
      if (this.data.markerType.toLowerCase().includes("picture")) {
        this.el.removeAttribute("gltf-model");
        this.el.removeAttribute('envMap');
        console.log("mediaID is " + mediaID);
        if (mediaID != undefined && mediaID != null && mediaID.includes("local_")) {
          this.el.classList.add("hasLocalFile");
          mediaID = mediaID.substring(6);
          console.log("CLOUDMARKER SHOUDL HAVE MediaID " + mediaID + " from localFiles " + localData.localFiles[mediaID]);
          for (const key in localData.localFiles) {
            console.log("tryna get localMedia named " + mediaID + " vs " + localData.localFiles[key].name);
            if (localData.localFiles[key].name == mediaID) {
                
              let orientation = 'Landscape';
              if (this.data.tags.toLowerCase().includes("landscape")) {
                orientation = "Landscape";
              } else if (this.data.tags.toLowerCase().includes("portrait")) {
                orientation = "Portrait";
              } else if (this.data.tags.toLowerCase().includes("square")) {
                orientation = "Square";
              } 
              console.log("gotsaa local picture item " + this.data.markerType +" tags "+ this.data.tags + " orientation " + orientation);  
              if (orientation == "Landscape") {
                this.el.setAttribute('gltf-model', '#landscape_panel'); 
                this.loadPicture();
              } else if (orientation == "Portrait") {
                this.el.setAttribute('gltf-model', '#portrait_panel');
                this.loadPicture();
              } else if (orientation == "Square") {
                console.log("SQUARE TAG FFS!");
                if (this.picData.hasAlphaChannel) {
                  this.el.setAttribute('gltf-model', '#square_panel_plain');
                  this.loadPicture();
                } else {
                  this.el.setAttribute('gltf-model', '#square_panel');
                  this.el.setAttribute('material', {'transparent': true, 'opacity': 0});
                  this.loadPicture();
                }
              } 
            }
          }
        } else {
          console.log("NOT local picture item " + this.data.markerType +" tags "+ this.data.tags);
          this.picData = null;
          if (this.data.markerType == 'picture group') {
            const picGroupsControlEl = document.getElementById("pictureGroupsData");
            if (picGroupsControlEl) {
              
              this.picData = picGroupsControlEl.components.picture_groups_control.returnRandomPictureItem();
              if (this.picData) { //first get the proper geometry, then call the loadPicture from the model-loaded event above to ensure there's something to paint
                // if (!this.picData.orientation) {
                let orientation = this.picData.orientation ? this.picData.orientation : "Landscape";
                  if (this.data.tags.toLowerCase().includes("landscape")) {
                    orientation = "Landscape";
                  } else if (this.data.tags.toLowerCase().includes("portrait")) {
                    orientation = "Portrait";
                  } else if (this.data.tags.toLowerCase().includes("square")) {
                    orientation = "Square";
                  } 
                console.log("gotsaa picturegroupsdata item " + this.data.markerType +" tags "+ this.data.tags + " orientation " + orientation);  
                if (orientation == "Landscape") {
                  this.el.setAttribute('gltf-model', '#landscape_panel'); 
                  this.loadPicture();
                } else if (orientation == "Portrait") {
                  this.el.setAttribute('gltf-model', '#portrait_panel');
                  this.loadPicture();
                } else if (orientation == "Square") {
                  console.log("SQUARE TAG FFS!");
                  if (this.picData.hasAlphaChannel) {
                    this.el.setAttribute('gltf-model', '#square_panel_plain');
                    this.loadPicture();
                  } else {
                    this.el.setAttribute('gltf-model', '#square_panel');
                    this.el.setAttribute('material', {'transparent': true, 'opacity': 0});
                    this.loadPicture();
                  }
                } else if (this.picData.orientation == "Circle" || this.data.tags.toLowerCase().includes("circle")) {

                }

              }
              // if (!this.picData.orientation) {
              //   if (this.data.tags.toLowerCase().includes("landscape")) {
              //     this.picData.orientation = "Landscape";
              //   } else if (this.data.tags.toLowerCase().includes("portrait")) {
              //     this.picData.orientation = "Portrait";
              //   } else if (this.data.tags.toLowerCase().includes("square")) {
              //     this.picData.orientation = "Square";
              //   } else {
              //     this.picData.orientation = "Landscape";
              //   }
              // }
              // console.log("gotsaa picturegroupsdata item" +  this.picData.orientation);
              // if (this.picData) { //first get the proper geometry, then call the loadPicture from the model-loaded event above to ensure there's something to paint
              //   if (!this.picData.orientation || this.picData.orientation == "Landscape" || this.data.tags && this.data.tags.includes("landscape")) {
              //     this.el.setAttribute('gltf-model', '#landscape_panel'); 
              //     this.loadPicture();
              //   } else if (this.picData.orientation == "Portrait" || this.data.tags.toLowerCase().includes("portrait")) {
              //     this.el.setAttribute('gltf-model', '#portrait_panel');
              //     this.loadPicture();
              //   } else if (this.picData.orientation == "Square" || this.data.tags.toLowerCase().includes("square")) {
              //     if (this.picData.hasAlphaChannel) {
              //       this.el.setAttribute('gltf-model', '#square_panel_plain');
              //       this.loadPicture();
              //     } else {
              //       console.log("tryna load picData.orientation " + this.picData.orientation);
              //       this.el.setAttribute('gltf-model', '#square_panel');
              //       this.el.setAttribute('material', {'transparent': true, 'opacity': 0});
              //       this.loadPicture();
              //     }
                  
              //   } else if (this.picData.orientation == "Circle" || this.data.tags.toLowerCase().includes("circle")) {

              //   }

              // }
            } else {
              console.log("no picturegroupsdata element!");
            }
          } else {
            const scenePicDataEl = document.getElementById("scenePictureData");
            
            if (scenePicDataEl) {
              this.picData = scenePicDataEl.components.scene_pictures_control.returnPictureData(mediaID);
              if (this.picData) { //first get the proper geometry, then call the loadPicture from the model-loaded event above to ensure there's something to paint
                // if (!this.picData.orientation) {
                let orientation = this.picData.orientation;
                  if (this.data.tags.toLowerCase().includes("landscape")) {
                    orientation = "Landscape";
                  } else if (this.data.tags.toLowerCase().includes("portrait")) {
                    orientation = "Portrait";
                  } else if (this.data.tags.toLowerCase().includes("square")) {
                    orientation = "Square";
                  } 
                console.log("gotsaa picturegroupsdata item " + this.data.markerType +" tags "+ this.data.tags + " orientation " + orientation);  
                if (orientation == "Landscape") {
                  this.el.setAttribute('gltf-model', '#landscape_panel'); 
                  this.loadPicture();
                } else if (orientation == "Portrait") {
                  this.el.setAttribute('gltf-model', '#portrait_panel');
                  this.loadPicture();
                } else if (orientation == "Square") {
                  console.log("SQUARE TAG FFS!");
                  if (this.picData.hasAlphaChannel) {
                    this.el.setAttribute('gltf-model', '#square_panel_plain');
                    this.loadPicture();
                  } else {
                    this.el.setAttribute('gltf-model', '#square_panel');
                    this.el.setAttribute('material', {'transparent': true, 'opacity': 0});
                    this.loadPicture();
                  }
                } else if (this.picData.orientation == "Circle" || this.data.tags.toLowerCase().includes("circle")) {

                }

              }
              console.log("gotsaa scenepicturesdata item " + JSON.stringify(this.picData));
            }
          }
        }
      } else if (this.data.markerType == "text") {
        if (mediaID.includes("local_")) {
          this.el.classList.add("hasLocalFile");
          mediaID = mediaID.substring(6);
          console.log("CLOUDMARKER SHOUDL HAVE MediaID " + mediaID + " from localFiles " + localData.localFiles[mediaID]);
          for (const key in localData.localFiles) {
            console.log("tryna get localMedia text named " + mediaID + " vs " + localData.localFiles[key].name);
            if (localData.localFiles[key].name == mediaID) {
              
              //load text itme
            }
          }
        } else {
          console.log("text CLOUDMARKER mediaID " + mediaID );
          const sceneTextDataEl = document.getElementById("sceneTextData");
          if (sceneTextDataEl) {
            this.textData = sceneTextDataEl.components.scene_text_control.returnTextData(mediaID); //fah, it's already a global...hrm...
            console.log("textData :  " + JSON.stringify(this.textData));

          }
        }
      }
      this.el.setAttribute("scale", this.data.xscale + " " + this.data.yscale + " " + this.data.zscale);
      // }
    },
    removeModel: function () {
      this.el.removeObject3D('mesh');
    },
    loadModel: function (modelID) {
        
        if (!modelID) {
          modelID = this.data.modelID;
        }
        console.log("tryna load cloudmarker model " + modelID);
        let transform_controls_component = this.el.components.transform_controls;
        if (transform_controls_component) {
            if (transform_controls_component.data.isAttached) {
                transform_controls_component.detachTransformControls();
            }
        }

        this.el.classList.remove("waypoint");
        this.el.removeAttribute("transform_controls");
        // this.el.removeAttribute("geometry");
        // this.el.removeAttribute("gltf-model");

        this.el.removeAttribute("mod_object");
        this.el.removeAttribute("mod_particles");
        this.el.removeAttribute("animation-mixer");
        this.el.removeAttribute("light");
        this.el.removeAttribute("material");
        this.removeModel();
        if (this.data.markerType == "collider") {
          this.data.modelID = "primitive_cube";
        } 
        if (modelID != undefined && modelID != null & modelID != "none" && modelID != "") {  
          this.el.setAttribute("scale", this.data.xscale + " " + this.data.yscale + " " + this.data.zscale);
          if (modelID.toString().includes("primitive")) {
            if (!this.data.tags.includes("hide gizmo")) {
             

              if (modelID.toString().includes("cube")) {
                  this.el.setAttribute("geometry", {"primitive": "box", "width": 1, "height": 1, "depth": 1});
                  console.log("CLOUDMARKER PRIMITIVE box " + modelID +" scale " + this.data.xscale + " " + this.data.yscale + " " + this.data.zscale);
              } else if (modelID.toString().includes("sphere")) {
                  this.el.setAttribute("geometry", {"primitive": "sphere", "radius": 1});
                  console.log("CLOUDMARKER PRIMITIVE sphere " + modelID +" scale " + this.data.xscale + " " + this.data.yscale + " " + this.data.zscale);
              } else if (modelID.toString().includes("cylinder")) {
                  this.el.setAttribute("geometry", {"primitive": "cylinder", "height": 1, "radius": 1 / 2});
                  console.log("CLOUDMARKER PRIMITIVE sphere " + modelID +" scale " + this.data.xscale + " " + this.data.yscale + " " + this.data.zscale);
              } else {
  
              }
              console.log("loaded cloudmarker geometry " + this.el.getAttribute("geometry", "primitive"));

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
            
              } else if (this.data.markerType.toLowerCase().includes("collider")) {
                this.el.setAttribute("material", {color: "firebrick", transparent: true, opacity: .5});
                this.el.setAttribute("mod_physics", {body: "static", isTrigger: false, model:"collider", scaleFactor: this.data.scale});
          
              } else if (this.data.markerType.toLowerCase() == "gate") {
                  this.el.setAttribute("material", {color: "orange", transparent: true, opacity: .5});
                  this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder"});
                  // this.el.setAttribute("color", "orange");
              } else if (this.data.markerType.toLowerCase() == "portal") {
              
              } else if (this.data.markerType.toLowerCase() == "light") {
                if (!this.data.tags.includes("hide")) {
                  this.radius = this.data.xscale * .05;
                  this.el.setAttribute("geometry", {"primitive": "sphere", "radius": this.radius});
                  this.el.setAttribute("material", {color: color1, wireframe: true});
                }
              } else {
  
              }
              
              if (this.data.tags.includes("hide gizmo") || (settings && settings.hideGizmos)) {
                if (this.data.markerType != "mailbox" && this.data.markerType != "light") {
                  this.el.object3D.visible = false;
                }
              }
              if (this.data.markerType == "navmesh" || this.data.markerType == "surface") {
                if (this.data.tags.includes("show")) {
                  this.el.object3D.visible = true;
                } else {
                  this.el.object3D.visible = false;
                }
              }
              this.el.setAttribute("scale", this.data.xscale + " " + this.data.yscale + " " + this.data.zscale);
              this.el.object3D.position.set(this.data.xpos, this.data.ypos, this.data.zpos);
              this.el.setAttribute("rotation", this.data.xrot + " " + this.data.yrot + " " +this.data.zrot);
          } else {
            if (modelID.includes("local_")) {
              this.el.classList.add("hasLocalFile");
              modelID = modelID.substring(6);
              console.log("CLOUDMARKER SHOUDL HAVE MODELID " + modelID + " from localFiles " + JSON.stringify(localData.localFiles));
              for (const key in localData.localFiles) {
                console.log("tryna get localModel " + modelID + " object " + localData.localFiles[key].name);
                if (localData.localFiles[key].name == modelID) {
                  
                  const modelBuffer = localData.localFiles[key].data;
                  const modelBlob = new Blob([modelBuffer]);
                  // image.src = URL.createObjectURL(imageBlobb);
                  this.el.setAttribute('gltf-model', URL.createObjectURL(modelBlob));
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
          }
          
        } else { //if "none"
            console.log("CLOUDMARKER type " + this.data.markerType+ " tryna set default model " + modelID);
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
                  
            } else if (this.data.markerType.toLowerCase().includes("object")) {
                this.el.setAttribute("gltf-model", "#poi1");
                this.el.setAttribute("material", {color: "salmon", transparent: true, opacity: .5});
                                
            } else if (this.data.markerType.toLowerCase() == "gate") {
                console.log("tryna set gate gltf model on cloudmarker " + this.el.id);
                this.el.setAttribute("gltf-model", "#gate2");
                this.el.setAttribute("material", {color: "orange", transparent: true, opacity: .5});
                this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: this.data.scale});
                // this.el.setAttribute("color", "orange");
            } else if (this.data.markerType.toLowerCase() == "link") {
              this.el.setAttribute("gltf-model", "#links");
              this.el.setAttribute("material", {color: "aqua", transparent: true, opacity: .5});
            } else if (this.data.markerType.toLowerCase() == "text") {
              this.el.setAttribute("gltf-model", "#texticon");
              this.el.setAttribute("material", {color: "black", transparent: true, opacity: .5});
            
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
              if (!this.data.tags.includes("hide")) {
                this.radius = this.data.xscale * .05;
                this.el.setAttribute("geometry", {"primitive": "sphere", "radius": this.radius});
                this.el.setAttribute("material", {color: color1, wireframe: true});
              }
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
                intensity = 5;
              }
              if (this.data.tags && (this.data.tags.includes("slow"))) {
                duration = 5000;
              }
              if (this.data.tags && (this.data.tags.includes("fast"))) {
                duration = 500;
              }
              // if (this.data.tags.includes("show gizmo")) {
              //   this.el.setAttribute("geometry", {"primitive": "sphere", "radius": this.data.scale * .1});
              //   // this.el.setAttribute("light", {type: "point", intensity: .5, distance: 3, castShadow: true, decay: 1, color: "yellow"});
              //   // this.el.setAttribute("mod_flicker", {type: "candle"});
              //   this.el.setAttribute("material", {color: "yellow", wireframe: true});
              // } 
              if (this.data.tags.includes("color"))  {
                if (this.data.eventData.includes("~")) {
                  color1 = this.data.eventData.split("~")[0];
                  color2 = this.data.eventData.split("~")[1];
                  console.log("pickup colors " + color1 + color2)
                } else {
                  color1 = this.data.eventData;
                }
              }
              if (this.data.tags.includes("candle")) {
                this.el.setAttribute("mod_particles", {type: "candle", color: color1, scale: this.data.xscale, addLight: true});
              } else if (this.data.tags.includes("fire")) {
                this.el.setAttribute("mod_particles", {type: "fire", color: color1, scale: this.data.xscale, addLight: true, intensity: intensity});
              } else {

                let markerLightShadow = true;
                let lighttype = "point";
                if (this.data.tags.includes("spot")) {
                  lighttype = "spot";
                  markerLightShadow = false;
                } 
                if (this.data.tags.includes("ambient")) {
                  lighttype = "ambient";
                  markerLightShadow = false;
                }
                this.el.setAttribute("light", {type: lighttype, intensity: intensity, distance: this.data.xscale * 4, castShadow: markerLightShadow, decay: this.data.xscale / 2, color: color1});
                if (this.data.tags && this.data.tags.includes("anim")) {
                  this.el.setAttribute("animation__color", {property: 'light.color', from: color1, to: color2, dur: duration, easing: 'easeInOutSine', loop: true, dir: 'alternate', autoplay: true});
                } 
                if (this.data.tags && this.data.tags.includes("anim") && this.data.tags.includes("intensity")) {

                  this.el.setAttribute("animation__intensity", {property: 'light.intensity', from: intensity - intensity/2, to: intensity + intensity/2, dur: duration, easing: 'easeInOutSine', loop: true, dir: 'alternate', autoplay: true});
                } 
                // if (!this.data.tags.includes("hide")) {
                //   this.radius = this.data.xscale * .05;
                //   this.el.setAttribute("geometry", {"primitive": "sphere", "radius": this.radius});
                //   this.el.setAttribute("material", {color: color1, wireframe: true});
                // }
                      
              }
              if (this.data.tags.includes("flicker")) {
                this.el.setAttribute("mod_flicker", {type: "candle"});
              }    
            }
         

          if (this.data.tags && this.data.tags.includes("hide gizmo") || (settings && settings.hideGizmos)) {
            if (this.data.markerType != "mailbox" && this.data.markerType != "light") {
              console.log("tryna hide gizmo");
              this.el.object3D.visible = false;
            }
          }
          if (this.data.markerType == "navmesh"  || this.data.markerType == "surface" ) {
            if (!this.data.tags.includes("show")) {
              this.el.object3D.visible = false;
            } 
          }
        }
        this.updateMaterials();
        // // this.updateMaterials();
        // let scale = parseFloat(this.data.scale);
        // console.log(this.data.name + " localmarker with + " + this.data.scale + " pos " + this.data.xpos + this.data.ypos + this.data.zpos + " rot " + this.data.xrot + this.data.yrot + this.data.zrot);
        // this.el.object3D.scale.set(scale,scale,scale);
        // this.el.object3D.position.set(this.data.xpos, this.data.ypos, this.data.zpos);
        // // this.el.object3D.rotation.set(THREE.MathUtils.degToRad(this.data.xrot), THREE.MathUtils.degToRad(this.data.xrot), THREE.MathUtils.degToRad(this.data.xrot));
        // this.el.setAttribute("rotation", this.data.xrot + " " + this.data.yrot + " " +this.data.zrot);
        // this.el.object3D.rotation.x += Math.PI;

        // console.log("TRYNA SCALE TO " + this.data.xscale + " " + this.data.yscale + " " + this.data.zscale);
        // // if (this.data.xscale) {
        //   this.scaleVector.x = this.data.xscale;
        //   this.scaleVector.y = this.data.yscale;
        //   this.scaleVector.z = this.data.zscale;
        // }
        this.el.setAttribute("scale", this.data.xscale + " " + this.data.yscale + " " + this.data.zscale);
        this.el.object3D.position.set(this.data.xpos, this.data.ypos, this.data.zpos);
        this.el.setAttribute("rotation", this.data.xrot + " " + this.data.yrot + " " +this.data.zrot);

                // this.el.object3D.rotation.set(THREE.MathUtils.degToRad(this.data.xrot), THREE.MathUtils.degToRad(this.data.xrot), THREE.MathUtils.degToRad(this.data.xrot));
        // this.el.object3D.rotation.x += Math.PI;
        
        // this.el.object3D.updateMatrix(); 
        
        this.el.object3D.updateMatrix(); 

        if (this.data.tags && this.data.tags.includes("hide gizmo") || (settings && settings.hideGizmos)) {
          if (this.data.markerType != "mailbox" && this.data.markerType != "light") {
            this.el.object3D.visible = false;
          }
        } else if (this.data.markerType == "navmesh" || this.data.markerType == "surface") {
          if (!this.data.tags.includes("show")) {
            this.el.object3D.visible = false;
          } 
        } else {
          this.el.object3D.visible = true;
        }
        let clips = this.el.object3D.animations;
        if (clips != null && clips.length) { 
          this.el.setAttribute('animation-mixer', {
            "clip": clips[Math.floor(Math.random()*clips.length)].name,
            "loop": "repeat",
          });
        }

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
        let oScale = this.data.yscale;
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
        console.log("cloudmarker hit " + hitID + " " + distance + " " + JSON.stringify(hitpoint));
        if (this.data.tags && this.data.tags.length && !this.data.tags.toLowerCase().includes("no trigger")) {
          console.log("gotsa audio trigger hit");
          var triggerAudioControllerEl = document.getElementById("triggerAudio");
          
          if (triggerAudioControllerEl != null) {
            // console.log("gotsa audio trigger controller el");
            let triggerAudioController = triggerAudioControllerEl.components.trigger_audio_control;
            if (triggerAudioController  != null) {
              console.log("gotsa audio trigger controller " + distance);
              // let triggertags = this.data.tags != null && this.data.tags != "" ? this.data.tags : "click";
              triggerAudioController.playAudioAtPosition(hitpoint, distance, this.data.tags);
            }
           
          }
        }
      }
  
  }); //////// end cloud_marker /////////////////////
  
  