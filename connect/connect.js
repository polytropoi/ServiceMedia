var room = window.location.pathname.split("/").pop(); //just the string after last slash (short code)
// var player = document.getElementById("player");
// var posRotReader = document.getElementById("player").components.get_pos_rot; 
var player = null;
var posRotReader = null;
var dateString = Date.now().toString();
let roomUsers = {};
let stringRoomUsers = "";
var trimmedString = dateString.substring(dateString.length - 4, 4);
var username;
var pics = [];
var picsBuffer = [];
var picArrayIndex = 0;
var currentIndex = 0;
let avatarName = document.querySelector(".avatarName").id; //make this actual uid?  
// let avatarName = "";
let playFrames = false;
let isConnected = false;
let userData = {};
let mySocketID = "";
let emitInterval = null;
let lastPosition = "";
let lastRotation = "";
let cameraPosition = {"x" : 0, "y": 0, "z": 0};
let cameraRotation = {"x" : 0, "y": 0, "z": 0};
var sceneEl = document.querySelector('a-scene');
let skyboxEl = document.getElementById('skybox');
let posRotRunning = false;
let timeKeysData = {};
let tkStarttimes = [];
let sceneLocations = {locations: [], locationMods: []};
let poiLocations = [];
let cloudMarkers = [];
let sceneModels = [];
let sceneObjects = [];
let localKeys = [];
let sceneColor1 = '#000000';
let sceneColor2 = '#000000';
let sceneColor3 = '#000000';
let sceneColor4 = '#000000';
let sceneColor1Alt = '#000000';
let sceneColor2Alt = '#000000';
let sceneColor3Alt = '#000000';
let sceneColor4Alt = '#000000';
let volumePrimary = 0;
let volumeAmbient = 0;
let volumeTrigger = 0;
let settings; //push this to an aframe component for fetching...
let currentLocationIndex = -1;
let currentTime = 0;  //depends on listenerMode
let fancyTimeString = "";
let modalTimeStatsEl = null; //stats for timekeys modal
let transportTimeStatsEl = null;
// let sceneType = null;
let attributions = [];
let uiVisible = true;
let pauseLoops = false;
let matrixClient = null;
// let vidz = null;
// let videoEl = null;

let mouseDownStarttime = 0;
let mouseDowntime = 0;

var token = document.getElementById("token").getAttribute("data-token"); 
// var localtoken = localStorage.getItem("smToken"); //rem all localstorage!
let socketHost = "http://localhost:3000";
// let socketHost = null;
var socket = null; //the socket.io instance below
// let cloudData = {};
let localData = {locations:[], settings:{}};
let locationTimestamps = [];
let hasLocalData = false;
let transformAll = false;

let currentLocalStorageUsed = null;
let currentAvailableLocalStorageEstimage = null;



$('a-entity').each(function() {  //external way of getting click duration for physics

   $(this).bind('mousedown', function() {
     mouseDownStarttime = Date.now() / 1000;
   });
   $(this).bind('mouseup', function() {
     mouseDowntime = (Date.now() / 1000) - mouseDownStarttime;

   });
   $(this).bind('touchstart', function() {
      mouseDownStarttime = Date.now() / 1000;
    });
    $(this).bind('touchend', function() {
      mouseDowntime = (Date.now() / 1000) - mouseDownStarttime;

    });
    $(this).bind('beforexrselect', e => {
      e.preventDefault();
    });
 
 });

//////////////////////indexedDB functions...
function InitIDB() {
   console.log("tryna connect to SMXR indexeddb");
   if (!('indexedDB' in window)) {
      console.log("This browser doesn't support IndexedDB");
      return;
    }
   const request = indexedDB.open("SMXR", 1);
   request.onerror = (event) => {
      console.error("could not connect to iDB " + event);
      return "error"
   };
   request.onupgradeneeded = function () {
      const db = request.result;
      const store = db.createObjectStore("scenes", { keyPath: "shortID" });
      store.createIndex("scene", ["scene"], { unique: true }); //multientry true?
    };
   request.onsuccess = function () {
      console.log("Database opened successfully");
      const db = request.result;
      const transaction = db.transaction("scenes", "readwrite");
      const store = transaction.objectStore("scenes");
      const loadTimeStamp = Date.now();
      const lastSceneUpdate = null;
     
      //first check if there are localmods, version saved with tilde
      // const modQuery = store.get(room + "~"); //nope
      const modQuery = store.openCursor(room + "~"); //use cursor mode so it's iterable below
      modQuery.onsuccess = function (e) {
         var cursor = e.target.result;
         console.log("query for localData : " + e.target.result);
         // if (e.target.result) {
            if (cursor) {
               hasLocalData = true;

               for (let i = 0; i < cursor.value.locations.length; i++) { //mod or create the scene elements
               // let loc = JSON.stringify(cursor.value.locations[i]);
               console.log("cursor " + i + " of " + cursor.value.locations.length);
               // sceneLocations.locations = [];
               // localData.locations = [];
               localData.locations.push(cursor.value.locations[i]);

               let cloudEl = document.getElementById(cursor.value.locations[i].timestamp);
               if (cloudEl) { //prexisting elements (cloud_marker, mod_model, mod_object) already rendered onload
                  //TODO get the component and update with mods, if any...
                  // console.log("gotsa element with id " + JSON.stringify(localData.locations[i]));
                  // let obj = cloudEl.getObject3D('mesh');
                  // obj.position.set({x: cursor.value.locations[i].x, y: cursor.value.locations[i].y, z: cursor.value.locations[i].z });
                  // obj.rotation.set({x: cursor.value.locations[i].eulerx, y: cursor.value.locations[i].eulery, z: cursor.value.locations[i].eulerz });
                  // obj.scale.set({x: cursor.value.locations[i].markerObjScale, y: cursor.value.locations[i].markerObjScale, z: cursor.value.locations[i].markerObjScale});
                  cloudEl.setAttribute("position", {x: cursor.value.locations[i].x, y: cursor.value.locations[i].y, z: cursor.value.locations[i].z });
                  cloudEl.setAttribute("rotation", {x: cursor.value.locations[i].eulerx, y: cursor.value.locations[i].eulery, z: cursor.value.locations[i].eulerz });
                  cloudEl.setAttribute("scale", {x: cursor.value.locations[i].markerObjScale, y: cursor.value.locations[i].markerObjScale, z: cursor.value.locations[i].markerObjScale});


               } else {//local-only elements, not saved to cloud yet
                  // setTimeout(function () { //prevent overload...
                     let localEl = document.createElement("a-entity");
                     sceneEl.appendChild(localEl);
                     // let position = 
                     localEl.setAttribute("position", {x: cursor.value.locations[i].x, y: cursor.value.locations[i].y, z: cursor.value.locations[i].z });
                     localEl.setAttribute("rotation", {x: cursor.value.locations[i].eulerx, y: cursor.value.locations[i].eulery, z: cursor.value.locations[i].eulerz });
                     localEl.setAttribute("scale", {x: cursor.value.locations[i].markerObjScale, y: cursor.value.locations[i].markerObjScale, z: cursor.value.locations[i].markerObjScale});
                     //hrm, sniff for type and attach appropriate component...
                     // if (cursor.value.locations[i].markerType )
                     localEl.setAttribute("local_marker", {timestamp: cursor.value.locations[i].timestamp,
                                                            name: cursor.value.locations[i].name, 
                                                            tags: cursor.value.locations[i].tags, 
                                                            eventData: cursor.value.locations[i].eventData, 
                                                            markerType: cursor.value.locations[i].markerType,
                                                            position: {x: cursor.value.locations[i].x, y: cursor.value.locations[i].y, z: cursor.value.locations[i].z},
                                                            rotation: {x: cursor.value.locations[i].eulerx, y: cursor.value.locations[i].eulery, z: cursor.value.locations[i].eulerz },
                                                            scale: {x: cursor.value.locations[i].markerObjScale, y: cursor.value.locations[i].markerObjScale, z: cursor.value.locations[i].markerObjScale}
                                                         });
                     localEl.id = cursor.value.locations[i].timestamp.toString();
                  // }, 100 * i);
               }
               locationTimestamps.push(cursor.value.locations[i].timestamp); //hrm
               } 
              
               for (let key in cursor.value.settings) {
                  localData.settings[key] = cursor.value.settings[key]; //TODO apply each one?

               }
               cursor.continue(); 
               
            } else {
               console.log("cursor is done...or was empty");
            }
         // } else {
         //    // console.log("query failed!");
         // }
         transaction.oncomplete = function () {
            db.close();
            // UpdateSceneLocations();]
            if (localData.locations.length == 0) { //copy the cloudData if there was no localdb
               console.log("copying localData.locations...");
               for (let i = 0; i < sceneLocations.locations.length; i++) {
                  if (locationTimestamps.indexOf(sceneLocations.locations[i].timestamp) == -1) {
                     // localData.locations.push(sceneLocations.locations[i]);
                  }
                  // localData.locations.push(sceneLocations.locations[i]);
              }
            }
            console.log("COPIED LOCALDATA locations length " + localData.locations.length);
          }
      };
      modQuery.onerror = function () {
         console.log("no localdata found in IDB, query error");
         
      }
      request.oncomplete = function () {
         // db.close(); 
         // UpdateLocationData();
      }
   }
}
function UpdateSceneLocations () {
   // console.log("localdata : " + JSON.stringify(localData));
   for (let i = 0; i < sceneLocations.locations.length; i++) {
      let ts = locationTimestamps.indexOf(sceneLocations.locations[i].timestamp); //avoid having to doubleloop
      console.log("checking locIDs " + sceneLocations.locations[i].timestamp + " index " + ts);
      if (ts != -1) {
         console.log("updating sceneLocation : " + JSON.stringify(sceneLocations.locations[i]) + " to " + JSON.stringify(localData.locations[ts]));
         sceneLocations.locations.splice(i, 1, localData.locations[ts]);

         console.log(JSON.stringify(sceneLocations.locations));
      }
   }
}

function SaveCloudData() { //do this after checking/loading any localData, just for reference (it's already set as global via location_data and settings)
   console.log("tryna connect to SMXR indexeddb");
   if (!('indexedDB' in window)) {
      console.log("This browser doesn't support IndexedDB");
      return;
    }
   const request = indexedDB.open("SMXR", 1);
   request.onerror = (event) => {
      console.error("could not connect to iDB " + event);
      return "error"
   };
   request.onupgradeneeded = function () {
      const db = request.result;
      const store = db.createObjectStore("scenes", { keyPath: "shortID" });
      store.createIndex("scene", ["scene"], { unique: true });
    };
    request.onsuccess = function () {
      console.log("Saving local data, IDB opened successfully");
      const db = request.result;
      const transaction = db.transaction("scenes", "readwrite");
      const store = transaction.objectStore("scenes");
      const loadTimeStamp = Date.now();
      const lastSceneUpdate = null;
      let scene = {};
      scene.shortID = room; //with tilde = the local version
      scene.settings = settings;
      scene.locations = sceneLocations.locations;
      scene.lastUpdate = loadTimeStamp;
      store.put(scene); //write the local version
      transaction.oncomplete = function () {
        db.close();
        console.log("CloudData saved to IDB");
         // InitLocalData();
      };
   };
}

function SaveLocalData() {  //persist mods an alt "~" version of the data
   console.log("tryna connect to SMXR indexeddb");
   if (!('indexedDB' in window)) {
      console.log("This browser doesn't support IndexedDB");
      return;
    }
   const request = indexedDB.open("SMXR", 1);
   request.onerror = (event) => {
      console.error("could not connect to iDB " + event);
      return "error"
   };
   request.onupgradeneeded = function () {
      const db = request.result;
      const store = db.createObjectStore("scenes", { keyPath: "shortID" });
      store.createIndex("scene", ["scene"], { unique: true });
    };
    request.onsuccess = function () {
      console.log("Saving local data, IDB opened successfully");
      const db = request.result;
      const transaction = db.transaction("scenes", "readwrite");
      const store = transaction.objectStore("scenes");
      const loadTimeStamp = Date.now();
      const lastSceneUpdate = null;
      let scene = {};
      scene.shortID = room + "~"; //with tilde = the local version
      scene.settings = localData.settings;
      scene.locations = localData.locations;
      // scene.locations = JSON.parse(JSON.stringify(sceneLocations.locations));
      scene.lastUpdate = loadTimeStamp;
      console.log("writing localdata " + JSON.stringify(scene));
      store.put(scene); //write the local version
      transaction.oncomplete = function () {
        db.close();
        console.log("localdata saved!");
        hasLocalData = true;
         // InitLocalData();
      };
   };
   }
   function DeleteLocalSceneData() {  //persist mods an alt "~" version of the data

      console.log("tryna connect to SMXR indexeddb");
      if (!('indexedDB' in window)) {
         console.log("This browser doesn't support IndexedDB");
         return;
      }
      const request = indexedDB.open("SMXR", 1);
      request.onerror = (event) => {
         console.error("could not connect to iDB " + event);
         return "error"
      };
      request.onupgradeneeded = function () {
         const db = request.result;
         const store = db.createObjectStore("scenes", { keyPath: "shortID" });
         store.createIndex("scene", ["scene"], { unique: true });
      };
      request.onsuccess = function () {
         console.log("tryna delete indexedDB localdata for this scene!");
         const db = request.result;
         const transaction = db.transaction("scenes", "readwrite");

         let deleterequest = transaction.objectStore("scenes").delete(room + "~");
         deleterequest.onerror = function () {
            console.log("cain't delete localdatas!?!?");
         }
      
         // report that the data item has been deleted
         transaction.oncomplete = () => {
         console.log("sceneData deleted - reload to confirm!");
         setTimeout(function () {
            window.location.reload();
         }, 2000);

         };
      };

   //    $.confirm({
   //       title: 'Confirm!',
   //       content: 'Delete local changes to this scene?',
   //       buttons: {
   //           confirm: function () {
   //             console.log("tryna connect to SMXR indexeddb");
   //             if (!('indexedDB' in window)) {
   //                console.log("This browser doesn't support IndexedDB");
   //                return;
   //             }
   //             const request = indexedDB.open("SMXR", 1);
   //             request.onerror = (event) => {
   //                console.error("could not connect to iDB " + event);
   //                return "error"
   //             };
   //             request.onupgradeneeded = function () {
   //                const db = request.result;
   //                const store = db.createObjectStore("scenes", { keyPath: "shortID" });
   //                store.createIndex("scene", ["scene"], { unique: true });
   //             };
   //             request.onsuccess = function () {
   //                console.log("tryna delete indexedDB localdata for this scene!");
   //                const db = request.result;
   //                const transaction = db.transaction("scenes", "readwrite");

   //                let deleterequest = transaction.objectStore("scenes").delete(room + "~");
   //                deleterequest.onerror = function () {
   //                   console.log("cain't delete localdatas!?!?");
   //                }
               
   //                // report that the data item has been deleted
   //                transaction.oncomplete = () => {
   //                console.log("sceneData deleted - reload to confirm!");
   //                setTimeout(function () {
   //                   window.location.reload();
   //                }, 2000);

   //                };
   //             };
   //           },
   //           cancel: function () {
   //               // $.alert('Canceled!');
   //           },
   //       }
   //   });

   }
   
/////////////////// main onload function below, populate settings, etc.
$(function() { 
   // InitIDB();

   player = document.getElementById("player");
   // player = document.getElementById("cameraRig");
   let settingsEl = document.getElementById('settingsDataElement'); //volume, color, etc...
   let theSettingsData = settingsEl.getAttribute('data-settings');
   // if (localData.settings) {
   //    settings = localData.settings;
   // } else {
      settings = JSON.parse(atob(theSettingsData)); 
   // }
   // console.log("last_page was " + localStorage.getItem("last_page") + " servertoken: "+ token + " localtoken: " + localtoken + " userdata.sceneOwner " + userData.sceneOwner);
   
   setTimeout(function () {
      // localStorage.setItem("last_page", room);
      tcheck(); //token auth

      // InitIDB();
   }, 1000);
   if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
      ShowEnableEthereumButton();
   } else {

   }


   // console.log("RAW LOCATIOND DATA " + theData);
   //big pile of params
   // let settingsAFrame = createElement("a-entity")
   // let audioGroupsEl = null;
   // console.log("settings " + JSON.stringify(settings));

   if (settings.sceneTimedEvents != undefined && settings.sceneTimedEvents != null) {
      timeKeysData = settings.sceneTimedEvents;
      console.log("timekeys Dqata: " + JSON.stringify(timeKeysData));
      // localStorage.setItem(room + '_timeKeys', JSON.stringify(timeKeysData));
      

      // console.log('cloud timekeysdata' + JSON.stringify(timeKeysData));
      timedEventsListenerMode = timeKeysData.listenTo;  
   } 
   // else if (localStorage.getItem(room + "_timeKeys") != null) { //use local ve3rsion if saved
   //    // timeKeysData = JSON.parse(localStorage.getItem(room + "_timeKeys"));
   //    console.log('local timeKeysData' + JSON.stringify(timeKeysData));
   //    timedEventsListenerMode = timeKeysData.listenTo;  
   // }

   // AddLocalMarkers();
   vidz = document.getElementsByTagName("video");
   if (vidz != null && vidz.length > 0) { //either video or audio, not both...?
      videoEl = vidz[0];
      console.log("videoEl " + videoEl.id);
   }
   // this.statsDiv = document.getElementById("transportStats");
   // document.getElementsByTagName('a-sky')[0].setAttribute('radius', 400); //nope!?!   

   console.log("room: " +room + " vid " + settings.sceneVideoStreams + " type " + settings.sceneType);

   $('#room_id').append($('<button><h4><strong>').text("Welcome to scene " + room).append("</strong></h4></button>"));
   if (settings.sceneType == "Default" || settings.sceneType == "AFrame" || settings.sceneType == "default" || settings.sceneType == "aframe") {
      // window.sceneType == "aframe";
      if (settings.hideAvatars) {
         player.setAttribute("player_mover", "init");
         EmitSelfPosition();
      }
      posRotReader = document.getElementById("player").components.get_pos_rot; 
      if (player != null) {
         player.setAttribute("player_mover", "init");
      }
      let modelDataEl = document.getElementById('sceneModels');
      if (modelDataEl) {
         let modelData = modelDataEl.getAttribute('data-models');
         sceneModels = JSON.parse(atob(modelData)); //convert from base64
         // console.log("sceneModels " + JSON.stringify(sceneModels));
         for (let i = 0; i < sceneModels.length; i++) {
            if (sceneModels[i].sourceText != undefined && sceneModels[i].sourceText != 'undefined' && sceneModels[i].sourceText != null && sceneModels[i].sourceText.length > 0) {
               attributions.push("Name: " + sceneModels[i].name + " - Type: " + sceneModels[i].item_type + " - Source: " + sceneModels[i].sourceText);
            }
         }
      }
      // console.log("settings: " + JSON.stringify(settings));
      if (settings.skyboxIDs != null) {
         
         skyboxEl = document.createElement('a-entity');
         sceneEl = document.querySelector('a-scene');
         skyboxEl.setAttribute('skybox_dynamic', {enabled: true, id: settings.skyboxIDs[0]});
         skyboxEl.id = 'skybox_dynamic';
         sceneEl.appendChild(skyboxEl);
         
      }
   
      if (settings.skyboxID == "") {
         // skyboxEl.components.skybox_dynamic.nextSkybox();
      }
      if (settings.audioGroups && settings.audioGroups.objectGroups && settings.audioGroups.objectGroups.length > 0 || 
         settings.audioGroups && settings.audioGroups.triggerGroups && settings.audioGroups.triggerGroups.length > 0 || 
         settings.audioGroups && settings.audioGroups.ambientGroups && settings.audioGroups.ambientGroups.length > 0 ||
         settings.audioGroups && settings.audioGroups.primaryGroups &&  settings.audioGroups.primaryGroups.length > 0) {
         // audioGroupsEl = document.getElementById('audioGroupsEl');
         // if (audioGroupsEl != null) {
         //    let audioGroupsController = audioGroupsEl.components.audio_groups_control;
         //    if (audioGroupsController != null) {
         //       audioGroupsController.LoadAudioGroups(settings.audioGroups);
         //    }
         // }
         // audioGroupsEl.components.audio_groups_control.LoadAudioGroups(settings.audioGroups);
         let audioGroupsEl = document.createElement('a-entity');
         audioGroupsEl.setAttribute("id","audioGroupsEl");
         audioGroupsEl.setAttribute("audio_groups_control", {init: ''});
         sceneEl.appendChild(audioGroupsEl);
      }
   }
   if (settings.useMatrix) {
      console.log("Loading browser MATRIX sdk!!!");
      GetMatrixData();
   }
   if (settings.clearLocalMods) { //??????
      for (var i=0; i < localStorage.length; i++)  {
      
         let theKey = localStorage.key(i);
         if (theKey.includes(room) && theKey.includes("localmarker")) {
            localStorage.removeItem(theKey);
            console.log("removed " + theKey);
         }
      }
   }

   if (settings.networking == 'SocketIO' && settings.socketHost) {
      if (settings.socketHost.length > 6) { //i.e. not "none" or empty
         socketHost = settings.socketHost;
         InitSocket();
      }
   }

   let sceneGreetingDialogEl = document.getElementById("sceneGreetingDialog");
   if (sceneGreetingDialogEl) {
      let sgdialogComponent = sceneGreetingDialogEl.components.scene_greeting_dialog;
      if (sgdialogComponent) {
         sgdialogComponent.initMe();
      }
   }

   if (settings.sceneType == "Video Landing" && settings.sceneVideoStreams && settings.sceneVideoStreams.length) {
      SetVideoEventsData();
      var video = document.getElementById('video');
      if (Hls.isSupported()) {
        var hls = new Hls({
          debug: true,
        });
      //   hls.loadSource('/hls/' + vid);
        hls.loadSource(settings.sceneVideoStreams[0]);
        hls.attachMedia(video);
        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
          // video.muted = true;
          video.play();
        });
      }
      // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
      // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element throught the `src` property.
      // This is using the built-in support of the plain video element, without using hls.js.
      else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = '/hls/'+ vid;
      //   video.addEventListener('canplay', function () {
      //     video.play();
      //   });
      }
   }

   let primaryAudioEventData = document.getElementById("audioEventsData");
   if (primaryAudioEventData) {
      SetPrimaryAudioEventsData();
   }

   sceneEl = document.querySelector('a-scene');

   if (settings.allowMods) {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
            navigator.storage.estimate().then(({usage, quota}) => {
            currentLocalStorageUsed = usage;
            currentAvailableLocalStorageEstimage = quota;
            console.log(`Using ${usage} out of ${quota} bytes.`);
         });
      }
   }
   if (settings.sceneScatterObjectLayers) {
      console.log("objectScatterLayers: " + JSON.stringify(settings.sceneScatterObjectLayers));
   }
   // this.asky = document.getElementsByTagName('a-sky')[0];
   // if (this.asky && settings) {
   //   console.log("tryna mod asky radius " + settings.sceneSkyRadius);
   //   // this.asky1 = this.askies[0];
   //   this.asky.setAttribute("radius", settings.sceneSkyRadius);
   //   let skybox = document.getElementById("skybox");
   //   if (skybox) {
   //     let skyrad = settings.sceneSkyRadius - 2;
   //     console.log("tryna mod asky radius " + skyrad);
   //     skybox.setAttribute("radius", skyrad); //in case using reflection and enviro is on..
   //   } else {
   //     let skyboxD = document.getElementById("skybox_dynamic");
   //     if (skyboxD) {
   //       let skyradD = settings.sceneSkyRadius - 2;
   //       console.log("tryna mod asky radius " + skyradD);
   //       skyboxD.setAttribute("radius", skyradD); //in case using reflection and enviro is on..
   //     }
   //   }
   // }
});
function GetMatrixData() {
   if (!matrixClient) {
      matrixClient = matrixcs.createClient("https://matrix.org");
   }
   matrixClient.publicRooms(function (err, data) { //this pulls a ton of data, so I randomly trim out all but 1000 elements below
      if (err) {
         console.error("err %s", JSON.stringify(err));
         return;
      }
      console.log("Congratulations! The matrix client got " + data.chunk.length + " rooms.");
      let matrixMeshEl = document.getElementById("matrix_meshes");
      if (matrixMeshEl != null) {
         matrixMeshComponent = matrixMeshEl.components.matrix_meshes;
         if (matrixMeshComponent != null) {  
            let length = data.chunk.length;
            let trimToLength = 5000;
            let trimmedLength = length - trimToLength;
            let trimmedIndexes = [];
            let randomIndex = 0;
            for (let i = 0; i < trimmedLength; i++) {
               randomIndex = Math.floor(Math.random()*data.chunk.length);
               // console.log("pushing randomIndex " + randomIndex);
               // trimmedIndexes.push(randomIndex);
               data.chunk.splice(randomIndex, 1)
               if (i === trimmedLength - 1) {
                  //sweeeet...
                  // matrixMeshComponent.loadRoomData(data.chunk.splice(trimmedIndexes, 1)); 
                  matrixMeshComponent.loadRoomData(data);   

               }
            } 
           
         }
         // matrixMeshEl.components.matrix_meshes.loadRoomData(data);
      }
      });
   // }
}

function MediaTimeUpdate (fancyTimeString) {
   // console.log("MediaTimeUpdate " + fancyTimeString);
   // transportTimeStatsEl = document.getElementById("transportStats");
   if (transportTimeStatsEl == null) {
      transportTimeStatsEl = document.getElementById("transportStats");
   } else {
      transportTimeStatsEl.innerHTML = fancyTimeString;
   }
   modalTimeStatsEl = document.getElementById('modalTimeStats');
   if (modalTimeStatsEl == null) {
      } else {
         modalTimeStatsEl.innerHTML = fancyTimeString;
      }
      
   }
// function AddTimekey() {
//    let newTimekey = {};
//    newTimekey.keystarttime = currentTime;
//    newTimekey.keyduration = 5.0;
//    newTimekey.keytype = "Beat Mid";
//    newTimekey.keydata = "";
//    newTimekey.keylabel = "New Timed Event";
//    let tkTmp = [];
//    if (timeKeysData.timekeys != undefined) {
//       tkTmp = timeKeysData.timekeys;
//    }
//    tkTmp.push(newTimekey);
//    // timeKeysData.timekeys = tkTmp;
//    let tkObject = {};
//     tkObject.listenTo = timedEventsListenerMode;
//     tkObject.timekeys = tkTmp;
//     // localStorage.setItem(room + "_timeKeys", JSON.stringify(vids[0].timekeys)); 
//    //  timedEventsListenerMode = "Primary Video"
//     localStorage.setItem(room + "_timeKeys", JSON.stringify(tkObject)); 
//    ShowTimekeysModal();
//  }

      // $('#modalContent').on('change', '#locationModel', function(e) { //value has phID ~ modelID
      //    console.log('model ' + e.target.value);
      //    let locSplit = e.target.value.split("~"); 
      //    if (locSplit[1].length > 4) { //should be "none" if no model selected
      //       let locSplit = e.target.value.split("~"); //split between localstorage key and modelID
      //       let localStorageItem = JSON.parse(localStorage.getItem(locSplit[0]));
      //       if (localStorageItem != null) {
      //          for (let i = 0; i < sceneModels.length; i++) {
      //             if (sceneModels[i]._id == locSplit[1]) {
      //                let locItemTemp = {modelID: sceneModels[i]._id, model: sceneModels[i].name};
      //                let locItem = Object.assign(localStorageItem, locItemTemp); //funky object merge!
      //                // locItem.modelID = sceneModels[i]._id;
      //                // locItem.model = sceneModels[i].name;
      //                if (locItem.scale == null || locItem.scale == undefined || locItem.scale == "") {
      //                   locItem.scale = 1;
      //                }
      //                console.log(JSON.stringify(locItem));
      //                localStorage.setItem(locSplit[0], JSON.stringify(locItem));
      //                console.log(localStorage.getItem(locSplit[0]));
      //                let placeholderEl = document.getElementById(locSplit[0]);

      //                console.log("placeholderEl" +placeholderEl);
      //                let phComponent = placeholderEl.components.cloud_marker;
      //                if (phComponent == null) {
      //                   phComponent = placeholderEl.components.local_marker;
      //                }
      //                if (phComponent != null) {
      //                   phComponent.loadModel(sceneModels[i]._id);
      //                }
      //             }
      //          }
      //       }
      //    } else {
      //       // let locSplit = e.target.value.split("~"); //split between localstorage key and modelID
      //       let localStorageItem = JSON.parse(localStorage.getItem(locSplit[0]));
      //       let placeholderEl = document.getElementById(locSplit[0]);
      //       let phComponent = placeholderEl.components.cloud_marker;
      //       if (phComponent == null) {
      //          phComponent = placeholderEl.components.local_marker;
      //       }
      //       if (phComponent != null) {
      //          phComponent.loadModel("none");
      //       }
      //    }
      // });

      // $('#modalContent').on('change', '#locationMarkerType', function(e) {
      //    console.log('type ' + e.target.value);
      // });

      // $('#modalContent').on('change', '.tk_type', function(e) {
      //    console.log('type ' + e.target.value + " id " + e.target.id);
      //    for (let i = 0; i < timeKeysData.length; i++) {
      //       if (e.target.id == "tk_type_" + i) {
      //          timeKeysData[i].keytype = e.target.value;
      //          console.log(JSON.stringify(timeKeysData[i]));
      //       }
      //    }
      // });

function ReturnModelName (_id) {
   for (let i = 0; i < sceneModels.length; i++) {
      if (sceneModels[i]._id == _id) {
         return sceneModels[i].name;
      }
   }
}
function ReturnObjectName (_id) {
   for (let i = 0; i < sceneObjects.length; i++) {
      if (sceneObjects[i]._id == _id) {
         return sceneObjects[i].name;
      }
   }
}

function ReturnAttributions () {
   let attribString = "";
   if (attributions.length > 0) {
      for (let i = 0; i < attributions.length; i++) {
         let thestring = attributions[i];

         attribString = attribString + "<p>"+attributions[i]+"</p>";
      }
   }
   return attribString;
}

function SendAdminMessage() {
   let aMessage = $('#chat_input').val();
   console.log(socket + " " + userData.sceneOwner + " " + $('#chat_input').val())
   if (socket && userData.sceneOwner && aMessage.length > 0) {
      socket.emit('admin message', aMessage);
      document.getElementById("chat_input").value = "";
      if (aMessage.toString().toLowerCase() == "next") {
         GoToNext();
      }
   }

}

function SaveModsToCloud() { //Save button on location modal

   if (userData.sceneOwner != null) {
      let mods = {};
      mods.shortID = room;
      mods.userData = userData;
      mods.locationMods = sceneLocations.locationMods;
      if (sceneColor1 != "" || sceneColor2 != "" || sceneColor3 != "" || sceneColor4 != "") { //defined globally above
         mods.colorMods = {sceneColor1: sceneColor1, sceneColor2: sceneColor2, sceneColor3: sceneColor3, sceneColor4: sceneColor4};
      }
      if (volumePrimary != "" ||volumeAmbient != "" || volumeTrigger != "") {
         mods.volumeMods = {volumePrimary: volumePrimary, volumeAmbient: volumeAmbient, volumeTrigger: volumeTrigger};
      }
      mods.timedEventMods = timeKeysData;
      var encodedString = btoa(JSON.stringify(mods));
      console.log(encodedString);
      var xhr = new XMLHttpRequest();
      xhr.open("POST", '/add_scene_mods/'+room, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(mods));
      xhr.onload = function () {
         // do something to response
         console.log(this.responseText);
         if (this.responseText == 'ok') {
            ClearPlaceholders();
         } 
     };
   } else {
      console.log("you ain't the sceneOwner!");
   }
}

function download(filename, text) {
   var pom = document.createElement('a');
   pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
   pom.setAttribute('download', filename);

   if (document.createEvent) {
       var event = document.createEvent('MouseEvents');
       event.initEvent('click', true, true);
       pom.dispatchEvent(event);
   }
   else {
       pom.click();
   }
}

function ExportMods () {
   let currentTimestamp = Math.round(Date.now() / 1000).toString();
   let mods = {};
   // mods.locationMods = sceneLocations.locationMods;

   // if (sceneColor1 != "" || sceneColor2 != "" || sceneColor3 != "" || sceneColor4 != "") { //defined globally above
      
   //    mods.colorMods = {sceneColor1: sceneColor1, sceneColor2: sceneColor2, sceneColor3: sceneColor3, sceneColor4: sceneColor4};
   // }
   // if (volumePrimary != "" ||volumeAmbient != "" || volumeTrigger != "") {
   //    mods.volumeMods = {volumePrimary: volumePrimary, volumeAmbient: volumeAmbient, volumeTrigger: volumeTrigger};
   // }
   // if (timeKeysData.timekeys != undefined) {
   //    mods.timekeyMods = timeKeysData;
   // }
   mods.locations = localData.locations;
   mods.settings = localData.settings;
   var encodedString = btoa(JSON.stringify(mods));
   download(room+"_mods_"+currentTimestamp+".txt", encodedString);
}

function ImportMods (event) {
   console.log("tryna import mods " + event.target.files[0].name);
   if (event.target.files[0].name.includes(room.toString())) {
      var selectedFile = event.target.files[0];
      var reader = new FileReader();
      reader.onload = function(event) {
      var decodedString = atob(event.target.result);
      console.log(decodedString); 
      let mods = JSON.parse(decodedString);


      // if (mods != null && mods != undefined && mods.colorMods != null && mods.colorMods != undefined) {
      //    // localStorage.setItem(room + "_sceneColor1", mods.colorMods.sceneColor1);
      //    // localStorage.setItem(room + "_sceneColor2", mods.colorMods.sceneColor2);
      //    // localStorage.setItem(room + "_sceneColor3", mods.colorMods.sceneColor3);
      //    // localStorage.setItem(room + "_sceneColor4", mods.colorMods.sceneColor4);
      // }
      if (mods != null && mods != undefined && mods.settings != {}) {
         
         // localStorage.setItem(room+"_primaryVolume", mods.volumeMods.volumePrimary);
         // localStorage.setItem(room+"_ambientVolume", mods.volumeMods.volumeAmbient);
         // localStorage.setItem(room+"_triggerVolume", mods.volumeMods.volumeTrigger);
      }
      if (mods != null && mods != undefined && mods.locations != null && mods.locations.length > 0) {
         for (let i = 0; i < mods.locations.length; i++) {

            if (localData.locations.length) {
               if (locationTimestamps.indexOf(mods.locations[i].timestamp) != -1) { //update existing location if modded (maybe better to nuke localData first?)
                  localData.locations[locationTimestamps.indexOf(mods.locations[i].timestamp)] = mods.locations[i];
               } else {
                  localData.locations.push(mods.locations[i]);
               }
            } else {
               localData.locations.push(mods.locations[i]);
            }
         }

         SaveLocalData();
         // for (let i = 0; i < mods.locationMods.length; i++) {
         //    if (mods.locationMods[i].phID != null && mods.locationMods[i].phID.includes(room)) {
         //       if (mods.locationMods[i].type == null || mods.locationMods[i].type == undefined) {
         //          mods.locationMods[i].type = "worldspace";
         //       } 
         //       localStorage.setItem(mods.locationMods[i].phID, JSON.stringify(mods.locationMods[i])); //main location data localstorage setting
         //    }
         //    if (mods.locationMods.length - 1 === i) {
         //       window.location.reload();
         //    }
         // }
      } else {
         console.log("nomods");
         // window.location.reload();
      }
      if (mods != null && mods != undefined && mods.timekeyMods != null) {
         // timeKeysData = mods.timekeyMods;
      }

      };
      reader.readAsText(selectedFile);
   } else {
      console.log("wrong room!")
   }
}
function SaveTimekeysToLocal () {
   // console.log(JSON.stringify(timeKeysData));
   // localStorage.setItem(room + "_timeKeys", JSON.stringify(timeKeysData));
}


function SaveModToLocal(locationKey) { //locationKey is now just timestamp of the location item, unique enough
   console.log("tryna save mod to local with key " + locationKey);
   hasLocalData = true;
   let locItem = {};

   
   // let keySplit = locationKey.split("~");
   locItem.x = document.getElementById('xpos').value;
   locItem.eulerx = document.getElementById('xrot').value.length > 0 ? document.getElementById('xrot').value : '0';
   locItem.y = document.getElementById('ypos').value;
   locItem.eulery = document.getElementById('yrot').value.length > 0 ? document.getElementById('yrot').value : '0';
   locItem.z = document.getElementById('zpos').value;
   locItem.eulerz = document.getElementById('zrot').value.length > 0 ? document.getElementById('zrot').value : '0';
   // locItem.lat 
   locItem.label = document.getElementById('locationName').value;
   locItem.name = document.getElementById('locationName').value;
   locItem.description = document.getElementById('locationDescription').value;
   locItem.markerType = document.getElementById('locationMarkerType').value;
   locItem.eventData = document.getElementById('locationEventData').value;
   locItem.timestamp = locationKey;
   locItem.markerObjScale = document.getElementById("modelScale").value;
   locItem.phID = locationKey.toString();
   locItem.type = "Worldspace";
   locItem.isLocal = true;
   if (locItem.markerType == "waypoint" && locItem.name == 'local placeholder') {
      locItem.name = 'local waypoint';
   }
   if (locItem.markerType == "placeholder" && locItem.name == 'local waypoint') {
      locItem.name = 'local placeholder';
   }
   
   // locItem.modelID = document.getElementById('locationModel').value.split("~")[3]; //model select values have the phID (room~cloud/local~timestamp) plus modelid, so index 3 of split

   locItem.modelID = document.getElementById('locationModel').value; // model _id
   locItem.model = ReturnModelName(locItem.modelID);

   locItem.objectID = document.getElementById('locationObject').value; //object _id
   locItem.objectName = ReturnObjectName(locItem.objectID);
   // if (locationKey.toString().includes("local")) {
   //    locItem.isLocal = true;
   // }
   console.log("tryna savelocation "+locationKey+"  : " + JSON.stringify(locItem));
   // localStorage.setItem(locationKey, JSON.stringify(locItem));
   let hasLocal = false;
   for (let i = 0; i < localData.locations.length; i++) {
      console.log("chck : " + localData.locations[i].timestamp.toString() + " vs " +locationKey.toString());
      if (localData.locations[i].timestamp.toString() == locationKey.toString() ) {
         console.log("updating existing element "+locationKey+"  : " + JSON.stringify(locItem));
         localData.locations[i] = Object.assign(locItem);
         hasLocal = true;
         SaveLocalData();
         break;
      }
   }
   let theEl = document.getElementById(locationKey.toString());
   if (theEl != null) {
      console.log("found the EL: " + locationKey);
      let scale = (locItem.markerObjScale != undefined && locItem.markerObjScale != null && locItem.markerObjScale != "") ? locItem.markerObjScale : 1;
      theEl.setAttribute('position', {x: locItem.x, y: locItem.y, z: locItem.z});
      theEl.setAttribute('rotation', {x: locItem.eulerx, y: locItem.eulery, z: locItem.eulerz});
      theEl.setAttribute('scale', {x: scale, y: scale, z: scale});
      // for (let i = 0; i < sceneLocations.locations.length; i++) {
      //    if (locationKey.toString() == sceneLocations.locations[i].timestamp.toString()) {
      //       sceneLocations.locations[i] = Object.assign(locItem); //replace the location item with updated properties
      //       localData.locations[i] = Object.assign(locItem); //replace the location item with updated properties, to use if already has local mods
      //       SaveLocalData(); //persist to localdb
      //    }
      // }

   } else {
      console.log("DINT FIND THE EL " + locationKey);
   }
   // if (!hasLocal) {
   //    for (let i = 0; i < sceneLocations.locations.length; i++) {
   //       console.log("chck : " + sceneLocations.locations[i].timestamp.toString() + " vs " +locationKey.toString());
   //       if (sceneLocations.locations[i].timestamp.toString() == locationKey.toString() ) {
   //          console.log("updating existing element "+locationKey+"  : " + JSON.stringify(locItem));
   //          localData.locations[i] = Object.assign(locItem);
   //          // hasLocal = true;
   //          SaveLocalData();
   //          break;
   //       }
   //    }
   // }
   
   // AddLocalMarkers();
   // InitIDB();
   
   // ShowHideDialogPanel();
   SceneManglerModal('Locations');
}

function GrabLocation(locationKey) {
   console.log("tryna grablocation : " +locationKey);  
}

function ToggleTransformControls (locationKey) {
   this.transformEl = document.getElementById(locationKey);
   console.log("tryna transform a location " + locationKey);

   // const transformEl = document.getElementsByClassName("transformControls")[0]; //there should be only one

   if (transformEl) {
      console.log("gotsa targetEl to remove transform_control");
      let transform_controls_component = transformEl.components.transform_controls;
      if (transform_controls_component) {
         if (transform_controls_component.data.isAttached) {
            transform_controls_component.detachTransformControls();
         } else {
            transform_controls_component.attachTransformControls();
         }
      } else {
         this.transformEl.setAttribute("transform_controls", "");
      }
   }
}
function ToggleAllTransformControls () {
   const moddables = document.getElementsByClassName("allowMods");
   if (!transformAll) {
      for (var i=0; i<moddables.length; i++) {
         let transform_controls_component = moddables[i].components.transform_controls;
         if (transform_controls_component) {
            transform_controls_component.attachTransformControls();
         } else {
            moddables[i].setAttribute("transform_controls", "");
         }
      }
      transformAll = true;
   } else {
      for (var i=0; i<moddables.length; i++) {
         let transform_controls_component = moddables[i].components.transform_controls;
         if (transform_controls_component) {
            transform_controls_component.detachTransformControls();
         } 
      }
      transformAll = false;
   }
   ShowHideDialogPanel();
}

function SnapLocation(locationKey) { //snap selected object to player loc
  
   this.snapEl = document.getElementById(locationKey);
   this.cameraPosition = new THREE.Vector3(); 
   this.viewportHolder = document.getElementById('equipPlaceholder');
   this.viewportHolder.object3D.getWorldPosition( this.cameraPosition );

   console.log("tryna snaplocation : " +locationKey + " to " + JSON.stringify(this.cameraPosition));
   if (this.snapEl != null) {
      // let scale = this.snapEl.getAttribute("scale");
      // this.snapEl.setAttribute("scale", 1);
      let snapx = cameraPosition.x.toFixed(2);
      let snapy = cameraPosition.y.toFixed(2);
      let snapz = cameraPosition.z.toFixed(2);
      // this.snapEl.setAttribute("scale", scale);
         document.getElementById('xpos').value = snapx; //update elements in the modal dialog
         document.getElementById('ypos').value = snapy;
         document.getElementById('zpos').value = snapz;
         SaveModToLocal(locationKey);
         this.snapEl.setAttribute('position', {"x": snapx, "y": snapy, "z": snapz});
      } else {
         console.log("couldnot find this.snapEl " + locationKey);
      } 
}

function GoToLocation(locationKey) {
   console.log("tryna goat locatioKey " + locationKey);
   // let location = JSON.parse(localStorage.getItem(locationKey));
   let targetEl = document.getElementById(locationKey);
   if (targetEl != null) { 
      let targetLocation = targetEl.getAttribute('position');
      if (targetLocation != null) {
      
         if (player == null) {
            player = document.getElementById('player');
         }

         let worldPos = new THREE.Vector3();
               // location.getWorldPosition(worldPos);
         worldPos = {'x': targetLocation.x, 'y': targetLocation.y + 1, 'z': targetLocation.z + 3};
               // cameraEl.object3D.getWorldPosition( cameraPosition );
         //       const zmod = worldPos.z + 5;
         //       const ymod = worldPos.y - 1;
         //       const xmod = worldPos.x;
         // let pos = {x: xmod, y: ymod, z: zmod};

         player.setAttribute('position', worldPos);
         console.log("target "+JSON.stringify(targetLocation)+ " vs. player " + JSON.stringify(player.getAttribute('position')));
         // window.playerPosition = worldPos;

         // ShowHideDialogPanel(); 
      } 
   }
}
function PlayerToLocation(worldPos) {
   // if (player == null) {
   //    player = document.getElementById('player');
   // }
   // let worldPos = new THREE.Vector3();
   //       // location.getWorldPosition(worldPos);
   // worldPos = {'x': targetLocation.x, 'y': targetLocation.y + 1, 'z': targetLocation.z + 3};

   player.setAttribute('position', worldPos);
   // console.log("target "+JSON.stringify(targetLocation)+ " vs. player " + JSON.stringify(player.getAttribute('position')));
   // window.playerPosition = worldPos;
}

function GoToNext() {
   console.log("tryna gotonext " + settings.sceneType);
// if (currentLocationIndex > 0) {
   if (settings.sceneType == "mapbox") {
      
      var locbuttons = document.getElementsByClassName("locbutton");
      if (currentLocationIndex < locbuttons.length - 1) {
         currentLocationIndex++;
         if (currentLocationIndex == 0) {
            currentLocationIndex = 1
         }
      } else {
         currentLocationIndex = 1; //zero index is user location, so skip it
      }
      let lbData = locbuttons[currentLocationIndex].id;
      FlyToMapPosition(lbData.split("_")[0],lbData.split("_")[1], false);
    
   } else {
      // console.log(JSON.stringify(sceneLocations) + " charlie " + JSON.stringify(poiLocations));
      if (sceneLocations != null && poiLocations.length > 0) { 
         if (currentLocationIndex < poiLocations.length - 1) {
            currentLocationIndex++;
         } else {
            currentLocationIndex = 0;
            
         }
         console.log(poiLocations[currentLocationIndex].phID);
      // if (sceneLocations.locationMods[currentLocationIndex].markerType.toLowerCase() == 'poi') {
         GoToLocation(poiLocations[currentLocationIndex].phID);
         // }
      }
      if (skyboxEl != null) {
         skyboxEl.components.skybox_dynamic.nextSkybox();
      } else {
         console.log("no skyboxEl!");
      }
      // let tunnels = document.getElementsByTagName("mod_tunnel");
      let tunnels = document.querySelectorAll("[mod_tunnel]")
      if (tunnels) {
         for (let i = 0; i < tunnels.length; i++) {
            console.log("gotsa tunnel tryna switch texture...");
            tunnels[i].components.mod_tunnel.randomTexture();
         }
      }
      if (socket) {
         EmitSelfPosition();
      }
         
   }
}
// }
function GoToPrevious() {

   if (settings.sceneType == "mapbox") {
      
      var locbuttons = document.getElementsByClassName("locbutton");
      if (currentLocationIndex > 0) {
         currentLocationIndex--;
         if (currentLocationIndex == 0) {
            currentLocationIndex = locbuttons.length - 1;
         }
      } else {
         currentLocationIndex = locbuttons.length - 1;
      }
      let lbData = locbuttons[currentLocationIndex].id;
      FlyToMapPosition(lbData.split("_")[0],lbData.split("_")[1], false);
    
   } else {
      if (sceneLocations != null && poiLocations.length > 0) {
         if (currentLocationIndex > 0) {
            currentLocationIndex--;
         } else {
            currentLocationIndex = poiLocations.length - 1;
         }
        
         GoToLocation(poiLocations[currentLocationIndex].phID);
         // }
      }
      if (skyboxEl != null) {
         skyboxEl.components.skybox_dynamic.previousSkybox();
      }
      let tunnels = document.querySelectorAll("[mod_tunnel]")
      if (tunnels) {
         for (let i = 0; i < tunnels.length; i++) {
            console.log("gotsa tunnel tryna switch texture...");
            tunnels[i].components.mod_tunnel.randomTexture();
         }
      }
   }
}

function ReturnLocationTableOLD () { //now it's all in indexedDB
   // console.log("LOCATIONMODS: " + JSON.stringify(sceneLocations.locationMods));
   if (sceneLocations.locationMods != null && sceneLocations.locationMods.length > 0) {
      let tablerows = "";
      for (let i = 0; i < sceneLocations.locationMods.length; i++) {
         let markerString = "";
         if (sceneLocations.locationMods[i].isLocal != null && sceneLocations.locationMods[i].isLocal === true) {
            markerString = "<span style=\x22color: pink; font-weight: bold;\x22>"+sceneLocations.locationMods[i].markerType+"</span>";
         } else {
            markerString = "<span style=\x22color: lime; font-weight: bold;\x22>"+sceneLocations.locationMods[i].markerType+"</span>";
         }

         if (sceneLocations.locationMods[i].markerType != undefined && (sceneLocations.locationMods[i].markerType.includes("picture") || sceneLocations.locationMods[i].markerType == "poi" 
            || sceneLocations.locationMods[i].markerType == "placeholder" || sceneLocations.locationMods[i].markerType.toLowerCase().includes("trigger") 
            || sceneLocations.locationMods[i].markerType == "mailbox" || sceneLocations.locationMods[i].markerType == "portal" || sceneLocations.locationMods[i].markerType == "gate") ) {
            let namelabel = (sceneLocations.locationMods[i].name != 'undefined' && sceneLocations.locationMods[i].name != undefined && sceneLocations.locationMods[i].name != null) ? sceneLocations.locationMods[i].name : sceneLocations.locationMods[i].label; 
            tablerows = tablerows + "<tr class=\x22clickableRow\x22 onclick=\x22LocationRowClick('"+sceneLocations.locationMods[i].phID+"')\x22><td>"+namelabel+"</td>"+
            "<td>"+sceneLocations.locationMods[i].x+","+sceneLocations.locationMods[i].y+","+sceneLocations.locationMods[i].z+"</td><td>"+sceneLocations.locationMods[i].model+"</td><td>"+ markerString+"</td></tr>";
            // "<td>"+sceneLocations.locationMods[i].phID+"</td><td>"+localString + sceneLocations.locationMods[i].markerType+"</td></tr>";
            // "<td>"+sceneLocations.locationMods[i].phID+"</td><td>"+markerString+"</td></tr>";
         }
      }
      return "<table id=\x22locations\x22><th>label</th><th>position</th><th>Asset</th><th>type</th>"+tablerows+"</table>";
   } else {
      return null;
   }
}

function ReturnLocationTableOLD2 () { //just show em all now!

      let tablerows = "";
      for (let i = 0; i < localData.locations.length; i++) {
         let markerString = "";
         if (localData.locations[i].isLocal != null && localData.locations[i].isLocal === true) {
            markerString = "<span style=\x22color: pink; font-weight: bold;\x22>"+localData.locations[i].markerType+"</span>";
         } else {
            markerString = "<span style=\x22color: lime; font-weight: bold;\x22>"+localData.locations[i].markerType+"</span>";
         }

         // if (localData.locations[i].markerType != undefined && (localData.locations[i].markerType.includes("picture") || localData.locations[i].markerType == "poi" 
         //    || localData.locations[i].markerType == "placeholder" || localData.locations[i].markerType.toLowerCase().includes("trigger") 
         //    || localData.locations[i].markerType == "mailbox" || localData.locations[i].markerType == "portal" || localData.locations[i].markerType == "gate") ) {
               
            let namelabel = (localData.locations[i].name != 'undefined' && localData.locations[i].name != undefined && localData.locations[i].name != null) ? localData.locations[i].name : localData.locations[i].label; 
            tablerows = tablerows + "<tr class=\x22clickableRow\x22 onclick=\x22LocationRowClick('"+localData.locations[i].timestamp+"')\x22><td>"+namelabel+"</td>"+
            "<td>"+localData.locations[i].x+","+localData.locations[i].y+","+localData.locations[i].z+"</td><td>"+localData.locations[i].model+"</td><td>"+ markerString+"</td></tr>";
      }
      return "<table id=\x22locations\x22><th>label</th><th>position</th><th>Asset</th><th>type</th>"+tablerows+"</table>";
}

function ReturnLocationTable () { //just show em all now!

   let tablerows = "";

   if (!localData.locations.length) {
     
      for (let i = 0; i < sceneLocations.locations.length; i++) {
         let markerString = "";
         if (sceneLocations.locations[i].isLocal != null && sceneLocations.locations[i].isLocal === true) {
            markerString = "<span style=\x22color: pink; font-weight: bold;\x22>"+sceneLocations.locations[i].markerType+"</span>";
         } else {
            markerString = "<span style=\x22color: lime; font-weight: bold;\x22>"+sceneLocations.locations[i].markerType+"</span>";
         }        
         let namelabel = (sceneLocations.locations[i].name != 'undefined' && sceneLocations.locations[i].name != undefined && sceneLocations.locations[i].name != null) ? sceneLocations.locations[i].name : sceneLocations.locations[i].label; 
         tablerows = tablerows + "<tr class=\x22clickableRow\x22 onclick=\x22LocationRowClick('"+sceneLocations.locations[i].timestamp+"')\x22><td>"+namelabel+"</td>"+
         "<td>"+sceneLocations.locations[i].x+","+sceneLocations.locations[i].y+","+sceneLocations.locations[i].z+"</td><td>"+sceneLocations.locations[i].model+"</td><td>"+ markerString+"</td></tr>";
      }
   } else {
      for (let i = 0; i < localData.locations.length; i++) {
         let namelabel = (localData.locations[i].name != 'undefined' && localData.locations[i].name != undefined && localData.locations[i].name != null) ? localData.locations[i].name : localData.locations[i].label; 
         let namestring = "<span style=\x22color: white; \x22>"+namelabel+"</span>";
         if (localData.locations[i].isLocal != null && localData.locations[i].isLocal === true) {
            namestring = "<span style=\x22color: pink; \x22>"+namelabel+"</span>";
         }  

         let markerString = "<span style=\x22color: white; font-weight: bold;\x22>"+localData.locations[i].markerType+"</span>";
         if (localData.locations[i].markerType == "waypoint") {
            markerString = "<span style=\x22color: lime; font-weight: bold;\x22>"+localData.locations[i].markerType+"</span>";
         } else if (localData.locations[i].markerType == "poi") { 
            markerString = "<span style=\x22color: purple; font-weight: bold;\x22>"+localData.locations[i].markerType+"</span>";
         } else if (localData.locations[i].markerType == "placeholder") { 
            markerString = "<span style=\x22color: yellow; font-weight: bold;\x22>"+localData.locations[i].markerType+"</span>";
         }  

         let mAsset = (localData.locations[i].model || localData.locations[i].model == undefined || localData.locations[i].model == 'undefined' || localData.locations[i].model == "none") ? localData.locations[i].model : null;
         let oAsset = (localData.locations[i].objectName || localData.locations[i].objectName == undefined || localData.locations[i].objectName == 'undefined' || localData.locations[i].objectName == "none") ? localData.locations[i].objectName : null;
         let asset = 'none';
         if (mAsset) {
            asset = mAsset;
         }
         if (oAsset) {
            asset = oAsset;
         }
        
         tablerows = tablerows + "<tr class=\x22clickableRow\x22 onclick=\x22LocationRowClick('"+localData.locations[i].timestamp+"')\x22><td>"+namestring+"</td>"+
         "<td>"+localData.locations[i].x+","+localData.locations[i].y+","+localData.locations[i].z+"</td><td>"+asset+"</td><td>"+ markerString+"</td></tr>";
      }
   }
   return "<table id=\x22locations\x22><th>label</th><th>position</th><th>Asset</th><th>type</th>"+tablerows+"</table>";
}

function LocationRowClick(data) {
   // // for (let i = 0; i < sceneLocations.locations)
   // let isCloud = true;
   // if (localKeys.indexOf(data) != -1) {
   //    isCloud = false; //if local key matches, it's local
   // }
   console.log("location row click: " + data);
   ShowHideDialogPanel();
   ShowLocationModal(data);
   // ShowLocationModal(isCloud, data);
}

// InitIDB();
function UpdateLocationData () { //maybe need to call an aframe component to do this?
      // setTimeout(function () {
      // if (Object.keys(localData).length > 0 ) {
      // settings = Object.assign(localData.sceneSettings);
      // sceneLocations = Object.assign(localData.sceneLocations);
      // usingLocalData = true;
      
  
      // console.log("gotsa element with id " + localData.locations[0].timestamp);
      // this.locationDataEl = document.getElementById("locationData");

      // if (this.locationDataEl) {
      //    this.locationDataEl.components.location_data.updateSceneLocationData();
      // }
      // for (let i = 0; length; i++) {
      //    console.log("number " + i);
      // }
         // UpdateLocation(sceneLocations.locations[i]);
         // if (localData.locations[i] != undefined) {
         //    let ts = localData.locations[i].timestamp;

         //    let rEl = document.getElementById(ts);
         //    if (rEl) {
         //       console.log("gotsa element with id " + JSON.stringify(localData.locations[i]));
         //          // let obj = rEl.getObject3D('mesh');
         //          // obj.position.set({x: sceneLocations.locations[i].x, y: sceneLocations.locations[i].y, z: sceneLocations.locations[i].z });
         //          // obj.rotation.set({x: sceneLocations.locations[i].eulerx, y: sceneLocations.locations[i].eulery, z: sceneLocations.locations[i].eulerz });
         //       //    // obj.scale.set({x: sceneLocations.locations[i].markerObjScale, y: sceneLocations.locations[i].markerObjScale, z: sceneLocations.locations[i].markerObjScale});
         //       // rEl.setAttribute("position", {x: sceneLocations.locations[i].x, y: sceneLocations.locations[i].y, z: sceneLocations.locations[i].z });
         //       // rEl.setAttribute("rotation", {x: sceneLocations.locations[i].eulerx, y: sceneLocations.locations[i].eulery, z: sceneLocations.locations[i].eulerz });
         //       // rEl.setAttribute("scale", {x: sceneLocations.locations[i].markerObjScale, y: sceneLocations.locations[i].markerObjScale, z: sceneLocations.locations[i].markerObjScale});
         //    }
         // }
      // }

      // console.log("gots sceneLocations.locations " + JSON.stringify(localData.sceneLocations.locations));
      // for (let i = 0; localData.sceneLocations.locations.length; i++) {
      //    // UpdateLocation(sceneLocations.locations[i]);
      //    if (localData.sceneLocations.locations[i] != undefined) {
      //       let ts = localData.sceneLocations.locations[i].timestamp.toString();
      //       // let rEl = document.getElementById(ts);
      //       // if (rEl) {
      //          console.log("gotsa id " + ts + " " + JSON.stringify(localData.sceneLocations.locations[i]));
      //             // let obj = rEl.getObject3D('mesh');
      //             // obj.position.set({x: localData.sceneLocations.locations[i].x, y: localData.sceneLocations.locations[i].y, z: localData.sceneLocations.locations[i].z });
      //             // obj.rotation.set({x: localData.sceneLocations.locations[i].eulerx, y: localData.sceneLocations.locations[i].eulery, z: localData.sceneLocations.locations[i].eulerz });
      //             // obj.scale.set({x: localData.sceneLocations.locations[i].markerObjScale, y: localData.sceneLocations.locations[i].markerObjScale, z: localData.sceneLocations.locations[i].markerObjScale});
      //          // rEl.setAttribute("position", {x: localData.sceneLocations.locations[i].x, y: localData.sceneLocations.locations[i].y, z: localData.sceneLocations.locations[i].z });
      //          // rEl.setAttribute("rotation", {x: localData.sceneLocations.locations[i].eulerx, y: localData.sceneLocations.locations[i].eulery, z: localData.sceneLocations.locations[i].eulerz });
      //          // rEl.setAttribute("scale", {x: localData.sceneLocations.locations[i].markerObjScale, y: localData.sceneLocations.locations[i].markerObjScale, z: localData.sceneLocations.locations[i].markerObjScale});
      //       // }
      //    }
      // }


   // }
// }, 5000);
}
// function UpdateLocation(location) {
//    console.log("upping location " + JSON.stringify(location));
//    if (location) {
//       console.log("looking for id : " +location.timestamp.toString());
//       let rEl = document.getElementById(location.timestamp.toString());
//       // if (rEl) {
//       //    console.log("gotsa id " + sceneLocations.locations[i].timestamp);
//       //    rEl.setAttribute("position", {x: location.x, y: location.y, z: location.z });
//       //    rEl.setAttribute("rotation", {x: location.eulerx, y: location.eulery, z: location.eulerz });
//       //    rEl.setAttribute("scale", {x: location.markerObjScale, y: location.markerObjScale, z: location.markerObjScale});
//       // }
//    } else {
      
//    }
// }
// function InitLocalData () {

//    if (Object.keys(localData).length > 0) { 
//       // UpdateLocationData();
//       console.log(JSON.stringify(localData));
//    } else {
   
//       if (cloudData) {
//          console.log("gots cloud data: " + JSON.stringify(cloudData));
//          if (cloudData.sceneLocations.locations) {
//             for (let i = 0; i < cloudData.sceneLocations.locations.length; i++) {
//             // let theItemObject = JSON.parse(theItem);
//             // theItemObject.isLocal = true;
//             // locationMods.push(theItemObject);
//                if (cloudData.sceneLocations.locations[i].markerType == "poi") {
//                   let nextbuttonEl = document.getElementById('nextButton');
//                   let prevbuttonEl = document.getElementById('previousButton');
//                   nextbuttonEl.style.visibility = "visible";
//                   prevbuttonEl.style.visibility = "visible";
//                   poiLocations.push(cloudData.sceneLocations.locations[i]);
//                }
//             }
//          }
//       }
//    }
// }

// function AddLocalMarkersOLD() {// new or modded markers not saved to cloud // DEPRECATED for indexedDB version
   
//    console.log("tryna add local keys count " + localStorage.length);
//    let locationMods = []; //local scope for local mods 
//    if (settings == '') {
//       if (localStorage.length > 0 && (settings.sceneType == "Default" || settings.sceneType == "AFrame")) {
//          for (var i=0; i < localStorage.length; i++)  {
//             let theKey = localStorage.key(i);

//             let gotsaMatch = false;

//             if (theKey != null && theKey.toString().includes(room)) {
//                let theItem = localStorage.getItem(theKey);
//                // console.log("local key:" + theKey + " item " + theItem);
//                // console.log(theKey);
//                let keySplit = theKey.split("~"); //room is zero, timestamp is 2
//                localKeys.push(keySplit[2]);// use this to filter the unmodded ones in AddCloudMarkers below, and tell modded vs unmodded locs //nevermind
//                if (theKey.toString().includes("~localmarker~")) {

//                   // localKeys.push(keySplit[2]);
                  
//                   // theItemObject = JSON.parse(theItem);
//                   // theItemObject.markerType = theItemObject.markerType + " (local)";
//                   console.log("localplaceholder key:" + theKey + " el " + document.getElementById(theKey));
//                   let phEl = document.getElementById(theKey);

//                   if (phEl == null) {
//                      // console.log("creating local el " + theKey);
//                      phEl = document.createElement('a-entity');   
//                      phEl.id = theKey;
//                      var sceneEl = document.querySelector('a-scene');
//                      phEl.setAttribute('skybox-env-map', '');
//                      phEl.setAttribute('local_marker', {'timestamp': keySplit[2]});
//                      sceneEl.appendChild(phEl);
//                   }
//                   if (theItem != null && sceneLocations.locations != null) {
//                      let theItemObject = JSON.parse(theItem);
//                      theItemObject.isLocal = true;
//                      locationMods.push(theItemObject);
//                      if (theItemObject.markerType == "poi") {
//                         let nextbuttonEl = document.getElementById('nextButton');
//                         let prevbuttonEl = document.getElementById('previousButton');
//                         nextbuttonEl.style.visibility = "visible";
//                         prevbuttonEl.style.visibility = "visible";
//                         poiLocations.push(theItemObject);
//                      }
//                   }
//                } else if (theKey.toString().includes("~cloudmarker~")) { //a cloudmarker, if modded by user, becomes a defacto "local" marker, unless/until admin saves to cloud
//                   let keySplit = theKey.split("~"); //room is zero, timestamp is 2
               
//                   let cItem = JSON.parse(theItem);
//                   // cItem.isLocal = true;
//                   // console.log('cloudplaceholder ' + JSON.stringify(cItem) );
//                   // sceneLocations.locations.find(function(keySplit, index) { //kinda bad, what if 2 have same?
//                   // if(tk.keystarttime == tkStarttimes[i]) {
//                   //    return true;
//                   // }}
//                   locationMods.push(cItem);
//                   if (cItem.markerType == "poi") {
//                      let nextbuttonEl = document.getElementById('nextButton');
//                      let prevbuttonEl = document.getElementById('previousButton');
//                      nextbuttonEl.style.visibility = "visible";
//                      prevbuttonEl.style.visibility = "visible";
//                      poiLocations.push((cItem));
//                   }
//                   let phEl = document.getElementById(theKey);

//                   if (phEl) {
//                      let cloud_marker = phEl.components.cloud_marker;
//                      if (cloud_marker) {
//                         console.log("LocalMods to CLoudMarkerz!");
//                      }
//                   }
//                } else if (theKey.toString().includes('color')) {
//                   // console.log("gots color " + theKey + " item " + theItem);
//                }
            

//                let enviroEl = document.getElementById('enviroEl'); //attached to aframe environment thing
//                if (enviroEl != null) {
//                   if (theKey.toString().includes("sceneColor1")) {  
//                         enviroEl.setAttribute('environment', 'skyColor', theItem);
//                      } else if (theKey.toString().includes("sceneColor2")) {
//                         console.log("theColror eky " + theKey + " " + theItem);
//                         enviroEl.setAttribute('environment', 'horizonColor', theItem);
//                      } else if (theKey.toString().includes("sceneColor3")) {
//                         enviroEl.setAttribute('environment', 'groundColor', theItem);
//                      } else if (theKey.toString().includes("sceneColor4")) {
//                         enviroEl.setAttribute('environment', 'groundColor2', theItem);
//                         enviroEl.setAttribute('environment', 'dressingColor', theItem);
//                   }
//                }
            
//                // console.log("POILOCATIONS : "+ poiLocations.length);
//             }
//             if (localStorage.length - 1 === i) {
//                sceneLocations.locationMods = locationMods;
//                console.log("updated locationmods " + JSON.stringify(sceneLocations.locationMods));
//                // console.log("LOCATIONMODS: " + JSON.stringify(sceneLocations.locationMods));
//                AddCloudMarkers(); //add the ones from admin
//             }
//          }
//          // if (!gotsaMatch) {
//          //    locationMods.push(cloudLocations[c]);
//          // }
//       } else {
//          AddCloudMarkers(); 
//       }
//    }
//    if (localData) {
//       for (i = 0; i < localData.sceneLocations.locationMods.length; i++) {

//       }
//    }
// }

// function AddCloudMarkers () {
//    if (cloudMarkers.length > 0) {
//       for (let i = 0; i < cloudMarkers.length; i++) {
//          sceneLocations.locationMods.push(cloudMarkers[i]);
//       }
//    } 
// }

function ClearPlaceholders() {
   
   // localStorage.clear();

   // for (var i=0; i < localStorage.length; i++)  {
      
   //    let theKey = localStorage.key(i);
   //    if (theKey.includes(room)) {
   //       localStorage.removeItem(theKey);
   //       console.log("removed " + theKey);
   //    }
   // }
   // setTimeout(function () {
   //    window.location.reload();
   // }, 2000);
   
}
function CreatePlaceholder () {

   // SettingsModal();
   console.log("tryna create place3holder");
   let newPosition = new THREE.Vector3(); 
   let viewportHolder = document.getElementById('viewportPlaceholder3');
   viewportHolder.object3D.getWorldPosition( newPosition );
   console.log("new position for placeholder " + JSON.stringify(newPosition));
   let phEl = document.createElement('a-entity');
   var sceneEl = document.querySelector('a-scene');
   phEl.setAttribute('skybox-env-map', '');
   let timestamp = Date.now();
   timestamp = parseInt(timestamp);
   let locItem = {};
   locItem.x = newPosition.x.toFixed(2);
   locItem.eulerx = 0; //maybe get look vector?
   locItem.y = newPosition.y.toFixed(2);
   locItem.eulery = 0;
   locItem.z = newPosition.z.toFixed(2);
   locItem.eulerz = 0;
   locItem.type = "Worldspace";
   locItem.label = 'local placeholder';
   locItem.name = "local placeholder";
   locItem.description = '';
   locItem.markerType = "placeholder";
   locItem.eventData = '';
   locItem.isNew = true;
   locItem.timestamp = timestamp;
   locItem.scale = 1;
   locItem.tags = '';
   locItem.phID = timestamp;
   locItem.isLocal = true;
   localData.locations.push(locItem);
   phEl.setAttribute('gltf-model', '#poi1');
   phEl.id = locItem.timestamp;

   // phEl.id 
   sceneEl.appendChild(phEl);
   phEl.setAttribute('position', newPosition);
   phEl.setAttribute('local_marker', {timestamp: timestamp, isNew: true, position: newPosition} );

   SaveLocalData();
   ShowHideDialogPanel();
   
}

async function ConnectToEthereum() {
   const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
   const account = accounts[0];
   if (account != null) {
      const ethereumButton = document.getElementById("ethereumButton");
      ethereumButton.style.color = "green";
      console.log("ethereum account : " + account);
   }
}

async function ShowEnableEthereumButton ()  {
   const ethereumButton = document.getElementById("ethereumButton");
   if (ethereumButton != null) {
   ethereumButton.style.display = "block";
   ethereumButton.addEventListener('click', () => {
      ConnectToEthereum();
      //Will Start the metamask extension
      // ethereum.request({ method: 'eth_requestAccounts' });

      });
   }
}
// function amirite () {
//    if (cookie != null && cookie._id != null) {
//    console.log("gotsa cookie: " + cookie._id );
//    $.get( "/ami-rite/" + cookie._id, function( data ) {
//       // console.log("amirite : " + JSON.stringify(data.apps));
//       if (data == 0) {
//          console.log("nope");
//       } else {
//          console.log("urp");
//       }
//    });
//    } else {
//       // window.location.href = './login.html';
//       console.log("nocookie");
//    }
// }

function tcheck () {
   let pin = getParameterByName('p');
   if (pin != null) {
      console.log("GOTSA PIN!" + pin);

   } // else {
   if (token != null) {
      $.get( "/ami-rite-token/" + token, function( data ) {
         console.log("amirite : " + JSON.stringify(data));
         
         if (data == '0' || data == '1' || data == '3' || data == '1' || data == '4' || data == '5') {//all auth fails
            // console.log("guest token");
            if (socket != null && socket != undefined) {
               if (!socket.connected) {
                  socket.connect(socketHost);
               }
            }
            userData.isGuest = true;
            // if (getParameterByName('p') != null) {
            //    console.log("GOTSA PIN!");
            // }
            // userData = data;
         } else {
            // let user = JSON.parse(data);
         
            // if (data.userID  > 1) {
               if (data._id != null) {
                  // console.log("gotsa user token" + JSON.stringify(data));
                  // userid = data._id;
                  avatarName = data.userName;
                  userData = data;
                  if (socket != null && socket != undefined) {
                     if (!socket.connected) {
                        socket.connect(socketHost);
                     }
                  }
            
                  //socket.connect(socketHost);
               // }
            }
         }

               

         // } else {
         //    console.log("nurp");
         // }
      });
      } else {
         // window.location.href = './login.html';
         console.log("notoken");
      }
   // }
}

if (sceneEl != null) {

   AFRAME.registerComponent('location_data', {
      schema: {
      initialized: {default: ''},
      jsonData: {default: ''},
      youtubePosition: {type: 'vec3', default: {x: 0, y: 1, z: -5}} 
       
      },
      init: function() {

            let theData = this.el.getAttribute('data-locations');
            console.log("location_data el" + this.el.id);
            let locations = [];
            this.data.jsonData = JSON.parse(atob(theData)); //convert from base64
            // this.rEl = null;
            // if (localData != "") {
            for (let i = 0; i < this.data.jsonData.length; i++) {
               let locItem = this.data.jsonData[i];
               sceneLocations.locations.push(locItem);
               // localData.locations.push(locItem);
               if (locItem.markerType != undefined) {
                  if (locItem.markerType.toLowerCase().includes("youtube")) {
                     this.data.youtubePosition.x = locItem.x;
                     this.data.youtubePosition.y = locItem.y; 
                     this.data.youtubePosition.z = locItem.z;
                     // console.log("YOTUBE POSOTION: " +JSON.stringify(this.data.youtubePosition));
                  }
                  if (locItem.markerType.toLowerCase().includes("poi")) {
                     let nextbuttonEl = document.getElementById('nextButton');
                     let prevbuttonEl = document.getElementById('previousButton');
                     nextbuttonEl.style.visibility = "visible";
                     prevbuttonEl.style.visibility = "visible";
                     poiLocations.push(locItem);
                  }
                  if (locItem.markerType.toLowerCase().includes("placeholder") ||
                     locItem.markerType.toLowerCase().includes("poi") ||
                     locItem.markerType.toLowerCase().includes("gate") || 
                     locItem.markerType.toLowerCase().includes("portal") || 
                     locItem.markerType.toLowerCase().includes("mailbox") || 
                     locItem.markerType.toLowerCase().includes("waypoint")) {
                     cloudMarkers.push(locItem);
                  
                  }
            
               }
               if (i == this.data.jsonData.length - 1) {

                  if (settings.allowMods) {
                     InitIDB();
                  }
               }
            }
          
      }, 
      returnYouTubePosition: function() {
         return this.data.youtubePosition;
      },
      // applyLocalDataToCloudElement: function (locationKey) {
      //    for 
      // },
      updateSceneLocationData: function() {

         let thedata = JSON.parse(JSON.stringify(localData.locations));
      // let length = thedata.length;
      console.log(thedata.length + " local sceneLocations " + JSON.stringify(thedata));
      //    console.log(JSON.stringify(sceneLocations));
         for (let i = 0; thedata.length; i++) {
            // UpdateLocation(sceneLocations.locations[i]);
            if (thedata[i] != undefined) {
               let ts = sceneLocations.locations[i].phID;
               let rEl = document.getElementById(ts);
               if (rEl) {
                  console.log("gotsa element with id " + JSON.stringify(thedata[i]));
                  // let obj = rEl.getObject3D('mesh');
                  // obj.position.set({x: sceneLocations.locations[i].x, y: sceneLocations.locations[i].y, z: sceneLocations.locations[i].z });
                  // obj.rotation.set({x: sceneLocations.locations[i].eulerx, y: sceneLocations.locations[i].eulery, z: sceneLocations.locations[i].eulerz });
                  //    // obj.scale.set({x: sceneLocations.locations[i].markerObjScale, y: sceneLocations.locations[i].markerObjScale, z: sceneLocations.locations[i].markerObjScale});
                  // rEl.setAttribute("position", {x: sceneLocations.locations[i].x, y: sceneLocations.locations[i].y, z: sceneLocations.locations[i].z });
                  // rEl.setAttribute("rotation", {x: sceneLocations.locations[i].eulerx, y: sceneLocations.locations[i].eulery, z: sceneLocations.locations[i].eulerz });
                  // rEl.setAttribute("scale", {x: sceneLocations.locations[i].markerObjScale, y: sceneLocations.locations[i].markerObjScale, z: sceneLocations.locations[i].markerObjScale});
               }
            }
         }
      }
   });


}

function ShowHideUI () {
   uiVisible = !uiVisible;
   console.log("tryna showHideUI " + uiVisible);
   let canvasOverlay = document.getElementById("canvasOverlay");
   let nipple = document.getElementById("np");
   let geoButtons = document.getElementById("geopanel");
   let button_left_1 = document.getElementById("button_left_1");
   let button_left_2 = document.getElementById("button_left_2");
   let button_left_3 = document.getElementById("button_left_3");
   let button_left_4 = document.getElementById("button_left_4");
   let button_left_5 = document.getElementById("button_left_5");
   if (!uiVisible) {
      if (canvasOverlay) {
         canvasOverlay.style.visibility = "hidden";
      }
      if (nipple) {
         nipple.style.visibility = "hidden";
      }
      if (geoButtons) {
         geoButtons.style.visibility = "hidden";
      }
      if (button_left_1) {
         button_left_1.style.visibility = "hidden";
      }
      if (button_left_2) {
         button_left_2.style.visibility = "hidden";
      }
      if (button_left_3) {
         button_left_3.style.visibility = "hidden";
      }
      if (button_left_4) {
         button_left_4.style.visibility = "hidden";
      }
      if (button_left_5) {
         button_left_5.style.visibility = "hidden";
      }
   } else {
      if (canvasOverlay) {
         canvasOverlay.style.visibility = "visible";
      }
      if (nipple) {
         nipple.style.visibility = "visible";
      }
      if (geoButtons) {
         geoButtons.style.visibility = "visible";
      }
      if (button_left_1) {
         button_left_1.style.visibility = "visible";
      }
      if (button_left_2) {
         button_left_2.style.visibility = "visible";
      }
      if (button_left_3) {
         button_left_3.style.visibility = "visible";
      }
      if (button_left_4) {
         button_left_4.style.visibility = "visible";
      }
      if (button_left_5) {
         button_left_5.style.visibility = "visible";
      }
   }
}


$(document).on("click",".cw-canvas-overlay",function(){ 
   this.element.classList.toggle("cw-show-canvas");
});


$(document).on("click",".picbutton",function(){ 
   let picbuttonID = this.id;
   console.log("picbutton clicked from " + picbuttonID);
   // $(".screen-overlay").backstretch("Destroy", true);
   $(".screen-overlay").css('visibility',"visible");
   $(".screen-overlay").backstretch(pics, {duration: 1000, fade: 250});
});

$(document).on("click","#play",function(){ 
   console.log("play clicked");
   // $(".screen-overlay").backstretch("Destroy", true);
   $(".screen-overlay").backstretch(pics, {duration: 1000, fade: 250});
});

$(document).on("click","#pause",function(){ 
   console.log("pause clicked");
   // $(".screen-overlay").backstretch("Destroy", true);
   $(".screen-overlay").backstretch("pause");
   // $(".screen-overlay").backstretch(pics, {duration: 1000, fade: 250});
});

$(document).on("click","#next",function(){ 
   // console.log("next clicked");
   // $(".screen-overlay").backstretch("Destroy", true);
   // if (currentIndex > 0)
   // currentIndex--;
   // var pic = pics[currentIndex];
   // $(".screen-overlay").backstretch(pic, {fade: 250});
   $(".screen-overlay").backstretch("next");
});
$(document).on("click","#prev",function(){ 
   // console.log("prev clicked");
   // $(".screen-overlay").backstretch("Destroy", true);
   // if (currentIndex < pics.length - 1)
   // currentIndex++;
   // var pic = pics[currentIndex];
   // $(".screen-overlay").backstretch(pic, {fade: 250});
   $(".screen-overlay").backstretch("prev");
});

// window.onclick = function(event) { //click outside modal to close
//    if (event.target == theModal && event.target != modalContent) {
//      theModal.style.display = "none";
//    }
//  }
// var HideMobileKeyboard = function() {
// 	document.activeElement.blur();
// 	$("input").blur();
// };

//  var modalCloser = document.getElementById("modalCloser"); //or the close button
//  if (modalCloser != null) {
//    modalCloser.addEventListener('click', function() {
//       theModal.style.display = "none";
//       HideMobileKeyboard();
//    });
// }

var closer = document.getElementById("adSquareCloseButton");
   if (closer != null) {
      closer.addEventListener('click', function() {
      const ad = document.getElementById("adSquareOverlay");
      ad.remove();
   });
}

var scloser = document.getElementById("screenOverlayCloseButton");
   if (scloser != null) {
      scloser.addEventListener('click', function() {
   // const screen = document.getElementById("screenOverlay");
   $(".screen-overlay").css('visibility','hidden');
   $(".screen-overlay").backstretch("pause");
   $(".screen-overlay").backstretch("destroy", true);
});
}
var mapcloser = document.getElementById("mapOverlayCloseButton");
   if (mapcloser != null) {
      mapcloser.addEventListener('click', function() {
   // const screen = document.getElementById("mapOverlay");
   $(".map-overlay").css('visibility','hidden');
   $(".map-overlay").backstretch("pause");
   $(".map-overlay").backstretch("destroy", true);
});
}

$(window).on("backstretch.before", function (e, instance, index) {
   // If we wanted to stop the slideshow after it reached the end
   // if (index != 1 && index != 0 && index === instance.images.length - 1) {
   // instance.pause();
   // $(".screen-overlay").backstretch("destroy", true);
   // $(".screen-overlay").backstretch(pics, {duration: 1000, fade: 250});
   // if (pics.length > 1) {
   //     console.log("resetting backstretch with pics.length " + pics.length);
   //      instance.images = pics;
   //     }
   // };
});

// $(window).on("backstretch.after", function (e, instance, index) { //never mind, seemed like a good idea...
//    var number = Math.min(Math.max(parseInt(pics.length), 1), 20); //limit to 20 frames for speed calc 
//      let newDuration = 1000 + (10000 - (number * 500));
//      console.log("newDuration is " + newDuration);
//    // console.log("played frame " + index + " of " + instance.images.length);
//    currentIndex = index;
//    if (index == instance.images.length - 1) {
//      $.backstretch("destroy", true);
//      $.backstretch(pics, {duration: newDuration, fade: 250});
//    }
//  });
$(window).on("backstretch.after", function (e, instance, index) {
   if (playFrames) {
      console.log("played frame " + index + " of " + instance.images.length);
      let count = instance.images.length;
      currentIndex = index;
      if (count != 0) {
         if (count == 1) {

         } else if (index == count - 1) {
            $(".screen-overlay").backstretch("destroy", true);
            $(".screen-overlay").backstretch(pics, {duration: 2000, fade: 500});
         }
      }
   } else {

      // $(".screen-overlay").backstretch("destroy", true);
   }
});

 function backStretchMe() {
   $(".screen-overlay").backstretch(pics);
}

function getParameterByName(name, url) {
   if (!url) {
     url = window.location.href;
   }
   name = name.replace(/[\[\]]/g, "\\$&");
   var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
       results = regex.exec(url);
   if (!results) return null;
   if (!results[2]) return '';
   return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function RandomHexColor() {
   return  "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
}

function InitSocket () {
if (settings && !socket) {

   socket = io.connect(socketHost, {
         query : {
            token: token,
            uname: avatarName,
            color: RandomHexColor(),
            room: room
         },
         url: socketHost + "/socket.io/?EIO=4&transport=polling&t=NNjNltH",
         autoConnect: false,  //connection is opened if token checks out above
         reconnection: false
         });      
      }

   socket.on('connect', function() {
   
      isConnected = true;
      console.log("tryna join " + avatarName + " socketID " + socket.id);
      mySocketID = socket.id;
      socket.emit('join', room, avatarName, "web");
   
   });

   socket.on('user joined', function(data) {
      console.log(data + 'joined room ' + room);
      socket.emit('room users', room);
      UpdatePlayerAvatars(roomUsers);
      EmitSelfPosition();
   });

   socket.on('admin message', function (data) {
      console.log('recieved admin message : ' + data + ' in room ' + room);
      if (data.toString().toLowerCase() == "next") {
         GoToNext();
      }
   });

   socket.on('room users', function (data) {
   //  console.log("room users data : " + data);
   $('#users').html("");

      roomUsers = JSON.parse(data);

      UpdatePlayerAvatars(roomUsers);
      let roomUsersString = "";
      // console.log("room users count = " +roomUsers.length);
      let usercount = 0;
         // for (let value of Object.values(roomUsers)) { //key = socket.id, value= username
      
         // console.log(value); 
         // usercount++;
         // //   $('#users').prepend($('<button class=\x22btn\x22 style=\x22margin: 5px 5px 5px 5px;\x22><h4><strong>').text( value ).append("</strong></h4></button>"));
         //    if (value.includes("~")) {
         //       split = value.split("~"); //color is appended to username
         //       roomUsersString += "<a href=\x22#\x22 style=\x22color:"+split[1]+"\x22>"+split[0]+"</a>, ";
         //    } else {
         //       roomUsersString += value + ", ";
         //    }   
         // }
      var keys = Object.keys(roomUsers);
      for(var i=0; i<keys.length; i++){
         var key = keys[i];
         var isMe = "";
         // console.log(key, roomUsers[key]);
         if (key === socket.id) {
            isMe = "*";
            // console.log("key isMe " + key);
         }
         value = roomUsers[key];
         // console.log("roomUsers key:value: " + key + " " + value); 
         usercount++;
      //   $('#users').prepend($('<button class=\x22btn\x22 style=\x22margin: 5px 5px 5px 5px;\x22><h4><strong>').text( value ).append("</strong></h4></button>"));
         if (value.includes("~")) {
            split = value.split("~"); //color is appended to username
            split[0] = split[0].replace("_", " ");
            roomUsersString += isMe + "<a href=\x22#\x22 class=\x22tooltip\x22 style=\x22color:"+split[1]+"\x22>"+ split[0]+"<span class=\x22tooltiptext\x22>"+split[0]+"</span></a>, ";
         } else {
            roomUsersString += value + ", ";
         }   
      }
      roomUsersString = roomUsersString.substring(0, roomUsersString.length - 2); //trim last comma and trailing space
      roomUsersString = usercount + " users connected: " + roomUsersString;
      // console.log(roomUsersString);
      $('#users').html(roomUsersString);
      stringRoomUsers = roomUsersString;
      // $('#users_2').html(roomUsersString);
      EmitSelfPosition();
   });

   socket.on('getbytes', function (data, metadata) {
         //TODO split the incoming wad and build array(s) of pics, audio, etc based on metadata
         console.log("tryna parse some bytes");
   });

   socket.on('getpicframe', function (data, sid) {

      
      console.log("getting pic frame from " + sid + " roomUsers " + JSON.stringify(roomUsers));
      let userName = "";
      var keys = Object.keys(roomUsers);
      for(var i=0; i<keys.length; i++){
         var key = keys[i];
         console.log(key, roomUsers[key]);
         if (keys[i] === sid) {
            console.log(roomUsers[key] + " sent a pic frame!");
            userName = roomUsers[key];
         }
      }   
      // foreach(var user in roomUsers) {
      //    if (user.key == socket.id) {
      //       console.log(user.value + " sent a pic frame!");
      //    }
      
      // }
      var instance = $('body').data('backstretch');
      var base64 = _arrayBufferToBase64(data);
      var imgSrc = "data:image/jpg;base64," + base64;
      // if (instance === undefined) {
      //     pics.push(imgSrc);
      //     // $(".screen-overlay").backstretch(pics, {duration: 1000, fade: 250});
      //         $(".screen-overlay").backstretch(imgSrc);
      // } 
      // $(".screen-overlay").backstretch("destroy", true);
      // $(".screen-overlay").backstretch(pics);
      // $(".screen-overlay").backstretch(imgSrc, {fade: 250});
      // $('#future').prepend($('<span style=\x22margin: 5px 5px 5px 5px;\x22 class=\x22smallfont_lightyellow\x22>').text( "<"+ userName + " <a id="+socket.id+" href=\x22#\x22>sent a pic</a>").append("</span><hr>"));
      $('#future').prepend($("<span style=\x22margin: 5px 5px 5px 5px;\x22 class=\x22smallfont_lightyellow\x22>-"+ userName + " <button class=\x22btn picbutton\x22 id="+sid+" href=\x22#\x22>sent a pic</button></span><hr>"));
      UpdateContentBox();
         if (pics.length < 1) {
            
            pics.push(imgSrc);
            // picsBuffer = pics;
            // console.log("pushing pic # " + pics.length);
            if (!instance) {
                  $(".screen-overlay").backstretch(pics, {duration: 1000, fade: 250});
            }
         } 

      if (picArrayIndex < 20) {
      if (pics < picArrayIndex) {
         pics.push(imgSrc);
         // $(".screen-overlay").backstretch(imgSrc);
      } else {
         pics.splice(picArrayIndex, 1, imgSrc);  
      }
      picArrayIndex++;
      } else {
      picArrayIndex = 0;
      pics.splice(picArrayIndex, 1, imgSrc);
      picArrayIndex++;
      }

   });

   socket.on('getaudiochunk', function (data){
      console.log("messages data : " + data);

   });

   socket.on('user messages', function(data1, data2) {
         console.log("messages data : " + data1 + data2);
         // $('#future').prepend($('<div class=\x22row bubble pull-left\x22 style=\x22margin: 5px 5px 5px 5px;\x22><span class=\x22smallfont_yellow\x22>').text( data1 + ": " + data2).append("</span></div>"));
         // $('#future').prepend($('<span style=\x22margin: 5px 5px 5px 5px;\x22 class=\x22smallfont_lightyellow\x22>').text( "<"+ data1 + ": " + data2).append("</span>"));
         $('#future').prepend("<div class=\x22messageBubbleIn\x22 style=\x22float: left;\x22>"+ data1 + ": " + data2 + "</div><br><br><br>");
         if ($('#future li').length > 555) {
            $('#future li').last().remove();
         }
         // UpdateContentBox();
   });

   socket.on('playerposition', function(uname, posX, posY, posZ, rotX, rotY, rotZ, socketID, source) {
      // console.log("player position data : " + uname + "x " + posX + " y " + posY + " z " + posZ + " rx " + rotX + " ry " + rotY + " rz " + rotZ + " sid " + socketID + " from " + source);
      let pAvatar = document.getElementById(socketID);
      // console.log("pAvatar is " + JSON.stringify(pAvatar));
      // pAvatar.setAttribute('lerp', {'position': posObj, 'rotation': rotObj});
      if (pAvatar != null) { //TODO Interpolation!
         if (source == "unity") {
            posZ = posZ * -1;
         }
         const posObj = {};
         posObj.x = posX;
         posObj.y = posY;
         posObj.z = posZ;
         const rotObj = {};
         rotObj.x = rotX;
         rotObj.y = rotY;
         rotObj.z = rotZ;
         // pAvatar.setAttribute('lerp', {'position': posObj, 'rotation': rotObj});
         // const posRotObj = {position: posX + "," + posY + "," + posZ, rotation: rotX + "," + rotY + "," + rotZ};
               const posRotObj = {}
               posRotObj.position = posObj;
               posRotObj.rotation = rotObj;
               var mover = pAvatar.components.mover; //much easier
               // MoveElement(socketID, posRotObj);
               // const event = new CustomEvent('update_pos_rot', {detail: posRotObj}, false);
               // console.log("tryna dispatchEvent " + event);
               // pAvatar.dispatchEvent(event);
               mover.move(socketID, posObj, rotObj);
         // pAvatar.setAttribute('position', posX + " " + posY + " " + posZ);
         // pAvatar.setAttribute('rotation', rotX + " " + rotY + " " + rotZ);
      } else {
         UpdatePlayerAvatars(roomUsers);
      }
      EmitSelfPosition();
   });

   socket.on('selfplayerposition', function() {
      let pAvatar = document.getElementById(mySocketID);
      if (pAvatar != null) {
         pAvatar.setAttribute('position', cameraPosition.x + " " + cameraPosition.y + " " + cameraPosition.z);
      }
   });

   socket.on('disconnect', function() {
      UpdatePlayerAvatars(roomUsers);
   });
   socket.on('user left', function(id) {
      console.log("user left with socket id " + id);
   });
} //InitSocket end
// } //end if settings.hideAvatars
function MoveElement(id,posRotObj) { //jesjus wweeeeped
   var element = document.getElementById(id);
   var iteration = 0;
   var interval = setInterval(function() {
      iteration++
      if (iteration < 10) { 
         var currentPos = element.getAttribute('position');
         var lerpedPos = {};
         lerpedPos.x = lerp(currentPos.x, posRotObj.position.x, .1).toFixed(2);
         lerpedPos.y = lerp(currentPos.y, posRotObj.position.y, .1).toFixed(2);
         lerpedPos.z = lerp(currentPos.z, posRotObj.position.z, .1).toFixed(2);
         var currentRot = element.getAttribute('rotation');
         var currentQuat = Quaternion.fromEuler(currentRot);
         var lerpedRot = {};
         // var lerpedQuat = {};
         var targetQuat = Quaternion.fromEuler(posRotObj.rotation);
         var lerpedQuat = currentQuat.slerp(targetQuat)(0), currentQuat;
         //(q1.slerp(q2)(0), q1);

         // lerpedRot.x = 
         // lerpedRot.x = lerp(currentRot.x, posRotObj.rotation.x, .1).toFixed(2);
         // lerpedRot.y = lerp(currentRot.y, posRotObj.rotation.y, .1).toFixed(2);
         // lerpedRot.z = lerp(currentRot.z, posRotObj.rotation.z, .1).toFixed(2);
         console.log("currentRot " + JSON.stringify(currentRot) + "updatedRot " + JSON.stringify(posRotObj.rotation), " lerpedRot " + JSON.stringify(lerpedQuat));
         element.setAttribute('position', lerpedPos);
         element.setAttribute('rotation', Quaternion.lerpedQuat.toVector());
      } else {
         clearInterval(interval);
      }
   }, 100);
}

// socket.on('selfplayerposition', function() {
//    let pAvatar = document.getElementById(mySocketID);
//    if (pAvatar != null) {
//       pAvatar.setAttribute('position', cameraPosition.x + " " + cameraPosition.y + " " + cameraPosition.z);
//    }
// });

// socket.on('disconnect', function() {
//    UpdatePlayerAvatars(roomUsers);
// });
// socket.on('user left', function(id) {
//    console.log("user left with socket id " + id);
// });
// function lerp (start, end, amt){
//    return (1-amt)*start+amt*end
//  }
function lerp(v0, v1, t) {
   return v0*(1-t)+v1*t
}

function SetLastPosition () {
   setTimeout(function () {
      lastPosition = cameraPosition;
      lastRotation = cameraRotation;
   }, 1000);
}


function EmitSelfPosition() {


   if (!settings.hideAvatars) {   
      console.log("tryna EmitSelfPosition()");
      if (posRotReader != null) {   
         if (!posRotRunning) {
            posRotRunning = true;
            // if (emitInterval == null) { 
            emitInterval = setInterval(function(){

               var posRotObj = posRotReader.returnPosRot();
               cameraPosition = posRotObj.pos;
               cameraRotation = posRotObj.rot;
               // console.log(cameraPosition.x.toString() + " vs " + window.playerPosition.x.toString());
               // if (JSON.stringify(cameraPosition) != lastPosition && JSON.stringify(cameraRotation) != lastRotation) {
               if (JSON.stringify(cameraPosition) != lastPosition) {
                     // console.log('emitting!');
                  // window.playerPosition = cameraPosition;
                  if (socket) {
                     socket.emit("updateplayerposition", room, avatarName, cameraPosition.x, cameraPosition.y, cameraPosition.z, cameraRotation.x, cameraRotation.y, cameraRotation.z, mySocketID, "aframe"); 
                  }
                  
                  lastPosition = JSON.stringify(cameraPosition);
                  // lastRotation = JSON.stringify(cameraRotation);                     
               }

            }, 250);
         // } else {
         //    clearInterval(emitInterval);
         //    emitInterval = null;
         }
      } else {
         // console.log("caint fine no player!");
         posRotReader = document.getElementById("player").components.get_pos_rot; 
         // EmitSelfPosition();
      }
   }
}
function shallowEqual(object1, object2) {
   const keys1 = Object.keys(object1);
   const keys2 = Object.keys(object2);
 
   if (keys1.length !== keys2.length) {
      lastPosition = cameraPosition;
      lastRotation = cameraRotation;
      return false;
     
   }
 
   for (let key of keys1) {
     if (object1[key] !== object2[key]) {
       return false;
     }
   }
 
   return true;
 } 

// $('form').submit(function(e){
//     e.preventDefault();
//     var message = $('#chat_input').val();
//     console.log("tryna send " + message);
//     $('#future').prepend($('<span style=\x22margin: 5px 5px 5px 5px;\x22 class=\x22smallfont_lightgreen\x22>').html( ">you:</span> " +  message).append("<hr>"));
//     socket.emit('user message', message); //but not to ourselfs
//     UpdateContentBox();
//     document.getElementById("chat_input").value = "";
// });
function SendChatMessage() {
   if (socket) {
      var message = $('#chat_input').val();
      if (message.length > 0) {
      message = $('<div>').text(message).html(); //sanitize with wierd jquery fu
      console.log("tryna send " + message);
      if (message.includes("https://")) {
         message = "<a href=\x22"+message+"\x22 target=\x22_blank\x22>"+message+"</a>";
      }
      $('#future').prepend("<div class=\x22messageBubbleOut\x22 style=\x22float: right;\x22>you:</span> " +  message +"</div><br><br><br>");
      // $('#future').prepend($('<div style=\x22float: right;\x22><span style=\x22margin: 5px 5px 5px 5px;\x22 class=\x22smallfont_lightgreen\x22>').html( ">you:</span> " +  message +"</div>").append("<hr>"));
      if (socket) {
         socket.emit('user message', message); //but not to ourselfs
      }
      
      UpdateContentBox();
      document.getElementById("chat_input").value = "";
      }
   } else {
      console.log("socket not connected..");
      $('#future').prepend("<div class=\x22messageBubbleOut\x22 style=\x22float: right;\x22></span>Socket Not Connected!</div><br><br><br>");
   }
}
function ValidateEmail(mail) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true)
  }
    alert("You have entered an invalid email address!")
    return (false)
}
function SendInvitation() {
   if (!userData.isGuest) {
      let data = {};
      let inviteEmail = document.getElementById("email_input").value;
      let inviteMessage = document.getElementById("chat_input").value;
      if (inviteEmail != null && ValidateEmail(inviteEmail)) {
         data.sceneShareWithPeople = [];
         
         data.sceneShareWithPeople.push(inviteEmail);
         
         data.sceneShareWithMessage = inviteMessage;
         data.sceneTitle = settings.sceneTitle;
         data.sceneKeynote = settings.sceneKeynote;
         data.sceneDescription = settings.sceneDescription;
         data.short_id = room;
         data.sceneEventStart = settings.sceneEventStart;
         data.sceneEventEnd = settings.sceneEventEnd;
         data.sceneAccessLinkExpire = settings.sceneAccessLinkExpire;
         data._id = settings._id;
         console.log(JSON.stringify(data));
         var xhr = new XMLHttpRequest();
         xhr.open("POST", '/share_scene/', true);
         xhr.setRequestHeader('Content-Type', 'application/json');
         xhr.send(JSON.stringify(data));
         xhr.onload = function () {
            // do something to response
            document.getElementById("emailContainer").innerHTML = "Invitation Sent!";
            console.log(this.responseText);
            if (this.responseText.includes("Invitations sent: ")) {
               console.log("sent!"); 
            } else {
               console.log("not sent!");
               document.getElementById("emailContainer").innerHTML = this.responseText;
            }
         };
      }
   }
   // axios.post('/share_scene/', data)
   //     .then(function (response) {
   //         console.log(response);
   //        if (response.data.includes("Invitations sent: ")) {
   //             // window.location.reload();
   //             $("#topSuccess").html(response.data);
   //             $("#topSuccess").show();
   //         } else {
   //             $("#topAlert").html(response.data);
   //             $("#topAlert").show();
   //         }
   //     })                      
   //     .catch(function (error) {
   //         console.log(error);
   //     });
   // },
   // cancel: function () {
   //     $("#topAlert").html("Update cancelled");
   //     $("#topAlert").show();
   // }
}

function _arrayBufferToBase64( buffer ) {
   var binary = '';
   var bytes = new Uint8Array( buffer );
   var len = bytes.byteLength;
   for (var i = 0; i < len; i++) {
       binary += String.fromCharCode( bytes[ i ] );
   }
   return window.btoa( binary );
}

//todo -  mod EmitSelfPosition to send lat/lng/elevation instead if mapbox mode
//todo - get a list of all OTHER players than me, with updated locations attached
function ReturnPlayerData() { //return my un/color to set marker at current map coordinates
   if (sceneEl != null) {
      mode = "mapbox"; //this is called only from mapbox context in location-fu
      var keys = Object.keys(roomUsers);
      for(var i=0; i<keys.length; i++) { //create new avatars as needed
      var key = keys[i];
         if (key == socket.id) {
            console.log("player " + roomUsers[key]);
            return roomUsers[key];
         }
      }
   }
}
function Disconnect() {
   console.log("tryna disconnect..");
   socket.disconnect();
   let roomAvatars = sceneEl.querySelectorAll('.avatar');
   for (var a=0; a<roomAvatars.length; a++) { //clean up disconnected avatars
      roomAvatars[a].remove();
   }
   $('#users').html("disconnected");
   // document.querySelector("avatar").style.visibility = "hidden";
}

if (sceneEl != null) {
AFRAME.registerComponent('create_avatars', {
   schema: {
     isNew: {default: ''}
   },
   init: function() {
     
   },
   createAvatar: function (key) {
     console.log("tryna createAvatar");
   //   var sceneEl = document.querySelector('a-scene');
   //   let phEl = document.createElement("a-entity");
     
   //   phEl.setAttribute('moveable-placeholder', {isNew: true, name: 'new location'});
   //   // phEl.setAttribute('isNew', true);
   //   sceneEl.appendChild(phEl);
   let avatar = document.createElement("a-entity"); //this make bad!
   // let avatar = sceneEl.createElement("a-entity");
   // avatar.setAttribute('avatar-pos-rot');
   avatar.classList.add("avatar");
   let userSplit = roomUsers[key].split("~"); //color appended to username after tilde on server
   let color = "blue";
   if (userSplit.length > 1) {
      color = userSplit[1];
      if (!color.includes("#")) {
         color = "#" + color;
      }
   }
   avatar.setAttribute('avatar-callout', {'calloutString': userSplit[0], 'hexColor': color});
   // avatar.setAttribute('lerp', {});
   avatar.setAttribute('mover', 'eltype', 'avatar');   
   avatar.id = key; //assign id for #lookups
   this.el.sceneEl.appendChild(avatar);
   
   }
 });
}
function UpdatePlayerAvatars(roomUsers) { //aframe only, need to flex.. //no, just make this a component function, to avoid creating a-entities outside of aframe
   console.log("tryna UpdatePlayerAvatars" + JSON.stringify(roomUsers));
   
   if (sceneEl != null && (settings.sceneType == "aframe" || settings.sceneType == "AFrame" || settings.sceneType == "Default") && !settings.hideAvatars && roomUsers) {
      var keys = Object.keys(roomUsers);
      var alreadyCreated = ""; //temp string to prevent doubles
      for(var i=0; i<keys.length; i++) { //create new avatars as needed
         
         var key = keys[i];
         // console.log("tryna UpdatePlayerAvatars " + key + " " + roomUsers[key] + " vs " + socket.id);
            if (key != socket.id) { //don't make one for ourselves, only other users..
            // console.log(key + " " + roomUsers[key] + sceneEl.querySelector('#' + keys[i]));

            let avatarEl = document.getElementById('#' + keys[i]); //maybe not catching this in time, since it was just created
            if (!avatarEl && !alreadyCreated.includes(key)) {
               console.log("tryna create avatar for " + roomUsers[key]);
               alreadyCreated += key;
               let createAvatarEl = document.getElementById('createAvatars');
               if (createAvatarEl) {
                  let createAvatarComponent = createAvatarEl.components.create_avatars;
                  if (createAvatarComponent)
                  createAvatarComponent.createAvatar(key); //YES, it's below, but...
               }
               // let avatar = document.createElement("a-entity"); //this make bad!
               // // let avatar = sceneEl.createElement("a-entity");
               // // avatar.setAttribute('avatar-pos-rot');
               // avatar.classList.add("avatar");
               // let userSplit = roomUsers[key].split("~"); //color appended to username after tilde on server
               // let color = "blue";
               // if (userSplit.length > 1) {
               //    color = userSplit[1];
               //    if (!color.includes("#")) {
               //       color = "#" + color;
               //    }
               // }
               // avatar.setAttribute('avatar-callout', {'calloutString': userSplit[0], 'hexColor': color});
               // // avatar.setAttribute('lerp', {});
               // avatar.setAttribute('mover', 'eltype', 'avatar');   
               // avatar.id = keys[i]; //assign id for #lookups
               // sceneEl.appendChild(avatar);
            }
         }
      }

      let roomAvatars = sceneEl.querySelectorAll('.avatar');
      console.log("roomAvatars " + roomAvatars);
      var dupeCheck = "";
      for (var a=0; a<roomAvatars.length; a++) { //clean up disconnected avatars
         let active = false;
         for(var i=0; i<keys.length; i++) {
            var key = keys[i];
            // console.log("checking key, roomUsers[key]);
            if (roomAvatars[a].id == key && !dupeCheck.includes(key)) {
               active = true;
               dupeCheck += key
               console.log("room avatar active " + key);
            }
         }
         if (!active) {
            console.log("tryna remove " + roomAvatars[a].id)
            roomAvatars[a].remove();
         }
      }
   }
}

function AvatarClicked(sid) {
   console.log("AvatarClicked " +sid);
   SceneManglerModal('Messages');
}

function UpdatePlayerPosition(sid, px, py, pz) { //nevermind
   var keys = Object.keys(roomUsers);
   for(var i=0; i<keys.length; i++){
      var key = keys[i];
      console.log(key, roomUsers[key]);
      if (keys[i] === sid) {
         console.log(roomUsers[key] + " is moving!");
         
      }
   }
}

InitContentBox();
// window.onload = init;
// if (document.querySelector(".avatarName")) {
//    avatarName = document.querySelector(".avatarName").id;
// }

var context;    // Audio context
var buf;        // Audio buffer

function InitSceneHooks(type) {
   // window.sceneType = type; //global that needs to get sniffed
   console.log("tryna InitSceneHooks window.sceneType " + window.sceneType);
   if (window.sceneType == "Default" || window.sceneType == "AFrame") {
      window.sceneType == "aframe";
      EmitSelfPosition();
   }   
}

function ShowARButton (usdzURL) { //for iOS only

   // $(".enter-ar").css('visibility',"visible");
   // "<div id=\x22arButton\x22 class=\x22ar-button-div\x22><button class=\x22a-enter-ar-button\x22></button></div>";
    //should only be true on recent ios devices
    console.log("tryna ShowARButton for " + usdzURL);
   let isIOS = (/iPad|iPhone|iPod/.test(navigator.platform) ||
   (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
   !window.MSStream;
   // if (isIOS) {
   //    console.log("isIOS is true!");
   //    let vrButton = document.querySelector("")
   //    document.querySelector(".a-enter-vr-button").style.display = 'none';
   // }
   const a = document.createElement('a');
   supportsAR = a.relList.supports('ar') ? true : false;
   // supportsAR = true;
   if (isIOS || supportsAR) {
   console.log("tryna make an ar button for " +  usdzURL);
   // sceneEl.setAttribute("vr-mode-ui", "enabled", "false");
   // const bdiv = document.createElement('div');
      // bdiv.classList.add('a-enter-ar');
   // const button = document.createElement('a');
   const button = document.querySelector(".ar-button");
   button.id = "arButton";
   // button.classList.add('ar-button');
   // button.innerHTML = "AR";
   // button.setAttribute('href', usdzURL);
   button.href = usdzURL;
   button.style.display = "inline";
   // bdiv.appendChild(button);
   // document.body.appendChild(button);
   // button.addEventListener('click', function() {
   //    const anchor = document.createElement('a');
   //    anchor.setAttribute('rel', 'ar');
   //    anchor.appendChild(document.createElement('img'));//needs a fake img too
   //    anchor.setAttribute('href', usdzURL);
   //    anchor.click();
   //    });
      } else {
            console.log("platform doesn't support apple xr files");
            
      }


}

// function PreviewUSDZ(usdzSrc) { //or reality files
//    console.log("tryna load a usdz " + usdzSrc);
//    // check for AR support
//   const a = document.createElement('a'),
//        supportsAR = a.relList.supports('ar') ? true : false;

//    // if the host device supports AR Quick Look...
//    if ( supportsAR ) {
//        const anchor = document.createElement('a');
//        anchor.setAttribute('rel', 'ar');
//        anchor.appendChild(document.createElement('img'));
//        anchor.setAttribute('href', usdzSrc);
//        anchor.click();
//    } else {
//        console.log("unsupported environment for usdz (must be ios!)");
//    }

// }

// function 
// function 
function playByteArray(byteArray) {

   var arrayBuffer = new ArrayBuffer(byteArray.length);
   var bufferView = new Uint8Array(arrayBuffer);
   for (i = 0; i < byteArray.length; i++) {
     bufferView[i] = byteArray[i];
   }

   context.decodeAudioData(arrayBuffer, function(buffer) {
       buf = buffer;
       play();
   });
}

// Play the loaded file
function play() {
   // Create a source node from the buffer
   var source = context.createBufferSource();
   source.buffer = buf;
   // Connect to the final output node (the speakers)
   source.connect(context.destination);
   // Play immediately
   source.start(0);
}

function UpdateContentBox() { //nm for now
   // console.log("tryna update content box");
   // var coll = document.getElementsByClassName("collapsible");
   // var i;

   // for (i = 0; i < coll.length; i++) {
   //    var content = coll[i].nextElementSibling;
   //       content.style.maxHeight = content.scrollHeight + "px";

   // }
}

function InitContentBox () {
   console.log("tryna InitContentBox");
   var coll = document.getElementsByClassName("collapsible");
   var i;

   for (i = 0; i < coll.length; i++) {
   coll[i].addEventListener("click", function() {
      console.log("collapsible click");
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.maxHeight){
         content.style.maxHeight = null;
      } else {
         content.style.maxHeight = content.scrollHeight + "px";
      }
   });
   }
}
function ShowHideContentBox () {
   var coll = document.getElementsByClassName("collapsible");
   
   coll[0].click();
   // for (i = 0; i < coll.length; i++) {
   //    console.log("collapsible click");
   //    coll[i].classList.toggle("active");

   // }
}
// function HideAll() {
//    let overlay = document.getElementById('canvasOverlay');
//    overlay.style.display = 'none';
// }
// function ShowAll() {
//    let overlay = document.getElementById('canvasOverlay');
//    overlay.style.display = 'block';
// }
// function PlayerToLocation (timestamp) { //locationIDs = timestamp, unique in scene
//    sceneLocations.locations;
// }

function PlayPausePrimaryAudio() {
   
   var primaryAudioController = document.getElementById("primaryAudio").components.primary_audio_control; 
   primaryAudioController.playPauseToggle(); 
}
function InitPrimarySlider() {
// let modal = document.getElementById('modalContent');
let primaryAudioSlider = document.getElementById("primaryAudioVolumeSlider");
   if (primaryAudioSlider != undefined) {
      // let storedPrimaryVolume = localStorage.getItem(room+"_primaryVolume");
      // if (storedPrimaryVolume != null) {
      //    primaryAudioSlider.value = storedPrimaryVolume;
      // }

      UpdatePrimaryAudioVolume(primaryAudioSlider.value);
      primaryAudioSlider.oninput = function() {
      // output.innerHTML = this.value;
      UpdatePrimaryAudioVolume(this.value);
      volumePrimary = this.value;
      // localStorage.setItem(room+"_primaryVolume", this.value);
      }
   }
}
function InitAmbientSlider () {
   // let modal = document.getElementById('modalContent');
 let ambientAudioSlider = document.getElementById("ambientAudioVolumeSlider");
   if (ambientAudioSlider != null) {
      // let storedAmbientVolume = localStorage.getItem(room+"_ambientVolume");
      // if (storedAmbientVolume != null) {
      //    ambientAudioSlider.value = storedAmbientVolume;
      // }
      // UpdateAmbientAudioVolume(ambientAudioSlider.value);
         ambientAudioSlider.oninput = function() {
         UpdateAmbientAudioVolume(this.value);
         volumeAmbient = this.value;
         // localStorage.setItem(room+"_ambientVolume", this.value);
      }
   }
}
function InitTriggerSlider () {
   // let modal = document.getElementById('modalContent');
 let triggerAudioSlider = document.getElementById("triggerAudioVolumeSlider");
   if (triggerAudioSlider != null) {
      // let storedTriggerVolume = localStorage.getItem(room+"_triggerVolume");
      // if (storedTriggerVolume != null) {
      //    triggerAudioSlider.value = storedTriggerVolume;
      // }
      UpdateTriggerAudioVolume(triggerAudioSlider.value);
      triggerAudioSlider.oninput = function() {
         volumeTrigger = this.value;
         UpdateTriggerAudioVolume(this.value);
         // localStorage.setItem(room+"_triggerVolume", this.value);
      } 
   }
}
   // function SetLocationData(locationData) {
   //    console.log("locationData " + JSON.stringify(locationData));
   //    // let locations = locationData;
   //    sceneLocations.locations = locationData;
      
   //    // console.log("locationData " + JSON.stringify(sceneLocations));
   // }

function UpdatePrimaryAudioVolume(newVolume) {
   var primaryAudio = document.getElementById("primaryAudio");
   if (primaryAudio != null) {
      var primaryAudioController = document.getElementById("primaryAudio").components.primary_audio_control; 
      if (primaryAudioController != null) {
         primaryAudioController.modVolume(newVolume);
      }   
   }
   // localStorage.setItem(room+"_primaryVolume", newVolume);
}
function UpdateAmbientAudioVolume(newVolume) {
   var ambientAudioController = document.getElementById("ambientAudio").components.ambient_audio_control; 
   if (ambientAudioController != null) {
      ambientAudioController.modVolume(newVolume);
   }
}
function UpdateTriggerAudioVolume(newVolume) {
   var triggerAudioEl = document.getElementById("triggerAudio");
   if (triggerAudioEl) {
      var triggerAudioController = triggerAudioEl.components.trigger_audio_control;
      if (triggerAudioController != null) {
         triggerAudioController.modVolume(newVolume);
      }
   }
}

//////////////////////////////////////////////// move to primary-audio-control ... //no!

function SetPrimaryAudioEventsData () {

   timeKeysData = JSON.parse(localStorage.getItem(room+ "_timeKeys"));
   console.log("setting primary audio events data! " + JSON.stringify(timeKeysData));
   tkStarttimes = [];
   if (timeKeysData != undefined && timeKeysData != null && timeKeysData.timekeys != undefined && timeKeysData.timekeys.length > 0 )
      timeKeysData.timekeys.forEach(function (timekey) {
      tkStarttimes.push(parseFloat(timekey.keystarttime).toFixed(2));
   });
   tkStarttimes.sort(function(a, b){
      return a - b;
   });

   timedEventsListenerMode = "Primary Audio"; 
   TimedEventListener();

}

// function SetVideoEventsData (eventsData) { 
//    console.log("SetVideoEventsData()");
//    if (eventsData != undefined) {
//       timekeys = []; //either audio or video, not both
//       timeKeysData = eventsData;

//       timeKeysData.forEach(function (timekey) {
//          console.log("timekey " + timekey.keystarttime);
//          timekeys.push(parseFloat(timekey.keystarttime).toFixed(2));
//    });
//    timekeys.sort(function(a, b){
//          return a - b;
//       });
//    console.log("timekeys: " + timekeys);
//    if (timekeys.length > 0) {
//       TimedEventsListener();
//       }
//    }
//   // console.log(primaryAudioHowl.seek() + " tryna SetPrimaryAudioEventsData" + json);
// }

// function TimedEventsListenerOld () {
//    console.log("TimedEventsListener for timekeys: " + JSON.stringify(timeKeysData));
//    let primaryAudioTime = 0;
//    let timeKeysIndex = 0;
//    let timekey = 0;
//    let vidz = document.getElementsByTagName("video");
//    let primaryAudioEl = document.querySelector('#primaryAudio');
//    let hasPrimaryAudio = false;
//    let videoEl = null;

//    // console.log("MODAL STATS " + modalStats);
//    // let vidz = document.getElementsByTagName("video");
//    if (vidz != null && vidz.length > 0) { //either video or audio, not both...?
//      videoEl = vidz[0];
//      console.log("videoEl " + videoEl.id);
//    }
//    if (primaryAudioEl != null) {
//      hasPrimaryAudio = true;
//    }
//    // if (vidz != null && vidz.length > 0) { //either video or audio, not both...?
//    //   videoEl = vidz[0];
//    // }
   
//    let interval = setInterval(function () {
//       timekey = parseFloat(tkStarttimes[timeKeysIndex]);
//       // console.log(timekey);
//    if (timekey != NaN) {
//       // console.log(timekey);
//       if (hasPrimaryAudio) {
//          if (primaryAudioHowl != null && primaryAudioHowl != undefined && primaryAudioHowl.playing()) {
//          primaryAudioTime = primaryAudioHowl.seek();
//          // primaryAudioTime = primaryAudioTime.toFixed(2);
//          // timekey = parseFloat(timekeys[timeKeysIndex]);
//          // console.log("currentAUDIOTIme " + primaryAudioTime + " vs timekey " + timekey);
//             if (primaryAudioTime <= timekey) {
//                   // console.log(primaryAudioTime + "less than " + timekeys[timeKeysIndex]);
//                   //just waiting...
//                } else {
//                      if (timeKeysIndex < tkStarttimes.length) {
//                         PlayTimedEvent(timeKeysData.timekeys[timeKeysIndex]);
//                         timeKeysIndex++;
//                      } else {
//                         console.log("end");
//                         clearInterval(interval);
//                      }
//                }

//             }
//       } else if (videoEl != null && !videoEl.paused && timekey > 0){
         
//       } else {
         
//       }
//    }
//    }, 50);
// }

// function PlayAudioEvent(timeKey) {
//    console.log("event: " + JSON.stringify(timeKey));  
//    // // let timekey = JSON.parse(timeKey);
//    // console.log("event: " + timeKey.keytype);
//    var player = document.getElementById("player");
//    player.setAttribute("player_mover", "init");
//    let duration = 1;
//    let posObj = {};
//    let rotObj = {};
//       if (timeKey.keytype.includes('beat')) {
         

//       } 
//       if (timeKey.keytype == "Player Snap") {
//          // console.log("sceneLocations length is " + sceneLocations.locations.length);
//       // if (sceneLocations.locations.ength > 0) {
//          for (let s = 0; s < sceneLocations.locations.length; s++) {
//             // posObj = {};
//             // rotObj = {};

//             // console.log(timeKey.keydata.toString() + " vs " + sceneLocations.locations[s].label.toString());
//             if (sceneLocations.locations[s].label != undefined && timeKey.keydata.toString() == sceneLocations.locations[s].label.toString() && sceneLocations.locations[s].markerType == "poi") {
//                posObj.x = sceneLocations.locations[s].x;
//                posObj.y = sceneLocations.locations[s].y;
//                posObj.z = sceneLocations.locations[s].z;
//                rotObj.x = sceneLocations.locations[s].eulerx != null ? sceneLocations.locations[s].eulerx : 0;
//                rotObj.y = sceneLocations.locations[s].eulery != null ? sceneLocations.locations[s].eulery : 0;
//                rotObj.z = sceneLocations.locations[s].eulerz != null ? sceneLocations.locations[s].eulerz : 0;
//                console.log(JSON.stringify(timeKey) + " tryna fire event Player Snap to " + JSON.stringify(sceneLocations.locations[s]));
//                player.components.player_mover.move('player', posObj, rotObj, 0); //
//                // document.getElementById("player").setAttribute("position", sceneLocations.locations[s].x + " " + sceneLocations.locations[s].y + " " + sceneLocations.locations[s].z);
//                // document.getElementById("player").setAttribute("rotation", sceneLocations.locations[s].eulerx + " " + sceneLocations.locations[s].eulery + " " + sceneLocations.locations[s].eulerz);
//             } else {
//                // console.log("label not found");
//             }
//          }
//       } 
//       if (timeKey.keytype == "Player Lerp") {
//          console.log("sceneLocations length is " + sceneLocations.locations.length);
//       // if (sceneLocations.locations.ength > 0) {
//          // console.log("event: " + JSON.stringify(timeKey));
//          for (let s = 0; s < sceneLocations.locations.length; s++) {
//             // console.log(timeKey.keydata + " vs " + JSON.stringify(sceneLocations.locations[s]));
//             if (sceneLocations.locations[s].label != undefined && timeKey.keydata.toString() == sceneLocations.locations[s].label.toString() && sceneLocations.locations[s].markerType == "poi") {
//                // posObj = {};
//                // rotObj = {};
//                posObj.x = sceneLocations.locations[s].x;
//                posObj.y = sceneLocations.locations[s].y;
//                posObj.z = sceneLocations.locations[s].z;
//                rotObj.x = sceneLocations.locations[s].eulerx != null ? sceneLocations.locations[s].eulerx : 0;
//                rotObj.y = sceneLocations.locations[s].eulery != null ? sceneLocations.locations[s].eulery : 0;
//                rotObj.z = sceneLocations.locations[s].eulerz != null ? sceneLocations.locations[s].eulerz : 0;
//                // document.getElementById("player").setAttribute("position", sceneLocations.locations[s].x + " " + sceneLocations.locations[s].y + " " + sceneLocations.locations[s].z);         
//                duration = timeKey.keyduration;
//                // console.log(JSON.stringify(timeKey) + " vs " + videoEl.currentTime + " tryna fire event Player lerp to " + JSON.stringify(posObj));
//                player.components.player_mover.move('player', posObj, rotObj, duration);
//             } else {
//                // console.log("label not found");
//             }
//          }
//       } 
// }


function SetVideoEventsData (type) { 
   console.log("tryna SetVideoEventsData");
   tkStarttimes = []; //either audio or video, not both
   if (timeKeysData.timekeys == undefined || timeKeysData.timekeys == null) {
   //   timeKeysData = JSON.parse(localStorage.getItem(room+ "_timeKeys"));  TODO update the settings.timekeys
   } 
   
   
   if (timeKeysData != undefined && timeKeysData != null && timeKeysData.timekeys != undefined && timeKeysData.timekeys.length > 0 ) {
     timeKeysData.timekeys.forEach(function (timekey) {
     tkStarttimes.push(parseFloat(timekey.keystarttime).toFixed(2));
   });
   tkStarttimes.sort(function(a, b){
     return a - b;
   });
   
   if (type == null && timedEventsListenerMode == null) {
   timedEventsListenerMode = "Primary Video";
   }
   if (tkStarttimes.length > 0) {
     console.log("tryna run video events listenr with timedEventsListenerMode : " + timedEventsListenerMode);
     TimedEventListener();
   }
 }
}
function SetYoutubeEventsData() {

}

let timeKeysIndex = 0;
let listenerInterval = null;
let loopIntervals = [];

////////////////////////////////////// main method for timed events listening to all the things.../////////////////////////

function TimedEventListener () { 
 console.log("TimedEventsListener" + timedEventsListenerMode );
 // let primaryAudioTime = 0;
 timeKeysIndex = 0;
 let timekey = 0;
//  let vidz = document.getElementsByTagName("video");
//  let videoEl = null;
//  if (vidz != null && vidz.length > 0) { //either video or audio, not both...?
//    videoEl = vidz[0];
//    console.log("videoEl " + videoEl.id);
//  }
 if (timeKeysData != null && timeKeysData.timekeys != undefined && timeKeysData.timekeys.length > 0) {
   
   let listenerInterval = setInterval(function () {
      timekey = parseFloat(tkStarttimes[timeKeysIndex]);
      //  console.log(timekey);
      if (timekey && timekey != NaN) {//not not a number
      if (timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'primary audio') {
         // if (hasPrimaryAudio) {
            // if (timeKeysData.timekeys[timeKeysIndex].keytype == "Reset Timekeys") {
            //    timeKeysIndex = 0;
            // }
            if (primaryAudioHowl != undefined && primaryAudioHowl != null && primaryAudioHowl.playing()) {
            
               let primaryAudioTime = primaryAudioHowl.seek();
               
               if (primaryAudioTime != 0 && primaryAudioTime < .2) { //needs fudge?
                  timeKeysIndex = 0; 
                  console.log("resetting timekeysindex!");
               }
               if (primaryAudioTime != 0 && primaryAudioTime < timekey) {
                     // console.log(primaryAudioTime + "less than " + timekey);
                     //just waiting...
               } else {
                  if (timeKeysIndex < tkStarttimes.length) {
                     // console.log("TRYNA PLAY TIMEKEY "+ JSON.stringify(timeKeysData.timekeys[timeKeysIndex]) +" at primaryAudioTime "+ primaryAudioTime.toString() );
                     PlayTimedEvent(timeKeysData.timekeys[timeKeysIndex]);
                     timeKeysIndex++;
                  } else {
                     console.log("end");
                     clearInterval(listenerInterval);
                     
                  }
               }
            }
            // }
         } else if (timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'primary video') {
            if (videoEl != null && !videoEl.paused && timekey > 0) {
             console.log(videoEl.currentTime + " timeKeysIndex " + timeKeysIndex + " type " + timeKeysData.timekeys[timeKeysIndex].keytype);
               // if (timeKeysData.timekeys[timeKeysIndex].keytype == "Reset Timekeys") {
               //    timeKeysIndex = 0;
               //    // videoEl.currentTime = 0;
               // }
               if (videoEl.currentTime < 1) {
                  timeKeysIndex = 0; 
                  console.log("resetting timekeysindex!");
               }
               if (videoEl.currentTime <= timekey) {
                  //prease stanby...
               } else {
                  if (timeKeysIndex < tkStarttimes.length) {
                     // console.log("vid event " + timeKeysData[timeKeysIndex]);
                     PlayTimedEvent(timeKeysData.timekeys[timeKeysIndex]);
                     timeKeysIndex++;
                  } else {
                     console.log("end");
                     clearInterval(listenerInterval);
                  }
               
               }
            }
         } else if (timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'youtube') { 
            // if (timeKeysData.timekeys[timeKeysIndex].keytype == "Reset Timekeys") {
            //    timeKeysIndex = 0;
            // }
            if (youtubePlayer != null && youtubeIsPlaying && timekey > 0) {
               if (youtubePlayer.getCurrentTime() <= .1) {
                  timeKeysIndex = 0; 
                  console.log("resetting timekeysindex!");
               }
            if (youtubePlayer.getCurrentTime() <= timekey) {
               //    wait a scootch
               //    console.log(youtubePlayer.getCurrentTime() + " vs " + timekey);
               } else { 
                  
                  if(timeKeysIndex < tkStarttimes.length) {
                        // console.log("FIRING " + youtubePlayer.time + " vs " + timekey);
                     //    console.log("youtube event index " + timeKeysIndex + " " + JSON.stringify(timeKeysData.timekeys[timeKeysIndex]));
                     PlayTimedEvent(timeKeysData.timekeys[timeKeysIndex]);
                     timeKeysIndex++;
                     } else {
                        console.log("end");
                        clearInterval(listenerInterval);
                     }
                  }
               }
            }
         }
      }, 50);
   }
}

function PauseIntervals (pauseBool) {
   
   pauseLoops = pauseBool;
   console.log("loops are paused " + pauseLoops);

}
function ClearIntervals () {
   for (let i = 0; i < loopIntervals.length; i++) {
      console.log("clearing interval " + i);
      clearInterval(loopIntervals[i]);
   }
   // clearInterval(listenerInterval);
}



function LoopTimedEvent(keyType, duration) {
   
   duration = parseFloat(duration).toFixed(2) * 1000;
   // console.log("tryna looop " + keyType  + " " +duration);
   let beatElements = document.getElementsByClassName("beatme");
   let envEl = document.getElementById('enviroEl');
   let skyEl = document.getElementById('skyEl');
   
   let theInterval = setInterval(function () {
      if (!pauseLoops) {
         if (keyType == "Next") {
            console.log("next loop " + duration);
            GoToNext();
         } 
         if (keyType.toLowerCase().includes("beat")) {
            console.log("beat loop " + duration);
            if (beatElements != null) {
               // console.log("beat objex " + beatElements.length)
            for (let i = 0; i < beatElements.length; i++) {
               if (beatElements[i].components.mod_model != undefined) {
                  beatElements[i].components.mod_model.beat(.75, duration);
               } else if (beatElements[i].components.mod_object != undefined) {
                  beatElements[i].components.mod_object.beat(.75, duration);
               } else if (beatElements[i].components.cloud_marker != undefined) {
                  beatElements[i].components.cloud_marker.beat(.15, duration);
               } else if (beatElements[i].components.mod_physics != undefined) {
                  beatElements[i].components.mod_physics.randomPush();
               }
            }
            }
            if (envEl != null) {
               // console.log("beat volume " + volume);
               envEl.components.enviro_mods.beat(.5);
            }
         }
         if (keyType.toLowerCase().includes("random time")) {
            if (timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'primary audio') {
               if (primaryAudioEl != null) {
                  // console.log("beat volume " + volume);
                  primaryAudioEl.components.primary_audio_control.randomTime();
               }
            } else if (timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'primary video') {
               var videoControllerEl = document.getElementById('primary_video');  
               if (videoControllerEl != null) {
                  console.log("gotsa video embedVideo");
                  let videoController = videoControllerEl.components.vid_materials_embed;
                  if (videoController) {
                     videoController.randomTime();
                  }
               }
            } else if (timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'youtube') {
               let youtube_player = document.getElementById("youtubePlayer").components.youtube_player;
               if (youtube_player) {
                  youtube_player.randomTime();
               }
            }
         }

         if (keyType.toLowerCase().includes("color tweak")) {
            console.log("tryna beat loop");
            if (envEl != null) {
               // console.log("beat volume " + volume);
               envEl.components.enviro_mods.colortweak();
            }
         }
         if (keyType.toLowerCase().includes("color lerp")) {
            console.log("tryna color lerp");
            if (envEl != null) {
               // console.log("beat volume " + volume);
               envEl.components.enviro_mods.colorlerp(duration);
            } else if (skyEl != null) {
               
               skyEl.components.mod_sky.colorlerp();
            }
         }
      } else {
         console.log("loops are paused");
      }
   }, duration);
   loopIntervals.push(theInterval);
}  
function PlayTimedEvent(timeKey) {
 console.log("tryna play timed event: " + JSON.stringify(timeKey));

 let duration = 1;
 let posObj = {};
 let rotObj = {};
 let tempLabel = "";
   if (timeKey.keydata.toLowerCase().includes('loop')) {
      LoopTimedEvent(timeKey.keytype, timeKey.keyduration);
      // return null;
      if (timeKey.keytype.toLowerCase().includes("color lerp")) {
         console.log("tryna beat loop");
         let envEl = document.getElementById('enviroEl');
         if (envEl != null && envEl.components.enviro_mods) {
            // console.log("beat volume " + volume);
            duration = timeKey.keyduration * 1000;
            envEl.components.enviro_mods.colorlerp(duration); //does loop on arg
         }
      }
   }
   if (timeKey.keytype.toLowerCase().includes("beat")) {
      if (primaryAudioEl != null) {
         // console.log("beat volume " + volume);
         primaryAudioEl.components.primary_audio_control.timekey_beat(.5);
      }
   }
   if (timeKey.keytype.toLowerCase().includes("random time")) {
      if (timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'primary audio') {
         if (primaryAudioEl != null) {
            // console.log("beat volume " + volume);
            primaryAudioEl.components.primary_audio_control.randomTime();
         }
      } else if (timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'primary video') {
         var videoControllerEl = document.getElementById('primary_video');  
         if (videoControllerEl != null) {
            console.log("gotsa video embedVideo");
            let videoController = videoControllerEl.components.vid_materials_embed;
            if (videoController) {
               videoController.randomTime();
            }
         }
      } else if (timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'youtube') {
         let youtube_player = document.getElementById("youtubePlayer").components.youtube_player;
         if (youtube_player) {
            youtube_player.randomTime();
         }
      }
   }
   if (timeKey.keytype.toLowerCase().includes("goto time")) {
      if (timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'primary audio') {
         if (primaryAudioEl != null) {
            // console.log("beat volume " + volume);
            primaryAudioEl.components.primary_audio_control.gotoTime(timeKey.keydata);
         }
      } else if (timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'primary video') {
         if (settings.sceneType == "Default" || settings.sceneType == "AFrame") {
            var videoControllerEl = document.getElementById('primary_video');  
            if (videoControllerEl != null) {
               console.log("gotsa video embedVideo");
               let videoController = videoControllerEl.components.vid_materials_embed;
               if (videoController) {
                  videoController.gotoTime(timeKey.keydata);
               }
            }
         } else { //normal html, just ?
            video.currentTime = timeKey.keydata;
         }
      } else if (timedEventsListenerMode != null && timedEventsListenerMode.toLowerCase() == 'youtube') {
         let youtube_player = document.getElementById("youtubePlayer").components.youtube_player;
         if (youtube_player) {
            youtube_player.gotoTime(timeKey.keydata);
         }
      }
   }
   if (timeKey.keytype.toLowerCase().includes("text")) {
      let greetingDialogEl = document.getElementById("sceneGreetingDialog");
      if (greetingDialogEl) {
         let dialogComponent = greetingDialogEl.components.scene_greeting_dialog;
         if (dialogComponent) {
            console.log("tryna modGreeting " + timeKey.keydata);
            dialogComponent.modQuest(timeKey.keydata);
         } else {
            console.log("caint find no dangblurn dialog component!");
         }
      }
   }
   if (timeKey.keytype.toLowerCase().includes("clear")) {
      ClearIntervals();
   } 
   if (timeKey.keytype == "Next") {
      GoToNext();
   } 
   if (timeKey.keytype == "Previous") {
      GoToPrevious();
   } 
   if (timeKey.keytype == "Player Snap") {
      console.log("tryna play a Player Snap event " + JSON.stringify(sceneLocations.locationMods));
      // if (sceneLocations.locations.ength > 0) {
      for (let s = 0; s < sceneLocations.locationMods.length; s++) {
      if (sceneLocations.locationMods[s].label != undefined && sceneLocations.locationMods[s].label != null) {
         tempLabel = sceneLocations.locationMods[s].label;
      } else if (sceneLocations.locationMods[s].name != undefined && sceneLocations.locationMods[s].name != null) {
         tempLabel =sceneLocations.locationMods[s].name;
      }
      console.log("tryna match loc named " + JSON.stringify(sceneLocations.locationMods[s]) + " to  " + timeKey.keydata.toString());
      
         if (timeKey.keydata.toString() == tempLabel && (sceneLocations.locationMods[s].markerType == "placeholder" || sceneLocations.locationMods[s].markerType == "poi")) {
         console.log("gots match loc named " + JSON.stringify(sceneLocations.locationMods[s]) + " to  " + timeKey.keydata.toString());
            posObj.x = sceneLocations.locationMods[s].x;
            posObj.y = sceneLocations.locationMods[s].y;
            posObj.z = sceneLocations.locationMods[s].z;
            rotObj.x = sceneLocations.locationMods[s].eulerx != null ? sceneLocations.locationMods[s].eulerx : 0;
            rotObj.y = sceneLocations.locationMods[s].eulery != null ? sceneLocations.locationMods[s].eulery : 0;
            rotObj.z = sceneLocations.locationMods[s].eulerz != null ? sceneLocations.locationMods[s].eulerz : 0;
            // console.log(JSON.stringify(timeKey) + " tryna fire event Player Snap to " + JSON.stringify(sceneLocations.locations[s]));
            player.components.player_mover.move('player', posObj, rotObj, 0); //

         } else {
            // console.log("label not found");
         }
      }
   } 
    if (timeKey.keytype == "Player Lerp") {
       
    // if (sceneLocations.locations.ength > 0) {
      //  console.log("event: " + JSON.stringify(timeKey));
      console.log("trynba lerp to " + timeKey.keydata.toString());
       for (let s = 0; s < sceneLocations.locationMods.length; s++) {
         // if (sceneLocations.locationMods[s].label != undefined && sceneLocations.locationMods[s].label != null) {
         //    tempLabel = sceneLocations.locationMods[s].label;
         // } else 
         if (sceneLocations.locationMods[s].name != undefined && sceneLocations.locationMods[s].name != null) {
            tempLabel = sceneLocations.locationMods[s].name;
         }

         if (timeKey.keydata.toString() == tempLabel && (sceneLocations.locationMods[s].markerType == "placeholder" || sceneLocations.locationMods[s].markerType == "poi")) {
            console.log("match loc named " + JSON.stringify(sceneLocations.locationMods[s]) + " to  " + timeKey.keydata.toString());
             // posObj = {};
             // rotObj = {};
             posObj.x = sceneLocations.locationMods[s].x;
             posObj.y = sceneLocations.locationMods[s].y;
             posObj.z = sceneLocations.locationMods[s].z;
             rotObj.x = sceneLocations.locationMods[s].eulerx != null ? sceneLocations.locationMods[s].eulerx : 0;
             rotObj.y = sceneLocations.locationMods[s].eulery != null ? sceneLocations.locationMods[s].eulery : 0;
             rotObj.z = sceneLocations.locationMods[s].eulerz != null ? sceneLocations.locationMods[s].eulerz : 0;
             // document.getElementById("player").setAttribute("position", sceneLocations.locations[s].x + " " + sceneLocations.locations[s].y + " " + sceneLocations.locations[s].z);         
             duration = timeKey.keyduration;
             // console.log(JSON.stringify(timeKey) + " vs " + videoEl.currentTime + " tryna fire event Player lerp to " + JSON.stringify(posObj));
             player.components.player_mover.move('player', posObj, rotObj, duration);
          } else {
             // console.log("label not found");
          }
       }
    } 
}