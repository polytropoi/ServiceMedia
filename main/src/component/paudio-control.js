
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
    AFRAME.registerComponent('pprimary-audio-control', {
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
                // primaryAudioHowl.pos(0, 1.25, -5);
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