import { getPermissions } from "../libraries/permapi";
import { returncode } from "../libraries/rcodeapi";
import paths from "path";
import { green, red, white, bold} from "colors";

module.exports = {
    name: "djsh",
    desc: "djsh is the Default Javascript SHell for JSys.",
    execute: (ctx) => {
        let exitFlag = false;
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
            let command: string = line.shift()
            let args = line;
            let lastReturnCode;
        
            if (ctx.commands[command]) {
              let result: Object;
              try {
                result = ctx.commands[command].execute(ctx, args)?.code
                lastReturnCode = result || returncode.OK
              } catch (err) {
                console.log((err.stack as string).red)
                lastReturnCode = result || returncode.ERROR
              }
              let newline = result ? "\n" : ""
              process.stdout.write(result + newline)
            } else {
              console.log('command not found: ' + command.red)
              lastReturnCode = returncode.ERROR
            }
            if (exitFlag) {
              ctx.rl.setPrompt("Login: ")
              exitFlag = false;
            } else {
              updatePrompt(admin, ctx, lastReturnCode)
            }
            ctx.rl.prompt();
        }); 

        ctx.events.on("exitShell", (ctx) => {
          ctx.env["SHELL"] = undefined;
          exitFlag = true;
          return; // please for the love of all that is fucking holy
        })                                   // there has to be a better way to do this
    },
}

function updatePrompt(admin, ctx, lrc) {
  let promptChar = admin ? "#" : "$"
  let promptCharColor = white
  let parsedPromptChar = promptCharColor(promptChar)

  let usernameColor = admin ? red : green
  let fuser = usernameColor.bold(ctx.user.trim());
  
  let fpath = paths.resolve(ctx.path) // FORMATTED PATH only!
  fpath = fpath.replace("/home/" + ctx.user, "~")
  fpath = fpath.trim();
  fpath = fpath.magenta

  if (lrc == returncode.OK) {
      promptCharColor = green
  } else {
      promptCharColor = red
  }
  parsedPromptChar = promptCharColor(promptChar)

  let shprompt = `${fuser} : ${fpath} ${parsedPromptChar} `

  ctx.rl.setPrompt(shprompt)
}