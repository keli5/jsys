module.exports = {
    name: "shutdown",
    desc: "Shut down the system.",
    execute: (ctx) => {
      ctx.rl.close();
      ctx = null;
      process.exit(0);
    }
}