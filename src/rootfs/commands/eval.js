const { returncode } = require("../libraries/rcodeapi")

module.exports = {
    name: "eval",
    desc: "Evaluate some javascript code",
    execute: (ctx, args) => {
      let rtobj = {}
      try {
        rtobj.stdout = eval(args.join(' '))
        rtobj.code = returncode.OK
      } catch (err) {
        rtobj.stdout = ctx.color.red(err.stack);
        rtobj.code = returncode.ERROR
      }

      return rtobj
    }
  }