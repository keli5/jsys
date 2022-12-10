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

const rl = readline.createInterface({
  input:  process.stdin,
  output: process.stdout,
  terminal: true
});

rl._writeToOutput = function _writeToOutput(stringToWrite) {
  if (rl.stdoutMuted)
    rl.output.write("*");
  else
    rl.output.write(stringToWrite);
};

let context = { // Pass an object with essential information
  "user": "",
  "users": users,
  "groups": groups,
  "path": "",
  "rl": rl,
  "color": c,
  "commands": {},
  "env": {},
  "events": new EventEmitter(),
  "os": {
    "distribution": "jsys_base",
    "version": "0.15.0"
  }
}

let commands = context.commands;
let cmddir = fs.readdirSync(rootpath + "./commands")

cmddir.forEach(element => {
  let cmd = require(rootpath + "./commands/" + element)
  commands[cmd.name] = cmd
});

commands["login"].execute(context)
