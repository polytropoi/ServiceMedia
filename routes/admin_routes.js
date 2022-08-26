const express = require("express");
const admin_router = express.Router();

admin_router.get("/test", function (req, res) {
    res.send("OK!");
});

module.exports = admin_router;