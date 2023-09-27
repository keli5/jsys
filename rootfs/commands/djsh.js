const { getPermissions } = require("../libraries/permapi")
const { returncode } = require("../libraries/rcodeapi")
const paths = require("path");

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

        if (ctx.user == "root" && ctx.users[ctx.user].pwhashed == "") console.log(ctx.color.red("You should really change the root password! Root currently has no password!"))
        updatePrompt(admin, ctx, returncode.OK)
        ctx.rl.prompt()
        ctx.rl.on('line', (line) => {
            line = line.trim()
            line = line.split(' ')
            let command = line.shift()
            let args = line;
            let lastReturnCode = ""
            let execution = undefined
            let action = undefined

            if (ctx.commands[command]) {
                let result = ""

                try {
                    execution = ctx.commands[command].execute(ctx, args)
                    action = execution?.action || undefined
                    result = execution?.stdout || ""
                    lastReturnCode = result?.code || returncode.OK
                } catch (err) {
                    console.log(ctx.color.red(err.stack))
                    lastReturnCode = result?.code || returncode.ERROR_INVOCATION
                }
                let newline = result ? "\n" : ""
                process.stdout.write(result + newline)
            } else if (command == "") {
                lastReturnCode = returncode.OK
            } else {
                console.log('command not found: ' + ctx.color.red(command))
                lastReturnCode = returncode.ERROR
            }
            if (exitFlag) {
                ctx.rl.setPrompt("Login: ")
                exitFlag = false;
            } else {
                updatePrompt(admin, ctx, lastReturnCode)
            }
            if (!ctx.commands[command]?.controlsReadline || action == "reprompt") ctx.rl.prompt();
        });

        ctx.events.on("exitShell", (ctx) => {
            ctx.env["SHELL"] = undefined;
            exitFlag = true;
            ctx.commands["login"].execute(ctx) // please for the love of all that is fucking holy
        })                                   // there has to be a better way to do this
    },
}

function updatePrompt(admin, ctx, lrc) {
    let promptChar = admin ? "#" : "$"
    let promptCharColor = ctx.color.white
    let parsedPromptChar = promptCharColor(promptChar)

    let usernameColor = admin ? ctx.color.yellow : ctx.color.cyan
    let fuser = usernameColor.bold(ctx.user.trim());

    let fpath = paths.resolve(ctx.path) // FORMATTED PATH only!
    fpath = fpath.replace("/home/" + ctx.user, "~")
    fpath = fpath.replace(/[A-Z]:\\/, "/") // windowsy moment
    fpath = fpath.replace("\\", "/")
    fpath = ctx.color.red.bold(`[${fpath.trim()}]`);

    if (lrc == returncode.OK) {
        promptCharColor = ctx.color.green
    } else {
        promptCharColor = ctx.color.red
    }
    parsedPromptChar = promptCharColor(promptChar)

    let shprompt = `${fuser} : ${fpath} ${parsedPromptChar} `

    ctx.rl.setPrompt(shprompt)
}