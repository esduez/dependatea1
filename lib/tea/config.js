const fs = require('fs-extra');
const yaml = require('yaml');
const path = require('path');

class TeaManager {
  constructor() {
    this.configPath = path.resolve(__dirname, '../../../tea/config.yaml');
    this.config = this._loadConfig();
  }

  get enabled() {
    return this.config.enabled !== false;
  }

  _loadConfig() {
    try {
      return fs.existsSync(this.configPath) ? 
        yaml.parse(fs.readFileSync(this.configPath, 'utf8')) : 
        { enabled: true };
    } catch (error) {
      return { enabled: false };
    }
  }
}

module.exports = TeaManager;
