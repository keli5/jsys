/* eslint-disable no-unused-vars */

import color from "colors/safe";

module.exports = {
    name: "setprompt",
    desc: "Set djsh prompt to a JS template string. Exposes color, user, path variables.",
    arguments: true,
    execute: (ctx, args) => {
      let path = ctx.path
      let user = ctx.user
      let newprompt = args.join(" ")
      ctx.rl.setPrompt(eval(`\`${newprompt} \``))
    },
}