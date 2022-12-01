// OK will always be 0, ERROR will always be 1. For consistency
export const version = "0.10.0"
export const description = "rcodeapi.js, written by keli5 for JSys to work with program return codes. version " + version

export enum returncode {
    OK = 0,
    ERROR = 1, // MAKING SURE i guess
    ERROR_INVOCATION,
    ERROR_NOT_DIR,
    ERROR_NOT_FILE,
    ERROR_NOT_IMPLEMENTED,
    ERROR_MISSING_ARGUMENT,
    ERROR_ALREADY_EXISTS,
    ERROR_INSUFFICIENT_PERMISSIONS,
    ERROR_INVALID_ARGUMENT
}