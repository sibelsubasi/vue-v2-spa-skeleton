import Vue from 'vue';
import moment from "moment";
import validation from "./validation";
import acl from "./acl";
import idVerification from "./identifier-verification";
import Notifier from "./notifier";
import getThemeSettings from "./get-theme-setting";

const defaultTheme = getThemeSettings();

const _utils = {
    checkDate(z) {
        return moment(z).isValid();
    },
    formatDateTime(z) {
        return z && moment(z).format("L LT");
    },
    formatDate(z) {
        return z && moment(z).format("L");
    },
    formatDateTimeSQL(date) {
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    formatDateSql(date) {
        return moment(date).format("YYYY-MM-DD");
    },
    validation() {
        return new validation();
    },
    acl() {
        return new acl();
    },
    idVerification() {
        return new idVerification();
    },
    async delay(delayInms) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(2);
            }, delayInms);
        });
    },
    ripple: function ($el) {
        let ev = new Event("mousedown")
        let offset = $el.getBoundingClientRect()
        ev.clientX = offset.left + offset.width / 2
        ev.clientY = offset.top + offset.height / 2
        $el.dispatchEvent(ev)

        setTimeout(function () {
            $el.dispatchEvent(new Event("mouseup"))
        }, 300)
    }

}

var plug = {};

plug.install = function (Vue, options) {
    // console.log(`plug install time perm:`);
    // console.log(acl);
    Vue.utils = _utils;
    window.utils = _utils;
    Vue.validation = () => new validation();
    Vue.acl = () => new acl();
    Vue.idVerification = () => new idVerification();
    Vue.theme = defaultTheme;
    Vue.notifier = Notifier;

    Object.defineProperties(Vue.prototype, {
        validation: {
            get() {
                return () => new validation();
            }
        },
        acl: {
            get() {
                return () => new acl();
            }
        },
        theme: {
            get() {
                return defaultTheme
            }
        },
        utils: {
            get() {
                return _utils;
            }
        },
        $utils: {
            get() {
                return _utils;
            }
        },
        notifier: {
            get() {
                return Notifier;
            }
        },
        idVerification: {
            get() {
                return () => new idVerification();
            }
        },
    });
};

Vue.use(plug)

export default plug;