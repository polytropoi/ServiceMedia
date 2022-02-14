// import { Pathfinding } from '/three/pathfinding/three-pathfinding.umd.js';

// 
// const Pathfinding = window.threePathfinding.Pathfinding; //UMD
// const pathfinding = new Pathfinding();

/**
 * nav-mesh
 *
 * Waits for a mesh to be loaded on the current entity, then sets it as the
 * nav mesh in the pathfinding system.
 */
// AFRAME.registerComponent('nav-mesh', {
//   schema: {
//     nodeName: {type: 'string'}
//   },

//   init: function () {
//     this.system = this.el.sceneEl.systems.nav;
//     this.hasLoadedNavMesh = false;
//     this.nodeName = this.data.nodeName;
//     this.el.addEventListener('object3dset', this.loadNavMesh.bind(this));
//   },

//   play: function () {
//     if (!this.hasLoadedNavMesh) this.loadNavMesh();
//   },

//   loadNavMesh: function () {
//     var self = this;
//     const object = this.el.getObject3D('mesh');
//     const scene = this.el.sceneEl.object3D;

//     if (!object) return;

//     let navMesh;
//     object.traverse((node) => {
//       if (node.isMesh &&
//           (!self.nodeName || node.name === self.nodeName)) navMesh = node;
//     });

//     if (!navMesh) return;

//     scene.updateMatrixWorld();
//     this.system.setNavMeshGeometry(navMesh.geometry);
//     this.hasLoadedNavMesh = true;
//   }
// });

AFRAME.registerComponent('nav_mesh', { 
    schema: {
      initialized: {default: false},
      show: {default: false}
    },
    init: function(){
        // this.tick = AFRAME.utils.throttleTick(this.tick, 100, this);
        this.navmesh = null;
        console.log("tryna init navmesh + show " + this.data.show);
        this.navmeshIsActive = true;
        this.showMesh = false;
        this.el.addEventListener('model-loaded', () => {
            const obj = this.el.getObject3D('mesh');
        
            // _navmesh.material.visible = false;
            if (!this.data.show) {
                // obj.visible = false;
            }
            obj.traverse((node) => {
                if (node.isMesh) this.navmesh = node;
                this.initPathfinding();
            });     
        });
        
    },
    initPathfinding: function () {
        THREE.Pathfinding = window.threePathfinding.Pathfinding;
        THREE.PathfindingHelper = threePathfinding.PathfindingHelper;
        const pathfinder = new THREE.Pathfinding();
        const helper = new THREE.PathfindingHelper();
        const ZONE = 'level';
  
        if (this.navmesh != null) {
            console.time('createZone()');
            const zone = THREE.Pathfinding.createZone(this.navmesh.geometry);
            console.timeEnd('createZone()');
            pathfinder.setZoneData( ZONE, zone );
            this.pathfinder = pathfinder;
            this.helper = helper;
            this.player = document.getElementById("player");
            this.zone = ZONE;
            this.lastPosition = null;
            this.clamped = new THREE.Vector3();  
            this.closestPlayerNode = null;
            this.groupID = null;
            this.distance = 0;
            this.get_pos_rot = document.getElementById("player").components.get_pos_rot; 
            this.posReader = null;
            if (this.get_pos_rot != null) {
                this.posReader = this.get_pos_rot.returnPos();
            }
        // this.resetNavmesh();
            
        }
    },
    stick: function () {
      
        // console.log(this.navmeshIsActive + " this.distance " + this.distance);// + " " + JSON.stringify(this.lastPosition) + " " + this.posReader);
        // if (this.navmeshIsActive) {
            if (this.posReader != null && this.pathfinder != null) {
                // console.log("tyrna tick" + JSON.stringify(this.lastPosition ));
                
                if (this.lastPosition != null && this.lastPosition.x != 0 && this.lastPosition .z != 0) {
                this.helper.reset();
                this.helper.setPlayerPosition(this.lastPosition);
                this.groupID = this.pathfinder.getGroup( this.zone, this.lastPosition);
                // this.lastPosition = null;
                if (this.groupID != null && this.lastPosition != null) {
                    this.closestPlayerNode = this.pathfinder.getClosestNode( this.lastPosition, this.zone, this.groupID );
                        if (this.closestPlayerNode != null && this.lastPosition != null) {
                        this.pathfinder.clampStep(this.lastPosition, this.posReader, this.closestPlayerNode, this.zone, this.groupID, this.clamped );
                        this.clamped.y = (this.clamped.y + 1.6).toFixed(2);
                        this.clamped.x = this.clamped.x.toFixed(2);
                        this.clamped.z = this.clamped.z.toFixed(2);
                        
                        // console.log(JSON.stringify(window.playerPosition) + " vs clamped :" + JSON.stringify(this.clamped));
                        // this.player.object3D.position.copy(this.clamped);
                        if (this.lastPosition != null && this.clamped != null) {
                            this.distance = this.lastPosition.distanceTo(this.clamped); 
                            console.log(JSON.stringify(this.lastPosition) + " vs clamped :" + JSON.stringify(this.clamped) + 'distance: ' + this.distance);
                            
                            if (this.distance > .2) {
                                this.player.components.player_mover.move('player', this.clamped, null, 0);
                            } 
                            if (this.distance > 2) {
                                console.log("navmeshIsActive false");
                                // that.navmeshIsActive = null;
                                this.resetNavmesh(); //elsewise she gets lost...
                                
                                // this.resetNavmesh();
                                }
                            }
                        }
                    }
                    this.lastPosition = this.posReader;         
                } else {
                    this.lastPosition = this.posReader;
                }
            
        } else { 
            this.get_pos_rot = document.getElementById("player").components.get_pos_rot; 
            if (this.get_pos_rot) {
                this.posReader = this.get_pos_rot.returnPos();
            }    
        }
    // }//navmeshisactive
    },
    resetNavmesh: function () {
        // this.navmeshIsActive = false;
        this.pasthfinder = null;
        this.posReader = null;
        this.lastPosition = null;
        this.clamped = null;
        this.distance = 0;
        GoToNext();
        this.initPathfinding();
        // setTimeout(function () {
            
        //     this.navmeshIsActive = true;
        //     console.log(this.navmeshIsActive);
        // }, 1000);
    },
    showHideNavmesh: function () {
        this.showMesh = !this.showMesh;
        this.el.getObject3D('mesh').visible = this.showMesh;
    }

});