var a_scene = document.querySelector('a-scene');
          
if (a_scene.hasLoaded) {
  run();
} 
else {
    a_scene.addEventListener('loaded', run);
}

function run() {
  //do stuff after load..
}
