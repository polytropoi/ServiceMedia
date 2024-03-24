import express from 'express';
import http from 'http';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongojs from 'mongojs';
import methodOverride from 'method-override';
import session from 'express-session';
import * as entities from 'entities';
// const entities = ent;
import validator from 'validator';
import * as minio from 'minio';
import helmet from 'helmet';
import { default as connectMongoDBSession} from 'connect-mongodb-session';
const MongoDBStore = connectMongoDBSession(session);
// import pkg from 'connect-mongodb-session'; 
// const { MongoDBStore } = pkg;
import async from 'async';
import bcrypt from 'bcrypt-nodejs';
import shortid from 'shortid';
import QRCode from 'qrcode';
import requireText from 'require-text';
import {} from 'dotenv/config';
import { AccessToken } from 'livekit-server-sdk';
import {default as Stripe} from 'stripe';
const stripe = Stripe(process.env.STRIPE_KEY);
import aws from 'aws-sdk';

// const express = require("express");
import express from 'express';
const webxr_router = express.Router();
// const entities = require("entities");
import * as entities from 'entities';

// const async = require('async');
import async from 'async';
// const ObjectID = require("bson-objectid");
import ObjectID from 'bson-objectid';

// const path = require("path");
import path from 'path';

// const validator = require('validator');
import validator from 'validator';

// const jwt = require("jsonwebtoken");
import jwt from 'jsonwebtoken';

// const requireText = require('require-text');
import requireText from 'require-text';

// const { Console } = require("console");
// const minio = require('minio');
import * as minio from 'minio';
// let minio = app.get('minio');

if (socketHost != null && socketHost != "NONE") {
    if (sceneData.sceneNetworking == "SocketIO") {
        socketScripts = "<script src=\x22/socket.io/socket.io.js\x22></script>"; //TODO naf, etc..
    } else if (sceneData.sceneNetworking == "WebRTC") {
        socketScripts = "<script src=\x22https://cdn.jsdelivr.net/npm/livekit-client/dist/livekit-client.umd.min.js\x22></script>";
    }
}