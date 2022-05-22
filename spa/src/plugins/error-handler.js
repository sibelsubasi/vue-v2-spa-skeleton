import Vue from 'vue';

Vue.config.errorHandler = function (err, vm, info) {
    if (process.env.VUE_APP_GLOBAL_ERROR_HANDLER === "true") {
        window.isJavaScriptErorrCought = true;
        window.coughtJavascriptError = {
            'type': 'Vue.config.errorHandler',
            'info': info,
            'error': err,
        }
    }
    console.log(info);
    console.error(err);
}

window.onerror = function (msg, url, line, col, error) {
    if (process.env.VUE_APP_GLOBAL_ERROR_HANDLER === "true") {
        window.isJavaScriptErorrCought = true;
        window.coughtJavascriptError = {
            'type': 'window.onerror',
            'info': `${url}:${msg}. ${line}:${col}`,
            'error': error,
        }
    }
    console.error(`${url}:${msg}. ${line}:${col}`);
    console.error(error);
}