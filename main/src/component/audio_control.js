let params = document.querySelector(".primaryAudioParams").id;
console.log("audioParames: " +params);
let stream = params.split("_")[0];
let audiourl = params.split("_")[1];
if (audiourl != null && audiourl.length)
var hostname = (new URL(audiourl)).hostname;
// var hostname = 'servicemedia.net';
let title = "";
let listeners = 0;
let bitrate = 0;

var getJSON = function(url, callback) { //netradio details
    var xhr = new XMLHttpRequest();  
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        // console.log(xhr.response);
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send('url=' + encodeURI(audiourl));
};

// function PrimaryAudioInit() {
//     console.log("tryna PrimaryAudioInit vizzlers " + document.querySelector(".primaryAudioParams").getAttribute('data-audiovizzler'));
//     vidz = document.getElementsByTagName("video");
//     if (document.querySelector(".primaryAudioParams").getAttribute('data-audiovizzler') != null) { //weird, but OK 
//         primaryAudioEl = document.querySelector('#primaryAudio');

//         AudioAnalyzer();

//     } else if (vidz != null && vidz.length > 0) {

//         mainVideoEl = vidz[0];
//         console.log("mainVideoEl " + mainVideoEl.src);
//         AudioAnalyzer();

//     }

    
// }


AFRAME.registerComponent('primary_audio_player', {  //setup and controls for the 3d player
    schema: {
        color: {default: 'red'},
        hitpoint: {default: null}
    },
    // dependencies: ['raycaster'],
    init: function () {
        // let primaryAudioEl = document.querySelector('#primaryAudio');
        // let this = this; //?
        this.tick = AFRAME.utils.throttleTick(this.tick, 100, this);
        // this.el.setAttribute('gltf-model', '#audioplayer');
        this.el.classList.add('activeObjexRay');
        this.hitpoint = this.data.hitpoint;
        // this.el.visible = false;
        // this.el.object3D.visible = false;
        this.el.object3D.position = new THREE.Vector3('0 0 0');
        this.screen = null;
        this.play_button = null;
        this.play_icon = null;
       this.slider_end = null;
       this.slider_begin = null;
       this.slider_handle = null;
        this.meshArray = []; //nm
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
            this.model = this.el.getObject3D('mesh');
            this.ref = document.querySelector("#primaryAudioWaveform");
            this.loader = new THREE.TextureLoader();
            this.loader.crossOrigin = '';
            this.texture = this.loader.load(this.ref.src);
            this.texture.encoding = THREE.sRGBEncoding; 
            this.texture.flipY = false; 
            this.material = new THREE.MeshBasicMaterial( { map: this.texture, transparent: true } ); 
            // Go over the submeshes and modify materials we want.
                        
            this.model.traverse(node => {
                // if(node.isMesh) {
                    if (node.name == "screen") { //not the eyes!
                        // console.log("gotsa screen!!!");
                        
                        this.screen = node;
                        this.screen.material = this.material;
                        // this.meshArray.push(this.screen);
                        //   node.material = this.material;
                        }

                    if (node.name.includes("play_button")) {
                        // node.visible = false;
                        // console.log("gotsa play!!!");
                        this.play_button = node;
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
                    // this.slider_handle.position = this.slider_begin.position;
                    // console.log("gotsa slider handle");
                    if (this.slider_handle != null && this.slider_begin != null && this.slider_end != null) {
                        this.slider_handle.position.lerpVectors(this.slider_begin.position, this.slider_end.position, 0);
                    }
                    
                }
                
            });
            // this.el.setAttribute('sky-env-map');
           
    //         this.setListeners();
        });
    // },
    // setListeners: function () {

        let thiz = this; //? localscope, but not updated like this
        thiz.slider_begin = this.slider_begin;
        thiz.slider_end = this.slider_end;
        // this.mouseOverObject = null;
        this.raycaster = null;
        this.intersection = null;
        this.hitpoint = null;
        this.el.addEventListener('raycaster-intersected', e =>{  
            this.raycaster = e.detail.el;
            thiz.raycaster = this.raycaster;
            this.intersection = this.raycaster.components.raycaster.getIntersection(this.el, true);
            this.hitpoint = this.intersection.point;
            
            // console.log('ray hit', this.intersection.point);
            if (!this.intersection.object.name.includes("screen") &&
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
                // console.log('ray hit', this.intersection.object.name, thiz.mouseOverObject );
            }
            });
            this.el.addEventListener("raycaster-intersected-cleared", () => {
                // console.log("intersection cleared");
                this.raycaster = null;
            });

            this.el.addEventListener('click', function (event) {
                event.preventDefault();
                // thiz.hitpoint = this.hitpoint;
                console.log("click on paudio with " + thiz.mouseOverObject + " raycaster "+ thiz.raycaster);
                if (thiz.raycaster != null) {
                    // console.log(thiz.mouseOverObject);

                  if (thiz.mouseOverObject.includes("play")) {
                    // console.log("meshname clickded: " + thiz.mouseOverObject);
                    // console.log("play");
                        if (primaryAudioMangler != null) {
                            primaryAudioMangler.playPauseToggle();
                        }
                } else if (thiz.mouseOverObject.includes("pause")) {
                    // console.log("meshname clickded: " + thiz.mouseOverObject);
                    // console.log("pause");
                        if (primaryAudioMangler != null) {
                            primaryAudioMangler.playPauseToggle();
                        }
                } else if (thiz.mouseOverObject.includes("screen")) {
                        console.log("meshname clickded: " + thiz.mouseOverObject + " at hit point " + thiz.hitpoint);
                        // this.slider_begin.position.y/this.slider_end.position.y 
                        let nStart = new THREE.Vector3();
                        let nEnd = new THREE.Vector3();
                        thiz.slider_begin.getWorldPosition( nStart );
                        thiz.slider_end.getWorldPosition( nEnd );
                        // this.hitpoint = this.intersection.point;
                        console.log("screen hit at " + JSON.stringify(thiz.hitpoint));
                        let range = nEnd.x.toFixed(2) - nStart.x.toFixed(2);
                        let correctedStartValue = thiz.hitpoint.x.toFixed(2) - nEnd.x.toFixed(2);
                        let percentage = (((correctedStartValue * 100) / range) + 100).toFixed(2); 
                        // let time = (percentage * (this.video.duration / 100)).toFixed(2);
                        // let touchPosition = (((intersects[i].point.y.toFixed(2) - this.slider_begin.position.y.toFixed(2)) * 100) / (this.slider_end.position.y.toFixed(2) - this.slider_begin.position.y.toFixed(2)));
                        console.log("bg touch % " + percentage +  " touchPosition " + JSON.stringify(thiz.hitpoint) + " vs start " +  JSON.stringify(nStart) + " vs end " +  JSON.stringify(nEnd));
                        // this.slider_handle.position.x = intersects[i].point.x; 
                        // this.slider_handle.position.z =  nStart.z;
                        // this.slider_handle.position.z =  nStart.y; 
                        thiz.slider_handle.position.lerpVectors(thiz.slider_begin.position, thiz.slider_end.position, percentage * .01);
                        //   this.video.currentTime = time;
                        
                        if (primaryAudioMangler != null) {
                            primaryAudioMangler.slider_update(percentage);
                        }
                    
                    } else if (thiz.mouseOverObject.includes("handle")) {
                        // console.log("handle");
                    
                    } else if (thiz.mouseOverObject.includes("fastforward")) {
                        // console.log("ffwd");
                        if (primaryAudioMangler != null) {
                            primaryAudioMangler.fastForward();
                        }
                    
    
                    } else if (thiz.mouseOverObject.includes("rewind")) {
                        // console.log("rewind");
                        if (primaryAudioMangler != null) {
                            primaryAudioMangler.rewind();
                        }
    
                    }
                // this.raycaster = null;
                }

            });
    },
    slider_update: function (percentage) {
        // if (primaryAudioMangler != null) {
        //     primaryAudioMangler.slider_update(percentage);
        // }
        // console.log(this.percent);
        if (this.slider_handle != null) {
            this.slider_handle.position.lerpVectors(this.slider_begin.position, this.slider_end.position, percentage * .01);
        }
            
    }, 
    player_status_update (state) {
        if (this.play_button != null) {
            if (state == "loading") {

                this.play_button.material = this.yellowmat;
            } else if (state == "ready") {
                this.play_button.material = this.bluemat;
            } else if (state == "playing") {
                this.play_button.material = this.greenmat;
            } else if (state == "paused") {
                this.play_button.material = this.redmat;
            }
        }
    },
    tick: function() {
        if (!this.raycaster) {
           return;
        }
        const inter_section = this.raycaster.components.raycaster.getIntersection(this.el, true);
        if (inter_section) {
            this.hitpoint = inter_section.point;
            // console.log("hitpoint " + JSON.stringify(this.hitpoint));
           // your calculations
        }
     }

});

// console.log("params" +params+ "url " + audiourl + " stream " + stream);
// if (audiourl != null) {
    if (stream != "false") { //streaming mode
        // let primaryAudioHowl = new Howl({ //use howler audio mangler
        //     src: audiourl, 
        //     html5: true, //no webaudio api when streaming  
        //     volume: 1.0,
            
        // });
        AFRAME.registerComponent('primary_audio_control', { //register for streaming
            schema: {
                color: {default: 'red'},
                oggurl: {default: ''},
                mp3url: {default: ''},
                title: {default: ''},
                volume: {default: 0},
                targetattach: {default: false},
                autoplay: {default: false}
            },
            
            init: function () {
                var data = this.data;
                var el = this.el;  
                var defaultColor = 'blue';
                this.primaryAudioText = document.querySelector("#primaryAudioText");
                this.isPlaying = false;
                this.cam = document.querySelector("[camera]"); //MUST DO THIS HERE or it doesn't work in tick below... okthen
                // this.pPos = this.cam.object3D.position; //for spatialization
                // Howler.pos(this.pPos.x, this.pPos.y, this.pPos.z);
                // let waveform = document.querySelector("#primaryAudioWaveformImageEntity");
                // waveform.setAttribute('visible', false); //no waveform if streaming mode...
                // getJSON('/netradioheaders', function(err, data) { //no workie, tries to get headers with genre, etc..
                //     if (err !== null) {
                //         console.log('Something went wrong: ' + data);
                //     } else {
                //         console.log('streamdata ' + data);
                //         // document.querySelector("#primaryAudioText").setAttribute('text', {
                //         //     // width: 4, 
                //         //     align: "left",
                //         //     value: "Stream: "+hostname+"\nPlaying: "+ data.title + "\n\nListeners: " + data.listeners + "\nBitrate: " + data.bitrate
                //         // });
                //     }
                // });
                // console.log("streaming url " + url);
                var normalizedVolume = ((this.data.volume - -80) * 100) / (20 - -80) * .01; //gets down to between zero and one
                console.log("normalized primary Volume is " + normalizedVolume);
                var audioEl = document.querySelector('.audio');
                if (audioEl != null) {
                    let audioElPosition = audioEl.getAttribute('position');
                    console.log("position of audioElement: " + JSON.stringify(audioElPosition));
                    if (audioElPosition == null || audioElPosition == undefined) {
                        audioElPosition = "0 -1 -2";
                    }
                    primaryAudioParent.setAttribute('position', audioElPosition); //snap to audio posiition if there is one...

                }
                if (timedEventsListenerMode == null) {
                    timedEventsListenerMode = "Primary Audio";
                }
                primaryAudioHowl.load();
                primaryAudioParent.setAttribute("visible",true);
                document.querySelector("#primaryAudioText").setAttribute('visible', true);
                // document.querySelector("#primaryAudioText").setAttribute("look-at", "#player");
                document.querySelector("#primaryAudioText").setAttribute('text', {
                    // width: 4, 
                    align: "left",
                    value: data.title
                });
                console.log("PRIMARY AUDIO AUTOPLAY is " + this.data.autoplay );
                if (this.data.autoplay) {
                    primaryAudioHowl.play();
                    primaryAudioHowl.volume(normalizedVolume);
                    el.emit('primaryAudioToggle', {isPlaying : true}, true);


                }
                document.querySelector("#primaryAudioText").setAttribute('visible', true);
                // document.querySelector("#primaryAudioText").setAttribute("look-at", "#player");
                getJSON('/netradiodetails', function(err, data) {
                    if (data != null) {
                        if (err !== null) {
                            console.log('Something went wrong: ' + data);
                        } else {
                            console.log('streamdata ' + data.title);
                            document.querySelector("#primaryAudioText").setAttribute('text', {
                                // width: 4, 
                                align: "left",
                                value: "Stream: "+hostname+"\nPlaying: "+ data.title + "\n\nListeners: " + data.listeners + "\nBitrate: " + data.bitrate
                            });
                        }
                    }
                });
                el.addEventListener('mouseenter', function () {
                    document.querySelector("#primaryAudioText").setAttribute('visible', true);
                    // document.querySelector("#primaryAudioText").setAttribute("look-at", "#player");
                    getJSON('/netradiodetails', function(err, data) {
                        if (data != null) {
                            if (err !== null) {
                                console.log('Something went wrong: ' + data);
                            } else {
                                console.log('streamdata ' + data.title);
                                document.querySelector("#primaryAudioText").setAttribute('text', {
                                    // width: 4, 
                                    align: "left",
                                    value: "Stream: "+hostname+"\nPlaying: "+ data.title + "\n\nListeners: " + data.listeners + "\nBitrate: " + data.bitrate
                                });
                            }
                        }
                    });
                    // console.log('mousenter primary_audio_control');
                });
                el.setAttribute('light', {
                    type: 'point',
                    distance: 30,
                    intensity: 1.0,
                    color: 'yellow'
                }, true);

                el.addEventListener('beat', function (e) {
                    console.log("beat volume " + volume);
                }, false);

                el.addEventListener('click', function () {  

                    if (!primaryAudioHowl.playing()) {
                        el.setAttribute('light', {
                            type: 'point',
                            distance: 30,
                            intensity: 1.0,
                            color: 'green'
                        }, true);
                        // duration = primaryAudioHowl.duration().toFixed(2);
                        primaryAudioHowl.play();
                        el.emit('primaryAudioToggle', {isPlaying : true}, true);
                        primaryAudioHowl.volume(normalizedVolume);
                        console.log('...tryna play...');
                        // primaryAudioHowl.pos(0, 1.6, -1);
                        this.isPlaying = true;
                        el.setAttribute('material', 'color', 'green');

                    } else {
                        // if (this.isPlaying) {
                        el.setAttribute('light', {
                            type: 'point',
                            distance: 30,
                            intensity: 1.0,
                            color: 'red'
                        }, true);
                            // if (primaryAudioHowl != null) {
                            primaryAudioHowl.pause();
                            this.isPlaying = false;
                            console.log('...tryna pause...');
                            el.setAttribute('material', 'color', 'red');
                            el.emit('primaryAudioToggle', true);
                            // }
                        // }
                    }
                });        
                el.addEventListener('mouseleave', function () {
                    el.setAttribute('color', defaultColor);
                });
            },
            playPauseToggle: function() {
                if (!primaryAudioHowl.playing()) {
                    console.log("tryna play");
                    primaryAudioHowl.play();
                    this.el.emit('primaryAudioToggle', {isPlaying : true}, true);
                    this.isPlaying = true;
                    this.el.setAttribute('material', 'color', 'green');
                    PauseIntervals(false);
                } else {    
                    console.log("tryna pause");
                    primaryAudioHowl.pause();
                    this.el.emit('primaryAudioToggle', {isPlaying : false}, true);
                    this.isPlaying = false;
                    this.el.setAttribute('material', 'color', 'red');
                    PauseIntervals(true);
                
                }
            },
            modVolume: function(newVolume) {
                // console.log("tryna mod primaryAUdioStreamVolume to " + newVolume);
                // primaryAudioHowl.volume(normalizedVolume);
                normalizedVolume = ((newVolume - -80) * 100) / (20 - -80) * .01;
                console.log("normalizedVolume is " + normalizedVolume);
                primaryAudioHowl.volume(normalizedVolume);
            },
            playPause: function() {
                if (!this.isPlaying) {
                    primaryAudioHowl.play();
                    this.el.emit('primaryAudioToggle', true);
                    this.isPlaying = true;
                } else {
                    primaryAudioHowl.pause();
                    this.el.emit('primaryAudioToggle', true);
                    this.isPlaying = false;
                }
            }
        });
    } else { //normal mode, not streaming, so can use webaudio api
        // let primaryAudioHowl = new Howl({ //use howler audio mangler
        //     src: audiourl, //use ogg for looping
        //     // loop: true,
        //     html5: true,
        //     volume: 1.0
        // });
        // primaryAudioHowl.load();
        // duration = primaryAudioHowl.duration();
        // let primaryAudioTimeKeys = [];
        
        AFRAME.registerComponent('primary_audio_control', { //register for not-streaming
        schema: {
        audioID: {default: ''},
        color: {default: 'red'},
        url: {default: ''},
        title: {default: ''},
        volume: {default: 0},
        audioevents: {default: false},
        targetattach: {default: false},
        autoplay: {default: false},
        // jsonData: {
        //     parse: JSON.parse,
        //     stringify: JSON.stringify
        //   },
        timekeys: {default: ''},
        timeKeysIndex: {default: 0},
        nextTimeKey: {default: 0}
        // analyser: {default: 'selector'}

        },

        init: function () {

            this.tick = AFRAME.utils.throttleTick(this.tick, 100, this);
            this.primaryAudioHowl = primaryAudioHowl;
            this.mainTransportSlider = document.getElementById("mainTransportSlider");
            // let analyser = null;
            var data = this.data;
            var el = this.el;  
            var defaultColor = 'blue';
            this.primaryAudioText = document.querySelector("#primaryAudioText");
            this.primaryAudioParent = document.querySelector("#primaryAudioParent");
            this.primaryAudioPlayerObject = document.getElementById("primaryAudioPlayer");
            this.primary_audio_player = this.primaryAudioPlayerObject.components.primary_audio_player;
            this.isPlaying = false;

            this.percentComplete = 0;
            this.cam = document.querySelector("[camera]"); 
            this.primaryAudioEvents = null; //if audioevents is true, placeholder ref to component that might have some data
            // his.this.statsDiv = null;
            this.statsDiv = document.getElementById("transportStats");
            
            // this.modalStatsDiv = document.getElementById("modalTimeStats");
            this.transportPlayButton = document.getElementById("transportPlayButton"); //this is a 2D canvas overlay
            
            // this.position = this.el.object3D.position;
            // this.primaryAudioHowl = new Howl({  
            //     src: data.url,
            //     loop: true, 
            //     volume: 1.0  
            // });
            // this.initHowl(data.url);
            if (timedEventsListenerMode == null) {
                timedEventsListenerMode = 'Primary Audio'
            }
            this.enviroDressing = document.querySelector('.environmentDressing');
            let primaryAudioText = this.primaryAudioText;
            let primaryAudioParent = this.primaryAudioParent;
            // this.primaryAudioHowl = this.primaryAudioHowl;
            // console.log("p audio url " + this.data.url);
            var audioEl = document.querySelector('.audio');
            var normalizedVolume = ((this.data.volume - -80) * 100) / (20 - -80) * .01; //vol is ranged from -80 to +20 db
            this.currentAudioTime = 0;
            this.timekeys = [];
            console.log("normalized Volume is " + normalizedVolume);
            let thiz = this;
            if (audioEl != null) {
                let audioElPosition = audioEl.getAttribute('position');
                console.log("position of audioElement: " + JSON.stringify(audioElPosition));
                primaryAudioParent.setAttribute('position', audioElPosition); //snap to audio posiition if there is one...
            }
            // this.el.addEventListener('eventData', (event) => {
            //     console.log(event.details);
            // }); 
            this.el.addEventListener('eventData', function (event) {  //custom event from primary_audio_events, below //STILL?
                console.log("gots eventData!: " + event.detail);
                let timekeys = [];
                let timeKeysData = event.detail;
                console.log("timekeys length " + JSON.stringify(timeKeysData));   
                if (data.audioevents) {
                    // for (let i = 0; i < timeKeysData.Length; i++) {
                    //     // timekeys.push(timeKeysData[i].keystarttime);
                    //     console.log("timekey " + JSON.stringify(timeKeysData[i]));    
                    // }        
                        timeKeysData.forEach(function (timekey) {
                        console.log("timekey " + timekey.keystarttime);
                        timekeys.push(parseFloat(timekey.keystarttime).toFixed(2));
                    });
                    
                    data.timekeys = timekeys;      
                    data.nextTimeKey = data.timekeys[data.timeKeysIndex];  //should be zero at init
                    console.log("first timekey " + data.nextTimeKey);           
                }

            });

            primaryAudioText.setAttribute('visible', true);
            // primaryAudioText.setAttribute("look-at", "#player");
            this.primaryAudioHowl.fade(0, 1, 1000);
            this.primaryAudioHowl.pos(this.el.object3D.position.x, this.el.object3D.position.y, this.el.object3D.position.z);

            if (data.targetattach) {
                el.addEventListener('targetattach', function (event) {
                    console.log("hey gotsa attach to target message" + event.detail.targetEntity);
                    let audioElPosition = event.detail.targetEntity.getAttribute('position');
                    console.log("position of audioElement: " + JSON.stringify(audioElPosition));
                    thiz.primaryAudioHowl.pos(audioElPosition.x, audioElPosition.y, audioElPosition.z);
                    primaryAudioParent.setAttribute('position', audioElPosition);
                });
            }
            // this.primaryAudioHowl.pos(audioElPosition.x, audioElPosition.y, audioElPosition.z);
            if (data.autoplay) {    
                console.log("PRIMARY AUDIO AUTOPLAY is " + this.data.autoplay );
                this.primaryAudioHowl.play();
                el.emit('primaryAudioToggle', {isPlaying : true}, true);
                this.primaryAudioHowl.volume(normalizedVolume);
            }
            // this.primaryAudioHowl.onplay(()=> {
            //     this.primaryAudioHowl.volume(normalizedVolume);
            // });
            this.primaryAudioHowl.on('play', function(){
                thiz.primaryAudioHowl.volume(normalizedVolume);
                console.log('tryna play primary audio with volume ' + normalizedVolume);
              });
            this.duration = this.primaryAudioHowl.duration().toFixed(2);
            
            el.addEventListener('mouseenter', function () {
                if (this.primaryAudioHowl != undefined) {
                    console.log("mousenter primaryAudio");
                    let primaryAudioText = document.querySelector("#primaryAudioText");
              
                    primaryAudioText.setAttribute('text', {
                        baseline: "bottom",
                            wrapCount: 75,
                        align: "left",
                        value: data.title
                    });
                    // console.log('mousenter primary_audio_control');
                    this.duration = this.primaryAudioHowl.duration().toFixed(2);
                } else {
                    this.primaryAudioHowl = primaryAudioHowl;
                }
            });
            el.setAttribute('light', {
                type: 'point',
                distance: 30,
                intensity: 1.0,
                color: 'yellow'
            }, true);
        
            el.addEventListener('click', function () {
                PlayButton();
            });
            
            el.addEventListener('mouseleave', function () {
                el.setAttribute('color', defaultColor);
            });
            // this.mainTransportSlider.addEventListener('onchange', function () {
            //     console.log(this.value);

            //     this.primaryAudioHowl.seek(this.duration * (this.value * .01));
            // });
            // this.transportPlayButtonThree = document.createElement('a-entity');
            // this.transportPlayButtonThree.setAttribute('primary_audio_playtoggle');
            // this.transportPlayButtonThree.appendChild(sceneEl);
            if (this.mainTransportSlider != null) {
                this.mainTransportSlider.oninput = function() {
                    console.log(this.value);
                    if (this.primaryAudioHowl != null) {
                        this.duration = this.primaryAudioHowl.duration().toFixed(2);
                        console.log("seeking " + (this.duration * (this.value * .01)));
                        this.primaryAudioHowl.seek(this.duration * (this.value * .01));
                    } else {
                        this.primaryAudioHowl = primaryAudioHowl;
                    }       
                }
            }

        },
        modVolume: function(newVolume) {
            // console.log("tryna mod primaryAUdioVolume to " + newVolume);
            // this.primaryAudioHowl.volume(normalizedVolume);
            normalizedVolume = ((newVolume - -80) * 100) / (20 - -80) * .01;
            console.log("normalizedVolume is " + normalizedVolume);
            this.primaryAudioHowl.volume(normalizedVolume);
            // this.cam = document.querySelector("#head");
                                                                    //this.pPos = this.cam.object3D.position; //for spatialization
            // console.log("pPos " + JSON.stringify(this.pPos));
            // Howler.pos(this.pPos.x, this.pPos.y, this.pPos.z); //this doesn't work, bc html5 mode... do it manually..
        },
        playPauseToggle: function() {
            if (!this.primaryAudioHowl.playing()) {
                console.log("tryna play");
                this.primaryAudioHowl.play();
                this.el.emit('primaryAudioToggle', {isPlaying : true}, true);
                this.isPlaying = true;
                PauseIntervals(false);
            } else {    
                console.log("tryna pause");
                this.primaryAudioHowl.pause();
                this.el.emit('primaryAudioToggle', {isPlaying : false}, true);
                this.isPlaying = false;
                PauseIntervals(true);
            }
        },
        fastForward: function() {
            // this.percentComplete 
            this.currentTime = this.primaryAudioHowl.seek();
            if (this.currentTime < this.duration - 10) {
                this.primaryAudioHowl.seek(this.currentTime + 10);
            } else {
                this.primaryAudioHowl.seek(0);
            }
            if (!this.primaryAudioHowl.playing()) {
                this.mainTransportSlider.value = ((this.currentTime + 10) / this.duration * 100).toFixed(1);
            }
            //     console.log("tryna play");
            //     this.primaryAudioHowl.play();
            //     this.el.emit('primaryAudioToggle', {isPlaying : true}, true);
            //     this.isPlaying = true;
            // } else {    
            //     console.log("tryna pause");
            //     this.primaryAudioHowl.pause();
            //     this.el.emit('primaryAudioToggle', {isPlaying : false}, true);
            //     this.isPlaying = false;
            // }
        },
        rewind: function() {
            this.currentTime = this.primaryAudioHowl.seek();
            if (this.currentTime > 10) {
                this.primaryAudioHowl.seek(this.currentTime - 10);
            } else {
                this.primaryAudioHowl.seek(this.duration - 10);
            }
            if (!this.primaryAudioHowl.playing()) {
                this.mainTransportSlider.value = ((this.currentTime + 10) / this.duration * 100).toFixed(1);
            }
            // if (!this.primaryAudioHowl.playing()) {
            //     console.log("tryna play");
            //     this.primaryAudioHowl.play();
            //     this.el.emit('primaryAudioToggle', {isPlaying : true}, true);
            //     this.isPlaying = true;
            // } else {    
            //     console.log("tryna pause");
            //     this.primaryAudioHowl.pause();
            //     this.el.emit('primaryAudioToggle', {isPlaying : false}, true);
            //     this.isPlaying = false;
            // }
        },
        start: function() {
            this.primaryAudioHowl.seek(0);
        },
        end: function() {
            this.primaryAudioHowl.seek(this.duration - 2);
        },
        slider_update: function(percentage) { 
            // this.slider_handle.position.lerpVectors(this.slider_begin.position, this.slider_end.position, percentage * .01);
            console.log("slider Update: " +percentage);
                    if (this.primaryAudioHowl != null) {
                        this.duration = this.primaryAudioHowl.duration().toFixed(2);
                        console.log("seeking " + (this.duration * (percentage * .01)));
                        this.primaryAudioHowl.seek(this.duration * (percentage * .01));
                    }      
        },
        nextIndex: function (lastTimeKey) {
            this.data.nextTimeKey = 0;
            var data = this.data;
                // if (this > data.timekeys[data.timeKeysIndex]) {
                //     seeking = false;
                //     console.log("currentTime " + seek + " is greater than timekey " + data.timekeys[data.timeKeysIndex]);
                //     data.timeKeysIndex++;
                //     // return;
                // } else {
                //     seeking = true;
                //     // console.log("currentTime " + seek + "next event at " + data.timekeys[data.timeKeysIndex])
                //     // console.log("currentTime " + this.currentTime + "is less than than timekey " + data.timeKeysIndex);
                // }
            console.log("lasttimeKey " + lastTimeKey + " index " + data.timeKeysIndex);
            data.timeKeysIndex++;
            data.nextTimeKey = data.timekeys[data.timeKeysIndex]
        
        },
        tick: function(time, deltaTime) {
            
            if (this.primaryAudioHowl != undefined) {
                var data = this.data;
                var seek = this.primaryAudioHowl.seek() || 0;
                seek = Number(seek).toFixed(1);
                // this.currentTime = seek;
                this.duration = this.primaryAudioHowl.duration().toFixed(2);
                // let percentComplete = Math.floor((seek / duration) * 10);
                this.percentComplete = ((seek / this.duration) * 100).toFixed(2);
                var el = this.el; 
                var seeking = true;
                if (!isNaN(seek) && seek != 0) {

                    if (this.primaryAudioHowl.playing()) {
                        if (this.mainTransportSlider != null && timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'primary audio') {
                            this.mainTransportSlider.value = this.percentComplete;                  
                        }
                         
                        this.primaryAudioHowl.pos(el.object3D.position.x, el.object3D.position.y, el.object3D.position.z);
                        document.querySelector("#primaryAudioText").setAttribute('text', {
                            width: 4, 
                            baseline: "bottom",
                            wrapCount: 75,
                        align: "left",
                        value: data.title + "\n playing - " + fancyTimeFormat(seek) + " / " + fancyTimeFormat(this.duration) + " = " + this.percentComplete + "%\n\n\n"
                        });
                        fancyTimeString = ""+data.title + "<br><span style='color: lightgreen'><strong> playing </strong></span>" + fancyTimeFormat(seek) + " / " + fancyTimeFormat(this.duration) + " - " + this.percentComplete + "%";
                        if (timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'primary audio') {
                            // this.statsDiv.innerHTML = fancyTimeString;
                            MediaTimeUpdate(fancyTimeString);
                            currentTime = seek;
                        }

                        if (this.transportPlayButton != null && timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'primary audio') {
                            this.transportPlayButton.style.color = 'lightgreen';
                        }
                            // if (this.modalStatsDiv != null) {
                            //     this.modalStatsDiv.innerHTML = ""+data.title + "<br><span style='color: lightgreen'><strong> playing </strong></span>" + fancyTimeFormat(seek) + " / " + fancyTimeFormat(this.duration) + " - " + this.percentComplete + "%";
                            // } else {
                            //     this.modalStatsDiv = document.getElementById("modalTimeStats");
                            //     this.modalStatsDiv.innerHTML = ""+data.title + "<br><span style='color: lightgreen'><strong> playing </strong></span>" + fancyTimeFormat(seek) + " / " + fancyTimeFormat(this.duration) + " - " + this.percentComplete + "%";
                            // }
                        this.el.setAttribute('material', 'color', 'green');
                        this.el.setAttribute('light', {
                            type: 'point',
                            distance: 30,
                            intensity: 1.0,
                            color: 'green'
                        }, true);

                        this.primary_audio_player.slider_update(this.percentComplete);
                        this.primary_audio_player.player_status_update("playing");
                    } else {
                        // console.log("not playing but paused?");
                        document.querySelector("#primaryAudioText").setAttribute('text', {
                            width: 4, 
                            baseline: "bottom",
                            wrapCount: 75,
                            align: "left",
                            value: data.title + "\n paused - " + fancyTimeFormat(seek) + " / " + fancyTimeFormat(this.duration) + " = " + this.percentComplete + "%\n\n\n"
                        });
                        fancyTimeString = ""+data.title + "<br><span style='color: yellow'><strong> loading </strong></span>" + fancyTimeFormat(seek) + " / " + fancyTimeFormat(this.duration) + " - " + this.percentComplete + "%";
                        if (this.statsDiv != null && timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'primary audio') {
                            // this.statsDiv.innerHTML = fancyTimeString;
                            // MediaTimeUpdate(fancyTimeString);
                            MediaTimeUpdate(fancyTimeString);
                            currentTime = seek;
                        }
                        if (this.transportPlayButton != null && timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'primary audio') {
                            this.transportPlayButton.style.color = 'red';
                        }
                        this.el.setAttribute('material', 'color', 'red');
                        this.el.setAttribute('light', {
                            type: 'point',
                            distance: 30,
                            intensity: 1.0,
                            color: 'red'
                        }, true);
                        this.primary_audio_player.player_status_update("paused");
                    }
                } else {
                    // console.log("bad seek");
                    document.querySelector("#primaryAudioText").setAttribute('text', {
                        width: 4, 
                        baseline: "bottom",
                            wrapCount: 75,
                        align: "left",
                        value: data.title + "\n " + this.primaryAudioHowl.state()  + "\n\n"
                    });
                    if (this.primaryAudioHowl.state() == "loading") {
                        // primaryAudioMaterial.color = 'lightblue';
                        this.el.setAttribute('material', 'color', 'yellow');
                        this.el.setAttribute('light', {
                            type: 'point',
                            distance: 30,
                            intensity: 1.0,
                            color: 'yellow'
                        }, true);
                        fancyTimeString = ""+data.title + "<br><span style='color: yellow'><strong> loading </strong></span>" + fancyTimeFormat(seek) + " / " + fancyTimeFormat(this.duration) + " - " + this.percentComplete + "%";
                        if (this.statsDiv != null && timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'primary audio') {
                            // this.statsDiv.innerHTML = fancyTimeString;
                            // MediaTimeUpdate(fancyTimeString);
                            MediaTimeUpdate(fancyTimeString);
                        }
                        if (this.transportPlayButton != null && timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'primary audio') {
                            this.transportPlayButton.style.color = 'yellow';
                        }
                        this.primary_audio_player.player_status_update("loading");
                    } else {
                        this.el.setAttribute('material', 'color', 'blue');
                        // primaryAudioMaterial.setAttribute('color', 'blue');
                        this.el.setAttribute('light', {
                            type: 'point',
                            distance: 30,
                            intensity: 1.0,
                            color: 'blue'
                        }, true);
                        fancyTimeString = ""+data.title + "<br><span style='color: blue'><strong> ready </strong></span>" + fancyTimeFormat(seek) + " / " + fancyTimeFormat(this.duration) + " - " + this.percentComplete + "%";
                        if (this.statsDiv != null && timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'primary audio') {
                            // this.statsDiv.innerHTML = fancyTimeString;
                            MediaTimeUpdate(fancyTimeString);
                            currentTime = seek;
                        }
                        if (this.transportPlayButton != null && timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'primary audio') {
                            this.transportPlayButton.style.color = 'blue';
                        }
                        this.primary_audio_player.player_status_update("ready");    
                    }                        
                    }
                }
        },
        events: function(events) {
            this.timekeys = events;
            console.log("this.timekeys  " + this.timekeys);
        },
        analyzer_beat: function(volume) {
            console.log("beat event volume " + volume);
            scale = {};
            scale.x = volume * .05;
            scale.y = volume * .05;
            scale.z = volume * .05;
            
            scale2 = {};
            scale2.x = 1;
            scale2.y = volume * .1;
            scale2.z = 1;
            scale3 = {};
            scale3.x = volume * .5;
            scale3.y = volume * .5;
            scale3.z = volume * .5;
        
            this.el.setAttribute('scale', scale);
            
            if (this.enviroDressing != null) {
                
                this.enviroDressing.setAttribute('scale', scale2 );
                this.enviroDressing.setAttribute('animation', 'property: scale; to: 1 1 1; dur: 250; startEvents: beatRecover');
                this.enviroDressing.emit('beatRecover');

            }

            this.el.setAttribute('animation', 'property: scale; to: 1 1 1; dur: 250; startEvents: beatRecover');
            // enviroDressing.setAttribute('animation', 'property: scale; to: 1 1 1; dur: 250; startEvents: beatRecover');
            this.el.emit('beatRecover');
            // this.el.emit('beatRecover2');
        },
        timekey_beat: function(vol) {
            
            scale = {};
            let v = 25;
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
            console.log("beat event volume " + v);
            this.el.setAttribute('scale', scale);
            
            if (this.enviroDressing != null) {
                
                this.enviroDressing.setAttribute('scale', scale2 );
                this.enviroDressing.setAttribute('animation', 'property: scale; to: 1 1 1; dur: 250; startEvents: beatRecover');
                this.enviroDressing.emit('beatRecover');

            }

            this.el.setAttribute('animation', 'property: scale; to: 1 1 1; dur: 250; startEvents: beatRecover');
            // enviroDressing.setAttribute('animation', 'property: scale; to: 1 1 1; dur: 250; startEvents: beatRecover');
            this.el.emit('beatRecover');
            // this.el.emit('beatRecover2');
        }
        // draw: function() {
        //     // analyser.getByteFrequencyData(dataArray);
        //     analyser.getByteTimeDomainData(dataArray);
        //     requestAnimationFrame(draw);
            
        //     var sliceWidth = WIDTH * 1.0 / bufferLength;
        //     var x = 0;
        //     var frequencyBins = analyser.fftSize / 2;
        //     var scale = Math.log(frequencyBins - 1) / WIDTH;
        //     ctx.fillStyle = "#000";
        //     ctx.fillRect(0, 0, WIDTH, HEIGHT);
            
        //     ctx.lineWidth = 4;
        //     ctx.strokeStyle = "#fff";
        //     ctx.beginPath();
        //     x = 0;
        //     console.log( dataArray[0])
        //     for (var i = 0; i < bufferLength; i++) {
        //       var v = dataArray[i] / 128.0;
        //       var y = v * HEIGHT / 2;
          
        //       if (i === 0) {
        //         ctx.moveTo(x, y );
        //       } else {
        //         ctx.lineTo(x, y);
        //       }
        //       x += sliceWidth;
        //     }
        //     ctx.lineTo(WIDTH, dataArray[0] / 128.0 * HEIGHT / 2);
        //     ctx.stroke();
        //   }
        }); //end register
    }


AFRAME.registerComponent('primary_audio_events', {

    // schema: {
    //   jsonData: {
    //     parse: JSON.parse,
    //     stringify: JSON.stringify
    //   }
    // },
    schema: {
        jsonData: {default: ""}
        },
    init: function() {
        if (room == undefined) {
           room = window.location.pathname.split("/").pop();
        }
        let patk = localStorage.getItem(room +"_timeKeys"); //so it must be a clean scene to import "default" audio events!
        // console.log("PRIMARY AUDIO EVENTS " + patk);
        if (patk == null) {
        let theData = this.el.getAttribute('data-audio-events');
        this.data.jsonData = JSON.parse(atob(theData)); //convert from base64;
        let tkObject = {};
        tkObject.listenTo = "Primary Audio";

        tkObject.timekeys = this.data.jsonData.timekeys;
        // let timekeys = this.data.jsonData.timekeys;
        // timekeys.listenTo = "primary audio";
        // console.log("timekeys: " + timekeys);
        // localStorage.setItem(room + "_timeKeys", JSON.stringify(timekeys)); 
        localStorage.setItem(room + "_timeKeys", JSON.stringify(tkObject)); 

        // console.log(JSON.stringify(timekeys));
        } 
        SetPrimaryAudioEventsData();
    },
    currentAudioTime: function(audioTime) {
        console.log("audiotime : " + audioTime);
    }
});

// AFRAME.registerComponent('primary_audio_analyzer', {

//     schema: {
//       mode: {default: ""}
//     },
//     init: function() {
//         // Create an analyser node in the Howler WebAudio context
//         var analyser = primaryAudioHowl.ctx.createAnalyser();

//         // Connect the masterGain -> analyser (disconnecting masterGain -> destination)
//         primaryAudioHowl.masterGain.connect(analyser);

//         // Connect the analyser -> destination
//         analyser.connect(primaryAudioHowl.ctx.destination);
//     },

// });

/**
 * Scale children based on audio frequency levels.
 */
    // AFRAME.registerComponent('audio_analyzer_', { //nah...
    //     schema: {
    //     //   analyserEl: {type: 'selector'},
    //     max: {default: 20},
    //     multiplier: {default: 100}
    //     },
    //     init: function () {
    //         // this.analyserEl = primaryAudioHowl.ctx.createAnalyser();
    //         // let audios = document.getElementsByTagName('audio');
    //         // console.log("audios.length is " + audios.length);
    //         // let audiovizzler = document.getElementById('audiovizzler');
    //         // audiovizzler.components.audioanalyser.setAttribute("src", audios[0]);
            
    //         // primaryAudioHowl.ctx = true;
    //         // if (analyser == null) {
    //             console.log("tryna create analyser with " + primaryAudioHowl);
            
    //             let context = primaryAudioHowl.ctx;
    //             analyser = context.createAnalyser();

    //             primaryAudioHowl.masterGain.connect(analyser);
    //         analyser.connect(Howler.ctx.destination);
            
    //         analyser.fftSize = 1024;
    //         analyser.smoothingTimeConstant = 0.5;
    //         bufferLength = analyser.frequencyBinCount;
    //         dataArray = new Uint8Array(analyser.fftSize);
    //         // this.el.components.primary_audio_control.draw();
    //         // this.system.draw();
    //         // }
    //     },
    //     tick: function (time) {
    //     //   var analyserEl;
    //     //   var children;
    //     //   var data = this.data;
    //     //   var levels;
            
    //     //   analyserEl = data.analyserEl || this.el;
    //     if (analyser != null) {  
    //         analyser.getByteFrequencyData(dataArray);
    //         console.log(dataArray[0]);
    //     //   levels = analyser.levels;
    //     //   this.analyser.getByteFrequencyData(bufferLength);
    //     //               console.log("levels " + levels);
    //     //     if (!levels) { return; }

    //     //     children = this.el.children;
    //     //     for (var i = 0; i < children.length; i++) {
    //     //         children[i].setAttribute('scale', {
    //     //         x: 1,
    //     //         y: Math.min(data.max, Math.max(levels[i] * data.multiplier, 0.05)),
    //     //         z: 1
    //     //         });
    //     //     }
    //         }
    //     }
    // });

/**
 * Scale children based on audio frequency levels.
 */
//  AFRAME.registerComponent('audioanalyser-levels-scale', {
//     schema: {
//       analyserEl: {type: 'selector'},
//       max: {default: 20},
//       multiplier: {default: 100}
//     },
  
//     tick: function (time) {
//       var analyserEl;
//       var children;
//       var data = this.data;
//       var levels;
//         // console.log("tryna get analyzer...");
//       analyserEl = data.analyserEl || this.el;
//       levels = analyserEl.components.audioanalyser.levels;
//       if (!levels) { return; }
//         console.log(levels);
//       children = this.el.children;
//       for (var i = 0; i < children.length; i++) {
//         children[i].setAttribute('scale', {
//           x: 1,
//           y: Math.min(data.max, Math.max(levels[i] * data.multiplier, 0.05)),
//           z: 1
//         });
//       }
//     }
//   });

// function AudioAnalyzer() {

//     if (analyser == null) {
//         console.log("tryna create analyser from media");
    
//     if (vidz != null && vidz.length > 0) { //wire up the analyzer to the video if present
//         var context = new AudioContext();
//         var source = context.createMediaElementSource(vidz[0]);
//         analyser = context.createAnalyser();
        
//         source.connect(analyser);
//         console.log("gotsome vidz" );
//         analyser.connect(context.destination);
//     } else if (primaryAudioEl != null) { 
//         analyser = Howler.ctx.createAnalyser();
//         Howler.masterGain.connect(analyser);
//         analyser.connect(Howler.ctx.destination);
//     } 
//     analyser.fftSize = 512;
//     analyser.smoothingTimeConstant = 0.8;
//     bufferLength = analyser.frequencyBinCount;
//     fLevels = new Uint8Array(analyser.fftSize);
//     beatDetectionDecay = .99;
//     beatDetectionMinVolume = 14;
//     beatDetectionThrottle = 250;
//     } 
//     if (analyser != null) {
//         if (primaryAudioHowl.playing() || !vidz[0].paused) {
//             var sum = 0;
//             analyser.getByteFrequencyData(fLevels);
//             for (var i = 0; i < fLevels.length; i++) {
//                 sum += fLevels[i];;
//                 }
//                 volume = sum / fLevels.length;
//                 console.log(volume);
//                 if (!this.beatCutOff) {
//                     this.beatCutOff = volume;
//                 }
//                 if (volume > this.beatCutOff && volume > beatDetectionMinVolume) {
//                     this.beatCutOff = volume * 1.5;
//                     this.beatTime = 0;
//                     console.log("beat volume " + volume);
//                     if (primaryAudioEl != null) {
//                         primaryAudioEl.components.primary_audio_control.beat(volume);
//                     }
//                     if (mainVideoEl != null) {

//                     }
//                 } else {
//                     if (this.beatTime <= beatDetectionThrottle) {
//                     this.beatTime += window.performance.now();
//                     } else {
//                     this.beatCutOff *= beatDetectionDecay;
//                     this.beatCutOff = Math.max(this.beatCutOff, beatDetectionMinVolume);
//                     }
//                 }        
//         } else {
//             // beatDetectionDecay = 0.99;
//             // beatDetectionMinVolume = 15;
//             // beatDetectionThrottle = 250;
//         }
//     }
//     window.requestAnimationFrame(AudioAnalyzer);     
// };
let ambientparams = document.querySelector(".ambientAudioParams").id;
const clampNumber = (num, a, b) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
let ambientPosition = "";

AFRAME.registerComponent('ambient_audio_control', { //ambient file will loop and wander all over the scene...
    schema: {
        color: {default: 'red'},
        volume: {default: -40},
        url: {default: ''}
    },
    init: function () {
        this.tick = AFRAME.utils.throttleTick(this.tick, 100, this);
        this.cam = document.querySelector("[camera]"); 
        this.camPosition = "";
        this.distance = "";
        this.ambientChild = document.querySelector(".ambientChild");
        ambientPosition = this.el.object3D.position;
        ambientAudioHowl.pos(ambientPosition);
        var normalizedVolume = ((this.data.volume - -80) * 100) / (20 - -80) * .01;    
        ambientAudioHowl.fade(0, normalizedVolume, 5000);
        ambientAudioHowl.play();
        console.log(" ambient volume is " + normalizedVolume);

        // ambientAudioHowl.volume(normalizedVolume);
       

        if (this.ambientChild != null) {
            // this.ambientChild.clone;
            // this.ambientChild.position = ambientPosition;
            // this.el.object3D.add(this.ambientChild.object3D);
            var anim = this.ambientChild.getAttribute("animation"); //copy anims and set on parent below
            console.log("ambient child anims: " + JSON.stringify(anim));
            var parent = document.createElement("a-entity");
            parent.appendChild(this.ambientChild);
            let offset = this.ambientChild.getAttribute('position');
            this.el.appendChild(parent);
            parent.setAttribute("position", offset);
            this.ambientChild.setAttribute("position", offset);
            parent.setAttribute("animation", anim); //bc it doesn't work on the original child, for some reason
        }
        // this.el.setAttribute('material', 'color', 'purple');
        this.el.setAttribute('light', {
            type: 'point',
            distance: 20,
            intensity: 1.0,
            color: 'purple'
        }, true);
    },
    modVolume: function(newVolume) { //from slider in canvasOverlay
        // console.log("tryna mod ambient Volume to " + newVolume);
        // primaryAudioHowl.volume(normalizedVolume);
        normalizedVolume = ((newVolume - -80) * 100) / (20 - -80) * .01;
        console.log("normalizedVolume is " + normalizedVolume);
        ambientAudioHowl.volume(normalizedVolume);
    },
    tick: function(time, deltaTime) {
        if (ambientAudioHowl != null && this.cam != null) { //initialized as a global, included explicitly in page code
            // ambientPosition = this.el.object3D.position; //for spatialization, it's moving based on animation
            this.distance = this.el.object3D.position.distanceTo(this.cam.object3D.position);
            // console.log("ambientDistance: " + this.distance);
           const rate = clampNumber(1 - (this.distance/100), .25, 1.25);
           ambientAudioHowl.rate(rate + .1);
           
            ambientAudioHowl.pos(this.el.object3D.position.x, this.el.object3D.position.y, this.el.object3D.position.z);
            // console.log("rate: " + rate);
            // if (this.ambientChild != null) {
            
            //     this.ambientChild.position = this.el.object3D.position;
            //     // this.el.removeAttribute('geometry');
            // }
            
                    
        }
    }
    }); //end register
    
// }
AFRAME.registerComponent('ambient-child', { //objects with this component will follow the ambient object
    schema: {
    // color: {default: 'red'},
    // url: {default: ''},
    // title: {default: ''}
    },
    
    init: function () {
        this.cam = document.querySelector("[camera]"); //MUST DO THIS HERE or it doesn't work in tick below... okthen
        this.camPosition = "";
        this.distance = "";
        // this.ambientChild = document.querySelector(".ambientChild");
        // let ambientChildObject = null;

        ambientPosition = this.el.object3D.position;
        ambientAudioHowl.pos(ambientPosition);
            
        ambientAudioHowl.fade(0, 1, 5000);
        ambientAudioHowl.play();
        // if (this.ambientChild != null) {
        //     // this.ambientChild.position = ambientPosition;
        //     // this.el.add(this.ambientChild);
        //     console.log("gotsa ambientChild " + this.ambientChild);
            
        // }

        this.el.setAttribute('material', 'color', 'purple');
                        // primaryAudioMaterial.setAttribute('color', 'blue');
                        this.el.setAttribute('light', {
                            type: 'point',
                            distance: 20,
                            intensity: 1.0,
                            color: 'purple'
                        }, true);
        
    },
    stick: function(time, deltaTime) {
        if (ambientAudioHowl != null && this.cam != null) { //initialized as a global, included explicitly in page code
            // ambientPosition = this.el.object3D.position; //for spatialization, it's moving based on animation
            this.distance = this.el.object3D.position.distanceTo(this.cam.object3D.position);
            // console.log("ambientDistance: " + this.distance);
           const rate = clampNumber(1 - (this.distance/100), .25, 1.25);
           ambientAudioHowl.rate(rate + .1);
           
            ambientAudioHowl.pos(this.el.object3D.position.x, this.el.object3D.position.y, this.el.object3D.position.z);
            // console.log("rate: " + rate);
            // if (this.ambientChild != null) {
            
            //     this.ambientChild.position = this.el.object3D.position;
            //     // this.el.removeAttribute('geometry');
            // }
            
                    
        }
    }
    }); //end register

    let triggerParams = document.querySelector(".triggerAudioParams").id;
// const clampNumber = (num, a, b) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
let triggerPosition = "";

AFRAME.registerComponent('trigger_audio_control', { //trigger audio on designated activeObjex
    schema: {
    url: {default: ''},
    volume: {default: -40},
    init: {default: ''}
    // title: {default: ''}
    },
    
    init: function () {

        this.audioGroupsEl = document.getElementById('audioGroupsEl');
        this.audioGroupsController = null;
        // this.cam = document.querySelector("[camera]"); 
        // this.camPosition = "";
        // this.distance = "";
        // this.ambientChild = document.querySelector(".ambientChild");
        var normalizedVolume = ((this.data.volume - -80) * 100) / (20 - -80) * .01;    
        // triggerAudioHowl.volume(normalizedVolume);
        // triggerPosition = this.el.object3D.position;
        // triggerAudioHowl.pos(triggerPosition);
        // triggerAudioHowl.fade(0, 1, 5000);
        // triggerAudioHowl.play();
        // if (this.ambientChild != null) {
        // }
        // this.el.setAttribute('material', 'color', 'purple');
        //     // primaryAudioMaterial.setAttribute('color', 'blue');
        //     this.el.setAttribute('light', {
        //         type: 'point',
        //         distance: 20,
        //         intensity: 1.0,
        //         color: 'purple'
        //     }, true);
    },
    randomTriggerAudio: function () {
        if (this.audioGroupsEl != null) {
            let audioItem = this.audioGroupsEl.components.audio_group_control.returnAudioItem();
            triggerAudioHowl.src = audioItem.mp3url;
            triggerAudioHowl.play();
        }

    },
    modVolume: function(newVolume) { //from slider in canvasOverlay
        console.log("tryna mod trigger Volume to " + newVolume);
       
        normalizedVolume = ((newVolume - -80) * 100) / (20 - -80) * .01;
        // console.log("normalizedVolume is " + normalizedVolume);
        console.log("tryna mod trigger Volume to " + normalizedVolume);
        triggerAudioHowl.volume(normalizedVolume);
    },
    playAudio: function() {
        this.audioGroupsEl = document.getElementById('audioGroupsEl');
        if (this.audioGroupsEl != null) {
            this.audioGroupsController = this.audioGroupsEl.components.audio_groups_control;
            let audioItem = this.audioGroupsController.returnRandomTriggerAudioID();
            triggerAudioHowl.src = audioItem.mp3url;
            // triggerAudioHowl.play();
        }
        console.log("tryna play trigger audio");
        // triggerPosition = this.el.object3D.position;
        // triggerAudioHowl.pos(triggerPosition);
        // triggerAudioHowl.fade(0, 1, 5000);
        triggerAudioHowl.play();

    },
    playAudioAtPosition: function(pos, distance) {
        console.log("tryna play trigger raudio..");
        // this.modVolume(1);
        this.audioGroupsEl = document.getElementById('audioGroupsEl');
        if (this.audioGroupsEl != null) {
            this.audioGroupsController = this.audioGroupsEl.components.audio_groups_control;
            let audioID = this.audioGroupsController.returnRandomTriggerAudioID();
            let audioItem = this.audioGroupsController.returnAudioItem(audioID);
            if (audioItem != null) {
            console.log("tryna set trigger to src " + audioItem.URLogg);
            triggerAudioHowl = null;
            triggerAudioHowl = new Howl({
                src: [audioItem.URLogg, audioItem.URLmp3],
                format: ["ogg", "mp3"]
            });
            // triggerAudioHowl.format = ["ogg", "mp3"];
            // triggerAudioHowl.src = [audioItem.URLogg, audioItem.URLmp3];
            triggerAudioHowl.load();
            // triggerAudioHowl.play();
            }
        }

        triggerAudioHowl.pos(pos.x, pos.y, pos.z);
        const clamp = (num, a, b) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
        const rate = clamp(Math.random(), .75, 1.25);
        triggerAudioHowl.rate(rate + .1);
        // console.log("tryna play at hitpoint " + pos);
        triggerAudioHowl.play();
    }

    // tick: function(time, deltaTime) {
    //     if (ambientAudioHowl != null && this.cam != null) { //initialized as a global, included explicitly in page code
    //         // ambientPosition = this.el.object3D.position; //for spatialization, it's moving based on animation
    //         this.distance = this.el.object3D.position.distanceTo(this.cam.object3D.position);
    //         // console.log("ambientDistance: " + this.distance);
    //        const rate = clampNumber(1 - (this.distance/100), .25, 1.25);
    //        ambientAudioHowl.rate(rate + .1);
    //         ambientAudioHowl.pos(this.el.object3D.position.x, this.el.object3D.position.y, this.el.object3D.position.z);
        
    //     }
    // }
}); //end register
    
AFRAME.registerComponent('audio_groups_control', { //element and component are added if settings data (in connect.js) includes audio groups
    schema: {
    init: {default: ''},
    // volume: {default: -40},
    // title: {default: ''}
    audioGroupsData: {default: ''},
    // triggerGroups: {default: ''},
    // ambientGroups: {default: ''},
    // primaryGroups: {default: ''}
    },
    
    init: function () {
        this.data.audioGroupsData = null;
        console.log("settings.audiogroups: " + JSON.stringify(settings.audioGroups));
        this.data.triggerGroups = settings.audioGroups.triggerGroups;
        this.data.ambientGroups = settings.audioGroups.ambientGroups;
        this.data.triggerGroups = settings.audioGroups.primaryGroups;
        this.LoadAudioGroups(settings.audioGroups);

    },

    SetAudioGroupsData: function (data) {
        console.log(JSON.stringify(data));
        this.data.audioGroupsData = data;
        
    },

    LoadAudioGroups: function (groupArray) {

        // console.log("tryna fetch audioGroups: " +JSON.stringify(groupArray));
        // var posting = $.ajax({
        //     url: "/return_audiogroups",
        //     type: 'POST',
        //       contentType: "application/json; charset=utf-8",
        //     dataType: "json",
        //     data: JSON.stringify(groupArray),
        //         success: function( data, textStatus, xhr ){
        //             console.log("audiogroups data: " + JSON.stringify(data));
        //             this.audioGroupsData = data;
                    

        //         },
        //         error: function( xhr, textStatus, errorThrown ){
        //             console.log("error! " + errorThrown);
        //             // document.cookie = "expires=Thu, 01 Jan 1970 00:00:00"; //set to expired date to delete?
        //             }
        //         });
        FetchAudioGroupsData(groupArray);

    },

    ambientGroups: function () {

    },
    primaryGroups: function () {

    },
    returnAudioItem: function (id) {
        let index = -1;
        for (var i = 0; i < this.data.audioGroupsData.audioItems.length; i++){
            if (id == this.data.audioGroupsData.audioItems[i]._id) {
                index = i;
                break;
            }
        }
        return this.data.audioGroupsData.audioItems[index];
    },
    returnRandomTriggerAudioID: function () {
        // console.log(JSON.stringify(this.data.audioGroupsData));
        let triggerGroup = this.data.audioGroupsData.triggerGroupItems[0];
        return triggerGroup.items[Math.floor(Math.random()*triggerGroup.items.length)]; //pick a random entry from trigger ids
    },
    returnTriggerTag: function() {

    }
});

function FetchAudioGroupsData(groupArray) {
    console.log("tryna fetch audioGroups: " +JSON.stringify(groupArray));
    var posting = $.ajax({
        url: "/return_audiogroups",
        type: 'POST',
          contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(groupArray),
            success: function( data, textStatus, xhr ){
                console.log("audiogroups data: " + JSON.stringify(data));
                // return  JSON.stringify(data);
                let audioGroupsControllerEl = document.getElementById('audioGroupsEl');
                let audioGroupsController = audioGroupsControllerEl.components.audio_groups_control;
                audioGroupsController.SetAudioGroupsData(data);

            },
            error: function( xhr, textStatus, errorThrown ){
                console.log("error! " + errorThrown);
                // return null;
                // document.cookie = "expires=Thu, 01 Jan 1970 00:00:00"; //set to expired date to delete?
                }
            });

}