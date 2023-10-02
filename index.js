Array.prototype.remove = function () {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

const EventEmitter = require("events")
const readline = require('readline');
const c = require('colors/safe');
const fs = require('fs');
const rootpath = "./rootfs/"
const version = require('child_process').execSync('git rev-parse --short HEAD').toString().trim()

const unlinkTmpDir = () => {
  if (fs.existsSync(rootpath + "./tmp")) {
    fs.rmSync(rootpath + "./tmp", { recursive: true, force: true });
  }
}

unlinkTmpDir();
fs.mkdirSync(rootpath + "./tmp")

const defaultfiles_etc = ["users.json", "groups.json"]
defaultfiles_etc.forEach(item => {
  if (!fs.existsSync(rootpath + "etc/" + item)) {
    fs.copyFileSync(rootpath + "etc/defaults/" + item, rootpath + "etc/" + item, fs.constants.COPYFILE_EXCL)
  }
})

function getUsers() {
  delete require.cache[require.resolve(rootpath + 'etc/users.json')];
  return require(rootpath + 'etc/users.json');
}

function getGroups() {
  delete require.cache[require.resolve(rootpath + 'etc/groups.json')];
  return require(rootpath + 'etc/groups.json');
}

let context = { // Pass an object with essential information
  "user": "",
  "users": getUsers(),
  "groups": getGroups(),
  "getUsers": getUsers,
  "getGroups": getGroups,
  "path": "",
  "rl": undefined,
  "color": c,
  "commands": {},
  "env": {},
  "events": new EventEmitter(),
  "os": {
    "distribution": "jsys_base",
    "version": version
  }
}

let commands = context.commands;
let cmddir = fs.readdirSync(rootpath + "./commands")

cmddir.forEach(element => {
  let cmd = require(rootpath + "./commands/" + element)
  commands[cmd.name] = cmd
  if (!commands[cmd.name].help) {
    commands[cmd.name].help = () => {
      console.log(cmd.name + ":", cmd.desc)
      console.log("usage:", cmd.name, cmd.usage)
    }
  }
});

process.on("exit", unlinkTmpDir)

commands["login"].execute(context)
