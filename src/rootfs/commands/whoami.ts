import { returncode } from "../libraries/rcodeapi";

module.exports = {
    name: 'whoami',
    desc: 'Returns the user name.',
    execute: (ctx) => {
      return {
        "stdout": ctx.user,
        "code": returncode.OK
      }
    }
}