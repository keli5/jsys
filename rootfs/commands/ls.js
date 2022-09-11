const { readdir, expandPath, isDir, ePath } = require("../libraries/fsapi")
const { returncode } = require("../libraries/rcodeapi")
const { specifiedShortSwitches } = require("../libraries/argparseapi")

module.exports = {
    name: "ls",
    desc: "List files in a directory.",
    execute: (ctx, args) => {
        let colors = true;
        if (specifiedShortSwitches(args).includes("-n")) {
            colors = false;
            args = args.remove("-n")
        }

        let directory = args[0] || ctx.path
        let stdout = ""
        directory = expandPath(ctx, directory, false)

        if (isDir(directory)) {
            readdir(directory).forEach(item => {
                if (isDir(`${directory}/${item}`) && colors) {
                    stdout += ctx.color.blue(`${item} `)
                } else {
                    stdout += ctx.color.white(`${item} `)
                }
            })

            return {
                stdout: stdout,
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