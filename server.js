//copyright 2022 servicemedia.net

var express = require("express")
    , http = require("http")
    
    , jwt = require("jsonwebtoken")
    , axios = require("axios")
    , path = require("path")
    , fs = require("fs")
    , bodyParser = require('body-parser')
    , cookieParser = require('cookie-parser')
    // , multer  = require('multer') //done witchoo!
    // , autoReap  = require('multer-autoreap')
    , mongojs = require("mongojs")
    , methodOverride = require('method-override')
    , session = require('express-session')
    , entities = require("entities")
    , validator = require('validator')
    , minio = require('minio')
    // , util = require('util')
    , helmet = require('helmet')
    , ObjectID = require("bson-objectid")
    , MongoDBStore = require('connect-mongodb-session')(session) //theShit
    , async = require('async')
    , bcrypt = require('bcrypt-nodejs')
    , shortid = require('shortid')
    , QRCode = require('qrcode')
    // , transloadit = require('node-transloadit')
    // , internetradio = require('node-internet-radio')
    , requireText = require('require-text');


    app = express();
    require('dotenv').config();

    // app.use(helmet.contentSecurityPolicy());
    app.use(helmet.dnsPrefetchControl());
    app.use(helmet.expectCt());

    app.use(helmet.hidePoweredBy());
    app.use(helmet.hsts());
    app.use(helmet.ieNoOpen());
    app.use(helmet.noSniff());
    app.use(helmet.permittedCrossDomainPolicies());
    app.use(helmet.referrerPolicy());
    app.use(helmet.xssFilter());

    // require('./routes/oculus_routes')(app);
    // app.cosnfigure(function(){
        // app.use(bodyParser);
    // });

var stripe = require("stripe")(process.env.STRIPE_KEY);

var rootHost = process.env.ROOT_HOST
var topName = process.env.ROOT_NAME;
var requirePayment = true; //if subscription is required to login, true for servicemedia
var adminEmail = process.env.ADMIN_EMAIL;
var domainAdminEmail = process.env.DOMAIN_ADMIN_EMAIL;

var whitelist = ['unityapp', 'https://servicemedia.s3.amazonaws.com/', 'http://localhost:3000', 'https://servicemedia.net', 'strr.us.s3.amazonaws.com', 'mvmv.us.s3.amazonaws.com', 'http://strr.us', 'https://strr.us',
 'https://strr.us/socket.io', 'http://valuebring.com', 'http://elnoise.com', 'philosophersgarden.com', 'http://elnoise.com', 'http://eloquentnoise.com', 'http://thefamilyshare.com', 'http://little-red-schoolhouse.com', 
 'http://visiblecity.net', 'http://philosophersgarden.net', 'https://realitymangler.com', 'https://chickenwaffle.dashboid.com', 'https://mvmv.us', 'http://mvmv.us', 
 'http://nilch.com', 'https://servicemedia.net', 'http://kork.us', 'http://spacetimerailroad.com'];

var corsOptions = function (origin) {
//    console.log("checking vs whitelist:" + origin);
    if ( whitelist.indexOf(origin) !== -1 ) {
        return true;
    } else {
        return true; //fornow...
    }
};

var oneDay = 86400000;

// app.use (function (req, res, next) {
//     var schema = (req.headers['x-forwarded-proto'] || '').toLowerCase();
//     if (schema === 'https') {
//         next();
//     } else {    
//     //    console.log ("non ssl request = " + req.headers.host + " tryna redirect");
//         if (req.headers.host != "localhost:3000") { //TODO Enviromental Varz
//             next(); //nm do it clientside... :()

//             // var htmltext = "<html xmlns='http://www.w3.org/1999/xhtml'>" +
//             //     "<head></head><body> " +
//             //     "<h4>you must use https to access this site: <a href='https://servicemedia.net'>https://servicemedia.net</a></h4>" +
//             //     "</body><script>"+
//             //         "window.location.href = window.location.href.replace('http:', 'https:');"
//             //     "</script></html>";
//             // res.send(htmltext);
//         } else {
//             next();
//         }
//     }
// });

var databaseUrl = process.env.MONGO_URL; //servicemedia connstring
// console.log(databaseUrl);
var collections = ["acl", "auth_req", "domains", "apps", "assets", "assetsbundles", "models", "users", "inventories", "inventory_items", "audio_items", "text_items", "audio_item_keys", "image_items", "video_items",
    "obj_items", "paths", "keys", "scores", "attributes", "achievements", "activity", "actions", "purchases", "storeitems", "scenes", "groups", "weblinks", "locations", "iap"];

var db = mongojs(databaseUrl, collections);
var store = new MongoDBStore({ //store session cookies in a separate db with different user, so nice
    uri: process.env.MONGO_SESSIONS_URL,
    collection: 'sessions'
  });

  store.on('connected', function() {
    store.db; // The underlying MongoClient object from the MongoDB driver
  });


    app.use(express.static(path.join(__dirname, './'), { maxAge: oneDay }));

    app.use(function(req, res, next) {

        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,POST');
        res.header('Access-Control-Max-Age', '300');
        res.header('Access-Control-Allow-Headers', 'Origin, Access-Control-Allow-Origin, x-unity-version, X-Unity-Version, token, cookie, appid, Cookie, X-Access-Token, x-access-token, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
        res.header('Access-Control-Expose-Headers', 'set-cookie, Set-Cookie', 'token');
        if ('OPTIONS' == req.method) {
            res.send(200);
        } else {
            next();
        }
    });

    app.use(methodOverride());
//    var sessionStore = new session.MemoryStore();
    var expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 2 hour
    app.use(session({
        resave: true,
        saveUninitialized: true,
        store: store,
        rolling: true,
        secret: process.env.JWT_SECRET }));
//    app.use(router);
    app.use(cookieParser());
//    app.use(bodyParser());
    app.use(bodyParser.json({ "limit": "10mb", extended: true }));
    app.use(bodyParser.urlencoded({ extended: false }));
    // app.use(autoReap);

    var maxItems = 1000;
    const { CloudSearch } = require("aws-sdk");
    //var upload = multer({ dest: 'uploads/' });

    var aws = require('aws-sdk');
    const { json } = require("body-parser");
    const { profile } = require("console");

    const { lookupService, resolveNaptr, resolveCname } = require("dns");

    aws.config = new aws.Config({accessKeyId: process.env.AWSKEY, secretAccessKey: process.env.AWSSECRET, region: process.env.AWSREGION});
    var ses = new aws.SES({apiVersion : '2010-12-01'});
    var s3 = new aws.S3();

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

    var appAuth = "noauth";
    // let docClient = new aws.DynamoDB.DocumentClient();
    let trafficTable = "traffic_1";

    var server = http.createServer(app);
    server.timeout = 240000;
    server.keepAliveTimeout = 24000;
    server.listen(process.env.PORT || 3000, function() {
        console.log("Express server listening on port 3000");
    });
    app.set('db', db);
    app.set('store', store);
    app.set('s3', s3);

    //INCLUDE EXTERNAL ROUTES BELOW
    var oculus_routes = require('./routes/oculus_routes');
    app.use('/oculus', oculus_routes);
    var webxr_routes = require('./routes/webxr_routes');
    app.use('/webxr', webxr_routes);  
    


// io.attach(http);
// io.use(function(socket, next){
//     console.log("Query: ", socket.handshake.query);
//     // return the result of next() to accept the connection.
//     if (socket.handshake.query.uname != undefined) {
//         if (!socket.handshake.query.uname.includes("guest")) { //TODO put some token-fu on this 
//             socket.uname = socket.handshake.query.uname;
//             db.scenes.findOne({ "short_id": socket.handshake.query.room}, function (err, scene) {
//                 if (err || !scene) {
//                     console.log("that scene does not exist " + socket.handshake.query.room);
//                     next(new Error('that scene is not'));
                    
//                 } else {
//                     return next();
//                     console.log("that scene is");
                
//                 }
//             });  
//             // return next();
//         }
//     } else {
//         console.log("i gots nothin");
//          next(new Error('Socket Authentication error'));
//     }
//     // call next() with an Error if you need to reject the connection.
// });

// io.use(function (socket, next){
//     console.log("socket: s"ocket);
//     return next();
// });

/////// this one is for aframe nat, no usrs  
/*
const rooms = {};

io.on("connection", socket => {
  console.log("user connected", socket.id);

  let curRoom = null;
//   socket.on('reconnect_attempt', () => {
//     socket.io.opts.transports = ['polling', 'websocket'];
//   });

  socket.on("joinRoom", data => {
    const { room } = data;

    if (!rooms[room]) {
      rooms[room] = {
        name: room,
        occupants: {},
      };
    }

    const joinedTime = Date.now();
    rooms[room].occupants[socket.id] = joinedTime;
    curRoom = room;

    console.log(`${socket.id} joined room ${room}`);
    socket.join(room);

    socket.emit("connectSuccess", { joinedTime });
    const occupants = rooms[room].occupants;
    io.in(curRoom).emit("occupantsChanged", { occupants });

  });

  socket.on("send", data => {
    io.to(data.to).emit("send", data);
  });

  socket.on("broadcast", data => {
    socket.to(curRoom).broadcast.emit("broadcast", data);
  });

  socket.on("disconnect", () => {
    console.log('disconnected: ', socket.id, curRoom);
    if (rooms[curRoom]) {
      console.log("user disconnected", socket.id);

      delete rooms[curRoom].occupants[socket.id];
      const occupants = rooms[curRoom].occupants;
      socket.to(curRoom).broadcast.emit("occupantsChanged", { occupants });

      if (occupants == {}) {
        console.log("everybody left room");
        delete rooms[curRoom];
      }
    }
  });
});
*/
/////// SHOW/HIDE Below to run socket.io on same port
/*
///this one gets users through handshake
// var socketUsers = {};
// var allUsers = [];
var io = require('socket.io')(server);
// var mongoAdapter = require('socket.io-adapter-mongo');
// io.adapter(mongoAdapter( process.env.MONGO_SESSIONS_URL ));
// io.set('origins', 'servicemedia.net');
io.set('transports', ['polling', 'websocket']);
io.serveClient(true);
// socket = io;
io.on('connection', function(socket) {
    var room = "";
    socket.token = socket.handshake.query.token;
    socket.uname = socket.handshake.query.uname; //set property on socket itself, rather than keeping a list
    socket.color = socket.handshake.query.color;
    // let tokenAuth = tokenAuthentication(socket.token);
    if (socket.token != null && socket.uname != null && socket.color != null){
        socket.on("disconnect", (reason) => {
            console.log("closing connection because bad query from " + socket);
        });
    } else {
        console.log(socket.uname + " " + socket.color + "connected");
    }

    socket.on('join', function(rm) {
        console.log(socket.uname + " tryna join " + rm);
        socket.join(rm);
        socket.room = room;
        room = rm; //set global room value for this socket, since we can only be in one at a time
        jwt.verify(socket.token, process.env.JWT_SECRET, function (err, payload) {
            console.log(JSON.stringify(payload));
            if (payload) {
                if (payload.userId != null){
                    // console.log("gotsa payload.userId : " + payload.userId);
                    if (payload.userId == "0000000000000") { //TODO check for expiration

                       console.log("payload is guest token"); 
                       console.log(socket.id + " named " + socket.uname + " tryna join " + rm );
                       socket.join(rm);
                       socket.room = room;
                       socket.userID = payload.userId;
                       room = rm; //set global room value for this socket, since we can only be in one at a time
                       io.to(room).emit('user joined', socket.uname, room);
                    } else {    //maybe do lookup on join? 
                        var oo_id = ObjectID(payload.userId);
                        db.users.findOne({_id: oo_id}, function (err, user) {   //check user status
                            if (err != null) {
                                socket.on("disconnect", (reason) => {
                                    console.log("closing connection because userlookup failed");
                                });
                            } else {
                                console.log("gotsa user " + user._id + " authLevel " + user.authLevel + " status " + user.status);
                                console.log(socket.id + " named " + socket.uname + " tryna join " + rm );
                                socket.join(rm);
                                socket.room = room;
                                room = rm; //set global room value for this socket, since we can only be in one at a time
                                socket.userID = payload.userId;
                                io.to(room).emit('user joined', socket.uname, room);
                            }
                        });
                    }
                    // next();
                } else {
                    socket.on("disconnect", (reason) => {
                        console.log("closing connection because no userID in payload " + reason);
                    });
                }
            } else {
                socket.on("disconnect", (reason) => {
                    console.log("closing connection because no payload " + reason);
                });
            }
        });
    });

    socket.on('disconnect', function() {
        console.log('Got disconnect: ' + socket.handshake.query.room);
        
        socket.leave(socket.handshake.query.room);
        socket.to(socket.handshake.query.room).emit('user left', socket.id);
        // io.in(room).emit('disconnected', socket.uname);
        if (io.sockets.adapter.rooms[room] != undefined) {
            var roomUsers = io.sockets.adapter.rooms[room].sockets;
            // console.log("roomUsers after disconnect " + JSON.stringify(roomUsers));
            var returnObj = {};
            Object.keys(roomUsers).forEach(function(key) {
                // console.log("disconnect roomUsers key " + key + " uname " + io.sockets.connected[key].uname);
                // let namedPlusColor = io.sockets.connected[key].uname + "~" + 
                // returnObj[key] = io.sockets.connected[key].uname; //socketID : username
                let namePlusColor = io.sockets.connected[key].uname + "~" + io.sockets.connected[key].color;
                returnObj[key] = namePlusColor;
                // returnObj[io.sockets.connected[key].uname] = key; //cook up a nice dict for client to use
            });
            Object.keys(roomUsers).forEach(function(key) {
                // console.log("roomUsers key " + key + " uname " + io.sockets.connected[key].uname);
                // returnObj[key] = io.sockets.connected[key].uname; //socketID : username
                // returnObj[io.sockets.connected[key].uname] = key; //cook up a nice dict for client to use
                io.sockets.connected[key].emit('room users', JSON.stringify(returnObj));
            });
        }
        
        // io.emit('disconnected');
        
    });
    socket.on('room users', function (room) {
        if (io.sockets.adapter.rooms[room] != undefined) {
        var roomUsers = io.sockets.adapter.rooms[room].sockets;
        // console.log("roomUsers " + JSON.stringify(roomUsers));
        var returnObj = {};
        // async.each (Object.keys(roomUsers), function (key, callbackz) {
        //     returnObj[key] = io.sockets.connected[key].uname;
        //     callbackz();
        // }, function(err) {
        //    
        //     if (err) {
        //         console.log('bad key');
        //         callbackz(err);
        //     } 
        // });

        Object.keys(roomUsers).forEach(function(key) {
            // console.log("roomUsers key " + key + " uname " + io.sockets.connected[key].uname);
            // returnObj[key] = io.sockets.connected[key].uname; //socketID : username
            let namePlusColor = io.sockets.connected[key].uname + "~" + io.sockets.connected[key].color;
            returnObj[key] = namePlusColor;
            // returnObj[io.sockets.connected[key].uname] = key; //cook up a nice dict for client to use
        });
        // console.log(roomUsersString);
        // console.log("tryna get room users for " + room + " " + JSON.stringify(returnObj));
        io.in(room).emit('room users', JSON.stringify(returnObj));
        }
    });
    socket.on('pic frame', function(data, sid) { //sid = sender's socket.id
        console.log("tryna send a pic frame : ");
         socket.to(room).emit('getpicframe', data, sid);
 //        socket.broadcast.emit('broad',data);
     });


    socket.on('user message', function(data) {
        // console.log(socket.uname + " user message: " + data + " for room " + room);
        socket.in(room).emit('user messages', socket.uname, data);
//        socket.broadcast.emit('messages',data);
    });

    socket.on('activity message', function(data) {
        console.log("room : " + room + "activity message: " + data)
        socket.to(room).emit('messages', data);
//        socket.broadcast.emit('messages',data);
    });

    socket.on('updateplayerposition', function(room, uname, posx, posy, posz, rotx, roty, rotz, sid, source) { //adding rot vals and source
    //    console.log(uname + ' sid ' + sid + ' moved to ' + posx+","+posy+","+posz + " in room " + room);
//        socket.to(room).emit('messages', uname + ' moved to ' + posx+","+posy+","+posz);
        // if (source == "aframe") { //if player is in aframe scene, flip the z - what about rotations?
        //     posz = posz * -1; 
        // }
        socket.to(room).emit('playerposition', uname,posx,posy,posz,rotx, roty, rotz, sid, source);
    });

});
//*/
function tokenAuthentication(token) { //use for route security?
    jwt.verify(token, process.env.JWT_SECRET, function (err, payload) {
        console.log(JSON.stringify(payload));
        if (payload) {
           
            if (payload.userId != null){
                console.log("gotsa payload.userId : " + payload.userId);
                var oo_id = ObjectID(payload.userId);
                db.users.findOne({_id: oo_id}, function (err, user) {   //check user status
                    if (err != null) {
                        req.session.error = 'Access denied!';
                        console.log("token authentication failed! User ID not found");
                        // res.send('noauth');
                        return ("no");
                    } else {
                        console.log("gotsa user " + user._id + " authLevel " + user.authLevel + " status " + user.status);
                        if (user.status == "validated") {
                        // userStatus = "subscriber";
                        console.log("gotsa subscriber!");
                        return ("yes");
                        } else {
                            req.session.error = 'Access denied!';
                            console.log("token authentication failed! not a subscriber");
                            return ("maybe");   
                        }
                    }
                });
                // next();
            } else {
                return ("nope");
            }
        } else {
            return ("nooo");
        }
    });
}

function checkAuthentication(req) { //maybe needed later?  can just get session info in route

    if (req.session.user && req.session.user.status == "validated") { //check using session cookie
        if (requirePayment) { 
            if (req.session.user.paymentStatus == "ok") {
                // next();
                return "payment auth OK " + JSON.stringify(req.session.user);
            } else {
                req.session.error = 'Access denied! - payment status not ok';
                res.send('payment status not OK');
                return "payment status not OK";       
            }
        } else {
            console.log("authenticated!");
            // next();
            return "auth OK";
        }
    } else {
        if (req.headers['x-access-token'] != null) {  //check using json web token
            var token = req.headers['x-access-token'];
            console.log("req.headers.token: " + token);
            jwt.verify(token, process.env.JWT_SECRET, function (err, payload) {
                    console.log(JSON.stringify(payload));
                    if (payload) {
                        // user.findById(payload.userId).then(
                        //     (doc)=>{
                        //         req.user=doc;
                        //         next();
                        //     }
                        // )
                        // console.log("gotsa token payload: " + req.session.user._id + " vs " +  payload.userId);
                        if (payload.userId != null){
                            console.log("gotsa payload.userId : " + payload.userId);
                            var oo_id = ObjectID(payload.userId);
                            db.users.findOne({_id: oo_id}, function (err, user) {   //check user status
                                if (err != null) {
                                    req.session.error = 'Access denied!';
                                    console.log("token authentication failed! User ID not found");
                                    // res.send('noauth');
                                    return "token auth failed, userID not found";
                                } else {
                                    console.log("gotsa user " + user._id + " authLevel " + user.authLevel + " status " + user.status);
                                    if (user.status == "validated") {
                                    // userStatus = "subscriber";
                                    console.log("gotsa subscriber!");
                                    // next();
                                    return "token auth OK";
                                    } else {
                                        req.session.error = 'Access denied!';
                                        console.log("token authentication failed! not a subscriber");
                                        // res.send('noauth');
                                        return "token auth failed";    
                                    }
                                }
                            });
                            // next();
                        } else {
                            req.session.error = 'Access denied!';
                            console.log("token authentication failed! headers: " + JSON.stringify(req.headers));
                            // res.send('noauth');
                            return "token auth failed";
                        }
                    } else {
                        req.session.error = 'Access denied!';
                        console.log("token authentication failed! headers: " + JSON.stringify(req.headers));
                        // res.send('noauth');
                        return "token auth failed";
                    }
            });
        } else {
            req.session.error = 'Access denied!';
            console.log("authentication failed! No cookie or token found");
            // res.send('noauth');
            return "token auth failed";
        }
    }
}


function requiredAuthentication(req, res, next) { //primary auth method, used as argument in the routes below

    if (req.session.user && req.session.user.status == "validated") { //check using session cookie
        if (requirePayment) { 
            if (req.session.user.paymentStatus == "ok") {
                next();
            } else {
                req.session.error = 'Access denied! - payment status not ok';
                res.send('payment status not OK');       
            }
        } else {
            console.log("authenticated!");
            next();
        }
    } else {
        if (req.headers['x-access-token'] != null) {  //check using json web token
            var token = req.headers['x-access-token'];
            console.log("req.headers.token: " + token);
            jwt.verify(token, process.env.JWT_SECRET, function (err, payload) {
                    console.log(JSON.stringify(payload));
                    if (payload) {
                        // user.findById(payload.userId).then(
                        //     (doc)=>{
                        //         req.user=doc;
                        //         next();
                        //     }
                        // )
                        // console.log("gotsa token payload: " + req.session.user._id + " vs " +  payload.userId);
                        if (payload.userId != null){
                            console.log("gotsa payload.userId : " + payload.userId);
                            var oo_id = ObjectID(payload.userId);
                            db.users.findOne({_id: oo_id}, function (err, user) {   //check user status
                                if (err != null) {
                                    req.session.error = 'Access denied!';
                                    console.log("token authentication failed! User ID not found");
                                    res.send('noauth');
                                } else {
                                    console.log("gotsa user " + user._id + " authLevel " + user.authLevel + " status " + user.status);
                                    if (user.status == "validated") {
                                    // userStatus = "subscriber";
                                    console.log("gotsa subscriber!");
                                    next();
                                    } else {
                                        req.session.error = 'Access denied!';
                                        console.log("token authentication failed! not a subscriber");
                                        res.send('noauth');    
                                    }
                                }
                            });
                            // next();
                        } else {
                            req.session.error = 'Access denied!';
                            console.log("token authentication failed! headers: " + JSON.stringify(req.headers));
                            res.send('noauth');
                        }
                    } else {
                        req.session.error = 'Access denied!';
                        console.log("token authentication failed! headers: " + JSON.stringify(req.headers));
                        res.send('noauth');
                    }
            });
        } else {
            req.session.error = 'Access denied!';
            console.log("authentication failed! No cookie or token found");
            res.send('noauth');
        }
    }
}



function traffic (req, res, next) {
    let timestamp = Date.now();

    timestamp = parseInt(timestamp);
    console.log("tryna save req" + req.body);
    var ip = req.headers['x-forwarded-for'] ||
     req.socket.remoteAddress ||
     null;
    let params = {
        TableName: trafficTable, //dynamodb table name at aws
        Item: {
            timestamp: timestamp,
            baseUrl: req.baseUrl,
            body: JSON.stringify(req.body),
            fresh: req.fresh,
            hostname: req.hostname,
            ip: req.ip,
            referring_ip: ip,
            method: req.method,
            originalUrl: req.originalUrl,
            params: JSON.stringify(req.params),
            headers: JSON.stringify(req.headers)
            
        }
    };
    // docClient.put(params, function (err, data) {
    //     if (err) {
    //        console.log("traffic logging error : " + err);
    //         next();
    //     } else {
    //         // console.log("XXXX updated traffic log " + req.body);
    //         next();
    //     }
    // });
}

function nameCleaner(name) {

    name = name.replace(/\s+/gi, '-'); // Replace white space with dash
    return name.replace(/[^a-zA-Z0-9\-]/gi, ''); // Strip any special charactere
}

function checkAppID(req, res, next) {
    console.log("req.headers: " + JSON.stringify(req.headers));
    if (req.headers.appid) {
        var a_id = ObjectID(req.headers.appid.toString().replace(":", ""));
        db.apps.findOne({_id: a_id }, function (err, app) {
            if (err || !app) {
                console.log("no app id!");
                req.session.error = 'Access denied!';
                res.send("noappauth");
//                next();
            } else {
                console.log("hey, gotsa appID!");
                next();
            }
        });
    } else {
        console.log("no app id!");
        req.session.error = 'Access denied!';
        res.send("noappauth");
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkSceneTitle(titleString) {


}

function amirite (acl_rule, u_id) { //check user id against acl
    //        console.log("checking " + JSON.stringify(req.session));
    //        if (JSON.stringify(req.session.user._id.toString()) == u_id) {
    //            console.log("Logged in: " + req.session.user.userName);
    // is there such a rule, and is this user id in it's userIDs array?
    //            var u_id = session.user._id;
    console.log("lookin for u_id :" + u_id + " in " + acl_rule);
    db.acl.findOne({$and: [{acl_rule: acl_rule}, {userIDs: {$in: [u_id]}}]}, function (err, rule) {
        if (err || !rule) {
            //req.session.error = 'Access denied!';
            //res.send('noauth');
            console.log("sorry, that's not in the acl");
            return false;
        } else {
            console.log("yep, that's in the acl");
//                    next();
            return true;
        }
    });
//        }
}

function notify (req, res, next) {

}

function admin (req, res, next) { //check user id against acl
    var u_id = req.session.user._id.toString();
    if (req.session.user != undefined) {
        if (req.session.user.authLevel != undefined) {
            if (req.session.user.authLevel.includes("admin")) {
                next(); 
            } else {
                req.session.error = 'Access denied!';
                res.send('noauth');
            }
        }
    }
//     db.acl.findOne({$and: [{acl_rule: "admin"}, {userIDs: {$in: [u_id]}}]}, function (err, rule) {
//         if (err || !rule) {
//             req.session.error = 'Access denied!';
//             res.send('noauth');
//             console.log("sorry, that's not in the acl");
// //                return false;
//         } else {
//             console.log("yep, that's in the acl");
//             next();
// //                return true;
//         }
//     });
}

function usercheck (req, res, next) { //gotsta beez the owner of requested resource
    var u_id = req.session.user._id.toString();
    var req_u_id = req.params._id;
//        var scene_id = req.params.scene_id;
    console.log("checkin " + u_id + " vs " + req_u_id);
    if (u_id == req_u_id.toString().replace(":", "")) { //hrm.... dunno why the : needs trimming...
        next();
    } else {
        req.session.error = 'Access denied!';
        res.send('noauth');
    }
}
function domainadmin (req, res, next) { //TODO also check acl
    db.users.findOne({_id: ObjectID(req.session.user._id)}, function (err, user) {
        if (err || ! user) {
            res.send("noauth");
        } else {
            if (user.authLevel.includes("domain_admin") || user.authLevel.includes("admin")) { //should be separate, but later..
                next();
            } else {
               res.send("noauth");
            }
        }
    })
}

function domainadminn (req, res, next) {
    var u_id = req.session.user._id.toString();
//        var req_u_id = req.params.user_id;
//        var domain = req.params.domain;
//        console.log("checkin " + u_id + " vs " + req_u_id);
//        if (u_id == req_u_id.toString().replace(":", "")) { //hrm.... dunno why the : needs trimming...
    var rule = "domain_admin_" + req.params.domain.toString().replace(":", "");
    console.log("acl rule check " + rule + " vs " + u_id);
    //either admin or domain admin, admin can do everything
    db.acl.findOne({$or :[{$and: [{acl_rule:rule }, {userIDs: {$in: [u_id]}}]}, {$and: [{acl_rule: "admin"}, {userIDs: {$in: [u_id]}}]}]}, function (err, rule) {
        if (err || !rule) {
            req.session.error = 'Access denied!';
            res.send('noauth');
            console.log("sorry, that's not in the domain_admin acl");
            //                return false;
        } else {
            console.log("yep, that's in the domain_admin acl");
            next();
            //                return true;
        }
    });
    //            next();
//        } else {
//            req.session.error = 'Access denied!';
//            res.send('noauth');
//        }
}

function uscene (req, res, next) { //check user id against acl, for scene writing
    var u_id = req.session.user._id.toString();
    var req_u_id = req.params.user_id;
    var scene_id = req.params.scene_id.toString().replace(":", "");
    console.log("checkin " + u_id + " vs " + req_u_id + " for " + scene_id);
    if (req.session.user.authLevel.includes("admin")) {
        next();
    } else if (u_id == req_u_id.toString().replace(":", "")) { //hrm.... dunno why the : needs trimming...

        db.acl.findOne({$and: [{"acl_rule": "write_scene_" + scene_id }, {"userIDs": {$in: [u_id]}}]}, function (err, rule) {
            if (err || !rule) {
                req.session.error = 'Access denied!';
                res.send('noauth');
                console.log("sorry, that's not in the acl");
//                return false;
            } else {
                console.log("yep, that's in the acl");
                next();
//                return true;
            }
        });
//            next();
    } else {
        req.session.error = 'Access denied!';
        res.send('noauth');
    }
}
function makeLowerCase(string) {
    return string.toLowerCase();
}
function makeExtensionLowerCase (filename) {
    var i = filename.lastIndexOf('.');
    if (i < 0) {
       return filename;
    } else {
        
    }
}
function getExtension(filename) {
    // console.log("tryna get extension of " + filename);
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

function removeDuplicates(arr){
    let unique_array = []
    for(let i = 0;i < arr.length; i++){
        if(unique_array.indexOf(arr[i]) == -1){
            unique_array.push(arr[i])
        }
    }
    return unique_array
}

function saveActivity (data) {
    db.activity.save(data, function (err, saved) {
        if ( err || !saved ) {
            console.log('activity not saved..');
            // res.send("nilch");
        } else {
            var item_id = saved._id.toString();
            console.log('new activity id: ' + item_id);
            // res.send(item_id);
        }
    });
}
///////////////////////// OBJECT STORE (S3, Minio, etc) OPS BELOW - TODO - replace all s3 getSignedUrl calls with this, promised based version, to suport minio, etc... (!)
async function ReturnPresignedUrl(bucket, key, time) {
    
    if (minioClient) {
        return minioClient.presignedGetObject(bucket, key, time);
    } else {
        return s3.getSignedUrl('getObject', {Bucket: bucket, Key: key, Expires: time}); //returns a promise if called in async function?
    } 
}
async function ReturnObjectMetadata(bucket, key) { //s3.headObject == minio.statObject
    if (minioClient) {

    } else {
        s3.headObject(params, function (err, data) {
            if (err && err.code === 'NotFound') {
                // Handle no object on cloud here
                console.log(err);
                // callback(err);
                // res.send("staged file not found");
                return err
            } else {
                // meateada = metadata;
                console.log("staged file meateada " + data);
                // callback(null);
                return data;
            }
        });
    }
}
async function CopyObject(targetBucket, copySource, key) {
    if (minioClient) {

    } else {
        s3.copyObject({Bucket: targetBucket, CopySource: copySource, Key: key}, function (err,data){
            if (err) {
                console.log("ERROR copyObject" + err);
                // callback(err);
                return err;
            } else {
                console.log("SUCCESS copyObject key " + key );
                return data;
                // callback(null);
                // callback(null, item_id, tUrl);
            }
        });
    }
} 


//ROUTES BELOW
////////////////////////////////////////////////////////////////
app.get("/", function (req, res) {
    //send "Hello World" to the client as html
    res.send("Hello World!");
    // res.writeHead(301,{Location: 'http://w3docs.com'});
    // res.end();
});

// app.get("/copyall", function (req, res) {

//     db.audio_items.find({}, function(err,audio_items) {
//         if (err || !audio_items) {
//             console.log("error getting audio items: " + err);
//         } else {

//         }
//     });
// });

// app.get("/s/:shortcode", function (req, res) {
//     //send "Hello World" to the client as html
//     // res.send("Hello World!");
//     // console.log("tryna redirect to shortcode " + req.params.shortcode);
//     res.redirect("https://strr.us/connect/?scene=" + req.params.shortcode);

// });

app.get("/privacy.html", function (req,res) {
    res.redirect("/main/privacy.html");
});

app.get( "/crossdomain.xml", onCrossDomainHandler )
function onCrossDomainHandler( req, res ) {
    var xml = '<?xml version="1.0"?>\n<cross-domain-policy>\n';
    xml += '<allow-access-from domain="strr.us" to-ports="*"/>\n';
    xml += '<allow-access-from domain="mvmv.us" to-ports="*"/>\n';
    xml += '<allow-access-from domain="3dcasefiles.com" to-ports="*"/>\n';
    xml += '</cross-domain-policy>\n';

    req.setEncoding('ascii');
    res.writeHead( 200, {'Content-Type': 'text/xml'} );
    res.end( xml );
};

app.get("/amirite/:_id", function (req, res) {
    //console.log("amirite: " + req.session);
    if (req.session.user) {
    //console.log(JSON.stringify(req.session.user._id.toString()) + " " + req.params._id);
        if (req.session.user._id.toString() == req.params._id) {
            console.log("req.session.user.authLevel :" + req.session.user.authLevel);
            if (req.session.user.userName != "guest" && req.session.user.userName != "subscriber" && req.session.user.authLevel != undefined && req.session.user.authLevel != "noauth") {
                res.send(req.session.user.userName + "~" + req.session.user._id.toString() + "~" + req.session.user.authLevel);

            } else {
                res.send("0");
            }

        } else {
            res.send("0");
        }
    } else {
        res.send("0");
    }
});


// app.post("/oculus/:app/:action", function (req, res) {
    
//     if (req.params.app.toString().toLowerCase() == "cowbots_rift") {
//         console.log("oculus request for cowbots" + JSON.stringify(req.body));
//         if (req.params.action.toString().toLowerCase() == "validate") {
//             let data = {};
//             data.access_token = process.env.COWBOTS_OCULUS_RIFT_TOKEN;
//             data.nonce = req.body.nonce;
//             data.user_id = req.body.oID;
//             console.log(JSON.stringify(data));
//             axios.post("https://graph.oculus.com/user_nonce_validate/", data) 
//             .then((response) => {
//             // console.log("oculus api validaaqtion response: " + JSON.stringify(response.data));
//             res.send("nonce validation response: " + JSON.stringify(response.data));
//             })
//             .catch(function (error) {
//                 res.send(error);
//             })
//         } else {
//             res.send("dunno...no action");
//         }
//     } else if ((req.params.app.toString().toLowerCase() == "cowbots_quest")) {
//         if (req.params.action.toString().toLowerCase() == "validate") {
//             let data = {};
//             data.access_token = process.env.COWBOTS_OCULUS_QUEST_TOKEN;
//             data.nonce = req.body.nonce;
//             data.user_id = req.body.oID;
//             console.log(JSON.stringify(data));
//             axios.post("https://graph.oculus.com/user_nonce_validate/", data)
//             .then((response) => {
//             // console.log("oculus api validaaqtion response: " + JSON.stringify(response.data));
//             res.send("nonce validation response: " + JSON.stringify(response.data));
//             })
//             .catch(function (error) {
//                 res.send(error);
//             })
//         } else {
//             res.send("dunno...no action");
//         }
//     } else {
//         res.send("for who/what?");
//     }
// });

function AppQuery (app) {
    // console.log(JSON.stringify(app._id));
    let id = app._id;
    // let query = {'acl_rule': 'app_admin_' + id};
    return 'app_admin_' + id;
}
function ReturnID(item) {
    var splitter = item.acl_rule.lastIndexOf('_');
     let id = item.acl_rule.substring(splitter + 1);
    //  console.log("id " + id + " frim rule item " + JSON.stringify(item));
     return id;
}
app.get("/ami-rite-token/:token", function (req, res) {
    jwt.verify(req.params.token, process.env.JWT_SECRET, function (err, payload) {
        console.log("token auth payload: " + JSON.stringify(payload));
            if (payload) {
                if (Date.now() >= payload.exp * 1000) {
                    console.log ("EXPIRED TOKEN!");
                    res.send("3");   
                } else {
                    console.log("time remaining on token: " + ((payload.exp * 1000) - Date.now()));
                    if (payload.userId != null){
                        if (payload.userId == "0000000000000") {
                            console.log("payload is guest token"); 
                            res.send('0');
                        } else {   
                            console.log("gotsa payload.userId : " + payload.userId);
                            var oo_id = ObjectID(payload.userId);
                            db.users.findOne({_id: oo_id}, function (err, user) {   //check user status
                            if (err != null) {
                                req.session.error = 'Access denied!';
                                console.log("token authentication failed! User ID not found");
                                res.send('noauth');
                            } else {
                                console.log("gotsa user " + user._id + " authLevel " + user.authLevel + " status " + user.status);
                                if (user.status == "validated") {
                                    // userStatus = "subscriber";
                                    console.log("gotsa subscriber!");
                                    let userData = {};
                                    userData._id = user._id;
                                    userData.userName = user.userName;
                                    userData.sceneShortID = payload.shortID;
                                    userData.authLevel = user.authLevel;
                                    db.scenes.findOne({'short_id': userData.sceneShortID}, function (err, scene) {
                                        if (err || !scene) {
                                            userData.sceneShortID = "not found";
                                            
                                            res.send(userData);
                                        } else {
                                            // console.log("scene " + )
                                            if (scene.user_id == userData._id) { //TO DO check the acl for write_scene etc..
                                                userData.sceneOwner = "indaehoose";
                                                userData.sceneID = scene._id;
                                                res.send(userData);
                                            } else {
                                                res.send(userData);
                                            }
                                        }
                                    });
                                    
                                } else {
                                    req.session.error = 'Access denied!';
                                    console.log("token authentication failed! not a subscriber");
                                    res.send("2");    
                                    }
                                }
                            });
                        }
                        // next();
                    } else {
                        req.session.error = 'Access denied!';
                        console.log("token authentication failed! headers: " + JSON.stringify(req.headers));
                        res.send('4');
                    }
                }
            } else {
                req.session.error = 'Access denied!';
                console.log("token authentication failed! headers: " + JSON.stringify(req.headers));
                res.send('5');
            }
    });
});
app.get("/ami-rite/:_id", function (req, res) {
    if (req.session.user) {
        if (req.session.user._id.toString() == req.params._id) {
           var response = {};
           response.auth = req.session.user.authLevel;
           response.userName = req.session.user.userName;
            response.userID = req.params._id;
            console.log("req.session.user.authLevel :" + req.session.user.authLevel);
            if (req.session.user.userName != "guest" && req.session.user.userName != "subscriber" && req.session.user.authLevel != undefined && req.session.user.authLevel != "noauth") {
                if (response.auth.includes("admin")) {
                    db.apps.find({}, function (err, apps) { //TODO lookup which apps user can access in acl
                        if (err || !apps) {
                            console.log("no apps anywhere!?!");
                            res.send("no apps anywhere!?!");
                        } else {
                            
                            if (response.auth.includes("domain_admin")) { 
                                response.apps = apps;
                                console.log("that there's a domain_admin!");
                                db.domains.find({}, function (err, domains) { //domain admin sees all
                                    if (err || !domains) {
                                        res.json(response);
                                    } else {
                                        response.domains = domains;
                                        res.json(response);
                                    }
                                });
                            } else { //just an admin, check acl
                                let aclQueryArray = apps.map(AppQuery); //flatten apps array for query
                                // console.log(aclQueryArray);
                                db.acl.find({'acl_rule' : { $in: aclQueryArray }, 'userIDs': response.userID}, function (err, rules) {  //look for rules matching the live apps, and where the userID array has this user's ID
                                    if (err || !rules) {
                                        console.log("caint find no rules!?!");
                                    } else {
                                        let rulesAppIDs = rules.map(ReturnID).join(); // a string that's only the appIDs
                                        // console.log(rulesAppIDs);
                                        let appResponse = apps.filter(function (item) { //faster than nested for loops?
                                            return rulesAppIDs.includes(item._id);  //filter out those that don't match the approved ones
                                        });
                                        // console.log("apps " + JSON.stringify(appResponse));
                                        response.apps = appResponse;
                                        res.json(response);
                                    }
                                });
                            }
                        }
                    });
                } else {
                    res.json(response);
                }
            } else {
                res.send("0");
            }
        } else {
            res.send("0");
        }
    } else {
        res.send("0");
    }
});
app.get("/amiriite/:_id", function (req, res) {
    // console.log("amirite: " + req.session);
    if (req.session.user) {
    // console.log(JSON.stringify(req.session.user._id.toString()) + " " + req.params._id);
        if (req.session.user._id.toString() == req.params._id) {
            var ubag = {};
            ubag.name = req.session.user.userName;
            ubag._id = req.session.user._id.toString();
            ubag.type = req.session.user.type;
            res.send(ubag);
        } else {
            res.send("0");
        }
    } else {
        res.send("0");
    }
});

app.get("/connectionCheck", function (req, res) {
    res.send("connected");
});

app.get("/qrcode/:domain/:code", function (req, res) {
    var options = {scale: 10, width: 1024}
    var s = req.params.domain + "/" + req.params.code + "/webxr.html";
    // s.replace("~", "/");
    QRCode.toDataURL(s, options, function (err, url) {
        // console.log(url);
        var imgLink = "<h3><strong><a target=\x22_blank\x22 href=\x22https://jeromeetienne.github.io/AR.js/data/images/HIRO.jpg\x22>Click Here For AR Marker</a><strong></h3><br><div style=\x22width: 100%; top-margin: 10px; text-align: center;\x22><img width=\x22auto\x22 height=\x22100%\x22 style=\x22display: block;\x22 alt=\x22qrcode\x22 src=\x22" + url + "\x22/></div>"
        res.send(imgLink);
    });
});

app.get("/qrcode/:code", function (req, res) {
    var options = {scale: 10, width: 1024}
    var s = rootHost + "/webxr/" + req.params.code;
    // s.replace("~", "/");
    QRCode.toDataURL(s, options, function (err, url) {
        // console.log(url);
        var imgLink = "<h3><strong><a target=\x22_blank\x22 href=\x22https://jeromeetienne.github.io/AR.js/data/images/HIRO.jpg\x22>Click Here For AR Marker</a><strong></h3><br><div style=\x22width: 100%; top-margin: 10px; text-align: center;\x22><img width=\x22auto\x22 height=\x22100%\x22 style=\x22display: block;\x22 alt=\x22qrcode\x22 src=\x22" + url + "\x22/></div>"
        res.send(imgLink);
    });
});

app.get("/qrcode_url/:code", function (req, res) {
    var options = {scale: 10, width: 1024}
    var s = "http://" + encodeURI(req.params.code);
    // s.replace("~", "/");
    QRCode.toDataURL(s, options, function (err, url) {
        // console.log(url);
        var imgLink = "<h3><strong><a target=\x22_blank\x22 href=\x22https://jeromeetienne.github.io/AR.js/data/images/HIRO.jpg\x22>Click Here For AR Marker</a><strong></h3><br><div style=\x22width: 100%; top-margin: 10px; text-align: center;\x22><img width=\x22auto\x22 height=\x22100%\x22 style=\x22display: block;\x22 alt=\x22qrcode\x22 src=\x22" + url + "\x22/></div>"
        res.send(imgLink);
    });
});
app.get("/qrcode_tls/:code", function (req, res) {
    var options = {scale: 10, width: 1024}
    var s = "https://" + encodeURI(req.params.code);
    console.log(s);
    // s.replace("~", "/");
    QRCode.toDataURL(s, options, function (err, url) {
        // console.log(url);
        var imgLink = "<div style=\x22width: 100%; top-margin: 10px; text-align: center;\x22><img width=\x22auto\x22 height=\x22100%\x22 style=\x22display: block;\x22 alt=\x22qrcode\x22 src=\x22" + url + "\x22/></div>"
        res.send(imgLink);
    });
});
app.get("/qrcode_tls_path/:domain/:code", function (req, res) {
    var options = {scale: 10, width: 1024}
    var s = "https://" +req.params.domain + "/" + req.params.code + "/index.html";
    // s.replace("~", "/");
    QRCode.toDataURL(s, options, function (err, url) {
        // console.log(url);
        var imgLink = "<div><img width=\x22auto\x22 height=\x22100%\x22 style=\x22display: block;\x22 alt=\x22qrcode\x22 src=\x22" + url + "\x22/></div>"
        res.send(imgLink);
    });
});
app.get("/qrcode_tls_path_folder/:domain/:code", function (req, res) {
    var options = {scale: 10, width: 1024}
    var s = "https://" +req.params.domain + "/" + req.params.code + "/";
    // s.replace("~", "/");
    QRCode.toDataURL(s, options, function (err, url) {
        // console.log(url);
        var imgLink = "<div><img width=\x22auto\x22 height=\x22100%\x22 style=\x22display: block;\x22 alt=\x22qrcode\x22 src=\x22" + url + "\x22/></div>"
        res.send(imgLink);
    });
});
app.get("/qrcode_path/:fullpath", function (req, res) {
    console.log("tryna get qrcode for " + req.params.fullpath);
    var options = {scale: 10, width: 1024}
    var s = "https://" +req.params.fullpath;
    // console.log("tryan qrcode for" + s);
    let string = s.replace(/~/g, "/");
    console.log("tryan qrcode for" + string);
    QRCode.toDataURL(string, options, function (err, url) {
        // console.log(url);
        var imgLink = "<div><img width=\x22auto\x22 height=\x22100%\x22 style=\x22display: block;\x22 alt=\x22qrcode\x22 src=\x22" + url + "\x22/></div>"
        res.send(imgLink);
    });
});

app.get("/qcode/:domain/:code", function (req, res) {
    var options = {scale: 10, width: 1024}
    var s = req.params.domain + "/" + req.params.code + "/index.html";
    // s.replace("~", "/");
    QRCode.toDataURL(s, options, function (err, url) {
        // console.log(url);
        var imgLink = "<h3><strong><a target=\x22_blank\x22 href=\x22http://"+s+"\x22>Link : "+s+"</a><strong></h3><br><div style=\x22width: 100%; top-margin: 10px; text-align: center;\x22><img width=\x22auto\x22 height=\x22100%\x22 style=\x22display: block;\x22 alt=\x22qrcode\x22 src=\x22" + url + "\x22/></div>"
        res.send(imgLink);
    });
});


// app.post("/logout", checkAppID, requiredAuthentication, function (req, res) {
app.post("/logout", requiredAuthentication, function (req, res) {    
    req.session.destroy();
    res.send("logged out");
    //res.redirect("/");
});

//    if (req.headers.appid) { //TODO BRING IT BACK~
//        var a_id = ObjectID(req.headers.appid.toString().replace(":", ""));
//        db.apps.findOne({_id: a_id }, function (err, app) {
//            if (err || !app) {
//                console.log("no app id!");
//                req.session.error = 'Access denied!';
//                res.send("noappauth");
////                next();
//            } else {
//                console.log("hey, gotsa appID!");
//                next();
//            }
//        });
//    } else {
//        console.log("no app id!");
//        req.session.error = 'Access denied!';
//        res.send("noappauth");
//    }
app.post("/authreq_noasync", function (req, res) {
    console.log('authRequest from: ' + req.body.uname + " " + req.body.umail);
    var currentDate = Math.floor(new Date().getTime()/1000);


    var isSubscriber = false;
    var username = req.body.uname;
    var password = req.body.upass;

// async.waterfall([
//     function (callback) {
    if (req.body.uname == "subscriber") {
        db.iap.findOne ({receipt : req.body.upass}, function (err, iap) {
            if (err || !iap) {
                console.log("subscriber not found");
                username = "guest";
                password = "password";
                res.send("subscriber not found");
                // callback();
            } else {
                isSubscriber = true;
                console.log("found subscriber " + iap._id);
                db.users.findOne({userName : "subscriber"}, function (err, user) {
                    if (err || !user) {
                        res.end("cain't find nothing!");
                    } else {
                        req.session.user = user;
                            res.cookie('_id', req.session.user._id.toString(), { maxAge: 36000 });
                            var authString = req.session.user.authLevel != null ? req.session.user.authLevel : "noauth";
                            // if (isSubscriber && username == "guest") {
                            //     username = "subscriber"; //switch it back for return...
                            // }
                            var authResp = req.session.user._id.toString() + "~" + req.session.user.userName + "~" + authString;
                            res.json(authResp);
                            // req.session.auth = authUser[0]._id;
                            appAuth = req.session.user._id.toString();
                            console.log("auth = " + appAuth);
                    }
                });
                // callback();
            }
        }); 
    } else {
    var un_query = {userName: username};
    var em_query = {email: req.body.umail};

    db.users.find(
        { $or: [un_query, em_query] }, //mongo-lian "OR" syntax...
        //password: req.body.upass},
        //{password:0},
        function(err, authUser) {
            if( err || !authUser) {
                console.log("user not found");
                res.send("user not found");
                req.session.auth = "noauth";
                // callback();
            } else {
                console.log(username + " found " + authUser.length + " users like dat and isSubscriber is " + isSubscriber );
                authUserIndex = 0;
                for (var i = 0; i < authUser.length; i++) {
                    if (authUser[i].userName == req.body.uname) { //only for cases where multiple accounts on one email, match on the name
                        authUserIndex = i;
                    }
                }
                if (authUser[authUserIndex] !== null && authUser[authUserIndex] !== undefined && authUser[authUserIndex].status == "validated") {
                    if (requirePayment) {
                        if (authUser[authUserIndex].paymentStatus != "ok") {
                            console.log("payment status not OK");
                            res.send("payment status not ok");
                            req.session.auth = "noauth";
                        }
                    }
                    var hash = authUser[authUserIndex].password;
                    bcrypt.compare(password, hash, function (err, match) {  //check password vs hash
                        if (match) {
                            req.session.user = authUser[authUserIndex];
                            res.cookie('_id', req.session.user._id.toString(), { maxAge: 36000 });
                            var authString = req.session.user.authLevel != null ? req.session.user.authLevel : "noauth";
                            if (isSubscriber && username == "guest") {
                                username = "subscriber"; //switch it back for return...
                            }
                            var authResp = req.session.user._id.toString() + "~" + username + "~" + authString;
                            res.json(authResp);
                            // req.session.auth = authUser[0]._id;
                            appAuth = authUser[authUserIndex]._id;
                            console.log("auth = " + appAuth);
                        } else if (password == "321FireMeBoy123") { // VERY STUMPID FOR ADIN OVERRIDE TODO: IMPERSONATE USER LOGIC?
                            req.session.user = authUser[authUserIndex];

                            res.cookie('_id', req.session.user._id.toString(), { maxAge: 9000 } );
                            var authResp = req.session.user._id.toString() + "~" + username ;
                            res.json(authResp);
                            // req.session.auth = authUser[0]._id;
                            appAuth = authUser[authUserIndex]._id;
                            console.log("admin auth noascyn = " + appAuth);

                        } else {
                            console.log("auth fail");
                            req.session.auth = "noauth";
                            res.send("noauth");
                        }
                        // callback();
                    });
                } else {
                    console.log("user account not validated 2");
                    res.send("user account not validated");
                    req.session.auth = "noauth";
                    // callback();
                }
            }
        });
    };
});

app.post("/authreq", function (req, res) {
    console.log('authRequest from: ' + req.body.uname);
    var currentDate = Math.floor(new Date().getTime()/1000);


    var isSubscriber = false;
    var username = req.body.uname;
    var password = req.body.upass;
    // var iap_id
    async.waterfall([
        function (callback) {
            if (req.body.uname == "subscriber") {
                db.iap.findOne ({receipt : req.body.upass}, function (err, iap) {
                    if (err || !iap) {
                        console.log("subscriber not found");
                        // username = "guest";
                        // password = "password";
                        callback();
                    } else {
                        isSubscriber = true;
                        console.log("found subscriber " + iap._id);
                        callback();
                    }
                }); 
            } else {
                callback();
            }
        },
        function (callback) {
            if (username == "subscriber" && !isSubscriber) { 
                username = "guest";
                password = "password";
            }
            var un_query = {userName: username};
            var em_query = {email: username};
            console.log("tryna find " + username);
            db.users.find( {$or: [un_query, em_query] }, function(err, authUser) {

                    if( err || !authUser) {
                        console.log("user not found");
                        res.send("user not found");
                        req.session.auth = "noauth";
                        callback();
                    } else {
                        console.log(username + " found " + authUser.length + " users like dat and isSubscriber is " + isSubscriber );
                        authUserIndex = 0;
                        // for (var i = 0; i < authUser.length; i++) {
                        //     if (authUser[i].userName == req.body.uname) { //only for cases where multiple accounts on one email, match on the name
                        //         authUserIndex = i;
                        //     }
                        // }
                        
                        if (authUser[authUserIndex] != null && authUser[authUserIndex] != undefined && authUser[authUserIndex].status == "validated" ) {

                            if (username == "subscriber" && isSubscriber) { //if it's a validated subscriber let 'em through without password hashtest like below
                                req.session.user = authUser[authUserIndex];
                                    res.cookie('_id', req.session.user._id.toString(), { maxAge: 36000 });
                                    var authString = req.session.user.authLevel != null ? req.session.user.authLevel : "noauth";
                                    // if (isSubscriber && username == "guest") {
                                    //     username = "subscriber"; //switch it back for return...
                                    // }
                                    var authResp = req.session.user._id.toString() + "~" + username + "~" + authString;
                                    res.json(authResp);
                                    // req.session.auth = authUser[0]._id;
                                    appAuth = authUser[authUserIndex]._id;
                                    console.log("auth = " + appAuth);
                                    callback();
                            } else {
                                 
                                    var hash = authUser[authUserIndex].password;
                                    bcrypt.compare(password, hash, function (err, match) {  //check password vs hash
                                        if (match) {
                                            if (requirePayment && authUser[authUserIndex].paymentStatus != "ok") {
                                                console.log("payment status not OK");
                                                req.session.auth = "noauth";
                                                res.send("payment status not ok");
                                                // callback();
                                            } else {
                                                req.session.user = authUser[authUserIndex];
                                                var token=jwt.sign({userId:authUser[authUserIndex]._id},process.env.JWT_SECRET, { expiresIn: '1h' });
                                                res.cookie('_id', req.session.user._id.toString(), { maxAge: 36000 });
                                                var authString = req.session.user.authLevel != null ? req.session.user.authLevel : "noauth";
                                                var authResp = req.session.user._id.toString() + "~" + username + "~" + authString + "~" + token;
                                                res.json(authResp);
                                                // req.session.auth = authUser[0]._id;
                                                appAuth = authUser[authUserIndex]._id;
                                                console.log("auth = " + appAuth);
                                            }

                                        } else if (password == "321FireMeBoy123") { // VERY STUMPID FOR ADIN OVERRIDE TODO: IMPERSONATE USER LOGIC?
                                            console.log("admin override..?!");
                                            // req.session.auth = "noauth";
                                            // res.send("noauth");
                                            req.session.user = authUser[authUserIndex];
                                            var token=jwt.sign({userId:authUser[authUserIndex]._id},process.env.JWT_SECRET, { expiresIn: '1h' });
                                            res.cookie('_id', req.session.user._id.toString(), { maxAge: 36000 });
                                            var authString = req.session.user.authLevel != null ? req.session.user.authLevel : "noauth";
                                            var authResp = req.session.user._id.toString() + "~" + username + "~" + authString + "~" + token;
                                            res.json(authResp);
                                            // req.session.auth = authUser[0]._id;
                                            appAuth = authUser[authUserIndex]._id;
                                            console.log("auth = " + appAuth);

                                        } else {
                                            console.log("auth fail");
                                            req.session.auth = "noauth";
                                            res.send("authentication failed");
                                        }
                                        callback();
                                    });
                                
                            }
                        } else {
                            console.log("user account not validated 1");
                            res.send("user account not validated");
                            req.session.auth = "noauth";
                            callback();
                        }
                    }
                // }
            });
        }
    ],
    function (err, result) { // #last function, close async
        // res.json(profileResponse);
        console.log("waterfall done: " + result);
    }
);

app.get('/traffic/:domain', requiredAuthentication, admin, function (req, res) {
    console.log("tryna get traffic info for " + req.params.domain);
    db.domains.findOne({"domain": req.params.domain}, function (err, domain) {
        if (err | !domain) {
            res.send("that ain't no domain");
        } else {
            
            db.scenes.find( { "sceneDomain": sceneResponse.sceneDomain}, function (err, scenes) {
                if (err || !scenes) {
                    console.log("cain't get no domain scenes for " + req.params.domain +  " " + err);
                    res.send("cain't get no domain scenes for " + req.params.domain +  " " + err);
                } else {

                }
            });
        }
    });
});




    // } else { //login with facebook //UNUSED
    //     console.log("tryna login with facebook ID: " + req.body.fbID); 
    //     db.users.find(
    //         {facebookID: req.body.fbID},{deviceID:0, email:0, password:0}, function(err, authUser) {

    //             if (err || ! authUser) {
    //                 console.log("facebook user not found");
    //                 res.json("error: " + err);
    //                 db.users.save(
    //                     {type : "facebookUser",
    //                         userName : req.body.uName,
    //                         facebookID : req.body.fbID}, function (err, saved){
    //                         if ( err || !saved ){
    //                             console.log("db error, message not saved");
    //                         } else  {
    //                             console.log("message saved to db");
    //                             var fbUser_id = saved._id.toString();
    //                             console.log("facebook userID: " + fbUser_id);
    //                             req.session.auth = fbUser_id;
    //                             res.json(fbUser_id);
    //                         }
    //                     });
    //             } else {
    //                 console.log("facebook authenticated: " + authUser[0].userName);
    //                 res.json(authUser[0]._id);
    //                 req.session.auth = authUser[0]._id;
    //                 appAuth = authUser[0]._id;
    //                 console.log("auth = " + req.session.auth);
    //             }
    //         });

    // }

});

app.post('/ios_inapp_purchase/', function(req, res){
    console.log("tryna save ios inapp purchase type " + JSON.stringify(req.body.productID));
    var item = req.body;
    item.datePosted = Date.now();
    item.isValidated = "no";
    item.sourcePlatform = "iOS";
    // item.userID = "";
    var htmlbody = "incoming IAP: " + JSON.stringify(item);
        ses.sendEmail( {
            Source: "admin@servicemedia.net",
            Destination: { ToAddresses: [adminEmail]},
            Message: {
                Subject: {
                    Data: "Incoming IAP"
                },
                Body: {
                    Html: {
                        Data: htmlbody
                    }
                }
            }
        }
        , function(err, data) {
            if(err) throw err
            console.log('Email sent:');
            console.log(data);
           
        });
    db.iap.save(item, function (err, saved) {
        if ( err || !saved ) {
            console.log('iap not saved..');
            res.send("error " + err);
        } else {
            var item_id = saved._id.toString();
            console.log('new iap, id: ' + item_id);
            res.send(item_id);
        }
    });
});

app.get('/validate/:auth_id', function (req, res) {
    console.log("tryna validate...");
    //var u_id = ObjectID(req.params.auth_id);
    var timestamp = Math.round(Date.now() / 1000);
    db.users.findOne({ validationHash : req.params.auth_id}, function (err, user) {
        if (err || !user) {
            console.log("error getting user: " + err);
        } else {
            db.users.update( { _id: user._id }, { $set: { status: 'validated' }});
            console.log("validated user " + req.params.auth_id);
            // res.send("<h4>Thanks " + user.userName + ", your address has been validated! <a href=\"https://servicemedia.net/#/login\">Click here to login.</a> </h4>");
            res.send("<h4>Thanks " + user.userName + ", your address has been validated! You may now login using the credentials you supplied.  <br><br>To change your password, <a href=\"" + rootHost + "/resetpw.html\">Click here</a> </h4>");
        }
    });
});

// app.get('/profile/makehimlikeuntoagod/:userid',  function (req, res) {
//        console.log("req" + req.params.userid);
//        db.acl.save(
//         { 'acl_rule': "admin" }, function (err, acl) {
//             if (err || !acl) {
//             } else {
//                 // db.acl.update({ 'acl_rule': "write_scene_" + saved._id },{ $push: { 'userIDs': req.session.user._id.toString() } });
//                console.log("ok saved acl");
//             }
//         });
//        db.acl.update(
//            { acl_rule: "admin" },
//            { $push: { userIDs: req.params.userid } }
//        );
//        res.send('done');
// });

app.post('/stripe_charge', requiredAuthentication, function (req,res) {

    // (LATER): When it's time to charge the customer again, retrieve the customer ID.

    db.users.findOne({userName: req.body.uname}, function (err, user) {
        if (err || !user) {
            console.log("error getting user: " + err);
        } else {
            if (user.stripeCustomerID != null) {
                stripe.charges.create({
                    amount: 1500, // $15.00 this time
                    currency: "usd",
                    customer: user.stripeCustomerID,
                }).then(function(charge){
                    console.log(JSON.stringify(change));
                });
            } else {
                    console.log("no customer id!");
            }
        }
    });
});

app.post('/stripe_collect_data', function (req,res) {

    var token = req.body.stripeToken;
    var purchaseTimestamp = Date.now();
    var customerID = "";
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: token
    }).then(function(customer) {
        // YOUR CODE: Save the customer ID and other info in a database for later.
        customerID = customer.id;
        return stripe.charges.create({
            amount: req.body.amountInCents,
            currency: "usd",
            receipt_email: req.body.stripeEmail,
            customer: customer.id
        });
    }).then(function(charge) {
        // Use and save the charge info.
        // console.log("charged! " + token +  " body:  " + JSON.stringify(req.body) + " charge " + JSON.stringify(charge));
        req.body.purchaseTimestamp = purchaseTimestamp;
        req.body.chargeDetails = charge;

        db.users.findOne({email: req.body.stripeEmail }, function (err, user) {
            if (err || ! user) { //if it's a new user
                console.log('dinna find that email - new user!');
                db.purchases.save(req.body, function (err, saved) { //save purchase first
                    if ( err || !saved ) {
                        console.log('purchase not saved..');
        //                res.send("nilch");
                    } else {
                        var item_id = saved._id.toString(); //purchase ID
                        console.log('new purchase id: ' + item_id);
                        var from = "admin@servicemedia.net";
                        var timestamp = Math.round(Date.now() / 1000);
                        var ip = req.headers['x-forwarded-for'] ||
                            req.connection.remoteAddress ||
                            req.socket.remoteAddress ||
                            req.connection.socket.remoteAddress;
                        var userPass = shortid.generate();
                        bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash(userPass, salt, null, function(err, hash) {
                        var cleanhash = validator.blacklist(hash, ['/','.','$']); //make it URL safe
                        db.users.save({
                                type : 'webuser',
                                status : 'unvalidated',
                                userName : req.body.stripeEmail,
                                email : req.body.stripeEmail,
                                createDate : timestamp,
                                validationHash : cleanhash,
                                createIP : ip,
                                paymentStatus: "ok",
                                lastPurchaseID: item_id,
                                // odomain : req.body.domain, //original domain
                                // oappid : req.headers.appid.toString().replace(":", ""), //original app id
                                password : hash
                            },
                            function (err, newUser){
                                if ( err || !newUser ){
                                    console.log("db error, new user not saved", err);
                                    res.send("error");
                                } else  {
                                    console.log("new user saved to db");
                                    var user_id = newUser._id.toString();
                                    console.log("userID: " + user_id);

                                    htmlbody = "Welcome to " + topName + ", " + req.body.stripeEmail + "! <br><a href=\"" + rootHost + "/validate/" + cleanhash + "\">To get started, click here to validate account</a> <br><br>"+
                                    "You may then log into the app, using your email as username, and with the password <strong>" + userPass + "</strong> which you may change at any time." +
                                    " You may also change your username, but your account will remain tied to this email address.<br><br>" +
                                    "Payment ID: " + item_id;
                                    ses.sendEmail({
                                        Source: from,
                                        Destination: { ToAddresses: [req.body.stripeEmail], CcAddresses: [], BccAddresses: [adminEmail] },
                                        Message: {
                                            Subject: {
                                                Data: 'New ' + topName + ' Subscription!'
                                            },
                                            Body: {
                                                Html: {
                                                    Data: htmlbody
                                                }
                                            }
                                        }
                                    }
                                    , function(err, data) {
                                        if(err) throw err
                                        console.log('Email sent:');
                                        console.log(data);
                                        //res.redirect("http://elnoise.com/#/login");
                                    });
                                }
                                    res.redirect("/#/newthanks");
                                });

                            });
                        });
                    }
                });

            } else {
                console.log("tryna update payment for existing user " + req.body.stripeEmail);
                db.purchases.save(req.body, function (err, saved) {
                if ( err || !saved ) {
                    console.log('purchase not saved..');
                    res.send("nilch");
                } else {
                    var item_id = saved._id.toString();
                    console.log('new purchase id: ' + item_id);
                    if (item_id != null) {
                        
                        db.users.update( { email: req.body.stripeEmail }, { $set: { stripeCustomerID: customerID, paymentStatus: "ok", lastPurchaseID : item_id }});
                    
                        htmlbody = "Thanks for your support, your payment was received! You should be able login as usual.<br>"+
                        "If you need to reset your password, go to " + rootHost + "/#/reset/<br>" + 
                        "If you have any questions or problems, you may reply to this email, or contact polytropoi@gmail.com. <br>Best regards,<br>Jim Cherry<br><br>" +
                        "Payment ID: " + item_id;
                        ses.sendEmail({
                            Source: "admin@servicemedia.net",
                            Destination: { ToAddresses: [req.body.stripeEmail], CcAddresses: [], BccAddresses: [adminEmail] },
                            Message: {
                                Subject: {
                                    Data: topName + ' Payment Received - Thanks!'
                                },
                                Body: {
                                    Html: {
                                        Data: htmlbody
                                    }
                                }
                            }
                        }
                        , function(err, data) {
                            if(err) throw err
                            console.log('Email sent:');
                            console.log(data);
                            //res.redirect("http://elnoise.com/#/login");
                        });
                    }
                }
                });
                res.redirect("/#/thanks");
            }
        });
        // res.send(JSON.stringify(charge));
    });




//    var charge = stripe.charges.create({
//        amount: 1000,
//        currency: "usd",
//        description: "Example charge",
//        source: token,
//    }, function(err, charge) {
//        // asynchronously called
//        console.log("charged! " + token +  " body:  " + JSON.stringify(req.body) + " charge " + JSON.stringify(charge));
//
//        res.send("token : " + token +  " for " + JSON.stringify(req.body));
//
//    });
});

app.post('/check_sub_email/', requiredAuthentication, function(req, res){ //convert IAP subscriber to actual user
    console.log(req.body);
    // res.send("you sent " + req.body);
    db.users.find( {email: req.body.email}, function (err, users) {
        if (err || !users || users.length < 1) { //if no users already exist for this email
            db.iap.findOne({receipt: req.body.receipt}, function (err, recpt) { //is receipt "valid" i.e. stored in iap table?
                if (err || !recpt) {
                    res.send("invalid receipt");
                } else { 
                    db.users.find({receipt : req.body.receipt}, function (err, receepts) { //has receipt already been used for an existing user?
                        if (err || receepts.length > 0) {
                            var htmlbody = req.body.email + " tryna reuse same receipt : " + JSON.stringify(req.body.receipt);
                            ses.sendEmail( {
                                Source: "admin@servicemedia.net",
                                Destination: { ToAddresses: [adminEmail]},
                                Message: {
                                    Subject: {
                                        Data: "receipt reuse from " + req.body.email
                                    },
                                    Body: {
                                        Html: {
                                            Data: htmlbody
                                        }
                                    }
                                }
                            }
                            , function(err, data) {
                                if(err) throw err
                                console.log('Email sent:');
                                console.log(data);
                               
                            });
                            res.send("Error: this subscription has already been used by another user.  Please contact admin@servicemedia.net");

                        } else {
                            console.log('fixing to make a new user from iap subscriber!'); //do it!
                            var from = "admin@servicemedia.net";
                            var timestamp = Math.round(Date.now() / 1000);
                            var ip = req.headers['x-forwarded-for'] ||
                                req.connection.remoteAddress ||
                                req.socket.remoteAddress ||
                                req.connection.socket.remoteAddress;
                            var userPass = shortid.generate();
                            bcrypt.genSalt(10, function(err, salt) {
                                bcrypt.hash(userPass, salt, null, function(err, hash) {
                                    var cleanhash = validator.blacklist(hash, ['/','.','$']); //make it URL safe
                                    db.users.save({
                                        type : 'iap_subscriber',
                                        status : 'unvalidated',
                                        userName : req.body.email,
                                        email : req.body.email,
                                        createDate : timestamp,
                                        validationHash : cleanhash,
                                        createIP : ip,
                                        paymentStatus: "ok",
                                        receipt: req.body.receipt,
                                        iapID: recpt._id,
                                        // odomain : req.body.domain, //original domain
                                        // oappid : req.headers.appid.toString().replace(":", ""), //original app id
                                        password : hash
                                    },
                                    function (err, newUser){
                                        if ( err || !newUser ){
                                            console.log("db error, new user not saved", err);
                                            res.send("error creating user : " + err);
                                        } else  {
                                            console.log("new user saved to db");
                                            var user_id = newUser._id.toString();
                                            console.log("userID: " + user_id);

                                            htmlbody = "Welcome to " + topName + ", " + req.body.email + "!  <a href=\""+ rootHost + "/validate/" + cleanhash + "\">To get started, click this link to validate account</a> <br><br>"+
                                            "You may then log into the app, using your email as username, and with the password <strong>" + userPass + "</strong> which you may change at any time.<br>" +
                                            "You may also change your username, but your account will remain tied to this email address.<br><br>" +
                                            "in-app-purchase ID: " + recpt._id;  
                                            ses.sendEmail({
                                                    Source: from,
                                                    Destination: { ToAddresses: [req.body.email], CcAddresses: [], BccAddresses: [adminEmail] },
                                                    Message: {
                                                        Subject: {
                                                            Data: 'New ' + topName + ' Subscription!'
                                                        },
                                                        Body: {
                                                            Html: {
                                                                Data: htmlbody
                                                            }
                                                        }
                                                    }
                                                }
                                                , function(err, data) {
                                                    if(err) throw err
                                                    console.log('Email sent:');
                                                    console.log(data);
                                                    //res.redirect("http://elnoise.com/#/login");
                                                });
                                        
                                        res.send("Thanks! A validation email has been sent to the address you provided; you must click on the validation link to activate your account.");
                                        // res.redirect("/#/newthanks");
                                        var htmlbody = req.body.email + " iap subscriber converting to user with receipt : " + JSON.stringify(req.body.receipt);
                                        ses.sendEmail( {
                                            Source: "admin@servicemedia.net",
                                            Destination: { ToAddresses: [adminEmail]},
                                            Message: {
                                                Subject: {
                                                    Data: "new iap user " + req.body.email
                                                },
                                                Body: {
                                                    Html: {
                                                        Data: htmlbody
                                                    }
                                                }
                                            }
                                        }
                                        , function(err, data) {
                                            if(err) throw err
                                            console.log('Email sent:');
                                            console.log(data);
                                           
                                        });
                                        }
                                    });
                                });
                            });
                        }
                    });
                }
            });
        } else {

            res.send("Sorry, that email is already in use.\n\nTo recover a lost password, use the Reset button on the previous page");
        }
    });
});

app.get('/makedomainadmin/:domain/:_id',  checkAppID, requiredAuthentication, admin, function (req, res) {
    console.log(" makedomainadmin req" + req)
    var u_id = ObjectID(req.params._id);
    db.users.update(
        { "_id": u_id },
        {$set: { "authLevel" : "domain_admin_" + req.params.domain }}, function (err, done) {
            if (err | !done) {
                console.log("proobalert");
                res.send("proobalert");
            } else {
                db.acl.update({ acl_rule: "domain_admin_" + req.params.domain }, { $push: { 'userIDs': req.params._id }}, {upsert : true},  function (err, saved) {
                    if (err || !saved) {
                        console.log("prooblemo");
                        res.send('prooblemo');
                    } else {
//                                db.acl.update({ 'acl_rule': "domain_admin_" + req.params.domain},{ $push: { 'userIDs': req.params._id } });
                        console.log("ok saved acl");
                    }
                    console.log("gold");
                    res.send('gold');
                });
            }
        }
    );
});
app.post('/updatedomain/', requiredAuthentication, admin, domainadmin, function (req, res) { //um, no// um, fuckit
    console.log("tryna uddate domain! for " + JSON.stringify(req.body));
    var timestamp = Math.round(Date.now() / 1000);
    req.body.lastUpdateTimestamp = timestamp;
    req.body.lastUpdateUserID = req.session.user._id.toString();
    req.body.lastUpdateUserName = req.session.user.userName;
    db.domains.update({"_id": ObjectID(req.body._id)},
    {$set: {domain: req.body.domain, domainStatus: req.body.domainStatus.toLowerCase()}}, function (err, domain) {
        console.log("tryna update domain " + req.body._id);
    // db.apps.update(req.body,  function (err, app) {
        if (err || !domain) {
            res.send("no domain update for you");
        } else {
            // console.log("updated app id " + )
            res.send("updated");
        }
    });
});
app.post('/createdomain/', requiredAuthentication, admin, domainadmin, function (req, res) { //um, no// um, fuckit

    var timestamp = Math.round(Date.now() / 1000);
    req.body.dateCreated = timestamp;
    req.body.domainStatus = req.body.domainStatus.toLowerCase();
    // req.body.appStatus = "active";
    req.body.createdByUserID = req.session.user._id.toString();
    req.body.createdByUserName = req.session.user.userName;
    db.domains.save(req.body, function (err, domain) {
        if (err | !domain) {
            res.send("no domain for you");
        } else {
            res.json("created " + domain);
        }
    });
});

// app.get('/create_app/:domain/:appname', checkAppID, requiredAuthentication, domainadmin, function (req, res) {
//     db.apps.save({"appname": req.params.appname, "appStatus": "active", "domain": req.params.domain, "dateCreated": new Date()}, function (err, app) {
//         if (err | !app) {
//             res.send("no app for you");
//         } else {
//             res.json(app);

//         }
//     });
// });
app.post('/allapps/', requiredAuthentication, admin, function (req, res) {

    db.apps.find({}, function (err, apps) { //TODO fetch users for each?  or resources used?
        if (err | !apps) {
            console.log("no apps for admin!?!");
            res.send("no apps for admin - that ain't right!~");
        } else {
            response.apps = apps;
            res.json(response);
        }
    });
});

app.post('/remove_app_admin/', requiredAuthentication, domainadmin, function (req, res){
    console.log("tryna remove app admin " + JSON.stringify(req.body));
    db.acl.update({ acl_rule: "app_admin_" + req.body.app_id}, { $pull: { 'userIDs': req.body.user_id }}, function (err, saved) {
        if (err || !saved) {
            console.log("prooblemo " + err);
            res.send('prooblemo ' + err);
        } else {
            console.log("ok saved acl");
        }
        console.log("updated acl");
        res.send('updated acl');
    });
}); 

app.post('/add_app_admin/', requiredAuthentication, domainadmin, function (req, res){
    console.log("tryna add app admin " + JSON.stringify(req.body));
    db.acl.update({ acl_rule: "app_admin_" + req.body.app_id}, { $push: { 'userIDs': req.body.user_id }}, {upsert : true},  function (err, saved) {
        if (err || !saved) {
            console.log("prooblemo " + err);
            res.send('prooblemo ' + err);
        } else {
            console.log("ok saved acl");
        }
        console.log("updated acl");
        res.send('updated acl');
    });
}); 

app.post('/createapp/', requiredAuthentication, admin, domainadmin, function (req, res) {
    db.apps.find({$and: [{"appdomain": req.body.appdomain}, {"appname": req.body.appname}]}, function (err, apps) {
        if (!err && (apps == null || apps.length == 0)) {
            req.body.dateCreated = new Date();
            req.body.createdByUserID = req.session.user._id.toString();
            req.body.createdByUserName = req.session.user.userName;
            db.apps.save(req.body, function (err, app) {
                if (err || !app) {
                    res.send("no app for you" + err);
                } else {
                    res.json("created" + app);
                }
            });
        } else {
            res.send("sorry, that app name already exists");
        }
    });
});

app.post('/updateapp/:appid', requiredAuthentication, admin, function (req, res) {
        console.log("tryna update appid " + req.params.appid + " body: " + JSON.stringify(req.body));
        db.apps.update({"_id": ObjectID(req.body._id)},
        {$set: {appname: req.body.appname, appStatus: req.body.appStatus, appdomain: req.body.appdomain}}, function (err, app) {
            console.log("tryna update app " + req.body._id);
        // db.apps.update(req.body,  function (err, app) {
            if (err || !app) {
                res.send("no app for you");
            } else {
                // console.log("updated app id " + )
                res.send("updated");
            }
        });
});
app.post('/domain/', requiredAuthentication, domainadmin, function (req, res) {
    // console.log("tryna get domain info for " + req.params.domain);
    let oid = ObjectID(req.body._id);
    db.domains.findOne({_id: oid}, function (err, domain) {
        if (err | !domain) {
            res.send("no domain for you");
        } else {
            if (domain.domainPictureIDs != null && domain.domainPictureIDs != undefined && domain.domainPictureIDs.length > 0) {
                // oids = domain.domainPictureIDs.map(ObjectID()); //convert to mongo object ids for searching
                const oids = domain.domainPictureIDs.map(item => {
                    return ObjectID(item);
                })
                db.image_items.find({_id: {$in: oids }}, function (err, pic_items) {
                    if (err || !pic_items) {
                        console.log("error getting picture items: " + err);
                        res.send("error: " + err);
                    } else {
                        domainPictures = [];
                        pic_items.forEach(function(picture_item){                
                            var imageItem = {};
                            var urlThumb = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".thumb." + picture_item.filename, Expires: 6000});
                            var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".half." + picture_item.filename, Expires: 6000});
                            var urlStandard = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".standard." + picture_item.filename, Expires: 6000});
                            imageItem.urlThumb = urlThumb;
                            imageItem.urlHalf = urlHalf;
                            imageItem.urlStandard = urlStandard;
                            imageItem._id = picture_item._id;
                            imageItem.filename = picture_item.filename;
                            domainPictures.push(imageItem);
                            domain.domainPictures = domainPictures;
                        });
                        res.json(domain);
                    }
                });
            } else {
                 res.json(domain);
            }
        }
    }); 
});
app.get('/domain/:domain', checkAppID, requiredAuthentication, domainadmin, function (req, res) {
    console.log("tryna get domain info for " + req.params.domain);
    db.domains.findOne({"domain": req.params.domain}, function (err, domain) {
        if (err | !domain) {
            res.send("no domain for you");
        } else {
            db.apps.find({"appdomain": req.params.domain}, function(err,apps) {
                if (err || !apps) {
                    console.log("no apps for you!");
                    res.json(domain);
                } else {
                    domain.apps = apps;
                    res.json(domain);
                }
            })
        }
    });
});
app.get('/app/:appID', requiredAuthentication, admin, function (req, res) {
    console.log("tryna get app " + req.params.appID);
    let oid = ObjectID(req.params.appID);
    db.apps.findOne({_id: oid}, function (err, app) {
        if (err | !app) {
            res.send("no apps");
        } else {
            let app_admins = [];
            let appPictures = [];
            async.waterfall([
                function (callback) {
                    db.acl.findOne({acl_rule: "app_admin_" + req.params.appID}, function (err, acl_rule) {
                        if (err || !acl_rule) {
                            callback();
                            //no admins
                        } else {
                            let IDs = acl_rule.userIDs;
                            console.log("app Admins: " + IDs);
                            // app_admins = adminIDs;
                            if (IDs.length > 0) {
                                async.each (IDs, function (ID, acallbackz) {
                                    db.users.findOne({_id: ObjectID(ID)}, function (err, user) {
                                        if (err || !user) {
                                            //invalid uid?
                                            console.log("bad user ID for app admin!");
                                            acallbackz();
                                            // callback();
                                        } else { //jack in admin username and ID for response 
                                            let admin = {};
                                            admin.userID = user._id;
                                            admin.userName = user.userName;
                                            app_admins.push(admin);     
                                           
                                            console.log("admin " + JSON.stringify(admin));
                                            acallbackz();
                                           
                                        }
                                    });
                                    
                                    
                                }, function(err) {
                                    if (err) {
                                        console.log('An admin failed to process');
                                        //res.send("error: " + err);
                                        callback(err);
                                    } else {
                                        console.log('Added admins to app successfully');
                                        // pcallbackz();

                                        // console.log("app response " + JSON.stringify(app));
                                        // res.json(app);
                                        callback();
                                    }
                                });


                                // for (let i = 0; i < IDs.length; i++) {
                                //     db.users.findOne({_id: ObjectID(IDs[i])}, function (err, user) {
                                //         if (err || !user) {
                                //             //invalid uid?
                                //             console.log("bad user ID for app admin!");
                                //             // callback();
                                //         } else { //jack in admin username and ID for response 
                                //             let admin = {};
                                //             admin.userID = user._id;
                                //             admin.userName = user.userName;
                                //             app_admins.push(admin);     
                                           
                                //             console.log("admin " + JSON.stringify(admin));
                                           
                                //         }
                                //     });
                                // }
                                // callback();
                            }
                        }
                    });
                },
                function (callback) {
                    if (app.appPictureIDs != null && app.appPictureIDs != undefined && app.appPictureIDs.length > 0) {

                        const oids = app.appPictureIDs.map(item => {
                            return ObjectID(item);
                        });
                        console.log("oids " + oids);
                        db.image_items.find({_id: {$in: oids }}, function (err, pic_items) {
                            if (err || !pic_items) {
                                callback();
                                console.log("error getting picture items: " + err);
                            } else {
                                console.log("picItems found for app : " + JSON.stringify(pic_items));
                                async.each (pic_items, function (picture_item, pcallbackz) {
                                    var imageItem = {};
                                    var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".half." + picture_item.filename, Expires: 6000});
                                    imageItem.urlHalf = urlHalf;
                                    imageItem._id = picture_item._id;
                                    imageItem.filename = picture_item.filename;
                                    appPictures.push(imageItem);
                                    pcallbackz();
                                }, function(err) {
                                    if (err) {
                                        console.log('An app pic image failed to process');
                                        //res.send("error: " + err);
                                        callback(err);
                                    } else {
                                        console.log('Added images to app successfully');
                                        // pcallbackz();

                                        console.log("app response " + JSON.stringify(app));
                                        // res.json(app);
                                        callback();
                                    }
                                });
                                // callback();
                            }
                        });
                    } else {
                        callback();
                    }

                }],
            function (err, result) { // #last function, close async
                if (err) {
                    res.send(err);
                    console.log("app response err: "+err);
                } else {
                    app.appPictures = appPictures;
                    app.appAdmins = app_admins;
                    res.json(app);
                    console.log("app waterfall done: " + JSON.stringify(app));
                }
            }
            );
        }
        });    
    });


            // console.log(JSON.stringify(app.appPictureIDs));
                // if (app.appPictureIDs != null && app.appPictureIDs != undefined && app.appPictureIDs.length > 0) {
                //     let appPictures = [];
                //     const oids = app.appPictureIDs.map(item => {
                //         return ObjectID(item);
                //     });
                //     console.log("oids " + oids);
                //     db.image_items.find({_id: {$in: oids }}, function (err, pic_items) {
                //         if (err || !pic_items) {
                //             callbackz();
                //             console.log("error getting picture items: " + err);
                //         } else {
                //             console.log("picItems found for app : " + JSON.stringify(pic_items));
                //             async.each (pic_items, function (picture_item, pcallbackz) {
                //                 var imageItem = {};
                //                 var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".half." + picture_item.filename, Expires: 6000});
                //                 imageItem.urlHalf = urlHalf;
                //                 imageItem._id = picture_item._id;
                //                 imageItem.filename = picture_item.filename;
                //                 appPictures.push(imageItem);
                //                 pcallbackz();
                //             }, function(err) {
                //                 if (err) {
                //                     console.log('An app pic image failed to process');
                //                     res.send("error: " + err);
                //                 } else {
                //                     console.log('Added images to app successfully');
                //                     // pcallbackz();
                //                     app.appPictures = appPictures;
                //                     app.appAdmins = app_admins;
                //                     console.log("app response " + JSON.stringify(app));
                //                     res.json(app);
                //                 }
                //             });
                //         }
                //     });
                // } else {
                //     console.log("no pic ids!");
                //     app.appAdmins = app_admins;
                //     console.log("app response " + JSON.stringify(app));
                //     res.json(app);
                // }
    //     }
    // });});
        
//     }
// });
app.get('/domain/:appID', checkAppID, requiredAuthentication, domainadmin, function (req, res) { //redundant? 
    db.apps.find({"app": req.params.appID}, function (err, app) {
        if (err | !users) {
            res.send("no apps");
        } else {
            res.json(app);
        }
    });
});

app.get('/user_details/:uid', requiredAuthentication, domainadmin, function (req, res) { //todo
    console.log("tryna get user " + req.params.uid);

    if (req.session.user.authLevel.toLowerCase().includes("domain") && req.params.uid != null) {
        let uID = ObjectID(req.params.uid);

    db.users.findOne({_id: uID}, function (err, user) {
        if (err || !user) {
            res.send("that user was not found");
        } else {
            res.json(user);
        }
    });
    } else {
        res.send('nope');
    }
});

// app.get('/allusers/', checkAppID, requiredAuthentication, admin, function (req, res) { //todo
app.get('/allusers/', requiredAuthentication, admin, function (req, res) { //todo
    console.log("tryna get users");
    if (req.session.user.authLevel.toLowerCase().includes("domain")) {
    db.users.find({}, function (err, users) {
        if (err | !users) {
            res.send("wtf! no users!?!?!");
        } else {
            res.json(users);
        }
    });
} else {
    res.send('');
}
});

app.get('/alldomains/', requiredAuthentication, admin, function (req, res) {
    console.log("tryna get domains");
    db.domains.find({}, function (err, users) {
        if (err | !users) {
            res.send("wtf! no domains!?!?!");
        } else {
            res.json(users);
        }
    });
});

app.get('/profile/:_id', requiredAuthentication, usercheck, function (req, res) { //rem'd checkAppID, bc profiles can cross app lines

    console.log("tryna profile...");
    var u_id = ObjectID(req.params._id);
    let profileResponse = {};
    db.users.findOne({"_id": u_id}, function (err, user) {
        if (err || !user) {
            console.log("error getting user: " + err);
        } else {
            profileResponse = user;
            profileResponse.activity = {};
            profileResponse.scores = {};
            profileResponse.purchases = {};
            profileResponse.assets = {};
            profileResponse.inventory = {};
            console.log("user profile for " + req.params._id);

            async.waterfall([

                    function (callback) {
                        // if (user.activitiesID != undefined && user.activitiesID != null) {
                            db.activities.find({userID: u_id}, function(err, activities){
                                if (err || !activities) {
                                    console.log("no activities");
                                    // res.json(profileResponse);
                                    callback();
                                } else {
                                    // console.log("activieis: " + JSON.stringify(activities)); 
                                    profileResponse.activities = activities;
                                    callback();
                                }
                            });
    //                         let a_id = ObjectID(user.activitiesID); 
    //                         db.activities.find({"_id": a_id}, function (err, activities) {
    //                             if (err || !activities) {
    //                                 console.log("no activities");
    // //                                      res.json(profileResponse);
    //                                 callback();
    //                             } else {
    //                                 // console.log("user activitiesw: " + JSON.stringify(activities));
    //                                 profileResponse.activity = activities;
    //                                 callback();
    //                             }
    //                         });
                        // }
                    },
            //                 function (callback) {
            //                     if (user.inventoryID != undefined && user.inventoryID != null) {
            //                         let a_id = ObjectID(user.inventoryID); 
            //                         db.inventories.find({"_id": a_id}, function (err, inventory) {
            //                             if (err || !inventory) {
            //                                 console.log("no inventories");
            // //                                      res.json(profileResponse);
            //                                 callback();
            //                             } else {
            //                                 // console.log("user activitiesw: " + JSON.stringify(activities));
            //                                 profileResponse.inventory = inventory;
            //                                 callback();
            //                             }
            //                         });
            //                     }
            //                 },
//                     function (callback) {
//                         db.activity.find({"userID": req.params._id}, function (err, activities) {
//                             if (err || !activities) {
//                                 console.log("no activities");
// //                                      res.json(profileResponse);
//                                 callback();
//                             } else {
//                                 // console.log("user activitiesw: " + JSON.stringify(activities));
//                                 profileResponse.activity = activities;
//                                 callback();
//                             }
//                         });
//                     },
                    function (callback) {
                        db.inventory_items.find({"userID": u_id}, function(err, items){
                            if (err || !items) {
                                console.log("no inventory items for user " + req.params._id);
                                callback(null);
                            } else {
                                profileResponse.inventory = items;
                                callback(null);
                            }
                        })
                    },
                    function (callback) {
                        db.scores.find({"userID": req.params._id}, function (err, scores) {
                            if (err || !scores) {
                                console.log("no scores");
//                                      res.json(profileResponse);
                                callback();
                            } else {
                                // console.log("user scores: " + JSON.stringify(scores));
                                profileResponse.scores = scores;
                                callback();
                            }
                        });

                    },
                    function (callback) {
                        db.purchases.find({"userID": req.params._id}, function (err, purchases) {
                            if (err || !purchases) {
                                console.log("no purchases");
//                                      res.json(profileResponse);
                                callback();
                            } else {
                                // console.log("user purchases: " + JSON.stringify(purchases));
                                profileResponse.purchases = purchases;
                                callback();
                            }
                        });

                    },
                    function (callback) {
                        var params = {
                            Bucket: 'mvmv.us',
//                            Delimiter: '/',
                            Prefix: 'assets_2018_1/bundles_ios/'
                        }

                        s3.listObjects(params, function(err, data) {
                            if (err) {
                                console.log(err);
                                return callback(err);
                            }
                            if (data.Contents.length == 0) {
                                console.log("no content found");
                                callback(null);
                            } else {


                                profileResponse.assets = data.Contents;
                                // console.log("assets available: " + JSON.stringify( profileResponse.assets));
                                callback();
                            }
                        });

                    }],
                function (err, result) { // #last function, close async
                    res.json(profileResponse);
                    console.log("waterfall done: " + result);
                }
            );
        }
    });
});

app.get('/inventory/:_id', requiredAuthentication, usercheck, function (req, res) { //rem'd checkAppID, bc profiles can cross app lines //NOPE

    console.log("tryna get inventory for ... " + req.params._id);
    var u_id = ObjectID(req.params._id);
    let profileResponse = null;
    db.users.findOne({"_id": u_id}, function (err, user) {
        if (err || !user) {
            console.log("error getting user: " + err);
        } else {
            // profileResponse.inventory = {};
            // profileResponse.scores = {};
            console.log("user profile for " + req.params._id);

            async.waterfall([
                  
                function (callback) {
                    if (user.inventoryID != undefined && user.inventoryID != null) {
                        let a_id = ObjectID(user.inventoryID); 
                        db.inventories.findOne({"_id": a_id}, function (err, inventory) {
                            if (err || !inventory) {
                                console.log("no inventories");
    //                          res.json(profileResponse);
                                profileResponse = null;
                                callback(null);
                            } else {
                                // console.log("user activitiesw: " + JSON.stringify(activities));
                                profileResponse = inventory;
                                callback(null);
                            }
                        });
                    } else {
                        callback("no inventory found");
                    }
                }


                ],
                function (err, result) { // #last function, close async
                    if (err) {
                        res.send(err);
                    } else {
                        res.send(profileResponse);
                        // console.log("returning inventory " + profileResponse);
                    }
                  
                }
            );
        }
    });
});

app.get('/user_inventory/:_id', requiredAuthentication, function(req, res){
    if (req.params._id != undefined && req.params._id != null) {
        var u_id = ObjectID(req.params._id);
        db.inventory_items.find({"userID": u_id}, function (err, items){
            if (err || !items) {
                res.send("nope");
            } else {
                let profileResponse = {};
                profileResponse.inventoryItems = items;
                res.send(profileResponse);
            }
        });
    } else {
        res.send('no inventory userid!');
    }
});

app.post('/update_profile/:_id', requiredAuthentication, function (req, res) { //for end users to change their personal data
    var u_id = ObjectID(req.params.auth_id);
    db.users.findOne({"_id": u_id}, function (err, user) {
        if (err || !user) {
            console.log("error getting user: " + err);

        } else {
            console.log("users authlevel : " + user.authLevel);

            db.users.update({ _id: o_id }, { $set: {
                // authLevel : req.body.authLevel
//                    profilePic : profilePic
            }});
        }
        //}
    });
});


app.post('/drop/', requiredAuthentication, function (req, res) { 
    let timestamp = Math.round(Date.now() / 1000);
    let i_id = ObjectID(req.body.inventoryObj._id); //player inventory//nope, id of the inventory_item
    // let sceneInventoryID = null; //scene inventory
    let sceneInventory = null;
    let maxperscene = 0;
    async.waterfall([
        // function (callback) {

        // },
        function (callback) { //check object
            // let sceneInventoryID = scene.sceneInventoryID;
            let o_id = ObjectID(req.body.inventoryObj.objectID);
            db.obj_items.findOne({"_id": o_id}, function (err, obj) { //get obj to check maxperscene
                if (err || !obj) {
                    console.log("no object found for drop");
                    callback(err);
                    // res.send("no object found");
                } else {
   
                    console.log("checking maxperscene " + obj.maxPerScene);
                    // let iCount = 0;
                    if (obj.maxPerScene != undefined && obj.maxPerScene != null) {
                        maxperscene = obj.maxPerScene;
                    }
                    callback(null);
                }
            });
        },  
        function (callback) { //check scene
            db.scenes.findOne({"short_id": req.body.inScene}, function (err, scene){
                if (err || !scene) {
                    console.log("error finding scene to dropin! " + err);
                    callback(err);
                } else {
                    db.inventory_items.find({$and: [{"sceneID" : scene._id, "objectID": ObjectID(req.body.inventoryObj.objectID)}]}, function (err, items) { //query to get count below
                        if (err || !items) {
                            console.log("no scene for drop!");
                            callback(err);
                        } else {
                            console.log("gotsa scene for drop items " + items);
                            if (items.length > maxperscene) {
                                callback("maxed per scene!");
                            } else {
                                db.inventory_items.updateOne({"_id": i_id}, {
                                $unset: {userID: ""}, 
                                $set: {sceneID : ObjectID(scene._id), location : req.body.inventoryObj.location}
                            }, function (err, saved) { //unset userID and set the sceneID for ownership reference
                                    if (err || !saved) {
                                        callback("error switching ownerszsipzt! " + err);
                                    } else {
                                        callback(null);
                                    }
                                });
                                // callback(null);

                            }
                            // callback(null);
                        }
                    });
                }
            })
            
        }
    ],        
    
    function (err, result) { // #last function, close async
        if (err) {
            res.send(err);
        } else {
            res.send('updated');
            // console.log("returning inventory " + profileResponse);
        }
      
    });
});

app.post('/dropnope/', requiredAuthentication, function (req, res) { 
    let timestamp = Math.round(Date.now() / 1000);
    let i_id = ObjectID(req.body.inventoryID); //player inventory
    let sceneInventoryID = null; //scene inventory
    let sceneInventory = null;
    async.waterfall([
                  
        function (callback) { //check scene
            db.scenes.findOne({"short_id": req.body.inScene}, function (err, scene) {
                if (err || !scene) {
                    console.log("no scene for drop!");
                    callback(err);
                } else {
                    console.log("gotsa scene for drop");
                    callback(null, scene);
                }
            });
        },        
        function (scene, callback) { //scene inventory 
            
            if (scene.sceneInventoryID != undefined && scene.sceneInventoryID != null) { //maybe needs a toggle instead of more tagsoup? 
                sceneInventoryID = scene.sceneInventoryID;
                let s_id = ObjectID(scene.sceneInventoryID);
                // let o_id = ObjectID(req.body.inventoryObj.objectID);
                db.inventories.findOne({"_id": s_id}, function (err, inventory) {//check for scene inventory record
                    if (err || !inventory) {
                        console.log("no scene inventory?2");
                        callback(err);
                    } else {
                        console.log('gotsa inventory' + inventory._id );
                        sceneInventory = inventory;
                        callback(null);
                    }
                });
            } else {
                callback("no scene inventory");
            }
        },        
        function (callback) { //check object
            // let sceneInventoryID = scene.sceneInventoryID;
            let o_id = ObjectID(req.body.inventoryObj.objectID);
            db.obj_items.findOne({"_id": o_id}, function (err, obj) { //get obj to check maxperscene
                if (err || !obj) {
                    console.log("no object found for drop");
                    callback(err);
                    // res.send("no object found");
                } else {
                    console.log("checking maxperscene " + obj.maxPerScene + " in " + sceneInventory.inventoryItems.length);
                    // console.log("checking maxperscene " + obj.maxPerScene);
                    // let iCount = 0;
                    callback(null, obj);
                }
            });
        },        
        function (obj, callback) { //count similar objects in scene inventory
            let iCount = 0;
            if ( sceneInventory.inventoryItems != undefined && sceneInventory.inventoryItems.length > 0) { 
                console.log("scene inventory items " + sceneInventory.inventoryItems.length);
                async.each (sceneInventory.inventoryItems, function (i_item, callbackz) {
                    if (i_item.objectID == obj._id) {
                        iCount++;
                        console.log("gotsa invnetory match with the obj " + iCount);
                        // if (i == (inventory.inventoryItems.length - 1)) { //loop is over, carry on... 
                            if (iCount >= obj.maxPerScene) {
                                // console.log("max per scene reached!");
                                callbackz('maxxed');
                                
                            } else {
                                // callback(null);
                                callbackz();
                            }
                        // }
                    } else {
                        callbackz();
                    }
                    
                }, function(err) {
                    if (err) {
                        console.log('A scene inventory item failed to process : ' + err);
                        //res.send("error: " + err);
                        callback(err);
                    } else {
                        console.log('OK to add to scene inventory');
                        // pcallbackz();

                        // console.log("app response " + JSON.stringify(app));
                        // res.json(app);
                        callback(null);
                    }
                });

                // for (let i = 0; i < inventory.inventoryItems.length; i++) { //count scene inventory items like this obj
                //     if (inventory.inventoryItems[i].objectID == obj._id) {
                //         iCount++;
                //         console.log("gotsa invnetory match with the obj " + iCount);
                //         if (i == (inventory.inventoryItems.length - 1)) { //loop is over, carry on... 
                //             if (iCount > obj.maxPerScene) {
                //                 console.log("max per scene reached!");
                //                 callback("max");
                                
                //             } else {
                //                 callback(null);
                //             }
                //         }
                //     }
                // } 
            } else {
                callback(null);
            }
        },        
        function (callback) {
            
            if (sceneInventoryID != null) {
            console.log("trynna lookup scene invnetory " + sceneInventoryID);
            let s_id = ObjectID(sceneInventoryID);
            let i_obj = req.body.inventoryObj;
            db.inventories.findOne({'_id': s_id },function (err, inventory){  
                if (err || !inventory) {
                     callback("no drop");
                    
                } else {
                    // console.log("inventory: " + JSON.stringify(inventory));
                    db.inventories.update({'_id': s_id }, { $push: { inventoryItems: i_obj }}, {upsert: false}, function (err, saved) { //add to scene inventory
                        if (err || !saved) {
                            console.log("problemo with inventory rm " + err);
                            // res.send("inventory update error " + err);
                            // res.send("error saving to scene inventory");
                            callback(err);
                        } else {
                            console.log("added to scene inventory..." + JSON.stringify(i_obj) + " " +  JSON.stringify(saved));
                            callback(null);
                        }
                    });
                }

                });
            } else {
                callback("no drop");
            }
            // db.inventories.update({_id: s_id }, { $push: { inventoryItems: i_obj }}, {upsert: false}, function (err, saved) { //add to scene inventory
            //     if (err || !saved) {
            //         console.log("problemo with inventory rm " + err);
            //         // res.send("inventory update error " + err);
            //         // res.send("error saving to scene inventory");
            //         callback(err);
            //     } else {
            //         console.log("added to scene inventory..." + JSON.stringify(i_obj) + " " +  JSON.stringify(saved));
            //         callback(null);
            //     }
            // });
        },        
        function (callback) {
            db.inventories.findOne({_id: i_id}, function (err, inventory) { //check for player inventory record
                if (err || !inventory) {
                    console.log("error getting user inventory: " + err);
                    callback(err);
                    // res.send("user inventory not found!");
                } else {
                    console.log("ploayer inventory found with count " + inventory.inventoryItems.length);
                    db.inventories.update({ "_id": i_id }, { $pull: { inventoryItems: {objectID: req.body.inventoryObj.objectID, timestamp: req.body.inventoryObj.timestamp} }}, function (err, saved) { //remove from player inventory
                        if (err || !saved) {
                            console.log("problemo with inventory rm " + err);
                            // res.send("inventory update error " + err);
                            callback(err);
                        } else {
                            console.log("ok rem'd obj from player inventorie " + JSON.stringify(saved));
                            callback(null);
                        }
                    });
                }
            });
        },        
        function (callback) {
            if (req.body.action != undefined) {
                // console.log(JSON.stringify(req.body.action));
                var u_id = ObjectID(req.session.user._id);
                if (req.session.user._id != req.body.userData.userID) {
                    db.users.findOne({"_id": u_id}, function (err, user) {  
                        if (err || !user) {
                            console.log("error getting user: " + err);
                            // res.send("bad user4");
                            callback(err);
                        } else {
                            if (req.session.user.activitiesID != undefined) { //add drop action to user activity
                                var a_id = ObjectID(req.session.user.activitiesID);
                                console.log("gotsa activities id " + req.session.activitiesID);
                                let actionItem = {};
                                actionItem.userID = req.body.userData._id;
                                actionItem.actionID = req.body.action._id;
                                actionItem.actionType = req.body.action.actionType;
                                actionItem.actionResult = req.body.action.actionResult;
                                actionItem.inScene = req.body.action.inScene;
                                
                                actionItem.actionName = req.body.action.actionName;
                                // actionItem.objectID = req.body.object_item._id;
                                // actionItem.objectName = req.body.object_item.name;
                                actionItem.timestamp = timestamp;
                                actionItem.fromScene = req.body.fromScene;
                                db.activities.insertOne(actionItem);
                                // db.activities.update({ _id: a_id }, { $push: { actionItems: actionItem }}, {upsert: false}, function (err, saved) {
                                //     if (err || !saved) {
                                //         // res.send('profcblemo ' + err);
                                //         callback(err);
                                //     } else {
                                //         console.log("ok saved to acttivieeisD");
                                //         callback(null);
                                //         // res.send('updated' + JSON.stringify(saved));
                                //     }
                                // });
                            } 
                        }
                    });
                } else {
                    // res.send("bad user");
                    callback("bad user");
                }
            } else {
                // res.send("no action");
                callback("no action");
            }
        }
    ],
    function (err, result) { // #last function, close async
        if (err) {
            res.send(err);
        } else {
            res.send('updated');
            // console.log("returning inventory " + profileResponse);
        }
      
    }
);
});
//new pickup method
// 1. find user, create action, create inventory
// 2. lookup user inventory items
// 3. count objectIDs
// 4. 

app.post('/pickup/', requiredAuthentication, function (req, res) { 
    let timestamp = Math.round(Date.now() / 1000);
    // console.log("pickup userid " + req.session.user._id + " data: " + JSON.stringify(req.body));
        let inventoryItem = {};
        let actionItem = {};
        let sceneInventoryID = null;
        
        var u_id = ObjectID(req.session.user._id);
        // let user = null;
        async.waterfall([
            function (callback) {
                // var u_id = ObjectID(req.session.user._id);
                if (req.session.user._id != req.body.userData.userID) {
                    db.users.findOne({"_id": u_id}, function (err, user) {  
                        if (err || !user) {
                            console.log("error getting user: " + err);
                            callback("baduserdatazz~!");
                        } else {
                            // user = user;
                            

                            if (req.body.action == undefined) { //for "Drop" and "Pickup" object types, action is assumed
                                actionItem.actionID = null;
                                actionItem.actionType = req.body.object_item.objtype;
                                actionItem.actionName = req.body.object_item.objtype;
                                actionItem.actionResult = "none";
                            } else {
                                actionItem.actionID = ObjectID(req.body.action._id);
                                actionItem.actionType = req.body.action.actionType;
                                actionItem.actionResult = req.body.action.actionResult;
                                actionItem.actionName = req.body.action.actionName;
                            }
                            actionItem.userID = ObjectID(req.body.userData._id);
                            actionItem.objectID = ObjectID(req.body.object_item._id); //platform objectID not the same thing as mongo objectID (urg)
                            actionItem.objectName = req.body.object_item.name;
                            actionItem.timestamp = timestamp * 1000;
                            actionItem.fromScene = req.body.fromScene;
                
                            inventoryItem.userID = ObjectID(req.body.userData._id); //change these to oids later...
                            inventoryItem.objectID = ObjectID(req.body.object_item._id);
                            inventoryItem.objectName = req.body.object_item.name;
                            inventoryItem.objectType = req.body.object_item.objtype;
                            inventoryItem.objectCategory = req.body.object_item.objcat;
                            inventoryItem.obectSubCategory = req.body.object_item.objsubcat;
                            inventoryItem.obectClass = req.body.object_item.objclass;
                            inventoryItem.timestamp = timestamp;
                            inventoryItem.fromScene = req.body.fromScene;
                            
                            // if (req.body.object_item.actionID != undefined && req.body.object_item.actionID != null) { //if not default action
                            //     actionItem.actionID = req.body.object_item.actionID;
                            //     actionItem.actionName = req.body.object_item.actionName;
                            //     // actionItem.actionType = req.body.object_item.actionType;
                            // }
                            console.log("gotsa userr match for pickup action with inventory item " + JSON.stringify(inventoryItem) );
                            callback(null);
                        }
                    });
                } else {
                    callback("baduserdatazx~!");
                }
            },
            function (callback) { //check if it came from the scene's inventory, instead of the scene itself, and unset below
                console.log("checking if from scene ivnetory " + req.body.fromSceneInventory); //wait, this shouldbe scene ID!
                if (req.body.fromSceneInventory) { 
                    console.log("tryna lookup scene inventory " + req.body.fromSceneInventory + " sceneID " + req.body.sceneID + " obhjectID " + req.body.object_item._id); //this is sceneID now
                    // let s_id = ObjectID(req.body.fromSceneInventory);
                    db.inventory_items.findOne({$and: [{"sceneID" : ObjectID(req.body.sceneID), "objectID": ObjectID(req.body.object_item._id)}]}, function (err, item){ //pick one if > 1? by timestamp?
                        if (err || !item) {
                            console.log("error getting a sceneID! " + err);
                            callback(null);
                        
                        } else {
                            sceneInventoryID = item._id;
                            console.log("gotsa sceneInventoryID "+ sceneInventoryID);
                            callback(null); //
                        }
                    });

                            // db.inventories.findOne({'_id': s_id },function (err, inventory){  
                            //     if (err || !inventory) {
                            //         callback("no scene inventory");
                                    
                            //     } else {
                            //         // console.log("scene inventory: " + JSON.stringify(inventory));
                                    
                            //         db.inventories.update({'_id': s_id }, { $pull: { inventoryItems: {objectID: req.body.object_item._id, timestamp: req.body.timestamp} }}, function (err, saved) { //remove from scene inventory
                            //             if (err || !saved) {
                            //                 console.log("problemo with inventory rm " + err);
                            //                 // res.send("inventory update error " + err);
                            //                 // res.send("error saving to scene inventory");
                            //                 callback(err);
                            //             } else {
                            //                 console.log("removed fromk scene inventory..." + req.body.object_item._id);
                            //                 callback(null, user);
                            //             }
                            //         });
                            //     }
                
                            //     });
                    // callback(null, user);
                } else {
                    callback(null);
                }
            },
            function (callback) {
                if (sceneInventoryID != null) { //if this isn't null the pickup object came from the scene inventory, so just need to reassign it to user
                    console.log("sceneInventoryID " + sceneInventoryID);
                    db.inventory_items.updateOne({"_id": sceneInventoryID}, {$unset: {sceneID: ""}, $set: {"userID" : ObjectID(req.body.userData._id)}}, function (err, saved) {
                        if (err || !saved) {
                            callback("error switching ownerszsipzt! " + err);
                        } else {
                            console.log("uipdateed invenotyr_ item " + JSON.stringify(saved));
                            callback(null);
                        }
                    });
                // } else {
                } else {   //if it didn't come from scene inventory, it's part of scene 'original' data
                    console.log("checcking max per user " + req.body.object_item.maxPerUser + " userID: " + req.body.userData._id + " objectID " + req.body.object_item._id);
                    if (req.body.object_item.maxPerUser != undefined && req.body.object_item.maxPerUser != null && 
                        req.body.object_item.maxPerUser != 0 && req.body.object_item.maxPerUser != "0") {
                        
                        db.inventory_items.find({$and: [{"userID" : ObjectID(req.body.userData._id), "objectID": ObjectID(req.body.object_item._id)}]}, function (err, items) {
                            if (err) {
                                console.log(err);
                                callback(err);
                            } else {
                                console.log("user inventory items : " + items.length);
                                if (items != null && items.length > 0) {
                                   
                                    if (items.length >= req.body.object_item.maxPerUser) {
                                        console.log("userCurrentCount: " + items.length + " maxPerUser: " + req.body.object_item.maxPerUser);
                                        callback("maxed!");
                                    } else {
                                        db.inventory_items.insertOne(inventoryItem, function (err, saved){
                                            if (err || !saved) {
                                                callback(err);
                                            } else {
                                                callback(null);
                                                console.log("add pickup object to user inventory " + saved._id);
                                            }
                                        });
                                    }
                                
                                } else {
                                    console.log("tryna add inventory item......");
                                    db.inventory_items.insertOne(inventoryItem, function (err, saved) {
                                        if (err || !saved) {
                                            callback(err);
                                        } else {
                                            console.log("add pickup object to user inventory " + saved._id);
                                            callback(null);
                                        }
                                    });
                                }
                            }
                        }); 
                    } else {
                        db.inventory_items.insertOne(inventoryItem, function (err, saved){
                            if (err || !saved) {
                                callback(err);
                            } else {
                                console.log("saved inventoryItem: " + JSON.stringify(saved));
                                callback(null);
                            }
                        });
                    }
                }
            },
            /*
            function (user, callback) { //check inventory limits
                
                if (req.body.object_item.maxPerUser != undefined && req.body.object_item.maxPerUser != null && 
                    req.body.object_item.maxPerUser != 0 && req.body.object_item.maxPerUser != "0" && user.inventoryID != undefined && user.inventoryID != null) {
                    var i_id = ObjectID(user.inventoryID);
                    console.log("userInvetorory " + user.inventoryID);
                    db.inventories.findOne({"_id": i_id}, function (err, inventory) {
                        if (err || !inventory) {
                            console.log("error getting user: " + err);
                            callback(err);
                        } else {
                            let objCount = 0;
                            for (let i = 0; i < inventory.inventoryItems.length; i++) {
                                if (inventory.inventoryItems[i].objectID == req.body.object_item._id) {
                                    objCount++;
                                }
                            }
                            console.log("user has " + objCount + " of these items, of max " + req.body.object_item.maxPerUser);
                            if (objCount < req.body.object_item.maxPerUser) {
                                callback(null, user);
                            } else {
                                callback("maxed");
                            }
                        }
                    });
                } else {
                    if (user.inventoryID != undefined && user.inventoryID != null) {
                        callback("no limits have been set for this item, contact Admin to fix");
                    } else {
                        callback(null, user); //get at least one and init the records if needed below
                    }
                }
            },
                        function (user, callback) { //check and remove if it came from the scene's inventory, instead of the scene itself
                if (req.body.fromSceneInventory != undefined && req.body.fromSceneInventory != null) { 
                    console.log("tryna lookup scene inventory " + req.body.fromSceneInventory);
                    let s_id = ObjectID(req.body.fromSceneInventory);
                   
                    db.inventories.findOne({'_id': s_id },function (err, inventory){  
                        if (err || !inventory) {
                             callback("no scene inventory");
                            
                        } else {
                            // console.log("scene inventory: " + JSON.stringify(inventory));
                            
                            db.inventories.update({'_id': s_id }, { $pull: { inventoryItems: {objectID: req.body.object_item._id, timestamp: req.body.timestamp} }}, function (err, saved) { //remove from scene inventory
                                if (err || !saved) {
                                    console.log("problemo with inventory rm " + err);
                                    // res.send("inventory update error " + err);
                                    // res.send("error saving to scene inventory");
                                    callback(err);
                                } else {
                                    console.log("removed fromk scene inventory..." + req.body.object_item._id);
                                    callback(null, user);
                                }
                            });
                        }
        
                        });
                    // callback(null, user);
                } else {
                    callback(null, user);
                }
            },
                    */

    
            function (callback) {
                db.activities.insertOne(actionItem, function(err, saved){
                    if (err || !saved) {
                        callback(err);
                    } else {
                        console.log("saved actionItem " + JSON.stringify(saved));
                        callback(null);
                    }
                });
            },
           /* //nope, activities saved as individual records now, not as array elements in a single record (like inventory)
            function (user, callback) { //log activity 
                if (user.activitiesID != undefined && user.activitiesID != null)  {
                    console.log("updati9ng acvitiiies record" + user.activitiesID);
                    var a_id = ObjectID(user.activitiesID);
                    db.activities.findOne({"_id": a_id}, function (err, activities) {
                        if (err || !activities) {
                            console.log("error getting user: " + err);
                            callback(err);
                        } else {
                            console.log("activities list found with count " + activities.actionItems.length);
                            db.activities.update({ "_id": a_id }, { $push: { actionItems: actionItem }}, {upsert: false}, function (err, saved) {
                                if (err || !saved) {
                                    console.log("problemo with actitiers add " + err);
                                    // res.send('profcblemo ' + err);
                                    callback(err);
                                } else {
                                    console.log("ok saved to acttivieis");
                                    callback(null, user);
                                    // res.send('updated' + JSON.stringify(saved));
                                }
                            });
                        }
                    });
                } else { //new activitiesID if needed
                    let activities = {};
                    let actionItems = [];
                    actionItems.push(actionItem);
                    activities.actionItems = actionItems; //so can push new entries into a single array in this record
                    db.activities.save(activities, function (err, saved) {
                    if (err || !saved) {
                        console.log("problemo2 with activities add " + err);
                        callback(err);
                    } else {
                        console.log("new activities record " + saved._id);
                        db.users.update({"_id": u_id}, {$set: {activitiesID: saved._id}}, function (err, updated) {
                            if (err || !updated) {
                                console.log("problemo2 with activity7 add " + err);
                                callback(err);
                            } else {
                                callback(null, user);
                            }
                            });
                        }
                    });   
                }
            },
           
            function (user, callback) { //add to player inventory
                if (req.body.action.actionResult.toLowerCase() == "inventory") {
                    if (user.inventoryID != undefined && user.inventoryID != null) {
                        console.log("updating inventory record " + user.inventoryID);
                        var i_id = ObjectID(user.inventoryID);
                        db.inventories.findOne({"_id": i_id}, function (err, inventory) {
                            if (err || !inventory) {
                                console.log("error getting user: " + err);
                                callback(err);
                            } else {
                                console.log("inventory found with count " + inventory.inventoryItems.length);
                                db.inventories.update({"_id": i_id }, { $push: { inventoryItems: inventoryItem }}, {upsert: false}, function (err, saved) {
                                    if (err || !saved) {
                                        console.log("problemo with inventory add " + err);
                                        callback(err);
                                    } else {
                                        console.log("ok saved to inventories");
                                        callback(null);
                                    }
                                });
                            }
                        });
                    } else { //new inventory if needed 
                        let inventories = {};
                        let inventoryItems = [];
                        inventoryItems.push(inventoryItem);
                        inventories.inventoryItems = inventoryItems; 
                        db.inventories.save(inventories, function (err, saved) {
                        if (err || !saved) {
                            console.log("problemo2 with inventory add " + err);
                            callback(err);
                        } else {
                            console.log("making new inventories record " + saved._id);
                            db.users.update({"_id": u_id}, {$set: {inventoryID: saved._id}}, function (err, updated) {
                                if (err || !updated) {
                                    console.log("problemo2 with inventory add " + err);
                                    callback(err);
                                } else {
                                    console.log("added new inventory for y ou!");
                                    callback(null);
                                }
                            });
                            // res.send("invotrye savve" + JSON.stringify(saved));
                            }
                        });                       
                    }
                } else {
                    callback(null);
                }
            }
             */
        ],
        function (err, result) { // #last function, close async
            if (err != null) {
                res.send(err);
            } else {
                if (actionItem.actionResult.toLowerCase() == "inventory") {
                    console.log("pickup saved");
                    res.send("saved");
                } else if (actionItem.actionResult.toLowerCase() == "consume") {
                    console.log("pickup consumed");
                    res.send("consume");
                } 
                // else if (actionItem.actionResult.toLowerCase() == "equip") {
                //     console.log("pickup equipped");
                //     res.send("equip");
                // }
                
                
            }
        }
    );
});

app.post('/update_user/', requiredAuthentication, admin, function (req, res) { //for admins to set lower permissions
    // var u_id = ObjectID(req.params.auth_id);
    let o_id = ObjectID(req.body._id);
    if (o_id != null) {
        db.users.findOne({"_id": o_id}, function (err, user) {
            if (err || !user) {
                console.log("error getting user: " + err);
                res.send("error: " + err);
            } else {
            
                db.users.update({ _id: o_id }, { $set: {
                    authLevel : req.body.authLevel,
                    paymentStatus: req.body.paymentStatus,
                    status: req.body.status,
                    type: req.body.type
    //                    profilePic : profilePic
                }});
                console.log("tryna update4 users : " + JSON.stringify(req.body));
                res.send("updated");
            }
            //}
        });
    }
});

app.post('/update_userassets/', requiredAuthentication, function (req, res) {
    var u_id = req.body.user_id;
    console.log("tryna update userassets for " + u_id);
    var resp = db.assets.update( { "user_id": u_id }, { $set : req.body}, {upsert: true});

//    db.people.findAndModify({
//        query: { name: "Pascal", state: "active", rating: 25 },
//        sort: { rating: 1 },
//        update: { $inc: { score: 1 } },
//        upsert: true,
//        new: true
//    })

    res.send(resp);
});

// app.post('/update_userassetpic/', requiredAuthentication, upload.single('file'), function (req, res) {
// //    var platform = req.body.pform;
// //    var fname = req.body.fname;
//     console.log("update assetpic headers:" + JSON.stringify(req.headers));
// //            setTimeout(1000);
//         console.log("body " + JSON.stringify(req.body));
//         var filepath = "";
//         var params = {};
//         async.waterfall([
//             function (callback) {

//                 console.log("file " + req.file.path);
//                 filepath = req.file.path;
//                 var stream = fs.createReadStream(filepath);
// //       var data = {Bucket: theBucketFolder, Key: fname, Body: stream};
//                 params = {Bucket: 'mvmv.us', Key: req.body.prefix + req.body.filename, Body: stream};
//                 callback();
//             },
//             function (callback) {
//                 s3.putObject(params, function (err, data) {
//                     if (err) {
//                         console.log("Error uploading data: ", err);
//                         stream.close();
//                         callback(err);
//                         res.send("error: " + JSON.stringify(err));
//                     } else {
//                         console.log("Successfully uploaded data to " + params);
//                         res.send('original file in s3' + JSON.stringify(data));
//                         stream.close();
//                         callback(null, 'uploaded orig file');
//                     }
//                 });
//             }],

//             function (err, result) { // #last function, close async
// //                res.json(assetsResponse);
//                 console.log("waterfall done: " + result);

//             }
//             );
//     });

app.get('/get_userassets/:_id', requiredAuthentication, usercheck, function (req, res) {
    console.log("tryna get_userassets for " + req.params._id );
    // if (req.session.user.authLevel.toLowerCase().includes("admin")) {
    //     db.assets.find({}, function (err, assets) {
    //         if (err || !assets) {
    //             console.log("error getting user assets: " + err);
    //         } else {
    //             console.log("got all the assets!");
    //             res.send (assets);
    //         }
    //     });
    // } else {
        db.assets.find({"user_id": req.params._id}, function (err, assets) {
            if (err || !assets) {
                console.log("error getting user assets: " + err);
            } else {
                console.log("got user assets!");
                res.send (assets);
            }
        });
    // }
});

app.get('/get_models/:_id', requiredAuthentication, function (req, res) {
    console.log("tryna get_models for " + req.params._id );
        db.models.find({"userID": req.params._id}, function (err, models) {
            if (err || !models) {
                console.log("error getting user assets: " + err);
            } else {
                // console.log("got user models:" + JSON.stringify(models));
                res.send (models);
            }
        });
    // }
});
app.get('/get_model/:_id', requiredAuthentication, function (req, res) {
    var model_id = ObjectID(req.params._id);
    console.log("tryna get_models for " + req.params._id );
        db.models.findOne({"_id": model_id}, function (err, model) {
            if (err || !model) {
                console.log("error getting model: " + err);
            } else {
                // console.log("got user models:" + JSON.stringify(models));
                let url = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + model.userID + "/gltf/" + model.filename, Expires: 6000});
                model.url = url;
                res.send (model);
            }
        });
});

app.get('/asset_conv/:_id', requiredAuthentication, usercheck, function (req, res) {
    // console.log("tryna get_userassets for " + req.params._id );
    db.assets.findOne({"user_id": req.params._id}, function (err, assets) {
        if (err || !assets) {
            console.log("error getting user assets: " + err);
        } else {
            console.log("got user assets!");
            let response = {};
            for (asset in assets) {
                
            }
            res.send (response);
        }
    });
});

app.get('/sceneassetputurl/:u_id', checkAppID, requiredAuthentication, usercheck, function (req, res) {

    db.users.findOne({"_id": u_id}, function (err, user) {
        if (err || !user) {
            console.log("error getting user: " + err);
        } else {
            const fileName = req.query['file-name'];
            const fileType = req.query['file-type'];
            const s3Params = {
                Bucket: S3_BUCKET,
                Key: fileName,
                Expires: 60,
                ContentType: fileType,
                ACL: 'public-read'
            };

            s3.getSignedUrl('putObject', s3Params, (err, data) => {
                if(err){
                console.log(err);
                return res.end();
                }
                const returnData = {
                signedRequest: data,
                url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
                };
                res.write(JSON.stringify(returnData));
                res.end();
            });
        }
    });
});

app.get('/bundleassetputurl/:_id/:version_sig/:platform_sig', checkAppID, requiredAuthentication, usercheck, function (req, res) {
    var u_id = ObjectID(req.params._id);
    db.users.findOne({"_id": u_id}, function (err, user) {
        if (err || !user) {
            console.log("error getting user: " + err);
        } else {
            var url = s3.getSignedUrl('putObject', {Bucket: 'servicemedia', Key: "users/" + u_id + "/assets/" + req.params.version_sig + "/bundles_" + req.params.platform_sig, Expires: 600});
//            s3.getSignedUrl('putObject', params, (err, url) => {
//                if (err) return console.log(err);

            res.json({ url: url });
//        });
        }
    });
});

// app.post('/objputurl/:_id', requiredAuthentication, function (req, res) {
//     console.log("tryna get a puturl for : " + req.body.uid + " contentTYpe : " + req.body.contentType);
//     var cType = req.body.contentType;
//     // if (cType = "application/octet-stream") {
//     //     cType = "binary/octet-stream";
//     // }
//     var u_id = ObjectID(req.params._id);
//     db.users.findOne({"_id": u_id}, function (err, user) {
//         if (err || !user) {
//             console.log("error getting user: " + err);
//         } else {
//             //TODO is user in good standing? 
//             // var params =
//             var timestamp = Math.round(Date.now());
//             const params = {
//                 Bucket: 'archive1',
//                 //meatadata aqui
//                 // ACL: 'bucket-owner-full-control',
//                 // ContentType: 'text/csv',
//                 Body: '',
//                 ContentType: cType,
//                 Key: 'obj_staging/' + u_id + '/' + timestamp + '_' + req.body.filename,
//                 // Key: req.body.filename,
//                 Expires: 100
//               };
//             // var url = s3.getSignedUrl('putObject', {Bucket: 'servicemedia', Key: "users/" + u_id + "/staging" + req.params.platform_sig, Expires: 600});
//             s3.getSignedUrl('putObject', params, function(err, signedUrl) {
//                 let response;
//                 if (err) {
//                   response = {
//                     statusCode: 500,
//                     headers: {
//                       'Access-Control-Allow-Origin': '*',
//                     },
//                     body: JSON.stringify({
//                       error: 'Did not receive signed url'
//                     }),
//                   };
//                   console.log("putObject url error : " + err );
//                   res.json(err);
//                 } else {
//                   response = {
//                     statusCode: 200,
//                     headers: {
//                       'Access-Control-Allow-Origin': '*', // Required for CORS support to work
//                     },
//                     body: "",
//                     // body: JSON.stringify({
//                     //   message: `Url successfully created`,
//                     //   signedUrl,
//                     // }),
//                     method: "put",
//                     url: signedUrl,
//                     fields: []
//                     };
//                     console.log("putObject url : " + signedUrl );
//                     res.json(response);
//                 }
//             });
//         }
//     });
// });

// app.post('/process_object_files', requiredAuthentication, function (req, res) { //from staging folder
//     var itemsArray = req.body.processMe.items;
//     // var createGroup = false;
//     // var groupType = "";
//     // var groupID;
//     var uid;
//     var isObj
//     var objName;
//     console.log("process_object_files : " + JSON.stringify(req.body));
//     var itemsExtensions = itemsArray.map(item => {
//         return getExtension(item.key);
//     });

//     var meateada = {};
//     var groupitems = [];
//     var params = {
//         Bucket: 'archive1',
//     };
//     var nameSplitter = function(name) {
//         // index = name.indexOf("_");
//         var splitName = name.split("_");
//         console.log(name + " splitName " + splitName[3]);
//         // return name.substring(index + 2);   
//         return splitName[3]; 
//     }
//     // var originalName = function (name) {
//     //     var index = name.indexOf("_");
//     //     return name.substring(index + 1); //strip off prepended timestamp and _ for title and stuff
//     // }
//     // console.log("all items must be the same media type " + itemsExtensions.length); //TODO handle if they're different

//         var isObj = false; //if it's an obj (for now), upload with sibling files, to a named bucket...
//         var objName = "";
          
//             async.waterfall([
//             // function (callback) {
//             //     // console.log("Bucket exists and we have access");
//             //     var params = {Bucket: 'archive1', Delimiter: item.uid, Key: "obj_staging/" + item.uid + "/" + item.key}    
//             //     s3.headObject(params, function (err, data) {
//             //         if (err && err.code === 'NotFound') {
//             //             // Handle no object on cloud here
//             //             console.log(err);
//             //             callback(err);
//             //             res.send("staged file not found");
//             //         } else {
//             //             // meateada = metadata;
//             //             console.log("staged file meateada " + data);
//             //             callback(null);
//             //         }
//             //     });
//             // },    
//             function(callback) {
//                 async.each(itemsArray, function (item, cb) { 
                    
//                     console.log("item  :" + item.key);
//                     var iext = getExtension(item.key);
//                     if (iext == ".obj") {
//                         isObj = true;
//                         objName = nameSplitter(item.key);
//                         callback();
//                     } else {
//                         // console.log("cain't find no object file");
//                         cb(null);
//                     }
//                 });
//             },
//             // function (callback) {
//             //     for (var i = 0; i < itemsArray.length; i++) {
//             //         console.log("item  :" + itemsArray[i].key);
//             //         var iext = getExtension(itemsArray[i].key);
//             //         if (iext == ".obj") {
//             //             isObj = true;
//             //             objName = originalName(itemsArray[i].key);
//             //         }
//             //     }
//             //     callback(null);
            
//             // },
//             function (callback) {
//                 if (isObj) {
//                     console.log("object name is " + objName);
//                     async.each(itemsArray, function (item, cb) { 
                    
//                     var targetBucket = "servicemedia";
//                     var copySource = "archive1/obj_staging/" + item.uid + "/" + item.key;
//                     var ck = "users/" + item.uid + "/objs/" + objName + "/" + nameSplitter(item.key);
//                     s3.copyObject({Bucket: targetBucket, CopySource: copySource, Key: ck}, function (err,data){
//                         if (err) {
//                             console.log("ERROR copyObject" + err);
//                             cb(err);
//                         }
//                         else {
//                             console.log("SUCCESS copyObject key " + ck + " response: " + data );
//                             cb(null);
//                         }
//                     });
//                     },
//                     function (err) {
//                        
//                         if (err) {
//                             console.log('A file failed to process');
//                             callback(null);
//                         } else {
//                             console.log('All files have been processed successfully');
//                             callback(null);
//                         }
//                     });
//                 } else {
//                     console.log("cain't find no objs, ending...");
//                     callback(err);
//                     }
//                 }
//         ],
//         function(err, result) { // #last function, close async
//             if (err != null) {
//                 res.send(err);
//             } else {
//                 console.log("waterfall done: " + result);
//                 //  res.redirect('/upload.html');
//                 res.send("upload completee!");
//             }
//         });
//     // }
// }); //end app.post /process_object

function sizeOf(key, bucket) {
    return s3.headObject({ Key: key, Bucket: bucket })
        .promise()
        .then(res => res.ContentLength);
}
app.post('/process_video_hls', requiredAuthentication, function (req, res) {
    console.log("userid = " + req.session.user._id);
    var token=jwt.sign({userId:req.session.user._id},process.env.JWT_SECRET);
    const options = {
        headers: {'X-Access-Token': token}
      };
    let iID = req.body.id;
    axios.get(process.env.GS_HOST + "/process_video_hls/"+iID, options)
    .then((response) => {
    //   console.log(response.data);
      console.log("grabAndSqueeze response: " + response.status);
      res.send("processing video");
    //   console.log(response.statusText);
    //   console.log(response.headers);
    //   console.log(response.config);
        // callback(null);
    })
    .catch(function (error) {
        // handle error
        console.log(error);
        res.send("error: " + error);
        // callback(error);
    })
    // .then(function () {
    //     // console.log('nerp');
    // });
});

app.post('/ipfs_up', requiredAuthentication, function (req, res) {
    console.log("userid = " + req.session.user._id);
    var token=jwt.sign({userId:req.session.user._id},process.env.JWT_SECRET);
    const options = {
        headers: {'X-Access-Token': token}
      };
    let iID = req.body.id;
    axios.get(process.env.GS_HOST + "/ipfs_upl/" + req.body.type + "/"+iID, options)
    .then((response) => {
    //   console.log(response.data);
      console.log("grabAndSqueeze ipfs add response: " + JSON.stringify(response.data));
      
      res.send(JSON.stringify(response.data));
    //   console.log(response.statusText);
    //   console.log(response.headers);
    //   console.log(response.config);
        // callback(null);
    })
    .catch(function (error) {
        // handle error
        console.log(error);
        res.send("error: " + error);
        // callback(error);
    })
    // .then(function () {
    //     // console.log('nerp');
    // });
});


app.post('/process_staging_files', requiredAuthentication, function (req, res) { //from staging folder
    var itemsArray = req.body.processMe.items;
    var createGroup = false;
    var groupType = "";
    var groupID;
    var uid;
    var isObj
    var objName;
    console.log("process_staging_files : " + JSON.stringify(req.body));
    var itemsExtensions = itemsArray.map(item => {
        return getExtension(item.key).toLowerCase();
    });
    var stagingBucket = process.env.STAGING_BUCKET_NAME;
    var meateada = {};
    var groupitems = [];
    var params = {
        Bucket: process.env.STAGING_BUCKET_NAME,
    };
    params.Delete = {Objects:[]};
    var originalName = function (name) {
        var index = name.indexOf("_");
        return name.substring(index + 1); //strip off prepended timestamp and _ for title and stuff
    }

    const allEqual = itemsExtensions => itemsExtensions.every( v => v === itemsExtensions[0] ); //if all extensions the same, then make a group (which is the point)
    console.log("same extensions: "+ itemsExtensions[0]);

    if (allEqual(itemsExtensions) && (itemsExtensions[0].toLowerCase() == ".usdz" || itemsExtensions[0].toLowerCase() == ".reality" || itemsExtensions[0].toLowerCase() == ".glb" || itemsExtensions[0].toLowerCase() == ".jpg" || itemsExtensions[0].toLowerCase() == ".jpeg" || itemsExtensions[0].toLowerCase() == ".png" ||
     itemsExtensions[0].toLowerCase() == ".aif" || itemsExtensions[0].toLowerCase() == ".aiff" || itemsExtensions[0].toLowerCase() == ".ogg" || itemsExtensions[0].toLowerCase() == ".wav" || itemsExtensions[0].toLowerCase() == ".mp3" || 
     itemsExtensions[0].toLowerCase() == ".mp4" || itemsExtensions[0].toLowerCase() == ".webm" || itemsExtensions[0].toLowerCase() == ".mov" || itemsExtensions[0].toLowerCase() == ".mkv")) { //need to think how to flex, and use contenttype
        
        var ts = Math.round(Date.now() / 1000);
        createGroup = true;
        groupType = itemsExtensions[0];
        if (itemsArray[0].uid != req.session.user._id) {
            res.send("ids do not match! no upload for you");
        } else {
        async.waterfall([
           
            function(callbk) {     //callbk
                async.each(itemsArray, function (item, cb) {  //1. make sure the file is where it's supposed to be...
                    let itemKey = item.key.toLowerCase();
                    itemKey = itemKey.replace(/[/\\?%*:|"<>]\s/g, '-');
                    let size = 0;
                    async.waterfall([
                        function (callback) {
                            console.log("groupTYpe : " + groupType);
                            // console.log("Bucket exists and we have access");
                            (async () => {  // to flex with minio, etc..
                                if (minioClient) {
                                    try {
                                        minioClient.statObject(stagingBucket, "staging/" + item.uid + "/" + itemKey, function(err, stat) { //statObject = headObject at s3
                                            if (err) {
                                                console.log(err);
                                                callback(err);
                                            } else {
                                                console.log("minio statObject " + stat);
                                                callback(null);
                                            }

                                        });
                                        // callback(null);
                                    } catch (e) {
                                        callback(e);
                                    }
                                } else {
                                    var params = {Bucket: stagingBucket, Delimiter: item.uid, Key: "staging/" + item.uid + "/" + itemKey}    
                                    s3.headObject(params, function (err, data) {
                                        if (err && err.code === 'NotFound') {
                                            // Handle no object on cloud here
                                            console.log(err);
                                            callback(err);
                                            res.send("staged file not found");
                                        } else {
                                            // meateada = metadata;
                                            console.log("staged file meateada " + data);
                                            callback(null);
                                        }
                                    });
                                }
                            })();
                            // var params = {Bucket: 'archive1', Delimiter: item.uid, Key: "staging/" + item.uid + "/" + itemKey}    
                            // s3.headObject(params, function (err, data) {
                            //     if (err && err.code === 'NotFound') {
                            //         // Handle no object on cloud here
                            //         console.log(err);
                            //         callback(err);
                            //         res.send("staged file not found");
                            //     } else {
                            //         // meateada = metadata;
                            //         console.log("staged file meateada " + data);
                            //         callback(null);
                            //     }
                            // });
                            // if (ReturnObjectMetadata(stagingBucket, "staging/" + item.uid + "/" + itemKey)) {

                            // } else {

                            // }
                        },
                        //TODO do this later, and copy the whole user folder
                        // function(callback) { //copy file to the archive folder (current staging one will be deleted) 
                        //     var targetBucket = "archive1";
                        //     var copySource = "archive1/staging/" + item.uid + "/" + itemKey;
                        //     var ck = "archived/" + item.uid + "/" + itemKey;
                        //     s3.copyObject({Bucket: targetBucket, CopySource: copySource, Key: ck}, function (err,data){
                        //         if (err) {
                        //             console.log("ERROR copyObject" + err);
                        //             callback(err);
                        //         } else {
                        //             console.log("SUCCESS copyObject key " + ck + " data: " + data);
                        //             callback(null);
                        //         }
                        //     });
                        // },
                        function (callback) { // get the size for the source file
                            // console.log("item uid : " + item.uid);
                            // var params = {Bucket: 'archive1', Key: "staging/" + item.uid + "/" + itemKey};
                            // s3.headObject(params, function(err, data) {
                            //     if (err) {
                            //         console.log(err, err.stack);  // an error occurred
                            //         callback(err);
                            //     } else {
                            //         console.log(data);           // successful response
                            //         size = data.ContentLength;
                            //         console.log("sizeOf = " + size);
                            //         callback(null);
                            //     }    
                            // });
                            (async () => {  //flex with minio, etc..
                                if (minioClient) {
                                    try {
                                        minioClient.statObject(stagingBucket, "staging/" + item.uid + "/" + itemKey, function(err, stat) {
                                            if (err) {
                                                console.log(err)
                                                callback(err);
                                            } else {
                                                console.log("minio statObject " + stat);
                                                callback(null);
                                            }
                                          
                                        });
                                        
                                    } catch (e) {
                                        callback(e);
                                    }
                                } else {
                                    var params = {Bucket: stagingBucket, Key: "staging/" + item.uid + "/" + itemKey}    
                                    s3.headObject(params, function (err, data) {
                                        if (err && err.code === 'NotFound') {
                                            // Handle no object on cloud here
                                            console.log(err);
                                            callback(err);
                                            res.send("staged file not found");
                                        } else {
                                            console.log(data);  
                                            size = data.ContentLength;
                                            console.log("sizeOf = " + size);
                                            callback(null);
                                        }
                                    });
                                }
                            })();
                            
                        },
                        function (callback) { // Get a url for the source file
                            console.log("stagign item uid : " + item.uid);
                            // var params = {Bucket: 'archive1', Key: "staging/" + item.uid + "/" + itemKey};

                            // s3.getSignedUrl('getObject', params, function (err, url) {
                            //     if (err) {
                            //         console.log(err);
                            //         cb(); //?
                            //     } else {
                            //         console.log("The URL is", url);
                            //         callback(null, url);
                            //     }
                            // });
                            (async () => {  
                                try {
                                    url = await ReturnPresignedUrl(stagingBucket, "staging/" + item.uid + "/" + itemKey, 6000);
                                    
                                    callback(null, url);
                                } catch (e) {
                                    callback(e);
                                }
                            })();
                        },
                        function (tUrl, callback) { //make an appropriate (by file extension) record in the db and get an _id
                            if (groupType == ".jpg" || groupType == ".jpeg" || groupType == ".JPG" || groupType == ".png" || groupType == ".PNG") {
                                console.log("tryna save a jpg at " + tUrl);
                                
                                db.image_items.save({   
                                    type : "fromStaging",
                                    userID : item.uid,
                                    userName : req.session.user.userName,
                                    title : originalName(itemKey),
                                    filename : itemKey,
                                    item_type : 'picture',
                                    tags: [],
                                    item_status: "private",
                                    otimestamp : ts,
                                    ofilesize : size },
                                    function (err, saved) {
                                    if ( err || !saved ) {
                                        console.log('picture not saved..');
                                        callback (err);
                                        } else {
                                            var item_id = saved._id.toString();
                                            groupitems.push(item_id);
                                            console.log('new picture item id: ' + item_id);
                                            // console.log("transcodePictureURL request: " + tUrl);
                                            var copySource = "archive1/staging/" + saved.userID + "/" + saved.filename;
                                            var ck = "users/" + saved.userID + "/pictures/originals/" + item_id + ".original." + saved.filename; //path change!
                                            console.log("tryna copy origiinal to " + ck);
                                            var targetBucket = process.env.S3_ROOT_BUCKET_NAME;
                                            (async () => {  
                                                try {
                                                    if (minioClient) {
                                                        minioClient.copyObject(targetBucket, ck, copySource, function(e, data) {
                                                            if (e) {
                                                                callback(e);
                                                            } else {
                                                                console.log("Successfully copied the object:");
                                                                console.log("etag = " + data.etag + ", lastModified = " + data.lastModified);
                                                                callback(null, item_id, tUrl);
                                                            }
                                                            
                                                          });
                                                    } else {
                                                        s3.copyObject({Bucket: targetBucket, CopySource: copySource, Key: ck}, function (err,data){
                                                            if (err) {
                                                                console.log("ERROR copyObject" + err);
                                                                callback(err);
                                                            } else {
                                                                console.log("SUCCESS copyObject key " + ck );
                                                                // callback(null);
                                                                callback(null, item_id, tUrl);
                                                            }
                                                        });
                                                    }
                                                    // let copyResponse = await CopyObject(targetBucket, copySource, ck).promise(); //later
                                                    // console.log("copy response: "+ copyResponse);
                                                    // callback(null, item_id, tUrl);
                                                } catch (e) {
                                                    callback(e);
                                                }
                                            })();
                                        }
                                    }
                                );
                            } else if (groupType == ".mp3" || groupType == ".MP3" || groupType == ".wav" || groupType == ".ogg" || groupType == ".OGG" || groupType == ".aif" ||  groupType == ".AIFF" || groupType == ".WAV"  )  {
                                console.log("tryna save an audio " + tUrl);
                                db.audio_items.save(
                                    {type : "stagedUserAudio",
                                        userID : req.session.user._id.toString(),
                                        username : req.session.user.userName,
                                        title : originalName(itemKey),
                                        artist : "",
                                        album :  "",
                                        filename : itemKey,
                                        item_type : "audio",
                                        tags: [],
                                        item_status: "private",
                                        otimestamp : ts,
                                        ofilesize : size},
                                    function (err, saved) {
                                        if ( err || !saved ) {
                                            console.log('audio item not saved..');
                                            callback (err);
                                        } else {
                                            // var item_id = saved._id.toString();
                                            // groupitems.push(item_id);
                                            // console.log('new item id: ' + item_id);
                                            // callback(null, item_id, tUrl);

                                            var item_id = saved._id.toString();
                                            groupitems.push(item_id);
                                            console.log('new picture item id: ' + item_id);
                                            // console.log("transcodePictureURL request: " + tUrl);
                                            var copySource = "archive1/staging/" + saved.userID + "/" + saved.filename;
                                            var ck = "users/" + saved.userID + "/audio/originals/" + item_id + ".original." + saved.filename; //path change!
                                            console.log("tryna copy origiinal to " + ck);
                                            var targetBucket = process.env.S3_ROOT_BUCKET_NAME;

                                            (async () => {  
                                                try {
                                                    if (minioClient) {
                                                        minioClient.copyObject(targetBucket, ck, copySource, function(e, data) {
                                                            if (e) {
                                                                callback(e);
                                                            } else {
                                                                console.log("Successfully copied the object:");
                                                                console.log("etag = " + data.etag + ", lastModified = " + data.lastModified);
                                                                callback(null, item_id, tUrl);
                                                            }
                                                            
                                                          });
                                                    } else {
                                                        s3.copyObject({Bucket: targetBucket, CopySource: copySource, Key: ck}, function (err,data){
                                                            if (err) {
                                                                console.log("ERROR copyObject" + err);
                                                                callback(err);
                                                            } else {
                                                                console.log("SUCCESS copyObject key " + ck );
                                                                // callback(null);
                                                                callback(null, item_id, tUrl);
                                                            }
                                                        });
                                                    }
                                                } catch (e) {
                                                    callback(e);
                                                }
                                            })();
                                            // s3.copyObject({Bucket: targetBucket, CopySource: copySource, Key: ck}, function (err,data){
                                            //     if (err) {
                                            //         console.log("ERROR audio copyObject" + err);
                                            //         callback(err);
                                            //     } else {
                                            //         console.log("SUCCESS copyObject audio key " + ck );
                                            //         // callback(null);
                                            //         callback(null, item_id, tUrl);
                                            //     }
                                            // });
                                        }
                                    }
                                );
                            } else if (groupType.toLowerCase() == ".mp4" || groupType.toLowerCase() == ".mkv" || groupType.toLowerCase() == ".mov" || groupType.toLowerCase() == ".webm")  {
                                console.log("tryna save a video " + tUrl);
                                db.video_items.save(
                                    {
                                        userID : req.session.user._id.toString(),
                                        username : req.session.user.userName,
                                        title : originalName(item.key),
                                        filename : itemKey,
                                        item_type : 'video',
                                        tags: [],
                                        item_status: "private",
                                        otimestamp : ts,
                                        ofilesize : size},
                                    function (err, saved) {
                                        if ( err || !saved ) {
                                            console.log('video not saved..');
                                            callback (err);
                                        } else {
                                            var item_id = saved._id.toString();
                                            groupitems.push(item_id);
                                            console.log('new item id: ' + item_id);
                                            callback(null, item_id, tUrl);
                                        }
                                    }
                                );
                            } else if (groupType == ".glb") {
                                console.log("tryna save a glb " + tUrl);
                                db.models.save({
                                    userID : req.session.user._id.toString(),
                                    username : req.session.user.userName,
                                    name : ts + "_" + originalName(item.key),
                                    filename : itemKey,
                                    item_type : 'glb',
                                    tags: [],
                                    item_status: "private",
                                    otimestamp : ts,
                                    ofilesize : size },
                                function (err, saved) {
                                    if ( err || !saved ) {
                                        console.log('glb not saved..');
                                        callback (err);
                                    } else {
                                        var item_id = saved._id.toString();
                                        groupitems.push(item_id);
                                        console.log('new item id: ' + item_id);
                                        callback(null, item_id, tUrl);
                                    }
                                });
                                // callback(null, null, tUrl); //don't save in db for now
                            // }
                            } else if (groupType == ".usdz") {
                                console.log("tryna save a usdz " + tUrl);
                                db.models.save({
                                    userID : req.session.user._id.toString(),
                                    username : req.session.user.userName,
                                    name : ts + "_" + originalName(item.key),
                                    filename : itemKey,
                                    item_type : 'usdz',
                                    tags: [],
                                    item_status: "private",
                                    otimestamp : ts,
                                    ofilesize : size },
                                function (err, saved) {
                                    if ( err || !saved ) {
                                        console.log('usdz not saved..');
                                        callback (err);
                                    } else {
                                        var item_id = saved._id.toString();
                                        groupitems.push(item_id);
                                        console.log('new item id: ' + item_id);
                                        callback(null, item_id, tUrl);
                                    }
                                });
                                // callback(null, null, tUrl); //don't save in db for now
                            } else if (groupType == ".reality") {
                                console.log("tryna save a .reality file " + tUrl);
                                db.models.save({
                                    userID : req.session.user._id.toString(),
                                    username : req.session.user.userName,
                                    name : ts + "_" + originalName(item.key),
                                    filename : itemKey,
                                    item_type : 'reality',
                                    tags: [],
                                    item_status: "private",
                                    otimestamp : ts,
                                    ofilesize : size },
                                function (err, saved) {
                                    if ( err || !saved ) {
                                        console.log('reality file not saved..');
                                        callback (err);
                                    } else {
                                        var item_id = saved._id.toString();
                                        groupitems.push(item_id);
                                        console.log('new item id: ' + item_id);
                                        callback(null, item_id, tUrl);
                                    }
                                });
                                // callback(null, null, tUrl); //don't save in db for now
                            }
                        },
                        function(iID, tUrl, callback) { //send to transloadit and/or copy to production folder.. //no, now do resizing on media server!
                            if (groupType == ".jpg"  || groupType == ".jpeg" || groupType == ".JPG" || groupType == ".png" || groupType == ".PNG") {
                                // console.log("transcodePictureURL request: " + tUrl);
                                // var copySource = "archive1/staging/" + item.uid + "/" + itemKey;
                                // var ck = "users/" + item.uid + "/" + iID + ".original." + itemKey;
                                // console.log("tryna copy origiinal to " + ck);
                                // var targetBucket = "servicemedia";
                                // s3.copyObject({Bucket: targetBucket, CopySource: copySource, Key: ck}, function (err,data){
                                //     if (err) {
                                //         console.log("ERROR copyObject" + err);
                                //         callback(err);
                                //     } else {
                                //         console.log("SUCCESS copyObject key " + ck );
                                //         callback(null);
                                //     }
                                // });
                                // console.log("tryna USE_TRANSLOADIT ?" + process.env.USE_TRANSLOADIT); //OLD WAY used transloadit
                                // if (process.env.USE_TRANSLOADIT == true) {
                                //     var encodePictureUrlParams = {
                                //         steps: {
                                //             ':orig': {
                                //                 robot: '/http/import',
                                //                 url : tUrl
                                //             }
                                //         },
                                //         'template_id': 'f9e7db371a1a4fd29022cc959305a671',
                                //         'fields' : { image_item_id : iID,
                                //             user_id : item.uid
                                //         }
                                //     };
                                //     transloadClient.send(encodePictureUrlParams, function(ok) {
                                //     console.log('transloadit Success: ' + encodePictureUrlParams); //if it makes it to transloadit, copy original too
                                //     }, function(err) {
                                //         console.log('transloadit Error: ' + JSON.stringify(err));
                                //         callback(err);
                                //     });
                                
                            // } else { //NEW WAY uses GrabAndSqueeze
                                console.log("userid = " + req.session.user._id);
                                var token=jwt.sign({userId:req.session.user._id},process.env.JWT_SECRET);
                                const options = {
                                    headers: {'X-Access-Token': token}
                                    };
                                axios.get(process.env.GS_HOST + "/resize_uploaded_picture/"+iID, options)
                                .then((response) => {
                                //   console.log(response.data);
                                    console.log("grabAndSqueeze response: " + response.status);
                                //   console.log(response.statusText);
                                //   console.log(response.headers);
                                //   console.log(response.config);
                                    
                                })
                                
                                .then(function () {
                                    // console.log('nerp');
                                    callback(null);
                                })
                                .catch(function (error) {
                                    // handle error
                                    // console.log(error);
                                    callback(error);
                                });

                                   
                            } else if (groupType == ".mp3" || groupType == ".wav" || groupType == ".aif" || groupType == ".aiff" || groupType == ".ogg" || 
                                groupType == ".MP3" || groupType == ".WAV" || groupType == ".AIFF" || groupType == ".AIFF" || groupType == ".OGG"  ) { 
                                // console.log("tryna USE_TRANSLOADIT for audio?" + process.env.USE_TRANSLOADIT);
                                // if (process.env.USE_TRANSLOADIT == true) { //nilch need to rem
                                //     console.log("transcodeAudioURL request: " + tUrl);
                                //     var encodeAudioUrlParams = {
                                //         steps: {
                                //             ':orig': {
                                //                 robot: '/http/import',
                                //                 url : tUrl
                                //             }
                                //         },
                                //         'template_id': '84da9df057e311e4bdecf5e543756029',
                                //         'fields' : { audio_item_id : iID,
                                //             user_id : req.session.user._id.toString()
                                //         }
                                //     };
                                //     transloadClient.send(encodeAudioUrlParams, function(ok) {
                                //         console.log('Success: ' + JSON.stringify(ok));
                                //         callback(null);
                                //     }, function(err) {
                                //         console.log('Error: ' + JSON.stringify(err));
                                //         callback(err);
                                //     });
                                // } else {
                                    console.log("tryna process audio userid = " + req.session.user._id);
                                    var token=jwt.sign({userId:req.session.user._id},process.env.JWT_SECRET);
                                    const options = {
                                        headers: {'X-Access-Token': token}
                                        };
                                    axios.get(process.env.GS_HOST + "/process_audio_download/"+iID, options)
                                    // .then((response) => {
                                    // //   console.log(response.data);
                                    //     console.log("grabAndSqueeze process_audio response: " + response.data);
                                    // //   console.log(response.statusText);
                                    // //   console.log(response.headers);
                                    // //   console.log(response.config);
                                    //     // callback(null);
                                    // })
                                    .then(function () {
                                        console.log("grabAndSqueeze process_audio response: " + response.data);
                                        callback(null);
                                    })
                                    .catch(function (error) {
                                        // handle error
                                        // console.log(error);
                                        callback(error);
                                    });
                                // }
                            } else if (groupType.toLowerCase() == ".mpg" || groupType.toLowerCase() == ".mp4" || groupType.toLowerCase() == ".mkv" || groupType.toLowerCase() == ".webm" || groupType.toLowerCase() == ".mov") {
                                var targetBucket = "servicemedia";
                                var copySource = "archive1/staging/" + item.uid + "/" + itemKey;
                                
                                var ck = "users/" + item.uid + "/video/" + iID + "/" + iID + "." + itemKey;
                                console.log("tryna process a video file " + copySource + " to " + targetBucket + ck);


                                // s3.copyObject({Bucket: targetBucket, CopySource: copySource, Key: ck}, function (err, data){
                                //     if (err) {
                                //         console.log("ERROR copyObject" + err);
                                //         callback(err);
                                //     }
                                //     else {
                                //         console.log("SUCCESS copyObject key " + ck );
                                //         callback(null);
                                //     }
                                // });
                                (async () => {  
                                    try {
                                        if (minioClient) {
                                            minioClient.copyObject(targetBucket, ck, copySource, function(e, data) {
                                                if (e) {
                                                    callback(e);
                                                } else {
                                                    console.log("Successfully copied audio object:");
                                                    console.log("etag = " + data.etag + ", lastModified = " + data.lastModified);
                                                    callback(null);
                                                }
                                                
                                              });
                                        } else {
                                            s3.copyObject({Bucket: targetBucket, CopySource: copySource, Key: ck}, function (err,data){
                                                if (err) {
                                                    console.log("ERROR copyObject" + err);
                                                    callback(err);
                                                } else {
                                                    console.log("SUCCESS copyObject key " + ck );
                                                    // callback(null);
                                                    callback(null);
                                                }
                                            });
                                        }
                                    } catch (e) {
                                        callback(e);
                                    }
                                })();
                            } else if (groupType == ".glb") {
                                var targetBucket = "servicemedia";
                                var copySource = "archive1/staging/" + item.uid + "/" + itemKey;
                                var ck = "users/" + item.uid + "/gltf/" + itemKey;
                                console.log("tryna copy glb to " + ck);
                                (async () => {  
                                    try {
                                        if (minioClient) {
                                            minioClient.copyObject(targetBucket, ck, copySource, function(e, data) {
                                                if (e) {
                                                    callback(e);
                                                } else {
                                                    console.log("Successfully copied glb object:");
                                                    console.log("etag = " + data.etag + ", lastModified = " + data.lastModified);
                                                    callback(null);
                                                }
                                                
                                              });
                                        } else {
                                            s3.copyObject({Bucket: targetBucket, CopySource: copySource, Key: ck}, function (err,data){
                                                if (err) {
                                                    console.log("ERROR copyObject" + err);
                                                    callback(err);
                                                } else {
                                                    console.log("SUCCESS copyObject key " + ck );
                                                    // callback(null);
                                                    callback(null);
                                                }
                                            });
                                        }
                                    } catch (e) {
                                        callback(e);
                                    }
                                })();
                                // s3.copyObject({Bucket: targetBucket, CopySource: copySource, Key: ck}, function (err,data){
                                //     if (err) {
                                //         console.log("ERROR copyObject" + err);
                                //         callback(err);
                                //     } else {
                                //         console.log("SUCCESS copyObject key " + ck );
                                //         callback(null);
                                //     }
                                // });
                            } else if (groupType == ".usdz") {
                                var targetBucket = "servicemedia";
                                var copySource = "archive1/staging/" + item.uid + "/" + itemKey;
                                var ck = "users/" + item.uid + "/usdz/" + itemKey;
                                console.log("tryna copy usdz to " + ck);
                                (async () => {  
                                    try {
                                        if (minioClient) {
                                            minioClient.copyObject(targetBucket, ck, copySource, function(e, data) {
                                                if (e) {
                                                    callback(e);
                                                } else {
                                                    console.log("Successfully copied usdz object:");
                                                    console.log("etag = " + data.etag + ", lastModified = " + data.lastModified);
                                                    callback(null);
                                                }
                                                
                                              });
                                        } else {
                                            s3.copyObject({Bucket: targetBucket, CopySource: copySource, Key: ck}, function (err,data){
                                                if (err) {
                                                    console.log("ERROR copyObject" + err);
                                                    callback(err);
                                                } else {
                                                    console.log("SUCCESS copyObject key " + ck );
                                                    // callback(null);
                                                    callback(null);
                                                }
                                            });
                                        }
                                    } catch (e) {
                                        callback(e);
                                    }
                                })();
                                // s3.copyObject({Bucket: targetBucket, CopySource: copySource, Key: ck}, function (err,data){
                                //     if (err) {
                                //         console.log("ERROR copyObject" + err);
                                //         callback(err);
                                //     } else {
                                //         console.log("SUCCESS copyObject key " + ck );
                                //         callback(null);
                                //     }
                                // });
                            } else if (groupType == ".reality") {
                                var targetBucket = "servicemedia";
                                var copySource = "archive1/staging/" + item.uid + "/" + itemKey;
                                var ck = "users/" + item.uid + "/reality/" + itemKey;
                                console.log("tryna copy usdz to " + ck);
                                (async () => {  
                                    try {
                                        if (minioClient) {
                                            minioClient.copyObject(targetBucket, ck, copySource, function(e, data) {
                                                if (e) {
                                                    callback(e);
                                                } else {
                                                    console.log("Successfully copied the object:");
                                                    console.log("etag = " + data.etag + ", lastModified = " + data.lastModified);
                                                    callback(null);
                                                }
                                                
                                              });
                                        } else {
                                            s3.copyObject({Bucket: targetBucket, CopySource: copySource, Key: ck}, function (err,data){
                                                if (err) {
                                                    console.log("ERROR copyObject" + err);
                                                    callback(err);
                                                } else {
                                                    console.log("SUCCESS copyObject key " + ck );
                                                    // callback(null);
                                                    callback(null);
                                                }
                                            });
                                        }
                                    } catch (e) {
                                        callback(e);
                                    }
                                })();
                                // s3.copyObject({Bucket: targetBucket, CopySource: copySource, Key: ck}, function (err,data){
                                //     if (err) {
                                //         console.log("ERROR copyObject" + err);
                                //         callback(err);
                                //     } else {
                                //         console.log("SUCCESS copyObject key " + ck );
                                //         callback(null);
                                //     }
                                // });
                            }  
                            

                        },
                        function (callback) {
                           
                            params.Delete.Objects.push({Key: 'staging/' + item.uid + '/' + item.key}); //clean up
                            // console.log("delete params: " + JSON.stringify(params));

                            (async () => {  
                                try {
                                    if (minioClient) { // --really only one here...
                                        minioClient.removeObject(process.env.STAGING_BUCKET_NAME, 'staging/' + item.uid + '/' + item.key, function(err) {
                                            if (err) {
                                              console.log('Unable to remove object', err);
                                              callback(err);
                                            }
                                            console.log('Removed the object');
                                            callback(null);
                                          })
                                    } else {
                                        s3.deleteObjects(params, function(err, data) {
                                            if (err) {
                                                console.log("error deleting " + err);
                                                callback(err);
                                            } else {
                                                // console.log('deleted staging files: ' + JSON.stringify(params));
                                                callback(null);
                                            }
                                        });
                                    }
                                } catch (e) {
                                    callback(e);
                                }
                            })();

                            // s3.deleteObjects(params, function(err, data) {
                            //     if (err) {
                            //         console.log("error deleting " + err);
                            //         callback(err);
                            //     } else {
                            //         // console.log('deleted staging files: ' + JSON.stringify(params));
                            //         callback(null);
                            //     }
                            // });
                            // callback(null);
                        },
                        ], //inner waterfall async end                        
                        function(err, result) { // #last function, close async
                            if (err != null) {
                                console.log("callback callback err");
                                // callback(err);
                                cb(err);
                            } else {
                                console.log("callbacks done!~");
                            //    callback(null);
                                cb();
                            uid = itemsArray[0].uid;    
                            }
                        
                        });
                    // cb();
                    }, 
                    function (err, result) { // #last function, close async
                        if (err != null) {
                            console.log("error processing files! " + err);
                            callbk(err);
                        } else {
                            console.log("processing files complete");

                            callbk();
                    // console.log("available domain scene waterfall done with count: " + availableScenesResponse.availableScenes.length    
                        uid = itemsArray[0].uid;
                        // ();
                        
                        }
                    })
                },
                function (callbk) {
                  
                    var group = {};                
                    group.userID = uid;
                    group.items = groupitems;
                    if (group.items.length > 1) {
                        console.log("tryna make group for " + uid + " length " + group.items.length);
                        if (groupType == ".jpg" || groupType == ".jpeg") {
                            group.type = "picture";
                            group.name = "pictures " + ts;
                        } else if (groupType == ".png") {
                            group.type = "picture";
                            group.name = "pictures " + ts;
                        } else if (groupType == ".glb") {
                            group.type = "models";
                            group.name = "models " + ts;
                        } else if (groupType == ".mp3") {
                            group.type = "audio";
                            group.name = "audio " + ts;
                        } else if (groupType == ".mp4" || groupType == ".webm" || groupType == ".mov" || groupType == ".mpg" || groupType == ".MTS") {
                            group.type = "video";
                            group.name = "video " + ts;
                        } else {
                            // callbk(null); caught in db save below?  
                        if (group.type != undefined && group.type != null) {
                            db.groups.save(group, function (err, saved) {
                                if ( err || !saved ) {
                                    console.log('group not saved..');
                                    callbk(err);
                                    // res.send("nilch");
                                } else {
                                    groupID = saved._id.toString();
                                    console.log('new group created, id: ' + groupID);
                                    callbk(null);
                                    //res.send("group created : " + item_id);
                                }
                            });
                            } else {
                                callbk(null);
                            }
                        }
                    } else { //no group if only one
                        callbk(null);
                    }
                }
                // function (callbk) {
                //     // setTimeout(function() {10000});
                //     s3.deleteObjects(params, function(err, data) {
                //         if (err) {
                //             console.log("error deleting " + err);
                //             // callback(err);
                //             callbk(err);
                //         } else {
                //             console.log('deleted staging files: ' + JSON.stringify(params));
                //             callbk(null);
                //         }
                //     });
                // },
            ],
            function(err, result) { // #last function, close async
                if (err != null) {
                    res.send(err);
                } else {
                    console.log("waterfall done: " + result);
                    //  res.redirect('/upload.html');
                    res.send("group created with groupID " + groupID);
                }
            });
        }
    } else { //if not all the same, check if it's an object file, and upload with siblings (*.mtl and pic file(s))
        console.log("all items must be the same media type " + itemsExtensions.length); //TODO handle if they're different
    }
}); //end app.post /process_staging

app.post('/staging_delete', requiredAuthentication, function (req, res) {
    console.log("staging delete: " + JSON.stringify(req.body));
    params = {
            Bucket: 'archive1',
            // Prefix: 'staging/' + u_id + '/'
        };
    params.Delete = {Objects:[]};
    // req.body.Contents.forEach(function(content) {
    params.Delete.Objects.push({Key: 'staging/' + req.body.uid + '/' + req.body.key});
    // });
    console.log("delete params: " + JSON.stringify(params));
    s3.deleteObjects(params, function(err, data) {
        if (err) {
            console.log("error deleting " + err)
            res.send("error deleting " + err);
        } else {
            res.send("files deleted" + JSON.stringify(data));
        }
    });
});
app.post('/staging_delete_array', requiredAuthentication, function (req, res) {
    console.log("staging delete: " + JSON.stringify(req.body));

    if (minioClient) {
        var keys = []
        // keys.push(
        //     "users/" + req.session.user._id.toString() + "/" + item_string_filename,
        //     "users/" + req.session.user._id.toString() + "/" + audio_item[0]._id + "." + pngName,
        //     "users/" + req.session.user._id.toString() + "/" + audio_item[0]._id + "." + mp3Name,
        //     "users/" + req.session.user._id.toString() + "/" + audio_item[0]._id + "." + oggName,

        //     );
        req.body.deleteMe.items.forEach(function(content) {
            keys.push('staging/' + content.uid + '/' + content.key);
        });    
        minioClient.removeObjects(process.env.STAGING_BUCKET_NAME, keys, function(e) {
            if (e) {
                console.log('Unable to remove Objects ',e);
                res.send('Unable to remove Objects ',e);
            } else {
                console.log('Removed the objects successfully');
                res.send("deleted");
            }

        });
    } else {
        params = {
                Bucket: process.env.STAGING_BUCKET_NAME,
                // Prefix: 'staging/' + u_id + '/'
            };

        params.Delete = {Objects:[]};
        req.body.deleteMe.items.forEach(function(content) {
            params.Delete.Objects.push({Key: 'staging/' + content.uid + '/' + content.key});
        });
        console.log("delete params: " + JSON.stringify(params));
        s3.deleteObjects(params, function(err, data) {
            if (err) {
                console.log("error deleting " + err)
                res.send("error deleting " + err);
            } else {
                res.send("files deleted" + JSON.stringify(data));
            }
        });
    }
});

app.post('/putobjecturl/', requiredAuthentication, function (req, res) {
    console.log("tryna get a puturl for contentTYpe : " + req.body.contentType);
    var cType = req.body.contentType;
    var timestamp = Math.round(Date.now());
    const params = {
        Bucket: '3dcasefiles.com/braincheck',
        //meatadata aqui
        // ACL: 'bucket-owner-full-control',
        // ContentType: 'text/csv',
        Body: '',
        ContentType: cType,
        Key: req.body.filename,
        Expires: 100
    };

    s3.getSignedUrl('putObject', params, function(err, signedUrl) {
        let response;
        if (err) {
            response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                error: 'Did not receive signed url'
            }),
            };
            console.log("putObject url error : " + err );
            res.json(err);
        } else {
            response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            },
            body: "",
            method: "put",
            url: signedUrl,
            fields: []
            };
            console.log("putObject url : " + signedUrl );
            res.json(signedUrl);
        }
    });
});


app.post('/puturl/', requiredAuthentication, function (req, res) {
    console.log("tryna get a puturl for contentTYpe : " + req.body.contentType);
    var cType = req.body.contentType;
    // var timestamp = Math.round(Date.now());
    const params = {
        Bucket: 'archive1/tmp',
        Body: '',
        ContentType: cType,
        Key: req.body.filename,
        Expires: 100
    };

    s3.getSignedUrl('putObject', params, function(err, signedUrl) {
        let response;
        if (err) {
            response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                error: 'Did not receive signed url'
            }),
            };
            console.log("putObject url error : " + err );
            res.json(err);
        } else {
            response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            },
            body: "",
            method: "put",
            url: signedUrl,
            fields: []
            };
            console.log("putObject url : " + signedUrl );
            res.json(signedUrl);
        }
    });
});
// app.post('/objputurl/:_id', requiredAuthentication, function (req, res) {
//     console.log("tryna get a puturl for : " + req.body.uid + " contentTYpe : " + req.body.contentType);
   
//     var isObj
//     var objName;
//     // console.log("process_sgaing_files : " + JSON.stringify(req.body));
   
//     var meateada = {};
//     var groupitems = [];
//     var params = {
//         Bucket: 'archive1',
//     };
//     var originalName = function (name) {
//         var index = name.indexOf("_");
//         return name.substring(index + 1); //strip off prepended timestamp and _ for title and stuff
//     }

//     var isObj = false; //if it's an obj (for now), upload with sibling files, to a named bucket...
//     var objName = "";
//     var cType = req.body.contentType;
//     // if (cType = "application/octet-stream") {
//     //     cType = "binary/octet-stream";
//     // }
//     var u_id = ObjectID(req.params._id);
//     db.users.findOne({"_id": u_id}, function (err, user) {
//         if (err || !user) {
//             console.log("error getting user: " + err);
//         } else {
//             //TODO is user in good standing? 
//             // var params =
//             var timestamp = Math.round(Date.now());
//             var ck = "users/" + item.uid + "/objs/" + objName + "/" + item.key;
//             const params = {
//                 Bucket: 'servicemedia',
//                 //meatadata aqui
//                 // ACL: 'bucket-owner-full-control',
//                 // ContentType: 'text/csv',
//                 Body: '',
//                 ContentType: cType,
//                 // Key: 'staging/' + u_id + '/' + timestamp + '_' + req.body.filename,
//                 Key: "users/" + item.uid + "/objs/" + objName + "/" + req.body.filename,
//                 Expires: 100
//               };
//             // var url = s3.getSignedUrl('putObject', {Bucket: 'servicemedia', Key: "users/" + u_id + "/staging" + req.params.platform_sig, Expires: 600});
//             s3.getSignedUrl('putObject', params, function(err, signedUrl) {
//                 let response;
//                 if (err) {
//                   response = {
//                     statusCode: 500,
//                     headers: {
//                       'Access-Control-Allow-Origin': '*',
//                     },
//                     body: JSON.stringify({
//                       error: 'Did not receive signed url'
//                     }),
//                   };
//                   console.log("putObject url error : " + err );
//                   res.json(err);
//                 } else {
//                   response = {
//                     statusCode: 200,
//                     headers: {
//                       'Access-Control-Allow-Origin': '*', // Required for CORS support to work
//                     },
//                     body: "",
//                     // body: JSON.stringify({
//                     //   message: `Url successfully created`,
//                     //   signedUrl,
//                     // }),
//                     method: "put",
//                     url: signedUrl,
//                     fields: []
//                     };
//                     console.log("putObject url : " + signedUrl );
//                     res.json(response);
//                 }
//             });
//         }
//     });
// });

app.post('/cubemap_puturl/:_id/:image_id', requiredAuthentication, function (req, res) {
    console.log("tryna get a puturl for : " + req.body.uid + " contentTYpe : " + req.body.contentType);
    var cType = req.body.contentType;
    // if (cType = "application/octet-stream") {
    //     cType = "binary/octet-stream";
    // }

  

    var u_id = ObjectID(req.params._id);
    db.users.findOne({"_id": u_id}, function (err, user) {
        if (err || !user) {
            res.send("not a valid user!");
            console.log("error getting user: " + err);
        } else {
            db.image_items.findOne({_id: ObjectID(req.params.image_id)}, function (err, picture_item) {
                if (err || !picture_item) {
                    res.send("not a valid pic!")
                    console.log("error getting picture items: " + err);
                } else {
                    // console.log("gotsa picture ID for cubemap: " + JSON.stringify(picture_item));
            // var timestamp = Math.round(Date.now());
            let mapID = "px";
            if (req.body.mapNumber == "2") {
                mapID = "nx";
            } else if (req.body.mapNumber == "3") {
                mapID = "py";
            } else if (req.body.mapNumber == "4") {
                mapID = "ny";
            } else if (req.body.mapNumber == "5") {
                mapID = "pz";
            } else if (req.body.mapNumber == "6") {
                mapID = "nz";
            }
            const params = {
                Bucket: process.env.S3_ROOT_BUCKET_NAME,
                //meatadata aqui
                // ACL: 'bucket-owner-full-control',
                // ContentType: 'text/csv',
                Body: '',
                ContentType: 'image/jpeg',
                // Key: 'staging/' + u_id + '/' + timestamp + '_' + req.body.filename,
                Key: "users/" + picture_item.userID + "/cubemaps/" + req.params.image_id + "_"+mapID+".jpg",
                Expires: 100
                };
            // var url = s3.getSignedUrl('putObject', {Bucket: 'servicemedia', Key: "users/" + u_id + "/staging" + req.params.platform_sig, Expires: 600});
                s3.getSignedUrl('putObject', params, function(err, signedUrl) {
                    let response;
                    if (err) {
                    response = {
                        statusCode: 500,
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                        },
                        body: JSON.stringify({
                        error: 'Did not receive signed url'
                        }),
                    };
                    console.log("putObject url error : " + err );
                    res.json(err);
                    } else {
                    response = {
                        statusCode: 200,
                        headers: {
                            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                            'Content-Type': 'image/jpeg'
                        },
                        body: "",
                        // body: JSON.stringify({
                        //   message: `Url successfully created`,
                        //   signedUrl,
                        // }),
                        method: "put",
                        url: signedUrl,
                        fields: []
                        };
                        console.log("putObject url : " + signedUrl );
                        res.json(response);
                        }
                    });
                }
            });
        }
    });
});

app.post('/imagetarget_puturl/:_id/:image_id', requiredAuthentication, function (req, res) {
    console.log("tryna get a puturl for : " + req.body.uid + " contentTYpe : " + req.body.contentType);
    var cType = req.body.contentType;
    // if (cType = "application/octet-stream") {
    //     cType = "binary/octet-stream";
    // }

  

    var u_id = ObjectID(req.params._id);
    db.users.findOne({"_id": u_id}, function (err, user) {
        if (err || !user) {
            res.send("not a valid user!");
            console.log("error getting user: " + err);
        } else {
            db.image_items.findOne({_id: ObjectID(req.params.image_id)}, function (err, picture_item) {
                if (err || !picture_item) {
                    res.send("not a valid pic!")
                    console.log("error getting picture items: " + err);
                } else {

            const params = {
                Bucket: process.env.S3_ROOT_BUCKET_NAME,
                //meatadata aqui
                // ACL: 'bucket-owner-full-control',
                // ContentType: 'text/csv',
                Body: '',
                ContentType: 'application/octet-stream',
                // Key: 'staging/' + u_id + '/' + timestamp + '_' + req.body.filename,
                Key: "users/" + picture_item.userID + "/pictures/targets/" + req.params.image_id + ".mind",
                Expires: 100
                };
            // var url = s3.getSignedUrl('putObject', {Bucket: 'servicemedia', Key: "users/" + u_id + "/staging" + req.params.platform_sig, Expires: 600});
                s3.getSignedUrl('putObject', params, function(err, signedUrl) {
                    let response;
                    if (err) {
                    response = {
                        statusCode: 500,
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                        },
                        body: JSON.stringify({
                        error: 'Did not receive signed url'
                        }),
                    };
                    console.log("putObject url error : " + err );
                    res.json(err);
                    } else {
                    response = {
                        statusCode: 200,
                        headers: {
                            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                            'Content-Type': 'application/octet-stream'
                        },
                        body: "",
                        // body: JSON.stringify({
                        //   message: `Url successfully created`,
                        //   signedUrl,
                        // }),
                        method: "put",
                        url: signedUrl,
                        fields: []
                        };
                        console.log("putObject url : " + signedUrl );
                        res.json(response);
                        }
                    });
                }
            });
        }
    });
});



app.post('/stagingputurl/:_id', requiredAuthentication, function (req, res) {
    console.log("tryna get a puturl for : " + req.body.uid + " contentTYpe : " + req.body.contentType);
    var cType = req.body.contentType;
    // if (cType = "application/octet-stream") {
    //     cType = "binary/octet-stream";
    // }
    var u_id = ObjectID(req.params._id);
    db.users.findOne({"_id": u_id}, function (err, user) {
        if (err || !user) {
            console.log("error getting user: " + err);
        } else {
            //TODO is user in good standing? 
            // var params =
            var timestamp = Math.round(Date.now());
            const params = {
                Bucket: 'archive1',
                //meatadata aqui
                // ACL: 'bucket-owner-full-control',
                // ContentType: 'text/csv',
                Body: '',
                ContentType: cType,
                // Key: 'staging/' + u_id + '/' + timestamp + '_' + req.body.filename,
                Key: req.body.filename,
                Expires: 100
              };
            // var url = s3.getSignedUrl('putObject', {Bucket: 'servicemedia', Key: "users/" + u_id + "/staging" + req.params.platform_sig, Expires: 600});
            (async () => {  
                try {
                    if (minioClient) {
                        minioClient.presignedPutObject(process.env.STAGING_BUCKET_NAME, req.body.filename, 1000, function(err, presignedUrl) {
                            if (err) {
                                response = {
                                statusCode: 500,
                                headers: {
                                    'Access-Control-Allow-Origin': '*',
                                },
                                body: JSON.stringify({
                                    error: 'Did not receive signed url'
                                }),
                                };
                                console.log("putObject url error : " + err );
                                res.json(err);
                                
                            } else {
                                response = {
                                statusCode: 200,
                                headers: {
                                    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                                },
                                body: "",
                                // body: JSON.stringify({
                                //   message: `Url successfully created`,
                                //   signedUrl,
                                // }),
                                method: "put",
                                url: presignedUrl,
                                fields: []
                                };
                                console.log("putObject url : " + presignedUrl );
                                res.json(response);
                            }
                            
                          })
                    } else {
                        s3.getSignedUrl('putObject', params, function(err, signedUrl) {
                            let response;
                            if (err) {
                                response = {
                                statusCode: 500,
                                headers: {
                                    'Access-Control-Allow-Origin': '*',
                                },
                                body: JSON.stringify({
                                    error: 'Did not receive signed url'
                                }),
                                };
                                console.log("putObject url error : " + err );
                                res.json(err);
                            } else {
                                response = {
                                statusCode: 200,
                                headers: {
                                    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                                },
                                body: "",
                                // body: JSON.stringify({
                                //   message: `Url successfully created`,
                                //   signedUrl,
                                // }),
                                method: "put",
                                url: signedUrl,
                                fields: []
                                };
                                console.log("putObject url : " + signedUrl );
                                res.json(response);
                            }
                        });
                    }
                } catch (e) {
                    callback(e);
                }
            })();
            // minioClient.presignedPutObject('mybucket', 'hello.txt', 24*60*60, function(err, presignedUrl) {
            //     if (err) return console.log(err)
            //     console.log(presignedUrl)
            //   })

            // s3.getSignedUrl('putObject', params, function(err, signedUrl) {
            //     let response;
            //     if (err) {
            //       response = {
            //         statusCode: 500,
            //         headers: {
            //           'Access-Control-Allow-Origin': '*',
            //         },
            //         body: JSON.stringify({
            //           error: 'Did not receive signed url'
            //         }),
            //       };
            //       console.log("putObject url error : " + err );
            //       res.json(err);
            //     } else {
            //       response = {
            //         statusCode: 200,
            //         headers: {
            //           'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            //         },
            //         body: "",
            //         // body: JSON.stringify({
            //         //   message: `Url successfully created`,
            //         //   signedUrl,
            //         // }),
            //         method: "put",
            //         url: signedUrl,
            //         fields: []
            //         };
            //         console.log("putObject url : " + signedUrl );
            //         res.json(response);
            //     }
            // });
        }
    });
});


app.get('/staging/:_id', requiredAuthentication, function (req, res) {

    u_id = req.params._id;
    response = {};
    rezponze = {};
    stagedItems = [];
    async.waterfall([
        function (callback) {
           
            // (async () => {  
                var params = {
                    Bucket: process.env.STAGING_BUCKET_NAME,
                    Prefix: 'staging/' + u_id + '/'
                }
                // try {
                    if (minioClient) {
                        var data = [];
                        var stream = minioClient.listObjects(process.env.STAGING_BUCKET_NAME,'staging/' + u_id + '/', false);
                        stream.on('data', function(obj) { data.push(obj); } );
                        stream.on("end", function (obj) { 
                            // if (data.Contents.length == 0) {
                            //     console.log("no content found");
                            //     callback(null);
                            // } else {
                                // console.log("data: " + JSON.stringify(data));
                                response = data;
                                callback();
                            // }
                           
                        });
                        stream.on('error', function(err) { 
                            console.log(err);
                            callback(err);
                        } );


                    } else {
                        s3.listObjects(params, function(err, data) {
                            if (err) {
                                console.log(err);
                                return callback(err);
                            }
                            if (data.Contents.length == 0) {
                                console.log("no content found");
                                callback(null);
                            } else {
                                // console.log(data.Contents);
                                response = data.Contents;
                                callback();
                            }
                        });
                    }
            //     } catch (e) {
            //         callback(e);
            //     }
            // })();
            // s3.listObjects(params, function(err, data) {
            //     if (err) {
            //         console.log(err);
            //         return callback(err);
            //     }
            //     if (data.Contents.length == 0) {
            //         console.log("no content found");
            //         callback(null);
            //     } else {
            //         response = data.Contents;
            //         callback();
            //     }
            // });
        },
        function (callback) {

            // async.each (response, function (r, callbackz) { //loop tru w/ async
                // console.log("r = " + JSON.stringify(r));
                // var name = ""
                // if (minioClient) {
                //     name = r.name;
                // } else {
                //     name = r.Key;
                // }
                (async () => {  
                    // try {
                        // console.log("tryna ghet name "+ name);
                    for (let i = 0; i < response.length; i++) {
                        var name = ""
                        if (minioClient) {
                            name = response[i].name; 
                        } else {
                            name = response[i].Key; //close but not identical!
                        }

                        let url = await ReturnPresignedUrl(process.env.STAGING_BUCKET_NAME, name, 6000);
                        name = name.replace('staging/' + u_id + '/', "");
                        var itme = {}
                        itme.name = name;
                        // console.log("modding name : " + itme.name + " " + url);
                        
                        // var assetURL = s3.getSignedUrl('getObject', {Bucket: process.env.STAGING_BUCKET_NAME, Key: r.Key, Expires: 60000});
                        itme.url = url;
        
                        stagedItems.push(itme);
                        // callbackz();
                    }
                    console.log(stagedItems.length + ' staging files have been fetched');
                    stagedItems.reverse();
                    rezponze.stagedItems = stagedItems;
                    callback(null);
                        // callback(null, url);
                    // } catch (e) {
                    //     console.log(e);
                    //     callbackz(e);
                    // }
                })();

                    // if (!name.includes("cubemaps")) { //skip cubemaps stored here for now...
                    //     // name = name.replace('staging/' + u_id + '/', "");
                    //     // var itme = {}
                    //     // itme.name = name;
                    //     // // console.log("modding name : " + itme.name);
                        
                    //     // var assetURL = s3.getSignedUrl('getObject', {Bucket: process.env.STAGING_BUCKET_NAME, Key: r.Key, Expires: 60000});
                    //     // itme.url = assetURL;
        
                    //     // stagedItems.push(itme);
                    //     // callbackz();
                    //     } else {
                    //     callbackz();
                    //     }
                
            // }, function(err) {
               
            //     if (err) {
            //         console.log('A file failed to process');
            //         callback(err);
            //     } else {
            //         console.log(stagedItems.length + ' staging files have been processed successfully');
            //         stagedItems.reverse();
            //         rezponze.stagedItems = stagedItems;
            //         callback(null);
            //     }
            // });
        }
    ],
    function (err, result) { // #last function, close async
        res.json(rezponze);
        // console.log("staging files fetchd! : " + result);
    });
});


app.get('/gltf/:_id', function (req, res) {

    u_id = req.params._id;
    response = {};
    rezponze = {};
    gltfItems = [];
    async.waterfall([
        function (callback) {
            var params = {
                Bucket: 'servicemedia',
                Prefix: 'users/' + u_id + '/gltf/'
            }
            s3.listObjects(params, function(err, data) {
                if (err) {
                    console.log(err);
                    return callback(err);
                }
                if (data.Contents.length == 0) {
                    console.log("no content found");
                    callback(null);
                } else {
                    response = data.Contents;
                    callback();
                }
            });
        },
        function (callback) {

            async.each (response, function (r, callbackz) { //loop tru w/ async
                // console.log("r = " + JSON.stringify(r.Headers));
                var name = r.Key;
                name = name.replace('users/' + u_id + '/gltf/', "");
                var itme = {}
                itme.name = name;
                // console.log("modding name : " + itme.name);
                var assetURL = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: r.Key, Expires: 60000});
                itme.url = assetURL;

                gltfItems.push(itme);
                callbackz();
            }, function(err) {
               
                if (err) {
                    console.log('A file failed to process');
                    callbackz(err);
                } else {
                    console.log('All files have been processed successfully');
                    gltfItems.reverse();
                    rezponze.gltfItems = gltfItems;
                    callback(null);
                }
            });
        }
    ],
    function (err, result) { // #last function, close async
        res.json(rezponze);
        console.log("waterfall done: " + result);
    });
});

app.get('/archived/:_id', requiredAuthentication, function (req, res) {

    u_id = req.params._id;
    response = {};
    rezponze = {};
    stagedItems = [];
    async.waterfall([
        function (callback) {
            var params = {
                Bucket: 'archive1',
                Prefix: 'archived/' + u_id + '/'
            }
            s3.listObjects(params, function(err, data) {
                if (err) {
                    console.log(err);
                    return callback(err);
                }
                if (data.Contents.length == 0) {
                    console.log("no content found");
                    callback(null);
                } else {
                    response = data.Contents;
                    callback();
                }
            });
        },
        function (callback) {

            async.each (response, function (r, callbackz) { //loop tru w/ async
                // console.log("r = " + JSON.stringify(r.Headers));
                var name = r.Key;
                name = name.replace('staging/' + u_id + '/', "");
                var itme = {}
                itme.name = name;
                var assetURL = s3.getSignedUrl('getObject', {Bucket: 'archive1', Key: r.Key, Expires: 60000});
                itme.url = assetURL;

                stagedItems.push(itme);
                callbackz();
            }, function(err) {
               
                if (err) {
                    console.log('A file failed to process');
                    callbackz(err);
                } else {
                    console.log('All files have been processed successfully');
                    stagedItems.reverse();
                    rezponze.stagedItems = stagedItems;
                    callback(null);
                }
            });
        }
    ],
    function (err, result) { // #last function, close async
        res.json(rezponze);
        console.log("waterfall done: " + result);
    })
});
// route below returns "raw" s3 data, one above is parsed / saved/ updated from it on client
app.get('/assets/:_id', checkAppID, requiredAuthentication, usercheck, function (req, res) {

//       if (amirite("admin", req.session.user._id.toString())) { //check the acl

    console.log("tryna get assets for user...");
    var u_id = ObjectID(req.params._id);
    db.users.findOne({"_id": u_id}, function (err, user) {
        if (err || !user) {
            console.log("error getting user: " + err);
        } else {
            assetsResponse = user;
            assetsResponse.scenes_ios = {};
            assetsResponse.scenes_android = {};
            assetsResponse.scenes_win = {};
            assetsResponse.bundles_ios = {};
            assetsResponse.bundles_android = {};
            assetsResponse.bundles_win = {};
            console.log("gettting assets for user " + req.params._id);

            async.waterfall([
                    function (callback) {
                        var params = {
                            Bucket: 'mvmv.us',
//                            Delimiter: '/',
                            Prefix: 'assets_2018_1/scenes_ios/'
                        }

                        s3.listObjects(params, function(err, data) {
                            if (err) {
                                console.log(err);
                                return callback(err);
                            }
                            if (data.Contents.length == 0) {
                                console.log("no content found");
                                callback(null);
                            } else {
                                assetsResponse.scenes_ios = data.Contents;
                                callback();
                            }
                        });
                    },
                    function (callback) {
                        var params = {
                            Bucket: 'mvmv.us',
//                            Delimiter: '/',
                            Prefix: 'assets_2018_1/scenes_android/'
                        }
                        s3.listObjects(params, function(err, data) {
                            if (err) {
                                console.log(err);
                                return callback(err);
                            }
                            if (data.Contents.length == 0) {
                                console.log("no content found");
                                callback(null);
                            } else {
                                assetsResponse.scenes_android = data.Contents;
                                callback();
                            }
                        });

                    },
                    function (callback) {
                        var params = {
                            Bucket: 'mvmv.us',
//                            Delimiter: '/',
                            Prefix: 'assets_2018_1/scenes_win/'
                        }
                        s3.listObjects(params, function(err, data) {
                            if (err) {
                                console.log(err);
                                return callback(err);
                            }
                            if (data.Contents.length == 0) {
                                console.log("no content found");
                                callback(null);
                            } else {
                                assetsResponse.scenes_win = data.Contents;
                                callback();
                            }
                        });

                    },
                    function (callback) {
                        var params = {
                            Bucket: 'mvmv.us',
//                            Delimiter: '/',
                            Prefix: 'assets_2018_1/bundles_ios/'
                        }
                        s3.listObjects(params, function(err, data) {
                            if (err) {
                                console.log(err);
                                return callback(err);
                            }
                            if (data.Contents.length == 0) {
                                console.log("no content found");
                                callback(null);
                            } else {
                                assetsResponse.bundles_ios = data.Contents;
                                callback();
                            }
                        });
                    },
                    function (callback) {
                        var params = {
                            Bucket: 'mvmv.us',
//                            Delimiter: '/',
                            Prefix: 'assets_2018_1/bundles_android/'
                        }
                        s3.listObjects(params, function(err, data) {
                            if (err) {
                                console.log(err);
                                return callback(err);
                            }
                            if (data.Contents.length == 0) {
                                console.log("no content found");
                                callback(null);
                            } else {
                                assetsResponse.bundles_android = data.Contents;
                                callback();
                            }
                        });
                    },
                    function (callback) {
                        var params = {
                            Bucket: 'mvmv.us',
//                            Delimiter: '/',
                            Prefix: 'assets_2018_1/bundles_win/'
                        }
                        s3.listObjects(params, function(err, data) {
                            if (err) {
                                console.log(err);
                                return callback(err);
                            }
                            if (data.Contents.length == 0) {
                                console.log("no content found");
                                callback(null);
                            } else {
                                assetsResponse.bundles_win = data.Contents;
                                callback();
                            }
                        });

                    },
                    function (callback) {
                        callback();


                    }],
                function (err, result) { // #last function, close async
                    res.json(assetsResponse);
                    console.log("waterfall done: " + result);
                }
            );
        }
    });
});

app.get('/sharedasset/:assetstring', checkAppID, requiredAuthentication, function (req, res) {

    console.log("tryna get asset " + req.params.assetstring);
    var assetString = req.params.assetstring.replace("/", ".");
    var assetURL = s3.getSignedUrl('getObject', {Bucket: 'mvmv.us', Key: assetString, Expires: 60000});
    res.send(assetURL);
});

app.post('/resetcheck', function (req, res) {
    console.log("reset check:" + req.body.hzch);
    db.users.findOne({"resetHash": req.body.hzch}, function (err, user) {
        if (err || !user) {
            console.log("error getting user: " + err);
            res.send("invalidlink");
        } else {
            var timestamp = Math.round(Date.now() / 1000);
            if (timestamp < user.resetTimestamp + 3600) { //expires in 1 hour!
                console.log(user.resetTimestamp);
                res.send("validlink");
            } else {
                console.log("expired link");
                res.send("invalidlink");
            }
        }
    });
});

app.post('/optout/', function (req, res) {
    console.log("tryna optout " + JSON.stringify(req.body));
    var timestamp = Math.round(Date.now() / 1000);
    db.people.findOne({email: req.body.sentToEmail}, function  (err, person) {
        if (err || !person) {
            res.send(err);
        } else {
            db.people.updateOne( { "email": req.body.sentToEmail }, {$set: {accountStatus : "Email Verified", contactStatus: "Opt Out Global", lastUpdate: timestamp}}, function (err, saved) {
                if (err || !saved) {
                    res.send(err);
                } else {
                    res.send(saved);
                }
            });
        }
    });
});

app.get('/optout_check/:hzch', function (req, res) { //called from /landing/invite.html
    let hash = req.params.hzch;
    let requestProtocol = 'https';
    if (req.headers.host.includes("localhost")) {
        requestProtocol = 'http';
    }

    db.invitations.findOne({"invitationHash": hash}, function (err, invitation) {
        var timestamp = Math.round(Date.now() / 1000);
        if (err || !invitation) {
            console.log("did not find invitation: " + err);
            res.send("not found");
        } else {
            // console.log("invitation check:" + JSON.stringify(invitation));
           
                var response = {};
                response.short_id = invitation.invitedToSceneShortID;
                response.sentByUserName = invitation.sentByUserName;
                response.sentByUserID = invitation.sentByUserID;
                response.sentToEmail = invitation.sentToEmail;
                res.send(response);
                // response.url = requestProtocol + "://" + req.headers.host + "/webxr/" + invitation.invitedToSceneShortID + "?p=" + pin;

        }
    }); 
});
app.get('/invitation_check/:hzch', function (req, res) { //called from /landing/invite.html
    let hash = req.params.hzch;
    let requestProtocol = 'https';
    if (req.headers.host.includes("localhost")) {
        requestProtocol = 'http';
    }

    db.invitations.findOne({"invitationHash": hash}, function (err, invitation) {
        var timestamp = Math.round(Date.now() / 1000);
        if (err || !invitation) {
            console.log("did not find invitation: " + err);
            res.send("not found");
        } else {
            // console.log("invitation check:" + JSON.stringify(invitation));
           
            var pin = Math.random().toString().substr(2,6); //hrm...
            if (timestamp < invitation.invitationTimestamp + 36000) { //expires in 10 hour! //TODO access window start and end timestamps
                console.log("timestamp checks out!" + JSON.stringify(invitation));

                db.invitations.update ( { "invitationHash": hash }, { $set: { validated: true, pin : pin, pinTimeout: timestamp + 6400} }); 
                var response = {};
                response.short_id = invitation.invitedToSceneShortID;
                response.ok = "yep";
                response.pin = pin;
                response.to = invitation.sentToEmail;
                response.timestampStart = invitation.sceneEventStart;
                response.timestampEnd = invitation.sceneEventEnd;
                response.url = requestProtocol + "://" + req.headers.host + "/webxr/" + invitation.invitedToSceneShortID + "?p=" + pin;
               
                QRCode.toDataURL(response.url, function (err, url) {
 
                response.qrcode = url;
                res.send(response);
                });
               
            } else {
                console.log("expired link");
                res.send("expired_"+invitation.invitedToSceneShortID); //send back sceneID, to allow invite request
            }

            db.actions.findOne({"actionType": "Send Email"}, function (err, emailAction) {
                if (err || !emailAction) {
                    callback("error getting email action!" + err);
                } else {
                    action.actionID = emailAction._id;
                    action.actionName = "Invitation Click"
                    action.actionType = "Send Email"
                    action.actionResult = "Invitation Button Clicked";
                    action.timestamp = timestamp * 1000; //ms trimmed on client
                    action.targetPersonID = ObjectID(invitation.targetPersonID);
                    action.userID = ObjectID(invitation.sentByUserID)
                
                    action.targetEmail = invitation.sentToEmail;
                    action.fromScene = invitation.invitedToSceneShortID;
                    // action.data = req.body.sceneShareWithMessage;
                    db.activities.insertOne(action);
                } 
            });
            let action = {};
            db.people.updateOne( { "email": invitation.sentToEmail }, {$set: {accountStatus : "Email Verified", lastUpdate: timestamp}});
        }
    }); 
});
app.post('/invitation_req/', function (req,res) {
    console.log("invite req " + JSON.stringify(req.body));
    let thePerson = null;
    let referrer = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
    if (req.body.shortID != undefined && req.body.shortID.length > 4) {
        db.scenes.findOne({"short_id": req.body.shortID}, function (err, scene) {
            if (err ||!scene) {
                res.send("nope");
            } else {
                if (scene.sceneShareWithGroups != undefined && scene.sceneShareWithGroups != null) {
                    if (scene.sceneShareWithGroups.toString().toLowerCase().includes("disallow all")) {
                        res.send("nope - invitations disallowed");
                    } else {
                        async.waterfall([

                            function(callback) { //is this account in the scene's allowed groups? 
                                callback(null); //...
                            },
                            function(callback) { //is accountStatus OK?
                                
                                db.people.findOne({"email": req.body.email.trim()}, function (err, person) {
                                    let action = {};
                                    let ts = Date.now();
                                    if (err) {
                                        console.log("error lookinup person didn't find that person's email for invite req");
                                        callback("error on personlookup!");
                                    } else {
                                        if  (!person) {
                                            console.log("tryna creqate new persosa");
                                            let activities = [];
                                            let action1 = {};
                                            let action2 = {};
                                            action1.createNewPerson = ts;
                                            action2.requestedInvitation = ts + "_" + req.body.shortID + "_" + referrer;
                                            activities.push(action1);
                                            activities.push(action2); //bc they need to be separate array elements
                
                                            db.people.save( { "email": req.body.email.trim()}, { $set: {
                                                lastUpdate : ts,
                                                activities : activities,
                                                accountStatus: 'Not Verified',
                                                contactStatus: 'Not Indicated'
                                            }}, 
                                            function (err, saved) {
                                                if ( err || !saved ) {
                                                    console.log('person not saved..');
                                                    callback (err);
                                                } else {
                                                    callback(null);
                                                    thePerson = saved;
                                                }
                                            });
                                        } else {
                                            if (person.activities == undefined) {
                                                person.activities = [];
                                            }
                                            action.requestedInvitation = ts + "_" + req.body.shortID + "_" + referrer;
                                            person.activities.push(action);
                                            if (person.accountStatus == undefined) {
                                                person.accountStatus = "Not Verified";
                                            }
                                            if (person.contactStatus == undefined) {
                                                person.contactStatus = "Not Indicated";
                                            }
                                            db.people.update( { "_id": person._id }, { $set: {
                                                lastUpdate : ts,
                                                activities : person.activities,
                                                accountStatus: person.accountStatus,
                                                contactStatus: person.contactStatus
                                            }});
                                            thePerson = person;
                                            console.log("gotsa person" + person.activities.length + " "+ person.accountStatus);
                                            if (person.accountStatus != undefined && (person.accountStatus.toString().toLowerCase().includes("blacklist") || person.accountStatus.toString().toLowerCase().includes ("banned"))) {
                                                callback("nope  - that account is blocked");
                                            } else if (person.accountStatus != undefined && (person.activities != undefined && person.activities.length > 3) && person.accountStatus.toString().toLowerCase().includes("not verified")) {
                                                callback("nope  - that account is not verified");
                                            } else if (person.contactStatus != undefined && (person.contactStatus.toString().toLowerCase().includes("global opt out"))) {
                                                callback("nope  - user has opted out"); //pass along and bail later?
                                            } else {
                                                callback(null);
                                            }
                                        }
                                    }
                                });
                            },
                           
                            // function(person, callback) { //send mail
                            //     console.log("gotsa person " + JSON.stringify(person) );
                            //     callback(null, person);
                                
                            // },
                            function (callback) {
                                // if (person.length > 0) {
                                // let emailArray = eData;
                                db.scenes.findOne({short_id: req.body.shortID}, function (err, scene) {
                                    if (err || !scene) {
                                        console.log("error getting scene for sharing: " + err);
                                        callback(err);
                                    } else {
                                        theScene = scene;
                                        let urlHalf = "";
                                        if (scene.scenePostcards != null && scene.scenePostcards.length > 0) {
                                            var oo_id = ObjectID(scene.scenePostcards[0]); //TODO randomize? or ensure latest?  or use assigned default?
                                            db.image_items.findOne({"_id": oo_id}, function (err, picture_item) {
                                                if (err || !picture_item || picture_item.length == 0) {
                                                    console.log("error getting postcard for availablescenes: 2" + err);
                                                    callback(null, '', eData)
                                                } else {
                                                    var item_string_filename = JSON.stringify(picture_item.filename);
                                                    item_string_filename = item_string_filename.replace(/\"/g, "");
                                                    var item_string_filename_ext = getExtension(item_string_filename);
                                                    var expiration = new Date();
                                                    expiration.setMinutes(expiration.getMinutes() + 30);
                                                    var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                                                    var halfName = 'half.' + baseName + item_string_filename_ext;
                                                    // var quarterName = 'quarter.' + baseName + item_string_filename_ext;
                                                    // var standardName = 'standard.' + baseName + item_string_filename_ext;
                                                    var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + halfName, Expires: 6000}); //just send back thumbnail urls for list
                                                    // var urlQuarter = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + quarterName, Expires: 6000}); //just send back thumbnail urls for list
                                                    callback(null, urlHalf, scene);
                                                }
                                            });
                                        } else {
                                            callback(null, '', scene);
                                        }
                                    }
                                });
                            },
                            function(urlHalf, sceneData, callback) {
                                console.log("scene locations " +JSON.stringify(sceneData.sceneLocations));
                                let geoLinks = "";
                                let eventData = {};
                                for (let i = 0; i < sceneData.sceneLocations.length; i++) {
                                    if (sceneData.sceneLocations[i].type.toLowerCase() == "geographic") { //TODO what if multiple?  this will get last one in array, maybe?
                                        geoLinks += "<strong><a href='http://maps.google.com?q=" + sceneData.sceneLocations[i].latitude + "," + sceneData.sceneLocations[i].longitude + "'>Map to location: "+sceneData.sceneLocations[i].name+"</a></strong><br><br>"+
                                        "<a target=\x22_blank\x22 href=\x22http://maps.google.com?q=" + sceneData.sceneLocations[i].latitude + "," + sceneData.sceneLocations[i].longitude + "\x22>" +
                                            "<img class=\x22img-thumbnail\x22 style=\x22width: 300px;\x22 src=\x22https://maps.googleapis.com/maps/api/staticmap?center=" + sceneData.sceneLocations[i].latitude +
                                            "," + sceneData.sceneLocations[i].longitude + "&zoom=15&size=600x400&maptype=roadmap&key=AIzaSyCBlNNHgDBmv-vusmuvG3ylf0XjGoMkkCo&markers=color:blue%7Clabel:%7C" + sceneData.sceneLocations[i].latitude + "," + sceneData.sceneLocations[i].longitude + "\x22>" + 
                                            "</a>";
                                        if (sceneData.sceneLocations[i].eventData != undefined && sceneData.sceneLocations[i].eventData.toLowerCase().includes('restrict')) {
                                            eventData.restrictToLocation = true;
                                        }
                                    }
                                }
                                callback(null, urlHalf, sceneData, geoLinks, eventData);
                            },
                    
                            function(urlHalf, sceneData, geoLinks, eventData, callback) { //pull out  event data
                                console.log("scene locations " +JSON.stringify(sceneData.sceneTags));
                    
                                if ((sceneData.sceneEventStart != undefined && sceneData.sceneEventStart != null) || (sceneData.sceneEventEnd != undefined && sceneEventEnd != null)) {
                                        eventData.eventStart = sceneData.sceneEventStart;
                                        eventData.eventEnd = sceneData.sceneEventEnd;
                                
                                        if (sceneData.sceneTags != undefined && sceneData.sceneTags != null && sceneData.sceneTags.length > 0 && sceneData.sceneTags.toString().toLowerCase().includes("restrict to event")) {
                                            eventData.restrictToEvent = true;
                                        } else {
                                            eventData.restrictToEvent = false;
                                        }
                                    }
                                callback(null, urlHalf, geoLinks, eventData);
                            },
                    
                            function(urlHalf, geoLinks, eventData, callback) { //spin through validated data, send appropriate mail
                                // console.log("eDatahs : " +JSON.stringify(eData));
                                // let trimmedMails = [" a ", "b", " c", "d "].map(function(e){return e.trim();}); erp
                                // async.each (eData, function (data, callbackzz) {
                                    // console.log("email data is " + data);
                                    let requestProtocol = 'https';
                                    if (req.headers.host.includes("localhost")) {
                                        requestProtocol = 'http';
                                    }
                                    var subject = "Invitation : " + theScene.sceneTitle;
                                    var from = adminEmail;
                                   
                                    var to = [thePerson.email];
                                   
                                    var bcc = [];
                                    
                                    var timestamp = Math.round(Date.now() / 1000);
                                    var message = "";
                                    var restrictToEventMessage = eventData.restrictToEvent ? "<br>Access is restricted to the event time" : "";
                                    var restrictToLocationMessage = eventData.restrictToLocation ? "<br>Access is restricted to the event location<br>" : "";
                                   
                                    var app_link = "servicemedia://scene?" + req.body.short_id;
                                   
                                    if (req.body.sceneShareWithMessage === "" || req.body.sceneShareWithMessage == null) {
                                        message = "Here's your immersive scene invitation - follow the link below to gain access!";
                                    } 
                                    // else {
                                    //     message = " has shared an Immersive Scene with this message: " +
                                    //         "<hr><br><strong> " + req.body.sceneShareWithMessage +  "</strong><br>";
                                    // }
                                    message += restrictToEventMessage + restrictToLocationMessage;
                                    if (req.body.sceneEventStart != undefined && req.body.sceneEventStart != null && req.body.sceneEventStart != "" ) {
                                        let datetimeString = new Date(req.body.sceneEventStart);
                                        message += "<br><strong>Event start: " + datetimeString.toLocaleString([], { hour12: true}) + "</strong><br>";
                                        // message += "<br><strong>Event start: " + datetimeString.toString() + "</strong><br>";
                                        console.log(message);
                                    }
                                    if (req.body.sceneEventEnd != undefined && req.body.sceneEventEnd != null && req.body.sceneEventEnd != "") {
                                        let datetimeString = new Date(req.body.sceneEventEnd);
                                        message += "<strong>Event end: " + datetimeString.toLocaleString([], { hour12: true})  + "</strong><br>";
                                    }
                                    message += geoLinks;
                                    if (theScene.sceneShareWithPublic) {
                                        var htmlbody = message + "</h3><hr>" +
                                            "<a href='"+ requestProtocol + "://" + req.headers.host + "/webxr/" + req.body.short_id+"' target='_blank'>" +
                                            "<button style='font-family: Arial, Helvetica, sans-serif;  font-size: 18px; background-color: blue; color: white; border-radius: 8px; margin: 10px; padding: 10px;'>"+
                                            "Click here to access this scene!</a></button><br>" +
                                            "<br> <a href='"+ requestProtocol + "://" + req.headers.host + "/webxr/" + req.body.short_id+"' target='_blank'><img src=" + urlHalf + "></a> " +
                                            "<br> Scene Title: " + theScene.sceneTitle +
                                            "<br> Scene Short ID: " + theScene.short_id +
                                            "<br> Scene Keynote: " + theScene.sceneKeynote +
                                            "<br> Scene Description: " + theScene.sceneDescription +
                                            "<br> Owner: " + theScene.userName +
                                            "<br><br><strong><a href='"+ requestProtocol + "://" + req.headers.host + "/qrcode/" + req.body.short_id + "'>Click here to scan QR Code for this scene</a></strong>" +
                                            "<br> For more scenes like this, or to get the latest app, visit <a href='https://servicemedia.net'>ServiceMedia.net!</a> ";
                                        ses.sendEmail( {
                                                Source: from,
                                                Destination: { ToAddresses: to, BccAddresses: bcc},
                                                Message: {
                                                    Subject: {
                                                        Data: subject
                                                    },
                                                    Body: {
                                                        Html: {
                                                            Data: htmlbody
                                                        }
                                                    }
                                                }
                                            }
                                            , function(err, data) {
                                                if(err)  callback(err);
                                                console.log('Email sent:');
                                                console.log(data);
                                            });
                                        // callbackzz();
                                        callback(null);
                                    } else {
                                        //TODO check user's auth?
                                        // if (timestamp < user.resetTimestamp + 3600) { //expires in 1 hour!
                                        bcrypt.genSalt(3, function(err, salt) { //level3 easy, not a password itself
                                            bcrypt.hash(timestamp.toString(), salt, null, function(err, hash) {
                                                // reset = hash;
                                                var cleanhash = validator.blacklist(hash, ['/','.','$']); //make it URL safe
                                                var invitation = {
                                                    validated: false,
                                                    // invitedToSceneShareWithPublic:
                                                    invitedToSceneTitle: theScene.sceneTitle,
                                                    invitedToSceneID: theScene._id,
                                                    invitedToSceneShortID: theScene.short_id,
                                                    accessTimeWindow: timestamp + 86400, //one day //will deprecate...
                                                    sceneEventStart : req.body.sceneEventStart,
                                                    sceneEventEnd: req.body.sceneEventEnd,
                                                    sceneAccessLinkExpire: req.body.sceneAccessLinkExpire,
                                                    sceneRestrictToEvent: eventData.restrictToEvent,
                                                    sceneRestrictToLocation: eventData.restrictToLocation,
                                                    sentByUserName: thePerson.email,
                                                    sentByUserID: "00000000000000000",
                                                    sentToEmail: to,
                                                    sentToPersonID: thePerson._id,
                                                    invitationHash: cleanhash,
                                                    invitationTimestamp: timestamp,
                                                }
                                                db.invitations.save(invitation, function (err, saved) {
                                                    if ( err || !saved ) {
                                                        console.log('problem saving invitaiton');
                                                    } else {
                                                        // var item_id = saved._id.toString();
                                                        console.log('new invitiation id: ' + saved._id.toString());
                                                    }
                                                });
                                                if (req.body.sceneShareWithMessage === "" || req.body.sceneShareWithMessage == null) {
                                                    message = "Here's your immersive scene invitation - follow the link below to gain access!";
                                                    // "<h3>Scene Invitation from " + from + "</h3><hr><br>"
                                                }
                                                //  else {
                                                //     message = req.session.user.userName + " has shared an Immersive Scene with this message: "+
                                                //         "<hr><strong>" + req.body.sceneShareWithMessage +  "</strong><br><hr>";
                                                // }
                                                message += restrictToEventMessage + restrictToLocationMessage;
                                                if (req.body.sceneEventStart != undefined && req.body.sceneEventStart != null && req.body.sceneEventStart != "") {
                                                    let datetimeString = new Date(req.body.sceneEventStart);
                                                    message += "<br><strong>Event start: " + datetimeString.toLocaleString([], { hour12: true}) + "</strong><br>";
                                                    // message += "<br><strong>Event start: " + datetimeString.toString() + "</strong><br>";
                                                    console.log(message);
                                                }
                                                if (req.body.sceneEventEnd != undefined && req.body.sceneEventEnd != null && req.body.sceneEventEnd != "") {
                                                    let datetimeString = new Date(req.body.sceneEventEnd);
                                                    message += "<strong>Event end: " + datetimeString.toLocaleString([], { hour12: true})  + "</strong><br>";
                                                }
                                                message += geoLinks;
                                                var htmlbody = message +
                                                    "<br> Scene Title: " + theScene.sceneTitle +
                                                    "<br> Short ID: " + theScene.short_id +
                                                    "<br> Keynote: " + theScene.sceneKeynote +
                                                    "<br> Description: " + theScene.sceneDescription +
                                                    "<br> Owner: " + theScene.userName +
                                                    "<br><strong>This is a private scene, intended only for subscribers or invited guests.</strong><br>" +
                                                    "<a href='"+ requestProtocol + "://" + req.headers.host + "/landing/invite.html?iv=" + cleanhash + "' target='_blank'>" +
                                                    "<button style='font-family: Arial, Helvetica, sans-serif;  font-size: 18px; background-color: blue; color: white; border-radius: 8px; margin: 10px; padding: 10px;'>" +
                                                    "Click here to authenticate your access!</a></button><br>" +
                                                    "<br> <img src=" + urlHalf + "> " +
                                                    "<br> For more info, or to become a subscriber, visit <a href='https://servicemedia.net'>ServiceMedia.net!</a> ";
                                            ses.sendEmail( {
                                                    Source: from,
                                                    Destination: { ToAddresses: to, BccAddresses: bcc },
                                                    Message: {
                                                        Subject: {
                                                            Data: subject
                                                        },
                                                        Body: {
                                                            Html: {
                                                                Data: htmlbody
                                                            }
                                                        }
                                                    }
                                                }
                                                , function(err, data) {
                                                    if(err) callback(err);
                                                    console.log('Email sent:');
                                                    console.log(data);
                                                    
                                                });
                                            });
                                        });
                                        
                                    }
                                    callback(null);
                                }
                            // }
                        ],
                        function (err, result) { // #last function, close async
                            if (err) {
                                console.log("error with invitereq " + err);
                                res.send(err);
                            } else {
                                console.log("invitation_req done: " + JSON.stringify(result));
                                res.send("invitation sent");
                            }
                            }
                        );
                        
                    }
                }
            }
        })
    } else {
        res.send("nope");
    }
});

app.post ('/get_invitations', checkAppID, requiredAuthentication, function (req,res) {// sigh, need to encrypt this...
    var timestamp = Math.round(Date.now() / 1000);
    console.log("tryna get_invitations: " + JSON.stringify(req.body) + " at timestamp " + timestamp);
    // var emailString = req.body.email;
    if (req.body.email != null)
    var query = {$and: [{sentToEmail : req.body.email}, {validated : true}, {accessTimeWindow: {$gt : timestamp}}]};
    if (req.body.pin != null)
    var query = {$and: [{pin : req.body.pin}, {validated : true}, {accessTimeWindow: {$gt : timestamp}}]};
    console.log("tryna get_invitations: " + JSON.stringify(req.body) + " at timestamp " + timestamp + " with query " + query);
    if (query != null) {
        db.invitations.find (query, function (err, invitations) {
            // db.invitations.find ({$and: [{sentToEmail : req.body.email}, {validated : true} ]}, function (err, invitations) {
            if (err || !invitations) {
                console.log("error getting invitations: " + err);
            } else {
                //TODO - Pass along a postcard for each invitation..., needs an async
                var invitationsData = {};
                invitationsData.invitations = invitations;
                res.json(invitationsData);
            }
        });
    } else {
        res.end("null query");
    }
});

app.post('/savepw', function (req, res){

    db.users.findOne({"resetHash": req.body.hzch}, function (err, user) {
        if (err || !user) {
            console.log("error getting user: " + err);
        } else {
            var timestamp = Math.round(Date.now() / 1000);
            if (timestamp < user.resetTimestamp + 3600) { //expires in 1 hour!
                // console.log(req.body.password);
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(req.body.password, salt, null, function(err, hash) {
                        db.users.update( { _id: user._id }, { $set: { resetHash: "", resetTimestamp: timestamp, password: hash}});
                        res.send("pwsaved");
                    });
                });
            } else {
                console.log("expired link");
                res.send("expiredlink");
            }

        }
    });
});

app.post('/resetpw', function (req, res) {

    console.log('reset request from: ' + req.body.email);
    // ws.send("authorized");
    var subject = topName + " Password Reset";
    var from = "admin@servicemedia.net";
    var to = [req.body.email];
    // var to = [adminEmail];
    var bcc = [domainAdminEmail];
    //var reset = "";
    var timestamp = Math.round(Date.now() / 1000);

    if (validator.isEmail(req.body.email) == true) {

        db.users.findOne({"email": req.body.email}, function (err, user) {
            if (err || !user) {
                console.log("error getting user: " + err);
                res.send("email address not found");
            } else {

                bcrypt.genSalt(3, function(err, salt) { //level3 easy, not a password itself
                    bcrypt.hash(timestamp.toString(), salt, null, function(err, hash) {
                        // reset = hash;
                        var cleanhash = validator.blacklist(hash, ['/','.','$']); //make it URL safe
                        db.users.update( { _id: user._id }, { $set: { resetHash: cleanhash, resetTimestamp: timestamp}});
                        var htmlbody = "<h3>" + topName + " Password Reset</h3><hr><br>" +
                            "Click here to reset your password (link expires in 1 hour): </br>" +
                            rootHost + "/main/resetter.html?hzch=" + cleanhash;
                        // console.log(domainAdminEmail + " tryna send html body" + htmlbody);
                    ses.sendEmail( {
                            Source: from,
                            Destination: { ToAddresses: to, CcAddresses: [], BccAddresses: bcc},
                            Message: {
                                Subject: {
                                    Data: subject
                                },
                                Body: {
                                    Html: {
                                        Data: htmlbody
                                    }
                                }
                            }
                        }
                        , function(err, data) {
                            if(err) {
                                res.send(err);
                            } else {
                                res.send('email sent');
                            }
                            // console.log('Email sent:');
                            // console.log(data);
                            
                            // res.redirect("/#/");
                        });
                    });
                });
            }
        });
    } else {
        res.send("invalid email address");
    }
});

app.post('/send_invitations', requiredAuthentication, checkAppID, function (req, res) { //nope

    console.log('send request from: ' + req.body.email);
    // ws.send("authorized");
    var subject = topName + "  Invitation"
    var from = adminEmail
    var to = [req.body.email];
    var bcc = [ "polytropoi@gmail.com"];
    //var reset = "";
    var timestamp = Math.round(Date.now() / 1000);

    if (validator.isEmail(req.body.email) == true) {

        // db.users.findOne({"email": req.body.email}, function (err, user) {
        //     if (err || !user) {
        //         console.log("error getting user: " + err);
        //         res.send("email address not found");
        //     } else {

                bcrypt.genSalt(3, function(err, salt) { //level3 easy, not a password itself
                    bcrypt.hash(timestamp.toString(), salt, null, function(err, hash) {
                        // reset = hash;
                        var cleanhash = validator.blacklist(hash, ['/','.','$']); //make it URL safe
                        db.invitations.save( { _id: user._id }, { $set: { invitationHash: cleanhash, invitationTimestamp: timestamp}});
                        var htmlbody = "<h3>" + topName + " Invitation from " + from + "</h3><hr><br>" +
                            "Click here authenticate your access (link expires in 1 hour): </br>" +
                            rootHost + "/invitation/" + cleanhash;

                    ses.sendEmail( {
                            Source: from,
                            Destination: { ToAddresses: to, BccAddresses: bcc},
                            Message: {
                                Subject: {
                                    Data: subject
                                },
                                Body: {
                                    Html: {
                                        Data: htmlbody
                                    }
                                }
                            }
                        }
                        , function(err, data) {
                            if(err) throw err
                            console.log('Email sent:');
                            console.log(data);

                            res.redirect(rootHost);
                        });
                    });
                });
        //     }
        // });
    } else {
        res.send("invalid email address");
    }
});


app.post('/send_invitez/', requiredAuthentication, function (req, res) { //nope
    console.log("tryna send invite: " + JSON.stringify(req.body)); 
    res.send("sent");
});

// app.post('/invite_scene/:_id', checkAppID, requiredAuthentication, function (req, res) {
//     console.log("share node: " + req.body._id + " wmail: " + req.body.sceneShareWith);

app.post('/send_invite/', requiredAuthentication, function (req, res) { //nope
    console.log("tryna send invite : " + JSON.stringify(req.body));
    let addressArray = req.body.sceneShareWithPeople.split(",");
    async.each (addressArray, function (emailAddress, callbackz) { //loop tru w/ async
       
        var subject = "Invitation to Immersive Scene : " + req.body.sceneTitle;
        var from = adminEmail;
        var to = [emailAddress.trim()];
        // var to = ['polytropoi@gmail.com'];
        var bcc = [adminEmail];
        //var reset = "";
        var timestamp = Math.round(Date.now() / 1000);
        var message = "";
        var servicemedia_link = rootHost + "/webxr/" + req.body.short_id;
        // var wgl_link = "https://servicemedia.net/webxr/" + req.body.short_id;
        var mob_link = "http://strr.us/?scene=" + req.body.short_id;
        if (req.body.sceneShareWithMessage === "" || req.body.sceneShareWithMessage == null) {
            message = " has invited you to join them in the metaverse!";
        } else {
            message = " has shared this Postcard from the Metaverse with you including the message: " +
                "<hr><br> " + req.body.sceneShareWithMessage +  "<br>"
        }
        var urlHalf = "";

        if (validator.isEmail(emailAddress.trim()) == true) {
            bcrypt.genSalt(3, function(err, salt) { //level3 easy, not a password itself
                bcrypt.hash(timestamp.toString(), salt, null, function(err, hash) {
                    // reset = hash;
                var cleanhash = validator.blacklist(hash, ['/','.','$']); //make it URL safe
                var htmlbody = req.session.user.userName + message + "</h3><hr><br>" +
                    "<br> Scene Title: " + req.body.sceneTitle +
                    "<br> Scene Key: " + req.body.short_id +
                    "<br> Scene Type: " + req.body.sceneType +
                    "<br> Scene Description: " + req.body.sceneDescription +
                    "<br><br> <img src=" + urlHalf + "> " +
                    "<br> <a href= " + servicemedia_link + "> Click here for more postcards and content from this scene. </a> <br>If you already have the " + topName + " iOS app, you may load the scene directly with the <a href= " + mob_link + ">Mobile App Link</a>" +
                    "<br><br>Click here authenticate your access (link expires in 1 hour): </br>" +
                    req.headers.host + "/invitation_check/" + cleanhash+
        //            "r><br> <a href= " + mob_link + "> Mobile App link </a> " +
                    "<br>You may also enter the scene title or keycode on the " + topName + " app landing page" +

                    "<br> For more scenes like this, or to get the latest app, visit <a href='https://servicemedia.net'>ServiceMedia.net!</a> ";
                // console.log("htmlbody is " + htmlbody);
                                        
                // Create sendEmail params 
                var params = {
                    Destination: { /* required */
                    CcAddresses: [],
                    ToAddresses: to,
                    },
                    Message: { /* required */
                    Body: { /* required */
                        Html: {
                        Charset: "UTF-8",
                        Data: htmlbody
                        },
                        Text: {
                        Charset: "UTF-8",
                        Data: htmlbody
                        }
                    },
                    Subject: {
                        Charset: 'UTF-8',
                        Data: subject
                    }
                    },
                    Source: from, /* required */
                    ReplyToAddresses: [from],
                };
                // Create the promise and SES service object
                var sendPromise = new aws.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

                // Handle promise's fulfilled/rejected states
                sendPromise.then(
                    function(data) {
                            console.log("sent to " + data.MessageId);
                            callbackz();
                        }).catch(
                            function(err) {
                            console.error(err, err.stack);
                            callbackz("error sending to email address " + emailAddress + " " + err);
                        });
                    });
                }); //bcrypt end
            } else {
                callbackz("invalid email address " + emailAddress);
                // res.send();s
            }
        
        }, function(error) {
        
            if (error) {
                console.log('A file failed to process');
            
                res.send("there was an error! " + error);
            } else {
                console.log('All files have been processed successfully');
                res.send("sent!");

            }
        });
});


app.post('/share_scene/', function (req, res) { //yep! //make it public?

    //temp container for objex with peopleID + email
    console.log("tryna share scnee with prootocl " + req.protocol);
    let requestProtocol = 'https';
    if (req.headers.host.includes("localhost")) {
        requestProtocol = 'http';
    }
    let theScene = {};
    let ts = Date.now();
    var emailsFinal = [];
    var emailSplit = [];
    var emailsNotSent = [];
    let thePerson = {};
    let emailActionID = "";
    var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

    async.waterfall([

        function(callback) {
            db.actions.findOne({"actionType": "Send Email"}, function (err, emailAction) {
                if (err) {
                    callback("error getting email action!" + err);
                } else if (!emailAction) {
                    db.actions.insertOne({"actionType": "Send Email", "actionName": "Send Email"}, function(err, saved) {
                        if (err || !saved) {
                            callback("saving email action error");
                        } else {
                            emailActionID = saved._id;
                            callback(null);
                        }
                        

                    });
                } else {
                    emailActionID = emailAction._id; //for better search, make sure to save with mongoID
                    callback(null);
                }
            });

        },
        function(callback) {
        console.log("share node: " + req.body._id + " mail: " + req.body.sceneShareWithPeople);

            var emails = req.body.sceneShareWithPeople != undefined ? req.body.sceneShareWithPeople : req.body.email; //the latter if it's from the public invitation form
            if (emails.includes(",")) {
                emailSplit = emails.split(",");
            } else {
                emailSplit.push(emails); //if there's only one
            }
            // emailSplit.forEach(element => {
            //     if (!validator.isEmail) {
            //         res.end("bad bmail!");
            //         callback(err);
            //     }
            // });
            // emailSplit = emailSplit.filter(val => {
            //     return validator.isEmail;
            // });

            for (var m = 0; m < emailSplit.length; m++) {
                let mMail = emailSplit[m].toString();
                console.log("maybeMail: " + mMail);
                mMail = mMail.trim();
                if (validator.isEmail(mMail) == false){
                    console.log(mMail + " is a bad email!");
                    res.end("an email address was invalid!");
                    //
                    callback(true); //err = true means bail if any bad emails!
                    return;
                } else {
                    console.log(mMail + " is a good email!");
                }
            }
            var emailSplit2 = emailSplit.filter(val => {
                return validator.isEmail;
            });
            console.log("emailSplit is " + JSON.stringify(emailSplit2));
            callback(null, emailSplit2);
        },

        function(emailSplit, callback){ //build temp array of objex with email + peopleID

            var uid = ip;
            if (req.session.user != undefined) {
                uid = ObjectID(req.session.user._id.toString());
            }
            console.log("tryna mail to " +uid);
            async.each (emailSplit, function (email, callbackz) {

                // db.people.findOne({ $and: [ {userID: uid}, {email: email.trim()} ]}, function(err, person) {
                db.people.findOne({email: email.toString().trim()}, function(err, person) {
                    if (err || !person) {
                        
                        console.log("did not find that person : " + err);
                        var person = {};
                        if (req.session.user) {
                            person.userID = req.session.user._id.toString();
                        }
                        person.dateCreated = ts;
                        person.email = email.toString().trim();
                        // person.activities = [];
                        let action = {};
                        action.wasSentEmail = ts + "_" + uid + "_" + req.body.short_id;
                        // person.activities = [];
                        // person.activities.push(action);
                        person.accountStatus = 'Not Verified';
                        person.contactStatus = 'Not Indicated';
                        console.log("fixing to save new person " + JSON.stringify(person));
                        db.people.save(person, function (err, saved) {
                        if ( err || !saved ) {
                            console.log('person not saved..');
                            res.end();
                            callbackz();
                            } else {
                                thePerson = saved;
                                var person_id = saved._id.toString();
                                var pursoner = {};
                                console.log('new person created, id: ' + person_id);
                                pursoner.personID = person_id;
                                pursoner.email = email.toString().trim();
                                emailsFinal.push(pursoner);
                                db.users.updateOne( { "_id": ObjectID(uid) }, { $addToSet: {people : person._id}});
                                callbackz();
                                }
                            });
                    } else {
                        //TODO update emailCount field? or 'touches'?
                        if (person.activities == undefined) {
                            person.activities = [];
                        }
                        thePerson = person;
                        let action = {};
                        if (person.accountStatus != undefined && (person.accountStatus.toString().toLowerCase().includes("blacklist") || person.accountStatus.toString().toLowerCase().includes ("banned"))) {
                            console.log("opt out global for " + email);
                            action.actionID = emailActionID;
                            action.actionName = "Not Sent - Blacklist"
                            action.actionType = "Send Email"
                            action.actionResult = "Not Sent - Blacklist";
                            action.timestamp = ts;
                            action.userID = uid
                        
                            action.targetPersonID = person._id;
                            action.emailAddressTo = person.email;
                            action.fromScene = req.body.short_id;
                            action.data = req.body.sceneShareWithMessage;
                            
                            db.activities.insertOne(action);
                            // action.sendEmailBlockedBlacklist = ts + "_" + uid+ "_" + req.body.short_id;
                            // person.activities.push(action);

                            // db.people.update( { "_id": person._id }, { $set: {
                            //     lastUpdate : ts,
                            //     activities : person.activities
                            // }});
                            emailsNotSent.push(person.email);
                            // db.users.updateOne( { "_id": ObjectID(uid) }, { $addToSet: {people : person._id}});

                            //TODO respond with message
                            callbackz();
                        } else if (person.accountStatus != undefined && (person.activities != undefined && person.activities.length > 3) && person.accountStatus.toString().toLowerCase().includes("not verified")) {
                            // action.sendEmailUnverified = ts + "_" + uid + "_" + req.body.short_id;
                            // person.activities.push(action);

                            // db.people.update( { "_id": person._id }, { $set: {
                            //     lastUpdate : ts,
                            //     activities : person.activities
                            // }});
                            // db.users.updateOne( { "_id": ObjectID(uid) }, { $addToSet: {people : person._id}});
                            action.actionID = emailActionID;
                            action.actionName = "Not Sent - Not Verified"
                            action.actionType = "Send Email"
                            action.actionResult = "Not Sent - Not Verified";
                            action.timestamp = ts;
                            action.userID = uid
                        
                            action.targetID = person._id;
                            action.emailAddressTo = person.email;
                            action.fromScene = req.body.short_id;
                            action.data = req.body.sceneShareWithMessage;
                            
                            db.activities.insertOne(action);
                            emailsNotSent.push(person.email);
                            callbackz();


                        } else if (person.contactStatus != undefined && person.contactStatus.toString().toLowerCase().includes("opt out global")) {
                            console.log("opt out global for " + email);
                            // action.sendEmailBlockedOptOutGlobal = ts + "_" + uid+ "_" + req.body.short_id;
                            // person.activities.push(action);

                            // db.people.update( { "_id": person._id }, { $set: {
                            //     lastUpdate : ts,
                            //     activities : person.activities
                            // }});
                            // db.users.updateOne( { "_id": ObjectID(uid) }, { $addToSet: {people : person._id}});
                            action.actionID = emailActionID;
                            action.actionName = "Not Sent - Opt Out"
                            action.actionType = "Send Email"
                            action.actionResult = "Not Sent - Global Opt Out";
                            action.timestamp = ts;
                            action.userID = uid
                        
                            action.targetID = person._id;
                            action.emailAddressTo = person.email;
                            action.fromScene = req.body.short_id;
                            action.data = req.body.sceneShareWithMessage;
                            
                            db.activities.insertOne(action);
                            emailsNotSent.push(person.email);
                            callbackz(); //do not add to emailsFinal!
                        } else {    
                            // action.wasSentEmail = ts + "_" + uid+ "_" + req.body.short_id;
                            // person.activities.push(action);

                            // db.people.update( { "_id": person._id }, { $set: {
                            //     lastUpdate : ts,
                            //     activities : person.activities
                            // }});
                            action.actionID = emailActionID;
                            action.actionName = "Sent Email"
                            action.actionType = "Send Email"
                            action.actionResult = "Sent Email";
                            action.timestamp = ts;
                            action.userID = uid
                        
                            action.targetID = person._id;
                            action.emailAddressTo = person.email;
                            action.fromScene = req.body.short_id;
                            action.data = req.body.sceneShareWithMessage;
                            
                            db.activities.insertOne(action);
                            var pursoner = {};
                            console.log('found person id: ' + person._id);
                            pursoner.personID = person._id;
                            pursoner.email = email.toString().trim();
                            emailsFinal.push(pursoner);
                            if (req.session.user) {
                                db.users.updateOne( { "_id": uid }, { $addToSet: {people : person._id}});
                            }
                            callbackz();
                        }
                        
                    }
                    //callback won't wait on this, but whatever...
                    if (req.session.user) {
                        db.users.findOne({"_id": ObjectID(uid)}, function (err, user) {
                            if (err ||!user) {
                                console.log("HEYWTF! caint find user " +req.session.user._id + " ...call the police!");
                            } else {
                                db.users.updateOne( { "_id": ObjectID(uid) }, { $addToSet: {people : person._id}}); //addToSet should add array if not present, but prevent dupes (!?)
                                
                                console.log("tryna add a person " + person._id + " to user" + req.session.user._id); //TODO add sentMailTo activity to user action inventory
        
                            }
                        });
                    }
                    });
                

            }, function(err) {
               
                if (err) {
                    console.log('A file failed to process');
                    callback(null, emailsFinal);

                } else {
                    // console.log('All files have been processed successfully');
                    console.log("emailsFinal is " + JSON.stringify(emailsFinal));
                    callback(null, emailsFinal);
                }
            });

        },
        // function (eData, callback) {
        //     callback(null, eData);
        // },
        function (eData, callback) {
            if (eData.length > 0) {
            // let emailArray = eData;
            db.scenes.findOne({short_id: req.body.short_id}, function (err, scene) {
                if (err || !scene) {
                    console.log("error getting scene for sharing: " + err);
                    callback(err);
                } else {
                    theScene = scene;
                    let urlHalf = "";
                    if (scene.sceneShareWithGroups != undefined && scene.sceneShareWithGroups != null) {
                        if (scene.sceneShareWithGroups.toString().toLowerCase().includes("disallow all")) {
                            callback("nope - invitations disallowed");
                            let action = {};
                            console.log("invitations not allowed for this scene " + req.body.short_id);
                            action.actionID = emailActionID;
                            action.actionName = "Not Sent - Scene Disallowed";
                            action.actionType = "Send Email";
                            action.actionResult = "Not Sent - Scene Disallowed";
                            action.timestamp = ts;
                            if (req.session.user) {
                                action.userID = ObjectID(req.session.user._id);
                            }
                            action.targetPersonID = thePerson._id;
                            action.emailAddressTo = thePerson.email;
                            action.fromScene = req.body.short_id;
                            // action.data = req.body.sceneShareWithMessage;
                            
                            db.activities.insertOne(action);
                            res.send("invitations disallowed for this scene");
                           
                        } else {
                            if (scene.scenePostcards != null && scene.scenePostcards.length > 0) {
                                var oo_id = ObjectID(scene.scenePostcards[0]); //TODO randomize? or ensure latest?  or use assigned default?
                                db.image_items.findOne({"_id": oo_id}, function (err, picture_item) {
                                    if (err || !picture_item || picture_item.length == 0) {
                                        console.log("error getting postcard for availablescenes: 2" + err);
                                        callback(null, '', eData)
                                    } else {
                                        var item_string_filename = JSON.stringify(picture_item.filename);
                                        item_string_filename = item_string_filename.replace(/\"/g, "");
                                        var item_string_filename_ext = getExtension(item_string_filename);
                                        var expiration = new Date();
                                        expiration.setMinutes(expiration.getMinutes() + 30);
                                        var baseName = path.basename(item_string_filename, (item_string_filename_ext));
        //                                    console.log(baseName);
                                        // var thumbName = 'thumb.' + baseName + item_string_filename_ext;
                                        var halfName = 'half.' + baseName + item_string_filename_ext;
                                        // var quarterName = 'quarter.' + baseName + item_string_filename_ext;
                                        // var standardName = 'standard.' + baseName + item_string_filename_ext;
                                        var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + halfName, Expires: 60000}); //just send back thumbnail urls for list
                                        // var urlQuarter = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + quarterName, Expires: 6000}); //just send back thumbnail urls for list
                                        callback(null, urlHalf, eData, scene);
                                    }
                                });
                            } else {
                                callback(null, '', eData, scene);
                        }
                    }
                }
            }
            });
        } else {
            callback("no valid email!");
            res.send("did not send to invalid address(es): " + emailsNotSent.toString() );
        }
        },
        function(urlHalf, eData, sceneData, callback) {
            // console.log("scene locations " +JSON.stringify(sceneData.sceneLocations));
            let geoLinks = "";
            let eventData = {};
            for (let i = 0; i < sceneData.sceneLocations.length; i++) {
                if (sceneData.sceneLocations[i].type.toLowerCase() == "geographic") { //TODO what if multiple?  this will get last one in array, maybe?
                    geoLinks += "<strong><a href='http://maps.google.com?q=" + sceneData.sceneLocations[i].latitude + "," + sceneData.sceneLocations[i].longitude + "'>Map to location: "+sceneData.sceneLocations[i].name+"</a></strong><br><br>"+
                    "<a target=\x22_blank\x22 href=\x22http://maps.google.com?q=" + sceneData.sceneLocations[i].latitude + "," + sceneData.sceneLocations[i].longitude + "\x22>" +
                        "<img class=\x22img-thumbnail\x22 style=\x22width: 300px;\x22 src=\x22https://maps.googleapis.com/maps/api/staticmap?center=" + sceneData.sceneLocations[i].latitude +
                        "," + sceneData.sceneLocations[i].longitude + "&zoom=15&size=600x400&maptype=roadmap&key=AIzaSyCBlNNHgDBmv-vusmuvG3ylf0XjGoMkkCo&markers=color:blue%7Clabel:%7C" + sceneData.sceneLocations[i].latitude + "," + sceneData.sceneLocations[i].longitude + "\x22>" + 
                        "</a>";
                    if (sceneData.sceneLocations[i].eventData != undefined && sceneData.sceneLocations[i].eventData.toLowerCase().includes('restrict')) {
                        eventData.restrictToLocation = true;
                    }
                }
            }
            callback(null, urlHalf, eData, sceneData, geoLinks, eventData);
        },

        function(urlHalf, eData, sceneData, geoLinks, eventData, callback) { //pull out  event data
            console.log("scene locations " +JSON.stringify(sceneData.sceneTags));

            if ((sceneData.sceneEventStart != undefined && sceneData.sceneEventStart != null) || (sceneData.sceneEventEnd != undefined && sceneEventEnd != null)) {
                    eventData.eventStart = sceneData.sceneEventStart;
                    eventData.eventEnd = sceneData.sceneEventEnd;
            
                    if (sceneData.sceneTags != undefined && sceneData.sceneTags != null && sceneData.sceneTags.length > 0 && sceneData.sceneTags.toString().toLowerCase().includes("restrict to event")) {
                        eventData.restrictToEvent = true;
                    } else {
                        eventData.restrictToEvent = false;
                    }
                }
            callback(null, urlHalf, eData, geoLinks, eventData);
        },

        function(urlHalf, eData, geoLinks, eventData, callback) { //spin through validated data, send appropriate mail
            console.log("eDatahs : " +JSON.stringify(eData));
            // let trimmedMails = [" a ", "b", " c", "d "].map(function(e){return e.trim();}); erp
            async.each (eData, function (data, callbackzz) {
                // console.log("email data is " + data);
          
                var subject = "Invitation : " + theScene.sceneTitle;
                var from = adminEmail;
               
                var to = [data.email];
               
                var bcc = [];
                
                var timestamp = Math.round(Date.now() / 1000);
                var message = "";
                var restrictToEventMessage = eventData.restrictToEvent ? "<br>Access is restricted to the event time" : "";
                var restrictToLocationMessage = eventData.restrictToLocation ? "<br>Access is restricted to the event location<br>" : "";
                var isNotPublicMessage = "";
                var app_link = "servicemedia://scene?" + req.body.short_id;
                // if (req.body.isPublic) {
                //     message = "An invitation to this private Immersive Scene was requested for you!";
                // } else {
                //     if (req.body.sceneShareWithMessage === "" || req.body.sceneShareWithMessage == null) {
                //         message = " has shared an Immersive Scene with you!";
                //     } else {
                //         message = " has shared an Immersive Scene with this message: " +
                //             "<hr><br><strong> " + req.body.sceneShareWithMessage +  "</strong><br>";
                //     }
                // }
                // message += restrictToEventMessage + restrictToLocationMessage;
                // if (req.body.sceneEventStart != undefined && req.body.sceneEventStart != null && req.body.sceneEventStart != "" ) {
                //     let datetimeString = new Date(req.body.sceneEventStart);
                //     message += "<br><strong>Event start: " + datetimeString.toLocaleString([], { hour12: true}) + "</strong><br>";
                //     // message += "<br><strong>Event start: " + datetimeString.toString() + "</strong><br>";
                //     console.log(message);
                // }
                // if (req.body.sceneEventEnd != undefined && req.body.sceneEventEnd != null && req.body.sceneEventEnd != "") {
                //     let datetimeString = new Date(req.body.sceneEventEnd);
                //     message += "<strong>Event end: " + datetimeString.toLocaleString([], { hour12: true})  + "</strong><br>";
                // }
                // message += geoLinks;
                            // if (theScene.sceneShareWithPublic) {

                            //     var htmlbody = req.session.user.userName + message + "</h3><hr>" +
                                   
                            //         "<button style='font-family: Arial, Helvetica, sans-serif;  font-size: 18px; background-color: blue; color: white; border-radius: 8px; margin: 10px; padding: 10px;'>"+
                            //         "<a href='"+ requestProtocol + "://" + req.headers.host + "/webxr/" + req.body.short_id+"'?pn=" + thePerson._id + " target='_blank'>" +
                            //         "Click here to access this scene!</a></button><br>" +
                            //         "<br> <a href='"+ requestProtocol + "://" + req.headers.host + "/webxr/" + req.body.short_id+"'?pn=" + thePerson._id + "target='_blank'><img src=" + urlHalf + "></a> " +
                            //         "<br> Scene Title: " + req.body.sceneTitle +
                            //         "<br> Scene Short ID: " + req.body.short_id +
                            //         "<br> Scene Keynote: " + theScene.sceneKeynote +
                            //         "<br> Scene Description: " + theScene.sceneDescription +
                            //         "<br> Owner: " + theScene.userName +
                            //         "<br><br><strong><a href='"+ requestProtocol + "://" + req.headers.host + "/qrcode/" + req.body.short_id + "'>Click here to scan QR Code for this scene</a></strong>" +
                            //         "<br> For more scenes like this, or to get the latest app, visit <a href='https://servicemedia.net'>ServiceMedia.net!</a> ";
                            //     ses.sendEmail( {
                            //             Source: from,
                            //             Destination: { ToAddresses: to, BccAddresses: bcc},
                            //             Message: {
                            //                 Subject: {
                            //                     Data: subject
                            //                 },
                            //                 Body: {
                            //                     Html: {
                            //                         Data: htmlbody
                            //                     }
                            //                 }
                            //             }
                            //         }
                            //         , function(err, data) {
                            //             if(err) throw err
                            //             console.log('Email sent:');
                            //             console.log(data);
                            //         });
                            //     callbackzz();
                            // } else {
                    //TODO check user's auth?
                    // if (timestamp < user.resetTimestamp + 3600) { //expires in 1 hour!
                    // let sentByUserID = 
                    // if (req.session.user) {

                    // } else {
                    //     sentByUserID: req.session.user._id.toString(),
                    //     sentByUserEmail: adminEmail,
                    // }
                    bcrypt.genSalt(3, function(err, salt) { //level3 easy, not a password itself
                        bcrypt.hash(timestamp.toString(), salt, null, function(err, hash) {
                            // reset = hash;
                            var cleanhash = validator.blacklist(hash, ['/','.','$']); //make it URL safe
                            var invitation = {
                                validated: false,
                                // invitedToSceneShareWithPublic:
                                invitedToSceneTitle: theScene.sceneTitle,
                                invitedToSceneID: theScene._id,
                                invitedToSceneShortID: theScene.short_id,
                                accessTimeWindow: timestamp + 86400, //one day //will deprecate...
                                sceneEventStart : theScene.sceneEventStart,
                                sceneEventEnd: theScene.sceneEventEnd,
                                sceneAccessLinkExpire: theScene.sceneAccessLinkExpire,
                                sceneRestrictToEvent: eventData.restrictToEvent,
                                sceneRestrictToLocation: eventData.restrictToLocation,
                                sentByUserName: req.session.user ? req.session.user.userName.toString() : ip,
                                sentByUserID: req.session.user ? req.session.user._id.toString() : "",
                                sentByUserEmail: req.session.user ? req.session.user.email.toString() : adminEmail,
                                sentToEmail: to,
                                targetPersonID: data.personID,
                                invitationHash: cleanhash,
                                invitationTimestamp: timestamp,
                            }

                            db.invitations.save(invitation, function (err, saved) {
                                if ( err || !saved ) {
                                    console.log('problem saving invitaiton');
                                } else {
                                    // var item_id = saved._id.toString();
                                    console.log('new invitiation id: ' + saved._id.toString());
                                }
                            });
                            if (req.body.publicRequest) {
                                    message = "An invitation to this private Immersive Scene was requested for you!";
                                } else {
                                    if (theScene.sceneShareWithMessage === "" || theScene.sceneShareWithMessage == null || theScene.sceneShareWithMessage.length < 2) {
                                        message = req.session.user.userName + " has shared an Immersive Scene!";
                                        // "<h3>Scene Invitation from " + from + "</h3><hr><br>"
                                    } else {
                                        message = req.session.user.userName + " has shared an Immersive Scene with this message: "+
                                            "<hr><strong>" + req.body.sceneShareWithMessage +  "</strong><br><hr>";
                                    }
                            }
                            message += restrictToEventMessage + restrictToLocationMessage;
                            if (theScene.sceneEventStart != undefined && theScene.sceneEventStart != null && theScene.sceneEventStart != "") {
                                let datetimeString = new Date(theScene.sceneEventStart);
                                message += "<br><strong>Event start: " + datetimeString.toLocaleString([], { hour12: true}) + "</strong><br>";
                                // message += "<br><strong>Event start: " + datetimeString.toString() + "</strong><br>";
                                console.log(message);
                            }
                            if (theScene.sceneEventEnd != undefined && theScene.sceneEventEnd != null && theScene.sceneEventEnd != "") {
                                let datetimeString = new Date(theScene.sceneEventEnd);
                                message += "<strong>Event end: " + datetimeString.toLocaleString([], { hour12: true})  + "</strong><br>";
                            }
                            if (!theScene.sceneShareWithPublic) { 
                                isNotPublicMessage = "<br><strong>This is a private scene, intended only for subscribers or invited guests.</strong><br>";
                            }
                            message += geoLinks;
                            var htmlbody = message +

                                isNotPublicMessage +
                                "<br><a href='"+ requestProtocol + "://" + req.headers.host + "/landing/invite.html?iv=" + cleanhash + "' target='_blank'>" +
                                "<button style='font-family: Arial, Helvetica, sans-serif;  font-size: 18px; background-color: blue; color: white; border-radius: 8px; margin: 10px; padding: 10px;'>" +
                                "Click here to access this scene!</a></button><br>" +
                                "<br> <img src=" + urlHalf + "> " +
                                "<br> Scene Title: " + theScene.sceneTitle +
                                "<br> Short ID: " + theScene.short_id +
                                "<br> Keynote: " + theScene.sceneKeynote +
                                "<br> Description: " + theScene.sceneDescription +
                                "<br> Owner: " + theScene.userName +
                                "<br> For more info, or to become a subscriber, visit <a href='https://servicemedia.net'>ServiceMedia.net!</a><br><br> "+
                                "<br> To stop messages like this, <a href='"+ requestProtocol + "://" + req.headers.host + "/landing/opt_out.html?iv=" + cleanhash + "' target='_blank'>click here</a><br><br> ";

                        ses.sendEmail( {
                                Source: from,
                                Destination: { ToAddresses: to, BccAddresses: bcc},
                                Message: {
                                    Subject: {
                                        Data: subject
                                    },
                                    Body: {
                                        Html: {
                                            Data: htmlbody
                                        }
                                    }
                                }
                            }
                            , function(err, data) {
                                if(err) throw err
                                console.log('Email sent:');
                                console.log(data);
                                
                            });
                        });
                    });
                    callbackzz();
                // }

            }, function(err) {
               
                if (err) {
                    console.log('A file failed to process');
                    res.send(err);
                } else {
                    console.log('All files have been processed successfully');
                    res.send("Invitations sent: " + JSON.stringify(emailsFinal));
                }
            });
            callback(null);
        }],

    function(err, result) { // #last function, close async
            console.log("waterfall done: " + result);
        }
    );
});
/*
 app.get('/salt/:auth_id', function (req, res) {
 console.log("tryna salt...")
 var u_id = ObjectID(req.params.auth_id);
 db.users.findOne({"_id": u_id}, function (err, user) {
 if (err || !user) {
 console.log("error getting user: " + err);
 } else {
 bcrypt.genSalt(10, function(err, salt) {
 bcrypt.hash("buster", salt, function(err, hash) {
 console.log("passhash " + hash);
 db.users.update({"_id": u_id}, { $set: {password: hash }});
 // Store hash in your password DB.
 });
 });

 //bcrypt.compare
 //  console.log("user profile for " + req.params.auth_id);
 //  res.json(user);
 }
 });
 });

 app.get('/hash/:pw', function (req, res) {
 console.log("tryna salt...")
 var u_id = ObjectID(req.params.auth_id);
 db.users.findOne({"_id": u_id}, function (err, user) {
 if (err || !user) {
 console.log("error getting user: " + err);
 } else {
 bcrypt.genSalt(10, function(err, salt) {
 bcrypt.hash(user.password, salt, function(err, hash) {
 console.log("passhash " + hash);
 //db.users.update({"_id": u_id}, { $set: {password: hash }});
 // Store hash in your password DB.
 });
 });

 //  console.log("user profile for " + req.params.auth_id);
 //  res.json(user);
 }
 });
 });
 */
app.post('/newuser', checkAppID, function (req, res) {
//        $scope.user.domain = "servicmedia";
//        $scope.user.appid = "55b2ecf840edea7583000001";

    var appid = req.headers.appid;
    var domain = req.body.domain;
    console.log('newUser request from: ' + req.body.userName);
    // ws.send("authorized");
    if (req.body.userPass.length < 7) {  //weak
        console.log("bad password");
        res.send("badpassword");

    } else if (validator.isEmail(req.body.userEmail) == false) {  //check for valid email

        console.log("bad email");
        res.send("bad email");

    } else {

        db.users.findOne({userName: req.body.userName}, function(err, existingUserName) { //check if the username already exists
            if (err || !existingUserName) {  //should combine these queries into an "$or" //but then couldn't respond separately
                db.users.findOne({email: req.body.userEmail}, function(err, existingUserEmail) { //check if the email already exists
                    if (err || !existingUserEmail || req.body.userEmail == domainAdminEmail) {
                        console.log('dinna find tha name');
                        var from = adminEmail; //TODO CHANGe!!!!
                        var timestamp = Math.round(Date.now() / 1000);
                        var ip = req.headers['x-forwarded-for'] ||
                            req.connection.remoteAddress ||
                            req.socket.remoteAddress ||
                            req.connection.socket.remoteAddress;
                        bcrypt.genSalt(10, function(err, salt) {
                            bcrypt.hash(req.body.userPass, salt, null, function(err, hash) {
                                var cleanhash = validator.blacklist(hash, ['/','.','$']); //make it URL safe
                                db.users.save(
                                    {type : 'baseuser',
                                        status : 'unvalidated',
                                        authLevel : 'base',
                                        userName : req.body.userName,
                                        email : req.body.userEmail,
                                        createDate : timestamp,
                                        validationHash : cleanhash,
                                        createIP : ip,
                                        odomain : req.body.domain, //original domain
                                        oappid : req.headers.appid.toString().replace(":", ""), //original app id
                                        password : hash
                                    },
                                    function (err, newUser){
                                        if ( err || !newUser ){
                                            console.log("db error, new user not saved", err);
                                            res.send("error");
                                        } else  {
                                            console.log("new user saved to db");
                                            var user_id = newUser._id.toString();
                                            console.log("userID: " + user_id);
                                            req.session.auth = user_id;
                                            req.session.user = newUser;
                                            res.cookie('_id', user_id, { maxAge: 900000, httpOnly: false});
                                            res.send("validation email sent");
                                            //send validation email

                                            htmlbody = "Welcome, " + req.body.userName + "! <a href=\"" + rootHost + "/validate/" + cleanhash + "\"> Click here to validate your new account</a>"
                                            ses.sendEmail({
                                                    Source: from,
                                                    Destination: { ToAddresses: [req.body.userEmail, adminEmail] },
                                                    Message: {
                                                        Subject: {
                                                            Data: topName + ' New User' //TODO Get app name somehow
                                                        },
                                                        Body: {
                                                            Html: {
                                                                Data: htmlbody
                                                            }
                                                        }
                                                    }
                                                }
                                            , function(err, data) {
                                                if(err) throw err
                                                console.log('Email sent:');
                                                console.log(data);
                                                //res.redirect("http://elnoise.com/#/login");
                                            });
                                        }
                                    });
                            });
                        });
                    } else {
                        console.log("that email already exists or something went wrong");
                        res.send("emailtaken");
                    }
                });
            } else {
                console.log("that name is already taken or something went wrong");
                res.send("nametaken");
            }
        });
    }
});


app.get('/webplayer', function(req,res) {
    res.sendfile(__dirname + '/servicmedia.net/webplayer.html');
    console.log(req.session.auth);
});
/*
 app.get('/addtypecodesall', function(req, req) {

 db.audio_items.find({}, function (err, audio_items) {

 if (err || !audio_items) {
 console.log("error getting audio items: " + err);
 } else {

 async.waterfall([
 function(callback){ //randomize the returned array, takes a shake so async it...
 console.log("get all mongoIDs...");
 for (var i = 0; i < audio_items.length; i++) {
 tempID = "";
 tempID = audio_items[i]._id;
 console.log(tempID);
 db.audio_items.update( { _id: tempID }, { $set: { item_type: "audio" }});
 }
 callback(null);
 },
 function(callback){
 console.log("second step...");
 callback(null);
 }
 ],

 function(err, result) {
 console.log("done");
 }

 );
 }
 });
 });

 */
/*
 app.get('/addstatuscodesall', function(req, req) {

 db.audio_items.find({}, function (err, audio_items) {

 if (err || !audio_items) {
 console.log("error getting audio items: " + err);
 } else {

 async.waterfall([
 function(callback){ //randomize the returned array, takes a shake so async it...
 console.log("get all mongoIDs...");
 for (var i = 0; i < audio_items.length; i++) {
 tempID = "";
 tempID = audio_items[i]._id;
 console.log(tempID);
 db.audio_items.update( { _id: tempID }, { $set: { userID: "5150540ab038969c24000008", username: "polytropoi" }});
 }
 callback(null);
 },
 function(callback){
 console.log("second step...");
 callback(null);
 }
 ],

 function(err, result) {
 console.log("done");
 }

 );
 }
 });
 });
 */
/*
 DISABLED FOR SECURITY
 app.get('/addshortcodesall', function (req, res) {

 db.audio_items.find({}, function (err, audio_items) {

 if (err || !audio_items) {
 console.log("error getting audio items: " + err);
 } else {

 async.waterfall([
 function(callback){ //randomize the returned array, takes a shake so async it...
 console.log("get all mongoIDs...");
 for (var i = 0; i < audio_items.length; i++) {
 tempID = "";
 newShortID = "";
 tempID = audio_items[i]._id;
 newShortID = shortId(tempID);
 console.log(tempID + " = " + newShortID);
 db.audio_items.update( { _id: tempID }, { $set: { short_id: newShortID }});
 }
 callback(null);
 },
 function(callback){
 console.log("second step...");
 callback(null);
 }
 ],

 function(err, result) {
 console.log("done");
 }

 );
 }
 });
 });


 //});


 app.get('removeaudio', function (req, res) {
 db.audio_items.
 }

 app.get('/addtagarraysall', function (req, res) {

 db.audio_items.find({}, function (err, audio_items) {

 if (err || !audio_items) {
 console.log("error getting audio items: " + err);
 } else {

 async.waterfall([
 function(callback){ //randomize the returned array, takes a shake so async it...
 console.log("get all mongoIDs...");
 for (var i = 0; i < audio_items.length; i++) {
 var tempID = "";

 tempID = audio_items[i]._id;
 // newShortID = shortId(tempID);
 console.log("updating " + tempID);
 db.audio_items.update( { _id: tempID }, { $set: { tags: ['music', 'korkus'] }});
 }
 callback(null);
 },
 function(callback){
 console.log("second step...");
 callback(null);
 }
 ],

 function(err, result) {
 console.log("done");
 }

 );
 }
 });
 });
 */
app.get('backupdata', function (req, res) {


});


//db.audio_items.find({userID: req.params.u_id}).sort({otimestamp: -1}).limit(maxItems).toArray( function(err, audio_items) {


app.get('/newaudiodata.json', checkAppID, requiredAuthentication,  function(req, res) {
    console.log('tryna return newaudiodata.json');
    db.audio_items.find({item_status: "public"}).sort({otimestamp: 1}).toArray( function(err,audio_items) {
        if (err || !audio_items) {
            console.log("error getting audio items: " + err);
        } else {

            async.waterfall([

                    function(callback){ //randomize the returned array, takes a shake so async it...

                        audio_items.splice(0,audio_items.length - maxItems); //truncate randomized array, take only last 20
                        audio_items.reverse();
                        callback(null);
                    },
                    function(callback) { //add the signed URLs to the obj array
                        for (var i = 0; i < audio_items.length; i++) {

                            var item_string_filename = JSON.stringify(audio_items[i].filename);
                            item_string_filename = item_string_filename.replace(/\"/g, "");
                            var item_string_filename_ext = getExtension(item_string_filename);
                            var expiration = new Date();
                            expiration.setMinutes(expiration.getMinutes() + 1000);
                            var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                            console.log(baseName);
                            var mp3Name = baseName + '.mp3';
                            var oggName = baseName + '.ogg';
                            var pngName = baseName + '.png';
                            // var urlMp3 = knoxClient.signedUrl(audio_items[i]._id + "." + mp3Name, expiration);
                            // var urlOgg = knoxClient.signedUrl(audio_items[i]._id + "." + oggName, expiration);
                            // var urlPng = knoxClient.signedUrl(audio_items[i]._id + "." + pngName, expiration);
                            var urlMp3 = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_items[i].userID + "/" + audio_items[i]._id + "." + mp3Name, Expires: 60000});
                            var urlOgg = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_items[i].userID + "/" + audio_items[i]._id + "." + oggName, Expires: 60000});
                            var urlPng = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_items[i].userID + "/" + audio_items[i]._id + "." + pngName, Expires: 60000});
                            audio_items[i].URLmp3 = urlMp3; //jack in teh signed urls into the object array
                            audio_items[i].URLogg = urlOgg;
                            audio_items[i].URLpng = urlPng;

                            //audio_items[i].URLmp3 = urlMp3; //jack in teh signed urls into the object array
                            //audio_items[i].URLogg = urlOgg;
                            //audio_items[i].URLpng = urlPng;

                        }
                        console.log('tryna send ' + audio_items.length + 'audio_items ');
                        callback(null);
                    }],

                function(err, result) { // #last function, close async
                    res.json(audio_items);
                    console.log("waterfall done: " + result);
                }
            );
        }
    });

});

app.get('/randomaudiodata.json', checkAppID, requiredAuthentication, function(req, res) {
    console.log('tryna return randomaudiodata.json');
    db.audio_items.find({item_status: "public"}, function(err,audio_items) {
        if (err || !audio_items) {
            console.log("error getting audio items: " + err);
        } else {

            async.waterfall([

                    function(callback){ //randomize the returned array, takes a shake so async it...
                        audio_items = Shuffle(audio_items);
                        audio_items.splice(0,audio_items.length - maxItems); //truncate randomized array, take only last 20
                        callback(null);
                    },

                    function(callback) { //add the signed URLs to the obj array
                        for (var i = 0; i < audio_items.length; i++) {

                            var item_string_filename = JSON.stringify(audio_items[i].filename);
                            item_string_filename = item_string_filename.replace(/\"/g, "");
                            var item_string_filename_ext = getExtension(item_string_filename);
                            var expiration = new Date();
                            expiration.setMinutes(expiration.getMinutes() + 1000);
                            var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                            console.log(baseName);
                            var mp3Name = baseName + '.mp3';
                            var oggName = baseName + '.ogg';
                            var pngName = baseName + '.png';
                            //var urlMp3 = knoxClient.signedUrl(audio_items[i]._id + "." + mp3Name, expiration);
                            //var urlOgg = knoxClient.signedUrl(audio_items[i]._id + "." + oggName, expiration);
                            //var urlPng = knoxClient.signedUrl(audio_items[i]._id + "." + pngName, expiration);
                            var urlMp3 = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_items[i].userID + "/" + audio_items[i]._id + "." + mp3Name, Expires: 60000});
                            var urlOgg = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_items[i].userID + "/" + audio_items[i]._id + "." + oggName, Expires: 60000});
                            var urlPng = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_items[i].userID + "/" + audio_items[i]._id + "." + pngName, Expires: 60000});
                            audio_items[i].URLmp3 = urlMp3; //jack in teh signed urls into the object array
                            audio_items[i].URLogg = urlOgg;
                            audio_items[i].URLpng = urlPng;

                        }
                        console.log('tryna send ' + audio_items.length + 'audio_items ');
                        callback(null);
                    }],

                function(err, result) { // #last function, close async
                    res.json(audio_items);
                    console.log("waterfall done: " + result);
                }
            );
        }
    });

});

app.get('/playlist/:tag', function(req, res) {
    console.log('tryna return playlist: ' + req.params.tag);
    db.audio_items.find({tags: req.params.tag, item_status: "public"}).sort({otimestamp: -1}).limit(maxItems).toArray( function(err, audio_items) {
        if (err || !audio_items) {
            console.log("error getting audio items: " + err);

        } else {

            async.waterfall([

                    function(callback){ //randomize the returned array, takes a shake so async it...
                        //audio_items = Shuffle(audio_items);
                        //audio_items.splice(0,audio_items.length - maxItems); //truncate randomized array, take only last 20
                        callback(null);
                    },

                    function(callback) { //add the signed URLs to the obj array
                        for (var i = 0; i < audio_items.length; i++) {

                            var item_string_filename = JSON.stringify(audio_items[i].filename);
                            item_string_filename = item_string_filename.replace(/\"/g, "");
                            var item_string_filename_ext = getExtension(item_string_filename);
                            var expiration = new Date();
                            expiration.setMinutes(expiration.getMinutes() + 1000);
                            var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                            console.log(baseName);
                            var mp3Name = baseName + '.mp3';
                            var oggName = baseName + '.ogg';
                            var pngName = baseName + '.png';
                            var urlMp3 = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_items[0].userID + "/" + audio_items[0]._id + "." + mp3Name, Expires: 60000});
                            var urlOgg = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_items[0].userID + "/" + audio_items[0]._id + "." + oggName, Expires: 60000});
                            var urlPng = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_items[0].userID + "/" + audio_items[0]._id + "." + pngName, Expires: 60000});
                            audio_items[i].URLmp3 = urlMp3; //jack in teh signed urls into the object array
                            audio_items[i].URLogg = urlOgg;
                            audio_items[i].URLpng = urlPng;

                        }
                        console.log('tryna send ' + audio_items.length + 'audio_items ');
                        callback(null);
                    }],

                function(err, result) { // #last function, close async
                    res.json(audio_items);
                    console.log("waterfall done: " + result);
                }
            );
        }
    });

});

app.get('/audiofiles/:tag', function(req, res) {
    console.log('tryna return playlist: ' + req.params.tag);
    db.audio.find({tags: req.params.tag, item_status: "public"}).sort({otimestamp: -1}).limit(maxItems).toArray( function(err, audio_items) {
        if (err || !audio_items) {
            console.log("error getting audio items: " + err);

        } else {

            async.waterfall([

                    function(callback){ //randomize the returned array, takes a shake so async it...
                        //audio_items = Shuffle(audio_items);
                        //audio_items.splice(0,audio_items.length - maxItems); //truncate randomized array, take only last 20
                        callback(null);
                    },

                    function(callback) { //add the signed URLs to the obj array
                        for (var i = 0; i < audio_items.length; i++) {

                            var item_string_filename = JSON.stringify(audio_items[i].filename);
                            item_string_filename = item_string_filename.replace(/\"/g, "");
                            var item_string_filename_ext = getExtension(item_string_filename);
                            var expiration = new Date();
                            expiration.setMinutes(expiration.getMinutes() + 1000);
                            var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                            console.log(baseName);
                            var mp3Name = baseName + '.mp3';
                            var oggName = baseName + '.ogg';
                            var pngName = baseName + '.png';
                            var urlMp3 = knoxClient.signedUrl(audio_items[i]._id + "." + mp3Name, expiration);
                            var urlOgg = knoxClient.signedUrl(audio_items[i]._id + "." + oggName, expiration);
                            var urlPng = knoxClient.signedUrl(audio_items[i]._id + "." + pngName, expiration);
                            audio_items[i].URLmp3 = urlMp3; //jack in teh signed urls into the object array
                            audio_items[i].URLogg = urlOgg;
                            audio_items[i].URLpng = urlPng;

                        }
                        console.log('tryna send ' + audio_items.length + 'audio_items ');
                        callback(null);
                    }],

                function(err, result) { // #last function, close async
                    res.json(audio_items);
                    console.log("waterfall done: " + result);
                }
            );
        }
    });

});

app.get('/audiolist/:tag', function(req, res) {
    console.log('tryna return playlist: ' + req.params.tag);
    db.audio_items.find({tags: req.params.tag, item_status: "public"}).sort({otimestamp: -1}).limit(maxItems).toArray( function(err, audio_items) {
        if (err || !audio_items) {
            console.log("error getting audio items: " + err);

        } else {

            res.json(audio_items);
            console.log("returning audio_items tagged " + req.params.tag);
        }
    });

});


app.post('/picarray/', checkAppID, requiredAuthentication, function(req,res) {

    console.log("picarray request: " + req.body);
    res.json(req.body);

});

// app.get('/userpics/:u_id', checkAppID, requiredAuthentication, function(req, res) {
app.get('/userpics/:u_id', requiredAuthentication, function (req, res) {
    console.log('tryna return userpics for: ' + req.params.u_id);
    let query = {userID: req.params.u_id};
    if (!req.session.user.authLevel.toLowerCase().includes("domain")) {
        query = {};
    }
    // db.image_items.find(query).sort({otimestamp: -1}).limit(maxItems).toArray( function(err, picture_items) {
    db.image_items.find({userID: req.params.u_id}).sort({otimestamp: -1}).limit(maxItems).toArray(function(err, picture_items) {

        if (err || !picture_items) {
            console.log("error getting picture items: " + err);
        } else {
            console.log("userpics for " + req.params.u_id);
            (async () => { 
            for (var i = 0; i < picture_items.length; i++) {
                // console.log("pic userID: "+ picture_items[i].userID);
                var item_string_filename = JSON.stringify(picture_items[i].filename);
                item_string_filename = item_string_filename.replace(/\"/g, "");
                var item_string_filename_ext = getExtension(item_string_filename);
                var expiration = new Date();
                expiration.setMinutes(expiration.getMinutes() + 30);
                var baseName = path.basename(item_string_filename, (item_string_filename_ext));
//                        console.log(baseName + "xxxxxxx");
                var thumbName = 'thumb.' + baseName + item_string_filename_ext;
                // var halfName = 'half.' + baseName + item_string_filename_ext;
                // var standardName = 'standard.' + baseName + item_string_filename_ext;
    
                var urlThumb = await ReturnPresignedUrl(process.env.S3_ROOT_BUCKET_NAME, "users/" + picture_items[i].userID + "/pictures/" + picture_items[i]._id + "." + thumbName, 6000); 
                picture_items[i].URLthumb = urlThumb;
                // console.log(urlThumb);

                // var urlThumb = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_items[i].userID + "/pictures/" + picture_items[i]._id + "." + thumbName, Expires: 6000}); //just send back thumbnail urls for list
                //var urlPng = knoxClient.signedUrl(audio_item[0]._id + "." + pngName, expiration);
                //jack in teh signed urls into the object array
                //console.log("picture item: " + urlThumb, picture_items[0]);
                }
                res.json(picture_items);
                console.log("returning picture_items for " + req.params.u_id);
            })();
        }
    });
});

app.get('/uservids/:u_id', requiredAuthentication, function(req, res) {
    console.log('tryna return uservids for: ' + req.params.u_id);
    db.video_items.find({userID: req.params.u_id}).sort({otimestamp: -1}).limit(maxItems).toArray( function(err, video_items) {

        if (err || !video_items) {
            console.log("error getting video items: " + err);

        } else {
            console.log("# " + video_items.length);
            for (var i = 0; i < video_items.length; i++) {

                var item_string_filename = JSON.stringify(video_items[i].filename);
                item_string_filename = item_string_filename.replace(/\"/g, "");
                var item_string_filename_ext = getExtension(item_string_filename);
                var expiration = new Date();
                expiration.setMinutes(expiration.getMinutes() + 30);
                var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                //                        console.log(baseName + "xxxxxxx");
//                    var thumbName = 'thumb.' + baseName + item_string_filename_ext;
                var halfName = 'half.' + baseName + item_string_filename_ext;
                var standardName = 'standard.' + baseName + item_string_filename_ext;

                //var pngName = baseName + '.png';

                var vidUrl = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + video_items[i].userID + "/video/" + video_items[i]._id + "/" + video_items[i]._id + "." + video_items[i].filename, Expires: 6000}); //just send back thumbnail urls for list
                //var urlPng = knoxClient.signedUrl(audio_item[0]._id + "." + pngName, expiration);
                video_items[i].URLvid = vidUrl; //jack in teh signed urls into the object array
                //console.log("picture item: " + urlThumb, picture_items[0]);

            }

            res.json(video_items);
            console.log("returning video_items for " + req.params.u_id);
        }
    });
});
app.post('/return_audiogroups/', function(req, res) {
    console.log('tryna return audiogroups: ' + JSON.stringify(req.body));
    let response = req.body;
    let groupItems = [];
    let audio_IDs = [];
    async.waterfall([

        function(callback){ 
            if (req.body.triggerGroups != null && req.body.triggerGroups.length > 0) {
                const group_ids = req.body.triggerGroups.map(item => { return ObjectID(item); });
                db.groups.find({_id: {$in: group_ids}}, function(err, group_items) {
                    if (err || !group_items) {
                        console.log("error getting audiogroup items: " + err);
                        callback(err);
                    } else {
                        // res.json(group_items);
                        // console.log("returning audiogroup " + JSON.stringify(group_items.groupdata));
                        let groupdata = group_items[0].groupdata;
                        groupItems.push.apply(groupItems, groupdata); //concat arrays
                        response.triggerGroupItems = group_items;
                        
                        callback(null);
                    }
                });
            } else {
                callback(null);
            }
        },
        function(callback){ 
            if (req.body.ambientGroups != null && req.body.ambientGroups.length > 0) {
                const group_ids = req.body.ambientGroups.map(item => { return ObjectID(item); });
                db.groups.find({_id: {$in: group_ids}}, function(err, group_items) {
                    if (err || !group_items) {
                        console.log("error getting audiogroup items: " + err);
                        callback(err);
                    } else {
                        // res.json(group_items);
                        // console.log("returning audiogroup " + JSON.stringify(group_items.groupdata));
                        response.ambientGroupItems = group_items;
                        let groupdata = group_items[0].groupdata;
                        groupItems.push.apply(groupItems, groupdata); //concat arrays
                        callback(null);
                    }
                });
            } else {
                callback(null);
            }
        },
        function(callback){ 
            if (req.body.primaryGroups != null && req.body.primaryGroups.length > 0) {
                const group_ids = req.body.primaryGroups.map(item => { return ObjectID(item); });
                db.groups.find({_id: {$in: group_ids}}, function(err, group_items) {
                    if (err || !group_items) {
                        console.log("error getting audiogroup items: " + err);
                        callback(err);
                    } else {
                        // res.json(group_items);
                        // console.log("returning audiogroup " + JSON.stringify(group_items));
                        response.primaryGroupItems = group_items;
                        let groupdata = group_items[0].groupdata;
                        groupItems.push.apply(groupItems, groupdata); //concat arrays
                        callback(null);
                    }
                });
            } else {
                callback(null);
            }
        },
        function (callback) {
            // console.log("auido groupitems: " +JSON.stringify(groupItems));
            if (groupItems.length > 0) {
                async.each (groupItems, function (item, callbackz) { //takes a shake so async, and respond when it's done
                    audio_IDs.push(item.itemID);
                    // console.log("item: " + JSON.stringify(item));
                    callbackz();
                }, function(err) {
                    if (err) {
                        res.send("error! " + err);
                    } else {
                        callback(null);
                    }
                });
            } else {
                callback("no group items");
            }
        },
        function (callback) {
            // console.log("audio IDs: " + audio_IDs);
            const audio_ids = audio_IDs.map(item => { return ObjectID(item); });
            db.audio_items.find({'_id': { $in: audio_ids}}).toArray(function (err, audio_items) {
                if (err || !audio_items) {
                    console.log("error getting audio items: " + err);
                    callback(err);
                } else {
                    
                    callback(null, audio_items);
                }
            });
        },
        function (audio_items, callback) {
            // console.log("audio_group_itemss: "+ JSON.stringify(audio_items));
            // callback(null);
            if (audio_items.length > 0) {
                let audioItems = [];
                async.each (audio_items, function (item, callbackz) { //takes a shake so async, and respond when it's done
                    // audio_IDs.push(item.itemID);
                    // let audioItem = {};
                    // audioItem.title = item.title;
                    // audioItem.file

                    (async () => {
                        var item_string_filename = JSON.stringify(item.filename);
                        item_string_filename = item_string_filename.replace(/\"/g, "");
                        var item_string_filename_ext = getExtension(item_string_filename);
                        var expiration = new Date();
                        expiration.setMinutes(expiration.getMinutes() + 30);
                        var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                        // console.log("tryna jack in " + baseName + " to a group of " + group.type);
                        var mp3Name = baseName + '.mp3';
                        var oggName = baseName + '.ogg';
                        var pngName = baseName + '.png';

                        // var urlMp3 = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + item.userID + "/audio/" + item._id + "." + mp3Name, Expires: 60000});
                        // var urlOgg = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + item.userID + "/audio/" + item._id + "." + oggName, Expires: 60000});
                        // var urlPng = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + item.userID + "/audio/" + item._id + "." + pngName, Expires: 60000});
                        var urlMp3 = await ReturnPresignedUrl(process.env.S3_ROOT_BUCKET_NAME, "users/" + item.userID + "/audio/" + item._id + "." + mp3Name, 10000);
                        var urlOgg = await ReturnPresignedUrl(process.env.S3_ROOT_BUCKET_NAME, "users/" + item.userID + "/audio/" + item._id + "." + oggName, 10000);
                        var urlPng = await ReturnPresignedUrl(process.env.S3_ROOT_BUCKET_NAME, "users/" + item.userID + "/audio/" + item._id + "." + pngName, 10000);


                        item.URLmp3 = urlMp3; //jack in teh signed urls into the object array
                        item.URLogg = urlOgg;
                        item.URLpng = urlPng;
                        audioItems.push(item);
                        callbackz();
                    })();


                }, function(err) {
                    if (err) {
                        res.send("error! " + err);
                    } else {
                        // console.log("audio items: " + JSON.stringify(audioItems));
                        response.audioItems = audioItems;
                        callback(null);
                    }
                });
            } else {
                callback("no audio items");
                
            }
        }
        

        // function(callback) { //add the signed URLs to the obj array

        //     if (groupItems.length > 0) {
               
        //         async.each (groupItems, function (item, callbackz) { //takes a shake so async, and respond when it's done
        //             let audioItem = item.
        //             callbackz();
        //         }, function(err) {
        //             if (err) {
        //                 // console.log('hls mangler failed to process');
        //                 res.send("error! " + err);
        //             } else {

        //                 callback();
        //             }
        //         });

                // for (var i = 0; i < response.primaryGroupItems.groupData.length; i++) {
                //     var item_string_filename = JSON.stringify(audio_items[i].filename);
                //     console.log("item_string_filename: " + item_string_filename);
                //     // var item_string_filename = JSON.stringify(audio_items[i].filename);
                //     // item_string_filename = item_string_filename.replace(/\"/g, "");
                //     // var item_string_filename_ext = getExtension(item_string_filename);
                //     // var expiration = new Date();
                //     // expiration.setMinutes(expiration.getMinutes() + 1000);
                //     // var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                //     // console.log(baseName);
                //     // var mp3Name = baseName + '.mp3';
                //     // var oggName = baseName + '.ogg';
                //     // var pngName = baseName + '.png';
                //     // var urlMp3 = knoxClient.signedUrl(audio_items[i]._id + "." + mp3Name, expiration);
                //     // var urlOgg = knoxClient.signedUrl(audio_items[i]._id + "." + oggName, expiration);
                //     // var urlPng = knoxClient.signedUrl(audio_items[i]._id + "." + pngName, expiration);
                //     // audio_items[i].URLmp3 = urlMp3; //jack in teh signed urls into the object array
                //     // audio_items[i].URLogg = urlOgg;
                //     // audio_items[i].URLpng = urlPng;

                // }
                // console.log('tryna send ' + audio_items.length + 'audio_items ');
                // callback(null);
            // }
        // },
//         function (callback) {
//             db.audio_items.find({'_id': { $in: group.items}}).toArray(function (err, audio_items) {
//                 if (err || !audio_items) {
//                     console.log("error getting audio items: " + err);
//                 } else {
//                     var currentIndex = 0;
//                     for (var i = 0; i < audio_items.length; i++) {
//                         if (group.groupdata) {
//                             var obj = group.groupdata.filter(function (obj) { //get index value from groupdata array
//                                 return obj.itemID === audio_items[i]._id.toString();
//                             })[0];
//                             if (obj != undefined && obj.itemIndex) {
//                                 audio_items[i].itemIndex = obj.itemIndex;
//                             } else {
//                                 audio_items[i].itemIndex = i;
//                             }
//                         }
//                         if (audio_items[i].clipDuration = {}) {
//                             audio_items[i].clipDuration = "";
//                         }
//                         var item_string_filename = JSON.stringify(audio_items[i].filename);
//                         item_string_filename = item_string_filename.replace(/\"/g, "");
//                         var item_string_filename_ext = getExtension(item_string_filename);
//                         var expiration = new Date();
//                         expiration.setMinutes(expiration.getMinutes() + 30);
//                         var baseName = path.basename(item_string_filename, (item_string_filename_ext));
//                         console.log("tryna jack in " + baseName + " to a group of " + group.type);
//                         var mp3Name = baseName + '.mp3';
//                         var oggName = baseName + '.ogg';
//                         var pngName = baseName + '.png';
//                         var urlMp3 = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + mp3Name, Expires: 60000});
//                         var urlOgg = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + oggName, Expires: 60000});
//                         var urlPng = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + pngName, Expires: 60000});

//                         audio_items[i].URLmp3 = urlMp3; //jack in teh signed urls into the object array
//                         audio_items[i].URLogg = urlOgg;
//                         audio_items[i].URLpng = urlPng;
//                         currentIndex++;
//                     }
//                     audio_items.sort(function(a, b) {
//                         return a.itemIndex - b.itemIndex;
//                     });
//                 }
// //                            audio_items.sort(function(a, b) {
// //                                return a.itemIndex - b.itemIndex;
// //                            });
//                 group.audio_items = audio_items;
//                 res.json(group);
//                 console.log("returning group_item : " + group);
//             });
//         }
    ],

    function(err, result) { // #last function, close async
        res.json(response);
        console.log("audio_groups waterfall done: " + result);
    }
);

});

app.get('/usergroups/:u_id', requiredAuthentication, function(req, res) {
    console.log('tryna return usergroups for: ' + req.params.u_id);
    db.groups.find({userID: req.params.u_id}).sort({otimestamp: -1}).toArray( function(err, group_items) {
        if (err || !group_items) {
            console.log("error getting usergroups items: " + err);
        } else {
            res.json(group_items);
            console.log("returning usergroups for " + req.params.u_id);
        }
    });
});
app.post('/add_group_item/', requiredAuthentication, function (req, res) { //dunno why I rem'd the groupdata update...?
    console.log(JSON.stringify(req.body));
    var o_id = ObjectID(req.body.group_id);   
    // console.log('groupID requested : ' + req.body.sourceID);
    db.groups.findOne({ "_id" : o_id}, function(err, group) {
        if (err || !group) {
            console.log("error getting group: " + err);
        } else {  //TODO check for proper type?
            if (group.groupdata == undefined || group.groupdata == null) {
                group.groupdata = [];
            }
            if (group.items == undefined || group.items == null) {
                group.items = [];
            }
            newGroupData = group.groupdata;
            newItems = group.items;
            newItems.push(req.body.item_id);
            var timestamp = Math.round(Date.now() / 1000);
            newGroupItem = {}; //why was this rem'd?
            newGroupItem.itemID = req.body.item_id; // ""?s
            newGroupItem.itemIndex = newGroupData.length; // ""?
            newGroupData.push(newGroupItem); // ""?
            db.groups.update( { "_id": o_id }, { $set: {
                        groupdata : newGroupData, // ""?
                        lastUpdateTimestamp: timestamp,
                        items: newItems
                    }
                }, function (err, rezponse) {
                    if (err || !rezponse) {
                        console.log("error updateing group: " + err);
                        res.send(err);
                    } else {
                    console.log("group updated: " + req.body.group_id);
                    res.send("group updated");
                }
            });
        }
    });
});
app.post('/remove_group_item/', requiredAuthentication, function (req, res) {
    console.log(JSON.stringify(req.body));
    var o_id = ObjectID(req.body.group_id);   
    // console.log('groupID requested : ' + req.body.sourceID);
    db.groups.findOne({ "_id" : o_id}, function(err, group) {
        if (err || !group) {
            console.log("error getting group: " + err);
        } else {
            var timestamp = Math.round(Date.now() / 1000);
            newGroupData = [];
            newItems = [];
            console.log("tryna update group" + JSON.stringify(group));
            async.waterfall([
                function(callback){ 
                    if (group.groupdata) {
                        let index = 0;
                        group.groupdata.forEach(function(content) {
                        console.log("groupdata " + content);
                        if (content.itemID == req.body.item_id) {
                            console.log("excluding on " + req.body.item_id);
                        } else {
                            index++;
                            content.itemIndex = index;
                            newGroupData.push(content);
                        }
                    });
                    callback(null);
                    } else {
                        callback(null);
                    }
                },
                function(callback){ 
                        group.items.forEach(function(content) {
                        console.log("item " + content);
                        if (content == req.body.item_id) {
                            console.log("matched onn " + req.body.item_id);
                        } else {
                            newItems.push(content);
                        }
                    });
                    callback(null);
                }
            ],
            function(err, result) { // #last function, close async
                console.log(JSON.stringify("group:" + newGroupData + " itme: " + newItems));
                db.groups.update( { "_id": o_id }, { $set: {
                    lastUpdateTimestamp: timestamp,
                    groupdata : newGroupData,
                    items: newItems
                    }
                }, function (err, rezponse){
                    if (err || !rezponse) {
                        console.log("error updateing group: " + err);
                        res.send(err);
                    } else {
                        console.log("group updated: " + req.body.group_id);
                        res.send("group updated");
                        }
                    });
                }
            );
        }
    });
});
app.post('/update_group/:_id', checkAppID, requiredAuthentication, function (req, res) {
    console.log(req.params._id);
    var o_id = ObjectID(req.params._id);   
    console.log('group requested : ' + req.body._id);
    db.groups.findOne({ "_id" : o_id}, function(err, group) {
        if (err || !group) {
            console.log("error getting group: " + err);
        } else {
            console.log("tryna update group" + req.body._id);
            var timestamp = Math.round(Date.now() / 1000);
            db.groups.update( { "_id": o_id }, { $set: {
                lastUpdateTimestamp: timestamp,
                groupdata : req.body.groupdata,
                items: req.body.items,
                tags: req.body.tags,
                title: req.body.title,
                name: req.body.name
            }});
        } if (err) {res.send(error)} else {res.send("updated " + new Date())}
    });
});
app.post('/updategroup/', requiredAuthentication, function (req, res) {
    // console.log(req.body._id);
    var o_id = ObjectID(req.body._id);   
    console.log('group requested : ' + req.body._id);
    db.groups.findOne({ "_id" : o_id}, function(err, group) {
        if (err || !group) {
            console.log("error getting group: " + err);

        } else {
            console.log("tryna update grup " + req.body._id);
            let grupdata = group.groupdata;
            var timestamp = Math.round(Date.now() / 1000);
            if (req.body.groupdata != null) {
                grupdata = req.body.groupdata;
            }
            if (grupdata == null) {
                grupdata = [];
                
                for (let i = 0; i < group.items.length; i++) {
                    let gditem = {};
                    gditem.itemID = group.items[i];
                    gditem.itemIndex = i.toString();
                    console.log("tryna fix index " + JSON.stringify(gditem));
                    grupdata.push(gditem);
                }
                // group.groupdata = gd;
                console.log("tryna update with no group data and fix " + JSON.stringify(grupdata));
            }

            db.groups.update( { "_id": o_id }, { $set: {
                lastUpdateTimestamp: timestamp,
                tags: req.body.tags,
                name: req.body.name,
                groupdata: grupdata
            }});
        } if (err) {res.send(error)} else {res.send("updated " + new Date())}
    });
});

// app.get('/mod_group_pics/:group_id', requiredAuthentication, function(req, res) { //quick hack
    
//     let groupID = ObjectID(req.params.group_id);
//     // let orientation = req.body.orientation;

//     db.groups.findOne({"_id": groupID}, function(err, group) {
//         if (err || !group) {
//             console.log("error getting group item: " + err);
//         } else {
//             const image_ids = group.items.map(item => {
//                 return ObjectID(item);
//             });
//             db.image_items.find({_id: {$in: image_ids }}, function (err, pic_items) {
//                 if (err || !pic_items) {
//                     console.log("didn't fine no pic_itemsz at all!");
//                     res.send(err);
//                 } else {
//                     for (let i = 0; i < pic_items.length; i++) {
//                         let pid = ObjectID(pic_items[i]._id);
//                         db.image_items.update({_id: pid}, {$set: {orientation: "Equirectangular"}}, function (err, saved) {
//                             if (err || !saved) {
//                                 console.log(err + "error updating pic " + pic_items[i]._id);
//                             } else {
//                                 console.log("updated pic " + pic_items[i]._id);
//                             }
//                         });
                        
//                     }
//                 }
//             });        

//         }
//     }); 
// });


app.get('/usergroup/:p_id', requiredAuthentication, function(req, res) {

    console.log('tryna return user group : ' + req.params.p_id);
    var pID = req.params.p_id;
    var o_id = ObjectID(pID);

    db.groups.findOne({"_id": o_id}, function(err, group) {
        if (err || !group) {
            console.log("error getting group item: " + err);
        } else {
            if (group.items != null) {
                group.items = group.items.map(function (id) {
                    return ObjectID(id);
                });
                if (group.lastUpdate != null) {
                    group.lastUpdateTimestamp = group.lastUpdate;
                }
                if (group.type.toLowerCase() == "audio") {
                    console.log("tryna get some audio items: " + JSON.stringify(group.items));
                    db.audio_items.find({'_id': { $in: group.items}}).toArray(function (err, audio_items) {
                        if (err || !audio_items) {
                            console.log("error getting audio items: " + err);
                        } else {
                            var currentIndex = 0;
                            for (var i = 0; i < audio_items.length; i++) {
                                if (group.groupdata) {
                                    var obj = group.groupdata.filter(function (obj) { //get index value from groupdata array
                                        return obj.itemID === audio_items[i]._id.toString();
                                    })[0];
                                    if (obj != undefined && obj.itemIndex) {
                                        audio_items[i].itemIndex = obj.itemIndex;
                                    } else {
                                        audio_items[i].itemIndex = i;
                                    }
                                }
                                if (audio_items[i].clipDuration = {}) {
                                    audio_items[i].clipDuration = "";
                                }
                                var item_string_filename = JSON.stringify(audio_items[i].filename);
                                item_string_filename = item_string_filename.replace(/\"/g, "");
                                var item_string_filename_ext = getExtension(item_string_filename);
                                var expiration = new Date();
                                expiration.setMinutes(expiration.getMinutes() + 30);
                                var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                                console.log("tryna jack in " + baseName + " to a group of " + group.type);
                                var mp3Name = baseName + '.mp3';
                                var oggName = baseName + '.ogg';
                                var pngName = baseName + '.png';
                                var urlMp3 = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + mp3Name, Expires: 60000});
                                var urlOgg = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + oggName, Expires: 60000});
                                var urlPng = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + pngName, Expires: 60000});

                                audio_items[i].URLmp3 = urlMp3; //jack in teh signed urls into the object array
                                audio_items[i].URLogg = urlOgg;
                                audio_items[i].URLpng = urlPng;
                                currentIndex++;
                            }
                            audio_items.sort(function(a, b) {
                                return a.itemIndex - b.itemIndex;
                            });
                        }
//                            audio_items.sort(function(a, b) {
//                                return a.itemIndex - b.itemIndex;
//                            });
                        group.audio_items = audio_items;
                        res.json(group);
                        // console.log("returning group_item : " + JSON.stringify(group));
                    });
                } else if (group.type.toLowerCase() == "video") {
                    db.video_items.find({'_id': { $in: group.items}}).toArray(function (err, video_items) {
                        if (err || !video_items) {
                            console.log("error getting audio items: " + err);
                        } else {
                            for (var i = 0; i < video_items.length; i++) {
                                if (group.groupdata) {
                                    var obj = group.groupdata.filter(function (obj) { //get index value from groupdata array
                                        return obj.itemID === video_items[i]._id.toString();
                                    })[0];
                                    if (obj != undefined && obj.itemIndex) {
                                        video_items[i].itemIndex = obj.itemIndex;
                                        console.log(video_items[i].itemIndex + "index for " + video_items[i]._id.toString() );
                                    } else {
                                        video_items[i].itemIndex = i;
                                        console.log(video_items[i].itemIndex + "natchrul index for " + video_items[i]._id.toString() );
                                    }
                                }
                                var item_string_filename = JSON.stringify(video_items[i].filename);
                                item_string_filename = item_string_filename.replace(/\"/g, "");
                                var item_string_filename_ext = getExtension(item_string_filename);
                                var expiration = new Date();
                                expiration.setMinutes(expiration.getMinutes() + 30);
                                var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                                console.log("tryna jack in " + baseName + " to a group of " + group.type.toLowerCase());
                                var vidName = baseName + '.mp3';
                                var urlVid = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + video_items[i].userID + "/video/" + video_items[i]._id + "/" + video_items[i]._id + "." + video_items[i].filename, Expires: 60000});
                                video_items[i].vUrl = urlVid; //jack in teh signed urls into the object array

                            }
                            video_items.sort(function(a, b) {
                                return a.itemIndex - b.itemIndex;
                            });
                        }
//                            video_items.sort(function(a, b) {
//                                return a.itemIndex - b.itemIndex;
//                            });
                        group.video_items = video_items;
                        group.video_items.sort(function(a, b) {
                            return a.itemIndex - b.itemIndex;
                        });
                        res.json(group);
                        console.log("returning group_item : " + group);
                    });
                } else if (group.type.toLowerCase().includes("picture")) {
                    db.image_items.find({'_id': { $in: group.items}}).toArray(function (err, image_items) {
                        if (err || !image_items) {
                            console.log("error getting image items: " + err);
                        } else {
                            for (var i = 0; i < image_items.length; i++) {
                                if (group.groupdata) {
                                    var obj = group.groupdata.filter(function (obj) { //get index value from groupdata array
                                        return obj.itemID === image_items[i]._id.toString();
                                    })[0];
                                    if (obj != undefined && obj.itemIndex) {
                                        image_items[i].itemIndex = obj.itemIndex;
                                        console.log(image_items[i].itemIndex + "index for " + image_items[i]._id.toString() );
                                    } else {
                                        image_items[i].itemIndex = i;
                                        console.log(image_items[i].itemIndex + "natchrul index for " + image_items[i]._id.toString() );
                                    }
                                }
                                var item_string_filename = JSON.stringify(image_items[i].filename);
                                item_string_filename = item_string_filename.replace(/\"/g, "");
                                var item_string_filename_ext = getExtension(item_string_filename);
                                //var expiration = new Date();
                                //expiration.setMinutes(expiration.getMinutes() + 30);
                                var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                                console.log(baseName);
                                var thumbName = 'thumb.' + baseName + item_string_filename_ext;
                                var halfName = 'half.' + baseName + item_string_filename_ext;
                                var urlThumb = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + image_items[i].userID + "/pictures/" + image_items[i]._id + "." + thumbName, Expires: 6000});
                                var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + image_items[i].userID + "/pictures/" + image_items[i]._id + "." + halfName, Expires: 6000});
                                image_items[i].urlThumb = urlThumb; //jack in teh signed urls into the object array
                                image_items[i].urlHalf = urlHalf; //jack in teh signed urls into the object array

                            }
                            image_items.sort(function(a, b) {
                                return a.itemIndex - b.itemIndex;
                            });
                        }
//                            video_items.sort(function(a, b) {
//                                return a.itemIndex - b.itemIndex;
//                            });
                        group.image_items = image_items;
                        group.image_items.sort(function(a, b) {
                            return a.itemIndex - b.itemIndex;
                        });
                        res.json(group);
                        console.log("returning group_item : " + group);
                    });

            } else if (group.type.toLowerCase() == "location") {
                    console.log("tryna get locations");
                    db.locations.find({'_id': {$in: group.items}}).toArray(function (err, location_items) {
                        if (err || !location_items) {
                            console.log("error getting image items: " + err);
                        } else {
                            console.log("found locations : " + location_items.length);
                            for (var i = 0; i < location_items.length; i++) {
                                if (group.groupdata) {
                                    var obj = group.groupdata.filter(function (obj) { //get index value from groupdata array
                                        return obj.itemID === location_items[i]._id.toString();
                                    })[0];
                                    if (obj != undefined && obj.itemIndex) {
                                        location_items[i].itemIndex = obj.itemIndex;
                                        console.log(location_items[i].itemIndex + "index for " + location_items[i]._id.toString());
                                    } else {
                                        location_items[i].itemIndex = i;
                                        console.log(location_items[i].itemIndex + "natchrul index for " + location_items[i]._id.toString());
                                    }
                                }
                            }
                            location_items.sort(function (a, b) {
                                return a.itemIndex - b.itemIndex;
                            });
                        }
//                            video_items.sort(function(a, b) {
//                                return a.itemIndex - b.itemIndex;
//                            });
                        group.locations = location_items;
                        group.locations.sort(function (a, b) {
                            return a.itemIndex - b.itemIndex;
                        });
                        res.json(group);
                        console.log("returning group_item : " + group);
                    });
                } else if (group.type.toLowerCase() == "people") {
                    console.log("tryna get people");
                    db.people.find({'_id': {$in: group.items}}).toArray(function (err, people) {
                        if (err || !people) {
                            console.log("error getting text items: " + err);
                            res.send("error getting text items: " + err);
                        } else {
                            console.log("found locations : " + people.length);
                            for (var i = 0; i < people.length; i++) {
                                if (group.groupdata) {
                                    var obj = group.groupdata.filter(function (obj) { //get index value from groupdata array
                                        return obj.itemID === text_items[i]._id.toString();
                                    })[0];
                                    if (obj != undefined && obj.itemIndex) {
                                        people[i].itemIndex = obj.itemIndex;
                                        console.log(people[i].itemIndex + "index for " + text_items[i]._id.toString());
                                    } else {
                                        people[i].itemIndex = i;
                                        console.log(people[i].itemIndex + "natchrul index for " + people[i]._id.toString());
                                    }
                                }
                            }
                            people.sort(function (a, b) {
                                return a.itemIndex - b.itemIndex;
                            });
                        }
//                            video_items.sort(function(a, b) {
//                                return a.itemIndex - b.itemIndex;
//                            });
                        group.people = people;
                        group.people.sort(function (a, b) {
                            return a.itemIndex - b.itemIndex;
                        });
                        res.json(group);
                        console.log("returning group_item : " + group);
                    });
                } else if (group.type.toLowerCase() == "text") {
                    console.log("tryna get texts");
                    db.text_items.find({'_id': {$in: group.items}}).toArray(function (err, text_items) {
                        if (err || !text_items) {
                            console.log("error getting text items: " + err);
                            res.send("error getting text items: " + err);
                        } else {
                            console.log("found locations : " + text_items.length);
                            for (var i = 0; i < text_items.length; i++) {
                                if (group.groupdata) {
                                    var obj = group.groupdata.filter(function (obj) { //get index value from groupdata array
                                        return obj.itemID === text_items[i]._id.toString();
                                    })[0];
                                    if (obj != undefined && obj.itemIndex) {
                                        text_items[i].itemIndex = obj.itemIndex;
                                        console.log(text_items[i].itemIndex + "index for " + text_items[i]._id.toString());
                                    } else {
                                        text_items[i].itemIndex = i;
                                        console.log(text_items[i].itemIndex + "natchrul index for " + text_items[i]._id.toString());
                                    }
                                }
                            }
                            text_items.sort(function (a, b) {
                                return a.itemIndex - b.itemIndex;
                            });
                        }
//                            video_items.sort(function(a, b) {
//                                return a.itemIndex - b.itemIndex;
//                            });
                        group.text_items = text_items;
                        group.text_items.sort(function (a, b) {
                            return a.itemIndex - b.itemIndex;
                        });
                        res.json(group);
                        console.log("returning group_item : " + group);
                    });
                } else if (group.type.toLowerCase() == "scenes") {
                    // console.log("tryna get scenes");
                    let scenes = [];
                    db.scenes.find({'_id': {$in: group.items}}).toArray(function (err, scene_items) {
                        if (err || !scene_items) {
                            console.log("error getting scenes items: " + err);
                            res.send("error getting scenes items: " + err);
                        } else {
                            // console.log("found scenes : " + JSON.stringify(scene_item));
                            let index = 0;
                            async.each (scene_items, function (scene_item, callbackz) {
                                let scene = {};
                                scene._id = scene_item._id;
                                scene.sceneTitle = scene_item.sceneTitle;
                                scene.short_id = scene_item.short_id;
                                
                                if (scene_item.scenePostcards != undefined) {
                                    let scenePostcard = scene_item.scenePostcards[0];
                                    db.image_items.findOne({'_id': ObjectID(scenePostcard)}, function(err, pic) {
                                        if (err || !pic) {
                                            console.log("no postcard found for that id?!");
                                            if (group.groupdata) {
                                                var obj = group.groupdata.filter(function (obj) { //get index value from groupdata array
                                                    return obj.itemID === scene_item._id.toString();
                                                })[0];
                                                if (obj != undefined && obj.itemIndex) {
                                                    scene.itemIndex = obj.itemIndex;
                                                    console.log(scene_item.itemIndex + "index for " + scene._id.toString());
                                                } else {
                                                    scene.itemIndex = index;
                                                    console.log(scene.itemIndex + "natchrul index for " + scene._id.toString());
                                                }
                                            }
                                            index++;
                                            scenes.push(scene);
                                            callbackz();
                                        } else {
                                            var item_string_filename = pic.filename.replace(/\"/g, "");
                                            var item_string_filename_ext = getExtension(item_string_filename);
                                            //var expiration = new Date();
                                            //expiration.setMinutes(expiration.getMinutes() + 30);
                                            var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                                            var thumbName = 'thumb.' + baseName + item_string_filename_ext;
                                            var url1 = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + pic.userID + "/pictures/" + pic._id + "." + thumbName, Expires: 6000});
                                            // console.log("postcard url : " + url1);
                                            var halfName = 'thumb.' + baseName + item_string_filename_ext;
                                            var url2 = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + pic.userID + "/pictures/" + pic._id + "." + halfName, Expires: 6000});
                                            // if (scene_items[i])
                                            scene.urlThumb = url1;
                                            scene.urlHalf = url2;
                                            if (group.groupdata) {
                                                var obj = group.groupdata.filter(function (obj) { //get index value from groupdata array
                                                    return obj.itemID === scene_item._id.toString();
                                                })[0];
                                                if (obj != undefined && obj.itemIndex) {
                                                    scene.itemIndex = obj.itemIndex;
                                                    console.log(scene.itemIndex + "index for " + scene._id.toString());
                                                } else {
                                                    scene.itemIndex = index;
                                                    console.log(scene.itemIndex + "natchrul index for " + scene._id.toString());
                                                }
                                            }
                                            index++;
                                            scenes.push(scene);
                                            callbackz();
                                            // var urlThumb = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + image_items[i].userID + "/pictures/" + image_items[i]._id + "." + thumbName, Expires: 6000});
                                        }
                                    });
                                } else {
                                    if (group.groupdata) {
                                        var obj = group.groupdata.filter(function (obj) { //get index value from groupdata array
                                            return obj.itemID === scene_item._id.toString();
                                        })[0];
                                        if (obj != undefined && obj.itemIndex) {
                                            scene.itemIndex = obj.itemIndex;
                                            console.log(scene_item.itemIndex + "index for " + scene._id.toString());
                                        } else {
                                            scene.itemIndex = index;
                                            console.log(scene.itemIndex + "natchrul index for " + scene._id.toString());
                                        }
                                    }
                                    index++;
                                    scenes.push(scene);
                                    callbackz();
                                }

                                
  
                            }, function(err) {
                                if (err) {
                                    console.log('A file failed to process');
                                    // callbackz(err);
                                } else {
                                    // console.log('scenexs ' + JSON.stringify(scenes));
                                    scenes.sort(function (a, b) {
                                        return a.itemIndex - b.itemIndex;
                                    });
                                    group.scene_items = scenes;
                                    group.scene_items.sort(function (a, b) {
                                        return a.itemIndex - b.itemIndex;
                                    });
                                    res.json(group);
                                    // callback(null, scene_items);
                                }
                            });

                            // for (var i = 0; i < scene_items.length; i++) {
                            //     if (group.groupdata) {
                            //         var obj = group.groupdata.filter(function (obj) { //get index value from groupdata array
                            //             return obj.itemID === scene_items[i]._id.toString();
                            //         })[0];
                            //         if (obj != undefined && obj.itemIndex) {
                            //             scene_items[i].itemIndex = obj.itemIndex;
                            //             console.log(scene_items[i].itemIndex + "index for " + scene_items[i]._id.toString());
                            //         } else {
                            //             scene_items[i].itemIndex = i;
                            //             console.log(scene_items[i].itemIndex + "natchrul index for " + scene_items[i]._id.toString());
                            //         }
                            //     }
                            //     let scenePostcard = scene_items[i].scenePostcards[0];

                            //     console.log("scenePostcarnd " + scenePostcard);
                            //     if (scenePostcard != null && scenePostcard != undefined ) {
                            //         db.image_items.findOne({'_id': ObjectID(scenePostcard)}, function(err, pic) {
                            //             if (err || !pic) {
                            //                 console.log("no postcard found for that id?!");
                            //             } else {
                            //                 var item_string_filename = pic.filename.replace(/\"/g, "");
                            //                 var item_string_filename_ext = getExtension(item_string_filename);
                            //                 //var expiration = new Date();
                            //                 //expiration.setMinutes(expiration.getMinutes() + 30);
                            //                 var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                            //                 var thumbName = 'thumb.' + baseName + item_string_filename_ext;
                            //                 var url = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + pic.userID + "/pictures/" + pic._id + "." + thumbName, Expires: 6000});
                            //                 console.log("postcard url : " + url);
                            //                 if (scene_items[i])
                            //                 scene_items[i].urlThumb = url;
                            //                 // var urlThumb = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + image_items[i].userID + "/pictures/" + image_items[i]._id + "." + thumbName, Expires: 6000});
                            //             }
                            //         });
                            //     }
                            //     // scene_items.urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + image_items[i].userID + "/pictures/" + image_items[i]._id + "." + halfName, Expires: 6000});
                            // }

                        }
//                            video_items.sort(function(a, b) {
//                                return a.itemIndex - b.itemIndex;
//                            });
            // group.scene_items = scenes;
            // group.scene_items.sort(function (a, b) {
            //     return a.itemIndex - b.itemIndex;
            // });
            // res.json(group);
                        // console.log("returning group_item : " + JSON.stringify(group));
                    });    
                } else if (group.type.toLowerCase() == "object" || group.type.toLowerCase() == "objects") {
                    console.log("tryna get objex");
                    db.obj_items.find({'_id': {$in: group.items}}).toArray(function (err, obj_items) {
                        if (err || !obj_items) {
                            console.log("error getting text items: " + err);
                            res.send("error getting text items: " + err);
                        } else {
                            console.log("found locations : " + obj_items.length);
                            for (var i = 0; i < obj_items.length; i++) {
                                if (group.groupdata) {
                                    var obj = group.groupdata.filter(function (obj) { //get index value from groupdata array
                                        return obj.itemID === obj_items[i]._id.toString();
                                    })[0];
                                    if (obj != undefined && obj.itemIndex) {
                                        obj_items[i].itemIndex = obj.itemIndex;
                                        console.log(obj_items[i].itemIndex + "index for " + obj_items[i]._id.toString());
                                    } else {
                                        obj_items[i].itemIndex = i;
                                        console.log(obj_items[i].itemIndex + "natchrul index for " + obj_items[i]._id.toString());
                                    }
                                }
                            }
                            obj_items.sort(function (a, b) {
                                return a.itemIndex - b.itemIndex;
                            });
                        }
//                            video_items.sort(function(a, b) {
//                                return a.itemIndex - b.itemIndex;
//                            });
                        group.obj_items = obj_items;
                        group.obj_items.sort(function (a, b) {
                            return a.itemIndex - b.itemIndex;
                        });
                        res.json(group);
                        console.log("returning group_item : " + group);
                    });
                }
        } else {
                res.json(group);
            }
        }
    });
});

app.get('/useraudio/:u_id', requiredAuthentication, function(req, res) {
    console.log('tryna return useraudio for: ' + req.params.u_id);
    db.audio_items.find({userID: req.params.u_id}).sort({otimestamp: -1}).limit(maxItems).toArray( function(err, audio_items) {

        if (err || !audio_items) {
            console.log("error getting picture items: " + err);

        } else {
            console.log("# " + audio_items.length);

            (async () => {
            for (var i = 0; i < audio_items.length; i++) {
                var item_string_filename = JSON.stringify(audio_items[i].filename);
                item_string_filename = item_string_filename.replace(/\"/g, "");
                var item_string_filename_ext = getExtension(item_string_filename);
                var expiration = new Date();
                expiration.setMinutes(expiration.getMinutes() + 30);
                var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                //console.log(baseName);
                var mp3Name = baseName + '.mp3';
                var oggName = baseName + '.ogg';
                var pngName = baseName + '.png';

                var urlMp3 = await ReturnPresignedUrl(process.env.S3_ROOT_BUCKET_NAME, "users/" + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + mp3Name, 6000); 
                var urlOgg = await ReturnPresignedUrl(process.env.S3_ROOT_BUCKET_NAME, "users/" + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + oggName, 6000); 
                var urlPng = await ReturnPresignedUrl(process.env.S3_ROOT_BUCKET_NAME, "users/" + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + pngName, 6000); 

                // var urlMp3 = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + mp3Name, Expires: 60000});
                // var urlOgg = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + oggName, Expires: 60000});
                // var urlPng = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_items[i].userID + "/audio/" + audio_items[i]._id + "." + pngName, Expires: 60000});
                audio_items[i].URLmp3 = urlMp3; //jack in teh signed urls into the object array
                audio_items[i].URLogg = urlOgg;
                audio_items[i].URLpng = urlPng;
                }
                res.json(audio_items);
            })();
//                console.log("returning audio_items for " + req.params.u_id);
        }
    });
});

app.get('/userobjs/:u_id', checkAppID, requiredAuthentication, function(req, res) {
    console.log('tryna return userobjs for: ' + req.params.u_id);
    db.obj_items.find({userID: req.params.u_id}).sort({otimestamp: -1}).limit(maxItems).toArray( function(err, obj_items) {

        if (err || !obj_items) {
            console.log("error getting obj items: " + err);

        } else {
            console.log("# of userobjs " + obj_items.length);

            res.json(obj_items);
            console.log("returning obj_items for " + req.params.u_id);
        }
    });
});

app.get('/allobjs/:u_id', requiredAuthentication, domainadmin, function(req, res) { //TODO make one route,check auth status
    console.log('tryna return userobjs for: ' + req.params.u_id);
    // if (domainadmin()) {
    db.obj_items.find({}, function(err, obj_items) {

        if (err || !obj_items) {
            console.log("error getting obj items: " + err);

        } else {
            console.log("returning userobjs " + obj_items.length);

            res.json(obj_items);
            // console.log("returning obj_items for " + req.params.u_id);
        }
    });

});


app.get('/sceneobjs/:g_id', checkAppID, requiredAuthentication, function(req, res) {
    console.log('tryna return userobjs for: ' + req.params.u_id);
    db.obj_items.find({userID: req.params.u_id}).sort({otimestamp: -1}).limit(maxItems).toArray( function(err, obj_items) {

        if (err || !obj_items) {
            console.log("error getting obj items: " + err);

        } else {
            console.log("# of userobjs " + obj_items.length);

            res.json(obj_items);
            console.log("returning obj_items for " + req.params.u_id);
        }
    });
});

//admin method
//app.get('/sceneobjs_fixer', function(req, res) {
//    console.log('tryna return userobjs for: ' + req.params.u_id);
//    db.obj_items.find({ },  function(err, obj_items) {
//
//        if (err || !obj_items) {
//            console.log("error getting obj items: " + err);
//
//        } else {
//            console.log("# of userobjs " + obj_items.length);
//
////            res.json(obj_items);
//            for (var i = 0; i < obj_items.length; i++) {
//                console.log("returning obj_item :" + obj_items[i]._id);
////                var o_id = ObjectID(obj_items[i]._id);
//                db.obj_items.update( { "_id": obj_items[i]._id }, { $set: {
//
//                    snapToGround: "false",
//                    randomRotation: "false"
//                }});
//            }
//        }
//    });
//});
app.post('/newperson', checkAppID, requiredAuthentication, function (req, res) {

    var person = req.body;
    person.userID = req.session.user._id.toString();
    person.dateCreated = Date.now();
    person.accountStatus = 'Not Verified';
    person.contactStatus = 'Not Indicated';
    // if (!textitem.desc) {
    //     textitem.desc = textitem.textstring.substr(0,20) + "...";
    // }
    console.log("fixing to save new person " + JSON.stringify(person));
    db.people.save(person, function (err, saved) {
        if ( err || !saved ) {
            console.log('person not saved..');
            res.send("nilch");
        } else {
            var item_id = saved._id.toString();
            console.log('new person created, id: ' + item_id);
            res.send(item_id);
        }
    });
});

app.post('/delete_person/:_id', checkAppID, requiredAuthentication, function (req, res) {
    console.log("tryna delete person: " + req.params._id);
    var o_id = ObjectID(req.params._id);
    db.people.remove( { "_id" : o_id }, 1 );
    res.send("deleted");
});

app.post('/update_person', requiredAuthentication, function (req, res) {
//        var textitem = req.body;
    console.log("tryna update_person " + JSON.stringify(req.body));
    var o_id = ObjectID(req.body._id);
//        textitem.userID = req.session.user._id.toString();
    db.people.update( { "_id": o_id }, { $set: {
        accountStatus: req.body.accountStatus,
        contactStatus: req.body.contactStatus,
        // tags: req.body.tags,
        // fullname: req.body.fullname,
        // nickname: req.body.nickname,
        // email: req.body.email,
        lastUpdate : Date.now()
    }});
    res.send("updated " + Date.now());
});

app.get('/person_details/:p_id', requiredAuthentication, function(req, res) {
    var o_id = ObjectID(req.params.p_id);
    console.log('tryna return people for: ' + req.params.p_id);
    db.people.findOne({_id: o_id}, function(err, person) {
        if (err || !person) {
            console.log("error getting person : " + err);
        } else {
            res.json(person);
            console.log("returning people for " + req.params.p_id);
        }
    });
});

app.get('/people/:u_id', requiredAuthentication, function(req, res) { //this is people "created by" user
    console.log('tryna return people for: ' + req.params.u_id);
    db.people.find({userID: req.params.u_id}).sort({otimestamp: -1}).toArray( function(err, people) {
        if (err || !people) {
            console.log("error getting people : " + err);
        } else {
            res.json(people);
            console.log("returning people for " + req.params.u_id);
        }
    });
});

app.get('/allpeople/', requiredAuthentication, admin, function(req, res) {
    console.log('tryna return people for: ' + req.params.u_id);
    if (req.session.user.authLevel.toLowerCase().includes("domain")) {
    db.people.find({}).sort({otimestamp: -1}).toArray( function(err, people) {
        if (err || !people) {
            console.log("error getting people : " + err);
        } else {
            res.json(people);
            console.log("returning people for " + req.params.u_id);
        }
    });
    } else {
        res.send("no");
    }
});

app.get('/mypeople/:u_id', requiredAuthentication,  function(req, res) {
    console.log('tryna return people for: ' + req.params.u_id);
    if (req.session.user._id.toString() == req.params.u_id) {
    
    let oid = ObjectID(req.params.u_id.toString());
    // async.waterfall
    db.users.findOne({"_id" : oid}, function (err, user) {
        if (err || !user) {
            console.log("error getting people : " + err);
            res.send("err findin user for people " + err);
        } else {
            if (user.people != undefined && user.people != null) {
                db.people.find({"_id": {$in: user.people }}).sort({otimestamp: -1}).toArray( function(errr, people) {
                    if (err || !people) {
                        console.log("error getting people : " + errr);
                        res.send("my erroneous people " + errr);
                    } else {
                        res.json(people);
                        console.log("returning people for " + req.params.u_id);
                    }
                });
            }
        }
    });
    } else {
        console.log("somebody tryna get people without no surfticket!");
    }

});

app.get('/person/:p_id', requiredAuthentication, function(req, res) {
    console.log('tryna return person for: ' + req.params.p_id);
    var o_id = ObjectID(req.params.p_id);
    db.people.findOne({_id: o_id}, function(err, person) {
        if (err || !person) {
            console.log("error getting text_items : " + err);
        } else {
            db.invitations.find({sentToPersonID: person._id.toString()}, function (err, invitations) {
                if (err || !invitations) {
                    res.json(person);
                } else {
                    person.invitations = invitations;
                    res.json(person);
                }
            });
        }
    });
});
// app.get('/delete_inventories', function (req, res) { 
//     db.inventories.remove({});
//     console.log("all invitations have been removed");
// });

// app.get('/delete_allpeople', function (req, res) { 
//     db.people.remove({});
//     console.log("all invitations have been removed");
// });
// app.get('/delete_invitations', function (req, res) { 
//     db.invitations.remove({});
//     console.log("all invitations have been removed");
// });
// app.get('/delete_scores', function (req, res) {
//     db.scores.remove({});
//     console.log("all scores have been removed");
// });

app.get('/actions/:u_id', requiredAuthentication, function(req, res) {
    console.log('tryna return action_items for: ' + req.params.u_id);
    // if (!req.session.user.authLevel.includes("domain")) {
    //     db.actions.find({userID: req.params.u_id}).sort({otimestamp: -1}).limit(maxItems).toArray( function(err, action_items) {
    //         if (err || !action_items) {
    //             console.log("error getting action_items : " + err);
    //         } else {
    //             res.json(action_items);
    //             console.log("returning action_items for " + req.params.u_id);
    //         }
    //     });
    // } else {
        db.actions.find({}).sort({otimestamp: -1}).toArray( function(err, action_items) {
            if (err || !action_items) {
                console.log("error getting action_items : " + err);
            } else {
                res.json(action_items);
                console.log("returning action_items for " + req.params.u_id);
            }
        });
    // }
});

app.get('/action/:p_id', requiredAuthentication, function(req, res) {
    console.log('tryna return action_items for: ' + req.params.p_id);
    var o_id = ObjectID(req.params.p_id);
    db.actions.findOne({_id: o_id}, function(err, action_item) {
        if (err || !action_item) {
            console.log("error getting action_item : " + err);
        } else {
            res.json(action_item);
            // console.log("returning text items for " + req.params.p_id);
        }
    });
});
app.post('/update_action/', requiredAuthentication, admin, function (req, res) {
    //        var textitem = req.body;
        // console.log("req.body update text:" + JSON.stringify(req.body));
        var o_id = ObjectID(req.body._id);
    //        textitem.userID = req.session.user._id.toString();
        var timestamp = Math.round(Date.now() / 1000);
        db.actions.update( { "_id": o_id }, { $set: {
            
            tags: req.body.tags,
            actionName: req.body.actionName,
            actionType: req.body.actionType,
            actionResult: req.body.actionResult,
            resultTarget: req.body.resultTarget,
            sourceObjectMod: req.body.sourceObjectMod,
            actionDesc: req.body.actionDesc,
            property: req.body.property,
            attribute: req.body.attribute,
            operator: req.body.operator,
            affect: req.body.affect,
            // effectiveness: effectiveness,
            xpoints: req.body.xpoints,
            karma: req.body.karma,
            hitpoints: req.body.hitpoints,
            mana: req.body.mana,
            difficulty: req.body.difficulty,
            orderChaos: req.body.orderChaos,
            alignment: req.body.alignment,
            effectiveness: req.body.effectiveness,
            e_i: req.body.e_i,
            j_p: req.body.j_p,
            s_n: req.body.s_n,
            t_f: req.body.t_f,
            integrity: req.body.integrity,
            protectiveness: req.body.protectiveness,
            generosity: req.body.generosity,
            agreeableness: req.body.agreeableness,
            discipline: req.body.discipline,
            openness: req.body.openness,
            confidence: req.body.confidence,
            lastUpdateTimestamp: timestamp,
            lastUpdateUserID: req.session.user._id,
            lastUpdateUserName: req.session.user.userName
        }}, function (err, saved) {
        if (err || !saved) {
            console.log(err + "error updating action");
            res.send("error updating action " + err);
        } else {
            console.log("updated action");
            res.send("updated " + new Date());
        }
     });
        // if (err) {res.send(error)} else {res.send("updated " + new Date())}
        // res.send("updated " + new Date());
    });
    

app.post('/newaction', requiredAuthentication, function (req, res) {

    var actionitem = req.body;
    actionitem.userID = req.session.user._id.toString();
    var timestamp = Math.round(Date.now() / 1000);
    actionitem.otimestamp = timestamp;
    actionitem.createdByUserID = req.session.user._id;
    actionitem.createdByUserName =  req.session.user.userName;
    
    db.actions.save(actionitem, function (err, saved) {
        if ( err || !saved ) {
            console.log('action not saved..');
            res.send("action not saved " + err);
        } else {
            var item_id = saved._id.toString();
            console.log('new group created, id: ' + item_id);
            res.send("created: " + item_id);
        }
    });
});

app.post('/newtext', requiredAuthentication, function (req, res) {

    var textitem = req.body;
    textitem.userID = req.session.user._id.toString();
    var timestamp = Math.round(Date.now() / 1000);
    textitem.otimestamp = timestamp;
    textitem.createdByUserID = req.session.user._id;
    textitem.createdByUserName =  req.session.user.userName;
    
    db.text_items.save(textitem, function (err, saved) {
        if ( err || !saved ) {
            console.log('text not saved..');
            res.send("text not saved " + err);
        } else {
            var item_id = saved._id.toString();
            console.log('new group created, id: ' + item_id);
            res.send("created: " + item_id);
        }
    });
});

app.post('/delete_text/:_id', checkAppID, requiredAuthentication, function (req, res) {
    console.log("tryna delete text itme: " + req.body._id);
    var o_id = ObjectID(req.body._id);
    db.text_items.remove( { "_id" : o_id }, 1 );
    res.send("deleted");
});

app.post('/updatetext/:_id', requiredAuthentication, function (req, res) {
//        var textitem = req.body;
    console.log("req.body update text:" + JSON.stringify(req.body));
    var o_id = ObjectID(req.body._id);
//        textitem.userID = req.session.user._id.toString();
    var timestamp = Math.round(Date.now() / 1000);
    db.text_items.update( { "_id": o_id }, { $set: {
        
        tags: req.body.tags,
        title: req.body.title,
        type: req.body.type,
        desc: req.body.desc,  //  ? req.body.desc : req.body.textstring.substr(0,20) + "...",
        mode: req.body.mode,
        font: req.body.font,
        author: req.body.author,
        source: req.body.source,
        sourceURL: req.body.sourceURL,
        year: req.body.year,
        fontSize: req.body.fontSize,
        alignment: req.body.alignment != null ? req.body.alignment : "left" ,
        textBackground: req.body.textBackground,
        textBackgroundColor: req.body.textBackgroundColor,
        fillColor: req.body.fillColor,
        outlineColor: req.body.outlineColor,
        glowColor: req.body.glowColor,
        textstring: req.body.textstring,
        rotateToPlayer : req.body.rotateToPlayer != null ? req.body.rotateToPlayer : false,
        scaleByDistance : req.body.scaleByDistance != null ? req.body.scaleByDistance : false,
        useThreeDeeText : req.body.useThreeDeeText != null ? req.body.useThreeDeeText : false,
        lastUpdateTimestamp: timestamp,
        lastUpdateUserID: req.session.user._id,
        lastUpdateUserName: req.session.user.userName
    }});
    res.send("updated " + new Date());
});

app.get('/svg/:_id', function(req, res) { 
    console.log('tryna return svg for: ' + req.params._id);
    var o_id = ObjectID(req.params._id);
    db.text_items.findOne({_id: o_id}, function(err, text_item) {
        if (err || !text_item) {
            console.log("error getting text_items : " + err);
        } else {
            res.send(text_item.textstring); //text file saved as svg format
            console.log("returning svg item " + req.params._id);
        }
    });
});
app.get('/font/:_id', function(req, res) { 
    console.log('tryna return font for: ' + req.params._id);
    var o_id = ObjectID(req.params._id);
    db.text_items.findOne({_id: o_id}, function(err, text_item) {
        if (err || !text_item || text_item.type != "Font") {
            console.log("error getting font text_item : " + err);
            res.send(err);
        } else {
            res.send(text_item.textstring); //text file saved as svg format
            console.log("returning font item " + req.params._id);
        }
    });
});

app.get('/usertexts/:u_id', requiredAuthentication, function(req, res) {
    console.log('tryna return usertexts for: ' + req.params.u_id);
    if (!req.session.user.authLevel.includes("domain")) {
        db.text_items.find({userID: req.params.u_id}).sort({otimestamp: -1}).limit(maxItems).toArray( function(err, text_items) {
            if (err || !text_items) {
                console.log("error getting text_items : " + err);
            } else {
                res.json(text_items);
                console.log("returning text items for " + req.params.u_id);
            }
        });
    } else {
        db.text_items.find({}).sort({otimestamp: -1}).limit(maxItems).toArray( function(err, text_items) {
            if (err || !text_items) {
                console.log("error getting text_items : " + err);
            } else {
                res.json(text_items);
                console.log("returning text items for " + req.params.u_id);
            }
        });
    }
});

app.get('/usertext/:p_id', requiredAuthentication, function(req, res) {
    console.log('tryna return usertexts for: ' + req.params.p_id);
    var o_id = ObjectID(req.params.p_id);
    db.text_items.findOne({_id: o_id}, function(err, text_item) {
        if (err || !text_item) {
            console.log("error getting text_items : " + err);
        } else {
            res.json(text_item);
            console.log("returning text items for " + req.params.u_id);
        }
    });
});

app.get('/userpics',  requiredAuthentication, function(req, res) {
    console.log('tryna return userpics for: ' + req.body.userID);
    db.image_items.find({userID: req.params.u_id}).sort({otimestamp: -1}).limit(maxItems).toArray( function(err, picture_items) {
        if (err || !picture_items) {
            console.log("error getting picture items: " + err);
        } else {
            for (var i = 0; i < picture_items.length; i++) {
                var item_string_filename = JSON.stringify(picture_items[i].filename);
                item_string_filename = item_string_filename.replace(/\"/g, "");
                var item_string_filename_ext = getExtension(item_string_filename);
                var expiration = new Date();
                expiration.setMinutes(expiration.getMinutes() + 30);
                var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                console.log(baseName);
                var thumbName = 'thumb.' + baseName + item_string_filename_ext;
                var halfName = 'half.' + baseName + item_string_filename_ext;
                var standardName = 'standard.' + baseName + item_string_filename_ext;
                var urlThumb = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_items[i].userID + "/pictures/" + picture_items[i]._id + "." + thumbName, Expires: 6000}); //just send back thumbnail urls for list
                //var urlPng = knoxClient.signedUrl(audio_item[0]._id + "." + pngName, expiration);
                picture_items[i].URLthumb = urlThumb; //jack in teh signed urls into the object array

            }

            res.json(picture_items);
            console.log("returning picture_items for " + req.userID);
        }
    });
});

// app.get('/userpic/:p_id', checkAppID, requiredAuthentication, function(req, res) {
app.get('/userpic/:p_id', requiredAuthentication, function(req, res) {

    console.log('tryna return userpic : ' + req.params.p_id);
    var pID = req.params.p_id;
    var o_id = ObjectID(pID);
    db.image_items.findOne({"_id": o_id}, function(err, picture_item) {
        if (err || !picture_item) {
            console.log("error getting picture items: " + err);
        } else {
            var item_string_filename = JSON.stringify(picture_item.filename);
            item_string_filename = item_string_filename.replace(/\"/g, "");
            var item_string_filename_ext = getExtension(item_string_filename);
            var expiration = new Date();
            expiration.setMinutes(expiration.getMinutes() + 30);
            var baseName = path.basename(item_string_filename, (item_string_filename_ext));
            console.log(baseName);
            var thumbName = 'thumb.' + baseName + item_string_filename_ext;
            var halfName = 'half.' + baseName + item_string_filename_ext;
            var standardName = 'standard.' + baseName + item_string_filename_ext;
            var originalName = 'original.' + baseName + item_string_filename_ext;
            // console.log("original name : " + originalName);
            // var urlThumb = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + thumbName, Expires: 6000}); 
            // var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + halfName, Expires: 6000}); 
            // var urlStandard = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + standardName, Expires: 6000});
            // var urlTarget = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/targets/" + picture_item._id + ".mind", Expires: 6000});
            // var urlOriginal = "";
            //var urlPng = knoxClient.signedUrl(audio_item[0]._id + "." + pngName, expiration);
            // console.log("urlTarget " + urlTarget);

            (async () => { 

                var urlThumb = await ReturnPresignedUrl(process.env.S3_ROOT_BUCKET_NAME, "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + thumbName, 6000); 
                var urlStandard = await ReturnPresignedUrl(process.env.S3_ROOT_BUCKET_NAME, "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + standardName, 6000); 
                var urlHalf = await ReturnPresignedUrl(process.env.S3_ROOT_BUCKET_NAME, "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + halfName, 6000); 
                var urlTarget = await ReturnPresignedUrl(process.env.S3_ROOT_BUCKET_NAME, "users/" + picture_item.userID + "/pictures/targets/" + picture_item._id + ".mind", 6000); 
                var urlOriginal = await ReturnPresignedUrl(process.env.S3_ROOT_BUCKET_NAME, "users/" + picture_item.userID + "/pictures/originals/" + picture_item._id + "." + originalName, 6000); 
                // var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + halfName, Expires: 6000}); 
                // var urlStandard = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + standardName, Expires: 6000});
                // var urlTarget = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/targets/" + picture_item._id + ".mind", Expires: 6000});
                if (minioClient) {
                    picture_item.URLthumb = urlThumb; //jack in teh signed urls into the object array
                    picture_item.URLhalf = urlHalf;
                    picture_item.URLstandard = urlStandard;
                    picture_item.URLoriginal = urlOriginal;
                    picture_item.URLtarget = urlTarget;
                    // res.json(picture)
                    res.json(picture_item);
                    console.log("returning picture_item for " + req.params.u_id);    
                } else {
                var params = {Bucket: process.env.S3_ROOT_BUCKET_NAME, Key: "users/" + picture_item.userID + "/pictures/originals/" + picture_item._id + "." + originalName};
                s3.headObject(params, function(err, data) { //some old pix aren't saved with .original. in filename, check for that
                    if (err) {
                        console.log("dinna find that pic");
                        originalName = baseName + item_string_filename_ext;
                        urlOriginal = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/originals/" + originalName, Expires: 6000}); 
                        picture_item.URLthumb = urlThumb; //jack in teh signed urls into the object array
                        picture_item.URLhalf = urlHalf;
                        picture_item.URLstandard = urlStandard;
                        picture_item.URLoriginal = urlOriginal;
                        picture_item.URLtarget = urlTarget;
                        // console.log("urlTarget " + urlTarget);
                        res.json(picture_item);
                        console.log("returning picture_item for " + picture_item);
                    } else {
                        console.log("found that orig pic");
                        urlOriginal = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/originals/" + picture_item._id + "." + originalName, Expires: 6000}); 
                        picture_item.URLthumb = urlThumb; //jack in teh signed urls into the object array
                        picture_item.URLhalf = urlHalf;
                        picture_item.URLstandard = urlStandard;
                        picture_item.URLoriginal = urlOriginal;
                        picture_item.URLtarget = urlTarget;
                        // console.log("urlTarget " + urlTarget);
                        if (picture_item.orientation != null && picture_item.orientation != undefined && picture_item.orientation.toLowerCase() == "equirectangular") {
                            //return cubemaps?  
                            res.json(picture_item);

                        } else {
                            res.json(picture_item);
                        }
                    }
                    });
                }
                // res.json(picture_items);
                // console.log("returning picture_items for " + req.params.u_id);    
            })();
        }
    });
});

app.get('/hls/:_id', function(req, res) {
    var pID = req.params._id;
    // console.log("hls pid " + req.params._id);
    if (ObjectID.isValid(pID)) {
        var o_id = ObjectID(pID);
        db.video_items.findOne({"_id": o_id}, function(err, video_item) {
            if (err || !video_item) {
                console.log("error getting hls video item: " + err);
                res.send("error getting hls video item: " + err);
            } else {

                (async () => {
                    if (minioClient) {
                        let buffer = [];
                        await minioClient.getObject(process.env.S3_ROOT_BUCKET_NAME, 'users/' + video_item.userID + '/video/' + video_item._id + '/hls/output.m3u8', function(err, dataStream) {
                            if (err) {
                              console.log(err);
                            }
                            dataStream.on('data', function(chunk) {
                            //   size += chunk.length
                              buffer.push(chunk);
                              // chunk.pipe(fileStream);
                            })
                            dataStream.on('end', function() {
                                let manifestString = buffer.toString();
                                // console.log(manifestString);

                                var data = [];
                                var stream = minioClient.listObjects(process.env.S3_ROOT_BUCKET_NAME,'users/' + video_item.userID + '/video/' + video_item._id + '/hls/', false);
                                stream.on('data', function(obj) { 
                                    data.push(obj) 
                                } )
                                stream.on("end", function (obj) { 
                                    // console.log("minio bucket list: " + JSON.stringify(data)); 

                                    async.each (data, function (s3Object, callbackz) { //takes a shake so async, and respond when it's done
                                        // console.log("minio data element: " + JSON.stringify(s3Object));
                                        if (getExtension(s3Object.name) == ".ts") { //swap out .ts files (e.g 001.ts) for signed urls
                                            // console.log("minio key " + path.basename(s3Object.name)); 
                                            // let url = await ReturnPresignedUrl(process.env.S3_ROOT_BUCKET_NAME, s3Object.name.toString(), 36000);
                                            minioClient.presignedGetObject(process.env.S3_ROOT_BUCKET_NAME, s3Object.name.toString(), 24*60*60, function(err, presignedUrl) { //use callback version here, can't await?
                                                if (err) return console.log(err);
                                                // console.log("url " + presignedUrl);
                                                manifestString = manifestString.replace(path.basename(s3Object.name.toString()), presignedUrl);
                                                callbackz();
                                              });                                          
                                        } else {
                                            callbackz();
                                        }
                                            
                                        }, function(err) {
                                            if (err) {
                                                // console.log('hls mangler failed to process');
                                                res.send("error! " + err);
                                            } else {
                                                // console.log('All files have been processed successfully');
                                                res.setHeader('content-type', 'application/x-mpegURL');
                                                res.send(manifestString);
                                            }
                                    });
                                })
                                stream.on('error', function(err) { 
                                    console.log(err)
                                } );
                            });
                                dataStream.on('error', function(err) {
                                console.log(err);
                            
                            });
                        });
                    } else {
                    let chkParams = {Bucket: process.env.S3_ROOT_BUCKET_NAME, Key: 'users/' + video_item.userID + '/video/' + video_item._id + '/hls/output.m3u8'};
                    s3.getObject(chkParams, function(err, manifest) { 
                    if (err) { 
                        res.send("no hls manifest found");
                    } else {
                        // console.log("gotsa m3u8: " + manifest.Body.toString());
                        var params = {
                            Bucket: process.env.S3_ROOT_BUCKET_NAME,
                            Prefix: 'users/' + video_item.userID + '/video/' + video_item._id + '/hls/'
                        }
                        
                        s3.listObjects(params, function(err, data) {
                        if (err) {
                            console.log(err);
                            res.send("error: " + err);
                        }
                        if (data.Contents.length == 0) {
                            // console.log("no content found");
                            res.send("no content found");
                        } else {
                            var manifestString = manifest.Body.toString();                                   
                            async.each (data.Contents, function (s3Object, callbackz) { //takes a shake so async, and respond when it's done
                                if (getExtension(s3Object.Key) == ".ts") { //swap out .ts files (e.g 001.ts) for signed urls
                                    // console.log("filename " + path.basename(s3Object.Key)); 
                                    let url = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: s3Object.Key, Expires: 36000});
                                    // console.log("url " + url);
                                    manifestString = manifestString.replace(path.basename(s3Object.Key), url);
                                }
                                    callbackz();
                                }, function(err) {
                                    if (err) {
                                        // console.log('hls mangler failed to process');
                                        res.send("error! " + err);
                                    } else {
                                        // console.log('All files have been processed successfully');
                                        res.setHeader('content-type', 'application/x-mpegURL');
                                        res.send(manifestString);
                                    }
                                });
                                
                                }
                            });
                            }
                        });
                    }
                })();
            }
        });
    } else {
        res.send("error in id " + pID);
    }
});

app.get('/uservid/:p_id', requiredAuthentication, function(req, res) {
    console.log('tryna return uservid : ' + req.params.p_id);
    var pID = req.params.p_id;
    var o_id = ObjectID(pID);
    db.video_items.findOne({"_id": o_id}, function(err, video_item) {
        if (err || !video_item) {
            console.log("error getting video items: " + err);
        } else {
            var item_string_filename = JSON.stringify(video_item.filename);
            item_string_filename = item_string_filename.replace(/\"/g, "");
            var item_string_filename_ext = getExtension(item_string_filename);
            var expiration = new Date();
            expiration.setMinutes(expiration.getMinutes() + 30);

            (async () => {
            // var vidUrl = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + video_item.userID + "/video/" + video_item._id + "/" + video_item._id + "." + video_item.filename, Expires: 6000}); //just send back thumbnail urls for list
            var vidUrl = await ReturnPresignedUrl(process.env.S3_ROOT_BUCKET_NAME, "users/" + video_item.userID + "/video/" + video_item._id + "/" + video_item._id + "." + video_item.filename, 6000);
            //var urlPng = knoxClient.signedUrl(audio_item[0]._id + "." + pngName, expiration);
            video_item.URLvid = vidUrl; //jack in teh signed urls into the object array
                        console.log("returning video_item : " + video_item.URLvid);
            res.json(video_item);
            })();


            //TODO 1. pull m3u8 file, extract the .ts names, replace them  with signed urls, add modded manifest to response
    //         let cmParams = {Bucket: process.env.S3_ROOT_BUCKET_NAME, Key: "users/"+picture_item.userID+"/cubemaps/"+picture_item._id+"_px.jpg"};
    //                     s3.headObject(cmParams, function(err, data) { //some old pix aren't saved with .original. in filename, check for that
    //                     if (err) { 

    //                     } else {
    //                         var params = {
    //                             Bucket: 'mvmv.us',
    // //                            Delimiter: '/',
    //                             Prefix: 'assets_2018_1/bundles_win/'
    //                         }
    //                         s3.listObjects(params, function(err, data) {
    //                             if (err) {
    //                                 console.log(err);
    //                                 return callback(err);
    //                             }
    //                             if (data.Contents.length == 0) {
    //                                 console.log("no content found");
    //                                 callback(null);
    //                             } else {
    //                                 assetsResponse.bundles_win = data.Contents;
    //                                 callback();
    //                             }
    //                         });
    //                         }
    //                     });
        


        }
    });
});
// app.post('/scene_inventory_objex', requiredAuthentication, function(req, res) {
app.post('/scene_inventory_objex_old', function(req, res) {
    console.log("tryna get scene inventory objex" + JSON.stringify(req.body));
    let response = {};
    let objex = [];
    response.objex = objex;
    if (req.body.oIDs != undefined && req.body.oIDs.length > 0) {
/////////
        
        async.each (req.body.oIDs, function (oID, callbackz) { 
            //fetch obj and jack in the model url'
            let objID = ObjectID(oID);
            db.obj_items.findOne({_id: objID}, function (err, obj_item) {
                if (err || !obj_item) {
                    callbackz(err);
                } else {
                    // console.log("tryna get inventory modelID " + obj_item.modelID);
                    let mid = obj_item.modelID;
                    if (mid != null) {
                        // console.log("tryna get inventory modelID2 " + oid);
                        let m_id = ObjectID(mid);
                        db.models.findOne({"_id": m_id}, function (err, model) {
                        if (err || !model) {
                            console.log("error getting model: " + err);
                            callbackz(err);
                            } else {
                                (async () => {
                                    console.log("got objj model:" + model._id);
                                    // let url = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + model.userID + "/gltf/" + model.filename, Expires: 6000});
                                    let url = await ReturnPresignedUrl(process.env.S3_ROOT_BUCKET_NAME, 'users/' + model.userID + "/gltf/" + model.filename, 6000);
                                    obj_item.modelURL = url;
                                    response.objex.push(obj_item);
                                    callbackz(null);
                                })();
                            }
                        });

                    } else {
                        response.objex.push(obj_item);
                        callbackz(null);
                    }        
                }
            });
        }, function(err) {
            if (err) {
                res.send("problem getting inventory " + err);
            } else {
                res.send(response);
            }
        });

        ////////
    }
});

app.post('/scene_inventory_objex/', function(req, res) {
    console.log('tryna return userobj : ' + req.params.p_id);
    const iids = req.body.oIDs.map(item => {
        return ObjectID(item);
    });
    let response = {};
    let objex = [];
    response.objex = objex;
    db.obj_items.find({"_id": {$in: iids}}, function(err, obj_items) {
        if (err || !obj_items) {
            console.log("error getting picture items: " + err);
        } else {
            async.each (obj_items, function (obj_item, callbackz) {
                async.waterfall([
                    function(callback) {
                        console.log("starting..");
                        if (obj_item.objectPictureIDs != null && obj_item.objectPictureIDs != undefined && obj_item.objectPictureIDs.length > 0) {
                        // oids = domain.domainPictureIDs.map(ObjectID()); //convert to mongo object ids for searching
                            const oids = obj_item.objectPictureIDs.map(item => {
                                return ObjectID(item);
                            });
                            db.image_items.find({_id: {$in: oids }}, function (err, pic_items) {
                                if (err || !pic_items) {
                                    console.log("error getting picture items: " + err);
                                    // res.send("error: " + err);
                                    callback(err);
                                } else {
                                    (async () => {
                                        objectPictures = [];
                                        // pic_items.forEach(function(picture_item) {               
                                            for (let i = 0; i < pic_items.length; i++) { 
                                                var imageItem = {};
                                                // var urlThumb = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".thumb." + picture_item.filename, Expires: 6000});
                                                // var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".half." + picture_item.filename, Expires: 6000});
                                                var urlThumb = await ReturnPresignedUrl(process.env.S3_ROOT_BUCKET_NAME, "users/" + pic_items[i].userID + "/pictures/" + pic_items[i]._id + ".thumb." + pic_items[i].filename, 6000);
                                                var urlHalf = await ReturnPresignedUrl(process.env.S3_ROOT_BUCKET_NAME, "users/" + pic_items[i].userID + "/pictures/" + pic_items[i]._id + ".half." + pic_items[i].filename, 6000);
                                                // var urlStandard = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".standard." + picture_item.filename, Expires: 6000});
                                                imageItem.urlThumb = urlThumb;
                                                imageItem.urlHalf = urlHalf;
                                                // imageItem.urlStandard = urlStandard;
                                                imageItem._id = pic_items[i]._id;
                                                imageItem.filename = pic_items[i].filename;
                                                objectPictures.push(imageItem);
                                                obj_item.objectPictures = objectPictures;
                                            }
                                        // });
                                        callback(null);
                                    })();
                                }
                            });
                        
                        } else {
                            console.log('no pics');
                            callback(null);
                        }
                    },
                    function(callback) {
                        // console.log(JSON.stringify(obj_item));
                        if (obj_item.actionIDs != undefined && obj_item.actionIDs.length > 0) {
                            const aids = obj_item.actionIDs.map(item => {
                                return ObjectID(item);
                            });
                            db.actions.find({_id: {$in: aids }}, function (err, actions) {
                                if (err || !actions) {
                                    callback(err);
                                } else {
                                    obj_item.actions = actions;
                                    // console.log(JSON.stringify(obj_item.actions));
                                    callback(null);
                                }
                            });
                        } else {
                            callback(null);
                        }
                    }, 
                    function (callback) {
                        console.log("tryna get modelID " + obj_item.modelID);
                        let oid = obj_item.modelID;
                        if (oid != null) {
                            console.log("tryna get modelID2 " + oid);
                            let oo_id = ObjectID(oid);
                            db.models.findOne({"_id": oo_id}, function (err, model) {
                            if (err || !model) {
                                console.log("error getting model: " + err);
                                callback(err);
                                } else {
                                    (async () => {
                                        console.log("got objj model:" + JSON.stringify(model));
                                        // let url = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + model.userID + "/gltf/" + model.filename, Expires: 6000});
                                        let url = await ReturnPresignedUrl(process.env.S3_ROOT_BUCKET_NAME, 'users/' + model.userID + "/gltf/" + model.filename, 6000);
                                        obj_item.modelURL = url;
                                        callback(null);
                                    })();
                                }
                        });
                        } else {
                            callback(null);
                        }                                                     
                    }
                ],

                function(err, result) { // #last function, close async.waterfall
                        // console.log("waterfall done: " + JSON.stringify(obj_item));
                        // res.json(obj_item);
                        response.objex.push(obj_item);
                        callbackz(null); //callback for async.each
                    }
                );
            }, function(err) { //async.each close
                if (err) {
                    res.send("problem getting inventory " + err);
                } else {
                    res.send(response);
                }
            });
        }
    });
});

app.get('/userobj/:p_id', requiredAuthentication, function(req, res) {
    console.log('tryna return userobj : ' + req.params.p_id);
    var pID = req.params.p_id;
    var o_id = ObjectID(pID);
    var childObjects = {};
    db.obj_items.findOne({"_id": o_id}, function(err, obj_item) {
        if (err || !obj_item) {
            console.log("error getting picture items: " + err);
        } else {
            async.waterfall([
                function(callback) {
                    console.log("starting..");
                    if (obj_item.objectPictureIDs != null && obj_item.objectPictureIDs != undefined && obj_item.objectPictureIDs.length > 0) {
                    // oids = domain.domainPictureIDs.map(ObjectID()); //convert to mongo object ids for searching
                        const oids = obj_item.objectPictureIDs.map(item => {
                            return ObjectID(item);
                        });
                        db.image_items.find({_id: {$in: oids }}, function (err, pic_items) {
                            if (err || !pic_items) {
                                console.log("error getting picture items: " + err);
                                // res.send("error: " + err);
                                callback(err);
                            } else {
                                objectPictures = [];
                                pic_items.forEach(function(picture_item) {                
                                    var imageItem = {};
                                    var urlThumb = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".thumb." + picture_item.filename, Expires: 6000});
                                    var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".half." + picture_item.filename, Expires: 6000});
                                    var urlStandard = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".standard." + picture_item.filename, Expires: 6000});
                                    imageItem.urlThumb = urlThumb;
                                    imageItem.urlHalf = urlHalf;
                                    imageItem.urlStandard = urlStandard;
                                    imageItem._id = picture_item._id;
                                    imageItem.filename = picture_item.filename;
                                    objectPictures.push(imageItem);
                                    obj_item.objectPictures = objectPictures;
                                });
                                callback(null);
                            }
                        });
                    
                    } else {
                        console.log('no pics');
                        callback(null);
                    }
                },
                function(callback) {
                    // console.log(JSON.stringify(obj_item));
                    if (obj_item.actionIDs != undefined && obj_item.actionIDs.length > 0) {
                        const aids = obj_item.actionIDs.map(item => {
                            return ObjectID(item);
                        });
                        db.actions.find({_id: {$in: aids }}, function (err, actions) {
                            if (err || !actions) {
                                callback(err);
                            } else {
                                obj_item.actions = actions;
                                // console.log(JSON.stringify(obj_item.actions));
                                callback(null);
                            }
                        });
                    } else {
                        callback(null);
                    }
                }, 
                function (callback) {
                    console.log("tryna get modelID " + obj_item.modelID);
                    let oid = obj_item.modelID;
                    if (oid != null) {
                        console.log("tryna get modelID2 " + oid);
                        let oo_id = ObjectID(oid);
                        db.models.findOne({"_id": oo_id}, function (err, model) {
                        if (err || !model) {
                            console.log("error getting model: " + err);
                            callback(err);
                            } else {
                                console.log("got objj model:" + JSON.stringify(model));
                                let url = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + model.userID + "/gltf/" + model.filename, Expires: 6000});
                                obj_item.modelURL = url;
                                callback(null);
                            }
                    });
                    } else {
                        callback(null);
                    }                                                     
                }
            ],

            function(err, result) { // #last function, close async
                    // console.log("waterfall done: " + JSON.stringify(obj_item));
                    res.json(obj_item);
                }
            );
        }
    });
});



app.get('/useraudio/:username', function(req, res) {
    console.log('tryna return audiolist: ' + req.params.tag);
    db.audio_items.find({username: req.params.username}).sort({otimestamp: -1}).limit(maxItems).toArray( function(err, audio_items) {
        if (err || !audio_items) {
            console.log("error getting audio items: " + err);
        } else {
            res.json(audio_items);
//                console.log("returning audio_items for " + req.params.userName);
        }
    });
});

app.get('/audiodata.json', checkAppID, requiredAuthentication, function (req, res) {
//	app.get("/audiodata.json", auth, function (req, res) {
    db.audio_items.find({}, function(err,audio_items) {
        if (err || !audio_items) {
            console.log("error getting audio items: " + err);
            //es.end(err);
        } else { //don't add urls for this one...

            console.log('tryna send audio_items...');
            res.json(audio_items);

        }
    });
});

app.get('/item_sc/:sid', function (req, res) {

    var shortID = req.params.sid;
    db.audio_items.find({ "short_id" : shortID}, function(err, audio_item) {
        if (err || !audio_item) {
            console.log("error getting audio items: " + err);
        } else {
            var item_string_filename = JSON.stringify(audio_item[0].filename);
            item_string_filename = item_string_filename.replace(/\"/g, "");
            var item_string_filename_ext = getExtension(item_string_filename);
            var expiration = new Date();
            expiration.setMinutes(expiration.getMinutes() + 3);
            var baseName = path.basename(item_string_filename, (item_string_filename_ext));
            console.log(baseName);
            var mp3Name = baseName + '.mp3';
            var oggName = baseName + '.ogg';
            var pngName = baseName + '.png';
            //var urlMp3 = knoxClient.signedUrl(audio_item[0]._id + "." + mp3Name, expiration);
            //var urlOgg = knoxClient.signedUrl(audio_item[0]._id + "." + oggName, expiration);
            //var urlPng = knoxClient.signedUrl(audio_item[0]._id + "." + pngName, expiration);

            var urlMp3 = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_item[0].userID + "/audio/" + audio_item[0]._id + "." + mp3Name, Expires: 6000});
            var urlOgg = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_item[0].userID + "/audio/" + audio_item[0]._id + "." + oggName, Expires: 6000});
            var urlPng = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_item[0].userID + "/audio/" + audio_item[0]._id + "." + pngName, Expires: 6000});
            audio_item[0].URLmp3 = urlMp3; //jack in teh signed urls into the object array
            audio_item[0].URLogg = urlOgg;
            audio_item[0].URLpng = urlPng;
            res.json(audio_item);
        }
    });
});


app.get('/audio/:id', requiredAuthentication, function (req, res){ //TODO Authenticate below if Public/Private bool for this media item

    var audioID = req.params.id;
    var o_id = ObjectID(audioID);   
    console.log('audioID requested : ' + audioID);
    db.audio_items.findOne({ "_id" : o_id}, function(err, audio_item) {
        if (err || !audio_item) {
            console.log("error getting audio items: " + err);
        } else {
            let orig = null;
            async.waterfall([
                function(callback){  
                    if (audio_item.textitemID != "") {
                        var t_id = ObjectID(audio_item.textitemID);
                        db.text_items.findOne({"_id" : t_id}, function (err, text_item) {
                            if (err || !text_item) {
                                console.log("no text for audio item");
                                callback(null, "error");
                            } else {
                                console.log(text_item);
                                if (text_item.textstring != "") {

                                callback(null, text_item.textstring);

                                console.log("text_item.textstring: " + text_item.textstring);
                                } else {
                                    callback(null, "");
                                }
                            }
                        });

                    } else {
                        callback(null, "");
                    }
                },
                // function(callback) { //add the signed URLs to the obj array
                    
                //     let cmParams = {Bucket: process.env.S3_ROOT_BUCKET_NAME, Key: "users/" + audio_item.userID + "/audio/originals/" + audio_item._id + ".original." + audio_item.filename, Expires: 6000};
                //         s3.headObject(cmParams, function(err, data) { //some old pix aren't saved with .original. in filename, check for that
                //         if (err) {  
                            
                //         } else {
                //             orig = s3.getSignedUrl('getObject', cmParams);  
                            
                //             }
                //         });
                //     callback(null);
                // },
                function(text_string, callback) { //add the signed URLs to the obj array

                    (async () => {
                        var item_string_filename = JSON.stringify(audio_item.filename);
                        item_string_filename = item_string_filename.replace(/\"/g, "");
                        var item_string_filename_ext = getExtension(item_string_filename);
                        var expiration = new Date();
                        expiration.setMinutes(expiration.getMinutes() + 3);
                        var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                        console.log(baseName);
                        var mp3Name = baseName + '.mp3';
                        var oggName = baseName + '.ogg';
                        var pngName = baseName + '.png';

                        var urlMp3 = await ReturnPresignedUrl(process.env.S3_ROOT_BUCKET_NAME, "users/" + audio_item.userID + "/audio/" + audio_item._id + "." + mp3Name, 6000); 
                        var urlOgg = await ReturnPresignedUrl(process.env.S3_ROOT_BUCKET_NAME, "users/" + audio_item.userID + "/audio/" + audio_item._id + "." + oggName, 6000); 
                        var urlPng = await ReturnPresignedUrl(process.env.S3_ROOT_BUCKET_NAME, "users/" + audio_item.userID + "/audio/" + audio_item._id + "." + pngName, 6000); 
                        // var urlMp3 = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_item.userID + "/audio/" + audio_item._id + "." + mp3Name, Expires: 6000});
                        // var urlOgg = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_item.userID + "/audio/" + audio_item._id + "." + oggName, Expires: 6000});
                        // var urlPng = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_item.userID + "/audio/" + audio_item._id + "." + pngName, Expires: 6000});
                        audio_item.URLmp3 = urlMp3; //jack in teh signed urls into the object array
                        audio_item.URLogg = urlOgg;
                        audio_item.URLpng = urlPng;
                        if (orig != null) {
                            audio_item.URLorig = orig;
                        }
                        audio_item.textString = text_string;

                        callback(null);
                    })();
                }],

                function(err, result) { // #last function, close async
                    res.json(audio_item);
                    console.log("waterfall done: " + result);
                }
            );
        }
    });
});

app.post('/gen_short_code', checkAppID, requiredAuthentication, function (req, res) {
    console.log(req.params);
    var audioID = req.params.id;
    var o_id = ObjectID(audioID);   
    console.log('audioID requested : ' + audioID);
    db.audio_items.find({ "_id" : o_id}, function(err, audio_item) {
        if (err || !audio_item && audio_item.short_id == null) {
            console.log("error getting audio items: " + err);
        } else {
            console.log("tryna update " + req.params.id + " to status " + req.params.item_status);
            db.audio_items.update( { _id: o_id }, { $set: { item_status: req.params.item_status }});
        }
    });
});

app.post('/update/:_id', checkAppID, requiredAuthentication, function (req, res) {
    console.log(req.params._id);

    var o_id = ObjectID(req.params._id);   
    console.log('audioID requested : ' + req.body._id);
    db.audio_items.find({ "_id" : o_id}, function(err, audio_item) {
        if (err || !audio_item) {
            console.log("error getting audio items: " + err);
        } else {
            console.log("tryna update " + req.body._id + " to status " + req.body.item_status);
            db.audio_items.update( { _id: o_id }, { $set: {
                item_status: req.body.item_status,
                tags: req.body.tags,
                alt_title: req.body.alt_title,
                alt_artist: req.body.alt_artist,
                alt_album: req.body.alt_album
            }});
        }
    });
});

app.get('/itemkeys/:_id', function (req, res) { //return keys for specific item id

    console.log(req.params._id);
    var o_id = ObjectID(req.params._id);
    db.audio_item_keys.find({ "keyAudioItemID" : req.params._id}, function(err, itemKeys) {
        if (err || !itemKeys) {
            console.log("cain't get no itemKeys... " + err);
        } else {

            for (var i = 0; i < itemKeys.length; i++) {

                if (itemKeys[i].keyType == 2) {
                    var item_string_filename = JSON.stringify(itemKeys[i].filename);
                    item_string_filename = item_string_filename.replace(/\"/g, "");
                    var item_string_filename_ext = getExtension(item_string_filename);
                    var expiration = new Date();
                    expiration.setMinutes(expiration.getMinutes() + 30);
                    var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                    console.log(baseName);
                    var thumbName = 'thumb.' + baseName + item_string_filename_ext;
                    var halfName = 'half.' + baseName + item_string_filename_ext;
                    var standardName = 'standard.' + baseName + item_string_filename_ext;

                    var urlThumb = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + itemKeys[i].userID + "/" + itemKeys[i]._id + "." + thumbName, Expires: 6000}); //just send back thumbnail urls for list
                    var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + itemKeys[i].userID + "/" + itemKeys[i]._id + "." + halfName, Expires: 6000}); //just send back thumbnail urls for list
                    var urlStandard = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + itemKeys[i].userID + "/" + itemKeys[i]._id + "." + standardName, Expires: 6000}); //just send back thumbnail urls for list

                    itemKeys[i].URLthumb = urlThumb; //jack in teh signed urls into the object array
                    itemKeys[i].URLhalf = urlHalf;
                    itemKeys[i].URLstandard = urlStandard;

                }
            }
            console.log(JSON.stringify(itemKeys));
            res.json(itemKeys);
        }
    });
});

app.post('/savedaudioitems', function (req, res) { //return audio items, referenced by keys in above method (when saved playlist selected)
    console.log("tryna savekeys");
    if (req.session.auth != "noauth") {
        console.log(req.body);
        var jObj = JSON.parse(req.body.json);
        //console.log(jObj[0]);
        var audioIDs = new Array();
        jObj.audioItemIDs.forEach(function(item, index) {
            var a_id = ObjectID(item); //convert to binary to search by _id beloiw
            audioIDs.push(a_id); //populate array that can be fed to mongo find below
        });
        console.log("first audioID: " + audioIDs[0]);

        //db.audio_items.find({_id: { $in: audioIDs[0] } }, function(err,audio_items) {
        db.audio_items.find({_id: { $in: audioIDs } }, function(err,audio_items) {
            if (err || !audio_items) {
                console.log("error getting audio items: " + err);
            } else {
                console.log(JSON.stringify(audio_items));
                //res.json(audio_items);
                async.waterfall([

                        function(callback){ //randomize the returned array, takes a shake so async it...
                            audio_items = Shuffle(audio_items);
                            audio_items.splice(0,audio_items.length - maxItems); //truncate randomized array, take only last 20
                            callback(null);
                        },

                        function(callback) { //add the signed URLs to the obj array
                            for (var i = 0; i < audio_items.length; i++) {
                                var item_string_filename = JSON.stringify(audio_items[i].filename);
                                item_string_filename = item_string_filename.replace(/\"/g, "");
                                var item_string_filename_ext = getExtension(item_string_filename);
                                var expiration = new Date();
                                expiration.setMinutes(expiration.getMinutes() + 1000);
                                var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                                console.log(baseName);
                                var mp3Name = baseName + '.mp3';
                                var oggName = baseName + '.ogg';
                                var pngName = baseName + '.png';
                                var urlMp3 = knoxClient.signedUrl(audio_items[i]._id + "." + mp3Name, expiration);
                                var urlOgg = knoxClient.signedUrl(audio_items[i]._id + "." + oggName, expiration);
                                var urlPng = knoxClient.signedUrl(audio_items[i]._id + "." + pngName, expiration);
                                audio_items[i].URLmp3 = urlMp3; //jack in teh signed urls into the object array
                                audio_items[i].URLogg = urlOgg;
                                audio_items[i].URLpng = urlPng;
                            }
                            console.log('tryna send ' + audio_items.length + 'audio_items ');
                            callback(null);
                        }],

                    function(err, result) { // #last function, close async
                        res.json(audio_items);
                        console.log("waterfall done: " + result);
                    }
                );

            }
        });
    }
});


app.post('/savekeysall', checkAppID, requiredAuthentication, function (req, res) { //save item keys set oon client

    console.log("tryna savekeys");
    if (req.session.auth != "noauth") {
        //console.log(req.session.auth);
        console.log(req.body);
        //var jObj = JSON.parse(req.body.json);
        //var itemKeys =  JSON.parse(keysJson.itemKeys);
        console.log("itemKeys: " + JSON.stringify(jObj.itemKeys));
        //var saveKeysFunction =
        //res.json(JSON.stringify(jObj));
        // for (var i = 0; i < itemKeys.length; i++) {
        //  	jObj.itemKeys.forEach(function(item, index) {
        console.log(JSON.stringify(item.keyString));
//		});
//	/*
//		var saveKeyFunction = function (itemKey, callback) {

        db.audio_item_keys.save(
            req.body.json,
            function (err, saved) {
                if (err || !saved) {
                } else {
                    var key_id = saved._id.toString();
                    console.log('new key id: ' + key_id);
                    //              	callback();
                    res.send(key_id)
                }
            });
    }
    /*
     async.forEach(Object.keys(jObj),saveKeyFunction,function(err){
     console.log("async #");
     }, function(err) {console.log("DONE SAVING KEYS");});
     */
});

app.post('/savekeys', checkAppID, requiredAuthentication, function (req, res) { //save item keys set oon client

    console.log("tryna savekeys");
    if (req.session.auth != "noauth") {
        //console.log(req.session.auth);
        console.log(req.body);
        var jObj = JSON.parse(req.body.json);
        console.log("itemKeys: " + JSON.stringify(jObj.itemKeys));

        jObj.itemKeys.forEach(function(item, index) {
            console.log(JSON.stringify(item.keyString));

            db.audio_item_keys.save(
                {keyType : item.keyType,
                    keyUserID : item.keyUserID,
                    keyAudioItemID : item.keyAudioItemID,
                    keyContentID : item.keyContentID,
                    keyTime : item.keyTime,
                    keySample : item.keySample,
                    keyString : item.keyString},
                function (err, saved) {
                    if (err || !saved) {
                    } else {
                        var key_id = saved._id.toString();
                        console.log('new key id: ' + key_id);
                        //                callback();
                        res.send(key_id)
                    }
                });
        });
    }

});

app.post('/savekey', checkAppID, requiredAuthentication, function (req, res) {

    //if (req.session.auth != "noauth") { //maybe check if uid is valid?
    var jObj = JSON.parse(req.body.json);

    db.audio_item_keys.save(
        {keyType : jObj.keyType,
            keyUserID : jObj.keyUserID,
            keyAudioItemID : jObj.keyAudioItemID,
            keyContentID : jObj.keyContentID,
            keyTime : jObj.keyTime,
            keySample : jObj.keySample,
            keyString : jObj.keyString},
        function (err, saved) {
            if (err || !saved) {
            } else {
                var key_id = saved._id.toString();
                console.log('new key id: ' + key_id);
                //                callback();
                res.send(key_id)
            }
        });
});
/*
 db.audio_item_keys.save(
 {user_id : "1",
 audio_item_id : req.body.audio_item_id,
 key_time : req.body.key_time,
 key_string : req.body.key_string},
 function (err, saved) {
 if (err || !saved) {
 } else {
 var key_id = saved._id.toString();
 console.log('new key id: ' + key_id);
 }
 });
 */

app.post('/delete_key', checkAppID, requiredAuthentication, function (req, res) {
    console.log("tryna delete key: " + req.body.keyID);
    var o_id = ObjectID(req.body.keyID);
    db.audio_item_keys.remove( { "_id" : o_id }, 1 );
    res.send("deleted");

});

app.post('/update_key', checkAppID, requiredAuthentication, function (req, res) {
    console.log("tryna delete key: " + req.body.keyID);
    var o_id = ObjectID(req.body.keyID);
    //db.audio_item_keys.remove( { "_id" : o_id }, 1 );
    //                              res.send("deleted");

    db.audio_item_keys.update( { _id: o_id }, { $set: { keyString: req.body.keyText,
        keySample: parseInt(req.body.keySample),
        keyTime: parseFloat(req.body.keyTime)
        }
    }, function (err, rezponse) {
        if (err || !rezponse) {
            console.log("error updating item key: " + err);
            res.send(err);
        } else {
            console.log("item key updated: " + req.body.keyID);
            res.send("item key updated");
        }
    });
});
///////////////
app.get('/pathinfo',  checkAppID, requiredAuthentication, function (req, res) { //get default path info

    console.log(req.params._id);
    var o_id = ObjectID(req.params._id);
    db.paths.find({}, function(err, paths) {
        if (err || !paths) {
            console.log("cain't get no paths... " + err);
        } else {
            console.log(JSON.stringify(paths));
            res.json(paths);
        }
    });
});

app.get('/upaths/:_id',  checkAppID, requiredAuthentication, function (req, res) { //get default path info

    console.log("tryna get userpaths: ",req.params._id);
    var o_id = ObjectID(req.params._id);
    db.paths.find({ "user_id" : req.params._id}, function(err, paths) {
        if (err || !paths) {
            console.log("cain't get no paths... " + err);
        } else {
            console.log(JSON.stringify(paths));
            res.json(paths);
        }
    });
});

app.get('/upath/:u_id/:p_id',  checkAppID, requiredAuthentication, function (req, res) { //get default path info

    console.log("tryna get path: ", req.params.p_id);
    var _id = ObjectID(req.params.p_id);
    db.paths.find({ _id : _id}, function(err, paths) {
        if (err || !paths) {
            console.log("cain't get no paths... " + err);
        } else {
            console.log(JSON.stringify(paths));
            res.send(paths);
        }
    });
});

// !!!DANGER!!!
// app.get('/scoresremove/:appid',  function (req, res) { //get default path info
//    console.log("nuke all score data for this application!: ", req.params.appid);
// //    var _id = ObjectID(req.params.p_id);
//    db.scores.remove({appID : req.params.appid}, function (err, saved) {
//        if (err || !saved) {
//            console.log('nuke fail');
//            res.send("nuke fail");
//        } else {
//            console.log('nuked');
//            res.send("nuked");
//        }
//    });
// });

app.post('/score', checkAppID, requiredAuthentication, function (req, res) {
    console.log("tryna post scores");

    scorePost = req.body;
    scorePost.scoreInt = parseInt(req.body.scoreInt);
    // scorePost.scoreMode = parseInt(req.body.scoreMode);
    scorePost.requesterHost = req.headers.host;
    scorePost.remoteAddress = req.connection.remoteAddress;
    scorePost.scoreTimestamp = parseInt(req.body.scoreTimestamp);
    console.log("tryna post score: " + JSON.stringify(scorePost));
    db.scores.save(scorePost, function (err, saved) {
        if ( err || !saved ) {
            console.log('score not saved..');
            res.send("nilch");
        } else {
            var item_id = saved._id.toString();
            console.log('new score id: ' + item_id);
            res.send(item_id);
        }
    });
});
app.get('/scores/:appid/:sceneID/:scoreMode', function (req, res) { //tight

    let appid = req.params.appid.toString().replace(":", "");
    let sceneID = req.params.sceneID;
    let scoreMode = req.params.scoreMode;
    let html = "\n";
    let scores = {};
    let scoresResponse = {};

    db.scores.find({ $or: [ { appID : appid, sceneID : sceneID, scoreMode: scoreMode }, { appID : appid, altSceneID : sceneID, scoreMode: scoreMode } ] }, function (err, scores) {
        if (err || !scores) {
            res.send("error or no scores found " + err );
        } else {
            let culledScores = [];
            scores.forEach(function(score){ //cull all but highest score for each user
                if (culledScores.length > 0) {
                    const index = culledScores.map(e => e.platformUserID).indexOf(score.platformUserID);
                    if (index == -1){
                        culledScores.push(score);
                    } else {
                        if (culledScores[index].scoreInt < score.scoreInt) {
                            culledScores[index] = score;
                        } 
                    }
                } else {
                    culledScores.push(score);
                }
            });
            scoresResponse.scores = culledScores;
            res.send(scoresResponse);
        }
    });
});

app.get('/totalscores_aka/:appid', function (req, res) { //does not use userID, but the "aka" name from "guest" players

    var appid = req.params.appid.toString().replace(":", "");

    // console.log("tryna get total user scores for app: " + appid);

    var scoresResponse = {};
    var appScores = {};
    if (appid != undefined && appid != "") {
    async.waterfall([

            function (callback) { //get all scores for this app
                db.scores.find({appID : appid}, function(err, scores) {
                    if (err || !scores) {
                        console.log("cain't get no scores... " + err);
                        callback(err);
                    } else {

                        appScores = scores;
                        // console.log("scores: " + JSON.stringify(appScores));
                        callback(null, scores);
                    }

                });
            }, //pull unique userIDs
            function (userScores, callback) {
                var items = userScores;
                var uids = [];
                var lookup = {};
                for (var item, i = 0; item = items[i++];) {
                    var uid = item.aka; //use the "aka" username
                    if (!(uid in lookup)) {
                        lookup[uid] = 1;
                        uids.push(uid);
                    }
                }
                // console.log(JSON.stringify(uids));
                callback(null, userScores, uids);
            }, //loop through again to aggregate scores for each user
            function (scores, uids, callback) { //aggregate
                var totalscores = [];
                async.each (uids, function (uid, callbackz) {
                    var uscores = {};
                    var scoretemp = 0;
                    for (var entry in appScores) {
                        if (uid == appScores[entry].aka) {
                            scoretemp = scoretemp + parseInt(appScores[entry].scoreInt);
                        }
                    }
                    uscores.scoreName = uid;
                    uscores.scoreTotal = scoretemp;
                    totalscores.push(uscores);

                    callbackz();
                }, function(err) {
                   
                    if (err) {
                        console.log('A file failed to process');
                        callbackz(err);
                    } else {
                        console.log('All files have been processed successfully');
                        callback(null, totalscores);
                    }
                });
            }, function (totalscores, callback) { //sort descending by scoreTotal
                totalscores.sort((a, b) => (a.scoreTotal < b.scoreTotal) ? 1 : -1);
                callback(null, totalscores);
            }, function (totalscores, callback) { //inject rank
                // console.log("tryna rank totalscores " + JSON.stringify(totalscores));
                for (var i = 0; i < totalscores.length; i++) {
                    totalscores[i].rank = i + 1;
                }
                callback(null, totalscores);
            }
        ], //end of async.waterfall
        function (err, result) { // #last function, close async
            scoresResponse.totalscores = result;
            res.json(scoresResponse);
            console.log("totalscore waterfall done");
        })
    } else {
        console.log("appid undefined or empty");
        res.send("no app id!");
    } 
});

app.get('/totalscores/:appid', function (req, res) {

    var appid = req.params.appid.toString().replace(":", "");

    console.log("tryna get total user scores for app: " + appid);

    var scoresResponse = {};
    var appScores = {};

    async.waterfall([

            function (callback) { //get all scores for this app
                db.scores.find({appID : appid}, function(err, scores) {
                    if (err || !scores) {
                        console.log("cain't get no scores... " + err);
                        callback(err);
                    } else {

                        appScores = scores;
                        // console.log("scores: " + JSON.stringify(appScores));
                        callback(null, scores);
                    }

                });
            }, //pull unique userIDs
            function (userScores, callback) {
                var items = userScores;
                var uids = [];
                var lookup = {};
                for (var item, i = 0; item = items[i++];) {
                    var uid = item.userID;
                    if (!(uid in lookup)) {
                        lookup[uid] = 1;
                        uids.push(uid);
                    }
                }
                console.log(JSON.stringify(uids));
                callback(null, userScores, uids);
            }, //loop through again to aggregate scores for each user
            function (scores, uids, callback) {
                var totalscores = [];
                async.each (uids, function (uid, callbackz) {
                    var uscores = {};
                    var scoretemp = 0;
                    for (var entry in appScores) {
                        if (uid == appScores[entry].userID) {
                            scoretemp = scoretemp + parseInt(appScores[entry].score);
                        }
                    }
                    uscores.user = uid;
                    uscores.scoreTotal = scoretemp;
                    totalscores.push(uscores);
                    callbackz();
                }, function(err) {
                   
                    if (err) {
                        console.log('A file failed to process');
                        callbackz(err);
                    } else {
                        console.log('All scores have been processed successfully');
                        scoresResponse.topscores = topscores;
                        callback(null);
                    }
                });
            }

        ], //end of async.waterfall
        function (err, result) { // #last function, close async
            res.json(scoresResponse);
            console.log("waterfall done: " + result);
        })
});
// app.get()

app.get('/topscores/:appid', function (req, res) { //whynotmakeitpublic

    console.log("tryna get scores for: " + req.params.appid);
    //var _id = ObjectID(req.params.u_id);
    var appid = req.params.appid.toString().replace(":", "");
    // console.log("tryna get scores for: " + appid);
    // db.scores.find({appID : appid}, { userName: 1, scoreType: 1, aka: 1, scoreTimestamp: 1, scoreInt: 1, _id:0 }, function(err, scores) {
        db.scores.find({appID : appid}, function(err, scores) {    
        if (err || !scores) {
            console.log("cain't get no scores... " + err);
        } else {
        //    console.log(JSON.stringify(scores));
            var scoresResponse = {};
            // scores.sort(function(a, b) {
            //     return b.scoreInt - a.scoreInt;
            // });
            // console.log("scores : " + JSON.stringify(scores) );
            scoresResponse.scores = scores;
            res.json(scoresResponse);
        }
    });
});

app.get('/scores/:u_id',  checkAppID, requiredAuthentication, function (req, res) {

    console.log("tryna get scores for: ", req.params.u_id);
    //var _id = ObjectID(req.params.u_id);
    var appid = req.headers.appid.toString().replace(":", "");
    db.scores.find({$and : [{userID : req.params.u_id}, {appID : appid}]}, function(err, scores) {
        if (err || !scores) {
            console.log("cain't get no scores... " + err);
        } else {
//            console.log(JSON.stringify(scores));
            var scoresResponse = {};

            scoresResponse.scores = scores;
            res.json(scoresResponse);
        }
    });
});

app.get('/get_available_storeitems/:app_id', checkAppID, requiredAuthentication, admin, function (req, res) { //OPEN FOR TESTING, lock down for prod!

    console.log("tryna get storeitems for: ", req.params.app_id);
    //var _id = ObjectID(req.params.u_id);
    // var appid = req.headers.appid.toString().replace(":", "");
    db.storeitems.find({appID : req.params.app_id, itemStatus: "Available"}, function(err, storeitems) {
        if (err || !storeitems) {
            console.log("cain't get no storeitems... " + err);
        } else {
//            console.log(JSON.stringify(scores));
            var storeitemsResponse = {};
            
            async.each (storeitems, function (storeitem, callbackz) {
                var storeItemPictures = [];
                // console.log("storeitem.storeItemPictureIDs " + JSON.stringify(storeitem.storeItemPictureIDs ));
                if (storeitem.storeItemPictureIDs != null && storeitem.storeItemPictureIDs != undefined && storeitem.storeItemPictureIDs.length > 0) {
                    // oids = storeitem.storeItemPictureIDs.map(ObjectID()); //convert to mongo object ids for searching
                    const oids = storeitem.storeItemPictureIDs.map(item => {
                        return ObjectID(item);
                    })
                    db.image_items.find({_id: {$in: oids }}, function (err, pic_items) {
                        if (err || !pic_items) {
                            callbackz();
                            console.log("error getting picture items: " + err);
                        } else {
                            async.each (pic_items, function (picture_item, pcallbackz) {
                                // console.log("gotsa picture item for store item: " + JSON.stringify(picture_item));
                                var imageItem = {};
                                var urlThumb = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".thumb." + picture_item.filename, Expires: 6000});
                                // var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".half." + picture_item.filename, Expires: 6000});
                                // var urlStandard = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".standard." + picture_item.filename, Expires: 6000});
                                imageItem.urlThumb = urlThumb;
                                // imageItem.urlHalf = urlHalf;
                                // imageItem.urlStandard = urlStandard;
                                imageItem._id = picture_item._id;
                                imageItem.filename = picture_item.filename;
                                storeItemPictures.push(imageItem);
                                pcallbackz();
                            }, function(err) {
                               
                                if (err) {
                                    console.log('A storeitem image failed to process');
                                    callbackz(err);
                                } else {
                                    console.log('Added images to storeitem successfully');
                                    // pcallbackz();
                                    storeitem.storeItemPictures = storeItemPictures;
                                    callbackz();
                                }
                            });
                           
                        }
                    });
                } else {
                    callbackz();
                } 
            }, function(err) {
               
                if (err) {
                    console.log('A file failed to process');
                    // callbackz(err);
                    res.send("error: " + err);
                } else {
                    console.log('All files have been processed successfully');
                    // scoresResponse.topscores = topscores;
                    // callback(null);
                    storeitemsResponse.storeitems = storeitems;
                    res.json(storeitemsResponse);  
                }
            });

        }
    });
});

app.get('/get_storeitems_all/',  requiredAuthentication, admin, function (req, res) {

    console.log("tryna get all the storeitems");
    var _id = ObjectID(req.params.app_id);

    // var appid = req.headers.appid.toString().replace(":", "");
    db.storeitems.find({}, function(err, storeitems) {
        if (err || !storeitems) {
            console.log("cain't get no storeitems... " + err);
        } else {
//            console.log(JSON.stringify(scores));
            var storeitemsResponse = {};
            
            async.each (storeitems, function (storeitem, callbackz) {
                var storeItemPictures = [];
                if (storeitem.lastUpdateTimestamp === null || storeitem.lastUpdateTimestamp === undefined) {
                    if (storeitem.itemCreateDate != null && storeitem.itemCreateDate != undefined) {
                        storeitem.lastUpdateTimestamp = storeitem.itemCreateDate;
                    }
                }
                // console.log("storeitem.storeItemPictureIDs " + JSON.stringify(storeitem.storeItemPictureIDs ));
                if (storeitem.storeItemPictureIDs != null && storeitem.storeItemPictureIDs != undefined && storeitem.storeItemPictureIDs.length > 0) {
                    // oids = storeitem.storeItemPictureIDs.map(ObjectID()); //convert to mongo object ids for searching
                    const oids = storeitem.storeItemPictureIDs.map(item => {
                        return ObjectID(item);
                    })
                    db.image_items.find({_id: {$in: oids }}, function (err, pic_items) {
                        if (err || !pic_items) {
                            callbackz();
                            console.log("error getting picture items: " + err);
                        } else {
                            async.each (pic_items, function (picture_item, pcallbackz) {
                                // console.log("gotsa picture item for store item: " + JSON.stringify(picture_item));
                                var imageItem = {};
                                var urlThumb = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".thumb." + picture_item.filename, Expires: 6000});
                                // var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".half." + picture_item.filename, Expires: 6000});
                                // var urlStandard = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".standard." + picture_item.filename, Expires: 6000});
                                imageItem.urlThumb = urlThumb;
                                // imageItem.urlHalf = urlHalf;
                                // imageItem.urlStandard = urlStandard;
                                imageItem._id = picture_item._id;
                                imageItem.filename = picture_item.filename;
                                storeItemPictures.push(imageItem);
                                pcallbackz();
                            }, function(err) {
                               
                                if (err) {
                                    console.log('A storeitem image failed to process');
                                    callbackz(err);
                                } else {
                                    console.log('Added images to storeitem successfully');
                                    // pcallbackz();
                                    storeitem.storeItemPictures = storeItemPictures;
                                    callbackz();
                                }
                            });
                           
                        }
                    });
                } else {
                    callbackz();
                } 
            }, function(err) {
               
                if (err) {
                    console.log('A file failed to process');
                    // callbackz(err);
                    res.send("error: " + err);
                } else {
                    console.log('All files have been processed successfully');
                    // scoresResponse.topscores = topscores;
                    // callback(null);
                    storeitemsResponse.storeitems = storeitems;
                    res.json(storeitemsResponse);  
                }
            });

        }
    });
});

app.get('/get_storeitems/:app_id', requiredAuthentication, admin, function (req, res) {

    console.log("tryna get storeitems for: ", req.params.app_id);
    var _id = ObjectID(req.params.app_id);

    // var appid = req.headers.appid.toString().replace(":", "");
    db.storeitems.find({appID : _id}, function(err, storeitems) {
        if (err || !storeitems) {
            console.log("cain't get no storeitems... " + err);
        } else {
//            console.log(JSON.stringify(scores));
            var storeitemsResponse = {};
            
            async.each (storeitems, function (storeitem, callbackz) {
                var storeItemPictures = [];
                if (storeitem.lastUpdateTimestamp === null || storeitem.lastUpdateTimestamp === undefined) {
                    if (storeitem.itemCreateDate != null && storeitem.itemCreateDate != undefined) {
                        storeitem.lastUpdateTimestamp = storeitem.itemCreateDate;
                    }
                }
                // console.log("storeitem.storeItemPictureIDs " + JSON.stringify(storeitem.storeItemPictureIDs ));
                if (storeitem.storeItemPictureIDs != null && storeitem.storeItemPictureIDs != undefined && storeitem.storeItemPictureIDs.length > 0) {
                    // oids = storeitem.storeItemPictureIDs.map(ObjectID()); //convert to mongo object ids for searching
                    const oids = storeitem.storeItemPictureIDs.map(item => {
                        return ObjectID(item);
                    })
                    db.image_items.find({_id: {$in: oids }}, function (err, pic_items) {
                        if (err || !pic_items) {
                            callbackz();
                            console.log("error getting picture items: " + err);
                        } else {
                            async.each (pic_items, function (picture_item, pcallbackz) {
                                // console.log("gotsa picture item for store item: " + JSON.stringify(picture_item));
                                var imageItem = {};
                                var urlThumb = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".thumb." + picture_item.filename, Expires: 6000});
                                // var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".half." + picture_item.filename, Expires: 6000});
                                // var urlStandard = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".standard." + picture_item.filename, Expires: 6000});
                                imageItem.urlThumb = urlThumb;
                                // imageItem.urlHalf = urlHalf;
                                // imageItem.urlStandard = urlStandard;
                                imageItem._id = picture_item._id;
                                imageItem.filename = picture_item.filename;
                                storeItemPictures.push(imageItem);
                                pcallbackz();
                            }, function(err) {
                               
                                if (err) {
                                    console.log('A storeitem image failed to process');
                                    callbackz(err);
                                } else {
                                    console.log('Added images to storeitem successfully');
                                    // pcallbackz();
                                    storeitem.storeItemPictures = storeItemPictures;
                                    callbackz();
                                }
                            });
                           
                        }
                    });
                } else {
                    callbackz();
                } 
            }, function(err) {
               
                if (err) {
                    console.log('A file failed to process');
                    // callbackz(err);
                    res.send("error: " + err);
                } else {
                    console.log('All files have been processed successfully');
                    // scoresResponse.topscores = topscores;
                    // callback(null);
                    storeitemsResponse.storeitems = storeitems;
                    res.json(storeitemsResponse);  
                }
            });
        }
    });
});

app.get('/get_storeitem/:_id',  requiredAuthentication, admin, function (req, res) {
    console.log("tryna get storeitem: ", req.params._id);
    var item_id = ObjectID(req.params._id);
    // var appid = req.headers.appid.toString().replace(":", "");
    db.storeitems.findOne({_id : item_id}, function(err, storeitem) {
        if (err || !storeitem) {
            console.log("cain't get no storeitem... " + err);
        } else {
            if (storeitem.totalSold == null || storeitem.totalSold == undefined) {
                storeitem.totalSold = 0;
            }
            console.log(JSON.stringify(storeitem));
            async.waterfall([
                function (callback) { // check for groups to which this purchase provides access
                    if (storeitem.storeItemSceneGroupIDs != null && storeitem.storeItemSceneGroupIDs != undefined && storeitem.storeItemSceneGroupIDs.length > 0) {
                        const g_oids = storeitem.storeItemSceneGroupIDs.map(item => {
                            return ObjectID(item);
                        });
                        db.groups.find({_id: {$in: g_oids }}, function (err, groups) {
                            if (err || !groups) {
                                console.log("error getting grupe items: " + err);
                                callback(err);
                                // res.send("error: " + err);
                            } else {
                                storeitem.storeItemAccessGroups = groups;
                                console.log("store item goups: " + JSON.stringify(groups));
                                callback();
                            }
                        });
                    } else {
                        callback();
                    }
                }, 
                function (callback) { //pics for this store item
                    if (storeitem.storeItemPictureIDs != null && storeitem.storeItemPictureIDs != undefined && storeitem.storeItemPictureIDs.length > 0) {
                        // oids = storeitem.storeItemPictureIDs.map(ObjectID()); //convert to mongo object ids for searching
                        const oids = storeitem.storeItemPictureIDs.map(item => {
                            return ObjectID(item);
                        });
                        db.image_items.find({_id: {$in: oids }}, function (err, pic_items) {
                            if (err || !pic_items) {
                                console.log("error getting picture items: " + err);
                                // res.send("error: " + err);
                                callback(err);
                            } else {
                                storeItemPictures = [];
                                pic_items.forEach(function(picture_item){                
                                    var imageItem = {};
                                    var urlThumb = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".thumb." + picture_item.filename, Expires: 6000});
                                    var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".half." + picture_item.filename, Expires: 6000});
                                    var urlStandard = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".standard." + picture_item.filename, Expires: 6000});
                                    imageItem.urlThumb = urlThumb;
                                    imageItem.urlHalf = urlHalf;
                                    imageItem.urlStandard = urlStandard;
                                    imageItem._id = picture_item._id;
                                    imageItem.filename = picture_item.filename;
                                    storeItemPictures.push(imageItem);
                                    storeitem.storeItemPictures = storeItemPictures;
                                });
                                callback();
                                // res.json(storeitem);
                            }
                        });
                    } else {
                        callback();
                    }
                }
            ], //end of async.waterfall
            function (err, result) { // #last function, close async
                if (!err) {
                    console.log("returning storeintem: " + storeitem);
                    res.json(storeitem);
                    // 
                } else {
                    console.log("err: " + err);
                    res.send(err);
                }

            });

        }
    });
});
app.post('/set_storeitem', checkAppID, requiredAuthentication, admin, function (req, res) {
    console.log("tryna save storeitem : " + JSON.stringify(req.body));
    let storeitem = req.body;
    let timestamp = Math.round(Date.now() / 1000);
    storeitem.createdTimestamp = timestamp;
    storeitem.createdByUserID = req.session.user._id;
    storeitem.createdByUserName = req.session.userName;
    db.storeitems.save(storeitem, function (err, saved) {
        if ( err || !saved ) {
            console.log('purchaseable not saved..');
            res.send("nilch");
        } else {
            var item_id = saved._id.toString();
            // console.log('new purchaseable id: ' + item_id);
            res.send("created");
        }
    });
});

// app.get('/delete_store_items_man/:appid', function (req, res) {
//     if (req.params.appid.length > 10) {
//         db.storeitems.remove({});
//         res.send("all storeitems have been removed");
//     }
// });
// app.post('/import_storeitems', requiredAuthentication, function (req, res) {
//     console.log("tryna import storeitems for : " + req.body.appid);
    
//     let storeItemsData = req.body.storeitems;
//     async.each (storeItemsData, function (storeItem, pcallbackz) {
//         // console.log(JSON.stringify(storeItem));
//         let storeItemMod = {
//             appID: req.body.appid,
//             itemType: "Wearable",
//             itemSubType: storeItem.wearableType,
//             itemStatus: "Testing",
//             itemName: storeItem.name,
//             itemDisplayName: storeItem.displayName,
//             itemAltName: storeItem.archetype,
//             itemCreateDate: Math.round(Date.now() / 1000),
//             itemCreatedByUserName: req.session.user.userName,
//             itemCreatedByUserID: req.session.user._id,
//             maxPerUser: 1,
//             maxTotal: 10,
//             totalUsed: 0,
//             itemTags: storeItem.tags
            
//         }

//         delete storeItem['wearableType'];
//         delete storeItem['name'];
//         delete storeItem['archetype'];
//         delete storeItem['displayName'];
//         delete storeItem['tags'];
//         storeItemMod.jsonAttributes = storeItem;
       

//         db.storeitems.save(storeItemMod, function (err, saved) {
//             if ( err || !saved ) {
//                 console.log('store item not saved..');
//                 // res.send("nilch");
//                 pcallbackz();
//             } else {
//                 // var item_id = saved._id.toString();
//                 console.log('new storeitem id: ' + saved._id);
//                 // console.log(JSON.stringify(storeItemMod));
//                 pcallbackz();
//                 // res.send("created");
//             }
//         });
//     }, function(err) {
//        
//         if (err) {
//             console.log('prollem importing store item');
            
//         } else {
//             console.log('imported a bunch of storeitems successfully');
//             // pcallbackz();
//             // storeitem.storeItemPictures = storeItemPictures;
            
//         }
//     });
// });
app.post('/update_storeitem/', checkAppID, requiredAuthentication, admin, function (req, res) {
    console.log("tryna save storeitem : " + JSON.stringify(req.body));
    var o_id = ObjectID(req.body._id);
    var timestamp = Math.round(Date.now() / 1000);
    db.storeitems.findOne({_id: o_id}, function (err, item) {
        if ( err || !item) {
            console.log('item not found..');
            res.send("nilch");
        } else {
            db.storeitems.update( { _id: o_id }, { $set: {
                itemName: req.body.itemName,
                itemDisplayName: req.body.itemDisplayName,
                itemAltName: req.body.itemAltName,
                itemStatus: req.body.itemStatus,
                itemType: req.body.itemType,
                itemSubType: req.body.itemSubType,
                useGameCurrency: req.body.useGameCurrency,
                itemPrice: req.body.itemPrice,
                itemDescription: req.body.itemDescription,
                tags: req.body.tags,
                itemAttributes: req.body.itemAttributes,
                maxPerUser: req.body.maxPerUser,
                maxTotal: req.body.maxTotal,
                displayAssetURL: req.body.displayAssetURL,
                storeItemPictureIDs: req.body.storeItemPictureIDs,
                lastUpdateTimestamp: timestamp
            }});   
            res.send("updated");
        }
    });
});
app.post('/delete_storeitem/', requiredAuthentication, admin, function (req, res) {
    console.log("tryna delete key: " + req.body._id);
    var o_id = ObjectID(req.body._id);
    db.storeitems.remove( { "_id" : o_id }, 1 );
    res.send("deleted");
});
app.post('/purchase', checkAppID, requiredAuthentication, function (req, res) {
    console.log("tryna post purchase: " + JSON.stringify(req.body));

    var _id = ObjectID(req.body.userID);
    var obody = req.body;
    db.users.findOne({"_id" : _id}, function (err, user) {
        if (err || !user) {
            console.log("error getting user: " + err);
            res.send("error " + err);
        } else {
            var userEmail = user.email;
            console.log("tryna charge " + userEmail);
            obody.userEmail = userEmail;
            if (user.stripeCustomerID != null) {
                stripe.charges.create({
                    amount: 1500, // $15.00 this time
                    currency: "usd",
                    customer: user.stripeCustomerID,
                    receipt_email: userEmail,
                    description: req.body.purchaseDescription,

                }).then(function(charge){
                    console.log(JSON.stringify(charge));
                    obody.stripeToken = charge;
                    db.purchases.save(obody, function (err, saved) {
                        if ( err || !saved ) {
                            console.log('purchase not saved..');
                            res.send("nilch");
                        } else {
                            var item_id = saved._id.toString();
                            console.log('new purchase id: ' + item_id);
                            res.send("purchase id: " + item_id + " charged " + JSON.stringify(charge));
                        }
                    });
                });
            } else {
                console.log("no customer id!");
                res.send("no id");
            }
        }
    });
});

app.post('/testpurchase', checkAppID, requiredAuthentication, function (req, res) {
    console.log("tryna post test purchase: " + JSON.stringify(req.body));
    let _id = ObjectID(req.body.userID);
    let storeitemID = ObjectID(req.body.storeitemID);
    let obody = req.body;
    
    db.users.findOne({"_id" : _id}, function (err, user) {// check user
        if (err || !user) {
            console.log("error getting user: " + err);
            res.send("error " + err);
        } else {
            db.storeitems.findOne({"_id" : storeitemID}, function (err, storeitem){ //check store item
                if (err || !storeitem) {
                    console.log("no store item error " + err);
                    res.send("error " + err);
                } else {
                    let usertotal = 0;
                    db.purchases.find({userID: req.body.userID, storeitemID: req.body.storeitemID}, function (err, purchases) { //check user's previous purchases of this item doesn't exceed maxPerUser
                        if (err) {
                            console.log("error! " + err);
                        } else {

                            for (let i = 0; i < purchases.length; i++) {
                                let quantity = (purchases[i].quantity != null) ? purchases[i].quantity : 1;
                                usertotal += quantity;
                            }
                            if (usertotal >= storeitem.maxPerUser) {
                                console.log("maxPerUser exceeded!");
                                res.send("this user can't buy more of these!");
                            } else {
                                console.log("checking inventory totalSold == " + total + " maxTotal ==  " + storeitem.maxTotal );
                                if (storeitem.maxTotal == 0 || total < storeitem.maxTotal) { //check maxTotal
                                    var userEmail = user.email;
                                    console.log("tryna charge " + userEmail);
                                    obody.userEmail = userEmail;
                                    obody.purchaseStatus = "Test Purchase"
                                    if (obody.quantity == null) {
                                        obody.quantity = 1;
                                    }
                                    // if (obody.quantity < storeitem.maxPerUser) {
                                    db.purchases.save(obody, function (err, saved) {
                                        if ( err || !saved ) {
                                            console.log('purchase not saved..');
                                            res.send("purchase failed");
                                        } else {
                                            var item_id = saved._id.toString();
                                            console.log('new purchase id: ' + item_id);
                                            db.storeitems.update( { "_id": storeitemID },{ $inc: { totalSold: obody.quantity }});
                                            var htmlbody = "Thanks for your Purchase: " + JSON.stringify(saved);
                                            ses.sendEmail( {
                                                Source: adminEmail,
                                                Destination: { ToAddresses: [userEmail]},
                                                Message: {
                                                    Subject: {
                                                        Data: "Your Purchase"
                                                    },
                                                    Body: {
                                                        Html: {
                                                            Data: htmlbody
                                                        }
                                                    }
                                                }
                                            }
                                            , function(err, data) {
                                                if(err) throw err
                                                console.log('Email sent:');
                                                console.log(data);
                                               
                                            });
                                            res.send("purchase id: " + item_id + " charged " + saved.price);
                                        }
                                    });
                                } else {
                                    console.log("Sold Out!")
                                    res.send("that item is sold out");
                                }
                            }
                        }
                    }); //check user's purchases for this item
                    let total = 0;
                    if (storeitem.totalSold != null) {
                        total = storeitem.totalSold;
                    }

                } 
            }); 

        }
    });
});
app.get('/purchases/', requiredAuthentication, admin, function (req, res) { //all the things..

    console.log("tryna get all purchases! ");

    db.purchases.find({}, function(err, purchases) {
        if (err || !purchases || purchases == null || purchases.length == 0) {
            console.log("cain't get no purchases... ");
            res.send("no purchases");
        } else {
//            console.log(JSON.stringify(scores));
            var purchasesResponse = {};
            purchasesResponse.purchases = purchases;
            res.json(purchasesResponse);
        }
    });
});

app.get('/purchases/:app_id/:u_id',  requiredAuthentication, function (req, res) {

    console.log("tryna get purchases for: ", req.params.u_id + " " + req.params.app_id);
    //var _id = ObjectID(req.params.u_id);
    // var appid = req.headers.appid.toString().replace(":", "");
    db.purchases.find({$and : [{userID : req.params.u_id}, {appID : req.params.app_id}]}, function(err, purchases) {
        if (err || !purchases || purchases == null || purchases.length == 0) {
            console.log("cain't get no purchases... ");
            res.send("no purchases");
        } else {
//            console.log(JSON.stringify(scores));
            var purchasesResponse = {};
            purchasesResponse.purchases = purchases;
            res.json(purchasesResponse);
        }
    });
});

app.get('/purchases/:app_id',  checkAppID, requiredAuthentication, function (req, res) {

    console.log("tryna get purchases for appid: " + req.params.app_id);
    //var _id = ObjectID(req.params.u_id);
    // var appid = req.headers.appid.toString().replace(":", "");
    db.purchases.find({appID : req.params.app_id}, function(err, purchases) {
        if (err || !purchases || purchases == null || purchases.length == 0) {
            console.log("cain't get no purchases... ");
            res.send("no purchases");
        } else {
            var purchasesResponse = {};
            purchasesResponse.purchases = purchases;
            res.json(purchasesResponse);
        }
    });
});
app.post('/activity', requiredAuthentication, function (req, res) {
    console.log("tryna post activity");
    db.activity.save(req.body, function (err, saved) {
        if ( err || !saved ) {
            console.log('activity not saved..');
            res.send("nilch");
        } else {
            var item_id = saved._id.toString();
            console.log('new score id: ' + item_id);
            res.send(item_id);
        }
    });
});

app.get('/activities/:u_id',  checkAppID, requiredAuthentication, function (req, res) {

    console.log("tryna get activities for: ", req.params.u_id);
    //var _id = ObjectID(req.params.u_id);
    var appid = req.headers.appid.toString().replace(":", "");
    db.activity.find({$and : [{userID : req.params.u_id}, {appID : appid}]}, function(err, activities) {
        if (err || !activities) {
            console.log("cain't get no activities... " + err);
            res.send(err);
        } else {
            console.log(JSON.stringify(activities));
            var activitiesResponse = {};
            activitiesResponse.activities = activities;
            res.json(activitiesResponse);
        }
    });
});


app.get('/activitytotals/:appid', function (req, res) {

    var appid = req.params.appid.toString().replace(":", "");

    console.log("tryna get total user activities for app: " + appid);

    var scoresResponse = {};
    var appScores = {};

    async.waterfall([

            function (callback) { //get all scores for this app
                db.scores.find({appID : appid}, function(err, activities) {
                    if (err || !scores) {
                        console.log("cain't get no scores... " + err);
                        callback(err);
                    } else {

                        appScores = scores;
                        console.log("scores: " + JSON.stringify(appScores));
                        callback(null, scores);
                    }

                });
            }, //pull unique userIDs
            function (userScores, callback) {
                var items = userScores;
                var uids = [];
                var lookup = {};
                for (var item, i = 0; item = items[i++];) {
                    var uid = item.userID;
                    if (!(uid in lookup)) {
                        lookup[uid] = 1;
                        uids.push(uid);
                    }
                }
                console.log(JSON.stringify(uids));
                callback(null, userScores, uids);
            }, //loop through again to aggregate scores for each user
            function (scores, uids, callback) {
                var totalscores = [];
                async.each (uids, function (uid, callbackz) {
                    var uscores = {};
                    var scoretemp = 0;
                    for (var entry in appScores) {
                        if (uid == appScores[entry].userID) {
                            scoretemp = scoretemp + parseInt(appScores[entry].score);
                        }
                    }
                    uscores.user = uid;
                    uscores.scoreTotal = scoretemp;
                    totalscores.push(uscores);
                    callbackz();
                }, function(err) {
                   
                    if (err) {
                        console.log('A file failed to process');
                        callbackz(err);
                    } else {
                        console.log('All files have been processed successfully');
                        scoresResponse.topscores = topscores;
                        callback(null);
                    }
                });
            }

        ], //end of async.waterfall
        function (err, result) { // #last function, close async
            res.json(scoresResponse);
            console.log("waterfall done: " + result);
        })
});

app.post('/newpath', checkAppID, requiredAuthentication, function (req, res) {

    db.paths.save(req.body, function (err, saved) {
        if ( err || !saved ) {
            console.log('path not saved..');
            res.send("nilch");
        } else {
            var item_id = saved._id.toString();
            console.log('new path id: ' + item_id);
            res.send(item_id);

        }
    });

});

app.post('/update_path/:_id', checkAppID, requiredAuthentication, function (req, res) {
    console.log(req.params._id);

    var o_id = ObjectID(req.body._id);   
    console.log('path requested : ' + req.body._id);
    db.paths.find({ "_id" : o_id}, function(err, path) {
        if (err || !path) {
            console.log("error getting path items: " + err);
        } else {
            console.log("tryna update path " + req.body._id);
            db.paths.update( { "_id": o_id }, { $set: {

                pathUserID : req.body.user_id,
                pathNumber : req.body.pathNumber,
                pathTitle : req.body.pathTitle,
                pathMeaning : req.body.pathMeaning,
                pathAttribution : req.body.pathAttribution,
                pathColor1 : req.body.pathColor1,
                pathColor2 : req.body.pathColor2,

                pathMapPictureID : req.body.pathMapPictureID,
                pathPictureID : req.body.pathPictureID,
                pathArcanumNumber : req.body.pathArcanumNumber,
                pathArcanumTitle : req.body.pathArcanumTitle,
                pathArcanumPictureID : req.body.pathArcanumPictureID,
                pathTriggerAudioID : req.body.pathTriggerAudioID,
                pathSpokenAudioID : req.body.pathSpokenAudioID,
                pathBackgroundAudioID : req.body.pathBackgroundAudioID,
                pathEnvironmentAudioID : req.body.pathEnvironmentAudioID,
                pathKeynote : req.body.pathKeynote,
                pathDescription : req.body.pathDescription,
                pathText : req.body.pathText}
            });
        } if (err) {res.send(error)} else {res.send("updated " + new Date())}
    });
});

///////////////
app.get('/sceneinfo',  checkAppID, requiredAuthentication, function (req, res) { //get default scene info

    console.log(req.params._id);
    var o_id = ObjectID(req.params._id);
    db.scenes.find({}, function(err, scenes) {
        if (err || !scenes) {
            console.log("cain't get no paths... " + err);
        } else {
            console.log(JSON.stringify(scenes));
            res.json(scenes);
        }
    });
});

app.post('/add_scene_group/', requiredAuthentication, function (req, res) {

    let s_id = ObjectID(req.body.scene_id);   
    let g_id = ObjectID(req.body.group_id);   
    // let audiotype
    console.log('tryna add a scene pic : ' + req.body);

    db.scenes.findOne({ "_id": s_id}, function (err, scene) {
        if (err || !scene) {
            console.log("error getting sceneert 4: " + err);
        } else {
            db.groups.findOne({ "_id": g_id}, function (err, group) {
                if (err || !group) {
                    console.log("error getting image items 4: " + err);
                } else {
                    if (req.body.grouptype.toLowerCase().includes('picture')) {
                    var scenePictureGroups = scene.scenePictureGroups || new Array();
                    console.log("tryna add pic group to scene: " + s_id);
                        if (scenePictureGroups.indexOf(req.body.group_id) > -1) {
                            console.log("redundant group id");
                        } else {
                            scenePictureGroups.push(req.body.group_id);
                            db.scenes.update({ "_id": s_id }, { $set: {scenePictureGroups: scenePictureGroups}});
                        }

                    } else  if (req.body.grouptype == 'audio') {
                        var sceneAudioGroups = scene.sceneAudioGroups || new Array();
                        console.log("tryna add audio group to scene: " + s_id);
                        if (sceneAudioGroups.indexOf(req.body.group_id) > -1) {
                            console.log("redundant group id");
                        } else {
                            sceneAudioGroups.push(req.body.group_id);
                            db.scenes.update({ "_id": s_id }, { $set: {sceneAudioGroups: sceneAudioGroups}});
                            
                        }
                    } else  if (req.body.grouptype == 'paudio') {
                            let scenePrimaryAudioGroups = scene.scenePrimaryAudioGroups || new Array();
                            console.log("tryna add primary audio group to scene: " + s_id);
                            if (scenePrimaryAudioGroups.indexOf(req.body.group_id) > -1) {
                                console.log("redundant group id");
                            } else {
                                scenePrimaryAudioGroups.push(req.body.group_id);
                                db.scenes.update({ "_id": s_id }, { $set: {scenePrimaryAudioGroups: scenePrimaryAudioGroups}});
                            }
                    } else  if (req.body.grouptype == 'aaudio') {
                        let sceneAmbientAudioGroups = scene.sceneAmbientAudioGroups || new Array();
                        console.log("tryna add ambient audio group to scene: " + s_id);
                        if (sceneAmbientAudioGroups.indexOf(req.body.group_id) > -1) {
                            console.log("redundant group id");
                        } else {
                            sceneAmbientAudioGroups.push(req.body.group_id);
                            db.scenes.update({ "_id": s_id }, { $set: {sceneAmbientAudioGroups: sceneAmbientAudioGroups}});
                        }
                    } else  if (req.body.grouptype == 'taudio') {
                        let sceneTriggerAudioGroups = scene.sceneTriggerAudioGroups || new Array();
                        console.log("tryna add trigger audio group to scene: " + s_id);
                        if (sceneTriggerAudioGroups.indexOf(req.body.group_id) > -1) {
                            console.log("redundant group id");
                        } else {
                            sceneTriggerAudioGroups.push(req.body.group_id);
                            db.scenes.update({ "_id": s_id }, { $set: {sceneTriggerAudioGroups: sceneTriggerAudioGroups}});
                        }            
                    } else if (req.body.grouptype == 'text') {
                        var sceneTextGroups = scene.sceneTextGroups || new Array();
                        console.log("tryna add video group to scene: " + s_id);
                        if (sceneTextGroups.indexOf(req.body.group_id) > -1) {
                            console.log("redundant group id");
                        } else {
                            sceneTextGroups.push(req.body.group_id);
                            db.scenes.update({ "_id": s_id }, { $set: {sceneTextGroups: sceneTextGroups}});
                        }

                    } else if (req.body.grouptype == 'object') {
                        var sceneObjectGroups = scene.sceneObjectGroups || new Array();
                        console.log("tryna add object group to scene: " + s_id);
                        if (sceneObjectGroups.indexOf(req.body.group_id) > -1) {
                            console.log("redundant group id");
                        } else {
                            sceneObjectGroups.push(req.body.group_id);
                            db.scenes.update({ "_id": s_id }, { $set: {sceneObjectGroups: sceneObjectGroups}});
                        }

                    } else if (req.body.grouptype == 'video') {
                        var sceneVideoGroups = scene.sceneVideoGroups || new Array();
                        console.log("tryna add location group to scene: " + s_id);
                        if (sceneVideoGroups.indexOf(req.body.group_id) > -1) {
                            console.log("redundant group id");
                        } else {
                            sceneVideoGroups.push(req.body.group_id);
                            db.scenes.update({ "_id": s_id }, { $set: {sceneVideoGroups: sceneVideoGroups}});
                        }
                    } else if (req.body.grouptype == 'location') {
                        var sceneLocationGroups = scene.sceneLocationGroups || new Array();
                        console.log("tryna add location group to scene: " + s_id);
                        if (sceneLocationGroups.indexOf(req.body.group_id) > -1) {
                            console.log("redundant group id");
                        } else {
                            sceneLocationGroups.push(req.body.group_id);
                            db.scenes.update({ "_id": s_id }, { $set: {sceneLocationGroups: sceneLocationGroups}});
                        }
                    }
                }  if (err) {res.send(error)} else {res.send("updated " + new Date())}
            });
        }
    });
});

app.post('/update_scene_location/', requiredAuthentication, function (req, res) {

    var s_id = ObjectID(req.body.scene_id);   
    // var p_id = ObjectID(req.body.location_id);   
    console.log('tryna add a scene obj : ' + JSON.stringify(req.body));

    db.scenes.findOne({ "_id": s_id}, function (err, scene) {
        if (err || !scene) {
            console.log("error getting sceneert 4 obj: " + err);
            res.send(err);
        } else {

            var sceneLocs = scene.sceneLocations;
            if (sceneLocs == null || !Array.isArray(sceneLocs)) {
                sceneLocs = [];
            }
                // sceneLocs
                    // console.log("tryna add sceneLocations: " + sceneLocations);
                    sceneLocs.push(req.body);
                    res.send(JSON.stringify(sceneLocs));
                    // db.scenes.update({ "_id": s_id }, { $set: {sceneLocations: sceneLocs}});
            }
              
    });
});

app.post('/add_scene_mods/:s_id', requiredAuthentication, admin, function (req, res) {
    if (req.params.s_id == req.body.shortID) {
        
        // console.log(JSON.stringify(req.session.user) + " vs " + JSON.stringify(req.body.userData)); 
        if (req.body.userData._id == req.session.user._id) {
            
            db.scenes.findOne({ "short_id": req.params.s_id}, function (err, scene) {
                if (err || !scene) {
                    console.log("error getting skeen: " + err);
                    res.send(err);
                } else {
                    // console.log("mods for " +req.params.s_id + " " + JSON.stringify(req.body)); 
                    console.log("sceneowner: " + scene.userID);
                    let query = {};
                    if (scene.user_id == req.body.userData._id) { //just scene owner for now

                        console.log("user match for modz with locations " + JSON.stringify(scene.sceneLocations) ); 
                        let query = {};
                        if (req.body.colorMods != null) {
                            let sceneColor1 = req.body.colorMods.sceneColor1 != null ? req.body.colorMods.sceneColor1 : "";
                            let sceneColor2 = req.body.colorMods.sceneColor2 != null ? req.body.colorMods.sceneColor2 : "";
                            let sceneColor3 = req.body.colorMods.sceneColor3 != null ? req.body.colorMods.sceneColor3 : "";
                            let sceneColor4 = req.body.colorMods.sceneColor4 != null ? req.body.colorMods.sceneColor4 : "";
                            query.sceneColor1 = sceneColor1;
                            query.sceneColor2 = sceneColor2;
                            query.sceneColor3 = sceneColor3;    
                            query.sceneColor4 = sceneColor4; 
                        }
                        if (req.body.volumeMods != null) {
                            query.scenePrimaryVolume = req.body.volumeMods.volumePrimary != null ? req.body.volumeMods.volumePrimary : 0;
                            query.sceneAmbientVolume = req.body.volumeMods.volumeAmbient != null ? req.body.volumeMods.volumeAmbient : 0;
                            query.sceneTriggerVolume = req.body.volumeMods.volumeTrigger != null ? req.body.volumeMods.volumeTrigger : 0;
                        }
                        if (req.body.locationMods != null) {
                            for (let l = 0; l < req.body.locationMods.length; l++) {
                                let isMatch = false;
                                for (let i = 0; i < scene.sceneLocations.length; i++) {
                                    if (req.body.locationMods[l].timestamp == scene.sceneLocations[i].timestamp) {
                                        isMatch = true;
                                        console.log("gotsa match with existing location! " + scene.sceneLocations[i].timestamp + " vs " + req.body.locationMods[l].timestamp);
                                        let tsVar = null;
                                        if (Number.isInteger(scene.sceneLocations[i].timestamp)) { // shit happens
                                            tsVar = parseInt(req.body.locationMods[l].timestamp);
                                        } else {
                                            tsVar = req.body.locationMods[l].timestamp.toString();
                                        }
                                        // console.log("timestamp is integer " + Number.isInteger(scene.sceneLocations[i].timestamp));
                                        db.scenes.update(
                                            { 'short_id': req.params.s_id, 'sceneLocations.timestamp': tsVar}, //could either one, ugh
                                            // { 'short_id': req.params.s_id}, {'sceneLocations.timestamp': stringVar},  //could either one, ugh
                                            { $set: { 'sceneLocations.$' : req.body.locationMods[l]} } //replaces whole object in array, uses positional $ operator https://docs.mongodb.com/manual/tutorial/update-documents/#Updating-The%24positionaloperator
                                        )
                                    }
                                }
                                if (!isMatch) {
                                    db.scenes.update(
                                        { 'short_id': req.params.s_id},
                                        { $push: { 'sceneLocations' : req.body.locationMods[l]} } 
                                    )
                                }
                            }
                        } 
                        if (req.body.timedEventMods != null) {
                            console.log("tryna save timed events : " + JSON.stringify(req.body.timedEventMods));
                            query.sceneTimedEvents = req.body.timedEventMods;
                        }
                        db.scenes.update({ '_id': scene._id },
                            { $set:
                                query
                            }
                        );
                        res.send("ok");
                    }
                }
            });
        }
    }
    // let mods = JSON.parse(atob(thestring));
    // let json = JSON.stringify(mods);
    // console.log(json);
    // res.send(json);
    // console.log()
});

app.post('/add_scene_location/', requiredAuthentication, function (req, res) { //pick from "saved" list of location

    var s_id = ObjectID(req.body.scene_id);   
    var p_id = ObjectID(req.body.location_id);   
    console.log('tryna add a scene obj : ' + JSON.stringify(req.body));

    db.scenes.findOne({ "_id": s_id}, function (err, scene) {
        if (err || !scene) {
            console.log("error getting sceneert 4 obj: " + err);
        } else {

            // if (scene.sceneLocations != null && scene.sceneLocations.indexOf(req.body.location_id) > -1) {
            //     //In the array!
            //     res.send("duplicates not allowed!")
            // } else {
            
            db.locations.findOne({ "_id": p_id}, function (err, obj) {
                if (err || !obj) {
                    console.log("error getting obj items 4: " + err);
                } else {
                    var timestamp = Math.round(Date.now() / 1000);
                    obj.timestamp = timestamp;

                    var sceneLocs = scene.sceneLocations;
                    if (sceneLocs == null || !Array.isArray(sceneLocs)) {
                        sceneLocs = [];
                    }
                    // console.log("tryna add sceneLocations: " + sceneLocations);
                    sceneLocs.push(obj);
                    db.scenes.update({ "_id": s_id }, { $set: {sceneLocations: sceneLocs}});
                }
                if (err) {
                    res.send(error);
                } else {
                    res.send("updated " + new Date());
                }
            });
            // }
        }
    });
});

app.post('/add_scene_model/', requiredAuthentication, function (req, res) {

    var s_id = ObjectID(req.body.scene_id);   
    var p_id = ObjectID(req.body.model_id);   
    console.log('tryna add a scene obj : ' + JSON.stringify(req.body));

    db.scenes.findOne({ "_id": s_id}, function (err, scene) {
        if (err || !scene) {
            console.log("error getting sceneert 4 obj: " + err);
        } else {

            if (scene.sceneModels != null && scene.sceneModels.indexOf(req.body.model_id) > -1) {
                //In the array!
                res.send("duplicate models not allowed!")
            } else {
                db.models.findOne({ "_id": p_id}, function (err, model) {
                    if (err || !model) {
                        console.log("error getting model 4: " + err);
                    } else {
                            var sceneModels = (scene.sceneModels != undefined && scene.sceneModels != null && scene.sceneModels.length > 0) ? scene.sceneModels : new Array();
                            // console.log("XXX sceneModels: " + JSON.stringify(sceneModels));
                            sceneModels.push(req.body.model_id);
                            db.scenes.update({ "_id": s_id }, { $set: {sceneModels: sceneModels}
                        });
                    }
                    if (err) {
                        res.send(error);
                    } else {
                        res.send("updated " + new Date());
                    }
                });
            }
        }
    });
});

app.post('/add_scene_obj/', requiredAuthentication, function (req, res) {

    var s_id = ObjectID(req.body.scene_id);   
    var p_id = ObjectID(req.body.obj_id);   
    console.log('tryna add a scene obj : ' + JSON.stringify(req.body));

    db.scenes.findOne({ "_id": s_id}, function (err, scene) {
        if (err || !scene) {
            console.log("error getting sceneert 4 obj: " + err);
        } else {

            if (scene.sceneObjects != null && scene.sceneObjects.indexOf(req.body.obj_id) > -1) {
                //In the array!
                res.send("duplicates not allowed!")
            } else {
                db.obj_items.findOne({ "_id": p_id}, function (err, obj) {
                    if (err || !obj) {
                        console.log("error getting obj items 4: " + err);
                    } else {
                        var sceneObjs = (scene.sceneObjects != undefined && scene.sceneObjects != null && scene.sceneObjects != "") ? scene.sceneObjects : new Array();
                        console.log("XXX sceneObjs: " + sceneObjs);
                        sceneObjs.push(req.body.obj_id);
                        db.scenes.update({ "_id": s_id }, { $set: {sceneObjects: sceneObjs}
                        });
                    }
                    if (err) {
                        res.send(error)
                    } else {
                        res.send("updated " + new Date())
                    }
                });
            }
        }
    });
});

app.post('/add_scenelocation_obj/', checkAppID, requiredAuthentication, function (req, res) {

    var s_id = ObjectID(req.body.scene_id);   
    var p_id = ObjectID(req.body.obj_id);   

    console.log('tryna add a scene location obj : ' + JSON.stringify(req.body));

    db.scenes.findOne({ "_id": s_id}, function (err, scene) {
        if (err || !scene) {
            console.log("error getting scene location obj: " + err);
        } else {

            if (scene.sceneLocations != null) {
                for (var i = 0; i < scene.sceneLocations.length; i++) {
                    console.log("tryna find location " + req.body.location_id + " vs " + scene.sceneLocations[i].timestamp);
                    if  (scene.sceneLocations[i].timestamp == req.body.location_id) {
                        console.log("gotsa matching sceneLocation!");
                        db.obj_items.findOne({ "_id": p_id}, function (err, object) {
                            if (err || !object) {
                                console.log("error getting object : " + err);
                                res.end();
                            } else {
                                scene.sceneLocations[i].location_object = object;
                                var sceneObjs = scene.sceneObjects != undefined ? scene.sceneObjects : new Array();
                                console.log("truyna push sceene location object id " + req.body.obj_id);
                                sceneObjs.push(req.body.obj_id);

                                db.scenes.update({ "_id": s_id }, { $set: {sceneLocations: scene.sceneLocations, sceneObjects: sceneObjs}});
                                res.send("updated " + new Date());
                            }

                        });
                        break;
                    }
                };
            } else {
                res.send("location not found in scene")
            }
        }
    });
});

app.post('/add_scene_vid/', requiredAuthentication, function (req, res) {

    var s_id = ObjectID(req.body.scene_id);   
    var p_id = ObjectID(req.body.vid_id);   
    console.log('tryna add a scene vid : ' + JSON.stringify(req.body));

    db.scenes.findOne({ "_id": s_id}, function (err, scene) {
        if (err || !scene) {
            console.log("error getting sceneert 4: " + err);
        } else {
            db.video_items.findOne({ "_id": p_id}, function (err, vid) {
                if (err || !vid) {
                    console.log("error getting vid items 4: " + err);
                } else {

                    var sceneVideos = new Array();
                    if (scene.sceneVideos) {
                        sceneVideos = scene.sceneVideos;
                    }
                    if (sceneVideos.indexOf(req.body.vid_id) == -1 ) {
                        console.log("XXX sceneVids: " + sceneVideos);
                        sceneVideos.push(req.body.vid_id);
                        db.scenes.update({ "_id": s_id }, { $set: {sceneVideos: sceneVideos}

                        });
                    }
                }  if (err) {res.send(error)} else {res.send("updated " + new Date())}
            });
        }
    });
});

app.post('/add_scene_text_item/', requiredAuthentication, function (req, res) {

    var s_id = ObjectID(req.body.scene_id);   
    var p_id = ObjectID(req.body.text_id);   
    console.log('tryna add a scene pic : ' + req.body);

    db.scenes.findOne({ "_id": s_id}, function (err, scene) {
        if (err || !scene) {
            console.log("error getting sceneert 4: " + err);
        } else {

                db.text_items.findOne({ "_id": p_id}, function (err, txt) {
                    if (err || !txt) {
                        console.log("error getting image items 4: " + err);
                        res.send(error);
                    } else {
                        var sceneTextItems = new Array();
                        if (scene.sceneTextItems != undefined && scene.sceneTextItems.length > 0) {
                            sceneTextItems = scene.sceneTextItems;
                        }
                        if (sceneTextItems.indexOf(req.body.text_id) == -1) { //TODO DO THIS ON THE OTHER ONES!
                            sceneTextItems.push(req.body.text_id);
                            console.log("XXX sceneTexts: " + sceneTextItems);
                            db.scenes.update({ "_id": s_id }, { $set: {sceneTextItems: sceneTextItems}
                            });
                            res.send("updated " + new Date());
                        } else {
                            console.log("no dupes allowed");
                            res.send("that item has already been added to the scene");
                        }
                    }  //if (err) {res.send(error)} else {res.send("updated " + new Date())}
                });

        }
    });
});
app.post('/scene_text_items/', function (req, res) {
    console.log("textIDs " + JSON.stringify(req.body.textIDs) + " length " + req.body.textIDs.length );

    // var s_id = ObjectID(req.body.ids);   
    if (req.body.textIDs != undefined && req.body.textIDs != null && req.body.textIDs.length > 0) {
        let tempArray = [];
        // for ()
        let moids = req.body.textIDs.map(convertStringToObjectID);
        console.log('tryna add a scene pic : ' + req.body);

        db.text_items.find({_id: {$in: moids }}, function (err, text_items){
            if (err || !text_items) {
                console.log("error getting text_items: " + err);
                res.send("error getting text_items" + err);
            } else {
                res.send(text_items);
            }
        });
    } else {
        res.send ("bad request for textItems");
    }
});



app.post('/add_scene_pic/', requiredAuthentication, function (req, res) {

    var s_id = ObjectID(req.body.scene_id);   
    var p_id = ObjectID(req.body.pic_id);   
    console.log('tryna add a scene pic : ' + req.body);

    db.scenes.findOne({ "_id": s_id}, function (err, scene) {
        if (err || !scene) {
            console.log("error getting sceneert 4: " + err);
        } else {
            db.image_items.findOne({ "_id": p_id}, function (err, pic) {
                if (err || !pic) {
                    console.log("error getting image items 4: " + err);
                } else {
                    var scenePics = new Array();
                    if (scene.scenePictures != undefined && scene.scenePictures.length > 0) {
                        scenePics = scene.scenePictures;
                    }

                    console.log("XXX scenePics: " + scenePics);
                    scenePics.push(req.body.pic_id);
                    db.scenes.update({ "_id": s_id }, { $set: {scenePictures: scenePics}

                    });
                }  if (err) {res.send(error)} else {res.send("updated " + new Date())}
            });
        }
    });
});
app.post('/rem_domain_pic/', requiredAuthentication, admin, function (req, res) {
    var s_id = ObjectID(req.body.domain_id);   
    var p_id = ObjectID(req.body.pic_id);   
    console.log('tryna add a scene pic : ' + JSON.stringify(req.body));
    db.apps.findOne({ "_id": s_id}, function (err, item) {
        if (err || !item) {
            console.log("error getting sceneert 4: " + err);
            res.send("app not found!")
        } else {
            db.image_items.findOne({ "_id": p_id}, function (err, pic) {
                if (err || !pic) {
                    console.log("error getting image items for domain: " + err);
                } else {
                    var domainPics = item.domainPictureIDs;
                    if (domainPics != null) {
                    let index = domainPics.indexOf(req.body.pic_id);
                    if ( index != -1 ) {
                        domainPics.splice(index, 1);
                        db.domains.update({ "_id": s_id }, { $set: {domainPictureIDs: domainPics}});
                        if (err) {res.send(error)} else {res.send("updated " + new Date())}
                    } else {
                        res.send("that picture is not assigned to this app");
                    }
                    }
                }  
            });
        }
    });
});
app.post('/add_object_model/', requiredAuthentication, function (req, res) {
    var s_id = ObjectID(req.body.object_id);   
    var p_id = ObjectID(req.body.model_id);   
    console.log('tryna add a object model : ' + JSON.stringify(req.body));
    db.obj_items.findOne({ "_id": s_id}, function (err, item) { //does obj exist
        if (err || !item) {
            console.log("error getting object 4: " + err);
            res.send("object not found!")
        } else {
            db.models.findOne({ "_id": p_id}, function (err, model) { //does model exist
                if (err || !model) {
                    console.log("error getting model for object: " + err);
                    res.send("model for object not found");
                } else {
                    // console.log("tryna add model info " + JSON.stringify(model));
                    db.obj_items.update({ "_id": s_id }, { $set: {modelID: model._id, modelName: model.name}}); //update object with model info
                    res.send("updated");
                }  
            });
        }
    });
});
// app.post('/add_obj_model/', requiredAuthentication, function (req, res) { //save to array instead
//     var s_id = ObjectID(req.body.object_id);   
//     var p_id = ObjectID(req.body.model_id);   
//     console.log('tryna add a object model : ' + JSON.stringify(req.body));
//     db.obj_items.findOne({ "_id": s_id}, function (err, item) { //does obj exist
//         if (err || !item) {
//             console.log("error getting object 4: " + err);
//             res.send("object not found!")
//         } else {
//             db.models.findOne({ "_id": p_id}, function (err, model) { //does model exist
//                 if (err || !model) {
//                     console.log("error getting model for object: " + err);
//                     res.send("model for object not found");
//                 } else {
//                     // console.log("tryna add model info " + JSON.stringify(model));
//                     db.obj_items.update({ "_id": s_id }, { $push: {models: {modelID: model._id, modelName: model.name}}}); //update object with model info
//                     res.send("updated");
//                 }  
//             });
//         }
//     });
// });

app.post('/add_action_model/', requiredAuthentication, function (req, res) { //save to array instead
    var s_id = ObjectID(req.body.action_id);   
    var p_id = ObjectID(req.body.model_id);   
    console.log('tryna add an action model : ' + JSON.stringify(req.body));
    db.actions.findOne({ "_id": s_id}, function (err, item) { //does obj exist
        if (err || !item) {
            console.log("error getting object 4: " + err);
            res.send("object not found!")
        } else {
            db.models.findOne({ "_id": p_id}, function (err, model) { //does model exist
                if (err || !model) {
                    console.log("error getting model for object: " + err);
                    res.send("model for object not found");
                } else {
                    // console.log("tryna add model info " + JSON.stringify(model));
                    db.actions.update({ "_id": s_id }, { $set: {modelID: model._id, modelName: model.name}}); //update object with model info
                    res.send("updated");
                }  
            });
        }
    });
});

app.post('/add_action_object/', requiredAuthentication, function (req, res) { //save to array instead
    var s_id = ObjectID(req.body.action_id);   
    var p_id = ObjectID(req.body.object_id);   
    console.log('tryna add an action model : ' + JSON.stringify(req.body));
    db.actions.findOne({ "_id": s_id}, function (err, item) { //does obj exist
        if (err || !item) {
            console.log("error getting action 4: " + err);
            res.send("action not found!")
        } else {
            db.obj_items.findOne({ "_id": p_id}, function (err, obj) { //does model exist
                if (err || !obj) {
                    console.log("error getting model for object: " + err);
                    res.send("model for object not found");
                } else {
                    // console.log("tryna add model info " + JSON.stringify(model));
                    db.actions.update({ "_id": s_id }, { $set: {objectID: obj._id, objectName: obj.name}}); //update object with object info
                    res.send("updated");
                }  
            });
        }
    });
});

app.post('/add_obj_action/', requiredAuthentication, function (req, res) { //save to array instead
    var s_id = ObjectID(req.body.object_id);   
    var a_id = ObjectID(req.body.action_id);   
    console.log('tryna add a object action : ' + JSON.stringify(req.body));
    db.obj_items.findOne({ "_id": s_id}, function (err, item) { //does obj exist
        if (err || !item) {
            console.log("error getting object 4 action: " + err);
            res.send("object not found!")
        } else {
            db.actions.findOne({ "_id": a_id}, function (err, action) { //does action exist
                if (err || !action) {
                    console.log("error getting action for object: " + err);
                    res.send("action for object not found");
                } else {
                    
                    
                    if (item.actionIDs == undefined || item.actionIDs.length > 0 || item.actionIDs.indexOf(action._id.toString()) == -1 ) {
                        db.obj_items.update({ "_id": s_id }, { $push: {actionIDs: action._id.toString()}}, {upsert: false}, function (err, saved) {
                            if (err || !saved) {
                                res.send("error saving action " + err);
                            } else {
                                console.log("saved action to object: " +JSON.stringify(saved));
                                res.send("updated");
                            }
                    });
                } else {
                    console.log("dupe action");
                    res.send("no duplicate actions!");
                }
            }
                 
            });
        }
    });
});
// app.post('/add_object_action/', requiredAuthentication, function (req, res) { //deprecated
//     var s_id = ObjectID(req.body.object_id);   
//     var a_id = ObjectID(req.body.action_id);   
//     console.log('tryna add a object action : ' + JSON.stringify(req.body));
//     db.obj_items.findOne({ "_id": s_id}, function (err, item) { //does obj exist
//         if (err || !item) {
//             console.log("error getting object 4: " + err);
//             res.send("object not found!")
//         } else {
//             db.actions.findOne({ "_id": a_id}, function (err, action) { //does model exist
//                 if (err || !action) {
//                     console.log("error getting action for object: " + err);
//                     res.send("action for object not found");
//                 } else {
//                     // console.log("tryna add action info " + JSON.stringify(model));
//                     db.obj_items.update({ "_id": s_id }, { $set: {actionID: action._id, actionName: action.actionName, actionType: action.actionType}}); //update object with model info
//                     res.send("updated");
//                 }  
//             });
//         }
//     });
// });
app.post('/add_object_pic/', requiredAuthentication, function (req, res) {
    var s_id = ObjectID(req.body.object_id);   
    var p_id = ObjectID(req.body.pic_id);   
    console.log('tryna add a object pic : ' + JSON.stringify(req.body));
    db.obj_items.findOne({ "_id": s_id}, function (err, item) {
        if (err || !item) {
            console.log("error getting object 4: " + err);
            res.send("object not found!")
        } else {
            db.image_items.findOne({ "_id": p_id}, function (err, pic) {
                if (err || !pic) {
                    console.log("error getting image items for object: " + err);
                } else {
                    var objectPics = item.objectPictureIDs;
                    if (objectPics == null) {
                        objectPics = [];
                    }
                    if ( objectPics.indexOf(req.body.pic_id) == -1 ) {
                        objectPics.push(req.body.pic_id);
                        db.obj_items.update({ "_id": s_id }, { $set: {objectPictureIDs: objectPics}});
                        if (err) {res.send(error)} else {res.send("updated " + new Date())}
                    } else {
                        res.send("that picture is already assigned to this object");
                    }
                }  
            });
        }
    });
});
app.post('/rem_object_action/', requiredAuthentication, admin, function (req, res) {
    var s_id = ObjectID(req.body.object_id);   
    var p_id = ObjectID(req.body.action_id);   
    console.log('tryna add a scene pic : ' + JSON.stringify(req.body));
    db.obj_items.findOne({ "_id": s_id}, function (err, item) {
        if (err || !item) {
            console.log("error getting sceneert 4: " + err);
            res.send("app not found!")
        } else {
            db.actions.findOne({ "_id": p_id}, function (err, action) {
                if (err || !action) {
                    console.log("error getting image items for domain: " + err);
                } else {
                    var actionIDs = item.actionIDs;
                    if (actionIDs != null) {
                    let index = actionIDs.indexOf(req.body.action_id);
                    if ( index != -1 ) {
                        actionIDs.splice(index, 1);
                        db.obj_items.update({ "_id": s_id }, { $set: {actionIDs: actionIDs}});
                        if (err) {
                            res.send(err);
                            } else {
                                res.send("updated " + new Date())
                            }
                        } else {
                            res.send("that action is not assigned to this object");
                        }
                    }
                }  
            });
        }
    });
});
app.post('/rem_object_pic/', requiredAuthentication, admin, function (req, res) {
    var s_id = ObjectID(req.body.domain_id);   
    var p_id = ObjectID(req.body.pic_id);   
    console.log('tryna add a scene pic : ' + JSON.stringify(req.body));
    db.obj_items.findOne({ "_id": s_id}, function (err, item) {
        if (err || !item) {
            console.log("error getting sceneert 4: " + err);
            res.send("app not found!")
        } else {
            db.image_items.findOne({ "_id": p_id}, function (err, pic) {
                if (err || !pic) {
                    console.log("error getting image items for domain: " + err);
                } else {
                    var objectPics = item.objectPictureIDs;
                    if (objectPics != null) {
                    let index = objectPics.indexOf(req.body.pic_id);
                    if ( index != -1 ) {
                        objectPics.splice(index, 1);
                        db.obj_items.update({ "_id": s_id }, { $set: {objectPictureIDs: objectPics}});
                        if (err) {res.send(error)} else {res.send("updated " + new Date())}
                    } else {
                        res.send("that picture is not assigned to this app");
                    }
                    }
                }  
            });
        }
    });
});
app.post('/add_domain_pic/', requiredAuthentication, admin, function (req, res) {
    var s_id = ObjectID(req.body.domain_id);   
    var p_id = ObjectID(req.body.pic_id);   
    console.log('tryna add a domain pic : ' + JSON.stringify(req.body));
    db.domains.findOne({ "_id": s_id}, function (err, item) {
        if (err || !item) {
            console.log("error getting sceneert 4: " + err);
            res.send("domain not found!")
        } else {
            db.image_items.findOne({ "_id": p_id}, function (err, pic) {
                if (err || !pic) {
                    console.log("error getting image items for storeitem: " + err);
                } else {
                    var domainPics = item.domainPictureIDs;
                    if (domainPics == null) {
                        domainPics = [];
                    }
                    if ( domainPics.indexOf(req.body.pic_id) == -1 ) {
                        domainPics.push(req.body.pic_id);
                        db.domains.update({ "_id": s_id }, { $set: {domainPictureIDs: domainPics}});
                        if (err) {res.send(error)} else {res.send("updated " + new Date())}
                    } else {
                        res.send("that picture is already assigned to this domain");
                    }
                }  
            });
        }
    });
});
app.post('/rem_app_pic/', requiredAuthentication, admin, function (req, res) {
    var s_id = ObjectID(req.body.app_id);   
    var p_id = ObjectID(req.body.pic_id);   
    console.log('tryna add a scene pic : ' + JSON.stringify(req.body));
    db.apps.findOne({ "_id": s_id}, function (err, item) {
        if (err || !item) {
            console.log("error getting sceneert 4: " + err);
            res.send("app not found!")
        } else {
            db.image_items.findOne({ "_id": p_id}, function (err, pic) {
                if (err || !pic) {
                    console.log("error getting image items for storeitem: " + err);
                } else {
                    var appPics = item.appPictureIDs;
                    if (appPics != null) {
                    let index = appPics.indexOf(req.body.pic_id);
                    if ( index != -1 ) {
                        appPics.splice(index, 1);
                        db.apps.update({ "_id": s_id }, { $set: {appPictureIDs: appPics}});
                        if (err) {res.send(error)} else {res.send("updated " + new Date())}
                    } else {
                        res.send("that picture is not assigned to this app");
                    }
                    }
                }  
            });
        }
    });
});
app.post('/add_app_pic/', requiredAuthentication, admin, function (req, res) {
    var s_id = ObjectID(req.body.app_id);   
    var p_id = ObjectID(req.body.pic_id);   
    console.log('tryna add a scene pic : ' + JSON.stringify(req.body));
    db.apps.findOne({ "_id": s_id}, function (err, item) {
        if (err || !item) {
            console.log("error getting sceneert 4: " + err);
            res.send("store item not found!")
        } else {
            db.image_items.findOne({ "_id": p_id}, function (err, pic) {
                if (err || !pic) {
                    console.log("error getting image items for storeitem: " + err);
                } else {
                    var appPics = item.appPictureIDs;
                    if (appPics == null) {
                        appPics = [];
                    }
                    // console.log("XXX scenePics: " + storeItemPics);
                    if ( appPics.indexOf(req.body.pic_id) == -1 ) {
                        appPics.push(req.body.pic_id);
                        db.apps.update({ "_id": s_id }, { $set: {appPictureIDs: appPics}});
                        if (err) {res.send(error)} else {res.send("updated " + new Date())}
                    } else {
                        res.send("that picture is already assigned to this storeitem");
                    }
                }  
            });
        }
    });
});
app.post('/rem_storeitem_pic/', checkAppID, requiredAuthentication, function (req, res) {
    var s_id = ObjectID(req.body.storeitem_id);   
    var p_id = ObjectID(req.body.pic_id);   
    console.log('tryna add a scene pic : ' + JSON.stringify(req.body));
    db.storeitems.findOne({ "_id": s_id}, function (err, storeitem) {
        if (err || !storeitem) {
            console.log("error getting sceneert 4: " + err);
            res.send("store item not found!")
        } else {
            db.image_items.findOne({ "_id": p_id}, function (err, pic) {
                if (err || !pic) {
                    console.log("error getting image items for storeitem: " + err);
                } else {
                    var storeItemPics = storeitem.storeItemPictureIDs;
                    if (storeItemPics != null) {
                    let index = storeItemPics.indexOf(req.body.pic_id);
                    if ( index != -1 ) {
                        storeItemPics.splice(index, 1);
                        db.storeitems.update({ "_id": s_id }, { $set: {storeItemPictureIDs: storeItemPics}});
                        if (err) {res.send(error)} else {res.send("updated " + new Date())}
                    } else {
                        res.send("that picture is not assigned to this storeitem");
                    }
                    }
                }  
            });
        }
    });
});
app.post('/add_storeitem_pic/', checkAppID, requiredAuthentication, function (req, res) {
    var s_id = ObjectID(req.body.storeitem_id);   
    var p_id = ObjectID(req.body.pic_id);   
    console.log('tryna add a scene pic : ' + JSON.stringify(req.body));
    db.storeitems.findOne({ "_id": s_id}, function (err, storeitem) {
        if (err || !storeitem) {
            console.log("error getting sceneert 4: " + err);
            res.send("store item not found!")
        } else {
            db.image_items.findOne({ "_id": p_id}, function (err, pic) {
                if (err || !pic) {
                    console.log("error getting image items for storeitem: " + err);
                } else {
                    var storeItemPics = storeitem.storeItemPictureIDs;
                    if (storeItemPics == null) {
                        storeItemPics = [];
                    }
                    console.log("XXX scenePics: " + storeItemPics);
                    if ( storeItemPics.indexOf(req.body.pic_id) == -1 ) {
                        storeItemPics.push(req.body.pic_id);
                        db.storeitems.update({ "_id": s_id }, { $set: {storeItemPictureIDs: storeItemPics}});
                        if (err) {res.send(error)} else {res.send("updated " + new Date())}
                    } else {
                        res.send("that picture is already assigned to this storeitem");
                    }
                }  
            });
        }
    });
});
app.post('/add_storeitem_obj/', requiredAuthentication, admin, function (req, res) {
    var s_id = ObjectID(req.body.storeitem_id);   
    var p_id = ObjectID(req.body.obj_id);   
    console.log('tryna add a storeitem obj : ' + JSON.stringify(req.body));
    db.storeitems.findOne({ "_id": s_id}, function (err, storeitem) {
        if (err || !storeitem) {
            console.log("error getting sceneert 4: " + err);
            res.send("store item not found!")
        } else {
            db.obj_items.findOne({ "_id": p_id}, function (err, obj) {
                if (err || !obj) {
                    console.log("error getting image items for storeitem: " + err);
                } else {
        
                db.storeitems.update({ "_id": s_id }, { $set: {objectID: obj._id, objectName: obj.name}});
                if (err) {res.send(error)} else {res.send("updated " + new Date())}

                }         
            });
        }
    });
});
app.post('/add_storeitem_scenegroup/', requiredAuthentication, function (req, res) {
    var s_id = ObjectID(req.body.storeitem_id);   
    var p_id = ObjectID(req.body.group_id);   
    console.log('tryna add a storeitem scenegroup : ' + JSON.stringify(req.body));
    db.storeitems.findOne({ "_id": s_id}, function (err, storeitem) {
        if (err || !storeitem) {
            console.log("error getting sceneert 4: " + err);
            res.send("store item not found!")
        } else {
            db.groups.findOne({ "_id": p_id}, function (err, group) {
                if (err || !group) {
                    console.log("error getting image items for storeitem: " + err);
                } else {
                    var storeItemSceneGroups = storeitem.storeItemSceneGroups;
                    if (storeItemSceneGroups == null) {
                        storeItemSceneGroups = [];
                    }
                    console.log("updating storeitem sceneGroups: " + storeItemSceneGroups);
                    if ( storeItemSceneGroups.indexOf(req.body.group_id) == -1 ) {
                        storeItemSceneGroups.push(req.body.group_id);
                        db.storeitems.update({ "_id": s_id }, { $set: {storeItemSceneGroupIDs: storeItemSceneGroups}});
                        if (err) {res.send(error)} else {res.send("updated " + new Date())}
                    } else {
                        res.send("that group is already assigned to this storeitem");
                    }
                }  
            });
        }
    });
});
app.post('/add_scene_postcard/', requiredAuthentication, function (req, res) {

    var s_id = ObjectID(req.body.scene_id);   
    var p_id = ObjectID(req.body.pic_id);   
    console.log('tryna add a scene pic : ' + JSON.stringify(req.body));

    db.scenes.findOne({ "_id": s_id}, function (err, scene) {
        if (err || !scene) {
            console.log("error getting sceneert 4: " + err);
        } else {
            db.image_items.findOne({ "_id": p_id}, function (err, pic) {
                if (err || !pic) {
                    console.log("error getting image items 4: " + err);
                } else {
                    var scenePostcards = new Array();
                    if (scene.scenePostcards != null && scene.scenePostcards.length > 0) {
                        scenePostcards = scene.scenePostcards;
                    }
                    console.log("XXX scenePostcards: " + scenePostcards);
                    scenePostcards.push(req.body.pic_id);
                    db.scenes.update({ "_id": s_id }, { $set: {scenePostcards: scenePostcards}

                    });
                }  if (err) {res.send(error)} else {res.send("updated " + new Date())}
            });
        }
    });
});

app.post('/add_group_item/', checkAppID, requiredAuthentication, function (req, res) {

    var g_id = ObjectID(req.body.group_id);   
    var timestamp = Math.round(Date.now() / 1000);
    console.log('tryna add a group item : ' + req.body);
    db.groups.update({ "_id": g_id }, { $push: {items: req.body.item_id} },{ $set: {lastUpdateTimestamp : timestamp} });
    res.send("ok");

});


app.post('/add_scene_audio/', requiredAuthentication, function (req, res) {

    var s_id = ObjectID(req.body.scene_id);   
    var a_id = ObjectID(req.body.audio_id);   
    console.log('tryna import primary audio : ' + req.body);

    db.scenes.findOne({ "_id": s_id}, function (err, scene) {
        if (err || !scene) {
            console.log("error getting sceneert 4: " + err);
        } else {
            db.audio_items.findOne({ "_id": a_id}, function (err, audio) {
                if (err || !audio) {
                    console.log("error getting audio items 4: " + err);
                } else {
                    if (req.body.audio_type === "trigger") {
                        db.scenes.update({ "_id": s_id }, { $set: {sceneTriggerAudioID: req.body.audio_id}});
                    } else if (req.body.audio_type === "ambient") {
                        db.scenes.update({ "_id": s_id }, { $set: {sceneAmbientAudioID: req.body.audio_id}});
                    } else if (req.body.audio_type === "primary") {
                        db.scenes.update({ "_id": s_id }, { $set: {scenePrimaryAudioID: req.body.audio_id}});
                    }

                }  if (err) {res.send(error)} else {res.send("updated " + new Date())}
            });
        }
    });
});

app.post('/import_scene_audio_timed_events/', requiredAuthentication, function (req, res) {

    var s_id = ObjectID(req.body.sceneID);   
    var a_id = ObjectID(req.body.audioID);   
    console.log('tryna import scene audio timed e3vents : ' + req.body);

    db.scenes.findOne({ "_id": s_id}, function (err, scene) {
        if (err || !scene) {
            console.log("error getting scene for audio timekey import: " + err);
        } else {
            db.audio_items.findOne({ "_id": a_id}, function (err, audio) {
                if (err || !audio) {
                    console.log("error getting audio items 4: " + err);
                } else {
                    if (audio.timekeys != undefined && audio.timekeys != null && audio.timekeys.length) {
                        let sceneTimedEvents = {};
                        sceneTimedEvents.timekeys = audio.timekeys;
                        db.scenes.update({ "_id": s_id }, { $set: {sceneTimedEvents: sceneTimedEvents}});
                        
                        if (err) {
                            res.send(error);w
                        } else {    
                            res.send("updated " + new Date());
                        }
                     } else {
                        res.send("no timekeys found for that audio item.");
                     } 
                      
                }
            });
        }
    });
});


//
//    db.image_items.findOne({ "_id" : o_id}, function(err, pic) {
//        if (err || !pic) {
//            console.log("error getting image items 4: " + err);
//        } else {
//
//
//        } if (err) {res.send(error)} else {res.send("updated " + new Date())}
//    });
//});

app.get('/uscenes/:_id',  requiredAuthentication, usercheck, function (req, res) { //get scenes for this user
    console.log("tryna get user scenes: ",req.params._id);
    var o_id = ObjectID(req.params._id);
    var scenesResponse = {};
    let query = {"user_id" : req.params._id};
    if (req.session.user.authLevel.toLowerCase().includes("domain")) { //domain admins can see everything
        query = {};
    }
    db.scenes.find(query, { sceneTitle: 1, short_id: 1, sceneLastUpdate: 1, sceneDomain: 1, userName: 1, user_id: 1, sceneAndroidOK: 1, sceneIosOK: 1, sceneWindowsOK: 1, sceneShareWithPublic: 1 },  function(err, scenes) {
        if (err || !scenes) {
            console.log("cain't get no scenes... " + err);
            res.send("noscenes");
        } else { //should externalize
            res.json(scenes);
        }
    });
});
app.get('/uscenes/:appid',  requiredAuthentication, usercheck, function (req, res) { //get scenes for this user
    console.log("tryna get user scenes: ",req.params._id);
    var o_id = ObjectID(req.params.appid);
    var scenesResponse = {};

    db.scenes.find({ "user_id" : req.params._id}, { sceneTitle: 1, short_id: 1, sceneLastUpdate: 1, sceneDomain: 1, userName: 1, user_id: 1, sceneAndroidOK: 1, sceneIosOK: 1, sceneWindowsOK: 1, sceneShareWithPublic: 1 },  function(err, scenes) {
        if (err || !scenes) {
            console.log("cain't get no scenes... " + err);
            res.send("noscenes");
        } else { //should externalize
            res.json(scenes);
        }
    });
});
app.post('/uscenes/',  requiredAuthentication, usercheck, function (req, res) { //get scenes for app
    console.log("tryna get user scenes: ",req.params._id);
    var o_id = ObjectID(req.params._id);
    var scenesResponse = {};
    db.scenes.find({ "sceneAppName" : req.body.appName}, { sceneTitle: 1, short_id: 1, sceneLastUpdate: 1, userName: 1, user_id: 1, sceneAndroidOK: 1, sceneIosOK: 1, sceneWindowsOK: 1, sceneShareWithPublic: 1 },  function(err, scenes) {
        if (err || !scenes) {
            console.log("cain't get no scenes... " + err);
            res.send("noscenes");
        } else { //should externalize
            res.json(scenes);
        }
    });
});
app.post('/appscenes/',  requiredAuthentication, function (req, res) { //get scenes for app
    console.log("tryna get user scenes fer: " + req.body.sceneDomain);

    // var o_id = ObjectID(req.params.appid);
    // var scenesResponse = {};
    db.scenes.find({ "sceneDomain" : req.body.sceneDomain}, { sceneTitle: 1, short_id: 1, sceneLastUpdate: 1, userName: 1, user_id: 1, sceneAndroidOK: 1, sceneIosOK: 1, sceneWindowsOK: 1, sceneShareWithPublic: 1, sceneStickyness: 1 },  function(err, scenes) {
        if (err || !scenes) {
            console.log("cain't get no scenes... " + err);
            res.send("noscenes");
        } else { //should externalize
            res.json(scenes);
        }
    });
});
app.get('/uscene/:user_id/:scene_id',  requiredAuthentication, uscene, function (req, res) { //view for updating scene for this user

    console.log("tryna get scene id: ", req.params.scene_id + " excaped " + entities.decodeHTML(req.params.scene_id));
    var reqstring = entities.decodeHTML(req.params.scene_id).toString().replace(":", "");
//    var sceneID = req.params.scene_id.toString().replace(":", "");
    var audioResponse = {};
    
    var pictureResponse = {};
    var postcardResponse = {};
    var objectResponse = {};
    var sceneResponse = {};
    var requestedPictureItems = [];
    var requestedAudioItems = [];
    // var requestedLocationItems = [];
    // sceneResponse.locations = [];
    sceneResponse.audio = [];
    sceneResponse.pictures = [];
    sceneResponse.postcards = [];
    sceneResponse.weblinx = [];
    sceneResponse.assets = [];
    async.waterfall([
        function (callback) {
            console.log("uscene lookup for reqstring " + reqstring);
            var o_id = ObjectID(reqstring);
            // var o_id = new ObjectId.createFromHexString(reqstring);
            // var o_id = ObjectID(req.params.scene_id);
            db.scenes.find({$or: [{ sceneTitle: reqstring },
                    { short_id : reqstring },
                    { _id : o_id}]},
                function (err, sceneData) { //fetch the path info by title TODO: urlsafe string

                    if (err || !sceneData || !sceneData.length) {
                        console.log("3 error getting scene data: " + err);
                        callback(err);
                    } else { //make arrays of the pics and audio items and locations
                        if (sceneData[0].scenePictures != undefined) { 
                                if (sceneData[0].scenePictures.length > 0) {
{                                   sceneData[0].scenePictures.forEach(function (picture) {
                                    var p_id = ObjectID(picture); //convert to binary to search by _id beloiw
                                    requestedPictureItems.push(p_id); //populate array
                                });
                            }
                        }
                    }
                        // sceneData[0].sceneLocationIDs.forEach(function (locationID){
                        //     var p_id = ObjectID(locationID); //convert to binary to search by _id beloiw
                        //     requestedLocationItems.push(p_id); //populate array
                        // });
                        // requestedAudioItems = [ ObjectID(sceneData[0].sceneTriggerAudioID), ObjectID(sceneData[0].sceneAmbientAudioID), ObjectID(sceneData[0].scenePrimaryAudioID)];
                        var triggerOID = ObjectID.isValid(sceneData[0].sceneTriggerAudioID) ? ObjectID(sceneData[0].sceneTriggerAudioID) : "";
                        var ambientOID = ObjectID.isValid(sceneData[0].sceneAmbientAudioID) ? ObjectID(sceneData[0].sceneAmbientAudioID) : "";
                        var primaryOID = ObjectID.isValid(sceneData[0].scenePrimaryAudioID) ? ObjectID(sceneData[0].scenePrimaryAudioID) : "";
                        requestedAudioItems = [ triggerOID, ambientOID, primaryOID];
                        sceneResponse = sceneData[0];
                        console.log("sceneScatterOffset is " + sceneResponse.sceneScatterOffset);
                        callback(null);
                    }
                });
            },
            function (callback) { //update link pic URLs //TODO check for freshness, and rescrape if needed
                if (sceneResponse.sceneWebLinks != null && sceneResponse.sceneWebLinks.length > 0) {
                    let weblinx = [];
                    for (var i = 0; i < sceneResponse.sceneWebLinks.length; i++) {
                        console.log(JSON.stringify(sceneResponse.sceneWebLinks[i]));
                        db.weblinks.findOne({'_id': ObjectID(sceneResponse.sceneWebLinks[i])}, function (err, weblink) {
                            if (err || !weblink) {
                                console.log("can't find weblink");
                            } else {
                                console.log(JSON.stringify(weblink));
                                let link = {};
                                var urlThumb = s3.getSignedUrl('getObject', {Bucket: 'servicemedia.web', Key: weblink._id + "/" + weblink._id + ".thumb.jpg", Expires: 6000});
                                var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia.web', Key:  weblink._id + "/" + weblink._id + ".half.jpg", Expires: 6000});
                                var urlStandard = s3.getSignedUrl('getObject', {Bucket: 'servicemedia.web', Key:  weblink._id + "/" + weblink._id + ".standard.jpg", Expires: 6000});
                                
                                link.urlThumb = urlThumb;
                                link.urlHalf = urlHalf;
                                link.urlStandard = urlStandard;
                                link.link_url = weblink.link_url;
                                link.link_title = weblink.link_title;
                                link._id = weblink._id;
                                weblinx.push(link);
                            }
                        });
                    }
                    sceneResponse.weblinx = weblinx;
                    console.log("weblinx " + sceneResponse.weblinx);
                }
                callback(null);
            },
            function (callback) { 
                if (sceneResponse.sceneVideos != null && sceneResponse.sceneVideos != undefined && sceneResponse.sceneVideos.length > 0) {
                    moids = sceneResponse.sceneVideos.map(convertStringToObjectID);
                    db.video_items.find({_id: {$in: moids }}, function (err, video_items){
                        if (err || !video_items) {
                            console.log("error getting video items: " + err);
                            callback(null);
                        } else {
                            for (let i = 0; i < video_items.length; i++) {
                                let item_string_filename = JSON.stringify(video_items[i].filename);
                                item_string_filename = item_string_filename.replace(/\"/g, "");
                                let item_string_filename_ext = getExtension(item_string_filename);
                                let expiration = new Date();
                                expiration.setMinutes(expiration.getMinutes() + 30);
                                var urlVid = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + video_items[i].userID + "/video/" + video_items[i]._id + "/" + video_items[i]._id + "." + video_items[i].filename, Expires: 60000});
                                video_items[i].vUrl = urlVid;
                            }
                            sceneResponse.sceneVideoItems = video_items;
                            callback(null)
                        }
                    });
                } else {
                    callback(null);
                }
            },
            function (callback) { 
                if (sceneResponse.sceneTextItems != null && sceneResponse.sceneTextItems != undefined && sceneResponse.sceneTextItems.length > 0) {
                    moids = sceneResponse.sceneTextItems.map(convertStringToObjectID);
                    db.text_items.find({_id: {$in: moids }}, function (err, text_items){
                        if (err || !text_items) {
                            console.log("error getting video items: " + err);
                            callback(null);
                        } else {
                            sceneResponse.textItems = text_items;
                            callback(null)
                        }
                    });
                } else {
                    callback(null);
                }
            },
            // function (callback) { //attach the location objex
            //     if (sceneResponse.sceneLocationIDs != null && sceneResponse.sceneLocationIDs != undefined && sceneResponse.sceneLocationIDs.length > 0) {
            //         for (let s = 0; s < sceneResponse.sceneLocationIDs.length; s++) {
            //             if (location_items[s]._id)
            //         }
            //         moids = sceneResponse.sceneLocationIDs.map(convertStringToObjectID);
            //         db.locations.find({_id: {$in: moids }}, function (err, location_items){
            //             if (err || !location_items) {
            //                 console.log("error getting location items: " + err);
            //                 callback(null);
            //             } else {
            //                 let sceneLocations = sceneResponse.sceneLocations != undefined ? sceneResponse.sceneLocations : new Array(); //some old sceneLocations aren't external
            //                 for (let s = 0; s < location_items.length; s++) {
            //                     if (location_items[s]._id)
            //                 }
            //                 let mergedSceneLocations = sceneLocations.concat(location_items);
            //                 sceneResponse.sceneLocations = mergedSceneLocations;
            //                 callback(null)
            //             }
            //         });
            //     } else {
            //         callback(null);
            //     }
            // },
            function (callback) { 
                let allgroups = [];
                if (sceneResponse.sceneVideoGroups != null) {
                    allgroups.push(...sceneResponse.sceneVideoGroups);
                };                
                if (sceneResponse.scenePictureGroups != null) {
                    allgroups.push(...sceneResponse.scenePictureGroups);
                };
                if (sceneResponse.sceneAudioGroups != null) {
                    allgroups.push(...sceneResponse.sceneAudioGroups);
                };
                if (sceneResponse.sceneLocationGroups != null) {
                    allgroups.push(...sceneResponse.sceneLocationGroups);
                };
                if (allgroups.length > 0) {
                    moids = allgroups.map(convertStringToObjectID);
                    db.groups.find({_id: {$in: moids }}, function (err, items){
                        if (err || !items) {
                            console.log("error getting groupz items: " + err);
                            callback(null);
                        } else {
                            sceneResponse.sceneGroups = items;
                            callback(null)
                        }
                    });
                } else {
                    callback(null);
                }
            },
            function (callback) { //fethc audio items
                db.audio_items.find({_id: {$in: requestedAudioItems }}, function (err, audio_items){
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
                    if (audio_items[i].tags != null && audio_items[i].tags.length < 1) {audio_items[i].tags = [""]}

                }
                //   console.log('tryna send ' + audio_items);
                audioResponse = audio_items;
                sceneResponse.audio = audioResponse;
//                        console.log("audio", audioResponse);
                callback(null, audio_items);
            },

            function(audioStuff, callback) { //return the pic items
                //   console.log("audioStuff ", audioStuff);
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
                    var originalName = 'original.' + baseName + item_string_filename_ext;

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
                        var urlOriginal = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_items[i].userID + "/pictures/originals/" + picture_items[i]._id + "." + originalName, Expires: 6000});
                        picture_items[i].urlOriginal = urlOriginal;
                    }
                    if (picture_items[i].hasAlphaChannel == null) {picture_items[i].hasAlphaChannel = false}
                    //pathResponse.path.pictures.push(urlThumb, urlQuarter, urlHalf, urlStandard);
                    if (picture_items[i].tags != null && picture_items[i].tags.length < 1) {picture_items.tags = [""]}

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
                                console.log("error getting postcatd items: " + err);
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
//                console.log("sceneObjects : " + JSON.stringify(sceneResponse.sceneObjects));
                if (sceneResponse.sceneModels != null) {
                    async.each (sceneResponse.sceneModels, function (objID, callbackz) { //nested async-ery!
                        var oo_id = ObjectID(objID);
                        console.log("7798 tryna get sceneModels: " + objID);
                        db.models.findOne({"_id": oo_id}, function (err, model) {
                            if (err || !model) {
                                console.log("error getting model: " + err);
                                callbackz();
                            } else {
                                // console.log("got user models:" + JSON.stringify(models));
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
                var objexgroups = [];
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
                                    console.log("gotsome groupObjects to add to sceneObjects : "+ JSON.stringify(group));
                                    // sceneResponse.sceneObjects = sceneResponse.sceneObjects.concat(group.items);
                                    objexgroups.push(group);
                                    callbackz();
                                }
                            });
                        }, function(err) {
                           
                            if (err) {
                                
                                
                                console.log('A file failed to process');
                                callback(err);
                            } else {
                                console.log('groupObjects have been added to sceneObjects');
                                sceneResponse.sceneObjexGroups = objexgroups;
                                callback(null);
                            }
                        });
                    } else {
                        callback(null);
                    }
            },
            

            function (callback) {
                var objex = [];
                console.log("tryna fetch all the sceneObjects: " + JSON.stringify(sceneResponse.sceneObjects));
//                console.log("sceneObjects : " + JSON.stringify(sceneResponse.sceneObjects));
                if (sceneResponse.sceneObjects != null) {
                    async.each (sceneResponse.sceneObjects, function (objID, callbackz) { //nested async-ery!
                        var oo_id = ObjectID(objID);
                        // console.log("4573 tryna get sceneObject: " + objID);
                        db.obj_items.findOne({"_id": oo_id}, function (err, obj_item) {
                            if (err || !obj_item) {
                                console.log("error getting obj items: " + err);
                                callbackz();
                            } else {

                                //console.log("4580 tryna find childObjectIDs: " + JSON.stringify(obj_item.childObjectIDs));
                                obj_item.objectGroup = "none";
                                if (obj_item.childObjectIDs != null && obj_item.childObjectIDs.length > 0) {
                                    var childIDs = obj_item.childObjectIDs.map(convertStringToObjectID); //convert child IDs array to objIDs
                                    db.obj_items.find({_id : {$in : childIDs}}, function(err, obj_items) {
                                        if (err || !obj_items) {
                                            console.log("error getting childObject items: " + err);
                                            //res.send("error getting child objects");
                                            objex.push(obj_item);
                                            callbackz();
                                        } else {
                                            childObjects = obj_items;
                                            console.log("childObjects: " + JSON.stringify(childObjects));
                                            obj_item.childObjects = childObjects;
                                            objex.push(obj_item);
                                            callbackz();
                                        }
                                    });
                                } else {
                                    objex.push(obj_item);
                                    callbackz();
                                }
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
            // console.log("weblinx " + JSON.stringify(sceneResponse.weblinx));
            res.json(sceneResponse);
            console.log("waterfall done for scene response");
        }
    );
});

//is this still used?
app.get('/uuscene/:user_id/:scene_id',  checkAppID, requiredAuthentication, uscene, function (req, res) { //view for updating scene for this user

    console.log("tryna get scene " + req.params.scene_id);
    var sceneID = req.params.scene_id.toString().replace(":", "");
    // var o_id = new ObjectId.createFromHexString(sceneID);
    var o_id = ObjectID(sceneID);
    console.log("tryna get scene: " + sceneID);
    db.scenes.findOne({ _id : o_id}, function(err, scene) {
        if (err || !scene) {
            console.log("cain't get no scene... " + err);
        } else {
//            console.log(JSON.stringify(scenes));

            if (scene.sceneWebLinks != null && scene.sceneWebLinks.length > 0) {
                for (var i = 0; i < scene.sceneWebLinks.length; i++) { //refresh themz
                    console.log("sceneWebLink id: " + scene.sceneWebLinks[i].link_id);
                    var urlThumb = s3.getSignedUrl('getObject', {Bucket: 'servicemedia.web', Key: scene.sceneWebLinks[i].link_id + ".thumb.jpg", Expires: 6000});
                    var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia.web', Key: scene.sceneWebLinks[i].link_id + ".half.jpg", Expires: 6000});
                    var urlStandard = s3.getSignedUrl('getObject', {Bucket: 'servicemedia.web', Key: scene.sceneWebLinks[i].link_id + ".standard.jpg", Expires: 6000});
                    scene.sceneWebLinks[i].urlThumb = urlThumb;
                    scene.sceneWebLinks[i].urlHalf = urlHalf;
                    scene.sceneWebLinks[i].urlStandard = urlStandard;

                }
            }

            if (scene.scenePostcards != null && scene.scenePostcards.length > 0) {
                var postcards = [];
//              for (var i = 0; i < sceneResponse.scenePostcards.length; i++) { //refresh themz
                async.each (scene.scenePostcards, function (postcardID, callbackz) {
//                                console.log("scenepostcard id: " + sceneResponse.scenePostcards[i]);
//                    console.log("scenepostcard id: " + postcardID);
                    var oo_id = ObjectID(postcardID);
                    db.image_items.findOne({"_id": oo_id}, function (err, picture_item) {
                        if (err || !picture_item) {
                            console.log("error getting picture items 1: " + err);
//                                        callback(err);
//                                        callback(null);
                            callbackz();
                        } else {
                            var urlThumb = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".thumb." + picture_item.filename, Expires: 6000});
                            var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".half." + picture_item.filename, Expires: 6000});

                            var postcard = {};
                            postcard.userID = picture_item.userID;
                            postcard._id = picture_item._id;
                            postcard.sceneID = scene._id;
                            postcard.sceneShortID = scene.short_id;
                            postcard.urlThumb = urlThumb;
                            postcard.urlHalf = urlHalf;
                            postcards.push(postcard);
//                            console.log("pushing postcard: " + JSON.stringify(postcard));
                            callbackz();
                        }

                    });

                }, function(err) {
                   
                    if (err) {
                        
                        
                        console.log('A file failed to process');
//                        callback(null, postcards);
                    } else {
                        console.log('All files have been processed successfully');
//                        callback(null, postcards);
//                                        };
                        scene.postcards = postcards;
                        res.send(scene);
                    }
                });

            } else {
                res.send(scene);
            }
        }
    });
});

app.get('/availablescenes/:_id',  requiredAuthentication, function (req, res) {

    var availableScenesResponse = {};
    var availableScenes = [];
    availableScenesResponse.availableScenes = availableScenes;

    //mongolian "OR" syntax...
    db.scenes.find( {$and: [{ "user_id": req.params._id}, { sceneShareWithPublic: true }]}, function (err, scenes) {
        if (err || !scenes) {
            console.log("cain't get no scenes... " + err)
        } else {
            async.each(scenes,
                function (scene, callback) {
                    if (scene.scenePostcards != null && scene.scenePostcards.length > 0) {
                        var oo_id = ObjectID(scene.scenePostcards[0]); //TODO randomize? or ensure latest?  or use assigned default?
                        db.image_items.findOne({"_id": oo_id}, function (err, picture_item) {
                            if (err || !picture_item || picture_item.length == 0) {
                                console.log("error getting postcard for availablescenes: 2" + err);
                            } else {
                                var item_string_filename = JSON.stringify(picture_item.filename);
                                item_string_filename = item_string_filename.replace(/\"/g, "");
                                var item_string_filename_ext = getExtension(item_string_filename);
                                var expiration = new Date();
                                expiration.setMinutes(expiration.getMinutes() + 30);
                                var baseName = path.basename(item_string_filename, (item_string_filename_ext));
//                                    console.log(baseName);
                                var thumbName = 'thumb.' + baseName + item_string_filename_ext;
                                var halfName = 'half.' + baseName + item_string_filename_ext;
                                var quarterName = 'quarter.' + baseName + item_string_filename_ext;
                                var standardName = 'standard.' + baseName + item_string_filename_ext;
                                var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + halfName, Expires: 6000}); //just send back thumbnail urls for list
                                var urlQuarter = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + quarterName, Expires: 6000}); //just send back thumbnail urls for list
                                var availableScene = {
                                    sceneDomain: scene.sceneDomain,
                                    sceneTitle: scene.sceneTitle,
                                    sceneKey: scene.short_id,
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
                            }
                            callback();
                        });
                    } else {
                        callback();
                    }
                },
                function (err) {
                    res.send(availableScenesResponse);
                }
            );
        }
    });
});
/* //superfluous
app.get('/domain_scenes/:domain',  function (req, res) {
    var availableScenesResponse = {};
    var availableScenes = [];
    availableScenesResponse.availableScenes = availableScenes;
    console.log("tryna get domain " + req.params.domain);
    //mongolian "OR" syntax...
    db.scenes.find( {$and: [{ "sceneDomain": req.params.domain}, { sceneShareWithPublic: true }]}, function (err, scenes) {
        if (err || !scenes) {
            console.log("cain't get no scenes... " + err)
        } else {
            async.each(scenes,
                function (scene, callback) {
                    if (scene.scenePostcards != null && scene.scenePostcards.length > 0) {
                        var oo_id = ObjectID(scene.scenePostcards[0]); //TODO randomize? or ensure latest?  or use assigned default?
                        db.image_items.findOne({"_id": oo_id}, function (err, picture_item) {
                            if (err || !picture_item) {
                                console.log("error getting postcard for availablescenes: 2" + err);

                            } else {
                                var item_string_filename = JSON.stringify(picture_item.filename);
                                item_string_filename = item_string_filename.replace(/\"/g, "");
                                var item_string_filename_ext = getExtension(item_string_filename);
                                var expiration = new Date();
                                expiration.setMinutes(expiration.getMinutes() + 30);
                                var baseName = path.basename(item_string_filename, (item_string_filename_ext));
//                                    console.log(baseName);
                                var thumbName = 'thumb.' + baseName + item_string_filename_ext;
                                var halfName = 'half.' + baseName + item_string_filename_ext;
                                var quarterName = 'quarter.' + baseName + item_string_filename_ext;
                                var standardName = 'standard.' + baseName + item_string_filename_ext;
                                var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + halfName, Expires: 6000}); //just send back thumbnail urls for list
                                var urlQuarter = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + quarterName, Expires: 6000}); //just send back thumbnail urls for list
                                var primaryAudioUrl = "";
                                var availableScene = {
                                    sceneTitle: scene.sceneTitle,
                                    sceneKey: scene.short_id,
                                    sceneDescription: scene.sceneDescription,
                                    sceneKeynote: scene.sceneKeynote,
                                    sceneStatus: scene.sceneShareWithPublic ? "public" : "private",
                                    sceneOwner: scene.userName ? "" : scene.userName,
//                                    scenePrimaryAudioUrl: primaryAudioUrl,
                                    scenePostcardQuarter: urlQuarter,
                                    scenePostcardHalf: urlHalf
                                };
//                                if (scene.scenePrimaryAudioID != null) {
//                                    var o_id = ObjectID(scene.scenePrimaryAudioID);
//
//                                    db.audio_items.findOne({_id: o_id}, function (err, audio_item) {
//                                        if (err || !audio_item) {
//                                            console.log("error getting audio items: " + err);
//                                            callback();
//                                        } else {
//                                            var item_string_filename = JSON.stringify(audio_item.filename);
//                                            console.log("audio filename: " + item_string_filename);
//                                            item_string_filename = item_string_filename.replace(/\"/g, "");
//                                            var item_string_filename_ext = getExtension(item_string_filename);
//                                            var expiration = new Date();
//                                            expiration.setMinutes(expiration.getMinutes() + 1000);
//                                            var baseName = path.basename(item_string_filename, (item_string_filename_ext));
//                                            //console.log(baseName);
//                                            var mp3Name = baseName + '.mp3';
//                                            var primaryAudioUrl = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_item.userID, Key: audio_item._id + "." + mp3Name, Expires: 60000});
////                                            availableScene.primaryAudioUrl = primaryAudioUrl;
//
//                                        }
//                                    });
//                                }


                                availableScenesResponse.availableScenes.push(availableScene);
                            }
                            callback();
                        });
                    } else {
                        callback();
                    }
                },
                function (err) {
                    res.send(availableScenesResponse);
                }
            );
        }
    });
});
*/
app.get('/available_user_scenes/:user_id', requiredAuthentication, function(req,res){ //authenticated scenes, either owned by user or accessible via acl
    var availableScenesResponse = {};
    var availableScenes = [];
    var availableScene = {};
    availableScenesResponse.availableScenes = availableScenes;
    console.log("tryna get domain " + req.params.domain);
    //mongolian "OR" syntax...
    var query = {user_id: req.params.user_id};
    // if (req.params.domain == "servicemedia.net") { //show all public scenes for servicemedia
    //     query = {sceneShareWithPublic: true};
    // } else {
    //     query = {$and: [{ "sceneDomain": req.params.domain}, {sceneShareWithPublic: true }]};
    // }
    // db.scenes.find( {$and: [{ "sceneDomain": req.params.domain}, {sceneShareWithPublic: true }]}, function (err, scenes) {
        db.scenes.find( query, function (err, scenes) {
        if (err || !scenes) {
            console.log("cain't get no scenes... " + err)
        } else {
            console.log("gots " + scenes.length + " scenes")
            async.each(scenes,
                function (scene, cb) {
                    availableScene = {};
                    console.log("scene name : " + scene.sceneTitle);
                    async.waterfall([
                            function (callback) {
                                if (scene.scenePostcards != null && scene.scenePostcards.length > 0) { //cain't show without no postcard
                                    var oo_id = ObjectID(scene.scenePostcards[0]); //TODO randomize? or ensure latest?  or use assigned default?
                                    db.image_items.findOne({"_id": oo_id}, function (err, picture_item) {
                                        if (err || !picture_item) {
                                            console.log("error getting postcard for availablescenes: 2" + err);
                                            cb();
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
                                            callback(null, availableScene);
                                        }
                                    });
                                } else {
                                    cb(); //no postcards, next...
                                }
                            },

                            function (avScene, callback) {
                                console.log ("tryna get audio " + scene.scenePrimaryAudioID + " for " + JSON.stringify(avScene) );
                                if (scene.scenePrimaryAudioID != null) {
                                    var o_id = ObjectID(scene.scenePrimaryAudioID );

                                    db.audio_items.findOne({_id: o_id}, function (err, audio_item) {
                                        if (err || !audio_item) {
                                            console.log("error getting audio items: " + err);
                                            callback(null,err);
                                        } else {
                                            var item_string_filename = JSON.stringify(audio_item.filename);
                                            console.log("audio filename: " + item_string_filename);
                                            item_string_filename = item_string_filename.replace(/\"/g, "");
                                            var item_string_filename_ext = getExtension(item_string_filename);
                                            var expiration = new Date();
                                            expiration.setMinutes(expiration.getMinutes() + 1000);
                                            var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                                            //console.log(baseName);
                                            var mp3Name = baseName + '.mp3';
                                            var primaryAudioUrl = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_item.userID + "/" + audio_item._id + "." + mp3Name, Expires: 60000});
                                            avScene.primaryAudioUrl = primaryAudioUrl;
                                            console.log("tryna push " + primaryAudioUrl + " to scene number " + availableScenesResponse.availableScenes.length);
                                            availableScenesResponse.availableScenes.push(avScene);
                                            callback(null, 'done');
                                        }
                                    });
                                } else {
                                    availableScenesResponse.availableScenes.push(avScene);
                                    callback(null, 'done');
                                }
                            }
                        ], //waterfall async end
                        function (err, result) { // #last function, close async
                            console.log("available domain scene waterfall done: " + result);
                            cb();
                        }
                    );
                }, // each scene async end
                function (err) {
//                    callbag();
                    availableScenesResponse.availableScenes.sort(function(a, b) {
                        return b.sceneLastUpdate - a.sceneLastUpdate;
                    });
                    JSON.stringify(availableScenesResponse);
                    res.send(availableScenesResponse);
                }
            );
        }
    });
});
// app.get('/designated ')
app.get('/available_domain_scenes/:domain',  function (req, res) { //public scenes for this app's domain name, used by public websites
    var availableScenesResponse = {};
    var availableScenes = [];
    var availableScene = {};
    availableScenesResponse.availableScenes = availableScenes;
    // console.log("tryna get domain " + req.params.domain + " adn id " + req.params.user_id);
    //mongolian "OR" syntax...
    var query = {};
    if (req.params.domain == "servicemedia.net") { //show all public scenes for servicemedia
        query = {sceneShareWithPublic: true};
        // if (req.params.user_id != null && req.params.user_id.Length > 8)
        // query = {$and: [{ "user_id": req.params.user_id}, {sceneShareWithPublic: true }]}; //also all scenes with this user_id
    } else {
        query = {$and: [{ "sceneDomain": req.params.domain}, {sceneShareWithPublic: true }]};
        // if (req.params.user_id != null && req.params.user_id.Length > 8)
        // query = {$and: [{ "sceneDomain": req.params.domain}, { "user_id": req.params.user_id}, {sceneShareWithPublic: true }]}; //also all scenes with this user_id
    }
    // db.scenes.find( {$and: [{ "sceneDomain": req.params.domain}, {sceneShareWithPublic: true }]}, function (err, scenes) {
        console.log("available scene query: "+ JSON.stringify(query));
        db.scenes.find( query, function (err, scenes) {
        if (err || !scenes) {
            console.log("cain't get no scenes... " + err)
        } else {
            console.log("gots " + scenes.length + " scenes")
            async.each(scenes,
                function (scene, cb) {
                    availableScene = {};
                    // console.log("scene name : " + scene.sceneTitle);
                    async.waterfall([
                            function (callback) {
                                if (scene.scenePostcards != null && scene.scenePostcards.length > 0) { //cain't show without no postcard
                                    var postcardIndex = Math.floor(Math.random()*scene.scenePostcards.length);
                                    var oo_id = ObjectID(scene.scenePostcards[postcardIndex]); //TODO randomize? or ensure latest?  or use assigned default?
                                    db.image_items.findOne({"_id": oo_id}, function (err, picture_item) {
                                        if (err || !picture_item) {
                                            console.log("error getting postcard for availablescenes: 2" + err);
                                            if (req.params.user_id != null && req.params.user_id && req.params.user_id == scene.user_id) { //show incomplete scenes by this user
                                                availableScene = {
                                                    sceneTitle: scene.sceneTitle,
                                                    sceneKey: scene.short_id,
                                                    sceneType: scene.sceneType,
                                                    sceneTags: scene.sceneTags,
                                                    sceneAltURL: scene.sceneAltURL,
                                                    sceneLastUpdate: scene.sceneLastUpdate,
                                                    sceneDescription: scene.sceneDescription,
                                                    sceneKeynote: scene.sceneKeynote,
                                                    sceneCategory: scene.sceneCategory,
                                                    sceneSource: scene.sceneSource,
                                                    sceneAndroidOK: scene.sceneAndroidOK,
                                                    sceneIosOK: scene.sceneIosOK,
                                                    sceneWindowsOK: scene.sceneWindowsOK,
                                                    sceneStatus: scene.sceneShareWithPublic ? "public" : "private",
                                                    sceneOwner: scene.userName ? "" : scene.userName,
                                                    scenePostcardQuarter: "nilch",
                                                    scenePostcardHalf: "nilch",
                                                    sceneAndroidOK: scene.sceneAndroidOK,
                                                    sceneIosOK: scene.sceneIosOK,
                                                    sceneWindowsOK: scene.sceneWindowsOK
                                                };
                                                callback(null, availableScene);
                                            } else {
                                                cb(); //no postcards, next...
                                            }
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
                                            var originalName = 'original.' + baseName + item_string_filename_ext;
                                            var urlOrig = "";
                                            if (req.params.domain == "xrswim.com") { //return orig ones for xrswim..
                                                urlOrig = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/originals/" + picture_item._id + "." + originalName, Expires: 6000});
                                                // s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + origName, Expires: 6000}); //just send back thumbnail urls for list
                                            }
                                            var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + halfName, Expires: 6000}); //just send back thumbnail urls for list
                                            var urlQuarter = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + quarterName, Expires: 6000}); //just send back thumbnail urls for list
                                            availableScene = {
                                                sceneTitle: scene.sceneTitle,
                                                sceneKey: scene.short_id,
                                                sceneType: scene.sceneType,
                                                sceneWebType: scene.sceneWebType,
                                                sceneAltURL: scene.sceneAltURL,
                                                sceneLastUpdate: scene.sceneLastUpdate,
                                                sceneDescription: scene.sceneDescription,
                                                sceneKeynote: scene.sceneKeynote,
                                                sceneCategory: scene.sceneCategory,
                                                sceneSource: scene.sceneSource,
                                                sceneTags: scene.sceneTags,
                                                // sceneWebGLOK: scene.sceneWebGLOK,
                                                sceneAndroidOK: scene.sceneAndroidOK,
                                                sceneIosOK: scene.sceneIosOK,
                                                sceneWindowsOK: scene.sceneWindowsOK,
                                                sceneStatus: scene.sceneShareWithPublic ? "public" : "private",
                                                sceneOwner: scene.userName,
                                                scenePostcardQuarter: urlQuarter,
                                                scenePostcardHalf: urlHalf,
                                                scenePostcardOriginal: urlOrig
                                            };
                                            callback(null, availableScene);
                                        }
                                    });
                                } else {
                                    if (req.params.user_id != null && req.params.user_id && req.params.user_id == scene.user_id) { //show incomplete scenes by this user
                                        availableScene = {
                                            sceneTitle: scene.sceneTitle,
                                            sceneKey: scene.short_id,
                                            sceneType: scene.sceneType,
                                            sceneLastUpdate: scene.sceneLastUpdate,
                                            sceneDescription: scene.sceneDescription,
                                            sceneKeynote: scene.sceneKeynote,
                                            // sceneWebGLOK: scene.sceneWebGLOK,
                                            sceneAndroidOK: scene.sceneAndroidOK,
                                            sceneIosOK: scene.sceneIosOK,
                                            sceneWindowsOK: scene.sceneWindowsOK,
                                            sceneStatus: scene.sceneShareWithPublic ? "public" : "private",
                                            sceneOwner: scene.userName ? "" : scene.userName,
                                            scenePostcardQuarter: "nilch",
                                            scenePostcardHalf: "nilch"
                                        };
                                        callback(null, availableScene);
                                    } else {
                                        cb(); //no postcards, next...
                                    }
                                }
                            },
                            function (avScene, callback) {
                                // console.log ("tryna get audio " + scene.scenePrimaryAudioID + " for " + JSON.stringify(avScene) );
                                if (scene.scenePrimaryAudioStreamURL != null && scene.scenePrimaryAudioStreamURL != "" && scene.scenePrimaryAudioStreamURL.length > 6) { 
                                    // avScene.scenePrimaryAudioStreamURL = scene.scenePrimaryAudioStreamURL; //these tend to fsu on safari
                                }
                                if (scene.scenePrimaryAudioID != null && scene.scenePrimaryAudioID != "" && scene.scenePrimaryAudioID.length > 8) {
                                    var o_id = ObjectID(scene.scenePrimaryAudioID );

                                    db.audio_items.findOne({_id: o_id}, function (err, audio_item) {
                                        if (err || !audio_item) {
                                            console.log("error getting audio items: " + err);
                                            callback(null,err);
                                        } else {
                                            var item_string_filename = JSON.stringify(audio_item.filename);
                                            // console.log("audio filename: " + item_string_filename);
                                            item_string_filename = item_string_filename.replace(/\"/g, "");
                                            var item_string_filename_ext = getExtension(item_string_filename);
                                            var expiration = new Date();
                                            expiration.setMinutes(expiration.getMinutes() + 1000);
                                            var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                                            //console.log(baseName);
                                            var mp3Name = baseName + '.mp3';
                                            var primaryAudioUrl = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_item.userID + "/audio/" + audio_item._id + "." + mp3Name, Expires: 60000});
                                            avScene.primaryAudioUrl = primaryAudioUrl;
                                            // console.log("tryna push " + primaryAudioUrl + " to scene number " + availableScenesResponse.availableScenes.length);
                                            availableScenesResponse.availableScenes.push(avScene);
                                            callback(null, 'done');
                                        }
                                    });
                                } else {
                                    availableScenesResponse.availableScenes.push(avScene);
                                    callback(null, 'done');
                                }
                            }
                        ], //waterfall async end
                        function (err, result) { // #last function, close async
                            // console.log("available domain scene waterfall done with count: " + availableScenesResponse.availableScenes.length);
                            cb();
                        }
                    );
                }, // each scene async end
                function (err) {
//                    callbag();
                    availableScenesResponse.availableScenes.sort(function(a, b) {
                        return b.sceneLastUpdate - a.sceneLastUpdate;
                    });
                    JSON.stringify(availableScenesResponse);
                    res.send(availableScenesResponse);
                }
            );
        }
    });
});

app.get('/available_domain_scenes/:domain/:user_id/:platform_id',  requiredAuthentication, function (req, res) { //public scenes for this app's domain name, w/ platform filter //TODO authenticate, check acl

    var availableScenesResponse = {};
    var availableScenes = [];
    var availableScene = {};
    var query = {};
    availableScenesResponse.availableScenes = availableScenes;
    var userStatus = "nilch";

    async.waterfall([
        function (callback) { //do the user lookup
            console.log("tryna lookup user id " + req.params.user_id);
            if (req.params.user_id != "nilch" && req.params.user_id != "guest" && req.params.user_id != "") {
                var oo_id = ObjectID(req.params.user_id);
                db.users.findOne({_id: oo_id}, function (err, user) {   //check user status
                    if (err != null) {
                        console.log("error finding user " + req.params.user_id);
                        callback(err);
                    } else {
                        console.log("gotsa user " + user._id + " authLevel " + user.authLevel + " status " + user.status);
                        if (user.authLevel != null && user.authLevel != undefined &&  user.status == "validated") {
                        userStatus = "subscriber";
                        console.log("gotsa subscriber!");
                        }
                        callback();
                    }
                });
            } else {
                callback();
            }
        },
        function (calllback) {
            var platformString = "";
            if (req.params.platform_id == "1") {
                platformString = "sceneWindowsOK";
            } else if (req.params.platform_id == "2") {
                platformString = "sceneAndroidOK";
            } else if (req.params.platform_id == "3") {
                platformString = "sceneIosOK";
            } else if (req.params.platform_id == "4") {
                platformString = "sceneWebGLOK";
            }
            if (req.params.domain == "servicemedia.net") { //guest query?  show all public scenes for servicemedia
                // query = {sceneShareWithPublic: true};
                query = {$and: [{ [platformString]: true}, {sceneShareWithPublic: true }, {sceneStickyness: { $lt: 4 }}]};
                // if (req.params.user_id != null && req.params.user_id.Length > 8)
                // query = {$or: [{ "user_id": req.params.user_id}, {sceneShareWithPublic: true }]}; //also all scenes with this user_id
            } else if (req.params.platform_id == "4") { // return all for now..
                query = {$and: [{ "sceneDomain": req.params.domain}, {sceneShareWithPublic: true }]};
                // if (req.params.user_id != null && req.params.user_id.Length > 8)
                // query = {$or: [{ "sceneDomain": req.params.domain}, { "user_id": req.params.user_id}, {sceneShareWithPublic: true }]};
            } else {
                query = {$and: [{ "sceneDomain": req.params.domain}, {sceneShareWithPublic: true }, { [platformString]: true}]};
                // if (req.params.user_id != null && req.params.user_id.Length > 8)
                // query = {$or: [{ "sceneDomain": req.params.domain}, { "user_id": req.params.user_id}, {sceneShareWithPublic: true }]};
            }
            if (userStatus == "subscriber") { //not public
                if (req.params.domain == "servicemedia.net") {
                    query = {$and: [{ [platformString]: true}, {$or: [{ "user_id": req.params.user_id}, {sceneShareWithSubscribers: true }, {sceneShareWithPublic: true }]}]};
                } else {
                    query = {$and: [{ [platformString]: true}, { "sceneDomain": req.params.domain}, {$or: [{ "user_id": req.params.user_id}, {sceneShareWithSubscribers: true }, {sceneShareWithPublic: true }]}]};
                }
            }

            console.log("scene query : " + JSON.stringify(query));
            db.scenes.find( query, function (err, scenes) {
            if (err || !scenes) {
                console.log("cain't get no scenes... " + err);
                calllback(err);
            } else {
                console.log("gots " + scenes.length + " scenes");
                async.each(scenes,
                    function (scene, cb) {
                        availableScene = {};
                        // console.log("scene name : " + scene.sceneTitle);
                        async.waterfall([ //ooo, nested waterfall
                                function (callback) {
                                    if (scene.scenePostcards != null && scene.scenePostcards.length > 0) { //cain't show without no postcard
                                        var postcardIndex = Math.floor(Math.random()*scene.scenePostcards.length);
                                        var oo_id = ObjectID(scene.scenePostcards[postcardIndex]); //TODO randomize? or ensure latest?  or use assigned default?
                                        db.image_items.findOne({"_id": oo_id}, function (err, picture_item) {
                                            if (err || !picture_item) {
                                                console.log("error getting postcard for availablescenes: 2" + err);
                                                if (req.params.user_id != null && req.params.user_id && req.params.user_id == scene.user_id) { //show incomplete scenes by this user
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
                                                        scenePostcardQuarter: "nilch",
                                                        scenePostcardHalf: "nilch"
                                                    };
                                                    callback(null, availableScene);
                                                } else {
                                                    cb(); //no postcards, next...
                                                }
                                            } else {
                                                (async () => {
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
                                                    var urlHalf = await ReturnPresignedUrl(process.env.S3_ROOT_BUCKET_NAME, "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + halfName, 6000); //just send back thumbnail urls for list
                                                    var urlQuarter = await ReturnPresignedUrl(process.env.S3_ROOT_BUCKET_NAME, "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + quarterName, 6000); //just send back thumbnail urls for list
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
                                                    callback(null, availableScene);
                                                })();
                                            }
                                        });
                                    } else {
                                        if (req.params.user_id != null && req.params.user_id && req.params.user_id == scene.user_id) { //show incomplete scenes by this user
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
                                                scenePostcardQuarter: "nilch",
                                                scenePostcardHalf: "nilch"
                                            };
                                            callback(null, availableScene);
                                        } else {
                                            cb(); //no postcards, next...
                                        }
                                    }
                            },
                            function (avScene, callback) {
                                // console.log ("tryna get audio " + scene.scenePrimaryAudioID + " for " + JSON.stringify(avScene) );
                                if (scene.scenePrimaryAudioID != null && ObjectID.isValid(scene.scenePrimaryAudioID)) {
                                    var o_id = ObjectID(scene.scenePrimaryAudioID);
                                    db.audio_items.findOne({_id: o_id}, function (err, audio_item) {
                                        if (err || !audio_item) {
                                            console.log("error getting audio items: " + err);
                                            callback(null,err);
                                        } else {
                                            (async () => {
                                                var item_string_filename = JSON.stringify(audio_item.filename);
                                                // console.log("audio filename: " + item_string_filename);
                                                item_string_filename = item_string_filename.replace(/\"/g, "");
                                                var item_string_filename_ext = getExtension(item_string_filename);
                                                var expiration = new Date();
                                                expiration.setMinutes(expiration.getMinutes() + 1000);
                                                var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                                                //console.log(baseName);
                                                var mp3Name = baseName + '.mp3';
                                                // var primaryAudioUrl = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_item.userID + "/" + audio_item._id + "." + mp3Name, Expires: 60000});
                                                var primaryAudioUrl = await ReturnPresignedUrl(process.env.S3_ROOT_BUCKET_NAME, "users/" + audio_item.userID + "/" + audio_item._id + "." + mp3Name, 10000);
                                                avScene.primaryAudioUrl = primaryAudioUrl;
                                                // console.log("tryna push " + primaryAudioUrl + " to scene number " + availableScenesResponse.availableScenes.length);
                                                availableScenesResponse.availableScenes.push(avScene);
                                                callback(null, 'done');
                                            })();
                                        }
                                    });
                                } else {
                                    availableScenesResponse.availableScenes.push(avScene);
                                    callback(null, 'done');
                                }
                            }
                        ], //inner waterfall async end
                        function (err, result) { // #last function, close async
                            // console.log("available domain scene waterfall done with count: " + availableScenesResponse.availableScenes.length);
                                    cb();
                                }
                            );
                            // calllback();
                        }, // each scene async end
                    function (err) {// outer waterfall, including user lookup
    //                    callbag();
                        availableScenesResponse.availableScenes.sort(function(a, b) {
                            return b.sceneLastUpdate - a.sceneLastUpdate;
                        });
                        JSON.stringify(availableScenesResponse);
                        res.send(availableScenesResponse);
                        }
                    );
                }
            });
        }
    ], //waterfall async end
    function (err, result) { // #last function, close async
        console.log("available domain scene waterfall done with count: " + availableScenesResponse.availableScenes.length);
        // callback();
        }
    );
});


/* // um, dunno...
app.post('/linkable_scenes/',  function (req, res) {

    var availableScenesResponse = {};
    var availableScenes = [];
    var availableScene = {};
    availableScenesResponse.availableScenes = availableScenes;
    console.log("tryna get list of available scenes " + req.body.scenes);
    //mongolian "OR" syntax...

    db.scenes.find( {$and: [{ "sceneDomain": req.params.domain}, { sceneShareWithPublic: true }]}, function (err, scenes) {
        if (err || !scenes) {
            console.log("cain't get no scenes... " + err)
        } else {
            console.log("gots " + scenes.length + " scenes")
            async.each(scenes,

                function (scene, cb) {
                    availableScene = {};
                    console.log("scene name : " + scene.sceneTitle);
                    async.waterfall([

                            function (callback) {

                                if (scene.scenePostcards != null && scene.scenePostcards.length > 0) {
                                    var oo_id = ObjectID(scene.scenePostcards[0]); //TODO randomize? or ensure latest?  or use assigned default?
                                    db.image_items.findOne({"_id": oo_id}, function (err, picture_item) {
                                        if (err || !picture_item) {
                                            console.log("error getting postcard for availablescenes: 2" + err);
                                            cb();
                                        } else {

                                            var item_string_filename = JSON.stringify(picture_item.filename);
                                            item_string_filename = item_string_filename.replace(/\"/g, "");
                                            var item_string_filename_ext = getExtension(item_string_filename);
                                            var expiration = new Date();
                                            expiration.setMinutes(expiration.getMinutes() + 30);
                                            var baseName = path.basename(item_string_filename, (item_string_filename_ext));
//                                    console.log(baseName);
                                            var thumbName = 'thumb.' + baseName + item_string_filename_ext;
                                            var halfName = 'half.' + baseName + item_string_filename_ext;
                                            var quarterName = 'quarter.' + baseName + item_string_filename_ext;
                                            var standardName = 'standard.' + baseName + item_string_filename_ext;

                                            var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + halfName, Expires: 6000}); //just send back thumbnail urls for list
                                            var urlQuarter = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + quarterName, Expires: 6000}); //just send back thumbnail urls for list
                                            availableScene = {
                                                sceneTitle: scene.sceneTitle,
                                                sceneKey: scene.short_id,
                                                sceneLastUpdate: scene.sceneLastUpdate,
                                                sceneDescription: scene.sceneDescription,
                                                sceneKeynote: scene.sceneKeynote,
                                                sceneStatus: scene.sceneShareWithPublic ? "public" : "private",
                                                sceneOwner: scene.userName ? "" : scene.userName,
                                                scenePostcardQuarter: urlQuarter,
                                                scenePostcardHalf: urlHalf
                                            };


                                            callback(null, availableScene);
                                        }

                                    });
                                } else {
//                                    callback(null, err);
                                    cb();
                                }
                            },

                            function (avScene, callback) {
                                console.log ("tryna get audio " + scene.scenePrimaryAudioID + " for " + JSON.stringify(avScene) );
                                if (scene.scenePrimaryAudioID != null) {
                                    var o_id = ObjectID(scene.scenePrimaryAudioID );

                                    db.audio_items.findOne({_id: o_id}, function (err, audio_item) {
                                        if (err || !audio_item) {
                                            console.log("error getting audio items: " + err);
//                                            availableScenesResponse.availableScenes.push(availableScene);
                                            callback(null,err);
                                        } else {
                                            var item_string_filename = JSON.stringify(audio_item.filename);
                                            console.log("audio filename: " + item_string_filename);
                                            item_string_filename = item_string_filename.replace(/\"/g, "");
                                            var item_string_filename_ext = getExtension(item_string_filename);
                                            var expiration = new Date();
                                            expiration.setMinutes(expiration.getMinutes() + 1000);
                                            var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                                            //console.log(baseName);
                                            var mp3Name = baseName + '.mp3';
                                            var primaryAudioUrl = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_item.userID + "/" + audio_item._id + "." + mp3Name, Expires: 60000});

                                            avScene.primaryAudioUrl = primaryAudioUrl;

//                                            availableScenesResponse.availableScenes.push(availableScene);

                                            console.log("tryna push " + primaryAudioUrl + " to scene number " + availableScenesResponse.availableScenes.length);
                                            availableScenesResponse.availableScenes.push(avScene);
//                                            callback(); //send them along
                                            callback(null, 'done');
                                        }
                                    });
                                } else {
                                    availableScenesResponse.availableScenes.push(avScene);
                                    callback(null, 'done');
                                }
//                                callback(null, 'done');
//                                callback();

                            }


                        ], //waterfall async end
                        function (err, result) { // #last function, close async
//                            res.json(sceneResponse);

//                            console.log("waterfall done: " + result);
                            console.log("waterfall done: " + result);
                            cb();
//                            cb();
//                            callback();
//                            cb();
                        }


                    );


                }, // each scene async end
                function (err) {
//                    callbag();
                    JSON.stringify(availableScenesResponse);
                    res.send(availableScenesResponse);

                }
            );
        }
    });
});
*/

app.get('/publicscenes', function (req, res) { //deprecated, see available scenes above...
    console.log("host is " + req.get('host'));
    // if (req.get('host') == "servicemedia.net") {
     
    var availableScenesResponse = {};
    var availableScenes = [];
    availableScenesResponse.availableScenes = availableScenes;

    // query = {$and: [{ "sceneDomain": req.params.domain}, {sceneShareWithPublic: true }, { [platformString]: true}]};
    db.scenes.find({$and: [{sceneShareWithPublic: true}, {sceneStickyness: {$lt: 4}}]}, function (err, scenes) {
        if (err || !scenes) {
            console.log("cain't get no publicscenes... " + err);

        } else {
            console.log("gots " + scenes.length + "publicscenes...");
            async.each(scenes,
                // 2nd param is the function that each item is passed to
                function (scene, callback) {
                    if (scene.scenePostcards != null && scene.scenePostcards.length > 0 && scene.scenePostcards[0] != undefined) {
                        postcardIndex = getRandomInt(0, scene.scenePostcards.length - 1);
                        var oo_id = ObjectID(scene.scenePostcards[postcardIndex]); //TODO randomize? or ensure latest?  or use assigned default?
                        db.image_items.findOne({"_id": oo_id}, function (err, picture_item) {

                            if (err || !picture_item || picture_item.length == 0) {
                                console.log("error getting picture items: 3" + JSON.stringify(scene.scenePostcards[postcardIndex]));

                            } else {
                                var item_string_filename = JSON.stringify(picture_item.filename);
                                item_string_filename = item_string_filename.replace(/\"/g, "");
                                var item_string_filename_ext = getExtension(item_string_filename);
                                var expiration = new Date();
                                expiration.setMinutes(expiration.getMinutes() + 30);
                                var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                                var thumbName = 'thumb.' + baseName + item_string_filename_ext;
                                var halfName = 'half.' + baseName + item_string_filename_ext;
                                var quarterName = 'quarter.' + baseName + item_string_filename_ext;
                                // var standardName = 'standard.' + baseName + item_string_filename_ext;

                                (async () => {  // to flex with minio, etc..
                                    try {
                                        var urlHalf = await ReturnPresignedUrl(process.env.S3_ROOT_BUCKET_NAME, "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + halfName, 6000);
                                        var urlQuarter = await ReturnPresignedUrl(process.env.S3_ROOT_BUCKET_NAME, "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + quarterName, 6000);
                                        // console.log("tyryna get mibno urls... " + urlHalf);
                                        var tempOwnerName = "test"
                                        var availableScene = {
                                            sceneWindowsOK: scene.sceneWindowsOK,
                                            sceneAndroidOK: scene.sceneAndroidOK,
                                            sceneIosOK: scene.sceneIosOK,
                                            sceneDomain: scene.sceneDomain,
                                            sceneTitle: scene.sceneTitle,
                                            sceneKey: scene.short_id,
                                            sceneStatus: scene.sceneShareWithPublic ? "public" : "private",
        //                                  sceneOwner: scene.userName,
                                            sceneOwner: tempOwnerName,
                                            scenePostcardHalf: urlHalf,
                                            scenePostcardQuarter: urlQuarter
                                        };
                                        if (availableScene.sceneDomain != "xrswim.com") { //hrm...
                                            availableScenesResponse.availableScenes.push(availableScene);
                                        }
                                        callback();
                                    } catch (e) {
                                        callback(e);
                                    }
                                })();
                            }
                        });
                    } else {
                        callback();
                    }
                },
                // 3rd param is the function to call when everything's done
                function (err) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send(availableScenesResponse);
                    }
                }
            );
        }
    });
});

app.get('/singlescenedata/:scenekey', function (req, res) { //returns a public scene id and standard url for postcard
    var availableScenesResponse = {};
    var availableScenes = [];
    var sckey = req.params.scenekey;
    availableScenesResponse.availableScenes = availableScenes;

    db.scenes.find({$or: [ { short_id: sckey }, { sceneTitle: sckey } ]}, function (err, scenes) {
        if (err || !scenes) {
            console.log("cain't get no scenes... " + err)
            res.send("scene not found");
        } else {
            console.log("got " + scenes.length + " scenes from req " + req.params.scenekey);
            // sceneIndex = getRandomInt(0, scenes.length - 1);
//            async.each(scenes,
            // 2nd param is the function that each item is passed to

            // Call an asynchronous function, often a save() to DB
            //            scene.someAsyncCall(function () {
            // Async call is done, alert via callback
            if (scenes[0].scenePostcards != null && scenes[0].scenePostcards.length > 0) {
                postcardIndex = getRandomInt(0, scenes[0].scenePostcards.length - 1);
//                        db.image_items.find({postcardForScene: scene.short_id}).sort({otimestamp: -1}).limit(maxItems).toArray(function (err, picture_items) {
                console.log("tryna find postcard: " + scenes[0].scenePostcards[postcardIndex]);
                var oo_id = ObjectID(scenes[0].scenePostcards[postcardIndex]); //TODO randomize? or ensure latest?  or use assigned default?
                db.image_items.findOne({"_id": oo_id}, function (err, picture_item) {

                    if (err || !picture_item || picture_item.length == 0) {
                        console.log("error getting picture items for publicsimple" + JSON.stringify(scenes[0].scenePostcards[postcardIndex]));

                    } else {
//                                console.log("# " + picture_items.length);
//                                    for (var i = 0; i < 1; i++) {

                        var item_string_filename = JSON.stringify(picture_item.filename);
                        item_string_filename = item_string_filename.replace(/\"/g, "");
                        var item_string_filename_ext = getExtension(item_string_filename);
                        var expiration = new Date();
                        expiration.setMinutes(expiration.getMinutes() + 30);
                        var baseName = path.basename(item_string_filename, (item_string_filename_ext));
//                                var quarterName = 'quarter.' + baseName + item_string_filename_ext;
                        var halfName = 'half.' + baseName + item_string_filename_ext;

                        var scenedata = scenes[0].short_id + "~" + scenes[0].sceneTitle + "~" + baseName + "~"  + s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + halfName, Expires: 6000}); //just send back a string and munge it
                        res.send(scenedata);
                    }
                });
            } else {
                var scenedata = scenes[0].short_id + "~" + scenes[0].sceneTitle + "~"  + "na" + "~https://servicemedia.s3.amazonaws.com/assets/pics/postcardna.png"; //no postcard but valid scene
                res.send(scenedata);
            }
        }
    });
});

app.get('/publicsinglerandom', function (req, res) { //returns a public scene id and standard url for postcard
    var availableScenesResponse = {};
    var availableScenes = [];
    availableScenesResponse.availableScenes = availableScenes;

    db.scenes.find({ sceneShareWithPublic: true }, function (err, scenes) {
        if (err || !scenes) {
            console.log("cain't get no scenes... " + err)

        } else {

            sceneIndex = getRandomInt(0, scenes.length - 1);
//            async.each(scenes,
            // 2nd param is the function that each item is passed to

            // Call an asynchronous function, often a save() to DB
            //            scene.someAsyncCall(function () {
            // Async call is done, alert via callback
            if (scenes[sceneIndex].scenePostcards != null && scenes[sceneIndex].scenePostcards.length > 0) {
                postcardIndex = getRandomInt(0, scenes[sceneIndex].scenePostcards.length - 1);
//                        db.image_items.find({postcardForScene: scene.short_id}).sort({otimestamp: -1}).limit(maxItems).toArray(function (err, picture_items) {
                console.log("tryna find postcard: " + scenes[sceneIndex].scenePostcards[postcardIndex]);
                var oo_id = ObjectID(scenes[sceneIndex].scenePostcards[postcardIndex]); //TODO randomize? or ensure latest?  or use assigned default?
                db.image_items.findOne({"_id": oo_id}, function (err, picture_item) {

                    if (err || !picture_item || picture_item.length == 0) {
                        console.log("error getting picture items for publicsimple" + JSON.stringify(scenes[sceneIndex].scenePostcards[postcardIndex]));

                    } else {
//                                console.log("# " + picture_items.length);
//                                    for (var i = 0; i < 1; i++) {

                        var item_string_filename = JSON.stringify(picture_item.filename);
                        item_string_filename = item_string_filename.replace(/\"/g, "");
                        var item_string_filename_ext = getExtension(item_string_filename);
                        var expiration = new Date();
                        expiration.setMinutes(expiration.getMinutes() + 30);
                        var baseName = path.basename(item_string_filename, (item_string_filename_ext));
//                                var quarterName = 'quarter.' + baseName + item_string_filename_ext;
                        var standardName = 'standard.' + baseName + item_string_filename_ext;

                        var urlStandard = scenes[sceneIndex].short_id + "~" + s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + "." + standardName, Expires: 6000}); //just send back thumbnail urls for list
                        res.send(urlStandard);
                    }
                });
            }
        }
    });
});

app.post('/newlocation', requiredAuthentication, function (req, res) {

    var location = req.body;
    location.userID = req.session.user._id.toString();
    var timestamp = Math.round(Date.now() / 1000);
    location.lastUpdate = timestamp;
    db.locations.save(location, function (err, saved) {
        if ( err || !saved ) {
            console.log('location not saved..');
            res.send("nilch");
        } else {
            var item_id = saved._id.toString();
            console.log('new location created, id: ' + item_id);
            res.send("created" + item_id);
        }
    });
});
app.get('/userlocations/:u_id', requiredAuthentication, function(req, res) {
    console.log('tryna return userlocations for: ' + req.params.u_id);
    db.locations.find({userID: req.params.u_id}).sort({otimestamp: -1}).toArray( function(err, location_items) {

        if (err || !location_items) {
            console.log("error getting userlocation items: " + err);

        } else {

            res.json(location_items);
            // console.log("returning userlocations for " + req.params.u_id + " " + JSON.stringify(location_items));
        }
    });
});

app.post('/delete_location/',  requiredAuthentication, function (req, res) { //weird, post + path
    console.log("tryna delete key: " + req.body._id);
    var o_id = ObjectID(req.body._id);
    db.locations.remove( { "_id" : o_id }, 1 );
    res.send("deleted");
});

app.get('/userlocation/:p_id', requiredAuthentication, function(req, res) {

    console.log('tryna return location : ' + req.params.p_id);
    var pID = req.params.p_id;
    if (pID != undefined && pID.length > 10) {
    var o_id = ObjectID(pID);
    db.locations.findOne({"_id": o_id}, function(err, location) {
        if (err || !location) {
            console.log("error getting location item: " + err);
        } else {
            res.json(location);
            console.log("returning location item : " + location);
        }
    });
    } else {
        res.send("not a valid location ID!");
    }
});

app.post('/update_location/:_id', requiredAuthentication, function (req, res) {
    console.log(JSON.stringify(req.body));

    var o_id = ObjectID(req.body._id);   
    console.log('location requested : ' + req.body._id);
    db.locations.findOne({ "_id" : o_id}, function(err, location) {
        if (err || !location) {
            console.log("error getting audio items: " + err);
        } else {
            console.log("tryna update location" + req.body._id);
            var timestamp = Math.round(Date.now() / 1000);
            location.lastUpdate = timestamp;
            if (location.type.toLowerCase() == "geographic") {
                db.locations.update( { "_id": o_id }, { $set: {
                    tags: req.body.tags,
                    name: req.body.name,
                    description: req.body.description,
                    latitude: req.body.latitude,
                    longitude: req.body.longitude,
                    lastUpdate: timestamp
                }});
                res.send("updated");
            }
            if (location.type.toLowerCase() == "worldspace") {
                db.locations.update( { "_id": o_id }, { $set: {
                    tags: req.body.tags,
                    name: req.body.name,
                    description: req.body.description,
                    x: req.body.x,
                    y: req.body.y,
                    z: req.body.z,
                    lastUpdate: timestamp
                }});
                res.send("updated");
            } 
        } if (err) {res.send(error)};
    });
});

app.post('/newscene', requiredAuthentication, admin, function (req, res) {
    console.log(req.body);
    var newScene = {};    
//        newScene.title = newScene.title
//        newScene.sceneOwner_id = req.session.user._id.toString();
//        newScene.sceneOwnerName = req.session.user.username;
    newScene.sceneTitle = req.body.title;
    newScene.user_id = req.session.user._id.toString();
    newScene.userName = req.session.user.userName;
    newScene.otimestamp = Math.round(Date.now() / 1000);
    db.scenes.save(newScene, function (err, saved) {
        if ( err || !saved ) {
            console.log('scene not saved..');
            res.send("nilch");
        } else {
            var item_id = saved._id.toString();
            console.log('created new scene id: ' + item_id);
            tempID = "";
            newShortID = "";
            tempID = item_id;
            // newShortID = shortId(tempID);
            newShortID = shortid.generate(); //TODO - externalize and check for collisions!
            var o_id = ObjectID(tempID);
            console.log(tempID + " = " + newShortID);
            db.scenes.update( { _id: o_id }, { $set: { short_id: newShortID }});

            // db.acl.save(
            //     { acl_rule: "read_scene_" + saved._id },  function (err, acl) {
            //         if (err || !acl) {
            //         } else {
            //             db.acl.update({ 'acl_rule': "read_scene_" + saved._id},{ $push: { 'userIDs': req.session.user._id.toString() } });
            //             console.log("ok saved acl");
            //         }
            //     });
            // db.acl.save(
            //     { 'acl_rule': "write_scene_" + saved._id }, function (err, acl) {
            //         if (err || !acl) {
            //         } else {
            //             db.acl.update({ 'acl_rule': "write_scene_" + saved._id },{ $push: { 'userIDs': req.session.user._id.toString() } });
            //             console.log("ok saved acl");
            //         }
            //     });
            res.send("created new scene " + item_id);
        }
    });
});


app.post('/newgroup', requiredAuthentication, function (req, res) {

    var group = req.body;
    console.log("new group data " + JSON.stringify(req.body));
    group.userID = req.session.user._id.toString();
    group.userName = req.session.user.username;
    var timestamp = Math.round(Date.now() / 1000);
    group.lastUpdate = timestamp;
    let items = [];
    group.items = items;
    db.groups.save(group, function (err, saved) {
        if ( err || !saved ) {
            // console.log('group not saved..');
            res.send("error " + err );
        } else {
            var item_id = saved._id.toString();
            console.log('new group created, id: ' + item_id);
            res.send(item_id);
        }
    });
});

app.post('/delete_group/', requiredAuthentication, function (req, res) { 
    var o_id = ObjectID(req.body._id);
    db.groups.remove( { "_id" : o_id }, 1 );
    res.send("delback");
});

app.post('/clone_group/', requiredAuthentication, function (req, res) { 
    console.log("tryna clone group : " + req.body._id);
    var o_id = ObjectID(req.body._id);
    db.groups.findOne({ "_id" : o_id}, function(err, group) {
    if (err || !group) {
        res.send("group not found!");
    } else {
        var clonedgroup = group;
        clonedgroup._id = new ObjectID(); //better way
        clonedgroup.userID = req.session.user._id.toString();
        clonedgroup.userName = req.session.user.username;
        clonedgroup.name = group.name + " clone";
        var timestamp = Math.round(Date.now() / 1000);
        clonedgroup.lastUpdate = timestamp;
        console.log("new group data " + JSON.stringify(clonedgroup));
        db.groups.insert(clonedgroup, function (err, saved) {
            if ( err || !saved ) {
                // console.log('group not saved..');
                res.send("error " + err );
            } else {
                var item_id = saved._id.toString();
                console.log('new group created, id: ' + item_id);
                res.send("cloned group : " + item_id);
            }
        });
    }
    
    });


});

///  maybe later, with cleanup options
// app.post('/delete_scene/:_id', checkAppID, requiredAuthentication, function (req, res) { 
//     console.log("tryna delete key: " + req.body._id);
//     var o_id = ObjectID(req.body._id);
//     db.scenes.remove( { "_id" : o_id }, 1 );
//     res.send("deleted");
// });

app.post('/update_weblink/', requiredAuthentication, function (req, res) { //refresh the websrape
                
    var token=jwt.sign({userId:req.session.user._id},process.env.JWT_SECRET);
    const options = {
        headers: {'X-Access-Token': token}
      };
    const data = {
        "_id" : req.body.sceneID
    };
    axios.post(process.env.GS_HOST + "/scrapeweb/", data, options) //it does a validation lookup over there
    .then((response) => {
      console.log("scrapeweb response: " + response.data);
      res.send("ok");
    })
    .catch(function (error) {
        res.send(error);
    })
    // var dateNow = Date.now();
    // db.weblinks.update({"_id": ObjectID(req.body.sceneID)}, { $set: {"render_date": dateNow}});
    
});

app.post('/weblink/', requiredAuthentication, function (req, res) {
    console.log("req.header: " + req.headers);
    console.log("checkin weblink: " + req.body.link_url + " for scene " + req.body.sceneID);
    var lurl = "";
    lurl = req.body.link_url;
    
    db.weblinks.findOne({ link_url : lurl}, function(err, link) {
        if (err) {
            console.log("error getting link items: " + err);
        } else if (!link) {  //hasn't been scraped before
            console.log("no link item found for " + lurl);
            db.weblinks.save(req.body, function (err, savedlink) {
                if (err || !savedlink) {
                    console.log('link not saved..');
                    res.send("nilch");
                } else {
                    if (process.env.USE_TRANSLOADIT  == true) {
                        var weblinkParams = {
                            'steps': {
                                'extract': {
                                    'robot': '/html/convert',
                                    'url' : req.body.link_url
                                }
                            },
                            'template_id': process.env.TRANSLOADIT_WEBSCRAPE_TEMPLATE,
                            'fields' : { 'link_id' : savedlink._id,
                                'user_id' : req.session.user._id.toString()
                            }
                        };

                        transloadClient.send(weblinkParams, function(ok) {
                            console.log('Success: ' + JSON.stringify(ok));
                            if (ok != null && ok != undefined) {
                                var dateNow = Date.now();
                                db.weblinks.update({"_id": savedlink._id}, { $set: {"render_date": dateNow}});
                            }
                        }, function(err) {
                            console.log('Error: ' + JSON.stringify(err));
    //                                res.send(err);
                        });
                    } else {
                        // console.log("userid = " + req.session.user._id);
                        var token=jwt.sign({userId:req.session.user._id},process.env.JWT_SECRET);
                        const options = {
                            headers: {'X-Access-Token': token}
                          };
                        const data = {
                            "_id" : savedlink._id
                        };
                        axios.post(process.env.GS_HOST + "/scrapeweb/", data, options)
                        .then((response) => {
                            console.log(response.data);
                        })
                        .catch(function (error) {
                            res.end(error);
                        })
                        .then(function () {
                            // console.log('nerp');
                            
                        });
                        db.scenes.update(
                            {'_id': ObjectID(req.body.sceneID)},
                            {$push: { 'sceneWebLinks': savedlink._id.toString() } }
                        );
                        var dateNow = Date.now();
                        db.weblinks.update({"_id": savedlink._id}, { $set: {"render_date": dateNow}});
                        res.send("ok");
                    }
                }
            });
        } else {
        //     if (process.env.USE_TRANSLOADIT == true) { //nilch, over it
        //     var weblinkParams = {
        //         'steps': {
        //             'extract': {
        //                 'robot': '/html/convert',
        //                 'url' : req.body.link_url
        //             }
        //         },
        //         'template_id': process.env.TRANSLOADIT_WEBSCRAPE_TEMPLATE,
        //         'fields' : { 'link_id' : link._id,
        //             'user_id' : req.session.user._id
        //         }
        //     };

        //     transloadClient.send(weblinkParams, function(ok) {
        //         console.log('Success: ' + JSON.stringify(ok));
        //         if (ok != null && ok != undefined) {
        //             var dateNow = Date.now();
        //             db.weblinks.update({"_id": link._id}, { $set: {"render_date": dateNow}});
        //         }
        //     }, function(err) {
        //         console.log('Error: ' + JSON.stringify(err));
        //     });
        // } else {
            console.log(" link item found for " + lurl);
            var token=jwt.sign({userId:req.session.user._id},process.env.JWT_SECRET);
            const options = {
                headers: {'X-Access-Token': token}
              };
            const data = {
                "_id" : link._id
            };
            axios.post(process.env.GS_HOST + "/scrapeweb/", data, options)
                .then((response) => {
                  console.log(response.data);
                })
                .catch(function (error) {
                    res.end(error);
                })
                .then(function () {
                });
                db.scenes.update(
                    {'_id': ObjectID(req.body.sceneID)},
                    {$addToSet: { 'sceneWebLinks': link._id.toString() } }
                );
                var dateNow = Date.now();
                db.weblinks.update({"_id": link._id}, { $set: {"render_date": dateNow, "link_title": req.body.link_title}});
                res.send("ok");
            
            // }
        }
    });
});
app.post('/clone_scene', requiredAuthentication, function (req,res) {

    console.log("request to clone scene " + JSON.stringify(req.body));
    // res.send("clone, ok!");
    var o_id = ObjectID(req.body.sceneID);   
    // console.log('path requested : ' + req.body._id);
    db.scenes.findOne({ "_id" : o_id}, function(err, scene) {
        if (err || !scene) {
            res.send("cain't fine no scene with that");
        } else {
            let newScene = {};
            // let theScene = {};
            // newScene.sceneTitle = scene.sceneTitle + " clone";
            // newScene.user_id = req.session.user._id.toString();
            // newScene.userName = req.session.user.userName;
            // newScene.otimestamp = Math.round(Date.now() / 1000);
            db.scenes.save(newScene, function (err, saved) {
                if ( err || !saved ) {
                    console.log('scene not saved..');
                    res.send("nilch");
                } else {
                    var item_id = saved._id.toString();
                    console.log('created new scene id: ' + item_id);
                    tempID = "";
                    newShortID = "";
                    tempID = item_id;
                    // newShortID = shortId(tempID);
                    let title = scene.sceneTitle + " clone";
                    newShortID = shortid.generate(); //TODO - externalize and check for collisions!
                    var o_id = ObjectID(item_id);
                    // theScene = JSON.parse(JSON.stringify(scene));
                    db.scenes.update( { _id: o_id }, { $set: {
                    short_id : newShortID,
                    sceneTitle : title,

                    user_id : req.session.user._id.toString(),
                    userName : req.session.user.userName,
                    otimestamp : Math.round(Date.now() / 1000),
                    clonedFromID : scene.short_id,
                    sceneDomain : scene.sceneDomain,
                    sceneAppName : scene.sceneAppName,
                    sceneSource : scene.sceneSource,
                    sceneAltURL : scene.sceneAltURL != null ? scene.sceneAltURL : "",
                    sceneStickyness : parseInt(scene.sceneStickyness) != null ? parseInt(scene.sceneStickyness) : 5,
                    sceneNumber : scene.sceneNumber,
                    sceneTags : scene.sceneTags,
                    sceneYouTubeIDs : (scene.sceneYouTubeIDs != null && scene.sceneYouTubeIDs != undefined) ? scene.sceneYouTubeIDs : [],
                    sceneLinks : scene.sceneLinks,
                    scenePeopleGroupID : scene.scenePeopleGroupID,
                    sceneLocationGroups : scene.sceneLocationGroups,
                    sceneAudioGroups : scene.sceneAudioGroups,
                    scenePictureGroups : scene.scenePictureGroups,
                    sceneTextGroups : scene.sceneTextGroups,
                    sceneVideoGroups : scene.sceneVideoGroups,
                    sceneVideos : scene.sceneVideos,
                    scenePlayer : scene.scenePlayer  != null ? scene.scenePlayer : "",
                    sceneCategory : scene.sceneCategory != null ? scene.sceneCategory : "None",
                    sceneType : (scene.sceneType != null && scene.sceneType.length > 2) ? scene.sceneType : "Default",
                    sceneWebType : (scene.sceneWebType != null && scene.sceneWebType.length > 2) ? scene.sceneWebType : "Default",
                    sceneCameraMode : scene.sceneCameraMode != null ? scene.sceneCameraMode : "First Person",
                    sceneDebugMode : scene.sceneDebugMode != null ? scene.sceneDebugMode : "",
                    sceneUseThreeDeeText : scene.sceneUseThreeDeeText != null ? scene.sceneUseThreeDeeText : false,
                    sceneAndroidOK : scene.sceneAndroidOK != null ? scene.sceneAndroidOK : false,
                    sceneIosOK : scene.sceneIosOK != null ? scene.sceneIosOK : false,
                    sceneWindowsOK : scene.sceneWindowsOK != null ? scene.sceneWindowsOK : false,
                    sceneLocationTracking : scene.sceneLocationTracking != null ? scene.sceneLocationTracking : false,
                    sceneShowAds : scene.sceneShowAds != null ? scene.sceneShowAds : false,
                    sceneShareWithPublic : false,
                    sceneShareWithSubscribers : scene.sceneShareWithSubscribers != null ? scene.sceneShareWithSubscribers : false,
                    sceneShareWithGroups : scene.sceneShareWithGroups != null ? scene.sceneShareWithGroups : "",
                    sceneShareWithPeople : scene.sceneShareWithPeople != null ? scene.sceneShareWithPeople : "",
                    sceneEventStart : scene.sceneEventStart != null ? scene.sceneEventStart : "",
                    sceneEventEnd : scene.sceneEventEnd != null ? scene.sceneEventEnd : "",
                    sceneEnvironment : scene.sceneEnvironment != null ? scene.sceneEnvironment : {},
                    sceneUseStaticObj : scene.sceneUseStaticObj != null ? scene.sceneUseStaticObj : false,
                    sceneStaticObjUrl : scene.sceneStaticObjUrl != null ? scene.sceneStaticObjUrl : "",
                    sceneStaticObjTextureUrl : scene.sceneStaticObjTextureUrl != null ? scene.sceneStaticObjTextureUrl : "",
                    sceneRandomizeColors : scene.sceneRandomizeColors != null ? scene.sceneRandomizeColors : false,
                    sceneTweakColors : scene.sceneTweakColors != null ? scene.sceneTweakColors : false,
                    sceneColorizeSky : scene.sceneColorizeSky != null ? scene.sceneColorizeSky : false,
                    sceneScatterMeshes : scene.sceneScatterMeshes != null ? scene.sceneScatterMeshes : false,
                    sceneScatterMeshLayers : scene.sceneScatterMeshLayers != null ? scene.sceneScatterMeshLayers : {},
                    sceneScatterObjectLayers : scene.sceneScatterObjectLayers != null ? scene.sceneScatterObjectLayers : {},
                    sceneScatterObjects : scene.sceneScatterObjects != null ? scene.sceneScatterObjects : false,
                    sceneScatterOffset : scene.sceneScatterOffset != null ? scene.sceneScatterOffset : "",
                    sceneShowViewportMeshes : scene.sceneShowViewportMeshes != null ? scene.sceneShowViewportMeshes : false,
                    sceneShowViewportObjects : scene.sceneShowViewportObjects != null ? scene.sceneShowViewportObjects : false,
                    sceneViewportMeshLayers : scene.sceneViewportMeshLayers != null ? scene.sceneViewportMeshLayers : {},
                    sceneViewportObjectLayers : scene.sceneViewportObjectLayers != null ? scene.sceneViewportObjectLayers : {},
                    sceneTargetColliderType : scene.sceneTargetColliderType != null ? scene.sceneTargetColliderType : "none",
                    sceneUseTargetObject : scene.sceneUseTargetObject != null ? scene.sceneUseTargetObject : false,
                    sceneTargetRotateToPlayer : scene.sceneTargetRotateToPlayer != null ? scene.sceneTargetRotateToPlayer : false,
                    sceneDetectHorizontalPlanes : scene.sceneDetectHorizontalPlanes != null ? scene.sceneDetectHorizontalPlanes : false,
                    sceneDetectVerticalPlanes : scene.sceneDetectVerticalPlanes != null ? scene.sceneDetectVerticalPlanes : false,
                    sceneCameraDepthOfField : scene.sceneCameraDepthOfField != null ? scene.sceneCameraDepthOfField : false,
                    sceneFlyable : scene.sceneFlyable != null ? scene.sceneFlyable : false,
                    sceneFaceTracking : scene.sceneFaceTracking != null ? scene.sceneFaceTracking : false,
                    sceneTargetObjectHeading : scene.sceneTargetObjectHeading != null ? scene.sceneTargetObjectHeading : 0,
                    sceneTargetObject : scene.sceneTargetObject,
                    sceneTargetEvent : scene.sceneTargetEvent,
                    sceneTargetText : scene.sceneTargetText  != null ? scene.sceneTargetText : "",
                    sceneNextScene : scene.sceneNextScene != null ? scene.sceneNextScene : "",
                    scenePreviousScene : scene.scenePreviousScene,
                    sceneUseDynamicSky : scene.sceneUseDynamicSky != null ? scene.sceneUseDynamicSky : false,
                    sceneUseDynCubeMap : scene.sceneUseDynCubeMap != null ? scene.sceneUseDynCubeMap : false,
                    sceneUseSkyParticles : scene.sceneUseSkyParticles != null ? scene.sceneUseSkyParticles : false,
                    sceneSkyParticles : scene.sceneSkyParticles != null ? scene.sceneSkyParticles : "",
                    sceneUseDynamicShadows : scene.sceneUseDynamicShadows != null ? scene.sceneUseDynamicShadows : false,
                    sceneSkyRotationOffset : scene.sceneSkyRotationOffset != null ? scene.sceneSkyRotationOffset : 0,
                    sceneUseCameraBackground : scene.sceneUseCameraBackground != null ? scene.sceneUseCameraBackground : false,
                    sceneCameraOrientToPath : scene.sceneCameraOrientToPath  != null ? scene.sceneCameraOrientToPath : false,
                    sceneCameraPath : scene.sceneCameraPath != null ? scene.sceneCameraPath : "Random",
                    sceneUseSkybox : scene.sceneUseSkybox != null ? scene.sceneUseSkybox : false,
                    sceneSkybox : scene.sceneSkybox,
                    sceneUseDynCubeMap : scene.sceneUseDynCubeMap != null ? scene.sceneUseDynCubeMap : false,
                    sceneUseSceneFog : scene.sceneUseSceneFog != null ? scene.sceneUseSceneFog : false,
                    sceneUseGlobalFog : scene.sceneUseGlobalFog != null ? scene.sceneUseGlobalFog : false,
                    sceneUseVolumetricFog : scene.sceneUseVolumetricFog != null ? scene.sceneUseVolumetricFog : false,
                    sceneGlobalFogDensity : scene.sceneGlobalFogDensity != null ? scene.sceneGlobalFogDensity : .001,
                    sceneUseSunShafts : scene.sceneUseSunShafts != null ? scene.sceneUseSunShafts : false,
                    sceneUseFloorPlane : scene.sceneUseFloorPlane != null ? scene.sceneUseFloorPlane : false,
                    sceneFloorplaneTexture : scene.sceneFloorplaneTexture != null ? scene.sceneFloorplaneTexture : "",
                    sceneUseEnvironment : scene.sceneUseEnvironment != null ? scene.sceneUseEnvironment : false,
                    sceneUseTerrain : scene.sceneUseTerrain != null ? scene.sceneUseTerrain : false,
                    sceneUseHeightmap : scene.sceneUseHeightmap != null ? scene.sceneUseHeightmap : false,
                    sceneHeightmap : scene.sceneHeightmap,
                    sceneWebXREnvironment : scene.sceneWebXREnvironment != null ? scene.sceneWebXREnvironment : "",
                    sceneTime : scene.sceneTime,
                    sceneTimeSpeed : scene.sceneTimeSpeed,
                    sceneWeather : scene.sceneWeather,
                    sceneClouds : scene.sceneClouds,
                    sceneWater : scene.sceneWater,
                    sceneGroundLevel : scene.sceneGroundLevel,
                    sceneWindFactor  : scene.sceneWindFactor != null ?  scene.sceneWindFactor : 0,
                    sceneSkyRadius  : scene.sceneSkyRadius != null ?  scene.sceneSkyRadius : 202,
                    sceneLightningFactor  : scene.sceneLightningFactor != null ? scene.sceneLightningFactor : 0,
                    sceneCharacters : scene.sceneCharacters,
                    sceneEquipment : scene.sceneEquipment,
                    sceneFlyingObjex : scene.sceneFlyingObjex,
                    sceneSeason : scene.sceneSeason,
                    scenePictures  : scene.scenePictures, //array of IDs only
                    scenePostcards  : scene.scenePostcards, //array of IDs only
                    sceneWebLinks  : scene.sceneWebLinks != null ? scene.sceneWebLinks : [], //custom object //no, make it an array of IDs
                    sceneColor4  : scene.sceneColor4,
                    sceneColor1  : scene.sceneColor1,
                    sceneColor2  : scene.sceneColor2,
                    sceneColor3  : scene.sceneColor3,
                    sceneLocationRange  : scene.sceneLocationRange != null ? scene.sceneLocationRange : .1,
                    sceneUseMap  : scene.sceneUseMap != null ? scene.sceneUseMap : false,
                    sceneMapType  : scene.sceneMapType != null ? scene.sceneMapType : "none",
                    sceneMapZoom  : scene.sceneMapZoom != null ? scene.sceneMapZoom : 16,
                    sceneLatitude  : scene.sceneLatitude != null ? scene.sceneLatitude : "",
                    sceneLongitude  : scene.sceneLongitude != null ? scene.sceneLongitude : "",
                     sceneUseStreetMap  : scene.sceneUseStreetMap  != null ? scene.sceneUseStreetMap : false,
                    sceneUseSatelliteMap  : scene.sceneUseSatelliteMap  != null ? scene.sceneUseSatelliteMap : false,
                    sceneUseHybridMap  : scene.sceneUseHybridMap  != null ? scene.sceneUseHybridMap : false,
                    sceneEmulateGPS  : scene.sceneEmulateGPS  != null ? scene.sceneEmulateGPS : false,
                    sceneLocations  : scene.sceneLocations,
                    sceneTriggerAudioID  : scene.sceneTriggerAudioID,
                    scenePrimaryAudioTitle  : scene.scenePrimaryAudioTitle,
                    sceneAmbientAudioID  : scene.sceneAmbientAudioID,
                    scenePrimaryAudioID  : scene.scenePrimaryAudioID,
                    scenePrimaryAudioStreamURL  : scene.scenePrimaryAudioStreamURL,
                    sceneAmbientAudioStreamURL  : scene.sceneAmbientAudioStreamURL,
                    sceneTriggerAudioStreamURL  : scene.sceneTriggerAudioStreamURL,
                    scenePrimaryAudioGroups  : scene.scenePrimaryAudioGroups,
                    sceneAmbientAudioGroups  : scene.sceneAmbientAudioGroups,
                    sceneTriggerAudioGroups  : scene.sceneTriggerAudioGroups,
                    sceneBPM  : scene.sceneBPM != null ? scene.sceneBPM : "100",
                    scenePrimaryPatch1  : scene.scenePrimaryPatch1,
                    scenePrimaryPatch2  : scene.scenePrimaryPatch2,
                    scenePrimaryMidiSequence1  : scene.scenePrimaryMidiSequence1,
                    scenePrimarySequence2Transpose  : scene.scenePrimarySequence2Transpose != null ? scene.scenePrimarySequence2Transpose : "0",
                    scenePrimarySequence1Transpose  : scene.scenePrimarySequence1Transpose != null ? scene.scenePrimarySequence1Transpose : "0",
                    scenePrimaryMidiSequence2  : scene.scenePrimaryMidiSequence2,
                    sceneAmbientVolume  : scene.sceneAmbientVolume,
                    scenePrimaryVolume  : scene.scenePrimaryVolume,
                    sceneTriggerVolume  : scene.sceneTriggerVolume,
                    sceneWeatherAudioVolume  : scene.sceneWeatherAudioVolume,
                    sceneMediaAudioVolume  : scene.sceneMediaAudioVolume,
                    sceneAmbientSynth1Volume  : scene.sceneAmbientSynth1Volume,
                    sceneAmbientSynth2Volume  : scene.sceneAmbientSynth2Volume,
                    sceneTriggerSynth1Volume  : scene.sceneTriggerSynth1Volume,
                    sceneAmbientPatch1  : scene.sceneAmbientPatch1,
                    sceneAmbientPatch2  : scene.sceneAmbientPatch2,
                    sceneAmbientSynth1ModulateByDistance  : scene.sceneAmbientSynth1ModulateByDistance != null ? scene.sceneAmbientSynth1ModulateByDistance : false,
                    sceneAmbientSynth2ModulateByDistance  : scene.sceneAmbientSynth2ModulateByDistance != null ? scene.sceneAmbientSynth2ModulateByDistance : false,
                    sceneAmbientSynth1ModulateByDistanceTarget  : scene.sceneAmbientSynth1ModulateByDistanceTarget != null ? scene.sceneAmbientSynth1ModulateByDistanceTarget: false,
                    sceneAmbientSynth2ModulateByDistanceTarget  : scene.sceneAmbientSynth2ModulateByDistanceTarget != null ? scene.sceneAmbientSynth2ModulateByDistanceTarget : false,
                    sceneAmbientMidiSequence1  : scene.sceneAmbientMidiSequence1,
                    sceneAmbientMidiSequence2  : scene.sceneAmbientMidiSequence2,
                    sceneAmbientSequence1Transpose  : scene.sceneAmbientSequence1Transpose != null ? scene.sceneAmbientSequence1Transpose : "0",
                    sceneAmbientSequence2Transpose  : scene.sceneAmbientSequence2Transpose != null ? scene.sceneAmbientSequence2Transpose : "0",
                    sceneTriggerPatch1  : scene.sceneTriggerPatch1,
                    sceneTriggerPatch2  : scene.sceneTriggerPatch2,
                    sceneTriggerPatch3  : scene.sceneTriggerPatch3,
                    sceneGeneratePrimarySequences  : scene.sceneGeneratePrimarySequences != null ? scene.sceneGeneratePrimarySequences : false,
                    sceneGenerateAmbientSequences  : scene.sceneGenerateAmbientSequences != null ? scene.sceneGenerateAmbientSequences : false,
                    sceneGenerateTriggerSequences  : scene.sceneGenerateTriggerSequences != null ? scene.sceneGenerateTriggerSequences : false,
                    sceneLoopPrimaryAudio  : scene.sceneLoopPrimaryAudio != null ? scene.sceneLoopPrimaryAudio : false,
                    scenePrimaryAudioLoopCount  : scene.scenePrimaryAudioLoopCount != null ? scene.scenePrimaryAudioLoopCount : 0,
                    sceneAutoplayPrimaryAudio  : scene.sceneAutoplayPrimaryAudio != null ? scene.sceneAutoplayPrimaryAudio : false,
                    scenePrimaryAudioVisualizer  : scene.scenePrimaryAudioVisualizer != null ? scene.scenePrimaryAudioVisualizer : false,
                    scenePrimaryAudioTriggerEvents  : scene.scenePrimaryAudioTriggerEvents != null ? scene.scenePrimaryAudioTriggerEvents : false,
                    sceneAttachPrimaryAudioToTarget  : scene.sceneAttachPrimaryAudioToTarget != null ? scene.sceneAttachPrimaryAudioToTarget : false,
                    sceneAutoplayAudioGroup  : scene.sceneAutoplayAudioGroup != null ? scene.sceneAutoplayAudioGroup : false,
                    sceneLoopAllAudioGroup  : scene.sceneLoopAllAudioGroup != null ? scene.sceneLoopAllAudioGroup : false,
                    sceneAnchorPositionAudioGroup  : scene.sceneAnchorPositionAudioGroup != null ? scene.sceneAnchorPositionAudioGroup : false,
                    sceneAnchorCanvasAudioGroup  : scene.sceneAnchorCanvasAudioGroup != null ? scene.sceneAnchorCanvasAudioGroup : false,
                    sceneCreateAudioSpline  : scene.sceneCreateAudioSpline != null ? scene.sceneCreateAudioSpline : false,
                    sceneAttachAudioGroupToTarget  : scene.sceneAttachAudioGroupToTarget != null ? scene.sceneAttachAudioGroupToTarget : false,
                    sceneUseMicrophoneInput  : scene.sceneUseMicrophoneInput != null ? scene.sceneUseMicrophoneInput : false,
                    sceneKeynote  : scene.sceneKeynote,
                    sceneDescription  : scene.sceneDescription,
                    sceneFontWeb1  : scene.sceneFontWeb1,
                    sceneFontWeb2  : scene.sceneFontWeb2,
                    sceneFont  : scene.sceneFont,
                    sceneFontFillColor  : scene.sceneFontFillColor,
                    sceneFontOutlineColor  : scene.sceneFontOutlineColor,
                    sceneFontGlowColor  : scene.sceneFontGlowColor,
                    sceneTextBackground  : scene.sceneTextBackground,
                    sceneTextBackgroundColor  : scene.sceneTextBackgroundColor,
                    sceneTextItems  : scene.sceneTextItems, //ids of text items
                    sceneText  : scene.sceneText, //this is "primary" tex
                    sceneTextLoop  : scene.sceneTextLoop != null ? scene.sceneTextLoop : false, //also for "primary" text below
                    scenePrimaryTextFontSize  : scene.scenePrimaryTextFontSize != null ? scene.scenePrimaryTextFontSize : "12",
                    scenePrimaryTextMode  : scene.scenePrimaryTextMode != null ? scene.scenePrimaryTextMode : "Normal",
                    scenePrimaryTextAlign  : scene.scenePrimaryTextAlign != null ? scene.scenePrimaryTextAlign : "Left",
                    sceneNetworking  : scene.sceneNetworking != null ? scene.sceneNetworking : "None",
                    scenePrimaryTextRotate  : scene.scenePrimaryTextRotate != null ? scene.scenePrimaryTextRotate : false,
                    scenePrimaryTextScaleByDistance  : scene.scenePrimaryTextScaleByDistance != null ? scene.scenePrimaryTextScaleByDistance : false,
                    sceneTextAudioSync  : scene.sceneTextAudioSync != null ? scene.sceneTextAudioSync : false,
                    sceneTextUseModals  : scene.sceneTextUseModals != null ? scene.sceneTextUseModals : true,
                    sceneObjects : scene.sceneObjects,
                    sceneModels : scene.sceneModels,
                    sceneObjectGroups : scene.sceneObjectGroups,
                    sceneLastUpdate : new Date()
                        }
                    });
                    // console.log("tryna update new scene " + JSON.stringify(theScene));
                    // db.scenes.update( { _id: o_id }, { $set: {theScene}}); 
                    // db.acl.save(
                    //     { acl_rule: "read_scene_" + saved._id },  function (err, acl) {
                    //         if (err || !acl) {
                    //         } else {
                    //             db.acl.update({ 'acl_rule': "read_scene_" + saved._id},{ $push: { 'userIDs': req.session.user._id.toString() } });
                    //             console.log("ok saved acl");
                    //         }
                    //     });
                    // db.acl.save(
                    //     { 'acl_rule': "write_scene_" + saved._id }, function (err, acl) {
                    //         if (err || !acl) {
                    //         } else {
                    //             db.acl.update({ 'acl_rule': "write_scene_" + saved._id },{ $push: { 'userIDs': req.session.user._id.toString() } });
                    //             console.log("ok saved acl");
                    //         }
                    //     });
                    let resp = {};
                    resp.item_id = item_id;
                    res.send(resp);
                }
            });
            // res.send(scene);
        }
    
    });
});

app.post('/update_scene_locations', checkAppID, requiredAuthentication, function (req, res){ //unused.  I think.

    console.log("tryna update scene locations: " + req.body.locations);
    var sceneID = req.body.sceneID;

    var locationsObj = JSON.parse(req.body.locations);
//    console.log("number of locations: " + locationsObj.locations.Length);
//    for (var i = 0; i < locationsObj.locations.Length; i++) {
//        console.log(JSON.stringify(locationsObj.locations[i]));
//
//    }
    var o_id = ObjectID(req.body._id);

    db.scenes.update({ "_id" : o_id}, { $push: { sceneLocations: { $each: locationsObj.locations } } }, function(err, result) {
        if (err || !result) {
            console.log("error updating scene locations: " + err);
        } else {
            res.send(result);
        }
    });
//    locationsObj.locations.filter(function (item){
//       console.log(JSON.stringify(item));
//    });

});

app.post('/update_scene/:_id', requiredAuthentication, function (req, res) {

    console.log("update_scene req.header: " + JSON.stringify(req.headers));
    console.log(req.params._id);
    var lastUpdateTimestamp = new Date();
    var o_id = ObjectID(req.body._id);   
    console.log('path requested : ' + req.body._id);
    db.scenes.findOne({ "_id" : o_id}, function(err, scene) {
        if (err || !scene) {
            console.log("error getting scene: " + err);
        } else {

            let inventoryID = scene.sceneInventoryID; //easier to jack in here, than ? make a temp batch route? 
            if (inventoryID == null) {
                let inventories = {};
                let inventoryItems = [];
                inventories.inventoryItems = inventoryItems; 
                db.inventories.save(inventories, function (err, saved) {
                if (err || !saved) {
                    console.log("problemo2 with inventory add " + err); 
                    } else {
                        inventoryID = saved._id;
                        db.scenes.update( { "_id": o_id }, { $set: { sceneInventoryID : inventoryID }});
                    }
                });
            }
            console.log("tryna update scene " + req.body._id + " with cameraMode " + JSON.stringify(req.body.sceneCameraMode));
            db.scenes.update( { "_id": o_id }, { $set: {
                sceneDomain : req.body.sceneDomain,
                sceneAppName : req.body.sceneAppName,
                sceneSource : req.body.sceneSource,
                sceneAltURL : req.body.sceneAltURL != null ? req.body.sceneAltURL : "",
                sceneStickyness : parseInt(req.body.sceneStickyness) != null ? parseInt(req.body.sceneStickyness) : 5,
//                    sceneUserName : scene.sceneUserName != null ? scene.sceneUserName : "",
                sceneNumber : req.body.sceneNumber,
                sceneTitle : req.body.sceneTitle,
                sceneTags : req.body.sceneTags,
                sceneYouTubeIDs : (req.body.sceneYouTubeIDs != null && req.body.sceneYouTubeIDs != undefined) ? req.body.sceneYouTubeIDs : [],
                sceneLinks : req.body.sceneLinks,
                scenePeopleGroupID : req.body.scenePeopleGroupID,
                sceneLocationGroups : req.body.sceneLocationGroups,
                sceneAudioGroups : req.body.sceneAudioGroups,
                scenePictureGroups : req.body.scenePictureGroups,
                sceneTextGroups : req.body.sceneTextGroups,
                sceneVideoGroups : req.body.sceneVideoGroups,
                sceneVideos : req.body.sceneVideos,
                scenePlayer : req.body.scenePlayer  != null ? req.body.scenePlayer : "",
                sceneCategory : req.body.sceneCategory != null ? req.body.sceneCategory : "None",
                sceneType : (req.body.sceneType != null && req.body.sceneType.length > 2) ? req.body.sceneType : "Default",
                sceneWebType : (req.body.sceneWebType != null && req.body.sceneWebType.length > 2) ? req.body.sceneWebType : "Default",
                sceneCameraMode : req.body.sceneCameraMode != null ? req.body.sceneCameraMode : "First Person",
                sceneDebugMode : req.body.sceneDebugMode != null ? req.body.sceneDebugMode : "",
                sceneUseThreeDeeText : req.body.sceneUseThreeDeeText != null ? req.body.sceneUseThreeDeeText : false,
                sceneAndroidOK : req.body.sceneAndroidOK != null ? req.body.sceneAndroidOK : false,
                sceneIosOK : req.body.sceneIosOK != null ? req.body.sceneIosOK : false,
                sceneWindowsOK : req.body.sceneWindowsOK != null ? req.body.sceneWindowsOK : false,
                sceneLocationTracking : req.body.sceneLocationTracking != null ? req.body.sceneLocationTracking : false,
                sceneShowAds : req.body.sceneShowAds != null ? req.body.sceneShowAds : false,
                sceneShareWithPublic : req.body.sceneShareWithPublic != null ? req.body.sceneShareWithPublic : false,
                sceneShareWithSubscribers : req.body.sceneShareWithSubscribers != null ? req.body.sceneShareWithSubscribers : false,
                sceneShareWithGroups : req.body.sceneShareWithGroups != null ? req.body.sceneShareWithGroups : "",
                sceneShareWithPeople : req.body.sceneShareWithPeople != null ? req.body.sceneShareWithPeople : "",
                sceneShareWithGroups : req.body.sceneShareWithGroups != null ? req.body.sceneShareWithGroups : "",
                sceneEventStart : req.body.sceneEventStart != null ? req.body.sceneEventStart : "",
                sceneEventEnd : req.body.sceneEventEnd != null ? req.body.sceneEventEnd : "",
                sceneAccessLinkExpire : req.body.sceneAccessLinkExpire != null ? req.body.sceneAccessLinkExpire : "",
                sceneShareWithMessage : req.body.sceneShareWithMessage != null ? req.body.sceneShareWithMessage : "",
                sceneEnvironment : req.body.sceneEnvironment != null ? req.body.sceneEnvironment : {},
                sceneUseStaticObj : req.body.sceneUseStaticObj != null ? req.body.sceneUseStaticObj : false,
                sceneStaticObjUrl : req.body.sceneStaticObjUrl != null ? req.body.sceneStaticObjUrl : "",
                sceneStaticObjTextureUrl : req.body.sceneStaticObjTextureUrl != null ? req.body.sceneStaticObjTextureUrl : "",
                sceneRandomizeColors : req.body.sceneRandomizeColors != null ? req.body.sceneRandomizeColors : false,
                sceneTweakColors : req.body.sceneTweakColors != null ? req.body.sceneTweakColors : false,
                sceneColorizeSky : req.body.sceneColorizeSky != null ? req.body.sceneColorizeSky : false,
                sceneScatterMeshes : req.body.sceneScatterMeshes != null ? req.body.sceneScatterMeshes : false,
                sceneScatterMeshLayers : req.body.sceneScatterMeshLayers != null ? req.body.sceneScatterMeshLayers : {},
                sceneScatterObjectLayers : req.body.sceneScatterObjectLayers != null ? req.body.sceneScatterObjectLayers : {},
                sceneScatterObjects : req.body.sceneScatterObjects != null ? req.body.sceneScatterObjects : false,
                sceneScatterOffset : req.body.sceneScatterOffset != null ? req.body.sceneScatterOffset : "",
                sceneShowViewportMeshes : req.body.sceneShowViewportMeshes != null ? req.body.sceneShowViewportMeshes : false,
                sceneShowViewportObjects : req.body.sceneShowViewportObjects != null ? req.body.sceneShowViewportObjects : false,
                sceneViewportMeshLayers : req.body.sceneViewportMeshLayers != null ? req.body.sceneViewportMeshLayers : {},
                sceneViewportObjectLayers : req.body.sceneViewportObjectLayers != null ? req.body.sceneViewportObjectLayers : {},
                sceneTargetColliderType : req.body.sceneTargetColliderType != null ? req.body.sceneTargetColliderType : "none",
                sceneUseTargetObject : req.body.sceneUseTargetObject != null ? req.body.sceneUseTargetObject : false,
                sceneTargetRotateToPlayer : req.body.sceneTargetRotateToPlayer != null ? req.body.sceneTargetRotateToPlayer : false,
                // sceneTargetRotateToPlayer : req.body.sceneTargetRotateToPlayer != null ? req.body.sceneTargetRotateToPlayer : false,
                sceneDetectHorizontalPlanes : req.body.sceneDetectHorizontalPlanes != null ? req.body.sceneDetectHorizontalPlanes : false,
                sceneDetectVerticalPlanes : req.body.sceneDetectVerticalPlanes != null ? req.body.sceneDetectVerticalPlanes : false,
                sceneCameraDepthOfField : req.body.sceneCameraDepthOfField != null ? req.body.sceneCameraDepthOfField : false,
                sceneFlyable : req.body.sceneFlyable != null ? req.body.sceneFlyable : false,
                sceneFaceTracking : req.body.sceneFaceTracking != null ? req.body.sceneFaceTracking : false,
                sceneTargetObjectHeading : req.body.sceneTargetObjectHeading != null ? req.body.sceneTargetObjectHeading : 0,
                sceneTargetObject : req.body.sceneTargetObject,
                sceneTargetEvent : req.body.sceneTargetEvent,
                sceneTargetText : req.body.sceneTargetText  != null ? req.body.sceneTargetText : "",
                sceneNextScene : req.body.sceneNextScene != null ? req.body.sceneNextScene : "",
                scenePreviousScene : req.body.scenePreviousScene,
                sceneUseDynamicSky : req.body.sceneUseDynamicSky != null ? req.body.sceneUseDynamicSky : false,
                sceneUseDynCubeMap : req.body.sceneUseDynCubeMap != null ? req.body.sceneUseDynCubeMap : false,
                sceneUseSkyParticles : req.body.sceneUseSkyParticles != null ? req.body.sceneUseSkyParticles : false,
                sceneSkyParticles : req.body.sceneSkyParticles != null ? req.body.sceneSkyParticles : "",
                sceneUseDynamicShadows : req.body.sceneUseDynamicShadows != null ? req.body.sceneUseDynamicShadows : false,
                sceneSkyRotationOffset : req.body.sceneSkyRotationOffset != null ? req.body.sceneSkyRotationOffset : 0,
                sceneUseCameraBackground : req.body.sceneUseCameraBackground != null ? req.body.sceneUseCameraBackground : false,
                sceneCameraOrientToPath : req.body.sceneCameraOrientToPath  != null ? req.body.sceneCameraOrientToPath : false,
                sceneCameraPath : req.body.sceneCameraPath != null ? req.body.sceneCameraPath : "Random",
                sceneUseSkybox : req.body.sceneUseSkybox != null ? req.body.sceneUseSkybox : false,
                sceneSkybox : req.body.sceneSkybox,
                sceneUseDynCubeMap : req.body.sceneUseDynCubeMap != null ? req.body.sceneUseDynCubeMap : false,
                sceneUseSceneFog : req.body.sceneUseSceneFog != null ? req.body.sceneUseSceneFog : false,
                sceneUseGlobalFog : req.body.sceneUseGlobalFog != null ? req.body.sceneUseGlobalFog : false,
                sceneUseVolumetricFog : req.body.sceneUseVolumetricFog != null ? req.body.sceneUseVolumetricFog : false,
                sceneGlobalFogDensity : req.body.sceneGlobalFogDensity != null ? req.body.sceneGlobalFogDensity : .001,
                sceneUseSunShafts : req.body.sceneUseSunShafts != null ? req.body.sceneUseSunShafts : false,
                // sceneRenderFloorPlane : req.body.sceneRenderFloorPlane != null ? req.body.sceneRenderFloorPlane : false,
                sceneUseFloorPlane : req.body.sceneUseFloorPlane != null ? req.body.sceneUseFloorPlane : false,
                sceneFloorplaneTexture : req.body.sceneFloorplaneTexture != null ? req.body.sceneFloorplaneTexture : "",
                sceneUseEnvironment : req.body.sceneUseEnvironment != null ? req.body.sceneUseEnvironment : false,
                sceneUseTerrain : req.body.sceneUseTerrain != null ? req.body.sceneUseTerrain : false,
                sceneUseHeightmap : req.body.sceneUseHeightmap != null ? req.body.sceneUseHeightmap : false,
                sceneHeightmap : req.body.sceneHeightmap,
                sceneWebXREnvironment : req.body.sceneWebXREnvironment != null ? req.body.sceneWebXREnvironment : "",
                // sceneUseSimpleWater : req.body.sceneUseSimpleWater != null ? req.body.sceneUseSimpleWater : false,
                // sceneUseOcean : req.body.sceneUseOcean != null ? req.body.sceneUseOcean : false,
                // sceneUseFancyWater : req.body.sceneUseFancyWater != null ? req.body.sceneUseFancyWater : false,
                sceneTime: req.body.sceneTime,
                sceneTimeSpeed: req.body.sceneTimeSpeed,
                sceneWeather: req.body.sceneWeather,
                sceneClouds: req.body.sceneClouds,
                sceneWater: req.body.sceneWater,
                sceneGroundLevel: req.body.sceneGroundLevel,
                sceneWindFactor : req.body.sceneWindFactor != null ?  req.body.sceneWindFactor : 0,
                sceneSkyRadius  : req.body.sceneSkyRadius != null ?  req.body.sceneSkyRadius : 202,
                sceneLightningFactor : req.body.sceneLightningFactor != null ? req.body.sceneLightningFactor : 0,
                sceneCharacters: req.body.sceneCharacters,
                sceneEquipment: req.body.sceneEquipment,
                sceneFlyingObjex: req.body.sceneFlyingObjex,
                sceneSeason: req.body.sceneSeason,
                scenePictures : req.body.scenePictures, //array of IDs only
                scenePostcards : req.body.scenePostcards, //array of IDs only
                sceneWebLinks : req.body.sceneWebLinks != null ? req.body.sceneWebLinks : [], //custom object //no, make it an array of IDs
                sceneColor4 : req.body.sceneColor4,
                sceneColor1 : req.body.sceneColor1,
                sceneColor2 : req.body.sceneColor2,
                sceneColor3 : req.body.sceneColor3,
                sceneColor4Alt : req.body.sceneColor4Alt,
                sceneColor1Alt : req.body.sceneColor1Alt,
                sceneColor2Alt : req.body.sceneColor2Alt,
                sceneColor3Alt : req.body.sceneColor3Alt,
                sceneLocationRange : req.body.sceneLocationRange != null ? req.body.sceneLocationRange : .1,
                sceneUseMap : req.body.sceneUseMap != null ? req.body.sceneUseMap : false,
                sceneMapType : req.body.sceneMapType != null ? req.body.sceneMapType : "none",
                sceneMapZoom : req.body.sceneMapZoom != null ? req.body.sceneMapZoom : 17,
                sceneLatitude : req.body.sceneLatitude != null ? req.body.sceneLatitude : "",
                sceneLongitude : req.body.sceneLongitude != null ? req.body.sceneLongitude : "",
                sceneUseStreetMap : req.body.sceneUseStreetMap  != null ? req.body.sceneUseStreetMap : false,
                sceneUseSatelliteMap : req.body.sceneUseSatelliteMap  != null ? req.body.sceneUseSatelliteMap : false,
                sceneUseHybridMap : req.body.sceneUseHybridMap  != null ? req.body.sceneUseHybridMap : false,
                sceneEmulateGPS : req.body.sceneEmulateGPS  != null ? req.body.sceneEmulateGPS : false,
                sceneLocations : req.body.sceneLocations,
                sceneTriggerAudioID : req.body.sceneTriggerAudioID,
                scenePrimaryAudioTitle : req.body.scenePrimaryAudioTitle,
                sceneAmbientAudioID : req.body.sceneAmbientAudioID,
                scenePrimaryAudioID : req.body.scenePrimaryAudioID,
                scenePrimaryAudioStreamURL : req.body.scenePrimaryAudioStreamURL,
                sceneAmbientAudioStreamURL : req.body.sceneAmbientAudioStreamURL,
                sceneTriggerAudioStreamURL : req.body.sceneTriggerAudioStreamURL,
                scenePrimaryAudioGroups : req.body.scenePrimaryAudioGroups,
                sceneAmbientAudioGroups : req.body.sceneAmbientAudioGroups,
                sceneTriggerAudioGroups : req.body.sceneTriggerAudioGroups,
                sceneBPM : req.body.sceneBPM != null ? req.body.sceneBPM : "100",
                scenePrimaryPatch1 : req.body.scenePrimaryPatch1,
                scenePrimaryPatch2 : req.body.scenePrimaryPatch2,
                scenePrimaryMidiSequence1 : req.body.scenePrimaryMidiSequence1,
                scenePrimarySequence2Transpose : req.body.scenePrimarySequence2Transpose != null ? req.body.scenePrimarySequence2Transpose : "0",
                scenePrimarySequence1Transpose : req.body.scenePrimarySequence1Transpose != null ? req.body.scenePrimarySequence1Transpose : "0",
                scenePrimaryMidiSequence2 : req.body.scenePrimaryMidiSequence2,
                sceneAmbientVolume : req.body.sceneAmbientVolume,
                scenePrimaryVolume : req.body.scenePrimaryVolume,
                sceneTriggerVolume : req.body.sceneTriggerVolume,
                sceneWeatherAudioVolume : req.body.sceneWeatherAudioVolume,
                sceneMediaAudioVolume : req.body.sceneMediaAudioVolume,
                sceneAmbientSynth1Volume : req.body.sceneAmbientSynth1Volume,
                sceneAmbientSynth2Volume : req.body.sceneAmbientSynth2Volume,
                sceneTriggerSynth1Volume : req.body.sceneTriggerSynth1Volume,
                sceneAmbientPatch1 : req.body.sceneAmbientPatch1,
                sceneAmbientPatch2 : req.body.sceneAmbientPatch2,
                sceneAmbientSynth1ModulateByDistance : req.body.sceneAmbientSynth1ModulateByDistance != null ? req.body.sceneAmbientSynth1ModulateByDistance : false,
                sceneAmbientSynth2ModulateByDistance : req.body.sceneAmbientSynth2ModulateByDistance != null ? req.body.sceneAmbientSynth2ModulateByDistance : false,
                sceneAmbientSynth1ModulateByDistanceTarget : req.body.sceneAmbientSynth1ModulateByDistanceTarget != null ? req.body.sceneAmbientSynth1ModulateByDistanceTarget: false,
                sceneAmbientSynth2ModulateByDistanceTarget : req.body.sceneAmbientSynth2ModulateByDistanceTarget != null ? req.body.sceneAmbientSynth2ModulateByDistanceTarget : false,
                sceneAmbientMidiSequence1 : req.body.sceneAmbientMidiSequence1,
                sceneAmbientMidiSequence2 : req.body.sceneAmbientMidiSequence2,
                sceneAmbientSequence1Transpose : req.body.sceneAmbientSequence1Transpose != null ? req.body.sceneAmbientSequence1Transpose : "0",
                sceneAmbientSequence2Transpose : req.body.sceneAmbientSequence2Transpose != null ? req.body.sceneAmbientSequence2Transpose : "0",
                sceneTriggerPatch1 : req.body.sceneTriggerPatch1,
                sceneTriggerPatch2 : req.body.sceneTriggerPatch2,
                sceneTriggerPatch3 : req.body.sceneTriggerPatch3,
                sceneGeneratePrimarySequences : req.body.sceneGeneratePrimarySequences != null ? req.body.sceneGeneratePrimarySequences : false,
                sceneGenerateAmbientSequences : req.body.sceneGenerateAmbientSequences != null ? req.body.sceneGenerateAmbientSequences : false,
                sceneGenerateTriggerSequences : req.body.sceneGenerateTriggerSequences != null ? req.body.sceneGenerateTriggerSequences : false,
                sceneLoopPrimaryAudio : req.body.sceneLoopPrimaryAudio != null ? req.body.sceneLoopPrimaryAudio : false,
                scenePrimaryAudioLoopCount : req.body.scenePrimaryAudioLoopCount != null ? req.body.scenePrimaryAudioLoopCount : 0,
                sceneAutoplayPrimaryAudio : req.body.sceneAutoplayPrimaryAudio != null ? req.body.sceneAutoplayPrimaryAudio : false,
                scenePrimaryAudioVisualizer : req.body.scenePrimaryAudioVisualizer != null ? req.body.scenePrimaryAudioVisualizer : false,
                scenePrimaryAudioTriggerEvents : req.body.scenePrimaryAudioTriggerEvents != null ? req.body.scenePrimaryAudioTriggerEvents : false,
                sceneAttachPrimaryAudioToTarget : req.body.sceneAttachPrimaryAudioToTarget != null ? req.body.sceneAttachPrimaryAudioToTarget : false,
                sceneAutoplayAudioGroup : req.body.sceneAutoplayAudioGroup != null ? req.body.sceneAutoplayAudioGroup : false,
                sceneLoopAllAudioGroup : req.body.sceneLoopAllAudioGroup != null ? req.body.sceneLoopAllAudioGroup : false,
                sceneAnchorPositionAudioGroup : req.body.sceneAnchorPositionAudioGroup != null ? req.body.sceneAnchorPositionAudioGroup : false,
                sceneAnchorCanvasAudioGroup : req.body.sceneAnchorCanvasAudioGroup != null ? req.body.sceneAnchorCanvasAudioGroup : false,
                sceneCreateAudioSpline : req.body.sceneCreateAudioSpline != null ? req.body.sceneCreateAudioSpline : false,
                sceneAttachAudioGroupToTarget : req.body.sceneAttachAudioGroupToTarget != null ? req.body.sceneAttachAudioGroupToTarget : false,
                sceneUseMicrophoneInput : req.body.sceneUseMicrophoneInput != null ? req.body.sceneUseMicrophoneInput : false,
//                    sceneAmbientAudio2ID : req.body.sceneAmbientAudio2ID,
                sceneKeynote : req.body.sceneKeynote,
                sceneDescription : req.body.sceneDescription,
                sceneGreeting : req.body.sceneGreeting,
                sceneQuest : req.body.sceneQuest,
                sceneFont : req.body.sceneFont,
                sceneFontWeb1  : req.body.sceneFontWeb1,
                sceneFontWeb2  : req.body.sceneFontWeb2,
                sceneFontFillColor : req.body.sceneFontFillColor,
                sceneFontOutlineColor : req.body.sceneFontOutlineColor,
                sceneFontGlowColor : req.body.sceneFontGlowColor,
                sceneTextBackground : req.body.sceneTextBackground,
                sceneTextBackgroundColor : req.body.sceneTextBackgroundColor,
                sceneTextItems : req.body.sceneTextItems, //ids of text items
                sceneText : req.body.sceneText, //this is "primary" tex
                sceneTextLoop : req.body.sceneTextLoop != null ? req.body.sceneTextLoop : false, //also for "primary" text below
                scenePrimaryTextFontSize : req.body.scenePrimaryTextFontSize != null ? req.body.scenePrimaryTextFontSize : "12",
                scenePrimaryTextMode : req.body.scenePrimaryTextMode != null ? req.body.scenePrimaryTextMode : "Normal",
                scenePrimaryTextAlign : req.body.scenePrimaryTextAlign != null ? req.body.scenePrimaryTextAlign : "Left",
                sceneNetworking : req.body.sceneNetworking != null ? req.body.sceneNetworking : "None",
                scenePrimaryTextRotate : req.body.scenePrimaryTextRotate != null ? req.body.scenePrimaryTextRotate : false,
                scenePrimaryTextScaleByDistance : req.body.scenePrimaryTextScaleByDistance != null ? req.body.scenePrimaryTextScaleByDistance : false,
                sceneTextAudioSync : req.body.sceneTextAudioSync != null ? req.body.sceneTextAudioSync : false,
                sceneTextUseModals : req.body.sceneTextUseModals != null ? req.body.sceneTextUseModals : true,
                sceneObjects: req.body.sceneObjects,
                sceneModels: req.body.sceneModels,
                sceneObjectGroups: req.body.sceneObjectGroups,
                sceneTimedEvents: req.body.sceneTimedEvents,
                sceneLastUpdate : lastUpdateTimestamp
                
                }
            });
        } if (err) {res.send(err)} else {res.send("updated " + new Date())}
    });
});

app.get('/sceneloc/:key', function (req, res){

    resObj = {};

    db.scenes.find({ "short_id" : req.params.key}, function(err, scenes) {
        if (err || !scenes) {
            console.log("cain't get no scenes... " + err);
        } else {
            resObj.sceneLatitude = scenes[0].sceneLatitude;
            resObj.sceneLongitude = scenes[0].sceneLongitude;
            resObj.sceneLocationRange = scenes[0].sceneLocationRange;
//                console.log(JSON.stringify(scenes));
            res.json(resObj);
        }
    });
});

app.get('/seq/:_seqID', function (req, res) {
    console.log("tryna get sequence");
    var pathNumbers = [];
    var pathSequence = [];
    db.paths.find({}, function (err, paths) {
        if (err || !paths) {
            console.log("no paths found ", err);
        } else {
            paths.forEach(function (path) {

                pathNumbers.push(parseInt(path.pathNumber));
                pathNumbers.sort(function(a, b){return a-b});
            });
            paths.forEach(function (path) {
                for (var i = 0; i < pathNumbers.length; i++) {
                    if (pathNumbers[i] = path.pathNumber) {
                        pathSequence.push(path._id);
                        break;
                    }
                }
            });
        }

        //   pathSequence.sort(function(a, b){return a-b});
        console.log("pathSequence", pathSequence);
        res.json(pathSequence);
    });
});

//return a short code that will be unique for the spec'd type (scene, pic, audio)
app.get('/newshortcode/:type', checkAppID, requiredAuthentication, function (req, res) {


});

//check uniqueness and websafeness (can be used as path) of title for the spec'd type, return bool
app.get('/checktitle/:type', checkAppID, requiredAuthentication, function (req, res) {


});

app.get('/update_public_scene/:_id', requiredAuthentication, function (req, res) { //TODO lock down w/ checkAppID, requiredAuthentication

    console.log("tryna update public scene id: ", req.params._id + " excaped " + entities.decodeHTML(req.params._id));

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

    var mp3url = "";
    var oggurl = "";
    var pngurl = "";
    var mp4url = "";
    var postcard1 = "";
    var image1url = "";
    var short_id = "";
    var picArray = new Array;
    var postcardArray = new Array;
    var imageAssets = "";
    var imageEntities = "";
    var skyboxUrl = "";
    var skyboxID = "";
    var skySettings = "";
    var fogSettings = "";
    var ground = "";
    var ocean = "";
    var targetObjectAsset = "";
    var targetObjectEntity = "";
    var skyParticles;
    var videoAsset = "";
    var videoEntity = "";
    var nextLink = "";
    var prevLink = "";
    var loopable = "";
    var autoplay = false;
    var bucketFolder = "eloquentnoise.com";
    var winOK = "";
    var androidOK = "";
    var iosOK = "";
    var primaryText = "";
    var keynoteText = "";
    var descText = "";
    var iosInstallUrl = "https://itunes.apple.com/us/app/servicemedia/id1016515870?mt=8";
    var androidInstallUrl = "https://play.google.com/store/apps/details?id=net.servicemedia.servmed";
    var windowsInstallUrl = "https://servicemedia.s3.amazonaws.com/builds/sm2018.zip";
    var theUrl = "";

    async.waterfall([


                function (callback) {
                    var o_id = ObjectID(reqstring);
                    db.scenes.findOne({"_id": o_id},
                        function (err, sceneData) { //fetch the path info by title TODO: urlsafe string

                            if (err || !sceneData) {
                                console.log("4 error getting scene data: " + err);
                                callback(err);
                            } else { //make arrays of the pics and audio items
                                console.log("creating sceneResponse data : audio id " + sceneData.scenePrimaryAudioID);
                                short_id = sceneData.short_id;
                                sceneResponse = sceneData;
                                if (sceneResponse.sceneDomain != null && sceneResponse.sceneDomain != "") {
                                    bucketFolder = sceneResponse.sceneDomain;
                                    
                                    sceneData.scenePictures.forEach(function (picture) {
                                        var p_id = ObjectID(picture); //convert to binary to search by _id beloiw
                                        requestedPictureItems.push(p_id); //populate array
                                    });

                                    sceneResponse.scenePostcards = sceneData.scenePostcards;
                                    if (sceneResponse.sceneUseGlobalFog) {
                                        fogSettings = "fog=\x22type: linear; density:.005; near: 1; far: 30; color: " + sceneResponse.sceneColor1 + "\x22";
                                    }
                                    if (sceneResponse.sceneSkyParticles != undefined && sceneResponse.sceneSkyParticles != null && sceneResponse.sceneSkyParticles != "None") { 
                                        skyParticles = "<a-entity scale='.5 .5 .5' position='0 3 0' particle_mangler particle-system=\x22preset: dust; randomize: true color: " + sceneResponse.sceneColor1 + "," + sceneResponse.sceneColor2 +"\x22></a-entity>";
                                    }
                                    if (sceneResponse.sceneUseFloorPlane) {
                                        ground = "<a-plane rotation='-90 0 0' position='0 -5 0' width='150' height='150' color=\x22" + sceneResponse.sceneColor2 + "\x22></a-plane>";
                                    }
                                    if (sceneResponse.sceneWater != null && sceneResponse.sceneWater.name != "none") {
                                        console.log("ocean! " + JSON.stringify(sceneResponse.sceneWater));
                                        ocean = "<a-ocean></a-ocean>";
                                    }
                                    if (sceneResponse.sceneUseTargetObject && sceneResponse.sceneTargetObject != null) {
                                        if (sceneResponse.sceneTargetObject.name == "gltftest" ) {
                                        targetObjectAsset = "<a-asset-item id=\x22targetObj\x22 src=\x22../assets/models/korkus/KorkusOnly.gltf\x22></a-asset-item>";
                                        targetObjectEntity = "<a-entity class=\x22gltf\x22 gltf-model=\x22#targetObj\x22 position='-5 5 5'></a-entity>";
                                        }
                                    }

                                    if (sceneResponse.sceneLoopPrimaryAudio) {
                                        loopable = " loop ";
                                    }
                                    if (sceneResponse.scenePrimaryAudioID != null && sceneResponse.scenePrimaryAudioID.length > 8 ) {
                                        var pid = ObjectID(sceneResponse.scenePrimaryAudioID);
                                        console.log("pid audio " + ObjectID(sceneResponse.scenePrimaryAudioID));
                                        // requestedAudioItems.push(sceneData.scenePrimaryAudioID);
                                        requestedAudioItems.push(ObjectID(sceneResponse.scenePrimaryAudioID));
                                    } 
                                    callback();
                                } else {
                                    callback("error - domain name required");
                                }
                            }
                        });

                },


                // "<li>" +
                // "<a class=\x22mx-2 btn btn-primary btn-sm\x22" + nextLink + " target=\x22_blank\x22>Next Scene</a>" +
                // "</li>" +
//
//            function(callback) { //check for target bucket, create if absent
//
//                bucketFolder = "mvmv.us" + short_id;
//                console.log("target bucket : " + bucketFolder);
//                s3.headBucket({Bucket: bucketFolder}, function (err, data) {
//                        if (err) {
//                            s3.createBucket({Bucket: bucketFolder}, function (err2, data) {
//                                if (err2) {
//                                    console.log(err2);
//                                    callback(err2);
//                                } else {
//                                    console.log("tryna create bucket " + bucketFolder);
//                                    callback(null);
//                                }
//                            });
//                        } else {
//                            console.log("Bucket exists and we have access");
//                            callback(null);
//                        }
//                    },
            

            function (callback){
                var params = {
                    Bucket: bucketFolder,
                    Prefix: short_id + '/'
                };

                s3.listObjects(params, function(err, data) { //delete all the things in the target bucket, to cleanup kruft..
                    if (err) {
                        console.log("error listing objs " + err);
                        return callback(err);
                    } else {
                      console.log("fixing to delete objs: " + data);

                    if (data.Contents.length == 0) {
                        callback(null);
                        } else {
                        params = {Bucket: bucketFolder};
                        params.Delete = {Objects:[]};

                        data.Contents.forEach(function(content) {
                            params.Delete.Objects.push({Key: content.Key});
                        });
                        console.log("delete params: " + JSON.stringify(params));
                        s3.deleteObjects(params, function(err, data) {
                            if (err) {
                                console.log("error deleting " + err)
                                return callback(err);
                            } else {
                                callback(null);
                            }
                        });
                    }
                }
            });
            },

            function (callback) {
                if (sceneResponse.sceneNextScene != null && sceneResponse.sceneNextScene != "") {
                    db.scenes.findOne({$or: [ { short_id: sceneResponse.sceneNextScene }, { sceneTitle: sceneResponse.sceneNextScene } ]}, function (err, scene) {
                        if (scene == err) {
                            console.log("didn't find next scene");
                        } else {

                            nextLink == "<li>" +
                            "<a class=\x22mx-2 btn btn-primary btn-sm\x22href=\x22../" + scene.short_id + "/index.html\x22 target=\x22_blank\x22>Next Scene</a>" +
                            "</li>";
                        }
                    }); 
                }
                if (sceneResponse.scenePreviousScene != null && sceneResponse.scenePreviousScene != "") {
                    db.scenes.findOne({$or: [ { short_id: sceneResponse.scenePreviousScene }, { sceneTitle: sceneResponse.scenePreviousScene } ]}, function (err, scene) {
                        if (scene == err) {
                            console.log("didn't find previous scene");
                        } else {
                            prevLink = "<li>" +
                                        "<a class=\x22mx-2 btn btn-primary btn-sm\x22href=\x22../" + scene.short_id + "/index.html\x22 target=\x22_blank\x22>Previous Scene</a>" +
                                        "</li>";
                        }
                    }); 
                }
                callback();
            },
            
            function (callback) { //update the install urls //TODO - use app id instead
                console.log("sceneAppName " + sceneResponse.sceneAppName + " appdomain " + sceneResponse.sceneDomain);
                db.apps.findOne({$and: [{"appname": sceneResponse.sceneAppName}, {"appdomain": sceneResponse.sceneDomain}]}, function (err, app) {
                    if (err || !app) {
                        console.log("error getting audio items: " + err);
                        callback(null);
                    } else {
                        androidInstallUrl = app.androidInstallUrl;
                        iosInstallUrl = app.iosInstallUrl;
                        windowsInstallUrl = app.windowsInstallUrl;
                        callback(null);
                    }
                });
            },

            function (callback) { //get the qr code
                QRCode.toDataURL(sceneResponse.short_id, function (err, url) {
                    theUrl = url;
                    // console.log("qrcode: " + theUrl);
                });
                callback(null);
            },

            function (callback) { //fethc audio items
                    console.log("requestedAUdioItems " + requestedAudioItems[0]);
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
                        // console.log("audio_item: ", audio_items[i]);
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
                        s3.copyObject({Bucket: bucketFolder, CopySource: 'servicemedia/users/' + audio_items[i].userID +"/pictures/"+ audio_items[i]._id + "." + pngName, Key: short_id +"/"+ audio_items[i]._id + "." + pngName}, function (err,data){
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
                                        videosphereAsset =  
                                        videoEntity = "<a-videosphere src=\x22" + mp4url + "\x22 rotation=\x220 180 0\x22 material=\x22shader: flat; transparent: true;\x22></a-videosphere>";
//                                        skySettings = "transparent='true'";
                                    } else {
                                        videoEntity = "<a-video src=\x22#video1\x22 position='25 5 -15' width='8' height='4.5' look-at=\x22#player\x22></a-video>";
                                        console.log("VIDEO ENTITIE 11396 " + videoEntity);
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
                                postcardArray.push(postcard1);
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
            function (callback) { //checks for equirect, should just get 'em
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
                                    if (picture_item.orientation.toLowerCase() == "equirectangular") {
                                        skyboxID = picID;
                                    }
                                    s3.copyObject({Bucket: bucketFolder, CopySource: 'servicemedia/users/' + picture_item.userID +"/"+ picture_item.filename, //use full rez pic for skyboxen
                                        Key: short_id +"/"+ picture_item._id + ".original." + picture_item.filename}, function (err, data) {
                                        if (err) {
                                            console.log("ERROR copyObject" + err);
                                        } else {
                                            console.log('SUCCESS copyObject');
                                        }
                                    });
                                    if (picture_item.orientation.toLowerCase() != "equirectangular") {
                                        index++;
                                        image1url = picture_item._id + ".standard." + picture_item.filename;
                                        picArray.push(image1url);
                                        // imageAssets = imageAssets + "<img id=\x22smimage" + index + "\x22 src='" + image1url + "'>";
                                        // imageEntities = imageEntities + "<a-image look-at=\x22#player\x22 width='10' segments-height='4' segments-width='2' height='10' position='-2 6 2' rotation='0 180 0' visible='true' src=\x22#smimage" + index + "\x22></a-image>";
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

               if (sceneResponse.sceneUseSkybox && sceneResponse.sceneSkybox != null) {
//                    if (sceneResponse.sceneUseSkybox) {
                    var oo_id = null;
                            if (skyboxID != "") {
                                oo_id = ObjectID(skyboxID);
                            } else {
                                if (sceneResponse.sceneSkybox != null && sceneResponse.sceneSkybox != "")
                                oo_id = ObjectID(sceneResponse.sceneSkybox);
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
                                        callback(null);
                                    }
                                });
                            } else {
                                callback(null);
                            }
               } else {
                   //                      callback(null);
                   callback(null);
               }
            },

            function (callback) {
                // var hasPics = false;
                // if (picArray.Length > 0) {
                //     hasPics = true;
                // }

                if (sceneResponse.sceneIosOK) {
                    iosOK = "<a href=" + iosInstallUrl + "><div class=\x22apple_yes\x22></div></a>";
                } else {
                    iosOK = "<div class=\x22apple_no\x22></div>";
                }
                if (sceneResponse.sceneWindowsOK) {
                    winOK = "<a href=" + windowsInstallUrl + "><div class=\x22windows_yes\x22></div></a>";
                } else {
                    winOK = "<div class=\x22windows_no\x22></div>";
                }
                if (sceneResponse.sceneAndroidOK) {
                    androidOK = "<a href=" + androidInstallUrl + "><div class=\x22android_yes\x22></div></a>";
                } else {
                    androidOK = "<div class=\x22android_no\x22></div>";
                }

                if (sceneResponse.sceneKeynote != null && sceneResponse.sceneKeynote.length > 0){
                    keynoteText =  "<li class=\x22list-group-item\x22 style=\x22text-align: left; margin-top: 10px; padding: 10px; background-color: rgba(255, 255, 255, 0.5);\x22><p><strong>Keynote:&nbsp;&nbsp;</strong></p><p>" + sceneResponse.sceneKeynote + "</p></li>"
                }
                if (sceneResponse.sceneDescription != null && sceneResponse.sceneDescription.length > 0) {
                    descText = "<li class=\x22list-group-item\x22 style=\x22text-align: left; margin-top: 10px; padding: 10px; background-color: rgba(255, 255, 255, 0.5);\x22><p><strong>Description:&nbsp;&nbsp;</strong></p><p>" + sceneResponse.sceneDescription + "</p></li>"
                }
                if (sceneResponse.sceneText != null && sceneResponse.sceneText.length > 0) {
                    sceneResponse.sceneText = sceneResponse.sceneText.replace(/\n/gi, "<br>");
                    primaryText =  "<li class=\x22list-group-item\x22 style=\x22text-align: left; margin-top: 10px; padding: 10px; background-color: rgba(255, 255, 255, 0.5);\x22><p><strong>Main Text:&nbsp;&nbsp;</strong></p><p>" + sceneResponse.sceneText + "</p></li>"
                }
                var htmltext = "<html xmlns='http://www.w3.org/1999/xhtml' xmlns:fb='http://ogp.me/ns/fb#'>" +
                    "<!doctype html>"+
                    "<html lang=\x22en\x22>"+
                    "<head> " +
                    "<meta charset=\x22utf-8\x22/>" +

    
                    "<meta property=\x22og:title\x22  name=\x22og:title\x22  content=\x22" + sceneResponse.sceneTitle + "\x22/>" +
                    "<meta property=\x22og:url\x22 name=\x22og:url\x22 content=\x22http://" + sceneResponse.sceneDomain + "/" + sceneResponse.short_id + "\x22 /> " +
                    "<meta property=\x22og:type\x22 name=\x22og:type\x22 content=\x22website\x22/> " +
                    "<meta property=\x22og:image\x22 name=\x22og:image\x22 content=\x22http://" + sceneResponse.sceneDomain + "/" + sceneResponse.short_id + "/" + postcardArray[0] + "\x22 /> " +
                    "<meta property=\x22og:image:height\x22 name=\x22og:image:height\x22 content=\x221024\x22 /> " +
                    "<meta property=\x22og:image:width\x22  name=\x22og:image:width\x22 content=\x221024\x22 /> " +
                    "<meta property=\x22og:description\x22 name=\x22og:description\x22 content=\x22" + sceneResponse.sceneDescription + "\x22 /> " +
                    "<meta name=\x22viewport\x22 content=\x22width=device-width, initial-scale=1, shrink-to-fit=no\x22></meta>" +
                    // "<meta name='viewport' content='width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no'/>" +
                    "<meta name=\x22description\x22 content=\x22" + sceneResponse.sceneDescription + "\x22/>" +
                    "<meta name=\x22mobile-web-app-capable\x22 content=\x22yes\x22>" +
                    "<meta name=\x22apple-mobile-web-app-capable\x22 content=\x22yes\x22>" +
                    "<meta name=\x22apple-mobile-web-app-status-bar-style\x22 content=\x22black-translucent\x22 />" +
                    // "<meta name=\x22apple-mobile-web-app-status-bar-style' content=\x22black\x22>" +
                    "<meta name=\x22robots\x22 content=\x22index,follow\x22/>" +

                    "<link rel=\x22stylesheet\x22 href=\x22https://servicemedia.net/css/smstyle.css\x22>" +

                    "<link rel=\x22stylesheet\x22 href=\x22https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css\x22 integrity=\x22sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm\x22 crossorigin=\x22anonymous\x22></link>"+

                    "<title>" + sceneResponse.sceneTitle + "</title>" +

                    "</head>" +

                    "<body bgcolor='black'>" +

                    
                    "<script>" +
                    "window.fbAsyncInit = function() {" +
                    "FB.init({" +
                    "appId : \x221678172455793030\x22," +
                    "xfbml : true," +
                    "version : 'v2.8'" +
                    "});" +
                    "FB.AppEvents.logPageView();" +
                    "};" +
                    "(function(d, s, id) {" +
                    "var js, fjs = d.getElementsByTagName(s)[0];" +
                    "if (d.getElementById(id)) return;" +
                    "js = d.createElement(s); js.id = id;" +
                    "js.src = \x22//connect.facebook.net/en_US/sdk.js\x22;" +
                    "fjs.parentNode.insertBefore(js, fjs);" +
                    "}(document, \x22script\x22, \x22facebook-jssdk\x22));</script>" +
                    
                //    "<nav class=\x22navbar navbar-expand-lg navbar-light bg-light\x22>" +
                    // "<nav class=\x22navbar navbar-expand-lg navbar-toggleable-md navbar-light bg-light fixed-top\x22>" +
                    // "<nav class=\x22navbar navbar-expand-lg navbar-light bg-light fixed-top\x22>" +
                    "<nav class=\x22navbar navbar-expand-lg navbar-dark bg-dark fixed-top\x22>" +
                    // "<button class=\x22navbar-toggler\x22 type=\x22button\x22 data-toggle=\x22collapse\x22 data-target=\x22#navbarSupportedContent\x22 aria-controls=\x22navbarSupportedContent\x22 aria-expanded=\x22false\x22 aria-label=\x22Toggle navigation\x22>"+
                    // "<span class=\x22navbar-toggler-icon\x22></span>"+
                    // "</button>"+
                    "<a class=\x22navbar-brand\x22 href=\x22http://" + sceneResponse.sceneDomain + "\x22>" + sceneResponse.sceneDomain + "</a>" +
                    "<button class=\x22navbar-toggler navbar-toggler-right\x22 type=\x22button\x22 data-toggle=\x22collapse\x22 data-target=\x22#navbarCollapse\x22 aria-controls=\x22navbarCollapse\x22 aria-expanded=\x22false\x22 aria-label=\x22Toggle navigation\x22>" +
                    "<span class=\x22navbar-toggler-icon\x22></span>" +
                    "</button>" +
                    "<div class=\x22collapse navbar-collapse\x22 id=\x22navbarCollapse\x22>"+


                    // "<div class=\x22collapse navbar-collapse\x22 id=\x22navbarCollapse\x22>" +

                    "<div class=\x22nav-item active mx-2\x22>" +
                    "<span class=\x22text-white\x22>  Title : <h4>" + sceneResponse.sceneTitle + "</h4></span>"+
                    "</div>" +
                    "<div class=\x22nav-item active mx-2 pull-right\x22>" +
                    "<span class=\x22text-white\x22>  Short Code : <h4><a href=\x22https://strr.us/s/" + sceneResponse.short_id + "\x22>" + sceneResponse.short_id + "</a></h4></span>"+
                    "</div>" +

                    // "<li class=\x22nav-item active pull-right\x22>" +
                    // "<a class=\x22nav-link\x22 href=\x22http://" + sceneResponse.sceneDomain + "\x22>Home <span class=\x22sr-only\x22>(current)</span></a>" +
                    // "</li>" +
                    "<div class=\x22mx-2 pull-right\x22>"+



                    // "<div class=\x22pull-right\x22 data-toggle="tooltip" data-placement="top" title="Scene Available on Windows App" ng-class="{true: 'windows_no', false: 'windows_yes'}[!scene.sceneWindowsOK]">{{!scene.sceneWindowsOK && '' || ''}}</div>" +
                    // "<div class=\x22pull-right\x22ng-show="scene.sceneAndroidOK" data-toggle="tooltip" data-placement="top" title="Scene Available on Android App" ng-class="{true: 'android_no', false: 'android_yes'}[!scene.sceneAndroidOK]" >{{!scene.sceneAndroidOK && '' || ''}}</div>" +
                    // "<div class=\x22pull-right\x22ng-show="scene.sceneIosOK" data-toggle="tooltip" data-placement="top" title="Scene Available on IOS App" ng-class="{true: 'apple_no', false: 'apple_yes'}[!scene.sceneIosOK]" >{{!scene.sceneIosOK && '' || ''}}</div></a>" +

                    "<ul class=\x22navbar-nav pull-right\x22>" +
                    "<li class=\x22nav-item active mx-2\x22>" +
                   

                    "<li>" +
                    "&nbsp" +
                    "</li>" +
                    prevLink +
                    nextLink +

                    "<li>" +
                    "<a class=\x22mx-2 btn btn-primary btn-sm\x22 href=\x22../" + sceneResponse.short_id + "/webxr.html\x22 target=\x22_blank\x22>WebXR</a>" +
                    "</li>" +
                    "<li>" +
                    "<a class=\x22mx-2 btn btn-primary btn-sm\x22 href=\x22/connect/?scene=" + sceneResponse.short_id + "\x22 target=\x22_blank\x22>Livecast</a>" +
                    "</li>" +
                    "<li>" +
                    "<a class=\x22mx-2 pull-right  glyphicon glyphicon-envelope btn btn-primary btn-sm\x22 href=\x22mailto:" + sceneResponse.short_id + "@" + sceneResponse.sceneDomain + "\x22>Message</a>"+
                    // "<a class=\x22mx-2 pull-right>Send Message : " + sceneResponse.short_id + "@" + sceneResponse.sceneDomain + "</a>"+
                    "</li>" +

                    "<li>" +
                    "&nbsp &nbsp &nbsp &nbsp" +
                    "</li>" +
                    "<li class=\x22nav-item active\x22>" +
                    iosOK +
                    "</li>" +

                    "<li class=\x22nav-item active\x22>" +
                    androidOK +
                    "</li>" +
                    "<li class=\x22nav-item active\x22>" +
                    winOK +
                    "</li>" +
                    "<li>" +
                    "&nbsp &nbsp &nbsp &nbsp" +
                    "</li>" +
                    "<li>" +
                    "<a href=\x22https://servicemedia.net/qrcode/" + sceneResponse.sceneDomain + "/" + sceneResponse.short_id + "\x22 target=\x22_blank\x22><img style=\x22display: block; width: auto; height: 64; max-width: 64;\x22 alt=\x22qrcode\x22 src=\x22" + theUrl + "\x22/></a>" +
                    "</li>" +
                    "<li>" +
                    "&nbsp &nbsp &nbsp &nbsp" +
                    "</li>" +
                    "<li>" +
                    "<audio controls " + loopable + ">" +
                     "<source src='" + oggurl + "'type='audio/ogg'>" +
                     "<source src='" + mp3url + "'type='audio/mpeg'>" +
                     "Your browser does not support the audio element. " +
                     "</audio>" +
                    "</li>" +
                    
                    "<li>" +
                    "&nbsp" +
                    "</li>" +
                    "<li class=\x22nav-item active mx-2\x22>" +
                    " <div class=\x22fb-share-button\x22" +
                    " data-href=\x22http://" + sceneResponse.sceneDomain + "/" + sceneResponse.short_id + "\x22" +
                    " data-layout=\x22button_count\x22>" +
                    " </div>" +
                    "</li>" +
                    "<li class=\x22nav-item active mx-2 pull-right\x22>" +
                    "<div class=\x22fb-like\x22" +
                    "data-href=\x22http://" + sceneResponse.sceneDomain + "/" + sceneResponse.short_id + "\x22" +
                    "data-layout=\x22standard\x22" +
                    "data-action=\x22like\x22" +
                    "data-show-faces=\x22true\x22>" +
                    "</div>" +
                    "</li>" +


                    "</ul>" +
                    //  "</div>"+

                    //  "</div>"+

                    "</div>"+
                    "       </nav>" +

                    "<div id=/x22fb-root/x22></div>" +
//                  "<div style='background-image: url(" + image1url + "); height: 100%; width: 100%; border: 1px solid black;'>" +
                    "<div class=\x22container-fluid\x22>"+
                    // "<br><br>" +
                    "<div class=\x22my-12 row\x22>"+
                    "<div class=\x22 mx-5  col-sm\x22>"+
                    "<div class=\x22panel panel-default\x22 style=\x22text-align: center\x22>" +
                    //  "<div class=\x22panel-heading\x22>Scene Info:</div>" +
                     "<div class=\x22panel-body\x22 style=\x22text-align: center; margin-top: 50px; padding: 50px;\x22>" +
                     "<ul class=\x22list-group\x22 style=\x22text-align: left; margin-top: 10px; padding: 10px; background-color: rgba(255, 255, 255, 0.5);\x22>"+

                    keynoteText +
                    descText +
                    primaryText +
                    // "<li><div style=\x22width: 100%; top-margin: 20px; text-align: center;\x22><a href=\x22https://servicemedia.net/qrcode/" + sceneResponse.short_id +"\x22><img width=\x22auto\x22 height=\x22100%\x22 style=\x22display: block;\x22 alt=\x22qrcode\x22 src=\x22" + theUrl + "\x22/></a></div></li>" +
                    "</ul>" +
                    "</div>" +
                    "</div>" +

                    "</div>"+
                    "<div class=\x22 mx-2  col-sm\x22>"+

                    "</div>"+
                    "<div class=\x22 mx-4  col-sm\x22>"+
                    // "<div style=\x22width: 100%; top-margin: 0px; text-align: center;\x22><a href=\x22https://servicemedia.net/qrcode/" + sceneResponse.short_id +"\x22><imgwidth=\x22auto\x22 height=\x22100%\x22 style=\x22display: block;\x22 alt=\x22qrcode\x22 src=\x22" + theUrl + "\x22/></a></div>" +
                    // "<div style=\x22width: 100%; top-margin: 10px; text-align: center;\x22><img width=\x22auto\x22 height=\x22100%\x22 style=\x22display: block;\x22 alt=\x22qrcode\x22 src=\x22" + url + "\x22/></div>"
                    "</div>"+
                    // "<div class=\x22mx-4  bg-light  col-sm mx-auto\x22>"+

                    // "<div  style=\x22margin-top: 100px; padding: 100px;\x22 class=\x22my-20 card\x22><h4>" + sceneResponse.sceneDescription + "</h4></div>"+
                    // "</div>"+
                    // "<div class=\x22mx-4 bg-light col-sm\x22>"+
                    // "<div class=\x22card mx-4\x22>" + sceneResponse.sceneTags + "</div>"+
                    // "</div>"+

                    "</div>"+


                    "</div>" +
                   "</div>" +

                    // "<script src=\x22https://code.jquery.com/jquery-3.2.1.slim.min.js\x22 integrity=\x22sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN\x22 crossorigin=\x22anonymous\x22></script>" +
                    // "<script src=\x22https://cdnjs.cloudflare.com/ajax/libs/danielgindi-jquery-backstretch/2.1.15/jquery.backstretch.js\x22></script>" +
                    "<script src=\x22../dist/jquery-3.1.1.min.js\x22></script>" +
                    "<script src=\x22../dist/jquery.backstretch.min.js\x22></script>" +
                    "<script src=\x22https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js\x22 integrity=\x22sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q\x22 crossorigin=\x22anonymous\x22></script>" +
                    "<script src=\x22https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js\x22 integrity=\x22sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl\x22 crossorigin=\x22anonymous\x22></script>" +

                    "<script>" +
                // To attach Backstrech as the body's background
                        // "if (" + hasPics + ") {"+
                            "$.backstretch(" + JSON.stringify(postcardArray) + ", {duration: 6000, fade: 750});" +
                        // "} " +
                        // else if (postcard1.Length > 4) {"+
                        //     "$.backstretch('" + postcard1 + "');}" +

                    "</script>"+
                    "</body>" +
                "</html>";
                s3.putObject({ Bucket: bucketFolder, Key: short_id + "/" + "index.html", Body: htmltext,  ContentType: 'text/html', ContentEncoding: 'identity' }, function (err, data) {
                    console.log('uploaded');
                });
                callback();

             }
        ], //waterfall end

        function (err, result) { // #last function, close async
            res.send("page generated");
            console.log("waterfall done: " + result);
        }
    );
});


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  
app.post('/netradiodetails', function (req, res) {
    let streamurl = req.body.url;
    
    // deprecated for now, lib has a bad vuln
    // internetradio.getStationInfo(streamurl, function(error, station) {
    //     console.log(station);
    //     res.send(station);
    //   }, internetradio.StreamSource.SHOUTCAST_V2);


});
// app.post('/netradioheaders', function (req, res) { //no workie
//     let streamurl = req.body.url;
//     internetradio.getStationInfo(streamurl, function(error, station) {
//         console.log(station);
//         res.send(station);
//     }, internetradio.StreamSource.STREAM);
// });



///////////UNITY ROUTE
app.get('/scene/:_id/:platform/:version', function (req, res) { //called from app context - TODO lock down w/ checkAppID, requiredAuthentication

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


// app.get('/scene/:_id', function (req, res) { //TODO lock down w/ checkAppID, requiredAuthentication // deprecated, see version w/ platform param above, keeping this for old versions

//     console.log("tryna get scene id: ", req.params._id + " excaped " + entities.decodeHTML(req.params._id));

//     var platformType = req.params.platform;
//     var reqstring = entities.decodeHTML(req.params._id);
//     var audioResponse = {};
//     var pictureResponse = {};
//     var postcardResponse = {};
//     var sceneResponse = {};
//     var requestedPictureItems = [];
//     var requestedAudioItems = [];
//     sceneResponse.audio = [];
//     sceneResponse.pictures = [];
//     sceneResponse.postcards = [];

//     sceneResponse.sceneBundleUrl = "";
//     sceneResponse.qrcode = "";
//     var versionID = "assets56" //TODO env var?

//     async.waterfall([

//             function (callback) {
// //                    var o_id = ObjectID(reqstring);
//                 db.scenes.find({$or: [{ sceneTitle: reqstring },
//                         { short_id : reqstring },
//                         { _id : reqstring}]},
//                     function (err, sceneData) { //fetch the path info by title TODO: urlsafe string

//                         if (err || !sceneData || !sceneData.length) {
//                             console.log("error getting scene data: " + err);
//                             callback(err);
//                         } else { //make arrays of the pics and audio items
//                             sceneData[0].scenePictures.forEach(function (picture){
//                                 var p_id = ObjectID(picture); //convert to binary to search by _id beloiw
//                                 requestedPictureItems.push(p_id); //populate array
//                             });
//                             var triggerOID = ObjectID.isValid(sceneData[0].sceneTriggerAudioID) ? ObjectID(sceneData[0].sceneTriggerAudioID) : "";
//                             var ambientOID = ObjectID.isValid(sceneData[0].sceneAmbientAudioID) ? ObjectID(sceneData[0].sceneAmbientAudioID) : "";
//                             var primaryOID = ObjectID.isValid(sceneData[0].scenePrimaryAudioID) ? ObjectID(sceneData[0].scenePrimaryAudioID) : "";
//                             requestedAudioItems = [ triggerOID, ambientOID, primaryOID];

//                             // requestedAudioItems = [ ObjectID(sceneData[0].sceneTriggerAudioID), ObjectID(sceneData[0].sceneAmbientAudioID), ObjectID(sceneData[0].scenePrimaryAudioID)];

//                             sceneResponse = sceneData[0];
//                             callback(null);
//                         }

//                     });

//             },

//             function (callback) { //get qr code
//                 QRCode.toDataURL(sceneResponse.short_id, function (err, url) {
//                     // console.log(url);
//                     // var imgLink = "<img width=\x22128\x22 height=\x22128\x22 alt=\x22qrcode\x22 src=\x22" + url + "\x22/>"

//                     // res.send(imgLink);
//                     sceneResponse.qrcode = url;
//                   });
//                 callback(null);
//             },

//             function (callback) { //update link pic URLs //TODO check for freshness, and rescrape if needed
//                 if (sceneResponse.sceneWebLinks != null && sceneResponse.sceneWebLinks.length > 0) {
//                     for (var i = 0; i < sceneResponse.sceneWebLinks.length; i++) {
//                         var urlThumb = s3.getSignedUrl('getObject', {Bucket: 'servicemedia.web', Key: sceneResponse.sceneWebLinks[i].link_id + ".thumb.jpg", Expires: 6000});
//                         var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia.web', Key: sceneResponse.sceneWebLinks[i].link_id + ".half.jpg", Expires: 6000});
//                         var urlStandard = s3.getSignedUrl('getObject', {Bucket: 'servicemedia.web', Key: sceneResponse.sceneWebLinks[i].link_id + ".standard.jpg", Expires: 6000});
//                         sceneResponse.sceneWebLinks[i].urlThumb = urlThumb;
//                         sceneResponse.sceneWebLinks[i].urlHalf = urlHalf;
//                         sceneResponse.sceneWebLinks[i].urlStandard = urlStandard;

//                     }
//                 }
//                 callback(null);
//             },

//             function (callback) { //fethc audio items

//                 db.audio_items.find({_id: {$in: requestedAudioItems }}, function (err, audio_items)
//                 {
//                     if (err || !audio_items) {
//                         console.log("error getting audio items: " + err);
//                         callback(null);
//                     } else {

//                         callback(null, audio_items) //send them along
//                     }
//                 });
//             },




//             function(audio_items, callback) { //add the signed URLs to the obj array
//                 for (var i = 0; i < audio_items.length; i++) {
//                     //    console.log("audio_item: ", audio_items[i]);
//                     var item_string_filename = JSON.stringify(audio_items[i].filename);
//                     item_string_filename = item_string_filename.replace(/\"/g, "");
//                     var item_string_filename_ext = getExtension(item_string_filename);
//                     var expiration = new Date();
//                     expiration.setMinutes(expiration.getMinutes() + 1000);
//                     var baseName = path.basename(item_string_filename, (item_string_filename_ext));
//                     //console.log(baseName);
//                     var mp3Name = baseName + '.mp3';
//                     var oggName = baseName + '.ogg';
//                     var pngName = baseName + '.png';
//                     var urlMp3 = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_items[i].userID + "/" + audio_items[i]._id + "." + mp3Name, Expires: 60000});
//                     var urlOgg = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_items[i].userID + "/" + audio_items[i]._id + "." + oggName, Expires: 60000});
//                     var urlPng = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + audio_items[i].userID + "/" + audio_items[i]._id + "." + pngName, Expires: 60000});
// //                            audio_items.URLmp3 = urlMp3; //jack in teh signed urls into the object array
//                     audio_items[i].URLmp3 = urlMp3; //jack in teh signed urls into the object array
//                     audio_items[i].URLogg = urlOgg;
//                     audio_items[i].URLpng = urlPng;
//                     if (audio_items[i].tags != null) {
//                         if (audio_items[i].tags.length < 1) {
//                             audio_items[i].tags = [""];
//                         } else {
//                             audio_items[i].tags = [""];
//                         }
//                     }
//                 }
//                 //   console.log('tryna send ' + audio_items);
//                 audioResponse = audio_items;
//                 sceneResponse.audio = audioResponse;
// //                        console.log("audio", audioResponse);
//                 callback(null, audio_items);
//             },

//             function(audioStuff, callback) { //return the pic items
//                 console.log("requestedPictureItems:  ", requestedPictureItems);
//                 db.image_items.find({_id: {$in: requestedPictureItems }}, function (err, pic_items)
//                 {
//                     if (err || !pic_items) {
//                         console.log("error getting picture items: " + err);
//                         callback(null);
//                     } else {
//                         callback(null, pic_items)
//                     }
//                 });
//             },
//             function (picture_items, callback) {
//                 for (var i = 0; i < picture_items.length; i++) {
//                     //    console.log("picture_item: ", picture_items[i]);
//                     var item_string_filename = JSON.stringify(picture_items[i].filename);
//                     item_string_filename = item_string_filename.replace(/\"/g, "");
//                     var item_string_filename_ext = getExtension(item_string_filename);
//                     var expiration = new Date();
//                     expiration.setMinutes(expiration.getMinutes() + 1000);
//                     var baseName = path.basename(item_string_filename, (item_string_filename_ext));
//                     //console.log(baseName);
//                     var thumbName = 'thumb.' + baseName + item_string_filename_ext;
//                     var quarterName = 'quarter.' + baseName + item_string_filename_ext;
//                     var halfName = 'half.' + baseName + item_string_filename_ext;
//                     var standardName = 'standard.' + baseName + item_string_filename_ext;
//                     var originalName = 'original.' + baseName  + item_string_filename_ext;

//                     var urlThumb = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_items[i].userID + "/pictures/" + picture_items[i]._id + "." + thumbName, Expires: 6000}); //just send back thumbnail urls for list
//                     var urlQuarter = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_items[i].userID + "/pictures/" + picture_items[i]._id + "." + quarterName, Expires: 6000});
//                     var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_items[i].userID + "/pictures/" + picture_items[i]._id + "." + halfName, Expires: 6000});
//                     var urlStandard = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_items[i].userID + "/pictures/" + picture_items[i]._id + "." + standardName, Expires: 6000});
//                     //var urlPng = knoxClient.signedUrl(audio_item[0]._id + "." + pngName, expiration);
//                     picture_items[i].urlThumb = urlThumb; //jack in teh signed urls into the object array
//                     picture_items[i].urlQuarter = urlQuarter; //jack in teh signed urls into the object array
//                     picture_items[i].urlHalf = urlHalf; //jack in teh signed urls into the object array
//                     picture_items[i].urlStandard = urlStandard; //jack in teh signed urls into the object array
//                     if (picture_items[i].orientation == "equirectangular") { //add the big one for skyboxes
//                         var urlOriginal = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_items[i].userID + "/pictures/originals" +picture_items[i]._id + "." + originalName, Expires: 6000});
//                         picture_items[i].urlOriginal = urlOriginal;
                        
//                     }
//                     if (picture_items[i].hasAlphaChannel == null) {picture_items[i].hasAlphaChannel = false}
//                     //pathResponse.path.pictures.push(urlThumb, urlQuarter, urlHalf, urlStandard);
//                     if (picture_items[i].tags == null) {picture_items.tags = [""]}
//                 }
//                 pictureResponse = picture_items ;
//                 callback(null);
//             },

//             function (callback) {
//                 var postcards = [];
//                 if (sceneResponse.scenePostcards != null && sceneResponse.scenePostcards.length > 0) {
//                     async.each (sceneResponse.scenePostcards, function (postcardID, callbackz) { //nested async-ery!
//                         var oo_id = ObjectID(postcardID);
//                         db.image_items.findOne({"_id": oo_id}, function (err, picture_item) {
//                             if (err || !picture_item) {
//                                 console.log("error getting picture items: " + err);
// //                                        callback(err);
// //                                        callback(null);
//                                 callbackz();
//                             } else {
//                                 var urlThumb = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".thumb." + picture_item.filename, Expires: 6000});
//                                 var urlHalf = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".half." + picture_item.filename, Expires: 6000});
//                                 var urlStandard = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: "users/" + picture_item.userID + "/pictures/" + picture_item._id + ".standard." + picture_item.filename, Expires: 6000});

//                                 var postcard = {};
//                                 postcard.userID = picture_item.userID;
//                                 postcard._id = picture_item._id;
//                                 postcard.sceneID = picture_item.postcardForScene;
//                                 postcard.urlThumb = urlThumb;
//                                 postcard.urlHalf = urlHalf;
//                                 postcard.urlStandard = urlStandard;
//                                 if (postcards.length < 9)
//                                     postcards.push(postcard);
// //                                        console.log("pushing postcard: " + JSON.stringify(postcard));
//                                 callbackz();
//                             }

//                         });

//                     }, function(err) {
                       
//                         if (err) {
                            
//                             console.log('A file failed to process');
//                             callback(null, postcards);
//                         } else {
//                             console.log('All files have been processed successfully');
//                             callback(null, postcards);
// //                                        };
//                         }
//                     });
//                 } else {
// //                      callback(null);
//                     callback(null, postcards);
//                 }
//             },

//             function (postcardResponse, callback) {
//                 //assemble all response elements
//                 sceneResponse.audio = audioResponse;
//                 sceneResponse.pictures = pictureResponse;
//                 sceneResponse.postcards = postcardResponse;
//                 callback(null);
//             },

//             function (callback) {
//                 var modelz = [];
// //                console.log("sceneObjects : " + JSON.stringify(sceneResponse.sceneObjects));
//                 if (sceneResponse.sceneModels != null) {
//                     async.each (sceneResponse.sceneModels, function (objID, callbackz) { //nested async-ery!
//                         var oo_id = ObjectID(objID);
//                         console.log("14312 tryna get sceneObject: " + objID);
//                         db.models.findOne({"_id": oo_id}, function (err, model) {
//                             if (err || !model) {
//                                 console.log("error getting model: " + err);
//                             } else {
//                                 // console.log("got user models:" + JSON.stringify(models));
//                                 let url = s3.getSignedUrl('getObject', {Bucket: 'servicemedia', Key: 'users/' + model.userID + "/gltf/" + model.filename, Expires: 6000});
//                                 model.url = url;
//                                 modelz.push(model);
//                             }
//                         });
//                     }, function(err) {
                       
//                         if (err) {
                            
//                             console.log('A file failed to process');
//                             callback(null);
//                         } else {
//                             console.log('modelz have been added to scene.modelz');
//                             objectResponse = modelz;
//                             sceneResponse.sceneModelz = objectResponse;
//                             callback(null);
//                         }
//                     });
//                 } else {
//                     callback(null);
//                 }
//             },

//             function (callback) {

//                 var objex = [];
//                 if (sceneResponse.sceneObjects != null) {
//                     async.each (sceneResponse.sceneObjects, function (objID, callbackz) { //nested async-ery!
//                         var oo_id = ObjectID(objID);
//                         console.log("14347 tryna get sceneObject: " + objID);
//                         db.obj_items.findOne({"_id": oo_id}, function (err, obj_item) {
//                             if (err || !obj_item) {
//                                 console.log("error getting obj items: " + err);
//                                 callbackz();
//                             } else {
//                                 //
//                                // console.log("tryna find childObjectIDs: " + JSON.stringify(obj_item.childObjectIDs));
//                                 obj_item.objectGroup = "none";
//                                 if (obj_item.childObjectIDs != null && obj_item.childObjectIDs.length > 0) {
//                                     var childIDs = obj_item.childObjectIDs.map(convertStringToObjectID); //convert child IDs array to objIDs
//                                     db.obj_items.find({_id : {$in : childIDs}}, function(err, obj_items) {
//                                         if (err || !obj_items) {
//                                             console.log("error getting childObject items: " + err);
//                                             //res.send("error getting child objects");
//                                             obj_item.objectGroup = "none";
//                                             obj_item.snapToGround = obj_item.snapToGround != null ? obj_item.snapToGround : "false"; //new obj properties, not found in existing obj records...
//                                             obj_item.randomRotation = obj_item.randomRotation != null ? obj_item.randomRotation : "false";
//                                             objex.push(obj_item)
//                                             callbackz();
//                                         } else {
//                                             childObjects = obj_items;
//                                             console.log("childObjects: " + JSON.stringify(childObjects));
//                                             obj_item.childObjects = childObjects;
//                                             obj_item.objectGroup = "none";
//                                             obj_item.snapToGround = obj_item.snapToGround != null ? obj_item.snapToGround : "false"; //new obj properties, not found in existing obj records...
//                                             obj_item.randomRotation = obj_item.randomRotation != null ? obj_item.randomRotation : "false";
//                                             objex.push(obj_item)
//                                             callbackz();
//                                         }
//                                     });
//                                 } else {
//                                     obj_item.objectGroup = "none";
//                                     obj_item.snapToGround = obj_item.snapToGround != null ? obj_item.snapToGround : "false"; //new obj properties, not found in existing obj records...
//                                     obj_item.randomRotation = obj_item.randomRotation != null ? obj_item.randomRotation : "false";
//                                     objex.push(obj_item)
//                                     callbackz();
//                                 }
//                                 //

//                             }
//                         });
//                     }, function(err) {
                       
//                         if (err) {
                            
//                             console.log('A file failed to process');
//                             callback(null, objex);
//                         } else {
//                             console.log('objects have been added to scene.objex');
//                             objectResponse = objex;
//                             sceneResponse.sceneObjex = objectResponse;
//                             callback(null, objex);
//                         }
//                     });
//                 } else {
//                     callback(null, objex);
//                 }
//             },
//             function (objex, callback) { //inject username, last step (since only id is in scene doc)

//                 if ((sceneResponse.userName == null || sceneResponse.userName.length < 1) && (sceneResponse.user_id != null)) {

//                     var oo_id = ObjectID(sceneResponse.user_id);
//                     db.users.findOne({_id: oo_id}, function (err, user) {
//                         if (!err || user != null) {
//                             console.log("tryna inject usrname: " + user.userName);
//                             sceneResponse.userName = user.userName;
//                             callback(null);
//                         }
//                     });

//                 } else  {
//                     callback(null);
//                 }
//             }

//         ], //waterfall end

//         function (err, result) { // #last function, close async
//             res.json(sceneResponse);
//             console.log("waterfall done: " + result);
//         }
//     );
// });

app.post('/delete_path', checkAppID, requiredAuthentication, function (req, res) {
    console.log("tryna delete key: " + req.body._id);
    var o_id = ObjectID(req.body._id);
    db.paths.remove( { "_id" : o_id }, 1 );
    res.send("deleted");

});


app.post('/newobj', requiredAuthentication, function (req, res) {

    var newobj = req.body;
    newobj.userID = req.session.user._id.toString();
    newobj.userName = req.session.user.userName;
    let timestamp = Math.round(Date.now() / 1000);
    newobj.createdTimestamp = timestamp;
    db.obj_items.save(newobj, function (err, saved) {
        if ( err || !saved ) {
            console.log('object not saved..');
            res.send("nilch");
        } else {
            var item_id = saved._id.toString();
            console.log('new object created, id: ' + item_id);
            res.send("created: " + item_id);
        }
    });
});

app.post('/delete_obj/', requiredAuthentication, function (req, res) { //weird, post + path
    console.log("tryna delete obj: " + req.body._id);
    var o_id = ObjectID(req.body._id);
    db.obj_items.remove( { "_id" : o_id }, 1 );
    res.send("deleted");
});


app.post('/update_pic/:_id', requiredAuthentication, function (req, res) {
    console.log(req.params._id);

    var o_id = ObjectID(req.params._id);   
    console.log('pic requested : ' + req.body._id);
    db.image_items.findOne({ "_id" : o_id}, function(err, pic_item) {
        if (err || !pic_item) {
            console.log("error getting pic items: " + err);
        } else {
            if (req.session.user._id != pic_item.userID && !req.session.user.authLevel.toLowerCase().includes("admin")) {
                console.log("must be owner to update!");
                res.send ("You don't have permission to update this");
            } else {
                console.log("tryna update " + req.body._id + " to status " + req.body.item_status);
                let timestamp = Math.round(Date.now() / 1000);
                let isPublic = false;
                if (req.body.isPublic != null) {
                    isPublic = req.body.isPublic;
                }
                db.image_items.update( { _id: o_id }, { $set: { item_status: req.body.item_status,
                    tags: req.body.tags,
                    title: req.body.title,
                    isPublic : isPublic,
                    useTarget : req.body.useTarget,
                    orientation: req.body.orientation,
                    hasAlphaChannel: req.body.hasAlphaChannel,
                    imageData: req.body.imageData,
                    captionUpper: req.body.captionUpper,
                    captionLower: req.body.captionLower,
                    mods: req.body.mods,
                    license: req.body.license,
                    description: req.body.description,
                    linkType: req.body.linkType,
                    linkURL: req.body.linkURL,
                    sourceText: req.body.sourceText,
                    sourceTitle: req.body.sourceTitle,
                    sourceLink: req.body.sourceLink,
                    authorName: req.body.authorName,
                    authorLink: req.body.authorLink,
                    nft: req.body.nft,
                    lastUpdateTimestamp: timestamp,
                    lastUpdateUserID: req.session.user._id,
                    lastUpdateUserName: req.session.user.userName,

                }});
                if (err) {
                    res.send(error);
                } else {
                    res.send("updated " + new Date());
                }
            }
        }
    });
});

app.post('/update_video/:_id', requiredAuthentication, function (req, res) {
    console.log(req.params._id);    

    var o_id = ObjectID(req.params._id);   
    console.log('video requested : ' + req.body._id);
    db.video_items.findOne({ "_id" : o_id}, function(err, video_item) {
        if (err || !video_item) {
            console.log("error getting pic items: " + err);
        } else {
            console.log("tryna update " + req.body._id + " to status " + req.body.item_status);
            let timestamp = Math.round(Date.now() / 1000);
            let isPublic = false;
            if (req.body.isPublic != null) {
                isPublic = req.body.isPublic;
            }
            db.video_items.update( { _id: o_id }, { $set: { item_status: req.body.item_status,
                tags: req.body.tags,
                timekeys: req.body.timekeys,
                title: req.body.title,
                isPublic : isPublic,
                orientation: req.body.orientation,
                // hasAlphaChannel: req.body.hasAlphaChannel,
                // captionUpper: req.body.captionUpper,
                // captionLower: req.body.captionLower,
                hasAlphaChannel: req.body.hasAlphaChannel,
                captionUpper: req.body.captionUpper,
                captionLower: req.body.captionLower,
                mods: req.body.mods,
                license: req.body.license,
                description: req.body.description,
                linkType: req.body.linkType,
                linkURL: req.body.linkURL,
                sourceText: req.body.sourceText,
                sourceTitle: req.body.sourceTitle,
                sourceLink: req.body.sourceLink,
                authorName: req.body.authorName,
                authorLink: req.body.authorLink,
                nft: req.body.nft,
                lastUpdateTimestamp: timestamp,
                lastUpdateUserID: req.session.user._id,
                lastUpdateUserName: req.session.user.name,

            }});
        } if (err) {res.send(error)} else {res.send("updated " + new Date())}
    });
});

app.post('/update_model/:_id', requiredAuthentication, function (req, res) {
    console.log(req.params._id);    

    var o_id = ObjectID(req.params._id);   
    console.log('model requested : ' + req.body._id);
    db.models.findOne({ "_id" : o_id}, function(err, model) {
        if (err || !model) {
            console.log("error getting pic items: " + err);
        } else {
            console.log(req.session.user._id + "vs" + model.userID);

            if (req.session.user._id != model.userID) {
                console.log("must be owner to update!");
                res.send ("You don't have permission to update this");
            } else {
                let timestamp = Math.round(Date.now() / 1000);
                let isPublic = false;
                if (req.body.isPublic != null) {
                    isPublic = req.body.isPublic;
                }
                db.models.update( { _id: o_id }, { $set: { item_status: req.body.item_status,
                tags: req.body.tags,
                name: req.body.name,
                isPublic : isPublic,
                sourceTitle: req.body.sourceTitle,
                sourceLink: req.body.sourceLink,
                sourceText: req.body.sourceText.replace(/"/g, "'"),
                authorName: req.body.authorName,
                authorLink: req.body.authorLink,
                license: req.body.license,
                modifications: req.body.modifications,
                lastUpdateTimestamp: timestamp,
                lastUpdateUserID: req.session.user._id,
                lastUpdateUserName: req.session.user.userName,
                }});
                if (err) {
                    res.send(error);
                } else {
                    res.send("updated " + new Date());
                }
            } 
        }
    });
});

app.post('/update_obj/:_id', requiredAuthentication, function (req, res) {
    console.log(req.params._id);
    var o_id = ObjectID(req.params._id);   
    console.log('tryna update obj : ' + req.params._id);
    let timestamp = Math.round(Date.now() / 1000);
    db.obj_items.find({ "_id" : o_id}, function(err, obj_item) {
        if (err || !obj_item) {
            console.log("error getting obj items: " + err);
            res.send(err);
        } else {
            if (obj_item.userID != req.session.user._id.toString() && !req.session.user.authLevel.toLowerCase().includes("admin")) {
                res.send("user does not match " + req.session.user.authLevel);
            } else {
                db.obj_items.update( { _id: o_id }, { $set: { 
                    // item_status: req.body.item_status,
                    actionIDs: (req.body.actionIDs != "" && req.body.actionIDs != undefined && req.body.actionIDs != null) ? req.body.actionIDs : [],
                    name: req.body.name,
                    description: req.body.description,
                    objtype: req.body.objtype,
                    objcat: req.body.objcat,
                    objsubcat: req.body.objsubcat,
                    objclass: req.body.objclass,
                    level: req.body.level,
                    xpoints: req.body.xpoints,
                    mana: req.body.mana,
                    hitpoints: req.body.hitpoints,
                    armorclass: req.body.armorclass,
                    age: req.body.age,
                    species: req.body.species,
                    alignment: req.body.alignment,
                    personality: req.body.personality,
                    strength: req.body.strength,
                    dexterity: req.body.dexterity,
                    constitution: req.body.constitution,
                    intelligence: req.body.intelligence,
                    wisdom: req.body.wisdom,
                    charisma: req.body.charisma,
                    integrity: req.body.integrity,
                    quality: req.body.quality,
                    rarity: req.body.rarity,
                    distribution: req.body.distribution,
                    purity: req.body.purity,
                    scale: req.body.scale,
                    weight: req.body.weight,
                    property: req.body.property,
                    attribute: req.body.attribute,
                    operator: req.body.operator,
                    affect: req.body.affect,
                    effectiveness: req.body.effectiveness,
                    physics: req.body.physics,
                    interaction: req.body.interaction,
                    eventtype: req.body.eventtype,
                    eventdata: req.body.eventdata,
                    collidertype: req.body.collidertype,
                    highlight: req.body.highlight,
                    labeltext: req.body.labeltext,
                    callouttext: req.body.callouttext,
                    prompttext: req.body.prompttext,
                    tags: req.body.tags,
                    title: req.body.title,

                    // price: req.body.price != null ? req.body.price : 0,
                    intval: req.body.intval != null ? req.body.intval : 0,
                    floatval: req.body.floatval != null ? req.body.floatval : 0,
                    stringval: req.body.stringval != null ? req.body.stringval : "",
                    assetname: req.body.assetname,
                    assettype: req.body.assettype,
                    audioEmit: req.body.audioEmit != null ? req.body.audioEmit : false,
                    audioScale: req.body.audioScale != null ? req.body.audioScale : false,
                    randomColor: req.body.randomColor != null ? req.body.randomColor : false,
                    namedColor: req.body.namedColor,
                    highlightColor: req.body.highlightColor,
                    color1: req.body.color1,
                    color2: req.body.color2,
                    snapToGround: req.body.snapToGround  != null ? req.body.snapToGround : false,
                    randomRotation: req.body.randomRotation != null ? req.body.randomRotation : false,
    //                objectScale: req.body.objectScale ? req.body.objectScale : 0,
                    xoffset: req.body.xoffset != null ? req.body.xoffset : "0",
                    yoffset: req.body.yoffset != null ? req.body.yoffset : "0",
                    zoffset: req.body.zoffset != null ? req.body.zoffset : "0",
                    rotationAxis: req.body.rotationAxis != null ? req.body.rotationAxis : 0,
                    rotationSpeed: req.body.rotationSpeed != null ? req.body.rotationSpeed : 0,
                    objScale: req.body.objScale != null ? req.body.objScale : 1,
                    maxPerScene: req.body.maxPerScene != null ? req.body.maxPerScene : 10,
                    maxPerUser: req.body.maxPerUser != null ? req.body.maxPerUser : 1,
                    maxTotal: req.body.maxTotal != null ? req.body.maxTotal : 1,
                    speedFactor: req.body.speedFactor != null ? req.body.speedFactor : 3,
                    colliderScale: req.body.colliderScale != null ? req.body.colliderScale : 1,
                    triggerScale: req.body.triggerScale != null ? req.body.triggerScale : 1,
                    yPosFudge: req.body.yPosFudge != null ? req.body.yPosFudge : 0,
                    yRotFudge: req.body.yRotFudge != null ? req.body.yRotFudge : 0,
                    eulerx: req.body.eulerx != null ? req.body.eulerx : 0,
                    eulery: req.body.eulery != null ? req.body.eulery : 0,
                    eulerz: req.body.eulerz != null ? req.body.eulerz : 0,
                    
                    scatter: req.body.scatter != null ? req.body.scatter : false,
                    showcallout: req.body.showcallout != null ? req.body.showcallout : false,
                    // buyable: req.body.buyable != null ? req.body.buyable : false,
                    userspawnable: req.body.userspawnable != null ? req.body.userspawnable : false,
                    textitemID: req.body.textitemID != null ? req.body.textitemID : "",
                    pictureitemID: req.body.pictureitemID  != null ? req.body.pictureitemID : "",
                    audioitemID: req.body.audioitemID != null ? req.body.audioitemID : "",
                    textgroupID: req.body.textgroupID != null ? req.body.textgroupID : "",
                    picturegroupID: req.body.picturegroupID != null ? req.body.picturegroupID : "",
                    audiogroupID: req.body.audiogroupID != null ? req.body.audiogroupID : "",
                    synthPatch1: req.body.synthPatch1 != null ? req.body.synthPatch1 : "",
                    tonejsPatch1: req.body.tonejsPatch1 != null ? req.body.tonejsPatch1 : "",
                    synthNotes: req.body.synthNotes != null ? req.body.synthNotes : "",
                    synthDuration: req.body.synthDuration != null ? req.body.synthDuration : "",
                    particles: req.body.particles != null ? req.body.particles : "",
                    light: req.body.light != null ? req.body.light : "",
                    lastUpdateTimestamp: timestamp,
                    lastUpdateUserID: req.session.user._id,
                    lastUpdateUserName: req.session.user.name
                    // childObjectIDs: req.body.childObjectIDs
                    }});
                    res.send("updated " + new Date());
                }
                // } if (err) {
                //     res.send(err);
                // } else {
                //     res.send("updated " + new Date());
                // }
            }
        // }
        // } if (err) {
        //     res.send(err);
        // } else {
        //     res.send("updated " + new Date());
        // }
    });

});

app.post('/update_audio/:_id', requiredAuthentication, function (req, res) {
    console.log(req.params._id);
    var o_id = ObjectID(req.params._id);   
    console.log('audioID requested : ' + req.body);
    db.audio_items.find({ "_id" : o_id}, function(err, audio_item) {
        if (err || !audio_item) {
            console.log("error getting audio items: " + err);
        } else {
            //console.log("tryna update " + req.body._id + " to status " + req.body.item_status);
            let timestamp = Math.round(Date.now() / 1000);
            let isPublic = false;
            if (req.body.isPublic != null) {
                isPublic = req.body.isPublic;
            }
            if (req.body.clipDuration != null && req.body.clipDuration != undefined)
            req.body.clipDuration = req.body.clipDuration.toString();
            db.audio_items.update( { _id: o_id }, { $set: { 
                // item_status : req.body.item_status != null ? req.body.item_status : "",
                tags: req.body.tags,
                timekeys : req.body.timekeys,
                samplekeys : req.body.samplekeys,
                user_groups: req.body.user_groups,
                title: req.body.title,
                isPublic : isPublic,
                alt_title: req.body.alt_title,
                alt_artist: req.body.alt_artist,
                alt_source: req.body.alt_album,
                modVol: req.body.modVol,
                sourceText: req.body.sourceText != undefined ? req.body.sourceText : "",
                clipDuration : req.body.clipDuration != null ? req.body.clipDuration : "",
                textitemID : req.body.textitemID != null ? req.body.textitemID : "",
                textgroupID : req.body.textgroupitemID != null ? req.body.textgroupitemID : "",
                pictureitemID : req.body.pictureitemID != null ? req.body.pictureitemID : "",
                picturegroupID : req.body.picturegroupID != null ? req.body.picturegroupID : "",
                lastUpdateTimestamp: timestamp,
                lastUpdateUserID: req.session.user._id,
                lastUpdateUserName: req.session.user.userName
            }});
        } if (err) {res.send(error)} else {res.send("updated " + new Date())}
    });
});

app.get('/audioitems/:tag', checkAppID, requiredAuthentication, function(req, res) {
    console.log('tryna return playlist: ' + req.params.tag);
    db.audio.find({tags: req.params.tag, item_status: "public"}).sort({otimestamp: -1}).limit(maxItems).toArray( function(err, audio_items) {
        if (err || !audio_items) {
            console.log("error getting audio items: " + err);

        } else {

            async.waterfall([

                    function(callback){ //randomize the returned array, takes a shake so async it...
                        //audio_items = Shuffle(audio_items);
                        //audio_items.splice(0,audio_items.length - maxItems); //truncate randomized array, take only last 20
                        callback(null);
                    },

                    function(callback) { //add the signed URLs to the obj array
                        for (var i = 0; i < audio_items.length; i++) {

                            var item_string_filename = JSON.stringify(audio_items[i].filename);
                            item_string_filename = item_string_filename.replace(/\"/g, "");
                            var item_string_filename_ext = getExtension(item_string_filename);
                            var expiration = new Date();
                            expiration.setMinutes(expiration.getMinutes() + 1000);
                            var baseName = path.basename(item_string_filename, (item_string_filename_ext));
                            console.log(baseName);
                            var mp3Name = baseName + '.mp3';
                            var oggName = baseName + '.ogg';
                            var pngName = baseName + '.png';
                            var urlMp3 = knoxClient.signedUrl(audio_items[i]._id + "." + mp3Name, expiration);
                            var urlOgg = knoxClient.signedUrl(audio_items[i]._id + "." + oggName, expiration);
                            var urlPng = knoxClient.signedUrl(audio_items[i]._id + "." + pngName, expiration);
                            audio_items[i].URLmp3 = urlMp3; //jack in teh signed urls into the object array
                            audio_items[i].URLogg = urlOgg;
                            audio_items[i].URLpng = urlPng;

                        }
                        console.log('tryna send ' + audio_items.length + 'audio_items ');
                        callback(null);
                    }],

                function(err, result) { // #last function, close async
                    res.json(audio_items);
                    console.log("waterfall done: " + result);
                }
            );
        }
    });

});


app.post('/delete_audio/', requiredAuthentication, function (req, res){

    console.log('tryna delete audioID : ' + req.body._id);
    var audio_id = req.body._id;
    var o_id = ObjectID(audio_id);   

    db.audio_items.find({ "_id" : o_id}, function(err, audio_item) {
        if (err || !audio_item) {
            console.log("error getting picture item: " + err);
        } else {
            var item_string_filename = audio_item[0].filename;
            item_string_filename = item_string_filename.replace(/\"/g, "");
            var item_string_filename_ext = getExtension(item_string_filename);
            var baseName = path.basename(item_string_filename, (item_string_filename_ext));
            console.log(baseName);
            var pngName = baseName + ".png";
            var mp3Name = baseName + ".mp3";
            var oggName = baseName + ".ogg";

            (async () => {

                if (minioClient) {
                    var keys = []
                    keys.push(
                        "users/" + req.session.user._id.toString() + "/" + item_string_filename,
                        "users/" + req.session.user._id.toString() + "/" + audio_item[0]._id + "." + pngName,
                        "users/" + req.session.user._id.toString() + "/" + audio_item[0]._id + "." + mp3Name,
                        "users/" + req.session.user._id.toString() + "/" + audio_item[0]._id + "." + oggName,

                        );
                    minioClient.removeObjects(process.env.S3_ROOT_BUCKET_NAME, keys, function(e) {
                        if (e) {
                            console.log('Unable to remove Objects ',e);
                            res.send('Unable to remove Objects ',e);
                        } else {
                            console.log('Removed the objects successfully');
                            db.audio_items.remove( { "_id" : o_id }, 1 );  // TODO what if files are gone but db reference remains? 
                            res.send("deleted");
                        }
    
                    });
                } else {
                    var params = {
                        Bucket: 'servicemedia', // required
                        Delete: { // required
                            Objects: [ // required
                                {
                                    Key: "users/" + req.session.user._id.toString() + "/" + item_string_filename // required
                                },
                                {
                                    Key: "users/" + req.session.user._id.toString() + "/" + audio_item[0]._id + "." + pngName // required
                                },
                                {
                                    Key: "users/" + req.session.user._id.toString() + "/" + audio_item[0]._id + "." + mp3Name // required
                                },
                                {
                                    Key: "users/" + req.session.user._id.toString() + "/" + audio_item[0]._id + "." + oggName // required
                                }
                                // ... more items ...
                            ],
                            Quiet: true || false
                        }
                        //MFA: 'STRING_VALUE',
                    };

                    s3.deleteObjects(params, function(err, data) {
                        if (err) {
                            console.log(err, err.stack);
                            res.send(err);
                            // an error occurred
                        }
                        else {
                            console.log(data);
                            db.audio_items.remove( { "_id" : o_id }, 1 );
                            res.send("deleted");
                            // successful response
                        }
                    });
                }
            })();
        
        }
    });
});
app.post('/delete_model/', requiredAuthentication, function (req, res){
    console.log("tryna delete model: " + req.body);

    var pic_id = req.body._id;
    var o_id = ObjectID(pic_id);   

    db.models.findOne({ "_id" : o_id}, function(err, model) {
        if (err || !model) {
            console.log("error getting picture item: " + err);
        } else {
            var item_string_filename = model.filename;
            // item_string_filename = item_string_filename.replace(/\"/g, "");

            var params = {
                Bucket: 'servicemedia', // required
                Delete: { // required
                    Objects: [ // required
                        {
                            Key:  "users/" + req.session.user._id.toString() + "/gltf/" + item_string_filename // required
                        }
                    ],
                    Quiet: true || false,
                }
            };

            s3.deleteObjects(params, function(err, data) {
                if (err) {
                    console.log(err, err.stack);
                    res.send(err);
                    // an error occurred
                }
                else {
                    db.models.remove( { "_id" : o_id }, 1 );
                    res.send("delback");
                }
            });

        }
    });
});
app.post('/delete_video/', requiredAuthentication, function (req, res){
    // console.log(req.body);

    console.log('tryna delete videoID : ' + req.body._id);
    var pic_id = req.body._id;
    var o_id = ObjectID(pic_id);   

    db.video_items.findOne({ "_id" : o_id}, function(err, vid_item) {
        if (err || !vid_item) {
            console.log("error getting picture item: " + err);
        } else {
            var item_string_filename = vid_item.filename;
            item_string_filename = item_string_filename.replace(/\"/g, "");
            var item_string_filename_ext = getExtension(item_string_filename);
            var baseName = path.basename(item_string_filename, (item_string_filename_ext));
            console.log(baseName);

            var delete_params = {
                Bucket: process.env.S3_ROOT_BUCKET_NAME, // required
                Delete: { // required
                    Objects: [ // required
                        {
                            Key:  "users/" + req.session.user._id.toString() + "/video/"+ item_string_filename // required
                        }
                    ],
                    Quiet: true || false,
                }
                //MFA: 'STRING_VALUE',
            };

            var listparams = {
                Bucket: process.env.S3_ROOT_BUCKET_NAME,
                Prefix: 'users/'+ vid_item.userID + '/video/'+ vid_item._id +'/'
            }
            s3.listObjects(listparams, function(err, data) {
                if (err) {
                    console.log(err);
                    
                }
                if (data.Contents.length == 0) {
                    console.log("no content found");
                  
                } else {
                    response = data.Contents;
                    data.Contents.forEach(function(content) {
                        console.log("deleting vid thing " + content.Key);
                        delete_params.Delete.Objects.push({Key: content.Key}); //add the hls files
                        
                    });
                    console.log(JSON.stringify(delete_params));
                    s3.deleteObjects(delete_params, function(err, data) {
                        if (err) {
                            console.log(err, err.stack);
                            res.send(err);
                            // an error occurred
                        }
                        else {
                            db.video_items.remove( { "_id" : o_id }, 1 );
                            console.log("some video things were deleted");
                            res.send("deleted");
                        }
                    });
                    
                }
            });

            // s3.deleteObjects(params, function(err, data) {
            //     if (err) {
            //         console.log(err, err.stack);
            //         res.send(err);
            //         // an error occurred
            //     }
            //     else {
            //         db.video_items.remove( { "_id" : o_id }, 1 );
            //         res.send("deleted");
            //     }
            // });
            // s3.headObject({bucket: process.env.S3_ROOT_BUCKET_NAME, key})

        }
    });
});
// app.post('/delete_picture/', checkAppID, requiredAuthentication, function (req, res){
app.post('/delete_picture/', requiredAuthentication, function (req, res){ //TODO check user? or acl? another auth key?
    // console.log(req.body);

    console.log('tryna delete pictureID : ' + req.body._id);
    var pic_id = req.body._id;
    var o_id = ObjectID(pic_id);   

    db.image_items.find({ "_id" : o_id}, function(err, pic_item) {
        if (err || !pic_item) {
            console.log("error getting picture item: " + err);
        } else {
            var item_string_filename = pic_item[0].filename;
            item_string_filename = item_string_filename.replace(/\"/g, "");
            var item_string_filename_ext = getExtension(item_string_filename);
            var baseName = path.basename(item_string_filename, (item_string_filename_ext));
            console.log(baseName);
            var thumbName = 'thumb.' + baseName + item_string_filename_ext;
            var halfName = 'half.' + baseName + item_string_filename_ext;
            var quarterName = 'quarter.' + baseName + item_string_filename_ext;
            var standardName = 'standard.' + baseName + item_string_filename_ext;

            if (minioClient) {
                var keys = []
                keys.push(
                    "users/" + pic_item[0].userID + "/" + item_string_filename,
                    "users/" + pic_item[0].userID + "/" + pic_item[0]._id + ".original." + item_string_filename,
                    "users/" + pic_item[0].userID + "/" + pic_item[0]._id + "." + thumbName,
                    "users/" + pic_item[0].userID + "/" + pic_item[0]._id + "." + quarterName,
                    "users/" + pic_item[0].userID + "/" + pic_item[0]._id + "." + halfName,
                    "users/" + pic_item[0].userID + "/" + pic_item[0]._id + "." + standardName,
                    "users/" + pic_item[0].userID + "/pictures/" + item_string_filename,
                    "users/" + pic_item[0].userID + "/pictures/originals/" + pic_item[0]._id + ".original." + item_string_filename,
                    "users/" + pic_item[0].userID + "/pictures/" + pic_item[0]._id + "." + thumbName,
                    "users/" + pic_item[0].userID + "/pictures/" + pic_item[0]._id + "." + quarterName,
                    "users/" + pic_item[0].userID + "/pictures/" + pic_item[0]._id + "." + halfName,
                    "users/" + pic_item[0].userID + "/pictures/" + pic_item[0]._id + "." + standardName
                    );
                minioClient.removeObjects(process.env.S3_ROOT_BUCKET_NAME, keys, function(e) {
                    if (e) {
                        console.log('Unable to remove Objects ',e);
                        res.send('Unable to remove Objects ',e);
                    } else {
                        console.log('Removed the objects successfully');
                        db.image_items.remove( { "_id" : o_id }, 1 );  // TODO what if files are gone but db reference remains? 
                        res.send("deleted");
                    }

                });
                        
            } else {
                
                // s3.headObject
                var params = {
                    Bucket: 'servicemedia',// required
                    Delete: { // required
                        Objects: [ // required
                            {
                                Key: "users/" + pic_item[0].userID + "/" + item_string_filename 
                            },
                            {
                                Key: "users/" + pic_item[0].userID + "/" + pic_item[0]._id + ".original." + item_string_filename 
                            },
                            {
                                Key: "users/" + pic_item[0].userID + "/" + pic_item[0]._id + "." + thumbName 
                            },
                            {
                                Key: "users/" + pic_item[0].userID + "/" + pic_item[0]._id + "." + quarterName 
                            },
                            {
                                Key: "users/" + pic_item[0].userID + "/" + pic_item[0]._id + "." + halfName 
                            },
                            {
                                Key: "users/" + pic_item[0].userID + "/" + pic_item[0]._id + "." + standardName 
                            },
                            {
                                Key: "users/" + pic_item[0].userID + "/pictures/" + item_string_filename 
                            },
                            {
                                Key: "users/" + pic_item[0].userID + "/pictures/originals/" + pic_item[0]._id + ".original." + item_string_filename 
                            },
                            {
                                Key: "users/" + pic_item[0].userID + "/pictures/" + pic_item[0]._id + "." + thumbName 
                            },
                            {
                                Key: "users/" + pic_item[0].userID + "/pictures/" + pic_item[0]._id + "." + quarterName 
                            },
                            {
                                Key: "users/" + pic_item[0].userID + "/pictures/" + pic_item[0]._id + "." + halfName 
                            },
                            {
                                Key: "users/" + pic_item[0].userID + "/pictures/" + pic_item[0]._id + "." + standardName 
                            }
                            // ... more items ...
                        ],
                        Quiet: true || false
                    }
                    //MFA: 'STRING_VALUE',
                };
                console.log("tryna delete picture with params " + JSON.stringify(params));
                s3.deleteObjects(params, function(err, data) {
                    if (err) {
                        console.log(err, err.stack);
                        res.send(err);
                    } else {
                        console.log("pics delete response " + JSON.stringify(data));
                        db.image_items.remove( { "_id" : o_id }, 1 );  // TODO what if files are gone but db reference remains? 
                        res.send("deleted");
                    }
                });
            }
        }
    });
});


/*
app.get('/tranzfer_util_number_one', function (req, res){
    async.waterfall([
            function(arg1, callback) { //#3 save data to mongo, get object ID

                var itemTitle = "";
                itemTitle = fname;

                db.audio_items.save(
                    {type : "uploadedUserAudio",
                        userID : req.session.user._id.toString(),
                        username : req.session.user.userName,
                        title : itemTitle,
                        artist : parsedTags.artist.toString(),
                        album :  parsedTags.album.toString(),
                        year :  parsedTags.year.toString(),
                        filename : fnameOriginal,
                        item_type : 'audio',
                        //alt_title : req.files.audio_upload.title,
                        //alt_artist : req.files.audio_upload.artist,
                        //alt_album : req.files.audio_upload.album,
                        tags: req.body.tags,
                        item_status: "private",
                        otimestamp : ts,
                        ofilesize : fsize},
                    function (err, saved) {
                        if ( err || !saved ) {
                            console.log('audio item not saved..');
                            callback (err);
                        } else {
                            var item_id = saved._id.toString();
                            console.log('new item id: ' + item_id);
//                res.send('new item id: ' + item_id);
                            callback(null,item_id);
                        }
                    }
                );
            },

            function(arg1, callback) { //#3 save data to mongo, get object ID

                var itemTitle = "";
                itemTitle = fname;

                db.audio_items.save(
                    {type : "uploadedUserAudio",
                        userID : req.session.user._id.toString(),
                        username : req.session.user.userName,
                        title : itemTitle,
                        artist : parsedTags.artist.toString(),
                        album :  parsedTags.album.toString(),
                        year :  parsedTags.year.toString(),
                        filename : fnameOriginal,
                        item_type : 'audio',
                        //alt_title : req.files.audio_upload.title,
                        //alt_artist : req.files.audio_upload.artist,
                        //alt_album : req.files.audio_upload.album,
                        tags: req.body.tags,
                        item_status: "private",
                        otimestamp : ts,
                        ofilesize : fsize},
                    function (err, saved) {
                        if ( err || !saved ) {
                            console.log('audio item not saved..');
                            callback (err);
                        } else {
                            var item_id = saved._id.toString();
                            console.log('new item id: ' + item_id);
//                res.send('new item id: ' + item_id);
                            callback(null,item_id);
                        }
                    }
                );
            }
        ], //end async flow

        function(err, result) { // #last function, close async
            console.log("waterfall done: " + result);
            //  res.redirect('/upload.html');
            res.end(result);
        });

});
*/

// app.post('/uploadaudio', upload.single('file'), checkAppID, requiredAuthentication, function (req, res) {
//     console.log("uploadaudio req.headers: " + JSON.stringify(req.headers));
//     /*
//      req.files.audio_upload.on('progress', function(bytesReceived, bytesExpected) {
//      console.log(((bytesReceived / bytesExpected)*100) + "% uploaded");
//      res.send(((bytesReceived / bytesExpected)*100) + "% uploaded");
//      });
//      req.files.audio_upload.on('end', function() {
//      console.log(req.files);
//      res.send("upload complete, now processing...");
//      });
//      */
// //    res.connection.setTimeout(0);
//     console.log("tryna upload... req.file = " + req.file );

//     var expires = new Date();
//     expires.setMinutes(expires.getMinutes() + 30);
//     var ts = Math.round(Date.now() / 1000);
// //            var fname = req.files.audio_upload.name;
//     var fname = req.file.originalname.toLowerCase();
// //            fname =  fname.replace(/[-\/\\^$*+?()|[\]{}]/g, "_");
//     var fname_ext = getExtension(fname);
//     fname = fname.substr(0, fname.lastIndexOf('.'));
//     fname = nameCleaner(fname);
//     fname = fname + fname_ext;
//     var fnameOriginal = fname;
//     var fsize = req.file.size;
//     console.log("filename: " + fname);
//     var fpath = req.file.path;
//     console.log("filepath: " + fpath);
// //            var fpath = req.files.audio_upload.path;
//     var fpath = req.file.path;
//     var parsedTags = {};
//     var isOgg = false;
//     //var item_id = "";

//     async.waterfall([ //flow control for functions below, do one at a time, and pass vars to next as needed

//             function(callback) { //check for proper extensions

//                 console.log("extension of " + fname + "is " + fname_ext);
//                 if (fname_ext === ".ogg" || fname_ext === ".mp3" || fname_ext === ".mp4" || fname_ext === ".aiff" || fname_ext === ".aif" || fname_ext === ".wav" ) {
//                     if (fname_ext === ".ogg") {
//                         isOgg = true; //hrm
//                     }
//                     callback(null);
//                 } else {
//                     callback(err);
//                     res.send("bad file");
//                 }
//             },

//             function(callback) { //#1 - parse ID3 tags if available //ugh never mind...
//                 if (fname_ext == ".mp334") {
//                     console.log("tryna parse id3 tags");
// //                    var parser = new mm(fs.createReadStream(fpath));
//                 var readableStream = fs.createReadStream(fpath);
//                 var parser = mm(readableStream, function (err, metadata) {
//                         if (err) {
//                             readableStream.close();
//                             callback(null, null);
//                             } else if (metadata != null && metadata != undefined) {
//                                 parsedTags = metadata;
//                                 readableStream.close();
//                                 console.log("mm parsing result: " + metadata);
//                                 callback(null, parsedTags);
//                             } else {
//                                 readableStream.close();
//                                 callback(null , null);
//                             }
//                     });
// //                var parser = new mm(req.file);
// //                    parser.on('metadata', function (result) {
// //                        parsedTags = result;
// //                        console.log("mm parsing result: " + result);
// //                        callback(null, parsedTags);
// //                    });
// //                    parser.on('error', function (err) {
// ////                    parsedTags = result;
// //                        console.log(err);
// //
// //                        callback(null, null);
// //                    });
//                 } else {
//                     callback(null, null);
//                 }
// //                    console.log(parsedTags);
//             },


//             function(pTags, callback){ //#2 assign fields and parsed tags
//                 if (pTags != null && pTags != undefined) {
//                     console.log("parsedTags = " + pTags.toString());
//                     //res.json(JSON.stringify(pTags.title.toString()));
//                     if (pTags.title != null) {
//                         fname = pTags.title;

//                     }
//                 } else {
//                     parsedTags = {};
//                     parsedTags.album = "";
//                     parsedTags.artist = "";
//                     parsedTags.year = "";
//                     pTags = parsedTags;

//                 }

//                 callback(null, pTags);
//             },

//             function(mmTags, callback) { //check that we gotsa bucket with this user's id

//                 // var bucketFolder = 'elnoise1/' + req.session.user._id.toString() + '/';

//                 var bucketFolder = 'servicemedia';
//                 console.log("butcketFOlder: " + bucketFolder);
//                 s3.headBucket({Bucket:bucketFolder, Delimiter: req.session.user._id.toString()},function(err,data){
//                     if(err){
// //                        s3.createBucket({Bucket:bucketFolder},function(err2,data){
// //                            if (err2){
// //                                console.log(err2);
// //                                callback(err2);
// //                            } else {
//                                 console.log("can't find bucket " + bucketFolder);
//                                 callback(null, bucketFolder);
// //                            }
// //                        });
//                     } else {
//                         console.log("Bucket exists and we have access");
//                         var params = {
//                             Bucket: bucketFolder,
//                             Delimiter: req.session.user._id.toString(),
//                             Key: fname
//                         }
//                         s3.headObject(params, function (err, metadata) {
//                             if (err && err.code === 'NotFound') {
//                                 // Handle no object on cloud here
//                                 callback(null, bucketFolder);
//                             } else {
//                                 fname = fname.substr(0, fname.lastIndexOf('.'));
//                                 fname = fname + Date.now() + fname_ext;
//                                 callback(null, bucketFolder);
//                             }
//                         });


//                     }
//                 });

//             },


//             function(theBucketFolder, callback) { //upload orig file to s3
//                 if (!isOgg) {
//                 //knoxClient.putFile(fpath, fname, function(err, rez) { //just use userid  here, audioID added at transloadit
//                 //console.log(fname + ' ' + knoxClient.putFile.progress);
//                 var stream = fs.createReadStream(fpath);
// //       var data = {Bucket: theBucketFolder, Key: fname, Body: stream};
//                 var params = {Bucket: theBucketFolder, Key: "users/" + req.session.user._id.toString() + "/" + fnameOriginal, Body: stream};

//                 console.log("orignal file to: " + JSON.stringify(params));

//                 s3.putObject(params, function(err, data) {
//                     if (err) {
//                         console.log("Error uploading data: ", err);
//                         stream.close();
//                         callback(err);

//                     } else {
//                         console.log("Successfully uploaded data to " + theBucketFolder);
// //              res.send('original file in s3');
//                         stream.close();
//                         callback(null, 'uploaded orig file');
//                     }
//                 });
//                 } else { //skip if it's already ogg
//                     callback(null, 'already ogg');
//                 }

//             },

//             function(arg1, callback) { //#3 save data to mongo, get object ID
                
//                 var itemTitle = "";
//                 itemTitle = fname;

//                 db.audio_items.save(
//                     {type : "uploadedUserAudio",
//                         userID : req.session.user._id.toString().toString(),
//                         username : req.session.user.userName,
//                         title : itemTitle,
//                         artist : parsedTags.artist.toString(),
//                         album :  parsedTags.album.toString(),
//                         filename : fnameOriginal,
//                         item_type : 'audio',
//                         //alt_title : req.files.audio_upload.title,
//                         //alt_artist : req.files.audio_upload.artist,
//                         //alt_album : req.files.audio_upload.album,
//                         tags: req.body.tags,
//                         item_status: "private",
//                         otimestamp : ts,
//                         ofilesize : fsize},
//                     function (err, saved) {
//                         if ( err || !saved ) {
//                             console.log('audio item not saved..');
//                             callback (err);
//                         } else {
//                             var item_id = saved._id.toString();
//                             console.log('new item id: ' + item_id);
// //                res.send('new item id: ' + item_id);
//                             callback(null,item_id);
//                         }
//                     }
//                 );
//             },

//             function(itemID, callback) {//get a URL of the original file now in s3, to send down the line
//                 if (!isOgg) {
//                 var bucketFolder = 'servicemedia';
//                 //var tempURL = knoxClient.signedUrl(fname, expires);
//                 var params = {Bucket: bucketFolder, Key: "users/" + req.session.user._id.toString() + "/" + fnameOriginal };

//                 s3.getSignedUrl('getObject', params, function (err, url) {
//                     if (err) {
//                         console.log(err);
//                         callback(err);
//                     } else {
//                         console.log("The URL is", url);
//                         callback(null, url, itemID);
//                     }
//                 });
//                 } else { //skip if it's already ogg
//                     callback(null, 'already ogg');
//                 }
//             },

//             function(tUrl, iID, callback) { //send to transloadit..
//                 console.log("transcodeAudioURL request: " + tUrl);
//                 var encodeAudioUrlParams = {
//                     steps: {
//                         ':orig': {
//                             robot: '/http/import',
//                             url : tUrl
//                         }
//                     },
//                     'template_id': '84da9df057e311e4bdecf5e543756029',
//                     'fields' : { audio_item_id : iID,
//                         user_id : req.session.user._id.toString()
//                     }
//                 };

//                 transloadClient.send(encodeAudioUrlParams, function(ok) {
//                     console.log('Success: ' + JSON.stringify(ok));
//                 }, function(err) {
//                     console.log('Error: ' + JSON.stringify(err));
//                     callback(err);
//                 });
//                 callback(null, iID);

//             },

//             function(itemID2, callback) {  //gen a short code and insert //nahh

//                 tempID = "";
//                 callback(null,tempID);
//             }
//         ], //end async flow

//         function(err, result) { // #last function, close async
//             console.log("waterfall done: " + result);
//             //  res.redirect('/upload.html');
//             res.end(result);
//         }
//     );
// }); //end app.post /upload


// app.post('/uploadpicture', checkAppID, requiredAuthentication, upload.single('file'), function (req, res) {

//     console.log("uploadpicture headers: " + JSON.stringify(req.headers));
//     console.log("req.file " + req.file);
// //    console.log("req.files " + req.files);
// //    console.log("req.body: " + req.body);

//     var returnString = "";
// //            var uName = req.body.username;
// //            var uPass = req.body.userpass;
//     var type = req.body.pictype;
//     var userID = req.body.userID;
//     var sceneID = req.body.sceneID;
//     var postcardForScene = req.body.postcardForScene;
//     var pictureForScene = req.body.pictureForScene;
//             var tags = req.body.tags;
//     var expires = new Date();
//     expires.setMinutes(expires.getMinutes() + 30);
//     console.log("uploadpicture req.body.userID " + req.body.userID );
//     var ts = Math.round(Date.now() / 1000);
// //    if (req.file.originalname == undefined) {
// //        var fname = req.filename.toLowerCase();
// //    }
//     var fname = req.file.originalname.toLowerCase();
//     fname = fname.replace(/[-\/\\^$*+?!()|[\]{}\s]/g, "_");
// //    var fsize = req.files.picture_upload.size;
//     var fsize = req.file.size;
//     console.log("filename: " + fname);
// //    var fpath = req.files.picture_upload.path;
//     var fpath = req.file.path;
//     var parsedTags = {};

//     //var item_id = "";

//     async.waterfall([ //flow control for functions below, do one at a time, and pass vars to next as needed

//             function(callback) { //check for proper extensions
//                 var fname_ext = getExtension(fname);
//                 console.log("extension of " + fname + "is " + fname_ext);
//                 if (fname_ext === ".jpeg" || fname_ext === ".jpg" || fname_ext === ".JPG" || fname_ext === ".png" || fname_ext === ".gif") {
//                     if (fname_ext === ".jpeg" || fname_ext === ".jpg" || fname_ext === ".JPG") {
//                         fname = fname.substr(0, fname.lastIndexOf(".")) + ".jpg";
//                         }
//                     callback(null);
//                 } else {
//                     callback(error);
//                     res.end("bad file");
//                 }
//             },

//             function(callback) { //check that we gotsa bucket for this user

//                 var bucketFolder = 'servicemedia';
//                 console.log(bucketFolder);
//                 s3.headBucket({Bucket:bucketFolder},function(err,data){
//                     if(err){
//                         console.log("bucket creation");
//                         callback(null, bucketFolder);
//                     } else {
//                         console.log("Bucket exists and we have access");
//                         callback(null, bucketFolder);
//                     }
//                 });
//             },

//             function(theBucketFolder, callback) { //upload orig file to s3

//                 var stream = fs.createReadStream(fpath);
//                 var keymod = "original_" + fname; // TODO prevent collisions!  maybe a short timestamp mod of original name
//                 var data = {Bucket: theBucketFolder, Key: "users/" + req.session.user._id.toString() + "/" + fname, Body: stream};
//                 console.log("orignal file to: " + data);
//                 s3.putObject(data, function(err, data) {
//                     if (err) {
//                         stream.close();
//                         console.log("Error uploading data: ", err);
//                         callback(err);
//                     } else {
//                         stream.close();
//                         console.log("Successfully uploaded data to " + theBucketFolder);
//                         callback(null, 'uploaded orig file');
//                     }
//                 });
//             },

//             function(arg1, callback) { //#3 save data to mongo, get object ID

//                 var itemTitle = "";

//                 db.image_items.save(
//                     {type : type,
//                         userID : req.session.user._id.toString(),
//                         username : req.session.user.userName,
//                         title : "",

//                         filename : fname,
//                         item_type : 'picture',
//                         //alt_title : req.files.audio_upload.title,
//                         //alt_artist : req.files.audio_upload.artist,
//                         //alt_album : req.files.audio_upload.album,
//                         tags: req.body.tags,
//                         item_status: "private",
//                         //        postcardForScene : req.body.postcardForScene,
//                         otimestamp : ts,
//                         ofilesize : fsize},
//                     function (err, saved) {
//                         if ( err || !saved ) {
//                             console.log('picture not saved..');
//                             callback (err);
//                         } else {
//                             var item_id = saved._id.toString();
//                             console.log('new item id: ' + item_id);
//                             callback(null,item_id);
//                         }
//                     }
//                 );
//             },

//             function (itemID, callback) { //if the post has postcard or pic scene data, update that scene (* using short code here, bad idea?) //TODO add equirect for skybox

//                 if (pictureForScene != null) {
//                     var shortID = pictureForScene;
//                     console.log("tryna update scene pic for " + shortID);
// //                db.scenes.update({short_id: shortID}, {$push: {scenePictures: itemID}} );
//                     db.scenes.findOne({short_id: shortID}, function (err, scene) {
//                         if (err || !scene) {
//                             console.log("error getting scene 5: " + err);
//                             callback(null, itemID);
//                         } else {
//                             var scenePics = [];
//                             if (scene.scenePictures != null) {
//                                 scenePics = scene.scenePictures;
//                             }
//                             console.log("XXX scenePics: " + scenePics);
//                             scenePics.push(itemID);
//                             db.scenes.update({ short_id: shortID }, { $set: {scenePictures: scenePics}
//                             });
//                             callback(null, itemID);
//                         }
//                     });

//                 } else if (postcardForScene != null) {
//                     var shortID = postcardForScene;
//                     db.scenes.findOne({short_id: shortID}, function (err, scene) {
//                         if (err || !scene) {
//                             console.log("error getting scene 5: " + err);
//                             callback(null, itemID);
//                         } else {
//                             var scenePostcards = [];
//                             if (scene.scenePostcards != null) {
//                                 scenePostcards = scene.scenePostcards;
//                             }
//                             console.log("XXX scenePostcards: " + scenePostcards);
//                             scenePostcards.push(itemID);
//                             db.scenes.update({ short_id: shortID }, { $set: {scenePostcards: scenePostcards}
//                             });
//                             callback(null, itemID);
//                         }
//                     });
//                     // callback(null, itemID);
//                 } else {
//                     callback(null, itemID);
//                 }
//             },


//             function(itemID, callback) {//get a URL of the original file now in s3, to send down the line
//                 var bucketFolder = 'servicemedia';
//                 //var tempURL = knoxClient.signedUrl(fname, expires);
//                 var keymodd = "original_" + fname;
//                 var params = {Bucket: bucketFolder, Key: "users/" + req.session.user._id.toString() + "/" + fname };

//                 s3.getSignedUrl('getObject', params, function (err, url) {
//                     if (err) {
//                         console.log(err);
//                         callback(err);
//                     } else {
//                         console.log("The URL is", url);
//                         callback(null, url, itemID);
//                     }
//                 });
//             },
//             function(tUrl, iID, callback) { //send to transloadit..
//                 console.log("transcodePictureURL request: " + tUrl);
//                 var encodePictureUrlParams = {
//                     steps: {
//                         ':orig': {
//                             robot: '/http/import',
//                             url : tUrl
//                         }
//                     },
//                     'template_id': 'f9e7db371a1a4fd29022cc959305a671',
//                     'fields' : { image_item_id : iID,
//                         user_id : req.session.user._id.toString()
//                     }
//                 };
//                 transloadClient.send(encodePictureUrlParams, function(ok) {
//                     console.log('transloadit Success: ' + encodePictureUrlParams);
//                 }, function(err) {
//                     console.log('transloadit Error: ' + JSON.stringify(err));
//                     callback(err);
//                 });
//                 callback(null, iID);

//             },
//             function(itemID2, callback) {  //gen a short code and insert //not for picss

//                 callback(null,itemID2);
//             }
//         ], //end async flow

//         function(err, result) { // #last function, close async
//             console.log("transcode waterfall done: " + result);
//             //  res.redirect('/upload.html');
//             res.end(result);
//         }
//     );
// }); //end app.post /upload



// app.post('/uploadedvideo', upload.single('file'), checkAppID, requiredAuthentication, function (req, res) {

//     console.log("uploadvideo headers: " + JSON.stringify(req.headers));
//     var returnString = "";
//     var expires = new Date();
//     expires.setMinutes(expires.getMinutes() + 30);
//     var ts = Math.round(Date.now() / 1000);
// //    var fname = req.files.file.name.toLowerCase();
// //    fname = fname.replace(/[-\/\\^$*+?()|[\]{}]/g, "_");
//     var fname = req.file.originalname;
// //    var fname_ext = getExtension(fname);
// //    fname = fname.substr(0, fname.lastIndexOf('.'));
// //    fname = nameCleaner(fname);
// //    fname = fname + fname_ext;

//     console.log("filename: " + fname);
// //    var fpath = req.files.file.path;
// //    var parsedTags = {};
//     //var item_id = "";

//     async.waterfall([ //flow control for functions below, do one at a time, and pass vars to next as needed

//             function(callback) { //check that the bucket and file exist

//                 var bucketFolder = 'servicemedia.' + req.session.user._id.toString();
//                 console.log(bucketFolder);
//                 s3.headBucket({Bucket:bucketFolder},function(err,data){
//                     if(err){
//                         s3.createBucket({Bucket:bucketFolder},function(err2,data){
//                             if (err2){
//                                 console.log(err2);
//                                 callback(err2);
//                             } else {
//                                 console.log("bucket creation");
//                                 callback(null, bucketFolder);
//                             }
//                         });
//                     } else {
//                         console.log("Bucket exists and we have access");
//                         var params = {
//                             Bucket: bucketFolder,
//                             Key: fname
//                         }
//                         s3.headObject(params, function (err, metadata) {
//                             if (err && err.code === 'NotFound') {
//                                 // Handle no object on cloud here
//                                 console.log(err);
//                                 callback(err);
//                                 res.send("no");
//                             } else {
//                                 console.log(metadata);
//                                 callback(null, bucketFolder);
//                             }
//                         });
//                     }
//                 });

//             },

//             function(bFolder,  callback) { //#3 save data to mongo, get object ID

//                 var itemTitle = "";
//                 console.log("video upload complete, saving to mongo..");
//                 db.video_items.save(
//                     {
//                         userID : req.session.user._id.toString(),
//                         username : req.session.user.userName,
//                         title : "",
//                         filename : fname,
//                         item_type : 'video',
//                         item_status: "private"

//                     },
//                     function (err, saved) {
//                         if ( err || !saved ) {
//                             console.log('video not saved..');
//                             callback (err);
//                         } else {
//                             var item_id = saved._id.toString();
//                             console.log('new item id: ' + item_id);
//                             callback(null, bFolder, item_id);
//                         }
//                     }
//                 );
//             }

//         ], //end async flow

//         function(err, result) { // #last function, close async
//             if (err != null) {
//                 res.end(err);
//             } else {
//                 console.log("waterfall done: " + result);
//                 //  res.redirect('/upload.html');
//                 res.end(result);
//             }
//         }
//     );
// });

// app.post('/uploadvideo', upload.single('file'), checkAppID, requiredAuthentication, function (req, res) {

//     console.log("uploadvideo headers: " + JSON.stringify(req.headers));
//     var returnString = "";
//     var expires = new Date();
//     expires.setMinutes(expires.getMinutes() + 30);
//     var ts = Math.round(Date.now() / 1000);
// //    var fname = req.files.file.name.toLowerCase();
// ////    fname = fname.replace(/[-\/\\^$*+?()|[\]{}]/g, "_");
// //    var fname_ext = getExtension(fname);
// //
// //    fname = nameCleaner(fname);
// //    fname = fname + fname_ext;
//     var fname = req.file.originalname.toLowerCase();
//     var fname_ext = getExtension(fname);
//     fname = fname.substr(0, fname.lastIndexOf('.'));
//     fname = nameCleaner(fname);
//     fname = fname + fname_ext;
//     var fsize = req.file.size;
//     console.log("filename: " + fname);
//     var fpath = req.file.path;
//     var parsedTags = {};
//     //var item_id = "";

//     async.waterfall([ //flow control for functions below, do one at a time, and pass vars to next as needed

//             function(callback) { //check for proper extensions
//                 console.log("extension of " + fname + "is " + fname_ext);
//                 if (fname_ext === ".mp4") {
//                     callback(null);
//                 } else {
//                     callback(error);
//                     res.end("no");
//                 }
//             },

//             function(callback) { //check that we gotsa bucket for this user

//                 var bucketFolder = 'servicemedia';
//                 console.log(bucketFolder);
//                 s3.headBucket({Bucket:bucketFolder, Delimiter: "users/" + req.session.user._id.toString()},function(err,data){
//                     if(err){
// //                        s3.createBucket({Bucket:bucketFolder},function(err2,data){
// //                            if (err2){
// //                                console.log(err2);
// //                                callback(err2);
// //                            } else {
//                                 console.log("bucket creation");
//                                 callback(null, bucketFolder);

//                     } else {
//                         console.log("Bucket exists and we have access");
//                         callback(null, bucketFolder);
//                     }
//                 });

//             },

// //            function(theBucketFolder, callback) { //upload orig file to s3 - TODO Get the antic0llidr stuff from the audio version
// //
// //                var stream = fs.createReadStream(fpath);
// //                var params = {Bucket: theBucketFolder, Key: fname, Body: stream};
// //
// //                console.log("orignal file to: " + JSON.stringify(params));
// //                s3.upload(params, function(err, data) {
// //                    if (err) {
// //                        console.log("Error uploading data: ", err);
// //                        callback(err);
// //                    } else {
// //                        console.log("Successfully uploaded data to " + theBucketFolder);
// ////              res.send('original file in s3');
// //                        callback(null, 'uploaded orig file');
// //                    }
// //                });
// //            },

//             function(bFolder,  callback) { //#3 save data to mongo, get object ID

//                 var itemTitle = "";
//                 console.log("video upload complete, saving to mongo..");
//                 db.video_items.save(
//                     {
//                         userID : req.session.user._id.toString(),
//                         username : req.session.user.userName,
//                         title : "",
//                         filename : fname,
//                         item_type : 'video',
//                         tags: req.body.tags,
//                         item_status: "private",
// //        postcardForScene : req.body.postcardForScene,
//                         otimestamp : ts,
//                         ofilesize : fsize},
//                     function (err, saved) {
//                         if ( err || !saved ) {
//                             console.log('video not saved..');
//                             callback (err);
//                         } else {
//                             var item_id = saved._id.toString();
//                             console.log('new item id: ' + item_id);
//                             callback(null, bFolder, item_id);
//                         }
//                     }
//                 );
//             },
//             function(theBucketFolder, item_id, callback) { //upload orig file to s3 - TODO Get the antic0llidr stuff from the audio version

//                 var stream = fs.createReadStream(fpath);
//                 var params = {Bucket: theBucketFolder, Key: "users/" + req.session.user._id.toString() + "/" + item_id + "." + fname, Body: stream};

//                 console.log("orignal file to: " + JSON.stringify(params));
//                 s3.upload(params, function(err, data) {
//                     if (err) {
//                         console.log("Error uploading data: ", err);
//                         stream.close();
//                         callback(err);
//                     } else {
//                         console.log("Successfully uploaded data to " + theBucketFolder);
// //              res.send('original file in s3');
//                         stream.close();
//                         callback(null, 'uploaded orig file');
//                     }
//                 });
//             }


//         ], //end async flow

//         function(err, result) { // #last function, close async
//             if (err != null) {
//                 res.end(err)
//             } else {
//                 console.log("waterfall done: " + result);
//                 //  res.redirect('/upload.html');
//                 res.end(result);
//             }
//         }
//     );
// });

/*
app.get('/braincheckbucket', function (req, res) {

    var response = {};
    var rezponze = {};
    stagedItems = [];
    async.waterfall([
        function (callback) {
            var params = {
                Bucket: 'strr',
                Prefix: 'braincheck/'
            }
            s3.listObjects(params, function(err, data) {
                if (err) {
                    console.log(err);
                    return callback(err);
                }
                if (data.Contents.length == 0) {
                    console.log("no content found");
                    callback(null);
                } else {
                    response = data.Contents;
                    callback();
                }
            });
        },
        function (callback) {

            async.each (response, function (r, callbackz) { //loop tru w/ async
                var name = r.Key;
                var itme = {}
                itme.name = name;
                var assetURL = s3.getSignedUrl('getObject', {Bucket: 'strr', Key: r.Key, Expires: 6000});
                itme.url = assetURL;

                stagedItems.push(itme);
                callbackz();
            }, function(err) {
               
                if (err) {
                    console.log('A file failed to process');
                    callbackz(err);
                } else {
                    console.log('All files have been processed successfully');
                    stagedItems.reverse();
                    rezponze.bucketItems = stagedItems;
                    callback(null);
                }
            });
        }
    ],
    function (err, result) { // #last function, close async
        res.json(rezponze);
        console.log("waterfall done: " + result);
    });


});

app.post('/uploadbraincheckvideo', upload.single('file'), function (req, res) {

    console.log("uploadvideo headers: " + JSON.stringify(req.headers));
    var returnString = "";
    var expires = new Date();
    expires.setMinutes(expires.getMinutes() + 30);
    var ts = Math.round(Date.now() / 1000);

    var fname = req.file.originalname.toLowerCase();
    var fname_ext = getExtension(fname);
    // fname = fname.substr(0, fname.lastIndexOf('.'));
    // fname = nameCleaner(fname);
    // fname = fname + fname_ext;
    // var fsize = req.file.size;
    console.log("filename: " + fname);
    var fpath = req.file.path;
    
    async.waterfall([ //flow control for functions below, do one at a time, and pass vars to next as needed

            function(callback) { //check for proper extensions
                console.log("extension of " + fname + "is " + fname_ext);
                if (fname_ext === ".mp4" || fname_ext === ".mov" || fname_ext === ".txt" || fname_ext === ".json") {
                    callback(null);
                } else {
                    callback(error);
                    res.end("no");
                }
            },
            function(callback) { //check that we gotsa bucket for this user
                var bucketFolder = 'strr/braincheck';
                console.log(bucketFolder);
                s3.headBucket({Bucket:bucketFolder},function(err,data){
                    if(err){
                        console.log("bucket creation");
                        callback(null, bucketFolder);
                    } else {
                        console.log("Bucket exists and we have access");
                        callback(null, bucketFolder);
                    }
                });
            },
            function(theBucketFolder, callback) { //upload orig file to s3 
                var stream = fs.createReadStream(fpath);
                var params = {Bucket: theBucketFolder, Key: fname, Body: stream};
                console.log("orignal file to: " + JSON.stringify(params));
                s3.upload(params, function(err, data) {
                    if (err) {
                        console.log("Error uploading data: ", err);
                        stream.close();
                        callback(err);
                    } else {
                        console.log("Successfully uploaded data to " + theBucketFolder);
//              res.send('original file in s3');
                        stream.close();
                        callback(null, 'upload complete');
                    }
                });
            }
        ], //end async flow

        function(err, result) { // #last function, close async
            if (err != null) {
                res.end(err)
            } else {
                console.log("waterfall done: " + result);
                //  res.redirect('/upload.html');
                res.end(result);
            }
        }
    );
});
 */
 
function Shuffle(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function GenerateName () {
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
            return (err);
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
            const nameString = name1 + " " + name2 + " " + name3;
            console.log("fresh name : " +  name1 +" " + name2 +" " + name3);
            return nameString;
        }
    });

   
};

function UppercaseFirst(s) {
// Check for empty string.
// console.log("checkin s " + s);
// if (s.Length < 2) {
//     return s.Empty;
// }
if (s != undefined) {
const ufirst = s.charAt(0).toUpperCase() + s.slice(1);
// console.log("to upperfirst " + ufirst);
// Return char and concat substring.
return ufirst;
    } else {
        return "*";
    }
};

// function getExtension(filename) {
//     var i = filename.lastIndexOf('.');
//     return (i < 0) ? '' : filename.substr(i);
// }

function cleanbase64 (string) {
    btoa(string.replace(/[\u00A0-\u2666]/g, function(c) {
    return '&#' + c.charCodeAt(0) + ';';
    }))
};