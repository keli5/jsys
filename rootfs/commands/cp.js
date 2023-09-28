const { expandPath, copy, exists, isDir } = require("../libraries/fsapi")
const { returncode } = require("../libraries/rcodeapi")

module.exports = {
    name: "cp",
    desc: "Copy a file or directory",
    usage: "<SOURCE> <DESTINATION>",
    execute: (ctx, args) => {
        let source = args[0]
        let dest = args[1]
        source = expandPath(ctx, source, false)
        dest = expandPath(ctx, dest, false)
        
        if (!source || !dest) return {
            stdout: "no path specified for " + (!source ? "source" : "destination"),
            code: returncode.ERROR_INVALID_ARGUMENT
        }

        copy(source, dest)
        return {
            code: 0
        }
        
    }
}