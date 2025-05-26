const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');
const TeaManager = require('../tea/config');

class DependencyManager {
  constructor() {
    this.tea = new TeaManager();
  }

  async install(packages, options = {}) {
    if (this.tea.enabled) {
      await execa('tea', ['install', ...packages]);
    }
    await this.updatePackageJson(packages);
  }

  async list() {
    const { stdout } = await execa('tea', ['list']);
    return stdout;
  }

  async update(packageName) {
    await execa('tea', ['update', packageName]);
  }

  async updatePackageJson(packages) {
    const pkgPath = path.resolve('package.json');
    if (!await fs.pathExists(pkgPath)) return;
    
    const pkg = await fs.readJson(pkgPath);
    pkg.dependencies = pkg.dependencies || {};
    packages.forEach(pkgName => {
      pkg.dependencies[pkgName] = '^latest';
    });
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  }
}

module.exports = DependencyManager;
