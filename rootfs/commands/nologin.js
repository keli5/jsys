module.exports = {
    name: 'nologin',
    desc: '',
    execute: (ctx) => {
      console.log("\nthis user cannot be logged into interactively")
      ctx.commands["login"].execute(ctx)
    }
}