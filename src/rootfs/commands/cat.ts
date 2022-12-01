import { expandPath, isFile, read } from "../libraries/fsapi";
import { returncode } from "../libraries/rcodeapi";

module.exports = {
    name: "cat",
    desc: "Read contents of a file.",
    execute: (ctx, args) => {
        let file = args[0]
        if (!file) {
            return {
                code: returncode.ERROR_MISSING_ARGUMENT
            }
        }
        file = expandPath(ctx, file, false)

        if (isFile(file)) {
            return {
                stdout: read(file),
                code: returncode.OK
            }
        } else {
            return {
                code: returncode.ERROR_NOT_FILE
            }
        }
    }
}