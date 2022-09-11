exports.version = "0.2.0"
exports.description = "argparseapi, written by keli5 for JSys to parse command line arguments. version " + exports.version
const shortSwitchRegex = /^-.$/gm

/**
 * Returns short switches e.g. one hyphen, one character.
 * @param {array} args Args array passed into any command
 * @returns {array} Array of short switches
 */

exports.specifiedShortSwitches = (args) => {
    let switches = []
    args.forEach((arg) => {
        if (arg.match(shortSwitchRegex)) {
            switches.push(arg)
        }
    })
    return switches
}