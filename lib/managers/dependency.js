const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');
const semver = require('semver');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

class DependencyManager {
  constructor(teaConfig) {
    this.teaConfig = teaConfig;
  }

  async install(packages, options = {}) {
    // TEA üzerinden yükleme
    if (this.teaConfig.isEnabled) {
      await this._installWithTea(packages, options.global);
    }

    // Yerel package.json güncelleme
    if (!options.global) {
      await this._updatePackageJson(packages, options.dev);
    }
  }

  async list(options = {}) {
    const [projectDeps, globalDeps, teaDeps] = await Promise.all([
      this._getProjectDependencies(),
      options.global ? this._getGlobalDependencies() : Promise.resolve({}),
      this._getTeaDependencies()
    ]);

    return {
      project: projectDeps,
      global: globalDeps,
      tea: teaDeps
    };
  }

  async _installWithTea(packages, global = false) {
    const args = ['install', ...packages];
    if (global) args.push('--global');
    
    await execa('tea', args, { stdio: 'inherit' });
  }

  async _updatePackageJson(packages, isDev = false) {
    const pkgPath = path.join(process.cwd(), 'package.json');
    
    if (!await fs.pathExists(pkgPath)) {
      return;
    }

    const pkg = JSON.parse(await readFile(pkgPath, 'utf8'));
    const depKey = isDev ? 'devDependencies' : 'dependencies';
    
    pkg[depKey] = pkg[depKey] || {};
    
    for (const pkgName of packages) {
      pkg[depKey][pkgName] = '^latest';
    }

    await writeFile(pkgPath, JSON.stringify(pkg, null, 2));
  }

  async _getProjectDependencies() {
    const pkgPath = path.join(process.cwd(), 'package.json');
    
    if (!await fs.pathExists(pkgPath)) {
      return {};
    }

    const pkg = JSON.parse(await readFile(pkgPath, 'utf8'));
    return {
      dependencies: pkg.dependencies || {},
      devDependencies: pkg.devDependencies || {}
    };
  }

  async _getGlobalDependencies() {
    const { stdout } = await execa('npm', ['list', '-g', '--depth=0', '--json']);
    return JSON.parse(stdout).dependencies || {};
  }

  async _getTeaDependencies() {
    const { stdout } = await execa('tea', ['list', '--json']);
    return JSON.parse(stdout);
  }
}

module.exports = DependencyManager;
