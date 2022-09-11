const { readdir, expandPath, isDir, ePath } = require("../libraries/fsapi")
const { returncode } = require("../libraries/rcodeapi")

module.exports = {
    name: "ls",
    desc: "List files in a directory.",
    execute: (ctx, args) => {
        let directory = args[0] || ctx.path
        directory = expandPath(ctx, directory, false)
        if (isDir(directory)) {
            return {
                stdout: readdir(directory).join(" "),
                code: 0
            }
        } else {
            return {
                stdout: ePath(directory),
                code: returncode.ERROR_NOT_DIR
            }
        }
    }
}