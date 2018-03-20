/*
 * created by aditya on 20/03/18
 */

"use strict";

const router = require("express").Router();

router.get("/", (req, res, next) => {
    res.send({
        data: "Hello World"
    });
});

module.exports = router;