"use strict";

const SETTINGS = {
  gltfModelURL: 'pndmask1.glb',
  cubeMapURL: 'Bridge2/',
  offsetYZ: [-.35,.25], // offset of the model in 3D along vertical and depth axis
  scale: 1.15 // width in 3D of the GLTF model
};

let THREECAMERA = null;

var input = null;

  var threeStuffs = null;

// build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec){
  threeStuffs = THREE.JeelizHelper.init(spec, null);
//   // CREATE THE ENVMA:P
//   const path = SETTINGS.cubeMapURL;
//   const format = '.jpg';
  const envMap = new THREE.CubeTextureLoader().load( [
    "5e4b3034624bc14a758411ba_1.jpg", 

    "5e4b3034624bc14a758411ba_2.jpg", 

    "5e4b3034624bc14a758411ba_3.jpg", 

    "5e4b3034624bc14a758411ba_4.jpg", 

    "5e4b3034624bc14a758411ba_5.jpg", 

    "5e4b3034624bc14a758411ba_6.jpg"
  ] );
  var directionalLight = new THREE.DirectionalLight( 0xffffff, .75 );
//   directionalLight.position.set(THREE.Vector3(1,0,1));
//   scene.add( directionalLight );
  // IMPORT THE GLTF MODEL:
  // from https://threejs.org/examples/#webgl_loader_gltf

  const gltfLoader = new THREE.GLTFLoader();
  gltfLoader.load( SETTINGS.gltfModelURL, function ( gltf ) {
    gltf.scene.traverse( function ( child ) {
      if ( child.isMesh ) {
        child.material.envMap = envMap;
      }
    } );
    gltf.scene.frustumCulled = false;
    
    // center and scale the object:
    const bbox = new THREE.Box3().expandByObject(gltf.scene);
    threeStuffs.scene.add( directionalLight );
    threeStuffs.scene.add(directionalLight.target);
    // center the model:
    const centerBBox = bbox.getCenter(new THREE.Vector3());
    gltf.scene.position.add(centerBBox.multiplyScalar(-1));
    gltf.scene.position.add(new THREE.Vector3(0,SETTINGS.offsetYZ[0], SETTINGS.offsetYZ[1]));

    // scale the model according to its width:
    const sizeX = bbox.getSize(new THREE.Vector3()).x;
    gltf.scene.scale.multiplyScalar(SETTINGS.scale / sizeX);

    // dispatch the model:
    threeStuffs.faceObject.add(gltf.scene);
    // const obj = this.el.getObject3D('mesh');
    // const ref = document.querySelector("#smimage"+data.index);
    // console.log("tryna set texture..." + ref.src);

    // var texture = new THREE.TextureLoader().load("face2.jpg");

    var texture = THREE.JeelizHelper.get_threeVideoTexture();

    
    texture.encoding = THREE.sRGBEncoding; 
    // UVs use the convention that (0, 0) corresponds to the upper left corner of a texture.
    texture.flipY = true; 
    // immediately use the texture for material creation
    var material = new THREE.MeshBasicMaterial( { map: texture } ); 
    // Go over the submeshes and modify materials we want.
    threeStuffs.faceObject.traverse(node => {
        node.material = material;
        // node.material = threeStuffs.videoMaterial;
    });
    directionalLight.target = threeStuffs.faceObject;
    input = document.querySelector('input');
    input.addEventListener('change', updateImageDisplay);

  } ); //end gltfLoader.load callback
  
  //CREATE THE CAMERA
  THREECAMERA = THREE.JeelizHelper.create_camera();

} //end init_threeScene()

function updateImageDisplay() {
  const currentFiles = input.files;
  // const image = document.
  if (currentFiles.length > 0) {
  // const image = document.createElement('img');
  // image.src = URL.createObjectURL(currentFiles[0]);
  var texture = new THREE.TextureLoader().load(URL.createObjectURL(currentFiles[0]));
  texture.encoding = THREE.sRGBEncoding; 
  // UVs use the convention that (0, 0) corresponds to the upper left corner of a texture.
  texture.flipY = true; 
  // immediately use the texture for material creation
  var material = new THREE.MeshBasicMaterial( { map: texture } ); 
  // Go over the submeshes and modify materials we want.
  threeStuffs.faceObject.traverse(node => {
      node.material = material;
      // node.material = threeStuffs.videoMaterial;
    });
  } 
}

//entry point, launched by body.onload():
function main(){
  JeelizResizer.size_canvas({
    canvasId: 'jeeFaceFilterCanvas',
    isFullScreen: true,
    callback: start,
    onResize: function(){
      THREE.JeelizHelper.update_camera(THREECAMERA);
    }
  })
}

function start(){
  JEEFACEFILTERAPI.init({ 
    videoSettings:{ // increase the default video resolution since we are in full screen
      'idealWidth': 1280,  // ideal video width in pixels
      'idealHeight': 800,  // ideal video height in pixels
      'maxWidth': 1920,    // max video width in pixels
      'maxHeight': 1920    // max video height in pixels
    },
    followZRot: true,
    canvasId: 'jeeFaceFilterCanvas',
    NNCpath: '', //root of NNC.json file
    callbackReady: function(errCode, spec){
      if (errCode){
        console.log('AN ERROR HAPPENS. SORRY BRO :( . ERR =', errCode);
        return;
      }

      console.log('INFO: JEEFACEFILTERAPI IS READY');
      init_threeScene(spec);
    }, //end callbackReady()

    // called at each render iteration (drawing loop):
    callbackTrack: function(detectState){
      THREE.JeelizHelper.render(detectState, THREECAMERA);
    }
  }); //end JEEFACEFILTERAPI.init call
} //end start()
