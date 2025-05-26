# DependaTEA

TEA entegreli gelişmiş bağımlılık yöneticisi

## Özellikler

- TEA ve NPM entegrasyonu
- Çoklu paket yönetimi
- Global ve yerel bağımlılık desteği
- Detaylı listeleme özelliği
- Otomatik package.json güncelleme

## Kurulum

```bash
npm install -g dependatea
```

## Kullanım

### Paket Yükleme
```bash
dependatea install lodash express
dependatea install eslint --dev
dependatea install http-server --global
```

### Bağımlılıkları Listeleme
```bash
dependatea list
dependatea list --global
```

### Paket Güncelleme
```bash
dependatea update lodash
dependatea update
```

## Geliştirme

```bash
# Bağımlılıkları yükle
npm install

# Testleri çalıştır
npm test

# Lint kontrolü
npm run lint
```

## Yapılandırma

`tea/config.yaml` dosyasını düzenleyerek TEA ayarlarını değiştirebilirsiniz.
