module.exports = {
    name: "exit",
    desc: "exit() current shell.",
    execute: (ctx) => {
      ctx.events.emit("exitShell", ctx)
    }
}