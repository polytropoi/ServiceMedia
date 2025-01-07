/* global AFRAME, THREE */

function isMobile(){
  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        return true
   }
   else{
        return false
   }
}
function isTouchDevice(){
  if(navigator.maxTouchPoints || 'ontouchstart' in document.documentElement){
        return true
   }
   else{
        return false
   }
}

AFRAME.registerComponent('ar_hit_caster', {
    dependencies: ["raycaster"],
    schema: {
      targetEl: {type: 'selector'},
      spawnables: {type: 'selector'},
    },
  
    init: function () {
      var self = this;
      var targetEl = this.data.targetEl;
      this.xrHitTestSource = null;
      this.viewerSpace = null;
      this.refSpace = null;
      this.lockTargets = false;
      this.arRaycasterEnabled = false;
      this.arHitTestEnabled = false;
      this.camera = null;
      this.messageEl = document.getElementById("ar_overlay_message");
      this.el.sceneEl.renderer.xr.addEventListener(function () {
        self.viewerSpace = null;
        self.refSpace = null;
        self.xrHitTestSource = null;
      });


  
      this.el.sceneEl.addEventListener('enter-vr', function (event) {
        var el = self.el;
        var targetEl = self.data.targetEl;
        var session;
        // if (settings && settings.)
        // var arTargetData = [];
        // let arTargetGroup = new THREE.Group();

        console.log("enter-vr w/ aframe checkHeadsetConnected " + AFRAME.utils.device.checkHeadsetConnected() + 
        " aframe ismobile " + AFRAME.utils.device.isMobile() +
        " isTouchDevice " + isTouchDevice() +
        " userAgent isMobile " + isMobile());

        if (!self.el.sceneEl.is('ar-mode')) { 
          return; 
        }
        // targetEl.setAttribute('visible', false);

        session = self.el.sceneEl.renderer.xr.getSession();
        self.messageEl.textContent = "entered AR mode";
        console.log("ar-mode");

        let arOverlay = document.getElementById("ar_overlay");
        if (arOverlay) {
          arOverlay.style.visibility = 'visible';
        }
        const leftHandEl = document.getElementById("left-hand");
        if (leftHandEl) {
          leftHandEl.removeAttribute("blink-controls");  //rem blink controls in AR

        }
        self.originalPosition = targetEl.object3D.position.clone();
        self.el.object3D.visible = true;
        self.messageEl.textContent = "scanning for surface....";
        // this.camera = session.renderer.xr.getCamera().cameras[0];
      // if (AFRAME.utils.device.checkHeadsetConnected() && !AFRAME.utils.device.isMobile() && !isMobile() && !isTouchDevice()) { //make sure before loading the roomscale fu
        if (settings && (settings.useXrRoomPhysics || settings.useRealWorldMeshing)) {
          if (AFRAME.utils.device.checkHeadsetConnected() && !AFRAME.utils.device.isMobile() && !isMobile()) { //isTouchDevice is true on Quest3! 
            console.log("tryna do mixed!"); 
            
            this.arHitTestEnabled = true;
          } else {
            // if (settings && (settings.useXrRoomPhysics || settings.useRealWorldMeshing)) {
              self.messageEl.textContent = "Mixed Reality not supported on this device!";
              console.log("Mixed Reality not supported on this device!");
              sceneEl.removeAttribute("xr_room_physics");
              sceneEl.removeAttribute("real-world-meshing");
            // }
          }
        } else { //just in case...
          console.log("tryna do hit test!");
          this.arHitTestEnabled = true;
         
        }

        session.addEventListener('select', function () {
          var position = el.getAttribute('position');
          var rotation = el.getAttribute('rotation');
          const zeroPos = new THREE.Vector3(0, 0, 0); //hrm, use camera or player? viewportHolder?
          var distance = position.distanceTo(zeroPos);

          var scaleMod = .02 + (distance * 0.2);

          // if ((position.x != 0) && (position.y != 0) && (position.z != 0)) {
          //   targetEl.setAttribute('visible', true);
          // }
          if (!self.lockTargets && self.arHitTestEnabled) {
            console.log("tryna set position " + JSON.stringify(position) + " distance " + JSON.stringify(distance));
            self.messageEl.textContent = "surface found at position " + JSON.stringify(position);
            targetEl.setAttribute('position', position);
            targetEl.setAttribute('scale', {'x': scaleMod, 'y': scaleMod, 'z': scaleMod});

            let spawnableEls = document.querySelectorAll('.spawnable'); //location with "spawnable" tag - make into 
            if (spawnableEls.length) {
              const index = getRandomInt(spawnableEls.length);
              const spawnableEl = spawnableEls[index];
              if (spawnableEl) {
                self.spawnElement(position, rotation, scaleMod, spawnableEl);
              }
            }
          } else {
            if (self.el.components.raycaster) { //don't need this one in vr, bc right hand laser?
              console.log("gotsa ar raycaster!");
              self.el.components.raycaster.checkIntersections();
              const els = self.el.components.raycaster.intersectedEls;
              for (const el of els) {
                const obj = el.object3D;
                let elVisible = obj.visible;
                obj.traverseAncestors(parent => {
                  if (parent.visible === false ) {
                    elVisible = false
                  }
                });
                if (elVisible) {
                  const details = self.el.components.raycaster.getIntersection(el);
                  // console.log("ray hit select " + JSON.stringify(details));
                  self.messageEl.textContent = "ray hit on object " + el.id;
                  el.emit('click', details);
                  break;
                }
              }
            }
          }

          // let localPosition = new THREE.Vector3();
          var lightEl = document.getElementById('light'); //todo check for types
          if (lightEl) {
            document.getElementById('light').setAttribute('position', {
              x: (position.x - 2),
              y: (position.y + 4),
              z: (position.z + 2)
            });
          }
        });
  
        session.requestReferenceSpace('viewer').then(function (space) {
          self.viewerSpace = space;
          if (self.arHitTestEnabled) {
            session.requestHitTestSource({space: self.viewerSpace})
              .then(function (hitTestSource) {
                self.xrHitTestSource = hitTestSource;
              });
          }
        });
  
        session.requestReferenceSpace('local-floor').then(function (space) {
          self.refSpace = space;
        });


      });
  
      this.el.sceneEl.addEventListener('exit-vr', function () {
        if (self.originalPosition) { targetEl.object3D.position.copy(self.originalPosition); }
        self.el.object3D.visible = false;
      });
    },
    spawnElement: function (position, rotation, scaleMod, spawnableEl) {
      let timestamp = Date.now();
      var sceneEl = document.querySelector('a-scene');
      var targetEl = this.data.targetEl;
      //check for component types...
      let localMarker = spawnableEl.components.local_marker;
      if (localMarker) {
        let data = localMarker.data;
        console.log("spawnable data found " + JSON.stringify(data));
        let spawnedEl = document.createElement("a-entity");
        spawnedEl.id = "_" + timestamp;
            
        var obj = spawnableEl.getObject3D('mesh');
        spawnedEl.setObject3D('mesh', obj.clone()); 
        spawnedEl.object3D.scale.set(scaleMod,scaleMod,scaleMod);
        spawnedEl.classList.add("activeObjexRay");
        sceneEl.appendChild(spawnedEl);
        spawnedEl.setAttribute('position', position); //?
        // spawnedEl.setAttribute('scale', {'x': scaleMod, 'y': scaleMod, 'z': scaleMod}); //because it's not a child of ar_parent
        spawnedEl.setAttribute("anchored", {"persistent": true});
        spawnedEl.setAttribute("local_marker", { 'timestamp': "_" + timestamp,
                                                'name': data.name, 
                                                'modelID': data.modelID, 
                                                'objectID': data.objectID, 
                                                'mediaID': data.mediaID, 
                                                'tags': data.tags, 
                                                'eventData': data.eventData, 
                                                'markerType': data.markerType,
                                                'description': data.description,
                                                'xpos': data.xpos,
                                                'ypos': data.ypos,
                                                'zpos': data.zpos,
                                                'xrot': data.xrot,
                                                'yrot': data.yrot,
                                                'zrot': data.zrot,
                                                'xscale': data.xscale,
                                                'yscale': data.yscale,
                                                'zscale': data.zscale,
                                                'targetElements': data.targetElements
                                              });
        spawnedEl.setAttribute("visible", true);
        spawnedEl.object3D.visible = true;
        this.messageEl.textContent = "spawning local marker at position " + JSON.stringify(position);
      } else {
        let cloudMarker = spawnableEl.components.cloud_marker;
        if (cloudMarker) {
          let data = cloudMarker.data;
          console.log("scalemod is " + scaleMod + " spawnable data found " + JSON.stringify(data));
          let spawnedEl = document.createElement("a-entity");
          spawnedEl.id = "_" + timestamp;
          
          var obj = spawnableEl.getObject3D('mesh');
          spawnedEl.setObject3D('mesh', obj.clone()); 
          spawnedEl.object3D.scale.set(scaleMod * data.xscale,scaleMod * data.yscale,scaleMod * data.zscale);
          spawnedEl.classList.add("activeObjexRay");
          sceneEl.appendChild(spawnedEl);
          spawnedEl.setAttribute('position', position); //?
          const randomRot = getRandomInt(180);
          spawnedEl.setAttribute('rotation', {'x': rotation.x, 'y': rotation.y, 'z': randomRot});
          // spawnedEl.setAttribute("cloud_marker", { 'timestamp': "_" + timestamp,
          //                                         'name': data.name, 
          //                                         'modelID': data.modelID, 
          //                                         'objectID': data.objectID, 
          //                                         'mediaID': data.mediaID, 
          //                                         'tags': data.tags, 
          //                                         'eventData': data.eventData, 
          //                                         'markerType': data.markerType,
          //                                         'description': data.description,
          //                                         'xpos': data.xpos,
          //                                         'ypos': data.ypos,
          //                                         'zpos': data.zpos,
          //                                         'xrot': data.xrot,
          //                                         'yrot': data.yrot,
          //                                         'zrot': data.zrot,
          //                                         'xscale': data.xscale,
          //                                         'yscale': data.yscale,
          //                                         'zscale': data.zscale,
          //                                         'targetElements': data.targetElements
          //                                       });

            spawnedEl.setAttribute("anchored", {"persistent": true});
            spawnedEl.setAttribute("visible", true);
            spawnedEl.object3D.visible = true;
            this.messageEl.textContent = "spawning marker at position " + JSON.stringify(position);
        } else {
          let modModel = spawnableEl.components.mod_model;  
          if (modModel) {
            let data = modModel.data;
            console.log("spawnable data found " + JSON.stringify(data));
            let spawnedEl = document.createElement("a-entity");
            spawnedEl.id = "_" + timestamp;
            
            var obj = spawnableEl.getObject3D('mesh');
            spawnedEl.setObject3D('mesh', obj.clone()); 
            spawnedEl.object3D.scale.set(scaleMod * data.xscale,scaleMod * data.yscale,scaleMod * data.zscale);
            spawnedEl.classList.add("activeObjexRay");
            sceneEl.appendChild(spawnedEl);
            spawnedEl.setAttribute('position', position); //?
            spawnedEl.setAttribute('rotation', rotation);
            spawnedEl.setAttribute("anchored", {"persistent": true});
            // spawnedEl.setAttribute("mod_model", { 'timestamp': "_" + timestamp,
            //                                       'name': data.name, 
            //                                       'modelID': data.modelID, 
            //                                       'objectID': data.objectID, 
            //                                       'mediaID': data.mediaID, 
            //                                       'tags': data.tags, 
            //                                       'eventData': data.eventData, 
            //                                       'markerType': data.markerType,
            //                                       'description': data.description,
            //                                       'xpos': data.xpos,
            //                                       'ypos': data.ypos,
            //                                       'zpos': data.zpos,
            //                                       'xrot': data.xrot,
            //                                       'yrot': data.yrot,
            //                                       'zrot': data.zrot,
            //                                       'xscale': data.xscale,
            //                                       'yscale': data.yscale,
            //                                       'zscale': data.zscale,
            //                                       'targetElements': data.targetElements
            //                                     });
              spawnedEl.setAttribute("visible", true);
              spawnedEl.object3D.visible = true;
              this.messageEl.textContent = "spawning model at position " + JSON.stringify(position);
          } else {
            let modObject = spawnableEl.components.mod_object;
            if (modObject) {
              console.log("spawnable data found " + JSON.stringify(data));
              let data = modObject.data;
              let spawnedEl = document.createElement("a-entity");
              spawnedEl.id = "_" + timestamp;
              var obj = spawnableEl.getObject3D('mesh');
              spawnedEl.setObject3D('mesh', obj.clone()); 
              spawnedEl.object3D.scale.set(scaleMod,scaleMod,scaleMod);
              spawnedEl.classList.add("activeObjexRay");
              sceneEl.appendChild(spawnedEl);
              spawnedEl.setAttribute('position', position); //?od, 'z': scaleMod});
              spawnedEl.setAttribute("anchored", {"persistent": true});
              // spawnedEl.setAttribute("mod_object", { 'timestamp': "_" + timestamp,
              //                                       'name': data.name, 
              //                                       'modelID': data.modelID, 
              //                                       'objectID': data.objectID, 
              //                                       'mediaID': data.mediaID, 
              //                                       'tags': data.tags, 
              //                                       'eventData': data.eventData, 
              //                                       'markerType': data.markerType,
              //                                       'description': data.description,
              //                                       'xpos': data.xpos,
              //                                       'ypos': data.ypos,
              //                                       'zpos': data.zpos,
              //                                       'xrot': data.xrot,
              //                                       'yrot': data.yrot,
              //                                       'zrot': data.zrot,
              //                                       'xscale': data.xscale,
              //                                       'yscale': data.yscale,
              //                                       'zscale': data.zscale,
              //                                       'targetElements': data.targetElements
              //                                     });
                spawnedEl.setAttribute("visible", true);
                spawnedEl.object3D.visible = true;
                this.messageEl.textContent = "spawning object at position " + JSON.stringify(position);
            }
          }
        }
      } 
    },
    scaleTargetElements: function (dir) {
      var targetEl = this.data.targetEl;
      if (targetEl) {
        let targetScale = targetEl.getAttribute("scale");
        console.log("targetEl scale is " + JSON.stringify(targetScale));
        if (dir == "up") {
          targetEl.setAttribute("scale", {"x": targetScale.x + .05, "y": targetScale.x + .05, "z": targetScale.x + .05})
        } else {
          if (targetScale.x > .1) {
            targetEl.setAttribute("scale", {"x": targetScale.x - .05, "y": targetScale.x - .05, "z": targetScale.x - .05})
          } else {
            if (targetScale.x > .001) {
              targetEl.setAttribute("scale", {"x": targetScale.x - .001, "y": targetScale.x - .001, "z": targetScale.x - .001})
            } else {
              if (targetScale.x > .0001) {
                targetEl.setAttribute("scale", {"x": targetScale.x - .0001, "y": targetScale.x - .0001, "z": targetScale.x - .0001})
              }
            }
          }
        }
      }
    },
    rotateTargetElements: function (dir) {
      var targetEl = this.data.targetEl;
      if (targetEl) {
        let targetRot = targetEl.getAttribute("rotation");
        console.log("targetEl rot is " + JSON.stringify(targetRot));
        if (dir == "right") {
          targetEl.setAttribute("rotation", {"x": targetRot.x, "y": targetRot.y + 10, "z": targetRot.z})
        } else {
            targetEl.setAttribute("rotation", {"x": targetRot.x, "y": targetRot.y - 10, "z": targetRot.z})
        }
      }
    },
    toggleLockElements: function () {
      if (this.arHitTestEnabled) {
        this.lockTargets = !this.lockTargets;
        var targetEl = this.data.targetEl;
        const unlockedButtonsEl = document.getElementById("unlockedButtons");
        if (targetEl) {
          if (this.lockTargets) {
            console.log("locked");
            targetEl.setAttribute("anchored", {"persistent": true});
            this.el.object3D.visible = false;
            this.arRaycasterEnabled = true;
            this.messageEl.textContent = "hit test disabled, raycaster enabled";
            if (unlockedButtonsEl) {
              unlockedButtonsEl.style.visibility = 'visible';
            }
          } else {
            console.log("unlocked");
            targetEl.removeAttribute("anchored");
            this.el.object3D.visible = true;
            //enable raycast here?
            this.arRaycasterEnabled = false;
            this.messageEl.textContent = "hit test enabled, raycaster disabled";
            if (unlockedButtonsEl) {
              unlockedButtonsEl.style.visibility = 'hidden';
            }
          }
        }
      }
    },
    tick: function () {
      var frame;
      var xrViewerPose;
      var xrHitPose;
      var hitTestResults;
      var pose;
      var inputMat;
      var position;
      var normal;
      var distance;
      var direction;
  
      if (this.el.sceneEl.is('ar-mode') && !this.lockTargets && this.arHitTestEnabled) {
        if (!this.viewerSpace) { return; }
        frame = this.el.sceneEl.frame;
        if (!frame) { return; }
        xrViewerPose = frame.getViewerPose(this.refSpace);
        // getHitPose = frame.getHitPose
        if (this.xrHitTestSource && xrViewerPose) {
          hitTestResults = frame.getHitTestResults(this.xrHitTestSource);
          if (hitTestResults.length > 0) {
            pose = hitTestResults[0].getPose(this.refSpace);
            
            inputMat = new THREE.Matrix4();
            inputMat.fromArray(pose.transform.matrix);
  
            position = new THREE.Vector3();
            // rotation = new THREE.Quaternion();
            position.setFromMatrixPosition(inputMat);
            // rotation.setFromMatrixRotation(inputMat);
            // rotation.setFromRotationMatrix(inputMat);
            this.el.setAttribute('position', position);
            // this.el.setAttribute('rotation', pose.transform.orientation);
            // this.el.object3D.position.set(position);
            // this.el.object3D.rotation.set(pose.transform.orientation);
          }
        }
      } else {
        if (this.el.sceneEl.is('ar-mode') && this.arRaycasterEnabled) {

          if (!this.viewerSpace) { return; }
          frame = this.el.sceneEl.frame;
          if (!frame) { return; }
          direction = new THREE.Vector3();
          xrViewerPose = frame.getViewerPose(this.refSpace);
          const transform = xrViewerPose.transform;
          
          direction.set(0, 0, -1);
          direction.applyQuaternion(transform.orientation);
          this.el.setAttribute("raycaster", {
            objects: ".activeObjexRay",
            origin: transform.position,
            direction
          });
          this.el.components.raycaster.checkIntersections();
          const els = this.el.components.raycaster.intersectedEls;
          for (const el of els) {
            const obj = el.object3D;
            let elVisible = obj.visible;
            obj.traverseAncestors(parent => {
              if (parent.visible === false ) {
                elVisible = false
              }
            });
            if (elVisible) {
              const details = this.el.components.raycaster.getIntersection(el);
              // console.log("hit test details " + JSON.stringify(details));
              el.emit('mouseenter', details);
              // Don't go to the next element
              break;
            }
          }
        }
      }
    }
  });

  AFRAME.registerComponent('left_controller_buttons', {
    init: function () {
      var el = this.el;
      el.addEventListener('xbuttondown', (evt) => {
        console.log("x down " + evt.detail); 
         this.toggleX();
      });
      el.addEventListener('ybuttondown', (evt) => {
        console.log("y down " + evt.detail); 

         this.toggleY();
      });
      this.arHitCasterEl = document.getElementById("hitCaster");
      this.hitCasterComponent = null;
      if (this.arHitCasterEl) {
        this.hitCasterComponent = this.arHitCasterEl.components.ar_hit_caster;
      }
      this.debug = false;
    },
    toggleX: function () { //lock elements = disable hit test/ar-parent positioning
      if (this.hitCasterComponent) {
        console.log("x down..");
        this.hitCasterComponent.toggleLockElements();
      }
    },
    toggleY: function () { //toggle debug if xr-room
      let sceneEl = this.el.sceneEl;
      this.xrRoomPhysicsComponent = sceneEl.components.xr_room_physics;
    // if (this.hitCasterComponent) {
      console.log("y down..");

      if (this.xrRoomPhysicsComponent) {
        this.debug = !this.debug;
        this.el.sceneEl.setAttribute('xr_room_physics', { debug: this.debug })
      }
    }
  });

  
  AFRAME.registerComponent('left_controller_thumb',{ 
    init: function () {
      this.el.addEventListener('thumbstickmoved', this.logThumbstick);
    },

    logThumbstick: function (evt) {
      this.arHitCasterEl = document.getElementById("hitCaster");
      this.hitCasterComponent = null;
      if (this.arHitCasterEl) {
        this.hitCasterComponent = this.arHitCasterEl.components.ar_hit_caster;
      }
      if (evt.detail.y > 0.95) { 
        if (this.hitCasterComponent) {
          console.log("DOWN"); 
          this.hitCasterComponent.scaleTargetElements("down");
        }
      }
      if (evt.detail.y < -0.95) { 
        console.log("UP"); 
        if (this.hitCasterComponent) {
          this.hitCasterComponent.scaleTargetElements("up");
        }

      }
      if (evt.detail.x < -0.95) { 
        console.log("LEFT"); 
        if (this.hitCasterComponent) {
          this.hitCasterComponent.rotateTargetElements("left");
        }

      }
      if (evt.detail.x > 0.95) { 
        console.log("right"); 
        if (this.hitCasterComponent) {
          this.hitCasterComponent.rotateTargetElements("right");
        }
      }
    }
  });

  AFRAME.registerComponent('show-in-ar-mode', {
    // Set this object invisible while in AR mode.
    init: function () {

        // this.el.setAttribute('visible', false);
          
      this.el.sceneEl.addEventListener('enter-vr', (ev) => {
        // this.wasVisible = this.el.getAttribute('visible');

        if (this.el.sceneEl.is('ar-mode')) {
            this.el.setAttribute('visible', true);
        
        } else {
            this.el.setAttribute('visible', false);
        }
      });
      this.el.sceneEl.addEventListener('exit-vr', (ev) => {
        if (this.wasVisible) this.el.setAttribute('visible', false);
      });
    }
  });


  /* global AFRAME */
  AFRAME.registerComponent('anchor-grabbed-entity', {
    init: function () {
      this.el.addEventListener('grabstarted', this.deleteAnchor.bind(this));
      this.el.addEventListener('grabended', this.updateAnchor.bind(this));
    },

    updateAnchor: function (evt) {
      var grabbedEl = evt.detail.grabbedEl;
      var anchoredComponent = grabbedEl.components.anchored;
      if (anchoredComponent) {
        anchoredComponent.createAnchor(grabbedEl.object3D.position, grabbedEl.object3D.quaternion);
      }
    },

    deleteAnchor: function (evt) {
      var grabbedEl = evt.detail.grabbedEl;
      var anchoredComponent = grabbedEl.components.anchored;
      if (anchoredComponent) {
        anchoredComponent.deleteAnchor();
      }
    }
  }); 



  /* global AFRAME */
  // mod from https://github.com/aframevr/aframe/blob/master/examples/mixed-reality/real-world-meshing/coffee-spawner.js

AFRAME.registerComponent('pinch_fu', {
  schema: {
    delay: {default: 250},
    targetElementSelector: {default: ''}
  },
  init: function () {
    var el = this.el;
    this.delaySpawn = this.delaySpawn.bind(this);
    this.cancelDelayedSpawn = this.cancelDelayedSpawn.bind(this);
    // this.onCollisionEnded = this.onCollisionEnded.bind(this);
    // this.onCollisionStarted = this.onCollisionStarted.bind(this);
    this.el.addEventListener('pinchstarted', this.delaySpawn);
    this.el.addEventListener('pinchended', this.cancelDelayedSpawn);
    // el.addEventListener('obbcollisionstarted', this.onCollisionStarted);
    // el.addEventListener('obbcollisionended', this.onCollisionEnded);
    this.enabled = true;
    this.spawnedIndex = 0;
  },

  delaySpawn: function (evt) {
    this.pinchEvt = evt;
    this.spawnDelay = this.data.delay;
    console.log("start pinch");
  },

  cancelDelayedSpawn: function (evt) {
    this.spawnDelay = undefined;
    console.log("end pinch");
  },

  tick: function (time, delta) {
    if (!this.spawnDelay) { return; }
    this.spawnDelay -= delta;
    if (this.spawnDelay <= 0) {
      this.spawn(this.pinchEvt);
      this.spawnDelay = undefined;
    }
  },

  spawn: function (evt) {
    var auxEuler = this.auxEuler;
    var sceneEl = this.el.sceneEl;
    this.spawnedIndex++;
    // var saucerEl = document.createElement('a-entity');
    var spawnedEl = document.createElement('a-entity');
    let timestamp = Date.now();
    var animateScale = function (evt) {
      evt.target.setAttribute('animation', {
        property: 'scale',
        from: {x: 0, y: 0, z: 0},
        to: {x: .15, y: .15, z: .15},
        dur: 200
      });
    };

    // if (!this.enabled) { return; }
    // if (this.data.targetElementSelector && !this.targetEl) { return; }


    // saucerEl.setAttribute('gltf-model', '#coffee');
    // saucerEl.setAttribute('grabbable', '');
    // saucerEl.setAttribute('hide-model-parts', 'parts: coffee, cup, handle');
    // saucerEl.setAttribute('scale', '0.0015 0.0015 0.0015');
    // saucerEl.setAttribute('position', evt.detail.position);
    // saucerEl.addEventListener('loaded', animateScale);
    // sceneEl.appendChild(saucerEl);

    // cupEl.setAttribute('gltf-model', '#coffee');
    // cupEl.setAttribute('grabbable', '');
    // cupEl.setAttribute('hide-model-parts', 'parts: saucer');
    // cupEl.setAttribute('rotation', '0 90 0');
    // cupEl.setAttribute('scale', '0.0015 0.0015 0.0015');
    // cupEl.setAttribute('position', evt.detail.position);
    // cupEl.addEventListener('loaded', animateScale);

    spawnedEl.setAttribute('geometry',  {'primitive': 'box', 'width': '1', 'height': '1'});
    // spawnedEl.setAttribute('light', {
    //   type: 'point',
    //   distance: 30,
    //   intensity: 2.0
    // });
    spawnedEl.setAttribute('material', 'color', 'crimson');
    spawnedEl.setAttribute('grabbable', {'hand': 'right'});
    // spawnedEl.setAttribute('hand_tracking_pressable', {'label': 'thing ' + this.spawnedIndex});
    spawnedEl.id = "spawned_" + timestamp;
    // spawnedEl.setAttribute('scale', '0.15 0.15 0.15');
    spawnedEl.setAttribute('position', evt.detail.position);
    spawnedEl.addEventListener('loaded', animateScale);

    sceneEl.appendChild(spawnedEl);
  },

  // onCollisionStarted: function (evt) {
  //   console.log("start collision " + evt.detail.withEl.id);
  //   var targetElementSelector = this.data.targetElementSelector;
  //   var targetEl = targetElementSelector && this.el.sceneEl.querySelector(targetElementSelector);
  //   if (targetEl === evt.detail.withEl) {
  //     this.targetEl = targetEl;
  //     return;
  //   }
  //   this.enabled = false;
  // },

  // onCollisionEnded: function (evt) {
  //   console.log("end collision " + evt.detail.withEl.id);
  //   var targetElementSelector = this.data.targetElementSelector;
  //   var targetEl = targetElementSelector && this.el.sceneEl.querySelector(targetElementSelector);
  //   if (targetEl === evt.detail.withEl) {
  //     this.targetEl = undefined;
  //     return;
  //   }
  //   this.enabled = true;
  // }
});

///////////////////////////////////// - global functions
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function ToggleLockTargetElements () {
  let arHitCasterEl = document.getElementById("hitCaster");
  if (arHitCasterEl) {
    let hitCasterComponent = arHitCasterEl.components.ar_hit_caster;
    if (hitCasterComponent) {
      hitCasterComponent.toggleLockElements();
    }
  }
}

function ScaleTargetElements (dir) {
  let arHitCasterEl = document.getElementById("hitCaster");
  let hitCasterComponent = arHitCasterEl.components.ar_hit_caster;
  if (hitCasterComponent) {
      hitCasterComponent.scaleTargetElements(dir)
  }
}

function RotateTargetElements (dir) {
  let arHitCasterEl = document.getElementById("hitCaster");
  let hitCasterComponent = arHitCasterEl.components.ar_hit_caster;
  if (hitCasterComponent) {
      hitCasterComponent.rotateTargetElements(dir)
  }
}

/* global AFRAME, THREE */
AFRAME.registerComponent('pressable', {
  schema: {
    pressDistance: { default: 0.06 }
  },

  init: function () {
    this.worldPosition = new THREE.Vector3();
    this.handEls = document.querySelectorAll('[hand-tracking-controls]');
    this.pressed = false;
  },

  tick: function () {
    var handEls = this.handEls;
    var handEl;
    var distance;
    for (var i = 0; i < handEls.length; i++) {
      handEl = handEls[i];
      distance = this.calculateFingerDistance(handEl.components['hand-tracking-controls'].indexTipPosition);
      if (distance < this.data.pressDistance) {
        if (!this.pressed) { this.el.emit('pressedstarted'); }
        this.pressed = true;
        console.log(this.el.id + " pressable pressed with finger distance " + distance);
        return;
      }
    }
    if (this.pressed) { this.el.emit('pressedended'); }
    this.pressed = false;
  },

  calculateFingerDistance: function (fingerPosition) {
    var el = this.el;
    var worldPosition = this.worldPosition;

    worldPosition.copy(el.object3D.position);
    el.object3D.parent.updateMatrixWorld();
    el.object3D.parent.localToWorld(worldPosition);
   
    return worldPosition.distanceTo(fingerPosition);
  }
});


/* global AFRAME */
AFRAME.registerComponent('hand_tracking_pressable', {
  schema: {
    label: {default: 'label'},
    width: {default: 0.11},
    toggable: {default: true}
  },
  init: function () {
    var el = this.el;
    var labelEl = this.labelEl = document.createElement('a-entity');

    this.color = '#3a50c5';
    // el.setAttribute('geometry', {
    //   primitive: 'box',
    //   width: this.data.width,
    //   height: 0.05,
    //   depth: 0.04
    // });

    // el.setAttribute('material', {color: this.color});
    el.setAttribute('pressable', '');

    labelEl.setAttribute('position', '0 0 0.16');
    labelEl.setAttribute('text', {
      value: this.data.label,
      color: 'white',
      align: 'center'
    });

    labelEl.setAttribute('scale', '0.75 0.75 0.75');
    this.el.appendChild(labelEl);

    this.bindMethods();
    this.el.addEventListener('stateadded', this.stateChanged);
    this.el.addEventListener('stateremoved', this.stateChanged);
    this.el.addEventListener('pressedstarted', this.onPressedStarted);
    this.el.addEventListener('pressedended', this.onPressedEnded);
  },

  bindMethods: function () {
    this.stateChanged = this.stateChanged.bind(this);
    this.onPressedStarted = this.onPressedStarted.bind(this);
    this.onPressedEnded = this.onPressedEnded.bind(this);
  },

  update: function (oldData) {
    if (oldData.label !== this.data.label) {
      this.labelEl.setAttribute('text', 'value', this.data.label);
    }
  },

  stateChanged: function () {
    var color = this.el.is('pressed') ? 'green' : this.color;
    this.el.setAttribute('material', {color: color});
  },

  onPressedStarted: function () {
    var el = this.el;
    el.setAttribute('material', {color: 'green'});
    el.emit('click');

    if (this.data.togabble) {
      if (el.is('pressed')) {
        el.removeState('pressed');
        this.labelEl.setAttribute('text', {
          value: this.data.label + " off",
          color: 'white',
          align: 'center'
        });
      } else {
        el.addState('pressed');
        this.labelEl.setAttribute('text', {
          value: this.data.label + " on",
          color: 'white',
          align: 'center'
        });
      }
    }
  },

  onPressedEnded: function () {
    if (this.el.is('pressed')) { return; }
    this.el.setAttribute('material', {color: this.color});
  }
});
