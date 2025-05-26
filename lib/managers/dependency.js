const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');

class DependencyManager {
  constructor() {
    this.teaConfig = { enabled: true };
  }

  async install(packages) {
    if (!Array.isArray(packages)) {
      throw new Error('Packages must be an array');
    }

    // TEA ile yükleme
    if (this.teaConfig.enabled) {
      await this._installWithTea(packages);
    }

    // package.json güncelleme
    await this._updatePackageJson(packages);
  }

  async _installWithTea(packages) {
    try {
      await execa('tea', ['install', ...packages], { stdio: 'inherit' });
    } catch (error) {
      throw new Error(`TEA installation failed: ${error.stderr}`);
    }
  }

  async _updatePackageJson(packages) {
    const pkgPath = path.join(process.cwd(), 'package.json');
    if (!await fs.pathExists(pkgPath)) return;

    const pkg = await fs.readJson(pkgPath);
    pkg.dependencies = pkg.dependencies || {};
    
    packages.forEach(pkg => {
      pkg.dependencies[pkg] = '^latest';
    });

    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  }
}

module.exports = DependencyManager;
