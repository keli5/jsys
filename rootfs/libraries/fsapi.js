let fs = require("fs")

exports.version = "0.1.0"
exports.description = "fsapi.js, written by keli5 for JSys to work with the emulated filesystem. version " + exports.version

const rootpath = process.cwd() + "/rootfs/" // This assumes that cwd contains the rootfs folder.

/**
 * Returns absolute host path to emulated FS path.
 * @private
 * @param {string} path Emulated fs path
 * @returns {string} Absolute system path
 */
function _absolutePath(path) {
    return rootpath + path
}

exports.exists = (path) => {
    return fs.existsSync(_absolutePath(path))
}

exports.open = (path) => {
    fs.open(_absolutePath(path), (err, fd) => {
        if (err) {
            throw err;
        }
        return fd
    })
}

exports.write = (fd, data, position = 0, encoding = "utf8") => {
    return fs.writeSync(fd, String(data), position, encoding)
}

exports.read = (pathOrFd, encoding = "utf8") => {
    return fs.readFileSync()
}


