import { returncode } from "../libraries/rcodeapi";
import "colors";

module.exports = {
    name: "eval",
    desc: "Evaluate some javascript code",
    execute: (ctx, args) => {
      let rtobj = {}
      try {
        rtobj["stdout"] = eval(args.join(' '))
        rtobj["code"] = returncode.OK
      } catch (err) {
        rtobj["stdout"] = (err.stack as string).red;
        rtobj["code"] = returncode.ERROR
      }

      return rtobj
    }
  }