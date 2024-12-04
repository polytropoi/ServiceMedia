/* global AFRAME, THREE */
AFRAME.registerComponent('ar_hit_test_mod', {
    dependencies: ["raycaster"],
    schema: {targetEl: {type: 'selector'}},
  
    init: function () {
      var self = this;
      var targetEl = this.data.targetEl;
      this.xrHitTestSource = null;
      this.viewerSpace = null;
      this.refSpace = null;
      this.lockTargets = false;
      this.arRaycasterEnabled = false;

      this.camera = null;
      const messageEl = document.getElementById("ar_overlay_message");
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
        messageEl.textContent = "entered AR mode";
        console.log("ar-mode");

        let arOverlay = document.getElementById("ar_overlay");
        if (arOverlay) {
          arOverlay.style.visibility = 'visible';
        }

        // let arTarget = document.getElementById("ar_target"); //um, same as this.data.targetEl selector
        // if (arTarget) {       
        //     document.querySelectorAll('.arChild').forEach(function(el) { //els with "ar target" tag
        //     // targetEl.position = el.getAttribute("position");
        //     targetEl.id = el.id;
        //     arTargetData.push(targetEl);
        //   });
        // }

        session = self.el.sceneEl.renderer.xr.getSession();
        
        self.originalPosition = targetEl.object3D.position.clone();
        self.el.object3D.visible = true;
        messageEl.textContent = "scanning for surface....";
        // this.camera = session.renderer.xr.getCamera().cameras[0];
        
        session.addEventListener('select', function () {
          var position = el.getAttribute('position');
          const zeroPos = new THREE.Vector3(0, 0, 0); //hrm, use camera or player? viewportHolder?
          var distance = position.distanceTo(zeroPos);
          var scaleMod = distance * 0.2;
          if (!self.lockTargets) {
            console.log("tryna set position " + JSON.stringify(position) + " distance " + JSON.stringify(distance));
            messageEl.textContent = "surface found at position " + JSON.stringify(position);
            targetEl.setAttribute('position', position);
            targetEl.setAttribute('scale', {'x': scaleMod, 'y': scaleMod, 'z': scaleMod});
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
                  messageEl.textContent = "ray hit on object " + el.id;
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
    toggleLockTargets: function () {
      this.lockTargets = !this.lockTargets;
      var targetEl = this.data.targetEl;
      if (targetEl) {
        if (this.lockTargets) {
          console.log("locked");
          targetEl.setAttribute("anchored", {"persistent": true});
          this.el.object3D.visible = false;
          this.arRaycasterEnabled = true;
          messageEl.textContent = "hit test disabled, raycaster enabled";
        } else {
          console.log("unlocked");
          targetEl.removeAttribute("anchored");
          this.el.object3D.visible = true;
          //enable raycast here?
          this.arRaycasterEnabled = false;
          messageEl.textContent = "hit test enabled, raycaster disabled";
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


function ToggleLockARTargets () {
  let arTargetEl = document.getElementById("hitTester");
  if (arTargetEl) {
    let hitTestComponent = arTargetEl.components.ar_hit_test_mod;
    if (hitTestComponent) {
      hitTestComponent.toggleLockTargets();
    }
  }
}