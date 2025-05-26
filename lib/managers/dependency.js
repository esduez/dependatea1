const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');
const semver = require('semver');
const TeaConfig = require('../tea/config');

class DependencyManager {
  constructor() {
    this.teaConfig = new TeaConfig();
    this.cache = new Map();
  }

  async install(packages, options = {}) {
    if (!packages.length) {
      throw new Error('No packages specified for installation');
    }

    // Validate package names
    packages.forEach(pkg => {
      if (!this._validatePackageName(pkg)) {
        throw new Error(`Invalid package name: ${pkg}`);
      }
    });

    // Tea installation
    if (this.teaConfig.isEnabled) {
      await this._teaInstall(packages, options);
    }

    // Local package.json update
    if (!options.global) {
      await this._updateLocalDependencies(packages, options);
    }
  }

  async _teaInstall(packages, options) {
    const args = ['install', ...packages];
    if (options.global) args.push('--global');
    if (options.dev) args.push('--dev');
    
    try {
      const { stdout } = await execa('tea', args);
      this.cache.set('last_install', { packages, output: stdout });
      return stdout;
    } catch (error) {
      throw new Error(`TEA installation failed: ${error.stderr || error.message}`);
    }
  }

  async _updateLocalDependencies(packages, options) {
    const pkgPath = path.resolve(process.cwd(), 'package.json');
    if (!await fs.pathExists(pkgPath)) return;

    const pkg = await fs.readJson(pkgPath);
    const depType = options.dev ? 'devDependencies' : 'dependencies';
    pkg[depType] = pkg[depType] || {};

    packages.forEach(pkgName => {
      pkg[depType][pkgName] = options.exact ? this._getExactVersion() : '^latest';
    });

    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  }

  _validatePackageName(pkg) {
    return /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(pkg);
  }

  _getExactVersion() {
    return new Date().toISOString().split('T')[0].replace(/-/g, '.');
  }
}

module.exports = DependencyManager;
