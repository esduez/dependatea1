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
    await this._updatePackageJson(packages, options);
  }

  async _updatePackageJson(packages, options) {
    const pkgPath = path.resolve('package.json');
    if (!await fs.pathExists(pkgPath)) return;
    
    const pkg = await fs.readJson(pkgPath);
    const depType = options.dev ? 'devDependencies' : 'dependencies';
    pkg[depType] = pkg[depType] || {};
    
    packages.forEach(pkg => {
      pkg[depType][pkg] = '^latest';
    });
    
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  }
}

module.exports = DependencyManager;
