#!/usr/bin/env node

const { program } = require('commander');
const { version } = require('../package.json');
const commands = require('../lib/commands');

program
  .name('dependatea')
  .version(version)
  .description('TEA entegreli gelişmiş bağımlılık yöneticisi');

// Install komutu
program
  .command('install <packages...>')
  .description('Bir veya daha fazla paket yükle')
  .option('-D, --dev', 'Geliştirme bağımlılığı olarak ekle')
  .option('-g, --global', 'Global olarak yükle')
  .action(commands.install);

// List komutu
program
  .command('list')
  .description('Yüklü bağımlılıkları listele')
  .option('-g, --global', 'Global bağımlılıkları listele')
  .action(commands.list);

// Update komutu
program
  .command('update [package]')
  .description('Paket(ler)i güncelle')
  .action(commands.update);

program.parse(process.argv);
