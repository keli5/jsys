exports.version = "0.1.0"
exports.description = "userapi.ts, written by keli5 for JSys to work with users. version " + exports.version

type User = {
    name: string,
    permissions?: string[] | [""],
    password_hash?: string | "",
    uid: number,
    groups: number[],
    shell: string
}

function userFromDisk(ctx, user: string): User {
    let diskUser = ctx.users[user]

    let returnUser: User = {
        name: diskUser.name,
        permissions: diskUser.permissions || [],
        password_hash: diskUser.pwhashed || "",
        uid: diskUser.uid,
        groups: diskUser.groups,
        shell: diskUser.shell
    }
    return returnUser
}