const { returncode } = require("../libraries/rcodeapi")
const { read, write } = require("../libraries/fsapi")
const { getPermissions } = require("../libraries/permapi")
const { parseArgs } = require("util")
const sha256 = require("js-sha256").sha256

module.exports = {
    name: "passwd",
    desc: "Change user password.",
    controlsReadline: true,
    execute: (ctx, args) => {
        let { values, _, tokens } = parseArgs({ // eslint-disable-line no-unused-vars
            args: args,
            allowPositionals: false,
            strict: false,
            tokens: true,
            options: {
                "user": {
                    type: "string"
                }
            }
        })

        user = values["user"] || ctx.user

        if (user != ctx.user) {
            if (!getPermissions(ctx, ctx.user).includes("admin")) {
                return {
                    stdout: "you are not admin",
                    code: returncode.ERROR_INSUFFICIENT_PERMISSIONS,
                    action: "reprompt"
                }
            }
        }
        newPass = ""
        ctx.rl.question(`New password for ${user}: `, (password) => {
            password = password.replace("\r", "").replace("\n", "").trim()
            if (!password) {
                console.log("no password provided, exiting")
                ctx.rl.prompt()
                return { code: returncode.ERROR_INVALID_ARGUMENT }
            }
            newPass = password
            ctx.rl.question('Confirm password: ', (confirm) => {
                confirm = confirm.replace("\r", "").replace("\n", "").trim()
                if (confirm != password) {
                    console.log("password does not match")
                    ctx.rl.prompt()
                    delete password
                    delete newPass
                    return {
                        code: returncode.ERROR_INVALID_ARGUMENT
                    }
                } else {
                    let users = JSON.parse(read("/etc/users.json"))
                    users[user]["pwhashed"] = sha256(confirm)
                    write("/etc/users.json", JSON.stringify(users, null, 2))
                    console.log("password changed for " + user)
                    ctx.rl.prompt()
                    delete password
                    delete newPass
                    return {
                        code: returncode.OK
                    }
                }
            })
        })
    }
}