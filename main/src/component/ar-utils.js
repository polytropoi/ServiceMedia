
      // AFRAME.registerComponent('detect_device', {
      //   init
      // });

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



      AFRAME.registerComponent('ar-init', {
        // Set this object invisible while in AR mode.
        init: function () {

            // this.el.setAttribute('visible', false);
              
          this.el.sceneEl.addEventListener('enter-vr', (ev) => {
            // this.wasVisible = this.el.getAttribute('visible');

            if (this.el.sceneEl.is('ar-mode')) {

                // this.el.setAttribute('visible', true);
                // webxrFeatures = "webxr=\x22requiredFeatures: hit-test, local-floor;\x22"; //otherwise hit-test breaks everythign!
                // arHitTest = "ar-hit-test=\x22mode: "+arMode+"\x22";
                // arShadowPlane = "<a-plane show-in-ar-mode visible=\x22false\x22 height=\x22200\x22 width=\x22200\x22 rotation=\x22-90 0 0\x22 repeat=\x22200 200\x22 shadow=\x22receive:true\x22 ar-shadows=\x22opacity: 0.3\x22 static-body=\x22shape: none\x22 shape__main=\x22shape: box; halfExtents: 100 100 0.125; offset: 0 0 -0.125\x22>" +
                // "</a-plane>";
                // document.querySelector('#reticleEntity').setAttribute('visible', true);
                
            } else {
                // this.el.setAttribute('visible', false);
            }
          });
          this.el.sceneEl.addEventListener('exit-vr', (ev) => {
            // if (this.wasVisible) this.el.setAttribute('visible', false);
          });
        }
      });
      

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
                // webxrFeatures = "webxr=\x22requiredFeatures: hit-test, local-floor;\x22"; //otherwise hit-test breaks everythign!
                // arHitTest = "ar-hit-test=\x22mode: "+arMode+"\x22";
                // arShadowPlane = "<a-plane show-in-ar-mode visible=\x22false\x22 height=\x22200\x22 width=\x22200\x22 rotation=\x22-90 0 0\x22 repeat=\x22200 200\x22 shadow=\x22receive:true\x22 ar-shadows=\x22opacity: 0.3\x22 static-body=\x22shape: none\x22 shape__main=\x22shape: box; halfExtents: 100 100 0.125; offset: 0 0 -0.125\x22>" +
                // "</a-plane>";
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
      function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }
      
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
                var targets = document.querySelector('.spawn');

                
                // if (data.mode == 'spawn') {
                if (targets != undefined && targets != null) {
                  console.log("tryna clone a target");
                  const index = getRandomInt(targets.length);
                  var clone = targets[index].cloneNode(true);
                  clone.setAttribute('position', position);
                  sceneEl.appendChild(clone);
                  }
                // }

                // if (data.mode == 'position') {
                // if (target != undefined) {
                //   console.log("tryna reposition target");
                //     target.setAttribute('position', position);
                //   }
                // }
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
    
              // if (this.el.sceneEl.is('ar-mode')) {
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