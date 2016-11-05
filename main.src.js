
(() => {
    "use strict"

    let fs = require("fs")
    let crypto = require("crypto")

    Function.prototype.toString = () => "[object Function]"
    Object.freeze(Function.prototype)
    Object.freeze(Function)
    nw.global.Function.prototype.toString = () => "[object Function]"
    nw.global.Object.freeze(nw.global.Function.prototype)
    nw.global.Object.freeze(nw.global.Function)

    const PRIKEY = `###PRIKEY###`
    let decryptStringWithRsaPrivateKey = function(toDecrypt) {
        let buffer = new Buffer(toDecrypt, "base64");
        let decrypted = crypto.privateDecrypt(PRIKEY, buffer);
        return decrypted.toString("utf8");
    };

    let Module = require("module")
    let _compile = Module.prototype._compile
    Module.prototype._compile = function(content, filename) {
        content = decryptStringWithRsaPrivateKey(content)
        return _compile.call(this, content, filename)
    }
})()