/* global AFRAME */
//derived from https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Shader-Heightmap-Textures.html
AFRAME.registerShader('terrain', {
    schema: {
    //   time: { type: 'time', is: 'uniform' },
      bumpScale: { type: 'float', is: 'uniform'},
      uMap: {type: 'map', is: 'uniform'},
      lowestTexture: {type: 'map', is: 'uniform'},
      lowTexture: {type: 'map', is: 'uniform'},
      mediumTexture: {type: 'map', is: 'uniform'},
      highTexture: {type: 'map', is: 'uniform'},
      highestTexture: {type: 'map', is: 'uniform'}
    },

    vertexShader: `
    uniform sampler2D uMap;
    uniform float bumpScale;
    
    varying float vAmount;
    varying vec2 vUV;
    
    void main() 
    { 
        vUV = uv;
        vec4 bumpData = texture2D( uMap, uv );
        
        vAmount = bumpData.r; // assuming map is grayscale it doesn't matter if you use r, g, or b.
        
        // move the position along the normal
        vec3 newPosition = position + normal * bumpScale * vAmount;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
    }
`,
    fragmentShader: `

    uniform sampler2D lowestTexture;
    uniform sampler2D lowTexture;
    uniform sampler2D mediumTexture;
    uniform sampler2D highTexture;
    uniform sampler2D highestTexture;
    uniform sampler2D uMap;
    varying vec2 vUV;
    
    varying float vAmount;
    
    void main() 
    { 
        vec4 heightmap =  vAmount * texture2D(uMap, vUV);
        //vec4 grass = (smoothstep(0.28, 0.32, vAmount) - smoothstep(0.35, 0.40, vAmount)) * texture2D( grassTexture, vUV * 100.0 );
        vec4 lowest = (smoothstep(0.01, 0.25, vAmount) - smoothstep(0.24, 0.26, vAmount)) * texture2D( lowestTexture, vUV * 100.0 );
        vec4 low = (smoothstep(0.24, 0.27, vAmount) - smoothstep(0.28, 0.31, vAmount)) * texture2D( lowTexture, vUV * 100.0 );
        vec4 med = (smoothstep(0.28, 0.32, vAmount) - smoothstep(0.35, 0.40, vAmount)) * texture2D( mediumTexture, vUV * 100.0 );
        vec4 high = (smoothstep(0.30, 0.50, vAmount) - smoothstep(0.40, 0.70, vAmount)) * texture2D( highTexture, vUV * 100.0 );
        vec4 highest = (smoothstep(0.50, 0.65, vAmount))                                   * texture2D( highestTexture, vUV * 100.0 );

        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0) + lowest + low + med + high + highest + heightmap; //, 1.0);
        // gl_FragColor = (vec4(0.0, 0.0, 0.0, 1.0) + lowest + low + med + high + highest) * (heightmap * 4.0); //, 1.0);
        // gl_FragColor = texture2D(uMap, vUV) * texture2D(grassTexture, vUV);
    }
  
`
});

AFRAME.registerComponent('terrain-mangler', {
    schema: {
        bumpScale: {default: 50.0}
    },
    init: function() {
        // this.geometry = this.el.getObject3D('mesh');
        // this.material = new THREE.MeshBasicMaterial( { map: texture1, transparent: true } ); 
        console.log("setting a TEERAINNNE");
        // this.grassTexture = new THREE.TextureLoader( '#grass' );
        // this.grassTexture.wrapS = this.grassTexture.wrapT = THREE.RepeatWrapping; 
        // this.grassTexture.repeat.set(16, 16);
        this.el.setAttribute('material', {'shader': 'terrain',
            'uMap': '#heightmap',
            'lowestTexture': '#lowestTexture',
            'lowTexture': '#lowTexture',
            'mediumTexture': '#mediumTexture',
            'highTexture': '#highTexture',
            'highestTexture': '#highestTexture',
            'repeat': '50 50', 
            'bumpScale': '33.0'});
    }
}); 

    // vec4 map = texture2D( uMap, vUV * 50.0 );
    // gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0) + map; //, 1.0);
    AFRAME.registerComponent('terrain-mangler-too', {
        schema: {
            bumpScale: {default: 50.0}
        },

        init: function() {
    // Generate a terrain
    // this.hmSrc = document.getElementById("heightmap").src;
    // this.lowestSrc = document.getElementById("lowestTexture").src;
    // this.lowSrc = document.getElementById("lowTexture").src;
    // this.medSrc = document.getElementById("mediumTexture").src;
    // this.highSrc = document.getElementById("highTexture").src;
    // this.highestSrc = document.getElementById("highestTexture").src;
    // const heightmapTexture = new THREE.TextureLoader().load( this.hmSrc );


    console.log("tryna generate a a terrain " + this.lowestSrc);
            // instantiate a loader
        // const loader = new THREE.TextureLoader();

        // // load a resource
        // loader.load(
        //     // resource URL
        //     this.hmSrc,

        //     // onLoad callback
        //     function ( texture ) {
        //         texture.encoding = THREE.sRGBEncoding;
        //         var xS = 63, yS = 63;
        //         terrainScene = THREE.Terrain({
        //             easing: THREE.Terrain.Linear,
        //             frequency: 2.5,
        //             heightmap: THREE.Terrain.DiamondSquare,
        //             // heightmap: texture,
        //             material: new THREE.MeshBasicMaterial({color: 0x5566aa}),
        //             maxHeight: 100,
        //             minHeight: -100,
        //             steps: 1,
        //             xSegments: xS,
        //             xSize: 1024,
        //             ySegments: yS,
        //             ySize: 1024,
        //         });
        //         // Assuming you already have your global scene, add the terrain to it
        //         sceneEl.object3D.add(terrainScene);
        
        //         // Optional:
        //         // Get the geometry of the terrain across which you want to scatter meshes
        //         var geo = terrainScene.children[0].geometry;
        //         // Add randomly distributed foliage
        //         decoScene = THREE.Terrain.ScatterMeshes(geo, {
        //             mesh: new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 12, 6)),
        //             w: xS,
        //             h: yS,
        //             spread: 0.02,
        //             randomness: Math.random,
        //         });
        //         terrainScene.add(decoScene);


        //     },

        //     // onProgress callback currently not supported
        //     undefined,

        //     // onError callback
        //     function ( err ) {
        //         console.error( 'An error happened.' );
        //     }
        // );
                        // var xS = 63, yS = 63;
                        // this.terrainScene = THREE.Terrain({
                        //     easing: THREE.Terrain.Linear,
                        //     frequency: 2.5,
                        //     heightmap: THREE.Terrain.DiamondSquare,
                        //     // heightmap: heightmapTexture,
                        //     material: new THREE.MeshBasicMaterial({color: 0x5566aa}),
                        //     maxHeight: 100,
                        //     minHeight: -100,
                        //     steps: 1,
                        //     xSegments: xS,
                        //     xSize: 1024,
                        //     ySegments: yS,
                        //     ySize: 1024,
                        // });
                        // // Assuming you already have your global scene, add the terrain to it
                        // sceneEl.object3D.add(this.terrainScene);

                        // // Optional:
                        // // Get the geometry of the terrain across which you want to scatter meshes
                        // var geo = this.terrainScene.children[0].geometry;
                        // // Add randomly distributed foliage
                        // this.decoScene = THREE.Terrain.ScatterMeshes(geo, {
                        //     mesh: new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 12, 6)),
                        //     w: xS,
                        //     h: yS,
                        //     spread: 0.02,
                        //     randomness: Math.random,
                        // });
                        // this.terrainScene.add(this.decoScene);
        
        // var material = THREE.Terrain.generateBlendedMaterial([
        //     // The first texture is the base; other textures are blended in on top.
        //     { texture: t1 },
        //     // Start blending in at height -80; opaque between -35 and 20; blend out by 50
        //     { texture: t2, levels: [-80, -35, 20, 50] },
        //     { texture: t3, levels: [20, 50, 60, 85] },
        //     // How quickly this texture is blended in depends on its x-position.
        //     { texture: t4, glsl: '1.0 - smoothstep(65.0 + smoothstep(-256.0, 256.0, vPosition.x) * 10.0, 80.0, vPosition.z)' },
        //     // Use this texture if the slope is between 27 and 45 degrees
        //     { texture: t3, glsl: 'slope > 0.7853981633974483 ? 0.2 : 1.0 - smoothstep(0.47123889803846897, 0.7853981633974483, slope) + 0.2' },
        // ]);
        this.loader = new THREE.TextureLoader();
        this.hmSrc = document.getElementById("heightmap").src.toString();
        this.lowestSrc = document.getElementById("lowestTexture").src.toString();
        this.lowSrc = document.getElementById("lowTexture").src.toString();
        this.medSrc = document.getElementById("mediumTexture").src.toString();
        this.highSrc = document.getElementById("highTexture").src.toString();
        this.highestSrc = document.getElementById("highestTexture").src.toString();
        console.log(this.lowestSrc + " " + this.lowSrc + " " + this.medSrc + this.highSrc);

        this.loader.load(this.lowestSrc, function(t1) {
          t1.wrapS = t1.wrapT = THREE.RepeatWrapping;
          console.log(this.lowestSrc + " " + this.lowSrc + " " + this.medSrc + this.highSrc);
        //   sand = new THREE.Mesh(
        //     new THREE.PlaneBufferGeometry(16384+1024, 16384+1024, 64, 64),
        //     new THREE.MeshLambertMaterial({map: t1})
        //   );
        //   sand.position.y = -101;
        //   sand.rotation.x = -0.5 * Math.PI;
        //   scene.add(sand);
          loader.load(this.lowSrc.toString(), function(t2) {
            loader.load(this.medSrc.toString(), function(t3) {
              loader.load(this.highSrc.toString(), function(t4) {
                // t2.repeat.x = t2.repeat.y = 2;
                
                this.terrainMaterial = THREE.Terrain.generateBlendedMaterial([
                  {texture: t1},
                  {texture: t2, levels: [-80, -35, 20, 50]},
                  {texture: t3, levels: [20, 50, 60, 85]},
                  {texture: t4, glsl: '1.0 - smoothstep(65.0 + smoothstep(-256.0, 256.0, vPosition.x) * 10.0, 80.0, vPosition.z)'},
                  {texture: t3, glsl: 'slope > 0.7853981633974483 ? 0.2 : 1.0 - smoothstep(0.47123889803846897, 0.7853981633974483, slope) + 0.2'}, // between 27 and 45 degrees
                ]);
                var xS = 63, yS = 63;
                this.terrainScene = THREE.Terrain({
                    easing: THREE.Terrain.Linear,
                    frequency: 2.5,
                    heightmap: THREE.Terrain.DiamondSquare,
                    // heightmap: heightmapTexture,
                    material: this.terrainMaterial,
                    maxHeight: 100,
                    minHeight: -100,
                    steps: 1,
                    xSegments: xS,
                    xSize: 1024,
                    ySegments: yS,
                    ySize: 1024,
                });
                // Assuming you already have your global scene, add the terrain to it
                sceneEl.object3D.add(this.terrainScene);
        
                // Optional:
                // Get the geometry of the terrain across which you want to scatter meshes
                var geo = this.terrainScene.children[0].geometry;
                // Add randomly distributed foliage
                this.decoScene = THREE.Terrain.ScatterMeshes(geo, {
                    mesh: new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 12, 6)),
                    w: xS,
                    h: yS,
                    spread: 0.02,
                    randomness: Math.random,
                });
                this.terrainScene.add(this.decoScene);
              });
            });
          });
        });

    }
}); 