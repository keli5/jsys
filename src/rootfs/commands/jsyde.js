const express = require("express")
const { parseArgs } = require("util")
const fsapi = require("../libraries/fsapi")

module.exports = {
    name: "jsyde",
    desc: "JSys Desktop Environment",
    execute: (ctx, args) => {
        // first things first:
        initUserDataDirs(ctx.user)
        let theme = fsapi.read(`/home/${ctx.user}/.config/jsyde/themes/default.json`)
        theme = JSON.parse(theme)
        console.log(`Using theme ${theme.name}`)
        console.log(JSON.stringify(theme, null, 2))

        const appdata = "../etc/jsyde/"
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
                "context": ctx,
                "theme": JSON.stringify(theme)
            })
        })
        app.use(express.static("./rootfs/etc/jsyde/"))
        app.listen(port)
        console.log("jsyde listening on " + port)
    }
}

function initUserDataDirs(user) {
    try {
        fsapi.mkdir(`/home/${user}/.config`)
        fsapi.mkdir(`/home/${user}/.config/jsyde`)
        fsapi.mkdir(`/home/${user}/.config/jsyde/themes`)
    } catch {
        // already exists
    }
    if (!fsapi.exists(`/home/${user}/.config/jsyde/themes/default.json`)) {
        fsapi.copy("/etc/defaults/jsyde/themes/default.json", `/home/${user}/.config/jsyde/themes/default.json`)
    }
}