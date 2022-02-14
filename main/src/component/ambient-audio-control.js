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