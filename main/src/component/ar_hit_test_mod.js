/* global AFRAME, THREE */
AFRAME.registerComponent('ar_hit_test_mod', {
    schema: {targetEl: {type: 'selector'}},
  
    init: function () {
      var self = this;
      var targetEl = this.data.targetEl;
      this.xrHitTestSource = null;
      this.viewerSpace = null;
      this.refSpace = null;
      this.lockTargets = false;
      this.camera = null;
  
      this.el.sceneEl.renderer.xr.addEventListener(function () {
        self.viewerSpace = null;
        self.refSpace = null;
        self.xrHitTestSource = null;
      });
  
      this.el.sceneEl.addEventListener('enter-vr', function (event) {
        var el = self.el;
        var targetEl = self.data.targetEl;
        var session;
        var arTargetData = [];
        // let arTargetGroup = new THREE.Group();

        console.log("enter-vr");
        if (!self.el.sceneEl.is('ar-mode')) { return; }

        console.log("ar-mode");
        let arOverlay = document.getElementById("ar_overlay");
        if (arOverlay) {
          arOverlay.style.visibility = 'visible';
        }


        // const hits = this.raycaster.intersectObjects(this.scene.children)
        // console.log("ar raycast hits")
        // let arTargetEls = document.querySelectorAll(".ar_target");
        let arTarget = document.getElementById("ar_target"); //um, same as this.data.targetEl selector
        if (arTarget) {       
            document.querySelectorAll('.arTarget').forEach(function(el) { //els with "ar target" tag
            // targetEl.position = el.getAttribute("position");
            targetEl.id = el.id;
            arTargetData.push(targetEl);
          });
        }

        session = self.el.sceneEl.renderer.xr.getSession();
  
        self.originalPosition = targetEl.object3D.position.clone();
        self.el.object3D.visible = true;
        // this.camera = session.renderer.xr.getCamera().cameras[0];
        
        session.addEventListener('select', function () {
          var position = el.getAttribute('position');
          const zeroPos = new THREE.Vector3(0, 0, 0);
          var distance = position.distanceTo(zeroPos);
          var scaleMod = distance * 0.1;
          if (!this.lockTargets) {
            console.log("tryna set position " + JSON.stringify(position) + " distance " + JSON.stringify(distance));
            targetEl.setAttribute('position', position);
            targetEl.setAttribute('scale', {'x': scaleMod, 'y': scaleMod, 'z': scaleMod});
          } else {
            // targetEl.setAttribute("anchored", {"persistent": true});
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


          // targetEl.object3D.updateMatrixWorld();        this.raycaster.setFromCamera(screenPosition, this.camera)
          // if (this.camera) {
          //   const screenPosition = new Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1)
          //   this.raycaster.setFromCamera(screenPosition, this.camera)
          //   const hits = this.raycaster.intersectObjects(this.scene.children);
          //   console.log("ar raycast hits" + JSON.stringify(hits));
            
          // }
          
          // console.log("hit test position selected " + JSON.stringify(position));
          // if (arTargetData.length) {
          //   targetEl.object3D.visible = false;
          // }
          // for (let i = 0; i < arTargetData.length; i++) {
          //   // el.object3D.worldToLocal(localPosition);
          //   // console.log("tryna set id " + arTargetData[i].id + " position " + position);
          //   let arTargetEl = document.getElementById(arTargetData[i].id);
          //   if (arTargetEl) {
          //     console.log("arTarget index" + i.toString() + "tryna set id " + arTargetData[i].id + " at position " + JSON.stringify(position));
              
              // let arTargetPosition = new THREE.Vector3(); //get position data from components if found
             
              // let localMarkerComponent = arTargetEl.components.local_marker;
              // if (localMarkerComponent) {
              //   arTargetPosition = targetEl.object3D.worldToLocal(parseFloat(localMarkerComponent.data.xpos, parseFloat(localMarkerComponent.data.ypos), parseFloat(localMarkerComponent.data.zpos)));
              //   console.log("localmarker arTargetPosition " + JSON.stringify(arTargetPosition));

              //   arTargetEl.setAttribute('position', arTargetPosition);
              //   // arTargetEl.setAttribute('scale', {x: parseFloat(localMarkerComponent.data.xscale) * 0.2, 
              //   //                                   y: parseFloat(localMarkerComponent.data.yscale) * 0.2, 
              //   //                                   z: parseFloat(localMarkerComponent.data.zscale) * 0.2});
              // } else {
              //   let cloudMarkerComponent = arTargetEl.components.cloud_marker;
              //   if (cloudMarkerComponent) {
              //     arTargetPosition = targetEl.object3D.worldToLocal(parseFloat(cloudMarkerComponent.data.xpos, parseFloat(cloudMarkerComponent.data.ypos), parseFloat(cloudMarkerComponent.data.zpos)));
              //     console.log("cloudmarker arTargetPosition " + JSON.stringify(arTargetPosition));
              //     arTargetEl.setAttribute('position', arTargetPosition);
              //     // arTargetEl.setAttribute('scale', {x: parseFloat(cloudMarkerComponent.data.xscale) * 0.2, 
              //     //                                   y: parseFloat(cloudMarkerComponent.data.yscale) * 0.2, 
              //     //                                   z: parseFloat(cloudMarkerComponent.data.zscale) * 0.2});
              //   } else {
              //     let modModelComponent = arTargetEl.components.mod_model;
              //     if (modModelComponent) {
              //       arTargetPosition = targetEl.object3D.worldToLocal(parseFloat(modModelComponent.data.xpos, parseFloat(modModelComponent.data.ypos), parseFloat(modModelComponent.data.zpos)));
              //       console.log("modmodel arTargetPosition " + JSON.stringify(arTargetPosition));
              //       arTargetEl.setAttribute('position', position);
              //       // arTargetEl.setAttribute('scale', {x: parseFloat(modModelComponent.data.xscale) * 0.2, 
              //       //                                   y: parseFloat(modModelComponent.data.yscale) * 0.2, 
              //       //                                   z: parseFloat(modModelComponent.data.zscale) * 0.2});
              //     } else {
              //         let modObjectComponent = arTargetEl.components.mod_object;
              //         if (modObjectComponent) {
              //           arTargetPosition = targetEl.object3D.worldToLocal(parseFloat(modObjectComponent.data.xpos, parseFloat(modObjectComponent.data.ypos), parseFloat(modObjectComponent.data.zpos)));
              //           console.log("modobject arTargetPosition " + JSON.stringify(arTargetPosition));
              //           arTargetEl.setAttribute('position', position);
              //           // arTargetEl.setAttribute('scale', {x: parseFloat(modObjectComponent.data.xscale) * 0.2, 
              //           //                                   y: parseFloat(modObjectComponent.data.yscale) * 0.2, 
              //           //                                   z: parseFloat(modObjectComponent.data.zscale) * 0.2});
              //       }
              //     }
              //   }
              // }
              console.log("arTargetPosition " + position);
              // arTarget.setAttribute('position', position);

            // } else {
            //   console.log(arTargetData[i].id + " targetEl  not found!");
            // }
             
          // }

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
    toggleLockTargets: function () {
      this.lockTargets = !this.lockTargets;
      if (lockTargets) {
        console.log("locked");
        var targetEl = this.data.targetEl;
        targetEl.setAttribute("anchored", {"persistent": true});
      } else {
        console.log("unlocked");
        targetEl.removeAttribute("anchored");
      }
    },
    tick: function () {
      var frame;
      var xrViewerPose;
      var hitTestResults;
      var pose;
      var inputMat;
      var position;
  
      if (this.el.sceneEl.is('ar-mode')) {
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


function ToggleLockARTargets () {
  let arTargetEl = document.getElementById("hitTester");
  if (arTargetEl) {
    let hitTestComponent = arTargetEl.components.ar_hit_test_mod;
    if (hitTestComponent) {
      hitTestComponent.toggleLockTargets();
    }
  }
}