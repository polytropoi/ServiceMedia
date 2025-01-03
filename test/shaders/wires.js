

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 25, 200);
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setClearColor(0x404040);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
window.addEventListener( 'resize', function(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}, false );

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.minPolarAngle = THREE.Math.degToRad(80);
controls.maxPolarAngle = THREE.Math.degToRad(87);
controls.minDistance = 100;
controls.maxDistance = 250;
controls.enablePan = false;

var pWidth = 100;
var pHeight = 100;
var planeGeom = new THREE.PlaneBufferGeometry(500, 500, pWidth, pHeight).toGrid();
planeGeom.rotateX(-Math.PI * .5);

var seaDown = new THREE.LineSegments(planeGeom, new THREE.ShaderMaterial({
  uniforms: {
    color: {
      value: new THREE.Color("blue")
    },
    opacity: {
      value: .75
    },
    time: {
      value: 0
    },
    amplitude: {
      value: 5
    },
    waveLength: {
      value: Math.PI * 10
    }
  },
  vertexShader: vertShader,
  fragmentShader: fragShader,
  transparent: true
}));
scene.add(seaDown);

var seaDownPoints = new THREE.Points(planeGeom, new THREE.ShaderMaterial({
  uniforms: {
    color: {
      value: new THREE.Color("maroon").multiplyScalar(1.25)
    },
    opacity: {
      value: 1
    },
    size: {
      value: 1.25
    },
    time: {
      value: 0
    },
    amplitude: {
      value: 5
    },
    waveLength: {
      value: Math.PI * 10
    }
  },
  vertexShader: vertShader,
  fragmentShader: fragShader,
  transparent: false
}));
scene.add(seaDownPoints);

var depth = 50;
var seaSurface = new THREE.LineSegments(planeGeom, new THREE.ShaderMaterial({
  uniforms: {
    color: {
      value: new THREE.Color("red")
    },
    opacity: {
      value: .75
    },
    time: {
      value: 0
    },
    amplitude: {
      value: 5
    },
    waveLength: {
      value: Math.PI * 10
    }
  },
  vertexShader: vertShader,
  fragmentShader: fragShader,
  transparent: true
}));
seaSurface.position.y = depth;
scene.add(seaSurface);

var seaSurfacePoints = new THREE.Points(planeGeom, new THREE.ShaderMaterial({
  uniforms: {
    color: {
      value: new THREE.Color("gray").multiplyScalar(1.25)
    },
    opacity: {
      value: 1
    },
    size: {
      value: 1.25
    },
    time: {
      value: 0
    },
    amplitude: {
      value: 5
    },
    waveLength: {
      value: Math.PI * 10
    }
  },
  vertexShader: vertShader,
  fragmentShader: fragShader,
  transparent: false
}));
seaSurfacePoints.position.y = depth;
scene.add(seaSurfacePoints);

// seaweed
var seaweeds = [];
var weedHeight = 40;
var seaweedGeom = new THREE.PlaneBufferGeometry(4, weedHeight, 4, 40).toGrid();
seaweedGeom.translate(0, 20, 0);
for (let i = 0; i < 20; i++) {
  let pos = new THREE.Vector3(THREE.Math.randInt(-25, 25) * 5, 0, THREE.Math.randInt(-25, 25) * 5);

  let seaweed = new THREE.LineSegments(seaweedGeom, new THREE.ShaderMaterial({
    uniforms: {
      color1: {
        value: new THREE.Color("teal")
      },
      color2: {
        value: new THREE.Color("aqua")
      },
      time: {
        value: 0
      },
      amplitude: {
        value: 5
      },
      waveLength: {
        value: Math.PI * 10
      },
      pos: {
        value: pos
      },
      timeSpeed: {
        value: THREE.Math.randFloat(Math.PI * .5, Math.PI)
      },
      weedHeight: {
        value: weedHeight
      },
      initRotation: {
        value: THREE.Math.randFloat(0, Math.PI)
      },
      speedRotation: {
        value: THREE.Math.randFloat(Math.PI * 0.5, Math.PI)
      }
    },
    vertexShader: weedVertShader,
    fragmentShader: weedFragShader
  }));
  scene.add(seaweed);
  seaweeds.push(seaweed)
}

// manta ray
var mantaSize = 20;
var mantaSegs = 20;
var mantaGeom = new THREE.PlaneBufferGeometry(mantaSize, mantaSize, mantaSegs, mantaSegs).toGrid();
mantaGeom.rotateX(-Math.PI * .5);
mantaGeom.rotateY(-Math.PI * .25);
var quartDiag = Math.sqrt(mantaSize * mantaSize + mantaSize * mantaSize) * .25;

// head
for (let i = 0; i < mantaGeom.attributes.position.count; i++) {
  let z = mantaGeom.attributes.position.array[i * 3 + 2];
  if (z > quartDiag * 1.5) {
    let shift = -(z - quartDiag * 1.5) / (quartDiag * .5) * 1.5;
    mantaGeom.attributes.position.array[i * 3 + 1] = shift;
    mantaGeom.attributes.position.array[i * 3 + 2] = quartDiag * 1.5 - shift;
  }
}

// wings
for (let i = 0; i < mantaGeom.attributes.position.count; i++) {
  mantaGeom.attributes.position.array[i * 3] *= 1.5;
}

// tail
mantaGeom.attributes.position.array[2] *= 1.5;

var manta = new THREE.LineSegments(mantaGeom, new THREE.ShaderMaterial({
  uniforms: {
    color1: {
      value: new THREE.Color("gray")
    },
    color2: {
      value: new THREE.Color("white")
    },
    time: {
      value: 0
    },
    halfWidth: {
      value: quartDiag * 2 * 1.5
    }
  },
  vertexShader: mantaVertShader,
  fragmentShader: mantaFragShader
}));
manta.position.set(0, 20, 0);
scene.add(manta);

var mantaPoints = new THREE.Points(mantaGeom, new THREE.ShaderMaterial({
  uniforms: {
    color1: {
      value: new THREE.Color("gray")
    },
    color2: {
      value: new THREE.Color("white")
    },
    time: {
      value: 0
    },
    size: {
      value: 1
    },
    halfWidth: {
      value: quartDiag * 2 * 1.5
    }
  },
  vertexShader: mantaVertShader,
  fragmentShader: mantaFragShader
}))
mantaPoints.position.copy(manta.position);
scene.add(mantaPoints);


var clock = new THREE.Clock();
var t = 0;
var delta = 0;
render();

function render() {

  requestAnimationFrame(render);
  delta = clock.getDelta();
  t += delta;

  seaDown.material.uniforms.time.value = t;
  seaDownPoints.material.uniforms.time.value = t;
  seaSurface.material.uniforms.time.value = t * .75;
  seaSurfacePoints.material.uniforms.time.value = t * .75;
  seaweeds.forEach(sw => {
    sw.material.uniforms.time.value = t
  });
  manta.material.uniforms.time.value = t;
  mantaPoints.material.uniforms.time.value = t;

  scene.rotation.y += delta * 0.05;

  renderer.render(scene, camera);

}
