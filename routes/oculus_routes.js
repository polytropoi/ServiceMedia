import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require("express");
const oculus_router = express.Router();
const axios =  require("axios");

oculus_router.post("/:app/:action", function (req, res) {
    
    if (req.params.app.toString().toLowerCase() == "cb_rift") {
        console.log("oculus request for cowbots " + JSON.stringify(req.body));
        if (req.params.action.toString().toLowerCase() == "validate") {
            let data = {};
            data.access_token = process.env.CB_OCULUS_RIFT_TOKEN;
            data.nonce = req.body.nonce;
            data.user_id = req.body.oID;
            console.log(JSON.stringify(data));
            axios.post("https://graph.oculus.com/user_nonce_validate/", data) 
            .then((response) => {
                // console.log("oculus api validaaqtion response: " + JSON.stringify(response.data));
                res.send("nonce validation response: " + JSON.stringify(response.data));
            })
            .catch(function (error) {
                res.send(error);
            })
        } else {
            res.send("dunno...no action");
        }
    } else if ((req.params.app.toString().toLowerCase() == "cb_quest")) {
        if (req.params.action.toString().toLowerCase() == "validate") {
            let data = {};
            data.access_token = process.env.CB_OCULUS_QUEST_TOKEN;
            data.nonce = req.body.nonce;
            data.user_id = req.body.oID;
            console.log(JSON.stringify(data));
            axios.post("https://graph.oculus.com/user_nonce_validate/", data)
            .then((response) => {
                // console.log("oculus api validaaqtion response: " + JSON.stringify(response.data));
                res.send("nonce validation response: " + JSON.stringify(response.data));
            })
            .catch(function (error) {
                res.send(error);
            })
        } else {
            res.send("dunno...no action");
        }
    } else {
        res.send("for who/what?");
    }
});

    oculus_router.get("/test", function (req, res) {
        res.send("OK!");
    });

// module.exports = oculus_router;
export default oculus_router;