const { returncode } = require("../libraries/rcodeapi")
const { read, write, copy, mkdir } = require("../libraries/fsapi")
const { getPermissions } = require("../libraries/permapi")
const { parseArgs } = require("util")
const sha256 = require("js-sha256").sha256

module.exports = {
    name: "adduser",
    desc: "Add a user to the system",
    usage: "--username <USERNAME> [--password <PASSWORD>] [--shell <SHELL>] [flags]",
    execute: (ctx, args) => {
        let {values, _, tokens} = parseArgs({ // eslint-disable-line no-unused-vars
            args: args,
            allowPositionals: false,
            strict: false,
            tokens: true,
            options: {
                "verbose": {
                    type: "boolean",
                    short: "v"
                },
                "no-create-home": {
                    type: "boolean",
                    short: "n"
                },
                "username": {
                    type: "string",
                },
                "password": {
                    type: "string"
                },
                "shell": {
                    type: "string",
                }
            }
        })

        verbose = values["verbose"] ? true : false;
        
        if (!values.username) {
            module.exports.help()
            return {
                code: returncode.ERROR_MISSING_ARGUMENT
            }
        }
        if (!getPermissions(ctx, ctx.user).includes("admin")) {
            return {
                stdout: "you are not admin",
                code: returncode.ERROR_INSUFFICIENT_PERMISSIONS
            }
        }
        let shells = read("/etc/shells.txt").split("\r\n").join("\n").split("\n")
        let users  = JSON.parse(read("/etc/users.json"))
        let latestuid = 0
        let groups = JSON.parse(read("/etc/groups.json"))
        for (const [key, value] of Object.entries(users)) {
            key; // shut up eslint
            if (value.uid > latestuid) {
                latestuid = value.uid
            }
        }
        if (verbose) console.log("latest uid is " + latestuid)
        let uname = values.username.toLowerCase()
        if (users[uname]) {
            return {
                stdout: uname + " already exists",
                code: returncode.ERROR_ALREADY_EXISTS
            }
        }
        let shell = values.shell || "djsh"
        if (verbose) console.log("shell: " + shell)
        if (!shells.includes(shell)) {
            return {
                stdout: shell + " is not a valid shell",
                code: returncode.ERROR_INVALID_ARGUMENT
            }
        }
        users[uname] = {};
        users[uname]["name"] = uname
        if (!values.password) {
            users[uname]["pwhashed"] = ""
        } else {
            users[uname]["pwhashed"] = sha256(values.password)
        }
        users[uname]["permissions"] = []
        users[uname]["uid"] = latestuid + 1
        users[uname]["groups"] = [String(latestuid + 1)]
        users[uname]["shell"] = shell
        if (!values["no-create-home"]) {
            try {
                mkdir("/home/")
            } catch (e) {
                if (verbose) console.log("/home/ already exists")
            }
            copy("/etc/skel", "/home/" + uname)
            if (verbose) console.log("copied skeleton directory")
        }

        groups[String(latestuid + 1)] = {}
        groups[String(latestuid + 1)]["name"] = uname
        groups[String(latestuid + 1)]["permissions"] = []
        if (verbose) console.log("configured user group defaults")

        write("/etc/users.json", JSON.stringify(users, null, 2))
        write("/etc/groups.json", JSON.stringify(groups, null, 2))
        if (verbose) console.log("wrote out files")
        if (verbose) console.log("done")
    },
    help: () => {
        console.log(module.exports.name + ":", module.exports.desc)
        console.log("usage:", module.exports.name, module.exports.usage)
        console.log("---")
        console.log("arguments:")
        console.log("!   --username <username>")
        console.log("?   --password [password]")
        console.log("?   --shell [shell]")
        console.log("---")
        console.log("flags:")
        console.log("    --verbose, -v                 print extra information")
        console.log("    --no-create-home, -n          don't create a home directory for this user")
        console.log("! is a required argument, ? is optional")
    }
}