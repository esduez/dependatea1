const fs = require('fs-extra');
const path = require('path');
const yaml = require('yaml');
const { EventEmitter } = require('events');

class TeaConfig extends EventEmitter {
  constructor() {
    super();
    this.configPath = path.resolve(__dirname, '../../tea/config.yaml');
    this.config = this._loadConfig();
  }

  get isEnabled() {
    return this.config.enabled !== false;
  }

  get registry() {
    return this.config.registry || 'https://registry.tea.xyz';
  }

  _loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        const fileContent = fs.readFileSync(this.configPath, 'utf8');
        return yaml.parse(fileContent) || {};
      }
      return { enabled: true };
    } catch (error) {
      this.emit('error', `Config load failed: ${error.message}`);
      return { enabled: false };
    }
  }

  async updateConfig(newConfig) {
    try {
      this.config = { ...this.config, ...newConfig };
      await fs.ensureDir(path.dirname(this.configPath));
      await fs.writeFile(this.configPath, yaml.stringify(this.config));
      this.emit('updated', this.config);
      return true;
    } catch (error) {
      this.emit('error', `Config update failed: ${error.message}`);
      return false;
    }
  }
}

module.exports = TeaConfig;
