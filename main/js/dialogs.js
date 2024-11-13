let showDialogPanel = false;
let dialogInitialized = false;
// let textItemArray = [];
let userInventory = null;
let renderPanel = null;
let useModals = true;
let modalContentElID = 'modalContent';
let theModal = null;
let theRenderCanvas = null;
let locationModalIsOn = false;
var sceneEl = document.querySelector('a-scene');
let timedEventsListenerMode = null;
let showStats = false;
let showCurves = false;
let keydown = "";
let selectedLocationTimestamp = "";
let colorInput_1 = null;
let colorInput_2 = null;
let colorInput_3 = null;
let colorInput_4 = null;


window.addEventListener( 'keydown',  ( event ) => {
  // console.log("keydown code " + event.keyCode);
  switch ( event.keyCode ) {
   
    case 81: // Q

      break;

    case 16: // Shift
      keydown = "Shift";
      break;

    case 84: // T
      keydown = "T";
    break;

    case 87: // W

      break;

    case 69: // E
     
      break;

    case 82: // R
      
      break;

    case 67: // C
     
      break;

    case 86: // V
     
      break;

    case 187:
    case 107: // +, =, num+
     
      break;

    case 189:
    case 109: // -, _, num-
      
      break;

    case 88: // X
      keydown = "X";
      break;

    case 89: // Y
      
      break;

    case 90: // Z
      
      break;

    case 32: // Spacebar
      
      let curveDriver = document.getElementById("cameraCurve");
      if (curveDriver && settings && timedEventsListenerMode ) {
        let modCurveComponent = curveDriver.components.mod_curve;
        if (modCurveComponent) {
          modCurveComponent.toggleMove(PlayPauseMedia());
          // PlayPauseMedia();
        }
      } else { //media called from modCurve to sync playback to curve mvmt
         if (settings && (settings.sceneCameraMode != "Follow Path" || (settings.sceneTags && !settings.sceneTags.includes("follow")))) {
          PlayPauseMedia();
         }
      }
      break;

    case 27: // Esc
      ShowHideDialogPanel();
      allowCameraLock = !allowCameraLock;

      break;
    }
    // event.clearEvents();
  });

  window.addEventListener( 'keyup',  ( event ) => {
    keydown = "*";
    // console.log("keyup " + keydown);

  });

  window.addEventListener("wheel", event => {
    const delta = Math.sign(event.deltaY);
    console.info(delta);
    let curveDriver = document.getElementById("cameraCurve");
        if (curveDriver) {
          let modCurveComponent = curveDriver.components.mod_curve;
          if (modCurveComponent) {
            modCurveComponent.scrollMove(delta);
          }
        }
    
  
  });

  // let lastKnownScrollPosition = 0;
  // let ticking = false;

  // function doSomething(scrollPos) {
  //   let curveDriver = document.getElementById("cameraCurve");
  //     if (curveDriver) {
  //       let modCurveComponent = curveDriver.components.mod_curve;
  //       if (modCurveComponent) {
  //         modCurveComponent.scrollMove(2);
  //       }
  //     }
  // }

  // window.addEventListener("scroll", (event) => {
  //   lastKnownScrollPosition = window.scrollY;
  //   console.log("scroll event!");
  //   if (!ticking) {
  //     window.requestAnimationFrame(() => {
  //       doSomething(lastKnownScrollPosition);
  //       ticking = false;
  //     });

  //     ticking = true;
  //   }
  // });

  function clearSelection() {
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    } else if (document.selection) {
      document.selection.empty();
    }
  }

  // AFRAME.registerComponent('location_picker', {
  //   init: function () {
  //     console.log("tryna set location_picker raycaster");
  //     this.tick = AFRAME.utils.throttleTick(this.tick, 300, this);
  //     this.sceneEl = document.querySelector('a-scene');
  //     this.raycaster = new THREE.Raycaster();
  //     this.locationPicked = null;
  //     this.picking = false;
  //     this.pickerEl = document.createElement("a-entity");
  //     this.pickerEl.id = "picker";
  //     this.el.sceneEl.appendChild(this.pickerEl);
  //     this.pickerEl.setAttribute('gltf-model', '#poi1');
  //     this.el.addEventListener('model-loaded', (e) => {
  //       this.pickerEl.setAttribute("material", {color: "purple", transparent: true, opacity: .5});
  //       // this.pickerEl.style.visibility = "hidden";
  //       this.pickerEl.object3D.visible = false;
  //     });
   
  //       window.addEventListener('mouseup', (e) => { 
  //       e.preventDefault();
  //       if (keydown == "X" && this.locationPicked && !this.picking) {
  //           this.picking = true;
  //           // this.pickerEl.style.visibility = "hidden";
  //           this.pickerEl.object3D.visible = false;
  //           console.log("gotsa locationPicked "+ this.locationPicked);
  //           // keydown = 
  //           CreateLocation(null, "poi", this.locationPicked);
  //           this.reset();
  //         } else {
  //           // this.pickerEl.style.visibility = "hidden";
  //           this.pickerEl.object3D.visible = false;
  //         }
  //       }); 
  //   },
  //   reset: function () {
  //     setTimeout(() =>  {
  //       this.picking = false;
  //     }, 1000);
  //   },
  //   tick: function () {
  
  //     if (!this.raycaster || this.raycaster == null || this.raycaster == undefined || keydown != "X") {
  //       // this.pickerEl.style.visibility = "hidden";
  //       this.pickerEl.object3D.visible = false;

  //       // return;
  //     } else {
  //       // console.log("tryna sert raycaster " + keydown);
  //       // if (keydown == "x") 
  //       this.raycaster.setFromCamera( mouse, AFRAME.scenes[0].camera ); 
  //       // this.intersection = this.raycaster.intersectObject( this.el.sceneEl.children );
  //       const intersects = this.raycaster.intersectObjects( this.sceneEl.object3D.children );
  
  //       if (intersects.length && !this.picking) {
  //         this.locationPicked = intersects[0].point;
  //         // this.pickerEl.style.visibility = "visible";
  //         this.pickerEl.object3D.visible = true;
  //         this.pickerEl.setAttribute("position", this.locationPicked);
  //         console.log("this.locationPicked " + JSON.stringify(this.locationPicked));

  //       } else {
  //         this.locationPicked = null;
  //         // this.pickerEl.style.visibility = "hidden";
  //         this.pickerEl.object3D.visible = false;
  //       }
  //     }
  //   }
  // });


  $('#modalContent').on('click', '#importModsButton', function(e) {
    // console.log("color 1 changed " + e.target.value);
    document.querySelector("#importMods").showPicker();
  });

  $('#modalContent').on('change', '#importMods', function(e) {
    console.log("importMods change event! " + e.target.value);
    ImportMods(e);
  });
  $('#modalContent').on('click', '#importFileButton', function(e) {
    console.log("importFileButton clicked " + e.target.value);
    document.querySelector("#importFile").showPicker();
  });

  $('#modalContent').on('change', '#importFile', function(e) {
    console.log("importFile change event! " + e.target.value);
    // ImportFile(e);
    // handleSubmit(e);
    let string = e.target.value;
    let name = string.substring(12);

    if (getExtension(name) == ".glb" || getExtension(name) == ".jpg" || getExtension(name) == ".png") {
      document.getElementById('selectedFileName').innerHTML = "selected file name: " + name;
      document.getElementById('saveSelectedFileButton').style.visibility = "visible";
    } else {
      document.getElementById('selectedFileName').innerHTML = "invalid file type - only .glb, .jpg and .png currently suppported";
    }
  });
  $('#modalContent').on('click', '#saveSelectedFileButton', function(e) {
    console.log("importFileButton clicked " + e.target.value);
    // document.querySelector("#importFile").showPicker();
    // handleSubmit(e);
    ConvertAndSaveLocalFile();
    document.getElementById('selectedFileName').innerHTML = "";
    document.getElementById('saveSelectedFileButton').style.visibility = "hidden";
  });

  $('#modalContent').on('click', '#sceneColor1', function(e) {
    // console.log("color 1 changed " + e.target.value);
    document.querySelector("#sceneColor1").showPicker();
  });

  $('#modalContent').on('click', '#sceneColor2', function(e) {
    document.querySelector("#sceneColor2").showPicker();
  });
  $('#modalContent').on('click', '#sceneColor3', function(e) {
    document.querySelector("#sceneColor3").showPicker();
  });
  $('#modalContent').on('click', '#sceneColor4', function(e) {
    document.querySelector("#sceneColor4").showPicker();
  });

  $('#modalContent').on('change', '#sceneColor1', function(e) {
    console.log("color 1 changed " + e.target.value);
    ColorMods(e, e.target.value);
  });
  $('#modalContent').on('change', '#sceneColor2', function(e) {
    console.log("color 2 changed " + e.target.value);
    ColorMods(e, e.target.value);
  });
  $('#modalContent').on('change', '#sceneColor3', function(e) {
    console.log("color 3 changed " + e.target.value);
    ColorMods(e, e.target.value);
    
  });
  $('#modalContent').on('change', '#sceneColor4', function(e) {
    console.log("color 4 changed " + e.target.value);
    ColorMods(e, e.target.value);
  });

  $('#modalContent').on('change', '#xscale', function(e) {
    console.log("xscale changed " + e.target.value);

  });
  $('#modalContent').on('change', '#yscale', function(e) {
    console.log("yscale changed " + e.target.value);

  });
  $('#modalContent').on('change', '#zscale', function(e) {
    console.log("zscale changed " + e.target.value);
   
  });

  $('#modalContent').on('change', '#targetElements', function(e) { 
    console.log("targetElements changed " + e.target.value + " for id " + selectedLocationTimestamp);
    let locEl = document.getElementById(selectedLocationTimestamp);
 
    if (locEl) {
    let modModelComponent = locEl.components.mod_model;
    let localMarkerComponent = locEl.components.local_marker;
    let cloudMarkerComponent = locEl.components.cloud_marker;
    let selected = Array.from(document.getElementById('targetElements').options).filter(function (option) {
      return option.selected;
    }).map(function (option) {
      return option.value;
    });
    console.log("selected " + selected);
    // for (let s = 0; s < selected.length; s++) {
      for (let i = 0; i < localData.locations.length; i++) { 
        // console.log(localData.locations[i].timestamp + " vs " + selectedLocationTimestamp);
        if (localData.locations[i].timestamp == selectedLocationTimestamp) {

          localData.locations[i].targetElements = selected;
          console.log("setting locationTarget to " + selected);
          // if (!localData.locations[i].isLocal) {
            if (modModelComponent) { //not for objex, which have their own action system?
              modModelComponent.data.targetElements = selected;

            } else if (cloudMarkerComponent) {
              cloudMarkerComponent.data.targetElements = selected;

            } else if (localMarkerComponent) {
              localMarkerComponent.data.targetElements = selected;

            }
          
          break;
        }
      }
    // }  
  }
      
  });

  $('#modalContent').on('change', '#locationTags', function(e) { 
    console.log("model changed " + e.target.value + " for id " + selectedLocationTimestamp);
    // let locSplit = e.target.value.split("~"); 
    // console.log("locSplit modelID : " + locSplit[1]);
    
    let locEl = document.getElementById(selectedLocationTimestamp);
    let localTags = e.target.value;
    // let uModelName = null;
    if (locEl) {
      // if (locEl && locSplit[1] != undefined && locSplit[1] != "" && locSplit[1] != "none") { //model id
      let modModelComponent = locEl.components.mod_model;
      let localMarkerComponent = locEl.components.local_marker;
      let cloudMarkerComponent = locEl.components.cloud_marker;


        for (let i = 0; i < localData.locations.length; i++) { 
          // console.log(localData.locations[i].timestamp + " vs " + selectedLocationTimestamp);
          if (localData.locations[i].timestamp == selectedLocationTimestamp) {
            
              if (modModelComponent) {
                modModelComponent.data.tags = localTags;
                // modModelComponent.loadModel(uModelID); 
              } else if (cloudMarkerComponent) {
                cloudMarkerComponent.data.tags = localTags;
                // cloudMarkerComponent.loadModel(uModelID); 
              } else if (localMarkerComponent) {
                localMarkerComponent.data.tags = localTags;
                // localMarkerComponent.loadModel(uModelID); 
              }
            
            break;
          }
        }  
      }
    // }
      
  });
  $('#modalContent').on('change', '#sceneEnvironmentPreset', function(e) { 
    console.log("tryna change enviro preset to  " + e.target.value);
    let envEl = document.getElementById('enviroEl');
    if (envEl) {
      envEl.removeAttribute('enviro_mods');
       envEl.setAttribute('enviro_mods', 'preset', e.target.value);
       settings.sceneEnvironmentPreset = e.target.value;
       localData.settings.sceneEnvironmentPreset = e.target.value;
       // envEl.components.enviro_mods.loadPreset("moon");
    }
  });
  function TrimString(string) {
    return string.trim();
  }
  $('#modalContent').on('change', '#sceneTagsField', function(e) { //nothing...?
    console.log("tryna change sceneTags to  " + e);
    let tags = e.target.value.split(",");
    // for (let i = 0; i < tags.length; i++) {

    // }
    tags.map(TrimString);
    localData.settings.sceneTags = tags;
    console.log("tryna change sceneTags to  " + localData.settings.sceneTags);
       // envEl.components.enviro_mods.loadPreset("moon");
  });

  $('#modalContent').on('change', '#locationModel', function(e) { //value has timestamp ~ modelID //no, just just the modelID, get el id from global
    console.log("model changed " + e.target.value + " for id " + selectedLocationTimestamp);
    // let locSplit = e.target.value.split("~"); 
    // console.log("locSplit modelID : " + locSplit[1]);
    
    let locEl = document.getElementById(selectedLocationTimestamp);
    let uModelID = e.target.value;
    let uModelName = null;
    if (locEl) {
      // if (locEl && locSplit[1] != undefined && locSplit[1] != "" && locSplit[1] != "none") { //model id
      let modModelComponent = locEl.components.mod_model;
      let localMarkerComponent = locEl.components.local_marker;
      let cloudMarkerComponent = locEl.components.cloud_marker;

      if (uModelID && uModelID != "" && uModelID != "none") { //model id
        if (uModelID.includes("primitive_")) { 
          if (uModelID.includes("cube")) {
            uModelName == "cube";
          } else if (uModelID.includes("sphere")) {
            uModelName == "sphere";
          } else if (uModelID.includes("cylinder")) {
            uModelName == "cylinder";
          }

        } else if ((uModelID.includes("local_"))) {
          // uModelName == uModelID.substring(6)
        } else {
          for (let i = 0; i < sceneModels.length; i++) {
            if (sceneModels[i]._id == uModelID) {
              uModelName = sceneModels[i].name; //really just need the name
              // uModelID = sceneModels[i]._id;
              break;  
            }    
          } 
        }
        for (let i = 0; i < localData.locations.length; i++) { 
          // console.log(localData.locations[i].timestamp + " vs " + selectedLocationTimestamp);
          if (localData.locations[i].timestamp == selectedLocationTimestamp) {
            console.log(uModelID + " gotsa match "+ localData.locations[i].timestamp + " vs " + selectedLocationTimestamp);
            localData.locations[i].modelID = uModelID;
            localData.locations[i].model = uModelName;
            localData.locations[i].objectID = "none";
            localData.locations[i].objectName = "";
            if (uModelID != 'none' && localData.locations[i].markerType.toLowerCase() == 'none') {
              localData.locations[i].markerType = 'model';
              document.getElementById("locationMarkerType").value = "model";
            }
            // if (!localData.locations[i].isLocal) {
              if (modModelComponent) {
                modModelComponent.data.modelID = uModelID;
                modModelComponent.loadModel(uModelID); 
              } else if (cloudMarkerComponent) {
                cloudMarkerComponent.data.modelID = uModelID;
                cloudMarkerComponent.loadModel(uModelID); 
              } else if (localMarkerComponent) {
                localMarkerComponent.data.modelID = uModelID;
                localMarkerComponent.loadModel(uModelID); 
              }
            
            break;
          }
        }  
      }
    }
      
  });

  $('#modalContent').on('change', '#locationObject', function(e) { //value has phID ~ objectID  (room~type~timestamp~objectID) //no, now just timestamp~objectID// no, now just timestamp!
    console.log("object changed " + e.target.value + " for id " + selectedLocationTimestamp);
    // let locSplit = e.target.value.split("~"); 
    // console.log("locSplit modelID : " + locSplit[1]);
    
    let locEl = document.getElementById(selectedLocationTimestamp);
    let uObjectID = e.target.value;
    let uObjectName = null;
    if (locEl) {
      // if (locEl && locSplit[1] != undefined && locSplit[1] != "" && locSplit[1] != "none") { //model id
      // let modModelComponent = locEl.components.mod_model;

      let localMarkerComponent = locEl.components.local_marker;
      let modObjectComponent = locEl.components.mod_object;

          for (let i = 0; i < sceneObjects.length; i++) {
            if (sceneObjects[i]._id == uObjectID) {
              uObjectName = sceneObjects[i].name; //really just need the name
 
              break;  
            }    
          } 
        // }
        for (let i = 0; i < localData.locations.length; i++) { 
          // console.log(localData.locations[i].timestamp + " vs " + selectedLocationTimestamp);
          if (localData.locations[i].timestamp == selectedLocationTimestamp) {
            console.log("gotsa match "+ localData.locations[i].timestamp + " vs " + selectedLocationTimestamp);
            if (localData.locations[i].markerType == "object" || localData.locations[i].markerType == "spawn" || localData.locations[i].markerType == "character") {
            localData.locations[i].objectID = uObjectID;
            localData.locations[i].objectName = uObjectName;
            localData.locations[i].modelID = "none";
            localData.locations[i].model = "";

            // if (!localData.locations[i].isLocal) {
              if (modObjectComponent) { //remove?  disable? hrm...
                // modModelComponent.data.modelID = uModelID;
                // modModelComponent.loadModel(uModelID); 
              } else if (localMarkerComponent) {
                localMarkerComponent.data.modelID = "none";
                localMarkerComponent.data.objectID = uObjectID;
                localMarkerComponent.loadObject(uObjectID); 
              }
            } else {
              console.log("markertype must be object to set object value");
            }
            break;
          }
        }  
      } else {
        console.log("din't find the el!");
      }
    
      
  });


  $('#modalContent').on('change', '#locationMarkerType', function(e) {
      console.log('type ' + e.target.value + " id " + selectedLocationTimestamp);
      let theEl = document.getElementById(selectedLocationTimestamp);
      if (theEl) {
      for (let i = 0; i < localData.locations.length; i++) { //elsewise 
        if (localData.locations[i].timestamp == selectedLocationTimestamp) {
          if (e.target.value == "collider") {
            document.getElementById("locationModel").value = "primitive_cube";
          }
            
            if (!localData.locations[i].isLocal) {
              localMarkerComponent = theEl.components.local_marker;
              if (localMarkerComponent) {
                localMarkerComponent.data.markerType = e.target.value;
                localMarkerComponent.loadModel(); 
              }
            } else {
              cloudMarkerComponent = theEl.components.cloud_marker;
              if (cloudMarkerComponent) {
                cloudMarkerComponent.data.markerType = e.target.value;
                cloudMarkerComponent.loadModel(); 
              }
            }
        
          // }
        }
      }
    } else {
      console.log("Didn't find theEl!");
    } 
  });
  
  $('#modalContent').on('change', '#locationMedia', function(e) {
    console.log('type ' + e.target.value + " id " + selectedLocationTimestamp);
    let theEl = document.getElementById(selectedLocationTimestamp);
    if (theEl) {
      for (let i = 0; i < localData.locations.length; i++) { //elsewise 
        if (localData.locations[i].timestamp == selectedLocationTimestamp) { 
          if (!localData.locations[i].isLocal) { //mods to local only
            localMarkerComponent = theEl.components.local_marker;
            if (localMarkerComponent) {
              localMarkerComponent.data.mediaID = e.target.value;
              localMarkerComponent.loadMedia(); 
            }
          } else {
            cloudMarkerComponent = theEl.components.cloud_marker; //mods to location that been saved to cloud
            if (cloudMarkerComponent) {
              cloudMarkerComponent.data.mediaID = e.target.value;
              console.log("loadMedia cloudmarker " +cloudMarkerComponent.data.mediaID);
              cloudMarkerComponent.loadMedia(); 
            }
          }
        }
      }
    } else {
      console.log("Didn't find theEl!");
    } 
  });

  $('#modalContent').on('change', '.tk_type', function(e) {
      console.log('type ' + e.target.value + " id " + e.target.id);
      for (let i = 0; i < timeKeysData.timekeys.length; i++) {
        if (e.target.id == "tk_type_" + i) {
            timeKeysData.timekeys[i].keytype = e.target.value;
            console.log(JSON.stringify(timeKeysData.timekeys[i]));
        }
      }
  });
  $('#modalContent').on('change', '.tk_start', function(e) {
    console.log('type ' + e.target.value + " id " + e.target.id);
    for (let i = 0; i < timeKeysData.timekeys.length; i++) {
      if (e.target.id == "tk_start_" + i) {
          timeKeysData.timekeys[i].keystarttime = e.target.value;
          console.log(JSON.stringify(timeKeysData.timekeys[i]));
      }
    }
  });
  $('#modalContent').on('change', '.tk_duration', function(e) {
    console.log('type ' + e.target.value + " id " + e.target.id);
    for (let i = 0; i < timeKeysData.timekeys.length; i++) {
      if (e.target.id == "tk_duration_" + i) {
          timeKeysData.timekeys[i].keyduration = e.target.value;
          console.log(JSON.stringify(timeKeysData.timekeys[i]));
      }
    }
  });
  $('#modalContent').on('change', '.tk_tags', function(e) {
    console.log('type ' + e.target.value + " id " + e.target.id);
    for (let i = 0; i < timeKeysData.timekeys.length; i++) {
      if (e.target.id == "tk_tags_" + i) {
          timeKeysData.timekeys[i].keytags = e.target.value;
          console.log(JSON.stringify(timeKeysData.timekeys[i]));
      }
    }
  });
  $('#modalContent').on('change', '.tk_data', function(e) {
    console.log('type ' + e.target.value + " id " + e.target.id);
    for (let i = 0; i < timeKeysData.timekeys.length; i++) {
      if (e.target.id == "tk_data_" + i) {
          timeKeysData.timekeys[i].keydata = e.target.value;
          console.log(JSON.stringify(timeKeysData.timekeys[i]));
      }
    }
  });


  $('#modalContent').on('change', '#listenToTimelineSelector', function(e) {
    timedEventsListenerMode = e.target.value;
    timeKeysData.listenTo = timedEventsListenerMode;
    console.log('timedEventsListenerMode ' + timedEventsListenerMode);
  });



  $('#modalContent').on('click', '.tk_rm', function(e) {  
    console.log('tryna remove ' + e.target.id);
    for (let i = 0; i < timeKeysData.timekeys.length; i++) {
      if (e.target.id == "tk_rm_" + i) {
        timeKeysData.timekeys.splice(i, 1); 
      }
    }
    SceneManglerModal('Events');
  });


var HideMobileKeyboard = function() {
	document.activeElement.blur();
	$("input").blur();
};

function LerpColor(a, b, amount) { 

    var ah = parseInt(a.replace(/#/g, ''), 16),
        ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
        bh = parseInt(b.replace(/#/g, ''), 16),
        br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}

function PlayButton() {

}

function TabMangler(evt, tagName) {
    console.log("tryna switch to " + tagName);
    if (tagName === "Inventory") {
      // GetUserInventory();
      // GetLocalFiles();
    }
    if (tagName === "Events") {
      ReturnTimeKeys();
    }
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    let tagnameEl = document.getElementById(tagName);
    let mtitleEl = document.getElementById('modalTitle');
    if (tagnameEl != null) {
        console.log("tryna enable tagnameEl " + tagnameEl.id);
        tagnameEl.style.display = "block";
    }
    // document.getElementById(tagName).style.display = "block";
    if (evt != null) {
        evt.currentTarget.className += " active";
    }
    if (mtitleEl != null) {
        if (tagName != "Welcome") {
            mtitleEl.innerHTML = "<h3>" + tagName + "</h3>";
        } else {
            
            mtitleEl.innerHTML = "<h3>" + tagName + " " + avatarName + "!</h3>";
        }
    }

    
  }

// function ToggleLocationModalListeners () { //add/remove listeners for location modal ui //nm
//   locationModalIsOn = !locationModalIsOn;
//   if (locationModalIsOn) {
//     let locMdlSelectEl = document.getElementById("locationModel");
//     locMdlSelectEl.addEventListener('change', function(e) {
//         console.log(e.value);
//     });
//     let locMarkerTypeSelectEl = document.getElementById("locationMarkerType");
//     locMarkerTypeSelectEl.addEventListener('change', function(e) {
//         console.log(e.value);
//     });
//   }
// }
function ReturnLocationItem () {
  let phID = selectedLocationTimestamp;
  let locationItem = null;
  for (let i = 0; i < localData.locations.length; i++) {
    // console.log("checking phID " + phID +  " vs " + localData.locations[i].timestamp );
    if (phID == localData.locations[i].timestamp) {
      locationItem = localData.locations[i];
      console.log("gotsa matching location item " + localData.locations[i].modelID);
      return locationItem;
      
    }
  }
}

function ReturnLocationModelSelect () {

    let phID = selectedLocationTimestamp;
    console.log("tryna return models for phID " + phID);
  //  let locationItem = JSON.parse(localStorage.getItem(phID));
    let locationItem = ReturnLocationItem();

  //  for (let i = 0; i < localData.locations.length; i++) {
  //     console.log("checking phID " + phID +  " vs " + localData.locations[i].timestamp );
  //     if (phID == localData.locations[i].timestamp) {
  //       locationItem = localData.locations[i];
  //       console.log("gotsa matching location item " + localData.locations[i].modelID);
  //     }
  //  }

   let modelSelect = "<option value=\x22none\x22>none</option>";
                      
    
    if (locationItem && locationItem.modelID && locationItem.modelID.toString().includes("primitive")) {
      if (locationItem.modelID.toString().includes("cube")) {
        modelSelect = modelSelect + "<option value=\x22primitive_cube\x22 selected>cube</option>"+
                                    "<option value=\x22primitive_sphere\x22>sphere</option>"+ 
                                    "<option value=\x22primitive_cylinder\x22>cylinder</option>";
      } else if (locationItem.modelID.toString().includes("sphere")) {
        modelSelect = modelSelect + "<option value=\x22primitive_cube\x22>cube</option>"+
                                    "<option value=\x22primitive_sphere\x22 selected>sphere</option>"+ 
                                    "<option value=\x22primitive_cylinder\x22>cylinder</option>";
      } else if (locationItem.modelID.toString().includes("cylinder")) {
        modelSelect = modelSelect + "<option value=\x22primitive_cube\x22>cube</option>"+
                                    "<option value=\x22primitive_sphere\x22>sphere</option>"+ 
                                    "<option value=\x22primitive_cylinder\x22 selected>cylinder</option>";
      } 
    } else {
      modelSelect = modelSelect + "<option value=\x22primitive_cube\x22>cube</option>"+
                                  "<option value=\x22primitive_sphere\x22>sphere</option>"+ 
                                  "<option value=\x22primitive_cylinder\x22>cylinder</option>";
    }

   for (let i = 0; i < sceneModels.length; i++) {
      // if (sceneModels[i].isPublic || !isGuest) { //maybe something else?

         if (locationItem != null && locationItem.modelID == sceneModels[i]._id) {
          console.log("locMdl: "  + locationItem.modelID + " vs " + sceneModels[i]._id);
            // modelSelect = modelSelect + "<option value=\x22"+phID+"~"+sceneModels[i]._id+"\x22 selected>" + sceneModels[i].name + "</option>";
            modelSelect = modelSelect + "<option value=\x22"+sceneModels[i]._id+"\x22 selected>" + sceneModels[i].name + "</option>";
            console.log("locMdl selected: "  + locationItem.modelID + " vs " + sceneModels[i]._id);
         } else {
            // modelSelect = modelSelect + "<option value=\x22"+phID+"~"+sceneModels[i]._id+"\x22>" + sceneModels[i].name + "</option>";
            modelSelect = modelSelect + "<option value=\x22"+sceneModels[i]._id+"\x22>" + sceneModels[i].name + "</option>";
         }
      // }
   }
   for (let key in localData.localFiles) {
      let ext = localData.localFiles[key].name.split('.');
      ext = ext[ext.length - 1];
      if (ext == "glb") {
        console.log("gotsa glb " + localData.localFiles[key].name + " tryna match with " +locationItem.modelID);
        if (locationItem != null && locationItem.modelID == "local_" + localData.localFiles[key].name) {
          modelSelect = modelSelect + "<option value=\x22local_"+localData.localFiles[key].name+"\x22 selected>local_" + localData.localFiles[key].name + "</option>";
        } else {
          modelSelect = modelSelect + "<option value=\x22local_"+localData.localFiles[key].name+"\x22 >local_" + localData.localFiles[key].name + "</option>";
        }
        
      }  

    }
   return modelSelect;
}
function ReturnLocationObjectSelect (phID) {
  console.log("tryna find location object for objectSelect " + phID );
  let objexEl = document.getElementById('sceneObjects');
  let locationItem = null;
  if (objexEl != null) {
    for (let i = 0; i < localData.locations.length; i++) {
      if (phID == localData.locations[i].timestamp) {
        console.log("gotsa location object for objectSelect " + phID );
        locationItem = localData.locations[i];
      }
   }
   if (objexEl.components.mod_objex) {
      sceneObjects = objexEl.components.mod_objex.returnObjexData(); //!
    
      let objectSelect = "<option value=\x22none\x22>none</option>";

        for (let i = 0; i < sceneObjects.length; i++) {
          // console.log("spinning through sceneObjects : " + 
            // if (sceneModels[i].isPublic || !isGuest) { //maybe something else?
              if (locationItem && locationItem.objectID != null && locationItem.objectID != undefined && locationItem.objectID == sceneObjects[i]._id) {
                objectSelect = objectSelect + "<option value=\x22"+sceneObjects[i]._id+"\x22 selected>" + sceneObjects[i].name + "</option>";
              } else {
                objectSelect = objectSelect + "<option value=\x22"+sceneObjects[i]._id+"\x22>" + sceneObjects[i].name + "</option>";
              }
            // if (i == sceneObjects.length - 1) {
            //   return objectSelect;
            // }
        }
      
      return objectSelect;

    } else {
      return "";
    } 
  } else {
    return "";
  }
}
function ReturnOtherLocations (selected) {
  let phID = selectedLocationTimestamp;
  console.log("selected options for targetElements " + selected);
  let locs = "<option value=\x22none\x22 selected>none</option>";
  for (let i = 0; i < localData.locations.length; i++) {
    if (localData.locations[i].timestamp != selectedLocationTimestamp) {
      // locArray.push
      // console.log(localData.locations[i].timestamp + " vs " + selected + " " + selected.includes(localData.locations[i].timestamp.toString()) );
      if (selected.includes(localData.locations[i].timestamp.toString())) {
        locs = locs + "<option value=\x22"+localData.locations[i].timestamp+"\x22 selected>"+localData.locations[i].name+"</option>";
      } else {
        locs = locs + "<option value=\x22"+localData.locations[i].timestamp+"\x22>"+localData.locations[i].name+"</option>";
      }
     
    }
    if (i == localData.locations.length - 1) {
      return locs;
    }
  }
  
}
function ReturnMediaNames (mediaID, mtype) { //set this up to show asset names in location table view
  for (let key in localData.localFiles) {
    let ext = localData.localFiles[key].name.split('.');
    ext = ext[ext.length - 1];
    if (ext == "jpg" || ext == "png") {
      console.log("gotsa jpg " + localData.localFiles[key].name + " tryna match with " +locationItem.mediaID);
      if (locationItem != null && locationItem.mediaID == "local_" + localData.localFiles[key].name) {
        mediaSelect = mediaSelect + "<option value=\x22local_"+localData.localFiles[key].name+"\x22 selected>local_" + localData.localFiles[key].name + "</option>";
      } 
    }  
  }
  if (scenePictureItems) {
    for (let i = 0; i < scenePictureItems.length; i++) {
      console.log("scenePicture:  "+ JSON.stringify(scenePictureItems[i]));
      if (scenePictureItems[i].orientation != "Equirectangular") {
        if (locationItem != null && locationItem.mediaID == scenePictureItems[i]._id) {
          mediaSelect = mediaSelect + "<option value=\x22"+scenePictureItems[i]._id+"\x22 selected>" + scenePictureItems[i].filename + "</option>";
        } else {
          mediaSelect = mediaSelect + "<option value=\x22"+scenePictureItems[i]._id+"\x22 >" + scenePictureItems[i].filename + "</option>";
        }
      }
    }
  }

}
function ReturnMediaSelections (mediaID, mtype) {
  let phID = selectedLocationTimestamp;
  let locationItem = ReturnLocationItem();
  console.log("tryna return media " + mediaID + " of type " + mtype + " for element " + phID);
  let mediaSelect = "<option value=\x22none\x22 selected>none</option>";
  if (mtype && mtype == "picture") {
    if (mediaID) {

    } else {
      console.log("no picture media ID");
    }
    let scenePictureItems = null;
    let scenePicDataEl = document.getElementById("scenePictureData");
    if (scenePicDataEl) {
      scenePictureItems = scenePicDataEl.components.scene_pictures_control.returnScenePictureItems();
    }
  
      for (let key in localData.localFiles) {
        let ext = localData.localFiles[key].name.split('.');
        ext = ext[ext.length - 1];
        if (ext == "jpg" || ext == "png") {
          console.log("gotsa jpg " + localData.localFiles[key].name + " tryna match with " +locationItem.mediaID);
          if (locationItem != null && locationItem.mediaID == "local_" + localData.localFiles[key].name) {
            mediaSelect = mediaSelect + "<option value=\x22local_"+localData.localFiles[key].name+"\x22 selected>local_" + localData.localFiles[key].name + "</option>";
          } else {
            mediaSelect = mediaSelect + "<option value=\x22local_"+localData.localFiles[key].name+"\x22 >local_" + localData.localFiles[key].name + "</option>";
          }
        }  
      }
      if (scenePictureItems) {
        for (let i = 0; i < scenePictureItems.length; i++) {
          console.log("scenePicture:  "+ JSON.stringify(scenePictureItems[i]));
          if (scenePictureItems[i].orientation != "Equirectangular") {
            if (locationItem != null && locationItem.mediaID == scenePictureItems[i]._id) {
              mediaSelect = mediaSelect + "<option value=\x22"+scenePictureItems[i]._id+"\x22 selected>" + scenePictureItems[i].filename + "</option>";
            } else {
              mediaSelect = mediaSelect + "<option value=\x22"+scenePictureItems[i]._id+"\x22 >" + scenePictureItems[i].filename + "</option>";
            }
          }
        }
      }
    return mediaSelect;
  } else if (mtype && mtype == "text") {
    if (mediaID) {
      // let sceneTextItems = null;
      // let sceneTextDataEl = document.getElementById("sceneTextData");
      // if (sceneTextDataEl) {
      //   sceneTextItems = sceneTextDataEl.components.scene_text_control.returnSceneTextItems();
      // }
      if (sceneTextItems) {
        for (let i = 0; i < sceneTextItems.length; i++) {
          console.log("sceneTextItem:  "+ JSON.stringify(sceneTextItems[i]));
          
            if (locationItem != null && locationItem.mediaID == sceneTextItems[i]._id) {
              mediaSelect = mediaSelect + "<option value=\x22"+sceneTextItems[i]._id+"\x22 selected>" + sceneTextItems[i].title + "</option>";
            } else {
              mediaSelect = mediaSelect + "<option value=\x22"+sceneTextItems[i]._id+"\x22 >" + sceneTextItems[i].title + "</option>";
            }
          
        }
      }
    } 
    return mediaSelect;
  }
}

function ReturnSceneEnviromentPreset (selected) {

  // if (!selected) {
  //   selected = 'none';
  // }
  console.log("tryna return scene enviro preset selected " + selected);
  let types = "";
  const typesArray = ['none', 'default', 'contact', 'egypt', 'checkerboard', 'forest', 'goaland', 'yavapai', 'goldmine', 'threetowers', 'poison', 'arches', 'tron', 'japan', 'dream', 'volcano', 'starry', 'osiris', 'moon'];
  for (let i = 0; i < typesArray.length; i++) {
      if (typesArray[i] == selected) {
          types = types +
          "<option selected>" + typesArray[i] + "</option>";
      } else {
          types = types +
          "<option>" + typesArray[i] + "</option>";
      }
  }
  return types;
}
function ReturnLocationMarkerTypeSelect (selected) {

    let types = "";
    const typesArray = [
      "none",
      "placeholder",
      "model",
      "object",
      "spawn",
      "poi",
      "waypoint",
      "curve point",
      "curve",
      "trigger",
      "collider",
      "target",
      "gate",
      "link",
      "portal",

      "light",
      "player",
      "character",
      "surface",
      "navmesh",
      "floorplane",
      "dataviz",

      

      "available scenes key",
      "audio",
      "audiogroup",
      "picture",
      // "picture fixed",
      // "picture billboard",
      "picture group",
      "video",
      // "video billboard",
      "youtube",
      // "youtube billboard",
      "3D text",
      "text",
      "text billboard",
      // "textbook",
      // "picturebook",
      
      "mailbox",
      "pickup",
      "drop",
      // "collectible",
      // "media",
      "canvas fixed",
      "canvas billboard",
      "svg canvas fixed",
      "svg canvas billboard",
      "svg fixed",
      "svg billboard",
      // "callout",
      // "availablescenes",

      "brownian path",
      "brownian motion",
      "follow curve",
      "follow random path",
      "tunnel",
      "follow parametric curve",
      "follow ambient",
      "lerp",
      "slerp",
      "track face",
      // "spawntrigger",
      // "trigger",
      // "collider",
      // "light",
      "particlesystem",

      "flyer",
      "walker"];
    for (let i = 0; i < typesArray.length; i++) {
        if (typesArray[i] == selected) {
            types = types +
            "<option selected>" + typesArray[i] + "</option>";
        } else {
            types = types +
            "<option>" + typesArray[i] + "</option>";
        }
    }
    return types;
}


function ShowLocationModal(timestamp) {  
    clearSelection();
    let thisLocation = null;
    selectedLocationTimestamp = timestamp;
    // console.log("loaded and looking for " + phID);
    console.log("ShowLocationModal looking for " + timestamp);
    phID = timestamp;

    console.log("local length " + localData.locations.length + " vs cloud length " + sceneLocations.locations.length);
    if (localData.locations.length) {
      console.log("looking for localdata.locations");
      for (let i = 0; i < localData.locations.length; i++) {
        // console.log(timestamp + " vs " + localData.locations[i].timestamp);
        if (timestamp == localData.locations[i].timestamp) {
          thisLocation = localData.locations[i];
          console.log("gotsa local location@! " + localData.locations[i].markerType);
          break;
        }
      }
    } else {
      for (let i = 0; i < sceneLocations.locations.length; i++) {
        console.log(timestamp + " vs " + sceneLocations.locations[i].timestamp);
        if (timestamp == sceneLocations.locations[i].timestamp) {
          thisLocation = sceneLocations.locations[i];
          console.log("gotsa cloud location@! " + sceneLocations.locations[i].markerType);
          break;
        }
      }
    }
 
    let cloudSaveButton = "";
    if (thisLocation != null)  {
        if (!thisLocation.xscale || thisLocation.xscale == 0 || thisLocation.xscale == "") {
          thisLocation.xscale = 1;
        } 
        if (!thisLocation.yscale || thisLocation.yscale == 0 || thisLocation.yscale == "") {
          thisLocation.yscale = 1;
        } 
        if (!thisLocation.zscale || thisLocation.zscale == 0 || thisLocation.zscale == "") {
          thisLocation.zscale = 1;
        }
        let label = (thisLocation.name != null && thisLocation.name != undefined && thisLocation.name != 'undefined') ? thisLocation.name : "location";
        // if (userData.sceneOwner != null) {
        //     cloudSaveButton = "<button class=\x22reallySaveButton\x22 onclick=\x22SaveModsToCloud('"+phID+"')\x22>Save (cloud)</button>";
        // }
        if (!thisLocation.targetElements) {
          thisLocation.targetElements = "none";
        }
        
        let disabled = "disabled";
        if (thisLocation.markerType && thisLocation.markerType == "object") {
          console.log("tryna set up ui for markertype " + thisLocation.markerType )
          disabled = "";
        }
        let phID = thisLocation.timestamp;
        let title = label + " : " + thisLocation.timestamp;
        // let content = "<span id='modalCloser' onclick=\x22ShowHideDialogPanel()\x22 class='close-modal'>&times;</span><div><h3>"+title+"</h3><hr>" + //populate modal
        let content = "<div><div><h3>"+title+"</h3><span id=\x22detailModMessage\x22 style=\x22float:right; color:pink; margin: auto\x22></span></div><hr>" + //populate modal
        // "<form>"+aa
        // "<table><tr>"
        "<div class=\x22row\x22>"+
        "<button class=\x22snapButton\x22 style=\x22float:left;\x22 onclick=\x22SnapLocation('"+phID+"')\x22>SnapTo</button>"+
        // "<button class=\x22grabButton\x22 style=\x22float:left;\x22 onclick=\x22ToggleTransformControls('"+phID+"')\x22>Toggle Transform Controls</button>"+
        // "<button class=\x22goToButton\x22 style=\x22float:left;\x22 onclick=\x22GoToLocation('"+phID+"')\x22>Go To</button>"+
        "<button class=\x22goToButton\x22 style=\x22float:left;\x22 onclick=\x22PlayerToLocation('"+thisLocation.x+ " " + thisLocation.y + " " + thisLocation.z +"')\x22>GoTo</button>"+
        // "<button class=\x22goToButton\x22 onclick=\x22PlayerToLocation('"+phID+"')\x22>GoTo</button>"+
        // "<button class=\x22infoButton\x22 onclick=\x22SceneManglerModal('Locations')\x22>Location</button>"+
        "</div>"+

        "<div class=\x22row\x22><div class=\x22threecolumn\x22><label for=\x22locationName\x22>Location Name</label>"+
        "<input class=\x22normalfield\x22 type=\x22text\x22 id=\x22locationName\x22 value=\x22"+label+"\x22></div>"+

        "<div class=\x22threecolumn\x22><label for=\x22locationModel\x22>Location Model</label>"+
        "<select id=\x22locationModel\x22 name=\x22locationModel\x22>"+
        // "<option value=\x22placeholder\x22>none</option>"+
        ReturnLocationModelSelect(phID) + //phID = scene shortID ~ cloud/localmarker ~ timestamp
        "</select></div>"+


        "<div class=\x22threecolumn\x22><label for=\x22locationObject\x22>Location Object</label>"+
        "<select id=\x22locationObject\x22 name=\x22locationObject\x22 "+disabled+">"+
        // "<option value=\x22placeholder\x22>none</option>"+
        ReturnLocationObjectSelect(phID) + //phID = scene shortID ~ cloud/localmarker ~ timestamp
        "</select></div></div>"+



        "<div class=\x22row\x22><div class=\x22threecolumn\x22><label for=\x22locationMarkerType\x22>Location Type</label>"+
        "<select id=\x22locationMarkerType\x22 name=\x22locationMarkerType\x22>"+
        ReturnLocationMarkerTypeSelect(thisLocation.markerType) + 
        "</select></div>"+

        "<div class=\x22threecolumn\x22><label for=\x22locationDescription\x22>Description</label>"+
        "<textarea type=\x22textarea\x22 id=\x22locationDescription\x22>"+thisLocation.description+"</textarea><br></div>"+

        "<div class=\x22threecolumn\x22><label for=\x22locationEventData\x22>Event Data</label>"+
        "<textarea type=\x22textarea\x22 id=\x22locationEventData\x22>"+thisLocation.eventData+"</textarea><br></div></div>"+
        // "</div>"+

        "<div class=\x22row\x22><div class=\x22threecolumn\x22><label for=\x22xpos\x22>X Position</label>"+
        "<input class=\x22xfield\x22 type=\x22number\x22 id=\x22xpos\x22 value=\x22"+thisLocation.x+"\x22></div>"+

        "<div class=\x22threecolumn\x22><label for=\x22ypos\x22>Y Position</label>"+
        "<input class=\x22yfield\x22 type=\x22number\x22 id=\x22ypos\x22 value=\x22"+thisLocation.y+"\x22></div>"+

        "<div class=\x22threecolumn\x22><label for=\x22zpos\x22>Z Position</label>"+
        "<input class=\x22zfield\x22 type=\x22number\x22 id=\x22zpos\x22 value=\x22"+thisLocation.z+"\x22></div></div>"+

        "<div class=\x22row\x22><div class=\x22threecolumn\x22><label for=\x22xrot\x22>X Rotation</label>"+
        "<input class=\x22xfield\x22 type=\x22number\x22 id=\x22xrot\x22 value=\x22"+thisLocation.eulerx+"\x22></div>"+

        "<div class=\x22threecolumn\x22><label for=\x22yrot\x22>Y Rotation</label>"+
        "<input class=\x22yfield\x22 type=\x22number\x22 id=\x22yrot\x22 value=\x22"+thisLocation.eulery+"\x22></div>"+

        "<div class=\x22threecolumn\x22><label for=\x22zrot\x22>Z Rotation</label>"+
        "<input class=\x22zfield\x22 type=\x22number\x22 id=\x22zrot\x22 value=\x22"+thisLocation.eulerz+"\x22></div></div>"+

        "<div class=\x22row\x22><div class=\x22threecolumn\x22><label for=\x22xscale\x22>X Scale</label>"+
        "<input class=\x22xfield\x22 type=\x22number\x22 id=\x22xscale\x22 value=\x22"+thisLocation.xscale+"\x22></div>"+
        "<div class=\x22threecolumn\x22><label for=\x22yscale\x22>Y Scale</label>"+
        "<input class=\x22yfield\x22 type=\x22number\x22 id=\x22yscale\x22 value=\x22"+thisLocation.yscale+"\x22></div>"+
        "<div class=\x22threecolumn\x22><label for=\x22zscale\x22>Z Scale</label>"+
        "<input class=\x22zfield\x22 type=\x22number\x22 id=\x22zscale\x22 value=\x22"+thisLocation.zscale+"\x22></div></div>"+


        // "<div class=\x22row\x22><div class=\x22threecolumn\x22><label for=\x22modelScale\x22>Scale</label><br>"+
        // "<input class=\x22normalfield\x22 type=\x22number\x22 id=\x22modelScale\x22 value=\x22"+thisLocation.markerObjScale+"\x22></div>"+


        // "<div class=\x22threecolumn\x22><label for=\x22locationDescription\x22>Description</label>"+
        // "<textarea type=\x22textarea\x22 id=\x22locationDescription\x22>"+thisLocation.description+"</textarea><br></div>"+


        
        // "<div class=\x22threecolumn\x22><label for=\x22locationEventData\x22>Event Data</label>"+
        // "<textarea type=\x22textarea\x22 id=\x22locationEventData\x22>"+thisLocation.eventData+"</textarea><br></div>"+
        // "+that.data.timestamp+","+that.data.name+","+position.x+","+position.y+","+position.z+"
        // ReturnOtherLocations();

        "<div class=\x22row\x22><div class=\x22threecolumn\x22><label for=\x22targetElements\x22>Target Location(s)</label>"+
        "<select id=\x22targetElements\x22 name=\x22targetElements\x22 multiple size=\x223\x22>"+
        ReturnOtherLocations(thisLocation.targetElements) +
        "</select>"+thisLocation.targetElements+"</div>"+

        "<div class=\x22threecolumn\x22><label for=\x22locationMedia\x22>Location Media</label>"+
        "<select id=\x22locationMedia\x22 name=\x22locationMedia\x22>"+
        ReturnMediaSelections(thisLocation.mediaID, thisLocation.markerType) +
        "</select></div>"+

        "<div class=\x22threecolumn\x22><label for=\x22locationTags\x22>Tags</label>"+
        "<textarea type=\x22textarea\x22 placeholder=\x22\x22 id=\x22locationTags\x22>"+thisLocation.locationTags+"</textarea><br></div></div>"+
        
        // "<button class=\x22deleteButton\x22 onclick=\x22DeleteLocation('"+phID+"')\x22>Clear Mods</button>"+



        "<button class=\x22addButton\x22 style=\x22float:right;\x22 onclick=\x22SaveModToLocal('"+phID+"')\x22>Save to Local DB</button>"+
        cloudSaveButton +

        // "<button class=\x22snapButton\x22 onclick=\x22SnapLocation('"+phID+"')\x22>Snap</button>"+
        // "<button class=\x22grabButton\x22 onclick=\x22GrabLocation('"+phID+"')\x22>Grab</button>"+
        // "<button class=\x22goToButton\x22 onclick=\x22GoToLocation('"+phID+"')\x22>GoTo</button>"+
        // // "<button class=\x22goToButton\x22 onclick=\x22PlayerToLocation('"+phID+"')\x22>GoTo</button>"+
        // "<button class=\x22infoButton\x22 onclick=\x22SceneManglerModal('Locations')\x22>View All</button>"+

        // "</form>"+
        "</div>";
        // console.log(content);
        return content;
        // ShowHideDialogPanel(content);
        // ToggleLocationModalListeners();
    }
}
function ReturnTimedEventSelectors (selectedType) {

    let types = "";
    const typesArray = [
      "Beat",
        "Next",
        "Previous",
        "Random Time",
        "GoTo Time",
        "Picture Next",
        "Picture Random",
        "Picture Index",
        "Text Next",
        "Text Show",
        "Text Index",
        "Clear Loops",
        "Player Snap",
        "Player Lerp",
        "Player Look",
        "Target Snap",
        "Target Lerp",
        "Target Look",
        "Stop Trigger Audio",
        "Color Lerp",
        "Color Tweak"];
    for (let i = 0; i < typesArray.length; i++) {
        if (typesArray[i] == selectedType) {
            types = types +
            "<option selected>" + typesArray[i] + "</option>";
        } else {
            types = types +
            "<option>" + typesArray[i] + "</option>";
        }
    }
    return types;
 }

 function ReturnListenToTimelineSelectors (selectedType) {
   
   if (timeKeysData != null && timeKeysData.listenTo != undefined) {
     timedEventsListenerMode = timeKeysData.listenTo;
   }
   if (selectedType == null && timedEventsListenerMode != null) { 
     selectedType = timedEventsListenerMode;
   }

  console.log("tryna return timeline listener mode " + selectedType +  " " + timedEventsListenerMode);
  let types = "";
  const typesArray = [
      "None",
      "Primary Audio",
      "Primary Video",
      "Youtube",
      "Scene DeltaTime"
      ];
  for (let i = 0; i < typesArray.length; i++) { 
    if (selectedType != null && selectedType != undefined) {  //if user selected
      if (typesArray[i].toLowerCase() == selectedType.toLowerCase()) {
          types = types +
          "<option selected>" + typesArray[i] + "</option>";
      } else {
          types = types +
          "<option>" + typesArray[i] + "</option>";
      }
      if (selectedType == "None") {
        timedEventsListenerMode = null;
      }
    } else {
      if (typesArray[i] == timedEventsListenerMode) {
        types = types +
        "<option selected>" + typesArray[i] + "</option>";
      } else {
          types = types +
          "<option>" + typesArray[i] + "</option>";
      }
    }
  }
  return types;
}

// function ReturnTransportButtons() {
//   return "<div class=\x22transport_buttons\x22><div class=\x22sslidecontainer\x22><input type=\x22range\x22 min=\x221\x22 max=\x22100\x22 value=\x221\x22 class=\x22sslider\x22 id=\x22mainTransportSlider\x22>"+
//           "</div><div id=\x22transportStats\x22 style=\x22color: black; float: left; margin: 5px 5px; text-align: left\x22></div>"+
//           "<div class=\x22next_button\x22 style=\x22float: right; margin: 5px 5px;\x22 onclick=\x22NextButton()\x22><i class=\x22fas fa-step-forward fa-2x\x22></i></div>"+
//           "<div class=\x22ffwd_button\x22 style=\x22float: right; margin: 5px 5px;\x22 onclick=\x22FastForwardButton()\x22><i class=\x22fas fa-forward fa-2x\x22></i></div>"+
//           "<div class=\x22play_button\x22 id=\x22transportPlayButton\x22 style=\x22float: right; margin: 5px 5px;\x22 onclick=\x22TransportPlayButton()\x22><i class=\x22fas fa-play-circle fa-2x\x22></i></div>" +
//           "<div class=\x22rewind_button\x22 style=\x22float: right; margin: 5px 5px;\x22 onclick=\x22RewindButton()\x22><i class=\x22fas fa-backward fa-2x\x22></i></div>"+
//           "<div class=\x22previous_button\x22 style=\x22float: right; margin: 5px 5px;\x22 onclick=\x22PreviousButton()\x22><i class=\x22fas fa-step-backward fa-2x\x22></i></div></div>";
// }

function AddTimekey() {
  let newTimekey = {};
  newTimekey.keystarttime = currentTime;
  newTimekey.keyduration = 5.0;
  newTimekey.keytype = "Beat";
  newTimekey.keydata = "";
  newTimekey.keytags = "";
  
  let tkTmp = [];

  if (timeKeysData == null) {
    timeKeysData = {};
    timeKeysData.timekeys = [];
  }
  if (timeKeysData.timekeys != undefined) {
     tkTmp = timeKeysData.timekeys;
  }
  tkTmp.push(newTimekey);
  // timeKeysData.timekeys = tkTmp;
  let tkObject = {};
   tkObject.listenTo = timedEventsListenerMode;
   tkObject.timekeys = tkTmp;
    console.log("timekeys: " + JSON.stringify(timeKeysData));
   // localStorage.setItem(room + "_timeKeys", JSON.stringify(vids[0].timekeys)); 
    //  timedEventsListenerMode = "Primary Video"
    //  localStorage.setItem(room + "_timeKeys", JSON.stringify(tkObject)); 
    localData.timedEvents = tkObject;
    console.log("localdata.timedevents " + JSON.stringify(localData.timedEvents));
   SetPrimaryAudioEventsData();
   SceneManglerModal('Events');
  //  ShowHideDialogPanel();
  // ShowTimekeysModal();
}

function ReturnFancyTimeString () {
  return fancyTimeString;  
}

function ShowTimekeysModal() {    //nerp, now in scenemanglermodal
  console.log("tryna SHowTImekyesMoodla");
  ShowHideDialogPanel();
  if (modalTimeStatsEl == null) {
    modalTimeStatsEl = $('#modalContent').find('#modalTimeStats');
  }

  if (tkStarttimes != null)  {
     
      let content = "<span id='modalCloser' onclick=\x22ShowHideDialogPanel()\x22 class='close-modal'>&times;</span><div><h3>Timed Events</h3><hr>" + //populate modal

      "<div class=\x22row\x22>"+

      "<button class=\x22snapButton\x22 style=\x22float:left;\x22 onclick=\x22AddTimekey()\x22>Add Timed Event Key</button>"+
      "<button class=\x22infoButton\x22 onclick=\x22SceneManglerModal('Tools')\x22>Settings</button>"+
      "<button class=\x22saveButton\x22 onclick=\x22SaveTimekeysToLocal()\x22>Save to Local Database</button>"+
     
      // "<button class=\x22deleteButton\x22 onclick=\x22PlayPauseMedia()\x22>Play/Pause Media</button>"+
      "<div class=\x22transport_buttons\x22><div class=\x22previous_button\x22 style=\x22float: left; margin: 10px 10px;\x22 onclick=\x22PreviousButton()\x22><i class=\x22fas fa-step-backward fa-2x\x22></i></div>"+
      "<div class=\x22play_button\x22 style=\x22float: left; margin: 10px 10px;\x22 onclick=\x22TransportPlayButton()\x22><i class=\x22fas fa-play-circle fa-2x\x22></i></div>" +
      "<div class=\x22next_button\x22 style=\x22float: left; margin: 10px 10px;\x22 onclick=\x22NextButton()\x22><i class=\x22fas fa-step-forward fa-2x\x22></i></div></div>"+

      "<div style=\x22float: right; width: 166px;\x22>Listen To Timeline:"+
      "<select id=\x22listenToTimelineSelector\x22 class=\x22listenToTimelineSelector\x22>" +
          ReturnListenToTimelineSelectors() +
          "</select>" +
      "</div>"+
      
      "<div class=\x22\x22 style=\x22margin: 10px;\x22 id=\x22modalTimeStats\x22>"+fancyTimeString+"</div>" +
   
      ReturnTimeKeys() +
      "</div>"+

      "</div>";
      ShowHideDialogPanel(content);
      
  }
}
let isPlaying = false;

// document.addEventListener('keyup', event => {
//   if (event.code === 'Space') {
//     console.log('Space pressed');
//     PlayPauseMedia();
//   }
// });

function PlayPauseMedia () {

  console.log("PlayPauseMedia listening to " + timedEventsListenerMode);
  if (timedEventsListenerMode != null) {
    if (timedEventsListenerMode.toLowerCase() == "primary audio") {
      // PlayPausePrimaryAudio();
      // if (primaryAudio)
      var primaryAudioControllerEl = document.getElementById("primaryAudio")
      if (primaryAudioControllerEl) {
        let primaryAudioController = primaryAudioControllerEl.components.primary_audio_control; 
        if (primaryAudioController) {
          let isPlaying = primaryAudioController.playPauseToggle(); //returns a bool 
          return isPlaying;
        }
      }
      
    } else if (timedEventsListenerMode.toLowerCase() == "primary video") {
      var videoControllerEl = document.getElementById('primary_video_0');  
        if (videoControllerEl != null) {
          console.log("gotsa video embedVideo");
          let videoController = videoControllerEl.components.vid_materials_embed;
          if (videoController) {
            console.log("gotsa primaryVideo " + videoController.current_player_state());
            // if (videoController.current_player_state() != "playing" ) {
            // playVideo();
            let isPlaying = videoController.togglePlayPauseVideo();
            if (isPlaying) {
              console.log("video is pllaying" + isPlaying);
              PauseIntervals(false);
              return true;
            } else {
              // pauseVideo();
              PauseIntervals(true);
              return false;
            }
          }
        }

    } else if (timedEventsListenerMode.toLowerCase() == "youtube") {
      if (youtubePlayer != null) {
        if (!youtubeIsPlaying) {
          console.log("tryna play youtube");
          PauseIntervals(false);
          youtubePlayer.playVideo();
          return true;
        } else {
          console.log("tryna pauze youtube");
          youtubePlayer.pauseVideo();
          PauseIntervals(true);
          return false;
        }
      } 
    }
  }

}

function ReturnTimeKeys() { 
  // if (timeKeysData != null) {
    // console.log("timedEvents:  " +JSON.stringify(timeKeysData));
    if (localData.timedEvents) {
      timeKeysData = localData.timedEvents;
      timedEventsListenerMode = timeKeysData.listenTo; 
    } else if (settings && settings.sceneTimedEvents) {
      timeKeysData = settings.sceneTimedEvents;
      timedEventsListenerMode = timeKeysData.listenTo; 
    }
    // console.log("timedEvents:  " +JSON.stringify(timeKeysData));
    if (timeKeysData != null && timeKeysData.timekeys != undefined && timeKeysData.timekeys != null && timeKeysData.timekeys.length > 0) {
      tkStarttimes.sort((a, b) => parseFloat(a.keystarttime) - parseFloat(b.keystarttime));
      timeKeysData.timekeys.sort((a, b) => parseFloat(a.keystarttime) - parseFloat(b.keystarttime));
      
      var tableHead = "<table id=\x22timekeyTable\x22 class=\x22display table table-striped table-bordered\x22 style=\x22width:100%\x22>" +
      "<thead>"+
      "<tr>"+
      "<th style=\x22color: white;\x22>Event Time</th>"+
      "<th style=\x22color: white;\x22>Duration</th>"+
      "<th style=\x22color: white;\x22>Type</th>"+
      "<th style=\x22color: white;\x22>Data</th>"+
      "<th style=\x22color: white;\x22>Tags</th>"+
      "<th></th>"+
      "</tr>"+
      "</thead>"+
      "<tbody>";
      var tableBody = "";
      var selectButton = "";
      for (var i = 0; i < timeKeysData.timekeys.length; i++) {
          // console.log(JSON.stringify(timekeys[i]));
          let theTimekey = timeKeysData.timekeys[i];
          // if (tkStarttimes.length == 1) {
          //   theTimekey = timeKeysData.timekeys[0];
          // } else {
          //   theTimekey = timeKeysData.timekeys.find(function(tk, index) { //kinda bad, what if 2 have same?
          //     if(tk.keystarttime == tkStarttimes[i]) {
          //         return true;
          //     }
          // });
          // } 
          let theLabel = "";
          if (theTimekey != null && theTimekey.keytags != undefined && theTimekey.keytags != null) {
            theLabel = theTimekey.label;
          }
          tableBody = tableBody +
          "<tr>" +
          // "<td>" + timekeys[i].keystarttime + "</td>" +
          // "<td>" + timekeys[i].keyduration + "</td>" +
          "<td><input type=\x22text\x22 class=\x22tk_start form-control\x22 id=\x22tk_start_" + i + "\x22 value=\x22" + fancyTimeFormat(theTimekey.keystarttime)+" / "+theTimekey.keystarttime + "\x22></td>" +
          "<td><input type=\x22text\x22 width=\x2210\x22 class=\x22tk_duration form-control\x22 id=\x22tk_duration_" + i + "\x22 value=\x22" + theTimekey.keyduration + "\x22></td>" +
          "<td>" + 
          "<select id=\x22tk_type_"+ i +"\x22 class=\x22tk_type form-control\x22>" +
            ReturnTimedEventSelectors(theTimekey.keytype) +
          "</select>" +
          "</td>" +
          
          "<td><input type=\x22text\x22 class=\x22tk_data form-control\x22 id=\x22tk_data_" + i + "\x22 value=\x22" + theTimekey.keydata + "\x22></td>" +
          "<td><input type=\x22text\x22 class=\x22tk_tags form-control\x22 id=\x22tk_tags_" + i + "\x22 value=\x22" + theTimekey.keytags + "\x22></td>" +
          // "<td><button class=\x22btn btn-xs btn-info\x22>Update</button><button class=\x22btn btn-xs btn-danger\x22>Remove</button></td>" +
          "<td><button class=\x22tk_rm btn btn-sm btn-danger\x22 id=\x22tk_rm_"+ i +"\x22>Remove</button></td>" +
          "</tr>";
      }
      var tableFoot =  "</tbody>" +
      "</table>";
      timeKeysHtml = tableHead + tableBody + tableFoot;
      return timeKeysHtml;
    } else {
        return "<br><br>No Timekeys Found";
    }
  // }
}

function ToggleTimeKeyUIListeners () {


}

function ReturnCurrentPlayerLocation() {
  return "<div>Current Location : "+JSON.stringify(window.playerPosition)+"</div>";
}



function InitLocalColors() {
  console.log("tryna InitLocalColors " + JSON.stringify(localData.settings));
  let enviroEl = document.getElementById('enviroEl');

  if (enviroEl != null && settings.allowMods && localData.settings.sceneColor1) {
      enviroEl.setAttribute('environment', {
        groundColor: localData.settings.sceneColor3,
        groundColor2: localData.settings.sceneColor4,
        dressingColor: localData.settings.sceneColor4,
        skyColor: localData.settings.sceneColor1,
        horizonColor: localData.settings.sceneColor2
      });
  }
  if (enviroEl != null && settings.allowMods && localData.settings.sceneEnvironmentPreset) {
    enviroEl.setAttribute('environment', 'preset', localData.settings.sceneEnvironmentPreset);
  }



}

function ColorMods(event, value) {
  console.log("colormods " + event.target);
    var source = event.target;
    if (source.id == "sceneColor1") {
        let enviroEl = document.getElementById('enviroEl');
        if (enviroEl != null) {
          console.log("setting sceneCOlor1 to " + value);
          enviroEl.setAttribute('environment', {skyColor: value.toString()});  
        }
        // localStorage.setItem(room + "_sceneColor1", value);
        sceneColor1 = value;
        localData.settings.sceneColor1 = value;
    } else if (source.id == "sceneColor2") {
        let enviroEl = document.getElementById('enviroEl');
        if (enviroEl != null) {
            enviroEl.setAttribute('environment', 'horizonColor', value);

        }
        // localStorage.setItem(room + "_sceneColor2", value);
        sceneColor2 = value;
        localData.settings.sceneColor2 = value;
    } else if (source.id == "sceneColor3") {
        let enviroEl = document.getElementById('enviroEl');
        if (enviroEl != null) {
            enviroEl.setAttribute('environment', 'groundColor', value);
        }
        // localStorage.setItem(room + "_sceneColor3", value);
        sceneColor3 = value;
        localData.settings.sceneColor3 = value;
    } else if (source.id == "sceneColor4") {
        let enviroEl = document.getElementById('enviroEl');
        if (enviroEl != null) {
            enviroEl.setAttribute('environment', 'groundColor2', value);
            enviroEl.setAttribute('environment', 'dressingColor', value);
        }
        // localStorage.setItem(room + "_sceneColor4", value);
        sceneColor4 = value;
        localData.settings.sceneColor4 = value;
    }
    // SaveLocalData();
 }
function GetUserInventory () {
  // let data = {};
  // data.fromScene = room;
  // data.userData = userData;
  let inventoryDisplayEl = document.getElementById('inventory_display');
  if (!userData.isGuest) {
    console.log("getuserprofile " + userData._id);
    let response = "<button class=\x22uploadButton \x22 style=\x22float: right;\x22 onclick=\x22DequipInventoryItem()\x22>Dequip</button>Items in player inventory:<br><hr>";
    var xhr = new XMLHttpRequest();
    xhr.open("get", '/user_inventory/' + userData._id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
    xhr.onload = function () {
      // do something to response
      // console.log("inventory resp: " +this.responseText);
      if (this.responseText != null && !this.responseText.toLowerCase().includes("no inventory")) {
        let inventoryObjs = JSON.parse(this.responseText);
        // console.log("inventory: " +inventoryObj.inventoryItems[0].objectName);
        userInventory = inventoryObjs;
        if (inventoryObjs != undefined) {
          let uniqueItems = [];
          // let itemNames = {}
          let itemCounts = {};
          let itemNames = {};

          for (let i = 0; i < inventoryObjs.inventoryItems.length; i++) {
            if (!uniqueItems.includes(inventoryObjs.inventoryItems[i].objectID)) {
              uniqueItems.push(inventoryObjs.inventoryItems[i].objectID);
              itemCounts[inventoryObjs.inventoryItems[i].objectID] = 1;
              itemNames[inventoryObjs.inventoryItems[i].objectID] = inventoryObjs.inventoryItems[i].objectName;
            } else {
              itemCounts[inventoryObjs.inventoryItems[i].objectID] = itemCounts[inventoryObjs.inventoryItems[i].objectID] + 1;
            }
            if ( i == inventoryObjs.inventoryItems.length - 1 ) {
              console.log("unique items in player inventory: " + JSON.stringify(uniqueItems) + " counts : " + JSON.stringify(itemCounts) + " names : " + JSON.stringify(itemNames));
              for (let u = 0; u < uniqueItems.length; u++) {
                let buttonNameString = itemNames[uniqueItems[u]] + " (" + itemCounts[uniqueItems[u]]+ ")";
                // console.log("buttonNameStirng: " + buttonNameString);
                response = response + "<button class=\x22btnInventory\x22 onclick=\x22ShowInventoryItem('"+uniqueItems[u]+"')\x22>"+buttonNameString+"</button>";
                inventoryDisplayEl.innerHTML = response;
              }
              
            }

            
            // response = response + "<a href=\x22\x22>"+inventoryObjs.inventoryItems[i].objectTitle + "</p>";
            // response = response +"<button class=\x22btn\x22 style=\x22padding: 5px; margin: 5px\x22 onclick=\x22ShowInventoryItem('"+inventoryObjs.inventoryItems[i].objectID+"')\x22>"+inventoryObjs.inventoryItems[i].objectName + "</button>";
            // console.log(response);
          }
        }
        // console.log("user inventory response " + response);
      }
    };
    let inviteInput = document.getElementById("emailContainer");
    if (inviteInput != null) {
       inviteInput.style.display = "block";
    }
  } else {
    inventoryDisplayEl.innerHTML = "You must be <a href=\x22../main/login.html\x22>logged in</a> to access your inventory <button class=\x22uploadButton \x22 style=\x22float: right;\x22 onclick=\x22DequipInventoryItem()\x22>Dequip</button>";
  }
  DisplayLocalFiles();
  
}

function DropInventoryItem(objectID) {
  console.log("tryna drop " + objectID);
  let action = null;
  let objexEl = document.getElementById('sceneObjects');
  if (objexEl != null) {
    objectData = objexEl.components.mod_objex.returnObjectData(objectID);
    // console.log("chekin objectData: " + JSON.stringify(objectData));
    if (objectData.actions != undefined && objectData.actions.length > 0) {
      for (let i = 0; i < objectData.actions.length; i++) {
        // console.log("ACTION " + JSON.stringify(objectData.actions[i]));
        if (objectData.actions[i].actionType.toLowerCase().includes("drop")) {
          action = objectData.actions[i];
          console.log(JSON.stringify(action));
          for (let i = 0; i < userInventory.inventoryItems.length; i++) {
            if (userInventory.inventoryItems[i].objectID == objectID) {
              // inventoryObj = userInventory[i];
              objexEl.components.mod_objex.dropInventoryObject(userInventory._id, action, userInventory.inventoryItems[i]);
              // ShowHideDialogPanel();
              break;
            }
          }
        break;
        }
      }
    }
  }
}

function DequipAndDropItem () {
  console.log("tryna dequip");
  let objexEl = document.getElementById('sceneObjects');
  if (objexEl != null) {
      
    document.querySelectorAll('.equipped').forEach(function(el) {
      let objectID = el.components.mod_object.data.objectData._id;

      el.removeAttribute("ammo-shape");
      el.removeAttribute("ammo-nody");
      el.parentNode.removeChild(el);
      objexEl.components.mod_objex.dropObject(objectID);
      
    });
  }
  // ShowHideDialogPanel();
}

function DequipInventoryItem () {
  console.log("tryna dequip");

  document.querySelectorAll('.equipped').forEach(function(el) {
    el.parentNode.removeChild(el);
  });
  ShowHideDialogPanel();
}

function EquipDefaultItem (objectID) {
  console.log("tryna equip " + objectID);
  let action = null;
  let objexEl = document.getElementById('sceneObjects');
  if (objexEl != null) {
    objectData = objexEl.components.mod_objex.returnObjectData(objectID);
    objexEl.components.mod_objex.equipInventoryObject(objectID);
    
  }
}
// function EquipDefaultItem (locObj) { //catch the whole locObj with size/rot data
//   console.log("tryna equip " + JSON.stringify(locObj));

//   let objexEl = document.getElementById('sceneObjects');
//   if (objexEl != null) {
//     objectData = objexEl.components.mod_objex.returnObjectData(objectID);
//     objexEl.components.mod_objex.equipInventoryObject(objectID);
    
//   }
// }

function EquipInventoryItem (objectID) {
  console.log("tryna equip " + objectID);
  let action = null;
  let objexEl = document.getElementById('sceneObjects');
  if (objexEl != null) {
    objectData = objexEl.components.mod_objex.returnObjectData(objectID);
    // console.log("chekin objectData: " + JSON.stringify(objectData));
    if (objectData.actions != undefined && objectData.actions.length > 0) {
      for (let i = 0; i < objectData.actions.length; i++) {
        console.log("ACTION " + JSON.stringify(objectData.actions[i]));
        if (objectData.actions[i].actionType.toLowerCase().includes("equip")) {
          action = objectData.actions[i];
          // console.log(JSON.stringify(action));
          for (let i = 0; i < userInventory.inventoryItems.length; i++) {
            if (userInventory.inventoryItems[i].objectID == objectID) {
              // inventoryObj = userInventory[i];
              objexEl.components.mod_objex.equipInventoryObject(objectID);
              ShowHideDialogPanel();
              break;
            }
          }
        break;
        } 
      }
    }
  }
}

function ShowInventoryItem(objectID) {
  let objexEl = document.getElementById('sceneObjects');
  let objectData = null;
    if (objexEl != null) {
      objectData = objexEl.components.mod_objex.returnObjectData(objectID);
    }

    if (objectData != null) {
      // console.log("found object " + objectData);
      // console.log("object data " + JSON.stringify(objectData));
      let response = "<button class=\x22addButton\x22 style=\x22float: right; padding: 10px; margin: 5px\x22 onclick=\x22ConsumeInventoryItem('"+objectData._id+"')\x22>Consume Item</button>"+
     
      "<button class=\x22uploadButton\x22 style=\x22float: right; padding: 10px; margin: 5px\x22 onclick=\x22InspectInventoryItem('"+objectData._id+"')\x22>Inspect Item</button>"+
      "<button class=\x22saveButton\x22 style=\x22float: right; padding: 10px; margin: 5px\x22 onclick=\x22DropInventoryItem('"+objectData._id+"')\x22>Drop Item</button>"+
      "<button class=\x22reallySaveButton\x22 style=\x22float: right; padding: 10px; margin: 5px\x22 onclick=\x22EquipInventoryItem('"+objectData._id+"')\x22>Equip Item</button>"+
      "Inventory Item: <hr><div class=\x22row\x22>"+
      "<div class=\x22twocolumn\x22><div style=\x22padding: 5px; margin: 5px\x22>Name: "+objectData.name+"</div><div style=\x22padding: 5px; margin: 5px\x22>Title: "+objectData.title+" </div>"+
      "<div style=\x22padding: 5px; margin: 5px\x22>Type: "+objectData.objtype+"</div><div style=\x22padding: 5px; margin: 5px\x22>Category: "+objectData.objcat+" </div>"+
      "<div style=\x22padding: 5px; margin: 5px\x22>Name: "+objectData.objsubcat+"</div><div style=\x22padding: 5px; margin: 5px\x22>Class: "+objectData.objclass+" </div>"+
      "</div>"+
    
      "<div class=\x22twocolumn\x22><div style=\x22padding: 5px; margin: 5px\x22>Description: "+objectData.description+" </div>"+
      "</div>"+
      "</div>";
      let inventoryDisplayEl = document.getElementById('inventory_display');
      inventoryDisplayEl.innerHTML = response;
    } else { //fetch and cache if we don't have the data for this object (i.e. it wasn't included in the scene)
      var xhr = new XMLHttpRequest();
      xhr.open("get", '/userobj/' + objectID, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send();
      xhr.onload = function () {
        // do something to response
        // console.log("fetched obj resp: " +this.responseText);
        objectData = JSON.parse(this.responseText);
        console.log("object data " + objectData);
        let response = "<button class=\x22addButton\x22 style=\x22float: right; padding: 10px; margin: 5px\x22 onclick=\x22ConsumeInventoryItem('"+objectData._id+"')\x22>Consume Item</button>"+
         "<button class=\x22uploadButton\x22 style=\x22float: right; padding: 10px; margin: 5px\x22 onclick=\x22ConsumeInventoryItem('"+objectData._id+"')\x22>Consume Item</button>"+
        "<button class=\x22saveButton\x22 style=\x22float: right; padding: 10px; margin: 5px\x22 onclick=\x22DropInventoryItem('"+objectData._id+"')\x22>Drop Item</button>"+
        "<button class=\x22reallySaveButton\x22 style=\x22float: right; padding: 10px; margin: 5px\x22 onclick=\x22EquipInventoryItem('"+objectData._id+"')\x22>Equip Item</button>"+
       
        "Inventory Item: <hr><div class=\x22row\x22>"+
        "<div class=\x22twocolumn\x22><div style=\x22padding: 10px; margin: 5px\x22>Name: "+objectData.name+"</div><div style=\x22padding: 5px; margin: 5px\x22>Title: "+objectData.title+" </div>"+
        "</div>"+
      
        "<div class=\x22twocolumn\x22><div style=\x22padding: 5px; margin: 5px\x22>Description: "+objectData.description+" </div>"+
        "</div></div>";
        let inventoryDisplayEl = document.getElementById('inventory_display');
        inventoryDisplayEl.innerHTML = response;
        if (objexEl != null) {
          objectData = objexEl.components.mod_objex.addFetchedObject(objectData); //add to scene object collection, so don't have to fetch again
        }
      }
    }
  // }
 

  
}
// function ClearInputs () { //hrm/// nah

//   var inputs = document.getElementsByTagName('input');

//   for (let i = 0; i < inputs.length; i++) {
//     inputs[i].onclick = function () {
//       this.value = null;
//     };
      
//     inputs[i].onchange = function () {
//       console.log("input changed "+ this.value);
//     };

//   }
// }
// window.addEventListener("load", InitColorInputs, false);
// function InitColorInputs() {
//   if (!colorInput_1) {
//     colorInput_1 = document.querySelector("#sceneColor1");
//     if (colorInput_1) {
//       console.log("ADDING COLOR PICKER EVENT LISTENER>...0");
//       colorInput_1.addEventListener("click", ColorUpdate, false);
//       colorInput_1.addEventListener("input", ColorUpdate, false);
//     }
  
//   }
//   // colorPicker1.addEventListener("change", updateAll, false);
//   // colorPicker.select();
// }
// function ColorUpdate (event) {
//   console.log("event color " + event.target.value);
//   event.target.value = null;
// }
function GreetingModal() {
  let content = document.getElementById(modalContentElID);
  let userName = document.getElementById('userName').innerHTML;
  let greeting = document.getElementById('sceneGreeting').innerHTML;
  console.log("greeting modal: " + greeting);
  $(content).html("<span id='modalCloser' onclick=\x22ShowHideDialogPanel()\x22 class='close-modal'>&times;</span><div><h3>" +userName + "!</h3><hr><p>" + greeting + "</p></div>");

}
function SceneManglerModal(mode, autoHide) {

    // ClearInputs();
    console.log("opening SceneManglerModal with location " + selectedLocationTimestamp);
    if (localData.settings.sceneColor1) {
      settings.sceneColor1 = localData.settings.sceneColor1;
    } else {
      localData.settings.sceneColor1 = settings.sceneColor1;
    }
    if (localData.settings.sceneColor2) {
      settings.sceneColor2 = localData.settings.sceneColor1;
    } else {
      localData.settings.sceneColor2 = settings.sceneColor2;
    }
    if (localData.settings.sceneColor3) {
      settings.sceneColor3 = localData.settings.sceneColor3;
    } else {
      localData.settings.sceneColor3 = settings.sceneColor3;
    }
    if (localData.settings.sceneColor4) {
      settings.sceneColor4 = localData.settings.sceneColor4;
    } else {
      localData.settings.sceneColor4 = settings.sceneColor4;
    }
    
    sceneColor1 = settings.sceneColor1;
    sceneColor2 = settings.sceneColor2;
    sceneColor3 = settings.sceneColor3;
    sceneColor4 = settings.sceneColor4;
    sceneEnvironmentPreset = settings.sceneEnvironmentPreset;
    // sceneEnvironmentPreset = 'none';
    // }
    // InitColorInputs();

    // let userName = userData.userName;
    // if (userName != null)
    let greeting = document.getElementById('sceneGreeting').innerHTML;
    let quest = document.getElementById('sceneQuest').innerHTML;
    let inventory = "";
    // console.log("inventory " + inventory);
    let audioSliders = document.getElementById('audioSliders').innerHTML;

    let locationTable = ReturnLocationTable();
    if (locationTable == null) {
        locationTable = "no locations are available";
    }
    let hasModsMessage = "<span id=\x22modMessage\x22 style=\x22float:right;\x22>No local mods found</span>";
    if (hasLocalData) {
      hasModsMessage = "<span id=\x22modMessage\x22 style=\x22color:pink; float:right;\x22>Local mods found!</span>";
    }
    let ownerButton = "";
    let sendAdminMessageButton = "";
    if (userData.sceneOwner == "indaehoose") {
        ownerButton = "<button class=\x22addButton\x22 id=\x22editButton\x22 onclick=\x22window.location='../main/?type=scene&iid="+userData.sceneID+"';\x22>Edit Scene</button>"+
        "<button style=\x22float: left;\x22 class=\x22reallySaveButton\x22 onclick=\x22SaveModsToCloud()\x22>Save to Cloud DB</button>";
        sendAdminMessageButton = "<button style=\x22float: left;\x22 class=\x22reallySaveButton\x22 onclick=\x22SendAdminMessage()\x22>Send Admin Message</button>";
    }
    let oculusButton = "<button style=\x22float: right;\x22 class=\x22addButton\x22 id=\x22oculusButton\x22><a href=\x22https://www.oculus.com/open_url/?url=https%3A%2F%2Fservicemedia.net/webxr/"+room+"\x22>Open on Oculus Quest</a></button>";
    let tabs ="<div class=\x22tab\x22>" +
    "<button class=\x22tablinks\x22 onclick=\x22TabMangler(event, 'Welcome')\x22>Welcome</button>"+
    // "<button class=\x22tablinks\x22 onclick=\x22TabMangler(event, 'Quests')\x22>Quests</button>"+
    
    "<button class=\x22tablinks\x22 onclick=\x22TabMangler(event, 'Messages')\x22>Messaging</button>"+
    "<button class=\x22tablinks\x22 onclick=\x22TabMangler(event, 'Inventory')\x22>Assets</button>"+
    "<button class=\x22tablinks\x22 onclick=\x22TabMangler(event, 'Tools')\x22>Settings</button>"+
    "<button class=\x22tablinks\x22 onclick=\x22TabMangler(event, 'Locations')\x22>Locations</button>"+
    "<button class=\x22tablinks\x22 onclick=\x22TabMangler(event, 'Events')\x22>Events</button>"+
    "<button class=\x22tablinks\x22 onclick=\x22TabMangler(event, 'About')\x22>About</button>"+

    "</div>";
    let welcomeDisplay = "";
    // let questsDisplay = "";
    let inventoryDisplay = "";
    let messagesDisplay = "";
    let locationsDisplay = "";
    let locationDisplay = "";
    let toolsDisplay = "";
    let eventsDisplay = "";
    let aboutDisplay = "";

    if (userData.isGuest) {

    }
    
    if (mode == "Welcome") { 
        welcomeDisplay = "style=\x22display: block;\x22";
    }

    if (mode == "Inventory") {
        inventoryDisplay = "style=\x22display: block;\x22";

    }
    if (mode == "Messages") {
        messagesDisplay = "style=\x22display: block;\x22";
    }    
    if (mode == "Locations") {
        locationsDisplay = "style=\x22display: block;\x22";
    }
    if (mode == "Location") {
        locationDisplay = "style=\x22display: block;\x22";
    } 
    if (mode == "Tools") {
        toolsDisplay = "style=\x22display: block;\x22";
    }
    if (mode == "Events") {
        eventsDisplay = "style=\x22display: block;\x22";
        ReturnTimeKeys();
    }
    if (mode == "About") {
      aboutDisplay = "style=\x22display: block;\x22";
    }

    // let users = document.getElementById('users').htmlContent;
    if (mode == "click") {
      ShowHideDialogPanel("<div>playing stream</div>");
    } else {
      let content = "<span id='modalCloser' onclick=\x22ShowHideDialogPanel()\x22 class='close-modal'>&times;</span>" +
                  "<div><span id=\x22modalTitle\x22><h3>Scene Mangler</h3></span>" + //populate modal
      tabs+
      "<div "+welcomeDisplay+" id=\x22Welcome\x22 class=\x22modalMain tabcontent\x22>" + ////////////////////WELCOME
        "<div><p>" + greeting + "</p></div>"+
        "<div><p>" + quest + "</p></div>"+
      "</div>"+    
      // "<div "+questsDisplay+" id=\x22Quests\x22 class=\x22modalMain tabcontent\x22>"+
      //   "<div><p>" + quest + "</p></div>"+
      // "</div>"+
      "<div "+inventoryDisplay+" id=\x22Inventory\x22 class=\x22modalMain tabcontent\x22>"+ /////////////////////INVENTORY
        "<div id=\x22inventory_display\x22><p>"+inventory+"</p></div><hr><br>"+

        // "Local Assets: <br> <br><div><label for=\x22file\x22 class=\x22form-label\x22>Select a file</label><input type=\x22submit\x22 value=\x22Save to Local DB\x22 class=\x22addButton floatRight\x22></div>"+
        // accept=\x22.txt\x22 onchange=\x22ImportMods(event)
        // "<label style=\x22float: left;\x22 for=\x22file-upload\x22 class=\x22custom-file-upload\x22>Import File</label>"+
        // "<h2>Local Files</h2>"+
            //  " <p>Note: These values are estimates calculated with Javascript.</p>" +
            "<p>Add files for this scene to your local browser database</p>" +
            "<button style=\x22float: left;\x22 class=\x22infoButton\x22 id=\x22importFileButton\x22>Select Local File</button>"+  
            
            "<button style=\x22float: left; visibility: hidden\x22 class=\x22saveButton\x22 id=\x22saveSelectedFileButton\x22>Add File to Local Database</button>"+  
            "<br><span id=\x22selectedFileName\x22>no file selected...</span>"+
            "<input type=\x22file\x22 id=\x22importFile\x22 >"+ 
        // "<div class=\x22floatRight\x22><input class=\x22custom-file-upload\x22 type=\x22file\x22 id=\x22file\x22></input></div>" +
        "<br><br><br><div class=\x22flex-container\x22 id=\x22localFilesContainer\x22></div>"+
        "<br><p>This browser has a storage quota of <b id=\x22storage-total\x22>0</b> <br>It currently uses <b id=\x22storage-used\x22>0</b> <br> and has around <b id=\x22storage-free\x22>0</b> free </p>" +
        // "<div><hr> <br><input type=\x22button\x22 value=\x22Clear files from Local DB\x22 id=\x22clear-button\x22 class=\x22deleteButton\x22></input></div>"+


      "</div>"+
      "<div "+messagesDisplay+" id=\x22Messages\x22 class=\x22modalMain tabcontent\x22>"+ /////////////////////MESSAGES
        // "<form id=\x22form\x22 id=\x22chat_form\x22>"+
        // "<span style=\x22float: left;\x22><h4>Message:</h4></span><span style=\x22float: left;\x22 id=\x22users\x22>"+stringRoomUsers+"</span>"+
        "<div id=\x22emailContainer\x22 style=\x22display: none;\x22><input class=\x22email_input\x22 id=\x22email_input\x22  type=\x22email\x22 placeholder=\x22Email to invite\x22></input>"+
        "<button class=\x22saveButton\x22 id=\x22sendInvitationButton\x22 onclick=\x22SendInvitation()\x22>Send Invitation</button></div><br>"+
        // "<a class=\x22saveButton\x22 id=\x22requestInvitationButton\x22 onclick=\x22SendInvitation()\x22>Request Invitation</a></div><br>"+
        // "<button class=\x22infoButton\x22 id=\x22sendMessageButton\x22><a href=\x22mailto:"+room+"@servicemedia.net\x22>Send Email</a></button>"+
        "<textarea class=\x22chat_input\x22 id=\x22chat_input\x22 type=\x22textarea\x22 style=\x22font-size:10pt;rows:4;cols:200;\x22 placeholder=\x22Message...\x22></textarea><br><br>"+
        "<br><span style=\x22float: left;\x22 id=\x22users\x22>"+stringRoomUsers+"</span>"+
        sendAdminMessageButton +
        "<button class=\x22saveButton\x22 id=\x22sendMessageButton\x22 onclick=\x22SendChatMessage()\x22>Send Chat</button><br>"+
        

        // "</form>"+
        "<div class=\x22\x22 id=\x22future\x22></div><br><br><br><br>" +
        "<p>scene mailbox: <a style=\x22color: lightblue;\x22 href=\x22mailto:"+room+"@servicemedia.net\x22>"+room+"@servicemedia.net</a></p>"+
      "</div>"+



      // "<div "+locationsDisplay+" id=\x22Locations\x22 class=\x22modalMain tabcontent\x22>"+
      // "<button class=\x22goToButton\x22 id=\x22nextButton\x22 onclick=\x22GoToNext()\x22>GoTo Next</button>"+
      // "<button class=\x22goToButton\x22 id=\x22prevButton\x22 onclick=\x22GoToPrevious()\x22>GoTo Previous</button>"+
      
      //   "<button style=\x22float:left\x22 class=\x22saveButton\x22 id=\x22CreateLocationButton\x22 onclick=\x22CreateLocation()\x22>New Local Placeholder</button>"+
      //   "<br><br><br><div>"+locationTable+"</div><br>"+
      // "</div>"+     

      "<div "+toolsDisplay+" id=\x22Tools\x22 class=\x22modalMain tabcontent\x22>"+ /////////////////TOOLS
      // "<div class=\x22\x22>"+
      "<div class=\x22row\x22>"+
      // oculusButton +
        // "<button class=\x22saveButton\x22 id=\x22exportButton\x22 onclick=\x22ExportMods()\x22>Export Mods</button>"+
        // "<label for=\x22file-upload\x22 class=\x22custom-file-upload\x22>Import Mods</label>"+
        // "<input type=\x22file\x22 id=\x22file-upload\x22 accept=\x22.txt\x22 onchange=\x22ImportMods(event)\x22></input>"+
          // ownerButton +
          // "<label style=\x22float: left;\x22 for=\x22importMods\x22 class=\x22custom-file-upload\x22>Import Mods</label>"+
          // "<input type=\x22file\x22 id=\x22file-upload2\x22 accept=\x22.txt\x22 onchange=\x22ImportMods(event)\x22>"+ 
          "<input type=\x22file\x22 id=\x22importMods\x22 accept=\x22.txt\x22>"+ 
          "<button style=\x22float: left;\x22 class=\x22infoButton\x22 id=\x22importModsButton\x22>Import Mods</button>"+  
          "<button style=\x22float: left;\x22 class=\x22saveButton\x22 id=\x22exportButton\x22 onclick=\x22ExportMods()\x22>Export Mods</button>"+   
          ownerButton +
          hasModsMessage +
        "<button style=\x22float: right;\x22 class=\x22goToButton\x22 id=\x22statsButton\x22 onclick=\x22ToggleStats()\x22>Show Stats</button>"+
        // "<button class=\x22goToButton\x22 id=\x22statsButton\x22 onclick=\x22ToggleStats()\x22>Show Raycasts</button>"+
        // "<button class=\x22goToButton\x22 id=\x22statsButton\x22 onclick=\x22ToggleStats()\x22>Show Colliders</button>"+
        // "<button class=\x22uploadButton\x22 id=\x22curvesButton\x22 onclick=\x22ToggleShowCurves()\x22>Show Curves</button>"+
        // "<div class=\x22row\x22><div class=\x22threecolumn\x22><label for=\x22sceneEnvironmentPreset\x22>Location Type</label>"+
        // "<select id=\x22sceneEnvironmentPreset\x22 name=\x22sceneEnvironmentPreset\x22>"+
        // ReturnAFrameEnviromentSelect(sceneEnvironmentPreset) + 
        // "</select></div>"+
      "</div><hr>"+
      // "<button class=\x22addButton\x22 id=\x22TimekeysButton\x22 onclick=\x22ShowTimekeysModal()\x22>Edit Timekeys</button>"+
      audioSliders +
      // ReturnColorButtons() +
      "<hr><div class=\x22row\x22><div class=\x22threecolumn\x22>"+
      "<label style=\x22margin: 10px;\x22 for=\x22sceneColor1\x22>Color 1</label>"+
      "<input type=\x22color\x22 class=\x22inputColor\x22 id=\x22sceneColor1\x22 name=\x22sceneColor1\x22 value=\x22"+sceneColor1+"\x22>"+

      "<label style=\x22margin: 10px;\x22 for=\x22sceneColor2\x22>Color 2</label>"+
      "<input type=\x22color\x22 class=\x22inputColor\x22 id=\x22sceneColor2\x22 name=\x22sceneColor2\x22 value=\x22"+sceneColor2+"\x22>"+
      
      "<label style=\x22margin: 10px;\x22 for=\x22sceneColor3\x22>Color 3</label>"+
      "<input type=\x22color\x22 class=\x22inputColor\x22 id=\x22sceneColor3\x22 name=\x22sceneColor3\x22 value=\x22"+sceneColor3+"\x22>"+
      
      "<label style=\x22margin: 10px;\x22 for=\x22sceneColor4\x22>Color 4</label>"+
      "<input type=\x22color\x22 class=\x22inputColor\x22 id=\x22sceneColor4\x22 name=\x22sceneColor4\x22 value=\x22"+sceneColor4+"\x22>"+


      "</div>"+
      // "<div class=\x22row\x22>
      "<div class=\x22threecolumn\x22 width=\x22100px\x22><label for=\x22sceneEnvironmentPreset\x22>Environment Preset</label>"+
      "<select id=\x22sceneEnvironmentPreset\x22 name=\x22sceneEnvironmentPreset\x22>"+
      ReturnSceneEnviromentPreset(sceneEnvironmentPreset) + 
      "</select></div>"+

      "<div class=\x22threecolumn\x22><label for=\x22sceneTagsField\x22>SceneTags</label>"+
      "<input type=\x22text\x22 id=\x22sceneTagsField\x22 name=\x22sceneTagsField\x22 value=\x22"+settings.sceneTags+"\x22>"+

      "</div></div>"+

      "<hr><div class=\x22row\x22>"+

      "<button class=\x22deleteButton\x22 id=\x22ClearAllPlaceholdersButton\x22 onclick=\x22DeleteLocalSceneData()\x22>Delete Local Scene Data</button>"+
      "<button style=\x22float: right;\x22 class=\x22addButton\x22 onclick=\x22SaveLocalAndClose()\x22>Save Local Scene Data</button>"+

      "</div>"+

      "</div>"+

      
      "<div "+locationsDisplay+" id=\x22Locations\x22 class=\x22modalMain tabcontent\x22>"+ /////////////LOCATIONS TABLE

      "<button class=\x22goToButton\x22 id=\x22nextButton\x22 onclick=\x22GoToNext()\x22>GoTo Next</button>"+
      "<button class=\x22goToButton\x22 id=\x22prevButton\x22 onclick=\x22GoToPrevious()\x22>GoTo Previous</button>"+
      ReturnCurrentPlayerLocation() +
      hasModsMessage +
        "<button style=\x22float:left\x22 class=\x22saveButton\x22 id=\x22CreateLocationButton\x22 onclick=\x22CreateLocation()\x22>Create New Location</button>"+
      
        "<br><br><br><div>"+locationTable+"</div><br>"+
        "<button style=\x22float:left\x22 class=\x22snapButton\x22 id=\x22CreateLocationButton\x22 onclick=\x22ToggleAllTransformControls()\x22>Toggle All Transform Controls</button>"+
      "</div>"+     


      "<div "+eventsDisplay+" id=\x22Events\x22 class=\x22tabcontent\x22>"+ 
          
        // let content = "<span id='modalCloser' onclick=\x22ShowHideDialogPanel()\x22 class='close-modal'>&times;</span><div><h3>Timed Events</h3><hr>" + //populate modal

        "<div class=\x22row\x22>"+

        "<button class=\x22snapButton\x22 style=\x22float:left;\x22 onclick=\x22AddTimekey()\x22>Add Timed Event Key</button>"+
        // "<button class=\x22infoButton\x22 onclick=\x22SceneManglerModal('Tools')\x22>Tools</button>"+
        "<button class=\x22saveButton\x22 onclick=\x22SaveTimekeysToLocal()\x22>Save (local)</button>"+
      
        // "<button class=\x22deleteButton\x22 onclick=\x22PreviousButton()\x22>Start</button>"+
        // "<button class=\x22deleteButton\x22 onclick=\x22RewindButton()\x22><<</button>"+
        // "<button class=\x22deleteButton\x22 onclick=\x22PlayPauseMedia()\x22>Play/Pause</button>"+
        // "<button class=\x22deleteButton\x22 onclick=\x22FastForwardButton()\x22>>></button>"+
        // "<button class=\x22deleteButton\x22 onclick=\x22NextButton()\x22>End</button>"+
        // "<div><div class=\x22previous_button\x22 style=\x22float: left; margin: 10px 10px;\x22 onclick=\x22PreviousButton()\x22><i class=\x22fas fa-step-backward fa-2x\x22></i></div>"+
        // "<div class=\x22play_button\x22 style=\x22float: left; margin: 10px 10px;\x22 onclick=\x22Play/Pause Media\x22><i class=\x22fas fa-play-circle fa-2x\x22></i></div>" +
        // "<div class=\x22next_button\x22 style=\x22float: left; margin: 10px 10px;\x22 onclick=\x22NextButton()\x22><i class=\x22fas fa-step-forward fa-2x\x22></i></div></div>"+

        "<div style=\x22float: right; width: 166px;\x22>Listen To Timeline:"+
        "<select id=\x22listenToTimelineSelector\x22 class=\x22listenToTimelineSelector\x22>" +
            ReturnListenToTimelineSelectors() +
            "</select>" +
        "</div>"+
        "<div>"+
        "<button class=\x22deleteButton\x22 onclick=\x22PreviousButton()\x22>Start</button>"+
        "<button class=\x22deleteButton\x22 onclick=\x22RewindButton()\x22><<</button>"+
            "<button class=\x22deleteButton\x22 onclick=\x22PlayPauseMedia()\x22>Play/Pause</button>"+
            "<button class=\x22deleteButton\x22 onclick=\x22FastForwardButton()\x22>>></button>"+
            "<button class=\x22deleteButton\x22 onclick=\x22NextButton()\x22>End</button>"+
            "<div class=\x22\x22 style=\x22margin: 20px; padding: 20px;\x22 id=\x22modalTimeStats\x22>"+ReturnFancyTimeString()+"</div>" +
            "</div>"+
            ReturnTimeKeys() +
            "</div>"+

          "</div>"+
          
          "<div "+aboutDisplay+" id=\x22About\x22 class=\x22modalMain tabcontent\x22>"+
              // "<p>"
              "<div>Use WASD keys to move, R to rise, F to fall. Click + drag to look<br>"+
              "Hold Shift key + click to modify elements, X key + click to create location, or T key + click for transform control mode<br>"+
              "In transform control mode: W translate | E rotate | R scale | X toggle X | Y toggle Y | Z toggle Z<br></div><br>"+
              "Attributions:" + 
              ReturnAttributions()+
              // "</div>"+
              "<p> This scene is powered by the <a href=\x22https://servicemedia.net\x22>ServiceMedia Network</a></p>"+
          "</div>"+

          "<div "+locationDisplay+" id=\x22Location\x22 class=\x22modalMain tabcontent\x22>"+ ///////////////////LOCATION SINGLE
              // "<div>test</div>"+
              ShowLocationModal(selectedLocationTimestamp) +
          "</div>"+     

          
          "</div>";
          // $('#modalContent').on('input', '#sceneColor1', function(e) {
          //   console.log("color 1 changed " + e.target.value);
          //   ColorMods(e, e.target.value);
          //   this.value = null;
          // });

          // $('#modalContent').on('input', '#sceneColor2', function(e) {
          //   console.log("color 2 changed " + e.target.value);
          //   ColorMods(e, e.target.value);
          //   this.value = null;
          // });
          // $('#modalContent').on('input', '#sceneColor3', function(e) {
          //   console.log("color 3 changed " + e.target.value);
          //   ColorMods(e, e.target.value);
          //   this.value = null;
          // });
          // $('#modalContent').on('input', '#sceneColor4', function(e) {
          //   console.log("color 4 changed " + e.target.value);
          //   ColorMods(e, e.target.value);
          //   this.value = null;
          // });

          showDialogPanel = false; //cause it's flipped
          if (!autoHide) {
            ShowHideDialogPanel(content);
            if (mode != "Location") {
              TabMangler(null, mode);
            } else {
              document.getElementById('modalTitle').innerHTML = "<h3>Location Details</h3>";
                // if (tagnameEl != null) {
                //     tagnameEl.style.display = "block";
                // }
            }
            GetUserInventory();
            InitLocalFiles();
          }
          InitPrimarySlider();
          InitAmbientSlider();
          InitTriggerSlider();
          
          
          // if (autoHide) {
          //   setTimeout(() =>  {
          //     ShowHideDialogPanel();
          //   }, 3000);
          // }

    }
}
// function GetLocalFiles() {
//   // console.log("tryna load local files");
//   // $('#localfiles').load("/connect/files.html", function() {
//   //   // alert( "Load was performed." );
   
    
//   // });
// }
function SaveLocalAndClose() {
  SaveLocalData();
  // ShowHideDialogPanel();
}

function ToggleStats () {
  // let sceneEl = document.querySelector('a-scene');
  let camEl = document.getElementById('cameraRig');
  if (camEl) {
    let initComponent = camEl.components.initializer;
    showStats = !showStats;
    // if (!showStats) {
      console.log("tryna show stats");

      // sceneEl.setAttribute('stats', '');
      initComponent.toggleStats(showStats);
  } else {
    console.log('noscene!');
  }
}
function ToggleShowCurves () {
  // let sceneEl = document.querySelector('a-scene');
  let curvesEl = document.getElementById("showCurves");
  if (curvesEl) {
    let camEl = document.getElementById('cameraRig');
    if (camEl) {
      let initComponent = camEl.components.initializer;
      showCurves = !showCurves;
      // if (!showStats) {
        console.log("trynashowCurves");
        initComponent.toggleShowCurves(showCurves);
    } else {
      console.log('noscene!');
    }
  }
}
function ShowHideDialogPanel (htmlString) {
//   console.log("tryna ShowHideDialogPanel " + window.sceneType + " htmlString: " + htmlString);
  
  if (window.sceneType == undefined) {
    window.sceneType = "modelviewer";
  
  }
  
  if (window.sceneType != null) {
  
  
    // console.log("showhide " + window.sceneType + " " + showDialogPanel + " " + dialogInitialized);
    if (theModal == null) {
      theModal = document.getElementById('theModal');
    } 
    // if (theRenderCanvas == null) {
      theRenderCanvas = document.getElementById('renderCanvas');  //with render-canvas aframe component attached, see above
    // }
    showDialogPanel = !showDialogPanel;

    if (showDialogPanel) { 
      // console.log("showDialogPanel is true!");
      if (!dialogInitialized) {
        var modalCloser = document.getElementById("modalCloser"); //or the close button
        if (modalCloser != null) {
          modalCloser.addEventListener('click', function() {
             theModal.style.display = "none";
             HideMobileKeyboard();
            });
        }
        dialogInitialized = true;
        if (theRenderCanvas != null) {
          theRenderCanvas.setAttribute('visible', true);

          theRenderCanvas.components.render_canvas.updatePosition();
        } else {
          console.log ("no renderPanel!");
        }
        // console.log("wtf is the window.sceneType???? " + window.sceneType);
        if (htmlString != null && htmlString != 'default') {
            let content = document.getElementById(modalContentElID);
            $(content).append(htmlString);
        } else if (window.sceneType.includes('Text Adventure')) {
          console.log("ok, tryna TTL..");
          // StartTeletypeMessage();
          GetTextItems();
          
          } else {
            let content = document.getElementById(modalContentElID);
            let userName = document.getElementById('userName').innerHTML;
            let greeting = document.getElementById('sceneGreeting').innerHTML;
            console.log("GREETING: " + greeting);
            $(content).html("<span id='modalCloser' onclick=\x22ShowHideDialogPanel()\x22 class='close-modal'>&times;</span><div><h3>" +userName + "!</h3><hr><p>" + greeting + "</p></div>");

            // console.log("userName: " + userName);
            // const iframe = document.createElement( 'iframe' );
            // iframe.style.width = '480px';
            // iframe.style.height = '360px';
            // iframe.style.border = '0px';
            // iframe.src = 'https://www.youtube.com/embed/VGUUfKoGQc4';
            // let iframe = "<iframe width=\x22560\x22 height=\x22315\x22 src=\x22https://www.youtube.com/embed/VGUUfKoGQc4\x22 title=\x22YouTube video player\x22 frameborder=\x220\x22 allow=\x22accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\x22 allowfullscreen></iframe>";
            // div.appendChild( iframe );
            // let greetingString = 
            
          } 

        } else {
            if (htmlString != null && htmlString != 'default') {
                let content = document.getElementById(modalContentElID);
                $(content).html(htmlString);
            } else {
                let content = document.getElementById(modalContentElID);
                  let userName = document.getElementById('userName').innerHTML;
                  let greeting = document.getElementById('sceneGreeting').innerHTML;
                  console.log("GREETING: " + greeting);
                  $(content).html("<span id='modalCloser' onclick=\x22ShowHideDialogPanel()\x22 class='close-modal'>&times;</span>"+
                  "<div><h3>" +userName + "!</h3><hr><p>" + greeting + "</p></div>");
            }
        }
            // !dialogInitialized end
        // if (document.getElementById('renderCanvas') != null) {
        if (theRenderCanvas != null) {  

          theRenderCanvas.components.render_canvas.updatePosition();
        theRenderCanvas.setAttribute('visible', true);
        //  theRenderCanvas.setAttribute('position', worldPos.x, worldPos.y - 5, worldPos.z);
        } else {
          theModal.style.display = "block";
          theModal.style.zIndex = 100;
        } 
      } else {
        console.log("showDialogPanel is false!");
        // ShowAll(); //everything hidden when modal is shown
        if (document.getElementById('renderCanvas') != null) {
        theRenderCanvas.setAttribute('visible', false);

          //theRenderCanvas.style.display = "none";
        } else {
          theModal.style.display = "none";
          theModal.style.zIndex = -100;
        }
      }
    }
  }
//forked from https://github.com/keyvank/teletype.js
function teletype(element, callback) {

      var enabled = false;
      this.disable = function() {
        enabled = false;
      }
      this.enable = function() {
        enabled = true;
      }
    
      var fake_textarea = document.createElement("textarea");
      fake_textarea.style.position = 'absolute';
      fake_textarea.style.left = '-999999px';
      fake_textarea.opacity = '0';
      fake_textarea.setAttribute('autocorrect','off');
      fake_textarea.setAttribute('autocapitalize','off');
      element.appendChild(fake_textarea);
    
      element.addEventListener('focus', function() { fake_textarea.focus(); });
    
      element.setAttribute('tabindex', '0');
      element.style.lineHeight = element.style.fontSize;
      element.style.wordBreak = 'break-all';
      element.style.overflowWrap = 'break';
      element.style.boxSizing = 'border-box';
      element.style.paddingBottom = element.style.fontSize;
    
      var that = this;
      var input = '';
    
      var queue = [];
      var printing = false;
    
      this.printHTML = function(html, options = {}, _go = false, _node = null, _printed = '') {
        if (!_go && _printed == '') {
          if (printing) {
            queue.push([html, options]);
            return;
          } else if (options.wait) {
            printing = true;
            setTimeout(that.printHTML, options.wait, html, options, true, _printed);
            return;
          }
        }
        if (options.delay && html.length > 0) {
          printing = true;
          var i = 0;
          var prnt = '';
          if (!_node) {
            _node = document.createElement("span");
            element.appendChild(_node);
          }
          if (html[0] == '<') {
            prnt += '<';
            while (i < html.length && html[i] != '>') {
              i++;
              prnt += html[i];
            }
            _printed += prnt;
            _node.innerHTML = _printed;
          } else if (html[0] == '&') {
            prnt += '&';
            while (i < html.length && html[i] != ';') {
              i++;
              prnt += html[i];
            }
            _printed += prnt;
            _node.innerHTML = _printed;

          } else {
            _printed += html[i];
            _node.innerHTML = _printed;
          }
          teletype.scrollBottom(element);
          setTimeout(that.printHTML, options.delay, html.substr(i + 1), options, true, _node, _printed);
          // playSound();//THIS ONE
        } else {
          if(!_node)
            element.insertAdjacentHTML('beforeend', html);
          printing = false;
          if (options.enable) {
            enabled = true;
          }
          if (queue.length > 0) {
            var job = queue.shift();
            setTimeout(that.printHTML, job[1].wait, job[0], job[1], true);
          }
        }
      }
    
      this.printText = function(text, style, options = {}) {
        var html = teletype.encodeHTML(text);
        
        if (style)
          that.printHTML("<span style='" + style + "'>" + html + "</span>", options);
        else
          that.printHTML(html, options);
      }
    
      this.clear = function() {
        input = '';
        element.innerHTML = '';
        element.appendChild(fake_textarea);
        fake_textarea.focus();
        teletype.scrollBottom(element);
      }
      var prompt_node = null;
      function onchar(char) {
        if (!enabled)
          return false;
        //playSound();
        if (char == 13 || char == 10) { // Enter
          command_cache.push(input);
          command_cache_position = command_cache.length;
          element.insertAdjacentHTML('beforeend', '<br>');
          callback(teletype.decodeHTML(input));
          input = '';
          prompt_node = null;
          teletype.scrollBottom(element);
          return false;
        } else if (char == 8) { // Backspace
          if (input.length > 0) {
            var decode = teletype.decodeHTML(input);
            input = teletype.encodeHTML(decode.slice(0, -1));
            prompt_node.innerHTML = input.toUpperCase();
            return false;
          }
        } else {
          if(!prompt_node) {
            prompt_node = document.createElement('span');
            element.appendChild(prompt_node);
          }
          var html = teletype.encodeHTML(String.fromCharCode(char));
          input += html;
          prompt_node.innerHTML = input.toUpperCase();
          teletype.scrollBottom(element);
          return false;
        }
      }
    
      var fake_textarea_length = 0;
      fake_textarea.addEventListener('input', function(e) {
        var new_length = e.target.value.length;
        if(new_length == fake_textarea_length - 1)
          onchar(8);
        else if(new_length == fake_textarea_length + 1)
          onchar(e.target.value.charCodeAt(new_length - 1));
        fake_textarea_length = e.target.value.length;
      });
    
      var command_cache = [];
      var command_cache_position = null;
      fake_textarea.addEventListener('keydown', function(e) {
        if (!enabled)
          return false;
        if (e.keyCode == 38 || e.keyCode == 40) { // Arrow keys
          var changed = false;
          if (e.keyCode == 38 && command_cache_position > 0) {
            changed = true;
            command_cache_position--;
          } else if (e.keyCode == 40 && command_cache_position < command_cache.length - 1) {
            changed = true;
            command_cache_position++;
          }
          if (changed) {
            if(!prompt_node) {
              prompt_node = document.createElement('span');
              element.appendChild(prompt_node);
            }
            input = command_cache[command_cache_position]
            prompt_node.innerHTML = input;
          }
          return false;
        }
        return true;
      });
    }
    
    teletype.scrollBottom = function(element) {
      element.scrollTop = element.scrollHeight;
    }
    teletype.encodeHTML = function(text) {
      var div = document.createElement("div");
      div.innerText = text;
      return div.innerHTML;
    }
    teletype.decodeHTML = function(html) {
      var div = document.createElement("div");
      div.innerHTML = html;
      return div.innerText;
    }

function playSound(){
    var audio = document.createElement('audio');
    audio.style.display = "none";
    audio.src = 'http://mvmv.us.s3.amazonaws.com/sites/chickenwaffle/gunterquiz/btn_click.mp3';
    audio.autoplay = true;
    audio.volume = .1;
    audio.onended = function(){
        audio.remove() //Remove when played.
    };
    document.body.appendChild(audio);
}

// 
var GetTextItems = function() { //make a different method for aframe? 

  let textDataEl = document.getElementById("sceneTextData");
  if (textDataEl) {
    let textIDs = textDataEl.getAttribute("data-attribute");
    console.log("TEXtITEMS AHOY!" + textIDs + " length " + textIDs.length);
    let tempArray = []; 
    if (!textIDs.indexOf(",") == -1) { //make sure to send request with an array
      tempArray[0] = textIDs;
    } else {
      tempArray = textIDs.split(",");
    }
    var posting = $.ajax({
      url: "/scene_text_items",
      type: 'POST',
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({
            // uname: uName,
            // upass: uPass
            // param2: $('#textbox2').val()
            textIDs: tempArray //just send the ids
          }),
        success: function( data, textStatus, xhr ){
            // console.log(JSON.parse(data[i].textstring));
            let arr = [];
            for (let i = 0; i < data.length; i++) {
              console.log(JSON.parse(data[i].textstring));
              arr.push(JSON.parse(data[i].textstring)); //textstring should be a valid json, from defined template
            }
            // return arr;
            // textItemArray = arr;
            // PlayDialogLoop(arr);
            // var r = data.replace(/["']/g, ""); //cleanup
            // var resp = r.split('~'); //response is tilde delimited
            // Cookies.set('_id', resp[0], { expires: 7 });
            // $('#response pre').html( "logged in as " + resp[1] );
            // cookie = Cookies.get();
            // location.href = "./index.html";
            console.log(JSON.stringify(arr));
            StartTeletypeMessage(arr);
        },
        error: function( xhr, textStatus, errorThrown ){
            console.log( xhr.responseText );
            return null;
            // $('#theForm').html( 'Sorry, something went wrong: \n' + xhr.responseText);
            // Cookies.remove('_id');
            }
        });
  }
}

var StartTeletypeMessage = function (theArray) {
    // textItems = document.getElementById("text_items");
    // if (text_items)
   //by the time we're done below, textItemArray will be popped
    // let theArray = GetTextItems();

    // if (theArray != undefined && theArray.length > 0) {
    console.log("tryna StartTeletypeMessage " + theArray);
    if (modalContentElID == 'modalContent') {      
      theModal = document.getElementById('theModal');
      theModal.style.display = "block";
    }
    // theModal.style.display = "block";
    var element = document.getElementById(modalContentElID);
    // renderPanel = document.getElementById('renderPanel');
    // var element = document.createElement("div"); 
    // element.classList.add('message-box');
    // theModal.style.display = "block";
    // element.id = 'modal-content';
    var tty = new teletype(element, function(str) {
      console.log(str);
        if (str.length > 0) {
        tty.disable();
        if (str.toUpperCase().includes("Y") || str.toUpperCase().includes("OK") || str.toUpperCase().includes("SURE")) {
            // GetDialogs()
            if (theArray != null) {
               PlayDialogLoop(theArray); 
            } else {
              tty.printText("ERROR GETTING DIALOGZ!?!",'color:white', {delay:50, wait:1000});
            }
           
        } else {
            // GetScores();
            tty.printText("OK MAYBE LATER THANKS BYE!",'color:white', {delay:50, wait:1000});
        }
      }
    });
    tty.disable();
    

    // tty.printText("Hi!\n",'', {delay:50, wait:1000});
    // tty.printText("\nWould you like to play a game?\n",'', {delay:50, wait:1000});
    tty.printText("\n\nWOULD YOU LIKE TO PLAY A GAME?",'color:white', {delay:50, wait:1000});
    tty.printText("\n", 'color:blue', {wait:1000,delay:50,enable:true});
    // renderPanel.innerHTML = "\n\nWOULD YOU LIKE TO PLAY A GAME?";
    element.focus(); //TODO test for desktop
  
  
    // } else {
  //   var tty = new teletype(element, function(str) {
  //     console.log(str);
  //     // tty.disable();
  //     tty.printText("ERROR GETTING DIALOGZ!?!",'', {delay:50, wait:1000});
  //   });
  // }
  // });

    // tty.printText("\n", '', {wait:1000,delay:50,enable:true});
  // }
}
var FinalMessage = function() {
    var element = document.getElementById(modalContentElID); 
    var tty = new teletype(element, function(str) {
        console.log(str);
        tty.disable();
        if (str.includes("@") && str.includes(".")) { //needs to be an email, or close...
            //PostScore(scoreTotal, str);//
            tty.printText("\n\n" + "NOW YOUR EMAIL ARE BELONG TO US!",'color:white', {delay:50, wait:1000});
        } else {
            FinalFinalMessage();
        }
    });
    tty.disable();
  
    tty.printText("\n\n" + "GREAT JOB PLAYER! YOUR TOTAL SCORE IS " + scoreTotal + ".\n  ENTER YOUR EMAIL TO SAVE SCORE",'color:white', {delay:50, wait:1000});
    tty.printText("\n", '', {wait:1000,delay:50,enable:true});
    element.focus(); // TODO test for desktop
} 
var FinalFinalMessage = function() {
    var element = document.getElementById(modalContentElID); 
    var tty = new teletype(element, function(str) {
        console.log(str);
        tty.disable();
        if (str.includes("@") && str.includes(".")) {
          tty.printText("\n\n" + "NOW YOUR EMAIL ARE BELONG TO US!",'color:red', {delay:50, wait:1000});
        } else {
            FinalFinalMessage();
        }
    });
    tty.disable();
   
    tty.printText("\nYOU MUST ENTER YOUR EMAIL ADDRESS TO SAVE SCORE",'color:white', {delay:50, wait:1000});

    tty.printText("\n", '', {wait:1000,delay:50,enable:true});
    element.focus();
}

// document.body.addEventListener('click', GetDialogs, true); 
var scoreTotal = 0;
var x = 0;
var HideKeyboard = function() {
	document.activeElement.blur();
	$("input").blur();
};
var PlayDialogLoop = function(arr) {
    ShowDialog(arr[x],function(){
        x++;
        if(x < arr.length) {
            PlayDialogLoop(arr);   
        } else {
            setTimeout(FinalMessage, 2000);
        }
    }); 
  }

  function ShowDialog(dialog, callback) {
        console.log(dialog);
        var element = document.getElementById(modalContentElID);
        
        var tty = new teletype(element, function(inputString) {

          console.log(inputString);
          tty.disable();
          HideKeyboard(); 
          var score = Math.floor(Math.random() * (200 - 100 + 1)) + 100;
          let isCorrect = false;
          let answerValue = 0;
          let responseValue = 0;
          for (let i = 0; i < dialog.answers_correct.length; i++) {
            if (inputString.toUpperCase() == dialog.answers_correct[i].item.toUpperCase()) {//TODO maybe includes, or regex?(:())
              // tty.printText("\n" + dialog.response_correct[i].toUpperCase() + "! + " + score + " POINTS", 'color:white', {wait:1000,delay:50});
              // scoreTotal += score;
              // setTimeout(callback, 1000 + (dialog.response_correct.length * 10));
              isCorrect = true;
              answerValue = dialog.answers_correct[i].value; 
              // value = i;
            } 
          }
          if (isCorrect) {
            // let isMatch = false;
            for (let a = 0; a < dialog.responses_correct.length; a++)  {
              if (answerValue == dialog.responses_correct[a].value) {
                tty.printText("\n" + dialog.responses_correct[a].item.toUpperCase() + "! + " + score + " POINTS", 'color:lightblue', {wait:1000,delay:50});
                scoreTotal += score;
                setTimeout(callback, 1000 + (dialog.responses_correct[a].item.length * 10));
              } else {
                // tty.printText("\n! nilch", 'color:white', {wait:1000,delay:50});
              }
            }
          } else {
            let isMatch = false;
            for (let j = 0; j < dialog.answers_incorrect.length; j++) {
              if (inputString.toUpperCase() == dialog.answers_incorrect[j].item.toUpperCase()) {
                isMatch = true
                responseValue = dialog.answers_incorrect[j].value; 
              } 
            }
            if (isMatch) {
              console.log("checking incorrect response value " + responseValue);
              for (let n = 0; n < dialog.responses_incorrect.length; n++)  {
                if (responseValue == dialog.responses_incorrect[n].value) {
                  tty.printText("\n" + dialog.responses_incorrect[n].item.toUpperCase() + "! - " + score + " POINTS", 'color:pink', {wait:1000,delay:50});
                  scoreTotal -= score;
                  setTimeout(callback, 1000 + (dialog.responses_incorrect[n].item.length * 10));
                } else {
                  // tty.printText("\nNOT TRUE!", 'color:white', {wait:1000,delay:50});
                  // setTimeout(callback, 1000 + (10 * 10));
                }
              }
            } else {
              tty.printText("\nINCORRECT", 'color:pink', {wait:1000,delay:50});
              setTimeout(callback, 1000 + (10 * 10));
            }
            // tty.printText("\n" + dialog.responses_correct[value].item.toUpperCase() + "! + " + score + " POINTS", 'color:white', {wait:1000,delay:50});
            // scoreTotal += score;
            // setTimeout(callback, 1000 + (dialog.responses_correct[value].item.length * 10));
            // // iResponses = dialog.responses_incorrect.split("~");
            // var response = iResponses[Math.floor(Math.random()*iResponses.length)];
            // tty.printText("\n" + response.toUpperCase() + " - " + score + " POINTS", 'color:red', {wait:1000,delay:50});
            // scoreTotal -= score;
            // setTimeout(callback, 1000 + (response.length * 10));
          }
          
        });
        tty.disable();

        tty.printText("\n\n" + dialog.question.toUpperCase(),'color:white', {delay:50, wait:2000});
        tty.printText("\n", 'color:red', {wait:100,delay:50,enable:true}); //enable:true = user input
        element.focus(); //TODO test for desktop
        // }
    }

    async function processArray(array) {
    for (const item of array) {
        await delayedLog(item);
    }
    console.log('Done!');
    }


    function DisplayLocalFiles() {
      const galleryContainer = document.getElementById('localFilesContainer');
      // console.log("tryna display local files");
      if (galleryContainer) {
        galleryContainer.innerHTML = '';
        for (const file in localData.localFiles) {
          let type = "image";
          let ext = localData.localFiles[file].name.split('.');
          ext = ext[ext.length - 1];
          console.log("gotsa file: "+ JSON.stringify(file));
        // let key = Object.keys(file);
        //   console.log("object name for file is " + key[0]);
        if (ext == "jpg" || ext == "png" || ext == "glb") {
          if (ext == "glb") {
            // console.log("gotsa file: GLB " + localData.localFiles[file].data);
            type = "gltf model";
            const modelBuffer = localData.localFiles[file].data;
            const modelBlob = new Blob([modelBuffer]);
            const card = document.createElement('div');
            card.classList.add('card');
          
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');
          
            // const modelViewer = document.createElement('model_viewer');
            const modelViewer = document.createElement('a-scene');
            modelViewer.setAttribute('embedded', '');
            modelViewer.setAttribute('xr-mode-ui', {'enabled': false});
            modelViewer.style.width = '300px';
            modelViewer.style.height = '200px';
            
            const model = document.createElement("a-entity");
            // modelViewer.setAttribute("webxr", {});
            // modelViewer.setAttribute("a-scene", "embedded");
            // image.setAttribute("touch-action", "pan-y");
            
            modelViewer.classList.add('card-img-top');
            // image.setAttribute("camera-controls");
          

            const title = document.createElement('div');
            title.classList.add('card-title');
            title.innerText = "name: " + localData.localFiles[file].name + "\nsize: " + formatAsByteString(parseInt(localData.localFiles[file].size))  + "\ntype: " + type;
          
          
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('btn', 'btn-danger');
            deleteButton.innerText = 'Delete';
            deleteButton.addEventListener('click', () => {
              DeleteFile(localData.localFiles[file].name);
            });
            const addToSceneButton = document.createElement('button');
            addToSceneButton.classList.add('btn', 'btn-danger');
            addToSceneButton.innerText = 'Add to Scene';
            addToSceneButton.addEventListener('click', () => {
              // addToScene(localData.localFiles[file].name);
              CreateLocation("local_" + localData.localFiles[file].name, 'model');
            });
            

            cardBody.appendChild(title);
            // cardBody.appendChild(subTitle);
            // cardBody.appendChild(text)
            cardBody.appendChild(deleteButton);
            cardBody.appendChild(addToSceneButton);
            modelViewer.appendChild(model);
            card.appendChild(modelViewer);
            card.appendChild(cardBody);
            
            // col.appendChild(card);
          
            galleryContainer.appendChild(card);
            model.setAttribute("gltf-model", URL.createObjectURL(modelBlob));
            model.setAttribute("position", "0 1 -2");
            // modelViewer.src = URL.createObjectURL(modelBlob);
            // model.setAttribute("model_viewer", {"gltfModel": URL.createObjectURL(modelBlob)});
            // modelViewer.setAttribute("camera-controls", "");
            // modelViewer.setAttribute("auto-rotate", "");
            // modelViewer.setAttribute("touch-action", "pan-y");
          } else {
            const imageBuffer = localData.localFiles[file].data;
            const imageBlobb = new Blob([imageBuffer]);
          
            // const col = document.createElement('div');
            // col.classList.add('col-12', 'col-md-6', 'col-lg-4');
            // col.classList.add('galleryContainer');
          
            const card = document.createElement('div');
            card.classList.add('card');
          
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');
          
            const image = document.createElement('img');
            image.src = URL.createObjectURL(imageBlobb);
            image.classList.add('card-img-top');
          

            const title = document.createElement('div');
            title.classList.add('card-title');
            title.innerText = "name: " + localData.localFiles[file].name + "\nsize: " + formatAsByteString(parseInt(localData.localFiles[file].size)) + "\ntype: " + localData.localFiles[file].type;
          
            // const subTitle = document.createElement('h6');
            // subTitle.classList.add('card-subtitle');
            // subTitle.innerText = formatAsByteString(+localData.localFiles[file].size)
          
            // const text = document.createElement('p');
            // text.classList.add('card-text');
            // text.innerText = localData.localFiles[file].name;
          
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('btn', 'btn-danger');
            deleteButton.innerText = 'Delete';
            deleteButton.addEventListener('click', () => {
              DeleteFile(localData.localFiles[file].name);
            })
            const addToSceneButton = document.createElement('button');
            addToSceneButton.classList.add('btn', 'btn-danger');
            addToSceneButton.innerText = 'Add to Scene';
            addToSceneButton.addEventListener('click', () => {
              CreateLocation("local_" + localData.localFiles[file].name, 'picture');
            });
            
            cardBody.appendChild(title);
            // cardBody.appendChild(subTitle);
            // cardBody.appendChild(text)
            cardBody.appendChild(deleteButton);
            cardBody.appendChild(addToSceneButton);
            card.appendChild(image);
            card.appendChild(cardBody);
            // col.appendChild(card);
          
            galleryContainer.appendChild(card);
          }
        } else {
          console.log("invalid file type!");
        }
      }
    } else {
      console.log("can't find container!");
    }
    }

    function dropHandler(ev) {
      console.log("File(s) dropped");
    
      // Prevent default behavior (Prevent file from being opened)
      ev.preventDefault();
    
      if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        [...ev.dataTransfer.items].forEach((item, i) => {
          // If dropped items aren't files, reject them
          if (item.kind === "file") {
            const file = item.getAsFile();
            console.log(`… file[${i}].name = ${file.name}`);
          }
        });
      } else {
        // Use DataTransfer interface to access the file(s)
        [...ev.dataTransfer.files].forEach((file, i) => {
          console.log(`… file[${i}].name = ${file.name}`);
        });
      }
    }