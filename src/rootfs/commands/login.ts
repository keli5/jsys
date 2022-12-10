import { sha256 as sha256 } from "js-sha256";
import { exists } from "../libraries/fsapi";

module.exports = {
    name: "login",
    desc: "",
    hidden: true,
    execute: (ctx) => {
        while (true) {
            ctx.rl.question('Login: ', (username) => {
                if (!ctx.users[username]) {
                    console.log('Invalid username'.red);
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
                            console.log('\nIncorrect password'.red);
                            ctx.commands["login"].execute(ctx)
                        }
                    })
                    ctx.rl.stdoutMuted = true; // TODO: Reimplement muting stdout
                } else if (ctx.users[username].pwhashed == "") {
                    doLogin(ctx, username, shell)
                }
            })
        }
    }
}

function doLogin(ctx, username, shell) {
    ctx.rl.stdoutMuted = false;
    ctx.user = username;
    let homepath = "/home/" + username.toLowerCase() + "/"
    ctx.path = exists(homepath) ? homepath : "/"
    ctx.commands[shell].execute(ctx)
}