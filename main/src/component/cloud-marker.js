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
      targetElements: {default: ''}, //array -> csv
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
      allowMods: {default: false},
      hasSpawned: {default: false}
    },
    // dependencies: ['geometry', 'material'],
    init: function () {
      this.coolDown = false;
      this.calloutIndex = 0;
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
      this.primaryAudioMangler = null;
     
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
      if ((this.data.eventData && this.data.eventData.length && this.data.eventData.toLowerCase().includes("anchored")) || 
        this.data.tags && this.data.tags.length && this.data.tags.toLowerCase().includes("anchored")) {
        this.el.setAttribute("anchored");
      }   
      if (this.data.tags && this.data.tags.toLowerCase().includes("grabbable")) {
        console.log("gotsa grabbable cloudmarker!")
        // this.el.setAttribute("grabbable", "");
        this.el.classList.add('grabbable');
      } 
      if (this.data.tags && this.data.tags.toLowerCase().includes("wall art")) {
        this.el.classList.add("wall art placement");  //looked up by realworldmeshing after init
      } 
      if ((this.data.eventData && this.data.eventData.length && this.data.eventData.toLowerCase().includes("target")) || 
        this.data.tags && this.data.tags.length && this.data.tags.toLowerCase().includes("target")) {
        this.isTarget = true;
        this.el.classList.add("target");

      }
      if ((settings && settings.useArParent) || (this.data.tags && this.data.tags.length && (this.data.tags.toLowerCase().includes("ar child") 
        || this.data.tags.toLowerCase().includes("archild")) || this.data.tags.toLowerCase().includes("ar_child"))) {
        this.el.classList.add("arChild");       
      }

      // if (this.data.markerType == "collider") {
      //   this.data.modelID = "primitive_cube";
      // } 
      if (this.data.markerType == "dataviz") {
        console.log("tryna add traffic_data_viz");
        let size = 20;
        let type = "line";
        let source = "day totals";
        if (this.data.tags.includes("circle")) {
          type = "circle"
        }
        if (this.data.tags.includes("top pages")) {
          source = "top pages"
        }

        // if (this.data.)
        this.el.setAttribute("traffic_data_viz", {mode: "marker", type: type, size: size, source: source});
      }

      if ((this.data.tags && this.data.tags.toLowerCase().includes("follow curve")) || this.data.markerType == "follow curve" ) {
        console.log("tryna add mod_curve");
        this.el.setAttribute("mod_curve", {"origin": "location", "isClosed": true, "spreadFactor": 2})
      }
      if (this.data.tags && this.data.tags.toLowerCase().includes("curve point") || this.data.markerType == "curve point") {
        this.el.classList.add("curvepoint");
      }
      if (this.data.tags && this.data.tags.length && this.data.tags.toLowerCase().includes("spawnable")) {
        this.el.classList.add("spawnable");
      }
      if (this.data.tags && this.data.tags.length && this.data.tags.toLowerCase().includes("grid scene")) {
        this.el.setAttribute("grid_effects", "");
      }
      if (this.data.markerType == "audio" ) {
        let primaryAudioEl = document.querySelector('#primaryAudio');
        if (primaryAudioEl != null) {
          this.primaryAudioMangler = document.getElementById("primaryAudio").components.primary_audio_control;
          // this.primaryAudioMangler.data.use
          // if (!this.data.tags.includes("default")) { //otherwise use cloudmarker geometry
          if (this.primaryAudioMangler && this.data.modelID != null && this.data.modelID.length > 0 && this.data.modelID != "none") { 
            // let primaryAudioPlayer = document.getElementById("primaryAudioPlayer");
            // if (primaryAudioPlayer) {
            //   primaryAudioPlayer.setAttribute("visible", false); //
            // }
            this.primaryAudioMangler.hideDefault();
          
          }
        }
      }
      if (this.data.markerType == "player" ) {
        this.el.classList.remove("activeObjexRay");
      }
  
      console.log("CLOUDMARKER " + this.data.name + " " +this.data.markerType + " " + this.data.modelID + " " + this.data.tags);
      // this.el.removeAttribute("geometry"); //just in case?
          
      ////check model status........

      if ((!this.data.modelID || this.data.modelID == undefined || this.data.modelID == "" || this.data.modelID == "none")) { //if no model def'd
          // && !this.data.modelID != "primitive_cube"
          // && !this.data.modelID != "primitive_sphere"
          // && !this.data.modelID != "primitive_cylinder") 
          // {
            // console.log("CLOUDMARKER PLACEHOLDER GEO " + this.data.modelID);
            // // console.log("CLOUDMARKER " + this.data.markerType + " " + this.data.modelID );
            if ((this.data.tags && !this.data.tags.includes("hide gizmo")) || (settings && !settings.hideGizmos)) {
            //   if (this.data.markerType != "mailbox" && this.data.markerType != "light"  && this.data.markerType != "gate") {
                if (this.data.markerType.toLowerCase() == "player") {
                  // this.el.removeAttribute("geometry");
                  this.el.setAttribute('gltf-model', '#poi1');
                  this.el.setAttribute("material", {color: "lime", transparent: true, opacity: .5});
                }
                if (this.data.markerType.toLowerCase() == "spawn") {
                  // this.el.removeAttribute("geometry");
                  this.el.setAttribute('gltf-model', '#poi1');
                  this.el.setAttribute("material", {color: "orange", transparent: true, opacity: .5});
                }
                if (this.data.markerType.toLowerCase() == "placeholder") {
                  this.el.setAttribute('gltf-model', '#poi1');
                } else if (this.data.markerType.toLowerCase() == "poi") {
                  this.el.setAttribute('gltf-model', '#poi1');
                } else if (this.data.markerType.toLowerCase() == "waypoint") {
                  // if (settings && settings.hideGizmos) {

                  // } else {
                    this.el.setAttribute('gltf-model', '#poi1');
                    this.el.classList.add("waypoint");
                  // }
                 
                } else if (this.data.markerType.toLowerCase() == "curve point") {
                  this.el.setAttribute('gltf-model', '#poi1');
                  // this.el.classList.add("curve point");
                } else if (this.data.markerType == "trigger" || this.data.markerType == "spawntrigger") { //spawntrigger deprecated
                  this.el.setAttribute('gltf-model', '#poi1');
                  // this.el.setAttribute("geometry", {"primitive": "box", "width": this.data.xscale, "height": this.data.yscale, "depth": this.data.zscale});
                 
                  this.el.setAttribute("material", {color: "LightSalmon", transparent: true, opacity: .5});
                  this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"box", scaleFactor: this.data.scale});

                  this.el.setAttribute("obb-collider", {size: this.data.xscale * 1.5 + " " + this.data.yscale * 1.5 + " " + this.data.zscale * 1.5});

                } else if (this.data.markerType.toLowerCase().includes("object")) {
                  // this.el.setAttribute('gltf-model', '#poi1');  
                  
                } else if (this.data.markerType.toLowerCase() == "gate") {

                  this.el.setAttribute('gltf-model', '#gate2');
                  // this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: this.data.scale});
                  this.el.setAttribute("obb-collider", {"centerModel": false, "size": this.data.xscale * 3 + " " + this.data.yscale * 5 + " " + this.data.zscale * 3});
                  
                } else if (this.data.markerType.toLowerCase() == "link") {
                  this.el.setAttribute("gltf-model", "#links");
                  this.el.setAttribute("material", {color: "aqua", transparent: true, opacity: .5});
                } else if (this.data.markerType.toLowerCase() == "audio") {
                  this.el.setAttribute("gltf-model", "#poi");
                  this.el.setAttribute("material", {color: "pink", transparent: true, opacity: .5});
                } else if (this.data.markerType.toLowerCase() == "text") {
                  this.el.setAttribute("gltf-model", "#texticon");
                  this.el.setAttribute("material", {color: "black", transparent: true, opacity: .5});
                
                } else if (this.data.markerType.toLowerCase() == "portal") {
                  this.el.setAttribute('gltf-model', '#poi1');
                  this.el.setAttribute("obb-collider", {size: this.data.xscale * 1.5 + " " + this.data.yscale * 1.5 + " " + this.data.zscale * 1.5});
                } else if (this.data.markerType.toLowerCase() == "mailbox") {
                  // console.log("TRYNA SET MODEL TO MAILBOX!")
                  this.el.setAttribute('gltf-model', '#mailbox');
                } else if (this.data.markerType == "3D text") {
                  console.log("tryna set 3D text!");
                  this.el.setAttribute("text_geometry", {value: this.data.description, font: '#optimerBoldFont'});
                } 
              }
            if (this.data.markerType == "light") {
              console.log("tryna set a light!");

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
              if (!this.data.tags.includes("hide")) {
                this.radius = this.data.xscale * .05;
                this.el.setAttribute("geometry", {"primitive": "sphere", "radius": this.radius});
                this.el.setAttribute("material", {color: color1, wireframe: true});
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
              if (this.data.tags.includes("hide gizmo") || (settings && settings.hideGizmos)) {
                this.el.removeAttribute("geometry"); //this rems the sphere gizmo, not the light itself...
              } else {
                this.el.object3D.visible = true;
              }
              
            } //end if light
          
            if (this.data.tags.includes("hide") || this.data.tags.includes("highlight") || (settings && settings.hideGizmos)) {
              if (this.data.markerType != "mailbox" && this.data.markerType != "light") {
              // if (this.data.markerType != "mailbox" && this.data.markerType != "light" && this.data.markerType != "gate") {
                this.el.object3D.visible = false;
              }
            } else {
              this.el.object3D.visible = true;
            }
            //   }
            // }
      } else {
            if (this.data.modelID != "none") {
              if (this.data.modelID.toString().includes("primitive")) {   
                console.log("CLOUDMARKER PRIMITIVE " + this.data.modelID);
                if (this.data.modelID.toString().includes("cube")) {
                  console.log("CLOUDMARKER PRIMITIVE cube " + this.data.name + " " + this.data.xscale + " " +  this.data.yscale + " " +  this.data.zscale);
                  this.el.setAttribute("geometry", {"primitive": "box", "width": this.data.xscale, "height": this.data.yscale, "depth": this.data.zscale});;

                } else if (this.data.modelID.toString().includes("sphere")) {
                    this.el.setAttribute("geometry", {"primitive": "sphere", "radius": 1});
                    console.log("CLOUDMARKER PRIMITIVE " + this.data.modelID + this.el.getAttribute("geometry"));
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
                } else if (this.data.markerType.toLowerCase() ==  "trigger" || this.data.markerType == "spawntrigger") {
                    this.el.setAttribute("material", {color: "LightSalmon", transparent: true, opacity: .5});
                    // this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder"});
                    this.el.setAttribute("obb-collider", {size: this.data.xscale * 1.5 + " " + this.data.yscale * 1.5 + " " + this.data.zscale * 1.5});
                    
                } else if (this.data.markerType.includes("collider")) {
                  this.el.setAttribute("material", {color: "firebrick", transparent: true, opacity: .5});
                  this.el.setAttribute("mod_physics", {body: "static", isTrigger: false, model:"collider", scaleFactor: this.data.scale});
                } else if (this.data.markerType.toLowerCase() == "gate") {
                    this.el.setAttribute("material", {color: "orange", transparent: true, opacity: .5});
                    // this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder"});
                    this.el.setAttribute("obb-collider", {size: this.data.xscale * 1.5 + " " + this.data.yscale * 1.5 + " " + this.data.zscale * 1.5});
                   
                } else if (this.data.markerType.toLowerCase() == "portal") {
                  this.el.setAttribute("obb-collider", {size: this.data.xscale * 1.5 + " " + this.data.yscale * 1.5 + " " + this.data.zscale * 1.5});
                } else if (this.data.markerType.toLowerCase() == "curve point") {
                  this.el.setAttribute("material", {color: "blue", transparent: true, opacity: .5});
                } else if (this.data.markerType.toLowerCase() == "light") {
                    // this.el.setAttribute("material", {color: "yellow", wireframe: true});
                } else {

                }
                if (this.data.tags.includes("hide")) {
                  if (this.data.markerType != "mailbox" && this.data.markerType != "light") {
                    this.el.object3D.visible = false;
                  }
                } else {
                  this.el.object3D.visible = true;
                }
              } else {
                  this.loadModel(this.data.modelID);                  
              }

              if (!this.data.xrot || this.data.xrot == NaN || this.data.xrot == undefined) {
                this.data.xrot = 0;
              }
              if (!this.data.yrot || this.data.yrot == NaN || this.data.yrot == undefined) {
                this.data.yrot = 0;
              }
              if (!this.data.zrot || this.data.zrot == NaN || this.data.zrot == undefined) {
                this.data.zrot = 0;
              }
              // this.el.setAttribute("scale", "1 1 1");

              if (!this.data.tags.includes("no pos")) {
                this.el.object3D.position.set(this.data.xpos, this.data.ypos, this.data.zpos);
              }
              // this.el.object3D.rotation.set(THREE.MathUtils.degToRad(this.data.xrot), THREE.MathUtils.degToRad(this.data.xrot), THREE.MathUtils.degToRad(this.data.xrot));
              this.el.setAttribute("rotation", this.data.xrot + " " + this.data.yrot + " " +this.data.zrot);
              this.el.object3D.scale.set(this.data.xscale, this.data.yscale, this.data.zscale);
             
            } else {
              if (this.data.markerType == "trigger" || this.data.markerType == "portal") {
                this.el.setAttribute('geometry', {primitive: 'box', width: this.data.xscale, height: this.data.yscale, depth: this.data.zscale});
                  
                this.el.setAttribute("obb-collider", {size: this.data.xscale * 1.5 + " " + this.data.yscale * 1.5 + " " + this.data.zscale * 1.5});
              }
            }
            if (this.data.tags.includes("hide gizmo") || this.data.tags.includes("highlight") || (settings && settings.hideGizmos)) {
              if (this.data.markerType != "mailbox" && this.data.markerType != "light") {
                console.log(this.data.name + " hiding gizmos because");
                this.el.object3D.visible = false;
              }
            }
            if (this.data.markerType == "navmesh"  || this.data.markerType == "surface") {
              if (!this.data.tags.includes("show")) {
                this.el.object3D.visible = false;
                console.log("hiding gizmos because navmesh or surface");
              } 
            }
        }
        if (this.data.objectID != undefined && this.data.objectID != null && this.data.objectID != "none" && this.data.objectID != "") { //hrm, cloudmarker objex? //NO!

        }
        // this.el.setAttribute('scale', this.scale);
          // localStorage.setItem(this.phID, JSON.stringify(locItem)); 
        
        // if (this.data.markerType.toLowerCase() == "player") {
        //   this.el.setAttribute('gltf-model', '#poi1');
        //   this.el.setAttribute("material", {color: "lime", transparent: true, opacity: .5});
        //   this.el.classList.remove("activeObjexRay"); //bc it blocks player interaction when spawned inside
        // }
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
  
        if (!this.data.tags.includes("hide callout") && !this.data.tags.includes("hide callout") &&
            (settings && !settings.sceneTags.includes("aframe master"))) {
       
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

      this.el.addEventListener('obbcollisionstarted	', (evt) => {
          // this.obbHit(evt);
          console.log(evt.detail.withEl);
      });
      this.el.addEventListener('obbcollisionended	', (evt) => {
          this.obbHit(evt.detail.withEl);
      });

      if (this.data.markerType.toLowerCase().includes("picture")) {
        this.loadMedia(); //if tags == etc...
      }
      if (this.data.markerType == "picture group") {
        this.el.classList.add("picgroup");
      }
  
      this.el.addEventListener('model-loaded', (evt) => { //load placeholder model first (which is an a-asset) before calling external
        evt.preventDefault();
        this.el.removeAttribute("animation-mixer"); 
        const obj = this.el.getObject3D('mesh');
        // this.el.object3D.visible = true;
        
        console.log(this.data.name + " " + this.data.modelID + " model-loaded for CLOUDMARKER " + this.data.name + " type " + this.data.markerType);
        if (this.data.markerType != "object") {

          if (this.data.modelID && this.data.modelID != '' & this.data.modelID != 'none') {
            
            this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"mesh", scaleFactor: this.data.scale});
            let clips = obj.animations;
            console.log(this.data.name + " animation-mixer tryna play clips x " + clips.length);
            if (clips != null && clips.length) { 
              this.el.setAttribute('animation-mixer', {
                "clip": clips[Math.floor(Math.random()*clips.length)].name,
                "loop": "repeat",
              });
            }
          } else {
            if (this.data.tags.includes("physics")) {
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
        }
        if (this.data.markerType.toLowerCase().includes("picture")) {
          this.loadPicture();
         }
        // if (this.data.tags.includes("hide gizmo") || (settings && settings.hideGizmos)) {
        //   if (this.data.markerType != "mailbox" && this.data.markerType != "light") {
        //     console.log(this.data.markerType + " hiding gizmos because");
        //     this.el.object3D.visible = false;
        //   }
        // }

      });
       
      this.el.addEventListener('mouseenter', (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        if (this.data.tags && this.data.tags.toLowerCase().includes("no select")) {
          return;
        }
        // if (this.data.markerType == "spawn") {
        //   if (this.data.tags)
        //   this.el.classList.remove("activeObjexRay"); //don't block the spawned object!
        // }
        // if (this.data.markerType == "dataviz") {

        // }
        // this.targetMods();
        if (evt.detail.intersection) {
          this.clientX = evt.clientX;
          this.clientY = evt.clientY;
          console.log("mousenter cloudmarker " +  this.data.markerType + " " + this.data.name + " " + this.data.tags);
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
            // if (this.distance < 300) {
            this.calloutEntity.setAttribute("position", pos);
            this.calloutEntity.setAttribute('visible', true);
            this.calloutEntity.setAttribute('scale', {x: this.distance * .25, y: this.distance * .25, z: this.distance * .25} );
              
            // if (this.data.tags && this.data.tags.toLowerCase().includes("description")) {
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
          if (this.data.markerType == "gate" && !this.data.tags.includes("no prompt")) {
            if (evt.detail.intersection && evt.detail.intersection.distance > 1 && evt.detail.intersection.distance < 20) {
            this.dialogEl = document.getElementById('mod_dialog');
            if (this.dialogEl) {
              if (that.data.eventData && that.data.eventData.length > 2) {
                let url = "/webxr/" + that.data.eventData;
                this.dialogEl.components.mod_dialog.showPanel("Enter " + this.data.name + " ?", "href~"+ url, "gatePass", 5000 );
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

          if (this.data.markerType == "audio") {
            if (primaryAudioMangler != null) {
              primaryAudioMangler.playPauseToggle();
            }
          }
          if (this.data.markerType == "trigger" && this.data.tags.includes("click only")) { //like a "button"
            this.targetMods();
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
      if (this.data.hasSpawned && !this.data.tags.includes("multi")) {
        return;
      }
      this.data.hasSpawned = true;
      console.log("tryna load object id " + this.data.objectID);
      if (!objectID) {
        objectID = this.data.objectID;
      }
      this.el.classList.remove("activeObjexRay");
      console.log("tryna load object id " + objectID);
      if (objectID != undefined && objectID != null & objectID != "none" && objectID != "") {  
       
            
            let objexEl = document.getElementById('sceneObjects');    
            if (objexEl) { 
              this.objectData = objexEl.components.mod_objex.returnObjectData(objectID);
              if (this.objectData) {
                console.log("gots objectdata for " + this.objectData.name);
                // let position = that.el.getAttribute("position");
                this.locData = {};

                this.locData.x = this.data.xpos;
                this.locData.y = this.data.ypos;
                this.locData.z = this.data.zpos;

                this.locData.eulerx = this.data.xrot;
                this.locData.eulery = this.data.yrot;
                this.locData.eulerz = this.data.zrot;
                this.locData.timestamp = this.data.timestamp;
                
                let objEl = document.createElement("a-entity");
                
                objEl.setAttribute("mod_object", {'locationData': this.locData, 'objectData': this.objectData});
                objEl.id = Date.now();
                sceneEl.appendChild(objEl);


              }
            }
        //   }
        // }
      } 
    },
    remove: function () {
        console.log("removing something!");
    },

    loadLocalFile: function () { //change to loadLocalModel...
      if (this.data.modelID && this.data.modelID != "none") {
        console.log("really tryna loadLocalFile " + this.data.modelID);
        this.loadModel();
      } else if (this.data.mediaID && this.data.mediaID != "none") {
        this.loadMedia();
      }
    },
    //when there's a local change
    updateAndLoad: function (name, description, tags, eventData, markerType, scale, xpos, ypos, zpos, xrot, yrot, zrot, xscale, yscale, zscale, modelID, objectID, mediaID, targetElements) {
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
        this.data.mediaID = mediaID
        this.data.targetElements = targetElements;
        // console.log("tryna scale to " + xscale + " " + yscale+ " " + zscale);
        console.log("cloudmarker updateAndLoad tags " + this.data.tags + " markertype " + markerType + " mediaID " + mediaID + " modelID " + modelID);
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
        if (this.data.tags && this.data.tags.toLowerCase().includes("curve point") || this.data.markerType == "curve point") {
          this.el.classList.add("curvepoint");
        }
       
    },
    updateMaterials: function () {
      if (this.data.tags && this.data.tags.includes("color")) {
        this.el.setAttribute("material", {color: this.data.eventData.toLowerCase(), transparent: true, opacity: .5});
      } else if (this.data.modelID && this.data.modelID.toLowerCase().includes("primitive")) {
        // this.el.removeAttribute("material");
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
        
        }else if (this.data.markerType.toLowerCase() == "trigger") {
          // this.el.setAttribute("material", {color: "lime", transparent: true, opacity: .5});
          this.el.setAttribute("material", {color: "LightSalmon", transparent: true, opacity: .5});
        } else if (this.data.markerType.toLowerCase() == "object") {
          this.el.setAttribute("material", {color: "tomato", transparent: true, opacity: .5});
        } else if (this.data.markerType.toLowerCase() == "collider") {

            this.el.setAttribute("material", {color: "firebrick", transparent: true, opacity: .5});
            
            
          
        } else if (this.data.markerType.toLowerCase() == "gate") {
          this.el.setAttribute("material", {color: "orange", transparent: true, opacity: .5});
        } else if (this.data.markerType.toLowerCase() == "light") {
          this.el.setAttribute("material", {color: "yellow", wireframe: true, transparent: true, opacity: .5});
        } else if (this.data.markerType.toLowerCase() == "portal") {
            
        } else if (this.data.markerType.toLowerCase() == "curve point") {
          this.el.setAttribute("material", {color: "blue", transparent: true, opacity: .5});
        } else if (this.data.markerType.toLowerCase() == "audio") {
          this.el.setAttribute("material", {color: "blue", transparent: true, opacity: .5});
        } else {

        }
      }
      if (this.data.tags && this.data.tags.includes("webcam")) {
        console.log("tryna set webcam material");;
        this.loadWebcam();
        this.el.setAttribute("material", {src: '#webcam'});
      }
    },
    loadWebcam: function () {
      navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        if (devices.length) {
          devices.forEach((device) => {
            console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
          });
          navigator.mediaDevices.getUserMedia({audio: false, video: true})
          .then(stream => {
            let $video = document.querySelector('video');
            $video.srcObject = stream
            $video.onloadedmetadata = () => {
              $video.play()
              
            }
          })
        } else {
          console.log("no devices found!");
        }
       
      })
      .catch((err) => {
        console.error(`${err.name}: ${err.message}`);
      });

     
    },
    loadPicture: function () { //called from model-loaded event
      // if (!mediaID) {
      //   mediaID = this.data.mediaID;
      // }
      // if (this.data.markerType == "picture") {

        console.log("mediaID " + this.data.mediaID);
        if (this.data.tags.includes("webcam")) {
          this.loadWebcam();
          console.log("tryna set webcam material");
          this.el.setAttribute("material", {src: '#webcam'});
        } else if (this.data.mediaID && this.data.mediaID.includes("local_")) {
          this.el.classList.add("hasLocalFile");
          let mediaID = this.data.mediaID.substring(6);
          console.log("CLOUDMARKER SHOUDL HAVE MediaID " + mediaID + " from localFiles " + localData.localFiles[mediaID]);
          for (const key in localData.localFiles) {
            console.log("tryna get localMedia named " + mediaID + " vs " + localData.localFiles[key].name);
            if (localData.localFiles[key].name == mediaID) {
              
              const picBuffer = localData.localFiles[key].data;
              const picBlob = new Blob([picBuffer]);
              picUrl = URL.createObjectURL(picBlob);
              let obj = this.el.getObject3D('mesh');
              
              var texture = new THREE.TextureLoader().load(picUrl);
              texture.colorSpace = THREE.SRGBColorSpace;
              // UVs use the convention that (0, 0) corresponds to the upper left corner of a texture.
              texture.flipY = false; 
              // immediately use the texture for material creation
              var material = new THREE.MeshStandardMaterial( { map: texture, transparent: false, envMapIntensity: .1 } );  
              // Go over the submeshes and modify materials we want.
              material.needsUpdate = true;
              if (obj) {
                  obj.traverse(node => {
                  node.material = material;
                });
              }
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
        if (mediaID != undefined && mediaID != null && mediaID.includes("local_")) { //local pics, stored in indexDB
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
      // this.el.setAttribute("scale", this.data.xscale + " " + this.data.yscale + " " + this.data.zscale);
      this.el.object3D.scale.set(this.data.xscale, this.data.yscale, this.data.zscale);
      // }
    },
    removeModel: function () {
      this.el.removeObject3D('mesh');
    },
    loadModel: function (modelID) {
        
        if (!modelID) {
          modelID = this.data.modelID;
        }
        console.log(this.data.name + " tryna load cloudmarker model " + modelID + " tags " + this.data.tags);
        let transform_controls_component = this.el.components.transform_controls;
        if (transform_controls_component) {
            if (transform_controls_component.data.isAttached) {
                transform_controls_component.detachTransformControls();
            }
        }

        this.el.classList.remove("waypoint");
        this.el.removeAttribute("transform_controls");
        // 
        // this.el.removeAttribute("gltf-model");

        this.el.removeAttribute("mod_object");
        this.el.removeAttribute("mod_particles");

        this.el.removeAttribute("light");
        this.el.removeAttribute("material");
        // this.el.removeAttribute("obb-collider");
        // this.removeModel();
        if (this.data.markerType == "collider") {
          this.data.modelID = "primitive_cube";
        } 
        // if (this.data.markerType == "collider") {
        //   this.data.modelID = "primitive_cube";
        // } 
        let clips = this.el.object3D.animations;
        console.log(this.data.name + " tryna play animation-mixer x " + clips.length);
        if (clips != null && clips.length) { 
          this.el.removeAttribute("animation-mixer");
          this.el.setAttribute('animation-mixer', {
            "clip": clips[Math.floor(Math.random()*clips.length)].name,
            "loop": "repeat",
          });
        }
        if (modelID != undefined && modelID != null & modelID != "none" && modelID != "") {  
          // this.el.setAttribute("scale", this.data.xscale + " " + this.data.yscale + " " + this.data.zscale);

          if (modelID.toString().includes("primitive")) {
            this.el.removeAttribute("geometry");
            this.el.removeAttribute("gltf-model");


            // if (this.data.tags && this.data.tags.includes("hide gizmo")) {
            //   this.el.classList.remove("activeObjexRay");
            // } else {
              if (modelID.toString().includes("cube")) {
                  this.el.setAttribute("geometry", {"primitive": "box", "width": this.data.xscale, "height": this.data.yscale, "depth": this.data.zscale});
                  console.log("CLOUDMARKER PRIMITIVE box " + modelID +" scale " + this.data.xscale * 1.5 + " " + this.data.yscale  * 1.5+ " " + this.data.zscale * 1.5);
                  // this.el.setAttribute("obb-collider", {size: this.data.xscale * 1.5 + " " + this.data.yscale  * 1.5+ " " + this.data.zscale * 1.5});
                  
              } else if (modelID.toString().includes("sphere")) {
                  this.el.setAttribute("geometry", {"primitive": "sphere", "radius": 1});
                  console.log("CLOUDMARKER PRIMITIVE sphere " + modelID +" scale " + this.data.xscale + " " + this.data.yscale + " " + this.data.zscale);
              } else if (modelID.toString().includes("cylinder")) {
                  this.el.setAttribute("geometry", {"primitive": "cylinder", "height": 1, "radius": 1 / 2});
                  console.log("CLOUDMARKER PRIMITIVE cylinder " + modelID +" scale " + this.data.xscale + " " + this.data.yscale + " " + this.data.zscale);
              } else {
  
              }
              console.log("loaded cloudmarker primitive geometry " + modelID);
            // }

            if (this.data.markerType.toLowerCase() == "placeholder") {
                this.el.setAttribute("material", {color: "yellow", transparent: true, opacity: .5});
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
            } else if (this.data.markerType == "trigger") {
              this.el.setAttribute("material", {color: "LightSalmon", transparent: true, opacity: .5});
              this.el.setAttribute("obb-collider");
          
            } else if (this.data.markerType.toLowerCase().includes("collider")) {
              this.el.setAttribute("material", {color: "firebrick", transparent: true, opacity: .5});
              this.el.setAttribute("mod_physics", {body: "static", isTrigger: false, model:"collider", scaleFactor: this.data.scale});
        
            } else if (this.data.markerType.toLowerCase() == "gate") {
                this.el.setAttribute("material", {color: "orange", transparent: true, opacity: .5});
                // this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder"});
                this.el.setAttribute("obb-collider", {size: this.data.xscale * 1.5 + " " + this.data.yscale * 1.5 + " " + this.data.zscale * 1.5});
                // this.el.setAttribute("color", "orange");
            } else if (this.data.markerType.toLowerCase() == "portal") {
              this.el.setAttribute("obb-collider", {size: this.data.xscale * 1.5 + " " + this.data.yscale * 1.5 + " " + this.data.zscale * 1.5});
            } else if (this.data.markerType.toLowerCase() == "audio") {
              if (this.primaryAudioMangler) {
                this.primaryAudioMangler.hideDefault();
              }
              
              // if (!this.data.tags.includes("hide")) {
              //   this.radius = this.data.xscale * .05;
              //   this.el.setAttribute("geometry", {"primitive": "sphere", "radius": this.radius});
              //   this.el.setAttribute("material", {color: color1, wireframe: true});
              // }
            } else {

            }
            
            if (this.data.tags && this.data.tags.includes("hide gizmo") || (settings && settings.hideGizmos)) {
              if (this.data.markerType != "mailbox" && this.data.markerType != "light") {
                this.el.object3D.visible = false;
                this.el.setAttribute("visible", false);
                console.log("hiding " + this.data.name + " because....");
              }
            }
            if (this.data.markerType == "navmesh" || this.data.markerType == "surface") {
              if (this.data.tags.includes("show")) {
                this.el.object3D.visible = true;
              } else {
                this.el.object3D.visible = false;
              }
            }
            // this.el.setAttribute("scale", this.data.xscale + " " + this.data.yscale + " " + this.data.zscale);
            // this.el.object3D.scale.set(this.data.xscale, this.data.yscale, this.data.zscale);

            if (this.data.tags && !this.data.tags.includes("no pos")) {
              this.el.object3D.position.set(this.data.xpos, this.data.ypos, this.data.zpos);
            }
            
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
                      this.el.setAttribute("obb-collider", {size: this.data.xscale * 1.5 + " " + this.data.yscale * 1.5 + " " + this.data.zscale * 1.5});
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
            if ((this.data.tags && !this.data.tags.includes("hide gizmo")) || (settings && !settings.hideGizmos)) {
                // if (this.data.markerType != "mailbox" && this.data.markerType != "light"  && this.data.markerType != "gate") {
                  if (this.data.markerType.toLowerCase() == "player") {
                    this.el.removeAttribute("geometry");
                    this.el.setAttribute('gltf-model', '#poi1');
                    this.el.setAttribute("material", {color: "lime", transparent: true, opacity: .5});
                  }
                  if (this.data.markerType.toLowerCase() == "placeholder") {
                      this.el.setAttribute("gltf-model", "#poi1");
                      this.el.setAttribute("material", {color: "yellow", transparent: true, opacity: .5});
                      
                  } else if (this.data.markerType.toLowerCase() == "poi") {
                      this.el.setAttribute("gltf-model", "#poi1");
                      this.el.setAttribute("material", {color: "purple", transparent: true, opacity: .5});
                      // this.el.setAttribute("color", "purple");
                  } else if (this.data.markerType.toLowerCase() == "waypoint") {
                    // if (settings && !settings.hideGizmos) {
                      this.el.setAttribute("gltf-model", "#poi1");
                      this.el.setAttribute("material", {color: "green", transparent: true, opacity: .5});
                    // }
                      // this.el.setAttribute("color", "purple");
                  } else if (this.data.markerType.toLowerCase() == "curve point") {
                    this.el.setAttribute("gltf-model", "#poi1");
                    this.el.setAttribute("material", {color: "blue", transparent: true, opacity: .5});
                  } else if (this.data.markerType.toLowerCase ==  "trigger") {
                    // this.el.setAttribute("gltf-model", "#poi1");
                    this.el.setAttribute("obb-collider", {size: '1 1 1'});
                    this.el.setAttribute("material", {color: "LightSalmon", transparent: true, opacity: .5});
                    // this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: this.data.scale});
                    
                  } else if (this.data.markerType.toLowerCase().includes("object")) {
                      this.el.setAttribute("gltf-model", "#poi1");
                      this.el.setAttribute("material", {color: "salmon", transparent: true, opacity: .5});
                                      
                  } else if (this.data.markerType.toLowerCase() == "gate") {
                      console.log("tryna set gate gltf model on cloudmarker " + '[id='+ this.el.id + ']');
                      this.el.setAttribute("gltf-model", "#gate2");
                      this.el.setAttribute("material", {color: "orange", transparent: true, opacity: .5});
                      // this.el.setAttribute("mod_physics", {body: "kinematic", isTrigger: true, model:"placeholder", scaleFactor: this.data.scale});
                      this.el.setAttribute("obb-collider", {"centerModel": false, "size": this.data.xscale * 3 + " " + this.data.yscale * 5 + " " + this.data.zscale * 3});
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
                  }
                } 
              }
              
              if (this.data.markerType.toLowerCase() == "mailbox") {
                  this.el.setAttribute("gltf-model", "#mailbox");
              } else if (this.data.markerType == "3D text") {
                  console.log("tryna set 3D text!");
                  this.el.setAttribute("text-geometry", {value: this.data.description, font: '#optimerBoldFont'});
              } 
            // }
          if (this.data.markerType == "light") {
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
              if (!this.data.tags.includes("hide")) {
                this.radius = this.data.xscale * .05;
                this.el.setAttribute("geometry", {"primitive": "sphere", "radius": this.radius});
                this.el.setAttribute("material", {color: color1, wireframe: true});
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
              if (this.data.tags.includes("hide") || (settings && settings.hideGizmos)) {
                // if (this.data.markerType != "mailbox" && this.data.markerType != "light") {
                  this.el.object3D.visible = false;
                // }
                // this.el.removeAttribute("geometry");
              } else {
                this.el.object3D.visible = true;
              }    
          }
         

          if (this.data.tags && this.data.tags.includes("hide gizmo") ||  this.data.tags.includes("highlight") || (settings && settings.hideGizmos)) {
            if (this.data.markerType != "mailbox" && this.data.markerType != "light") {
              console.log("tryna hide gizmo 2");
              this.el.object3D.visible = false;
            }
            // this.el.classList.remove("activeObjexRay");
          }
          if (this.data.markerType == "navmesh"  || this.data.markerType == "surface" ) {
            if (!this.data.tags.includes("show")) {
              this.el.object3D.visible = false;
            } 
          }
        // }
        this.updateMaterials();

        // this.el.setAttribute("scale", this.data.xscale + " " + this.data.yscale + " " + this.data.zscale);
        this.el.object3D.scale.set(this.data.xscale, this.data.yscale, this.data.zscale);
        if (this.data.tags && !this.data.tags.includes("no pos")) { //eg use layout
          this.el.object3D.position.set(this.data.xpos, this.data.ypos, this.data.zpos);
        }
        this.el.setAttribute("rotation", this.data.xrot + " " + this.data.yrot + " " +this.data.zrot);


        
        this.el.object3D.updateMatrix(); 


        // if (this.data.tags && this.data.tags.includes("hide gizmo") || (settings && settings.hideGizmos)) {
        //   if (this.data.markerType != "mailbox" && this.data.markerType != "light") {
        //     this.el.object3D.visible = false;
        //   }
        //   this.el.classList.remove("activeObjexRay");
        // }
        if (this.data.markerType == "navmesh" || this.data.markerType == "surface") {
          if (!this.data.tags.includes("show")) {
            this.el.object3D.visible = false;
          } 
        } else {
          this.el.object3D.visible = true;
        }
        // let clips = this.el.object3D.animations;
        // if (clips != null && clips.length) { 
        //   console.log(this.data.name + " tryna play animation-mixer x " + clips.length);
        //   this.el.setAttribute('animation-mixer', {
        //     "clip": clips[Math.floor(Math.random()*clips.length)].name,
        //     "loop": "repeat",
        //   });
        // }

    },
    deselect: function () {
      this.isSelected = false;
      console.log("cloudmarker this.isSelected " + this.isSelected);
    },
    obbHit: function (evt) {
      console.log("obbHit!! " + evt.detail.withEl );
    },
    playerTriggerHit: function () { //this uses AABB collider//nope, all physics now...//nope, either obb or physics, depending
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
    coolDownTimer: function () {
      // if (!this.coolDown) {
      //   this.coolDown = true;
        
        setTimeout( () => {
          this.coolDown = false;
          // this.calloutText.setAttribute("troika-text", {
          //   value: "",
          // });
        }, 2000);
      // }
    },
    targetMods: function() {
      
      if (this.data.targetElements && this.data.targetElements != undefined && this.data.targetElements != '' && this.data.targetElements != []) {
        console.log("chek targetElements " + this.data.targetElements);
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
          console.log( "tryna show target..." + this.data.targetElements + " length"); 
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
          
          console.log( "tryna hide target..." + this.data.targetElements + " length"); 
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
          
          console.log( "tryna swawn target " + this.data.targetElements); 
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
    rayhit: function (hitID, distance, hitpoint) {
      // if (this.hitID != hitID) {
      //   this.hitID = hitID;
        // console.log("new hit " + hitID + " " + distance + " " + JSON.stringify(hitpoint));
        if (!window.playerPosition) {
          return;
        }
        distance = window.playerPosition.distanceTo(hitpoint);
        console.log("cloudmarker hit " + hitID + " " + distance + " " + JSON.stringify(hitpoint));
        if (this.data.tags && this.data.tags.length && !this.data.tags.toLowerCase().includes("no trigger")) {
          // console.log("gotsa audio trigger hit");
          var triggerAudioControllerEl = document.getElementById("triggerAudio");
          
          if (triggerAudioControllerEl != null) {
            // console.log("gotsa audio trigger controller el");
            let triggerAudioController = triggerAudioControllerEl.components.trigger_audio_control;
            if (triggerAudioController  != null) {
              // console.log("gotsa audio trigger controller " + distance);
              // let triggertags = this.data.tags != null && this.data.tags != "" ? this.data.tags : "click";
              triggerAudioController.playAudioAtPosition(hitpoint, distance, this.data.tags);
            }
           
          }
        if (this.data.markerType != "portal" && !this.data.tags.includes("click only")) { //portal needs playertriggerhit, not just mouseenter
          this.targetMods();
        }
        }
        
      }
  
  }); //////// end cloud_marker /////////////////////
  
  