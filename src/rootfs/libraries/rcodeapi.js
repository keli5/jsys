// OK will always be 0, ERROR will always be 1. For consistency
exports.version = "0.10.0"
exports.description = "rcodeapi.js, written by keli5 for JSys to work with program return codes. version " + exports.version

exports.returncode = Object.freeze({
    OK: Symbol(0),
    ERROR: Symbol(1),
    ERROR_INVOCATION: Symbol(2),
    ERROR_NOT_DIR: Symbol(3),
    ERROR_NOT_FILE: Symbol(4),
    ERROR_NOT_IMPLEMENTED: Symbol(5),
    ERROR_MISSING_ARGUMENT: Symbol(6),
    ERROR_ALREADY_EXISTS: Symbol(7),
    ERROR_INSUFFICIENT_PERMISSIONS: Symbol(8),
    ERROR_INVALID_ARGUMENT: Symbol(9)
})