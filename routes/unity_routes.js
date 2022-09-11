const express = require("express");
const unity_router = express.Router();

unity_router.get("/test", function (req, res) {
    res.send("OK!");
});


///////////UNITY RESPONSE ROUTE///// -- not included yet, still in server.js

unity_router.get('/scene/:_id/:platform/:version', function (req, res) { //called from app context - TODO token auth

    console.log("tryna get scene id: ", req.params._id + " excaped " + entities.decodeHTML(req.params._id));

    var platformType = req.params.platform;
    var reqstring = entities.decodeHTML(req.params._id);
    var audioResponse = {};
    var pictureResponse = {};
    var postcardResponse = {};
    var sceneResponse = {};
    var requestedPictureItems = [];
    var requestedAudioItems = [];
    var sceneWebLinx = [];
    sceneResponse.audio = [];
    sceneResponse.pictures = [];
    sceneResponse.postcards = [];
    let sceneModelLocations = [];
    var gltfObjects = [];
    sceneResponse.sceneBundleUrl = "";
    var versionID = req.params.version;
    async.waterfall([

            function (callback) {
//                    var o_id = ObjectID(reqstring);
                db.scenes.find({$or: [{ sceneTitle: reqstring },
                        { short_id : reqstring },
                        { _id : reqstring}]},
                    function (err, sceneData) { //fetch the path info by title TODO: urlsafe string

                        if (err || !sceneData || !sceneData.length) {
                            console.log("2 error getting scene data: " + err);
                            callback(err);
                        } else { //make arrays of the pics and audio items
                            if (sceneData[0].scenePictures != null && sceneData[0].scenePictures.length > 0) {
                            sceneData[0].scenePictures.forEach(function (picture){
                                var p_id = ObjectID(picture); //convert to binary to search by _id beloiw
                                requestedPictureItems.push(p_id); //populate array
                                });
                            }
                            var triggerOID = ObjectID.isValid(sceneData[0].sceneTriggerAudioID) ? ObjectID(sceneData[0].sceneTriggerAudioID) : "";
                            var ambientOID = ObjectID.isValid(sceneData[0].sceneAmbientAudioID) ? ObjectID(sceneData[0].sceneAmbientAudioID) : "";
                            var primaryOID = ObjectID.isValid(sceneData[0].scenePrimaryAudioID) ? ObjectID(sceneData[0].scenePrimaryAudioID) : "";
                            requestedAudioItems = [ triggerOID, ambientOID, primaryOID];
                            // requestedAudioItems = [ ObjectID(sceneData[0].sceneTriggerAudioID), ObjectID(sceneData[0].sceneAmbientAudioID), ObjectID(sceneData[0].scenePrimaryAudioID)];
                            // console.log("sceneScatterOFfsetn " + sceneData[0].sceneScatterOffset);
                            sceneResponse = sceneData[0];
                            callback(null);
                        }

                    });

            },

            function (callback) { //update link pic URLs //TODO check for freshness, and rescrape if needed
                if (sceneResponse.sceneLocations != null && sceneResponse.sceneLocations.length > 0) {
                    for (var i = 0; i < sceneResponse.sceneLocations.length; i++) {

                        if (sceneResponse.sceneLocations[i].x == "") {
                            sceneResponse.sceneLocations[i].x = 0;
                        }
                        if (sceneResponse.sceneLocations[i].y == "") {
                            sceneResponse.sceneLocations[i].y = 0;
                        }
                        if (sceneResponse.sceneLocations[i].z == "") {
                            sceneResponse.sceneLocations[i].z = 0;
                        }
                        if (sceneResponse.sceneLocations[i].eulerx == "") {
                            sceneResponse.sceneLocations[i].eulerx = 0;
                        }
                        if (sceneResponse.sceneLocations[i].eulery == "") {
                            sceneResponse.sceneLocations[i].eulery = 0;
                        }
                        if (sceneResponse.sceneLocations[i].eulerz == "") {
                            sceneResponse.sceneLocations[i].eulerz = 0;
                        }
                        if (sceneResponse.sceneLocations[i].model != undefined && sceneResponse.sceneLocations[i].model != "none") { //new way of attaching gltf to location w/out object
                            console.log("pushinbg model locaition " + sceneResponse.sceneLocations[i]);
                            sceneModelLocations.push(sceneResponse.sceneLocations[i]);
                        }
                        if (sceneResponse.sceneLocations[i].object != undefined && sceneResponse.sceneLocations[i].object != "none") { //new way of attaching gltf to location w/out object
                            console.log("pushinbg model locaition " + sceneResponse.sceneLocations[i]);
                            sceneObjectLocations.push(sceneResponse.sceneLocations[i]);
                        }
                    }
                }
                callback(null);
            },
            function (callback) { //update link pic URLs //TODO check for freshness, and rescrape if needed
                if (sceneResponse.sceneWebLinks != null && sceneResponse.sceneWebLinks.length > 0) {

                    // for (var i = 0; i < sceneResponse.sceneWebLinks.length; i++) {

                    //     db.weblinks.findOne({'_id': ObjectID(sceneResponse.sceneWebLinks[i])}, function (err, weblink){
                    //         if (err || !weblink) {
                    //             console.log("can't find weblink");
                    //         } else {
                    //             // let weblink = {};
                    //             var urlThumb = s3.getSignedUrl('getObject', {Bucket: 'servicemedia.web', Key: sceneResponse.sceneWebLinks[i] + ".thumb.jpg", Expires: 6000});
                    //             var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia.web', Key: sceneResponse.sceneWebLinks[i] + ".half.jpg", Expires: 6000});
                    //             var urlStandard = s3.getSignedUrl('getObject', {Bucket: 'servicemedia.web', Key: sceneResponse.sceneWebLinks[i] + ".standard.jpg", Expires: 6000});
                    //             weblink.urlThumb = urlThumb;
                    //             weblink.urlHalf = urlHalf;
                    //             weblink.urlStandard = urlStandard;
                    //             weblink.link_id = weblink._id;
                    //             // weblink.link_url;
                    //             console.log("tryna push weblink " + JSON.stringify(weblink));
                    //             sceneWebLinx.push(weblink);
                    //         }
                    //     });
                    // }
                    // callback(null);

                    async.each (sceneResponse.sceneWebLinks, function (objID, callbackz) { //nested async-ery!
                        db.weblinks.findOne({'_id': ObjectID(objID)}, function (err, weblink){
                            if (err || !weblink) {
                                console.log("can't find weblink");
                                callbackz();
                            } else {
                                // let weblink = {};
                                var urlThumb = s3.getSignedUrl('getObject', {Bucket: 'servicemedia.web', Key: objID + "/" + objID + ".thumb.jpg", Expires: 6000});
                                var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia.web', Key: objID + "/" + objID + ".half.jpg", Expires: 6000});
                                var urlStandard = s3.getSignedUrl('getObject', {Bucket: 'servicemedia.web', Key: objID + "/" + objID + ".standard.jpg", Expires: 6000});
                                weblink.urlThumb = urlThumb;
                                weblink.urlHalf = urlHalf;
                                weblink.urlStandard = urlStandard;
                                weblink.link_id = weblink._id;
                                // weblink.link_url;
                                // console.log("tryna push weblink " + JSON.stringify(weblink));
                                sceneWebLinx.push(weblink);
                                callbackz();
                            }
                        });
                    }, function(err) {
                       
                        if (err) {
                            console.log('A file failed to process');
                            callback(null);
                        } else {
                            
                            // if (sceneWebLinx.length > 0) {
                                
                                sceneResponse.sceneWebLinks = sceneWebLinx;
                                // console.log("sceneWebLinx " + JSON.stringify(sceneResponse.sceneWebLinks));
                            // }
                            callback(null);
                        }
                    });
                } else {
                    callback(null);
                }
            },

            function (callback) { //TODO jack in version part of path~

                if (sceneResponse.sceneUseEnvironment) {
//                    var urlScene = s3.getSignedUrl('getObject', {Bucket: 'mvmv.us', Key: versionID + '/' + 'scenes_' + platformType + '/' + sceneResponse.sceneEnvironment.name + '_' + platformType + '.unity3d', Expires: 6000});
                    var urlScene = s3.getSignedUrl('getObject', {Bucket: 'mvmv.us', Key: versionID + '/' + 'scenes_' + platformType + '/' + sceneResponse.sceneEnvironment.name, Expires: 6000});
                    sceneResponse.sceneEnvironment.sceneBundleUrl = urlScene;
                    console.log(urlScene);
                    callback(null);
                } else {
                    callback(null);
                }
            },

            function (callback) { //fix breaking nulls or type errors
                if (sceneResponse.sceneWater != null) {
                    if (sceneResponse.sceneWater.level == "" || sceneResponse.sceneWater.level == null ) {
                        sceneResponse.sceneWater.level = 0;
                    }
                } else {
                    let swater = {};
                    swater.level = 0
                    swater.useUWFX = false;
                    swater.name = "none";
                    swater.desc = "none";
                    sceneResponse.sceneWater = swater;
                }
                callback(null);
            },
            function (callback) { //fethc audio items

                db.audio_items.find({_id: {$in: requestedAudioItems }}, function (err, audio_items)
                {
                    if (err || !audio_items) {
                        console.log("error getting audio items: " + err);
                        callback(null);
                    } else {

                        callback(null, audio_items) //send them along
                    }
                });
            },

            function(audio_items, callback) { //add the signed URLs to the obj array
                for (var i = 0; i < audio_items.length; i++) {
                    //    console.log("audio_item: ", audio_items[i]);
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
                    var urlMp3 = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + mp3Name, Expires: 60000});
                    var urlOgg = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + oggName, Expires: 60000});
                    var urlPng = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + pngName, Expires: 60000});
//                            audio_items.URLmp3 = urlMp3; //jack in teh signed urls into the object array
                    audio_items[i].URLmp3 = urlMp3; //jack in teh signed urls into the object array
                    audio_items[i].URLogg = urlOgg;
                    audio_items[i].URLpng = urlPng;
                    if (audio_items[i].tags != null) {
                        if (audio_items[i].tags.length < 1) {
                            audio_items[i].tags = [""];
                        } else {
                            audio_items[i].tags = [""];
                        }
                    }
                }
                //   console.log('tryna send ' + audio_items);
                audioResponse = audio_items;
                sceneResponse.audio = audioResponse;
//                        console.log("audio", audioResponse);
                callback(null, audio_items);
            },

            function(audioStuff, callback) { //return the pic items
                // console.log("requestedPictureItems:  ", requestedPictureItems);
                db.image_items.find({_id: {$in: requestedPictureItems }}, function (err, pic_items)
                {
                    if (err || !pic_items) {
                        console.log("error getting picture items: " + err);
                        callback(null);
                    } else {
                        callback(null, pic_items)
                    }
                });
            },

            function (picture_items, callback) {
                for (var i = 0; i < picture_items.length; i++) {
                    //    console.log("picture_item: ", picture_items[i]);
                    var item_string_filename = JSON.stringify(picture_items[i].filename);
                    item_string_filename = item_string_filename.replace(/\"/g, "");
                    var item_string_filename_ext = getExtension(item_string_filename);
                    var expiration = new Date();
                    expiration.setMinutes(expiration.getMinutes() + 1000);
                    var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                    //console.log(baseName);
                    var thumbName = 'thumb.' + baseName + item_string_filename_ext;
                    var quarterName = 'quarter.' + baseName + item_string_filename_ext;
                    var halfName = 'half.' + baseName + item_string_filename_ext;
                    var standardName = 'standard.' + baseName + item_string_filename_ext;
                    var originalName = baseName + item_string_filename_ext;

                    var urlThumb = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_items[i].userID + "/pictures/" + picture_items[i]._id + "." + thumbName, Expires: 6000}); //just send back thumbnail urls for list
                    var urlQuarter = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_items[i].userID + "/pictures/" + picture_items[i]._id + "." + quarterName, Expires: 6000});
                    var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_items[i].userID + "/pictures/" + picture_items[i]._id + "." + halfName, Expires: 6000});
                    var urlStandard = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_items[i].userID + "/pictures/" + picture_items[i]._id + "." + standardName, Expires: 6000});
                    var urlTarget = "";
                    if (picture_items[i].useTarget) {
                        urlTarget = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_items[i].userID + "/pictures/targets/" + picture_items[i]._id + ".mind", Expires: 6000});
                    }
                    
                    
                    //var urlPng = knoxClient.signedUrl(audio_item[0]._id + "." + pngName, expiration);
                    picture_items[i].urlThumb = urlThumb; //jack in teh signed urls into the object array
                    picture_items[i].urlQuarter = urlQuarter; //jack in teh signed urls into the object array
                    picture_items[i].urlHalf = urlHalf; //jack in teh signed urls into the object array
                    picture_items[i].urlStandard = urlStandard; //jack in teh signed urls into the object array
                    picture_items[i].urlTarget = urlTarget;
                    if (picture_items[i].orientation != null && picture_items[i].orientation.toLowerCase() == "equirectangular") { //add the big one for skyboxes
                        let theKey = "users/" + picture_items[i].userID + "/pictures/originals/" + picture_items[i]._id + ".original." + originalName;
                        // const params = { //need to be async, if at all
                        //     Bucket: 'servicemedia', 
                        //     Key: theKey
                        // };
                        // s3.headObject(params, function(err, data) { //some old skyboxen aren't saved with _id.original. in filename, check for that
                        //     if (err) {
                        //         console.log("tryna rename the key to " +picture_items[i].userID + "/pictures/originals/" + originalName);
                        //         theKey = "users/" +picture_items[i].userID + "/pictures/originals/" + originalName;
                        //     } 
                        // });
                        var urlOriginal = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: theKey, Expires: 6000});
                        picture_items[i].urlOriginal = urlOriginal;
                        let cubeMapAsset = [];
                        if (sceneResponse.sceneUseDynCubeMap != null && sceneResponse.sceneUseDynCubeMap) {
                            let path1 = s3.getSignedUrl('getObject', {Bucket: process.env.S3_ROOT_BUCKET_NAME, Key: "users/"+picture_items[i].userID+"/cubemaps/"+picture_items[i]._id+"_px.jpg", Expires: 6000});  
                            let path2 = s3.getSignedUrl('getObject', {Bucket: process.env.S3_ROOT_BUCKET_NAME, Key: "users/"+picture_items[i].userID+"/cubemaps/"+picture_items[i]._id+"_nx.jpg", Expires: 6000});  
                            let path3 = s3.getSignedUrl('getObject', {Bucket: process.env.S3_ROOT_BUCKET_NAME, Key: "users/"+picture_items[i].userID+"/cubemaps/"+picture_items[i]._id+"_py.jpg", Expires: 6000});  
                            let path4 = s3.getSignedUrl('getObject', {Bucket: process.env.S3_ROOT_BUCKET_NAME, Key: "users/"+picture_items[i].userID+"/cubemaps/"+picture_items[i]._id+"_ny.jpg", Expires: 6000});  
                            let path5 = s3.getSignedUrl('getObject', {Bucket: process.env.S3_ROOT_BUCKET_NAME, Key: "users/"+picture_items[i].userID+"/cubemaps/"+picture_items[i]._id+"_pz.jpg", Expires: 6000});  
                            let path6 = s3.getSignedUrl('getObject', {Bucket: process.env.S3_ROOT_BUCKET_NAME, Key: "users/"+picture_items[i].userID+"/cubemaps/"+picture_items[i]._id+"_nz.jpg", Expires: 6000});                                    
                            cubeMapAsset.push(path1);
                            cubeMapAsset.push(path2);
                            cubeMapAsset.push(path3);
                            cubeMapAsset.push(path4);
                            cubeMapAsset.push(path5);
                            cubeMapAsset.push(path6);
                            sceneResponse.cubeMapAsset = cubeMapAsset;
                        }
                    }
                    if (picture_items[i].hasAlphaChannel == null) {picture_items[i].hasAlphaChannel = false}
                    //pathResponse.path.pictures.push(urlThumb, urlQuarter, urlHalf, urlStandard);
                    if (picture_items[i].tags == null) {picture_items.tags = [""]}
                }
                pictureResponse = picture_items ;
                callback(null);
            },

            function (callback) {
                var postcards = [];
                if (sceneResponse.scenePostcards != null && sceneResponse.scenePostcards.length > 0) {
                    async.each (sceneResponse.scenePostcards, function (postcardID, callbackz) { //nested async-ery!
                        var oo_id = ObjectID(postcardID);
                        db.image_items.findOne({"_id": oo_id}, function (err, picture_item) {
                            if (err || !picture_item) {
                                console.log("error getting picture items: " + err);
//                                        callback(err);
//                                        callback(null);
                                callbackz();
                            } else {
                                var urlThumb = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".thumb." + picture_item.filename, Expires: 6000});
                                var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".half." + picture_item.filename, Expires: 6000});
                                var urlStandard = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".standard." + picture_item.filename, Expires: 6000});

                                var postcard = {};
                                postcard.userID = picture_item.userID;
                                postcard._id = picture_item._id;
                                postcard.sceneID = picture_item.postcardForScene;
                                postcard.urlThumb = urlThumb;
                                postcard.urlHalf = urlHalf;
                                postcard.urlStandard = urlStandard;
                                if (postcards.length < 9)
                                    postcards.push(postcard);
//                                        console.log("pushing postcard: " + JSON.stringify(postcard));
                                callbackz();
                            }

                        });

                    }, function(err) {
                       
                        if (err) {
                            
                            console.log('A file failed to process');
                            callback(null, postcards);
                        } else {
                            console.log('All files have been processed successfully');
                            callback(null, postcards);
//                                        };
                        }
                    });
                } else {
//                      callback(null);
                    callback(null, postcards);
                }
            },

            function (postcardResponse, callback) {
                //assemble all response elements
                sceneResponse.audio = audioResponse;
                sceneResponse.pictures = pictureResponse;
                sceneResponse.postcards = postcardResponse;
                callback(null);
            },

            function (callback) {
                var modelz = [];
               console.log("sceneModels : " + JSON.stringify(sceneResponse.sceneModels));
                if (sceneResponse.sceneModels != null) {
                    async.each (sceneResponse.sceneModels, function (objID, callbackz) { //nested async-ery!
                        var oo_id = ObjectID(objID);
                        // console.log("13904 tryna get scenemodel: " + objID);
                        db.models.findOne({"_id": oo_id}, function (err, model) {
                            if (err || !model) {
                                console.log("error getting model: " + err);
                                callbackz();
                            } else {
                                console.log("gotsa model:" + model._id);
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
                            console.log('modelz have been added to scene.modelz');
                            objectResponse = modelz;
                            sceneResponse.sceneModelz = objectResponse;
                            callback(null);
                        }
                    });
                } else {
                    callback(null);
                }
            },
            function (callback) { //add object groups to scene object list
                // var objex = [];
                // if (sceneResponse.sceneObjectGroups) {
                    if (sceneResponse.sceneObjectGroups != null) {
                        async.each (sceneResponse.sceneObjectGroups, function (objID, callbackz) { //nested async-ery!
                            var oo_id = ObjectID(objID);
                            console.log("tryna get GroupObject: " + objID);
                            db.groups.findOne({"_id": oo_id}, function (err, group) {
                                if (err || !group) {
                                    console.log("error getting obj items: " + err);
                                    callbackz();
                                } else {
                                   // console.log("gotsome groupObjects to add to sceneObjects : "+ JSON.stringify(group.items));
                                    sceneResponse.sceneObjects = sceneResponse.sceneObjects.concat(group.items);
                                    callbackz();
                                }
                            });
                        }, function(err) {
                           
                            if (err) {
                                
                                
                                console.log('A file failed to process');
                                callback(err);
                            } else {
                                console.log('groupObjects have been added to sceneObjects');
                                callback(null);
                            }
                        });
                    } else {
                        callback(null);
                    }
            },
            // function (callback) {

            // },
            function (callback) {

                var objex = [];
//                console.log("sceneObjects : " + JSON.stringify(sceneResponse.sceneObjects));
                if (sceneResponse.sceneUseTargetObject && sceneResponse.sceneTargetObject != null && sceneResponse.sceneTargetObject.name != "") {
                    sceneResponse.sceneTargetObject.assetUrl = s3.getSignedUrl('getObject', {Bucket: 'mvmv.us', Key: versionID + '/' + 'bundles_' + platformType + '/' + sceneResponse.sceneTargetObject.name, Expires: 6000});
                }
                if (sceneResponse.sceneObjects != null) {
                    console.log("sceneResponse.sceneObjects: " + JSON.stringify(sceneResponse.sceneObjects));
                    var sceneObjex = removeDuplicates(sceneResponse.sceneObjects); //TODO find out where they come from?!
                    async.each (sceneObjex, function (objID, callbackz) { //nested async-ery!
                        var oo_id = ObjectID(objID);
                        //console.log("8235 tryna get sceneObject: " + objID);
                        db.obj_items.findOne({"_id": oo_id}, function (err, obj_item) {
                            if (err || !obj_item) {
                                console.log("error getting obj items: " + err);
                                callbackz();
                            } else {
                                //
                                //console.log("8229 tryna find childObjectIDs: " + JSON.stringify(obj_item.childObjectIDs));                                
                                if (obj_item.audioEmit == null)
                                    obj_item.audioEmit = false;
                                if (obj_item.audioScale == null)
                                    obj_item.audioEmit = false;
                                obj_item.objectGroup = "none";
                                if (obj_item.childObjectIDs != null && obj_item.childObjectIDs.length > 0) {
                                    var childIDs = obj_item.childObjectIDs.map(convertStringToObjectID); //convert child IDs array to objIDs
                                    db.obj_items.find({_id : {$in : childIDs}}, function(err, obj_items) {

                                        if (err || !obj_items) {
                                            console.log("error getting childObject items: " + err);
                                            //res.send("error getting child objects");
                                            obj_item.objectGroup = "none";
                                            obj_item.assetUrl = s3.getSignedUrl('getObject', {Bucket: 'mvmv.us', Key: versionID + '/' + 'bundles_' + platformType + '/' + obj_item.assetname, Expires: 6000});
                                            objex.push(obj_item)
                                            callbackz();
                                        } else {
                                            childObjects = obj_items;
                                           // console.log("childObjects: " + JSON.stringify(childObjects));
                                            obj_item.childObjects = childObjects;
                                            obj_item.objectGroup = "none";
                                            obj_item.assetUrl = s3.getSignedUrl('getObject', {Bucket: 'mvmv.us', Key: versionID + '/' + 'bundles_' + platformType + '/' + obj_item.assetname, Expires: 6000});
                                            objex.push(obj_item)
                                            callbackz();
                                        }
                                    });
                                } else {
                                    obj_item.objectGroup = "none";
                                    obj_item.assetUrl = s3.getSignedUrl('getObject', {Bucket: 'mvmv.us', Key: versionID + '/' + 'bundles_' + platformType + '/' + obj_item.assetname, Expires: 6000});
                                    objex.push(obj_item)
                                    callbackz();
                                }
                                //

                            }
                        });
                    }, function(err) {
                       
                        if (err) {
                            
                            console.log('A file failed to process');
                            callback(null, objex);
                        } else {
                            console.log('objects have been added to scene.objex');
                            objectResponse = objex;
                            sceneResponse.sceneObjex = objectResponse;
                            callback(null, objex);
                        }
                    });
                } else {
                    // objectResponse = objex;
                    sceneResponse.sceneObjex = [];
                    callback(null, objex);
                }
            },
            function (objex, callback) { //inject username, last step (since only id is in scene doc)

                if ((sceneResponse.userName == null || sceneResponse.userName.length < 1) && (sceneResponse.user_id != null)) {

                    var oo_id = ObjectID(sceneResponse.user_id);
                    db.users.findOne({_id: oo_id}, function (err, user) {
                        if (!err || user != null) {
                            console.log("tryna inject usrname: " + user.userName);
                            sceneResponse.userName = user.userName;
                            callback(null);
                        }
                    });

                } else  {
                    callback(null);
                }
            }

        ], //waterfall end

        function (err, result) { // #last function, close async
            res.json(sceneResponse);
            console.log("waterfall done: " + result);
        }
    );
});


module.exports = unity_router;
