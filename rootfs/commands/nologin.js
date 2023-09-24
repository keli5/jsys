module.exports = {
    name: 'nologin',
    desc: '',
    execute: (ctx) => {
      return {
        "stdout": "this user cannot be logged into interactively",
        "code": 1
      }
    }
}