#!/usr/bin/env node

var commander = require('commander');
var fs = require('fs');
var path = require('path');
var main = require('./lib/index');

var packageJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'));

commander
  .version(packageJSON.version)
  .usage('[options] <file ...>')
  .description(packageJSON.description)
  .option('-d, --delay [seconds]', 'delay before start recording (seconds)', parseInt)
  .option('-r, --rate [milliseconds]', 'capture frames rate (default: 700)', parseInt)
  .option('-c, --count [number]', 'total frames to capture (default : 15)', parseInt)
  .option('-q, --quality [number]', 'compression level for gif (default : 10)', parseInt)
  .option('-m, --measure', 'measure region and exit')
  .option('-o, --output [directory]', 'current directory by default')
  .option('-p, --pointer', 'Capture mouse cursor (default: no)')
  .option('-f, --fullscreen', '')
  .option('-s, --screenshot', '')
  .parse(process.argv);

commander.output = path.join(commander.output || process.cwd()) + '/';

if (commander.delay) {
  commander.delay = commander.delay * 1000;
} else {
  commander.delay = 0;
}

commander.rate = commander.rate || 700;
commander.count = commander.count || 15;
commander.quality = commander.quality || 10;

try {
  fs.lstatSync(commander.output).isDirectory();
} catch(e) {
  console.error('No such directory', commander.output);
  process.exit(1);
}

main(commander);
