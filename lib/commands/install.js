const ora = require('ora');
const chalk = require('chalk');
const { DependencyManager } = require('..');
const logger = require('../utils/logger');

module.exports = async function install(packages, options) {
  const spinner = ora({
    text: 'Installing packages...',
    color: 'blue'
  }).start();

  try {
    const manager = new DependencyManager();
    await manager.install(packages, options);
    
    spinner.succeed(chalk.green('Packages installed successfully!'));
    logger.info(`Installed: ${packages.join(', ')}`);
  } catch (error) {
    spinner.fail(chalk.red('Installation failed'));
    logger.error(error.message);
    process.exit(1);
  }
};
