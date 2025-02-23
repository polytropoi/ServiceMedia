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
let youtubeData = {};



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
    // settingsData: {default: ''},
    sceneType: {default: 'aframe'}
  },
  init: function () {
    
    var sceneEl = document.querySelector('a-scene');
    sceneEl.setAttribute("screen-controls", true);
    let type = this.data.sceneType;
    // let isIOS = DetectiOS();
    let isMobile = AFRAME.utils.device.isMobile();
    let headsetConnected = AFRAME.utils.device.checkHeadsetConnected();

    // let isMacOS = (navigator.appVersion.indexOf('Mac') != -1);
    // this.data.settingsData = settings;
    // console.log("settings " + this.data.settingsData);
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
    sceneEl.addEventListener('loaded', () => { //for sure?
      // console.log("aframe init with isMobile "  + isMobile + " isIOS " + isIOS + " isMacOS " + isMacOS + " headsetConnected " + headsetConnected);

      // console.log("three is" + THREE.path);
      window.sceneType = type;
      // InitSceneHooks(type);
      PrimaryAudioInit();
    
      let envEl = document.getElementById('enviroEl'); 
      if (envEl != null) {
        envEl.setAttribute('enviro_mods', 'enabled', true); //wait till env is init'd to put the mods
      }
     
      this.asky = document.getElementsByTagName('a-sky'); //do all this biz in enviro_mods?

      if (this.asky.length && settings) {
        for (let i = 0; i < this.asky.length; i++) {


        console.log("tryna mod a-sky radius " + settings.sceneSkyRadius);
        // this.asky1 = this.askies[0];
        this.asky[i].setAttribute("radius", parseInt(settings.sceneSkyRadius) + (i * 10));
        this.asky[i].setAttribute('theta-length', 180);
        if (settings.sceneUseSkybox) {
          if (this.asky[i].classList.contains("environment")) { 
            // this.asky[i].visible = false;
            console.log("tryna remove redundant a-sky");
            // this.asky[i].remove();
            
          }
        }
        if (settings.sceneGroundLevel != 0) {
          // let enviroEl = document.getElementById("enviroEl");
          // if (enviroEl) {
            this.asky[i].setAttribute("position", {x: 0, y: settings.sceneGroundLevel * -1, z: 0});
          // }
        }

          }
        }

        
      // }
      if (settings && settings.allowMods) {
        this.el.setAttribute("location_picker", {'enabled': true});
      }
      if (settings && settings.sceneTags && settings.sceneTags.includes("webcam")) {
        // let webcamObj = document.createElement("a-box");
        // // webcamObj.setAttribute("scale", "2 1 2")
        // webcamObj.setAttribute("position", "-5 5 0");
        // webcamObj.setAttribute("material", {src: '#webcam'})

        // this.el.sceneEl.appendChild(webcamObj);
      }
      if (settings && settings.sceneTags && settings.sceneTags.includes("traffic")) {
        let datamgr = document.getElementById("traffic_data");
        if (datamgr) {

          datamgr.components.traffic_data_viz.initMe(settings.sceneDomain);
        }
      }
      // this.el.addEventListener('obbcollisionstarted	', (evt) => {
      //   console.log("obb player hit : " + evt.target.withEl.id);
      // });

      // let curvePointEls = document.querySelectorAll(".curvepoint");
      // if (curvePointEls.length) {
      //    let curvePoints = [];
      //    for (let i = 0; i < curvePointEls.length; i++) {
      //       curvePoints.push(curvePointEls.getAttribute(position));
      //    }
      //    console.log("gots curvepoints " + JSON.stringify(curvePoints));
      // } else {
      //    console.log("din't find no curvepoints");
      // }
      // InitCurves();
   }); //end loaded


  // this.el.addEventListener('mouseenter', (evt) => {
  //   evt.preventDefault();

  //   if (keydown == "X") {
      
  //   if (evt.detail.intersection) {
     
     
  //     let pos = evt.detail.intersection.point; //hitpoint on model
  //     this.hitPosition = pos;

  //     this.distance = evt.detail.intersection.distance;
  //     this.rayhit(evt.detail.intersection.object.name, this.distance, evt.detail.intersection.point);
   
  //     // this.selectedAxis = name;
      
  //     // let elPos = this.el.getAttribute('position');
  //     // console.log(pos);

  //     }
  //   }
  // });


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
  },

  // tick: function () {
  //   if (keydown == "X") {
        
  //   }
    
  // }
  

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


          let vidmat = this.el.components.vid_materials;
          if (vidmat) {
            console.log("tryna flip vidmat");
            vidmat.flipY = true;
            this.el.setAttribute("scale", ".3 .3 .3");
            this.el.setAttribute("rotation", "90 0 0");
          }

            console.log("tryna parent " + this.el + " to " + this.data.tracking + " at position " + JSON.stringify(marker.getAttribute("position")));
            // var target = document.querySelector('.target');
        } else {
          marker = document.querySelector("a-nft");
          if (marker != null) {
            console.log("gotsa nft marker");
            marker.setAttribute("visible", "true");
            this.el.position = marker.position;
            marker.appendChild(this.el);
  

            this.el.setAttribute("rotation", "90 0 0");
            let vidmat = this.el.components.vid_materials;
            if (vidmat) {
              vidmat.flipY = true;
            }

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
  
    // this.el.addEventListener("hitstart_nope", function(event) {  //we're attached to the same player element that has the aabb-collider component, so listening here for player trigger hits
    //   // var source = event.originalTarget;
    //   console.log(
    //     "player TRIGGER event from " + event.target.components["aabb-collider"]["closestIntersectedEl"].id
    //       // "TRIGGER event from " + source.id
    //     // event.srcElement.id
    //   );
    //   //local and cloud marker types have triggers, gates, portals, placeholders
    //   let cloud_marker = event.target.components["aabb-collider"]["closestIntersectedEl"].components.cloud_marker; //closest trigger if multiple
    //   if (cloud_marker != null) { 
    //     cloud_marker.playerTriggerHit(); //tell the trigger that player has hit!
    //   } else {
    //     let local_marker = event.target.components["aabb-collider"]["closestIntersectedEl"].components.local_marker; //closest trigger if multiple
    //     if (local_marker != null) { 
    //       local_marker.playerTriggerHit(); //tell the trigger that player has hit!
    //     }
    //   }
    // });

    // this.el.addEventListener('obbcollisionstarted	', (evt) => {
    //     console.log("obb player hit : " + evt.target.withEl.id);
    // });
  // this.el.addEventListener('obbcollisionended	', (evt) => {
  //     this.obbHit(evt);
  // });
    
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

// AFRAME.registerComponent('listen-for-vr-mode', { //attached to cam entity, update the scene listener to cam position every tick
//   init: function () {
//     document.querySelector('a-scene').addEventListener('enter-vr', function () { //no matter what
//       // console.log("ENTERED VR");
//       let player = document.getElementById("player");
//       player.setAttribute("look-controls", {'hmdEnabled': true});
//     });
//   }
// }); //end register


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

  // document.querySelector('a-scene').components.screenshot.capture('perspective');

// });

AFRAME.registerComponent('scene_text_display', {
  schema: {
      // font: {default: ""},
      title: {default: ''},
      textString: {default: ''},
      mode: {default: 'paged'},
      scale: {default: 1},
      jsonData: {default: ''},
      font: {default: ''}
    },
    init: function () {
      // let theData = this.el.getAttribute('data-maintext');
      this.isVisible = true;
      console.log("scene_text_display " + this.data.textString);
      // this.data.jsonData = JSON.parse(atob(theData)); //convert from base64
      // // console.log(this.data.jsonData);
      // this.data.textString = this.data.jsonData;
      let textArray = [];
      let index = 0;  
      // let nextButton = document.getElementById("nextMainText");
      // let previousButton = document.getElementById("previousMainText");
      // let textHeader = document.getElementById("textHeader");
      let nextButton = document.createElement("a-entity");
      let previousButton = document.createElement("a-entity");
      let textHeader = document.createElement("a-entity");
      let textTitle = document.createElement("a-entity");
      let textBody = document.createElement("a-entity");
      let textBackground = document.createElement("a-entity");
      let textContainer = document.createElement("a-entity");

      this.el.sceneEl.appendChild(textContainer);
      // textContainer.setAttribute('position', this.el.getAttribute("position"))
      textContainer.appendChild(nextButton);
      textContainer.appendChild(previousButton);
      textContainer.appendChild(textHeader);
      textContainer.appendChild(textTitle);
      textContainer.appendChild(textBody);
      textContainer.appendChild(textBackground);

      // textContainer.setAttribute("position", {x: 0, y: 0, z: -.1});
      textContainer.setAttribute('position', this.el.getAttribute("position"));
      textContainer.setAttribute('scale', {x: this.data.scale, y: this.data.scale, z: this.data.scale})
      textTitle.setAttribute("position", {x: -4.25, y: 7, z: 0});
      textHeader.setAttribute("position", {x: 4.25, y: 7, z: 0});
      textBody.setAttribute("position", {x: -4, y: 6.5, z: 0});
      textBackground.setAttribute("position", {x: 0, y: -.25, z: -.1});
      previousButton.setAttribute("position", {x: -1, y: .25  , z: .1});
      nextButton.setAttribute("position", {x: 1, y: .25, z: .1});
      textBackground.setAttribute("gltf-model", "#textbackground");
      nextButton.setAttribute("gltf-model", "#next_button");
      previousButton.setAttribute("gltf-model", "#previous_button");
      textBackground.setAttribute("scale", {x: 2.25, y: 2.25, z: 2.25});
      nextButton.setAttribute("scale", {x: .2, y: .2, z: .2});
      previousButton.setAttribute("scale", {x: .2, y: .2, z: .2});
      nextButton.classList.add("activeObjexRay");
      previousButton.classList.add("activeObjexRay");
      textContainer.setAttribute("look-at-y", "#player");
      // textContainer.setAttribute

      if (this.data.textString != undefined) {
          // console.log("maintext " + this.data.textString);
          console.log(this.data.mode + " string length : "+ this.data.textString.length);
          if (this.data.mode.toLowerCase() == "paged" && this.data.textString.length > 700) { //pagination!
            console.log("string length : "+ this.data.textString);
            let indexes = [];  //array for split indexes;
            let lastIndex = 0;
            let wordSplit = this.data.textString.split(" ");
            for (let i = 0; i < this.data.textString.length - 1; i++) {
              if (i == 700 + lastIndex) {
                lastIndex = this.data.textString.indexOf(' ', i); //get closest space to char count
                indexes.push(lastIndex);
              }
            }
            for (let s = 0; s < indexes.length; s++) {
              if (s == 0) {
                let enc = this.data.textString.substring(0, indexes[s]);
                // textArray.push(this.data.textString.substring(0, indexes[s]));
                textArray.push(enc);
                console.log("textArray[0] " + textArray[s]);
                
              } else {
                // let chunk = encodeURI(this.data.textString.substring(indexes[s], indexes[s+1]));
              let chunk = this.data.textString.substring(indexes[s], indexes[s+1]);
              // console.log("tryna push chunck: " + chunk);
              textArray.push(chunk);
              console.log("textArray " + s + " " + textArray[s]);
              }
            }

          } else { //if mode == "split"
            textArray = this.data.textString.split("~"); //TODO scroll

          }      

          this.textArray = textArray;

          this.font = "Acme.woff";

          if (settings && settings.sceneFontWeb2) {
            this.font = settings.sceneFontWeb2;
          }
          textBody.setAttribute('troika-text', {
            value: this.textArray[0],
            font: '../fonts/web/' + this.font,
            lineHeight: 1.5,
            baseline: "top",
                anchor: "left",
            maxWidth: 8.25,
            fontSize: .3,
            color: 'black'
           
            // strokeColor: 'white',
            // strokeWidth: '1%'

          });

          let uiMaterial = new THREE.MeshStandardMaterial({ color: 'black' }); 
          if (this.textArray.length > 1) {
            textHeader.setAttribute('visible', true);

              textHeader.setAttribute('troika-text', {
                baseline: "top",
                anchor: "right",
                value: "page 1 of " + textArray.length,
                font: '../fonts/web/' + this.font,
                lineHeight: .85,
                maxWidth: 2,
                fontSize: .2,
                color: 'black'
            });
            textTitle.setAttribute('visible', true);

            textTitle.setAttribute('troika-text', {
              baseline: "top",
              anchor: "left",
              value: this.data.title,
              font: '../fonts/web/' + this.font,
              lineHeight: .85,
              maxWidth: 7,
              fontSize: .2,
              color: 'black'
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
            nextButton.addEventListener('click', function (e) {
              // preventDefault(e);
              e.stopPropagation();
              console.log('tryna click index ' + index);
                  if (textArray.length > index + 1) {
                      index++;
                  } else {
                      index = 0;
                  }
                  textBody.setAttribute('troika-text', {
                      value: textArray[index]
                  });
                  textHeader.setAttribute('troika-text', {
                    value: "page "+(index+1)+" of " + textArray.length
                  });
              });

              previousButton.addEventListener('click', function (e) {
                e.stopPropagation();
                if (index > 0) {
                    index--;
                } else {
                    index = textArray.length - 1;
                }
                // console.log(textArray[index]);
                textBody.setAttribute('troika-text', {
                  // baseline: "top",
                  // align: "left",
                    value: textArray[index]
                });
                textHeader.setAttribute('troika-text', {

                  value: "page "+(index+1)+" of " + textArray.length
              });
          });
        }
      }
      this.nextButton = nextButton;
      this.previousButton = previousButton;
      this.textBody = textBody;
      this.textHeader = textHeader;
      this.textTitle = textTitle;
      this.textBackground = textBackground;
  },
  toggleVisibility: function () {

    this.isVisible = !this.isVisible;
    console.log("isVisible " + this.isVisible);
    this.nextButton.object3D.visible = this.isVisible;
    this.previousButton.object3D.visible = this.isVisible;
    this.textBody.object3D.visible = this.isVisible;
    this.textTitle.object3D.visible = this.isVisible;
    this.textBackground.object3D.visible = this.isVisible;
    this.textHeader.object3D.visible = this.isVisible;
  }
});

AFRAME.registerComponent('main-text-control', {
    schema: {
        // font: {default: ""},
        mainTextString: {default: ''},
        mode: {default: ''},
        jsonData: {default: ''},
        font: {default: ''}
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

            } else { //if mode == "split"
              textArray = this.data.mainTextString.split("~"); //TODO scroll
            }      

            this.textArray = textArray;

            this.font = "Acme.woff";

            if (settings && settings.sceneFontWeb1) {
              this.font = settings.sceneFontWeb1;
            }
            document.querySelector("#mainText").setAttribute('troika-text', {
              value: this.textArray[0],
              font: '../fonts/web/' + this.font,
              lineHeight: 1,
              baseline: "top",
                  anchor: "left",
              maxWidth: 10,
              fontSize: .6,
              color: 'white',
             
              strokeColor: 'black',
              strokeWidth: '1%'

            });

            let uiMaterial = new THREE.MeshStandardMaterial( { color: '#63B671' } ); 
            if (this.textArray.length > 1) {
              mainTextHeader.setAttribute('visible', true);

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

                    document.querySelector("#mainText").setAttribute('troika-text', {

                        value: textArray[index]
                    });
                    mainTextHeader.setAttribute('troika-text', {

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
AFRAME.registerComponent('available_scenes_control', {
  schema: {
    jsonData: {default: ""}
    },
    init: function () {

      let theData = this.el.getAttribute('data-availablescenes');
      // console.log("attributions data" + theData);
      
      this.data.jsonData = JSON.parse(atob(theData)); //convert from base64
      this.textureArray = [];
      // const data = this.data;
      let scenesArray = this.data.jsonData.availableScenes; 
      // console.log("availablescenes: " + JSON.stringify(scenesArray));
      let availableScenePicEl = document.getElementById("availableScenePic");
      let nextButton = document.getElementById("availableScenesNextButton");
      let previousButton = document.getElementById("availableScenesPreviousButton");

      // for (let i = 1; i < 7; i++) {
      //   this.envmapEl = document.querySelector("#envmap_" + i);
      //   if (this.envmapEl) {
      //   this.path = this.envmapEl.getAttribute("src");
      //   // console.log("envMap path " + this.path);
      //   this.textureArray.push(this.path);
      //   }
      // }
      // this.texture = new THREE.CubeTextureLoader().load(this.textureArray);
      // this.texture.format = THREE[data.format];

      let uiMaterial = new THREE.MeshStandardMaterial( { color: 'gold' } );   
      // uiMaterial.envMap = this.texture;        
      // uiMaterial.envMap.intensity = .5;
      // uiMaterial.needsUpdate = true;

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
        console.log('toggleOnAvailableScenes event detected with', event.detail);
        let mesh = this.pictureGroupPicEl.getObject3D('mesh');
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
      this.scenesArray = scenesArray;
    },
    returnRandomScene: function () {
      if (this.scenesArray && this.scenesArray.length > 0) {
        let index = Math.floor(Math.random() * this.scenesArray.length);
        console.log ("tryna get available scene " + index  + " " + JSON.stringify(this.scenesArray[index]));
        return this.scenesArray[index];
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
          // // console.log(scenesPanelEl.getAttribute('available_scenes_control', jsonData.availableScenes));
          // // console.log(scenesArray);
          // var scene = scenesArray[Math.floor(Math.random() * scenesArray.length)];
          let sceneHref = "";
          if (scenesArray.length) {
            sceneHref = "/webxr/" + scenesArray[0].sceneKey;
          } 
          
          console.log("sceneHref : "+sceneHref);
          // document.getElementById("availableScenePic").setAttribute('basic-scene-link', {href: sceneHref});
          document.getElementById("availableScenePic").setAttribute('link', {href: sceneHref});

        } else {
          scenesPanelEl.setAttribute('visible', false);

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
        // calloutEntity.setAttribute("look-at", "#player");
        if (settings && settings.sceneCameraMode == "Third Person") {
          calloutEntity.setAttribute("look-at", "#thirdPersonCamera");
        } else {
          calloutEntity.setAttribute("look-at", "#player");
        }
        calloutEntity.setAttribute('visible', false);
        // calloutEntity.setAttribute("render-order", "hud");
        sceneEl.appendChild(calloutEntity);
        calloutEntity.appendChild(calloutText);
        calloutText.setAttribute("position", '0 .1 .1'); //offset the child on z toward camera, to prevent overlap on model
        calloutText.setAttribute('troika-text', {
          baseline: "top",
          align: "center",
          font: "/fonts/web/" + this.font,
          fontSize: .05,
          anchor: "center",
          outlineColor: "black",
          outlineWidth: "2%",
          color: "white",
          value: this.data.calloutString
        });
        this.el.addEventListener('mouseenter', function (evt) {
          console.log("tryna mouseover entity-callout ");
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
      // calloutEntity.setAttribute("look-at", "#player");
      if (settings && settings.sceneCameraMode == "Third Person") {
        calloutEntity.setAttribute("look-at", "#thirdPersonCamera");
      } else {
        calloutEntity.setAttribute("look-at", "#player");
      }
      
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
        color: "white",
        outlineColor: "black",
        outlineWidth: "2%",
        value: calloutString
      });
      this.el.addEventListener('mouseenter', function (evt) {
        // this.modelHitDistance = this.modParent.returnHitDistance();
        if (evt.detail.intersection) {
          this.modelHitDistance = evt.detail.intersection.distance;
          console.log("hit distance is " + evt.detail.intersection.distance);
          
          // console.log("hit distance is " + JSON.stringify(this.modelHitDistance));
          calloutEntity.setAttribute('visible', true);
          let pos = evt.detail.intersection.point; //hitpoint on model
          calloutEntity.setAttribute("position", pos);
          calloutEntity.setAttribute("scale", {"x": this.modelHitDistance * .1, "y": this.modelHitDistance * .1, "z": this.modelHitDistance * .1});
        }
        // calloutText.updateMatrixWorld();
      });
      this.el.addEventListener('mouseleave', function (evt) {
        // console.log("tryna mouseexit");
        calloutEntity.setAttribute('visible', false);
      });
    }
  });

  //reusable lerping function for position/rotation, by #id, used eg for avatar movement
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
      var DEG2RAD = THREE.MathUtils.DEG2RAD;
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
            currentRot =  element.getAttribute('rotation');
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
      lookAtElID: {default: ''},
      init: {default: false}
      
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
      this.timeDelta = .01;
      this.isLerping = false;


    },
    move: (function (id, pos, rot, duration) { //called directly from connect.js 
      // console.log("pos " + JSON.stringify(pos));
      for (let i = 0; i < this.intervals.length; i++) { //stop previous commands when a new one comes in
        clearInterval(this.intervals[i]);
      }
      this.intervals = [];
      var DEG2RAD = THREE.MathUtils.DEG2RAD;
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
        if (rot != null && allowCameraLock) {
          console.log("tryna snap to " + JSON.stringify(rot));
          element.setAttribute('rotation', rot);
        }

        element.setAttribute('position', pos);

      } else { //Player Lerp
        // console.log("duration is " + duration);
        if (allowCameraLock) {
          if (!duration) {
            duration = 1;
          }
          let durationAll = duration * 10;
          this.currentPos = currentPos;
          // lastLerpedPos = currentPos;
          element.setAttribute('wasd-controls-enabled', false);
          // let that = this;
          this.interval = setInterval(() => {
            this.isLerping = true;
            iteration++
            if (iteration < durationAll) { 
              var lerpedPos = {};
              lerpedPos.x = lerp(currentPos.x, pos.x, (this.timeDelta * iteration)/durationAll);
              lerpedPos.y = lerp(currentPos.y, pos.y, (this.timeDelta * iteration)/durationAll);
              lerpedPos.z = lerp(currentPos.z, pos.z,  (this.timeDelta * iteration)/durationAll);
              element.setAttribute('position', lerpedPos);
          
            } else {
              clearInterval(this.interval);
              this.isLerping = false;
            } 
          }, 100);
              this.intervals.push(this.interval);
          }
        }
      }),
      lookAt : function (duration, targetElID) { //no slerp yet!?
        console.log("tryna look at " + targetElID + " allowCameraLock " + allowCameraLock); 
        let element = document.getElementById("player");
        if (allowCameraLock) { //declared connect.js
          
            console.log("tryna lookat for " + duration);
          element.setAttribute('look-controls', {enabled: false});
          element.setAttribute("look-at", targetElID);
          if (duration != 0) {
            setTimeout(function () {
              element.setAttribute('look-controls', {enabled: true});
              element.removeAttribute("look-at");
            }, parseInt(duration));
          }
        } else {
          element.setAttribute('look-controls', {enabled: true});
          element.removeAttribute("look-at");
        }
      },
      tick: function (time, timeDelta) {
        if (this.isLerping) {
          this.timeDelta = timeDelta / 1000;
        }
        

      }
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
        // calloutEntity.setAttribute("look-at", "#player");
        if (settings && settings.sceneCameraMode == "Third Person") {
          calloutEntity.setAttribute("look-at", "#thirdPersonCamera");
        } else {
          calloutEntity.setAttribute("look-at", "#player");
        }
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
  this.messageType = null;
  this.meshObj = null;
  this.panelString = "";

  this.font2 = "Acme.woff";

  if (settings && settings.sceneFontWeb2) {
      this.font2 = settings.sceneFontWeb2;
  }

  this.el.addEventListener('model-loaded', () => {  
    if (settings && settings.sceneFontWeb2) {
        this.font2 = settings.sceneFontWeb2;
    }
    this.viewportHolder = document.getElementById('viewportPlaceholder'); 
    // this.viewportHolder.object3D.getWorldPosition( this.cameraPosition );
    this.el.setAttribute('position', {x: 0, y:-1000, z:0}); //it's invisible, but set it out of the way so it don't block
    // console.log("TRYNA SET POSITIONF RO MOD_DIALGO " + JSON.stringify(this.cameraPosition));
    if (settings && settings.sceneCameraMode == "Third Person") {
      this.el.setAttribute("look-at", "#thirdPersonCamera");
    } else {
      this.el.setAttribute("look-at", "#player");
    }
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

    // this.el.addEventListener('mouseenter', (evt) => {
    //   let name = evt.detail.intersection.object.name;
    //   console.log(name);
    // });
    this.el.setAttribute("overlay");

  });
  

  // this.dial
  // let that = this;
  },
  showPanel: function (panelString, objectID, messageType, duration, sourceElementID) { //objectID = referenced elementID

    this.objID = objectID;
    this.messageType = messageType;
    this.sourceElementID = sourceElementID;
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
    console.log("tryna set mod_dialog string " +panelString+ " at position " + JSON.stringify(this.cameraPosition) + " messageType " + messageType +  " duration " + duration+  " sourceEl " + sourceElementID);
    // this.dialogText.setAttribute('value', panelString);
    this.dialogText.setAttribute('troika-text', {
      maxWidth: .9,
      baseline: "bottom",
      align: "left",
      fontSize: .05,
      font: "/fonts/web/"+ this.font2,
      anchor: "center",
      color: "white",
      outlineColor: "black",
      outlineWidth: "2%",
      value: panelString
      });

    if (duration > 0) {
      this.waitAndHide(duration);
    }
  },
  okButton: function () {
    this.el.setAttribute("visible", false);
    this.dialogPanel.classList.remove('activeObjexRay');
  },
  yesButton: function () {
    if (this.objID) {
      console.log("yesbutton for " + this.objID);
      // this.el.setAttribute("visible", false);
      if (this.objID.includes("href~")) {
        if (this.messageType == "gatePass") {
          let urlSplit = this.objID.split("~");
          window.location.href = urlSplit[1];
          // window.open(urlSplit[1], "_blank");
          this.el.setAttribute("visible", false);
          this.dialogPanel.classList.remove('activeObjexRay');
        } else if (this.messageType == "linkOpen") {
          let urlSplit = this.objID.split("~");
          // window.location.href = urlSplit[1];
          window.open(urlSplit[1], "_blank");
          this.el.setAttribute("visible", false);
          this.dialogPanel.classList.remove('activeObjexRay');
        } 
      } else {
        this.el.setAttribute("visible", false);
        this.dialogPanel.classList.remove('activeObjexRay');
        // let objEl = document.getElementById(this.objID);
        // if (objEl != null) {
          // objEl.components.mod_object.activated();
          if (this.messageType == "equipMe") {
            // if (objEl.components.mod_object) {
              // let equipObjID = objEl.components.mod_object.data.objectData._id;
              // console.log("tryna equipMe objID " + equipObjID);
              DequipAndDropItem();
              let objEl = document.getElementById(this.sourceElementID);
              if (objEl) {
                objEl.removeAttribute('ammo-shape');
                objEl.removeAttribute('ammo-body');
                objEl.parentNode.removeChild(objEl);
              }

              EquipDefaultItem(this.objID);
            // } else {
            //   console.log("din't fine no equipMe element");
            // }
          } else if (this.messageType == "pickMeUp") {
            let objEl = document.getElementById(this.objID); //here it's the elementID
            if (objEl != null) {
              objEl.components.mod_object.activated(); //hrm... what other actions?
            }
          }
          // objEl.components.mod_object.hideObject();
        }
      // }
    } else {
      if (this.messageType == "recentCloudMods") { //warning dialog when cloud timestamp more recent than local
        DeleteLocalSceneData();
        setTimeout(function () {
          window.location.reload();
        }, 2000);
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
    // this.dialogText.setAttribute('value', this.panelString);  
    this.dialogText.setAttribute('troika-text', {
      maxWidth: .9,
      baseline: "bottom",
      align: "left",
      fontSize: .05,
      font: "/fonts/web/"+ this.font2,
      anchor: "center",
      color: "white",
      outlineColor: "black",
      outlineWidth: "2%",
      value: this.panelString
      });
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
    this.waitAndHide(2000);
      // setTimeout(function () {
      //   this.el.components.mod_dialog.hidePanel();
      // }, 3000);
  }, 
  repeatResponse: function () {
    // this.dialogText.setAttribute('value', this.panelString);  
    this.dialogText.setAttribute('troika-text', {
      maxWidth: .9,
      baseline: "bottom",
      align: "left",
      fontSize: .05,
      font: "/fonts/web/"+ this.font2,
      anchor: "center",
      color: "white",
      outlineColor: "black",
      outlineWidth: "2%",
      value: this.panelString
      });

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
    this.waitAndHide(2000);
  }, 
  waitAndHide: function (duration) {
    // console.log("tryna wait and hide");
    if (this.el.getAttribute("visible") == true) {
      // console.log("tryna wait and hide for " + duration);
      setTimeout(() =>{ 
        this.el.setAttribute("visible", false);
        this.dialogPanel.classList.remove('activeObjexRay');
      }, duration);
    }
  }
});

// function WaitAndHideDialogPanel (time) {
//   let dialog = document.getElementById("mod_dialog");
//   let panel = document.getElementById("mod_dialog_panel");
//   if (dialog.getAttribute("visible") == true) {
//     setTimeout(() =>{ dialog.setAttribute("visible", false);
//     panel.classList.remove('activeObjexRay');
//     }, time);
//   }
// }


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
          // this.texture.colorSpace = THREE.sRGBEncoding;
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
    id: {default: ''}
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
      this.nextSkybox();
    } else {
      // this.skyboxData = picGroupMangler.components.picture_groups_control.returnSkyboxData(this.data.id);
      // this.nextSkybox();
      this.singleSkybox(); //maybe tryna do this before models are loaded, is the problem..
    }
    // let that = this;
  },
  initMe: function () {
    let picGroupMangler = document.getElementById("pictureGroupsData");

    if (picGroupMangler != null && picGroupMangler != undefined && picGroupMangler.components.picture_groups_control) {
      this.skyboxData = picGroupMangler.components.picture_groups_control.returnSkyboxData(settings.skyboxIDs[0]);
      // console.log(JSON.stringify(this.skyboxData));
      this.nextSkybox();
    } else {
      // this.skyboxData = picGroupMangler.components.picture_groups_control.returnSkyboxData(settings.skyboxIDs[0]);
      // this.nextSkybox();
      this.singleSkybox(); //maybe tryna do this before models are loaded, is the problem..
    }
  },
  singleSkybox: function () {

    // const ref = document.getElementById("sky");
    console.log("single skyboxURL : " + settings.skyboxURL);

   this.texture = new THREE.TextureLoader().load(settings.skyboxURL);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.mapping = THREE.EquirectangularReflectionMapping;
    this.texture.minFilter = this.texture.magFilter = THREE.LinearFilter;
    // if (window.sceneType != undefined && !window.sceneType.toLower().includes('ar')) {
      // this.el.sceneEl.object3D.background = this.texture;
    // }
    this.el.setAttribute("src", settings.skyboxURL);
    // this.texture = this.texture;
    // this.applyEnvMap();
    if (this.skyEl != null) {
      // this.skyEl.remove();
      // this.skyEl.setAttribute('visible', false);
      }
  },
  nextSkybox: function () {
    
    console.log("tryna get next skybox");
    if (this.skyboxData != null && this.skyboxData != undefined) {
      if (this.skyboxIndex < this.skyboxData.images.length - 1) {
        this.skyboxIndex++;
      } else {
        this.skyboxIndex = 0;
      }
    console.log("skybod index : " + this.skyboxIndex + " url " + this.skyboxData.images[this.skyboxIndex].url);
    const mesh = this.el.object3DMap.mesh;
    const loader = new THREE.TextureLoader();
    // load a resource
    loader.load(
      // resource URL
      this.skyboxData.images[this.skyboxIndex].url,
      function ( texture ) {
        if (mesh) {
          
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.mapping = THREE.EquirectangularReflectionMapping;
          mesh.material.map = texture;
          mesh.material.needsUpdate = true;
          //apply new envmap to appropriate geos
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
                  node.material.envMap = texture;
                  // node.material.needsUpdate = true;
                  }
                });
              }
            }
          }
          }
      },
      undefined,
      function ( err ) {
        console.error( 'skybox texture load error happened.' );
      }
    );
    
    this.applyEnvMap();
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
    // let askyEl = document.getElementById('a_sky');
    // askyEl.setAttribute("a-sky", {"src": this.skyboxData.images[this.skyboxIndex].url});
    // // skyEl.setAttribute('visible', false);
    // console.log(this.skyboxData.images[this.skyboxIndex].url);
    // this.texture = new THREE.TextureLoader().load(this.skyboxData.images[this.skyboxIndex].url);
    // this.texture.encoding = THREE.sRGBEncoding;
    // this.texture.mapping = THREE.EquirectangularReflectionMapping;
    // this.texture.minFilter = this.texture.magFilter = THREE.LinearFilter;
    // this.el.sceneEl.object3D.background = this.texture;
    // // this.texture = this.texture;
    // this.applyEnvMap();
    // if (this.skyEl != null) {
    //   // this.skyEl.remove();
    //   this.skyEl.setAttribute('visible', false);
    //   }
    const mesh = this.el.object3DMap.mesh;
    const loader = new THREE.TextureLoader();
    // load a resource
    loader.load(
      // resource URL
      this.skyboxData.images[this.skyboxIndex].url,
      function ( texture ) {
        if (mesh) {
          // this.texture = texture;
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.mapping = THREE.EquirectangularReflectionMapping;
          mesh.material.map = texture;
          mesh.material.needsUpdate = true;
          applyEnvMap(texture);
          }
          
      },
      undefined, //proogreeess no has
      function ( err ) {
        console.error( 'skybox texture load error happened.' );
      }
    );

    }
  },
  applyEnvMap: function () {
    console.log("tryna applyEnvMap");
    // const envMap = this.texture;  
    // envMap.mapping = THREE.EquirectangularReflectionMapping;
    let envMapObjex = document.getElementsByClassName('envMap');
    // console.log("envMap elements " + envMapObjex.length + " with this.texture " + this.texture);
    if (envMapObjex != null) {
      // this.texture = new THREE.TextureLoader().load(this.skyboxData.images[this.skyboxIndex].url);
      // this.texture.colorSpace = THREE.SRGBColorSpace;
      // this.texture.mapping = THREE.EquirectangularReflectionMapping;
      // this.texture.minFilter = this.texture.magFilter = THREE.LinearFilter;
      this.mesh = null;
      for (let i = 0; i < envMapObjex.length; i++) {
        // console.log("envMap element " + i + " " + envMapObjex.id);
        this.mesh = envMapObjex[i].getObject3D('mesh');

      if (this.mesh != null) {
        this.mesh.traverse(function (node) {

        if (node.material && 'envMap' in node.material) {
        // if (node.material) {
          // console.log("tryna set envmap on " + node.material.name);
            node.material.envMap = this.texture;
            // node.material.envMap.intensity = .5;
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

// function applyEnvMap(envMap) {
//   // const envMap = texture;  
//   // envMap.mapping = THREE.EquirectangularReflectionMapping;
//   let envMapObjex = document.getElementsByClassName('envMap');
//   console.log("envMap elements " + envMapObjex.length + " with this.texture " + envMap);
//   if (envMap && envMapObjex != null) {
//     this.mesh = null;
//     for (let i = 0; i < envMapObjex.length; i++) {
//       // console.log("envMap element " + i + " " + envMapObjex.id);
//       this.mesh = envMapObjex[i].getObject3D('mesh');

//     if (this.mesh != null) {
//       this.mesh.traverse(function (node) {

//       if (node.material && 'envMap' in node.material) {
//       // if (node.material) {
//         console.log("tryna set envmap on " + node.material.name);
//           node.material.envMap = envMap;
//           // node.material.envMap.intensity = .5;
//           node.material.needsUpdate = true;
//           }
//         });
//       }
//     }
//   }
// }

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
    enabled: {default: true},
    preset: {default: ''}
  }, 
  init: function () {
    console.log('tryna init enviro_mods');
    this.enviroDressing = document.querySelector('.environmentDressing');
    this.enviroGround = document.querySelector('.environmentGround');
    this.enviroEl = document.getElementById('enviroEl');
    // this.skyEl = document.getElementById('a_sky');
    this.isLerping = false;
    this.isTweaking = false;
    if (this.data.preset != '') {
      this.loadPreset(this.data.preset);
    }
    if (this.enviroGround && settings.sceneGroundLevel != 0) {
      // this.enviroGround.setAttribute("position", {x: 0, y: settings.sceneGroundLevel, z: 0});
    }
    

  },
  loadPreset: function(preset) {
    console.log("tryna set enviro to " + preset + " fogDensity " + settings.sceneFogDensity );
    let fogDensity = 0;
    if (settings.sceneFogDensity) {
      fogDensity = settings.sceneFogDensity;

    }
    if (!settings.sceneUseFog || fogDensity == 0) {
      this.el.sceneEl.removeAttribute("fog");
    } else {
      if (this.enviroEl) {

        this.enviroEl.setAttribute("environment", {'preset': preset, 'fog': fogDensity});
      }
    }
   
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
    // this.el.setAttribute('scale', scale);
    
    if (this.enviroDressing != null) {
        
        this.enviroDressing.setAttribute('scale', scale2 );
        this.enviroDressing.setAttribute('animation', 'property: scale; to: 1 1 1; dur: 250; startEvents: beatRecover');
        this.enviroDressing.emit('beatRecover');

    }


  },
  colortweak: function () {
    console.log("colortweak");
    this.enviroEl.setAttribute('environment', {
      groundColor: "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}),
      groundColor2: "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}),
      dressingColor: "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}),
      skyColor: "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}),
      horizonColor: "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}),
      fogColor: "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);})
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
        this.enviroEl.setAttribute('animation__3', 'property: environment.groundColor; from: '+settings.sceneColor3+'; to: '+settings.sceneColor3Alt+'; dur: '+duration+'; loop: true; dir: alternate; pauseEvents: pauseColors; resumeEvents: resumeColors;');
        this.enviroEl.setAttribute('animation__4', 'property: environment.groundColor2; from: '+settings.sceneColor4+'; to: '+settings.sceneColor4Alt+'; dur: '+duration+'; loop: true; dir: alternate; pauseEvents: pauseColors; resumeEvents: resumeColors;');
        this.enviroEl.setAttribute('animation__5', 'property: environment.dressingColor; from: '+settings.sceneColor4+'; to: '+settings.sceneColor4Alt+'; dur: '+duration+'; loop: true; dir: alternate; pauseEvents: pauseColors; resumeEvents: resumeColors;');
        
      } 
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

});
AFRAME.registerComponent('location_picker', { //TODO toggle on if needed, off by default..
  schema: {
    enabled: {default: false},
  },
  init: function () {
    console.log("tryna set location_picker raycaster");
    this.tick = AFRAME.utils.throttleTick(this.tick, 300, this);
    this.sceneEl = document.querySelector('a-scene');
    this.raycaster = new THREE.Raycaster();
    this.locationPicked = null;
    this.picking = false;
    this.pickerEl = document.createElement("a-entity");
    this.pickerEl.id = "picker";
    this.el.sceneEl.appendChild(this.pickerEl);
    this.pickerEl.setAttribute('gltf-model', '#poi1');
    this.el.addEventListener('model-loaded', (e) => {
      this.pickerEl.setAttribute("material", {color: "purple", transparent: true, opacity: .5});
      // this.pickerEl.style.visibility = "hidden";
      // this.pickerEl.object3D.visible = false;
    });
 
      window.addEventListener('mouseup', (e) => { 
      e.preventDefault();
      if (keydown == "X" && !this.picking) {
          this.picking = true;
          // this.pickerEl.style.visibility = "hidden";
          this.pickerEl.object3D.visible = false;
          console.log("gotsa locationPicked "+ this.locationPicked);
          // keydown = 
          if (this.locationPicked) {
            CreateLocation(null, "poi", this.locationPicked);
          }
          
          this.reset();
        } else {
          // this.pickerEl.style.visibility = "hidden";
          this.pickerEl.object3D.visible = false;
        }
      }); 
  },
  reset: function () {
    setTimeout(() =>  {
      this.picking = false;
      // this.pickerEl.object3D.visible = true;
    }, 1000);
  },
  tick: function () {

    if (!this.raycaster || this.raycaster == null || this.raycaster == undefined || keydown != "X") {
      if (this.pickerEl.object3D.visible) {
        this.pickerEl.object3D.visible = false;
      }
      // this.pickerEl.style.visibility = "hidden";
      // this.pickerEl.object3D.visible = false;

      // return;
    } else {
      // console.log("tryna sert raycaster " + keydown);
      // if (keydown == "x") 
      this.raycaster.setFromCamera( mouse, AFRAME.scenes[0].camera ); 
      // this.intersection = this.raycaster.intersectObject( this.el.sceneEl.children );
      const intersects = this.raycaster.intersectObjects( this.sceneEl.object3D.children );

      if (intersects.length && !this.picking) {
        this.locationPicked = intersects[0].point;
        // this.pickerEl.style.visibility = "visible";
        if (!this.pickerEl.object3D.visible) {
          this.pickerEl.object3D.visible = true;
        }
        
        this.pickerEl.setAttribute("position", this.locationPicked);
        console.log("this.locationPicked " + JSON.stringify(this.locationPicked));

      } else {
        this.locationPicked = null;
        if (this.pickerEl.object3D.visible) {
          this.pickerEl.object3D.visible = false;
        }
        // this.pickerEl.style.visibility = "hidden";
        // this.pickerEl.object3D.visible = false;
      }
    }
  }
});

AFRAME.registerComponent('scene_text_control', { //hold the parsed text data
  schema: {
    jsonData: {default: ''} //fetched not fed
    },
    init: function () {
      this.textIDs = [];
      let textIDs = this.el.getAttribute("data-attribute");
      console.log("TEXtITEMS AHOY!" + textIDs + " length " + textIDs.length);
      // let tempArray = []; 
      if (!textIDs.indexOf(",") == -1) { //make sure to send request with an array
        this.textIDs[0] = textIDs;
      } else {
        this.textIDs = textIDs.split(",");
      }
      this.textDataArray = [];
      this.fetchTextData(this.textIDs);
      this.textItems = null;
    },
    //xhr
    fetchTextData: function (data) {
      // this.textData = [];
      if (data.length > 0) {
        this.textData = JSON.stringify({
          textIDs: data //just send the ids
        }),
$.ajax({
        url: "/scene_text_items",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
              textIDs: this.textIDs //just send the ids
            }),
          success: function( data, textStatus, xhr ){

              sceneTextItems = [];
              for (let i = 0; i < data.length; i++) { //check for text type?
                console.log("sceneTextItem : " +data[i]);
                sceneTextItems.push(data[i]); //textstring should be a valid json, from defined template//not, just an array of objex saved in global
              }
          },
          error: function( xhr, textStatus, errorThrown ){
              console.log( "error fetching text: " + xhr.responseText );
          }
        });
      
        setTimeout(() =>{
          this.loadTextData();
        }, 3000);
      }
  },
  loadTextData: function (data) {
    console.log("loading sceneTextItems " + JSON.stringify(sceneTextItems));
    // this.textItems = data;
  },
  returnTextData: function (mediaID) {
      for (let i = 0; i < this.data.jsonData.length; i++) {
        if (mediaID == this.data.jsonData[i]._id) {
          return this.data.jsonData[i];
        }
      }
    }
});



function fetchTextData (textIDs) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", '/scene_text_items/', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({textIDs: textIDs}));
  xhr.onload = function () {
    // do something to response
    console.log("textdata " + this.responseText);
    // this.loadTextData(this.responseText);
    return this.responseText;
  };
}
 
AFRAME.registerComponent('picture_group', { 
  schema: {
    mode: {default: 'flying'}
    
  },

  init: function () {
  }
});

AFRAME.registerComponent('scene_pictures_control', { //hold the parsed picture data
  schema: {
    // jsonData: {
    //   parse: JSON.parse,
    //   stringify: JSON.stringify
    //   }
    jsonData: {default: []}
    },
    init: function () {
      let scenePicturesArray = [];
    
      
      this.loader = new THREE.TextureLoader();
  
      let theData = this.el.getAttribute('data-scene-pictures');
      this.data.jsonData = JSON.parse(atob(theData)); 

    },
    returnScenePictureItems: function () {
      console.log("returning scenePictures " + JSON.stringify(this.data.jsonData));
      return this.data.jsonData;
    },
    returnPictureData: function (mediaID) {
      for (let i = 0; i < this.data.jsonData.length; i++) {
        if (mediaID == this.data.jsonData[i]._id) {
          return this.data.jsonData[i];
        }
      }
    }
  });

AFRAME.registerComponent('picture_groups_control', { //has all the picgroup data
  schema: {
    // jsonData: {
    //   parse: JSON.parse,
    //   stringify: JSON.stringify
    //   }
    jsonData: {default: []}
    },

  init: function () {
    let picGroupArray = [];
    this.picGroupArrayIndex = 0;
    
    this.loader = new THREE.TextureLoader();

    let theData = this.el.getAttribute('data-picture-groups');
    this.data.jsonData = JSON.parse(atob(theData)); //convert from base64
    // console.log("picgroupdata: " + JSON.stringify(this.data.jsonData[0]));
    let pictureGroupPicLandscapeEl = document.getElementById("pictureGroupPicLandscape"); 
    let pictureGroupPicPortraitEl = document.getElementById("pictureGroupPicPortrait");
    let pictureGroupPicSquareEl = document.getElementById("pictureGroupPicSquare");  
    this.pictureGroupPicLandscapeEl = pictureGroupPicLandscapeEl;
    this.pictureGroupPicPortraitEl = pictureGroupPicPortraitEl;
    this.pictureGroupPicSquareEl = pictureGroupPicSquareEl;
    let nextButton = document.getElementById("pictureGroupNextButton"); 
    let previousButton = document.getElementById("pictureGroupPreviousButton");
    let flyButton = document.getElementById("pictureGroupFlyButton");
    let layoutButton = document.getElementById("pictureGroupLayoutButton");

    picGroupArray = this.data.jsonData; //it's an array of arrays
    this.picGroupArray = picGroupArray;
    this.picGroupIndex = 0;
    
    this.flyingPicEls = [];
    this.layoutPicEls = [];
    this.landscapeMesh = null;
    this.portraitMesh = null;
    this.squareMesh = null;
    this.texture = null;
    this.material = null;
    // if (settings && !settings.showCameraIcon) {
    //   this.el.setAttribute('visible', false);
    // }
    if (this.data.jsonData != null && this.data.jsonData.length > 0) {
      // this.pictureGroupPicEl = document.getElementById("pictureGroupPicLandscape"); 
      // this.pictureGroupPicEl = pictureGroupPicEl;


      let orientation = this.picGroupArray[this.picGroupArrayIndex].images[0].orientation;

      if (orientation && orientation == "Equirectangular") {
        let skyEl = document.getElementById("a_sky");
        if (skyEl) {
          skyEl.components.skybox_dynamic.initMe();
        }
      }
      this.setPanelVisibility(orientation);


      pictureGroupPicLandscapeEl.addEventListener('model-loaded', (event) => {
        // event.preventDefault();
        let landscapeMesh = pictureGroupPicLandscapeEl.getObject3D('mesh');
        this.landscapeMesh = landscapeMesh;
        this.href = this.picGroupArray[this.picGroupArrayIndex].images[0].url;
        // console.log("tryna load initial scene pic " + this.href + " from " + JSON.stringify(this.picGroupArray));
        this.loader.load(
          // resource URL
          this.href,
          // onLoad callback
          function ( texture ) { 
            this.texture = texture;
            this.texture.encoding = THREE.sRGBEncoding; 
            this.texture.flipY = false; 
            this.material = new THREE.MeshBasicMaterial( { map: texture, transparent: true} ); 
              
            landscapeMesh.traverse(node => { 
              console.log("gotsa obj + mat");
              node.material = this.material;
            });
          },
          function ( err ) {
            console.error( 'An error happened.' );
          }
        );
      });

      pictureGroupPicPortraitEl.addEventListener('model-loaded', (event) => {
        // event.preventDefault();
        portraitMesh = pictureGroupPicPortraitEl.getObject3D('mesh');
        this.portraitMesh = portraitMesh;
        this.href = this.picGroupArray[this.picGroupArrayIndex].images[0].url;
        // console.log("tryna load initial scene pic " + this.href + " from " + JSON.stringify(this.picGroupArray));
        this.texture = null;
        this.loader.load(
          // resource URL
          this.href,
          // onLoad callback
          function ( texture ) { 
            this.texture = texture;
            this.texture.encoding = THREE.sRGBEncoding; 
            this.texture.flipY = false; 
            this.material = new THREE.MeshBasicMaterial( { map: texture, transparent: true} ); 
            portraitMesh.traverse(node => { 
              console.log("gotsa obj + mat");
              node.material = this.material;
            });
          },
          function ( err ) {
            console.error( 'An error happened.' );
          }
        );
      });
      pictureGroupPicSquareEl.addEventListener('model-loaded', (event) => {
        // event.preventDefault();
        squareMesh = pictureGroupPicSquareEl.getObject3D('mesh');
        this.squareMesh = squareMesh;
        this.href = this.picGroupArray[this.picGroupArrayIndex].images[0].url;
        // console.log("tryna load initial scene pic " + this.href + " from " + JSON.stringify(this.picGroupArray));
        this.texture = null;
        this.loader.load(
          // resource URL
          this.href,
          // onLoad callback
          function ( texture ) { 
            this.texture = texture;
            this.texture.encoding = THREE.sRGBEncoding; 
            this.texture.flipY = false; 
            this.material = new THREE.MeshBasicMaterial( { map: texture, transparent: true} ); 
            squareMesh.traverse(node => { 
              // console.log("gotsa obj + mat");
              node.material = this.material;
            });
          },
          function ( err ) {
            console.error( 'An error happened.' );
          }
        );
      });
      nextButton.addEventListener('click', (event) => {
        event.preventDefault();
        // this.pictureGroupPicEl.removeAttribute('gltf-model');
        this.NextButtonClick();
      });

      previousButton.addEventListener('click', (event) => {
        event.preventDefault();
        // this.pictureGroupPicEl.removeAttribute('gltf-model');
        this.PreviousButtonClick();
      });
      flyButton.addEventListener('click', (event) => {
        event.preventDefault();
        
        this.FlyButtonClick();
      });
      layoutButton.addEventListener('click', (event) => {
        event.preventDefault();
        
        this.LayoutButtonClick();
      });

    }
    },
    setPanelVisibility: function (orientation) {
      if (!orientation || orientation.includes("Landscape") || orientation.includes("Equirectangular")) {
        this.pictureGroupPicLandscapeEl.setAttribute('visible', true);
        this.pictureGroupPicPortraitEl.setAttribute('visible', false);
        this.pictureGroupPicSquareEl.setAttribute('visible', false);
      } else if (orientation.includes("Portrait")) {
        this.pictureGroupPicLandscapeEl.setAttribute('visible', false);
        this.pictureGroupPicPortraitEl.setAttribute('visible', true);
        this.pictureGroupPicSquareEl.setAttribute('visible', false);
      } else if (orientation.includes("Square")) {
        this.pictureGroupPicLandscapeEl.setAttribute('visible', false);
        this.pictureGroupPicPortraitEl.setAttribute('visible', false);
        this.pictureGroupPicSquareEl.setAttribute('visible', true);
      }
    },
    toggleOnPicGroup: function () {
      if (this.flyingPicEls.length > 0) {
        for (i = 0; i < this.flyingPicEls.length; i++) {
          this.flyingPicEls[i].parentNode.removeChild(this.flyingPicEls[i]);
        }
      }
      if (this.layoutPicEls.length > 0) {
        for (i = 0; i < this.layoutPicEls.length; i++) {
          this.layoutPicEls[i].parentNode.removeChild(this.layoutPicEls[i]);
        }
      }
      let pictureGroupPicLandscapeEl = document.getElementById("pictureGroupPicLandscape"); 
      let pictureGroupPicPortraitEl = document.getElementById("pictureGroupPicPortrait");
      let pictureGroupPicSquareEl = document.getElementById("pictureGroupPicSquare");  
      this.pictureGroupPicLandscapeEl = pictureGroupPicLandscapeEl;
      this.pictureGroupPicPortraitEl = pictureGroupPicPortraitEl;
      this.pictureGroupPicSquareEl = pictureGroupPicSquareEl;
      this.layoutPicEls = [];
      this.flyingPicEls = [];
      let picElMesh = null;
      let orientation = this.picGroupArray[this.picGroupArrayIndex].images[this.picGroupIndex].orientation;

      if (!orientation || orientation.includes("Landscape") || orientation.includes("Equirectangular")) {
        // this.pictureGroupPicEl.setAttribute('gltf-model', '#flatrect2'); // mod for orientation
        // this.pictureGroupPicEl = document.getElementById("pictureGroupPicLandscape"); 
        picElMesh = this.pictureGroupPicLandscapeEl.getObject3D('mesh');
      } else if (orientation.includes("Portrait")) {
        // this.pictureGroupPicEl.setAttribute('gltf-model', '#portrait_panel');
        // this.pictureGroupPicEl = document.getElementById("pictureGroupPicPortrait"); 
        picElMesh = this.pictureGroupPicPortraitEl.getObject3D('mesh');
      } else if (orientation.includes("Square")) {
        // this.pictureGroupPicEl.setAttribute('gltf-model', '#flatsquare');
        // this.pictureGroupPicEl = document.getElementById("pictureGroupPicSquare"); 
        picElMesh = this.squareMesh;
      }

      if (picElMesh) { //no onload so it may miss first time
        this.href = this.picGroupArray[this.picGroupArrayIndex].images[this.picGroupIndex].url;
        console.log("tryna load initial scene pic " + this.href);
        this.texture = null;
        this.material = null;
        // const obj = pictureGroupPicEl.getObject3D('mesh');
        
        // load a resource
        this.loader.load(
          // resource URL
          this.href,
          // onLoad callback
          function ( texture ) { 
            this.texture = texture;
            this.texture.encoding = THREE.sRGBEncoding; 
            this.texture.flipY = false; 
            this.material = new THREE.MeshBasicMaterial( {map: texture, transparent: true} ); 
              
            picElMesh.traverse(node => { //needs a callback here to insure it gets painted the first time
              console.log("gotsa obj + mat");
              node.material = this.material;
            });
          },
          function ( err ) {
            console.error( 'An error happened.' );
          }
        );
      }
      
    },
    NextButtonClick: function () {


      console.log(this.picGroupArrayIndex + " of " + this.picGroupArray.length + " group tryna show next from index " + this.picGroupIndex + " of " + this.picGroupArray[this.picGroupArrayIndex].images.length);
      this.picGroup = this.picGroupArray[this.picGroupArrayIndex];
      if (this.picGroup.images.length > this.picGroupIndex + 1) { //bakards..
          this.picGroupIndex++;
        } else {
          this.picGroupIndex = 0;
      }
      let orientation = this.picGroupArray[this.picGroupArrayIndex].images[this.picGroupIndex].orientation;
      this.setPanelVisibility(orientation);
      if (!orientation || orientation.includes("Landscape")  || orientation.includes("Equirectangular")) {
        this.pictureGroupPicEl = document.getElementById("pictureGroupPicLandscape"); 
      } else if (orientation.includes("Portrait")) {
        this.pictureGroupPicEl = document.getElementById("pictureGroupPicPortrait"); 
      } else if (orientation.includes("Square")) {
        this.pictureGroupPicEl = document.getElementById("pictureGroupPicSquare"); 
      }
      const obj = this.pictureGroupPicEl.getObject3D('mesh');
      const href = this.picGroupArray[this.picGroupArrayIndex].images[this.picGroupIndex].url;
      console.log("tryna set texture " + href);
      var texture = new THREE.TextureLoader().load(href);
      texture.encoding = THREE.sRGBEncoding; 
      texture.flipY = false; 
      var material = new THREE.MeshBasicMaterial( { map: texture, transparent: this.picGroupArray[this.picGroupArrayIndex].images[this.picGroupIndex].hasAlphaChannel } ); 
      obj.traverse(node => {
        node.material = material;
      });
        
      // if (!orientation || orientation.includes("Landscape")) { //um, instead can do it like Previous button below...
  
      //   const href = this.picGroupArray[this.picGroupArrayIndex].images[this.picGroupIndex].url;
      //   console.log("tryna set texture " + href);
      //   var texture = new THREE.TextureLoader().load(href);
      //   texture.encoding = THREE.sRGBEncoding; 
      //   texture.flipY = false; 
      //   var material = new THREE.MeshBasicMaterial( { map: texture, transparent: this.picGroupArray[this.picGroupArrayIndex].images[this.picGroupIndex].hasAlphaChannel } ); 
      //   this.landscapeMesh.traverse(node => {
      //     node.material = material;
      //   });
      // } else if (orientation.includes("Portrait")) {
   
      //   // const obj = this.pictureGroupPicEl.getObject3D('mesh');
      //   const href = this.picGroupArray[this.picGroupArrayIndex].images[this.picGroupIndex].url;
      //   console.log("tryna set texture " + href);
      //   var texture = new THREE.TextureLoader().load(href);
      //   texture.encoding = THREE.sRGBEncoding; 
      //   texture.flipY = false; 
      //   var material = new THREE.MeshBasicMaterial( { map: texture, transparent: this.picGroupArray[this.picGroupArrayIndex].images[this.picGroupIndex].hasAlphaChannel } ); 
      //   this.portraitMesh.traverse(node => {
      //     node.material = material;
      //   });
      // } else if (orientation.includes("Square")) {
    
      //   // const obj = this.pictureGroupPicEl.getObject3D('mesh');
      //   const href = this.picGroupArray[this.picGroupArrayIndex].images[this.picGroupIndex].url;
      //   console.log("tryna set texture " + href);
      //   var texture = new THREE.TextureLoader().load(href);
      //   texture.encoding = THREE.sRGBEncoding; 
      //   texture.flipY = false; 
      //   var material = new THREE.MeshBasicMaterial( { map: texture, transparent: this.picGroupArray[this.picGroupArrayIndex].images[this.picGroupIndex].hasAlphaChannel } ); 
      //   this.squareMesh.traverse(node => {
      //     node.material = material;
      //   });
      // }
     
        
    },
    PreviousButtonClick: function () {
      // this.nextPicGroupArrayIndex();
      // let picGroupArray = this.data.jsonData;
     
      console.log(this.picGroupArrayIndex + " of " + this.picGroupArray.length + " group tryna show next from index " + this.picGroupIndex + " of " + this.picGroupArray[this.picGroupArrayIndex].images.length);
      this.picGroup = this.picGroupArray[this.picGroupArrayIndex];
      if (this.picGroupIndex > 0) {
          this.picGroupIndex--;
        } else {
          this.picGroupIndex = this.picGroup.images.length - 1;
      }

      let orientation = this.picGroupArray[this.picGroupArrayIndex].images[this.picGroupIndex].orientation;
      this.setPanelVisibility(orientation);

      if (!orientation || orientation.includes("Landscape") || orientation.includes("Equirectangular")) {
        this.pictureGroupPicEl = document.getElementById("pictureGroupPicLandscape"); 
      } else if (orientation.includes("Portrait")) {
        this.pictureGroupPicEl = document.getElementById("pictureGroupPicPortrait"); 
      } else if (orientation.includes("Square")) {
        this.pictureGroupPicEl = document.getElementById("pictureGroupPicSquare"); 
      }
      const obj = this.pictureGroupPicEl.getObject3D('mesh');
      const href = this.picGroupArray[this.picGroupArrayIndex].images[this.picGroupIndex].url;
      console.log("tryna set texture " + href);
      var texture = new THREE.TextureLoader().load(href);
      texture.encoding = THREE.sRGBEncoding; 
      texture.flipY = false; 
      var material = new THREE.MeshBasicMaterial( { map: texture, transparent: this.picGroupArray[this.picGroupArrayIndex].images[this.picGroupIndex].hasAlphaChannel } ); 
      obj.traverse(node => {
        node.material = material;
      });
        
    },
    FlyButtonClick: function () {
      document.querySelector("#pictureGroupPanel").setAttribute('visible', false);
      if (this.flyingPicEls.length > 0) {
        for (i = 0; i < this.flyingPicEls.length; i++) {
          this.flyingPicEls[i].parentNode.removeChild(this.flyingPicEls[i]);
        }
      }
      if (this.layoutPicEls.length > 0) {
        for (i = 0; i < this.layoutPicEls.length; i++) {
          this.layoutPicEls[i].parentNode.removeChild(this.layoutPicEls[i]);
        }
      }
      this.layoutPicEls = [];
      this.flyingPicEls = [];
      this.initFlyingPics();
        
    },
    LayoutButtonClick: function () {
      document.querySelector("#pictureGroupPanel").setAttribute('visible', false);
      if (this.flyingPicEls.length > 0) {
        for (i = 0; i < this.flyingPicEls.length; i++) {
          this.flyingPicEls[i].parentNode.removeChild(this.flyingPicEls[i]);
        }
      }
     
      if (this.layoutPicEls.length > 0) {
        for (i = 0; i < this.layoutPicEls.length; i++) {
          this.layoutPicEls[i].parentNode.removeChild(this.layoutPicEls[i]);
        }
      }
      this.layoutPicEls = [];
      this.flyingPicEls = [];
      this.initLayoutPics();
        
    },
    nextPicGroupArrayIndex: function () {
      if (this.picGroupArrayIndex < this.picGroupArray.length - 1) {
        this.picGroupArrayIndex++;
      } else {
        this.picGroupArrayIndex = 0;
      }
      console.log("updated picGroupArrayIndex " + this.picGroupArrayIndex + " of " + this.picGroupArray.length);
    },
    previousPicGroupArrayIndex: function () {
      if (this.picGroupArrayIndex == 0) {
        this.picGroupArrayIndex = this.picGroupArray.length;
      } else {
        this.picGroupArrayIndex--;
      }
    },
    setPicGroupArrayIndex: function (index) {
      this.picGroupArrayIndex = index;
    },
    returnPictureData: function () {
      return this.data.jsonData;
    },
    returnSkyboxData: function (skyboxID) {
      //find the group with the skyboxID, if there is one, and return that (can't mix in scene vs. in group skyboxen..?)
      let group = null;
      let picGroupArray = this.data.jsonData;
      if (picGroupArray.length > 0) { //todo if pois or multiple equirects
       
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

      let group = null;
      let picGroupArray = this.data.jsonData;
      console.log("tryna find tileable pics");
      for (let i = 0; i < picGroupArray.length; i++) {
        for (let j = 0; j < picGroupArray[i].images.length; j++) {
          if (picGroupArray[i].images[j].orientation == "Tileable") { //todo check tags
            group = picGroupArray[i];
            break;
          }
        }
      }
      return group;
    }, 
    initFlyingPics: function () {
      this.nextPicGroupArrayIndex();
      
      console.log("tryna init flying pics");
      for (let i = 0; i < this.picGroupArray[this.picGroupArrayIndex].images.length; i++) {
        console.log("tryuna set a pic with orientation" + this.picGroupArray[this.picGroupArrayIndex].images[i].orientation);
        setTimeout(() => {
          this.scalemod = Math.random() * 2.5;
          let flyingPicEl = document.createElement("a-entity");
          this.el.sceneEl.appendChild(flyingPicEl); 
          flyingPicEl.setAttribute('position', '0 -100 0')
          let orientation = this.picGroupArray[this.picGroupArrayIndex].images[i].orientation;

          if (!orientation || orientation.includes("Landscape") || orientation.includes("Equirectangular")) {
            flyingPicEl.setAttribute('gltf-model', '#flatrect2'); // mod for orientation
          } else if (orientation.includes("Portrait")) {
            flyingPicEl.setAttribute('gltf-model', '#portrait_panel');
          } else if (orientation.includes("Square")) {
            flyingPicEl.setAttribute('gltf-model', '#flatsquare');
          }
          if (settings && settings.sceneCameraMode == "Third Person") {
            flyingPicEl.setAttribute('look-at', '#thirdPersonCamera'); //toggle by eventData
          } else {
            flyingPicEl.setAttribute('look-at', '#player'); //first person camrig
          }


          flyingPicEl.setAttribute('mod_curve', {'init': true, 'speedFactor': .75, 'spreadFactor': 4, 'distance': -20, 'type': 'pictureGroup'}); //pass data in?

          flyingPicEl.setAttribute('scale', {'x': this.scalemod, 'y': this.scalemod, 'z': this.scalemod}); //toggle by eventData
          flyingPicEl.classList.add("flyingPic");
          flyingPicEl.id = "flyingPic_" + i;
          this.flyingPicEls.push(flyingPicEl);
          this.picGroup = this.picGroupArray[this.picGroupArrayIndex];
          if (this.picGroup.images.length > this.picGroupIndex + 1) { //bakards..
              this.picGroupIndex++;
            } else {
              this.picGroupIndex = 0;
            }
            flyingPicEl.addEventListener('model-loaded', () => {
              const obj = flyingPicEl.getObject3D('mesh');
              // obj.scale.set(this.scalemod, this.scalemod, this.scalemod);
              const href = this.picGroupArray[this.picGroupArrayIndex].images[i].url;
              // const href = this.returnRandomPicture();
              console.log("tryna set texture with alpha " + this.picGroupArray[this.picGroupArrayIndex].images[i].hasAlphaChannel);
              
              var texture = new THREE.TextureLoader().load(href);
              texture.encoding = THREE.sRGBEncoding; 
              texture.flipY = false; 

              var material = new THREE.MeshBasicMaterial( { map: texture, transparent: this.picGroupArray[this.picGroupArrayIndex].images[i].hasAlphaChannel } ); 
              obj.traverse(node => {
                node.material = material;
              }); 
            });
          console.log("waiting on " + i)
        }, i * 1000);
      }
    },
    initLayoutPics: function () {
      this.nextPicGroupArrayIndex();
      
      // this.radius = 20;
      // console.log("tryna init layout pics");
      // var theta = (i / this.picGroupArray[this.picGroupArrayIndex].images.length) * Math.PI * 2;
      // this.el.object3D.position.copy.x

      // const curve = new THREE.EllipseCurve(
      //   this.el.object3D.position.copy.x, this.el.object3D.position.copy.y,            // Center x, y
      //   100.0, 100.0,          // x radius, y radius
      //   0.0, 2.0 * Math.PI,  // Start angle, stop angle
      // );
      // const pts = curve.getSpacedPoints(this.picGroupArray[this.picGroupArrayIndex].images.length);
      if (!this.layoutEl) {
        this.layoutEl = document.createElement("a-entity");
        this.el.appendChild(this.layoutEl);
        this.layoutEl.setAttribute('position', '0 2 0');
        this.layoutEl.setAttribute('layout', {'type': 'circle', 'radius': 10, 'plane': 'xz'}); //layout component

      } 
      for (let i = 0; i < this.picGroupArray[this.picGroupArrayIndex].images.length; i++) {
        console.log("tryuna set a pic with orientation" + this.picGroupArray[this.picGroupArrayIndex].images[i].orientation);
        // this.scalemod = Math.random() * 2.5;
        this.scalemod = 1.5;
        let layoutPicEl = document.createElement("a-entity");
        this.layoutEl.appendChild(layoutPicEl); 
        let orientation = this.picGroupArray[this.picGroupArrayIndex].images[i].orientation;

        if (!orientation || orientation.includes("Landscape") || orientation.includes("Equirectangular")) {
          layoutPicEl.setAttribute('gltf-model', '#flatrect2'); // mod for orientation
        } else if (orientation.includes("Portrait")) {
          layoutPicEl.setAttribute('gltf-model', '#portrait_panel');
        } else if (orientation.includes("Square")) {

        }
        // this.isPositive = Math.random() > .5 ? 1 : -1;
        // this.x = Math.random() * i + 10 * this.isPositive;
        // this.z = Math.random() * i + 10 * this.isPositive;
        // layoutPicEl.setAttribute('position', {'x': pts.x, 'y': pts.y, 'z': pts.z});
        layoutPicEl.setAttribute('look-at', '#player'); //toggle by eventData
        // layoutPicEl.setAttribute('mod_curve', {'init': true, 'speedFactor': .75, 'spreadFactor': 6, 'distance': -30, 'type': 'pictureGroup'}); //pass data in?
        layoutPicEl.setAttribute('scale', {'x': this.scalemod, 'y': this.scalemod, 'z': this.scalemod}); //toggle by eventData
        layoutPicEl.classList.add("layoutPic");
        // layoutPicEl.setAttribute('brownian-motion', {'speed': '0.1', 'rotationVariance':'.2 .2 .2', 'positionVariance':'2.5 5 2.5', 'spaceVector':'10.1,20.1,30.1,10.1,20.1,30.1'});
        layoutPicEl.setAttribute('look-at', '#player'); //toggle by eventData
        layoutPicEl.id = "layoutPic_" + i;
        this.layoutPicEls.push(layoutPicEl);
        this.picGroup = this.picGroupArray[this.picGroupArrayIndex];

        if (this.picGroup.images.length > this.picGroupIndex + 1) { //bakards..
            this.picGroupIndex++;
          } else {
            this.picGroupIndex = 0;
          }
          layoutPicEl.addEventListener('model-loaded', () => {
            const obj = layoutPicEl.getObject3D('mesh');
            // obj.scale.set(this.scalemod, this.scalemod, this.scalemod);
            const href = this.picGroupArray[this.picGroupArrayIndex].images[i].url;
            // const href = this.returnRandomPicture();
            console.log("tryna set texture with alpha " + this.picGroupArray[this.picGroupArrayIndex].images[i].hasAlphaChannel);
            
            var texture = new THREE.TextureLoader().load(href);
            texture.encoding = THREE.sRGBEncoding; 
            texture.flipY = false; 

            var material = new THREE.MeshBasicMaterial( { map: texture, transparent: this.picGroupArray[this.picGroupArrayIndex].images[i].hasAlphaChannel } ); 
            obj.traverse(node => {
              node.material = material;
            }); 
          });
        console.log("waiting on " + i);
      }
    },
    returnRandomPicture: function () {
      let randomIndex = Math.floor(Math.random() * this.picGroupArray[this.picGroupArrayIndex].images.length);
      return this.picGroupArray[this.picGroupArrayIndex].images[randomIndex].url;
    },
    returnRandomPictureItem: function () {
      let randomIndex = Math.floor(Math.random() * this.picGroupArray[this.picGroupArrayIndex].images.length);
      console.log("treyna returnRandomPictureItem " + randomIndex);
      return this.picGroupArray[this.picGroupArrayIndex].images[randomIndex];
    }
});

AFRAME.registerComponent('toggle-picture-group', {
  schema: {
    placeholder: {default: ''},
  },
    init: function () {
    
    this.el.addEventListener('click', (e) => {
      e.preventDefault();
      console.log("tryna toggle pictureGroupPanel ");
      if (!document.querySelector("#pictureGroupPanel").getAttribute('visible')){
        document.querySelector("#pictureGroupPanel").setAttribute('visible', true);
        let pgEl = document.getElementById("pictureGroupsData"); 
        if (pgEl) {
          pgEl.components.picture_groups_control.toggleOnPicGroup();
          // pgEl.components.picture_groups_control.initFlyingPics();
        } 
        
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

    for (let i = 0; i < vids.length; i++) {
      // console.log("timekieys : " + JSON.stringify(vids[i].timekeys));
    } 

    //uh, no....
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
    // localStorage.setItem(room + "_timeKeys", JSON.stringify(tkObject)); 
    } else {
      timeKeysData = JSON.parse(vtk);
      
    }

    SetVideoEventsData();
    },
    returnVideoData: function () {
      // console.log("video data: " + JSON.stringify(this.data.jsonData));
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
    duration: {default: ''}
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
      hitpoint: {default: ''},
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
          if (this.slider_handle) {
            this.slider_handle.position.lerpVectors(this.slider_begin.position, this.slider_end.position, percentage);
          }
          
  }, 
  player_status_update: function (state) {
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
  update_stats: function (timestring) {
    this.youtubeStats.setAttribute('text', {
      baseline: "bottom",
          wrapCount: 70,
      align: "left",
      value: timestring
    });
    MediaTimeUpdate(timestring);
  },
  randomTime: function() {
    let duration = youtubePlayer.getDuration();
    let randomTimeValue = Math.random() * (duration - .1) + .1;
    
    youtubePlayer.seekTo(randomTimeValue, true);
  },
  goToTime: function(time) {
    youtubePlayer.seekTo(time, true);
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
let youtubeTitleEl = "";

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
    youtubeTitleEl = document.getElementById("youtubeTitle");
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
    youtubeData = youtubePlayer.getVideoData();
    if (youtubeData && youtubeTitleEl) {
      console.log("gots youtubedata for " + JSON.stringify(youtubeData));
      // let titlestring = youtubeData.author + "\n" + youtubeData.title;
      youtubeTitleEl.setAttribute('text', {'value': youtubeData.author + "\n" + youtubeData.title});
    }
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


        console.log("youtube getVideoData " + JSON.stringify(youtubeData));
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
  // console.log("TransportPlayButton clcik! " + JSON.stringify(youtubePlayer));
  console.log("TransportPlayButton clcik! " + primaryAudioMangler);
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
    
    behavior: {default: "none"},
    font1: {default: ""},
    font2: {default: ""},
    fillColor: {default: "white"},
    outlineColor: {default: "black"},
    backgroundColor: {default: "grey"},
    lookAt: {default: false},
    lookAtTarget: {default: "#player"},
    greetingText: {default: ""},
    showQuestText: {default: false},
    questText: {default: ""},
    hideClick: {default: false},
    startButton: {default: true},
    startText: {default: "Start"}

  },
  init: function () {
    this.isInitialized = false;
    this.viewportHolder = document.getElementById('viewportPlaceholder3');
    this.location = new THREE.Vector3();
    
    let interval = setInterval(() => { //hrm...
      if (settings && settings.sceneFontWeb1) {
        if (settings.sceneTags && settings.sceneTags.includes("follow")) {
          let curveDriver = document.getElementById("cameraCurve");
          if (curveDriver) { //wait for curves to load if neededs
            clearInterval(interval);
            this.initMe();
          }
        } else {
          clearInterval(interval);
          this.initMe();
        }
       
      }
    }, 1000);
    this.startButtonBackgroundEl = null;
    this.startButtonTextEl = null;
    // document.addEventListener("DOMContentLoaded", (e) => {
      // this.initMe();
    // });
  },
  // dependencies: ['raycaster'],
  initMe: function () {

    if (!this.isInitialized) {
      this.isInitialized = true;
      this.behavior = this.data.behavior;
      console.log("tryna set scene greeting " + this.data.greetingText + " " + settings.sceneFontWeb1);
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
      this.fillColor = this.data.fillColor;
      this.outlineColor = this.data.outlineColor;
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
      this.textBackgroundColor = this.data.backgroundColor;
      if (settings && settings.sceneTextBackgroundColor) {
        this.textBackgroundColor = settings.sceneTextBackgroundColor;
      }
      if (settings.sceneCameraMode == "Third Person") {
        this.el.setAttribute("scale", {x: 3, y: 3, z: 3});
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
      this.greetingEl = document.createElement("a-entity");
      this.el.appendChild(this.greetingEl);
      this.greetingEl.setAttribute("position", "0 1 0");

      this.questEl = null;
      // if (this.data.questText.length) {
        this.questEl = document.createElement("a-entity");
        this.el.appendChild(this.questEl);
        this.questEl.setAttribute("position", "0 0 0");
      // }

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
      
      if (this.data.startButton) {
        this.startButtonBackgroundEl = document.createElement("a-entity");
        this.startButtonTextEl = document.createElement("a-entity");
        this.el.appendChild(this.startButtonBackgroundEl);
        this.el.appendChild(this.startButtonTextEl);
        this.startButtonBackgroundEl.setAttribute("position", " 0 -1 -.01");
        this.startButtonTextEl.setAttribute("position", " 0 -1 0");
        this.startButtonTextEl.setAttribute("scale", ".5 .5 .5");
            this.startButtonBackgroundEl.setAttribute("scale", ".5 .5 .5");
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
          console.log("TRYNA HIDE DIALOG! " + this.behavior);
          if (this.behavior == 'hide') {
            // this.el.setAttribute("visible", false);
            // this.startButtonTextEl.setAttribute("scale", ".2 .2 .2");
            // this.startButtonBackgroundEl.setAttribute("scale", ".2 .2 .2");

            this.startButtonTextEl.setAttribute("visible", false);
            this.startButtonBackgroundEl.setAttribute("visible", false);
            console.log("TRYNA HIDE DIALOG! " + this.data.behavior);
            this.greetingEl.setAttribute("troika-text", {
              value: ""
            });
            this.questEl.setAttribute("troika-text", {
              value: ""
            });
            // this.el.parentNode.removeChild(this.el);
            // this.el.parent.remove(this.el);
          }
          // if (settings && (settings.sceneCameraMode == "Follow Path" || settings.sceneTags.includes("follow path") || settings.sceneTags.includes("follow curve"))) {

            let curveDriver = document.getElementById("cameraCurve");
            if (curveDriver) {
              let modCurveComponent = curveDriver.components.mod_curve;
              if (modCurveComponent) {
                modCurveComponent.toggleMove(true);
              }
            }
          // }
          // console.log("tryna start! playing " + PlayPauseMedia());
          
          // this.startButtonBackgroundEl.setAttribute("visible", false);
        });
      }


        // }
      // }
    



   
    // this.viewportHolder = document.getElementById('viewportPlaceholder3');
    // this.viewportHolder.object3D.getWorldPosition( loc );
    // this.el.setAttribute("look-at", "#player");
    // this.el.setAttribute("position", {x: loc.x, y: loc.y + 1, z: loc.z});

    // setTimeout(() => { //wait to settle player position, maybe DOMLoaded event? 
    //   if (settings && settings.sceneFontWeb1) {
        this.font = settings.sceneFontWeb1;

      

        this.viewportHolder = document.getElementById('viewportPlaceholder3');
        this.viewportHolder.object3D.getWorldPosition( this.location );
        console.log("tryna set scene greeting at location " + JSON.stringify(this.location));
        this.el.setAttribute("position", {x: this.location.x, y: this.location.y + .55, z: this.location.z});
        if (this.data.behavior == "hide") {
          this.longTimer();
        }
      }

  },
  longTimer: function () {
    setTimeout(() => {
      if (this.behavior == 'hide' && this.el.parentNode) {

        // this.el.parentNode.removeChild(this.el);
        // 
        this.startButtonTextEl.setAttribute("visible", false);
        this.startButtonBackgroundEl.setAttribute("visible", false);
        this.greetingEl.setAttribute("troika-text", {
          value: ""
        });
        this.questEl.setAttribute("troika-text", {
          value: ""
        });

      }
      
    }, 10000);
  },
  setLocation: function () {
    this.viewportHolder.object3D.getWorldPosition( this.location );
    console.log("tryna set scene greeting at location " + JSON.stringify(this.location));
    this.el.setAttribute("position", {x: this.location.x, y: this.location.y + .55, z: this.location.z});
  },
  modGreeting: function () {

  },
  modQuest: function (text) {
    this.startButtonBackgroundEl.setAttribute("visible", false);
    this.startButtonTextEl.setAttribute("visible", false);
    if (this.questEl) {

      this.questEl.setAttribute("troika-text", {
        fontSize: .4,
        maxWidth: 8,
        align: "center",
        font: "/fonts/web/" + this.font2,
        strokeWidth: '1%',
        color: this.fillColor,
        strokeColor: this.outlineColor,
        value: text
      });
    }
    this.greetingEl.setAttribute("troika-text", {
      value: ""
    });


  },
  ShowMessageAndHide: function (text, time) {
    if (this.startButtonBackgroundEl && this.startButtonTextEl) {
      this.startButtonBackgroundEl.setAttribute("visible", false);
      this.startButtonTextEl.setAttribute("visible", false);
      if (this.questEl) {
        this.questEl.setAttribute("troika-text", {
          fontSize: .2,
          maxWidth: 5,
          align: "center",
          font: "/fonts/web/" + this.font2,
          strokeWidth: '1%',
          color: this.fillColor,
          strokeColor: this.outlineColor,
          value: text
        });
        this.hideMessage(time);
      }
    }
  },
  hideMessage: function (time) {
    setTimeout(() => {
      this.questEl.setAttribute("troika-text", {value: ""});
    }, time);
  }

});
////////////////// end scene dialog component


/* jshint esversion: 9 */
/* global THREE, AFRAME */

// AFRAME.registerComponent("hide-on-hit-test-start", {
//   init: function() {
//     var self = this;
//     this.el.sceneEl.addEventListener("ar-hit-test-start", function() {
//       console.log("tryna hide for ar " + this.el.id);
//       self.el.object3D.visible = false;
//     });
//     this.el.sceneEl.addEventListener("exit-vr", function() {
//       self.el.object3D.visible = true;
//     });
//   }
// });

// window.addEventListener("DOMContentLoaded", function() {
//   const sceneEl = document.querySelector("a-scene");
//   const message = document.getElementById("ar_overlay_message");

//   // If the user taps on any buttons or interactive elements we may add then prevent
//   // Any WebXR select events from firing
//   message.addEventListener("beforexrselect", e => {
//     e.preventDefault();
//   });

//   sceneEl.addEventListener("enter-vr", function() {
//     if (this.is("ar-mode")) {
//       // Entered AR
//       console.log("entered AR mode!");
//       message.textContent = "entered AR mode";

//       // Hit testing is available
//       this.addEventListener(
//         "ar-hit-test-start",
//         function() {
//           console.log("scanning for hit-test");
//           message.innerHTML = `Scanning environment, finding surface.`;
//         },
//         { once: true }
//       );

//       // Has managed to start doing hit testing
//       this.addEventListener(
//         "ar-hit-test-achieved",
//         function() {
//           message.innerHTML = `Select the location to place<br />By tapping on the screen or selecting with your controller.`;
//         },
//         { once: true }
//       );

//       // User has placed an object
//       this.addEventListener(
//         "ar-hit-test-select",
//         function() {
//           // Object placed for the first time
//           message.textContent = "Well done!";
//         },
//         { once: true }
//       );
//     }
//   });

//   sceneEl.addEventListener("exit-vr", function() {
//     message.textContent = "Exited Immersive Mode";
//   });
// });