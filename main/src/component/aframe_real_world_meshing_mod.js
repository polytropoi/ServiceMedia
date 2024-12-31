/* global XRPlane, XRMesh */
// var register = require('../../core/component').registerComponent;
// var THREE = require('../../lib/three');

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
    this.worldMaterial = new THREE.MeshBasicMaterial({color: Math.random() * 0xFFFFFF, side: THREE.DoubleSide, transparent: true, opacity: .75});

    let picGroupMangler = document.getElementById("pictureGroupsData");
    if (picGroupMangler != null && picGroupMangler != undefined) {
      this.tileablePicData = picGroupMangler.components.picture_groups_control.returnTileableData();
      if (this.tileablePicData && this.tileablePicData.images) {
        let picIndex = Math.floor(Math.random()*this.tileablePicData.images.length);
        this.texture = new THREE.TextureLoader().load( this.tileablePicData.images[picIndex].url );
        this.texture.encoding = THREE.sRGBEncoding;
      
        this.worldMaterial = new THREE.MeshStandardMaterial({
          side: THREE.DoubleSide,
          map: this.texture, 
          transparent: true,
          opacity: .75
        });
        // Repeat the pattern to prevent the texture being stretched
        this.worldMaterial.map.wrapS = THREE.RepeatWrapping;
        this.worldMaterial.map.wrapT = THREE.RepeatWrapping;
        this.worldMaterial.map.repeat.set(2, 2);

      }
    } 

    setTimeout(() => {
        this.isReady = true;
    }, 3000);

  },

  tick: function () {
    if (!this.el.is('ar-mode') && !this.worldMaterial && !this.isReady) { return; }
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
      for (var i = 0; i < meshEntities.length; i++) {
        meshSpace = meshEntities[i].mesh.meshSpace || meshEntities[i].mesh.planeSpace;
        meshPose = frame.getPose(meshSpace, referenceSpace);
        meshEl = meshEntities[i].el;
        if (!meshEl.hasLoaded) { continue; }
        auxMatrix.fromArray(meshPose.transform.matrix);
        auxMatrix.decompose(meshEl.object3D.position, meshEl.object3D.quaternion, meshEl.object3D.scale);
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
    const templateMeshes = new THREE.Mesh(geometry, this.worldMaterial);
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
      mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: Math.random() * 0xFFFFFF, side: THREE.DoubleSide, transparent: true, opacity: .75}));
    } else {
      //add meshMixin
      mesh = new THREE.Mesh(geometry, this.worldMaterial);
    }
    el.setObject3D('mesh', mesh);

    el.setAttribute('data-world-mesh', meshEntity.mesh.semanticLabel);
  },

  updateMeshGeometry: function (entityEl, mesh) {
    var entityMesh = entityEl.getObject3D('mesh');
    entityMesh.geometry.dispose();
    entityMesh.geometry = this.initMeshGeometry(mesh);
    if (this.worldMaterial) {
      entityMesh.material = this.worldMaterial;
      // this.worldMaterial.needsUpdate = true;
    }

  }
});
