const ora = require('ora');
const chalk = require('chalk');
const DependencyManager = require('../managers/dependency');
const TeaManager = require('../tea/config');

module.exports = async function install(packages, options) {
  const spinner = ora('Bağımlılıklar yükleniyor...').start();
  const teaConfig = new TeaManager();
  const depManager = new DependencyManager(teaConfig);

  try {
    await depManager.install(packages, options);
    spinner.succeed(chalk.green('Bağımlılıklar başarıyla yüklendi!'));
  } catch (error) {
    spinner.fail(chalk.red('Yükleme başarısız'));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
};
