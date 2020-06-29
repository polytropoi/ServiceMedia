// Define a few custom components useful for AR mode. While these are somewhat reusable,
      // I recommend checking if there are officially supported alternatives before copying
      // these into new projects.
    //   const augstyle = "position:fixed;display:block;width:200px;height:75px;right:200px;bottom:100px;background-color:#ffffff;z-index:20;"

    // function AugPanel(nwString) {
    //   let d = document.querySelector('.augpanel');
    //   d.setAttribute("style",augstyle);
    //   var p = d.querySelector('p');
    //   p.setAttribute("style","text-align: center;margin:auto;font-size:12px Roboto;");
    //   p.innerHTML=nwString;
    // }
    
      // See also https://github.com/aframevr/aframe/pull/4356
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
                // document.querySelector('#reticleEntity').setAttribute('visible', true);
            } else {
                this.el.setAttribute('visible', false);
            }
          });
          this.el.sceneEl.addEventListener('exit-vr', (ev) => {
            if (this.wasVisible) this.el.setAttribute('visible', false);
          });
        }
      });
      
      AFRAME.registerComponent('ar-shadows', {
        // Swap an object's material to a transparent shadows-only material while
        // in AR mode. Intended for use with a ground plane.
        schema: {
          opacity: {default: 0.3}
        },
        init: function () {
          // if (this.el.sceneEl.is('ar-mode')) {
          this.el.sceneEl.addEventListener('enter-vr', (ev) => {
            console.log('session start', ev);
            if (this.el.sceneEl.is('ar-mode')) {
              console.log('AR session start', ev);
              this.savedMaterial = this.el.object3D.children[0].material;
              this.el.object3D.children[0].material = new THREE.ShadowMaterial();
              this.el.object3D.children[0].material.opacity = this.data.opacity;
            }
          });
          this.el.sceneEl.addEventListener('exit-vr', (ev) => {
            console.log('session end', ev);
            if (this.savedMaterial) {
              this.el.object3D.children[0].material = this.savedMaterial;
              this.savedMaterial = null;
            }
          });
          }
        // }
      });

      AFRAME.registerComponent('ar-hit-test', {
        schema: {
          mode: {default: 'position'},
        },
        init: function () {
          
          // webxr=\x22requiredFeatures: hit-test,local-floor;\x22 
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
            // if (this.el.sceneEl.is('ar-mode')) {
              session.addEventListener('select', function () {
                console.log("tryna select!");
                let position = element.getAttribute('position');
                // AugPanel("selecting Hit Test Position " + positon);
                // document.querySelector('.target').setAttribute('position', position);
                var target = document.querySelector('.target');
                
                if (data.mode == 'spawn') {
                if (target != undefined) {
                  console.log("tryna clone the target");
                  var clone = target.cloneNode(true);
                  clone.setAttribute('position', position);
                  sceneEl.appendChild(clone);
                  }
                }

                if (data.mode == 'position') {
                if (target != undefined) {
                  console.log("tryna reposition target");
                  target.setAttribute('position', position);
                  }
                }
                // var entity = document.createElement('a-entity');
                // sceneEl.appendChild(entity);          
                // clone.visible = true;
                // clone.setAttribute('position', position);
                // // clone.position.x += Math.random() * 5;
                // // clone.position.y += 0.5;
                // // clone.position.z = -20 + Math.random() * 20;
                // entity.setObject3D('clone', clone);  
                // var testBox = document.createElement('a-box');
                // testBox.setAttribute('position', position);
                // document.getElementById('light').setAttribute('position', {
                //   x: (position.x - 2),
                //   y: (position.y + 4),
                //   z: (position.z + 2)
                // });
              });
    
              
              session.requestReferenceSpace('viewer').then((space) => {
                this.viewerSpace = space;
                session.requestHitTestSource({space: this.viewerSpace})
                    .then((hitTestSource) => {
                      this.xrHitTestSource = hitTestSource;
                    });
              });

              session.requestReferenceSpace('local-floor').then((space) => {
                this.refSpace = space;
              });
            // }
          });
        

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