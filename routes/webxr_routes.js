const express = require("express");
const webxr_router = express.Router();
const entities = require("entities");
const async = require('async');
const ObjectID = require("bson-objectid");
const path = require("path");
const jwt = require("jsonwebtoken");
const requireText = require('require-text');


function getExtension(filename) {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i);
}

function convertStringToObjectID (stringID) {
    if (ObjectID.isValid(stringID)) {
        return ObjectID(stringID);
    } else {
        return null;
    }
}

function UppercaseFirst(s) {
    if (s != undefined) {
    const ufirst = s.charAt(0).toUpperCase() + s.slice(1);
    return ufirst;
        } else {
            return "*";
        }
    };
    
webxr_router.get("/test", function (req, res) {
    res.send("OK!");
});    

////////////////////PRIMARY SERVERSIDE /WEBXR ROUTE///////////////////
webxr_router.get('/:_id', function (req, res) { 
    let db = req.app.get('db');
    let s3 = req.app.get('s3');

    var reqstring = entities.decodeHTML(req.params._id);
    console.log("webxr scene req " + reqstring);
    if (reqstring != undefined && reqstring != 'undefined' && reqstring != null) {
    // let authString = checkAuthentication(req);
    // console.log("referrer: " + req.header.referrer);

    // var audioResponse = {};
    // var pictureResponse = {};
    // var postcardResponse = {};
    var sceneResponse = {};
    var requestedPictureItems = [];
    var requestedPictureGroups = [];
    var requestedVideoGroups = [];
    var requestedAudioItems = [];
    var requestedVideoItems = [];
    var requestedTextItems = [];
    var sceneTextItemData = "";
    sceneResponse.audio = [];
    sceneResponse.pictures = [];
    sceneResponse.postcards = [];
    var sceneOwnerID = "";
    let primaryAudioTitle = "";
    let primaryAudioObject = {};
    let primaryAudioWaveform = "";
    let scenePrimaryVolume = .8;
    let sceneAmbientVolume = .8;
    let sceneTriggerVolume = .8;
    // let ambienturl = "";
    var mp3url = "";
    var oggurl = "";
    var pngurl = "";
    let ambientUrl = "";
    let triggerUrl = "";
    var vidUrl = "";
    var postcard1 = "";
    var image1url = "";
    var short_id = "";
    var picArray = [];
    var imageAssets = "";
    var imageEntities = "";
    var skyboxUrl = "";
    var skyboxID = "";
    let skyboxIDs = [];
    let convertEquirectToCubemap = "";
    let skyboxAsset = "";
    var skySettings = "";
    var fogSettings = "";
    var shadowLight = "";
    var hemiLight = "";
    var groundPlane = "";
    var ocean = "";
    let terrain = "";
    let enviroScripts = "";
    var camera = "";
    var oceanScript = "";
    var ARScript = "";
    var locationScripts = "";
    let geoScripts = "";
    var ARSceneArg = "";
    let AREntities = "";
    var debugMode = false;
    var ARMarker = "";
    var arMode = "position";
    // var randomizerScript = "";
    // var animationComponent = "";
    // var targetObjectAsset = "";
    // var targetObjectEntity = "";
    var skyParticles;
    var videoAsset = "";
    var videoEntity = "";
    let youtubes = [];
    let mapOverlay = "";
    let canvasOverlay = "";
    let audioSliders = "";
    let screenOverlay = "";
    let adSquareOverlay = "";
    var nextLink = "";
    var prevLink = "";
    var loopable = "";
    // let usdzs = [];
    // var gltfs = {};
    var sceneGLTFLocations = [];
    var sceneModelLocations = [];
    var sceneObjectLocations = [];

    var sceneWeblinkLocations = [];
    // var allGLTFs = {};
    // var gltfUrl = "";
    // var gltfs = "";
    var gltfsAssets = "";
    var gltfsEntities = "";
    let weblinkAssets = "";
    let weblinkEntities = "";
    let shaderScripts = "";
    // var gltfItems = [];
    var bucketFolder = "eloquentnoise.com";
    var playerPosition = "0 1.6 0";
    var playerRotation = "0 180 0";
    // var style = "<link rel=\x22stylesheet\x22 type=\x22text/css\x22 href=\x22../styles/embedded.css\x22>";
    let aframeEnvironment = "";
    let ambientLight = "<a-light type='ambient' intensity='.25'></a-light>";
    // let ambientLight = "";
    let htmltext = "";
    let sceneNextScene = "";
    let scenePreviousScene = "";
    let synthScripts = "";
    let streamPrimaryAudio = false;
    let audioControl = "<script src=\x22../main/src/component/audio_control.js\x22></script>";
    let primaryAudioScript = "";
    let primaryAudioParams = "";
    // let primaryAudioControl = "";
    let primaryAudioEntity = "";
    let ambientAudioEntity = "";
    let ambientAudioScript = "";
    // let ambientAudioControl = "";
    let triggerAudioScript = "";
    // let triggerAudioControl = "";
    let triggerAudioEntity = "";
    let pAudioWaveform = "";
    let primaryAudioLoop = false;
    let networkedscene = "";
    // let socketHost = req.headers.host;
    let socketHost = "strr.us";
    let avatarName = "guest";
    let skyGradientScript = "";
    let textLocation = "";
    let pictureLocation = "";
    let picturegroupLocation = "-4 2 3";
    let scenesKeyLocation = "8 2 -4";
    let audioLocation = "-3 1.7 -4";
    let videoLocation = "10 2 15";
    let videoRotation = "0 0 0";
    let videoParent = "look-at=\x22#player\x22"; //billboard by default
    let weblinkLocation = "5 2 5";
    let locationLights = [];
    let particleLocations = [];
    let locationPlaceholders = [];
    let locationCallouts = [];
    let locationPictures = [];
    let curvePoints = [];
    let curveEntities = "";
    let matrixEntities = ""; //matrix.org comms
    // let parametricEntities = "";
    let lightEntities = "";
    let placeholderEntities = "";
    // let placeholderEntities = "<a-entity id=\x22createPlaceholders\x22 create_placeholders></a-entity>";
    let calloutEntities = "";
    let carLocation = "";
    let cameraEnvMap = "";
    // let cubeMapAsset = ""; //deprecated, all at runtime now..
    let contentUtils = "<script src=\x22../main/src/component/content-utils.js\x22 defer=\x22defer\x22></script>"; 
    let videosphereAsset = "";
    let mainTextEntity = "";
    let attributionsTextEntity = "";
    let audioVizScript = "";
    let audioVizEntity = "";
    let trackLocation = false;
    let trackImage = false;
    let trackMarker = false;
    let joystickScript = "";
    let settingsData = "";
    let carScript = "";
    let networkingEntity = "";
    let locationEntity = "";
    let locationButton = "";
    let mapButtons = "";
    let mapStyleSelector = "";
    let dialogButton = "";
    let transportButtons = "";
    let sceneManglerButtons = "";
    let pool_target = "";
    let pool_launcher = "";
    let renderPanel = "";
    var assetNumber = 1;
    let sceneWebLinx = [];
    let attributions = [];
    let attributionsObject = {};
    let loadAttributions = "";
    let loadAudioEvents = "";
    let loadLocations = "";
    let loadUSDZ = "";
    let loadAvailableScenes = "";
    let availableScenesResponse = {};
    let availableScenesEntity = "";
    let pictureGroupsEntity = "";
    let pictureGroupsData = "";
    let audioGroupsEntity = "";
    let audioGroupsData = "";
    let videoGroupsEntity = "";
    let videoElements = "";
    let hlsScript = "";
    // let loadPictureGroups = "";
    let availableScenesInclude = "";
    let restrictToLocation = false;
    let isGuest = true;
    let socketScripts = "";
    let navmeshScripts = "";
    let hasSynth = false;
    let hasPrimaryAudio = false;
    let hasPrimaryAudioStream = false;
    let hasAmbientAudio = false;
    let ambientOggUrl = "";
    let ambientMp3Url = "";
    let triggerOggUrl = "";
    let triggerMp3Url = "";
    let hasTriggerAudio = true;
    // let wasd = "wasd-controls=\x22fly: false; acceleration: 35; constrainToNavMesh: true;\x22";
    let wasd = "";
    //TODO use process env for google analytics
    let googleAnalytics = "<!-- Global site tag (gtag.js) - Google Analytics --><script async src=\x22https://www.googletagmanager.com/gtag/js?id=UA-163893846-1\x22></script>"+
        "<script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'UA-163893846-1');"+
        "</script>";
        
    let googleAdSense = "<script data-ad-client=\x22ca-pub-5450402133525063\x22 async src=\x22https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js\x22></script>";   
    // let metamaskScript = "";
    let sceneData = "";
    let nftIDs = "";
    let sceneBackground = " background ";
    let skyboxEnvMap = "";
    let geoEntities = "";
    let geoEntity = 'geo-location'; //may be set to "gps-entity-place" for arjs locationing
    let usdzModel = "";
    let gltfModel = "";
    let cameraScripts = "";
    let containers = "";
    // let navmarsh = "";
    let navmeshAsset = "";
    let navmeshEntity = "";
    let showTransport = false;
    let useNavmesh = false;
    let useSimpleNavmesh = false;
    let showDialog = false;
    let showSceneManglerButtons = false;
    let ethereumButton = "";
    let youtubeContent = "";
    let youtubeEntity = "";
    let instancingEntity = "";
    let meshUtilsScript = "<script type=\x22module\x22 src=\x22../main/src/component/mesh-utils.js\x22 defer=\x22defer\x22></script>";
    let physicsScripts = "";
    let brownianScript = "";
    let aframeExtrasScript = "<script src=\x22../main/vendor/aframe/animation-mixer.js\x22></script>"; //swapped with full aframe-extras lib (that includes animation-mixer) for physics and navmesh if needed
    let logScripts = "";
    enviromentScript = ""; //for aframe env component
    // let debugMode = false;
    // let aframeScriptVersion = "<script src=\x22https://aframe.io/releases/1.3.0/aframe.min.js\x22></script>";
    let aframeScriptVersion = "<script src=\x22https://aframe.io/releases/1.3.0/aframe.min.js\x22></script>";
    
    
    let surfaceScatterScript = "";
    let locationData = "";
    let modelData = "";
    let objectData = "";
    let inventoryData = "";
    let joystickContainer  = "";
    let arImageTargets = [];

    db.scenes.findOne({"short_id": reqstring}, function (err, sceneData) { 
            if (err || !sceneData) {
                console.log("1 error getting scene data: " + err);
                res.end();
            } else { 
                let accessScene = true;
                // sceneData = sceneData;
                // async.waterfall([ 
                // function (callback) {
                //     //TODO use sceneNetworkSettings or whatever
                //     socketScripts = "<script src=\x22/connect/connect.js\x22 defer=\x22defer\x22></script>" +
                //     "<script src=\x22//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js\x22></script>" +
                //     "<script src=\x22https://strr.us/socket.io/socket.io.js\x22></script>" +
                //     "<script src=\x22/main/js/jquery.backstretch.min.js\x22></script>"; 
                if (req.session) {
                    if (req.session.user) {
                        avatarName = req.session.user.userName;
                        isGuest = false;
                    }
                }
                if (!sceneData.sceneShareWithPublic) { 
                    accessScene = false;
                    console.log("isGUest: " +isGuest+ " sceneShareWithSubscribers " + sceneData.sceneShareWithSubscribers);
                    if (sceneData.sceneShareWithSubscribers && !isGuest) {
                        console.log("welcome subscriber");
                        accessScene = true;
                    } else {
                        if (req.session.user != undefined) {
                            if (sceneData.user_id == req.session.user._id) {
                                console.log("welcome scene owner");
                                accessScene = true;
                            } else {
                                console.log("that's private!");
                                accessScene = false;
                            }
                        } else {
                            console.log("that's private!");
                            accessScene = false;
                        }
                    }
                }
                async.waterfall([  // async init
                
                function (callback) {
                    let pin = req.query.p;
                    if (pin != null) {
                        console.log('gotsa pin : ' + pin);
                        var timestamp = Math.round(Date.now() / 1000);
                        var query = {$and: [{pin : pin}, {validated : true}, {accessTimeWindow: {$gt : timestamp}}, {pinTimeout: {$gt: timestamp}}]}; 
                        console.log('pin query ' + JSON.stringify(query));
                        db.invitations.findOne (query, function (err, invitation) {
                            // db.invitations.find ({$and: [{sentToEmail : req.body.email}, {validated : true} ]}, function (err, invitations) {
                                console.log("invitation : " + JSON.stringify(invitation));
                            if (err || !invitation) {
                                console.log("error checking pin " + invitation);
                                callback(err);
                                // accessScene = false;
                            } else {
                                // console.log('invitations' + JSON.stringify(invitations) );
                                accessScene = true;
                                avatarName = invitation.sentToEmail.toString().split('@')[0];
                                console.log("pin checks out!!");
                                let action = {};

                                action.invitationSceneAccess = (timestamp * 1000) + "_" + invitation._id + "_" + invitation.invitedToSceneShortID;
                                db.people.updateOne({"_id": ObjectID(invitation.sentToPersonID)}, {$addToSet: {activities: action}});
                                // db.invitations.update ( { pin: pin }, { $set: { pinTimeout : ''} }); //burn after reading once! //nm, just sniff the timestamp
                                callback(null);
                            }
                        });
                    } else {
                        callback(null);
                    }
                },
                function (callback) {
                    if (!accessScene) {
                        callback(true); //error is true, bail to the end!
                    } else {
                        callback(null); //elsewise go wid it now...
                    }
                },
                function (callback) {
                if (sceneData.sceneTags != null) {        
                    for (let i = 0; i < sceneData.sceneTags.length; i++) { //not ideal, but it's temporary... //no it isn't
                        if (sceneData.sceneTags[i].toLowerCase().includes("debug")) {
                            debugMode = true;
                        }
                        if (sceneData.sceneTags[i].toLowerCase().includes("stats")) {
                            logScripts = "<script src=\x22https://cdn.jsdelivr.net/gh/kylebakerio/vr-super-stats@1.5.0/vr-super-stats.js\x22></script>";
                        }
                        if (sceneData.sceneTags[i].toLowerCase().includes("logs")) {
                            logScripts = logScripts + "<script src=\x22../main/src/component/a-console.js\x22></script>";
                        }
                        if (sceneData.sceneTags[i].toLowerCase().includes("physics")) {
                            physicsScripts =  "<script src=\x22https://mixedreality.mozilla.org/ammo.js/builds/ammo.wasm.js\x22></script>"+
                            "<script src=\x22../main/vendor/aframe/aframe-physics-system.min.js\x22></script>";                                                        
                        }
                        if (sceneData.sceneTags[i].toLowerCase().includes("brownian")) {
                            brownianScript =  "<script src=\x22../main/src/component/aframe-brownian-motion.js\x22></script>";
                        }
                        if (sceneData.sceneTags[i].toLowerCase().includes("instancing")) {
                            // console.log("GOTS SCENE TAG: " + sceneData.sceneTags[i]);
                            // showTransport = true;
                            
                            meshUtilsScript = "<script type=\x22module\x22 src=\x22../main/src/component/mesh-utils.js\x22></script>"; //imports MeshSurfaceScatter
                            
                            instancingEntity = "";
                        } 
                        if (sceneData.sceneTags[i].toLowerCase().includes("aabb") || sceneData.sceneTags[i].toLowerCase().includes("collision")) {
                            // console.log("GOTS SCENE TAG: " + sceneData.sceneTags[i]);
                            // showTransport = true;
                            
                            meshUtilsScript = meshUtilsScript + "<script src=\x22../main/src/component/aframe-aabb-collider-component.min.js\x22></script>"; //imports MeshSurfaceScatter
                            

                        } 
                        if (sceneData.sceneTags[i] == "instancing demo") {
                            
                            instancingEntity = "<a-entity instanced_meshes_sphere></a-entity>";
                        } 
                        if (sceneData.sceneTags[i] == "show transport") {
                            // console.log("GOTS SCENE TAG: " + sceneData.sceneTags[i]);
                            showTransport = true;
                        }
                        if (sceneData.sceneTags[i] == "show dialog") {
                            // console.log("GOTS SCENE TAG: " + sceneData.sceneTags[i]);
                            showDialog = true;
                        }
                        if (sceneData.sceneTags[i] == "show buttons") {
                            // console.log("GOTS SCENE TAG: " + sceneData.sceneTags[i]);
                            showSceneManglerButtons = true;
                        }
                        if (sceneData.sceneTags[i] == "use navmesh") {
                            console.log("GOTS USENAVMESH TAG: " + sceneData.sceneTags[i]);
                            useNavmesh = true;
                        }
                        if (sceneData.sceneTags[i].toLowerCase().includes("simple navmesh")) {
                            console.log("GOTS SimpleNavmesh TAG: " + sceneData.sceneTags[i]);
                            useSimpleNavmesh = true;
                        }
                        if (sceneData.sceneTags[i] == "show ethereum") {
                            ethereumButton = "<div class=\x22ethereum_button\x22 id=\x22ethereumButton\x22 style=\x22margin: 10px 10px;\x22><i class=\x22fab fa-ethereum fa-2x\x22></i></div>";
                        }
                        if (sceneData.sceneTags[i].includes("synth")) {
                            synthScripts = "<script src=\x22../main/src/synth/Tone.js\x22></script><script src=\x22../main/js/synth.js\x22></script>";
                        }
                        if (sceneData.sceneTags[i].toLowerCase().includes("aframe 1.2")) {
                            aframeScriptVersion = "<script src=\x22https://aframe.io/releases/1.2.0/aframe.min.js\x22></script>";
                        }
                        if (sceneData.sceneTags[i].toLowerCase().includes("aframe master")) {
                            aframeScriptVersion = "<script src=\x22https://cdn.jsdelivr.net/gh/aframevr/aframe@744e2b869e281f840cff7d9cb02e95750ce90920/dist/aframe-master.min.js\x22></script>"; //ref 20220715// nope!
                        }
                        if (sceneData.sceneTags[i].toLowerCase().includes("aframe ada")) {
                            aframeScriptVersion = "<script src=\x22https://a-cursor-test.glitch.me/aframe-master.js\x22></script>"; //mod by @adarosecannon
                        }
                    }
                }
                //TODO use sceneNetworkSettings or whatever
                // socketScripts = "<script src=\x22/connect/connect.js\x22 defer=\x22defer\x22></script>" +
                // "<script src=\x22/main/vendor/jquery/jquery.min.js\x22></script>" +
                socketScripts = "<script src=\x22https://strr.us/socket.io/socket.io.js\x22></script>";
                // "<script src=\x22/main/vendor/jscookie/js.cookie.min.js\x22></script>" +
                    
                // TODO - backstretch include var!
                // "<script src=\x22/main/js/jquery.backstretch.min.js\x22></script>"; 
                if (avatarName == undefined || avatarName == null || avatarName == "guest") { //cook up a guest name if not logged in
                    array1 = [];
                    array2 = [];
                    array3 = [];
                    index1 = -1;
                    index2 = -1;
                    index3 = -1;
                    name1 = "";
                    name2 = "";
                    name3 = "";
                    min = 0;
                    db.lexicons.findOne({name: "nameArrays"}, function (err, items) {
                    if (err || !items) {
                        console.log("error getting scene 5: " + err);
                        callback (err);
                    } else {
                        array1 = items.adjectives;
                        array2 = items.colors;
                        array3 = items.animals;
                        // console.log("array 1" + array1);
                        index1 = Math.floor(Math.random() * array1.length);
                        name1 = UppercaseFirst(array1[index1]);
                        index2 = Math.floor(Math.random() * array2.length);
                        name2 = UppercaseFirst(array2[index2]);
                        index3 = Math.floor(Math.random() * array3.length);
                        name3 = UppercaseFirst(array3[index3]);
                        avatarName = name1 + "_" + name2 + "_" + name3;
                        callback();
                        }
                    });
                } else {
                    callback();
                }
            },
            function (callback) {
                if (sceneData.sceneUseDynCubeMap) {
                    skyboxEnvMap = "skybox-env-map";   
                    console.log("skyboxEnvMap is " + skyboxEnvMap);
                }

                        sceneOwnerID = sceneData.user_id;
                        short_id = sceneData.short_id;
                        sceneResponse = sceneData;
                        sceneNextScene = sceneResponse.sceneNextScene;
                        let poiIndex = 0;
                        scenePreviousScene = sceneResponse.scenePreviousScene;
                        console.log("sceneResponse.sceneNetworking " + sceneResponse.sceneNetworking);
                        if (sceneResponse.sceneNetworking == "SocketIO")
                        networkedscene = "networked-scene=\x22serverURL: "+socketHost+"; app: "+sceneData.sceneDomain+" ; room: "+sceneData.short_id+"; connectOnLoad: true; onConnect: onConnect; adapter: socketio; audio: false; debug: false;\x22";
                        if (sceneResponse.sceneNetworking == "WebRTC")
                        networkedscene = "networked-scene=\x22serverURL: "+socketHost+"; app: "+sceneData.sceneDomain+" ; room: "+sceneData.short_id+"; connectOnLoad: true; onConnect: onConnect; adapter: webrtc; audio: false; debug: false;\x22";
                        if (sceneResponse.sceneNetworking == "AudioChat")
                        networkedscene = "networked-scene=\x22serverURL: "+socketHost+"; app: "+sceneData.sceneDomain+" ; room: "+sceneData.short_id+"; connectOnLoad: true; onConnect: onConnect; adapter: webrtc; audio: true; debug: false;\x22";
                        if (sceneResponse.sceneNetworking != "None") {
                        networkingEntity = "<a-entity look-at=\x22#player\x22 position=\x22-8 1.1 -12\x22>" +
                        "<a-entity naf-connect=\x22avatarName:"+avatarName+"\x22 class=\x22gltf\x22 gltf-model=\x22#groupicon\x22 material=\x22shader: noise;\x22 class=\x22activeObjexGrab activeObjexRay\x22>"+
                            // "<a-text id=\x22statusText\x22 look-at=\x22#player\x22 rotation=\x220 180 0\x22 position=\x220 .5 0\x22 value=\x22\x22></a-text>"+
                        "</a-entity>"+
                            "<a-entity visible=\x22false\x22 id=\x22statusText\x22 geometry=\x22primitive: plane; width: 1.5; height: 1.5\x22 position=\x220 2.1 -1\x22 material=\x22color: grey; transparent: true; opacity: 0.0\x22" +
                                "text=\x22value:status:; wrapCount: 20;\x22>" +
                                "<a-entity class=\x22gltf\x22 gltf-model=\x22#square_panel\x22 scale=\x221.5 1.5 1.5\x22 position=\x220 -.25 -.5\x22></a-entity>" +
                            "</a-entity>"+
                        "</a-entity>";
                        }
                        // console.log("networking: " + networkingEntity);

                        // if (sceneResponse.sceneDomain != null && sceneResponse.sceneDomain != "") {
                        //     bucketFolder = sceneResponse.sceneDomain;
                        // } else {
                        //     callback(err);
                        // }
                        if (sceneResponse.scenePictures != null && sceneResponse.scenePictures.length > 0) {
                            sceneResponse.scenePictures.forEach(function (picture) {
                                // console.log("scenePIcture " + picture);
                                var p_id = ObjectID(picture); //convert to binary to search by _id beloiw
                                requestedPictureItems.push(p_id); //populate array
                            });
                        }
                        
                        if (sceneResponse.sceneDebugMode != null && sceneResponse.sceneDebugMode != undefined && sceneResponse.sceneDebugMode != "") {
                            debugMode = true;
                        }
                        if (sceneResponse.sceneYouTubeIDs != null && sceneResponse.sceneYouTubeIDs.length > 0) {
                            youtubes = sceneResponse.sceneYouTubeIDs;
                        }
                        ////LOCATION FU
                        if (sceneResponse.sceneLocations != null && sceneResponse.sceneLocations.length > 0) {
                            
                            if (sceneResponse.sceneWebType == "AR Location Tracking") { //NOOPE
                                // geoEntity = 'gps-entity-place'; //default = 'geo-location'
                                geoEntity = "gps-position";
                            }
                            for (var i = 0; i < sceneResponse.sceneLocations.length; i++) {
                                // console.log("gotsa location markter with type " + sceneResponse.sceneLocations[i].markerType);
                                // console.log("sceneLocationTracking is " +sceneResponse.sceneLocationTracking && );
                                // console.log("sceneLocraitons are a thing and sceneLocationTracking is " +sceneResponse.sceneLocationTracking + " " + sceneResponse.sceneLocations[i].type);
                                if ((sceneResponse.sceneLocationTracking != null && sceneResponse.sceneLocationTracking == true) || sceneResponse.sceneWebType == "AR Location Tracking") {  

                                    if (sceneResponse.sceneLocations[i].type.toLowerCase() == "geographic") { //just to set scripts and restrict to location
                                        // console.log("gotsa geo-location " + JSON.stringify(sceneResponse.sceneLocations[i]));
                                            // geoScripts = "<script async src=\x22https://get.geojs.io/v1/ip/geo.js\x22></script><script src=\x22/main/js/geolocator.js\x22></script>";
                                            // locationScripts = "<script src=\x22../main/src/component/location-fu.js\x22></script>";
                                        if (sceneResponse.sceneWebType == "AR Location Tracking") {
                                            if (sceneResponse.sceneLocations[i].eventData != null && sceneResponse.sceneLocations[i].eventData.length > 4 && sceneResponse.sceneLocations[i].eventData.toLowerCase().includes("restrict")) {
                                                locationEntity = "<a-entity id=\x22youAreHere\x22 location_restrict_ar position=\x220 2 -5\x22>"+
                                                    "<a-entity class=\x22gltf\x22 gltf-model=\x22#globe\x22 class=\x22envMap activeObjexRay\x22 position=\x220 -1.5 0\x22>"+
                                                    "</a-entity>"+
                                                "</a-entity>";
                                                locationButton = "<div style=\x22float: right; margin: 10px 10px;\x22 onclick=\x22ShowHideGeoPanel()\x22><i class=\x22fas fa-globe fa-2x\x22></i></div>";
                                            } else {
                                                locationEntity = "<a-entity id=\x22youAreHere\x22 location_init_ar position=\x220 2 -5\x22>"+
                                                    "<a-entity class=\x22gltf\x22 gltf-model=\x22#globe\x22 class=\x22envMap activeObjexRay\x22 position=\x220 -1.5 0\x22>"+
                                                    "</a-entity>"+
                                                "</a-entity>"; 
                                                locationButton = "<div style=\x22float: right; margin: 10px 10px;\x22 onclick=\x22ShowHideGeoPanel()\x22><i class=\x22fas fa-globe fa-2x\x22></i></div>";
                                            }
                                            geoScripts = "<script async src=\x22https://get.geojs.io/v1/ip/geo.js\x22></script><script src=\x22/main/js/geolocator.js\x22></script>";
                                            locationScripts = "<script src=\x22../main/src/component/location-fu.js\x22></script>";
                                            var buff = Buffer.from(JSON.stringify(sceneResponse.sceneLocations[i])).toString("base64");
                                            locationData = "<div id=\x22restrictToLocation\x22 data-location='"+buff+"'></div>";
                                        } else if (sceneResponse.sceneWebType == "Model Viewer") { 
                                            // console.log("sceneResponse.sceneLocations[i].eventData : " + sceneResponse.sceneLocations[i].eventData);
                                            if (sceneResponse.sceneLocations[i].eventData.toLowerCase().includes("restrict")) {
                                            geoScripts = "<script async src=\x22https://get.geojs.io/v1/ip/geo.js\x22></script><script src=\x22/main/js/geolocator.js\x22></script>";
                                            locationScripts = "<script src=\x22../main/src/component/location-fu-noaframe.js\x22></script>";
                                            var buff = Buffer.from(JSON.stringify(sceneResponse.sceneLocations[i])).toString("base64");
                                            locationData = "<div id=\x22restrictToLocation\x22 data-location='"+buff+"'></div>";
                                            }
                                        } else if (sceneResponse.sceneWebType == "Mapbox") { //just location tracking, for any sceneWebType
                                            if (sceneResponse.sceneLocations[i].eventData != null && sceneResponse.sceneLocations[i].eventData.length > 4 && sceneResponse.sceneLocations[i].eventData.toLowerCase().includes("restrict")) {
                                                locationEntity = "<a-entity id=\x22youAreHere\x22 location_restrict position=\x220 2 -5\x22>"+
                                                    "<a-entity class=\x22gltf\x22 gltf-model=\x22#globe\x22 class=\x22envMap activeObjexRay\x22 position=\x220 -1.5 0\x22>"+
                                                    "</a-entity>"+
                                                "</a-entity>";
                                                locationButton = "<div style=\x22float: right; margin: 10px 10px;\x22 onclick=\x22ShowHideGeoPanel()\x22><i class=\x22fas fa-globe fa-2x\x22></i></div>";
                                            } else {
                                                locationEntity = "<a-entity id=\x22youAreHere\x22 location_init position=\x220 2 -5\x22>"+
                                                    "<a-entity class=\x22gltf\x22 gltf-model=\x22#globe\x22 class=\x22envMap activeObjexRay\x22 position=\x220 -1.5 0\x22>"+
                                                    "</a-entity>"+
                                                "</a-entity>"; 
                                                locationButton = "<div style=\x22float: right; margin: 10px 10px;\x22 onclick=\x22ShowHideGeoPanel()\x22><i class=\x22fas fa-globe fa-2x\x22></i></div>";
                                            }
                                        } else {
                                            console.log("tryna set geo loc " + sceneResponse.sceneLocations[i].eventData);
                                            if (sceneResponse.sceneLocations[i].eventData.toLowerCase().includes("restrict")) {
                                                geoScripts = "<script async src=\x22https://get.geojs.io/v1/ip/geo.js\x22></script><script src=\x22/main/js/geolocator.js\x22></script>";
                                                locationScripts = "<script src=\x22../main/src/component/location-fu-noaframe.js\x22></script>";
                                                var buff = Buffer.from(JSON.stringify(sceneResponse.sceneLocations[i])).toString("base64");
                                                locationData = "<div id=\x22restrictToLocation\x22 data-location='"+buff+"'></div>";
                                                }
                                        }
                                        // if (sceneResponse.sceneLocations[i].markerType == "poi") {
                                        //     poiIndex++;
                                        //     // locationPOIs.push(sceneResponse.sceneLocations[i].x + " " + sceneResponse.sceneLocations[i].y + " " + zFix);
                                        //     geoEntities = geoEntities + "<a-entity look-at=\x22#player\x22 shadow=\x22cast:true; receive:true\x22 "+geoEntity+"=\x22latitude: "+sceneResponse.sceneLocations[i].latitude+
                                        //     "; longitude: "+sceneResponse.sceneLocations[i].longitude+";\x22 "+skyboxEnvMap+" class=\x22poi gltf\x22 gltf-model=\x22#poimarker\x22><a-entity scale=\x22.5 .5 .5\x22 position=\x22-.1 .5 0.1\x22 text-geometry=\x22value: "+poiIndex+"\x22></a-entity></a-entity>";
                                        //     console.log("geoEntities: " + geoEntities);
                                        // }
                                    }
                                }
                                if (sceneResponse.sceneLocations[i].type != undefined && sceneResponse.sceneLocations[i].type.toLowerCase() == "geographic") { //set actual locs below
                                    // let id = sceneResponse.sceneLocations[i]._id != undefined ? 
                                    if (sceneResponse.sceneLocations[i].markerType == "poi") {
                                        poiIndex++;
                                        if (sceneResponse.sceneWebType == "AR Location Tracking") {
                                            //TODO jack in models / objs here?
                                            geoEntities = geoEntities + "<a-entity look-at=\x22#player\x22 shadow=\x22cast:true; receive:true\x22 "+geoEntity+"=\x22latitude: "+sceneResponse.sceneLocations[i].latitude+
                                            "; longitude: "+sceneResponse.sceneLocations[i].longitude+";  _id: "+sceneResponse.sceneLocations[i].timestamp+"\x22 "+skyboxEnvMap+" class=\x22gltf poi envMap\x22 gltf-model=\x22#poimarker\x22><a-entity scale=\x22.5 .5 .5\x22 position=\x22-.1 .5 0.1\x22 text-geometry=\x22value: "+poiIndex+"\x22></a-entity></a-entity>";
                                        
                                        } else if (sceneResponse.sceneWebType != "Mapbox") {
                                            geoEntities = geoEntities + "<a-entity look-at=\x22#player\x22 shadow=\x22cast:true; receive:true\x22 "+geoEntity+"=\x22latitude: "+sceneResponse.sceneLocations[i].latitude+
                                            "; longitude: "+sceneResponse.sceneLocations[i].longitude+";  _id: "+sceneResponse.sceneLocations[i].timestamp+"\x22 "+skyboxEnvMap+" class=\x22gltf poi envMap\x22 gltf-model=\x22#poimarker\x22><a-entity scale=\x22.5 .5 .5\x22 position=\x22-.1 .5 0.1\x22 text-geometry=\x22value: "+poiIndex+"\x22></a-entity></a-entity>";
                                            // console.log(geoEntities);
                                        } else {
                                            //for mapbox just using aframe to pass data
                                            geoEntities = geoEntities + "<a-entity class=\x22geo poi\x22 "+geoEntity+"=\x22latitude: "+sceneResponse.sceneLocations[i].latitude+ 
                                            "; longitude: "+sceneResponse.sceneLocations[i].longitude+"; _id: "+sceneResponse.sceneLocations[i].timestamp+"\x22></a-entity>";
                                            // console.log("mapbox geoEntities: " + geoEntities);
                                        }
                                    } else {
                                        if (sceneResponse.sceneLocations[i].modelID != null) {
                                            console.log("gotsa modelID at a geographic location " + sceneResponse.sceneLocations[i].modelID );
                                            geoEntities = geoEntities + "<a-entity class=\x22geo\x22 "+geoEntity+"=\x22latitude: "+sceneResponse.sceneLocations[i].latitude+ 
                                            "; longitude: "+sceneResponse.sceneLocations[i].longitude+"; _id: "+sceneResponse.sceneLocations[i].timestamp+"\x22></a-entity>";
                                        } else {
                                            console.log("modelID is null at this location"); 
                                        }
                                    }
                                }
                                // let zFix = parseFloat(sceneResponse.sceneLocations[i].z) * -1; //nevermind? fix rots in Unity or whatever
                                let zFix = parseFloat(sceneResponse.sceneLocations[i].z); //does nothing    
                                // console.log("loc with model? " + JSON.stringify(sceneResponse.sceneLocations[i]));
                                //REM THIS?
                                // if (sceneResponse.sceneLocations[i].markerType == "gltf" || sceneResponse.sceneLocations[i].gltf != null) { //old way, deprecated but still in use...//?
                                    
                                //     sceneGLTFLocations.push(sceneResponse.sceneLocations[i]);
                                //     if (sceneResponse.sceneLocations[i].eventData != null && sceneResponse.sceneLocations[i].eventData.length > 4) {
                                //         animationComponent = "<script src=\x22https://unpkg.com/aframe-animation-component@5.1.2/dist/aframe-animation-component.min.js\x22></script>"; //unused!  NEEDS FIXING - this component could be added more than once
                                //     }
                                // }

                                if (sceneResponse.sceneLocations[i].objectID != undefined && sceneResponse.sceneLocations[i].objectID != "none" && sceneResponse.sceneLocations[i].objectID.length > 8) { //attaching object to location 
                                    // console.log("pushinbg object locaition " + sceneResponse.sceneLocations[i]);
                                    sceneObjectLocations.push(sceneResponse.sceneLocations[i]);
                                    
                                }
                                if (sceneResponse.sceneLocations[i].model != undefined && sceneResponse.sceneLocations[i].model != "none" && sceneResponse.sceneLocations[i].model.length > 0) { //new way of attaching gltf to location w/out object
                                    // console.log("pushinbg model locaition " + sceneResponse.sceneLocations[i]);
                                    sceneModelLocations.push(sceneResponse.sceneLocations[i]);
                                    if (sceneResponse.sceneLocations[i].eventData != null && sceneResponse.sceneLocations[i].eventData.length > 4) {
                                        animationComponent = "<script src=\x22https://unpkg.com/aframe-animation-component@5.1.2/dist/aframe-animation-component.min.js\x22></script>"; //unused !NEEDS FIXING - this component could be added more than once
                                    }
                                }
                                if (sceneResponse.sceneLocations[i].markerType != undefined && sceneResponse.sceneLocations[i].type.toLowerCase() != 'geographic') {
                                    if (sceneResponse.sceneLocations[i].markerType.toLowerCase() == "placeholder" 
                                        || sceneResponse.sceneLocations[i].markerType.toLowerCase().includes("trigger") 
                                        || sceneResponse.sceneLocations[i].markerType.toLowerCase() == "poi" 
                                        || sceneResponse.sceneLocations[i].markerType.toLowerCase() == "gate"
                                        || sceneResponse.sceneLocations[i].markerType.toLowerCase() == "portal"  
                                        || sceneResponse.sceneLocations[i].markerType.toLowerCase() == "mailbox") {
                                    //    locationPlaceholders.push(sceneResponse.sceneLocations[i].x + " " + sceneResponse.sceneLocations[i].y + " " + zFix);
                                        let tLoc = sceneResponse.sceneLocations[i];
                                        tLoc.phID = sceneResponse.short_id+"~cloudmarker~"+sceneResponse.sceneLocations[i].timestamp;
                                        // console.log("TRYNA SET PLACEHOLDER LOCATION : " + JSON.stringify(tLoc) );
                                        // sceneResponse.sceneLocations[i].phID = 
                                        locationPlaceholders.push(tLoc);
                                    }

                                }
                                if (sceneResponse.sceneLocations[i].markerType == "player") {
                                    let yFix = sceneResponse.sceneLocations[i].y;
                                    // if (sceneResponse.sceneWebXREnvironment != null && sceneResponse.sceneWebXREnvironment != "none" && sceneResponse.sceneWebXREnvironment != "") {
                                    //     yFix = 0;
                                    //     playerPosition = sceneResponse.sceneLocations[i].x + " " + yFix + " " + zFix;
                                    //     console.log("player sceneWebXREnvironment position: " + playerPosition);
                                    // } else if (sceneResponse.sceneGroundLevel != null && sceneResponse.sceneGroundLevel != undefined && sceneResponse.sceneGroundLevel != 0 && sceneResponse.sceneGroundLevel != "0") {
                                    //     yFix = sceneResponse.sceneGroundLevel;
                                    //     playerPosition = sceneResponse.sceneLocations[i].x + " " + yFix + " " + zFix;
                                    //     console.log("player position: " + playerPosition);
                                    // } else {
                                        playerPosition = sceneResponse.sceneLocations[i].x + " " +  sceneResponse.sceneLocations[i].y + " " +  sceneResponse.sceneLocations[i].z;
                                    // }
                                }
                                if (sceneResponse.sceneLocations[i].markerType == "text") {
                                    textLocation = sceneResponse.sceneLocations[i].x + " " + sceneResponse.sceneLocations[i].y + " " + zFix; //TODO - these must all be arrays, like sceneModelLocations above!
                                }
                                if (sceneResponse.sceneLocations[i].markerType == "video") {
                                    hlsScript = "<script src=\x22../main/js/hls.min.js\x22></script>";//v 1.0.6 
                                    videoLocation = sceneResponse.sceneLocations[i].x + " " + sceneResponse.sceneLocations[i].y + " " + zFix;
                                    if (sceneResponse.sceneLocations[i].eulerx != undefined && sceneResponse.sceneLocations[i].eulerx != undefined && sceneResponse.sceneLocations[i].eulerx != undefined) {
                                        videoRotation = sceneResponse.sceneLocations[i].eulerx + " " + sceneResponse.sceneLocations[i].eulery + " " + sceneResponse.sceneLocations[i].eulerz;
                                        console.log("videoRotation "+ videoRotation);
                                    }
                                    
                                    
                                    if (sceneResponse.sceneLocations[i].eventData != null && sceneResponse.sceneLocations[i].eventData.length > 4) {
                                        if (sceneResponse.sceneLocations[i].eventData.includes("target")) {
                                            //restrict to this geo
                                            console.log("tryna attach video to target!");
                                            videoParent = "parent-to=\x22tracking: target\x22";
                                        }
                                        if (sceneResponse.sceneLocations[i].eventData.includes("marker")) {
                                            //restrict to this geo
                                            console.log("tryna attach video to marker!");
                                            videoParent = "parent-to=\x22tracking: marker\x22";
                                        }
                                        if (sceneResponse.sceneLocations[i].eventData.includes("image")) {
                                            //restrict to this geo
                                            console.log("tryna attach video to image target!");
                                            videoParent = "parent-to=\x22tracking: image\x22";
                                        }
                                        if (sceneResponse.sceneLocations[i].eventData.includes("fixed")) { //by default it's billboarding
                                            //restrict to this geo
                                            // console.log("tryna attach video to image target!");
                                            videoParent = "";
                                        }
                                    }
                                }
                                if (sceneResponse.sceneLocations[i].markerType == "youtube") {
                                    videoLocation = sceneResponse.sceneLocations[i].x + " " + sceneResponse.sceneLocations[i].y + " " + zFix;
                                    if (sceneResponse.sceneLocations[i].eulerx != undefined && sceneResponse.sceneLocations[i].eulerx != undefined && sceneResponse.sceneLocations[i].eulerx != undefined) {
                                        videoRotation = sceneResponse.sceneLocations[i].eulerx + " " + sceneResponse.sceneLocations[i].eulery + " " + sceneResponse.sceneLocations[i].eulerz;
                                        // console.log("yotube rotation "+ videoRotation);
                                    }
                                    
                                    if (youtubes.length > 0) {
                                        containers = containers + "<div class=\x22youtube\x22 id=\x22"+sceneResponse.sceneLocations[i].eventData+"\x22 data-location-id=\x22"+sceneResponse.sceneLocations[i].id+"\x22 data-attribute=\x22"+youtubes[0].toString()+"\x22></div>"; 
                                        // youtubes.splice(0, 1);
                                    }
    
                                }
                                if (sceneResponse.sceneLocations[i].markerType == "car") {
                                    carLocation = sceneResponse.sceneLocations[i].x + " " + sceneResponse.sceneLocations[i].y + " " + zFix;
                                }
                                if (sceneResponse.sceneLocations[i].markerType != undefined && sceneResponse.sceneLocations[i].markerType.toLowerCase().includes('picture')) {
                                    pictureLocation = sceneResponse.sceneLocations[i].x + " " + sceneResponse.sceneLocations[i].y + " " + zFix;
                                }
                                if (sceneResponse.sceneLocations[i].markerType == "picturegroup") {
                                    
                                    picturegroupLocation = sceneResponse.sceneLocations[i].x + " " + sceneResponse.sceneLocations[i].y + " " + zFix;
                                    console.log("gotsa picture geroup " + picturegroupLocation);
                                }
                                if (sceneResponse.sceneLocations[i].markerType == "key") {
                                    
                                    scenesKeyLocation = sceneResponse.sceneLocations[i].x + " " + sceneResponse.sceneLocations[i].y + " " + zFix;
                                    console.log("gotsa sceneKye loc " + scenesKeyLocation);
                                }
                                if (sceneResponse.sceneLocations[i].markerType == "audio") {
                                    audioLocation = sceneResponse.sceneLocations[i].x + " " + sceneResponse.sceneLocations[i].y + " " + zFix;
                                    if (sceneResponse.sceneWebType == "ThreeJS") {
                                        audioLocation = sceneResponse.sceneLocations[i].x + ", " + sceneResponse.sceneLocations[i].y + ", " + zFix;
                                    }
                                }
                                if (sceneResponse.sceneLocations[i].markerType == "link") {
                                    // console.log("pushing link location " + JSON.stringify(sceneResponse.sceneLocations[i]));
                                    let weblinkLocation = {};
                                    weblinkLocation = sceneResponse.sceneLocations[i];
                                    weblinkLocation.loc = sceneResponse.sceneLocations[i].x + " " + sceneResponse.sceneLocations[i].y + " " + zFix;
                                    weblinkLocation.data = sceneResponse.sceneLocations[i].eventData;
                                    sceneWeblinkLocations.push(weblinkLocation);

                                }
                                if (sceneResponse.sceneLocations[i].markerType == "callout" && sceneResponse.sceneLocations[i].eventData != undefined ) {
                                    let calloutLocation = {};
                                    calloutLocation.loc = sceneResponse.sceneLocations[i].x + " " + sceneResponse.sceneLocations[i].y + " " + zFix;
                                    calloutLocation.data = sceneResponse.sceneLocations[i].eventData;
                                    locationCallouts.push(calloutLocation);
                                }
                                if (sceneResponse.sceneLocations[i].markerType == "light" && sceneResponse.sceneLocations[i].eventData != undefined) {
                                    let lightLocation = {};
                                    lightLocation.loc = sceneResponse.sceneLocations[i].x + " " + sceneResponse.sceneLocations[i].y + " " + zFix;
                                    lightLocation.data = sceneResponse.sceneLocations[i].eventData;
                                    locationLights.push(lightLocation);
                                }
                                if (sceneResponse.sceneLocations[i].markerType == "particles" && sceneResponse.sceneLocations[i].eventData != undefined) {
                                    let particleLocation = {};
                                    particleLocation.loc = sceneResponse.sceneLocations[i].x + " " + sceneResponse.sceneLocations[i].y + " " + zFix;
                                    particleLocation.data = sceneResponse.sceneLocations[i].eventData;
                                    particleLocations.push(particleLocation);
                                }
                                if (sceneResponse.sceneLocations[i].markerType != undefined && sceneResponse.sceneLocations[i].markerType.includes("picture")) { 
                                    
                                    let pictureLocation = {};
                                    pictureLocation.loc = sceneResponse.sceneLocations[i].x + " " + sceneResponse.sceneLocations[i].y + " " + zFix;
                                    let eulerx = sceneResponse.sceneLocations[i].eulerx != null ? sceneResponse.sceneLocations[i].eulerx : 0;
                                    let eulery = sceneResponse.sceneLocations[i].eulery != null ? sceneResponse.sceneLocations[i].eulery : 0;
                                    let eulerz = sceneResponse.sceneLocations[i].eulerz != null ? sceneResponse.sceneLocations[i].eulerz : 0;
                                    pictureLocation.rot = eulerx + " " + eulery + " " + eulerz;
                                    pictureLocation.type = sceneResponse.sceneLocations[i].markerType;
                                    pictureLocation.data = sceneResponse.sceneLocations[i].eventData; //should be the pic _id
                                    console.log("pictureLocation: " + JSON.stringify(pictureLocation));
                                    locationPictures.push(pictureLocation);
                                }
                                if (sceneResponse.sceneLocations[i].markerType == "curve point") {
                                    let curvePoint = {};
                                    curvePoint.loc = sceneResponse.sceneLocations[i].x + " " + sceneResponse.sceneLocations[i].y + " " + zFix;
                                    curvePoint.data = sceneResponse.sceneLocations[i].eventData;
                                    curvePoints.push(curvePoint);
                                }

                            }
                            // loadLocations = "ready(function(){\n" +
                            // "let locDataEntity = document.getElementById(\x22locationData\x22);\n"+
                            // "locDataEntity.setAttribute(\x22locationdata\x22, \x22locData\x22, "+JSON.stringify(JSON.stringify(sceneResponse.sceneLocations))+");\n"+ //ugh
                            // "});";
                            var buff = Buffer.from(JSON.stringify(sceneResponse.sceneLocations)).toString("base64");
                            loadLocations = "<a-entity location_data id=\x22locationData\x22 data-locations='"+buff+"'></a-entity>";
                            //SET CAMERA VAR BELOW, DEPENDING ON SCENETYPE

                        } if (sceneData.sceneWebType == 'Camera Background') {
                            sceneBackground = " background=\x22transparent: true\x22 ";
                            

                            ARScript = "<script src=\x22/main/ref/aframe/dist/aframe-ar.js\x22></script>";
                            ARSceneArg = "arjs=\x22sourceType: webcam\x22";   
                            
                            // camera = "<a-entity cursor raycaster=\x22far: 20; interval: 1000; objects: .activeObjexRay\x22></a-entity>" +
                            // "<a-entity camera></a-entity>";
                            camera = "<a-entity id=\x22cameraRig\x22 initializer position=\x22"+playerPosition+"\x22>"+
                            "<a-entity id=\x22mouseCursor\x22 cursor=\x22rayOrigin: mouse\x22 raycaster=\x22objects: .activeObjexRay\x22></a-entity>"+
                            // "<a-entity id=\x22player\x22 get_pos_rot networked=\x22template:#avatar-template;attachTemplateToLocal:false;\x22 "+spawnInCircle+" camera "+wasd+" look-controls=\x22hmdEnabled: false\x22 position=\x220 1.6 0\x22>" +     
                            "<a-entity id=\x22player\x22 get_pos_rot=\x22init: true;\x22 camera "+wasd+" look-controls=\x22hmdEnabled: false\x22 position=\x220 1.6 0\x22>" +     
                            "</a-entity>"+
                            // "<a-entity networked=\x22template:#hand-template\x22 "+blink_controls+" oculus-touch-controls=\x22hand: left\x22 laser-controls=\x22hand: left;\x22 handModelStyle: lowPoly; color: #ffcccc\x22 raycaster=\x22objects: .activeObjexRay;\x22></a-entity>" +
                            // "<a-entity networked=\x22template:#hand-template\x22 oculus-touch-controls=\x22hand: right\x22 id=\x22right-hand\x22 hand-controls=\x22hand: right; handModelStyle: lowPoly; color: #ffcccc\x22 aabb-collider=\x22objects: .activeObjexGrab;\x22 grab></a-entity>"+
                            "</a-entity>";

                        } else if (sceneData.sceneWebType == 'AR Image Tracking') { //not really, set below...
                            
                           
                            ARScript = "<script src=\x22./main/src/util/mindar/mindar-image.js\x22></script> <script src=\x22./main/src/util/mindar/mindar-image-aframe.js\x22></script>";
                            ARSceneArg = "mindar-image=\x22imageTargetSrc: "+arImageTargets[0]+";\x22 embedded color-space=\x22sRGB\x22"+
                                " renderer=\x22colorManagement: true, physicallyCorrectLights\x22 vr-mode-ui=\x22enabled: false\x22 device-orientation-permission-ui=\x22enabled: false\x22";
                            camera = "<a-entity mindar-image-target=\x22targetIndex: 0\x22>" +
                            "<a-gltf-model rotation=\x2290 0 0\x22 position=\x220 0 0.1\x22 scale=\x220.25 0.25 0.25\x22 src=\x22#gltfAsset1\x22>"+
                            "</a-entity>";
                          
                        } else if (sceneData.sceneWebType == 'AR Location Tracking') {
                            // ARScript = "<script src=\x22/main/js/geolocator.js\x22></script><script src=\x22/main/ref/aframe/dist/aframe-ar.js\x22></script>";
                            geoScripts = "<script async src=\x22https://get.geojs.io/v1/ip/geo.js\x22></script><script src=\x22/main/js/geolocator.js\x22></script>";
                            // ARScript = "<script src=\x22/main/ref/aframe/dist/aframe-ar.js\x22></script>";
                            ARScript = "<script src=\x22https://raw.githack.com/MediaComem/LBAR.js/main/dist/lbar-v0.2.min.js\x22></script>";

                            locationScripts = "<script src=\x22../main/src/component/location-fu.js\x22></script>";
                            // locationScripts = "<script>window.onload = () => { navigator.geolocation.getCurrentPosition((position) => {"+ //put this where?
                            // "document.querySelector('a-text').setAttribute('"+geoEntity+"', `latitude: ${position.coords.latitude}; longitude: ${position.coords.longitude};`)});}</script>";
                            ARSceneArg = "gps-position webxr=\x22referenceSpaceType: unbounded; requiredFeatures: unbounded;\x22 vr-mode-ui=\x22enabled: false\x22 arjs=\x22sourceType: webcam; debugUIEnabled: false;\x22";
                           
                            camera = "<a-entity id=\x22player\x22 position=\x220 0 0\x22 camera pitch-roll-look-controls>"+ 
                                "<a-entity class=\x22hiddenPlaceholders\x22 id=\x22equipPlaceholder\x22 geometry=\x22primitive: plane; height: 0.01; width: .01\x22 position=\x220 -.5 -.65\x22"+ //these seemed to need actual geometry to get a worldspace loc
                                "material=\x22opacity: 0\x22></a-entity>"+
                                "<a-entity class=\x22hiddenPlaceholders\x22 id=\x22viewportPlaceholder\x22 geometry=\x22primitive: plane; height: 0.01; width: .01\x22 position=\x220 0 -1\x22"+
                                "material=\x22opacity: 0\x22></a-entity>"+
                                "<a-entity class=\x22hiddenPlaceholders\x22 id=\x22viewportPlaceholder3\x22 geometry=\x22primitive: plane; height: 0.01; width: .01\x22 position=\x220 0 -3\x22"+
                                "material=\x22opacity: 0\x22></a-entity>"+
                            "</a-entity>";
                                    
                            locationEntity = "<a-entity id=\x22youAreHere\x22 location_init_ar position=\x220 2 -5\x22>"+
                                "<a-entity class=\x22gltf\x22 gltf-model=\x22#globe\x22 class=\x22envMap activeObjexRay\x22 position=\x220 -1.5 0\x22>"+
                                "</a-entity>"+
                            "</a-entity>";
                            locationButton = "<div style=\x22float: right; margin: 10px 10px;\x22 onclick=\x22ShowHideGeoPanel()\x22><i class=\x22fas fa-globe fa-2x\x22></i></div>";
                                        
                            } else if (sceneData.sceneWebType == 'Mapbox') { 
                               
                                dialogButton = "<div class=\x22dialog_button\x22 style=\x22float: left; margin: 10px 10px; width: 50px; height: 50px\x22 onclick=\x22SceneManglerModal('Welcome')\x22><i class=\x22fas fa-info-circle fa-2x\x22></i></div>";
                                locationButton = "<div id=\x22loc_button\x22 class=\x22dialog_button\x22 style=\x22float: left; margin: 10px 10px; width: 50px; height: 50px\x22 onclick=\x22ShowHideGeoPanel()\x22><i class=\x22fas fa-globe fa-2x\x22></i></div>";
                                if (!sceneData.sceneTextUseModals) {
                                    //renderPanel = "<a-entity visible=\x22false\x22 render_canvas id=\x22renderCanvas\x22 look-at=\x22#player\x22 geometry=\x22primitive: plane; width:1; height:1;\x22 scale=\x221 1 1\x22 position=\x220 3.5 -.25\x22 material=\x22shader: html; transparent: true; width:1024; height:1024; fps: 10; target: #renderPanel;\x22></a-entity>\n";
                                }
                                transportButtons = "<div class=\x22transport_buttons\x22><div class=\x22previous_button\x22 style=\x22float: left; margin: 10px 10px;\x22 onclick=\x22PreviousButton()\x22><i class=\x22fas fa-step-backward fa-2x\x22></i></div>"+
                                "<div class=\x22play_button\x22 style=\x22float: left; margin: 10px 10px;\x22 onclick=\x22TransportPlayButton()\x22><i class=\x22fas fa-play-circle fa-2x\x22></i></div>" +
                                // "<div visible=\x22false\x22 class=\x22pause_button\x22 style=\x22float: left; margin: 10px 10px;\x22 onclick=\x22PauseButton()\x22><i class=\x22fas fa-pause-circle fa-2x\x22></i></div>" +
                                // "<div class=\x22next_button\x22 style=\x22float: left; margin: 10px 10px;\x22 onclick=\x22ShowHideDialogPanel('default')\x22><i class=\x22fas fa-step-forward fa-2x\x22></i></div>" +
                                "<div class=\x22next_button\x22 style=\x22float: left; margin: 10px 10px;\x22 onclick=\x22NextButton()\x22><i class=\x22fas fa-step-forward fa-2x\x22></i></div></div>";
                                geoScripts = "<script async src=\x22https://get.geojs.io/v1/ip/geo.js\x22></script><script src=\x22/main/js/geolocator.js\x22></script>" +
                             
                                "<script src=\x22https://api.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl.js\x22></script>"+
                                "<link href=\x22https://api.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl.css\x22 rel=\x22stylesheet\x22/>";

                                locationScripts = "<script src=\x22../main/src/component/location-fu.js\x22></script>";
                               
                                camera = "<a-camera id=\x22player\x22 look-controls-enabled=\x22false\x22 listen-from-camera gps-camera rotation-reader><a-entity id=\x22mouseCursor\x22 cursor=\x22rayOrigin: mouse\x22 raycaster=\x22objects: .activeObjexRay\x22></a-entity>"+
                                // "<a-entity id=\x22player\x22 networked=\x22template:#avatar-template;attachTemplateToLocal:false;\x22 spawn-in-circle=\x22radius:3;\x22>" + //ENABLE LATER
                                        "</a-camera>";
                                let doBuildings = false;
                                let doTerrain = false;        
                                if (sceneData.sceneTags!= null && sceneData.sceneTags.includes("buildings")) {
                                    doBuildings = true;
                                } 
                                if (sceneData.sceneTags!= null && sceneData.sceneTags.includes("terrain")) {
                                    doTerrain = true;
                                }
                                locationEntity = "<a-entity id=\x22youAreHere\x22 location_init_mapbox=\x22zoomLevel: "+sceneData.sceneMapZoom+"; doBuildings: "+doBuildings+"; doTerrain: "+doTerrain+"; mbid: "+process.env.MAPBOX_KEY+";\x22 position=\x220 2 -5\x22>"+
                                    // "<a-entity class=\x22gltf\x22 gltf-model=\x22#globe\x22 class=\x22envMap activeObjexRay\x22 position=\x220 -1.5 0\x22>"+
                                    // "</a-entity>"+
                                "</a-entity>";
                            
                                mapButtons = "<div id=\x22button_left_1\x22 style=\x22float: left; margin: 10px 10px;\x22 class=\x22\x22 onclick=\x22ToggleDragPan()\x22><i class=\x22fas fa-level-down-alt fa-2x\x22></i></div>"+
                                "<div id=\x22button_left_2\x22 class=\x22\x22 style=\x22float: left; margin: 10px 10px;\x22 onclick=\x22ZoomOut()\x22 class=\x22tooltip\x22><i class=\x22fas fa-search-minus  fa-2x\x22></i><span class=\x22tooltiptext\x22></span></div>"+
                                "<div id=\x22button_left_3\x22 class=\x22\x22 style=\x22float: left; margin: 10px 10px;\x22 onclick=\x22ZoomIn()\x22 class=\x22tooltip\x22><i class=\x22fas fa-search-plus fa-2x\x22></i><span class=\x22tooltiptext\x22></span></div>" +
                                "<div id=\x22button_left_4\x22 class=\x22\x22 style=\x22float: left; margin: 10px 10px;\x22 onclick=\x22RotateCamera(0)\x22 class=\x22tooltip\x22><i class=\x22fas fa-sync-alt fa-2x\x22></i><span class=\x22tooltiptext\x22></span></div>";
                                
                                // "<div class=\x22location_buttons_left\x22 onclick=\x22ShareLocation()\x22 class=\x22tooltip\x22><i class=\x22fas fa-map-marked-alt fa-2x\x22></i><span class=\x22tooltiptext\x22>Share Location</span></div>";
                                mapStyleSelector = "<div id=\x22button_left_5\x22 class=\x22\x22>" +   
                                    "<select id=\x22mapStyle\x22>" +
                                        "<option value=\x22\x22 selected>Select Map Style:</option>" +
                                            "<option>Satellite</option>" +
                                            "<option>Terrain</option>" +
                                            "<option>Dark</option>" +
                                            "<option>Light</option>" +
                                    "</select>" +
                                "</div>";
                                // mapButtons = mapZoomers + mapStyleSelector;// + "<div class=\x22location_button\x22 style=\x22float: right; margin: 10px 10px;\x22 onclick=\x22ShowHideGeoPanel()\x22><i class=\x22fas fa-globe fa-2x\x22></i></div>";
                                

                                            
                            } else { //"sceneWebType == "Default or AFrame"
                                
                                joystickContainer = "<div id=\x22joystickContainer\x22 class=\x22JoystickRegionUI\x22 style=\x22z-index: 100; visibility: hidden\x22>" + //initialized in navigation / content-utils
                                "<div class=\x22JoystickButtonUI\x22 style=\x22width: 128px; opacity:0.50;\x22>" +
                                    "<img src=\x22/css/joystick-base.png\x22/>" +
                                    "<div id=\x22joystickEl\x22 style=\x22position: absolute; left:32px; top:32px;\x22>" +
                                    "<img src=\x22/css/joystick-red.png\x22/>" +
                                    "</div>" +
                                    "</div>" +
                                "</div>";
                                let movementControls = ""; //aframe extras, can constrain to navmesh 
                                wasd = "extended-wasd-controls=\x22flyEnabled: false; moveSpeed: 5; inputType: keyboard\x22";
                                // joystickScript = "<script src=\x22../main/vendor/aframe/joystick.js\x22></script>";
                                let physicsMod = "";
                                // if (!useNavmesh && !useSimpleNavmesh) { //simplenavmesh uses raycast, no pathfinding but constraint works!
                                //     // wasd = "wasd-controls=\x22fly: false; acceleration: 35\x22";
                                //     // movementControls = "movement-controls=\x22control: keyboard, gamepad, \x22";
                                // } else {
                                // if (useSimpleNavmesh) {
                                //     //simple navmesh can use 
                                //     wasd = "extended-wasd-controls=\x22fly: false; moveSpeed: 5; inputType: keyboard\x22 simple-navmesh-constraint=\x22navmesh:#navmesh-el;fall:10; height:.1;\x22";
                                    
                                // } 
                                // else {
                                //     movementControls = "movement-controls=\x22constrainToNavMesh: true; control: keyboard, gamepad, touch; fly: false;\x22"; 
                                //     wasd = "";
                                //     aframeExtrasScript = "<script src=\x22..//main/vendor/aframe/aframe-extras_20210520.js\x22></script>";
                                // }
                                    // joystickScript = "";
                                // }
                                if (physicsScripts.length > 0) {
                                  
                                    physicsMod = "geometry=\x22primitive: cylinder; height: 2; radius: 0.5;\x22 ammo-body=\x22type: kinematic;\x22 ammo-shape=\x22type: capsule\x22";
                                   
                                }
                                 if (physicsScripts.length > 0 && useNavmesh) {
                                    movementControls = "movement-controls=\x22constrainToNavMesh: true; control: keyboard, gamepad, touch; fly: false;\x22";
                                    wasd = "";
                                    physicsMod = "geometry=\x22primitive: cylinder; height: 2; radius: 0.5;\x22 ammo-body=\x22type: kinematic;\x22 ammo-shape=\x22type: capsule\x22";
                                    aframeExtrasScript = "<script src=\x22..//main/vendor/aframe/aframe-extras_20210520.js\x22></script>";
                                    // joystickScript = "";
                                }
                               
                                transportButtons = "<div class=\x22transport_buttons\x22>"+
                                "<div id=\x22transportStats\x22 style=\x22color: rgba(255, 255, 255, 0.75); float: right; margin: 5px 5px; text-align: left\x22></div>"+
                                "<div class=\x22next_button\x22 style=\x22color: rgba(255, 255, 255, 0.75); float: right; margin: 5px 5px;\x22 onclick=\x22NextButton()\x22><i class=\x22fas fa-step-forward fa-2x\x22></i></div>"+
                                "<div class=\x22ffwd_button\x22 style=\x22color: rgba(255, 255, 255, 0.75); float: right; margin: 5px 5px;\x22 onclick=\x22FastForwardButton()\x22><i class=\x22fas fa-forward fa-2x\x22></i></div>"+
                                "<div class=\x22play_button\x22 id=\x22transportPlayButton\x22 style=\x22color: rgba(255, 255, 255, 0.75); float: right; margin: 5px 5px;\x22 onclick=\x22TransportPlayButton()\x22><i class=\x22fas fa-play-circle fa-2x\x22></i></div>" +
                                "<div class=\x22rewind_button\x22 style=\x22color: rgba(255, 255, 255, 0.75); float: right; margin: 5px 5px;\x22 onclick=\x22RewindButton()\x22><i class=\x22fas fa-backward fa-2x\x22></i></div>"+
                                "<div class=\x22previous_button\x22 style=\x22color: rgba(255, 255, 255, 0.75); float: right; margin: 5px 5px;\x22 onclick=\x22PreviousButton()\x22><i class=\x22fas fa-step-backward fa-2x\x22></i></div></div>";                                

                                transportButtonsWithSlider = "<div class=\x22transport_buttons\x22><div class=\x22sslidecontainer\x22><input type=\x22range\x22 min=\x221\x22 max=\x22100\x22 value=\x221\x22 class=\x22sslider\x22 id=\x22mainTransportSlider\x22>"+
                                "</div><div id=\x22transportStats\x22 style=\x22color: rgba(255, 255, 255, 0.75); float: left; margin: 5px 5px; text-align: left\x22></div>"+
                                "<div class=\x22next_button\x22 style=\x22color: rgba(255, 255, 255, 0.75); float: right; margin: 5px 5px;\x22 onclick=\x22NextButton()\x22><i class=\x22fas fa-step-forward fa-2x\x22></i></div>"+
                                "<div class=\x22ffwd_button\x22 style=\x22color: rgba(255, 255, 255, 0.75); float: right; margin: 5px 5px;\x22 onclick=\x22FastForwardButton()\x22><i class=\x22fas fa-forward fa-2x\x22></i></div>"+
                                "<div class=\x22play_button\x22 id=\x22transportPlayButton\x22 style=\x22color: rgba(255, 255, 255, 0.75); float: right; margin: 5px 5px;\x22 onclick=\x22TransportPlayButton()\x22><i class=\x22fas fa-play-circle fa-2x\x22></i></div>" +
                                "<div class=\x22rewind_button\x22 style=\x22color: rgba(255, 255, 255, 0.75); float: right; margin: 5px 5px;\x22 onclick=\x22RewindButton()\x22><i class=\x22fas fa-backward fa-2x\x22></i></div>"+
                                "<div class=\x22previous_button\x22 style=\x22color: rgba(255, 255, 255, 0.75); float: right; margin: 5px 5px;\x22 onclick=\x22PreviousButton()\x22><i class=\x22fas fa-step-backward fa-2x\x22></i></div></div>";
                                
                                dialogButton = "<div class=\x22dialog_button\x22 style=\x22color: rgba(255, 255, 255, 0.75); float: left; margin: 10px 10px;\x22 onclick=\x22SceneManglerModal('Welcome')\x22><i class=\x22fas fa-info-circle fa-2x\x22></i></div>";
                               
                                sceneManglerButtons = "<div class=\x22show-ui-button\x22 onclick=\x22ShowHideUI()\x22><i class=\x22far fa-eye fa-2x\x22></i></div>";
                                if (!sceneResponse.sceneTextUseModals) {
                                   // renderPanel = "<a-entity visible=\x22false\x22 render_canvas id=\x22renderCanvas\x22 look-at=\x22#player\x22 geometry=\x22primitive: plane; width:1; height:1;\x22 scale=\x221 1 1\x22 position=\x220 3.5 -.25\x22 material=\x22shader: html; transparent: true; width:1024; height:1024; fps: 10; target: #renderPanel;\x22></a-entity>\n";
                                }
                                if (sceneResponse.sceneFlyable) {
                                    wasd = "extended-wasd-controls=\x22flyEnabled: true; moveSpeed: 4; inputType: keyboard\x22";
                                }
                                // if (useNavmesh) {
                                //     // "wasd-controls=\x22fly: false; acceleration: 35\x22";
                                // }
                                if (sceneResponse.sceneCameraMode == "Orbit") {
                                    joystickScript = "<script src=\x22../main/vendor/aframe/aframe-orbit-controls.min.js\x22></script>";
                                    wasd = "orbit-controls=\x22target: 0 1.6 -.5; minDistance: .5; maxDistance: 100; initialPosition: 0 1 3; enableDamping: true;\x22";
                                }
                                if (sceneResponse.sceneCameraMode == "Fixed") {
                                    joystickScript = "";
                                    joystickContainer = "";
                                    wasd = "";
                                }
                              
                                
                                let spawnInCircle = "";
                                if (sceneResponse.sceneNetworking != "None") {
                                    spawnInCircle = "spawn-in-circle=\x22radius:3;\x22";
                                }

                                //AFRAME CAMERA
                                let blinkMod = "blink-controls=\x22cameraRig: #cameraRig\x22";
                                if (useSimpleNavmesh) {
                                    blinkMod = "blink-controls=\x22cameraRig: #cameraRig; collisionEntities: #navmesh-el;\x22"; //only one navmesh for now
                                }
                                if (useSimpleNavmesh) {
                                    //simple navmesh can use 
                                    wasd = "extended-wasd-controls=\x22fly: false; moveSpeed: "+sceneResponse.scenePlayer.playerSpeed+"; inputType: keyboard\x22 simple-navmesh-constraint=\x22navmesh:#navmesh-el;fall:10; height:"+sceneResponse.scenePlayer.playerHeight+"\x22";
                                    // wasd = "wasd-controls=\x22fly: true; acceleration: 35\x22 ";
                                    
                                } 
                                // let follower = "";
                                if (sceneResponse.sceneCameraMode != undefined && sceneResponse.sceneCameraMode.toLowerCase().includes("third person")) {
                                    // wasd = "wasd-controls=\x22fly: true; acceleration: "+sceneResponse.scenePlayer.playerSpeed+"\x22 simple-navmesh-constraint=\x22navmesh:#navmesh-el;fall:10; height:0;\x22";
                                    // wasd = "extended-wasd-controls=\x22flyEnabled: false; moveSpeed: 4; inputType: keyboard\x22";
                                    wasd = "extended-wasd-controls-thirdperson=\x22fly: false; moveSpeed: "+sceneResponse.scenePlayer.playerSpeed+"; inputType: keyboard\x22 simple-navmesh-constraint=\x22navmesh:#navmesh-el;fall:10; height: 0\x22";
                                    camera = "<a-entity look-controls follow-camera=\x22target: #player\x22>" +
                                        "<a-entity camera position=\x220 1.6 5\x22 ></a-entity>" +
                                    "</a-entity>"+
                                    "<a-entity id=\x22cameraRig\x22 initializer "+
                                
                                        " id=\x22mouseCursor\x22 cursor=\x22rayOrigin: mouse\x22 raycaster=\x22objects: .activeObjexRay\x22>"+
                                        
                                       
                                        "<a-entity id=\x22player\x22 "+wasd+" "+ physicsMod +" position=\x22"+playerPosition+"\x22>"+
                                            "<a-entity id=\x22equipPlaceholder\x22 geometry=\x22primitive: box; height: .1; width: .1; depth: .1\x22 position=\x220 -.65 -.75\x22"+
                                            "material=\x22opacity: 0\x22></a-entity>"+
                                            "<a-entity id=\x22viewportPlaceholder\x22 geometry=\x22primitive: plane; height: 0.01; width: .01\x22 position=\x220 0 -1.5\x22"+
                                            "material=\x22opacity: 0\x22></a-entity>"+
                                            "<a-entity id=\x22viewportPlaceholder3\x22 geometry=\x22primitive: plane; height: 0.01; width: .01\x22 position=\x220 0 -3\x22"+
                                            "material=\x22opacity: 0\x22></a-entity>"+
                                            "<a-entity id=\x22thirdPersonPlaceholder\x22 position=\x220 0 0\x22></a-entity>"+
                                            // "<a-sphere visible=\x22true\x22 scale=\x220.45 0.5 0.4\x22 random-color></a-sphere>"+
                                        "</a-entity>"+
                                       
                                       
                                        "</a-entity></a-entity>";
                                } else {
                                    // defaults to first person cam
                                    camera = "<a-entity id=\x22cameraRig\x22 "+movementControls+" initializer "+
                                
                                        " id=\x22mouseCursor\x22 cursor=\x22rayOrigin: mouse\x22 raycaster=\x22objects: .activeObjexRay\x22>"+
                                        // "<a-entity id=\x22player\x22 get_pos_rot networked=\x22template:#avatar-template;attachTemplateToLocal:false;\x22 "+spawnInCircle+" camera "+wasd+" look-controls=\x22hmdEnabled: false\x22 position=\x220 1.6 0\x22>" +     
                                        // "<a-entity id=\x22viewportPlaceholder\x22 position=\x220 0 -1\x22></entity>"+   
                                        "<a-entity id=\x22player\x22 look-controls get_pos_rot camera "+wasd+" "+ physicsMod +" position=\x22"+playerPosition+"\x22>"+
                                            "<a-entity id=\x22equipPlaceholder\x22 geometry=\x22primitive: box; height: .1; width: .1; depth: .1\x22 position=\x220 -.65 -.75\x22"+
                                            "material=\x22opacity: 0\x22></a-entity>"+
                                            "<a-entity id=\x22viewportPlaceholder\x22 geometry=\x22primitive: plane; height: 0.01; width: .01\x22 position=\x220 0 -1.5\x22"+
                                            "material=\x22opacity: 0\x22></a-entity>"+
                                            "<a-entity id=\x22viewportPlaceholder3\x22 geometry=\x22primitive: plane; height: 0.01; width: .01\x22 position=\x220 0 -3\x22"+
                                            "material=\x22opacity: 0\x22></a-entity>"+
                                        "</a-entity>"+
                                       
                                        "<a-entity id=\x22left-hand\x22 oculus-touch-controls=\x22hand: left\x22 "+blinkMod+" handModelStyle: lowPoly; color: #ffcccc\x22>"+
                                            "<a-console position=\x220 .13 -.36\x22 scale=\x22.33 .33 .33\x22 rotation=\x22-70.7 -1.77\x22></a-console>"+
                                        "</a-entity>" +
                                        "<a-entity id=\x22right-hand\x22 oculus-touch-controls=\x22hand: right\x22 laser-controls=\x22hand: right;\x22 handModelStyle: lowPoly; color: #ffcccc\x22 raycaster=\x22objects: .activeObjexRay;\x22 grab></a-entity>"+
                                        "</a-entity></a-entity>";
                                }
                            }
                            let webxrEnv = "default";

                            if (sceneResponse.sceneWebXREnvironment != null && sceneResponse.sceneWebXREnvironment != "none" && sceneResponse.sceneWebXREnvironment != "") {
                                webxrEnv = sceneResponse.sceneWebXREnvironment;
                                
                                enviromentScript = "<script src=\x22../main/ref/aframe/dist/aframe_environment_component.min.js\x22></script>";
                                let ground = "";
                                let skycolor = "";
                                let groundcolor = "";
                                let groundcolor2 = "";
                                let dressingcolor = "";
                                let horizoncolor = "";
                                let shadow = "shadow: false;";
                                let fog = "";
                                let tweakColors = "";
                                if (webxrEnv == "none") {
                                    ground = "ground: none;"
                                    hemiLight = "<a-light id=\x22hemi-light\x22 type=\x22hemisphere\x22 color=\x22" + sceneResponse.sceneColor1 + "\x22 groundColor=\x22" + sceneResponse.sceneColor2 + "\x22 intensity=\x22.5\x22 position\x220 0 0\x22>"+
                                    "</a-light>";
                                }
                                if (sceneResponse.sceneUseFloorPlane && sceneResponse.sceneFloorplaneTexture == "none") {
                                    ground = "ground: none; dressing: none;"
                                }
                                if (sceneResponse.sceneUseDynamicShadows) {
                                    shadow = "shadow: true;"
                                }
                                if (sceneResponse.sceneTweakColors) {
                                    // tweakColors = "mod-colors"; //need to animate
                                }

                                if (sceneResponse.sceneUseGlobalFog || sceneResponse.sceneUseSceneFog) {
                                    fogSettings = "fog=\x22type: exponential; density:" +sceneResponse.sceneGlobalFogDensity+ "; near: 1; far: 50; color: " +sceneResponse.sceneColor1 + "\x22";
                                    fog = "fog: " +sceneResponse.sceneGlobalFogDensity+ ";";
                                }
                                if (sceneResponse.sceneColor1 != null && sceneResponse.sceneColor1.length > 3) {
                                    skycolor = "skyColor: " + sceneResponse.sceneColor1 + ";";
                                }
                                if (sceneResponse.sceneColor2 != null && sceneResponse.sceneColor2.length > 3 && sceneResponse.sceneColorizeSky) {  
                                    horizoncolor = "horizonColor: " + sceneResponse.sceneColor2 + ";";
                                    groundcolor2 = "groundColor2: " + sceneResponse.sceneColor2 + ";";
                                    ambientLight = "<a-light type='ambient' intensity='.5' color='" + sceneResponse.sceneColor2 + "'></a-light>";
                                } 
                                if (sceneResponse.sceneColor3 != null && sceneResponse.sceneColor3.length > 3 && sceneResponse.sceneColorizeSky) { //TODO put that in
                                    groundcolor = "groundColor: " + sceneResponse.sceneColor3 + ";";
                                }
                                if (sceneResponse.sceneColor4 != null && sceneResponse.sceneColor4.length > 3 && sceneResponse.sceneColorizeSky) {
                                    // horizoncolor = "horizonColor: " + sceneResponse.sceneColor4 + ";";
                                    dressingcolor = "dressingColor: " + sceneResponse.sceneColor4 + ";";
                                    groundcolor2 = "groundColor2: " + sceneResponse.sceneColor4 + ";";
                                }      
                                // "+ground+"
                                aframeEnvironment = "<a-entity id=\x22enviroEl\x22 environment=\x22preset: "+webxrEnv+"; "+ground+" "+fog+" "+shadow+" "+groundcolor+" "+dressingcolor+" "+groundcolor2+" "+skycolor+" "+horizoncolor+" playArea: 15; lighting: distant; lightPosition: -5 10 0;\x22 hide-in-ar-mode "+tweakColors+"></a-entity>";
                                // environment = "<a-entity environment=\x22preset: "+webxrEnv+"; "+fog+" "+shadow+" "+groundcolor+" "+dressingcolor+" "+groundcolor2+" "+skycolor+" "+horizoncolor+" playArea: 3; lightPosition: 0 2.15 0\x22 hide-in-ar-mode></a-entity>";
                            } else {
                                hemiLight = "<a-light id=\x22hemi-light\x22 type=\x22hemisphere\x22 color=\x22" + sceneResponse.sceneColor1 + "\x22 groundColor=\x22" + sceneResponse.sceneColor2 + "\x22 intensity=\x22.5\x22 position\x220 0 0\x22>"+
                                    "</a-light>";
                            }
                            sceneResponse.scenePostcards = sceneData.scenePostcards;
                            if (sceneResponse.sceneColor1 != null && sceneResponse.sceneColor1.length > 3) {
                                // skySettings = "<a-sky hide-in-ar-mode color='" + sceneResponse.sceneColor1 + "'></a-sky>"; //overwritten below if there's a skybox texture
                                // environment = "<a-entity environment=\x22preset: "+webxrEnv+"; skyColor: " + sceneResponse.sceneColor1 + "; lighting: none; shadow: none; lightPosition: 0 2.15 0\x22 hide-in-ar-mode></a-entity>";
                            } 
                            if (sceneResponse.sceneColor1 != null && sceneResponse.sceneColor1.length > 3 && sceneResponse.sceneColor2 != null && sceneResponse.sceneColor2.length > 3)   {

                            }
                            if (sceneResponse.sceneUseDynamicShadows && (webxrEnv == undefined || webxrEnv == null || webxrEnv == "none")) { //add a shadow light if not using the enviroment lights
                                // shadowLight = "<a-light type=\x22directional\x22 color=\x22" + sceneResponse.sceneColor1 + "\x22 groundColor=\x22" + sceneResponse.sceneColor2 + "\x22 intensity=\x22.75\x22 target=\x22.target\x22 castShadow=\x22true\x22 shadowMapHeight=\x221024\x22 shadowMapWidth=\x221024\x22 shadowCameraLeft=\x22-2\x22 shadowCameraRight=\x222\x22; shadowCameraBottom=\x22-2\x22; shadowCameraTop=\x222\x22; position\x22-1 4 4\x22>"+
                                // "</a-light>";
                                shadowLight = "<a-entity id=\x22shadow-light\x22 light=\x22type: directional; color:"+sceneResponse.sceneColor1+"; groundColor:"+sceneResponse.sceneColor2+"; castShadow: true; intensity: 0.4; shadowBias: -0.0015; shadowCameraFar: 1000; shadowMapHeight: 2048; shadowMapWidth: 2048;\x22 position=\x225 10 7\x22></a-entity>";
                            }
                            if (sceneResponse.sceneUseGlobalFog || sceneResponse.sceneUseSceneFog) {
                                let fogDensity = sceneResponse.sceneGlobalFogDensity != null ? sceneResponse.sceneGlobalFogDensity : '.01';
                                fogSettings = "fog=\x22type: exponential; density:"+fogDensity+"; near: 1; far: 150; color: " +sceneResponse.sceneColor1 + "\x22";
                            }
                            
                            if (sceneResponse.sceneSkyParticles != undefined && sceneResponse.sceneSkyParticles != null && sceneResponse.sceneSkyParticles != "None") { 
                                if (sceneResponse.sceneSkyParticles.toLowerCase() == "dust") {
                                    // skyParticles = "<a-entity scale='2 2 2' position='0 3 0' particle_mangler particle-system=\x22preset: dust; particleCount: 3000; texture: https://realitymangler.com/assets/textures/smokeparticle2.png; color: " + sceneResponse.sceneColor1 + "," + sceneResponse.sceneColor2 +"\x22></a-entity>";
                                    skyParticles = "<a-entity scale=\x2220 10 20\x22 position=\x220 5 0\x22 sprite-particles=\x22texture: #sparkle1; blending: additive; color: black..white;  position: -1 -1 -1..1 1 1; velocity: -.01 -.025 -.01 .. .01 .025 .01; spawnRate: 500; lifeTime: 2; scale: .25,.75; opacity: 1\x22></a-entity>";
                                } else if (sceneResponse.sceneSkyParticles.toLowerCase() == "rain") {
                                    // skyParticles = "<a-entity scale='2 2 2' position='0 3 0' particle_mangler particle-system=\x22preset: rain; particleCount: 3000; texture: https://realitymangler.com/assets/textures/raindrop2.png; color: " + sceneResponse.sceneColor1 + "," + sceneResponse.sceneColor2 +"\x22></a-entity>";
                                    skyParticles = "<a-entity scale=\x2220 10 20\x22 position=\x220 5 0\x22 sprite-particles=\x22texture: #raindrop; blending: additive; color: " +sceneResponse.sceneColor2 + "; position: -1 1 -1..1 1 1; spawnRate: 1000; velocity: 0 -1 0; lifeTime: 4; scale: .05,.1; opacity: .8\x22></a-entity>";
                                } else if (sceneResponse.sceneSkyParticles.toLowerCase() == "rain/fog") {
                                    // skyParticles = "<a-entity scale='2 2 2' position='0 3 0' particle_mangler particle-system=\x22preset: rain; particleCount: 3000; texture: https://realitymangler.com/assets/textures/raindrop2.png; color: " + sceneResponse.sceneColor1 + "," + sceneResponse.sceneColor2 +"\x22></a-entity>";
                                    skyParticles = "<a-entity scale=\x2220 10 20\x22 position=\x220 10 0\x22 sprite-particles=\x22texture: #raindrop; color: " +sceneResponse.sceneColor2 + "; position: -1 1 -1..1 1 1; spawnRate: 1000; velocity: 0 -.75 0; lifeTime: 10; scale: .15,.25; opacity: 1\x22></a-entity>"+
                                    "<a-entity scale=\x2250 10 50\x22 position=\x220 10 0\x22 sprite-particles=\x22texture: #cloud1; color: " +sceneResponse.sceneColor2 + "; blending: additive; position: -1 -1 -1..1 1 1; velocity: -.05 -.025 -.05 .. .05 .025 .05; spawnRate: 5; lifeTime: 20; scale: 200,400; opacity: 0,.3,0; rotation: 0..360\x22></a-entity>";
                                } else if (sceneResponse.sceneSkyParticles.toLowerCase() == "rain/fog/add") {
                                    // skyParticles = "<a-entity scale='2 2 2' position='0 3 0' particle_mangler particle-system=\x22preset: rain; particleCount: 3000; texture: https://realitymangler.com/assets/textures/raindrop2.png; color: " + sceneResponse.sceneColor1 + "," + sceneResponse.sceneColor2 +"\x22></a-entity>";
                                    skyParticles = "<a-entity scale=\x2220 10 20\x22 position=\x220 10 0\x22 sprite-particles=\x22texture: #raindrop; color: " +sceneResponse.sceneColor2 + "; blending: additive; position: -1 1 -1..1 1 1; spawnRate: 1000; velocity: 0 -.75 0; lifeTime: 10; scale: .15,.25; opacity: 1\x22></a-entity>"+
                                    "<a-entity scale=\x2250 10 50\x22 position=\x220 10 0\x22 sprite-particles=\x22texture: #cloud1; color: " +sceneResponse.sceneColor2 + "; blending: additive; position: -1 -1 -1..1 1 1; velocity: -.05 -.025 -.05 .. .05 .025 .05; spawnRate: 5; lifeTime: 20; scale: 100,200; opacity: 0,.3,0; rotation: 0..360\x22></a-entity>";
                                } else if (sceneResponse.sceneSkyParticles.toLowerCase() == "snow") {
                                    skyParticles = "<a-entity scale='2 2 2' position='0 3 0' particle_mangler particle-system=\x22preset: snow; particleCount: 3000; texture: https://realitymangler.com/assets/textures/cloud_sm.png; color: " + sceneResponse.sceneColor1 + "," + sceneResponse.sceneColor2 +"\x22></a-entity>";
                                } else if (sceneResponse.sceneSkyParticles.toLowerCase() == "smoke") {
                                    skyParticles = "<a-entity scale=\x2250 10 50\x22 position=\x220 10 0\x22 sprite-particles=\x22texture: #cloud1; color: " +sceneResponse.sceneColor2 + "; position: -1 -1 -1..1 1 1; velocity: -.05 -.025 -.05 .. .05 .025 .05; spawnRate: 5; lifeTime: 20; scale: 100,200; opacity: 0,.3,0; rotation: 0..360\x22></a-entity>";

                                } else if (sceneResponse.sceneSkyParticles.toLowerCase() == "explosions") {
                                    // skyParticles = "<a-entity scale='15 5 15' position='0 0 0' particle_mangler particle-system=\x22preset: dust; maxAge: 10; velocityValue: 0 -.01 0; direction: -.01; positionSpread: 15 15 15; opacity: .15; particleCount: 25; size: 300; blending: 2; texture: https://realitymangler.com/assets/textures/cloud_sm.png; color: " + sceneResponse.sceneColor1 + "," + sceneResponse.sceneColor2 +"\x22></a-entity>";
                                    // skyParticles = "<a-entity position=\x220 3 0\x22 scale=\x222 2 2\x22 mod_particles=\x22type: smoke\x22></a-entity>";
                                    skyParticles = "<a-entity scale=\x2220 20 20\x22 position=\x220 20 0\x22 sprite-particles=\x22texture: #explosion1; textureFrame: 8 8; blending: additive; color: black..white;"+
                                    " position: -1 -1 -1..1 1 1; velocity: -.1 -.05 -.1 .. .1 .05 .1; spawnRate: 20; lifeTime: 1; scale: 50,200; opacity: 0,1,0; rotation: 0..360\x22></a-entity>";
                                } else if (sceneResponse.sceneSkyParticles.toLowerCase() == "fireworks") {
                                    
                                    skyParticles = "<a-entity scale=\x2240 10 40\x22 position=\x220 40 0\x22 sprite-particles=\x22texture: #fireworksanim1; textureFrame: 5 5; blending: additive; color: black..white;"+
                                    " position: -1 -1 -1..1 1 1; velocity: -.1 -.05 -.1 .. .1 .05 .1; spawnRate: 10; lifeTime: 1; scale: 50,200; opacity: 0,1,0; rotation: 0..360\x22></a-entity>";
                                    // skyParticles =  "<a-entity scale=\x221 1 1\x22 position=\x220 1 0\x22 sprite-particles=\x22texture: #blob1; color: yellow, red; spawnRate: 300; spawnType: burst; radialVelocity: 2..4; radialAcceleration: -2; lifeTime: 1; scale: 1; particleSize: 25\x22></a-entity>";
                                    // "<a-entity scale=\x2220 20 20\x22 position=\x220 20 0\x22 sprite-particles=\x22texture: #fireworksanim1; textureFrame: 5 5; blending: additive; color: black..white;"+
                                    // " position: -1 -1 -1..1 1 1; velocity: -.1 -.05 -.1 .. .1 .05 .1; spawnRate: 20; lifeTime: 1; scale: 50,200; opacity: 0,1,0; rotation: 0..360\x22></a-entity>";
                                } else if (sceneResponse.sceneSkyParticles.toLowerCase() == "fog") {
                                    // skyParticles = "<a-entity scale='15 5 15' position='0 5 0' particle_mangler particle-system=\x22preset: dust; maxAge: 25; velocityValue: 0 -.01 0; direction: -.01; positionSpread: 15 2 15; opacity: .25; particleCount: 50; size: 500; blending: 2; texture: https://realitymangler.com/assets/textures/cloud_lg.png; color: " + sceneResponse.sceneColor1 + "," + sceneResponse.sceneColor2 +"\x22></a-entity>";
                                    skyParticles = "<a-entity scale=\x2250 10 50\x22 position=\x220 10 0\x22 sprite-particles=\x22texture: #cloud1; color: " +sceneResponse.sceneColor2 + "; position: -1 -1 -1..1 1 1; velocity: -.05 -.025 -.05 .. .05 .025 .05; spawnRate: 5; lifeTime: 20; scale: 100,200; opacity: 0,.3,0; rotation: 0..360\x22></a-entity>";
                                } else if (sceneResponse.sceneSkyParticles.toLowerCase() == "fog/add") {
                                    skyParticles = "<a-entity scale=\x2250 10 50\x22 position=\x220 10 0\x22 sprite-particles=\x22texture: #cloud1; blending: additive; color: " +sceneResponse.sceneColor2 + "; position: -1 -1 -1..1 1 1; velocity: -.05 -.025 -.05 .. .05 .025 .05; spawnRate: 5; lifeTime: 20; scale: 100,200; opacity: 0,.3,0; rotation: 0..360\x22></a-entity>";
                                } else if (sceneResponse.sceneSkyParticles.toLowerCase() == "clouds") {
                                    // skyParticles = "<a-entity scale='15 5 15' position='0 10 0' particle_mangler particle-system=\x22preset: dust; maxAge: 25; velocityValue: 0 -.01 0; direction: -.01; positionSpread: 30 15 30; opacity: .2; particleCount: 50; size: 1000; blending: 2; texture: https://realitymangler.com/assets/textures/cloud_lg.png; color: " + sceneResponse.sceneColor1 + "," + sceneResponse.sceneColor2 +"\x22></a-entity>";
                                } else if (sceneResponse.sceneSkyParticles.toLowerCase() == "stars") {    
                                    // skyParticles = "<a-entity scale='2 2 2' position='0 15 0' particle_mangler particle-system=\x22preset: stars; particleCount: 3000; texture: https://realitymangler.com/assets/textures/star2b.png; color: " + sceneResponse.sceneColor1 + "," + sceneResponse.sceneColor2 +"\x22></a-entity>";
                                }
                                
                            }
                            if (sceneResponse.sceneUseFloorPlane) {
                                groundPlane = "<a-plane rotation='-90 0 0' position='0 -5 0' width='100' height='100' color=\x22" + sceneResponse.sceneColor2+ "\x22></a-plane>"; //deprecated for environment component
                                // ground = "<a-circle rotation='-90 0 0' position='0 -1 0' width='100' height='100'></a-circle>";
                            }
                            if (sceneResponse.sceneWater != null) {
                                if (sceneResponse.sceneWater.name == "water2") {
                                    console.log("water: " + JSON.stringify(sceneResponse.sceneWater)); //these use the escaped aframe shaders, not the eval'd non escaped mode
                                    ocean = "<a-plane position=\x220  "+sceneResponse.sceneWater.level+" 0\x22 width=\x22256\x22 height=\x22256\x22 rotation=\x22-90 180 -90\x22 segments-height=\x22100\x22 segments-width=\x22100\x22 "+skyboxEnvMap+" material=\x22color: "+sceneResponse.sceneColor3+"; shader:makewaves; uMap: #water; repeat: 500 500;\x22></a-plane>";
                                } else if (sceneResponse.sceneWater.name == "water1") {
                                    ocean = "<a-plane position=\x220 "+sceneResponse.sceneWater.level+" 0\x22 width=\x22256\x22 height=\x22256\x22 rotation=\x22-90 180 -90\x22 segments-height=\x2264\x22 segments-width=\x2264\x22 "+skyboxEnvMap+" material=\x22shader:makewaves_small; color: "+sceneResponse.sceneColor4+";uMap: #water2; repeat: 500 500; transparent: true\x22></a-plane>";
                                }
                            }
                            if (sceneResponse.sceneUseHeightmap != null && sceneResponse.sceneUseHeightmap) {
                                // console.log("water: " + JSON.stringify(sceneResponse.sceneWater));
                                // terrain = "<a-plane position=\x220 -20 0\x22 width=\x22512\x22 height=\x22512\x22 rotation=\x22-90 180 -90\x22 segments-height=\x22512\x22 segments-width=\x22512\x22 material=\x22shader:terrain; uMap: #heightmap; grassTexture: #grass; bumpScale: 50.0;\x22></a-plane>";
                                terrain = "<a-plane class=\x22surface activeObjexRay\x22 position=\x220 -20 0\x22 width=\x22512\x22 height=\x22512\x22 rotation=\x22-90 180 -90\x22 segments-height=\x22512\x22 segments-width=\x22512\x22 terrain-mangler></a-plane>";
                                // terrain = "<a-entity terrain-mangler-too></a-entity>";
                            }
                            // if (sceneResponse.sceneUseTargetObject && sceneResponse.sceneTargetObject.name == "gltftest" ) {
                            //     targetObjectAsset = "<a-asset-item id=\x22targetObj\x22 src=\x22../assets/models/korkus/KorkusOnly.gltf\x22></a-asset-item>";
                            //     targetObjectEntity = "<a-entity gltf-model=\x22#targetObj\x22 position='-5 5 5'></a-entity>";
                            // }
                            if (sceneResponse.sceneNextScene != null && sceneResponse.sceneNextScene != "") {
                                nextLink = "href=\x22../webxr/" + sceneResponse.sceneNextScene + "\x22";
                            }
                            if (sceneResponse.scenePreviousScene != null && sceneResponse.scenePreviousScene != "") {
                                prevLink = "href=\x22../" + sceneResponse.scenePreviousScene + "\x22";
                            }
                            if (sceneResponse.sceneLoopPrimaryAudio) {
                                loopable = "loop: true";
                            }
                          
                            if (sceneData.scenePrimaryAudioID != null && sceneData.scenePrimaryAudioID.length > 4) {
                                var pid = ObjectID(sceneData.scenePrimaryAudioID);
                                // console.log("tryna get [ObjectID(sceneData.scenePrimaryAudioID)]" + ObjectID(sceneData.scenePrimaryAudioID));
                                requestedAudioItems.push(ObjectID(sceneData.scenePrimaryAudioID));
                                if (sceneData.scenePrimaryAudioVisualizer) {
                                    // audioVizScript = "<script src=\x22../main/ref/aframe/dist/aframe-audioanalyser-component.js\x22></script>"; 
                                    // audioVizEntity = "<a-entity id=\x22audiovizzler\x22 position=\x22"+audioLocation+"\x22 audioanalyser=\x22smoothingTimeConstant: 0.9\x22 audioanalyser-levels-scale=\x22max: 50; multiplier: 0.06\x22 entity-generator=\x22mixin: bar; num: 256\x22 layout=\x22type: circle; radius: 10\x22 rotation=\x220 180 0\x22></a-entity>";
                                    audioVizEntity = "<a-entity id=\x22audiovizzler\x22 position=\x22"+audioLocation+"\x22 data-audio-analyzer=\x22true\x22 data-beat=\x22true\x22></a-entity>";
                                    // primaryAudioParams = primaryAudioParams + " data-audiovizzler=\x22beat\x22 ";
                                }
                            }
                            if (sceneData.sceneAmbientAudioID != null && sceneData.sceneAmbientAudioID.length > 4) {
                                // var pid = ObjectID(sceneData.sceneAmbientAudioID);
                                // console.log("tryna get [ObjectID(sceneData.scenePrimaryAudioID)]" + ObjectID(sceneData.scenePrimaryAudioID));
                                requestedAudioItems.push(ObjectID(sceneData.sceneAmbientAudioID));

                            }
                            if (sceneData.sceneTriggerAudioID != null && sceneData.sceneTriggerAudioID.length > 4) {
                                // var pid = ObjectID(sceneData.sceneAmbientAudioID);
                                // console.log("tryna get [ObjectID(sceneData.scenePrimaryAudioID)]" + ObjectID(sceneData.scenePrimaryAudioID));
                                requestedAudioItems.push(ObjectID(sceneData.sceneTriggerAudioID));

                            }
                            callback();
                            
                        // }
                        // callback();

                    // });
                },

                function (callback) {
                    if (particleLocations.length > 0) {
                        for (let i = 0; i < particleLocations.length; i++) {
                            let color = "";
                            let distance = 10;
                            let mods = "";
                            if (particleLocations[i].data != null && particleLocations[i].data.length > 3) {
                                if (particleLocations[i].data.indexOf("~") != -1) {
                                    let split = particleLocations[i].data.split("~");
                                    color = split[0];
                                    distance = split[1];
                                    // if (split.length > 2) {
                                    //     if (split[2].toLowerCase().includes("flicker")) {
                                    //         mods = " mod_flicker ";
                                    //     }
                                    // }
                                } else {
                                    color = locationLights[i].data;
                                }
                            }
                        }
                        callback();
                    } else {
                        callback();
                    }
                },
                function (callback) {
                    if (locationLights.length > 0) {
                        for (let i = 0; i < locationLights.length; i++) {
                            let color = "";
                            let distance = 10;
                            let mods = "";
                            console.log("gotsa light with data: " + locationLights[i].data);
                            if (locationLights[i].data != null && locationLights[i].data.length > 0) {
                                if (locationLights[i].data.indexOf("~") != -1) {
                                    let split = locationLights[i].data.split("~");
                                    color = split[0];
                                    distance = split[1];
                                    if (split.length > 2) {
                                        if (split[2].toLowerCase().includes("flicker")) {
                                            mods = " mod_flicker ";
                                        }
                                    }
                                } else {
                                    color = locationLights[i].data;
                                }
                            }
                            lightEntities = lightEntities + "<a-light "+mods+" color=\x22" + color + "\x22 position=\x22"+locationLights[i].loc+"\x22 distance=\x22"+distance+"\x22 intensity='2' type='point'></a-light>";
                        }
                        callback();
                    } else {
                        callback();
                    }
                },
                function (callback) {
                    if (curvePoints.length > 0) {
                        for (let i = 0; i < curvePoints.length; i++) {
                            
                            curveEntities = curveEntities + "<a-curve-point position=\x22"+curvePoints[i].loc+"\x22></a-curve-point>";
                        }
                        callback();
                    } else {
                        callback();
                    }
                },
                function (callback) {                
                    if (locationPlaceholders.length > 0) {
                        for (let i = 0; i < locationPlaceholders.length; i++) {
                            // console.log("gotsa placeholder at " + locationPlaceholders[i].x);
                            // let physics = "mod_physics=\x22body: kinematic; isTrigger: true;\x22";
                            let physics = "";
                            // let gltf = "gltf-model=\x22#poi1\x22"
                            // if (locationPlaceholders[i].markerType.toLowerCase().includes("trigger") || locationPlaceholders[i].markerType.toLowerCase().includes("gate") || locationPlaceholders[i].markerType.toLowerCase().includes("portal")) {
                            //     physics = "mod_physics=\x22body: kinematic; isTrigger: true;\x22";
                            // }
                            placeholderEntities = placeholderEntities + "<a-entity id=\x22"+sceneResponse.short_id+"~cloudmarker~"+locationPlaceholders[i].timestamp+"\x22  "+physics+" class=\x22activeObjexGrab activeObjexRay envMap\x22 cloud_marker=\x22phID: "+
                            locationPlaceholders[i].phID+"; scale: "+locationPlaceholders[i].scale+"; modelID: "+locationPlaceholders[i].modelID+"; model: "+
                            locationPlaceholders[i].model+"; markerType: "+locationPlaceholders[i].markerType+";  tags: "+locationPlaceholders[i].locationTags+"; isNew: false;name: "+
                            locationPlaceholders[i].name+";label: "+locationPlaceholders[i].label+";description: "+locationPlaceholders[i].description+";eventData: "+locationPlaceholders[i].eventData+";timestamp: "+locationPlaceholders[i].timestamp+";\x22 "+
                            skyboxEnvMap+ " position=\x22"+locationPlaceholders[i].x+" "+locationPlaceholders[i].y+ " " +locationPlaceholders[i].z+"\x22 rotation=\x22"+locationPlaceholders[i].eulerx+" "+locationPlaceholders[i].eulery+ " " +locationPlaceholders[i].eulerz+"\x22></a-entity>";
                        }
                        callback();
                    } else {
                        callback();
                    }
                },
                function (callback) {
                    // if (req.session.user) {
                        db.inventory_items.find({"sceneID": sceneData._id}, function (err, items) {
                            if (err || ! items) {
                                console.log("no inventory items!");
                            } else {
                                console.log("gots inventory items: " + JSON.stringify(items));
                                var buff = Buffer.from(JSON.stringify(items)).toString("base64");
                                inventoryData = "<a-entity mod_scene_inventory id=\x22sceneInventory\x22 data-inventory='"+buff+"'></a-entity>";
                                callback();
                            }
                        });
                    // } else {
                    //     callback();
                    // }
                   
                },
            
                function (callback) {
                    var modelz = [];
                //    console.log("sceneModels : " + JSON.stringify(sceneResponse.sceneModels));
                    if (sceneResponse.sceneModels != null) {
                        async.each (sceneResponse.sceneModels, function (objID, callbackz) { //nested async-ery!
                            var oo_id = ObjectID(objID);
                            // console.log("13904 tryna get sceneObject: " + objID);
                            db.models.findOne({"_id": oo_id}, function (err, model) {
                                if (err || !model) {
                                    console.log("error getting model: " + objID); //todo - report? 
                                    callbackz();
                                } else {
                                    // console.log("got user model:" + model._id);
                                    let url = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + model.userID + "/gltf/" + model.filename, Expires: 6000});
                                    model.url = url;
                                    modelz.push(model);
                                    callbackz();
                                }
                            });
                        }, function(err) {
                           
                            if (err) {
                                
                                console.log('A file failed to process');
                                callback(null);
                            } else {
                                console.log('modelz have been added to scene');
                                // objectResponse = modelz;
                                // sceneResponse.sceneModelz = objectResponse;
                                var buff = Buffer.from(JSON.stringify(modelz)).toString("base64");
                                modelData = "<div id=\x22sceneModels\x22 data-models='"+buff+"'></div>";
                                callback(null);
                            }
                        });
                    } else {
                        callback(null);
                    }
                }, 
                function (callback) { //get available scenes for scene links
                //     var platformString = "";
            
                let query = {$and: [{ "sceneDomain": sceneResponse.sceneDomain}, {sceneShareWithPublic: true }]};
                console.log("scene query : " + JSON.stringify(query));
                db.scenes.find( query, function (err, scenes) {
                if (err || !scenes) {
                    console.log("cain't get no scenes... " + err);
                    calllback(err);
                } else {
                    console.log("gots " + scenes.length + " scenes");
                    var availableScenes = [];
                    availableScenesResponse.availableScenes = availableScenes;
                        async.each(scenes, function (scene, cb) {
                            availableScene = {};
                            if (scene.scenePostcards != null && scene.scenePostcards.length > 0) { //cain't show without no postcard
                                var postcardIndex = Math.floor(Math.random()*scene.scenePostcards.length);
                                var oo_id = ObjectID(scene.scenePostcards[postcardIndex]); //TODO randomize? or ensure latest?  or use assigned default?
                                db.image_items.findOne({"_id": oo_id}, function (err, picture_item) {
                                    if (err || !picture_item) {
                                        console.log("error getting postcard for availablescenes: 2" + err);
                                        cb(); //no postcards, next...
                                    } else {
                                        var item_string_filename = JSON.stringify(picture_item.filename);
                                        item_string_filename = item_string_filename.replace(/\"/g, "");
                                        var item_string_filename_ext = getExtension(item_string_filename);
                                        var expiration = new Date();
                                        expiration.setMinutes(expiration.getMinutes() + 30);
                                        var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                                        // var thumbName = 'thumb.' + baseName + item_string_filename_ext;  //unused for now
                                        // var standardName = 'standard.' + baseName + item_string_filename_ext;
                                        var halfName = 'half.' + baseName + item_string_filename_ext;
                                        var quarterName = 'quarter.' + baseName + item_string_filename_ext;

                                        var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + halfName, Expires: 6000}); //just send back thumbnail urls for list
                                        var urlQuarter = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + quarterName, Expires: 6000}); //just send back thumbnail urls for list
                                        availableScene = {
                                            sceneTitle: scene.sceneTitle,
                                            sceneKey: scene.short_id,
                                            sceneType: scene.sceneType,
                                            sceneLastUpdate: scene.sceneLastUpdate,
                                            sceneDescription: scene.sceneDescription,
                                            sceneKeynote: scene.sceneKeynote,
                                            sceneAndroidOK: scene.sceneAndroidOK,
                                            sceneIosOK: scene.sceneIosOK,
                                            sceneWindowsOK: scene.sceneWindowsOK,
                                            sceneStatus: scene.sceneShareWithPublic ? "public" : "private",
                                            sceneOwner: scene.userName ? "" : scene.userName,
                                            scenePostcardQuarter: urlQuarter,
                                            scenePostcardHalf: urlHalf
                                        };
                                        availableScenesResponse.availableScenes.push(availableScene);

                                        cb();

                                        }
                                    });
                                } else {
                                    cb();
                                }
                            }, 
                            function (err) {
                                if (err) {
                                    console.log('A file failed to process');
                                    callback(null);
                                    //else if no keys?
                                } else {
                                    console.log('All files have been processed successfully skyboxEnvMap is ' + skyboxEnvMap);
         
                                    if (availableScenes != null && availableScenes != undefined && availableScenes.length > 0) {
                                    availableScenesEntity = "<a-entity scale=\x22.75 .75 .75\x22 look-at=\x22#player\x22 position=\x22"+scenesKeyLocation+"\x22>"+ 
                                    "<a-entity position=\x220 -2.5 0\x22 scale=\x22.75  .75 .75\x22 id=\x22availableScenesControl\x22 class=\x22envMap activeObjexRay\x22 toggle-available-scenes "+skyboxEnvMap+" gltf-model=\x22#key\x22></a-entity>"+
                                    "<a-entity id=\x22availableScenesPanel\x22 visible='false' position=\x220 -1 0\x22>"+
                                    "<a-entity id=\x22availableScenesHeaderText\x22 geometry=\x22primitive: plane; width: 3.25; height: 1\x22 position=\x220 1.75 0\x22 material=\x22color: grey; transparent: true; opacity: 0.0\x22" +
                                    "text=\x22value:; wrap-count: 35;\x22></a-entity>" +

                                    "<a-entity id=\x22availableScenePic\x22 class=\x22envMap activeObjexRay\x22 visible=\x22true\x22 position=\x220 3 -.1\x22 gltf-model=\x22#widelandscape_panel\x22 scale=\x22.5 .5 .5\x22 material=\x22shader: flat; alphaTest: 0.5;\x22"+
                                    "rotation='0 0 0'></a-entity>"+
                                    "<a-entity gltf-model=\x22#square_panel\x22 scale=\x222.25 2.25 2.25\x22 position=\x220 2.1 -.25\x22></a-entity>" +
                                    "<a-entity visible='true' class=\x22envMap activeObjexRay\x22 id=\x22availableScenesNextButton\x22 gltf-model=\x22#next_button\x22 scale=\x22.5 .5 .5\x22 position=\x221.5 -.75 0\x22></a-entity>" +
                                    "<a-entity visible='true' class=\x22envMap activeObjexRay\x22 id=\x22availableScenesPreviousButton\x22 gltf-model=\x22#previous_button\x22 scale=\x22.5 .5 .5\x22 position=\x22-1.5 -.75 0\x22></a-entity>" +
                                    "</a-entity></a-entity>";
                                    console.log('processed attributions for ' + availableScenes.length);
                                    
                                    loadAvailableScenes = "ready(function(){\n" + //TODO base64 this stuff like the others...
                                    "let ascontrol = document.getElementById(\x22availableScenesControl\x22);\n"+
                                    
                                    "ascontrol.setAttribute(\x22available-scenes-control\x22, \x22jsonData\x22, "+JSON.stringify(JSON.stringify(availableScenesResponse))+");\n"+ //double stringify! yes, it's needed
                                    "});";
                                    callback();
                                    } else {
                                        callback();
                                    }
                                }
                            });
                        }
                    });
                },
                function (callback) { //update link pic URLs //TODO check for freshness, and rescrape if needed
                    if (sceneResponse.sceneWebLinks != null && sceneResponse.sceneWebLinks.length > 0) {
                        let index = 0;
                        
                        for (var i = 0; i < sceneResponse.sceneWebLinks.length; i++) {
                            db.weblinks.findOne({'_id': ObjectID(sceneResponse.sceneWebLinks[i])}, function (err, weblink){
                                if (err || !weblink) {
                                    console.log("can't find weblink");
                                } else {
                                    // index++
                                    // let link = {};
                                    let position = "-5 2 5";
                                    let scale = "2 2 2";
                                    if (sceneWeblinkLocations.length > index) {
                                        // console.log(JSON.stringify(sceneWeblinkLocations[index]));
                                        if (sceneWeblinkLocations[index].data != undefined) {
                                            if (sceneWeblinkLocations[index].data.indexOf("_") != -1) {
                                                //TODO don't add to scattered/layout versions
                                            }
                                        }
                                        // position = sceneWeblinkLocations[index].x+" "+sceneWeblinkLocations[index].y+" "+sceneWeblinkLocations[index].z;
                                        position = sceneWeblinkLocations[index].loc;
                                        // console.log("setting weblink position: " + position);
                                        if (sceneWeblinkLocations[index].markerObjScale != null && sceneWeblinkLocations[index].markerObjScale != undefined) {
                                            scale = sceneWeblinkLocations[index].markerObjScale.toString() + " " + sceneWeblinkLocations[index].markerObjScale.toString() + " " + sceneWeblinkLocations[index].markerObjScale.toString();
                                        }
                                    } else {
                                        let max = 20;
                                        let min = -20;
                                        let x = Math.random() * (max - min) + min;
                                        // let y = Math.random() * (max.y - min.y) + min.y;
                                        let z = Math.random() * (max - min) + min;
                                        if (z >= -1 && z <= 1) {
                                            z = -3;
                                        }
                                        if (x >= -1 && z <= 1) {
                                            x = -3;
                                        }
                                        position = x + " " + 1.5 + " " + z;
                                    }

                                    index++;
                                    var urlStandard = s3.getSignedUrl('getObject', {Bucket: 'servicemedia.web', Key: weblink._id +"/"+ weblink._id + ".standard.jpg", Expires: 6000});
                                    weblinkAssets = weblinkAssets + "<img id=\x22wlimage" + index + "\x22 crossorigin=\x22anonymous\x22 src='" + urlStandard + "'>";
                                    let link = "basic-link=\x22href: "+weblink.link_url+";\x22 class=\x22activeObjexGrab activeObjexRay\x22";
                                    let caption = "<a-text class=\x22pCap\x22 align=\x22center\x22 rotation=\x220 0 0\x22 position=\x220 1.2 0\x22 wrapCount=\x2240\x22 value=\x22"+weblink.link_title+"\x22></a-text>";
                                    weblinkEntities = weblinkEntities + "<a-entity "+link+" position=\x22"+position+"\x22 weblink-materials=\x22index:"+index+"\x22 look-at=\x22#player\x22 gltf-model=\x22#square_panel\x22 scale=\x22"+scale+"\x22 material=\x22shader: flat; src: #wlimage" + index + "; alphaTest: 0.5;\x22"+
                                    " visible='true'>"+caption+"</a-entity>";   
                                }
                            });
                        }
                    }
                    callback(null);
                },
                // function (callback) {
                //     let objex = [];
                //     let actionModels = [];
                //     console.log("tryna get all sceneObjects " + JSON.stringify(sceneResponse.sceneObjects));
                //     // if (sceneObjectLocations.length > 0) {  // objex have more properties, but are parsed/assigned by components (mod_objex, mod_object) after page load
                //         // console.log("sceneObjectLocations " + JSON.stringify(sceneObjectLocations));
                //         let objectIDs = []; //to prevent dupes in objex response below
                //         async.each (sceneObjectLocations, function (locObj, callbackz) {
                            
                //             if (locObj.objectID != undefined && locObj.objectID != "none" && sceneResponse.sceneObjects.indexOf(locObj.objectID) != -1 && objectIDs.indexOf(locObj.objectID) == -1) {
                //                 objectIDs.push(locObj.objectID);
                //                 const o_id = ObjectID(locObj.objectID);
                //                 db.obj_items.findOne({"_id": o_id}, function (err, objekt) { 
                //                     if (err || !objekt) { 
                //                         callbackz(err);
                //                     } else {
                                       
                //                     async.waterfall ([
                //                         function (cb) {
                //                             if (objekt.actionIDs != undefined && objekt.actionIDs.length > 0) {
                //                                 console.log("tryna add obj actions " + objekt.actionIDs);
                //                                 const aids = objekt.actionIDs.map(item => {
                //                                     return ObjectID(item);
                //                                 });
                //                                 db.actions.find({_id: {$in: aids }}, function (err, actions) {
                //                                     if (err || !actions) {
                //                                         // callback(err);
                //                                         cb(err);
                //                                     } else {
                                                        
                //                                         objekt.actions = actions;
                //                                         for (let a = 0; a < actions.length; a++) { //whew, now actions may have models, check for that and get urls below
                //                                             if (actions[a].modelID != undefined && actions[a].modelID != null && actions[a].modelID != "") {
                //                                                 actionModels.push(actions[a]);
                //                                             }
                //                                             if (a === actions.length - 1) {
                //                                                 cb(null);
                //                                             }
                //                                         }

                //                                         // console.log("actions: " + JSON.stringify(objekt.actions));
                                                        
                //                                     }
                //                                 });
                //                             } else {
                //                                 cb(null);
                //                             }
                //                         },
                //                         // function (cb) {
                                            
                //                         // },
                //                         function(cb) {
                //                          //get the model (needs array flexing!)
                //                         if (objekt.modelID != undefined && objekt.modelID != null) {
                //                             const m_id = ObjectID(objekt.modelID);
                //                             // 
                //                             db.models.findOne({"_id": m_id}, function (err, asset) { 
                //                             if (err || !asset) { 
                //                                 cb(err);
                //                             } else {      
                //                                 // console.log("founda matching model: " + JSON.stringify(asset));
                //                                 if (asset.item_type == "glb") {
                //                                     assetUserID = asset.userID;
                //                                     // var sourcePath =   "servicemedia/users/" + assetUserID + "/gltf/" + locMdl.gltf; //this should be "model" or "filename"
                //                                     let modelURL = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + assetUserID + "/gltf/" + asset.filename, Expires: 6000});
                //                                     objekt.modelURL = modelURL;
                //                                     gltfsAssets = gltfsAssets + "<a-asset-item id=\x22" + objekt.modelID + "\x22 src=\x22"+ modelURL +"\x22></a-asset-item>";
                //                                     objex.push(objekt);     
                //                                     cb(null);
                //                                 } else {
                //                                     objex.push(objekt);     
                //                                     cb(null);
                //                                 }
                //                             }
                //                             });
                //                             } else {
                //                             cb(null);
                //                         }
                //                     }
                                   
                //                     ], //waterfall end

                //                     function (err, result) { // #last function, close async
                //                        callbackz();
                //                     }
                //                     );
                //                     }
                //                     });
                //                 } else {
                //                     callbackz();
                //                 }
                //             }, function(err) {
                                
                //             if (err) {
                //                 console.log('A file failed to process ' + err);    
                            
                //                 callback(null, actionModels);
                //             } else {
                //                 // console.log("sceneObjex: " + JSON.stringify(objex));
                //                 var buff = Buffer.from(JSON.stringify(objex)).toString("base64");
                //                 var buff2 = Buffer.from(JSON.stringify(sceneObjectLocations)).toString("base64");
                //                 objectData = "<a-entity mod_objex id=\x22sceneObjects\x22 data-objex-locations='"+buff2+"' data-objex='"+buff+"'></a-entity>";
                //                 callback(null, actionModels);
                //             }
                    
                //         });
                // },
                function (callback) {
                    let objex = [];
                    let actionModels = [];
                    console.log("tryna get all sceneObjects " + JSON.stringify(sceneResponse.sceneObjects));
                    // if (sceneObjectLocations.length > 0) {  // objex have more properties, but are parsed/assigned by components (mod_objex, mod_object) after page load
                        // console.log("sceneObjectLocations " + JSON.stringify(sceneObjectLocations));
                        let objectIDs = []; //to prevent dupes in objex response below
                        // async.each (sceneObjectLocations, function (locObj, callbackz) { 
                        async.each (sceneResponse.sceneObjects, function (objectID, callbackz) {  //just return them all now, even if not placed, so they're available for localmods
                            
                            if (objectID != undefined && objectID != "none" && sceneResponse.sceneObjects.indexOf(objectID) != -1 && objectIDs.indexOf(objectID) == -1) {
                                objectIDs.push(objectID);
                                const o_id = ObjectID(objectID);
                                db.obj_items.findOne({"_id": o_id}, function (err, objekt) { 
                                    if (err || !objekt) { 
                                        callbackz(err);
                                    } else {
                                       
                                    async.waterfall ([
                                        function (cb) {
                                            if (objekt.actionIDs != undefined && objekt.actionIDs.length > 0) {
                                                console.log("tryna add obj actions " + objekt.actionIDs);
                                                const aids = objekt.actionIDs.map(item => {
                                                    return ObjectID(item);
                                                });
                                                db.actions.find({_id: {$in: aids }}, function (err, actions) {
                                                    if (err || !actions) {
                                                        // callback(err);
                                                        cb(err);
                                                    } else {
                                                        
                                                        objekt.actions = actions;
                                                        for (let a = 0; a < actions.length; a++) { //whew, now actions may have models, check for that and get urls below
                                                            if (actions[a].modelID != undefined && actions[a].modelID != null && actions[a].modelID != "") {
                                                                actionModels.push(actions[a]);
                                                            }
                                                            if (a === actions.length - 1) {
                                                                cb(null);
                                                            }
                                                        }

                                                        // console.log("actions: " + JSON.stringify(objekt.actions));
                                                        
                                                    }
                                                });
                                            } else {
                                                cb(null);
                                            }
                                        },
                                        // function (cb) {
                                            
                                        // },
                                        function(cb) {
                                         //get the model (needs array flexing!)
                                        if (objekt.modelID != undefined && objekt.modelID != null) {
                                            const m_id = ObjectID(objekt.modelID);
                                            // 
                                            db.models.findOne({"_id": m_id}, function (err, asset) { 
                                            if (err || !asset) { 
                                                cb(err);
                                            } else {      
                                                // console.log("founda matching model: " + JSON.stringify(asset));
                                                if (asset.item_type == "glb") {
                                                    assetUserID = asset.userID;
                                                    // var sourcePath =   "servicemedia/users/" + assetUserID + "/gltf/" + locMdl.gltf; //this should be "model" or "filename"
                                                    let modelURL = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + assetUserID + "/gltf/" + asset.filename, Expires: 6000});
                                                    objekt.modelURL = modelURL;
                                                    gltfsAssets = gltfsAssets + "<a-asset-item id=\x22" + objekt.modelID + "\x22 src=\x22"+ modelURL +"\x22></a-asset-item>";
                                                    objex.push(objekt);     
                                                    cb(null);
                                                } else {
                                                    objex.push(objekt);     
                                                    cb(null);
                                                }
                                            }
                                            });
                                            } else {
                                            cb(null);
                                        }
                                    }
                                   
                                    ], //waterfall end

                                    function (err, result) { // #last function, close async
                                       callbackz();
                                    }
                                    );
                                    }
                                    });
                                } else {
                                    callbackz();
                                }
                            }, function(err) {
                                
                            if (err) {
                                console.log('A file failed to process ' + err);    
                            
                                callback(null, actionModels);
                            } else {
                                // console.log("sceneObjex: " + JSON.stringify(objex));
                                var buff = Buffer.from(JSON.stringify(objex)).toString("base64");
                                var buff2 = Buffer.from(JSON.stringify(sceneObjectLocations)).toString("base64");
                                objectData = "<a-entity mod_objex id=\x22sceneObjects\x22 data-objex-locations='"+buff2+"' data-objex='"+buff+"'></a-entity>";
                                callback(null, actionModels);
                            }
                    
                        });
                    // } else {
                    //     callback(null, actionModels);
                    // }
                },
                function (actionModels, callback) { //fetch the extra models embedded in actions, if any
                    // for (let i = 0; i < actionModels.length; i++) {

                    // }
                    if (actionModels.length > 0) {
                        async.each (actionModels, function (actionModel, callbackz) { //loop tru w/ async
                            const m_id = ObjectID(actionModel.modelID);
                                            // 
                            db.models.findOne({"_id": m_id}, function (err, asset) { 
                            if (err || !asset) { 
                                callbackz(err);
                            } else {      
                                // console.log("founda matching model: " + JSON.stringify(asset));
                                if (asset.item_type == "glb") {
                                    // let assetUserID = asset.userID;
                                    // var sourcePath =   "servicemedia/users/" + assetUserID + "/gltf/" + locMdl.gltf; //this should be "model" or "filename"
                                    let modelURL = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + asset.userID + "/gltf/" + asset.filename, Expires: 6000});
                                    
                                    gltfsAssets = gltfsAssets + "<a-asset-item class=\x22gltfAssets\x22 crossorigin=\x22anonymous\x22 response-type=\x22arraybuffer\x22 id=\x22" + actionModel.modelID + "\x22 src=\x22"+ modelURL +"\x22></a-asset-item>";
                                    // objex.push(objekt);     
                                    console.log("adding actionModel :" + actionModel.modelName);
                                    callbackz(null);
                                } else {
                                    // objex.push(objekt);     
                                    callbackz(null);
                                }
                            }
                            });
                            
                        }, function(err) {
                        
                            if (err) {
                                console.log('An actionModel failed to process');
                                callback(err);
                            } else {
                                console.log('All actionModels have been processed successfully');
          
                                callback(null);
                            }
                        });
                    } else {
                        callback(null);
                    }
                },   
                function (callback) { //models are simpler, fewer properties`
                    if (sceneModelLocations.length > 0) {
                       
                        async.each (sceneModelLocations, function (locMdl, callbackz) { //loop tru w/ async
                            var scale = 1;
                            var offsetPos = "";
                            var rotAnim = "";
                            var posAnim = "";
                            var ambientChild = "";
                            // var ambientOffset = "";
                            // let objAnim = "animation-mixer"; //to blend the canned ones, and/or obj anims set below
                            let objAnim = ""; //no, must do this from component
                            let cannedAnim = "";
                            var rightRot = true;
                            var rotVal = 360;
                            let max = .6;
                            let min = 1.2;
                            let speed = Math.random() * (max - min) + min;
                            let maxR = 0;
                            let minR = 360;
                            let randomR = Math.random() * (maxR - minR) + minR;
                            let assetUserID = "";
                            let entityType = ""; //used to set entity id
                            let followCurve = "";

                            let usdzFiles = '';
                            let modelParent = "";
                            let locationTags = locMdl.locationTags;
                            if (sceneResponse.sceneUseDynCubeMap) {
                                skyboxEnvMap = "skybox-env-map shadow=\x22cast:true; receive:true\x22";   
                            }
                            // if ((locMdl.eventData != null && locMdl.eventData != undefined && locMdl.eventData.length > 1) && (!locMdl.eventData.includes("noweb"))) {

                            if (locMdl.modelID != undefined && locMdl.modelID != "none" && locMdl.markerType != "placeholder"
                                && locMdl.markerType != "poi"                                
                                && locMdl.markerType != "trigger"
                                && locMdl.markerType != "spawntrigger"
                                && locMdl.markerType != "gate"
                                && locMdl.markerType != "portal" 
                                && sceneResponse.sceneModels.indexOf(locMdl.modelID) != -1) {

                                // console.log("tryna set model id:  " + JSON.stringify(locMdl));
                                // console.log(locMdl.modelID);
                                const m_id = ObjectID(locMdl.modelID);
                                // 
                                db.models.findOne({"_id": m_id}, function (err, asset) { 
                                if (err || !asset) { 
                                    callbackz(err);
                                } else {
                                if (asset.item_type == "glb") {

                                    assetUserID = asset.userID;
                                    // var sourcePath =   "servicemedia/users/" + assetUserID + "/gltf/" + locMdl.gltf; //this should be "model" or "filename"
                                    let modelURL = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + assetUserID + "/gltf/" + asset.filename, Expires: 6000});
                                    // console.log("modelURL " + modelURL + " modelType " + asset.item_type);
                                    assetNumber++;
                                    let newAttribution = {};
                                    
                                        newAttribution.name = asset.name;
                                        newAttribution._id = asset._id;
                                        newAttribution.contentType = asset.item_type;
                                        newAttribution.sourceTitle = asset.sourceTitle;
                                        newAttribution.sourceLink = asset.sourceLink;
                                        newAttribution.authorName = asset.authorName;
                                        newAttribution.authorLink = asset.authorLink;
                                        newAttribution.license = asset.license;
                                        newAttribution.sourceText = asset.sourceText;
                                        newAttribution.modifications = asset.modifications;
                                        attributions.push(newAttribution);
                                    // }
                                    // console.log("attributions " + JSON.stringify(attributions));
                                    var navmesh = "";
                                    var m_assetID = "gltfasset" + assetNumber;
                                    let rx = locMdl.eulerx != null ? locMdl.eulerx : 0; 
                                    let ry = locMdl.eulery != null ? locMdl.eulery : 0; 
                                    // ry = parseFloat(ry) + 180; //fundge to match unity //NOPE - navmesh donut like it
                                    let rz = locMdl.eulerz != null ? locMdl.eulerz : 0; 
                                    let rotation = rx + " " + ry + " " + rz;
                                    if (ry == 99) {
                                        ry = randomR;
                                        rotation = rx + " " + ry + " " + rz;
                                        // console.log("tryna set random rotation for gltf to " + rotation);
                                    }
                                    
                                    // objAnim = "animation-mixer=\x22timeScale:"+speed+"\x22";
                                    if (locMdl.markerObjScale != null) {
                                        scale = locMdl.markerObjScale;
                                    }
                                    if (locMdl.markerType == "follow ambient")  {
                                        ambientChild = "ambientChild"; //follow ambient obj
                                        // ambientOffset
                                    }
                                    if (locMdl.markerType == "follow curve") {
                                        followCurve = "follow-path=\x22incrementBy:0.001; throttleTo:1\x22";
                                    }
                                    if (locMdl.markerType == "follow parametric curve") {
                                        let reverse = false;
                                        if (locMdl.eventData.toLowerCase().includes("reverse")) {
                                            reverse = true;
                                        }
                                        followCurve = "curve-follow=\x22curveData: #p_path; type: parametric_curve; reverse: "+reverse+"; duration: 64; loop: true;\x22";
                                    }
                                    if (locMdl.eventData != null && locMdl.eventData != undefined && locMdl.eventData.length > 1) { //eventData has info
                                        // console.log("!!!tryna setup animation " + r.eventData);
                                        if (locMdl.eventData.toLowerCase().includes("marker")) {
                                            modelParent = "parent-to=\x22tracking: marker\x22";
                                        }
                                        if (locMdl.eventData.toLowerCase().includes("spawn")) {
                                            arMode = "spawn";

                                        }
                                        if (locMdl.eventData.toLowerCase().includes("navmesh")) {
                                            if (locMdl.eventData.toLowerCase().includes("simple navmesh")) {
                                                navmeshAsset = "<a-asset-item id=\x22" + m_assetID + "\x22 src=\x22"+ modelURL +"\x22></a-asset-item>";
                                                navmeshEntity = "<a-entity id=\x22navmesh-el\x22 visible=\x22false\x22 gltf-model=\x22#" + m_assetID + "\x22></a-entity>";
                                            } else {
                                                navmeshAsset = "<a-asset-item id=\x22" + m_assetID + "\x22 src=\x22"+ modelURL +"\x22></a-asset-item>";
                                                // navmeshEntity = "<a-entity nav_mesh scale=\x22"+scale+" "+scale+" "+scale+"\x22> gltf-model=\x22#" + m_assetID + "\x22</a-entity>";
                                                // navmeshEntity = "<a-entity id=\x22nav_mesh\x22 nav_mesh=\x22show: false;\x22 gltf-model=\x22#" + m_assetID + "\x22></a-entity>";
                                                // if (locMdl.eventData.toLowerCase().includes("show")) {
                                                //     navmeshEntity = "<a-entity id=\x22nav_mesh\x22 nav_mesh=\x22show: true;\x22 gltf-model=\x22#" + m_assetID + "\x22></a-entity>";
                                                // }
                                                navmeshEntity = "<a-entity id=\x22nav-mesh\x22 nav-mesh visible=\x22false\x22 gltf-model=\x22#" + m_assetID + "\x22></a-entity>";
                                                if (locMdl.eventData.toLowerCase().includes("show")) {
                                                    navmeshEntity = "<a-entity id=\x22nav-mesh\x22 nav-mesh gltf-model=\x22#" + m_assetID + "\x22></a-entity>";
                                                }
                                            }
                                        }
                                        
                                        rightRot = !rightRot;
                                        if (rightRot == true) {
                                            rotVal = -360;
                                        }
                                        var eSplit = locMdl.eventData.split("~");
                                        if (eSplit[0] == "orbit") { 
                                            offsetPos =  "<a-entity position=\x22"+ eSplit[1] + " 0 0\x22></a-entity>";
                                            cannedAnim = "animation=\x22property: rotation; to: 0 " + (ry - 360) + " 0; loop: true; dur: 10000\x22";

                                            // cannedAnim = "";
                                        } else if (locMdl.eventData.includes("rotate")) {
                                            let duration = 50000;
                                            if (locMdl.eventData.includes("slow"))
                                            duration = 100000;
                                            if (locMdl.eventData.includes("fast"))
                                            duration = 10000;
                                            cannedAnim = "animation=\x22property: rotation; to: 0 360 0; loop: true; dur: "+duration+"\x22";
                                            if (locMdl.eventData.includes("-rotate"))
                                            cannedAnim = "animation=\x22property: rotation; to: 0 -360 0; loop: true; dur: "+duration+"\x22";
                                        } else {
                                            // objAnim = "animation-mixer=\x22clip: "+eSplit[0]+"\x22 animation__yoyo=\x22property: position; dir: alternate; dur: 10000; easing: easeInSine; loop: true;\x22>";
                                            // objAnim = "animation-mixer=\x22clip: "+eSplit[0]+"; timeScale:"+speed+";\x22";
                                            objAnim = "";
                                        }
                                        if (locMdl.eventData.includes("ground")) {
                                            locMdl.y = 0;
                                        }
                                        if (eSplit[0] == "yoyo" || eSplit[1] == "yoyo") {
                                            cannedAnim = "animation__yoyo=\x22property: position; dir: alternate; dur: 10000; easing: easeInSine; loop: true; to: "+locMdl.x+" "+(parseFloat(locMdl.y) + 2)+" "+locMdl.z+"\x22";
                                        }
                                        posAnim = "animation__pos=\x22property: position; to: random-position; dur: 15000; loop: true;";
                                        if (locMdl.eventData.toLowerCase().includes("ambientchild"))  {
                                            ambientChild = "ambientChild"; //follow ambient obj
                                        }
                                        // if (locMdl.eventData.toLowerCase().includes("beat"))  {
                                        //     ambientChild = ambientChild + " beatscale "; //follow ambient obj
                                        // }
                                        if (locMdl.eventData.toLowerCase().includes("scatter"))  {
                                            // ambientChild = "ambientChild"; //follow ambient obj
                                        }
                                   
                                    } else {
                                        locMdl.eventData = ""; //WTF?! uh, dunno
                                    }
                                    if (locMdl.markerType != null && locMdl.markerType != undefined && locMdl.markerType.length > 1) {  
                                        entityType = locMdl.markerType; //e.g. "target"
                                        if (entityType == "poi") { //bc location-fu looks for this class to get gpsElements, so this causes dupes
                                            entityType = "model";
                                        }
                                        if (locMdl.eventData.toLowerCase().includes("surface")) {
                                            entityType = "surface";
                                        }

                                    }
                                    if (locMdl.latitude != null && locMdl.longitude != null && locMdl.latitude != 0 && locMdl.longitude != 0) { 
                                        console.log(" lat/lng model " + JSON.stringify(locMdl));
                                        // gltfsAssets = gltfsAssets + "<a-asset-item id=\x22" + m_assetID + "\x22 src=\x22"+ modelURL +"\x22></a-asset-item>";
                                        gltfsAssets = gltfsAssets + "<a-asset-item id=\x22" + locMdl.modelID + "\x22 src=\x22"+ modelURL +"\x22></a-asset-item>";
                                        gltfsEntities = gltfsEntities + "<a-entity class=\x22geo\x22 scale=\x22"+scale+" "+scale+" "+scale+"\x22 data-scale=\x22"+scale+"\x22 mod_model=\x22markerType: "+locMdl.markerType+"; tags: "+locationTags+"; eventData:"+locMdl.eventData+"\x22 class=\x22gltf "+entityType+" "+ambientChild+" activeObjexGrab activeObjexRay\x22 shadow=\x22cast:true; receive:true\x22 "+geoEntity+"=\x22latitude: "+locMdl.latitude+
                                        // "; latitude: "+locMdl.longitude+";\x22 "+skyboxEnvMap+"  class=\x22gltf\x22 gltf-model=\x22#" + m_assetID + "\x22 "+objAnim+" "+cannedAnim+" scale=\x22"+scale+" "+scale+" "+scale+"\x22 rotation=\x22"+rotation+"\x22 >" + offsetPos+ "</a-entity>";
                                        "; longitude: "+locMdl.longitude+";\x22 "+skyboxEnvMap+" gltf-model=\x22#" + m_assetID + "\x22 "+objAnim+" "+cannedAnim+" rotation=\x22"+rotation+"\x22 >" + offsetPos+ "</a-entity>";
                                        
                                        callbackz(); //this or one below exits loop
                                    } else {
                                       
                                        //// scene type filters...
                                        if (sceneResponse.sceneWebType == "ThreeJS") { //three
                                            if (sceneResponse.sceneFaceTracking ) {
                                                console.log("face tracking asset at " + modelURL);
                                                gltfsAssets = {};
                                                gltfsAssets.modelURL = modelURL;
                                                gltfsAssets.offsetX = locMdl.x;
                                                gltfsAssets.offsetY = locMdl.y;
                                                gltfsAssets.scale = scale;
                                            } else {
                                                gltfsAssets = gltfsAssets +
                                                "loader.load(\n"+
                                                "\x22"+modelURL+"\x22,\n"+
                                                // called when the resource is loaded
                                                "function ( gltf ) {\n"+
                                                    "scene.add( gltf.scene );\n"+
                                                 
                                                    "if (!gltf.scene) return;\n" +
                                                    "gltf.scene.traverse(function (node) {\n" +
                                                        "if (node.material && 'envMap' in node.material) {\n" +
                                                        "node.material.envMap = envMap;\n" +
                                                        "node.material.envMap.intensity = 1;\n" +
                                                        "node.material.needsUpdate = true;\n" +
                                                        "}\n" +
                                                    "});\n" +
                                                    "gltf.scene.position.set("+locMdl.x+", "+locMdl.y+", "+locMdl.z+");\n"+
                                                    "gltf.scene.rotation.set("+rx+", "+ry+", "+rz+");\n"+
                                                    "gltf.scene.scale.set("+scale+", "+scale+", "+scale+");\n"+
                                                "},\n"+
                                                // called while loading is progressing
                                                "function ( xhr ) {\n"+
                                                    "console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );\n"+
                                                    "},\n"+
                                                // called when loading has errors
                                                "function ( error ) {\n"+
                                                    "console.log( 'An error happened' );\n"+
                                                    "}\n"+
                                                ");\n";
                                            }
                                            console.log("face tracking asset at " + modelURL);
                                           
                                        } else if (sceneResponse.sceneWebType == "BabylonJS") { //babylon, not really...
                                            gltfsAssets = gltfsAssets + "var lookCtrl = null;\nBABYLON.SceneLoader.ImportMesh('', '', \x22"+modelURL+"\x22, scene, function (meshes, particleSystems, skeletons) {"+
                                            "meshes[0].scaling = new BABYLON.Vector3("+scale+", "+scale+", "+scale+");\n"+
                                            "meshes[0].position = new BABYLON.Vector3("+locMdl.x+", "+locMdl.y+", "+locMdl.z+");\n"+
                                            "meshes[0].rotation = new BABYLON.Vector3("+rx+", "+ry+", "+rz+");\n"+
                                           
                                            "for (var m = 0; m < meshes.length; m++){\n"+ //find mesh named eye
                                                "console.log(meshes[m].material);\n"+
                                                // "meshes[m].material.environmentTexture = new BABYLON.CubeTexture('', scene, undefined, undefined, "+JSON.stringify( cubeMapAsset)+");" +
                                                "if (meshes[m].name.includes(\x22eyeball\x22)) {"+
                                                   
                                                    "console.log(meshes[m].name);"+
                                                    "let characterMesh = meshes[m];"+
                                                    "for (var b = 0; b < skeletons[0].bones.length - 1; b++){\n"+ //then find bone named eye //NM, pointless - can't use bone with gltf :(
                                                       
                                                        "if (skeletons[0].bones[b].name == \x22Eye\x22) {\n"+
                                                            // "skeletons[0].bones.lookAt(mainCam.position);"+
                                                            "console.log(skeletons[0].bones[b].name);\n"+
                                                            "scene.beginAnimation(skeletons[0], 0, 100, true, 1.0);\n"+
                                                            // "let lookCtrl = new BABYLON.BoneLookController(meshes[0], skeletons[0].bones[b], mainCam.position, {adjustYaw:Math.PI*.5, adjustPitch:Math.PI*.5, adjustRoll:Math.PI});\n"+
                                                            "var skeleton = skeletons[0];\n"+
                                                            "var time = 0;\n"+
                                                            "var state = 'Initial';\n"+
                                                            "var lastAppliedQuat = new BABYLON.Quaternion();\n"+
                                                            "var stateTime = 0;\n"+
                                                            "var timingFunc = (x) => Math.cos(x * Math.PI) * -0.5 + 0.5;\n"+
                                                            // var cubeTex = new BABYLON.CubeTexture("", scene, );
                                                            "scene.registerBeforeRender(function(){\n" +
                                                            
                                                           "});\n"+
                                                            
                                                        "}\n"+
                                                    "}\n"+
                                                    //  "lookCtrl = new BABYLON.BoneLookController(characterMesh, skeletons[0].bones[m], mainCam.position, {adjustYaw:Math.PI*.5, adjustPitch:Math.PI*.5, adjustRoll:Math.PI});\n"+
                                                "}\n"+
                                            "}\n"+

                                            "});\n";
                                        } else { //aframe !!!
                                            // let zFix = parseFloat(locMdl.z) * -1; //fix to match unity 
                                            let zFix = parseFloat(locMdl.z); //nope

                                            if (locMdl.eventData.toLowerCase().includes("navmesh")) { //regress for now, this is "real" vs simple navmesh...
                                               
                                                if (locMdl.eventData.toLowerCase().includes("simple navmesh")) {
                                                    useSimpleNavmesh = true;
                                                }
                                                console.log("GOTSA NAVMESH!! use simple " + useSimpleNavmesh);
                                                // navmesh = "nav-mesh";
                                                // gltfsEntities = gltfsEntities +"<a-entity nav-mesh normal-material visible=\x22false\x22 position=\x22"+locMdl.x+" "+locMdl.y+" "+zFix+"\x22 rotation=\x22"+rotation+"\x22 scale=\x22"+scale+" "+scale+" "+scale+"\x22 gltf-model=\x22#" + m_assetID + "\x22></a-entity>";
                                                // gltfsEntities = gltfsEntities +"<a-entity visible=\x22false\x22 position=\x22"+locMdl.x+" "+locMdl.y+" "+zFix+"\x22 rotation=\x22"+rotation+"\x22 gltf-model=\x22#" + m_assetID + "\x22 nav-mesh normal-material></a-entity>";
                                                // gltfsAssets = gltfsAssets + "<a-asset-item id=\x22" + m_assetID + "\x22 src=\x22"+ modelURL +"\x22></a-asset-item>";
                                                // gltfsEntities = gltfsEntities +"<a-entity visible=\x22false\x22 gltf-model=\x22#" + m_assetID + "\x22 nav-mesh></a-entity>";

                                            } else {
                                                // console.log("LOCMDL eventDATA is : " + locMdl.eventData.toLowerCase());

                                                gltfsAssets = gltfsAssets + "<a-asset-item class=\x22gltfAssets\x22 id=\x22" + m_assetID + "\x22 src=\x22"+ modelURL +"\x22></a-asset-item>";
                                                
                                                // let yRot 
                                                let scatterSurface = "";
                                                let brownian = "";
                                                let id = "gltf_" + m_assetID;
                                                if (locMdl.eventData.toLowerCase().includes("surface")) {
                                                    scatterSurface = "scatter-surface";
                                                    id = 'scatterSurface';
                                                    entityType = "surface";

                                                }
                                                let modModel = "mod_model=\x22markerType: "+locMdl.markerType+"; tags: "+locMdl.locationTags+"; eventData:"+locMdl.eventData+"\x22";
                                                // let modMaterial = "";
                                                if (locMdl.eventData.toLowerCase().includes("gallery")) {
                                                    // modModel = "mod_model_photo_gallery";  maybe later
                                                }
                                                if (!locMdl.eventData.toLowerCase().includes("scatter")) { //normal placement
                                                    let physicsMod = "";
                                                    let shape = 'hull';
                                                    if (locMdl.eventData.toLowerCase().includes('physics')){ //ammo for now
                                                    // let isTrigger = false;
                                                    
                                                        if (locMdl.eventData.toLowerCase().includes('static')){
                                                            // physicsMod = "ammo-body=\x22type: static\x22 ammo-shape=\x22type: box\x22";
                                                            // physicsMod = "ammo-body=\x22type: static\x22 ammo-shape=\x22type: box\x22";
                                                            physicsMod = "mod_physics=\x22body: static; shape: mesh;\x22"
                                                        }
                                                        if (locMdl.eventData.toLowerCase().includes('dynamic')){
                                                            // physicsMod = "ammo-body=\x22type: static\x22 ammo-shape=\x22type: box\x22";
                                                            // physicsMod = "ammo-body=\x22type: static\x22 ammo-shape=\x22type: box\x22";
                                                            physicsMod = "mod_physics=\x22body: dynamic; shape: box;\x22"
                                                            
                                                        }
                                                    }
                                                    if (locMdl.eventData.toLowerCase().includes("shader")) {
                                                        if (locMdl.eventData.toLowerCase().includes("noise")) {
                                                            console.log("TRYNA PUT A SHADER@@");
                                                            // modMaterial = "material=\x22shader: noise;\x22";
                                                            modModel = "mod_model=\x22markerType: "+locMdl.markerType+"; tags: "+locMdl.locationTags+"; eventData:"+locMdl.eventData+"; shader: noise\x22";
                                                            let vertexShader  = requireText('../main/src/shaders/noise1_vertex.glsl', require);
                                                            let fragmentShader = requireText('../main/src/shaders/noise1_fragment.glsl', require);
                                                            shaderScripts = "<script type=\x22x-shader/x-vertex\x22 id=\x22noise1_vertex\x22>"+vertexShader+"</script>"+
                                                            "<script type=\x22x-shader/x-fragment\x22 id=\x22noise1_fragment\x22>"+fragmentShader+"</script>";
                                                        }
                                                    }
                                                    if (locMdl.eventData.toLowerCase().includes("brownian")) {
                                                        if (locMdl.eventData.toLowerCase().includes("brownian path")) {
                                                            brownian = "brownian-path=\x22lineEnd:100000;lineStep:100;count:200;object:#thing-to-clone;positionVariance:88 33 86;spaceVectorOffset:101.1,100,100.2,101.2,100,100.3;rotationFollowsAxis:x;speed:0.01;\x22";
                                                            gltfsEntities = gltfsEntities + "<a-gltf-model shadow src=\x22#"+m_assetID+"\x22 id=\x22thing-to-clone\x22 visible=\x22true\x22></a-gltf-model>"+
                                                            "<a-entity "+brownian+
                                                            " shadow=\x22cast:true; receive:true\x22 "+skyboxEnvMap+" position=\x22"+locMdl.x+" "+locMdl.y+" "+zFix+"\x22 scale=\x22"+scale+
                                                            " "+scale+" "+scale+"\x22 data-scale=\x22"+scale+"\x22 rotation=\x22"+rotation+"\x22 >" + offsetPos+ "</a-entity>";
                                                        } else {
                                                            brownian = "brownian-motion=\x22speed:0.1;rotationVariance:.2 .2 .2;positionVariance:2.5 5 2.5;spaceVector:10.1,20.1,30.1,10.1,20.1,30.1;\x22";
                                                            gltfsEntities = gltfsEntities + "<a-entity id=\x22"+id+"\x22 "+brownian+" "+followCurve+" "+physicsMod+" "+modelParent+" "+scatterSurface+" "+modModel+" class=\x22envMap gltf "+entityType+" "+ambientChild+
                                                            " activeObjexGrab activeObjexRay\x22 shadow=\x22cast:true; receive:true\x22 "+skyboxEnvMap+" gltf-model=\x22#" + m_assetID + "\x22 "+objAnim+" "+cannedAnim+
                                                            // " position=\x22"+locMdl.x+" "+locMdl.y+" "+zFix+"\x22 scale=\x22"+scale+" "+scale+" "+scale+"\x22 rotation=\x22"+rotation+"\x22 >" + offsetPos+ "</a-entity>";  //rem rotation bc navmesh donutlike
                                                            " position=\x22"+locMdl.x+" "+locMdl.y+" "+zFix+"\x22 scale=\x22"+scale+" "+scale+" "+scale+"\x22 data-scale=\x22"+scale+"\x22 rotation=\x22"+rotation+"\x22 >" + offsetPos+ "</a-entity>"; 
                                                            gltfModel = modelURL;
                                                        }
                                                        
                                                    } else {
                                                        gltfsEntities = gltfsEntities + "<a-entity id=\x22"+id+"\x22 "+followCurve+" "+physicsMod+" "+modelParent+" "+scatterSurface+" "+modModel+" class=\x22envMap gltf "+entityType+" "+ambientChild+
                                                        " activeObjexGrab activeObjexRay\x22 shadow=\x22cast:true; receive:true\x22 "+skyboxEnvMap+" gltf-model=\x22#" + m_assetID + "\x22 "+objAnim+" "+cannedAnim+
                                                        // " position=\x22"+locMdl.x+" "+locMdl.y+" "+zFix+"\x22 scale=\x22"+scale+" "+scale+" "+scale+"\x22 rotation=\x22"+rotation+"\x22 >" + offsetPos+ "</a-entity>";  //rem rotation bc navmesh donutlike
                                                        " position=\x22"+locMdl.x+" "+locMdl.y+" "+zFix+"\x22 scale=\x22"+scale+" "+scale+" "+scale+"\x22 data-scale=\x22"+scale+"\x22 rotation=\x22"+rotation+"\x22 >" + offsetPos+ "</a-entity>"; 
                                                        gltfModel = modelURL;
                                                    }

                                                    // gltfsEntities = gltfsEntities + "<a-entity id=\x22"+id+"\x22 "+brownian+" "+followCurve+" "+physicsMod+" "+modelParent+" "+scatterSurface+" "+modModel+" class=\x22envMap gltf "+entityType+" "+ambientChild+
                                                    // " activeObjexGrab activeObjexRay\x22 shadow=\x22cast:true; receive:true\x22 "+skyboxEnvMap+" gltf-model=\x22#" + m_assetID + "\x22 "+objAnim+" "+cannedAnim+
                                                    // // " position=\x22"+locMdl.x+" "+locMdl.y+" "+zFix+"\x22 scale=\x22"+scale+" "+scale+" "+scale+"\x22 rotation=\x22"+rotation+"\x22 >" + offsetPos+ "</a-entity>";  //rem rotation bc navmesh donutlike
                                                    // " position=\x22"+locMdl.x+" "+locMdl.y+" "+zFix+"\x22 scale=\x22"+scale+" "+scale+" "+scale+"\x22 data-scale=\x22"+scale+"\x22 rotation=\x22"+rotation+"\x22 >" + offsetPos+ "</a-entity>"; 
                                                    // gltfModel = modelURL;
                                                } else { //placement instancing + surface scattering
                                                    console.log("tryna scatter so0methings!@ " + locMdl.eventData.toLowerCase());
                                                    let instancing = "instanced_meshes_mod=\x22_id: "+locMdl.modelID+"; modelID: "+m_assetID+";\x22";
                                                    let interaction = "";
                                                    if (locMdl.eventData.toLowerCase().includes("everywhere")) {
                                                        
                                                        if (locMdl.eventData.toLowerCase().includes('growpop')) {
                                                            interaction = " interaction: growpop; ";
                                                        } else if (locMdl.eventData.toLowerCase().includes('shrinkpop')) {
                                                            interaction = " interaction: shrinkpop; ";
                                                        } else if (locMdl.eventData.toLowerCase().includes('wiggle')) {
                                                            interaction = " interaction: wiggle; ";
                                                        }
                                                        instancing = "instanced_meshes_sphere=\x22_id: "+locMdl.modelID+"; modelID: "+m_assetID+"; "+interaction+"\x22"; //scatter random sphere, e.g. in the sky..
                                                        // console.log("instancing is " + instancing);
                                                    }
                                                    
                                                    // console.log("locMdl is " + JSON.stringify(locMdl));
                                                    if (locMdl.eventData.toLowerCase().includes("grass")) {
                                                        instancing = "instanced_surface_meshes=\x22_id: "+locMdl.modelID+"; modelID: "+m_assetID+"; yMod: "+locMdl.y+"; count: 3000; scaleFactor: 6\x22";
                                                    } else if (locMdl.eventData.toLowerCase().includes("plants")) {
                                                        instancing = "instanced_surface_meshes=\x22_id: "+locMdl.modelID+"; modelID: "+m_assetID+"; yMod: "+locMdl.y+"; count: 500; scaleFactor: 8\x22";
                                                    } else if (locMdl.eventData.toLowerCase().includes("shrooms")) {
                                                        instancing = "instanced_surface_meshes=\x22_id: "+locMdl.modelID+"; modelID: "+m_assetID+"; yMod: "+locMdl.y+"; count: 50; scaleFactor: 2\x22";
                                                    } else if (locMdl.eventData.toLowerCase().includes("rocks")) {
                                                        instancing = "instanced_surface_meshes=\x22_id: "+locMdl.modelID+"; modelID: "+m_assetID+"; yMod: "+locMdl.y+"; count: 200; scaleFactor: 32\x22";
                                                    } else if (locMdl.eventData.toLowerCase().includes("~")) {
                                                        let split = locMdl.eventData.split("~");
                                                        if (split.length) {
                                                            instancing = "instanced_surface_meshes=\x22_id: "+locMdl.modelID+"; modelID: "+m_assetID+"; yMod: "+locMdl.y+"; count: "+split[1]+"; scaleFactor: "+scale+"; tags: "+locMdl.locationTags+"\x22";
                                                            // console.log("!!!tryna spoolit scatter dasta..." + instancing);
                                                            if (locMdl.eventData.toLowerCase().includes("everywhere")) {
                                                                instancing = "instanced_meshes_sphere=\x22_id: "+locMdl.modelID+"; modelID: "+m_assetID+"; count: "+split[1]+"; scaleFactor: "+scale+";"+interaction+"\x22"; //scatter everywhere, e.g. in the sky..
                                                                // console.log("instancing is " + instancing);
                                                            }
                                                        }
                                                    }
                                                    let modelString = "gltf-model=\x22#" + m_assetID + "\x22";

                                                    gltfsEntities = gltfsEntities + "<a-entity id=\x22"+id+"\x22 "+instancing+" class=\x22"+entityType+
                                                    " activeObjexGrab activeObjexRay\x22 shadow=\x22cast:true; receive:true\x22 "+skyboxEnvMap+
                                                    " position=\x220 -20 0\x22></a-entity>"+//scatter model below
                                                    " <a-entity id=\x22"+locMdl.modelID+"\x22 "+modelParent+" "+modModel+" class=\x22gltf "+entityType+ 
                                                    " activeObjexGrab activeObjexRay\x22 shadow=\x22cast:true; receive:true\x22 "+skyboxEnvMap+" "+modelString+" "+objAnim+" "+cannedAnim+
                                                    // " activeObjexGrab activeObjexRay\x22 shadow=\x22cast:true; receive:true\x22 "+skyboxEnvMap+" gltf-model=\x22#" + m_assetID + "\x22 "+objAnim+" "+cannedAnim+
                                                    " position=\x220 -10 0\x22></a-entity>"; 

                                                    gltfModel = modelURL;
                                                   
                                                }
                                            }
                                        }
                                        callbackz();
                                        }
                                    } else { //if not item_type "glb", either usdz or reality //TODO select on location view?
                                        
                                        assetUserID = asset.userID;
                                        // var sourcePath =   "servicemedia/users/" + assetUserID + "/usdz/" + locMdl.gltf;
                                        // let assetType = "usdz";
                                        // if (asset.type == "reality")
                                        let modelURL = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + assetUserID + "/" + asset.item_type + "/" + asset.filename, Expires: 6000});
                                        console.log("non-gltf modelURL " + modelURL + " modelType " + asset.item_type);
                                        usdzFiles = modelURL;
                                        
                                        loadUSDZ = "ready(function(){\n" +
                                        "let usdzDataEntity = document.getElementById(\x22usdzData\x22);\n"+
                                        // "console.log('tryna set audioEventData: '" + JSON.stringify(sceneResponse.sceneLocations)+");\n"+
                                        // "SetPrimaryAudioEventsData("+JSON.stringify(JSON.stringify(primaryAudioObject))+");\n"+
                                        "usdzDataEntity.setAttribute(\x22usdz\x22, \x22usdzData\x22, \x22"+usdzFiles+"\x22);\n"+ 
                                        "});";
                                              
                                        usdzModel = modelURL;
                                        // console.log(loadUSDZ);
                                        callbackz();
                                    }
                                    } 
                                });
                                } else {
                                    callbackz();
                                }
                            // } else {
                            //     callbackz(); //if "noweb"
                            // }
                        }, function(err) {
                        
                            if (err) {
                                console.log('A file failed to process');
                                callbackz(err);
                            } else {
                                callback(null);
                            }
                        });
                    } else {
                        callback(null);
                    }
                },
                function (callback) {
                    // console.log("attributions 2" + JSON.stringify(attributions));
                    if (attributions != null && attributions != undefined && attributions.length > 0) {
                      
                        attributionsObject.attributions = attributions;

                    let attrib64 = Buffer.from(JSON.stringify(attributionsObject)).toString("base64");
                        attributionsTextEntity = attributionsTextEntity + "<a-entity id=\x22attributionsEntity\x22 data-attributions=\x22"+attrib64+"\x22 attributions_text_control></a-entity>";
                        callback();
                    } else {
                        callback();
                    } 
                },
               
                
                function (callback) {
                    if (sceneResponse.sceneNextScene != null && sceneResponse.sceneNextScene != "") { 
                        db.scenes.findOne({$or: [ { short_id: sceneResponse.sceneNextScene }, { sceneTitle: sceneResponse.sceneNextScene } ]}, function (err, scene) {
                            if (scene == err) {
                                // console.log("didn't find next scene");
                            } else {
                                nextLink = "href=\x22../" + scene.short_id + "\x22";    
                                sceneNextScene = scene.short_id;
                            }
                        }); 
                    } else {
                        nextLink = "href=\x22../4K94Gjtw7\x22";    
                        sceneNextScene = "4K94Gjtw7";
                    }
                    if (sceneResponse.scenePreviousScene != null && sceneResponse.scenePreviousScene != "") {
                        db.scenes.findOne({$or: [ { short_id: sceneResponse.scenePreviousScene }, { sceneTitle: sceneResponse.scenePreviousScene } ]}, function (err, scene) {
                            if (scene == err) {
                                // console.log("didn't find prev scene");
                            } else {
                                prevLink = "href=\x22../" + scene.short_id + "/index.html\x22";    
                            }
                        }); 
                    }
                    callback();
                },
                function (callback) {
                    if (sceneResponse.sceneText != null && sceneResponse.sceneText != "" && sceneResponse.sceneText.length > 0) {
                        // contentUtils = "<script src=\x22../main/src/component/content-utils.js\x22></script>"; 

                        if (!textLocation.length > 0) {textLocation = "-10 1.5 -5";}
                        // console.log("tryna get sceneText!");
                        let mainText = sceneResponse.sceneText.replace(/([\"]+)/gi, '\'');
                        mainText = mainText.replace(/([\;]+)/gi, '\:');

                        let maintext64 = Buffer.from(JSON.stringify(sceneResponse.sceneText)).toString("base64");
                        // let maintext64 = cleanbase64(sceneResponse.sceneText);
                        // let maintext64 = "<div id=\x22restrictToLocation\x22 data-location='"+buff+"'></div>";
                        // mainText = sceneResponse.sceneText;
                        mainTextEntity = "<a-entity look-at=\x22#player\x22 scale=\x22.75 .75 .75\x22 position=\x22"+textLocation+"\x22>"+
                                "<a-entity "+skyboxEnvMap+" id=\x22mainTextToggle\x22 class=\x22envMap activeObjexRay\x22 position=\x220 -.5 .5\x22 toggle-main-text  gltf-model=\x22#exclamation\x22></a-entity>"+
                                "<a-entity id=\x22mainTextPanel\x22 visible='false' position=\x220 0 0\x22>" +
                                "<a-entity id=\x22mainTextHeader\x22 visible='false' geometry=\x22primitive: plane; width: 4; height: 1\x22 position=\x220 7.25 0\x22 material=\x22color: grey; transparent: true; opacity: 0.0\x22" +
                                "text=\x22value:; wrap-count: 40;\x22></a-entity>" +
                                // "<a-entity id=\x22mainText\x22 main-text-control=\x22mainTextString: "+mainText.replace(/([^a-z0-9\,\?\'\-\_\.\!\*\&\$\n\~]+)/gi, ' ')+"; mode: "+sceneResponse.scenePrimaryTextMode+"\x22 geometry=\x22primitive: plane; width: 4.5; height: 6\x22 position=\x220 6.75 0\x22 material=\x22color: grey; transparent: true; opacity: 0.0\x22" +
                                // "<a-entity id=\x22mainText\x22 data-maintext=\x22"+maintext64+"\x22 main-text-control=\x22mainTextString: "+mainText.replace(/([^a-z0-9\,\(\)\?\'\-\_\.\!\*\&\$\n\~]+)/gi, ' ')+"; mode: "+sceneResponse.scenePrimaryTextMode+"\x22 geometry=\x22primitive: plane; width: 4.5; height: 6\x22 position=\x220 6.75 0\x22 material=\x22color: grey; transparent: true; opacity: 0.0\x22" +
                                "<a-entity id=\x22mainText\x22 data-maintext='"+maintext64+"' main-text-control=\x22mainTextString: ; mode: "+sceneResponse.scenePrimaryTextMode+"\x22 geometry=\x22primitive: plane; width: 4.5; height: 6\x22 position=\x220 6.75 0\x22 material=\x22color: grey; transparent: true; opacity: 0.0\x22" +

                                // "<a-entity id=\x22mainText\x22 main-text-control=\x22mainTextString: "+mainText+"; mode: "+sceneResponse.scenePrimaryTextMode+"\x22 geometry=\x22primitive: plane; width: 4.5; height: 6\x22 position=\x220 6.75 0\x22 material=\x22color: grey; transparent: true; opacity: 0.0\x22" +
                                "text=\x22value:; wrap-count: 30;\x22>" +
                                // "text=\x22value:"+sceneResponse.sceneText+"; wrap-count: 25;\x22>" +
                                "<a-entity visible='false' class=\x22envMap activeObjexRay\x22 id=\x22nextMainText\x22 gltf-model=\x22#next_button\x22 scale=\x22.5 .5 .5\x22 position=\x222 -8 1\x22></a-entity>" +
                                "<a-entity visible='false' class=\x22envMap activeObjexRay\x22 id=\x22previousMainText\x22 gltf-model=\x22#previous_button\x22 scale=\x22.5 .5 .5\x22 position=\x22-2 -8 1\x22></a-entity>" +
                                "<a-entity gltf-model=\x22#square_panel\x22 scale=\x223 4 3\x22 position=\x220 -3 -.5\x22></a-entity>" +
                            "</a-entity></a-entity></a-entity>";
                        callback();
                    } else {
                        callback();
                    }
                },
                function (callback) { 

                    if (sceneResponse.sceneTextItems != null && sceneResponse.sceneTextItems != undefined && sceneResponse.sceneTextItems != "") {
                        if (sceneResponse.sceneWebType != "HTML from Text Item") {
                        // for (let i = 0; i < sceneTextItems.length; i++) {
                            sceneTextItemData = "<div id=\x22sceneTextItems\x22 data-attribute=\x22"+sceneResponse.sceneTextItems+"\x22></div>"; 
                            // dialogButton = "<div class=\x22dialog_button\x22 style=\x22float: left; margin: 10px 10px;\x22 onclick=\x22SceneManglerModal('Welcome')\x22><i class=\x22fas fa-info-circle fa-2x\x22></i></div>";
                            if (!sceneResponse.sceneTextUseModals) {
                                //renderPanel = "<a-entity visible=\x22false\x22 render_canvas id=\x22renderCanvas\x22 look-at=\x22#player\x22 geometry=\x22primitive: plane; width:1; height:1;\x22 scale=\x221 1 1\x22 position=\x220 3.5 -.25\x22 material=\x22shader: html; transparent: true; width:1024; height:1024; fps: 10; target: #renderPanel;\x22></a-entity>\n";
                                renderPanel = "<a-entity use-textitem-modals></a-entity>\n";
                            } else {
                                renderPanel = "<a-entity use-textitem-modals></a-entity>\n";
                            }
                            callback();
                        } else {
                            // if (sceneResponse.sceneTextItems != null && sceneResponse.sceneTextItems != undefined && sceneResponse.sceneTextItems.length > 0) {
                            moids = ObjectID(sceneResponse.sceneTextItems[0]);
                            db.text_items.findOne({_id: moids}, function (err, text_item){
                                if (err || !text_item) {
                                    console.log("error getting text_items: " + err);
                                    sceneTextItemData = "no data found";
                                    callback(null);
                                } else {
                                    sceneTextItemData = text_item;
                                    callback(null)
                                }
                            });
                        }
                        // }
                    } else {
                        callback();
                    }

                 
                },
                function (callback) { //fethc audio items
                    
                    db.audio_items.find({_id: {$in: requestedAudioItems }}, function (err, audio_items) {
                        if (err || !audio_items) {
                            console.log("error getting audio items: " + err);
                            callback(null);
                        } else {
                            callback(null, audio_items) //send them along

                        }
                    });
                },
                
                function (audio_items, callback) { //add the signed URLs to the obj array 
                    for (var i = 0; i < audio_items.length; i++) { //?? TODO do this async - if it's slow shit might get out of whack//NOTE gonna pull audioevents from client, rather than jack in from here
                        // console.log("audio_item: " + JSON.stringify(audio_items[i]));
                        var item_string_filename = JSON.stringify(audio_items[i].filename);
                        item_string_filename = item_string_filename.replace(/\"/g, "");
                        var item_string_filename_ext = getExtension(item_string_filename);
                        var expiration = new Date();
                        expiration.setMinutes(expiration.getMinutes() + 1000);
                        var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                        //console.log(baseName);
                        var mp3Name = baseName + '.mp3';
                        var oggName = baseName + '.ogg';
                        var pngName = baseName + '.png';
                        // primaryAudioTitle = audio_items[i].filename;

                        if (sceneResponse.scenePrimaryAudioID != undefined && audio_items[i]._id == sceneResponse.scenePrimaryAudioID) {
                            primaryAudioTitle = audio_items[i].title;
                            primaryAudioObject = audio_items[i];
                        // primaryAudioWaveform = 
                            mp3url = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + mp3Name, Expires: 6000});
                            oggurl = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + oggName, Expires: 6000});
                            pngurl = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + pngName, Expires: 6000});
                            primaryAudioWaveform = pngurl;
                            pAudioWaveform = "<img id=\x22primaryAudioWaveform\x22 crossorigin=\x22anonymous\x22 src=\x22"+primaryAudioWaveform+"\x22>";
                        }
                        if (sceneResponse.sceneAmbientAudioID != undefined && audio_items[i]._id == sceneResponse.sceneAmbientAudioID) {
                            ambientOggUrl = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + oggName, Expires: 6000});
                            ambientMp3Url = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + mp3Name, Expires: 6000});
                        }                        
                        if (sceneResponse.sceneTriggerAudioID != undefined && audio_items[i]._id == sceneResponse.sceneTriggerAudioID) {
                            triggerOggUrl = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + oggName, Expires: 6000});
                            triggerMp3Url = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + mp3Name, Expires: 6000});
                        }

                        if (audio_items[i].sourceText != undefined && audio_items[i].sourceText != null && audio_items[i].sourceText != "") {
                            let newAttribution = {};
                                    
                            newAttribution.name = audio_items[i].title;
                            newAttribution._id = audio_items[i]._id;
                            
                            newAttribution.sourceTitle = audio_items[i].sourceTitle;
                            newAttribution.sourceLink = audio_items[i].sourceLink;
                            newAttribution.authorName = audio_items[i].authorName;
                            newAttribution.authorLink = audio_items[i].authorLink;
                            newAttribution.license = audio_items[i].license;
                            newAttribution.sourceText = audio_items[i].sourceText;
                            newAttribution.modifications = audio_items[i].modifications;
                            attributions.push(newAttribution);
                        }
                        // console.log("copying audio to s3...");
                    }
                    callback(null);
                },
                function (callback) {
                    
                    if (sceneResponse.scenePrimaryAudioID != null && sceneResponse.scenePrimaryAudioID.length > 4) {
                        hasPrimaryAudio = true;
                    }
                    if (sceneResponse.scenePrimaryAudioStreamURL != null && sceneResponse.scenePrimaryAudioStreamURL.length > 4) {
                        hasPrimaryAudioStream = true;
                        hasPrimaryAudio = false;
                    }
                    // console.log("primaryAudioTitle: " + primaryAudioTitle); 
                    if (hasPrimaryAudioStream || hasPrimaryAudio) {
                        if (sceneResponse.scenePrimaryAudioTitle != null && sceneResponse.scenePrimaryAudioTitle != undefined && sceneResponse.scenePrimaryAudioTitle.length > 0) {
                            primaryAudioTitle = sceneResponse.scenePrimaryAudioTitle;    
                        } 
                        console.log("primaryAudioTitle: " + primaryAudioTitle); 
                    }
                    if (sceneResponse.sceneAmbientAudioID != null && sceneResponse.sceneAmbientAudioID.length > 4) {
                        hasAmbientAudio = true;
                    }
                    if (sceneResponse.sceneTriggerAudioID != null && sceneResponse.sceneTriggerAudioID.length > 4) {
                        hasTriggerAudio = true;
                    }
                    if (sceneResponse.scenePrimaryAudioTitle != null && sceneResponse.scenePrimaryAudioTitle != undefined && sceneResponse.scenePrimaryAudioTitle.length > 0) {
                        primaryAudioTitle = sceneResponse.scenePrimaryAudioTitle;
                        console.log("primaryAudioTitle: " + primaryAudioTitle); 
                    }
                    if (sceneResponse.scenePrimaryVolume != null) {
                        scenePrimaryVolume = sceneResponse.scenePrimaryVolume;
                    }
                    if (sceneResponse.sceneAmbientVolume != null) {
                        sceneAmbientVolume = sceneResponse.sceneAmbientVolume;
                    }
                    if (sceneResponse.sceneTriggerVolume != null) {
                        sceneTriggerVolume = sceneResponse.sceneTriggerVolume;
                    }
                    if (hasSynth) {
                        synthScripts = "<script src=\x22../main/src/synth/Tone.js\x22></script><script src=\x22../main/js/synth.js\x22></script>";
                    }
                    if (hasPrimaryAudio) {

                        if (sceneResponse.sceneWebType == "ThreeJS") {
                                
                            // create an AudioListener and add it to the camera
                            primaryAudioScript = "var listener = new THREE.AudioListener();\n"+
                            "camera.add( listener );\n"+
                            // create the PositionalAudio object (passing in the listener)
                            "primaryAudio = new THREE.PositionalAudio( listener );\n"+
                            // load a sound and set it as the PositionalAudio object's buffer
                            "var primaryAudioLoader = new THREE.AudioLoader();\n"+
                            "var sphere = new THREE.SphereBufferGeometry( 1, 32, 32 );\n"+
                            "var material = new THREE.MeshPhongMaterial( { color: 'red' } );\n"+
                            "var primaryAudioMesh = new THREE.Mesh( sphere, material );\n"+
                            "primaryAudioLoader.load( \x22"+oggurl+"\x22, function( buffer ) {\n"+
                                "primaryAudio.setBuffer( buffer );\n"+
                                "primaryAudio.setRefDistance( 20 );\n"+
                                "primaryAudioMesh.material.color = new THREE.Color( 'green' );\n"+
                                "primaryAudioStatusText.set({content: \x22ready\x22, fontColor: new THREE.Color( 'green' )});\n"+
                                
                                // "primaryAudio.play();\n"+
                            "});\n"+
                            // create an object for the sound to play from

                            "primaryAudioMesh.userData.name = 'primaryAudioMesh';\n"+
                            "primaryAudioMesh.position.set("+audioLocation+");\n"+
                            "scene.add( primaryAudioMesh );\n"+
                            // finally add the sound to the mesh
                            "primaryAudioMesh.add( primaryAudio );\n";
                            
                        } else { //aframe below
                            let html5 = "html5: true,";
                            if (sceneResponse.scenePrimaryAudioVisualizer == true) {  //audio analysis won't work in html5 mode
                                html5 = "html5: false,";
                            } 
                            primaryAudioScript = "<script>\n" +      
                            "let primaryAudioHowl = new Howl({" + //inject howler for non-streaming
                                    "src: [\x22"+oggurl+"\x22,\x22"+mp3url+"\x22], "+html5+" ctx: true, volume: 0," + loopable +
                                "});" +
                            "primaryAudioHowl.load();</script>";
                            // primaryAudioControl = "<script src=\x22../main/src/component/primary-audio-control.js\x22></script>";
                            primaryAudioEntity = "<a-entity audio-play-on-window-click id=\x22primaryAudioParent\x22 look-at=\x22#player\x22 position=\x22"+audioLocation+"\x22>"+ //parent
                           
                            
                            "<a-entity gltf-model=\x22#backpanel_horiz1\x22 position=\x220 -1.25 0\x22 material=\x22color: black; transparent: true;\x22></a-entity>" +
                            // "<a-image id=\x22primaryAudioWaveformImageEntity\x22 position = \x220 -.1 0\x22 width=\x221\x22 height=\x22.25\x22 src=\x22#primaryAudioWaveform\x22 crossorigin=\x22anonymous\x22 transparent=\x22true\x22></a-image>"+
                            // "</a-entity>"+
                            // "<a-entity gltf-model=\x22#audioplayer\x22 scale=\x221 1 1\x22 position=\x220 0 -.2\x22></a-entity>" +
                            "<a-entity position=\x220 -1.25 0\x22 primary_audio_player id=\x22primaryAudioPlayer\x22 gltf-model=\x22#audioplayer\x22></a-entity>"+
                            // "<a-entity id=\x22primaryAudioText\x22 geometry=\x22primitive: plane; width: 1; height: .30\x22 position=\x22-.85 -.2 -1\x22 material=\x22color: grey; transparent: true; opacity: 0.0\x22"+
                            "<a-entity id=\x22primaryAudioText\x22 position=\x22.5 0 -1\x22 "+
                            "text=\x22value:Click to play;\x22></a-entity>"+
                            // "<a-entity id=\x22primaryAudio\x22 mixin=\x22grabmix\x22 class=\x22activeObjexGrab activeObjexRay\x22 entity-callout=\x22calloutString: 'play/pause'\x22 primary_audio_control=\x22oggurl: "+oggurl+"; mp3url: "+mp3url+"; audioID: "+sceneResponse.scenePrimaryAudioID+"; volume: "+scenePrimaryVolume+"; audioevents:"+sceneResponse.scenePrimaryAudioTriggerEvents+"; targetattach:"+sceneResponse.sceneAttachPrimaryAudioToTarget+"; autoplay: "+sceneResponse.sceneAutoplayPrimaryAudio+";"+
                            // "title: "+primaryAudioTitle+"\x22 geometry=\x22primitive: sphere; radius: .175;\x22 material=\x22shader: noise;\x22 position=\x220 -.5 -1\x22>"+
                            "<a-entity id=\x22primaryAudio\x22 primary_audio_control=\x22oggurl: "+oggurl+"; mp3url: "+mp3url+"; audioID: "+sceneResponse.scenePrimaryAudioID+"; volume: "+scenePrimaryVolume+"; audioevents:"+sceneResponse.scenePrimaryAudioTriggerEvents+"; targetattach:"+sceneResponse.sceneAttachPrimaryAudioToTarget+"; autoplay: "+sceneResponse.sceneAutoplayPrimaryAudio+";"+
                            "title: "+primaryAudioTitle+"\x22>"+
                            
                            "</a-entity>"+
                            
                            "</a-entity>";
                            // "<a-entity gltf-model=\x22#play_button\x22 scale=\x22.15 .1 .1\x22 position=\x220 0 -.2\x22 material=\x22color: black; transparent: true; opacity: 0.1\x22></a-entity>" +
                            if (sceneResponse.scenePrimaryAudioTriggerEvents) {
                                // loadAudioEvents = "ready(function(){\n" +
                                // "let paecontrol = document.getElementById(\x22primaryAudio\x22);\n"+
                                // "paecontrol.setAttribute(\x22primary_audio_events\x22, \x22jsonData\x22, "+JSON.stringify(JSON.stringify(primaryAudioObject))+");\n"+ //double stringify! yes, it's needed
                                // "});";
                            var buff = Buffer.from(JSON.stringify(primaryAudioObject)).toString("base64");
                            loadAudioEvents = "<a-entity primary_audio_events id=\x22audioEventsData\x22 data-audio-events='"+buff+"'></a-entity>"; 
                            }
                        }
                    }
                    if (hasPrimaryAudioStream) {
                        mp3url = sceneResponse.scenePrimaryAudioStreamURL;   
                        oggurl = sceneResponse.scenePrimaryAudioStreamURL;                    
                        streamPrimaryAudio = true;
                        primaryAudioScript = "<script>Howler.autoUnlock = false;" + //override if streaming url
                        "let primaryAudioHowl = new Howl({" + //inject howler for non-streaming
                                "src: \x22"+sceneResponse.scenePrimaryAudioStreamURL+"\x22, html5: true, volume: 0, format: ['mp3', 'aac']" +
                            "});" +
                        "</script>";
                        // primaryAudioControl = "<script src=\x22../main/src/component/primary-audio-control.js\x22></script>";
                        primaryAudioEntity = "<a-entity id=\x22primaryAudioParent\x22 look-at=\x22#player\x22 position=\x22"+audioLocation+"\x22>"+ //parent
                        "<a-entity id=\x22primaryAudioText\x22 geometry=\x22primitive: plane; width: 1; height: .30\x22 position=\x220 0 2.5\x22 material=\x22color: grey; transparent: true; opacity: 0.0\x22"+
                        "text=\x22value:Click to play;\x22></a-entity>"+
                        "<a-entity gltf-model=\x22#landscape_panel\x22 scale=\x22.15 .1 .1\x22 position=\x220 0 2.4\x22 material=\x22color: black; transparent: true; opacity: 0.1\x22></a-entity>" +
                        "<a-entity id=\x22primaryAudio\x22 mixin=\x22grabmix\x22 class=\x22activeObjexGrab activeObjexRay\x22 entity-callout=\x22calloutString: 'play/pause'\x22 primary_audio_control=\x22oggurl: "+oggurl+"; mp3url: "+mp3url+"; volume: "+scenePrimaryVolume+"; autoplay: "+sceneResponse.sceneAutoplayPrimaryAudio+";"+
                        "title: "+primaryAudioTitle+"\x22  geometry=\x22primitive: sphere; radius: .25;\x22 material=\x22shader: noise;\x22 position=\x22-1 0 2.6\x22></a-entity></a-entity>";
                    }
                    if (hasAmbientAudio) {
                        ambientAudioScript = "<script>" +      
                        "let ambientAudioHowl = new Howl({" + //inject howler for non-streaming
                                "src: [\x22"+ambientOggUrl+"\x22,\x22"+ambientMp3Url+"\x22], volume: 0, loop: true" + 
                            "});" +
                        "ambientAudioHowl.load();</script>";
                        ambientAudioControl = "<script src=\x22../main/src/component/ambient-audio-control.js\x22></script>";
                        let ambientPosAnim = "animation__yoyo=\x22property: position; to: -33 3 0; dur: 60000; dir: alternate; easing: easeInSine; loop: true;\x22 ";
                        let ambientRotAnim = "animation__rot=\x22property:rotation; dur:60000; to: 0 360 0; loop: true; easing:linear;\x22 ";        
                        // posAnim = "animation__pos=\x22property: position; to: random-position; dur: 15000; loop: true;";  
                        ambientAudioEntity = "<a-entity "+ambientRotAnim+"><a-entity id=\x22ambientAudio\x22 ambient_audio_control=\x22oggurl: "+ambientOggUrl+"; mp3url: "+ambientMp3Url+";\x22 volume: "+sceneAmbientVolume+"; "+
                        // "geometry=\x22primitive: sphere; radius: .5\x22 "+ambientPosAnim+" position=\x2233 3 0\x22>" +
                        ambientPosAnim+" position=\x2233 3 0\x22>" +
                        "</a-entity></a-entity>";
                    }
                    if (hasTriggerAudio) {
                      
                        triggerAudioEntity = "<a-entity id=\x22triggerAudio\x22 trigger_audio_control=\x22volume: "+sceneTriggerVolume+"\x22>"+
                        "</a-entity>";
                        triggerAudioScript = "<script>" +      
                        "let triggerAudioHowl = new Howl({" + //inject howler for non-streaming
                                "src: [\x22"+triggerOggUrl+"\x22,\x22"+triggerMp3Url+"\x22], volume: 1, loop: false" + 
                            "});" +
                        "triggerAudioHowl.load();</script>";
                    
                    }
                    
                 
                        callback();
                    // }  
                },
                function (callback) { //fethc video items
                    if (sceneResponse.sceneVideos != null && sceneResponse.sceneVideos.length > 0) {
                        sceneResponse.sceneVideos.forEach(function (vid) {
                            // console.log("looking for sceneVideo : " + JSON.stringify(vid));
                            var p_id = ObjectID(vid); //convert to binary to search by _id beloiw
                            requestedVideoItems.push(p_id); //populate array
                        });
                        db.video_items.find({_id: {$in: requestedVideoItems}}, function (err, video_items) {
                            if (err || !video_items) {
                                console.log("error getting video items: " + err);
                                callback(null, new Array());
                            } else {
                                //console.log("gotsome video items: " + JSON.stringify(video_items[0]));

                                callback(null, video_items) //send them along
                            }
                        });
                    } else {
                        callback(null, new Array());
                    }
                },

                function (video_items, callback) { //add the signed URLs to the obj array
                    preloadVideo = true; //FOR NOW - testing on ios, need to set a toggle for this...
              
                    if (video_items != null && video_items[0] != null) { //only single vid for now, need to loop array

                        console.log("video_item: " + JSON.stringify(video_items[0]));
                        var item_string_filename = JSON.stringify(video_items[0].filename);
                        item_string_filename = item_string_filename.replace(/\"/g, "");
                        var item_string_filename_ext = getExtension(item_string_filename);
                        var expiration = new Date();
                        expiration.setMinutes(expiration.getMinutes() + 1000);
                        var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                        var namePlusExtension = baseName + item_string_filename_ext.toLowerCase();
                        //console.log("mp4 video: " + mp4Name + " " + video_items[0]._id);
                        console.log("gotsa vid with ext : "+item_string_filename_ext.toLowerCase()); 
                        let mov = "";
                        let webm = "";
                        let vidSrc = "";
                        var vid = video_items[0]._id;
                        var ori = video_items[0].orientation != null ? video_items[0].orientation : "";
                        if (item_string_filename_ext.toLowerCase() == ".mp4" || item_string_filename_ext.toLowerCase() == ".mkv") { //single src OK for these
                            vidUrl = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + video_items[0].userID + "/video/" + vid + "/" + vid + "." + namePlusExtension, Expires: 6000});
                            vidSrc = "<source src=\x22"+vidUrl+"\x22 type=\x22video/mp4\x22>";
                        } else {
                            //for transparent video, need both mov + webm!
                            if (item_string_filename_ext.toLowerCase() == ".mov") {
                                mov = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + video_items[0].userID + "video/" + vid + "/" + vid + "." + namePlusExtension, Expires: 6000});
                                for (let i = 0; i < video_items.length; i++) {
                                    if (video_items[0]._id != video_items[i]._id) {
                                        if (video_items[0].title == video_items[i].title) {
                                            console.log("found a webm to match the mov");
                                            webm = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + video_items[i].userID + "/" + video_items[i]._id + "." +  video_items[i].filename, Expires: 6000});
                                            vidSrc = "<source src=\x22"+webm+"\x22 type=\x22video/webm\x22><source src=\x22"+mov+"\x22 type=\x22video/webm\x22>";
                                        }
                                    }
                                }
                                
                            }
                            if (item_string_filename_ext.toLowerCase() == ".webm") {
                                webm = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + video_items[0].userID + "/" + vid + "." + namePlusExtension, Expires: 6000});
                                for (let i = 0; i < video_items.length; i++) {
                                    if (video_items[0]._id != video_items[i]._id) {
                                        if (video_items[0].title == video_items[i].title) {
                                            console.log("found a mov to match the webm " + video_items[0]._id + " vs " + video_items[i]._id);
                                            mov = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + video_items[i].userID + "/" + video_items[i]._id + "." + video_items[i].filename, Expires: 6000});
                                            vidSrc = "<source src=\x22"+webm+"\x22 type=\x22video/webm\x22><source src=\x22"+mov+"\x22 type=\x22video/quicktime\x22>";
                                        }
                                    }
                                }  
                            }
                        }
                    
                        if (ori.toLowerCase() == "equirectangular") {
                            videosphereAsset = "<video id=\x22videosphere\x22 autoplay loop crossOrigin=\x22anonymous\x22 src=\x22" + vidUrl + "\x22></video>";
                            videoEntity = "<a-videosphere play-on-window-click play-on-vrdisplayactivate-or-enter-vr crossOrigin=\x22anonymous\x22 src=\x22#videosphere\x22 rotation=\x220 180 0\x22 material=\x22shader: flat;\x22></a-videosphere>";

                        } else {
                            if (preloadVideo) {
                               
                                videoAsset = "<video id=\x22video1\x22 crossOrigin=\x22anonymous\x22>"+vidSrc+"</video>";
                            } else {
                                videoAsset = "<video autoplay muted loop=\x22true\x22 webkit-playsinline playsinline id=\x22video1\x22 crossOrigin=\x22anonymous\x22></video>"; 
                            }

                            videoEntity = "<a-entity "+videoParent+" class=\x22activeObjexGrab activeObjexRay\x22 vid_materials=\x22url: "+vidUrl+"\x22 gltf-model=\x22#movieplayer2.glb\x22 position=\x22"+videoLocation+"\x22 rotation=\x22"+videoRotation+"\x22 width='10' height='6'><a-text id=\x22videoText\x22 align=\x22center\x22 rotation=\x220 0 0\x22 position=\x22-.5 -1 1\x22 wrapCount=\x2240\x22 value=\x22Click to Play Video\x22></a-text>" +
                            "</a-entity>";
                        }

                        callback(null);
                    } else {
                        callback(null);
                    }
                },
                function (callback) {
                    console.log("videoGroups: " + sceneResponse.sceneVideoGroups);
                    if (sceneResponse.sceneVideoGroups != null && sceneResponse.sceneVideoGroups.length > 0) {
                        vgID = sceneResponse.sceneVideoGroups[0];
                        let oo_id = ObjectID(vgID);

                        db.groups.find({"_id": oo_id}, function (err, groups) {
                            if (err || !groups) {
                                callback();
                            } else {
                            // console.log("gotsa group: "+ JSON.stringify(groups));
                            async.each(groups, function (groupID, callbackz) { 
                                let vidGroup = {};
                                vidGroup._id = groups[0]._id;
                                vidGroup.name = groups[0].name;
                                vidGroup.userID = groups[0].userID;
                                let ids = groups[0].items.map(convertStringToObjectID);
                                // let modImages =
                                db.video_items.find({_id : {$in : ids}}, function (err, videos) { // get all the image records in group
                                    if (err || !videos) {
                                        callbackz();
                                    } else {
                                        async.each(videos, function(video, cbimage) { //jack in a signed url for each
                                            video.url = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + video.userID + "/video/" + video._id + "/" + video._id + "." + video.filename, Expires: 6000}); //TODO: puthemsina video folder!
                                            cbimage();
                                        }, 
                                        function (err) {
                                            if (err) {
                                                vidGroup.videos = videos;
                                                console.log("vidgroup error " + err);
                                             
                                                callbackz();
                                            } else {
                                                vidGroup.videos = videos;
                                                requestedVideoGroups.push(vidGroup);

                                                callbackz();
                                            }
                                        });
                                    }
                                });
                            },
                            function (err) {
                                if (err) {
                                    console.log('A file failed to process');
                                    callback(null);
                                } else {
                                    console.log('All vidGroups processed successfully');
                                    videoElements = ""; //jack in video elements, ios don't like them cooked up in script
                                    for (let i = 0; i < requestedVideoGroups[0].videos.length; i++ ) {  //TODO spin first and second level array
                                        // videoElements = videoElements + "<video style=\x22display: none;\x22 loop=\x22true\x22 preload=\x22metadata\x22 type=\x22video/mp4\x22 crossOrigin=\x22anonymous\x22 src=\x22"+requestedVideoGroups[0].videos[i].url+"\x22 playsinline webkit-playsinline id=\x22"+requestedVideoGroups[0].videos[i]._id+"\x22></a-video>";
                                        videoElements = videoElements + "<video style=\x22display: none;\x22 loop=\x22true\x22 crossorigin=\x22use-credentials\x22 webkit-playsinline playsinline id=\x22"+requestedVideoGroups[0].videos[i]._id+"\x22></video>";
                                       
                                    }

                                    var buff = Buffer.from(JSON.stringify(requestedVideoGroups)).toString("base64");
                                    videoGroupsEntity = "<a-entity video_groups_data id=\x22videoGroupsData\x22 data-video-groups='"+buff+"'></a-entity>"; 
                                    hlsScript = "<script src=\x22../main/js/hls.min.js\x22></script>"; //v 1.0.6 client hls player ref
                                    callback(null);
                                }
                            });
                            // callback();
                            }
                        });
                    } else {
                        callback();
                    }

                },
               
                function (callback) { 
                    
   
                        let youtubeSniffer = "";
                        let iosIcon = "<span class=\x22apple_no\x22>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>";
                        let androidIcon = "<span class=\x22android_no\x22>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>";
                        let windowsIcon = "<span class=\x22windows_no\x22>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>";
                        let getAppLink = "<span class=\x22smallfont\x22><a class=\x22btn\x22 href=\x22https://servicemedia.net/landing/builds\x22 target=\x22_blank\x22>Get the app</a></span>&nbsp;";

                        let connectLink = "<span class=\x22smallfont\x22><a class=\x22btn\x22 href=\x22https://strr.us/connect/?scene="+sceneResponse.short_id+"\x22 target=\x22_blank\x22>Connect</a></span>&nbsp;";
                        let loginLink = "<span class=\x22smallfont\x22><a class=\x22btn\x22 href=\x22https://servicemedia.net/main/login.html\x22 target=\x22_blank\x22>Login</a></span>";
                        let primaryAudioSliderChunk = "";
                        let ambientAudioSliderChunk = "";
                        let triggerAudioSliderChunk = "";
                        let keynote = "<span class=\x22smallfont\x22>Keynote: "+sceneResponse.sceneKeynote+ "</span><hr>";
                        let desc = "<span class=\x22smallfont\x22>Description: "+sceneResponse.sceneDescription+ "</span><hr>";
                        let hasApp = false;
                        let appButtons = "";
                        if (!isGuest) {
                            loginLink = "";
                        }
                        if (sceneResponse.sceneIosOK) {
                            iosIcon = "<a href=\x22servicemedia://scene?" + sceneResponse.short_id + "\x22><span class=\x22apple_yes\x22>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></a>";
                            hasApp = true;
                        } 
                        if (sceneResponse.sceneAndroidOK) {
                            androidIcon = "<a href=\x22servicemedia://scene?" + sceneResponse.short_id + "\x22><span class=\x22android_yes\x22>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></a>";
                            hasApp = true;
                        }
                        if (sceneResponse.sceneWindowsOK) {
                            windowsIcon = "<a href=\x22servicemedia://scene?" + sceneResponse.short_id + "\x22><span class=\x22windows_yes\x22>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></a>";
                            hasApp = true;
                        } 
                        if (hasApp) {
                            appButtons = getAppLink + androidIcon +"&nbsp;&nbsp;"+ windowsIcon  +"&nbsp;&nbsp;"+ iosIcon + "&nbsp;&nbsp;<a href=\x22servicemedia://scene?" + sceneResponse.short_id + "\x22 class=\x22btn\x22 type=\x22button\x22>App Link</a><br><hr>"; 
                        }
                        if (sceneResponse.sceneYouTubeIDs != null && sceneResponse.sceneYouTubeIDs.length > 0) {
                            // yotubes = sceneResponse.sceneYouTubeIDs;
                            let youtubeVolume = sceneResponse.sceneMediaAudioVolume != undefined ? sceneResponse.sceneMediaAudioVolume : 80;
                            for (let i = 0; i < sceneResponse.sceneYouTubeIDs.length; i++) {
                                
                                youtubeContent = "<div width=\x22240\x22 id=\x22youtubeElement\x22 data-yt_id=\x22"+sceneResponse.sceneYouTubeIDs[i]+"\x22 data-sceneTitle=\x22"+sceneResponse.sceneTitle+"\x22></div>"+
                                
                                "<script>\n"+
                                    "var tag = document.createElement('script');\n"+
                                    "tag.src = \x22//www.youtube.com/iframe_api\x22;\n"+
                                    "var firstScriptTag = document.getElementsByTagName('script')[0];\n"+
                                    "firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);\n"+
                                "</script>";
                                
                                youtubeEntity = "<a-entity id=\x22youtubeParent\x22 look-at=\x22#player\x22 position=\x22-6 2 -6\x22>"+

                                "<a-entity id=\x22youtubePlayer\x22 position=\x220 -1 1\x22 gltf-model=\x22#youtubeplayer\x22 youtube_player=\x22yt_id: "+sceneResponse.sceneYouTubeIDs[i]+"; volume: "+youtubeVolume+"\x22></a-entity>"+
                                "<a-text wrapCount=\x2270\x22 value=\x22"+sceneResponse.sceneTitle+"\x22 width=\x222\x22 position=\x22-.95 .65 1.1\x22 id=\x22youtubeTitle\x22></a-text>"+
                                "<a-text width=\x223\x22 position=\x22-.95 -.3 1.1\x22 id=\x22youtubeState\x22></a-text>"+
                                "<a-text width=\x223\x22 position=\x22-.95 -.4 1.1\x22 id=\x22youtubeStats\x22></a-text>"+
                                "</a-entity>";
                            }
                        }
                        if (hasPrimaryAudio || hasPrimaryAudioStream) {
                            primaryAudioSliderChunk = "<a href=\x22#\x22 style=\x22float: right;\x22 onclick=PlayPausePrimaryAudio() id=\x22primaryAudioPlayPause\x22 class=\x22btn tooltip\x22 type=\x22button\x22>"+
                            "Play/Pause Primary Audio<span class=\x22tooltiptext\x22>"+primaryAudioTitle+"</span></a></span><br>"+
                            "<span id=\x22primaryAudioVolume\x22>Primary Volume</span><div class=\x22slidecontainer\x22>"+
                            // "<a href=\x22#\x22 class=\x22btn\x22 type=\x22button\x22>Play</a>"+
                            "<input type=\x22range\x22 min=\x22-80\x22 max=\x2220\x22 value=\x22"+scenePrimaryVolume+"\x22 class=\x22slider\x22 id=\x22primaryAudioVolumeSlider\x22>" +
                            "</div>";
                        }
                        if (hasAmbientAudio) {
                            ambientAudioSliderChunk = "<span id=\x22ambientAudioVolume\x22>Ambient Volume</span><div class=\x22slidecontainer\x22><input type=\x22range\x22 min=\x22-80\x22 max=\x2220\x22 value=\x22"+sceneAmbientVolume+"\x22 class=\x22slider\x22 id=\x22ambientAudioVolumeSlider\x22></div>";
                        }
                        if (hasTriggerAudio) {
                            triggerAudioSliderChunk = "<span id=\x22triggerAudioVolume\x22>Trigger Volume</span><div class=\x22slidecontainer\x22><input type=\x22range\x22 min=\x22-80\x22 max=\x2220\x22 value=\x22"+sceneTriggerVolume+"\x22 class=\x22slider\x22 id=\x22triggerAudioVolumeSlider\x22></div>";
                        }
                        userText = "<div class=\x22smallfont\x22><span id=\x22userName\x22 class=\x22\x22>Welcome " + avatarName+ "</span>!&nbsp;&nbsp;<button onclick=\x22Disconnect()\x22 type=\x22button\x22 class=\x22btn\x22>Disconnect</button></div><hr>";
                        if (isGuest) {
                            userText = "<div><span id=\x22userName\x22 class=\x22smallfont\x22>Welcome Guest known as " + avatarName+ "</span>"+
                            //loginLink +
                            "<button onclick=\x22Disconnect()\x22 type=\x22button\x22 class=\x22btn\x22>Disconnect</button></div>\n"+
                            "<hr>";
                        }
                        let fromBy = "<div><span class=\x22smallfont\x22>From: <a href=\x22http://"+sceneResponse.sceneDomain+"\x22>" +sceneResponse.sceneDomain+ "</a><br><hr>By: " + sceneResponse.userName+ "</span></div><hr>\n";
                        // 
                        screenOverlay = "<div class=\x22screen-overlay\x22>" +
                        "<button id=\x22screenOverlayCloseButton\x22 type=\x22button\x22 class=\x22screen-overlay-close-button\x22>Close View</button><br>"+


                        "</div>";
                        audioSliders = "<div id=\x22audioSliders\x22 style=\x22visibility: hidden\x22>"+primaryAudioSliderChunk + ambientAudioSliderChunk + triggerAudioSliderChunk+"</div>";
                        
                        mapOverlay = "<div class=\x22map-overlay\x22 id=\x22mapElement\x22>" +
                        "<button id=\x22mapOverlayCloseButton\x22 type=\x22button\x22 class=\x22screen-overlay-close-button\x22>Close Map</button><br>"+
                        "</div>";
                        
                        canvasOverlay = "<div id=\x22canvasOverlay\x22 class=\x22canvas-overlay\x22><button id=\x22sceneTitleButton\x22 type=\x22button\x22 class=\x22collapsible\x22>"+sceneResponse.sceneTitle+"</button>" +

                        "<div id=\x22overlayContent\x22 class=\x22content\x22>" + youtubeContent +"<hr>"+ fromBy + keynote + desc + appButtons +
                        
                        userText +
                        
                        "<div class=\x22smallfont\x22><span id=\x22users\x22></span></div>"+ 
                      
                        "<hr><div>"+
                        "<div style=\x22float:right; margin: 5px 10px 5px; 0;\x22 onclick=\x22SceneManglerModal('Events')\x22><i class=\x22fas fa-stopwatch \x22></i></div>"+
                        "<div style=\x22float:right; margin: 5px 10px 5px; 0px;\x22 onclick=\x22SceneManglerModal('Locations')\x22><i class=\x22fas fa-globe \x22></i></div>"+
                        "<div style=\x22float:right; margin: 5px 10px 5px; 0;\x22 onclick=\x22SceneManglerModal('Tools')\x22><i class=\x22fas fa-tools \x22></i></div>"+
                        "<div style=\x22float:right;margin: 5px 10px 5px; 0px;\x22 onclick=\x22SceneManglerModal('Messages')\x22><i class=\x22fas fa-comments \x22></i></div></div>"+
                        "<div style=\x22float:right;margin: 5px 10px 5px; 0px;\x22 onclick=\x22SceneManglerModal('Inventory')\x22><i class=\x22fas fa-suitcase \x22></i></div>"+
                        mapStyleSelector +
                        "</div>"+
                       
                        "<div>"+
                        mapButtons +
                     
                        "</div></div>";

                    
                            console.log("sceneShowAds: " + sceneResponse.sceneShowAds);
                        if (sceneResponse.sceneShowAds != null && sceneResponse.sceneShowAds != undefined && sceneResponse.sceneShowAds != false) { //put the ads if you must..   
                            adSquareOverlay = "<script async src=\x22https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js\x22></script>"+
                            
                            "<div id=\x22adSquareOverlay\x22 class=\x22ad-overlay\x22>" +
                        
                            "<!-- square floater 1 -->"+
                            "<ins class=\x22adsbygoogle\x22"+
                              
                            "style=\x22display:inline-block;width:150px;height:400px\x22"+
                                "data-ad-client=\x22ca-pub-5450402133525063\x22"+
                                "data-ad-slot=\x225496489247\x22></ins>"+
                                // "<br><button id=\x22adSquareCloseButton\x22 type=\x22button\x22 class=\x22closeable\x22>Close Ad</button>"+
                            "</div>" +
                            "<br><br><button id=\x22adSquareCloseButton\x22 type=\x22button\x22 class=\x22closeable\x22>Close Ad</button>"+
                            "<script>"+
                                "(adsbygoogle = window.adsbygoogle || []).push({});"+
                            "</script>"+
                            "<script>"+
                               
                            "</script>";
                        }
                        callback(null);
                    
                },

                function (callback) {
                    var postcards = [];
                    // console.log("sceneResponse.scenePostcards: " + JSON.stringify(sceneResponse.scenePostcards));
                    if (sceneResponse.scenePostcards != null && sceneResponse.scenePostcards.length > 0) {
                        var index = 0;
                        async.each(sceneResponse.scenePostcards, function (postcardID, callbackz) { //nested async-ery!
                            index++;
                            var oo_id = ObjectID(postcardID);
                            // console.log("index? " + index);

                            db.image_items.findOne({"_id": oo_id}, function (err, picture_item) {

                                bucketFolder = sceneResponse.sceneDomain;
                                // console.log("params " + JSON.stringify(params)); 
                                if (err || !picture_item) {
                                    console.log("error getting postcard " + postcardID + err);
                                    callbackz();
                                } else {
                                    var params = {
                                        Bucket: sceneResponse.sceneDomain,
                                        Key: sceneResponse.short_id + "/"+ postcardID + ".standard." + picture_item.filename
                                    }
                                    s3.headObject(params, function(err, data) { //check that the postcard is pushed to static route
                                        if (err) {
                                            console.log("postcard missing from static route, tryna copy to " + sceneResponse.sceneDomain);
                                            s3.copyObject({Bucket: bucketFolder, CopySource: 'servicemedia/users/' + picture_item.userID +"/pictures/"+ picture_item._id + ".standard." + picture_item.filename,
                                                Key: sceneResponse.short_id + "/"+ picture_item._id + ".standard." + picture_item.filename}, function (err, data) {
                                                if (err) {
                                                    console.log("ERROR copyObject" + err);
                                                    callbackz();
                                                }
                                                else {
                                                    console.log('SUCCESS copyObject');
                                                    index++;
                                                   
                                                    postcard1 = sceneResponse.sceneDomain +"/"+sceneResponse.short_id +"/"+ picture_item._id + ".standard." + picture_item.filename;
                                                   
                                                    callbackz();
                                                }
                                            });
                                        } else {
                                            index++;
                                            postcard1 = sceneResponse.sceneDomain +"/"+sceneResponse.short_id +"/"+ picture_item._id + ".standard." + picture_item.filename;
                                           
                                            callbackz();
                                        }
                                        
                                    });
                                    
                                    }
                                });
                            },
                            function (err) {                       
                                if (err) {
                                    console.log('A file failed to process');
                                    callback();
                                } else {
                                 
                                    callback();
                                }
                            });
                        } else {
                            callback();
                        }
                },
                function (callback) {
                    console.log("pictureGroups: " + sceneResponse.scenePictureGroups);
                    if (sceneResponse.scenePictureGroups != null && sceneResponse.scenePictureGroups.length > 0) {
                        pgID = sceneResponse.scenePictureGroups[0];
                        let oo_id = ObjectID(pgID);
                        

                        db.groups.find({"_id": oo_id}, function (err, groups) {
                            if (err || !groups) {
                                callback();
                            } else {
                           
                            async.each(groups, function (groupID, callbackz) { 
                                let picGroup = {};
                                picGroup._id = groups[0]._id;
                                picGroup.name = groups[0].name;
                                picGroup.userID = groups[0].userID;
                                let ids = groups[0].items.map(convertStringToObjectID);
                                // let modImages =
                                db.image_items.find({_id : {$in : ids}}, function (err, images) { // get all the image records in group
                                    if (err || !images) {
                                        callbackz();
                                    } else {
                                        async.each(images, function(image, cbimage) { //jack in a signed url for each
                                            if (image.orientation != null && image.orientation != undefined && image.orientation.toLowerCase() == "equirectangular") { 
                                                skyboxIDs.push(image._id);
                                                image.url = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + image.userID + "/pictures/originals/" + image._id + ".original." + image.filename, Expires: 6000});
                                                cbimage();
                                            } else {
                                                image.url = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + image.userID + "/pictures/" + image._id + ".standard." + image.filename, Expires: 6000}); //i.e. 1024
                                                cbimage();
                                            }
                                            
                                            
                                        }, 
                                        function (err) {
                                            if (err) {
                                                picGroup.images = images;
                                                console.log("picturegroup error " + err);
                                             
                                                callbackz();
                                            } else {
                                                picGroup.images = images;
                                                requestedPictureGroups.push(picGroup);
                                            
                                                callbackz();
                                            }
                                        });
                                    }
                                });
                            },
                            function (err) {
                                if (err) {
                                    console.log('A file failed to process');
                                    callback(null);
                                } else {
                                    console.log('All pictureGroups processed successfully');
                                    // pictureGroupsEntity = "<a-entity scale=\x22.75 .75 .75\x22 look-at=\x22#player\x22 position=\x22-4 2 -3\x22>"+ 
                                    pictureGroupsEntity = "<a-entity scale=\x22.75 .75 .75\x22 look-at=\x22#player\x22 position=\x22"+picturegroupLocation+"\x22>"+ 
                                    "<a-entity position=\x220 -2.5 0\x22 scale=\x22.75  .75 .75\x22 id=\x22pictureGroupsControl\x22 class=\x22envMap activeObjexRay\x22 "+skyboxEnvMap+" toggle-picture-group gltf-model=\x22#camera_icon\x22></a-entity>"+
                                    "<a-entity id=\x22pictureGroupPanel\x22 visible=\x22false\x22 position=\x220 -1 0\x22>"+
                                    "<a-entity id=\x22pictureGroupHeaderText\x22 geometry=\x22primitive: plane; width: 3.25; height: 1\x22 position=\x220 1.75 0\x22 material=\x22color: grey; transparent: true; opacity: 0.0\x22" +
                                    "text=\x22value:; wrap-count: 35;\x22></a-entity>" +
                                    // "<a-entity id=\x22availableSceneText\x22 class=\x22envMap activeObjexRay\x22 geometry=\x22primitive: plane; width: 4; height: 1\x22 position=\x220 1.5 0\x22 material=\x22color: grey; transparent: true; opacity: 0.0\x22" +
                                    // "text=\x22value:; wrap-count: 25;\x22></a-entity>" +
                                    // "<a-entity id=\x22availableSceneOwner\x22 class=\x22envMap activeObjexRay\x22  geometry=\x22primitive: plane; width: 4; height: 1\x22 position=\x220 .5 0\x22 material=\x22color: grey; transparent: true; opacity: 0.0\x22" +
                                    // "text=\x22value:; wrap-count: 25;\x22></a-entity>" +
                                    "<a-entity id=\x22pictureGroupPic\x22 visible=\x22true\x22 position=\x220 2.25 -.1\x22 gltf-model=\x22#landscape_panel\x22 scale=\x221 1 1\x22 material=\x22shader: flat; alphaTest: 0.5;\x22"+
                                    "rotation='0 0 0'></a-entity>"+
                                    // "<a-entity gltf-model=\x22#square_panel\x22 scale=\x222.25 2.25 2.25\x22 position=\x220 2.1 -.25\x22></a-entity>" +
                                    "<a-entity visible='true' class=\x22envMap activeObjexRay\x22 id=\x22pictureGroupNextButton\x22 gltf-model=\x22#next_button\x22 scale=\x22.5 .5 .5\x22 position=\x222.25 -.75 0\x22></a-entity>" +
                                    "<a-entity visible='true' class=\x22envMap activeObjexRay\x22 id=\x22pictureGroupPreviousButton\x22 gltf-model=\x22#previous_button\x22 scale=\x22.5 .5 .5\x22 position=\x22-2.25   -.75 0\x22></a-entity>" +
                                    "</a-entity></a-entity>";
                                    // loadPictureGroups = "ready(function(){\n" + //after page is ready..
                                    // "let pgcontrol = document.getElementById(\x22pictureGroupsControl\x22);\n"+
                                    // "console.log('tryna set availablescenes: ' + "+JSON.stringify(JSON.stringify(availableScenesResponse))+");"+
                                    // "pgcontrol.setAttribute(\x22picture_groups_control\x22, \x22jsonData\x22, "+JSON.stringify(JSON.stringify(requestedPictureGroups))+");\n"+ //double stringify! yes, it's needed
                                    var buff = Buffer.from(JSON.stringify(requestedPictureGroups)).toString("base64");
                                    pictureGroupsData = "<a-entity picture_groups_control id=\x22pictureGroupsData\x22 data-picture-groups='"+buff+"'></a-entity>"; //to be picked up by aframe, but data is in data-attribute

                                    "});";
                                    callback(null);
                                }
                            });
                            // callback();
                            }
                        });
                    } else {
                        callback();
                    }

                },
                function (callback) {
                    // var postcards = [];
                    // console.log("sceneResponse.scenePictures: " + JSON.stringify(sceneResponse.scenePictures));
                    if (sceneResponse.scenePictures != null && sceneResponse.scenePictures.length > 0) {
                        var index = 0;
                        // let picItemsPlaced = [];
                        let picLocationsPlaced = [];
                        let picIndex = 0;
                        async.each(sceneResponse.scenePictures, function (picID, callbackz) { //nested async-ery!
                                
                                var oo_id = ObjectID(picID);
                                db.image_items.findOne({"_id": oo_id}, function (err, picture_item) {
                                    if (err || !picture_item) {
                                        console.log("error getting scenePictures " + picID + err);
                                        callbackz();
                                    } else {
                                        // console.log("gotsa picture_item " + JSON.stringify(picture_item));
                                        
                                        var version = ".standard.";
                                        if (picture_item.orientation != undefined) {
                                            // if (picture_item.orientation.toLowerCase() == "equirectangular" && sceneResponse.sceneUseSkybox) {
                                            if (picture_item.orientation.toLowerCase() == "equirectangular") {
                                                // console
                                                skyboxID = picID;
                                                version = ".original.";
                                                fogSettings = "";
                                                skyboxIDs.push(picID);
                                                // convertEquirectToCubemap = "<script src=\x22../main/ref/aframe/dist/equirect-to-cubemap.js\x22></script>";
                                            }
                                        }
                                     
                                        
                                        let max = 30;
                                        let min = -30;
                                        let x = Math.random() * (max - min) + min;
                                        // let y = Math.random() * (max.y - min.y) + min.y;
                                        let z = Math.random() * (max - min) + min;
                                        if (z >= -15 && z <= 15) {
                                            if (z < 0) {
                                                z = -20;
                                            } else {
                                                z = 20;
                                            }
                                           
                                        }
                                        if (x >= -15 && z <= 15) {
                                            if (x < 0) {
                                                x = -20;
                                            } else {
                                                x = 20;
                                            }
                                            
                                        }
                                        index++;
                                        let position = x + " " + 2 + " " + z;
                                        let rotation = "0 90 0";
                                        image1url = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + picture_item.userID + "/pictures/" + picture_item._id + ".standard." + picture_item.filename, Expires: 6000});
                                        picArray.push(image1url);
                                        imageAssets = imageAssets + "<img id=\x22smimage" + index + "\x22 crossorigin=\x22anonymous\x22 src='" + image1url + "'>";
                                        let caption = "";
                                        if (picture_item.captionUpper != null && picture_item.captionUpper != undefined) {
                                            caption = "<a-text class=\x22pCap\x22 align=\x22center\x22 rotation=\x220 0 0\x22 position=\x220 1.3 -.1\x22 wrapCount=\x2240\x22 value=\x22"+picture_item.captionUpper+"\x22></a-text>";
                                        }
                                        let lowerCap = "";
                                        let actionCall = "";
                                        let link = "";
                                        let lookat = " look-at=\x22#player\x22 ";
                                        console.log("picLocations taken: " + picLocationsPlaced);
                                          
                                        if (picIndex < locationPictures.length) {
                                            position = locationPictures[picIndex].loc;
                                            rotation = locationPictures[picIndex].rot;
                                            if (locationPictures[picIndex].type.includes("fixed")) {
                                                console.log("fixed pic @ " + locationPictures[picIndex].loc);
                                                lookat = "";
                                            }
                                            picIndex++;
                                        } 
                                       
                                        if (picture_item.linkType != undefined && picture_item.linkType.toLowerCase() != "none") {
                                            if (picture_item.linkType == "NFT") { //never mind, these are old image target fu
                                              
                                            }
                                            if (picture_item.linkURL != undefined && !picture_item.linkURL.includes("undefined") && picture_item.linkURL.length > 6) {
                                                link = "basic-link=\x22href: "+picture_item.linkURL+";\x22 class=\x22activeObjexGrab activeObjexRay\x22";
                                            }
                                        }
                                        if (picture_item.useTarget != undefined && picture_item.useTarget != "") { //used by mindar - good stuff!
                                            console.log("GOTSA urlTarget " + picture_item.urlTarget);
                                            const targetURL = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + picture_item.userID + "/pictures/targets/" + picture_item._id + ".mind", Expires: 6000});
                                            arImageTargets.push(targetURL);
                                        

                                        }
                                        if (picture_item.hasAlphaChannel) {
                                            imageEntities = imageEntities + "<a-entity "+link+""+lookat+" geometry=\x22primitive: plane; height: 10; width: 10\x22 material=\x22shader: flat; transparent: true; src: #smimage" + index + "; alphaTest: 0.5;\x22"+
                                            " position=\x22"+position+"\x22 rotation=\x22"+rotation+"\x22 visible='true'>"+caption+"</a-entity>";
                                        } else {
                                            // if (picture_item.linkType != undefined && picture_item.orientation != "equirectangular" && picture_item.orientation != "Equirectangular") {
                                            if (picture_item.orientation != "equirectangular" && picture_item.orientation != "Equirectangular") {  //what if linkType is undefined?
 
                                            
                                                if (picture_item.orientation == "portrait" || picture_item.orientation == "Portrait") {
                                                    //console.log("gotsa portrait!");
                                                    imageEntities = imageEntities + "<a-entity "+link+""+lookat+"  mod-materials=\x22index:"+index+"\x22 gltf-model=\x22#portrait_panel\x22 material=\x22shader: flat; src: #smimage" + index + "; alphaTest: 0.5;\x22"+
                                                    " position=\x22"+position+"\x22 rotation=\x22"+rotation+"\x22 visible='true'>"+caption+"</a-entity>";
                                                } else if (picture_item.orientation == "square" || picture_item.orientation == "Square") {
                                                    imageEntities = imageEntities + "<a-entity "+link+""+lookat+"  mod-materials=\x22index:"+index+"\x22 gltf-model=\x22#square_panel\x22 scale=\x223 3 3\x22 material=\x22shader: flat; src: #smimage" + index + "; alphaTest: 0.5;\x22"+
                                                    " position=\x22"+position+"\x22 rotation=\x22"+rotation+"\x22 visible='true'>"+caption+"</a-entity>";
                                                } else if (picture_item.orientation == "circle" || picture_item.orientation == "Circle") {
                                                    imageEntities = imageEntities + "<a-entity "+link+""+lookat+"  mod-materials=\x22index:"+index+"\x22 gltf-model=\x22#circle_panel\x22 material=\x22shader: flat; src: #smimage" + index + "; alphaTest: 0.5;\x22"+
                                                    " position=\x22"+position+"\x22 rotation=\x22"+rotation+"\x22 visible='true'>"+caption+"</a-entity>";
                                                } else {
                                                    imageEntities = imageEntities + "<a-entity "+link+""+lookat+"  mod-materials=\x22index:"+index+"\x22 gltf-model=\x22#landscape_panel\x22 material=\x22shader: flat; src: #smimage" + index + "; alphaTest: 0.5;\x22"+
                                                    " position=\x22"+position+"\x22 rotation=\x22"+rotation+"\x22 visible='true'>"+caption+"</a-entity>";
                                                }
                                            }
                                        }
                                        callbackz();
                                    }
                                });
                            },
                            function (err) {
                            
                                if (err) {
                                    console.log('A file failed to process');
                                    callback(null);
                                } else {
                                    //console.log('All pictures processed successfully');
                                    callback(null);
                                }
                            });
                    } else {
                        //                      callback(null);
                        callback(null);
                    }
                },

                function (callback) {
                    var oo_id = null;
                    console.log("skybox ids beez " + JSON.stringify(skyboxIDs) + " vs single skyboxID " + skyboxID);
                    if (skyboxIDs.length > 0) {
                        // skyboxID = skyboxIDs[Math.floor(Math.random() * skyboxIDs.length)];
                        // oo_id =  ObjectID(skyboxID);
                    } 
                    if (skyboxID != "") {
                        oo_id = ObjectID(skyboxID); //set if there's an equirect pic, above
                    } else {
                        if (sceneResponse.sceneSkybox != null && sceneResponse.sceneSkybox != "") //old way
                        oo_id = ObjectID(sceneResponse.sceneSkybox);
                        //console.log("skybox chunck " + oo_id);
                    }
                  
                    if (oo_id) {
                        //console.log("skybox chunck " + oo_id);
                        db.image_items.findOne({"_id": oo_id}, function (err, picture_item) { //TODO - do it for the array, via async.each
                            if (err || !picture_item) {
                                console.log("error getting skybox " + sceneResponse.sceneSkybox + err);
                                callback(null);
                            } else {
                                let theKey = 'users/' + picture_item.userID + '/pictures/originals/' + picture_item._id + '.original.' + picture_item.filename;
                                //console.log("theKey " + theKey);
                                const params = {
                                    Bucket: 'servicemedia', 
                                    Key: theKey
                                };
                                s3.headObject(params, function(err, data) { //some old skyboxen aren't saved with .original. in filename, check for that
                                    
                                    if (err) {
                                    //   console.log("din't find skybox: " + err, err.stack);
                                            theKey = 'users/' + picture_item.userID + '/pictures/originals/' + picture_item.filename;
                                            skyboxUrl = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: theKey, Expires: 6000});
                                            skyboxAsset = "<img id=\x22sky\x22 crossorigin=\x22anonymous\x22 src='" + skyboxUrl + "'>";
                                        if (sceneResponse.sceneUseSkybox) {
                                            theKey = 'users/' + picture_item.userID + '/pictures/originals/' + picture_item.filename;
                                            skyboxUrl = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: theKey, Expires: 6000});
                                            skyboxAsset = "<img id=\x22sky\x22 crossorigin=\x22anonymous\x22 src='" + skyboxUrl + "'>";
                                        
                                            // let envMap = sceneResponse.sceneUseDynCubeMap ? "convert-to-envmap" : "";
                                            skySettings = "<a-sky crossorigin=\x22anonymous\x22 hide-in-ar-mode src=#sky></a-sky>";
                                            // aframeEnvironment = "";
                                            hemiLight = "<a-light id=\x22hemi-light\x22 type=\x22hemisphere\x22 color=\x22" + sceneResponse.sceneColor1 + "\x22 groundColor=\x22" + sceneResponse.sceneColor2 + "\x22 intensity=\x221\x22 position\x220 0 0\x22>"+
                                            "</a-light>";
                                        }
                                        callback(null);
                                    } else {
                                        //console.log("found skybox at " + theKey);
                                        skyboxUrl = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: theKey, Expires: 6000});
                                        skyboxAsset = "<img id=\x22sky\x22 crossorigin=\x22\anonymous\x22 src='" + skyboxUrl + "'>";

                                        if (sceneResponse.sceneUseSkybox) {
                                            // skyboxUrl = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: theKey, Expires: 6000});
                                            // skyboxAsset = "<img id=\x22sky\x22 crossorigin=\x22\anonymous\x22 src='" + skyboxUrl + "'>";
                                            // let envMap = sceneResponse.sceneUseDynCubeMap ? "convert-to-envmap" : "";
                                            // skySettings = "<a-sky hide-in-ar-mode "+envMap+" src=#sky></a-sky>";
                                            skySettings = "<a-sky crossorigin=\x22anonymous\x22 id=\x22skybox\x22 hide-in-ar-mode src=#sky></a-sky>";
                                            // if (sceneResponse.sceneUseSkybox) { //turn off env component entirely if 
                                            //     aframeEnvironment = "";
                                            // } else {
                                            // }
                                            hemiLight = "<a-light type=\x22hemisphere\x22 color=\x22" + sceneResponse.sceneColor1 + "\x22 groundColor=\x22" + sceneResponse.sceneColor2 + "\x22 intensity=\x221\x22 position\x220 0 0\x22>"+
                                            "</a-light>";
                                        }
                                        callback(null);
                                    }
                                });
                             
                            }
                        });
                    } else {
                        callback(null);
                    }
                },

                function (callback) {
                    let settings = {};  //TODO move this lower down? 

                    settings._id = sceneResponse._id;
                    settings.sceneTitle = sceneResponse.sceneTitle;
                    settings.sceneKeynote = sceneResponse.sceneKeynote;
                    settings.sceneDescription = sceneResponse.sceneDescription;
                    settings.sceneEventStart = sceneResponse.sceneEventStart;
                    settings.sceneEventEnd = sceneResponse.sceneEventEnd;
                    settings.hideAvatars = false;
                    settings.sceneSkyRadius = sceneResponse.sceneSkyRadius != undefined ? sceneResponse.sceneSkyRadius : 202;
                    settings.sceneColor1 = sceneResponse.sceneColor1;
                    settings.sceneColor2 = sceneResponse.sceneColor2;
                    settings.sceneColor3 = sceneResponse.sceneColor3;
                    settings.sceneColor4 = sceneResponse.sceneColor4;
                    settings.sceneColor1Alt = sceneResponse.sceneColor1Alt;
                    settings.sceneColor2Alt = sceneResponse.sceneColor2Alt;
                    settings.sceneColor3Alt = sceneResponse.sceneColor3Alt;
                    settings.sceneColor4Alt = sceneResponse.sceneColor4Alt;
                    settings.volumePrimary = sceneResponse.scenePrimaryVolume;
                    settings.volumeAmbient = sceneResponse.sceneAmbientVolume;
                    settings.volumeTrigger = sceneResponse.sceneTriggerVolume; 
                    settings.sceneTimedEvents = sceneResponse.sceneTimedEvents; //could be big!?
                    settings.skyboxIDs = skyboxIDs;
                    settings.skyboxID = skyboxID;
                    settings.skyboxURL = skyboxUrl;
                    settings.useSynth = hasSynth;
                    settings.useMatrix = (sceneResponse.sceneTags != null && sceneResponse.sceneTags.includes('matrix'));
                    settings.sceneWaterLevel = sceneResponse.sceneWater.level != undefined ? sceneResponse.sceneWater.level : 0; 
                    let audioGroups = {};
                    audioGroups.triggerGroups = sceneResponse.sceneTriggerAudioGroups;
                    audioGroups.ambientGroups = sceneResponse.sceneAmbientAudioGroups;
                    audioGroups.primaryGroups = sceneResponse.scenePrimaryAudioGroups;
                    settings.audioGroups = audioGroups; 
                    settings.clearLocalMods = false;
                    if (sceneResponse.sceneTags != null && sceneResponse.sceneTags.includes("hide avatars")) {
                        settings.hideAvatars = true;
                    }
                    if (sceneResponse.sceneTags != null && sceneResponse.sceneTags.includes("clear localmods")) {
                        settings.clearLocalMods = true;
                    }
                    
                    if (sceneResponse.triggerAudioGroups != null && sceneResponse.triggerAudioGroups.length > 0) {
                        hasTriggerAudio = true;
                    }
                    if (sceneResponse.ambientAudioGroups != null && sceneResponse.ambientAudioGroups.length > 0) {
                        hasAmbientAudio = true;
                    }
                    if (sceneResponse.primayAudioGroups != null && sceneResponse.primayAudioGroups.length > 0) {
                        hasPrimaryAudio = true;
                    }

                    // settings.sceneAmbientAudioGroups = sceneResponse.sceneAmbientAudioGroups;
                    // settings.scenePrimaryAudioGroups = sceneResponse.scenePrimaryAudioGroups;
                    var sbuff = Buffer.from(JSON.stringify(settings)).toString("base64");
                    settingsData = "<div id=\x22settingsDataElement\x22 data-settings=\x22"+sbuff+"\x22></div>";

                    let grabMix = "<a-mixin id=\x22grabmix\x22" + //mixin for grabbable objex
                        "event-set__grab=\x22material.color: #FFEF4F\x22" +
                        "event-set__grabend=\x22material.color: #F2E646\x22" +
                        "event-set__hit=\x22material.color: #F2E646\x22" +
                        "event-set__hitend=\x22material.color: #EF2D5E\x22" +
                        "event-set__mousedown=\x22material.color: #FFEF4F\x22" +
                        "event-set__mouseenter=\x22material.color: #F2E646\x22" +
                        "event-set__mouseleave=\x22material.color: #EF2D5E\x22" +
                        "event-set__mouseup=\x22material.color: #F2E646\x22" +
                        "geometry=\x22primitive: box; height: 0.30; width: 0.30; depth: 0.30\x22" +
                        "material=\x22color: #EF2D5E;\x22></a-mixin>";
                    // let primaryAudioScript = ""
                    // <a-assets>
                    let playerAvatarTemplate = "";
                    if (sceneResponse.sceneWebType != undefined && (sceneResponse.sceneWebType.toLowerCase() == "aframe" || sceneResponse.sceneWebType.toLowerCase() == "default")) { // and what else?  networking isOn?
                        playerAvatarTemplate = "<template id=\x22avatar-template\x22>"+ 
                        
                        "<a-entity "+skyboxEnvMap+" gltf-model=\x22#avatar_model\x22>"+
                        "<a-text class=\x22playerName\x22 look-at=\x22#player\x22 rotation=\x220 0 0\x22 position=\x22.5 .75 -.15\x22 value=\x22"+avatarName+"\x22></a-text>"+
                            // "<a-text look-at=\x22#player\x22 rotation=\x220 180 0\x22 position=\x22.5 1.25 -.15\x22 value=\x22"+avatarName+"\x22></a-text>"+
                        "</a-entity>"+
                        "</template>";
                    }
                 
                    let webxrFeatures = "";
                    let arHitTest = "";
                    let arShadowPlane = "";
                    let handsTemplate = "";
                    let aframeRenderSettings = "renderer=\x22antialias: true; logarithmicDepthBuffer: false; colorManagement: true; sortObjects: true; physicallyCorrectLights: true; alpha: true; maxCanvasWidth: 1920; maxCanvasHeight: 1920;\x22";
                   
                    //scenetype filters below...

                    console.log("sceneWebType: "+ sceneResponse.sceneWebType);
                    if (sceneResponse.sceneWebType == undefined || sceneResponse.sceneWebType.toLowerCase() == "default" || sceneResponse.sceneWebType.toLowerCase() == "aframe") { 
                        // webxrFeatures = "webxr=\x22optionalFeatures: hit-test, local-floor\x22"; //otherwise hit-test breaks everythign!
                        webxrFeatures = "webxr=\x22optionalFeatures: hit-test, local-floor, dom-overlay; overlayElement:#canvasOverlay;\x22"; //otherwise hit-test breaks everythign!
                        arHitTest = "ar-hit-test-spawn=\x22mode: "+arMode+"\x22";
                        // arShadowPlane = "<a-plane show-in-ar-mode id="shadow-plane" material="shader:shadow" shadow="cast:false;" visible=\x22false\x22 height=\x2210\x22 width=\x2210\x22 rotation=\x22-90 0 0\x22 shadow=\x22receive:true\x22 ar-shadows=\x22opacity: 0.3\x22 static-body=\x22shape: none\x22 shape__main=\x22shape: box; halfExtents: 100 100 0.125; offset: 0 0 -0.125\x22>" +
                        arShadowPlane = "<a-plane show-in-ar-mode visible=\x22false\x22 id=\x22shadow-plane\x22 material=\x22shader:shadow\x22 shadow=\x22cast:false;\x22 follow-shadow=\x22.activeObjexRay\x22 height=\x2233\x22 width=\x2233\x22 rotation=\x22-90 0 0\x22>" +
                            "</a-plane>";
                        
                        // }
                        handsTemplate = "<template id=\x22hand-template\x22><a-entity><a-box scale=\x220.1 0.1 0.1\x22 visible=false></a-box></a-entity></template>";
                       
                    } 
                    if (sceneResponse.sceneWebType == "Model Viewer") {
                        // dialogButton = "";
                        let extraScripts = "";
                        let sky = "environment-image=\x22neutral\x22";
                        if (skyboxUrl != null) {
                            sky = "skybox-image=\x22"+skyboxUrl+"\x22";
                        }  
                        let planeDetectMode = "floor";
                        let arScaleMode = "";
                        if (sceneResponse.sceneTags != null && sceneResponse.sceneTags.includes("wall")) {
                            planeDetectMode = "wall";
                        } 
                        if (sceneResponse.sceneTags != null && sceneResponse.sceneTags.includes("scale fixed")) {
                            arScaleMode = "fixed";
                        }
                        if (sceneResponse.sceneTags != null && sceneResponse.sceneTags.includes("scale auto")) {
                            arScaleMode = "auto";
                        } 
                        if (sceneResponse.sceneTags != null && sceneResponse.sceneTags.includes("show overlay")) {
                            canvasOverlay = canvasOverlay + socketScripts;
                        } else {
                            canvasOverlay = "";
                        }   
                        let sceneGreeting = sceneResponse.sceneDescription;
                        if (sceneResponse.sceneGreeting != null && sceneResponse.sceneGreeting != undefined && sceneResponse.sceneGreeting != "") {
                            sceneGreeting = sceneResponse.sceneGreeting;
                        }      
                        let sceneQuest = "No quests for this scene... yet!";
                        if (sceneResponse.sceneQuest != null && sceneResponse.sceneQuest != undefined && sceneResponse.sceneQuest) {
                            sceneQuest = sceneResponse.sceneQuest;
                        }
                        if (sceneResponse.sceneTags != null && sceneResponse.sceneTags.includes('show dialog')) {
                            dialogButton = dialogButton +  //set with the actual button above?
                            "<div id=\x22sceneGreeting\x22 style=\x22z-index: -20;\x22>"+sceneGreeting+"</div>" +
                            "<div id=\x22sceneQuest\x22 style=\x22z-index: -20;\x22>"+sceneQuest+"</div>" +
                            "<div id=\x22theModal\x22 class=\x22modal\x22><div id=\x22modalContent\x22 class=\x22modal-content\x22></div></div>";
                            extraScripts = "<script src=\x22/main/vendor/jquery/jquery.min.js\x22></script>" +
                            "<script src=\x22../main/js/dialogs.js\x22></script>" +
                            "<script src=\x22/connect/connect.js\x22 defer=\x22defer\x22></script>" +
                            geoScripts +
                            locationScripts +
                            locationData +
                            modelData;
                            // inventoryData;
                        } else {
                            dialogButton = "";
                            socketScripts = "";
                        }
                        htmltext = "<!DOCTYPE html>\n" +
                            "<head> " +
                            "<html lang=\x22en\x22 xml:lang=\x22en\x22 xmlns= \x22http://www.w3.org/1999/xhtml\x22>"+
                            "<meta charset=\x22UTF-8\x22>"+
                            "<meta name=\x22google\x22 content=\x22notranslate\x22>" +
                            "<meta http-equiv=\x22Content-Language\x22 content=\x22en\x22></meta>" +
                            googleAnalytics +
                            
                            "<link rel=\x22icon\x22 href=\x22data:,\x22></link>"+
                            "<meta charset='utf-8'/>" +
                            "<meta name='viewport' content='width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no'/>" +
                            "<meta property='og:url' content='" + process.env.ROOT_HOST + "/webxr/" + sceneResponse.short_id + "' /> " +
                            "<meta property='og:type' content='website' /> " +
                            // "<meta property='og:image' content='" + postcard1 + "' /> " +
                            "<meta property='og:image' content='http://" + postcard1 + "' /> " +
                            "<meta property='og:image:height' content='1024' /> " +
                            "<meta property='og:image:width' content='1024' /> " +
                            "<meta property='og:title' content='" + sceneResponse.sceneTitle + "' /> " +
                            "<meta property='og:description' content='" + sceneResponse.sceneDescription + "' /> " +
                            "<meta property='name' content='modelviewer' /> " +
                            "<title>" + sceneResponse.sceneTitle + "</title>" +
                            "<meta name='description' content='" + sceneResponse.sceneDescription + "'/>" +
                            // "<meta name=\x22monetization\x22 content=\x22"+process.env.COIL_PAYMENT_POINTER+"\x22>" +
                            "<meta name=\x22mobile-web-app-capable\x22 content=\x22yes\x22>" +
                            "<meta name=\x22apple-mobile-web-app-capable\x22 content=\x22yes\x22>" +
                            
                            "<link href=\x22../main/vendor/fontawesome-free/css/all.css\x22 rel=\x22stylesheet\x22 type=\x22text/css\x22>" +
                            "<link href=\x22/css/modelviewer.css\x22 rel=\x22stylesheet\x22 type=\x22text/css\x22>" + 
                            "<link href=\x22/css/webxr.css\x22 rel=\x22stylesheet\x22 type=\x22text/css\x22>" + 
                            "<script type=\x22module\x22 src=\x22https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js\x22></script>"+
                            extraScripts + 

                            // primaryAudioScript +
                            "</head>\n" +
                            "<body style=\x22background-color: black;\x22>\n" +
                            "<div class=\x22avatarName\x22 id="+avatarName+"></div>"+
                            "<div id=\x22token\x22 data-token=\x22"+token+"\x22></div>\n"+
                            // "<model-viewer class=\x22full-screen-model-viewer\x22 src=\x22"+gltfModel+"\x22"+ 
                            "<model-viewer autoplay shadow-intensity=\x221\x22 camera-controls camera-target=\220m 0m 0m\x22 src=\x22"+gltfModel+"\x22"+ 
                            // "<model-viewer autoplay shadow-intensity=\x221\x22 camera-controls src=\x22"+gltfModel+"\x22"+ 
                            // " ar ar-placement=\x22floor\x22 ar-modes=\x22webxr scene-viewer quick-look\x22 alt=\x22Viewer for single 3D Model\x22"+ //rem'd autoscale
                            " ar ar-placement=\x22"+planeDetectMode+"\x22 ar-modes=\x22webxr scene-viewer quick-look\x22 ar-scale=\x22"+arScaleMode+"\x22 alt=\x22Viewer for single 3D Model\x22"+ 
                            // "skybox-image=\x22"+skyboxUrl+"\x22"+
                            sky +
                            "ios-src=\x22"+usdzModel+"\x22>"+
                            "<button slot=\x22ar-button\x22 style=\x22background-color: red; color: white; font-size: 36px; border-radius: 4px; border: 1px; position: absolute; bottom: 16px; right: 16px; z-index: 100;\x22>"+
                            "AR"+
                            "</button>"+
                            "</model-viewer>" +
                            audioSliders +
                            canvasOverlay +
                            dialogButton +
                            attributionsTextEntity +
                            // "<div id=\x22sceneGreeting\x22 style=\x22z-index: -20;\x22>"+sceneGreeting+"</div>"+
                            // "<div id=\x22sceneQuest\x22 style=\x22z-index: -20;\x22>"+sceneQuest+"</div>"+
                            // "<div id=\x22theModal\x22 class=\x22modal\x22><div id=\x22modalContent\x22 class=\x22modal-content\x22></div></div>"+
                            // canvasOverlay = "<div id=\x22canvasOverlay\x22 class=\x22canvas-overlay\x22><button id=\x22sceneTitleButton\x22 type=\x22button\x22 class=\x22collapsible\x22>"+sceneResponse.sceneTitle+"</button>" +
                            // adSquareOverlay +
                            "<div class=\x22smallfont\x22><span id=\x22users\x22></span></div>"+ 
                            "</body>\n" +
                            socketScripts +
                            // "<script>InitSceneHooks(\x22Model Viewer\x22)</script>";
                            "</html>";
                            console.log("Tryna do a model viewer");
                        } else if (sceneResponse.sceneWebType == "HTML from Text Item") {

                            htmltext = sceneTextItemData.textstring;
                            console.log("Tryna send html from text itme");

                        } else if (sceneResponse.sceneWebType == "AR Location Tracking No") { //No, reuse the aframe html section below and pass in mods
                            htmltext = "<!DOCTYPE html>\n" +
                            
                            "<head> " +
                            "<html lang=\x22en\x22 xml:lang=\x22en\x22 xmlns= \x22http://www.w3.org/1999/xhtml\x22>"+
                            "<meta charset=\x22UTF-8\x22>"+
                            "<meta name=\x22google\x22 content=\x22notranslate\x22>" +
                            "<meta http-equiv=\x22Content-Language\x22 content=\x22en\x22></meta>" +
                            googleAnalytics +
                            
                            "<link rel=\x22icon\x22 href=\x22data:,\x22></link>"+
                            "<meta charset='utf-8'/>" +
                            "<meta name='viewport' content='width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no'/>" +
                            "<meta property='og:url' content='" + process.env.ROOT_HOST + "/webxr/" + sceneResponse.short_id + "' /> " +
                            "<meta property='og:type' content='website' /> " +
                            // "<meta property='og:image' content='" + postcard1 + "' /> " +
                            "<meta property='og:image' content='http://" + postcard1 + "' /> " +
                            "<meta property='og:image:height' content='1024' /> " +
                            "<meta property='og:image:width' content='1024' /> " +
                            "<meta property='og:title' content='" + sceneResponse.sceneTitle + "' /> " +
                            "<meta property='og:description' content='" + sceneResponse.sceneDescription + "' /> " +
                            "<meta property='name' content='modelviewer' /> " +
                            "<title>" + sceneResponse.sceneTitle + "</title>" +
                            "<meta name='description' content='" + sceneResponse.sceneDescription + "'/>" +
                            // "<meta name=\x22monetization\x22 content=\x22"+process.env.COIL_PAYMENT_POINTER+"\x22>" +
                            "<meta name=\x22mobile-web-app-capable\x22 content=\x22yes\x22>" +
                            "<meta name=\x22apple-mobile-web-app-capable\x22 content=\x22yes\x22>" +
                            
                            "<link href=\x22../main/vendor/fontawesome-free/css/all.css\x22 rel=\x22stylesheet\x22 type=\x22text/css\x22>" +
                            "<link href=\x22/css/webxr.css\x22 rel=\x22stylesheet\x22 type=\x22text/css\x22>" + 

                          
                            "</head>\n" +
                            "<body style=\x22background-color: black;\x22>\n" +
                            "<div class=\x22avatarName\x22 id="+avatarName+"></div>"+
                            "<div id=\x22token\x22 data-token=\x22"+token+"\x22></div>\n"+
                         
                            "<a-scene  gps-position=\x22minAccuracy: 100; minDistance: 2; cam3DoF: true\x22></a-scene>" +
                            audioSliders +
                            canvasOverlay +
                            dialogButton +
                            attributionsTextEntity +
                      
                            "<div class=\x22smallfont\x22><span id=\x22users\x22></span></div>"+ 
                            "</body>\n" +
                            socketScripts +
                            // "<script>InitSceneHooks(\x22Model Viewer\x22)</script>";
                            "</html>";
                            console.log("Tryna do a location tracker!");
                            
                        } else if (sceneData.sceneWebType == "BabylonJS") {
                            let uwfx_shader = requireText('./babylon/uwfx_shader.txt', require);
                            let uwfx_scene = requireText('./babylon/uwfx_scene.txt', require);
                            let uwfx_assets = requireText('./babylon/uwfx_assets.txt', require);
                        
                            console.log("skyboxUrl" + skyboxUrl);
                            htmltext = "<!DOCTYPE html>\n" +
                            "<head> " +
                            // googleAdSense +
                            googleAnalytics +

                            "<link rel=\x22icon\x22 href=\x22data:,\x22></link>"+
                            "<meta charset='utf-8'/>" +
                            "<meta name='viewport' content='width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no'/>" +
                            "<meta property='og:url' content='" + process.env.ROOT_HOST + "/webxr/" + sceneResponse.short_id + "' /> " +
                            "<meta property='og:type' content='website' /> " +
                            // "<meta property='og:image' content='" + postcard1 + "' /> " +
                            "<meta property='og:image' content='http://" + postcard1 + "' /> " +
                            "<meta property='og:image:height' content='1024' /> " +
                            "<meta property='og:image:width' content='1024' /> " +
                            "<meta property='og:title' content='" + sceneResponse.sceneTitle + "' /> " +
                            "<meta property='og:description' content='" + sceneResponse.sceneDescription + "' /> " +
                            "<title>" + sceneResponse.sceneTitle + "</title>" +
                            "<meta name='description' content='" + sceneResponse.sceneDescription + "'/>" +
                            // "<meta name=\x22monetization\x22 content=\x22"+process.env.COIL_PAYMENT_POINTER+"\x22>" +
                            "<meta name=\x22mobile-web-app-capable\x22 content=\x22yes\x22>" +
                            "<meta name=\x22apple-mobile-web-app-capable\x22 content=\x22yes\x22>" +
                                "<style>\n" +
                                    "html, body {\n" +
                                        "overflow: hidden;\n" +
                                        "width: 100%;\n" +
                                        "height: 100%;\n" +
                                        "margin: 0;\n" +
                                        "padding: 0;\n" +
                                    "}\n" +
                                    "#renderCanvas {\n" +
                                        "width: 100%;\n" +
                                        "height: 100%;\n" +
                                        "touch-action: none;\n" +
                                    "}\n" +
                                "</style>\n" +
                                "<script src=\x22/babylon/babylon.js\x22></script>\n" + //babylon main script
                                "<script src=\x22/babylon/babylonjs.loaders.js\x22></script>\n" + //i.e. gltf loader
                                "<script src=\x22https://code.jquery.com/pep/0.4.3/pep.js\x22></script>\n" + //don't know!
                            "</head>\n" +
                            "<body>\n" +
                                "<canvas id=\x22renderCanvas\x22 touch-action=\x22none\x22></canvas>\n" + 
                                "<script>\n" +
                                    "var canvas = document.getElementById(\x22renderCanvas\x22);\n" + // Get the canvas element
                                    "var engine = new BABYLON.Engine(canvas, true);\n" + // Generate the BABYLON 3D engine
                                    "var cubetex = null;"+
                                    uwfx_shader +
                                    /******* Add the create scene function ******/
                                    "var createScene = function () {\n" +
                                        uwfx_scene +

                                        // "let eqTexture = new BABYLON.CubeTexture('', scene, undefined, undefined, "+JSON.stringify( cubeMapAsset)+");" + //deprecated
                                        // "scene.environmentTexture = eqTexture;\n"+
                                        // "scene.environmentTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;\n"+
                                        "scene.createDefaultSkybox(scene.environmentTexture);\n"+
                                        "var hlight = new BABYLON.DirectionalLight(\x22dLight\x22, new BABYLON.Vector3(-1, 1, 0), scene);\n" +
                                        "hlight.diffuse = new BABYLON.Color3(.5, 0, 0);\n" +
                                        "hlight.specular = new BABYLON.Color3(0, .6, 0);\n" +
                                        "var sphere = BABYLON.MeshBuilder.CreateSphere(\x22sphere\x22, {diameter:3}, scene);\n" +

                                        "var glass = new BABYLON.PBRMaterial('glass', scene);\n"+
                                        // "glass.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;\n" +
                                        "glass.diffuseColor = new BABYLON.Color3(0, 0, 0);\n" +
                                        "glass.specularColor = new BABYLON.Color3(0, 0, 0);\n" +
                                        // "glass.reflectionTexture = eqTexture;\n"+
                                        // "glass.refractionTexture = eqTexture;\n"+
                                        // "glass.linkRefractionWithTransparency = true;\n"+
                                        // "glass.indexOfRefraction = 0.52;\n"+
                                        // "glass.alpha = 0;\n"+
                                        // "glass.microSurface = 1;\n"+
                                        // "glass.reflectivityColor = new BABYLON.Color3(0.2, 0.2, 0.2);\n"+
                                        // "glass.albedoColor = new BABYLON.Color3(0.85, 0.85, 0.85);\n"+
                                        "sphere.material = glass;\n" +
                                        "sphere.position.x = 3;\n" +
                                        "sphere.position.y = 3;\n" +
                                        uwfx_assets +
                                        gltfsAssets +
                                        "return scene;\n" +
                                    "};\n" +
                                    /******* End of the create scene function ******/
                                    "var scene = createScene(); //Call the createScene function\n" +
                                    // Register a render loop to repeatedly render the scene
                                    "engine.runRenderLoop(function () {\n" +
                                    "scene.render();\n" +
                                    "});\n" +

                                    // Watch for browser/canvas resize events
                                    "window.addEventListener(\x22resize\x22, function () {\n" +
                                    "engine.resize();\n" +
                                    "});\n" +
                                "</script>\n" +
                            "</body>\n" +
                            "</html>";
                        } else if (sceneData.sceneWebType == "ThreeJS") {
                        //THREEJS ONLY FOR FACETRACKING // uses https://github.com/jeeliz/jeelizFaceFilter
                            if (sceneResponse.sceneFaceTracking) {
                            // console.log("gltfsAssets: "+ gltfsAssets);
                            let offx = 0;
                            let offy = 0;
                            let scale = 0;
                            offx = parseFloat(gltfsAssets.offsetX);
                            offy = parseFloat(gltfsAssets.offsetY);
                            scale = parseFloat(gltfsAssets.scale);
                            htmltext = "<html xmlns='http://www.w3.org/1999/xhtml'>" +
                            "<head> " +
                            googleAnalytics +
                            // googleAdSense +
                            "<link rel=\x22icon\x22 href=\x22data:,\x22></link>"+
                            "<meta charset='utf-8'/>" +
                            "<meta name='viewport' content='width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no'/>" +
                            "<meta property='og:url' content='" + process.env.ROOT_HOST + "/webxr/" + sceneResponse.short_id + "' /> " +
                            "<meta property='og:type' content='website' /> " +
                            // "<meta property='og:image' content='" + postcard1 + "' /> " +
                            "<meta property='og:image' content='http://" + postcard1 + "' /> " +
                            "<meta property='og:image:height' content='1024' /> " +
                            "<meta property='og:image:width' content='1024' /> " +
                            "<meta property='og:title' content='" + sceneResponse.sceneTitle + "' /> " +
                            "<meta property='og:description' content='" + sceneResponse.sceneDescription + "' /> " +
                            "<title>" + sceneResponse.sceneTitle + "</title>" +
                            "<meta name='description' content='" + sceneResponse.sceneDescription + "'/>" +
                            // "<meta name=\x22monetization\x22 content=\x22$ilp.uphold.com/EMJQj4qKRxdF\x22>" +
                            "<meta name=\x22mobile-web-app-capable\x22 content=\x22yes\x22>" +
                            "<meta name=\x22apple-mobile-web-app-capable\x22 content=\x22yes\x22>" +
                            "<script src=\x22/main/src/util/face/jeelizFaceFilter.js\x22></script>\n" +
                            "<script src=\x22/main/src/util/face/three.js\x22></script>\n" +
                            "<script src=\x22/main/src/util/face/GLTFLoader.js\x22></script>\n" +
                            "<script src=\x22/main/src/util/face/JeelizResizer.js\x22></script>\n" +
                            "<script src=\x22/main/src/util/face/JeelizThreejsHelper.js\x22></script>\n" +
                            "<script>\n" +
                            // "const SETTINGS = \n" + JSON.stringify(SETTINGS) + ";\n" +    
                            "\x22use strict\x22;\n" +
                            "const SETTINGS = {\n" +
                                "gltfModelURL: \x22"+gltfsAssets.modelURL+"\x22,\n"+ 
                                "cubeMapURL: 'path',\n" +
                                "offsetYZ: ["+offx+","+offy+"],\n" + // offset of the model in 3D along vertical and depth axis
                                "scale: "+scale+"\n" + // width in 3D of the GLTF model
                                // "offsetYZ: [0,0],\n" + // offset of the model in 3D along vertical and depth axis
                                // "scale: 2\n" + // width in 3D of the GLTF model
                            "};\n" +
                            "let THREECAMERA = null;"+
                            "function init_threeScene(spec){"+
                            "const threeStuffs = THREE.JeelizHelper.init(spec, null);"+
                                    // "const envMap = new THREE.CubeTextureLoader().load(\n" + JSON.stringify(cubeMapAsset) + ");\n" + //1d array //DEPRECATED
                            "var directionalLight = new THREE.DirectionalLight( 0xffffff, 5 );\n" +
                            "const gltfLoader = new THREE.GLTFLoader();\n" +
                            "gltfLoader.load( SETTINGS.gltfModelURL, function ( gltf ) {\n" +
                            "gltf.scene.traverse( function ( child ) {\n" +
                                "if ( child.isMesh ) {\n" +
                                " child.material.envMap = envMap;\n" +
                                "}\n" +
                                "} );\n" +
                                "gltf.scene.frustumCulled = false;\n" +
                                "let mixer = new THREE.AnimationMixer(gltf.scene);\n" +
                                // "gltf.animations.forEach((clip) => {\n" +
                                "const clip = gltf.animations.find((clip) => clip.name === 'idle');"+
                                // "mixer.clipAction(clip).play();"+
                                    // "mixer.clipAction(gltf.animations[0]).play();\n" +
                                // "});\n" +
                                "const bbox = new THREE.Box3().expandByObject(gltf.scene);\n" +
                            "threeStuffs.scene.add( directionalLight );\n" +
                            "threeStuffs.scene.add(directionalLight.target);\n" +
                            "const centerBBox = bbox.getCenter(new THREE.Vector3());\n" +
                            "gltf.scene.position.add(centerBBox.multiplyScalar(-1));\n" +
                            "gltf.scene.position.add(new THREE.Vector3(0,SETTINGS.offsetYZ[0], SETTINGS.offsetYZ[1]));\n" +
                            "const sizeX = bbox.getSize(new THREE.Vector3()).x;\n" +
                            "gltf.scene.scale.multiplyScalar(SETTINGS.scale / sizeX);\n" +
                            "threeStuffs.faceObject.add(gltf.scene);\n" +
                            //   "var texture = new THREE.TextureLoader().load(\x22face2.jpg\x22);\n" +  //TEXTURE SWAP HERE
                            //   "texture.encoding = THREE.sRGBEncoding; \n" +
                            //   "texture.flipY = true; \n" +
                            //   "var material = new THREE.MeshBasicMaterial( { map: texture } ); \n" +
                            //   "threeStuffs.faceObject.traverse(node => {\n" +
                            //     "node.material = material;\n" +         
                            //       "});\n" +
                            "directionalLight.target = threeStuffs.faceObject;\n" +
                        
                            "} );\n" +

                            "THREECAMERA = THREE.JeelizHelper.create_camera();\n" +
                            "} \n" +
                            "function main(){\n" +
                                "JeelizResizer.size_canvas({\n" +
                                    "canvasId: 'jeeFaceFilterCanvas',\n" +
                                "isFullScreen: true,\n" +
                                "callback: start,\n" +
                                "onResize: function(){\n" +
                                    "THREE.JeelizHelper.update_camera(THREECAMERA);\n" +
                                    "}\n" +
                                "})\n" +
                                "}\n" +
                            "function start(){\n" +
                            "JEEFACEFILTERAPI.init({ \n" +
                                "videoSettings:{\n" + // increase the default video resolution since we are in full screen"
                                "'idealWidth': 1280,\n" +  // ideal video width in pixels
                                "'idealHeight': 800,\n" +  // ideal video height in pixels
                                "'maxWidth': 1920,\n" +    // max video width in pixels
                                "'maxHeight': 1920\n" +    // max video height in pixels
                                "},\n" +
                            "followZRot: true,\n" +
                            "canvasId: 'jeeFaceFilterCanvas',\n" +
                            "NNCpath: '/main/src/util/face/',\n" + //root of NNC.json file
                            "callbackReady: function(errCode, spec){\n" +
                                "if (errCode){\n" +
                                    "console.log('AN ERROR HAPPENS. SORRY BRO :( . ERR =', errCode);\n" +
                                "return;\n" +
                                "}\n" +
                        
                                "console.log('INFO: JEEFACEFILTERAPI IS READY');\n" +
                                "init_threeScene(spec);\n" +
                                "},\n" +
                            "callbackTrack: function(detectState){\n" +
                                "THREE.JeelizHelper.render(detectState, THREECAMERA);\n" +
                                "}\n" +
                            "});\n" + //end JEEFACEFILTERAPI.init call
                            "}\n" + //end start()
                            primaryAudioScript +
                            "</script>" + 
                            "<link rel=\x22stylesheet\x22 href=\x22/main/src/util/face/styleFullScreen.css\x22 type=\x22text/css\x22 />" +
                            "</head>" +
                        
                            "<body onload=\x22main()\x22 style='color: white'>" +
                            "<canvas width=\x22600\x22 height=\x22600\x22 id='jeeFaceFilterCanvas'></canvas>" +
                            "</body>" +
                            "</html>";
                        } else { //not face tracking threejs below
                                sceneAssets = "\n"+
                                "loader.load(\n"+ //icons and gui stuff for inclusion in threejs below
                                "\x22https://servicemedia.s3.amazonaws.com/assets/models/panel5b.glb\x22,"+ //landscape panel
                                "function ( gltf ) {\n"+
                                    // "scene.add( gltf.scene );\n"+
                                    "if (!gltf.scene) return;\n" +
                                    // "var texture = new THREE.TextureLoader().load(ref.src);\n"+
                                    "texture.encoding = THREE.sRGBEncoding;\n"+
                                    "gltf.scene.traverse(function (node) {\n" +
                                        "if (node.material && 'envMap' in node.material) {\n" +
                                        "node.material.envMap = envMap;\n" +
                                        "node.material.envMap.intensity = 1;\n" +
                                        "node.material.needsUpdate = true;\n" +
                                        "}\n" +
                                    "});\n" +
                                    "landscapePanel = gltf.scene;\n"+
                                "},\n"+
                                "function ( xhr ) {\n"+
                                    "console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );\n"+
                                    "},\n"+
                                "function ( error ) {\n"+
                                    "console.log( 'An error happened' );\n"+
                                    "}\n"+
                                ");\n";
                                
                                htmltext = "<html xmlns='http://www.w3.org/1999/xhtml'>" + //this will be the response
                                "<head> " +
                                // googleAdSense +
                                googleAnalytics +
                                
                                "<link rel=\x22icon\x22 href=\x22data:,\x22></link>\n"+
                                "<meta charset='utf-8'/>\n" +
                                "<meta name='viewport' content='width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no'/>\n" +
                                "<meta property='og:url' content='" + process.env.ROOT_HOST + "/webxr/" + sceneResponse.short_id + "' /> \n" +
                                "<meta property='og:type' content='website' /> \n" +
                                // "<meta property='og:image' content='" + postcard1 + "' /> " +
                                "<meta property='og:image' content='http://" + postcard1 + "' /> \n" +
                                "<meta property='og:image:height' content='1024' /> \n" +
                                "<meta property='og:image:width' content='1024' /> \n" +
                                "<meta property='og:title' content='" + sceneResponse.sceneTitle + "' />\n " +
                                "<meta property='og:description' content='" + sceneResponse.sceneDescription + "' /> \n" +
                                "<title>" + sceneResponse.sceneTitle + "</title>\n" +
                                "<meta name='description' content='" + sceneResponse.sceneDescription + "'/>\n" +
                                // "<meta name=\x22monetization\x22 content=\x22$ilp.uphold.com/EMJQj4qKRxdF\x22>\n" +
                                "<meta name=\x22mobile-web-app-capable\x22 content=\x22yes\x22>\n" +
                                "<meta name=\x22apple-mobile-web-app-capable\x22 content=\x22yes\x22>\n" +    
                                // "<script src=\x22/three/three.js\x22></script>\n" +
                                // "<script src=\x22/three/GLTFLoader.js\x22></script>\n" +
                                "<style>" +
                                    "body { margin: 0; }" +
                                    "canvas { display: block; }" +
                                    "</style>\n" +
                                    "</head>\n" +
                                "<body>\n" +
                                
                                "<script type=\x22module\x22>" + //threejs script below

                                "import * as THREE from '/three/build/three.module.js';\n"+ //oooh, modular!
                                "import { VRButton } from '/three/examples/jsm/webxr/VRButton.js';\n"+
                                "import { OrbitControls } from '/three/examples/jsm/controls/OrbitControls.js';\n"+
                                "import { GLTFLoader } from '/three/examples/jsm/loaders/GLTFLoader.js';\n"+
                                "import ShadowedLight from '/three/examples/jsm/utils/ShadowedLight.js';\n"+
                                "import VRControl from '/three/examples/jsm/utils/VRControl.js';\n"+
                                "import TWEEN from '/three/dist/tween.esm.js';\n"+
                                "import * as ThreeMeshUI from '/three/three-mesh-ui/three-mesh-ui.js';\n"+


                                "var mouse = new THREE.Vector2(), INTERSECTED;\n"+
                                "mouse.x = mouse.y = null;\n"+
                                "let selectState = false;\n"+
                                "var container, controls, mesh, intersects;\n"+
                                "var camera, scene, vrControl, raycaster, renderer;\n"+
                                "var landscapePanel, keyButton, cameraButton, nextButton, previousButton;\n"+
                                "var primaryAudio, primaryAudioStatus, primaryAudioStatusText, primaryAudioCurrentTime, primaryAudioPanel, availableScenesObject, availableScenesPanel, pictureGroupPanel;\n"+
                                
                                "init();\n"+
                                "animate();\n"+
                                "function init() {\n"+
                                    "container = document.createElement( 'div' );\n"+
                                    "raycaster = new THREE.Raycaster();\n"+
                                    
                                    "document.body.appendChild( container );\n"+
                                    "document.body.appendChild(VRButton.createButton(renderer));\n"+
                                    "camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );\n"+
                                    "camera.position.set( - 1.8, 0.6, 2.7 );\n"+
                                    "scene = new THREE.Scene();\n"+
                                            // "const envMap = new THREE.CubeTextureLoader().load(\n" + JSON.stringify(cubeMapAsset) + ");\n" + //1d array //DEPRECATED
                                            // "scene.background = envMap;\n"+
                                    // "var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );\n" +
                                    // "scene.add(directionalLight);\n"+
                                    // "var ambientLight = new THREE.AmbientLight( 0x404040 );\n"+ // soft white light
                                    "const light = ShadowedLight({\n"+
                                        "z: 10,\n"+
                                        "width: 6,\n"+
                                        "bias: -0.0001\n"+
                                    "});\n"+
                                    "const hemLight = new THREE.HemisphereLight( 0x808080, 0x606060 );\n"+
                                    "scene.add( light, hemLight );\n"+
                                    // "scene.add( ambientLight );\n"+
                                    // "directionalLight.position.set(.5,.8,0);\n"+ `

                                    "window.addEventListener( 'mousemove', onMouseMove, false );\n"+
                                    "window.addEventListener( 'mousedown', onMouseDown, false );\n"+
                                    "renderer = new THREE.WebGLRenderer( { antialias: true } );\n"+
                                    "renderer.setPixelRatio( window.devicePixelRatio );\n"+
                                    "renderer.setSize( window.innerWidth, window.innerHeight );\n"+
                                    "renderer.xr.enabled = true;\n" +
                                    "vrControl = VRControl( renderer, camera, scene );\n"+
                                    "scene.add( vrControl.controllerGrips[ 0 ], vrControl.controllers[ 0 ] );\n"+
                                    "vrControl.controllers[ 0 ].addEventListener( 'selectstart', ()=> { selectState = true } );\n"+
                                    "vrControl.controllers[ 0 ].addEventListener( 'selectend', ()=> { selectState = false } );\n"+
                                    "var loader = new GLTFLoader();\n"+
                                    gltfsAssets +
                                    // sceneAssets +
                                    "container.appendChild( renderer.domElement );\n"+
                                    "controls = new OrbitControls( camera, renderer.domElement );\n"+
                                    "controls.addEventListener( 'change', render ); \n"+// use if there is no animation loop
                                    "controls.minDistance = 2;\n"+
                                    "controls.maxDistance = 10;\n"+
                                    "controls.target.set( 0, 0, - 0.2 );\n"+
                                    "controls.update();\n"+
                                    "requestAnimationFrame(render);\n"+
                                    "window.addEventListener( 'resize', onWindowResize, false );\n"+
                                    "availableScenesObject = " + JSON.stringify(availableScenesResponse) + ";\n"+
                                    "MakePrimaryAudioPanel();\n"+
                                    "MakeAvailableScenesPanel();\n"+
                                "}\n"+
                                primaryAudioScript +
                                "function animate() {\n"+
                                    "requestAnimationFrame( animate );\n"+
                                    "render();\n"+
                                "}" +
                                "function onWindowResize() {\n"+
                                    "camera.aspect = window.innerWidth / window.innerHeight;\n"+
                                    "camera.updateProjectionMatrix();\n"+
                                    "renderer.setSize( window.innerWidth, window.innerHeight );\n"+
                                    "render();\n"+
                                "}\n"+
                                "window.addEventListener( 'touchstart', ( event )=> {\n"+
                                    "selectState = true;\n"+
                                    "mouse.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;\n"+
                                    "mouse.y = - ( event.touches[0].clientY / window.innerHeight ) * 2 + 1;\n"+
                                "});\n"+
                                
                                "window.addEventListener( 'touchend', ()=> {\n"+
                                    "selectState = false;\n"+
                                    "mouse.x = null;\n"+
                                    "mouse.y = null;\n"+
                                "});\n"+
                                "function onMouseMove( event ) {\n"+
                                    // calculate mouse position in normalized device coordinates
                                    // (-1 to +1) for both components
                                    "mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;\n"+
                                    "mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;\n"+
                                "}\n"+
                                "function onMouseDown( event ) {\n"+
                                    "if ( intersects.length > 0 ) {\n"+
                                        "if (intersects[0].object.userData.name == \x22primaryAudioMesh\x22) {\n"+
                                            "console.log(intersects[0].object.userData.name);\n"+
                                            "if (!primaryAudio.isPlaying) {\n"+
                                                "primaryAudio.play();\n"+
                                                "console.log('playing primary audio');\n"+
                                                "primaryAudioMesh.material.color = new THREE.Color( 'blue' );\n"+
                                                "primaryAudioStatusText.set({content: \x22playing\x22, fontColor: new THREE.Color( 'blue' )});\n"+
                                            "} else {\n"+
                                                "primaryAudio.pause();\n"+
                                                "console.log('pausing primary audio');\n"+
                                                "primaryAudioMesh.material.color = new THREE.Color( 'yellow' );\n"+
                                                "primaryAudioStatusText.set({content: \x22paused\x22, fontColor: new THREE.Color( 'yellow' )});\n"+
                                            "}\n"+
                                        "}\n"+
                                        "if (intersects[0].object.userData.name == \x22key\x22) {\n"+
                                            "console.log(intersects[0].object.userData.name);\n"+
                                            "availableScenesPanel.visible = true;\n"+
                                        "}\n"+
                                    "}\n"+
                                "}\n"+
                                "function MakeAvailableScenesPanel() {\n"+
                                    "console.log('tryna make availablescenes panel');\n"+
                                    "var loader = new GLTFLoader();\n"+
                                    "loader.load(\n"+
                                    "\x22https://servicemedia.s3.amazonaws.com/assets/models/key.glb\x22,"+ //landscape panel
                                    "function ( gltf ) {\n"+
                                        "if (!gltf.scene) return;\n" +
                                        // "texture.encoding = THREE.sRGBEncoding;\n"+
                                        "gltf.scene.traverse(function (node) {\n" +
                                            "if (node.material && 'envMap' in node.material) {\n" +
                                            "node.material.envMap = envMap;\n" +
                                            "node.material.envMap.intensity = 1;\n" +
                                            "node.material.needsUpdate = true;\n" +
                                            "}\n" +
                                        "});\n" +
                                        "console.log('gotsa key icon');\n"+
                                        "keyButton = gltf.scene;\n"+
                                        "scene.add(keyButton);\n"+
                                        "keyButton.userData.name = \x22key\x22;\n"+
                                        "availableScenesPanel = new ThreeMeshUI.Block({\n"+
                                            "width: 3,\n"+
                                            "height: 3,\n"+
                                            "padding: 0.05,\n"+
                                            "justifyContent: 'center',\n"+
                                            "alignContent: 'center',\n"+
                                            "fontFamily: \x22/three/assets/Roboto-msdf.json\x22,\n"+
                                            "fontTexture: \x22/three/assets/Roboto-msdf.png\x22"+
                                        "});\n"+
                                        "availableScenesPanel.position.set( -8, 1, 1 );\n"+
                                        "availableScenesPanel.rotation.x = -0.55;\n"+
                                        "scene.add(availableScenesPanel);\n"+
                                        "keyButton.position = availableScenesPanel.position;\n"+
                                        "const sceneDetails = new ThreeMeshUI.Block({\n"+
                                            "width: 3,\n"+
                                            "height: 1,\n"+
                                            "padding: 0.05,\n"+
                                            "justifyContent: 'center',\n"+
                                            "alignContent: 'left',\n"+
                                        "});\n"+
                                        "sceneDetails.add(\n"+
                                            "new ThreeMeshUI.Text({\n"+
                                            "content: 'Scene Title: ' + availableScenesObject.availableScenes[0].sceneTitle,\n"+ //local var 
                                            "fontSize: 0.10"+
                                        "}));\n"+
                                        "const scenePics = new ThreeMeshUI.Block({\n"+
                                            "width: 3,\n"+
                                            "height: 2,\n"+
                                            "padding: 0.05,\n"+
                                            "justifyContent: 'center',\n"+
                                            "alignContent: 'left',\n"+
                                        "});\n"+
                                        // "scenePics.add(\n"+
                                            "const loader = new THREE.TextureLoader();\n"+
                                            "loader.load( availableScenesObject.availableScenes[0].scenePostcardHalf, (texture)=> {\n"+
                                                "scenePics.set({ backgroundTexture: texture });\n"+
                                            "});\n"+
                                        // "}));\n"+
                                        "availableScenesPanel.add(scenePics, sceneDetails)\n"+
                                        "availableScenesPanel.lookAt(camera.position);\n"+

                                    "},\n"+
                                    "function ( xhr ) {\n"+
                                        "console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );\n"+
                                        "},\n"+
                                    "function ( error ) {\n"+
                                        "console.log( 'An error happened' );\n"+
                                        "}\n"+
                                    ");\n"+
                                   
                                "};\n"+
                                "function MakePrimaryAudioPanel() {\n"+
                                    "console.log('tryna make a panel');"+
                                    "primaryAudioPanel = new ThreeMeshUI.Block({\n"+
                                        "width: 1.5,\n"+
                                        "height: 0.5,\n"+
                                        "padding: 0.05,\n"+
                                        "justifyContent: 'center',\n"+
                                        "alignContent: 'left',\n"+
                                        "fontFamily: \x22/three/assets/Roboto-msdf.json\x22,\n"+
                                        "fontTexture: \x22/three/assets/Roboto-msdf.png\x22"+
                                    "});\n"+
                                    "primaryAudioPanel.position.set( 2, 1, 1 );\n"+
                                    "primaryAudioPanel.rotation.x = -0.55;\n"+
                                    "scene.add( primaryAudioPanel );\n"+
                                    "primaryAudioStatus = \x22loading...\x22;\n"+
                                    // "primaryAudioStatusText;\n"+
                                    "const title = new ThreeMeshUI.Block({\n"+
                                        "width: 1.4,\n"+
                                        "height: 0.2,\n"+
                                    "});\n"+
                                    "title.add(\n"+
                                        "new ThreeMeshUI.Text({\n"+
                                        "content: \x22"+primaryAudioTitle+"\x22,\n"+
                                        "fontSize: 0.10"+
                                    "}));\n"+
                                    "const status = new ThreeMeshUI.Block({\n"+
                                        "width: 1.4,\n"+
                                        "height: 0.2,\n"+
                                    "});\n"+
                                    "status.add(\n"+
                                        "primaryAudioStatusText = new ThreeMeshUI.Text({\n"+
                                        "content: primaryAudioStatus,\n"+
                                        "fontSize: 0.10"+
                                    "}));\n"+
                                    "primaryAudioPanel.add(title, status)\n"+
                                    "primaryAudioPanel.lookAt(camera.position);\n"+
                                "};\n"+
                                
                                "function render() {\n"+
                                    // "if (renderer != undefined)"+
                                    
                                    "renderer.render( scene, camera );\n"+
                                    "raycaster.setFromCamera( mouse, camera );\n"+
                                    "intersects = raycaster.intersectObjects( scene.children );\n"+
                                    "if ( intersects.length > 0 ) {\n"+
                                        "if ( INTERSECTED != intersects[ 0 ].object ) {\n"+
                                            "if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );\n"+
                                            "INTERSECTED = intersects[ 0 ].object;\n"+
                                            "INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();\n"+
                                            "INTERSECTED.material.emissive.setHex( 0xff0000 );\n"+
                                            // "console.log(intersects[0].object.userData.name);\n"+
                                        "}\n"+
                                    "} else {\n"+
                                        "if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );\n"+
                                        "INTERSECTED = null;\n"+
                                    "}\n"+
                                    "if (primaryAudioPanel) {\n"+ 
                                        "primaryAudioPanel.lookAt(camera.position);\n"+
                                        "if (primaryAudio && primaryAudio.isPlaying) {\n"+
                                            // "primaryAudioStatusText.set({content: \x22Playing\x22});"+
                                            // "ThreeMeshUI.update();\n"+
                                            // "console.log('really playing primary audio');\n"+
                                        "} else {\n"+
                                            // "primaryAudioStatusText.set({content: \x22Paused\x22});\n"+
                                        "}\n"+
                                    "}\n"+
                                    "if (availableScenesPanel) {\n"+ 
                                        "availableScenesPanel.lookAt(camera.position);\n"+
                                    "}\n"+
                                    "ThreeMeshUI.update();\n"+
                                "}\n"+
                                "</script>" +
                                "</body>" +
                                "</html>";                      
                            }
                            // res.send(facetrackingResponse);
                            // callback(null);
                        // } 
                    } else if (sceneResponse.sceneWebType == "AR Image Tracking") { //aframe plus mindar
                        // dialogButton = "";
                        let extraScripts = "";
                        let sky = "environment-image=\x22neutral\x22";
                        if (skyboxUrl != null) {
                            sky = "skybox-image=\x22"+skyboxUrl+"\x22";
                        }  
                        let planeDetectMode = "floor";
                        let arScaleMode = "auto";
                        if (sceneResponse.sceneTags != null && sceneResponse.sceneTags.includes("wall")) {
                            planeDetectMode = "wall";
                        } 
                        if (sceneResponse.sceneTags != null && sceneResponse.sceneTags.includes("scale fixed")) {
                            arScaleMode = "fixed";
                        } 
                        if (sceneResponse.sceneTags != null && sceneResponse.sceneTags.includes("show overlay")) {
                            canvasOverlay = canvasOverlay + socketScripts;

                        } else {
                            canvasOverlay = "";
                        }   
                        let sceneGreeting = sceneResponse.sceneDescription;
                        if (sceneResponse.sceneGreeting != null && sceneResponse.sceneGreeting != undefined && sceneResponse.sceneGreeting != "") {
                            sceneGreeting = sceneResponse.sceneGreeting;
                        }      
                        let sceneQuest = "No quests for this scene... yet!";
                         if (sceneResponse.sceneQuest != null && sceneResponse.sceneQuest != undefined && sceneResponse.sceneQuest) {
                             sceneQuest = sceneResponse.sceneQuest;
                         }
                        if (sceneResponse.sceneTags != null && sceneResponse.sceneTags.includes('show dialog')) {
                            dialogButton = dialogButton +  //set with the actual button above?
                            "<div id=\x22sceneGreeting\x22 style=\x22z-index: -20;\x22>"+sceneGreeting+"</div>"+
                            "<div id=\x22sceneQuest\x22 style=\x22z-index: -20;\x22>"+sceneQuest+"</div>"+
                            "<div id=\x22theModal\x22 class=\x22modal\x22><div id=\x22modalContent\x22 class=\x22modal-content\x22></div></div>";
                            extraScripts = "<script src=\x22/main/vendor/jquery/jquery.min.js\x22></script>" +
                            "<script src=\x22../main/js/dialogs.js\x22></script>"+
                            "<script src=\x22/connect/connect.js\x22 defer=\x22defer\x22></script>" +
                            geoScripts +
                            locationScripts +
                            locationData +
                            modelData;
                                            
                        } else {
                            dialogButton = "";
                            socketScripts = "";
                        }
                        if (sceneResponse.sceneTags != null && sceneResponse.sceneTags.includes('matrix')) {
                            extraScripts = extraScripts + "<script src=\x22../main/js/browser-matrix.min.js\x22></script>"; 
                            matrixEntities = "<a-entity matrix_meshes=\x22init: true\x22></a-entity>";
                        }
                        htmltext = "<!DOCTYPE html>\n" +
                        "<head> " +
                        "<meta name=\x22viewport\x22 content=\x22width=device-width, initial-scale=1\x22 />"+
                        "<html lang=\x22en\x22 xml:lang=\x22en\x22 xmlns= \x22http://www.w3.org/1999/xhtml\x22>"+
                        "<meta charset=\x22UTF-8\x22>"+
                        "<meta name=\x22google\x22 content=\x22notranslate\x22>" +
                        "<meta http-equiv=\x22Content-Language\x22 content=\x22en\x22></meta>" +
                        googleAnalytics +
                        
                        "<link rel=\x22icon\x22 href=\x22data:,\x22></link>"+
                        "<meta charset='utf-8'/>" +
                        "<meta name='viewport' content='width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no'/>" +
                        "<meta property='og:url' content='" + process.env.ROOT_HOST + "/webxr/" + sceneResponse.short_id + "' /> " +
                        "<meta property='og:type' content='website' /> " +
                        // "<meta property='og:image' content='" + postcard1 + "' /> " +
                        "<meta property='og:image' content='http://" + postcard1 + "' /> " +
                        "<meta property='og:image:height' content='1024' /> " +
                        "<meta property='og:image:width' content='1024' /> " +
                        "<meta property='og:title' content='" + sceneResponse.sceneTitle + "' /> " +
                        "<meta property='og:description' content='" + sceneResponse.sceneDescription + "' /> " +
                        "<meta property='name' content='modelviewer' /> " +
                        "<title>" + sceneResponse.sceneTitle + "</title>" +
                        "<meta name='description' content='" + sceneResponse.sceneDescription + "'/>" +
                        // "<meta name=\x22monetization\x22 content=\x22"+process.env.COIL_PAYMENT_POINTER+"\x22>" +
                        "<meta name=\x22mobile-web-app-capable\x22 content=\x22yes\x22>" +
                        "<meta name=\x22apple-mobile-web-app-capable\x22 content=\x22yes\x22>" +                        
                        "<link href=\x22../main/vendor/fontawesome-free/css/all.css\x22 rel=\x22stylesheet\x22 type=\x22text/css\x22>" +
                        "<link href=\x22/css/webxr.css\x22 rel=\x22stylesheet\x22 type=\x22text/css\x22>" + 
                        aframeScriptVersion + 
                        extraScripts + 
                        // "<script src=\x22https://cdn.jsdelivr.net/gh/donmccurdy/aframe-extras@v6.1.1/dist/aframe-extras.min.js\x22></script>"+
                        "<script src=\x22https://cdnjs.cloudflare.com/ajax/libs/stats.js/16/Stats.min.js\x22></script>"+


                        "<script src=\x22../main/src/util/mindar/mindar-image.js\x22></script>"+
                        "<script src=\x22../main/src/util/mindar/mindar-image-aframe.js\x22></script>"+

                        // primaryAudioScript +
                        
                        "</head>\n" +
                        "<body>\n" +
                        "<div class=\x22avatarName\x22 id="+avatarName+"></div>"+
                        "<div id=\x22token\x22 data-token=\x22"+token+"\x22></div>\n"+
                        "<div class=\x22ar-container\x22>"+
                        "<a-scene mindar-image=\x22imageTargetSrc: "+arImageTargets[0]+";\x22 embedded color-space=\x22sRGB\x22"+

                            // "<a-scene mindar-image=\x22imageTargetSrc: https://servicemedia.s3.amazonaws.com/users/5150540ab038969c24000008/pictures/targets/6185599f5b7b7950e4548144.mind;\x22 embedded color-space=\x22sRGB\x22"+
                            " renderer=\x22colorManagement: true, physicallyCorrectLights\x22 vr-mode-ui=\x22enabled: false\x22 device-orientation-permission-ui=\x22enabled: false\x22>"+
                            gltfsAssets +    
                            "<a-entity mindar-image-target=\x22targetIndex: 0\x22>" +
                                "<a-gltf-model rotation=\x2290 0 0\x22 position=\x220 0 0.1\x22 scale=\x220.25 0.25 0.25\x22 src=\x22#gltfasset2\x22>"+
                            "</a-entity>"+
                            "<a-camera position=\x220 0 0\x22 look-controls=\x22enabled: false\x22></a-camera>"
                        "</a-scene>"+
                        "</div>"+    
                        
                        audioSliders +
                        canvasOverlay +
                        dialogButton +
                        attributionsTextEntity +
                       
                        "<div class=\x22smallfont\x22><span id=\x22users\x22></span></div>"+ 
                        "</body>\n" +
                        socketScripts +
                        // "<script>InitSceneHooks(\x22Model Viewer\x22)</script>";
                        "</html>";
                        console.log("Tryna do a AR Image Tracking scene");

                    } else if (sceneResponse.sceneWebType == 'Mapboxx') { //rem'd aframe version below - maybe later?
                           
                            mainDiv = "<div id=\x22map\x22 class=\x22map\x22 style=\x22width:100%; height:100%\x22>"; //closed at end
                            joystickContainer = "";
                            let uid = "0000000000000";
                        if (req.session.user) {
                            uid = req.session.user._id;
                        }
                        var token=jwt.sign({userId:uid,shortID:sceneResponse.short_id},process.env.JWT_SECRET, { expiresIn: '1h' });  
                        let modal = "<div id=\x22theModal\x22 class=\x22modal\x22><div id=\x22modalContent\x22 class=\x22modal-content\x22></div></div>";
                        htmltext = "<html xmlns='http://www.w3.org/1999/xhtml'>" +
                        "<head> " +
                        googleAnalytics +

                        // googleAdSense +
                        "<link rel=\x22icon\x22 href=\x22data:,\x22></link>"+
                        "<meta charset='utf-8'/>" +
                        "<meta name='viewport' content='width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no'/>" +
                        "<meta property='og:url' content='" + process.env.ROOT_HOST + "/webxr/" + sceneResponse.short_id + "' /> " +
                        "<meta property='og:type' content='website' /> " +
                        // "<meta property='og:image' content='" + postcard1 + "' /> " +
                        "<meta property='og:image' content='http://" + postcard1 + "' /> " +
                        "<meta property='og:image:height' content='1024' /> " +
                        "<meta property='og:image:width' content='1024' /> " +
                        "<meta property='og:title' content='" + sceneResponse.sceneTitle + "' /> " +
                        "<meta property='og:description' content='" + sceneResponse.sceneDescription + "' /> " +
                        "<title>" + sceneResponse.sceneTitle + "</title>" +
                        "<meta name='description' content='" + sceneResponse.sceneDescription + "'/>" +
                        // "<meta name=\x22monetization\x22 content=\x22$ilp.uphold.com/EMJQj4qKRxdF\x22>" +
                        "<meta name=\x22mobile-web-app-capable\x22 content=\x22yes\x22>" +
                        "<meta name=\x22apple-mobile-web-app-capable\x22 content=\x22yes\x22>" +
                        // "<meta name=\x22token\x22 content=\x22"+token+"\x22>"+
                        "<link href=\x22../main/vendor/fontawesome-free/css/all.css\x22 rel=\x22stylesheet\x22 type=\x22text/css\x22>" +
                        "<link href=\x22/css/webxr.css\x22 rel=\x22stylesheet\x22 type=\x22text/css\x22>" +
                        
                        "<script src=\x22/main/vendor/jquery/jquery.min.js\x22></script>" +
                        
                        // "<script src=\x22../main/ref/aframe/dist/socket.io.slim.js\x22></script>" +
                        // "<script src=\x22/connect/connect.js\x22 defer=\x22defer\x22></script>" +
                

                        "<script src=\x22../main/vendor/howler/src/howler.core.js\x22></script>"+
                        "<script src=\x22../main/vendor/howler/src/howler.spatial.js\x22></script>"+
                        // "<script src=\x22../main/js/hls.min.js\x22></script>" + //v 1.0.6 
                        // "<script src=\x22../main/js/navigation.js\x22></script>" + //includes navmesh components (simple and not), and extended-wasd-controls

                        primaryAudioScript +
                        ambientAudioScript +
                        triggerAudioScript +
                        "</head>" +
                        "<body bgcolor='black'>" +
                        
                        modal +
                        
                        // "<div id=\x22"+mainDivID+"\x22 class=\x22"mainDivClass"\x22 style=\x22width:100%; height:100%\x22>"+
                        mainDiv + //main Div wrapper, different for map

                        "<div class=\x22primaryAudioParams\x22 "+primaryAudioParams+" id="+streamPrimaryAudio+ "_" +oggurl+"></div>"+  //TODO Fix!  concatting the id is stupid, use data-attributes
                        "<div class=\x22ambientAudioParams\x22 id="+ambientUrl+"></div>"+
                        "<div class=\x22triggerAudioParams\x22 id="+triggerUrl+"></div>"+
                        settingsData +
                        // "<div class=\x22attributionParams\x22 id="+JSON.stringify(attributions)+"></div>"+
                        "<div class=\x22avatarName\x22 id="+avatarName+"></div>"+
                        // primaryAudioControl +
                        // ambientAudioControl +
                        // triggerAudioControl +
                        audioControl +
                        // "<script> function screenCap() {console.log(\x22tryna screenCap()\x22); document.querySelector('a-scene').components.screenshot.capture('perspective')};"+    
                        // "</script>"+
                        containers +
                        locationScripts +
                        geoScripts +
                        "<script src=\x22../main/js/dialogs.js\x22></script>"+
                        geoEntities +
                     
                        pictureGroupsData +
                       
                        loadLocations +
                        // "<a-entity id=\x22createAvatars\x22 create_avatars></a-entity>"+
                        audioVizEntity +
                        instancingEntity +
                        // "<a-entity show-in-ar-mode visible=\x22false\x22 id=\x22reticleEntity\x22 gltf-model=\x22#reticle2\x22 scale=\x220.8 0.8 0.8\x22 "+arHitTest+"></a-entity>\n"+ //for ar spawning...
                        arShadowPlane +
                        hemiLight +
                        shadowLight +
                        // navmarsh +
                        loadAudioEvents +
                        
                        modelData +
                        objectData +
                        inventoryData +
                        // "<a-entity id=\x22navmesh\x22 geometry=\x22primitive: plane; height: 30; width: 30; buffer: true;\x22 rotation=\x22-90 0 0\x22 nav-mesh></a-entity>"+
                        
                        "</div>\n"+ //close maindiv
                        "<style>\n"+
                        "a{ color:#fff;\n"+
                        "text-decoration:none;\n"+
                        "}\n"+
                        ".footer {\n"+
                        "position: fixed;\n"+
                        "left: 0;\n"+
                        "bottom: 0;\n"+
                        "width: 100%;\n"+
                        "background-color: black;\n"+
                        "color: white;\n"+
                        // "text-align: left;\n"+
                        "font-family: \x22Trebuchet MS\x22, Helvetica, sans-serif\n"+
                        "}\n"+
                        "</style>\n"+
                        // "<div class=\x22renderPanel\x22 id=\x22renderPanel\x22></div>\n"+
                        sceneTextItemData +
                        "<div id=\x22geopanel\x22 class=\x22geopanel\x22><span></span></div>\n"+
                        // "<div id=\x22sceneGreeting\x22 style=\x22z-index: -20;\x22>"+sceneGreeting+"</div>"+
                        // "<div id=\x22sceneQuest\x22 style=\x22z-index: -20;\x22>"+sceneQuest+"</div>"+
                        "<div class=\x22backmask\x22 style=\x22position: fixed; left: 0; top: 0; z-index: -5; overflow: hidden\x22></div>"+ //to hide lower elements
                       
                        

                        screenOverlay + //socket picture
                        canvasOverlay + //drop down side panel
                        audioSliders +
                        mapOverlay + //
                        adSquareOverlay +
                        "<div class=\x22next-button\x22 id=\x22nextButton\x22 style=\x22visibility: hidden\x22 onclick=\x22GoToNext()\x22><i class=\x22fas fa-arrow-circle-right fa-2x\x22></i></div>"+
                        "<div class=\x22previous-button\x22 id=\x22previousButton\x22 style=\x22visibility: hidden\x22 onclick=\x22GoToPrevious()\x22><i class=\x22fas fa-arrow-circle-left fa-2x\x22></i></div>"+
                        "<a href=\x22''\x22 target=\x22_blank\x22 class=\x22ar-buttoon\x22>AR</a>" +
                        
                        "<div id=\x22token\x22 data-token=\x22"+token+"\x22>\n"+
                        
                        // "<div style=\x22float: left; margin: 10px 10px;\x22 onclick=\x22screenCap()\x22><i class=\x22fas fa-camera  fa-2x\x22></i></div>\n"+ 
                        locationButton+
                        dialogButton+
                        ethereumButton+ 
                        transportButtons+ 
                        
                        loadAvailableScenes + //TODO is this still loaded via ready?

                        "</body>" +
                    "</html>";
                    
                    } else { //AFrame response below
                        let joystick = "joystick=\x22useNavmesh: false\x22";
                        let extraScripts = "";
                        let hasParametricCurve = false;
                        if (useNavmesh) {
                            navmeshScripts = "<script src=\x22../three/pathfinding/three-pathfinding.umd.js\x22></script>";
                            // "<script src=\x22../main/vendor/aframe/movement-controls.js\x22></script>";
                            // navmeshScripts = "<script type=\x22module\x22 src=\x22../main/js/navigation.js\x22></script>";
                            // navmarsh = "<a-entity nav-mesh normal-material visible=\x22false\x22 gltf-model=\x22#castle_navmesh\x22></a-entity>"+
                            //                 "<a-entity position=\x220 0 0\x22 scale=\x223 3 3\x22 "+skyboxEnvMap+" gltf-model=\x22#castle\x22></a-entity>";
                            joystick = "joystick=\x22useNavmesh: true\x22";
                            
                        }
                        if (useSimpleNavmesh) {
                            // navmeshScripts = "</script><script src=\x22../main/js/navigation.js\x22></script>";
                            // "<script src=\x22../main/vendor/aframe/movement-controls.js\x22></script>";
                            // navmeshScripts = "<script type=\x22module\x22 src=\x22../main/js/navigation.js\x22></script>";
                            // navmarsh = "<a-entity nav-mesh normal-material visible=\x22false\x22 gltf-model=\x22#castle_navmesh\x22></a-entity>"+
                            //                 "<a-entity position=\x220 0 0\x22 scale=\x223 3 3\x22 "+skyboxEnvMap+" gltf-model=\x22#castle\x22></a-entity>";
                            // joystick = "joystick=\x22useNavmesh: true\x22";
                            
                        }
                        if (!showTransport) {
                            transportButtons = "";
                        }
                        if (!showDialog) {
                            dialogButton = "";
                        }
                        if (!showSceneManglerButtons) {
                            sceneManglerButtons = "";
                        }
                        if (locationPictures.length == 0) { //in no pic locations, use circle layout
                            // imageEntities = "<a-entity id=\x22imageEntitiesParent\x22 position='0 3.5 0' rotation=\x2290 0 33\x22 layout=\x22type: circle; radius: 20\x22>"+imageEntities+"</a-entity>\n";
                        }
                        if (sceneResponse.sceneUseDynCubeMap) {
                            skyboxEnvMap = "skybox-env-map";   
                        }
                        if (sceneResponse.sceneTags != null && sceneResponse.sceneTags.includes("hide overlay")) {
                            canvasOverlay = "";
                        }   
                        // if (sceneResponse.sceneTags != null && sceneResponse.sceneTags.includes("no socket")) {
                        //     socketScripts = "";
                        // }   
                        if (sceneResponse.sceneTags != null && sceneResponse.sceneTags.includes('matrix')) { //see matrix.org
                            extraScripts = extraScripts + "<script src=\x22../main/js/browser-matrix.min.js\x22></script>"; 
                            matrixEntities = "<a-entity id=\x22matrix_meshes\x22 matrix_meshes=\x22init: true\x22></a-entity>";
                        }
                        if (sceneResponse.sceneTags != null && sceneResponse.sceneTags.includes('parametric')) {
                            hasParametricCurve = true;
                            extraScripts = extraScripts + "<script src=\x22../main/js/parser.js\x22></script>"; 
                            curveEntities = curveEntities + "<a-entity id=\x22p_path\x22 parametric_curve=\x22xyzFunctions: 30*cos(t), 3*cos(3*t) + 2, 30*sin(t);tRange: 0, -6.283;\x22></a-entity>"; //TODODO 
                        }
                        let sceneGreeting = sceneResponse.sceneDescription;
                        if (sceneResponse.sceneGreeting != null && sceneResponse.sceneGreeting != undefined && sceneResponse.sceneGreeting != "") {
                            sceneGreeting = sceneResponse.sceneGreeting;
                        }
                        let sceneQuest = "No quests for this scene...yet!";
                        if (sceneResponse.sceneQuest != null && sceneResponse.sceneQuest != undefined && sceneResponse.sceneQuest != "") {
                            sceneQuest = sceneResponse.sceneQuest;
                        }
                        // console.log("scenne greeting is " + sceneGreeting);
                        let physicsInsert = "";
                        let physicsDummy = "";
                        if (physicsScripts.length > 0) {
                            // physicsInsert = "physics=\x22driver: ammo; debug: true; gravity: -9.8; debugDrawMode: 0;\x22";
                            physicsInsert = "physics=\x22driver: ammo; debug: "+debugMode+"; gravity: -9.8; debugDrawMode: 1;\x22";
                            physicsDummy = "<a-box position=\x220 10 -10\x22 width=\x223\x22 height=\x223\x22 depth=\x223\x22 ammo-body=\x22type: dynamic\x22 ammo-shape=\x22type: box;\x22></a-box>"+
                            "<a-box position=\x220 -1 0\x22 width=\x2233\x22 height=\x221\x22 depth=\x2233\x22 material=\x22opacity: 0; transparent: true;\x22 ammo-body=\x22type: static\x22 ammo-shape=\x22type: box;\x22></a-box>";
                            // physics = "physics";
                        }
                        if (logScripts.length > 0){
                            webxrFeatures = webxrFeatures + " vr-super-stats=\x22position:0 .4 0; alwaysshow3dstats:true; show2dstats:false;\x22 ";
                        }
                        
                        if (curveEntities.length > 0 && !hasParametricCurve) {
                            curveEntities = "<a-curve id=\x22curve1\x22 type=\x22CatmullRom\x22 closed=\x22true\x22>" + curveEntities + "</a-curve>"+
                            "<a-draw-curve id=\x22showCurves\x22 visible=\x22false\x22 curveref=\x22#curve1\x22 material=\x22shader: line; color: blue;\x22></a-draw-curve>";
                            //"<a-sphere follow-path=\x22incrementBy:0.001; throttleTo:1\x22 position=\x220 10.25 -5\x22 radius=\x221.25\x22 color=\x22#EF2D5E\x22></a-sphere>";
                        }
                         
                        let magicWindow = " disable-magicwindow device-orientation-permission-ui=\x22enabled: false\x22 "; //by default use the joystick...
                        if (sceneResponse.sceneTags != null && (sceneResponse.sceneTags.includes('magicwindow') || sceneResponse.sceneTags.includes('magic window'))) {
                            magicWindow = "";
                            joystick = "";
                            joystickContainer = "";
                            joystickScript = "";
                        }

                        /////////AFRAME SCENE DECLARATION////////////////// 
                        let aScene = "<a-scene "+sceneBackground+" "+physicsInsert+" "+pool_target+" "+pool_launcher+" gesture-detector webxr=\x22overlayElement:#overlay\x22 " +
                        "reflection=\x22directionalLight:#real-light\x22 ar-hit-test=\x22type:footprint; footprintDepth:0.2;\x22 ar-cursor raycaster=\x22objects: .activeObjexRay\x22 "+
                        // "screen-controls vr-mode-ui keyboard-shortcuts=\x22enterVR: false\x22" + magicWindow +   
                        " vr-mode-ui keyboard-shortcuts=\x22enterVR: false\x22" + magicWindow + //add screen-controls from initializer                      
                        webxrFeatures + " shadow=\x22type: pcfsoft\x22 loading-screen=\x22dotsColor: white; backgroundColor: black; enabled: false\x22 embedded " + aframeRenderSettings + " " + fogSettings + " "+networkedscene+" "+ARSceneArg+" listen-for-vr-mode>";

                        let mainDiv = "<div style=\x22width:100%; height:100%\x22>";

                        if (sceneResponse.sceneWebType == 'Mapbox') { //no, non-aframe version above - maybe later?
                            aScene = "<a-scene loading-screen=\x22dotsColor: white; backgroundColor: black\x22 vr-mode-ui=\x22enabled: false\x22 keyboard-shortcuts=\x22enterVR: false\x22 disable-magicwindow device-orientation-permission-ui=\x22enabled: false\x22>";
                            mainDiv = "<div id=\x22map\x22 class=\x22map\x22 style=\x22width:100%; height:100%\x22>"; //closed at end
                            joystickContainer = "";
                        }
                        if (sceneResponse.sceneWebType == 'AR Location Tracking') {
                            console.log("AR Location Tracking mdoe...");
                            aScene = "<a-scene gps-position webxr=\x22referenceSpaceType: unbounded; requiredFeatures: unbounded;\x22 keyboard-shortcuts=\x22enterVR: false\x22 loading-screen=\x22dotsColor: white; backgroundColor: black\x22 vr-mode-ui=\x22enabled: false\x22 disable-magicwindow device-orientation-permission-ui=\x22enabled: false\x22>";
                            // <a-scene gps-position webxr="referenceSpaceType: unbounded; requiredFeatures: unbounded;"></a-scene>
                            joystickContainer = "";
                  
                        } //else { //default AFRAME with trimmings
                        
                        let uid = "0000000000000";
                        if (req.session.user) {
                            uid = req.session.user._id;
                        }
                        var token=jwt.sign({userId:uid,shortID:sceneResponse.short_id},process.env.JWT_SECRET, { expiresIn: '1h' });  
                        let modal = "<div id=\x22theModal\x22 class=\x22modal\x22><div id=\x22modalContent\x22 class=\x22modal-content\x22></div></div>";
                        htmltext = "<html xmlns='http://www.w3.org/1999/xhtml'>" +
                        "<head> " +
                        googleAnalytics +

                        // googleAdSense + //naw, nm
                        "<link rel=\x22icon\x22 href=\x22data:,\x22></link>"+
                        "<meta charset='utf-8'/>" +
                        "<meta name='viewport' content='width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no'/>" +
                        "<meta property='og:url' content='" + process.env.ROOT_HOST + "/webxr/" + sceneResponse.short_id + "' /> " +
                        "<meta property='og:type' content='website' /> " +
                        // "<meta property='og:image' content='" + postcard1 + "' /> " +
                        "<meta property='og:image' content='http://" + postcard1 + "' /> " +
                        "<meta property='og:image:height' content='1024' /> " +
                        "<meta property='og:image:width' content='1024' /> " +
                        "<meta property='og:title' content='" + sceneResponse.sceneTitle + "' /> " +
                        "<meta property='og:description' content='" + sceneResponse.sceneDescription + "' /> " +
                        "<title>" + sceneResponse.sceneTitle + "</title>" +
                        "<meta name='description' content='" + sceneResponse.sceneDescription + "'/>" +
                        // "<meta name=\x22monetization\x22 content=\x22$ilp.uphold.com/EMJQj4qKRxdF\x22>" +
                        "<meta name=\x22mobile-web-app-capable\x22 content=\x22yes\x22>" +
                        "<meta name=\x22apple-mobile-web-app-capable\x22 content=\x22yes\x22>" +
                        // "<meta name=\x22token\x22 content=\x22"+token+"\x22>"+
                        "<link href=\x22../main/vendor/fontawesome-free/css/all.css\x22 rel=\x22stylesheet\x22 type=\x22text/css\x22>" +
                        "<link href=\x22/css/webxr.css\x22 rel=\x22stylesheet\x22 type=\x22text/css\x22>" +
                       
                        "<script src=\x22/main/vendor/jquery/jquery.min.js\x22></script>" +
                        
                        "<script src=\x22../main/ref/aframe/dist/socket.io.slim.js\x22></script>" +
                        "<script src=\x22/connect/connect.js\x22 defer=\x22defer\x22></script>" +
                
                        // "<script src=\x22//aframe.io/releases/1.3.0/aframe.min.js\x22></script>" +
                        aframeScriptVersion +
                        physicsScripts +
                        logScripts +
                        aframeExtrasScript +
                        extraScripts +
                        // "<script src=\x22https://cdn.jsdelivr.net/gh/aframevr/aframe@02f028bf319915bd5de1ef8b033495fe80b6729b/dist/aframe-master.min.js\x22></script>" +
                       
                        

                        "<script src=\x22../main/vendor/howler/src/howler.core.js\x22></script>"+
                        "<script src=\x22../main/vendor/howler/src/howler.spatial.js\x22></script>"+
                        hlsScript +
                        
                        "<script src=\x22../main/js/navigation.js\x22></script>" + //includes navmesh components (simple and not), and extended-wasd-controls
                        // "<script src=\x22../main/ref/aframe/dist/networked-aframe.min.js\x22></script>" + 
                        // "<script src=\x22../main/ref/aframe/dist/aframe-layout-component.min.js\x22></script>" +  
                        "<script src=\x22../main/vendor/aframe/aframe-blink-controls.min.js\x22></script>" +   //TODO - check if req comes from vr headset
                       
                        // "<script src=\x22../main/ref/aframe/dist/aframe-randomizer-components.min.js\x22></script>" +
                        enviromentScript +
                        // "<script src=\x22../main/ref/aframe/dist/aframe_environment_component.min.js\x22></script>" +
                       
                        joystickScript +


                        // "<script src=\x22../main/src/shaders/terrain.js\x22></script>"+
                       
                        "<script src=\x22../main/vendor/aframe/aframe-look-at-component.min.js\x22></script>"+
                        // "<script src=\x22../main/vendor/aframe/aframe-teleport-controls.min.js\x22></script>"+
                        
                        // "<script src=\x22../main/vendor/aframe/aframe-entity-generator-component.min.js\x22></script>"+
                        // "<script src=\x22../main/vendor/aframe/aframe-text-geometry-component.min.js\x22></script>"+
                        // "<script src=\x22../main/vendor/html2canvas/aframe-html-shader.min.js\x22></script>"+
                        primaryAudioScript +
                        ambientAudioScript +
                        triggerAudioScript +
                        // skyGradientScript +
                        ARScript +
                        // cameraEnvMap +
                        contentUtils +
                        audioVizScript +
                        meshUtilsScript +
                        synthScripts +
                        surfaceScatterScript +
                        brownianScript +
                        // "<script src=\x22../main/src/util/quaternion.js\x22></script>"+
                        // "<script src=\x22../main/vendor/trackedlibs/aabb-collider.js\x22></script>"+

                        "<script src=\x22../main/src/component/aframe-makewaves-shader.js\x22></script>"+
                        "<script src=\x22../main/src/shaders/noise.js\x22></script>"+

                        "<script src=\x22../main/vendor/aframe/aframe-particle-system-component.min.js\x22></script>"+
                        "<script src=\x22../main/src/component/aframe-spe-particles-component.js\x22></script>"+
                        "<script src=\x22../main/src/component/aframe-spritesheet-animation.js\x22></script>"+
                        "<script src=\x22../main/src/component/aframe-sprite-particles-component.js\x22></script>"+
                        

                        // "<script src=\x22../main/vendor/aframe/animation-mixer.js\x22></script>"+
                        // "<script src=\x22//cdn.jsdelivr.net/gh/donmccurdy/aframe-extras@v6.1.1/dist/aframe-extras.min.js\x22></script>" +
                        // "<script src=\x22../main/vendor/aframe/aframe-extras.controls.js\x22></script>"+  
                        // "<script src=\x22../main/vendor/aframe/aframe-extras-pathfinding_20210520.js\x22></script>"+  
                        // "<script src=\x22..//main/vendor/aframe/aframe-extras_20210520.js\x22></script>"+  
                        
                        
                        // "<script src=\x22../main/vendor/trackedlibs/grab.js\x22></script>"+  


                        "<script src=\x22../main/src/component/mod-materials.js\x22></script>"+
                        "<script src=\x22../main/src/component/ar-utils.js\x22></script>"+
                        "<script src=\x22../main/src/component/spawn-in-circle.js\x22></script>"+
                        // "<script src=\x22/main/vendor/jquery/jquery.min.js\x22></script>" +
                        // "<script src=\x22/connect/connect.js\x22 defer=\x22defer\x22></script>" +
                        // "<script type=\x22module\x22 src=\x22/main/src/component/drag-mangler.js\x22></script>"+
                        // convertEquirectToCubemap +
                        // "<script data-ad-client=\x22ca-pub-5450402133525063\x22 async src=\x22https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js\x22></script>"+
                        "</head>" +
                        "<body bgcolor='black'>" +
                        
                        modal +
                        
                        // "<div id=\x22"+mainDivID+"\x22 class=\x22"mainDivClass"\x22 style=\x22width:100%; height:100%\x22>"+
                        mainDiv + //main Div wrapper, different for map

                        "<div class=\x22primaryAudioParams\x22 "+primaryAudioParams+" id="+streamPrimaryAudio+ "_" +oggurl+"></div>"+  //TODO Fix!  concatting the id is stupid, use data-attributes
                        "<div class=\x22ambientAudioParams\x22 id="+ambientUrl+"></div>"+
                        "<div class=\x22triggerAudioParams\x22 id="+triggerUrl+"></div>"+
                        settingsData +
                        // "<div class=\x22attributionParams\x22 id="+JSON.stringify(attributions)+"></div>"+
                        "<div class=\x22avatarName\x22 id="+avatarName+"></div>"+
                        // primaryAudioControl +
                        // ambientAudioControl +
                        // triggerAudioControl +
                        audioControl +
                        // "<script> function screenCap() {console.log(\x22tryna screenCap()\x22); document.querySelector('a-scene').components.screenshot.capture('perspective')};"+    
                        // "</script>"+
                        containers +
                        locationScripts +
                        locationData +
                        geoScripts +
                        "<script src=\x22../main/js/dialogs.js\x22></script>"+
                        
                    
                        aScene +
                        "<div id=\x22overlay\x22></div>"+
                        // skySettings +
                        aframeEnvironment +
                        ambientLight + 
                        camera +
                        // ARMarker +
                        ocean +
                        terrain +
                        // ground +

                        skySettings +
                       
                        ////////////////ASSETS/////////////
                        "<a-assets timeout=\x2210000\x22>" +
                       
                        playerAvatarTemplate +
                        handsTemplate + 
                        pAudioWaveform +
                        "<a-asset-item id=\x22trigger1\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/trigger1.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22square1\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/square1.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22rectangle1\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/rectangle1.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22avatar_model\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/avatar1c.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22landscape_panel\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/landscape_panel7.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22widelandscape_panel\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/panel5b.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22dialog_panel\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/dialogpanel2.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22backpanel_horiz1\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/backpanel_horiz1.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22portrait_panel\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/panel5c.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22square_panel\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/panelsquare1.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22circle_panel\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/panelcircle1.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22exclamation\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/exclamation.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22previous_button\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/previous.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22next_button\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/next.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22filmcam\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/filmcam1.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22groupicon\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/groupicon.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22mailbox\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/mailbox2.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22links\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/links.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22roundcube\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/roundcube.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22poi1\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/poi1b.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22poi2\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/poi_marker2.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22placeholder\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/placeholder.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22savedplaceholder\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/savedplaceholder.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22key\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/key1b.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22camera_icon\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/camera1.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22talkbubble\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/talkbubble1.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22thoughtbubble\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/thoughtbubble1.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22poimarker\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/poi_marker.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22globe\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/mapglobe1.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22youtubeplayer\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/youtubeplayer2.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22audioplayer\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/audioplayer_3x1_d.glb\x22></a-asset-item>\n"+
                        // "<a-asset-item id=\x22castle\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/castle.glb\x22></a-asset-item>\n"+
                        // "<a-asset-item id=\x22castle_navmesh\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/castle_navmesh.glb\x22></a-asset-item>\n"+
                        // "<a-asset-item id=\x22key\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/key.glb\x22></a-asset-item>\n"+
                        "<a-asset-item id=\x22reticle2\x22 response-type=\x22arraybuffer\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/reticle2.glb\x22></a-asset-item>\n"+
                        "<a-mixin id=\x22bar\x22 geometry=\x22primitive: box\x22 material=\x22color: black\x22 scale-y-color=\x22from: 10 60 10; to: 180 255 180; maxScale: 15\x22></a-mixin>\n"+
                        videosphereAsset +
                        // videoAsset + 
                        imageAssets +

                        // "<img id=\x22explosion\x22 src=\x22https://realitymangler.com/assets/textures/explosion.png\x22 crossorigin=\x22anonymous\x22>"+ 

                      
                        "<img id=\x22fireballSheet\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/pics/fireball-up.png\x22 crossorigin=\x22anonymous\x22></img>"+
                        "<img id=\x22fireball\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/pics/fireball.png\x22 crossorigin=\x22anonymous\x22></img>"+
                        "<img id=\x22fireanim1\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/pics/fireanim3.png\x22 crossorigin=\x22anonymous\x22></img>"+
                        "<img id=\x22torchanim1\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/pics/firetorchanim2.png\x22 crossorigin=\x22anonymous\x22></img>"+
                        "<img id=\x22candle1\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/pics/candle_flame_8x8.png\x22 crossorigin=\x22anonymous\x22></img>"+
                        "<img id=\x22water\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/pics/water2c.jpeg\x22 crossorigin=\x22anonymous\x22>"+
                        "<img id=\x22water1\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/pics/watertile3.png\x22 crossorigin=\x22anonymous\x22>"+
                        "<img id=\x22water2\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/pics/water2.png\x22 crossorigin=\x22anonymous\x22>"+
                        "<img id=\x22raindrop2\x22 src=\x22http://servicemedia.s3.amazonaws.com/assets/pics/raindrop2.png\x22 crossorigin=\x22anonymous\x22>"+
                        "<img id=\x22raindrop\x22 src=\x22http://servicemedia.s3.amazonaws.com/assets/pics/raindrop.png\x22 crossorigin=\x22anonymous\x22>"+
                        "<img id=\x22explosion1\x22 src=\x22http://servicemedia.s3.amazonaws.com/assets/pics/explosion1.png\x22 crossorigin=\x22anonymous\x22>"+
                        "<img id=\x22fireworksanim1\x22 src=\x22http://servicemedia.s3.amazonaws.com/assets/pics/fireworks_sheet.png\x22 crossorigin=\x22anonymous\x22>"+
                        "<img id=\x22smoke1\x22 src=\x22http://servicemedia.s3.amazonaws.com/assets/pics/smokeanim2.png\x22 crossorigin=\x22anonymous\x22>"+
                        "<img id=\x22fireball-up\x22 src=\x22http://servicemedia.s3.amazonaws.com/assets/pics/fireball-up.png\x22 crossorigin=\x22anonymous\x22>"+
                        "<img id=\x22fireball1\x22 src=\x22http://servicemedia.s3.amazonaws.com/assets/pics/fireball.png\x22 crossorigin=\x22anonymous\x22>"+
                        "<img id=\x22sparkle1\x22 src=\x22http://servicemedia.s3.amazonaws.com/assets/pics/sparkle.png\x22 crossorigin=\x22anonymous\x22>"+
                        "<img id=\x22blob1\x22 src=\x22http://servicemedia.s3.amazonaws.com/assets/pics/blob.png\x22 crossorigin=\x22anonymous\x22>"+
                        "<img id=\x22fog1\x22 src=\x22http://servicemedia.s3.amazonaws.com/assets/pics/fog-256.png\x22 crossorigin=\x22anonymous\x22>"+
                        "<img id=\x22cloud1\x22 src=\x22http://servicemedia.s3.amazonaws.com/assets/pics/cloud_lg.png\x22 crossorigin=\x22anonymous\x22>"+
                                
                          // USED FOR TERRAIN, REM FOR NOW...
                        // "<img id=\x22heightmap\x22 src=\x22https://realitymangler.com/assets/heightmaps/hm4.png\x22 crossorigin=\x22anonymous\x22>"+
                        // "<img id=\x22lowestTexture\x22 src=\x22https://realitymangler.com/assets/textures/dirttile1.jpg\x22 crossorigin=\x22anonymous\x22>"+
                        // "<img id=\x22lowTexture\x22 src=\x22https://realitymangler.com/assets/textures/sandtile1.jpg\x22 crossorigin=\x22anonymous\x22>"+
                        // "<img id=\x22mediumTexture\x22 src=\x22https://realitymangler.com/assets/textures/grasstile2.jpg\x22 crossorigin=\x22anonymous\x22>"+
                        // "<img id=\x22highTexture\x22 src=\x22https://realitymangler.com/assets/textures/grasstile2.jpg\x22 crossorigin=\x22anonymous\x22>"+
                        // "<img id=\x22highestTexture\x22 src=\x22https://realitymangler.com/assets/textures/mossrocktile2.jpg\x22 crossorigin=\x22anonymous\x22>"+


                        weblinkAssets +
                        gltfsAssets +
                        videoAsset +
                        
                        grabMix +
                        skyboxAsset +
                        // cubeMapAsset +
                        navmeshAsset +

                        "</a-assets>\n"+

                        //////////////ENTITIES////////////////////

                        curveEntities +
                        // physicsDummy + 
                        renderPanel +

                        weblinkEntities +
                        // "</a-entity>\n"+
                        gltfsEntities + 
                        skyParticles +
                        imageEntities +
                        // targetObjectEntity +
                        geoEntities +
                        videoEntity +
                        youtubeEntity +
                        mainTextEntity +
                        attributionsTextEntity +
                        availableScenesEntity +
                        pictureGroupsEntity +
                        pictureGroupsData +
                        videoGroupsEntity +
                        navmeshEntity +
                        networkingEntity +
                        locationEntity +
                        primaryAudioEntity +
                        ambientAudioEntity + 
                        triggerAudioEntity +
                        lightEntities +

                        matrixEntities +
                        // parametricEntities +
                        "<a-light visible=\x22false\x22 show-in-ar-mode id=\x22real-light\x22 type=\x22directional\x22 position=\x221 1 1\x22 intensity=\x220.5\x22></a-light>" +
                        placeholderEntities +
                        loadLocations +
                        "<a-entity id=\x22createAvatars\x22 create_avatars></a-entity>"+
                        "<a-entity id=\x22particleSpawner\x22 particle_spawner></a-entity>"+
                        audioVizEntity +
                        instancingEntity +
                        "<a-entity show-in-ar-mode visible=\x22false\x22 id=\x22reticleEntity\x22 gltf-model=\x22#reticle2\x22 scale=\x220.8 0.8 0.8\x22 "+arHitTest+"></a-entity>\n"+ //for ar spawning...
                        
                        arShadowPlane +
                        hemiLight +
                        shadowLight +
                        // navmarsh +
                        loadAudioEvents +
                        "<a-entity id=\x22youtube_element\x22 youtube_element_aframe=\x22init: ''\x22></a-entity>"+
                        // "<a-entity id=\x22audioGroupsEl\x22 audio_groups_control=\x22init: ''\x22></a-entity>"+

                        "<a-entity id=\x22mod_dialog\x22 visible=\x22false\x22 look-at=\x22#player\x22 mod_dialog=\x22mode: 'confirm'\x22>"+
                            "<a-text id=\x22mod_dialog_text\x22 align=\x22left\x22 wrap-count=\x2230\x22 width=\x22.8\x22 position=\x22-.35 .15 .05\x22 value=\x22Are you sure you want to pick up the extra spicy meatball?\n\nThis could bring very strongbad wrongness for you!\x22></a-text>"+
                            "<a-entity id=\x22mod_dialog_panel\x22 class=\x22gltf activeObjexRay\x22 gltf-model=\x22#dialog_panel\x22></a-entity>" +
                        "</a-entity>" + //end dialog
                        modelData +
                        objectData +
                        inventoryData +

                        "<a-console look-at=\x22#player\x22 position=\x22-4 1.75 -2\x22></a-console>"+
                        // "<a-entity id=\x22navmesh\x22 geometry=\x22primitive: plane; height: 30; width: 30; buffer: true;\x22 rotation=\x22-90 0 0\x22 nav-mesh></a-entity>"+
                        "</a-scene>\n"+ //CLOSE AFRAME SCENE
                        "</div>\n"+
                        "<style>\n"+
                        "a{ color:#fff;\n"+
                        "text-decoration:none;\n"+
                        "}\n"+
                        ".footer {\n"+
                        "position: fixed;\n"+
                        "left: 0;\n"+
                        "bottom: 0;\n"+
                        "width: 100%;\n"+
                        "background-color: black;\n"+
                        "color: white;\n"+
                        // "text-align: left;\n"+
                        "font-family: \x22Trebuchet MS\x22, Helvetica, sans-serif\n"+
                        "}\n"+
                        "</style>\n"+
                        // "<div class=\x22renderPanel\x22 id=\x22renderPanel\x22></div>\n"+
                        sceneTextItemData +
                        "<div id=\x22geopanel\x22 class=\x22geopanel\x22><span></span></div>\n"+
                        "<div id=\x22sceneGreeting\x22 style=\x22z-index: -20;\x22>"+sceneGreeting+"</div>"+
                        "<div id=\x22sceneQuest\x22 style=\x22z-index: -20;\x22>"+sceneQuest+"</div>"+
                        "<div class=\x22backmask\x22 style=\x22position: fixed; left: 0; top: 0; z-index: -5; overflow: hidden\x22></div>"+ //to hide lower elements
                        "<div class=\x22render_panel\x22 style=\x22position: fixed; left: 0; top: 0; z-index: -50; overflow: hidden margin: auto\x22 id=\x22renderPanel\x22></div>"+
                        "<div class=\x22augpanel\x22><p></p></div>\n"+
                       
                        joystickContainer +
                        screenOverlay + //socket picture
                        canvasOverlay + //drop down side panel
                        audioSliders +
                        mapOverlay + 
                        adSquareOverlay +
                        "<div class=\x22next-button\x22 id=\x22nextButton\x22 style=\x22visibility: hidden\x22 onclick=\x22GoToNext()\x22><i class=\x22fas fa-arrow-circle-right fa-2x\x22></i></div>"+
                        "<div class=\x22previous-button\x22 id=\x22previousButton\x22 style=\x22visibility: hidden\x22 onclick=\x22GoToPrevious()\x22><i class=\x22fas fa-arrow-circle-left fa-2x\x22></i></div>"+
                        "<a href=\x22''\x22 target=\x22_blank\x22 class=\x22ar-buttoon\x22>AR</a>" +
                        
                        "<div id=\x22token\x22 data-token=\x22"+token+"\x22>\n"+
                        
                        // "<div style=\x22float: left; margin: 10px 10px;\x22 onclick=\x22screenCap()\x22><i class=\x22fas fa-camera  fa-2x\x22></i></div>\n"+ 
                        locationButton+
                        dialogButton+
                        ethereumButton+ 
                        transportButtons+ 

                        socketScripts +
                        navmeshScripts +
                        shaderScripts +

                  "<script>\n"+
                            // "var avatarName = \x22" + avatarName + "\x22;\n" +
                            // "let globalStateObject = {};"
                           "function ready(f){/in/.test(document.readyState)?setTimeout('ready('+f+')',9):f()}\n"+
                            
                            //    loadAttributions +
                               loadAvailableScenes +
                            // loadPictureGroups +
                            
                           
                        
                       "</script>\n"+
                        sceneManglerButtons +
                       
                        videoElements +
                        // youtubeContent +
                        "</body>" +
                    "</html>";
                    }
                    callback(null);
                }
            
            ], //waterfall end

            function (err, result) { // #last function, close async
                if (err != null) {
                    if (!accessScene) {
                        let noAccessHTML = "<html xmlns='http://www.w3.org/1999/xhtml'>" +
                        "<head> " +
                        // "<link href=\x22css/sb-admin-2.css\x22 rel=\x22stylesheet\x22>" +
                        "<style>"+
                        "body {background-color: #36393d;}"+
                        "h1   {color: white;}"+
                        "a   {color: powderblue;}"+
                        "p    {color: white; font-family: sans-serif; font-size: 150%;}"+
                        "</style>"+
                        "</head> " +
                        "<p>Access to this scene is restricted.</p><p>Click here to <a href=\x22/landing/invitereq.html?rq="+sceneData.short_id+"\x22>request an invitation</a></p>" +
                        "<body> " +
                        "</body>" +

                        "</html>";
                        res.send(noAccessHTML);
                    } else {
                        res.send("error!! " + err);
                    }
                } else {
                    res.send(htmltext).end();
                    // res.end();
                    //console.log("webxr gen done: " + result);
                    }
                }      
        );
    
        
        } //intial sceneData request, condition on type
    });
    } //if params undefined
});
///// END PRIMARY SERVERSIDE /webxr/ ROUTE //////////////////////




//this one tries to write everything to an s3 bucket as static files, predates serverside version above, deprecated (or at least rusty...)
/*
webxr_router.get('/update_aframe_scene/:_id', requiredAuthentication, function (req, res) { //TODO lock down w/ checkAppID, requiredAuthentication 

    console.log("tryna update webxr scene id: ", req.params._id + " excaped " + entities.decodeHTML(req.params._id));

    var reqstring = entities.decodeHTML(req.params._id);
    var audioResponse = {};
    var pictureResponse = {};
    var postcardResponse = {};
    var sceneResponse = {};
    var requestedPictureItems = [];
    var requestedAudioItems = [];
    var requestedVideoItems = [];
    var requestedTextItems = [];
    sceneResponse.audio = [];
    sceneResponse.pictures = [];
    sceneResponse.postcards = [];
    var sceneOwnerID = "";
    var mp3url = "";
    var oggurl = "";
    var pngurl = "";
    var mp4url = "";
    var postcard1 = "";
    var image1url = "";
    var short_id = "";
    var picArray = [];
    var imageAssets = "";
    var imageEntities = "";
    var skyboxUrl = "";
    var skyboxID = "";
    var skySettings = "";
    var fogSettings = "";
    var ground = "";
    var ocean = "";
    var camera = "";
    var environment = "";
    var oceanScript = "";
    var ARScript = "";
    var ARSceneArg = "";
    var ARMarker = "";
    var randomizerScript = "";
    var animationComponent = "";
    var targetObjectAsset = "";
    var targetObjectEntity = "";
    var skyParticles;
    var videoAsset = "";
    var videoEntity = "";
    var nextLink = "";
    var prevLink = "";
    var loopable = "";
    var gltfs = {};
    var sceneGLTFs = [];
    var allGLTFs = {};
    var gltfUrl = "";
    var gltfs = "";
    var gltfsAssets = "";
    var gltfsEntities = "";
    // var gltfItems = [];
    var bucketFolder = "eloquentnoise.com";
    var playerPosition = "0 5 0";
    var style = "<link rel=\x22stylesheet\x22 type=\x22text/css\x22 href=\x22../styles/embedded.css\x22>";

    async.waterfall([


                function (callback) {
                    var o_id = ObjectID(reqstring);
                    db.scenes.findOne({"_id": o_id},
                        function (err, sceneData) { //fetch the path info by title TODO: urlsafe string

                            if (err || !sceneData) {
                                console.log("error getting scene data: " + err);
                                callback(err);
                            } else { //make arrays of the pics and audio items
                                sceneOwnerID = sceneData.user_id;
                                short_id = sceneData.short_id;
                                sceneResponse = sceneData;
                                if (sceneResponse.sceneDomain != null && sceneResponse.sceneDomain != "") {
                                    bucketFolder = sceneResponse.sceneDomain;
                                } else {
                                    callback(err);
                                }
                                if (sceneData.scenePictures != null) {
                                    sceneData.scenePictures.forEach(function (picture) {
                                        var p_id = ObjectID(picture); //convert to binary to search by _id beloiw
                                        requestedPictureItems.push(p_id); //populate array
                                    });
                                }
                                if (sceneData.sceneType == "ARKit") {
                                    ARScript = "<script src=\x22https://raw.githack.com/jeromeetienne/AR.js/1.7.7/aframe/build/aframe-ar.js\x22></script>";
                                    // ARSceneArg = "arjs=\x22sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;\x22";           
                                    ARSceneArg = "arjs='sourceType: webcam;'";                                    
                                    // ARMarker =  "<a-marker-camera preset='custom' type='pattern' patternUrl='https://nilch.com/markers/pattern-playicon.patt'>" +
                                    // ARMarker =  "<a-marker-camera type='barcode' value='0'>" +
                                    ARMarker =  "<a-marker-camera preset='hiro'>" +
                                                    "<a-box scale='.1 .1 .1' position='0 0.5 0' material='color: yellow;'></a-box>" +
                                                "</a-marker-camera>";
                                    // camera = "<a-marker-camera preset='hiro'></a-marker-camera>";
                                                
                                } else {
                                    let wasd = "wasd-controls=\x22fly: false; acceleration: 33;\x22";
                                    if (sceneResponse.sceneFlyable) {
                                        "wasd-controls=\x22fly: true; acceleration: 50;\x22";
                                    }
                                    camera = "<a-entity id=\x22cameraRig\x22 position=\x220 0 0\x22>"+
                
                                    "<a-entity id=\x22head\x22 camera "+wasd+" look-controls touch-controls position=\x220 1.6 0\x22></a-entity>"+
                                    "<a-entity oculus-touch-controls=\x22hand: left\x22 laser-controls=\x22hand: left;\x22 handModelStyle: lowPoly; color: #ffcccc\x22 raycaster=\x22objects: .activeObjexRay;\x22></a-entity>" +
                                    "<a-entity oculus-touch-controls=\x22hand: right\x22 id=\x22right-hand\x22 hand-controls=\x22hand: right; handModelStyle: lowPoly; color: #ffcccc\x22 aabb-collider=\x22objects: .activeObjexGrab;\x22 grab></a-entity>"+
                                    "</a-entity>";
                                    // camera = "<a-entity position=\x220 3 0\x22 id=\x22cameraRig\x22>" +
                                   
                                }

                                sceneResponse.scenePostcards = sceneData.scenePostcards;
                                if (sceneResponse.sceneColor1 != null && sceneResponse.sceneColor1.length > 3) {
                                    skySettings = "<a-sky color='" + sceneResponse.sceneColor1 + "'></a-sky>"; //overwritten below if there's a skybox texture
                                } 
                                
                                if (sceneResponse.sceneUseGlobalFog || sceneResponse.sceneUseSceneFog) {
                                    fogSettings = "fog=\x22type: linear; density:.002; near: 1; far: 50; color: " +sceneResponse.sceneColor1 + "\x22";
                                }
//                                if (sceneResponse.sceneUseSkyParticles) { 
//                                    skyParticles = "<a-entity scale='.5 .5 .5' position='0 3 0' particle-system=\x22preset: dust; randomize: true color: " + sceneResponse.sceneColor1 + "," + sceneResponse.sceneColor2 +"\x22></a-entity>";
//                                }
                                if (sceneResponse.sceneRenderFloorPlane) {
                                    // ground = "<a-plane rotation='-90 0 0' position='0 -1 0' width='100' height='100' color=\x22" + sceneResponse.sceneColor2 + "\x22></a-plane>";
                                    ground = "<a-plane rotation='-90 0 0' position='0 -1 0' width='100' height='100'></a-plane>";
                                }
                                if (sceneResponse.sceneWater != null && sceneResponse.sceneWater.name != "none") {
                                    ocean = "<a-ocean width='50' depth='50' density='50' opacity='.7' position='0 3 0'></a-ocean>";
                                }
                                // if (sceneResponse.sceneUseTargetObject && sceneResponse.sceneTargetObject.name == "gltftest" ) {
                                //     targetObjectAsset = "<a-asset-item id=\x22targetObj\x22 src=\x22../assets/models/korkus/KorkusOnly.gltf\x22></a-asset-item>";
                                //     targetObjectEntity = "<a-entity class=\x22gltf\x22 gltf-model=\x22#targetObj\x22 position='-5 5 5'></a-entity>";
                                // }
                                if (sceneResponse.sceneNextScene != null && sceneResponse.sceneNextScene != "") {
                                    nextLink = "href=\x22../" + sceneResponse.sceneNextScene + "\x22";
                                }
                                if (sceneResponse.scenePreviousScene != null && sceneResponse.scenePreviousScene != "") {
                                    prevLink = "href=\x22../" + sceneResponse.scenePreviousScene + "\x22";
                                }
                                if (sceneResponse.sceneLoopPrimaryAudio) {
                                    loopable = "loop='true'";
                                }
                                if (sceneResponse.sceneLocations != null && sceneResponse.sceneLocations.length > 0) {
                                    for (var i = 0; i < sceneResponse.sceneLocations.length; i++) {
                                        if (sceneResponse.sceneLocations[i].markerType == "gltf") {
                                            sceneGLTFs.push(sceneResponse.sceneLocations[i]);
                                            if (sceneResponse.sceneLocations[i].eventData != null && sceneResponse.sceneLocations[i].eventData.length > 4) {
                                                animationComponent = "<script src=\x22https://unpkg.com/aframe-animation-component@5.1.2/dist/aframe-animation-component.min.js\x22></script>";
                                            }
                                        }
                                        if (sceneResponse.sceneLocations[i].markerType == "player") {
                                            playerPosition = sceneResponse.sceneLocations[i].x + " " + sceneResponse.sceneLocations[i].y + " " + sceneResponse.sceneLocations[i].z;
                                        }
                                    }
                                }
                                if (sceneData.scenePrimaryAudioID != null && sceneData.scenePrimaryAudioID.length > 4) {
                                    var pid = ObjectID(sceneData.scenePrimaryAudioID);
                                    console.log("tryna get [ObjectID(sceneData.scenePrimaryAudioID)]" + ObjectID(sceneData.scenePrimaryAudioID));
                                    requestedAudioItems.push(ObjectID(sceneData.scenePrimaryAudioID));

//                                  sceneResponse = sceneData[0];
                                    // console.log(JSON.stringify(requestedAudioItems));
                                }
                                callback();
                                
                            }
                            // callback();

                        });
            },
       
            function (callback) {
                if (sceneGLTFs.length > 0) {
                    var assetNumber = 1;
                    var scale = 1;
                                var offsetPos = "";
                                var rotAnim = "";
                                var posAnim = "";
                                var rightRot = true;
                                var rotVal = 360;
                                var objAnim = "";
                    async.each (sceneGLTFs, function (r, callbackz) { //loop tru w/ async
                        // for (var i = 0; i < sceneGLTFs)
                        var sourcePath =   "servicemedia/users/" + sceneOwnerID + "/gltf/" + r.gltf;
                        console.log("tryna copy " + sourcePath);
                        // var assetURL = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: fileKey, Expires: 60000});
                        // itme.url = assetURL;
                        assetNumber++;
                        var assetID = "gltfasset" + assetNumber;
                        // gltfItems.push(itme);
                        // gltfs = gltfs + "<a-gltf-model src=\x22" + assetURL + "\x22 crossorigin=\x22anonymous\x22 position =\x22"+r.x+" "+r.y+" "+r.z+"\x22></a-gltf-model>";
                        // gltfsAssets = gltfsAssets + "<a-asset-item id=\x22" + assetID + "\x22 src=\x22"+ assetURL +"\x22></a-asset-item>";
                        // gltfsEntities = gltfsEntities + "<a-entity class=\x22gltf\x22 gltf-model=\x22#" + assetID + "\x22></a-entity>";
                        // console.log("sceneGLTFs: " + gltfs);
                        s3.copyObject({Bucket: bucketFolder, CopySource: sourcePath, Key: short_id +"/"+ r.gltf}, function (err,data){
                            if (err) {
                                console.log("ERROR copyObject");
                                console.log(err);
                                callbackz(err);
                            } else {
                                console.log('SUCCESS copyObject' + JSON.stringify(data));
                                randomizerScript = "<script src=\x22https://unpkg.com/aframe-randomizer-components@3.0.2/dist/aframe-randomizer-components.min.js\x22></script>;"
                                
                                if (r.markerObjScale != null && r.markerType != undefined){
                                    scale = r.markerObjScale;
                                }
                                if (r.eventData != null && r.eventData != undefined && r.eventData.length > 4) { //eventData has anim 
                                    console.log("!!!tryna setup animation " + r.eventData);

                                    rightRot = !rightRot;
                                    if (rightRot == true) {
                                        rotVal = -360;
                                    }
                                    var eSplit = r.eventData.split("~");
                                    if (eSplit[0] == "orbit") { 

                                        offsetPos =  "<a-entity position=\x22"+ eSplit[1] + " 0 0\x22></a-entity>";
                                        // rotAnim = " rotation=\x220 0 0\x22 animation=\x22property: rotation; to: 0 " + rotVal + " 0; repeat=\x22indefinite\x22 easing=\x22linear\x22 dur: 20000\x22 ";
                                        rotAnim = " animation__rot=\x22property:rotation; dur:3000; to:0 360 0; loop: true; easing:linear;\x22 ";                                    
                                        posAnim = " animation__pos=\x22property: position; to: random-position; dur: 15000; loop: true;\x22 ";
                                    }
                                }
                                gltfsAssets = gltfsAssets + "<a-asset-item id=\x22" + assetID + "\x22 src=\x22"+ r.gltf +"\x22></a-asset-item>";
                                gltfsEntities = gltfsEntities + "<a-entity class=\x22gltf\x22 gltf-model=\x22#" + assetID + "\x22 position =\x22"+r.x+" "+r.y+" "+r.z+"\x22 random-rotation scale=\x22"+scale+" "+scale+" "+scale+"\x22 " + posAnim + " " + rotAnim + " " + objAnim + ">" + offsetPos + "</a-entity>";
                                callbackz();
                            }
                        });
                        
                    }, function(err) {
                       
                        if (err) {
                            console.log('A file failed to process');
                            callbackz(err);
                        } else {
                            console.log('All files have been processed successfully');
                            // gltfItems.reverse();
                            // rezponze.gltfItems = gltfItems;
                            callback(null);
                        }
                    });
                } else {
                    callback();
                }
            },
            function (callback) {
                if (sceneResponse.sceneNextScene != null && sceneResponse.sceneNextScene != "") {
                    db.scenes.findOne({$or: [ { short_id: sceneResponse.sceneNextScene }, { sceneTitle: sceneResponse.sceneNextScene } ]}, function (err, scene) {
                        if (scene == err) {
                            console.log("didn't find that scene");
                        } else {
                            nextLink = "href=\x22../" + scene.short_id + "/index.html\x22";    
                        }
                    }); 
                }
                if (sceneResponse.scenePreviousScene != null && sceneResponse.scenePreviousScene != "") {
                    db.scenes.findOne({$or: [ { short_id: sceneResponse.scenePreviousScene }, { sceneTitle: sceneResponse.scenePreviousScene } ]}, function (err, scene) {
                        if (scene == err) {
                            console.log("didn't find that scene");
                        } else {
                            prevLink = "href=\x22../" + scene.short_id + "/index.html\x22";    
                        }
                    }); 
                }
                callback();
            },

            function (callback) { //fethc audio items

                    db.audio_items.find({_id: {$in: requestedAudioItems }}, function (err, audio_items) {
                        if (err || !audio_items) {
                            console.log("error getting audio items: " + err);
                            callback(null);
                        } else {

                            callback(null, audio_items) //send them along
                        }
                    });
            },
            
            function (audio_items, callback) { //add the signed URLs to the obj array
                    for (var i = 0; i < audio_items.length; i++) {
                        console.log("audio_item: ", audio_items[i]);
                        var item_string_filename = JSON.stringify(audio_items[i].filename);
                        item_string_filename = item_string_filename.replace(/\"/g, "");
                        var item_string_filename_ext = getExtension(item_string_filename);
                        var expiration = new Date();
                        expiration.setMinutes(expiration.getMinutes() + 1000);
                        var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                        //console.log(baseName);
                        var mp3Name = baseName + '.mp3';
                        var oggName = baseName + '.ogg';
                        var pngName = baseName + '.png';
                        s3.copyObject({Bucket: bucketFolder, CopySource: 'servicemedia/users/' + audio_items[i].userID +"/"+ audio_items[i]._id + "." + mp3Name, Key: short_id +"/"+ audio_items[i]._id + "." + mp3Name}, function (err,data){
                            if (err) {
                                console.log("ERROR copyObject");
                                console.log(err);
                            }
                            else {
                                console.log('SUCCESS copyObject');
                            }
                        });

                        s3.copyObject({Bucket: bucketFolder, CopySource: 'servicemedia/users/' + audio_items[i].userID +"/"+ audio_items[i]._id + "." + oggName, Key: short_id +"/"+ audio_items[i]._id + "." + oggName}, function (err,data){
                            if (err) {
                                console.log("ERROR copyObject");
                                console.log(err);
                            }
                            else {
                                console.log('SUCCESS copyObject');

                            }
                        });
                        s3.copyObject({Bucket: bucketFolder, CopySource: 'servicemedia/users/' + audio_items[i].userID +"/"+ audio_items[i]._id + "." + pngName, Key: short_id +"/"+ audio_items[i]._id + "." + pngName}, function (err,data){
                            if (err) {
                                console.log("ERROR copyObject" + err);
                            }
                            else {
                                console.log('SUCCESS copyObject');
                            }
                        });
                        mp3url = audio_items[i]._id + "." + mp3Name;
                        oggurl = audio_items[i]._id + "." + oggName;
                        pngurl = audio_items[i]._id + "." + pngName;
                        console.log("copying audio to s3...");
                    }

                    callback(null);
                },
            function (callback) {
                    if (mp3url == null || mp3url == undefined || mp3url.length < 10) {
                        if (sceneResponse.scenePrimaryAudioStreamURL != null && sceneResponse.scenePrimaryAudioStreamURL.length > 8 ) {
                            mp3url = sceneResponse.scenePrimaryAudioStreamURL + "/stream";   
                            oggurl = sceneResponse.scenePrimaryAudioStreamURL + "/stream";                    
                            callback();
                        } else {
                            callback();
                        }
                    } else {
                        callback();
                    }  
            },
            function (callback) { //fethc video items
                if (sceneResponse.sceneVideos != null) {
                    sceneResponse.sceneVideos.forEach(function (vid) {
                        console.log("looking for sceneVideo : " + JSON.stringify(vid));
                        var p_id = ObjectID(vid); //convert to binary to search by _id beloiw
                        requestedVideoItems.push(p_id); //populate array
                    });
                    db.video_items.find({_id: {$in: requestedVideoItems}}, function (err, video_items) {
                        if (err || !video_items) {
                            console.log("error getting video items: " + err);
                            callback(null, new Array());
                        } else {
                            console.log("gotsome video items: " + JSON.stringify(video_items[0]));

                            callback(null, video_items) //send them along
                        }
                    });
                } else {
                    callback(null, new Array());
                }
            },

            function (video_items, callback) { //add the signed URLs to the obj array

                    //for (var i = 0; i < 1; i++) { //only do first one for now..
                        if (video_items != null && video_items[0] != null) {
                            console.log("video_item: " + JSON.stringify(video_items[0]));
                            var item_string_filename = JSON.stringify(video_items[0].filename);
                            item_string_filename = item_string_filename.replace(/\"/g, "");
                            var item_string_filename_ext = getExtension(item_string_filename);
                            var expiration = new Date();
                            expiration.setMinutes(expiration.getMinutes() + 1000);
                            var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                            //console.log(baseName);
                            var mp4Name = baseName + '.mp4';
                            console.log("mp4 video: " + mp4Name + " " + video_items[0]._id);
                            var vid = video_items[0]._id;
                            var ori = video_items[0].orientation != null ? video_items[0].orientation : "";
                            mp4url = vid + "." + mp4Name;
                            s3.copyObject({
                                Bucket: bucketFolder,
                                CopySource: 'servicemedia/users' + video_items[0].userID + "/" + video_items[0]._id + "." + mp4Name,
                                Key: short_id + "/" + video_items[0]._id + "." + mp4Name
                            }, function (err, data) {
                                if (err) {
                                    console.log("ERROR copyObject");
                                    console.log(err);
                                    callback(null);
                                } else {
                                    console.log('SUCCESS copyObject for video item ');

//                                    videoAsset = "<video id=\x22video1\x22 src=\x22" + mp4url + "\x22 autoplay='true' loop='true'>";
                                    if (ori == "equirectangular") {
                                        videoEntity = "<a-videosphere src=\x22" + mp4url + "\x22 rotation=\x220 180 0\x22 material=\x22shader: flat; transparent: true;\x22></a-videosphere>";
//                                        skySettings = "transparent='true'";
                                    } else {
                                        videoEntity = "<a-video src=\x22#video1\x22 position='5 5 -5' width='8' height='4.5' look-at=\x22#player\x22></a-video>";
                                    }
                                    console.log("copying video to s3...");
                                    callback(null);

                                }
                            });
                    } else {
                        callback(null);
                    }
            },

            function (callback) {
                var postcards = [];
                console.log("sceneResponse.scenePostcards: " + JSON.stringify(sceneResponse.scenePostcards));
                if (sceneResponse.scenePostcards != null && sceneResponse.scenePostcards.length > 0) {
                    var index = 0;
                    async.each(sceneResponse.scenePostcards, function (postcardID, callbackz) { //nested async-ery!
                        var oo_id = ObjectID(postcardID);

                        db.image_items.findOne({"_id": oo_id}, function (err, picture_item) {
                            if (err || !picture_item) {
                                console.log("error getting postcard " + postcardID + err);
                                callbackz();
                            } else {

                                s3.copyObject({Bucket: bucketFolder, CopySource: 'servicemedia/users/' + picture_item.userID +"/"+ picture_item._id + ".standard." + picture_item.filename,
                                    Key: short_id +"/"+ picture_item._id + ".standard." + picture_item.filename}, function (err, data) {
                                    if (err) {
                                        console.log("ERROR copyObject" + err);
                                    }
                                    else {
                                        console.log('SUCCESS copyObject');

                                    }

                                });
                                index++;
                                postcard1 = picture_item._id + ".standard." + picture_item.filename;
//                                picArray.push(image1url);
//                                imageAssets = imageAssets + "<img id=\x22smimage" + index + "\x22 src='"+ image1url +"'>";
//                                imageEntities = imageEntities + "<a-image look-at=\x22#player\x22 width='10' segments-height='4' segments-width='2' height='10' position='-2 6 2' rotation='0 180 0' visible='true' src=\x22#smimage" + index + "\x22></a-image>";
                                callbackz();
                            }
                        });
                        },
                        function (err) {
                       
                            if (err) {
                                console.log('A file failed to process');
                                callback(null);
                            } else {
                                console.log('All files have been processed successfully');
                                callback(null);
                            }
                        });
                    } else {
    //                      callback(null);
                        callback(null);
                    }
         },
            function (callback) {
                var postcards = [];
                console.log("sceneResponse.scenePictures: " + JSON.stringify(sceneResponse.scenePictures));
                if (sceneResponse.scenePictures != null && sceneResponse.scenePictures.length > 0) {
                    var index = 0;
                    async.each(sceneResponse.scenePictures, function (picID, callbackz) { //nested async-ery!
                            var oo_id = ObjectID(picID);

                            db.image_items.findOne({"_id": oo_id}, function (err, picture_item) {
                                if (err || !picture_item) {
                                    console.log("error getting scenePictures " + picID + err);
                                    callbackz();
                                } else {
                                    console.log("tryna copy picID " + picID + " orientation " + picture_item.orientation);
                                    var version = ".standard.";
                                    if (picture_item.orientation == "equirectangular") {
                                        skyboxID = picID;
                                        version = ".original.";
                                    }
                                    s3.copyObject({Bucket: bucketFolder, CopySource: 'servicemedia/users/' + picture_item.userID +"/"+ picture_item.filename, //use full rez pic for skyboxen
                                        Key: short_id +"/"+ picture_item._id + version + picture_item.filename}, function (err, data) {
                                        if (err) {
                                            console.log("ERROR copyObject" + err);
                                        } else {
                                            console.log('SUCCESS copyObject');
                                        }
                                    });
                                    if (picture_item.orientation != "equirectangular") {
                                        index++;
                                        image1url = picture_item._id + ".standard." + picture_item.filename;
                                        picArray.push(image1url);
                                        imageAssets = imageAssets + "<img id=\x22smimage" + index + "\x22 src='" + image1url + "'>";
                                        imageEntities = imageEntities + "<a-image look-at=\x22#player\x22 width='10' segments-height='4' segments-width='2' height='10' position='-2 6 2' rotation='0 180 0' visible='true' src=\x22#smimage" + index + "\x22></a-image>";
                                    }
                                    callbackz();
                                }
                            });
                        },
                        function (err) {
                           
                            if (err) {
                                console.log('A file failed to process');
                                callback(null);
                            } else {
                                console.log('All files have been processed successfully');
                                callback(null);
                            }
                        });
                } else {
                    //                      callback(null);
                    callback(null);
                }
            },

            function (callback) {

//                if (sceneResponse.sceneUseSkybox && sceneResponse.sceneSkybox != null) {
//                    if (sceneResponse.sceneUseSkybox) {
                            if (skyboxID != "") {
                                var oo_id = ObjectID(skyboxID);
                            } else {
                                if (sceneResponse.sceneSkybox != null && sceneResponse.sceneSkybox != "")
                                var oo_id = ObjectID(sceneResponse.sceneSkybox);
                            }

                            if (oo_id) {

                                db.image_items.findOne({"_id": oo_id}, function (err, picture_item) {
                                    if (err || !picture_item) {
                                        console.log("error getting skybox " + sceneResponse.sceneSkybox + err);
                                        callback(null);
                                    } else {

                                        s3.copyObject({Bucket: bucketFolder, CopySource: 'servicemedia/users/' + picture_item.userID + "/" + picture_item.filename,
                                            Key: short_id + "/" + picture_item._id + ".original." + picture_item.filename}, function (err, data) {
                                            if (err) {
                                                console.log("ERROR copyObject" + err);
                                            }
                                            else {
                                                console.log('SUCCESS copyObject');

                                            }

                                        });
//                                    skyboxAsset = "<img id=\x22smskybox"\x22 src='" + skyboxUrl + "'>";
//                                    skyboxEntity = "<a-image look-at=\x22#player\x22 width='10' segments-height='4' segments-width='2' height='10' position='-2 6 2' rotation='0 180 0' visible='true' src=\x22#smimage" + index + "\x22></a-image>";
                                        skyboxUrl = picture_item._id + ".original." + picture_item.filename;
                                        skySettings = "<a-sky hide-in-ar-mode src=#sky></a-sky>";
                                        callback(null);
                                    }
                                });
                            } else {
                                callback(null);
                            }
//                } else {
//                    //                      callback(null);
//                    callback(null);
//                }
            },

            function (callback) {
                var playButton = "<script>" +
                "AFRAME.registerComponent('playbutton', {" +
                "schema: {" + 
                  "'target': {type: 'selector'}, " +
                    "}," +
                  "init: function () {" +
                  "var play=false;    " +
                  "var mAudio = document.getElementById(\x22mainaudio\x22);" +
                    "this.el.addEventListener(\x22click\x22,()=>{" +
                    "if(play){" +
                        "console.log(\x22tryna play\x22);" +
                        "mAudio.play();" +
                        //   "this.data.target.setAttribute(\x22visible\x22,\x22false\x22);" +
                        // "this.el.querySelector(\x22a\x22).innerHTML=\x22Play\x22;" +
                        "}else{" +
                        "console.log(\x22tryna pause\x22);" +
                        "mAudio.pause();" +
                    //   "this.data.target.setAttribute(\x22visible\x22,\x22true\x22);" +
                    //   " this.el.querySelector(\x22a\x22).innerHTML=\x22Pause\x22;" +
                        "}" +
                      "play=!play;" +
                      "});" +
                    "  }" +
                "});" +
                "</script>";
                var embeddedHTML = "<div class=\x22screen dark main\x22>" +                
                // "<ul>" +
                // "<li>" +
                "<a class=\x22button\x22 href=\x22http://" + sceneResponse.sceneDomain + "\x22>Home</a>" +
                // "</li>" +
                // "<li>" +
                "<a class=\x22button\x22 href=\x22http://" + sceneResponse.sceneDomain + "/" + sceneResponse.short_id + "/index.html\x22>" + sceneResponse.sceneTitle + " : " + sceneResponse.short_id + "</a>" +
                // "</li>" +
                // "<li>" +
                "<a-entity playbutton><a class=\x22button\x22 href=\x22javascript:void(0)\x22>Play Main Audio</a></a-entity>" +
                // "<audio controls " + loopable + " id=\x22mainaudio\x22>" +
                //  "<source src='" + oggurl + "'type='audio/ogg'>" +
                //  "<source src='" + mp3url + "'type='audio/mpeg'>" +
                //  "Your browser does not support the audio element. " +
                //  "</audio>" +
                // "</li>" +
                // "</ul>" +
                "</div>";
                var htmltext = "<html xmlns='http://www.w3.org/1999/xhtml'>" +
                    "<head> " +
                    "<meta charset='utf-8'/>" +
                    "<meta name='viewport' content='width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no'/>" +
                    "<meta property='og:url' content='http://" + sceneResponse.sceneDomain + "/" + sceneResponse.short_id + "' /> " +
                    "<meta property='og:type' content='website' /> " +
                    "<meta property='og:image' content='http://" + sceneResponse.sceneDomain + "/" + sceneResponse.short_id + "/" + postcard1 + "' /> " +
                    "<meta property='og:image:height' content='1024' /> " +
                    "<meta property='og:image:width' content='1024' /> " +
                    "<meta property='og:title' content='" + sceneResponse.sceneTitle + "' /> " +
                    "<meta property='og:description' content='" + sceneResponse.sceneDescription + "' /> " +
                    "<title>" + sceneResponse.sceneTitle + "</title>" +
                    "<meta name='description' content='" + sceneResponse.sceneDescription + "'/>" +
                    "<meta name=\x22mobile-web-app-capable\x22 content=\x22yes\x22>" +
                    "<meta name=\x22apple-mobile-web-app-capable\x22 content=\x22yes\x22>" +
                    "<meta name='apple-mobile-web-app-status-bar-style' content='black-translucent' />" +
                    "<meta name='apple-mobile-web-app-status-bar-style' content='black'>" +
                    "<meta name='robots' content='index,follow'/>" +
                    // "<script src='../dist/compat.js'></script>" +
//                    "<script src='../dist/unlockaudio.js'></script>" +

                    "<script src='https://aframe.io/releases/1.0.3/aframe.min.js'></script>" +
//                    "<script src='../dist/aframe-particle-system-component.min.js'></script>" +
                    // "<script src='../dist/aframe-href-component.js'></script>" +
//                    "<script>window.WebVRConfig = {BUFFER_SCALE: 1.0,};</script>"+
                    // "<script src='https://cdn.jsdelivr.net/gh/donmccurdy/aframe-extras@v6.0.1/dist/aframe-extras.min.js'></script>" +
                    "<script src='https://cdn.jsdelivr.net/gh/donmccurdy/aframe-extras@v6.0.1/dist/aframe-extras.min.js'></script>" +
                    // <script src="https://unpkg.com/aframe-look-at-component@0.8.0/dist/aframe-look-at-component.min.js"></script>
                    "<script src='https://unpkg.com/aframe-look-at-component@0.8.x/dist/aframe-look-at-component.min.js'></script>" +
                    "<script src='https://unpkg.com/aframe-layout-component@4.0.1/dist/aframe-layout-component.min.js'></script>" +
                    "<script src='https://supereggbert.github.io/aframe-htmlembed-component/dist/build.js'></script>" +
                    ARScript +

                    "<link rel=\x22stylesheet\x22 href=\x22https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css\x22 integrity=\x22sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm\x22 crossorigin=\x22anonymous\x22></link>"+

                    style +
                    playButton + 
                    
                    "</head>" +

                    "<body bgcolor='black'>" +
                    "<div style=\x22width:100%; height:100%\x22>"+

                    "<div style=\x22display: none;\x22>" +
                    "<audio controls " + loopable + " id=\x22mainaudio\x22>" +
                     "<source src='" + oggurl + "'type='audio/ogg'>" +
                     "<source src='" + mp3url + "'type='audio/mpeg'>" +
                     "Your browser does not support the audio element. " +
                    "</audio>" +
                    "</div>" +
                    // "</li>" +
                    // "</ul>" +

                    // "</nav>" +
                    // // "<div id=/x22fb-root/x22></div>" +
//                  "<div style='background-image: url(" + image1url + "); height: 100%; width: 100%; border: 1px solid black;'>" +

                    "<a-scene " + fogSettings + " " + ARSceneArg + " " + environment + ">" +
                    ARMarker +
                    camera +

                    "<a-entity look-at=\x22#player\x22 ppc=\x22500\x22 htmlembed position=\x220 6 -6\x22 >" +
                    // "<div style=\x22bg-light\x22><h1>"+sceneResponse.sceneKeynote+"</h1><p>"+sceneResponse.sceneDescription+"</p></div><img src=\x22"+picArray[0]+"\x22 class=\x22image-thumbnail\x22 alt=\x22image\x22>"+ 
                    // "<div style=\x22background-color: white;\x22><p style=\x22color:blue;margin:20px;font-size:46px;\x22>"+sceneResponse.sceneKeynote+"</p><p style=\x22color:red;margin:20px;font-size:36px;\x22>"+sceneResponse.sceneDescription+"</p></div>"+
                    // "<div><h1>"+sceneResponse.sceneKeynote+"</h1><p>"+sceneResponse.sceneDescription+"</p></div>"+ 
                    
                    embeddedHTML +
                    "</a-entity>" +


                    ground +
                    skyParticles +
                    "<a-assets>" +

                    "<a-asset><img id=\x22sky\x22 src=\x22" + skyboxUrl +"\x22>></a-asset>" +
                    imageAssets +
                    "<audio id=\x22song\x22 crossorigin " + loopable + " autoload src=\x22" + mp3url + "\x22></audio>" +
                    gltfsAssets +
                    videoAsset +
//                    targetObjectAsset +
                    "</a-assets>" +

                    gltfsEntities + 
                    "<a-entity position='0 3.5 0' layout=\x22type: circle; radius: 30\x22>" +
                    imageEntities +
                    "</a-entity>" +
//                    targetObjectEntity +
                    videoEntity +

                    "<a-sound position='2 5 2'" + loopable +  "sound='src: #song' autoplay='true'></a-sound>" +
//                    "<a-entity ring-on-beat=\x22analyserEl: #audioanalyser; position='0 4 0'></a-entity>"+
//                    "<a-sphere material=\x22 sphericalEnvMap:\x22" + skyboxUrl + "\x22 roughness: 0 transparent='true' opacity='.9'\x22 audioanalyser-volume-scale=\x22analyserEl: #audioanalyser; multiplier: .005\x22 color=\x22" + sceneResponse.sceneColor2 + "\x22 radius='5' position='0 10 0'></a-sphere>"+
//                    "<a-gltf-model src='../assets/models/heart1/heart1.gltf' position='4 10 -4' rotation='-90 0 0' color='red'></a-gltf-model>" +
//                    "<a-curvedimage src='#my-image' height='3.0' radius='5.7' theta-length='72' 'rotation='0 100 0' scale='0.8 0.8 0.8'></a-curvedimage>"+d

                    // "<a-sky src=\x22" + skyboxUrl + "\x22 color='" + sceneResponse.sceneColor1 + "'></a-sky>" +

                    skySettings +

                    "<a-light type='ambient' color='" + sceneResponse.sceneColor2 + "'></a-light>" +
                    "<a-light color='" + sceneResponse.sceneColor2 + "' distance='100' intensity='0.4' type='point'></a-light>" +
                    "<a-light color='" + sceneResponse.sceneColor2 + "' position='3 10 -10' distance='50' intensity='0.4' type='point'></a-light>" +

                    "<12234>" +
                    "</div>" +

                    "<script src=\x22https://code.jquery.com/jquery-3.2.1.slim.min.js\x22 integrity=\x22sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN\x22 crossorigin=\x22anonymous\x22></script>" +
                    // "<script src=\x22https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js\x22 integrity=\x22sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q\x22 crossorigin=\x22anonymous\x22></script>" +
                    "<script src=\x22https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js\x22 integrity=\x22sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl\x22 crossorigin=\x22anonymous\x22></script>" +
                    "</body>" +

                "</html>";
                s3.putObject({ Bucket: bucketFolder, Key: short_id+"/"+"webxr.html", Body: htmltext,  ContentType: 'text/html;charset utf-8', ContentEncoding: 'UTF8' }, function (err, data) {
                    console.log('uploaded');
                    callback(null);
                });


            }
        ], //waterfall end

        function (err, result) { // #last function, close async
            if (err != null) {
                res.send("error!! " + err);
            } else {
                res.send("generated");
                console.log("webxr gen done: " + result);
            }
        }
    );
});
*/

module.exports = webxr_router;