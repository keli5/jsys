import * as fs from "fs"

exports.version = "0.19.0"
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

exports.ePath = (path: string) => {
    return path.replace(rootpath, "")
}

exports.expandPath = (ctx, path: string, ts = true) => {
    let newpath = ""
    path = path.replace("~", "/home/" + ctx.user)
    if (path.startsWith("/")) {
        newpath = path
    } else {
        newpath = ctx.path + path
    }
    if (ts) {
        if (!newpath.endsWith("/")) {
            newpath += "/"
        }
    } else {
        if (newpath.endsWith("/")) {
            newpath = newpath.slice(0, -1)
        }
    }
    return newpath
}

exports.exists = (path: string) => {
    return fs.existsSync(_absolutePath(path))
}

exports.write = (path: string, data, encoding: BufferEncoding = "utf8") => {
    return fs.writeFileSync(_absolutePath(path), data, {
        encoding: encoding
    })
}

exports.read = (path: string, encoding: BufferEncoding = "utf8") => {
    return fs.readFileSync(_absolutePath(path), {
        encoding: encoding
    })
}

// Shorthand for listing directory contents
exports.readdir = (path: string) => {
    return fs.readdirSync(_absolutePath(path))
}

exports.getstat = (path: string) => {
    return fs.statSync(_absolutePath(path))
}

exports.isDir = (path: string) => {
    return fs.statSync(_absolutePath(path)).isDirectory()
}

exports.isBlock = (path: string) => {
    return fs.statSync(_absolutePath(path)).isBlockDevice()
}

exports.isFile = (path: string) => {
    return fs.statSync(_absolutePath(path)).isFile()
}

exports.copy = (src: string, dest: string) => {
    return fs.cpSync(_absolutePath(src), _absolutePath(dest), {
        recursive: true
    })
}

exports.remove = (path: string) => {
    return fs.rmSync(path, {
        recursive: true,
        force: true
    })
}

exports.move = (src: string, dest: string) => {
    return fs.renameSync(_absolutePath(src), _absolutePath(dest))
}

exports.mkdir = (path: string) => {
    return fs.mkdirSync(_absolutePath(path))
}

