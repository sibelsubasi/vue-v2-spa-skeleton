import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n);

import tr from "./../i18n/tr";
import en from "./../i18n/en";

import moment from "moment";


const GLOBAL_LOCALE = 'tr'; //todo: profile

const dateTimeFormats = {
    'en-US': {
        short: {
            year: 'numeric', month: 'short', day: 'numeric'
        },
        long: {
            year: 'numeric', month: 'short', day: 'numeric',
            weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: true
        }
    },
    'tr-TR': {
        short: {
            year: 'numeric', month: 'short', day: 'numeric'
        },
        long: {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
        }
    }
}

const messages = {
    tr, en
}

moment.locale(GLOBAL_LOCALE);

// console.log("messages loaded: ");
// console.log(messages);

// Create VueI18n instance with options
export default new VueI18n({
    locale: GLOBAL_LOCALE, // set locale
    fallbackLocale: GLOBAL_LOCALE,
    messages, // set locale messages
    dateTimeFormats
})

