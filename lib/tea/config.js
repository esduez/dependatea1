const fs = require('fs-extra');
const yaml = require('yaml');
const path = require('path');
const os = require('os');

class TeaConfig {
  constructor() {
    this.configPath = path.join(os.homedir(), '.tea/config.yaml');
    this.config = this._loadConfig();
  }

  _loadConfig() {
    const defaults = {
      enabled: true,
      registry: 'https://registry.tea.xyz',
      cache_dir: path.join(os.homedir(), '.tea_cache')
    };

    try {
      return fs.existsSync(this.configPath) ? 
        { ...defaults, ...yaml.parse(fs.readFileSync(this.configPath)) } : 
        defaults;
    } catch (error) {
      console.error('Config hatası:', error.message);
      return defaults;
    }
  }
}

module.exports = TeaConfig;
