const chalk = require('chalk');
const DependencyManager = require('../managers/dependency');
const TeaManager = require('../tea/config');

module.exports = async function list(options) {
  const teaConfig = new TeaManager();
  const depManager = new DependencyManager(teaConfig);

  try {
    const dependencies = await depManager.list(options);
    
    console.log(chalk.blue.bold('\nProje Bağımlılıkları:'));
    console.log(chalk.gray(JSON.stringify(dependencies.project, null, 2)));
    
    if (options.global) {
      console.log(chalk.blue.bold('\nGlobal Bağımlılıklar:'));
      console.log(chalk.gray(JSON.stringify(dependencies.global, null, 2)));
    }
    
    console.log(chalk.blue.bold('\nTEA Bağımlılıkları:'));
    console.log(chalk.gray(JSON.stringify(dependencies.tea, null, 2)));
  } catch (error) {
    console.error(chalk.red('Listeleme hatası:', error.message));
    process.exit(1);
  }
};
