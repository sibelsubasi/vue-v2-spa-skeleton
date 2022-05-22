<template>
  <v-main>
    <v-container>
      <v-alert type="error">404 - Sayfa bulunamadı.</v-alert>
      <p>Bu sayfa mevcut değil.</p>
      <p>
        <small>Yanlış bir adres girmiş ya da kırık bir bağlantıyı takip etmiş olabilirsiniz.</small>
      </p>
      <v-btn text small @click="$router.go(-1)">
        <v-icon>arrow_back</v-icon>GERİ DÖN
      </v-btn>
      <v-btn text small href="/">
        <v-icon>home</v-icon>
        GİRİŞ SAYFASINI AÇ
      </v-btn>
    </v-container>
  </v-main>
</template>
<script>
if (window._paq) {
  window._paq.push(['setDocumentTitle',  '404/URL = ' +  encodeURIComponent(document.location.pathname+document.location.search) + '/From = ' + encodeURIComponent(document.referrer)]);
}
</script>