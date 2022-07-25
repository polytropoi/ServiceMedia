const synth = new Tone.Synth({
    volume: 15, // -15dB
    oscillator: {
      type: 'triangle' // triangle wave 
    },
    envelope: {
      attack: 0.03, // 30ms attack
      release: 1 // 1s release
    }
}).toMaster();
// let triggerVolume = new Volume(-12).toDestination();



const vol = new Tone.Volume().toDestination();
const feedbackDelay = new Tone.FeedbackDelay("4n", .85).toDestination();
const reverb = new Tone.Reverb().toDestination();
var phaser = new Tone.Phaser({
	"frequency" : 15,
	"octaves" : 5,
	"baseFrequency" : 1000
}).toDestination();

const psynth = new Tone.PolySynth().connect(reverb).connect(vol);
// set the attributes across all the voices using 'set'
psynth.set({ detune: -1200 });
// play a chord
// psynth.triggerAttackRelease(["C4", "E4", "A4"], 1);

const amSynth = new Tone.AMSynth({
    "volume": 20,
	"detune": 0,
	"portamento": 0,
	"harmonicity": 2.5,
	"oscillator": {
		"partialCount": 0,
		"partials": [],
		"phase": 0,
		"type": "fatsawtooth",
		"count": 3,
		"spread": 20
	},
	"envelope": {
		"attack": 0.1,
		"attackCurve": "linear",
		"decay": 0.2,
		"decayCurve": "exponential",
		"release": 0.3,
		"releaseCurve": "exponential",
		"sustain": 0.2
	},
	"modulation": {
		"partialCount": 0,
		"partials": [],
		"phase": 0,
		"type": "square"
	},
	"modulationEnvelope": {
		"attack": 0.5,
		"attackCurve": "linear",
		"decay": 0.01,
		"decayCurve": "exponential",
		"release": 0.5,
		"releaseCurve": "exponential",
		"sustain": 1
	}
}).connect(vol);
// synth.triggerAttackRelease("C4", "4n");

const bell = new Tone.MetalSynth({
  harmonicity: 12,
  resonance: 800,
  modulationIndex: 20,
  envelope: {
    decay: 0.4,
  },
  volume: -15
}).connect(vol);

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

AFRAME.registerComponent('mod_synth', { 
    // dependencies: ['raycaster'],  // for oculus go laser controls
     schema: {
         // Describe the property of the component.
         note: {
             // NOTE: type: 'string' is referring to our Aframe component's property type, not a synth preset
             type: 'string', 
             default: 'C5' // C4 default note
           },
         duration: {
             type: 'string',
             default: '1n' // quarter note default time
           }
     },
   
     init: function () {
         this.distance = 0;
       // Do something when component first attached.
       console.log("tryna INIT SYNTH!");
    //    this.el.addEventListener('raycaster-intersection', this.trigger.bind(this)); // for oculus go laser controls
    //    this.el.addEventListener('fusing', this.trigger.bind(this))
     },
   
     amHitDistance: function (distance) {
        this.distance = distance;
        vol.volume.value = distance * -2;
        //  console.log("tryna trigger am synth note distance " + distance );

         amSynth.triggerAttackRelease(getRandomInt(48,72), 1)
    //    psynth.triggerAttackRelease([getRandomInt(36,64),getRandomInt(64,88),getRandomInt(88,256)], 1)
    //    amSynth.triggerAttackRelease("C2", 1)
     },
     medTrigger: function () {
        amSynth.triggerAttackRelease("C3", .5);
     },
     highTrigger: function () {
        amSynth.triggerAttackRelease("C4", .5);
     },
     triggerDistanceRolloff: function () {
        // console.log("tryna trigger synth note");
    //   psynth.triggerAttackRelease(["C4", "E4", "A4"], 1)
    // var pattern = new Tone.Pattern(function(time, note){
    //     //the order of the notes passed in depends on the pattern
    //   }, ["C2", "D4", "E5", "A6"], "upDown");
      amSynth.triggerAttackRelease("C4", 1);
    },

    metalHitDistance: function (distance) {
      // this.distance = distance;
      vol.volume.value = distance * -2;
       console.log("tryna trigger synth note distance " + distance );

      //  bell.triggerAttackRelease(getRandomInt(0,88), 1);
      //  bell.triggerAttackRelease("G4", 1);
       amSynth.triggerAttackRelease(getRandomInt(64,88), 1);
    },
     
   
     remove: function () {
       // Do something the component or its entity is detached.
     }
   
    //  tick: function (time, timeDelta) {
    //    // Do something on every scene tick or frame.
    //  }
 });

 AFRAME.registerComponent('generate_synth_triggers', {
    schema: {
      width: {
        type: 'string', 
        default: '4' // C4 default note
      },
      height: {
        type: 'string',
        default: '4' // quarter note default time
      },
      depth: {
        type: 'string',
        default: '4' // quarter note default time
      },
      shape: {
        type: 'string',
        default: 'cube' // quarter note default time
      }
    },
    init: function () {
      
    }
  });
 
  