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



const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function PrimaryAudioInit() {
  console.log("PRIMARY AUDIO INIT()");
  primaryAudioEl = document.querySelector('#primaryAudio');
  if (primaryAudioEl != null) {
    primaryAudioMangler = document.getElementById("primaryAudio").components.primary_audio_control;
    console.log("PRIMARY AUDIO INIT() autoplay " + primaryAudioMangler.data.autoplay +  " isplaying " + primaryAudioHowl.playing());
    if (primaryAudioMangler.data.autoplay) {
      if (primaryAudioHowl != null) {
        if (!primaryAudioHowl.playing()) {
          primaryAudioMangler.playPauseToggle();
        }
      }
    }
  }
  let avz = document.getElementById("audiovizzler");
  if (avz != null) {
    vidz = document.getElementsByTagName("video"); //vidz declared in content-utils?
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
              beatElements[i].components.mod_model.beat(volume, 500);
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


window.mobileAndTabletCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
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
    sceneEl.setAttribute("screen-controls", true);
    let type = this.data.sceneType;
    let isIOS = DetectiOS();
    let isMobile = AFRAME.utils.device.isMobile();
    let headsetConnected = AFRAME.utils.device.checkHeadsetConnected();
    let isMacOS = (navigator.appVersion.indexOf('Mac') != -1);
    // let ios = this.detectIOS();
    // console.log("scene TYpe is " + type + " is IOS " + ios);


    // let iOS = iOS();
    // if (!AFRAME.utils.device.isMobile() && !AFRAME.utils.device.checkHeadsetConnected()) {
    //   if (!AFRAME.utils.device.isMobile()) {
    //   sceneEl.setAttribute("vr-mode-ui", "enabled", "true");
    // }
    // if (iOS) {
    //   document.querySelector('.a-enter-vr').style.display = 'none';
    // }
    // var fogColor = new THREE.Color(0xffffff);
    // sceneEl.background = fogColor; // Setting fogColor as the background color also
    // sceneEl.fog = new THREE.Fog(fogColor, 0.25, 4);
    // sceneEl.setAttribute('stats', '');
    // sceneEl.setAttribute("screen-controls", {'isMobile': isMobile});
    sceneEl.addEventListener('loaded', function () { //for sure?
      // console.log("aframe init with isMobile "  + isMobile + " isIOS " + isIOS + " isMacOS " + isMacOS + " headsetConnected " + headsetConnected);

      // console.log("three is" + THREE.path);
      window.sceneType = type;
      // InitSceneHooks(type);
      PrimaryAudioInit();
      let js = document.getElementById('joystickContainer');
      // sceneEl.setAttribute('render-canvas');
      if (window.mobileAndTabletCheck() || isMobile || isIOS) {
        let vrButton = document.querySelector(".a-enter-vr-button");
        if (vrButton != null) {
          vrButton.style.display = 'none'; //to hell with cardboard/gearvr/daydream
        }
        // if (js != null) {
        //   console.log("hiding joystick");
        //   js.style.visibility = 'visible'; //light up joystick if mobile
        // }
        // sceneEl.setAttribute('screen-controls', 'enabled', true); 
        // let ewasd = document.getElementById("player").components["extended_wasd_controls"];
        // if (ewasd != null) {
        //   ewasd.setJoystickInput(); // might do this in screen-controls component too, but np
        // } else {
        //   ewasd = 
        // }
      } else {
        // let js = document.getElementById('joystickContainer');
        // if (js != null) {
        //   console.log("hiding joystick"); //really hide if not mobile
        //   js.style.display = 'none';
        // }
      }
      let envEl = document.getElementById('enviroEl');
      if (envEl != null) {
        envEl.setAttribute('enviro_mods', 'enabled', true); //wait till env is init'd to put the mods
      }
      if (!headsetConnected || isMacOS) {
        let vrButton = document.querySelector(".a-enter-vr");
        if (vrButton != null) {
            console.log("hiding vr button");
          vrButton.style.display = 'none'; //to hell with cardboard/gearvr/daydream
          vrButton.style.visible = 'false';
        } else {
            console.log("din't found VRBUTTON");
        }
      }  
      this.asky = document.getElementsByTagName('a-sky')[0];
      if (this.asky && settings) {
        console.log("tryna mod asky radius " + settings.sceneSkyRadius);
        // this.asky1 = this.askies[0];
        this.asky.setAttribute("radius", settings.sceneSkyRadius);
        let skybox = document.getElementById("skybox");
        if (skybox) {
          let skyrad = settings.sceneSkyRadius - 2;
          console.log("tryna mod asky radius " + skyrad);
          skybox.setAttribute("radius", skyrad); //in case using reflection and enviro is on..
        } else {
          let skyboxD = document.getElementById("skybox_dynamic");
          if (skyboxD) {
            let skyradD = settings.sceneSkyRadius - 5;
            console.log("tryna mod asky radius " + skyradD);
            skyboxD.setAttribute("radius", skyradD); //in case using reflection and enviro is on..
          }
        }
      }
      
   
      // ////// test aabb collisions
      // document.addEventListener("DOMContentLoaded", function() {
      //   document.querySelectorAll("a-entity").forEach(function(entity) {
      //     // entity.addEventListener("hitstart", function(event) {
      //     //   console.log(
      //     //     event.target.id,
      //     //     "collided with",
      //     //     event.target.components["aabb-collider"]["intersectedEls"].map(x => x.id)
      //     //   );
      //     // });
      //   });
      // });
     
   });
   if (this.data.usdz != '') {
     ShowARButton(this.data.usdz);
   }

  },
  detectIOS: function() {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
  },
  toggleStats: function (showStats) {
    if (showStats) {
      sceneEl.setAttribute('stats', '');
    } else {
      sceneEl.removeAttribute('stats');
    }
  },
  toggleShowCurves: function (showCurves) {
    let showCurvesEl = document.getElementById("showCurves");
    if (showCurves) {
      showCurvesEl.setAttribute("visible", true);
    } else {
      showCurvesEl.setAttribute("visible", false);
    }
  }

}); //end initializer

AFRAME.registerComponent('disable-magicwindow', {
  init: function () {
    var cameraEl = document.querySelector('[look-controls]');
    if (cameraEl != null) {
    var lookControlsComponent = cameraEl.components["look-controls"];
    // if (!lookControlsComponent.magicWindowControls) { return; }
    lookControlsComponent.magicWindowTrackingEnabled = false;
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


AFRAME.registerComponent('parent-to', { //used with old ar.js...
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
AFRAME.registerComponent('get_pos_rot', { //ATTACHED TO PLAYER BELOW CAMERA RIG, returns pos/rot on request
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
  
    this.el.addEventListener("hitstart", function(event) {  //we're attached to the same player element that has the aabb-collider component, so listening here for player trigger hits
      // var source = event.originalTarget;
      console.log(
        "player TRIGGER event from " + event.target.components["aabb-collider"]["closestIntersectedEl"].id
          // "TRIGGER event from " + source.id
        // event.srcElement.id
      );
      //local and cloud marker types have triggers, gates, portals, placeholders
      let cloud_marker = event.target.components["aabb-collider"]["closestIntersectedEl"].components.cloud_marker; //closest trigger if multiple
      if (cloud_marker != null) { 
        cloud_marker.playerTriggerHit(); //tell the trigger that player has hit!
      } else {
        let local_marker = event.target.components["aabb-collider"]["closestIntersectedEl"].components.local_marker; //closest trigger if multiple
        if (local_marker != null) { 
          local_marker.playerTriggerHit(); //tell the trigger that player has hit!
        }
      }
    });
    
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
    this.el.addEventListener('click', (e)=> { //TODO turn off if parent is freaking invisible!!!!
      // e.stopPropagation();
      e.preventDefault();
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
      e.preventDefault();
      // console.log("tryna clear timeout");
      // window.clearInterval(this.data.downTimer);
      if (this.data.isDown) {
        window.open(this.data.href, "_blank");
      }
    });
    this.el.addEventListener('mouseleave', (e)=> {
      e.preventDefault();
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
    this.el.addEventListener('click', (e)=> { // turn off if parent is freaking invisible!!!!
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
    this.initialized = false;
  },
  play: function () {
    
    window.addEventListener('click', this.onClick);
  },
  pause: function () {
    window.removeEventListener('click', this.onClick);
  },
  onClick: function (evt) {
    var video = this.el.components.material.material.map.image;
    if (video != null) { 
      video.play();
    }
  }
});
AFRAME.registerComponent('audio-play-on-window-click', { //play videosphere
  init: function () {
    this.onClick = this.onClick.bind(this);
    this.initialized = false;
  },
  play: function () {
    
    window.addEventListener('click', this.onClick);
  },
  pause: function () {
    window.removeEventListener('click', this.onClick);
  },
  onClick: () => {
    if (!this.initialized) {
      console.log("tryna autoplay primary audio");
      let audioEl = document.getElementById("primaryAudio");
      if (audioEl != null) {
      var primaryAudioMangler = audioEl.components.primary_audio_control;
      if (primaryAudioMangler != null) {
          if (primaryAudioMangler.data.autoplay) {
            if (primaryAudioHowl != null) {
              if (!primaryAudioHowl.playing()) {
                primaryAudioMangler.playPauseToggle();
                this.initialized = true;
              }
            }
                // primaryAudioMangler.playPauseToggle();
                
     
          }
        }
      }
    }
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
        // font: {default: ""},
        mainTextString: {default: ''},
        mode: {default: ""},
        jsonData: {default: ""}
      },
      init: function () {
        let theData = this.el.getAttribute('data-maintext');
        console.log("maintext font " + this.data.font);
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

            // document.querySelector("#mainText").setAttribute('text', {
            //     baseline: "top",
            //     align: "left",
            //     value: this.textArray[0]
            // });

            this.font = "Acme.woff";

            if (settings && settings.sceneFontWeb1) {
              this.font = settings.sceneFontWeb1;
            }
            // if (settings && settings.sceneFontWeb1) {
            //   this.font2 = settings.sceneFontWeb2;
            // }
            document.querySelector("#mainText").setAttribute('troika-text', {
              value: this.textArray[0],
              font: '../fonts/web/' + this.font,
              lineHeight: 1,
              baseline: "top",
                  anchor: "left",
              maxWidth: 10,
              fontSize: .6,
              color: 'white',
              // fillOpacity: 5,
              // outlineColor: 'white',
              // outlineWidth: '1%',
              // outlineBlur: .25,
              strokeColor: 'black',
              strokeWidth: '1%'

            });
            // troika-text=\x22value: Hello World!; 
            // font: ../fonts/web/MountainsOfChristmasBold.woff; lineHeight: .85; maxWidth: 10; fontSize: 6; color: white; fillOpacity: .5;  outlineColor: white; outlineWidth: 1%; outlineBlur: .25; strokeColor: red; strokeWidth: 1%;\x22

            // console.log("mainTextString: " + textArray[0]);
            let uiMaterial = new THREE.MeshStandardMaterial( { color: '#63B671' } ); 
            if (this.textArray.length > 1) {
              mainTextHeader.setAttribute('visible', true);
                // mainTextHeader.setAttribute('text', {
                //     baseline: "top",
                //     align: "left",
                //     value: "page 1 of " + textArray.length 
                // });
                mainTextHeader.setAttribute('troika-text', {
                  baseline: "top",
                  anchor: "right",
                  value: "page 1 of " + textArray.length,
                  font: '../fonts/web/' + this.font,
                  lineHeight: .85,
                  maxWidth: 10,
                  fontSize: .3,
                  color: 'white'
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

                nextButton.addEventListener('click', function () {
                    if (textArray.length > index + 1) {
                        index++;
                    } else {
                        index = 0;
                    }
                    // console.log(textArray[index]);
                    document.querySelector("#mainText").setAttribute('troika-text', {
                      // baseline: "top",
                      // align: "left",
                        value: textArray[index]
                    });
                    mainTextHeader.setAttribute('troika-text', {
                      // baseline: "top",
                      // align: "left",
                      value: "page "+(index+1)+" of " + textArray.length
                    });
                });

                previousButton.addEventListener('click', function () {
                  if (index > 0) {
                      index--;
                  } else {
                      index = textArray.length - 1;
                  }
                  // console.log(textArray[index]);
                  document.querySelector("#mainText").setAttribute('troika-text', {
                    // baseline: "top",
                    // align: "left",
                      value: textArray[index]
                  });
                  mainTextHeader.setAttribute('troika-text', {
                    // baseline: "top",
                    // align: "left",
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
          this.material.envMap.intensity = .5;
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

        this.el.addEventListener('click', function () {
         

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
AFRAME.registerComponent('attributions_text_control', {

    schema: {
      jsonData: {default: ""},
      tArray: {default: []}
    },
    init: function () {
      // this.tArray = [];
      let theData = this.el.getAttribute('data-attributions');
      // console.log("attributions data" + theData);
      
      this.data.jsonData = JSON.parse(atob(theData)); //convert from base64
      // console.log("parsedAttribtions data : " +JSON.stringify(this.data.jsonData));
      this.tArray = this.data.jsonData;


      // let tArray = this.data.jsonData.attributions; //must use a declared name for array, raw array doesn't work
    }, 
    loadAttributions: () => {
    

      // attributionsArray = this.tArray; //for toggle component below//wha?
      
      // this.attributionsObject = attributions; //take from 
      // console.log("attributionsObject " + JSON.stringify(this.attributionsObject));
      // console.log("attributiosn length: " + tArray.length);
      attributionsIndex = 0;  
      if (this.tArray != undefined && this.tArray.length > 0) {       
          // this.tArray = tArray;
          // tArray.length = tArray.length;
          let headerEl = document.getElementById("attributionsHeaderText");
          let sourceEl = document.getElementById("attributionsSourceText");
          let authorEl = document.getElementById("attributionsAuthorText");
          let licenseEl = document.getElementById("attributionsLicenseText");
          let modsEl = document.getElementById("attributionsModsText");
          let nextButton = document.getElementById("nextAttribution");
          let previousButton = document.getElementById("previousAttribution");

          if (this.tArray[0].sourceTitle != undefined && this.tArray[0].sourceTitle != null ) {

          headerEl.setAttribute('text', {
            baseline: "top",
            align: "left",
            // color: "lightblue",
            value: "Attribution 1 of " + this.tArray.length
          });
          sourceEl.setAttribute('text', {
              baseline: "top",
              align: "left",
              // color: "lightblue",
              value: "Source: " + this.tArray[0].sourceTitle
          });
          // if (tArray[0].sourceLink != undefined && tArray[0].sourceLink.length > 0) {
          //   sourceEl.setAttribute('basic-link', {href: tArray[0].sourceLink});
          // }
          authorEl.setAttribute('text', {
            baseline: "top",
            align: "left",
            // color: "lightblue",
            value: "Author: " + this.tArray[0].authorName
          });
          // if (this.tArray[0].authorLink != undefined && this.tArray[0].authorLink.length > 0) {
          //     authorEl.setAttribute('basic-link', {href: this.tArray[0].authorLink});
          // }
          
          licenseEl.setAttribute('text', {
            baseline: "top",
            align: "left",
            value: "License: " + this.tArray[0].license
          });
          licenseEl.setAttribute('basic-link', {href: "https://creativecommons.org/licenses"});
          let mods = this.tArray[0].modifications.toLowerCase().includes("undefined") ? "none" : this.tArray[0].modifications;
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
            value: "Attribution 1 of " + this.tArray.length
          });
          sourceEl.setAttribute('text', {
              baseline: "top",
              align: "left",
              // color: "lightblue",
              value: "Attribution : " + this.tArray[0].sourceText
          });

        }

          let uiMaterial = new THREE.MeshStandardMaterial( { color: 'blue' } ); 
          
          if (this.tArray.length > 1) {
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
          previousButton.addEventListener('click', function () {
            console.log("tryna show previous from index" + attributionsIndex);
            if (attributionsIndex > 0) {
                  attributionsIndex--;
              } else {
                attributionsIndex = this.tArray.length - 1;
              }
              headerEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                // color: "lightblue",
                value: "Attribution "+(attributionsIndex+1)+" of " + this.tArray.length
              });
              sourceEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                // color: "lightblue",
                value: "Source: " + this.tArray[attributionsIndex].sourceTitle
              });
              if (this.tArray[attributionsIndex].sourceLink != undefined && this.tArray[attributionsIndex].sourceLink.length > 0) {
                sourceEl.setAttribute('basic-link', {href: this.tArray[attributionsIndex].sourceLink});
              } else {
                sourceEl.setAttribute('basic-link', {href: "no"});
                sourceEl.removeAttribute('basic-link', true);
              }
              authorEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                // color: "lightblue",
                value: "Author: " + this.tArray[attributionsIndex].authorName
              });
              if (this.tArray[attributionsIndex].authorLink != undefined && this.tArray[attributionsIndex].authorLink.length > 0) {
                authorEl.setAttribute('basic-link', {href: this.tArray[attributionsIndex].authorLink});
              } else {
                console.log("removing link");
                authorEl.setAttribute('basic-link', {href: "no"});
                authorEl.removeAttribute('basic-link', true);
              }
              licenseEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                value: "License: " + this.tArray[attributionsIndex].license
              });
              licenseEl.setAttribute('basic-link', {href: "https://creativecommons.org/licenses"});
              modsEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                value: "Mods: " + this.tArray[attributionsIndex].modifications
              });
          });          
          nextButton.addEventListener('click', function () {
            console.log("tryna show next from index" + attributionsIndex);
            if (this.tArray.length > attributionsIndex + 1) {
                  attributionsIndex++;
              } else {
                attributionsIndex = 0;
              }
              headerEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                // color: "lightblue",
                value: "Attribution "+ (attributionsIndex+1) +" of " + this.tArray.length
              });
              sourceEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                // color: "lightblue",
                value: "Source: " + this.tArray[attributionsIndex].sourceTitle
              });
              if (this.tArray[attributionsIndex].sourceLink != undefined && this.tArray[attributionsIndex].sourceLink.length > 4) {
                sourceEl.setAttribute('basic-link', {href: this.tArray[attributionsIndex].sourceLink});
              } else {
                console.log("removing link");
                sourceEl.setAttribute('basic-link', {href: "no"}); //try to override to force it
                sourceEl.removeAttribute('basic-link', true);
              }
              authorEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                // color: "lightblue",
                value: "Author: " + this.tArray[attributionsIndex].authorName
              });
              if (this.tArray[attributionsIndex].authorLink != undefined && this.tArray[attributionsIndex].authorLink.length > 0) {
                authorEl.setAttribute('basic-link', {href: this.tArray[attributionsIndex].authorLink});
              } else {
                console.log("removing link");
                authorEl.setAttribute('basic-link', {href: "no"});
                authorEl.removeAttribute('basic-link', true);
              }
              licenseEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                value: "License: " + this.tArray[attributionsIndex].license
              });
              licenseEl.setAttribute('basic-link', {href: "https://creativecommons.org/licenses"});
              modsEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                value: "Mods: " + this.tArray[attributionsIndex].modifications
              });
          });
      }
    },
    addAttribution: (attribution) => {
      console.log("attribution : " + JSON.stringify(attribution) + "into tArray " + JSON.stringify(this.tArray));
      // this.tArray.attributions.push(attribution);    
    },
    addAttibutions: function() {
      this.loadAttributions();
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
        this.material.envMap.intensity = .5;
        this.material.needsUpdate = true;
        obj.traverse(node => {
          node.material = this.material;

          });
      });

      let sourceEl = document.getElementById("attributionsSourceText");
      let authorEl = document.getElementById("attributionsAuthorText");
      this.el.addEventListener('click', function () {
        if (!document.querySelector("#attributionsTextPanel").getAttribute('visible')) {
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
      uiMaterial.envMap.intensity = .5;
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
          // availableScenePicEl.setAttribute('basic-scene-link', {href: sceneHref});   
          availableScenePicEl.setAttribute('link', {href: sceneHref});  
        });

      nextButton.addEventListener('click', function () {

        console.log("tryna show next from index" + availableScenesIndex);
        if (scenesArray.length > availableScenesIndex + 1) {
          availableScenesIndex++;
          } else {
          availableScenesIndex = 0;
        }
        let sceneHref = "/webxr/" + scenesArray[availableScenesIndex].sceneKey;
        // availableScenePicEl.setAttribute('basic-scene-link', {href: sceneHref});
        availableScenePicEl.setAttribute('link', {href: sceneHref});  
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
      previousButton.addEventListener('click', function () {
        console.log("tryna show next from index" + availableScenesIndex);
        if (availableScenesIndex > 0) {
          availableScenesIndex--;
        } else {
          availableScenesIndex = scenesArray.length - 1;
        }

        let sceneHref = "/webxr/" + scenesArray[availableScenesIndex].sceneKey;
        // availableScenePicEl.setAttribute('basic-scene-link', {href: sceneHref});
        availableScenePicEl.setAttribute('link', {href: sceneHref});  
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
        this.material.envMap.intensity = .5;
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
      this.el.addEventListener('click', function () {
        console.log("scenePanel visible " + scenesPanelEl.getAttribute('visible'));
        if (!scenesPanelEl.getAttribute('visible')){
          
          scenesPanelEl.setAttribute('visible', true);
          // // console.log(scenesPanelEl.getAttribute('available-scenes-control', jsonData.availableScenes));
          // // console.log(scenesArray);
          // var scene = scenesArray[Math.floor(Math.random() * scenesArray.length)];
          let sceneHref = "/webxr/" + scenesArray[0].sceneKey;
          console.log(sceneHref);
          // document.getElementById("availableScenePic").setAttribute('basic-scene-link', {href: sceneHref});
          document.getElementById("availableScenePic").setAttribute('link', {href: sceneHref});

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
      calloutString: {default: ""}

    },
    init: function () {
      if (this.data.calloutString != "") {
        var sceneEl = document.querySelector('a-scene');
        console.log("tryna init ENTITY CALLOUT " + this.el.id + " desc " + this.data.description );
        //let calloutString = this.data.calloutString;
        this.font = "Acme.woff";
        if (settings && settings.sceneFontWeb2 && settings.sceneFontWeb2.length) {
          this.font = settings.sceneFontWeb2;
        }

        let calloutEntity = document.createElement("a-entity");
        let calloutText = document.createElement("a-entity");
      
        // this.calloutText = calloutText;
        // calloutText.setAttribute('overlay');
        calloutEntity.setAttribute("look-at", "#player");
        calloutEntity.setAttribute('visible', false);
        // calloutEntity.setAttribute("render-order", "hud");
        sceneEl.appendChild(calloutEntity);
        calloutEntity.appendChild(calloutText);
        calloutText.setAttribute("position", '0 0 .3'); //offset the child on z toward camera, to prevent overlap on model
        calloutText.setAttribute('troika-text', {
          baseline: "bottom",
          align: "center",
          font: "/fonts/web/" + this.font,
          fontSize: .1,
          anchor: "center",
          outlineColor: "black",
          outlineWidth: "2%",
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
    }
  });
// }

AFRAME.registerComponent('model-callout', {
  schema: {
      index: {default: 0},
      calloutString: {default: ""}
    },
    init: function () {
      var sceneEl = document.querySelector('a-scene');
        // let obj = this.el.object3DMap;
        // // let map = this.el.getObject3D('mesh').el;
        // let name = obj.Object3D.name; //whew!
        this.modelHitDistance = 5;
        this.modParent = this.el.parentEl.components.mod_model;
      // this.parentModel
        let calloutString = this.data.calloutString.split('~')[0];
        calloutString = calloutString.replace(/\_/g, " ");
      
      let calloutEntity = document.createElement("a-entity");
      let calloutText = document.createElement("a-entity");
     
      // this.calloutText = calloutText;
      // calloutText.setAttribute('overlay');
      calloutEntity.setAttribute("look-at", "#player");
      calloutEntity.setAttribute('visible', false);
      // calloutEntity.setAttribute("render-order", "hud");
      sceneEl.appendChild(calloutEntity);
      calloutEntity.appendChild(calloutText);
      calloutText.setAttribute("position", '0 0 3'); //offset the child on z toward camera, to prevent overlap on model
      let font = "Acme.woff"; 
      if (settings && settings.sceneFontWeb2 && settings.sceneFontWeb2.length) {
        font = settings.sceneFontWeb2;
      }
      calloutText.setAttribute('troika-text', {
        baseline: "bottom",
        align: "center",
        font: "/fonts/web/" + font,
        anchor: "center",
        wrapCount: 30,
        color: "white",
        outlineColor: "black",
        outlineWidth: "2%",
        value: calloutString
      });
      this.el.addEventListener('mouseenter', function (evt) {
        // this.modelHitDistance = this.modParent.returnHitDistance();
        this.modelHitDistance = evt.detail.intersection.distance;
        console.log("hit distance is " + evt.detail.intersection.distance);
        
        // console.log("hit distance is " + JSON.stringify(this.modelHitDistance));
        calloutEntity.setAttribute('visible', true);
        let pos = evt.detail.intersection.point; //hitpoint on model
        calloutEntity.setAttribute("position", pos);
        calloutEntity.setAttribute("scale", {"x": this.modelHitDistance * .1, "y": this.modelHitDistance * .1, "z": this.modelHitDistance * .1})
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
          this.material.envMap.intensity = .5;
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
        let calloutText = document.createElement("a-entity");
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
        let font = "Acme.woff"; 
        if (settings && settings.sceneFontWeb2 && settings.sceneFontWeb2.length) {
          font = settings.sceneFontWeb2;
        }
        calloutText.setAttribute('troika-text', {
          baseline: "bottom",
          align: "center",
          fontSize: .2,
          font: "/fonts/web/" + font,
          anchor: "center",
          wrapCount: 30,
          color: "white",
          outlineColor: "black",
          outlineWidth: "2%",
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
      this.el.addEventListener('click', function () {
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

      console.log("scene inventory: " + JSON.stringify(this.data.jsonInventoryData));
      let objexEl = document.getElementById('sceneObjects');    
      objexEl.components.mod_objex.addSceneInventoryObjects(this.data.jsonInventoryData);
    }
  });


////////////////////////////////////////////  mod_objex spins through data and spawn objects attached to locations with mod_object component below ////////////////////////////
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
      this.sceneInventoryItems = null; //might be loaded after init, called from mod_scene_inventory component, if not part of the scene
      this.fromSceneInventory = false;

      this.data.jsonObjectData = JSON.parse(atob(theData)); //object items with model references
      this.data.jsonLocationsData = JSON.parse(atob(theLocData)); //scene locations with object references
      // console.log("objxe datas" + JSON.stringify(this.data.jsonObjectData));
      // console.log("objxe location datas" + JSON.stringify(this.data.jsonLocationsData));
      console.log(this.data.jsonLocationsData.length + " locations for " + this.data.jsonObjectData.length);

    this.triggerAudioController = document.getElementById("triggerAudio");
    this.camera = null;
    let cameraEl = document.querySelector('a-entity[camera]');
    if (!cameraEl) {
        cameraEl = document.querySelector('a-camera');
    }
    if (!cameraEl) {
      camaraEl = document.getElementById('player');
    } 
    if (cameraEl) {
      let theCamComponent = cameraEl.components.camera;
      if (theCamComponent != null) {
        this.camera = theCamComponent.camera;
      }
    }

      for (let i = 0; i < this.data.jsonLocationsData.length; i++) {
        for (let k = 0; k < this.data.jsonObjectData.length; k++) {
          if (this.data.jsonLocationsData[i].objectID != undefined && this.data.jsonLocationsData[i].objectID != null && this.data.jsonLocationsData[i].objectID == this.data.jsonObjectData[k]._id) {
            // console.log("location/object match " + this.data.jsonLocationsData[i].objectID);
            
            if (this.data.jsonObjectData[k].modelID != undefined && this.data.jsonObjectData[k].modelID != null) {
            //  console.log ("JSONOBJECTDATA" + this.data.jsonObjectData[k].eventData);
              if (this.data.jsonLocationsData[i].eventData != undefined && this.data.jsonLocationsData[i].eventData.toLowerCase().includes("equip")) {
                
                // EquipDefaultItem(this.data.jsonLocationsData[i].objectID); //in dialogs.js
                EquipDefaultItem(this.data.jsonLocationsData[i].objectID); //in dialogs.js
                
                // console.log("tryna equip with location/object match " + this.data.jsonLocationsData[i].objectID + " modelID " + this.data.jsonObjectData[k].modelID);
                // let objEl = document.createElement("a-entity");
                // objEl.setAttribute("mod_object", {'locationData': this.data.jsonLocationsData[i], 'objectData': this.data.jsonObjectData[k], 'equipped': true});
                // objEl.id = "obj" + this.data.jsonLocationsData[i].objectID + "_" + this.data.jsonLocationsData[i].timestamp;
                // sceneEl.appendChild(objEl);
              } else {
                if (!this.data.jsonLocationsData[i].markerType.toLowerCase().includes('spawn')) { //either spawn or spawntrigger types require interaction //now in cloudmarker, deprecate
                  console.log("location/object match " + this.data.jsonLocationsData[i].objectID + " modelID " + this.data.jsonObjectData[k].modelID);
                  let objEl = document.createElement("a-entity");
                  objEl.setAttribute("mod_object", {'eventData': this.data.jsonLocationsData[i].eventData, 'locationData': this.data.jsonLocationsData[i], 'objectData': this.data.jsonObjectData[k]});
                  objEl.id = "obj" + this.data.jsonLocationsData[i].objectID + "_" + this.data.jsonLocationsData[i].timestamp;
                  this.el.sceneEl.appendChild(objEl);
                }
              }
            } 
          }
        }
      }
      let that = this;
    },
    addSceneInventoryObjects: function(inventory_items) { //
      let oIDs = [];
      this.fromSceneInventory = true;
      // this.fromSceneInventory = objex._id //top level of inventory object, items are array property //NO, this is now the sceneID, set in each inventory_item//NOOO, it's nothing
      // if (objex.inventoryItems != undefined && objex.inventoryItems.length > 0) {
        this.sceneInventoryItems = inventory_items;
      // }
      console.log("gots scene inventory items: " + JSON.stringify(inventory_items));
      //wait, need to cache the locations where to place the fetched objs... :|
      if (inventory_items) {
        for (let i = 0; i < inventory_items.length; i++) {
          if (this.returnObjectData(inventory_items[i].objectID) == null) { //if we don't already have this object data, need to fetch it
            if (!oIDs.includes(inventory_items[i].objectID)) { //prevent duplicates
              oIDs.push(inventory_items[i].objectID);
              console.log("gotsa oID from scene inventory that needs fetching!");
            }
          }
        }
      }
      console.log("need to fetch to pop scene inventory: " + oIDs);
      FetchSceneInventoryObjex(oIDs); //do fetch in external function, below, bc ajax response can't get to component scope if it's here (?)
    
    },
    spawnObject: function (locationName) { //uses name (label) property of location to reference the object to spawn, called from a spawntrigger, using that location's eventData which should have the name... hrm.
      console.log("tryna spawn object with location name : "+ locationName);
      for (let j = 0; j < this.data.jsonLocationsData.length; j++) {
        let tmpName = this.data.jsonLocationsData[j].name;
        if (tmpName == 'undefined' || tmpName == null) { //some old ones only have a "label" property. sigh
          tmpName = this.data.jsonLocationsData[j].label != null ? this.data.jsonLocationsData[j].label : "";
        }
        if (tmpName == locationName) {
          let elIDString = "obj" + this.data.jsonLocationsData[j].objectID + "_" + this.data.jsonLocationsData[j].timestamp;
          let elID = document.getElementById(elIDString);
          if (!elID) { //only one for now... TODO count maxperscene?  check inventory?
            let locationData  = {};
            locationData.x = this.data.jsonLocationsData[j].x;
            locationData.y = this.data.jsonLocationsData[j].y;
            locationData.z = this.data.jsonLocationsData[j].z;
            this.objectData =  this.returnObjectData(this.data.jsonLocationsData[j].objectID);
            console.log("gotsa object to spawn " + JSON.stringify(this.data.jsonLocationsData[j].locationTags));
            let objEl = document.createElement("a-entity");
            objEl.setAttribute("mod_object", {'eventData': null, 'locationData': locationData, 'objectData': this.objectData, 'timestamp': this.data.jsonLocationsData[j].timestamp, 'tags': this.data.jsonLocationsData[j].locationTags});
            objEl.id = elIDString;
            sceneEl.appendChild(objEl);
            if (this.triggerAudioController != null) {
              let distance = window.playerPosition.distanceTo(locationData);
              console.log(distance + " distance to spawn lo9c " + locationData);
              this.triggerAudioController.components.trigger_audio_control.playAudioAtPosition(locationData, distance, ["spawn"], 1);//tagmangler needs an array, add vol mod 
            }
          } else {
            console.log("already spawned one of thoose...");
          }
        }
      }
    },
    loadSceneInventoryObjects: function () { //coming back from upstream call after updating jsonObjectData with missing sceneInventoryItems
      console.log("tryna loadSceneInventoryObjects fromSceneInventory " + this.fromSceneInventory);
      if (this.sceneInventoryItems != null) {
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
              if (locationData.x == 0 && locationData.y == 0 && locationData.z == 0) {
                locationData.x = Math.floor(Math.random() * 50);
                locationData.y = 20;
                locationData.z = Math.floor(Math.random() * 50);
              }
              let objEl = document.createElement("a-entity");
              objEl.setAttribute("mod_object", {'eventData': null, 'locationData': locationData, 'objectData': this.data.jsonObjectData[j], 'inventoryData': this.sceneInventoryItems[i], 'fromSceneInventory': this.fromSceneInventory, 'timestamp': timestamp});
              // objEl.setAttribute("mod_object", {'locationData': locationData, 'objectData': this.data.jsonObjectData[j], 'inventoryData': this.sceneInventoryItems[i], 'timestamp': timestamp});
              objEl.id = "obj" + this.data.jsonObjectData[j]._id + "_" + timestamp;
              sceneEl.appendChild(objEl);
              } else {
                console.log("well shoot, that one don't have a location " + JSON.stringify(this.sceneInventoryItems[i]));
              }
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
      // if (objek == null) {
      //   FetchSceneInventoryObject([objectID]);
      // }
      return objek;
    },
    returnObjexData: function() { //everything
      return this.data.jsonObjectData;
    },
    addFetchedObject (obj) { //for scene inventory objects, not in player inventory, added after initial load
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
      // data.inScene
      // data.inventoryID = inventoryID;
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
    equipInventoryObject: function (objectID) {
      // console.log("tryna equip model " + objectID + " equipped " + this.data.equipped );  
      this.objectData = this.returnObjectData(objectID);
      // console.log("tryna equip model " + JSON.stringify(this.objectData));  
      this.dropPos = new THREE.Vector3();
      this.objEl = document.createElement("a-entity");
      this.equipHolder = document.getElementById("equipPlaceholder");
      // this.equipHolder.object3D.getWorldPosition( this.dropPos );
      this.locData = {};
      // this.locData.x = this.dropPos.x;
      // this.locData.y = this.dropPos.y;
      // this.locData.z = this.dropPos.z;
      this.locData.x = 0;
      this.locData.y = 0;
      this.locData.z = 0;
      this.locData.markerObjScale = (this.objectData.objScale != undefined && this.objectData.objScale != "") ? this.objectData.objScale : 1; //these come from objectData, not locData
      this.locData.eulerx = (this.objectData.eulerx != undefined && this.objectData.eulerx != "") ? this.objectData.eulerx : 0;
      this.locData.eulery = (this.objectData.eulery != undefined && this.objectData.eulery != "") ? this.objectData.eulery : 0;
      this.locData.eulerz = (this.objectData.eulerz != undefined && this.objectData.eulerz != "") ? this.objectData.eulerz : 0;
      this.locData.timestamp = Date.now();
      this.objEl.setAttribute("mod_object", {'eventData': null, 'locationData': this.locData, 'objectData': this.objectData, 'isEquipped': true});
      this.objEl.id = "obj" + this.objectData._id + "_" + this.locData.timestamp;
      this.objEl.classList.add('equipped');
      
      this.objEl.classList.add('activeObjexRay');
      this.equipHolder.appendChild(this.objEl); //parent to equip holder instead of scene as below
      // this.el.setAttribute('gltf-model', '#' + modelID.toString());
    },
    selectObject: function (objectID) { //hrm...
      console.log("tryna select object " + objectID);  
      this.objectData = this.returnObjectData(objectID);
      this.dropPos = new THREE.Vector3();
      this.objEl = document.createElement("a-entity");
      this.locData = {};
      this.locData.x = this.dropPos.x;
      this.locData.y = this.dropPos.y;
      this.locData.z = this.dropPos.z;
      this.locData.timestamp = Date.now();
      this.objEl.setAttribute("mod_object", {'eventData': null, 'locationData': this.locData, 'objectData': this.objectData});
      this.objEl.id = "obj" + this.objectData._id + "_" + this.locData.timestamp;
      sceneEl.appendChild(this.objEl);
      // this.objEl.components.mod_object.applyForce();

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
      this.objEl.setAttribute("mod_object", {'eventData': null, 'locationData': this.locData, 'objectData': this.objectData});
      this.objEl.id = "obj" + this.objectData._id + "_" + this.locData.timestamp;
      sceneEl.appendChild(this.objEl);
      // this.objEl.components.mod_object.applyForce();

      // this.el.setAttribute('gltf-model', '#' + modelID.toString());
    },
    shootObject: function (objectID) {
      let downtime = 6000;
      this.objectData = this.returnObjectData(objectID);
      this.dropPos = new THREE.Vector3();
      this.dropRot = new THREE.Quaternion();
      this.objEl = document.createElement("a-entity");
      this.equipHolder = document.getElementById("equipPlaceholder");
      this.equippedObject = this.equipHolder.querySelector('.equipped');
      if (this.equippedObject != null) {
        this.equippedObject.object3D.getWorldPosition(this.dropPos);
      }
      if (!posRotReader) {
        player = document.getElementById("player");
        posRotReader = document.getElementById("player").components.get_pos_rot; 
      } 
      if (posRotReader) {
        this.playerPosRot = posRotReader.returnPosRot(); 
        console.log("this.playerPosRot" + JSON.stringify(this.playerPosRot));
        this.dropEuler = this.playerPosRot.rot;
        this.locData = {};
        this.locData.eulerx = this.playerPosRot.rot.x;
        this.locData.eulery = this.playerPosRot.rot.y;
        this.locData.eulerz = this.playerPosRot.rot.z;
        this.locData.timestamp = Date.now();
        this.objEl.setAttribute("position", this.dropPos);
        // this.objEl.setAttribute("mod_object", {'eventData': null, 'locationData': this.locData, 'objectData': this.objectData, 'applyForceToNewObject': true, 'forceFactor': downtime, 'removeAfter': "5"});
        this.objEl.setAttribute("mod_object", {'eventData': null, 'locationData': this.locData, 'objectData': this.objectData, 'followPathNewObject': true, 'forceFactor': downtime, 'removeAfter': "5"});
        this.objEl.id = "obj" + this.objectData._id + "_" + this.locData.timestamp;
        sceneEl.append(this.objEl);
      }

    },
    throwObject: function (objectID, downtime) {
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
      this.objEl.setAttribute("mod_object", {'eventData': null, 'locationData': this.locData, 'objectData': this.objectData, 'applyForceToNewObject': true, 'forceFactor': downtime, 'removeAfter': "5"});
      this.objEl.id = "obj" + this.objectData._id + "_" + this.locData.timestamp;

      sceneEl.appendChild(this.objEl);
      // this.el.setAttribute('gltf-model', '#' + modelID.toString());
    }
});

function FetchSceneInventoryObject(oID) { //add a single scene inventory object, e.g. child object spawn that isn't in initial collection, but don't init everything
  let objexEl = document.getElementById('sceneObjects');    
  // if (oIDs.length > 0) {
    // objexEl.components.mod_objex.dropObject(data.inventoryObj.objectID);
    let data = {};
    data.oIDs = [oID];
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/scene_inventory_objex/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
    xhr.onload = function () {
      // do something to response
      // console.log("fetched obj resp: " +this.responseText);
      let response = JSON.parse(this.responseText);
      // console.log("gotsome objex: " + response.objex.length);
      if (response.objex.length > 0) {
          objexEl.components.mod_objex.addFetchedObject(response.objex[0]); //add to scene object collection, so don't have to fetch again
      } 
    }
}

function FetchSceneInventoryObjex(oIDs) { //fetch scene inventory objects, i.e. stuff dropped by users, at start to populate scene
  let objexEl = document.getElementById('sceneObjects');    
  if (oIDs.length > 0) {
    // objexEl.components.mod_objex.dropObject(data.inventoryObj.objectID);
    let data = {};
    data.oIDs = oIDs;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/scene_inventory_objex/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
    xhr.onload = function () {
      // do something to response
      // console.log("fetched obj resp: " +this.responseText);
      let response = JSON.parse(this.responseText);
      // console.log("gotsome objex: " + response.objex.length);
      if (response.objex.length > 0) {

        for (let i = 0; i < response.objex.length; i++) {
          objexEl.components.mod_objex.addFetchedObject(response.objex[i]); //add to scene object collection, so don't have to fetch again
          //use locs and instantiate!
          // console.log(i + " vs " + response.objex.length - 1);
          if (i == response.objex.length - 1) {
            objexEl.components.mod_objex.loadSceneInventoryObjects(); //ok load em up
          }
        }
      } else {
        objexEl.components.mod_objex.loadSceneInventoryObjects(); //ok load em up
      }
    }
  } else {
    objexEl.components.mod_objex.loadSceneInventoryObjects(); //ok load em up
  }
}
/////////////////////////////////////////  mod_object component attached to 3D Cbjects, which have more properties than 3D Models, + actions - instantiated from mod_objex component above
AFRAME.registerComponent('mod_object', {
  schema: {
    locationData: {default: ''},
    objectData: {default: ''},
    eventData: {default: ''},
    isEquipped: {default: false},
    fromSceneInventory: {default: false},
    timestamp: {default: null},
    applyForceToNewObject: {default: false},
    followPathNewObject: {default: false},
    forceFactor: {default: 1},
    removeAfter: {default: ""},
    tags: {default: null}
  },
  init: function () {
    // console.log("mod_object data " + JSON.stringify(this.data.objectData.modelURL));
    this.moEl = this.el;
    this.isActivated = false; //to prevent dupes..
    this.calloutEntity = null;
    this.calloutPanel = null;
    this.calloutText = null;
    this.calloutString = "";
    this.selectedAxis = null;
    this.isSelected = false;
    this.hitPosition = null;
    this.mouseDownPos = new THREE.Vector2();
    this.mousePos = new THREE.Vector2();
    this.mouseDownStarttime = 0;
    this.mouseDowntime = 0;
    this.distance = 0;
    this.calloutLabelSplit = [];
    this.calloutLabelIndex = 0;
    this.promptSplit = [];
    this.promptIndex = 0;
    this.dialogEl = document.getElementById('mod_dialog');
    this.objexEl = document.getElementById('sceneObjects');    
    this.pickupAction = null;
    this.dropAction = null;
    this.equipAction = null;
    this.throwAction = null;
    this.shootAction = null;
    this.selectAction = null;
    this.loadAction = null;
    this.highlightAction = null;
    this.collideAction = null;
    this.synth = null;
    this.hasSynth = false;
    this.mod_physics = "";
    this.pushForward = false;
    this.followPath = false;
    this.lookVector = new THREE.Vector3( 0, 0, -1 );
    // this.startPoint = new THREE.Vector3();
    // this.tempVector = new THREE.Vector3();
    // this.endMesh = new THREE.Mesh(new THREE.SphereBufferGeometry(0.25, 16, 8), new THREE.MeshBasicMaterial({color: "blue", wireframe: true}));
    this.positionMe = new THREE.Vector3();
    this.directionMe = new THREE.Vector3();
    this.equippedRaycaster = null;
    this.lineMaterial = new THREE.LineBasicMaterial({
      color: 0xff0000
    });
    // this.lineEl = null;
    this.lineStart = new THREE.Vector3();
    this.lineMiddle = new THREE.Vector3();
    this.lineEnd = new THREE.Vector3();
    this.lineGeometry = new THREE.BufferGeometry().setFromPoints([
      this.lineStart,
      // this.lineMiddle,
      this.lineEnd
    ]);

    this.lineObject = new THREE.Line(this.lineGeometry, this.lineMaterial);
    this.el.sceneEl.object3D.add(this.lineObject);
    this.curve = null;
    this.isTriggered = false;
    // could be any number

    // let tG = new THREE.BufferGeometry().setFromPoints([
    //   new THREE.Vector3(),
    //   new THREE.Vector3()
    // ]);
    // let tM = new THREE.LineBasicMaterial({color: "yellow"});
    // this.beam = new THREE.Line(tG, tM);


    this.textIndex = 0;
    this.position = null;
    this.textData = [];

    // let textData = [];
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

    this.triggerAudioController = document.getElementById("triggerAudio");
    this.triggerOn = false;
    this.driveable = false;
    this.modelParent = null;

    this.camera = null;
    this.tags = this.data.tags;

    // this.raycaster = null;

    this.posIndex = 0; 
    this.currentPos = new THREE.Vector3();
    this.currentRot = new THREE.Vector3();
    // this.rotObjectMatrix = new THREE.Matrix4();//
    this.axis = new THREE.Vector3();
    this.up = new THREE.Vector3(0, 1, 0);
    this.line = null;
    this.equipHolder = document.getElementById("equipPlaceholder");
    
    let cameraEl = document.querySelector('a-entity[camera]');  
    if (!cameraEl) {
        cameraEl = document.querySelector('a-camera');
    }
    if (!cameraEl) {
      camaraEl = document.getElementById('player');
    } 
    if (cameraEl) {
      let theCamComponent = cameraEl.components.camera;
      if (theCamComponent != null) {
        this.camera = theCamComponent.camera;
      }
      // this.camera = cameraEl.components.camera.camera;
    }

    if (JSON.stringify(this.data.eventData).includes("beat")) {
      console.log ("adding class beatmee");
      this.el.classList.add("beatme");
      // this.el.addEventListener('beatme', e => console.log("beat" + e.detail.volume()));
      
    }


    this.thirdPersonPlaceholder = null;
    // this.sceneInventoryID = null;
    if (this.data.locationData && this.data.locationData.eventData && this.data.locationData.eventData.toLowerCase().includes("driveable")) {
      this.thirdPersonPlaceholder = document.getElementById("thirdPersonPlaceholder"); //it's in the server response

      if (this.thirdPersonPlaceholder) {
        this.modelParent = this.thirdPersonPlaceholder;
        // thirdPersonPlaceholder.appendChild(this.el);
        // this.el.setAttribute("position", {x:0, y:0, z:0});
        if (this.data.objectData.modelURL != undefined) {
          // thirdPersonPlaceholder.append(this.el);
          this.thirdPersonPlaceholder.setAttribute("gltf-model", this.data.objectData.modelURL); 
          let rot = {};
          rot.x = this.data.locationData.eulerx != undefined ? this.data.locationData.eulerx : 0;
          rot.y = this.data.locationData.eulery != undefined ? this.data.locationData.eulery : 0;
          rot.z = this.data.locationData.eulerz != undefined ? this.data.locationData.eulerz : 0;
          this.thirdPersonPlaceholder.setAttribute("rotation", rot);
        } else {
          // thirdPersonPlaceholder.append(this.el);
          this.thirdPersonPlaceholder.setAttribute("gltf-model", "#" +this.data.objectData.modelID); 
          let rot = {};
          rot.x = this.data.locationData.eulerx != undefined ? this.data.locationData.eulerx : 0;
          rot.y = this.data.locationData.eulery != undefined ? this.data.locationData.eulery : 0;
          rot.z = this.data.locationData.eulerz != undefined ? this.data.locationData.eulerz : 0;
          this.thirdPersonPlaceholder.setAttribute("rotation", rot);
        }
        // this.thirdPersonPlaceholder.setAttribute("object_raycaster", true);
      }
      
    } else {
      if (this.data.objectData.modelURL != undefined) {
        this.el.setAttribute("gltf-model", this.data.objectData.modelURL); 
      } else {
        this.el.setAttribute("gltf-model", "#" +this.data.objectData.modelID); 
      }
    }

      
    if (this.tags == null) {
      console.log(this.data.objectData.name + "this.data.tags is null! loctags: " + this.data.locationData.locationTags + " objtags: " + this.data.objectData.tags);

      if (this.data.locationData && this.data.locationData.locationTags != undefined  && this.data.locationData.locationTags != 'undefined' && this.data.locationData.locationTags.length > 0) {
        console.log(this.data.objectData.name + " gotsome location tags: " + this.data.locationData.locationTags);
        this.tags = this.data.locationData.locationTags;
      } else if (this.data.objectData.tags != undefined && this.data.objectData.tags != null && this.data.objectData.tags != "undefined" && this.data.objectData.tags.length > 0) {
        console.log(this.data.objectData.name + " gotsome tags: " + this.data.objectData.tags);
        this.tags = this.data.objectData.tags;
      }
      // if (this.data.locationData && this.data.locationData.markerType) {
      //   console.log(this.data.objectData.name + " gotsa markerType : "+ this.data.locationData.markerType);
      // }
    } else {
      console.log("this.data.tags is not null!");

    }
    if (this.data.objectData.triggerScale == undefined || this.data.objectData.triggerScale == null || this.data.objectData.triggerScale == "" || this.data.objectData.triggerScale == 0) {
      this.data.objectData.triggerScale = 1;
    } 
    setTimeout(() => { //to make sure audio group data is loaded
      if (this.tags && this.tags.includes("loop")){
        console.log("tryna trigger mod_object loop");
        var triggerAudioController = document.getElementById("triggerAudio");
        if (triggerAudioController != null) {
          
          triggerAudioController.components.trigger_audio_control.loopAndFollow(this.el.id, this.tags, !this.hasTriggerAction); //don't autoplay if hastriggeraction
        }
      }   
    }, 2000);
    // if (this.tags && this.tags.includes("loop")){
          
    //   var triggerAudioController = document.getElementById("triggerAudio");
    //   if (triggerAudioController != null) {

    //     triggerAudioController.components.trigger_audio_control.loopAndFollow(this.el.id, this.tags);
    //   }
    // }     
    this.hasPickupAction = false;
    this.hasTriggerAction = false;
    this.hasThrowAction = false;
    this.hasShootAction = false;

    if ((this.tags != null && !this.tags.includes("thoughtbubble")) && !this.tags.includes("hide callout")) { //TODO implement Callout Options!
      if (this.data.objectData.callouttext != undefined && this.data.objectData.callouttext != null && this.data.objectData.callouttext.length > 0) {
        if (this.data.objectData.callouttext.includes('~')) {
          this.calloutLabelSplit = this.data.objectData.callouttext.split('~'); 
          this.textData = this.calloutLabelSplit;
        }
        console.log(this.data.objectData.name + "callouttext " + this.data.objectData.callouttext );
        this.calloutEntity = document.createElement("a-entity");
       
        this.calloutText = document.createElement("a-entity");
        this.calloutEntity.id = "objCalloutEntity_" + this.data.objectData._id;
      
        this.calloutText.id = "objCalloutText_" + this.data.objectData._id;
          
        // TODO flex with sceneTextBackground
        // this.calloutPanel.id = "objCalloutPanel_" + this.data.objectData._id;
        // this.calloutPanel = document.createElement("a-entity"); 
        // this.calloutPanel.setAttribute("gltf-model", "#landscape_panel");
        // this.calloutPanel.setAttribute("scale", ".125 .1 .125");
        // this.calloutPanel.setAttribute("material", {'color': 'black', 'roughness': 1});
        // this.calloutPanel.setAttribute("overlay");
        this.calloutEntity.setAttribute("look-at", "#player");
        this.calloutEntity.setAttribute('visible', false);
      
        // calloutEntity.setAttribute("render-order", "hud");
        this.el.sceneEl.appendChild(this.calloutEntity);
        // this.calloutEntity.appendChild(this.calloutPanel);
        this.calloutEntity.appendChild(this.calloutText);
        let font = "Acme.woff"; 
        if (settings && settings.sceneFontWeb2 && settings.sceneFontWeb2.length) {
          font = settings.sceneFontWeb2;
        }
        // this.calloutPanel.setAttribute("position", '0 0 1'); 
        this.calloutText.setAttribute("position", '0 0 1.25'); //offset the child on z toward camera, to prevent overlap on model
        this.calloutText.setAttribute('troika-text', {
          fontSize: .1,
          baseline: "bottom",
          align: "left",
          font: "/fonts/web/" + font,
          anchor: "center",
          // wrapCount: 14,
          color: "white",
          outlineColor: "black",
          outlineWidth: "2%",
          value: ""
        });
        this.calloutText.setAttribute("overlay");
      } 
    }
    // if (this.data.objectData.synthNotes != undefined && this.data.objectData.synthNotes != null && this.data.objectData.synthNotes.length > 0) {
    if (this.data.objectData.tonejsPatch1 != undefined && this.data.objectData.tonejsPatch1 != null) {  
      this.el.setAttribute("mod_synth", "init");
      this.hasSynth = true;

    }
   
    if (this.data.objectData.actions != undefined && this.data.objectData.actions.length > 0) {
      for (let a = 0; a < this.data.objectData.actions.length; a++) {
          // console.log("action: " + JSON.stringify(this.data.objectData.actions[a].actionType));
        if (this.data.objectData.actions[a].actionType.toLowerCase() == "onload") {
          // this.hasSelectAction = true;
          this.loadAction = this.data.objectData.actions[a];
        }
        if (this.data.objectData.actions[a].actionType.toLowerCase() == "select") {
          this.hasSelectAction = true;
          this.selectAction = this.data.objectData.actions[a];
        }
        if (this.data.objectData.actions[a].actionType.toLowerCase() == "highlight") {
          this.hasHighlightAction = true;
          this.highlightAction = this.data.objectData.actions[a];
        }
        if (this.data.objectData.actions[a].actionType.toLowerCase() == "collide") {
          this.hasCollideAction = true;
          this.collideAction = this.data.objectData.actions[a];
        }
        if (this.data.objectData.actions[a].actionType.toLowerCase() == "pickup") {
          this.hasPickupAction = true;
          this.pickupAction = this.data.objectData.actions[a];
        }
        if (this.data.objectData.actions[a].actionType.toLowerCase() == "drop") {
          this.hasDropAction = true;
          this.dropAction = this.data.objectData.actions[a];
        }
        if (this.data.objectData.actions[a].actionType.toLowerCase() == "throw") {
          this.hasThrowAction = true;
          this.throwAction = this.data.objectData.actions[a];
        }
        if (this.data.objectData.actions[a].actionType.toLowerCase() == "trigger") {
          this.hasTriggerAction = true;
          // this.throwAction = this.data.objectData.actions[a];
          // this.el.setAttribute("equipped_object_control", {init: true});
          
        }

        if (this.data.objectData.actions[a].actionType.toLowerCase() == "shoot") {
          this.hasShootAction = true;
          this.shootAction = this.data.objectData.actions[a];
        }
        if (this.data.objectData.actions[a].actionType.toLowerCase() == "equip") {
          this.hasEquipAction = true;
        }
        if (this.data.objectData.actions[a].actionType.toLowerCase() == "return") {
          // this.hasDropAction = true;
        }
        if (this.data.objectData.actions[a].actionType.toLowerCase() == "use") {
          // this.hasDropAction = true;
        }
      }
    }

    if (this.data.isEquipped) {

      if (this.hasTriggerAction) {
        this.el.setAttribute("raycaster", {"objects": ".target", "far": "50", "position": "0 -0.5 0", "rotation": "90 0 0"});
        this.equippedRaycaster = this.el.components.raycaster;
      }
      if (this.hasShootAction || this.hasThrowAction) {
        this.el.classList.add("activeObjexRay");
      }
      
    

    } else {
      this.el.classList.add("activeObjexRay");
    }
    if (this.data.removeAfter != "") { //cleanup if timeout set
      setTimeout( () => { 
        // this.el.visible = false;
        let trailComponent = this.el.components.trail;
        if (trailComponent) {
          trailComponent.kill();
          // this.el.removeAttribute("trail");
        }
        // this.sceneEl.remove(this.el.object3D); 
        // this.el.removeAttribute("trail"); //WHY WON'T YOU DIE
        if (this.el != null && this.el.parentNode != null) {
          this.el.parentNode.removeChild(this.el);
        }
        
      }, 5000);
    }

    let that = this;


    this.el.addEventListener('model-loaded', () => {

      console.log(this.data.objectData.name + " OBJMODEL LOAADIDE!!!" + JSON.stringify(this.data.locationData));
      
      let pos = {};
      pos.x = this.data.locationData.x;
      pos.y = this.data.locationData.y;          
      pos.z = this.data.locationData.z;
      let rot = {};
      rot.x = this.data.locationData.eulerx != undefined ? this.data.locationData.eulerx : 0;
      rot.y = this.data.locationData.eulery != undefined ? this.data.locationData.eulery : 0;
      rot.z = this.data.locationData.eulerz != undefined ? this.data.locationData.eulerz : 0;
      let scale = {x: 1, y: 1, z: 1};
      if (this.data.locationData.markerObjScale != undefined && this.data.locationData.markerObjScale != null && this.data.locationData.markerObjScale != "" && this.data.locationData.markerObjScale != 0) {
      scale.x = this.data.locationData.markerObjScale != undefined ? this.data.locationData.markerObjScale : 1;
      scale.y = this.data.locationData.markerObjScale != undefined ? this.data.locationData.markerObjScale : 1;
      scale.z = this.data.locationData.markerObjScale != undefined ? this.data.locationData.markerObjScale : 1;
      } else if (this.data.objectData.objScale != undefined && this.data.objectData.objScale != null && this.data.objectData.objScale != "" && this.data.objectData.objScale != 0 ) {
        scale.x = this.data.objectData.objScale;
        scale.y = this.data.objectData.objScale;
        scale.z = this.data.objectData.objScale;
      } else {
        this.data.objectData.objScale = 1;
      }
 
      if (!this.data.isEquipped) {
        console.log("setting object pos/rot to " + JSON.stringify(rot));
        if (this.modelParent != null) {
          console.log("not equipped, has modelparent ");
          this.modelParent.setAttribute("position", pos);
          this.modelParent.setAttribute("rotation", rot);
        } else {
            // console.log("not equipped, no modelparent " + JSON.stringify(rot));
            this.el.setAttribute("scale", scale);
            // this.el.object3D.position = pos;
            // this.el.object3D.rotation = rot;
          if (!this.hasShootAction) {
            this.el.setAttribute("position", pos);
          }
          
          // that.el.setAttribute("rotation", rot);
          this.el.object3D.rotation.set(
            THREE.Math.degToRad(rot.x),
            THREE.Math.degToRad(rot.y),
            THREE.Math.degToRad(rot.z)
          );
        }
      
      } else { //if we're equipped
        // this.el.setAttribute("rotation", rot);
        this.el.object3D.rotation.set(
          THREE.Math.degToRad(rot.x),
          THREE.Math.degToRad(rot.y),
          THREE.Math.degToRad(rot.z)
        );
        // this.el.object3D.rotation = rot;
        this.el.setAttribute('material', {opacity: 0.25, transparent: true});
     
          
        this.el.setAttribute("scale", scale);
       
        // this.lineEl = document.createElement("a-entity");
        // this.el.sceneEl.appendChild(this.lineEl);
        // this.lineEl.setAttribute("mod_line", {"init": true});
        // this.lineEl.setAttribute("position", pos);
        if (this.hasTriggerAction) {
          this.el.setAttribute("mod_line", {"init": true});
        }

       


      }
      if (this.data.followPathNewObject) {
        this.moveOnCurve(); //todo fix quats!
      }
      if (this.data.objectData.physics != undefined && this.data.objectData.physics != null && this.data.objectData.physics.toLowerCase() != "none") {
        //  setTimeout(function(){  
          if (this.data.isEquipped) {
            // this.el.setAttribute('ammo-body', {type: 'kinematic', linearDamping: .1, angularDamping: .1});
          } else { //nm, switch to dynamic when fired if needed/
            if (this.hasShootAction) {
              // this.el.setAttribute('ammo-body', {type: this.data.objectData.physics.toLowerCase(), gravity: '0 -.1 0', angularFactor: '1 0 1', emitCollisionEvents: true, linearDamping: .1, angularDamping: 1}); //nope, shoot is not physical now
              this.el.setAttribute('ammo-body', {type: 'kinematic', emitCollisionEvents: true});
              this.el.setAttribute('trail', "");
            } else if (this.hasThrowAction) {
                this.el.setAttribute('ammo-body', {type: this.data.objectData.physics.toLowerCase(), emitCollisionEvents: true, linearDamping: .1, angularDamping: 1});
                // this.el.setAttribute('rotate-toward-velocity');
                // this.el.setAttribute('trail', "");
                this.el.setAttribute('trail', "");
            } else {
              this.el.setAttribute('ammo-body', {type: this.data.objectData.physics.toLowerCase(), emitCollisionEvents: true});
            }
          }
      }
      if (this.loadAction != null) {
        if (this.loadAction.actionResult.toLowerCase() == "trigger fx") {
          let particleSpawner = document.getElementById('particleSpawner');
          if (particleSpawner != null) {
            var worldPosition = new THREE.Vector3();
            this.el.object3D.getWorldPosition(worldPosition);
            if (this.data.objectData.yPosFudge != null && this.data.objectData.yPosFudge != "") {
              worldPosition.y += this.data.objectData.yPosFudge;
            }
            console.log("triggering fx at " + JSON.stringify(worldPosition) + " plus" + this.data.objectData.yPosFudge);
            particleSpawner.components.particle_spawner.spawnParticles(worldPosition, this.data.objectData.particles, 5, this.el.id, this.data.objectData.yPosFudge, this.data.objectData.color1, this.data.objectData.triggerScale);
          }
        }


      }
      // this.el.setAttribute("aabb-collider", {objects: ".activeObjexRay"});


      // // if (!this.isInitialized) {
      //   if (this.data.eventData.includes("scatter")) {
      //     // this.el.object3D.visible = false;
      //     console.log("GOTSA SCATTER OBJEK@");
      //   }
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
           
            // this.recursivelySetChildrenShader(obj);

          }
          // let dynSkybox = document.getElementById('')
          // for (let e = 0; e < textData.length; e++) {
          //   if (textData[e].toLowerCase().includes("refract")){
          //     console.log("tryna set refraction");
          //     obj.material.refractionRatio = .9;
          //     obj.material.reflectivity = .5;
          //   }
          // }

          if (this.data.eventData.toLowerCase().includes("ar_target")) {
            this.el.id = "ar_target_object";
          }
          if (this.data.eventData.toLowerCase().includes("transparent")) {
            console.log("tryna set transparent");
            obj.visible = false;
          }
          if (this.data.eventData.toLowerCase().includes("particle")) {
            console.log("tryna spawn a particle!");

            this.el.setAttribute('mod_particles', {type: 'fireball'});
         
          }
          if (this.data.eventData.toLowerCase().includes("fireworks")) {
            console.log("tryna spawn fireworks!");

            this.el.setAttribute('fireworks_spawner', {type: 'fireball'});
         
          }
          if (this.data.eventData.toLowerCase().includes("audiotrigger")) {
            // console.log("gotsa audiotrigg3re!");

            // this.el.setAttribute('fireworks_spawner', {type: 'fireball'});
            this.hasAudioTrigger = true;
          }
          

          let worldPos = null;
          let hasAnims = false;
          let hasPicPositions = false;
          let hasVidPositions = false;
          let hasAudioPositions = false;
          camera = AFRAME.scenes[0].camera; 
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
              if (clips[i].name.toLowerCase().includes("mixamo")) {
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
                      "clip": clips[0].name,
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
           
            if (this.data.eventData.includes("eyelook") && this.nodeName.includes("eye")) { //must be set in the data and as a name on the model
              if (node instanceof THREE.Mesh) {
              this.meshChildren.push(node);
              console.log("gotsa eye!");
              }
            }
           
          });
          
          for (i = 0; i < this.meshChildren.length; i++) { //apply mods to the special things
            console.log("gotsa special !! meshChild " + this.meshChildren[i].name);
            if (this.meshChildren[i].name.includes("trigger")) { 
              //ugh, nm
                let child = this.el.object3D.getObjectByName(this.meshChildren[i].name, true);
                child.visible = false;

                // let triggerEl = document.createElement('a-entity');
                // var targetPos = new THREE.Vector3();
                // child.getWorldPosition(targetPos);
                // this.child = child.clone();
                // triggerEl.setObject3D("mesh", this.child);
                // // let child = this.child.clone();
                // // this.child.position(targetPos);
                // // triggerEl.setObject3D("mesh", child.clone());
                // // triggerEl.setObject3D("mesh", child);
                // child.remove();
                // // triggerEl.setAttribute('geometry', {primitive: 'box', width: 1});
                // triggerEl.setAttribute('position', targetPos);
                // console.log("gotsa special teryna set a trigger mesh..");
                // triggerEl.setAttribute('mod_physics', {eventData: this.data.eventData, tags: this.data.tags, isTrigger: true});
                // // triggerEl.classList.add('activeObjexRay');
                // triggerEl.id = "TRIGGGER";
                // this.sceneEl.appendChild(triggerEl);
                
                // triggerEl.classList.add('trigger');
            }
              if (this.meshChildren[i].name.includes("eye")) {
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
                this.calloutString = this.meshChildren[i].name.split("_")[0];
                console.log("callout string is " + this.meshChildren[i].name);

                // calloutChild.addEventListener('model-loaded', () => {
                  // console.log("callout! " +callout);
                  calloutChild.setAttribute("model-callout", this.calloutString);

                this.el.appendChild(calloutChild);

              }
            }
          }
      
          // if (this.el.classList.contains('target') || this.data.markerType != "none") {

          // let hasBubble = false;
          // let theEl = this.element;
          this.el.setAttribute('gesture-handler-add'); //ar mode only?
          var sceneEl = document.querySelector('a-scene');
          let hasCallout = false;
          let calloutOn = false;

          /// SHOULD INSTEAD LOOK AT THE OBJECT TEXT PROPS?!?
          // if (this.tags != null && this.tags.includes("thoughtbubble") && !this.data.eventData.toLowerCase().includes("undefined") && this.data.eventData.toLowerCase().includes("main") && this.data.eventData.toLowerCase().includes("text")) {
          if (this.data.eventData.toLowerCase().includes("main") && this.data.eventData.toLowerCase().includes("text")) {
            document.getElementById("mainTextToggle").setAttribute("visible", false);
            this.data.eventData = document.getElementById("mainText").getAttribute("main-text-control", "mainTextString"); 
            console.log("target eventData : "+ JSON.stringify(this.data.eventData));
            this.textData = this.data.eventData.mainTextString.split("~");
          } else {
            // this.textData = 
          }

          if (this.tags != null && this.tags.includes("thoughtbubble")) {

          
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
            bubble.setAttribute("scale", "2 2 2"); 
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

            
            let bubbleText = document.createElement("a-entity");
            this.bubbleText = bubbleText;
            bubbleText.classList.add("bubbleText");
            // bubbleText.setAttribute("visible", false);
            bubbleText.setAttribute("position", "0 0 1.1");
            bubbleText.setAttribute("scale", ".1 .1 .1"); 
            bubbleText.setAttribute("look-at", "#player");
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
            // }
          }

          let primaryAudio = document.getElementById("primaryAudio");
          if (primaryAudio != null) {
            const primaryAudioControlParams = primaryAudio.getAttribute('primary_audio_control');

        
            if (primaryAudioControlParams.targetattach) { //set by sceneAttachPrimaryAudioToTarget or something like that...
              console.log("tryna target attach primary audio " + primaryAudioControlParams.targetattach);

            document.getElementById("primaryAudioParent").setAttribute("visible", false);
            // document.getElementById("primaryAudioParent").setAttribute("position", theEl.position);
            primaryAudio.emit('targetattach', {targetEntity: this.el}, true);
            primaryAudioHowl.pos(this.el.object3D.position.x, this.el.object3D.position.y, this.el.object3D.position.z);
            
            this.el.addEventListener('click', function () {

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
                    theEl.addEventListener('animation-finished', function () { 
                      theEl.removeAttribute('animation-mixer');
                    });
                  }
                } else {
                      primaryAudioHowl.pause();
                      console.log('...tryna pause...');
                  }
              });        
            }
          } 
          


        }
    }); //end model-loaded listener

    this.el.addEventListener('body-loaded', () => {  //body-loaded event = physics ready on obj
      this.el.setAttribute('ammo-shape', {type: that.data.objectData.collidertype.toLowerCase()});
      // console.log("ammo shape is " + JSON.stringify(that.el.getAttribute('ammo-shape')));
      if (this.data.applyForceToNewObject) {
        // this.el.setAttribute("aabb-collider", {objects: ".activeObjexRay"});
        this.applyForce();
      }

      this.el.addEventListener("collidestart", (e) => {
        e.preventDefault();
        let mod_obj_component = e.detail.targetEl.components.mod_object;
        // console.log("mod_physics collisoin with object with :" + this.el.id + " " + e.detail.targetEl.classList);
        if (this.data.isTrigger) { //
          console.log("TRIGGER HIT "  + this.el.id + " " + e.detail.targetEl.classList);
          // e.detail.body.disableCollision = true;
          this.disableCollisionTemp(); //must turn it off or it blocks, no true "trigger" mode afaik (unlike cannonjs!) //um, no just use kinematic type...
          var triggerAudioController = document.getElementById("triggerAudio");
          if (triggerAudioController != null) {
            triggerAudioController.components.trigger_audio_control.playAudioAtPosition(this.hitpoint, this.distance, ["hit"]);
          }
        } else {
          console.log("COLLIDER HIT "  + this.el.id + " vs " + e.detail.targetEl.id);
          // console.log("NOT TRIGGER COLLIDED "  + this.el.object3D.name + " " + e.detail.targetEl.object3D.name + " has mod_object " + mod_obj_component);
          // if (this.el != e.detail.targetEl) {
            
            if (mod_obj_component != null) {
              console.log(this.data.objectData.name + "gotsa collision with " + mod_obj_component.data.objectData.name);
              if (this.data.objectData.name != mod_obj_component.data.objectData.name) { //don't trigger yerself, but what if...?
                console.log("actions: " + JSON.stringify(mod_obj_component.data.objectData.actions));
                var triggerAudioController = document.getElementById("triggerAudio");
                if (triggerAudioController != null) {
                  triggerAudioController.components.trigger_audio_control.playAudioAtPosition(this.el.object3D.position, window.playerPosition.distanceTo(this.el.object3D.position), ["hit, bounce"]);
                }
                if (mod_obj_component.data.objectData.actions) {
                  for (let i = 0; i < mod_obj_component.data.objectData.actions.length; i++) {
                    if (mod_obj_component.data.objectData.actions[i].actionType.toLowerCase() == "collide") {
                      if (mod_obj_component.data.objectData.actions[i].sourceObjectMod.toLowerCase() == "remove") {
                        let trailComponent = e.detail.targetEl.components.trail;
                        if (trailComponent) {
                          trailComponent.reset();
                        }
                        if (e.detail.targetEl.parentNode) {
                          e.detail.targetEl.parentNode.removeChild(e.detail.targetEl);
                        }
                        // e.detail.targetEl.parentNode.removeChild(e.detail.targetEl);

                      }
                      if (mod_obj_component.data.objectData.actions[i].sourceObjectMod.toLowerCase() == "replace object") {
                        // console.log("tryna replace object...");
                        let trailComponent = e.detail.targetEl.components.trail;
                        if (trailComponent) {
                          trailComponent.kill();
                          // e.detail.targetEl.removeAttribute("trail");
                        }
                        if (e.detail.targetEl.parentNode) {
                          e.detail.targetEl.parentNode.removeChild(e.detail.targetEl);
                        }
                        // e.detail.targetEl.parentNode.removeChild(e.detail.targetEl);
                        let objexEl = document.getElementById('sceneObjects');    
                        let objectData = objexEl.components.mod_objex.returnObjectData(mod_obj_component.data.objectData.actions[i].objectID);
                        // if (objectData == null) {

                        //   // objectData = objexEl.components.mod_objex.returnObjectData(mod_obj_component.data.objectData.actions[i].objectID); //try again, if it's not in the sceneobjectdata it will make a special request
                        // }
                        if (objectData != null) {
                          console.log("tryna replace object with " + JSON.stringify(objectData));
                          // this.objectData = this.returnObjectData(mod_obj_component.data.objectData.actions[i].objectID);

                          // this.dropPos = new THREE.Vector3();
                          this.objEl = document.createElement("a-entity");

                          this.locData = {};
                          this.locData.x = this.el.object3D.position.x;
                          this.locData.y = this.el.object3D.position.y;
                          this.locData.z = this.el.object3D.position.z;
                          this.locData.timestamp = Date.now();
                          this.objEl.setAttribute("mod_object", {'locationData': this.locData, 'objectData': objectData});
                          this.objEl.id = "obj" + objectData._id + "_" + this.locData.timestamp;
                          sceneEl.appendChild(this.objEl);
                        } else {
                          console.log("caint find object "+ mod_obj_component.data.objectData.actions[i].objectID +", tryna fetch it..");
                          FetchSceneInventoryObject(mod_obj_component.data.objectData.actions[i].objectID);
                        }
                      } 
                    }
                  }
                }
              }
            }
            if (this.hasShootAction && e.detail.targetEl.id != "player") {
              console.log("tryna cleanup!")
              this.el.sceneEl.object3D.remove(this.line);
             
              let trailComponent = this.el.components.trail;
              if (trailComponent) {
                trailComponent.kill();
                // this.el.removeAttribute("trail");
              }
              // if (this.el.parentNode) {
              //   this.el.parentNode.removeChild(this.el);
              // } else {
              //   let me = this.el.id;
              //   document.getElementById(me).remove();
              // }
              
            }
          // }
        }
      });
    
    }); //end body-loaded listener



    this.el.addEventListener('raycaster-intersected', e =>{  
        this.raycaster_e = e.detail.el;
        // that.raycaster = this.raycaster;
        this.intersection = this.raycaster_e.components.raycaster.getIntersection(this.el, true);
        this.hitpoint = this.intersection.point;
        that.hitpoint = this.hitpoint;
        console.log(that.data.objectData.name + " with tags " + this.tags);
       
    });
    this.el.addEventListener("raycaster-intersected-cleared", () => {
        // console.log("intersection cleared");
        that.mouseOverObject = null;
        this.raycaster_e = null;
        this.hitpoint = null;
        that.hitpoint = null;
        this.playerPosRot = null; 
        that.playerPosRot = null;

    });

    this.el.addEventListener('mouseenter', (evt) => {
      evt.preventDefault();
      if (!this.data.isEquipped) {
        if (posRotReader != null) {
          this.playerPosRot = posRotReader.returnPosRot(); 
          window.playerPosition = this.playerPosRot.pos; 
        } else {
          posRotReader = document.getElementById("player").components.get_pos_rot; 
          this.playerPosRot = posRotReader.returnPosRot(); 
          window.playerPosition = this.playerPosRot.pos; 
        }
        // console.log(window.playerPosition);
        if (!this.isSelected && evt.detail.intersection != null) {
          this.clientX = evt.clientX;
          this.clientY = evt.clientY;
          console.log("tryna mouseover " + this.data.objectData.name);
          // that.calloutToggle = !that.calloutToggle;

          this.pos = evt.detail.intersection.point; //hitpoint on model
          let name = evt.detail.intersection.object.name;
          this.hitPosition = this.pos;
          // if (player != null && window.playerPosition != undefined) {
          this.distance = window.playerPosition.distanceTo(this.hitPosition);
          // console.log("distance  " + this.distance);
          this.rayhit(evt.detail.intersection.object.name, this.distance, evt.detail.intersection.point);

            this.selectedAxis = name;
          ////////TODO - wire in to Hightlight Options / Callout Options in Object view
          if (this.tags != null && this.tags.includes("thoughtbubble")) {
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
              // this.bubbleBackground.setAttribute('scale', {x: this.distance * -.25, y: this.distance * .25, z: this.distance * .25} );
              this.bubbleText.setAttribute("scale", ".2 .2 .2"); 
              this.bubbleText.setAttribute("position", ".5 .2 .55");
            } 
            if ((pos.x/width) > .55) {
              console.log("flip right");
              this.bubbleBackground.setAttribute("position", "-.5 .2 .5");
              this.bubbleBackground.setAttribute("scale", ".2 .2 .2"); 
              // this.bubbleBackground.setAttribute('scale', {x: this.distance * -.25, y: this.distance * .25, z: this.distance * .25} );
              this.bubbleText.setAttribute("scale", ".2 .2 .2")
              this.bubbleText.setAttribute("position", "-.5 .2 .55");
            }
            let font = "Acme.woff";
            if (settings && settings.sceneFontWeb2 && settings.sceneFontWeb2.length) {
              font = settings.sceneFontWeb2;
            }
            this.bubbleText.setAttribute('troika-text', {
              baseline: "bottom",
              align: "center",
              font: "/fonts/web/" + font,
              fontSize: .2,
              anchor: "center",
              wrapCount: 20,
              color: "black",
              value: this.textData[this.textIndex]

            });

            if (this.textIndex < this.textData.length - 1) {
              this.textIndex++;
            } else {
              this.textIndex = 0;
            }
          } else { //"normal" callout 
            // document.getElementById("player").component.get_pos_rot.returnPosRot();
            // this.clientX = evt.clientX;
            // this.clientY = evt.clientY;
            // console.log("tryna callout " + this.calloutEntity.id);
            // // that.calloutToggle = !that.calloutToggle;

            // this.pos = evt.detail.intersection.point; //hitpoint on model
            // let name = evt.detail.intersection.object.name;
            // this.hitPosition = this.pos;
            // // if (player != null && window.playerPosition != undefined) {
            // this.distance = window.playerPosition.distanceTo(this.hitPosition);
            // // console.log("distance  " + this.distance);
            // this.rayhit(evt.detail.intersection.object.name, this.distance, evt.detail.intersection.point);

            //   this.selectedAxis = name;

            // let elPos = this.el.getAttribute('position');
            if (this.calloutEntity != null && this.distance < 20) {
              this.calloutEntity.setAttribute('visible', false);
              console.log("trna scale to distance :" + this.distance);
              this.calloutEntity.setAttribute("position", this.pos);
              this.calloutEntity.setAttribute('visible', true);
              this.calloutEntity.setAttribute('scale', {x: this.distance * .25, y: this.distance * .25, z: this.distance * .25} );
              let theLabel = this.data.objectData.labeltext;
              let calloutString = theLabel;
              if (this.calloutLabelSplit.length > 0) {
                if (this.calloutLabelIndex < this.calloutLabelSplit.length - 1) {
                  this.calloutLabelIndex++;
                } else {
                  this.calloutLabelIndex = 0;
                }
                calloutString = this.calloutLabelSplit[this.calloutLabelIndex];
              }

            this.calloutText.setAttribute("troika-text", {value: calloutString});
            }

            if (this.hasHighlightAction) {

            }
          }

          if (this.tags != undefined && this.tags != null && this.tags != "undefined") { //MAYBE SHOULD BE UNDER RAYHIT?
            console.log("tryna play audio with tags " + this.tags);
            // if (this.triggerAudioController != null) {
              // let distance = window.playerPosition.distanceTo(this.hitpoint);
              // this.triggerAudioController.components.trigger_audio_control.playAudioAtPosition(evt.detail.intersection.point, distance, this.tags, 1);//tagmangler needs an array, add vol mod 
              // this.triggerAudioController.components.trigger_audio_control.playAudioAtPosition(this.pos, this.distance, this.tags, 1);
              if (moIndex != -1) { //moIndex = "mouthopen"
                this.el.setAttribute('animation-mixer', {
                  "clip": clips[moIndex].name,
                  "loop": "repeat",
                  "repetitions": 10,
                  "timeScale": 2
                });
                this.el.addEventListener('animation-finished', (e) => { 
                  this.el.removeAttribute('animation-mixer');
                });
              }
            // }
          }
        }     
      }
      
    });
    
    this.el.addEventListener('mouseleave', (e) => { 
      e.preventDefault();
      // console.log("tryna mouseexit");
      if (!this.data.isEquipped) {
        if (this.calloutEntity != null) {
          this.calloutEntity.setAttribute('visible', false);
        }
        this.bubble = sceneEl.querySelector('.bubble');
        if (this.bubble) {
          this.bubble.setAttribute('visible', false);
        }
      }
    });
   


    this.el.addEventListener('click', (e) => { 
      e.preventDefault();
      // let downtime = (Date.now() / 1000) - this.mouseDownStarttime;
      // console.log("mousedown time "+ this.mouseDowntime + "  on object type: " + this.data.objectData.objtype + " actions " + JSON.stringify(this.data.objectData.actions) + " equipped " + this.data.isEquipped);
      if (!this.data.isEquipped) {
        this.dialogEl = document.getElementById('mod_dialog');
        
        if (this.data.objectData.objtype.toLowerCase() == "pickup" || this.hasPickupAction) {
          // this.el.setAttribute('visible', false);
          if (this.data.objectData.prompttext != undefined && this.data.objectData.prompttext != null && this.data.objectData.prompttext != "") {
            if (this.data.objectData.prompttext.includes('~')) {
              this.promptSplit = this.data.objectData.prompttext.split('~'); 
            }
            // this.el.components.mod_synth.medTrigger();
            this.dialogEl.components.mod_dialog.showPanel("Pick up " + this.data.objectData.name + "?\n\n" + this.promptSplit[Math.floor(Math.random()*this.promptSplit.length)], this.el.id );
          } else {
            this.dialogEl.components.mod_dialog.showPanel("Pick up " + this.data.objectData.name + "?", this.el.id );
          }
          
        }
        if (this.selectAction) {
          console.log("select action " + JSON.stringify(this.selectAction));
          if (this.selectAction.actionResult.toLowerCase() == "trigger fx") {
            if (!this.isTriggered) {
              // var worldPosition = new THREE.Vector3();
              // this.el.object3D.getWorldPosition(worldPosition);
              this.isTriggered = true;
              let particleSpawner = document.getElementById('particleSpawner');
              if (particleSpawner != null) {
                var worldPosition = new THREE.Vector3();
                this.el.object3D.getWorldPosition(worldPosition);
                if (this.data.objectData.yPosFudge != null && this.data.objectData.yPosFudge != "") {
                  worldPosition.y += this.data.objectData.yPosFudge;
                }
                console.log("triggering fx at " + JSON.stringify(worldPosition) + " plus" + this.data.objectData.yPosFudge);
                particleSpawner.components.particle_spawner.spawnParticles(worldPosition, this.data.objectData.particles, 5, null, this.data.objectData.yPosFudge, this.data.objectData.color1, this.data.objectData.triggerScale);
              }
            } else {
              console.log("already triggered - make it a toggle!");
            }
          }
        }
      } else { //if equipped
        if (this.hasThrowAction) {
          console.log("throw action " + JSON.stringify(this.throwAction));
          if (this.throwAction.sourceObjectMod.toLowerCase() == "persist") { //transfer to scene inventory
            this.el.object3D.visible = false;
            DropInventoryItem(this.data.objectData._id); //just drop for now...throw/shoot/swing next!
            setTimeout(() => {
              this.el.object3D.visible = true;
            }, 3000);
          } else if (this.throwAction.sourceObjectMod.toLowerCase() == "remove") {
            if (this.mouseDowntime <= 0) {
              this.mouseDowntime = 1;
            }
            this.objexEl.components.mod_objex.throwObject(this.data.objectData._id, this.mouseDowntime, "5");
          }
          if (this.triggerAudioController != null) {
            this.triggerAudioController.components.trigger_audio_control.playAudioAtPosition(this.hitpoint, this.distance, ["throw"], .5);//tagmangler needs an array
          }
        }
        if (this.hasShootAction) {
          console.log("shoot action " + JSON.stringify(this.shootAction));
          // if (this.shootAction.sourceObjectMod.toLowerCase() == "persist") { //transfer to scene inventory
          //   this.el.object3D.visible = false;
          //   DropInventoryItem(this.data.objectData._id); //just drop for now...throw/shoot/swing next!
          //   setTimeout(() => {
          //     this.el.object3D.visible = true;
          //   }, 3000);
          // } else if (this.throwAction.sourceObjectMod.toLowerCase() == "remove") {
          //   if (this.mouseDowntime <= 0) {
          //     this.mouseDowntime = 1;
          //   }
          //   this.objexEl.components.mod_objex.shootObject(this.data.objectData._id, this.mouseDowntime, "5");
          // }
          if (this.triggerAudioController != null) {
            this.triggerAudioController.components.trigger_audio_control.playAudioAtPosition(this.hitpoint, this.distance, ["shoot"], .5);//tagmangler needs an array, add vol mod 
          }
          this.el.object3D.visible = false;
          this.el.classList.remove("activeObjexRay");
          setTimeout(() => {
            this.el.object3D.visible = true;
            this.el.classList.add("activeObjexRay");
          }, 3000);
          this.objexEl.components.mod_objex.shootObject(this.data.objectData._id);
          // this.applyForce();
          
        } 
        if (this.hasTriggerAction) {

        }
        if (this.selectAction) {
          console.log("select action " + JSON.stringify(this.selectAction));
          if (this.selectAction.actionResult.toLowerCase() == "trigger fx") { //e.g. light a torch
            if (!this.isTriggered) {
              this.isTriggered = true;
              let particleSpawner = document.getElementById('particleSpawner');
              if (particleSpawner != null) {
                this.loc = this.el.getAttribute('position');
                if (this.data.objectData.yPosFudge != null && this.data.objectData.yPosFudge != "") {
                  var worldPosition = new THREE.Vector3();
                  this.el.object3D.getWorldPosition(worldPosition);
                  console.log("this.loc.y " + worldPosition + " plus" + this.data.objectData.yPosFudge);
                  worldPosition.y += this.data.objectData.yPosFudge;
                }
                let particle_spawner = particleSpawner.components.particle_spawner;
                if (particle_spawner != null) {
                  particleSpawner.components.particle_spawner.spawnParticles(worldPosition, this.data.objectData.particles, 5, this.el.id, this.data.objectData.yPosFudge, this.data.objectData.color1, this.data.objectData.triggerScale);
                }
                
              }
            } else {
              console.log("already triggered - make it a toggle!");
            }
          }
        }       
      }

    });
  },
  equippedRayHit: function (hitpoint) { //nope, just added to mod_object if it's equipped and stuff
    console.log( "equippedRayHit@!");
    if (this.data.isEquipped) {

      // let tG = new THREE.BufferGeometry().setFromPoints([
      //   new THREE.Vector3(),
      //   new THREE.Vector3()
      // ]);
      // let tM = new THREE.LineBasicMaterial({color: "yellow"});
      // this.beam = new THREE.Line(tG, tM);
      // this.el.sceneEl.object3D.add(this.beam);
      // this.el.sceneEl.object3D.add(this.endMesh);
          //  this.beam.updateMatrixWorld();
            // this.endMesh.position = hitpoint.clone();
            // this.el.object3D.getWorldPosition(this.startPoint);
            // // this.endPoint = hitpoint;

            //   this.distance = this.startPoint.distanceTo(hitpoint);
            //   this.tempVector.subVectors(hitpoint, this.startPoint).normalize().multiplyScalar(this.distance).add(this.startPoint);
            //   console.log("tryna make a beam from " + JSON.stringify(hitpoint) +" distance " + this.distance);
            //   // let d = oP.distanceTo(tP);
            
            // // tV.subVectors(tP, oP).normalize().multiplyScalar(d + 10).add(oP);
            // // this.endMesh.position.copy(this.endPoint)
            // this.beam.geometry.attributes.position.setXYZ(0, this.startPoint.x, this.startPoint.y, this.startPoint.z);
            // this.beam.geometry.attributes.position.setXYZ(1, this.tempVector.x, this.tempVector.y, this.tempVector.z).negate();
            // //  this.beam.geometry.attributes.position.setXYZ(1, hitpoint.x, hitpoint.y, hitpoint.z);
            // this.beam.geometry.attributes.position.needsUpdate = true;
     // this.el.object3D.lookAt(hitpoint);


      // this.el.object3D.getWorldPosition(this.positionMe);  //actually it's id "playCaster"
      // this.el.object3D.getWorldDirection(this.directionMe).negate();
      // this.positionMe.normalize();
      // this.positionMe.negate();

     // console.log("setting thirrd person raycaster! from " + JSON.stringify(this.thirdPersonPlaceholderPosition) + " to " + JSON.stringify(this.thirdPersonPlaceholderDirection));
    //  this.raycaster.set(this.positionMe, this.directionMe);
    //  this.raycaster.far = 50;
     // raycaster.far = 1.5;
    
    //  this.intersection = this.raycaster.intersectObject( this.iMesh );


    }
  },

  rayhit: function (hitID, distance, hitpoint) { //also called on collisionstart event
      // if (this.hitID != hitID) {
      //   this.hitID = hitID;
      // console.log("new hit " + hitID + " " + distance + " " + JSON.stringify(hitpoint));
      // distance = window.playerPosition.distanceTo(hitpoint);
      console.log("new hit " + hitID + " distance: " + distance + " " + JSON.stringify(hitpoint) + " tags " +  this.tags);
      // var triggerAudioController = document.getElementById("triggerAudio");
      if (this.triggerAudioController != null && !this.data.isEquipped && this.tags) {
        this.triggerAudioController.components.trigger_audio_control.playAudioAtPosition(hitpoint, distance, this.tags);
      }

      if (this.hasSynth) {
        if (this.el.components.mod_synth != null && this.data.objectData.tonejsPatch1 != undefined && this.data.objectData.tonejsPatch1 != null) {
          // this.el.components.mod_synth.trigger(distance);
          if (this.data.objectData.tonejsPatch1 == "Metal") {
            this.el.components.mod_synth.metalHitDistance(distance);
          } else if (this.data.objectData.tonejsPatch1 == "AM Synth") {
            this.el.components.mod_synth.amHitDistance(distance);
          }
          
        }
      }
      // } else {
      //   console.log("no synth");
      // }
  },

  activated: function () {
   
    console.log("this.isActivated " + this.isActivated + " + hasPickupAction " + this.hasPickupAction + " for " + this.el.id);
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
        data.sceneID = settings._id;
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
    // this.el.removeAttribute('trail');
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
  moveOnCurve: function () {
    console.log("tryna followPath!");

    this.points = [];
    this.tempVectorP = new THREE.Vector3();
    this.tempVectorR = new THREE.Vector3();

    // this.playerEl = document.getElementById("player");
    // this.tempVectorR = new THREE.Quaternion();
    this.pVec = new THREE.Vector3();
    this.equipHolder.object3D.getWorldPosition(this.tempVectorP);
    this.equipHolder.object3D.getWorldDirection(this.tempVectorR);
    
    this.el.object3D.position.copy(this.equipHolder.object3D.position);
    this.el.object3D.quaternion.copy(this.equipHolder.object3D.quaternion);

    this.tempVectorR.normalize();
    this.tempVectorR.negate();

    for (var i = 0; i < 5; i += 1) {  
      let distance = parseInt(i) * 20;
      // this.pVec = new THREE.Vector3().copy.addVectors(this.tempVectorP, this.tempVectorR.multiplyScalar( distance ));
      console.log("pushed " + distance + " " + JSON.stringify(this.pVec));
      this.pVec = new THREE.Vector3().copy( this.tempVectorP ).addScaledVector( this.tempVectorR, distance ); //oik then
      this.points.push(this.pVec);
      // console.log("pushed " + distance + " " + JSON.stringify(this.pVec));
    //  this.points.push(new THREE.Vector3(this.tempVectorP.x, this.tempVectorP.y, this.tempVectorP.z + 1000 * (i / 4)));
    //  this.points.push(new THREE.Vector3(this.tempVectorP.x, this.tempVectorP.y, this.tempVectorP.z).normalize().multiplyScalar(i * 20));
    }
    this.curve = new THREE.CatmullRomCurve3(this.points);
      // box.position.copy( spline.getPointAt( counter ) );
        // tangent = spline.getTangentAt( counter ).normalize();
        // axis.crossVectors( up, tangent ).normalize();
        // var radians = Math.acos( up.dot( tangent ) );
        // box.quaternion.setFromAxisAngle( axis, radians );
    this.material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    // this.material = new THREE.LineBasicMaterial( {
    //   color: 0xffffff,
    //   linewidth: 15, // in world units with size attenuation, pixels otherwise
    //   vertexColors: true,

    //   //resolution:  // to be set by renderer, eventually
    //   dashed: false,
    //   alphaToCoverage: true,
    // } );
    this.geometry = new THREE.BufferGeometry().setFromPoints( this.points );
    this.line = new THREE.Line( this.geometry, this.material );
    this.el.sceneEl.object3D.add( this.line );
    this.followPath = true;
  },
  applyForce: function () {
    if (this.camera == null) {
      let cameraEl = document.querySelector('a-entity[camera]');
      if (!cameraEl) {
          cameraEl = document.querySelector('a-camera');
      }
      if (!cameraEl) {
        camaraEl = document.getElementById('player');
      } 
      if (cameraEl) {
        let theCamComponent = cameraEl.components.camera;
        if (theCamComponent != null) {
          this.camera = theCamComponent.camera;
        }
        // this.camera = cameraEl.components.camera.camera;
      }
    }  
    if (this.hasShootAction) { //this isn't phsyics now
        // // this.el.setAttribute()

        // this.dropPos = new THREE.Vector3();
        // this.dropRot = new THREE.Quaternion();
        // this.equipHolder = document.getElementById("equipPlaceholder");
        // // this.el.setAttribute('position', this.equipHolder.getAttribute("position"));
        // this.erot = this.equipHolder.getAttribute("rotation");

        // this.equippedObject = this.equipHolder.querySelector('.equipped');
        //   if (this.equippedObject != null) {
        //     this.equippedObject.object3D.getWorldPosition(this.dropPos);
        //     this.equippedObject.getWorldQuaternion(this.dropRot);
        //     this.camera.getWorldDirection( this.lookVector );
        //     console.log("ttryna match world rotations with " + JSON.stringify(this.dropRot));
        //   }

        //   // this.cameraQuat = new THREE.Quaternion();
        //   // this.camera.getWorldQuaternion(this.cameraQuat);
        //   // this.el.object3D.lookAt(this.lookVector);
        //   this.el.object3D.position = this.dropPos;
        //   // this.el.object3D.rotation = this.dropRot;
          
        //   // this.el.object3D.rotation.set(
        //   //   THREE.Math.degToRad(this.erot.x),
        //   //   THREE.Math.degToRad(this.erot.y),
        //   //   THREE.Math.degToRad(this.erot.z)
        //   // );
        //   // this.el.object3D.lookAt(this.lookVector);

        //   // this.el.object3D.matrix.setRotationFromQuaternion( -this.dropRot );
        //   // this.el.object3D.updateMatrix();


      }
    console.log("tryna apply force shoot action " + this.hasShootAction + " " + this.camera);
    this.pushForward = true;
    setTimeout(() => {
      this.pushForward = false;
    }, 100);
  },
  tick: function () {
    
    if (this.pushForward && this.camera != null) {
      // console.log("tryna apply force shoot action " + this.hasShootAction);
      // this.lookVector.applyQuaternion(this.camera.quaternion);
      if (this.hasThrowAction) {
        if (mouseDowntime != 0) {
          this.data.forceFactor = mouseDowntime;
        } else {
          this.data.forceFactor = 2;
        }
        this.camera.getWorldDirection( this.lookVector );
        // console.log("tryna pushForward@! " + this.data.forceFactor);
        // const velocity = new Ammo.btVector3(2, 1, 0);
        const velocity = new Ammo.btVector3(this.lookVector.x * 10 * this.data.forceFactor, (this.lookVector.y + .5) * 10 * this.data.forceFactor, this.lookVector.z * 10 * this.data.forceFactor);
        this.el.body.setLinearVelocity(velocity);
        Ammo.destroy(velocity);
      } else if (this.hasShootAction) {
        this.data.forceFactor = 6; 
        // this.equipHolder = document.getElementById("equipPlaceholder");
        // this.equipHolder.object3D.getWorldPosition( this.dropPos );
        this.camera.getWorldDirection( this.lookVector );
        // console.log("tryna pushForward@! " + this.data.forceFactor);
        // const velocity = new Ammo.btVector3(2, 1, 0);
        this.el.object3D.lookAt(this.lookVector);
        // this.el.object3D.rotation = this.lookVector;
        // const pos = new Ammo.btVector3(this.dropPos.x, this.dropPos.y, this.dropPos.z);
        const velocity = new Ammo.btVector3(this.lookVector.x * 10 * this.data.forceFactor, this.lookVector.y * 10 * this.data.forceFactor, this.lookVector.z * 10 * this.data.forceFactor);
        this.el.body.setLinearVelocity(velocity);
        Ammo.destroy(velocity);

      }
     
      } else if (this.followPath && this.curve) {
        
        this.posIndex++;
        if (this.posIndex > 100) {
          // this.curve = null;
          // this.followPath = false;
          console.log("tryna cleanup!")
          this.el.sceneEl.object3D.remove(this.line);
         
          let trailComponent = this.el.components.trail;
          if (trailComponent) {
            trailComponent.kill();
            // this.el.removeAttribute("trail");
          }
          this.followPath = false;
          // this.el.parentNode.removeChild(this.el);
          this.el.removeAttribute("trail");
          this.el.sceneEl.object3D.remove(this.line);
        } else {
        this.currentPos = this.curve.getPoint(this.posIndex / 100);
        this.currentTan = this.curve.getTangent(this.posIndex / 100).normalize();
        // this.el.object3D.getWorldDirection(this.currentRot);
        // this.el.object3D.rotation.set(this.currentRot);
        // console.log("tryna set positionn to" + JSON.stringify(this.currentPos));
        this.el.object3D.position.copy(this.currentPos);

        this.el.object3D.lookAt(this.curve.getPoint(99/100).negate());

      } 
    }

    if (this.data.isEquipped) {
     
      this.equipHolder.object3D.getWorldPosition(this.positionMe);  //actually it's id "playCaster"
      this.equipHolder.object3D.getWorldDirection(this.directionMe).negate();
      // if (this.lineEl) {
      //   // this.lineEl.components.mod_line.updateCurve(this.positionMe, this.directionMe);
      // }
     
   
      if (this.equippedRaycaster != null) {

        // if (this.isTriggered) {
        //   this.el.components.mod_line.showLine(true);
        // }
          // if (this.arrow) { //show helper arrow, TODO toggle from dialogs.js
          //   this.el.sceneEl.object3D.remove(this.arrow);
          // }
          // this.arrow = new THREE.ArrowHelper( this.directionMe, this.positionMe, 10, 0xff0000 );
          // // this.arrow = new THREE.ArrowHelper( this.equippedRaycaster.components.raycaster.direction, this.equippedRaycaster.components.raycaster.origin, 10, 0xff0000 );
          // this.el.sceneEl.object3D.add( this.arrow );
      } 

      // if (this.lineGeometry && this.lineObject && this.lineStart) { //for testing
      //   this.lineEnd.copy( this.positionMe ).add( this.directionMe.multiplyScalar( 50 ) );
      //   this.lineMiddle.lerpVectors(this.lineStart, this.lineEnd, 0.5); //maybe don't need...
      //   // console.log(JSON.stringify(this.lineStart), JSON.stringify(this.lineMiddle), JSON.stringify(this.lineEnd));
      //   this.lineGeometry.setFromPoints([this.positionMe, this.lineEnd]);
      //   this.lineGeometry.attributes.position.needsUpdate = true;
      // }

       

    
    }
  },
  drawRaycasterLine: function () {

      let material = new THREE.LineBasicMaterial({
        color: 0xff0000,
        linewidth: 10
      });
      let geometry = new THREE.Geometry();
      let startVec = new THREE.Vector3(
        raycaster.ray.origin.x,
        raycaster.ray.origin.y,
        raycaster.ray.origin.z);
  
      let endVec = new THREE.Vector3(
        raycaster.ray.direction.x,
        raycaster.ray.direction.y,
        raycaster.ray.direction.z);
      
      // could be any number
      endVec.multiplyScalar(5000);
      
      // get the point in the middle
      let midVec = new THREE.Vector3();
      midVec.lerpVectors(startVec, endVec, 0.5);
  
      geometry.vertices.push(startVec);
      geometry.vertices.push(midVec);
      geometry.vertices.push(endVec);
  
      console.log('vec start', startVec);
      console.log('vec mid', midVec);
      console.log('vec end', endVec);
  
      let line = new THREE.Line(geometry, material);
      this.el.sceneEl.objec3D.add(line);
  },
  beat: function (volume, duration) {
    console.log("tryna beat " + this.el.id + " " + volume);
    if (this.data.eventData.toLowerCase().includes("beat")) {
      let oScale = this.el.getAttribute('data-scale');
      oScale = parseFloat(oScale);
      volume = volume.toFixed(2) * .1;
      let scale = {};
        scale.x = oScale + volume;
        scale.y = oScale + volume;
        scale.z = oScale + volume;
        this.el.setAttribute('scale', scale);
        this.el.setAttribute('animation', 'property: scale; to: '+oScale+' '+oScale+' '+oScale+'; dur: '+duration+'; startEvents: beatRecover; easing: easeInOutQuad');
        this.el.emit('beatRecover');

    }
  }
 
}); //mod_object end

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
    } else if (this.responseText.toLowerCase().includes('maxxed')) {
      this.dialogEl = document.getElementById('mod_dialog');
      if (this.dialogEl != null) {
        this.dialogEl.components.mod_dialog.confirmResponse("You can't drop any more of those here.");
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

AFRAME.registerComponent('mod_dialog', { //there should only be one of these, unlike callouts
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
  this.dialogText.setAttribute("overlay");
  this.dialogPanel.setAttribute("overlay");
  this.yesbutton = null;
  this.nobutton = null;
  this.yesButtonMesh = null;
  this.noButtonMesh = null;
  this.okButtonMesh = null;
  this.objID = null;
  this.meshObj = null;
  this.panelString = "";
  this.el.addEventListener('model-loaded', () => {  
    this.viewportHolder = document.getElementById('viewportPlaceholder'); 
    // this.viewportHolder.object3D.getWorldPosition( this.cameraPosition );
    this.el.setAttribute('position', {x: 0, y:-1000, z:0}); //it's invisible, but set it out of the way so it don't block
    // console.log("TRYNA SET POSITIONF RO MOD_DIALGO " + JSON.stringify(this.cameraPosition));
    
    // this.meshObj = this.dialogPanel.getObject3D('mesh');
    this.meshObj = this.dialogPanel.getObject3D('mesh');
    this.meshObj.traverse(node => {
      if (node.name.toLowerCase().includes('ok')) {
        node.visible = false;
      }
    });
    this.el.addEventListener('click', (evt) => {
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
    if (this.objID.includes("href~")) {
      let urlSplit = this.objID.split("~");
      // window.location.href = urlSplit[1];
      window.open(urlSplit[1], "_blank");
      this.el.setAttribute("visible", false);
      this.dialogPanel.classList.remove('activeObjexRay');
    } else {
      let objEl = document.getElementById(this.objID);
      if (objEl != null) {
        objEl.components.mod_object.activated();
        // objEl.components.mod_object.hideObject();
      }
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
    this.el.setAttribute("visible", true);
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
    WaitAndHideDialogPanel(2000);
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
    WaitAndHideDialogPanel(2000);
  }
});
function WaitAndHideDialogPanel (time) {
  let dialog = document.getElementById("mod_dialog");
  let panel = document.getElementById("mod_dialog_panel");
  // if (dialog.getAttribute("visibility") == visible) {
    setTimeout(() =>{ dialog.setAttribute("visible", false);
    panel.classList.remove('activeObjexRay');
    }, time);
  // }
}

////////////////////////// - MOD_MODEL - for "plain" models, these are written (elements + components + props) by the server into response as a-assets, as opposed to "Objects", see mod_objex / mod_object 
AFRAME.registerComponent('mod_model', {
  schema: {
      markerType: {default: "none"},
      eventData: {default: ''},
      shader: {default: ''},
      color: {default: ''},
      tags: {default: null},
      description: {default: ''}
      
    },
    init: function () {
      
      let textData = [];
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
      // console.log("oScale of model::: " + oScale);
      this.tick = AFRAME.utils.throttleTick(this.tick, 50, this);
      this.triggerAudioController = document.getElementById("triggerAudio");
      this.hasTrigger = false;
      this.triggerObject = null;
      this.hasAudioTrigger = false;
      this.particlesEl = null;
      this.hasCallout = false; //i.e. child mesh name(s) have appended "~callout" 
      this.hasLocationCallout = false; //i.e. "callout" in location.eventData
      this.hasCalloutBackground = false;
      
      this.calloutString = "";
      this.hitpoint = null;
      console.log("MOD MODEL eventData : " + this.data.eventData);
      this.hitpoint = new THREE.Vector3();
      this.tags = this.data.tags;
      this.font1 = "Acme.woff";
      this.font2 = "Acme.woff";
      
      if (settings && settings.sceneFontWeb1) {
        this.font1 = settings.sceneFontWeb1;
      }
      if (settings && settings.sceneFontWeb1) {
        this.font2 = settings.sceneFontWeb2;
      }
      if (this.data.shader != '') {


        // setShader(this.data.shader);
        this.setShader(); //at the bottom
      }      

      if (this.data.eventData.length > 1) {
        // console.log("model eventData " + JSON.stringify(this.data.eventData));
        textData = this.data.eventData.split("~");//tilde delimiter splits string to array//maybe use description for text instead? 

      }
      if (JSON.stringify(this.data.eventData).includes("beat")) {
        console.log ("adding class beatmee");
        this.el.classList.add("beatme");
        // this.el.addEventListener('beatme', e => console.log("beat" + e.detail.volume()));
        
      }

      this.el.addEventListener('beatme', e => console.log("beat"));
      this.isInitialized = false; //to prevent model-loaded from retriggering when childrens are added to this parent


      ///////////////////////////////////////////////// model loaded event start /////////////////////////////
      this.el.addEventListener('model-loaded', () => {
      if (!this.isInitialized) {
        if (this.data.eventData.includes("scatter")) {
          this.el.object3D.visible = false;
          // console.log("GOTSA SCATTER OBJEK@");

        }
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
           
            this.recursivelySetChildrenShader(obj);

          }
        // let dynSkybox = document.getElementById('')
          for (let e = 0; e < textData.length; e++) {
            if (textData[e].toLowerCase().includes("refract")){
              console.log("tryna set refraction");
              obj.material.refractionRatio = .9;
              obj.material.reflectivity = .5;
            }
          }
          if (this.data.eventData.toLowerCase().includes("ar_target")) {
            this.el.id = "ar_target_object"; //hrm, physics doesn't like
          }
          if (this.data.eventData.toLowerCase().includes("spawn")) {
            this.el.classList.add("spawn");
          }             
          if (this.data.eventData.toLowerCase().includes("transparent")) {
            console.log("tryna set transparent");
            obj.visible = false;
          }
          if (this.data.eventData.toLowerCase().includes("particle")) {
            console.log("tryna spawn a particle!");
            this.el.setAttribute('mod_particles', {type: 'fireball'});
          }
          if (this.data.eventData.toLowerCase().includes("fireworks")) {
            console.log("tryna spawn fireworks!");
            this.el.setAttribute('fireworks_spawner', {type: 'fireball'});
          }
          if (this.data.eventData.toLowerCase().includes("audiotrigger")) {
            // console.log("gotsa audiotrigg3re!");
            // this.el.setAttribute('fireworks_spawner', {type: 'fireball'});
            this.hasAudioTrigger = true;
          }
          
          if (this.data.eventData.toLowerCase().includes("target")) {
              this.particlesEl = document.createElement("a-entity");
              this.el.sceneEl.appendChild(this.particlesEl); //hrm...
              this.el.classList.add("target");
              this.el.classList.remove("activeObjexRay");
          }
          if (this.data.eventData.toLowerCase().includes("callout") && this.data.description && this.data.description != "") {
            // this.el.setAttribute("entity-callout", {'calloutString': this.data.description});
            this.hasLocationCallout = true;
            this.hasCallout = true;

          }

          this.el.addEventListener('raycaster-intersected', e =>{  
            this.raycaster = e.detail.el;
            // that.raycaster = this.raycaster;
            // this.intersection = this.raycaster.components.raycaster.getIntersection(this.el);
            // if (this.intersection.point) {
            //   // console.log("intersection " + JSON.stringify(this.intersection.point));
            //   this.hitpoint.x = this.intersection.point.x.toFixed(2);
            //   this.hitpoint.y = this.intersection.point.y.toFixed(2);
            //   this.hitpoint.z = this.intersection.point.z.toFixed(2);
            //   this.rayhit(this.hitpoint);
            // }
            // console.log("raycaster "+ e.detail.el.id +" mod_model target hit " + this.el.id + " with tags " + this.data.tags);
            if (this.raycaster) {
              this.intersection = this.raycaster.components.raycaster.getIntersection(this.el);
              if (!this.intersection) { 
                  return; 
                } else {
                  if (this.intersection.point) {
                    this.hitpoint = this.intersection.point;
                    // console.log("intersection " + JSON.stringify(this.intersection.point));
                    // this.hitpoint.x = this.intersection.point.x.toFixed(2);
                    // this.hitpoint.y = this.intersection.point.y.toFixed(2);
                    // this.hitpoint.z = this.intersection.point.z.toFixed(2);
                    // this.rayhit(this.intersection.point);
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
                // this.killParticles();
            });
          // }

          let worldPos = null;
          let hasAnims = false;
          let hasPicPositions = false;
          let hasVidPositions = false;
          let hasAudioPositions = false;
          camera = AFRAME.scenes[0].camera; 
          mixer = new THREE.AnimationMixer( obj );
          clips = obj.animations;

          if (clips != null) { 
            for (i = 0; i < clips.length; i++) { //get reference to all anims
              hasAnims = true;
              // console.log("model has animation: " + clips[i].name);
              
              if (clips[i].name.includes("mouthopen")) {
                moIndex = i;
                mouthClips.push(clips[i]);
              }
              // if (clips[i].name.includes("mouthopen")) {
              //   moIndex = i;
              // }
              if (clips[i].name.toLowerCase().includes("mixamo")) {
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
                      "clip": clips[0].name,
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
            if (this.nodeName.includes("trigger")) { //must be set in the data and as a name on the model
              if (node instanceof THREE.Mesh) {
              this.meshChildren.push(node);
              console.log("gotsa trigger!");
              }
            }
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
              console.log("caint fine no audioo_groups_control");
            }
          }
          for (i = 0; i < this.meshChildren.length; i++) { //apply mods to the special things
            console.log("gotsa special !! meshChild " + this.meshChildren[i].name);
            if (this.meshChildren[i].name.includes("trigger")) { 
              //ugh, nm
                let child = this.el.object3D.getObjectByName(this.meshChildren[i].name, true);
                child.visible = false;

                // let triggerEl = document.createElement('a-entity');
                // var targetPos = new THREE.Vector3();
                // child.getWorldPosition(targetPos);
                // this.child = child.clone();
                // triggerEl.setObject3D("mesh", this.child);
                // // let child = this.child.clone();
                // // this.child.position(targetPos);
                // // triggerEl.setObject3D("mesh", child.clone());
                // // triggerEl.setObject3D("mesh", child);
                // child.remove();
                // // triggerEl.setAttribute('geometry', {primitive: 'box', width: 1});
                // triggerEl.setAttribute('position', targetPos);
                // console.log("gotsa special teryna set a trigger mesh..");
                // triggerEl.setAttribute('mod_physics', {eventData: this.data.eventData, tags: this.data.tags, isTrigger: true});
                // // triggerEl.classList.add('activeObjexRay');
                // triggerEl.id = "TRIGGGER";
                // this.sceneEl.appendChild(triggerEl);
                
                // triggerEl.classList.add('trigger');
            }
            if (this.meshChildren[i].name.includes("navmesh")) {
              console.log("gotsa navmesh too!");
              // let child = this.meshChildren[i].clone();
              this.child = this.el.object3D.getObjectByName(this.meshChildren[i].name, true);
              this.child.visible = false; //just hide named navmesh, they're loaded externally... 
           
             
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
             
              let child = this.el.object3D.getObjectByName(this.meshChildren[i].name, true);
              // console.log(child);
              this.hasCallout = true;
              if (child != null && child != undefined) { 
                //
                var calloutChild = document.createElement('a-entity');
                calloutChild.classList.add("activeObjexRay");
                calloutChild.setObject3D("Object3D", child);
                this.calloutString = this.meshChildren[i].name.split("~")[0];
                console.log("gotsa callout! " + this.calloutString);
                // console.log("callout string is " + callout);

                // calloutChild.addEventListener('model-loaded', () => {
                // console.log("callout! " +callout);
                calloutChild.setAttribute("model-callout", {'calloutString': this.calloutString});
                this.el.appendChild(calloutChild);
                // });
              }
            } else if(this.meshChildren[i].name.includes("haudio") && hvids.length > 0) {
              // console.log("video data " + JSON.stringify(hvids[hvidsIndex]));
              this.mesh = this.meshChildren[i]; //mesh, not object3d type
              
              // }
            
            } else if((this.meshChildren[i].name.toString().includes("hvid") || this.meshChildren[i].name.toString() == "hvid") && hvids.length > 0) {
              // console.log("video data " + JSON.stringify(hvids[hvidsIndex]));
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
                  this.childEnt.id = "primary_video";
                  this.childEnt.classList.add("activeObjexRay");
                  // this.child.remove();
                  hvidsIndex++;
              // }
            }  else if((this.meshChildren[i].name.toString().includes("svid") || this.meshChildren[i].name.toString() == "svid") && svids.length > 0) {
                // console.log("video data " + JSON.stringify(svids[svidsIndex]));
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
                calloutEntity.setAttribute("scale", '2 2 2');
                let calloutText = document.createElement("a-entity");
                this.el.sceneEl.appendChild(calloutEntity);
                calloutEntity.appendChild(calloutText);
                calloutEntity.setAttribute("look-at", "#player");
                calloutEntity.setAttribute('visible', false);

                calloutText.setAttribute("position", '0 0 .5'); //offset the child on z toward camera, to prevent overlap on model
                calloutText.setAttribute("look-at", "#player");
                calloutText.setAttribute('troika-text', {
                  width: 2,
                  baseline: "bottom",
                  align: "center",
                  fontSize: .1,
                  font: "/fonts/web/" + this.font2,
                  anchor: "center",
                  // wrapCount: 300,
                  color: "white",
                  value: spics[spicsIndex].title
                });
                // this.el.setAttribute("position", this.data.pos);
                childEnt.addEventListener('mouseenter', function (evt) {
                  if (this.data.eventData.toLowerCase().includes("audiotrigger")) {
                    // var triggerAudioController = document.getElementById("triggerAudio");
                    if (this.triggerAudioController != null) {
                      
                      this.triggerAudioController.components.trigger_audio_control.playAudio();

                    }
                  }
                  
                    calloutEntity.setAttribute('visible', true);
                    let pos = evt.detail.intersection.point; //hitpoint on model
                    console.log("mousing a pic agt " + JSON.stringify(pos) + " title " + spics[spicsIndex].title);
                    calloutEntity.setAttribute("position", pos);
                  // }
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
                calloutEntity.setAttribute("scale", '2 2 2');
                let calloutText = document.createElement("a-entity");
                this.el.sceneEl.appendChild(calloutEntity);
                calloutEntity.appendChild(calloutText);
                calloutEntity.setAttribute("look-at", "#player");
                calloutEntity.setAttribute('visible', false);

                calloutText.setAttribute("position", '0 0 .5'); //offset the child on z toward camera, to prevent overlap on model
                calloutText.setAttribute("look-at", "#player");
                calloutText.setAttribute('troika-text', {
                  // width: 2,
                  baseline: "bottom",
                  align: "center",
                  fontSize: .1,
                  font: "/fonts/web/" + this.font2,
                  anchor: "center",
                  // wrapCount: 300,
                  color: "white",
                  outlineColor: "black",
                  outlineWidth: "2%",
                  value: hpics[hpicsIndex].title
                });
                // this.el.setAttribute("position", this.data.pos);
                childEnt.addEventListener('mouseenter', (evt) => {
                  if (this.data && this.data.eventData != undefined && this.data.eventData.toLowerCase().includes("audiotrigger")) {
                    // var triggerAudioController = document.getElementById("triggerAudio");
                    if (this.triggerAudioController != null) {
                      this.triggerAudioController.components.trigger_audio_control.playAudio();
                    }
                  }
                    calloutEntity.setAttribute('visible', true);
                    let pos = evt.detail.intersection.point; //hitpoint on model
                    console.log("mousing a pic agt " + JSON.stringify(pos) + " title " + hpics[hpicsIndex].title);
                    calloutEntity.setAttribute("position", pos);
                    calloutEntity.setAttribute('scale', {x: this.distance * .25, y: this.distance * .25, z: this.distance * .25} );
                  // }
                });
                childEnt.addEventListener('mouseleave', (evt) => {
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
              
                calloutEntity.setAttribute("scale", '2 2 2');
                let calloutText = document.createElement("a-entity");
                this.el.sceneEl.appendChild(calloutEntity);
                calloutEntity.appendChild(calloutText);

                calloutEntity.setAttribute("look-at", "#player");
                calloutEntity.setAttribute('visible', false);

                calloutText.setAttribute("position", '0 0 .5'); //offset the child on z toward camera, to prevent overlap on model
                calloutText.setAttribute("look-at", "#player");
                calloutText.setAttribute('troika-text', {
                  width: 2,
                  baseline: "bottom",
                  align: "center",
                  font: "/fonts/web/" + this.font2,
                  anchor: "center",
                  wrapCount: 300,
                  color: "white",
                  value: vpics[vpicsIndex].title
                });

                childEnt.addEventListener('mouseenter', (evt) => {
                  if (this.data && this.data.eventData != undefined && this.data.eventData.toLowerCase().includes("audiotrigger")) {
                    // this.triggerAudioController = document.getElementById("triggerAudio");
                    if (this.triggerAudioController != null) {
                      this.triggerAudioController.components.trigger_audio_control.playAudio();
                    }
                  }
                    calloutEntity.setAttribute('visible', true);
                    let pos = evt.detail.intersection.point; //hitpoint on model
                    console.log("mousing a pic agt " + JSON.stringify(pos) + " title " + vpics[vpicsIndex].title);
                    calloutEntity.setAttribute("position", pos);
                  // }
                });
                childEnt.addEventListener('mouseleave', (evt) => {
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
      
      if (this.el.classList.contains('target') || this.data.markerType != "none" || this.hasCallout) {
        let textIndex = 0;
        this.position = null;
        // let hasBubble = false;
        // let theEl = this.element;
        this.el.setAttribute('gesture-handler-add'); //ar mode only?
        var sceneEl = document.querySelector('a-scene');
        let hasCallout = false;
        if (this.hasCallout) {
          hasCallout = true;
        }
        let calloutOn = false;
        if (!this.data.eventData.toLowerCase().includes("undefined") && this.data.eventData.toLowerCase().includes("main") && this.data.eventData.toLowerCase().includes("text")) {
          document.getElementById("mainTextToggle").setAttribute("visible", false);
          let tdata = document.getElementById("mainText").getAttribute("main-text-control", "mainTextString"); 
          // console.log("target eventData : "+ JSON.stringify(this.data.eventData));
          textData = tdata.mainTextString.split("~");
          hasCallout = true;
        } else {
          textData = this.data.description.split("~");
        }
        if (hasCallout) {
          let bubble = document.createElement("a-entity");
          this.bubble = bubble;
          console.log("made a bubble!" + this.data.eventData.toLowerCase());
         
          bubble.classList.add("bubble");
          bubble.setAttribute("position", "2 2 0");
          bubble.setAttribute("rotation", "0 0 0"); 
          // bubble.setAttribute("scale", "2 2 2"); 
          bubble.setAttribute("visible", false);
          sceneEl.appendChild(bubble);
          
          bubbleBackground = null;
          if (this.data.eventData.toLowerCase().includes("thought")) {
            this.hasCalloutBackground = true;
            bubble.setAttribute("look-at", "#player");
            console.log("ttryhana put a thought bubble on mod_model");
            bubbleBackground = document.createElement("a-entity");
            bubbleBackground.classList.add("bubbleBackground");
            bubbleBackground.setAttribute("gltf-model", "#thoughtbubble"); //just switch this for other callout types (speech and plain callout)
            bubbleBackground.setAttribute("position", "0 0 1");
            bubbleBackground.setAttribute("rotation", "0 0 0"); 
            // bubbleBackground.setAttribute("scale", "-.1 .1 .1"); 
            // bubble.setAttribute("material", {"color": "white", "blending": "additive", "transparent": false, "alphaTest": .5});
            bubbleBackground.setAttribute("material", {"color": "white", "shader": "flat"}); //doh, doesn't work for gltfs... 
            bubble.appendChild(bubbleBackground);

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
          }
          if (this.data.eventData.toString().toLowerCase().includes("speech") || this.data.eventData.toString().toLowerCase().includes("talk")) {
            this.hasCalloutBackground = true;
            bubble.setAttribute("look-at", "#player");
            bubbleBackground = document.createElement("a-entity");
            bubbleBackground.classList.add("bubbleBackground");
            bubbleBackground.setAttribute("gltf-model", "#talkbubble"); 
            bubbleBackground.setAttribute("position", "0 0 0");
            bubbleBackground.setAttribute("rotation", "0 0 0"); 
            // bubbleBackground.setAttribute("scale", "-.1 .1 .1"); 
            // bubble.setAttribute("material", {"color": "white", "blending": "additive", "transparent": false, "alphaTest": .5});
            bubbleBackground.setAttribute("material", {"color": "white", "shader": "flat"}); //doh, doesn't work for gltfs... 
            bubble.appendChild(bubbleBackground);

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
          }
          
          // let bubbleText = document.createElement("a-text");
          let bubbleText = document.createElement("a-entity");

          bubbleText.classList.add("bubbleText");
          // bubbleText.setAttribute("visible", false);
          // bubbleText.setAttribute("position", "0 0 0");
          // bubbleText.setAttribute("scale", ".1 .1 .1"); 
          bubble.appendChild(bubbleText);
          bubbleText.setAttribute("look-at", "#player");
          this.bubbleText = bubbleText;
          // bubbleText.setAttribute("width", 3);
          // bubbleText.setAttribute("height", 2);
          
          

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

     
        if (primaryAudioControlParams.targetattach) { //set by sceneAttachPrimaryAudioToTarget or something like that...
          console.log("tryna target attach primary audio " + primaryAudioControlParams.targetattach);

          document.getElementById("primaryAudioParent").setAttribute("visible", false);
          // document.getElementById("primaryAudioParent").setAttribute("position", theEl.position);
          primaryAudio.emit('targetattach', {targetEntity: this.el}, true);
          primaryAudioHowl.pos(this.el.object3D.position.x, this.el.object3D.position.y, this.el.object3D.position.z);
          
          this.el.addEventListener('click', function () {

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
          // console.log("no primary audio found!");
        }
        if (this.data.markerType.toLowerCase() == "spawntrigger") {
          this.el.setAttribute('gltf-model', '#poi1' );
          // this.el.setAttribute("geometry", {primitive: "box", height: 1, width: 1});
          
        }
        this.el.addEventListener('mouseleave', (e) => { 
          e.preventDefault();
          // console.log("tryna mouseexit");
          if (!this.data.isEquipped) {
            if (this.calloutEntity != null) {
              this.calloutEntity.setAttribute('visible', false);
            }
            // this.bubble = sceneEl.querySelector('.bubble');
            if (this.bubble) {
              this.bubble.setAttribute('visible', false);
              // if (this.bubbleBackground) {
              //   this.bubbleBackground.setAttribute('scale', '1 1 1');
              // }
              //   this.bubbleText.setAttribute('scale', '1 1 1' );
            }
          }
        });
        this.el.addEventListener('mouseenter', (evt) =>  {
          console.log("mouseovewr model " + this.el.id + this.hasLocationCallout + hasCallout + this.hasCallout + this.hasCalloutBackground + textData[textIndex]);
          if (evt.detail.intersection != null && this.hitpoint != null) {

            // if (hasCallout && !textData[textIndex].toLowerCase().includes("undefined")) {
            if (hasCallout) {
              // console.log("callout is " + this.calloutString);
              let pos = evt.detail.intersection.point; //hitpoint on model
              // this.bubble.setAttribute('position', {"x": pos.x.toFixed(2), "y": pos.y.toFixed(2), "z": pos.z.toFixed(2)});
              this.bubble.setAttribute('position', evt.detail.intersection.point);
              this.font2 = "Acme.woff";
              if (settings && settings.sceneFontWeb2 && settings.sceneFontWeb2.length) {
                this.font2 = settings.sceneFontWeb2;
              }
  
            // if (pos.x != NaN) { //does it twice because matrix set, disregard if it returns NaN :( //fixed?
            //   console.log("screen position: " + (pos.x/width).toFixed(1) + " " + (pos.y/height).toFixed(1)); //"viewport position"
            // }
            
            
            // this.distance = window.playerPosition.distanceTo( this.hitpoint );
           
            let distance = evt.detail.intersection.distance;
            this.distance = distance;
            if (this.hasCalloutBackground && distance) { //eg thought or speech bubble
              if (distance < 10) {
                const min = .1;
                const max = 1;

                calloutOn = true;
                this.bubble = sceneEl.querySelector('.bubble');
                this.bubbleText = sceneEl.querySelector('.bubbleText');
                this.bubbleBackground = sceneEl.querySelector('.bubbleBackground');
    
               
                
                this.bubble.setAttribute("visible", true);
                this.bubbleText.setAttribute("visible", true);
    
                let camera = AFRAME.scenes[0].camera; 
                pos.project(camera);
                var width = window.innerWidth, height = window.innerHeight; 
                let widthHalf = width / 2;
                let heightHalf = height / 2;
                pos.x = (pos.x * widthHalf) + widthHalf;
                pos.y = - (pos.y * heightHalf) + heightHalf;
                pos.z = 0;

                let scaleFactor = clamp(distance * .1, min, max);
                console.log( " distance " +  distance + " scalefactro " + scaleFactor);
                if ((pos.x/width) < .5) {
                  console.log("flip left");
                  if (this.bubbleBackground) {
                    this.bubbleBackground.setAttribute("position", ".5 .2 .5");
                    // this.bubbleBackground.setAttribute("scale", "-.2 .2 .2"); 
                    // this.bubbleBackground.setAttribute('scale', {x: distance * -.05, y: distance * .05, z: distance * .05} );
                    this.bubbleBackground.setAttribute('scale', {x: scaleFactor * -1, y: scaleFactor, z: scaleFactor} );
                  }
                  // this.bubbleText.setAttribute("scale", ".2 .2 .2"); 
                  this.bubbleText.setAttribute("position", ".5 .2 .6");
                  // this.bubbleText.setAttribute('scale', {x: distance * .05, y: distance * .05, z: distance * .05} );
                  this.bubbleText.setAttribute('scale', {x: scaleFactor, y: scaleFactor, z: scaleFactor} );
                } else {
                // if ((pos.x/width) > .5) {
                  console.log("flip right");
                  if (this.bubbleBackground) {
                    this.bubbleBackground.setAttribute("position", "-.5 .2 .5");
                    // this.bubbleBackground.setAttribute('scale', {x: distance * .05, y: distance * .05, z: distance * .05} );
                    this.bubbleBackground.setAttribute('scale', {x: scaleFactor, y: scaleFactor, z: scaleFactor} );
                    // this.bubbleBackground.setAttribute("scale", ".2 .2 .2"); 

                  }
                  // this.bubbleText.setAttribute("scale", ".2 .2 .2")
                  // this.bubbleText.setAttribute('scale', {x: distance * .05, y: distance * .05, z: distance * .05} );
                  this.bubbleText.setAttribute('scale', {x: scaleFactor, y: scaleFactor, z: scaleFactor} );
                  this.bubbleText.setAttribute("position", "-.5 .2 .6");
                }

                this.bubbleText.setAttribute('troika-text', {
                  baseline: "center",
                  align: "center",
                  font: "/fonts/web/" + this.font2,
                  anchor: "center",
                  // wrapCount: 20,
                  maxWidth: 3,
                  fontSize: .3,
                  color: "black",
                  outlineColor: "white",
                  outlineWidth: "2%",
                  value: textData[textIndex]
                });
              } else {
                this.bubble.setAttribute("visible", false);
                this.bubbleBackground.setAttribute('scale', '1 1 1');
                this.bubbleText.setAttribute('scale', '1 1 1' );
              }
  

            } else {
              if (this.hasLocationCallout) {
                console.log("not bubble callout is " + textData[textIndex]);
                distance = evt.detail.intersection.distance;
                  this.bubble.setAttribute('position', pos);
                  this.bubble.setAttribute("visible", true);
                  this.bubbleText.setAttribute("visible", true);
                  this.bubbleText.setAttribute('scale', {x: distance * .1, y: distance * .1, z: distance * .1} );
                // this.bubbleText.setAttribute('scale', {x: distance * .04, y: distance * .04, z: distance * .04} );
                this.bubbleText.setAttribute("position", "-.5 .2 .51");
                this.bubbleText.setAttribute('troika-text', {
                  baseline: "bottom",
                  align: "center",
                  font: "/fonts/web/" + this.font2,
                  anchor: "center",
                  // wrapCount: .2,
                  fontSize: .3,
                  color: "white",
                  outlineColor: "black",
                  outlineWidth: "2%",
                  value: textData[textIndex]
                });
              }
  

            }


            if (textIndex < textData.length - 1) {
              textIndex++;
            } else {
              textIndex = 0;
              }
            }

            // console.log("tryna play audiotrigger " + JSON.stringify(this.data.eventData));
            if (this.data.tags != undefined && this.data.tags != null && this.data.tags != "undefined") {
              console.log("tryna play audio with tags " + this.data.tags);
              // if (this.triggerAudioController != null) {
              //   this.triggerAudioController.components.trigger_audio_control.playAudio();
              
                if (this.triggerAudioController != null) {
                  let distance = window.playerPosition.distanceTo(evt.detail.intersection.point);
                  this.triggerAudioController.components.trigger_audio_control.playAudioAtPosition(evt.detail.intersection.point, distance, this.data.tags, 1);//tagmangler needs an array, add vol mod 
                }
              // }
            }

            if (this.data.eventData && this.data.eventData.length && this.data.eventData.toLowerCase().includes("target")) {
                // this.el.setAttribute("targeting_raycaster", {'init': true}); //no
                this.el.classList.add("target");
                this.el.classList.remove("activeObjexRay");
              
        

            }
          
          }
        });

      }
     
      document.querySelector('a-scene').addEventListener('youtubeToggle', function (event) { //things to trigger on this model if primary audio is playing
        console.log("GOTSA YOUTUBNE EVENT: " + event.detail.isPlaying);  
        if (event.detail.isPlaying) {
          if (danceIndex != -1) { //moIndex = "mouthopen"
            var clip = danceClips[Math.floor(Math.random()*danceClips.length)];
            theEl.setAttribute('animation-mixer', {
              // "clip": clips[danceIndex].name,
              "clip": clip.name,
              "loop": "repeat",
              "crossFadeDuration": 1,
              "repetitions": Math.floor(Math.random()*2),
              "timeScale": .75 + Math.random()/2
            });
           
            theEl.addEventListener('animation-finished', function () { 
              theEl.removeAttribute('animation-mixer');
              clip = danceClips[Math.floor(Math.random()*danceClips.length)];
              theEl.setAttribute('animation-mixer', {
                // "clip": clips[danceIndex].name,
                "clip": clip.name,
                "loop": "repeat",
                "crossFadeDuration": 1,
                "repetitions": Math.floor(Math.random()*2),
                "timeScale": .75 + Math.random()/2
              });
            });
          }
        } else {
          if (idleIndex != -1) { 
            var clip = idleClips[Math.floor(Math.random()*idleClips.length)];
            theEl.setAttribute('animation-mixer', {
              // "clip": clips[danceIndex].name,
              "clip": clip.name,
              "loop": "repeat",
              "crossFadeDuration": 1,
              "repetitions": Math.floor(Math.random()*2),
              "timeScale": .75 + Math.random()/2
            });
           
            theEl.addEventListener('animation-finished', function () { //clunky but whatever 
              theEl.removeAttribute('animation-mixer');
              clip = idleClips[Math.floor(Math.random()*idleClips.length)];
              theEl.setAttribute('animation-mixer', {
                // "clip": clips[danceIndex].name,
                "clip": clip.name,
                "loop": "repeat",
                "crossFadeDuration": 1,
                "repetitions": Math.floor(Math.random()*2),
                "timeScale": .75 + Math.random()/2
              });
            });
          }
        }
      });

      document.querySelector('a-scene').addEventListener('primaryAudioToggle', function () {  //things to trigger on this model if primary audio is playing
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
            // theEl.addEventListener('animation-finished', function () { 
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
            // theEl.addEventListener('animation-finished', function () { 
            //   theEl.removeAttribute('animation-mixer');
            // });
            }
          }
        });
        ///////////todo primary video drive anims

    }
    });
   
  },  //END INIT mod_model
  returnProperties: function () {
    //placeholder

  },
  beat: function (volume, duration) {
    console.log("tryna beat " + this.el.id + " " + volume);
    if (this.data.eventData.toLowerCase().includes("beat")) {
      let oScale = this.el.getAttribute('data-scale');
      oScale = parseFloat(oScale);
      volume = volume.toFixed(2) * .1;
      let scale = {};
        scale.x = oScale + volume;
        scale.y = oScale + volume;
        scale.z = oScale + volume;
        this.el.setAttribute('scale', scale);
        this.el.setAttribute('animation', 'property: scale; to: '+oScale+' '+oScale+' '+oScale+'; dur: '+duration+'; startEvents: beatRecover; easing: easeInOutQuad');
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
  returnHitDistance () {
    if (this.distance) {
      return this.distance;
    }
  },
  tick: function () {
    if (this.shaderMaterial != null && this.hasUniforms != null) {
      if (this.hasUniforms) {
        // console.log("timemods on");
        this.shaderMaterial.uniforms[ 'time' ].value = .00005 * ( Date.now() - this.start );

      }
    }

  },
  killParticles: function () {
    if (this.particlesEl) {
      this.particlesEl.setAttribute('sprite-particles', {"enable": false});
    }
  },
  rayhit: function (id, distance, hitpoint) {

    if (this.data.eventData && this.data.eventData.length && this.data.eventData.toLowerCase().includes("target")) {        
      if (this.particlesEl) {
        // hitpoint.x = hitpoint.x.toFixed(2);
        // hitpoint.y = hitpoint.y.toFixed(2);
        // hitpoint.z = hitpoint.z.toFixed(2);
        console.log("gotsa rayhit on id " + this.el.id + " eventdata " + this.data.eventData + " at " + JSON.stringify(hitpoint) + " tags" + this.data.tags);
        
        this.particlesEl.setAttribute("position", {"x": hitpoint.x, "y": hitpoint.y,"z": hitpoint.z});
        // this.particlesEl.object3D.position.set(hitpoint.x, hitpoint.y, hitpoint.z);
        this.particlesEl.setAttribute('sprite-particles', {
          enable: true, 
          duration: '2', 
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
      // this.particlesEl.setAttribute('sprite-particles', {"enable": false});
      this.particlesEl.setAttribute('sprite-particles', {"duration": .5});
      
      this.el.object3D.scale.set(0, 0, 0);
      // this.el.object3D.scale.y = 0;
      // this.el.object3D.scale.z = 0;
      this.mod_curve = this.el.components.mod_curve;
      if (this.mod_curve) {
        this.mod_curve.reset();
      }
      } else {
        this.particlesEl = document.createElement("a-entity");
        this.el.sceneEl.appendChild(this.particlesEl); //hrm...
      }
    }

    if (this.triggerAudioController != null && !this.data.isEquipped && this.tags) {
      this.triggerAudioController.components.trigger_audio_control.playAudioAtPosition(hitpoint, distance, this.tags);
    }

    if (this.hasSynth) {
      if (this.el.components.mod_synth != null && this.data.objectData.tonejsPatch1 != undefined && this.data.objectData.tonejsPatch1 != null) {
        // this.el.components.mod_synth.trigger(distance);
        if (this.data.objectData.tonejsPatch1 == "Metal") {
          this.el.components.mod_synth.metalHitDistance(distance);
        } else if (this.data.objectData.tonejsPatch1 == "AM Synth") {
          this.el.components.mod_synth.amHitDistance(distance);
        }
        
      }
    }
  }

  

});  ///end mod_model///////////

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
        node.material.envMap.intensity = .5;
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
      let skyEl = document.querySelector("#sky");
      if (skyEl != null) {
        let url = skyEl.src;
        this.texture = null;
        // console.log("gotsa sky ref " + url);
        let dynSkyEl = document.getElementById('skybox_dynamic');
        if (dynSkyEl != null) {
          // console.log("gotsa sky ref " + url);
          this.texture = dynSkyEl.components.skybox_dynamic.returnEnvMap();
          // console.log("gotsa sky ref " + this.texture);
        } 
        if (this.texture == null) {
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
      }
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
              node.material.envMap.intensity = .5;
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
    id: {default: null}
    // sceneType: {default: 'defaut'}
    // path: {default: ''},
    // extension: {default: 'jpg'},
    // format: {default: 'RGBFormat'},
    // enableBackground: {default: false}
  },

  init: function () {
    this.skyboxIndex = 0;
    this.skyEl = document.getElementById('a_sky');
    this.skyboxData = null;
    this.texture = null;
    let picGroupMangler = document.getElementById("pictureGroupsData");

    if (picGroupMangler != null && picGroupMangler != undefined && picGroupMangler.components.picture_groups_control) {
      this.skyboxData = picGroupMangler.components.picture_groups_control.returnSkyboxData(this.data.id);
      // console.log(JSON.stringify(this.skyboxData));
    } else {
      // this.singleSkybox(); //maybe tryna do this before models are loaded, is the problem..
    }

  },
  singleSkybox: function () {

    // const ref = document.getElementById("sky");
    console.log("skyboxURL : " + settings.skyboxURL);

   this.texture = new THREE.TextureLoader().load(settings.skyboxURL);
    this.texture.encoding = THREE.sRGBEncoding;
    this.texture.mapping = THREE.EquirectangularReflectionMapping;
    this.texture.minFilter = this.texture.magFilter = THREE.LinearFilter;
    // if (window.sceneType != undefined && !window.sceneType.toLower().includes('ar')) {
      this.el.sceneEl.object3D.background = this.texture;
    // }
    
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
            node.material.envMap.intensity = .5;
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

AFRAME.registerComponent('mod_background', { //nosky bg mods
  schema: {
    enabled: {default: true},
    color: {default: 'lightblue'}

  }, 
  init: function () {
   
    this.tweakMe = false;
    this.lerpMe = false;
    this.colors = [
      new THREE.Color(0xff0000),
      new THREE.Color(0xffff00),
      new THREE.Color(0x00ff00),
      new THREE.Color(0x0000ff)
    ];
    
  },
  colortweak: function () {
    console.log("colortweak");
    // if (this.skyEl) {
    // this.el.setAttribute('animation', 'property: sky.color; to: '+settings.sceneColor1Alt+'; dur: 1000; loop: true; dir: alternate');
    // this.el.emit('colorRecover');
    this.tweakMe = true;
    
  },
  colorlerp: function (duration) {
    if (settings && settings.sceneColor1Alt) {
      console.log("tryna lerp color : " + JSON.stringify(this.el.object3DMap));
      // this.el.setAttribute('animation', 'property: color; to: '+settings.sceneColor1Alt+'; dur: 3000;');
      this.lerpMe = true;
      }
  },
  tick: function (time) {
    if (this.tweakMe) {
      // let s = Math.sin(time * 2.0) * 0.5 + 0.5;
      // this.el.object3D.material.color.copy(this.startColor).lerp(this.endColor, s);
    } else if (this.lerpMe) {
      const f = Math.floor(duration / this.colors.length);
      const i1 = Math.floor((time / f) % this.colors.length);
      let i2 = i1 + 1;
    
      if (i2 === this.colors.length) i2 = 0;
    
      const color1 = this.colors[i1];
      const color2 = this.colors[i2];
      const a = (time / f) % this.colors.length % 1;
    
      this.el.sceneEl.background.copy(color1);
      this.el.sceneEl.background.lerp(color2, a);
    } 
  }
});

AFRAME.registerComponent('mod_sky', { //
  schema: {
    enabled: {default: true},
    color: {default: 'lightblue'}

  }, 
  init: function () {
    // this.skyEl = document.getElementById('sk');
    let color1 = this.data.color;
    // let color2 = settings.sceneColor1Alt.replace('#', '');
    // console.log("tryna set colors " + color1 + " " + color2);
    this.startColor = new THREE.Color('blue');
    this.endColor = new THREE.Color('red');
    this.lerpedColor = new THREE.Color();
    // this.startColor.set(color1);
    // this.endColor.set(color2);
    // var geometry = new THREE.SphereGeometry(100, 60, 40);  
    // var material = new THREE.MeshBasicMaterial({ 
    //   'color': this.startColor
    //   // 'side': 'back',
    // });
    // this.skySphereMat = this.el.getObject3D('mesh').material;
    // this.skySphere.scale.set(-1, 1, 1);  
    // this.el.sceneEl.object3D.add(this.skySphere);
    // this.el.setObject3D(this.skySphere);
    this.skySphereMat = null;
    this.mesh = this.el.getObject3D('mesh');

    if (this.mesh != null) {
      this.mesh.traverse(function (node) {

      if (node.material) {
      // if (node.material) {
        console.log("skymaterial color is " + JSON.stringify(node.material.color));
          this.skySphereMat = node.material;
          }
        });
      }

    // this.skySphere.eulerOrder = 'XZY';  
    // this.skySphere.renderDepth = 1000.0;  
    this.tweakMe = false;
    this.lerpMe = false;
  },
  colortweak: function () {
    console.log("colortweak");
    // if (this.skyEl) {
    // this.el.setAttribute('animation', 'property: sky.color; to: '+settings.sceneColor1Alt+'; dur: 1000; loop: true; dir: alternate');
    // this.el.emit('colorRecover');
    this.tweakMe = true;
    
  },
  colorlerp: function (duration) {
    if (settings && settings.sceneColor1Alt) {
      console.log("tryna lerp color : " + JSON.stringify(this.el.object3DMap)); 
      // this.el.setAttribute('animation', 'property: color; to: '+settings.sceneColor1Alt+'; dur: 3000;'); //maybe just do from and it's ok?
      this.lerpMe = true;
      }
  },
  tick: function (time) {
    if (this.tweakMe) {
      let s = Math.sin(time * 2.0) * 0.5 + 0.5;
      this.el.object3D.material.color.copy(this.startColor).lerp(this.endColor, s);
    } else if (this.lerpMe) {
      // let s = Math.sin(time * 2.0) * 0.5 + 0.5;
      // this.mesh.material.color.setColor(this.startColor).lerpHSL(this.endColor, s);
      // this.mesh.material.color 
      // this.mesh.material.color.set(this.startColor).lerp(this.endColor, 0.5 * (Math.sin(time) + 1));
      this.skySphereMat.color.set(this.startColor);
      // this.skySphereMat.color.set(this.lerpedColor);
      // this.skySphereMat.color.copy(this.startColor).lerp(this.endColor, 0.5 * (Math.sin(time) + 1));
      // this.lerpColor = (this.startColor).lerp(this.endColor, 0.5 * (Math.sin(time) + 1));
      // console.log("truyna lerp to "+ JSON.stringify(this.lerpColor));
      // this.el.setAttribute("color", this.lerpColor )
    } 
  }
});

AFRAME.registerComponent('enviro_mods', { //tweak properties of environment component at runtime
  schema: {
    enabled: {default: true}
  }, 
  init: function () {
    this.enviroDressing = document.querySelector('.environmentDressing');
    this.enviroEl = document.getElementById('enviroEl');
    // this.skyEl = document.getElementById('a_sky');
    this.isLerping = false;
    this.isTweaking = false;
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
      // groundColor: "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}),
      // groundColor2: "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}),
      // dressingColor: "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}),
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

    // this.enviroEl.setAttribute('animation', 'property: environment.groundColor; to: '+settings.sceneColor3+'; dur: 1000; startEvents: colorRecover');
    // this.enviroEl.setAttribute('animation_1', 'property: environment.groundColor2; to: '+settings.sceneColor4+'; dur: 1000; startEvents: colorRecover');
    // this.enviroEl.setAttribute('animation_2', 'property: environment.dressingColor; to: '+settings.sceneColor4+'; dur: 1000; startEvents: colorRecover');
    this.enviroEl.setAttribute('animation_3', 'property: \x22environment.skyColor\x22; to: '+settings.sceneColor1+'; dur: 1000; startEvents: colorRecover');
    this.enviroEl.setAttribute('animation_4', 'property: \x22environment.horizonColor\x22; to: '+settings.sceneColor2+'; dur: 1000; startEvents: colorRecover');
    this.el.emit('colorRecover');
  },
  colorlerp: function (duration) {
    if (settings && settings.sceneColor1Alt) {

      // this.el.emit('colorTo');
      if (this.enviroEl && !this.isLerping) {
        this.isLerping = true;
                // duration = duration * 1000;
        this.currentSkyColor = this.enviroEl.getAttribute("environment")
        console.log("TRYNA mod enviro with COLOR LOERP " + duration);
        this.enviroEl.setAttribute('animation__1', 'property: environment.skyColor; from: '+settings.sceneColor1+'; to: '+settings.sceneColor1Alt+'; dur: '+duration+'; loop: true; dir: alternate; pauseEvents: pauseColors; resumeEvents: resumeColors;');
        this.enviroEl.setAttribute('animation__2', 'property: environment.horizonColor; from: '+settings.sceneColor2+'; to: '+settings.sceneColor2Alt+'; dur: '+duration+'; loop: true; dir: alternate; pauseEvents: pauseColors; resumeEvents: resumeColors;');
        // this.enviroEl.setAttribute('animation__2', 'property: environment.groundColor; from: '+settings.sceneColor3+'; to: '+settings.sceneColor3Alt+'; dur: '+duration+'; loop: true; dir: alternate; pauseEvents: pauseColors; resumeEvents: resumeColors;');
        // this.enviroEl.setAttribute('animation__3', 'property: environment.groundColor2; from: '+settings.sceneColor4+'; to: '+settings.sceneColor4Alt+'; dur: '+duration+'; loop: true; dir: alternate; pauseEvents: pauseColors; resumeEvents: resumeColors;');
        // this.enviroEl.setAttribute('animation__4', 'property: environment.dressingColor; from: '+settings.sceneColor4+'; to: '+settings.sceneColor4Alt+'; dur: '+duration+'; loop: true; dir: alternate;  pauseEvents: pauseColors; resumeEvents: resumeColors;');
              // this.el.emit('colorRecover');

      } else {
        // if (this.skyEl) {
        //   this.skyEl.setAttribute('animation', 'property: color; to: '+settings.sceneColor1Alt+'; dur: '+duration+'; loop: true; dir: alternate');
        // // this.skyEl.setAttribute('animation__1', 'property: environment.horizonColor; to: '+settings.sceneColor2Alt+'; dur: '+duration+'; loop: true; dir: alternate');
        // // this.skyEl.setAttribute('animation__2', 'property: environment.groundColor; to: '+settings.sceneColor3Alt+'; dur: '+duration+'; loop: true; dir: alternate');
        // // this.skyEl.setAttribute('animation__3', 'property: environment.groundColor2; to: '+settings.sceneColor4Alt+'; dur: '+duration+'; loop: true; dir: alternate');
        // // this.skyEl.setAttribute('animation__4', 'property: environment.dressingColor; to: '+settings.sceneColor4Alt+'; dur: '+duration+'; loop: true; dir: alternate');
        // }
      }
      // this.el.emit('colorTo');
      // setTimeout(function () { 
        // this.enviroEl.setAttribute('animation_5', 'property: environment.groundColor; to: '+settings.sceneColor3+'; dur: 2500; delay: 2500');
        // this.enviroEl.setAttribute('animation_6', 'property: environment.groundColor2; to: '+settings.sceneColor4+'; dur: 2500; delay: 2500');
        // this.enviroEl.setAttribute('animation_7', 'property: environment.dressingColor; to: '+settings.sceneColor4+'; dur: 2500; delay: 2500');
        // this.enviroEl.setAttribute('animation_8', 'property: environment.skyColor; to: '+settings.sceneColor1+'; dur: 2500; delay: 2500');
        // this.enviroEl.setAttribute('animation_9', 'property: environment.horizonColor; to: '+settings.sceneColor2+'; dur: 2500; delay: 2500');
      // }, 2500);
      }

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
        
        nextButton.addEventListener('click', function () {
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
        previousButton.addEventListener('click', function () {
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
      if (picGroupArray.length > 0) { //todo if pois or multiple equirects
        // let nextbuttonEl = document.getElementById('nextButton');
        // let prevbuttonEl = document.getElementById('previousButton');
        // nextbuttonEl.style.visibility = "visible";
        // prevbuttonEl.style.visibility = "visible";
      }
      console.log("tryna find skybox id " + skyboxID);
      for (let i = 0; i < picGroupArray.length; i++) {
        for (let j = 0; j < picGroupArray[i].images.length; j++) {
          if (picGroupArray[i].images[j]._id == skyboxID) { //todo sniff for equirect
            group = picGroupArray[i];
            let nextbuttonEl = document.getElementById('nextButton');
            let prevbuttonEl = document.getElementById('previousButton');
            nextbuttonEl.style.visibility = "visible";
            prevbuttonEl.style.visibility = "visible";
            break;
          }
        }
      }
      return group;
    },
    returnTileableData: function () {
      //find the group with the skyboxID, if there is one, and return that (can't mix in scene vs. in group skyboxen..?)
      let group = null;
      let picGroupArray = this.data.jsonData;
      // if (picGroupArray.length > 0) {
      //   let nextbuttonEl = document.getElementById('nextButton');
      //   let prevbuttonEl = document.getElementById('previousButton');
      //   nextbuttonEl.style.visibility = "visible";
      //   prevbuttonEl.style.visibility = "visible";
      // }
      console.log("tryna find tileable pics");
      for (let i = 0; i < picGroupArray.length; i++) {
        for (let j = 0; j < picGroupArray[i].images.length; j++) {
          if (picGroupArray[i].images[j].orientation == "Tileable") {
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
    
    this.el.addEventListener('click', function () {
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

AFRAME.registerComponent('particle_mangler', { //nope, deprecated
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
      duration: {default: 0},  
      volume: {default:80} //youtube vol wants 0-100
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
    

    // if (youtubePlayer != null) {
    //   let vol = ((this.data.volume - -80) * 100) / (20 - -80); //vol is stored as -80 to +20
    //   console.log("youtube volume is " + vol);
    //   youtubePlayer.setVolume(vol);
    // }
    this.el.addEventListener('raycaster-intersected', e => {  
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
        if (!youtubeIsPlaying && youtubePlayer) {
          console.log("tryna play youtube");
          youtubePlayer.playVideo();
          PauseIntervals(false);
          // this.el.emit('youtubeToggle', {isPlaying : false}, true);
        } else {
          console.log("tryna pauze youtube");
          youtubePlayer.pauseVideo();
          PauseIntervals(true);
          // this.el.emit('youtubeToggle', {isPlaying : true}, true);
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
    let vol = ((this.data.volume - -80) * 100) / (20 - -80); //vol is stored as -80 to +20
    console.log("youtube volume is " + vol);
    youtubePlayer.setVolume(vol);
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
          console.log("tryna send youtube eve3nt...");
          this.el.emit('youtubeToggle', {isPlaying : true}, true);
          if (this.transportPlayButton != null) {
            this.transportPlayButton.style.color = 'lightgreen';
           
        }
        this.screen.material = this.playingMaterial;
      } else if (state == "paused") {
        console.log("tryna send youtube eve3nt...");
        this.el.emit('youtubeToggle', {isPlaying : false}, true);
          this.play_button.material = this.redmat;
          if (this.transportPlayButton != null) {
            this.transportPlayButton.style.color = 'red';
            // this.el.emit('youtubeToggle', {isPlaying : false}, true);
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
      // playerVars: {
      //   'playsinline': 1
      // },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
    });
    // youtubePlayer.h.attributes.sandbox.value = "allow-presentation";
   

    youtube_player = document.getElementById("youtubePlayer").components.youtube_player;
    // https://stackoverflow.com/questions/55724586/youtube-iframe-without-allow-presentation
    // youtubePlayer.h.attributes.sandbox.value = "allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation";
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
        
        // this.el.emit('youtubeToggle', {isPlaying : true}, true);

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
        // this.el.emit('youtubeToggle', {isPlaying : false}, true);
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

///////////////////// end YOUTUBE PLAYER ABOVE ////////////////////



AFRAME.registerComponent('scene_greeting_dialog', {  //if "greeting" scenetag + sceneResponse.sceneGreeting
  schema: {
    
    font1: {default: ""},
    font2: {default: ""},
    lookAt: {default: false},
    lookAtTarget: {default: "#player"},
    greetingText: {default: ""},
    showQuestText: {default: false},
    questText: {default: ""},
    hideClick: {default: false},
    startButton: {default: true},
    startText: {default: "Start"}
  },
  // dependencies: ['raycaster'],
  init: function () {

    console.log("tryna set scene greeting " + this.data.greetingText);
    if (this.data.font1 != null && this.data.font1 != "") {
      this.font = this.data.font1; 
    } else {
      this.font = "Acme.woff"; 
    }
    // this.font = this.data.font1; 
    if (settings && settings.sceneFontWeb1) {
      this.font = settings.sceneFontWeb1;
    }
    if (this.data.font2 != null && this.data.font2 != "") {
      this.font2 = this.data.font2; 
    } else {
      this.font = "Acme.woff"; 
    }
    // this.font2 = "Acme.woff";
    if (settings && settings.sceneFontWeb2 && settings.sceneFontWeb2.length) {
      this.font2 = settings.sceneFontWeb2;
    }
    this.fillColor = "white";
    this.outlineColor = "black";
    if (settings && settings.sceneFontFillColor) {
      this.fillColor = settings.sceneFontFillColor;
    }
    if (settings && settings.sceneFontOutlineColor) {
      this.outlineColor = settings.sceneFontOutlineColor;
    }
    this.textBackgroundStyle = "Default";
    if (settings && settings.sceneTextBackground) {
      this.textBackgroundStyle = settings.sceneTextBackground;
    }
    this.textBackgroundColor = "black";
    if (settings && settings.sceneTextBackgroundColor) {
      this.textBackgroundColor = settings.sceneTextBackgroundColor;
    }

    // if (this.data.background) {
      // if (this.data.background != "rectangle") {
    // this.backgroundEl = document.createElement("a-entity");
    // this.el.appendChild(this.backgroundEl);
    // this.backgroundEl.setAttribute("position", " 0 0 -.5");
    // this.backgroundEl.setAttribute('geometry', {'primitive': 'plane', 'width': '5', 'height': '5'});
    // this.backgroundEl.setAttribute('material', {opacity: 0});
    // this.backgroundEl.classList.add("activeObjexRay");
    // if (this.data.hideClick) {
    //   this.backgroundEl.addEventListener('click', (e) => {
    //     console.log("tryna hide greeritgn");
    //     this.el.setAttribute("visible", false);
    //   });
    // }

    if (this.data.startButton) {
      this.startButtonBackgroundEl = document.createElement("a-entity");
      this.startButtonTextEl = document.createElement("a-entity");
      this.el.appendChild(this.startButtonBackgroundEl);
      this.el.appendChild(this.startButtonTextEl);
      this.startButtonBackgroundEl.setAttribute("position", " 0 -1 -.01");
      this.startButtonTextEl.setAttribute("position", " 0 -1 0");
      this.startButtonMaterial = new THREE.MeshStandardMaterial( { 'color': this.textBackgroundColor, 'transparent': true, 'opacity': .85 } ); 
      // todo switch bg
      // this.startButtonBackgroundEl.setAttribute('geometry', {'primitive': 'plane', 'width': '1.5', 'height': '.75'});
            this.startButtonBackgroundEl.setAttribute("gltf-model", "#flat_round_rect");

            // // wait until model is loaded
            this.startButtonBackgroundEl.addEventListener('model-loaded', (event) => {
              let obj = this.startButtonBackgroundEl.getObject3D('mesh');
              obj.traverse(node => {
                node.material = this.startButtonMaterial;
              });
            });
            //   this.startButtonBackgroundEl.object3D.traverse(function(object3D){
            //     var mat = object3D.material;
            //     if (mat) {
                  
            //       // modify material here
            //       // mat.color.setRGB(1,0,1)
            
            //       // or replace it completely
            //       object3D.material = this.startButtonMaterial;
                  
            //     }
            //   });
              
            // });
      // this.startButtonBackgroundEl.setAttribute('material', { 'color': this.textBackgroundColor, 'transparent': true, 'opacity': .5 })
      this.startButtonBackgroundEl.classList.add("activeObjexRay");
      this.startButtonTextEl.setAttribute("troika-text", {
        fontSize: .3,
        color: this.fillColor,
        maxWidth: 5,
        align: "center",
        font: "/fonts/web/" + this.font2,
        strokeWidth: '1%',
        strokeColor: this.outlineColor,
        value: this.data.startText
      });

      this.startButtonBackgroundEl.addEventListener('click', (e) => {
        let isPlaying = PlayPauseMedia();
        if (isPlaying) {
          this.startButtonTextEl.setAttribute("troika-text", {
            value: "Pause"
          });
        } else {
          this.startButtonTextEl.setAttribute("troika-text", {
            value: "Play"
          });
        }
        // console.log("tryna start! " + PlayPauseMedia());
        
        // this.startButtonBackgroundEl.setAttribute("visible", false);
      });
    }


      // }
    // }
  

    this.greetingEl = document.createElement("a-entity");
    this.el.appendChild(this.greetingEl);
    this.greetingEl.setAttribute("position", "0 1 0");

    this.questEl = null;
    if (this.data.questText.length) {
      this.questEl = document.createElement("a-entity");
      this.el.appendChild(this.questEl);
      this.questEl.setAttribute("position", "0 0 0");
    }

    this.greetingEl.setAttribute("troika-text", {
      fontSize: .6,
      maxWidth: 5,
      align: "center",
      font: "/fonts/web/" + this.font,
      lineHeight: .85,
      strokeWidth: '1%',
      color: this.fillColor,
      strokeColor: this.outlineColor,
      value: this.data.greetingText
    });
    if (this.questEl) {
      this.questEl.setAttribute("troika-text", {
        fontSize: .2,
        maxWidth: 5,
        align: "center",
        font: "/fonts/web/" + this.font2,
        strokeWidth: '1%',
        color: this.fillColor,
        strokeColor: this.outlineColor,
        value: this.data.questText
      });
    }

   
    // this.viewportHolder = document.getElementById('viewportPlaceholder3');
    // this.viewportHolder.object3D.getWorldPosition( loc );
    // this.el.setAttribute("look-at", "#player");
    // this.el.setAttribute("position", {x: loc.x, y: loc.y + 1, z: loc.z});

    setTimeout(() => { //wait to settle player position, maybe DOMLoaded event? 
      if (settings && settings.sceneFontWeb1) {
        this.font = settings.sceneFontWeb1;
      }
      console.log("tryna set scene greeting " + this.data.greetingText);
      let loc = new THREE.Vector3();
      this.viewportHolder = document.getElementById('viewportPlaceholder3');
      this.viewportHolder.object3D.getWorldPosition( loc );
      
      this.el.setAttribute("position", {x: loc.x, y: loc.y + .55, z: loc.z});
    }, 3000);

    
  },
  setLocation: function () {
    
  }
});
