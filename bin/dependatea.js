#!/usr/bin/env node
const { program } = require('commander');
const { version } = require('../package.json');
const commands = require('../lib/commands');

program
  .name('dependatea')
  .version(version)
  .description('TEA-integrated dependency manager');

program
  .command('install <packages...>')
  .description('Install packages')
  .action(commands.install);

program
  .command('list')
  .description('List dependencies')
  .action(commands.list);

program
  .command('update [package]')
  .description('Update package')
  .action(commands.update);

program.parse(process.argv);
