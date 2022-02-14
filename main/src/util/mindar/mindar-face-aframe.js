/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***********************************!*\
  !*** ./src/face-target/aframe.js ***!
  \***********************************/
const {Controller, UI} = window.MINDAR.FACE;

const THREE = AFRAME.THREE;

AFRAME.registerSystem('mindar-face-system', {
  container: null,
  video: null,
  processingVideo: false,
  shouldFaceUser: true,
  lastHasFace: false,

  init: function() {
    this.anchorEntities = [];
    this.faceMeshEntities = [];
  },

  setup: function({uiLoading, uiScanning, uiError}) {
    this.ui = new UI({uiLoading, uiScanning, uiError});
  },

  registerFaceMesh: function(el) {
    this.faceMeshEntities.push({el});
  },

  registerAnchor: function(el, anchorIndex) {
    this.anchorEntities.push({el: el, anchorIndex});
  },

  start: function() {
    this.ui.showLoading();

    this.container = this.el.sceneEl.parentNode;
    //this.__startVideo();
    this._startVideo();
  },

  stop: function() {
    this.pause();
    const tracks = this.video.srcObject.getTracks();
    tracks.forEach(function(track) {
      track.stop();
    });
    this.video.remove();
  },

  switchCamera: function() {
    this.shouldFaceUser = !this.shouldFaceUser;
    this.stop();
    this.start();
  },

  pause: function(keepVideo=false) {
    if (!keepVideo) {
      this.video.pause();
    }
    this.processingVideo = false;
  },

  unpause: function() {
    this.video.play();
    this.processingVideo = true;
  },

  // mock a video with an image
  __startVideo: function() {
    this.video = document.createElement("img");
    this.video.onload = async () => {
      this.video.videoWidth = this.video.width;
      this.video.videoHeight = this.video.height;

      await this._setupAR();
      this._processVideo();
      this.processingVideo = false;
      this.ui.hideLoading();
    }
    this.video.style.position = 'absolute'
    this.video.style.top = '0px'
    this.video.style.left = '0px'
    this.video.style.zIndex = '-2'
    this.video.src = "./assets/face1.jpeg";

    this.container.appendChild(this.video);
  },

  _startVideo: function() {
    this.video = document.createElement('video');

    this.video.setAttribute('autoplay', '');
    this.video.setAttribute('muted', '');
    this.video.setAttribute('playsinline', '');
    this.video.style.position = 'absolute'
    this.video.style.top = '0px'
    this.video.style.left = '0px'
    this.video.style.zIndex = '-2'
    this.container.appendChild(this.video);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.el.emit("arError", {error: 'VIDEO_FAIL'});
      this.ui.showCompatibility();
      return;
    }

    navigator.mediaDevices.getUserMedia({audio: false, video: {
      facingMode: (this.shouldFaceUser? 'face': 'environment'),
    }}).then((stream) => {
      this.video.addEventListener( 'loadedmetadata', async () => {
        this.video.setAttribute('width', this.video.videoWidth);
        this.video.setAttribute('height', this.video.videoHeight);
        await this._setupAR();
	this.controller.setInputSize(this.video.videoWidth, this.video.videoHeight);
	this._processVideo();
	this.ui.hideLoading();
      });
      this.video.srcObject = stream;
    }).catch((err) => {
      console.log("getUserMedia error", err);
      this.el.emit("arError", {error: 'VIDEO_FAIL'});
    });
  },

  _processVideo: function() {
    const sleep = () => { 
      return new Promise(window.requestAnimationFrame); 
    }
    const startProcessing = async() => {
      while (true) {
	if (!this.processingVideo) break;

	const anchorIndexes = [];
	for (let i = 0; i < this.anchorEntities.length; i++) {
	  anchorIndexes.push(this.anchorEntities[i].anchorIndex);
	}
	const hasFace = await this.controller.detect(this.video);
	if (hasFace && !this.lastHasFace) {
	  this.el.emit("targetFound");
	}
	if (!hasFace && this.lastHasFace) {
	  this.el.emit("targetLost");
	}
	this.lastHasFace = hasFace;

	for (let i = 0; i < this.anchorEntities.length; i++) {
	  if (hasFace) {
	    const landmarkProperties = this.controller.getLandmarkProperties(this.anchorEntities[i].anchorIndex);
	    this.anchorEntities[i].el.updateVisibility(true);
	    this.anchorEntities[i].el.updatePosition(landmarkProperties);
	  } else {
	    this.anchorEntities[i].el.updateVisibility(false);
	  }
	}

	for (let i = 0; i < this.faceMeshEntities.length; i++) {
	  this.faceMeshEntities[i].el.updateVisibility(hasFace);
	}
	await sleep();
      }
    }
    this.processingVideo = true;
    startProcessing();
  },

  _setupAR: async function() {
    this.controller = new Controller();
    this._resize();
    await this.controller.setup();
    await this.controller.detect(this.video); // warm up the model

    for (let i = 0; i < this.faceMeshEntities.length; i++) {
      this.faceMeshEntities[i].el.addFaceMesh(this.controller.createFaceGeoemtry());
    }

    this._resize();
    window.addEventListener('resize', this._resize.bind(this));
    this.el.emit("arReady");
  },

  _resize: function() {
    const video = this.video;
    const container = this.container;
    let vw, vh; // display css width, height
    const videoRatio = video.videoWidth / video.videoHeight;
    const containerRatio = container.clientWidth / container.clientHeight;
    if (videoRatio > containerRatio) {
      vh = container.clientHeight;
      vw = vh * videoRatio;
    } else {
      vw = container.clientWidth;
      vh = vw / videoRatio;
    }
    this.video.style.top = (-(vh - container.clientHeight) / 2) + "px";
    this.video.style.left = (-(vw - container.clientWidth) / 2) + "px";
    this.video.style.width = vw + "px";
    this.video.style.height = vh + "px";

    const camera = new THREE.OrthographicCamera(1, 1, 1, 1, -1000, 1000);
    camera.left = -0.5 * vw;
    camera.right = 0.5 * vw;
    camera.top = 0.5 * vh;
    camera.bottom = -0.5 * vh;
    camera.updateProjectionMatrix();

    const sceneEl = container.getElementsByTagName("a-scene")[0];
    sceneEl.style.width = vw + "px";
    sceneEl.style.height = vh + "px";
    sceneEl.style.top = (-(vh - container.clientHeight) / 2) + "px";
    sceneEl.style.left = (-(vw - container.clientWidth) / 2) + "px";

    const cameraEle = container.getElementsByTagName("a-camera")[0];
    cameraEle.setObject3D('camera', camera);
    cameraEle.setAttribute('camera', 'active', true);

    this.controller.setDisplaySize(vw, vh);
  }
});

AFRAME.registerComponent('mindar-face', {
  dependencies: ['mindar-face-system'],

  schema: {
    autoStart: {type: 'boolean', default: true},
    faceOccluder: {type: 'boolean', default: true},
    uiLoading: {type: 'string', default: 'yes'},
    uiScanning: {type: 'string', default: 'yes'},
    uiError: {type: 'string', default: 'yes'},
  },

  init: function() {
    const arSystem = this.el.sceneEl.systems['mindar-face-system'];

    if (this.data.faceOccluder) {
      const faceOccluderMeshEntity = document.createElement('a-entity');
      faceOccluderMeshEntity.setAttribute("mindar-face-default-face-occluder", true);
      this.el.sceneEl.appendChild(faceOccluderMeshEntity);
    }

    arSystem.setup({
      uiLoading: this.data.uiLoading,
      uiScanning: this.data.uiScanning,
      uiError: this.data.uiError,
    });

    if (this.data.autoStart) {
      this.el.sceneEl.addEventListener('renderstart', () => {
        arSystem.start();
      });
    }
  },
});

AFRAME.registerComponent('mindar-face-target', {
  dependencies: ['mindar-face-system'],

  schema: {
    anchorIndex: {type: 'number'},
  },

  init: function() {
    const arSystem = this.el.sceneEl.systems['mindar-face-system'];
    arSystem.registerAnchor(this, this.data.anchorIndex);
    this.el.object3D.visible = false;
  },

  updateVisibility(visible) {
    this.el.object3D.visible = visible;
  },

  updatePosition({position, rotation, scale}) {
    const root = this.el.object3D;
    root.position.copy(position);
    root.scale.copy(scale);
    root.rotation.x = rotation.x;
    root.rotation.y = rotation.y;
    root.rotation.z = rotation.z;
  },
});

AFRAME.registerComponent('mindar-face-occluder', {
  init: function() {
    const root = this.el.object3D;
    this.el.addEventListener('model-loaded', () => {
      this.el.getObject3D('mesh').traverse((o) => {
	if (o.isMesh) {
	  const material = new THREE.MeshPhongMaterial({
	    colorWrite: false,
	  });
	  o.material = material;
	}
      });
    });
  },
});

AFRAME.registerComponent('mindar-face-default-face-occluder', {
  init: function() {
    const arSystem = this.el.sceneEl.systems['mindar-face-system'];
    arSystem.registerFaceMesh(this);
  },

  updateVisibility(visible) {
    this.el.object3D.visible = visible;
  },

  addFaceMesh(faceGeometry) {
    const material = new THREE.MeshPhongMaterial({colorWrite: false});
    //const material = new THREE.MeshPhongMaterial({color: 0xffffff});
    const mesh = new THREE.Mesh(faceGeometry, material);
    this.el.setObject3D('mesh', mesh);
  },
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9taW5kLWFyLy4vc3JjL2ZhY2UtdGFyZ2V0L2FmcmFtZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sZUFBZTs7QUFFdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUgsbUJBQW1CLCtCQUErQjtBQUNsRCxzQkFBc0IsK0JBQStCO0FBQ3JELEdBQUc7O0FBRUg7QUFDQSxnQ0FBZ0MsR0FBRztBQUNuQyxHQUFHOztBQUVIO0FBQ0EsOEJBQThCLG9CQUFvQjtBQUNsRCxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLCtCQUErQixvQkFBb0I7QUFDbkQ7QUFDQTtBQUNBOztBQUVBLHlDQUF5QztBQUN6QztBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLEtBQUs7QUFDTDtBQUNBLCtCQUErQixvQkFBb0I7QUFDbkQsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQSx5QjtBQUNBLHVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZ0IsZ0NBQWdDO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdCQUFnQixnQ0FBZ0M7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBLGdCQUFnQixrQ0FBa0M7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDOztBQUU3QyxtQkFBbUIsa0NBQWtDO0FBQ3JEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBLGdCQUFnQiwrQkFBK0I7QUFDL0MsbUJBQW1CLCtCQUErQjtBQUNsRCxnQkFBZ0IsK0JBQStCO0FBQy9DLGlCQUFpQiwrQkFBK0I7QUFDaEQsY0FBYywrQkFBK0I7QUFDN0MsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLEdBQUc7QUFDSCxDQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQSxrQkFBa0IsZUFBZTtBQUNqQyxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSCxrQkFBa0IsMEJBQTBCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0wsR0FBRztBQUNILENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0Esa0RBQWtELGtCQUFrQjtBQUNwRSxvREFBb0QsZ0JBQWdCO0FBQ3BFO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQyIsImZpbGUiOiJtaW5kYXItZmFjZS1hZnJhbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7Q29udHJvbGxlciwgVUl9ID0gd2luZG93Lk1JTkRBUi5GQUNFO1xuXG5jb25zdCBUSFJFRSA9IEFGUkFNRS5USFJFRTtcblxuQUZSQU1FLnJlZ2lzdGVyU3lzdGVtKCdtaW5kYXItZmFjZS1zeXN0ZW0nLCB7XG4gIGNvbnRhaW5lcjogbnVsbCxcbiAgdmlkZW86IG51bGwsXG4gIHByb2Nlc3NpbmdWaWRlbzogZmFsc2UsXG4gIHNob3VsZEZhY2VVc2VyOiB0cnVlLFxuICBsYXN0SGFzRmFjZTogZmFsc2UsXG5cbiAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5hbmNob3JFbnRpdGllcyA9IFtdO1xuICAgIHRoaXMuZmFjZU1lc2hFbnRpdGllcyA9IFtdO1xuICB9LFxuXG4gIHNldHVwOiBmdW5jdGlvbih7dWlMb2FkaW5nLCB1aVNjYW5uaW5nLCB1aUVycm9yfSkge1xuICAgIHRoaXMudWkgPSBuZXcgVUkoe3VpTG9hZGluZywgdWlTY2FubmluZywgdWlFcnJvcn0pO1xuICB9LFxuXG4gIHJlZ2lzdGVyRmFjZU1lc2g6IGZ1bmN0aW9uKGVsKSB7XG4gICAgdGhpcy5mYWNlTWVzaEVudGl0aWVzLnB1c2goe2VsfSk7XG4gIH0sXG5cbiAgcmVnaXN0ZXJBbmNob3I6IGZ1bmN0aW9uKGVsLCBhbmNob3JJbmRleCkge1xuICAgIHRoaXMuYW5jaG9yRW50aXRpZXMucHVzaCh7ZWw6IGVsLCBhbmNob3JJbmRleH0pO1xuICB9LFxuXG4gIHN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnVpLnNob3dMb2FkaW5nKCk7XG5cbiAgICB0aGlzLmNvbnRhaW5lciA9IHRoaXMuZWwuc2NlbmVFbC5wYXJlbnROb2RlO1xuICAgIC8vdGhpcy5fX3N0YXJ0VmlkZW8oKTtcbiAgICB0aGlzLl9zdGFydFZpZGVvKCk7XG4gIH0sXG5cbiAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wYXVzZSgpO1xuICAgIGNvbnN0IHRyYWNrcyA9IHRoaXMudmlkZW8uc3JjT2JqZWN0LmdldFRyYWNrcygpO1xuICAgIHRyYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKHRyYWNrKSB7XG4gICAgICB0cmFjay5zdG9wKCk7XG4gICAgfSk7XG4gICAgdGhpcy52aWRlby5yZW1vdmUoKTtcbiAgfSxcblxuICBzd2l0Y2hDYW1lcmE6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2hvdWxkRmFjZVVzZXIgPSAhdGhpcy5zaG91bGRGYWNlVXNlcjtcbiAgICB0aGlzLnN0b3AoKTtcbiAgICB0aGlzLnN0YXJ0KCk7XG4gIH0sXG5cbiAgcGF1c2U6IGZ1bmN0aW9uKGtlZXBWaWRlbz1mYWxzZSkge1xuICAgIGlmICgha2VlcFZpZGVvKSB7XG4gICAgICB0aGlzLnZpZGVvLnBhdXNlKCk7XG4gICAgfVxuICAgIHRoaXMucHJvY2Vzc2luZ1ZpZGVvID0gZmFsc2U7XG4gIH0sXG5cbiAgdW5wYXVzZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWRlby5wbGF5KCk7XG4gICAgdGhpcy5wcm9jZXNzaW5nVmlkZW8gPSB0cnVlO1xuICB9LFxuXG4gIC8vIG1vY2sgYSB2aWRlbyB3aXRoIGFuIGltYWdlXG4gIF9fc3RhcnRWaWRlbzogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgdGhpcy52aWRlby5vbmxvYWQgPSBhc3luYyAoKSA9PiB7XG4gICAgICB0aGlzLnZpZGVvLnZpZGVvV2lkdGggPSB0aGlzLnZpZGVvLndpZHRoO1xuICAgICAgdGhpcy52aWRlby52aWRlb0hlaWdodCA9IHRoaXMudmlkZW8uaGVpZ2h0O1xuXG4gICAgICBhd2FpdCB0aGlzLl9zZXR1cEFSKCk7XG4gICAgICB0aGlzLl9wcm9jZXNzVmlkZW8oKTtcbiAgICAgIHRoaXMucHJvY2Vzc2luZ1ZpZGVvID0gZmFsc2U7XG4gICAgICB0aGlzLnVpLmhpZGVMb2FkaW5nKCk7XG4gICAgfVxuICAgIHRoaXMudmlkZW8uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnXG4gICAgdGhpcy52aWRlby5zdHlsZS50b3AgPSAnMHB4J1xuICAgIHRoaXMudmlkZW8uc3R5bGUubGVmdCA9ICcwcHgnXG4gICAgdGhpcy52aWRlby5zdHlsZS56SW5kZXggPSAnLTInXG4gICAgdGhpcy52aWRlby5zcmMgPSBcIi4vYXNzZXRzL2ZhY2UxLmpwZWdcIjtcblxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMudmlkZW8pO1xuICB9LFxuXG4gIF9zdGFydFZpZGVvOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcblxuICAgIHRoaXMudmlkZW8uc2V0QXR0cmlidXRlKCdhdXRvcGxheScsICcnKTtcbiAgICB0aGlzLnZpZGVvLnNldEF0dHJpYnV0ZSgnbXV0ZWQnLCAnJyk7XG4gICAgdGhpcy52aWRlby5zZXRBdHRyaWJ1dGUoJ3BsYXlzaW5saW5lJywgJycpO1xuICAgIHRoaXMudmlkZW8uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnXG4gICAgdGhpcy52aWRlby5zdHlsZS50b3AgPSAnMHB4J1xuICAgIHRoaXMudmlkZW8uc3R5bGUubGVmdCA9ICcwcHgnXG4gICAgdGhpcy52aWRlby5zdHlsZS56SW5kZXggPSAnLTInXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy52aWRlbyk7XG5cbiAgICBpZiAoIW5hdmlnYXRvci5tZWRpYURldmljZXMgfHwgIW5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKSB7XG4gICAgICB0aGlzLmVsLmVtaXQoXCJhckVycm9yXCIsIHtlcnJvcjogJ1ZJREVPX0ZBSUwnfSk7XG4gICAgICB0aGlzLnVpLnNob3dDb21wYXRpYmlsaXR5KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEoe2F1ZGlvOiBmYWxzZSwgdmlkZW86IHtcbiAgICAgIGZhY2luZ01vZGU6ICh0aGlzLnNob3VsZEZhY2VVc2VyPyAnZmFjZSc6ICdlbnZpcm9ubWVudCcpLFxuICAgIH19KS50aGVuKChzdHJlYW0pID0+IHtcbiAgICAgIHRoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lciggJ2xvYWRlZG1ldGFkYXRhJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICB0aGlzLnZpZGVvLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCB0aGlzLnZpZGVvLnZpZGVvV2lkdGgpO1xuICAgICAgICB0aGlzLnZpZGVvLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgdGhpcy52aWRlby52aWRlb0hlaWdodCk7XG4gICAgICAgIGF3YWl0IHRoaXMuX3NldHVwQVIoKTtcblx0dGhpcy5jb250cm9sbGVyLnNldElucHV0U2l6ZSh0aGlzLnZpZGVvLnZpZGVvV2lkdGgsIHRoaXMudmlkZW8udmlkZW9IZWlnaHQpO1xuXHR0aGlzLl9wcm9jZXNzVmlkZW8oKTtcblx0dGhpcy51aS5oaWRlTG9hZGluZygpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnZpZGVvLnNyY09iamVjdCA9IHN0cmVhbTtcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcImdldFVzZXJNZWRpYSBlcnJvclwiLCBlcnIpO1xuICAgICAgdGhpcy5lbC5lbWl0KFwiYXJFcnJvclwiLCB7ZXJyb3I6ICdWSURFT19GQUlMJ30pO1xuICAgIH0pO1xuICB9LFxuXG4gIF9wcm9jZXNzVmlkZW86IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHNsZWVwID0gKCkgPT4geyBcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSh3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKTsgXG4gICAgfVxuICAgIGNvbnN0IHN0YXJ0UHJvY2Vzc2luZyA9IGFzeW5jKCkgPT4ge1xuICAgICAgd2hpbGUgKHRydWUpIHtcblx0aWYgKCF0aGlzLnByb2Nlc3NpbmdWaWRlbykgYnJlYWs7XG5cblx0Y29uc3QgYW5jaG9ySW5kZXhlcyA9IFtdO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYW5jaG9yRW50aXRpZXMubGVuZ3RoOyBpKyspIHtcblx0ICBhbmNob3JJbmRleGVzLnB1c2godGhpcy5hbmNob3JFbnRpdGllc1tpXS5hbmNob3JJbmRleCk7XG5cdH1cblx0Y29uc3QgaGFzRmFjZSA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5kZXRlY3QodGhpcy52aWRlbyk7XG5cdGlmIChoYXNGYWNlICYmICF0aGlzLmxhc3RIYXNGYWNlKSB7XG5cdCAgdGhpcy5lbC5lbWl0KFwidGFyZ2V0Rm91bmRcIik7XG5cdH1cblx0aWYgKCFoYXNGYWNlICYmIHRoaXMubGFzdEhhc0ZhY2UpIHtcblx0ICB0aGlzLmVsLmVtaXQoXCJ0YXJnZXRMb3N0XCIpO1xuXHR9XG5cdHRoaXMubGFzdEhhc0ZhY2UgPSBoYXNGYWNlO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hbmNob3JFbnRpdGllcy5sZW5ndGg7IGkrKykge1xuXHQgIGlmIChoYXNGYWNlKSB7XG5cdCAgICBjb25zdCBsYW5kbWFya1Byb3BlcnRpZXMgPSB0aGlzLmNvbnRyb2xsZXIuZ2V0TGFuZG1hcmtQcm9wZXJ0aWVzKHRoaXMuYW5jaG9yRW50aXRpZXNbaV0uYW5jaG9ySW5kZXgpO1xuXHQgICAgdGhpcy5hbmNob3JFbnRpdGllc1tpXS5lbC51cGRhdGVWaXNpYmlsaXR5KHRydWUpO1xuXHQgICAgdGhpcy5hbmNob3JFbnRpdGllc1tpXS5lbC51cGRhdGVQb3NpdGlvbihsYW5kbWFya1Byb3BlcnRpZXMpO1xuXHQgIH0gZWxzZSB7XG5cdCAgICB0aGlzLmFuY2hvckVudGl0aWVzW2ldLmVsLnVwZGF0ZVZpc2liaWxpdHkoZmFsc2UpO1xuXHQgIH1cblx0fVxuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5mYWNlTWVzaEVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG5cdCAgdGhpcy5mYWNlTWVzaEVudGl0aWVzW2ldLmVsLnVwZGF0ZVZpc2liaWxpdHkoaGFzRmFjZSk7XG5cdH1cblx0YXdhaXQgc2xlZXAoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wcm9jZXNzaW5nVmlkZW8gPSB0cnVlO1xuICAgIHN0YXJ0UHJvY2Vzc2luZygpO1xuICB9LFxuXG4gIF9zZXR1cEFSOiBhc3luYyBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgQ29udHJvbGxlcigpO1xuICAgIHRoaXMuX3Jlc2l6ZSgpO1xuICAgIGF3YWl0IHRoaXMuY29udHJvbGxlci5zZXR1cCgpO1xuICAgIGF3YWl0IHRoaXMuY29udHJvbGxlci5kZXRlY3QodGhpcy52aWRlbyk7IC8vIHdhcm0gdXAgdGhlIG1vZGVsXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZmFjZU1lc2hFbnRpdGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5mYWNlTWVzaEVudGl0aWVzW2ldLmVsLmFkZEZhY2VNZXNoKHRoaXMuY29udHJvbGxlci5jcmVhdGVGYWNlR2VvZW10cnkoKSk7XG4gICAgfVxuXG4gICAgdGhpcy5fcmVzaXplKCk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmVsLmVtaXQoXCJhclJlYWR5XCIpO1xuICB9LFxuXG4gIF9yZXNpemU6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHZpZGVvID0gdGhpcy52aWRlbztcbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcjtcbiAgICBsZXQgdncsIHZoOyAvLyBkaXNwbGF5IGNzcyB3aWR0aCwgaGVpZ2h0XG4gICAgY29uc3QgdmlkZW9SYXRpbyA9IHZpZGVvLnZpZGVvV2lkdGggLyB2aWRlby52aWRlb0hlaWdodDtcbiAgICBjb25zdCBjb250YWluZXJSYXRpbyA9IGNvbnRhaW5lci5jbGllbnRXaWR0aCAvIGNvbnRhaW5lci5jbGllbnRIZWlnaHQ7XG4gICAgaWYgKHZpZGVvUmF0aW8gPiBjb250YWluZXJSYXRpbykge1xuICAgICAgdmggPSBjb250YWluZXIuY2xpZW50SGVpZ2h0O1xuICAgICAgdncgPSB2aCAqIHZpZGVvUmF0aW87XG4gICAgfSBlbHNlIHtcbiAgICAgIHZ3ID0gY29udGFpbmVyLmNsaWVudFdpZHRoO1xuICAgICAgdmggPSB2dyAvIHZpZGVvUmF0aW87XG4gICAgfVxuICAgIHRoaXMudmlkZW8uc3R5bGUudG9wID0gKC0odmggLSBjb250YWluZXIuY2xpZW50SGVpZ2h0KSAvIDIpICsgXCJweFwiO1xuICAgIHRoaXMudmlkZW8uc3R5bGUubGVmdCA9ICgtKHZ3IC0gY29udGFpbmVyLmNsaWVudFdpZHRoKSAvIDIpICsgXCJweFwiO1xuICAgIHRoaXMudmlkZW8uc3R5bGUud2lkdGggPSB2dyArIFwicHhcIjtcbiAgICB0aGlzLnZpZGVvLnN0eWxlLmhlaWdodCA9IHZoICsgXCJweFwiO1xuXG4gICAgY29uc3QgY2FtZXJhID0gbmV3IFRIUkVFLk9ydGhvZ3JhcGhpY0NhbWVyYSgxLCAxLCAxLCAxLCAtMTAwMCwgMTAwMCk7XG4gICAgY2FtZXJhLmxlZnQgPSAtMC41ICogdnc7XG4gICAgY2FtZXJhLnJpZ2h0ID0gMC41ICogdnc7XG4gICAgY2FtZXJhLnRvcCA9IDAuNSAqIHZoO1xuICAgIGNhbWVyYS5ib3R0b20gPSAtMC41ICogdmg7XG4gICAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblxuICAgIGNvbnN0IHNjZW5lRWwgPSBjb250YWluZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhLXNjZW5lXCIpWzBdO1xuICAgIHNjZW5lRWwuc3R5bGUud2lkdGggPSB2dyArIFwicHhcIjtcbiAgICBzY2VuZUVsLnN0eWxlLmhlaWdodCA9IHZoICsgXCJweFwiO1xuICAgIHNjZW5lRWwuc3R5bGUudG9wID0gKC0odmggLSBjb250YWluZXIuY2xpZW50SGVpZ2h0KSAvIDIpICsgXCJweFwiO1xuICAgIHNjZW5lRWwuc3R5bGUubGVmdCA9ICgtKHZ3IC0gY29udGFpbmVyLmNsaWVudFdpZHRoKSAvIDIpICsgXCJweFwiO1xuXG4gICAgY29uc3QgY2FtZXJhRWxlID0gY29udGFpbmVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYS1jYW1lcmFcIilbMF07XG4gICAgY2FtZXJhRWxlLnNldE9iamVjdDNEKCdjYW1lcmEnLCBjYW1lcmEpO1xuICAgIGNhbWVyYUVsZS5zZXRBdHRyaWJ1dGUoJ2NhbWVyYScsICdhY3RpdmUnLCB0cnVlKTtcblxuICAgIHRoaXMuY29udHJvbGxlci5zZXREaXNwbGF5U2l6ZSh2dywgdmgpO1xuICB9XG59KTtcblxuQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KCdtaW5kYXItZmFjZScsIHtcbiAgZGVwZW5kZW5jaWVzOiBbJ21pbmRhci1mYWNlLXN5c3RlbSddLFxuXG4gIHNjaGVtYToge1xuICAgIGF1dG9TdGFydDoge3R5cGU6ICdib29sZWFuJywgZGVmYXVsdDogdHJ1ZX0sXG4gICAgZmFjZU9jY2x1ZGVyOiB7dHlwZTogJ2Jvb2xlYW4nLCBkZWZhdWx0OiB0cnVlfSxcbiAgICB1aUxvYWRpbmc6IHt0eXBlOiAnc3RyaW5nJywgZGVmYXVsdDogJ3llcyd9LFxuICAgIHVpU2Nhbm5pbmc6IHt0eXBlOiAnc3RyaW5nJywgZGVmYXVsdDogJ3llcyd9LFxuICAgIHVpRXJyb3I6IHt0eXBlOiAnc3RyaW5nJywgZGVmYXVsdDogJ3llcyd9LFxuICB9LFxuXG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGFyU3lzdGVtID0gdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbJ21pbmRhci1mYWNlLXN5c3RlbSddO1xuXG4gICAgaWYgKHRoaXMuZGF0YS5mYWNlT2NjbHVkZXIpIHtcbiAgICAgIGNvbnN0IGZhY2VPY2NsdWRlck1lc2hFbnRpdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhLWVudGl0eScpO1xuICAgICAgZmFjZU9jY2x1ZGVyTWVzaEVudGl0eS5zZXRBdHRyaWJ1dGUoXCJtaW5kYXItZmFjZS1kZWZhdWx0LWZhY2Utb2NjbHVkZXJcIiwgdHJ1ZSk7XG4gICAgICB0aGlzLmVsLnNjZW5lRWwuYXBwZW5kQ2hpbGQoZmFjZU9jY2x1ZGVyTWVzaEVudGl0eSk7XG4gICAgfVxuXG4gICAgYXJTeXN0ZW0uc2V0dXAoe1xuICAgICAgdWlMb2FkaW5nOiB0aGlzLmRhdGEudWlMb2FkaW5nLFxuICAgICAgdWlTY2FubmluZzogdGhpcy5kYXRhLnVpU2Nhbm5pbmcsXG4gICAgICB1aUVycm9yOiB0aGlzLmRhdGEudWlFcnJvcixcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmRhdGEuYXV0b1N0YXJ0KSB7XG4gICAgICB0aGlzLmVsLnNjZW5lRWwuYWRkRXZlbnRMaXN0ZW5lcigncmVuZGVyc3RhcnQnLCAoKSA9PiB7XG4gICAgICAgIGFyU3lzdGVtLnN0YXJ0KCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG59KTtcblxuQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KCdtaW5kYXItZmFjZS10YXJnZXQnLCB7XG4gIGRlcGVuZGVuY2llczogWydtaW5kYXItZmFjZS1zeXN0ZW0nXSxcblxuICBzY2hlbWE6IHtcbiAgICBhbmNob3JJbmRleDoge3R5cGU6ICdudW1iZXInfSxcbiAgfSxcblxuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBhclN5c3RlbSA9IHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zWydtaW5kYXItZmFjZS1zeXN0ZW0nXTtcbiAgICBhclN5c3RlbS5yZWdpc3RlckFuY2hvcih0aGlzLCB0aGlzLmRhdGEuYW5jaG9ySW5kZXgpO1xuICAgIHRoaXMuZWwub2JqZWN0M0QudmlzaWJsZSA9IGZhbHNlO1xuICB9LFxuXG4gIHVwZGF0ZVZpc2liaWxpdHkodmlzaWJsZSkge1xuICAgIHRoaXMuZWwub2JqZWN0M0QudmlzaWJsZSA9IHZpc2libGU7XG4gIH0sXG5cbiAgdXBkYXRlUG9zaXRpb24oe3Bvc2l0aW9uLCByb3RhdGlvbiwgc2NhbGV9KSB7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMuZWwub2JqZWN0M0Q7XG4gICAgcm9vdC5wb3NpdGlvbi5jb3B5KHBvc2l0aW9uKTtcbiAgICByb290LnNjYWxlLmNvcHkoc2NhbGUpO1xuICAgIHJvb3Qucm90YXRpb24ueCA9IHJvdGF0aW9uLng7XG4gICAgcm9vdC5yb3RhdGlvbi55ID0gcm90YXRpb24ueTtcbiAgICByb290LnJvdGF0aW9uLnogPSByb3RhdGlvbi56O1xuICB9LFxufSk7XG5cbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudCgnbWluZGFyLWZhY2Utb2NjbHVkZXInLCB7XG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmVsLm9iamVjdDNEO1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignbW9kZWwtbG9hZGVkJywgKCkgPT4ge1xuICAgICAgdGhpcy5lbC5nZXRPYmplY3QzRCgnbWVzaCcpLnRyYXZlcnNlKChvKSA9PiB7XG5cdGlmIChvLmlzTWVzaCkge1xuXHQgIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHtcblx0ICAgIGNvbG9yV3JpdGU6IGZhbHNlLFxuXHQgIH0pO1xuXHQgIG8ubWF0ZXJpYWwgPSBtYXRlcmlhbDtcblx0fVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG59KTtcblxuQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KCdtaW5kYXItZmFjZS1kZWZhdWx0LWZhY2Utb2NjbHVkZXInLCB7XG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGFyU3lzdGVtID0gdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbJ21pbmRhci1mYWNlLXN5c3RlbSddO1xuICAgIGFyU3lzdGVtLnJlZ2lzdGVyRmFjZU1lc2godGhpcyk7XG4gIH0sXG5cbiAgdXBkYXRlVmlzaWJpbGl0eSh2aXNpYmxlKSB7XG4gICAgdGhpcy5lbC5vYmplY3QzRC52aXNpYmxlID0gdmlzaWJsZTtcbiAgfSxcblxuICBhZGRGYWNlTWVzaChmYWNlR2VvbWV0cnkpIHtcbiAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7Y29sb3JXcml0ZTogZmFsc2V9KTtcbiAgICAvL2NvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHtjb2xvcjogMHhmZmZmZmZ9KTtcbiAgICBjb25zdCBtZXNoID0gbmV3IFRIUkVFLk1lc2goZmFjZUdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgdGhpcy5lbC5zZXRPYmplY3QzRCgnbWVzaCcsIG1lc2gpO1xuICB9LFxufSk7XG4iXSwic291cmNlUm9vdCI6IiJ9