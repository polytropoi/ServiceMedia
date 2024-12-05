    AFRAME.registerComponent('exit-ar-button', {
      schema: {
          element: {type: 'selector'}
      },
      init: function () {
        this.data.element.addEventListener('click', ev => {
            this.el.sceneEl.renderer.xr.getSession().end();
        });
      }
    });


    AFRAME.registerComponent('usdz', { //catch the usdz links if in iOS and there's one or more in the scene
      schema: {
        initialized: {default: ''},
        // usdzData: {
        //   parse: JSON.parse,
        //   stringify: JSON.stringify
        // }
        usdzData: {default: ''} //just one for now
      },
      init: function() {
        let usdzFiles = this.data.usdzData;
          console.log("usdz data " + JSON.stringify(usdzFiles));
          document.querySelector('a-scene').addEventListener('loaded', function () { //for sure?
        //     console.log("AFRAME Init");
            // previewUSDZ(usdzFiles);
            ShowARButton(usdzFiles);

          });    
          // this.el.setAttribute("primary_audio_control", "timekeys", this.timekeys);
      }
      // usdzLink: (function () {
      //   const anchor = document.createElement('a');
      //   anchor.setAttribute('rel', 'ar');
      //   anchor.appendChild(document.createElement('img'));
      //   anchor.setAttribute('href', this.data.usdzData);
      //   anchor.click();
      // })
    });
    // See also https://github.com/aframevr/aframe/pull/4356


    // (function() {
    // "use strict";
    // const direction = new THREE.Vector3();
      
    // AFRAME.registerComponent("ar-cursor", { 
    //       dependencies: ["raycaster"],
    //       init() {
    //         const sceneEl = this.el;

    //           sceneEl.addEventListener('enter-vr', function () {
    //             if (sceneEl.is('ar-mode')) {
    //               sceneEl.xrSession.addEventListener("select", this.onselect.bind(this));
    //               let ar_overlayEl = document.getElementById("ar_overlay");
    //               if (ar_overlayEl) {
    //                 ar_overlayEl.textContent = '';
    //                 sceneEl.addEventListener('ar-hit-test-start', function () {
    //                   ar_overlayEl.innerHTML = `Scanning environment, finding surface.`
    //                 }, { once: true });
    //                 sceneEl.addEventListener('ar-hit-test-achieved', function () {
    //                   ar_overlayEl.innerHTML = `Select the location to place objects by tapping on the screen or selecting with your controller.`
    //                 }, { once: true });
    //                 sceneEl.addEventListener('ar-hit-test-select', function () {
    //                   ar_overlayEl.textContent = 'Object placed!';
    //                 }, { once: true });
    //               }
    //             }
    //           });
    //         // }
    //       },
    //       onselect(e) {
    //         const frame = e.frame;
    //         const inputSource = e.inputSource;
    //         const referenceSpace = this.el.renderer.xr.getReferenceSpace();
    //         const pose = frame.getPose(inputSource.targetRaySpace, referenceSpace);
    //         const transform = pose.transform;
            
    //         direction.set(0, 0, -1);
    //         direction.applyQuaternion(transform.orientation);
    //         this.el.setAttribute("raycaster", {
    //           origin: transform.position,
    //           direction
    //         });
    //         this.el.components.raycaster.checkIntersections();
    //         const els = this.el.components.raycaster.intersectedEls;
    //         for (const el of els) {
    //           const obj = el.object3D;
    //           let elVisible = obj.visible;
    //           obj.traverseAncestors(parent => {
    //             if (parent.visible === false ) {
    //               elVisible = false
    //             }
    //           });
    //           if (elVisible) {
                
    //             // Cancel the ar-hit-test behaviours
    //             this.el.components['ar-hit-test'].hitTest = null;
    //             this.el.components['ar-hit-test'].bboxMesh.visible = false;
                
    //             // Emit click on the element for events
    //             const details = this.el.components.raycaster.getIntersection(el);
    //             console.log("cursor hit details " + JSON.stringify(details));
    //             el.emit('click', details);
                
    //             // Don't go to the next element
    //             break;
    //           }
    //         }
    //       }
    //     })
    //     })();
      
    //       /* global AFRAME, THREE */
    // // (function () {
    //   "use strict";
      
    //   const bbox = new THREE.Box3();
    //   const normal = new THREE.Vector3();
    //   const cameraWorldPosition = new THREE.Vector3();
    //   const tempMat = new THREE.Matrix4();
    //   const sphere = new THREE.Sphere();
    //   const zeroVector = new THREE.Vector3();
    //   const planeVector = new THREE.Vector3();
    //   const tempVector = new THREE.Vector3();
      
    //   function distanceOfPointFromPlane(positionOnPlane, planeNormal, p1) {
    //     // the d value in the plane equation a*x + b*y + c*z=d
    //     const d = planeNormal.dot(positionOnPlane);
      
    //     // distance of point from plane
    //     return (d - planeNormal.dot(p1))/planeNormal.length();
    //   }
      
    //   function nearestPointInPlane(positionOnPlane, planeNormal, p1, out) {
    //     const t = distanceOfPointFromPlane(positionOnPlane, planeNormal, p1);
    //     // closest point on the plane
    //     out.copy(planeNormal);
    //     out.multiplyScalar(t);
    //     out.add(p1);
    //     return out;
    //   }
      
      // AFRAME.registerGeometry('shadow-plane', {
      //   schema: {
      //     width: { default: 1, min: 0 },
      //     height: { default: 1, min: 0 }
      //   },
      
      //   init: function (data) {
      //     this.geometry = new THREE.PlaneGeometry(data.width, data.height);
      //     this.geometry.rotateX(-Math.PI / 2);
      //   }
      // });
      
      /**
        Automatically adjust the view frustum to cover the objects in the scene
      */
      // AFRAME.registerComponent('auto-shadow-cam', {
      //   schema: {
      //     targets: {
      //       type: 'selectorAll',
      //       default: "[ar-shadow-helper]"
      //     },
      //   },
      //   tick() {
      //     const camera = this.el.components.light?.light?.shadow?.camera;
      //     if (!camera || !this.data.targets.length) return;
      
      //     camera.getWorldDirection(normal);
      //     camera.getWorldPosition(cameraWorldPosition);
      //     tempMat.copy(camera.matrixWorld);
      //     tempMat.invert();
      
      //     camera.near    = 1;
      //     camera.left    = 100000;
      //     camera.right   = -100000;
      //     camera.top     = -100000;
      //     camera.bottom  = 100000;
      //     for (const el of this.data.targets) {
      //       bbox.setFromObject(el.object3D);
      //       bbox.getBoundingSphere(sphere);
      //       const distanceToPlane = distanceOfPointFromPlane(cameraWorldPosition, normal, sphere.center);
      //       const pointOnCameraPlane = nearestPointInPlane(cameraWorldPosition, normal, sphere.center, tempVector);
      
      //       const pointInXYPlane = pointOnCameraPlane.applyMatrix4(tempMat);
      //       camera.near    = Math.min(-distanceToPlane - sphere.radius - 1, camera.near);
      //       camera.left    = Math.min(-sphere.radius + pointInXYPlane.x, camera.left);
      //       camera.right   = Math.max( sphere.radius + pointInXYPlane.x, camera.right);
      //       camera.top     = Math.max( sphere.radius + pointInXYPlane.y, camera.top);
      //       camera.bottom  = Math.min(-sphere.radius + pointInXYPlane.y, camera.bottom);
      //     }
      //     camera.updateProjectionMatrix();
      //   }
      // });
        
      /**
      It also attatches itself to objects and resizes and positions itself to get the most shadow
      */
      // AFRAME.registerComponent('ar-shadow-helper', {
      //   schema: {
      //     target: {
      //       type: 'selector',
      //     },
      //     light: {
      //       type: 'selector',
      //       default: 'a-light'
      //     },
      //     startVisibleInAR: {
      //       default: true
      //     },
      //     border: {
      //       default: 0.33
      //     }
      //   },
      //   init: function () {
      //     var self = this;
          
      //     this.el.object3D.renderOrder = -1;
      
      //     this.el.sceneEl.addEventListener('enter-vr', function () {
      //       if (self.el.sceneEl.is('ar-mode')) {
      //         self.el.object3D.visible = self.data.startVisibleInAR;
      //       }
      //     });
      //     this.el.sceneEl.addEventListener('exit-vr', function () {
      //       self.el.object3D.visible = false;
      //     });
      
      //     this.el.sceneEl.addEventListener('ar-hit-test-select-start', function () {
      //       // self.el.object3D.visible = false;
      //     });
      
      //     this.el.sceneEl.addEventListener('ar-hit-test-select', function () {
      //       // self.el.object3D.visible = true;
      //     });
      //   },
      //   tick: function () {
      
      //     const obj = this.el.object3D;
      //     const border = this.data.border;
      //     const borderWidth = tempVector.set(0,0,0);
          
      //     // Match the size and rotation of the object
      //     if (this.data.target) {
      //       bbox.setFromObject(this.data.target.object3D);
      //       bbox.getSize(obj.scale);
      //       borderWidth.copy(obj.scale).multiplyScalar(border);
      //       obj.scale.multiplyScalar(1 + border*2);
      //       obj.position.copy(this.data.target.object3D.position);
      //       obj.quaternion.copy(this.data.target.object3D.quaternion);
      //     }
          
      //     // Adjust the plane to get the most shadow
      //     if (this.data.light) {
      //       const light = this.data.light;
      //       const shadow = light.components.light.light.shadow;
          
      //       if (shadow) {
      //         const camera = shadow.camera;
      //         camera.getWorldDirection(normal);
          
      //         planeVector.set(0,1,0).applyQuaternion(obj.quaternion);
      //         const projectionOfCameraDirectionOnPlane = nearestPointInPlane(zeroVector, planeVector, normal, planeVector);
      //         if (
      //           Math.abs(projectionOfCameraDirectionOnPlane.x) > 0.01 ||
      //           Math.abs(projectionOfCameraDirectionOnPlane.y) > 0.01 ||
      //           Math.abs(projectionOfCameraDirectionOnPlane.z) > 0.01
      //         ) {
      //           projectionOfCameraDirectionOnPlane.normalize().multiply(borderWidth);
      //           obj.position.add(projectionOfCameraDirectionOnPlane);
      //         }
      //       }
      //     }
      //   }
      // });
      
  

      // AFRAME.registerComponent('ar-init', {
      //   // Set this object invisible while in AR mode.
      //   init: function () {

      //       // this.el.setAttribute('visible', false);
              
      //     this.el.sceneEl.addEventListener('enter-vr', (ev) => {
      //       // this.wasVisible = this.el.getAttribute('visible');

      //       if (this.el.sceneEl.is('ar-mode')) {

      //             // message.textContent = '';
          
      //             // this.addEventListener('ar-hit-test-start', function () {
      //             //   message.innerHTML = `Scanning environment, finding surface.`
      //             // }, { once: true });
          
      //             // this.addEventListener('ar-hit-test-achieved', function () {
      //             //   message.innerHTML = `Select the location to place the target<br />By tapping on the screen or selecting with your controller.`
      //             // }, { once: true });
          
      //             // this.addEventListener('ar-hit-test-select', function () {
      //             //   message.textContent = 'Cool!';
      //             // }, { once: true });
              
      //           // this.el.setAttribute('visible', true);
      //           // webxrFeatures = "webxr=\x22requiredFeatures: hit-test, local-floor;\x22"; //otherwise hit-test breaks everythign!
      //           // arHitTest = "ar-hit-test=\x22mode: "+arMode+"\x22";
      //           // arShadowPlane = "<a-plane show-in-ar-mode visible=\x22false\x22 height=\x22200\x22 width=\x22200\x22 rotation=\x22-90 0 0\x22 repeat=\x22200 200\x22 shadow=\x22receive:true\x22 ar-shadows=\x22opacity: 0.3\x22 static-body=\x22shape: none\x22 shape__main=\x22shape: box; halfExtents: 100 100 0.125; offset: 0 0 -0.125\x22>" +
      //           // "</a-plane>";
      //           // document.querySelector('#reticleEntity').setAttribute('visible', true);
                
      //       } else {
      //           // this.el.setAttribute('visible', false);
      //       }
      //     });
      //     this.el.sceneEl.addEventListener('exit-vr', (ev) => {
      //       // if (this.wasVisible) this.el.setAttribute('visible', false);
      //     });
      //   }
      // });
      

      AFRAME.registerComponent('hide-in-ar-mode', {
        // Set this object invisible while in AR mode.
        init: function () {
          this.el.sceneEl.addEventListener('enter-vr', (ev) => {

            this.wasVisible = this.el.getAttribute('visible');
            if (this.el.sceneEl.is('ar-mode')) {
              this.el.setAttribute('visible', false);
            } else {
              var mouseCursor = document.getElementById('mouseCursor');
              if (mouseCursor != null)
              mouseCursor.parentNode.removeChild(mouseCursor);      
            }
          });
          this.el.sceneEl.addEventListener('exit-vr', (ev) => {
            if (this.wasVisible) this.el.setAttribute('visible', true);
          });
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
      AFRAME.registerComponent('follow-shadow', {
        schema: {type: 'selector'},
        init() {this.el.object3D.renderOrder = -1;},
        tick() { 
          if (this.data) {
            this.el.object3D.position.copy(this.data.object3D.position); 
            this.el.object3D.position.y-=0.001; // stop z-fighting
          }
        }
      });
      
      // AFRAME.registerComponent('ar-shadows', {
      //   // Swap an object's material to a transparent shadows-only material while
      //   // in AR mode. Intended for use with a ground plane.
      //   schema: {
      //     opacity: {default: 0.3}
      //   },
      //   init: function () {
      //     // if (this.el.sceneEl.is('ar-mode')) {
      //     this.el.sceneEl.addEventListener('enter-vr', (ev) => {
      //       console.log('session start', ev);
      //       if (this.el.sceneEl.is('ar-mode')) {
      //         console.log('AR session start', ev);
      //         this.savedMaterial = this.el.object3D.children[0].material;
      //         this.el.object3D.children[0].material = new THREE.ShadowMaterial();
      //         this.el.object3D.children[0].material.opacity = this.data.opacity;
      //       }
      //     });
      //     this.el.sceneEl.addEventListener('exit-vr', (ev) => {
      //       console.log('session end', ev);
      //       if (this.savedMaterial) {
      //         this.el.object3D.children[0].material = this.savedMaterial;
      //         this.savedMaterial = null;
      //       }
      //     });
      //     }
      //   // }
      // });
      // function getRandomInt(max) {
      //   return Math.floor(Math.random() * max);
      // }
     
      // AFRAME.registerComponent('ar-hit-test-spawn_no', {
      //   schema: {
      //     mode: {default: 'position'},
      //   },
      //   init: function () { 
         
      //     sceneEl.addEventListener('enter-vr', (e) => {
      //       if (this.el.sceneEl.is('ar-mode')) {
      //         var target = document.querySelector('.spawn');

      //         // message.textContent = '';
      //         this.el.addEventListener('ar-hit-test-start', (e) => {
      //           // message.innerHTML = `Scanning environment, finding surface.`
      //           Debug.Log("Scanning environment, finding surface.");
      //         }, { once: true });
      //         this.el.addEventListener('ar-hit-test-achieved', (e) => {
      //           // message.innerHTML = `Select the location to place the furniture. By tapping on the screen or selecting with your controller.`
      //           Debug.Log("Select the location to place the furniture. By tapping on the screen or selecting with your controller.");
               
      //         }, { once: true });
      //         this.el.addEventListener('ar-hit-test-select', function () {
      //           Debug.Log("tryna place object");
      //           if (target != undefined && target != null) {
      //             let position = this.el.getAttribute('position');
      //             // const index = getRandomInt(targets.length);
      //             console.log("tryna clone a target at position " + position);
      //             var obj = target.getObject3D('mesh');
      
      //             // var clone = targets[index].cloneNode(true);
      //             let clone = document.createElement('a-entity');
      //             clone.setObject3D('mesh', obj.clone()); 
      //             clone.setAttribute('position', position);
      //             clone.classList.add("activeObjexRay");
      //             sceneEl.appendChild(clone);
      //           }
      //         }, { once: false });
      //       }
      //     });

      //   }
      // });

      // AFRAME.registerComponent('mod_ar_spawn', { //no
      //   schema: {
      //     mode: {default: 'position'},
      //   },
      //   init: function () { 
          
      //     // webxr=\x22requiredFeatures: hit-test,local-floor;\x22 
      //     // if (this.el.sceneEl.is('ar-mode')) {
      //     console.log("tryna init ar-hit-test");
      //     this.xrHitTestSource = null;
      //     this.viewerSpace = null;
      //     this.refSpace = null;
      //     console.log("arMode is " + this.data.mode);

      //     this.spawnObjects = document.querySelectorAll('.spawn');
      //     // this.targetObject = document.querySelectorAll(".ar_parent_object");

      //     this.el.sceneEl.renderer.xr.addEventListener('sessionend', (ev) => {
      //       this.viewerSpace = null;
      //       this.refSpace = null;
      //       this.xrHitTestSource = null;
      //     });
          
          
      //     this.el.sceneEl.renderer.xr.addEventListener('sessionstart', (ev) => {
      //       let session = this.el.sceneEl.renderer.xr.getSession();
      //       // AugPanel("scanning for surfaces..");  
      //       console.log("scanning for surfaces..")
      //       let element = this.el;
      //       // var el = this.el;
      //       var sceneEl = document.querySelector('a-scene');
            
      //       if (this.el.sceneEl.is('ar-mode')) {

      //         session.addEventListener('select', function () {
      //           console.log("tryna select!");
      //           let position = element.getAttribute('position');
      //           // AugPanel("selecting Hit Test Position " + positon);
      //           // document.querySelector('.target').setAttribute('position', position);


                
      //           if (this.data.mode == 'spawn') {
      //             if (spawnObjects != undefined && spawnObjects != null) {
      //               const index = getRandomInt(spawnObjects.length);
      //               console.log("tryna clone a target with index " + index);
      //               var obj = spawnObjects[index].getObject3D('mesh');

      
      //               let clone = document.createElement('a-entity');
      //               let scaleFactor = Math.random();
      //               clone.setObject3D('mesh', obj.clone()); 
      //               clone.setAttribute('position', position);
      //               clone.setAttribute('scale', {scaleFactor, scaleFactor, scaleFactor});
      //               clone.classList.add("activeObjexRay");
      //               sceneEl.appendChild(clone);
      //             }
      //           // } else {
      //           // if (this.data.mode == 'position') {
      //           //   if (this.targetObject != undefined) {
      //           //     console.log("tryna reposition target");
      //           //     this.targetObject.setAttribute('position', position);
      //           //     }
      //           //   }
                  
      //           }
      //         });
    
      //         if (this.el.sceneEl.is('ar-mode')) {
      //           session.requestReferenceSpace('viewer').then((space) => {
      //             this.viewerSpace = space;
      //             session.requestHitTestSource({space: this.viewerSpace})
      //                 .then((hitTestSource) => {
      //                   this.xrHitTestSource = hitTestSource;
      //                 });
      //           });
      //         }
      //         session.requestReferenceSpace('local-floor').then((space) => {
      //             this.refSpace = space;
      //         });
      //       }
      //       // }
      //     });
      //     // }

      //   },
      //   tick: function () {
      //     if (this.el.sceneEl.is('ar-mode')) {
      //       if (!this.viewerSpace) return;
  
      //       let frame = this.el.sceneEl.frame;
      //       let xrViewerPose = frame.getViewerPose(this.refSpace);
  
      //       if (this.xrHitTestSource && xrViewerPose) {
      //         let hitTestResults = frame.getHitTestResults(this.xrHitTestSource);
      //         if (hitTestResults.length > 0) {
      //           let pose = hitTestResults[0].getPose(this.refSpace);
  
      //           let inputMat = new THREE.Matrix4();
      //           inputMat.fromArray(pose.transform.matrix);
  
      //           let position = new THREE.Vector3();
      //           position.setFromMatrixPosition(inputMat);
      //           this.el.setAttribute('position', position);
      //         }
      //       }
      //     }
      //   }
      // }); 




      AFRAME.registerComponent('ar-hit-test-spawn', {
        schema: {
          mode: {default: 'position'},
        },
        init: function () { 
          
          // webxr=\x22requiredFeatures: hit-test,local-floor;\x22 
          // if (this.el.sceneEl.is('ar-mode')) {
          console.log("tryna init ar-hit-test");
          this.xrHitTestSource = null;
          this.viewerSpace = null;
          this.refSpace = null;
          console.log("arMode is " + this.data.mode);
          let data = this.data;
          this.el.sceneEl.renderer.xr.addEventListener('sessionend', (ev) => {
            this.viewerSpace = null;
            this.refSpace = null;
            this.xrHitTestSource = null;
          });
          this.el.sceneEl.renderer.xr.addEventListener('sessionstart', (ev) => {
            let session = this.el.sceneEl.renderer.xr.getSession();
            // AugPanel("scanning for surfaces..");  
            console.log("scanning for surfaces..")
            let element = this.el;
            // var el = this.el;
            var sceneEl = document.querySelector('a-scene');
            
            if (this.el.sceneEl.is('ar-mode')) {

              session.addEventListener('select', function () {
                console.log("tryna select!");
                let position = element.getAttribute('position');
                // AugPanel("selecting Hit Test Position " + positon);
                // document.querySelector('.target').setAttribute('position', position);
                var targets = document.querySelectorAll('.spawn');

                
                // if (data.mode == 'spawn') {
                if (targets != undefined && targets != null) {
                  const index = getRandomInt(targets.length);
                  console.log("tryna clone a target with index " + index);
                  var obj = targets[index].getObject3D('mesh');

                  // var clone = targets[index].cloneNode(true);
                  let clone = document.createElement('a-entity');
                  let scaleFactor = Math.random();
                  clone.setObject3D('mesh', obj.clone()); 
                  clone.setAttribute('position', position);
                  clone.setAttribute('scale', {scaleFactor, scaleFactor, scaleFactor});
                  clone.classList.add("activeObjexRay");
                  sceneEl.appendChild(clone);
                }
              
                // });
              });
    
              if (this.el.sceneEl.is('ar-mode')) {
                session.requestReferenceSpace('viewer').then((space) => {
                  this.viewerSpace = space;
                  session.requestHitTestSource({space: this.viewerSpace})
                      .then((hitTestSource) => {
                        this.xrHitTestSource = hitTestSource;
                      });
                });
              }
              session.requestReferenceSpace('local-floor').then((space) => {
                  this.refSpace = space;
              });
            }
            // }
          });
          // }

        },
        tick: function () {
          if (this.el.sceneEl.is('ar-mode')) {
            if (!this.viewerSpace) return;
  
            let frame = this.el.sceneEl.frame;
            let xrViewerPose = frame.getViewerPose(this.refSpace);
  
            if (this.xrHitTestSource && xrViewerPose) {
              let hitTestResults = frame.getHitTestResults(this.xrHitTestSource);
              if (hitTestResults.length > 0) {
                let pose = hitTestResults[0].getPose(this.refSpace);
  
                let inputMat = new THREE.Matrix4();
                inputMat.fromArray(pose.transform.matrix);
  
                let position = new THREE.Vector3();
                position.setFromMatrixPosition(inputMat);
                this.el.setAttribute('position', position);
              }
            }
          }
        }
      }); 

/* global AFRAME, THREE */ 
//pinch scale/swipe rotate for ar modelz
  // from https://github.com/fcor/arjs-gestures/blob/master/dist/gestures.js



AFRAME.registerComponent("gesture-handler", {
  schema: {
    enabled: { default: true },
    rotationFactor: { default: 5 },
    minScale: { default: 0.3 },
    maxScale: { default: 8 },
  },

  init: function () {

    this.handleScale = this.handleScale.bind(this);
    this.handleRotation = this.handleRotation.bind(this);

    this.isVisible = false;
    this.initialScale = this.el.object3D.scale.clone();
    this.scaleFactor = 1;

    this.el.sceneEl.addEventListener("markerFound", (e) => {
      this.isVisible = true;
    });

    this.el.sceneEl.addEventListener("markerLost", (e) => {
      this.isVisible = false;
    });
  },

  update: function () {
    if (this.data.enabled) {
      this.el.sceneEl.addEventListener("onefingermove", this.handleRotation);
      this.el.sceneEl.addEventListener("twofingermove", this.handleScale);
    } else {
      this.el.sceneEl.removeEventListener("onefingermove", this.handleRotation);
      this.el.sceneEl.removeEventListener("twofingermove", this.handleScale);
    }
  },

  remove: function () {
    this.el.sceneEl.removeEventListener("onefingermove", this.handleRotation);
    this.el.sceneEl.removeEventListener("twofingermove", this.handleScale);
  },

  handleRotation: function (event) {
    if (this.isVisible) {
      this.el.object3D.rotation.y +=
        event.detail.positionChange.x * this.data.rotationFactor;
      this.el.object3D.rotation.x +=
        event.detail.positionChange.y * this.data.rotationFactor;
    }
  },

  handleScale: function (event) {
    if (this.isVisible) {
      this.scaleFactor *=
        1 + event.detail.spreadChange / event.detail.startSpread;

      this.scaleFactor = Math.min(
        Math.max(this.scaleFactor, this.data.minScale),
        this.data.maxScale
      );

      this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x;
      this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y;
      this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z;
    }
  },
});

AFRAME.registerComponent("gesture-handler-add", { //add component to grab spin pinch if in ar mode
  schema: {
    
  },
  
  init: function () {
    this.el.sceneEl.addEventListener('enter-vr', (ev) => {
     
      if (this.el.sceneEl.is('ar-mode')) {
          
          document.querySelector('a-scene').components.gesture-detector.register(this.el.id);
      } 
    });
   
  }
});
// Component that detects and emits events for touch gestures

AFRAME.registerComponent("gesture-detector", {
  schema: {
    element: { default: "" }
  },

  init: function() {
  },
  register: function(id) {
    this.targetElement = document.getElementById(id);
    this.targetElement.setAttribute('gesture-handler', {enabled: true});
    // if (!this.targetElement) {
    //   // this.targetElement = this.el;

    // }

    this.internalState = {
      previousState: null
    };

    this.emitGestureEvent = this.emitGestureEvent.bind(this);

    this.targetElement.addEventListener("touchstart", this.emitGestureEvent);

    this.targetElement.addEventListener("touchend", this.emitGestureEvent);

    this.targetElement.addEventListener("touchmove", this.emitGestureEvent);
  },

  remove: function() {
    this.targetElement.removeEventListener("touchstart", this.emitGestureEvent);

    this.targetElement.removeEventListener("touchend", this.emitGestureEvent);

    this.targetElement.removeEventListener("touchmove", this.emitGestureEvent);
  },

  emitGestureEvent(event) {
    const currentState = this.getTouchState(event);

    const previousState = this.internalState.previousState;

    const gestureContinues =
      previousState &&
      currentState &&
      currentState.touchCount == previousState.touchCount;

    const gestureEnded = previousState && !gestureContinues;

    const gestureStarted = currentState && !gestureContinues;

    if (gestureEnded) {
      const eventName =
        this.getEventPrefix(previousState.touchCount) + "fingerend";

      this.el.emit(eventName, previousState);

      this.internalState.previousState = null;
    }

    if (gestureStarted) {
      currentState.startTime = performance.now();

      currentState.startPosition = currentState.position;

      currentState.startSpread = currentState.spread;

      const eventName =
        this.getEventPrefix(currentState.touchCount) + "fingerstart";

      this.el.emit(eventName, currentState);

      this.internalState.previousState = currentState;
    }

    if (gestureContinues) {
      const eventDetail = {
        positionChange: {
          x: currentState.position.x - previousState.position.x,

          y: currentState.position.y - previousState.position.y
        }
      };

      if (currentState.spread) {
        eventDetail.spreadChange = currentState.spread - previousState.spread;
      }

      // Update state with new data

      Object.assign(previousState, currentState);

      // Add state data to event detail

      Object.assign(eventDetail, previousState);

      const eventName =
        this.getEventPrefix(currentState.touchCount) + "fingermove";

      this.el.emit(eventName, eventDetail);
    }
  },

  getTouchState: function(event) {
    if (event.touches.length === 0) {
      return null;
    }

    // Convert event.touches to an array so we can use reduce

    const touchList = [];

    for (let i = 0; i < event.touches.length; i++) {
      touchList.push(event.touches[i]);
    }

    const touchState = {
      touchCount: touchList.length
    };

    // Calculate center of all current touches

    const centerPositionRawX =
      touchList.reduce((sum, touch) => sum + touch.clientX, 0) /
      touchList.length;

    const centerPositionRawY =
      touchList.reduce((sum, touch) => sum + touch.clientY, 0) /
      touchList.length;

    touchState.positionRaw = { x: centerPositionRawX, y: centerPositionRawY };

    // Scale touch position and spread by average of window dimensions

    const screenScale = 2 / (window.innerWidth + window.innerHeight);

    touchState.position = {
      x: centerPositionRawX * screenScale,
      y: centerPositionRawY * screenScale
    };

    // Calculate average spread of touches from the center point

    if (touchList.length >= 2) {
      const spread =
        touchList.reduce((sum, touch) => {
          return (
            sum +
            Math.sqrt(
              Math.pow(centerPositionRawX - touch.clientX, 2) +
                Math.pow(centerPositionRawY - touch.clientY, 2)
            )
          );
        }, 0) / touchList.length;

      touchState.spread = spread * screenScale;
    }

    return touchState;
  },

  getEventPrefix(touchCount) {
    const numberNames = ["one", "two", "three", "many"];

    return numberNames[Math.min(touchCount, 4) - 1];
  }
});

// /* jshint esversion: 9 */
// /* global THREE, AFRAME */

// AFRAME.registerComponent("hide-on-hit-test-start", {
//   init: function() {
//     var self = this;
//     this.el.sceneEl.addEventListener("ar-hit-test-start", function() {
//       self.el.object3D.visible = false;
//     });
//     this.el.sceneEl.addEventListener("exit-vr", function() {
//       self.el.object3D.visible = true;
//     });
//   }
// });


// AFRAME.registerComponent("lefthand_xr_listener", { //maybe use for init

//   init: function() {
// // window.addEventListener("DOMContentLoaded", function() {
//   const sceneEl = document.querySelector("a-scene");
//   const ar_overlay = document.getElementById("ar_overlay");

//   // If the user taps on any buttons or interactive elements we may add then prevent
//   // Any WebXR select events from firing
//   if (ar_overlay) {
//     ar_overlay.addEventListener("beforexrselect", e => {
//       e.preventDefault();
//     });
//   }

//   sceneEl.addEventListener("enter-vr", function() {
//     if (this.is("ar-mode")) {
//       // Entered AR
//       ar_overlay.textContent = "";

//       // Hit testing is available
//       this.addEventListener(
//         "ar-hit-test-start",
//         function() {
//           ar_overlay.innerHTML = `Scanning environment, finding surface.`;
//         },
//         { once: true }
//       );

//       // Has managed to start doing hit testing
//       this.addEventListener(
//         "ar-hit-test-achieved",
//         function() {
//           ar_overlay.innerHTML = `Select the location to place object<br />by tapping on the screen or selecting with your controller.`;
//         },
//         { once: true }
//       );

//       // User has placed an object
//       this.addEventListener(
//         "ar-hit-test-select",
//         function() {
//           // Object placed for the first time
//           ar_overlay.textContent = "Well done!";
//         },
//         { once: true }
//       );
//     // } else {
//       // this.toggleOn = false;
//       // this.consoleEl = document.createElement('a-console');
//       // this.consoleEl.setAttribute('position', '0 .13 -.36', scale, '.3 .33 .33', rotation: '-70.7 -1.77'});
//       // "foo", {
//       //   "one": "foo",
//       //   "two": "bar"});
//       // this.el.appendChild(this.consoleEl);


//     }
//   });

//   sceneEl.addEventListener("exit-vr", function() {
//     ar_overlay.textContent = "Exited Immersive Mode";
//   });
// // });
//   }
// });


// AFRAME.registerComponent('lefthand-logging',{
//   init: function () {
//     this.triggerOn = false;
//     this.el.addEventListener('thumbstickmoved', this.logThumbstick);
//     this.el.addEventListener('triggerdown', (e) =>  {
//       this.logTrigger();
//     });
    
//   },
//   logThumbstick: function (evt) {
//     if (evt.detail.y > 0.95) { console.log("DOWN"); }
//     if (evt.detail.y < -0.95) { console.log("UP"); }
//     if (evt.detail.x < -0.95) { console.log("LEFT"); }
//     if (evt.detail.x > 0.95) { console.log("RIGHT"); }
//     // this.el.setAttribute("a-cursor")
//   },
//   logTrigger: function (e) {
//     console.log("triggerdown");
//   }


// });

// AFRAME.registerComponent('toggle-console',{
//   init: function () {
//     this.toggleOn = false;
//     this.el.addEventListener('triggerdown', (e) => {
//       this.toggleOn = !this.toggleOn;
//       if (this.el.sceneEl.is('vr-mode')) {
//         if (toggleOn) {
//           this.consoleEl.visible = true;
//         } else {
//           this.consoleEl.visible = false;
//         }
//       }
//     });
//   },
  // triggerDownEvent: function (evt) {
  //   console.log("tryna trigger console");
  //   let consoleEl = document.getElementById("consoleEntity");
  //   if (consoleEl) {
  //     conso
  //   }
  // }
// });

/* jshint esversion: 9 */
/* global THREE, AFRAME */

AFRAME.registerComponent("hide-on-hit-test-start", {
  init: function() {
    var self = this;
    this.el.sceneEl.addEventListener("ar-hit-test-start", function() {
      self.el.object3D.visible = false;
    });
    this.el.sceneEl.addEventListener("exit-vr", function() {
      self.el.object3D.visible = true;
    });
  }
});

// AFRAME.registerComponent("origin-on-ar-start", {
//   init: function() {
//     var self = this.el;

//     this.el.sceneEl.addEventListener("enter-vr", function() {
//       if (this.is("ar-mode")) {
//         self.setAttribute('position', {x:0,y:0,z:0});
//         self.setAttribute('rotation', {x:0,y:0,z:0});
//       }
//     });
//   }
// });


// AFRAME.registerComponent("match-position-by-id", {
//   schema: {
//     default: ''
//   },
//   tick() {
//     let obj;
    
//     if (this.data === 'xr-camera') {
//       const xrCamera = this.el.sceneEl.renderer.xr.getCameraPose();
//       if (xrCamera) {
//         this.el.object3D.position.copy(xrCamera.transform.position);
//         this.el.object3D.quaternion.copy(xrCamera.transform.orientation);
//         return;
//       }
//       obj = this.el.sceneEl.camera;
//     } else {
//       obj = document.getElementById(this.data).object3D;
//     }
//     if (obj) {
//       this.el.object3D.position.copy(obj.position);
//       this.el.object3D.quaternion.copy(obj.quaternion);
//     }

//   }
// });

// AFRAME.registerComponent("xr-follow", {
//   schema: {},
//   init() {
//   },
//   tick() {
//     const scene = this.el.sceneEl;
//     const camera = scene.camera;
//     const object3D = this.el.object3D;
//     camera.getWorldPosition(object3D.position);
//     object3D.parent.worldToLocal(object3D.position);
//   }
// });

// AFRAME.registerComponent("exit-on", {
//   schema: {
//     default: 'click'
//   },
//   update(oldEvent) {
//     const newEvent = this.data;
//     this.el.removeEventListener(oldEvent, this.exitVR);
//     this.el.addEventListener(newEvent, this.exitVR);
//   },
//   exitVR() {
//     this.sceneEl.exitVR();
//   }
// });

// AFRAME.registerComponent("physx-body-from-model", {
//   schema: {
//     type: 'string',
//     default: ''
//   },
//   init () {
//     const details = this.data;
//     this.onLoad = function () {
//       this.setAttribute('physx-body', details);
//       this.removeAttribute('physx-body-from-model');
//     }
//     this.el.addEventListener('object3dset', this.onLoad);
//   },
//   remove () {
//     this.el.removeEventListener('object3dset', this.onLoad);
//   }
// });

// AFRAME.registerComponent("toggle-physics", {
//   events: {
//     pickup: function() {
//       this.el.addState('grabbed');
//     },
//     putdown: function(e) {
//       this.el.removeState('grabbed');
//       if (e.detail.frame && e.detail.inputSource) {
//         const referenceSpace = this.el.sceneEl.renderer.xr.getReferenceSpace();
//         const pose = e.detail.frame.getPose(e.detail.inputSource.gripSpace, referenceSpace);
//         if (pose && pose.angularVelocity) {
//           this.el.components['physx-body'].rigidBody.setAngularVelocity(pose.angularVelocity);
//         }
//         if (pose && pose.linearVelocity) {
//           this.el.components['physx-body'].rigidBody.setLinearVelocity(pose.linearVelocity);
//         }
//       }
//     }
//   }
// });

// AFRAME.registerComponent("ladder", {
//   schema: {
//     cameraRig: {
//       default: ''
//     },
//     grabbables: {
//       default: ''
//     }
//   },
//   init () {
//     this.ladderGrab = this.ladderGrab.bind(this);
//     this.ladderRelease = this.ladderRelease.bind(this);
//     this.startingRigPosition = new THREE.Vector3();
//     this.startingHandPosition = new THREE.Vector3();
//     this.ladderHands = [];
//     this.grabbables = [];
//     this.cameraRig = document.querySelector(this.data.cameraRig);
//     if (this.data.grabbables) for (const el of this.el.querySelectorAll(this.data.grabbables)) {
//       this.grabbables.push(el);
//       el.addEventListener('grabbed', this.ladderGrab);
//       el.addEventListener('released', this.ladderRelease);
//     }
//   },
//   ladderRelease(e) {
//     const oldActiveHand = e.detail.byNoMagnet;
//     let index;
//     while ((index=this.ladderHands.indexOf(oldActiveHand))!==-1) this.ladderHands.splice(index,1);
    
//     const activeHand = this.ladderHands[0];
//     if (activeHand) {
//       this.startingHandPosition.copy(activeHand.object3D.position);
//       this.startingRigPosition.copy(this.cameraRig.object3D.position);
//     } else {
//       // Turn on the navmesh if no hands on the ladder
//       this.cameraRig.setAttribute('simple-navmesh-constraint', 'enabled', true);
//     }
//   },
//   ladderGrab(e) {
//     const activeHand = e.detail.byNoMagnet;
//     this.startingHandPosition.copy(activeHand.object3D.position);
//     this.startingRigPosition.copy(this.cameraRig.object3D.position);
//     this.ladderHands.unshift(activeHand);
//     this.holdingLadder = true;
//     // Turn off the navmesh if holding the ladder
//     this.cameraRig.setAttribute('simple-navmesh-constraint', 'enabled', false);
//   },
//   tick () {
//     const activeHand = this.ladderHands[0];
//     if (activeHand) {
//       this.cameraRig.object3D.position.subVectors(this.startingHandPosition, activeHand.object3D.position);
//       this.cameraRig.object3D.position.applyQuaternion(this.cameraRig.object3D.quaternion);
//       this.cameraRig.object3D.position.add(this.startingRigPosition);
//     }
//   },
//   remove () {
//     this.grabbables.forEach(el => {
//       el.removeEventListener('grabbed', this.ladderGrab);
//       el.removeEventListener('released', this.ladderRelease);
//     });
//   }
// });

window.addEventListener("DOMContentLoaded", function() {
  const sceneEl = document.querySelector("a-scene");
  const message = document.getElementById("ar_overlay");
  const arContainerEl = document.getElementById("my-ar-objects");
  const cameraRig = document.getElementById("cameraRig");
  // const building = document.getElementById("building");

  // Once the building has loaded update the relfections
  
  // building.addEventListener('object3dset', function () {
  //   if (this.components && this.components.reflection) this.components.reflection.needsVREnvironmentUpdate = true;
  // }, {once: true});
  
  const labels = Array.from(document.querySelectorAll('.pose-label'));
  for (const el of labels) {
    el.parentNode.addEventListener('pose', function (event) {
      el.setAttribute('text', 'value', event.detail.pose);
    });
    el.parentNode.addEventListener('gamepad', function (event) {
      el.setAttribute('text', 'value', event.detail.event);
    });
  }
  
  watergun: {
    const watergun = document.getElementById("watergun");
    if (watergun) {
      const watergunSlider = watergun.firstElementChild;
      watergun.addEventListener('grabbed', function (e) {
        const by = e.detail.by;
        if (e.target === watergun) {
          watergun.className = '';
          if (by.dataset.right) watergunSlider.className = 'magnet-left';
          if (by.dataset.left) watergunSlider.className = 'magnet-right';
        }
        if (e.target === watergunSlider) {
          watergun.setAttribute('linear-constraint', 'target', '#' + e.detail.byNoMagnet.id);
        }
      });
      watergun.addEventListener('released', function (e) {
        const by = e.detail.by;
        watergun.setAttribute('linear-constraint', 'target', '');
        if (e.target === watergun) {
          watergun.className = 'magnet-right magnet-left';
          watergunSlider.className = '';
        }
      });
    }
  }

  // If the user taps on any buttons or interactive elements we may add then prevent
  // Any WebXR select events from firing
  if (message) {
    message.addEventListener("beforexrselect", e => {
      e.preventDefault();
    });



    sceneEl.addEventListener("enter-vr", function() {
      if (this.is("ar-mode")) {
        // Entered AR
        message.textContent = "";

        // Hit testing is available
        this.addEventListener(
          "ar-hit-test-start",
          function() {
            message.innerHTML = `Scanning environment, finding surface.`;
          },
          { once: true }
        );

        // Has managed to start doing hit testing
        this.addEventListener(
          "ar-hit-test-achieved",
          function() {
            message.innerHTML = `Select the location to place<br />By tapping on the screen or selecting with your controller.`;
          },
          { once: true }
        );

        // User has placed an object
        this.addEventListener(
          "ar-hit-test-select",
          function() {
            // Object placed for the first time
            message.textContent = "Well done!";
          },
          { once: true }
        );
      }
    });

    sceneEl.addEventListener("exit-vr", function() {
      message.textContent = "Exited Immersive Mode";
    });
  }
});

// // Make the cheap windows look okay 
// AFRAME.registerComponent('window-replace', {
//   schema: {
//     default: ''
//   },
//   init() {
//     this.el.addEventListener('object3dset', this.update.bind(this));
//     this.materials = new Map();
//   },
//   update() {
//     const filters = this.data.trim().split(',');
//     this.el.object3D.traverse(function (o) {
//       if (o.material) {
//         if (filters.some(filter => o.material.name.includes(filter))) {
//           o.renderOrder = 1;
//           const m = o.material;
//           const sceneEl = this.el.sceneEl;
//           o.material = this.materials.has(m) ?
//             this.materials.get(m) :
//             new THREE.MeshPhongMaterial({
//               name: 'window_' + m.name,
//               lightMap: m.lightmap || null,
//               lightMapIntensity: m.lightMapIntensity,
//               shininess: 90,
//               color: '#ffffff',
//               emissive: '#999999',
//               emissiveMap: m.map,
//               transparent: true,
//               depthWrite: false,
//               map: m.map,
//               transparent: true,
//               side: THREE.DoubleSide,
//               get envMap() {return sceneEl.object3D.environment},
//               combine: THREE.MixOperation,
//               reflectivity: 0.6,
//               blending: THREE.CustomBlending,
//               blendEquation: THREE.MaxEquation,
//               toneMapped: m.toneMapped
//             });
//           ;
//           window.mat = o.material;
//           this.materials.set(m, o.material);
//         }
//       }
//     }.bind(this));
//   }
// });

// AFRAME.registerComponent('collision-listener-right', {
//   init: function() {
//   this.el.addEventListener('collidestart', function(e) {
//     if (document.querySelector('#right-hand').components.haptics)
//       document.querySelector('#right-hand').components.haptics.pulse(1, 150)
  
//   })
//   }
//   });
//   AFRAME.registerComponent('collision-listener-left', {
//   init: function() {
//   this.el.addEventListener('collidestart', function(e) {
//     if (document.querySelector('#left-hand').components.haptics)
//       document.querySelector('#left-hand').components.haptics.pulse(1, 150)
//   })
//   }
//   });

  /**
 * Force Pushable component.
 * 
 * Based on an original component by Don McCurdy in aframe-physics-system
 * 
 * Copyright (c) 2016 Don McCurdy
 *
 * Applies behavior to the current entity such that cursor clicks will apply a
 * strong impulse, pushing the entity away from the viewer.
 *
 * Requires: physx
 */

// AFRAME.registerComponent('physx-force-pushable', {
//   schema: {
//     force: { default: 10 }
//   },
//   init: function () {

//     this.pStart = new THREE.Vector3();
//     this.sourceEl = this.el.sceneEl.querySelector('[camera]');
//     this.forcePushPhysX = this.forcePushPhysX.bind(this);
    

//     this.sourcePosition = new THREE.Vector3();
//     this.force = new THREE.Vector3();
//     this.pos = new THREE.Vector3();
//   },

//   play() {
//     this.el.addEventListener('click', this.forcePushPhysX);
//   },
  
//   pause() {
//     this.el.removeEventListener('click', this.forcePushPhysX);
//   },

//   forcePushPhysX: function (e) {

//     const el = this.el
//     if (!el.components['physx-body']) return
//     const body = el.components['physx-body'].rigidBody
//     if (!body) return

//     const force = this.force
//     const source = this.sourcePosition
    
//     // WebXR requires care getting camera position https://github.com/mrdoob/three.js/issues/18448
//     source.setFromMatrixPosition( this.sourceEl.object3D.matrixWorld );

//     el.object3D.getWorldPosition(force)
//     force.sub(source)
    
//     force.normalize();

//     // not sure about units, but force seems stronger with PhysX than Cannon, so scaling down
//     // by a factor of 5.
//     force.multiplyScalar(this.data.force / 5);

//     // use data from intersection to determine point at which to apply impulse.
//     const pos = this.pos
//     pos.copy(e.detail.intersection.point)
//     el.object3D.worldToLocal(pos)

//     body.addImpulseAtLocalPos(force, pos);
//   }
// });

/**
 * Grab component.
 * 
 * Based on an original component by Don McCurdy in aframe-physics-system
 * 
 * Copyright (c) 2016 Don McCurdy
 */

// AFRAME.registerComponent('physx-grab', {
//   init: function () {

//     // If a state of "grabbed" is set on a physx-body entity, 
//     // the entity is automatically transformed into a kinematic entity.
//     // To avoid triggering this (we want to grab using constraints, and leave the
//     // body as dynamic), we use a non-clashing name for the state we set on the entity when
//     // grabbing it.
//     this.GRABBED_STATE = 'grabbed-dynamic';

//     this.grabbing = false;
//     this.hitEl =      /** @type {AFRAME.Element}    */ null;
//     this.physics =    /** @type {AFRAME.System}     */ this.el.sceneEl.systems.physics;

//     // Bind event handlers
//     this.onHit = this.onHit.bind(this);
//     this.onGripOpen = this.onGripOpen.bind(this);
//     this.onGripClose = this.onGripClose.bind(this);

//   },

//   play: function () {
//     var el = this.el;
//     el.addEventListener('contactbegin', this.onHit);
//     el.addEventListener('gripdown', this.onGripClose);
//     el.addEventListener('gripup', this.onGripOpen);
//     el.addEventListener('trackpaddown', this.onGripClose);
//     el.addEventListener('trackpadup', this.onGripOpen);
//     el.addEventListener('triggerdown', this.onGripClose);
//     el.addEventListener('triggerup', this.onGripOpen);
//   },

//   pause: function () {
//     var el = this.el;
//     el.removeEventListener('contactbegin', this.onHit);
//     el.removeEventListener('gripdown', this.onGripClose);
//     el.removeEventListener('gripup', this.onGripOpen);
//     el.removeEventListener('trackpaddown', this.onGripClose);
//     el.removeEventListener('trackpadup', this.onGripOpen);
//     el.removeEventListener('triggerdown', this.onGripClose);
//     el.removeEventListener('triggerup', this.onGripOpen);
//   },

//   onGripClose: function (evt) {
//     this.grabbing = true;
//   },

//   onGripOpen: function (evt) {
//     var hitEl = this.hitEl;
//     this.grabbing = false;
//     if (!hitEl) { return; }
//     hitEl.removeState(this.GRABBED_STATE);

//     this.hitEl = undefined;

//     this.removeJoint()
//   },

//   onHit: function (evt) {
//     var hitEl = evt.detail.otherComponent.el;
//     // If the element is already grabbed (it could be grabbed by another controller).
//     // If the hand is not grabbing the element does not stick.
//     // If we're already grabbing something you can't grab again.
//     if (!hitEl || hitEl.is(this.GRABBED_STATE) || !this.grabbing || this.hitEl) { return; }
//     hitEl.addState(this.GRABBED_STATE);
//     this.hitEl = hitEl;

//     this.addJoint(hitEl, evt.target)
//   },

//   addJoint(el, target) {

//     this.removeJoint()

//     this.joint = document.createElement('a-entity') 
//     this.joint.setAttribute("physx-joint", `type: Fixed; target: #${target.id}`)

//     el.appendChild(this.joint)
//   },

//   removeJoint() {

//     if (!this.joint) return
//     this.joint.parentElement.removeChild(this.joint)
//     this.joint = null
//   }
// });

/**
 * Based on an original component by Don McCurdy in aframe-physics-system
 * 
 * Copyright (c) 2016 Don McCurdy
 * 
 * Rain of Entities component.
 *
 * Creates a spawner on the scene, which periodically generates new entities
 * and drops them from the sky. Objects falling below altitude=0 will be
 * recycled after a few seconds.
 *
 * Requires: physics
 */


AFRAME.registerComponent('rain-of-entities', {
  schema: {
    tagName:    { default: 'a-box' },
    components: { default: ['dynamic-body', 'force-pushable', 'color|#39BB82', 'scale|0.2 0.2 0.2'] },
    spread:     { default: 10, min: 0 },
    maxCount:   { default: 10, min: 0 },
    interval:   { default: 1000, min: 0 },
    lifetime:   { default: 10000, min: 0 }
  },
  init: function () {
    this.boxes = [];
    this.timeout = setInterval(this.spawn.bind(this), this.data.interval);
  },
  spawn: function () {
    if (this.boxes.length >= this.data.maxCount) {
      clearInterval(this.timeout);
      this.timeout= null;
      return;
    }

    var data = this.data,
        box = document.createElement(data.tagName);

    this.boxes.push(box);
    this.el.appendChild(box);

    box.setAttribute('position', this.randomPosition());
    data.components.forEach(function (s) {
      var parts = s.split('|');
      box.setAttribute(parts[0], parts[1] || '');
    });

    // Recycling is important, kids.
    setInterval(function () {
      if (box.object3D.position.y > 0) return;
      this.recycleBox(box);
    }.bind(this), this.data.lifetime);
    
  },
  randomPosition: function () {
    var spread = this.data.spread;
    return {
      x: Math.random() * spread - spread / 2,
      y: 3,
      z: Math.random() * spread - spread / 2
    };
  },

  recycleBox(box) {


    box.removeAttribute("physx-body")
    box.object3D.position.copy(this.randomPosition());
    box.object3D.quaternion.identity();
    box.setAttribute("physx-body", "")

  },

  remove() {
    if (this.timeout) {
      clearInterval(this.timeout)
    }
  }
});

AFRAME.registerComponent('phase-shift', {
  init: function () {
    var el = this.el
    el.addEventListener('gripdown', function () {
      el.setAttribute('collision-filter', {collisionForces: true})
    })
    el.addEventListener('gripup', function () {
      el.setAttribute('collision-filter', {collisionForces: false})
    })
  }
});