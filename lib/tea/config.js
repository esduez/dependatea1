const fs = require('fs-extra');
const path = require('path');
const yaml = require('yaml');

class TeaManager {
  constructor() {
    this.configPath = path.join(__dirname, '../../../tea/config.yaml');
    this.config = this._loadConfig();
  }

  get isEnabled() {
    return this.config.enabled !== false;
  }

  _loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        return yaml.parse(fs.readFileSync(this.configPath, 'utf8'));
      }
      return { enabled: true };
    } catch (error) {
      return { enabled: false };
    }
  }

  async saveConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    await fs.ensureFile(this.configPath);
    await fs.writeFile(this.configPath, yaml.stringify(this.config));
    return this.config;
  }
}

module.exports = TeaManager;
