#!/usr/bin/env node

'use strict';

const { program } = require('commander');
const { version } = require('../package.json');
const logger = require('../lib/utils/logger');
const commands = require('../lib/commands');

// Initialize CLI
program
  .name('dependatea')
  .version(version)
  .description('TEA Protocol integrated dependency manager')
  .configureOutput({
    outputError: (err, write) => logger.error(err.replace('error: ', ''))
  });

// Install command
program
  .command('install <packages...>')
  .description('Install one or more packages')
  .option('-D, --dev', 'Install as dev dependency')
  .option('-g, --global', 'Install globally')
  .option('-E, --exact', 'Install exact version')
  .action(commands.install);

// List command
program
  .command('list')
  .description('List installed dependencies')
  .option('-g, --global', 'List global dependencies')
  .action(commands.list);

// Update command
program
  .command('update [package]')
  .description('Update package(s)')
  .option('-g, --global', 'Update global package')
  .action(commands.update);

// Handle unknown commands
program.on('command:*', () => {
  logger.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
  process.exit(1);
});

// Parse arguments
program.parseAsync(process.argv).catch(err => {
  logger.error(err.message);
  process.exit(1);
});
