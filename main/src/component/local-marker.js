

AFRAME.registerComponent('local_marker', { //special items with local mods, not saved to cloud yet
    schema: {
      // eventData: {default: ''},
      mediaID: {default: 'none'},
      modelID: {default: 'none'},
      objectID: {default: 'none'},
      selectedAxis: {default: 'all'},
      timestamp: {default: ''},
      name: {default: 'local placeholder'},
      description: {default: ''},
      markerType: {default: 'placeholder'},
      eventData: {default: ''},
      isLocal: {default: true},
      isSelected: {default: false},
      tags: {default: ''},
      targetElements: {default: []}, //array -> csv
      // position: {default: ''},
      xpos: {type: 'number', default: 0},
      ypos: {type: 'number', default: 0},
      zpos: {type: 'number', default: 0},

      xrot: {type: 'number', default: 0},//in degrees, trans to radians below
      yrot: {type: 'number', default: 0},
      zrot: {type: 'number', default: 0},

      // rotation: {default: ''},
      xscale: {type: 'number', default: 1},
      yscale: {type: 'number', default: 1},
      zscale: {type: 'number', default: 1},

      scale: {type: 'number', default: 1},

      isNew: {default: false}
  
    },
    init: function () {
      


      this.timestamp = this.data.timestamp;

      if (this.timestamp == '') {
        this.timestamp = Math.round(Date.now() / 1000).toString();
        this.data.timestamp = this.timestamp;
      }
      this.el.id = this.timestamp;
      if (this.data.eventData.includes("navmesh")) {
        return;
      }
      // this.position = new THREE.Vector3(xpos, ypos, zpos);
      // this.scale = {x: this.data.scale.x, y: this.data.scale.y, z: this.data.scale.z};
      // this.scale = new THREE.Vector3(this.data.scale, this.data.scale, this.data.scale);
      // this.threeScale = 
      // this.scalex = 1;
      // this.scaley = 1;
      // this.scalez = 1;
      // this.scaleNonUniform = new THREE.Vector3();
      // let scaleSplit = null;
      // if (this.data.scale.toString().includes(',')) {
      //   scaleSplit = this.data.scale.split(',');
      //   if (scaleSplit.lengh == 3) {
      //     this.scalex = parseFloat(scaleSplit[0]).toFixed(2);
      //     this.scaley = parseFloat(scaleSplit[1]).toFixed(2);
      //     this.scalez = parseFloat(scaleSplit[2]).toFixed(2);
      //     this.scaleNonUniform.x = this.scalex;
      //     this.scaleNonUniform.y = this.scaley;
      //     this.scaleNonUniform.z = this.scalez;
      //   }
      // }

      // this.scaleVector = new THREE.Vector3(this.data.scale,this.data.scale,this.data.scale); 
      // if (this.data.xscale) { //well, yeah
      //   this.scaleVector.x = this.data.xscale;
      //   this.scaleVector.y = this.data.yscale;
      //   this.scaleVector.z = this.data.zscale;
      // }

      var sceneEl = document.querySelector('a-scene');
  
      this.calloutEntity = document.createElement("a-entity");
      // this.calloutPanel = document.createElement("a-entity");
      this.calloutText = document.createElement("a-entity");
      this.viewportHolder = document.getElementById('viewportPlaceholder3');
      var cameraPosition = new THREE.Vector3(); 
      this.viewportHolder.object3D.getWorldPosition( cameraPosition );
      this.calloutIndex = 0;
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
      console.log("new localmarker with modelID " + this.data.modelID);
      // if (this.data.tags && !this.data.tags.includes("no env")) {
        this.el.classList.add("envMap");
      // }
          if (this.data.isNew && this.data.modelID == 'none' && this.data.markerType == 'placeholder') { //Create new location button, no local file
            this.el.setAttribute("gltf-model", "#poi1");
            this.el.id = this.timestamp;
            
          } else { //it's been saved to localDB, w/ position (or has a new localfile)
            
            if (this.data.markerType == "collider") {
              this.data.modelID = "primitive_cube";
            } 
            if (this.data.markerType == "floor") {
              this.data.modelID = "primitive_plane";
            } 
            if (this.data.markerType == "curve") {
              this.el.setAttribute("mod_curve", "init");
            } 

            if (this.data.markerType == "object" && this.data.objectID.length > 8) {
              this.loadObject(this.data.objectID); //off in the woods...
            }
            if ((this.data.eventData && this.data.eventData.length && this.data.eventData.toLowerCase().includes("anchored")) || 
            this.data.tags && this.data.tags.length && this.data.tags.toLowerCase().includes("anchored")) {
              this.el.setAttribute("anchored");
            }    
            // if ((this.data.eventData && this.data.eventData.length && this.data.eventData.toLowerCase().includes("target")) || 
            // this.data.tags && this.data.tags.length && this.data.tags.toLowerCase().includes("target")) {
            // // this.isTarget = true;
            // this.el.sceneEl.setAttribute("ar-hit-test", {"target": this.el.id});
            // }
            if (this.data.tags && this.data.tags.includes("follow curve")) {
              this.el.setAttribute("mod_curve", {"origin": "location", "isClosed": true, "spreadFactor": 2})
            }
            if (this.data.tags && this.data.tags.toLowerCase().includes("curve point") || this.data.markerType == "curve point") {
              this.el.classList.add("curvepoint");
            }
            if (this.data.tags && this.data.tags.length && this.data.tags.toLowerCase().includes("spawnable")) {
              this.el.classList.add("spawnable");
            }
            if ((!this.data.modelID || this.data.modelID == undefined || this.data.modelID == "" || this.data.modelID == "none") 
              && !this.data.modelID.toString().includes("primitive")
              && (this.data.tags && !this.data.tags.includes("hide gizmo")) || (settings && settings.hideGizmos)) {
              if (this.data.markerType.toLowerCase() == "player") {
                this.el.removeAttribute("geometry");
                this.el.setAttribute('gltf-model', '#poi1');
                this.el.setAttribute("material", {color: "blue", transparent: true, opacity: .5});
              } else if (this.data.markerType.toLowerCase() == "placeholder") {
                this.el.setAttribute('gltf-model', '#poi1');
              } else if (this.data.markerType.toLowerCase() == "poi") {
                this.el.setAttribute('gltf-model', '#poi1');
                let nextbuttonEl = document.getElementById('nextButton');
                let prevbuttonEl = document.getElementById('previousButton');
                nextbuttonEl.style.visibility = "visible";
                prevbuttonEl.style.visibility = "visible";
                
              } else if (this.data.markerType.toLowerCase() == "waypoint") {
                this.el.setAttribute('gltf-model', '#poi1');
                this.el.classList.add("waypoint");
              } else if (this.data.markerType.toLowerCase() == "curve point") {
                this.el.setAttribute("gltf-model", "#poi1");
                this.el.setAttribute("material", {color: "blue", transparent: true, opacity: .5});
              } else if (this.data.markerType.toLowerCase().includes("trigger")) {
                // this.el.setAttribute('gltf-model', '#poi1');  
                this.el.setAttribute("geometry", {"primitive": "box", "width": 1, "height": 1, "depth": 1});
                this.el.setAttribute("obb-collider", {size: this.data.xscale * 1.5 + " " + this.data.yscale * 1.5 + " " + this.data.zscale * 1.5});
                
              } else if (this.data.markerType.toLowerCase().includes("collider")) {
                // this.el.setAttribute("geometry", {primitive: "box", width: 1, height: 1, depth: 1});
              } else if (this.data.markerType.toLowerCase() == "gate") {
                this.el.setAttribute('gltf-model', '#gate2');
                // this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder"});
              } else if (this.data.markerType.toLowerCase() == "portal") {
                this.el.setAttribute('gltf-model', '#poi1');
                this.el.setAttribute("obb-collider", {size: this.data.xscale * 1.5 + " " + this.data.yscale * 1.5 + " " + this.data.zscale * 1.5});
              } else if (this.data.markerType.toLowerCase() == "link") {
                this.el.setAttribute('gltf-model', '#links');
                
              } else if (this.data.markerType.toLowerCase() == "text") {
                this.el.setAttribute("gltf-model", "#texticon");
                this.el.setAttribute("material", {color: "black", transparent: true, opacity: .5});
              
              } else if (this.data.markerType.toLowerCase() == "mailbox") {
                // console.log("TRYNA SET MODEL TO MAILBOX!")
                this.el.setAttribute('gltf-model', '#mailbox');
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
                let decay = 1; //this.data.xscale / 2
                
                if (settings && settings.sceneColor3) {
                  color1 = settings.sceneColor3;
                }
                if (settings && settings.sceneColor4) {
                  color2 = settings.sceneColor4;
                }

                if (!this.data.tags.includes("hide")) {
                  this.radius = this.data.xscale * .05;
                  this.el.setAttribute("geometry", {"primitive": "sphere", "radius": this.radius});
                  this.el.setAttribute("material", {color: color1, wireframe: true});
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
                  
                if (this.data.tags.includes("candle")) {
                  this.el.setAttribute("mod_particles", {type: "candle", color: color1, scale: this.data.xscale, addLight: true});
                } else if (this.data.tags.includes("fire")) {
                  this.el.setAttribute("mod_particles", {type: "fire", color: color1, scale: this.data.xscale, addLight: true});
                } else {
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
                  this.el.setAttribute("light", {type: lighttype, intensity: intensity, distance: this.data.xscale * 4, castShadow: markerLightShadow, decay: decay, color: color2});
                  if (this.data.tags && this.data.tags.includes("anim") && this.data.tags.includes("color")) {
                    console.log("LOCAL_MARKER LIGHT " + color1 + color2 + duration);
                    this.el.setAttribute("animation__color", {property: 'light.color', from: color1, to: color2, dur: duration, easing: 'easeInOutSine', loop: true, dir: 'alternate', autoplay: true});
                  } 
                  if (this.data.tags && this.data.tags.includes("anim") && this.data.tags.includes("intensity")) {
  
                    this.el.setAttribute("animation__intensity", {property: 'light.intensity', from: intensity - intensity/2, to: intensity + intensity/2, dur: duration, easing: 'easeInOutSine', loop: true, dir: 'alternate', autoplay: true});
                  } 
                        
                  }
                  if (this.data.tags.includes("flicker")) {
                    this.el.setAttribute("mod_flicker", {type: "candle"});
                  }

                  if (this.data.tags.includes("hide gizmo") || (settings && settings.hideGizmos)) {
                    if (this.data.markerType != "mailbox" && this.data.markerType != "light") {
                      this.el.removeAttribute("geometry");
                    }
                  }
                  // this.loadModel();
                  // this.el.
                    
                }

                if (this.data.tags.includes("hide gizmo") || (settings && settings.hideGizmos)) {
                  if (this.data.markerType != "mailbox" && this.data.markerType != "light") {
                    this.el.object3D.visible = false;
                  }
                }
              } else {
                if (this.data.modelID != "none") {
                    if (this.data.modelID.toString().includes("primitive")) {
                        console.log("LOCALMARKER PRIMITIVE " + this.data.modelID);
                        if (this.data.modelID.toString().includes("cube")) {
                            this.el.setAttribute("geometry", {"primitive": "box", "width": 1, "height": 1, "depth": 1});
                        } else if (this.data.modelID.toString().includes("sphere")) {
                            this.el.setAttribute("geometry", {"primitive": "sphere", "radius": 1});
                        } else if (this.data.modelID.toString().includes("cylinder")) {
                            this.el.setAttribute("geometry", {"primitive": "cylinder", "height": 1, "radius": .5});
                        } else if (this.data.modelID.toString().includes("plane")) {
                          this.el.setAttribute("geometry", {"primitive": "plane", "height": 1, "width": 1});
                        }
                        if (this.data.markerType == "placeholder") {
                            this.el.setAttribute("material", {color: "yellow", transparent: true, opacity: .5});
                            // this.el.setAttribute("color", "yellow");
                        } else if (this.data.markerType == "poi") {
                            this.el.setAttribute("material", {color: "purple", transparent: true, opacity: .5});
                            
                            // this.el.setAttribute("color", "purple");
                        } else if (this.data.markerType == "waypoint") {
                            this.el.setAttribute("material", {color: "green", transparent: true, opacity: .5});
                            this.el.classList.add("waypoint");
                            
                            // this.el.setAttribute("color", "purple");
                        } else if (this.data.markerType.includes("trigger")) {
                            this.el.setAttribute("material", {color: "lime", transparent: true, opacity: .5});
                            // this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: 1});
                            this.el.setAttribute("obb-collider", {size: this.data.xscale * 1.5 + " " + this.data.yscale * 1.5 + " " + this.data.zscale * 1.5});
                            // this.el.setAttribute("color", "lime");
                            
                        } else if (this.data.markerType.includes("collider")) {
                          this.el.setAttribute("material", {color: "tomato", transparent: true, opacity: .5});
                          
                        } else if (this.data.markerType == "gate") {

                          // console.log("gotsa gate truyna set mod_physics...");
                            this.el.setAttribute("material", {color: "orange", transparent: true, opacity: .5});
                            this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: 1});
                            // this.el.setAttribute("color", "orange");
                        } else if (this.data.markerType == "link") {
                          // console.log("gotsa gate truyna set mod_physics...");
                            this.el.setAttribute("material", {color: "Gold", transparent: true, opacity: .5});
                            // this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: 1});
                            // this.el.setAttribute("color", "orange");
                        } else if (this.data.markerType.toLowerCase() == "text") {
                          this.el.setAttribute("gltf-model", "#texticon");
                          this.el.setAttribute("material", {color: "black", transparent: true, opacity: .5});
                        
                        } else if (this.data.markerType == "portal") {
                          this.el.setAttribute("material", {color: "aqua", transparent: true, opacity: .5});
                          this.el.setAttribute("obb-collider", {size: this.data.xscale * 1.5 + " " + this.data.yscale * 1.5 + " " + this.data.zscale * 1.5});
                        }  else if (this.data.markerType.toLowerCase() == "curve point") {
                          this.el.setAttribute("material", {color: "blue", transparent: true, opacity: .5});
                        } else {
    
                        }
                        if (this.data.tags.includes("hide gizmo") || (settings && settings.hideGizmos)) {
                          if (this.data.markerType != "mailbox" && this.data.markerType != "light") {
                            this.el.object3D.visible = false;
                          }
                        }
                    } else {
                        this.loadModel(this.data.modelID);
                    }
                    if (this.data.tags.includes("hide gizmo") || (settings && settings.hideGizmos)) {
                      if (this.data.markerType != "mailbox" && this.data.markerType != "light") {
                        this.el.object3D.visible = false;
                      }
                    }
                }
                // let scale = parseFloat(this.data.scale);
                console.log("localmarker with + " + this.data.scale + " rot " + this.data.xrot + this.data.yrot + this.data.zrot);
              
                // this.el.object3D.scale.set(this.data.xscale, this.data.yscale, this.data.zscale);
                // this.el.object3D.position.set(this.data.xpos, this.data.ypos, this.data.zpos);
                // this.el.object3D.rotation.set(THREE.MathUtils.degToRad(this.data.xrot), THREE.MathUtils.degToRad(this.data.xrot), THREE.MathUtils.degToRad(this.data.xrot));
                this.el.object3D.scale.set(this.data.xscale, this.data.yscale, this.data.zscale);
                this.el.object3D.position.set(this.data.xpos, this.data.ypos, this.data.zpos);

                this.el.setAttribute("rotation", this.data.xrot + " " + this.data.yrot + " " +this.data.zrot);
                if (this.data.markerType == "collider") {
                  this.el.setAttribute("mod_physics", {body: "static", isTrigger: false, model:"collider", scaleFactor: this.data.scale});
                }
                
            }

              console.log("tryna set localmarker with phID " + this.timestamp + " and markerType " + this.data.markerType);
              // this.waitAndLoad();
              if (this.data.markerType.toLowerCase().includes("picture")) {
                this.loadMedia(); //if tags == etc...

              }
              if (this.data.markerType == "picture group") {
                this.el.classList.add("picgroup");
              }
          }
  
  
            this.clientX = 0;
            this.clientY = 0;
            this.selectedAxis = null;
            this.isSelected = false;
            this.hitPosition = null;
            this.mouseDownPos = new THREE.Vector2();
            this.mousePos = new THREE.Vector2();
            this.distance = 0;
      
            // if (this.data.tags && !this.data.tags.includes("hide callout")) {
           
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
            // }
      
          this.calloutText.setAttribute("overlay");
          this.calloutToggle = false;
          this.calloutToggle = false;
          let that = this;
          // that.calloutEntity = this.calloutEntity;
          // that.calloutText = this.calloutText;
      
          ///////////MODEL LOADED EVENT
        this.el.addEventListener("model-loaded", (e) => {
            // e.preventDefault();  
            this.el.removeAttribute("animation-mixer");
          
            this.el.object3D.scale.set(this.data.xscale, this.data.yscale, this.data.zscale);
            this.el.object3D.position.set(this.data.xpos, this.data.ypos, this.data.zpos);
            // this.el.setAttribute("visible", true);
            const obj = this.el.getObject3D('mesh');

          
            // Go over the submeshes and modify materials we want.

          console.log("local_marker geo is loaded for markertype " + this.data.markerType + " obj "+ this.data.modelID);
              obj.traverse(node => {
                if (node.isMesh && node.material) {
                  if (this.data.markerType == "waypoint") {
                    node.material.color.set('lime');
                  } else if  (this.data.markerType == "placeholder") {
                    if (!this.data.modelID.includes("local")) {
                      node.material.color.set('yellow');
                    }
                   
                  } else if  (this.data.markerType == "poi") {
                    node.material.color.set('purple');
                  } 
                }
              });
              // this.el.setObject3D('mesh', obj);
              if (this.data.markerType == "gate" || this.data.markerType == "trigger") {
                if (this.data.modelID && this.data.modelID != '' & this.data.modelID != 'none') {
                  // this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"mesh", scaleFactor: this.data.scale});
                  // this.el.setAttribute("material", {color: "aqua", transparent: true, opacity: .5});
                  this.el.setAttribute("obb-collider", {size: this.data.xscale * 1.5 + " " + this.data.yscale * 1.5 + " " + this.data.zscale * 1.5});
                } else {
                  // this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: this.data.scale});
                  this.el.setAttribute("obb-collider", {size: this.data.xscale * 1.5 + " " + this.data.yscale * 1.5 + " " + this.data.zscale * 1.5});
                }
              }
              if (this.data.isNew && this.data.modelID == 'none' && this.data.markerType == "placeholder") {
                // this.el.setAttribute("transform_controls", "");
              } 
              let clips = obj.animations;
              if (clips != null && clips.length) { 
                this.el.setAttribute('animation-mixer', {
                  "clip": clips[Math.floor(Math.random()*clips.length)].name,
                  "loop": "repeat",
                });
              }

              if (this.data.markerType.toLowerCase().includes("picture")) {
               this.loadPicture();
              }
              if (this.data.tags.includes("hide gizmo") ||  this.data.tags.includes("highlight") || (settings && settings.hideGizmos)) {
                if (this.data.markerType != "mailbox" && this.data.markerType != "light") {
                  console.log(this.data.markerType + " hiding gizmos because");
                  this.el.object3D.visible = false;
                }
              }

              obj.scale.set(this.data.xscale, this.data.yscale, this.data.zscale);
              obj.position.set(this.data.xpos, this.data.ypos, this.data.zpos);
              //   console.log("localmarker tryna load media with mediaID " + this.data.mediaID);
                
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
              //         var material = new THREE.MeshStandardMaterial( { map: texture, envMapIntensity: .1 } ); 
              //         // Go over the submeshes and modify materials we want.
              //         obj.traverse(node => {
              //         node.material = material;
                      
              //         if (!this.data.tags.includes("fixed")) {
              //           this.el.setAttribute("look-at", "#player");
              //         }
              //       });
              //       }
              //     }
              //   } else {
              //     // for (let i = 0; i < scenePictures.length; i++) {
              //     //   if (scenePictures[i]._id == modelID) {
              //     //     console.log("loadmedia locationpic :" + scenePictures[i].url);
              //     //     picUrl = scenePictures[i].url;
              //     //     //hrm, check agains #smimages?
              //     //   }
              //     // }
              //   }
              // }

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
              // }

              let nextbuttonEl = document.getElementById('nextButton');
              let prevbuttonEl = document.getElementById('previousButton');
              nextbuttonEl.style.visibility = "visible";
              prevbuttonEl.style.visibility = "visible";
              


        });

        this.el.addEventListener('mouseenter', (evt) => {
  
          if (this.data.tags && this.data.tags.toLowerCase().includes("no select")) {
            return;
          }
        if (evt.detail.intersection) {
          this.clientX = evt.clientX;
          this.clientY = evt.clientY;
          // console.log("tryna mouseover placeholder");
          this.calloutToggle = !this.calloutToggle;
          let pos = evt.detail.intersection.point; //hitpoint on model
          this.hitPosition = pos;
          let name = evt.detail.intersection.object.name;
          // this.distance = window.playerPosition.distanceTo(pos);
          this.distance = evt.detail.intersection.distance;
          this.rayhit(evt.detail.intersection.object.name, this.distance, evt.detail.intersection.point);
          // this.targetMods()
          this.selectedAxis = name;
  
          // let elPos = this.el.getAttribute('position');
          // console.log(pos);
          let hideCallout = false;
          if (this.data.tags) {
            if (this.data.tags.includes("hide callout")) {
              hideCallout = true;
            }
          }
          if (!hideCallout && this.calloutEntity != null && this.data.markerType != "light") { // umm...
           
            // if (this.distance < 300) {
            this.calloutEntity.setAttribute("position", pos);
            this.calloutEntity.setAttribute('visible', true);
            this.calloutEntity.setAttribute('scale', {x: this.distance * .25, y: this.distance * .25, z: this.distance * .25} );

           
            let theLabel = this.data.name != undefined ? this.data.name : "";
            let calloutString = theLabel;
            // if (this.calloutToggle) {
              console.log(this.el.id + " local_marker callout distance " + this.distance + " " + this.data.name );

            if (this.data.description && this.data.description != "") {
              if (this.data.description.includes("~")) {
                let cSplit = this.data.description.split("~");
                this.calloutText.setAttribute("troika-text", {value: cSplit[(Math.floor(Math.random()*cSplit.length))]}); //or increment index...
              } else {
                if (this.calloutIndex > 0) {
                  this.calloutText.setAttribute("troika-text", {value: this.data.description});
                  this.calloutIndex = 0;
                } else {
                  this.calloutText.setAttribute("troika-text", {value: this.data.name});
                  this.calloutIndex++;
                }
               
              }
             
            } else {
              let theLabel = this.data.name != undefined ? this.data.name : "";
              let calloutString = theLabel;
              this.calloutText.setAttribute("troika-text", {value: calloutString});
            }

            // }
            
          }
          if (this.data.tags.includes("highlight")) {
            this.el.object3D.visible = true;
          }
        }
      });
  
      this.el.addEventListener('mouseleave', (evt) => {
        this.calloutEntity.setAttribute('visible', false);
        if (this.data.tags.includes("highlight")) {
          this.el.object3D.visible = false;
        }
      });
  
      this.el.addEventListener('mousedown', (evt) => {
        if (keydown == "T") {
          ToggleTransformControls(this.timestamp);
        } else if (keydown == "Shift") {
        //   ShowLocationModal(this.timestamp);
            selectedLocationTimestamp = this.timestamp;
            // ShowLocationModal(this.timestamp);
            SceneManglerModal('Location');
        } else {
          let transform_controls_component = this.el.components.transform_controls;
          if (transform_controls_component) {
              if (transform_controls_component.data.isAttached) {
                  // transform_controls_component.detachTransformControls();
                  return; //don't do stuff below if transform enabled
              }
          }
          if (this.data.markerType == "link" && !this.data.isNew) {
            if (this.data.eventData.includes("href~")) {

                let urlSplit = this.data.eventData.split("~");
                let url = urlSplit[1];
                this.dialogEl = document.getElementById('mod_dialog');
                if (this.dialogEl) {
                  this.dialogEl.components.mod_dialog.showPanel("Open " + url +" in new window?", this.data.eventData, "linkOpen", 10000 ); 
                }
              } 
          }
          if (this.data.markerType == "text") {
            let textString = this.data.description;
            if (this.data.mediaID && sceneTextItems.length) {
              for (let i = 0; i < sceneTextItems.length; i++) {                
                if (this.data.mediaID == sceneTextItems[i]._id) {  
                  textString = sceneTextItems[i].textstring;
                  console.log("gotsa textstring " + textString);
                  break;
                }
              }
              
            }
            let mode = "plain";
            // if (textString.includes("~")) {
            //   mode = "paged"; //no, split!
            // }
            console.log("textString " + textString);
            let textDisplayComponent = this.el.components.scene_text_display;
            if (!textDisplayComponent) {
              this.el.setAttribute("scene_text_display", {"textString": textString, "mode": mode});
            } else {
              console.log("tryna toggle vis for textdata");
              textDisplayComponent.toggleVisibility();
            }
            
          }
          if (this.data.markerType == "picture group") {
            // if (this.data.tags.includes("random")){
              this.loadMedia();
            // }
          }
          if (this.data.markerType == "audio") {
              if (!primaryAudioHowl.playing()) {
                primaryAudioHowl.play();
                console.log('...tryna play...');
                if (moIndex != -1) { //moIndex = "mouthopen"
                  theEl.setAttribute('animation-mixer', {
                    "clip": clips[moIndex].name,
                    "loop": "repeat",
                    "repetitions": 10,
                    "timeScale": 2
                  });
                  theEl.addEventListener('animation-finished', function () { //clunky but whatever - this is the "recommended way" ?!?
                    theEl.removeAttribute('animation-mixer');
                  });
                }
              } else {
                    primaryAudioHowl.pause();
                    console.log('...tryna pause...');
              }
            
          }
          if (this.data.markerType == "gate" && !this.data.isNew) {
            if (evt.detail.intersection && evt.detail.intersection.distance > 1 && evt.detail.intersection.distance < 15) {
              this.dialogEl = document.getElementById('mod_dialog');
              if (this.dialogEl) {
                let ascenesEl = document.getElementById("availableScenesControl");
                if (ascenesEl) {
                  let asControl = ascenesEl.components.available_scenes_control;
                  if (asControl) {
                    let scene = asControl.returnRandomScene();
                    let url = "/webxr/" + scene.sceneKey;
                    // window.location.href = url; 
                    this.dialogEl.components.mod_dialog.showPanel("Enter the gate to " + scene.sceneTitle +" ?", "href~"+ url, "gatePass", 5000 ); 
                    console.log("good " + evt.detail.intersection.distance);
                    // WaitAndHideDialogPanel(4000);
                  }
                }
              }
            } else {
              console.log("bad distance");
            }
          }  else if (this.data.markerType == "poi") {
            GoToLocation(this.data.timestamp);
          }
        }
      });
      this.el.addEventListener('mouseup', function (evt) {
        console.log(" mouseup localmarker type " + that.data.markerType);
  
        if (that.data.markerType.toLowerCase() == "mailbox") {
          console.log('tryna sho0w messages modal');
          SceneManglerModal('Messages');
        }
        // that.deselect(); 
      });
      if (this.data.tags.includes("billboard")) {
        if (this.data.tags.includes("yonly")) {
          this.el.setAttribute("look-at-y", "#player");
        } else {
          this.el.setAttribute("look-at", "#player");
        }
        
      }
  
    }, //end init
   
    loadObject: function (objectID) { //local object swap (maybe with child model...);
      console.log("tryna load OBJECT ID " + objectID);
      if (objectID != undefined && objectID != null & objectID != "none" && objectID != "") {  
        this.el.classList.remove("activeObjexRay");
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
    updateMaterials: function () {

      if (this.data.tags.includes("color")) {
        this.el.setAttribute("material", {color: this.data.eventData.toLowerCase(), transparent: true, opacity: .5});
      } else {
        if (this.data.modelID && !this.data.modelID.includes("primitive")) {
          //maybe something, but don't colorize ref'd meshes
        } else {
          
          if (this.data.markerType.toLowerCase() == "placeholder") {
            if (!this.data.modelID.includes("local")) {
              this.el.setAttribute("material", {color: "yellow", transparent: true, opacity: .5});
            }
              
          } else if (this.data.markerType.toLowerCase() == "poi") {
            this.el.setAttribute("material", {color: "purple", transparent: true, opacity: .5});
          } else if (this.data.markerType.toLowerCase() == "link") {
              this.el.setAttribute("material", {color: "Gold", transparent: true, opacity: .5});
          } else if (this.data.markerType.toLowerCase() == "waypoint") {
              this.el.setAttribute("material", {color: "green", transparent: true, opacity: .5});
              // this.el.setAttribute("color", "purple");
          } else if (this.data.markerType.toLowerCase().includes("trigger")) {
              this.el.setAttribute("material", {color: "lime", transparent: true, opacity: .5});
          } else if (this.data.markerType.toLowerCase().includes("collider")) {
            this.el.setAttribute("material", {color: "tomato", transparent: true, opacity: .5});
          } else if (this.data.markerType.toLowerCase() == "gate") {
              this.el.setAttribute("material", {color: "orange", transparent: true, opacity: .5});
          } else if (this.data.markerType.toLowerCase() == "portal") {
            this.el.setAttribute("material", {color: "aqua", transparent: true, opacity: .5});
          } else if (this.data.markerType.toLowerCase() == "curve point") {
            this.el.setAttribute("material", {color: "blue", transparent: true, opacity: .5});
          } else {

          }
        }
      }
      if (this.data.tags.includes("billboard")) {
        if (this.data.tags.includes("yonly")) {
          this.el.setAttribute("look-at-y", "#player");
        } else {
          this.el.setAttribute("look-at", "#player");
        }
        
      }
      if (this.data.tags.includes("webcam")) {
        this.el.removeAttribute("material");
        console.log("tryna set webcam material");;
        this.el.setAttribute("material", {src: '#webcam'});
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
              const obj = this.el.getObject3D('mesh');
              if (obj) {
                const picBuffer = localData.localFiles[key].data;
                const picBlob = new Blob([picBuffer]);
                picUrl = URL.createObjectURL(picBlob);
                
                
                var texture = new THREE.TextureLoader().load(picUrl);
                texture.colorSpace = THREE.SRGBColorSpace;
                // UVs use the convention that (0, 0) corresponds to the upper left corner of a texture.
                texture.flipY = false; 
                // immediately use the texture for material creation
                var material = new THREE.MeshStandardMaterial( { map: texture } ); 
                material.needsUpdate = true;
                // Go over the submeshes and modify materials we want.
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
        } else {
          console.log('tryna load picData : '+this.picData);
          if (this.picData) {
            const obj = this.el.getObject3D('mesh');
            if (obj) {
              var texture = new THREE.TextureLoader().load(this.picData.url);
              texture.encoding = THREE.sRGBEncoding; 
              // UVs use the convention that (0, 0) corresponds to the upper left corner of a texture.
              texture.flipY = false; 
              // immediately use the texture for material creation
              var material = new THREE.MeshStandardMaterial( { map: texture, envMapIntensity: .1, transparent: this.picData.hasAlphaChannel} );  
              // Go over the submeshes and modify materials we want.
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
    },
    loadMedia: function (mediaID) {
      if (!mediaID) {
        mediaID = this.data.mediaID;
      }
      // if (this.data.markerType == "picture") { 
        this.el.removeAttribute("transform_controls");
        // this.el.removeAttribute("geometry");
        // this.el.removeAttribute("gltf-model");
        console.log("tryna load mediaID "+ this.data.mediaID +" for markerType "+ this.data.markerType);
        if (this.data.markerType.toLowerCase().includes("picture")) {
          this.el.removeAttribute("gltf-model");
          this.el.removeAttribute('envMap');
          if (mediaID.includes("local_")) {
            this.el.classList.add("hasLocalFile");
            mediaID = mediaID.substring(6);
            console.log("localmarker mediaID " + mediaID + " from localFiles " + localData.localFiles[mediaID]);
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
            console.log("NOT local picture item" + this.data.markerType);
            this.picData = null;
              if (this.data.markerType == 'picture group') {
                const picGroupsControlEl = document.getElementById("pictureGroupsData");
                if (picGroupsControlEl) {
                  this.picData = picGroupsControlEl.components.picture_groups_control.returnRandomPictureItem();
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
               
                } else {
                  console.log("no picturegroupsdata element!");
                }
              } else {
                const scenePicDataEl = document.getElementById("scenePictureData");
                if (scenePicDataEl) {
                  this.picData = scenePicDataEl.components.scene_pictures_control.returnPictureData(mediaID);
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

                  console.log("gotsaa scenepicturesdata item " + JSON.stringify(this.picData));
                }
              }

            }
          // }
        } else if (this.data.markerType == "text") {
          if (mediaID.includes("local_")) {
            this.el.classList.add("hasLocalFile");
            mediaID = mediaID.substring(6);
            console.log("localmarker SHOUDL HAVE MediaID " + mediaID + " from localFiles " + localData.localFiles[mediaID]);
            for (const key in localData.localFiles) {
              console.log("tryna get localMedia text named " + mediaID + " vs " + localData.localFiles[key].name);
              if (localData.localFiles[key].name == mediaID) {
                
                //load text itme
              }
            }
          } else {
            console.log("text localmarker mediaID " + mediaID );
            const sceneTextDataEl = document.getElementById("sceneTextData");
            if (sceneTextDataEl) {
              this.textData = sceneTextDataEl.components.scene_text_control.returnTextData(mediaID); //fah, it's already a global...hrm...
              console.log("textData :  " + JSON.stringify(this.textData));

            }
          }
        } else if (this.data.markerType == "audio") {
          if (mediaID.includes("local_")) {
            this.el.classList.add("hasLocalFile");
            mediaID = mediaID.substring(6);
            console.log("localmarker SHOUDL HAVE MediaID " + mediaID + " from localFiles " + localData.localFiles[mediaID]);
            for (const key in localData.localFiles) {
              console.log("tryna get localMedia audio named " + mediaID + " vs " + localData.localFiles[key].name);
              if (localData.localFiles[key].name == mediaID) {
             
              }
            }
          } else {
            console.log("text localmarker mediaID " + mediaID );
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
    loadLocalFile: function () { //change to loadLocalModel...
      if (this.data.modelID && this.data.modelID != "none") {
        console.log("really tryna loadLocalFile " + this.data.modelID);
        this.loadModel();
      } else if (this.data.mediaID && this.data.mediaID != "none") {
        this.loadMedia();
      }
    },
    loadModel: function (modelID) {
      if (!modelID) {
        modelID = this.data.modelID;
      }
      console.log("localMarker loadmodel " + modelID);
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
        this.el.removeAttribute("animation-mixer");
        this.el.removeAttribute("mod_particles");
        this.el.removeAttribute("light");

        if (this.data.markerType == "collider") {
          this.data.modelID = "primitive_cube";
        } 
        
        if (modelID != undefined && modelID != null & modelID != "none" && modelID != "") {   
          if (modelID.toString().includes("primitive")) {
              console.log("LOCALMARKER PRIMITIVE " + modelID + " scale " + 1);
              // this.el.removeAttribute("geometry");
              if (modelID.toString().includes("cube")) {
                  this.el.setAttribute("geometry", {primitive: "box", width: 1, height: 1, depth: 1});
              } else if (modelID.toString().includes("sphere")) {
                  this.el.setAttribute("geometry", {primitive: "sphere", radius: 1});
              } else if (modelID.toString().includes("cylinder")) {
                  this.el.setAttribute("geometry", {primitive: "cylinder", height: 1, radius: 1 / 2});
              }

              if (this.data.markerType.toLowerCase() == "placeholder") {
                if (!modelID.includes("local")) {
                  this.el.setAttribute("material", {color: "yellow", transparent: true, opacity: .5});
                }
                  
              } else if (this.data.markerType.toLowerCase() == "poi") {
                  this.el.setAttribute("material", {color: "purple", transparent: true, opacity: .5});
                  // this.el.setAttribute("color", "purple");
              } else if (this.data.markerType.toLowerCase() == "waypoint") {
                  this.el.setAttribute("material", {color: "green", transparent: true, opacity: .5});
                  this.el.classList.add("waypoint");
                  // this.el.setAttribute("color", "purple");
              } else if (this.data.markerType.toLowerCase() == "curve point") {
                // this.el.setAttribute("gltf-model", "#poi1");
                this.el.setAttribute("material", {color: "blue", transparent: true, opacity: .5});
              } else if (this.data.markerType.toLowerCase().includes("trigger")) {
                  this.el.setAttribute("material", {color: "lime", transparent: true, opacity: .5});
                  // this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: this.data.scale});
                  // this.el.setAttribute("color", "lime");
                  this.el.setAttribute("obb-collider", {size: this.data.xscale * 1.5 + " " + this.data.yscale * 1.5 + " " + this.data.zscale * 1.5});
              } else if (this.data.markerType.toLowerCase() == "link") {
                this.el.setAttribute("gltf-model", "#links");
                this.el.setAttribute("material", {color: "aqua", transparent: true, opacity: .5});
              } else if (this.data.markerType.toLowerCase() == "text") {
               
                this.el.setAttribute("material", {color: "black", transparent: true, opacity: .5});
              
              }else if (this.data.markerType.includes("collider")) {
                this.el.setAttribute("material", {color: "tomato", transparent: true, opacity: .5});
                // this.el.setAttribute("mod_physics", {body: "static", isTrigger: false, model:"collider", scaleFactor: this.data.scale});
                // this.el.setAttribute("color", "lime");
                
              } else if (this.data.markerType.toLowerCase() == "gate") {
                  this.el.setAttribute("material", {color: "orange", transparent: true, opacity: .5});
                  // this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: this.data.scale});
                  this.el.setAttribute("obb-collider", {size: this.data.xscale * 1.5 + " " + this.data.yscale * 1.5 + " " + this.data.zscale * 1.5});
                  // this.el.setAttribute("color", "orange");
              } else if (this.data.markerType.toLowerCase() == "portal") {
                this.el.setAttribute("material", {color: "lime", transparent: true, opacity: .5});
                this.el.setAttribute("obb-collider", {size: this.data.xscale * 1.5 + " " + this.data.yscale * 1.5 + " " + this.data.zscale * 1.5});
              } else if (this.data.markerType.toLowerCase() == "mailbox") {
              
              } else {

              }
              if (this.data.tags.includes("hide gizmo") ||  (settings && settings.hideGizmos)) {
                if (this.data.markerType != "mailbox" && this.data.markerType != "light") {
                  this.el.object3D.visible = false;
                }
                
              }
              this.updateMaterials();
            } else {
              if (modelID.includes("local_")) {
                this.el.classList.add("hasLocalFile");
                modelID = modelID.substring(6);
                  for (const key in localData.localFiles) {
                    console.log("tryna get localModel " + modelID + " object " + localData.localFiles[key].name);
                    if (localData.localFiles[key].name == modelID) {
                      const modelBuffer = localData.localFiles[key].data;
                      
                     
                      const modelBlob = new Blob([modelBuffer]);
                      // image.src = URL.createObjectURL(imageBlobb);
                      const url = URL.createObjectURL(modelBlob);
                      console.log("gotsa localfile " + modelID +  + " object " + localData.localFiles[key].name + " data " + url);
                      setTimeout(() => {
                        this.el.setAttribute('gltf-model', url);
                      })
                     
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
            // console.log("CLOUDMARKER tryna set default model " + modelID);
            if (this.data.markerType.toLowerCase() == "player") {
              this.el.removeAttribute("geometry");
              this.el.setAttribute('gltf-model', '#poi1');
              this.el.setAttribute("material", {color: "blue", transparent: true, opacity: .5});
            } if (this.data.markerType.toLowerCase() == "placeholder") {
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
            } else if (this.data.markerType.toLowerCase() == "curve point") {
              this.el.setAttribute("gltf-model", "#poi1");
              this.el.setAttribute("material", {color: "blue", transparent: true, opacity: .5});
            } else if (this.data.markerType.toLowerCase().includes("trigger")) {
              this.el.setAttribute("geometry", {"primitive": "box", "width": 1, "height": 1, "depth": 1});
                this.el.setAttribute("material", {color: "lime", transparent: true, opacity: .5});
                // this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: this.data.scale});
                this.el.setAttribute("obb-collider", {size: this.data.xscale * 1.5 + " " + this.data.yscale * 1.5 + " " + this.data.zscale * 1.5});
                // this.el.setAttribute("color", "lime");
                
            } else if (this.data.markerType.toLowerCase().includes("collider")) {
              // this.el.setAttribute("gltf-model", "#poi1");
              this.el.setAttribute("geometry", {primitive: "box", width: this.data.xscale, height: this.data.yscale, depth: this.data.zscale});
              this.el.setAttribute("material", {color: "tomato", transparent: true, opacity: .5});
              
              // this.el.setAttribute("color", "lime");
              
            } else if (this.data.markerType.toLowerCase() == "gate") {
              
                this.el.setAttribute("gltf-model", "#gate2");
                this.el.setAttribute("material", {color: "orange", transparent: true, opacity: .5});
                // this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: this.data.scale});
                this.el.setAttribute("obb-collider", {"centerModel": false, "size": this.data.xscale * 3 + " " + this.data.yscale * 5 + " " + this.data.zscale * 3});
                // this.el.setAttribute("color", "orange");
            } else if (this.data.markerType.toLowerCase() == "portal") {
              this.el.setAttribute("gltf-model", "#poi1");
              this.el.setAttribute("material", {color: "aqua", transparent: true, opacity: .5});
            } else if (this.data.markerType.toLowerCase() == "link") {
                this.el.setAttribute("gltf-model", "#links");
                this.el.setAttribute("material", {color: "aqua", transparent: true, opacity: .5});
            }  else if (this.data.markerType.toLowerCase() == "text") {
              this.el.setAttribute("gltf-model", "#texticon");
              this.el.setAttribute("material", {color: "black", transparent: true, opacity: .5});
            
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
              let decay = 1; //this.data.xscale / 2
              if (settings && settings.sceneColor3) {
                color1 = settings.sceneColor3;
              }
              if (settings && settings.sceneColor4) {
                color2 = settings.sceneColor4;
              }
              if (!this.data.tags.includes("hide")) {
                this.radius = this.data.xscale * .05;
                this.el.setAttribute("geometry", {"primitive": "sphere", "radius": this.radius});
                this.el.setAttribute("material", {color: color1, wireframe: true});
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
              if (!this.data.tags.includes("hide")) {
                this.radius = this.data.xscale * .05;
                this.el.setAttribute("geometry", {primitive: "sphere", radius: this.radius}); //light gizmo is different bc particles
                // this.el.setAttribute("light", {type: "point", intensity: .5, distance: 3, castShadow: true, decay: 1, color: "yellow"});
                // this.el.setAttribute("mod_flicker", {type: "candle"});
                this.el.setAttribute("material", {color: "yellow", wireframe: true});
              } 
              if (this.data.tags.includes("candle")) {
                this.el.setAttribute("mod_particles", {type: "candle", color: color1, scale: this.data.xscale, addLight: true});
              } else if (this.data.tags.includes("fire")) {
                this.el.setAttribute("mod_particles", {type: "fire", color: color1, scale: this.data.xscale, addLight: true});
              } else {
                // let markerLightShadow = true;
                // let lighttype = "point";
                //     if (this.data.tags.includes("spot")) {
                //       lighttype = "spot";
                //       markerLightShadow = false;
                //     } 
                //     if (this.data.tags.includes("ambient")) {
                //       lighttype = "ambient";
                //       markerLightShadow = false;
                //     }
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
                this.el.setAttribute("light", {type: lighttype, intensity: intensity, distance: this.data.xscale * 4, castShadow: markerLightShadow, decay: decay, color: color1});
                // this.el.setAttribute("animation__intensity", {property: 'light.position', from: intensity - intensity/2, to: intensity + intensity/2, dur: duration, easing: 'easeInOutSine', loop: false, autoplay: true});
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
              // this.el.clight.position = xpos, ypos, zpos;
          }
          if (this.data.tags.includes("hide gizmo") || (settings && settings.hideGizmos)) {
            if (this.data.markerType != "mailbox" && this.data.markerType != "light" && this.data.markerType != "gate") {
              this.el.object3D.visible = false;
            }
            
          }
        }
        this.updateMaterials();

        // let scale = parseFloat(this.data.scale);
        
        console.log("localmarker with scale + " + this.data.xscale +" "+ this.data.yscale +" "+ this.data.zscale + " rot " + this.data.xrot + this.data.yrot + this.data.zrot + " pos " + this.data.xpos + this.data.ypos + this.data.zpos);
        // if (this.data.xscale) {
        //   this.scaleVector.x = this.data.xscale;
        //   this.scaleVector.y = this.data.yscale;
        //   this.scaleVector.z = this.data.zscale;
        // }
        // this.el.object3D.scale.set(this.data.xscale, this.data.yscale, this.data.zscale);
        this.el.setAttribute("scale", this.data.xscale +" "+ this.data.yscale +" "+ this.data.zscale )
        
        this.el.object3D.position.set(this.data.xpos, this.data.ypos, this.data.zpos);
        // this.el.object3D.rotation.set(THREE.MathUtils.degToRad(this.data.xrot), THREE.MathUtils.degToRad(this.data.xrot), THREE.MathUtils.degToRad(this.data.xrot));
        this.el.setAttribute("rotation", this.data.xrot + " " + this.data.yrot + " " +this.data.zrot);
        // this.el.object3D.rotation.x += Math.PI;
        
        this.el.object3D.updateMatrix(); 
        if (this.data.markerType == "collider") {
          this.el.setAttribute("mod_physics", {body: "static", isTrigger: true, model:"collider", scaleFactor: this.data.scale});
        }


        let clips = this.el.object3D.animations;

        if (clips != null && clips.length) { 
          let clips = obj.animations;
          if (clips != null && clips.length) { 
            this.el.setAttribute('animation-mixer', {
              "clip": clips[Math.floor(Math.random()*clips.length)].name,
              "loop": "repeat",
            });
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
      console.log("gotsa player trigger hit on type " + this.data.markerType); 
      if (this.data.tags.includes("click only") || (this.data.markerType == "trigger" && this.data.tags && this.data.tags.toLowerCase().includes("no enter") && this.data.tags.toLowerCase().includes("no collision"))) { //disable the player contact of trigger
        return;
      }
      var triggerAudioController = document.getElementById("triggerAudio");
      if (triggerAudioController != null) {
        if (window.playerPosition && this.el.object3D) {
          triggerAudioController.components.trigger_audio_control.playAudioAtPosition(this.el.object3D.position, window.playerPosition.distanceTo(this.el.object3D.position), this.data.tags);
        }
      }  

      if (!this.data.tags.includes("click only")) { //portal needs playertriggerhit, not just mouseenter
        this.targetMods();
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
    targetMods: function() {
      console.log("chek targetElements " + this.data.targetElements);
      if (this.data.targetElements != '' && this.data.targetElements != []) {
        if (this.data.markerType == "portal") {
          console.log( "tryna show somethins..." + this.data.targetElements + " length"); 
          if (this.data.targetElements != '') {
          for (let i = 0; i < this.data.targetElements.length; i++) {
              if (this.data.targetElements[i] != "none") {
                let targetEl = document.getElementById(this.data.targetElements[i].toString());
                if (targetEl) {
                    console.log("tryna portal to " + targetEl);
                    GoToLocation(targetEl.id);
                }
                break;
              }
            }
          }
        }
        if (this.data.tags && this.data.tags.length && this.data.tags.toLowerCase().includes("toggle target")) {
          console.log( "tryna toggle somethin..." + this.data.targetElements + " length"); 


            for (let i = 0; i < this.data.targetElements.length; i++) {
              let targetEl = document.getElementById(this.data.targetElements[i].toString());
              if (targetEl) {
                // let isVisible = targetEl.dataset.isVisible;
                // targetEl.dataset.isVisible = !targetEl.dataset.isVisible;
                console.log( targetEl.id + " element isVisible : " + targetEl.dataset.isvisible); 
                if (targetEl.dataset.isvisible == "no") {
                  // this.coolDown = true;
                  
                  targetEl.setAttribute("visible", true)
                  targetEl.dataset.isvisible = true;
                  targetEl.classList.add("activeObjexRay");
                  console.log("set to visible " + targetEl.dataset.isvisible);
                } else {
                  // this.cooldown = true;
                  
                  targetEl.setAttribute("visible", false);
                  targetEl.dataset.isvisible = "no";
                  targetEl.classList.remove("activeObjexRay");
                  console.log("set to visible " + targetEl.dataset.isvisible);
                }
              }
            
            // this.coolDownTimer();
          }
        }
        if (this.data.tags && this.data.tags.length && this.data.tags.toLowerCase().includes("show target")) {
          console.log( "tryna show somethins..." + this.data.targetElements + " length"); 
          if (this.data.targetElements != '') {
            for (let i = 0; i < this.data.targetElements.length; i++) {
              let targetEl = document.getElementById(this.data.targetElements[i].toString());
              if (targetEl) {
                  targetEl.setAttribute("visible", true);
                  targetEl.classList.add("activeObjexRay");
                  targetEl.dataset.isvisible = true;
                  console.log("show target set to visible " + targetEl.dataset.isvisible);
              }
            }
            // this.coolDownTimer();
          }
        }
        if (this.data.tags && this.data.tags.length && this.data.tags.toLowerCase().includes("hide target")) {
          
          console.log( "tryna hide somethin..." + this.data.targetElements + " length"); 
          if (this.data.targetElements != '') {
            for (let i = 0; i < this.data.targetElements.length; i++) {
              let targetEl = document.getElementById(this.data.targetElements[i].toString());
              if (targetEl) {
                  targetEl.setAttribute("visible", false);
                  targetEl.classList.remove("activeObjexRay");
                  targetEl.dataset.isvisible = false;
                  console.log("hide target set to visible " + targetEl.dataset.isvisible);
              }
            }
            // this.coolDownTimer();
          }
        }
        if (this.data.tags && this.data.tags.length && this.data.tags.toLowerCase().includes("spawn target")) { //could be an object
          
          console.log( "tryna hide somethin..." + this.data.targetElements + " length"); 
          if (this.data.targetElements != '') {
            for (let i = 0; i < this.data.targetElements.length; i++) {
              let targetEl = document.getElementById(this.data.targetElements[i].toString());
              if (targetEl) {
                let cloudMarker = targetEl.components.cloud_marker;
                if (cloudMarker) {
                  cloudMarker.loadObject();
                }
              }
            }
            // this.coolDownTimer();
          }
        }
      }
    },
    // targetMods: function () {
    //   if (this.data.targetElements != '' && this.data.targetElements != []) {
    //     if (this.data.tags && this.data.tags.length && this.data.tags.toLowerCase().includes("toggle target")) {
    //       console.log( "tryna toggle somethin..." + this.data.targetElements + " length"); 
    //       if (this.data.targetElements != '') {

    //         for (let i = 0; i < this.data.targetElements.length; i++) {
    //           let targetEl = document.getElementById(this.data.targetElements[i].toString());
    //           if (targetEl) {
    //             // let isVisible = targetEl.dataset.isVisible;
    //             // targetEl.dataset.isVisible = !targetEl.dataset.isVisible;
    //             console.log( targetEl.id + " element isVisible : " + targetEl.dataset.isvisible); 
    //             if (targetEl.dataset.isvisible == "no") {
    //               // this.coolDown = true;
                  
    //               targetEl.setAttribute("visible", true)
    //               targetEl.dataset.isvisible = true;
    //               targetEl.classList.add("activeObjexRay");
    //               console.log("set to visible " + targetEl.dataset.isvisible);
    //             } else {
    //               // this.cooldown = true;
                  
    //               targetEl.setAttribute("visible", false);
    //               targetEl.dataset.isvisible = "no";
    //               targetEl.classList.remove("activeObjexRay");
    //               console.log("set to visible " + targetEl.dataset.isvisible);
    //             }
    //           }
    //         }
    //         // this.coolDownTimer();
    //       // }
    //     }
    //     if (this.data.tags && this.data.tags.length && this.data.tags.toLowerCase().includes("show target")) {
    //       console.log( "tryna show somethins..." + this.data.targetElements + " length"); 
    //       if (this.data.targetElements != '') {
    //         for (let i = 0; i < this.data.targetElements.length; i++) {
    //           let targetEl = document.getElementById(this.data.targetElements[i].toString());
    //           if (targetEl) {
    //               targetEl.setAttribute("visible", true);
    //               targetEl.classList.add("activeObjexRay");
    //               targetEl.dataset.isvisible = true;
    //               console.log("show target set to visible " + targetEl.dataset.isvisible);
    //           }
    //         }
    //         // this.coolDownTimer();
    //       }
    //     }
    //     if (this.data.tags && this.data.tags.length && this.data.tags.toLowerCase().includes("hide target")) {
    //       console.log( "tryna hide somethin..." + this.data.targetElements + " length"); 
    //       if (this.data.targetElements != '') {
    //         for (let i = 0; i < this.data.targetElements.length; i++) {
    //           let targetEl = document.getElementById(this.data.targetElements[i].toString());
    //           if (targetEl) {
    //               targetEl.setAttribute("visible", false);
    //               targetEl.classList.remove("activeObjexRay");
    //               targetEl.dataset.isvisible = false;
    //               console.log("hide target set to visible " + targetEl.dataset.isvisible);
    //           }
    //         }
    //         // this.coolDownTimer();
    //         }
    //       }
    //     }
    //   }
    // },
    rayhit: function (hitID, distance, hitpoint) {
      // if (this.hitID != hitID) {
      //   this.hitID = hitID;
        // console.log("new hit " + hitID + " " + distance + " " + JSON.stringify(hitpoint));
        // distance = window.playerPosition.distanceTo(hitpoint);
        console.log("new hit " + hitID + " " + distance + " " + JSON.stringify(hitpoint) + " tags " + this.data.tags);
        if (this.data.tags && this.data.tags.length && !this.data.tags.toLowerCase().includes("no trigger")) {
          var triggerAudioController = document.getElementById("triggerAudio");
          if (triggerAudioController != null) {
            triggerAudioController.components.trigger_audio_control.playAudioAtPosition(hitpoint, distance, this.data.tags);
          }
        }
        if (this.data.markerType != "portal") { //portal needs playertriggerhit, not just mouseenter
          this.targetMods();
        }
        
      
        
      }
  
  });