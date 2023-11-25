AFRAME.registerComponent('mod_scene_inventory', {
    schema: {
      
        jsonInventoryData: {default: ''}
      },
      init: function () {
        let theData = this.el.getAttribute('data-inventory');
        this.data.jsonInventoryData = JSON.parse(atob(theData));
  
        console.log("scene inventory: " + JSON.stringify(this.data.jsonInventoryData));
        let objexEl = document.getElementById('sceneObjects');    
        objexEl.components.mod_objex.addSceneInventoryObjects(this.data.jsonInventoryData);
      }
    });
////////////////////////////////////////////  mod_objex: spins through data and spawn objects attached to locations with mod_object component below ////////////////////////////
////////////////////////////////////////////  vs mod_model(s) written into response individually, for static and/or preloaded assets
AFRAME.registerComponent('mod_objex', {
    schema: {
        eventData: {default: ''},
        shader: {default: ''},
        color: {default: ''},
        jsonObjectData: {default: ''},
        jsonLocationsData: {default: ''}
      },
      init: function () {
        let theData = this.el.getAttribute('data-objex');
        let theLocData = this.el.getAttribute('data-objex-locations');
        this.sceneInventoryItems = null; //might be loaded after init, called from mod_scene_inventory component, if not part of the scene
        this.fromSceneInventory = false;
  
        this.data.jsonObjectData = JSON.parse(atob(theData)); //object items with model references
        this.data.jsonLocationsData = JSON.parse(atob(theLocData)); //scene locations with object references
        // console.log("objxe datas" + JSON.stringify(this.data.jsonObjectData));
        // console.log("objxe location datas" + JSON.stringify(this.data.jsonLocationsData));
        console.log(this.data.jsonLocationsData.length + " locations for " + this.data.jsonObjectData.length);
  
        this.triggerAudioController = document.getElementById("triggerAudio");
        this.camera = null;
        let cameraEl = document.querySelector('a-entity[camera]');
        if (!cameraEl) {
            cameraEl = document.querySelector('a-camera');
        }
        if (!cameraEl) {
          camaraEl = document.getElementById('player');
        } 
        if (cameraEl) {
          let theCamComponent = cameraEl.components.camera;
          if (theCamComponent != null) {
            this.camera = theCamComponent.camera;
          }
        }
  
        for (let i = 0; i < this.data.jsonLocationsData.length; i++) {
          for (let k = 0; k < this.data.jsonObjectData.length; k++) {
            if (this.data.jsonLocationsData[i].objectID != undefined && this.data.jsonLocationsData[i].objectID != null && this.data.jsonLocationsData[i].objectID == this.data.jsonObjectData[k]._id) {
              // console.log("location/object match " + this.data.jsonLocationsData[i].objectID);
              
              if (this.data.jsonObjectData[k].modelID != undefined && this.data.jsonObjectData[k].modelID != null) {
              //  console.log ("JSONOBJECTDATA" + this.data.jsonObjectData[k].eventData);
                if (this.data.jsonLocationsData[i].eventData != undefined && this.data.jsonLocationsData[i].eventData.toLowerCase().includes("equip")) {
                  
                  // EquipDefaultItem(this.data.jsonLocationsData[i].objectID); //in dialogs.js
                  EquipDefaultItem(this.data.jsonLocationsData[i].objectID); //in dialogs.js
                  
                  // console.log("tryna equip with location/object match " + this.data.jsonLocationsData[i].objectID + " modelID " + this.data.jsonObjectData[k].modelID);
                  // let objEl = document.createElement("a-entity");
                  // objEl.setAttribute("mod_object", {'locationData': this.data.jsonLocationsData[i], 'objectData': this.data.jsonObjectData[k], 'equipped': true});
                  // objEl.id = "obj" + this.data.jsonLocationsData[i].objectID + "_" + this.data.jsonLocationsData[i].timestamp;
                  // sceneEl.appendChild(objEl);
                } else {
                  if (!this.data.jsonLocationsData[i].markerType.toLowerCase().includes('spawn')) { //either spawn or spawntrigger types require interaction //now in cloudmarker, deprecate
                    console.log("location/object match " + this.data.jsonLocationsData[i].objectID + " modelID " + this.data.jsonObjectData[k].modelID);
                    let objEl = document.createElement("a-entity");
                    //set mod_object component:
                    objEl.setAttribute("mod_object", {'eventData': this.data.jsonLocationsData[i].eventData, 'locationData': this.data.jsonLocationsData[i], 'objectData': this.data.jsonObjectData[k]});
                    objEl.id = "obj" + this.data.jsonLocationsData[i].objectID + "_" + this.data.jsonLocationsData[i].timestamp;
                    this.el.sceneEl.appendChild(objEl);
                  }
                }
              } 
            }
          }
        }
        let that = this;
      },
      addSceneInventoryObjects: function(inventory_items) { //
        let oIDs = [];
        this.fromSceneInventory = true;
        // this.fromSceneInventory = objex._id //top level of inventory object, items are array property //NO, this is now the sceneID, set in each inventory_item//NOOO, it's nothing
        // if (objex.inventoryItems != undefined && objex.inventoryItems.length > 0) {
          this.sceneInventoryItems = inventory_items;
        // }
        console.log("gots scene inventory items: " + JSON.stringify(inventory_items));
        //wait, need to cache the locations where to place the fetched objs... :|
        if (inventory_items) {
          for (let i = 0; i < inventory_items.length; i++) {
            if (this.returnObjectData(inventory_items[i].objectID) == null) { //if we don't already have this object data, need to fetch it
              if (!oIDs.includes(inventory_items[i].objectID)) { //prevent duplicates
                oIDs.push(inventory_items[i].objectID);
                console.log("gotsa oID from scene inventory that needs fetching!");
              }
            }
          }
        }
        console.log("need to fetch to pop scene inventory: " + oIDs);
        FetchSceneInventoryObjex(oIDs); //do fetch in external function, below, bc ajax response can't get to component scope if it's here (?)
      
      },
      spawnObject: function (locationName) { //uses name (label) property of location to reference the object to spawn, called from a spawntrigger, using that location's eventData which should have the name... hrm.
        console.log("tryna spawn object with location name : "+ locationName);
        for (let j = 0; j < this.data.jsonLocationsData.length; j++) {
          let tmpName = this.data.jsonLocationsData[j].name;
          if (tmpName == 'undefined' || tmpName == null) { //some old ones only have a "label" property. sigh
            tmpName = this.data.jsonLocationsData[j].label != null ? this.data.jsonLocationsData[j].label : "";
          }
          if (tmpName == locationName) {
            let elIDString = "obj" + this.data.jsonLocationsData[j].objectID + "_" + this.data.jsonLocationsData[j].timestamp;
            let elID = document.getElementById(elIDString);
            if (!elID) { //only one for now... TODO count maxperscene?  check inventory?
              let locationData  = {};
              locationData.x = this.data.jsonLocationsData[j].x;
              locationData.y = this.data.jsonLocationsData[j].y;
              locationData.z = this.data.jsonLocationsData[j].z;
              this.objectData =  this.returnObjectData(this.data.jsonLocationsData[j].objectID);
              console.log("gotsa object to spawn " + JSON.stringify(this.data.jsonLocationsData[j].locationTags));
              let objEl = document.createElement("a-entity");
              objEl.setAttribute("mod_object", {'eventData': null, 'locationData': locationData, 'objectData': this.objectData, 'timestamp': this.data.jsonLocationsData[j].timestamp, 'tags': this.data.jsonLocationsData[j].locationTags});
              objEl.id = elIDString;
              sceneEl.appendChild(objEl);
              if (this.triggerAudioController != null) {
                let distance = window.playerPosition.distanceTo(locationData);
                console.log(distance + " distance to spawn lo9c " + locationData);
                this.triggerAudioController.components.trigger_audio_control.playAudioAtPosition(locationData, distance, ["spawn"], 1);//tagmangler needs an array, add vol mod 
              }
            } else {
              console.log("already spawned one of thoose...");
            }
          }
        }
      },
      loadSceneInventoryObjects: function () { //coming back from upstream call after updating jsonObjectData with missing sceneInventoryItems
        console.log("tryna loadSceneInventoryObjects fromSceneInventory " + this.fromSceneInventory);
        if (this.sceneInventoryItems != null) {
          for (let i = 0; i < this.sceneInventoryItems.length; i++) { 
            for (let j = 0; j < this.data.jsonObjectData.length; j++) {
              console.log("inventory : "+ this.sceneInventoryItems[i].objectID+ " vs objex._id " + this.data.jsonObjectData[j]._id);
              if (this.sceneInventoryItems[i].objectID == this.data.jsonObjectData[j]._id) {
                console.log("gotsa match for scene inventory at location " + JSON.stringify(this.sceneInventoryItems[i].location)); //here location data is a vector3
                let timestamp = this.sceneInventoryItems[i].timestamp;
                if (this.sceneInventoryItems[i].location != undefined) {
                let locationData  = {};
  
                locationData.x = this.sceneInventoryItems[i].location.x;
                locationData.y = this.sceneInventoryItems[i].location.y;
                locationData.z = this.sceneInventoryItems[i].location.z; //how mod_object wants the data
                if (locationData.x == 0 && locationData.y == 0 && locationData.z == 0) {
                  locationData.x = Math.floor(Math.random() * 50);
                  locationData.y = 20;
                  locationData.z = Math.floor(Math.random() * 50);
                }
                let objEl = document.createElement("a-entity");
                objEl.setAttribute("mod_object", {'eventData': null, 'locationData': locationData, 'objectData': this.data.jsonObjectData[j], 'inventoryData': this.sceneInventoryItems[i], 'fromSceneInventory': this.fromSceneInventory, 'timestamp': timestamp});
                // objEl.setAttribute("mod_object", {'locationData': locationData, 'objectData': this.data.jsonObjectData[j], 'inventoryData': this.sceneInventoryItems[i], 'timestamp': timestamp});
                objEl.id = "obj" + this.data.jsonObjectData[j]._id + "_" + timestamp;
                sceneEl.appendChild(objEl);
                } else {
                  console.log("well shoot, that one don't have a location " + JSON.stringify(this.sceneInventoryItems[i]));
                }
              }
            }
          }
        }
      },
      returnObjectData: function(objectID) {
        console.log('tryna return object data for ' +objectID);
        // let hasObj = false;
        let objek = null;
        if (this.data.jsonObjectData.length > 0) {
          for (let i = 0; i < this.data.jsonObjectData.length; i++) {
            console.log('tryna match object data for ' +objectID + " vs " + this.data.jsonObjectData[i]._id);
            if (this.data.jsonObjectData[i]._id == objectID) {
              console.log('gotsa objectID match to return data');
              // hasObj = true;
              objek = this.data.jsonObjectData[i];
            }
          }
        }
        // if (objek == null) {
        //   FetchSceneInventoryObject([objectID]);
        // }
        return objek;
      },
      returnObjexData: function() { //everything
        return this.data.jsonObjectData;
      },
      addFetchedObject (obj) { //for scene inventory objects, not in player inventory, added after initial load
        console.log("tryna add fetched obj " + obj._id)
        this.data.jsonObjectData.push(obj); 
      },
      // addSceneInventoryObject (obj) {
      //   console.log("tryna add fetched obj " + obj._id)
      //   this.data.jsonObjectData.push(obj); 
      // },
      dropInventoryObject: function (inventoryID, action, inventoryObj) {
        let data = {};
        data.inScene = room;
        // data.inScene
        // data.inventoryID = inventoryID;
        data.userData = userData;
        // data.object_item = this.data.objectData;
        // data.userData = userData;
        data.action = action;
        let loc = new THREE.Vector3();
        this.viewportHolder = document.getElementById('viewportPlaceholder');
        this.viewportHolder.object3D.getWorldPosition( loc );
        inventoryObj.location = {"x": parseFloat(loc.x.toFixed(3)), "y": parseFloat(loc.y.toFixed(3)), "z": parseFloat(loc.z.toFixed(3))}; //truncate long floating point values, close enough
        data.inventoryObj = inventoryObj;
        // data.location = this.el.getAttribute("position");
        
        // if (data.inventoryObj.actions != undefined && data.inventoryObj.actions.length > 0) {
        //   for (let i = 0; i < data.inventoryObj.actions.length; i++) {
        //     if (data.inventoryObj.actions[i].actionType.toLowerCase().includes("drop")) {
        //       data.action = data.inventoryObj.actions[i];
        //     }
        //   }
        // }
        if (action.actionType.toLowerCase() == "drop") {
         Drop(data);
        }
      },
      equipInventoryObject: function (objectID) {
        // console.log("tryna equip model " + objectID + " equipped " + this.data.equipped );  
        this.objectData = this.returnObjectData(objectID);
        console.log("tryna equip model " + JSON.stringify(this.objectData));  
        this.dropPos = new THREE.Vector3();
        this.objEl = document.createElement("a-entity");
        this.equipHolder = document.getElementById("equipPlaceholder");
        // this.equipHolder.object3D.getWorldPosition( this.dropPos );
        this.locData = {};
        // this.locData.x = this.dropPos.x;
        // this.locData.y = this.dropPos.y;
        // this.locData.z = this.dropPos.z;
        this.locData.x = 0;
        this.locData.y = 0;
        this.locData.z = 0;
        this.locData.markerObjScale = (this.objectData.objScale != undefined && this.objectData.objScale != "") ? this.objectData.objScale : 1; //these come from objectData, not locData
        this.locData.eulerx = (this.objectData.eulerx != undefined && this.objectData.eulerx != "") ? this.objectData.eulerx : 0;
        this.locData.eulery = (this.objectData.eulery != undefined && this.objectData.eulery != "") ? this.objectData.eulery : 0;
        this.locData.eulerz = (this.objectData.eulerz != undefined && this.objectData.eulerz != "") ? this.objectData.eulerz : 0;
        this.locData.timestamp = Date.now();
        this.objEl.setAttribute("mod_object", {'eventData': null, 'locationData': this.locData, 'objectData': this.objectData, 'isEquipped': true});
        this.objEl.id = "obj" + this.objectData._id + "_" + this.locData.timestamp;
        this.objEl.classList.add('equipped');
        
        this.objEl.classList.add('activeObjexRay');
        this.equipHolder.appendChild(this.objEl); //parent to equip holder instead of scene as below
        // this.el.setAttribute('gltf-model', '#' + modelID.toString());
      },
      selectObject: function (objectID) { //hrm...
        console.log("tryna select object " + objectID);  
        this.objectData = this.returnObjectData(objectID);
        this.dropPos = new THREE.Vector3();
        this.objEl = document.createElement("a-entity");
        this.locData = {};
        this.locData.x = this.dropPos.x;
        this.locData.y = this.dropPos.y;
        this.locData.z = this.dropPos.z;
        this.locData.timestamp = Date.now();
        this.objEl.setAttribute("mod_object", {'eventData': null, 'locationData': this.locData, 'objectData': this.objectData});
        this.objEl.id = "obj" + this.objectData._id + "_" + this.locData.timestamp;
        sceneEl.appendChild(this.objEl);
        // this.objEl.components.mod_object.applyForce();
  
        // this.el.setAttribute('gltf-model', '#' + modelID.toString());
      },
      dropObject: function (objectID) {
        console.log("tryna set model to " + objectID);  
        this.objectData = this.returnObjectData(objectID);
        this.dropPos = new THREE.Vector3();
        this.objEl = document.createElement("a-entity");
        this.equipHolder = document.getElementById("equipPlaceholder");
        this.equipHolder.object3D.getWorldPosition( this.dropPos );
        this.locData = {};
        this.locData.x = this.dropPos.x;
        this.locData.y = this.dropPos.y;
        this.locData.z = this.dropPos.z;
        this.locData.timestamp = Date.now();
        this.objEl.setAttribute("mod_object", {'eventData': null, 'locationData': this.locData, 'objectData': this.objectData});
        this.objEl.id = "obj" + this.objectData._id + "_" + this.locData.timestamp;
        sceneEl.appendChild(this.objEl);
        // this.objEl.components.mod_object.applyForce();
  
        // this.el.setAttribute('gltf-model', '#' + modelID.toString());
      },
      shootObject: function (objectID) {
        let downtime = 6000;
        this.objectData = this.returnObjectData(objectID);
        this.dropPos = new THREE.Vector3();
        this.dropRot = new THREE.Quaternion();
        this.objEl = document.createElement("a-entity");
        this.equipHolder = document.getElementById("equipPlaceholder");
        this.equippedObject = this.equipHolder.querySelector('.equipped');
        if (this.equippedObject != null) {
          this.equippedObject.object3D.getWorldPosition(this.dropPos);
        }
        if (!posRotReader) {
          player = document.getElementById("player");
          posRotReader = document.getElementById("player").components.get_pos_rot; 
        } 
        if (posRotReader) {
          this.playerPosRot = posRotReader.returnPosRot(); 
          console.log("this.playerPosRot" + JSON.stringify(this.playerPosRot));
          this.dropEuler = this.playerPosRot.rot;
          this.locData = {};
          this.locData.eulerx = this.playerPosRot.rot.x;
          this.locData.eulery = this.playerPosRot.rot.y;
          this.locData.eulerz = this.playerPosRot.rot.z;
          this.locData.timestamp = Date.now();
          this.objEl.setAttribute("position", this.dropPos);
          // this.objEl.setAttribute("mod_object", {'eventData': null, 'locationData': this.locData, 'objectData': this.objectData, 'applyForceToNewObject': true, 'forceFactor': downtime, 'removeAfter': "5"});
          this.objEl.setAttribute("mod_object", {'eventData': null, 'locationData': this.locData, 'objectData': this.objectData, 'followPathNewObject': true, 'forceFactor': downtime, 'removeAfter': "5"});
          this.objEl.id = "obj" + this.objectData._id + "_" + this.locData.timestamp;
          sceneEl.append(this.objEl);
        }
  
      },
      throwObject: function (objectID, downtime) {
        console.log("tryna set model to " + objectID);  
        this.objectData = this.returnObjectData(objectID);
        this.dropPos = new THREE.Vector3();
        this.objEl = document.createElement("a-entity");
        this.equipHolder = document.getElementById("equipPlaceholder");
        this.equipHolder.object3D.getWorldPosition( this.dropPos );
        this.locData = {};
        this.locData.x = this.dropPos.x;
        this.locData.y = this.dropPos.y;
        this.locData.z = this.dropPos.z;
        this.locData.timestamp = Date.now();
        this.objEl.setAttribute("mod_object", {'eventData': null, 'locationData': this.locData, 'objectData': this.objectData, 'applyForceToNewObject': true, 'forceFactor': downtime, 'removeAfter': "5"});
        this.objEl.id = "obj" + this.objectData._id + "_" + this.locData.timestamp;
  
        sceneEl.appendChild(this.objEl);
        // this.el.setAttribute('gltf-model', '#' + modelID.toString());
      }
  });
  
  function FetchSceneInventoryObject(oID) { //add a single scene inventory object, e.g. child object spawn that isn't in initial collection, but don't init everything
    let objexEl = document.getElementById('sceneObjects');    
    // if (oIDs.length > 0) {
      // objexEl.components.mod_objex.dropObject(data.inventoryObj.objectID);
      let data = {};
      data.oIDs = [oID];
      var xhr = new XMLHttpRequest();
      xhr.open("POST", '/scene_inventory_objex/', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(data));
      xhr.onload = function () {
        // do something to response
        // console.log("fetched obj resp: " +this.responseText);
        let response = JSON.parse(this.responseText);
        // console.log("gotsome objex: " + response.objex.length);
        if (response.objex.length > 0) {
            objexEl.components.mod_objex.addFetchedObject(response.objex[0]); //add to scene object collection, so don't have to fetch again
        } 
      }
  }
  
  function FetchSceneInventoryObjex(oIDs) { //fetch scene inventory objects, i.e. stuff dropped by users, at start to populate scene
    let objexEl = document.getElementById('sceneObjects');    
    if (oIDs.length > 0) {
      // objexEl.components.mod_objex.dropObject(data.inventoryObj.objectID);
      let data = {};
      data.oIDs = oIDs;
      var xhr = new XMLHttpRequest();
      xhr.open("POST", '/scene_inventory_objex/', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(data));
      xhr.onload = function () {
        // do something to response
        // console.log("fetched obj resp: " +this.responseText);
        let response = JSON.parse(this.responseText);
        // console.log("gotsome objex: " + response.objex.length);
        if (response.objex.length > 0) {
  
          for (let i = 0; i < response.objex.length; i++) {
            objexEl.components.mod_objex.addFetchedObject(response.objex[i]); //add to scene object collection, so don't have to fetch again
            //use locs and instantiate!
            // console.log(i + " vs " + response.objex.length - 1);
            if (i == response.objex.length - 1) {
              objexEl.components.mod_objex.loadSceneInventoryObjects(); //ok load em up
            }
          }
        } else {
          objexEl.components.mod_objex.loadSceneInventoryObjects(); //ok load em up
        }
      }
    } else {
      objexEl.components.mod_objex.loadSceneInventoryObjects(); //ok load em up
    }
  }
  
/////////////////////////////////////////  mod_object component attached to 3D Cbjects, which have more properties than 3D Models, + actions - instantiated from mod_objex component above
AFRAME.registerComponent('mod_object', {
    schema: {
      locationData: {default: ''},
      objectData: {default: ''},
      eventData: {default: ''},
      markerType: {default: 'none'},
      isEquipped: {default: false},
      fromSceneInventory: {default: false},
      timestamp: {default: null},
      applyForceToNewObject: {default: false},
      followPathNewObject: {default: false},
      forceFactor: {default: 1},
      removeAfter: {default: ""},
      tags: {default: null}
    },
    init: function () {
      // console.log("mod_object data " + JSON.stringify(this.data.objectData.modelURL));
      this.moEl = this.el;
      this.isActivated = false; //to prevent dupes..
      this.calloutEntity = null;
      this.calloutPanel = null;
      this.calloutText = null;
      this.calloutString = "";
      this.selectedAxis = null;
      this.isSelected = false;
      this.hitPosition = null;
      this.mouseDownPos = new THREE.Vector2();
      this.mousePos = new THREE.Vector2();
      this.mouseDownStarttime = 0;
      this.mouseDowntime = 0;
      this.distance = 0;
      this.calloutLabelSplit = [];
      this.calloutLabelIndex = 0;
      this.promptSplit = [];
      this.promptIndex = 0;
      this.dialogEl = document.getElementById('mod_dialog');
      this.objexEl = document.getElementById('sceneObjects');    
      this.pickupAction = null;
      this.dropAction = null;
      this.equipAction = null;
      this.throwAction = null;
      this.shootAction = null;
      this.selectAction = null;
      this.loadAction = null;
      this.highlightAction = null;
      this.collideAction = null;
      this.findAction = null;
      this.synth = null;
      this.hasSynth = false;
      this.mod_physics = "";
      this.pushForward = false;
      this.followPath = false;
      this.targetLocations = [];
  
      this.lookVector = new THREE.Vector3( 0, 0, -1 );
      // this.startPoint = new THREE.Vector3();
      // this.tempVector = new THREE.Vector3();
      // this.endMesh = new THREE.Mesh(new THREE.SphereBufferGeometry(0.25, 16, 8), new THREE.MeshBasicMaterial({color: "blue", wireframe: true}));
      this.positionMe = new THREE.Vector3();
      this.directionMe = new THREE.Vector3();
      this.equippedRaycaster = null;
      this.lineMaterial = new THREE.LineBasicMaterial({
        color: 0xff0000
      });
      // this.lineEl = null;
      this.lineStart = new THREE.Vector3();
      this.lineMiddle = new THREE.Vector3();
      this.lineEnd = new THREE.Vector3();
      this.lineGeometry = new THREE.BufferGeometry().setFromPoints([
        this.lineStart,
        // this.lineMiddle,
        this.lineEnd
      ]);
  
      this.lineObject = new THREE.Line(this.lineGeometry, this.lineMaterial);
      this.el.sceneEl.object3D.add(this.lineObject);
      this.curve = null;
      this.isTriggered = false;
  
  
  
      this.textIndex = 0;
      this.position = null;
      this.textData = [];
  
      // let textData = [];
      let moIndex = -1;
      let idleIndex = -1;
      let danceIndex = -1;
      let walkIndex = -1;
      let runIndex = -1;
      let clips = null;
      this.danceClips = [];
      this.idleClips = [];
      this.walkClips = [];
      this.mouthClips = [];
      this.talkClips = [];
  
      this.triggerAudioController = document.getElementById("triggerAudio");
      this.triggerOn = false;
      this.driveable = false;
      this.modelParent = null;
  
      this.camera = null;
      this.tags = this.data.tags;
      this.isNavAgent = false;
      this.navAgentController = null;
      // this.raycaster = null;
  
      this.posIndex = 0; 
      this.currentPos = new THREE.Vector3();
      this.currentRot = new THREE.Vector3();
      // this.rotObjectMatrix = new THREE.Matrix4();//
      this.axis = new THREE.Vector3();
      this.up = new THREE.Vector3(0, 1, 0);
      this.line = null;
      this.equipHolder = document.getElementById("equipPlaceholder");
      
      let cameraEl = document.querySelector('a-entity[camera]');  
      if (!cameraEl) {
          cameraEl = document.querySelector('a-camera');
      }
      if (!cameraEl) {
        camaraEl = document.getElementById('player');
      } 
      if (cameraEl) {
        let theCamComponent = cameraEl.components.camera;
        if (theCamComponent != null) {
          this.camera = theCamComponent.camera;
        }
        // this.camera = cameraEl.components.camera.camera;
      }
  
      if (JSON.stringify(this.data.eventData).includes("beat")) {
        console.log ("adding class beatmee");
        this.el.classList.add("beatme");
        // this.el.addEventListener('beatme', e => console.log("beat" + e.detail.volume()));
        
      }
  
  
      this.el.setAttribute("shadow", {cast:true, receive:true});
  
      this.thirdPersonPlaceholder = null;
      // this.sceneInventoryID = null;
      if (this.data.locationData && this.data.locationData.eventData && this.data.locationData.eventData.toLowerCase().includes("driveable")) {
        this.thirdPersonPlaceholder = document.getElementById("thirdPersonPlaceholder"); //it's in the server response
  
        if (this.thirdPersonPlaceholder) {
          this.modelParent = this.thirdPersonPlaceholder;
          // thirdPersonPlaceholder.appendChild(this.el);
          // this.el.setAttribute("position", {x:0, y:0, z:0});
          if (this.data.objectData.modelURL != undefined) {
            // thirdPersonPlaceholder.append(this.el);
            this.thirdPersonPlaceholder.setAttribute("gltf-model", this.data.objectData.modelURL); 
            let rot = {};
            rot.x = this.data.locationData.eulerx != undefined ? this.data.locationData.eulerx : 0;
            rot.y = this.data.locationData.eulery != undefined ? this.data.locationData.eulery : 0;
            rot.z = this.data.locationData.eulerz != undefined ? this.data.locationData.eulerz : 0;
            this.thirdPersonPlaceholder.setAttribute("rotation", rot);
          } else {
            // thirdPersonPlaceholder.append(this.el);
            this.thirdPersonPlaceholder.setAttribute("gltf-model", "#" +this.data.objectData.modelID); 
            let rot = {};
            rot.x = this.data.locationData.eulerx != undefined ? this.data.locationData.eulerx : 0;
            rot.y = this.data.locationData.eulery != undefined ? this.data.locationData.eulery : 0;
            rot.z = this.data.locationData.eulerz != undefined ? this.data.locationData.eulerz : 0;
            this.thirdPersonPlaceholder.setAttribute("rotation", rot);
          }
          // this.thirdPersonPlaceholder.setAttribute("object_raycaster", true);
        }
        
      } else {
        if (this.data.objectData.modelURL != undefined) {
          this.el.setAttribute("gltf-model", this.data.objectData.modelURL); 
        } else {
          this.el.setAttribute("gltf-model", "#" +this.data.objectData.modelID); 
        }
      }
  
        
      if (this.tags == null) {
        // console.log(this.data.objectData.name + "this.data.tags is null! loctags: " + this.data.locationData.locationTags + " objtags: " + this.data.objectData.tags);
        this.tags = [];
        if (this.data.locationData && this.data.locationData.locationTags != undefined  && this.data.locationData.locationTags != 'undefined' && this.data.locationData.locationTags.length > 0) {
          // console.log(this.data.objectData.name + " gotsome location tags: " + this.data.locationData.locationTags);
          this.tags = this.data.locationData.locationTags;
          
        } 
        if (this.data.objectData.tags != undefined && this.data.objectData.tags != null && this.data.objectData.tags != "undefined" && this.data.objectData.tags.length > 0) {
          // console.log(this.data.objectData.name + " gotsome tags: " + this.data.objectData.tags);
          this.tags = [...this.tags, ...this.data.objectData.tags]; //spread operator!
        }
        // if (this.data.locationData && this.data.locationData.markerType) {
          console.log(this.data.objectData.name + " gots tags: " + this.tags + " markerType : "+ this.data.locationData.markerType);
          for (let i = 0; i < this.tags.length; i++) {
            console.log("adding class with tag " + this.tags[i]);
            if (this.tags[i].includes(" ")) {
              console.log("cain't put space in classname : " + this.tags[i]);
            } else {
              this.el.classList.add(this.tags[i]);
            }
            
          }
        // }
      } else {
        console.log("this.data.tags is not null!");
  
      }
      if (this.data.objectData.triggerScale == undefined || this.data.objectData.triggerScale == null || this.data.objectData.triggerScale == "" || this.data.objectData.triggerScale == 0) {
        this.data.objectData.triggerScale = 1;
      } 
      setTimeout(() => { //to make sure audio group data is loaded
        if (this.tags && this.tags.includes("loop")){
          console.log("tryna trigger mod_object loop");
          var triggerAudioController = document.getElementById("triggerAudio");
          if (triggerAudioController != null) {
            
            triggerAudioController.components.trigger_audio_control.loopAndFollow(this.el.id, this.tags, !this.hasTriggerAction); //don't autoplay if hastriggeraction
          }
        }   
      }, 2000);
       
      if (this.data.objectData.physics === "Navmesh Agent" || this.data.eventData.toLowerCase().includes("agent")) { 
        this.isNavAgent = true;
        this.navAgentController = this.el.components.nav_agent_controller;
  
      } 
      this.el.sceneEl.addEventListener('youtubeToggle', function (event) { //things to trigger on this model if youtube is playing
        console.log("GOTSA YOUTUBNE EVENT: " + event.detail.isPlaying);  
        if (event.detail.isPlaying) {
          // this.el.components.nav_agent_controller.updateAgentState("dance");
        } 
      });
      this.hasPickupAction = false;
      this.hasTriggerAction = false;
      this.hasThrowAction = false;
      this.hasShootAction = false;
  
      // if ((this.tags != null && !this.tags.includes("thoughtbubble")) && !this.tags.includes("hide callout")) { //TODO implement Callout Options!
      
      // if (!this.tags.includes("hide callout")) { //TODO implement Callout Options!
        if (this.data.objectData.callouttext != undefined && this.data.objectData.callouttext != null && this.data.objectData.callouttext.length > 0) {
          if (this.data.objectData.callouttext.includes('~')) {
            this.calloutLabelSplit = this.data.objectData.callouttext.split('~'); 
            this.textData = this.calloutLabelSplit;
          }
          console.log(this.data.objectData.name + "callouttext " + this.data.objectData.callouttext );
          this.calloutEntity = document.createElement("a-entity");
         
          this.calloutText = document.createElement("a-entity");
                  // this.calloutEntity.appendChild(this.calloutPanel);
            this.calloutEntity.appendChild(this.calloutText);
          this.calloutEntity.id = "objCalloutEntity_" + this.data.objectData._id;
        
          this.calloutText.id = "objCalloutText_" + this.data.objectData._id;
            
          // TODO flex with sceneTextBackground
          // this.calloutPanel.id = "objCalloutPanel_" + this.data.objectData._id;
          // this.calloutPanel = document.createElement("a-entity"); 
          // this.calloutPanel.setAttribute("gltf-model", "#landscape_panel");
          // this.calloutPanel.setAttribute("scale", ".125 .1 .125");
          // this.calloutPanel.setAttribute("material", {'color': 'black', 'roughness': 1});
          // this.calloutPanel.setAttribute("overlay");
          // this.calloutEntity.setAttribute("look-at", "#player");
          if (settings && settings.sceneCameraMode == "Third Person") {
            this.calloutEntity.setAttribute("look-at", "#thirdPersonCamera");
          } else {
            this.calloutEntity.setAttribute("look-at", "#player");
          }
          
          this.calloutEntity.setAttribute('visible', false);
        
          // calloutEntity.setAttribute("render-order", "hud");
          if (this.isNavAgent) {
            this.el.appendChild(this.calloutEntity);
            this.calloutEntity.setAttribute("position", "0 1 0");
          } else {
            this.el.sceneEl.appendChild(this.calloutEntity);
          }
  
  
          let font = "Acme.woff"; 
          if (settings && settings.sceneFontWeb2 && settings.sceneFontWeb2.length) {
            font = settings.sceneFontWeb2;
          }
          // this.calloutPanel.setAttribute("position", '0 0 1'); 
          if (!this.isNavAgent) {
            this.calloutText.setAttribute("position", '0 0 1.25'); //offset the child on z toward camera, to prevent overlap on model
          }
          this.calloutText.setAttribute('troika-text', {
            fontSize: .1,
            baseline: "bottom",
            align: "left",
            font: "/fonts/web/" + font,
            anchor: "center",
            color: "white",
            outlineColor: "black",
            outlineWidth: "2%",
            value: ""
          });
          this.calloutText.setAttribute("overlay");
        } 
      // }
      // if (this.data.objectData.synthNotes != undefined && this.data.objectData.synthNotes != null && this.data.objectData.synthNotes.length > 0) {
      if (this.data.objectData.tonejsPatch1 != undefined && this.data.objectData.tonejsPatch1 != null) {  
        this.el.setAttribute("mod_synth", "init");
        this.hasSynth = true;
  
      }
     
      if (this.data.objectData.actions != undefined && this.data.objectData.actions.length > 0) {
        for (let a = 0; a < this.data.objectData.actions.length; a++) {
            // console.log("action: " + JSON.stringify(this.data.objectData.actions[a].actionType));
          if (this.data.objectData.actions[a].actionType.toLowerCase() == "onload") {
            // this.hasSelectAction = true;
            this.loadAction = this.data.objectData.actions[a];
          }
          if (this.data.objectData.actions[a].actionType.toLowerCase() == "select") {
            this.hasSelectAction = true;
            this.selectAction = this.data.objectData.actions[a];
          }
          if (this.data.objectData.actions[a].actionType.toLowerCase() == "highlight") {
            this.hasHighlightAction = true;
            this.highlightAction = this.data.objectData.actions[a];
          }
          if (this.data.objectData.actions[a].actionType.toLowerCase() == "collide") {
            this.hasCollideAction = true;
            this.collideAction = this.data.objectData.actions[a];
          }
          if (this.data.objectData.actions[a].actionType.toLowerCase() == "pickup") {
            this.hasPickupAction = true;
            this.pickupAction = this.data.objectData.actions[a];
          }
          if (this.data.objectData.actions[a].actionType.toLowerCase() == "drop") {
            this.hasDropAction = true;
            this.dropAction = this.data.objectData.actions[a];
          }
          if (this.data.objectData.actions[a].actionType.toLowerCase() == "throw") {
            this.hasThrowAction = true;
            this.throwAction = this.data.objectData.actions[a];
          }
          if (this.data.objectData.actions[a].actionType.toLowerCase() == "trigger") {
            this.hasTriggerAction = true;
            // this.throwAction = this.data.objectData.actions[a];
            // this.el.setAttribute("equipped_object_control", {init: true});
            
          }
  
          if (this.data.objectData.actions[a].actionType.toLowerCase() == "shoot") {
            this.hasShootAction = true;
            this.shootAction = this.data.objectData.actions[a];
          }
          if (this.data.objectData.actions[a].actionType.toLowerCase() == "equip") {
            this.hasEquipAction = true;
          }
          if (this.data.objectData.actions[a].actionType.toLowerCase() == "return") {
            // this.hasDropAction = true;
          }
          if (this.data.objectData.actions[a].actionType.toLowerCase() == "use") {
            // this.hasDropAction = true;
          }
          if (this.data.objectData.actions[a].actionType.toLowerCase() == "find") {
            // this.hasDropAction = true;
            this.findAction = this.data.objectData.actions[a];
          }
        }
      }
  
      if (this.data.isEquipped) {
  
        if (this.hasTriggerAction) {
          this.el.setAttribute("raycaster", {"objects": ".target", "far": "50", "position": "0 -0.5 0", "rotation": "90 0 0"});
          this.equippedRaycaster = this.el.components.raycaster;
        }
        if (this.hasShootAction || this.hasThrowAction) {
          this.el.classList.add("activeObjexRay");
        }
        
      
  
      } else {
        this.el.classList.add("activeObjexRay");
      }
      if (this.data.removeAfter != "") { //cleanup if timeout set
        setTimeout( () => { 
          // this.el.visible = false;
          let trailComponent = this.el.components.trail;
          if (trailComponent) {
            trailComponent.kill();
            // this.el.removeAttribute("trail");
          }
          // this.sceneEl.remove(this.el.object3D); 
          // this.el.removeAttribute("trail"); //WHY WON'T YOU DIE
          if (this.el != null && this.el.parentNode != null) {
            this.el.parentNode.removeChild(this.el);
          }
          
        }, 5000);
      }
  
      let that = this;
  
  
      this.el.addEventListener('model-loaded', () => {
  
        console.log(this.data.objectData.name + " mod_object model-loaded");
        
        let pos = {};
        pos.x = this.data.locationData.x;
        pos.y = this.data.locationData.y;          
        pos.z = this.data.locationData.z;
        let rot = {};
        rot.x = this.data.locationData.eulerx != undefined ? this.data.locationData.eulerx : 0;
        rot.y = this.data.locationData.eulery != undefined ? this.data.locationData.eulery : 0;
        rot.z = this.data.locationData.eulerz != undefined ? this.data.locationData.eulerz : 0;
        let scale = {x: 1, y: 1, z: 1};
        if (this.data.locationData.markerObjScale != undefined && this.data.locationData.markerObjScale != null && this.data.locationData.markerObjScale != "" && this.data.locationData.markerObjScale != 0) {
        scale.x = this.data.locationData.markerObjScale != undefined ? this.data.locationData.markerObjScale : 1;
        scale.y = this.data.locationData.markerObjScale != undefined ? this.data.locationData.markerObjScale : 1;
        scale.z = this.data.locationData.markerObjScale != undefined ? this.data.locationData.markerObjScale : 1;
        } else if (this.data.objectData.objScale != undefined && this.data.objectData.objScale != null && this.data.objectData.objScale != "" && this.data.objectData.objScale != 0 ) {
          scale.x = this.data.objectData.objScale;
          scale.y = this.data.objectData.objScale;
          scale.z = this.data.objectData.objScale;
        } else {
          this.data.objectData.objScale = 1;
        }
   
        if (!this.data.isEquipped) {
          console.log("setting object pos/rot to " + JSON.stringify(rot));
          if (this.modelParent != null) {
            console.log("not equipped, has modelparent ");
            this.modelParent.setAttribute("position", pos);
            this.modelParent.setAttribute("rotation", rot);
          } else {
              // console.log("not equipped, no modelparent " + JSON.stringify(rot));
              this.el.setAttribute("scale", scale);
              // this.el.object3D.position = pos;
              // this.el.object3D.rotation = rot;
            if (!this.hasShootAction) {
              this.el.setAttribute("position", pos);
            }
            
            // that.el.setAttribute("rotation", rot);
            this.el.object3D.rotation.set(
              THREE.MathUtils.degToRad(rot.x),
              THREE.MathUtils.degToRad(rot.y),
              THREE.MathUtils.degToRad(rot.z)
            );
          }
          console.log("OBJTYPE IS : " +this.data.objectData.objtype);
          if (this.data.objectData.objtype === "Character") { 
            // const vector = new THREE.Vector3();
            
            let skinnedMeshColliderEl = document.createElement("a-sphere"); //screw it, can't got the boundingbox fu to work...
            skinnedMeshColliderEl.setAttribute("scale", ".5 1 .5"); //todo pass in scale
            // skinnedMeshColliderEl.setObject3D(sphere);
            if (settings && settings.debugMode) {
              skinnedMeshColliderEl.setAttribute("material", {"color": "purple", "transparent": true, "opacity": 0.1});
            } else {
              skinnedMeshColliderEl.setAttribute("material", {"transparent": true, "opacity": 0});
            }
            skinnedMeshColliderEl.classList.add("activeObjexRay");
            this.el.appendChild(skinnedMeshColliderEl);
            
            skinnedMeshColliderEl.setAttribute("position", "0 1 0"); //to do mod by scale
            // console.log("character node name " + node.name);
            // if (node instanceof THREE.Mesh) {
            //   // 
            //   console.log("character node mesh name " + node.name);
            //   // const box = new THREE.Box3();
            //     node.frustumCulled = false;
                
            // }
            this.hasLocationCallout = true; //eg no background (thought or speech bubbgles)
          }
        
        } else { //if we're equipped
          // this.el.setAttribute("rotation", rot);
          this.el.object3D.rotation.set(
            THREE.MathUtils.degToRad(rot.x),
            THREE.MathUtils.degToRad(rot.y),
            THREE.MathUtils.degToRad(rot.z)
          );
          // this.el.object3D.rotation = rot;
          this.el.setAttribute('material', {opacity: 0.25, transparent: true});
       
            
          this.el.setAttribute("scale", scale);
         
          // this.lineEl = document.createElement("a-entity");
          // this.el.sceneEl.appendChild(this.lineEl);
          // this.lineEl.setAttribute("mod_line", {"init": true});
          // this.lineEl.setAttribute("position", pos);
          if (this.hasTriggerAction) {
            this.el.setAttribute("mod_line", {"init": true});
          }
  
  
  
        }
        if (this.data.followPathNewObject) {
          this.moveOnCurve(); //todo fix quats!
        }
        if (this.data.objectData.physics != undefined && this.data.objectData.physics != null && this.data.objectData.physics.toLowerCase() != "none") {
          console.log("tryna add physics to mod_objecty " + this.data.objectData.name + " is equipped " + this.data.isEquipped + " body " + this.data.objectData.physics);
          //  setTimeout(function(){  
            if (this.data.isEquipped) {
              // this.el.setAttribute('ammo-body', {type: 'kinematic', linearDamping: .1, angularDamping: .1});
            } else { //nm, switch to dynamic when fired if needed/
              if (this.hasShootAction) {
                // this.el.setAttribute('ammo-body', {type: this.data.objectData.physics.toLowerCase(), gravity: '0 -.1 0', angularFactor: '1 0 1', emitCollisionEvents: true, linearDamping: .1, angularDamping: 1}); //nope, shoot is not physical now
                console.log("tryna shoot!");
                this.el.setAttribute('ammo-body', {type: 'kinematic', emitCollisionEvents: true});
                //this.el.body.restitution = .9;
                this.el.setAttribute('trail', "");
              } else if (this.hasThrowAction) {
                console.log("tryna throw..");
                  this.el.setAttribute('ammo-body', { type: this.data.objectData.physics.toLowerCase(), emitCollisionEvents: true, linearDamping: .1, angularDamping: .1 });
                  // this.el.setAttribute('rotate-toward-velocity');
                  // this.el.setAttribute('trail', "");
                  // this.el.body.restitution = .9;
                  this.el.setAttribute('trail', "");
              } else if (this.data.objectData.physics.toLowerCase() == "navmesh agent") {
                this.el.setAttribute('ammo-body', {type: 'kinematic', emitCollisionEvents: true });
              } else {
                setTimeout( () => { //wait a bit for static colliders to load...
                  console.log("tryna set physics body "+ this.data.objectData.physics.toLowerCase());
                  this.el.setAttribute('ammo-body', { type: this.data.objectData.physics.toLowerCase(), emitCollisionEvents: true });
                }, 10000);
               
                //this.el.body.restitution = .9;
              }
  
            }
        }
        if (this.loadAction != null) {
          if (this.loadAction.actionResult.toLowerCase() == "trigger fx") {
            let particleSpawner = document.getElementById('particleSpawner');
            if (particleSpawner != null) {
              var worldPosition = new THREE.Vector3();
              this.el.object3D.getWorldPosition(worldPosition);
              if (this.data.objectData.yPosFudge != null && this.data.objectData.yPosFudge != "") {
                worldPosition.y += this.data.objectData.yPosFudge;
              }
              console.log("triggering fx at " + JSON.stringify(worldPosition) + " plus" + this.data.objectData.yPosFudge);
              particleSpawner.components.particle_spawner.spawnParticles(worldPosition, this.data.objectData.particles, 5, this.el.id, this.data.objectData.yPosFudge, this.data.objectData.color1, this.data.objectData.triggerScale);
            }
          }
        }
          // this.el.setAttribute("aabb-collider", {objects: ".activeObjexRay"});
  
  
          // // if (!this.isInitialized) {
          //   if (this.data.eventData.includes("scatter")) {
          //     // this.el.object3D.visible = false;
          //     console.log("GOTSA SCATTER OBJEK@");
          //   }
          // this.oScale = oScale;
          this.bubble = null;
          this.bubbleText = null;
          this.isInitialized = true;
          this.meshChildren = [];
          let theEl = this.el;
          const obj = this.el.getObject3D('mesh');
          
          if (obj) {
            if (this.data.shader != "") {
              console.log("gotsa shader " + this.data.shader);
             
              // this.recursivelySetChildrenShader(obj);
  
            }
            // let dynSkybox = document.getElementById('')
            // for (let e = 0; e < textData.length; e++) {
            //   if (textData[e].toLowerCase().includes("refract")){
            //     console.log("tryna set refraction");
            //     obj.material.refractionRatio = .9;
            //     obj.material.reflectivity = .5;
            //   }
            // }
  
            if (this.data.eventData.toLowerCase().includes("target")) {
              this.el.id = "target_object";
            }
            if (this.data.eventData.toLowerCase().includes("transparent")) {
              console.log("tryna set transparent");
              obj.visible = false;
            }
            if (this.data.eventData.toLowerCase().includes("particle")) {
              console.log("tryna spawn a particle!");
  
              this.el.setAttribute('mod_particles', {type: 'fireball'});
           
            }
            if (this.data.eventData.toLowerCase().includes("fireworks")) {
              console.log("tryna spawn fireworks!");
  
              this.el.setAttribute('fireworks_spawner', {type: 'fireball'});
           
            }
            if (this.data.eventData.toLowerCase().includes("audiotrigger")) {
              // console.log("gotsa audiotrigg3re!");
  
              // this.el.setAttribute('fireworks_spawner', {type: 'fireball'});
              this.hasAudioTrigger = true;
            }
            if (this.data.eventData.toLowerCase().includes("agent")) { 
              if (settings.useNavmesh) {
                this.el.setAttribute("nav-agent", "");
                this.el.setAttribute("nav_agent_controller", "");  
                this.el.classList.add("nav_agent");
                // this.el.setAttribute("mod_physics", {'model': 'agent', 'isTrigger': true});
              }
            }
  
            let worldPos = null;
            let hasAnims = false;
            let hasPicPositions = false;
            let hasVidPositions = false;
            let hasAudioPositions = false;
            camera = AFRAME.scenes[0].camera; 
            mixer = new THREE.AnimationMixer( obj );
            clips = obj.animations;
  
            if (clips != null) { 
              for (i = 0; i < clips.length; i++) { //get reference to all anims
                hasAnims = true;
                // console.log("model has animation: " + clips[i].name);
                
                if (clips[i].name.includes("mouthopen")) {
                  moIndex = i;
                  this.mouthClips.push(clips[i]);
                }
                // if (clips[i].name.includes("mouthopen")) {
                //   moIndex = i;
                // }
                if (clips[i].name.toLowerCase().includes("mixamo")) {
                  console.log("gotsa mixamo idle anim");
                  idleIndex = i;
                  this.idleClips.push(clips[i]);
                }
                if (clips[i].name.toLowerCase().includes("take 001")) {
                  idleIndex = i;
                  this.idleClips.push(clips[i]);
                }
                if (clips[i].name.toLowerCase().includes("idle")) {
                  idleIndex = i;
                  this.idleClips.push(clips[i]);
                }
                if (clips[i].name.toLowerCase().includes("walk")) {
                  walkIndex = i;
                  this.walkClips.push(clips[i]);
                }
                if (clips[i].name.toLowerCase().includes("talk")) {
                  talkIndex = i;
                  this.talkClips.push(clips[i]);
                }
                if (clips[i].name.toLowerCase().includes("dance")) { //etc..
                  danceIndex = i;
                  this.danceClips.push(clips[i]);
                }
                if (i == clips.length - 1) {
                    if (hasAnims) {
                      console.log("model has anims " + this.data.eventData + " idelIndex " + idleIndex);
                    if (this.data.eventData.includes("loop_all_anims")) {
                      theEl.setAttribute('animation-mixer', {
                        "clip": clips[0].name,
                        "loop": "repeat",
                      });
                    }
                    if (this.data.eventData.includes("loop_dance_anims")) {
                      theEl.setAttribute('animation-mixer', {
                        "loop": "repeat",
                      });
                    }
                    if (idleIndex != -1) {
                      theEl.setAttribute('animation-mixer', {
                        "clip": clips[idleIndex].name,
                        "loop": "repeat",
                      });
                    }
                  }
                }
              }
  
            }
            obj.traverse(node => { //spin through object heirarchy to sniff for special names, e.g. "eye"
              this.nodeName = node.name;
              node.frustumCulled = false; //just turn off for everything, objects are special...
  
              if (this.data.eventData.includes("eyelook") && this.nodeName.includes("eye")) { //must be set in eventData and as mesh name
                if (node instanceof THREE.Mesh) {
                this.meshChildren.push(node);
                console.log("gotsa eye!");
                }
              }
             
            });         
            
            for (i = 0; i < this.meshChildren.length; i++) { //apply mods to the special things
              console.log("gotsa special !! meshChild " + this.meshChildren[i].name);
              if (this.meshChildren[i].name.includes("trigger")) { 
                //ugh, nm
                  let child = this.el.object3D.getObjectByName(this.meshChildren[i].name, true);
                  child.visible = false;
  
                  // let triggerEl = document.createElement('a-entity'); //later
                  // var targetPos = new THREE.Vector3();
                  // child.getWorldPosition(targetPos);
                  // this.child = child.clone();
                  // triggerEl.setObject3D("mesh", this.child);
                  // // let child = this.child.clone();
                  // // this.child.position(targetPos);
                  // // triggerEl.setObject3D("mesh", child.clone());
                  // // triggerEl.setObject3D("mesh", child);
                  // child.remove();
                  // // triggerEl.setAttribute('geometry', {primitive: 'box', width: 1});
                  // triggerEl.setAttribute('position', targetPos);
                  // console.log("gotsa special teryna set a trigger mesh..");
                  // triggerEl.setAttribute('mod_physics', {eventData: this.data.eventData, tags: this.data.tags, isTrigger: true});
                  // // triggerEl.classList.add('activeObjexRay');
                  // triggerEl.id = "TRIGGGER";
                  // this.sceneEl.appendChild(triggerEl);
                  
                  // triggerEl.classList.add('trigger');
              }
                if (this.meshChildren[i].name.includes("eye")) { //mod_object eye
                console.log("gotsa eye too!");
                let child = this.el.object3D.getObjectByName(this.meshChildren[i].name, true);
                if (child != null) { 
                  let box = new THREE.Box3().setFromObject(child); //bounding box for position
                  let center = new THREE.Vector3();
                  box.getCenter(center); //get centerpoint of eye child geometry, in localspace
                  child.geometry.center(); //reset pivot of eye geo
                  child.position.set(0,0,0); //clear transforms so position below won't be offset
                  let theEye = document.createElement("a-entity");
                  theEye.setObject3D("Object3D", child);
                  theEye.setAttribute("look-at", "#player");
                  this.el.appendChild(theEye); //set as child of DOM heirarchy, not just parent model
                  theEye.setAttribute("position", obj.worldToLocal(center)); //set position as local to 
                  obj.updateMatrix();
                  obj.updateMatrixWorld();
                }
              } else if(this.meshChildren[i].name.includes("callout")) {
                // console.log("gotsa callout! " + this.meshChildren[i].name);
                let child = this.el.object3D.getObjectByName(this.meshChildren[i].name, true);
                // console.log(child);
                if (child != null && child != undefined) { 
                  //
                  var calloutChild = document.createElement('a-entity');
                  calloutChild.classList.add("activeObjexRay");
                  calloutChild.setObject3D("Object3D", child);
                  this.calloutString = this.meshChildren[i].name.split("_")[0];
                  console.log("callout string is " + this.meshChildren[i].name);
  
                  // calloutChild.addEventListener('model-loaded', () => {
                    // console.log("callout! " +callout);
                    calloutChild.setAttribute("model-callout", this.calloutString);
  
                  this.el.appendChild(calloutChild);
  
                }
              }
            }
            // if (this.el.classList.contains('target') || this.data.markerType != "none") {
            // let hasBubble = false;
            // let theEl = this.element;
            // this.el.setAttribute('gesture-handler-add'); //ar mode only?
            var sceneEl = document.querySelector('a-scene');
            let hasCallout = false;
            let calloutOn = false;
            let eventData = this.data.eventData;
            /// SHOULD INSTEAD LOOK AT THE OBJECT TEXT PROPS?!?
            // if (this.tags != null && this.tags.includes("thoughtbubble") && !this.data.eventData.toLowerCase().includes("undefined") && this.data.eventData.toLowerCase().includes("main") && this.data.eventData.toLowerCase().includes("text")) {
            if (this.data.eventData.toLowerCase().includes("main") && this.data.eventData.toLowerCase().includes("text")) {
              document.getElementById("mainTextToggle").setAttribute("visible", false);
              this.data.eventData = document.getElementById("mainText").getAttribute("main-text-control", "mainTextString"); 
              console.log("target eventData : "+ JSON.stringify(this.data.eventData));
              this.textData = this.data.eventData.mainTextString.split("~");
            } else {
              // this.textData = 
              if (this.data.eventData.toLowerCase().includes("callout") ) {
                hasCallout = true;
                this.textData = this.data.locationData.description;
              }
            }
  
            if (this.tags != null && this.tags.includes("thoughtbubble")) {
            
              hasCallout = true;
            } 
            if (hasCallout) {
              let bubble = document.createElement("a-entity");
              this.bubble = bubble;
              console.log("made a bubble!" + bubble);
              // bubble.setAttribute("look-at", "#player");
              if (settings && settings.sceneCameraMode == "Third Person") {
                bubble.setAttribute("look-at", "#thirdPersonCamera");
              } else {
                bubble.setAttribute("look-at", "#player");
              }
              
              bubble.classList.add("bubble");
              bubble.setAttribute("position", "2 2 0");
              bubble.setAttribute("rotation", "0 0 0"); 
              bubble.setAttribute("scale", "2 2 2"); 
              bubble.setAttribute("visible", false);
              if (eventData.includes("agent")) {
                this.el.appendChild(bubble); //make it a child if
              } else {
                sceneEl.appendChild(bubble); //or else put at top
              }
             
              
              let bubbleBackground = document.createElement("a-entity");
              bubbleBackground.classList.add("bubbleBackground");
              bubbleBackground.setAttribute("gltf-model", "#thoughtbubble"); //just switch this for other callout types (speech and plain callout)
              bubbleBackground.setAttribute("position", "0 0 1");
              bubbleBackground.setAttribute("rotation", "0 0 0"); 
              bubbleBackground.setAttribute("scale", "-.1 .1 .1"); 
              // bubble.setAttribute("material", {"color": "white", "blending": "additive", "transparent": false, "alphaTest": .5});
              bubbleBackground.setAttribute("material", {"color": "white", "shader": "flat"}); //doh, doesn't work for gltfs... 
              bubble.appendChild(bubbleBackground);
  
              
              let bubbleText = document.createElement("a-entity");
              this.bubbleText = bubbleText;
              bubbleText.classList.add("bubbleText");
              // bubbleText.setAttribute("visible", false);
              bubbleText.setAttribute("position", "0 0 1.1");
              bubbleText.setAttribute("scale", ".1 .1 .1"); 
  
              
              // bubbleText.setAttribute("look-at", "#player");
              if (settings && settings.sceneCameraMode == "Third Person") {
                bubbleText.setAttribute("look-at", "#thirdPersonCamera");
              } else {
                bubbleText.setAttribute("look-at", "#player");
              }
              bubbleText.setAttribute("width", 3);
              bubbleText.setAttribute("height", 2);
              bubble.appendChild(bubbleText);
              
              bubbleBackground.addEventListener('model-loaded', () => {
                const bubbleObj = bubbleBackground.getObject3D('mesh');
                // var material = new THREE.MeshBasicMaterial({map: bubbleObj.material.map}); 
                // material.color = "white";
                bubbleObj.traverse(node => {
                    // node.material = material;
                    node.material.flatShading = true;
                    node.material.needsUpdate = true
                  });
                });
                /*
              setInterval(function(){ //get "viewport" position (normalized screen coords)
                if (calloutOn) {
                let pos = new THREE.Vector3();
                pos = pos.setFromMatrixPosition(obj.matrixWorld); //world pos of model, kindof
                // worldPos = pos;
                pos.project(camera);
                var width = window.innerWidth, height = window.innerHeight; 
                let widthHalf = width / 2;
                let heightHalf = height / 2;
                pos.x = (pos.x * widthHalf) + widthHalf;
                pos.y = - (pos.y * heightHalf) + heightHalf;
                pos.z = 0;
                // if (pos.x != NaN) { //does it twice because matrix set, disregard if it returns NaN :( //fixed?
                //   console.log("screen position: " + (pos.x/width).toFixed(1) + " " + (pos.y/height).toFixed(1)); //"viewport position"
                // }
                if ((pos.x/width) < .45) {
                  console.log("flip left");
                  bubbleBackground.setAttribute("position", "4 2 1");
                  bubbleBackground.setAttribute("scale", "-.1 .1 .1"); 
                  bubbleText.setAttribute("position", "4 2 1.1");
                } 
                if ((pos.x/width) > .55) {
                  console.log("flip right");
                  bubbleBackground.setAttribute("position", "-4 2 1");
                  bubbleBackground.setAttribute("scale", ".1 .1 .1"); 
                  bubbleText.setAttribute("position", "-4 2 1.1");
                }
  
                }
              }, 2000);
              */
              // }
            }
  
            let primaryAudio = document.getElementById("primaryAudio");
            if (primaryAudio != null) {
              const primaryAudioControlParams = primaryAudio.getAttribute('primary_audio_control');
  
          
              if (primaryAudioControlParams.targetattach) { //set by sceneAttachPrimaryAudioToTarget or something like that...
                console.log("tryna target attach primary audio " + primaryAudioControlParams.targetattach);
  
              document.getElementById("primaryAudioParent").setAttribute("visible", false);
              // document.getElementById("primaryAudioParent").setAttribute("position", theEl.position);
              primaryAudio.emit('targetattach', {targetEntity: this.el}, true);
              primaryAudioHowl.pos(this.el.object3D.position.x, this.el.object3D.position.y, this.el.object3D.position.z);
              
              this.el.addEventListener('click', function () {
  
                this.bubble = sceneEl.querySelector('.bubble');
                if (this.bubble) {
                  this.bubble.setAttribute('visible', false);
                }
                calloutOn = false;
                // this.bubbleText = theEl.querySelector('.bubbleText');
                // this.bubble = sceneEl.querySelector('.bubble');
                // this.bubbleText = sceneEl.querySelector('.bubbleText');
                // if (hasCallout) {
                //   this.bubble.setAttribute("visible", false);
                //   this.bubbleText.setAttribute("visible", false);
                // }
                if (!primaryAudioHowl.playing()) {
                    primaryAudioHowl.play();
                    console.log('...tryna play...');
                    if (moIndex != -1) { //moIndex = "mouthopen"
                      theEl.setAttribute('animation-mixer', {
                        "clip": clips[moIndex].name,
                        "loop": "repeat",
                        "repetitions": 10,
                        "timeScale": 2
                      });
                      theEl.addEventListener('animation-finished', function () { 
                        theEl.removeAttribute('animation-mixer');
                      });
                    }
                  } else {
                        primaryAudioHowl.pause();
                        console.log('...tryna pause...');
                    }
                });        
              }
            } 
           
  
          }
      }); //end model-loaded listener
  
      this.el.addEventListener('body-loaded', () => {  //body-loaded event = physics ready on obj
        console.log("loaded mod_object physics body now applying shape: : " + this.data.objectData.collidertype.toLowerCase());
        this.el.setAttribute('ammo-shape', {type: this.data.objectData.collidertype.toLowerCase()});
        // console.log("ammo shape is " + JSON.stringify(that.el.getAttribute('ammo-shape')));
        if (this.data.applyForceToNewObject) {
          // this.el.setAttribute("aabb-collider", {objects: ".activeObjexRay"});
          this.applyForce();
        }
  
        this.el.addEventListener("collidestart", (e) => {
          e.preventDefault();
          let targetModObjComponent = e.detail.targetEl.components.mod_object;
          // console.log("mod_physics collisoin with object with :" + this.el.id + " " + e.detail.targetEl.classList);
          if (this.data.isTrigger) { //
            console.log("TRIGGER HIT "  + this.el.id + " " + e.detail.targetEl.classList);
            // e.detail.body.disableCollision = true;
            this.disableCollisionTemp(); //must turn it off or it blocks, no true "trigger" mode afaik (unlike cannonjs!) //um, no just use kinematic type...
            var triggerAudioController = document.getElementById("triggerAudio");
            if (triggerAudioController != null) {
              triggerAudioController.components.trigger_audio_control.playAudioAtPosition(this.hitpoint, this.distance, ["hit"]);
            }
          } else {
            // console.log("COLLIDER HIT "  + this.el.id + " vs " + e.detail.targetEl.id);
            // console.log("NOT TRIGGER COLLIDED "  + this.el.object3D.name + " " + e.detail.targetEl.object3D.name + " has mod_object " + mod_obj_component);
            // if (this.el != e.detail.targetEl) {
              
              if (targetModObjComponent != null) {
                console.log(this.data.objectData.name + " gotsa collision with " + targetModObjComponent.data.objectData.name);
                if (this.data.objectData.name != targetModObjComponent.data.objectData.name) { //don't trigger yerself, but what if...?
                  // console.log("actions: " + JSON.stringify(mod_obj_component.data.objectData.actions));
                  var triggerAudioController = document.getElementById("triggerAudio");
                  if (triggerAudioController != null) {
                    triggerAudioController.components.trigger_audio_control.playAudioAtPosition(this.el.object3D.position, window.playerPosition.distanceTo(this.el.object3D.position), ["magic"]);
                  }
                  if (targetModObjComponent.data.objectData.actions) {
                    for (let i = 0; i < targetModObjComponent.data.objectData.actions.length; i++) {
                      console.log(this.data.objectData.name + "checking actions on target " + targetModObjComponent.data.objectData.name + " : " + targetModObjComponent.data.objectData.actions[i].actionName );
                      if (targetModObjComponent.data.objectData.actions[i].actionType.toLowerCase() == "collide") {
                        if (targetModObjComponent.data.objectData.actions[i].sourceObjectMod.toLowerCase() == "remove") {
                          let trailComponent = e.detail.targetEl.components.trail;
                          if (trailComponent) {
                            trailComponent.reset();
                          }
                          if (e.detail.targetEl.parentNode) {
                            e.detail.targetEl.parentNode.removeChild(e.detail.targetEl);
                          }
                          // e.detail.targetEl.parentNode.removeChild(e.detail.targetEl);
  
                        }
                        if (targetModObjComponent.data.objectData.actions[i].sourceObjectMod.toLowerCase() == "replace object") {
                          // console.log("tryna replace object...");
                          let trailComponent = e.detail.targetEl.components.trail;
                          if (trailComponent) {
                            trailComponent.kill();
                            // e.detail.targetEl.removeAttribute("trail");
                          }
                          if (e.detail.targetEl.parentNode) {
                            e.detail.targetEl.parentNode.removeChild(e.detail.targetEl);
                          }
                          // e.detail.targetEl.parentNode.removeChild(e.detail.targetEl);
                          let objexEl = document.getElementById('sceneObjects');    
                          let objectData = objexEl.components.mod_objex.returnObjectData(targetModObjComponent.data.objectData.actions[i].objectID);
                          // if (objectData == null) {
  
                          //   // objectData = objexEl.components.mod_objex.returnObjectData(mod_obj_component.data.objectData.actions[i].objectID); //try again, if it's not in the sceneobjectdata it will make a special request
                          // }
                          if (objectData != null) {
                            console.log("tryna replace object with " + JSON.stringify(objectData));
                            // this.objectData = this.returnObjectData(mod_obj_component.data.objectData.actions[i].objectID);
  
                            // this.dropPos = new THREE.Vector3();
                            this.objEl = document.createElement("a-entity");
  
                            this.locData = {};
                            this.locData.x = this.el.object3D.position.x;
                            this.locData.y = this.el.object3D.position.y;
                            this.locData.z = this.el.object3D.position.z;
                            this.locData.timestamp = Date.now();
                            this.objEl.setAttribute("mod_object", {'locationData': this.locData, 'objectData': objectData});
                            this.objEl.id = "obj" + objectData._id + "_" + this.locData.timestamp;
                            sceneEl.appendChild(this.objEl);
                          } else {
                            console.log("caint find object "+ targetModObjComponent.data.objectData.actions[i].objectID +", tryna fetch it..");
                            FetchSceneInventoryObject(targetModObjComponent.data.objectData.actions[i].objectID);
                          }
                        }
   
                      }
                    }
                  }
                }
              }
              if (this.hasShootAction && e.detail.targetEl.id != "player") {
                console.log("tryna cleanup!")
                this.el.sceneEl.object3D.remove(this.line);
               
                let trailComponent = this.el.components.trail;
                if (trailComponent) {
                  trailComponent.kill();
                  // this.el.removeAttribute("trail");
                }
                // if (this.el.parentNode) {
                //   this.el.parentNode.removeChild(this.el);
                // } else {
                //   let me = this.el.id;
                //   document.getElementById(me).remove();
                // }
                
              }
                    // if (this.findAction) { //check if we hit something we're looking for
                    //   if (this.findAction.tags) {
                    //     for (let i = 0; i < this.findAction.tags.length; i++) {
                    //       if (e.detail.targetEl.classList.contains(this.findAction.tags[i])) {
                    //         console.log("I FOUND ONE!");
                    //         if (this.navAgentController) {
                    //           this.navAgentController.updateAgentState("pause"); //
                    //         } else {
                    //           this.navAgentController = this.el.components.nav_agent_controller;
                    //         }
                    //       }
                          
                    //     }
                    //   }
                    // }
            // }
          }
        });
      
      }); //end body-loaded listener
  
      
  
  
      this.el.addEventListener('raycaster-intersected', e =>{  
          this.raycaster_e = e.detail.el;
          // that.raycaster = this.raycaster;
          this.intersection = this.raycaster_e.components.raycaster.getIntersection(this.el, true);
          if (this.intersection) {
            this.hitpoint = this.intersection.point;
            that.hitpoint = this.hitpoint;
            console.log(that.data.objectData.name + " with tags " + this.tags);
          }
      });
      this.el.addEventListener("raycaster-intersected-cleared", () => {
          // console.log("intersection cleared");
          that.mouseOverObject = null;
          this.raycaster_e = null;
          this.hitpoint = null;
          that.hitpoint = null;
          this.playerPosRot = null; 
          that.playerPosRot = null;
  
      });
  
      this.el.addEventListener('mouseenter', (evt) => {
        console.log("mouse enter mod_object "+ this.el.id);
        // evt.preventDefault();
        if (!this.data.isEquipped) {
          if (posRotReader != null) {
            this.playerPosRot = posRotReader.returnPosRot(); 
            window.playerPosition = this.playerPosRot.pos; 
          } else {
            posRotReader = document.getElementById("player").components.get_pos_rot; 
            this.playerPosRot = posRotReader.returnPosRot(); 
            window.playerPosition = this.playerPosRot.pos; 
          }
          // console.log(window.playerPosition);
          if (!this.isSelected && evt.detail.intersection != null) {
            this.clientX = evt.clientX;
            this.clientY = evt.clientY;
            console.log("tryna mouseover " + this.data.objectData.name);
            // that.calloutToggle = !that.calloutToggle;
  
            this.pos = evt.detail.intersection.point; //hitpoint on model
            let name = evt.detail.intersection.object.name;
            this.hitPosition = this.pos;
            // if (player != null && window.playerPosition != undefined) {
            this.distance = window.playerPosition.distanceTo(this.hitPosition);
            // console.log("distance  " + this.distance);
            this.rayhit(evt.detail.intersection.object.name, this.distance, evt.detail.intersection.point);
  
              this.selectedAxis = name;
            ////////TODO - wire in to Hightlight Options / Callout Options in Object view
            if (this.tags != null && this.tags.includes("thoughtbubble")) {
              calloutOn = true;
  
              this.bubble = sceneEl.querySelector('.bubble');
              this.bubbleText = sceneEl.querySelector('.bubbleText');
              this.bubbleBackground = sceneEl.querySelector('.bubbleBackground');
              
              this.bubble.setAttribute("visible", true);
              let pos = evt.detail.intersection.point; //hitpoint on model
              this.bubble.setAttribute('position', pos);
              this.bubbleText.setAttribute("visible", true);
              // this.bubbleText.setAttribute('position', pos);
  
              // let pos = new THREE.Vector3();
              // pos = pos.setFromMatrixPosition(obj.matrixWorld); //world pos of model, kindof
              // worldPos = pos;
              let camera = AFRAME.scenes[0].camera; 
              pos.project(camera);
              var width = window.innerWidth, height = window.innerHeight; 
              let widthHalf = width / 2;
              let heightHalf = height / 2;
              pos.x = (pos.x * widthHalf) + widthHalf;
              pos.y = - (pos.y * heightHalf) + heightHalf;
              pos.z = 0;
              // if (pos.x != NaN) { //does it twice because matrix set, disregard if it returns NaN :( //fixed?
              //   console.log("screen position: " + (pos.x/width).toFixed(1) + " " + (pos.y/height).toFixed(1)); //"viewport position"
              // }
  
              if ((pos.x/width) < .45) {
                console.log("flip left");
                this.bubbleBackground.setAttribute("position", ".5 .2 .5");
                this.bubbleBackground.setAttribute("scale", "-.2 .2 .2"); 
                // this.bubbleBackground.setAttribute('scale', {x: this.distance * -.25, y: this.distance * .25, z: this.distance * .25} );
                this.bubbleText.setAttribute("scale", ".2 .2 .2"); 
                this.bubbleText.setAttribute("position", ".5 .2 .55");
              } 
              if ((pos.x/width) > .55) {
                console.log("flip right");
                this.bubbleBackground.setAttribute("position", "-.5 .2 .5");
                this.bubbleBackground.setAttribute("scale", ".2 .2 .2"); 
                // this.bubbleBackground.setAttribute('scale', {x: this.distance * -.25, y: this.distance * .25, z: this.distance * .25} );
                this.bubbleText.setAttribute("scale", ".2 .2 .2")
                this.bubbleText.setAttribute("position", "-.5 .2 .55");
              }
              let font = "Acme.woff";
              if (settings && settings.sceneFontWeb2 && settings.sceneFontWeb2.length) {
                font = settings.sceneFontWeb2;
              }
              this.bubbleText.setAttribute('troika-text', {
                baseline: "bottom",
                align: "center",
                font: "/fonts/web/" + font,
                fontSize: .2,
                anchor: "center",
                // wrapCount: 20,
                color: "black",
                value: this.textData[this.textIndex]
  
              });
  
              if (this.textIndex < this.textData.length - 1) {
                this.textIndex++;
              } else {
                this.textIndex = 0;
              }
            } else { //"normal" callout 
              // document.getElementById("player").component.get_pos_rot.returnPosRot();
              // this.clientX = evt.clientX;
              // this.clientY = evt.clientY;
              // console.log("tryna callout " + this.calloutEntity.id);
              // // that.calloutToggle = !that.calloutToggle;
  
              // this.pos = evt.detail.intersection.point; //hitpoint on model
              // let name = evt.detail.intersection.object.name;
              // this.hitPosition = this.pos;
              // // if (player != null && window.playerPosition != undefined) {
              // this.distance = window.playerPosition.distanceTo(this.hitPosition);
              // // console.log("distance  " + this.distance);
              // this.rayhit(evt.detail.intersection.object.name, this.distance, evt.detail.intersection.point);
  
              //   this.selectedAxis = name;
  
              // let elPos = this.el.getAttribute('position');
              if (this.calloutEntity != null && this.distance < 20) {
                this.calloutEntity.setAttribute('visible', false);
                console.log("trna scale to distance :" + this.distance);
             
                
                this.calloutEntity.setAttribute('visible', true);
                this.calloutEntity.setAttribute('scale', {x: this.distance * .25, y: this.distance * .25, z: this.distance * .25} );
                if (!this.isNavAgent) {
                  this.calloutEntity.setAttribute("position", this.pos);
                } else {
                  this.calloutEntity.setAttribute("position", "0 2 0");
                }
                let theLabel = this.data.objectData.labeltext;
                let calloutString = theLabel;
                if (this.calloutLabelSplit.length > 0) {
                  if (this.calloutLabelIndex < this.calloutLabelSplit.length - 1) {
                    this.calloutLabelIndex++;
                  } else {
                    this.calloutLabelIndex = 0;
                  }
                  calloutString = this.calloutLabelSplit[this.calloutLabelIndex];
                }
  
              this.calloutText.setAttribute("troika-text", {value: calloutString});
              } else {
                console.log("mod_object no callout " + this.calloutEntity + " " + this.distance);
              }
  
              if (this.hasHighlightAction) {
  
              }
            }
  
            if (this.isNavAgent) {
              if (this.navAgentController && this.navAgentController.currentState != "dialog") {
                this.navAgentController.updateAgentState("greet player");
                this.el.setAttribute("look-at-y", "#player");
  
              } else {
                if (!this.navAgentController)
                this.navAgentController = this.el.components.nav_agent_controller;
              } 
              if (this.findAction) {
                
                for (let i = 0; i < this.findAction.tags.length; i++) {
                  console.log("looking for objs with class " + this.findAction.tags[i]);
                  let targetObjects = document.getElementsByClassName(this.findAction.tags[i]);
                  if (targetObjects) {
                    console.log("gots target objects " + targetObjects.length);
                    for (let l = 0; l < targetObjects.length; l++) {
                      let targetLoc = targetObjects[l].getAttribute("position");
                      this.targetLocations.push(targetLoc);
                    }
                  } else {
                    console.log("didn't find no targetObjects");
                  }
                  
                }
                if (this.targetLocations.length && this.navAgentController && this.navAgentController.currentState != "dialog") {
                  // this.navAgentController.seekTargetLocation();
                  this.navAgentController.updateAgentState("target"); //instead of waypoints
                }
              }
  
            }
            if (this.tags != undefined && this.tags != null && this.tags != "undefined") { //MAYBE SHOULD BE UNDER RAYHIT?
              console.log("tryna play audio with tags " + this.tags);
              // if (this.triggerAudioController != null) {
                // let distance = window.playerPosition.distanceTo(this.hitpoint);
                // this.triggerAudioController.components.trigger_audio_control.playAudioAtPosition(evt.detail.intersection.point, distance, this.tags, 1);//tagmangler needs an array, add vol mod 
                // this.triggerAudioController.components.trigger_audio_control.playAudioAtPosition(this.pos, this.distance, this.tags, 1);
                if (moIndex != -1) { //moIndex = "mouthopen"
                  this.el.setAttribute('animation-mixer', {
                    "clip": clips[moIndex].name,
                    "loop": "repeat",
                    "repetitions": 10,
                    "timeScale": 2
                  });
                  this.el.addEventListener('animation-finished', (e) => { 
                    this.el.removeAttribute('animation-mixer');
                  });
                }
              // }
            }
          }     
        }
        
      });
      
      this.el.addEventListener('mouseleave', (e) => { 
        e.preventDefault();
        // console.log("tryna mouseexit");
        if (!this.data.isEquipped) {
          if (this.calloutEntity != null) {
            this.calloutEntity.setAttribute('visible', false);
          }
          this.bubble = sceneEl.querySelector('.bubble');
          if (this.bubble) {
            this.bubble.setAttribute('visible', false);
          }
        }
        if (this.isNavAgent) {
          if (this.navAgentController) {
           
            // setTimeout(() => {
            //   if (this.navAgentController.currentState == "pause") {
            //   var clip = this.walkClips[Math.floor(Math.random()*this.walkClips.length)];
            //   this.el.setAttribute('animation-mixer', {
            //     "clip": clip.name,
            //     "loop": "repeat",
            //     "crossFadeDuration": .5
            //   });
            //   this.navAgentController.currentState = "random";
            //   this.navAgentController.agentAction();
            //   }
            // }, 5000);
  
            
          } else {
            this.navAgentController = this.el.components.nav_agent_controller;
          } 
        }
      });
     
  
  
      this.el.addEventListener('click', (e) => { 
        e.preventDefault();
        // let downtime = (Date.now() / 1000) - this.mouseDownStarttime;
        console.log("mousedown time "+ this.mouseDowntime + "  on mod_object type: " + this.data.objectData.objtype + " actions " + JSON.stringify(this.data.objectData.actions) + " equipped " + this.data.isEquipped);
        if (!this.data.isEquipped) {
          this.dialogEl = document.getElementById('mod_dialog');
          
          if (this.data.objectData.objtype.toLowerCase() == "pickup" || this.hasPickupAction) {
            // this.el.setAttribute('visible', false);
            if (this.data.objectData.prompttext != undefined && this.data.objectData.prompttext != null && this.data.objectData.prompttext != "") {
              if (this.data.objectData.prompttext.includes('~')) {
                this.promptSplit = this.data.objectData.prompttext.split('~'); 
              }
              // this.el.components.mod_synth.medTrigger();
              this.dialogEl.components.mod_dialog.showPanel("Pick up " + this.data.objectData.name + "?\n\n" + this.promptSplit[Math.floor(Math.random()*this.promptSplit.length)], this.el.id );
            } else {
              this.dialogEl.components.mod_dialog.showPanel("Pick up " + this.data.objectData.name + "?", this.el.id );
            }
            
          }
          if (this.selectAction) {
            console.log("select action " + JSON.stringify(this.selectAction));
            if (this.selectAction.actionResult.toLowerCase() == "trigger fx") {
              if (!this.isTriggered) {
                // var worldPosition = new THREE.Vector3();
                // this.el.object3D.getWorldPosition(worldPosition);
                this.isTriggered = true;
                let particleSpawner = document.getElementById('particleSpawner');
                if (particleSpawner != null) {
                  var worldPosition = new THREE.Vector3();
                  this.el.object3D.getWorldPosition(worldPosition);
                  if (this.data.objectData.yPosFudge != null && this.data.objectData.yPosFudge != "") {
                    worldPosition.y += this.data.objectData.yPosFudge;
                  }
                  console.log("triggering fx at " + JSON.stringify(worldPosition) + " plus" + this.data.objectData.yPosFudge);
                  particleSpawner.components.particle_spawner.spawnParticles(worldPosition, this.data.objectData.particles, 5, null, this.data.objectData.yPosFudge, this.data.objectData.color1, this.data.objectData.triggerScale);
                }
              } else {
                console.log("already triggered - make it a toggle!");
              }
            }
            if (this.selectAction.actionResult.toLowerCase() == "prompt" || this.selectAction.actionResult.toLowerCase() == "dialog") {
              if (this.isNavAgent) {
                if (this.navAgentController.currentState == "dialog") {
                  this.navAgentController.updateAgentState("random");
                } else {
                  this.navAgentController.updateAgentState("dialog");
                  if (this.objectData.audiogroupID && this.objectData.audiogroupID.length > 4) {
                    triggerAudioController
                  }
                }
                
              }
            }
          }
          
        } else { //if equipped
          if (this.hasThrowAction) {
            console.log("throw action " + JSON.stringify(this.throwAction));
            if (this.throwAction.sourceObjectMod.toLowerCase() == "persist") { //transfer to scene inventory
              this.el.object3D.visible = false;
              DropInventoryItem(this.data.objectData._id); //just drop for now...throw/shoot/swing next!
              setTimeout(() => {
                this.el.object3D.visible = true;
              }, 3000);
            } else if (this.throwAction.sourceObjectMod.toLowerCase() == "remove") {
              if (this.mouseDowntime <= 0) {
                this.mouseDowntime = 1;
              }
              this.objexEl.components.mod_objex.throwObject(this.data.objectData._id, this.mouseDowntime, "5");
            }
            if (this.triggerAudioController != null) {
              this.triggerAudioController.components.trigger_audio_control.playAudioAtPosition(this.hitpoint, this.distance, ["throw"], .5);//tagmangler needs an array
            }
          }
          if (this.hasShootAction) {
            console.log("shoot action " + JSON.stringify(this.shootAction));
            // if (this.shootAction.sourceObjectMod.toLowerCase() == "persist") { //transfer to scene inventory
            //   this.el.object3D.visible = false;
            //   DropInventoryItem(this.data.objectData._id); //just drop for now...throw/shoot/swing next!
            //   setTimeout(() => {
            //     this.el.object3D.visible = true;
            //   }, 3000);
            // } else if (this.throwAction.sourceObjectMod.toLowerCase() == "remove") {
            //   if (this.mouseDowntime <= 0) {
            //     this.mouseDowntime = 1;
            //   }
            //   this.objexEl.components.mod_objex.shootObject(this.data.objectData._id, this.mouseDowntime, "5");
            // }
            if (this.triggerAudioController != null) {
              this.triggerAudioController.components.trigger_audio_control.playAudioAtPosition(this.hitpoint, this.distance, ["shoot"], .5);//tagmangler needs an array, add vol mod 
            }
            this.el.object3D.visible = false;
            this.el.classList.remove("activeObjexRay");
            setTimeout(() => {
              this.el.object3D.visible = true;
              this.el.classList.add("activeObjexRay");
            }, 3000);
            this.objexEl.components.mod_objex.shootObject(this.data.objectData._id);
            // this.applyForce();
            
          } 
          if (this.hasTriggerAction) {
  
          }
          if (this.selectAction) {
            console.log("select action " + JSON.stringify(this.selectAction));
            if (this.selectAction.actionResult.toLowerCase() == "trigger fx") { //e.g. light a torch
              if (!this.isTriggered) {
                this.isTriggered = true;
                let particleSpawner = document.getElementById('particleSpawner');
                if (particleSpawner != null) {
                  this.loc = this.el.getAttribute('position');
                  if (this.data.objectData.yPosFudge != null && this.data.objectData.yPosFudge != "") {
                    var worldPosition = new THREE.Vector3();
                    this.el.object3D.getWorldPosition(worldPosition);
                    console.log("this.loc.y " + worldPosition + " plus" + this.data.objectData.yPosFudge);
                    worldPosition.y += this.data.objectData.yPosFudge;
                  }
                  let particle_spawner = particleSpawner.components.particle_spawner;
                  if (particle_spawner != null) {
                    particleSpawner.components.particle_spawner.spawnParticles(worldPosition, this.data.objectData.particles, 5, this.el.id, this.data.objectData.yPosFudge, this.data.objectData.color1, this.data.objectData.triggerScale);
                  }
                  
                }
              } else {
                console.log("already triggered - make it a toggle!");
              }
            }
          }       
        }
  
      });
    },
    playAnimation: function (animState) {
      if (this.navAgentController) {
    //   console.log("tryna play animState " + animState);
        if (animState == "greet player") {
          animState = "target";
        } 
        if (animState == "dialog") {
          animState = "talk";
        } 
       switch (animState) { 
          case "talk": 
          if (this.talkClips.length > 0) {
            var clip = this.talkClips[Math.floor(Math.random()*this.talkClips.length)];
              this.el.setAttribute('animation-mixer', {
                "clip": clip.name,
                "loop": "pingpong",
                "repetitions": 3,
                "crossFadeDuration": 1,
                "timeScale": this.navAgentController.currentSpeed
              });
              this.el.addEventListener('animation-finished', () => { 
                this.el.removeAttribute('animation-mixer');
                var clip = this.talkClips[Math.floor(Math.random()*this.talkClips.length)];
                this.el.setAttribute('animation-mixer', {
                  "clip": clip.name,
                  "loop": "pingpong",
                  "repetitions": 3,
                  "crossFadeDuration": 1,
                  "timeScale": this.navAgentController.returnRandomNumber(.75, 1.25)
                });
              });
            } else {
              console.log("no walk clips found!");
            }
          break;
         case "random": 
         if (this.walkClips.length > 0) {
           var clip = this.walkClips[Math.floor(Math.random()*this.walkClips.length)];
             this.el.setAttribute('animation-mixer', {
               "clip": clip.name,
               "loop": "repeat",
               "crossFadeDuration": 1,
               "timeScale": this.navAgentController.currentSpeed
             });
             this.el.addEventListener('animation-finished', () => { 
               this.el.removeAttribute('animation-mixer');
               var clip = this.walkClips[Math.floor(Math.random()*this.walkClips.length)];
               this.el.setAttribute('animation-mixer', {
                 "clip": clip.name,
                 "loop": "repeat",
                 "crossFadeDuration": 1,
                 "timeScale": this.navAgentController.currentSpeed
               });
             });
           } else {
             console.log("no walk clips found!");
           }
         break;
   
         case "pause": 
         if (this.idleClips.length > 0) {
           var clip = this.idleClips[Math.floor(Math.random()*this.idleClips.length)];
             this.el.setAttribute('animation-mixer', {
               "clip": clip.name,
               "loop": "repeat",
               "crossFadeDuration": 1,
               "timeScale": this.navAgentController.currentSpeed
             });
             this.el.addEventListener('animation-finished', () => { 
               this.el.removeAttribute('animation-mixer');
               var clip = this.idleClips[Math.floor(Math.random()*this.idleClips.length)];
               this.el.setAttribute('animation-mixer', {
                 "clip": clip.name,
                 "loop": "repeat",
                 "crossFadeDuration": 1,
                 "timeScale": this.navAgentController.returnRandomNumber(.75, 1.25)
               });
             });
           }  else {
             console.log("no idle clips found!");
           }
         break;  
         case "target": 
         if (this.walkClips.length > 0) {
           var clip = this.walkClips[Math.floor(Math.random()*this.walkClips.length)];
             this.el.setAttribute('animation-mixer', {
               "clip": clip.name,
               "loop": "repeat",
               "crossFadeDuration": 1
               // "repetitions": Math.floor(Math.random()*2)
               // "timeScale": .75 + Math.random()/2
             });
           }
         break;
         case "dance": 
         if (this.danceClips.length > 0) {
          var clip = this.danceClips[Math.floor(Math.random()*this.danceClips.length)];
            this.el.setAttribute('animation-mixer', {
              "clip": clip.name,
              "loop": "repeat",
              "crossFadeDuration": 1,
              "timeScale": this.navAgentController.currentSpeed
            });
            this.el.addEventListener('animation-finished', () => { 
              this.el.removeAttribute('animation-mixer');
              var clip = this.danceClips[Math.floor(Math.random()*this.danceClips.length)];
              this.el.setAttribute('animation-mixer', {
                "clip": clip.name,
                "loop": "repeat",
                "crossFadeDuration": 1,
                "timeScale": this.navAgentController.returnRandomNumber(.75, 1.25)
              });
            });
          }  else {
            console.log("no idle clips found!");
          }
         break;
       }
      } else {
        this.navAgentController = this.el.components.nav_agent_controller;
      }
     },
    playWalkAnimation: function () { //deprecated, handled by playAnimation above
      let theEl = this.el;
      let clips = this.walkClips;  //to pass below the listeners..?
      console.log("tryna walk with walkclips " + this.walkClips.length );
      if (this.walkClips.length > 0) {
      var clip = this.walkClips[Math.floor(Math.random()*this.walkClips.length)];
        theEl.setAttribute('animation-mixer', {
          // "clip": clips[danceIndex].name,
          "clip": clip.name,
          "loop": "repeat",
          "crossFadeDuration": 1
          // "repetitions": Math.floor(Math.random()*2)
          // "timeScale": .75 + Math.random()/2
        });
        
        theEl.addEventListener('animation-finished', function () { 
          theEl.removeAttribute('animation-mixer');
          var clip = clips[Math.floor(Math.random()*clips.length)];
          theEl.setAttribute('animation-mixer', {
            "clip": clip.name,
            "loop": "repeat",
            "crossFadeDuration": 1
          });
        });
      }
    },
    equippedRayHit: function (hitpoint) { //nope, just added to mod_object if it's equipped and stuff
      console.log( "equippedRayHit@!");
      if (this.data.isEquipped) {
  
        // let tG = new THREE.BufferGeometry().setFromPoints([
        //   new THREE.Vector3(),
        //   new THREE.Vector3()
        // ]);
        // let tM = new THREE.LineBasicMaterial({color: "yellow"});
        // this.beam = new THREE.Line(tG, tM);
        // this.el.sceneEl.object3D.add(this.beam);
        // this.el.sceneEl.object3D.add(this.endMesh);
            //  this.beam.updateMatrixWorld();
              // this.endMesh.position = hitpoint.clone();
              // this.el.object3D.getWorldPosition(this.startPoint);
              // // this.endPoint = hitpoint;
  
              //   this.distance = this.startPoint.distanceTo(hitpoint);
              //   this.tempVector.subVectors(hitpoint, this.startPoint).normalize().multiplyScalar(this.distance).add(this.startPoint);
              //   console.log("tryna make a beam from " + JSON.stringify(hitpoint) +" distance " + this.distance);
              //   // let d = oP.distanceTo(tP);
              
              // // tV.subVectors(tP, oP).normalize().multiplyScalar(d + 10).add(oP);
              // // this.endMesh.position.copy(this.endPoint)
              // this.beam.geometry.attributes.position.setXYZ(0, this.startPoint.x, this.startPoint.y, this.startPoint.z);
              // this.beam.geometry.attributes.position.setXYZ(1, this.tempVector.x, this.tempVector.y, this.tempVector.z).negate();
              // //  this.beam.geometry.attributes.position.setXYZ(1, hitpoint.x, hitpoint.y, hitpoint.z);
              // this.beam.geometry.attributes.position.needsUpdate = true;
       // this.el.object3D.lookAt(hitpoint);
  
  
        // this.el.object3D.getWorldPosition(this.positionMe);  //actually it's id "playCaster"
        // this.el.object3D.getWorldDirection(this.directionMe).negate();
        // this.positionMe.normalize();
        // this.positionMe.negate();
  
       // console.log("setting thirrd person raycaster! from " + JSON.stringify(this.thirdPersonPlaceholderPosition) + " to " + JSON.stringify(this.thirdPersonPlaceholderDirection));
      //  this.raycaster.set(this.positionMe, this.directionMe);
      //  this.raycaster.far = 50;
       // raycaster.far = 1.5;
      
      //  this.intersection = this.raycaster.intersectObject( this.iMesh );
  
  
      }
    },
  
    rayhit: function (hitID, distance, hitpoint) { //also called on collisionstart event
        // if (this.hitID != hitID) {
        //   this.hitID = hitID;
        // console.log("new hit " + hitID + " " + distance + " " + JSON.stringify(hitpoint));
        // distance = window.playerPosition.distanceTo(hitpoint);
        console.log("new hit " + hitID + " distance: " + distance + " " + JSON.stringify(hitpoint) + " tags " +  this.tags);
        // var triggerAudioController = document.getElementById("triggerAudio");
        if (this.triggerAudioController != null && !this.data.isEquipped && this.tags) {
          this.triggerAudioController.components.trigger_audio_control.playAudioAtPosition(hitpoint, distance, this.tags);
        }
  
        if (this.hasSynth) {
          if (this.el.components.mod_synth != null && this.data.objectData.tonejsPatch1 != undefined && this.data.objectData.tonejsPatch1 != null) {
            // this.el.components.mod_synth.trigger(distance);
            if (this.data.objectData.tonejsPatch1 == "Metal") {
              this.el.components.mod_synth.metalHitDistance(distance);
            } else if (this.data.objectData.tonejsPatch1 == "AM Synth") {
              this.el.components.mod_synth.amHitDistance(distance);
            }
            
          }
        }
  
        if (this.data.eventData && this.data.eventData.length && this.data.eventData.toLowerCase().includes("target")) {        
          if (this.particlesEl) {
            
              console.log("gotsa rayhit on id " + this.el.id + " eventdata " + this.data.eventData + " at " + JSON.stringify(hitpoint) + " tags" + this.data.tags);
              
              this.particlesEl.setAttribute("position", {"x": hitpoint.x, "y": hitpoint.y,"z": hitpoint.z});
              // this.particlesEl.object3D.position.set(hitpoint.x, hitpoint.y, hitpoint.z);
              this.particlesEl.setAttribute('sprite-particles', {
                enable: true, 
                duration: '2', 
                texture: '#explosion1', 
                color: 'black..white', 
                blending: 'additive', 
                textureFrame: '8 8', 
                textureLoop: '1', 
                spawnRate: '1', 
                lifeTime: '1', 
                opacity: '0,1,0', 
                rotation: '0..360', 
                scale: '100,500'
              });
            // this.particlesEl.setAttribute('sprite-particles', {"enable": false});
            this.particlesEl.setAttribute('sprite-particles', {"duration": .5});
            
            this.el.object3D.scale.set(0, 0, 0);
            // this.el.object3D.scale.y = 0;
            // this.el.object3D.scale.z = 0;
            this.mod_curve = this.el.components.mod_curve;
            if (this.mod_curve) {
              this.mod_curve.reset();
            }
          } else {
            this.particlesEl = document.createElement("a-entity");
            this.el.sceneEl.appendChild(this.particlesEl); //hrm...
          }
        }
    
     
    },
  
    activated: function () {
     
      console.log("this.isActivated " + this.isActivated + " + hasPickupAction " + this.hasPickupAction + " for " + this.el.id);
      if (!this.isActivated) { 
        if (this.hasSynth) {
          if (this.el.components.mod_synth != null) {
            this.el.components.mod_synth.highTrigger();
          } else {
            console.log("object has synth but it's not enabled in scene config (add use synth tag)");
          }
        }
        this.isActivated = true;
        if (this.data.objectData.objtype.toLowerCase() == "pickup"  || this.hasPickupAction) {
        
          let data = {};
          data.sceneID = settings._id;
          data.fromSceneInventory = this.data.fromSceneInventory;
          data.timestamp = this.data.timestamp;
          data.fromScene = room;
          data.object_item = this.data.objectData;
          data.userData = userData;
          data.action = this.pickupAction;
          console.log("pickupaction " + JSON.stringify(data.action));
  
          Pickup(data, this.el.id);
  
        }
      } else {
        this.dialogEl.components.mod_dialog.repeatResponse();
      }
    },
    showObject: function () {
      this.el.setAttribute('visible', true);
      this.el.classList.add('activeObjexRay');
    },
    hideObject: function () {
      console.log("tryna hide OBject");
      this.moEl.setAttribute('visible', false);
      this.moEl.classList.remove('activeObjexRay');
      if (this.el.body != null) {
      //   Ammo.destroy(this.el.body);
        this.el.removeAttribute('ammo-shape');
      }
      // this.el.removeAttribute('trail');
    },
    replaceModel: function (modelID) {
      console.log("tryna set model to " + modelID);
      this.el.removeAttribute('gltf-model');
      this.el.setAttribute('gltf-model', '#' + modelID.toString());
    },
    replaceObject: function (objectID) {
      console.log("tryna set model to " + objectID);
      let objexEl = document.getElementById('sceneObjects');    
      let objectData = objexEl.components.mod_objex.returnObjectData(objectID);
      this.el.removeAttribute('gltf-model');
      let objEl = document.createElement("a-entity");
      objEl.setAttribute("mod_object", {'locationData': this.data.locationData, 'objectData': objectData});
      objEl.id = "obj" + objectData._id + "_" + this.data.locationData.timestamp;
      sceneEl.appendChild(objEl);
      // this.el.setAttribute('gltf-model', '#' + modelID.toString());
    },
    randomLocation: function () {
      this.pos = this.moEl.getAttribute("position");
      this.newpos = {};
      this.newpos.y = this.pos.y;
      this.newpos.x = this.pos.x + getRandomIntInclusive(-10, 10);
      this.newpos.z = this.pos.z + getRandomIntInclusive(-10, 10);
      this.moEl.setAttribute('position', this.newpos);
      this.isActivated = false;
      // pos = null;
      // newpos = null;
    },
    moveOnCurve: function () {
      console.log("tryna followPath!");
  
      this.points = [];
      this.tempVectorP = new THREE.Vector3();
      this.tempVectorR = new THREE.Vector3();
  
      // this.playerEl = document.getElementById("player");
      // this.tempVectorR = new THREE.Quaternion();
      this.pVec = new THREE.Vector3();
      this.equipHolder.object3D.getWorldPosition(this.tempVectorP);
      this.equipHolder.object3D.getWorldDirection(this.tempVectorR);
      
      this.el.object3D.position.copy(this.equipHolder.object3D.position);
      this.el.object3D.quaternion.copy(this.equipHolder.object3D.quaternion);
  
      this.tempVectorR.normalize();
      this.tempVectorR.negate();
  
      for (var i = 0; i < 5; i += 1) {  
        let distance = parseInt(i) * 20;
        // this.pVec = new THREE.Vector3().copy.addVectors(this.tempVectorP, this.tempVectorR.multiplyScalar( distance ));
        console.log("pushed " + distance + " " + JSON.stringify(this.pVec));
        this.pVec = new THREE.Vector3().copy( this.tempVectorP ).addScaledVector( this.tempVectorR, distance ); //oik then
        this.points.push(this.pVec);
        // console.log("pushed " + distance + " " + JSON.stringify(this.pVec));
      //  this.points.push(new THREE.Vector3(this.tempVectorP.x, this.tempVectorP.y, this.tempVectorP.z + 1000 * (i / 4)));
      //  this.points.push(new THREE.Vector3(this.tempVectorP.x, this.tempVectorP.y, this.tempVectorP.z).normalize().multiplyScalar(i * 20));
      }
      this.curve = new THREE.CatmullRomCurve3(this.points);
        // box.position.copy( spline.getPointAt( counter ) );
          // tangent = spline.getTangentAt( counter ).normalize();
          // axis.crossVectors( up, tangent ).normalize();
          // var radians = Math.acos( up.dot( tangent ) );
          // box.quaternion.setFromAxisAngle( axis, radians );
      this.material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
      // this.material = new THREE.LineBasicMaterial( {
      //   color: 0xffffff,
      //   linewidth: 15, // in world units with size attenuation, pixels otherwise
      //   vertexColors: true,
  
      //   //resolution:  // to be set by renderer, eventually
      //   dashed: false,
      //   alphaToCoverage: true,
      // } );
      this.geometry = new THREE.BufferGeometry().setFromPoints( this.points );
      this.line = new THREE.Line( this.geometry, this.material );
      this.el.sceneEl.object3D.add( this.line );
      this.followPath = true;
    },
    applyForce: function () {
      if (this.camera == null) {
        let cameraEl = document.querySelector('a-entity[camera]');
        if (!cameraEl) {
            cameraEl = document.querySelector('a-camera');
        }
        if (!cameraEl) {
          camaraEl = document.getElementById('player');
        } 
        if (cameraEl) {
          let theCamComponent = cameraEl.components.camera;
          if (theCamComponent != null) {
            this.camera = theCamComponent.camera;
          }
          // this.camera = cameraEl.components.camera.camera;
        }
      }  
      if (this.hasShootAction) { //this isn't phsyics now
          // // this.el.setAttribute()
  
          // this.dropPos = new THREE.Vector3();
          // this.dropRot = new THREE.Quaternion();
          // this.equipHolder = document.getElementById("equipPlaceholder");
          // // this.el.setAttribute('position', this.equipHolder.getAttribute("position"));
          // this.erot = this.equipHolder.getAttribute("rotation");
  
          // this.equippedObject = this.equipHolder.querySelector('.equipped');
          //   if (this.equippedObject != null) {
          //     this.equippedObject.object3D.getWorldPosition(this.dropPos);
          //     this.equippedObject.getWorldQuaternion(this.dropRot);
          //     this.camera.getWorldDirection( this.lookVector );
          //     console.log("ttryna match world rotations with " + JSON.stringify(this.dropRot));
          //   }
  
          //   // this.cameraQuat = new THREE.Quaternion();
          //   // this.camera.getWorldQuaternion(this.cameraQuat);
          //   // this.el.object3D.lookAt(this.lookVector);
          //   this.el.object3D.position = this.dropPos;
          //   // this.el.object3D.rotation = this.dropRot;
            
          //   // this.el.object3D.rotation.set(
          //   //   THREE.MathUtils.degToRad(this.erot.x),
          //   //   THREE.MathUtils.degToRad(this.erot.y),
          //   //   THREE.MathUtils.degToRad(this.erot.z)
          //   // );
          //   // this.el.object3D.lookAt(this.lookVector);
  
          //   // this.el.object3D.matrix.setRotationFromQuaternion( -this.dropRot );
          //   // this.el.object3D.updateMatrix();
  
  
        }
      console.log("tryna apply force shoot action " + this.hasShootAction + " " + this.camera);
      this.pushForward = true;
      setTimeout(() => {
        this.pushForward = false;
      }, 100);
    },
    tick: function () {
      
      if (this.pushForward && this.camera != null) {
        // console.log("tryna apply force shoot action " + this.hasShootAction);
        // this.lookVector.applyQuaternion(this.camera.quaternion);
        if (this.hasThrowAction) {
          if (mouseDowntime != 0) {
            this.data.forceFactor = mouseDowntime;
          } else {
            this.data.forceFactor = 2;
          }
          this.camera.getWorldDirection( this.lookVector );
          // console.log("tryna pushForward@! " + this.data.forceFactor);
          // const velocity = new Ammo.btVector3(2, 1, 0);
          const velocity = new Ammo.btVector3(this.lookVector.x * 10 * this.data.forceFactor, (this.lookVector.y + .5) * 10 * this.data.forceFactor, this.lookVector.z * 10 * this.data.forceFactor);
          this.el.body.setLinearVelocity(velocity);
          //this.el.body.restitution = .9;
          Ammo.destroy(velocity);
        } else if (this.hasShootAction) {
          this.data.forceFactor = 6; 
          // this.equipHolder = document.getElementById("equipPlaceholder");
          // this.equipHolder.object3D.getWorldPosition( this.dropPos );
          this.camera.getWorldDirection( this.lookVector );
          // console.log("tryna pushForward@! " + this.data.forceFactor);
          // const velocity = new Ammo.btVector3(2, 1, 0);
          this.el.object3D.lookAt(this.lookVector);
          // this.el.object3D.rotation = this.lookVector;
          // const pos = new Ammo.btVector3(this.dropPos.x, this.dropPos.y, this.dropPos.z);
          const velocity = new Ammo.btVector3(this.lookVector.x * 10 * this.data.forceFactor, this.lookVector.y * 10 * this.data.forceFactor, this.lookVector.z * 10 * this.data.forceFactor);
          this.el.body.setLinearVelocity(velocity);
          //this.el.body.restitution = .9;
          Ammo.destroy(velocity);
  
        }
       
        } else if (this.followPath && this.curve) {
          
          this.posIndex++;
          if (this.posIndex > 100) {
            // this.curve = null;
            // this.followPath = false;
            console.log("tryna cleanup!")
            this.el.sceneEl.object3D.remove(this.line);
           
            let trailComponent = this.el.components.trail;
            if (trailComponent) {
              trailComponent.kill();
              // this.el.removeAttribute("trail");
            }
            this.followPath = false;
            // this.el.parentNode.removeChild(this.el);
            this.el.removeAttribute("trail");
            this.el.sceneEl.object3D.remove(this.line);
          } else {
          this.currentPos = this.curve.getPoint(this.posIndex / 100);
          this.currentTan = this.curve.getTangent(this.posIndex / 100).normalize();
          // this.el.object3D.getWorldDirection(this.currentRot);
          // this.el.object3D.rotation.set(this.currentRot);
          // console.log("tryna set positionn to" + JSON.stringify(this.currentPos));
          this.el.object3D.position.copy(this.currentPos);
  
          this.el.object3D.lookAt(this.curve.getPoint(99/100).negate());
  
        } 
      }
  
      if (this.data.isEquipped) {
       
        this.equipHolder.object3D.getWorldPosition(this.positionMe);  //actually it's id "playCaster"
        this.equipHolder.object3D.getWorldDirection(this.directionMe).negate();
        // if (this.lineEl) {
        //   // this.lineEl.components.mod_line.updateCurve(this.positionMe, this.directionMe);
        // }
       
     
        if (this.equippedRaycaster != null) {
  
          // if (this.isTriggered) {
          //   this.el.components.mod_line.showLine(true);
          // }
            // if (this.arrow) { //show helper arrow, TODO toggle from dialogs.js
            //   this.el.sceneEl.object3D.remove(this.arrow);
            // }
            // this.arrow = new THREE.ArrowHelper( this.directionMe, this.positionMe, 10, 0xff0000 );
            // // this.arrow = new THREE.ArrowHelper( this.equippedRaycaster.components.raycaster.direction, this.equippedRaycaster.components.raycaster.origin, 10, 0xff0000 );
            // this.el.sceneEl.object3D.add( this.arrow );
        } 
  
        // if (this.lineGeometry && this.lineObject && this.lineStart) { //for testing
        //   this.lineEnd.copy( this.positionMe ).add( this.directionMe.multiplyScalar( 50 ) );
        //   this.lineMiddle.lerpVectors(this.lineStart, this.lineEnd, 0.5); //maybe don't need...
        //   // console.log(JSON.stringify(this.lineStart), JSON.stringify(this.lineMiddle), JSON.stringify(this.lineEnd));
        //   this.lineGeometry.setFromPoints([this.positionMe, this.lineEnd]);
        //   this.lineGeometry.attributes.position.needsUpdate = true;
        // }
  
         
  
      
      }
    },
    drawRaycasterLine: function () {
  
        let material = new THREE.LineBasicMaterial({
          color: 0xff0000,
          linewidth: 10
        });
        let geometry = new THREE.Geometry();
        let startVec = new THREE.Vector3(
          raycaster.ray.origin.x,
          raycaster.ray.origin.y,
          raycaster.ray.origin.z);
    
        let endVec = new THREE.Vector3(
          raycaster.ray.direction.x,
          raycaster.ray.direction.y,
          raycaster.ray.direction.z);
        
        // could be any number
        endVec.multiplyScalar(5000);
        
        // get the point in the middle
        let midVec = new THREE.Vector3();
        midVec.lerpVectors(startVec, endVec, 0.5);
    
        geometry.vertices.push(startVec);
        geometry.vertices.push(midVec);
        geometry.vertices.push(endVec);
    
        console.log('vec start', startVec);
        console.log('vec mid', midVec);
        console.log('vec end', endVec);
    
        let line = new THREE.Line(geometry, material);
        this.el.sceneEl.objec3D.add(line);
    },
    beat: function (volume, duration) {
      console.log("tryna beat " + this.el.id + " " + volume);
      if (this.data.eventData.toLowerCase().includes("beat")) {
        let oScale = this.el.getAttribute('data-scale');
        oScale = parseFloat(oScale);
        volume = volume.toFixed(2) * .1;
        let scale = {};
          scale.x = oScale + volume;
          scale.y = oScale + volume;
          scale.z = oScale + volume;
          this.el.setAttribute('scale', scale);
          this.el.setAttribute('animation', 'property: scale; to: '+oScale+' '+oScale+' '+oScale+'; dur: '+duration+'; startEvents: beatRecover; easing: easeInOutQuad');
          this.el.emit('beatRecover');
  
      }
    }
   
  }); ///////////////////////// MOD_OBJECT END