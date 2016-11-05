"use strict"

const crypto = require("crypto")
const fs = require("fs")
const {execSync} = require("child_process")
const os = require("os")
const path = require("path")

///////////////////////////
// 签名验证算法
// openssl genrsa  -out ssh/code_rsa 1024
// openssl req -key ssh/code_rsa -new -x509 -out code_ras.pub
///////////////////////////

const PUBKEY = fs.readFileSync("./ssh/code_rsa.pub", "utf-8")
const PRIKEY = fs.readFileSync("./ssh/code_rsa", "utf-8")

let encryptStringWithRsaPublicKey = function (toEncrypt) {
    let buffer = new Buffer(toEncrypt);
    let encrypted = crypto.publicEncrypt(PUBKEY, buffer);
    return encrypted.toString("base64");
};

let decryptStringWithRsaPrivateKey = function (toDecrypt) {
    let buffer = new Buffer(toDecrypt, "base64");
    let decrypted = crypto.privateDecrypt(PRIKEY, buffer);
    return decrypted.toString("utf8");
};

let main = fs.readFileSync("./main.src.js", "utf-8").trim()
main = main.replace("###PRIKEY###", PRIKEY)
let tmpFile = path.join(os.tmpDir(), `${new Date().getTime()}_nw_main.src`)
fs.writeFileSync(tmpFile, main, "utf-8")
execSync(`sdk/nwjc ${tmpFile} ./main.bin`)
fs.unlinkSync(tmpFile)

let content = fs.readFileSync("./browser.src.js", { encoding: "utf-8" })
content = encryptStringWithRsaPublicKey(content)

fs.writeFileSync("./browser.js", content, "utf-8")