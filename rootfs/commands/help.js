const { returncode } = require("../libraries/rcodeapi")

module.exports = {
    name: "help",
    desc: "Show available commands, or get extended help on a specific command.",
    execute: (ctx, args) => {
      let stdout = "";
      if (args.length != 0) {
        try {
          ctx.commands[args[0]].help()
        } catch (_) {
          return {
            stdout: "no help available for this command",
            code: returncode.ERROR_NO_ENTITY
          }
        }
        return {
          stdout: "",
          code: returncode.OK
        }
      }
      Object.keys(ctx.commands).forEach(cmdname => {
        let command = ctx.commands[cmdname]
        if (command.hidden) return
        stdout += `${command.name}: ${command.desc}\n`
      });
      return {
        stdout: stdout,
        code: returncode.OK
      }
    }
}