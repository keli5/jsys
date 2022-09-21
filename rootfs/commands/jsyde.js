const express = require("express")
const { parseArgs } = require("util")

module.exports = {
    name: "jsyde",
    desc: "JSys Desktop Environment",
    execute: (ctx, args) => {
        const appdata = "../etc/jsyde"
        const pagedir = "../rootfs/etc/jsyde/page" // son of a bitch
        let cleanedArgs = args
        let {values, _, tokens} = parseArgs({ // eslint-disable-line no-unused-vars
            args: args,
            allowPositionals: true,
            strict: false,
            tokens: true,
            options: {
                "port": {
                    type: "string",
                    short: "p",
                },
            }
        })
        Object.values(tokens).forEach(item => {
            cleanedArgs = cleanedArgs.filter(e => e !== item["rawName"])
        })
        let port = values?.port || 50105
        port = Number(port)
        const app = express()
        app.set('view engine', 'ejs');

        app.get("/", (req, res) => {
            res.render(pagedir + "/root.ejs", {
                "context": ctx
            })
        })

        app.listen(port)
        console.log("jsyde listening on " + port)
    }
}