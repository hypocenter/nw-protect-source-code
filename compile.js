"use strict"

const crypto = require("crypto")
const fs = require("fs")
const {execSync} = require("child_process")
const os = require("os")
const path = require("path")

const KEY = fs.readFileSync("./key", "utf8")

function cipher(str) {
    var encrypted = ""
    var cip = crypto.createCipher("des3", KEY)
    encrypted += cip.update(str, 'utf8', 'hex')
    encrypted += cip.final('hex')
    return encrypted
}
function decipher(encrypted) {
    var decrypted = ""
    var decipher = crypto.createDecipher("des3", KEY)
    decrypted += decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}

let main = fs.readFileSync("./main.src.js", "utf8").trim()
let _key = KEY.split("")
for (let i = 0; i < 5; i++) _key.push(_key.shift())
main = main.replace("`###KEY###`", `
KEY = ["${_key.join('","')}"]
for (let i = 0; i< 5; i++) KEY.unshift(KEY.pop())
KEY = KEY.join("")
`)

let runFunc = ""
for (let i = 0; i < 10; i++) runFunc += String.fromCharCode("a".charCodeAt() + Math.round(Math.random() * 25))
runFunc = "___" + runFunc + "___"
main = main.replace("___run___", runFunc)

let tmpFile = path.join(os.tmpDir(), `${new Date().getTime()}_nw_main.src`)
fs.writeFileSync(tmpFile, main, "utf8")
execSync(`sdk/nwjc ${tmpFile} ./main.bin`)
fs.unlinkSync(tmpFile)

{
    let content = fs.readFileSync("./browser.src.js", "utf8")
    content = cipher(content)
    fs.writeFileSync("./browser.js", content, "utf8")
}
{
    let content = fs.readFileSync("./renderer.src.js", "utf8")
    content = `${runFunc}("${cipher(content)}")`
    fs.writeFileSync("./renderer.js", content, "utf8")
}