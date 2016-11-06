(() => {
    "use strict"

    let fs = require("fs")
    let crypto = require("crypto")

    let KEY = ""
        `###KEY###`
    function decipher(encrypted) {
        var decrypted = ""
        var decipher = crypto.createDecipher("des3", KEY)
        decrypted += decipher.update(encrypted, 'hex', 'utf8')
        decrypted += decipher.final('utf8')
        return decrypted
    }

    window.___run___ = (code) => {
        new Function(decipher(code)).bind(window)()
    }

    Function.prototype.toString = () => "[object Function]"
    Object.freeze(Function.prototype)
    Object.freeze(Function)
    nw.global.Function.prototype.toString = () => "[object Function]"
    nw.global.Object.freeze(nw.global.Function.prototype)
    nw.global.Object.freeze(nw.global.Function)

    let Module = require("module")
    let _compile = Module.prototype._compile
    Module.prototype._compile = function (content, filename) {
        content = decipher(content)
        return _compile.call(this, content, filename)
    }
})()