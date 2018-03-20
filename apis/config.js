/*
 * created by aditya on 20/03/18
 */

"use strict";

const path = require("path");

module.exports = {
    host: "127.0.0.1",
    port: "8082",
    hostAddress: "http://127.0.0.1:8082",
    uploadDir: path.resolve(__dirname, "uploads"),
    maxFileSize: "15mb",

};
