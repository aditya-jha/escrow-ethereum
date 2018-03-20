/*
 * created by aditya on 20/03/18
 */

"use strict";

const router = require("express").Router();
const fs = require("fs");
const crypto = require("crypto");

const multer = require("multer")({
    dest: global.Config.uploadDir,
    limits: global.Config.maxFileSize
});

router.get("/", (req, res, next) => {
    res.send({
        data: "Hello World"
    });
});

router.post("/upload-transactions-file", multer.single("file"), (req, res, next) => {
    const uploadedFile = req.file;

    let data = fs.readFileSync(uploadedFile.path).toString();
    data = data.split("\n");

    let parsed = [];
    data.forEach(d => {
        const dSplit = d.split("|");
        parsed.push({
            transactionId: dSplit[0],
            escrowAccountNo: dSplit[1],
            amount: parseFloat(dSplit[2]),
            senderName: dSplit[3],
            senderAccountNo: dSplit[4],
            senderIFSC: dSplit[5],
            date: dSplit[6],
            nodalTransactionId: dSplit[7],
            virtualAccountNo: `${dSplit[8]}${dSplit[9]}`,
            mode: dSplit[10],
            hash: crypto.createHash("sha256").update(d).digest("hex")
        });
    });

    res.send({
        success: true,
        data: parsed
    });
});

module.exports = router;