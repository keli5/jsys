const { expandPath, move } = require("../libraries/fsapi")

module.exports = {
    name: "mv",
    desc: "Move/rename a file or directory",
    usage: "<SOURCE> <DESTINATION>",
    execute: (ctx, args) => {
        let source = args[0]
        let dest = args[1]
        source = expandPath(ctx, source, false)
        dest = expandPath(ctx, dest, false)

        move(source, dest)
        return {
            code: 0
        }
        
    }
}