const { DependencyManager } = require('../managers');

module.exports = async function update(packageName) {
  const manager = new DependencyManager();
  await manager.update(packageName);
};
