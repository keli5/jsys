module.exports = {
  name: 'nologin',
  desc: '',
  execute: (ctx) => {
    if (ctx.env["SHELL"]) {
      return {
        stdout: "nologin cannot be run manually",
        code: 1
      }
    } else {
      console.log("\nthis user cannot be logged into interactively")
      ctx.commands["login"].execute(ctx)
    }
  }
}