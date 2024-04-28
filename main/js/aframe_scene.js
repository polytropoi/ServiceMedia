
function setAframeScene() { //deprecated, used to show on dashboard
    // THREE.Cache.clear();
    clearThreeJSCache();

    let environment = "dream";
    if (aframe_enviro != undefined || aframe_enviro != null) {
        environment = aframe_enviro;
    } else {
        let envs = ["default","contact","egypt","checkerboard","forest","goaland","yavapai","goldmine","arches","threetowers","poison","tron","japan","dream","volcano","starry","osiris"];
        environment = envs[Math.floor(Math.random()*envs.length)]; //random if not set via qs param
    }
    // let links = "<a-assets><img id=\x22thumbMountains\x22 crossOrigin=\x22anonymous\x22 src=\x22https://realitymangler.com/YnHTO2MHP/5c33e4ada0a53d08d90f3e43.standard.ss_ynhto2mhp_1546904729.jpg\x22>"+
    // "</a-assets>"+
    // "<a-link href=\x22https://servicemedia.net/webxr/pVBHeiaCI\x22 position=\x223.5 1.5 -1.0\x22 image=\x22#thumbMountains\x22></a-link>";
    // console.log("tryna set aframe scene with links " + links);
    let height = window.innerHeight - 100;
    let aframe = "<div class=\x22row\x22>" +
    "<div style=\x22width:100%; height:"+height+"px;\x22>" +
        "<a-scene loading-screen=\x22dotsColor: white; backgroundColor: black\x22 embedded environment=\x22preset: "+environment+"\x22>" +
        "<a-entity id=\x22mouseCursor\x22 cursor=\x22rayOrigin: mouse\x22 raycaster=\x22objects: .activeObjexRay\x22></a-entity>"+
        "<a-entity id=\x22cameraRig\x22 position=\x220 0 0\x22>"+
        "<a-entity id=\x22head\x22 camera wasd-controls look-controls touch-controls position=\x220 1.6 0\x22 disable-magicwindow device-orientation-permission-ui=\x22enabled: false\x22></a-entity>"+
        "<a-entity oculus-touch-controls=\x22hand: right\x22 laser-controls=\x22hand: left;\x22 handModelStyle: lowPoly; color: #ffcccc\x22 raycaster=\x22objects: .activeObjexRay;\x22></a-entity>" +
        "<a-entity oculus-touch-controls=\x22hand: left\x22 id=\x22right-hand\x22 hand-controls=\x22hand: right; handModelStyle: lowPoly; color: #ffcccc\x22 aabb-collider=\x22objects: .activeObjexGrab;\x22 grab></a-entity>"+
            "</a-entity>"+
            "<a-assets>" +
                "<a-asset-item id=\x22cityModel\x22 crossorigin=\x22anonymous\x22response-type=\x22arraybuffer\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/test_gltf.glb\x22></a-asset-item>" +
                // "<a-asset-item id=\x22rover\x22 crossorigin=\x22anonymous\x22 response-type=\x22arraybuffer\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/rover_static.glb\x22></a-asset-item>" +
                // "<a-asset-item id=\x22mech1\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/astronaut.glb\x22></a-asset-item>" +
            "</a-assets>" +
            "<a-entity position=\x22-10 -0.5 -60\x22 gltf-model=\x22#cityModel\x22></a-entity>" +
            "<a-entity position=\x22-6 0 -8\x22 gltf-model=\x22#rover\x22 animation-mixer=\x22clip: idle\x22></a-entity>" +
            "<a-entity id=\x22character\x22 scale=\x221.1 1.1 1.1\x22 position=\x222 -0 -4\x22 gltf-model=\x22#mech1\x22" +
            " animation-mixer=\x22clip: idle\x22 animation__yoyo=\x22property: position; dir: alternate; dur: 10000; easing: easeInSine; loop: true; to: 2 1 -4\x22></a-entity>" +
            "<a-sphere scene-info class=\x22\x22 id=\x22sphere\x22 position=\x220 1.25 -5\x22 radius=\x221.25\x22 material=\x22shader: noise\x22" +
            "</a-sphere>" +
            // "<a-link class=\x22activeObjexRay\x22 title=\x22portal\x22 look-at=\x22#head\x22 href=\x22../webxr/pVBHeiaCI\x22 position=\x22-5 0 0\x22 image=\x22#thumbMountains\x22></a-link>" +
            "<a-light type=\x22point\x22 color=\x22blue\x22 position=\x22-0 1.25 0\x22></a-light>" +
            "<a-text id=\x22mainText\x22 value=\x22Welcome "+username+"!\x22 align=\x22center\x22 color=\x22#FFF\x22 visible=\x22false\x22 position=\x22-0 2 -0\x22"+
            "geometry=\x22primitive: plane; width: 4\x22 material=\x22color: #333\x22>" +
            "</a-text>"+
            "<a-sky color=\x22#ECECEC\x22></a-sky>" +
        "</a-scene>" +
        "</div>" +
    "</div>";
    $("#topPage").html(aframe);
    // $(function() {
    //     THREE.Cache.clear;
    //     console.log(THREE.Cache);
    // });

    var sceneEl = document.querySelector('a-scene');

    // var character = document.querySelector('#character');
    let mainText = document.querySelector("#mainText");
    let character = document.querySelector("#character");
    // if (!isLoaded) {
    AFRAME.registerComponent('do-something-once-loaded', {
    init: function () {
            // This will be called after the entity has properly attached and loaded.
            console.log('aframe ready!');
            isLoaded = true;
        }
    });
    
    var entityEl = document.createElement('a-entity');
    entityEl.setAttribute('do-something-once-loaded', '');
    // character.setAttribute('do-something-once-loaded', '');
    sceneEl.appendChild(entityEl);

    AFRAME.registerComponent('scene-info', {
        schema: {
          color: {default: 'red'}
        },
        init: function () {
          var data = this.data;
          var el = this.el;  
        //   var defaultColor = el.getAttribute('material').color;
        el.setAttribute('color', "blue");
            mainText.setAttribute('visible', true);
            mainText.setAttribute("look-at", "[camera]");

          el.addEventListener('mouseenter', function () {
            el.setAttribute('color', "blue");
            mainText.setAttribute('visible', true);
            mainText.setAttribute("look-at", "[camera]");
          });
    
          el.addEventListener('mouseleave', function () {
            el.setAttribute('color', "blue");
            // mainText.setAttribute('visible', false);
          });
        }
    });
}

function getWebXRScene() {
    
    axios.get('/scene/' + itemid + '/webxr/latest')
    .then(function (response) {
         console.log(response);
        showWebXRScene(response);
    }) //end of main fetch
    .catch(function (error) {
        console.log(error);
    });

}
function showWebXRScene(response) {
    let environment = "egypt";
    console.log("tryna set aframe scene with env " + environment);
    let height = window.innerHeight - 100;
    // console.log("primary audio: " + response.data.scenePrimaryAudioID + " in "+ JSON.stringify(response.data.audio));
    let primaryAudio = {};
    let ambientAudio = {};
    let triggerAudio = {};
    let assets = "";
    let grabMix = "<a-mixin id=\x22grabmix\x22" + //mixin for grabbable objex
    "event-set__grab=\x22material.color: #FFEF4F\x22" +
    "event-set__grabend=\x22material.color: #F2E646\x22" +
    "event-set__hit=\x22material.color: #F2E646\x22" +
    "event-set__hitend=\x22material.color: #EF2D5E\x22" +
    "event-set__mousedown=\x22material.color: #FFEF4F\x22" +
    "event-set__mouseenter=\x22material.color: #F2E646\x22" +
    "event-set__mouseleave=\x22material.color: #EF2D5E\x22" +
    "event-set__mouseup=\x22material.color: #F2E646\x22" +
    "geometry=\x22primitive: box; height: 0.30; width: 0.30; depth: 0.30\x22" +
    "material=\x22color: #EF2D5E;\x22></a-mixin>";
    for (var a in response.data.audio) {
        if (response.data.audio[a]._id === response.data.scenePrimaryAudioID) {
            primaryAudio = response.data.audio[a];
            // console.log("primaryAudio " + JSON.stringify(primaryAudio));
            assets = "<img id=\x22primaryAudioWaveform\x22 crossorigin=\x22anonymous\x22 src=\x22"+primaryAudio.URLpng+"\x22></img>";
        }
    }
    for (var a in response.data.audio) {
        if (response.data.audio[a]._id === response.data.sceneAmbientAudioID) {
            ambientAudio = response.data.audio[a];
        }
    }
    for (var a in response.data.audio) {
        if (response.data.audio[a]._id === response.data.sceneTriggerAudioID) {
            triggerAudio = response.data.audio[a];
        }
    }
    //doesn't matter, dprecated...
    if (response.data.sceneEnvironmentPreset != null && response.data.sceneEnvironmentPreset != "" && response.data.sceneEnvironmentPreset != "none") {
        environment = response.data.sceneEnvironmentPreset;
        console.log("environment: " + environment);
    } else if (response.data.sceneWebXREnvironment != null && response.data.sceneWebXREnvironment != "") {
        environment = response.data.sceneWebXREnvironment;
    }
    // assets = assets + "<img id=\x22thumbMountains\x22 crossorigin=\x22anonymous\x22 src=\x22https://realitymangler.com/assets/547389e8cac0642460000004.half.DoorsMedieval0134_L.jpg\x22>";
    let aframe = "<div class=\x22row\x22>" +
    "<div style=\x22width:100%; height:"+height+"px;\x22>" +
        "<a-scene loading-screen=\x22dotsColor: white; backgroundColor: black\x22 disable-magicwindow device-orientation-permission-ui=\x22enabled: false\x22 embedded environment=\x22preset: "+environment+"\x22>" +
            "<a-entity id=\x22mouseCursor\x22 cursor=\x22rayOrigin: mouse\x22 raycaster=\x22objects: .activeObjexRay\x22></a-entity>"+
            "<a-entity id=\x22cameraRig\x22 position=\x220 0 0\x22>"+
            
                "<a-entity id=\x22head\x22 camera wasd-controls look-controls touch-controls position=\x220 1.6 0\x22></a-entity>"+
                "<a-entity oculus-touch-controls=\x22hand: left\x22 laser-controls=\x22hand: left;\x22 handModelStyle: lowPoly; color: #ffcccc\x22 raycaster=\x22objects: .activeObjexRay;\x22></a-entity>" +
                "<a-entity oculus-touch-controls=\x22hand: right\x22 id=\x22right-hand\x22 hand-controls=\x22hand: right; handModelStyle: lowPoly; color: #ffcccc\x22 aabb-collider=\x22objects: .activeObjexGrab;\x22 grab></a-entity>"+
            "</a-entity>"+
            "<a-assets>" +
                grabMix +
                assets +
            "</a-assets>" +
            
            "<a-entity visible=\x22false\x22 id=\x22primaryAudioText\x22 geometry=\x22primitive: plane; width: 1; height: .35\x22 position=\x22-0 2.1 -1\x22 material=\x22color: grey; transparent: true; opacity: 0.5\x22"+
                "text=\x22value:\nUser: "+username+"\nScene: "+response.data.sceneTitle+"\n\nClick to play...\n\x22>"+
                "<a-image position = \x220 -.1 -.01\x22 width=\x221\x22 height=\x22.25\x22 src=\x22#primaryAudioWaveform\x22 crossorigin=\x22anonymous\x22 transparent=\x22true\x22></a-image>"+
            "</a-entity>"+
            "<a-entity mixin=\x22grabmix\x22 class=\x22activeObjexGrab activeObjexRay\x22 primary-audio-control id=\x22sphere\x22 geometry=\x22primitive: sphere; radius: .25\x22 material=\x22shader: noise\x22 position=\x220 1.6 -1\x22" +
            "</a-entity>" +
            // "<a-link class=\x22activeObjexRay\x22 title=\x22portal\x22 look-at=\x22#head\x22 href=\x22index.html\x22 position=\x22-15 0 0\x22 image=\x22#thumbMountains\x22></a-link>" +
            "<a-sky color=\x22#ECECEC\x22></a-sky>" +

        "</a-scene>" +
        "</div>" +
    "</div>";
    // $("#card").html(aframe);
    $("#topPage").html(aframe);
    $(function() {
        
    });
    var sky = document.querySelector('a-sky');
    sky.setAttribute('color', getRandomColor());
    sky.setAttribute('animation__color', {
    property: 'color',
    dir: 'alternate',
    dur: 20000,
    easing: 'easeInOutSine',
    loop: true,
    to: getRandomColor()
    });
    
    if (primaryAudio.URLogg != null) {
        let primaryAudioHowl = new Howl({ //use howler audio mangler
            src: [primaryAudio.URLogg], //use ogg for looping
            loop: true,
            volume: 1.0,
            
        });

        let sceneEl = document.querySelector('a-scene');
        let primaryAudioText = document.querySelector("#primaryAudioText");
        let character = document.querySelector("#character");
        let pAudio = document.querySelector("#primaryAudio"); 
        let cam = document.querySelector("#head"); 
        let entityEl = document.createElement('a-entity'); //isLoaded placeholder 
        let isPlaying = false;
        let startTime = 0;
        let pAudioCurrentTime = 0;
        let pausedTime = 0;
        let currentTime = 0;
        let duration = 0;
        // var primaryAudioMaterial = "";
        let userSceneString = "\nUser: "+username+"\nScene: "+response.data.sceneTitle;
        entityEl.setAttribute('isloaded', '');
        sceneEl.appendChild(entityEl);
        AFRAME.registerComponent('isloaded', {
            init: function () {
                    console.log("loaded!");
                } 
            });
        AFRAME.registerComponent('primary-audio-control', {
            schema: {
            color: {default: 'red'}
            },
            init: function () {
                var data = this.data;
                var el = this.el;  
                var defaultColor = el.getAttribute('material').color;
                primaryAudioHowl.pannerAttr({
                    panningModel: 'HRTF',
                    coneInnerAngle: 360,
                    coneOuterAngle: 360,
                    coneOuterGain:1,
                    maxDistance: 10,
                    refDistance: 1,
                    rolloffFactor: 1,
                    distanceModel: 'exponential'
                });
                el.addEventListener('mouseenter', function () {
                    primaryAudioText.setAttribute('visible', true);
                    primaryAudioText.setAttribute("look-at", "[camera]");
                });
                el.setAttribute('light', {
                    type: 'point',
                    distance: 30,
                    intensity: 2.0,
                    color: 'yellow'
                }, true);
                el.addEventListener('mousedown', function () {
                if (!primaryAudioHowl.playing() && primaryAudioHowl.state() == "loaded") {
                    duration = primaryAudioHowl.duration().toFixed(2);
                    primaryAudioHowl.play();
                    console.log('...tryna play...');
                    primaryAudioHowl.pos(0, 1.25, -5);
                    isPlaying = true;
                } else {
                    if (isPlaying) {
                    el.setAttribute('light', {
                        type: 'point',
                        distance: 30,
                        intensity: 2.0,
                        color: 'red'
                    }, true);
                        primaryAudioHowl.pause();
                        isPlaying = false;
                        console.log('...tryna pause...');
                    }
                }
            });        
            el.addEventListener('mouseleave', function () {
                    el.setAttribute('color', defaultColor);
                });
            },
            tick: function(time, deltaTime) {
                var seek = primaryAudioHowl.seek() || 0;
                seek = Number(seek).toFixed(2);
                let percentComplete = Math.floor((seek / duration) * 100);
                if (!isNaN(seek) && seek != 0) {
                    if (primaryAudioHowl.playing()) {
                        if (startTime == 0) {
                            startTime = time;
                            // delayedGreeting();
                        }
                        // pRot = cam.object3D.rotation;
                        pPos = cam.object3D.position;
                        // console.log(JSON.stringify() + " " + JSON.stringify(pPos));
                        
                        Howler.pos(pPos.x, pPos.y, pPos.z);
                        primaryAudioText.setAttribute('text', {
                        align: "left",
                        value: "User: "+username+"\nScene: "+response.data.sceneTitle+"\n" + primaryAudio.title + "\n " + seek + " secs of " + duration + " = " + percentComplete + "%\n\n\n"
                        });
                        this.el.setAttribute('material', 'color', 'green');
                        this.el.setAttribute('light', {
                            type: 'point',
                            distance: 30,
                            intensity: 2.0,
                            color: 'green'
                        }, true);
                    } else {
                        primaryAudioText.setAttribute('text', {
                            // width: 4, 
                            align: "left",
                            value: "User: "+username+"\nScene: "+response.data.sceneTitle+"\n" + primaryAudio.title + "\n " + seek + " secs of " + duration + " = " + percentComplete + "% - Paused \n\n\n"
                        });
                        this.el.setAttribute('material', 'color', 'red');
                        this.el.setAttribute('light', {
                            type: 'point',
                            distance: 30,
                            intensity: 2.0,
                            color: 'red'
                        }, true);
                    }
                } else {
                    primaryAudioText.setAttribute('text', {
                        // width: 4, 
                        align: "left",
                        value: "User: "+username+"\nScene: "+response.data.sceneTitle+"\n" + primaryAudio.title + "\n " + primaryAudioHowl.state()  + "\n\n\n"
                    });
                    if (primaryAudioHowl.state() == "loading") {
                        // primaryAudioMaterial.color = 'lightblue';
                        this.el.setAttribute('material', 'color', 'yellow');
                        this.el.setAttribute('light', {
                            type: 'point',
                            distance: 30,
                            intensity: 2.0,
                            color: 'yellow'
                        }, true);

                    } else {
                        this.el.setAttribute('material', 'color', 'blue');
                        // primaryAudioMaterial.setAttribute('color', 'blue');
                        this.el.setAttribute('light', {
                            type: 'point',
                            distance: 30,
                            intensity: 2.0,
                            color: 'blue'
                        }, true);
                    }                        
                    }
                }
            }); //end register
        } else {
            
        }//end if url != null

    function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async function delayedGreeting() {
    console.log("Hello");
    await sleep(2000);
    console.log("World!");
    }
    
    AFRAME.registerComponent('ambient-audio-control', {
        schema: {
          color: {default: 'red'}
        },
        init: function () {
          var data = this.data;
          var el = this.el;  
          var defaultColor = el.getAttribute('material').color;
        

          el.addEventListener('mouseenter', function () {
            el.setAttribute('color', data.color);
            mainText.setAttribute('visible', true);
            mainText.setAttribute("look-at", "[camera]");
            
          });
          el.addEventListener('mousedown', function () {
              if (!isPlaying) {
                //   if (startTime != 0;)
                el.setAttribute('color', defaultColor);
                isPlaying = true;
                // mainText.setAttribute('visible', false);
                // mainText.setAttribute('value', 'playing...');
                mainText.setAttribute('text', {
                    // width: 4, 
                    align: "left",
                    value: "playing!"
                  });
                pAudio.components.sound.playSound();
                console.log('...tryna play...');
                // mainText.value = "Playing " + primaryAudio.name;
                // setInterval(function () {
                //     var soundComponent = pAudio.components.sound;
                //     var audioSource = soundComponent.pool.children[0].source;
                //     if (!audioSource) {
                //     console.log('...loading...');
                //     return;
                //     }
                //     var audioContext = audioSource.context;
                //     var currenttime = audioContext.currentTime - soundComponent.pool.children[0].startTime;
                //     console.log('currentTime: %f', audioContext.currentTime);
                // }, 100);
            } else {
                isPlaying = false;
                pAudio.components.sound.pauseSound();
                console.log('...tryna pause...');
            }
          });        
          el.addEventListener('mouseleave', function () {
            el.setAttribute('color', defaultColor);
          });
        },
        tick: function(time, deltaTime) {
            if (isPlaying) {
                if (startTime == 0) {
                    startTime = time;
                }
                pAudioCurrentTime = time - (startTime + pausedTime);
                let num = (pAudioCurrentTime / 1000).toFixed(2);
                  mainText.setAttribute('text', {
                    // width: 4, 
                    align: "left",
                    value: "\nUser: "+username+"\nScene: "+response.data.sceneTitle+"\n\nPlaying " + primaryAudio.title + "\n " + (num + pAudio.components.sound.pool.children[0].offset) + ""
                  });
            } else {
                pausedTime = pausedTime + deltaTime;
                mainText.setAttribute('text', {
                    align: "left",
                    // width: 4, 
                    value: "\nUser: "+username+"\nScene: "+response.data.sceneTitle+"\n\nPaused " + primaryAudio.title + "\n "
                  });
            }
        }
    });
}