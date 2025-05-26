const chalk = require('chalk');

module.exports = {
  info(message) {
    console.log(chalk.blue(message));
  },
  error(message) {
    console.error(chalk.red(message));
  },
  success(message) {
    console.log(chalk.green(message));
  }
};
