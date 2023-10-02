const { expandPath, exists, touch } = require("../libraries/fsapi")
const { returncode } = require("../libraries/rcodeapi")

module.exports = {
    name: "touch",
    desc: "Create a file at/as DESTINATION.",
    usage: "",
    execute: (ctx, args) => {
        let dest = args[0]
        dest = expandPath(ctx, dest, false)
        
        if (!dest) {
            return {
                code: returncode.ERROR_INVALID_ARGUMENT,
                stdout: "no destination specified" 
            }
        }

        if (exists(dest)) {
            return {
                code: returncode.ERROR_ALREADY_EXISTS,
                stdout: "already exists: " + dest.toString()
            }
        }

        touch(dest)

        return {
            code: 0
        }
        
    }
}