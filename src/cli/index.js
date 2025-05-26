#!/usr/bin/env node

import { Command } from 'commander';
import { createRequire } from 'module';
import figlet from 'figlet';
import chalk from 'chalk';
import DependencyManager from '../core/DependencyManager.js';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

console.log(
  chalk.green(
    figlet.textSync('DependaTEA', {
      font: 'Standard',
      horizontalLayout: 'full'
    })
  )
);

const program = new Command();

program
  .version(version)
  .description('TEA Protocol Integrated Dependency Manager')
  .hook('preAction', async () => {
    await DependencyManager.initialize();
  });

// Install Command
program
  .command('install <packages...>')
  .description('Install one or more packages')
  .option('-D, --dev', 'Install as dev dependency')
  .option('-g, --global', 'Install globally')
  .action(async (packages, options) => {
    try {
      await DependencyManager.install(packages, options);
    } catch (error) {
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

program.parse(process.argv);
