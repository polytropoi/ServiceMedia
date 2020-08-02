
// let oggurl = document.querySelector(".oggurl").id;
// let streamURL = document.querySelector(".streamURL").id;
//let cam = document.querySelector("#head"); //IF DONE HERE IT DOES NOT WORK BELOW, bc it's not inside aframe component, doesn't have access to globals

let params = document.querySelector(".primaryAudioParams").id;

let stream = params.split("_")[0];
let audiourl = params.split("_")[1];
var hostname = (new URL(audiourl)).hostname;
let title = "";
let listeners = 0;
let bitrate = 0;

console.log(audiourl);

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

// console.log("params" +params+ "url " + audiourl + " stream " + stream);
// if (audiourl != null) {
    if (stream != "false") { //streaming mode
        // let primaryAudioHowl = new Howl({ //use howler audio mangler
        //     src: audiourl, 
        //     html5: true, //no webaudio api when streaming  
        //     volume: 1.0,
            
        // });
        AFRAME.registerComponent('primary-audio-control', { //register for streaming
            schema: {
                color: {default: 'red'},
                oggurl: {default: ''},
                mp3url: {default: ''},
                title: {default: ''},
        targetattach: {default: false},
        autoplay: {default: false}
            },
            
            init: function () {
                var data = this.data;
                var el = this.el;  
                var defaultColor = el.getAttribute('material').color;
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
                var audioEl = document.querySelector('.audio');
                if (audioEl != null) {
                    let audioElPosition = audioEl.getAttribute('position');
                    console.log("position of audioElement: " + JSON.stringify(audioElPosition));
                    if (audioElPosition == null || audioElPosition == undefined) {
                        audioElPosition = "0 -1 -2";
                    }
                    primaryAudioParent.setAttribute('position', audioElPosition); //snap to audio posiition if there is one...

                }
                
                primaryAudioHowl.load();
                primaryAudioParent.setAttribute("visible",true);
                document.querySelector("#primaryAudioText").setAttribute('visible', true);
                document.querySelector("#primaryAudioText").setAttribute("look-at", "#player");
                document.querySelector("#primaryAudioText").setAttribute('text', {
                    // width: 4, 
                    align: "left",
                    value: data.title
                });

                if (data.autoplay) {
                    primaryAudioHowl.play();
                }
                document.querySelector("#primaryAudioText").setAttribute('visible', true);
                document.querySelector("#primaryAudioText").setAttribute("look-at", "#player");
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
                    document.querySelector("#primaryAudioText").setAttribute("look-at", "#player");
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
                    // console.log('mousenter primary-audio-control');
                });
                el.setAttribute('light', {
                    type: 'point',
                    distance: 30,
                    intensity: 1.0,
                    color: 'yellow'
                }, true);
            
                el.addEventListener('mousedown', function () {

                    if (!primaryAudioHowl.playing()) {
                        el.setAttribute('light', {
                            type: 'point',
                            distance: 30,
                            intensity: 1.0,
                            color: 'green'
                        }, true);
                        // duration = primaryAudioHowl.duration().toFixed(2);
                        primaryAudioHowl.play();
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
                            // }
                        // }
                    }
                });        
                el.addEventListener('mouseleave', function () {
                    el.setAttribute('color', defaultColor);
                });
            },
            tick: function(time, deltaTime) {
                // this.cam = document.querySelector("#head");
                                                                        //this.pPos = this.cam.object3D.position; //for spatialization
                // console.log("pPos " + JSON.stringify(this.pPos));
                // Howler.pos(this.pPos.x, this.pPos.y, this.pPos.z); //this doesn't work, bc html5 mode... do it manually..
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
        AFRAME.registerComponent('primary-audio-control', { //register for not-streaming
        schema: {
        color: {default: 'red'},
        url: {default: ''},
        title: {default: ''},
        targetattach: {default: false},
        autoplay: {default: false}
        },

        init: function () {
            var data = this.data;
            var el = this.el;  
            var defaultColor = el.getAttribute('material').color;
            this.primaryAudioText = document.querySelector("#primaryAudioText");
            this.primaryAudioParent = document.querySelector("#primaryAudioParent");
            this.isPlaying = false;
            this.duration = primaryAudioHowl.duration().toFixed(2);
            this.cam = document.querySelector("[camera]"); //MUST DO THIS HERE or it doesn't work in tick below... okthen
            // this.position = this.el.object3D.position;
            // primaryAudioHowl = new Howl({  
            //     src: data.url,
            //     loop: true, 
            //     volume: 1.0  
            // });
            // this.initHowl(data.url);
            let primaryAudioText = this.primaryAudioText;
            let primaryAudioParent = this.primaryAudioParent;
            // primaryAudioHowl = primaryAudioHowl;
            // console.log(primaryAudioHowl);
            var audioEl = document.querySelector('.audio');
            if (audioEl != null) {
                let audioElPosition = audioEl.getAttribute('position');
                console.log("position of audioElement: " + JSON.stringify(audioElPosition));
                primaryAudioParent.setAttribute('position', audioElPosition); //snap to audio posiition if there is one...
            }

            // let primaryAudioText = document.querySelector("#primaryAudioText");
            // let posMod = audioElPosition;
            // posMod.y = posMod + 3;
            primaryAudioText.setAttribute('visible', true);
            primaryAudioText.setAttribute("look-at", "#player");
            primaryAudioHowl.fade(0, 1, 1000);
            primaryAudioHowl.pos(this.el.object3D.position.x, this.el.object3D.position.y, this.el.object3D.position.z);

            if (data.targetattach) {
                el.addEventListener('targetattach', function (event) {
                    console.log("hey gotsa attach to target message" + event.detail.targetEntity);
                    let audioElPosition = event.detail.targetEntity.getAttribute('position');
                    console.log("position of audioElement: " + JSON.stringify(audioElPosition));
                    primaryAudioHowl.pos(audioElPosition.x, audioElPosition.y, audioElPosition.z);
                    primaryAudioParent.setAttribute('position', audioElPosition);
                });
            }
            // primaryAudioHowl.pos(audioElPosition.x, audioElPosition.y, audioElPosition.z);
            if (data.autoplay) {    
                primaryAudioHowl.play();
            }
            el.addEventListener('mouseenter', function () {
                console.log("mousenter primaryAudio");
                let primaryAudioText = document.querySelector("#primaryAudioText");
                // let posMod = audioElPosition;
                // posMod.y = posMod + 3;
                // primaryAudioText.setAttribute('visible', true);
                // // primaryAudioText.setAttribute('position', posMod);
                // primaryAudioText.setAttribute("look-at", "[camera]");
                primaryAudioText.setAttribute('text', {
                    baseline: "bottom",
                    align: "left",
                    value: "\nTitle: "+data.title
                });
                // console.log('mousenter primary-audio-control');
                this.duration = primaryAudioHowl.duration().toFixed(2);
                // console.log(this.duration);
                // if (primaryAudioHowl.state() == "unloaded") {
                //     primaryAudioHowl.unload();
                //     primaryAudioHowl.load();
                // }
            });
            el.setAttribute('light', {
                type: 'point',
                distance: 30,
                intensity: 1.0,
                color: 'yellow'
            }, true);
        
            el.addEventListener('mousedown', function () {
                // console.log(primaryAudioHowl.state());
                // // primaryAudioHowl.once('load', function(){
                // //     console.log("loaded?!");
                //     primaryAudioHowl.play();
                //   });
                if (primaryAudioHowl != null && !primaryAudioHowl.playing() && primaryAudioHowl.state() == "loaded") {
                    this.duration = primaryAudioHowl.duration().toFixed(2);
                    primaryAudioText.setAttribute('visible', true);
                    primaryAudioHowl.play();
                    // console.log('...tryna play...' + audioElPosition.x + " " + audioElPosition.y + " " + audioElPosition.z);
                    // primaryAudioHowl.pos(audioElPosition.x, audioElPosition.y, audioElPosition.z);
                    primaryAudioHowl.pos(el.object3D.position.x, el.object3D.position.y, el.object3D.position.z);
                    // primaryAudioHowl.pos(this.el.object3D.position.x, this.el.object3D.position.y, this.el.object3D.position.z);
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
                        // primaryAudioText.setAttribute('visible', false);
                        // }
                    // }
                }
            });        
            el.addEventListener('mouseleave', function () {
                el.setAttribute('color', defaultColor);
            });
        },

        tick: function(time, deltaTime) {
            
            if (primaryAudioHowl != null) {
                var data = this.data;
                var seek = primaryAudioHowl.seek() || 0;
                seek = Number(seek).toFixed(2);
                let duration = primaryAudioHowl.duration().toFixed(2);
                let percentComplete = Math.floor((seek / duration) * 100);
                var el = this.el; 
                if (!isNaN(seek) && seek != 0) {
                    if (primaryAudioHowl.playing()) {
                        // if (startTime == 0) {
                        //     startTime = time;
                        //     // delayedGreeting();
                        // }
                        
                        //pRot = this.cam.object3D.rotation; //not needed? maybe?
                        
                        // pPos = this.cam.object3D.position; //for spatialization //na, done it content-utils.js now
                        // Howler.pos(pPos.x, pPos.y, pPos.z); //listen from camera position //ditto
                       
                        //Howler.rot(pRot.x, pRot.y, pRot.z); //lockup, no workie
                        // console.log(JSON.stringify(pPos));
                        primaryAudioHowl.pos(el.object3D.position.x, el.object3D.position.y, el.object3D.position.z);
                        document.querySelector("#primaryAudioText").setAttribute('text', {
                            baseline: "bottom",
                        align: "left",
                        value: "\nTitle: "+data.title + "\n " + seek + " secs of " + duration + " = " + percentComplete + "%\n\n\n"
                        });
                        this.el.setAttribute('material', 'color', 'green');
                        this.el.setAttribute('light', {
                            type: 'point',
                            distance: 30,
                            intensity: 1.0,
                            color: 'green'
                        }, true);
                    } else {
                        document.querySelector("#primaryAudioText").setAttribute('text', {
                            // width: 4, 
                            baseline: "bottom",
                            align: "left",
                            value: "\nTitle: "+data.title + "\n " + seek + " secs of " + duration + " = " + percentComplete + "% - Paused \n\n\n"
                        });
                        this.el.setAttribute('material', 'color', 'red');
                        this.el.setAttribute('light', {
                            type: 'point',
                            distance: 30,
                            intensity: 1.0,
                            color: 'red'
                        }, true);
                    }
                } else {
                    document.querySelector("#primaryAudioText").setAttribute('text', {
                        // width: 4, 
                        baseline: "bottom",
                        align: "left",
                        value: "\nTitle: "+data.title + "\n " + primaryAudioHowl.state()  + "\n\n\n"
                    });
                    if (primaryAudioHowl.state() == "loading") {
                        // primaryAudioMaterial.color = 'lightblue';
                        this.el.setAttribute('material', 'color', 'yellow');
                        this.el.setAttribute('light', {
                            type: 'point',
                            distance: 30,
                            intensity: 1.0,
                            color: 'yellow'
                        }, true);

                    } else {
                        this.el.setAttribute('material', 'color', 'blue');
                        // primaryAudioMaterial.setAttribute('color', 'blue');
                        this.el.setAttribute('light', {
                            type: 'point',
                            distance: 30,
                            intensity: 1.0,
                            color: 'blue'
                        }, true);
                    }                        
                    }
                }
        }
        }); //end register
    }
// }