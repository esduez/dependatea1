const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');
const validator = require('../utils/validator');

class DependencyManager {
  constructor() {
    this.teaConfig = { enabled: true };
  }

  async install(packages) {
    // Validasyon
    packages.forEach(pkg => {
      if (!validator.isValidPackageName(pkg)) {
        throw new Error(`Geçersiz paket adı: ${pkg}`);
      }
    });

    // TEA ile yükleme
    if (this.teaConfig.enabled) {
      await execa('tea', ['install', ...packages], { stdio: 'inherit' });
    }

    // package.json güncelleme
    await this._updatePackageJson(packages);
  }

  async _updatePackageJson(packages) {
    const pkgPath = path.join(process.cwd(), 'package.json');
    
    if (!await fs.pathExists(pkgPath)) {
      await fs.writeJson(pkgPath, {
        name: 'temp-project',
        version: '1.0.0',
        dependencies: {}
      });
    }

    const pkg = await fs.readJson(pkgPath);
    pkg.dependencies = pkg.dependencies || {};
    
    packages.forEach(pkgName => {
      pkg.dependencies[pkgName] = '^latest';
    });

    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  }
}

module.exports = DependencyManager;
