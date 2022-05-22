import 'babel-polyfill'

if (process.env.VUE_APP_CONSOLE !== "true") {
  console.log = function() {};
  console.warn = function() {};
  console.error = function() {};
}

import Vue from 'vue'

import i18n from './plugins/vue-i18n'

import App from './app.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

import DatetimePicker from 'vuetify-datetime-picker'
//import CryptoJS from 'crypto-js'
Vue.use(DatetimePicker)


//
import './plugins/axios'
import './plugins/vmask'
import './plugins/vuetify-dialog'
import './plugins/worker';
import './plugins/register-components';
import './plugins/utils';
import './plugins/error-handler'
import './plugins/analytics'
import './plugins/identifier-verification'
//
import "./prototypes";
//
Vue.config.productionTip = false;
//

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
