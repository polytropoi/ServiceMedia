
import {MeshSurfaceSampler} from '/three/examples/jsm/math/MeshSurfaceSampler.js'; 
import {TransformControls} from '/three/examples/jsm/controls/TransformControls.js';


// import { SVGLoader } from '/three/examples/jsm/loaders/SVGLoader.js'; // ref'd in import maps
// import { Flow } from '/three/examples/jsm/modifiers/CurveModifier.js'; 
// import { Line2 } from '/three/examples/jsm/lines/Line2.js'; //hrm..
// import { LineMaterial } from '/three/examples/jsm/lines/LineMaterial.js';
// import { LineGeometry } from '/three/examples/jsm/lines/LineGeometry.js';
// import * as GeometryUtils from '/three/examples/jsm/utils/GeometryUtils.js';

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerComponent('mod_physics', { //used by models, placeholders, instanced meshes, but NOT objects which manage physics settings in mod_object
  schema: {
    model: {default: ''},
    scaleFactor: {type: 'number', default: 1},
    isTrigger: {type: 'bool', default: false}, // it emits/triggers events, not a 'silent' collider
    isAudioTrigger: {type: 'bool', default: false}, // emits/triggers audio events
    body: {type: 'string', default: 'static'},  // dynamic: A freely-moving object
    shape: {type: 'string', default: 'box'},  // onthefly on glb uses 'mesh' type
    fit: {type: 'string', default: 'manual'},
    radius: {type: 'number', default: .5},
    bounciness: {type: 'number', default: 0}, //i.e. 'restitution' - or use as forceFactor?
    eventData: {default: ''},
    tags: {default: []},
    attractorID: {default: ''},
    attractorLocation: {default: ''},
    cooldownTime: {default: 2.0},
    offsetx: {default: 0},
    offsety: {default: 0},
    offsetz: {default: 0},
    xscale: {default: 1},
    yscale: {default: 1},
    zscale: {default: 1},
  },
  init() {
    this.offset = this.data.offsetx + " " + this.data.offsety + " " + this.data.offsetz;
    this.isTrigger = this.data.isTrigger;
    this.model = this.data.model;
    this.body = this.data.body;
    this.shape = this.data.shape;
    this.isGhost = false; //
    this.isReady = false;
    this.rotationMatrix = new THREE.Matrix4();
    this.targetQuaternion = new THREE.Quaternion();

    this.attractor = new THREE.Vector3(0, 0, 0);
    this.mesh = null;
  
    if (this.data.tags.includes("beat")) {
      this.el.classList.add("beatme");
    }
    this.isCooling = false;


    if (this.model == "instance") { //i.e. adding to an instanced/spawned/pooled mesh...
      this.isTrigger = true; //cheat
      this.el.setAttribute('ammo-body', {type: 'dynamic', mass: 1, gravity: '0 0 0', angularDamping: .1, linearSleepingThreshold: 0.1, emitCollisionEvents: this.isTrigger});
      this.el.setAttribute('ammo-shape', {type: 'sphere', fit: 'manual', sphereRadius: 1 });
      this.randomPush();

    } else if (this.model == "atomic") { //i.e. adding to an instanced/spawned/pooled mesh...
      this.isTrigger = true; //cheat
      this.el.setAttribute('ammo-body', {type: 'dynamic', mass: 1, gravity: '0 0 0', angularDamping: .1, linearSleepingThreshold: 0.1, emitCollisionEvents: this.isTrigger});
      this.el.setAttribute('ammo-shape', {type: 'sphere', fit: 'manual', sphereRadius: 1 });
      // this.randomPush();
      this.isReady();

    } else if (this.model == "child") { //i.e. set on a child mesh with name including 'collider', in mod_model, mesh should already be loaded

    
          this.el.setAttribute('ammo-body', {type: this.body, emitCollisionEvents: this.isTrigger});

          this.el.setAttribute('ammo-shape', {type: this.shape});
        
        console.log("tryna load ashape with trigger " + this.isTrigger);
      
    
    } else if (this.data.model == "placeholder") { //from cloudmarker, always kinematic
      this.isGhost = true;
      if (settings && settings.usePhysicsType == "ammo") {

      console.log("truyna init mod_physics for id " + this.el.id + " model " + this.model +" isTrigger "+ this.isTrigger + " body " + this.data.body + " scalefactor " + this.data.scaleFactor );
      this.el.setAttribute('ammo-body', {type: 'kinematic', emitCollisionEvents: this.isTrigger}); //placeholder model already loaded in mod_mode//nope, markers can have meshes
      
          this.el.setAttribute("ammo-shape", {type: 'sphere', fit: 'manual', sphereRadius: this.data.scaleFactor * .5, offset: '0 .5 0'});
       
        } else {
          console.log("caint fine no physics settings!@ ");
        }
        // console.log("tryna load placeholder  " + this.isTrigger);

    
    } else if (this.data.model == "mesh") { //from cloudmarker, always kinematic
      this.isGhost = true;
      if (settings && settings.usePhysicsType == "ammo") {

      console.log("truyna init mod_physics for id " + this.el.id + " model " + this.model +" isTrigger "+ this.isTrigger + " body " + this.data.body + " scalefactor " + this.data.scaleFactor );
      this.el.setAttribute('ammo-body', {type: 'kinematic', emitCollisionEvents: this.isTrigger}); //placeholder model already loaded in mod_mode//nope, markers can have meshes
          let offset = '0 '+this.data.scaleFactor+' 0';
          this.el.setAttribute("ammo-shape", {type: 'sphere', fit: 'manual', sphereRadius: this.data.scaleFactor * 2, offset: offset});
       
        }
        // console.log("tryna load placeholder  " + this.isTrigger);

      } else if (this.data.model == "agent") { //must be kinematic, moves as nav-agent on navmesh

        if (settings && settings.usePhysicsType == "ammo") {
          // console.log("truyna init mod_physics for id " + this.el.id + " model " + this.model +" isTrigger "+ this.isTrigger + " body " + this.data.body );
          let offset = '0 '+this.data.scaleFactor * .25+' 0';
          this.el.setAttribute('ammo-body', {type: 'kinematic', emitCollisionEvents: this.isTrigger}); //placeholder model already loaded in mod_model
          this.el.setAttribute("ammo-shape", {type: "box", fit: "manual", halfExtents: this.data.scaleFactor * .5+ " " + this.data.scaleFactor * .5 + " " + this.data.scaleFactor * .5, offset: offset, margin: .1});
        }
          // console.log("tryna load agent  " + this.isTrigger);
      
      }  else if (this.data.model == "collider") { //static geo for worldbuilding, needs nonu scaling..

        if (settings && settings.usePhysicsType == "ammo") {
          
          console.log("statoc mod_physics for id " + this.el.id + " model " + this.model +" isTrigger "+ this.isTrigger + " body " + this.data.body );
          setTimeout(() => {
            this.el.setAttribute('ammo-body', {type: 'static', emitCollisionEvents: this.isTrigger}); 
            this.el.setAttribute("ammo-shape", {type: "box"});
          }, 1000);
         
          // const scalefactor = this.data.scaleFactor + ' ' +
          // this.el.setAttribute('ammo-shape', {type: 'box', fit: 'manual', halfExtents: '1 1 1' });
          // this.el.setAttribute('ammo-shape', {type: 'box'});
      
        }
          // console.log("tryna load agent  " + this.isTrigger);
      
      } else {
      if (this.el.object3D) {
        let modObjectComponent = this.el.components.mod_object;
        if (!modObjectComponent) {
        this.el.setAttribute('ammo-body', {type: this.data.body, emitCollisionEvents: this.isTrigger});
        this.el.body.restitution = 10;
        this.el.setAttribute('ammo-shape', {type: 'mesh'});
        } else {
          setTimeout( () => { //wait a bit for static colliders to load...
            this.el.setAttribute('ammo-body', {type: this.data.body, emitCollisionEvents: this.isTrigger});
            this.el.body.restitution = 10;
            this.el.setAttribute('ammo-shape', {type: 'mesh'});
          }, 10000 * Math.random() );
        }
      }
    }

    this.el.addEventListener('body-loaded', () => {  

      if (this.data.model == "collider") {
        this.el.setAttribute('ammo-shape', {type: "box"});
        console.log("ammo shape is " + JSON.stringify(this.el.getAttribute('ammo-shape')));
      }
    });


    
    this.el.addEventListener("collidestart", (e) => { //this is for models or triggers, not objects - TODO look up locationData for tags? 
      // e.preventDefault();
      // console.log("mod_physics collision on model me  :" + this.el.id + " by " + e.detail.targetEl.id);
      // if (this.isTrigger) { 
        // console.log("mod_physics TRIGGER collision "  + this.el.id + " " + e.detail.targetEl.id);
       
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
            // } else {
            
          }
        }
        if (e.detail.targetEl.id.includes("obj")) {
          if (!this.isCooling) {
            this.isCooling = true;
          var triggerAudioController = document.getElementById("triggerAudio");
          if (triggerAudioController != null) { 
             
              console.log("mod_physics collision me "  + this.el.id + " with " + e.detail.targetEl.id);
              triggerAudioController.components.trigger_audio_control.playSingleAtPosition(e.detail.targetEl.object3D.position, window.playerPosition.distanceTo(e.detail.targetEl.object3D.position), ["bang"], .7);
             
              
              setTimeout( () => {
                this.isCooling = false;
              }, 5000);
            } 
          }
        }
        if (e.detail.targetEl.id.includes("ball")) {
          if (!this.isCooling) {
            this.isCooling = true;
          var triggerAudioController = document.getElementById("triggerAudio");
          if (triggerAudioController != null) { 
             
              // console.log("mod_physics TRIGGER collision "  + this.el.id + " " + e.detail.targetEl.id);
              triggerAudioController.components.trigger_audio_control.playSingleAtPosition(e.detail.targetEl.object3D.position, window.playerPosition.distanceTo(e.detail.targetEl.object3D.position), ["bang"], .7);
             
              
              setTimeout( () => {
                this.isCooling = false;
              }, 5000);
            } 
          }
        }
        if (e.detail.targetEl.id.includes("box")) {
          if (!this.isCooling) {
            this.isCooling = true;
            var triggerAudioController = document.getElementById("triggerAudio");
            if (triggerAudioController != null) {
              // console.log("mod_physics TRIGGER collision "  + this.el.id + " " + e.detail.targetEl.id);
              triggerAudioController.components.trigger_audio_control.playSingleAtPosition(e.detail.targetEl.object3D.position, window.playerPosition.distanceTo(e.detail.targetEl.object3D.position), ["bell"], .7);
              setTimeout( () => {
                this.isCooling = false;
              }, 5000);
            }
          }
        }
        if (e.detail.targetEl.id.includes("player")) {
          if (!this.isCooling) {
            this.isCooling = true;
            var triggerAudioController = document.getElementById("triggerAudio");
            if (triggerAudioController != null) {
              // console.log("mod_physics TRIGGER collision "  + this.el.id + " " + e.detail.targetEl.id);
              triggerAudioController.components.trigger_audio_control.playSingleAtPosition(e.detail.targetEl.object3D.position, window.playerPosition.distanceTo(e.detail.targetEl.object3D.position), ["magic"], .7);
              setTimeout( () => {
                this.isCooling = false;
              }, 5000);
            }
          }
        }
        if (this.data.model == "agent") {
          if (!this.isCooling) {
            this.isCooling = true;
            var triggerAudioController = document.getElementById("triggerAudio");
            if (triggerAudioController != null) {
              // console.log("mod_physics TRIGGER collision "  + this.el.id + " " + e.detail.targetEl.id);
              triggerAudioController.components.trigger_audio_control.playSingleAtPosition(e.detail.targetEl.object3D.position, window.playerPosition.distanceTo(e.detail.targetEl.object3D.position), ["greeting"], .7);
              setTimeout( () => {
                this.isCooling = false;
              }, 5000);
            }
          }
        }
        if (this.el.id.toLowerCase().includes("pin")) {
          var triggerAudioController = document.getElementById("triggerAudio");
          if (triggerAudioController != null) {
            // console.log("mod_physics TRIGGER collision "  + this.el.id + " " + e.detail.targetEl.id);
            triggerAudioController.components.trigger_audio_control.playSingleAtPosition(e.detail.targetEl.object3D.position, window.playerPosition.distanceTo(e.detail.targetEl.object3D.position), ["bell"], 1);
          }
          const force = new Ammo.btVector3(0, 1, -10);
          const pos = new Ammo.btVector3(this.el.object3D.position.x, e.detail.targetEl.object3D.position.y, e.detail.targetEl.object3D.position.z);
          e.detail.targetEl.body.applyImpulse(force, pos);
          Ammo.destroy(force);
          Ammo.destroy(pos);
          // this.el.material.color.setHex("#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}));
        }
        if (this.el.id.toLowerCase().includes("wall")) {
          var triggerAudioController = document.getElementById("triggerAudio");
          if (triggerAudioController != null && this.model == "spawned") {
            console.log("mod_physics TRIGGER collision "  + this.el.id + " " + e.detail.targetEl.id);
            triggerAudioController.components.trigger_audio_control.playAudioAtPosition(e.detail.targetEl.object3D.position, window.playerPosition.distanceTo(e.detail.targetEl.object3D.position), ["bang"], 1);
          }
          this.forwardPush();
          // const force = new Ammo.btVector3(0, 0, -5);
          // const pos = new Ammo.btVector3(e.detail.targetEl.object3D.position.x, this.el.object3D.position.y, e.detail.targetEl.object3D.position.z);
          // // const pos = new Ammo.btVector3(this.el.object3D.position.x, this.el.object3D.position.y, this.el.object3D.position.z);
          // e.detail.targetEl.body.applyImpulse(force, pos);
          // Ammo.destroy(force);
          // Ammo.destroy(pos);
          // this.el.material.color.setHex("#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}));
        }

        // let mod_obj_component = e.detail.targetEl.components.mod_object;
        // if (mod_obj_component != null) {
        //   // console.log(this.el.id + " gotsa collision with " + mod_obj_component.data.objectData.name);
        //   if (mod_obj_component.data.objectData.tags != undefined && mod_obj_component.data.objectData.tags != null) {
        //     var triggerAudioController = document.getElementById("triggerAudio");
        //     if (triggerAudioController != null) {
        //       triggerAudioController.components.trigger_audio_control.playAudioAtPosition(e.detail.targetEl.object3D.position, window.playerPosition.distanceTo(e.detail.targetEl.object3D.position), mod_obj_component.data.objectData.tags);
        //     }
        //   }
        
      // }
      if (this.isGhost) {
        this.el.setAttribute('ammo-body', {disableCollision: true});
        this.disableCollisionTemp();
      }
    });

  // loadShape: function () {
  //   this.el.addEventListener('body-loaded', () => {  
  //       this.el.setAttribute('ammo-shape', {type: this.data.shape});
  //       console.log("ammo shape is " + JSON.stringify(this.el.getAttribute('ammo-shape')));
  //     });
  
  },
  forwardPush: function () {
    const velocity = new Ammo.btVector3(0, 0, -10);
    this.el.body.setLinearVelocity(velocity);
   
    Ammo.destroy(velocity);
  },
  randomPush: function () {
    console.log("trunya push");
    const velocity = new Ammo.btVector3(randomNumber(-20, 20), randomNumber(-20, 20), randomNumber(-40, 40));
    // const velocity = new Ammo.btVector3(0, 0, 10);
    this.el.body.setLinearVelocity(velocity);
   
    Ammo.destroy(velocity);
  },
  disableCollisionTemp: function () { //bc ammo don't have no triggerz, except "ghostobject" !?
    
    setTimeout( () => {
      this.el.setAttribute('ammo-body', {disableCollision: false}); 
      console.log("trigger cooldown done") }, 3000);
  },
  enableCollision: function () {
    
  },
  tick: function (time, deltaTime) {
     if (this.isReady) {
        if (this.attractor) {
          // const delta = clock.getDelta();
          this.rotationMatrix.lookAt( this.attractor, this.mesh.position, this.mesh.up );
          this.targetQuaternion.setFromRotationMatrix( this.rotationMatrix );
          if ( ! this.mesh.quaternion.equals( this.targetQuaternion ) ) {
            const step = this.speed * deltaTime;
            this.mesh.quaternion.rotateTowards( targetQuaternion, step );
          }
          this.forwardPush();
      }
    }
  }
});



AFRAME.registerComponent('dynamic-ball', {

  schema: {
      physics: {type: 'string'}, // physx or ammo.
      yKill: {type: 'number', default: -10}
  },

  init() {
      const el = this.el
      el.setAttribute('instanced-mesh-member', 'mesh:#ball-mesh; memberMesh: true')

      if (this.data.physics === "ammo") {
        el.setAttribute('ammo-body', 'type:dynamic')
        // Explicitly specifying a shape is more efficient than auto-fitting.
        el.setAttribute('ammo-shape', 'type:sphere; fit:manual; sphereRadius: 0.3')
    }
    else if (this.data.physics === "cannon") {
        // necessary to explicitly specify sphere radius, as async call to 
        // set radius attribute on el may not have completed yet, and Cannon uses
        // the default radius of 1.
        // This is seen when recycling balls (deleting and recreating them).
        el.setAttribute('dynamic-body', 'shape: sphere; sphereRadius: 0.3')
    }
    else {
        el.setAttribute('physx-body', 'type:dynamic')
    }
  },

  tick() {
      if (this.el.object3D.position.y < this.data.yKill) {
          this.el.emit("recycle")
      }
  }
})
//from https://github.com/diarmidmackenzie/instanced-mesh/blob/main/tests/components/pinboard.js
AFRAME.registerComponent('ball-recycler', {

  schema: {
      physics: {type: 'string'}, // physx, ammo or cannon.
      ballCount: {type: 'number', default: 10},
      width: {type: 'number', default: 8}, // width of spawn field
      depth: {type: 'number', default: 8}, // depth of spawn field (after initial spawn balls always spawned at far depth)
      yKill: {type: 'number', default: -10}
  },

  init() {

      this.recycleBall = this.recycleBall.bind(this);
      this.ballCount = 0;
      // at start of day, spawn balls 
      for (let ii = 0; ii < this.data.ballCount; ii++) {

          this.createBall(false)
      }
  },

  createBall(recycled) {

      const { height, depth, width } = this.data
      const pos = this.el.object3D.position
      
      const ball = document.createElement('a-entity')
      ball.id = 'ball-'+this.ballCount;
      this.ballCount++
          
      ball.setAttribute('dynamic-ball', {yKill: this.data.yKill,
                                         physics: this.data.physics})
      let x = pos.x + Math.random() * width - width / 2
      let z = recycled ? (pos.z -depth / 2) : (pos.z + Math.random() * depth - depth / 2)
      ball.object3D.position.set(x, pos.y, z)
      this.el.sceneEl.appendChild(ball)

      ball.addEventListener('recycle', this.recycleBall);

  },

  recycleBall(evt) {

      const ball = evt.target

      ball.parentNode.removeChild(ball);
      this.createBall(true)

  }
})

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
};

AFRAME.registerComponent('scatter_physics', { //scattered randomly (hemisphere), no instancing...
  schema: {

    _id: {default: ''},
    modelID: {default: ''},
    count: {default: 10},
    scaleFactor: {type: 'number', default: 1},
    interaction: {default: ''},
    tags: {default: ''},
    triggerTag: {default: ''}
  },
  
  init: function () {
    this.count = 0;
    this.radius = 20;
    
    console.log("tryna spawn and scatter objet " + this.data.modelID + " x " + this.data.count + " scaleFactor " + this.data.scaleFactor);
    this.instancedElements = [];
        for (var i=0; i<this.data.count; i++) {
         
          // let scale = Math.random() * this.data.scaleFactor;
          // const { height, depth, width } = this.data
          // const pos = this.el.object3D.position
    
          const iEl = document.createElement('a-entity')
          iEl.id = 's_' + this.count;
          this.count++
          // iEl.setAttribute('gltf-model', '#'+ this.data.modelID);
          
          // iEl.setAttribute('instanced-mesh-member', {mesh:this.el.id, memberMesh: true});
          // iEl.setAttribute('instanced-mesh-member', {mesh:'#gltf_'+this.data.modelID, memberMesh: true});
          iEl.setAttribute('spawned_object', {'modelID': this.data.modelID, 'scaleFactor': this.data.scaleFactor, 'tags': this.data.tags});
          this.el.sceneEl.appendChild(iEl);
          
          this.instancedElements.push(iEl);

          if (this.instancedElements.length == this.data.count) {
            this.applyLocations();
          }
        }   
  }, 
  applyLocations: function () {
    let radius = this.radius;
    for (var i=0; i< this.instancedElements.length; i++) {

      let x = Math.random() * radius - (radius/2);
      // let y = Math.random() * radius - (radius/2);
      let y = randomNumber(0, 10);
      let z = Math.random() * radius - (radius/2);
      // this.instancedElements[i].setAttribute('position', {x: x, y: y, z: z});

      this.instancedElements[i].object3D.position.set(x, y, z);
      this.instancedElements[i].object3D.rotation.x = (Math.random() * 360 ) * Math.PI / 180;
      this.instancedElements[i].object3D.rotation.y = (Math.random() * 360 ) * Math.PI / 180;
      this.instancedElements[i].object3D.rotation.z = (Math.random() * 360 ) * Math.PI / 180;

      // this.instancedElements[i].setAttribute('mod_physics', {'model': 'spawned', 'body': 'dynamic', 'shape': 'sphere'});

    }
  }
});

AFRAME.registerComponent('spawned_object', { //cooked on the fly...
  schema: {

    // _id: {default: ''},
    modelID: {default: ''},
    // count: {default: 10},
    scaleFactor: {type: 'number', default: 1},
    // interaction: {default: ''},
    tags: {default: ''},
    // triggerTag: {default: null}
  },
  
  init: function() {
    this.el.classList.add("activeObjexRay");
    this.isTrigger = true;
    this.isSelected = false;
    if (this.data.tags.includes("beat")) {
      this.el.classList.add("beatme");
    }
    this.el.setAttribute('gltf-model', '#'+ this.data.modelID);
    this.el.setAttribute('scale', {x: this.data.scaleFactor, y: this.data.scaleFactor, z: this.data.scaleFactor});
    this.el.addEventListener('model-loaded', () => {  
      // if (this.el.object3D) {
      // this.mesh = this.el.object3D('mesh');
        // if (this.model == "spawned") {
          this.el.setAttribute('ammo-body', {type: 'dynamic', mass: 1, gravity: '0 0 0', linearSleepingThreshold: 0.1, emitCollisionEvents: this.isTrigger});
          // this.el.body.restitution = 10;
          console.log("tryna load spawned object body");
        // }
      // }
    });
    this.el.addEventListener('body-loaded', () => {  
      // if (this.model == "spawned") {
        this.el.setAttribute('ammo-shape', {type: 'sphere', fit: 'manual', sphereRadius: this.data.scaleFactor });
        // this.el.setAttribute('ammo-shape', {type: 'sphere'});
        // console.log("tryna load spawned object shape with trigger " + this.el.id);
        this.randomPush();
      // }
    });

    this.el.addEventListener("collidestart", (e) => { 
      // e.preventDefault();
      console.log("collision on spawned object  :" + this.el.id + " by " + e.detail.targetEl.id + " isTrigger " + this.isTrigger);
      if (this.isTrigger) { 
      
        if (e.detail.targetEl.id.includes("wall")) {
          // console.log("mod_physics TRIGGER collision "  + this.el.id + " " + e.detail.targetEl.id);
          var triggerAudioController = document.getElementById("triggerAudio");
          // if (triggerAudioController != null) {
            
          //   triggerAudioController.components.trigger_audio_control.playAudioAtPosition(e.detail.targetEl.object3D.position, window.playerPosition.distanceTo(e.detail.targetEl.object3D.position), ["bang"], 1);
          // }
          this.randomPush();

        } 
        if (e.detail.targetEl.id.includes("obj")) {

        }       
      }
      
    });

    this.el.addEventListener('raycaster-intersected', e =>{  // raycaster-intersected
      this.raycaster = e.detail.el;

      if (this.raycaster && !this.isSelected) {
        this.intersection = this.raycaster.components.raycaster.getIntersection(this.el);
       
        if (!this.intersection) { 
            return; 
          } else {
            if (this.intersection.point) {
              this.isSelected = true;
              this.hitpoint = this.intersection.point;

              if (window.playerPosition) {
                this.distance = window.playerPosition.distanceTo( this.intersection.point );
              } else {
                this.distance = 5;
                console.log("setting distance to 5");
              }
             
              // this.hitpoint = this.intersection[0].point;
              this.rayhit( e.detail.el.id, this.distance, this.intersection.point ); 
            }
          }
        // console.log(intersection.point);
        }
      });
      this.el.addEventListener("raycaster-intersected-cleared", () => {
          this.raycaster = null;
          this.isSelected = false;
          // this.killParticles();
      });
    
    //   this.el.addEventListener('mouseenter', (e) => {
    //   e.preventDefault();
    //   // console.log("gotsa spawn : " + evt.detail.intersection.object.name);
    //   // const velocity = new Ammo.btVector3(randomNumber(-2, 2), randomNumber(-2, 2), randomNumber(-4, 4));
    //   // // const velocity = new Ammo.btVector3(0, 0, 10);
    //   // this.el.body.setLinearVelocity(velocity);
    //   // console.log("mod_physics TRIGGER collision "  + this.el.id + " " + e.detail.targetEl.id);
    //   var triggerAudioController = document.getElementById("triggerAudio");
    //   if (triggerAudioController != null && e.detail.intersection) {
        
    //     triggerAudioController.components.trigger_audio_control.playAudioAtPosition(e.detail.intersection.point, window.playerPosition.distanceTo(e.detail.intersection.point), ["bang"], 1);
    //   }
    //   const velocity = new Ammo.btVector3(randomNumber(-4, 4), randomNumber(-4, 8), randomNumber(-8, 8));
    //   // const velocity = new Ammo.btVector3(0, 0, 10);
    //   this.el.body.setLinearVelocity(velocity);
     
    //   Ammo.destroy(velocity);

    // });

  },
  forwardPush: function () {
    const velocity = new Ammo.btVector3(0, 0, -10);
    this.el.body.setLinearVelocity(velocity);
   
    Ammo.destroy(velocity);
  },
  randomPush: function () {
    // console.log("trunya push");
    const velocity = new Ammo.btVector3(randomNumber(-2, 2), randomNumber(-2, 2), randomNumber(-4, 4));
    // const velocity = new Ammo.btVector3(0, 0, 10);
    this.el.body.setLinearVelocity(velocity);
   
    Ammo.destroy(velocity);
  },
  rayhit: function (hitID, distance, hitpoint) {
    
      distance = window.playerPosition.distanceTo(hitpoint);
      // console.log("new hit " + hitID + " " + distance + " " + JSON.stringify(hitpoint));

      
        var triggerAudioControllerEl = document.getElementById("triggerAudio");
        
        if (triggerAudioControllerEl != null) {
          // console.log("gotsa audio trigger controller el");
          let triggerAudioController = triggerAudioControllerEl.components.trigger_audio_control;
          if (triggerAudioController  != null) {
            // console.log("gotsa audio trigger controller " + distance);
            let triggertags = this.data.tags != null && this.data.tags != "" ? this.data.tags : "bang";
            triggerAudioController.playAudioAtPosition(hitpoint, distance, triggertags);
          }
         
        }
      
         const velocity = new Ammo.btVector3(randomNumber(-4, 4), randomNumber(-4, 8), randomNumber(-8, 8));
      // const velocity = new Ammo.btVector3(0, 0, 10);
      this.el.body.setLinearVelocity(velocity);
     
      Ammo.destroy(velocity);
    }
});

AFRAME.registerComponent('instanced_meshes_sphere_physics', { //scattered randomly in sphere, NOT INSTANCED...
  schema: {
    type: {default: 'instance'},
    _id: {default: ''},
    modelID: {default: ''},
    count: {default: 20},
    scaleFactor: {default: 10},
    interaction: {default: ''},
    tags: {default: ''},
    triggerTag: {default: null}
  },
  init: function () {
    this.count = 0;
    this.radius = 20;
    // this.el.setAttribute('gltf-model', '#'+ this.data.modelID);
    

    console.log("tryna set scatter model " + this.data.modelID);
 
    this.instancedElements = [];
        for (var i=0; i<this.data.count; i++) {
     
         
          let scale = Math.random() * this.data.scaleFactor;
          // const { height, depth, width } = this.data
          // const pos = this.el.object3D.position
    
          const iEl = document.createElement('a-entity')
          iEl.id = 'i_' + this.count;
          this.count++
          console.log("mesh selector " + this.el.id);
          // iEl.setAttribute('instanced-mesh-member', {mesh:this.el.id, memberMesh: true});
          iEl.setAttribute('instanced-mesh-member', {mesh:'#i-mesh-sphere', memberMesh: true});

          if (this.data.tags.includes("beat")) {
            iEl.classList.add("beatme");
          }
          // const material1 = new THREE.MeshPhysicalMaterial({
          //   roughness: 0,
          //   transmission: 1,
          //   thickness: 2
          // });

                    
          this.el.sceneEl.appendChild(iEl);
          
          this.instancedElements.push(iEl);

          if (this.instancedElements.length == this.data.count) {
            this.applyPhysics();
          }
        }   
  }, 

  applyPhysics: function () {
    let radius = this.radius;
    for (var i=0; i< this.instancedElements.length; i++) {
      this.instancedElements[i].setAttribute('mod_physics', {'model': this.data.type, 'body': 'dynamic', 'shape': 'sphere', 'fit': 'manual'});
      let x = Math.random() * radius - (radius/2);
      let y = Math.random() * radius - (radius/2);
      let z = Math.random() * radius - (radius/2);
      // this.instancedElements[i].setAttribute('position', {x: x, y: y, z: z});
      this.instancedElements[i].object3D.position.set(x, y, z)
      // this.instancedElements[i].object3D.position.rotation.x = (Math.random() * 360 ) * Math.PI / 180;
      // this.instancedElements[i].object3D.position.rotation.y = (Math.random() * 360 ) * Math.PI / 180;
      // this.instancedElements[i].object3D.position.rotation.z = (Math.random() * 360 ) * Math.PI / 180;
      // this.instancedElements[i].setAttribute('ammo-body', {type: 'dynamic', emitCollisionEvents: this.isTrigger});

      // this.instancedElements[i].setAttribute('ammo-shape', {type: 'sphere'});
    }
  },

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
    console.log("tryna init instanced_meshes_sphere");
    this.tick = AFRAME.utils.throttleTick(this.tick, 50, this);
      var el = this.el;
      var root = this.el.object3D;
      var loader = new THREE.GLTFLoader();
      var mtx = new THREE.Matrix4();
    console.log("THIS DATA SCATTER " + this.data._id + " " + this.data.modelID);

  this.triggerAudioController = document.querySelector("#triggerAudio");
  this.isTrigger = true;
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
  this.isInitialized = false;
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
        // let physics_item = new  
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
      // this.el.object3D.add(this.iMesh);
      // physics.add(this.iMesh);
      // if (this.isTrigger) {
        // console.log("tryna set kinematic trigger!");
        // this.el.setAttribute('ammo-body', {type: "kinematic", emitCollisionEvents: true});
      // } else {
      //   this.el.setAttribute('ammo-body', {type: this.data.body, emitCollisionEvents: true});
        
      // }

      // this.el.addEventListener('body-loaded', () => {  
          
      //   // if (this.isTrigger) {
      //     console.log("TRIGGER LOADED");
      //     this.el.setAttribute('ammo-shape', {type: "sphere"});
      //   // } else {
      //   //   this.el.setAttribute('ammo-shape', {type: this.data.shape});
      //   // }
      //   // this.el.body.setCollisionF
      //   // console.log("ammo shape is " + JSON.stringify(this.el.getAttribute('ammo-shape')));
      //   // this.isTrigger = this.data.isTrigger;
      //   console.log("tryna load ashape with trigger " + this.isTrigger);
      // });

      
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
      if (this.hitID != hitID || !this.isInitialized) {
        
        this.intersection = null;
        this.isInitialized = true;
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

      console.log("instanced_surface_meshes model _id " + this.data._id + " tryna instance " + this.data.count);
      // this.el.setAttribute("visible",false);
      this.el.addEventListener('model-loaded', (event) => {
        event.preventDefault();;
        const sObj = this.el.getObject3D('mesh');
        
        console.log("tryna INSTANCE THE THIGNS");
        this.sampleGeos = [];
        this.sampleMats = [];
        sObj.visible = false;
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

    if (this.useMatrix) {
      let matrixMeshEl = document.getElementById("matrix_meshes");
      if (matrixMeshEl != null) {
        this.matrixMeshComponent = matrixMeshEl.components.matrix_meshes;
        if (this.matrixMeshComponent != null && this.intersection != null) {
          this.matrixMeshComponent.selectRoomData(this.instanceId);
        }
      } else {
        matrixMeshEl = document.getElementById("matrix_meshes");
      }
    }
    
  },
  
  surfaceLoaded: function () {  //called from scatter-surface when loaded
    
    // console.log("instanced_surface_meshes.surfaceLoaded call");
        if (!this.surfaceMesh) {
          this.surfaces = document.getElementsByClassName("surface");
          // console.log("surfaces found " + this.surfaces.length);
          if (this.surfaces.length > 0) {
            this.surface = this.surfaces[0];
            if (this.surface.getObject3D('mesh') != null) {
              this.surface.getObject3D('mesh').traverse(node => {
                if (node.isMesh) {
                  this.surfaceMesh = node;    
                  if (this.sampleGeos.length) {
                    // console.log("gots samplegeos");
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
          sObj.visible = false;
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

    scatterMeshes: function () {
      if (!this.scatterFinished && this.surfaceMesh && this.sampleGeos.length) {
        this.scatterFinished = true;
        
        let waterLevel = -5;
        if (settings) {
          waterLevel = settings.sceneWaterLevel;
        }

        // console.log("tryna scatter!@ waterLeve " + waterLevel + " object with #meshes  "+ this.sampleGeos.length);
        var dummy = new THREE.Object3D();
        dummy.visible = false;
        const count = this.data.count;
    
        const sampler = new MeshSurfaceSampler( this.surfaceMesh ) // noice!  
        .build();

            let iMesh_1 = new THREE.InstancedMesh(this.sampleGeos[0], this.sampleMats[0], count); //todo as array

            let iMesh_2 = null;
            if (this.sampleGeos.length == 2) {
              iMesh_2 = new THREE.InstancedMesh(this.sampleGeos[1], this.sampleMats[1], count);
             
            }
            let iMesh_3 = null;
            if (this.sampleGeos.length == 3) {
              iMesh_3 = new THREE.InstancedMesh(this.sampleGeos[2], this.sampleMats[2], count);
             
            }
            let iMesh_4 = null;
            if (this.sampleGeos.length == 4) {
              iMesh_4 = new THREE.InstancedMesh(this.sampleGeos[3], this.sampleMats[3], count);
             
            }
          
              let position = new THREE.Vector3(0,-20,0);
              let normal = new THREE.Vector3();
              this.count = 0;
              for (var i = 0; i < 100000; i++) {
                if (this.count <= count) {
                
                // sampler.sample( position, normal ) //wtf?
                if (i > 4) { 
                  sampler.sample( position );
                  
                  let scale = Math.random() * this.data.scaleFactor;
                  // console.log("scale " + scale);
                  if (position.y > waterLevel && (Math.abs(position.x) > 10 && Math.abs(position.z) > 10)) { //loop through till all of them are above the 0, and outside the center play area
                    
                    // console.log("instance pos " + JSON.stringify(position));
                    dummy.position.set( position.x, position.y + this.data.yMod, position.z );
                    dummy.scale.set(scale,scale,scale);
                    dummy.rotation.y = (Math.random() * 360 ) * Math.PI / 180;
                    //   dummy.lookAt( _normal ); //use eventData? 
                    dummy.updateMatrix();

                    iMesh_1.setMatrixAt( this.count, dummy.matrix ); //got fussy in a loop, 2 is enough..or lets say 4
                    iMesh_1.frustumCulled = false; //too funky
                    iMesh_1.instanceMatrix.needsUpdate = true;
                    iMesh_1.userData = {"collide": true, "instanced": true, count: count};
                    sceneEl.object3D.add(iMesh_1);
                    this.iMesh = iMesh_1;
                    this.iMesh_1 = iMesh_1;
                    if (iMesh_2) {
                      iMesh_2.setMatrixAt( this.count, dummy.matrix );
                      iMesh_2.frustumCulled = false;
                      iMesh_2.instanceMatrix.needsUpdate = true;
                      iMesh_2.userData = {"collide": true, "instanced": true, count: count};
                      sceneEl.object3D.add(iMesh_2);
                      this.iMesh = iMesh_2;
                      this.iMesh_2 = iMesh_2;
                    }
                    if (iMesh_3) {
                      iMesh_3.setMatrixAt( this.count, dummy.matrix );
                      iMesh_3.frustumCulled = false;
                      iMesh_3.instanceMatrix.needsUpdate = true;
                      iMesh_3.userData = {"collide": true, "instanced": true, count: count};
                      sceneEl.object3D.add(iMesh_3);
                      // this.iMesh = iMesh_3;
                      this.iMesh_3 = iMesh_3;
                    }
                    if (iMesh_4) {
                      iMesh_4.setMatrixAt( this.count, dummy.matrix );
                      iMesh_4.frustumCulled = false;
                      iMesh_4.instanceMatrix.needsUpdate = true;
                      iMesh_4.userData = {"collide": true, "instanced": true, count: count};
                      sceneEl.object3D.add(iMesh_4);
                      this.iMesh_4 = iMesh_4;
                    }
                    this.count++;
                    }
                  }
              } else {
                console.log("breaking loop at " + i.toString());

                break;
                
              }
            }

        this.el.classList.add('activeObjexRay');
        this.initialized = true;

      } else {
        // console.log(this.scatterFinished + " " + this.surfaceMesh + " " + this.sampleGeos.length);
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
      this.particlesEl.setAttribute('sprite-particles', {"duration": .1}); //resets after changing duration, so interrupts loop :*
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
          console.log("gotsa intersection!" + this.intersection[0].instanceId + " this.instanceId ");
          // if (!this.isInitialized) {
          //   this.instanceId = this.intersection[ 0 ].instanceId;
          // }
          if (this.intersection[0].point != undefined && this.intersection[0].point != null ) {
            if (this.instanceId != this.intersection[0].instanceId || !this.isInitialized) {
              this.instanceId = this.intersection[ 0 ].instanceId;
              this.isInitialized = true;
              console.log(this.data.tags + " " + this.instanceId);
              // if (this.data.tags != undefined && this.data.tags.length) {  
                // this.distance = window.playerPosition.distanceTo(this.intersection[0].point);
                this.distance = this.raycaster.ray.origin.distanceTo( this.intersection[0].point );
                this.hitpoint = this.intersection[0].point;
                this.rayhit(this.instanceId, this.distance, this.hitpoint); 
              // }
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
        } else {
          let matrixMeshEl = document.getElementById("matrix_meshes");
          if (matrixMeshEl != null) {
            this.matrixMeshComponent = matrixMeshEl.components.matrix_meshes;
            if (this.matrixMeshComponent != null && this.intersection != null) {
              this.matrixMeshComponent.selectRoomData(this.instanceId);
            }
          }
        }    
    },
    instance_clicked: function (id) {
      console.log("clicked instance: "+ id);  
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

AFRAME.registerComponent('scatter-surface-default', { //cook one up on the fly if needed
  init: function () {
    let that = this;
    console.log("TRYNA LOAD SCATTER SURFACE");
    let surfaceGeometry = new THREE.BoxGeometry( 100, .1, 100 ).toNonIndexed();
    // let surfaceGeometry = new THREE.PlaneGeometry( 66, 66 ).toNonIndexed();
    const surfaceMaterial = new THREE.MeshLambertMaterial( { opacity: .1, color: "aqua", wireframe: true } );
    const surface = new THREE.Mesh( surfaceGeometry, surfaceMaterial );
    // surface.rotation.z = -90;
    this.el.setObject3D('mesh', surface);
    
    // this.el.addEventListener('model-loaded', (event) => {
      // event.preventDefault();
      console.log("SCATTER SURFACE LOADED");
      // that.el.emit('surfaceLoaded', true);
      
      // setTimeout(function(){ that.el.emit('surfaceLoaded', true);   }, 2000);// put some fudge, wait a bit for scatter meshes to load before firing
      let imeshes = document.querySelectorAll("[instanced_surface_meshes]");
      console.log("gots SCATTER SURFACE imeshes " + imeshes);
      for (let i = 0; i < imeshes.length; i++) {
        console.log("imesh " + imeshes[i]);
        imeshes[i].components.instanced_surface_meshes.surfaceLoaded();
      }
    // });
  }
});

AFRAME.registerComponent('scatter-surface', { //call surface scatter (instancing) method when loaded 
  init: function () {
    let that = this;
    this.el.addEventListener('model-loaded', (event) => {
      event.preventDefault();

      let imeshes = document.querySelectorAll("[instanced_surface_meshes]"); //um, what if...?
      // console.log("gots SCATTER SURFACE imeshes " + imeshes);
      for (let i = 0; i < imeshes.length; i++) {
        // console.log("imesh " + imeshes[i]);
        imeshes[i].components.instanced_surface_meshes.surfaceLoaded(); //close enough?
      }
    });
  }
});


AFRAME.registerComponent('wrap_location', { //used by models and placeholders, not objects which manage physics settings in mod_object
  schema: {
    floor: {default: ''}
  },
  init() {
    this.tick = AFRAME.utils.throttleTick(this.tick, 100, this);
  }, 
  tick() {
    if (this.el.object3D.position.y < -22) {
      this.el.object3D.position.y = 50
    }
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
    
 
    this.particle = document.createElement("a-entity");
    if (pScale == NaN || pScale == null || pScale == undefined) {
      pScale = 10;
    } else {
      pScale = pScale * 10;
    } 
    console.log("particle_spawner mod_particles location data: " + JSON.stringify(location) + " scale " + pScale);
    
    if (parentID != null) { 
      let pparent = document.getElementById(parentID);
          // let obj = pparent.object3D;
          // let box = new THREE.Box3().setFromObject(obj); //bounding box for position
          // let center = new THREE.Vector3();
          // box.getCenter(center);
          // let pos =  obj.worldToLocal(center);
          let pos = new THREE.Vector3(0, 0, 0);
          // console.log("premod pos " + JSON.stringify(pos));
      pparent.appendChild(this.particle);
      // this.particle.setAttribute("position", JSON.stringify(pos));

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
    parentID: {type: 'string', default: ''},
    location: {type: 'string', default: ''},
    type: {type: 'string', default: 'sparkler'},
    lifetime: {type: 'number', default: 0},
    // scale: {type: 'number', default: 1},
    yFudge: {type: 'number', default: 0},
    color: {type: 'string', default: 'orange'},
    scale: {type: 'number', default: 10},
    addLight: {default: true},
    intensity: {default: 1}

  },
  init: function() {
    // let particleAttributes = {};
    console.log("mod_particles data: " + this.data.scale + " color " + this.data.color);
    this.position = new THREE.Vector3();

    if (this.data.scale == null || this.data.scale == 0) {
      this.data.scale = 10;
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
    if (this.data.type.toLowerCase() =="candle") { //need to embed a location (light obj or empty named light), or find center point
      // this.el.setAttribute('scale', '.25 .25 .25');
      let pSize = this.data.scale;
      console.log("tryna add candle!");
      this.el.setAttribute('sprite-particles', {enable: true, texture: '#candle1', color: this.data.color, textureFrame: '8 8', textureLoop: '4', spawnRate: '1', lifeTime: '1', scale: pSize.toString()});

      if (this.data.addLight) {
        this.el.setAttribute('light', {type: 'point', castShadow: true, color: this.data.color, intensity: .5, distance: pSize * 2, decay: pSize});
        this.lightAnimation(.5, 1.5);
        this.el.addEventListener('animationcomplete', () => {
            this.lightAnimation(.5, 1.5);
        });
      }

    }
        
    if (this.data.type.toLowerCase() =="fire") {
      // this.el.setAttribute('scale', '.25 .25 .25');
      // console.log("tryna light a fire! "  + JSON.stringify(this.data.location) + " scale " + this.data.scale);
      let pSize = this.data.scale * 20;
      this.el.setAttribute('sprite-particles', {enable: true, texture: '#fireanim1', color: this.data.color, blending: 'additive', textureFrame: '6 6', textureLoop: '3', spawnRate: '2', lifeTime: '1.1', scale: pSize.toString()});
      if (this.data.addLight) {
        this.distanceFactor = this.data.scale * 3;
        this.decayFactor = this.data.scale * .1;
        console.log("tryna light a fire! " + this.distanceFactor + " " +  this.decayFactor);
        this.el.setAttribute('light', {type: 'point', castShadow: true, color: this.data.color, intensity: this.data.intensity * 2, distance: this.distanceFactor, decay: 1});
          this.lightAnimation(this.data.intensity * .5, this.data.intensity * 2);
        this.el.addEventListener('animationcomplete', () => {
            this.lightAnimation(this.data.intensity * .5, this.data.intensity * 2);
        });
      }
      // this.el.setAttribute("position", this.data.location);
    }
    if (this.data.type.toLowerCase() =="smoke") {
      if (document.getElementById("smoke1")) {  //bc error if this isn't added at load, maybe just get it now? 
        console.log("tryna add smoke! " + JSON.stringify(this.data.location) + " scale " + this.data.scale );
        this.el.setAttribute('sprite-particles', {enable: true, texture: '#smoke1', color: this.data.color, blending: 'additive', textureFrame: '6 5', textureLoop: '1', spawnRate: '1', lifeTime: '3', scale: this.data.scale.toString()});
      }
      // this.el.setAttribute("position", this.data.location);
    }
    if (this.data.type.toLowerCase() =="smoke/add") {
      if (document.getElementById("smoke1")) { //bc error if this isn't added at load, maybe just get it now? 
        this.el.setAttribute('sprite-particles', {enable: true, texture: '#smoke1', color: 'lightblue', blending: 'additive', textureFrame: '6 5', textureLoop: '1', spawnRate: '1', lifeTime: '3', scale: '10'});
      }
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
    let halfMax = max / 2;
    // console.log("tryna animate w/ intensity " + intensity);
    // if (intensity < this.intensityMin) {
    //   intensity = this.intensityMin;
    // }
    // console.log("inteisity is " + intensity + " dur " + duration);
    let animation = "property: light.intensity; from: "+halfMax+"; to: "+intensity+"; dur: "+duration+"; dir: alternate;";
    // console.log(intensity);
    // updating the animation component with the .setAttribute function
    this.el.setAttribute('animation', animation);
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
 var degToRad = THREE.MathUtils.degToRad;
 
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
    // this.matrixCalloutEntity.appendChild(this.matrixCalloutPanel);
    this.matrixCalloutEntity.appendChild(this.matrixCalloutText);
    // this.calloutPanel.setAttribute("position", '0 0 1'); 
    this.matrixCalloutText.setAttribute("position", '0 0 .1'); //offset the child on z toward camera, to prevent overlap on model

    let font = "Acme.woff";
    
    this.matrixCalloutText.setAttribute('troika-text', {
      width: .5,
      outlineColor: "black",
      outlineWidth: "2%",
      baseline: "bottom",
      align: "left",
      font: "/fonts/web/" + font,
      fontSize: .2,
      anchor: "center",
      color: "white",
      value: ""
    });
    this.matrixCalloutPanel.setAttribute('overlay');
    this.matrixCalloutText.setAttribute('overlay');

  },
  loadRoomData(roomData) {
  
    this.roomData = roomData.chunk;
    this.roomData.sort((a, b) => (a.num_joined_members < b.num_joined_members) ? 1 : -1);
    console.log("gots " + this.roomData.length + " rooms from matrix.org :" + JSON.stringify(this.roomData));

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
      let y = hitpoint.y + .5;
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
      // this.matrixCalloutText.setAttribute("value", roomName);
      this.matrixCalloutText.setAttribute('troika-text', {
        value: roomName
      });
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
      this.dialogEl.components.mod_dialog.showPanel("Join the matrix room " + this.roomData[instanceID].name + "?", "href~https://matrix.to/#/" + this.roomData[instanceID].room_id, "linkOpen", 5000, "#" );
    } else {
      if (!this.roomData) {
        GetMatrixData(); //in connect.js
      }
    }
  }
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

AFRAME.registerComponent('mod_random_path', {
  schema: {
    init: {default: false},
    isClosed: {default: false},
    eventData: {default: ''},
    orientToCurve: {default: false}

  },

  init: function () {

    this.maxpoints = 100;
    const geometry = new THREE.BufferGeometry();

    // attributes
    const positions = new Float32Array( this.maxpoints * 3 ); // 3 vertices per point
    geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  
    // drawcalls
    drawCount = 2; // draw the first 2 points, only
    geometry.setDrawRange( 0, drawCount );

    const material = new THREE.LineBasicMaterial( { color: 0xff0000, linewidth: 2 } );

    // line
    line = new THREE.Line( geometry,  material );
  },
  updatePositions: function () {
    const positions = line.geometry.attributes.position.array;

    let x = 0;
    let y = 0;
    let z = 0;
    let index = 0;

    for ( let i = 0, l = this.maxpoints; i < l; i ++ ) {

      positions[ index ++ ] = x;
      positions[ index ++ ] = y;
      positions[ index ++ ] = z;

      x += ( Math.random() - 0.5 ) * 30;
      y += ( Math.random() - 0.5 ) * 30;
      z += ( Math.random() - 0.5 ) * 30;

	  }

  }

});

AFRAME.registerComponent('mod_curve', {
  schema: {
    init: {default: false},
    isClosed: {default: false},
    eventData: {default: ''},
    orientToCurve: {default: false},
    speedFactor: {default: 1},
    spreadFactor: {default: 4},
    distance: {default: -100},
    type: {default: 'model'},
    origin: {default: 'world zero'}
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
    this.speedMod = this.data.speedFactor;

    this.viewportLocation = new THREE.Vector3();
    this.viewportHolder = document.getElementById('viewportPlaceholder');
    this.viewportHolder.object3D.getWorldPosition( this.viewportLocation );

    for (var i = 0; i < 5; i += 1) {
      if (this.data.origin == 'world zero') {
        this.points.push(new THREE.Vector3(0, 0, this.data.distance * (i / 4)));
      } else if (this.data.origin == 'viewport') {
        this.points.push(new THREE.Vector3(this.viewportLocation * (i / 4)));
      }
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
      this.curve.points[0].x =Math.ceil(Math.random() * this.data.spreadFactor) * (Math.round(Math.random()) ? 1 : -1);
      this.curve.points[0].y =Math.ceil(Math.random() * this.data.spreadFactor) * (Math.round(Math.random()) ? 1 : -1);
      this.curve.points[1].x =-Math.ceil(Math.random() * this.data.spreadFactor) * (Math.round(Math.random()) ? 1 : -1);
      this.curve.points[1].y =-Math.ceil(Math.random() * this.data.spreadFactor) * (Math.round(Math.random()) ? 1 : -1);
      this.curve.points[2].x =Math.ceil(Math.random() * this.data.spreadFactor) * (Math.round(Math.random()) ? 1 : -1);
      this.curve.points[2].y =Math.ceil(Math.random() * this.data.spreadFactor) * (Math.round(Math.random()) ? 1 : -1);
      this.curve.points[3].x =-Math.ceil(Math.random() * this.data.spreadFactor) * (Math.round(Math.random()) ? 1 : -1);
      this.curve.points[3].y =-Math.ceil(Math.random() * this.data.spreadFactor) * (Math.round(Math.random()) ? 1 : -1);
    }
    this.fraction += 0.001 * this.speedMod;
    if ( this.fraction > 1) {
      this.fraction = 0;

      //normal.set( 0, 1, 0 );
    }
    
    this.el.object3D.position.copy( this.curve.getPoint( 1 - this.fraction ) ); //or just the fraction to go backwards       
    this.tangent = this.curve.getTangent( this.fraction );
    // this.normal = this.curve.getNormal( this.fraction );
    this.axis.crossVectors( this.normal, this.tangent ).normalize( );
    
      //radians = Math.acos( normal.dot( tangent ) );	
      //char.quaternion.setFromAxisAngle( axis, radians );
      
    if (this.data.orientToCurve) {
      this.el.object3D.quaternion.setFromAxisAngle( this.axis, Math.PI / 2 );
    }
  },
  reset: function () {
    this.fraction = 0;

    this.scaleMod = .5 + Math.random().toFixed(2) * 2;
    console.log("resetting to "+ this.scaleMod);
    this.el.object3D.scale.set(this.scaleMod,this.scaleMod,this.scaleMod);
    if (this.data.type == "pictureGroup") {
      
    }

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
    scrollDirection: {default: 'x'},
    scrollSpeed: {default: .0001}
  },
  init: function () {
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
      this.axis = new THREE.Vector3();
      this.points = [];
      this.speed = this.data.scrollSpeed;
      this.picModIndex = 0;
      this.texture = null;
      // Define points along Z axis
      for (var i = 0; i < 5; i += 1) {
        this.points.push(new THREE.Vector3(0, 0, -100 * (i / 4)));
      }
      this.curve = new THREE.CatmullRomCurve3(this.points);
      // this.c_points = this.curve.getPoints( 50 );
      // // // this.c_geometry = new THREE.BufferGeometry().setFromPoints( this.c_points );//won't work with fatlines...
      // this.c_geometry = new THREE.BufferGeometry().setFromPoints( this.c_points );
      // this.c_material = new THREE.LineBasicMaterial( { color: 0x4287f5 } );
      // this.curveLine = new THREE.Line( this.c_geometry, this.c_material ); //this one stays a curve
      // const cgeometry = new THREE.BoxGeometry( 1, 1, 1 );
      // const cmaterial = new THREE.MeshPhongMaterial( { color: 0x99ffff, wireframe: false } );
      // this.objectToCurve = new THREE.Mesh( cgeometry, cmaterial );
      let picGroupMangler = document.getElementById("pictureGroupsData");



      if (picGroupMangler != null && picGroupMangler != undefined) {
        this.tileablePicData = picGroupMangler.components.picture_groups_control.returnTileableData();
        let picIndex = Math.floor(Math.random()*this.tileablePicData.images.length);
        this.texture = new THREE.TextureLoader().load( this.tileablePicData.images[picIndex].url );
        this.texture.encoding = THREE.sRGBEncoding;
        this.geometry = new THREE.BufferGeometry();    
        this.vertArray = this.curve.getPoints(70);
        this.geometry = new THREE.BufferGeometry().setFromPoints( this.curve.getPoints(70) );

        this.splineMesh = new THREE.Line(this.geometry, new THREE.LineBasicMaterial()); //another line to mod the vertexes
        this.tubeGeometry = new THREE.TubeGeometry(this.curve, 70, 10, 50, false);
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
        this.el.sceneEl.object3D.add(this.tubeMesh);
        this.loaded = true;
      } else {
        console.log("no pic");
      }
    },
    randomTexture: function() {
        let picIndex = Math.floor(Math.random()*this.tileablePicData.images.length);
        this.texture = new THREE.TextureLoader().load( this.tileablePicData.images[picIndex].url );
        this.tubeMaterial.map = this.texture;
        // this.tubeMaterial.map.wrapS = THREE.RepeatWrapping;
        // this.tubeMaterial.map.wrapT = THREE.RepeatWrapping;
        // this.tubeMaterial.map.repeat.set(4, 2);
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
      for (var i = 0, j = this.tubeGeometry.attributes.position.array.length; i < j; i += 3) { //TODO modzbelow to tweak the tunnel
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
      // this.tubeGeometry.attributes.position.needsUpdate = true; //not
      // this.tubeGeometry.computeVertexNormals();
    },
    tick: function () {
      if (this.loaded && this.tubeGeometry && this.tubeMaterial) {
        // console.log("modding speernd " + this.speed);
        if (this.data.scrollDirection == 'x') {
          this.tubeMaterial.map.offset.x += this.speed;
        }
        if (this.data.scrollDirection == 'y') {
          this.tubeMaterial.map.offset.y += this.speed;
        }
        // this.updateCurve();
      }
    }
});


AFRAME.registerComponent('mod_line', {
  schema: {
    init: {default: false},
    tags: {default: ''},
    originID: {default: ''},
    showLine: {default: false}
  },
  init: function () {
      this.positionMe = new THREE.Vector3();
      this.directionMe = new THREE.Vector3();
      this.equipHolder = document.getElementById("equipPlaceholder");
      this.equipHolder.object3D.getWorldPosition(this.positionMe); 
      this.equipHolder.object3D.getWorldDirection(this.directionMe).negate();

      this.loaded = false;
      this.verticleez = null;
      this.tubeGeometry_o = null;
      this.tubeGeometry = null;
      this.splineMesh = null;
      this.splineMesh_o = null;
      console.log("tryna make a mod_line");
      this.newPosition = null; 
      this.tangent = null;
      // this.radians = null; 
      this.fraction = 0;
      this.normal = new THREE.Vector3( 0, 1, 0 ); // up
      this.axis = new THREE.Vector3( );
      this.points = [];
      this.speed = .001;
      // // Define points along Z axis
      // for (var i = 0; i < 4; i += 1) {
      //   this.points.push(new THREE.Vector3(0, 0, -100 * (i / 4))); //
      // }
      this.equipHolder.object3D.getWorldPosition(this.positionMe); 
      this.equipHolder.object3D.getWorldDirection(this.directionMe).negate().normalize();

      this.points[0] = new THREE.Vector3();
      this.points[1] = new THREE.Vector3();
      this.points[2] = new THREE.Vector3();
      this.points[3] = new THREE.Vector3();

      this.curve = new THREE.CatmullRomCurve3(this.points);
      this.c_points = this.curve.getPoints( 50 );
      // // this.c_geometry = new THREE.BufferGeometry().setFromPoints( this.c_points );//won't work with fatlines...
      this.c_geometry = new THREE.BufferGeometry().setFromPoints( this.c_points );
      this.c_material = new THREE.LineBasicMaterial( { color: 0x00ff2a } );
      this.curveLine = new THREE.Line( this.c_geometry, this.c_material ); //this one stays a curve
      
      const cgeometry = new THREE.SphereGeometry( .1, 16, 8 );
      const cmaterial = new THREE.MeshBasicMaterial( { color: 0x00ff2a, wireframe: false, transparent: true, opacity: .5 } );
      this.objectToCurve = new THREE.Mesh( cgeometry, cmaterial );
      this.lineEnd = new THREE.Vector3();
      this.lineMiddle1 = new THREE.Vector3();
      this.lineMiddle2 = new THREE.Vector3();

      this.pointsCopy = [];
      this.pointsCopy[0] = new THREE.Vector3();
      this.pointsCopy[1] = new THREE.Vector3();
      this.pointsCopy[2] = new THREE.Vector3();
      this.pointsCopy[3] = new THREE.Vector3();

      this.pointsTemp = [];
      this.pointsTemp[0] = new THREE.Vector3();
      this.pointsTemp[1] = new THREE.Vector3();
      this.pointsTemp[2] = new THREE.Vector3();
      this.pointsTemp[3] = new THREE.Vector3();

      this.el.sceneEl.object3D.add(this.curveLine);
      this.el.sceneEl.object3D.add(this.objectToCurve);
      this.triggerAudioController = document.getElementById("triggerAudio");
      this.modValue = 0;
      window.addEventListener('mousedown', (e) => {
        e.preventDefault();
        this.data.showLine = true;
        if (this.triggerAudioController) {
          this.triggerAudioController.components.trigger_audio_control.loopToggle(true);
          this.triggerAudioController.components.trigger_audio_control.modLoop("rate", this.modValue);
        }
      });
      window.addEventListener('mouseup', (e) => {
        e.preventDefault();
        this.data.showLine = false;
        if (this.triggerAudioController) {
          this.triggerAudioController.components.trigger_audio_control.modLoop("rate", 0);
          this.triggerAudioController.components.trigger_audio_control.loopToggle(false);
        }
      }); 

    },
    // toggleLine(showLine) {
    //   if (showLine == ) {
    //     this.data.showLine = true;
    //   } else {
    //     this.data.showLine = false;
    //   }
    // },
    // from https://github.com/Mamboleoo/InfiniteTubes/blob/master/js/demo6.js
    updateCurve: function() {
      // console.log("tyrha updateCurve");
      // this.splineVerts = this.splineMesh.geometry.attributes.position.array;
      // this.splineVerts_o = this.splineMesh_o.geometry.attributes.position.array;
      // this.vert = null;
      // this.splineMesh.geometry.attributes.position.needsUpdate = true;

      this.equipHolder.object3D.getWorldPosition(this.positionMe);  //actually it's id "playCaster"
      this.equipHolder.object3D.getWorldDirection(this.directionMe).negate();

      // this.points[0].copy(this.positionMe);
      // this.points[0].copy( (this.positionMe ).add( this.directionMe.multiplyScalar( 1 )) );
      // this.points[1].copy( (this.positionMe ).add( this.directionMe.multiplyScalar( 5 )) );
      // this.points[2].copy( (this.positionMe ).add( this.directionMe.multiplyScalar( 10 )) );
      // this.points[3].copy( (this.positionMe ).add( this.directionMe.multiplyScalar( 15 )) );

      this.pointsTemp[0].copy( (this.positionMe ).addScaledVector( this.directionMe, .5 )); 
      this.pointsTemp[1].copy( (this.positionMe ).addScaledVector( this.directionMe, 5 )); 
      this.pointsTemp[2].copy( (this.positionMe ).addScaledVector( this.directionMe, 10 )); 
      this.pointsTemp[3].copy( (this.positionMe ).addScaledVector( this.directionMe, 15 )); 
      this.pointsCopy[0].copy(this.pointsTemp[0]);  
      this.pointsCopy[1].copy(this.pointsTemp[1]);  
      this.pointsCopy[2].copy(this.pointsTemp[2]);  
      this.pointsCopy[3].copy(this.pointsTemp[3]);  

      // this.points[1].copy( (this.positionMe ).addScaledVector( this.directionMe, 5 )); 
      // this.points[2].copy( (this.positionMe ).addScaledVector( this.directionMe, 10 )); 
      // this.points[3].copy( (this.positionMe ).addScaledVector( this.directionMe, 15 )); 
      // this.curve.points[1].x =-Math.ceil(Math.random() * 2) * (Math.round(Math.random()) ? 1 : -1);
      // this.curve.points[1].y =-Math.ceil(Math.random() * 2) * (Math.round(Math.random()) ? 1 : -1);
      // this.curve.points[2].x =Math.ceil(Math.random() *  2) * (Math.round(Math.random()) ? 1 : -1);
      // this.curve.points[2].y =Math.ceil(Math.random() *  2) * (Math.round(Math.random()) ? 1 : -1);
      // this.curve.points[3].x =-Math.ceil(Math.random() * 2) * (Math.round(Math.random()) ? 1 : -1);
      // this.curve.points[3].y =-Math.ceil(Math.random() * 2) * (Math.round(Math.random()) ? 1 : -1);

      // get the point in the middle
      // this.lineMiddle.lerpVectors(this.lineStart, this.lineEnd, 0.5); //maybe don't need...
      // console.log(JSON.stringify(this.lineStart), JSON.stringify(this.lineMiddle), JSON.stringify(this.lineEnd));
      // for (let i = 0; i < this.splineVerts.length; i += 3) { //typed array, only modding x [i] and y [i+1], z (length) stays same
      //   this.splineVerts[i] = this.splineVerts_o[i] + (( Math.random() - 0.5 ) / 4) - this.splineVerts[i]; 
        
      //   this.splineVerts[i + 1] = this.splineVerts_o[i + 1] + (( Math.random() - 0.5 ) / 4) - this.splineVerts[i + 1];
      // }
      // this.splineMesh.geometry.attributes.position.needsUpdate = true;

      this.fraction += 0.1;
      if ( this.fraction > 1) {

        // if (this.data.showLine) {
          this.fraction = 0;
          // this.pointsCopy[1].x =-Math.round(Math.random()) * (Math.round(Math.random()) ? 1 : -1);
          // this.pointsCopy[1].y =-Math.round(Math.random()) * (Math.round(Math.random()) ? 1 : -1);
          // this.pointsCopy[2].x =Math.round(Math.random()) * (Math.round(Math.random()) ? 1 : -1);
          // this.pointsCopy[2].y =Math.round(Math.random()) * (Math.round(Math.random()) ? 1 : -1);
          // this.pointsCopy[3].x =-Math.round(Math.random()) * (Math.round(Math.random()) ? 1 : -1);
          // this.pointsCopy[3].y =-Math.round(Math.random()) * (Math.round(Math.random()) ? 1 : -1);
          
          this.pointsCopy[1].x = Math.round(Math.random()) * (Math.round(Math.random()) ? 1 : -1);
          this.pointsCopy[1].y = Math.round(Math.random()) * (Math.round(Math.random()) ? 1 : -1);
          this.pointsCopy[2].x = Math.round(Math.random()) * (Math.round(Math.random()) ? 1 : -1);
          this.pointsCopy[2].y = Math.round(Math.random()) * (Math.round(Math.random()) ? 1 : -1);
          this.pointsCopy[3].x = Math.round(Math.random()) * (Math.round(Math.random()) ? 1 : -1);
          this.pointsCopy[3].y = Math.round(Math.random()) * (Math.round(Math.random()) ? 1 : -1);

          this.points[0].lerpVectors(this.pointsTemp[0], this.pointsCopy[0], 0.1); 
          this.points[1].lerpVectors(this.pointsTemp[1], this.pointsCopy[1], 0.1); 
          this.points[2].lerpVectors(this.pointsTemp[2], this.pointsCopy[2], 0.1); 
          this.points[3].lerpVectors(this.pointsTemp[3], this.pointsCopy[3], 0.1);
        // } 
       
      }
      // this.points[0].position.lerpVectors(this.pointsTemp[0], this.pointsCopy[0], 0.5); 
      // this.points[1].position.lerpVectors(this.pointsTemp[1], this.pointsCopy[1], 0.5); 
      // this.points[2].position.lerpVectors(this.pointsTemp[2], this.pointsCopy[2], 0.5); 
      // this.points[3].position.lerpVectors(this.pointsTemp[3], this.pointsCopy[3], 0.5); 
      // this.curve.geometry.position.attributes.needsUpdate = true;

      this.objectToCurve.position.copy( this.curve.getPoint( this.fraction ) );         
      this.tangent = this.curve.getTangent( this.fraction );
      this.axis.crossVectors( this.normal, this.tangent ).normalize( );  
      this.objectToCurve.quaternion.setFromAxisAngle( this.axis, Math.PI / 2 );
      this.c_points = this.curve.getPoints( 50 );
      this.c_geometry.setFromPoints(this.c_points);
      this.c_geometry.attributes.position.needsUpdate = true;
      // this.curveLine.geometry.attributes.position.needsUpdate = true;
    },
    tick: function () {
      if (this.curveLine && this.data.showLine) {
        // console.log("modding speernd " + this.speed);
        // this.tubeMaterial.map.offset.x += this.speed;
        this.updateCurve();
      }
    }
});

// AFRAME.registerShader('gradient', {
//   schema: {
//     topColor: {type: 'vec3', default: '1 0 0', is: 'uniform'},
//     bottomColor: {type: 'vec3', default: '0 0 1', is: 'uniform'},
//     offset: {type: 'float', default: '400', is: 'uniform'},
//     exponent: {type: 'float', default: '0.6', is: 'uniform'}
//   },
//   vertexShader: [
//     'varying vec3 vWorldPosition;',

//     'void main() {',

//     'vec4 worldPosition = modelMatrix * vec4( position, 1.0 );',
//     'vWorldPosition = worldPosition.xyz;',

//      'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );',

//     '}'
//   ].join('\n'),
//   fragmentShader: [
//     'uniform vec3 bottomColor;',
//     'uniform vec3 topColor;',
//     'uniform float offset;',
//     'uniform float exponent;',
//     'varying vec3 vWorldPosition;',
//     'void main() {',
//     ' float h = normalize( vWorldPosition + offset ).y;',
//     ' gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max(h, 0.0 ), exponent ), 0.0 ) ), 1.0 );',
//     '}'
//   ].join('\n')
// });

// AFRAME.registerPrimitive('a-gradient-sky', {
//   defaultComponents: {
//     geometry: {
//       primitive: 'sphere',
//       radius: 5000,
//       segmentsWidth: 64,
//       segmentsHeight: 20
//     },
//     material: {
//       shader: 'gradient'
//     },
//     scale: '-1 1 1'
//   },

//   mappings: {
//     topColor: 'material.topColor',
//     bottomColor: 'material.bottomColor',
//     offset: 'material.offset',
//     exponent: 'material.exponent'
//   }
// });

//  from https://stackoverflow.com/questions/57820253/a-frame-converts-my-svg-into-a-pixel-image

AFRAME.registerComponent('loadsvg_xhr', {
  init: function() {  

      let textData = document.getElementById('sceneTextItems');
      let murl = "/svg/" + textData.getAttribute('data-attribute');
      console.log("tryna get svg " + murl);
      var img = new Image();
      var xhr = new XMLHttpRequest();
      xhr.open("get", murl, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send();
      xhr.onload = function () {
        if (this.responseText != null) {

          let canvas = document.getElementById('flying_canvas');
          // let textData = document.getElementById('sceneTextItems');
          // let murl = "/svg/" + textData.getAttribute('data-attribute');
          // console.log("tryna get svg " + murl);
          // let ctx = canvas.getContext('2d');

          // var url = "";
         
          console.log("tryna snet an svg to canvas...");
          let blob = new Blob([this.responseText], {type: 'image/svg+xml'});
          let url = URL.createObjectURL(blob);
          img.src = url;
        
        
        }
      }
      img.onload = () => {
        //ctx.fillStyle = "rgba(255, 255, 255, 0.0)";
        //ctx.fillRect(0, 0, 256, 256); 
        ctx.drawImage(img, 0, 0, 1024, 1024);
        
        let mesh = this.el.getObject3D("mesh")
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        var material = new THREE.MeshBasicMaterial({ 
          map: texture, 
          transparent: true
        });
        
        let tmp = mesh.material
        mesh.material = material
        tmp.dispose()
        // URL.revokeObjectURL(url);
    }
  }
});


AFRAME.registerComponent('loadsvg_blob', { //use this one with embedded font
  init: function() {  
      
        let canvas = document.getElementById('flying_canvas');
        let svgData = document.querySelectorAll("[svgItem]")[0];
        // let textData = document.getElementById('svgItem');
        if (svgData)  {
          
          // let murl = "/svg/" + textData.getAttribute('data-attribute');
          console.log("tryna get svg " + svgData);
          let ctx = canvas.getContext('2d');
          var img = new Image();
          let blob = new Blob([svgData.innerHTML], {type: 'image/svg+xml'});
          let url = URL.createObjectURL(blob);
          img.src = url;
        
          // var url = "";
          img.onload = () => {
              //ctx.fillStyle = "rgba(255, 255, 255, 0.0)";
              //ctx.fillRect(0, 0, 256, 256); 
              ctx.drawImage(img, 0, 0, 1024, 1024);
              
              let mesh = this.el.getObject3D("mesh")
              var texture = new THREE.Texture(canvas);
              texture.needsUpdate = true;

              var material = new THREE.MeshBasicMaterial({ 
                map: texture, 
                transparent: true
              });
              
              let tmp = mesh.material
              mesh.material = material
              tmp.dispose()
              URL.revokeObjectURL(url);
          }
          console.log("tryna set an inline svg to canvas...");
          this.el.setAttribute("visible", true);
          // let src = svgEl.innerHTML;
        }
    }
});


AFRAME.registerComponent('loadsvg', {
  schema: {
    init: {default: false},
    id: {default: ""},
    eventdata: {default: ''},
    tags: {default: ''}
    },
  init: function() {
      // grab the canvas element
      // var canvas = document.querySelector(".canvasItem");
      var canvas = document.getElementById("svg_canvas_"+ this.data.id);
      var ctx = canvas.getContext('2d');

      // let svgData = document.querySelector(".svgItem");
      let svgData = document.getElementById("svg_item_"+ this.data.id);

      // if (this.data.eventdata) {
      //   let altSvgData = document.getElementById(this.data.eventdata);
      //   if (altSvgData) {
      //     svgData = altSvgData;
      //   }
      // }

      if (svgData != null) {
        // create an image, which will contain the svg data
        var img = new Image();

        // this will be triggered when the provided .svg is loaded
        img.onload = () => {
          // draw the image on the canvas
          ctx.drawImage(img, 0, 0, 1024, 1024);

          // create the texture and material
          let texture = new THREE.Texture(canvas);
          texture.needsUpdate = true;
          let material = new THREE.MeshBasicMaterial({ 
            map: texture,
            transparent: true
            // transparent: true

          });

          // grab the mesh, replace the material, dispose the old one
          let mesh = this.el.getObject3D("mesh")
          let tmp = mesh.material
          mesh.material = material
          tmp.dispose()
        }
        // provide the .svg file as the image source 
        // console.log(svgData.innerHTML);
        let blob = new Blob([svgData.innerHTML], {type: 'image/svg+xml'});
        let url = URL.createObjectURL(blob); //necessary to include the embedded font
        img.src = url;
        // img.src = svgData.innerHTML;
      }
    }
});


AFRAME.registerComponent('load_threesvg', {
  schema: {
  
    init: {default: false},
    id: {default: ""},
    eventdata: {default: ''},
    tags: {default: ''},
    width: {default: 600},
    height: {default: 600}
    },
  init: function() {
      // instantiate a loader
    const loader = new SVGLoader();
    let svgUrl = "/svg/" + this.data.id;
    // load a SVG resource
    console.log("tryna get svg " + svgUrl);
    // loader.load(
    //     // resource URL
    //     murl,
    //     // called when the resource is loaded
    //     function ( data ) {

    loader.loadAsync(svgUrl).then((data) => {
          
          const paths = data.paths;
          const group = new THREE.Group();

          for ( let i = 0; i < paths.length; i ++ ) {

            const path = paths[ i ];

            const material = new THREE.MeshBasicMaterial( {
              color: path.color,
              transparent: true,
              // side: THREE.DoubleSide,
              depthWrite: false
            } );

            const shapes = SVGLoader.createShapes( path );

            for ( let j = 0; j < shapes.length; j ++ ) {

              const shape = shapes[ j ];
              const geometry = new THREE.ShapeGeometry( shape );
              const mesh = new THREE.Mesh( geometry, material );
              
              group.scale.setScalar(0.1);
              group.scale.y *= -1;

              // group.scale.set(1) *= -1;
              group.add( mesh );
            }

          }

                        // group.scale.multiplyScalar( 0.25 );
          group.position.x =- ( 50 );

          // group.rotation.set(0, 0, 0);
          group.position.y =+ ( 50 );
          this.el.setObject3D("mesh", group);
          // this.el.Object3D.position.set(0,0,0);
          // this.el.sceneEl.add( group );

        },
        // called when loading is in progresses
        function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

          console.log( 'An error happened' );

        }
      );
    }
});
  function LiveCanvasFont(fontName) {
    console.log("tryna load canvas font.." + fontName);
    let liveCanvasEl = document.getElementById("flying_info_canvas");
    if (liveCanvasEl) {
      let mod1 = fontName.replace(" ", "+");
      // let fontURL = "http://localhost:3000/fonts/web/" + fontID.toLowerCase() + ".woff2";
      let fontURL = "url('https://fonts.googleapis.com/css?family="+mod1+"')";
      // // this.fontURL = "url(https://fonts.googleapis.com/css?family=Sofia)";
      console.log("tryna get font: " +  fontURL);
      const myFont = new FontFace('thisfont', fontURL);
      myFont.load().then((font) => {
        document.fonts.add(font);
        console.log('Font loaded');
        liveCanvasEl.components.live_canvas.fontLoaded();
      });
    }


    var loadCSS = function(url, callback){
      var link = document.createElement('link');
          link.type = 'text/css';
          link.rel = 'stylesheet';
          link.href = url;
  
      document.getElementsByTagName('head')[0].appendChild(link);
  
      var img = document.createElement('img');
          img.onerror = function(){
              if(callback) callback(link);
          }
          img.src = url;
  }
  }

  AFRAME.registerComponent('live_canvas', {
    dependencies: ['geometry', 'material'],
    schema: {
      src: { type: "string", default: "#id"}
    },
    init() {
      this.isReady = false;
      if (!document.querySelector(this.data.src)) {
        console.error("no such canvas")
        return
      }
      this.canvas = document.querySelector(this.data.src);
      this.context = this.canvas.getContext('2d');
      this.tick = AFRAME.utils.throttleTick(this.tick, 1000, this);
      // this.fontEl = document.getElementById("sceneFontWeb1");
      // this.font = null;
      if (this.fontEl) {
        let fontID = this.fontEl.getAttribute('data-attribute');
        // LiveCanvasFont(fontID);
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'http://fonts.googleapis.com/css?family=Lobster';
        document.getElementsByTagName('head')[0].appendChild(link);

        // Trick from http://stackoverflow.com/questions/2635814/
        var image = new Image;
        image.src = link.href;
        image.onerror = () => { //clever girl, spoof the mime type to get a callback when the link-not-image is loaded
          console.log("tryna get font: " +  link.href);
            this.context.font = '150px "Lobster"';
            this.context.textBaseline = 'top';
            this.context.fillText('Hello!', 20, 10);
        };

         
      } else {
        // console.log("no font found..");
        // this.context.font='bold 100px Arial';
        // let mod1 = settings.sceneFontWeb1.replace(" ", "+");
        // // styleIncludes += "<link rel=\x22stylesheet\x22 href=\x22https://fonts.googleapis.com/css?family="+mod1+"\x22></link>\x22";
        // this.fontURL = "url('https://fonts.googleapis.com/css?family="+mod1+"')";

        // this.fontURL = "url(https://fonts.googleapis.com/css?family=Sofia)";

        // console.log("tryna get font: " + this.fontURL);
        // let efont = new FontFace(settings.sceneFontWeb1, this.fontURL );
        //
        // efont.loadAsync().then(function (font) { 
        //   document.fonts.add(font);
        //   // Ready to use the font in a canvas context
        //   console.log("font ready!");
        //   document.fonts.add(font); 
        //   // this.context.font='100px efont';
         
        // });

        this.context.font = '100px "Arial"';
        this.el.setAttribute('material', 'src', this.data.src);
        this.isReady = true;
      }



      this.time = 0;

    //  if (!this.font) {
      
    //  } else {

    //  }
    },
    fontLoaded () {
      this.context.font = '100px' + settings.sceneFontWeb1;
      this.el.setAttribute('material', 'src', this.data.src);
      this.isReady = true;
    },
    tick(time, deltaTime) {
      if (this.isReady) {
      var material;
      material = this.el.getObject3D('mesh').material;
      if (!material.map) {
        console.error("no material map");
        this.el.removeAttribute('live_canvas');
        return;
      }
      this.time = Math.round(time/1000);
      this.context.clearRect(0,0,1024,1024);
      // this.context.fillStyle = "red";
      this.context.textAlign = "center";
      // ctx.font = 'bold 88px Arial';
      this.context.strokeStyle = 'white';
      // this.context.strokeWidth = 5px
      this.context.fillStyle = 'rgba(20,20,20,0.5)';
      this.context.lineWidth = 5;
      this.context.beginPath();
      this.context.roundRect(10, 333, 1000, 333, 20);
      this.context.stroke();
      this.context.fill();
      this.context.strokeStyle = 'red';
      this.context.fillStyle = 'white';
      this.context.strokeText("Elapsed time: " + this.time, this.canvas.width/2, this.canvas.height/2);
      this.context.fillText("Elapsed time: " + this.time, this.canvas.width/2, this.canvas.height/2);
      material.map.needsUpdate = true;
      }
    }
  });

  AFRAME.registerComponent('transform_controls', {
    schema: {
      isAttached: {default: true}
    },
    init: function() {
      console.log("tryna attach transform controls to el " + this.el.id );
      this.control = new TransformControls(this.el.sceneEl.camera, this.el.sceneEl);
      this.control.attach(this.el.getObject3D('mesh'));
      this.control.size = .5;
      // this.el.sceneEl.add();
      this.el.sceneEl.object3D.add( this.control);
      this.object = this.el.getObject3D("mesh");
      let that = this;
      this.position = new THREE.Vector3();
      this.quaternion = new THREE.Quaternion();
      this.euler = new THREE.Euler();
      this.scale = new THREE.Vector3();
      this.rotation = new THREE.Vector3();
      this.minMove = new THREE.Vector3( - 100, - 100, - 100 );
      this.maxMove = new THREE.Vector3( 100, 100, 100 );
      this.minScale = new THREE.Vector3( - 10, - 10, - 10 );
      this.maxScale = new THREE.Vector3( 10, 10, 10 );
      // this.targetEl = null;
      // for (let i = 0; i < sceneLocations.locations.length; i++) {
      //   if (this.el.id == sceneLocations.locations[i].timestamp) {

      //   }
      // }
      // this.mod_model_component = this.el.components.mod_model;
      // this.mod_object_component = this.el.components.mod_object
      // this.control.addEventListener('objectChanged',  ( event ) => {
      //   // this.el.getAttribute("position")
      //   // console.log(this.el.getAttribute("position"));
      //   this.object.getWorldPosition(this.position);
      //   // this.el.setAttribute("position", this.position);
      //   // console.log(this.position);
      //   // this.el.getObject3D('mesh').position
      // });
      // this.control.addEventListener('change',  ( event ) => { 
      //   this.control.object.position.clamp(this.minMove, this.maxMove);
      //   this.control.object.scale.clamp(this.minScale, this.maxScale);
      // });
      this.el.classList.add("transformControls");
      this.control.addEventListener('mouseUp',  ( event ) => {
        // this.el.getAttribute("position")
        // console.log(this.el.getAttribute("position"));
        this.object.updateMatrix();
        this.object.getWorldPosition(this.position);
        // this.object.getWorldQuaternion(this.quaternion);
        this.euler = this.object.rotation;
        // this.euler.setFromQuaternion(this.quaternion);

        this.object.getWorldScale(this.scale); //TODO use all coords, not just 1
        // this.rotation = this.object.rotation;
        // this.el.setAttribute("position", this.position);
        this.rotation.x = THREE.MathUtils.radToDeg(this.euler.x);
        this.rotation.y = THREE.MathUtils.radToDeg(this.euler.y);
        this.rotation.z = THREE.MathUtils.radToDeg(this.euler.z);
        console.log("transforms to : "+ JSON.stringify(this.position) + JSON.stringify(this.rotation) + JSON.stringify(this.scale));
        
        // // this.el.getObject3D('mesh').position
        // if (this.rotation.x == 180 || this.rotation.x == -180) {
        //   this.rotation.x = 0;
        // } 
        // if (this.rotation.y == 180 || this.rotation.y == -180) {
        //   this.rotation.z = 0;
        // } 
        // if (this.rotation.z == 180 || this.rotation.z == -180) {
        //   this.rotation.z = 0;
        // } 
        
       
        // this.object.position.set(0, 0, 0);
        if (localData.locations.length > 0) { 
          for (let i = 0; i < localData.locations.length; i++) {
            if (this.el.id == localData.locations[i].timestamp) {  
              localData.locations[i].x = this.position.x.toFixed(2);
              localData.locations[i].y = this.position.y.toFixed(2);
              localData.locations[i].z = this.position.z.toFixed(2);
              localData.locations[i].eulerx = this.rotation.x.toFixed(2);
              localData.locations[i].eulery = this.rotation.y.toFixed(2);
              localData.locations[i].eulerz = this.rotation.z.toFixed(2);
              localData.locations[i].markerObjScale = this.scale.x.toFixed(2);
              localData.locations[i].xscale = this.scale.x.toFixed(2);
              localData.locations[i].yscale = this.scale.y.toFixed(2);  
              localData.locations[i].zscale = this.scale.z.toFixed(2);
              localData.locations[i].isLocal = true;

              console.log("saving location data: " + JSON.stringify(localData.locations[i]));
              // document.getElementById('xpos').value = this.position.x.toFixed(2);
              // document.getElementById('ypos').value = this.position.y.toFixed(2);
              // document.getElementById('zpos').value = this.position.z.toFixed(2);
              // document.getElementById('xrot').value = this.rotation.x.toFixed(2);
              // document.getElementById('yrot').value = this.rotation.x.toFixed(2);
              // document.getElementById('zrot').value = this.rotation.x.toFixed(2);
              // document.getElementById('modelScale').value = this.scale.x.toFixed(2);
              // this.el.setAttribute("position", this.position);
              SaveLocalData();
              
              break;
            }
          }
        } else {
          ///init localData if empty...
          // for (let key in settings) {
          //   localData.settings[key] = settings[key]; //TODO apply each one?
          // }
          // for (let i = 0; i < sceneLocations.locations.length; i++) {
          //   localData.locations.push(sceneLocations.locations[i]);
          // }
          // let loc = {};
          // loc.x = this.position.x.toFixed(2);
          // loc.y = this.position.y.toFixed(2);
          // loc.z = this.position.z.toFixed(2);
          // loc.eulerx = this.rotation.x.toFixed(2);
          // loc.eulery = this.rotation.y.toFixed(2);
          // loc.eulerz = this.rotation.z.toFixed(2);
          // loc.markerObjScale = this.scale.x.toFixed(2);
          // loc.timestamp = this.el.id;
          // localData.locations.push(loc);
          for (let i = 0; i < sceneLocations.locations.length; i++) {
            if (this.el.id == sceneLocations.locations[i].timestamp) {  
              sceneLocations.locations[i].x = this.position.x.toFixed(2);
              sceneLocations.locations[i].y = this.position.y.toFixed(2);
              sceneLocations.locations[i].z = this.position.z.toFixed(2);
              sceneLocations.locations[i].eulerx = this.rotation.x.toFixed(2);
              sceneLocations.locations[i].eulery = this.rotation.y.toFixed(2);
              sceneLocations.locations[i].eulerz = this.rotation.z.toFixed(2);
              sceneLocations.locations[i].markerObjScale = this.scale.x.toFixed(2);
              // document.getElementById('xpos').value = this.position.x.toFixed(2);
              // document.getElementById('ypos').value = this.position.y.toFixed(2);
              // document.getElementById('zpos').value = this.position.z.toFixed(2);
              // document.getElementById('xrot').value = this.rotation.x.toFixed(2);
              // document.getElementById('yrot').value = this.rotation.x.toFixed(2);
              // document.getElementById('zrot').value = this.rotation.x.toFixed(2);
              // document.getElementById('modelScale').value = this.scale.x.toFixed(2);
              // this.el.setAttribute("position", this.position);
              SaveLocalData();
              break;
            }
          }
          // SaveLocalData();
          
        }

      });
      window.addEventListener( 'keydown',  ( event ) => {

        switch ( event.keyCode ) {

          case 81: // Q
            this.control.setSpace( this.control.space === 'local' ? 'world' : 'local' );
            break;

          case 16: // Shift
            this.control.setTranslationSnap( 100 );
            this.control.setRotationSnap( THREE.MathUtils.degToRad( 15 ) );
            this.control.setScaleSnap( 0.25 );
            break;

          case 87: // W
            this.control.setMode( 'translate' );
            break;

          case 69: // E
            this.control.setMode( 'rotate' );
            break;

          case 82: // R
            this.control.setMode( 'scale' );
            break;

          case 67: // C
            // const position = currentCamera.position.clone();

            // currentCamera = currentCamera.isPerspectiveCamera ? cameraOrtho : cameraPersp;
            // currentCamera.position.copy( position );

            // orbit.object = currentCamera;
            // this.control.camera = currentCamera;

            // currentCamera.lookAt( orbit.target.x, orbit.target.y, orbit.target.z );
            // onWindowResize();
            break;

          case 86: // V
            // const randomFoV = Math.random() + 0.1;
            // const randomZoom = Math.random() + 0.1;

            // cameraPersp.fov = randomFoV * 160;
            // cameraOrtho.bottom = - randomFoV * 500;
            // cameraOrtho.top = randomFoV * 500;

            // cameraPersp.zoom = randomZoom * 5;
            // cameraOrtho.zoom = randomZoom * 5;
            onWindowResize();
            break;

          case 187:
          case 107: // +, =, num+
            this.control.setSize( this.control.size + 0.1 );
            break;

          case 189:
          case 109: // -, _, num-
            this.control.setSize( Math.max( this.control.size - 0.1, 0.1 ) );
            break;

          case 88: // X
            this.control.showX = ! this.control.showX;
            break;

          case 89: // Y
            this.control.showY = ! this.control.showY;
            break;

          case 90: // Z
            this.control.showZ = ! this.control.showZ;
            break;

          case 32: // Spacebar
            this.control.enabled = ! this.control.enabled;
            break;

          case 27: // Esc
            this.control.reset();
            break;

        }

      } );

      window.addEventListener( 'keyup', ( event ) => {

        switch ( event.keyCode ) {

          case 16: // Shift
            this.control.setTranslationSnap( null );
            this.control.setRotationSnap( null );
            this.control.setScaleSnap( null );
            break;

        }

      } );
    },
    detachTransformControls: function () {
      console.log("tryna detach controls...");
      this.control.detach();
      this.data.isAttached = false;
    },
    attachTransformControls: function () {
      console.log("tryna attach controls...");
      this.control.attach(this.object);
      this.data.isAttached = true;
    }
  });
  AFRAME.registerComponent('loadcanvas', {
    init: function() {
      // this.canvas = document.getElementById("flying_canvas");
      this.canvas = document.createElement("canvas");
      this.context = this.canvas.getContext('2d');
      // this.context.clearRect(0, 0, 1024, 1024)
      // this.context.strokeStyle = "rgb(255, 0, 0)";
      // this.context.fillStyle = "rgba(255, 255, 0, .5)";

      this.context.beginPath();
      this.context.roundRect(0, 0, 200, 100, 10);
      this.context.stroke();
      this.context.fill();
     
      this.context.font='bold 32px Arial';
      this.context.fillStyle = "red";
      this.context.textAlign = "center";
      // ctx.font = 'bold 88px Arial';
      this.context.strokeStyle = 'red';
      this.context.fillStyle = 'white';
      this.context.lineWidth = 2;
      this.context.strokeText("Hello World!", this.canvas.width/2, this.canvas.height/2);
      this.context.fillText("Hello World!", this.canvas.width/2, this.canvas.height/2);
      // this.context.strokeText("Hello World", this.canvas.width/2, this.canvas.height/2);
      // this.context.fillText('Hello World', 10,30);		


      let mesh = this.el.getObject3D("mesh");
      var texture = new THREE.Texture(this.canvas);
      texture.needsUpdate = true;

      var material = new THREE.MeshBasicMaterial({ 
        map: texture, 
        transparent: true
      });
      
      let tmp = mesh.material
      mesh.material = material
      tmp.dispose();
            
      // let material = this.el.getObject3D('mesh').material;
      //   if (!material.map) {
      //    	return;
      //   } else {
      //     material.map.needsUpdate = true;
      //   }  	
      // }
      // this.x = 200;
      // this.y = 100;
      // this.dx = 5;
      // this.dy = 3;
    }
    
    // tick: function(t)
    // {
    // 	this.x += this.dx;
    // 	this.y += this.dy;
      
    // 	if (this.x > 512-50 || this.x < 0)
    // 		this.dx *= -1;
    // 	if (this.y > 512-50 || this.y < 0)
    // 		this.dy *= -1;
    
    // 	// clear canvas
    // 	this.context.fillStyle = "#8888FF";
    // 	this.context.fillRect(0,0, 512,512);
      
    // 	// draw rectangle
    // 	this.context.fillStyle = "#FF0000";
    // 	this.context.fillRect( this.x, this.y, 50, 50 );

    // 	// thanks to https://github.com/aframevr/aframe/issues/3936 for the update fix
    // 	let material = this.el.getObject3D('mesh').material;
    //     if (!material.map) {
    //      	return;
    //     } else {
    //       material.map.needsUpdate = true;
    //     }
            
    // }
    
  });
//from https://dk-dust.glitch.me/
  AFRAME.registerComponent("dust", {
    init: function () {
      console.log("init");
      this.dist = 50.0;

      // Create a particle system
      this.particleCount = 2500;
      const positions = new Float32Array(this.particleCount * 3);
      const velocities = new Float32Array(this.particleCount * 3);

      const rv = 0.01;

      for (let i = 0; i < this.particleCount; i++) {
        // const x = Math.random() * 10 - 5;
        // const y = Math.random() * 10 - 5;
        // const z = Math.random() * 10 - 5;
        const x = THREE.MathUtils.randFloatSpread(75);
        const y =THREE.MathUtils.randFloat(1,20);
        const z = THREE.MathUtils.randFloatSpread(75);
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        velocities[i * 3] = Math.random() * rv - rv / 2;
        velocities[i * 3 + 1] = Math.random() * rv - rv / 2;
        velocities[i * 3 + 2] = Math.random() * rv - rv / 2;
      }

      this.particleGeometry = new THREE.BufferGeometry();
      this.particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      this.particleGeometry.setAttribute(
        "velocity",
        new THREE.BufferAttribute(velocities, 3)
      );
      var colors = [];
      var color = new THREE.Color();
      var colorList = ['skyblue', 'navy', 'blue'];
      if (settings && settings.sceneColor2 && settings.sceneColor3 && settings.sceneColor4 ) {
        colorList = [settings.sceneColor2, settings.sceneColor3, settings.sceneColor4];
      }
      for (let i = 0; i < this.particleGeometry.attributes.position.count; i++) {
        color.set(colorList[THREE.MathUtils.randInt(0, colorList.length - 1)]);
        color.toArray(colors, i * 3);
      }
      this.particleGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
      // const particleMaterial = new THREE.PointsMaterial({
      //   map: new THREE.TextureLoader().load(
      //     "http://servicemedia.s3.amazonaws.com/assets/pics/sparkle.png"
      //   ),
      //   opacity: 0.9,
      //   transparent: true,
      //   color: 0xffffff,
      //   size: 0.5,
      // });
      const material = new THREE.PointsMaterial({ size: .25, map: new THREE.TextureLoader().load("http://servicemedia.s3.amazonaws.com/assets/pics/sparkle.png"), 
                                                opacity: 0.5, blending: THREE.AdditiveBlending, depthTest: false, transparent: true, vertexColors: true });
      this.particleSystem = new THREE.Points(
        this.particleGeometry,
        material
      );
      this.el.setObject3D("mesh", this.particleSystem);
    },

    tick: function (t, dt) {
      // Move particles
      const positionsArray =
        this.particleGeometry.attributes.position.array;
      const velocityArray = this.particleGeometry.attributes.velocity.array;
      for (let i = 0; i < this.particleCount; i++) {
        positionsArray[i * 3] += velocityArray[i * 3];
        positionsArray[i * 3 + 1] += velocityArray[i * 3 + 1];
        positionsArray[i * 3 + 2] += velocityArray[i * 3 + 2];

        // Wrap particles around when they go beyond a certain range
        if (positionsArray[i * 3] > this.dist) positionsArray[i * 3] = -this.dist;
        if (positionsArray[i * 3 + 1] > this.dist)
          positionsArray[i * 3 + 1] = -this.dist;
        if (positionsArray[i * 3 + 2] > this.dist)
          positionsArray[i * 3 + 2] = -this.dist;
        if (positionsArray[i * 3] < -this.dist) positionsArray[i * 3] = this.dist;
        if (positionsArray[i * 3 + 1] < -this.dist)
          positionsArray[i * 3 + 1] = this.dist;
        if (positionsArray[i * 3 + 2] < -this.dist)
          positionsArray[i * 3 + 2] = this.dist;
      }

      this.particleGeometry.attributes.position.needsUpdate = true;
    },
  });