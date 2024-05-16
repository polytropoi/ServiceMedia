

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

              if (this.data.markerType == "object" && this.data.objectID.length > 8) {
                this.loadObject(this.data.objectID); //off in the woods...
              } 
              if ((!this.data.modelID || this.data.modelID == undefined || this.data.modelID == "" || this.data.modelID == "none") && !this.data.modelID.toString().includes("primitive")) {

                if (this.data.markerType.toLowerCase() == "placeholder") {
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
                  } else if (this.data.markerType.toLowerCase().includes("trigger")) {
                    this.el.setAttribute('gltf-model', '#poi1');  
                  } else if (this.data.markerType.toLowerCase().includes("collider")) {
                    // this.el.setAttribute("geometry", {primitive: "box", width: 1, height: 1, depth: 1});
                  } else if (this.data.markerType.toLowerCase() == "gate") {
                    this.el.setAttribute('gltf-model', '#gate2');
                    // this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder"});
                  } else if (this.data.markerType.toLowerCase() == "portal") {
                    this.el.setAttribute('gltf-model', '#poi1');
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
                    if (!this.data.tags.includes("hide")) {
                      this.radius = this.data.xscale * .05;
                      this.el.setAttribute("geometry", {primitive: "sphere", radius: this.radius});
                      // this.el.setAttribute("light", {type: "point", intensity: .5, distance: 3, castShadow: true, decay: 1, color: "yellow"});
                      // this.el.setAttribute("mod_flicker", {type: "candle"});
                      this.el.setAttribute("material", {color: "yellow", wireframe: true});
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
                      this.el.setAttribute("light", {type: lighttype, intensity: intensity, distance: this.data.scale * 4, castShadow: markerLightShadow, decay: this.data.scale / 2, color: color2});
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
                            this.el.setAttribute("geometry", {primitive: "box", width: 1, height: 1, depth: 1});
                        } else if (this.data.modelID.toString().includes("sphere")) {
                            this.el.setAttribute("geometry", {primitive: "sphere", radius: 1});
                        } else if (this.data.modelID.toString().includes("cylinder")) {
                            this.el.setAttribute("geometry", {primitive: "cylinder", height: 1, radius: .5});
                        } else if (this.data.modelID.toString().includes("plane")) {
                          this.el.setAttribute("geometry", {primitive: "plane", height: 1, width: 1});
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
                            this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: 1});
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
                        
                        } else if (this.data.markerType == "mailbox") {
                        
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
              
                this.el.object3D.scale.set(this.data.xscale, this.data.yscale, this.data.zscale);
                this.el.object3D.position.set(this.data.xpos, this.data.ypos, this.data.zpos);
                // this.el.object3D.rotation.set(THREE.MathUtils.degToRad(this.data.xrot), THREE.MathUtils.degToRad(this.data.xrot), THREE.MathUtils.degToRad(this.data.xrot));
                this.el.setAttribute("rotation", this.data.xrot + " " + this.data.yrot + " " +this.data.zrot);
                if (this.data.markerType == "collider") {
                  this.el.setAttribute("mod_physics", {body: "static", isTrigger: false, model:"collider", scaleFactor: this.data.scale});
                }
                
            }
            //   if ((!this.data.modelID || this.data.modelID == undefined || this.data.modelID == "" || this.data.modelID == "none") && !this.data.modelID.toString().includes("primitive")) {
            //   if (this.data.modelID != 'none') {
            //     if (this.data.modelID.toString().includes("primitive")) {
            //         if (this.data.modelID.toString().includes("cube")) {
            //             this.el.setAttribute("geometry", {primitive: "box", width: 1, height: 1, depth: 1});
                        
            //         } else if (this.data.modelID.toString().includes("sphere")) {
            //             this.el.setAttribute("geometry", {primitive: "sphere", radius: 1});
                      
            //         } else if (this.data.modelID.toString().includes("cylinder")) {
            //             this.el.setAttribute("geometry", {primitive: "cylinder", height: 1, radius: .5});
                       
            //         } else {

            //         }
            //         if (this.data.markerType.toLowerCase() == "placeholder") {
            //             this.el.setAttribute("material", {color: "yellow", transparent: true, opacity: .5});
            //         } else if (this.data.markerType.toLowerCase() == "poi") {
            //             this.el.setAttribute("material", {color: "purple", transparent: true, opacity: .5});
            //         } else if (this.data.markerType.toLowerCase().includes("trigger")) {
            //             this.el.setAttribute("material", {color: "lime", transparent: true, opacity: .5});
            //         } else if (this.data.markerType.toLowerCase() == "gate") {
            //             this.el.setAttribute("material", {color: "orange", transparent: true, opacity: .5});
            //         } else if (this.data.markerType.toLowerCase() == "portal") {
                    
            //         } else if (this.data.markerType.toLowerCase() == "mailbox") {
                    
            //         } else {
                        
            //         }
            //     } else {
            //         this.loadModel(this.data.modelID);
            //     }
            //   } else {
            //     this.el.setAttribute('position', this.data.position);
            //     this.el.setAttribute('rotation', this.data.rotation);
            //     this.el.setAttribute('scale', this.scale);
            //     if (this.data.markerType == "none" || this.data.markerType == "player") {
            //         //skip
                    
            //     } else if (this.data.markerType == "waypoint") {
            //         this.el.setAttribute("gltf-model", "#poi1");
            //         this.el.classList.add("waypoint");
            //     } else if (this.data.markerType == "mailbox") {
            //         this.el.setAttribute("gltf-model", "#mailbox");
            //         this.el.classList.add("mailbox");
            //     } else if (this.data.markerType == "gate") {
            //         this.el.setAttribute("gltf-model", "#gate2");
                    
            //     } else {
            //         this.el.setAttribute("gltf-model", "#poi1");
            //     } 
            // }
             
  
              this.el.id = this.data.timestamp;
              console.log("tryna set localmarker with phID " + this.timestamp + " and markerType " + this.data.markerType);
              // this.waitAndLoad();
              if (this.data.markerType == "picture" && this.data.mediaID && this.data.media != "none") {
                this.loadMedia();

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
      
        this.el.addEventListener("model-loaded", (e) => {
            // e.preventDefault();  
            this.el.removeAttribute("animation-mixer");
            console.log("local_marker geo is loaded for markertype " + this.data.markerType);
            if (this.data.isNew && this.data.modelID == 'none' && this.data.markerType == "placeholder") {
              this.el.setAttribute("transform_controls", "");
            } else {
              
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
              if (this.data.markerType == "gate" || this.data.markerType == "trigger") {
                if (this.data.modelID && this.data.modelID != '' & this.data.modelID != 'none') {
                  this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"mesh", scaleFactor: this.data.scale});
                } else {
                  this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: this.data.scale});
                }
              }
              
              let clips = obj.animations;
              if (clips != null && clips.length) { 
                this.el.setAttribute('animation-mixer', {
                  "clip": clips[Math.floor(Math.random()*clips.length)].name,
                  "loop": "repeat",
                });
              }

              if (this.data.markerType.toLowerCase().includes("picture")) {
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
                      texture.encoding = THREE.sRGBEncoding; 
                      // UVs use the convention that (0, 0) corresponds to the upper left corner of a texture.
                      texture.flipY = false; 
                      // immediately use the texture for material creation
                      var material = new THREE.MeshBasicMaterial( { map: texture } ); 
                      // Go over the submeshes and modify materials we want.
                      obj.traverse(node => {
                      node.material = material;
                      
                      if (!this.data.tags.includes("fixed")) {
                        this.el.setAttribute("look-at", "#player");
                      }
                    });
                    }
                  }
                } else {
                  for (let i = 0; i < scenePictures.length; i++) {
                    if (scenePictures[i]._id == modelID) {
                      console.log("loadmedia locationpic :" + scenePictures[i].url);
                      picUrl = scenePictures[i].url;
                      //hrm, check agains #smimages?
                    }
                  }
                }
              }
              let nextbuttonEl = document.getElementById('nextButton');
              let prevbuttonEl = document.getElementById('previousButton');
              nextbuttonEl.style.visibility = "visible";
              prevbuttonEl.style.visibility = "visible";
              


        });


        this.el.addEventListener('mouseenter', (evt) => {
  
  
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
           
            if (that.distance < 66) {
            that.calloutEntity.setAttribute("position", pos);
            that.calloutEntity.setAttribute('visible', true);
            that.calloutEntity.setAttribute('scale', {x: that.distance * .25, y: that.distance * .25, z: that.distance * .25} );
            // if (that.data.markerType == "poi" && !that.data.modelID) {
            //   // that.el.setAttribute('scale', {x: that.distance * .25, y: that.distance * .25, z: that.distance * .25} );
            // }
           
            let theLabel = that.data.name != undefined ? that.data.name : "";
            let calloutString = theLabel;
            // if (that.calloutToggle) {
              console.log(that.el.id + " local_marker callout distance " + that.distance + " " + that.data.name );
            //   // calloutString = "x : " + elPos.x.toFixed(2) + "\n" +"y : " + elPos.y.toFixed(2) + "\n" +"z : " + elPos.z.toFixed(2);
            //   calloutString = that.data.description != '' ? that.data.description : theLabel;
            // }
            // this.calloutText.setAttribute('troika-text', {value: calloutString});
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
              value: that.data.name
            });
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
                if (this.data.mediaID == sceneTextItems._id) {  
                  textString = sceneTextItems.textstring;
                  console.log("gotsa textstring " + textString);
                  break;
                }
              }
              
            }
            let mode = "plain";
            if (textString.includes("~")) {
              mode = "paged";
            }
            console.log("textString " + textString);
            let textDisplayComponent = this.el.components.scene_text_display;
            if (!textDisplayComponent) {
              this.el.setAttribute("scene_text_display", {"textString": textString, "mode": mode});
            } else {
              console.log("tryna toggle vis for textdata");
              textDisplayComponent.toggleVisibility();
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
        if (this.data.markerType.toLowerCase() == "placeholder") {
            this.el.setAttribute("material", {color: "yellow", transparent: true, opacity: .5});
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
        
        } else if (this.data.markerType.toLowerCase() == "mailbox") {
        
        } else {

        }
      }
    },
    // loadModell: function (modelID) { //local model swap
    //     console.log("tryna load modeID " + modelID);
    //     let transform_controls_component = this.el.components.transform_controls;
    //     if (transform_controls_component) {
    //         if (transform_controls_component.data.isAttached) {
    //             transform_controls_component.detachTransformControls();
    //         }
    //     }
    //     this.el.classList.remove("waypoint");
    //     this.el.removeAttribute("transform_controls");
    //     this.el.removeAttribute("geometry");
    //     this.el.removeAttribute("gltf-model");
    //     if (modelID != undefined && modelID != null & modelID != "none" && modelID != "") {  
    //         if (modelID.toString().includes("primitive")) {
    //             console.log("LOCALMARKER PRIMITIVE " + modelID);
    //             if (modelID.toString().includes("cube")) {
    //                 this.el.setAttribute("geometry", {primitive: "box", width: 1, height: 1, depth: 1});
    //             } else if (modelID.toString().includes("sphere")) {
    //                 this.el.setAttribute("geometry", {primitive: "sphere", radius: 1});
    //             } else if (modelID.toString().includes("cylinder")) {
    //                 // let radius = parseFloat(this.data.scale / 2);
    //                 this.el.setAttribute("geometry", {primitive: "cylinder", height: 1, radius: .5});
    //             } else {

    //             }
    //             if (this.data.markerType.toLowerCase() == "placeholder") {
    //                 this.el.setAttribute("material", {color: "yellow", transparent: true, opacity: .5});
    //             } else if (this.data.markerType.toLowerCase() == "poi") {
    //                 this.el.setAttribute("material", {color: "purple", transparent: true, opacity: .5});
    //                 // this.el.setAttribute("color", "purple");
    //             } else if (this.data.markerType.toLowerCase() == "waypoint") {
    //                 this.el.setAttribute("material", {color: "green", transparent: true, opacity: .5});
    //                 this.el.classList.add("waypoint");
    //                 // this.el.setAttribute("color", "purple");
    //             } else if (this.data.markerType.toLowerCase().includes("trigger")) {
    //                 this.el.setAttribute("material", {color: "lime", transparent: true, opacity: .5});
    //                 this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: 1});
    //                 // this.el.setAttribute("color", "lime");
                    
    //             } else if (this.data.markerType.toLowerCase() == "gate") {
    //                 this.el.setAttribute("material", {color: "orange", transparent: true, opacity: .5});
    //                 this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: 1});
    //                 // this.el.setAttribute("color", "orange");
    //             } else if (this.data.markerType.toLowerCase() == "portal") {
                
    //             } else if (this.data.markerType.toLowerCase() == "mailbox") {
                
    //             } else {

    //         }
    //     } else {
    //         for (let i = 0; i < sceneModels.length; i++) {
    //         if (sceneModels[i]._id == modelID) {
    //             this.el.setAttribute('gltf-model', sceneModels[i].url);
    //         }
    //         }
    //     }
    //   } else { //if "none"
    //     if (this.data.markerType == "poi" || this.data.markerType == "waypoint" || this.data.markerType == "placeholder") {
    //         this.el.setAttribute("gltf-model", "#poi1");
    //     } else if (this.data.markerType == "gate"){
    //         this.el.setAttribute("gltf-model", "#gate2");
    //         this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: 1});
    //     } else if (this.data.markerType == "3D text") {
    //         console.log("tryna set 3D text!");
    //         this.el.setAttribute("text-geometry", {value: this.data.description, font: '#optimerBoldFont'});
    //     } else if (this.data.markerType == "light") {
    //       console.log("tryna set a light!");
    //       // let color = "yellow";
    //       let color1 = "yellow";
    //       let color2 = "white";
    //       let intensity = 1.25;
    //       let duration = 1500;
    //       if (settings && settings.sceneColor3) {
    //         color1 = settings.sceneColor3;
    //       }
    //       if (settings && settings.sceneColor4) {
    //         color2 = settings.sceneColor4;
    //       }
    //       if (this.data.tags && (this.data.tags.includes("this") || this.data.tags.includes("event"))) {
    //         color1 = this.data.eventData;
    //       }
    //       if (this.data.tags && (this.data.tags.includes("dim"))) {
    //         intensity = .5;
    //       }
    //       if (this.data.tags && (this.data.tags.includes("bright"))) {
    //         intensity = 2;
    //       }
    //       if (this.data.tags && (this.data.tags.includes("very bright"))) {
    //         intensity = 4;
    //       }
    //       if (this.data.tags && (this.data.tags.includes("slow"))) {
    //         duration = 5000;
    //       }
    //       if (this.data.tags && (this.data.tags.includes("fast"))) {
    //         duration = 500;
    //       }
    //       if (!this.data.tags.includes("hide gizmo") || (settings.sceneTags && settings.sceneTags.includes("hide gizmos"))) {
    //       this.el.setAttribute("geometry", {primitive: "sphere", radius: .5});
    //       // this.el.setAttribute("light", {type: "point", intensity: .5, distance: 3, castShadow: true, decay: 1, color: "yellow"});
    //       // this.el.setAttribute("mod_flicker", {type: "candle"});
    //       this.el.setAttribute("material", {color: color1, wireframe: true});
    //       } 
    //       if (this.data.tags.includes("candle")) {
    //         this.el.setAttribute("mod_particles", {type: "candle", color: color1, scale: this.data.scale, addLight: true});
    //       } else if (this.data.tags.includes("fire")) {
    //         this.el.setAttribute("mod_particles", {type: "fire", color: color1, scale: this.data.scale, addLight: true});
    //       } else {
            
    //         this.el.setAttribute("light", {type: "point", intensity: intensity, distance: this.data.scale * 4, castShadow: true, decay: this.data.scale / 2, color: color2});
    //         if (this.data.tags && this.data.tags.includes("anim") && this.data.tags.includes("color")) {
    //           this.el.setAttribute("animation__color", {property: 'light.color', from: color1, to: color2, dur: duration, easing: 'easeInOutSine', loop: true, dir: 'alternate', autoplay: true});
    //         } 
    //         if (this.data.tags && this.data.tags.includes("anim") && this.data.tags.includes("intensity")) {

    //           this.el.setAttribute("animation__intensity", {property: 'light.intensity', from: intensity - intensity/2, to: intensity + intensity/2, dur: duration, easing: 'easeInOutSine', loop: true, dir: 'alternate', autoplay: true});
    //         } 
                  
    //       }
    //       if (this.data.tags.includes("flicker")) {
    //         this.el.setAttribute("mod_flicker", {type: "candle"});
    //       }
         
    //   } 
        
    //   }
    // },
    loadMedia: function (mediaID) {
      if (!mediaID) {
        mediaID = this.data.mediaID;
      } else {
        this.data.mediaID = mediaID;
      }
      this.el.removeAttribute("transform_controls");
      this.el.removeAttribute("geometry");
      this.el.removeAttribute("gltf-model");
      console.log("tryna load mediaID "+ this.data.mediaID);
      // let picUrl = null;
      if (this.data.markerType.toLowerCase().includes("picture")) {
        this.el.setAttribute('gltf-model', '#flatsquare');

       
      }
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
              this.el.removeAttribute("geometry");
              if (modelID.toString().includes("cube")) {
                  this.el.setAttribute("geometry", {primitive: "box", width: 1, height: 1, depth: 1});
              } else if (modelID.toString().includes("sphere")) {
                  this.el.setAttribute("geometry", {primitive: "sphere", radius: 1});
              } else if (modelID.toString().includes("cylinder")) {
                  this.el.setAttribute("geometry", {primitive: "cylinder", height: 1, radius: 1 / 2});
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
                  this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: this.data.scale});
                  // this.el.setAttribute("color", "lime");
                  
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
                  this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: this.data.scale});
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
                
            } else if (this.data.markerType.toLowerCase().includes("collider")) {
              // this.el.setAttribute("gltf-model", "#poi1");
              this.el.setAttribute("geometry", {primitive: "box", width: this.data.xscale, height: this.data.yscale, depth: this.data.zscale});
              this.el.setAttribute("material", {color: "tomato", transparent: true, opacity: .5});
              
              // this.el.setAttribute("color", "lime");
              
            } else if (this.data.markerType.toLowerCase() == "gate") {
              
                this.el.setAttribute("gltf-model", "#gate2");
                this.el.setAttribute("material", {color: "orange", transparent: true, opacity: .5});
                this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: this.data.scale});
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
                this.el.setAttribute("light", {type: lighttype, intensity: intensity, distance: this.data.scale * 4, castShadow: markerLightShadow, decay: this.data.scale / 2, color: color2});
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

        // let scale = parseFloat(this.data.scale);
        
        console.log("localmarker with scale + " + this.data.xscale +" "+ this.data.yscale +" "+ this.data.zscale + " rot " + this.data.xrot + this.data.yrot + this.data.zrot);
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
      console.log("gotsa player trigger hit on local marker with type " + this.data.markerType.toLowerCase()); 
        if (this.data.markerType.toLowerCase() == "spawntrigger") {
  
            let objexEl = document.getElementById('sceneObjects');    
            objexEl.components.mod_objex.spawnObject(this.data.eventData);
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