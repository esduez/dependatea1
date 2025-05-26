#!/usr/bin/env node
const { program } = require('commander');
const { execSync } = require('child_process');
const { version } = require('../package.json');

// TEA PATH kontrolü eklenmiş hali
try {
  execSync('which tea', { stdio: 'ignore' });
} catch {
  console.error('Hata: TEA CLI kurulu değil. Önce şunu çalıştırın:');
  console.log('sh <(curl https://tea.xyz)');
  process.exit(1);
}

program
  .name('dependatea')
  .version(version)
  .description('TEA-entegreli bağımlılık yöneticisi');

// ...diğer komut tanımları
