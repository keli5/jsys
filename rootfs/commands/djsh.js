const { getPermissions } = require("../libraries/permapi")
const { returncode } = require("../libraries/rcodeapi")
const paths = require("path")

module.exports = {
    name: "djsh",
    desc: "djsh is the Default Javascript SHell for JSys.",
    execute: (ctx) => {
        if (ctx.env["SHELL"] == "djsh") {
            return {
                stdout: "djsh cannot be invoked within djsh.",
                code: returncode.ERROR_INVOCATION
            }
        }

        let admin = getPermissions(ctx, ctx.user).includes("admin")
        ctx.env["SHELL"] = "djsh"
        updatePrompt(admin, ctx, returncode.OK)

        ctx.rl.prompt()
        ctx.rl.on('line', (line) => {
            line = line.trim()
            line = line.split(' ')
            let command = line.shift()
            let args = line;
            let lastReturnCode = ""
        
            if (ctx.commands[command]) {
              let result = ""
              try {
                result = ctx.commands[command].execute(ctx, args)?.stdout || ""
                lastReturnCode = result?.code || returncode.OK
              } catch (err) {
                console.log(ctx.color.red(err.stack))
                lastReturnCode = result?.code || returncode.ERROR
              }
              let newline = result ? "\n" : ""
              process.stdout.write(result + newline)
            } else {
              console.log('command not found: ' + ctx.color.red(command))
              lastReturnCode = returncode.ERROR
            }
            
            updatePrompt(admin, ctx, lastReturnCode)
            ctx.rl.prompt();
        }); 
    },
    exit: (ctx) => { // shells should provide an exit() to gracefully exit
      ctx.env["SHELL"] = undefined;
      return {
        code: returncode.OK
      }
    }
}

function updatePrompt(admin, ctx, lrc) {
  let promptChar = admin ? "#" : "$"
  let promptCharColor = ctx.color.white
  let parsedPromptChar = promptCharColor(promptChar)

  let usernameColor = admin ? ctx.color.red : ctx.color.green
  let fuser = usernameColor.bold(ctx.user.trim());
  
  let fpath = paths.resolve(ctx.path) // FORMATTED PATH only!
  fpath = fpath.replace("/home/" + ctx.user, "~")
  fpath = ctx.color.magenta.bold(`[${fpath.trim()}]`);

  if (lrc == returncode.OK) {
      promptCharColor = ctx.color.green
  } else {
      promptCharColor = ctx.color.red
  }
  parsedPromptChar = promptCharColor(promptChar)

  let shprompt = `${fuser} : ${fpath} ${parsedPromptChar} `

  ctx.rl.setPrompt(shprompt)
}