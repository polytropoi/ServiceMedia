
////////////////////////// - MOD_MODEL - for "plain" models, these are written (elements + components + props) by the server into response as a-assets, as opposed to "Objects", see mod_objex.js
AFRAME.registerComponent('mod_model', {
    schema: {
        markerType: {default: "none"},
        eventData: {default: ''},
        shader: {default: ''},
        color: {default: ''},
        tags: {default: null},
        description: {default: ''}
        
      },
      init: function () {
        
        let textData = [];
        let moIndex = -1;
        let idleIndex = -1;
        let danceIndex = -1;
        let walkIndex = -1;
        let runIndex = -1;
        let clips = null;
        let danceClips = [];
        let idleClips = [];
        let walkClips = [];
        let mouthClips = [];
  
        this.walkClips = walkClips;
        this.danceClips = danceClips;
        this.idleClips = idleClips;
        // this.walkClips = [];
        this.mouthClips = mouthClips;
        
        let mixer = null;
        let camera = null;
        let picGroupArray = ""; //maybe pic gallery should be an different component, or part of pic group control?
        let pictexture = null;
        let picmaterial = null;
        let spics = [];
        let spicsIndex = 0;
        let hpics = [];
        let hpicsIndex = 0;
        let vpics = [];
        let vpicsIndex = 0;
        let svids = [];
        let svidsIndex = 0;
        let hvids = [];
        let hvidsIndex = 0;
        let evids = []; //equirect/skybox
        let evidsIndex = 0;
  
        let vvids = [];
        let audios = [];
        let vvidsIndex = 0;
  
        let colliders = [];
        this.sceneEl = document.querySelector('a-scene');
        let oScale = 1;
        this.shaderMaterial = null;
        this.hasUniforms = false;
        this.start = Date.now();
        // console.log("oScale of model::: " + oScale);
        this.tick = AFRAME.utils.throttleTick(this.tick, 50, this);
        this.triggerAudioController = document.getElementById("triggerAudio");
        this.hasTrigger = false;
        this.triggerObject = null;
        this.hasAudioTrigger = false;
        this.particlesEl = null;
        this.hasCallout = false; //i.e. child mesh name(s) have appended "~callout" 
        this.hasLocationCallout = false; //i.e. "callout" in location.eventData
        this.hasCalloutBackground = false;
        
        this.calloutString = "";
        this.hitpoint = null;
        console.log("MOD MODEL eventData : " + this.data.eventData);
        this.hitpoint = new THREE.Vector3();
        this.tags = this.data.tags;
        this.font1 = "Acme.woff";
        this.font2 = "Acme.woff";
        
        if (settings && settings.sceneFontWeb1) {
          this.font1 = settings.sceneFontWeb1;
        }
        if (settings && settings.sceneFontWeb1) {
          this.font2 = settings.sceneFontWeb2;
        }
        if (this.data.shader != '') {
  
  
          // setShader(this.data.shader);
          this.setShader(); //at the bottom
        }      
  
        if (this.data.eventData.length > 1) {
          // console.log("model eventData " + JSON.stringify(this.data.eventData));
          textData = this.data.eventData.split("~");//tilde delimiter splits string to array//maybe use description for text instead? 
  
        }
        if (JSON.stringify(this.data.eventData).includes("beat")) {
          console.log ("adding class beatmee");
          this.el.classList.add("beatme");
          // this.el.addEventListener('beatme', e => console.log("beat" + e.detail.volume()));
          
        }
  
  
        this.el.addEventListener('beatme', e => console.log("beat"));
        this.isInitialized = false; //to prevent model-loaded from retriggering when childrens are added to this parent
  
        if (this.data.eventData) {
          if (this.data.eventData.toLowerCase().includes("billboard")) {
            if (this.data.eventData.toLowerCase().includes("yonly")) {
              console.log("tryna set billboard yonly");
              this.el.setAttribute("look-at-y", "#player");
  
              
            } else {
               
              // this.el.setAttribute("look-at", "#player");
              if (settings && settings.sceneCameraMode == "Third Person") {
                this.el.setAttribute("look-at", "#thirdPersonCamera");
              } else {
                this.el.setAttribute("look-at", "#player");
              }
            }
          
          }
        }
  
        ///////////////////////////////////////////////// model loaded event start /////////////////////////////
  
        ///////////////////////////////////////////////////////// -listeners......
                
        this.el.addEventListener('model-loaded', () => { // - model-loaded
        if (!this.isInitialized) {
  
  
          if (this.data.eventData.includes("physics")) {
            if (settings.usePhysicsType == "ammo") {
              if (this.data.eventData.includes("static")) {
              // this.el.object3D.visible = false;
              // console.log("GOTSA SCATTER OBJEK@");
                // this.el.setAttribute("mod_physics", {body: "static", shape: })
  
                this.el.setAttribute('ammo-body', {type: "static"});
                if (this.data.eventData.includes("box")) {
                  this.el.setAttribute('ammo-shape', {type: "box"});
                } else if  (this.data.eventData.includes("sphere")) {
                  this.el.setAttribute('ammo-shape', {type: "sphere"});
                } else {
                  this.el.setAttribute('ammo-shape', {type: "mesh"});
                }
              } else if (this.data.eventData.includes("dynamic")) {
  
              }
            } else if (settings.usePhysicsType == "cannon") {
              
                if (this.data.eventData.includes("static")) {
                  this.el.setAttribute("static-body", {"shape": "auto"});
                } else if (this.data.eventData.includes("dynamic")){
                  console.log("tryna set  "+settings.usePhysicsType+"  physics " + this.data.eventData);
                  this.el.setAttribute("dynamic-body", {"shape": "box"});
                }
            } else if (settings.usePhysicsType == "physx") { 
              console.log("tryna set  "+settings.usePhysicsType+"  physics " + this.data.eventData);
              if (this.data.eventData.includes("static")) {
                this.el.setAttribute("physx-body", {"type":"static", "shape": "mesh"});
              } else if (this.data.eventData.includes("dynamic")){
                this.el.setAttribute("physx-body", {"type":"dynamic", "shape": "mesh"});
              }
            }
          }
          if (this.data.eventData.toLowerCase().includes("ground")) { 
            // groundMod = "static-body=\x22shape: auto;\x22"; //no, it needs to wait for model-loaded
            if (settings.usePhysicsType == "cannon") {
              console.log("tryna useSuperHands and set the ground static-body");
              this.el.setAttribute("static-body", {'shape': 'auto'});
              // let testCubeEl = document.createElement("a-entity");
              
              // testCubeEl.setAttribute('mixin', 'cube');
              // testCubeEl.setAttribute('position', '1, 10, .5');
              // testCubeEl.setAttribute('material', {'color': 'purple'});
              // this.el.sceneEl.appendChild(testCubeEl);
              // <a-entity class="cube" mixin="cube" position="1 5.265 -0.5" material="color: green"></a-entity>
            }
          } 
          if (this.data.eventData.toLowerCase().includes("navmesh")) { //no, this is set on the server ~line 2586
            // groundMod = "static-body=\x22shape: auto;\x22"; //no, it needs to wait for model-loaded
            if (settings.useNavmesh) {
              
            }
          }
          if (this.data.eventData.toLowerCase().includes("agent")) { 
            if (settings.useNavmesh) {
              this.el.setAttribute("nav-agent", "");
              this.el.setAttribute("nav_agent_controller", "");  
              this.el.setAttribute("mod_physics", {'model': 'agent', 'isTrigger': true});
            }
          }
          if (this.data.eventData.includes("scatter")) {
            this.el.object3D.visible = false;
            // console.log("GOTSA SCATTER OBJEK@");
  
          }
          if (this.data.eventData.includes("pickup")) { //USING PHYSX, needs useStarterKit = true!
            this.el.setAttribute("data-pick-up");
            
            if (this.data.eventData.includes("magnet") || this.data.eventData.includes("snap")) {
              this.el.classList.add("magnet-left");
              this.el.classList.add("magnet-right");
            }
          }
  
          
          // this.oScale = oScale;
          this.bubble = null;
          this.bubbleText = null;
          this.isInitialized = true;
          this.meshChildren = [];
          let theEl = this.el;
          const obj = this.el.getObject3D('mesh');
          
  
          if (obj) {
            if (this.data.shader != "") {
              console.log("gotsa shader " + this.data.shader);
             
              this.recursivelySetChildrenShader(obj);
  
            }
          // let dynSkybox = document.getElementById('')
            for (let e = 0; e < textData.length; e++) {
              if (textData[e].toLowerCase().includes("refract")){
                console.log("tryna set refraction");
                obj.material.refractionRatio = .9;
                obj.material.reflectivity = .5;
              }
            }
            if (this.data.eventData.toLowerCase().includes("target")) {
              this.el.id = "target_object"; //hrm, physics doesn't like
            }
            if (this.data.eventData.toLowerCase().includes("spawn")) {
              this.el.classList.add("spawn");
            }             
            if (this.data.eventData.toLowerCase().includes("transparent")) {
              console.log("tryna set transparent");
              obj.visible = false;
            }
            if (this.data.eventData.toLowerCase().includes("particle")) {
              console.log("tryna spawn a particle!");
              this.el.setAttribute('mod_particles', {type: 'fireball'});
            }
            if (this.data.eventData.toLowerCase().includes("fireworks")) {
              console.log("tryna spawn fireworks!");
              this.el.setAttribute('fireworks_spawner', {type: 'fireball'});
            }
            if (this.data.eventData.toLowerCase().includes("audiotrigger")) {
              // console.log("gotsa audiotrigg3re!");
              // this.el.setAttribute('fireworks_spawner', {type: 'fireball'});
              this.hasAudioTrigger = true;
            }
            
            if (this.data.eventData.toLowerCase().includes("target")) {
                this.particlesEl = document.createElement("a-entity");
                this.el.sceneEl.appendChild(this.particlesEl); //hrm...
                this.el.classList.add("target");
                this.el.classList.remove("activeObjexRay");
            }
            if (this.data.eventData.toLowerCase().includes("callout") && this.data.description && this.data.description != "") {
              // this.el.setAttribute("entity-callout", {'calloutString': this.data.description});
              this.hasLocationCallout = true;
              this.hasCallout = true;
            }
  
  
            this.el.addEventListener('raycaster-intersected', e =>{  // raycaster-intersected
              this.raycaster = e.detail.el;
              // that.raycaster = this.raycaster;
              // this.intersection = this.raycaster.components.raycaster.getIntersection(this.el);
              // if (this.intersection.point) {
              //   // console.log("intersection " + JSON.stringify(this.intersection.point));
              //   this.hitpoint.x = this.intersection.point.x.toFixed(2);
              //   this.hitpoint.y = this.intersection.point.y.toFixed(2);
              //   this.hitpoint.z = this.intersection.point.z.toFixed(2);
              //   this.rayhit(this.hitpoint);
              // }
              // console.log("raycaster "+ e.detail.el.id +" mod_model target hit " + this.el.id + " with tags " + this.data.tags);
              if (this.raycaster) {
                this.intersection = this.raycaster.components.raycaster.getIntersection(this.el);
                if (!this.intersection) { 
                    return; 
                  } else {
                    if (this.intersection.point) {
                      this.hitpoint = this.intersection.point;
                      // console.log("intersection " + JSON.stringify(this.intersection.point));
                      // this.hitpoint.x = this.intersection.point.x.toFixed(2);
                      // this.hitpoint.y = this.intersection.point.y.toFixed(2);
                      // this.hitpoint.z = this.intersection.point.z.toFixed(2);
                      // this.rayhit(this.intersection.point);
                      if (window.playerPosition) {
                        this.distance = window.playerPosition.distanceTo( this.intersection.point );
                      } else {
                        this.distance = 5;
                        console.log("setting distance to 5");
                      }
                     
                      // this.hitpoint = this.intersection[0].point;
                      this.rayhit( e.detail.el.id, this.distance, this.intersection.point ); 
                    }
                  }
                // console.log(intersection.point);
                }
              });
              this.el.addEventListener("raycaster-intersected-cleared", () => {
                  this.raycaster = null;
                  // this.killParticles();
              });
            // }
  
            let worldPos = null;
            let hasAnims = false;
            let hasPicPositions = false;
            let hasVidPositions = false;
            let hasAudioPositions = false;
            camera = AFRAME.scenes[0].camera; 
            mixer = new THREE.AnimationMixer( obj );
            clips = obj.animations;
  
            if (clips != null) { 
              for (i = 0; i < clips.length; i++) { //get reference to all anims
                hasAnims = true;
                // console.log("model has animation: " + clips[i].name);
                
                if (clips[i].name.includes("mouthopen")) {
                  moIndex = i;
                  mouthClips.push(clips[i]);
                }
                // if (clips[i].name.includes("mouthopen")) {
                //   moIndex = i;
                // }
                if (clips[i].name.toLowerCase().includes("mixamo")) {
                  console.log("gotsa mixamo idle anim");
                  idleIndex = i;
                  idleClips.push(clips[i]);
                }
                if (clips[i].name.toLowerCase().includes("take 001")) {
                  idleIndex = i;
                  idleClips.push(clips[i]);
                }
                if (clips[i].name.toLowerCase().includes("idle")) {
                  idleIndex = i;
                  idleClips.push(clips[i]);
                }
                if (clips[i].name.toLowerCase().includes("walk")) {
                  walkIndex = i;
                  walkClips.push(clips[i]);
                  console.log("gotsa walk animation");
                }
                if (clips[i].name.toLowerCase().includes("dance")) { //etc..
                  danceIndex = i;
                  danceClips.push(clips[i]);
                }
                if (i == clips.length - 1) {
                    if (hasAnims) {
                      console.log("model has anims " + this.data.eventData + " idelIndex " + idleIndex);
                    // if (this.data.eventData.includes("loop_all_anims")) {
                    //   theEl.setAttribute('animation-mixer', {
                    //     "clip": clips[0].name,
                    //     "loop": "repeat",
                    //   });
                    // }
                    // if (this.data.eventData.includes("loop_dance_anims")) {
                    //   theEl.setAttribute('animation-mixer', {
                    //     "loop": "repeat",
                    //   });
                    // }
                    if (idleIndex != -1) {
                      theEl.setAttribute('animation-mixer', {
                        "clip": clips[idleIndex].name,
                        "loop": "repeat",
                      });
                    }
                  }
                }
              }
  
            }
            obj.traverse(node => { //spin through object heirarchy to sniff for special names, e.g. "eye"
              this.nodeName = node.name;
              if (this.nodeName.includes("collider")) { //must be set in eventData and as mesh name 
                if (node instanceof THREE.Mesh) {
                this.meshChildren.push(node);
                console.log("gotsa collider!");
                }
              }
              if (this.nodeName.includes("trigger")) { //must be set in eventData and as mesh name
                if (node instanceof THREE.Mesh) {
                this.meshChildren.push(node);
                console.log("gotsa trigger!");
                }
              }
              if (this.nodeName.includes("navmesh")) { //must be set in eventData and as mesh name (better to be external, though)
                if (node instanceof THREE.Mesh) {
                this.meshChildren.push(node);
                console.log("gotsa navmesh!");
                }
              }
              if (this.data.eventData.includes("eyelook") && this.nodeName.includes("eye")) { //must be set in eventData and as mesh name
                if (node instanceof THREE.Mesh) {
                this.meshChildren.push(node);
                console.log("gotsa eye!");
                }
              }
              if (this.nodeName.toLowerCase().includes("callout")) { //must be set in eventData and as mesh name
                if (node instanceof THREE.Mesh) {
                this.meshChildren.push(node);
  
                console.log("gotsa callout!");
                
                }
              }
              if (this.nodeName.toLowerCase().includes("hpic") || this.nodeName.toLowerCase().includes("vpic") || this.nodeName.toLowerCase().includes("spic") || this.nodeName.toLowerCase().includes("epic")) { 
                if (node instanceof THREE.Mesh) {
                  this.meshChildren.push(node);
                    hasPicPositions = true;
                  // console.log("gotsa picpanel!");
                  // console.log(this.nodeName);
                }
              }
              if (this.nodeName.toLowerCase().includes("hvid") || this.nodeName.toLowerCase().includes("vvid") || this.nodeName.toLowerCase().includes("svid")|| this.nodeName.toLowerCase().includes("evid")) { 
                // if (node instanceof THREE.Mesh) {
                  this.meshChildren.push(node);
                    hasVidPositions = true;
                  // console.log("gotsa picpanel!");
                  // console.log(this.nodeName);
                // }
              }
              if (this.nodeName.toLowerCase().includes("haudio") || this.nodeName.toLowerCase().includes("vaudio")) { 
                // if (node instanceof THREE.Mesh) {
                  this.meshChildren.push(node);
                    hasAudioPositions = true;
                  // console.log("gotsa picpanel!");
                  // console.log(this.nodeName);
                // }
              }
              if (this.data.markerType === "character") {
                // const vector = new THREE.Vector3();
                
                let skinnedMeshColliderEl = document.createElement("a-sphere"); //screw it, can't got the boundingbox fu to work...
                skinnedMeshColliderEl.setAttribute("scale", ".5 1 .5"); //todo pass in scale
                // skinnedMeshColliderEl.setObject3D(sphere);\
                skinnedMeshColliderEl.setAttribute("material", {"color": "purple", "transparent": true, "opacity": 0.1});
                skinnedMeshColliderEl.setAttribute("visible", false);
                // skinnedMeshColliderEl.setAttribute("opacity", "0.1");
                skinnedMeshColliderEl.classList.add("activeObjexRay");
                this.el.appendChild(skinnedMeshColliderEl);
                
                skinnedMeshColliderEl.setAttribute("position", "0 1 0"); //to do mod by scale
                // console.log("character node name " + node.name);
                if (node instanceof THREE.Mesh) {
                  // 
                  console.log("character node mesh name " + node.name);
                  // const box = new THREE.Box3();
                    node.frustumCulled = false;
                    
                }
                this.hasLocationCallout = true; //eg no background (thought or speech bubbgles)
  
              }
                
  
            });
            if (hasPicPositions) {
              let picGroupMangler = document.getElementById("pictureGroupsData");
              if (picGroupMangler != null && picGroupMangler != undefined) {
                // picGroupMangler.components.picture_groups_control.attach(this.meshChildren);
                picGroupArray = picGroupMangler.components.picture_groups_control.returnPictureData(); //it's an array of arrays
                // console.log("pic group zero length is " + picGroupArray[0].images.length);
                if (picGroupArray != null && picGroupArray.length > 0) {
                  for (let x = 0; x < picGroupArray[0].images.length; x++) { 
                    if (picGroupArray[0].images[x].orientation != undefined && picGroupArray[0].images[x].orientation != null && picGroupArray[0].images[x].orientation.toLowerCase() === "landscape") {
                      hpics.push(picGroupArray[0].images[x]);
                    } else if (picGroupArray[0].images[x].orientation != undefined && picGroupArray[0].images[x].orientation != null && picGroupArray[0].images[x].orientation.toLowerCase() === "portrait") {
                      vpics.push(picGroupArray[0].images[x]);
                    } else if (picGroupArray[0].images[x].orientation != undefined && picGroupArray[0].images[x].orientation != null && picGroupArray[0].images[x].orientation.toLowerCase() === "square") {
                      spics.push(picGroupArray[0].images[x]);
                    }
                  }
                }
                hpics = hpics.sort(() => Math.random() - 0.5);  //schweet
                vpics = vpics.sort(() => Math.random() - 0.5);  
              } else {
                console.log("caint fine no picture_groups_control");
              }
            }
            if (hasVidPositions) {
              let vidGroupMangler = document.getElementById("videoGroupsData");
              if (vidGroupMangler != null) {
                // picGroupMangler.components.picture_groups_control.attach(this.meshChildren);
                vidGroupArray = vidGroupMangler.components.video_groups_data.returnVideoData(); //it's an array of arrays
                console.log("vid group zero length is " + vidGroupArray[0].videos.length);
                for (let x = 0; x < vidGroupArray[0].videos.length; x++) {
                  if (vidGroupArray[0].videos[x].orientation != undefined && vidGroupArray[0].videos[x].orientation != null && vidGroupArray[0].videos[x].orientation.toLowerCase() === "landscape") {
                    hvids.push(vidGroupArray[0].videos[x]);
                  } else if (vidGroupArray[0].videos[x].orientation != undefined && vidGroupArray[0].videos[x].orientation != null && vidGroupArray[0].videos[x].orientation.toLowerCase() === "portrait") {
                    vvids.push(vidGroupArray[0].videos[x]);
                  } else if (vidGroupArray[0].videos[x].orientation != undefined && vidGroupArray[0].videos[x].orientation != null && vidGroupArray[0].videos[x].orientation.toLowerCase() === "square") {
                    svids.push(vidGroupArray[0].videos[x]);
                  } else if (vidGroupArray[0].videos[x].orientation != undefined && vidGroupArray[0].videos[x].orientation != null && vidGroupArray[0].videos[x].orientation.toLowerCase() === "equirectangular") {
                    evids.push(vidGroupArray[0].videos[x]);
                  }
  
                }
                hvids = hvids.sort(() => Math.random() - 0.5);  //schweet
                vvids = vvids.sort(() => Math.random() - 0.5);  
                svids = svids.sort(() => Math.random() - 0.5);  
                
              } else {
                console.log("caint fine no video_groups_control");
              }
            }
            if (hasAudioPositions) {
              let audioGroupMangler = document.getElementById("audioGroupsData");
              if (audioGroupMangler != null) {
                // picGroupMangler.components.picture_groups_control.attach(this.meshChildren);
                audioGroupArray = audioGroupMangler.components.audio_groups_data.returnAudioData(); //it's an array of arrays
                console.log("vid group zero length is " + audioGroupArray[0].audios.length);
                for (let x = 0; x < audioGroupArray[0].audios.length; x++) {
                  audios.push(audioGroupArray[0].audios[x]);
                }
                  // hvids = hvids.sort(() => Math.random() - 0.5);  //schweet
                  // vvids = vvids.sort(() => Math.random() - 0.5);  
              } else {
                console.log("caint fine no audioo_groups_control");
              }
            }
            for (i = 0; i < this.meshChildren.length; i++) { //apply mods to the special things
              console.log("gotsa special !! meshChild " + this.meshChildren[i].name);
              if (this.meshChildren[i].name.includes("trigger")) { 
                //ugh, nm
                  let child = this.el.object3D.getObjectByName(this.meshChildren[i].name, true);
                  child.visible = false;
                  // let triggerEl = document.createElement('a-entity');
                  // var targetPos = new THREE.Vector3();
                  // child.getWorldPosition(targetPos);
                  // this.child = child.clone();
                  // triggerEl.setObject3D("mesh", this.child);
                  // // let child = this.child.clone();
                  // // this.child.position(targetPos);
                  // // triggerEl.setObject3D("mesh", child.clone());
                  // // triggerEl.setObject3D("mesh", child);
                  // child.remove();
                  // // triggerEl.setAttribute('geometry', {primitive: 'box', width: 1});
                  // triggerEl.setAttribute('position', targetPos);
                  // console.log("gotsa special teryna set a trigger mesh..");
                  // triggerEl.setAttribute('mod_physics', {eventData: this.data.eventData, tags: this.data.tags, isTrigger: true});
                  // // triggerEl.classList.add('activeObjexRay');
                  // triggerEl.id = "TRIGGGER";
                  // this.sceneEl.appendChild(triggerEl);
                  // triggerEl.classList.add('trigger');
              }
              if (this.meshChildren[i].name.includes("navmesh")) {
                console.log("gotsa navmesh too!");
                // let child = this.meshChildren[i].clone();
                this.child = this.el.object3D.getObjectByName(this.meshChildren[i].name, true);
                this.child.visible = false; //just hide named navmesh, they're loaded externally... 
  
              } else if (this.meshChildren[i].name.includes("collider")) { //for models just assume this is static
                if (settings.usePhysicsType == "ammo") {
                  console.log("gotsa collider " + this.meshChildren[i].name);
                  this.el.object3D.updateMatrixWorld();
                  let child = this.el.object3D.getObjectByName(this.meshChildren[i].name, true);
                  if (child != null) { 
                    // let box = new THREE.Box3().setFromObject(child); //bounding box for position
                    // let center = new THREE.Vector3();
                    // box.getCenter(center); //get centerpoint of eye child geometry, in localspace
                    // child.geometry.center(); //reset pivot of eye geo
                    // child.position.set(0,0,0); //clear transforms so position below won't be offset
                    let childPos = new THREE.Vector3();
                    let childRot = new THREE.Quaternion();
  
                    child.getWorldPosition(childPos);
                    child.getWorldQuaternion(childRot);
                    // console.log("childPos " + JSON.stringify(childPos));
                    this.child = child.clone();
                    this.child.visible = false; 
                    this.child.position.set(childPos);
                    this.child.rotation.setFromQuaternion(childRot);
  
                    let colliderEl = document.createElement("a-entity");
                    colliderEl.setObject3D("mesh", this.child);
                    // colliderEl.setAttribute("look-at", "#player");
                    colliderEl.setAttribute("mod_physics", "body: static; shape: mesh; bounciness: 1; isTrigger: true; model: child");
                    colliderEl.id = this.meshChildren[i].name;
  
                    this.el.appendChild(colliderEl); //set as child of DOM heirarchy, not just parent model
  
                  }
                }
              
               
              } else if (this.meshChildren[i].name.includes("eye")) { //TODO need to add a component for this...
                console.log("gotsa eye too! " + this.meshChildren[i].name);
                // let child = this.el.object3D.getObjectByName(this.meshChildren[i].name, true);
                let child = this.el.object3D.getObjectByName(this.meshChildren[i].name);
                if (child != null) { 
                  let box = new THREE.Box3().setFromObject(child); //bounding box for position
                  let center = new THREE.Vector3();
                  box.getCenter(center); //get centerpoint of eye child geometry, in localspace
                  child.geometry.center(); //reset pivot of eye geo
                  child.position.set(0,0,0); //clear transforms so position below won't be offset
                  let theEye = document.createElement("a-entity");
                  theEye.setObject3D("Object3D", child);
                  
                  theEye.setAttribute("look-at", "#player");
                  
                  
                  this.el.appendChild(theEye); //set as child of DOM heirarchy, not just parent model
                  theEye.setAttribute("position", obj.worldToLocal(center)); //set position as local to 
                  // obj.updateMatrix();
                  // obj.updateMatrixWorld();
                }
              } else if(this.meshChildren[i].name.includes("callout")) {
               
                let child = this.el.object3D.getObjectByName(this.meshChildren[i].name, true);
                // console.log(child);
                this.hasCallout = true;
                if (child != null && child != undefined) { 
                  //
                  var calloutChild = document.createElement('a-entity');
                  calloutChild.classList.add("activeObjexRay");
                  calloutChild.setObject3D("Object3D", child);
                  this.calloutString = this.meshChildren[i].name.split("~")[0];
                  console.log("gotsa callout! " + this.calloutString);
                  // console.log("callout string is " + callout);
  
                  // calloutChild.addEventListener('model-loaded', () => {
                  // console.log("callout! " +callout);
                  calloutChild.setAttribute("model-callout", {'calloutString': this.calloutString});
                  this.el.appendChild(calloutChild);
                  // });
                }
              } else if(this.meshChildren[i].name.includes("haudio") && hvids.length > 0) {
                // console.log("video data " + JSON.stringify(hvids[hvidsIndex]));
                this.mesh = this.meshChildren[i]; //mesh, not object3d type
                
                // }
              
              } else if((this.meshChildren[i].name.toString().includes("hvid") || this.meshChildren[i].name.toString() == "hvid") && hvids.length > 0) {
                // console.log("video data " + JSON.stringify(hvids[hvidsIndex]));
                this.mesh = this.meshChildren[i]; //mesh, not object3d type
                
                this.child = this.el.object3D.getObjectByName(this.meshChildren[i].name, true); //object3d
                    this.vid_href = hvids[hvidsIndex].url;
                    let vProps = {};
                    vProps.url = this.vid_href;
                    vProps.index = hvidsIndex;
                    vProps.id = hvids[hvidsIndex]._id;
                    vProps.meshname = this.meshChildren[i].name;
                    vProps.videoTitle = hvids[hvidsIndex].title;
                    vProps.eventData = this.data.eventData;
                    this.childEnt = document.createElement('a-entity'); 
                    this.el.appendChild(this.childEnt);
                    // this.clone = this.child.clone();
                    this.childEnt.setObject3D("Object3D", this.child);
                    this.childEnt.setAttribute("vid_materials_embed", vProps);
                    this.childEnt.id = "primary_video";
                    this.childEnt.classList.add("activeObjexRay");
                    // this.child.remove();
                    hvidsIndex++;
                // }
              }  else if((this.meshChildren[i].name.toString().includes("svid") || this.meshChildren[i].name.toString() == "svid") && svids.length > 0) {
                  // console.log("video data " + JSON.stringify(svids[svidsIndex]));
                  this.mesh = this.meshChildren[i]; //mesh, not object3d type
                  
                  this.child = this.el.object3D.getObjectByName(this.meshChildren[i].name, true); //object3d
                  this.vid_href = svids[svidsIndex].url;
                  let vProps = {};
                  vProps.url = this.vid_href;
                  vProps.index = svidsIndex;
                  vProps.id = svids[svidsIndex]._id;
                  vProps.meshname = this.meshChildren[i].name;
                  vProps.videoTitle = svids[svidsIndex].title;
                  this.childEnt = document.createElement('a-entity'); 
                  this.el.appendChild(this.childEnt);
                  // this.clone = this.child.clone();
                  this.childEnt.setObject3D("Object3D", this.child);
                  this.childEnt.setAttribute("vid_materials_embed", vProps);
                  this.childEnt.classList.add("activeObjexRay");
                  // this.child.remove();
                  svidsIndex++;
                // }
              } else if (this.meshChildren[i].name.includes("spic")) {
                let mesh = this.meshChildren[i]; //mesh, not object3d type
                let child = this.el.object3D.getObjectByName(this.meshChildren[i].name, true); //object3d
                if (spicsIndex < spics.length) {
                  let childEnt = document.createElement('a-entity');
                       
                  childEnt.classList.add("activeObjexRay");
                  childEnt.setObject3D("Object3D", child);
                  this.el.appendChild(childEnt);
                  // console.log(this.data.name + " positon" + JSON.stringify(this.data.pos));
                  let calloutEntity = document.createElement("a-entity");
                  // calloutEntity.setAttribute('geometry', {primitive: 'plane', height: .25, width: .75, color: "black"});
                  calloutEntity.setAttribute("scale", '2 2 2');
                  let calloutText = document.createElement("a-entity");
                  this.el.sceneEl.appendChild(calloutEntity);
                  calloutEntity.appendChild(calloutText);
                  // calloutEntity.setAttribute("look-at", "#player");
                  calloutEntity.setAttribute('visible', false);
  
                  calloutText.setAttribute("position", '0 0 .5'); //offset the child on z toward camera, to prevent overlap on model
                  if (settings && settings.sceneCameraMode == "Third Person") {
                    calloutText.setAttribute("look-at", "#thirdPersonCamera");
                    calloutEntity.setAttribute("look-at", "#thirdPersonCamera");
                  } else {
                    calloutText.setAttribute("look-at", "#player");
                    calloutEntity.setAttribute("look-at", "#player");
                  }
                  calloutText.setAttribute('troika-text', {
                    width: 2,
                    baseline: "bottom",
                    align: "center",
                    fontSize: .1,
                    font: "/fonts/web/" + this.font2,
                    anchor: "center",
                    // wrapCount: 300,
                    color: "white",
                    value: spics[spicsIndex].title
                  });
                  // this.el.setAttribute("position", this.data.pos);
                  childEnt.addEventListener('mouseenter', function (evt) {
                    if (this.data.eventData.toLowerCase().includes("audiotrigger")) {
                      // var triggerAudioController = document.getElementById("triggerAudio");
                      if (this.triggerAudioController != null) {
                        
                        this.triggerAudioController.components.trigger_audio_control.playAudio();
  
                      }
                    }
                    
                      calloutEntity.setAttribute('visible', true);
                      let pos = evt.detail.intersection.point; //hitpoint on model
                      console.log("mousing a pic agt " + JSON.stringify(pos) + " title " + spics[spicsIndex].title);
                      calloutEntity.setAttribute("position", pos);
                    // }
                  });
                  childEnt.addEventListener('mouseleave', function (evt) {
                    // console.log("tryna mouseexit");
                    calloutEntity.setAttribute('visible', false);
                  });
                  if (spics[spicsIndex].linkURL != null && spics[spicsIndex].linkURL != undefined && spics[spicsIndex].linkURL != 'undefined' && spics[spicsIndex].linkURL.length > 6) {
                    childEnt.setAttribute('basic-link', {href: spics[spicsIndex].linkURL});
                  }
                    this.pic_href = spics[spicsIndex].url;
                    console.log("tryna load gallerypic " + this.meshChildren[i].name);
                    var loader = new THREE.TextureLoader();
                    // load a resource
                    loader.load(
                      // resource URL
                      this.pic_href,
                      // onLoad callback
                      function ( texture ) { 
                        this.pictexture = texture;
                        this.pictexture.encoding = THREE.sRGBEncoding; 
                        this.pictexture.flipY = true; 
                        this.picmaterial = new THREE.MeshBasicMaterial( { map: this.pictexture } ); 
                          
                        mesh.traverse(node => { //needs a callback here to insure it gets painted the first time
                          // console.log("gotsa obj + mat");
                          if (node.isMesh) {
                            node.material = this.picmaterial;
                          }
                        });
                      },
                      function ( err ) {
                        console.error( 'An error happened.' );
                      }
                    );
                  spicsIndex++;
                }
              
              } else if (this.meshChildren[i].name.includes("hpic")) {
                let mesh = this.meshChildren[i]; //mesh, not object3d type
                let child = this.el.object3D.getObjectByName(this.meshChildren[i].name, true); //object3d
                if (hpicsIndex < hpics.length) {
                  let childEnt = document.createElement('a-entity');
                       
                  childEnt.classList.add("activeObjexRay");
                  childEnt.setObject3D("Object3D", child);
                  this.el.appendChild(childEnt);
                  // console.log(this.data.name + " positon" + JSON.stringify(this.data.pos));
                  let calloutEntity = document.createElement("a-entity");
                  // calloutEntity.setAttribute('geometry', {primitive: 'plane', height: .25, width: .75, color: "black"});
                  calloutEntity.setAttribute("scale", '2 2 2');
                  let calloutText = document.createElement("a-entity");
                  this.el.sceneEl.appendChild(calloutEntity);
                  calloutEntity.appendChild(calloutText);
                  
  
                  calloutText.setAttribute("position", '0 0 .5'); //offset the child on z toward camera, to prevent overlap on model
                  if (settings && settings.sceneCameraMode == "Third Person") {
                    calloutText.setAttribute("look-at", "#thirdPersonCamera");
                    calloutEntity.setAttribute("look-at", "#thirdPersonCamera");
                  } else {
                    calloutText.setAttribute("look-at", "#player");
                    calloutEntity.setAttribute("look-at", "#player");
                  }
                 
                  
                  calloutEntity.setAttribute('visible', false);
                  calloutText.setAttribute('troika-text', {
                    // width: 2,
                    baseline: "bottom",
                    align: "center",
                    fontSize: .1,
                    font: "/fonts/web/" + this.font2,
                    anchor: "center",
                    // wrapCount: 300,
                    color: "white",
                    outlineColor: "black",
                    outlineWidth: "2%",
                    value: hpics[hpicsIndex].title
                  });
                  // this.el.setAttribute("position", this.data.pos);
                  childEnt.addEventListener('mouseenter', (evt) => {
                    if (this.data && this.data.eventData != undefined && this.data.eventData.toLowerCase().includes("audiotrigger")) {
                      // var triggerAudioController = document.getElementById("triggerAudio");
                      if (this.triggerAudioController != null) {
                        this.triggerAudioController.components.trigger_audio_control.playAudio();
                      }
                    }
                      calloutEntity.setAttribute('visible', true);
                      let pos = evt.detail.intersection.point; //hitpoint on model
                      console.log("mousing a pic agt " + JSON.stringify(pos) + " title " + hpics[hpicsIndex].title);
                      calloutEntity.setAttribute("position", pos);
                      calloutEntity.setAttribute('scale', {x: this.distance * .25, y: this.distance * .25, z: this.distance * .25} );
                    // }
                  });
                  childEnt.addEventListener('mouseleave', (evt) => {
                    // console.log("tryna mouseexit");
                    calloutEntity.setAttribute('visible', false);
                  });
                  if (hpics[hpicsIndex].linkURL != null && hpics[hpicsIndex].linkURL != undefined && hpics[hpicsIndex].linkURL != 'undefined' && hpics[hpicsIndex].linkURL.length > 6) {
                    childEnt.setAttribute('basic-link', {href: hpics[hpicsIndex].linkURL});
                  }
                    this.pic_href = hpics[hpicsIndex].url;
                    // console.log("tryna load gallerypic " + this.meshChildren[i].name);
                    var loader = new THREE.TextureLoader();
                    // load a resource
                    loader.load(
                      // resource URL
                      this.pic_href,
                      // onLoad callback
                      function ( texture ) { 
                        this.pictexture = texture;
                        this.pictexture.encoding = THREE.sRGBEncoding; 
                        this.pictexture.flipY = true; 
                        this.picmaterial = new THREE.MeshBasicMaterial( { map: this.pictexture } ); 
                          
                        mesh.traverse(node => { //needs a callback here to insure it gets painted the first time
                          // console.log("gotsa obj + mat");
                          if (node.isMesh) {
                            node.material = this.picmaterial;
                          }
                        });
                      },
                      function ( err ) {
                        console.error( 'An error happened.' );
                      }
                    );
                  hpicsIndex++;
                }
              } else if (this.meshChildren[i].name.includes("vpic")) {
                let mesh = this.meshChildren[i]; //mesh, is not object3d type
                let child = this.el.object3D.getObjectByName(this.meshChildren[i].name, true); //object3d
                if (vpicsIndex < vpics.length) {
                  let childEnt = document.createElement('a-entity');
                       
                  childEnt.classList.add("activeObjexRay");
                  childEnt.setObject3D("Object3D", child);
                  this.el.appendChild(childEnt);
                  // console.log(this.data.name + " positon" + JSON.stringify(this.data.pos));
                  let calloutEntity = document.createElement("a-entity");
                
                  calloutEntity.setAttribute("scale", '2 2 2');
                  let calloutText = document.createElement("a-entity");
                  this.el.sceneEl.appendChild(calloutEntity);
                  calloutEntity.appendChild(calloutText);
  
                  // calloutEntity.setAttribute("look-at", "#player");
                  if (settings && settings.sceneCameraMode == "Third Person") {
                    calloutEntity.setAttribute('look-at', '#thirdPersonCamera'); //toggle by eventData
                  } else {
                    calloutEntity.setAttribute('look-at', '#player'); //first person camrig
                  }
                  calloutEntity.setAttribute('visible', false);
  
                  calloutText.setAttribute("position", '0 0 .5'); //offset the child on z toward camera, to prevent overlap on model
                  // calloutText.setAttribute("look-at", "#player");
                  if (settings && settings.sceneCameraMode == "Third Person") {
                    calloutText.setAttribute('look-at', '#thirdPersonCamera'); //toggle by eventData
                  } else {
                    calloutText.setAttribute('look-at', '#player'); //first person camrig
                  }
                  calloutText.setAttribute('troika-text', {
                    width: 2,
                    baseline: "bottom",
                    align: "center",
                    font: "/fonts/web/" + this.font2,
                    anchor: "center",
                    // wrapCount: 300,
                    color: "white",
                    value: vpics[vpicsIndex].title
                  });
  
                  childEnt.addEventListener('mouseenter', (evt) => {
                    if (this.data && this.data.eventData != undefined && this.data.eventData.toLowerCase().includes("audiotrigger")) {
                      // this.triggerAudioController = document.getElementById("triggerAudio");
                      if (this.triggerAudioController != null) {
                        this.triggerAudioController.components.trigger_audio_control.playAudio();
                      }
                    }
                      calloutEntity.setAttribute('visible', true);
                      let pos = evt.detail.intersection.point; //hitpoint on model
                      console.log("mousing a pic agt " + JSON.stringify(pos) + " title " + vpics[vpicsIndex].title);
                      calloutEntity.setAttribute("position", pos);
                    // }
                  });
                  childEnt.addEventListener('mouseleave', (evt) => {
                    // console.log("tryna mouseexit");
                    calloutEntity.setAttribute('visible', false);
                  });
                  if (vpics[vpicsIndex].linkURL != null && vpics[vpicsIndex].linkURL != undefined && vpics[vpicsIndex].linkURL != 'undefined' && vpics[vpicsIndex].linkURL.length > 6) {
                    childEnt.setAttribute('basic-link', {href: vpics[vpicsIndex].linkURL});
                  }
                    this.pic_href = vpics[vpicsIndex].url;
                    // console.log("tryna load gallerypic " + this.meshChildren[i].name);
                    var loader = new THREE.TextureLoader();
                    // load a resource
                    loader.load(
                      // resource URL
                      this.pic_href,
                      // onLoad callback
                      function ( texture ) { 
                        this.pictexture = texture;
                        this.pictexture.encoding = THREE.sRGBEncoding; 
                        this.pictexture.flipY = true; 
                        this.picmaterial = new THREE.MeshBasicMaterial( { map: this.pictexture } ); 
                          
                        mesh.traverse(node => { //needs a callback here to insure it gets painted the first time
                          // console.log("gotsa obj + mat");
                          if (node.isMesh) {
                            node.material = this.picmaterial;
                          }
                        });
                      },
                      function ( err ) {
                        console.error( 'An error happened.' );
                      }
                    );
                  vpicsIndex++;
                }
              }
            }
        }
  
        if (this.el.classList.contains('target') || this.data.markerType != "none" || this.hasCallout || this.hasLocationCallout) {
          let textIndex = 0;
          this.position = null;
          // let hasBubble = false;
          // let theEl = this.element;
          this.el.setAttribute('gesture-handler-add'); //ar mode only?
          var sceneEl = document.querySelector('a-scene');
          let hasCallout = false;
          if (this.hasCallout || this.hasLocationCallout) {
            hasCallout = true;
          }
          let calloutOn = false;
          if (!this.data.eventData.toLowerCase().includes("undefined") && this.data.eventData.toLowerCase().includes("main") && this.data.eventData.toLowerCase().includes("text")) {
            document.getElementById("mainTextToggle").setAttribute("visible", false);
            let tdata = document.getElementById("mainText").getAttribute("main-text-control", "mainTextString"); 
            // console.log("target eventData : "+ JSON.stringify(this.data.eventData));
            textData = tdata.mainTextString.split("~");
            hasCallout = true;
          } else {
            textData = this.data.description.split("~");
          }
          if (hasCallout) {
            let bubble = document.createElement("a-entity");
            this.bubble = bubble;
            console.log("made a bubble!" + this.data.eventData.toLowerCase());
            let position = this.el.getAttribute("position")
            bubble.classList.add("bubble");
            // bubble.setAttribute("position", "2 2 0");
            // bubble.setAttribute("rotation", "0 0 0"); 
            // bubble.setAttribute("scale", "2 2 2"); 
            bubble.setAttribute("visible", false);
            if (this.data.eventData.toLowerCase().includes('agent')) {
  
  
              this.el.appendChild(bubble); //make it a child if
              bubble.setAttribute("position", "0 1 0");
              bubble.setAttribute("rotation", "0 0 0"); 
  
            } else {
              sceneEl.appendChild(bubble); //or else put at top
              bubble.setAttribute("position", "2 2 0");
              bubble.setAttribute("rotation", "0 0 0"); 
            }
            
            bubbleBackground = null;
            if (this.data.eventData.toLowerCase().includes("thought")) {
              this.hasCalloutBackground = true;
              // bubble.setAttribute("look-at", "#player");
              if (settings && settings.sceneCameraMode == "Third Person") {
                bubble.setAttribute('look-at', '#thirdPersonCamera'); //toggle by eventData
              } else {
                bubble.setAttribute('look-at', '#player'); //first person camrig
              }
              console.log("ttryhana put a thought bubble on mod_model");
              bubbleBackground = document.createElement("a-entity");
              bubbleBackground.classList.add("bubbleBackground");
              bubbleBackground.setAttribute("gltf-model", "#thoughtbubble"); //just switch this for other callout types (speech and plain callout)
              bubbleBackground.setAttribute("position", "0 0 1");
              bubbleBackground.setAttribute("rotation", "0 0 0"); 
              // bubbleBackground.setAttribute("scale", "-.1 .1 .1"); 
              // bubble.setAttribute("material", {"color": "white", "blending": "additive", "transparent": false, "alphaTest": .5});
              bubbleBackground.setAttribute("material", {"color": "white", "shader": "flat"}); //doh, doesn't work for gltfs... 
              bubble.appendChild(bubbleBackground);
  
              bubbleBackground.addEventListener('model-loaded', () => {
                const bubbleObj = bubbleBackground.getObject3D('mesh');
                // var material = new THREE.MeshBasicMaterial({map: bubbleObj.material.map}); 
                // material.color = "white";
                bubbleObj.traverse(node => {
                    // node.material = material;
                    node.material.flatShading = true;
                    node.material.needsUpdate = true
                  });
                });
            }
            if (this.data.eventData.toString().toLowerCase().includes("speech") || this.data.eventData.toString().toLowerCase().includes("talk")) {
              this.hasCalloutBackground = true;
              // bubble.setAttribute("look-at", "#player");
              if (settings && settings.sceneCameraMode == "Third Person") {
                bubble.setAttribute('look-at', '#thirdPersonCamera'); //toggle by eventData
              } else {
                bubble.setAttribute('look-at', '#player'); //first person camrig
              }
              bubbleBackground = document.createElement("a-entity");
              bubbleBackground.classList.add("bubbleBackground");
              bubbleBackground.setAttribute("gltf-model", "#talkbubble"); 
              bubbleBackground.setAttribute("position", "0 0 0");
              bubbleBackground.setAttribute("rotation", "0 0 0"); 
              // bubbleBackground.setAttribute("scale", "-.1 .1 .1"); 
              // bubble.setAttribute("material", {"color": "white", "blending": "additive", "transparent": false, "alphaTest": .5});
              bubbleBackground.setAttribute("material", {"color": "white", "shader": "flat"}); //doh, doesn't work for gltfs... 
              bubble.appendChild(bubbleBackground);
  
              bubbleBackground.addEventListener('model-loaded', () => {
                const bubbleObj = bubbleBackground.getObject3D('mesh');
                // var material = new THREE.MeshBasicMaterial({map: bubbleObj.material.map}); 
                // material.color = "white";
                bubbleObj.traverse(node => {
                    // node.material = material;
                    node.material.flatShading = true;
                    node.material.needsUpdate = true
                  });
                });
            }
            
            // let bubbleText = document.createElement("a-text");
            let bubbleText = document.createElement("a-entity");
  
            bubbleText.classList.add("bubbleText");
            // bubbleText.setAttribute("visible", false);
            // bubbleText.setAttribute("position", "0 0 0");
            // bubbleText.setAttribute("scale", ".1 .1 .1"); 
            bubble.appendChild(bubbleText);
            if (settings && settings.sceneCameraMode == "Third Person") {
              bubbleText.setAttribute('look-at', '#thirdPersonCamera'); //toggle by eventData
            } else {
              bubbleText.setAttribute('look-at', '#player'); //first person camrig
            }
            // bubbleText.setAttribute("look-at", "#player");
            this.bubbleText = bubbleText;
            // bubbleText.setAttribute("width", 3);
            // bubbleText.setAttribute("height", 2);
            
            
  
              /*
            setInterval(function(){ //get "viewport" position (normalized screen coords)
              if (calloutOn) {
              let pos = new THREE.Vector3();
              pos = pos.setFromMatrixPosition(obj.matrixWorld); //world pos of model, kindof
              // worldPos = pos;
              pos.project(camera);
              var width = window.innerWidth, height = window.innerHeight; 
              let widthHalf = width / 2;
              let heightHalf = height / 2;
              pos.x = (pos.x * widthHalf) + widthHalf;
              pos.y = - (pos.y * heightHalf) + heightHalf;
              pos.z = 0;
              // if (pos.x != NaN) { //does it twice because matrix set, disregard if it returns NaN :( //fixed?
              //   console.log("screen position: " + (pos.x/width).toFixed(1) + " " + (pos.y/height).toFixed(1)); //"viewport position"
              // }
              if ((pos.x/width) < .45) {
                console.log("flip left");
                bubbleBackground.setAttribute("position", "4 2 1");
                bubbleBackground.setAttribute("scale", "-.1 .1 .1"); 
                bubbleText.setAttribute("position", "4 2 1.1");
              } 
              if ((pos.x/width) > .55) {
                console.log("flip right");
                bubbleBackground.setAttribute("position", "-4 2 1");
                bubbleBackground.setAttribute("scale", ".1 .1 .1"); 
                bubbleText.setAttribute("position", "-4 2 1.1");
              }
  
              }
            }, 2000);
            */
          }
  
          let primaryAudio = document.getElementById("primaryAudio");
          if (primaryAudio != null) {
          const primaryAudioControlParams = primaryAudio.getAttribute('primary_audio_control');
  
       
          if (primaryAudioControlParams.targetattach) { //set by sceneAttachPrimaryAudioToTarget or something like that...
            console.log("tryna target attach primary audio " + primaryAudioControlParams.targetattach);
  
            document.getElementById("primaryAudioParent").setAttribute("visible", false);
            // document.getElementById("primaryAudioParent").setAttribute("position", theEl.position);
            primaryAudio.emit('targetattach', {targetEntity: this.el}, true);
            primaryAudioHowl.pos(this.el.object3D.position.x, this.el.object3D.position.y, this.el.object3D.position.z);
            
            this.el.addEventListener('click', function () {
  
              this.bubble = sceneEl.querySelector('.bubble');
              if (this.bubble) {
                this.bubble.setAttribute('visible', false);
              }
              calloutOn = false;
              // this.bubbleText = theEl.querySelector('.bubbleText');
              // this.bubble = sceneEl.querySelector('.bubble');
              // this.bubbleText = sceneEl.querySelector('.bubbleText');
              // if (hasCallout) {
              //   this.bubble.setAttribute("visible", false);
              //   this.bubbleText.setAttribute("visible", false);
              // }
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
              });        
            }
          } else {
            // console.log("no primary audio found!");
          }
          if (this.data.markerType.toLowerCase() == "spawntrigger") {
            this.el.setAttribute('gltf-model', '#poi1' );
            // this.el.setAttribute("geometry", {primitive: "box", height: 1, width: 1});
            
          }
          this.el.addEventListener('mouseleave', (e) => { 
            e.preventDefault();
            // console.log("tryna mouseexit");
            if (!this.data.isEquipped) {
              if (this.calloutEntity != null) {
                this.calloutEntity.setAttribute('visible', false);
              }
              // this.bubble = sceneEl.querySelector('.bubble');
              if (this.bubble) {
                this.bubble.setAttribute('visible', false);
                // if (this.bubbleBackground) {
                //   this.bubbleBackground.setAttribute('scale', '1 1 1');
                // }
                //   this.bubbleText.setAttribute('scale', '1 1 1' );
              }
            }
          });
          console.log("MOD_MODEL markertype " + this.data.markerType +  " this.hasCallout " + this.hasCallout + " this.data.description " + this.data.description);
  
          this.el.addEventListener('mouseenter', (evt) =>  {
            console.log("mouseovewr model " + this.el.id + this.hasLocationCallout + this.data.markerType + this.hasCallout + this.hasCalloutBackground + textData[textIndex]);
            if (evt.detail.intersection != null && this.hitpoint != null) {
              if (this.calloutString == "") {
                this.calloutString = textData[textIndex];
              }
              // if (hasCallout && !textData[textIndex].toLowerCase().includes("undefined")) {
            if (this.hasCallout || hasCallout || this.hasLocationCallout) {
               
                let pos = evt.detail.intersection.point; //hitpoint on model
                // this.bubble.setAttribute('position', {"x": pos.x.toFixed(2), "y": pos.y.toFixed(2), "z": pos.z.toFixed(2)});
                if (this.data.eventData.toLowerCase().includes("agent")) {
                  this.bubble.setAttribute('position', '0 1 0');
                } else {
                  this.bubble.setAttribute('position', evt.detail.intersection.point);
                }
                
  
                this.font2 = "Acme.woff";
                if (settings && settings.sceneFontWeb2 && settings.sceneFontWeb2.length) {
                  this.font2 = settings.sceneFontWeb2;
                }
    
              // if (pos.x != NaN) { //does it twice because matrix set, disregard if it returns NaN :( //fixed?
              //   console.log("screen position: " + (pos.x/width).toFixed(1) + " " + (pos.y/height).toFixed(1)); //"viewport position"
              // }
              
              
              // this.distance = window.playerPosition.distanceTo( this.hitpoint );
             
              let distance = evt.detail.intersection.distance;
              this.distance = distance;
              console.log("callout is " + this.calloutString + " distance " + distance);
              // if (distance) { //
  
              if (this.hasCalloutBackground && distance) { //eg thought or speech bubble
                if (distance < 10) {
                  const min = .1;
                  const max = 1;
  
                  calloutOn = true;
                  this.bubble = sceneEl.querySelector('.bubble'); //TODO should not be a class, but a generated id
                  this.bubbleText = sceneEl.querySelector('.bubbleText'); //same
                  this.bubbleBackground = sceneEl.querySelector('.bubbleBackground'); //same
      
                 
                  
                  this.bubble.setAttribute("visible", true);
                  this.bubbleText.setAttribute("visible", true);
      
                  let camera = AFRAME.scenes[0].camera; 
                  pos.project(camera);
                  var width = window.innerWidth, height = window.innerHeight; 
                  let widthHalf = width / 2;
                  let heightHalf = height / 2;
                  pos.x = (pos.x * widthHalf) + widthHalf;
                  pos.y = - (pos.y * heightHalf) + heightHalf;
                  pos.z = 0;
  
                  let scaleFactor = clamp(distance * .1, min, max);
                  console.log( " distance " +  distance + " scalefactro " + scaleFactor);
                  if ((pos.x/width) < .5) {
                    console.log("flip left");
                    if (this.bubbleBackground) {
                      this.bubbleBackground.setAttribute("position", ".5 .2 .5");
                      // this.bubbleBackground.setAttribute("scale", "-.2 .2 .2"); 
                      // this.bubbleBackground.setAttribute('scale', {x: distance * -.05, y: distance * .05, z: distance * .05} );
                      this.bubbleBackground.setAttribute('scale', {x: scaleFactor * -1, y: scaleFactor, z: scaleFactor} );
                    }
                    // this.bubbleText.setAttribute("scale", ".2 .2 .2"); 
                    this.bubbleText.setAttribute("position", ".5 .2 .6");
                    // this.bubbleText.setAttribute('scale', {x: distance * .05, y: distance * .05, z: distance * .05} );
                    this.bubbleText.setAttribute('scale', {x: scaleFactor, y: scaleFactor, z: scaleFactor} );
                  } else {
                  // if ((pos.x/width) > .5) {
                    console.log("flip right");
                    if (this.bubbleBackground) {
                      this.bubbleBackground.setAttribute("position", "-.5 .2 .5");
                      // this.bubbleBackground.setAttribute('scale', {x: distance * .05, y: distance * .05, z: distance * .05} );
                      this.bubbleBackground.setAttribute('scale', {x: scaleFactor, y: scaleFactor, z: scaleFactor} );
                      // this.bubbleBackground.setAttribute("scale", ".2 .2 .2"); 
  
                    }
                    // this.bubbleText.setAttribute("scale", ".2 .2 .2")
                    // this.bubbleText.setAttribute('scale', {x: distance * .05, y: distance * .05, z: distance * .05} );
                    this.bubbleText.setAttribute('scale', {x: scaleFactor, y: scaleFactor, z: scaleFactor} );
                    this.bubbleText.setAttribute("position", "-.5 .2 .6");
                  }
  
                  this.bubbleText.setAttribute('troika-text', {
                    baseline: "center",
                    align: "center",
                    font: "/fonts/web/" + this.font2,
                    anchor: "center",
                    // wrapCount: 20,
                    maxWidth: 3,
                    fontSize: .3,
                    color: "black",
                    outlineColor: "white",
                    outlineWidth: "2%",
                    value: textData[textIndex]
                  });
                } else {
                  console.log("tryna show bubble!");
                  this.bubble.setAttribute("visible", false);
                  this.bubbleBackground.setAttribute('scale', '1 1 1');
                  this.bubbleText.setAttribute('scale', '1 1 1' );
                }
    
  
              } else {
                if (this.hasLocationCallout || this.data.markerType === "character") {
                  console.log("mod_model not bubble callout is " + textData[textIndex]);
                  distance = evt.detail.intersection.distance;
                    // this.bubble.setAttribute('position', pos);
                    this.bubble.setAttribute("visible", true);
                    this.bubbleText.setAttribute("visible", true);
                    this.bubbleText.setAttribute('scale', {x: distance * .1, y: distance * .1, z: distance * .1} );
                  // this.bubbleText.setAttribute('scale', {x: distance * .04, y: distance * .04, z: distance * .04} );
                  // this.bubbleText.setAttribute("position", "-.5 .2 .51");
                  this.bubbleText.setAttribute("position", "0 .75 -.5"); //
                  this.bubbleText.setAttribute('troika-text', {
                    baseline: "bottom",
                    align: "center",
                    font: "/fonts/web/" + this.font2,
                    anchor: "center",
                    // wrapCount: .2,
                    fontSize: .3,
                    color: "white",
                    outlineColor: "black",
                    outlineWidth: "2%",
                    value: textData[textIndex]
                  });
                }
    
  
              }
  
  
              if (textIndex < textData.length - 1) {
                textIndex++;
              } else {
                textIndex = 0;
                }
              }
  
              // console.log("tryna play audiotrigger " + JSON.stringify(this.data.eventData));
              if (this.data.tags != undefined && this.data.tags != null && this.data.tags != "undefined") {
                console.log("tryna play audio with tags " + this.data.tags);
                // if (this.triggerAudioController != null) {
                //   this.triggerAudioController.components.trigger_audio_control.playAudio();
                
                  if (this.triggerAudioController != null) {
                    let distance = window.playerPosition.distanceTo(evt.detail.intersection.point);
                    this.triggerAudioController.components.trigger_audio_control.playAudioAtPosition(evt.detail.intersection.point, distance, this.data.tags, 1);//tagmangler needs an array, add vol mod 
                  }
                // }
              }
  
              if (this.data.eventData && this.data.eventData.length && this.data.eventData.toLowerCase().includes("target")) {
                  // this.el.setAttribute("targeting_raycaster", {'init': true}); //no
                  this.el.classList.add("target");
                  this.el.classList.remove("activeObjexRay");
                
          
  
              }
            
            }
          });
  
        }
       
        document.querySelector('a-scene').addEventListener('youtubeToggle', function (event) { //things to trigger on this model if youtube is playing
          console.log("GOTSA YOUTUBNE EVENT: " + event.detail.isPlaying);  
          if (event.detail.isPlaying) {
            if (danceIndex != -1) { //moIndex = "mouthopen"
              var clip = danceClips[Math.floor(Math.random()*danceClips.length)];
              theEl.setAttribute('animation-mixer', {
                // "clip": clips[danceIndex].name,
                "clip": clip.name,
                "loop": "repeat",
                "crossFadeDuration": 1,
                "repetitions": Math.floor(Math.random()*2),
                "timeScale": .75 + Math.random()/2
              });
             
              theEl.addEventListener('animation-finished', function () { 
                theEl.removeAttribute('animation-mixer');
                clip = danceClips[Math.floor(Math.random()*danceClips.length)];
                theEl.setAttribute('animation-mixer', {
                  // "clip": clips[danceIndex].name,
                  "clip": clip.name,
                  "loop": "repeat",
                  "crossFadeDuration": 1,
                  "repetitions": Math.floor(Math.random()*2),
                  "timeScale": .75 + Math.random()/2
                });
              });
            }
          } else {
            if (idleIndex != -1) { 
              var clip = idleClips[Math.floor(Math.random()*idleClips.length)];
              theEl.setAttribute('animation-mixer', {
                // "clip": clips[danceIndex].name,
                "clip": clip.name,
                "loop": "repeat",
                "crossFadeDuration": 1,
                "repetitions": Math.floor(Math.random()*2),
                "timeScale": .75 + Math.random()/2
              });
             
              theEl.addEventListener('animation-finished', function () { //clunky but whatever 
                theEl.removeAttribute('animation-mixer');
                clip = idleClips[Math.floor(Math.random()*idleClips.length)];
                theEl.setAttribute('animation-mixer', {
                  // "clip": clips[danceIndex].name,
                  "clip": clip.name,
                  "loop": "repeat",
                  "crossFadeDuration": 1,
                  "repetitions": Math.floor(Math.random()*2),
                  "timeScale": .75 + Math.random()/2
                });
              });
            }
          }
        });
  
          document.querySelector('a-scene').addEventListener('primaryAudioToggle', function () {  //things to trigger on this model if primary audio is playing
          // console.log("primaryAudioToggle!");
          if (primaryAudioHowl.playing()) {
  
            console.log("primaryAudioToggle is playing!");
            
            if (danceIndex != -1) { //moIndex = "mouthopen"
              theEl.setAttribute('animation-mixer', {
                "clip": clips[danceIndex].name,
                "loop": "repeat"
                // "repetitions": 10,
                // "timeScale": 2
              });
              // theEl.addEventListener('animation-finished', function () { 
              //   theEl.removeAttribute('animation-mixer');
              // });
            }
          } else {
              console.log("primaryAudioToggle not playing");
              if (idleIndex != -1) { 
              theEl.setAttribute('animation-mixer', {
                "clip": clips[idleIndex].name,
                "loop": "repeat"
                // "repetitions": 10,
                // "timeScale": 2
              });
              // theEl.addEventListener('animation-finished', function () { 
              //   theEl.removeAttribute('animation-mixer');
              // });
              }
            }
          });
          document.querySelector('a-scene').addEventListener('primaryVideoToggle', function (e) {  //things to trigger on this model if primary video is playing
            // console.log("primaryVideoToggle " + e.detail);
            if (e.detail.isPlaying) {
    
              console.log("primaryVideoToggle is playing!");
              
              if (danceIndex != -1) { //moIndex = "mouthopen"
                theEl.setAttribute('animation-mixer', {
                  "clip": clips[danceIndex].name,
                  "loop": "repeat"
                  // "repetitions": 10,
                  // "timeScale": 2
                });
                // theEl.addEventListener('animation-finished', function () { 
                //   theEl.removeAttribute('animation-mixer');
                // });
              }
            } else {
                console.log("primaryVideoToggle not playing");
                if (idleIndex != -1) { 
                theEl.setAttribute('animation-mixer', {
                  "clip": clips[idleIndex].name,
                  "loop": "repeat"
                  // "repetitions": 10,
                  // "timeScale": 2
                });
                // theEl.addEventListener('animation-finished', function () { 
                //   theEl.removeAttribute('animation-mixer');
                // });
                }
              }
          });
  
        }
  
      });
     
    },  //END INIT mod_model
    returnProperties: function () {
      //placeholder
  
    },
    playAnimation: function (animState) {
      if (this.navAgentController) {
      // console.log("tryna play animState " + animState);
       switch (animState) { 
         case "random": 
         if (this.walkClips.length > 0) {
           var clip = this.walkClips[Math.floor(Math.random()*this.walkClips.length)];
             this.el.setAttribute('animation-mixer', {
               "clip": clip.name,
               "loop": "repeat",
               "crossFadeDuration": 1,
               "timeScale": this.navAgentController.currentSpeed
             });
             this.el.addEventListener('animation-finished', function () { 
               this.el.removeAttribute('animation-mixer');
               var clip = this.walkClips[Math.floor(Math.random()*this.walkClips.length)];
               this.el.setAttribute('animation-mixer', {
                 "clip": clip.name,
                 "loop": "repeat",
                 "crossFadeDuration": 1,
                 "timeScale": this.navAgentController.returnRandomNumber(.75, 1.25)
               });
             });
           } else {
             console.log("no walk clips found!");
           }
         break;
   
         case "pause": 
         if (this.idleClips.length > 0) {
           var clip = this.idleClips[Math.floor(Math.random()*this.idleClips.length)];
             this.el.setAttribute('animation-mixer', {
               "clip": clip.name,
               "loop": "repeat",
               "crossFadeDuration": 1,
               "timeScale": this.navAgentController.currentSpeed
             });
             this.el.addEventListener('animation-finished', function () { 
               this.el.removeAttribute('animation-mixer');
               var clip = this.idleClips[Math.floor(Math.random()*this.idleClips.length)];
               this.el.setAttribute('animation-mixer', {
                 "clip": clip.name,
                 "loop": "repeat",
                 "crossFadeDuration": 1,
                 "timeScale": this.navAgentController.returnRandomNumber(.75, 1.25)
               });
             });
           }  else {
             console.log("no idle clips found!");
           }
         break;  
         case "target": 
         if (this.walkClips.length > 0) {
           var clip = this.walkClips[Math.floor(Math.random()*this.walkClips.length)];
             this.el.setAttribute('animation-mixer', {
               "clip": clip.name,
               "loop": "repeat",
               "crossFadeDuration": 1
               // "repetitions": Math.floor(Math.random()*2)
               // "timeScale": .75 + Math.random()/2
             });
           }
         break;
       }
      } else {
        this.navAgentController = this.el.components.nav_agent_controller;
      }
     },
    playWalkAnimation: function () { //deprecated, handled by playAnimation above
      let theEl = this.el;
      let clips = this.walkClips;  //to pass below the listeners..?
      console.log("tryna walk with walkclips " + this.walkClips.length );
      if (this.walkClips.length > 0) {
      var clip = this.walkClips[Math.floor(Math.random()*this.walkClips.length)];
        theEl.setAttribute('animation-mixer', {
          // "clip": clips[danceIndex].name,
          "clip": clip.name,
          "loop": "repeat",
          "crossFadeDuration": 1
          // "repetitions": Math.floor(Math.random()*2)
          // "timeScale": .75 + Math.random()/2
        });
        
        theEl.addEventListener('animation-finished', function () { 
          theEl.removeAttribute('animation-mixer');
          var clip = clips[Math.floor(Math.random()*clips.length)];
          theEl.setAttribute('animation-mixer', {
            // "clip": clips[danceIndex].name,
            "clip": clip.name,
            "loop": "repeat",
            "crossFadeDuration": 1
            // "repetitions": Math.floor(Math.random()*2),
            // "timeScale": .75 + Math.random()/2
          });
        });
      }
    },
    beat: function (volume, duration) {
      console.log("tryna beat " + this.el.id + " " + volume);
      if (this.data.eventData.toLowerCase().includes("beat")) {
        let oScale = this.el.getAttribute('data-scale');
        oScale = parseFloat(oScale);
        volume = volume.toFixed(2) * .1;
        let scale = {};
          scale.x = oScale + volume;
          scale.y = oScale + volume;
          scale.z = oScale + volume;
          this.el.setAttribute('scale', scale);
          this.el.setAttribute('animation', 'property: scale; to: '+oScale+' '+oScale+' '+oScale+'; dur: '+duration+'; startEvents: beatRecover; easing: easeInOutQuad');
          this.el.emit('beatRecover');
  
      }
    },
    setShader: function () {
      if (this.data.shader != '') {
      if (this.data.shader == "noise") {
        this.texture = new THREE.TextureLoader().load('https://realitymangler.com/assets/textures/watertile3.png');
        this.shaderMaterial = new THREE.ShaderMaterial( {
          uniforms: {
            tExplosion: {
              type: "t",
              // value: THREE.ImageUtils.loadTexture( 'https://realitymangler.com/assets/textures/cloud.png' )
              value: this.texture
            },
            time: {
              type: "f",
              value: 0.0
            }
          },
          
          vertexShader: document.getElementById( 'noise1_vertex' ).textContent, //hrmg
          
          fragmentShader: document.getElementById( 'noise1_fragment' ).textContent
        
        } );
        this.shaderMaterial.transparent = true;
        // console.log(document.getElementById( 'noise1_vertex' ).textContent);
        this.hasUniforms = true;
        // console.log("has UNIFORMSZA");
        }
      }
    },
    recursivelySetChildrenShader: function (mesh) {
      mesh.material = this.shaderMaterial;
            
      if (mesh.children) {
        for (var i = 0; i < mesh.children.length; i++) {
          this.recursivelySetChildrenShader(mesh.children[i]);
        }
      }
    },
    returnHitDistance () {
      if (this.distance) {
        return this.distance;
      }
    },
    tick: function () {
      if (this.shaderMaterial != null && this.hasUniforms != null) {
        if (this.hasUniforms) {
          // console.log("timemods on");
          this.shaderMaterial.uniforms[ 'time' ].value = .00005 * ( Date.now() - this.start );
  
        }
      }
  
    },
    killParticles: function () {
      if (this.particlesEl) {
        this.particlesEl.setAttribute('sprite-particles', {"enable": false});
      }
    },
    rayhit: function (id, distance, hitpoint) {
  
      if (this.data.eventData && this.data.eventData.length && this.data.eventData.toLowerCase().includes("target")) {        
        if (this.particlesEl) {
          
            console.log("gotsa rayhit on id " + this.el.id + " eventdata " + this.data.eventData + " at " + JSON.stringify(hitpoint) + " tags" + this.data.tags);
            
            this.particlesEl.setAttribute("position", {"x": hitpoint.x, "y": hitpoint.y,"z": hitpoint.z});
            // this.particlesEl.object3D.position.set(hitpoint.x, hitpoint.y, hitpoint.z);
            this.particlesEl.setAttribute('sprite-particles', {
              enable: true, 
              duration: '2', 
              texture: '#explosion1', 
              color: 'black..white', 
              blending: 'additive', 
              textureFrame: '8 8', 
              textureLoop: '1', 
              spawnRate: '1', 
              lifeTime: '1', 
              opacity: '0,1,0', 
              rotation: '0..360', 
              scale: '100,500'
            });
          // this.particlesEl.setAttribute('sprite-particles', {"enable": false});
          this.particlesEl.setAttribute('sprite-particles', {"duration": .5});
          
          this.el.object3D.scale.set(0, 0, 0);
          // this.el.object3D.scale.y = 0;
          // this.el.object3D.scale.z = 0;
          this.mod_curve = this.el.components.mod_curve;
          if (this.mod_curve) {
            this.mod_curve.reset();
          }
        } else {
          this.particlesEl = document.createElement("a-entity");
          this.el.sceneEl.appendChild(this.particlesEl); //hrm...
        }
      }
  
      if (this.triggerAudioController != null && !this.data.isEquipped && this.tags) {
        this.triggerAudioController.components.trigger_audio_control.playAudioAtPosition(hitpoint, distance, this.tags);
      }
  
      if (this.hasSynth) {
        if (this.el.components.mod_synth != null && this.data.objectData.tonejsPatch1 != undefined && this.data.objectData.tonejsPatch1 != null) {
          // this.el.components.mod_synth.trigger(distance);
          if (this.data.objectData.tonejsPatch1 == "Metal") {
            this.el.components.mod_synth.metalHitDistance(distance);
          } else if (this.data.objectData.tonejsPatch1 == "AM Synth") {
            this.el.components.mod_synth.amHitDistance(distance);
          }
          
        }
      }
    }
  
    
  
  });  ///end mod_model///////////