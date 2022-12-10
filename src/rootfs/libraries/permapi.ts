const userapi = require("../libraries/userapi")
exports.version = "0.1.2"
exports.description = "permapi.js, written by keli5 for JSys as a way to work with system permissions. version " + exports.version

/**
 * Get a user's permissions (user + group) as an array.
 * @param {object} ctx Context object
 * @param {string} user Username to get permissions for
 * @returns {array} Array of user permissions
 */
exports.getPermissions = function (ctx, user) {
    let perms = []
    user = ctx.users[user] // ctx.users is the users file
    let groups = user["groups"]
    perms.push(...user["permissions"]) // add user permissions
    console.log(perms)
    groups.forEach(group => { // for each group,
        group = ctx.groups[group] 
        perms.push(...group?.permissions || "") // add group permissions ( or none if user has a bad group )
    });
    perms = [...new Set(perms)] // deduplicate
    return perms
}