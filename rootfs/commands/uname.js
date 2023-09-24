const { readdir, expandPath, isDir, ePath } = require("../libraries/fsapi")
const { returncode } = require("../libraries/rcodeapi")
const { parseArgs } = require("util") // stability 1 - i'm in danger lol

module.exports = {
    name: "uname",
    desc: "Print system information.",
    usage: "[OPTION]...",
    execute: (ctx, args) => {
        let {values, _, tokens} = parseArgs({ // eslint-disable-line no-unused-vars
            args: args,
            allowPositionals: true,
            strict: false,
            tokens: true,
            options: {
                "all": {
                    type: "boolean",
                    short: "a"
                },
                "os-name": {
                    type: "boolean",
                    short: "s"
                },
                "nodename": {
                    type: "boolean",
                    short: "n"
                },
                "os-version": {
                    type: "boolean",
                    short: "v",
                },
                "machine": {
                    type: "boolean",
                    short: "m"
                },
                "hardware-platform": {
                    type: "boolean",
                    short: "i"
                }
            }
        })
        let infostring = ""
        let os = require("os")
        if (values["os-name"] || values["all"])                 infostring += ctx.os.distribution + " "
        if (values["nodename"] || values["all"])                infostring += os.hostname() + " "
        if (values["os-version"] || values["all"])              infostring += ctx.os.version + " "
        if (values["machine"] || values["all"])                 infostring += os.machine() + " "
        if (values["hardware-platform"] || values["all"])       infostring += os.arch() + " "

        return {
            stdout: infostring,
            code: 0
        }
    },
    help: () => {
        console.log(module.exports.name + ":", module.exports.desc)
        console.log("usage:", module.exports.name, module.exports.usage)
        console.log("---")
        console.log("flags:")
        console.log("   --all / -a                      print all information, in the following order")
        console.log("   --os-name / -s                  print the os distribution name")
        console.log("   --nodename / -n                 print the system hostname")
        console.log("   --os-version / -v               print the operating system release")
        console.log("   --machine / -m                  print the machine hardware name")
        console.log("   --hardware-platform / -i        print the hardware platform (non-portable)")
        console.log("---")
    }
}