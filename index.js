Array.prototype.remove = function() {
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
const rootpath  = "./rootfs/"

const defaultfiles_etc = ["users.json", "groups.json"]
defaultfiles_etc.forEach(item => {
  if (!fs.existsSync(rootpath + "etc/" + item)) {
    fs.copyFileSync(rootpath + "etc/defaults/" + item, rootpath + "etc/" + item, fs.constants.COPYFILE_EXCL)
  }
})

const users = require(rootpath + 'etc/users.json'); 
const groups = require(rootpath + 'etc/groups.json')

let context = { // Pass an object with essential information
  "user": "",
  "users": users,
  "groups": groups,
  "path": "",
  "rl": undefined,
  "color": c,
  "commands": {},
  "env": {},
  "events": new EventEmitter(),
  "os": {
    "distribution": "jsys_base",
    "version": "0.22.0-cc"
  }
}

let commands = context.commands;
let cmddir = fs.readdirSync(rootpath + "./commands")

cmddir.forEach(element => {
  let cmd = require(rootpath + "./commands/" + element)
  commands[cmd.name] = cmd
});

commands["login"].execute(context)
