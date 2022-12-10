const sha256 = require("js-sha256").sha256
const { exists } = require("../libraries/fsapi")

module.exports = {
    name: "login",
    desc: "",
    hidden: true,
    execute: (ctx) => {
        ctx.rl.question('Login: ', (username) => {
            if (!ctx.users[username]) {
                console.log(ctx.color.red('Invalid username'));
                ctx.commands["login"].execute(ctx)
            }
            let shell = ctx.users[username]?.shell
            if (!shell) {
                return ctx.commands["login"].execute(ctx)
            }
            if (ctx.users[username].pwhashed != "") {
                ctx.rl.question('Password: ', (password) => {
                    if (sha256(password) == ctx.users[username].pwhashed) {
                        doLogin(ctx, username, shell)
                    } else {
                        ctx.rl.stdoutMuted = false;
                        console.log(ctx.color.red('\nIncorrect password'));
                        ctx.commands["login"].execute(ctx)
                    }
                })
                ctx.rl.stdoutMuted = true;
            } else if (ctx.users[username].pwhashed == "") {
                doLogin(ctx, username, shell)
            }
        })
    }
}

function doLogin(ctx, username, shell) {
    ctx.rl.stdoutMuted = false;
    ctx.user = username;
    let homepath = "/home/" + username.toLowerCase() + "/"
    ctx.path = exists(homepath) ? homepath : "/"
    ctx.commands[shell].execute(ctx)
}