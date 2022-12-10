import { readdir, expandPath, isDir, ePath } from "../libraries/fsapi";
import { returncode } from "../libraries/rcodeapi";
import { parseArgs } from "util";// stability 1 - i'm in danger lol

module.exports = {
    name: "ls",
    desc: "List files in a directory.",
    usage: "<PATH> [--no-colors/-n]",
    execute: (ctx, args) => {
        let colors = true;
        let cleanedArgs = []
        let {values, positionals, tokens} = parseArgs({ // eslint-disable-line no-unused-vars
            args: args,
            allowPositionals: true,
            strict: false,
            tokens: true,
            options: {
                "no-colors": {
                    type: "boolean",
                    short: "n"
                },
            }
        })
        Object.values(tokens).forEach(item => {
            cleanedArgs = args.filter(e => e !== item["rawName"])
        })
        colors = values["no-colors"] ? false : true;

        let directory = cleanedArgs[0] || ctx.path
        let stdout = ""
        directory = expandPath(ctx, directory, false)

        let isdir;
        try {
            isdir = isDir(directory);
        } catch {
            module.exports.help()
            return {
                code: returncode.ERROR
            }
        }

        if (isdir) {
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
    },
    help: () => {
        console.log(module.exports.name + ":", module.exports.desc)
        console.log("usage:", module.exports.name, module.exports.usage)
        console.log("---")
        console.log("arguments:")
        console.log("?   --no-colors / -n")
        console.log("---")
        console.log("! is a required argument, ? is optional")
    }
}