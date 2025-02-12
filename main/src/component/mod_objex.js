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
////////////////////////////////////////////  mod_objex: spins through data and spawn objects (with more properties and perhaps Actions, unlike other elements) attached to locations with mod_object component below ////////////////////////////
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
        this.equipHolder = document.getElementById("equipPlaceholder");
        if (this.equipHolder) {
          this.equippedObject = this.equipHolder.querySelector('.equipped');
        }
       
        this.data.jsonObjectData = JSON.parse(atob(theData)); //object items with model references
        this.data.jsonLocationsData = JSON.parse(atob(theLocData)); //scene locations with object references
        // console.log("objxe datas" + JSON.stringify(this.data.jsonObjectData));
        console.log("objxe location datas" + JSON.stringify(this.data.jsonLocationsData));
        console.log(this.data.jsonLocationsData.length + "mod_object locations for " + this.data.jsonObjectData.length + " objex");
  
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
          // let equippable = "";
          for (let k = 0; k < this.data.jsonObjectData.length; k++) {
            if (this.data.jsonLocationsData[i].objectID != undefined && this.data.jsonLocationsData[i].objectID != null && this.data.jsonLocationsData[i].objectID == this.data.jsonObjectData[k]._id) {
              // console.log("location/object match " + this.data.jsonLocationsData[i].objectID);
              
              if (this.data.jsonObjectData[k].modelID != undefined && this.data.jsonObjectData[k].modelID != null) {
            
                if ((this.data.jsonLocationsData[i].eventData != undefined && this.data.jsonLocationsData[i].eventData.toLowerCase().includes("equipped")) || 
                (this.data.jsonLocationsData[i].tags && this.data.jsonLocationsData[i].tags.includes("equipped"))) { 
                 
                  // EquipDefaultItem(this.data.jsonLocationsData[i].objectID); //in dialogs.js (?)
                  console.log(this.data.jsonLocationsData[i].name + " equipped mod_objecct locationData " + JSON.stringify(this.data.jsonLocationsData[i]));
                  this.equipInventoryObject(this.data.jsonLocationsData[i].objectID, this.data.jsonLocationsData[i].locationTags, this.data.jsonLocationsData[i].eventData  );
                  
                } else {
                  if (!this.data.jsonLocationsData[i].markerType.toLowerCase().includes('spawn')) { //either spawn or spawntrigger types require interaction //now in cloudmarker, deprecate //no, still need this mode
                    console.log(this.data.jsonLocationsData[i].name + " mod_objecct locationData " + JSON.stringify(this.data.jsonLocationsData[i]));
                   
                    let objEl = document.createElement("a-entity");
                   
                      objEl.setAttribute("mod_object", {'tags': this.data.jsonLocationsData[i].tags, 
                                                        'eventData': this.data.jsonLocationsData[i].eventData, 
                                                        'locationData': this.data.jsonLocationsData[i], 
                                                        'objectData': this.data.jsonObjectData[k],
                                                        'xscale': this.data.jsonLocationsData[i].xscale,
                                                        'yscale': this.data.jsonLocationsData[i].yscale,
                                                        'zscale': this.data.jsonLocationsData[i].zscale,
                                                        'xpos': this.data.jsonLocationsData[i].x,
                                                        'ypos': this.data.jsonLocationsData[i].y,
                                                        'zpos': this.data.jsonLocationsData[i].z,
                                                        'xrot': this.data.jsonLocationsData[i].eulerx,
                                                        'yrot': this.data.jsonLocationsData[i].eulery,
                                                        'zrot': this.data.jsonLocationsData[i].eulerz,
                                                        });
                      // objEl.id = "obj" + this.data.jsonLocationsData[i].objectID + "_" + this.data.jsonLocationsData[i].timestamp;
                      objEl.id = this.data.jsonLocationsData[i].timestamp; //only timestamp so locpickers can find it...other objtypes aren't allowMods, i.e. spawned at runtime
                      if (settings && settings.useArParent) {                
                        let ar_parent = document.getElementById("ar_parent");
                        if (ar_parent) {
                          ar_parent.appendChild(objEl);
                        } else {
                          sceneEl.appendChild(objEl);
                        }
                      } else {
                        sceneEl.appendChild(objEl);
                      }
                      
                    // }
                  }
                }
              } 
            }
          }
        }
        let that = this;
      },
      // useArParent: function () {
      //   if (this.data.jsonLocationsData[i].locationTags && 
      //     ((this.data.jsonLocationsData[i].locationTags.toLowerCase().includes("ar child") || 
      //     this.data.jsonLocationsData[i].locationTags.toLowerCase().includes("archild"))) || (settings && settings.useArParent)) {                
      //      return true;
      //   } else {
      //     return false;
      //   }
      // },
      updateModdedObjects: function () {
        console.log("tryna updateModdedObjects");
        if (localData.locations.length) {
          for (let i = 0; i < localData.locations.length; i++) {
              if (localData.locations[i].markerType == "object") {
                for (let j = 0; j < this.data.jsonLocationsData.length; j++ ) {
                  // console.log(localData.locations[i].timestamp +  ' ' + this.data.jsonLocationsData[j].timestamp);
                  if (localData.locations[i].timestamp == this.data.jsonLocationsData[j].timestamp) {
                    // console.log("gotsa objectID match with localdata! " );
                    if (localData.locations[i].objectID != this.data.jsonLocationsData[j].objectID) {
                      let objEl = document.getElementById(this.data.jsonLocationsData[j].timestamp);
                        if (objEl) {
                          console.log("gotsa objectID match with localdata! ");
                          objEl.removeAttribute("transform_controls");
                          objEl.removeAttribute("geometry");
                          objEl.removeAttribute("gltf-model");
                          objEl.removeAttribute("mod_object");

                          objEl.removeAttribute("ammo-body");
                          objEl.removeAttribute("ammo-shape");
                          objEl.removeAttribute("mod_physics");
                          objEl.removeAttribute("mod_particles");
                          objEl.removeAttribute("light");
                          objEl.setAttribute("mod_object", {'eventData': localData.locations[i].eventData, 'locationData': localData.locations[i], 'objectData': this.returnObjectData(localData.locations[i].objectID)});
                        }
                      }
                  }
                }
            }
          }
        } 
      },
      checkForLocalObjectMods: function (timestamp) { //to do return modded object if needed //nah, just mod them if needed w/updateModdedObjects above
        if (localData.locations.length) {
          for (let i = 0; i < localData.locations.length; i++) {
            console.log("checking for none objectID vs " + localData.locations[i]);
            if (localData.locations[i].timestamp == timestamp) {
              console.log("cmatchs objectID " + localData.locations[i].objectID);
              if (localData.locations[i].objectID != "none") {
                return true;
              } else {
                return false;
              }
            }
          }
        } else {
          return true;
        }
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
        console.log("need to fetch inventory: " + oIDs);
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
            let elIDString = "obj" + this.data.jsonLocationsData[j].objectID + "_" + this.data.jsonLocationsData[j].timestamp; //um..
            let elID = document.getElementById(elIDString);
            if (!elID) { //only one for now... TODO count maxperscene?  check inventory?
              let locationData  = {};
              locationData.x = this.data.jsonLocationsData[j].x;
              locationData.y = this.data.jsonLocationsData[j].y;
              locationData.z = this.data.jsonLocationsData[j].z;
              this.objectData =  this.returnObjectData(this.data.jsonLocationsData[j].objectID);
              console.log("gotsa object to spawn " + JSON.stringify(this.data.jsonLocationsData[j].locationTags));
              let objEl = document.createElement("a-entity");
              objEl.setAttribute("mod_object", {'eventData': null, 'locationData': locationData, 'objectData': this.objectData, 'timestamp': this.data.jsonLocationsData[j].timestamp, 'tags': this.data.jsonLocationsData[j].locationTags, 'isSpawned': true});
              objEl.id = elIDString;
              if (settings && settings.useArParent) {                
                let ar_parent = document.getElementById("ar_parent");
                if (ar_parent) {
                  ar_parent.appendChild(objEl);
                } else {
                  sceneEl.appendChild(objEl);
                }
              } else {
                sceneEl.appendChild(objEl);
              }

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
      spawnObjectID: function (objectID) { //uses name (label) property of location to reference the object to spawn, called from a spawntrigger, using that location's eventData which should have the name... hrm.
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
              objEl.setAttribute("mod_object", {'eventData': null, 'locationData': locationData, 'objectData': this.objectData, 'timestamp': this.data.jsonLocationsData[j].timestamp, 'tags': this.data.jsonLocationsData[j].locationTags, 'isSpawned': true});
              objEl.id = elIDString;
              if (settings && settings.useArParent) {                
                let ar_parent = document.getElementById("ar_parent");
                if (ar_parent) {
                  ar_parent.appendChild(objEl);
                } else {
                  sceneEl.appendChild(objEl);
                }
              } else {
                sceneEl.appendChild(objEl);
              }
              // sceneEl.appendChild(objEl);
              
              
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
                objEl.setAttribute("mod_object", {'eventData': null, 'locationData': locationData, 'objectData': this.data.jsonObjectData[j], 'inventoryData': this.sceneInventoryItems[i], 'fromSceneInventory': true, 'timestamp': timestamp, 'isSpawned': false});
                // objEl.setAttribute("mod_object", {'locationData': locationData, 'objectData': this.data.jsonObjectData[j], 'inventoryData': this.sceneInventoryItems[i], 'timestamp': timestamp});
                objEl.id = "obj" + this.data.jsonObjectData[j]._id + "_" + timestamp;

                if (settings && settings.useArParent) {                
                  let ar_parent = document.getElementById("ar_parent");
                  if (ar_parent) {
                    ar_parent.appendChild(objEl);
                  } else {
                    sceneEl.appendChild(objEl);
                  }
                } else {
                  sceneEl.appendChild(objEl);
                }

                // sceneEl.appendChild(objEl);
                } else {
                  console.log("well shoot, that one don't have a location " + JSON.stringify(this.sceneInventoryItems[i]));
                }
              }
            }
          }
        }
      },
      returnObjectExists: function(objectID) {
        let resp =  false;
        for (let i = 0; i < this.data.jsonObjectData.length; i++) {
          if (objectID == this.data.jsonObjectData[i]._id) {
            resp = true;
          }
        }
        return resp;
      },
      returnObjectData: function(objectID) {
        // console.log('tryna return object data for ' +objectID);
        // let hasObj = false;
        let objek = null;
        if (this.data.jsonObjectData.length > 0) {
          for (let i = 0; i < this.data.jsonObjectData.length; i++) {
            // console.log('tryna match object data for ' +objectID + " vs " + this.data.jsonObjectData[i]._id);
            if (this.data.jsonObjectData[i]._id == objectID) {
              console.log('gotsa objectID match to return data ' + objectID);
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
      
      // scatterObject: function (objectID) { //um, nope
      //   console.log("tryna scatter mod_object " + objectID);  
      //   this.objectData = this.returnObjectData(objectID);
      //   this.scatterPos = new THREE.Vector3();
      //   this.objEl = document.createElement("a-entity");
      //   // this.equipHolder = document.getElementById("equipPlaceholder");
      //   // this.equipHolder.object3D.getWorldPosition( this.dropPos );
      //   this.locData = {};
      //   this.locData.x = this.scatterPos.x;
      //   this.locData.y = this.scatterPos.y;
      //   this.locData.z = this.scatterPos.z;
      //   this.locData.timestamp = Date.now();
      //   this.objEl.setAttribute("mod_object", {'eventData': null, 'locationData': this.locData, 'objectData': this.objectData, 'isSpawned': true});
      //   this.objEl.id = "obj" + this.objectData._id + "_" + this.locData.timestamp;
      //   sceneEl.appendChild(this.objEl);
             
      // },
      
      // dropObject: function (objectID, location) { //not from inventory, e.g. switching equips //nm already has!
      //   console.log("tryna scatter mod_object " + objectID);  
      //   this.objectData = this.returnObjectData(objectID);
      //   this.scatterPos = new THREE.Vector3();
      //   this.objEl = document.createElement("a-entity");
      //   // this.equipHolder = document.getElementById("equipPlaceholder");
      //   // this.equipHolder.object3D.getWorldPosition( this.dropPos );
      //   this.locData = {};
      //   this.locData.x = this.location.x;
      //   this.locData.y = this.location.y;
      //   this.locData.z = this.scatterPos.z;
      //   this.locData.timestamp = Date.now();
      //   this.objEl.setAttribute("mod_object", {'eventData': null, 'locationData': this.locData, 'objectData': this.objectData, 'isSpawned': true});
      //   this.objEl.id = "obj" + this.objectData._id + "_" + this.locData.timestamp;
      //   sceneEl.appendChild(this.objEl);
             
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
      equipInventoryObject: function (objectID, tags, eventData) {
        console.log("tryna equip  " + objectID  + " equipped " + this.data.equipped + " tags " + tags + " eventData " + eventData);  
        this.objectData = this.returnObjectData(objectID);
        // console.log("tryna equip model " + JSON.stringify(this.objectData));  
        // console.log("tryna equip object " + this.el.id);
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
        this.locData.locationTags = tags;
        this.locData.eventData = eventData;
        this.locData.markerObjScale = (this.objectData.objScale != undefined && this.objectData.objScale != "") ? this.objectData.objScale : 1; //these come from objectData, not locData
        this.locData.eulerx = (this.objectData.eulerx != undefined && this.objectData.eulerx != "") ? this.objectData.eulerx : 0;
        this.locData.eulery = (this.objectData.eulery != undefined && this.objectData.eulery != "") ? this.objectData.eulery : 0;
        this.locData.eulerz = (this.objectData.eulerz != undefined && this.objectData.eulerz != "") ? this.objectData.eulerz : 0;
        this.locData.timestamp = Date.now();
        this.objEl.setAttribute("mod_object", {'eventData': null, 'locationData': this.locData, 'objectData': this.objectData, 'isEquipped': true, 'isSpawned': true});
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
        // this.objEl.id = "obj" + this.objectData._id + "_" + this.locData.timestamp;
        this.objEl.id = this.locData.timestamp;
        sceneEl.appendChild(this.objEl);
        // this.objEl.components.mod_object.applyForce();
  
        // this.el.setAttribute('gltf-model', '#' + modelID.toString());
      },
      dropObject: function (objectID) {
        console.log("tryna dropObject " + objectID);  
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
        this.objEl.setAttribute("mod_object", {'eventData': null, 'locationData': this.locData, 'objectData': this.objectData, 'isSpawned': true});
        this.objEl.id = "obj" + this.objectData._id + "_" + this.locData.timestamp;
        if (settings && settings.useArParent) {                
          let ar_parent = document.getElementById("ar_parent");
          if (ar_parent) {
            ar_parent.appendChild(this.objEl);
          } else {
            sceneEl.appendChild(this.objEl);
          }
        } else {
          sceneEl.appendChild(this.objEl);
        }
        // sceneEl.appendChild(this.objEl);
        // this.objEl.components.mod_object.applyForce();
  
        // this.el.setAttribute('gltf-model', '#' + modelID.toString());
      },
      shootObject: function (objectID) {
        let downtime = 6000;
        this.objectData = this.returnObjectData(objectID);
        this.dropPos = new THREE.Vector3();
        this.dropRot = new THREE.Quaternion();
        this.objEl = document.createElement("a-entity");

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
          this.objEl.setAttribute("mod_object", {'eventData': null, 'locationData': this.locData, 'objectData': this.objectData, 'followPathNewObject': true, 'forceFactor': downtime, 'removeAfter': "5", 'isSpawned': true});
          this.objEl.id = "obj" + this.objectData._id + "_" + this.locData.timestamp;
          // sceneEl.append(this.objEl);
          if (settings && settings.useArParent) {                
            let ar_parent = document.getElementById("ar_parent");
            if (ar_parent) {
              ar_parent.appendChild(this.objEl);
            } else {
              sceneEl.appendChild(this.objEl);
            }
          } else {
            sceneEl.appendChild(this.objEl);
          }
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
        this.objEl.setAttribute("mod_object", {'eventData': null, 'locationData': this.locData, 'objectData': this.objectData, 'applyForceToNewObject': true, 'forceFactor': downtime, 'removeAfter': "5", 'isSpawned': true});
        this.objEl.id = "obj" + this.objectData._id + "_" + this.locData.timestamp;
  
        // sceneEl.appendChild(this.objEl);
        if (settings && settings.useArParent) {                
          let ar_parent = document.getElementById("ar_parent");
          if (ar_parent) {
            ar_parent.appendChild(this.objEl);
          } else {
            sceneEl.appendChild(this.objEl);
          }
        } else {
          sceneEl.appendChild(this.objEl);
        }
        // this.el.setAttribute('gltf-model', '#' + modelID.toString());
      }
  });
  
  function FetchSceneInventoryObject(oID) { //add a single scene inventory object, e.g. child object spawn that isn't in initial collection, but don't init everything
    let objexEl = document.getElementById('sceneObjects');   

    if (objexEl && !objexEl.components.mod_objex.returnObjectExists(oID)) {
 
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
    } else {
      console.log("already have that object...");
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
      isEquippable: {default: false},
      isSpawned: {default: false},
      fromSceneInventory: {default: false},
      timestamp: {default: ''},
      applyForceToNewObject: {default: false},
      followPathNewObject: {default: false},
      forceFactor: {default: 1},
      removeAfter: {default: ''},
      actionCount: {default: 0}, //how many times has action run, e.g. spawned / added obj
      // tags: {default: ''},
      xpos: {type: 'number', default: 0}, //used for modding
      ypos: {type: 'number', default: 0},
      zpos: {type: 'number', default: 0},

      xrot: {type: 'number', default: 0},//in degrees, trans to radians below
      yrot: {type: 'number', default: 0},
      zrot: {type: 'number', default: 0},

      xscale: {type: 'number', default: 1}, //like the others...
      yscale: {type: 'number', default: 1},
      zscale: {type: 'number', default: 1},
      damage: {type: 'number', default: 0},
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
      this.killAction = null;
      this.findAction = null;
      this.synth = null;
      this.hasSynth = false;
      this.mod_physics = "";
      this.pushForward = false;
      this.followPath = false;
      this.targetLocations = [];
      this.currentDamage = 0; //in objectData.hitpoints
      
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
      this.isDead = false;
  
  
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
  
      this.lastCollidedWithID = ""; 
      this.objexEl = document.getElementById('sceneObjects'); 
      this.triggerAudioController = document.getElementById("triggerAudio");
      this.triggerOn = false;
      this.driveable = false;
      this.modelParent = null;
  
      this.camera = null;
      this.tags = [];
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
      // this.data.isEquippable = false;
      this.objectAudioController = null;
      this.hasBoneLook = false;
      this.lookBone = null;
      this.coolDown = false;
      this.oScale = new THREE.Vector3();
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
      
      if (this.data.eventData.includes("scatter")) {
        this.scatterMe();
        return;
      }


      this.el.classList.add("allowMods");
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
            rot.y = this.data.locationData.eulery != undefined ? this.data.locationData.eulery : 0; //TODO raycast and use normal for rotation, or lock y
            rot.z = this.data.locationData.eulerz != undefined ? this.data.locationData.eulerz : 0;
            this.thirdPersonPlaceholder.setAttribute("rotation", rot);
          } else {
            // thirdPersonPlaceholder.append(this.el);
            this.thirdPersonPlaceholder.setAttribute("gltf-model", "#" +this.data.objectData.modelID); 
            let rot = {};
            rot.x = this.data.locationData.eulerx != undefined ? this.data.locationData.eulerx : 0;
            rot.y = this.data.locationData.eulery != undefined ? this.data.locationData.eulery : 0; //""
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
  
        
      // if (this.tags == null && this.tags != "" && this.tags.length > 0) {
        console.log(this.data.objectData.name + "this.data.locationData: " + JSON.stringify(this.data.locationData) + " objectData: " + JSON.stringify(this.data.objectData));
        // this.tags = [];  
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

          // for (let i = 0; i < this.tags.length; i++) {  //nm, bad idea?
          //   console.log("adding class with tag " + this.tags[i]);
          //   if (this.tags[i].includes(" ")) {
          //     console.log("cain't put space in classname : " + this.tags[i]);
          //   } else {
          //     this.el.classList.add(this.tags[i]);
          //   }
            
          // }
        // }
      // } else {
      //   console.log("this.data.tags is not null " + this.tags);
      //   // if (this.tags.toLowerCase().includes("equippable")) {
      //   //   this.data.isEquippable = true;
      //   // } else if (this.tags.toLowerCase().includes("equipped")) {
      //   //   this.data.isEquipped = true;
      //   // } 
      // }
      if (this.data.objectData.tags) {
        if (this.data.objectData.tags.includes("equippable")) {
          this.data.isEquippable = true;
        }
      }

      if (this.data.locationData && this.data.locationData.locationTags != undefined  && this.data.locationData.locationTags != 'undefined' && this.data.locationData.locationTags.length > 0) {
          if (this.data.locationData.locationTags.toLowerCase().includes("equippable")) {
            this.data.isEquippable = true;
          } else if (this.data.locationData.locationTags.toLowerCase().includes("equipped")) {
            this.data.isEquipped = true;
          } 
          if ( this.data.locationData.locationTags.toLowerCase().includes("hide")) { 
              this.el.setAttribute("visible", false);
              this.el.classList.remove("activeObjexRay");
              this.el.dataset.isvisible = false;
              console.log("mod_object tryna hide myself set to visible " + this.el.dataset.isvisible);
          }
          if ( this.data.locationData.locationTags.toLowerCase().includes("ar child") || this.data.locationData.locationTags.toLowerCase().includes("ar_child") || this.data.locationData.locationTags.toLowerCase().includes("archild")) { 
            this.el.classList.add("arChild");
          }
          if ( this.data.locationData.locationTags.toLowerCase().includes("spawnable")) { 
            this.el.classList.add("spawnable");
          }
      } 
      if (this.data.tags && this.data.tags != undefined  && this.data.tags != 'undefined' && this.data.tags.length > 0) {
        if (this.data.tags.toLowerCase().includes("equippable")) {
          this.data.isEquippable = true;
        } else if (this.data.tags.toLowerCase().includes("equipped")) {
          this.data.isEquipped = true;
        } 
        if (this.data.tags && this.data.tags.includes("follow curve")) {
          this.el.setAttribute("mod_curve", {"origin": "location", "isClosed": true, "spreadFactor": 2})
        }
      } 
      if ((this.data.eventData && this.data.eventData.length && this.data.eventData.toLowerCase().includes("anchored")) || 
        this.data.tags && this.data.tags.length && this.data.tags.toLowerCase().includes("anchored")) {
        this.el.setAttribute("anchored");
      }   
      if ((this.data.eventData && this.data.eventData.length && this.data.eventData.toLowerCase().includes("target")) || 
        this.data.tags && this.data.tags.length && this.data.tags.toLowerCase().includes("target")) {
        this.isTarget = true;
        this.el.classList.add("target");
      }
    
      if (this.data.objectData.triggerScale == undefined || this.data.objectData.triggerScale == null || this.data.objectData.triggerScale == "" || this.data.objectData.triggerScale == 0) {
        this.data.objectData.triggerScale = 1;
      } 


       
      if (this.data.objectData.physics === "Navmesh Agent" || this.data.eventData.toLowerCase().includes("agent")) { 
        this.isNavAgent = true;
        this.navAgentController = this.el.components.nav_agent_controller;
  
      } 

      // this.el.sceneEl.addEventListener('youtubeToggle', function (event) { //things to trigger on this model if youtube is playing
      //   console.log("GOTSA YOUTUBNE EVENT: " + event.detail.isPlaying);  
      //   if (event.detail.isPlaying) {
      //     // this.el.components.nav_agent_controller.updateAgentState("dance");
      //   } 
      // });

      this.hasPickupAction = false;
      this.hasTriggerAction = false;
      this.hasThrowAction = false;
      this.hasShootAction = false;
  
      // if ((this.tags != null && !this.tags.includes("thoughtbubble")) && !this.tags.includes("hide callout")) { //TODO implement Callout Options!
      
      // if (!this.tags.includes("hide callout")) { //TODO implement Callout Options!
          // if (this.data.objectData.callouttext != undefined && this.data.objectData.callouttext != null && this.data.objectData.callouttext.length > 0) {
          //   this.hasCallout = true;
          // }
        if (this.data.objectData.callouttext && this.data.objectData.callouttext.includes('~')) {
          this.calloutLabelSplit = this.data.objectData.callouttext.split('~'); 
          this.textData = this.calloutLabelSplit;
        } else {
          this.textData = this.data.objectData.callouttext;
        }
          // console.log(this.data.objectData.name + "callouttext " + this.data.objectData.callouttext );
          // this.calloutEntity = document.createElement("a-entity");
        
          // this.calloutText = document.createElement("a-entity");
          //         // this.calloutEntity.appendChild(this.calloutPanel);
          // this.calloutEntity.appendChild(this.calloutText);
          // this.calloutEntity.id = "objCalloutEntity_" + this.el._id;
        
          // this.calloutText.id = "objCalloutText_" + this.el._id;
            
          // // TODO flex with sceneTextBackground
          // // this.calloutPanel.id = "objCalloutPanel_" + this.data.objectData._id;
          // // this.calloutPanel = document.createElement("a-entity"); 
          // // this.calloutPanel.setAttribute("gltf-model", "#landscape_panel");
          // // this.calloutPanel.setAttribute("scale", ".125 .1 .125");
          // // this.calloutPanel.setAttribute("material", {'color': 'black', 'roughness': 1});
          // // this.calloutPanel.setAttribute("overlay");
          // // this.calloutEntity.setAttribute("look-at", "#player");
          // if (settings && settings.sceneCameraMode == "Third Person") {
          //   this.calloutEntity.setAttribute("look-at", "#thirdPersonCamera");
          // } else {
          //   this.calloutEntity.setAttribute("look-at", "#player");
          // }
          
          // this.calloutEntity.setAttribute('visible', false);
        
          // // calloutEntity.setAttribute("render-order", "hud");
          // // if (this.isNavAgent || this.data.markerType == "Character") {
          //   this.el.appendChild(this.calloutEntity);
          //   let y = this.data.objectData.yPosFudge + 1;
          //   this.calloutEntity.setAttribute("position", "0 "+y+" .75");
          // // } 
          // // else {
          // //   this.el.sceneEl.appendChild(this.calloutEntity);
          // // }
  
  
          // let font = "Acme.woff"; 
          // if (settings && settings.sceneFontWeb2 && settings.sceneFontWeb2.length) {
          //   font = settings.sceneFontWeb2;
          // }
          // // this.calloutPanel.setAttribute("position", '0 0 1'); 
          // if (!this.isNavAgent) {
          //   this.calloutText.setAttribute("position", '0 0 1.25'); //offset the child on z toward camera, to prevent overlap on model
          // }
          // this.calloutText.setAttribute('troika-text', {
          //   fontSize: .1,
          //   baseline: "bottom",
          //   align: "left",
          //   font: "/fonts/web/" + font,
          //   anchor: "center",
          //   color: "white",
          //   outlineColor: "black",
          //   outlineWidth: "2%",
          //   value: ""
          // });
          // this.calloutText.setAttribute("overlay");
        // } 
      // }
      // if (this.data.objectData.synthNotes != undefined && this.data.objectData.synthNotes != null && this.data.objectData.synthNotes.length > 0) {
      if (this.data.objectData.tonejsPatch1 != undefined && this.data.objectData.tonejsPatch1 != null) {  
        this.el.setAttribute("mod_synth", "init");
        this.hasSynth = true;
  
      }
     
      if (JSON.stringify(this.data.eventData).includes("beat")) {
        console.log ("adding class beatmee");
        this.el.classList.add("beatme");
        // this.el.addEventListener('beatme', e => console.log("beat" + e.detail.volume()));
      } else if (this.tags.includes("beat")) {
        this.el.classList.add("beatme");
      }
      
      if (this.data.objectData.actions != undefined && this.data.objectData.actions.length > 0) {
      
        for (let a = 0; a < this.data.objectData.actions.length; a++) {
          if (this.data.objectData.actions[a].objectID && this.data.objectData.actions[a].objectID.length > 8 ) {
            FetchSceneInventoryObject(this.data.objectData.actions[a].objectID);
          }
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
          if (this.data.objectData.actions[a].actionType.toLowerCase() == "kill") { 
            this.hasKillAction = true;
            this.killAction = this.data.objectData.actions[a];
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
        this.triggerAudioController = document.getElementById("triggerAudio");
        console.log("triggerAudio loop "+ this.tags);
        if (this.triggerAudioController != null) {
            this.triggerAudioController.components.trigger_audio_control.loopAndFollow(this.el.id, this.tags, false); //don't autoplay if hastriggeraction
            // this.triggerAudioController.components.trigger_audio_control.loopToggle(true);
        } 
        window.addEventListener('mousedown', (e) => {
          if (!showDialogPanel) {
            e.preventDefault();
            //if mod_line
            let modLine = this.el.components.mod_line;
            if (modLine) {
              modLine.toggleShowLine(true);
              this.triggerAudioController = document.getElementById("triggerAudio");
              console.log("equipped triggerAudio "+ this.tags);
              if (this.triggerAudioController != null) {
                if (!this.triggerAudioController.components.trigger_audio_control.hasLoopHowl()) {
                  this.triggerAudioController.components.trigger_audio_control.loopAndFollow(this.el.id, this.tags, false); //don't autoplay if hastriggeraction
                }
                this.triggerAudioController.components.trigger_audio_control.loopToggle(true);
                  
              } 
            }
            window.isFiring = true;
          }
        });
        window.addEventListener('mouseup', (e) => {
          if (!showDialogPanel) {
            e.preventDefault();
            let modLine = this.el.components.mod_line;
            if (modLine) {
              modLine.toggleShowLine(false);
              this.triggerAudioController = document.getElementById("triggerAudio");
              console.log("equipped triggerAudio "+ this.tags);
              if (this.triggerAudioController != null) {
                this.triggerAudioController.components.trigger_audio_control.loopToggle(false);
                  
              } 
            }
            window.isFiring = false;
          }
        }); 
        
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
    if (this.data.tags && this.data.tags.includes("loop")){
      console.log("tryna audio trigger mod_object loop");
        setTimeout(() => { //to make sure audio group data is loaded   

            var triggerAudioController = document.getElementById("triggerAudio");
            if (triggerAudioController != null) {
                triggerAudioController.components.trigger_audio_control.loopAndFollow(this.el.id, this.tags, !this.hasTriggerAction); //don't autoplay if hastriggeraction
            }   
            }, 3000);
        }
    if (this.data.objectData.audiogroupID && this.data.objectData.audiogroupID.length > 4) { //it's an objectID
        console.log("tryna set object_audio_controller id " + this.data.objectData.audiogroupID);
        this.objectAudioController = this.el.setAttribute("object_audio_controller", {_id: this.data.objectData.audiogroupID});
    }
        
      let that = this;
  
  
      this.el.addEventListener('model-loaded', () => {


        
  
        console.log(this.data.objectData.name + " mod_object model-loaded pos: "+ JSON.stringify(this.data.locationData));

        this.data.xscale = this.data.locationData.xscale != null ? this.data.locationData.xscale : 1;
        this.data.yscale = this.data.locationData.yscale != null ? this.data.locationData.yscale : 1;
        this.data.zscale = this.data.locationData.zscale != null ? this.data.locationData.zscale : 1;
        let pos = {};
        pos.x = this.data.locationData.x;
        pos.y = this.data.locationData.y;          
        pos.z = this.data.locationData.z;
        let rot = {};
        rot.x = this.data.locationData.eulerx != undefined ? this.data.locationData.eulerx : 0;
        rot.y = this.data.locationData.eulery != undefined ? this.data.locationData.eulery : 0;
        rot.z = this.data.locationData.eulerz != undefined ? this.data.locationData.eulerz : 0;
        let scale = {x: this.data.xscale, y: this.data.yscale, z: this.data.zscale};
        // if (this.data.locationData.markerObjScale != undefined && this.data.locationData.markerObjScale != null && this.data.locationData.markerObjScale != "" && this.data.locationData.markerObjScale != 0) {
        // scale.x = this.data.locationData.markerObjScale != undefined ? this.data.locationData.markerObjScale : 1;
        // scale.y = this.data.locationData.markerObjScale != undefined ? this.data.locationData.markerObjScale : 1;
        // scale.z = this.data.locationData.markerObjScale != undefined ? this.data.locationData.markerObjScale : 1;
        // if (this.data.objectData.objScale != undefined && this.data.objectData.objScale != null && this.data.objectData.objScale != "" && this.data.objectData.objScale != 0 ) {
        //   scale.x = this.data.objectData.objScale;
        //   scale.y = this.data.objectData.objScale;
        //   scale.z = this.data.objectData.objScale;
        // } else {
        //   this.data.objectData.objScale = 1;
        // }
   
        if (!this.data.isEquipped) {
          console.log(this.data.objectData.name + " setting object pos to " + JSON.stringify(pos) + " hasShootAction " + this.hasShootAction + " equippable " + this.data.isEquippable);
          if (this.modelParent != null) {
            console.log(this.data.objectData.name + " not equipped, has modelparent ");
            this.modelParent.setAttribute("position", pos);
            this.modelParent.setAttribute("rotation", rot);
          } else {
              console.log(this.data.objectData.name + " not equipped, no modelparent mod_object scale " + JSON.stringify(scale));
              this.el.setAttribute("scale", scale);
              // this.el.object3D.position = pos;
              // this.el.object3D.rotation = rot;
            if (!this.hasShootAction) {
              this.el.setAttribute("position", pos);
            } else {
              if (this.data.isEquippable) {
                this.el.setAttribute("position", pos);
              }
            }
            
            // that.el.setAttribute("rotation", rot);
            this.el.object3D.rotation.set(
              THREE.MathUtils.degToRad(rot.x),
              THREE.MathUtils.degToRad(rot.y),
              THREE.MathUtils.degToRad(rot.z)
            );
          }
          // console.log("OBJTYPE IS : " +this.data.objectData.objtype);
          if (this.data.objectData.objtype.toLowerCase() === "character") { 
            // const vector = new THREE.Vector3();
            
            let skinnedMeshColliderEl = document.createElement("a-sphere"); // can't got the boundingbox to work...
            let cscale = ".5 1 .5";
            if (this.data.objectData.colliderScale && this.data.objectData.colliderScale != "") {
              cscale = this.data.objectData.colliderScale * .5 + " " + this.data.objectData.colliderScale + " " + this.data.objectData.colliderScale * .5;
            }
            
            skinnedMeshColliderEl.setAttribute("scale", cscale); //todo pass in scale
            // skinnedMeshColliderEl.setObject3D(sphere);
            if (settings && settings.debugMode) {
              skinnedMeshColliderEl.setAttribute("material", {"color": "purple", "transparent": true, "opacity": 0.1});
            } else {
              skinnedMeshColliderEl.setAttribute('visible', false);
              // skinnedMeshColliderEl.setAttribute("material", {"transparent": true, "opacity": 0});
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
            this.el.setAttribute("mod_line", {"init": true, "tags": this.data.tags});
          }
  

          if (this.hasTriggerAction) {
            this.triggerAudioController = document.getElementById("triggerAudio");
            console.log("triggerAudio loop "+ this.tags);
          if (this.triggerAudioController != null) {
              this.triggerAudioController.components.trigger_audio_control.loopAndFollow(this.el.id, this.tags, false); //don't autoplay if hastriggeraction
          } 
          }
          if (this.hasShootAction || this.hasThrowAction) {
            this.el.classList.add("activeObjexRay");
          }
      
  
        }
        if (this.data.followPathNewObject) {
          this.moveOnCurve(); //todo fix quats!
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

          this.bubble = null;
          this.bubbleText = null;
          this.bubbleBackground = null;
          this.isInitialized = true;
          this.meshChildren = [];
          this.specialBones = [];
          let theEl = this.el;
          const obj = this.el.getObject3D('mesh');
          
          if (obj) {
            if (this.data.shader != "") {
              console.log("gotsa shader " + this.data.shader);
             
              // this.recursivelySetChildrenShader(obj);
  
            }

  
            if (this.data.eventData.toLowerCase().includes("target") || (this.data.tags && this.data.tags.includes("target"))) {
              // this.el.id = "target_object";
              this.el.classList.add("target");
            
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
            if (this.data.eventData.toLowerCase().includes("glow")) {

              this.el.setAttribute("glow");
            }
            if (this.data.markerType.toLowerCase().includes("character") || this.data.eventData.toLowerCase().includes("agent") || 
              (this.data.objectData.physics && this.data.objectData.physics.includes("Navmesh Agent"))) { 
              if (settings.useNavmesh || settings.useSimpleNavmesh) {
                // this.el.setAttribute("nav-agent", "");
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
                hasAnims = true
                // console.log("mod_object " + this.data.objectData.name + " has animation: " + clips[i].name);
                
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
                if (clips[i].name.toLowerCase().includes("default")) {
                  idleIndex = i;
                  this.idleClips.push(clips[i]);
                }
                if (clips[i].name.toLowerCase().includes("armatureaction")) {
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
                    } else if (this.data.eventData.includes("loop_dance_anims")) {
                      theEl.setAttribute('animation-mixer', {
                        "loop": "repeat",
                      });
                    } else {
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
  
            }
            obj.traverse(node => { //spin through object heirarchy to sniff for special names, e.g. "eye"
              this.nodeName = node.name;
              node.frustumCulled = false; //just turn off for everything, objects are special...
              // console.log("object node: " + this.nodeName)
              if (this.data.eventData.includes("eyelook") && this.nodeName.toLowerCase().includes("eye")) { //must be set in eventData and as mesh name
                if (node instanceof THREE.Mesh) {
                this.meshChildren.push(node);
                console.log("gotsa eye!");
                }
                if (node instanceof THREE.Bone) {
                  this.specialBones.push (node);
                  console.log("gotdsa eyebone");
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
            for (let b = 0; b < this.specialBones.length; b++) {
            
              if (this.specialBones[b].name.toLowerCase().includes("eye")) {
                this.hasBoneLook = true;
                this.lookBone = this.specialBones[b];
                // OOI.sphere.getWorldPosition( v0 );
                // OOI.head.lookAt( v0 );
                this.lookBone.lookAt(window.playerPosition);
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
            if (this.data.objectData.callouttext != undefined && this.data.objectData.callouttext != null && this.data.objectData.callouttext.length > 0) {
              this.hasCallout = true;
            }
            
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
              // if (eventData.includes("agent")) {
                this.el.appendChild(bubble); //make it a child if
              // } else {
              //   sceneEl.appendChild(bubble); //or else put at top
              // }
             
              
              let bubbleBackground = document.createElement("a-entity");
              bubbleBackground.classList.add("bubbleBackground");
              bubbleBackground.setAttribute("gltf-model", "#thoughtbubble"); //just switch this for other callout types (speech and plain callout)
              bubbleBackground.setAttribute("position", "0 0 1");
              bubbleBackground.setAttribute("rotation", "0 0 0"); 
              bubbleBackground.setAttribute("scale", "-.1 .1 .1"); 
              // bubble.setAttribute("material", {"color": "white", "blending": "additive", "transparent": false, "alphaTest": .5});
              bubbleBackground.setAttribute("material", {"color": "white", "shader": "flat"}); //doh, doesn't work for gltfs... 
              bubble.appendChild(bubbleBackground);
              this.bubbleBackground = bubbleBackground;
  
              
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
              
              this.el.addEventListener('click', function () { //um, this makes 2!  bad... move all this to other click event!
  
                this.bubble = sceneEl.querySelector('.bubble');
                if (this.bubble) {
                  this.bubble.setAttribute('visible', false);
                }
                calloutOn = false;
               
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
            if (this.data.objectData.physics != undefined && this.data.objectData.physics != null && this.data.objectData.physics.toLowerCase() != "none" && !this.data.fromSceneInventory) {
              console.log("tryna add physics to new mod_object " + this.data.objectData.name + " is equipped " + this.data.isEquipped + " body " +
                                        this.data.objectData.physics + " hasShoot " + this.hasShootAction + " hasThrow " + this.hasThrowAction + " isSpawned " + this.data.isSpawned);
              //  setTimeout(function(){  
                if (this.data.isEquipped) {
                  this.el.setAttribute('obb-collider', {'size': '.25 .25 .25'});
                  // this.el.setAttribute('ammo-body', {type: 'kinematic', linearDamping: .1, angularDamping: .1});
                } else { //nm, switch to dynamic when fired if needed/
                  if (this.hasShootAction) {
                    if (this.data.isSpawned) { //if not part of scene init, no need to wait
                      // this.el.setAttribute('ammo-body', {type: 'kinematic', emitCollisionEvents: true});
                      this.el.setAttribute('trail', "");
                      this.el.setAttribute('obb-collider', {'size': '.25 .25 .25'});
                    } else {
                      // this.el.setAttribute('ammo-body', {type: this.data.objectData.physics.toLowerCase(), gravity: '0 -.1 0', angularFactor: '1 0 1', emitCollisionEvents: true, linearDamping: .1, angularDamping: 1}); //nope, shoot is not physical now
                      setTimeout( () => { //wait a bit for static colliders to load...
                        
                        this.el.setAttribute('ammo-body', {type: 'kinematic', emitCollisionEvents: true});
                        
                      }, 5000);
                    }
                  } else if (this.hasThrowAction) {
                    console.log("spawned object hasThrowAction!");
                    if (this.data.isSpawned) {
                      this.el.setAttribute('ammo-body', { type: this.data.objectData.physics.toLowerCase(), emitCollisionEvents: true, linearDamping: .1, angularDamping: .1 });
                      this.el.setAttribute('trail', "");
                      

                    } else {
                       //wait a bit for static colliders to load...
                      //  gravity: '0 0 0 ', 
                      setTimeout( () => {
                        this.el.setAttribute('ammo-body', {type: this.data.objectData.physics.toLowerCase(), emitCollisionEvents: true, linearDamping: .1, angularDamping: .1});
                        
                        let yfudge = '0 1 0';
                        if (this.data.objectData.yPosFudge) {
                          yfudge = '0 ' + this.data.objectData.yPosFudge + ' 0';
                        }
                        // let halfExtents = '1 1 1';
                        let halfExtents = {};
                        halfExtents.x = 1;
                        halfExtents.y = 1;
                        halfExtents.z = 1;

                        let offset = {};
                        offset.x = 0;
                        offset.y = 0;
                        offset.z = 0;
                        let colliderScale = 1;
                        if (this.data.objectData.colliderScale && this.data.objectData.colliderScale != 0 && this.data.objectData.colliderScale != "") {
                          colliderScale = this.data.objectData.colliderScale;
                          halfExtents.x = colliderScale;
                          halfExtents.y = colliderScale;
                          halfExtents.z = colliderScale;
                          offset.y = colliderScale;
                        }
                        if (this.data.objectData.collidertype.toLowerCase() == "box") {
                          // halfExtents = this.data.objectData.colliderScale + " " + this.data.objectData.colliderScale + " " + this.data.objectData.colliderScale;
                          this.el.setAttribute('ammo-shape', {type: this.data.objectData.collidertype.toLowerCase(), fit: 'manual', halfExtents: halfExtents, offset: offset});
                        } 
                        if (this.data.objectData.collidertype.toLowerCase() == "sphere") {
                          this.el.setAttribute('ammo-shape', {type: 'sphere', fit: 'manual', sphereRadius: colliderScale, offset: yfudge});
                          
                        } else {
                          console.log("no collider scale, using default...");
                          this.el.setAttribute('ammo-shape', {type: this.data.objectData.collidertype.toLowerCase(), halfExtents: halfExtents, offset: offset});
                        }
                       
                        console.log("ammo shape is " + JSON.stringify(that.el.getAttribute('ammo-shape')) + " applyForce " + this.data.applyForceToNewObject);
                      
                        // } else {
                          // setTimeout( () => {
                            // this.el.setAttribute('ammo-body', {disableSimulation: false});
                      }, 4000);
                    }
                      if (this.data.applyForceToNewObject) {
                        // this.el.setAttribute("aabb-collider", {objects: ".activeObjexRay"});
                        this.applyForce();
                        this.el.setAttribute('trail', "");
                        this.el.setAttribute('obb-collider', {'size': this.data.xscale * 1.5 + ' ' + this.data.yscale * 1.5 + ' ' +this.data.zscale * 1.5});
                      }
                        // }
                        // this.el.setAttribute('rotate-toward-velocity');
                       
                        // this.el.body.restitution = .9;

                  // }
                   
                  } else if (this.data.objectData.physics.toLowerCase() == "navmesh agent") {
                    this.el.setAttribute('ammo-body', {type: 'kinematic', emitCollisionEvents: true });
                  } else {
                    setTimeout( () => { //wait a bit for static colliders to load...
                      console.log("tryna set physics body with timeout "+ this.data.objectData.physics.toLowerCase());
                      this.el.setAttribute('ammo-body', { type: this.data.objectData.physics.toLowerCase(), emitCollisionEvents: true });
                    }, 2000);
                   
                    //this.el.body.restitution = .9;
                  }
      
                }
            }
  
          }
          this.el.object3D.getWorldScale(this.oScale);
          // 
          // setTimeout(()=>{
            // this.el.setAttribute('obb-collider', {'size': this.oScale.x + ' ' + this.oScale.y + ' ' +this.oScale.z});
            
            this.el.setAttribute('obb-collider', {'size': this.data.xscale * 1.5 + ' ' + this.data.yscale * 1.5 + ' ' +this.data.zscale * 1.5});

            // this.el.setAttribute('obb-collider', {'size': this.data.objectData.colliderScale.toString() + " " + this.data.objectData.colliderScale.toString() + " " + this.data.objectData.colliderScale.toString()});
            // this.el.setAttribute('obb-collider', '');
            // console.log("setting obb-collider " + this.data.xscale  + ' ' + this.data.yscale + ' ' +this.data.zscale );
          // }, 3000);
          // this.showCallout('', '0 2 2', 10);
      }); //end model-loaded listener
  
      this.el.addEventListener('body-loaded', () => {  //body-loaded event = physics ready on obj
        // console.log("loaded mod_object physics body now applying shape: : " + JSON.stringify(this.data.objectData));
      // if (this.data.objectData.objectID && this.data.objectData.objectID != "none") {
        let yfudge = '0 1 0';
        if (this.data.objectData.yPosFudge) {
          yfudge = '0 ' + this.data.objectData.yPosFudge + ' 0';
        }
        let halfExtents = '1 1 1';
        if (this.data.objectData.colliderScale) {
          if (this.data.objectData.collidertype == "box") {
          halfExtents = this.data.objectData.colliderScale + " " + this.data.objectData.colliderScale + " " + this.data.objectData.colliderScale;
          this.el.setAttribute('ammo-shape', {type: this.data.objectData.collidertype.toLowerCase(), fit: 'manual', halfExtents: halfExtents, offset: yfudge});
          } 
          if (this.data.objectData.collidertype == "sphere") {
            this.el.setAttribute('ammo-shape', {type: 'sphere', fit: 'manual', sphereRadius: this.data.colliderScale, offset: yfudge});
          }
        } else {
          this.el.setAttribute('ammo-shape', {type: this.data.objectData.collidertype.toLowerCase(), offset: yfudge});
        }
       
        // console.log("ammo shape is " + JSON.stringify(that.el.getAttribute('ammo-shape')));
        if (this.data.applyForceToNewObject) {
          // this.el.setAttribute("aabb-collider", {objects: ".activeObjexRay"});
          this.applyForce();
        }
      }); //end body-loaded listener
      
      this.el.addEventListener("obbcollisionstarted", (e) => { //use instead of physics..
        console.log(this.data.objectData.name + " obb collision with" + e.detail.withEl.id + " vs " + this.lastCollidedWithID);
        if (e.detail.withEl.id != this.lastCollidedWithID) {
          this.lastCollidedWithID = e.detail.withEl.id;
          
          let targetModObjComponent = e.detail.withEl.components.mod_object;
          if (targetModObjComponent) {
            // console.log(this.data.objectData.name +" collided with mod_object " +targetModObjComponent.data.objectData.name + " with objtype " + targetModObjComponent.data.objectData.objtype );
            // this.hitpoint = e.detail.withEl.object3D.position;
            let targetPosition = e.detail.withEl.object3D.position;
            let targetDistance = window.playerPosition.distanceTo(targetPosition);
            console.log(this.data.objectData.name + " gotsa collision with " + targetModObjComponent.data.objectData.name + 
            " type " + targetModObjComponent.data.objectData.objtype + " hitpoints " + targetModObjComponent.data.objectData.hitpoints);

            if (this.data.objectData.name != targetModObjComponent.data.objectData.name) { //don't trigger yerself, but what if...?

              if (this.triggerAudioController != null) {
                // console.log("tryna play trigger audio hit");
                this.triggerAudioController.components.trigger_audio_control.playAudioAtPosition(targetPosition, targetDistance, ["hit"]);
              }
              // console.log("actions: " + JSON.stringify(mod_obj_component.data.objectData.actions));
              // var this.triggerAudioController = document.getElementById("triggerAudio");
              // if (this.triggerAudioController != null) {
              //   this.triggerAudioController.components.trigger_audio_control.playAudioAtPosition(this.el.object3D.position, window.playerPosition.distanceTo(this.el.object3D.position), ["magic"]);
              // }
              // console.log(this.data.objectData.name  + " hit by other object : " + JSON.stringify(targetModObjComponent.data.objectData));
              let objectMass = 0;
              if (this.data.objectData.physics == "Dynamic") { //calc some damage by "mass", even if not a weapon...
                let oSplit = this.data.objectData.weight.split("-");
                
                objectMass = this.returnRandomNumber(parseFloat(oSplit[0]), parseFloat(oSplit[1]));
                console.log("gotsa Dynamic physics object w/ objectMass " + objectMass );
              }
              if ((this.data.objectData.objtype == "Weapon" || objectMass != 0) && targetModObjComponent.data.objectData.quality.toLowerCase() != "indestructible") {//hrm...
                if (objectMass != 0 || (this.data.objectData.operator == "Damage" && targetModObjComponent.data.objectData.hitpoints)) {
                  let damageHitPoints = this.data.objectData.hitpoints ? parseFloat(this.data.objectData.hitpoints) : 0; 
                  if (this.calloutEntity != null) {
                    let theDamage = parseFloat(damageHitPoints) + parseFloat(objectMass);
                    targetModObjComponent.data.damage = parseFloat(targetModObjComponent.data.damage) + theDamage;
                    console.log("DAMAGE hitpoints " + damageHitPoints.toFixed(2) + " distance " + targetDistance + " currentdamage " + targetModObjComponent.data.damage +  " of " + targetModObjComponent.data.objectData.hitpoints);
                    if (targetModObjComponent.data.damage < targetModObjComponent.data.objectData.hitpoints) {
                      targetModObjComponent.showCallout("Hit +"+ theDamage.toFixed(2) +" : "+ targetModObjComponent.data.damage.toFixed(2) + " / " + targetModObjComponent.data.objectData.hitpoints, targetPosition, targetDistance);
                      console.log("gotsa damage hit " +targetModObjComponent.data.damage.toFixed(2) + " / " + targetModObjComponent.data.objectData.hitpoints);
                    } else {
                      this.isDead = true;
                      // this.showCallout("I AM DEAD NOW!", this.hitpoint, targetDistance);
                      console.log("IAMDEAD!");
                      let greetingDialogEl = document.getElementById("sceneGreetingDialog");
                      if (greetingDialogEl) {
                        let dialogComponent = greetingDialogEl.components.scene_greeting_dialog;
                        if (dialogComponent) {
                            // console.log("tryna");
                            dialogComponent.setLocation();
                            dialogComponent.ShowMessageAndHide("You destroyed a " + targetModObjComponent.data.objectData.name + "!", 2000);
                        } else {
                            console.log("caint find no dangblurn dialog component!");
                        }
                      }
                      targetModObjComponent.killMe();
                      // this.killAction = 
                      // if (this.killAction) {
                      
                      //   if (this.killAction.actionResult.toLowerCase() == "trigger fx") {
                      //     if (!this.isTriggered) {
                      //       this.isTriggered = true;
                      //       let particleSpawner = document.getElementById('particleSpawner');
                      //       if (particleSpawner != null) {
                      //         var worldPosition = new THREE.Vector3();
                      //         this.el.object3D.getWorldPosition(worldPosition);
                      //         if (this.data.objectData.yPosFudge != null && this.data.objectData.yPosFudge != "") {
                      //           worldPosition.y += this.data.objectData.yPosFudge;
                      //         }
                      //         console.log("triggering fx at " + JSON.stringify(worldPosition) + " plus" + this.data.objectData.yPosFudge);
                      //         particleSpawner.components.particle_spawner.spawnParticles(worldPosition, this.data.objectData.particles, 5, null, this.data.objectData.yPosFudge, this.data.objectData.color1, this.data.objectData.triggerScale);
                      //       }
                      //     } else {
                      //       console.log("already triggered - make it a toggle!");
                      //     }
                      //   }
                      //   if (this.killAction.actionResult.toLowerCase() == "spawn") {
                      //     if (!this.isTriggered) {
                      //       this.isTriggered = true;

                      //         let objectData = this.objexEl.components.mod_objex.returnObjectData(this.killAction.objectID);
                      //         if (objectData == null) {
                      //           objectData = this.objexEl.components.mod_objex.returnObjectData(this.killAction.objectID);
                      //         }
                      //         if (objectData != null) {
                      //           console.log("killed object spawning object with " + JSON.stringify(objectData));
                      //           this.objEl = document.createElement("a-entity");
                      //           this.locData = {};
                      //           this.locData.x = this.el.object3D.position.x;
                      //           this.locData.y = this.el.object3D.position.y + 1;
                      //           this.locData.z = this.el.object3D.position.z;
                      //           this.locData.timestamp = Date.now();
                      //           this.objEl.setAttribute("mod_object", {'locationData': this.locData, 'objectData': objectData, 'isSpawned': false});
                      //           this.objEl.id = "obj" + objectData._id + "_" + this.locData.timestamp;
                      //           sceneEl.appendChild(this.objEl);
                      //         } else {
                      //           console.log("caint find object "+ this.killAction.objectID +", tryna fetch it..");
                      //           FetchSceneInventoryObject(this.killAction.objectID);
                      //           objectData = this.objexEl.components.mod_objex.returnObjectData(this.killAction.objectID);
                               
                      //           console.log("killed object spawning object with " + JSON.stringify(objectData));
                      //           this.objEl = document.createElement("a-entity");
                      //           this.locData = {};
                      //           this.locData.x = this.el.object3D.position.x;
                      //           this.locData.y = this.el.object3D.position.y + 1;
                      //           this.locData.z = this.el.object3D.position.z;
                      //           this.locData.timestamp = Date.now();
                      //           this.objEl.setAttribute("mod_object", {'locationData': this.locData, 'objectData': objectData, 'isSpawned': false});
                      //           this.objEl.id = "obj" + objectData._id + "_" + this.locData.timestamp;
                      //           sceneEl.appendChild(this.objEl);
                      //         }
                      //       }
                      //   } else {
                      //     console.log("already triggered - make it a toggle!");
                      //   }
                      //   //well, just do death particles everywhere for now...
                      //     this.particlesEl = null;
                      //     this.particlesEl = document.createElement("a-entity");
                      //     // this.particlesEl.setAttribute("mod_particles", {"enabled": false});
                      //     this.el.sceneEl.appendChild(this.particlesEl); //hrm...
                      //     this.particlesEl.setAttribute("position", this.el.object3D.position);
                      //     this.particlesEl.setAttribute('sprite-particles', {
                      //       enable: true, 
                      //       texture: '#smoke1', 
                      //       color: settings.sceneColor3+".."+settings.sceneColor4, 
                      //       blending: 'additive', 
                      //       textureFrame: '6 5', 
                      //       textureLoop: '1', 
                      //       spawnRate: '1', 
                      //       lifeTime: '3', 
                      //       scale: '100,1000'});
                      //     this.particlesEl.setAttribute('sprite-particles', {"duration": 3});
                      //     // }

                      //     this.el.classList.remove('activeObjexRay');
                      //     this.el.removeAttribute('ammo-shape');
                      //     this.el.removeAttribute('ammo-body');
                      //     this.el.parentNode.removeChild(this.el); //actually kill it
                      // } //end kill action


                    } //end if is dead
                    if (this.selectAction && (this.selectAction.actionResult.toLowerCase() == "prompt" || this.selectAction.actionResult.toLowerCase() == "dialog")) {
                      if (this.isNavAgent && this.navAgentController) {
                        if (this.navAgentController.currentState == "dialog") {
                          this.navAgentController.updateAgentState("random");
                        } else {
                          this.navAgentController.updateAgentState("dialog");
                          
                          }
                          
                        }
                      }
                    }
                  }
                }
              // } else {
              //   console.log("stop hitting yourself!");
              // }
              if (targetModObjComponent.data.objectData.actions) {
                
                for (let i = 0; i < targetModObjComponent.data.objectData.actions.length; i++) {
                  // console.log(this.data.objectData.name + "checking actions on target " + targetModObjComponent.data.objectData.name + " : " + targetModObjComponent.data.objectData.actions[i].actionName + " actionType " + targetModObjComponent.data.objectData.actions[i].actionType.toLowerCase());
                  console.log("target action count: " + targetModObjComponent.data.actionCount);
                  // if (e.detail.withEl.id != targetModObjComponent.data.objectData.actions[i].objectID) { //dont retrigger on collision from spawned obj
                    if (targetModObjComponent.data.objectData.actions[i].objectID) {
                      FetchSceneInventoryObject(targetModObjComponent.data.objectData.actions[i].objectID);
                    }
                    if (targetModObjComponent.data.objectData.actions[i].actionType.toLowerCase() == "collide") {
                      console.log("gotsa collide action");
                      //spawn new object on collision 
                      if (targetModObjComponent.data.objectData.actions[i].sourceObjectMod.toLowerCase() == "add object") { 
                        let trailComponent = e.detail.withEl.components.trail;
                        if (trailComponent) {
                          trailComponent.reset();
                        }
                        if (targetModObjComponent.data.actionCount == 0) {
                          targetModObjComponent.data.actionCount++;
                          let objectData = this.objexEl.components.mod_objex.returnObjectData(targetModObjComponent.data.objectData.actions[i].objectID);
                          if (objectData != null) {
                            console.log("tryna replace object with " + JSON.stringify(objectData));
                            this.objEl = document.createElement("a-entity");
                            this.locData = {};
                            this.locData.x = this.el.object3D.position.x - (3 * Math.random());
                            this.locData.y = this.el.object3D.position.y;
                            this.locData.z = this.el.object3D.position.z - (3 * Math.random()) ;
                            this.locData.timestamp = Date.now();
                            this.objEl.setAttribute("mod_object", {'locationData': this.locData, 'objectData': objectData, 'isSpawned': false});
                            this.objEl.id = "obj" + objectData._id + "_" + this.locData.timestamp;
                            if (settings && settings.useArParent) {                
                              let ar_parent = document.getElementById("ar_parent");
                              if (ar_parent) {
                                ar_parent.appendChild(this.objEl);
                              } else {
                                sceneEl.appendChild(this.objEl);
                              }
                            } else {
                              sceneEl.appendChild(this.objEl);
                            }
                            // sceneEl.appendChild(this.objEl);
                          } else {
                            console.log("caint find object "+ targetModObjComponent.data.objectData.actions[i].objectID +", tryna fetch it..");
                            FetchSceneInventoryObject(targetModObjComponent.data.objectData.actions[i].objectID);
                          }
                        }
                      }
                      //remove on collision
                      if (targetModObjComponent.data.objectData.actions[i].sourceObjectMod.toLowerCase() == "remove") { 
                        let trailComponent = e.detail.withEl.components.trail;
                        if (trailComponent) {
                          trailComponent.reset();
                        }
                        if (e.detail.withEl.parentNode) {
                          e.detail.withEl.parentNode.removeChild(e.detail.withEl);
                        }
                      }

                      //remove and add a new something
                      if (targetModObjComponent.data.objectData.actions[i].sourceObjectMod.toLowerCase() == "replace object") { 
                        console.log("tryna replace object...");
                        let trailComponent = e.detail.withEl.components.trail;
                        if (trailComponent) {
                          trailComponent.kill();
                        }
                        let objectData = this.objexEl.components.mod_objex.returnObjectData(targetModObjComponent.data.objectData.actions[i].objectID);
                        if (objectData != null) {
                          
                          if (e.detail.withEl.parentNode) {
                            e.detail.withEl.parentNode.removeChild(e.detail.withEl);
                          }

                          console.log("tryna replace object with " + JSON.stringify(objectData));

                          this.objEl = document.createElement("a-entity");

                          this.locData = {};
                          this.locData.x = this.el.object3D.position.x;
                          this.locData.y = this.el.object3D.position.y;
                          this.locData.z = this.el.object3D.position.z;
                          this.locData.timestamp = Date.now();
                          this.objEl.setAttribute("mod_object", {'locationData': this.locData, 'objectData': objectData, 'isSpawned': false});
                          this.objEl.id = "obj" + objectData._id + "_" + this.locData.timestamp;
                          if (settings && settings.useArParent) {                
                            let ar_parent = document.getElementById("ar_parent");
                            if (ar_parent) {
                              ar_parent.appendChild(this.objEl);
                            } else {
                              sceneEl.appendChild(this.objEl);
                            }
                          } else {
                            sceneEl.appendChild(this.objEl);
                          }
                          // sceneEl.appendChild(this.objEl);
                        } else {
                          console.log("caint find object "+ targetModObjComponent.data.objectData.actions[i].objectID +", tryna fetch it..");
                          FetchSceneInventoryObject(targetModObjComponent.data.objectData.actions[i].objectID);
                        }
                      }
                    }
                  // }
                }
              }
              if (this.data.objectData && this.data.objectData.eventtype && this.data.objectData.eventtype.toLowerCase() == "destroy self") {//!!
                this.el.classList.remove('activeObjexRay');
                this.el.removeAttribute('ammo-shape');
                this.el.removeAttribute('ammo-body');
                this.el.parentNode.removeChild(this.el);
              }
            }
          } else {
            console.log("stop hitting yourself!");
          }
            if (this.hasShootAction && e.detail.withEl.id != "player") {
              // console.log("tryna cleanup!")
              this.el.sceneEl.object3D.remove(this.line);
              let trailComponent = this.el.components.trail;
              if (trailComponent) {
                trailComponent.kill();
                // this.el.removeAttribute("trail");
              }
            }
          }
      });

      // this.el.addEventListener("collidestart_nope", (e) => { //dep'd for obb collision above, but maybe...
      //     // e.preventDefault();
      //   if (!this.isDead && e.detail.targetEl) {  
      //       console.log("physics collision HIT me "  + this.data.objectData.name + " other id " + e.detail.targetEl.id);
                       
      //     this.hitpoint = e.detail.targetEl.object3D.position;
      //     this.distance = window.playerPosition.distanceTo(this.hitpoint);
      //     let targetModObjComponent = e.detail.targetEl.components.mod_object;
      //     if (targetModObjComponent != null) {
      //           console.log(this.data.objectData.name + " gotsa collision with " + targetModObjComponent.data.objectData.name + 
      //           " type " + targetModObjComponent.data.objectData.objtype + " hitpoints " + targetModObjComponent.data.objectData.hitpoints);
      //           if (this.data.objectData.name != targetModObjComponent.data.objectData.name) { //don't trigger yerself, but what if...?

      //             if (this.triggerAudioController != null) {
      //               // console.log("tryna play trigger audio hit");
      //               this.triggerAudioController.components.trigger_audio_control.playAudioAtPosition(this.hitpoint, this.distance, ["hit"]);
      //             }
      //             // console.log("actions: " + JSON.stringify(mod_obj_component.data.objectData.actions));
      //             // var this.triggerAudioController = document.getElementById("triggerAudio");
      //             if (this.triggerAudioController != null) {
      //               this.triggerAudioController.components.trigger_audio_control.playAudioAtPosition(this.el.object3D.position, window.playerPosition.distanceTo(this.el.object3D.position), ["magic"]);
      //             }
      //             // console.log(this.data.objectData.name  + " hit by other object : " + JSON.stringify(targetModObjComponent.data.objectData));

      //             if (targetModObjComponent.data.objectData.objtype == "Weapon" && this.data.objectData.quality.toLowerCase() != "indestructible") {
      //               if (targetModObjComponent.data.objectData.operator == "Damage" && targetModObjComponent.data.objectData.hitpoints) {
                     
      //                 if (this.calloutEntity != null) {
                        
      //                   this.currentDamage = this.currentDamage + parseFloat(targetModObjComponent.data.objectData.hitpoints);
      //                   console.log("DAMAGE hitpoints " + targetModObjComponent.data.objectData.hitpoints + " distance " + this.distance + " damage " + this.currentDamage +  " of " + targetModObjComponent.data.objectData.hitpoints);
      //                   if (this.currentDamage < this.data.objectData.hitpoints) {
      //                     this.showCallout("Hit -" + targetModObjComponent.data.objectData.hitpoints + " : " + this.currentDamage + " / " +this.data.objectData.hitpoints, this.hitpoint, this.distance);
      //                   } else {
      //                     this.isDead = true;
      //                     // this.showCallout("I AM DEAD NOW!", this.hitpoint, this.distance);
      //                     let greetingDialogEl = document.getElementById("sceneGreetingDialog");
      //                     if (greetingDialogEl) {
      //                       let dialogComponent = greetingDialogEl.components.scene_greeting_dialog;
      //                       if (dialogComponent) {
      //                           // console.log("tryna");
      //                           dialogComponent.setLocation();
      //                           dialogComponent.ShowMessageAndHide("You destroyed a " + this.data.objectData.name + "!", 2000);
      //                       } else {
      //                           console.log("caint find no dangblurn dialog component!");
      //                       }
      //                     }
      //                     if (this.killAction) {
                          
      //                       if (this.killAction.actionResult.toLowerCase() == "trigger fx") {
      //                         if (!this.isTriggered) {
      //                           this.isTriggered = true;
      //                           let particleSpawner = document.getElementById('particleSpawner');
      //                           if (particleSpawner != null) {
      //                             var worldPosition = new THREE.Vector3();
      //                             this.el.object3D.getWorldPosition(worldPosition);
      //                             if (this.data.objectData.yPosFudge != null && this.data.objectData.yPosFudge != "") {
      //                               worldPosition.y += this.data.objectData.yPosFudge;
      //                             }
      //                             console.log("triggering fx at " + JSON.stringify(worldPosition) + " plus" + this.data.objectData.yPosFudge);
      //                             particleSpawner.components.particle_spawner.spawnParticles(worldPosition, this.data.objectData.particles, 5, null, this.data.objectData.yPosFudge, this.data.objectData.color1, this.data.objectData.triggerScale);
      //                           }
      //                         } else {
      //                           console.log("already triggered - make it a toggle!");
      //                         }
      //                       }
      //                       if (this.killAction.actionResult.toLowerCase() == "spawn") {
      //                         if (!this.isTriggered) {
      //                           this.isTriggered = true;

      //                             let objectData = this.objexEl.components.mod_objex.returnObjectData(this.killAction.objectID);
      //                             if (objectData == null) {
      //                               objectData = this.objexEl.components.mod_objex.returnObjectData(this.killAction.objectID);
      //                             }
      //                             if (objectData != null) {
      //                               console.log("killed object spawning object with " + JSON.stringify(objectData));
      //                               this.objEl = document.createElement("a-entity");
      //                               this.locData = {};
      //                               this.locData.x = this.el.object3D.position.x;
      //                               this.locData.y = this.el.object3D.position.y + 1;
      //                               this.locData.z = this.el.object3D.position.z;
      //                               this.locData.timestamp = Date.now();
      //                               this.objEl.setAttribute("mod_object", {'locationData': this.locData, 'objectData': objectData, 'isSpawned': false});
      //                               this.objEl.id = "obj" + objectData._id + "_" + this.locData.timestamp;
      //                               sceneEl.appendChild(this.objEl);
      //                             } else {
      //                               console.log("caint find object "+ this.killAction.objectID +", tryna fetch it..");
      //                               FetchSceneInventoryObject(this.killAction.objectID);
      //                               objectData = this.objexEl.components.mod_objex.returnObjectData(this.killAction.objectID);
                                   
      //                               console.log("killed object spawning object with " + JSON.stringify(objectData));
      //                               this.objEl = document.createElement("a-entity");
      //                               this.locData = {};
      //                               this.locData.x = this.el.object3D.position.x;
      //                               this.locData.y = this.el.object3D.position.y + 1;
      //                               this.locData.z = this.el.object3D.position.z;
      //                               this.locData.timestamp = Date.now();
      //                               this.objEl.setAttribute("mod_object", {'locationData': this.locData, 'objectData': objectData, 'isSpawned': false});
      //                               this.objEl.id = "obj" + objectData._id + "_" + this.locData.timestamp;
      //                               sceneEl.appendChild(this.objEl);
      //                             }
      //                           }
      //                       } else {
      //                         console.log("already triggered - make it a toggle!");
      //                       }
      //                       //well, just do death particles everywhere for now...
      //                         this.particlesEl = null;
      //                         this.particlesEl = document.createElement("a-entity");
      //                         // this.particlesEl.setAttribute("mod_particles", {"enabled": false});
      //                         this.el.sceneEl.appendChild(this.particlesEl); //hrm...
      //                         this.particlesEl.setAttribute("position", this.el.object3D.position);
      //                         this.particlesEl.setAttribute('sprite-particles', {
      //                           enable: true, 
      //                           texture: '#smoke1', 
      //                           color: settings.sceneColor3+".."+settings.sceneColor4, 
      //                           blending: 'additive', 
      //                           textureFrame: '6 5', 
      //                           textureLoop: '1', 
      //                           spawnRate: '1', 
      //                           lifeTime: '3', 
      //                           scale: '100,1000'});
      //                         this.particlesEl.setAttribute('sprite-particles', {"duration": 3});
      //                         // }

      //                         this.el.classList.remove('activeObjexRay');
      //                         this.el.removeAttribute('ammo-shape');
      //                         this.el.removeAttribute('ammo-body');
      //                         this.el.parentNode.removeChild(this.el); //actually kill it
      //                     } //end kill action


      //                   } //end if is dead
      //                   if (this.selectAction && (this.selectAction.actionResult.toLowerCase() == "prompt" || this.selectAction.actionResult.toLowerCase() == "dialog")) {
      //                     if (this.isNavAgent && this.navAgentController) {
      //                       if (this.navAgentController.currentState == "dialog") {
      //                         this.navAgentController.updateAgentState("random");
      //                       } else {
      //                         this.navAgentController.updateAgentState("dialog");
      //                         }
      //                       }
      //                     }
      //                   }
      //                 }
      //               }
      //             } else {
      //               console.log("stop hitting yourself!");
      //             }
      //             if (targetModObjComponent.data.objectData.actions) {

      //               for (let i = 0; i < targetModObjComponent.data.objectData.actions.length; i++) {
      //                 // console.log(this.data.objectData.name + "checking actions on target " + targetModObjComponent.data.objectData.name + " : " + targetModObjComponent.data.objectData.actions[i].actionName + " actionType " + targetModObjComponent.data.objectData.actions[i].actionType.toLowerCase());
      //                 if (targetModObjComponent.data.objectData.actions[i].objectID) {
      //                   FetchSceneInventoryObject(targetModObjComponent.data.objectData.actions[i].objectID);
      //                 }
      //                 if (targetModObjComponent.data.objectData.actions[i].actionType.toLowerCase() == "collide") {
      //                   console.log("gotsa collide action");
      //                   //spawn new object on collision 
      //                   if (targetModObjComponent.data.objectData.actions[i].sourceObjectMod.toLowerCase() == "add object") { 
      //                     let trailComponent = e.detail.targetEl.components.trail;
      //                     if (trailComponent) {
      //                       trailComponent.reset();
      //                     }
      //                     let objectData = this.objexEl.components.mod_objex.returnObjectData(targetModObjComponent.data.objectData.actions[i].objectID);
      //                     if (objectData != null) {
      //                       console.log("tryna replace object with " + JSON.stringify(objectData));
      //                       this.objEl = document.createElement("a-entity");
      //                       this.locData = {};
      //                       this.locData.x = this.el.object3D.position.x;
      //                       this.locData.y = this.el.object3D.position.y;
      //                       this.locData.z = this.el.object3D.position.z;
      //                       this.locData.timestamp = Date.now();
      //                       this.objEl.setAttribute("mod_object", {'locationData': this.locData, 'objectData': objectData, 'isSpawned': false});
      //                       this.objEl.id = "obj" + objectData._id + "_" + this.locData.timestamp;
      //                       sceneEl.appendChild(this.objEl);
      //                     } else {
      //                       console.log("caint find object "+ targetModObjComponent.data.objectData.actions[i].objectID +", tryna fetch it..");
      //                       FetchSceneInventoryObject(targetModObjComponent.data.objectData.actions[i].objectID);
      //                     }
      //                   }
      //                   //remove on collision
      //                   if (targetModObjComponent.data.objectData.actions[i].sourceObjectMod.toLowerCase() == "remove") { 
      //                     let trailComponent = e.detail.targetEl.components.trail;
      //                     if (trailComponent) {
      //                       trailComponent.reset();
      //                     }
      //                     if (e.detail.targetEl.parentNode) {
      //                       e.detail.targetEl.parentNode.removeChild(e.detail.targetEl);
      //                     }
      //                   }

      //                   //remove and add a new something
      //                   if (targetModObjComponent.data.objectData.actions[i].sourceObjectMod.toLowerCase() == "replace object") { 
      //                     console.log("tryna replace object...");
      //                     let trailComponent = e.detail.targetEl.components.trail;
      //                     if (trailComponent) {
      //                       trailComponent.kill();
      //                     }
      //                     let objectData = this.objexEl.components.mod_objex.returnObjectData(targetModObjComponent.data.objectData.actions[i].objectID);
      //                     if (objectData != null) {
                            
      //                       if (e.detail.targetEl.parentNode) {
      //                         e.detail.targetEl.parentNode.removeChild(e.detail.targetEl);
      //                       }

      //                       console.log("tryna replace object with " + JSON.stringify(objectData));
  
      //                       this.objEl = document.createElement("a-entity");
  
      //                       this.locData = {};
      //                       this.locData.x = this.el.object3D.position.x;
      //                       this.locData.y = this.el.object3D.position.y;
      //                       this.locData.z = this.el.object3D.position.z;
      //                       this.locData.timestamp = Date.now();
      //                       this.objEl.setAttribute("mod_object", {'locationData': this.locData, 'objectData': objectData, 'isSpawned': false});
      //                       this.objEl.id = "obj" + objectData._id + "_" + this.locData.timestamp;
      //                       sceneEl.appendChild(this.objEl);
      //                     } else {
      //                       console.log("caint find object "+ targetModObjComponent.data.objectData.actions[i].objectID +", tryna fetch it..");
      //                       FetchSceneInventoryObject(targetModObjComponent.data.objectData.actions[i].objectID);
      //                     }
      //                   }
      //                 }
      //               }
      //             }
      //             if (this.data.objectData.eventtype.toLowerCase() == "destroy self") {
      //               this.el.classList.remove('activeObjexRay');
      //               this.el.removeAttribute('ammo-shape');
      //               this.el.removeAttribute('ammo-body');
      //               this.el.parentNode.removeChild(this.el);
      //             }
      //           }
               
      //           if (this.hasShootAction && e.detail.targetEl.id != "player") {
      //             // console.log("tryna cleanup!")
      //             this.el.sceneEl.object3D.remove(this.line);
                  
      //             let trailComponent = this.el.components.trail;
      //             if (trailComponent) {
      //               trailComponent.kill();
      //               // this.el.removeAttribute("trail");
      //             }
      //           }
      //         }
      //   });// end collidestart
     
  
      this.el.addEventListener('raycaster-intersected', e =>{  
          this.raycaster_e = e.detail.el;
          // that.raycaster = this.raycaster;
          this.intersection = this.raycaster_e.components.raycaster.getIntersection(this.el, true);
          if (this.intersection && e.detail.el.id != 'cameraRig') {
            this.hitpoint = this.intersection.point;
            that.hitpoint = this.hitpoint;
            console.log(that.data.objectData.name + " with tags " + this.tags + " hit el.id " + e.detail.el.id+ " intersect at " + JSON.stringify(this.intersection.point));
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
      this.el.addEventListener('mousedown', (evt) => {
        // if (this.timestamp != '' && settings.allowMods && this.data.allowMods) {
        //   if (keydown == "T") {
        //     ToggleTransformControls(this.timestamp);
        //   } else if (keydown == "Shift") {
        //     ShowLocationModal(this.timestamp);
        //   } 
        // }
      });
      this.el.addEventListener('mouseenter', (evt) => {
        console.log("mouse enter mod_object name " + this.data.objectData.name + " id " + this.el.id + " " + this.data.markerType + " " + this.data.objectData.objtype + " this.textData " + this.textData);
        evt.preventDefault();
        if (!this.data.isEquipped) {
          if (posRotReader != null) {
            this.playerPosRot = posRotReader.returnPosRot(); 
            window.playerPosition = this.playerPosRot.pos; 
          } else {
            posRotReader = document.getElementById("player").components.get_pos_rot; 
            this.playerPosRot = posRotReader.returnPosRot(); 
            window.playerPosition = this.playerPosRot.pos; 
          }
          
          if (!this.isSelected && evt.detail.intersection != null) {
            this.clientX = evt.clientX;
            this.clientY = evt.clientY;

            let calloutText = this.textData[this.textIndex];
  
            this.pos = evt.detail.intersection.point; //hitpoint on model
            let name = evt.detail.intersection.object.name;
            this.hitPosition = this.pos;
            // if (player != null && window.playerPosition != undefined) {
            this.distance = window.playerPosition.distanceTo(this.hitPosition);
            // console.log("distance  " + this.distance);
            this.rayhit(evt.detail.intersection.object.name, this.distance, evt.detail.intersection.point);
  
            this.selectedAxis = name;
            ////////TODO - wire in to Hightlight Options / Callout Options in Object view
            if (this.tags != null && this.tags.includes("thoughtbubble") && this.bubbleBackground) {
              calloutOn = true;
  
              // this.bubble = sceneEl.querySelector('.bubble');
              // this.bubbleText = sceneEl.querySelector('.bubbleText');
              // this.bubbleBackground = sceneEl.querySelector('.bubbleBackground');
              
              this.bubble.setAttribute("visible", true);
              let pos = evt.detail.intersection.point; //hitpoint on model
              this.bubble.setAttribute('position', pos);
              this.bubbleText.setAttribute("visible", true);

              let camera = AFRAME.scenes[0].camera; 
              pos.project(camera);
              var width = window.innerWidth, height = window.innerHeight; 
              let widthHalf = width / 2;
              let heightHalf = height / 2;
              pos.x = (pos.x * widthHalf) + widthHalf;
              pos.y = - (pos.y * heightHalf) + heightHalf;
              pos.z = 0;
             
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
              console.log("tryna show callout text " + calloutText);
              this.bubbleText.setAttribute('troika-text', {
                baseline: "bottom",
                align: "center",
                font: "/fonts/web/" + font,
                fontSize: .2,
                anchor: "center",
                // wrapCount: 20,
                color: "black",
                value: calloutText
                // value: "HEY WTF HEY WTF HEY WTF HEY WTF HEY WTF HEY WTF HEY WTF HEY WTF HEY WTF HEY WTF HEY WTF HEY WTF HEY WTF HEY WTF HEY WTF HEY WTF HEY WTF HEY WTF "
  
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
              if (this.calloutEntity != null) {
                // this.calloutEntity.setAttribute('visible', false);
                let calloutString = this.data.objectData.callouttext;
                console.log("mod_object callout " + calloutString + " w distance :" + this.distance + " isNavAgent " + this.isNavAgent + " pos " + JSON.stringify(this.pos));
             
                
                this.calloutEntity.setAttribute('visible', true);
                this.calloutEntity.setAttribute('scale', {x: this.distance * .25, y: this.distance * .25, z: this.distance * .25} );
                // if (!this.isNavAgent) {
                //   this.calloutEntity.setAttribute("position", this.pos);
                // } else {
                  // let y = '0 2 1';
                  let yScale = this.data.locationData.yscale ? this.data.locationData.yscale : 1;
                  let yFudge = this.data.objectData.yPosFudge ? this.data.objectData.yPosFudge : 0;
                  let y = ((yScale * 1.75) + parseFloat(yFudge)); // tweaky scale + fudgefactor
                  console.log("tryna fudge y " + yScale + " + " + yFudge);
                  this.calloutEntity.setAttribute("position", "0 "+y+" .75");
                  // console.log('tryna fudge y '+ y);

                  
                  // this.calloutEntity.setAttribute("position", "0 3 0");
                // }
               
                // let calloutString = theLabel;
                this.calloutLabelSplit = calloutString.split("~");
                if (this.calloutLabelSplit.length > 1) {
                  if (this.calloutLabelIndex < this.calloutLabelSplit.length - 1) {
                    this.calloutLabelIndex++;
                  } else {
                    this.calloutLabelIndex = 0;
                  }
                  calloutString = this.calloutLabelSplit[this.calloutLabelIndex];
                } 
                
                this.calloutText.setAttribute("troika-text", {
                                              value: calloutString,
                                              color: "white"
                                              });
              } else {
                console.log("mod_object no callout " + this.calloutEntity + " " + this.distance);
              }
  
              if (this.hasHighlightAction) {
  
              }
            }
  
            if (this.isNavAgent && !this.coolDown) {
              this.coolDownTimer();
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
              if (this.data.objectData.audiogroupID && this.data.objectData.audiogroupID.length > 4) { //it's an objectID
                if (this.objectAudioController) {
                  console.log("tryna play random object_audio");
                  this.objectAudioController.playRandom();
                } else {
                  this.objectAudioController = this.el.components.object_audio_controller;
                }
              }
              
  
            }
            if (this.tags != undefined && this.tags != null && this.tags != "undefined") { //MAYBE SHOULD BE UNDER RAYHIT?
             
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
        console.log("mousedown on " +this.el.id+ " time "+ this.mouseDowntime + "  on mod_object type: " + this.data.objectData.objtype + " hasEquip " + this.hasEquipAction + " hasPickup " + this.hasPickupAction + 
                    " equipped " + this.data.isEquipped + " equippable " + this.data.isEquippable);
        if (keydown == "T") {
          ToggleTransformControls(this.data.timestamp);
        } else if (keydown == "Shift") {
        //   ShowLocationModal(that.timestamp);
            selectedLocationTimestamp = this.data.timestamp;
            // ShowLocationModal(that.timestamp);
            SceneManglerModal('Location');
        } else {
          let transform_controls_component = this.el.components.transform_controls;
          if (transform_controls_component) {
              if (transform_controls_component.data.isAttached) {
                  // transform_controls_component.detachTransformControls();
                  return; //don't do stuff below if transform enabled
              }
          }
          if (!this.data.isEquipped) {
            this.dialogEl = document.getElementById('mod_dialog');
            
            if (this.hasEquipAction) {
              // this.el.setAttribute('visible', false);
              if (this.data.isEquippable) { //locationTags includes "equippable", so it skips inventory...
                this.promptSplit = [];
                if (this.data.objectData.prompttext != undefined && this.data.objectData.prompttext != null && this.data.objectData.prompttext != "") {
                  if (this.data.objectData.prompttext.includes('~')) {
                    this.promptSplit = this.data.objectData.prompttext.split('~'); 
                  } else {
                    this.promptSplit.push(this.data.objectData.prompttext);
                  }
                  // this.el.components.mod_synth.medTrigger();
                  this.dialogEl.components.mod_dialog.showPanel("Equip " + this.data.objectData.name + "?\n\n" + this.promptSplit[Math.floor(Math.random()*this.promptSplit.length)], this.data.objectData._id, "equipMe", 3333, this.el.id );
                } else {
                  this.dialogEl.components.mod_dialog.showPanel("Equip " + this.data.objectData.name + "?", this.data.objectData._id, "equipMe", 3333, this.el.id );
                }
              }
            } 
            if (this.data.objectData.objtype.toLowerCase() == "pickup" || this.hasPickupAction) {
              // this.el.setAttribute('visible', false);
              if (!this.data.isEquippable) { //i.e. does not skip inventory
                if (this.data.objectData.prompttext != undefined && this.data.objectData.prompttext != null && this.data.objectData.prompttext != "") {
                  if (this.data.objectData.prompttext.includes('~')) {
                    this.promptSplit = this.data.objectData.prompttext.split('~'); 
                  }
                  //this calls back to Pickup method from .activated (?), but it doesn't have to, could just pass object _id as above
                  this.dialogEl.components.mod_dialog.showPanel("Pick up " + this.data.objectData.name + "?\n\n" + this.promptSplit[Math.floor(Math.random()*this.promptSplit.length)], this.el.id, "pickMeUp", 5000, this.el.id );
                } else {
                  this.dialogEl.components.mod_dialog.showPanel("Pick up " + this.data.objectData.name + "?", this.el.id, "pickMeUp", 5000, this.el.id );
                }
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
                if (this.isNavAgent && this.navAgentController) {
                  if (this.navAgentController.currentState == "dialog") {
                    this.navAgentController.updateAgentState("random");
                  } else {
                    this.navAgentController.updateAgentState("dialog");
                    // if (this.data.objectData.audiogroupID && this.objectData.audiogroupID.length > 4) {
                    //   triggerAudioController
                    // }
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
            
              if (this.triggerAudioController != null) {
                this.triggerAudioController.components.trigger_audio_control.playAudioAtPosition(this.hitpoint, this.distance, ["shoot"], .5);//tagmangler needs an array, add vol mod 
              }
              // this.el.object3D.visible = false;
              this.el.classList.remove("activeObjexRay");
            
              this.objexEl.components.mod_objex.shootObject(this.data.objectData._id);
              // this.restoreEquipped;
              setTimeout(() => {
                // this.el.object3D.visible = true;
                this.el.classList.add("activeObjexRay");
              }, 1000);
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
        }
      });
      this.calloutEntity = document.createElement("a-entity");
        
          this.calloutText = document.createElement("a-entity");
                  // this.calloutEntity.appendChild(this.calloutPanel);
          this.calloutEntity.appendChild(this.calloutText);
          this.calloutEntity.id = "objCalloutEntity_" + this.el._id;
        
          this.calloutText.id = "objCalloutText_" + this.el._id;
            
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
          // if (this.isNavAgent || this.data.markerType == "Character") {
            this.el.appendChild(this.calloutEntity);
            let yScale = this.data.locationData.yscale ? this.data.locationData.yscale : 1;
            let yFudge = this.data.objectData.yPosFudge ? this.data.objectData.yPosFudge : 0;
            let y = ((yScale * 1.75) + parseFloat(yFudge)); // tweaky scale + fudgefactor
            console.log("tryna fudge y " + yScale + " + " + yFudge);
            this.calloutEntity.setAttribute("position", "0 "+y+" .75");
          // } 
          // else {
          //   this.el.sceneEl.appendChild(this.calloutEntity);
          // }
  
  
          let font = "Acme.woff"; 
          if (settings && settings.sceneFontWeb2 && settings.sceneFontWeb2.length) {
            font = settings.sceneFontWeb2;
          }
          // this.calloutPanel.setAttribute("position", '0 0 1'); 
          // if (!this.isNavAgent) {
          //   this.calloutText.setAttribute("position", '0 0 1.25'); //offset the child on z toward camera, to prevent overlap on model
          // }
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

          if (this.data.locationData && this.data.locationData.locationTags != undefined  && this.data.locationData.locationTags != 'undefined' && this.data.locationData.locationTags.length > 0) {
            if ( this.data.locationData.locationTags.toLowerCase().includes("hide me")) { 
                this.el.setAttribute("visible", false);
                this.el.classList.remove("activeObjexRay");
                this.el.dataset.isvisible = false;
                console.log("mod_object tryna hide myself set to visible " + this.el.dataset.isvisible);
            }
        } 



    }, //end init
    killMe: function () {
      if (this.killAction) {
                      
        if (this.killAction.actionResult.toLowerCase() == "trigger fx") {
          if (!this.isTriggered) {
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
        if (this.killAction.actionResult.toLowerCase() == "spawn") {
          if (!this.isTriggered) {
            this.isTriggered = true;

              let objectData = this.objexEl.components.mod_objex.returnObjectData(this.killAction.objectID);
              if (objectData == null) {
                objectData = this.objexEl.components.mod_objex.returnObjectData(this.killAction.objectID);
              }
              if (objectData != null) {
                console.log("killed object spawning object with " + JSON.stringify(objectData));
                this.objEl = document.createElement("a-entity");
                this.locData = {};
                this.locData.x = this.el.object3D.position.x;
                this.locData.y = this.el.object3D.position.y + 1;
                this.locData.z = this.el.object3D.position.z;
                this.locData.timestamp = Date.now();
                this.objEl.setAttribute("mod_object", {'locationData': this.locData, 'objectData': objectData, 'isSpawned': false});
                this.objEl.id = "obj" + objectData._id + "_" + this.locData.timestamp;
                // sceneEl.appendChild(this.objEl);
                if (settings && settings.useArParent) {                
                  let ar_parent = document.getElementById("ar_parent");
                  if (ar_parent) {
                    ar_parent.appendChild(this.objEl);
                  } else {
                    sceneEl.appendChild(this.objEl);
                  }
                } else {
                  sceneEl.appendChild(this.objEl);
                }
              } else {
                console.log("caint find object "+ this.killAction.objectID +", tryna fetch it..");
                FetchSceneInventoryObject(this.killAction.objectID);
                objectData = this.objexEl.components.mod_objex.returnObjectData(this.killAction.objectID);
               
                console.log("killed object spawning object with " + JSON.stringify(objectData));
                this.objEl = document.createElement("a-entity");
                this.locData = {};
                this.locData.x = this.el.object3D.position.x;
                this.locData.y = this.el.object3D.position.y + 1;
                this.locData.z = this.el.object3D.position.z;
                this.locData.timestamp = Date.now();
                this.objEl.setAttribute("mod_object", {'locationData': this.locData, 'objectData': objectData, 'isSpawned': false});
                this.objEl.id = "obj" + objectData._id + "_" + this.locData.timestamp;
                // sceneEl.appendChild(this.objEl);
                if (settings && settings.useArParent) {                
                  let ar_parent = document.getElementById("ar_parent");
                  if (ar_parent) {
                    ar_parent.appendChild(this.objEl);
                  } else {
                    sceneEl.appendChild(this.objEl);
                  }
                } else {
                  sceneEl.appendChild(this.objEl);
                }
              }
            }
        } else {
          console.log("already triggered - make it a toggle!");
        }
        //well, just do death particles everywhere for now...
          this.particlesEl = null;
          this.particlesEl = document.createElement("a-entity");
          // this.particlesEl.setAttribute("mod_particles", {"enabled": false});
          // this.el.sceneEl.appendChild(this.particlesEl); //hrm...
          if (settings && settings.useArParent) {                
            let ar_parent = document.getElementById("ar_parent");
            if (ar_parent) {
              ar_parent.appendChild(this.particlesEl);
            } else {
              this.el.sceneEl.appendChild(this.particlesEl);
            }
          } else {
            this.el.sceneEl.appendChild(this.particlesEl);
          }
          this.particlesEl.setAttribute("position", this.el.object3D.position);
          this.particlesEl.setAttribute('sprite-particles', {
            enable: true, 
            texture: '#smoke1', 
            color: settings.sceneColor3+".."+settings.sceneColor4, 
            blending: 'additive', 
            textureFrame: '6 5', 
            textureLoop: '1', 
            spawnRate: '1', 
            lifeTime: '3', 
            scale: '100,1000'});
          this.particlesEl.setAttribute('sprite-particles', {"duration": 3});
          // }

          this.el.classList.remove('activeObjexRay');
          this.el.removeAttribute('ammo-shape');
          this.el.removeAttribute('ammo-body');
          this.el.parentNode.removeChild(this.el); //actually kill it
      } //end kill action
    },
    showCallout: function (calloutString, hitpoint, distance) {
      console.log("tryna show obj callout" + calloutString);
      let color = "white";
      let outlineColor = "black";
      // for (var i in evt.detail.targetEl){
      //   console.log(i);
      //   for (var key in evt.detail.targetEl[i]){
      //       console.log( key + ": " + evt.detail.targetEl[i][key]);
      //   }
      // }
      this.calloutEntity.setAttribute("visible", true);
      this.calloutText.setAttribute("visible", true);

      this.pos = hitpoint;
      this.distance = distance;
      
            if (this.tags != null && this.tags.includes("thoughtbubble")) { //or objectData.calloutType!
              calloutOn = true;
  
              this.bubble = sceneEl.querySelector('.bubble');
              this.bubbleText = sceneEl.querySelector('.bubbleText');
              this.bubbleBackground = sceneEl.querySelector('.bubbleBackground');
              
              this.bubble.setAttribute("visible", true);
              // let pos = evt.detail.collision.point; //hitpoint on model
              let pos = hitpoint; //hitpoint on model
              this.bubble.setAttribute('position', pos);
              this.bubbleText.setAttribute("visible", true);

              // let camera = AFRAME.scenes[0].camera; 
              // pos.project(camera);
              // var width = window.innerWidth, height = window.innerHeight; 
              // let widthHalf = width / 2;
              // let heightHalf = height / 2;
              // pos.x = (pos.x * widthHalf) + widthHalf;
              // pos.y = - (pos.y * heightHalf) + heightHalf;
              // pos.z = 0;
             
              // if ((pos.x/width) < .45) {
              //   console.log("flip left");
              //   this.bubbleBackground.setAttribute("position", ".5 .2 .5");
              //   this.bubbleBackground.setAttribute("scale", "-.2 .2 .2"); 
              //   // this.bubbleBackground.setAttribute('scale', {x: this.distance * -.25, y: this.distance * .25, z: this.distance * .25} );
              //   this.bubbleText.setAttribute("scale", ".2 .2 .2"); 
              //   this.bubbleText.setAttribute("position", ".5 .2 .55");
              // } 
              // if ((pos.x/width) > .55) {
              //   console.log("flip right");
              //   this.bubbleBackground.setAttribute("position", "-.5 .2 .5");
              //   this.bubbleBackground.setAttribute("scale", ".2 .2 .2"); 
              //   // this.bubbleBackground.setAttribute('scale', {x: this.distance * -.25, y: this.distance * .25, z: this.distance * .25} );
              //   this.bubbleText.setAttribute("scale", ".2 .2 .2")
              //   this.bubbleText.setAttribute("position", "-.5 .2 .55");
              // }
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
             
              // if (this.calloutEntity != null && this.distance < 100) {
              if (this.calloutEntity != null) {  
                // this.calloutEntity.setAttribute('visible', false);
                // let calloutString = this.data.objectData.callouttext;
                console.log("mod_object callout w distance :" + this.distance + " " + calloutString);
                this.calloutEntity.setAttribute('visible', true);
                if (this.distance) {
                  this.calloutEntity.setAttribute('scale', {x: this.distance * .5, y: this.distance * .5, z: this.distance * .5} );
                } 
               
                // if (!this.isNavAgent) {
                //   this.calloutEntity.setAttribute("position", this.pos);
                // } else {
                  // let calloutpos = '0 5 .1';
                  // // let scaleval = ' 1'
                  // // if (this.data.objectData.yPosFudge) {
                  // //   calloutpos = '0 ' + (parseFloat(this.data.objectData.yPosFudge) + 1) + ' 1';
                  // // }
                  // if (this.data.yscale) {
                  //   calloutpos = '0 ' + (parseFloat(this.data.yscale) + 2) + ' ' + (parseFloat(this.data.yscale));
                    
                  //   console.log('tryna fudge y '+ calloutpos);
                  //   this.calloutEntity.setAttribute("position", calloutpos);
                  // } 
                  // let y = '0 2 1';
                  
                  // if (this.data.objectData.yPosFudge) {
                  //   let yScale = this.data.locationData.yscale ? this.data.locationData.yscale : 1;
                  //   let yFudge = (parseFloat(this.data.objectData.yPosFudge) + yScale); //+ parseFloat(this.data.locationData.yscale));
                  //   y = '0 ' + yFudge + ' .5';
                    
                  //   this.calloutEntity.setAttribute('position', y);
                  // } else {
                  //   this.calloutEntity.setAttribute('position', y);
                  // }
                  let yScale = this.data.locationData.yscale ? this.data.locationData.yscale : 1;
                  let yFudge = this.data.objectData.yPosFudge ? this.data.objectData.yPosFudge : 0;
                  let y = ((yScale * 1.75) + parseFloat(yFudge)); // tweaky scale + fudgefactor
                  console.log("tryna fudge y " + yScale + " + " + yFudge);
                  this.calloutEntity.setAttribute("position", "0 "+y+" .75");
                // }
               
                // let calloutString = theLabel;
                this.calloutLabelSplit = calloutString.split("~");
                if (this.calloutLabelSplit.length > 1) {
                  if (this.calloutLabelIndex < this.calloutLabelSplit.length - 1) {
                    this.calloutLabelIndex++;
                  } else {
                    this.calloutLabelIndex = 0;
                  }
                  calloutString = this.calloutLabelSplit[this.calloutLabelIndex];
                } 
                if (calloutString.toLowerCase().includes("hit")) {
                  color = "red";
                  outlineColor = "black";
                  this.coolDownTimer();
                }
                console.log("mod_object normal callout " + calloutString);
                this.calloutText.setAttribute("troika-text", {
                                              value: calloutString,
                                              color: color,
                                              outlineColor: outlineColor,
                                              outlineWidth: "2%",
                                              });
              } else {
                console.log("mod_object no callout " + this.calloutEntity + " " + this.distance);
              }
  
              if (this.hasHighlightAction) {
  
              }
            }
  
            if (this.isNavAgent && !this.coolDown) {
              this.coolDownTimer();
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
              if (this.data.objectData.audiogroupID && this.data.objectData.audiogroupID.length > 4) { //it's an objectID
                if (this.objectAudioController) {
                  console.log("tryna play random object_audio");
                  this.objectAudioController.playRandom();
                } else {
                  this.objectAudioController = this.el.components.object_audio_controller;
                }
              }
              
  
            }


      if (this.tags != undefined && this.tags != null && this.tags != "undefined") { //MAYBE SHOULD BE UNDER RAYHIT?
        
              // if (moIndex && moIndex != -1) { //moIndex = "mouthopen"
              //   this.el.setAttribute('animation-mixer', {
              //     "clip": clips[moIndex].name,
              //     "loop": "repeat",
              //     "repetitions": 10,
              //     "timeScale": 2
              //   });
              //   this.el.addEventListener('animation-finished', (e) => { 
              //     this.el.removeAttribute('animation-mixer');
              //   });
              // }
        // }
      }
          // }     
        // }
      // setTimeout(() => {
      //   this.calloutText.setAttribute("visible", false);
      // }, 1000);
    },
    coolDownTimer: function () {
      if (!this.coolDown) {
        this.coolDown = true;
        
        setTimeout( () => {
          this.coolDown = false;
          this.calloutText.setAttribute("troika-text", {
            value: "",
          });
        }, 2000);
      }
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
            //  console.log("no walk clips found!");
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
          var clip = clips[Math.floor(Math.random()*clips.length - 1)];
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
        console.log("new hit " + hitID + " distance: " + distance + " " + JSON.stringify(hitpoint) + " tags " +  this.tags + " equippable " + this.data.isEquippable);
        // var triggerAudioController = document.getElementById("triggerAudio");
        if (this.triggerAudioController != null && !this.data.isEquipped) {
          if (this.tags && !this.data.isEquippable && this.el.classList.contains("target")) {
            this.triggerAudioController.components.trigger_audio_control.playAudioAtPosition(hitpoint, distance, this.tags);
          } else {
            if (this.tags && (this.tags.includes("select") || this.tags.includes("highlight"))) {

            }
          }
         
        }
  
        if (this.hasSynth) {
          if (this.el.components.mod_synth != null && this.data.objectData.tonejsPatch1 != undefined && this.data.objectData.tonejsPatch1 != null) {
            // this.el.components.mod_synth.trigger(distance);
            // if (this.data.objectData.tonejsPatch1 == "Metal") {
            //   this.el.components.mod_synth.metalHitDistance(distance);
            // } else if (this.data.objectData.tonejsPatch1 == "AM Synth") {
              this.el.components.mod_synth.amHitDistance(distance);
            // }
            
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
            // this.el.sceneEl.appendChild(this.particlesEl); //hrm...
            if (settings && settings.useArParent) {                
              let ar_parent = document.getElementById("ar_parent");
              if (ar_parent) {
                ar_parent.appendChild(this.particlesEl);
              } else {
                this.el.sceneEl.appendChild(this.particlesEl);
              }
            } else {
              this.el.sceneEl.appendChild(this.particlesEl);
            }
            
          }
        }
    
     
    },
  
    activated: function () { //i.e. ready for action!
     
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
      objEl.setAttribute("mod_object", {'locationData': this.data.locationData, 'objectData': objectData, 'isSpawned': true});
      objEl.id = "obj" + objectData._id + "_" + this.data.locationData.timestamp;

      
      // sceneEl.appendChild(objEl);
      if (settings && settings.useArParent) {                
        let ar_parent = document.getElementById("ar_parent");
        if (ar_parent) {
          ar_parent.appendChild(objEl);
        } else {
          sceneEl.appendChild(objEl);
        }
      } else {
        sceneEl.appendChild(objEl);
      }
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
        // console.log("pushed " + distance + " " + JSON.stringify(this.pVec));
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
      if (settings && settings.debugMode) {
        this.line = new THREE.Line( this.geometry, this.material );
        this.el.sceneEl.object3D.add( this.line );
      }

      this.followPath = true;
      // this.el.setAttribute("raycaster", {"objects": ".target", "far": "5", "position": "0 -0.5 0", "rotation": "90 0 0"});
      // this.equippedRaycaster = this.el.components.raycaster;
      let brownianPathComponentEl = document.querySelector("[brownian_path]");
      if (brownianPathComponentEl) {
        let brownianPathComponent = brownianPathComponentEl.components.brownian_path;
        brownianPathComponent.setRaycastOrigin(this.el.id);
      }

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
      
      if (this.lookBone) {
        // if (window.playerPosition) {
          // this.pp = {x: window.playerPosition.x, y: window.playerPosition.y, z: window.playerPosition.y };
          // theEye.setAttribute("position", obj.worldToLocal(center));
          this.lookBone.lookAt(this.lookBone.worldToLocal(window.playerPosition));
          this.lookBone.rotation.set( this.lookBone.rotation.x, this.lookBone.rotation.y + Math.PI, this.lookBone.rotation.z );
        // }

      }
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
         
          this.el.object3D.position.copy(this.currentPos);
          this.equipHolder.object3D.getWorldQuaternion(this.el.object3D.quaternion);
         
  
        } 
      }
  
      if (this.data.isEquipped) {
       
        // this.equipHolder.object3D.getWorldPosition(this.positionMe);  //actually it's id "playCaster" //na done it mod_line now...
        // this.equipHolder.object3D.getWorldDirection(this.directionMe).negate();
        
        // if (this.lineEl) {
        //   // this.lineEl.components.mod_line.updateCurve(this.positionMe, this.directionMe);
        // }
      }
     
        if (this.equippedRaycaster != null) {
  
          // if (this.isTriggered) {
          //   this.el.components.mod_line.showLine(true);
          // }
            // if (this.arrow) { //show helper arrow, TODO toggle from dialogs.js
            //   this.el.sceneEl.object3D.remove(this.arrow);
            // }
            // // console.log("tryna show equippedRaycaster...");
            // this.arrow = new THREE.ArrowHelper( this.directionMe, this.positionMe, 10, 0xff0000 );
            // this.arrow = new THREE.ArrowHelper( this.equippedRaycaster.direction, this.equippedRaycaster.origin, 10, 0xff0000 );
            // this.el.sceneEl.object3D.add( this.arrow );
        } 
  
        // if (this.lineGeometry && this.lineObject && this.lineStart) { //for testing
        //   this.lineEnd.copy( this.positionMe ).add( this.directionMe.multiplyScalar( 50 ) );
        //   this.lineMiddle.lerpVectors(this.lineStart, this.lineEnd, 0.5); //maybe don't need...
        //   // console.log(JSON.stringify(this.lineStart), JSON.stringify(this.lineMiddle), JSON.stringify(this.lineEnd));
        //   this.lineGeometry.setFromPoints([this.positionMe, this.lineEnd]);
        //   this.lineGeometry.attributes.position.needsUpdate = true;
        // }
  
         
  
      
      // }
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
      // if (this.data.eventData.toLowerCase().includes("beat")) {
        // let oScale = this.el.getAttribute('scale');
        // oScale = parseFloat(oScale);
        volume = volume.toFixed(2) * .1;
        let scale = {};
          scale.x = this.oScale.x + volume;
          scale.y = this.oScale.y + volume;
          scale.z = this.oScale.z + volume;
          this.el.setAttribute('scale', scale);
          this.el.setAttribute('animation', 'property: scale; to: '+this.oScale.x+' '+this.oScale.y+' '+this.oScale.z+'; dur: '+duration+'; startEvents: beatRecover; easing: easeInOutQuad');
          this.el.emit('beatRecover');
  
      // }
    },
    scatterMe: function () {
      // this.el.object3D.visible = false;
      // let initPos = this.el.getAttribute("position");
      let surface = null;
      let scatterSurface = document.getElementById("scatterSurface");
      let navmesh = document.getElementById("nav-mesh");
      if (navmesh) {
        surface = navmesh;
      } else if (scatterSurface) {
        surface = scatterSurface;
      }
      // console.log("tryna SCATTER (not instance) a object " + navmesh + "  " + scatterSurface);
      if (surface) {
        let count = 10;
        let split = this.data.eventData.split("~"); //gonna switch to tags...
        if (split.length > 1) {
          if (parseInt(split[1]) != NaN) {
            count = parseInt(split[1]);
          }
          
        }
        // console.log("TRYNA SCATTER MOD_OBJECT with count " + count + " ypos " + this.data.ypos);
        let scatterCount = 0;
        // if (!this.isNavAgent) { //use waypoints for position below instead of raycasting if it's gonna nav
        let interval = setInterval( () => {
        let yMod = 1;
        if (this.data.locationData.y) {
          yMod = parseFloat(this.data.locationData.y);
        }
        for (let i = 0; i < 100; i++) {

          let testPosition = new THREE.Vector3();
          if (settings && settings.useArParent) {
            testPosition.x = this.returnRandomNumber(-10, 10);  
            testPosition.y = 5;
            testPosition.z = this.returnRandomNumber(-10, 10);
          } else {
            testPosition.x = this.returnRandomNumber(-100, 100);  
            testPosition.y = 50;
            testPosition.z = this.returnRandomNumber(-100, 100);
          }
          let raycaster = new THREE.Raycaster();
          raycaster.set(new THREE.Vector3(testPosition.x, testPosition.y, testPosition.z), new THREE.Vector3(0, -1, 0));
          let results = raycaster.intersectObject(surface.getObject3D('mesh'), true);
          let scale = this.returnRandomNumber(.5, 1.5);
          if(results.length > 0) {
            scatterCount++;
            scale = this.returnRandomNumber(.5, 1.5);
            
            testPosition.x = results[0].point.x.toFixed(2); //snap y of waypoint to navmesh y
            testPosition.y = results[0].point.y; //snap y of waypoint to navmesh y
            testPosition.z = results[0].point.z.toFixed(2); //snap y of waypoint to navmesh y
            let scatteredEl = document.createElement("a-entity"); 
            scatteredEl.setAttribute("position", testPosition);
            scatteredEl.setAttribute("gltf-model", "#" + this.data.modelID);
            let eventData = this.data.eventData.replace("scatter", ""); //prevent infinite recursion!
            let equippable = false;
            // if (this.data.locationData.tags && )
            let location = {};
            location.x = testPosition.x;
            location.y = yMod + testPosition.y;
            location.z = testPosition.z;
            location.eulerx = 0;
            location.eulery = 0;
            location.eulerz = 0;
            location.xscale = this.data.xscale * scale;
            location.yscale = this.data.yscale * scale;
            location.zscale = this.data.zscale * scale;
            location.tags = this.data.locationData.locationTags;
            if (location.tags && location.tags.includes("equippable")) {
              equippable = true;
            }
            console.log("gotsa scatterPosition for object " + this.data.objectData.objectID + " intersect: " + results.length + " " +results[0].object.name + 
              "scatterCount " + scatterCount + " vs count " + count +  " scale " + this.scale + " equippable " + equippable + " locationData " + JSON.stringify(this.data.locationData));
            console.log("scattered scale " + scale + " ymod " + yMod + " test.y " + testPosition.y  + " location.y " + location.y + " location " + JSON.stringify(location));
            scatteredEl.setAttribute("mod_object", {eventData: eventData, markerType: this.data.markerType, xscale: location.xscale * scale, yscale: location.yscale * scale, zscale: location.zscale * scale, ypos: location.y, tags: this.data.tags, 
                                                    description: this.data.description, locationData: location, objectData: this.data.objectData, isEquippable: equippable, tags: this.data.locationData.locationTags});
            scatteredEl.setAttribute("shadow", {cast: true, receive: true});
            scatteredEl.classList.add("envMap");
            scatteredEl.id = this.data.objectData._id + "_scattered_" + scatterCount;
            // if (this.data.markerType != "character") { //messes up navmeshing..
            // this.el.setAttribute('obb-collider');
              // scatteredEl.setAttribute("scale", {x: this.data.xscale * scale, y: this.data.yscale * scale, z: this.data.zscale * scale});
              // scatteredEl.setAttribute("scale", {x: scale, y:scale, z: scale})

            // }
            if (settings && settings.useArParent) {       
              let ar_parent = document.getElementById("ar_parent");
              if (ar_parent) {
                  ar_parent.appendChild(scatteredEl);
                }
            } else {
              this.el.sceneEl.appendChild(scatteredEl);
            }
            // this.el.sceneEl.appendChild(scatteredEl);
            

            if (scatterCount > count) {
              clearInterval(interval);
              break;
              } else {
                break;
              }
                
            } else {
              console.log('bad testPosition ' + JSON.stringify(testPosition));
              // waypoints.splice(i, 1);
            }
            // console.log("randomWaypoint : " + position);
            if (i == 100) {
              clearInterval(interval);
            }
          }
        }, 2000);
      }
      
    },
    returnRandomNumber: function (min, max) {
      return Math.random() * (max - min) + min;
    },
   
  }); ///////////////////////// MOD_OBJECT END