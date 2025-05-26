import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  tea: {
    enabled: true,
    endpoint: process.env.TEA_ENDPOINT || 'https://api.tea.xyz/v1',
    apiKey: process.env.TEA_API_KEY,
    cacheDir: path.join(__dirname, '../../.tea-cache')
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'dependatea.log'
  }
};
