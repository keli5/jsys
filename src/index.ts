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
import * as readline from "readline" ;
import * as c from "colors";
import * as fs from "fs";

const rootpath  = "./src/rootfs/"
const requirerootpath = "./rootfs/"

const defaultfiles_etc = ["users.json", "groups.json"]
defaultfiles_etc.forEach(item => {
  if (!fs.existsSync(rootpath + "etc/" + item)) {
    fs.copyFileSync(rootpath + "etc/defaults/" + item, rootpath + "etc/" + item, fs.constants.COPYFILE_EXCL)
  }
})

const users = import(requirerootpath + 'etc/users.json'); 
const groups = import(requirerootpath + 'etc/groups.json')

const rl = readline.createInterface({
  input:  process.stdin,
  output: process.stdout,
  terminal: true
});

/* rl._writeToOutput = function _writeToOutput(stringToWrite) {
  if (rl.stdoutMuted)
    rl.output.write("*");
  else
    rl.output.write(stringToWrite);
}; */ // TODO: Reimplement this. 

let context = { // Pass an object with essential information and global functions. Some of these should be APIs instead -- colors & paths?
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

cmddir.forEach(cmd => {
  console.log("cmd: ", cmd)
  import(cmd).then(finished => {
    commands[finished.name] = finished
  })
})

commands["login"].execute(context)
