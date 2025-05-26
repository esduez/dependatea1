const { DependencyManager } = require('../managers');
const ora = require('ora');

module.exports = async function install(packages, options) {
  const spinner = ora('Installing packages...').start();
  try {
    const manager = new DependencyManager();
    await manager.install(packages, options);
    spinner.succeed('Packages installed!');
  } catch (error) {
    spinner.fail('Installation failed');
    console.error(error);
    process.exit(1);
  }
};
