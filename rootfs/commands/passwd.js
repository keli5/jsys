const { returncode } = require("../libraries/rcodeapi")
const { read, write, copy, mkdir } = require("../libraries/fsapi")
const { getPermissions } = require("../libraries/permapi")
const { parseArgs } = require("util")
const sha256 = require("js-sha256").sha256

module.exports = {
    name: "passwd",
    desc: "Change user password.",
    execute: (ctx) => {
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

        if (values["user"] && (values["user"] != ctx.user)) {
            if (!getPermissions(ctx, ctx.user).includes("admin")) {
                return {
                    stdout: "you are not admin",
                    code: returncode.ERROR_INSUFFICIENT_PERMISSIONS
                }
            }
            newPass = ""
            ctx.rl.stdoutMuted = true;
            ctx.rl.question('New password: ', (password) => {
                ctx.rl.stdoutMuted = false
                password = password.replace("\r", "").replace("\n", "").trim()
                if (!password) {
                    return { stdout: "no password provided, exiting", code: returncode.OK }
                }
                newPass = password

                ctx.rl.stdoutMuted = true;
                ctx.rl.question('Confirm password: ', (confirm) => {
                    ctx.rl.stdoutMuted = false
                    confirm = confirm.replace("\r", "").replace("\n", "").trim()
                    if (confirm != password) {
                        return {
                            stdout: "password does not match",
                            code: returncode.ERROR_INVALID_ARGUMENT
                        }
                    } else {
                        
                    }
                })
            })
        }
    }
}