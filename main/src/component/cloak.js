AFRAME.registerComponent('cloak', {
    init: function() {
      let geometry = new THREE.BoxGeometry(1, 1, 1)
      geometry.faces.splice(4, 2) // cut out the top faces 
      let material = new THREE.MeshBasicMaterial({
         colorWrite: false
      })
      let mesh = new THREE.Mesh(geometry, material)
      mesh.scale.set(1.1, 1.1, 1.1)
      this.el.object3D.add(mesh)
    }
})