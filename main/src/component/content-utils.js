if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}
var ua = window.navigator.userAgent;
var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
var webkit = !!ua.match(/WebKit/i);
var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

let analyser = null;
// let dataArray = [];
let fLevels = null;
let volume = 0;
let primaryAudioEl = null;
let vidz = null;
let videoEl = null;
var primaryAudioMangler = null; 
let youtubeTime = 0;
let youtubeDuration = 0;

function PrimaryAudioInit() {
  console.log("PRIMARY AUDIO INIT()");
  primaryAudioEl = document.querySelector('#primaryAudio');
  if (primaryAudioEl != null) {
    primaryAudioMangler = document.getElementById("primaryAudio").components.primary_audio_control;
  }
  let avz = document.getElementById("audiovizzler");
  if (avz != null) {
    vidz = document.getElementsByTagName("video");
    if (vidz != null && vidz.length > 0) { //either video or audio, not both...?
      videoEl = vidz[0];
      console.log("videoEl " + videoEl.src);
        AudioAnalyzer();
    } else {
        if (primaryAudioMangler != null) {
        AudioAnalyzer();
      } 
    }
  } else {
    console.log("didn't find no audiovizzler");
  }
}



function AudioAnalyzer() {

  if (analyser == null) {
      console.log("tryna create analyser from media");
  
  
  if (vidz != null && vidz.length > 0) { //wire up the analyzer to the video if present
    var context = new AudioContext();
    var source = context.createMediaElementSource(vidz[0]);
    analyser = context.createAnalyser();
    
    source.connect(analyser);
    console.log("gotsome vidz" );
    analyser.connect(context.destination);
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.8;
    bufferLength = analyser.frequencyBinCount;
    fLevels = new Uint8Array(analyser.fftSize);
    beatDetectionDecay = .99;
    beatDetectionMinVolume = 12;
    beatDetectionThrottle = 50;

  } else if (primaryAudioEl != null) { 
    analyser = Howler.ctx.createAnalyser();
    Howler.masterGain.connect(analyser);
    analyser.connect(Howler.ctx.destination);

    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.8;
    bufferLength = analyser.frequencyBinCount;
    fLevels = new Uint8Array(analyser.fftSize);
    beatDetectionDecay = .99;
    beatDetectionMinVolume = 10;
    beatDetectionThrottle = 50;
    } 
  } 
  if (analyser != null) {
    let beatElements = document.getElementsByClassName("beatme");

    if ((primaryAudioEl != null && primaryAudioHowl.playing()) || (videoEl != null && !videoEl.paused)) {
        // console.log("beat elements: " + beatElements.length);
      var sum = 0;
      analyser.getByteFrequencyData(fLevels);
      for (var i = 0; i < fLevels.length; i++) {
        sum += fLevels[i];;
        }
      volume = sum / fLevels.length;
      // console.log(volume);
      if (!this.beatCutOff) {
          this.beatCutOff = volume;
      }
      if (volume > this.beatCutOff && volume > beatDetectionMinVolume) {
        this.beatCutOff = volume * 1.5;
        this.beatTime = 0;
        
        if (primaryAudioEl != null) {
          // console.log("beat volume " + volume);
            primaryAudioEl.components.primary_audio_control.analyzer_beat(volume);
        }
        if (videoEl != null) {
          // console.log("beat volume " + volume);
          if (beatElements != null) {
            for (let i = 0; i < beatElements.length; i++) {
              beatElements[i].components.mod_model.beat(volume);
              }
            }
            // beatElements.every(beat());
            // this.event = new Event("beatme"); 
            // document.dispatchEvent(this.event);
            // document.dispatchEvent(new CustomEvent('beatme', { bubbles: true, detail: {'volume' : volume}}));
          }
        } else {
          if (this.beatTime <= beatDetectionThrottle) {
            this.beatTime += window.performance.now();
          } else {
            this.beatCutOff *= beatDetectionDecay;
            this.beatCutOff = Math.max(this.beatCutOff, beatDetectionMinVolume);
          }
        }        
      } else {
          // beatDetectionDecay = 0.99;
          // beatDetectionMinVolume = 15;
          // beatDetectionThrottle = 250;
      }
  }
  window.requestAnimationFrame(AudioAnalyzer);   
};



AFRAME.registerComponent('initializer', { //adjust for device settings, and callbackn to connect.js
  schema: {
    initialized: {default: ''},
    // href: {default: ''},
    usdz: {default: ''},
    sceneType: {default: 'aframe'}
  },
  init: function () {
    var sceneEl = document.querySelector('a-scene');
    let type = this.data.sceneType;
    console.log("scene TYpe is " + type);
    // if (!AFRAME.utils.device.isMobile() && !AFRAME.utils.device.checkHeadsetConnected()) {
    //   if (!AFRAME.utils.device.isMobile()) {
    //   sceneEl.setAttribute("vr-mode-ui", "enabled", "true");
    // }
    // if (iOS) {
    //   document.querySelector('.a-enter-vr').style.display = 'none';
    // }
    sceneEl.addEventListener('loaded', function () { //for sure?
      console.log("AFRAME Init");
      window.sceneType = type;
      // InitSceneHooks(type);
      PrimaryAudioInit();
      // sceneEl.setAttribute('render-canvas');
      if (AFRAME.utils.device.isMobile()) {
        let vrButton = document.querySelector(".a-enter-vr-button");
        if (vrButton != null) {
          vrButton.style.display = 'none'; //to hell with cardboard/gearvr/daydream
        }
      }
      let envEl = document.getElementById('enviroEl');
      if (envEl != null) {
        envEl.setAttribute('enviro_mods', 'enabled', true); //wait till env is init'd to put the mods
      }
   });
   if (this.data.usdz != '') {
     ShowARButton(this.data.usdz);
   }
  }
}); //end register

AFRAME.registerComponent('disable-magicwindow', {
  init: function () {
    var cameraEl = document.querySelector('[look-controls]');
    if (cameraEl != null) {
    var lookControlsComponent = cameraEl.components['look-controls'];
    if (!lookControlsComponent.magicWindowControls) { return; }
    lookControlsComponent.magicWindowControls.enabled = false;
    }
  }
});

// function 
// AFRAME.registerComponent('css3d-youtube', {
//   init: function () {
//     console.log("css3d data :  " + this.el.getAttribute("id") + " " + this.el.getAttribute("data-attribute"));
//     let renderer = new THREE.CSS3DRenderer();
// 				renderer.setSize( window.innerWidth, window.innerHeight );
//         let container = document.createElement('div');
//         renderer.traverse(node => {
//           console.log(node);
//           if (node == 'domElement') {
//             // container.appendChild( node );
//           }
//         });
// 				const group = new THREE.Group();
// 				group.add( new YouTubeElement( this.el.getAttribute("data-attribute"), 0, 0, 240, 0 ) );
// 				// group.add( new Element( 'Y2-xZ-1HE-Q', 240, 0, 0, Math.PI / 2 ) );
// 				// group.add( new Element( 'IrydklNpcFI', 0, 0, - 240, Math.PI ) );
// 				// group.add( new Element( '9ubytEsCaS0', - 240, 0, 0, - Math.PI / 2 ) );
// 				this.el.sceneEl.add( group );
//   }
// });

// AFRAME.registerComponent('locationdata', {
//   schema: {
//     initialized: {default: ''},
//     locData: {
//       parse: JSON.parse,
//       stringify: JSON.stringify
//     }
//   },
//   init: function() {
//     let locData = this.data.locData;
//       // console.log("location data " + JSON.stringify(locData));
//     //   document.querySelector('a-scene').addEventListener('loaded', function () { //for sure?
//     //     console.log("AFRAME Init");
//         SetLocationData(locData);
//     //  });
      
//       // this.el.setAttribute("primary_audio_control", "timekeys", this.timekeys);
//   }
// });


AFRAME.registerComponent('parent-to', {
  schema: {
    tracking: {default: 'marker'}
  },
  init: function() {
    // this.el.sceneEl.addEventListener('markerFound', () => {
      // redirect to custom URL
      console.log("tryuna parent with tracking " + this.data.tracking);
      if (this.data.tracking == "marker") {
        console.log("marker tracking enabled");
        // this.el.removeAttribute("look-at");
        let marker = document.querySelector("a-marker");
        if (marker != null) {
          marker.setAttribute("visible", "true");
          this.el.position = marker.position;
          marker.appendChild(this.el);

          // var target = document.querySelector('a-marker-camera');
          // marker.appendChild(this.el);
          // this.el.setAttribute("scale", ".3 .3 .3");
          // this.el.setAttribute("rotation", "90 0 0");
          let vidmat = this.el.components.vid_materials;
          if (vidmat) {
            console.log("tryna flip vidmat");
            vidmat.flipY = true;
            this.el.setAttribute("scale", ".3 .3 .3");
            this.el.setAttribute("rotation", "90 0 0");
          }
          // this.el.setAttribute("position", {x:0, y:1, z:0});
          // this.el.setAttribute("position", marker.getAttribute("position"));
          // this.el.setAttribute("rotation", marker.getAttribute("rotation"));
            console.log("tryna parent " + this.el + " to " + this.data.tracking + " at position " + JSON.stringify(marker.getAttribute("position")));
            // var target = document.querySelector('.target');
        } else {
          marker = document.querySelector("a-nft");
          if (marker != null) {
            console.log("gotsa nft marker");
            marker.setAttribute("visible", "true");
            this.el.position = marker.position;
            marker.appendChild(this.el);
  
            // var target = document.querySelector('a-marker-camera');
            // marker.appendChild(this.el);
            // this.el.setAttribute("scale", ".3 .3 .3");
            this.el.setAttribute("rotation", "90 0 0");
            let vidmat = this.el.components.vid_materials;
            if (vidmat) {
              vidmat.flipY = true;
            }
            // this.el.setAttribute("position", {x:0, y:1, z:0});
            // this.el.setAttribute("position", marker.getAttribute("position"));
            // this.el.setAttribute("rotation", marker.getAttribute("rotation"));
              console.log("tryna parent " + this.el + " to " + this.data.tracking + " at position " + JSON.stringify(marker.getAttribute("position")));
              // var target = document.querySelector('.target');
          }
        }
      }
      if (this.data.tracking == "target") {
        //set class and ?
        this.el.classList.add("target");
      }
      
    // });
  }
});

AFRAME.registerComponent('listen-from-camera', { //attached to cam entity, update the scene listener to cam position every tick 
  init: function () {
    // this.isMoving = false;
    this.lastPosition = "0 0 0";
    this.tick = AFRAME.utils.throttleTick(this.tick, 500, this);
  },
  // tick: function(time, deltaTime) {
    tick: function(t) {

    camPosition = this.el.object3D.position;
    // console.log("camPositon " + JSON.stringify(camPosition) + " Vs lastPosition " + JSON.stringify(this.lastPosition) );
   
      if (Howler != null) {  //just Howler?

          Howler.pos(camPosition.x, camPosition.y, camPosition.z);

      }
      // AudioAnalyzer();
  }
}); //end register

function roundToTwo(num) {    
  return +(Math.round(num + "e+2")  + "e-2");
}
AFRAME.registerComponent('pos-rot-reader', { //no
  init: function () {
    // Set up the tick throttling.
    this.tick = AFRAME.utils.throttleTick(this.tick, 250, this);
    this.cp = new THREE.Vector3();
    this.cr = new THREE.Vector3();
    var entity = this.el;
  },
  tick: function (t, dt) {
    // // Run on an interval.
    // if (t - this.time < 1000) { return; } 
    // this.time = t;
    // Calculate a position.

    if (cameraPosition != null && cameraPosition != undefined) { //declared in connect.js
      // this.cp = this.el.getAttribute('position');
      this.el.object3D.getWorldPosition(this.cp)
      // entity.object3D.getWorldPosition(this.cp);
      // this.cp.x = roundToTwo(this.cp.x);
      // this.cp.y = roundToTwo(this.cp.y);
      // this.cp.z = roundToTwo(this.cp.z);
      cameraPosition.x = roundToTwo(this.cp.x);
      cameraPosition.y = roundToTwo(this.cp.y);
      cameraPosition.z = roundToTwo(this.cp.z);
    }
    if (cameraRotation != null && cameraPosition != undefined) { //declared in connect.js
      this.cr = this.el.getAttribute('rotation');
      cameraRotation.x = roundToTwo(this.cr.x);
      cameraRotation.y = roundToTwo(this.cr.y);
      cameraRotation.z = roundToTwo(this.cr.z);
    }
    // console.log(JSON.stringify(cameraPosition) +  " " + JSON.stringify(cameraRotation));
  }
});
AFRAME.registerComponent('get_pos_rot', { //using this one now, returns on request
  schema: {
    trackables: {default: ''},
    // href: {default: ''},
    init: {default: true}
  },
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, 100, this);
    this.cp = new THREE.Vector3();
    this.cr = new THREE.Vector3();
    this.last = new THREE.Vector3();
    this.posRotObj = {};
    // this.navmeshComponent = null;
    // this.navmeshEl = document.getElementById('nav_mesh');
    // if (this.navmeshEl != null) {
    //   console.log('gotsa navmeshEl!');
    //   this.navmeshComponent = this.navmeshEl.components.nav_mesh;
    // }
   //   document.querySelector('a-scene').addEventListener('loaded', function () {
  //     console.log("AFRAME Init");
  //     InitSceneHooks();
  //  });
    // var entity = this.el;
    // this.geometry = new THREE.SphereBufferGeometry(.1, 16, 16);
    // this.el.append(this.geometry);
  },
  returnPos: function () {
    this.el.object3D.getWorldPosition(this.cp);
    if (this.cp) {
    this.cp.x = roundToTwo(this.cp.x);
    this.cp.y = roundToTwo(this.cp.y);
    this.cp.z = roundToTwo(this.cp.z);
    
    }
 
    if (this.cp != undefined) {
      return this.cp;
    } 
  },
  returnPosRot: function() {
    // var entity = this.el;
      // if (cameraPosition != null && cameraPosition != undefined) { //declared in connect.js
        // this.cp = this.el.getAttribute('position');
        this.el.object3D.getWorldPosition(this.cp);
        // this.cp = this.el.object3D.position.localToWorld(this.cp);
        // this.el.object3D.position.localToWorld(this.cp);
        // this.geometry.getWorldPosition(this.cp);
        // console.log(this.geometry.getWorldPosition(this.cp));
        // console.log("this.cp " + JSON.stringify(this.cp));
        // this.cp.x = roundToTwo(this.cp.x);
        // this.cp.y = roundToTwo(this.cp.y);
        // this.cp.z = roundToTwo(this.cp.z);
        if (this.cp) {
        this.cp.x = roundToTwo(this.cp.x);
        this.cp.y = roundToTwo(this.cp.y);
        this.cp.z = roundToTwo(this.cp.z);
        // window.playerPosition = this.cp;
        }
      // }
      // if (cameraRotation != null && cameraRotation != undefined) { //declared in connect.js
        this.cr = this.el.getAttribute('rotation');
        if (this.cr) {
        this.cr.x = roundToTwo(this.cr.x);
        this.cr.y = roundToTwo(this.cr.y);
        this.cr.z = roundToTwo(this.cr.z);
        }
        if (this.cp != undefined && this.cr != undefined) {
          this.posRotObj.pos = this.cp;
          this.posRotObj.rot = this.cr;
          return this.posRotObj;
        } else {
          return this.posRotObj;
        }
        
        
  },
  tick: function () {
    if (window != null) { //declared in server response, should init before any other client stuff
      window.playerPosition = this.cp;
    } 
    // if (this.navmeshComponent != null) {
    //   // this.navmeshComponent.clampPosition(this.cp);
    // }
  }

});

AFRAME.registerComponent('listen-for-vr-mode', { //attached to cam entity, update the scene listener to cam position every tick
  init: function () {
    document.querySelector('a-scene').addEventListener('enter-vr', function () { //no matter what
      // console.log("ENTERED VR");
      let player = document.getElementById("player");
      player.setAttribute("look-controls", {'hmdEnabled': true});
    });
  }
}); //end register


AFRAME.registerComponent('basic-link', {
  schema: {
    href: {default: ''},
    downTimer: {default: ''},
    isDown: {default: false}
    // href: {default: ''},
  },
  init: function() {
    this.el.addEventListener('mousedown', (e)=> { //TODO turn off if parent is freaking invisible!!!!
      // e.stopPropagation();
      // e.preventDefault();
      console.log("basic link click for href " + this.data.href);
      // clearTimeout(this.downTimer);
      // this.data.downTimer = setInterval(() => {
      //   console.log("basic link click for href " + this.data.href);
      //   if (this.data.href != undefined && this.data.href.length > 5) {
      //     //  window.location = this.data.href;
      //     if (iOSSafari) {
      //       console.log("safari time!");
      //         // window.location = this.data.href;
      //         window.open(this.data.href, "_blank");
      //     } else {
      //       window.open(this.data.href, "_blank");
      //         // var a = document.createElement('a');
      //         // a.target="_blank";
      //         // a.href=this.data.href;
      //         // a.click();
      //       }
      //   }
      // }, 200);

      // this.el.focus();
      this.data.isDown = true;
    });
    this.el.addEventListener('mouseup', (e)=> {
      // console.log("tryna clear timeout");
      // window.clearInterval(this.data.downTimer);
      if (this.data.isDown) {
        window.open(this.data.href, "_blank");
      }
    });
    this.el.addEventListener('mouseleave', (e)=> {
      // console.log("tryna clear timeout");
      // window.clearInterval(this.data.downTimer);
      this.data.isDown = false;
    });
  }
});
AFRAME.registerComponent('basic-scene-link', {
  schema: {
    href: {default: ''},
    // href: {default: ''},
  },
  init: function() {
    this.el.addEventListener('mousedown', (e)=> { // turn off if parent is freaking invisible!!!!
      console.log("basic scene link click for scene href " + this.data.href);
      if (this.data.href != undefined && this.data.href.length > 5) {
      //  window.location = this.data.href;
      //  var a = document.createElement('a');
      //   a.href=this.data.href;
      //   a.click();
        // window.location.href = this.data.href;
        if (iOSSafari) {
          console.log("safari time!");
            // window.location = this.data.href;
            window.open(this.data.href, "_blank");
        } else {
          window.open(this.data.href, "_blank");
            // var a = document.createElement('a');
            // a.target="_blank";
            // a.href=this.data.href;
            // a.click();
          }
      }
    })
  }
});

AFRAME.registerComponent('play-on-window-click', { //play videosphere
  init: function () {
    this.onClick = this.onClick.bind(this);
  },
  play: function () {
    window.addEventListener('click', this.onClick);
  },
  pause: function () {
    window.removeEventListener('click', this.onClick);
  },
  onClick: function (evt) {
    var video = this.el.components.material.material.map.image;
    if (!video) { return; }
    video.play();
  }
});

AFRAME.registerComponent('play-on-vrdisplayactivate-or-enter-vr', { //play videosphere in vr mode
  init: function () {
    this.playVideo = this.playVideo.bind(this);
    this.playVideoNextTick = this.playVideoNextTick.bind(this); 
  },
  play: function () {
    window.addEventListener('vrdisplayactivate', this.playVideo);
    this.el.sceneEl.addEventListener('enter-vr', this.playVideoNextTick);
  },
  pause: function () {
    this.el.sceneEl.removeEventListener('enter-vr', this.playVideoNextTick);
    window.removeEventListener('vrdisplayactivate', this.playVideo);
  },
  playVideoNextTick: function () {
    setTimeout(this.playVideo);
  },
  playVideo: function () {
    var video = this.el.components.material.material.map.image;
    if (!video) { return; }
    video.play();
  }
});
// AFRAME.registerComponent('screenshot', {

  // document.querySelector('a-scene').components.screenshot.capture('perspective');

// });

AFRAME.registerComponent('main-text-control', {
    schema: {
        mainTextString: {default: ''},
        mode: {default: ""},
        jsonData: {default: ""}
      },
      init: function () {
        let theData = this.el.getAttribute('data-maintext');
        // console.log("theData" + theData);
        this.data.jsonData = JSON.parse(atob(theData)); //convert from base64
        // console.log(this.data.jsonData);
        this.data.mainTextString = this.data.jsonData;
        let textArray = [];
        let index = 0;  
        let nextButton = document.getElementById("nextMainText");
        let previousButton = document.getElementById("previousMainText");
        let mainTextHeader = document.getElementById("mainTextHeader");
        if (this.data.mainTextString != undefined) {
            // console.log("maintext " + this.data.mainTextString);
            
            if (this.data.mode == "Paged" && this.data.mainTextString.length > 400) { //pagination!
              // console.log(this.data.mainTextString);
              let indexes = [];  //array for split indexes;
              let lastIndex = 0;
              let wordSplit = this.data.mainTextString.split(" ");
              for (let i = 0; i < this.data.mainTextString.length - 1; i++) {
                if (i == 400 + lastIndex) {
                  lastIndex = this.data.mainTextString.indexOf(' ', i); //get closest space to char count
                  indexes.push(lastIndex);
                }
              }
              for (let s = 0; s < indexes.length; s++) {
                if (s == 0) {
                  let enc = this.data.mainTextString.substring(0, indexes[s]);
                  textArray.push(this.data.mainTextString.substring(0, indexes[s]));
                  textArray.push(enc);
                  
                } else {
                  // let chunk = encodeURI(this.data.mainTextString.substring(indexes[s], indexes[s+1]));
                let chunk = this.data.mainTextString.substring(indexes[s], indexes[s+1]);
                // console.log("tryna push chunck: " + chunk);
                textArray.push(chunk);
                }
              }
            // }

            } else { //if mode == "split"
              textArray = this.data.mainTextString.split("~"); //TODO scroll
            }      
            
            // console.log(JSON.stringify(textArray));

            
            this.textArray = textArray;
            // tArray.length = this.textArray.length;

            document.querySelector("#mainText").setAttribute('text', {
                baseline: "top",
                align: "left",
                value: this.textArray[0]
            });

            // console.log("mainTextString: " + textArray[0]);
            let uiMaterial = new THREE.MeshStandardMaterial( { color: '#63B671' } ); 
            if (this.textArray.length > 1) {
              mainTextHeader.setAttribute('visible', true);
              mainTextHeader.setAttribute('text', {
                  baseline: "top",
                  align: "left",
                  value: "page 1 of " + textArray.length 
              });
              nextButton.setAttribute('visible', true);
              previousButton.setAttribute('visible', true);
             
              nextButton.addEventListener('model-loaded', () => {
                const obj = nextButton.getObject3D('mesh');
                obj.traverse(node => {
                  node.material = uiMaterial;
                  });
                });
              previousButton.addEventListener('model-loaded', () => {
                const obj = previousButton.getObject3D('mesh');
                obj.traverse(node => {
                  node.material = uiMaterial;
                });
              });  

                nextButton.addEventListener('mousedown', function () {
                    if (textArray.length > index + 1) {
                        index++;
                    } else {
                        index = 0;
                    }
                    // console.log(textArray[index]);
                    document.querySelector("#mainText").setAttribute('text', {
                      baseline: "top",
                      align: "left",
                        value: textArray[index]
                    });
                    mainTextHeader.setAttribute('text', {
                      baseline: "top",
                      align: "left",
                      value: "page "+(index+1)+" of " + textArray.length
                    });
                });

                previousButton.addEventListener('mousedown', function () {
                  if (index > 0) {
                      index--;
                  } else {
                      index = textArray.length - 1;
                  }
                  // console.log(textArray[index]);
                  document.querySelector("#mainText").setAttribute('text', {
                    baseline: "top",
                    align: "left",
                      value: textArray[index]
                  });
                  mainTextHeader.setAttribute('text', {
                    baseline: "top",
                    align: "left",
                    value: "page "+(index+1)+" of " + textArray.length
                  });
              });
            }
        }
    }
});

AFRAME.registerComponent('toggle-main-text', {
    schema: {
        mainTextString: {default: ''},
      },
      init: function () {
        this.textureArray = [];
        const data = this.data;
        this.el.addEventListener('model-loaded', () => {
        // // Grab the mesh / scene.
        // let nextButton = document.getElementById("nextMainText");
        // let previousButton = document.getElementById("previousMainText");
        const obj = this.el.getObject3D('mesh');
        this.material = new THREE.MeshStandardMaterial( { color: '#63B671' } ); 
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
          this.material.envMap = this.texture;        
          this.material.envMap.intensity = 1;
          this.material.needsUpdate = true;
        }
        obj.traverse(node => {
          node.material = this.material;
          });
        });
        // const nextObj = document.getElementById("nextMainText").getObject3D('mesh');
        // nextObj.traverse(node => {
        //   node.material = material;
        // });
        // const previousObj = document.getElementById("previousMainText").getObject3D('mesh');
        // previousObj.traverse(node => {
        //   node.material = material;
        // });

        this.el.addEventListener('mousedown', function () {
         

          if (!document.querySelector("#mainTextPanel").getAttribute('visible')){
            document.querySelector("#mainTextPanel").setAttribute('visible', true);
            // const nextObj = document.getElementById("nextMainText").getObject3D('mesh');
            // nextObj.traverse(node => {
            //   node.material = this.material;
            // });
            // const previousObj = document.getElementById("previousMainText").getObject3D('mesh');
            // previousObj.traverse(node => {
            //   node.material = this.material;
            // });
            // this.el.setAttribute('material', 'color', 'green');
            // console.log('tryna toggle main text panel ' + document.querySelector("#mainTextPanel"));
          } else {
            document.querySelector("#mainTextPanel").setAttribute('visible', false);
          }

        });
    }
});

let attributionsArray = [];
let attributionsIndex = 0;
AFRAME.registerComponent('attributions-text-control', {

    schema: {
      jsonData: {default: ""}
    },
    init: function () {
      let theData = this.el.getAttribute('data-attributions');
      // console.log("attributions data" + theData);
      
      this.data.jsonData = JSON.parse(atob(theData)); //convert from base64
      // console.log("parsedAttribtions data : " +JSON.stringify(this.data.jsonData));
      
      // let tArray = this.data.jsonData.attributions; //must use a declared name for array, raw array doesn't work
      let tArray = this.data.jsonData;

      attributionsArray = tArray; //for toggle component below
      
      // this.attributionsObject = attributions; //take from 
      // console.log("attributionsObject " + JSON.stringify(this.attributionsObject));
      // console.log("attributiosn length: " + tArray.length);
      attributionsIndex = 0;  
      if (tArray != undefined && tArray.length > 0) {       
          this.tArray = tArray;
          // tArray.length = tArray.length;
          let headerEl = document.getElementById("attributionsHeaderText");
          let sourceEl = document.getElementById("attributionsSourceText");
          let authorEl = document.getElementById("attributionsAuthorText");
          let licenseEl = document.getElementById("attributionsLicenseText");
          let modsEl = document.getElementById("attributionsModsText");
          let nextButton = document.getElementById("nextAttribution");
          let previousButton = document.getElementById("previousAttribution");

          if (tArray[0].sourceTitle != undefined && tArray[0].sourceTitle != null ) {

          headerEl.setAttribute('text', {
            baseline: "top",
            align: "left",
            // color: "lightblue",
            value: "Attribution 1 of " + tArray.length
          });
          sourceEl.setAttribute('text', {
              baseline: "top",
              align: "left",
              // color: "lightblue",
              value: "Source: " + tArray[0].sourceTitle
          });
          // if (tArray[0].sourceLink != undefined && tArray[0].sourceLink.length > 0) {
          //   sourceEl.setAttribute('basic-link', {href: tArray[0].sourceLink});
          // }
          authorEl.setAttribute('text', {
            baseline: "top",
            align: "left",
            // color: "lightblue",
            value: "Author: " + tArray[0].authorName
          });
          // if (tArray[0].authorLink != undefined && tArray[0].authorLink.length > 0) {
          //     authorEl.setAttribute('basic-link', {href: tArray[0].authorLink});
          // }
          
          licenseEl.setAttribute('text', {
            baseline: "top",
            align: "left",
            value: "License: " + tArray[0].license
          });
          licenseEl.setAttribute('basic-link', {href: "https://creativecommons.org/licenses"});
          let mods = tArray[0].modifications.toLowerCase().includes("undefined") ? "none" : tArray[0].modifications;
          modsEl.setAttribute('text', {
            baseline: "top",
            align: "left",
            value: "Mods: " + mods
          });

        } else {
          headerEl.setAttribute('text', {
            baseline: "top",
            align: "left",
            // color: "lightblue",
            value: "Attribution 1 of " + tArray.length
          });
          sourceEl.setAttribute('text', {
              baseline: "top",
              align: "left",
              // color: "lightblue",
              value: "Attribution : " + tArray[0].sourceText
          });

        }

          let uiMaterial = new THREE.MeshStandardMaterial( { color: 'blue' } ); 
          
          if (tArray.length > 1) {
            nextButton.setAttribute('visible', true);
            previousButton.setAttribute('visible', true);
            nextButton.setAttribute('visible', true);
            previousButton.setAttribute('visible', true);
            // let uiMaterial = new THREE.MeshStandardMaterial( { color: 'blue' } ); 
            nextButton.addEventListener('model-loaded', () => {
              const obj = nextButton.getObject3D('mesh');
              obj.traverse(node => {
                node.material = uiMaterial;
                });
              });
            previousButton.addEventListener('model-loaded', () => {
              const obj = previousButton.getObject3D('mesh');
              obj.traverse(node => {
                node.material = uiMaterial;
              });
            });  
          }
          previousButton.addEventListener('mousedown', function () {
            console.log("tryna show previous from index" + attributionsIndex);
            if (attributionsIndex > 0) {
                  attributionsIndex--;
              } else {
                attributionsIndex = tArray.length - 1;
              }
              headerEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                // color: "lightblue",
                value: "Attribution "+(attributionsIndex+1)+" of " + tArray.length
              });
              sourceEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                // color: "lightblue",
                value: "Source: " + tArray[attributionsIndex].sourceTitle
              });
              if (tArray[attributionsIndex].sourceLink != undefined && tArray[attributionsIndex].sourceLink.length > 0) {
                sourceEl.setAttribute('basic-link', {href: tArray[attributionsIndex].sourceLink});
              } else {
                sourceEl.setAttribute('basic-link', {href: "no"});
                sourceEl.removeAttribute('basic-link', true);
              }
              authorEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                // color: "lightblue",
                value: "Author: " + tArray[attributionsIndex].authorName
              });
              if (tArray[attributionsIndex].authorLink != undefined && tArray[attributionsIndex].authorLink.length > 0) {
                authorEl.setAttribute('basic-link', {href: tArray[attributionsIndex].authorLink});
              } else {
                console.log("removing link");
                authorEl.setAttribute('basic-link', {href: "no"});
                authorEl.removeAttribute('basic-link', true);
              }
              licenseEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                value: "License: " + tArray[attributionsIndex].license
              });
              licenseEl.setAttribute('basic-link', {href: "https://creativecommons.org/licenses"});
              modsEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                value: "Mods: " + tArray[attributionsIndex].modifications
              });
          });          
          nextButton.addEventListener('mousedown', function () {
            console.log("tryna show next from index" + attributionsIndex);
            if (tArray.length > attributionsIndex + 1) {
                  attributionsIndex++;
              } else {
                attributionsIndex = 0;
              }
              headerEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                // color: "lightblue",
                value: "Attribution "+ (attributionsIndex+1) +" of " + tArray.length
              });
              sourceEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                // color: "lightblue",
                value: "Source: " + tArray[attributionsIndex].sourceTitle
              });
              if (tArray[attributionsIndex].sourceLink != undefined && tArray[attributionsIndex].sourceLink.length > 4) {
                sourceEl.setAttribute('basic-link', {href: tArray[attributionsIndex].sourceLink});
              } else {
                console.log("removing link");
                sourceEl.setAttribute('basic-link', {href: "no"}); //try to override to force it
                sourceEl.removeAttribute('basic-link', true);
              }
              authorEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                // color: "lightblue",
                value: "Author: " + tArray[attributionsIndex].authorName
              });
              if (tArray[attributionsIndex].authorLink != undefined && tArray[attributionsIndex].authorLink.length > 0) {
                authorEl.setAttribute('basic-link', {href: tArray[attributionsIndex].authorLink});
              } else {
                console.log("removing link");
                authorEl.setAttribute('basic-link', {href: "no"});
                authorEl.removeAttribute('basic-link', true);
              }
              licenseEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                value: "License: " + tArray[attributionsIndex].license
              });
              licenseEl.setAttribute('basic-link', {href: "https://creativecommons.org/licenses"});
              modsEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                value: "Mods: " + tArray[attributionsIndex].modifications
              });
          });
      }
  }
});

AFRAME.registerComponent('toggle-attributions-text', {
  schema: {
      mainTextString: {default: ''},
    },
    init: function () {
      this.textureArray = [];
      this.envmapEl = null;
      this.texture = null;
      const data = this.data;
      this.el.addEventListener('model-loaded', () => {
        const obj = this.el.getObject3D('mesh');
        for (let i = 1; i < 7; i++) {
          this.envmapEl = document.querySelector("#envmap_" + i);
          if (this.envmapEl) {
          this.path = this.envmapEl.getAttribute("src");
          // console.log("envMap path " + this.path);
          this.textureArray.push(this.path);
          }
        }
        this.texture = new THREE.CubeTextureLoader().load(this.textureArray);
        this.texture.format = THREE[data.format];

        this.material = new THREE.MeshStandardMaterial( { color: 'blue' } ); 
        this.material.envMap = this.texture;
        this.material.envMap.intensity = 1;
        this.material.needsUpdate = true;
        obj.traverse(node => {
          node.material = this.material;

          });
      });
      

      let sourceEl = document.getElementById("attributionsSourceText");
      let authorEl = document.getElementById("attributionsAuthorText");
      this.el.addEventListener('mousedown', function () {
        if (!document.querySelector("#attributionsTextPanel").getAttribute('visible')){
          document.querySelector("#attributionsTextPanel").setAttribute('visible', true);
          if (attributionsArray[attributionsIndex] != undefined) {
            if (attributionsArray[attributionsIndex].sourceLink != undefined && attributionsArray[attributionsIndex].sourceLink.length > 0) {
              sourceEl.setAttribute('basic-link', {href: attributionsArray[attributionsIndex].sourceLink});
            }
            if (attributionsArray[attributionsIndex].authorLink != undefined && attributionsArray[attributionsIndex].authorLink.length > 0) {
              authorEl.setAttribute('basic-link', {href: attributionsArray[attributionsIndex].authorLink});
            }    
          } else {
            document.querySelector("#attributionsTextPanel").setAttribute('visible', false);
            sourceEl.setAttribute('basic-link', {href: "no"});
            authorEl.setAttribute('basic-link', {href: "no"}); //the only way!?!
          }
        }
      });
  }
  // applyEnvMap: function () {
  //   const mesh = this.el.getObject3D('mesh');

  //   const envMap = this.texture;
  //   if (!mesh) return;
  //   mesh.traverse(function (node) {
  //     if (node.material && 'envMap' in node.material) {
  //     // if (node.material) {
  //       // console.log("tryna set envmap on " + node.material.name);
  //       node.material.envMap = envMap;
  //       node.material.envMap.intensity = 1;
  //       node.material.needsUpdate = true;
  //     }
  //   });
  // }
});


let availableScenesIndex = 0;
let scenesArray = [];
AFRAME.registerComponent('available-scenes-control', {
  schema: {
    jsonData: {
      parse: JSON.parse,
      stringify: JSON.stringify
      }
    },
    init: function () {
      this.textureArray = [];
      const data = this.data;
      scenesArray = this.data.jsonData.availableScenes; 
      // console.log(JSON.stringify(scenesArray));
      let availableScenePicEl = document.getElementById("availableScenePic");
      let nextButton = document.getElementById("availableScenesNextButton");
      let previousButton = document.getElementById("availableScenesPreviousButton");
      for (let i = 1; i < 7; i++) {
        this.envmapEl = document.querySelector("#envmap_" + i);
        if (this.envmapEl) {
        this.path = this.envmapEl.getAttribute("src");
        // console.log("envMap path " + this.path);
        this.textureArray.push(this.path);
        }
      }
      this.texture = new THREE.CubeTextureLoader().load(this.textureArray);
      this.texture.format = THREE[data.format];

      let uiMaterial = new THREE.MeshStandardMaterial( { color: 'gold' } ); 
      uiMaterial.envMap = this.texture;        
      uiMaterial.envMap.intensity = 1;
      uiMaterial.needsUpdate = true;

      availableScenesIndex = 0;  
      if (scenesArray != undefined && scenesArray.length > 0) {        
        
        let headerEl = document.getElementById("availableScenesHeaderText");
        headerEl.setAttribute('text', {
          baseline: "top",
          align: "left",
          // color: "lightblue",
          value: "Scene: " + scenesArray[availableScenesIndex].sceneTitle + "\n" + "Code: " + scenesArray[availableScenesIndex].sceneKey  + "\n" + "By: " + scenesArray[availableScenesIndex].sceneOwner + "\n" + "Keynote: " + scenesArray[availableScenesIndex].sceneKeynote+ "\n" + "Description: " + scenesArray[availableScenesIndex].sceneDescription 
        });
      // let sceneHref = "/webxr/" + scenesArray[availableScenesIndex].sceneKey;
      // availableScenePicEl.setAttribute('basic-scene-link', {href: sceneHref});
     
      // console.log("gotsome jsonData re " + JSON.stringify(scenesArray));
      var loader = new THREE.TextureLoader();
      // load a resource
      loader.load(
        // resource URL
        scenesArray[availableScenesIndex].scenePostcardHalf, //make sure first one is preloaded
        // onLoad callback
        function ( texture ) { 
          texture.encoding = THREE.sRGBEncoding; 
          texture.flipY = false; 
          var material = new THREE.MeshBasicMaterial( {
            map: texture
           } );
           let obj = availableScenePicEl.getObject3D('mesh');  
           if (obj != undefined) {
            obj.traverse(node => { 
              node.material = material;
            });
          }
        },
        function ( err ) {
          console.error( 'An error happened.' );
        }
      );
      this.el.addEventListener('toggleOnAvailableScenes', function (event) {
        console.log('toggleOnPicGroup event detected with', event.detail);
        let mesh = pictureGroupPicEl.getObject3D('mesh');
        this.href = picGroupArray[0].images[0].url;
        console.log("tryna load initial scene pic " + this.href);
        this.texture = null;
        this.material = null;
        // const obj = pictureGroupPicEl.getObject3D('mesh');
        var loader = new THREE.TextureLoader();
        // load a resource
        loader.load(
          // resource URL
          scenesArray[availableScenesIndex].scenePostcardHalf, //make sure first one is preloaded
          // onLoad callback
          function ( texture ) { 
            texture.encoding = THREE.sRGBEncoding; 
            texture.flipY = false; 
            // in this example we create the material when the texture is loaded
            var material = new THREE.MeshBasicMaterial( {
              map: texture
             });
             let obj = availableScenePicEl.getObject3D('mesh');  
             obj.traverse(node => { //needs a callback here to insure it gets painted the first time
              node.material = material;
            });
          },
          function ( err ) {
            console.error( 'An error happened.' );
          }
        );
      });


      nextButton.addEventListener('model-loaded', () => {
        const obj = nextButton.getObject3D('mesh');
        obj.traverse(node => {
          node.material = uiMaterial;
          });
          // let sceneHref = "/webxr/" + scenesArray[availableScenesIndex].sceneKey; //wait so link isn't hot till visible
          let sceneHref = "";
          availableScenePicEl.setAttribute('basic-scene-link', {href: sceneHref});   
        });

      nextButton.addEventListener('mousedown', function () {

        console.log("tryna show next from index" + availableScenesIndex);
        if (scenesArray.length > availableScenesIndex + 1) {
          availableScenesIndex++;
          } else {
          availableScenesIndex = 0;
        }
        let sceneHref = "/webxr/" + scenesArray[availableScenesIndex].sceneKey;
        availableScenePicEl.setAttribute('basic-scene-link', {href: sceneHref});
        headerEl.setAttribute('text', {
          baseline: "top",
          align: "left",
          // color: "lightblue",
          value: "Scene: " + scenesArray[availableScenesIndex].sceneTitle + "\n" + "Code: " + scenesArray[availableScenesIndex].sceneKey  + "\n" + "By: " + scenesArray[availableScenesIndex].sceneOwner + "\n" + "Keynote: " + scenesArray[availableScenesIndex].sceneKeynote+ "\n" + "Description: " + scenesArray[availableScenesIndex].sceneDescription 
        });
        const obj = availableScenePicEl.getObject3D('mesh');
        const href = scenesArray[availableScenesIndex].scenePostcardHalf;
        console.log("tryna set texture..." + href);
        var texture = new THREE.TextureLoader().load(href);
        texture.encoding = THREE.sRGBEncoding; 
        texture.flipY = false; 
        var material = new THREE.MeshBasicMaterial( { map: texture } ); 
        obj.traverse(node => {
          node.material = material;
        });
      });

      previousButton.addEventListener('model-loaded', () => {
        const obj = previousButton.getObject3D('mesh');
        obj.traverse(node => {
          node.material = uiMaterial;
          });
        });
      previousButton.addEventListener('mousedown', function () {
        console.log("tryna show next from index" + availableScenesIndex);
        if (availableScenesIndex > 0) {
          availableScenesIndex--;
        } else {
          availableScenesIndex = scenesArray.length - 1;
        }

        let sceneHref = "/webxr/" + scenesArray[availableScenesIndex].sceneKey;
        availableScenePicEl.setAttribute('basic-scene-link', {href: sceneHref});
        headerEl.setAttribute('text', {
          baseline: "top",
          align: "left",
          // color: "lightblue",
          value: "Scene: " + scenesArray[availableScenesIndex].sceneTitle + "\n" + "Code: " + scenesArray[availableScenesIndex].sceneKey  + "\n" + "By: " + scenesArray[availableScenesIndex].sceneOwner + "\n" + "Keynote: " + scenesArray[availableScenesIndex].sceneKeynote+ "\n" + "Description: " + scenesArray[availableScenesIndex].sceneDescription 
        });
        const obj = availableScenePicEl.getObject3D('mesh');
        const href = scenesArray[availableScenesIndex].scenePostcardHalf;
        console.log("tryna set texture..." + href);
        var texture = new THREE.TextureLoader().load(href);
        texture.encoding = THREE.sRGBEncoding; 
        texture.flipY = false; 
        var material = new THREE.MeshBasicMaterial( { map: texture } ); 
        obj.traverse(node => {
          node.material = material;
        });
      });
      availableScenePicEl.addEventListener('model-loaded', () => {
        // Grab the mesh / scene.
        const obj = availableScenePicEl.getObject3D('mesh');
        const href = scenesArray[0].scenePostcardHalf;
        console.log("tryna set texture..." + href);
        var texture = new THREE.TextureLoader().load(href);
        texture.encoding = THREE.sRGBEncoding; 
        texture.flipY = false; 
        var material = new THREE.MeshBasicMaterial( { map: texture } ); 
        obj.traverse(node => {
          node.material = material;
        });
        });
      }
    }
});
AFRAME.registerComponent('toggle-available-scenes', {
  schema: {
      mainTextString: {default: ''},
    },
    init: function () {
      const data = this.data;
      this.textureArray = [];
      this.envmapEl = null;
      this.el.addEventListener('model-loaded', () => {
        const obj = this.el.getObject3D('mesh');

        this.material = new THREE.MeshStandardMaterial( { color: 'gold' } ); 
        for (let i = 1; i < 7; i++) {
          this.envmapEl = document.querySelector("#envmap_" + i);
          if (this.envmapEl) {
          this.path = this.envmapEl.getAttribute("src");
          // console.log("envMap path " + this.path);
          this.textureArray.push(this.path);
          }
        }
        this.texture = new THREE.CubeTextureLoader().load(this.textureArray);
        this.texture.format = THREE[data.format];

        this.material.envMap = this.texture;        
        this.material.envMap.intensity = 1;
        this.material.needsUpdate = true;
        // this.material = this.material;

        obj.traverse(node => {

          // node.material = this.material;
          });
          // this.applyEnvMap();
          // this.el.addEventListener('object3dset', this.applyEnvMap.bind(this));
        });

      // this.el.setAttribute("skybox-env-map");
      let scenesPanelEl = document.getElementById("availableScenesPanel");
      this.el.addEventListener('mousedown', function () {
        console.log("scenePanel visible " + scenesPanelEl.getAttribute('visible'));
        if (!scenesPanelEl.getAttribute('visible')){
          
          scenesPanelEl.setAttribute('visible', true);
          // // console.log(scenesPanelEl.getAttribute('available-scenes-control', jsonData.availableScenes));
          // // console.log(scenesArray);
          // var scene = scenesArray[Math.floor(Math.random() * scenesArray.length)];
          let sceneHref = "/webxr/" + scenesArray[0].sceneKey;
          console.log(sceneHref);
          document.getElementById("availableScenePic").setAttribute('basic-scene-link', {href: sceneHref});

        } else {
          scenesPanelEl.setAttribute('visible', false);

        }

      });
  },
  // applyEnvMap: function () {
  //   const mesh = this.el.getObject3D('mesh');

  //   const envMap = this.texture;
  //   if (!mesh) return;
  //   mesh.traverse(function (node) {
  //     if (node.material && 'envMap' in node.material) {
  //     // if (node.material) {
  //       // console.log("tryna set envmap on " + node.material.name);
  //       node.material.envMap = envMap;
  //       node.material.envMap.intensity = 1;
  //       node.material.needsUpdate = true;
  //     }
  //   });
  // }
});

AFRAME.registerComponent('entity-callout', {
  schema: {
      calloutString: {default: "play/pause"},
    },
    init: function () {
      var sceneEl = document.querySelector('a-scene');
      //let calloutString = this.data.calloutString;

      let calloutEntity = document.createElement("a-entity");
      let calloutText = document.createElement("a-text");
     
      // this.calloutText = calloutText;
      // calloutText.setAttribute('overlay');
      calloutEntity.setAttribute("look-at", "#player");
      calloutEntity.setAttribute('visible', false);
      // calloutEntity.setAttribute("render-order", "hud");
      sceneEl.appendChild(calloutEntity);
      calloutEntity.appendChild(calloutText);
      calloutText.setAttribute("position", '0 0 .3'); //offset the child on z toward camera, to prevent overlap on model
      calloutText.setAttribute('text', {
        baseline: "bottom",
        align: "center",
        font: "/fonts/Exo2Bold.fnt",
        anchor: "center",
        wrapCount: 150,
        color: "white",
        value: "Play/Pause"
      });
      this.el.addEventListener('mouseenter', function (evt) {
        console.log("tryna mouseover entity-callout");
        calloutEntity.setAttribute('visible', true);
        let pos = evt.detail.intersection.point; //hitpoint on model
        // console.log(pos);
        calloutEntity.setAttribute("position", pos);
        // calloutText.updateMatrixWorld();
      });
      this.el.addEventListener('mouseleave', function (evt) {
        // console.log("tryna mouseexit");
        calloutEntity.setAttribute('visible', false);
      });
    }
  });

AFRAME.registerComponent('model-callout', {
  schema: {
      index: {default: 0},
    },
    init: function () {
      var sceneEl = document.querySelector('a-scene');
      let obj = this.el.object3DMap;
      // let map = this.el.getObject3D('mesh').el;
      let name = obj.Object3D.name; //whew!
      name = name.split('~')[0];
      name = name.replace(/\_/g, " ");
      
      let calloutEntity = document.createElement("a-entity");
      let calloutText = document.createElement("a-text");
     
      // this.calloutText = calloutText;
      // calloutText.setAttribute('overlay');
      calloutEntity.setAttribute("look-at", "#player");
      calloutEntity.setAttribute('visible', false);
      // calloutEntity.setAttribute("render-order", "hud");
      sceneEl.appendChild(calloutEntity);
      calloutEntity.appendChild(calloutText);
      calloutText.setAttribute("position", '0 0 3'); //offset the child on z toward camera, to prevent overlap on model
      calloutText.setAttribute('text', {
        baseline: "bottom",
        align: "center",
        font: "/fonts/Exo2Bold.fnt",
        anchor: "center",
        wrapCount: 30,
        color: "black",
        value: name
      });
      this.el.addEventListener('mouseenter', function (evt) {

        calloutEntity.setAttribute('visible', true);
        let pos = evt.detail.intersection.point; //hitpoint on model
        calloutEntity.setAttribute("position", pos);
        // calloutText.updateMatrixWorld();
      });
      this.el.addEventListener('mouseleave', function (evt) {
        // console.log("tryna mouseexit");
        calloutEntity.setAttribute('visible', false);
      });
    }
  });

  //reusable lerping function for position/rotation, by #id
  AFRAME.registerComponent('mover', {
    schema: {
      eltype: {default: "avatar"} // no, make it hands/nohands
      // journeyLengthData: {default: 0}
    },
    // let journeyLengthT = 0;
    init: function () {
      // this.journeyLength;
      // this.data.journeyLength = this.data.journeyLengthData;
      // this.startTime = 0;
      // this.currentTime = 0;
      // this.speed = 0;
      // this.startPosition = new THREE.Vector3();
      // this.endPosition = new THREE.Vector3();
      // var InterpolationBuffer = require('buffered-interpolation');
      // let interpolationBuffer = new InterpolationBuffer();
      this.newPosition = new THREE.Vector3();
      this.newRotation = new THREE.Vector3();
      this.endPosition =  new THREE.Vector3();
      this.endRotation = new THREE.Vector3();
      var el = this.el;
      this.target = el;
      this.fractionOfJourney = 0;
      // el.setAttribute('lerp', {});
      
      // console.log("parent avatar obj: " + this.object.parent);
      // console.log("child avatar objs: " +this.object.children);
      this.pos = null; // initially there is no position or rotation
      this.rot = null;
      this.model;
      // var loop = null;
      // this.el.addEventListener('model-loaded', function() {
      //   this.model = this.object3D;
      // });
      this.el.addEventListener('update_pos_rot', function (event) {
        // var theEl = this.el;
        console.log('pos rot update!' + JSON.stringify(event.detail.position) + " " + JSON.stringify(event.detail.rotation));
        // move(el.id, event.detail.position, event.detail.rotation); 
        // if (loop != null) {
        //   clearInterval(loop);
        // }
        // this.object = this.el.object3D;
                // let newPosition = this.object3D.position;
                // let newRotation = this.object3D.rotation;

                // setInterval(function () { 
                //     if (newPosition.distanceTo(event.detail.position) > 0) {
                //     newPosition.lerp(event.detail.position, 0.1);
                //     }
                //     // console.log("tryna move!");
                //     // this (below) may seem ugly, but the rotation is a euler, not a THREE.Vector3, 
                //     // so to use the lerp function i'm doing some probably unnecessary conversions
                //     // let rot = this.object3D.rotation.toVector3().lerp(event.detail.rotation, 0.1);
                //     // newRotation.setFromVector3(rot);
                //   }, 100);
        // }


        // interpolationBuffer.setPosition(new THREE.Vector3(event.detail.position.x, event.detail.position.y, event.detail.position.z));
        // interpolationBuffer.setRotation(new THREE.Vector3(event.detail.rotation.x, event.detail.rotation.y, event.detail.rotation.z));

              // this.pos = event.detail.position;
              // this.rot = event.detail.rotation;
        // el.setAttribute('position', event.detail.position);
        // el.setAttribute('rotation', event.detail.rotation);
        // let startPosition = transform.position;
       
        // if (el != undefined) { 
          // el.object3D.getWorldPosition(this.startPosition);
          
              // this.startPosition = el.getAttribute('position');
          // this.endPosition = new THREE.Vector3(event.detail.position);
              // this.endPosition = event.detail.position;

              // console.log("startPositon " + JSON.stringify(this.startPosition) + " end position " + JSON.stringify(this.endPosition));
          
          // var startRotation = new THREE.Vector3();
          // this.el.object3D.getWorldQuaternion(startRotation);

          // // let startRotation = transform.eulerAngles;
          // let endRotation = rot;
                // this.startTime = this.currentTime;
                //     // Calculate the journey length.
                // // let journeyLength = Vector3.Distance(startPosition, endPosition);
                // this.journeyLength = this.startPosition.distanceTo(this.endPosition);
                
                // this.speed = this.journeyLength / 2;
                
                // // let journeyLengthRot = Vector3.Distance(startRotation, endRotation);
                // // let speedRot = journeyLengthRot / 2;
                // console.log("journeyLength is " + this.journeyLength);
                // this.data.journeyLengthData = this.journeyLength;

        // }
      });
    },
    move: (function (id, pos, rot) { //called directly from connect.js 
      // console.log("rot " + JSON.stringify(rot));
      var DEG2RAD = THREE.Math.DEG2RAD;
      var element = document.getElementById(id);
      var iteration = 0;
      var currentQuat = new THREE.Quaternion();
      var currentEuler = new THREE.Euler();
      var targetEuler = new THREE.Euler();
      var targetQuat = new THREE.Quaternion();
      var lerpedQuat = new THREE.Quaternion();
      var targetRot = new THREE.Vector3();
      var currentPos = element.getAttribute('position');
      var currentRot = element.getAttribute('rotation');
      element.setAttribute('rotation', rot); //fuckit!
      // var mesh = element.getObject3D('mesh');
      // console.log("mesh " + JSON.stringify(mesh));
      var interval = setInterval(function() {
         iteration++
         if (iteration < 10) { 
            currentPos = element.getAttribute('position');
            currentRot =  element.getAttribute('position');
            var lerpedPos = {};
            // var lerpedRot = {};
            lerpedPos.x = lerp(currentPos.x, pos.x, .1).toFixed(2);
            lerpedPos.y = lerp(currentPos.y, pos.y - 1, .1).toFixed(2); //because camera y is 1+
            lerpedPos.z = lerp(currentPos.z, pos.z, .1).toFixed(2);
            // var currentRot = element.getAttribute('rotation');
            // var currentQuat = Quaternion.fromEuler(currentRot);
            // var lerpedRot = {};
            // var lerpedQuat = {};
            // var targetQuat = Quaternion.fromEuler(posRotObj.rotation);
            // var lerpedQuat = currentQuat.slerp(targetQuat)(0), currentQuat;
            //(q1.slerp(q2)(0), q1);
   
            // lerpedRot.x = 
            // lerpedRot.x = lerp(currentRot.x, posRotObj.rotation.x, .1).toFixed(2);
            // lerpedRot.y = lerp(currentRot.y, posRotObj.rotation.y, .1).toFixed(2);
            // lerpedRot.z = lerp(currentRot.z, posRotObj.rotation.z, .1).toFixed(2);
            // console.log("currentRot " + JSON.stringify(currentRot) + "updatedRot " + JSON.stringify(posRotObj.rotation), " lerpedRot " + JSON.stringify(lerpedQuat));
            // targetQuat.setFromEuler(rot);
            // currentEuler.setFromVector3(currentRot);
            // targetQuat.setFromEuler(targetEuler.setFromVector3(rot));
            // console.log("targetQuat " + JSON.stringify(targetQuat));
            // targetQuat.setFromAxisAngle( rot, Math.PI / 2 );
            // currentQuat.setFromAxisAngle( element.getAttribute('position'), Math.PI / 2 );
            element.setAttribute('position', lerpedPos);
            // element.setAttribute('rotation', Quaternion.lerpedQuat.toVector());
            
            // let lerpedRot = element.object3D.rotation.toVector3().lerp(rot, 0.1);
            // element.object3D.rotation.setFromVector3(lerpedRot);

            // targetRot.applyQuaternion(currentQuat.rotateTowards(targetQuat, 0.1));
            
            // THREE.Quaternion.slerp( element.object3D.quaternion, targetQuat, lerpedQuat, 0.1 );
            // console.log("rotation " + JSON.stringify(element.object3D.quaternion), JSON.stringify(targetQuat), JSON.stringify(lerpedQuat));
            // element.object3D.applyQuaternion(lerpedQuat);
            // mesh.quaternion.slerp( targetQuat, 0.1 );
              // currentQuat = mesh.quaternion;
              // targetEuler.set(DEG2RAD * rot.x, DEG2RAD * rot.y, DEG2RAD * rot.z);
              // targetQuat.setFromEuler(targetEuler);
              // console.log("currentQuat" + JSON.stringify(currentQuat) + "targetQuat " + JSON.stringify(targetQuat));
              // THREE.Quaternion.slerp( currentQuat, targetQuat, lerpedQuat, .1);
              // mesh.quaternion = lerpedQuat;
              // mesh.quaternion.normalize();
            // element.object3D.quaternion = lerpedQuat;
              // console.log("lerpedQuat " + JSON.stringify(lerpedQuat));
            // element.object3D.quaternion.normalize();
            // const vector = new THREE.Vector3( 1, 0, 0 );
            // // vector.applyQuaternion( lerpedQuat );
            // element.setAttribute('rotation', vector);
            // element.setAttribute('position', lerpedPos);
         } else {
            clearInterval(interval);
         }
         }, 100);
    })
  });
    // tick: function (time, timeDelta) {
      
          // if(this.endPosition != null && this.endRotation != null) { 
            // console.log("this.pos " + JSON.stringify(this.pos));
          //   return;
          // } else {
                  // if (this.model == undefined) {
                  //   return;
                  // }
                  // if (!this.pos || !this.rot) {
                  //     this.pos = this.model.position;
                  //     this.rot = this.model.position;
                  // }
            // if (this.endRotation && this.endPosition) 
             // if(!this.prevPosition && !this.prevRotation) { 
            //   // there are no values to lerp from - set the initial values
            //   this.target.setAttribute('position', this.el.getAttribute('position'))
            //   this.target.setAttribute('rotation', this.el.getAttribute('rotation'))
            // } else {
                // if (this.pos && this.rot) {
                //   this.model.position.lerp(this.pos, 0.1);
                //   let rot = this.model.rotation.toVector3().lerp(this.rot, 0.1)
                //     this.model.rotation.setFromVector3(rot);
                // }
        // this.endPosition = this.newPosition;
        // this.endRotation = this.newRotation;
        // this.prevPosition = this.object.position;
        // this.prevRotation = this.object.rotation;
     
      // pos = this.object.position;
      // rot = this.object.position;
          // }
            // use the previous values to get an approximation 
          //   this.target.object3D.position.lerp(this.prevPosition, 0.1)

          //   // this (below) may seem ugly, but the rotation is a euler, not a THREE.Vector3, 
          //   // so to use the lerp function i'm doing some probably unnecessary conversions
          //   let rot = this.target.object3D.rotation.toVector3().lerp(this.prevRotation, 0.1)
          //   this.target.object3D.rotation.setFromVector3(rot)
          // }
          // // update the values
          // this.prevPosition = this.el.object3D.position
          // this.prevRotation = this.el.object3D.rotation
              // this.currentTime = time; 
      // console.log("journeyLength is " + this.journeyLength);
      // var journeyLength = this.journeyLength;
            // if (this.data.journeyLengthData > 0) {
            //   console.log("tryna move!");
            //   // this.startTime = time;
            //   // this.distCovered = (time - this.startTime) * this.speed;
            //   // this.move();
            // //   }
            // // },
            // // move: (function () {
            // //     // let distCovered = 0; //declaring outside speeds up a bit?
                
            //     // return function() {
            //     // this.startTime = time;
            //     this.distCovered = (time - this.startTime) * this.speed;
            //     // Fraction of journey completed equals current distance divided by total distance.
            //     this.fractionOfJourney = this.distCovered / journeyLength;
            //     console.log("tryna move " + this.distCovered + " fraction of journey " + this.fractionOfJourney);
            //     // Set our position as a fraction of the distance between the markers.
            //     // newPosition.lerpVectors(startPosition, endPosition, fractionOfJourney);
            //     // this.el.object3D.position(this.newPosition.lerpVectors(this.startPosition, this.endPosition, fractionOfJourney));
            //     this.el.setAttribute("position", this.newPosition.lerpVectors(this.startPosition, this.endPosition, fractionOfJourney));
            //   }
      // })()
      // if (journeyLengthRot > 0) {
      //   let distCoveredRot = (Time.time - startTime) * speedRot;
      //   // Fraction of journey completed equals current distance divided by total distance.
      //   let fractionOfJourneyRot = distCoveredRot / journeyLengthRot;
      //   // Set our position as a fraction of the distance between the markers.
      //   transform.rotation = Quaternion.Lerp(Quaternion.Euler(startRotation), Quaternion.Euler(endRotation), fractionOfJourneyRot);
      // }


  //reusable lerping function for position/rotation, by #id
  AFRAME.registerComponent('player_mover', { //
    schema: {
      // eltype: {default: "avatar"} // no, make it hands/nohands
      // journeyLengthData: {default: 0}
      
    },
    // let journeyLengthT = 0;
    init: function () {
      this.newPosition = new THREE.Vector3();
      this.newRotation = new THREE.Vector3();
      this.endPosition =  new THREE.Vector3();
      this.endRotation = new THREE.Vector3();
      var el = this.el;
      this.target = el;
      this.fractionOfJourney = 0;
      this.pos = null; // initially there is no position or rotation
      this.rot = null;
      this.model;
      this.interval = null;
      this.intervals = [];
    },
    move: (function (id, pos, rot, duration) { //called directly from connect.js 
      // console.log("pos " + JSON.stringify(pos));
      for (let i = 0; i < this.intervals.length; i++) { //stop previous commands when a new one comes in
        clearInterval(this.intervals[i]);
      }
      this.intervals = [];
      var DEG2RAD = THREE.Math.DEG2RAD;
      var element = document.getElementById(id);
      var iteration = 0;
      var currentQuat = new THREE.Quaternion();
      var currentEuler = new THREE.Euler();
      var targetEuler = new THREE.Euler();
      var targetQuat = new THREE.Quaternion();
      var lerpedQuat = new THREE.Quaternion();
      var targetRot = new THREE.Vector3();
      var currentPos = element.getAttribute('position');
      var currentRot = element.getAttribute('rotation');

      var lastLerpedPos = {};
      // element.setAttribute('rotation', rot); //fuckit!
      // var mesh = element.getObject3D('mesh');
      // console.log("mesh " + JSON.stringify(mesh));
      var lerpToData =[];
      // this.currentPos = currentPos;
      var oPosition = {}
      oPosition.x = currentPos.x;
      oPosition.y = currentPos.y;
      oPosition.z = currentPos.x;
      if (duration == 0) { //Player Snap
        if (rot != null) {
          console.log("tryna snap to " + JSON.stringify(rot));
          element.setAttribute('rotation', rot);
        }

        element.setAttribute('position', pos);

      } else { //Player Lerp
        // console.log("duration is " + duration);
          if (!duration) {
            duration = 1;
          }

          // for (let d = 0; d < durationAll; d++) {
          //   var lerpedPos = {};
          //   // var lerpedRot = {};
          //   // lerpedPos.x = lerp(currentPos.x, pos.x, .1 - (.1 / (durationAll - iteration))).toFixed(2);
          //   // lerpedPos.y = lerp(currentPos.y, pos.y, .1 - (.1 / (durationAll - iteration))).toFixed(2);
          //   // lerpedPos.z = lerp(currentPos.z, pos.z, .1 - (.1 / (durationAll - iteration))).toFixed(2);
          //   //               // var lerpedRot = {};
          //                 lerpedPos.x = lerp(currentPos.x, pos.x, .1).toFixed(2);
          //                 lerpedPos.y = lerp(currentPos.y, pos.y, .1).toFixed(2);
          //                 lerpedPos.z = lerp(currentPos.z, pos.z, .1).toFixed(2);
          // }
          var durationAll = duration * 10;
          this.currentPos = currentPos;
          // lastLerpedPos = currentPos;
          element.setAttribute('wasd-controls-enabled', false);
          this.interval = setInterval(function() {
          iteration++
          if (iteration < (10 * duration)) { 
              // currentPos = element.getAttribute('position');
              // currentRot =  element.getAttribute('position');
              var lerpedPos = {};
              // var lerpedRot = {};
              // lerpedPos.x = lerp(currentPos.x, pos.x, .1 - (.1 / (durationAll - iteration))).toFixed(2);
              // lerpedPos.y = lerp(currentPos.y, pos.y, .1 - (.1 / (durationAll - iteration))).toFixed(2);
              // lerpedPos.z = lerp(currentPos.z, pos.z, .1 - (.1 / (durationAll - iteration))).toFixed(2);
              //               // var lerpedRot = {};
                            // lerpedPos.x = lerp((currentPos.x / iteration) - currentPos.x, pos.x, .1);
                            // lerpedPos.y = lerp((currentPos.y / iteration) - currentPos.y, pos.y, .1);
                            // lerpedPos.z = lerp((currentPos.z / iteration) - currentPos.z, pos.z, .1);
                            lerpedPos.x = lerp(currentPos.x, pos.x, (.01 * iteration)/durationAll);
                          lerpedPos.y = lerp(currentPos.y, pos.y, (.01 * iteration)/durationAll);
                            lerpedPos.z = lerp(currentPos.z, pos.z,  (.01 * iteration)/durationAll);
              element.setAttribute('rotation', rot);
              element.setAttribute('position', lerpedPos);
              //  console.log("tryna lerp to " + lerpedPos.x + " " + lerpedPos.y + " " + lerpedPos.z + " iteration " + (durationAll - iteration));
              // lastLerpedPos = lerpedPos;

          } else {
              clearInterval(this.interval);
          }
          }, 100);
          this.intervals.push(this.interval);
        }
        })
  });
    

  AFRAME.registerComponent('avatar-callout', {
    schema: {
      calloutString: {default: "player"},
      hexColor: {default: "blue"}
      },
      init: function () {
        var sceneEl = document.querySelector('a-scene');
        // console.log("elementID " + this.el.id);
        this.el.setAttribute('avatar-pos-rot');
        // var el = this.el;
        this.el.classList.add("activeObjexRay");
        this.el.setAttribute('gltf-model', '#avatar_model');
        const data = this.data;
        this.textureArray = [];
        this.envmapEl = null;
        this.el.addEventListener('model-loaded', () => {
          const avatarObj = this.el.getObject3D('mesh');
          // console.log("avatar color is " + this.data.hexColor );
          for (let i = 1; i < 7; i++) {
            this.envmapEl = document.getElementById("envMap_" + i);
            if (this.envmapEl) {
            this.path = this.envmapEl.getAttribute("src");
            // console.log("envMap path " + this.path);
            this.textureArray.push(this.path);
            }
          }
          console.log(this.textureArray.length + "is textureArraylength");
          this.material = new THREE.MeshStandardMaterial( { color: this.data.hexColor } ); //color is passed in socket handshake, and appended to username
          this.texture = new THREE.CubeTextureLoader().load(this.textureArray);
          // this.texture.format = THREE[data.format];
          this.material.envMap = this.texture;        
          this.material.envMap.intensity = 1;
          this.material.needsUpdate = true;
          // index = 0;
          avatarObj.traverse(node => {
              if (node.name == "head" || node.name == "body") { //not the eyes!
                node.material = this.material;
              }
          });
        });
        // console.log("calloutstring: " + this.data.calloutString);
        let calloutEntity = document.createElement("a-entity");
        calloutEntity.setAttribute("scale", '.25 .25 .25');
        let calloutText = document.createElement("a-text");
        this.el.setAttribute("position", '0 0 0');
        // this.calloutText = calloutText;
        // calloutText.setAttribute('overlay');
        calloutEntity.setAttribute("look-at", "#player");
        calloutEntity.setAttribute('visible', false);
        
        // calloutEntity.setAttribute("render-order", "hud");
        sceneEl.appendChild(calloutEntity);
        calloutEntity.setAttribute("position", '0 0 0');
        // console.log("avatar-callout set position " + JSON.stringify(this.el.getAttribute("position")));
        calloutEntity.appendChild(calloutText);
        calloutText.setAttribute("position", '0 0 2'); //offset the child on z toward camera, to prevent overlap on model
        calloutText.setAttribute('text', {
          baseline: "bottom",
          align: "center",
          font: "/fonts/Exo2Bold.fnt",
          anchor: "center",
          wrapCount: 30,
          color: "white",
          value: this.data.calloutString
        });



      this.el.addEventListener('mouseenter', function (evt) {
        console.log("mouseenter avatar");
          calloutEntity.setAttribute('visible', true);
          let pos = evt.detail.intersection.point; //hitpoint on model
          calloutEntity.setAttribute("position", pos);
          // calloutText.updateMatrixWorld();
        });
      this.el.addEventListener('mouseleave', function () {
          // console.log("tryna mouseexit");
          calloutEntity.setAttribute('visible', false);
      });
      this.el.addEventListener('mousedown', function () {
        console.log("clicked avatar ID " + this.id);
        AvatarClicked(this.id);
      })
    }
  });
    

  AFRAME.registerComponent("overlay", {
    dependencies: ['material'],
    init: function () {
      this.el.sceneEl.renderer.sortObjects = true;
      this.el.object3D.renderOrder = 100;
      this.el.components.material.material.depthTest = false;
    }
});
AFRAME.registerComponent('mod_scene_inventory', {
  schema: {
    
      jsonInventoryData: {default: ''}
    },
    init: function () {
      let theData = this.el.getAttribute('data-inventory');
      this.data.jsonInventoryData = JSON.parse(atob(theData));

      // console.log("scene inventory: " + JSON.stringify(this.data.jsonInventoryData));
      let objexEl = document.getElementById('sceneObjects');    
      objexEl.components.mod_objex.addSceneInventoryObjects(this.data.jsonInventoryData);
    }
  });

AFRAME.registerComponent('mod_objex', {
  schema: {
      eventData: {default: ''},
      shader: {default: ''},
      color: {default: ''},
      jsonObjectData: {default: ''},
      jsonLocationsData: {default: ''}
    },
    init: function () {
      let theData = this.el.getAttribute('data-objex');
      let theLocData = this.el.getAttribute('data-objex-locations');
      this.sceneInventoryItems = null; //might be loaded after init, called from mod_inventory component, if not part of the scene
      this.fromSceneInventory = null;

      this.data.jsonObjectData = JSON.parse(atob(theData)); //object items with model references
      this.data.jsonLocationsData = JSON.parse(atob(theLocData)); //scene locations with object references
      // console.log("objxe datas" + JSON.stringify(this.data.jsonObjectData));
      // console.log("objxe location datas" + JSON.stringify(this.data.jsonLocationsData));
      console.log(this.data.jsonLocationsData.length + " locations for " + this.data.jsonObjectData.length);
      for (let i = 0; i < this.data.jsonLocationsData.length; i++) {
        for (let k = 0; k < this.data.jsonObjectData.length; k++) {
          if (this.data.jsonLocationsData[i].objectID != undefined && this.data.jsonLocationsData[i].objectID != null && this.data.jsonLocationsData[i].objectID == this.data.jsonObjectData[k]._id) {
            // console.log("location/object match " + this.data.jsonLocationsData[i].objectID);
            
            if (this.data.jsonObjectData[k].modelID != undefined && this.data.jsonObjectData[k].modelID != null) {
             
              console.log("location/object match " + this.data.jsonLocationsData[i].objectID + " modelID " + this.data.jsonObjectData[k].modelID);
              let objEl = document.createElement("a-entity");
              objEl.setAttribute("mod_object", {'locationData': this.data.jsonLocationsData[i], 'objectData': this.data.jsonObjectData[k]});
              objEl.id = "obj" + this.data.jsonLocationsData[i].objectID + "_" + this.data.jsonLocationsData[i].timestamp;
              sceneEl.appendChild(objEl);
              
            }
          }
        }
      }
      let that = this;
    },
    addSceneInventoryObjects: function(objex) { //
      let oIDs = [];
      this.fromSceneInventory = objex._id //top level of inventory object, items are array property
      if (objex.inventoryItems != undefined && objex.inventoryItems.length > 0) {
        this.sceneInventoryItems = objex.inventoryItems;
      }
      console.log(JSON.stringify(objex));
      //wait, need to cache the locations where to place the fetched objs... :|
      for (let i = 0; i < objex.inventoryItems.length; i++) {
        if (this.returnObjectData(objex.inventoryItems[i].objectID) == null) { //if we don't already have this object data, need to fetch it
          if (!oIDs.includes(objex.inventoryItems[i].objectID)) { //prevent duplicates
            oIDs.push(objex.inventoryItems[i].objectID);
            console.log("gotsa oID from scene inventory that needs fetching!");
          }
        }
      }
      console.log("need to fetch to pop scene inventory: " + oIDs);
      SceneInventoryLoad(oIDs); //do fetch in external function, below, bc ajax response can't get to component scope if it's here
    
    },
    loadSceneInventoryObjects: function () { //coming back from upstream call after updating jsonObjectData with missing sceneInventoryItems
      console.log("tryna loadSceneInventoryObjects fromSceneInventory " + this.fromSceneInventory);
      for (let i = 0; i < this.sceneInventoryItems.length; i++) { 
        for (let j = 0; j < this.data.jsonObjectData.length; j++) {
          console.log("inventory : "+ this.sceneInventoryItems[i].objectID+ " vs objex._id " + this.data.jsonObjectData[j]._id);
          if (this.sceneInventoryItems[i].objectID == this.data.jsonObjectData[j]._id) {
            console.log("gotsa match for scene inventory at location " + JSON.stringify(this.sceneInventoryItems[i].location)); //here location data is a vector3
            let timestamp = this.sceneInventoryItems[i].timestamp;
            if (this.sceneInventoryItems[i].location != undefined) {
            let locationData  = {};
            locationData.x = this.sceneInventoryItems[i].location.x;
            locationData.y = this.sceneInventoryItems[i].location.y;
            locationData.z = this.sceneInventoryItems[i].location.z; //how mod_object wants the data
            let objEl = document.createElement("a-entity");
            objEl.setAttribute("mod_object", {'locationData': locationData, 'objectData': this.data.jsonObjectData[j], 'inventoryData': this.sceneInventoryItems[i], 'fromSceneInventory': this.fromSceneInventory, 'timestamp': timestamp});
            objEl.id = "obj" + this.data.jsonObjectData[j]._id + "_" + timestamp;
            sceneEl.appendChild(objEl);
            } else {
              console.log("well shoot, that one don't have a location " + JSON.stringify(this.sceneInventoryItems[i]));
            }
          }
        }
      }
    },
    returnObjectData: function(objectID) {
      console.log('tryna return object data for ' +objectID);
      // let hasObj = false;
      let objek = null;
      if (this.data.jsonObjectData.length > 0) {
        for (let i = 0; i < this.data.jsonObjectData.length; i++) {
          console.log('tryna match object data for ' +objectID + " vs " + this.data.jsonObjectData[i]._id);
          if (this.data.jsonObjectData[i]._id == objectID) {
            console.log('gotsa objectID match to return data');
            // hasObj = true;
            objek = this.data.jsonObjectData[i];
          }
        }
      }
      return objek;
    },
    addFetchedObject (obj) {
      console.log("tryna add fetched obj " + obj._id)
      this.data.jsonObjectData.push(obj); 
    },
    // addSceneInventoryObject (obj) {
    //   console.log("tryna add fetched obj " + obj._id)
    //   this.data.jsonObjectData.push(obj); 
    // },
    dropInventoryObject: function (inventoryID, action, inventoryObj) {
      let data = {};
      data.inScene = room;
      data.inventoryID = inventoryID;
      data.userData = userData;
      // data.object_item = this.data.objectData;
      // data.userData = userData;
      data.action = action;
      let loc = new THREE.Vector3();
      this.viewportHolder = document.getElementById('viewportPlaceholder');
      this.viewportHolder.object3D.getWorldPosition( loc );
      inventoryObj.location = {"x": parseFloat(loc.x.toFixed(3)), "y": parseFloat(loc.y.toFixed(3)), "z": parseFloat(loc.z.toFixed(3))}; //truncate long floating point values, close enough
      data.inventoryObj = inventoryObj;
      // data.location = this.el.getAttribute("position");
      
      // if (data.inventoryObj.actions != undefined && data.inventoryObj.actions.length > 0) {
      //   for (let i = 0; i < data.inventoryObj.actions.length; i++) {
      //     if (data.inventoryObj.actions[i].actionType.toLowerCase().includes("drop")) {
      //       data.action = data.inventoryObj.actions[i];
      //     }
      //   }
      // }
      if (action.actionType.toLowerCase() == "drop") {
       Drop(data);
      }
    },
    equipObject: function (objectID) {
      console.log("tryna set model to " + objectID);  
      this.objectData = this.returnObjectData(objectID);
      this.dropPos = new THREE.Vector3();
      this.objEl = document.createElement("a-entity");
      this.equipHolder = document.getElementById("viewportPlaceholder");
      this.equipHolder.object3D.getWorldPosition( this.dropPos );
      this.locData = {};
      this.locData.x = this.dropPos.x;
      this.locData.y = this.dropPos.y;
      this.locData.z = this.dropPos.z;
      this.locData.timestamp = Date.now();
      this.objEl.setAttribute("mod_object", {'locationData': this.locData, 'objectData': this.objectData});
      this.objEl.id = "obj" + this.objectData._id + "_" + this.locData.timestamp;

      sceneEl.appendChild(this.equipHolder);
      // this.el.setAttribute('gltf-model', '#' + modelID.toString());
    },
    dropObject: function (objectID) {
      console.log("tryna set model to " + objectID);  
      this.objectData = this.returnObjectData(objectID);
      this.dropPos = new THREE.Vector3();
      this.objEl = document.createElement("a-entity");
      this.equipHolder = document.getElementById("equipPlaceholder");
      this.equipHolder.object3D.getWorldPosition( this.dropPos );
      this.locData = {};
      this.locData.x = this.dropPos.x;
      this.locData.y = this.dropPos.y;
      this.locData.z = this.dropPos.z;
      this.locData.timestamp = Date.now();
      this.objEl.setAttribute("mod_object", {'locationData': this.locData, 'objectData': this.objectData, 'applyForceToNewObject': true});
      this.objEl.id = "obj" + this.objectData._id + "_" + this.locData.timestamp;
      sceneEl.appendChild(this.objEl);
      // this.objEl.components.mod_object.applyForce();

      // this.el.setAttribute('gltf-model', '#' + modelID.toString());
    },
    throwObject: function (objectID) {
      console.log("tryna set model to " + objectID);  
      this.objectData = this.returnObjectData(objectID);
      this.dropPos = new THREE.Vector3();
      this.objEl = document.createElement("a-entity");
      this.equipHolder = document.getElementById("equipPlaceholder");
      this.equipHolder.object3D.getWorldPosition( this.dropPos );
      this.locData = {};
      this.locData.x = this.dropPos.x;
      this.locData.y = this.dropPos.y;
      this.locData.z = this.dropPos.z;
      this.locData.timestamp = Date.now();
      this.objEl.setAttribute("mod_object", {'locationData': this.locData, 'objectData': this.objectData});
      this.objEl.id = "obj" + this.objectData._id + "_" + this.locData.timestamp;
      sceneEl.appendChild(this.objEl);
      // this.el.setAttribute('gltf-model', '#' + modelID.toString());
    }
});

function SceneInventoryLoad(oIDs) { //fetch scene inventory objects, i.e. stuff dropped by users
  if (oIDs.length > 0) {
    let objexEl = document.getElementById('sceneObjects');    
    // objexEl.components.mod_objex.dropObject(data.inventoryObj.objectID);
    let data = {};
    data.oIDs = oIDs;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/scene_inventory_objex/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
    xhr.onload = function () {
      // do something to response
      console.log("fetched obj resp: " +this.responseText);
      let response = JSON.parse(this.responseText);
      console.log("gotsome objex: " + response.objex.length);
      if (response.objex.length > 0) {

        for (let i = 0; i < response.objex.length; i++) {
          objexEl.components.mod_objex.addFetchedObject(response.objex[i]); //add to scene object collection, so don't have to fetch again
          //use locs and instantiate!
          // console.log(i + " vs " + response.objex.length - 1);
          if (i == response.objex.length - 1) {
            objexEl.components.mod_objex.loadSceneInventoryObjects(response.objex); //ok load em up
          }
        }
      }
    }
  }
}
AFRAME.registerComponent('mod_object', { //instantiated from mod_objex component above
  schema: {
    locationData: {default: ''},
    objectData: {default: ''},
    fromSceneInventory: {default: null},
    timestamp: {default: null},
    applyForceToNewObject: {default: false}
  },
  init: function () {
    // console.log("mod_object data " + JSON.stringify(this.data.objectData.modelURL));
    this.moEl = this.el;
    this.isActivated = false; //to prevent dupes..
    this.calloutEntity = null;
    this.calloutPanel = null;
    this.calloutText = null;
    this.selectedAxis = null;
    this.isSelected = false;
    this.hitPosition = null;
    this.mouseDownPos = new THREE.Vector2();
    this.mousePos = new THREE.Vector2();
    this.distance = 0;
    this.calloutLabelSplit = [];
    this.calloutLabelIndex = 0;
    this.promptSplit = [];
    this.promptIndex = 0;
    this.dialogEl = document.getElementById('mod_dialog');
    this.pickupAction = null;
    this.dropAction = null;
    this.equipAction = null;
    this.synth = null;
    this.hasSynth = false;
    this.mod_physics = "";
    // this.sceneInventoryID = null;
  
    if (this.data.objectData.modelURL != undefined) {
      this.el.setAttribute("gltf-model", this.data.objectData.modelURL); //set as an a-asset in server response
    } else {
      this.el.setAttribute("gltf-model", "#" +this.data.objectData.modelID); //set as an a-asset in server response
    }
   

    this.hasPickupAction = false;

    if (this.data.objectData.callouttext != undefined && this.data.objectData.callouttext != null && this.data.objectData.callouttext.length > 0) {
      if (this.data.objectData.callouttext.includes('~')) {
        this.calloutLabelSplit = this.data.objectData.callouttext.split('~'); 
      }
      
      this.calloutEntity = document.createElement("a-entity");
      this.calloutPanel = document.createElement("a-entity");
      this.calloutText = document.createElement("a-text");
      this.calloutEntity.id = "objCalloutEntity_" + this.data.objectData._id;
      this.calloutPanel.id = "objCalloutPanel_" + this.data.objectData._id;
      this.calloutText.id = "objCalloutText_" + this.data.objectData._id;
      this.calloutPanel.setAttribute("gltf-model", "#landscape_panel");
      this.calloutPanel.setAttribute("scale", ".1 .075 .1");
      this.calloutEntity.setAttribute("look-at", "#player");
      this.calloutEntity.setAttribute('visible', false);
    
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
      
    }
    if (this.data.objectData.synthNotes != undefined && this.data.objectData.synthNotes != null && this.data.objectData.synthNotes.length > 0) {
      this.el.setAttribute("mod_synth", "init");
      this.hasSynth = true;

    }
   
    if (this.data.objectData.actions != undefined && this.data.objectData.actions.length > 0) {
      for (let a = 0; a < this.data.objectData.actions.length; a++) {
          // console.log("action: " + JSON.stringify(this.data.objectData.actions[a].actionType));

        if (this.data.objectData.actions[a].actionType.toLowerCase() == "pickup") {
          this.hasPickupAction = true;
          this.pickupAction = this.data.objectData.actions[a];
          // console.log("pickup action: " + JSON.stringify(this.pickupAction));
        }
        if (this.data.objectData.actions[a].actionType.toLowerCase() == "drop") {
          this.hasDropAction = true;
          this.dropAction = this.data.objectData.actions[a];
        }
        if (this.data.objectData.actions[a].actionType.toLowerCase() == "equip") {
          this.hasEquipAction = true;
        }
        if (this.data.objectData.actions[a].actionType.toLowerCase() == "return") {
          this.hasDropAction = true;
        }
        if (this.data.objectData.actions[a].actionType.toLowerCase() == "use") {
          this.hasDropAction = true;
        }
      }
    }

    let that = this;
    this.el.classList.add("activeObjexRay");
    this.el.addEventListener('model-loaded', () => {
      // console.log("OBJMODEL LOAADIDE!!!" + that.data.locationData.markerObjScale);
      let pos = {};
      pos.x = that.data.locationData.x;
      pos.y = that.data.locationData.y;          
      pos.z = that.data.locationData.z;
      let rot = {};
      rot.x = that.data.locationData.eulerx != undefined ? that.data.locationData.eulerx : 0;
      rot.y = that.data.locationData.eulery != undefined ? that.data.locationData.eulery : 0;
      rot.z = that.data.locationData.eulerz != undefined ? that.data.locationData.eulerz : 0;
      let scale = {x: 1, y: 1, z: 1};
      if (that.data.locationData.markerObjScale != undefined) {
      scale.x = that.data.locationData.markerObjScale != undefined ? that.data.locationData.markerObjScale : 1;
      scale.y = that.data.locationData.markerObjScale != undefined ? that.data.locationData.markerObjScale : 1;
      scale.z = that.data.locationData.markerObjScale != undefined ? that.data.locationData.markerObjScale : 1;
      }
      console.log("setting object position to " + JSON.stringify(pos));
      that.el.setAttribute("position", pos);
      that.el.setAttribute("rotation", rot);
      that.el.setAttribute("scale", scale);

     
      if (that.data.objectData.physics != undefined && that.data.objectData.physics != null && that.data.objectData.physics.toLowerCase() != "none") {
        //  setTimeout(function(){  
          that.el.setAttribute('ammo-body', {type: that.data.objectData.physics.toLowerCase()});
        // if (that.data.objectData.physics.toLowerCase() == "static") {
        //  that.el.setAttribute('mod_physics', {body: 'static', shape: 'mesh'});
        // } else if (that.data.objectData.physics.toLowerCase() == "dynamic") {
        //   // that.el.setAttribute('mod_physics', {body: 'dynamic', shape: 'box'});
        //   // console.log("TRYNA SET DYMANIX!");
        //     that.el.setAttribute('ammo-body', {type: 'dynamic'});
        //     // that.el.setAttribute('ammo-shape', 'box');
        //     }
          // }, 3000);
        }
    });

    this.el.addEventListener('body-loaded', () => {  //body-loaded event = physics ready on obj
      that.el.setAttribute('ammo-shape', {type: that.data.objectData.collidertype.toLowerCase()});
      // console.log("ammo shape is " + JSON.stringify(that.el.getAttribute('ammo-shape')));
      if (that.data.applyForceToNewObject) {
        that.applyForce();
      }
    });


    this.el.addEventListener('raycaster-intersected', e =>{  
        this.raycaster = e.detail.el;
        that.raycaster = this.raycaster;
        this.intersection = this.raycaster.components.raycaster.getIntersection(this.el, true);
        this.hitpoint = this.intersection.point;
        that.hitpoint = this.hitpoint;
        console.log(that.data.objectData.name);
       
    });
    this.el.addEventListener("raycaster-intersected-cleared", () => {
        // console.log("intersection cleared");
        that.mouseOverObject = null;
        this.raycaster = null;
        this.hitpoint = null;
        that.hitpoint = null;
        this.playerPosRot = null; 
        that.playerPosRot = null;

    });

    this.el.addEventListener('mouseenter', function (evt) {
      if (posRotReader != null) {
        this.playerPosRot = posRotReader.returnPosRot(); 
        window.playerPosition = this.playerPosRot.pos; 
      } else {
        posRotReader = document.getElementById("player").components.get_pos_rot; 
        this.playerPosRot = posRotReader.returnPosRot(); 
        window.playerPosition = this.playerPosRot.pos; 
      }
      // console.log(window.playerPosition);
      if (!that.isSelected) {
        // document.getElementById("player").component.get_pos_rot.returnPosRot();
        this.clientX = evt.clientX;
        this.clientY = evt.clientY;
        // console.log("tryna mouseover placeholder");
        // that.calloutToggle = !that.calloutToggle;

        this.pos = evt.detail.intersection.point; //hitpoint on model
        let name = evt.detail.intersection.object.name;
        that.hitPosition = this.pos;
        if (player != null)
        that.distance = window.playerPosition.distanceTo(that.hitpoint);
        // console.log("distance  " + that.distance);
        that.rayhit(evt.detail.intersection.object.name, that.distance, evt.detail.intersection.point);

          that.selectedAxis = name;

          let elPos = that.el.getAttribute('position');
        if (that.calloutEntity != null && that.distance < 20) {
          that.calloutEntity.setAttribute('visible', false);
          console.log("trna scale to distance :" + that.distance);
          that.calloutEntity.setAttribute("position", this.pos);
          that.calloutEntity.setAttribute('visible', true);
          that.calloutEntity.setAttribute('scale', {x: that.distance * .20, y: that.distance * .20, z: that.distance * .20} );
          let theLabel = that.data.objectData.labeltext;
          let calloutString = theLabel;
          if (that.calloutLabelSplit.length > 0) {
            if (that.calloutLabelIndex < that.calloutLabelSplit.length - 1) {
              that.calloutLabelIndex++;
            } else {
              that.calloutLabelIndex = 0;
            }
            calloutString = that.calloutLabelSplit[that.calloutLabelIndex];
          }
          // if (that.calloutToggle) { //show pos every other time
          //   // calloutString = "x : " + elPos.x.toFixed(2) + "\n" +"y : " + elPos.y.toFixed(2) + "\n" +"z : " + elPos.z.toFixed(2);
          //   calloutString = that.data.description != '' ? that.data.description : theLabel;
          // }
          that.calloutText.setAttribute("value", calloutString);
        }
      }
      // that.applyForce();  //
    });
    this.el.addEventListener('mouseleave', function (evt) {
      // console.log("tryna mouseexit");
      if (that.calloutEntity != null) {
        that.calloutEntity.setAttribute('visible', false);
      }
      
    });

    this.el.addEventListener('mousedown', function (e) {
      console.log("mousedown on object type: " + that.data.objectData.objtype + " action " + that.pickupAction);
      this.dialogEl = document.getElementById('mod_dialog');
      
      if (that.data.objectData.objtype.toLowerCase() == "pickup" || that.hasPickupAction) {
        // that.el.setAttribute('visible', false);
        if (that.data.objectData.prompttext != undefined && that.data.objectData.prompttext != null && that.data.objectData.prompttext != "") {
          if (that.data.objectData.prompttext.includes('~')) {
            that.promptSplit = that.data.objectData.prompttext.split('~'); 
          }
          // this.el.components.mod_synth.medTrigger();
          that.dialogEl.components.mod_dialog.showPanel(that.promptSplit[Math.floor(Math.random()*that.promptSplit.length)], that.el.id );
        }
        
      }
    })
  },

  rayhit: function (hitID, distance, hitpoint) {
    // if (this.hitID != hitID) {
    //   this.hitID = hitID;
      // console.log("new hit " + hitID + " " + distance + " " + JSON.stringify(hitpoint));
      // distance = window.playerPosition.distanceTo(hitpoint);
      console.log("new hit " + hitID + " distance: " + distance + " " + JSON.stringify(hitpoint));
      // var triggerAudioController = document.getElementById("triggerAudio");
      // if (triggerAudioController != null) {
      //   triggerAudioController.components.trigger_audio_control.playAudioAtPosition(hitpoint, distance);
      // }
      // let synthCtrl = this.el.components.mod_synth;
      // if (synthCtrl != null) {
        if (this.hasSynth) {
          if (this.el.components.mod_synth != null) {
            this.el.components.mod_synth.trigger(distance);
          }
        }
      // } else {
      //   console.log("no synth");
      // }
  },

  activated: function () {
   
    console.log("hasPickupAction " + this.hasPickupAction + " for " + this.el.id);
    if (!this.isActivated) { 
      if (this.hasSynth) {
        if (this.el.components.mod_synth != null) {
          this.el.components.mod_synth.highTrigger();
        } else {
          console.log("object has synth but it's not enabled in scene config (add use synth tag)");
        }
      }
      this.isActivated = true;
      if (this.data.objectData.objtype.toLowerCase() == "pickup"  || this.hasPickupAction) {
      
        let data = {};
        data.fromSceneInventory = this.data.fromSceneInventory;
        data.timestamp = this.data.timestamp;
        data.fromScene = room;
        data.object_item = this.data.objectData;
        data.userData = userData;
        data.action = this.pickupAction;
        console.log("pickupaction " + JSON.stringify(data.action));

        Pickup(data, this.el.id);

      }
    } else {
      this.dialogEl.components.mod_dialog.repeatResponse();
    }
  },
  showObject: function () {
    this.el.setAttribute('visible', true);
    this.el.classList.add('activeObjexRay');
  },
  hideObject: function () {
    console.log("tryna hide OBject");
    this.moEl.setAttribute('visible', false);
    this.moEl.classList.remove('activeObjexRay');
    if (this.el.body != null) {
    //   Ammo.destroy(this.el.body);
      this.el.removeAttribute('ammo-shape');
    }
  },
  replaceModel: function (modelID) {
    console.log("tryna set model to " + modelID);
    this.el.removeAttribute('gltf-model');
    this.el.setAttribute('gltf-model', '#' + modelID.toString());
  },
  replaceObject: function (objectID) {
    console.log("tryna set model to " + objectID);
    let objexEl = document.getElementById('sceneObjects');    
    let objectData = objexEl.components.mod_objex.returnObjectData(objectID);
    this.el.removeAttribute('gltf-model');
    let objEl = document.createElement("a-entity");
    objEl.setAttribute("mod_object", {'locationData': this.data.locationData, 'objectData': objectData});
    objEl.id = "obj" + objectData._id + "_" + this.data.locationData.timestamp;
    sceneEl.appendChild(objEl);
    // this.el.setAttribute('gltf-model', '#' + modelID.toString());
  },
  randomLocation: function () {
    this.pos = this.moEl.getAttribute("position");
    this.newpos = {};
    this.newpos.y = this.pos.y;
    this.newpos.x = this.pos.x + getRandomIntInclusive(-10, 10);
    this.newpos.z = this.pos.z + getRandomIntInclusive(-10, 10);
    this.moEl.setAttribute('position', this.newpos);
    this.isActivated = false;
    // pos = null;
    // newpos = null;
  },
  applyForce: function () {
    
    // let obj = this.el
    const force = new Ammo.btVector3(0, -3, 0);
    let position = this.el.getAttribute('position');
    console.log("tryna apply force at position " + JSON.stringify(position));
    // const pos = new Ammo.btVector3(this.el.object3D.position.x, this.el.object3D.position.y, this.el.object3D.position.z);
    const pos = new Ammo.btVector3(position.x, position.y, position.z);
    this.el.body.applyForce(force, pos);
    Ammo.destroy(force);
    Ammo.destroy(pos);
  }
 
});

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function Drop (data) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", '/drop/', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
  xhr.onload = function () {
    // do something to response
    console.log(this.responseText);
    if (this.responseText.toLowerCase().includes('updated')) {
      let objexEl = document.getElementById('sceneObjects');    
      objexEl.components.mod_objex.dropObject(data.inventoryObj.objectID);
      
    } else if (this.responseText.toLowerCase().includes('no drop')) {
      this.dialogEl = document.getElementById('mod_dialog');
      if (this.dialogEl != null) {
        this.dialogEl.components.mod_dialog.confirmResponse("You can't drop that here.");
      }
    }  

       
  };
}
function Pickup (data, id) {
  console.log("tryna act on " + id);
  let objEl = document.getElementById(id);
  if (objEl != null) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/pickup/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
    xhr.onload = function () {
      // do something to response
      console.log(this.responseText);
      this.dialogEl = document.getElementById('mod_dialog');
      if (this.dialogEl != null) {
        
        if (this.responseText.toLowerCase().includes("saved")) { //put in inventory
          if (data.action.sourceObjectMod.toLowerCase() == "remove") {
            objEl.components.mod_object.hideObject();
          }
          this.dialogEl.components.mod_dialog.confirmResponse("Saved to inventory!");
          console.log('pickedup!');
        } else if (this.responseText.toLowerCase().includes("consume")) { //
          
          console.log("tryuna consumobjEl");
          if (data.action.sourceObjectMod.toLowerCase() == "remove") {
            objEl.components.mod_object.hideObject();
          }
          if (data.action.sourceObjectMod.toLowerCase() == "replace model") {
            objEl.components.mod_object.replaceModel(data.action.modelID);
          }
          if (data.action.sourceObjectMod.toLowerCase() == "replace object") {
            objEl.components.mod_object.replaceObject(data.action.objectID);
          }
          // if (data.action.sourceObjectMod.toLowerCase() == "equip") {
          //   objEl.components.mod_object.equipObject(data.action.objectID);
          // }

          if (data.action.sourceObjectMod.toLowerCase() == "random location") {
            objEl.components.mod_object.randomLocation();
          }
          this.dialogEl.components.mod_dialog.confirmResponse("Refreshing!");
          console.log("consumed");
        } else if (this.responseText.toLowerCase().includes("equip")) {
          console.log("tryna equi9p dout");
        } else {
          console.log("maxed");
          this.dialogEl.components.mod_dialog.confirmResponse("You can't have any more of those");
        }
      }
    };
  }
}

AFRAME.registerComponent('mod_dialog', { //only one of these
  schema: {
    mode: {default: 'confirm'},
    shader: {default: ''},
    color: {default: ''} 
  },
  init: function () {
  
  this.viewportHolder = document.getElementById('viewportPlaceholder');
  // this.el.setAttribute("gltf-model", "#dialog_panel");
  this.dialogText = document.getElementById("mod_dialog_text");
  this.dialogPanel = document.getElementById("mod_dialog_panel");
  // this.el.classList.add("activeObjexRay");
  this.cameraPosition = new THREE.Vector3(); 
  
  this.yesbutton = null;
  this.nobutton = null;
  this.yesButtonMesh = null;
  this.noButtonMesh = null;
  this.okButtonMesh = null;
  this.objID = null;
  this.meshObj = null;
  this.panelString = "";
  this.el.addEventListener('model-loaded', () => {  

    this.viewportHolder.object3D.getWorldPosition( this.cameraPosition );
    this.el.setAttribute('position', this.cameraPosition);
    // console.log("TRYNA SET POSITIONF RO MOD_DIALGO " + JSON.stringify(this.cameraPosition));
    
    // this.meshObj = this.dialogPanel.getObject3D('mesh');
    this.meshObj = this.dialogPanel.getObject3D('mesh');
    this.meshObj.traverse(node => {
      if (node.name.toLowerCase().includes('ok')) {
        node.visible = false;
      }
    });
    this.el.addEventListener('mousedown', (evt) => {
      let name = evt.detail.intersection.object.name;
      // console.log(name);
      if (name.includes('yesbutton')) {
        this.yesButton();
      }
      if (name.includes('nobutton')) {
        this.noButton();
      }
      if (name.includes('okbutton')) {
        this.okButton();
      }
    });
  });
  
  // this.dial
  let that = this;
  },
  showPanel: function (panelString, objectID) {

    this.objID = objectID;
    this.el.setAttribute("visible", true);
    this.dialogPanel.classList.add('activeObjexRay');
    if (this.meshObj != null) {
      this.meshObj.traverse(node => {
        if (node.name.toLowerCase().includes('okbutton')) {
          node.visible = false;
        }
        if (node.name.toLowerCase().includes('yesbutton')) {
          node.visible = true;
        }
        if (node.name.toLowerCase().includes('nobutton')) {
          node.visible = true;
        }
      });
    }
    this.viewportHolder.object3D.getWorldPosition( this.cameraPosition );
    this.el.setAttribute('position', this.cameraPosition);
    console.log("TRYNA SET POSITIONF RO MOD_DIALGO " + JSON.stringify(this.cameraPosition));
    this.dialogText.setAttribute('value', panelString);
  },
  okButton: function () {
    this.el.setAttribute("visible", false);
    this.dialogPanel.classList.remove('activeObjexRay');
  },
  yesButton: function () {
    console.log("yesbutton for " + this.objID);
    // this.el.setAttribute("visible", false);
    let objEl = document.getElementById(this.objID);
    if (objEl != null) {
      objEl.components.mod_object.activated();
      // objEl.components.mod_object.hideObject();
    }

  },
  noButton: function () {
    console.log("nobutton!");
    this.el.setAttribute("visible", false);
    this.dialogPanel.classList.remove('activeObjexRay');
    
  },
  confirmResponse: function (response) {  
    console.log("tryna confirmResponse " + response);
    this.panelString = response;
    this.dialogText.setAttribute('value', this.panelString);  
    if (this.meshObj != null) {
      this.meshObj.traverse(node => {
        if (node.name.toLowerCase().includes('okbutton')) {
          node.visible = true;
        }
        if (node.name.toLowerCase().includes('yesbutton')) {
          node.visible = false;
        }
        if (node.name.toLowerCase().includes('nobutton')) {
          node.visible = false;
        }
      });
    }
    WaitAndHideDialogPanel(3000);
      // setTimeout(function () {
      //   this.el.components.mod_dialog.hidePanel();
      // }, 3000);
  }, 
  repeatResponse: function () {
    this.dialogText.setAttribute('value', this.panelString);  
    if (this.meshObj != null) {
      this.meshObj.traverse(node => {
        if (node.name.toLowerCase().includes('okbutton')) {
          node.visible = true;
        }
        if (node.name.toLowerCase().includes('yesbutton')) {
          node.visible = false;
        }
        if (node.name.toLowerCase().includes('nobutton')) {
          node.visible = false;
        }
      });
    }
    WaitAndHideDialogPanel(3000);
  }
});
function WaitAndHideDialogPanel (time) {
  let dialog = document.getElementById("mod_dialog");
  let panel = document.getElementById("mod_dialog_panel");
  setTimeout(() =>{ dialog.setAttribute("visible", false);
  panel.classList.remove('activeObjexRay');
  }, time);

}

AFRAME.registerComponent('mod_model', {
  schema: {
      eventData: {default: ''},
      shader: {default: ''},
      color: {default: ''}
      
    },
    init: function () {
      let eventData = [];
      let moIndex = -1;
      let idleIndex = -1;
      let danceIndex = -1;
      let walkIndex = -1;
      let runIndex = -1;
      let clips = null;
      let danceClips = [];
      let idleClips = [];
      let walkClips = [];
      let mouthClips = [];
      
      let mixer = null;
      let camera = null;
      let picGroupArray = ""; //maybe pic gallery should be an different component, or part of pic group control?
      let pictexture = null;
      let picmaterial = null;
      let spics = [];
      let spicsIndex = 0;
      let hpics = [];
      let hpicsIndex = 0;
      let vpics = [];
      let vpicsIndex = 0;
      let svids = [];
      let svidsIndex = 0;
      let hvids = [];
      let hvidsIndex = 0;

      let vvids = [];
      let audios = [];
      let vvidsIndex = 0;
      this.sceneEl = document.querySelector('a-scene');
      let oScale = 1;
      this.shaderMaterial = null;
      this.hasUniforms = false;
      this.start = Date.now();
      console.log("oScale of model::: " + oScale);
      this.tick = AFRAME.utils.throttleTick(this.tick, 50, this);
      
      if (this.data.shader != '') {
        // setShader(this.data.shader);
        this.setShader(); //at the bottom
      }      

      if (this.data.eventData.length > 1) {
        console.log("model eventData " + JSON.stringify(this.data.eventData));
        eventData = this.data.eventData.split("~");//tilde delimiter splits string to array

      }
      if (JSON.stringify(this.data.eventData).includes("beat")) {
        console.log ("adding class beatmee");
        this.el.classList.add("beatme");
        // this.el.addEventListener('beatme', e => console.log("beat" + e.detail.volume()));
        
      }

      this.el.addEventListener('beatme', e => console.log("beat"));
      this.isInitialized = false; //to prevent model-loaded from retriggering when childrens are added to this parent

      this.el.addEventListener('model-loaded', () => {
      if (!this.isInitialized) {
        // this.oScale = oScale;
        this.bubble = null;
        this.bubbleText = null;
        this.isInitialized = true;
        this.meshChildren = [];
        let theEl = this.el;
        const obj = this.el.getObject3D('mesh');
        
        if (obj) {
          if (this.data.shader != "") {
            console.log("gotsa shader " + this.data.shader);
            // this.el.setAttribute('material', 'shader: noise');
            // setShader(this.da)
            this.recursivelySetChildrenShader(obj);
            // if (this.data.shader == "noise") {
            //   this.material = new THREE.ShaderMaterial( {
            //     uniforms: {
            //       tExplosion: {
            //         type: "t",
            //         value: THREE.ImageUtils.loadTexture( 'https://realitymangler.com/assets/textures/watertile3.png' )
            //       },
            //       time: {
            //         type: "f",
            //         value: 0.0
            //       }
            //     },
              
            //     vertexShader: document.getElementById( 'noise1_vertex' ).textContent,
                
            //     fragmentShader: document.getElementById( 'noise1_fragment' ).textContent
              
            //   } );
            //   // console.log(document.getElementById( 'noise1_vertex' ).textContent);
            //   this.hasUniforms = true;
            //   obj.material = this.material;
            //   if (mesh.children) {
            //     for (var i = 0; i < mesh.children.length; i++) {
            //       mesh.children[i].material = this.material;
            //     }
            //   }
            // }
          }
        let dynSkybox = document.getElementById('')
          for (let e = 0; e < eventData.length; e++) {
            if (eventData[e].toLowerCase().includes("refract")){
              console.log("tryna set refraction");
              obj.material.refractionRatio = .9;
              obj.material.reflectivity = .5;
            }

          }
          if (this.data.eventData.toLowerCase().includes("transparent")) {
            console.log("tryna set transparent");
            // this.el.setAttribute('material', {transparent: true, opacity: 0});
            // this.tmat = new THREE.MeshStandardMaterial({
            //   color: 'white',
            //   transparent: true,
            //   alphaTest: 0,
            //   opacity: 0
            // });
            // obj.material = this.tmat;
            obj.visible = false;
            // obj.material.transparent = true;
            // obj.material.opacity = 0;
          }

          let worldPos = null;
          let hasAnims = false;
          let hasPicPositions = false;
          let hasVidPositions = false;
          let hasAudioPositions = false;
          camera = AFRAME.scenes[0].camera; //better for THREE operations than querySelector, they say...
          mixer = new THREE.AnimationMixer( obj );
          clips = obj.animations;

          if (clips != null) { 
            for (i = 0; i < clips.length; i++) { //get reference to all anims
              hasAnims = true;
              console.log("model has animation: " + clips[i].name);
              
              if (clips[i].name.includes("mouthopen")) {
                moIndex = i;
                mouthClips.push(clips[i]);
              }
              // if (clips[i].name.includes("mouthopen")) {
              //   moIndex = i;
              // }
              if (clips[i].name.toLowerCase().includes("mixamo.com_armature_0")) {
                console.log("gotsa mixamo idle anim");
                idleIndex = i;
                idleClips.push(clips[i]);
              }
              if (clips[i].name.toLowerCase().includes("take 001")) {
                idleIndex = i;
                idleClips.push(clips[i]);
              }
              if (clips[i].name.toLowerCase().includes("idle")) {
                idleIndex = i;
                idleClips.push(clips[i]);
              }
              if (clips[i].name.toLowerCase().includes("walk")) {
                walkIndex = i;
                walkClips.push(clips[i]);
              }
              if (clips[i].name.toLowerCase().includes("dance")) { //etc..
                danceIndex = i;
                danceClips.push(clips[i]);
              }
              if (i == clips.length - 1) {
                  if (hasAnims) {
                    console.log("model has anims " + this.data.eventData + " idelIndex " + idleIndex);
                  if (this.data.eventData.includes("loop_all_anims")) {
                    theEl.setAttribute('animation-mixer', {
                      "loop": "repeat",
                    });
                  }
                  if (this.data.eventData.includes("loop_dance_anims")) {
                    theEl.setAttribute('animation-mixer', {
                      "loop": "repeat",
                    });
                  }
                  if (idleIndex != -1) {
                    theEl.setAttribute('animation-mixer', {
                      "clip": clips[idleIndex].name,
                      "loop": "repeat",
                    });
                  }
                }
              }
            }

          }
          obj.traverse(node => { //spin through object heirarchy to sniff for special names, e.g. "eye"
            this.nodeName = node.name;
            if (this.nodeName.includes("navmesh")) { //must be set in the data and as a name on the model
              if (node instanceof THREE.Mesh) {
              this.meshChildren.push(node);
              console.log("gotsa navmesh!");
              }
            }
            if (this.data.eventData.includes("eyelook") && this.nodeName.includes("eye")) { //must be set in the data and as a name on the model
              if (node instanceof THREE.Mesh) {
              this.meshChildren.push(node);
              console.log("gotsa eye!");
              }
            }
            if (this.nodeName.toLowerCase().includes("callout")) { //must be set in the data and as a name on the model
              if (node instanceof THREE.Mesh) {
              this.meshChildren.push(node);

              console.log("gotsa callout!");
              
              }
            }
            if (this.nodeName.toLowerCase().includes("hpic") || this.nodeName.toLowerCase().includes("vpic") || this.nodeName.toLowerCase().includes("spic")) { //must be set in the data and as a name on the model
              if (node instanceof THREE.Mesh) {
                this.meshChildren.push(node);
                  hasPicPositions = true;
                // console.log("gotsa picpanel!");
                // console.log(this.nodeName);
              }
            }
            if (this.nodeName.toLowerCase().includes("hvid") || this.nodeName.toLowerCase().includes("vvid") || this.nodeName.toLowerCase().includes("svid")) { //must be set in the data and as a name on the model
              // if (node instanceof THREE.Mesh) {
                this.meshChildren.push(node);
                  hasVidPositions = true;
                // console.log("gotsa picpanel!");
                // console.log(this.nodeName);
              // }
            }
            if (this.nodeName.toLowerCase().includes("haudio") || this.nodeName.toLowerCase().includes("vaudio")) { //must be set in the data and as a name on the model
              // if (node instanceof THREE.Mesh) {
                this.meshChildren.push(node);
                  hasAudioPositions = true;
                // console.log("gotsa picpanel!");
                // console.log(this.nodeName);
              // }
            }
          });
          if (hasPicPositions) {
            let picGroupMangler = document.getElementById("pictureGroupsData");
            if (picGroupMangler != null && picGroupMangler != undefined) {
              // picGroupMangler.components.picture_groups_control.attach(this.meshChildren);
              picGroupArray = picGroupMangler.components.picture_groups_control.returnPictureData(); //it's an array of arrays
              // console.log("pic group zero length is " + picGroupArray[0].images.length);
              if (picGroupArray != null && picGroupArray.length > 0) {
                for (let x = 0; x < picGroupArray[0].images.length; x++) { 
                  if (picGroupArray[0].images[x].orientation != undefined && picGroupArray[0].images[x].orientation != null && picGroupArray[0].images[x].orientation.toLowerCase() === "landscape") {
                    hpics.push(picGroupArray[0].images[x]);
                  } else if (picGroupArray[0].images[x].orientation != undefined && picGroupArray[0].images[x].orientation != null && picGroupArray[0].images[x].orientation.toLowerCase() === "portrait") {
                    vpics.push(picGroupArray[0].images[x]);
                   } else if (picGroupArray[0].images[x].orientation != undefined && picGroupArray[0].images[x].orientation != null && picGroupArray[0].images[x].orientation.toLowerCase() === "square") {
                      spics.push(picGroupArray[0].images[x]);
                    }
                }
              }
              hpics = hpics.sort(() => Math.random() - 0.5);  //schweet
              vpics = vpics.sort(() => Math.random() - 0.5);  
            } else {
              console.log("caint fine no picture_groups_control");
            }
          }
          if (hasVidPositions) {
            let vidGroupMangler = document.getElementById("videoGroupsData");
            if (vidGroupMangler != null) {
              // picGroupMangler.components.picture_groups_control.attach(this.meshChildren);
              vidGroupArray = vidGroupMangler.components.video_groups_data.returnVideoData(); //it's an array of arrays
              console.log("vid group zero length is " + vidGroupArray[0].videos.length);
              for (let x = 0; x < vidGroupArray[0].videos.length; x++) {
                if (vidGroupArray[0].videos[x].orientation != undefined && vidGroupArray[0].videos[x].orientation != null && vidGroupArray[0].videos[x].orientation.toLowerCase() === "landscape") {
                  hvids.push(vidGroupArray[0].videos[x]);
                } else if (vidGroupArray[0].videos[x].orientation != undefined && vidGroupArray[0].videos[x].orientation != null && vidGroupArray[0].videos[x].orientation.toLowerCase() === "portrait") {
                  vvids.push(vidGroupArray[0].videos[x]);
                } else if (vidGroupArray[0].videos[x].orientation != undefined && vidGroupArray[0].videos[x].orientation != null && vidGroupArray[0].videos[x].orientation.toLowerCase() === "square") {
                  svids.push(vidGroupArray[0].videos[x]);
                }
              }
              hvids = hvids.sort(() => Math.random() - 0.5);  //schweet
              vvids = vvids.sort(() => Math.random() - 0.5);  
              svids = svids.sort(() => Math.random() - 0.5);  
            } else {
              console.log("caint fine no video_groups_control");
            }
          }
          if (hasAudioPositions) {
            let audioGroupMangler = document.getElementById("audioGroupsData");
            if (audioGroupMangler != null) {
              // picGroupMangler.components.picture_groups_control.attach(this.meshChildren);
              audioGroupArray = audioGroupMangler.components.audio_groups_data.returnAudioData(); //it's an array of arrays
              console.log("vid group zero length is " + audioGroupArray[0].audios.length);
              for (let x = 0; x < audioGroupArray[0].audios.length; x++) {
                audios.push(audioGroupArray[0].audios[x]);
              }
                // hvids = hvids.sort(() => Math.random() - 0.5);  //schweet
                // vvids = vvids.sort(() => Math.random() - 0.5);  
            } else {
              console.log("caint fine no video_groups_control");
            }
          }
          for (i = 0; i < this.meshChildren.length; i++) { //apply mods to the special things
            // console.log("meshChild " + this.meshChildren[i].name);
            if (this.meshChildren[i].name.includes("navmesh")) {
              console.log("gotsa navmesh too!");
              // let child = this.meshChildren[i].clone();
              this.child = this.el.object3D.getObjectByName(this.meshChildren[i].name, true);
              this.child.visible = false; //just hide named navmesh, they're loaded externally...

              // console.log(child);
              // if (child != null && child != undefined) { 
                //
                // this.child = child;
                  // var navmeshEnt = document.createElement('a-entity');
                  // navmeshEnt.setObject3D("mesh", this.child.clone());
                  

                  // navmeshEnt.setAttribute('nav-mesh');
                  // this.sceneEl.appendChild(navmeshEnt);
                // navmeshEnt.id = "navmesh";
                // navmeshEnt.classList.add("navmesh");
                // this.sceneEl.appendChild(navmeshEnt);
              // }
            } else if (this.meshChildren[i].name.includes("eye")) {
              console.log("gotsa eye too!");
              let child = this.el.object3D.getObjectByName(this.meshChildren[i].name, true);
              if (child != null) { 
                let box = new THREE.Box3().setFromObject(child); //bounding box for position
                let center = new THREE.Vector3();
                box.getCenter(center); //get centerpoint of eye child geometry, in localspace
                child.geometry.center(); //reset pivot of eye geo
                child.position.set(0,0,0); //clear transforms so position below won't be offset
                let theEye = document.createElement("a-entity");
                theEye.setObject3D("Object3D", child);
                theEye.setAttribute("look-at", "#player");
                this.el.appendChild(theEye); //set as child of DOM heirarchy, not just parent model
                theEye.setAttribute("position", obj.worldToLocal(center)); //set position as local to 
                // obj.updateMatrix();
                // obj.updateMatrixWorld();
              }
            } else if(this.meshChildren[i].name.includes("callout")) {
              // console.log("gotsa callout! " + this.meshChildren[i].name);
              let child = this.el.object3D.getObjectByName(this.meshChildren[i].name, true);
              // console.log(child);
              if (child != null && child != undefined) { 
                //
                var calloutChild = document.createElement('a-entity');
                calloutChild.classList.add("activeObjexRay");
                calloutChild.setObject3D("Object3D", child);
                var callout = this.meshChildren[i].name.split("_")[0];
                // console.log("callout string is " + callout);

                // calloutChild.addEventListener('model-loaded', () => {
                  // console.log("callout! " +callout);
                  calloutChild.setAttribute("model-callout", callout);

                this.el.appendChild(calloutChild);

              }
            } else if(this.meshChildren[i].name.includes("haudio") && hvids.length > 0) {
              // console.log("video data " + JSON.stringify(hvids[hvidsIndex]));
              this.mesh = this.meshChildren[i]; //mesh, not object3d type
              
              // }
            
            } else if((this.meshChildren[i].name.toString().includes("hvid") || this.meshChildren[i].name.toString() == "hvid") && hvids.length > 0) {
              console.log("video data " + JSON.stringify(hvids[hvidsIndex]));
              this.mesh = this.meshChildren[i]; //mesh, not object3d type
              
              this.child = this.el.object3D.getObjectByName(this.meshChildren[i].name, true); //object3d
                  this.vid_href = hvids[hvidsIndex].url;
                  let vProps = {};
                  vProps.url = this.vid_href;
                  vProps.index = hvidsIndex;
                  vProps.id = hvids[hvidsIndex]._id;
                  vProps.meshname = this.meshChildren[i].name;
                  vProps.videoTitle = hvids[hvidsIndex].title;
                  this.childEnt = document.createElement('a-entity'); 
                  this.el.appendChild(this.childEnt);
                  // this.clone = this.child.clone();
                  this.childEnt.setObject3D("Object3D", this.child);
                  this.childEnt.setAttribute("vid_materials_embed", vProps);
                  this.childEnt.classList.add("activeObjexRay");
                  // this.child.remove();
                  hvidsIndex++;
              // }
            }  else if((this.meshChildren[i].name.toString().includes("svid") || this.meshChildren[i].name.toString() == "svid") && svids.length > 0) {
                console.log("video data " + JSON.stringify(svids[svidsIndex]));
                this.mesh = this.meshChildren[i]; //mesh, not object3d type
                
                this.child = this.el.object3D.getObjectByName(this.meshChildren[i].name, true); //object3d
                this.vid_href = svids[svidsIndex].url;
                let vProps = {};
                vProps.url = this.vid_href;
                vProps.index = svidsIndex;
                vProps.id = svids[svidsIndex]._id;
                vProps.meshname = this.meshChildren[i].name;
                vProps.videoTitle = svids[svidsIndex].title;
                this.childEnt = document.createElement('a-entity'); 
                this.el.appendChild(this.childEnt);
                // this.clone = this.child.clone();
                this.childEnt.setObject3D("Object3D", this.child);
                this.childEnt.setAttribute("vid_materials_embed", vProps);
                this.childEnt.classList.add("activeObjexRay");
                // this.child.remove();
                svidsIndex++;
              // }
            } else if (this.meshChildren[i].name.includes("spic")) {
              let mesh = this.meshChildren[i]; //mesh, not object3d type
              let child = this.el.object3D.getObjectByName(this.meshChildren[i].name, true); //object3d
              if (spicsIndex < spics.length) {
                let childEnt = document.createElement('a-entity');
                     
                childEnt.classList.add("activeObjexRay");
                childEnt.setObject3D("Object3D", child);
                this.el.appendChild(childEnt);
                // console.log(this.data.name + " positon" + JSON.stringify(this.data.pos));
                let calloutEntity = document.createElement("a-entity");
                // calloutEntity.setAttribute('geometry', {primitive: 'plane', height: .25, width: .75, color: "black"});
                calloutEntity.setAttribute("scale", '4 4 4');
                let calloutText = document.createElement("a-text");
                this.el.sceneEl.appendChild(calloutEntity);
                calloutEntity.appendChild(calloutText);
                calloutEntity.setAttribute("look-at", "#player");
                calloutEntity.setAttribute('visible', false);

                calloutText.setAttribute("position", '0 0 .5'); //offset the child on z toward camera, to prevent overlap on model
                calloutText.setAttribute("look-at", "#player")
                calloutText.setAttribute('text', {
                  width: 2,
                  baseline: "bottom",
                  align: "center",
                  font: "/fonts/Exo2Bold.fnt",
                  anchor: "center",
                  wrapCount: 300,
                  color: "white",
                  value: spics[spicsIndex].title
                });
                // this.el.setAttribute("position", this.data.pos);
                childEnt.addEventListener('mouseenter', function (evt) {
                  var triggerAudioController = document.getElementById("triggerAudio");
                  if (triggerAudioController != null) {
                    triggerAudioController.components.trigger_audio_control.playAudio();
                    calloutEntity.setAttribute('visible', true);
                    let pos = evt.detail.intersection.point; //hitpoint on model
                    console.log("mousing a pic agt " + JSON.stringify(pos) + " title " + spics[spicsIndex].title);
                    calloutEntity.setAttribute("position", pos);
                  }
                });
                childEnt.addEventListener('mouseleave', function (evt) {
                  // console.log("tryna mouseexit");
                  calloutEntity.setAttribute('visible', false);
                });
                if (spics[spicsIndex].linkURL != null && spics[spicsIndex].linkURL != undefined && spics[spicsIndex].linkURL != 'undefined' && spics[spicsIndex].linkURL.length > 6) {
                  childEnt.setAttribute('basic-link', {href: spics[spicsIndex].linkURL});
                }
                  this.pic_href = spics[spicsIndex].url;
                  console.log("tryna load gallerypic " + this.meshChildren[i].name);
                  var loader = new THREE.TextureLoader();
                  // load a resource
                  loader.load(
                    // resource URL
                    this.pic_href,
                    // onLoad callback
                    function ( texture ) { 
                      this.pictexture = texture;
                      this.pictexture.encoding = THREE.sRGBEncoding; 
                      this.pictexture.flipY = true; 
                      this.picmaterial = new THREE.MeshBasicMaterial( { map: this.pictexture } ); 
                        
                      mesh.traverse(node => { //needs a callback here to insure it gets painted the first time
                        // console.log("gotsa obj + mat");
                        if (node.isMesh) {
                          node.material = this.picmaterial;
                        }
                      });
                    },
                    function ( err ) {
                      console.error( 'An error happened.' );
                    }
                  );
                spicsIndex++;
              }
            
            } else if (this.meshChildren[i].name.includes("hpic")) {
              let mesh = this.meshChildren[i]; //mesh, not object3d type
              let child = this.el.object3D.getObjectByName(this.meshChildren[i].name, true); //object3d
              if (hpicsIndex < hpics.length) {
                let childEnt = document.createElement('a-entity');
                     
                childEnt.classList.add("activeObjexRay");
                childEnt.setObject3D("Object3D", child);
                this.el.appendChild(childEnt);
                // console.log(this.data.name + " positon" + JSON.stringify(this.data.pos));
                let calloutEntity = document.createElement("a-entity");
                // calloutEntity.setAttribute('geometry', {primitive: 'plane', height: .25, width: .75, color: "black"});
                calloutEntity.setAttribute("scale", '4 4 4');
                let calloutText = document.createElement("a-text");
                this.el.sceneEl.appendChild(calloutEntity);
                calloutEntity.appendChild(calloutText);
                calloutEntity.setAttribute("look-at", "#player");
                calloutEntity.setAttribute('visible', false);

                calloutText.setAttribute("position", '0 0 .5'); //offset the child on z toward camera, to prevent overlap on model
                calloutText.setAttribute("look-at", "#player")
                calloutText.setAttribute('text', {
                  width: 2,
                  baseline: "bottom",
                  align: "center",
                  font: "/fonts/Exo2Bold.fnt",
                  anchor: "center",
                  wrapCount: 300,
                  color: "white",
                  value: hpics[hpicsIndex].title
                });
                // this.el.setAttribute("position", this.data.pos);
                childEnt.addEventListener('mouseenter', function (evt) {
                  var triggerAudioController = document.getElementById("triggerAudio");
                  if (triggerAudioController != null) {
                    triggerAudioController.components.trigger_audio_control.playAudio();
                    calloutEntity.setAttribute('visible', true);
                    let pos = evt.detail.intersection.point; //hitpoint on model
                    console.log("mousing a pic agt " + JSON.stringify(pos) + " title " + hpics[hpicsIndex].title);
                    calloutEntity.setAttribute("position", pos);
                  }
                });
                childEnt.addEventListener('mouseleave', function (evt) {
                  // console.log("tryna mouseexit");
                  calloutEntity.setAttribute('visible', false);
                });
                if (hpics[hpicsIndex].linkURL != null && hpics[hpicsIndex].linkURL != undefined && hpics[hpicsIndex].linkURL != 'undefined' && hpics[hpicsIndex].linkURL.length > 6) {
                  childEnt.setAttribute('basic-link', {href: hpics[hpicsIndex].linkURL});
                }
                  this.pic_href = hpics[hpicsIndex].url;
                  // console.log("tryna load gallerypic " + this.meshChildren[i].name);
                  var loader = new THREE.TextureLoader();
                  // load a resource
                  loader.load(
                    // resource URL
                    this.pic_href,
                    // onLoad callback
                    function ( texture ) { 
                      this.pictexture = texture;
                      this.pictexture.encoding = THREE.sRGBEncoding; 
                      this.pictexture.flipY = true; 
                      this.picmaterial = new THREE.MeshBasicMaterial( { map: this.pictexture } ); 
                        
                      mesh.traverse(node => { //needs a callback here to insure it gets painted the first time
                        // console.log("gotsa obj + mat");
                        if (node.isMesh) {
                          node.material = this.picmaterial;
                        }
                      });
                    },
                    function ( err ) {
                      console.error( 'An error happened.' );
                    }
                  );
                hpicsIndex++;
              }
            } else if (this.meshChildren[i].name.includes("vpic")) {
              let mesh = this.meshChildren[i]; //mesh, is not object3d type
              let child = this.el.object3D.getObjectByName(this.meshChildren[i].name, true); //object3d
              if (vpicsIndex < vpics.length) {
                let childEnt = document.createElement('a-entity');
                     
                childEnt.classList.add("activeObjexRay");
                childEnt.setObject3D("Object3D", child);
                this.el.appendChild(childEnt);
                // console.log(this.data.name + " positon" + JSON.stringify(this.data.pos));
                let calloutEntity = document.createElement("a-entity");
              
                calloutEntity.setAttribute("scale", '4 4 4');
                let calloutText = document.createElement("a-text");
                this.el.sceneEl.appendChild(calloutEntity);
                calloutEntity.appendChild(calloutText);

                calloutEntity.setAttribute("look-at", "#player");
                calloutEntity.setAttribute('visible', false);

                calloutText.setAttribute("position", '0 0 .5'); //offset the child on z toward camera, to prevent overlap on model
                calloutText.setAttribute("look-at", "#player")
                calloutText.setAttribute('text', {
                  width: 2,
                  baseline: "bottom",
                  align: "center",
                  font: "/fonts/Exo2Bold.fnt",
                  anchor: "center",
                  wrapCount: 300,
                  color: "white",
                  value: vpics[vpicsIndex].title
                });

                childEnt.addEventListener('mouseenter', function (evt) {
                  var triggerAudioController = document.getElementById("triggerAudio");
                  if (triggerAudioController != null) {
                    triggerAudioController.components.trigger_audio_control.playAudio();
                    calloutEntity.setAttribute('visible', true);
                    let pos = evt.detail.intersection.point; //hitpoint on model
                    console.log("mousing a pic agt " + JSON.stringify(pos) + " title " + vpics[vpicsIndex].title);
                    calloutEntity.setAttribute("position", pos);
                  }
                });
                childEnt.addEventListener('mouseleave', function (evt) {
                  // console.log("tryna mouseexit");
                  calloutEntity.setAttribute('visible', false);
                });
                if (vpics[vpicsIndex].linkURL != null && vpics[vpicsIndex].linkURL != undefined && vpics[vpicsIndex].linkURL != 'undefined' && vpics[vpicsIndex].linkURL.length > 6) {
                  childEnt.setAttribute('basic-link', {href: vpics[vpicsIndex].linkURL});
                }
                  this.pic_href = vpics[vpicsIndex].url;
                  // console.log("tryna load gallerypic " + this.meshChildren[i].name);
                  var loader = new THREE.TextureLoader();
                  // load a resource
                  loader.load(
                    // resource URL
                    this.pic_href,
                    // onLoad callback
                    function ( texture ) { 
                      this.pictexture = texture;
                      this.pictexture.encoding = THREE.sRGBEncoding; 
                      this.pictexture.flipY = true; 
                      this.picmaterial = new THREE.MeshBasicMaterial( { map: this.pictexture } ); 
                        
                      mesh.traverse(node => { //needs a callback here to insure it gets painted the first time
                        // console.log("gotsa obj + mat");
                        if (node.isMesh) {
                          node.material = this.picmaterial;
                        }
                      });
                    },
                    function ( err ) {
                      console.error( 'An error happened.' );
                    }
                  );
                vpicsIndex++;
              }
            }
          }
      }
      
      if (this.el.classList.contains('target')) {
        let textIndex = 0;
        this.position = null;
        // let hasBubble = false;
        // let theEl = this.element;
        var sceneEl = document.querySelector('a-scene');
        let hasCallout = false;
        let calloutOn = false;
        if (!this.data.eventData.toLowerCase().includes("undefined") && this.data.eventData.toLowerCase().includes("main") && this.data.eventData.toLowerCase().includes("text")) {
          document.getElementById("mainTextToggle").setAttribute("visible", false);
          this.data.eventData = document.getElementById("mainText").getAttribute("main-text-control", "mainTextString"); 
          console.log(this.data.eventData);
          eventData = this.data.eventData.mainTextString.split("~");
          hasCallout = true;
        } 
        if (hasCallout) {
          let bubble = document.createElement("a-entity");
          this.bubble = bubble;
          console.log("made a bubble!" + bubble);
          bubble.setAttribute("look-at", "#player");
          bubble.classList.add("bubble");
          bubble.setAttribute("position", "2 2 0");
          bubble.setAttribute("rotation", "0 0 0"); 
          bubble.setAttribute("scale", "1 1 1"); 
          bubble.setAttribute("visible", false);
          sceneEl.appendChild(bubble);
          
          let bubbleBackground = document.createElement("a-entity");
          bubbleBackground.classList.add("bubbleBackground");
          bubbleBackground.setAttribute("gltf-model", "#thoughtbubble"); //just switch this for other callout types (speech and plain callout)
          bubbleBackground.setAttribute("position", "0 0 1");
          bubbleBackground.setAttribute("rotation", "0 0 0"); 
          bubbleBackground.setAttribute("scale", "-.1 .1 .1"); 
          // bubble.setAttribute("material", {"color": "white", "blending": "additive", "transparent": false, "alphaTest": .5});
          bubbleBackground.setAttribute("material", {"color": "white", "shader": "flat"}); //doh, doesn't work for gltfs... 
          bubble.appendChild(bubbleBackground);

          
          let bubbleText = document.createElement("a-text");
          this.bubbleText = bubbleText;
          bubbleText.classList.add("bubbleText");
          // bubbleText.setAttribute("visible", false);
          bubbleText.setAttribute("position", "0 0 1.1");
          bubbleText.setAttribute("scale", ".1 .1 .1"); 
          // bubbleText.setAttribute("look-at", "#player");
          bubbleText.setAttribute("width", 3);
          bubbleText.setAttribute("height", 2);
          bubble.appendChild(bubbleText);
          
          bubbleBackground.addEventListener('model-loaded', () => {
            const bubbleObj = bubbleBackground.getObject3D('mesh');
            // var material = new THREE.MeshBasicMaterial({map: bubbleObj.material.map}); 
            // material.color = "white";
            bubbleObj.traverse(node => {
                // node.material = material;
                node.material.flatShading = true;
                node.material.needsUpdate = true
              });
            });
            /*
          setInterval(function(){ //get "viewport" position (normalized screen coords)
            if (calloutOn) {
            let pos = new THREE.Vector3();
            pos = pos.setFromMatrixPosition(obj.matrixWorld); //world pos of model, kindof
            // worldPos = pos;
            pos.project(camera);
            var width = window.innerWidth, height = window.innerHeight; 
            let widthHalf = width / 2;
            let heightHalf = height / 2;
            pos.x = (pos.x * widthHalf) + widthHalf;
            pos.y = - (pos.y * heightHalf) + heightHalf;
            pos.z = 0;
            // if (pos.x != NaN) { //does it twice because matrix set, disregard if it returns NaN :( //fixed?
            //   console.log("screen position: " + (pos.x/width).toFixed(1) + " " + (pos.y/height).toFixed(1)); //"viewport position"
            // }
            if ((pos.x/width) < .45) {
              console.log("flip left");
              bubbleBackground.setAttribute("position", "4 2 1");
              bubbleBackground.setAttribute("scale", "-.1 .1 .1"); 
              bubbleText.setAttribute("position", "4 2 1.1");
            } 
            if ((pos.x/width) > .55) {
              console.log("flip right");
              bubbleBackground.setAttribute("position", "-4 2 1");
              bubbleBackground.setAttribute("scale", ".1 .1 .1"); 
              bubbleText.setAttribute("position", "-4 2 1.1");
            }

            }
          }, 2000);
          */
        }
        let primaryAudio = document.getElementById("primaryAudio");
        if (primaryAudio != null) {
        const primaryAudioControlParams = primaryAudio.getAttribute('primary_audio_control');

        console.log("gotsa target attach " + primaryAudioControlParams.targetattach);
        if (primaryAudioControlParams.targetattach) { //set by sceneAttachPrimaryAudioToTarget or something like that...
          document.getElementById("primaryAudioParent").setAttribute("visible", false);
          // document.getElementById("primaryAudioParent").setAttribute("position", theEl.position);
          primaryAudio.emit('targetattach', {targetEntity: this.el}, true);
          primaryAudioHowl.pos(this.el.object3D.position.x, this.el.object3D.position.y, this.el.object3D.position.z);
          
          this.el.addEventListener('mousedown', function () {

            this.bubble = sceneEl.querySelector('.bubble');
            if (this.bubble) {
              this.bubble.setAttribute('visible', false);
            }
            calloutOn = false;
            // this.bubbleText = theEl.querySelector('.bubbleText');
            // this.bubble = sceneEl.querySelector('.bubble');
            // this.bubbleText = sceneEl.querySelector('.bubbleText');
            // if (hasCallout) {
            //   this.bubble.setAttribute("visible", false);
            //   this.bubbleText.setAttribute("visible", false);
            // }
            if (!primaryAudioHowl.playing()) {
                primaryAudioHowl.play();
                console.log('...tryna play...');
                if (moIndex != -1) { //moIndex = "mouthopen"
                  theEl.setAttribute('animation-mixer', {
                    "clip": clips[moIndex].name,
                    "loop": "repeat",
                    "repetitions": 10,
                    "timeScale": 2
                  });
                  theEl.addEventListener('animation-finished', function () { //clunky but whatever - this is the "recommended way" ?!?
                    theEl.removeAttribute('animation-mixer');
                  });
                }
              } else {
                    primaryAudioHowl.pause();
                    console.log('...tryna pause...');
                }
            });        
          }
        } else {
          console.log("no primary audio found!");
        }
        this.el.addEventListener('mouseenter', function (evt) {
          
          if (hasCallout && !eventData[textIndex].toLowerCase().includes("undefined")) {
            // this.bubble = theEl.querySelector('.bubble');
            // this.bubbleText = theEl.querySelector('.bubbleText');
            calloutOn = true;
            this.bubble = sceneEl.querySelector('.bubble');
            this.bubbleText = sceneEl.querySelector('.bubbleText');
            this.bubbleBackground = sceneEl.querySelector('.bubbleBackground');
            this.bubble.setAttribute("visible", true);
            let pos = evt.detail.intersection.point; //hitpoint on model
            this.bubble.setAttribute('position', pos);
            this.bubbleText.setAttribute("visible", true);
            // this.bubbleText.setAttribute('position', pos);

            // let pos = new THREE.Vector3();
            // pos = pos.setFromMatrixPosition(obj.matrixWorld); //world pos of model, kindof
            // worldPos = pos;
            let camera = AFRAME.scenes[0].camera; 
            pos.project(camera);
            var width = window.innerWidth, height = window.innerHeight; 
            let widthHalf = width / 2;
            let heightHalf = height / 2;
            pos.x = (pos.x * widthHalf) + widthHalf;
            pos.y = - (pos.y * heightHalf) + heightHalf;
            pos.z = 0;
            // if (pos.x != NaN) { //does it twice because matrix set, disregard if it returns NaN :( //fixed?
            //   console.log("screen position: " + (pos.x/width).toFixed(1) + " " + (pos.y/height).toFixed(1)); //"viewport position"
            // }
            if ((pos.x/width) < .45) {
              console.log("flip left");
              this.bubbleBackground.setAttribute("position", ".5 .2 .5");
              this.bubbleBackground.setAttribute("scale", "-.2 .2 .2"); 
              this.bubbleText.setAttribute("scale", ".2 .2 .2"); 
              this.bubbleText.setAttribute("position", ".5 .2 .55");
            } 
            if ((pos.x/width) > .55) {
              console.log("flip right");
              this.bubbleBackground.setAttribute("position", "-.5 .2 .5");
              this.bubbleBackground.setAttribute("scale", ".2 .2 .2"); 
              this.bubbleText.setAttribute("scale", ".2 .2 .2")
              this.bubbleText.setAttribute("position", "-.5 .2 .55");
            }
            this.bubbleText.setAttribute('text', {
              baseline: "bottom",
              align: "center",
              font: "/fonts/Exo2Bold.fnt",
              anchor: "center",
              wrapCount: 20,
              color: "black",
              value: eventData[textIndex]
            });

            if (textIndex < eventData.length - 1) {
              textIndex++;
            } else {
              textIndex = 0;
            }
          }

          var triggerAudioController = document.getElementById("triggerAudio");
          if (triggerAudioController != null) {
            triggerAudioController.components.trigger_audio_control.playAudio();
          }


        });
        // this.el.addEventListener('mouseleave', function (evt) {
        // //   if (textIndex < eventData.length) {
        // //     textIndex++;
        // //   } else {
        // //     textIndex = 0;
        // //   }
        //   if (hasCallout && !eventData[textIndex].toLowerCase().includes("undefined")) {
        //     // this.bubble = theEl.querySelector('.bubble');
        //     // this.bubbleText = theEl.querySelector('.bubbleText');
        //     // this.bubble = sceneEl.querySelector('.bubble');
        //     // this.bubble.setAttribute('visible', false);
        //   }


        // });
      }
      document.querySelector('a-scene').addEventListener('primaryAudioToggle', function () {
        // console.log("primaryAudioToggle!");
        if (primaryAudioHowl.playing()) {

          console.log("primaryAudioToggle is playing!");
          
          if (danceIndex != -1) { //moIndex = "mouthopen"
            theEl.setAttribute('animation-mixer', {
              "clip": clips[danceIndex].name,
              "loop": "repeat"
              // "repetitions": 10,
              // "timeScale": 2
            });
            // theEl.addEventListener('animation-finished', function () { //clunky but whatever - this is the "recommended way" ?!?
            //   theEl.removeAttribute('animation-mixer');
            // });
          }
        } else {
          console.log("primaryAudioToggle not playing");
          if (idleIndex != -1) { 
          theEl.setAttribute('animation-mixer', {
            "clip": clips[idleIndex].name,
            "loop": "repeat"
            // "repetitions": 10,
            // "timeScale": 2
          });
          // theEl.addEventListener('animation-finished', function () { //clunky but whatever - this is the "recommended way" ?!?
          //   theEl.removeAttribute('animation-mixer');
          // });
        }
        }
      });      
    }
    });
  }, 
  beat: function (volume) {
    // console.log("tryna beat " + this.el.id + " " + volume);
    if (this.data.eventData.toLowerCase().includes("beat")) {
      let oScale = this.el.getAttribute('data-scale');
      oScale = parseFloat(oScale);
      volume = volume.toFixed(2) * .1;
      let scale = {};
        scale.x = oScale + volume;
        scale.y = oScale + volume;
        scale.z = oScale + volume;
        this.el.setAttribute('scale', scale);
        this.el.setAttribute('animation', 'property: scale; to: '+oScale+' '+oScale+' '+oScale+'; dur: 500; startEvents: beatRecover; easing: easeInOutQuad');
        this.el.emit('beatRecover');

    }
  },
  setShader: function () {
    if (this.data.shader != '') {
    if (this.data.shader == "noise") {
      this.texture = new THREE.TextureLoader().load('https://realitymangler.com/assets/textures/watertile3.png');
      this.shaderMaterial = new THREE.ShaderMaterial( {
        uniforms: {
          tExplosion: {
            type: "t",
            // value: THREE.ImageUtils.loadTexture( 'https://realitymangler.com/assets/textures/cloud.png' )
            value: this.texture
          },
          time: {
            type: "f",
            value: 0.0
          }
        },
        
        vertexShader: document.getElementById( 'noise1_vertex' ).textContent, //hrmg
        
        fragmentShader: document.getElementById( 'noise1_fragment' ).textContent
      
      } );
      this.shaderMaterial.transparent = true;
      // console.log(document.getElementById( 'noise1_vertex' ).textContent);
      this.hasUniforms = true;
      // console.log("has UNIFORMSZA");
      }
    }
  },
  recursivelySetChildrenShader: function (mesh) {
    mesh.material = this.shaderMaterial;
          
    if (mesh.children) {
      for (var i = 0; i < mesh.children.length; i++) {
        this.recursivelySetChildrenShader(mesh.children[i]);
      }
    }
  },
  tick: function () {
    if (this.shaderMaterial != null && this.hasUniforms != null) {
      if (this.hasUniforms) {
        // console.log("timemods on");
        this.shaderMaterial.uniforms[ 'time' ].value = .00005 * ( Date.now() - this.start );

      }
    }
  }

});
///////////
AFRAME.registerComponent('video_transport', { //alt for testing perf
  schema: {
      videoID: {default: ''},
      init: function () {
      
      
      }
    },
});

AFRAME.registerComponent('skybox-env-map-nope', {
  schema: {
    enabled: {default: false},
    path: {default: ''},
    extension: {default: 'jpg'},
    format: {default: 'RGBFormat'},
    enableBackground: {default: false}
  },

  init: function () {
  this.isInitialized = false;
  this.el.addEventListener('model-loaded', () => {
    if (!this.isInitialized) { //do it once, not every time a child is loaded.
      this.isInitialized = true;
      const data = this.data;
      this.textureArray = [];
      this.envmapEl = null;
      this.path = null;
      for (let i = 1; i < 7; i++) {
        this.envmapEl = document.querySelector("#envmap_" + i);
        if (this.envmapEl) {
        this.path = this.envmapEl.getAttribute("src");
        console.log("envMap path " + this.path);
        this.textureArray.push(this.path);
        }
      }
      this.texture = new THREE.CubeTextureLoader().load(this.textureArray);
      this.texture.format = THREE[data.format];

      if (data.enableBackground) {
        this.el.sceneEl.object3D.background = this.texture;
      }
      this.applyEnvMap();
      this.el.addEventListener('object3dset', this.applyEnvMap.bind(this));
      }
    });
  },

  applyEnvMap: function () {
    const mesh = this.el.getObject3D('mesh');
    const envMap = this.texture;
    if (!mesh) return;
    mesh.traverse(function (node) {
      if (node.material && 'envMap' in node.material) {
      // if (node.material) {
        // console.log("tryna set envmap on " + node.material.name);
        node.material.envMap = envMap;
        node.material.envMap.intensity = 1;
        node.material.needsUpdate = true;
      }
    });
  },
  returnEnvMap () {
    return this.texture;
  }
});

AFRAME.registerComponent('skybox-env-map', {
  schema: {
    enabled: {default: false},
    path: {default: ''},
    extension: {default: 'jpg'},
    format: {default: 'RGBFormat'},
    enableBackground: {default: false}
  },

  init: function () {
  this.isInitialized = false;
  let that = this;
  this.el.addEventListener('model-loaded', () => {
    if (!this.isInitialized) { //do it once, not every time a child is loaded.
      this.isInitialized = true;
      let url = document.querySelector("#sky").src;
      this.texture = null;
      console.log("gotsa sky ref " + url);
      let dynSkyEl = document.getElementById('skybox_dynamic');
      if (dynSkyEl != null) {
        // console.log("gotsa sky ref " + url);
        this.texture = dynSkyEl.components.skybox_dynamic.returnEnvMap();
        // console.log("gotsa sky ref " + this.texture);
      } 
      if (this.texture == null)
        this.texture = new THREE.TextureLoader().load(url);
      }

      if (this.texture != null) {
        this.texture.encoding = THREE.sRGBEncoding;
        this.texture.mapping = THREE.EquirectangularReflectionMapping;
        this.texture.minFilter = this.texture.magFilter = THREE.LinearFilter;

        this.applyEnvMap();
           
      } else {
          setTimeout(function () {
            this.texture.encoding = THREE.sRGBEncoding;
            this.texture.mapping = THREE.EquirectangularReflectionMapping;
            this.texture.minFilter = this.texture.magFilter = THREE.LinearFilter;

            that.applyEnvMap();
          }, 3000);
      }
      // if (this.skyEl != null) {
      //   // this.skyEl.remove();
      //   this.skyEl.setAttribute('visible', false);
      //   }
      // }
    });
  },

  applyEnvMap: function () {
    // console.log("tryna applyEnvMap");
    const envMap = this.texture;  
    let envMapObjex = document.getElementsByClassName('envMap');
    // console.log("envMap elements " + envMapObjex.length);
    if (envMapObjex != null) {
      this.mesh = null;
      for (let i = 0; i < envMapObjex.length; i++) {
        // console.log("envMap element " + i + " " + envMapObjex.id);
        this.mesh = envMapObjex[i].getObject3D('mesh');

      if (this.mesh != null) {
        this.mesh.traverse(function (node) {

        if (node.material && 'envMap' in node.material) {
        // if (node.material) {
          // console.log("tryna set envmap on " + node.material.name);
              node.material.envMap = envMap;
              node.material.envMap.intensity = .75;
              node.material.needsUpdate = true;
            }
          });
        }
      }
    }
  },
  returnEnvMap () {
    return this.texture;
  }
});

AFRAME.registerComponent('skybox_dynamic', {
  schema: {
    enabled: {default: false},
    id: {default: null},
    // path: {default: ''},
    // extension: {default: 'jpg'},
    // format: {default: 'RGBFormat'},
    // enableBackground: {default: false}
  },

  init: function () {
    this.skyboxIndex = 0;
    this.skyEl = document.getElementById('skybox');
    this.skyboxData = null;
    this.texture = null;
    let picGroupMangler = document.getElementById("pictureGroupsData");

    if (picGroupMangler != null && picGroupMangler != undefined) {
      this.skyboxData = picGroupMangler.components.picture_groups_control.returnSkyboxData(this.data.id);
      // console.log(JSON.stringify(this.skyboxData));
    } else {
      this.singleSkybox(); //maybe tryna do this before models are loaded, is the problem..
    }

  },
  singleSkybox: function () {

    // const ref = document.getElementById("sky");
    console.log("skyboxURL : " + settings.skyboxURL);

   this.texture = new THREE.TextureLoader().load(settings.skyboxURL);
    this.texture.encoding = THREE.sRGBEncoding;
    this.texture.mapping = THREE.EquirectangularReflectionMapping;
    this.texture.minFilter = this.texture.magFilter = THREE.LinearFilter;
    this.el.sceneEl.object3D.background = this.texture;
    // this.texture = this.texture;
    // this.applyEnvMap();
    if (this.skyEl != null) {
      // this.skyEl.remove();
      this.skyEl.setAttribute('visible', false);
      }
  },
  nextSkybox: function () {
    if (this.skyboxData != null && this.skyboxData != undefined) {
      if (this.skyboxIndex < this.skyboxData.images.length - 1) {
        this.skyboxIndex++;
      } else {
        this.skyboxIndex = 0;
      }  
    // let skyEl = document.getElementById('skybox');
    // skyEl.setAttribute('visible', false);
    // skyEl.remove();
    
    console.log(this.skyboxData.images[this.skyboxIndex].url);
    this.texture = new THREE.TextureLoader().load(this.skyboxData.images[this.skyboxIndex].url);
    this.texture.encoding = THREE.sRGBEncoding;
    this.texture.mapping = THREE.EquirectangularReflectionMapping;
    this.texture.minFilter = this.texture.magFilter = THREE.LinearFilter;
    this.el.sceneEl.object3D.background = this.texture;
    // this.texture = this.texture;
    this.applyEnvMap();
    if (this.skyEl != null) {
      // this.skyEl.remove();
      this.skyEl.setAttribute('visible', false);
      }
    }
  },
  previousSkybox: function () {
    if (this.skyboxData != null && this.skyboxData != undefined) {
    if (this.skyboxIndex  > 0) {
      this.skyboxIndex++;
      // GoToLocation(sceneLocations.locationMods[currentLocationIndex].phID);
    } else {
      this.skyboxIndex  = this.skyboxData.images.length - 1;
    }  
    // let skyEl = document.getElementById('skybox');
    // skyEl.setAttribute('visible', false);
    console.log(this.skyboxData.images[this.skyboxIndex].url);
    this.texture = new THREE.TextureLoader().load(this.skyboxData.images[this.skyboxIndex].url);
    this.texture.encoding = THREE.sRGBEncoding;
    this.texture.mapping = THREE.EquirectangularReflectionMapping;
    this.texture.minFilter = this.texture.magFilter = THREE.LinearFilter;
    this.el.sceneEl.object3D.background = this.texture;
    // this.texture = this.texture;
    this.applyEnvMap();
    if (this.skyEl != null) {
      // this.skyEl.remove();
      this.skyEl.setAttribute('visible', false);
      }
    }
  },
  applyEnvMap: function () {
    console.log("tryna applyEnvMap");
    const envMap = this.texture;  
    let envMapObjex = document.getElementsByClassName('envMap');
    console.log("envMap elements " + envMapObjex.length);
    if (envMapObjex != null) {
      this.mesh = null;
      for (let i = 0; i < envMapObjex.length; i++) {
        // console.log("envMap element " + i + " " + envMapObjex.id);
        this.mesh = envMapObjex[i].getObject3D('mesh');

      if (this.mesh != null) {
        this.mesh.traverse(function (node) {

        if (node.material && 'envMap' in node.material) {
        // if (node.material) {
          console.log("tryna set envmap on " + node.material.name);
            node.material.envMap = envMap;
            node.material.envMap.intensity = 1;
            node.material.needsUpdate = true;
            }
          });
        }
      }
    }
    // }
  },
  returnEnvMap () {
    return this.texture;
  }
});

AFRAME.registerComponent('enviro_mods', {
  schema: {
    enabled: {default: true}
  }, 
  init: function () {
    this.enviroDressing = document.querySelector('.environmentDressing');
    this.enviroEl = document.getElementById('enviroEl');
  },
  beat: function () {
    scale = {};
    let v = 12;
    scale.x = v * .05;
    scale.y = v * .05;
    scale.z = v * .05;
    
    scale2 = {};
    scale2.x = 1;
    scale2.y = v * .1;
    scale2.z = 1;
    scale3 = {};
    scale3.x = v * .5;
    scale3.y = v * .5;
    scale3.z = v * .5;
    // console.log("beat event volume " + v);
    this.el.setAttribute('scale', scale);
    
    if (this.enviroDressing != null) {
        
        this.enviroDressing.setAttribute('scale', scale2 );
        this.enviroDressing.setAttribute('animation', 'property: scale; to: 1 1 1; dur: 250; startEvents: beatRecover');
        this.enviroDressing.emit('beatRecover');

    }
    // this.colorbeat();
    // this.el.setAttribute('animation', 'property: scale; to: 1 1 1; dur: 250; startEvents: beatRecover');
    // // enviroDressing.setAttribute('animation', 'property: scale; to: 1 1 1; dur: 250; startEvents: beatRecover');
    // this.el.emit('beatRecover');

  },
  colortweak: function () {
    console.log("colortweak");
    this.enviroEl.setAttribute('environment', {
      groundColor: "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}),
      groundColor2: "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}),
      dressingColor: "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}),
      skyColor: "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}),
      horizonColor: "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);})
    });
    // this.enviroEl.setAttribute('environment', {
    //   groundColor: settings.sceneColor3,
    //   groundColor2: settings.sceneColor4,
    //   dressingColor: settings.sceneColor4,
    //   skyColor: settings.sceneColor1,
    //   horizonColor: settings.sceneColor2
    // });

    this.enviroEl.setAttribute('animation', 'property: environment.groundColor; to: '+settings.sceneColor3+'; dur: 1000; startEvents: colorRecover');
    this.enviroEl.setAttribute('animation_1', 'property: environment.groundColor2; to: '+settings.sceneColor4+'; dur: 1000; startEvents: colorRecover');
    this.enviroEl.setAttribute('animation_2', 'property: environment.dressingColor; to: '+settings.sceneColor4+'; dur: 1000; startEvents: colorRecover');
    this.enviroEl.setAttribute('animation_3', 'property: environment.skyColor; to: '+settings.sceneColor1+'; dur: 1000; startEvents: colorRecover');
    this.enviroEl.setAttribute('animation_4', 'property: environment.horizonColor; to: '+settings.sceneColor2+'; dur: 1000; startEvents: colorRecover');
    this.el.emit('colorRecover');
  },
  colorlerp: function (duration) {
    duration = duration * 1000;
    console.log("TRYNA COLOR LOERP " + duration);
    // this.el.emit('colorTo');
    this.enviroEl.setAttribute('animation', 'property: environment.skyColor; to: '+settings.sceneColor1Alt+'; dur: '+duration+'; loop: true; dir: alternate');

    this.enviroEl.setAttribute('animation__1', 'property: environment.horizonColor; to: '+settings.sceneColor2Alt+'; dur: '+duration+'; loop: true; dir: alternate');
    this.enviroEl.setAttribute('animation__2', 'property: environment.groundColor; to: '+settings.sceneColor3Alt+'; dur: '+duration+'; loop: true; dir: alternate');
    this.enviroEl.setAttribute('animation__3', 'property: environment.groundColor2; to: '+settings.sceneColor4Alt+'; dur: '+duration+'; loop: true; dir: alternate');
    this.enviroEl.setAttribute('animation__4', 'property: environment.dressingColor; to: '+settings.sceneColor4Alt+'; dur: '+duration+'; loop: true; dir: alternate');

    // this.el.emit('colorTo');
    // setTimeout(function () { 
      // this.enviroEl.setAttribute('animation_5', 'property: environment.groundColor; to: '+settings.sceneColor3+'; dur: 2500; delay: 2500');
      // this.enviroEl.setAttribute('animation_6', 'property: environment.groundColor2; to: '+settings.sceneColor4+'; dur: 2500; delay: 2500');
      // this.enviroEl.setAttribute('animation_7', 'property: environment.dressingColor; to: '+settings.sceneColor4+'; dur: 2500; delay: 2500');
      // this.enviroEl.setAttribute('animation_8', 'property: environment.skyColor; to: '+settings.sceneColor1+'; dur: 2500; delay: 2500');
      // this.enviroEl.setAttribute('animation_9', 'property: environment.horizonColor; to: '+settings.sceneColor2+'; dur: 2500; delay: 2500');
    // }, 2500);
   

  }


});

AFRAME.registerComponent('mod-colors', {
  schema: {
    enabled: {default: false},
  },

  init: function () {

    let entityEl = this.el;
    let envEl = this.el.getAttribute('environment');
    let skycolor = envEl.skyColor;
    let groundcolor = envEl.groundColor;
    let groundcolor2 = envEl.groundColor2;
    let dressingcolor = envEl.dressingColor;
    let horizoncolor = envEl.horizonColor;
    console.log("skyColor is" + skycolor);
    setInterval(function(){ //get "viewport" position (normalized screen coords)

    entityEl.setAttribute('environment', {
      groundColor: "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}),
      groundColor2: "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}),
      dressingColor: "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}),
      skyColor: "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}),
      horizonColor: "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);})
    });
    // envEl.skyColor = "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")";
    // envEl.groundColor = "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")";
    // envEl.groundColor2 = "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")";
    // envEl.dressingColor = "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")";
    // envEl.horizonColor ="rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")";
    }, 2000);
  },

  // randomColor: function () {
  // var x = Math.floor(Math.random() * 256);
  //     var y = Math.floor(Math.random() * 256);
  //     var z = Math.floor(Math.random() * 256);
  //     return bgColor = "rgb(" + x + "," + y + "," + z + ")";
  //   }


});
AFRAME.registerComponent('text-items-control', {
  schema: {
    jsonData: {
      parse: JSON.parse,
      stringify: JSON.stringify
      }
    },

  init: function () {
    console.log(JSON.stringify(jsonData));
    }
});

AFRAME.registerComponent('picture_groups_control', {
  schema: {
    // jsonData: {
    //   parse: JSON.parse,
    //   stringify: JSON.stringify
    //   }
    jsonData: {default: []}
    },

  init: function () {
    let picGroupArray = [];
    // console.log("picgroupdata: " + JSON.stringify(this.data.jsonData));
    
    let theData = this.el.getAttribute('data-picture-groups');
    this.data.jsonData = JSON.parse(atob(theData)); //convert from base64
    // console.log("picgroupdata: " + JSON.stringify(this.data.jsonData[0]));
    
    if (this.data.jsonData != null && this.data.jsonData.length > 0) {
      let pictureGroupPicEl = document.getElementById("pictureGroupPic"); 
      let nextButton = document.getElementById("pictureGroupNextButton"); //get children like this instead
      let previousButton = document.getElementById("pictureGroupPreviousButton");
      picGroupArray = this.data.jsonData; //it's an array of arrays
    
      // let picGroup = picGroupArray[0];
      // console.log("picGroup :" + JSON.stringify(picGroup));a
      let picGroupIndex = 0;
      pictureGroupPicEl.addEventListener('model-loaded', () => {
        let mesh = pictureGroupPicEl.getObject3D('mesh');
        this.href = picGroupArray[0].images[0].url;
        console.log("tryna load initial scene pic " + this.href);
        this.texture = null;
        this.material = null;
        // const obj = pictureGroupPicEl.getObject3D('mesh');
        var loader = new THREE.TextureLoader();
        // load a resource
        loader.load(
          // resource URL
          this.href,
          // onLoad callback
          function ( texture ) { 
            this.texture = texture;
            this.texture.encoding = THREE.sRGBEncoding; 
            this.texture.flipY = false; 
            this.material = new THREE.MeshBasicMaterial( { map: this.texture } ); 
              
            mesh.traverse(node => { //needs a callback here to insure it gets painted the first time
              console.log("gotsa obj + mat");
              node.material = this.material;
            });
          },
          function ( err ) {
            console.error( 'An error happened.' );
          }
        );
      });
      this.el.addEventListener('toggleOnPicGroup', function (event) {
        console.log('toggleOnPicGroup event detected with', event.detail);
        let mesh = pictureGroupPicEl.getObject3D('mesh');
        this.href = picGroupArray[0].images[0].url;
        console.log("tryna load initial scene pic " + this.href);
        this.texture = null;
        this.material = null;
        // const obj = pictureGroupPicEl.getObject3D('mesh');
        var loader = new THREE.TextureLoader();
        // load a resource
        loader.load(
          // resource URL
          this.href,
          // onLoad callback
          function ( texture ) { 
            this.texture = texture;
            this.texture.encoding = THREE.sRGBEncoding; 
            this.texture.flipY = false; 
            this.material = new THREE.MeshBasicMaterial( { map: this.texture } ); 
              
            mesh.traverse(node => { //needs a callback here to insure it gets painted the first time
              console.log("gotsa obj + mat");
              node.material = this.material;
            });
          },
          function ( err ) {
            console.error( 'An error happened.' );
          }
        );
      });
        
        nextButton.addEventListener('mousedown', function () {
          // let picGroupArray = this.data.jsonData;
          let picGroup = picGroupArray[0];
          console.log("tryna show next from index" + picGroupIndex + " of " + picGroup.images.length);
          if (picGroup.images.length > picGroupIndex + 1) {
            picGroupIndex++;
            } else {
              picGroupIndex = 0;
          }
          const obj = pictureGroupPicEl.getObject3D('mesh');
          const href = picGroupArray[0].images[picGroupIndex].url;
          console.log("tryna set texture..." + href);
          var texture = new THREE.TextureLoader().load(href);
          texture.encoding = THREE.sRGBEncoding; 
          texture.flipY = false; 
          var material = new THREE.MeshBasicMaterial( { map: texture } ); 
          obj.traverse(node => {
            node.material = material;
          });
        });
        previousButton.addEventListener('mousedown', function () {
          // let picGroupArray = this.data.jsonData;
          let picGroup = picGroupArray[0];
          console.log("tryna show next from index" + picGroupIndex + " of " + picGroup.images.length);
          if (picGroupIndex > 0) {
              picGroupIndex--;
            } else {
              picGroupIndex = picGroup.images.length - 1;
          }
          const obj = pictureGroupPicEl.getObject3D('mesh');
          const href = picGroupArray[0].images[picGroupIndex].url;
          console.log("tryna set texture..." + href);
          var texture = new THREE.TextureLoader().load(href);
          texture.encoding = THREE.sRGBEncoding; 
          texture.flipY = false; 
          var material = new THREE.MeshBasicMaterial( { map: texture } ); 
          obj.traverse(node => {
            node.material = material;
          });
        });
      }
    },
    returnPictureData: function () {
      return this.data.jsonData;
    },
    returnSkyboxData: function (skyboxID) {
      //find the group with the skyboxID, if there is one, and return that (can't mix in scene vs. in group skyboxen..?)
      let group = null;
      let picGroupArray = this.data.jsonData;
      console.log("tryna find skybox id " + skyboxID);
      for (let i = 0; i < picGroupArray.length; i++) {
        for (let j = 0; j < picGroupArray[i].images.length; j++) {
          if (picGroupArray[i].images[j]._id == skyboxID) {
            group = picGroupArray[i];
            break;
          }
        }
      }
      return group;

    }
});

AFRAME.registerComponent('toggle-picture-group', {
  schema: {
    placeholder: {default: ''},
  },
    init: function () {
    
      this.el.addEventListener('mousedown', function () {
        console.log("tryna toggle pictureGroupPanel " + document.querySelector("#pictureGroupPanel").getAttribute('visible'));
        if (!document.querySelector("#pictureGroupPanel").getAttribute('visible')){
          document.querySelector("#pictureGroupPanel").setAttribute('visible', true);
          document.querySelector("#pictureGroupsControl").emit('toggleOnPicGroup');
        } else {
          document.querySelector("#pictureGroupPanel").setAttribute('visible', false);
        }
      });
  }
});

// AFRAME.registerComponent('primary_audio_events', {

//   // schema: {
//   //   jsonData: {
//   //     parse: JSON.parse,
//   //     stringify: JSON.stringify
//   //   }
//   // },
//   schema: {
//       jsonData: {default: ""}
//       },
//   init: function() {
//       let theData = this.el.getAttribute('data-audio-events');
//       this.data.jsonData = JSON.parse(atob(theData)); //convert from base64;
//       let timekeys = this.data.jsonData.timekeys;
//       console.log("timekeys: " + timekeys);
//       SetPrimaryAudioEventsData(timekeys);
//   },
//   currentAudioTime: function(audioTime) {
//       console.log("audiotime : " + audioTime);
//   }
// });

AFRAME.registerComponent('video_groups_data', {
  schema: {
    jsonData: {default: ""}
    },

  init: function () {

    // this.data.jsonData = JSON.parse(this.el.getAttribute('data-video-groups'));
    let theData = this.el.getAttribute('data-video-groups');
    this.data.jsonData = JSON.parse(atob(theData));
    let vdata = [];
    vdata = JSON.parse(atob(theData));
    let vids = vdata[0].videos;
    // console.log(JSON.stringify(vdata[0].videos));
    for (let i = 0; i < vids.length; i++) {
      // console.log("timekieys : " + JSON.stringify(vids[i].timekeys));
    } 

    let vtk = localStorage.getItem(room +"_timeKeys");
    console.log("video timekeysData : " +vtk);
    if (vtk == null) {
    // let theData = this.el.getAttribute('data-audio-events');
    // this.data.jsonData = JSON.parse(atob(theData)); //convert from base64;
    // let timekeys = this.data.jsonData.timekeys;
    // console.log("timekeys: " + timekeys);
    let tkObject = {};
    tkObject.listenTo = "Primary Video";
    tkObject.timekeys = vids[0].timekeys;
    // localStorage.setItem(room + "_timeKeys", JSON.stringify(vids[0].timekeys)); 
    timedEventsListenerMode = "Primary Video"
    localStorage.setItem(room + "_timeKeys", JSON.stringify(tkObject)); 
    } else {
      timeKeysData = JSON.parse(vtk);
      
    }

    SetVideoEventsData();
    },
    returnVideoData: function () {
      return this.data.jsonData;
    },
    returnCurrentVideo: function () {
      // return vids[0]
    },
    returnVideoTimekeys: function (_id) { //match selected vid id and return time events //nah...
      let tk = null;
      for (let i = 0; i < vids.length; i++) {
        // console.log("timekieys : " + JSON.stringify(vids[i].timekeys));
        if (_id == vids[i]._id) {
          tk = vids[i].timekeys;
        }
      }
      return tk; 
    
    }
});


AFRAME.registerComponent('follow', {
  schema: {
    target: {type: 'selector'},
    speed: {type: 'number'}
  },

  init: function () {
    this.directionVec3 = new THREE.Vector3();
  },

  tick: function (time, timeDelta) {
    var directionVec3 = this.directionVec3;

    // Grab position vectors (THREE.Vector3) from the entities' three.js objects.
    var targetPosition = this.data.target.object3D.position;
    var currentPosition = this.el.object3D.position;

    // Subtract the vectors to get the direction the entity should head in.
    directionVec3.copy(targetPosition).sub(currentPosition);

    // Calculate the distance.
    var distance = directionVec3.length();  

    // Don't go any closer if a close proximity has been reached.
    if (distance < 1) { return; }

    // Scale the direction vector's magnitude down to match the speed.
    var factor = this.data.speed / distance;
    ['x', 'y', 'z'].forEach(function (axis) {
      directionVec3[axis] *= factor * (timeDelta / 1000);
    });

    // Translate the entity in the direction towards the target.
    this.el.setAttribute('position', {
      x: currentPosition.x + directionVec3.x,
      y: currentPosition.y + directionVec3.y,
      z: currentPosition.z + directionVec3.z
    });
  }
});

AFRAME.registerComponent('particle_mangler', {
  schema: {
    preset: {default: "default"},
    randomize: {default: false},
    color: {default: ""},
    particleCount: {default: "100"},
    maxAge:  {default: "6"},
    direction:  {default: 1},
    velocityValue:  {default: "0 25 0"},
    positionSpread:  {default: "0 0 0"},
    opacity: {default: ".5"},
    size: {default: "1"},
    blending:  {default: "2"},
    texture: {default: ""},
    duration: {default: null}
    // skyParticles = "<a-entity scale='15 5 15' position='0 10 0' particle_mangler=\x22preset: dust; maxAge: 25; velocityValue: 0 -.01 0; direction: -.01; positionSpread: 30 15 30; opacity: .2; particleCount: 50; size: 1000; blending: 2; texture: https://realitymangler.com/assets/textures/cloud_lg.png; color: " + sceneResponse.sceneColor1 + "," + sceneResponse.sceneColor2 +"\x22></a-entity>";

    // color2: {default: ""}
  },
  init: function () {
    if (AFRAME.utils.device.isMobile()) {
      console.log("particle data " + JSON.stringify(this.data));
      var sceneEl = document.querySelector('a-scene');
      // let particleElement = document.createElement('a-entity');
      // sceneEl.appendChild(particleElement);
      this.el.removeAttribute ("particle-system"); //fukit
      // this.el.setAttribute("particle-system", {
      //   preset: this.data.preset,
      //   randomize: this.data.randomize,
      //   color: this.data.color,
      //   particleCount: this.data.particleCount,
      //   maxAge:  this.data.maxAge,
      //   direction:  this.data.direction,
      //   velocityValue:  this.data.velocityValue,
      //   positionSpread:  this.data.positionSpread,
      //   opacity: this.data.positionSpread,
      //   size: this.data.size,
      //   blending:  this.data.blending,
      //   texture: this.data.texture
      // });
    }
  },
});

AFRAME.registerComponent('youtube_player', {  //setup and controls for the 3d player
  schema: {
      color: {default: 'red'},
      hitpoint: {default: null},
      yt_id: {default: ""},
      duration: {default: 0}  
  },
  // dependencies: ['raycaster'],
  init: function () {
      // console.log("sceneTItle: " + this.data.sceneTitle);
      // let primaryAudioEl = document.querySelector('#primaryAudio');
      // let this = this; //?
      this.tick = AFRAME.utils.throttleTick(this.tick, 100, this);
      // this.el.setAttribute('gltf-model', '#audioplayer');
      this.el.classList.add('activeObjexRay');
      this.hitpoint = this.data.hitpoint;
      // this.el.visible = false;
      // this.el.object3D.visible = false;
      
      this.youtubeState = document.getElementById("youtubeState");
      this.youtubeStats = document.getElementById("youtubeStats");
      // this.youtubeStats.setAttribute('text', {
      //   baseline: "bottom",
      //       wrapCount: 70,
      //   align: "left",
      //   value: "loading..."
      // });
      
      this.duration = 0
      this.el.object3D.position = new THREE.Vector3('0 0 0');
      this.playerState = "";
      this.screen = null;
      this.play_button = null;  
      this.play_icon = null;
     this.slider_end = null;
     this.slider_begin = null;
     this.slider_handle = null;
      this.meshArray = []; //nm
      this.statsDiv = document.getElementById("transportStats");
      this.transportPlayButton = document.getElementById("transportPlayButton");
      
      this.mainTransportSlider = document.getElementById("mainTransportSlider");
      // this.youtubePlayer = null;
      this.redmat = new THREE.MeshStandardMaterial({
          color: "red"    // red (can also use a CSS color string here)
          // flatShading: true,
        });
        this.greenmat = new THREE.MeshStandardMaterial({
          color: "lightgreen"    // red (can also use a CSS color string here)
          // flatShading: true,
        });
        this.yellowmat = new THREE.MeshStandardMaterial({
          color: "yellow"    // red (can also use a CSS color string here)
          // flatShading: true,
        });
        this.bluemat = new THREE.MeshStandardMaterial({
          color: "blue"    // red (can also use a CSS color string here)
          // flatShading: true,
        });

      // this.el.setAttribute('gltf-model', '#audioplayer');
          this.el.addEventListener('model-loaded', () => {
            // console.log("YOUTUBE MODEL LOADED!");
          this.model = this.el.getObject3D('mesh');
          // this.ref = document.querySelector("#primaryAudioWaveform");
          // let theUrl = "https://img.youtube.com/vi/"+this.data.yt_id+"/mqdefault.jpg";
          let loadingTextureUrl = "https://servicemedia.s3.amazonaws.com/assets/pics/yotubeicon4.png";
          let readyTextureUrl = "https://servicemedia.s3.amazonaws.com/assets/pics/yotubeicon2.png";
          let playingTextureUrl = "https://servicemedia.s3.amazonaws.com/assets/pics/yotubeicon3.png";
          let pausedTextureUrl = "https://servicemedia.s3.amazonaws.com/assets/pics/yotubeicon1.png";
          this.loader = new THREE.TextureLoader();
          this.loader.crossOrigin = '';
          this.loadingtexture = this.loader.load(loadingTextureUrl);
          this.loadingtexture.encoding = THREE.sRGBEncoding; 
          this.loadingtexture.flipY = false; 
          this.playingtexture = this.loader.load(playingTextureUrl);
          this.playingtexture.encoding = THREE.sRGBEncoding; 
          this.playingtexture.flipY = false; 
          this.readytexture = this.loader.load(readyTextureUrl);
          this.readytexture.encoding = THREE.sRGBEncoding; 
          this.readytexture.flipY = false; 
          this.pausedtexture = this.loader.load(pausedTextureUrl);
          this.pausedtexture.encoding = THREE.sRGBEncoding; 
          this.pausedtexture.flipY = false; 
          
          // this.texture.encoding = THREE.sRGBEncoding; 
          // this.texture.flipY = false; 
          this.loadingMaterial = new THREE.MeshBasicMaterial( { map: this.loadingtexture, transparent: true } ); 
          this.readyMaterial = new THREE.MeshBasicMaterial( { map: this.readytexture, transparent: true } ); 
          this.playingMaterial = new THREE.MeshBasicMaterial( { map: this.playingtexture, transparent: true } ); 
          this.pausedMaterial = new THREE.MeshBasicMaterial( { map: this.pausedtexture, transparent: true } ); 
          // Go over the submeshes and modify materials we want.
                      
          this.model.traverse(node => {
          // if(node.isMesh) {
              if (node.name == "screen") { //not the eyes!
                  // console.log("gotsa screen!!!");
                  
                  this.screen = node;
                  this.screen.material = this.loadingMaterial;
                  // this.meshArray.push(this.screen);
                  //   node.material = this.material;
                  }

              if (node.name.includes("play_button")) {
                  // node.visible = false;
                  // console.log("gotsa play!!!");
                  this.play_button = node;
                  this.play_button.material = this.yellowmat;
                  // this.meshArray.push(this.playButton);
              }
              if (node.name.includes("play_icon")) {
                  // node.visible = false;
                  // console.log("gotsa play!!!");
                  this.play_icon = node;
                  // this.meshArray.push(this.playButton);
              }
          // }
              if (node.name.includes("slider_end")) {
                  // console.log("gotsa slider end");
                  this.slider_end = node;
              }
              if (node.name.includes("slider_begin")) {
                  this.slider_begin = node;
                  // console.log("gotsa slider begin");
              }
              if (node.name.includes("slider_handle")) {
                  this.slider_handle = node;
                  this.slider_handle.position = this.slider_begin.position;
                  // console.log("gotsa slider handle");
              }
              
          });
          this.el.setAttribute('sky-env-map');
          let youtubeParent = document.getElementById('youtubeParent');
          let locDataEl = document.getElementById('locationData');
          if (locDataEl != null && youtubeParent != null) { //if loc set as markerType youtube

            // this.set_position(locDataEl.components.location_data.returnYouTubePositon);
            let pos = locDataEl.components.location_data.returnYouTubePosition();
            console.log("youtube positoin " + JSON.stringify(pos));
            youtubeParent.setAttribute('position', pos);
          } 


          // this.nStart = new THREE.Vector3();
          // this.nEnd = new THREE.Vector3();
          // this.slider_begin.getWorldPosition( this.nStart );
          // this.slider_end.getWorldPosition( this.nEnd );
         
  //         this.setListeners();
      });
  // },
  // setListeners: function () {

      let thiz = this; //? localscope, but not updated like this
      thiz.duration = this.duration;
      if (this.mainTransportSlider != null && this.duration != null) {
          this.mainTransportSlider.oninput = function() {
          console.log(this.value);
          if (youtubePlayer != null) {
            // let duration = youtubePlayer.duration;
            let percent = this.value * .01;
            console.log("seeking " + youtubePlayer.getDuration() + " " + percent);
            youtubePlayer.seekTo((youtubePlayer.getDuration() * percent).toFixed(2));
          } else {
              // this.primaryAudioHowl = primaryAudioHowl;
          }       
        }
      }
      // thiz.slider_begin = this.slider_begin;
      // thiz.slider_end = this.slider_end;
      // this.mouseOverObject = null;
    this.raycaster = null;
    this.intersection = null;
    this.hitpoint = null;
    
    // if (sceneLocations.locations.length > 0); {
     
    // }
    this.el.addEventListener('raycaster-intersected', e =>{  
        this.raycaster = e.detail.el;
        thiz.raycaster = this.raycaster;
        this.intersection = this.raycaster.components.raycaster.getIntersection(this.el, true);
        this.hitpoint = this.intersection.point;
        
        // console.log('ray hit', this.intersection.point);
        if (!this.intersection.object.name.includes("screen") &&
            !this.intersection.object.name.includes("background") &&
            !this.intersection.object.name.includes("fastforward") &&
            !this.intersection.object.name.includes("rewind") &&
            !this.intersection.object.name.includes("previous") &&
            !this.intersection.object.name.includes("next") &&
            !this.intersection.object.name.includes("handle") &&
            !this.intersection.object.name.includes("play") &&
            !this.intersection.object.name.includes("pause")) {
            this.raycaster = null;
        } else {
            thiz.mouseOverObject = this.intersection.object.name;      
            // this.hitpoint = intersection.point;   
            console.log('ray hit', thiz.mouseOverObject );
        }
    });
    this.el.addEventListener("raycaster-intersected-cleared", () => {
        // console.log("intersection cleared");
        thiz.mouseOverObject = null;
        this.raycaster = null;
    });

    this.el.addEventListener('click', function (event) {
      // thiz.hitpoint = this.hitpoint;
      thiz.nStart = new THREE.Vector3();
      thiz.nEnd = new THREE.Vector3();
      thiz.slider_begin.getWorldPosition( thiz.nStart );
      thiz.slider_end.getWorldPosition( thiz.nEnd );
      console.log(thiz.mouseOverObject + " raycaster "+ thiz.raycaster);
      if (thiz.raycaster != null) {
          console.log(thiz.mouseOverObject);

      if (thiz.mouseOverObject.includes("play") || thiz.mouseOverObject.includes("screen")) {
        console.log("meshname clickded: " + thiz.mouseOverObject);
        console.log("play click");
        
        // PlayButton();
        // if (primaryAudioMangler != null) {
        //     primaryAudioMangler.playPauseToggle();
        // }
        if (!youtubeIsPlaying) {
          console.log("tryna play youtube");
          youtubePlayer.playVideo();
          PauseIntervals(false);
        } else {
          console.log("tryna pauze youtube");
          youtubePlayer.pauseVideo();
          PauseIntervals(true);
        }
      } else if (thiz.mouseOverObject.includes("slider_background")) {
          console.log("meshname clickded: " + thiz.mouseOverObject + " at hit point " + thiz.hitpoint);
          // this.slider_begin.position.y/this.slider_end.position.y 
          
          // this.hitpoint = this.intersection.point;
          // console.log("screen hit at " + JSON.stringify(thiz.hitpoint));
          let range = thiz.nEnd.x.toFixed(2) - thiz.nStart.x.toFixed(2);
          let correctedStartValue = thiz.hitpoint.x.toFixed(2) - thiz.nEnd.x.toFixed(2);
          let percentage = (((correctedStartValue * 100) / range) + 100).toFixed(2); 
          // let time = (percentage * (this.video.duration / 100)).toFixed(2);
          // let touchPosition = (((intersects[i].point.y.toFixed(2) - this.slider_begin.position.y.toFixed(2)) * 100) / (this.slider_end.position.y.toFixed(2) - this.slider_begin.position.y.toFixed(2)));
          console.log("bg touch % " + percentage +  " touchPosition " + JSON.stringify(thiz.hitpoint) + " vs start " +  JSON.stringify(thiz.nStart) + " vs end " +  JSON.stringify(thiz.nEnd));
          // this.slider_handle.position.x = intersects[i].point.x; 
          // this.slider_handle.position.z =  nStart.z;
          // this.slider_handle.position.z =  nStart.y; 
          thiz.slider_handle.position.lerpVectors(thiz.slider_begin.position, thiz.slider_end.position, percentage * .01);
          //   this.video.currentTime = time;
          if (youtubePlayer != null) {
            console.log(youtubePlayer.getDuration());
            thiz.time = youtubePlayer.getDuration() * percentage * .01;
            console.log(thiz.time.toFixed(2));
            youtubePlayer.seekTo(thiz.time, true);
          }
          if (primaryAudioMangler != null) {
            primaryAudioMangler.slider_update(percentage);
          }
          
          } else if (thiz.mouseOverObject.includes("handle")) {
            console.log("handle");
          
          } else if (thiz.mouseOverObject.includes("fastforward")) {
            console.log("ffwd");
            if (youtubePlayer != null) {
              youtubeTime = youtubePlayer.getCurrentTime();
              youtubeDuration = youtubePlayer.getDuration();
              if (youtubeTime < youtubeDuration - 10) {
                youtubePlayer.seekTo(youtubeTime + 10);
              } else {
                youtubePlayer.seekTo(0);
              }
            }
          } else if (thiz.mouseOverObject.includes("rewind")) {
            console.log("rewind");
            if (youtubePlayer != null) {
              youtubeTime = youtubePlayer.getCurrentTime();
              youtubeDuration = youtubePlayer.getDuration();
              if (youtubeTime > 10) {
                youtubePlayer.seekTo(youtubeTime - 10);
              } else {
                youtubePlayer.seekTo(youtubeDuration - 10);
              }
            }
          }
      // this.raycaster = null;
      }
    });
      // let that = this;
  },
  set_duration: function (seconds) {
    this.data.duration = seconds;
    console.log("this.duration is " + this.data.duration);
  },
  // set_player: function (player) {
  //   this.youtubePlayer = player;
  // },
  slider_update: function (percentage) {
      // if (primaryAudioMangler != null) {
      //     primaryAudioMangler.slider_update(percentage);
      // }
          // console.log("tryna update slider to " + percentage);
          this.slider_handle.position.lerpVectors(this.slider_begin.position, this.slider_end.position, percentage);
  }, 
  player_status_update (state) {
    this.playerState = state;
    if (this.youtubeState != null) {
      this.youtubeState.setAttribute('text', {
        baseline: "bottom",
            wrapCount: 70,
        align: "left",
        value: state
      });
    }

    if (this.play_button != null) {
      if (state == "loading") {
        this.play_button.material = this.yellowmat;
        if (this.transportPlayButton != null) {
            this.transportPlayButton.style.color = 'yellow';
        }
        this.screen.material = this.loadingMaterial;
      } else if (state == "ready") {
          this.play_button.material = this.bluemat;
          if (this.transportPlayButton != null) {
            this.transportPlayButton.style.color = 'blue';
        }
        this.screen.material = this.readyMaterial;
      } else if (state == "playing") {
          this.play_button.material = this.greenmat;
          if (this.transportPlayButton != null) {
            this.transportPlayButton.style.color = 'lightgreen';
        }
        this.screen.material = this.playingMaterial;
      } else if (state == "paused") {
          this.play_button.material = this.redmat;
          if (this.transportPlayButton != null) {
            this.transportPlayButton.style.color = 'red';
        }
        this.screen.material = this.pausedMaterial;
      }
    }
  },
  update_stats (timestring) {
    this.youtubeStats.setAttribute('text', {
      baseline: "bottom",
          wrapCount: 70,
      align: "left",
      value: timestring
    });
    MediaTimeUpdate(timestring);
  },
  tick: function() {
      if (!this.raycaster) {
         return;
      }
      if (!youtubePlayer) {
        return;
      }
      // if (youtubeIsPlaying) {
      //   // console.log(youtubePlayer.getCurrentTime());
      // }
      const inter_section = this.raycaster.components.raycaster.getIntersection(this.el, true);
      if (inter_section) {
          this.hitpoint = inter_section.point;
          // console.log("hitpoint " + JSON.stringify(this.hitpoint));
         // your calculations
      }
      // if (this.playerState == "playing") {
        // MediaTimeUpdate(fancyTimeString);
      // }
      // youtubeTime = youtubePlayer.getCurrentTime();
      // youtubeDuration = youtubePlayer.getDuration();
   }

});
let mainTransportSlider = null;
let transportPlayButton = null;
let youtube_player = null; //3d version
let youtubePlayer = null; //spawned by embed api
let youtubeIsPlaying = false;
let youtubeState = "";

function onYouTubeIframeAPIReady () { //must be global, called when youtube embed api is loaded
  let youtubeEl = document.getElementById("youtubeElement");
  let yt_id = youtubeEl.getAttribute('data-yt_id');
  console.log("YOUTUBE API IS READY, tryna make a player with id " + yt_id ); 
    youtubePlayer = new YT.Player('youtubeElement', {
      height: '200',
      width: '240',
      videoId: yt_id,
      playerVars: {
        'playsinline': 1
      },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
    });
    youtube_player = document.getElementById("youtubePlayer").components.youtube_player;
  }

  function onPlayerReady(event) {
    
    console.log("youtubePlayer is re4ady!");
    if (timedEventsListenerMode == null) {
      timedEventsListenerMode = "Youtube";
    }
    // document.getElementById('youtubeElement').style.borderColor = '#FF6D00';
    // youtube_player.player_status_update("ready");
    // youtube_player.set_duration(event.target.getDuration());
    // youtube_player.set_player(event.target);
    // youtube_player.update_stats("");
    // youtube_player.slider_update(0);
    mainTransportSlider = document.getElementById("mainTransportSlider");
    // changeBorderColor(5);
    // event.target.playVideo(); //TODO detect and toggle
    // let sniffer = setInterval()
    // if (youtube_player == null) {
      // youtube_player = document.getElementById("youtubePlayer").components.youtube_player;
    // }
    // if (youtube_player != null) {
    //     youtube_player.player_status_update("ready");
    // }
    if (timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'youtube') {
      SetVideoEventsData();
    }
    if (youtube_player == null || youtube_player == undefined) {
          this.interval = setInterval(() => {
            // console.log("youtube_player is null " + youtube_player == null);
            youtube_player = document.getElementById("youtubePlayer").components.youtube_player;
            if (youtube_player != null) {
              youtube_player.player_status_update("ready");
              clearInterval(this.interval);
            }
          }, 500); 
        } else {
          youtube_player.player_status_update("ready");
        }  
        // } else {
        //   clearInterval(this.interval);
        // }

  }
      // youtube_player.player_status_update("ready");
    // }

  // }

  function changeBorderColor(playerStatus) { 
    if (youtube_player != null) {
      var color;
      if (playerStatus == -1) {
        color = "#37474F"; // unstarted = gray
        youtube_player.player_status_update("ready");
      } else if (playerStatus == 0) {
        color = "#FFFF00"; // ended = yellow
        youtube_player.player_status_update("ready");
      } else if (playerStatus == 1) {
        color = "#33691E"; // playing = green
        youtube_player.player_status_update("playing");
      } else if (playerStatus == 2) {
        color = "#DD2C00"; // paused = red
        youtube_player.player_status_update("paused");
      } else if (playerStatus == 2) {
      } else if (playerStatus == 3) {
        color = "#AA00FF"; // buffering = purple
        // youtube_player.player_status_update("loading");
      } else if (playerStatus == 5) {
        color = "#FF6DOO"; // video cued = orange
        youtube_player.player_status_update("ready");
      }
      if (color) {
        document.getElementById('youtubeElement').style.borderColor = color;
      }
    }
  }
  
  // function youtubeCurrentTime(isPlaying) {
  //   if (isPlaying) {
  //     this.interval = setInterval(() => {
  //       console.log(event.target.getCurrentTime());
  //     }, 100);    
  //   } else {
  //     clearInterval(this.interval);
  //   }
  // }

  function onPlayerStateChange(event) {

    // // let interval = null;
    // currentTime = event.target.getCurrentTime();
    // console.log("current time youtube " + currentTime + " listenrMode " + timedEventsListenerMode);
    let duration = event.target.getDuration();
    if (event.data == YT.PlayerState.PLAYING) {
      // alert('video started');
        console.log("youtube is playing");
        youtubeIsPlaying = true;
        youtubeTime = youtubePlayer.getCurrentTime();
        youtubeDuration = youtubePlayer.getDuration();
        // youtubePlayer(youtubeIsPlaying);
        let time = 0;
        // let statsDiv = document.getElementById("transportStats");
        this.interval = setInterval(() => {
          time = event.target.getCurrentTime();
          currentTime = time.toFixed(2);
          // console.log(time.toFixed(2));
          let percent = time / duration;
          fancyTimeString = fancyTimeFormat(time)  + " / "+ fancyTimeFormat(duration.toFixed(2)) + " - " + (percent * 100).toFixed(2) +" %";
          // if (statsDiv != null) {
          //   statsDiv.innerHTML = timeString;
          //   }
          if (mainTransportSlider != null) {
            // console.log("tryna set slider to " + percent);
            mainTransportSlider.value = percent * 100;
          }  
          if (youtube_player != null) {
            youtube_player.update_stats(fancyTimeString);
            youtube_player.slider_update(percent);
          }
          MediaTimeUpdate(fancyTimeString);  //updates stats div and modal stats div
        }, 100); 
      } else if(event.data == YT.PlayerState.PAUSED) {
        //  alert('video paused');
        youtubeIsPlaying = false;
        console.log("youtube is not playing");
        clearInterval(this.interval);
      }
      // let interval = setInterval(() => {
      //   if (youtubeIsPlaying) {
      //     console.log(event.target.getCurrentTime());
      //   } else {
      //     clearInterval(interval);
      //   }
      // }, 100);
    changeBorderColor(event.data);
  }

function TransportPlayButton () {
  // console.log("youtubePlayer " + JSON.stringify(youtubePlayer));
  if (youtubePlayer != null) {
    if (!youtubeIsPlaying) {
      console.log("tryna play youtube");
      youtubePlayer.playVideo();
      PauseIntervals(false);
    } else {
      console.log("tryna pauze youtube");
      youtubePlayer.pauseVideo();
      PauseIntervals(true);
    }
  } else if (primaryAudioMangler != null) {
    console.log("play button for audio");
    primaryAudioMangler.playPauseToggle();
  }
}
function FastForwardButton () {
  console.log("ffwdButton Clicked");
  if (youtubePlayer != null) {
    youtubeTime = youtubePlayer.getCurrentTime();
    youtubeDuration = youtubePlayer.getDuration();
    if (youtubeTime < youtubeDuration - 10) {
      youtubePlayer.seekTo(youtubeTime + 10);
    } else {
      youtubePlayer.seekTo(0);
    }
  } else if (primaryAudioMangler != null) {
    console.log("play button for audio");
    primaryAudioMangler.fastForward();
  } 

}
function RewindButton () {
  console.log("rewindButton Clicked");

  if (youtubePlayer != null) {
    youtubeTime = youtubePlayer.getCurrentTime();
    youtubeDuration = youtubePlayer.getDuration();
    if (youtubeTime > 10) {
      youtubePlayer.seekTo(youtubeTime - 10);
    } else {
      youtubePlayer.seekTo(youtubeDuration - 10);
    }
  } else if (primaryAudioMangler != null) {
    console.log("play button for audio");
    primaryAudioMangler.rewind();
  }
  ClearIntervals();
  // timeKeysIndex = 0;
}

function NextButton () {
  console.log("NextButton Clicked " + timedEventsListenerMode);
  if (timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'youtube') {
    if (youtubePlayer != null) {
      let youtubeDuration = youtubePlayer.getDuration();
      youtubePlayer.seekTo(youtubeDuration - 2);
    }
  } else if (timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'primary audio') {
      if (primaryAudioMangler != null) {
      console.log("end button for audio");
      primaryAudioMangler.end();
    }
  }
}

function PreviousButton () {
  console.log("PrevButton Clicked " + timedEventsListenerMode);
  if (timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'youtube') {
    if (youtubePlayer != null) {
    youtubePlayer.seekTo(0);
    timeKeysIndex = 0;
  }
  } else if (timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'primary audio') {
      if (primaryAudioMangler != null) {
        console.log("start button for audio");
        primaryAudioMangler.start();
        timeKeysIndex = 0;
      }
    }
    ClearIntervals();
  }

function CaptureVideo(video) {
  var canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  var canvasContext = canvas.getContext("2d");
  canvasContext.drawImage(video, 0, 0);
  return canvas.toDataURL('image/png');
}



// function SetVideoEventsData (type) { 
  
//     tkStarttimes = []; //either audio or video, not both
//     if (timeKeysData.timekeys == undefined || timeKeysData.timekeys == null) {
//       timeKeysData = JSON.parse(localStorage.getItem(room+ "_timeKeys")); 
//     } 
    
    
//     if (timeKeysData != undefined && timeKeysData != null && timeKeysData.timekeys.length > 0 ) {
//       timeKeysData.timekeys.forEach(function (timekey) {
//       tkStarttimes.push(parseFloat(timekey.keystarttime).toFixed(2));
//     });
//     tkStarttimes.sort(function(a, b){
//       return a - b;
//     });
    
//     if (type == null && timedEventsListenerMode == null) {
//     timedEventsListenerMode = "Primary Video";
//     }
//     if (tkStarttimes.length > 0) {
//       console.log("tryna run video events listenr with timedEventsListenerMode : " + timedEventsListenerMode);
//       VideoEventsListener();
//     }
//   }
// }
// function SetYoutubeEventsData() {

// }

// let timeKeysIndex = 0;
// let videoInterval = null;

// function VideoEventsListener () {
//   console.log("TimedEventsListener" );
//   // let primaryAudioTime = 0;
//   let timeKeysIndex = 0;
//   let timekey = 0;
//   let vidz = document.getElementsByTagName("video");
//   // let primaryAudioEl = document.querySelector('#primaryAudio');
//   // let hasPrimaryAudio = false;
//   let videoEl = null;
//   // let vidz = document.getElementsByTagName("video");
//   if (vidz != null && vidz.length > 0) { //either video or audio, not both...?
//     videoEl = vidz[0];
//     console.log("videoEl " + videoEl.id);
//   }
//   // if (primaryAudioEl != null) {
//   //   hasPrimaryAudio = true;
//   // }
//   // if (vidz != null && vidz.length > 0) { //either video or audio, not both...?
//   //   videoEl = vidz[0];
//   // }
  
//   let videoInterval = setInterval(function () {
//      timekey = parseFloat(tkStarttimes[timeKeysIndex]);
//     //  console.log(timekey);
//     if (timekey != NaN) {//not not a number
//       if (timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'primary video') {
//         if (videoEl != null && !videoEl.paused && timekey > 0){
//           //  console.log("currentVideoTIme " + videoEl.currentTime + " vs timekey " + timekey);
//            if (videoEl.currentTime <= timekey) {
//               //prease stanby...
//            } else {
//               if (timeKeysIndex < tkStarttimes.length) {
//                  // console.log("vid event " + timeKeysData[timeKeysIndex]);
//                  PlayVideoEvent(timeKeysData.timekeys[timeKeysIndex]);
//                  timeKeysIndex++;
//               } else {
//                  console.log("end");
//                  clearInterval(videoInterval);
//               }
           
//             }
//           }
//       } else {
//         if (timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'youtube') { 
//           if (youtubePlayer != null && youtubeIsPlaying && timekey > 0) {
//             if (youtubePlayer.time <= timekey) {
//               //wait a scootch
//               } else { 
//                 if(timeKeysIndex < tkStarttimes.length) {
//                   // console.log("vid event " + timeKeysData[timeKeysIndex]);
//                   PlayVideoEvent(timeKeysData.timekeys[timeKeysIndex]);
//                   timeKeysIndex++;
//                   } else {
//                     console.log("end");
//                     clearInterval(videoInterval);
//                 }
//               }
//             }
//           }
//         }
//       }
//     }, 50);

// }
// function PlayVideoEvent(timeKey) {
//   console.log("event: " + JSON.stringify(timeKey));
//   // // let timekey = JSON.parse(timeKey);
//   // console.log("event: " + timeKey.keytype);
//   var player = document.getElementById("player");
//   player.setAttribute("player_mover", "init");
//   let duration = 1;
//   let posObj = {};
//   let rotObj = {};
//      if (timeKey.keytype == "Player Snap") {
//         // console.log("sceneLocations length is " + sceneLocations.locations.length);
//         // if (sceneLocations.locations.ength > 0) {
//         for (let s = 0; s < sceneLocations.locationMods.length; s++) {
//            // posObj = {};
//            // rotObj = {};
            
//            // console.log(timeKey.keydata.toString() + " vs " + sceneLocations.locationMods[s].label.toString());

//            if (sceneLocations.locationMods[s].label != undefined && timeKey.keydata.toString() == sceneLocations.locationMods[s].label.toString() && (sceneLocations.locationMods[s].markerType == "placeholder" || sceneLocations.locationMods[s].markerType == "poi")) {
//               posObj.x = sceneLocations.locationMods[s].x;
//               posObj.y = sceneLocations.locationMods[s].y;
//               posObj.z = sceneLocations.locationMods[s].z;
//               rotObj.x = sceneLocations.locationMods[s].eulerx != null ? sceneLocations.locationMods[s].eulerx : 0;
//               rotObj.y = sceneLocations.locationMods[s].eulery != null ? sceneLocations.locationMods[s].eulery : 0;
//               rotObj.z = sceneLocations.locationMods[s].eulerz != null ? sceneLocations.locationMods[s].eulerz : 0;
//               // console.log(JSON.stringify(timeKey) + " tryna fire event Player Snap to " + JSON.stringify(sceneLocations.locations[s]));
//               player.components.player_mover.move('player', posObj, rotObj, 0); //
//               // document.getElementById("player").setAttribute("position", sceneLocations.locations[s].x + " " + sceneLocations.locations[s].y + " " + sceneLocations.locations[s].z);
//               // document.getElementById("player").setAttribute("rotation", sceneLocations.locations[s].eulerx + " " + sceneLocations.locations[s].eulery + " " + sceneLocations.locations[s].eulerz);
//            } else {
//               // console.log("label not found");
//            }
//         }
//      } 
//      if (timeKey.keytype == "Player Lerp") {
//         // console.log("sceneLocations length is " + sceneLocations.locations.length);
//      // if (sceneLocations.locations.ength > 0) {
//         // console.log("event: " + JSON.stringify(timeKey));
//         for (let s = 0; s < sceneLocations.locationMods.length; s++) {
//            // console.log(timeKey.keydata + " vs " + JSON.stringify(sceneLocations.locationMods[s]));
//            if (sceneLocations.locationMods[s].label != undefined && timeKey.keydata.toString() == sceneLocations.locationMods[s].label.toString() && sceneLocations.locationMods[s].markerType == "poi") {
//               // posObj = {};
//               // rotObj = {};
//               posObj.x = sceneLocations.locationMods[s].x;
//               posObj.y = sceneLocations.locationMods[s].y;
//               posObj.z = sceneLocations.locationMods[s].z;
//               rotObj.x = sceneLocations.locationMods[s].eulerx != null ? sceneLocations.locationMods[s].eulerx : 0;
//               rotObj.y = sceneLocations.locationMods[s].eulery != null ? sceneLocations.locationMods[s].eulery : 0;
//               rotObj.z = sceneLocations.locationMods[s].eulerz != null ? sceneLocations.locationMods[s].eulerz : 0;
//               // document.getElementById("player").setAttribute("position", sceneLocations.locations[s].x + " " + sceneLocations.locations[s].y + " " + sceneLocations.locations[s].z);         
//               duration = timeKey.keyduration;
//               // console.log(JSON.stringify(timeKey) + " vs " + videoEl.currentTime + " tryna fire event Player lerp to " + JSON.stringify(posObj));
//               player.components.player_mover.move('player', posObj, rotObj, duration);
//            } else {
//               // console.log("label not found");
//            }
//         }
//      } 
// }