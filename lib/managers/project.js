const fs = require('fs-extra');
const path = require('path');

class ProjectManager {
  async getInfo() {
    const pkgPath = path.resolve('package.json');
    if (!await fs.pathExists(pkgPath)) return null;
    return fs.readJson(pkgPath);
  }
}

module.exports = ProjectManager;
