/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!************************************!*\
  !*** ./src/image-target/aframe.js ***!
  \************************************/
const {Controller, UI} = window.MINDAR.IMAGE;

AFRAME.registerSystem('mindar-image-system', {
  container: null,
  video: null,
  processingImage: false,

  init: function() {
    this.anchorEntities = [];
  },

  tick: function() {
  },

  setup: function({imageTargetSrc, maxTrack, showStats, uiLoading, uiScanning, uiError, captureRegion}) {
    this.imageTargetSrc = imageTargetSrc;
    this.maxTrack = maxTrack;
    this.showStats = showStats;
    this.captureRegion = captureRegion;
    this.ui = new UI({uiLoading, uiScanning, uiError});
  },

  registerAnchor: function(el, targetIndex) {
    this.anchorEntities.push({el: el, targetIndex: targetIndex});
  },

  start: function() {
    this.container = this.el.sceneEl.parentNode;

    if (this.showStats) {
      this.mainStats = new Stats();
      this.mainStats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
      this.mainStats.domElement.style.cssText = 'position:absolute;top:0px;left:0px;z-index:999';
      this.container.appendChild(this.mainStats.domElement);
    }

    this.ui.showLoading();
    this._startVideo();
  },

  switchTarget: function(targetIndex) {
    this.controller.interestedTargetIndex = targetIndex;
  },

  stop: function() {
    this.pause();
    const tracks = this.video.srcObject.getTracks();
    tracks.forEach(function(track) {
      track.stop();
    });
    this.video.remove();
  },

  pause: function(keepVideo=false) {
    if (!keepVideo) {
      this.video.pause();
    }
    this.controller.stopProcessVideo();
  },

  unpause: function() {
    this.video.play();
    this.controller.processVideo(this.video);
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
      // TODO: show unsupported error
      this.el.emit("arError", {error: 'VIDEO_FAIL'});
      this.ui.showCompatibility();
      return;
    }

    navigator.mediaDevices.getUserMedia({audio: false, video: {
      facingMode: 'environment',
    }}).then((stream) => {
      this.video.addEventListener( 'loadedmetadata', () => {
        //console.log("video ready...", this.video);
        this.video.setAttribute('width', this.video.videoWidth);
        this.video.setAttribute('height', this.video.videoHeight);
        this._startAR();
      });
      this.video.srcObject = stream;
    }).catch((err) => {
      console.log("getUserMedia error", err);
      this.el.emit("arError", {error: 'VIDEO_FAIL'});
    });
  },

  _startAR: async function() {
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

    this.controller = new Controller({
      inputWidth: video.videoWidth,
      inputHeight: video.videoHeight,
      maxTrack: this.maxTrack, 
      onUpdate: (data) => {
	if (data.type === 'processDone') {
	  if (this.mainStats) this.mainStats.update();
	}
	else if (data.type === 'updateMatrix') {
	  const {targetIndex, worldMatrix} = data;

	  for (let i = 0; i < this.anchorEntities.length; i++) {
	    if (this.anchorEntities[i].targetIndex === targetIndex) {
	      if (worldMatrix) {
		this.anchorEntities[i].el.updatePaint(this.controller.capturedRegion);
	      }
	      this.anchorEntities[i].el.updateWorldMatrix(worldMatrix, );
	      if (worldMatrix) {
		this.ui.hideScanning();
	      }
	    }
	  }
	}
      }
    });
    this.controller.shouldCaptureRegion = this.captureRegion;

    const proj = this.controller.getProjectionMatrix();
    const fov = 2 * Math.atan(1/proj[5] / vh * container.clientHeight ) * 180 / Math.PI; // vertical fov
    const near = proj[14] / (proj[10] - 1.0);
    const far = proj[14] / (proj[10] + 1.0);
    const ratio = proj[5] / proj[0]; // (r-l) / (t-b)
    //console.log("loaded proj: ", proj, ". fov: ", fov, ". near: ", near, ". far: ", far, ". ratio: ", ratio);
    const newAspect = container.clientWidth / container.clientHeight;
    const cameraEle = container.getElementsByTagName("a-camera")[0];
    const camera = cameraEle.getObject3D('camera');
    camera.fov = fov;
    camera.aspect = newAspect;
    camera.near = near;
    camera.far = far;
    camera.updateProjectionMatrix();
    //const newCam = new AFRAME.THREE.PerspectiveCamera(fov, newRatio, near, far);
    //camera.getObject3D('camera').projectionMatrix = newCam.projectionMatrix;

    this.video.style.top = (-(vh - container.clientHeight) / 2) + "px";
    this.video.style.left = (-(vw - container.clientWidth) / 2) + "px";
    this.video.style.width = vw + "px";
    this.video.style.height = vh + "px";

    const {dimensions: imageTargetDimensions} = await this.controller.addImageTargets(this.imageTargetSrc);

    for (let i = 0; i < this.anchorEntities.length; i++) {
      const {el, targetIndex} = this.anchorEntities[i];
      if (targetIndex < imageTargetDimensions.length) {
        el.setupMarker(imageTargetDimensions[targetIndex]);
      }
    }

    await this.controller.dummyRun(this.video);
    this.el.emit("arReady");
    this.ui.hideLoading();
    this.ui.showScanning();

    this.controller.processVideo(this.video);
  },
});

AFRAME.registerComponent('mindar-image', {
  dependencies: ['mindar-image-system'],

  schema: {
    imageTargetSrc: {type: 'string'},
    maxTrack: {type: 'int', default: 1},
    showStats: {type: 'boolean', default: false},
    captureRegion: {type: 'boolean', default: false},
    autoStart: {type: 'boolean', default: true},
    uiLoading: {type: 'string', default: 'yes'},
    uiScanning: {type: 'string', default: 'yes'},
    uiError: {type: 'string', default: 'yes'},
  },

  init: function() {
    const arSystem = this.el.sceneEl.systems['mindar-image-system'];

    arSystem.setup({
      imageTargetSrc: this.data.imageTargetSrc, 
      maxTrack: this.data.maxTrack,
      captureRegion: this.data.captureRegion,
      showStats: this.data.showStats,
      uiLoading: this.data.uiLoading,
      uiScanning: this.data.uiScanning,
      uiError: this.data.uiError,
    });
    if (this.data.autoStart) {
      this.el.sceneEl.addEventListener('renderstart', () => {
        arSystem.start();
      });
    }
  }
});

AFRAME.registerComponent('mindar-image-target', {
  dependencies: ['mindar-image-system'],

  schema: {
    targetIndex: {type: 'number'},
  },

  postMatrix: null, // rescale the anchor to make width of 1 unit = physical width of card

  init: function() {
    const arSystem = this.el.sceneEl.systems['mindar-image-system'];
    arSystem.registerAnchor(this, this.data.targetIndex);

    const root = this.el.object3D;

    this.paintMaterial = null;

    const modelEl = this.el.querySelector("a-gltf-model")
    if (modelEl && modelEl.getAttribute("mindar-image-paint")) {
      modelEl.addEventListener('model-loaded', () => {
	modelEl.getObject3D('mesh').traverse((o) => {
	  if (o.isMesh && o.material && o.material.name === modelEl.getAttribute("mindar-image-paint")) {
	    this.paintMaterial = o.material;
	  }
	});
      });
    }

    root.visible = false;
    root.matrixAutoUpdate = false;
  },

  setupMarker([markerWidth, markerHeight]) {
    const position = new AFRAME.THREE.Vector3();
    const quaternion = new AFRAME.THREE.Quaternion();
    const scale = new AFRAME.THREE.Vector3();
    position.x = markerWidth / 2;
    position.y = markerWidth / 2 + (markerHeight - markerWidth) / 2;
    scale.x = markerWidth;
    scale.y = markerWidth;
    scale.z = markerWidth;
    this.postMatrix = new AFRAME.THREE.Matrix4();
    this.postMatrix.compose(position, quaternion, scale);
  },

  updateWorldMatrix(worldMatrix) {
    if (!this.el.object3D.visible && worldMatrix !== null) {
      this.el.emit("targetFound");
    } else if (this.el.object3D.visible && worldMatrix === null) {
      this.el.emit("targetLost");
    }

    this.el.object3D.visible = worldMatrix !== null;
    if (worldMatrix === null) {
      return;
    }
    var m = new AFRAME.THREE.Matrix4();
    m.elements = worldMatrix;
    m.multiply(this.postMatrix);
    this.el.object3D.matrix = m;
  },

  updatePaint(pixels) {
    if (!this.paintMaterial || this.el.object3D.visible) return;

    const height = pixels.length;
    const width = pixels[0].length;
    const data = new Uint8ClampedArray(height * width * 4);
    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
	const pos = j * width + i;
	data[pos*4 + 0] = pixels[j][i][0];
	data[pos*4 + 1] = pixels[j][i][1];
	data[pos*4 + 2] = pixels[j][i][2];
	data[pos*4 + 3] = 255; 
      }
    }
    const imageData = new ImageData(data, width, height);
    const canvas = document.createElement("canvas");
    canvas.height = height;
    canvas.width = width;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);

    const dataURL = canvas.toDataURL("image/png");
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(dataURL, (texture) => {
      this.paintMaterial.map.dispose();
      this.paintMaterial.map = texture;
      this.paintMaterial.needsUpdate = true;
    });
  },
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9taW5kLWFyLy4vc3JjL2ltYWdlLXRhcmdldC9hZnJhbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLGVBQWU7O0FBRXRCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsR0FBRzs7QUFFSCxtQkFBbUIsbUZBQW1GO0FBQ3RHO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLCtCQUErQjtBQUNyRCxHQUFHOztBQUVIO0FBQ0EsOEJBQThCLGlDQUFpQztBQUMvRCxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9DQUFvQztBQUNwQyxtRUFBbUUsUUFBUSxTQUFTO0FBQ3BGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLCtCQUErQixvQkFBb0I7QUFDbkQ7QUFDQTtBQUNBOztBQUVBLHlDQUF5QztBQUN6QztBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsS0FBSztBQUNMO0FBQ0EsK0JBQStCLG9CQUFvQjtBQUNuRCxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUEsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUseUJBQXlCOztBQUVuQyxrQkFBa0IsZ0NBQWdDO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBLHdGQUF3RjtBQUN4RjtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVyxrQ0FBa0M7O0FBRTdDLG1CQUFtQixnQ0FBZ0M7QUFDbkQsYUFBYSxnQkFBZ0I7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7QUFFRDtBQUNBOztBQUVBO0FBQ0EscUJBQXFCLGVBQWU7QUFDcEMsZUFBZSx3QkFBd0I7QUFDdkMsZ0JBQWdCLGdDQUFnQztBQUNoRCxvQkFBb0IsZ0NBQWdDO0FBQ3BELGdCQUFnQiwrQkFBK0I7QUFDL0MsZ0JBQWdCLCtCQUErQjtBQUMvQyxpQkFBaUIsK0JBQStCO0FBQ2hELGNBQWMsK0JBQStCO0FBQzdDLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLGVBQWU7QUFDakMsR0FBRzs7QUFFSDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0YsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFlBQVk7QUFDL0IscUJBQXFCLFdBQVc7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNILENBQUMiLCJmaWxlIjoibWluZGFyLWltYWdlLWFmcmFtZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHtDb250cm9sbGVyLCBVSX0gPSB3aW5kb3cuTUlOREFSLklNQUdFO1xuXG5BRlJBTUUucmVnaXN0ZXJTeXN0ZW0oJ21pbmRhci1pbWFnZS1zeXN0ZW0nLCB7XG4gIGNvbnRhaW5lcjogbnVsbCxcbiAgdmlkZW86IG51bGwsXG4gIHByb2Nlc3NpbmdJbWFnZTogZmFsc2UsXG5cbiAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5hbmNob3JFbnRpdGllcyA9IFtdO1xuICB9LFxuXG4gIHRpY2s6IGZ1bmN0aW9uKCkge1xuICB9LFxuXG4gIHNldHVwOiBmdW5jdGlvbih7aW1hZ2VUYXJnZXRTcmMsIG1heFRyYWNrLCBzaG93U3RhdHMsIHVpTG9hZGluZywgdWlTY2FubmluZywgdWlFcnJvciwgY2FwdHVyZVJlZ2lvbn0pIHtcbiAgICB0aGlzLmltYWdlVGFyZ2V0U3JjID0gaW1hZ2VUYXJnZXRTcmM7XG4gICAgdGhpcy5tYXhUcmFjayA9IG1heFRyYWNrO1xuICAgIHRoaXMuc2hvd1N0YXRzID0gc2hvd1N0YXRzO1xuICAgIHRoaXMuY2FwdHVyZVJlZ2lvbiA9IGNhcHR1cmVSZWdpb247XG4gICAgdGhpcy51aSA9IG5ldyBVSSh7dWlMb2FkaW5nLCB1aVNjYW5uaW5nLCB1aUVycm9yfSk7XG4gIH0sXG5cbiAgcmVnaXN0ZXJBbmNob3I6IGZ1bmN0aW9uKGVsLCB0YXJnZXRJbmRleCkge1xuICAgIHRoaXMuYW5jaG9yRW50aXRpZXMucHVzaCh7ZWw6IGVsLCB0YXJnZXRJbmRleDogdGFyZ2V0SW5kZXh9KTtcbiAgfSxcblxuICBzdGFydDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5jb250YWluZXIgPSB0aGlzLmVsLnNjZW5lRWwucGFyZW50Tm9kZTtcblxuICAgIGlmICh0aGlzLnNob3dTdGF0cykge1xuICAgICAgdGhpcy5tYWluU3RhdHMgPSBuZXcgU3RhdHMoKTtcbiAgICAgIHRoaXMubWFpblN0YXRzLnNob3dQYW5lbCggMCApOyAvLyAwOiBmcHMsIDE6IG1zLCAyOiBtYiwgMys6IGN1c3RvbVxuICAgICAgdGhpcy5tYWluU3RhdHMuZG9tRWxlbWVudC5zdHlsZS5jc3NUZXh0ID0gJ3Bvc2l0aW9uOmFic29sdXRlO3RvcDowcHg7bGVmdDowcHg7ei1pbmRleDo5OTknO1xuICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5tYWluU3RhdHMuZG9tRWxlbWVudCk7XG4gICAgfVxuXG4gICAgdGhpcy51aS5zaG93TG9hZGluZygpO1xuICAgIHRoaXMuX3N0YXJ0VmlkZW8oKTtcbiAgfSxcblxuICBzd2l0Y2hUYXJnZXQ6IGZ1bmN0aW9uKHRhcmdldEluZGV4KSB7XG4gICAgdGhpcy5jb250cm9sbGVyLmludGVyZXN0ZWRUYXJnZXRJbmRleCA9IHRhcmdldEluZGV4O1xuICB9LFxuXG4gIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucGF1c2UoKTtcbiAgICBjb25zdCB0cmFja3MgPSB0aGlzLnZpZGVvLnNyY09iamVjdC5nZXRUcmFja3MoKTtcbiAgICB0cmFja3MuZm9yRWFjaChmdW5jdGlvbih0cmFjaykge1xuICAgICAgdHJhY2suc3RvcCgpO1xuICAgIH0pO1xuICAgIHRoaXMudmlkZW8ucmVtb3ZlKCk7XG4gIH0sXG5cbiAgcGF1c2U6IGZ1bmN0aW9uKGtlZXBWaWRlbz1mYWxzZSkge1xuICAgIGlmICgha2VlcFZpZGVvKSB7XG4gICAgICB0aGlzLnZpZGVvLnBhdXNlKCk7XG4gICAgfVxuICAgIHRoaXMuY29udHJvbGxlci5zdG9wUHJvY2Vzc1ZpZGVvKCk7XG4gIH0sXG5cbiAgdW5wYXVzZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWRlby5wbGF5KCk7XG4gICAgdGhpcy5jb250cm9sbGVyLnByb2Nlc3NWaWRlbyh0aGlzLnZpZGVvKTtcbiAgfSxcblxuICBfc3RhcnRWaWRlbzogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG5cbiAgICB0aGlzLnZpZGVvLnNldEF0dHJpYnV0ZSgnYXV0b3BsYXknLCAnJyk7XG4gICAgdGhpcy52aWRlby5zZXRBdHRyaWJ1dGUoJ211dGVkJywgJycpO1xuICAgIHRoaXMudmlkZW8uc2V0QXR0cmlidXRlKCdwbGF5c2lubGluZScsICcnKTtcbiAgICB0aGlzLnZpZGVvLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xuICAgIHRoaXMudmlkZW8uc3R5bGUudG9wID0gJzBweCdcbiAgICB0aGlzLnZpZGVvLnN0eWxlLmxlZnQgPSAnMHB4J1xuICAgIHRoaXMudmlkZW8uc3R5bGUuekluZGV4ID0gJy0yJ1xuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMudmlkZW8pO1xuXG4gICAgaWYgKCFuYXZpZ2F0b3IubWVkaWFEZXZpY2VzIHx8ICFuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSkge1xuICAgICAgLy8gVE9ETzogc2hvdyB1bnN1cHBvcnRlZCBlcnJvclxuICAgICAgdGhpcy5lbC5lbWl0KFwiYXJFcnJvclwiLCB7ZXJyb3I6ICdWSURFT19GQUlMJ30pO1xuICAgICAgdGhpcy51aS5zaG93Q29tcGF0aWJpbGl0eSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKHthdWRpbzogZmFsc2UsIHZpZGVvOiB7XG4gICAgICBmYWNpbmdNb2RlOiAnZW52aXJvbm1lbnQnLFxuICAgIH19KS50aGVuKChzdHJlYW0pID0+IHtcbiAgICAgIHRoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lciggJ2xvYWRlZG1ldGFkYXRhJywgKCkgPT4ge1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwidmlkZW8gcmVhZHkuLi5cIiwgdGhpcy52aWRlbyk7XG4gICAgICAgIHRoaXMudmlkZW8uc2V0QXR0cmlidXRlKCd3aWR0aCcsIHRoaXMudmlkZW8udmlkZW9XaWR0aCk7XG4gICAgICAgIHRoaXMudmlkZW8uc2V0QXR0cmlidXRlKCdoZWlnaHQnLCB0aGlzLnZpZGVvLnZpZGVvSGVpZ2h0KTtcbiAgICAgICAgdGhpcy5fc3RhcnRBUigpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnZpZGVvLnNyY09iamVjdCA9IHN0cmVhbTtcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcImdldFVzZXJNZWRpYSBlcnJvclwiLCBlcnIpO1xuICAgICAgdGhpcy5lbC5lbWl0KFwiYXJFcnJvclwiLCB7ZXJyb3I6ICdWSURFT19GQUlMJ30pO1xuICAgIH0pO1xuICB9LFxuXG4gIF9zdGFydEFSOiBhc3luYyBmdW5jdGlvbigpIHtcbiAgICBjb25zdCB2aWRlbyA9IHRoaXMudmlkZW87XG4gICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5jb250YWluZXI7XG5cbiAgICBsZXQgdncsIHZoOyAvLyBkaXNwbGF5IGNzcyB3aWR0aCwgaGVpZ2h0XG4gICAgY29uc3QgdmlkZW9SYXRpbyA9IHZpZGVvLnZpZGVvV2lkdGggLyB2aWRlby52aWRlb0hlaWdodDtcbiAgICBjb25zdCBjb250YWluZXJSYXRpbyA9IGNvbnRhaW5lci5jbGllbnRXaWR0aCAvIGNvbnRhaW5lci5jbGllbnRIZWlnaHQ7XG4gICAgaWYgKHZpZGVvUmF0aW8gPiBjb250YWluZXJSYXRpbykge1xuICAgICAgdmggPSBjb250YWluZXIuY2xpZW50SGVpZ2h0O1xuICAgICAgdncgPSB2aCAqIHZpZGVvUmF0aW87XG4gICAgfSBlbHNlIHtcbiAgICAgIHZ3ID0gY29udGFpbmVyLmNsaWVudFdpZHRoO1xuICAgICAgdmggPSB2dyAvIHZpZGVvUmF0aW87XG4gICAgfVxuXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IENvbnRyb2xsZXIoe1xuICAgICAgaW5wdXRXaWR0aDogdmlkZW8udmlkZW9XaWR0aCxcbiAgICAgIGlucHV0SGVpZ2h0OiB2aWRlby52aWRlb0hlaWdodCxcbiAgICAgIG1heFRyYWNrOiB0aGlzLm1heFRyYWNrLCBcbiAgICAgIG9uVXBkYXRlOiAoZGF0YSkgPT4ge1xuXHRpZiAoZGF0YS50eXBlID09PSAncHJvY2Vzc0RvbmUnKSB7XG5cdCAgaWYgKHRoaXMubWFpblN0YXRzKSB0aGlzLm1haW5TdGF0cy51cGRhdGUoKTtcblx0fVxuXHRlbHNlIGlmIChkYXRhLnR5cGUgPT09ICd1cGRhdGVNYXRyaXgnKSB7XG5cdCAgY29uc3Qge3RhcmdldEluZGV4LCB3b3JsZE1hdHJpeH0gPSBkYXRhO1xuXG5cdCAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFuY2hvckVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG5cdCAgICBpZiAodGhpcy5hbmNob3JFbnRpdGllc1tpXS50YXJnZXRJbmRleCA9PT0gdGFyZ2V0SW5kZXgpIHtcblx0ICAgICAgaWYgKHdvcmxkTWF0cml4KSB7XG5cdFx0dGhpcy5hbmNob3JFbnRpdGllc1tpXS5lbC51cGRhdGVQYWludCh0aGlzLmNvbnRyb2xsZXIuY2FwdHVyZWRSZWdpb24pO1xuXHQgICAgICB9XG5cdCAgICAgIHRoaXMuYW5jaG9yRW50aXRpZXNbaV0uZWwudXBkYXRlV29ybGRNYXRyaXgod29ybGRNYXRyaXgsICk7XG5cdCAgICAgIGlmICh3b3JsZE1hdHJpeCkge1xuXHRcdHRoaXMudWkuaGlkZVNjYW5uaW5nKCk7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9XG5cdH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmNvbnRyb2xsZXIuc2hvdWxkQ2FwdHVyZVJlZ2lvbiA9IHRoaXMuY2FwdHVyZVJlZ2lvbjtcblxuICAgIGNvbnN0IHByb2ogPSB0aGlzLmNvbnRyb2xsZXIuZ2V0UHJvamVjdGlvbk1hdHJpeCgpO1xuICAgIGNvbnN0IGZvdiA9IDIgKiBNYXRoLmF0YW4oMS9wcm9qWzVdIC8gdmggKiBjb250YWluZXIuY2xpZW50SGVpZ2h0ICkgKiAxODAgLyBNYXRoLlBJOyAvLyB2ZXJ0aWNhbCBmb3ZcbiAgICBjb25zdCBuZWFyID0gcHJvalsxNF0gLyAocHJvalsxMF0gLSAxLjApO1xuICAgIGNvbnN0IGZhciA9IHByb2pbMTRdIC8gKHByb2pbMTBdICsgMS4wKTtcbiAgICBjb25zdCByYXRpbyA9IHByb2pbNV0gLyBwcm9qWzBdOyAvLyAoci1sKSAvICh0LWIpXG4gICAgLy9jb25zb2xlLmxvZyhcImxvYWRlZCBwcm9qOiBcIiwgcHJvaiwgXCIuIGZvdjogXCIsIGZvdiwgXCIuIG5lYXI6IFwiLCBuZWFyLCBcIi4gZmFyOiBcIiwgZmFyLCBcIi4gcmF0aW86IFwiLCByYXRpbyk7XG4gICAgY29uc3QgbmV3QXNwZWN0ID0gY29udGFpbmVyLmNsaWVudFdpZHRoIC8gY29udGFpbmVyLmNsaWVudEhlaWdodDtcbiAgICBjb25zdCBjYW1lcmFFbGUgPSBjb250YWluZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhLWNhbWVyYVwiKVswXTtcbiAgICBjb25zdCBjYW1lcmEgPSBjYW1lcmFFbGUuZ2V0T2JqZWN0M0QoJ2NhbWVyYScpO1xuICAgIGNhbWVyYS5mb3YgPSBmb3Y7XG4gICAgY2FtZXJhLmFzcGVjdCA9IG5ld0FzcGVjdDtcbiAgICBjYW1lcmEubmVhciA9IG5lYXI7XG4gICAgY2FtZXJhLmZhciA9IGZhcjtcbiAgICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICAgIC8vY29uc3QgbmV3Q2FtID0gbmV3IEFGUkFNRS5USFJFRS5QZXJzcGVjdGl2ZUNhbWVyYShmb3YsIG5ld1JhdGlvLCBuZWFyLCBmYXIpO1xuICAgIC8vY2FtZXJhLmdldE9iamVjdDNEKCdjYW1lcmEnKS5wcm9qZWN0aW9uTWF0cml4ID0gbmV3Q2FtLnByb2plY3Rpb25NYXRyaXg7XG5cbiAgICB0aGlzLnZpZGVvLnN0eWxlLnRvcCA9ICgtKHZoIC0gY29udGFpbmVyLmNsaWVudEhlaWdodCkgLyAyKSArIFwicHhcIjtcbiAgICB0aGlzLnZpZGVvLnN0eWxlLmxlZnQgPSAoLSh2dyAtIGNvbnRhaW5lci5jbGllbnRXaWR0aCkgLyAyKSArIFwicHhcIjtcbiAgICB0aGlzLnZpZGVvLnN0eWxlLndpZHRoID0gdncgKyBcInB4XCI7XG4gICAgdGhpcy52aWRlby5zdHlsZS5oZWlnaHQgPSB2aCArIFwicHhcIjtcblxuICAgIGNvbnN0IHtkaW1lbnNpb25zOiBpbWFnZVRhcmdldERpbWVuc2lvbnN9ID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmFkZEltYWdlVGFyZ2V0cyh0aGlzLmltYWdlVGFyZ2V0U3JjKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hbmNob3JFbnRpdGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qge2VsLCB0YXJnZXRJbmRleH0gPSB0aGlzLmFuY2hvckVudGl0aWVzW2ldO1xuICAgICAgaWYgKHRhcmdldEluZGV4IDwgaW1hZ2VUYXJnZXREaW1lbnNpb25zLmxlbmd0aCkge1xuICAgICAgICBlbC5zZXR1cE1hcmtlcihpbWFnZVRhcmdldERpbWVuc2lvbnNbdGFyZ2V0SW5kZXhdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLmNvbnRyb2xsZXIuZHVtbXlSdW4odGhpcy52aWRlbyk7XG4gICAgdGhpcy5lbC5lbWl0KFwiYXJSZWFkeVwiKTtcbiAgICB0aGlzLnVpLmhpZGVMb2FkaW5nKCk7XG4gICAgdGhpcy51aS5zaG93U2Nhbm5pbmcoKTtcblxuICAgIHRoaXMuY29udHJvbGxlci5wcm9jZXNzVmlkZW8odGhpcy52aWRlbyk7XG4gIH0sXG59KTtcblxuQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KCdtaW5kYXItaW1hZ2UnLCB7XG4gIGRlcGVuZGVuY2llczogWydtaW5kYXItaW1hZ2Utc3lzdGVtJ10sXG5cbiAgc2NoZW1hOiB7XG4gICAgaW1hZ2VUYXJnZXRTcmM6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgbWF4VHJhY2s6IHt0eXBlOiAnaW50JywgZGVmYXVsdDogMX0sXG4gICAgc2hvd1N0YXRzOiB7dHlwZTogJ2Jvb2xlYW4nLCBkZWZhdWx0OiBmYWxzZX0sXG4gICAgY2FwdHVyZVJlZ2lvbjoge3R5cGU6ICdib29sZWFuJywgZGVmYXVsdDogZmFsc2V9LFxuICAgIGF1dG9TdGFydDoge3R5cGU6ICdib29sZWFuJywgZGVmYXVsdDogdHJ1ZX0sXG4gICAgdWlMb2FkaW5nOiB7dHlwZTogJ3N0cmluZycsIGRlZmF1bHQ6ICd5ZXMnfSxcbiAgICB1aVNjYW5uaW5nOiB7dHlwZTogJ3N0cmluZycsIGRlZmF1bHQ6ICd5ZXMnfSxcbiAgICB1aUVycm9yOiB7dHlwZTogJ3N0cmluZycsIGRlZmF1bHQ6ICd5ZXMnfSxcbiAgfSxcblxuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBhclN5c3RlbSA9IHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zWydtaW5kYXItaW1hZ2Utc3lzdGVtJ107XG5cbiAgICBhclN5c3RlbS5zZXR1cCh7XG4gICAgICBpbWFnZVRhcmdldFNyYzogdGhpcy5kYXRhLmltYWdlVGFyZ2V0U3JjLCBcbiAgICAgIG1heFRyYWNrOiB0aGlzLmRhdGEubWF4VHJhY2ssXG4gICAgICBjYXB0dXJlUmVnaW9uOiB0aGlzLmRhdGEuY2FwdHVyZVJlZ2lvbixcbiAgICAgIHNob3dTdGF0czogdGhpcy5kYXRhLnNob3dTdGF0cyxcbiAgICAgIHVpTG9hZGluZzogdGhpcy5kYXRhLnVpTG9hZGluZyxcbiAgICAgIHVpU2Nhbm5pbmc6IHRoaXMuZGF0YS51aVNjYW5uaW5nLFxuICAgICAgdWlFcnJvcjogdGhpcy5kYXRhLnVpRXJyb3IsXG4gICAgfSk7XG4gICAgaWYgKHRoaXMuZGF0YS5hdXRvU3RhcnQpIHtcbiAgICAgIHRoaXMuZWwuc2NlbmVFbC5hZGRFdmVudExpc3RlbmVyKCdyZW5kZXJzdGFydCcsICgpID0+IHtcbiAgICAgICAgYXJTeXN0ZW0uc3RhcnQoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSk7XG5cbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudCgnbWluZGFyLWltYWdlLXRhcmdldCcsIHtcbiAgZGVwZW5kZW5jaWVzOiBbJ21pbmRhci1pbWFnZS1zeXN0ZW0nXSxcblxuICBzY2hlbWE6IHtcbiAgICB0YXJnZXRJbmRleDoge3R5cGU6ICdudW1iZXInfSxcbiAgfSxcblxuICBwb3N0TWF0cml4OiBudWxsLCAvLyByZXNjYWxlIHRoZSBhbmNob3IgdG8gbWFrZSB3aWR0aCBvZiAxIHVuaXQgPSBwaHlzaWNhbCB3aWR0aCBvZiBjYXJkXG5cbiAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgYXJTeXN0ZW0gPSB0aGlzLmVsLnNjZW5lRWwuc3lzdGVtc1snbWluZGFyLWltYWdlLXN5c3RlbSddO1xuICAgIGFyU3lzdGVtLnJlZ2lzdGVyQW5jaG9yKHRoaXMsIHRoaXMuZGF0YS50YXJnZXRJbmRleCk7XG5cbiAgICBjb25zdCByb290ID0gdGhpcy5lbC5vYmplY3QzRDtcblxuICAgIHRoaXMucGFpbnRNYXRlcmlhbCA9IG51bGw7XG5cbiAgICBjb25zdCBtb2RlbEVsID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKFwiYS1nbHRmLW1vZGVsXCIpXG4gICAgaWYgKG1vZGVsRWwgJiYgbW9kZWxFbC5nZXRBdHRyaWJ1dGUoXCJtaW5kYXItaW1hZ2UtcGFpbnRcIikpIHtcbiAgICAgIG1vZGVsRWwuYWRkRXZlbnRMaXN0ZW5lcignbW9kZWwtbG9hZGVkJywgKCkgPT4ge1xuXHRtb2RlbEVsLmdldE9iamVjdDNEKCdtZXNoJykudHJhdmVyc2UoKG8pID0+IHtcblx0ICBpZiAoby5pc01lc2ggJiYgby5tYXRlcmlhbCAmJiBvLm1hdGVyaWFsLm5hbWUgPT09IG1vZGVsRWwuZ2V0QXR0cmlidXRlKFwibWluZGFyLWltYWdlLXBhaW50XCIpKSB7XG5cdCAgICB0aGlzLnBhaW50TWF0ZXJpYWwgPSBvLm1hdGVyaWFsO1xuXHQgIH1cblx0fSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByb290LnZpc2libGUgPSBmYWxzZTtcbiAgICByb290Lm1hdHJpeEF1dG9VcGRhdGUgPSBmYWxzZTtcbiAgfSxcblxuICBzZXR1cE1hcmtlcihbbWFya2VyV2lkdGgsIG1hcmtlckhlaWdodF0pIHtcbiAgICBjb25zdCBwb3NpdGlvbiA9IG5ldyBBRlJBTUUuVEhSRUUuVmVjdG9yMygpO1xuICAgIGNvbnN0IHF1YXRlcm5pb24gPSBuZXcgQUZSQU1FLlRIUkVFLlF1YXRlcm5pb24oKTtcbiAgICBjb25zdCBzY2FsZSA9IG5ldyBBRlJBTUUuVEhSRUUuVmVjdG9yMygpO1xuICAgIHBvc2l0aW9uLnggPSBtYXJrZXJXaWR0aCAvIDI7XG4gICAgcG9zaXRpb24ueSA9IG1hcmtlcldpZHRoIC8gMiArIChtYXJrZXJIZWlnaHQgLSBtYXJrZXJXaWR0aCkgLyAyO1xuICAgIHNjYWxlLnggPSBtYXJrZXJXaWR0aDtcbiAgICBzY2FsZS55ID0gbWFya2VyV2lkdGg7XG4gICAgc2NhbGUueiA9IG1hcmtlcldpZHRoO1xuICAgIHRoaXMucG9zdE1hdHJpeCA9IG5ldyBBRlJBTUUuVEhSRUUuTWF0cml4NCgpO1xuICAgIHRoaXMucG9zdE1hdHJpeC5jb21wb3NlKHBvc2l0aW9uLCBxdWF0ZXJuaW9uLCBzY2FsZSk7XG4gIH0sXG5cbiAgdXBkYXRlV29ybGRNYXRyaXgod29ybGRNYXRyaXgpIHtcbiAgICBpZiAoIXRoaXMuZWwub2JqZWN0M0QudmlzaWJsZSAmJiB3b3JsZE1hdHJpeCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5lbC5lbWl0KFwidGFyZ2V0Rm91bmRcIik7XG4gICAgfSBlbHNlIGlmICh0aGlzLmVsLm9iamVjdDNELnZpc2libGUgJiYgd29ybGRNYXRyaXggPT09IG51bGwpIHtcbiAgICAgIHRoaXMuZWwuZW1pdChcInRhcmdldExvc3RcIik7XG4gICAgfVxuXG4gICAgdGhpcy5lbC5vYmplY3QzRC52aXNpYmxlID0gd29ybGRNYXRyaXggIT09IG51bGw7XG4gICAgaWYgKHdvcmxkTWF0cml4ID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBtID0gbmV3IEFGUkFNRS5USFJFRS5NYXRyaXg0KCk7XG4gICAgbS5lbGVtZW50cyA9IHdvcmxkTWF0cml4O1xuICAgIG0ubXVsdGlwbHkodGhpcy5wb3N0TWF0cml4KTtcbiAgICB0aGlzLmVsLm9iamVjdDNELm1hdHJpeCA9IG07XG4gIH0sXG5cbiAgdXBkYXRlUGFpbnQocGl4ZWxzKSB7XG4gICAgaWYgKCF0aGlzLnBhaW50TWF0ZXJpYWwgfHwgdGhpcy5lbC5vYmplY3QzRC52aXNpYmxlKSByZXR1cm47XG5cbiAgICBjb25zdCBoZWlnaHQgPSBwaXhlbHMubGVuZ3RoO1xuICAgIGNvbnN0IHdpZHRoID0gcGl4ZWxzWzBdLmxlbmd0aDtcbiAgICBjb25zdCBkYXRhID0gbmV3IFVpbnQ4Q2xhbXBlZEFycmF5KGhlaWdodCAqIHdpZHRoICogNCk7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBoZWlnaHQ7IGorKykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3aWR0aDsgaSsrKSB7XG5cdGNvbnN0IHBvcyA9IGogKiB3aWR0aCArIGk7XG5cdGRhdGFbcG9zKjQgKyAwXSA9IHBpeGVsc1tqXVtpXVswXTtcblx0ZGF0YVtwb3MqNCArIDFdID0gcGl4ZWxzW2pdW2ldWzFdO1xuXHRkYXRhW3Bvcyo0ICsgMl0gPSBwaXhlbHNbal1baV1bMl07XG5cdGRhdGFbcG9zKjQgKyAzXSA9IDI1NTsgXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGltYWdlRGF0YSA9IG5ldyBJbWFnZURhdGEoZGF0YSwgd2lkdGgsIGhlaWdodCk7XG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICBjdHgucHV0SW1hZ2VEYXRhKGltYWdlRGF0YSwgMCwgMCk7XG5cbiAgICBjb25zdCBkYXRhVVJMID0gY2FudmFzLnRvRGF0YVVSTChcImltYWdlL3BuZ1wiKTtcbiAgICBjb25zdCB0ZXh0dXJlTG9hZGVyID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKTtcbiAgICB0ZXh0dXJlTG9hZGVyLmxvYWQoZGF0YVVSTCwgKHRleHR1cmUpID0+IHtcbiAgICAgIHRoaXMucGFpbnRNYXRlcmlhbC5tYXAuZGlzcG9zZSgpO1xuICAgICAgdGhpcy5wYWludE1hdGVyaWFsLm1hcCA9IHRleHR1cmU7XG4gICAgICB0aGlzLnBhaW50TWF0ZXJpYWwubmVlZHNVcGRhdGUgPSB0cnVlO1xuICAgIH0pO1xuICB9LFxufSk7XG4iXSwic291cmNlUm9vdCI6IiJ9