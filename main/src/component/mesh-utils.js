import {MeshSurfaceSampler} from '/three/examples/jsm/math/MeshSurfaceSampler.js'; //can because "type=module"

/* global AFRAME, THREE */

AFRAME.registerComponent('instanced_meshes_sphere', { //scattered randomly, not on surface
  schema: {

    _id: {default: ''},
    modelID: {default: ''},
    count: {default: 100},
    scaleFactor: {default: 10},
    interaction: {default: ''}
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
  // this.el.setAttribute('gltf-model', gltfs[0]);
  
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
    // console.log("envMap path " + this.path);
    this.textureArray.push(this.path);
    }
  }
  if (this.textureArray.length == 6) {
    this.texture = new THREE.CubeTextureLoader().load(this.textureArray);
    this.texture.format = THREE[data.format];
  //   this.material = new THREE.MeshBasicMaterial
  //   this.material = new THREE.MeshStandardMaterial( { color: '#63B671', envMap: this.texture } ); 
    this.material.envMap = this.texture;  
    this.material.envMapIntensity = .5;      
  //   this.material.reflectivity = 1;
    this.material.roughness = .15;
    
  //   this.material.metalness = .1;
  //   this.material.emissive = new THREE.Color("white");
  //   this.material.emissiveIntensity = .01;
    this.material.needsUpdate = true;
  }


      this.iMesh = new THREE.InstancedMesh(this.geometry, this.material, count);
      
      let position = new THREE.Vector3()
      let quat = new THREE.Quaternion();
      let scale = new THREE.Vector3();

      let euler = new THREE.Euler(Math.PI, 0, 0, "ZYX");
      let radius = this.data.scaleFactor * 10 + (count/2);
      this.clock = new THREE.Clock();
        
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
      this.raycaster = null;
      this.intersection = null;
      this.hitpoint = null;
      let that = this;
      window.addEventListener('click', function () {
        console.log(that.instanceId);
        that.instance_clicked(that.instanceId);
      }); 
      // let playerElC = document.querySelector("#player").components;
      // // console.log("playerEl" + this.playerEl);
      // this.posRotReader = playerElC.get_pos_rot; 
      // console.log("this.posRotReader " + this.posRotReader);

      // this.el.addEventListener('raycaster-intersected', e =>{  //no because each little thing can't have a class attached
      //     this.raycaster = e.detail.el;
      //     // thiz.raycaster = this.raycaster;
      //     // this.intersection = this.raycaster.components.raycaster.getIntersection(this.el, true);
      //     // this.hitpoint = this.intersection.point;
      //     console.log(this.hitpoint);
      //     // console.log('ray hit', this.intersection.point);
      //     // if (!this.intersection.object.name.includes("screen") &&
      //     //     !this.intersection.object.name.includes("background") &&
      //     //     !this.intersection.object.name.includes("fastforward") &&
      //     //     !this.intersection.object.name.includes("rewind") &&
      //     //     !this.intersection.object.name.includes("previous") &&
      //     //     !this.intersection.object.name.includes("next") &&
      //     //     !this.intersection.object.name.includes("handle") &&
      //     //     !this.intersection.object.name.includes("play") &&
      //     //     !this.intersection.object.name.includes("pause")) {
      //     //     this.raycaster = null;
      //     // } else {
      //         // thiz.mouseOverObject = this.intersection.object.name;      
      //         // this.hitpoint = intersection.point;   
      //         // console.log('ray hit', this.intersection.object.name, thiz.mouseOverObject );
      //     // }
      //     this.intersection = this.raycaster.intersectObject( this.iMesh );
      //     });
      //     this.el.addEventListener("raycaster-intersected-cleared", () => {
      //         // console.log("intersection cleared");
      //         this.raycaster = null;
      //         this.intersection = null;
      //     });
      // if (iMesh == null) {
      //   this.iMesh = iMesh;
      // }
      // this.el.addEv 

    },
    tick: function(time, timeDelta) {
      // this.timeDelta = timeDelta;
      this.time = time;
      if (this.iMesh != null) {
        // console.log(this.posRotReader );
        if (!this.raycaster || this.raycaster == null || this.raycaster == undefined) {
            return;
        } else {
          this.raycaster.setFromCamera( mouse, AFRAME.scenes[0].camera );
          this.intersection = this.raycaster.intersectObject( this.iMesh );
        }
        // 
       

        if ( this.intersection != null && this.intersection.length > 0 ) {
          if (window.playerPosition != null && window.playerPosition != undefined && this.intersection[0].point != undefined && this.intersection[0].point != null ) {
            // let distanq = window.playerPosition.distanceTo(this.intersection[0].point);
            // this.playerPosition = document.getElementById("player").component.get_pos_rot.returnPosRot();
            // console.log("intersection! " + this.intersection[ 0 ].instanceId + " distance " + window.playerPosition.distanceTo(this.intersection[0].point));
            // if (distanq) {

              this.instanceId = this.intersection[ 0 ].instanceId;

              this.iMesh.setColorAt( this.instanceId, this.highlightColor.setHex( Math.random() * 0xffffff ) );
              this.iMesh.instanceColor.needsUpdate = true;
              // console.log('windowplayerposition ' + JSON.stringify(window.playerPosition));
              this.rayhit(this.intersection[ 0 ].instanceId, window.playerPosition.distanceTo(this.intersection[0].point), this.intersection[0].point);

            // }
          }

          // cameraPosition = posRotObj.pos;
          // if (this.intersection[0] != null) {
          //   this.instanceId = this.intersection[ 0 ].instanceId;
            
          //   this.iMesh.setColorAt( this.instanceId, this.highlightColor.setHex( Math.random() * 0xffffff ) );
          //   this.iMesh.instanceColor.needsUpdate = true;
          // }
        } else {
          this.hitID = null;
          this.instanceId = null;
        }

        this.iMesh.rotation.x -= this.speed * 2;
        this.iMesh.rotation.y -= this.speed;
        this.iMesh.rotation.z -= this.speed * 3;
        // this.iMesh.

      }
    },
    rayhit: function (hitID, distance, hitpoint) {
      if (this.hitID != hitID) {
        
        this.intersection = null;
        // this.raycaster = null;

        this.hitID = hitID;
        console.log("new hit " + hitID + " " + distance + " " + JSON.stringify(hitpoint) + " interaction:" + this.data.interaction);
        var triggerAudioController = document.getElementById("triggerAudio");
        if (triggerAudioController != null) {
          triggerAudioController.components.trigger_audio_control.playAudioAtPosition(hitpoint, distance);
        }

      }
      // let scale = Math.random() * this.data.scaleFactor;
        // dummy.position.set( x, y, z );
        // dummy.scale.set(scale,scale,scale);

        // if (this.timeDelta >= 3.0)
        // {
        //     clock = new THREE.Clock;
        //     mesh.scale.set(1,1,1);
        // }
        // else
        // {
        //     mesh.scale.x = 1-(t/3.0);
        //     mesh.scale.y = 1-(t/3.0);
        //     mesh.scale.z = 1-(t/3.0);   
        // }
        // this.delta += this.deltaTime;
      // console.log("time : " + this.time);
      if (this.data.interaction == "growpop") {
        this.iMesh.getMatrixAt(hitID, this.dummyMatrix);
        this.dummyMatrix.decompose(this.dummy.position, this.dummy.quaternion, this.dummy.scale);
        console.log(parseFloat(this.dummy.scale.x) + " vs " + (parseFloat(this.data.scaleFactor) * 3));
      if (parseFloat(this.dummy.scale.x) > (parseFloat(this.data.scaleFactor) * 2)) {
        console.log("tryna lcik!");
        this.instance_clicked(hitID);
      } else {
        this.scaletmp = this.dummy.scale.x + Math.abs(Math.sin(this.time));
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
      if (parseFloat(this.dummy.scale.x) < (parseFloat(this.data.scaleFactor) / 2)) {
        console.log("tryna lcik!");
        this.instance_clicked(hitID);
      } else {
        this.scaletmp = this.dummy.scale.x - Math.abs(Math.sin(this.time));
        this.dummy.scale.set( this.scaletmp, this.scaletmp, this.scaletmp );
        this.dummy.updateMatrix();
        this.iMesh.setMatrixAt( this.hitID, this.dummy.matrix );
        this.iMesh.frustumCulled = false;
        this.iMesh.instanceMatrix.needsUpdate = true;
        }
      }
      
    },
    instance_clicked: function (id) {
      if (id != null && this.intersection != null) {
      this.dummy.scale.set( 0, 0, 0 );
      this.dummy.updateMatrix();
      console.log(id + " beez clicked!");
      this.iMesh.setMatrixAt( id, this.dummy.matrix );
      this.iMesh.frustumCulled = false;
      this.iMesh.instanceMatrix.needsUpdate = true;
      var triggerAudioController = document.getElementById("triggerAudio");
        if (triggerAudioController != null) {
          triggerAudioController.components.trigger_audio_control.playAudioAtPosition(window.playerPosition, 1);
          }
        // this.iMesh.position.set(id, 0, 0, -100);
      }
    }
});


AFRAME.registerComponent('instanced_surface_meshes', {
  schema: {
    _id: {default: ''},
    modelID: {default: ''},
    count: {default: 2000},
    scaleFactor: {default: 4},
    yMod: {default: 0}
  },
  init: function () {
     let initialized = false;
     let clickCount = 0;
      this.surfaceMesh = null;
      this.scatterModel = null;
      this.sampleGeometry = null;
      this.sampleMaterial = null;
      // var dummy = new THREE.Object3D();
      this.iMesh = null;
      console.log("model this.data._id " + this.data._id + " tryna instance " + this.data.count);
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
      let that = this;
    let surfaceEl = document.getElementById('scatterSurface');  
    surfaceEl.addEventListener('surfaceLoaded', function (event) {
      console.log("SURFACE EVENT LOADEDD");
      that.surface(that.sampleGeometry, that.sampleMaterial);
    });
  },

  surface: function(geo, mat) {
    let thiz = this;
    thiz.sampleGeometry = geo;
    thiz.sampleMaterial = mat;
    //set by location.eventData
        // setTimeout(function(){console.log("done waiting for obj ") }, 3000);
          // timekey = parseFloat(timekeys[timeKeysIndex]);
          // console.log(timekey);
      this.surfaces = document.getElementsByClassName("surface");
      console.log("surfaces found " + this.surfaces.length);
      if (this.surfaces.length > 0) {
        this.surface = this.surfaces[0];
        // this.surface.addEventListener('loaded', (e) => {
        // let obj = this.surface.getObject3D();
        // let interval = setInterval(function () {
        if (this.surface.getObject3D('mesh') != null) {
            this.surface.getObject3D('mesh').traverse(node => {
              if (node.isMesh) {
                this.surfaceMesh = node;    
                // clearInterval(interval);
                this.scatter(this.surfaceMesh, thiz.sampleGeometry, thiz.sampleMaterial);
                }
              });
            }
        // }, 1000);
    } 
        // console.log("surfaces found " + this.surfaces.length);
        // if (this.surfaces.length > 0) {
        //   this.surface = this.surfaces[0];
        //   this.surface.addEventListener('loaded', (e) => {

        //     let obj = this.surface.getObject3D('mesh');
        //     obj.traverse(node => {
        //       if (node.isMesh) {
        //         this.surfaceMesh = node;
                

        //         this.scatter(this.surfaceMesh, thiz.sampleGeometry, thiz.sampleMaterial);
        //       }
        //       });
        //     });
        //   }
    
    },
    // setSurface: function ()
    scatter: function (surface, geo, mat) {
        console.log("tryna scatter!@");
        let that = this;

        that.sampleGeometry = geo;
        that.sampleMaterial = mat;
        that.surfaceMesh = surface;
      // this.surface.setAttribute("activeObjexRay");
      console.log('surfacemesh name ' + that.surfaceMesh);

        var dummy = new THREE.Object3D();
        const count = this.data.count;
    
        const sampler = new MeshSurfaceSampler( that.surfaceMesh ) // noice!
        .build();
          this.iMesh = new THREE.InstancedMesh(that.sampleGeometry, that.sampleMaterial, count);
          let position = new THREE.Vector3();
          for (var i=0; i<count; i++) {

            sampler.sample( position )

            let scale = Math.random() * this.data.scaleFactor;
            // console.log("scale " + scale);
            dummy.position.set(  position.x,position.y + this.data.yMod,position.z );

            dummy.scale.set(scale,scale,scale);
            
            dummy.rotation.y = (Math.random() * 360 ) * Math.PI / 180;

            dummy.updateMatrix();

            this.iMesh.setMatrixAt( i ++, dummy.matrix );
  
          }
  
              this.iMesh.frustumCulled = false;
              this.iMesh.instanceMatrix.needsUpdate = true;
              
              sceneEl.object3D.add(this.iMesh);

      }


    // }
  // }

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


AFRAME.registerComponent('targeting_raycaster', {

  init: function () {
    this.doTheThing = false;
    this.raycaster = null;
    this.intersection = null;
    this.hitpoint = null;
  this.el.addEventListener('raycaster-intersected', e =>{  
    if (this.video != undefined) {
      this.raycaster = e.detail.el;
      thiz.raycaster = this.raycaster;
      this.intersection = this.raycaster.components.raycaster.getIntersection(this.el);
      hitpoint = this.intersection.point;
      
      console.log('ray hit', this.intersection.point, this.intersection.object.name);
    if (!this.intersection.object.name.includes("screen")) {
        this.raycaster = null;
        mouseOverObject = null;

    } else {
        mouseOverObject = this.intersection.object.name;      
        // this.hitpoint = intersection.point;   
        console.log('ray hit', this.intersection.point, this.intersection.object.name, mouseOverObject );
        }
      }
    });
  this.el.addEventListener("raycaster-intersected-cleared", () => {
    this.raycaster = null;
    });
  },
  tick: function () {
   
  }
});

AFRAME.registerComponent('scatter-surface', {
  init: function () {
    let that = this;
    this.el.addEventListener('model-loaded', (event) => {
      console.log("SCATTER SURFACE LOADED");
      setTimeout(function(){ that.el.emit('surfaceLoaded', true);   }, 2000);// put some fudge, wait a bit for scatter meshes to load before firing
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
    isSelected: {default: false}

  },
  init: function () {
    this.timestamp = this.data.timestamp;
    if (this.timestamp == '') {
      this.timestamp = Math.round(Date.now() / 1000).toString();
      this.data.timestamp = this.timestamp;
    }
    // this.el.id = "placeholder_" + this.timestamp;
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

    this.clientX = 0;
    this.clientY = 0;
    
    let thisEl = this.el;

    this.el.classList.add('activeObjexRay');
    this.el.classList.add('activeObjexGrab');

    
   
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
      wrapCount: 16,
      color: "white",
      value: "wha"
    });
    let theElement = this.el;
    // this.el.setAttribute('skybox-env-map');
    // 
      this.phID = room + '~localmarker~' + this.timestamp;
      this.el.id = this.phID;
      // this.el.addEventListener('model-loaded', () => {
      // console.log("looking for localplaceholder " + localStorage.getItem(this.phID));

      this.storedVars = JSON.parse(localStorage.getItem(this.phID));
        if (this.storedVars != null) {
          if (this.storedVars.model == null || this.storedVars.model == undefined || this.storedVars.model == "none") {
            console.log(this.phID + " storedVars " + JSON.stringify(this.storedVars));
            if (this.storedVars.markerType.toLowerCase() == "placeholder") {
              this.el.setAttribute('gltf-model', '#placeholder');
            } else if (this.storedVars.markerType.toLowerCase() == "poi") {
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
    
    this.el.addEventListener('mouseenter', function (evt) {
      if (posRotReader != null) {
        this.playerPosRot = posRotReader.returnPosRot(); 
        window.playerPosition = this.playerPosRot.pos; 
      } else {
        posRotReader = document.getElementById("player").components.get_pos_rot; 
        this.playerPosRot = posRotReader.returnPosRot(); 
        window.playerPosition = this.playerPosRot.pos; 
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
        if (player != null)
        that.distance = window.playerPosition.distanceTo(pos);

        that.rayhit(evt.detail.intersection.object.name, that.distance, evt.detail.intersection.point);

          that.selectedAxis = name;

          let elPos = that.el.getAttribute('position');
        if (!name.includes("handle")) {
          console.log("trna scale to distance :" + that.distance)
          that.calloutEntity.setAttribute("position", pos);
          that.calloutEntity.setAttribute('visible', true);
          that.calloutEntity.setAttribute('scale', {x: that.distance * .20, y: that.distance * .20, z: that.distance * .20} );
          let theLabel = that.data.label != undefined ? that.data.label : that.data.name;
          let calloutString = theLabel;
          if (that.calloutToggle) { //show pos every other time
            // calloutString = "x : " + elPos.x.toFixed(2) + "\n" +"y : " + elPos.y.toFixed(2) + "\n" +"z : " + elPos.z.toFixed(2);
            calloutString = that.data.description != '' ? that.data.description : theLabel;
          }
          that.calloutText.setAttribute("value", calloutString);
            
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
      console.log("tryna mouseup local ph");
      // that.isSelected = false;

      // isSelected = false;
      if (that.data.markerType.toLowerCase() == "placeholder") {
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
  loadModel: function (modelID) { //local model swap
    console.log("tryna load modeID " + modelID);
    if (modelID != undefined) { 
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
          triggerAudioController.components.trigger_audio_control.playAudioAtPosition(hitpoint, distance);
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
    // if (!this.data.isNew) {
      // this.phID = room + '_cloudmarker_' + this.data.timestamp;
      // this.el.id = this.phID;
      // this.el.setAttribute('id', this.phID);
      
      this.phID = this.data.phID;
      // console.log("cloudmarker phID " + this.phID); 
      this.storedVars = JSON.parse(localStorage.getItem(this.phID));
      if (this.storedVars != null) {
        // console.log(this.phID + " storedVars " + JSON.stringify(this.storedVars));
        
        this.el.setAttribute('position', {x: this.storedVars.x, y: this.storedVars.y, z: this.storedVars.z});
        this.el.setAttribute('rotation', {x: this.storedVars.eulerx, y: this.storedVars.eulery, z: this.storedVars.eulerz});
        this.el.setAttribute('scale', {x: this.storedVars.scale, y: this.storedVars.scale, z: this.storedVars.scale });
        this.data.description = this.storedVars.description;


        if (this.storedVars.modelID != null && this.storedVars.modelID != undefined && this.storedVars.model != "none") {
          for (let i = 0; i < sceneModels.length; i++) {
            if (sceneModels[i]._id == this.storedVars.modelID) {
              this.el.setAttribute("gltf-model", sceneModels[i].url); //TODO get an asset ID instead?
              console.log("tryna set locModel for cloudmarker " + sceneModels[i].url);
            }
          }
        } else if (this.storedVars.markerType.toLowerCase() == "placeholder") {
          this.el.setAttribute('gltf-model', '#savedplaceholder');
        } else if (this.storedVars.markerType.toLowerCase() == "poi") {
          this.el.setAttribute('gltf-model', '#poi1');
        } else if (this.storedVars.markerType.toLowerCase() == "mailbox") {
          this.el.setAttribute('gltf-model', '#mailbox');
        }

        if (this.storedVars.scale != null && this.storedVars.scale != undefined && this.storedVars.scale != "none") {
          this.storedVars.scale = 1;
        }
        this.data.label = this.storedVars.label;
        this.data.name = this.storedVars.name;
        this.data.markerType = this.storedVars.markerType;
      } else {
        
        // else { //new ls key for cloud placeholder
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
          locItem.phID = this.phID;

          // storedVars = locItem;
        // }
        localStorage.setItem(this.phID, JSON.stringify(locItem)); 
        if (this.data.modelID != "none") {
          for (let i = 0; i < sceneModels.length; i++) {
            if (sceneModels[i]._id == this.data.modelID) {
              this.el.setAttribute("gltf-model", sceneModels[i].url);
              this.el.setAttribute('scale', {x: this.data.scale, y: this.data.scale, z: this.data.scale });
            }
          }
        } else {

        }
      }
    if (this.data.markerType.toLowerCase() == "placeholder") {
      this.el.setAttribute('gltf-model', '#savedplaceholder');
    } else if (this.data.markerType.toLowerCase() == "poi") {
      this.el.setAttribute('gltf-model', '#poi1');
    } else if (this.data.markerType.toLowerCase() == "mailbox") {
      this.el.setAttribute('gltf-model', '#mailbox');
    }
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
    // this.calloutText = calloutText;
    // calloutText.setAttribute('overlay');
    // gltf-model=\x22#square_panel\x22
    this.calloutPanel.setAttribute("gltf-model", "#landscape_panel");
    this.calloutPanel.setAttribute("scale", ".1 .075 .1");
    // this.calloutEntity.getObject3D("mesh").scale()
    this.calloutEntity.setAttribute("look-at", "#player");
    this.calloutEntity.setAttribute('visible', false);
    this.selectedAxis = null;
    this.isSelected = false;
    this.hitPosition = null;
    this.mouseDownPos = new THREE.Vector2();
    this.mousePos = new THREE.Vector2();
    this.distance = 0;
    // calloutEntity.setAttribute("render-order", "hud");
    sceneEl.appendChild(this.calloutEntity);
    this.calloutEntity.appendChild(this.calloutPanel);
    this.calloutEntity.appendChild(this.calloutText);
    this.calloutPanel.setAttribute("position", '0 0 1'); 
    
    // this.calloutText.setAttribute("size", ".1 .1 .1");
    this.calloutText.setAttribute("position", '0 0 1.25'); //offset the child on z toward camera, to prevent overlap on model
    this.calloutText.setAttribute('text', {
      width: .5,
      baseline: "bottom",
      align: "left",
      font: "/fonts/Exo2Bold.fnt",
      anchor: "center",
      wrapCount: 16,
      color: "white",
      value: "wha"
    });
   
    this.calloutToggle = false;
    let that = this;
    // that.calloutEntity = this.calloutEntity;
    // that.calloutText = this.calloutText;

    this.el.addEventListener('mouseenter', function (evt) {
      
      if (posRotReader != null) {
        this.playerPosRot = posRotReader.returnPosRot(); 
        window.playerPosition = this.playerPosRot.pos; 
      } else {
          posRotReader = document.getElementById("player").components.get_pos_rot; 
          this.playerPosRot = posRotReader.returnPosRot(); 
          window.playerPosition = this.playerPosRot.pos; 
      }
      // console.log("playerPOsition  " + JSON.stringify(window.playerPosition));
      // console.log("playerPOsition  " + window.playerPosition);

      if (!that.isSelected) {
        this.clientX = evt.clientX;
        this.clientY = evt.clientY;
        // console.log("tryna mouseover placeholder");
        that.calloutToggle = !that.calloutToggle;
        let pos = evt.detail.intersection.point; //hitpoint on model
        that.hitPosition = pos;
        let name = evt.detail.intersection.object.name;
        that.distance = window.playerPosition.distanceTo(pos);
        that.rayhit(evt.detail.intersection.object.name, that.distance, evt.detail.intersection.point);
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

        // let elPos = that.el.getAttribute('position');
        // console.log(pos);
        if (!name.includes("handle")) {
          // console.log("tryna show the callout");
          that.calloutEntity.setAttribute("position", pos);
          that.calloutEntity.setAttribute('visible', true);
          that.calloutEntity.setAttribute('scale', {x: that.distance * .20, y: that.distance * .20, z: that.distance * .20} );
          let theLabel = that.data.label != undefined ? that.data.label : that.data.name;
          let calloutString = theLabel;
          if (that.calloutToggle) {
            // calloutString = "x : " + elPos.x.toFixed(2) + "\n" +"y : " + elPos.y.toFixed(2) + "\n" +"z : " + elPos.z.toFixed(2);
            calloutString = that.data.description != '' ? that.data.description : theLabel;
          }
          that.calloutText.setAttribute("value", calloutString);
        }
      }
    });
    this.el.addEventListener('mouseleave', function (evt) {
      // console.log("tryna mouseexit");
      that.selectedAxis = null;
      // this.deselect();
      if (that.selectedAxis != null) {
        console.log(that.selectedAxis);
        // if (!that.selectedAxis.includes('handle')) {
        //   that.isSelected = false;
        // }
      }
      that.calloutEntity.setAttribute('visible', false);
    });

    this.el.addEventListener('mousedown', function (evt) {

      that.isSelected = true;
      // that.hitPosition = evt.detail.intersection.point;

      console.log("tryna mousedouwn" + this.mouseDownPos);
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
      
    });
    this.el.addEventListener('mouseup', function (evt) {
      // console.log("tryna mousedouwn");
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
        } 
        AddLocalMarkers();
        if (that.isSelected && that.selectedAxis != null) {
          ShowLocationModal(that.phID); 
        }
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
  loadModel: function (modelID) {
    console.log("tryna load modeID " + modelID);
    // console.log("tryna load modeID " + modelID);
    if (modelID != undefined) {
      for (let i = 0; i < sceneModels.length; i++) {
        if (sceneModels[i]._id == modelID) {
          this.el.setAttribute("gltf-model", sceneModels[i].url);
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
            console.log("gotsa audio trigger controller");
            triggerAudioController.playAudioAtPosition(hitpoint, distance);
          }
         
        }
      }
    }

});



AFRAME.registerComponent('mod_physics', {
  schema: {
    model: {default: ''},
    isTrigger: {default: false},
    body: {type: 'string', default: 'dynamic'},  // dynamic: A freely-moving object
    shape: {type: 'string', default: 'mesh'},  // hull: Wraps a model in a convex hull, like a shrink-wrap
  },
  init() {
    console.log("tryna load ashape with trigger " + this.data.isTrigger);
    this.el.addEventListener('body-loaded', () => {  

      if (this.data.isTrigger) {
        console.log("TRIGGER LOADED");
        this.el.setAttribute('ammo-shape', {type: "sphere"});
      } else {
        this.el.setAttribute('ammo-shape', {type: this.data.shape});
      }
      // this.el.body.setCollisionF
      // console.log("ammo shape is " + JSON.stringify(this.el.getAttribute('ammo-shape')));
    });
    // this.el.setAttribute('ammo-body', {type: this.data.body});
    // if (this.data.isTrigger) {
    //   console.log("TRIGGER LOADED");
    //   // this.el.setObject3D("mesh", null); 
    //   // this.el.setAttribute('gltf-model', '#poi1');
     
    // } 


    this.el.addEventListener('model-loaded', () => {
      if (this.data.isTrigger) {
        this.el.setAttribute('ammo-body', {type: "kinematic", emitCollisionEvents: true});
      } else {
        this.el.setAttribute('ammo-body', {type: this.data.body, emitCollisionEvents: true});
        
        // this.el.setAttribute('collision-filter', {collisionForces: false});
        console.log("ammo body is " + JSON.stringify(this.el.getAttribute('ammo-body')));
        // this.loadShape();
      }
    });
    


    this.el.addEventListener("collidestart", (e) => {
      e.preventDefault();
      // console.log("mod_physics collisoin with object with :" + this.el.id + " " + e.detail.targetEl.classList);
      if (this.data.isTrigger) {
        console.log("TRIGGER COLLIDED "  + this.el.id + " " + e.detail.targetEl.classList);
        // e.detail.body.disableCollision = true;
        this.disableCollisionTemp(); //must turn it off or it blocks, no true "trigger" mode afaik (unlike cannonjs!)
        var triggerAudioController = document.getElementById("triggerAudio");
        if (triggerAudioController != null) {
          triggerAudioController.components.trigger_audio_control.playAudio();
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
    yoffset: {type: 'number', default: 0}
  },
	init: function()
	{
    // console.log("tyrna init particles!!!");
	},
  spawnParticles: function (location, type, lifetime, parentID, yFudge) {
    
    // console.log("mod_particles data: " + JSON.stringify(location));
    this.particle = document.createElement("a-entity");
    this.particle.setAttribute("mod_particles", {'type': type, 'lifetime': lifetime, 'parentID': parentID, 'yFudge': yFudge});
    

 
    // this.particle.setAttribute("type", type);
    // this.particle.setAttribute("lifetime", lifetime);
    if (parentID != null) { 

      let pparent = document.getElementById(parentID);
      let obj = pparent.object3D;
   
      let box = new THREE.Box3().setFromObject(obj); //bounding box for position
      let center = new THREE.Vector3();
      box.getCenter(center);
      let pos =  obj.worldToLocal(center);
      console.log("premod pos " + JSON.stringify(pos));
      if (yFudge != null) {
        let newPos = {};
        newPos.x = pos.x;
        newPos.y = pos.y + parseFloat(yFudge);
        newPos.z = pos.z;
        console.log("tryna mod "+JSON.stringify(newPos)+" yfudge " + yFudge);
        this.particle.setAttribute("position", newPos);
      } else {
        this.particle.setAttribute("position", pos);
      }

      var worldPosition = new THREE.Vector3();
        obj.getWorldPosition(worldPosition);
     
       //get centerpoint of geometry, in localspace
       //set position as local to 

      pparent.appendChild(this.particle);

    } else {
      this.particle.setAttribute("position", location);
      this.el.sceneEl.appendChild(this.particle);
    }
    
  }

});

AFRAME.registerComponent('mod_particles', {
  schema: {
    parentID: {type: 'string', default: null},
    location: {type: 'string', default: null},
    type: {type: 'string', default: 'sparkler'},
    lifetime: {type: 'number', default: 0},
    scale: {type: 'number', default: 1},
    yFudge: {type: 'number', default: 0}

  },
  init: function() {
    // let particleAttributes = {};
    console.log("mod_particles data: " + JSON.stringify(this.data));
    this.position = new THREE.Vector3();
    this.el.object3D.getWorldPosition(this.position);
   
    if (this.data.parentID != null) {
      // if (this.data.yFudge != 0) {
      //   this.position.y += this.data.yFudge;
      //   console.log("tryna add some yfudge " + this.data.yFudge); 
      //   this.el.setAttribute("position", this.position);
      // }


    }
    if (this.data.type.toLowerCase() =="candle") {
      // this.el.setAttribute('scale', '.25 .25 .25');
      this.el.setAttribute('sprite-particles', {texture: '#candle1', color: 'yellow', textureFrame: '8 8', textureLoop: '4', spawnRate: '1', lifeTime: '1', scale: '2'});
      this.el.setAttribute('light', {type: 'point', castShadow: 'true', color: 'yellow', intensity: .5, distance: 10, decay: 5});
      this.lightAnimation(.5, .75);
      this.el.addEventListener('animationcomplete', () => {
          this.lightAnimation(.5, .75);
      });
    }
        
    if (this.data.type.toLowerCase() =="fire") {
      // this.el.setAttribute('scale', '.25 .25 .25');
      this.el.setAttribute('sprite-particles', {texture: '#fireanim1', color: 'yellow', blending: 'additive', textureFrame: '6 6', textureLoop: '3', spawnRate: '2', lifeTime: '1.1', scale: '12'});
      this.el.setAttribute('light', {type: 'point', castShadow: 'true', color: 'yellow', intensity: .75, distance: 15, decay: 5});
      this.lightAnimation(.7, 1);
      this.el.addEventListener('animationcomplete', () => {
          this.lightAnimation(.7, 1);
      });
    }
    if (this.data.type.toLowerCase() =="smoke") {
      this.el.setAttribute('sprite-particles', {texture: '#smoke1', color: 'lightblue', textureFrame: '6 5', textureLoop: '1', spawnRate: '1', lifeTime: '3', scale: '10'});
    }
    if (this.data.type.toLowerCase() =="smoke/add") {
      this.el.setAttribute('sprite-particles', {texture: '#smoke1', color: 'lightblue', blending: 'additive', textureFrame: '6 5', textureLoop: '1', spawnRate: '1', lifeTime: '3', scale: '10'});
    }
    if (this.data.type.toLowerCase() =="smoke/add") {
      this.el.setAttribute('sprite-particles', {texture: '#smoke1', color: 'lightblue', blending: 'additive', textureFrame: '6 5', textureLoop: '1', spawnRate: '1', lifeTime: '3', scale: '10'});
    }
    // this.el.setAttribute('sprite-particles', 'texture', '#smoke1');
    // this.el.setAttribute('sprite-particles', 'color', 'blue');
   
  },
  lightAnimation: function (min, max){
    this.intensityMin = min;
    this.intensityMax = max;
    let duration = Math.random() * 600;
    let intensity = Math.random();
    if (intensity < this.intensityMin) {
      intensity = .5;
    }
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
});

