exports.version = "0.1.0"
exports.description = "rcodeapi.js, written by keli5 for JSys to work with program return codes. version " + exports.version

exports.returncode = Object.freeze({
    OK: Symbol(0),
    ERROR: Symbol(1),
    ERROR_INVOCATION: Symbol(2),
    ERROR_NOT_DIR: Symbol(3),
    ERROR_NOT_IMPLEMENTED: Symbol(4),
})