const readline = require('readline');
const c = require('colors/safe');
const fs = require('fs');
const rootpath  = "./rootfs/"

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
  "env": {}
}

let commands = context.commands;
let cmddir = fs.readdirSync(rootpath + "./commands")

cmddir.forEach(element => {
  let cmd = require(rootpath + "./commands/" + element)
  commands[cmd.name] = cmd
});

commands["login"].execute(context)
