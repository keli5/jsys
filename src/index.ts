global.arrayRemove = function(what: any) {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
      what = a[--L];
      while ((ax = this.indexOf(what)) !== -1) {
          this.splice(ax, 1);
      }
  }
  return this;
};

import EventEmitter from "events";
import readline from "readline";
import "colors";
import fs from "fs";
const rootpath  = "./src/rootfs/"
const requirerootpath = "./rootfs/"

const defaultfiles_etc = ["users.json", "groups.json"]
defaultfiles_etc.forEach(item => {
  if (!fs.existsSync(rootpath + "etc/" + item)) {
    fs.copyFileSync(rootpath + "etc/defaults/" + item, rootpath + "etc/" + item, fs.constants.COPYFILE_EXCL)
  }
})

const users = import(requirerootpath + 'etc/users.json'); 
const groups = import(requirerootpath + 'etc/groups.json'); // ZAZA!!!!

const rl = readline.createInterface({
  input:  process.stdin,
  output: process.stdout,
  terminal: true
});

let context = { // Pass an object with essential information
  "user": "",
  "users": users,
  "groups": groups,
  "path": "",
  "rl": rl,
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
  import("./commands/" + element).then(cmd => {
    commands[cmd.name] = cmd
  })
})

commands["login"].execute(context)
