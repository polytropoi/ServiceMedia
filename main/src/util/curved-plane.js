/* http://stackoverflow.com/questions/16395690/curved-plane-surface-in-css3-or-three-js */
    /* new THREE.SphereGeometry(75, 16, 8, 0, 2, 1, 1.2); */
    AFRAME.registerGeometry('curved-plane', {
      
        schema: {
          depth: {default: 1, min: 0},
          height: {default: 1, min: 0},
          width: {default: 1, min: 0},
          segmentsHeight: {default: 1, min: 1, max: 20, type: 'int'},
          segmentsWidth: {default: 1, min: 1, max: 20, type: 'int'},
          segmentsDepth: {default: 1, min: 1, max: 20, type: 'int'}
        },
        
        init: function (data) {
          
          var THREE = AFRAME.THREE;
          
          var width_segments =1, height_segments = 50; 
          var surface = new THREE.PlaneGeometry(data.width, data.height, width_segments, height_segments);
          
          for(var i=0; i< surface.vertices.length/2; i++) {
            surface.vertices[2*i].z = Math.pow(2, i/20);
            surface.vertices[2*i+1].z = Math.pow(2, i/20);
                  }
          
          this.geometry = surface;
          
        }
      });