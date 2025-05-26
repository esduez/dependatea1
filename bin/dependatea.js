#!/usr/bin/env node
const { program } = require('commander');
const { version } = require('../package.json');
const { install, list, update } = require('../lib/commands');

program
  .name('dependatea')
  .version(version)
  .description('TEA-integrated dependency manager');

program
  .command('install <packages...>')
  .description('Install packages')
  .option('-D, --dev', 'As dev dependency')
  .action(install);

program
  .command('list')
  .description('List dependencies')
  .action(list);

program
  .command('update [package]')
  .description('Update package')
  .action(update);

program.parse(process.argv);
