let ambientparams = document.querySelector(".ambientAudioParams").id;
const clampNumber = (num, a, b) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
let ambientPosition = "";

AFRAME.registerComponent('ambient-audio-control', { //ambient file will loop and wander all over the scene...
    schema: {
    color: {default: 'red'},
    url: {default: ''}
    // title: {default: ''}
    },
    
    init: function () {
        this.cam = document.querySelector("[camera]"); 
        this.camPosition = "";
        this.distance = "";
        this.ambientChild = document.querySelector(".ambientChild");
        ambientPosition = this.el.object3D.position;
        ambientAudioHowl.pos(ambientPosition);
            
        ambientAudioHowl.fade(0, 1, 5000);
        ambientAudioHowl.play();
        if (this.ambientChild != null) {
            // this.ambientChild.clone
            // // this.ambientChild.position = ambientPosition;
            // this.el.object3D.add(this.ambientChild.object3D);
            // console.log("gotsa ambientChild " + this.ambientChild);
            // this.ambientChild.flushToDom();
            // this.el.appendChild(this.ambientChild);
        }

        this.el.setAttribute('material', 'color', 'purple');
                        // primaryAudioMaterial.setAttribute('color', 'blue');
                        this.el.setAttribute('light', {
                            type: 'point',
                            distance: 20,
                            intensity: 1.0,
                            color: 'purple'
                        }, true);
        
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