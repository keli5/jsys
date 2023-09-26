const { returncode } = require("../libraries/rcodeapi")

module.exports = {
    name: "users",
    desc: "List users from users.json.",
    execute: (ctx) => {
      let stdout = ""
      Object.keys(ctx.users).forEach(element => {
        let user = ctx.users[element]
        stdout += `${user.name}: uid ${user.uid} / gid(s) ${user.groups.join(",")}\n`
      });

      return {
        stdout: stdout,
        code: returncode.OK
      }
    }
}