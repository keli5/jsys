const { expandPath, isDir, ePath } = require("../libraries/fsapi")
const { returncode } = require("../libraries/rcodeapi")

module.exports = {
    name: "cd",
    desc: "Change to another directory",
    execute: (ctx, args) => {
        let directory = args[0] || ctx.path
        directory = expandPath(ctx, directory, true)
        directory = "/" + directory
        if (isDir(directory)) {
            ctx.path = ePath(directory)
            return {
                code: 0
            }
        } else {
            return {
                stdout: ePath(directory) + " is not a directory",
                code: returncode.ERROR_NOT_DIR
            }
        }
    }
}