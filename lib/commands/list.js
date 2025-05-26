const { DependencyManager } = require('../managers');

module.exports = async function list() {
  const manager = new DependencyManager();
  const dependencies = await manager.list();
  console.log(dependencies);
};
