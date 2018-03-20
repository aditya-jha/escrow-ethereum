/*
 * created by aditya on 20/03/18
 */

"use strict";

global.Config = require("./config");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

let app = express();
let http = require("http").Server(app);

app.use(bodyParser.text({limit: '15mb'}));
app.use(bodyParser.urlencoded({limit: '15mb', extended: false}));
app.use(bodyParser.json({limit: '15mb'}));

app.use(cors());
app.use("/", require("./routes"));

app.use(express.static(path.join(__dirname, "static")));

process.on('uncaughtException', (err) => {
    console.log(err);
});


http.listen(global.Config.port, () => {
    console.log(`core server running at ${global.Config.hostAddress}`)
});
