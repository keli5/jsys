const express = require("express")

module.exports = {
    name: "jsyde",
    desc: "JSys Desktop Environment",
    execute: (ctx, args) => {
        const appdata = "../etc/jsyde"
        let cleanedArgs = args
        let {values, _, tokens} = parseArgs({ // eslint-disable-line no-unused-vars
            args: args,
            allowPositionals: true,
            strict: false,
            tokens: true,
            options: {
                "port": {
                    type: "number",
                    short: "p",
                },
            }
        })
        Object.values(tokens).forEach(item => {
            cleanedArgs = cleanedArgs.filter(e => e !== item["rawName"])
        })
        let port = values?.port || 50105
        const app = express()
    }
}