const express = require("express");
const response_router = express.Router();

response_router.get("/test", function (req, res) {
    res.send("OK!");
});

module.exports = response_router;