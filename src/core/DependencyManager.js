import TeaClient from '@tea/protocol';
import fs from 'fs-extra';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default class DependencyManager {
  static #instance;
  #teaClient;
  #config;

  constructor() {
    if (DependencyManager.#instance) {
      return DependencyManager.#instance;
    }
    
    this.#teaClient = new TeaClient();
    this.#config = this.#loadConfig();
    DependencyManager.#instance = this;
  }

  static async initialize() {
    if (!this.#instance) {
      this.#instance = new DependencyManager();
      await this.#instance.#teaClient.connect();
    }
    return this.#instance;
  }

  async install(packages, options = {}) {
    const results = [];
    
    for (const pkg of packages) {
      try {
        const result = await this.#teaClient.install(pkg, {
          global: options.global,
          dev: options.dev
        });
        results.push(result);
        
        if (!options.global) {
          await this.#updatePackageJson(pkg, options);
        }
      } catch (error) {
        throw new Error(`Failed to install ${pkg}: ${error.message}`);
      }
    }
    
    return results;
  }

  async #updatePackageJson(pkg, options) {
    const pkgPath = path.join(process.cwd(), 'package.json');
    
    if (!await fs.pathExists(pkgPath)) {
      return;
    }

    const pkgContent = await fs.readJson(pkgPath);
    const depType = options.dev ? 'devDependencies' : 'dependencies';
    
    pkgContent[depType] = pkgContent[depType] || {};
    pkgContent[depType][pkg] = '^latest';
    
    await fs.writeJson(pkgPath, pkgContent, { spaces: 2 });
  }

  #loadConfig() {
    const configPath = path.join(__dirname, '../../tea/config.yaml');
    
    try {
      return fs.existsSync(configPath) ? 
        yaml.parse(fs.readFileSync(configPath, 'utf8')) : 
        { cacheDir: './.tea_cache' };
    } catch (error) {
      console.warn('Invalid config file, using defaults');
      return {};
    }
  }
}
