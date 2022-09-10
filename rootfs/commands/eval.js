module.exports = {
    name: "eval",
    desc: "Evaluate some javascript code",
    execute: (ctx, args) => {
      let rtobj = {}
      try {
        rtobj.stdout = eval(args.join(' '))
        rtobj.code = 0
      } catch (err) {
        rtobj.stdout = ctx.color.red.bold(err.toString() + "\n\n" + err.stack);
        rtobj.code = 1
      }

      return rtobj
    }
  }