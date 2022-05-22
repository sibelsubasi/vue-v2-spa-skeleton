//https://github.com/yariksav/vuetify-dialog
import Vue from 'vue'
import i18n from './vue-i18n'
import vuetify from '@/plugins/vuetify'

import VuetifyDialog from 'vuetify-dialog'
import 'vuetify-dialog/dist/vuetify-dialog.css'
import PExcelPrompt from '@/components/parts/dialogs/p-export-prompt';


setTimeout(() => { 
const manager = Vue.prototype['$dialog'];

manager.component('export', PExcelPrompt, {
    waitForResult: true,        
        actions: {
            true: {
                text: i18n.t("actions.ok"),
                color: 'primary'
            }
        },
        icon: "contact_support", // to disable icon just put false
        width: 500,
        type: 'secondary',
  })
},1000);

Vue.use(VuetifyDialog, {
    context: {
        vuetify
    },
    confirm: {
        title: i18n.t("messages.confirm"),
        actions: {
            false: i18n.t("actions.no"),
            true: {
                text: i18n.t("actions.yes"),
                color: 'black'
            }
        },
        icon: "info", // to disable icon just put false
        width: 500,
        type: 'info'
    },
    warning: {
        title: i18n.t("messages.warning"),
        actions: {
            true: {
                text: i18n.t("actions.ok"),
                color: 'black'
            }
        },
        icon: "warning", // to disable icon just put false
        width: 500
    },
    error: {
        title: i18n.t("errors.error"),
        actions: {
            true: {
                text: i18n.t("actions.ok"),
                color: 'black'
            }
        },
        icon: "error", // to disable icon just put false
        width: 500
    },
    prompt: {
        actions: {
            true: {
                text: i18n.t("actions.ok"),
                color: 'black'
            }
        },
        icon: "contact_support", // to disable icon just put false
        width: 500,
        type: 'secondary'
    },
    notification: {
        actions: {

        }
    }
})