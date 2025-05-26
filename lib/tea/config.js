const fs = require('fs-extra');
const path = require('path');
const yaml = require('yaml');

class TeaConfig {
  constructor() {
    this.configPath = path.resolve(__dirname, '../../../tea/config.yaml');
    this.config = this.loadConfig();
  }

  get enabled() {
    return this.config.enabled !== false;
  }

  loadConfig() {
    try {
      return fs.existsSync(this.configPath) ? 
        yaml.parse(fs.readFileSync(this.configPath, 'utf8')) : 
        { enabled: true };
    } catch (error) {
      return { enabled: false };
    }
  }
}

module.exports = TeaConfig;
