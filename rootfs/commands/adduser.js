const { returncode } = require("../libraries/rcodeapi")
const { read, write } = require("../libraries/fsapi")
const { getPermissions } = require("../libraries/permapi")
const sha256 = require("js-sha256").sha256

module.exports = {
    name: "adduser",
    desc: "Add a user to the system. adduser <username> <password>",
    execute: (ctx, args) => {
        if (!args[0] || !args[1]) {
            return {
                stdout: "adduser takes 2 arguments: username, password",
                code: returncode.ERROR_MISSING_ARGUMENT
            }
        }
        if (!getPermissions(ctx, ctx.user).includes("admin")) {
            return {
                stdout: "you are not admin",
                code: returncode.ERROR_INSUFFICIENT_PERMISSIONS
            }
        }
        let users  = JSON.parse(read("/etc/users.json"))
        let latestuid = 0
        let groups = JSON.parse(read("/etc/groups.json"))
        for (const [key, value] of Object.entries(users)) {
            key; // shut up eslint
            if (value.uid > latestuid) {
                latestuid = value.uid
            }
        }
        let uname = args[0].toLowerCase()
        if (users[uname]) {
            return {
                stdout: uname + " already exists",
                code: returncode.ERROR_ALREADY_EXISTS
            }
        }
        users[uname] = {};
        users[uname]["name"] = uname
        users[uname]["pwhashed"] = sha256(args[1])
        users[uname]["permissions"] = []
        users[uname]["uid"] = latestuid + 1
        users[uname]["groups"] = [String(latestuid + 1)]
        users[uname]["shell"] = "djsh"

        groups[String(latestuid + 1)] = {}
        groups[String(latestuid + 1)]["name"] = uname
        groups[String(latestuid + 1)]["permissions"] = []

        write("/etc/users.json", JSON.stringify(users, null, 2))
        write("/etc/groups.json", JSON.stringify(groups, null, 2))
    }
}