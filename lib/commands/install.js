const { DependencyManager } = require('../managers');
const ora = require('ora');
const chalk = require('chalk');

module.exports = async function install(packages) {
  const spinner = ora(chalk.blue(`Paketler yükleniyor: ${packages.join(', ')}`)).start();
  
  try {
    const manager = new DependencyManager();
    await manager.install(packages);
    spinner.succeed(chalk.green('Başarıyla yüklendi!'));
  } catch (error) {
    spinner.fail(chalk.red('Yükleme başarısız'));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
};
