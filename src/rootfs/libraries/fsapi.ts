import * as fs from "fs"
export const version = "0.19.0"
export const description = "fsapi.js, written by keli5 for JSys to work with the emulated filesystem. version " + version

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

export function ePath(path: string) {
    return path.replace(rootpath, "")
}

export function expandPath(ctx, path: string, trailingSlash: boolean = true) {
    let newpath: string = ""
    path = path.replace("~", "/home/" + ctx.user)
    if (path.startsWith("/")) {
        newpath = path
    } else {
        newpath = ctx.path + path
    }
    if (trailingSlash) {
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

export function exists (path: string) {
    return fs.existsSync(_absolutePath(path))
}

export function write (path: string, data, encoding: BufferEncoding = "utf8") {
    return fs.writeFileSync(_absolutePath(path), data, {
        encoding: encoding
    })
}

export function read (path: string, encoding: BufferEncoding = "utf8") {
    return fs.readFileSync(_absolutePath(path), {
        encoding: encoding
    })
}

// Shorthand for listing directory contents
export function readdir (path: string) {
    return fs.readdirSync(_absolutePath(path))
}

export function getstat (path: string) {
    return fs.statSync(_absolutePath(path))
}

export function isDir(path: string) {
    return fs.statSync(_absolutePath(path)).isDirectory()
}

export function isBlock (path: string) {
    return fs.statSync(_absolutePath(path)).isBlockDevice()
}

export function isFile (path: string) {
    return fs.statSync(_absolutePath(path)).isFile()
}

export function copy (src: string, dest: string) {
    return fs.cpSync(_absolutePath(src), _absolutePath(dest), {
        recursive: true
    })
}

export function remove (path: string) {
    return fs.rmSync(path, {
        recursive: true,
        force: true
    })
}

export function move (src: string, dest: string) {
    return fs.renameSync(_absolutePath(src), _absolutePath(dest))
}

export function mkdir (path: string) {
    return fs.mkdirSync(_absolutePath(path))
}

