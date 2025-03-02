import { createRequire } from "module";
const require = createRequire(import.meta.url);


// import { app } from '../server.js'; 
const express = require("express");
const landing_router = express.Router();
const entities = require("entities");
const async = require('async');
const ObjectID = require("bson-objectid");
const path = require("path");
const validator = require('validator');
const jwt = require("jsonwebtoken");
const requireText = require('require-text');
const { Console } = require("console");
const minio = require('minio');


import { db } from "../server.js";
// import { s3 } from "../server.js";
import { ReturnPresignedUrl, ReturnObjectMetadata, ReturnObjectExists, CopyObject } from "../server.js";

const stripe = require('stripe')(process.env.STRIPE_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;



var minioClient = null;
if (process.env.MINIOKEY && process.env.MINIOKEY != "" && process.env.MINIOENDPOINT && process.env.MINIOENDPOINT != "") {
        minioClient = new minio.Client({
        endPoint: process.env.MINIOENDPOINT,
        port: 9000,
        useSSL: false,
        accessKey: process.env.MINIOKEY,
        secretKey: process.env.MINIOSECRET
    });
}

const nonLocalDomains = ["regalrooms.tv", "bishopstudiosaustin.com"]; //TODO you know what! (put this in sceneDomain object)
// function ReturnPresignedUrlSync (bucket, key, time) {
//     if (minioClient) {
//         minioClient.presignedGetObject(bucket, key, time, function(err, presignedUrl) { //use callback version here, can't await?
//             if (err) {
//                 console.log(err);
//                 return "err";
//             } else {
//                 return presignedUrl;
                
//             }
//         });
//     } else {
//         return s3.getSignedUrl('getObject', {Bucket: bucket, Key: key, Expires: time});
//     }
// }
// async function ReturnPresignedUrl(bucket, key, time) {
    
//     if (minioClient) {
//         try {
//             return minioClient.presignedGetObject(bucket, key, time);
//         } catch (error) {
//             return error
//         }
//     } else {
//         try {
//             return s3.getSignedUrl('getObject', {Bucket: bucket, Key: key, Expires: time}); //returns a promise if called in async function?
//         } catch (error) {
//             return error;
//         } 
//     }
// }

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
    
// webxr_router.get("/test", function (req, res) {
//     res.send("OK!");
// });    

function hexToRgb(c){
    if(/^#([a-f0-9]{3}){1,2}$/.test(c)){
        if(c.length== 4){
            c= '#'+[c[1], c[1], c[2], c[2], c[3], c[3]].join('');
        }
        c= '0x'+c.substring(1);
        return ''+[(c>>16)&255, (c>>8)&255, c&255].join(',')+')';
        // return ""+(c>>16)&255+ ", "+(c>>8)&255+ ", "+ c&255+"";
    }
    return '';
}
function HexToRgbValues (c) {
    var aRgbHex = '1502BE'.match(/.{1,2}/g);
    var aRgb = parseInt(aRgbHex[0], 16) + " " + parseInt(aRgbHex[1], 16) + " " +  parseInt(aRgbHex[2], 16);
console.log(aRgb); //[21, 2, 190]
    return aRgb;
}

// function ReturnPresignedUrlSync (bucket, key, time) {
//     if (minioClient) {
//         minioClient.presignedGetObject(bucket, key, time, function(err, presignedUrl) { //use callback version here, can't await?
//             if (err) {
//                 console.log(err);
//                 return "err";
//             } else {
//                 console.log("minio sync url " + presignedUrl)
//                return presignedUrl;
                
//             }
//         });
//     } else {
//         let url = s3.getSignedUrl('getObject', {Bucket: bucket, Key: key, Expires: time});
//         console.log("s3 sync url" + url);
//         return url;
//     }
// }
// async function ReturnPresignedUrl(bucket, key, time) {
    
//     if (minioClient) {
//         try {
//             return minioClient.presignedGetObject(bucket, key, time);
//         } catch (error) {
//             return error
//         }
//     } else {
//         try {
//             return s3.getSignedUrl('getObject', {Bucket: bucket, Key: key, Expires: time}); //returns a promise if called in async function?
//         } catch (error) {
//             return error;
//         } 
//     }
// }
// app.post('/create-checkout-session', async (req, res) => {
//     const session = await stripe.checkout.sessions.create({
  
//       line_items: [
//         {
//           price_data: {
//             currency: 'usd',
//             product_data: {
//               name: 'super cool immersive rock show',
//             },
//             unit_amount: 2000,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: process.env.ROOT_HOST +'/stripe_events',
//       cancel_url: process.env.ROOT_HOST +'/static/cancel.html',
//       payment_intent_data: {
//         metadata: {
//           product_id: '1000',
//           product_name: 'super cool immersive rock show!'
//         }
//       }
//     });
  
//     res.redirect(303, session.url);
//   });


//   function saveTraffic (req, res, next) {
//     let timestamp = Date.now();

//     timestamp = parseInt(timestamp);
//     // console.log("tryna save req" + );
//     var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
//     // let request = {};

//     var userdata = {
//         username: req.session.user ? req.session.user.userName : "",
//         _id: req.session.user ? req.session.user._id : "",
//         email: req.session.user ? req.session.user.email : "",
//         status: req.session.user ? req.session.user.status : "",
//         authlevel: req.session.user ? req.session.user.authLevel : ""
//     };
//     // console.log("traffic userdata " + JSON.stringify(userdata));
//     let data = {
//             timestamp: timestamp,
//             baseUrl: req.baseUrl,
//             headers: JSON.stringify(req.headers),
//             cookie: JSON.stringify(req.session.cookie),
//             userdata: userdata,
//             fresh: req.fresh,
//             hostname: req.hostname,
//             ip: req.ip,
//             referring_ip: ip,
//             method: req.method,
//             originalUrl: req.originalUrl,
//             params: JSON.stringify(req.params),
           
//         }
//         db.traffic.save(data, function (err, saved) {
//             if ( err || !saved ) {
//                 console.log('traffic not saved!' + err);
//                 next();
                
//             } else {
//                 next();
//                 // var item_id = saved._id.toString();
//                 // console.log('new traffic id: ' + item_id);
//             }
//         });
//     }


function saveTraffic (req, domain, shortID) {
    let timestamp = Date.now();

    timestamp = parseInt(timestamp);
    // console.log("tryna save req" + );
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
    // let request = {};

    var userdata = {
        username: req.session.user ? req.session.user.userName : "",
        _id: req.session.user ? req.session.user._id : "",
        email: req.session.user ? req.session.user.email : "",
        status: req.session.user ? req.session.user.status : "",
        authlevel: req.session.user ? req.session.user.authLevel : ""
    };
    // console.log("traffic userdata " + JSON.stringify(userdata));
    let data = {
            short_id: shortID,
            appdomain: domain,
            timestamp: timestamp,
            baseUrl: req.baseUrl,
            headers: JSON.stringify(req.headers),
            cookie: JSON.stringify(req.session.cookie),
            userdata: userdata,
            fresh: req.fresh,
            hostname: req.hostname,
            ip: req.ip,
            referring_ip: ip,
            method: req.method,
            originalUrl: req.originalUrl,
            params: JSON.stringify(req.params),
           
        }
        db.traffic.save(data, function (err, saved) {
            if ( err || !saved ) {
                console.log('traffic not saved!' + err);
                // next();
                
            } else {
                // next();
                // var item_id = saved._id.toString();
                // console.log('new traffic id: ' + item_id);
            }
        });
    }    

////////////////////PRIMARY SERVERSIDE LANDING ROUTE///////////////////
landing_router.get('/:_id', function (req, res) { 
    // let db = req.app.get('db');
    // let s3 = req.app.get('s3');
    // let minioClient = req.app.get('minioClient');



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
    var modelAssets = "";
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
    var sceneTextLocations = [];

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
    let styleIncludes = "";
    // let sceneNextScene = "";
    // let scenePreviousScene = "";
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
    // let primaryAudioLoop = false;
    let networkedscene = "";
    // let socketHost = req.headers.host;
    let socketHost = process.env.SOCKET_HOST;
    let avatarName = "guest";
    // let skyGradientScript = "";
    let textLocation = "";
    // let pictureLocation = "";
    let picturegroupLocation = "-4 2 3";
    let scenesKeyLocation = null;
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
    let extraEntities = ""; //matrix.org comms
    // let parametricEntities = "";
    let lightEntities = "";
    let placeholderEntities = "";
    let proceduralEntities = "";
    // let placeholderEntities = "<a-entity id=\x22createPlaceholders\x22 create_placeholders></a-entity>";
    let calloutEntities = "";
    let carLocation = "";
    let cameraEnvMap = "";
    // let cubeMapAsset = ""; //deprecated, all at runtime now..
    let contentUtils = "<script src=\x22../main/src/component/content-utils.js\x22 defer=\x22defer\x22></script>"; 
    let videosphereAsset = "";
    let textEntities = "";
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
    let tilepicUrl = "";
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
    // let googleAnalytics = "<!-- Global site tag (gtag.js) - Google Analytics --><script async src=\x22https://www.googletagmanager.com/gtag/js?id=UA-163893846-1\x22></script>"+
    //     "<script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'UA-163893846-1');"+
    //     "</script>";
        
    // let googleAdSense = "<script data-ad-client=\x22ca-pub-5450402133525063\x22 async src=\x22https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js\x22></script>";
    let googleAdSense = "";   
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
    // let aframeExtrasScript = "<script src=\x22../main/src/component/aframe-extras.min.js\x22></script>"; 
    let logScripts = "";
    let enviromentScript = ""; //for aframe env component
    
    // let aframeScriptVersion = "<script src=\x22https://aframe.io/releases/1.3.0/aframe.min.js\x22></script>";
    let aframeScriptVersion = "<script src=\x22https://aframe.io/releases/1.4.2/aframe.min.js\x22></script>";
    
    
    let surfaceScatterScript = "";
    let locationData = "";
    let modelData = "";
    let objectData = "";
    let inventoryData = "";
    let joystickContainer  = "";
    let arImageTargets = [];
    let sceneUnityWebDomain = "https://mvmv.us";
    let postcardImages = [];
    



    
    db.scenes.findOne({"short_id": reqstring}, function (err, sceneData) { 
            if (err || !sceneData) {
                console.log("1 error getting scene data: " + err);
                res.end();
            } else { 
                saveTraffic(req, sceneData.sceneDomain, sceneData.short_id);
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

                if (sceneData.sceneWebType == "Redirect to Unity Webplayer") {
                
                    db.apps.findOne({"appdomain": sceneData.sceneDomain}, function(err,app) {
                        if (err || !app) {
                            console.log("no apps for you!");
                            // res.json(domain);
                            res.redirect(process.env.ROOT_HOST);
                        } else {
                            // domain.apps = apps;
                            // res.json(domain);
                            if (app.appunitydomain) {
                                sceneUnityWebDomain = app.appunitydomain;
                            }
                            // console.log(sceneUnityWebDomain)
                            res.redirect(sceneUnityWebDomain + '/?scene=' + reqstring);
                        }
                    });
                                        
                } else {
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
                        if (sceneData.sceneTags[i].toLowerCase().includes("timer")) { //uses css font @import... //no! 
                             proceduralEntities = proceduralEntities + "<a-plane live_canvas=\x22src:#flying_canvas\x22 id=\x22flying_info_canvas\x22 material=\x22shader: flat; transparent: true;\x22look-at=\x22#player\x22 width=\x221\x22 height=\x221\x22 position=\x220 1.5 -1\x22></a-plane>";

                        }
                        if (sceneData.sceneTags[i].toLowerCase().includes("stats")) {
                            // logScripts = "<script src=\x22https://cdn.jsdelivr.net/gh/kylebakerio/vr-super-stats@1.5.0/vr-super-stats.js\x22></script>";
                        }
                        if (sceneData.sceneTags[i].toLowerCase().includes("logs")) {
                            logScripts = logScripts + "<script src=\x22../main/src/component/a-console.js\x22></script>";
                        }
                        if (sceneData.sceneTags[i].toLowerCase().includes("physics")) {
                            // physicsScripts =  "<script src=\x22https://mixedreality.mozilla.org/ammo.js/builds/ammo.wasm.js\x22></script>"+
                            physicsScripts =  "<script src=\x22https://cdn.jsdelivr.net/gh/MozillaReality/ammo.js@8bbc0ea/builds/ammo.wasm.js\x22></script>"+
                            "<script src=\x22../main/vendor/aframe/aframe-physics-system.min.js\x22></script>";                                                        
                        }
                        if (sceneData.sceneTags[i].toLowerCase().includes("brownian")) {
                            brownianScript =  "<script src=\x22../main/src/component/aframe-brownian-motion.js\x22></script>";
                        }
                        if (sceneData.sceneTags[i].toLowerCase().includes("instancing")) {
                            // console.log("GOTS SCENE TAG: " + sceneData.sceneTags[i]);
                            // showTransport = true;
                            meshUtilsScript = "<script type=\x22module\x22 src=\x22../main/src/component/instanced_mesh.js\x22></script><script type=\x22module\x22 src=\x22../main/src/component/mesh-utils.js\x22></script>"; //imports MeshSurfaceScatter
                            instancingEntity = "";
                        } 

                        if (sceneData.sceneTags[i].toLowerCase().includes("aabb") || sceneData.sceneTags[i].toLowerCase().includes("collision")) {
                            // console.log("GOTS SCENE TAG: " + sceneData.sceneTags[i]);
                            // showTransport = true;
                            meshUtilsScript = meshUtilsScript + "<script src=\x22../main/src/component/aframe-aabb-collider-component.min.js\x22></script>"; //imports MeshSurfaceScatter
                        } 
                        if (sceneData.sceneTags[i] == "instancing demo") {
                            
                            // instancingEntity = "<a-entity instanced_meshes_sphere_physics></a-entity>";
                        }
                        if (sceneData.sceneTags[i] == "pinball") {
                            
                            // instancingEntity =  "<a-entity id=\x22pinboard\x22 pinboard=\x22physics: ammo; height:20; width: 20\x22 position = \x220 0 -20\x22 rotation = \x2245 0 0\x22>" +
                            //                     "<a-box id=\x22pin-mesh\x22 color=\x22black\x22 width=\x220.1\x22 depth=\x220.1\x22 height=\x221\x22 instanced-mesh=\x22capacity: 500\x22></a-box></a-entity>" +
                            instancingEntity = "<a-sphere id=\x22ball-mesh\x22 radius=\x221\x22 color=\x22yellow\x22 instanced-mesh=\x22capacity: 100; updateMode: auto\x22></a-sphere>" +
                            "<a-entity id=\x22ball-recycler\x22 ball-recycler=\x22physics: ammo; ballCount: 10; width: 30; depth: 15; yKill: -30\x22 position=\x220 20 -25\x22></a-entity>";
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
                            // aframeScriptVersion = "<script src=\x22https://cdn.jsdelivr.net/gh/aframevr/aframe@744e2b869e281f840cff7d9cb02e95750ce90920/dist/aframe-master.min.js\x22></script>"; //ref 20220715// nope!
                            aframeScriptVersion = "<script src=\x22https://aframe.io/releases/1.4.1/aframe.min.js\x22></script>"; //ref 20220715// nope!
                        }
                        if (sceneData.sceneTags[i].toLowerCase().includes("aframe ada")) {
                            aframeScriptVersion = "<script src=\x22https://a-cursor-test.glitch.me/aframe-master.js\x22></script>"; //mod by @adarosecannon
                        }
                    }
                }
                //TODO use sceneNetworkSettings or whatever
                // socketScripts = "<script src=\x22/connect/connect.js\x22 defer=\x22defer\x22></script>" +
                // "<script src=\x22/main/vendor/jquery/jquery.min.js\x22></script>" +
                // socketScripts = "<script src=\x22https://strr.us/socket.io/socket.io.js\x22></script>";
                if (socketHost != null && socketHost != "NONE") {
                    socketScripts = "<script src=\x22/socket.io/socket.io.js\x22></script>"; //
                }
                
                // "<script src=\x22/main/vendor/jscookie/js.cookie.min.js\x22></script>" +
                    
                // TODO - backstretch include var!
                // "<script src=\x22/main/js/jquery.backstretch.min.js\x22></script>"; 
                if (avatarName == undefined || avatarName == null || avatarName == "guest") { //cook up a guest name if not logged in
                    let array1 = [];
                    let array2 = [];
                    let array3 = [];
                    let index1 = -1;
                    let index2 = -1;
                    let index3 = -1;
                    let name1 = "";
                    let name2 = "";
                    let name3 = "";
                    const min = 0;
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
                    // console.log("skyboxEnvMap is " + skyboxEnvMap);
                }

                        sceneOwnerID = sceneData.user_id;
                        short_id = sceneData.short_id;
                        sceneResponse = sceneData;

                        let poiIndex = 0;

                      
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
                                            "; longitude: "+sceneResponse.sceneLocations[i].longitude+";  _id: "+sceneResponse.sceneLocations[i].timestamp+"\x22 "+skyboxEnvMap+" class=\x22gltf poi envMap\x22 gltf-model=\x22#poi1\x22><a-entity scale=\x22.5 .5 .5\x22 position=\x22-.1 .5 0.1\x22 text-geometry=\x22value: "+poiIndex+"\x22></a-entity></a-entity>";
                                        
                                        } else if (sceneResponse.sceneWebType != "Mapbox") {
                                            geoEntities = geoEntities + "<a-entity look-at=\x22#player\x22 shadow=\x22cast:true; receive:true\x22 "+geoEntity+"=\x22latitude: "+sceneResponse.sceneLocations[i].latitude+
                                            "; longitude: "+sceneResponse.sceneLocations[i].longitude+";  _id: "+sceneResponse.sceneLocations[i].timestamp+"\x22 "+skyboxEnvMap+" class=\x22gltf poi envMap\x22 gltf-model=\x22#poi1\x22><a-entity scale=\x22.5 .5 .5\x22 position=\x22-.1 .5 0.1\x22 text-geometry=\x22value: "+poiIndex+"\x22></a-entity></a-entity>";
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
                             

                                if (sceneResponse.sceneLocations[i].objectID != undefined && sceneResponse.sceneLocations[i].objectID != "none" && sceneResponse.sceneLocations[i].objectID.length > 8) { //attaching object to location 
                                    // console.log("pushinbg object locaition " + sceneResponse.sceneLocations[i]);
                                    sceneObjectLocations.push(sceneResponse.sceneLocations[i]);
                                    
                                }
                                if (sceneResponse.sceneLocations[i].model != undefined && sceneResponse.sceneLocations[i].model != "none" && sceneResponse.sceneLocations[i].model.length > 0) { //new way of attaching gltf to location w/out object
                                    // console.log("pushinbg model locaition " + sceneResponse.sceneLocations[i]);
                                    sceneModelLocations.push(sceneResponse.sceneLocations[i]);
                                    // if (sceneResponse.sceneLocations[i].eventData != null && sceneResponse.sceneLocations[i].eventData.length > 4) {
                                    //     animationComponent = "<script src=\x22https://unpkg.com/aframe-animation-component@5.1.2/dist/aframe-animation-component.min.js\x22></script>"; //unused !NEEDS FIXING - this component could be added more than once
                                    // }
                                }
                                if (sceneResponse.sceneLocations[i].markerType != undefined && sceneResponse.sceneLocations[i].type.toLowerCase() != 'geographic') { //cloudmarkers, special type allows local mods
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
                                        if (!tLoc.markerObjScale) {
                                            tLoc.markerObjScale = 1;
                                        }
                                    
                                        locationPlaceholders.push(tLoc);
                                    }

                                }
                                if (sceneResponse.sceneLocations[i].markerType == "player") {
                                    
                                        playerPosition = sceneResponse.sceneLocations[i].x + " " +  sceneResponse.sceneLocations[i].y + " " +  sceneResponse.sceneLocations[i].z;
                               
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
                              
                                if (sceneResponse.sceneLocations[i].markerType == "picturegroup") {
                                    
                                    picturegroupLocation = sceneResponse.sceneLocations[i].x + " " + sceneResponse.sceneLocations[i].y + " " + zFix;
                                    console.log("gotsa picture geroup " + picturegroupLocation);
                                }
                                if (sceneResponse.sceneLocations[i].markerType == "available scenes key") { 
                                    
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
                                    pictureLocation.scale = sceneResponse.sceneLocations[i].scale;
                                    pictureLocation.tags = sceneResponse.sceneLocations[i].tags;
                                    console.log("pictureLocation: " + JSON.stringify(pictureLocation));
                                    locationPictures.push(pictureLocation);
                                }
                                if (sceneResponse.sceneLocations[i].markerType == "curve point") {
                                    let curvePoint = {};
                                    curvePoint.loc = sceneResponse.sceneLocations[i].x + " " + sceneResponse.sceneLocations[i].y + " " + zFix;
                                    curvePoint.data = sceneResponse.sceneLocations[i].eventData;
                                    curvePoints.push(curvePoint);
                                }
                                if (sceneResponse.sceneLocations[i].markerType == "tunnel") {
                                    let scrollDirection = 'x';
                                    let scrollSpeed = .001;
                                    if (sceneResponse.sceneLocations[i].eventData && sceneResponse.sceneLocations[i].eventData.toLowerCase().includes('scroll y')) {
                                        scrollDirection = 'y';
                                    }
                                    if (sceneResponse.sceneLocations[i].eventData && sceneResponse.sceneLocations[i].eventData.toLowerCase().includes('speed')) {
                                        const speedSplit = sceneResponse.sceneLocations[i].eventData.toLowerCase().split('~');
                                        if (speedSplit.length > 1) {
                                            scrollSpeed = speedSplit[1];
                                        }
                                        
                                    }
                                    proceduralEntities = proceduralEntities + "<a-entity mod_tunnel=\x22init: true; scrollDirection: "+scrollDirection+"; scrollSpeed: "+scrollSpeed+"\x22></a-entity>";
                                }
                                let scale = 1;
                                if (sceneResponse.sceneLocations[i].markerObjScale && sceneResponse.sceneLocations[i].markerObjScale != undefined && sceneResponse.sceneLocations[i].markerObjScale != "" && sceneResponse.sceneLocations[i].markerObjScale != 0) {
                                // if (!parseFloat(sceneResponse.sceneLocations[i].markerObjScale).isNaN()) {    
                                    scale = sceneResponse.sceneLocations[i].markerObjScale;
                                }
                                if (sceneResponse.sceneLocations[i].markerType == "svg canvas fixed") {
                                    sceneTextLocations.push(sceneResponse.sceneLocations[i]);
                                    proceduralEntities = proceduralEntities + " <a-plane loadsvg=\x22description: "+sceneResponse.sceneLocations[i].description+"; eventdata: "+sceneResponse.sceneLocations[i].eventData+"; tags:  "+sceneResponse.sceneLocations[i].locationTags+"\x22 id=\x22svg_"+sceneResponse.sceneLocations[i].timestamp+
                                    "\x22 width=\x22"+scale+"\x22 height=\x22"+scale+"\x22 position=\x22"+sceneResponse.sceneLocations[i].x + " " + sceneResponse.sceneLocations[i].y + " " + zFix+"\x22></a-plane>";
                                }
                                if (sceneResponse.sceneLocations[i].markerType == "svg canvas billboard") {

                                    sceneTextLocations.push(sceneResponse.sceneLocations[i]);
                                    // proceduralEntities = proceduralEntities + " <a-plane loadsvg=\x22description: "+sceneResponse.sceneLocations[i].description+"; eventdata: "+sceneResponse.sceneLocations[i].eventData+"; tags:  "+sceneResponse.sceneLocations[i].locationTags+"\x22 id=\x22svg_"+sceneResponse.sceneLocations[i].timestamp+
                                    // "\x22 look-at=\x22#player\x22 width=\x22"+scale+"\x22 height=\x22"+scale+"\x22 position=\x22"+sceneResponse.sceneLocations[i].x + " " + sceneResponse.sceneLocations[i].y + " " + zFix+"\x22></a-plane>";
                                }
                                if (sceneResponse.sceneLocations[i].markerType == "text") {
                                    sceneTextLocations.push(sceneResponse.sceneLocations[i]);

                                }
                                if (sceneResponse.sceneLocations[i].markerType == "svg fixed") {
                                    sceneTextLocations.push(sceneResponse.sceneLocations[i]);

                                }
                                if (sceneResponse.sceneLocations[i].markerType == "svg billboard") {
                                    sceneTextLocations.push(sceneResponse.sceneLocations[i]);
                                    // proceduralEntities = proceduralEntities + " <a-entity load_threesvg=\x22description: "+sceneResponse.sceneLocations[i].description+"; eventdata: "+sceneResponse.sceneLocations[i].eventData+"; tags:  "+sceneResponse.sceneLocations[i].locationTags+"\x22 id=\x22svg_"+sceneResponse.sceneLocations[i].timestamp+
                                    // "\x22 look-at=\x22#player\x22 width=\x22"+scale+"\x22 height=\x22"+scale+"\x22 position=\x22"+sceneResponse.sceneLocations[i].x + " " + sceneResponse.sceneLocations[i].y + " " + zFix+"\x22></a-entity>";
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
                         

                        
                                            
                            } else { //"sceneWebType == "Default or AFrame"
                                
                               
                               
                                transportButtons = "<div class=\x22transport_buttons\x22>"+

                                "<div class=\x22next_button\x22 style=\x22color: rgba(255, 255, 255, 0.75); float: right; margin: 5px 5px;\x22 onclick=\x22NextButton()\x22><i class=\x22fas fa-step-forward fa-2x\x22></i></div>"+
                                "<div class=\x22ffwd_button\x22 style=\x22color: rgba(255, 255, 255, 0.75); float: right; margin: 5px 5px;\x22 onclick=\x22FastForwardButton()\x22><i class=\x22fas fa-forward fa-2x\x22></i></div>"+
                                "<div class=\x22play_button\x22 id=\x22transportPlayButton\x22 style=\x22color: rgba(255, 255, 255, 0.75); float: right; margin: 5px 5px;\x22 onclick=\x22TransportPlayButton()\x22><i class=\x22fas fa-play-circle fa-2x\x22></i></div>" +
                                "<div class=\x22rewind_button\x22 style=\x22color: rgba(255, 255, 255, 0.75); float: right; margin: 5px 5px;\x22 onclick=\x22RewindButton()\x22><i class=\x22fas fa-backward fa-2x\x22></i></div>"+
                                "<div class=\x22previous_button\x22 style=\x22color: rgba(255, 255, 255, 0.75); float: right; margin: 5px 5px;\x22 onclick=\x22PreviousButton()\x22><i class=\x22fas fa-step-backward fa-2x\x22></i></div>"+
                                "<div id=\x22transportStats\x22 style=\x22color: rgba(255, 255, 255, 0.75); float: right; margin: 5px 5px; text-align: left\x22></div></div>";                                

                                // transportButtonsWithSlider = "<div class=\x22transport_buttons\x22><div class=\x22sslidecontainer\x22><input type=\x22range\x22 min=\x221\x22 max=\x22100\x22 value=\x221\x22 class=\x22sslider\x22 id=\x22mainTransportSlider\x22>"+
                                // "</div><div id=\x22transportStats\x22 style=\x22color: rgba(255, 255, 255, 0.75); float: left; margin: 5px 5px; text-align: left\x22></div>"+
                                // "<div class=\x22next_button\x22 style=\x22color: rgba(255, 255, 255, 0.75); float: right; margin: 5px 5px;\x22 onclick=\x22NextButton()\x22><i class=\x22fas fa-step-forward fa-2x\x22></i></div>"+
                                // "<div class=\x22ffwd_button\x22 style=\x22color: rgba(255, 255, 255, 0.75); float: right; margin: 5px 5px;\x22 onclick=\x22FastForwardButton()\x22><i class=\x22fas fa-forward fa-2x\x22></i></div>"+
                                // "<div class=\x22play_button\x22 id=\x22transportPlayButton\x22 style=\x22color: rgba(255, 255, 255, 0.75); float: right; margin: 5px 5px;\x22 onclick=\x22TransportPlayButton()\x22><i class=\x22fas fa-play-circle fa-2x\x22></i></div>" +
                                // "<div class=\x22rewind_button\x22 style=\x22color: rgba(255, 255, 255, 0.75); float: right; margin: 5px 5px;\x22 onclick=\x22RewindButton()\x22><i class=\x22fas fa-backward fa-2x\x22></i></div>"+
                                // "<div class=\x22previous_button\x22 style=\x22color: rgba(255, 255, 255, 0.75); float: right; margin: 5px 5px;\x22 onclick=\x22PreviousButton()\x22><i class=\x22fas fa-step-backward fa-2x\x22></i></div></div>";
                                
                                dialogButton = "<div class=\x22dialog_button\x22 style=\x22color: rgba(255, 255, 255, 0.75); float: left; margin: 10px 10px;\x22 onclick=\x22SceneManglerModal('Welcome')\x22><i class=\x22fas fa-info-circle fa-2x\x22></i></div>";
                               
                                sceneManglerButtons = "<div class=\x22show-ui-button\x22 onclick=\x22ShowHideUI()\x22><i class=\x22far fa-eye fa-2x\x22></i></div>";
                                if (!sceneResponse.sceneTextUseModals) {
                                   // renderPanel = "<a-entity visible=\x22false\x22 render_canvas id=\x22renderCanvas\x22 look-at=\x22#player\x22 geometry=\x22primitive: plane; width:1; height:1;\x22 scale=\x221 1 1\x22 position=\x220 3.5 -.25\x22 material=\x22shader: html; transparent: true; width:1024; height:1024; fps: 10; target: #renderPanel;\x22></a-entity>\n";
                                }
                               
                                // let follower = "";

                                
                                // } else { // first person cam, default
                                    // let lookcontrols = "look-controls=\x22magicWindowTrackingEnabled: false;\x22";
                                    // if (sceneResponse.sceneTags != null && (sceneResponse.sceneTags.includes('magicwindow') || sceneResponse.sceneTags.includes('magic window'))) {
                                    //     lookcontrols = "look-controls"; // because magicwinders enabled by default
                                    // }
                                    // defaults to first person cam
                                    // camera = "<a-entity id=\x22cameraRig\x22 "+movementControls+" initializer "+
                                
                                    //     " id=\x22mouseCursor\x22 cursor=\x22rayOrigin: mouse\x22 raycaster=\x22objects: .activeObjexRay\x22>"+
                                    //     // "<a-entity id=\x22player\x22 get_pos_rot networked=\x22template:#avatar-template;attachTemplateToLocal:false;\x22 "+spawnInCircle+" camera "+wasd+" look-controls=\x22hmdEnabled: false\x22 position=\x220 1.6 0\x22>" +     
                                    //     // "<a-entity id=\x22viewportPlaceholder\x22 position=\x220 0 -1\x22></entity>"+   
                                    //     "<a-entity id=\x22player\x22 "+lookcontrols+" get_pos_rot camera "+wasd+" "+ physicsMod +" position=\x22"+playerPosition+"\x22>"+
                                    //         "<a-entity id=\x22equipPlaceholder\x22 geometry=\x22primitive: box; height: .1; width: .1; depth: .1;\x22 position=\x220 -.65 -.75\x22"+
                                    //         "material=\x22opacity: 0\x22></a-entity>"+
                                    //         "<a-entity id=\x22viewportPlaceholder\x22 geometry=\x22primitive: plane; height: 0.01; width: .01\x22 position=\x220 0 -1.5\x22"+
                                    //         "material=\x22opacity: 0\x22></a-entity>"+
                                    //         "<a-entity id=\x22viewportPlaceholder3\x22 geometry=\x22primitive: plane; height: 0.01; width: .01\x22 position=\x220 0 -3\x22"+
                                    //         "material=\x22opacity: 0\x22></a-entity>"+
                                    //         // "<a-entity id=\x22viewportPlaceholderFar\x22 visible=\x22false\x22 geometry=\x22primitive: plane; height: 0.01; width: .01\x22 position=\x220 0 -30\x22"+
                                    //         // "material=\x22opacity: 0\x22></a-entity>"+
                                    //     "</a-entity>"+

                                    //     "<a-entity id=\x22left-hand\x22 oculus-touch-controls=\x22hand: left\x22 "+blinkMod+" handModelStyle: lowPoly; color: #ffcccc\x22>"+
                                    //         "<a-console position=\x220 .13 -.36\x22 scale=\x22.33 .33 .33\x22 rotation=\x22-70.7 -1.77\x22></a-console>"+
                                    //     "</a-entity>" +
                                    //     "<a-entity id=\x22right-hand\x22 oculus-touch-controls=\x22hand: right\x22 laser-controls=\x22hand: right;\x22 handModelStyle: lowPoly; color: #ffcccc\x22 raycaster=\x22objects: .activeObjexRay;\x22 grab></a-entity>"+
                                    //     "</a-entity></a-entity>";
                                }
                            // }
                            // let webxrEnv = "default";

                           
                            sceneResponse.scenePostcards = sceneData.scenePostcards;
                            if (sceneResponse.sceneColor1 != null && sceneResponse.sceneColor1.length > 3) {
                                // skySettings = "<a-sky hide-in-ar-mode color='" + sceneResponse.sceneColor1 + "'></a-sky>"; //overwritten below if there's a skybox texture
                                // environment = "<a-entity environment=\x22preset: "+webxrEnv+"; skyColor: " + sceneResponse.sceneColor1 + "; lighting: none; shadow: none; lightPosition: 0 2.15 0\x22 hide-in-ar-mode></a-entity>";
                            } 
                            if (sceneResponse.sceneColor1 != null && sceneResponse.sceneColor1.length > 3 && sceneResponse.sceneColor2 != null && sceneResponse.sceneColor2.length > 3)   {

                            }

                            
                            if (sceneResponse.sceneWater != null) {
                                if (sceneResponse.sceneWater.name == "water2") {
                                    console.log("water: " + JSON.stringify(sceneResponse.sceneWater)); //these use the escaped aframe shaders, not the eval'd non escaped mode
                                    ocean = "<a-plane position=\x220  "+sceneResponse.sceneWater.level+" 0\x22 width=\x22256\x22 height=\x22256\x22 rotation=\x22-90 180 -90\x22 segments-height=\x22100\x22 segments-width=\x22100\x22 "+skyboxEnvMap+" material=\x22color: "+sceneResponse.sceneColor3+"; shader:makewaves; uMap: #water; repeat: 500 500;\x22></a-plane>";
                                    imageAssets = imageAssets + "<img id=\x22water\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/pics/water2c.jpeg\x22 crossorigin=\x22anonymous\x22>";
                                } else if (sceneResponse.sceneWater.name == "water1") {
                                    ocean = "<a-plane position=\x220 "+sceneResponse.sceneWater.level+" 0\x22 width=\x22256\x22 height=\x22256\x22 rotation=\x22-90 180 -90\x22 segments-height=\x2264\x22 segments-width=\x2264\x22 "+skyboxEnvMap+" material=\x22shader:makewaves_small; color: "+sceneResponse.sceneColor4+";uMap: #water2; repeat: 500 500; transparent: true\x22></a-plane>";
                                    imageAssets = imageAssets + "<img id=\x22water2\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/pics/water2.png\x22 crossorigin=\x22anonymous\x22>";
                                }
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
                            lightEntities = lightEntities + "<a-light "+mods+" color=\x22" + color + "\x22 position=\x22"+locationLights[i].loc+"\x22 distance=\x22"+distance+"\x22 intensity='5' type='point'></a-light>";
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
                            locationPlaceholders[i].phID+"; scale: "+locationPlaceholders[i].markerObjScale+"; modelID: "+locationPlaceholders[i].modelID+"; model: "+
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
            
                // function (callback) {
                //     var modelz = [];
                // //    console.log("sceneModels : " + JSON.stringify(sceneResponse.sceneModels));
                //     if (sceneResponse.sceneModels != null) {
                //         async.each (sceneResponse.sceneModels, function (objID, callbackz) { //nested async-ery!
                //             var oo_id = ObjectID(objID);
                //             // console.log("13904 tryna get sceneObject: " + objID);
                //             db.models.findOne({"_id": oo_id}, function (err, model) {
                //                 if (err || !model) {
                //                     console.log("error getting model: " + objID); //todo - report? 
                //                     callbackz();
                //                 } else {
                //                     // console.log("got user model:" + model._id);
                //                     if (minioClient) {

                //                         minioClient.presignedGetObject(process.env.ROOT_BUCKET_NAME, 'users/' + model.userID + "/gltf/" + model.filename, 6000, function(err, presignedUrl) { //use callback version here, can't await?
                //                             if (err) {
                //                                 console.log(err);
                //                                 callbackz(err);
                //                             } else {
                //                                 model.url = presignedUrl;
                //                                 modelz.push(model);
                //                                 callbackz();
                //                             }
                //                         });    
                //                     } else { 
                //                         let url = s3.getSignedUrl('getObject', {Bucket: process.env.ROOT_BUCKET_NAME, Key: 'users/' + model.userID + "/gltf/" + model.filename, Expires: 6000});
                //                         model.url = url;
                //                         modelz.push(model);
                //                         callbackz();
                //                     }
                //                 }
                //             });
                //         }, function(err) {
                           
                //             if (err) {
                                
                //                 console.log('A file failed to process');
                //                 callback(null);
                //             } else {
                //                 console.log('modelz have been added to scene');
                //                 // objectResponse = modelz;
                //                 // sceneResponse.sceneModelz = objectResponse;
                //                 var buff = Buffer.from(JSON.stringify(modelz)).toString("base64");
                //                 modelData = "<div id=\x22sceneModels\x22 data-models='"+buff+"'></div>";
                //                 callback(null);
                //             }
                //         });
                //     } else {
                //         callback(null);
                //     }
                // }, 
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
                            let availableScene = {};
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

                                        // var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + halfName, Expires: 6000}); //just send back thumbnail urls for list
                                        // var urlQuarter = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + quarterName, Expires: 6000}); //just send back thumbnail urls for list
                                        (async () => {
                                            var urlHalf = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + halfName, 6000); //just send back thumbnail urls for list
                                            var urlQuarter = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + quarterName, 6000); //just send back thumbnail urls for list
                                            
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
                                        })();
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

         
                                    if (scenesKeyLocation && availableScenes != null && availableScenes != undefined && availableScenes.length > 0) {
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

                                    modelAssets = modelAssets + "<a-asset-item id=\x22widelandscape_panel\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/panel5b.glb\x22></a-asset-item>\n";
                                    
                                    loadAvailableScenes = "ready(function(){\n" + //TODO base64 this stuff like the others...very
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
                            if (ObjectID.isValid(sceneResponse.sceneWebLinks[i])) {
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
                                    (async () => {

                                        var urlStandard = await ReturnPresignedUrl(process.env.WEBSCRAPE_BUCKET_NAME, weblink._id +"/"+ weblink._id + ".standard.jpg", 6000);

                                        weblinkAssets = weblinkAssets + "<img id=\x22wlimage" + index + "\x22 crossorigin=\x22anonymous\x22 src='" + urlStandard + "'>";
                                        let link = "basic-link=\x22href: "+weblink.link_url+";\x22 class=\x22activeObjexGrab activeObjexRay\x22";
                                        let caption = "<a-troika-text class=\x22pCap\x22 align=\x22center\x22 rotation=\x220 0 0\x22 font=\x22../fonts/web/Acme.woff\x22 outlineWidth=\x222%\x22 outlineColor=\x22black\x22  fontSize=\x221\x22 anchor=\x22top\x22 maxWidth=\x2210\x22 position=\x220 1.1 .1\x22 wrapCount=\x2240\x22 value=\x22"+weblink.link_title+"\x22></a-troika-text>";
                                        weblinkEntities = weblinkEntities + "<a-entity "+link+" position=\x22"+position+"\x22 weblink-materials=\x22index:"+index+"\x22 look-at=\x22#player\x22 gltf-model=\x22#flatsquare\x22 scale=\x22"+scale+"\x22 material=\x22shader: flat; src: #wlimage" + index + "; alphaTest: 0.5;\x22"+
                                        " visible='true'>"+caption+"</a-entity>";   
                                    })();
                                    }
                                });
                            }
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
                                        function (cb) { //sprite sheets for object particle systems
                                            if (objekt.particles != undefined && objekt.particles != null && objekt.particles != "None" ) {
                                                if (objekt.particles.toString().includes("Fire")) {
                                                    imageAssets = imageAssets + "<img id=\x22fireanim1\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/pics/fireanim3.png\x22 crossorigin=\x22anonymous\x22></img>";
                                                }
                                                if (objekt.particles.toString().includes("Candle")) {
                                                    imageAssets = imageAssets + "<img id=\x22candle1\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/pics/candle_flame_8x8.png\x22 crossorigin=\x22anonymous\x22></img>";
                                                }
                                                if (objekt.particles.toString().includes("Smoke")) {
                                                    imageAssets = imageAssets + "<img id=\x22smoke1\x22 src=\x22http://servicemedia.s3.amazonaws.com/assets/pics/smokeanim2.png\x22 crossorigin=\x22anonymous\x22>";
                                                }
                                            }
                                            cb(null);
                                        },
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
                                                    const assetUserID = asset.userID;
                                                    // var sourcePath =   "servicemedia/users/" + assetUserID + "/gltf/" + locMdl.gltf; //this should be "model" or "filename"
                                                    (async () => {
                                                        // let modelURL = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + assetUserID + "/gltf/" + asset.filename, Expires: 6000});
                                                        let modelURL = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, 'users/' + assetUserID + "/gltf/" + asset.filename, 6000);
                                                        objekt.modelURL = modelURL;
                                                        gltfsAssets = gltfsAssets + "<a-asset-item id=\x22" + objekt.modelID + "\x22 src=\x22"+ modelURL +"\x22></a-asset-item>";
                                                        objex.push(objekt);     
                                                        cb(null);
                                                    })();
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
                                    let assetUserID = asset.userID;
                                    // var sourcePath =   "servicemedia/users/" + assetUserID + "/gltf/" + locMdl.gltf; //this should be "model" or "filename"
                                    (async () => {
                                        // let modelURL = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + asset.userID + "/gltf/" + asset.filename, Expires: 6000});
                                        let modelURL = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, 'users/' + assetUserID + "/gltf/" + asset.filename, 6000);
                                        gltfsAssets = gltfsAssets + "<a-asset-item class=\x22gltfAssets\x22 crossorigin=\x22anonymous\x22 response-type=\x22arraybuffer\x22 id=\x22" + actionModel.modelID + "\x22 src=\x22"+ modelURL +"\x22></a-asset-item>";
                                        // objex.push(objekt);     
                                        console.log("adding actionModel :" + actionModel.modelName);
                                        callbackz(null);
                                    })();
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

                            //filter out cloudmarker types
                            // console.log(sceneResponse.sceneModels.indexOf(locMdl.modelID) + " index locMdl deets " + JSON.stringify(locMdl));
                            if (locMdl.modelID != undefined && locMdl.modelID != "none" && locMdl.markerType != "placeholder"
                                && locMdl.markerType != "poi"                                
                                && locMdl.markerType != "trigger"
                                && locMdl.markerType != "spawntrigger"
                                && locMdl.markerType != "gate"
                                && locMdl.markerType != "mailbox"
                                && locMdl.markerType != "portal" 
                                && sceneResponse.sceneModels.indexOf(locMdl.modelID) != -1) {

                                // console.log("tryna set model id:  " + JSON.stringify(locMdl));
                                console.log("gots a mod_model : " + locMdl.name);
                                const m_id = ObjectID(locMdl.modelID);
                                // 
                                db.models.findOne({"_id": m_id}, function (err, asset) { 
                                if (err || !asset) { 
                                    callbackz(err);
                                } else {

                                (async () => {
                                if (asset.item_type == "glb") {

                                    assetUserID = asset.userID;
                                    let modelURL = "";
                                    // var sourcePath =   "servicemedia/users/" + assetUserID + "/gltf/" + locMdl.gltf; //this should be "model" or "filename"
                                    // (async () => {
                                    // modelURL = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + assetUserID + "/gltf/" + asset.filename, Expires: 6000});
                                        modelURL = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, 'users/' + assetUserID + "/gltf/" + asset.filename, 6000);
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
                                    if (locMdl.markerType == "follow curve" || (locMdl.eventData != null && locMdl.eventData != undefined && locMdl.eventData.length > 1 && locMdl.eventData.toLowerCase().includes("follow curve")))  {
                                        // followCurve = "follow-path=\x22incrementBy:0.001; throttleTo:1\x22";
                                        followCurve = "mod_curve=\x22init: true\x22";  //hrm, add a bunch of params here...
                                        if (locMdl.markerType == "picture group") {

                                        }
                                        //TODO use scene image with proper type/tag 
                                        imageAssets = imageAssets + "<img id=\x22explosion1\x22 src=\x22http://servicemedia.s3.amazonaws.com/assets/pics/explosion1.png\x22 crossorigin=\x22anonymous\x22>";
                                    }
                                    if (locMdl.markerType == "follow random path") {
                                        // followCurve = "follow-path=\x22incrementBy:0.001; throttleTo:1\x22";
                                        followCurve = "mod_random_path=\x22init: true\x22"  //hrm, add a bunch of params here...
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
                                    if (locMdl.type.toLowerCase() == "geographic" && locMdl.latitude != null && locMdl.longitude != null && locMdl.latitude != 0 && locMdl.longitude != 0) { 
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
                                            // gltfsAssets = gltfsAssets + "var lookCtrl = null;\nBABYLON.SceneLoader.ImportMesh('', '', \x22"+modelURL+"\x22, scene, function (meshes, particleSystems, skeletons) {"+
                                            // "meshes[0].scaling = new BABYLON.Vector3("+scale+", "+scale+", "+scale+");\n"+
                                            // "meshes[0].position = new BABYLON.Vector3("+locMdl.x+", "+locMdl.y+", "+locMdl.z+");\n"+
                                            // "meshes[0].rotation = new BABYLON.Vector3("+rx+", "+ry+", "+rz+");\n"+
                                           
                                            // "for (var m = 0; m < meshes.length; m++){\n"+ //find mesh named eye
                                            //     "console.log(meshes[m].material);\n"+
                                            //     // "meshes[m].material.environmentTexture = new BABYLON.CubeTexture('', scene, undefined, undefined, "+JSON.stringify( cubeMapAsset)+");" +
                                            //     "if (meshes[m].name.includes(\x22eyeball\x22)) {"+
                                                   
                                            //         "console.log(meshes[m].name);"+
                                            //         "let characterMesh = meshes[m];"+
                                            //         "for (var b = 0; b < skeletons[0].bones.length - 1; b++){\n"+ //then find bone named eye //NM, pointless - can't use bone with gltf :(
                                                       
                                            //             "if (skeletons[0].bones[b].name == \x22Eye\x22) {\n"+
                                            //                 // "skeletons[0].bones.lookAt(mainCam.position);"+
                                            //                 "console.log(skeletons[0].bones[b].name);\n"+
                                            //                 "scene.beginAnimation(skeletons[0], 0, 100, true, 1.0);\n"+
                                            //                 // "let lookCtrl = new BABYLON.BoneLookController(meshes[0], skeletons[0].bones[b], mainCam.position, {adjustYaw:Math.PI*.5, adjustPitch:Math.PI*.5, adjustRoll:Math.PI});\n"+
                                            //                 "var skeleton = skeletons[0];\n"+
                                            //                 "var time = 0;\n"+
                                            //                 "var state = 'Initial';\n"+
                                            //                 "var lastAppliedQuat = new BABYLON.Quaternion();\n"+
                                            //                 "var stateTime = 0;\n"+
                                            //                 "var timingFunc = (x) => Math.cos(x * Math.PI) * -0.5 + 0.5;\n"+
                                            //                 // var cubeTex = new BABYLON.CubeTexture("", scene, );
                                            //                 "scene.registerBeforeRender(function(){\n" +
                                                            
                                            //                "});\n"+
                                                            
                                            //             "}\n"+
                                            //         "}\n"+
                                            //         //  "lookCtrl = new BABYLON.BoneLookController(characterMesh, skeletons[0].bones[m], mainCam.position, {adjustYaw:Math.PI*.5, adjustPitch:Math.PI*.5, adjustRoll:Math.PI});\n"+
                                            //     "}\n"+
                                            // "}\n"+

                                            // "});\n";
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
                                                let modModel = "mod_model=\x22markerType: "+locMdl.markerType+"; tags: "+locMdl.locationTags+"; description:"+locMdl.description+"; eventData:"+locMdl.eventData+";\x22";
                                                // let modMaterial = "";
                                                if (locMdl.eventData.toLowerCase().includes("gallery")) {
                                                    // modModel = "mod_model_photo_gallery";  maybe later
                                                }
                                                if (!locMdl.eventData.toLowerCase().includes("scatter")) { //not scatterd, normal placement
                                                    let physicsMod = "";
                                                    let shape = 'hull';
                                                    if (locMdl.eventData.toLowerCase().includes('physics')){ //ammo for now // no do it in mod_model (where model isloaded)
                                                    // let isTrigger = false;
                                                    
                                                        if (locMdl.eventData.toLowerCase().includes('static')){
                                                            // physicsMod = "ammo-body=\x22type: static\x22 ammo-shape=\x22type: box\x22";
                                                            // physicsMod = "ammo-body=\x22type: static\x22 ammo-shape=\x22type: box\x22";
                                                            // physicsMod = "mod_physics=\x22body: static; shape: box; model: "+locMdl.name+"\x22"
                                                        }
                                                        if (locMdl.eventData.toLowerCase().includes('dynamic')){
                                                            // physicsMod = "ammo-body=\x22type: static\x22 ammo-shape=\x22type: box\x22";
                                                            // physicsMod = "ammo-body=\x22type: static\x22 ammo-shape=\x22type: box\x22";
                                                            // physicsMod = "mod_physics=\x22body: dynamic; shape: box; model: "+locMdl.name+"\x22"
                                                            
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
                                                    if (locMdl.markerType == "brownian path" || locMdl.markerType == "brownian motion") {
                                                        if (locMdl.markerType == "brownian path") {

                                                            brownian = "brownian_path=\x22lineEnd:100000;lineStep:100;count:100;object:#thing-to-clone;positionVariance:88 33 86;spaceVectorOffset:101.1,100,100.2,101.2,100,100.3;rotationFollowsAxis:x;speed:0.01;\x22";
                                                            gltfsEntities = gltfsEntities + "<a-gltf-model shadow src=\x22#"+m_assetID+"\x22 id=\x22thing-to-clone\x22 visible=\x22true\x22></a-gltf-model>"+
                                                            "<a-entity "+brownian+
                                                            " shadow=\x22cast:true; receive:true\x22 "+skyboxEnvMap+" position=\x22"+locMdl.x+" "+locMdl.y+" "+zFix+"\x22 scale=\x22"+scale+
                                                            " "+scale+" "+scale+"\x22 data-scale=\x22"+scale+"\x22 rotation=\x22"+rotation+"\x22 >" + offsetPos+ "</a-entity>";
                                                        } else if (locMdl.markerType == "brownian motion") {
                                                            brownian = "brownian-motion=\x22speed:0.1;rotationVariance:.2 .2 .2;positionVariance:2.5 5 2.5;spaceVector:10.1,20.1,30.1,10.1,20.1,30.1;\x22";
                                                            gltfsEntities = gltfsEntities + "<a-entity id=\x22"+id+"\x22 "+brownian+" "+followCurve+" "+physicsMod+" "+modelParent+" "+scatterSurface+" "+modModel+" class=\x22envMap gltf "+entityType+" "+ambientChild+
                                                            " activeObjexGrab activeObjexRay\x22 shadow=\x22cast:true; receive:true\x22 "+skyboxEnvMap+" gltf-model=\x22#" + m_assetID + "\x22 "+objAnim+" "+cannedAnim+
                                                            // " position=\x22"+locMdl.x+" "+locMdl.y+" "+zFix+"\x22 scale=\x22"+scale+" "+scale+" "+scale+"\x22 rotation=\x22"+rotation+"\x22 >" + offsetPos+ "</a-entity>";  //rem rotation bc navmesh donutlike
                                                            " position=\x22"+locMdl.x+" "+locMdl.y+" "+zFix+"\x22 scale=\x22"+scale+" "+scale+" "+scale+"\x22 data-scale=\x22"+scale+"\x22 rotation=\x22"+rotation+"\x22 >" + offsetPos+ "</a-entity>"; 
                                                            gltfModel = modelURL;
                                                        }
                                                        
                                                    } else { //don't use brownian
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
                                                        // instancing = "instanced-mesh=\x22capacity:100; updateMode: auto;\x22 instanced_meshes_sphere_physics=\x22_id: "+locMdl.modelID+"; modelID: "+m_assetID+"; "+interaction+" tags: "+locMdl.locationTags+"\x22"; //scatter random sphere, e.g. in the sky..
                                                        // console.log("instancing is " + instancing);
                                                        // instancingEntity = "<a-sphere id=\x22ball-mesh\x22 radius=\x221\x22 color=\x22yellow\x22 instanced-mesh=\x22capacity: 100; updateMode: auto\x22></a-sphere>" +
                                                        // "<a-entity id=\x22ball-recycler\x22 ball-recycler=\x22physics: ammo; ballCount: 10; width: 30; depth: 15; yKill: -30\x22 position=\x220 20 -25\x22></a-entity>";
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
                                                                // instancing = "instanced-mesh=\x22capacity:100; updateMode: auto;\x22 instanced_meshes_sphere=\x22_id: "+locMdl.modelID+"; modelID: "+m_assetID+"; tags: "+locMdl.locationTags+" count: "+split[1]+"; scaleFactor: "+scale+";"+interaction+"\x22"; //scatter everywhere, e.g. in the sky..
                                                                // console.log("instancing is " + instancing);
                                                                // instancing = " instanced-mesh=\x22capacity:100; updateMode: 'auto'; positioning: 'world'\x22 "; //scatter everywhere, e.g. in the sky..
                                                                instancingEntity = instancingEntity + "<a-entity instanced_meshes_sphere=\x22_id: "+locMdl.modelID+"; modelID: "+m_assetID+"; "+interaction+" tags: "+locMdl.locationTags+"\x22></a-entity>";
                                                            }
                                                            if (locMdl.eventData.toLowerCase().includes("physics")) {
                                                                // instancing = "instanced-mesh=\x22capacity:100; updateMode: auto;\x22 instanced_meshes_sphere=\x22_id: "+locMdl.modelID+"; modelID: "+m_assetID+"; tags: "+locMdl.locationTags+" count: "+split[1]+"; scaleFactor: "+scale+";"+interaction+"\x22"; //scatter everywhere, e.g. in the sky..
                                                                // console.log("instancing is " + instancing);
                                                                // instancing = " instanced-mesh=\x22capacity:100; updateMode: 'auto'; positioning: 'world'\x22 "; //scatter everywhere, e.g. in the sky..
                                                                instancingEntity = instancingEntity + "<a-entity scatter_physics=\x22_id: "+locMdl.modelID+"; count: "+split[1]+"; scaleFactor: "+scale+"; modelID: "+m_assetID+"; "+interaction+" tags: "+locMdl.locationTags+"\x22></a-entity>";
                                                            }
                                                            if (locMdl.eventData.toLowerCase().includes("instances")) {
                                                                //TODO use model primatives
                                                                instancingEntity = instancingEntity + "<a-sphere id=\x22i-mesh-sphere\x22 "+skyboxEnvMap+" radius=\x221\x22 material=\x22roughness: .2; color: blue; opacity: .5; transparent: true;\x22 instanced-mesh=\x22capacity: "+split[1]+"; updateMode: auto\x22></a-sphere>" +
                                                                "<a-entity instanced_meshes_sphere_physics=\x22_id: "+locMdl.modelID+"; count: "+split[1]+"; modelID: "+m_assetID+"; "+interaction+" tags: "+locMdl.locationTags+"\x22></a-entity>";
                                                            }
                                                            if (locMdl.eventData.toLowerCase().includes("atomic")) {
                                                                //TODO use model primatives
                                                                instancingEntity = instancingEntity + "<a-sphere id=\x22i-mesh-sphere\x22 "+skyboxEnvMap+" radius=\x221\x22 material=\x22roughness: .2; color: blue; opacity: .5; transparent: true;\x22 instanced-mesh=\x22capacity: "+split[1]+"; updateMode: auto\x22></a-sphere>" +
                                                                "<a-entity instanced_meshes_sphere_physics=\x22_id: "+locMdl.modelID+"; count: "+split[1]+"; modelID: "+m_assetID+"; "+interaction+" tags: "+locMdl.locationTags+"\x22></a-entity>";
                                                            }
                                                        }
                                                    }
                                                    let modelString = "gltf-model=\x22#" + m_assetID + "\x22";
                                                    //todo, check for scene image with spritesheet type / tag
                                                    imageAssets = imageAssets + "<img id=\x22explosion1\x22 src=\x22http://servicemedia.s3.amazonaws.com/assets/pics/explosion1.png\x22 crossorigin=\x22anonymous\x22>"; //for particles
                                                    
                                                    gltfsEntities = gltfsEntities + "<a-entity id=\x22"+id+"\x22 "+modelString+" "+instancing+" class=\x22"+entityType+
                                                    " activeObjexGrab activeObjexRay\x22 shadow=\x22cast:true; receive:true\x22 "+skyboxEnvMap+
                                                    " position=\x220 -20 0\x22></a-entity>";//scatter model below //nm, just load it from here w/ modelString
                                                        // " <a-entity id=\x22"+locMdl.modelID+"\x22 "+modelParent+" "+modModel+" class=\x22gltf "+entityType+ 
                                                        // " activeObjexGrab activeObjexRay\x22 shadow=\x22cast:true; receive:true\x22 "+skyboxEnvMap+" "+modelString+" "+objAnim+" "+cannedAnim+
                                                        // // " activeObjexGrab activeObjexRay\x22 shadow=\x22cast:true; receive:true\x22 "+skyboxEnvMap+" gltf-model=\x22#" + m_assetID + "\x22 "+objAnim+" "+cannedAnim+
                                                        // " position=\x220 -10 0\x22></a-entity>"; 

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
                                        // let modelURL = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + assetUserID + "/" + asset.item_type + "/" + asset.filename, Expires: 6000});
                                        let modelURL = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, 'users/' + assetUserID + "/gltf/" + asset.filename, 6000);
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
                                })(); //end (async
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
                               
                            }
                        }); 
                    } else {
                        nextLink = "href=\x22#\x22";    
                        
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

                        if (!textLocation.length > 0) {textLocation = "-10 1 -5";}
                        // console.log("tryna get sceneText!");
                        let mainText = sceneResponse.sceneText.replace(/([\"]+)/gi, '\'');
                        mainText = mainText.replace(/([\;]+)/gi, '\:');

                        let maintext64 = Buffer.from(JSON.stringify(sceneResponse.sceneText)).toString("base64");
                        // let maintext64 = cleanbase64(sceneResponse.sceneText);
                        // let maintext64 = "<div id=\x22restrictToLocation\x22 data-location='"+buff+"'></div>";
                        // mainText = sceneResponse.sceneText;
                        textEntities = textEntities + "<a-entity look-at=\x22#player\x22 scale=\x22.25 .25 .25\x22 position=\x22"+textLocation+"\x22>"+
                                "<a-entity "+skyboxEnvMap+" id=\x22mainTextToggle\x22 class=\x22envMap activeObjexRay\x22 position=\x220 -1 .5\x22 toggle-main-text  gltf-model=\x22#exclamation\x22></a-entity>"+
                                "<a-entity id=\x22mainTextPanel\x22 visible='false' position=\x220 0 0\x22>" +
                                // "<a-entity id=\x22mainTextHeader\x22 visible='false' geometry=\x22primitive: plane; width: 4; height: 1\x22 position=\x220 7.25 0\x22 material=\x22color: grey; transparent: true; opacity: 0.0\x22" +
                                // "text=\x22value:; wrap-count: 40;\x22></a-entity>" +
                                "<a-entity id=\x22mainTextHeader\x22 visible='false' position=\x225 9.75 0\x22></a-entity>" +
                                
                                // "<a-entity id=\x22mainText\x22 main-text-control=\x22mainTextString: "+mainText.replace(/([^a-z0-9\,\?\'\-\_\.\!\*\&\$\n\~]+)/gi, ' ')+"; mode: "+sceneResponse.scenePrimaryTextMode+"\x22 geometry=\x22primitive: plane; width: 4.5; height: 6\x22 position=\x220 6.75 0\x22 material=\x22color: grey; transparent: true; opacity: 0.0\x22" +
                                // "<a-entity id=\x22mainText\x22 data-maintext=\x22"+maintext64+"\x22 main-text-control=\x22mainTextString: "+mainText.replace(/([^a-z0-9\,\(\)\?\'\-\_\.\!\*\&\$\n\~]+)/gi, ' ')+"; mode: "+sceneResponse.scenePrimaryTextMode+"\x22 geometry=\x22primitive: plane; width: 4.5; height: 6\x22 position=\x220 6.75 0\x22 material=\x22color: grey; transparent: true; opacity: 0.0\x22" +
                                // "<a-entity id=\x22mainText\x22 data-maintext='"+maintext64+"' main-text-control=\x22mainTextString: ; mode: "+sceneResponse.scenePrimaryTextMode+"\x22 geometry=\x22primitive: plane; width: 4.5; height: 6\x22 position=\x220 6.75 0\x22 material=\x22color: grey; transparent: true; opacity: 0.0\x22" +
                                "<a-entity id=\x22mainText\x22 data-maintext='"+maintext64+"' main-text-control=\x22font: "+sceneResponse.sceneFontWeb1+"; mainTextString: ; mode: "+sceneResponse.scenePrimaryTextMode+"\x22 position=\x22-5 9.25 0\x22></a-entity>" +

                                // "<a-entity id=\x22mainText\x22 main-text-control=\x22mainTextString: "+mainText+"; mode: "+sceneResponse.scenePrimaryTextMode+"\x22 geometry=\x22primitive: plane; width: 4.5; height: 6\x22 position=\x220 6.75 0\x22 material=\x22color: grey; transparent: true; opacity: 0.0\x22" +
                                // "text=\x22value:; wrap-count: 30;\x22>" +
                                // "text=\x22value:"+sceneResponse.sceneText+"; wrap-count: 25;\x22>" +
                                "<a-entity visible='false' class=\x22envMap activeObjexRay\x22 id=\x22nextMainText\x22 gltf-model=\x22#next_button\x22 scale=\x22.5 .5 .5\x22 position=\x223 -1 2\x22></a-entity>" +
                                "<a-entity visible='false' class=\x22envMap activeObjexRay\x22 id=\x22previousMainText\x22 gltf-model=\x22#previous_button\x22 scale=\x22.5 .5 .5\x22 position=\x22-3 -1 2\x22></a-entity>" +
                                "<a-entity gltf-model=\x22#square_panel\x22 scale=\x226 6 6\x22 position=\x220 5 -.5\x22></a-entity>" +
                            "</a-entity></a-entity></a-entity>";
                        callback();
                    } else {
                        callback();
                    }
                },

                function (callback) { 
                    //hrm, get a list of text locations and spin through these...
                    if (sceneResponse.sceneTextItems != null && sceneResponse.sceneTextItems != undefined && sceneResponse.sceneTextItems != "") {


                        if (sceneResponse.sceneWebType != "HTML from Text Item") { //if it's not just a regular html page
                            for (let i = 0; i < sceneTextLocations.length; i++) {  //TODO ASYNC

                            console.log("cheking sceneLocation " + JSON.stringify(sceneTextLocations[i]));
                            // sceneTextItemData = "<div id=\x22sceneTextItems\x22 data-attribute=\x22"+sceneResponse.sceneTextItems+"\x22></div>"; 
                            // dialogButton = "<div class=\x22dialog_button\x22 style=\x22float: left; margin: 10px 10px;\x22 onclick=\x22SceneManglerModal('Welcome')\x22><i class=\x22fas fa-info-circle fa-2x\x22></i></div>";
                            
                            //hrm...dunno....
                                // if (!sceneResponse.sceneTextUseModals) {
                                //     //renderPanel = "<a-entity visible=\x22false\x22 render_canvas id=\x22renderCanvas\x22 look-at=\x22#player\x22 geometry=\x22primitive: plane; width:1; height:1;\x22 scale=\x221 1 1\x22 position=\x220 3.5 -.25\x22 material=\x22shader: html; transparent: true; width:1024; height:1024; fps: 10; target: #renderPanel;\x22></a-entity>\n";
                                //     renderPanel = "<a-entity use-textitem-modals></a-entity>\n";
                                // } else {
                                //     renderPanel = "<a-entity use-textitem-modals></a-entity>\n";
                                // }
                            
                            let textID = sceneTextLocations[i].description; //check desc for id, if not then event data
                            if (!textID || textID.length < 5) {
                                textID = sceneTextLocations[i].eventData;
                            }
                            console.log("tryna get svg " + textID);
                            if (textID && textID.length > 5) { 
                                if (sceneTextLocations[i].markerType == "svg canvas billboard") {
                                   
                                    let oid = ObjectID(textID);
                                    db.text_items.findOne({_id: oid}, function (err, text_item){
                                        if (err || !text_item) {
                                            console.log("error getting text_items: " + err);
                                            sceneTextItemData = "no data found";
                                            // callback(null);
                                        } else {
                                            //  = text_item;
    
                                            if (text_item.type == "SVG Document") {
                                                // console.log("gots svgItem : " + JSON.stringify(text_item));
                                                let scale = 1;
                                                if (sceneTextLocations[i].markerObjScale && sceneTextLocations[i].markerObjScale != "" && sceneTextLocations[i].markerObjScale != 0) {
                                                    scale = sceneTextLocations[i].markerObjScale;
                                                }
                    
                                                sceneTextItemData = sceneTextItemData + "<canvas class=\x22canvasItem\x22 id=\x22svg_canvas_"+textID+"\x22 style=\x22text-align:center;\x22 width=\x221024\x22 height=\x221024\x22></canvas>"+
                                                "<div style=\x22visibility: hidden\x22 class=\x22svgItem\x22 id=\x22svg_item_"+textID+"\x22 data-attribute=\x22"+text_item._id+"\x22>"+text_item.textstring+"</div>"; //text string is an svg
                                                proceduralEntities = proceduralEntities + " <a-plane loadsvg=\x22id:"+textID+"; description: "+sceneTextLocations[i].description+"; eventdata: "+sceneTextLocations[i].eventData+"; tags:  "+sceneTextLocations[i].locationTags+"\x22 id=\x22svg_"+sceneTextLocations[i].timestamp+
                                                "\x22 look-at=\x22#player\x22 width=\x22"+scale+"\x22 height=\x22"+scale+"\x22 position=\x22"+sceneTextLocations[i].x + " " + sceneTextLocations[i].y + " " + sceneTextLocations[i].z+"\x22></a-plane>";
                                            }

                                            }
                                        });
                                    // }
                                } else if (sceneTextLocations[i].markerType == "svg billboard") {
                                   console.log("tryna get svg billboard " + textID);
                                    if (validator.isMongoId(textID)) {
                                    let oid = ObjectID(textID);
                                    db.text_items.findOne({_id: oid}, function (err, text_item){
                                        if (err || !text_item) {
                                            console.log("error getting text_items: " + err);
                                            sceneTextItemData = "no data found";
                                            // callback(null);
                                        } else {
                                            //  = text_item;
    
                                            if (text_item.type == "SVG Document") {
                                                // console.log("gots svgItem : " + JSON.stringify(text_item));
                                                let scale = 1;
                                                if (sceneTextLocations[i].markerObjScale && sceneTextLocations[i].markerObjScale != "" && sceneTextLocations[i].markerObjScale != 0) {
                                                    scale = sceneTextLocations[i].markerObjScale;
                                                }
                                                // sceneTextItemData = sceneTextItemData + "<div style=\x22visibility: hidden\x22 class=\x22svgItem\x22 id=\x22svg_item_"+textID+"\x22 data-attribute=\x22"+text_item._id+"\x22>"+text_item.textstring+"</div>";
                                                proceduralEntities = proceduralEntities + " <a-entity load_threesvg=\x22id:"+textID+"; description: "+sceneTextLocations[i].description+"; eventdata: "+sceneTextLocations[i].eventData+"; tags:  "+sceneTextLocations[i].locationTags+"\x22 id=\x22svg_"+sceneTextLocations[i].timestamp+
                                                "\x22 look-at=\x22#player\x22 width=\x22"+scale+"\x22 height=\x22"+scale+"\x22 position=\x22"+sceneTextLocations[i].x + " " + sceneTextLocations[i].y + " " + sceneTextLocations[i].z+"\x22></a-entity>";
                                            }

                                            }
                                        });
                                    } 
                                } 
                            }
                        } 
                        callback();
                       
                        } else { //if it's an html...
                            // if (sceneResponse.sceneTextItems != null && sceneResponse.sceneTextItems != undefined && sceneResponse.sceneTextItems.length > 0) {
                                console.log("Tryna fetch scenetextitgme " + sceneResponse.sceneTextItems);
                                let oid = ObjectID(sceneResponse.sceneTextItems.toString());
                            db.text_items.findOne({_id: oid}, function (err, text_item){
                                if (err || !text_item) {
                                    console.log("error getting text_items: " + err);
                                    sceneTextItemData = "no data found";
                                    callback(null);
                                } else {
                                    sceneTextItemData = text_item.textstring; // html with the trimmings...
                                    // console.log("full on html: " + sceneTextItemData);
                                    // htmltext = sceneTextItemData;
                                    callback(null)
                                }
                            });
                        }
                        // }
                    } else { //no text items 
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
                    (async () => {
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
                                // mp3url = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + mp3Name, Expires: 6000});
                                // oggurl = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + oggName, Expires: 6000});
                                // pngurl = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + pngName, Expires: 6000});

                                mp3url = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, 'users/' + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + mp3Name, 6000);
                                oggurl = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, 'users/' + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + oggName, 6000);
                                pngurl = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, 'users/' + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + pngName, 6000);
                                console.log("primary audio url is " + mp3url);
                                primaryAudioWaveform = pngurl;
                                pAudioWaveform = "<img id=\x22primaryAudioWaveform\x22 crossorigin=\x22anonymous\x22 src=\x22"+primaryAudioWaveform+"\x22>";
                            }
                            if (sceneResponse.sceneAmbientAudioID != undefined && audio_items[i]._id == sceneResponse.sceneAmbientAudioID) {

                                // ambientOggUrl = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + oggName, Expires: 6000});
                                // ambientMp3Url = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + mp3Name, Expires: 6000});
                                ambientOggUrl = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, 'users/' + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + oggName, 6000);
                                ambientMp3Url = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, 'users/' + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + mp3Name, 6000);
                            }                        
                            if (sceneResponse.sceneTriggerAudioID != undefined && audio_items[i]._id == sceneResponse.sceneTriggerAudioID) {
                                // triggerOggUrl = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + oggName, Expires: 6000});
                                // triggerMp3Url = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + mp3Name, Expires: 6000});
                                triggerOggUrl = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, 'users/' + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + oggName, 6000);
                                triggerMp3Url = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, 'users/' + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + mp3Name, 6000);
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
                    })();//async end
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
                            if (mp3url.length > 8) {
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
                                modelAssets = modelAssets + "<a-asset-item id=\x22backpanel_horiz1\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/backpanel_horiz1.glb\x22></a-asset-item>\n";
                                // "<a-entity gltf-model=\x22#play_button\x22 scale=\x22.15 .1 .1\x22 position=\x220 0 -.2\x22 material=\x22color: black; transparent: true; opacity: 0.1\x22></a-entity>" +
                                if (sceneResponse.scenePrimaryAudioTriggerEvents) {
                                    var buff = Buffer.from(JSON.stringify(primaryAudioObject)).toString("base64");
                                    loadAudioEvents = "<a-entity primary_audio_events id=\x22audioEventsData\x22 data-audio-events='"+buff+"'></a-entity>"; 
                                }
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
                        "<a-entity id=\x22primaryAudioText\x22 geometry=\x22primitive: plane; width: 1; height: .5\x22 position=\x220 .5 2.5\x22 material=\x22color: grey; transparent: true; opacity: 0.0\x22"+
                        "text=\x22value:Click to play;\x22></a-entity>"+
                        "<a-entity gltf-model=\x22#landscape_panel\x22 scale=\x220.075 0.05 0.05\x22 position=\x220 .5 2.4\x22 material=\x22color: black; transparent: true; opacity: 0.1\x22></a-entity>" +
                        "<a-entity id=\x22primaryAudio\x22 mixin=\x22grabmix\x22 class=\x22activeObjexGrab activeObjexRay\x22 entity-callout=\x22calloutString: 'play/pause'\x22 primary_audio_control=\x22oggurl: "+oggurl+"; mp3url: "+mp3url+"; volume: "+scenePrimaryVolume+"; autoplay: "+sceneResponse.sceneAutoplayPrimaryAudio+";"+
                        "title: "+primaryAudioTitle+"\x22  geometry=\x22primitive: sphere; radius: .25;\x22 material=\x22shader: noise;\x22 position=\x220 0 2.6\x22></a-entity></a-entity>";
                        if (sceneResponse.scenePrimaryAudioTriggerEvents) { //maybe pass a do not listen?
                            var buff = Buffer.from(JSON.stringify(primaryAudioObject)).toString("base64");
                            loadAudioEvents = "<a-entity primary_audio_events id=\x22audioEventsData\x22 data-audio-events='"+buff+"'></a-entity>"; 
                        }
                    }
                    if (hasAmbientAudio) {
                        // if (ambientMp3Url.length > 8) {
                            ambientAudioScript = "<script>" +      
                            "let ambientAudioHowl = new Howl({" + //inject howler for non-streaming
                                    "src: [\x22"+ambientOggUrl+"\x22,\x22"+ambientMp3Url+"\x22], volume: 0, loop: true" + 
                                "});" +
                            "ambientAudioHowl.load();</script>";
                            // ambientAudioControl = "<script src=\x22../main/src/component/ambient-audio-control.js\x22></script>";
                            let ambientPosAnim = "animation__yoyo=\x22property: position; to: -33 3 0; dur: 60000; dir: alternate; easing: easeInSine; loop: true;\x22 ";
                            let ambientRotAnim = "animation__rot=\x22property:rotation; dur:60000; to: 0 360 0; loop: true; easing:linear;\x22 ";        
                            // posAnim = "animation__pos=\x22property: position; to: random-position; dur: 15000; loop: true;";  
                            ambientAudioEntity = "<a-entity "+ambientRotAnim+"><a-entity id=\x22ambientAudio\x22 ambient_audio_control=\x22oggurl: "+ambientOggUrl+"; mp3url: "+ambientMp3Url+";\x22 volume: "+sceneAmbientVolume+"; "+
                            // "geometry=\x22primitive: sphere; radius: .5\x22 "+ambientPosAnim+" position=\x2233 3 0\x22>" +
                            ambientPosAnim+" position=\x2233 3 0\x22>" +
                            "</a-entity></a-entity>";
                        // }
                    }
                    if (hasTriggerAudio) {
                        // if (triggerMp3Url.length > 8) {
                            triggerAudioEntity = "<a-entity id=\x22triggerAudio\x22 trigger_audio_control=\x22volume: "+sceneTriggerVolume+"\x22>"+
                            "</a-entity>";
                            triggerAudioScript = "<script>" +      
                            "let triggerAudioHowl = new Howl({" + //inject howler for non-streaming
                                    "src: [\x22"+triggerOggUrl+"\x22,\x22"+triggerMp3Url+"\x22], volume: 1, loop: false" + 
                                "});" +
                            "triggerAudioHowl.load();</script>";
                        // }
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
                    let preloadVideo = true; //FOR NOW - testing on ios, need to set a toggle for this...
              
                    if (video_items != null && video_items[0] != null) { //only single vid for now, need to loop array

                        (async () => {
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
                                // vidUrl = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + video_items[0].userID + "/video/" + vid + "/" + vid + "." + namePlusExtension, Expires: 6000});
                                vidUrl = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, 'users/' + video_items[0].userID + "/video/" + vid + "/" + vid + "." + namePlusExtension, 6000);
                                vidSrc = "<source src=\x22"+vidUrl+"\x22 type=\x22video/mp4\x22>";
                            } else {
                                //for transparent video, need both mov + webm!
                                if (item_string_filename_ext.toLowerCase() == ".mov") {
                                    // mov = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + video_items[0].userID + "video/" + vid + "/" + vid + "." + namePlusExtension, Expires: 6000});
                                    mov = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, 'users/' + video_items[0].userID + "/video/" + vid + "/" + vid + "." + namePlusExtension, 6000);
                                    for (let i = 0; i < video_items.length; i++) {
                                        if (video_items[0]._id != video_items[i]._id) {
                                            if (video_items[0].title == video_items[i].title) {
                                                console.log("found a webm to match the mov");
                                                // webm = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + video_items[i].userID + "/" + video_items[i]._id + "." +  video_items[i].filename, Expires: 6000});
                                                webm = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, 'users/' + video_items[i].userID + "/" + video_items[i]._id + "." +  video_items[i].filename, 6000);
                                                vidSrc = "<source src=\x22"+webm+"\x22 type=\x22video/webm\x22><source src=\x22"+mov+"\x22 type=\x22video/webm\x22>";
                                            }
                                        }
                                    }
                                    
                                }
                                if (item_string_filename_ext.toLowerCase() == ".webm") {
                                    // webm = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + video_items[0].userID + "/" + vid + "." + namePlusExtension, Expires: 6000});
                                    webm = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, 'users/' + video_items[0].userID + "/video/" + vid + "/" + vid + "." + namePlusExtension, 6000);
                                    for (let i = 0; i < video_items.length; i++) {
                                        if (video_items[0]._id != video_items[i]._id) {
                                            if (video_items[0].title == video_items[i].title) {
                                                console.log("found a mov to match the webm " + video_items[0]._id + " vs " + video_items[i]._id);
                                                // mov = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + video_items[i].userID + "/" + video_items[i]._id + "." + video_items[i].filename, Expires: 6000});
                                                mov = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, 'users/' + video_items[i].userID + "/" + video_items[i]._id + "." +  video_items[i].filename, 6000);
                                                vidSrc = "<source src=\x22"+mov+"\x22 type=\x22video/webm\x22><source src=\x22"+mov+"\x22 type=\x22video/quicktime\x22>";
                                            }
                                        }
                                    }  
                                }
                            }
                        
                            if (ori.toLowerCase() == "equirectangular") { //not on landing!
                                // videosphereAsset = "<video id=\x22videosphere\x22 autoplay loop crossOrigin=\x22anonymous\x22 src=\x22" + vidUrl + "\x22></video>";
                                // videoEntity = "<a-videosphere play-on-window-click play-on-vrdisplayactivate-or-enter-vr crossOrigin=\x22anonymous\x22 src=\x22#videosphere\x22 rotation=\x220 180 0\x22 material=\x22shader: flat;\x22></a-videosphere>";
                                //play hls instead!
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
                        })(); //async end
                    } else {
                        callback(null);
                    }
                },
                function (callback) {
                    console.log("videoGroups: " + sceneResponse.sceneVideoGroups);
                    if (sceneResponse.sceneVideoGroups != null && sceneResponse.sceneVideoGroups.length > 0) {
                        const vgID = sceneResponse.sceneVideoGroups[0];
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
                                            (async () => {
                                                // video.url = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + video.userID + "/video/" + video._id + "/" + video._id + "." + video.filename, Expires: 6000}); //TODO: puthemsina video folder!
                                                video.url = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, 'users/' + video.userID + "/video/" + video._id + "/" + video._id + "." + video.filename, 6000);
                                                
                                                cbimage();
                                            })();
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
                                    if (sceneResponse.sceneWebType == "Video Landing") {
                                        videoGroupsEntity = "<div id=\x22videoGroupsData\x22 data-video-groups='"+buff+"'></div>"; 
                                    } else {
                                        videoGroupsEntity = "<a-entity video_groups_data id=\x22videoGroupsData\x22 data-video-groups='"+buff+"'></a-entity>"; 
                                    }
                                   
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
                        let loginLink = "<span class=\x22smallfont\x22><a class=\x22btn\x22 href=\x22https://servicemedia.net/main/sign_in.html\x22 target=\x22_blank\x22>Login</a></span>";
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
                        let userText = "<div class=\x22smallfont\x22><span id=\x22userName\x22 class=\x22\x22>Welcome " + avatarName+ "</span>!&nbsp;&nbsp;<button onclick=\x22Disconnect()\x22 type=\x22button\x22 class=\x22btn\x22>Disconnect</button></div><hr>";
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
                        if (sceneResponse.sceneShowAds != null && sceneResponse.sceneShowAds != undefined && sceneResponse.sceneShowAds != false) { //put the ads if you must..//nevermind...
                            // adSquareOverlay = "<script async src=\x22https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js\x22></script>"+
                            
                            // "<div id=\x22adSquareOverlay\x22 class=\x22ad-overlay\x22>" +
                        
                            // "<!-- square floater 1 -->"+
                            // "<ins class=\x22adsbygoogle\x22"+
                              
                            // "style=\x22display:inline-block;width:150px;height:400px\x22"+
                            //     "data-ad-client=\x22ca-pub-5450402133525063\x22"+
                            //     "data-ad-slot=\x225496489247\x22></ins>"+
                            //     // "<br><button id=\x22adSquareCloseButton\x22 type=\x22button\x22 class=\x22closeable\x22>Close Ad</button>"+
                            // "</div>" +
                            // "<br><br><button id=\x22adSquareCloseButton\x22 type=\x22button\x22 class=\x22closeable\x22>Close Ad</button>"+
                            // "<script>"+
                            //     "(adsbygoogle = window.adsbygoogle || []).push({});"+
                            // "</script>"+
                            // "<script>"+
                               
                            // "</script>";
                        }
                        callback(null);
                    
                },

                function (callback) { //undeprecate! need a static route or they timeout, duh...
                    var postcards = [];
                    console.log("sceneResponse.scenePostcards: " + JSON.stringify(sceneResponse.scenePostcards));
                    if (sceneResponse.scenePostcards != null && sceneResponse.scenePostcards.length > 0) {
                        // var index = 0;
                        // var postcard = sceneResponse.scenePostcards[Math.floor(Math.random()*sceneResponse.scenePostcards.length)]; //get random one // no, last one
                        var postcard = sceneResponse.scenePostcards[sceneResponse.scenePostcards.length - 1];
                        // postcard1 = ReturnPresignedUrlSync(process.env.ROOT_BUCKET_NAME, '/users/' + postcard.userID +"/pictures/"+ postcard._id + ".standard." + postcard.filename, 6000); //just return a single 
                        // callback(null);
                        // async.each(sceneResponse.scenePostcards, function (postcardID, callbackz) { 
                        //     index++;
                            var oo_id = ObjectID(postcard);
                            // console.log("index? " + index);

                            db.image_items.findOne({"_id": oo_id}, function (err, picture_item) {

                                bucketFolder = sceneResponse.sceneDomain; //TODO use "public" bucket if set in process.ENV
                                if (nonLocalDomains.includes(bucketFolder)) { //TODO this should be a param of domain object
                                    bucketFolder = "realitymangler.com";  //THIS! 
                                    console.log("NONLOCALDOMAIN WTF!");
                                }
                                // console.log("params " + JSON.stringify(params)); 
                                if (err || !picture_item) {
                                    console.log("error getting postcard " + postcard._id + err);
                                    callback(err);
                                } else {

                                    // postcard1 = sceneResponse.sceneDomain +"/postcards/"+sceneResponse.short_id +"/"+ picture_item._id + ".standard." + picture_item.filename;
                                    // callback();
                                    (async () => {
                                        postcard1 = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, 'users/' + picture_item.userID +"/pictures/"+ picture_item._id + ".standard." + picture_item.filename)
                                        // postcardImages.push(ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, 'users/' + picture_item.userID +"/pictures/"+ picture_item._id + ".standard." + picture_item.filename, 12000)); //just return a single 
                                        // // console.log("postcard1 " + postcard1);
                                        // callback(null);
                                        postcardImages.push(postcard1);
                                        console.log("postcard is " + postcard1);
                                        callback();
                                        
                                    })();
                                   
                                    // var params = {
                                    //     Bucket: bucketFolder,
                                    //     Key: "postcards/" + sceneResponse.short_id + "/"+ postcard + ".standard." + picture_item.filename //put in postcards folder instead of root, duh
                                    // }
                                    // //todo - MINIO support
                                    // s3.headObject(params, function(err, data) { //check that the postcard is pushed to static route
                                    //     if (err) {
                                    //         console.log("postcard missing from static route, tryna copy to " + sceneResponse.sceneDomain);
                                    //         s3.copyObject({Bucket: bucketFolder, CopySource: 'servicemedia/users/' + picture_item.userID +"/pictures/"+ picture_item._id + ".standard." + picture_item.filename,
                                    //             Key: "postcards/" + sceneResponse.short_id + "/"+ picture_item._id + ".standard." + picture_item.filename}, function (err, data) {
                                    //             if (err) {
                                    //                 console.log("ERROR copyObject" + err);
                                    //                 callback();
                                    //             } else {
                                    //                 console.log('SUCCESS copyObject');
                                                    
                                                    
                                    //                 postcard1 = sceneResponse.sceneDomain +"/postcards/"+sceneResponse.short_id +"/"+ picture_item._id + ".standard." + picture_item.filename;
                                                   
                                    //                 callback();
                                    //             }
                                    //         });
                                    //     } else {
                                    //         postcardImages.push()
                                    //         postcard1 = "http://" + bucketFolder +"/postcards/"+sceneResponse.short_id +"/"+ picture_item._id + ".standard." + picture_item.filename;
                                    //         console.log("gotsa postcard " + postcard1 );
                                    //         callback();
                                    //     }
                                        
                                    // });
                                }
                            });
                        //             }
                        //         });
                        //     },
                        //     function (err) {                       
                        //         if (err) {
                        //             console.log('A file failed to process');
                        //             callback();
                        //         } else {
                                 
                        //             callback();
                        //         }
                        //     });
                    } else {
                        console.log("no postcard!");
                        callback();
                    }
                },
                
                function (callback) {
                    console.log("pictureGroups: " + sceneResponse.scenePictureGroups);
                    if (sceneResponse.scenePictureGroups != null && sceneResponse.scenePictureGroups.length > 0) {
                        // pgID = sceneResponse.scenePictureGroups[0];
                        
                        // let oo_id = ObjectID(pgID);

                        var objectIDs = sceneResponse.scenePictureGroups.map(convertStringToObjectID);
                        db.groups.find({_id: {$in : objectIDs}}, function (err, groups) {
                            if (err || !groups) {
                                callback();
                            } else {
                            // console.log("pic groups: " + JSON.stringify(groups))
                            async.each(groups, function (group, callbackz) { 
                                let picGroup = {};
                                picGroup._id = group._id;
                                picGroup.name = group.name;
                                picGroup.userID = group.userID;
                                let ids = group.items.map(convertStringToObjectID);

                                // picGroup._id = groups[0]._id;
                                // picGroup.name = groups[0].name;
                                // picGroup.userID = groups[0].userID;
                                // let ids = groups[0].items.map(convertStringToObjectID);
                                // let modImages =
                                db.image_items.find({_id : {$in : ids}}, function (err, images) { // get all the image records in group
                                    if (err || !images) {
                                        callbackz();
                                    } else {
                                        async.each(images, function(image, cbimage) { //jack in a signed url for each
                                            (async () => {
                                                if (image.orientation != null && image.orientation != undefined && image.orientation.toLowerCase() == "equirectangular") { 
                                                    skyboxIDs.push(image._id);
                                                    // image.url = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + image.userID + "/pictures/originals/" + image._id + ".original." + image.filename, Expires: 6000});
                                                    image.url = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, 'users/' + image.userID + "/pictures/originals/" + image._id + ".original." + image.filename, 6000);
                                                    cbimage();
                                                } else {
                                                    // image.url = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + image.userID + "/pictures/" + image._id + ".standard." + image.filename, Expires: 6000}); //i.e. 1024
                                                    image.url = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, 'users/' + image.userID + "/pictures/" + image._id + ".standard." + image.filename, 6000);
                                                    cbimage();
                                                }
                                            })();
                                            
                                            
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
                                    // pictureGroupsEntity = "<a-entity scale=\x22.75 .75 .75\x22 look-at=\x22#player\x22 position=\x22"+picturegroupLocation+"\x22>"+ 
                                    // "<a-entity position=\x220 -2.5 0\x22 scale=\x22.75  .75 .75\x22 id=\x22pictureGroupsControl\x22 class=\x22envMap activeObjexRay\x22 "+skyboxEnvMap+" toggle-picture-group gltf-model=\x22#camera_icon\x22></a-entity>"+
                                    // "<a-entity id=\x22pictureGroupPanel\x22 visible=\x22false\x22 position=\x220 -1 0\x22>"+
                                    // // "<a-entity id=\x22pictureGroupHeaderText\x22 geometry=\x22primitive: plane; width: 3.25; height: 1\x22 position=\x220 1.75 0\x22 material=\x22color: grey; transparent: true; opacity: 0.0\x22" +
                                    // // "text=\x22value:; wrap-count: 35;\x22></a-entity>" +
                                    
                                    // "<a-entity id=\x22pictureGroupPicLandscape\x22 visible=\x22true\x22 position=\x220 2.25 -.1\x22 gltf-model=\x22#flatrect2\x22 scale=\x224 4 4\x22 material=\x22shader: flat; alphaTest: 0.5;\x22"+
                                    // "rotation='0 0 0'></a-entity>"+
                                    // "<a-entity id=\x22pictureGroupPicPortrait\x22 visible=\x22false\x22 position=\x220 3.25 -.1\x22 gltf-model=\x22#portrait_panel\x22 scale=\x224 4 4\x22 material=\x22shader: flat; alphaTest: 0.5;\x22"+
                                    // "rotation='0 0 0'></a-entity>"+
                                    // "<a-entity id=\x22pictureGroupPicSquare\x22 visible=\x22false\x22 position=\x220 2.25 -.1\x22 gltf-model=\x22#flatsquare\x22 scale=\x224 4 4\x22 material=\x22shader: flat; alphaTest: 0.5;\x22"+
                                    // "rotation='0 0 0'></a-entity>"+
                                    // "<a-entity id=\x22pictureGroupPicCircle\x22 visible=\x22false\x22 position=\x220 2.25 -.1\x22 gltf-model=\x22#flatcircle\x22 scale=\x224 4 4\x22 material=\x22shader: flat; alphaTest: 0.5;\x22"+
                                    // "rotation='0 0 0'></a-entity>"+
                                    // // "<a-entity gltf-model=\x22#square_panel\x22 scale=\x222.25 2.25 2.25\x22 position=\x220 2.1 -.25\x22></a-entity>" +
                                    // "<a-entity visible='true' class=\x22envMap activeObjexRay\x22 id=\x22pictureGroupFlyButton\x22 gltf-model=\x22#next_button\x22 scale=\x22.25 .25 .25\x22 position=\x223.25 -.75 0\x22></a-entity>" +
                                    // "<a-entity visible='true' class=\x22envMap activeObjexRay\x22 id=\x22pictureGroupLayoutButton\x22 gltf-model=\x22#previous_button\x22 scale=\x22.25 .25 .25\x22 position=\x22-3.25 -.75 0\x22></a-entity>" +
                                    // "<a-entity visible='true' class=\x22envMap activeObjexRay\x22 id=\x22pictureGroupNextButton\x22 gltf-model=\x22#next_button\x22 scale=\x22.5 .5 .5\x22 position=\x222.25 -.75 0\x22></a-entity>" +
                                    // "<a-entity visible='true' class=\x22envMap activeObjexRay\x22 id=\x22pictureGroupPreviousButton\x22 gltf-model=\x22#previous_button\x22 scale=\x22.5 .5 .5\x22 position=\x22-2.25  -.75 0\x22></a-entity>" +
                                    // "</a-entity></a-entity>";
                                   
                                    var buff = Buffer.from(JSON.stringify(requestedPictureGroups)).toString("base64");
                                    pictureGroupsData = "<div id=\x22pictureGroupsData\x22 data-picture-groups='"+buff+"'></a-entity>"; //to be picked up by aframe, but data is in data-attribute
                                    // modelAssets = modelAssets + "<a-asset-item id=\x22portrait_panel\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/flatrect2_portrait.glb\x22></a-asset-item>\n" +
                                    // "<a-asset-item id=\x22flatrect2\x22 crossorigin=\x22anonymous\x22 id=\x22flatrect2\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/flatrect2.glb\x22></a-asset-item>"+
                                    // "\n<a-asset-item id=\x22camera_icon\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/camera1.glb\x22></a-asset-item>\n";
                                    // "});";
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
                function (callback) {  //places scene pics (not in a group)
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
                                        (async () => {

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
                                            let scale = 1;
                                            // image1url = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + picture_item.userID + "/pictures/" + picture_item._id + ".standard." + picture_item.filename, Expires: 6000});
                                            if (picture_item.orientation == "circle" || picture_item.orientation == "Circle" || picture_item.orientation == "square" || picture_item.orientation == "Square" ) {
                                                image1url = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, 'users/' + picture_item.userID + "/pictures/originals/" + picture_item._id + ".original." + picture_item.filename, 6000);
                                                // 'users/' + picture_item.userID + '/pictures/originals/' + picture_item._id + '.original.' + picture_item.filename
                                            } else {
                                                image1url = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, 'users/' + picture_item.userID + "/pictures/" + picture_item._id + ".standard." + picture_item.filename, 6000);
                                            }
                                            if (picture_item.orientation == "Tileable") {

                                                tilepicUrl = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, 'users/' + picture_item.userID + "/pictures/originals/" + picture_item._id + ".original." + picture_item.filename, 6000);
                                                console.log("GOTSA TILEABLE PIC! " + tilepicUrl);
                                            }
                                            // image1url = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, 'users/' + picture_item.userID + "/pictures/" + picture_item._id + ".standard." + picture_item.filename, 6000);
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
                                                if (locationPictures[picIndex].scale) {

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
                                                        modelAssets = modelAssets + "<a-asset-item id=\x22portrait_panel\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/panel5c.glb\x22></a-asset-item>\n";
                                                    } else if (picture_item.orientation == "square" || picture_item.orientation == "Square") {
                                                        imageEntities = imageEntities + "<a-entity "+link+""+lookat+"  mod-materials=\x22index:"+index+"\x22 gltf-model=\x22#square_panel\x22 scale=\x223 3 3\x22 material=\x22shader: flat; src: #smimage" + index + "; alphaTest: 0.5;\x22"+
                                                        " position=\x22"+position+"\x22 rotation=\x22"+rotation+"\x22 visible='true'>"+caption+"</a-entity>";
                                                        modelAssets = modelAssets + "<a-asset-item id=\x22square_panel\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/panelsquare1.glb\x22></a-asset-item>\n";
                                                    } else if (picture_item.orientation == "circle" || picture_item.orientation == "Circle") {
                                                        imageEntities = imageEntities + "<a-entity "+link+""+lookat+"  mod-materials=\x22index:"+index+"\x22 gltf-model=\x22#circle_panel\x22 material=\x22shader: flat; src: #smimage" + index + "; alphaTest: 0.5;\x22"+
                                                        " position=\x22"+position+"\x22 rotation=\x22"+rotation+"\x22 visible='true'>"+caption+"</a-entity>";
                                                        modelAssets = modelAssets + "<a-asset-item id=\x22circle_panel\x22 crossorigin=\x22anonymous\x22 src=\x22https://servicemedia.s3.amazonaws.com/assets/models/panelcircle1.glb\x22></a-asset-item>\n";
                                                    } else {
                                                        imageEntities = imageEntities + "<a-entity "+link+""+lookat+"  mod-materials=\x22index:"+index+"\x22 gltf-model=\x22#landscape_panel\x22 material=\x22shader: flat; src: #smimage" + index + "; alphaTest: 0.5;\x22"+
                                                        " position=\x22"+position+"\x22 rotation=\x22"+rotation+"\x22 visible='true'>"+caption+"</a-entity>";
                                                        //modelAssets...
                                                        // modelAssets = modelAssets + 
                                                    }
                                                }
                                            }
                                            callbackz();
                                        })();
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
                                let theKey = 'users/' + picture_item.userID + '/pictures/originals/' + picture_item._id + '.original.' + picture_item.filename; //TODO cook smaller equirect versions?
                                //console.log("theKey " + theKey);
                                // const params = {
                                //     Bucket: 'servicemedia', 
                                //     Key: theKey
                                // };
                                // s3.headObject(params, function(err, data) { //some old skyboxen aren't saved with .original. in filename, check for that
                                    
                                //     if (err) {
                                    //   console.log("din't find skybox: " + err, err.stack);

                                    // theKey = 'users/' + picture_item.userID + '/pictures/originals/' + picture_item.filename;
                                    // let skyboxUrl = s3.getSignedUrl('getObject', {Bucket: process.env.ROOT_BUCKET_NAME, Key: theKey, Expires: 6000});
                                    (async () => {
                                        let skyboxUrl = await ReturnPresignedUrl(process.env.ROOT_BUCKET_NAME, theKey, 6000);
                                        // console.log("skyboxURL is " + skyboxUrl);
                                        skyboxAsset = "<img id=\x22sky\x22 crossorigin=\x22anonymous\x22 src='" + skyboxUrl + "'>";
                                        if (sceneResponse.sceneUseSkybox) {
                                            // theKey = 'users/' + picture_item.userID + '/pictures/originals/' + picture_item.filename;
                                            // skyboxUrl = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: theKey, Expires: 6000});
                                            // skyboxAsset = "<img id=\x22sky\x22 crossorigin=\x22anonymous\x22 src='" + skyboxUrl + "'>";
                                        
                                            // let envMap = sceneResponse.sceneUseDynCubeMap ? "convert-to-envmap" : "";
                                            skySettings = "<a-sky id=\x22a_sky\x22 crossorigin=\x22anonymous\x22 hide-in-ar-mode src=#sky></a-sky>";
                                            // aframeEnvironment = "";
                                            hemiLight = "<a-light id=\x22hemi-light\x22 type=\x22hemisphere\x22 color=\x22" + sceneResponse.sceneColor1 + "\x22 groundColor=\x22" + sceneResponse.sceneColor2 + "\x22 intensity=\x221\x22 position\x220 0 0\x22>"+
                                            "</a-light>";
                                        }
                                        callback(null);
                                    })();

                            
                            }
                        });
                    } else {
                        callback(null);
                    }
                },

                function (callback) {
                    let settings = {};  //TODO move this lower down? 

                    settings._id = sceneResponse._id;
                    settings.sceneType = "landing";
                    settings.sceneTags = sceneResponse.sceneTags;
                    settings.sceneTitle = sceneResponse.sceneTitle;
                    settings.sceneKeynote = sceneResponse.sceneKeynote;
                    settings.sceneDescription = sceneResponse.sceneDescription;
                    settings.sceneEventStart = sceneResponse.sceneEventStart;
                    settings.sceneEventEnd = sceneResponse.sceneEventEnd;
                    settings.hideAvatars = true;
                    settings.sceneSkyRadius = sceneResponse.sceneSkyRadius != undefined ? sceneResponse.sceneSkyRadius : 202;
                    settings.sceneFontWeb1 = sceneResponse.sceneFontWeb1;
                    settings.sceneFontWeb2 = sceneResponse.sceneFontWeb2;
                    settings.sceneFontWeb3 = sceneResponse.sceneFontWeb3;
                    settings.sceneFontFillColor = sceneResponse.sceneFontFillColor;
                    settings.sceneFontOutlineColor = sceneResponse.sceneFontOutlineColor;
                    settings.sceneTextBackground = sceneResponse.sceneTextBackground;
                    settings.sceneTextBackgroundColor = sceneResponse.sceneTextBackgroundColor;
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
                    settings.sceneWaterLevel = (sceneResponse.sceneWater != undefined && sceneResponse.sceneWater.level != undefined) ? sceneResponse.sceneWater.level : 0;
                    settings.sceneCameraMode = sceneResponse.sceneCameraMode != undefined ? sceneResponse.sceneCameraMode : "First Person"; 
                    settings.sceneCameraFlyable = sceneResponse.sceneFlyable != undefined ? sceneResponse.sceneFlyable : false;
                    let audioGroups = {};
                    audioGroups.triggerGroups = sceneResponse.sceneTriggerAudioGroups;
                    audioGroups.ambientGroups = sceneResponse.sceneAmbientAudioGroups;
                    audioGroups.primaryGroups = sceneResponse.scenePrimaryAudioGroups;
                    settings.audioGroups = audioGroups; 
                    settings.clearLocalMods = false;
                    settings.sceneVideoStreams = sceneResponse.sceneVideoStreamUrls;
                    settings.socketHost = process.env.SOCKET_HOST;
                    settings.networking = sceneResponse.sceneNetworking;
                    settings.playerStartPosition = playerPosition;

                    if (sceneResponse.sceneTags != null && sceneResponse.sceneTags.includes("show avatars")) {
                        settings.hideAvatars = false;
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
                    // settingsDataEntity = "<a-entity id=\x22settingsDataEntity\x22 data-settings=\x22"+sbuff+"\x22></a-entity>"; ? maybe

                    let picGroups = "";
                    let sceneGreeting = sceneResponse.sceneDescription;
                    if (sceneResponse.sceneGreeting != null && sceneResponse.sceneGreeting != undefined && sceneResponse.sceneGreeting != "") {
                        sceneGreeting = sceneResponse.sceneGreeting;
                    }      
                    let sceneQuest = "No quests for this scene... yet!";
                    if (sceneResponse.sceneQuest != null && sceneResponse.sceneQuest != undefined && sceneResponse.sceneQuest) {
                        sceneQuest = sceneResponse.sceneQuest;
                    }
                    

                    //scenetype filters below...

                    // console.log("sceneWebType: "+ sceneResponse.sceneWebType);
                    // if (sceneResponse.sceneWebType == undefined || sceneResponse.sceneWebType.toLowerCase() == "default" || sceneResponse.sceneWebType.toLowerCase() == "aframe") { 
                    //     // webxrFeatures = "webxr=\x22optionalFeatures: hit-test, local-floor\x22"; //otherwise hit-test breaks everythign!
                    //     webxrFeatures = "webxr=\x22optionalFeatures: hit-test, local-floor, dom-overlay, unbounded; overlayElement:#ar_overlay;\x22"; //otherwise hit-test breaks everythign!
                    //     // arHitTest = "ar-hit-test-spawn=\x22mode: "+arMode+"\x22";
                    //     // arShadowPlane = "<a-plane show-in-ar-mode id="shadow-plane" material="shader:shadow" shadow="cast:false;" visible=\x22false\x22 height=\x2210\x22 width=\x2210\x22 rotation=\x22-90 0 0\x22 shadow=\x22receive:true\x22 ar-shadows=\x22opacity: 0.3\x22 static-body=\x22shape: none\x22 shape__main=\x22shape: box; halfExtents: 100 100 0.125; offset: 0 0 -0.125\x22>" +
                    //     arShadowPlane = "<a-plane show-in-ar-mode visible=\x22false\x22 id=\x22shadow-plane\x22 material=\x22shader:shadow\x22 shadow=\x22cast:false;\x22 follow-shadow=\x22.activeObjexRay\x22 height=\x2233\x22 width=\x2233\x22 rotation=\x22-90 0 0\x22>" +
                    //         "</a-plane>";
                        
                    //     // }
                    //     handsTemplate = "<template id=\x22hand-template\x22><a-entity><a-box scale=\x220.1 0.1 0.1\x22 visible=false></a-box></a-entity></template>";
                       
                    // } 
                   
                    
                   if (sceneResponse.sceneWebType != "Video Landinggggg") {
                        // if (!sceneGreeting || !sceneGreeting.length) {
                        //     sceneGreeting = "Welcome!";
                        // } 
                        // let hasTile = false;
                        // let bgstyle = "style=\x22height:100%; width:100%; overflow:auto; background-color: "+sceneResponse.sceneColor1+";\x22"

                        if (sceneResponse.sceneTags.includes("landing pics")) {
                            // if (requestedPictureGroups) {
                                
                                // picGroups = JSON.stringify(requestedPictureGroups);
                                // pictureGroupsData = "<div id=\x22pictureGroupsData\x22 data-picture-groups='"+buff+"'></div>"; 
                                // console.log(pictureGroupsData);
                            // }
                        }
                        let availableScenesHTML = ""; 
                        let bgstyle = "style=\x22height:100%; width:100%; overflow:auto;\x22";
                        let sceneAccess = "Access Open to Public"
                        // if (sceneResponse.sceneShareWithSubscribers) {
                        //     sceneAccess ="<span>Access Requires Subscription</span><br>";
                        // }
                        // bgcolor=\x22"+sceneResponse.sceneColor1+"\x22>\n
                        if (tilepicUrl != "") {
                            bgstyle = "style=\x22height:100%; width:100%; overflow:auto; background-color: "+sceneResponse.sceneColor1+"; background-image: url("+tilepicUrl+"); background-repeat: repeat;\x22";
                        }
                        let sceneOwner = "";
                        let sceneEditButton = "";
                        if (sceneOwner != "" || (!isGuest && req.session.user && req.session.user.authLevel.includes("domain_admin"))) { //hrm..
                           sceneEditButton = "<a class=\x22mx-auto btn btn-xl btn-primary float-right\x22 target=\x22_blank\x22 href=\x22../main/index.html?type=scene&iid="+sceneResponse._id+"\x22>Edit Scene</a>";
                        }

                        if (sceneResponse.sceneShareWithSubscribers) {
                            if (isGuest) {
                                sceneAccess ="<span>Access Requires Subscription</span><br>"+
                                // "<form action=\x22../create-checkout-session\x22 method=\x22POST\x22>"+
                                // "<button class=\x22mx-auto btn btn-xl btn-success \x22 type=\x22submit\x22>Become a Subscriber!</button>"+
                                // "</form>";
                                
                                "<a class=\x22mx-auto btn btn-xl btn-info \x22 href=\x22../main/sign_in.html\x22>Subscriber Login</a> "+
                                "<p>Login if you're a subscriber, or </p>" +
                                "<p><a class=\x22mx-auto btn btn-xl btn-success \x22 href=\x22https://buy.stripe.com/test_fZe6pdebx9vB7LO8wx\x22>Become a Subscriber!</a> </p>";
                            } else {
                                sceneAccess ="<span>Access Requires Subscription</span><br>"+
                                "<h4 class=\x22text-success\x22>Welcome <strong>" + avatarName + "</strong>!</h4>";
                            }
                            //  "Subscribe or Login to access this scene - "
                        } else {
                            if (!isGuest) {
                                sceneAccess += "<p><h4 class=\x22text-success\x22>Welcome <strong>" + avatarName + "</strong>!</h4></p>";
                            }
                            
                        // }
                        }
                        let styleTheme = "slate";
                        if (sceneResponse.sceneStyleTheme != null && sceneResponse.sceneStyleTheme != undefined && sceneResponse.sceneStyleTheme.length > 0 && sceneResponse.sceneStyleTheme != 'undefined') {
                            styleTheme = sceneResponse.sceneStyleTheme;
                        }

                        // platformButtons = "";
                        let buttonLabel = sceneResponse.sceneWebType == "Video Landing" ? "Watch Video" : "Enter WebXR Scene"

                        let platformButtons = "<a class=\x22mx-auto btn btn-xl btn-primary \x22 href=\x22../webxr/"+ sceneResponse.short_id + "\x22>"+buttonLabel+"</a>"+
                        "<a class=\x22mx-auto btn btn-xl btn-primary \x22 href=\x22https://www.oculus.com/open_url/?url=https://smxr.net/webxr/"+ sceneResponse.short_id + "\x22>Send to Quest</a>"
                        if (sceneResponse.sceneShareWithSubscribers) {
                            if (isGuest) {
                                platformButtons = "";
                            }
                            
                            //  "Subscribe or Login to access this scene - "
                        }
                        if (!sceneResponse.sceneShareWithSubscribers && sceneResponse.sceneWebGLOK) {
                           platformButtons += "<a class=\x22mx-auto btn btn-xl btn-primary \x22 href=\x22../unity/"+ sceneResponse.short_id + "\x22>Enter Unity Scene</a> ";
                        }
                        var audioHtml = "";
                        let uid = "0000000000000";
                        if (req.session.user) {
                            uid = req.session.user._id;
                        }
                        if (mp3url != undefined && mp3url.length > 6) {
                            audioHtml = '<div><audio controls><source src=\x22' + mp3url + '\x22 type=\x22audio/mp3\x22></audio></div>';
                        }
                        var token=jwt.sign({userId:uid,shortID:sceneResponse.short_id},process.env.JWT_SECRET, { expiresIn: '1h' }); 
                        // console.log("avatar name: " + avatarName + " token " + token);
                        htmltext = "<!DOCTYPE html>\n" +
                        "<head> " +
                        "<meta name=\x22viewport\x22 content=\x22width=device-width, initial-scale=1\x22 />"+
                        "<html lang=\x22en\x22 xml:lang=\x22en\x22 xmlns= \x22http://www.w3.org/1999/xhtml\x22>"+
                        "<meta charset=\x22UTF-8\x22>"+
                        "<meta name=\x22google\x22 content=\x22notranslate\x22>" +
                        "<meta http-equiv=\x22Content-Language\x22 content=\x22en\x22></meta>" +
                        // googleAnalytics +
                        
                        "<link rel=\x22icon\x22 href=\x22data:,\x22></link>"+
                        "<meta charset='utf-8'/>" +
                        "<meta name='viewport' content='width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no'/>" +
                        "<meta property='og:url' content='" + process.env.ROOT_HOST + "/webxr/" + sceneResponse.short_id + "' /> " +
                        "<meta property='og:type' content='website' /> " +
                        // "<meta property='og:image' content='" + postcard1 + "' /> " +
                        "<meta property='og:image' content='" + postcard1 + "' /> " +
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
                        "<link href=\x22https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css\x22 rel=\x22stylesheet\x22 type=\x22text/css\x22>" +
                        // "<link href=\x22/css/webxr.css\x22 rel=\x22stylesheet\x22 type=\x22text/css\x22>" + 
                        // "<link href=\x22https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css\x22 rel=\x22stylesheet\x22 integrity=\x22sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN\x22 crossorigin=\x22anonymous\x22></link>"+
                        "<link href=\x22https://cdn.jsdelivr.net/npm/bootswatch@5.3.1/dist/"+styleTheme.toLowerCase()+"/bootstrap.min.css\x22 rel=\x22stylesheet\x22 crossorigin=\x22anonymous\x22></link>"+
                        "<script src=\x22https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js\x22 integrity=\x22sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL\x22 crossorigin=\x22anonymous\x22></script>"+                       
                        
                        "<script src=\x22/main/vendor/jquery/jquery.min.js\x22></script>" +
                        "<script src=\x22../main/js/dialogs.js\x22></script>" +
                        
                        "<script src=\x22/connect/connect.js\x22 defer=\x22defer\x22></script>" +
                        "<style> audio {"+
                                "filter: sepia(20%) saturate(70%) grayscale(1) contrast(99%) invert(92%);"+ 
                                "width: 100%;"+
                                "height: 66px;"+
                            "}"+
                        "</style>"+ 
                       
                        "</head>\n" +
                        "<body "+bgstyle+">" +
                      
                        "<div class=\x22avatarName\x22 id="+avatarName+"></div>"+
                        "<div id=\x22token\x22 data-token=\x22"+token+"\x22></div>\n"+
                        settingsData +
                      
                        "<div class=\x22container px-4 px-lg-5 my-5\x22>"+
                            "<div class=\x22row gx-4 gx-lg-5 align-items-center\x22>"+
                                "<div class=\x22col-md-6\x22>"+
                                "<a href=\x22../webxr/"+ sceneResponse.short_id + "\x22>" +
                                "<img class=\x22img-fluid\x22 src=\x22"+postcardImages[0]+"\x22 alt=\x22...\x22 /></a>"+
                                audioHtml +
                                // "<img class=\x22card-img-top mb-5 mb-md-0\x22 src=\x22"+postcard1+"\x22 alt=\x22...\x22 />"+
                                "<p class=\x22lead\x22>"+sceneResponse.sceneDescription+"</p>"+
                               
                                        // "<p class=\x22lead\x22>"+sceneResponse.sceneText+"</p>"+                      
                               
                                "</div>"+
                                "<div class=\x22col-md-6\x22>"+
                                
                                    "<div class=\x22small mb-1\x22>"+sceneResponse.sceneKeynote+"</div>"+
                                    "<h1 class=\x22display-5 fw-bolder\x22>"+sceneResponse.sceneTitle+"</h1>"+
                                    "<div class=\x22fs-5 mb-5\x22>"+
                                       
                                    "<p class=\x22lead\x22>"+sceneAccess+"</p>"+
                                    
                                        "<p class=\x22lead\x22>"+sceneGreeting+"</p>"+ 
                                        
                                        "<p class=\x22lead\x22>"+sceneQuest+"</p>"+
                                        // "<span>"+sceneQuest+"</span>"+

                                    platformButtons +
                                    sceneEditButton + 
                                    "</div>"+
                                   
                                    "<div class=\x22d-flex\x22>"+
                                        // "<input class=\x22form-control text-center me-3\x22 id=\x22inputQuantity\x22 type=\x22num\x22 value=\x221\x22 style=\x22max-width: 3rem\x22 />"+
                                            // "<button class=\x22btn btn-outline-dark flex-shrink-0\x22 type=\x22button\x22>"+
                                            //     "<i class=\x22bi-cart-fill me-1\x22></i>"+
                                            //     "Add to cart"+
                                            // "</button>"+
                                            "<a href=\x22http://"+ sceneResponse.sceneDomain + "\x22>More at "+sceneResponse.sceneDomain+"!</a>" +

                                    "</div>"+
                                "</div>"+
                            "</div>"+
                            "<div class=\x22row gx-4 gx-lg-5 align-items-center\x22>"+
                                "<div class=\x22col-md-12\x22>"+
                                "<hr>"+
                                
                                "<p class=\x22lead\x22>"+sceneResponse.sceneText+"</p>"+
                                "</div>"+
                            "</div>"+
                            "<div class=\x22row gx-4 gx-lg-5 align-items-center\x22>"+
                                "<div id=\x22picGroupsContainer\x22 class=\x22col-md-12\x22>"+
                                // picGroups +
                                "</div>"+
                            "</div>"+
                            "<div class=\x22row gx-4 gx-lg-5 align-items-center\x22>"+
                                "<div class=\x22col-md-12\x22>"+
                                availableScenesHTML +
                                "</div>"+
                            "</div>"+
                        "</div>"+
                        pictureGroupsData +
                        // "</section>"+



                        // "<h4>Immersive Links:</h4><br>"+


                        // "<img src=\x22"+postcard1+"\x22 width='512px'>"+
                        // "<video controls width='160px' height='90px' id='video'></video>"+
                        // "<a href=\x22https://servicemedia.net/webxr/"+ sceneResponse.sceneNextScene + "\x22>App link</a>"+
                        // sceneResponse.sceneGreeting+ " " + sceneResponse.sceneQuest+"</div>" +
                        // "<div id=\x22sceneQuest\x22 class=\x22linkfooter\x22 style=\x22z-index: -20;\x22>"+sceneResponse.sceneQuest+"</div>" +
                        // "</div></center>"+
                        // audioSliders +
                        // canvasOverlay +
                        // dialogButton +
                        // "<div id=\x22sceneGreeting\x22 class=\x22linkfooter\x22 style=\x22z-index: -20;\x22>"+sceneResponse.sceneGreeting+"</div>" +
                        // "<div id=\x22sceneQuest\x22 class=\x22linkfooter\x22 style=\x22z-index: -20;\x22>"+sceneResponse.sceneQuest+"</div>" +
                        // "<div id=\x22sceneGreeting\x22  style=\x22z-index: -20;\x22>"+sceneGreeting+"</div>"+
                        // "<div id=\x22sceneQuest\x22 style=\x22z-index: -20;\x22>"+sceneQuest+"</div>"+
                        // "<div id=\x22theModal\x22 class=\x22modal\x22><div id=\x22modalContent\x22 class=\x22modal-content\x22></div>";
                        // attributionsTextEntity +
                       
                        // "<div class=\x22smallfont\x22><span id=\x22users\x22></span></div>"+ 
                        "</body>\n" +
                        // socketScripts +
                        // "<script>InitSceneHooks(\x22Model Viewer\x22)</script>";
                        "</html>";
                        // console.log("Tryna do a Video Landing scene");

                    
                    } else { /////////////////////////////////////////////////////////------------- Default / AFrame response below ------------------------------
                        // na, it's the landing page...
                       
                       
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
    }//end else if not redirected
    });
    } //if params undefined
});
///// END PRIMARY SERVERSIDE /webxr/ ROUTE //////////////////////



export default landing_router;
// module.exports = landing_router;