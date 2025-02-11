/* global Tone, AFRAME, Tonal */

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

AFRAME.registerComponent("mod_synth", {
  schema: {
    note: {
      // NOTE: type: 'string' is referring to our Aframe component's property type, not a synth preset
      type: "string",
      default: "C5", // C4 default note
    },
    duration: {
      type: "string",
      default: "1n", // quarter note default time
    },
    keyTonic: {default: ""},
    keyType: {default: ""},
    chord: {default: ""}
  },

  init: function () {
    this.distance = 1;

    console.log("tryna INIT SYNTH!");
    this.mainText = document.getElementById("mainText");
    this.bpmText = document.getElementById("bpmText");
    this.pattern = null;
    
    this.playKick = false;
    this.playHat = false;
    this.interval = "4";
    this.noteType = "n"
    this.keyLabels = [];
    // Create instances::
    this.transportPathComponent = null;
    
    let transportPathEl = document.getElementById("transportFatline");
    if (transportPathEl) {
      this.transportPathComponent = transportPathEl.components.transport_fatline;
    }

    // Start
    // this.loopBeat = new Tone.Loop(this.song, "16n");
    Tone.Transport.bpm.value = 100;
    // Tone.Transport.loop = true;
    // Tone.Transport.setLoopPoints("0m", "4m");
    
    this.transportPlay = false;
    // Tone.Transport.start();
    // this.loopBeat.start(0);

    //kick:::
    this.kick = new Tone.MembraneSynth({
      volume: 0,
      pitchDecay: 0.07,
      octaves: 5,
      oscillator: {
        type: "sine"
      },
      envelope: {
        attack: 0.001,
        decay: 0.2,
        sustain: 0.002,
        release: 1,
        attackCurve: "exponential"
      }
    }).toDestination();

    // Bass:::::
    this.bass = new Tone.MembraneSynth({
      pitchDecay: 0.03,
      octaves: 2,
      oscillator: {
        type: "sine"
      },
      envelope: {
        attack: 0.02,
        decay: 0.5,
        sustain: 0.001,
        release: 0.1,
        attackCurve: "exponential"
      }
    }).toDestination();

    // Lead and autopanner::::
    this.leadAutoPanner = new Tone.AutoPanner({
      frequency: 0.3,
      type: "sine",
      depth: 1
    })
      .toDestination()
      .start();

    this.lead = new Tone.PluckSynth({
      attackNoise: 1,
      dampening: 7000,
      resonance: 0.7
    }).connect(this.leadAutoPanner);

    /// Polysynth:::

    this.polySynthFilter = new Tone.AutoFilter({
      frequency: 0.8,
      type: "sine",
      depth: 1,
      baseFrequency: 300,
      octaves: 2.6,
      filter: {
        type: "lowpass",
        rolloff: -24,
        Q: 3
      }
    })
      .toDestination()
      .start();

    this.polySynthPanner = new Tone.PanVol({
      pan: 0.4
    }).toDestination();

    this.polySynthDelay = new Tone.PingPongDelay({
      delayTime: "12n",
      maxDelay: 2,
      wet: 0.4,
      feedback: 0.3
    }).toDestination();

    this.polySynth = new Tone.PolySynth(Tone.Synth, {
      volume: -12,
      oscillator: {
        type: "sawtooth"
      }
    }).chain(this.polySynthFilter, this.polySynthDelay, this.polySynthPanner, Tone.Master);

    // Hihat::::
    this.hihatPan = new Tone.PanVol({
      pan: 0.35
    }).toDestination();

    this.hihat = new Tone.MetalSynth({
      volume: -15,
      frequency: 200,
      envelope: {
        attack: 0.008,
        decay: 0.052,
        release: 0.002
      },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 3000,
      octaves: 1.5
    }).connect(this.hihatPan);

    //Hihat2:::
    this.hihat2Pan = new Tone.PanVol({
      pan: -0.3
    }).toDestination();

    this.hihat2 = new Tone.MetalSynth({
      frequency: 400,
      envelope: {
        attack: 0.01,
        decay: 0.01,
        release: 0.005
      },
      harmonicity: 1.1,
      modulationIndex: 24,
      resonance: 4000,
      octaves: 2.5
    }).connect(this.hihat2Pan);

    //Snare :::
    this.snarePan = new Tone.PanVol({
      pan: -0.3
    }).toDestination();
    this.snare = new Tone.NoiseSynth({
      noise: {
        type: "brown"
      },
      envelope: {
        attack: 0,
        decay: 0.05,
        sustain: 0.008
      }
    }).connect(this.snarePan);
    ////////////////////

    this.vol = new Tone.Volume().toDestination();
    this.amVol = new Tone.Volume().toDestination();
    this.tVol = new Tone.Volume().toDestination();
    this.pVol = new Tone.Volume().toDestination();
    this.delay = new Tone.FeedbackDelay("4n", 0.5).toDestination();
    this.reverb = new Tone.Reverb().toDestination();
    this.phaser = new Tone.Phaser({
      frequency: 15,
      octaves: 5,
      baseFrequency: 1000,
    }).toDestination();

    this.lastNotes = [];
    this.tSynth = new Tone.Synth({
      volume: -12, // -15dB
      oscillator: {
        type: "triangle", // triangle wave
      },
      envelope: {
        attack: 0.03, // 30ms attack
        release: 1, // 1s release
      },
    }).connect(this.tVol).toDestination();

    this.amSynth = new Tone.AMSynth({
      // const amSynth = new Tone.PolySynth(Tone.MonoSynth)
      volume: -10,
      detune: 0,
      portamento: 1,
      harmonicity: 2.5,
      oscillator: {
        partialCount: 0,
        partials: [],
        phase: 0,
        type: "fatsawtooth",
        count: 3,
        spread: 20,
      },
      envelope: {
        attack: 0.1,
        attackCurve: "linear",
        decay: 0.2,
        decayCurve: "exponential",
        release: 0.3,
        releaseCurve: "exponential",
        sustain: 0.2,
      },
      modulation: {
        partialCount: 0,
        partials: [],
        phase: 0,
        type: "square",
      },
      modulationEnvelope: {
        attack: 0.5,
        attackCurve: "linear",
        decay: 0.01,
        decayCurve: "exponential",
        release: 0.5,
        releaseCurve: "exponential",
        sustain: 1,
      },
    })
      // .connect(this.phaser)
      .connect(this.amVol);
    // synth.triggerAttackRelease("C4", "4n");

    this.bell = new Tone.MetalSynth({
      volume: -15,
      harmonicity: 2,
      resonance: 2000,
      modulationIndex: 40,
      envelope: {
        decay: 1.8,
      },
      volume: -15,
    })
      // .connect(this.delay)
      .connect(this.vol);

    this.pSynth = new Tone.PolySynth(Tone.MonoSynth)
      .connect(this.pVol)
      // .connect(this.reverb)
      .toDestination();

    this.pSynth.set({
      volume: -20,
      detune: 0,
      portamento: 0,
      envelope: {
        attack: 0.05,
        attackCurve: "linear",
        decay: 0.3,
        decayCurve: "exponential",
        release: 0.8,
        releaseCurve: "exponential",
        sustain: 0.4,
      },
      filter: {
        Q: 1,
        detune: 0,
        frequency: 100,
        gain: 0,
        rolloff: -12,
        type: "lowpass",
      },
      filterEnvelope: {
        attack: 0.001,
        attackCurve: "linear",
        decay: 0.7,
        decayCurve: "exponential",
        release: 0.8,
        releaseCurve: "exponential",
        sustain: 0.1,
        baseFrequency: 600,
        exponent: 2,
        octaves: 4,
      },
      oscillator: {
        detune: 0,
        frequency: 440,
        partialCount: 8,
        partials: [
          1.2732395447351628, 0, 0.4244131815783876, 0, 0.25464790894703254, 0,
          0.18189136353359467, 0,
        ],
        phase: 0,
        type: "square8",
      },
    });

    // this.amSynth = amSynth;
    // this.bell = bell;
    // this.tSynth = tSynth;
    // this.pSynth = pSynth;
    // this.vol = vol;
    // this.amVol = amVol;
    // this.bellNoteOnOff(1);
      // this.tSynthNoteOnOff(1);
    // this.pChordOnOff(10, "A", "minor", 2);
    // this.pChordHit(1);
    // this.playSong();  
    // Tone.Transport.start();
  
  
    
  }, //end init

  //////////////////////////////////////////
  toggleTransport() {
    this.transportPlay = !this.transportPlay;
    console.log("tryna toggleTransport " + this.transportPlay);
    if (this.transportPlay) {
      if (this.data.keyTonic == "") {
        this.returnRandomKey();
      }
      this.bpmText.setAttribute("text", { value: Math.floor(Tone.Transport.bpm.value)});
      // this.playScheduleRepeat();
      Tone.Transport.start();
        this.playSong();
        // this.pChordArp(1,3,this.data.keyTonic,this.data.keyType);
        if (this.transportPathComponent) {
          // this.transportPathComponent.setTimeParameters(this.interval+this.noteType,Tone.Time(this.interval+this.noteType).toSeconds() * 1000);
                this.transportPathComponent.setTimeParameters(this.interval+this.noteType,Tone.Time("1m").toSeconds() * 1000);
        }
    } else {
      Tone.Transport.stop();
       if (this.transportPathComponent) {
          this.transportPathComponent.transportIsPlaying = false;
        }
    }
  },
  volMod (value) {
    console.log("volMod value " + value);
  },
  bpmUp () {
    Tone.Transport.bpm.value = Tone.Transport.bpm.value + 1;
    this.bpmText.setAttribute("text", { value: Math.floor(Tone.Transport.bpm.value)});
  },
  bpmDown () {
    Tone.Transport.bpm.value = Tone.Transport.bpm.value - 1;
    this.bpmText.setAttribute("text", { value: Math.floor(Tone.Transport.bpm.value)});
  },
  toggleKick() {

    this.playKick = !this.playKick;
        console.log("tryna toggleKick " + this.playKick);

  },
  toggleHat() {
    this.playHat = !this.playHat;

  },
  playScheduleRepeat: function () {
        Tone.Transport.scheduleRepeat(time => {
        // if (Math.random() > .5){
           console.log(Tone.Transport.position);
        let pSplit = Tone.Transport.position.split(":");

        let measure = pSplit[0];

        let count =  pSplit[1];
        let beat =  pSplit[2];
        if (count % 2 == 0 && Math.floor(beat) == 0) { 
          if (this.playKick) {
            this.kickOnOff();
            console.log("kick!");
          }
          // this.kickOnOff();
          // this.bell.triggerAttackRelease("a2", "1n");
        } 
        this.hihat.triggerAttackRelease("a2", time);
        // }
      }, '8n');
  },
  playSong: function () {
    // let currentBeat = Tone.Transport.position.split(":");
    // let keyData = this.returnKey();
    
              let lastMeasure = -1;
       // this.pChordArp();
      let loop = new Tone.Loop((time) => {
     
          // triggered every eighth note.
          // console.log(Tone.Transport.position);
        let pSplit = Tone.Transport.position.split(":");
        let measure = pSplit[0];

        let count =  pSplit[1];
        let beat =  pSplit[2];
        if (count % 2 == 0 && Math.floor(beat) == 0) { 
          if (this.playKick) {
            this.kickOnOff();
            console.log("kick!");
          }
          // this.kickOnOff();
          // this.bell.triggerAttackRelease("a2", "1n");
        } 
        if (Math.floor(beat) == 0) {
          if (this.playHat) {
            this.hatOnOff();
          }
         
        }
        if (measure > lastMeasure) {
          // this.pChordArp()
          if (this.playKick) {
            // this.kickOnOff();

          }
          console.log("measure " + measure + " vs " + lastMeasure);
          this.pChordArp(1,3,this.data.keyTonic,this.data.keyType);
          lastMeasure = measure;
        }

         
      }, this.interval+this.noteType).start(0);
      
      // Tone.Transport.scheduleRepeat(time => {
      //   // if (Math.random() > .5){
      //   this.hihat.triggerAttackRelease("a2", "8n");
      //   // }
      // }, '8n');
    
//     Tone.Transport.scheduleRepeat(time => {
//       // this.snare.triggerAttackRelease("a2", "4n");
//     }, '4n');
    
    Tone.Transport.start();

  },
  kickOnOff: function () {
      if (Math.random() > .3){
        this.kick.triggerAttackRelease("c1", "2n");
      } else {
        this.kick.triggerAttackRelease("e1", "2n");
      }
  },
  hatOnOff: function () {
    this.vol.volume.value = -20 + (10 * Math.random());
      if (Math.random() > .3){
        this.bell.triggerAttackRelease("c3", "2n");
      } else {
        this.bell.triggerAttackRelease("e3", "2n");
      }
  },
  bellNoteOnOff: function (distance) {
    // let bell = this.bell;
    // let vol = this.vol;

    // this.bell.volume.value = (distance);
    this.vol.volume.value = 0 - (parseFloat(distance) * 10);
    console.log("tryna ring bell at volume " + this.vol.volume.value);
    this.bell.triggerAttackRelease(getRandomInt(12, 48), 1);
  },
    tSynthNoteOnOff: function (distance) {
    // let inst = this.tSynth;
    // let vol = this.tVol;

    // this.bell.volume.value = (distance);
    // this.tVol.volume.value = -20 + (60 - (parseFloat(distance * 60)));
      
    this.tVol.volume.value = (distance * 20);
    
    console.log("tryna play synth at distance" + distance + " volume " + this.tVol.volume.value);
    this.tSynth.chain(this.tVol);
      this.tSynth.triggerAttackRelease(getRandomInt(12, 48), 1);
  },

  amNoteOn: function (position, rotation, distance) {
    // let vol = this.amVol;
    // let amSynth = this.amSynth;
    // vol.volume.value = distance * -4;
    let note = Math.floor(position.y * 140);

    // vol.volume.value = (-15 + parseFloat(distance * 10));
    if (rotation) {
      // this.amVol.volume.value = -15 + (20 - parseFloat(rotation.y * 20));
      this.amVol.volume.value = -10 + (Math.abs(rotation.y) * 20);
    }
    if (distance) {
      this.amSynth.detune.value = distance * 1000;
    }

    // console.log("tryna play note " + note + " vol " + this.amVol.volume.value);
    this.amSynth.triggerAttack(note);
    // this.amSynth.harmonicity = 1 + (distance * 3);
    // this.amSynth.frequency = distance * 1500;
    // this.phaser.wet = 1 - distance;
    //         this.delay.wet = position.x;
    // this.amSynth.detune = distance * 1000;
  },
  amNoteOff: function () {
    this.amSynth.triggerRelease();
  },
  //       amExpression: function (position) {

  //       }

  amHitDistance: function (distance) {
    this.distance = distance;
    this.vol.volume.value = 15 - distance;

    this.amSynth.triggerAttackRelease(getRandomInt(48, 72), 1);
    //    psynth.triggerAttackRelease([getRandomInt(36,64),getRandomInt(64,88),getRandomInt(88,256)], 1)
    //    amSynth.triggerAttackRelease("C2", 1)
  },
  medTrigger: function () {
    this.amSynth.triggerAttackRelease("C3", 0.5);
  },
  highTrigger: function () {
    this.amSynth.triggerAttackRelease("C4", 0.5);
  },
  triggerDistanceRolloff: function () {
    // console.log("tryna trigger synth note");
    //   psynth.triggerAttackRelease(["C4", "E4", "A4"], 1)
    // var pattern = new Tone.Pattern(function(time, note){
    //     //the order of the notes passed in depends on the pattern
    //   }, ["C2", "D4", "E5", "A6"], "upDown");
    this.amSynth.triggerAttackRelease("C4", 1);
  },

  pSynthOnOff: function (notes) {
    let pSynth = this.pSynth;
    console.log("notes " + notes);
    let vol = this.pVol;
    // this.pSynth.connect(this.vol)
    //      .connect(this.reverb)
    //     .start();
    // this.pSynth.triggerAttackRelease(["C4", "E4", "A4"], "4n");
        // this.vol.volume.value = 1;
    vol.volume.value = -20;
    pSynth.triggerAttackRelease(notes, "1n");
  },
  resetLabels: function () {
//     let keyEl = document.getElementById("key_"+this.data.keyTonic+this.data.keyType);
//     if (keyEl) {
//       keyEl.querySelector(".text_el");
//       if (keyEl) {
    let id = "text_"+this.data.keyTonic+this.data.keyType;
    console.log("tryna resetLabels " + id);
        let keyLabels = document.querySelectorAll(".text_el")
        for (let i = 0; i < keyLabels.length; i++) {
          
          if (keyLabels[i].id != id) {
            keyLabels[i].setAttribute("material", {"color": "white"});
             // console.log(" resetLabels " + keyLabels[i].id);
          } else {
            keyLabels[i].setAttribute("material", {"color": "red"});
            console.log(" set Label for key " + keyLabels[i].id);
          }
        }

  },
  returnRandomKey: function (distance) {
    let tonics = ["A","A#","Ab","B","B#","Bb","C","C#","D","D#","Db","E","E#","Eb","F","F#","Fb","G","G#","Gb"];
    let types = ["major", "minor", "major7", "minor7"];
    let tonicIndex = Math.floor(Math.random() * tonics.length);
    let typeIndex = Math.floor(Math.random() * types.length);
    // this.pChordOnOff(distance, tonics[tonicIndex], types[typeIndex], 2);
    this.data.keyTonic = tonics[tonicIndex];
    this.data.keyType = types[typeIndex];
    this.resetLabels();

    return [tonics[tonicIndex],types[typeIndex]];
    
  },
  returnChordNotes: function (chord, keyTonic, octave) {
    this.data.chord = chord;
      let chordNotes = Tonal.Chord.notes(chord, keyTonic + octave);
      console.log("returning notes " + chordNotes + " from chord " + chord);
       return chordNotes;
  },
  returnKeyChords: function (keyTonic, keyType) {
    let theKey = {};
    if (keyType == "major") {
      theKey = Tonal.Key.majorKey(keyTonic);
      
      return theKey.chords;
    } else {
      theKey = Tonal.Key.minorKey(keyTonic);
      return theKey.natural.chords;

    }
  },
  returnRandomChordNotes: function (octave, keyTonic, keyType) {
    let theKey = {};
    console.log("tryna return notes from random chord for key " + keyTonic + keyType)
    if (!keyTonic) {
      let keyData = this.returnRandomKey();//.split(",");
      console.log("returning random keyData " + keyData);
      let keyTonic = keyData[0];
      let keyType = keyData[1];
    }
     if (keyType == "major") {
      theKey = Tonal.Key.majorKey(keyTonic);
        var chordIndex = Math.floor(Math.random() * theKey.chords.length);
      let chord = theKey.chords[chordIndex];
       this.data.chord = chord;
      // console.log(keyTonic + " " + keyType + " random chord: " + chord);

      let chordNotes = Tonal.Chord.notes(chord, keyTonic + octave);
        console.log(keyTonic + keyType + " chord " + chord +" notes " + chordNotes);
       return chordNotes;
    } else {
      theKey = Tonal.Key.minorKey(keyTonic);
        var chordIndex = Math.floor(Math.random() * theKey.natural.chords.length);
      let chord = theKey.natural.chords[chordIndex];
      this.data.chord = chord;
            // console.log(keyTonic + " " + keyType + " random chord: " + chord);

       let chordNotes = Tonal.Chord.notes(chord, keyTonic + octave);
      console.log(keyTonic + keyType + " chord " + chord +" notes " + chordNotes);
       return chordNotes;
    }
        
  },
  pChordHit: function (distance) {
    let tonics = ["A","A#","Ab","B","B#","Bb","C","C#","Cb","D","D#","Db","E","E#","Eb","F","F#","Fb","G","G#","Gb"];
    let types = ["major", "minor", "major7", "major4", "major3", "major9", "minor7", "minor4", "minor3", "minor9"];
    let tonicIndex = Math.floor(Math.random() * tonics.length);
    let typeIndex = Math.floor(Math.random() * types.length);
    this.pChordOnOff(distance, tonics[tonicIndex], types[typeIndex], 2);
  },
  pChordArp: function (distance, octave, keyTonic, keyType, chord) {

    let synth = this.polySynth;
    let notes = [];
    let seq = "random";
    let r = Math.random();
    if (r < .25) {
      seq = "upDown";
    } else if (r >= .25 && r < .5) {
      seq = "downUp";
    }
    let mainText = this.mainText;
    if (!keyTonic) {
      if (this.data.keyTonic == "") {
        this.returnRandomKey();
      }
      notes = this.returnRandomChordNotes(2);
    } else {
      notes = this.returnRandomChordNotes(2, keyTonic, keyType);
    }
    if (chord) {
      notes = this.returnChordNotes(octave, chord);
    } else {
      chord = this.data.chord;
    }

    console.log("arp chord " + chord + " notes: " + notes);
      
    if (this.pattern) {
      this.pattern.cancel();
    }
      this.pattern = new Tone.Pattern(function(time, note){
        synth.volume.value = -20 + (10 * Math.random());
        synth.triggerAttackRelease(note, 1, time);
        mainText.setAttribute("text", { value: "key " + keyTonic + keyType + "\nchord: " +chord + "\nnotes: "+ notes});
  
      // }, this.returnRandomChordNotes(octave, this.data.keyTonic, this.data.keyType), "upDown");
      }, notes, seq);
    // Tone.Transport.start();
    // this.pattern.iterations = 8;
    this.pattern.humanize = true;
    this.pattern.probability = .75;
    this.pattern.interval = "8n";
    this.pattern.start();
  },
  pChordOnOff: function(distance, keyTonic, keyType, octave) {
        // let vol = this.pVol;
    // let pSynth = this.pSynth;
    //  keyType: { default: "minor" },
    // keyTonic: { default: "Db" },
    // octave: {default: 2},
    
        // let pSynth = this.pSynth;
    // console.log("notes " + notes);
    // let vol = this.pVol;
    
    if (this.lastNotes.length) {
      this.polySynth.triggerRelease(this.lastNotes);
    }
    this.polySynth.releaseAll();
    this.pVol.volume.value = -20 + (20 - parseFloat(distance * 20));
    let theKey = {};
     if (keyType == "major") {
      theKey = Tonal.Key.majorKey(keyTonic);
    } else {
      theKey = Tonal.Key.minorKey(keyTonic);
    }
    if (keyType == "major") {
      var chordIndex = Math.floor(Math.random() * theKey.chords.length);
      let chord = theKey.chords[chordIndex];
      console.log(keyTonic + " " + keyType + " random chord: " + chord);

      let noteMods = Tonal.Chord.notes(chord, keyTonic + octave);
      console.log("notes " + noteMods);
      // this.pSynthOnOff(noteMods);
            this.polySynth.triggerAttackRelease(noteMods, "2n");
            this.lastNotes = noteMods;
    } else {
      var chordIndex = Math.floor(Math.random() * theKey.natural.chords.length);
      let chord = theKey.natural.chords[chordIndex];
            console.log(keyTonic + " " + keyType + " random chord: " + chord);

      let noteMods = Tonal.Chord.notes(chord, keyTonic + octave);
      console.log("notes " + noteMods);
      
      // this.pSynthOnOff(noteMods);
      this.polySynth.triggerAttackRelease(noteMods, "2n");
      this.lastNotes = noteMods;
      this.mainText.setAttribute("text", { value: "playing "+ noteMods + " \nfrom " + keyTonic + keyType});
      
    }
  },

  remove: function () {
    // Do something the component or its entity is detached.
  },
});

AFRAME.registerComponent("generate_synth_triggers", {
  schema: {
    width: {
      type: "string",
      default: "4", // C4 default note
    },
    height: {
      type: "string",
      default: "4", // quarter note default time
    },
    depth: {
      type: "string",
      default: "4", // quarter note default time
    },
    shape: {
      type: "string",
      default: "cube", // quarter note default time
    },
  },
  init: function () {},
});
AFRAME.registerComponent("mod_keys", {
  schema: {
    width: {
      type: "string",
      default: "4", // C4 default note
    },
    height: {
      type: "string",
      default: "4", // quarter note default time
    },
    depth: {
      type: "string",
      default: "4", // quarter note default time
    },
    shape: {
      type: "string",
      default: "cube", // quarter note default time
    },
  },
  init: function () {
    this.layer1El = document.createElement("a-entity");
    this.el.sceneEl.appendChild(this.layer1El);
    this.layer1El.setAttribute("layout", {"type": "circle", "radius": 1.5, "plane": "xz"});
    // this.layer1El.setAttribute("rotation", {"x": 90, "y": 0, "z": 0});
    this.layer1El.setAttribute("position", {"x": 0, "y": 1, "z": 0});
      let tonics = ["A","A#","Ab","B","B#","Bb","C","C#","D","D#","Db","E","E#","Eb","F","F#","Fb","G","G#","Gb"];
      let types = ["major", "minor", "minor7"];
      for (let i = 0; i < tonics.length; i++) {
    
        for (let n = 0; n < types.length; n++) {
          let instEl = document.createElement("a-entity");
          instEl.setAttribute("geometry", {"primitive": "cylinder", "height": .5, "radius": .035});
          this.layer1El.appendChild(instEl);
          instEl.dataset.keytonic = tonics[i];
          instEl.dataset.keytype = types[n];
          instEl.classList.add("target");
          instEl.setAttribute("mod_el", {"eltype": "keyTrigger"});
          instEl.setAttribute("material", {"color": Math.random() * 0xffffff})
          instEl.id = "key_" +tonics[i]+types[n];
          
          let textEl = document.createElement("a-entity");
          instEl.appendChild(textEl);
          textEl.id = "text_" +tonics[i]+types[n];
          textEl.classList.add("text_el");
          textEl.setAttribute("geometry", {"primitive": "plane", "width": .1, "height": .1});
          textEl.setAttribute("material", {"color": "white"});
          let textString = tonics[i] + " " + types[n];
          textEl.setAttribute("text", {"width": .4, "align": "center", "color": "black", "wrapcount": 10, "value": textString});
          
          textEl.setAttribute("position", {"x": 0, "y": .35, "z": 0});
          textEl.setAttribute("look-at", "[camera]");
          // this.keyLabels.push(textEl);
          // <a-entity id="rightHandText" look-at="[camera]" geometry="primitive: plane; width: .15; height: .05" 
           //      text="align: center; color: black; wrapCount: 30; value: right hand text;" position=".1 0 0"> </a-entity>

        }
      
    }
    
    
  },
});
