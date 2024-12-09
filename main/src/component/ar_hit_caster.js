/* global AFRAME, THREE */
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

        console.log("enter-vr");
        // messageEl.textContent = "entered immersive mode";
        if (!self.el.sceneEl.is('ar-mode')) { return; }
        if (AFRAME.utils.device.checkHeadsetConnected()) {
          if (settings && settings.useXrRoomPhysics) {
            sceneEl.setAttribute("xr-room-physics");
          }
          if (settings && settings.useRealWorldMeshing) {
            sceneEl.setAttribute("xr-room-physics");
          } 
        }
        session = self.el.sceneEl.renderer.xr.getSession();
        self.messageEl.textContent = "entered AR mode";
        console.log("ar-mode");

        let arOverlay = document.getElementById("ar_overlay");
        if (arOverlay) {
          arOverlay.style.visibility = 'visible';
        }
        
        self.originalPosition = targetEl.object3D.position.clone();
        self.el.object3D.visible = true;
        self.messageEl.textContent = "scanning for surface....";
        // this.camera = session.renderer.xr.getCamera().cameras[0];
        
        session.addEventListener('select', function () {

          var position = el.getAttribute('position');
          const zeroPos = new THREE.Vector3(0, 0, 0); //hrm, use camera or player? viewportHolder?
          var distance = position.distanceTo(zeroPos);

          var scaleMod = .1 + (distance * 0.2);
          
          if (!self.lockTargets) {
            console.log("tryna set position " + JSON.stringify(position) + " distance " + JSON.stringify(distance));
            self.messageEl.textContent = "surface found at position " + JSON.stringify(position);
            targetEl.setAttribute('position', position);
            targetEl.setAttribute('scale', {'x': scaleMod, 'y': scaleMod, 'z': scaleMod});

            // let spawnedEl = null;
            // let data = {};

            let spawnableEl = document.querySelector('.spawnable'); //location with "spawnable" tag
            if (spawnableEl) {
              self.spawnElement(position, scaleMod, spawnableEl);
              // var sceneEl = document.querySelector('a-scene');
              // let localMarker = spawnableEl.components.local_marker;
              // if (localMarker) {
              //   let data = localMarker.data;
              //   console.log("spawnable data found " + JSON.stringify(data));
              //   let spawnedEl = document.createElement("a-entity");
              //   spawnedEl.id = "_" + timestamp;
              //   sceneEl.appendChild(spawnedEl); //hrm, not child of ar parent?  worldToLocal?
              //   spawnedEl.setAttribute('position', position); //?
              //   spawnedEl.setAttribute('scale', {'x': scaleMod * .2, 'y': scaleMod  * .2, 'z': scaleMod * .2}); //because it's not a child of ar_parent
              //   spawnedEl.setAttribute("anchored", {"persistent": true});
              //   spawnedEl.setAttribute("local_marker", { timestamp: "_" + timestamp,
              //                                           name: data.name, 
              //                                           modelID: data.modelID, 
              //                                           objectID: data.objectID, 
              //                                           mediaID: data.mediaID, 
              //                                           tags: data.tags, 
              //                                           eventData: data.eventData, 
              //                                           markerType: data.markerType,
              //                                           description: data.description,
              //                                           xpos: data.xpos,
              //                                           ypos: data.ypos,
              //                                           zpos: data.zpos,
              //                                           xrot: data.xrot,
              //                                           yrot: data.yrot,
              //                                           zrot: data.zrot,
              //                                           xscale: data.xscale,
              //                                           yscale: data.yscale,
              //                                           zscale: data.zscale,
              //                                           targetElements: data.targetElements
              //                                         });

              //   self.messageEl.textContent = "spawning local marker at position " + JSON.stringify(position);

              // } else {
                
              //     let cloudMarker = spawnableEl.components.cloud_marker;
              //     if (cloudMarker) {
              //       let data = cloudMarker.data;
              //       console.log("spawnable data found " + JSON.stringify(data));
              //       let spawnedEl = document.createElement("a-entity");
              //       spawnedEl.id = "_" + timestamp;

              //       sceneEl.appendChild(spawnedEl); //hrm, not child of ar parent?  worldToLocal?
              //       spawnedEl.setAttribute('position', position); 
              //       spawnedEl.setAttribute('scale', {'x': scaleMod * .2, 'y': scaleMod  * .2, 'z': scaleMod * .2});
              //       spawnedEl.setAttribute("cloud_marker", { timestamp: "_" + timestamp,
              //                                               name: data.name, 
              //                                               modelID: data.modelID, 
              //                                               objectID: data.objectID, 
              //                                               mediaID: data.mediaID, 
              //                                               tags: data.tags, 
              //                                               eventData: data.eventData, 
              //                                               markerType: data.markerType,
              //                                               description: data.description,
              //                                               xpos: data.xpos,
              //                                               ypos: data.ypos,
              //                                               zpos: data.zpos,
              //                                               xrot: data.xrot,
              //                                               yrot: data.yrot,
              //                                               zrot: data.zrot,
              //                                               xscale: data.xscale,
              //                                               yscale: data.yscale,
              //                                               zscale: data.zscale,
              //                                               targetElements: data.targetElements
              //                                             });

              //         spawnedEl.setAttribute("anchored", {"persistent": true});
              //         self.messageEl.textContent = "spawning marker at position " + JSON.stringify(position);
              //     } else {
              //       let modModel = spawnableEl.components.mod_model;  
              //       if (modModel) {
              //         let data = modModel.data;
              //         console.log("spawnable data found " + JSON.stringify(data));
              //         let spawnedEl = document.createElement("a-entity");
              //         spawnedEl.id = "_" + timestamp;
                     
              //         sceneEl.appendChild(spawnedEl); 
              //         spawnedEl.setAttribute('position', position); 
              //         spawnedEl.setAttribute('scale', {'x': scaleMod * .2, 'y': scaleMod  * .2, 'z': scaleMod * .2});
              //         spawnedEl.setAttribute("anchored", {"persistent": true});
              //         spawnedEl.setAttribute("mod_model", { timestamp: "_" + timestamp,
              //                                               name: data.name, 
              //                                               modelID: data.modelID, 
              //                                               objectID: data.objectID, 
              //                                               mediaID: data.mediaID, 
              //                                               tags: data.tags, 
              //                                               eventData: data.eventData, 
              //                                               markerType: data.markerType,
              //                                               description: data.description,
              //                                               xpos: data.xpos,
              //                                               ypos: data.ypos,
              //                                               zpos: data.zpos,
              //                                               xrot: data.xrot,
              //                                               yrot: data.yrot,
              //                                               zrot: data.zrot,
              //                                               xscale: data.xscale,
              //                                               yscale: data.yscale,
              //                                               zscale: data.zscale,
              //                                               targetElements: data.targetElements
              //                                             });

              //           self.messageEl.textContent = "spawning model at position " + JSON.stringify(position);
              //       } else {
              //         let modObject = spawnableEl.components.mod_object;
              //         if (modObject) {
              //           console.log("spawnable data found " + JSON.stringify(data));
              //           let data = modObject.data;
              //           let spawnedEl = document.createElement("a-entity");
              //           spawnedEl.id = "_" + timestamp;

              //           sceneEl.appendChild(spawnedEl); 
              //           spawnedEl.setAttribute('position', position); 
              //           spawnedEl.setAttribute('scale', {'x': scaleMod * .2, 'y': scaleMod  * .2, 'z': scaleMod * .2});
              //           spawnedEl.setAttribute("anchored", {"persistent": true});
              //           spawnedEl.setAttribute("mod_object", { timestamp: "_" + timestamp,
              //                                                 name: data.name, 
              //                                                 modelID: data.modelID, 
              //                                                 objectID: data.objectID, 
              //                                                 mediaID: data.mediaID, 
              //                                                 tags: data.tags, 
              //                                                 eventData: data.eventData, 
              //                                                 markerType: data.markerType,
              //                                                 description: data.description,
              //                                                 xpos: data.xpos,
              //                                                 ypos: data.ypos,
              //                                                 zpos: data.zpos,
              //                                                 xrot: data.xrot,
              //                                                 yrot: data.yrot,
              //                                                 zrot: data.zrot,
              //                                                 xscale: data.xscale,
              //                                                 yscale: data.yscale,
              //                                                 zscale: data.zscale,
              //                                                 targetElements: data.targetElements
              //                                               });

              //             self.messageEl.textContent = "spawning object at position " + JSON.stringify(position);
              //         }
              //       }
              //     }
              //   } 
              }
          } else {
            if (self.el.components.raycaster) {
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
    spawnElement: function (position, scaleMod, spawnableEl) {
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
        targetEl.appendChild(spawnedEl); //hrm, not child of ar parent?  worldToLocal?
        spawnedEl.setAttribute('position', position); //?
        spawnedEl.setAttribute('scale', {'x': scaleMod, 'y': scaleMod, 'z': scaleMod}); //because it's not a child of ar_parent
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
            
            const index = getRandomInt(targets.length);
            console.log("tryna clone a target with index " + index);
            var obj = spawnableEl.getObject3D('mesh');

            // var clone = targets[index].cloneNode(true);
            // let clone = document.createElement('a-entity');
            // let scaleFactor = Math.random();
            spawnedEl.setObject3D('mesh', obj.clone()); 
            spawnedEl.setAttribute('position', position);
            spawnedEl.setAttribute('scale', {scaleFactor, scaleFactor, scaleFactor});
            spawnedEl.classList.add("activeObjexRay");

            sceneEl.appendChild(spawnedEl);

            // targetEl.appendChild(spawnedEl); 
            spawnedEl.setAttribute('position', position); 
            spawnedEl.setAttribute('scale', {'x': scaleMod, 'y': scaleMod, 'z': scaleMod});
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
             
              targetEl.appendChild(spawnedEl); 
              spawnedEl.setAttribute('position', position); 
              spawnedEl.setAttribute('scale', {'x': scaleMod, 'y': scaleMod, 'z': scaleMod});
              spawnedEl.setAttribute("anchored", {"persistent": true});
              spawnedEl.setAttribute("mod_model", { 'timestamp': "_" + timestamp,
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
                this.messageEl.textContent = "spawning model at position " + JSON.stringify(position);
            } else {
              let modObject = spawnableEl.components.mod_object;
              if (modObject) {
                console.log("spawnable data found " + JSON.stringify(data));
                let data = modObject.data;
                let spawnedEl = document.createElement("a-entity");
                spawnedEl.id = "_" + timestamp;

                targetEl.appendChild(spawnedEl); 
                spawnedEl.setAttribute('position', position); 
                spawnedEl.setAttribute('scale', {'x': scaleMod, 'y': scaleMod, 'z': scaleMod});
                spawnedEl.setAttribute("anchored", {"persistent": true});
                spawnedEl.setAttribute("mod_object", { 'timestamp': "_" + timestamp,
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
          targetEl.setAttribute("rotation", {"x": targetRot.z + 1, "y": targetRot.z + 1, "z": targetRot.z + 1})
        } else {
          // if (targetScale.x > .1) {
            targetEl.setAttribute("rotation", {"x": targetRot.z - 1, "y": targetRot.z - 1, "z": targetRot.z - 1})
          // }
        }
      }
    },
    toggleLockElements: function () {
      this.lockTargets = !this.lockTargets;
      var targetEl = this.data.targetEl;
      if (targetEl) {
        if (this.lockTargets) {
          console.log("locked");
          targetEl.setAttribute("anchored", {"persistent": true});
          this.el.object3D.visible = false;
          this.arRaycasterEnabled = true;
          this.messageEl.textContent = "hit test disabled, raycaster enabled";
        } else {
          console.log("unlocked");
          targetEl.removeAttribute("anchored");
          this.el.object3D.visible = true;
          //enable raycast here?
          this.arRaycasterEnabled = false;
          this.messageEl.textContent = "hit test enabled, raycaster disabled";
        }
      }
    },
    tick: function () {
      var frame;
      var xrViewerPose;
      var hitTestResults;
      var pose;
      var inputMat;
      var position;
      var direction;
  
      if (this.el.sceneEl.is('ar-mode') && !this.lockTargets) {
        if (!this.viewerSpace) { return; }
        frame = this.el.sceneEl.frame;
        if (!frame) { return; }
        xrViewerPose = frame.getViewerPose(this.refSpace);
  
        if (this.xrHitTestSource && xrViewerPose) {
          hitTestResults = frame.getHitTestResults(this.xrHitTestSource);
          if (hitTestResults.length > 0) {
            pose = hitTestResults[0].getPose(this.refSpace);
  
            inputMat = new THREE.Matrix4();
            inputMat.fromArray(pose.transform.matrix);
  
            position = new THREE.Vector3();
            position.setFromMatrixPosition(inputMat);
            this.el.setAttribute('position', position);
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