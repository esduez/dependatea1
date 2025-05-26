const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');
const semver = require('semver');
const { tea } = require('..');
const logger = require('../utils/logger');
const validator = require('../utils/validator');

class DependencyManager {
  constructor() {
    this.teaConfig = tea.config;
  }

  async install(packages, options = {}) {
    if (!packages || !packages.length) {
      throw new Error('No packages specified for installation');
    }

    // Validate package names
    packages.forEach(pkg => {
      if (!validator.isValidPackageName(pkg)) {
        throw new Error(`Invalid package name: ${pkg}`);
      }
    });

    // Tea installation
    if (this.teaConfig.enabled) {
      await this._installWithTea(packages, options);
    }

    // Local package.json update
    if (!options.global) {
      await this._updatePackageJson(packages, options);
    }
  }

  async _installWithTea(packages, options) {
    const args = ['install', ...packages];
    if (options.global) args.push('--global');
    if (options.dev) args.push('--dev');
    
    try {
      const { stdout } = await execa('tea', args);
      logger.debug(`TEA output: ${stdout}`);
      return stdout;
    } catch (error) {
      throw new Error(`TEA installation failed: ${error.stderr || error.message}`);
    }
  }

  async _updatePackageJson(packages, options) {
    const pkgPath = path.resolve(process.cwd(), 'package.json');
    if (!await fs.pathExists(pkgPath)) {
      logger.warn('No package.json found in current directory');
      return;
    }

    const pkg = await fs.readJson(pkgPath);
    const depType = options.dev ? 'devDependencies' : 'dependencies';
    pkg[depType] = pkg[depType] || {};

    packages.forEach(pkgName => {
      pkg[depType][pkgName] = options.exact ? this._getExactVersion() : '^latest';
    });

    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    logger.info(`Updated package.json with ${packages.length} dependencies`);
  }

  _getExactVersion() {
    return new Date().toISOString().split('T')[0].replace(/-/g, '.');
  }
}

module.exports = DependencyManager;
