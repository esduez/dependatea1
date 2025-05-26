import TeaSDK from '@tea/sdk';
import config from '../config';

class TeaIntegration {
  constructor() {
    this.client = new TeaSDK({
      endpoint: config.tea.endpoint,
      authToken: config.tea.apiKey
    });
  }

  async installPackage(pkgName, version = 'latest') {
    try {
      const result = await this.client.packages.install({
        name: pkgName,
        version
      });
      return result;
    } catch (error) {
      throw new Error(`TEA installation failed: ${error.message}`);
    }
  }
}

export default TeaIntegration;
