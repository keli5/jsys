import { returncode } from "../libraries/rcodeapi";

module.exports = {
    name: "users",
    desc: "List users from users.json.",
    execute: (ctx) => {
      let stdout = ""
      Object.keys(ctx.users).forEach(element => {
        let user = ctx.users[element]
        stdout += `${user.name} / ${user.uid} / ${user.groups.join(",")}\n`
      });

      return {
        stdout: stdout,
        code: returncode.OK
      }
    }
}