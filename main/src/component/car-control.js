AFRAME.registerComponent('car', {
    init: function () {
      window.addEventListener('keydown', this.onKeyDown.bind(this))
      window.addEventListener('keyup', this.onKeyUp.bind(this))
      this.rotating = 0;  // Analog, -1 left, +1 right
      this.speeding = 0;  // Analog, -1 slower, +1 faster
      this.speed = 0.0
      this.maxSpeed = 2;  // m/s
      this.rotationRate = Math.PI / 2;  // radian/s
      this.speedIncrement = 6  // m/s^2;  
    },
    onAxisMoveSpeed: function(e) {
      // Negate because Gamepad API axis "forward" is -1.
      this.speeding = -e.detail.axis[1];
    },
    onAxisMoveAngle: function(e) {
      this.rotating = e.detail.axis[0];
    },
    onKeyDown: function (e) {
      if (e.keyCode == 65) {
        this.rotating = -1;
      } else if (e.keyCode == 68) {
        this.rotating = 1;
      } else if (e.keyCode == 87) {
        this.speeding = 1;
      } else if (e.keyCode == 83) {
        this.speeding = -1;
      }
    },
    onKeyUp: function (e) {
      if (e.keyCode == 65 || e.keyCode == 68) {
        this.rotating = 0
      } else if (e.keyCode == 87 || e.keyCode == 83) {
        this.speeding = 0
      }
    },
    tick: function (time, timeDelta) {
      // Cap the time delta to avoid unreasonable jumps after pauses.
      let deltaSeconds = Math.min(timeDelta / 1000, 1/30);
      // console.log('deltaSeconds', deltaSeconds, 'from', timeDelta);
      if (Math.abs(this.speed) > 0.5 && this.rotating != 0) {
        const direction = this.speed > 0 ? 1 : -1;
        this.el.object3D.rotateY(-direction * this.rotating * this.rotationRate * deltaSeconds)
      }
      if (this.speeding != 0) {
        this.speed = this.speed + this.speeding * this.speedIncrement * deltaSeconds;
        if (this.speeding > 0) {
          this.speed = Math.min(this.speed, this.maxSpeed);
        } else {
          this.speed = Math.max(this.speed, -this.maxSpeed);
        }
      }
      const position = this.el.getAttribute('position')
      const rotation = this.el.getAttribute('rotation')
      const angle = Math.PI * rotation.y / 180
      //if (this.speed != 0) console.log(this.speeding, this.speed, angle);
      position.x += this.speed * Math.sin(angle) * deltaSeconds;
      position.z += this.speed * Math.cos(angle) * deltaSeconds;
      this.el.setAttribute('position', position)
      if (this.speeding == 0 && this.speed > 0) {
        this.speed = Math.max(this.speed - this.speedIncrement * deltaSeconds / 2, 0)
      }
      if (this.speeding == 0 && this.speed < 0) {
        this.speed = Math.min(this.speed + this.speedIncrement * deltaSeconds / 2, 0)
      }
    }
  })
  
  AFRAME.registerComponent('car-controller-left', {
    init: function () {
      this.el.addEventListener('axismove', function (e) {
        const car = document.querySelector('[car]').components.car
        car.onAxisMoveSpeed(e)
      })
    }
  })
  
  AFRAME.registerComponent('car-controller-right', {
    init: function () {
      this.el.addEventListener('axismove', function (e) {
        const car = document.querySelector('[car]').components.car
        car.onAxisMoveAngle(e)
      })
    }
  })

  AFRAME.registerComponent('car-controller-two-axis', {
    init: function () {
      this.el.addEventListener('axismove', (ev) => {
        const car = document.querySelector('[car]').components.car;
        car.onAxisMoveAngle(ev);
        car.onAxisMoveSpeed(ev);
      });
    }
  })

  AFRAME.registerComponent('xr-two-axis-controller', {
    schema: {
      deadZone: {default: 0}
    },
    tick: function () {
      let emit = (x, y) => {
        let detail = {axis: [x, y, 0], changed: [0, 1]};
        this.deflected = (x != 0 || y != 0);
        this.el.emit('axismove', detail, false);
      };

      let session = this.el.sceneEl.renderer.xr.getSession();
      if (!session) return;
      let inputs = session.inputSources;

      for (let i = 0; i < inputs.length; ++i) {
        let source = inputs[i];
        //console.log('tick source=', source);
        // Ignore screen touch.
        if (source.targetRayMode == "screen")
          continue;
        if (!source.gamepad || source.gamepad.axes.length < 2)
          continue;

        have_input = true;
        let x = source.gamepad.axes[0];
        let y = source.gamepad.axes[1];
        // Apply a dead zone to the controller axes.
        if (Math.abs(x) < this.data.deadZone) x = 0;
        if (Math.abs(y) < this.data.deadZone) y = 0;
        //console.log('tick', vproj.x, vproj.y);
        emit(x, y);
      }
    }
  })

  AFRAME.registerComponent('screen-controller', {
    schema: {
      deadZone: {default: 0}
    },
    init: function () {
      this.viewerSpace = null;
      this.deflected = false;
      console.log('this.el', this.el);
      this.el.sceneEl.renderer.xr.addEventListener('sessionend', (ev) => {
        console.log('sessionend', ev);
        this.viewerSpace = null;
      });
      this.el.sceneEl.renderer.xr.addEventListener('sessionstart', (ev) => {
        console.log('sessionstart', ev);

        let session = this.el.sceneEl.renderer.xr.getSession();

        // Get a 'viewer' reference space (attached to the phone) for use
        // with screen space input.
        session.requestReferenceSpace('viewer').then((space) => {
          console.log('got viewer space', space);
          this.viewerSpace = space;
        });
      });
    },
    tick: function () {
      if (!this.viewerSpace) return;

      let emit = (x, y) => {
        let detail = {axis: [x, y, 0], changed: [0, 1]};
        this.deflected = (x != 0 || y != 0);
        this.el.emit('axismove', detail, false);
      };

      let session = this.el.sceneEl.renderer.xr.getSession();
      if (!session) return;

      // Ignore the XR screen input source if DOM Overlay is in use.
      if (session.domOverlayState) return;

      let inputs = session.inputSources;

      let have_input = false;
      for (let i = 0; i < inputs.length; ++i) {
        let source = inputs[i];
        //console.log('tick source=', source);
        // Ignore inputs other than screen touch. Other controller types
        // are handled separately.
        if (source.targetRayMode != "screen")
          continue;

        let frame = this.el.sceneEl.frame;

        // Get a pose for the touch event in viewer space, this is locked to
        // the phone and moves with the phone. This way, the input pose
        // is relative to the virtual camera position. (For world interactions,
        // we'd want to use local-floor space or similar.)
        let inputPose = frame.getPose(source.targetRaySpace, this.viewerSpace);

        // Transform a point on the input space ray into viewer space. This is
        // the transform matrix multiplied by a (0, 0, -1, 1) vector,
        // equivalent to subtracting the Z axis basis vector (third column)
        // from the ray origin in viewer space (fourth column).
        //
        // Using three.js:
        //
        //let inputMat = new THREE.Matrix4();
        //inputMat.fromArray(inputPose.transform.matrix);
        //let vvec = new THREE.Vector4(0, 0, -1, 1);
        //vvec.applyMatrix4(inputMat);
        //
        // Equivalent unrolled version:
        let m = inputPose.transform.matrix;
        let vx = m[12] - m[8];
        let vy = m[13] - m[9];
        let vz = m[14] - m[10];
        let vw = 1 - m[11];
        let vvec = new THREE.Vector4(vx, vy, vz, vw);

        // For debugging, move the cursor to the corresponding screen
        // position. This is a 3D point, but the Z location doesn't matter as
        // long as its projected location is where we want it to end up
        // onscreen.
        //let cursor = document.getElementById('cursor');
        //cursor.setAttribute('position', vvec);

        // Now apply the screen projection to get a NDC vector
        // with x/y ranging from -1 to 1 covering the screen,
        // so the bottom left screen corner is (-1, -1).
        let viewerPose = frame.getViewerPose(this.viewerSpace);
        let proj = new THREE.Matrix4();
        proj.fromArray(viewerPose.views[0].projectionMatrix);
        let vproj = vvec.applyMatrix4(proj);
        vproj.divideScalar(vproj.w);

        have_input = true;
        // Apply a dead zone to the controller axes.
        if (Math.abs(vproj.x) < this.data.deadZone) vproj.x = 0;
        if (Math.abs(vproj.y) < this.data.deadZone) vproj.y = 0;
        //console.log('tick', vproj.x, vproj.y);
        emit(vproj.x, -vproj.y);
      }

      // If we haven't seen any screen input, make sure the virtual joystick
      // returns to center if needed.
      if (!have_input && this.deflected) {
        emit(0, 0);
      }
    }
  })

  // This screen joystick uses a DIV with a draggable element.
  // It works in 2D mode, or in WebXR immersive-ar when using
  // DOM Overlay. (That currently requires a modified A-Frame
  // which activates the feature, and enabling "WebXR DOM Overlay"
  // or "WebXR Incubations" in chrome://flags.)
  AFRAME.registerComponent('screen-joystick', {
    init: function () {
      this.emit = (x, y) => {
        let detail = {axis: [x, y, 0], changed: [0, 1]};
        //console.log('emit', x, y);
        this.el.emit('axismove', detail, false);
      };
      this.controlsDiv = document.getElementById('controls');
      this.controlStickDiv = document.getElementById('controlstick');
      this.enabled = false;

      // Don't generate WebXR select events for interactions with the screen
      // controls to avoid duplicate input. This is a new proposed API, it
      // has no effect in current Chrome versions, but those don't generate
      // any XR select events while the DOM overlay is active anyway. See
      // https://immersive-web.github.io/dom-overlays/#onbeforexrselect
      this.controlsDiv.addEventListener('beforexrselect', ev => {
        console.log(ev.type, ev);
        ev.preventDefault();
      });

      this.controlsDiv.addEventListener('pointerdown', ev => {
        //console.log(ev.type, ev.offsetX, ev.offsetY);
        //this.controlStickDiv.style.visibility = '';
        this.enabled = true;
      });

      this.controlsDiv.addEventListener('pointermove', ev => {
        if (!this.enabled) return;
        let evX = ev.pageX - this.controlsDiv.offsetLeft;
        let evY = ev.pageY - this.controlsDiv.offsetTop;
        //console.log(ev.type, evX, evY, ev);
        this.controlStickDiv.style.left =
          (evX - this.controlStickDiv.offsetWidth / 2) + 'px';
        this.controlStickDiv.style.top =
          (evY - this.controlStickDiv.offsetHeight / 2) + 'px';
        this.emit(
          (evX / this.controlsDiv.offsetWidth) * 2 - 1,
          (evY / this.controlsDiv.offsetHeight) * 2 - 1);
      });

      this.controlsDiv.addEventListener('pointerup', ev => {
        this.enabled = false;
        //console.log(ev.type, ev.offsetX, ev.offsetY);
        this.controlStickDiv.style.left =
          (this.controlsDiv.offsetWidth / 2 - this.controlStickDiv.offsetWidth / 2) + 'px';
        this.controlStickDiv.style.top =
          (this.controlsDiv.offsetHeight / 2 - this.controlStickDiv.offsetHeight / 2) + 'px';
        this.emit(0, 0);
        //this.controlStickDiv.style.visibility = 'hidden';
      });

      this.controlsDiv.addEventListener('pointerout', ev => {
        this.enabled = false;
        //console.log(ev.type, ev.offsetX, ev.offsetY);
        this.controlStickDiv.style.left =
          (this.controlsDiv.offsetWidth / 2 - this.controlStickDiv.offsetWidth / 2) + 'px';
        this.controlStickDiv.style.top =
          (this.controlsDiv.offsetHeight / 2 - this.controlStickDiv.offsetHeight / 2) + 'px';
        this.emit(0, 0);
        //this.controlStickDiv.style.visibility = 'hidden';
      });
    },
    tick: function () {
    }
  })
