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
            // sceneEl.setAttribute("xr_room_physics", {"debug": true});
            console.log("tryna set xr_room_physics"); //set on server, because...
            // let rightHandEl = document.getElementById("right-hand");
            // if (rightHandEl) {
            //   rightHandEl.setAttribute("controller_ball_blaster");
            // }
          if (settings && settings.useRealWorldMeshing) {
            sceneEl.setAttribute("real-world-meshing");
          }             
        } else {
          if (settings && (settings.useXrRoomPhysics || settings.useRealWorldMeshing)) {
            self.messageEl.textContent = "Mixed Reality not supported on this device!";
            console.log("Mixed Reality not supported on this device!");
            sceneEl.removeAttribute("xr_room_physics");
          }
        }
      } else { //just in case...
        console.log("mixed reality not supported...");
        sceneEl.removeAttribute("xr_room_physics");
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
          if (!self.lockTargets) {
            console.log("tryna set position " + JSON.stringify(position) + " distance " + JSON.stringify(distance));
            self.messageEl.textContent = "surface found at position " + JSON.stringify(position);
            targetEl.setAttribute('position', position);
            targetEl.setAttribute('scale', {'x': scaleMod, 'y': scaleMod, 'z': scaleMod});

            // let spawnedEl = null;
            // let data = {};

            let spawnableEls = document.querySelectorAll('.spawnable'); //location with "spawnable" tag
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
          session.requestHitTestSource({space: self.viewerSpace})
              .then(function (hitTestSource) {
                self.xrHitTestSource = hitTestSource;
              });
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
          spawnedEl.setAttribute('rotation', rotation);
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
          // if (targetScale.x > .1) {
            targetEl.setAttribute("rotation", {"x": targetRot.x, "y": targetRot.y - 10, "z": targetRot.z})
          // }
        }
      }
    },
    toggleLockElements: function () {
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
  
      if (this.el.sceneEl.is('ar-mode') && !this.lockTargets) {
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
      this.el.addEventListener('xbuttondown', (evt) => {
        console.log("x down " + evt.detail); 
         this.toggleX();
      });
      this.el.addEventListener('ybuttondown', (evt) => {
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