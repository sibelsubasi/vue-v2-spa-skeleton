import Vue from 'vue';

import VueMask from 'v-mask'
Vue.use(VueMask, {
    placeholders: {
        'T' : /[a-zA-Z ğüşöçıİĞÜŞÖÇ]/,
        'M':  /[a-zA-Z ğüşöçıİĞÜŞÖÇ0-9]/,
        // '#': null,       // passing `null` removes default placeholder, so `#` is treated as character
        // D: /\d/,         // define new placeholder
        // Я: /[\wа-яА-Я]/, // cyrillic letter as a placeholder
    }
});

