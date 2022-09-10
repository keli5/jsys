const { getPermissions } = require("../libraries/permapi")

module.exports = {
    name: "djsh",
    desc: "djsh is the Default Javascript SHell for JSys.",
    execute: (ctx) => {
        if (ctx.env["shell"] == "djsh") {
            return {
                stdout: "djsh cannot be invoked within djsh.",
                code: 1
            }
        }

        let admin = getPermissions(ctx, ctx.user).includes("admin")
        let promptChar = admin ? "#" : "$"
        let usernameColor = admin ? ctx.color.red : ctx.color.green

        ctx.env["shell"] = "djsh"
        let fuser = usernameColor.bold(ctx.user.trim());
        let fpath = ctx.color.magenta.bold(`[${ctx.path.trim()}]`);

        let shprompt = `${fuser} : ${fpath} ${promptChar} `

        ctx.rl.setPrompt(shprompt)
        ctx.rl.prompt()
        ctx.rl.on('line', (line) => {
            line = line.trim()
            line = line.split(' ')
            let command = line.shift()
            let args = line;
        
            if (ctx.commands[command]) {
              let result = ctx.commands[command].execute(ctx, args)?.stdout || ""
              let newline = result ? "\n" : ""
              process.stdout.write(result + newline)
            } else {
              console.log('command not found: ' + ctx.color.red(command))
              
            }

            fuser = usernameColor.bold(ctx.user.trim());
            fpath = ctx.color.magenta.bold(`[${ctx.path.trim()}]`);
            ctx.rl.setPrompt(shprompt)
            
            ctx.rl.prompt();
        }); 
    }
}

