const { assert } = require("console")
const { expandPath, isDir, remove, exists } = require("../libraries/fsapi")
const { returncode } = require("../libraries/rcodeapi")
const { parseArgs } = require("util") // stability 1 - i'm in danger lol

module.exports = {
    name: "rm",
    desc: "Remove a file or directory.",
    usage: "<PATH> [--recursive/-r]",
    execute: (ctx, args) => {
        let cleanedArgs = []
        let {values, _, tokens} = parseArgs({ // eslint-disable-line no-unused-vars
            args: args,
            allowPositionals: true,
            strict: false,
            tokens: true,
            options: {
                "recursive": {
                    type: "boolean",
                    short: "r"
                },
            }
        })
        Object.values(tokens).forEach(item => {
            cleanedArgs = args.filter(e => e !== item["rawName"])
        })

        let file = cleanedArgs[0] || ctx.path

        let isdir;
        try {
            file = expandPath(ctx, file, false)
            isdir = isDir(file);
        } catch {
            module.exports.help()
            return {
                code: returncode.ERROR
            }
        }

        if (isdir && !values["recursive"]) {
            return {
                stdout: "refusing to remove " + file + " - is a directory, but --recursive was not specified",
                code: returncode.ERROR_MISSING_ARGUMENT
            }
        } else {
            remove(file)
            return {
                code: returncode.OK
            }
        }
    },
    help: () => {
        console.log(module.exports.name + ":", module.exports.desc)
        console.log("usage:", module.exports.name, module.exports.usage)
        console.log("---")
        console.log("arguments:")
        console.log("?   --recursive / -r")
        console.log("---")
        console.log("! is a required argument, ? is optional")
    }
}