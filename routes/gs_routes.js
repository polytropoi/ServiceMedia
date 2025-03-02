///integrating the "Grab and Squeeze" server stuff...

import { createRequire } from "module";
const require = createRequire(import.meta.url);



const express = require("express");
const gs_router = express.Router();
// const entities = require("entities");
// const async = require('async');
// const cors = require('cors');
const ObjectID = require("bson-objectid");
const path = require("path");

import cors from "cors";

import { db, requiredAuthentication } from "../server.js";
// import { s3 } from "../server.js";
import { ReturnPresignedUrl, 
        CopyObject, 
        PutObject, 
        SendEmail, 
        GetObject, 
        ListObjects, 
        ReturnObjectExists, 
        ReturnObjectMetadata, 
        DeleteObject, 
        DeleteObjects, getExtension } from "../server.js";

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

gs_router.get("/test", function (req, res) {
    res.send("OK!");
});

var whitelist = ['https://smxr.net', 'https://servicemedia.net', 'http://localhost:3000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}



gs_router.get("/scrape_webpage/:pageurl", cors(corsOptions), requiredAuthentication, function (req, res) {
    let url = "https://" + req.params.pageurl;
    (async () => {
        console.log("tryna scrape " + url);
        let response = "";
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const override = Object.assign(page.viewport(), {width: 1024, height: 1024});
        await page.setViewport(override);
        await page.goto(url);
        const pagepic = await page.screenshot({fullPage: false});
        await sharp(pagepic)
        .resize({
          kernel: sharp.kernel.nearest,
          width: 1024,
          width: 1024,
          fit: 'fill'
        })
        .toBuffer()
        .then(data => {
            let buf = Buffer.from(data);
            let encodedData = buf.toString('base64');
            response = "<img src=\x22data:image/jpeg;base64," + encodedData +"\x22>";
            // console.log("response: " + response);
            // res.send(response);
        })
        .catch(err => {console.log(err); res.send(err);});
        await sharp(pagepic)
        .resize({
          kernel: sharp.kernel.nearest,
          width: 512,
          width: 512,
          fit: 'cover'
        })
        .toBuffer()
        .then(data => {
            let buf = Buffer.from(data);
            let encodedData = buf.toString('base64');
            response = response + "<img src=\x22data:image/jpeg;base64," + encodedData +"\x22>";
            // console.log("response: " + response);
            // res.send(response);
        })
        .catch(err => {console.log(err); res.send(err);});
        await sharp(pagepic)
        .resize({
          kernel: sharp.kernel.nearest,
          width: 256,
          width: 256,
          fit: 'cover'
        })
        .toBuffer()
        .then(data => {
            let buf = Buffer.from(data);
            let encodedData = buf.toString('base64');
            response = response + "<img src=\x22data:image/jpeg;base64," + encodedData +"\x22>";
            // console.log("response: " + response);
            res.send(response);
        })
        .catch(err => {console.log(err); res.send(err);});
        await browser.close();
    })();
});

gs_router.post("/scrapeweb_rt/", cors(corsOptions), requiredAuthentication, function (req, res) {
    
});

gs_router.post("/scrapeweb/", cors(corsOptions), requiredAuthentication, function (req, res) {
  // let url = req.body.pageurl;
  // let title = req.body.title;
  console.log("scrapeweb req with body "+ JSON.stringify(req.body));
  db.weblinks.findOne({ "_id" : ObjectID(req.body._id)}, function(err, link) {

    if (err || ! link) {
      console.log("no link found or error for " + req.body._id);
    } else {
      console.log("link: " + JSON.stringify(link));
    let url = link.link_url;
    (async () => {
        console.log("tryna scrape " + url);
        let response = "";
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const override = Object.assign(page.viewport(), {width: 1024, height: 1024});
        await page.setViewport(override);
        await page.goto(url);
        const pagepic = await page.screenshot({fullPage: false});
        await sharp(pagepic)
        .resize({
          kernel: sharp.kernel.nearest,
          width: 1024,
          width: 1024,
          fit: 'fill'
        })
        .toBuffer()
        .then(rdata => {
          s3.putObject({
            Bucket: process.env.WEBSCRAPE_BUCKET_NAME,
            Key: link._id + "/" + link._id + ".standard.jpg",
            Body: rdata,
            ContentType: 'image/jpg'
          }, function (error, resp) {
              if (error) {
                console.log('error putting  pic' + error);
                res.send(error);
              } else {
                // console.log("key : " +process.env.WEBSCRAPE_BUCKET_NAME + "/" + link._id + "/" + link._id + ".standard.jpg",)
                console.log('Successfully uploaded  pic with with response: ' + JSON.stringify(resp));
              }
          })
        })
        .catch(err => {console.log(err); res.send(err);});
        await sharp(pagepic)
        .resize({
          kernel: sharp.kernel.nearest,
          width: 512,
          width: 512,
          fit: 'cover'
        })
        .toBuffer()
        .then(rdata => {
          s3.putObject({
            Bucket: process.env.WEBSCRAPE_BUCKET_NAME,
            Key: link._id + "/" + link._id + ".half.jpg",
            Body: rdata,
            ContentType: 'image/jpg'
          }, function (error, resp) {
              if (error) {
                console.log('error putting  pic' + error);
              } else {
                console.log('Successfully uploaded  pic with response: ' + JSON.stringify(resp));
              }
          })
        })
        .catch(err => {console.log(err); res.send(err);});
        await sharp(pagepic)
        .resize({
          kernel: sharp.kernel.nearest,
          width: 128,
          width: 128,
          fit: 'cover'
        })
        .toBuffer()
        .then(rdata => {
          s3.putObject({
            Bucket: process.env.WEBSCRAPE_BUCKET_NAME,
            Key: link._id + "/" + link._id + ".thumb.jpg",
            Body: rdata,
            ContentType: 'image/jpg'
          }, function (error, resp) {
              if (error) {
                console.log('error putting  pic' + error);
              } else {
                console.log('Successfully uploaded  pic with response: ' + resp);
                
              }
          })
        
        })
        .catch(err => {console.log(err); res.send(err);});
        await browser.close();

      })();
      res.send("web scrape successful!");
    }
  });
});

// gs_router.post("/scrape_webpage/", function (req, res) {
//     if (validURL(req.body.pageurl)) {
//     let url = req.body.pageurl;
//     (async () => {
//         console.log("trina scrape...");
//         let response = "";
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();
//         const override = Object.assign(page.viewport(), {width: 1024, height: 1024});
//         await page.setViewport(override);
//         await page.goto(url);
//         const pagepic = await page.screenshot({fullPage: true});
//         await sharp(pagepic)
//         .resize({
//           kernel: sharp.kernel.nearest,
//           width: 1024,
//           width: 1024,
//           fit: 'fill'
//         })
//         .toBuffer()
//         .then(data => {
//             let buf = Buffer.from(data);
//             let encodedData = buf.toString('base64');
//             response = "<img src=\x22data:image/jpeg;base64," + encodedData +"\x22>";
//             // console.log("response: " + response);
//             res.send(response);
//         })
//         .catch(err => {console.log(err); res.send(err);});
//         await sharp(pagepic)
//         .resize({
//           kernel: sharp.kernel.nearest,
//           width: 512,
//           width: 512,
//           fit: 'cover'
//         })
//         .toBuffer()
//         .then(data => {
//             let buf = Buffer.from(data);
//             let encodedData = buf.toString('base64');
//             response = response + "<img src=\x22data:image/jpeg;base64," + encodedData +"\x22>";
//             // console.log("response: " + response);
//             res.send(response);
//         })
//         .catch(err => {console.log(err); res.send(err);});
//         await sharp(pagepic)
//         .resize({
//           kernel: sharp.kernel.nearest,
//           width: 256,
//           width: 256,
//           fit: 'cover'
//         })
//         .toBuffer()
//         .then(data => {
//             let buf = Buffer.from(data);
//             let encodedData = buf.toString('base64');
//             response = response + "<img src=\x22data:image/jpeg;base64," + encodedData +"\x22>";
//             // console.log("response: " + response);
//             res.send(response);
//         })
//         .catch(err => {console.log(err); res.send(err);});
//         await browser.close();
//         })();
//     } else {
//         res.send("invalid url");
//     }
// });

gs_router.get('/resize_uploaded_picture/:_id', cors(corsOptions), requiredAuthentication, function (req, res) { //presumes pic has already been uploaded to production folder and db entry made
    console.log("tryna resize pic with key: " + req.params._id);
    var o_id = ObjectID(req.params._id);
    db.image_items.findOne({"_id": o_id}, function(err, image) {
      if (err || !image) {
        console.log("error getting image item: " + err);
        callback("no image in db");
        res.send("no image in db");
      } else {
          let oKey = "users/" + image.userID + "/pictures/originals/" + image._id +".original."+image.filename;
          var params = {Bucket: process.env.ROOT_BUCKET_NAME, Key: oKey};
          let extension = getExtension(image.filename).toLowerCase();
          let contentType = 'image/jpeg';
          let format = 'jpg';
          if (extension == ".PNG" || extension == ".png") {
            contentType = 'image/png';
            format = 'png';
          }
          // s3.headObject(params, function (err, url) { //first check that the original file is in place
          //   if (err) {
          //       console.log(err);
          //       res.send("no image in bucket");
          //   } else {
            // if (err) {
            //     console.log(err);
            //     res.send("couldn't get no image data");
            // } else {
        (async () => { //do these jerbs one at a time..
        
        if (minioClient) {
            
            let key = "users/" + image.userID + "/pictures/originals/" + image._id +".original."+image.filename;
            let savedLocation = process.env.LOCAL_TEMP_FOLDER + image.filename;
            await DownloadMinioFile(process.env.ROOT_BUCKET_NAME, key, savedLocation)
            .then()
            .catch({if (err){return}});
            
            if (format == "jpg") {
              await sharp(process.env.LOCAL_TEMP_FOLDER + image.filename)
              .resize({
                kernel: sharp.kernel.nearest,
                height: 1024,
                width: 1024,
                fit: 'contain'
              })
              .extend({
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                background: { r: 0, g: 0, b: 0, alpha: 1 }
              })
              .toFormat(format)
              .toBuffer()
              .then(rdata => {
                minioClient.putObject(process.env.ROOT_BUCKET_NAME, "users/" + image.userID + "/pictures/" + image._id +".standard."+image.filename, rdata, function(err, objInfo) {
                  if(err) {
                      console.log("minioerr: " + err) // err should be null
                  } else {
                      console.log("Success with standard pic", objInfo)
                  }
                });
              })
              .catch(err => {console.log(err); res.send(err);});              
              await sharp(process.env.LOCAL_TEMP_FOLDER + image.filename)
              .resize({
                kernel: sharp.kernel.nearest,
                height: 512,
                width: 512,
                fit: 'contain'
              })
              .extend({
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                background: { r: 0, g: 0, b: 0, alpha: 1 }
              })
              .toFormat(format)
              .toBuffer()
              .then(rdata => {
                minioClient.putObject(process.env.ROOT_BUCKET_NAME, "users/" + image.userID + "/pictures/" + image._id +".half."+image.filename, rdata, function(err, objInfo) {
                  if(err) {
                      console.log("minioerr: " + err) // err should be null
                  } else {
                      console.log("Success with standard pic", objInfo)
                  }
                });
              })
              .catch(err => {console.log(err); res.send(err);});
              await sharp(process.env.LOCAL_TEMP_FOLDER + image.filename)
              .resize({
                kernel: sharp.kernel.nearest,
                height: 256,
                width: 256,
                fit: 'contain'
              })
              .extend({
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                background: { r: 0, g: 0, b: 0, alpha: 1 }
              })
              .toFormat(format)
              .toBuffer()
              .then(rdata => {
                minioClient.putObject(process.env.ROOT_BUCKET_NAME, "users/" + image.userID + "/pictures/" + image._id +".quarter."+image.filename, rdata, function(err, objInfo) {
                  if(err) {
                      console.log("minioerr: " + err) // err should be null
                  } else {
                      console.log("Success with standard pic", objInfo)
                  }
                });
              })
              .catch(err => {console.log(err); res.send(err);});
              await sharp(process.env.LOCAL_TEMP_FOLDER + image.filename)
              .resize({
                kernel: sharp.kernel.nearest,
                height: 128,
                width: 128,
                fit: 'contain'
              })
              .extend({
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                background: { r: 0, g: 0, b: 0, alpha: 1 }
              })
              .toFormat(format)
              .toBuffer()
              .then(rdata => {
                minioClient.putObject(process.env.ROOT_BUCKET_NAME, "users/" + image.userID + "/pictures/" + image._id +".thumb."+image.filename, rdata, function(err, objInfo) {
                  if(err) {
                      console.log("minioerr: " + err) // err should be null
                  } else {
                      console.log("Success with standard pic", objInfo)
                  }
                });
              })
              .catch(err => {console.log(err); res.send(err);});
              console.log("pics have been mangled!");  
              res.send("resize successful!");
              
            } else { //if png, keep bg transparent
              console.log("format != jpg");
              await sharp(process.env.LOCAL_TEMP_FOLDER + image.filename)
              .resize({
                kernel: sharp.kernel.nearest,
                height: 1024,
                width: 1024,
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
              })
              .toFormat(format)
              .toBuffer()
              .then(rdata => {
                minioClient.putObject(process.env.ROOT_BUCKET_NAME, "users/" + image.userID + "/pictures/" + image._id +".standard."+image.filename, rdata, function(err, objInfo) {
                  if(err) {
                      console.log("minioerr: " + err) // err should be null
                  } else {
                      console.log("Success with standard pic", objInfo)
                  }
                });
              })
              .catch(err => {console.log(err); res.send(err);});
              await sharp(process.env.LOCAL_TEMP_FOLDER + image.filename)
              .resize({
                kernel: sharp.kernel.nearest,
                height: 512,
                width: 512,
                fit: 'contain',
                ackground: { r: 0, g: 0, b: 0, alpha: 0 }
              })
              .toFormat(format)
              .toBuffer()
              .then(rdata => {
                minioClient.putObject(process.env.ROOT_BUCKET_NAME, "users/" + image.userID + "/pictures/" + image._id +".half."+image.filename, rdata, function(err, objInfo) {
                  if(err) {
                      console.log("minioerr: " + err) // err should be null
                  } else {
                      console.log("Success with standard pic", objInfo)
                  }
                });
              })
              .catch(err => {console.log(err); res.send(err);});
              await sharp(process.env.LOCAL_TEMP_FOLDER + image.filename)
              .resize({
                kernel: sharp.kernel.nearest,
                height: 256,
                width: 256,
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
              })
              .toFormat(format)
              .toBuffer()
              .then(rdata => {
                minioClient.putObject(process.env.ROOT_BUCKET_NAME, "users/" + image.userID + "/pictures/" + image._id +".quarter."+image.filename, rdata, function(err, objInfo) {
                  if(err) {
                      console.log("minioerr: " + err) // err should be null
                  } else {
                      console.log("Success with standard pic", objInfo)
                  }
                });
              })
              .catch(err => {console.log(err); res.send(err);});
              await sharp(process.env.LOCAL_TEMP_FOLDER + image.filename)
              .resize({
                kernel: sharp.kernel.nearest,
                height: 128,
                width: 128,
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
              })
              .toFormat(format)
              .toBuffer()
              .then(rdata => {
                minioClient.putObject(process.env.ROOT_BUCKET_NAME, "users/" + image.userID + "/pictures/" + image._id +".thumb."+image.filename, rdata, function(err, objInfo) {
                  if(err) {
                      console.log("minioerr: " + err) // err should be null
                  } else {
                      console.log("Success with standard pic", objInfo)
                  }
                });
              })
              .catch(err => {console.log(err); res.send(err);});
              console.log("pics have been mangled!");
              res.send("resize successful!");
            }

        } else { /////////////////--------- s3 mode below..
            // let data = await s3.getObject(params).promise();
            const data = await GetObject(process.env.ROOT_BUCKET_NAME, params.Key)
            if (format == 'jpg') {
            await sharp(data.Body)
            .resize({
              kernel: sharp.kernel.nearest,
              height: 1024,
              width: 1024,
              fit: 'contain'
            })
            .extend({
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              background: { r: 0, g: 0, b: 0, alpha: 1 }
            })
            .toFormat(format)
            .toBuffer()
            .then(rdata => {
                s3.putObject({
                  Bucket: process.env.ROOT_BUCKET_NAME,
                  Key: "users/" + image.userID + "/pictures/" + image._id +".standard."+image.filename,
                  Body: rdata,
                  ContentType: contentType
                }, function (error, resp) {
                    if (error) {
                      console.log('error putting  pic' + error);
                    } else {
                      console.log('Successfully uploaded  pic with response: ' + resp);
                    }
                })
              // }
            })
            .catch(err => {console.log(err); res.send(err);});

            await sharp(data.Body)
            .resize({
              kernel: sharp.kernel.nearest,
              height: 512,
              width: 512,
              fit: 'contain'
            })
            .extend({
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              background: { r: 0, g: 0, b: 0, alpha: 1 }
            })
            .toFormat(format)
            .toBuffer()
            .then(rdata => {
                s3.putObject({
                    Bucket: process.env.ROOT_BUCKET_NAME,
                    Key: "users/" + image.userID + "/pictures/" + image._id +".half."+image.filename,
                    Body: rdata,
                    ContentType: contentType
                  }, function (error, resp) {
                    if (error) {
                      console.log('error putting  pic' + error);
                    } else {
                      console.log('Successfully uploaded  pic with response: ' + resp);
                    }
                })
              })
            .catch(err => {console.log(err); res.send(err);});
            await sharp(data.Body)
            .resize({
              kernel: sharp.kernel.nearest,
              height: 256,
              width: 256,
              fit: 'contain'
            })
            .extend({
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              background: { r: 0, g: 0, b: 0, alpha: 1 }
            })
            .toFormat(format)
            .toBuffer()
            .then(rdata => {
                // let buf = Buffer.from(rdata);
                // let encodedData = rdata.toString('base64');
                s3.putObject({
                    Bucket: process.env.ROOT_BUCKET_NAME,
                    Key: "users/" + image.userID + "/pictures/" + image._id +".quarter."+image.filename,
                    Body: rdata,
                    ContentType: contentType
                  }, function (error, resp) {
                    if (error) {
                      console.log('error putting  pic' + error);
                    } else {
                      console.log('Successfully uploaded  pic with response: ' + resp);
                    }
                })
              })
            .catch(err => {console.log(err); res.send(err);});
            await sharp(data.Body)
            .resize({
              kernel: sharp.kernel.nearest,
              height: 128,
              width: 128,
              fit: 'contain'
            })
            .extend({
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              background: { r: 0, g: 0, b: 0, alpha: 1 }
            })
            .toFormat(format)
            .toBuffer()
            .then(rdata => {
                s3.putObject({
                    Bucket: process.env.ROOT_BUCKET_NAME,
                    Key: "users/" + image.userID + "/pictures/" + image._id +".thumb."+image.filename,
                    Body: rdata,
                    ContentType: contentType
                  }, function (error, resp) {
                    if (error) {
                      console.log('error putting  pic' + error);
                    } else {
                      console.log('Successfully uploaded  pic with response: ' + resp);
                    }
                })
              })
            .catch(err => {console.log(err); res.send(err);});
            console.log("pics have been mangled!");  
            res.send("resize successful!");
            
          } else { //if png, keep bg transparent
            console.log("format != jpg");
            await sharp(data.Body)
            .resize({
              kernel: sharp.kernel.nearest,
              height: 1024,
              width: 1024,
              fit: 'contain',
              background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .toFormat(format)
            .toBuffer()
            .then(rdata => {
                  s3.putObject({
                    Bucket: process.env.ROOT_BUCKET_NAME,
                    Key: "users/" + image.userID + "/pictures/" + image._id +".standard."+image.filename,
                    Body: rdata,
                    ContentType: contentType
                  }, function (error, resp) {
                      if (error) {
                        console.log('error putting  pic' + error);
                      } else {
                        console.log('Successfully uploaded  pic with response: ' + resp);
                      }
                  })
                })
            .catch(err => {console.log(err); res.send(err);});
            await sharp(data.Body)
            .resize({
              kernel: sharp.kernel.nearest,
              height: 512,
              width: 512,
              fit: 'contain',
              ackground: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .toFormat(format)
            .toBuffer()
            .then(rdata => {
                s3.putObject({
                    Bucket: process.env.ROOT_BUCKET_NAME,
                    Key: "users/" + image.userID + "/pictures/" + image._id +".half."+image.filename,
                    Body: rdata,
                    ContentType: contentType
                  }, function (error, resp) {
                    if (error) {
                      console.log('error putting  pic' + error);
                    } else {
                      console.log('Successfully uploaded  pic with response: ' + resp);
                    }
                })
              })
            .catch(err => {console.log(err); res.send(err);});
            await sharp(data.Body)
            .resize({
              kernel: sharp.kernel.nearest,
              height: 256,
              width: 256,
              fit: 'contain',
              background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .toFormat(format)
            .toBuffer()
            .then(rdata => {
                // let buf = Buffer.from(rdata);
                // let encodedData = rdata.toString('base64');
                s3.putObject({
                    Bucket: process.env.ROOT_BUCKET_NAME,
                    Key: "users/" + image.userID + "/pictures/" + image._id +".quarter."+image.filename,
                    Body: rdata,
                    ContentType: contentType
                  }, function (error, resp) {
                    if (error) {
                      console.log('error putting  pic' + error);
                    } else {
                      console.log('Successfully uploaded  pic with response: ' + resp);
                    }
                })
              })
            .catch(err => {console.log(err); res.send(err);});
            await sharp(data.Body)
            .resize({
              kernel: sharp.kernel.nearest,
              height: 128,
              width: 128,
              fit: 'contain',
              background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .toFormat(format)
            .toBuffer()
            .then(rdata => {
                s3.putObject({
                    Bucket: process.env.ROOT_BUCKET_NAME,
                    Key: "users/" + image.userID + "/pictures/" + image._id +".thumb."+image.filename,
                    Body: rdata,
                    ContentType: contentType
                  }, function (error, resp) {
                    if (error) {
                      console.log('error putting  pic' + error);
                    } else {
                      console.log('Successfully uploaded  pic with response: ' + resp);
                    }
                })
              })
            .catch(err => {console.log(err); res.send(err);});
            console.log("pics have been mangled!");
            res.send("resize successful!");
          
            }
          }
        })();//end async
        }
      });
  });
      

gs_router.get('/resize_uploaded_picture_old/:_id', cors(corsOptions), requiredAuthentication, function (req, res) { //presumes pic has already been uploaded to production folder and db entry made
  console.log("tryna resize pic with key: " + req.params._id);
  var o_id = ObjectID(req.params._id);
  db.image_items.findOne({"_id": o_id}, function(err, image) {
      if (err || !image) {
          console.log("error getting image item: " + err);
          callback("no image in db");
          res.send("no image in db");
      } else {
          var params = {Bucket: process.env.ROOT_BUCKET_NAME, Key: "users/" + image.userID + "/pictures/originals/" + image._id +".original."+image.filename};
          let extension = getExtension(image.filename).toLowerCase();
          let contentType = 'image/jpeg';
          let format = 'jpg';
          if (extension == ".PNG" || extension == ".png") {
            contentType = 'image/png';
            format = 'png';
          }
          s3.headObject(params, function (err, url) { //first check that the original file is in place
            if (err) {
                console.log(err);
                res.send("no image in bucket");
            } else {
            // if (err) {
            //     console.log(err);
            //     res.send("couldn't get no image data");
            // } else {
                (async () => { //do these jerbs one at a time..
                  // console.log
                  
                let data = await s3.getObject(params).promise();
                if (format == 'jpg') {
                await sharp(data.Body)
                .resize({
                  kernel: sharp.kernel.nearest,
                  height: 1024,
                  width: 1024,
                  fit: 'contain'
                })
                .extend({
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: { r: 0, g: 0, b: 0, alpha: 1 }
                })
                .toFormat(format)
                .toBuffer()
                .then(rdata => {
                    s3.putObject({
                      Bucket: process.env.ROOT_BUCKET_NAME,
                      Key: "users/" + image.userID + "/pictures/" + image._id +".standard."+image.filename,
                      Body: rdata,
                      ContentType: contentType
                    }, function (error, resp) {
                        if (error) {
                          console.log('error putting  pic' + error);
                        } else {
                          console.log('Successfully uploaded  pic with response: ' + resp);
                        }
                    })
                  // }
                })
                .catch(err => {console.log(err); res.send(err);});

                await sharp(data.Body)
                .resize({
                  kernel: sharp.kernel.nearest,
                  height: 512,
                  width: 512,
                  fit: 'contain'
                })
                .extend({
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: { r: 0, g: 0, b: 0, alpha: 1 }
                })
                .toFormat(format)
                .toBuffer()
                .then(rdata => {
                    s3.putObject({
                        Bucket: process.env.ROOT_BUCKET_NAME,
                        Key: "users/" + image.userID + "/pictures/" + image._id +".half."+image.filename,
                        Body: rdata,
                        ContentType: contentType
                      }, function (error, resp) {
                        if (error) {
                          console.log('error putting  pic' + error);
                        } else {
                          console.log('Successfully uploaded  pic with response: ' + resp);
                        }
                    })
                  })
                .catch(err => {console.log(err); res.send(err);});
                await sharp(data.Body)
                .resize({
                  kernel: sharp.kernel.nearest,
                  height: 256,
                  width: 256,
                  fit: 'contain'
                })
                .extend({
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: { r: 0, g: 0, b: 0, alpha: 1 }
                })
                .toFormat(format)
                .toBuffer()
                .then(rdata => {
                    // let buf = Buffer.from(rdata);
                    // let encodedData = rdata.toString('base64');
                    s3.putObject({
                        Bucket: process.env.ROOT_BUCKET_NAME,
                        Key: "users/" + image.userID + "/pictures/" + image._id +".quarter."+image.filename,
                        Body: rdata,
                        ContentType: contentType
                      }, function (error, resp) {
                        if (error) {
                          console.log('error putting  pic' + error);
                        } else {
                          console.log('Successfully uploaded  pic with response: ' + resp);
                        }
                    })
                  })
                .catch(err => {console.log(err); res.send(err);});
                await sharp(data.Body)
                .resize({
                  kernel: sharp.kernel.nearest,
                  height: 128,
                  width: 128,
                  fit: 'contain'
                })
                .extend({
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: { r: 0, g: 0, b: 0, alpha: 1 }
                })
                .toFormat(format)
                .toBuffer()
                .then(rdata => {
                    // let buf = Buffer.from(rdata);
                    // let encodedData = rdata.toString('base64');
                    s3.putObject({
                        Bucket: process.env.ROOT_BUCKET_NAME,
                        Key: "users/" + image.userID + "/pictures/" + image._id +".thumb."+image.filename,
                        Body: rdata,
                        ContentType: contentType
                      }, function (error, resp) {
                        if (error) {
                          console.log('error putting  pic' + error);
                        } else {
                          console.log('Successfully uploaded  pic with response: ' + resp);
                        }
                    })
                  })
                .catch(err => {console.log(err); res.send(err);});
                console.log("pics have been mangled!");  
                res.send("resize successful!");
                
              } else { //if png, keep bg transparent
                console.log("format != jpg");
                await sharp(data.Body)
                .resize({
                  kernel: sharp.kernel.nearest,
                  height: 1024,
                  width: 1024,
                  fit: 'contain',
                  background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .toFormat(format)
                .toBuffer()
                .then(rdata => {
                      s3.putObject({
                        Bucket: process.env.ROOT_BUCKET_NAME,
                        Key: "users/" + image.userID + "/pictures/" + image._id +".standard."+image.filename,
                        Body: rdata,
                        ContentType: contentType
                      }, function (error, resp) {
                          if (error) {
                            console.log('error putting  pic' + error);
                          } else {
                            console.log('Successfully uploaded  pic with response: ' + resp);
                          }
                      })
                    })
                .catch(err => {console.log(err); res.send(err);});
                await sharp(data.Body)
                .resize({
                  kernel: sharp.kernel.nearest,
                  height: 512,
                  width: 512,
                  fit: 'contain',
                  ackground: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .toFormat(format)
                .toBuffer()
                .then(rdata => {
                    s3.putObject({
                        Bucket: process.env.ROOT_BUCKET_NAME,
                        Key: "users/" + image.userID + "/pictures/" + image._id +".half."+image.filename,
                        Body: rdata,
                        ContentType: contentType
                      }, function (error, resp) {
                        if (error) {
                          console.log('error putting  pic' + error);
                        } else {
                          console.log('Successfully uploaded  pic with response: ' + resp);
                        }
                    })
                  })
                .catch(err => {console.log(err); res.send(err);});
                await sharp(data.Body)
                .resize({
                  kernel: sharp.kernel.nearest,
                  height: 256,
                  width: 256,
                  fit: 'contain',
                  background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .toFormat(format)
                .toBuffer()
                .then(rdata => {
                    // let buf = Buffer.from(rdata);
                    // let encodedData = rdata.toString('base64');
                    s3.putObject({
                        Bucket: process.env.ROOT_BUCKET_NAME,
                        Key: "users/" + image.userID + "/pictures/" + image._id +".quarter."+image.filename,
                        Body: rdata,
                        ContentType: contentType
                      }, function (error, resp) {
                        if (error) {
                          console.log('error putting  pic' + error);
                        } else {
                          console.log('Successfully uploaded  pic with response: ' + resp);
                        }
                    })
                  })
                .catch(err => {console.log(err); res.send(err);});
                await sharp(data.Body)
                .resize({
                  kernel: sharp.kernel.nearest,
                  height: 128,
                  width: 128,
                  fit: 'contain',
                  background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .toFormat(format)
                .toBuffer()
                .then(rdata => {
                    // let buf = Buffer.from(rdata);
                    // let encodedData = rdata.toString('base64');
                    
                    s3.putObject({
                        Bucket: process.env.ROOT_BUCKET_NAME,
                        Key: "users/" + image.userID + "/pictures/" + image._id +".thumb."+image.filename,
                        Body: rdata,
                        ContentType: contentType
                      }, function (error, resp) {
                        if (error) {
                          console.log('error putting  pic' + error);
                        } else {
                          console.log('Successfully uploaded  pic with response: ' + resp);
                        }
                    })
                  })
                .catch(err => {console.log(err); res.send(err);});
                console.log("pics have been mangled!");
                res.send("resize successful!");
              
              }

              })();//end async
              
                // }
              }
          });
          console.log("returning image item : " + JSON.stringify(image));
      }
  });
});

async function getFilesRecursivelySub(param) { //function to get all keys from bucket, not just 1000
  // Call the function to get list of items from S3.
  let result = await s3.listObjectsV2(param).promise();

  if(!result.IsTruncated) { //i.e. < 1000
      // Recursive terminating condition.
      return result.Contents;
  } else {
      // Recurse it if results are truncated.
      param.ContinuationToken = result.NextContinuationToken;
      return result.Contents.concat(await getFilesRecursivelySub(param));
  }
}
gs_router.get("/update_s3_picturepaths/:_id", function (req,res) {
  var params = {
    Bucket: process.env.ROOT_BUCKET_NAME,
    Prefix: 'users/' + req.params._id + '/'
  }
  getFilesRecursively();
  async function getFilesRecursively() {  
    let response = await getFilesRecursivelySub(params); //gimme all the things, even > 1000!
    let oKeys = [];
    let nKeys = [];
      response.forEach((elem) => { //no need to async?
          let keySplit = elem.Key.split("/");
          let filename = keySplit[keySplit.length - 1];
            if (((elem.Key.includes(".jpg") || elem.Key.includes(".png"))) && elem.Key.includes(".original.") && !elem.Key.includes("/pictures/originals/")) {
              oKeys = oKeys.concat(elem.Key);
              s3.headObject({Bucket: process.env.ROOT_BUCKET_NAME, Key: 'users/' + req.params._id + '/pictures/originals/' + filename}, function(err, data) { //where it should be
                if (err) { //object isn't in proper folder, copy it over
                console.log("need to copy " + filename);  
                s3.copyObject({CopySource: process.env.ROOT_BUCKET_NAME + '/' + elem.Key, Bucket: process.env.ROOT_BUCKET_NAME, Key: 'users/' + req.params._id + '/pictures/originals/' + filename }, function (err,data){
                    if (err) {
                      console.log("ERROR copyObject");
                      console.log(err);
                    }
                    else {
                      console.log('SUCCESS copyObject');
                    }
                  });
                } else {
                  console.log("found original, no need to copy" + filename);
                }
              });
            } else if (((elem.Key.includes(".jpg") || (elem.Key.includes(".png"))) && !elem.Key.includes("/pictures/originals/") && !elem.Key.includes(".original.") && !elem.Key.includes(".standard.") && !elem.Key.includes(".quarter.") && !elem.Key.includes(".half.") && !elem.Key.includes(".thumb."))) {
              s3.headObject({ Bucket: process.env.ROOT_BUCKET_NAME, Key: 'users/' + req.params._id + '/pictures/originals/' + filename }, function(err, data) { 
                if (err) { //object isn't in proper folder, copy it over
                    console.log("need to copy " + filename);
                    s3.copyObject({CopySource: process.env.ROOT_BUCKET_NAME + '/' + elem.Key, Bucket: process.env.ROOT_BUCKET_NAME, Key: 'users/' + req.params._id + '/pictures/originals/' + filename }, function (err,data){
                      if (err) {
                        console.log("ERROR copyObject");
                        console.log(err);
                      }
                      else {
                        console.log('SUCCESS copyObject');
                      }
                    });
                  } else {
                    console.log("found original, no need to copy" + filename);
                  }
                // oKeys = oKeys.concat(elem.Key);
              });
            } else if (((elem.Key.includes(".jpg") || (elem.Key.includes(".png"))) && !elem.Key.includes("/pictures/originals/") && !elem.Key.includes(".original.") && (elem.Key.includes(".standard.") || elem.Key.includes(".quarter.") || elem.Key.includes(".half.") || elem.Key.includes(".thumb.")))) {
              s3.headObject({ Bucket: process.env.ROOT_BUCKET_NAME, Key: 'users/' + req.params._id + '/pictures/' + filename }, function(err, data) { 
                if (err) { //object isn't in proper folder, copy it over
                    console.log("need to copy " + filename);
                    s3.copyObject({CopySource: process.env.ROOT_BUCKET_NAME + '/' + elem.Key, Bucket: process.env.ROOT_BUCKET_NAME, Key: 'users/' + req.params._id + '/pictures/' + filename }, function (err,data){
                      if (err) {
                        console.log("ERROR copyObject");
                        console.log(err);
                      }
                      else {
                        console.log('SUCCESS copyObject');
                      }
                    });
                  } else {
                    console.log("found previous, no need to copy" + filename);
                  }
                // oKeys = oKeys.concat(elem.Key);
              });
            }  else if (((elem.Key.includes(".png"))) && !elem.Key.includes("/pictures/originals/") && !elem.Key.includes(".original.")) { //these are the old waveform pngs, din't have no other identifires
              s3.headObject({ Bucket: process.env.ROOT_BUCKET_NAME, Key: 'users/' + req.params._id + '/pictures/' + filename }, function(err, data) { 
                if (err) { //object isn't in proper folder, copy it over
                    console.log("need to copy " + filename);
                    s3.copyObject({CopySource: process.env.ROOT_BUCKET_NAME + '/' + elem.Key, Bucket: process.env.ROOT_BUCKET_NAME, Key: 'users/' + req.params._id + '/pictures/' + filename }, function (err,data){
                      if (err) {
                        console.log("ERROR copyObject");
                        console.log(err);
                      }
                      else {
                        console.log('SUCCESS copyObject');
                      }
                    });
                  } else {
                    console.log("found previous, no need to copy" + filename);
                  }
                // oKeys = oKeys.concat(elem.Key);
              });
            }
          });
    res.send(oKeys);
  }
});

gs_router.get("/update_s3_cubemappaths/:_id", function (req,res) {
    var params = {
      Bucket: 'archive1',
      Prefix: 'staging/' + req.params._id + '/cubemaps/'
    }
    getFilesRecursively();
    async function getFilesRecursively() {  
      let response = await getFilesRecursivelySub(params); //gimme all the things, even > 1000!
      let oKeys = [];
      let nKeys = [];
        response.forEach((elem) => { //no need to async?
            let keySplit = elem.Key.split("/");
            let filename = keySplit[keySplit.length - 1];
            s3.headObject({Bucket: 'servicemedia', Key: 'users/' + req.params._id + '/cubemaps/' + filename}, function(err, data) { //where it should be
              if (err) { //object isn't in proper folder, copy it over
              console.log("need to copy " + elem.Key);  
              s3.copyObject({CopySource: 'archive1' + '/' + elem.Key, Bucket: 'servicemedia', Key: 'users/' + req.params._id + '/cubemaps/' + filename }, function (err,data){
                  if (err) {
                    console.log("ERROR copyObject");
                    console.log(err);
                  }
                  else {
                    console.log('SUCCESS copyObject');
                  }
                });
              } else {
                console.log("found original, no need to copy" + filename);
              }
            });
            oKeys = oKeys.concat(filename);
            });
      res.send(oKeys);
    }
});
gs_router.get("/update_s3_stagingpaths/:_id", function (req,res) {
  var params = {
    Bucket: 'archive1',
    Prefix: 'staging/' + req.params._id
  }
  getFilesRecursively();
  async function getFilesRecursively() {  
    let response = await getFilesRecursivelySub(params); //gimme all the things, even > 1000!
    let oKeys = [];
    let nKeys = [];
      response.forEach((elem) => { //no need to async?
          let keySplit = elem.Key.split("/");
          let filename = keySplit[keySplit.length - 1];
          if (!elem.Key.includes("cubemaps")) {
          s3.headObject({Bucket: 'servicemedia', Key: 'users/' + req.params._id + '/staging/' + filename}, function(err, data) { //where it should be
            if (err) { //object isn't in proper folder, copy it over
            console.log("need to copy " + elem.Key);  
            s3.copyObject({CopySource: 'archive1' + '/' + elem.Key, Bucket: 'servicemedia', Key: 'users/' + req.params._id + '/staging/' + filename }, function (err,data){
                if (err) {
                  console.log("ERROR copyObject");
                  console.log(err);
                }
                else {
                  console.log('SUCCESS copyObject');
                }
              });
            } else {
              console.log("found original, no need to copy" + filename);
            }
          });
          oKeys = oKeys.concat(filename);
          }  
        });
    res.send(oKeys);
  }
});


gs_router.get("/update_s3_videopaths/:_id", function (req,res) {
  var params = {
    Bucket: process.env.ROOT_BUCKET_NAME,
    Prefix: 'users/' + req.params._id + '/'
  }
  getFilesRecursively();
  async function getFilesRecursively() {  
    let response = await getFilesRecursivelySub(params); //gimme all the things, even > 1000!
    let oKeys = [];
    let nKeys = [];
      response.forEach((elem) => { //no need to async?
          let keySplit = elem.Key.split("/");
          let filename = keySplit[keySplit.length - 1];
          let videoIDSplit = filename.split(".");
          let videoID = videoIDSplit[0]; 
          if (elem.Key.toLowerCase().includes(".mp4") || elem.Key.toLowerCase().includes(".mov") ||  elem.Key.toLowerCase().includes(".mkv") ||  elem.Key.toLowerCase().includes(".webm")) {
            s3.headObject({Bucket: process.env.ROOT_BUCKET_NAME, Key: 'users/' + req.params._id + '/video/'+videoID+'/' + filename}, function(err, data) { //where it should be
              if (err) { //object isn't in proper folder, copy it over
              console.log("need to copy " + filename + " " + videoID);  
              s3.copyObject({CopySource: process.env.ROOT_BUCKET_NAME + '/' + elem.Key, Bucket: process.env.ROOT_BUCKET_NAME, Key: 'users/' + req.params._id + '/video/'+videoID+'/' + filename }, function (err,data){
                  if (err) {
                    console.log("ERROR copyObject");
                    console.log(err);
                  }
                  else {
                    console.log('SUCCESS copyObject');
                  }
                });
              } else {
                console.log("found original, no need to copy" + filename);
              }
            });
            oKeys = oKeys.concat(filename);
          } 
          });
    res.send(oKeys);
  }
});


gs_router.get('/process_audio_download/:_id', cors(corsOptions), requiredAuthentication, function (req, res) { //download before processing, instead of streaming it// combined minio/s3 version
  console.log("tryna process audio : " + req.params._id);
  var o_id = ObjectID(req.params._id);
  db.audio_items.findOne({"_id": o_id}, function(err, audio_item) {
    if (err || !audio_item) {
        console.log("error getting audio item: " + err);
        callback("no audio in db");
        res.send("no audio in db");
    } else {
      console.log(JSON.stringify(audio_item));
      var params = {Bucket: process.env.ROOT_BUCKET_NAME, Key: 'users/' + audio_item.userID + '/audio/originals/' + audio_item._id + ".original." + audio_item.filename};

          (async () => {
            let hasSentResponse = false;
            if (minioClient) {
              // let downloadpath = process.env.LOCAL_TEMP_FOLDER;
              // let filename = audio_item._id +"."+ audio_item.filename;
              // if (!fs.existsSync(downloadpath)){
              //   console.log("creating directory " + downloadpath); 
              // await fs.promises.mkdir(downloadpath).then().catch({if (err){return}});
              let key = 'users/' + audio_item.userID + '/audio/originals/' + audio_item._id + ".original." + audio_item.filename;
              let savedLocation = process.env.LOCAL_TEMP_FOLDER + audio_item.filename;
              await DownloadMinioFile(process.env.ROOT_BUCKET_NAME, key, savedLocation);
              ffmpeg(fs.createReadStream(savedLocation))
              .setFfmpegPath(ffmpeg_static)
              
              .output(process.env.LOCAL_TEMP_FOLDER + 'tmp.png')            
              .complexFilter(
                [
                    '[0:a]aformat=channel_layouts=mono,showwavespic=s=600x200'
                ]
              )
              .outputOptions(['-vframes 1'])
              // .format('png')

              .output(process.env.LOCAL_TEMP_FOLDER + 'tmp.ogg')
              .audioBitrate(192)
              .audioCodec('libvorbis')
              .format('ogg')

              .output(process.env.LOCAL_TEMP_FOLDER + 'tmp.mp3')
              .audioBitrate(192)
              .audioCodec('libmp3lame')
              .format('mp3')

              .on('end', () => {
                  console.log("done squeezin audio");
                  minioClient.putObject(process.env.ROOT_BUCKET_NAME, "users/" + audio_item.userID + "/audio/" + audio_item._id +"."+path.parse(audio_item.filename).name + ".ogg", fs.readFileSync(process.env.LOCAL_TEMP_FOLDER + 'tmp.ogg'), function(err, objInfo) {
                    if(err) {
                        console.log("minioerr: " + err) // err should be null
                    } else {
                        console.log("Success with ogg version", objInfo)
                    }
                  });

                  minioClient.putObject(process.env.ROOT_BUCKET_NAME, "users/" + audio_item.userID + "/audio/" + audio_item._id +"."+path.parse(audio_item.filename).name + ".mp3", fs.readFileSync(process.env.LOCAL_TEMP_FOLDER + 'tmp.mp3'), function(err, objInfo) {
                    if(err) {
                        console.log("minioerr: " + err) // err should be null
                    } else {
                        console.log("Success with mp3 version", objInfo)
                    }
                  });

                  minioClient.putObject(process.env.ROOT_BUCKET_NAME, "users/" + audio_item.userID + "/audio/" + audio_item._id +"."+path.parse(audio_item.filename).name + ".png", fs.readFileSync(process.env.LOCAL_TEMP_FOLDER + 'tmp.png'), function(err, objInfo) {
                    if(err) {
                        console.log("minioerr: " + err) // err should be null
                    } else {
                        console.log("Success with waveform png", objInfo)
                    }
                  });
                  res.send("processed and uploading..");
              })
              .on('error', err => {
                  console.error(err);
                  res.send("error! " + err);
              })
              .on('progress', function(info) {
                  console.log('progress ' + JSON.stringify(info));
                  if (!hasSentResponse) {
                    hasSentResponse = true;
                    // res.send("processing!");
                  }
              })
              // .on('end', function() {
              //   console.log('Finished processing');
              //   res.send("processing complete!");
              // })
              .run();

            } else { // !minio
              s3.headObject(params, function(err, data) { //where it should be
                if (err) { //object isn't in proper folder, copy it over
                  console.log("dint find nothin at s3 like that...");
                } else {
                  console.log("found original, mtryna download " + audio_item.filename);
                  hasSentResponse = false;
                }
              });
              // var params = {Bucket: process.env.ROOT_BUCKET_NAME, Key: 'users/' + audio_item.userID + '/audio/originals/' + audio_item._id + ".original." + audio_item.filename};
              let downloadpath = process.env.LOCAL_TEMP_FOLDER + audio_item._id;
              let filename = audio_item._id +"."+ audio_item.filename;
              // if (!fs.existsSync(downloadpath)){
              //   console.log("creating directory " + downloadpath); 
              await fs.promises.mkdir(downloadpath).then().catch({if (err){return}});
              // }
              // let savepath = downloadpath + 'output.m3u8';
              // console.log("tryna save audio to " + savepath);
                  // await fs.promises.mkdir(downloadpath).then().catch({if (err){return}});
                  // let data = await s3.getObject(params).promise().then().catch({if (err){return}});
                  // await fs.promises.writeFile(downloadpath + filename, data).then().catch({if (err){return}});
              // let data = await s3.getObject(params).createReadStream();
              await DownloadS3File(params, downloadpath + filename).then().catch({if (err){return}});
              console.log("file downloaded " + downloadpath + filename);
              ffmpeg(fs.createReadStream(downloadpath + filename))
              .setFfmpegPath(ffmpeg_static)
              
              .output(process.env.LOCAL_TEMP_FOLDER + audio_item._id + 'tmp.png')            
              .complexFilter(
                [
                    '[0:a]aformat=channel_layouts=mono,showwavespic=s=600x200'
                ]
              )
              .outputOptions(['-vframes 1'])
              // .format('png')

              .output(process.env.LOCAL_TEMP_FOLDER + audio_item._id + 'tmp.ogg')
              .audioBitrate(192)
              .audioCodec('libvorbis')
              .format('ogg')

              .output(process.env.LOCAL_TEMP_FOLDER + audio_item._id + 'tmp.mp3')
              .audioBitrate(192)
              .audioCodec('libmp3lame')
              .format('mp3')

              .on('end', () => {
                  console.log("done squeezin audio");
                  s3.putObject({
                    Bucket: process.env.ROOT_BUCKET_NAME,
                    Key: "users/" + audio_item.userID + "/audio/" + audio_item._id +"."+path.parse(audio_item.filename).name + ".ogg",
                    Body: fs.readFileSync(process.env.LOCAL_TEMP_FOLDER + audio_item._id + 'tmp.ogg'),
                    ContentType: 'audio/ogg'
                    }, function (error, resp) {
                      if (error) {
                        console.log('error putting  pic' + error);
                      } else {
                        console.log('Successfully uploaded  ogg with response: ' + JSON.stringify(resp));
                        fs.unlinkSync(process.env.LOCAL_TEMP_FOLDER + audio_item._id + 'tmp.ogg');
                      }
                  });
                  s3.putObject({
                    Bucket: process.env.ROOT_BUCKET_NAME,
                    Key: "users/" + audio_item.userID + "/audio/" + audio_item._id +"."+path.parse(audio_item.filename).name + ".mp3",
                    Body: fs.readFileSync(process.env.LOCAL_TEMP_FOLDER + audio_item._id + 'tmp.mp3'),
                    ContentType: 'audio/mp3'
                    }, function (error, resp) {
                      if (error) {
                        console.log('error putting  pic' + error);
                      } else {
                        console.log('Successfully uploaded mp3 with response: ' + JSON.stringify(resp));
                        fs.unlinkSync(process.env.LOCAL_TEMP_FOLDER + audio_item._id + 'tmp.mp3');
                      }
                  });
                  s3.putObject({
                    Bucket: process.env.ROOT_BUCKET_NAME,
                    Key: "users/" + audio_item.userID + "/audio/" + audio_item._id +"."+path.parse(audio_item.filename).name + ".png",
                    Body: fs.readFileSync(process.env.LOCAL_TEMP_FOLDER + audio_item._id + 'tmp.png'),
                    ContentType: 'image/png'
                  }, function (error, resp) {
                    if (error) {
                      console.log('error putting  pic' + error);
                    } else {
                      console.log('Successfully uploaded png with response: ' + JSON.stringify(resp));
                      fs.unlinkSync(process.env.LOCAL_TEMP_FOLDER + audio_item._id + 'tmp.png');
                    }
                });
                res.send("processed and uploading..");
              })
              .on('progress', progress => {
                // HERE IS THE CURRENT TIME
                // const time = parseInt(progress.timemark.replace(/:/g, ''));
          
                // AND HERE IS THE CALCULATION
                // const percent = (time / totalTime) * 100;
                    
                console.log("processing: " + progress.timemark);
              })
              .on('error', err => {
                  console.error(err);
                  res.send("error! " + err);
              })
              // .on('progress', function(info) {
              //     console.log('progress ' + JSON.stringify(info));
              //     if (!hasSentResponse) {
              //       hasSentResponse = true;
              //       res.send("processing!");
              //     }
              // })
              .run();
          } //!minio close
      })(); //async close
    }
    });
});



function DownloadS3File (params, location) {

  return new Promise((resolve, reject) => { //return promise so can await below
    // const destPath = `/tmp/${path.basename(key)}`
    // const params = { Bucket: 'EXAMPLE', Key: key }
    // if (!fs.stat(location)) {
    // fs.mkdir(location);
    // } 
    const s3Stream = s3.getObject(params).createReadStream();
    const fileStream = fs.createWriteStream(location);
    s3Stream.on('error', reject);
    fileStream.on('error', reject);
    s3Stream.on('progress', () => {
      console.log("download progress: " + progress);
    })
    fileStream.on('close', () => { 
      resolve(location);
      console.log("filestream closed writiing to " + location);
    });
    s3Stream.pipe(fileStream);
  });
}
function DownloadMinioFile (bucket, key, location) {

  return new Promise((resolve, reject) => { //return promise so can await below
    const minioStream = minioClient.getObject(bucket, key);
    const fileStream = fs.createWriteStream(location);
    let buffer = []
    let size = 0;
    minioClient.getObject(bucket, key, function(err, dataStream) {
      if (err) {
        // return 
        console.log(err);
        
      }
      dataStream.on('data', function(chunk) {
        size += chunk.length
        buffer.push(chunk);
        // chunk.pipe(fileStream);
      })
      dataStream.on('end', function() {
        console.log('End. Total size = ' + size)
        // return data
        fs.writeFile(location, Buffer.concat(buffer), err => {
          if (err) {
            console.error(err);
          }
          console.log("file written to locaiton :" + location);
          resolve(location);
      });
        
      })
      dataStream.on('error', function(err) {
        console.log(err);
        reject(err);
      })
    });
    // // const fileStream = fs.createWriteStream(location);
    // // minioStream.on('error', reject);
    // fileStream.on('error', reject);
    // minioStream.pipe(fileStream);
    // // s3Stream.on('progress', )
    // fileStream.on('close', () => { 
    //   resolve(location);
    //   console.log("filestream closed writiing to " + location);
    // });

  });
}


gs_router.get('/process_video_hls/:_id', cors(corsOptions), requiredAuthentication, function (req, res) {
  console.log("tryna process video : " + req.params._id);
  var o_id = ObjectID(req.params._id);
  db.video_items.findOne({"_id": o_id}, function(err, video_item) {
    if (err || !video_item) {
        console.log("error getting image item: " + err);
        callback("no image in db");
        res.send("no image in db");
    } else {
      console.log(JSON.stringify(video_item));
      let hasSentResponse = false;
      (async () => {

        if (minioClient) {

          let downloadpath = process.env.LOCAL_TEMP_FOLDER+ video_item._id+'/';
          let filename = video_item._id +"."+ video_item.filename;
            if (!fs.existsSync(downloadpath)){
              fs.mkdirSync(downloadpath);
          }
          let savepath = downloadpath + 'output.m3u8';

          let key = 'users/' + video_item.userID + '/video/' + video_item._id + "/" + video_item._id +"."+ video_item.filename;
          let savedLocation = downloadpath + filename;
          await DownloadMinioFile(process.env.ROOT_BUCKET_NAME, key, savedLocation);

          ffmpeg(downloadpath + filename)
          .setFfmpegPath(ffmpeg_static)
            
            // var proc = ffmpeg('rtmp://path/to/live/stream', { timeout: 432000 })
            .output(savepath)
            .outputOptions([
              // '-codec: copy',
              '-hls_time 5',
              '-hls_list_size 0',
              '-hls_playlist_type vod',
              // '-hls_base_url http://localhost:8080/',
              '-hls_segment_filename '+ downloadpath +'%03d.ts'
            ])
            // set video bitrate
            .videoBitrate(1000)
            // set h264 preset
            // .addOption('preset','superfast')
            // set target codec
            .videoCodec('libx264')
            // set audio bitrate
            // .audioCodec('libfdk_aac')
            .audioBitrate('128k')
            // set audio codec
            // .audioCodec('libmp3lame')
            // set number of audio channels
            .audioChannels(2)
            .withSize('720x480')
            // set hls segments time
            // .addOption('-hls_time', 10)
            // // include all the segments in the list
            // .addOption('-hls_list_size',0)
            // setup event handlers
            .on('end', () => {
                console.log("done squeezin video");
                try {
                  fs.unlinkSync(downloadpath + filename);
                  console.log("deleting original file");
                  //file removed
                } catch(err) {
                  console.error(err)
                }
                fs.readdir(downloadpath, (err, files) => {
                  if (err != null) {
                    console.log("error reading directory " + err);
                  } else {
                    files.forEach(file => {
                        console.log(file);
                        if (path.extname(file) == '.ts') {
                          minioClient.putObject(process.env.ROOT_BUCKET_NAME, "users/" + video_item.userID + "/video/" + video_item._id +"/hls/" + file, fs.readFileSync(downloadpath + file), function(err, objInfo) {
                            if(err) {
                                console.log("minioerr: " + err) // err should be null
                            } else {
                                console.log("Success with .ts file", objInfo)
                            }
                          });
        
                          // s3.putObject({
                          //   Bucket: process.env.ROOT_BUCKET_NAME,
                          //   Key: "users/" + video_item.userID + "/video/" + video_item._id +"/hls/" + file,
                          //   Body: fs.readFileSync(downloadpath + file),
                          //   ContentType: 'video/MP2T'
                          //   }, function (error, resp) {
                          //     if (error) {
                          //       console.log('error putting  pic' + error);
                          //     } else {
                          //       console.log('Successfully uploaded ts file with response: ' + JSON.stringify(resp));
                          //     }
                          // });
                        } else if (path.extname(file) == '.m3u8') {
                          minioClient.putObject(process.env.ROOT_BUCKET_NAME, "users/" + video_item.userID + "/video/" + video_item._id +"/hls/" + file, fs.readFileSync(downloadpath + file), function(err, objInfo) {
                            if(err) {
                                console.log("minioerr: " + err) // err should be null
                            } else {
                                console.log("Success with m3u8 file", objInfo)
                            }
                          });
        
                          // s3.putObject({
                          //   Bucket: process.env.ROOT_BUCKET_NAME,
                          //   Key: "users/" + video_item.userID + "/video/" + video_item._id +"/hls/" + file,
                          //   Body: fs.readFileSync(downloadpath + file),
                          //   ContentType: 'application/x-mpegURL'
                          //   }, function (error, resp) {
                          //     if (error) {
                          //       console.log('error putting  pic' + error);
                          //     } else {
                          //       console.log('Successfully uploaded m3u8 response: ' + JSON.stringify(resp));
                          //     }
                          // });
                      }
                    });
                  }
                });
              //   s3.putObject({
              //     Bucket: process.env.ROOT_BUCKET_NAME,
              //     Key: "users/" + video_item.userID + "/video/" + video_item._id +"/hls/" + video_item._id +"."+path.parse(video_item.filename).name + ".ogg",
              //     Body: fs.readFileSync('tmp.m3u8'),
              //     ContentType: 'application/x-mpegURL'
              //   }, function (error, resp) {
              //     if (error) {
              //       console.log('error putting  pic' + error);
              //     } else {
              //       console.log('Successfully uploaded  video with response: ' + JSON.stringify(resp));
              //     }
              // });
            })
            .on('error', err => {
                console.error("err: " + err);
                res.send("error! " + err);
            })
            .on('progress', function(info) {
                console.log('progress ' + JSON.stringify(info));
                // if (!hasSentResponse) {
                //   hasSentResponse = true;
                //   res.send("processing");
                // }
            })
            .run();

        } else {
          s3.headObject({Bucket: process.env.ROOT_BUCKET_NAME, Key: 'users/' + video_item.userID + '/video/' + video_item._id + "/" + video_item._id +"."+ video_item.filename}, function(err, data) { //where it should be
          if (err) { 
            console.log("dint find no file at s3 like " + 'users/' + video_item.userID + '/video/' + video_item._id + "/" + video_item._id +"."+ video_item.filename);
          } else {
            console.log("found original " + process.env.ROOT_BUCKET_NAME + 'users/' + video_item.userID +'/video/' + video_item._id + "/" + video_item._id +"."+video_item.filename);
            hasSentResponse = false;
          }
          });

            var params = {Bucket: process.env.ROOT_BUCKET_NAME, Key: 'users/' + video_item.userID +'/video/' + video_item._id + "/" + video_item._id +"."+ video_item.filename};
            let downloadpath = process.env.LOCAL_TEMP_FOLDER+ video_item._id+'/';
            let filename = video_item._id +"."+ video_item.filename;
              if (!fs.existsSync(downloadpath)){
                fs.mkdirSync(downloadpath);
            }
            let savepath = downloadpath + 'output.m3u8';
            console.log("tryna save hls to " + savepath);
            // let data = await s3.getObject(params).promise().then().catch({if (err){return}});
            // await fs.writeFile(downloadpath, data).promise().then().catch({if (err){return}});
            // let data = await s3.getObject(params).createReadStream();
            // await DownloadS3File(params, downloadpath + filename);
            await DownloadS3File(params, downloadpath + filename).then().catch({if (err){return}});
            ffmpeg(downloadpath + filename)
            .setFfmpegPath(ffmpeg_static)
            
            // var proc = ffmpeg('rtmp://path/to/live/stream', { timeout: 432000 })
            .output(savepath)  
            .outputOptions([
              // '-codec: copy',
              '-hls_time 5',
              '-hls_list_size 0',
              '-hls_playlist_type vod',
              // '-hls_base_url http://localhost:8080/',
              '-hls_segment_filename '+ downloadpath +'%03d.ts'
            ])
            // set video bitrate
            .videoBitrate(1000)
            // set h264 preset
            // .addOption('preset','superfast')
            // set target codec
            .videoCodec('libx264')
            // set audio bitrate
            // .audioCodec('libfdk_aac')
            .audioBitrate('128k')
            // set audio codec
            // .audioCodec('libmp3lame')
            // set number of audio channels
            .audioChannels(2)
            .withSize('720x480')
            // set hls segments time
            // .addOption('-hls_time', 10)
            // // include all the segments in the list
            // .addOption('-hls_list_size',0)
            // setup event handlers
            .on('end', () => {
                console.log("done squeezin video");
                try {
                  // fs.unlinkSync(downloadpath + filename);
                  console.log("deleting original file");
                  //file removed
                } catch(err) {
                  console.error(err)
                }
                fs.readdir(downloadpath, (err, files) => {
                  if (err != null) {  
                    console.log("error reading directory " + err);
                  } else {
                    files.forEach(file => {
                        console.log(file);
                        if (path.extname(file) == '.ts') {
                          s3.putObject({
                            Bucket: process.env.ROOT_BUCKET_NAME,
                            Key: "users/" + video_item.userID + "/video/" + video_item._id +"/hls/" + file,
                            Body: fs.readFileSync(downloadpath + file),
                            ContentType: 'video/MP2T'
                            }, function (error, resp) {
                              if (error) {
                                console.log('error putting  pic' + error);
                              } else {
                                console.log('Successfully uploaded ts file with response: ' + JSON.stringify(resp));
                                fs.unlinkSync(downloadpath + file);
                              }
                          });
                        } else if (path.extname(file) == '.m3u8') {
                          s3.putObject({
                            Bucket: process.env.ROOT_BUCKET_NAME,
                            Key: "users/" + video_item.userID + "/video/" + video_item._id +"/hls/" + file,
                            Body: fs.readFileSync(downloadpath + file),
                            ContentType: 'application/x-mpegURL'
                            }, function (error, resp) {
                              if (error) {
                                console.log('error putting  pic' + error);
                              } else {
                                console.log('Successfully uploaded m3u8 response: ' + JSON.stringify(resp));
                                fs.unlinkSync(downloadpath + file);
                              }
                          });
                        } else {
                          fs.unlinkSync(downloadpath + file);
                        }
                    });
                  }
                });
              //   s3.putObject({
              //     Bucket: process.env.ROOT_BUCKET_NAME,
              //     Key: "users/" + video_item.userID + "/video/" + video_item._id +"/hls/" + video_item._id +"."+path.parse(video_item.filename).name + ".ogg",
              //     Body: fs.readFileSync('tmp.m3u8'),
              //     ContentType: 'application/x-mpegURL'
              //   }, function (error, resp) {
              //     if (error) {
              //       console.log('error putting  pic' + error);
              //     } else {
              //       console.log('Successfully uploaded  video with response: ' + JSON.stringify(resp));
              //     }
              // });
            })
            .on('error', err => {
                console.error("err: " + err);
                res.send("error! " + err);
            })
            .on('progress', function(info) {
                console.log('progress ' + JSON.stringify(info));
                // if (!hasSentResponse) {
                //   hasSentResponse = true;
                //   res.send("processing");
                // }
            })
            .run();
          }
        //   }
        // });
      })(); //end async
    }
    });
});



gs_router.get('/process_audio_hls/:_id', cors(corsOptions), requiredAuthentication, function (req, res) {
  console.log("tryna process video : " + req.params._id);
  var o_id = ObjectID(req.params._id);
  db.audio_items.findOne({"_id": o_id}, function(err, audio_item) {
    if (err || !audio_item) {
        console.log("error getting image item: " + err);
        callback("no image in db");
        res.send("no image in db");
    } else {
      console.log(JSON.stringify(audio_item));
      s3.headObject({Bucket: process.env.ROOT_BUCKET_NAME, Key: 'users/' + audio_item.userID + '/audio/' + audio_item._id + "/" + audio_item._id +"."+ audio_item.filename}, function(err, data) { //where it should be
        if (err) { 
          console.log("dint find no file at s3 like " + 'users/' + audio_item.userID + '/audio/' + audio_item._id + "/" + audio_item._id +"."+ audio_item.filename);
        } else {
          console.log("found original " + process.env.ROOT_BUCKET_NAME + 'users/' + audio_item.userID +'/audio/' + audio_item._id + "/" + audio_item._id +"."+audio_item.filename);
          let hasSentResponse = false;
          (async () => {
            var params = {Bucket: process.env.ROOT_BUCKET_NAME, Key: 'users/' + audio_item.userID +'/audio/' + audio_item._id + "/" + audio_item._id +"."+ audio_item.filename};
            let downloadpath = '/Volumes/SM_FAT2/grabandsqueeze/audio/'+ audio_item._id+'/';
            let filename = audio_item._id +"."+ audio_item.filename;
            if (!fs.existsSync(downloadpath)){
              fs.mkdirSync(downloadpath);
          }
            let savepath = downloadpath + 'output.m3u8';
            console.log("tryna save hls to " + savepath);
            // let data = await s3.getObject(params).promise().then().catch({if (err){return}});
            // await fs.writeFile(downloadpath, data).promise().then().catch({if (err){return}});
            // let data = await s3.getObject(params).createReadStream();
            await DownloadS3File(params, downloadpath + filename);

            ffmpeg(downloadpath + filename)
            .setFfmpegPath(ffmpeg_static)
            
            // var proc = ffmpeg('rtmp://path/to/live/stream', { timeout: 432000 })
            .output(savepath)
            .outputOptions([
              // '-codec: copy',
              '-hls_time 5',
              '-hls_list_size 0',
              '-hls_playlist_type vod',
              // '-hls_base_url http://localhost:8080/',
              '-hls_segment_filename '+ downloadpath +'%03d.ts'
            ])
            // set video bitrate
            .videoBitrate(1500)
            // set h264 preset
            // .addOption('preset','superfast')
            // set target codec
            .videoCodec('libx264')
            // set audio bitrate
            // .audioCodec('libfdk_aac')
            .audioBitrate('128k')
            // set audio codec
            // .audioCodec('libmp3lame')
            // set number of audio channels
            .audioChannels(2)
            .withSize('1280x720')
            // set hls segments time
            // .addOption('-hls_time', 10)
            // // include all the segments in the list
            // .addOption('-hls_list_size',0)
            // setup event handlers
            .on('end', () => {
                console.log("done squeezin video");
                try {
                  fs.unlinkSync(downloadpath + filename);
                  console.log("deleting original file");
                  //file removed
                } catch(err) {
                  console.error(err)
                }
                fs.readdir(downloadpath, (err, files) => {
                  if (err != null) {
                    console.log("error reading directory " + err);
                  } else {
                    files.forEach(file => {
                        console.log(file);
                        if (path.extname(file) == '.ts') {
                          s3.putObject({
                            Bucket: process.env.ROOT_BUCKET_NAME,
                            Key: "users/" + audio_item.userID + "/audio/" + audio_item._id +"/hls/" + file,
                            Body: fs.readFileSync(downloadpath + file),
                            ContentType: 'video/MP2T'
                            }, function (error, resp) {
                              if (error) {
                                console.log('error putting  pic' + error);
                              } else {
                                console.log('Successfully uploaded ts file with response: ' + JSON.stringify(resp));
                              }
                          });
                        } else if (path.extname(file) == '.m3u8') {
                          s3.putObject({
                            Bucket: process.env.ROOT_BUCKET_NAME,
                            Key: "users/" + audio_item.userID + "/audio/" + audio_item._id +"/hls/" + file,
                            Body: fs.readFileSync(downloadpath + file),
                            ContentType: 'application/x-mpegURL'
                            }, function (error, resp) {
                              if (error) {
                                console.log('error putting  pic' + error);
                              } else {
                                console.log('Successfully uploaded m3u8 response: ' + JSON.stringify(resp));
                              }
                          });
                      }
                    });
                  }
                });
              //   s3.putObject({
              //     Bucket: process.env.ROOT_BUCKET_NAME,
              //     Key: "users/" + video_item.userID + "/video/" + video_item._id +"/hls/" + video_item._id +"."+path.parse(video_item.filename).name + ".ogg",
              //     Body: fs.readFileSync('tmp.m3u8'),
              //     ContentType: 'application/x-mpegURL'
              //   }, function (error, resp) {
              //     if (error) {
              //       console.log('error putting  pic' + error);
              //     } else {
              //       console.log('Successfully uploaded  video with response: ' + JSON.stringify(resp));
              //     }
              // });
            })
            .on('error', err => {
                console.error("err: " + err);
                res.send("error! " + err);
            })
            .on('progress', function(info) {
                console.log('progress ' + JSON.stringify(info));
                // if (!hasSentResponse) {
                //   hasSentResponse = true;
                //   res.send("processing");
                // }
            })
            .run();
        })();
        }
      });
    }
    });
});



export default gs_router;