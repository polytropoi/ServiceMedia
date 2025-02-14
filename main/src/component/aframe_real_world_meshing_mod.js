//modded from https://github.com/aframevr/aframe/blob/master/src/components/scene/real-world-meshing.js
/**
 * Real World Meshing.
 *
 * Create entities with meshes corresponding to 3D surfaces detected in user's environment.
 * It requires a browser with support for the WebXR Mesh and Plane detection modules.
 *
 */
AFRAME.registerComponent('real_world_meshing_mod', {
  schema: {

    planeMixin: {default: ''},
    meshMixin: {default: true},
    meshesEnabled: {default: true},
    planesEnabled: {default: true},
    filterLabels: {type: 'array'},
    filtersEnabled: {default: false}
    // usePhysicsType: {default: 'ammo'}
  },

  sceneOnly: true,

  init: function () {
    var webxrData = this.el.getAttribute('webxr');
    var requiredFeaturesArray = webxrData.requiredFeatures;
    if (requiredFeaturesArray.indexOf('mesh-detection') === -1) {
      requiredFeaturesArray.push('mesh-detection');
      this.el.setAttribute('webxr', webxrData);
    }
    if (requiredFeaturesArray.indexOf('plane-detection') === -1) {
      requiredFeaturesArray.push('plane-detection');
      this.el.setAttribute('webxr', webxrData);
    }
    this.meshEntities = [];
    this.initWorldMeshEntity = this.initWorldMeshEntity.bind(this);
    this.worldMaterial = new THREE.MeshBasicMaterial({color: Math.random() * 0xFFFFFF, side: THREE.DoubleSide, transparent: true, opacity: .75, wireframe: true});
    this.wireframeMaterial = new THREE.MeshBasicMaterial({color: Math.random() * 0xFFFFFF, side: THREE.DoubleSide, wireframe: true});
    this.wallMaterial = null;
    this.floorMaterial = null;
    this.ceilingMaterial = null;
    this.tableMaterial = null;
    this.doorMaterial = null;
    this.storageMaterial = null;
    this.wallArtMaterial = null;
    this.couchMaterial = null;
    this.usePhysicsType = "none";
    if (settings && settings.usePhysicsType == "ammo") {
      this.usePhysicsType = "ammo";
    }
    // this.worldMaterials = {};
    // this.planeMaterial
    let picGroupMangler = document.getElementById("pictureGroupsData");
    if (picGroupMangler != null && picGroupMangler != undefined) { 
      this.tileablePicData = picGroupMangler.components.picture_groups_control.returnTileableData();
      if (this.tileablePicData && this.tileablePicData.images) {
        for (let i = 0; i < this.tileablePicData.images.length; i++) {
          if (this.tileablePicData.images[i].tags && this.tileablePicData.images[i].tags.includes("wall")) {
            this.texture1 = new THREE.TextureLoader().load( this.tileablePicData.images[i].url );
            this.texture1.encoding = THREE.sRGBEncoding;
          
            this.wallMaterial = new THREE.MeshStandardMaterial({
              side: THREE.DoubleSide,
              map: this.texture1, 
              transparent: true
              // opacity: .75
            });
            this.wallMaterial.map.wrapS = THREE.RepeatWrapping;
            this.wallMaterial.map.wrapT = THREE.RepeatWrapping;
            this.wallMaterial.map.repeat.set(2, 2);
          } 
          if (this.tileablePicData.images[i].tags && this.tileablePicData.images[i].tags.includes("floor")) {
            this.texture2 = new THREE.TextureLoader().load( this.tileablePicData.images[i].url );
            this.texture2.encoding = THREE.sRGBEncoding;
          
            this.floorMaterial = new THREE.MeshStandardMaterial({
              side: THREE.DoubleSide,
              map: this.texture2, 
              transparent: true
              // opacity: .75
            });
            this.floorMaterial.map.wrapS = THREE.RepeatWrapping;
            this.floorMaterial.map.wrapT = THREE.RepeatWrapping;
            this.floorMaterial.map.repeat.set(2, 2);
          } 
          if (this.tileablePicData.images[i].tags && this.tileablePicData.images[i].tags.includes("ceiling")) {
            this.texture3 = new THREE.TextureLoader().load( this.tileablePicData.images[i].url );
            this.texture3.encoding = THREE.sRGBEncoding;
          
            this.ceilingMaterial = new THREE.MeshStandardMaterial({
              side: THREE.DoubleSide,
              map: this.texture3, 
              transparent: true
              // opacity: .75
            });
            this.ceilingMaterial.map.wrapS = THREE.RepeatWrapping;
            this.ceilingMaterial.map.wrapT = THREE.RepeatWrapping;
            this.ceilingMaterial.map.repeat.set(2, 2);
          } 
          if (this.tileablePicData.images[i].tags && this.tileablePicData.images[i].tags.includes("door")) {
            this.texture4 = new THREE.TextureLoader().load( this.tileablePicData.images[i].url );
            this.texture4.encoding = THREE.sRGBEncoding;
          
            this.doorMaterial = new THREE.MeshStandardMaterial({
              side: THREE.DoubleSide,
              map: this.texture4, 
              transparent: true
              // opacity: .75
            });
            this.doorMaterial.map.wrapS = THREE.RepeatWrapping;
            this.doorMaterial.map.wrapT = THREE.RepeatWrapping;
            this.doorMaterial.map.repeat.set(2, 2);
          } 
          if (this.tileablePicData.images[i].tags && this.tileablePicData.images[i].tags.includes("table")) {
            this.texture5 = new THREE.TextureLoader().load( this.tileablePicData.images[i].url );
            this.texture5.encoding = THREE.sRGBEncoding;
          
            this.tableMaterial = new THREE.MeshStandardMaterial({
              side: THREE.DoubleSide,
              map: this.texture5, 
              transparent: true
              // opacity: .75
            });
            this.tableMaterial.map.wrapS = THREE.RepeatWrapping;
            this.tableMaterial.map.wrapT = THREE.RepeatWrapping;
            this.tableMaterial.map.repeat.set(2, 2);
          } 
          if (this.tileablePicData.images[i].tags && this.tileablePicData.images[i].tags.includes("storage")) {
            this.texture6 = new THREE.TextureLoader().load( this.tileablePicData.images[i].url );
            this.texture6.encoding = THREE.sRGBEncoding;
          
            this.storageMaterial = new THREE.MeshStandardMaterial({
              side: THREE.DoubleSide,
              map: this.texture6, 
              transparent: true
              // opacity: .75
            });
            this.wallMaterial.map.wrapS = THREE.RepeatWrapping;
            this.wallMaterial.map.wrapT = THREE.RepeatWrapping;
            this.wallMaterial.map.repeat.set(2, 2);
          } if (this.tileablePicData.images[i].tags && this.tileablePicData.images[i].tags.includes("wall art")) {
            this.texture7 = new THREE.TextureLoader().load( this.tileablePicData.images[i].url );
            this.texture7.encoding = THREE.sRGBEncoding;
          
            this.wallArtMaterial = new THREE.MeshStandardMaterial({
              side: THREE.DoubleSide,
              map: this.texture7, 
              transparent: true
              // opacity: .75
            });
            this.wallArtMaterial.map.wrapS = THREE.RepeatWrapping;
            this.wallArtMaterial.map.wrapT = THREE.RepeatWrapping;
            this.wallArtMaterial.map.repeat.set(2, 2);
          } 
          if (this.tileablePicData.images[i].tags && this.tileablePicData.images[i].tags.includes("couch")) {
            this.texture8 = new THREE.TextureLoader().load( this.tileablePicData.images[i].url );
            this.texture8.encoding = THREE.sRGBEncoding;
          
            this.couchMaterial = new THREE.MeshStandardMaterial({
              side: THREE.DoubleSide,
              map: this.texture8, 
              transparent: true
              // opacity: .75
            });
            this.couchMaterial.map.wrapS = THREE.RepeatWrapping;
            this.couchMaterial.map.wrapT = THREE.RepeatWrapping;
            this.couchMaterial.map.repeat.set(2, 2);
          } 
          if (this.tileablePicData.images[i].tags && this.tileablePicData.images[i].tags.includes("world")) {
            this.texture = new THREE.TextureLoader().load( this.tileablePicData.images[i].url );
            this.texture.encoding = THREE.sRGBEncoding;
          
            this.worldMaterial = new THREE.MeshStandardMaterial({
              side: THREE.DoubleSide,
              map: this.texture, 
              transparent: true

            });
            this.worldMaterial.map.wrapS = THREE.RepeatWrapping;
            this.worldMaterial.map.wrapT = THREE.RepeatWrapping;
            this.worldMaterial.map.repeat.set(2, 2);
          } 
        }
        // let picIndex = Math.floor(Math.random()*this.tileablePicData.images.length);
        // this.texture = new THREE.TextureLoader().load( this.tileablePicData.images[picIndex].url );
        // this.texture.encoding = THREE.sRGBEncoding;
      
        // this.worldMaterial = new THREE.MeshStandardMaterial({
        //   side: THREE.DoubleSide,
        //   map: this.texture, 
        //   transparent: true,
        //   opacity: .75
        // });
        // Repeat the pattern to prevent the texture being stretched
        // this.worldMaterial.map.wrapS = THREE.RepeatWrapping;
        // this.worldMaterial.map.wrapT = THREE.RepeatWrapping;
        // this.worldMaterial.map.repeat.set(2, 2);

      }
    } 

    setTimeout(() => {
        this.isReady = true;
    }, 5000);

  },

  tick: function () {
    if (!this.el.is('ar-mode') && !this.isReady) { return; }
    this.detectMeshes();
    this.updateMeshes();
  },
  detectMeshes: function () {
    var data = this.data;
    var detectedMeshes;
    var detectedPlanes;
    var sceneEl = this.el;
    var xrManager = sceneEl.renderer.xr;
    var frame;
    var meshEntities = this.meshEntities;
    var present = false;
    var newMeshes = [];
    var filterLabels = this.data.filterLabels;

    frame = sceneEl.frame;
    if (!frame) {return;}

    detectedMeshes = frame.detectedMeshes;
    detectedPlanes = frame.detectedPlanes;
    
    for (var i = 0; i < meshEntities.length; i++) {
      meshEntities[i].present = false;
    }

    if (data.meshesEnabled) {

      for (var mesh of detectedMeshes.values()) {
        // Ignore meshes that don't match the filterLabels.
        if (filterLabels.length && filterLabels.indexOf(mesh.semanticLabel) === -1) { continue; }
        // if (!data.filtersEnabled || (data.filtersEnabled && filterLabels.length && (filterLabels.indexOf(mesh.semanticLabel) === -1))) { continue; }
        for (i = 0; i < meshEntities.length; i++) {
          if (meshEntities[i].el.components['ammo-body']) {
            meshEntities[i].el.components['ammo-body'].syncToPhysics();  //required for static colliders...
          }
          if (mesh === meshEntities[i].mesh) {
            present = true;
            meshEntities[i].present = true;
            if (meshEntities[i].lastChangedTime < mesh.lastChangedTime) {
              this.updateMeshGeometry(meshEntities[i].el, mesh);  
            }
            meshEntities[i].lastChangedTime = mesh.lastChangedTime;
            // break;
          }
        }
        if (!present) { newMeshes.push(mesh); }
        present = false;
      }
    }

    if (data.planesEnabled) {
      for (mesh of detectedPlanes.values()) {
        // Ignore meshes that don't match the filterLabels.
        if (filterLabels.length && filterLabels.indexOf(mesh.semanticLabel) === -1) { continue; }
        // if (!data.filtersEnabled || (data.filtersEnabled && filterLabels.length && (filterLabels.indexOf(mesh.semanticLabel) === -1))) { continue; }
        for (i = 0; i < meshEntities.length; i++) {
          if (mesh === meshEntities[i].mesh) {
            present = true;
            meshEntities[i].present = true;
            if (meshEntities[i].lastChangedTime < mesh.lastChangedTime) {
              this.updateMeshGeometry(meshEntities[i].el, mesh);
            }
            meshEntities[i].lastChangedTime = mesh.lastChangedTime;
            // break;
          }
        }
        if (!present) { newMeshes.push(mesh); }
        present = false;
      }
    }

    this.deleteMeshes();
    this.createNewMeshes(newMeshes);
  },

  updateMeshes: (function () {
    var auxMatrix = new THREE.Matrix4();
    return function () {
      var meshPose;
      var sceneEl = this.el;
      var meshEl;
      var frame = sceneEl.frame;
      var meshEntities = this.meshEntities;
      var referenceSpace = sceneEl.renderer.xr.getReferenceSpace();
      var meshSpace;
      if (frame) {
        for (var i = 0; i < meshEntities.length; i++) {
          meshSpace = meshEntities[i].mesh.meshSpace || meshEntities[i].mesh.planeSpace;
          meshPose = frame.getPose(meshSpace, referenceSpace);
          meshEl = meshEntities[i].el;
          if (!meshEl.hasLoaded) { continue; }
          auxMatrix.fromArray(meshPose.transform.matrix);
          auxMatrix.decompose(meshEl.object3D.position, meshEl.object3D.quaternion, meshEl.object3D.scale);
          }
        }
      };
  })(),

  deleteMeshes: function () {
    var meshEntities = this.meshEntities;
    var newMeshEntities = [];
    for (var i = 0; i < meshEntities.length; i++) {
      if (!meshEntities[i].present) {
        this.el.removeChild(meshEntities[i]);
      } else {
        newMeshEntities.push(meshEntities[i]);
      }
    }
    this.meshEntities = newMeshEntities;
  },

  createNewMeshes: function (newMeshes) {
    var meshEl;
    for (var i = 0; i < newMeshes.length; i++) {
      meshEl = document.createElement('a-entity');
      this.meshEntities.push({
        mesh: newMeshes[i],
        el: meshEl
      });
      meshEl.addEventListener('loaded', this.initWorldMeshEntity);
      this.el.appendChild(meshEl);
    }
  },

  initMeshGeometry: function (mesh) {
    var geometry;
    var shape;
    var polygon;


    if (mesh instanceof XRPlane) {
      shape = new THREE.Shape();
      polygon = mesh.polygon;
      for (var i = 0; i < polygon.length; ++i) {
        if (i === 0) {
          shape.moveTo(polygon[i].x, polygon[i].z);
        } else {
          shape.lineTo(polygon[i].x, polygon[i].z);
        }
      }
      geometry = new THREE.ShapeGeometry(shape);
      geometry.rotateX(Math.PI / 2);
      return geometry;
    }

    geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(mesh.vertices, 3)
    );
    geometry.setIndex(new THREE.BufferAttribute(mesh.indices, 1));
    geometry.computeVertexNormals(); //ooo yeah
    
    //cylinder projection for UVs, from https://stackoverflow.com/questions/73522902/three-js-correctly-uv-map-texture-onto-custom-buffer-geometry-while-updating-thr
    const templateMeshes = new THREE.Mesh(geometry, this.wireframeMaterial);
    let bbox = new THREE.Box3().setFromObject(templateMeshes);
    let size = new THREE.Vector3(); bbox.getSize(size);
    let bMin = bbox.min;
    let center = new THREE.Vector3(); bbox.getCenter(center);
    let uvs = [];
    const arr = geometry.attributes.position.array;
    for (let t = 0; t < arr.length; t+=3)  
    {
        const x = arr[t]  
        const y = arr[t+1]
        const z = arr[t+2]
        let U = (Math.atan2(y-center.y, x-center.x) / (Math.PI)) *0.5 + 0.5
        let V = ((z - bMin.z) / size.z)
        uvs.push(U,V)
    }
    geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2))

    geometry.uvsNeedUpdate = true;

    return geometry;
  },

  initWorldMeshEntity: function (evt) {
    var el = evt.target;
    var geometry;
    var mesh;
    var meshEntity;
    var meshEntities = this.meshEntities;
    for (var i = 0; i < meshEntities.length; i++) {
      if (meshEntities[i].el === el) {
        meshEntity = meshEntities[i];
        break;
      }
    }
    geometry = this.initMeshGeometry(meshEntity.mesh);
    if (meshEntity.mesh instanceof XRPlane) {
      //add planeMixin
      // mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: Math.random() * 0xFFFFFF, side: THREE.DoubleSide, transparent: true, opacity: .75}));
      // mesh = new THREE.Mesh(geometry, this.wireframeMaterial);
      // if (meshEntity.mesh.semanticLabel) {
        console.log("xrplane semanticLabel is " + meshEntity.mesh.semanticLabel);
        if (meshEntity.mesh.semanticLabel == "wall" && this.wallMaterial) {
          mesh = new THREE.Mesh(geometry, this.wallMaterial);
          el.setObject3D('mesh', mesh);
          if (this.usePhysicsType == "ammo") {
            console.log("tryna set Physics!!! for " + meshEntity.mesh.semanticLabel);
      
            el.setAttribute('ammo-body', {'type': 'static'}); 
            el.setAttribute('ammo-shape', {'type': 'hull', 'margin': .25, 'includeInvisible': true}); //these properties help collision accuracy
          }
          el.classList.add('activeObjexRay');
        } else if (meshEntity.mesh.semanticLabel == "floor" && this.floorMaterial) {
          mesh = new THREE.Mesh(geometry, this.floorMaterial);
          el.setObject3D('mesh', mesh);
          if (this.usePhysicsType == "ammo") {
            console.log("tryna set Physics!!! for " + meshEntity.mesh.semanticLabel);
      
            el.setAttribute('ammo-body', {'type': 'static'}); 
            el.setAttribute('ammo-shape', {'type': 'hull', 'margin': .25, 'includeInvisible': true}); //these properties help collision accuracy
          }
          el.classList.add('activeObjexRay');
        } else if (meshEntity.mesh.semanticLabel == "ceiling" && this.ceilingMaterial) {
          mesh = new THREE.Mesh(geometry, this.ceilingMaterial);
          el.setObject3D('mesh', mesh);
          if (this.usePhysicsType == "ammo") {
            console.log("tryna set Physics!!! for " + meshEntity.mesh.semanticLabel);
      
            el.setAttribute('ammo-body', {'type': 'static'}); 
            el.setAttribute('ammo-shape', {'type': 'hull', 'margin': .25, 'includeInvisible': true}); //these properties help collision accuracy
          }
          el.classList.add('activeObjexRay');
        } else if (meshEntity.mesh.semanticLabel == "table" && this.tableMaterial) {
          mesh = new THREE.Mesh(geometry, this.tableMaterial);
          el.setObject3D('mesh', mesh);
          if (this.usePhysicsType == "ammo") {
            console.log("tryna set Physics!!! for " + meshEntity.mesh.semanticLabel);
      
            el.setAttribute('ammo-body', {'type': 'static'}); 
            el.setAttribute('ammo-shape', {'type': 'hull', 'margin': .25, 'includeInvisible': true}); //these properties help collision accuracy
          }
          el.classList.add('activeObjexRay');
        } else if (meshEntity.mesh.semanticLabel == "door" && this.doorMaterial) {
          mesh = new THREE.Mesh(geometry, this.doorMaterial);
          el.setObject3D('mesh', mesh);
          if (this.usePhysicsType == "ammo") {
            console.log("tryna set Physics!!! for " + meshEntity.mesh.semanticLabel);
      
            el.setAttribute('ammo-body', {'type': 'static'}); 
            el.setAttribute('ammo-shape', {'type': 'hull', 'margin': .25, 'includeInvisible': true}); //these properties help collision accuracy
          }
          el.classList.add('activeObjexRay');
        } else if (meshEntity.mesh.semanticLabel == "storage" && this.storageMaterial) {
          mesh = new THREE.Mesh(geometry, this.storageMaterial);
          el.setObject3D('mesh', mesh);
          if (this.usePhysicsType == "ammo") {
            console.log("tryna set Physics!!! for " + meshEntity.mesh.semanticLabel);
      
            el.setAttribute('ammo-body', {'type': 'static'}); 
            el.setAttribute('ammo-shape', {'type': 'hull', 'margin': .25, 'includeInvisible': true}); //these properties help collision accuracy
          }
          el.classList.add('activeObjexRay');
        } else if (meshEntity.mesh.semanticLabel == "wall art" && this.wallArtMaterial) {
          mesh = new THREE.Mesh(geometry, this.wallArtMaterial);
          el.setObject3D('mesh', mesh);
          if (this.usePhysicsType == "ammo") {
            console.log("tryna set Physics!!! for " + meshEntity.mesh.semanticLabel);
      
            el.setAttribute('ammo-body', {'type': 'static'}); 
            el.setAttribute('ammo-shape', {'type': 'hull', 'margin': .25, 'includeInvisible': true}); //these properties help collision accuracy
          }
          el.classList.add('activeObjexRay');
          el.classList.add('wall art');
          // el.setAttribute("mod_el");
        } else {
          mesh = new THREE.Mesh(geometry, this.wireframeMaterial);
          el.setObject3D('mesh', mesh);
          // if (this.usePhysicsType == "ammo") {
            console.log("no material/physics for " + meshEntity.mesh.semanticLabel);
      
          //   el.setAttribute('ammo-body', {'type': 'static'}); 
          //   el.setAttribute('ammo-shape', {'type': 'hull', 'margin': .25, 'includeInvisible': true}); //these properties help collision accuracy
          // }
          // el.classList.add('activeObjexRay');
        }
      // } else {
      //   mesh = new THREE.Mesh(geometry, this.wireframeMaterial);
      //   el.setObject3D('mesh', mesh);
      // }
    } else { //i.e. world meshes
      mesh = new THREE.Mesh(geometry, this.worldMaterial);
      el.setObject3D('mesh', mesh);
    }
    el.setAttribute('data-world-mesh', meshEntity.mesh.semanticLabel);
  },

  updateMeshGeometry: function (entityEl, mesh) {
    var entityMesh = entityEl.getObject3D('mesh');
    entityMesh.geometry.dispose();
    entityMesh.geometry = this.initMeshGeometry(mesh);
    // if (this.worldMaterial) {
    //   entityMesh.material = this.worldMaterial;
    //   // this.worldMaterial.needsUpdate = true;
    // }

  }
});
