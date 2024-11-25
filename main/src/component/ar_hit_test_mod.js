/* global AFRAME, THREE */
AFRAME.registerComponent('ar_hit_test_mod', {
    schema: {targetEl: {type: 'selector'}},
  
    init: function () {
      var self = this;
      var targetEl = this.data.targetEl;
      this.xrHitTestSource = null;
      this.viewerSpace = null;
      this.refSpace = null;


  
      this.el.sceneEl.renderer.xr.addEventListener(function () {
        self.viewerSpace = null;
        self.refSpace = null;
        self.xrHitTestSource = null;
      });
  
      this.el.sceneEl.addEventListener('enter-vr', function () {
        var el = self.el;
        var targetEl = self.data.targetEl;
        var session;
        var arTargetData = [];
        let arTargetGroup = new THREE.Group();

        console.log("enter-vr");
        if (!self.el.sceneEl.is('ar-mode')) { return; }
        console.log("ar-mode");
        // let arTargetEls = document.querySelectorAll(".ar_target");
        let arTarget = document.getElementById("ar_target");
        if (arTarget) {
        // for (let i = 0; i < arTargetEls.length; i++) {     
        //       arTarget.appendChild(arTargetEls[i]); //????
        //   }
          document.querySelectorAll('.arTarget').forEach(function(el) {
              // arTarget.appendChild(el);
              // el.object3D.updateMatrixWorld();
              // let targetEl = {};
              targetEl.position = el.getAttribute("position");
              targetEl.id = el.id;
              arTargetData.push(targetEl);
          });
        }
        session = self.el.sceneEl.renderer.xr.getSession();
  
        self.originalPosition = targetEl.object3D.position.clone();
        self.el.object3D.visible = true;
  
        session.addEventListener('select', function () {
          var position = el.getAttribute('position');
          targetEl.setAttribute('position', position);
          let localPosition = new THREE.Vector3();
          var lightEl = document.getElementById('light'); //todo check for types
          if (lightEl) {
            document.getElementById('light').setAttribute('position', {
              x: (position.x - 2),
              y: (position.y + 4),
              z: (position.z + 2)
            });
          }
          // console.log("hit test position selected " + JSON.stringify(position));
          for (let i = 0; i < arTargetData.length; i++) {

            // el.object3D.worldToLocal(localPosition);
            console.log("tryna set id " + arTargetData[i].id + " position " + position);
            let arTargetEl = document.getElementById(arTargetData[i].id);
            if (arTargetEl) {
              arTargetEl.setAttribute("position", position);
            } else {
              console.log(arTargetData[i].id + " targetEl  not found!");
            }
             
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