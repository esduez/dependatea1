#!/usr/bin/env node

const { program } = require('commander');
const { version } = require('../package.json');
const { install, list, update } = require('../lib/commands');

program
  .name('dependatea1')
  .version(version)
  .description('TEA entegreli bağımlılık yöneticisi - Gelişmiş Sürüm');

program
  .command('install <packages...>')
  .description('Bir veya daha fazla paket yükle')
  .option('-D, --dev', 'Geliştirme bağımlılığı olarak ekle')
  .option('-g, --global', 'Global olarak yükle')
  .action(install);

program
  .command('list')
  .description('Yüklü bağımlılıkları listele')
  .option('-g, --global', 'Global bağımlılıkları listele')
  .action(list);

program
  .command('update [package]')
  .description('Paket(ler)i güncelle')
  .action(update);

program.parse(process.argv);
