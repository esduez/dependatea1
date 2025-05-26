#!/usr/bin/env node
const { program } = require('commander');
const { version } = require('../package.json');
const { install, list, update } = require('../lib/commands');

program
  .name('dependatea')
  .version(version)
  .description('TEA-integrated dependency manager')
  .showHelpAfterError();

// Install Command
program.command('install <packages...>')
  .description('Install packages')
  .action(install);

// List Command
program.command('list')
  .description('List dependencies')
  .action(list);

// Update Command
program.command('update [package]')
  .description('Update package')
  .action(update);

program.parse();
