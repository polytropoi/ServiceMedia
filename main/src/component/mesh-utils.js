// can't really import if there are threejs dependencies, bc aframe embeds it ("superthree")... 
// so these need to be called from global, in /examples/js instead of /jsm

import {MeshSurfaceSampler} from '/three/examples/jsm/math/MeshSurfaceSampler.js'; //can because "type=module" //no. 
import { Flow } from '/three/examples/jsm/modifiers/CurveModifier.js'; 
// import { Line2 } from '/three/examples/jsm/lines/Line2.js'; //hrm..
// import { LineMaterial } from '/three/examples/jsm/lines/LineMaterial.js';
// import { LineGeometry } from '/three/examples/jsm/lines/LineGeometry.js';
// import * as GeometryUtils from '/three/examples/jsm/utils/GeometryUtils.js';

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/* global AFRAME, THREE */

AFRAME.registerComponent('equipped_object_control', { //for fixed cam or vr, not center cursor // nope
  schema: {
    init: {default: false},
    range: {default: 20}
  },
  init: function () {
  
  this.equipPlaceholder = document.getElementById("equipPlaceholder");
  this.mod_object_component = this.el.components.mod_object;
  this.startPoint = new THREE.Vector3();
  this.tempVector = new THREE.Vector3();
  this.endMesh = new THREE.Mesh(new THREE.SphereBufferGeometry(0.25, 16, 8), new THREE.MeshBasicMaterial({color: "blue", wireframe: true}));
  if (this.mod_object_component) {
    // if (this.mod_object.isEquipped) {
      console.log("equipped object control is on!" );
    // }   
    const { left, top, width, height } = this.el.sceneEl.getBoundingClientRect();



    // var aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 100;
    const aspect = width / height;
    // this.camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 100 );

    // camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 0.1, 100 );
    // this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 100 );
        this.lookVector = new THREE.Vector3();
        this.vec = new THREE.Vector3(); // create once and reuse
        this.pos = new THREE.Vector3(); // create once and reuse
        this.camera = this.el.sceneEl.camera;
        this.cursorEl = document.createElement("a-entity");
        this.el.sceneEl.appendChild(this.cursorEl);
        // this.camera.position.x = this.perspectiveCamera.position.x;
        // this.camera.position.y = this.perspectiveCamera.position.y;
        // this.camera.position.z = this.perspectiveCamera.position.z;
          // this.camera.position.x = 0;
          // this.camera.position.y = -30;
          // this.camera.position.z = 0;
    // vec.set(
    //     ( event.clientX / window.innerWidth ) * 2 - 1,
    //     - ( event.clientY / window.innerHeight ) * 2 + 1,
    //     0.5 );

    // vec.unproject( camera );

    // vec.sub( camera.position ).normalize();

    // var distance = - camera.position.z / vec.z;

    // pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );

    // this.thirdPersonPlaceholderPosition = new THREE.Vector3();
    // this.thirdPersonPlaceholderDirection = new THREE.Vector3();
    // this.thirdPersonPlaceholder.object3D.getWorldPosition(this.thirdPersonPlaceholderPosition);  //actually it's id "playCaster"
    // this.thirdPersonPlaceholder.object3D.getWorldDirection(this.thirdPersonPlaceholderDirection);
    // this.thirdPersonPlaceholderDirection.normalize();
    // this.thirdPersonPlaceholderDirection.negate();
    // // console.log("setting thirrd person raycaster! from " + JSON.stringify(this.thirdPersonPlaceholderPosition) + " to " + JSON.stringify(this.thirdPersonPlaceholderDirection));
    // this.raycaster.set(this.thirdPersonPlaceholderPosition, this.thirdPersonPlaceholderDirection);
    // this.raycaster.far = 50;
    // // raycaster.far = 1.5;
   
    // this.intersection = this.raycaster.intersectObject( this.iMesh );

    // if (this.arrow) { //show helper arrow, TODO toggle from dialogs.js
    //   this.el.sceneEl.object3D.remove(this.arrow);
    // }

    // if (this.intersection != null && this.intersection.length > 0 ) {
    //   // this.arrowColor = "green"; //0xff0000 = "green";
    //   this.arrow = new THREE.ArrowHelper( this.raycaster.ray.direction, this.raycaster.ray.origin, 25, 0x0b386 );
    // } else {
    //   this.arrow = new THREE.ArrowHelper( this.raycaster.ray.direction, this.raycaster.ray.origin, 25, 0xff0000 );
    // }
    const cgeometry = new THREE.BoxGeometry( 1, 1, 1 );
    const cmaterial = new THREE.MeshPhongMaterial( { color: 0x99ffff, wireframe: false } );
    this.worldCursor = new THREE.Mesh( cgeometry, cmaterial );
    // this.world
    this.el.sceneEl.object3D.add(this.worldCursor);
    // this.el.sceneEl.object3D.add(this.camera);
    // this.el.sceneEl.object3D.add( this.arrow );
    this.mouseP = {};

    let tG = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      new THREE.Vector3()
    ]);
    let tM = new THREE.LineBasicMaterial({color: "yellow"});
    this.beam = new THREE.Line(tG, tM);
    this.el.sceneEl.object3D.add(this.beam);
    this.el.sceneEl.object3D.add(this.endMesh);

    document.addEventListener('mousemove_nm', (e) => {  


      e.preventDefault();


      // this.splineMesh.geometry.attributes.position.needsUpdate = true;
      

    

      // for (let i = 0; i < this.splineVerts.length; i += 3) {


      //   this.splineVerts[i] = this.splineVerts_o[i] + (( Math.random() - 0.5 ) / 4) - this.splineVerts[i];
      //   // this.splineVerts[i + 1] += ( Math.random() - 0.5 ) / 2;
      //   this.splineVerts[i + 1] = this.splineVerts_o[i + 1] + (( Math.random() - 0.5 ) / 4) - this.splineVerts[i + 1];
      //   // this.splineVerts[i + 2] += ( Math.random() - 0.5 ) * 3;

      // }
      // this.splineMesh.geometry.attributes.position.needsUpdate = true;
      // console.log("mousemove ev ent");
      // let mouse = new THREE.Vector2();
      // let camera = AFRAME.scenes[0].camera;
      // let rect = document.querySelector('body').getBoundingClientRect();
      // mouse.x = ( (e.clientX - rect.left) / rect.width ) * 2 - 1;
      // mouse.y = - ( (e.clientY - rect.top) / rect.height ) * 2 + 1;
      // let vector = new THREE.Vector3( mouse.x, mouse.y, -1 ).unproject( camera );
      if (this.camera) {


      // this.camera.getWorldDirection( this.lookVector ); //ha does nothing if child
      // this.el.object3D.lookAt(this.lookVector);

      // console.log("tryna pushForward@! " + this.data.forceFactor);
      // const velocity = new Ammo.btVector3(2, 1, 0);

      //   this.camera = this.el.sceneEl.camera;
      // } else {
        // const {
        //   clientX,
        //   clientY
        // } = e
        // console.log(JSON.stringify(mouseP));
        const { left, top, width, height } = this.el.sceneEl.getBoundingClientRect();

            // this.vec.set(
            //     ((e.clientX - left) / width) * 2 - 1,
            //     -((e.clientY - top) / height) * 2 + 1,
            //     1
            //     // (this.camera.near + this.camera.far) / (this.camera.near - this.camera.far)
            //   );
          // this.vec.set(( e.clientX / window.innerWidth ) * 2 - 1, -(( e.clientY / window.innerHeight ) * 2 + 1), .5);
          this.mouseP.x = ( e.clientX / width ) * 2 - 1;
          this.mouseP.y = - ( e.clientY / height ) * 2 + 1;
          // this.vec.set(this.mouseP.x, this.mouseP.y, this.camera.position.near);
          this.vec.set( this.mouseP.x, this.mouseP.y, ( this.camera.near + this.camera.far ) / ( this.camera.near - this.camera.far ) );
         
          // this.vec.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1,0);
          // this.vec.set(e.clientX, e.clientY, 1);
          // this.camera.updateProjectionMatrix();
        
          this.vec.unproject( this.camera );

          this.vec.sub( this.camera.position ).normalize();

          this.distance = this.camera.position.z / this.vec.z;
          // this.distance = ( targetZ - camera.position.z ) / vec.z;
          // vec.sub( camera.position ).normalize();
          // console.log("distance: " + this.distance + "ws vec: " + JSON.stringify(this.vec));
            if (this.worldCursor) {
              // this.worldCursor.position.copy( this.camera.position ).add( this.vec.multiplyScalar( 8 ) );

              // mouseMesh.position.copy(pos);
              // var distance = ( targetZ - camera.position.z ) / vec.z;
              // var distance = - this.camera.position.z / this.vec.z;
              this.worldCursor.updateMatrixWorld();

              this.pos = this.camera.position.clone().add( this.vec.multiplyScalar( 20 ) );
              // console.log("pos " + JSON.stringify(this.pos));
              this.worldCursor.position.copy(this.pos);
              // this.worldCursor.position.copy(this.vec.multiplyScalar( 5 ));
              // console.log(JSON.stringify(this.worldCursor.position));
            }
        } else {
          this.camera = this.el.sceneEl.camera;
        }
    });
  }

  },
  showBeam: function (hitpoint) {
    console.log("tryna show beam");
    // const MAX_POINTS = 500;
    // // geometry
    // const geometry = new THREE.BufferGeometry();

    // // attributes
    // const positions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
    // geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

    // // draw range
    // const drawCount = 2; // draw the first 2 points, only
    // geometry.setDrawRange( 0, drawCount );

    // // material
    // const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

    // // line
    // const line = new THREE.Line( geometry, material );
    // // scene.add( line );

    // positions = line.geometry.attributes.position.array;

    // let x, y, z, index;
    // x = y = z = index = 0;

    // for ( let i = 0, l = MAX_POINTS; i < l; i ++ ) {

    //     positions[ index ++ ] = x;
    //     positions[ index ++ ] = y;
    //     positions[ index ++ ] = z;

    //     x += ( Math.random() - 0.5 ) * 30;
    //     y += ( Math.random() - 0.5 ) * 30;
    //     z += ( Math.random() - 0.5 ) * 30;

    // }
    // line.geometry.attributes.position.needsUpdate = true;
    

    if (this.equipPlaceholder) {

       // temp vector for re-use
      // this.startMesh = new THREE.Mesh(new THREE.SphereBufferGeometry(0.25, 16, 8), new THREE.MeshBasicMaterial({color: "red", wireframe: true}));
   
      // scene.add(observer, target);
      this.beam.updateMatrixWorld();
      this.endMesh.position = hitpoint.clone();
      this.equipPlaceholder.object3D.getWorldPosition(this.startPoint);
      // this.endPoint = hitpoint;

        this.distance = this.startPoint.distanceTo(hitpoint);
        this.tempVector.subVectors(hitpoint, this.startPoint).normalize().negate().multiplyScalar(this.distance).add(this.startPoint);
        console.log("tryna make a beam from " + JSON.stringify(hitpoint) +" distance " + this.distance);
        // let d = oP.distanceTo(tP);
      
      // tV.subVectors(tP, oP).normalize().multiplyScalar(d + 10).add(oP);
      // this.endMesh.position.copy(this.endPoint)
      this.beam.geometry.attributes.position.setXYZ(0, this.startPoint.x, this.startPoint.y, this.startPoint.z);
      // this.beam.geometry.attributes.position.setXYZ(1, this.tempVector.x, this.tempVector.y, this.tempVector.z);
      this.beam.geometry.attributes.position.setXYZ(1, hitpoint.x, hitpoint.y, hitpoint.z);
      this.beam.geometry.attributes.position.needsUpdate = true;
      // this.el.object3D.lookAt(hitpoint);
    } else {
      console.log("caint find no placeholderrz");
    }
  },
  tick: function () {
    
  }
});

AFRAME.registerComponent('targeting_raycaster', { //add to models if needed //NOPE

  init: function () {
    this.doTheThing = false;
    this.raycaster = null;
    this.intersection = null;
    this.hitpoint = new THREE.Vector3();
    this.currentLocation = new THREE.Vector3();
    console.log("TRYAN PUTA RAYCASTERR");
    // this.el.classList.add('activeObjexRay');
    this.mod_model_component = this.el.components.mod_model;
    if (this.mod_model_component) {
      console.log("TRYAN PUTA RAYCASTERR on MOD_MODEKL with tags" + this.mod_model_component.data.tags + " eventdata " + this.mod_model_component.data.eventData );
    }
    this.el.addEventListener('raycaster-intersected', (e) =>{  

      // if (this.el.object3D) {
      this.raycaster = e.detail.el;
      this.intersection = this.raycaster.components.raycaster.getIntersection(this.el);
      // this.hitpoint = this.intersection.point;

      if ( this.intersection && this.intersection.object.name) {

          // this.hitpoint.x = this.intersection.point.x.toFixed(2);
          // this.hitpoint.y = this.intersection.point.y.toFixed(2);
          // this.hitpoint.z = this.intersection.point.z.toFixed(2);

            // this.distance = this.raycaster.components.raycaster.ray.origin.distanceTo( this.hitpoint );
            // this.hitpoint = this.intersection[0].point;

          // this.el.object3D.getWorldPosition(this.hitpoint);
          this.hitpoint = this.intersection.point.clone();
          this.hitpoint.x = this.hitpoint.x.toFixed(2);
          this.hitpoint.y = this.hitpoint.y.toFixed(2);
          this.hitpoint.z = this.hitpoint.z.toFixed(2);
          console.log('ray hit at' + JSON.stringify(this.hitpoint));
          this.rayhit(this.hitpoint); 

        }
      // }

    });
    this.el.addEventListener("raycaster-intersected-cleared", () => {
      this.raycaster = null;
      this.intersection = null;
    });

  },
  
  rayhit: function (hitpoint) {
   
      this.intersection = null;
      // this.raycaster = null;
      
      // this.hitID = hitID;
      // console.log("new hit " + hitID + " " + distance + " " + JSON.stringify(hitpoint) + " interaction:" + this.data.interaction);
        // var triggerAudioController = document.getElementById("triggerAudio");
        // if (triggerAudioController != null) {
        //   triggerAudioController.components.trigger_audio_control.playAudioAtPosition(hitpoint, distance, this.data.tags);
        // }
      this.equipControl = document.querySelector(".equipped");
      if (this.equipControl && this.equipControl.components) {
        this.equipControl.components.equipped_object_control.showBeam(hitpoint);
      }


    
  },
  tick: function () {
    if ( this.intersection != null && this.intersection.length > 0) {
      console.log("gotsaz intersection!" + this.intersection[0].instanceId);
      // if (window.playerPosition != null && window.playerPosition != undefined && this.intersection[0].point != undefined && this.intersection[0].point != null ) {
      if (this.intersection[0].point != undefined && this.intersection[0].point != null ) {
        if (this.instanceId != this.intersection[0].instanceId) {
          this.instanceId = this.intersection[ 0 ].instanceId;
          
          console.log(this.data.tags + " " + this.instanceId);

          // this.iMesh.setColorAt( this.instanceId, this.highlightColor.setHex( Math.random() * 0xffffff ) );
          // this.iMesh.instanceColor.needsUpdate = true;
          // console.log('windowplayerposition ' + JSON.stringify(window.playerPosition));
          // if (this.data.tags != undefined && window.playerPosition != undefined && window.playerPosition) {
          if (this.data.tags != undefined && this.data.tags.length) {  
            // this.distance = window.playerPosition.distanceTo(this.intersection[0].point);
            this.distance = this.raycaster.ray.origin.distanceTo( this.intersection[0].point );
            this.hitpoint = this.intersection[0].point;
            this.rayhit(this.instanceId, this.distance, this.hitpoint); 
          }

        }
      }

    } else {
      this.hitID = null;
      this.instanceId = null;
    }
   
  }
});


AFRAME.registerComponent('instanced_meshes_sphere', { //scattered randomly in sphere, not on surface
  schema: {

    _id: {default: ''},
    modelID: {default: ''},
    count: {default: 100},
    scaleFactor: {default: 10},
    interaction: {default: ''},
    tags: {default: ''},
    triggerTag: {default: null}
  },
  init: function () {
    console.log("tryna instanced_meshes_sphere");
    this.tick = AFRAME.utils.throttleTick(this.tick, 50, this);
      var el = this.el;
      var root = this.el.object3D;
      var loader = new THREE.GLTFLoader();
      var mtx = new THREE.Matrix4();
    console.log("THIS DATA SCATTER " + this.data._id + " " + this.data.modelID);

      this.triggerAudioController = document.querySelector("#triggerAudio");

  this.hitID = 0;
      // var amount = 100;
  this.instanceId = null;
  this.distance = null;
  // this.hitpoint = null;
  this.raycaster = null;
  this.intersection = null;
  this.hitpoint = null;
  var count = this.data.count;
  var dummy = new THREE.Object3D();
  this.dummy = dummy;
  this.dummyScale = 1;
  this.dummyQuat = new THREE.Quaternion();
  this.timeDelta = 0;
  this.time = 0;;
  this.dummyMatrix = new THREE.Matrix4();
  this.dummyposition = new THREE.Vector3();
  this.material = null;
  this.iMesh = null;
  this.speed = .001; //for rotation
  // this.mouse = new THREE.Vector2(.5,.5);
  const data = this.data;
  this.highlightColor = new THREE.Color();
  this.camera = document.querySelector("[camera]").getObject3D('camera');
  // let gltfs = document.getElementsByClassName('gltfAssets');

  this.thirdPersonPlaceholder = document.getElementById("playCaster"); 
  this.useMatrix = false;
  this.matrixMeshComponent = null;
  if (settings.useMatrix) {
    this.useMatrix = true;
  }
  this.el.setAttribute('gltf-model', '#'+ this.data.modelID);
  console.log("model this.data._id " + this.data._id);
  const scatterModel = document.getElementById(this.data._id);
  if (scatterModel != null) {
    scatterModel.addEventListener('model-loaded', (event) => {
    const sObj = scatterModel.getObject3D('mesh');
    console.log("tryna INSTANCE THE THIGNS");
  
    sObj.traverse(node => {
      if (node.isMesh && node.material) {
          this.sampleGeometry = node.geometry;
          this.sampleMaterial = node.material;
        }
      });
    });
  }

  this.particlesEl = null;

  if (this.data.tags && this.data.tags.toLowerCase().includes("bang")) {
    this.particlesEl = document.createElement("a-entity");
    // this.particlesEl.setAttribute("mod_particles", {"enabled": false});
    this.el.sceneEl.appendChild(this.particlesEl); //hrm...
  }
  this.playerPosition = new THREE.Vector3();
  this.el.addEventListener('model-loaded', () => {
    this.obj = this.el.getObject3D('mesh');
    console.log("tryna INSTANCE THE THIGNS");
    this.raycaster = new THREE.Raycaster();
    this.material = null;
    this.obj.traverse(node => {
        // if (node.geometry && node.material) {
        if (node.isMesh && node.material) {
            this.geometry = node.geometry;
            this.material = node.material;
        }
    })
    const color = new THREE.Color();
    this.texture = null;
    this.textureArray = [];    
    for (let i = 1; i < 7; i++) {
      this.envmapEl = document.querySelector("#envmap_" + i);
      if (this.envmapEl) {
      this.path = this.envmapEl.getAttribute("src");
      this.textureArray.push(this.path);
      }
    }
    if (this.textureArray.length == 6) {
      this.texture = new THREE.CubeTextureLoader().load(this.textureArray);
      this.texture.format = THREE[data.format];
      this.material.envMap = this.texture;  
      this.material.envMapIntensity = .5;      
      this.material.roughness = .15;
      this.material.needsUpdate = true;
    }


      this.iMesh = new THREE.InstancedMesh(this.geometry, this.material, count);
      
      let position = new THREE.Vector3()
      let quat = new THREE.Quaternion();
      let scale = new THREE.Vector3();

      let euler = new THREE.Euler(Math.PI, 0, 0, "ZYX");
      let radius = this.data.scaleFactor * 10 + (count/2);
      this.clock = new THREE.Clock();  //wha
        
      for (var i=0; i<count; i++) {
      //   box = new THREE.Mesh(boxGeo, greyPhongMat);
        // let x = Math.random() * 300 - 150;
        // let y = Math.random() * 300 - 150;
        // let z = Math.random() * 300 - 150;
        let x = Math.random() * radius - (radius/2);
        let y = Math.random() * radius - (radius/2);
        let z = Math.random() * radius - (radius/2);
        let scale = Math.random() * this.data.scaleFactor;
        dummy.position.set( x, y, z );
        dummy.scale.set(scale,scale,scale);
        dummy.rotation.x = (Math.random() * 360 ) * Math.PI / 180;
        dummy.rotation.y = (Math.random() * 360 ) * Math.PI / 180;
        dummy.rotation.z = (Math.random() * 360 ) * Math.PI / 180;
        // dummy.castShadow = true;
        dummy.updateMatrix();
        // this.iMesh.setColorAt( i, color.setHex( 0xffffff * Math.random() ) );
        this.iMesh.setColorAt( i, color.setHex( 0xffffff ) );
        this.iMesh.setMatrixAt( i ++, dummy.matrix );

      }

      this.iMesh.frustumCulled = false;
      this.iMesh.instanceMatrix.needsUpdate = true;
      
      root.add(this.iMesh);
      
  });
      this.el.classList.add('activeObjexRay');
      // let thiz = this;

      let that = this;

      window.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.instanceId) {
          console.log("clicked on instance "+ this.instanceId);
          this.instance_clicked(this.instanceId); 
        }
      }); 
    

    },
    tick: function(time, timeDelta) {
      // this.timeDelta = timeDelta;
      this.time = time;
      if (this.iMesh != null) {
        if (!this.raycaster || this.raycaster == null || this.raycaster == undefined) {
            return;
        } else {
          if (settings && settings.sceneCameraMode == "Third Person") {
            this.thirdPersonPlaceholderPosition = new THREE.Vector3();
            this.thirdPersonPlaceholderDirection = new THREE.Vector3();
            this.thirdPersonPlaceholder.object3D.getWorldPosition(this.thirdPersonPlaceholderPosition);  //actually it's id "playCaster"
            this.thirdPersonPlaceholder.object3D.getWorldDirection(this.thirdPersonPlaceholderDirection);
            this.thirdPersonPlaceholderDirection.normalize();
            this.thirdPersonPlaceholderDirection.negate();
            // console.log("setting thirrd person raycaster! from " + JSON.stringify(this.thirdPersonPlaceholderPosition) + " to " + JSON.stringify(this.thirdPersonPlaceholderDirection));
            this.raycaster.set(this.thirdPersonPlaceholderPosition, this.thirdPersonPlaceholderDirection);
            this.raycaster.far = 50;
            // raycaster.far = 1.5;
           
            this.intersection = this.raycaster.intersectObject( this.iMesh );
 
            if (this.arrow) { //show helper arrow, TODO toggle from dialogs.js
              this.el.sceneEl.object3D.remove(this.arrow);
            }

            if (this.intersection != null && this.intersection.length > 0 ) {
              // this.arrowColor = "green"; //0xff0000 = "green";
              this.arrow = new THREE.ArrowHelper( this.raycaster.ray.direction, this.raycaster.ray.origin, 25, 0x0b386 );
            } else {
              this.arrow = new THREE.ArrowHelper( this.raycaster.ray.direction, this.raycaster.ray.origin, 25, 0xff0000 );
            }
            this.el.sceneEl.object3D.add( this.arrow );
          } else {
            this.raycaster.setFromCamera( mouse, AFRAME.scenes[0].camera );
            this.intersection = this.raycaster.intersectObject( this.iMesh );
          }
        }
        if ( this.intersection != null && this.intersection.length > 0 ) {
          // if (window.playerPosition != null && window.playerPosition != undefined && this.intersection[0].point != undefined && this.intersection[0].point != null ) {
          if (this.intersection[0].point != undefined && this.intersection[0].point != null ) {
              this.instanceId = this.intersection[ 0 ].instanceId;
              console.log(this.instanceId);
              this.iMesh.setColorAt( this.instanceId, this.highlightColor.setHex( Math.random() * 0xffffff ) );
              this.iMesh.instanceColor.needsUpdate = true;
              // console.log('windowplayerposition ' + JSON.stringify(window.playerPosition));
              // this.distance = window.playerPosition.distanceTo(this.intersection[0].point);
              this.distance = this.raycaster.ray.origin.distanceTo( this.intersection[0].point );
              this.hitpoint = this.intersection[0].point;
              this.rayhit(this.instanceId, this.distance, this.hitpoint); 
              this.arrowColor = '0xff0000';
          }
        } else {
          this.hitID = null;
          this.instanceId = null;
        }

        this.iMesh.rotation.x -= this.speed * .75;
        this.iMesh.rotation.y -= this.speed;
        this.iMesh.rotation.z -= this.speed * 1.5;
        // this.iMesh.

        // if (this.arrow) { //show helper arrow, TODO toggle from dialogs.js
        //   this.el.sceneEl.object3D.remove(this.arrow);
        // }
        // this.arrow = new THREE.ArrowHelper( this.raycaster.ray.direction, this.raycaster.ray.origin, 50, 0xff0000 );
        // this.el.sceneEl.object3D.add( this.arrow );

      }
    },
    rayhit: function (hitID, distance, hitpoint) {
      console.log(hitID + " beez hit!");
      if (this.hitID != hitID) {
        
        this.intersection = null;
        // this.raycaster = null;
        
        this.hitID = hitID;
        console.log("new hit " + hitID + " " + distance + " " + JSON.stringify(hitpoint) + " interaction:" + this.data.interaction);
        var triggerAudioController = document.getElementById("triggerAudio");
        if (triggerAudioController != null) {
          triggerAudioController.components.trigger_audio_control.playAudioAtPosition(hitpoint, distance, this.data.tags);
        }

      }
      if (this.matrixMeshComponent != null) {
        this.matrixMeshComponent.showRoomData(this.instanceId, distance, hitpoint);
      }

      if (this.data.interaction == "growpop") {
        this.iMesh.getMatrixAt(hitID, this.dummyMatrix);
        this.dummyMatrix.decompose(this.dummy.position, this.dummy.quaternion, this.dummy.scale);
        console.log(parseFloat(this.dummy.scale.x) + " vs " + (parseFloat(this.data.scaleFactor) * 3));
        if (parseFloat(this.dummy.scale.x) > (parseFloat(this.data.scaleFactor) * 1.5)) {
          console.log("tryna lcik!");
          if (this.data.tags && this.data.tags.toLowerCase().includes("kill")) {
            this.particlesEl.setAttribute("position", hitpoint);
            this.removeInstance(hitID);
          }
          this.instance_clicked(hitID);
          this.dummy.scale.set( 0, 0, 0 );
          // this.data.interaction = null;
          this.dummy.updateMatrix();
          this.iMesh.setMatrixAt( this.hitID, this.dummy.matrix );
          this.iMesh.frustumCulled = false;
          this.iMesh.instanceMatrix.needsUpdate = true;
        } else {
          this.scaletmp = this.dummy.scale.x + Math.abs(Math.sin(this.time) / 4);
          this.dummy.scale.set( this.scaletmp, this.scaletmp, this.scaletmp );
          this.dummy.updateMatrix();
          this.iMesh.setMatrixAt( this.hitID, this.dummy.matrix );
          this.iMesh.frustumCulled = false;
          this.iMesh.instanceMatrix.needsUpdate = true;
        }
      }
      if (this.data.interaction == "shrinkpop") {
        this.iMesh.getMatrixAt(hitID, this.dummyMatrix);
        this.dummyMatrix.decompose(this.dummy.position, this.dummy.quaternion, this.dummy.scale);
        console.log(parseFloat(this.dummy.scale.x) + " vs " + (parseFloat(this.data.scaleFactor) / 2));
      if (parseFloat(this.dummy.scale.x) < (parseFloat(this.data.scaleFactor) / 4)) {
        console.log("tryna lcik! ttags " + this.data.tags );
          this.instance_clicked(hitID);
          if (this.data.tags && this.data.tags.toLowerCase().includes("kill")) {
            this.particlesEl.setAttribute("position", hitpoint);
            this.removeInstance(hitID);
          }
          this.dummy.scale.set( 0, 0, 0 );
          // this.data.interaction = null;
          this.dummy.updateMatrix();
          this.iMesh.setMatrixAt( this.hitID, this.dummy.matrix );
          this.iMesh.frustumCulled = false;
          this.iMesh.instanceMatrix.needsUpdate = true;
        } else {
          this.scaletmp = this.dummy.scale.x - Math.abs(Math.sin(this.time) / 2);
          this.dummy.scale.set( this.scaletmp, this.scaletmp, this.scaletmp );
          this.dummy.updateMatrix();
          this.iMesh.setMatrixAt( this.hitID, this.dummy.matrix );
          this.iMesh.frustumCulled = false;
          this.iMesh.instanceMatrix.needsUpdate = true;
        }
      }
      
    },
    removeInstance: function (instanceID) {
      console.log("tryna remove instance");
      if (this.particlesEl) {
        this.particlesEl.setAttribute('sprite-particles', {
          enable: true, 
          duration: '1', 
          texture: '#explosion1', 
          color: 'black..white', 
          blending: 'additive', 
          textureFrame: '8 8', 
          textureLoop: '1', 
          spawnRate: '1', 
          lifeTime: '1', 
          opacity: '0,1,0', 
          rotation: '0..360', 
          scale: '100,500'
        });
      this.particlesEl.setAttribute('sprite-particles', {"duration": .1});
      }
    },
    instance_clicked: function (id) {
      if (id != null && this.intersection != null) {
      // this.dummy.scale.set( .9, .9, .9 );
      // this.dummy.updateMatrix();
      console.log(id + " beez clicked!");
      // this.iMesh.setMatrixAt( id, this.dummy.matrix );
      // this.iMesh.frustumCulled = false;
      // this.iMesh.instanceMatrix.needsUpdate = true;
      var triggerAudioController = document.getElementById("triggerAudio");
        if (triggerAudioController != null) {
          triggerAudioController.components.trigger_audio_control.playAudioAtPosition(this.hitpoint, this.distance, this.data.tags);
          }
        // this.iMesh.position.set(id, 0, 0, -100);
        if (this.useMatrix) {
          let matrixMeshEl = document.getElementById("matrix_meshes");
          if (matrixMeshEl != null) {
            this.matrixMeshComponent = matrixMeshEl.components.matrix_meshes;
            if (this.matrixMeshComponent != null && this.intersection != null) {
            this.matrixMeshComponent.selectRoomData(this.instanceId);
            }
          }
          }
      }
    }
});

////////////////////////////////////////////////////// main instanced mesh(es) method for surface(s) //////////////////////////
AFRAME.registerComponent('instanced_surface_meshes', {
  schema: {
    _id: {default: ''},
    modelID: {default: ''},
    objectID: {default: ''},
    count: {default: 2000},
    scaleFactor: {default: 4},
    yMod: {default: 0},
    // yWater: {default: 0},
    eventData: {default: ''},
    interaction: {default: ''},
    tags: {default: ''}
  },
  init: function () {
    this.scatterFinished = false;
     let clickCount = 0;
      this.surfaceMesh = null;
      this.scatterModel = null;
      this.sampleGeometry = null;
      this.sampleMaterial = null;
      this.sampleGeos = [];
      this.sampleMats = [];
      this.lastClickedID = 0;
      this.raycaster = new THREE.Raycaster();

      this.iMesh = null;
      this.iMesh_1 = null;
      this.iMesh_2 = null;
      this.iMesh_3 = null;
      this.iMesh_4 = null;

      console.log("model this.data._id " + this.data._id + " tryna instance " + this.data.count);

      this.el.addEventListener('model-loaded', (event) => {
        event.preventDefault();;
        const sObj = this.el.getObject3D('mesh');
        console.log("tryna INSTANCE THE THIGNS");
        this.sampleGeos = [];
        this.sampleMats = [];
        sObj.traverse(node => {
        if (node.isMesh && node.material) {
            this.sampleGeometry = node.geometry;
            this.sampleGeos.push(this.sampleGeometry);
            this.sampleMaterial = node.material;
            this.sampleMats.push(this.sampleMaterial);
            
            }
          });
        if (!this.scatterFinished) {
          this.surfaceLoaded(); //surface should be ready, if not it will reload samplegeos below
        }
      });
    let that = this; //hrrmm..
    // let surfaceEl = document.getElementById('scatterSurface');   
    // surfaceEl.addEventListener('surfaceLoaded', () => { //no, now scatter-surface calls surfaceLoaded below when surface is ready
    //   console.log("SURFACE EVENT LOADEDD");
  
    //   this.surface(this.sampleGeos, this.sampleMats);
    // });

    this.thirdPersonPlaceholder = document.getElementById("playCaster"); //hrm, should rename
    this.useMatrix = false;
    this.matrixMeshComponent = null;
    if (settings != null && settings.useMatrix) {
      this.useMatrix = true;
    }

    this.particlesEl = null;
    // this.particlesComponent = null;
    if (this.data.tags && this.data.tags.toLowerCase().includes("bang")) {
      this.particlesEl = document.createElement("a-entity");
      // this.particlesEl.setAttribute("mod_particles", {"enabled": false});
      this.el.sceneEl.appendChild(this.particlesEl); //hrm...
    }
/*  this way doesn't work with instanced meshes fsr...  
    this.el.addEventListener('raycaster-intersected', (e) => {  

        this.raycaster = e.detail.el;
      
        this.intersection = this.raycaster.components.raycaster.getIntersection(this.el, true);
        this.hitpoint = this.intersection.point;
        
        console.log('ray hit', this.intersection.object.name);

            // thiz.mouseOverObject = this.intersection.object.name;      
            // this.hitpoint = intersection.point;   
            // console.log('ray hit', thiz.mouseOverObject );
        });
    
    this.el.addEventListener("raycaster-intersected-cleared", (e) => {
        console.log("intersection cleared");
        // thiz.mouseOverObject = null;
        this.raycaster = null;
    });
*/
    window.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.instanceId) {
        console.log("clicked on instance "+ this.instanceId);
        this.instance_clicked(this.instanceId); 
      }
    }); 
  },
  // loadScatterModel: function () { //unused now...
  //   if (!this.sampleGeos.length) {
  //     // console.log("tryna get scatter model id" + this.data._id);
  //     // const scatterModel = document.getElementById(this.data._id);
  //     // if (scatterModel != null) {

  //     // this.el.addEventListener('model-loaded', (event) => {
  //     //     event.preventDefault();;
  //       const sObj = this.el.getObject3D('mesh');
  //       if (sObj) {
  //       console.log("tryna INSTANCE THE THIGNS");
  //       this.sampleGeos = [];
  //       this.sampleMats = [];
  //       sObj.traverse(node => {
  //         if (node.isMesh && node.material) {
  //             this.sampleGeometry = node.geometry;
  //             this.sampleGeos.push(this.sampleGeometry);
  //             this.sampleMaterial = node.material;
  //             this.sampleMats.push(this.sampleMaterial);
              
  //             }
  //           // });

  //         });
  //         this.surfaceLoaded();
  //       }

  //     } else {
  //       this.surfaceLoaded();
  //     }
  //   // }
  //   // } else {
  //   //   this.surfaceLoaded();
  //   // }
  // },
  surfaceLoaded: function () {
    console.log("instanced_surface_meshes.surfaceLoaded call");
        if (!this.surfaceMesh) {
          this.surfaces = document.getElementsByClassName("surface");
          console.log("surfaces found " + this.surfaces.length);
          if (this.surfaces.length > 0) {
            this.surface = this.surfaces[0];
            if (this.surface.getObject3D('mesh') != null) {
              this.surface.getObject3D('mesh').traverse(node => {
                if (node.isMesh) {
                  this.surfaceMesh = node;    
                  if (this.sampleGeos.length) {
                    console.log("gots samplegeos");
                    this.scatterMeshes();
    
                  } else {
                    console.log("no samplegeos");
                  }
                }
              });
            }
          } 
        } else {
          if (!this.sampleGeos.length) {
          console.log("tryna reload samplegeos");

          const sObj = this.el.getObject3D('mesh');
          if (sObj) {
          console.log("tryna INSTANCE THE THIGNS");
          this.sampleGeos = [];
          this.sampleMats = [];
          sObj.traverse(node => {
            if (node.isMesh && node.material) {
                this.sampleGeometry = node.geometry;
                this.sampleGeos.push(this.sampleGeometry);
                this.sampleMaterial = node.material;
                this.sampleMats.push(this.sampleMaterial);
                
                }
              // });
            });
            if (this.sampleGeos.length) {
              this.scatterMeshes();
            }
          }
        }  else {
          console.log("gots samplegeos")
          this.scatterMeshes();
        }
      }
  },

  // setSurface: function() { //unused now...
   
  //     if (this.surface) {
  //       // this.surface = this.surfaces[0];
    
  //       if (this.surface.getObject3D('mesh') != null) {
  //         this.surface.getObject3D('mesh').traverse(node => {
  //           if (node.isMesh) {
  //             this.surfaceMesh = node;    
  //             if (this.sampleGeos.length) {
  //               console.log("gots samplegeos");
  //               this.scatterMeshes();

  //             } else {
  //               console.log("no samplegeos");
  //               this.loadScatterModel();
  //             }
  //           }
  //         });
  //       }
  //     } 
   
  //   },
    scatterMeshes: function () {
      if (!this.scatterFinished && this.surfaceMesh && this.sampleGeos.length) {
        this.scatterFinished = true;
        
        let waterLevel = -5;
        if (settings) {
          waterLevel = settings.sceneWaterLevel;
        }
        // this.surfaceMesh
      // this.surface.setAttribute("activeObjexRay");
        // console.log('surfacemesh name ' + this.surfaceMesh);
        // this.iMeshes = []; //nm
        console.log("tryna scatter!@ waterLeve " + waterLevel + " object with #meshes  "+ this.sampleGeos.length);
        var dummy = new THREE.Object3D();
        const count = this.data.count;
    
        const sampler = new MeshSurfaceSampler( this.surfaceMesh ) // noice!  
        .build();
          // for (let m = 0; m < this.sampleGeos.length; m++) {
            // console.log("tryna scatter sample geo # " + m.toString());
            // let userData = {"collide": true, "instanced": true, count: count};
            let iMesh_1 = new THREE.InstancedMesh(this.sampleGeos[0], this.sampleMats[0], count);

            let iMesh_2 = null;
            if (this.sampleGeos.length == 2) {
              iMesh_2 = new THREE.InstancedMesh(this.sampleGeos[1], this.sampleMats[1], count);
              // iMesh_1.userData = userData;
            }
            let iMesh_3 = null;
            if (this.sampleGeos.length == 3) {
              iMesh_3 = new THREE.InstancedMesh(this.sampleGeos[2], this.sampleMats[2], count);
              // iMesh_1.userData = userData;
            }
            let iMesh_4 = null;
            if (this.sampleGeos.length == 4) {
              iMesh_4 = new THREE.InstancedMesh(this.sampleGeos[3], this.sampleMats[3], count);
              // iMesh_1.userData = userData;
            }
          
            // this.iMeshes.push(iMesh);
            // if (m == this.sampleGeos.length - 1) {
              // console.log("trryna update tyhe matrix.. ")
              let position = new THREE.Vector3();
              let normal = new THREE.Vector3();
              this.count = 0;
              for (var i = 0; i < 100000; i++) {
                if (this.count < count) {
                // console.log("scattercount " + i);
                // sampler.sample( position, normal ) //wtf?
                sampler.sample( position );
                
                let scale = Math.random() * this.data.scaleFactor;
                // console.log("scale " + scale);
                if (position.y > waterLevel) { //loop through till all of them are above the 0
                  this.count++;
                  // console.log("instance pos " + JSON.stringify(position));
                  dummy.position.set(  position.x, position.y + this.data.yMod, position.z );
                  dummy.scale.set(scale,scale,scale);
                  dummy.rotation.y = (Math.random() * 360 ) * Math.PI / 180;
                  //   dummy.lookAt( _normal ); //use eventData? 
                  dummy.updateMatrix();

                  iMesh_1.setMatrixAt( i, dummy.matrix ); //got fussy in a loop, 2 is enough..
                  iMesh_1.frustumCulled = false; //too funky
                  iMesh_1.instanceMatrix.needsUpdate = true;
                  iMesh_1.userData = {"collide": true, "instanced": true, count: count};
                  sceneEl.object3D.add(iMesh_1);
                  this.iMesh = iMesh_1;
                  this.iMesh_1 = iMesh_1;
                  if (iMesh_2) {
                    iMesh_2.setMatrixAt( i, dummy.matrix );
                    iMesh_2.frustumCulled = false;
                    iMesh_2.instanceMatrix.needsUpdate = true;
                    iMesh_2.userData = {"collide": true, "instanced": true, count: count};
                    sceneEl.object3D.add(iMesh_2);
                    this.iMesh = iMesh_2;
                    this.iMesh_2 = iMesh_2;
                  }
                  if (iMesh_3) {
                    iMesh_3.setMatrixAt( i, dummy.matrix );
                    iMesh_3.frustumCulled = false;
                    iMesh_3.instanceMatrix.needsUpdate = true;
                    iMesh_3.userData = {"collide": true, "instanced": true, count: count};
                    sceneEl.object3D.add(iMesh_3);
                    // this.iMesh = iMesh_3;
                    this.iMesh_3 = iMesh_3;
                  }
                  if (iMesh_4) {
                    iMesh_4.setMatrixAt( i, dummy.matrix );
                    iMesh_4.frustumCulled = false;
                    iMesh_4.instanceMatrix.needsUpdate = true;
                    iMesh_4.userData = {"collide": true, "instanced": true, count: count};
                    sceneEl.object3D.add(iMesh_4);
                    this.iMesh_4 = iMesh_4;
                  }

                  }
              } else {
                console.log("breaking loop at " + i.toString());
                //this.iMesh = iMesh_2; //maybe https://threejs.org/docs/index.html#examples/en/utils/BufferGeometryUtils.mergeBufferGeometries?

                break;
                
              }
            }
        this.el.classList.add('activeObjexRay');
        this.initialized = true;
        // let oray = document.querySelector("[object_raycaster]");
        // if (oray) {
        //   oray.components.object_raycaster.registerObjects();
        // } else {
        //   console.log("CaintFINd no oRay");
        // }
        // function resampleParticle ( i ) {

        //   sampler.sample( _position, _normal );
        //   _normal.add( _position );
  
        //   dummy.position.copy( _position );
        //   dummy.scale.set( scales[ i ], scales[ i ], scales[ i ] );
        //   dummy.lookAt( _normal );
        //   dummy.updateMatrix();
  
        //   stemMesh.setMatrixAt( i, dummy.matrix );
        //   blossomMesh.setMatrixAt( i, dummy.matrix );
  
        // }
      } else {
        console.log(this.scatterFinished + " " + this.surfaceMesh + " " + this.sampleGeos.length);
        //this.loadScatterModel();
      }

    },
    removeInstance: function (instanceId) {
      console.log("tryna remove instnace " + instanceId);
      var dummy = new THREE.Object3D();
      dummy.scale.set(0,0,0);
      dummy.updateMatrix();
      this.iMesh_1.setMatrixAt( instanceId, dummy.matrix );
      this.iMesh_1.instanceMatrix.needsUpdate = true;
      if (this.iMesh_2) {
        this.iMesh_2.setMatrixAt( instanceId, dummy.matrix );
        this.iMesh_2.instanceMatrix.needsUpdate = true;
      }
      if (this.iMesh_3) {
        this.iMesh_3.setMatrixAt( instanceId, dummy.matrix );
        this.iMesh_3.instanceMatrix.needsUpdate = true;
      }
      if (this.iMesh_4) {
        this.iMesh_4.setMatrixAt( instanceId, dummy.matrix );
        this.iMesh_4.instanceMatrix.needsUpdate = true;
      }
      if (this.particlesEl) {
          this.particlesEl.setAttribute('sprite-particles', {
            enable: true, 
            duration: '1', 
            texture: '#explosion1', 
            color: 'black..white', 
            blending: 'additive', 
            textureFrame: '8 8', 
            textureLoop: '1', 
            spawnRate: '1', 
            lifeTime: '1', 
            opacity: '0,1,0', 
            rotation: '0..360', 
            scale: '100,500'
          });
      this.particlesEl.setAttribute('sprite-particles', {"duration": .1});
      }

    },
    tick: function(time, timeDelta) {
      // this.timeDelta = timeDelta;
      this.time = time;
      this.thirdPersonPlaceholderPosition = new THREE.Vector3();
      this.thirdPersonPlaceholderDirection = new THREE.Vector3();
      if (this.iMesh != null && this.data.tags != undefined  && this.data.tags != 'undefined') {
        // console.log(this.posRotReader );
        if (!this.raycaster || this.raycaster == null || this.raycaster == undefined || this.data.tags == undefined) {
            return;
        } else {
          if (settings.sceneCameraMode === "Third Person") {
            
            this.thirdPersonPlaceholder.object3D.getWorldPosition(this.thirdPersonPlaceholderPosition);  //actually it's id "playCaster"
            this.thirdPersonPlaceholder.object3D.getWorldDirection(this.thirdPersonPlaceholderDirection);
            this.thirdPersonPlaceholderDirection.normalize();
            this.thirdPersonPlaceholderDirection.negate();
            // console.log("setting thirrd person raycaster! from " + JSON.stringify(this.thirdPersonPlaceholderPosition) + " to " + JSON.stringify(this.thirdPersonPlaceholderDirection));
            this.raycaster.set(this.thirdPersonPlaceholderPosition, this.thirdPersonPlaceholderDirection);
            this.raycaster.far = 15;
            // raycaster.far = 1.5;
           
            this.intersection = this.raycaster.intersectObject( this.iMesh );
 
            if (this.arrow) { //show helper arrow, TODO toggle from dialogs.js
              this.el.sceneEl.object3D.remove(this.arrow);
            }
            this.arrow = new THREE.ArrowHelper( this.raycaster.ray.direction, this.raycaster.ray.origin, 10, 0xff0000 );
            this.el.sceneEl.object3D.add( this.arrow );


          } else { //first person use mouse for raycast
            this.raycaster.setFromCamera( mouse, AFRAME.scenes[0].camera ); 
            this.intersection = this.raycaster.intersectObject( this.iMesh );
          }
         
        }
    
        if ( this.intersection != null && this.intersection.length > 0) {
          console.log("gotsaz intersection!" + this.intersection[0].instanceId);
          // if (window.playerPosition != null && window.playerPosition != undefined && this.intersection[0].point != undefined && this.intersection[0].point != null ) {
          if (this.intersection[0].point != undefined && this.intersection[0].point != null ) {
            if (this.instanceId != this.intersection[0].instanceId) {
              this.instanceId = this.intersection[ 0 ].instanceId;
              
              console.log(this.data.tags + " " + this.instanceId);

              // this.iMesh.setColorAt( this.instanceId, this.highlightColor.setHex( Math.random() * 0xffffff ) );
              // this.iMesh.instanceColor.needsUpdate = true;
              // console.log('windowplayerposition ' + JSON.stringify(window.playerPosition));
              // if (this.data.tags != undefined && window.playerPosition != undefined && window.playerPosition) {
              if (this.data.tags != undefined && this.data.tags.length) {  
                // this.distance = window.playerPosition.distanceTo(this.intersection[0].point);
                this.distance = this.raycaster.ray.origin.distanceTo( this.intersection[0].point );
                this.hitpoint = this.intersection[0].point;
                this.rayhit(this.instanceId, this.distance, this.hitpoint); 
              }

            }
          }

        } else {
          this.hitID = null;
          this.instanceId = null;
        }
      }
    },
    rayhit: function (hitID, distance, hitpoint) {
      if (this.hitID != hitID && this.data.tags) {
        
        this.intersection = null;
        
        this.hitID = hitID;
        console.log("new hit " + hitID + " " + distance + " " + JSON.stringify(hitpoint) + " interaction:" + this.data.interaction + " eventData " + this.data.eventData.toLowerCase());
        var triggerAudioController = document.getElementById("triggerAudio");
        if (triggerAudioController != null) {
          triggerAudioController.components.trigger_audio_control.playAudioAtPosition(hitpoint, distance, this.data.tags);
        }
        if (this.data.tags && this.data.tags.toLowerCase().includes("kill")) {
          this.particlesEl.setAttribute("position", hitpoint);
          this.removeInstance(this.instanceId);
        }
      }
      if (this.matrixMeshComponent != null) {
        this.matrixMeshComponent.showRoomData(this.instanceId, distance, hitpoint);
      }

      

      
    },
    instance_clicked: function (id) {
      console.log(id);  
      if (id != null && id != this.lastClickedID && this.intersection != null && this.data.tags != 'undefined') {
        this.lastClickedID = id; //bc double triggering....ugh
        console.log(this.data.tags + " clicked id " + id);
        var triggerAudioController = document.getElementById("triggerAudio");
          if (triggerAudioController != null) {
            triggerAudioController.components.trigger_audio_control.playAudioAtPosition(this.hitpoint, this.distance, this.data.tags);
            }
          // this.iMesh.position.set(id, 0, 0, -100);
          if (this.useMatrix) {
            let matrixMeshEl = document.getElementById("matrix_meshes");
            if (matrixMeshEl != null) {
              this.matrixMeshComponent = matrixMeshEl.components.matrix_meshes;
              if (this.matrixMeshComponent != null && this.intersection != null) {
                this.matrixMeshComponent.selectRoomData(this.instanceId);
              }
            }
          }
      }
    }


});

AFRAME.registerComponent('instanced_meshes_mod', { //click to spawn?
  schema: {

    _id: {default: ''},
    modelID: {default: ''}
  },

  init: function () {
    
     let initialized = false;
     let clickCount = 0;
      this.surfaceMesh = null;
      this.scatterModel = null;
      this.sampleGeometry = null;
      this.sampleMaterial = null;
      var dummy = new THREE.Object3D();
      
      this.iMesh = null;

      console.log("model this.data._id " + this.data._id);
      const scatterModel = document.getElementById(this.data._id);
      if (scatterModel != null) {
        scatterModel.addEventListener('model-loaded', (event) => {
        const sObj = scatterModel.getObject3D('mesh');
        console.log("tryna INSTANCE THE THIGNS");
      
        sObj.traverse(node => {
          if (node.isMesh && node.material) {
              this.sampleGeometry = node.geometry;
              this.sampleMaterial = node.material;
          }
        });
      });
  }

    this.surfaces = document.getElementsByClassName("surface"); //set by location.eventData
    console.log("surfaces found " + this.surfaces.length);
    if (this.surfaces.length > 0) {
      this.surface = this.surfaces[0];
      this.surface.addEventListener('model-loaded', (e) => {
        let obj = this.surface.getObject3D('mesh');
        obj.traverse(node => {
          if (node.isMesh) {
            this.surfaceMesh = node;
          }
          });
        });
    this.surface.setAttribute("activeObjexRay");
    console.log('surfacemesh name ' + this.surfaceMesh);

    this.surface.addEventListener('click', (event) => {
    
        clickCount ++;
        console.log("ground click " + clickCount);
        if (clickCount < 30) {
        
        const count = 25;
    
        const sampler = new MeshSurfaceSampler( this.surfaceMesh ) // noice!
        .setWeightAttribute( 'color' )
        .build();

          this.iMesh = new THREE.InstancedMesh(this.sampleGeometry, this.sampleMaterial, count);
          
          let position = new THREE.Vector3()

            
          for (var i=0; i<count; i++) {

            sampler.sample( position )

            let scale = Math.random() * 4;
            
            dummy.position.set(  position.x,position.y,position.z );

            dummy.scale.set(scale,scale,scale);
            
            dummy.rotation.y = (Math.random() * 360 ) * Math.PI / 180;

            dummy.updateMatrix();

            this.iMesh.setMatrixAt( i ++, dummy.matrix );
  
          }
  
              this.iMesh.frustumCulled = false;
              this.iMesh.instanceMatrix.needsUpdate = true;
              
              sceneEl.object3D.add(this.iMesh);

          }
      });

    }
  }

});

AFRAME.registerComponent('instanced_meshes_mod2', {
  schema: {

    _id: {default: ''},
    modelID: {default: ''}
  },

  init: function () {
    
     let initialized = false;
     let clickCount = 0;
      this.surfaceMesh = null;
      this.scatterModel = null;
      this.sampleGeometry = null;
      this.sampleMaterial = null;
      var dummy = new THREE.Object3D();
      
      this.iMesh = null;

      console.log("model this.data._id " + this.data._id);
      const scatterModel = document.getElementById(this.data._id);
      if (scatterModel != null) {
      scatterModel.addEventListener('model-loaded', (event) => {
      const sObj = scatterModel.getObject3D('mesh');
      console.log("tryna INSTANCE THE THIGNS");
    
      sObj.traverse(node => {
        if (node.isMesh && node.material) {
            this.sampleGeometry = node.geometry;
            this.sampleMaterial = node.material;
        }
      });
    });
  }

    this.surfaces = document.getElementsByClassName("surface"); //set by location.eventData
    console.log("surfaces found " + this.surfaces.length);
    if (this.surfaces.length > 0) {
      this.surface = this.surfaces[0];
      // this.surface.addEventListener('model-loaded', (e) => {
        let obj = this.surface.getObject3D('mesh');
        obj.traverse(node => {
          console.log(node.name);
          if (node.isMesh && node.geometry != null) {
            this.surfaceMesh = node;
          }
          });
        // this.surfaceMesh = obj.children[0].geometry;
        // });
    // let obj = this.surface.getObject3D('mesh');    
    // this.surfaceMesh.children    
    this.surface.setAttribute("activeObjexRay");
    console.log('surfacemesh name ' + this.surfaceMesh);

    this.surface.addEventListener('click', (event) => {
    
        clickCount ++;
        console.log("ground click " + clickCount);
        if (clickCount < 30) {
        
        const count = 25;
    
        const sampler = new MeshSurfaceSampler( this.surfaceMesh ) // noice!
        .setWeightAttribute( 'color' )
        .build();

          this.iMesh = new THREE.InstancedMesh(this.sampleGeometry, this.sampleMaterial, count);
          
          let position = new THREE.Vector3()

            
          for (var i=0; i<count; i++) {

            sampler.sample( position )
            // console.log("position " + position);
            let scale = Math.random() * 4;
            
            dummy.position.set(  position.x,position.y,position.z );

            dummy.scale.set(scale,scale,scale);
            
            dummy.rotation.y = (Math.random() * 360 ) * Math.PI / 180;

            dummy.updateMatrix();

            this.iMesh.setMatrixAt( i ++, dummy.matrix );
  
          }
  
              this.iMesh.frustumCulled = false;
              this.iMesh.instanceMatrix.needsUpdate = true;
              
              sceneEl.object3D.add(this.iMesh);

          }
      });

    }
  }

});
// import { MeshSurfaceSampler } from '/three/examples/jsm/math/MeshSurfaceSampler.js'; //can because "type=module"


AFRAME.registerComponent('scatter-surface', {
  init: function () {
    let that = this;
    this.el.addEventListener('model-loaded', (event) => {
      event.preventDefault();
      console.log("SCATTER SURFACE LOADED");
      // that.el.emit('surfaceLoaded', true);
      // setTimeout(function(){ that.el.emit('surfaceLoaded', true);   }, 2000);// put some fudge, wait a bit for scatter meshes to load before firing
      let imeshes = document.querySelectorAll("[instanced_surface_meshes]");
      console.log("gots imeshes " + imeshes);
      for (let i = 0; i < imeshes.length; i++) {
        console.log("imesh " + imeshes[i]);
        imeshes[i].components.instanced_surface_meshes.surfaceLoaded();
      }
    
    });
  }
});

// AFRAME.registerComponent('create_placeholders', {
//   schema: {
//     isNew: {default: ''}
//   },
//   init: function() {
    
//   },
//   createPlaceholder: function () {
//     console.log("tryna createPlace3holder");
//     var sceneEl = document.querySelector('a-scene');
//     let phEl = document.createElement("a-entity");
    
//     phEl.setAttribute('moveable-placeholder', {isNew: true, name: 'new location'});
//     // phEl.setAttribute('isNew', true);
//     sceneEl.appendChild(phEl);
  
//   }
// });


AFRAME.registerComponent('local_marker', {
  schema: {
    eventData: {default: ''},
    selectedAxis: {default: 'all'},
    timestamp: {default: ''},
    name: {default: 'localplaceholder'},
    description: {default: ''},
    markerType: {default: 'placeholder'},
    eventData: {default: ''},
    isLocal: {default: true},
    isSelected: {default: false},
    tags: {default: null}

  },
  init: function () {
    this.timestamp = this.data.timestamp;
    if (this.timestamp == '') {
      this.timestamp = Math.round(Date.now() / 1000).toString();
      this.data.timestamp = this.timestamp;
    }
    // this.el.id = "placeholder_" + this.timestamp;
    // this.el.addEventListener("hitstart", function(event) {   //maybe
    //   console.log(
    //     event.target.components["aabb-collider"]["intersectedEls"].map(x => x.id)
    //   );
    // });
    console.log("tryna init local_marker withg timestamp " + this.timestamp );
    // var posRotReader = document.getElementById("player").components.get_pos_rot; 
    let isSelected = false;
    var sceneEl = document.querySelector('a-scene');

    this.calloutEntity = document.createElement("a-entity");
    this.calloutPanel = document.createElement("a-entity");
    this.calloutText = document.createElement("a-text");
    this.viewportHolder = document.getElementById('viewportPlaceholder3');
    var cameraPosition = new THREE.Vector3(); 
    this.viewportHolder.object3D.getWorldPosition( cameraPosition );
    this.calloutPanel.setAttribute("gltf-model", "#landscape_panel");
    this.calloutPanel.setAttribute("scale", ".1 .075 .1");
    this.calloutEntity.setAttribute("look-at", "#player");
    this.calloutEntity.setAttribute('visible', false);
    this.selectedAxis = null;
    this.isSelected = false;
    this.hitPosition = null;
    this.mouseDownPos = new THREE.Vector2();
    this.mousePos = new THREE.Vector2();
    this.distance = 0;

    this.el.classList.add('activeObjexRay');
    this.el.classList.add('activeObjexGrab');
    this.clientX = 0;
    this.clientY = 0;
    let thisEl = this.el;
    // calloutEntity.setAttribute("render-order", "hud");
    sceneEl.appendChild(this.calloutEntity);
    this.calloutEntity.appendChild(this.calloutPanel);
    this.calloutEntity.appendChild(this.calloutText);
    
    this.calloutPanel.setAttribute("position", '0 0 1'); 
    this.calloutText.setAttribute("position", '0 0 1.25'); //offset the child on z toward camera, to prevent overlap on model
    this.calloutText.setAttribute('text', {
      width: .5,
      baseline: "bottom",
      align: "left",
      font: "/fonts/Exo2Bold.fnt",
      anchor: "center",
      wrapCount: 12,
      color: "white",
      value: "wha"
    });
    this.calloutPanel.setAttribute("overlay");
    this.calloutText.setAttribute("overlay");
    let theElement = this.el;
    // this.el.setAttribute('skybox-env-map');
    // 
      this.phID = room + '~localmarker~' + this.timestamp; //"placeholder" id, for client side location mods
      this.el.id = this.phID;
      // this.el.addEventListener('model-loaded', () => {
      // console.log("looking for localplaceholder " + localStorage.getItem(this.phID));
      this.storedVars = JSON.parse(localStorage.getItem(this.phID));
        if (this.storedVars != null) {
          if (this.storedVars.model == null || this.storedVars.model == undefined || this.storedVars.model == "none" || this.storedVars.model == "") {
            console.log(this.phID + " storedVars " + JSON.stringify(this.storedVars));
            if (this.storedVars.markerType.toLowerCase() == "placeholder") {
              this.el.setAttribute('gltf-model', '#placeholder');
            } else if (this.storedVars.markerType.toLowerCase() == "poi") {
              this.el.setAttribute('gltf-model', '#poi1');
            } else if (this.storedVars.markerType.toLowerCase() == "gate") {
              this.el.setAttribute('gltf-model', '#poi1');
            } else if (this.storedVars.markerType.toLowerCase() == "portal") {
              this.el.setAttribute('gltf-model', '#poi1');
            }
             else if (this.storedVars.markerType.toLowerCase().includes("trigger")) {
              this.el.setAttribute('gltf-model', '#poi1');  
            } else if (this.storedVars.markerType.toLowerCase() == "mailbox") {
              this.el.setAttribute('gltf-model', '#mailbox');
            }
            this.el.setAttribute('position', {x: this.storedVars.x, y: this.storedVars.y, z: this.storedVars.z});
            this.el.setAttribute('rotation', {x: this.storedVars.eulerx, y: this.storedVars.eulery, z: this.storedVars.eulerz});
            this.el.setAttribute('scale', {x: this.storedVars.scale, y: this.storedVars.scale, z: this.storedVars.scale });
            // this.el.setAttribute('rotation', this.storedVars.eulerx+","+this.storedVars.eulery+","+this.storedVars.eulerz );
          } else {
            // console.log("sceneModels " + JSON.stringify(sceneModels));
            for (let i = 0; i < sceneModels.length; i++) {
              // console.log("sceneModel ID " + sceneModels[i]._id + " vs " + this.storedVars.modelID);
              if (sceneModels[i]._id == this.storedVars.modelID) {
                this.el.setAttribute('gltf-model', sceneModels[i].url);
                this.el.setAttribute('position', {x: this.storedVars.x, y: this.storedVars.y, z: this.storedVars.z});
                this.el.setAttribute('rotation', {x: this.storedVars.eulerx, y: this.storedVars.eulery, z: this.storedVars.eulerz});
                this.el.setAttribute('scale', {x: this.storedVars.scale, y: this.storedVars.scale, z: this.storedVars.scale });
              }
            }
          }
        } else {
          //save to local if new
          this.el.setAttribute('position', cameraPosition);
          this.el.setAttribute('gltf-model', '#placeholder');
          let locItem = {};
          locItem.x = cameraPosition.x.toFixed(2);
          locItem.eulerx = 0;
          locItem.y = cameraPosition.y.toFixed(2);
          locItem.eulery = 0;
          locItem.z = cameraPosition.z.toFixed(2);
          locItem.eulerz = 0;
          locItem.type = "Worldspace";
          locItem.label = 'local placeholder';
          locItem.name = 'local placeholder ' + this.timestamp;
          locItem.description = '';
          locItem.markerType = "placeholder";
          locItem.eventData = '';
          locItem.isLocal = true;
          locItem.timestamp = this.timestamp;
          locItem.scale = 1;
          locItem.tags = '';
          locItem.phID = this.phID;
          console.log("tryna set localmarker with phID " + this.phID);
          localStorage.setItem(this.phID, JSON.stringify(locItem));
          AddLocalMarkers();
        }
    // });
    this.calloutToggle = false;
    let that = this;
    // that.calloutEntity = this.calloutEntity;
    // that.calloutText = this.calloutText;
    // this.el.addEventListener("model-loaded", (e) => {
    //   e.preventDefault();
    //   this.el.setAttribute("aabb_listener", true);
    // });
    this.el.addEventListener('mouseenter', function (evt) {
      if (posRotReader != null) {
        this.playerPosRot = posRotReader.returnPosRot(); 
        window.playerPosition = this.playerPosRot.pos; 
      } else {
        posRotReader = document.getElementById("player").components.get_pos_rot; 
        if (posRotReader) {
          this.playerPosRot = posRotReader.returnPosRot(); 
          window.playerPosition = this.playerPosRot.pos; 
        }
      }
      // console.log("playerPOsition  " + JSON.stringify(window.playerPosition));
      if (!that.isSelected) {
        // document.getElementById("player").component.get_pos_rot.returnPosRot();
        this.clientX = evt.clientX;
        this.clientY = evt.clientY;
        // console.log("tryna mouseover placeholder");
        that.calloutToggle = !that.calloutToggle;

        let pos = evt.detail.intersection.point; //hitpoint on model
        let name = evt.detail.intersection.object.name;
        that.hitPosition = pos;
        if (player != null && window.playerPosition != null) { 
        that.distance = window.playerPosition.distanceTo(pos);

        that.rayhit(evt.detail.intersection.object.name, that.distance, evt.detail.intersection.point);

          that.selectedAxis = name;

          // let elPos = that.el.getAttribute('position');
        if (!name.includes("handle")) {
          if (that.distance < 66) {
            console.log("trna scale to distance :" + that.distance);
            that.calloutEntity.setAttribute("position", pos);
            that.calloutEntity.setAttribute('visible', true);
            that.calloutEntity.setAttribute('scale', {x: that.distance * .25, y: that.distance * .25, z: that.distance * .25} );
            let theLabel = that.data.label != undefined ? that.data.label : that.data.name;
            let calloutString = theLabel;
            if (that.calloutToggle) { //show pos every other time
              // calloutString = "x : " + elPos.x.toFixed(2) + "\n" +"y : " + elPos.y.toFixed(2) + "\n" +"z : " + elPos.z.toFixed(2);
              calloutString = that.data.description != '' ? that.data.description : theLabel;
            }
            that.calloutText.setAttribute("value", calloutString);
          }
          }
        }
      }  
    });

    this.el.addEventListener('mouseleave', function (evt) {
      that.calloutEntity.setAttribute('visible', false);
      // if (that.selectedAxis != null && !that.selectedAxis.includes('handle')) {
      //   that.isSelected = false;

      // }
    });

    this.el.addEventListener('mousedown', function (evt) {
      that.isSelected = true;
      // isSelected = true;
      // this.deselect();
      // this.isSelected = true;
      let name = evt.detail.intersection.object.name;
      // console.log(name);
      that.selectedAxis = name;

    });
    this.el.addEventListener('mouseup', function (evt) {
      console.log("tryna mouseup localmarker");
      // that.isSelected = false;

      // isSelected = false;
      if (that.data.markerType.toLowerCase() == "placeholder" ) {
        that.hitPosition = null;
        if (this.mouseDownPos != undefined) {
          this.mouseDownPos.x = 0;
          this.mouseDownPos.y = 0;
          this.selectedAxis = null;
        }
        let position = that.el.getAttribute("position");
        // console.log("position " + position);
        let storedVars = JSON.parse(localStorage.getItem(that.phID));
        
        if (storedVars != null) { //already modded this cloud placeholder
          storedVars.x = position.x.toFixed(2);
          storedVars.y = position.y.toFixed(2);
          storedVars.z = position.z.toFixed(2);
          that.data.name = storedVars.name;
          // if (storedVars.model != undefined && storedVars.model != "none") {
          //   for (let i = 0; i < sceneModels.length; i++) {
          //     if (sceneModels[i]._id == storedVars.modelID) {
          //       this.el.setAttribute("gltf-model", sceneModels[i].url);
          //     }
          //   }
          // }
        } else { //new ls key for cloud placeholder
          let locItem = {};
          locItem.x = position.x.toFixed(2);
          // locItem.eulerx = document.getElementById('xrot').value;
          locItem.y = position.y.toFixed(2);

          locItem.z = position.z.toFixed(2);
          locItem.type = "Worldspace";
          locItem.label = "cloud placeholder";
          locItem.name = "cloud placeholder " + that.data.timestamp;
          locItem.markerType = "placeholder";
          locItem.isLocal = true;
          locItem.description = "";
          locItem.timestamp = that.data.timestamp;
          locItem.phID = that.phID;
          storedVars = locItem;
        }
        localStorage.setItem(that.phID, JSON.stringify(storedVars));
        // console.log("phID: " + that.phID + JSON.stringify(localStorage.getItem(that.phID)));
        // AddLocalMarkers();
        // console.log('get model ' + this.el.getAttribute('gltf-model'));
        if (that.isSelected && that.selectedAxis != null && !that.selectedAxis.includes('handle')) {
          console.log("tryna show locationModal " + that.data.timestamp);
          ShowLocationModal(that.phID);
        }
        AddLocalMarkers();
      } else if (that.data.markerType.toLowerCase() == "mailbox") {
        console.log('tryna sho0w messages modal');
        SceneManglerModal('Messages');
      }
      that.deselect(); 
    });
    // this.el.addEventListener('dblclick', function (evt) {
    //   // console.log("tryna mousedouwn");
    //     console.log("tryna show locationModal " + that.data.timestamp);
    //     ShowLocationModal(that.phID);
      
    // });

    this.el.addEventListener('click', function (evt) { //redundant?
      let position = that.el.getAttribute('position');
      // that.isSelected = false;

      that.hitPosition = null;
      that.mouseDownPos.x = 0;
      that.mouseDownPos.y = 0;
      that.selectedAxis = null;
    });
    sceneEl.addEventListener("mousemove", (event) =>{
      	that.mousePos.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	      that.mousePos.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    });
  },
  loadObject: function (objectID) { //local object swap (maybe with child model...);
    console.log("tryna load modeID " + objectID);
    if (objectID != undefined && objectID != null & objectID != "none" && objectID != "") {  
      for (let i = 0; i < sceneObjects.length; i++) {
        if (sceneObjects[i]._id == objectID) {
          // this.el.setAttribute('gltf-model', sceneObjects[i].url);

          let objexEl = document.getElementById('sceneObjects');    
          if (objexEl) { 
            this.objectData = objexEl.components.mod_objex.returnObjectData(objectID);
            if (this.objectData) {
              if (this.objectElementID != null) {
                document.getElementById(this.objectElementID).remove(); //wait, what?
              }
              this.locData = {};
              this.locData.x = this.el.object3D.position.x;
              this.locData.y = this.el.object3D.position.y;
              this.locData.z = this.el.object3D.position.z;
              this.locData.timestamp = Date.now();
              
              let objEl = document.createElement("a-entity");
              
              objEl.setAttribute("mod_object", {'locationData': this.locData, 'objectData': this.objectData});
              objEl.id = "obj" + objectData._id + "_" + this.locData.timestamp;
              this.objectElementID = objEl.id; //USED AS A REFERENCE TO GET AND REMOVE (above) EXISTING PLACEHOLDER OBJECT
              sceneEl.appendChild(objEl);
            }
          }
        }
      }
    } 
  },
  loadModel: function (modelID) { //local model swap
    console.log("tryna load modeID " + modelID);
    if (modelID != undefined && modelID != null & modelID != "none" && modelID != "") {  
      for (let i = 0; i < sceneModels.length; i++) {
        if (sceneModels[i]._id == modelID) {
          this.el.setAttribute('gltf-model', sceneModels[i].url);
        }
      }
    } else { //if "none"

      this.el.setAttribute("gltf-model", "https://servicemedia.s3.amazonaws.com/assets/models/placeholder.glb");
    }
  },
  deselect: function () {
    this.isSelected = false;
  },
  playerTriggerHit: function () { //might use AABB collider or physics
    console.log("gotsa player trigger hit on local marker with type " + this.data.markerType.toLowerCase()); 
      if (this.data.markerType.toLowerCase() == "spawntrigger") {

          let objexEl = document.getElementById('sceneObjects');    
          objexEl.components.mod_objex.spawnObject(this.data.eventData);
      }
      if (this.data.markerType.toLowerCase() == "gate") {
        if (this.data.eventData != null && this.data.eventData != "") {
          let url = "https://servicemedia.net/webxr/" + this.data.eventData;
          window.location.href = url;
        }
      }
  },
  physicsTriggerHit: function (id) {  
    console.log("gotsa physics trigger hit on " + id); //maybe check the layer of colliding entity or something...
    var triggerAudioController = document.getElementById("triggerAudio");
    if (triggerAudioController != null) {
      triggerAudioController.components.trigger_audio_control.playAudioAtPosition(this.el.object3D.position, window.playerPosition.distanceTo(this.el.object3D.position), this.data.tags);
    }
     
  },
  tick: function() {
    if (this.isSelected && this.mousePos != null && this.mouseDownPos != null) {

      this.distance = this.mousePos.distanceTo(this.mouseDownPos);
    
        // console.log(this.distance);
      if (this.selectedAxis == "x_plus_handle") {
        this.el.object3D.translateX(this.distance / 4);
      }
      if (this.selectedAxis == "x_minus_handle") {
        this.el.object3D.translateX(-this.distance / 4);
      }
      if (this.selectedAxis == "y_plus_handle") {
        this.el.object3D.translateY(this.distance / 4);
      }
      if (this.selectedAxis == "y_minus_handle") {
        this.el.object3D.translateY(-this.distance / 4);
      }
      if (this.selectedAxis == "z_plus_handle") {
        this.el.object3D.translateZ(this.distance / 4);
      }
      if (this.selectedAxis == "z_minus_handle") {
        this.el.object3D.translateZ(-this.distance / 4);
      }
    } 
  },
  rayhit: function (hitID, distance, hitpoint) {
    // if (this.hitID != hitID) {
    //   this.hitID = hitID;
      // console.log("new hit " + hitID + " " + distance + " " + JSON.stringify(hitpoint));
      // distance = window.playerPosition.distanceTo(hitpoint);
      console.log("new hit " + hitID + " " + distance + " " + JSON.stringify(hitpoint));
      if (this.data.eventData.toLowerCase().includes("audiotrigger")) {
        var triggerAudioController = document.getElementById("triggerAudio");
        if (triggerAudioController != null) {
          triggerAudioController.components.trigger_audio_control.playAudioAtPosition(hitpoint, distance, this.data.triggerTag);
        }
      }
    }

});

AFRAME.registerComponent('cloud_marker', {
  schema: {
    phID: {default: ''}, //unique id, w/ room + "~cloudmarker~" + timestamp, used for localstorage ref
    eventData: {default: ''},
    selectedAxis: {default: 'all'},
    timestamp: {default: ''},
    name: {default: ''},
    label: {default: ''},
    isNew: {default: true},
    markerType: {default: 'placeholder'},
    tags: {default: null},
    modelID: {default: ''},
    model: {default: ''},
    scale: {default: 1},
    description: {default: ''}
  },
  init: function () {

   var sceneEl = document.querySelector('a-scene');
    //let calloutString = this.data.calloutString;
    this.cursor = document.querySelector('[cursor]');
    this.calloutEntity = document.createElement("a-entity");
    this.calloutPanel = document.createElement("a-entity");
    this.calloutText = document.createElement("a-text");
    this.viewportHolder = document.getElementById("viewportPlaceholder3");
    let thisEl = this.el;
    this.isSelected = false;
    this.data.scale = this.data.scale != undefined ? this.data.scale : 1;
    this.objectElementID = null;
    // if (!this.data.isNew) {
      // this.phID = room + '_cloudmarker_' + this.data.timestamp;
      // this.el.id = this.phID;
      // this.el.setAttribute('id', this.phID);
      
      this.phID = this.data.phID;
      // console.log("cloudmarker phID " + this.phID); 
      this.storedVars = JSON.parse(localStorage.getItem(this.phID));
      // "mod_physics=\x22body: kinematic; isTrigger: true;\x22";
      this.el.setAttribute("mod_physics", {body: 'kinematic', isTrigger: true})
      // this.el.addEventListener("hitstart", function(event) {   //maybe
      //   console.log(
      //     event.target.components["aabb-collider"]["intersectedEls"].map(x => x.id)
      //   );
      // });

      if (this.storedVars != null) {
        console.log(this.phID + " storedVars " + JSON.stringify(this.storedVars));
        
        this.el.setAttribute('position', {x: this.storedVars.x, y: this.storedVars.y, z: this.storedVars.z});
        this.el.setAttribute('rotation', {x: this.storedVars.eulerx, y: this.storedVars.eulery, z: this.storedVars.eulerz});
        this.el.setAttribute('scale', {x: this.storedVars.scale, y: this.storedVars.scale, z: this.storedVars.scale });
        this.data.description = this.storedVars.description;


        if (this.storedVars.modelID == null || this.storedVars.modelID == undefined || this.storedVars.model == "none" || this.storedVars.model == "undefined") {

        // if (this.storedVars.markerType.toLowerCase() == "placeholder") { //hrm, should just be placeholders?
        //   this.el.setAttribute('gltf-model', '#savedplaceholder');
        // } else if (this.storedVars.markerType.toLowerCase() == "poi") {
        //   this.el.setAttribute('gltf-model', '#poi1');
        // } else if (this.storedVars.markerType.toLowerCase() == "gate") {
        //   this.el.setAttribute('gltf-model', '#poi1');
        // } else if (this.storedVars.markerType.toLowerCase() == "portal") {
        //   this.el.setAttribute('gltf-model', '#poi1');
        // } else if (this.storedVars.markerType.toLowerCase().includes("trigger")) {
        //   this.el.setAttribute('gltf-model', '#poi1');  
        //   // this.el.setAttribute("aabb-collider", {objects: ".activeObjexRay"});
        // } else if (this.storedVars.markerType.toLowerCase() == "mailbox") {
        //   this.el.setAttribute('gltf-model', '#mailbox');
        // } else {
        //   this.el.setAttribute('gltf-model', '#poi1');
        // }
          this.el.setAttribute('gltf-model', '#poi1');
        } else {
          for (let i = 0; i < sceneModels.length; i++) {
            if (sceneModels[i]._id == this.storedVars.modelID) {
              this.el.setAttribute("gltf-model", sceneModels[i].url); //TODO get an asset ID instead?
              this.el.setAttribute('position', {x: this.storedVars.x, y: this.storedVars.y, z: this.storedVars.z});
              this.el.setAttribute('rotation', {x: this.storedVars.eulerx, y: this.storedVars.eulery, z: this.storedVars.eulerz});
              this.el.setAttribute('scale', {x: this.storedVars.scale, y: this.storedVars.scale, z: this.storedVars.scale });
              // this.el.setAttribute('position')
              console.log("tryna set locModel for cloudmarker " + this.storedVars.model);
              break;
            }
          }
        }
        


        // if (this.storedVars.modelID != null && this.storedVars.modelID != undefined && this.storedVars.model != "none") {
          // for (let i = 0; i < sceneModels.length; i++) {
          //   if (sceneModels[i]._id == this.storedVars.modelID) {
          //     this.el.setAttribute("gltf-model", sceneModels[i].url); //TODO get an asset ID instead?
          //     console.log("tryna set locModel for cloudmarker " + sceneModels[i].url);
          //   }
          // }
        // } 
        // this.el.addEventListener('model-loaded', (evt) => { //load placeholder model first (which is an a-asset) before calling external
        //   if (this.storedVars.modelID != null && this.storedVars.modelID != undefined && this.storedVars.model != "none") {
        //       for (let i = 0; i < sceneModels.length; i++) {
        //         if (sceneModels[i]._id == this.storedVars.modelID) {
        //           this.el.setAttribute("gltf-model", sceneModels[i].url); //TODO get an asset ID instead?
        //           console.log("tryna set locModel for cloudmarker " + sceneModels[i].url);
        //         }
        //       }
        //     }
        // });

        if (this.storedVars.scale != null && this.storedVars.scale != undefined && this.storedVars.scale != "none") {
          this.storedVars.scale = 1;
        }
        this.data.label = this.storedVars.label;
        this.data.name = this.storedVars.name;
        this.data.markerType = this.storedVars.markerType;
      } else {
        
        // else { //new ls key for cloud placeholder
        console.log(this.phID + " unstoredVars " + JSON.stringify(this.storedVars));

          let locItem = {};
          let position = this.el.getAttribute('position'); //
          let rotation = this.el.getAttribute('rotation');
          locItem.x = position.x.toFixed(2);
          locItem.eulerx = rotation.x.toFixed(2);
          locItem.y = position.y.toFixed(2);
          locItem.eulery = rotation.y.toFixed(2);
          locItem.z = position.z.toFixed(2);
          locItem.eulerz = rotation.z.toFixed(2);
          locItem.scale = this.data.scale;
          locItem.type = "Worldspace";
          locItem.name = this.data.name;
          locItem.label = this.data.label;
          locItem.eventData = this.data.eventData;
          locItem.description = this.data.description;
          locItem.timestamp = this.data.timestamp;
          locItem.markerType = this.data.markerType;
          locItem.modelID = this.data.modelID;
          locItem.model = this.data.model;
          locItem.objectID = this.data.objectID;
          locItem.objName = this.data.objName;
          locItem.phID = this.phID;

          // storedVars = locItem;
        // }
        

        if (this.data.modelID == null || this.data.modelID == undefined || this.data.model == "none" || this.data.model == "undefined") {
          // if (this.data.markerType.toLowerCase() == "placeholder") {
          //     this.el.setAttribute('gltf-model', '#savedplaceholder');
          //   } else if (this.data.markerType.toLowerCase() == "poi") {
          //     this.el.setAttribute('gltf-model', '#poi1');
          //   } else if (this.data.markerType.toLowerCase().includes("trigger")) {
          //     this.el.setAttribute('gltf-model', '#poi1');  
          //   } else if (this.data.markerType.toLowerCase() == "gate") {
          //     this.el.setAttribute('gltf-model', '#poi1');
          //   } else if (this.data.markerType.toLowerCase() == "portal") {
          //     this.el.setAttribute('gltf-model', '#poi1');
          //   } else if (this.data.markerType.toLowerCase() == "mailbox") {
          //     this.el.setAttribute('gltf-model', '#mailbox');
          //   }
          this.el.setAttribute('gltf-model', '#poi1');
        } else {
          if (this.data.modelID != "none") {
            for (let i = 0; i < sceneModels.length; i++) {
              if (sceneModels[i]._id == this.data.modelID) {
                this.el.setAttribute("gltf-model", sceneModels[i].url);
                // this.el.setAttribute('position', {x: this.data.x, y: this.data.y, z: this.data.z});
                // this.el.setAttribute('rotation', {x: this.data.eulerx, y: this.data.eulery, z: this.data.eulerz});
                this.el.setAttribute('scale', {x: this.data.scale, y: this.data.scale, z: this.data.scale });
                console.log("tryna set new locModel for cloudmarker " + this.data.model);

              }
            }
          }
        }
        if (this.data.objectID != undefined && this.data.objectID != null && this.data.objectID != "none" && this.data.objectID != "") { //hrm, cloudmarker objex?

        }
        localStorage.setItem(this.phID, JSON.stringify(locItem)); 
      }
    // if (this.data.markerType.toLowerCase() == "placeholder") {
    //   this.el.setAttribute('gltf-model', '#savedplaceholder');
    // } else if (this.data.markerType.toLowerCase() == "poi") {
    //   this.el.setAttribute('gltf-model', '#poi1');
    // } else if (this.data.markerType.toLowerCase().includes("trigger")) {
    //   this.el.setAttribute('gltf-model', '#poi1');  
    // } else if (this.data.markerType.toLowerCase() == "gate") {
    //   this.el.setAttribute('gltf-model', '#poi1');
    // } else if (this.data.markerType.toLowerCase() == "portal") {
    //   this.el.setAttribute('gltf-model', '#poi1');
    // } else if (this.data.markerType.toLowerCase() == "mailbox") {
    //   this.el.setAttribute('gltf-model', '#mailbox');
    // }
    if (this.data.name == '') {
      this.data.name = this.data.timestamp;
    }
    if (this.data.eventData.toLowerCase().includes('beat')) {
      this.el.classList.add('beatme');
    }

   
      // console.log("timestamp: " + this.data.timestamp+ " storedVars " + this.storedVars);
    // // } else {
    //   let position = this.viewportHolder.getAttribute('position');
    //   this.data.timestamp = Math.round(Date.now() / 1000);
    //   this.data.name = "location placeholder";
    //   this.el.setAttribute('position', position);
    // }
    this.clientX = 0;
    this.clientY = 0;
    this.selectedAxis = null;
    this.isSelected = false;
    this.hitPosition = null;
    this.mouseDownPos = new THREE.Vector2();
    this.mousePos = new THREE.Vector2();
    this.distance = 0;
    // this.calloutText = calloutText;
    // calloutText.setAttribute('overlay');
    // gltf-model=\x22#square_panel\x22
    if (!this.data.tags.includes("hide callout") && !this.data.tags.includes("hide callout")) {
      this.calloutPanel.setAttribute("gltf-model", "#landscape_panel");
      this.calloutPanel.setAttribute("scale", ".1 .075 .1");
      // this.calloutEntity.getObject3D("mesh").scale()
      this.calloutEntity.setAttribute("look-at", "#player");
      this.calloutEntity.setAttribute('visible', false);
      // this.selectedAxis = null;
      // this.isSelected = false;
      // this.hitPosition = null;
      // this.mouseDownPos = new THREE.Vector2();
      // this.mousePos = new THREE.Vector2();
      // this.distance = 0;
      // calloutEntity.setAttribute("render-order", "hud");
      sceneEl.appendChild(this.calloutEntity);
      this.calloutEntity.appendChild(this.calloutPanel);
      this.calloutEntity.appendChild(this.calloutText);
      this.calloutPanel.setAttribute("position", '0 0 1'); 
      this.calloutPanel.setAttribute("overlay");
      // this.calloutText.setAttribute("size", ".1 .1 .1");
      this.calloutText.setAttribute("position", '0 0 1.25'); //offset the child on z toward camera, to prevent overlap on model
      this.calloutText.setAttribute('text', {
        width: .5,
        baseline: "bottom",
        align: "left",
        font: "/fonts/Exo2Bold.fnt",
        anchor: "center",
        wrapCount: 12,
        color: "white",
        value: "wha"
      });
    }
      // this.el.addEventListener("model-loaded", (e) => {
      //   e.preventDefault();
      //   this.el.setAttribute("aabb_listener", true);
      // });
      this.calloutText.setAttribute("overlay");
    
      this.calloutToggle = false;

    let that = this;


    // this.el.addEventListener('model-loaded', (evt) => { //load placeholder model first (which is an a-asset) before calling external
    //   evt.preventDefault();
    //   console.log("MODEL LOADED FOR CLOUDMARKER!!!");
    //   // this.el.setAttribute
    // });

    this.el.addEventListener('mouseenter', function (evt) {
      
      if (posRotReader != null) {
        this.playerPosRot = posRotReader.returnPosRot(); 
        window.playerPosition = this.playerPosRot.pos; 
      } else {
          posRotReader = document.getElementById("player").components.get_pos_rot; 
          this.playerPosRot = posRotReader.returnPosRot(); 
          window.playerPosition = this.playerPosRot.pos; 
      }
  
      if (!that.isSelected && evt.detail.intersection) {
        this.clientX = evt.clientX;
        this.clientY = evt.clientY;
        // console.log("tryna mouseover placeholder");
        that.calloutToggle = !that.calloutToggle;
        let pos = evt.detail.intersection.point; //hitpoint on model
        that.hitPosition = pos;
        let name = evt.detail.intersection.object.name;
        that.distance = window.playerPosition.distanceTo(pos);
        that.rayhit(evt.detail.intersection.object.name, that.distance, evt.detail.intersection.point);
     
        that.selectedAxis = name;

        // let elPos = that.el.getAttribute('position');
        // console.log(pos);
        if (!name.includes("handle") && that.calloutEntity != null) {
          // console.log("tryna show the callout");
          if (that.distance < 66) {
          that.calloutEntity.setAttribute("position", pos);
          that.calloutEntity.setAttribute('visible', true);
          that.calloutEntity.setAttribute('scale', {x: that.distance * .25, y: that.distance * .25, z: that.distance * .25} );
          let theLabel = that.data.name != undefined ? that.data.name : "";
          let calloutString = theLabel;
          if (that.calloutToggle) {
            // calloutString = "x : " + elPos.x.toFixed(2) + "\n" +"y : " + elPos.y.toFixed(2) + "\n" +"z : " + elPos.z.toFixed(2);
            calloutString = that.data.description != '' ? that.data.description : theLabel;
          }
          that.calloutText.setAttribute("value", calloutString);
        }
      }
      }
    });
    this.el.addEventListener('mouseleave', function (evt) {
      // that.selectedAxis = null;
      // if (that.selectedAxis != null) {
      //   console.log(that.selectedAxis);
      // }
      that.calloutEntity.setAttribute('visible', false);
    });

    this.el.addEventListener('mousedown', function (evt) {

      that.isSelected = true;
      // that.hitPosition = evt.detail.intersection.point;

      console.log("tryna mousedouwn" + this.mouseDownPos);
      if (evt.detail.intersection.object != null) {
        let name = evt.detail.intersection.object.name;
        // console.log(name);
        // if (name == "x_handle") {
        //   that.selectedAxis = 'x';
        // } else if (name == "y_handle") {
        //   that.selectedAxis = 'y';
        // } else if (name == "z_handles") {
        //   that.selectedAxis = 'z';
        // } else {
        //   that.selectedAxis = 'all';
        // }
        that.selectedAxis = name;
        // document.getElementById("player").component.get_pos_rot.returnPosRot();
        if (window.playerPosition != null) {
          // 
          // console.log("intersection! " + this.intersection[ 0 ].instanceId + " distance " + window.playerPosition.distanceTo(this.intersection[0].point));
          that.rayhit(evt.detail.intersection.object.name, window.playerPosition.distanceTo(evt.detail.intersection.point), evt.detail.intersection.point);
        }
      }
      
    });
    this.el.addEventListener('mouseup', function (evt) {
      console.log("mouseup cloudmarker ");
      // that.isSelected = false;
      if (that.data.markerType.toLowerCase() == "placeholder") {
        that.hitPosition = null;
        if (this.mouseDownPos != undefined) {
          this.mouseDownPos.x = 0;
          this.mouseDownPos.y = 0;
          this.selectedAxis = null;
        }
        // let keyName = "placeholder_" + this.data.timestamp;
        let position = that.el.getAttribute("position");
        console.log("tryna set position " + position + " for key " + that.phID);
        let storedVars = JSON.parse(localStorage.getItem(that.phID));
        if (storedVars != null) { //already modded this cloud placeholder
          storedVars.x = position.x.toFixed(2);
          storedVars.y = position.y.toFixed(2);
          storedVars.z = position.z.toFixed(2);
          that.data.name = storedVars.name;
          console.log("modded storedvars " + JSON.stringify(storedVars));
        } 

        localStorage.setItem(that.phID, JSON.stringify(storedVars));
        if (that.isSelected && that.selectedAxis != null && !that.selectedAxis.includes("handle")) { //don't pop the dialog if just dragging
          ShowLocationModal(that.phID); 
        }
        AddLocalMarkers();
      } else if (that.data.markerType.toLowerCase() == "mailbox") {
        console.log('tryna sho0w messages modal');
        SceneManglerModal('Messages');
      }
      that.deselect();

    });
                                                                     
    this.el.addEventListener('click', function (evt) {
      // console.log("tryna mousedouwn");

      // that.isSelected = false;
      that.hitPosition = null;
      that.mouseDownPos.x = 0;
      that.mouseDownPos.y = 0;
      that.selectedAxis = null;
      // that.mousePos = null;

    });
    sceneEl.addEventListener("mousemove", (event) =>{
      	that.mousePos.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	      that.mousePos.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        // console.log(that.mouse);
    })

  },
  loadObject: function (objectID) { //local object swap (maybe with child model...);
    console.log("tryna load modeID " + objectID);
    if (objectID != undefined && objectID != null & objectID != "none" && objectID != "") {  
      for (let i = 0; i < sceneObjects.length; i++) {
        if (sceneObjects[i]._id == objectID) {
          // this.el.setAttribute('gltf-model', sceneObjects[i].url);

          let objexEl = document.getElementById('sceneObjects');    
          if (objexEl) { 
            this.objectData = objexEl.components.mod_objex.returnObjectData(objectID);
            if (this.objectData) {
              // let position = that.el.getAttribute("position");
              this.locData = {};
              this.locData.x = this.el.object3D.position.x;
              this.locData.y = this.el.object3D.position.y;
              this.locData.z = this.el.object3D.position.z;
              this.locData.timestamp = Date.now();
              
              let objEl = document.createElement("a-entity");
              
              objEl.setAttribute("mod_object", {'locationData': this.locData, 'objectData': this.objectData});
              objEl.id = "obj" + objectData._id + "_" + this.locData.timestamp;
              sceneEl.appendChild(objEl);
            }
          }
        }
      }
    } 
  },
  loadModel: function (modelID) {
    console.log("tryna load modeID " + modelID);
    // console.log("tryna load modeID " + modelID);
    if (modelID != undefined && modelID != null & modelID != "none" && modelID != "") {  
      for (let i = 0; i < sceneModels.length; i++) {
        if (sceneModels[i]._id == modelID) {
          this.el.setAttribute("gltf-model", sceneModels[i].url);
          // this.el.
        }
      }
    } else {
      this.el.setAttribute("gltf-model", "https://servicemedia.s3.amazonaws.com/assets/models/savedplaceholder.glb");
    }
  },
  deselect: function () {
    this.isSelected = false;
    console.log("cloudmarker this.isSelected " + this.isSelected);
  },
  playerTriggerHit: function () { //this uses AABB collider//nope, all physics now...
    console.log("gotsa player trigger hit on type " + this.data.markerType); 
    var triggerAudioController = document.getElementById("triggerAudio");
    if (triggerAudioController != null) {
      if (window.playerPosition) {
        triggerAudioController.components.trigger_audio_control.playAudioAtPosition(this.el.object3D.position, window.playerPosition.distanceTo(this.el.object3D.position), this.data.tags);
      }
      
    }  
    if (this.data.markerType.toLowerCase() == "spawntrigger") {

          let objexEl = document.getElementById('sceneObjects');    
          objexEl.components.mod_objex.spawnObject(this.data.eventData); //eventdata should have the name of a location with spawn markertype
    }
    if (this.data.markerType.toLowerCase() == "gate") {
      if (this.data.eventData != null && this.data.eventData != "") {
        let url = "/webxr/" + this.data.eventData;
        window.location.href = url;
      }
    }
  },
  physicsTriggerHit: function () {  
    console.log("gotsa physics trigger hit!"); //maybe check the layer of colliding entity or something...
    var triggerAudioController = document.getElementById("triggerAudio");
    if (triggerAudioController != null) {
      triggerAudioController.components.trigger_audio_control.playAudioAtPosition(this.el.object3D.position, window.playerPosition.distanceTo(this.el.object3D.position), this.data.tags);
    }
     
  },
  tick: function() {
    if (this.isSelected && this.mousePos != null && this.mouseDownPos != null) {
      // console.log("meese " + JSON.stringify(this.mouseDownPos) + " " + JSON.stringify(this.mousePos));
      // var startingTop = this.hitPosition.x,
      //   startingLeft = this.hitPosition.y,
      //   // math = Math.round(Math.sqrt(Math.pow(startingTop - this.clientY, 2) +Math.pow(startingLeft - this.clientX, 2))) + 'px';
      this.distance = this.mousePos.distanceTo(this.mouseDownPos);
        // console.log(this.distance);
      if (this.selectedAxis == "x_plus_handle") {
        this.el.object3D.translateX(this.distance / 4);
      }
      if (this.selectedAxis == "x_minus_handle") {
        this.el.object3D.translateX(-this.distance / 4);
      }
      if (this.selectedAxis == "y_plus_handle") {
        this.el.object3D.translateY(this.distance / 4);
      }
      if (this.selectedAxis == "y_minus_handle") {
        this.el.object3D.translateY(-this.distance / 4);
      }
      if (this.selectedAxis == "z_plus_handle") {
        this.el.object3D.translateZ(this.distance / 4);
      }
      if (this.selectedAxis == "z_minus_handle") {
        this.el.object3D.translateZ(-this.distance / 4);
      }
    } 
  },
  beat: function (volume) {
    // console.log("tryna beat " + this.el.id + " " + volume);
    if (this.data.eventData.toLowerCase().includes("beat")) {
      // let oScale = this.el.getAttribute('data-scale');
      // oScale = parseFloat(oScale);
      let oScale = this.data.scale;
      volume = volume.toFixed(2) * .2;
      let scale = {};
        scale.x = oScale + volume;
        scale.y = oScale + volume;
        scale.z = oScale + volume;
        this.el.setAttribute('scale', scale);
        this.el.setAttribute('animation', 'property: scale; to: '+oScale+' '+oScale+' '+oScale+'; dur: 500; startEvents: beatRecover; easing: easeInOutQuad');
        this.el.emit('beatRecover');

    }
  },
  rayhit: function (hitID, distance, hitpoint) {
    // if (this.hitID != hitID) {
    //   this.hitID = hitID;
      // console.log("new hit " + hitID + " " + distance + " " + JSON.stringify(hitpoint));
      distance = window.playerPosition.distanceTo(hitpoint);
      console.log("new hit " + hitID + " " + distance + " " + JSON.stringify(hitpoint));
      if (this.data.eventData.toLowerCase().includes("audiotrigger")) {
        console.log("gotsa audio trigger hit");
        var triggerAudioControllerEl = document.getElementById("triggerAudio");
        
        if (triggerAudioControllerEl != null) {
          console.log("gotsa audio trigger controller el");
          let triggerAudioController = triggerAudioControllerEl.components.trigger_audio_control;
          if (triggerAudioController  != null) {
            console.log("gotsa audio trigger controller " + distance);
            triggerAudioController.playAudioAtPosition(hitpoint, distance, this.data.tags);
          }
         
        }
      }
    }

});



AFRAME.registerComponent('mod_physics', { //used by models, not objects which manage physics settings in mod_object
  schema: {
    model: {default: ''},
    isTrigger: {type: 'bool', default: false},
    body: {type: 'string', default: 'dynamic'},  // dynamic: A freely-moving object
    shape: {type: 'string', default: 'mesh'},  // hull: Wraps a model in a convex hull, like a shrink-wrap
    eventData: {default: null},
    tags: {default: []}
  },
  init() {
    this.isTrigger = this.data.isTrigger;
  
    this.el.addEventListener('body-loaded', () => {  
      
      if (this.isTrigger) {
        console.log("TRIGGER LOADED");
        this.el.setAttribute('ammo-shape', {type: "sphere"});
      } else {
        this.el.setAttribute('ammo-shape', {type: this.data.shape});
      }
      // this.el.body.setCollisionF
      // console.log("ammo shape is " + JSON.stringify(this.el.getAttribute('ammo-shape')));
      // this.isTrigger = this.data.isTrigger;
      console.log("tryna load ashape with trigger " + this.isTrigger);
    });
  
    this.el.addEventListener('model-loaded', () => {
      if (this.isTrigger) {
        this.el.setAttribute('ammo-body', {type: "kinematic", emitCollisionEvents: true});
      } else {
        this.el.setAttribute('ammo-body', {type: this.data.body, emitCollisionEvents: true});
        
        // this.el.setAttribute('collision-filter', {collisionForces: false});
        // console.log("ammo body is " + JSON.stringify(this.el.getAttribute('ammo-body')));
        // this.loadShape();
      }

    });
    


    this.el.addEventListener("collidestart", (e) => { //this is for models or triggers, not objects - TODO look up locationData for tags? 
      e.preventDefault();
      // console.log("mod_physics collisoin with object with :" + this.el.id + " " + e.detail.targetEl.classList + " isTrigger " + this.isTrigger);
      if (this.isTrigger) {
        console.log("mod_physics TRIGGER collision "  + this.el.id + " " + e.detail.targetEl.id);
        // e.detail.body.disableCollision = true;
        this.disableCollisionTemp(); //must turn it off or it blocks, no true "trigger" mode afaik (unlike cannonjs!)
        let cloud_marker = e.target.components.cloud_marker; //closest trigger if multiple
        if (cloud_marker != null) { 
          if (e.detail.targetEl.id == "player") {
            cloud_marker.playerTriggerHit();
          } else {
            cloud_marker.physicsTriggerHit(e.detail.targetEl.id); 
          }
        } else  {
          let local_marker = e.target.components.local_marker;
          if (local_marker != null) { 
            if (e.detail.targetEl.id == "player") {
              local_marker.playerTriggerHit();
            } else {
              local_marker.physicsTriggerHit(e.detail.targetEl.id); 
            }
          }
        }
      let mod_obj_component = e.detail.targetEl.components.mod_object;
      if (mod_obj_component != null) {
        // console.log(this.el.id + " gotsa collision with " + mod_obj_component.data.objectData.name);
        if (mod_obj_component.data.objectData.tags != undefined && mod_obj_component.data.objectData.tags != null) {
          var triggerAudioController = document.getElementById("triggerAudio");
          if (triggerAudioController != null) {
            triggerAudioController.components.trigger_audio_control.playAudioAtPosition(e.detail.targetEl.object3D.position, window.playerPosition.distanceTo(e.detail.targetEl.object3D.position), mod_obj_component.data.objectData.tags);
            }
          }
        }
      }
    });

  // loadShape: function () {
  //   this.el.addEventListener('body-loaded', () => {  
  //       this.el.setAttribute('ammo-shape', {type: this.data.shape});
  //       console.log("ammo shape is " + JSON.stringify(this.el.getAttribute('ammo-shape')));
  //     });
  
  },
  disableCollisionTemp: function () { //bc ammo don't have no triggerz wtf!
    this.el.setAttribute('ammo-body', {disableCollision: true});
    setTimeout( () => {
      this.el.setAttribute('ammo-body', {disableCollision: false}); 
      console.log("trigger cooldown done") }, 3000);
  },
  enableCollision: function () {
    
  }
});


AFRAME.registerComponent('particle_spawner', 
{
  schema: {
    type: {default: 'fireworks'},
    shape: {default: 'sphere'},
    size: {default: 10},
    lifetime: {type: 'number', default: 0},
    yoffset: {type: 'number', default: 0},
    color: {default: 'lightblue'},
    scale: {default: 10}
  },
	// init: function()
	// {
  //   // console.log("tyrna init particles!!!");
	// },
  spawnParticles: function (location, type, lifetime, parentID, yFudge, pColor, pScale) {
    
    console.log("particle_spawner mod_particles location data: " + JSON.stringify(location) + " scale " + pScale);
    this.particle = document.createElement("a-entity");
    if (pScale == NaN || pScale == null || pScale == undefined) {
      pScale = 10;
    } else {
      pScale = pScale * 10;
    } 
  
    
    if (parentID != null) { 
      let pparent = document.getElementById(parentID);
      let obj = pparent.object3D;
      let box = new THREE.Box3().setFromObject(obj); //bounding box for position
      let center = new THREE.Vector3();
      box.getCenter(center);
      let pos =  obj.worldToLocal(center);
      console.log("premod pos " + JSON.stringify(pos));
      pparent.appendChild(this.particle);
      this.particle.setAttribute("position", JSON.stringify(pos));

      if (yFudge != null) {
        let newPos = {};
        newPos.x = pos.x;
        newPos.y = pos.y + parseFloat(yFudge);
        newPos.z = pos.z;
        console.log("tryna mod "+JSON.stringify(newPos)+" yfudge " + yFudge);
        this.particle.setAttribute("position", newPos);
        this.particle.setAttribute("mod_particles", {'location': location, 'type': type, 'lifetime': lifetime, 'parentID': parentID, 'yFudge': yFudge, 'color': pColor, 'scale': pScale});
      } else {
        this.particle.setAttribute("position", pos);
        this.particle.setAttribute("mod_particles", {'location': location, 'type': type, 'lifetime': lifetime, 'parentID': parentID, 'yFudge': yFudge, 'color': pColor, 'scale': pScale});
      }
      
    } else {
      this.el.sceneEl.appendChild(this.particle);
      this.particle.setAttribute("position", location);
      this.particle.setAttribute("mod_particles", {'location': location, 'type': type, 'lifetime': lifetime, 'parentID': parentID, 'yFudge': yFudge, 'color': pColor, 'scale': pScale});
    }
    
  }

});

AFRAME.registerComponent('mod_flicker', {
  schema: {
    type: {type: 'string', default: 'fire'}
  },
  init: function() {
    if (this.data.type.toLowerCase() =="candle") {
      this.lightAnimation(.5, .75);
      this.el.addEventListener('animationcomplete', () => {
        this.lightAnimation(.5, .75);
      });
    }
        
    if (this.data.type.toLowerCase() =="fire") {
      this.lightAnimation(.7, 1.5);
      this.el.addEventListener('animationcomplete', () => {
          this.lightAnimation(.7, 1.5);
      });
    }
  },
  lightAnimation: function (min, max){
      this.intensityMin = min;
      this.intensityMax = max;
      let duration = Math.random() * 600;
      let intensity = randomUniform(this.intensityMin, this.intensityMax);
      let animation = "property: light.intensity; from: 0.5; to: "+intensity+"; dur: "+duration+"; dir: alternate;";
      this.el.setAttribute('animation', animation)
    }
  
});

AFRAME.registerComponent('mod_particles', {
  schema: {
    parentID: {type: 'string', default: null},
    location: {type: 'string', default: null},
    type: {type: 'string', default: 'sparkler'},
    lifetime: {type: 'number', default: 0},
    scale: {type: 'number', default: 1},
    yFudge: {type: 'number', default: 0},
    color: {type: 'string', default: 'lightblue'},
    scale: {type: 'number', default: 10}

  },
  init: function() {
    // let particleAttributes = {};
    console.log("mod_particles data: " + this.data.scale);
    this.position = new THREE.Vector3();

    if (this.data.scale == null || this.data.scale == 0) {
      this.data.scale = 1;
    }
    // if (this.data.parentID != null) {
    //   this.el.parentElement.object3D.getWorldPosition(this.position);
    //   if (this.data.yFudge != 0) {
    //     this.position.y += this.data.yFudge;
    //     console.log("tryna add some yfudge " + this.data.yFudge); 
    //     this.el.setAttribute("position", this.position);
    //   }
    // } else {
    //   this.el.object3D.getWorldPosition(this.position);
    // }
    if (this.data.type.toLowerCase() =="candle") {
      // this.el.setAttribute('scale', '.25 .25 .25');
      this.el.setAttribute('sprite-particles', {enable: true, texture: '#candle1', color: this.data.color, textureFrame: '8 8', textureLoop: '4', spawnRate: '1', lifeTime: '1', scale: this.data.scale.toString()});
      this.el.setAttribute('light', {type: 'point', castShadow: 'true', color: this.data.color, intensity: .5, distance: 10, decay: 5});
      this.lightAnimation(.5, .75);
      this.el.addEventListener('animationcomplete', () => {
          this.lightAnimation(.5, .75);
      });

    }
        
    if (this.data.type.toLowerCase() =="fire") {
      // this.el.setAttribute('scale', '.25 .25 .25');
      console.log("tryna light a fire! "  + JSON.stringify(this.data.location) + " scale " + this.data.scale);
      this.el.setAttribute('sprite-particles', {enable: true, texture: '#fireanim1', color: this.data.color, blending: 'additive', textureFrame: '6 6', textureLoop: '3', spawnRate: '2', lifeTime: '1.1', scale: this.data.scale.toString()});
      this.el.setAttribute('light', {type: 'point', castShadow: 'true', color: this.data.color, intensity: .75, distance: 15, decay: 8});
      this.lightAnimation(.7, 1.5);
      this.el.addEventListener('animationcomplete', () => {
          this.lightAnimation(.7, 1.5);
      });
      // this.el.setAttribute("position", this.data.location);
    }
    if (this.data.type.toLowerCase() =="smoke") {
      console.log("tryna light a smoke! " + JSON.stringify(this.data.location) + " scale " + this.data.scale );
      this.el.setAttribute('sprite-particles', {enable: true, texture: '#smoke1', color: this.data.color, blending: 'additive', textureFrame: '6 5', textureLoop: '1', spawnRate: '1', lifeTime: '3', scale: this.data.scale.toString()});
      // this.el.setAttribute("position", this.data.location);
    }
    if (this.data.type.toLowerCase() =="smoke/add") {
      this.el.setAttribute('sprite-particles', {enable: true, texture: '#smoke1', color: 'lightblue', blending: 'additive', textureFrame: '6 5', textureLoop: '1', spawnRate: '1', lifeTime: '3', scale: '10'});
    }
    if (this.data.type.toLowerCase() =="bang") {
      
      this.el.setAttribute('sprite-particles', {enable: true, duration: '1', texture: '#explosion1', color: 'black..white', blending: 'additive', textureFrame: '6 5', textureLoop: '1', spawnRate: '1', lifeTime: '1', opacity: '0,1,0', rotation: '0..360', scale: '10'});

    }
    // this.el.setAttribute('sprite-particles', 'texture', '#smoke1');
    // this.el.setAttribute('sprite-particles', 'color', 'blue');
   
  },
  lightAnimation: function (min, max){
    this.intensityMin = min;
    this.intensityMax = max;
    let duration = Math.random() * 600;
    let intensity = randomUniform(this.intensityMin, this.intensityMax);
    // if (intensity < this.intensityMin) {
    //   intensity = this.intensityMin;
    // }
    // console.log("inteisity is " + intensity + " dur " + duration);
    let animation = "property: light.intensity; from: 0.5; to: "+intensity+"; dur: "+duration+"; dir: alternate;";
    // console.log(intensity);
    // updating the animation component with the .setAttribute function
    this.el.setAttribute('animation', animation)
  }

});



function randomNormal(min, max)
{
	let rand = 0;
	for (let n = 0; n < 6; n++)
		rand += Math.random();
	return min + (max - min) * (rand / 6);
}

function randomUniform(min, max)
{
	return min + (max - min) * Math.random();
}


AFRAME.registerComponent('emit-when-near', {
  schema: {
    target: {type: 'selector', default: '#camera-rig'},
    distance: {type: 'number', default: 1},
    event: {type: 'string', default: 'click'},
    eventFar: {type: 'string', default: 'unclick'},
    throttle: {type: 'number', default: 100},
  },
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.checkDist, this.data.throttle, this);
    this.emiting = false;
  },
  checkDist: function () {
    let myPos = new THREE.Vector3(0, 0, 0);
    let targetPos = new THREE.Vector3(0, 0, 0);
    this.el.object3D.getWorldPosition(myPos);
    this.data.target.object3D.getWorldPosition(targetPos);
    const distanceTo = myPos.distanceTo(targetPos);
    if (distanceTo <= this.data.distance) {
      if (this.emiting) return;
      this.emiting = true;
      this.el.emit(this.data.event, {collidingEntity: this.data.target}, false);
      this.data.target.emit(this.data.event, {collidingEntity: this.el}, false);
    } else {
      if (!this.emiting) return;
      this.el.emit(this.data.eventFar, {collidingEntity: this.data.target}, false);
      this.data.target.emit(this.data.eventFar, {collidingEntity: this.el}, false);
      this.emiting = false;
    }
  }
}); //move to navigation.js?
/////// for third person camera, see
///https://stackoverflow.com/questions/71336022/how-can-i-get-a-third-person-perspective-for-a-model-using-aframe
AFRAME.registerComponent("follow-camera", {
  schema: {
    target: {type: "selector"}
  },
  init: function () {
    // this.tick = AFRAME.utils.throttleTick(this.tick, 500, this);
    this.tmpv = new THREE.Vector3();
    this.target = this.data.target.object3D;
    this.position = new THREE.Vector3();
    this.iValue = 1;
    this.t = 0;
  },
  moveCamera: function () {

  },
  tick: function(t, dt) {
   
      if (!this.target) return; // ignore when there is no target
      // const target = this.data.target.object3D; // get the mesh
      // track the position
      this.target.getWorldPosition(this.tmpv); // get the world position
      // this.t = 
      this.iValue = 1.0 - Math.pow(0.001, (dt * .0005)); //HELLYES! smooth interpolation independent of frame rate 
      // console.log("tryna interpoolate at " + this.iValue + " posotion " + JSON.stringify(this.tmpv) + " time " + dt);
      this.el.object3D.position.lerp(this.tmpv, this.iValue); // linear interpolation towards the world position
    // }
  }
});
AFRAME.registerComponent("rotate-with-camera", { //unused
  
  init: function () {
    // this.tick = AFRAME.utils.throttleTick(this.tick, 50, this);
    this.thirdPersonPlaceholder = document.getElementById("thirdPersonPlaceholder");
    // this.tick = AFRAME.utils.throttleTick(this.tick, 500, this);

  },
  tick: (function() {
    // create once
    const tmpq = new THREE.Quaternion();
    const tmpe = new THREE.Euler();
    
    return function(t, dt) {
      if (!this.el.sceneEl.camera) return; // ignore when there is no camera
      const cam = this.el.sceneEl.camera.el; // get the camera entity
      cam.object3D.getWorldQuaternion(tmpq); // get the world rotation
        tmpe.setFromQuaternion(tmpq, 'YXZ');
        // set attribute is necesarry for wasd-controls
        // console.log("tryna rotoate y to " +  tmpe.y * 180 / Math.PI);
      
      // this.thirPersonPlaceholder.setAttribute("rotation", {x: 0, y: tmpe.y * 180 / Math.PI, z: 0 });
      this.el.setAttribute("rotation", {x: 0, y: tmpe.y * 180 / Math.PI, z: 0 }); //hrm..
      // this.el.setAttribute("rotation", {x: tmpe.x * 180 / Math.PI, y: tmpe.y * 180 / Math.PI, z: tmpe.x * 180 / Math.PI }); //hrm..
      
    }
  })()
});


/**
 * Curve component for A-Frame to deal with spline curves
 * from https://github.com/kylebakerio/aframe-curve-component/blob/master/index.js
 */
 var zAxis = new THREE.Vector3(0, 0, 1);
 var degToRad = THREE.Math.degToRad;
 
 AFRAME.registerComponent('curve-point', {
 
     //dependencies: ['position'],
 
     schema: {},
 
     init: function () {
         this.el.addEventListener("componentchanged", this.changeHandler.bind(this));
         this.el.emit("curve-point-change");
     },
 
     changeHandler: function (event) {
         if (event.detail.name == "position") {
             this.el.emit("curve-point-change");
         }
     }
 
 });
 
 AFRAME.registerComponent('curve', {
 
     //dependencies: ['curve-point'],
 
     schema: {
         type: {
             type: 'string',
             default: 'CatmullRom',
             oneOf: ['CatmullRom', 'CubicBezier', 'QuadraticBezier', 'Line']
         },
         closed: {
             type: 'boolean',
             default: false
         }
     },
 
     init: function () {
         this.pathPoints = null;
         this.curve = null;
 
         this.el.addEventListener("curve-point-change", this.update.bind(this));
     },
 
     update: function (oldData) {
 
         this.points = Array.from(this.el.querySelectorAll("a-curve-point, [curve-point]"));
 
         if (this.points.length <= 1) {
             console.warn("At least 2 curve-points needed to draw a curve");
             this.curve = null;
         } else {
             // Get Array of Positions from Curve-Points
             var pointsArray = this.points.map(function (point) {
 
                 if (point.x !== undefined && point.y !== undefined && point.z !== undefined) {
                     return point;
                 }
 
                 // return point.object3D.getWorldPosition();
                 return point.object3D.position;
             });
 
             // Update the Curve if either the Curve-Points or other Properties changed
             if (!AFRAME.utils.deepEqual(pointsArray, this.pathPoints) || (oldData !== 'CustomEvent' && !AFRAME.utils.deepEqual(this.data, oldData))) {
                 this.curve = null;
 
                 this.pathPoints = pointsArray;
 
                 // Create Curve
                 switch (this.data.type) {
                     case 'CubicBezier':
                         if (this.pathPoints.length != 4) {
                             throw new Error('The Three constructor of type CubicBezierCurve3 requires 4 points');
                         }
                         this.curve = new THREE.CubicBezierCurve3(this.pathPoints[0], this.pathPoints[1], this.pathPoints[2], this.pathPoints[3]);
                         break;
                     case 'QuadraticBezier':
                         if (this.pathPoints.length != 3) {
                             throw new Error('The Three constructor of type QuadraticBezierCurve3 requires 3 points');
                         }
                         this.curve = new THREE.QuadraticBezierCurve3(this.pathPoints[0], this.pathPoints[1], this.pathPoints[2]);
                         break;
                     case 'Line':
                         if (this.pathPoints.length != 2) {
                             throw new Error('The Three constructor of type LineCurve3 requires 2 points');
                         }
                         this.curve = new THREE.LineCurve3(this.pathPoints[0], this.pathPoints[1]);
                         break;
                     case 'CatmullRom':
                         this.curve = new THREE.CatmullRomCurve3(this.pathPoints);
                         break;
                     case 'Spline':
                         this.curve = new THREE.SplineCurve3(this.pathPoints);
                         break;
                     default:
                         throw new Error('No Three constructor of type (case sensitive): ' + this.data.type + 'Curve3');
                 }
 
                 this.curve.closed = this.data.closed;
 
                 this.el.emit('curve-updated');
             }
         }
 
     },
 
     remove: function () {
         this.el.removeEventListener("curve-point-change", this.update.bind(this));
     },
 
     closestPointInLocalSpace: function closestPoint(point, resolution, testPoint, currentRes) {
         if (!this.curve) throw Error('Curve not instantiated yet.');
         resolution = resolution || 0.1 / this.curve.getLength();
         currentRes = currentRes || 0.5;
         testPoint = testPoint || 0.5;
         currentRes /= 2;
         var aTest = testPoint + currentRes;
         var bTest = testPoint - currentRes;
         var a = this.curve.getPointAt(aTest);
         var b = this.curve.getPointAt(bTest);
         var aDistance = a.distanceTo(point);
         var bDistance = b.distanceTo(point);
         var aSmaller = aDistance < bDistance;
         if (currentRes < resolution) {
 
             var tangent = this.curve.getTangentAt(aSmaller ? aTest : bTest);
             if (currentRes < resolution) return {
                 result: aSmaller ? aTest : bTest,
                 location: aSmaller ? a : b,
                 distance: aSmaller ? aDistance : bDistance,
                 normal: normalFromTangent(tangent),
                 tangent: tangent
             };
         }
         if (aDistance < bDistance) {
             return this.closestPointInLocalSpace(point, resolution, aTest, currentRes);
         } else {
             return this.closestPointInLocalSpace(point, resolution, bTest, currentRes);
         }
     }
 });
 
 
 var tempQuaternion = new THREE.Quaternion();
 
 function normalFromTangent(tangent) {
     var lineEnd = new THREE.Vector3(0, 1, 0);
     tempQuaternion.setFromUnitVectors(zAxis, tangent);
     lineEnd.applyQuaternion(tempQuaternion);
     return lineEnd;
 }
 
 AFRAME.registerShader('line', {
     schema: {
         color: {default: '#ff0000'},
     },
 
     init: function (data) {
         this.material = new THREE.LineBasicMaterial(data);
     },
 
     update: function (data) {
         this.material = new THREE.LineBasicMaterial(data);
     },
 });
 
 AFRAME.registerComponent('draw-curve', {
 
     //dependencies: ['curve', 'material'],
 
     schema: {
         curve: {type: 'selector'}
     },
 
     init: function () {
         this.data.curve.addEventListener('curve-updated', this.update.bind(this));
     },
 
     update: function () {
         if (this.data.curve) {
             this.curve = this.data.curve.components.curve;
         }
 
         if (this.curve && this.curve.curve) {
             var lineGeometry = new THREE.BufferGeometry().setFromPoints(this.curve.curve.getPoints(this.curve.curve.getPoints().length * 10));
             var mesh = this.el.getOrCreateObject3D('mesh', THREE.Line);
             var lineMaterial = mesh.material ? mesh.material : new THREE.LineBasicMaterial({
                 color: "#ff0000"
             });
 
             this.el.setObject3D('mesh', new THREE.Line(lineGeometry, lineMaterial));
         }
     },
 
     remove: function () {
         this.data.curve.removeEventListener('curve-updated', this.update.bind(this));
         this.el.getObject3D('mesh').geometry = new THREE.BufferGeometry();
     }
 
 });
 
 AFRAME.registerPrimitive('a-draw-curve', {
     defaultComponents: {
         'draw-curve': {},
     },
     mappings: {
         curveref: 'draw-curve.curve',
     }
 });
 
 AFRAME.registerPrimitive('a-curve-point', {
     defaultComponents: {
         'curve-point': {},
     },
     mappings: {}
 });
 
 AFRAME.registerPrimitive('a-curve', {
     defaultComponents: {
         'curve': {}
     },
 
     mappings: {
         type: 'curve.type',
     }
 });
 
 AFRAME.registerComponent('follow-path', { //for third person camera//deprecate
     schema: {
         curve: {default: 'a-curve'}, // css selector
         incrementBy: {default: 0.01},
         throttleTo: {default: 100},
     },
     init() {
         this.tick = AFRAME.utils.throttleTick(this.tick, this.data.throttleTo, this);   
         this.curve = document.querySelector(this.data.curve);
         console.log(this.curve);
     },
     currentPercent: 0,
     newPos: {}, // better garbage handling
     tick() {
         this.currentPercent = this.currentPercent > (1 - this.data.incrementBy) ? 0 : this.currentPercent + this.data.incrementBy;
         this.newPos = this.curve.components.curve.curve.getPoint(this.currentPercent);
         this.el.setAttribute('position', this.newPos);        
     },
 });

 AFRAME.registerComponent('matrix_meshes', { //test method for matrix rooms

  schema: {
    init: {default: false},
    roomData: {default: ''}
  },
  init() {
    //loadRoomData is called from connect.js if useMatrix
    var sceneEl = document.querySelector('a-scene');
    this.matrixCalloutEntity = document.createElement("a-entity");
    this.matrixCalloutPanel = document.createElement("a-entity");
    this.matrixCalloutText = document.createElement("a-text");
    this.viewportHolder = document.getElementById('viewportPlaceholder3');
    var cameraPosition = new THREE.Vector3(); 
    this.viewportHolder.object3D.getWorldPosition( cameraPosition );
    this.matrixCalloutPanel.setAttribute("gltf-model", "#landscape_panel");
    // this.matrixCalloutEntity.setAttribute("scale", ".1 .1 .1");
    this.matrixCalloutPanel.setAttribute("scale", ".075 .05 .075");
    this.matrixCalloutEntity.setAttribute("look-at", "#player");
    this.matrixCalloutEntity.setAttribute('visible', false);
    this.dialogEl = document.getElementById('mod_dialog');
    this.selectedAxis = null;
    this.isSelected = false;
    this.hitPosition = null;
    this.mouseDownPos = new THREE.Vector2();
    this.mousePos = new THREE.Vector2();
    this.distance = 0;
    this.roomData = null;
    this.clientX = null;
    this.clientY = null;
    sceneEl.appendChild(this.matrixCalloutEntity);
    this.matrixCalloutEntity.appendChild(this.matrixCalloutPanel);
    this.matrixCalloutEntity.appendChild(this.matrixCalloutText);
    // this.calloutPanel.setAttribute("position", '0 0 1'); 
    this.matrixCalloutText.setAttribute("position", '0 0 .1'); //offset the child on z toward camera, to prevent overlap on model
    this.matrixCalloutText.setAttribute('text', {
      width: .5,
      baseline: "bottom",
      align: "left",
      font: "/fonts/Exo2Bold.fnt",
      anchor: "center",
      wrapCount: 20,
      color: "white",
      value: "wha"
    });
    this.matrixCalloutPanel.setAttribute('overlay');
    this.matrixCalloutText.setAttribute('overlay');

  },
  loadRoomData(roomData) {
  
    this.roomData = roomData.chunk;
    this.roomData.sort((a, b) => (a.num_joined_members < b.num_joined_members) ? 1 : -1);
    // console.log("gots " + this.roomData.length + " rooms from matrix.org :" + JSON.stringify(this.roomData));

    // for (let i = 0; i < this.roomData.length; i++) {
    //   // console.log(this.roomData[i].name);
    // }
  },
  showRoomData(instanceID, distance, hitpoint) {
    // console.log(JSON.stringify(this.data.roomData[instanceID]));

    if (hitpoint != undefined) {
      // console.log(instanceID + " " + distance + " " + JSON.stringify(hitpoint));
      // hitpoint = JSON.parse(hitpoint);
      let x = hitpoint.x;
      let y = hitpoint.y;
      let z = hitpoint.z;
      this.matrixCalloutEntity.setAttribute("position", {"x": x, "y": y, "z": z});
      this.matrixCalloutPanel.setAttribute('visible', true);
      this.matrixCalloutPanel.setAttribute("overlay");
      // this.matrixCalloutEntity.setAttribute("position", hitpoint);
      this.matrixCalloutEntity.setAttribute('visible', true);
      this.matrixCalloutEntity.setAttribute("overlay");
      this.matrixCalloutEntity.setAttribute('scale', {x: distance * .25, y: distance * .25, z: distance * .25} );
      let roomName = "roomName";
      if (this.roomData) {
        roomName = this.roomData[instanceID].name;
      } else {
        GetMatrixData();
      }
      this.matrixCalloutText.setAttribute("value", roomName);
      this.matrixCalloutText.setAttribute("overlay");
    }
  },
  selectRoomData(instanceID) {
    console.log(instanceID);
    if (instanceID != null && this.roomData != null && this.roomData.length > 0) {
      console.log(JSON.stringify(this.roomData[instanceID]));
      let matrixLink = "https://matrix.to/#/"+this.roomData[instanceID].room_id;
      if (!this.dialogEl) {
        this.dialogEl = document.getElementById('mod_dialog');
      } 
      this.dialogEl.components.mod_dialog.showPanel("Join the matrix room " + this.roomData[instanceID].name + "?", "href~https://matrix.to/#/" + this.roomData[instanceID].room_id );
    } else {
      if (!this.roomData) {
        GetMatrixData(); //in connect.js
      }
    }
  },
 });

 /* 
	Note: this component requires mathematical parser library from:
	https://github.com/silentmatt/expr-eval
 */
AFRAME.registerComponent('parametric_curve', {
  schema: 
  {
  // data for curves defined by parametric functions
  xyzFunctions: { type: "array", default: ["cos(t)", "0.1 * t", "sin(t)"] },
  tRange: 	  { type: "array", default: [0, 10], 
          parse: function(value) // convert array of strings to array of floats
          { return value.split(",").map( parseFloat ); } },
  },
  
  eval: function(t)
  {
    return new THREE.Vector3(t,t,t);
  },

  init: function() 
  {
    console.log("tryna do some sketchy eval stuff for parametric curve...");
  // convert strings to functions
  let parser = new Parser();
  let xF = parser.parse(this.data.xyzFunctions[0]);
  let yF = parser.parse(this.data.xyzFunctions[1]);
  let zF = parser.parse(this.data.xyzFunctions[2]);

  this.eval = function( tValue )
  {
    return new THREE.Vector3( 
      xF.evaluate( {t: tValue} ), 
      yF.evaluate( {t: tValue} ), 
      zF.evaluate( {t: tValue} ) 
    );
  }
}

});
/* 
	Note: compatible with aframe-parametric-curve and aframe-compass-curve components
*/
AFRAME.registerComponent("curve-follow",
{
	schema: 
    {
		// reference to entity containing component with curve data
		curveData:      { type: "string",  default: "" },
		// component type that generated curve data
		type:      		{ type: "string",  default: "parametric_curve" },

		// once end of path is reached, restart from beginning?
		loop: {type: "boolean", default: false},

		// time (seconds) required to traverse path
		duration: {type: "number", default: 4},

		// actively follow path?
		enabled: {type: "boolean", default: true},

		// follow path in reverse
		reverse: {type: "boolean", default: false}
    },

    init: function()
	{
		// let entity = document.querySelector(this.data.curveData);
    let entity = document.getElementById('p_path');
		if ( !entity )
		{
			console.error("no element: " + this.data.curveData);
			return;
		}
		let curveComponent = entity.components.parametric_curve; //hardcoded
		if ( !curveComponent )
		{
			console.error(
				"element: " + this.data.curveData +
			 	" does not have component: " + this.data.type );
			return;			
		}


		let f    = curveComponent.eval;
		let tMin = curveComponent.data.tRange[0];
		let tMax = curveComponent.data.tRange[1];

		this.path = function ( u ) 
		{
			// three.js convention:
			// 'u' is a parameter in range [0, 1]; think of 'u' as percent
			// convert 'u' to value in range [tMin, tMax]
			let tValue = tMin + (tMax - tMin) * u;
			
			return f(tValue);
		};

		if ( !this.data.reverse )
		{
			// moving forwards (default), starting time is zero
			this.elapsedTime = 0; 		
		}
		else
		{
			// moving in reverse direction, starting time at maximum and counting down
			this.elapsedTime = this.data.duration;
		}
		
		this.upVector = new THREE.Vector3(0,1,0);
	},

	tick: function(time, deltaTime)
	{
		if ( !this.data.enabled )
			return;
		
		// once elapsedTime is out of bounds, reset (if looping) or return
		if ( this.elapsedTime > this.data.duration || this.elapsedTime < 0)
		{
			if ( this.data.loop )
			{
				if ( !this.data.reverse )
					this.elapsedTime = 0;
				else
					this.elapsedTime = this.data.duration;
			}
			else
				return;
		}

		// convert time (milliseconds) to t (seconds)
		// and take into account reverse direction setting
		if ( !this.data.reverse )
			this.elapsedTime += deltaTime / 1000;
		else
			this.elapsedTime -= deltaTime / 1000;
			
		let percentComplete = this.elapsedTime / this.data.duration;

		// get current position; take into account travel speed (duration)
		let pos = this.path( percentComplete );

		this.el.object3D.position.set( pos.x, pos.y, pos.z );

		let pos2 = this.path( percentComplete + 0.0001 );
		let deltaPos = new THREE.Vector3().subVectors(pos2, pos);

		let rotX = Math.asin( deltaPos.y / deltaPos.length() );
		let rotY = Math.atan2( deltaPos.x, deltaPos.z );

		this.el.object3D.rotation.set( -rotX, 0, 0 );
		this.el.object3D.rotateOnWorldAxis(this.upVector, rotY);
	}
});

AFRAME.registerComponent('rotate-toward-velocity', {
  schema: {},
  tick: function(time, delta) {
      var body = this.el.getAttribute('ammo-body');
      if (body) {
        var obj3D = this.el.object3D;
        var aimP = new THREE.Vector3();
        var velocity = new THREE.Vector3();
        velocity.copy(body.velocity);
        aimP.copy(body.position).sub(velocity);
        obj3D.lookAt(aimP);
        body.quaternion.copy(obj3D.quaternion);
      }
  },
  drawDebugLookAt: function(aimP) {
      // for visualizing the lookat
      // geometry = new THREE.BoxGeometry( 0.1,0.1,0.1);
      // material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
      // mesh = new THREE.Mesh( geometry, material );
      // mesh.position.copy(aimP);
      // var scene = document.getElementById('scene').object3D;
      // scene.add( mesh );
  }

});

AFRAME.registerComponent('mod_curve', {
  schema: {
    init: {default: false},
    isClosed: {default: false},
    eventData: {default: ''}
  },

  init: function () {

    this.loaded = false;

    console.log("tryna make a mod_curve");

    this.newPosition = null; 
    this.tangent = null;
    this.radians = null; 
    this.fraction = 0;

    this.normal = new THREE.Vector3( 0, 1, 0 ); // up
    this.axis = new THREE.Vector3( );
    this.points = [];
    this.speed = .001;

    this.speedMod = 1;
    // this.el.getAttribute("position");

    for (var i = 0; i < 5; i += 1) {
      this.points.push(new THREE.Vector3(0, 0, -100 * (i / 4)));
    }
    this.curve = new THREE.CatmullRomCurve3(this.points);
    this.c_points = this.curve.getPoints( 50 );
    this.c_geometry = new THREE.BufferGeometry().setFromPoints( this.c_points );
    this.c_material = new THREE.LineBasicMaterial( { color: 0x4287f5 } );
    this.curveLine = new THREE.Line( this.c_geometry, this.c_material ); //this one stays a curve

    setTimeout( () => {
      this.isReady = true;
    }, 10000 * Math.random() );
  },
  updateCurve: function() {

    this.curveLine.geometry.attributes.position.needsUpdate = true;
    this.speedmod = Math.random() * (2 - .5) + .5;
    if (this.fraction == 0) {
      this.curve.points[0].x =Math.ceil(Math.random() * 4) * (Math.round(Math.random()) ? 1 : -1);
      this.curve.points[0].y =Math.ceil(Math.random() * 4) * (Math.round(Math.random()) ? 1 : -1);
      this.curve.points[1].x =-Math.ceil(Math.random() * 4) * (Math.round(Math.random()) ? 1 : -1);
      this.curve.points[1].y =-Math.ceil(Math.random() * 4) * (Math.round(Math.random()) ? 1 : -1);
      this.curve.points[2].x =Math.ceil(Math.random() * 4) * (Math.round(Math.random()) ? 1 : -1);
      this.curve.points[2].y =Math.ceil(Math.random() * 4) * (Math.round(Math.random()) ? 1 : -1);
      this.curve.points[3].x =-Math.ceil(Math.random() * 4) * (Math.round(Math.random()) ? 1 : -1);
      this.curve.points[3].y =-Math.ceil(Math.random() * 4) * (Math.round(Math.random()) ? 1 : -1);
    }
    this.fraction += 0.001 * this.speedMod;
    if ( this.fraction > 1) {
      this.fraction = 0;

      //normal.set( 0, 1, 0 );
    }

    
    this.el.object3D.position.copy( this.curve.getPoint( 1 - this.fraction ) ); //or just the fraction to go backwards
       
    this.tangent = this.curve.getTangent( this.fraction );
    this.axis.crossVectors( this.normal, this.tangent ).normalize( );
  
    //radians = Math.acos( normal.dot( tangent ) );	
    //char.quaternion.setFromAxisAngle( axis, radians );
    
    this.el.object3D.quaternion.setFromAxisAngle( this.axis, Math.PI / 2 );
  },
  tick: function () {
    if (this.curve && this.curveLine && this.isReady) {
      // console.log("modding speernd " + this.speed);
      // this.tubeMaterial.map.offset.x += this.speed;
      this.updateCurve();
    }  
  }

});

AFRAME.registerComponent('mod_tunnel', {
  schema: {
    init: {default: false},
    tags: {default: ''},
    
      
  },
  init: function () {
  // if (this.data.markerType == "tunnel") {
    // Create an empty array to stores the points
    // this.tick = AFRAME.utils.throttleTick(this.tick, 100, this);
      this.loaded = false;
      this.verticleez = null;
      this.tubeGeometry_o = null;
      this.tubeGeometry = null;
      this.splineMesh = null;
      this.splineMesh_o = null;
      console.log("tryna make a tunnel");

      this.newPosition = null; 
      this.tangent = null;
      this.radians = null; 
      this.fraction = 0;

      this.normal = new THREE.Vector3( 0, 1, 0 ); // up
      this.axis = new THREE.Vector3( );
      this.points = [];
      this.speed = .001;
      // Define points along Z axis
      for (var i = 0; i < 5; i += 1) {
      this.points.push(new THREE.Vector3(0, 0, -100 * (i / 4)));
      }

      this.curve = new THREE.CatmullRomCurve3(this.points);
      this.c_points = this.curve.getPoints( 50 );
      // // this.c_geometry = new THREE.BufferGeometry().setFromPoints( this.c_points );//won't work with fatlines...
      this.c_geometry = new THREE.BufferGeometry().setFromPoints( this.c_points );

      this.c_material = new THREE.LineBasicMaterial( { color: 0x4287f5 } );

      this.curveLine = new THREE.Line( this.c_geometry, this.c_material ); //this one stays a curve

      const cgeometry = new THREE.BoxGeometry( 1, 1, 1 );
      const cmaterial = new THREE.MeshPhongMaterial( { color: 0x99ffff, wireframe: false } );
      this.objectToCurve = new THREE.Mesh( cgeometry, cmaterial );
    
      let picGroupMangler = document.getElementById("pictureGroupsData");

      if (picGroupMangler != null && picGroupMangler != undefined) {

        this.tileablePicData = picGroupMangler.components.picture_groups_control.returnTileableData();
        // console.log(JSON.stringify(this.skyboxData));
        
        this.texture = new THREE.TextureLoader().load(
          this.tileablePicData.images[0].url
          //todo onload do stuff below
          );
        this.texture.encoding = THREE.sRGBEncoding;
       // Empty geometry
      this.geometry = new THREE.BufferGeometry();
      // Create vertices based on the curve
      this.vertArray = this.curve.getPoints(70);

      this.geometry = new THREE.BufferGeometry().setFromPoints( this.curve.getPoints(70) );

      this.splineMesh = new THREE.Line(this.geometry, new THREE.LineBasicMaterial()); //another line to mod the vertexes


      this.tubeGeometry = new THREE.TubeBufferGeometry(this.curve, 70, 5, 50, false);
      this.tubeMaterial = new THREE.MeshStandardMaterial({
      side: THREE.BackSide, // Since the camera will be inside the tube we need to reverse the faces
      map: this.texture, 
      transparent: true
      });
      // Repeat the pattern to prevent the texture being stretched
      this.tubeMaterial.map.wrapS = THREE.RepeatWrapping;
      this.tubeMaterial.map.wrapT = THREE.RepeatWrapping;
      this.tubeMaterial.map.repeat.set(4, 2);

      // Create a mesh based on tubeGeometry and tubeMaterial
      this.tubeMesh = new THREE.Mesh(this.tubeGeometry, this.tubeMaterial);

      // Add the tube into the scene
      this.el.sceneEl.object3D.add(this.tubeMesh);
      this.el.sceneEl.object3D.add(this.splineMesh);
      this.el.sceneEl.object3D.add(this.curveLine);
      this.el.sceneEl.object3D.add(this.objectToCurve);
      this.loaded = true;
      this.tubeGeometry_o = this.tubeGeometry.clone();
      this.splineMesh_o = this.splineMesh.clone();
    } else {
      console.log("no pic");
    }

      // }
    },
    // from https://github.com/Mamboleoo/InfiniteTubes/blob/master/js/demo6.js
    updateCurve: function() {
      var index = 0,
      vertice_o = null,
      vertice = null;
      this.verticleez_old = this.tubeGeometry_o.attributes.position.array; //for reference
      this.verticleez = this.tubeGeometry.attributes.position.array;
      this.splineVerts = this.splineMesh.geometry.attributes.position.array;
      this.splineVerts_o = this.splineMesh_o.geometry.attributes.position.array;
      this.vert = null;
      var x = 0;
      var y = 0;
      var z = 0
      var index = 0;

      // For each vertice of the tube, move it a bit based on the spline
      for (var i = 0, j = this.tubeGeometry.attributes.position.array.length; i < j; i += 3) {
        // if (i % 3) { //ignore the z?
        // Get the original tube vertice
        // vertice_o = this.tubeGeometry_o.geometry.attributes.position.array[i];
        // Get the visible tube vertice
        // vertice = this.verticleez[i];
        // if (vertice != 0) {
        // console.log("vertice: " + JSON.stringify(vertice));
        // Calculate index of the vertice based on the Z axis
        // The tube is made of 30 circles of vertices
        // index = Math.floor(i / this.splineVerts.length);
        // Update tube vertice

          // this.verticleez[i] += ((this.verticleez_old[i] + this.splineVerts[index]) - this.verticleez[i]) / 10;  //maybe
          // this.verticleez[i+1] += ((this.verticleez_old[i + 1] + this.splineVerts[index + 1]) - this.verticleez[i + 1]) / 5;

        // vertice.x += ((vertice_o.x + this.splineMesh.geometry.vertices[index].x) - vertice.x) / 10;
        // vertice.y += ((vertice_o.y + this.splineMesh.geometry.vertices[index].y) - vertice.y) / 5;

          // this.verticleez[i] += ((this.verticleez_old[i] + Math.random()/2) - this.verticleez[i]) / 10; 
          // this.verticleez[i+1] += ((this.verticleez_old[i + 1] + Math.random()/2) - this.verticleez[i+1]) / 5;

        // this.vert = this.tubeGeometry_o.attributes.position.array[i] += (Math.random() * .1);
        // console.log("this.vert " + this.vert);
        // this.tubeGeometry.attributes.position.array[i] = this.vert;
        // vertice.y += Math.random();
        // vertice.x += ((vertice_o.x + .5) - vertice.x) / 10;
        // vertice.y += ((vertice_o.y + .5) - vertice.y) / 5;
        // }
        }
      
      // Warn ThreeJs that the points have changed
      this.tubeGeometry.attributes.position.needsUpdate = true; //not

      this.tubeGeometry.computeVertexNormals();

      this.splineMesh.geometry.attributes.position.needsUpdate = true;
      
      this.curveLine.geometry.attributes.position.needsUpdate = true;
    

      for (let i = 0; i < this.splineVerts.length; i += 3) {


        this.splineVerts[i] = this.splineVerts_o[i] + (( Math.random() - 0.5 ) / 4) - this.splineVerts[i];
        // this.splineVerts[i + 1] += ( Math.random() - 0.5 ) / 2;
        this.splineVerts[i + 1] = this.splineVerts_o[i + 1] + (( Math.random() - 0.5 ) / 4) - this.splineVerts[i + 1];
        // this.splineVerts[i + 2] += ( Math.random() - 0.5 ) * 3;

      }
      this.splineMesh.geometry.attributes.position.needsUpdate = true;
      // this.curve.attributes.needsUpdate = true;

      // this.flow.moveAlongCurve(.06);
      // this.flow.object3D.needsUpdate = true;

      if (this.fraction == 0) {
        // this.curve.points[0].x = -Math.random() * 2;
        // this.curve.points[2].x = -Math.random() * 2;
        // this.curve.points[3].y = -Math.random() * 2;
        // this.curve.points[4].y = Math.random()  * 2;
        this.curve.points[0].x =Math.ceil(Math.random() * 2) * (Math.round(Math.random()) ? 1 : -1);
        this.curve.points[0].y =Math.ceil(Math.random() * 2) * (Math.round(Math.random()) ? 1 : -1);
        this.curve.points[1].x =-Math.ceil(Math.random() * 2) * (Math.round(Math.random()) ? 1 : -1);
        this.curve.points[1].y =-Math.ceil(Math.random() * 2) * (Math.round(Math.random()) ? 1 : -1);
        this.curve.points[2].x =Math.ceil(Math.random() * 2) * (Math.round(Math.random()) ? 1 : -1);
        this.curve.points[2].y =Math.ceil(Math.random() * 2) * (Math.round(Math.random()) ? 1 : -1);
        this.curve.points[3].x =-Math.ceil(Math.random() * 2) * (Math.round(Math.random()) ? 1 : -1);
        this.curve.points[3].y =-Math.ceil(Math.random() * 2) * (Math.round(Math.random()) ? 1 : -1);
      }
      this.fraction += 0.001;
      if ( this.fraction > 1) {
        this.fraction = 0;

        //normal.set( 0, 1, 0 );
      }
      // if (Math.random() > .9) {
        
      // }
      
      this.objectToCurve.position.copy( this.curve.getPoint( 1 - this.fraction ) );
         
      this.tangent = this.curve.getTangent( this.fraction );
      this.axis.crossVectors( this.normal, this.tangent ).normalize( );
    
      //radians = Math.acos( normal.dot( tangent ) );	
      //char.quaternion.setFromAxisAngle( axis, radians );
      
      this.objectToCurve.quaternion.setFromAxisAngle( this.axis, Math.PI / 2 );
      
      
      // this.geometry = new THREE.BufferGeometry().setFromPoints( this.curve.getPoints(70) );
      // geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        // Create a line from the points with a basic line material
      // this.splineMesh = new THREE.Line(this.geometry, new THREE.LineBasicMaterial());
      // this.spline.attributes.position.needsUpdate = true;
        // for ( var i = 0, l = this.splineVerts; i < l; i ++ ) {

        //   this.splineVerts[ index ++ ] = x;
        //   this.splineVerts[ index ++ ] = y;
        //   this.splineVerts[ index ++ ] = z;
      
        //   x += ( Math.random() - 0.5 ) * 3;
        //   y += ( Math.random() - 0.5 ) * 3;
        //   z += ( Math.random() - 0.5 ) * 3;
      
        // }
        // this.splineMesh.geometry.attributes.position.array = this.curve.getPoints(70);

    },
    tick: function () {
      if (this.loaded && this.tubeGeometry && this.tubeMaterial) {
        // console.log("modding speernd " + this.speed);
        this.tubeMaterial.map.offset.x += this.speed;
        this.updateCurve();
      }
      
    }
})
