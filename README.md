# VUE V2 SPA SKELETON

This template is made with Vue v2 which is ready for running up for new SPA projects.


## Kurulum

host dosyanıza aşağıdaki tanımlamayı yapınız.

```shell
127.0.0.1 vue-v2-spa-skeleton.test
```

Daha sonra apache vhost dosyanızda aşağıdaki tanımlamaları kendinize göre yapınız.

```apache
############# vue-v2-spa-skeleton #############
<VirtualHost *:80>
    ServerAdmin subasi.sibel@gmail.com
    DocumentRoot "C:\Projects\_others\test\vue-v2-spa-skeleton\spa\dist"
    ServerName vue-v2-spa-skeleton.test
    ServerAlias www.vue-v2-spa-skeleton.test
    ErrorLog "logs/vue-v2-spa-skeleton.test-error.log"
    CustomLog "logs/vue-v2-spa-skeleton.test-access.log" common
</VirtualHost>
```

### İlk Çalıştırma

Aşağıdaki komutları çalıştırın.

#### SPA

```shell
cd spa
yarn install
yarn serve [build]
```

#### Spa Build
yarn build komutu spa/dist dizinine .htaccess dosyası oluşturup aşağıdaki içeriği kopyalar.

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```
