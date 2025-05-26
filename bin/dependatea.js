#!/usr/bin/env node
const { program } = require('commander');
const { execSync } = require('child_process');
const { version } = require('../package.json');
const { install, list, update } = require('../lib/commands');

// TEA PATH kontrolü
try {
  execSync('which tea', { stdio: 'ignore' });
} catch {
  console.error('Hata: TEA CLI kurulu değil. Kurulum için:');
  console.log('sh <(curl https://tea.xyz)');
  process.exit(1);
}

program
  .name('dependatea')
  .version(version)
  .description('TEA-entegreli bağımlılık yöneticisi')
  .showHelpAfterError();

// Komutlar
program.command('install <packages...>')
  .description('Paket yükle')
  .action(install);

program.command('list')
  .description('Yüklü paketleri listele')
  .action(list);

program.command('update [package]')
  .description('Paket güncelle')
  .action(update);

program.parse();
