// deprecated, now in audio_controls.js

/*
let triggerParams = document.querySelector(".triggerAudioParams").id;
// const clampNumber = (num, a, b) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
let triggerPosition = "";

AFRAME.registerComponent('trigger_audio_control', { //trigger audio on designated activeObjex
    schema: {
    url: {default: ''},
    volume: {default: -40},
    // title: {default: ''}
    },
    
    init: function () {
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
    modVolume: function(newVolume) { //from slider in canvasOverlay
        console.log("tryna mod trigger Volume to " + newVolume);
       
        normalizedVolume = ((newVolume - -80) * 100) / (20 - -80) * .01;
        // console.log("normalizedVolume is " + normalizedVolume);
        console.log("tryna mod trigger Volume to " + normalizedVolume);
        triggerAudioHowl.volume(normalizedVolume);
    },
    playAudio: function() {
        console.log("tryna play trigger audio");
        // triggerPosition = this.el.object3D.position;
        // triggerAudioHowl.pos(triggerPosition);
        // triggerAudioHowl.fade(0, 1, 5000);
        triggerAudioHowl.play();
    },
    playAudioAtPosition: function(pos, distance) {
        triggerAudioHowl.pos(pos.x, pos.y, pos.z);
        const clamp = (num, a, b) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
        const rate = clamp(Math.random(), .25, 1.25);
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
    
*/