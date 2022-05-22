import Vue from 'vue';
import i18n from './vue-i18n'
import Vuetify from 'vuetify/lib';
import getThemeSettings from "./get-theme-setting";

import '@mdi/font/css/materialdesignicons.css'
import 'font-awesome/css/font-awesome.min.css' // Ensure you are using css-loader

Vue.use(Vuetify);

import tr from 'vuetify/es5/locale/tr';
import en from 'vuetify/es5/locale/en';
export default new Vuetify({
    lang: {
        locales: {
            tr, en
        },
        current: i18n.locale
    },
    icons: {
        iconfont: 'mdi',
    },
    theme: {        
        themes: {
            // light: theme[process.env.VUE_APP_THEME] || theme.default
            light: getThemeSettings()
        }
    }
});
