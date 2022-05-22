"use strict";

window.coughtConnectionErrorReTryCount = 0;

import Vue from 'vue';
import i18n from './vue-i18n'
import axios from "axios";
import router from "../router";
import store from '../store';
import endPointSelector from "@/plugins/endpoint-selector";

// Full config:  https://github.com/axios/axios#request-config
axios.defaults.headers.common['Accept-Language'] = i18n.locale;
axios.defaults.headers.common['Requested-By'] = `portal-iki-spa (vue: ${Vue.version}; vuetify:2.1.0; axios: 0.19.0)`;

var apiType = '';
if(process.env.VUE_APP_USE_TEST_APIS == 'true'){
  apiType = '/test';
}
if(process.env.VUE_APP_USE_DEV_APIS == 'true'){
  apiType = '/dev';
}
const baseURL = `https://${endPointSelector(false)}.` + process.env.VUE_APP_BASEURL + `${apiType}/bayi/api/v1/`;

let config = {
  baseURL: baseURL,
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function (config) {
    // store.dispatch('fetchCsrf');

    // if (store.state.csrf) {
    //   config.headers['X-CSRF-TOKEN'] = store.state.csrf;
    // }

    // if (!config.url.startsWith("http://") && !config.url.startsWith("https://")) {
    // let  error = {
    //   response: {
    //     status: 401,
    //     data: {
    //       message: "Hata var hata",
    //     }
    //   }
    // };
    // return Promise.reject(error);

    /** old login version
    var urlToLogin = `https://${endPointSelector(false)}.${process.env.VUE_APP_BASEURL}/api/token`;
    */
    var urlToLogin = `https://${endPointSelector(false)}.${process.env.VUE_APP_BASEURL}/api/${endPointSelector()}/v1/oauth/login`;

    config.baseURL = baseURL;
    if (config.url.startsWith("/inapi")) {
      config.baseURL = `https://${endPointSelector(false)}.${process.env.VUE_APP_BASEURL}`;
     // config.baseURL = "http://e-products-cloud-spa-inapi.test";
      // config.baseURL = "http://10.34.10.150:31200";
     // config.url = config.url.replace("/inapi","/api");
    }

    // console.log(`!config.url.startsWith("/token"): ${!config.url.startsWith("/token")}, url:${config.url}`);
    if (!config.url.startsWith("/auth") && config.url != urlToLogin) {
      if (store.state.auth && store.state.auth.token) {
        config.headers['Authorization'] = `Bearer ${store.state.auth.token}`;
        // config.headers['Authorization'] = `Bearer bozukbu-yaaaaaaa}`;
        //console.log( config.headers);
        //axios.defaults.headers.common['Authorization'] = 'Bearer test';
      }
    } else {
      if (config.url == "/auth/logout") {
        config.headers['Authorization'] = `Bearer ${store.state.auth.token}`;
      } else if (config.url == "/auth/refresh") {
        config.headers['Authorization'] = `Bearer ${store.state.auth.refresh_token}`;
      } else if (config.url == "/auth/check") {
        config.headers['Authorization'] = `Bearer ${store.state.auth.refresh_token}`;
      }
    }
    // }
    if (config.data && !config.data.who) {
      var now = new Date();
      config.data.who = {
        ip: 'N/A',
        user: store.state.user ? store.state.user.name : "N/A",
        time: {
          on: Math.round(now.getTime() / 1000),
          timeZone: now.getTimezoneOffset() + "",
        },
        screen: {
          color: screen.colorDepth,
          width: screen.width,
          height: screen.height,
        },
        browser: {
          name: navigator.userAgent,
          language: navigator.language,
          os: navigator.platform,
        }
      }
    }
    // Do something before request is sent
    return config;
  },
  function (error) {    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
// Do something with response data
var __token_retry_tried = false;

_axios.interceptors.response.use(
  function (response) { //success 
    //console.log('x-csrf-token:' + response.headers['x-csrf-token']);
    if (response.headers && response.headers['x-csrf-token']) {
      //  store.dispatch('storeCsrfToken', response.headers['x-csrf-token']);
    }
    __token_retry_tried = false;
    window.coughtConnectionErrorReTryCount = 0;
    return response;
  },
  function (error) { //error
    console.log(`error.response:`);
    console.log(error);
    if (!error.response) {
      var errorToString = (error + "") == "Error: Network Error" ? null : (error + "");

      error.response = {
        data: {
          message: errorToString || i18n.t("errors.unknownNetworkError")
        }
      };
      window._last_erorred_request = error.config;

      if (window._last_erorred_request) {
        window.coughtConnectionError = true;
        window.coughtConnectionErrorReTryCount += 1;
      }
      console.log(`return error. CORS ruined response data`);
      return Promise.reject(error);
    }
    if (typeof error.response.data != 'object') { //NoN JSON resposnes
      error.response.data = {};
    }

    const originalRequest = error.config;
    // if (originalRequest.url.startsWith("http://") || originalRequest.url.startsWith("https://")) {
    //   error.response.status = 400;
    // }

    switch (error.response.status) {
      case 401:
        // error.response.data.message = i18n.t("errors.noSessionOrTimeoutNeedRefreshService");
        // store.dispatch("doLogout");
        // router.replace('/auth/login');
        // return Promise.reject(error);

        console.log(`401`);
        if (!__token_retry_tried && store.state.auth && store.state.auth.token) {
          console.log(`not retired: try to regain token`);
          __token_retry_tried = true;

          {
            /** old refresh api version
            var urlToRefresh = `https://${endPointSelector(false)}.${process.env.VUE_APP_BASEURL}/api/token`;
            var paramsToRefresh = new URLSearchParams();
            paramsToRefresh.append("grant_type", "refresh_token");
            paramsToRefresh.append("refresh_token", store.state.auth.refresh_token);
            var headersToRefresh = {
              headers: {
                Authorization: `Basic ${process.env.VUE_APP_AUTH_BASIC_TOKEN}`,
              },
            };
            */

            var urlToRefresh = `https://${endPointSelector(false)}.${process.env.VUE_APP_BASEURL}/api/${endPointSelector()}/v1/oauth/refresh`;
            var paramsToRefresh = {
              refresh_token: store.state.auth.refresh_token
            };
            var headersToRefresh = {
              headers: {
                Authorization: `Basic ${process.env.VUE_APP_AUTH_BASIC_TOKEN}`,
              },
            };

            //alert(`not retired: try to regain token`);
            return _axios.post(urlToRefresh, paramsToRefresh, headersToRefresh).then((response) => {
              // alert(`not retired: try to regain token 2`);
              originalRequest._fetchWasSuccessFull = true;
              console.log(`token regained from server`);
              console.log(response.data);

              var expandData = {
                auth: {
                  scope: response.data.scope,
                  token_type: response.data.token_type,
                  token: response.data.access_token,
                  refresh_token: response.data.refresh_token,
                  token_expires_in: response.data.expires_in,
                  refresh_token_expires_in: response.data.expires_in,
                  token_expires_on: "2021-11-28 22:41:28",
                  refresh_token_expires_on: "2021-11-28 22:41:28",
                  user_id: 1,
                  revoked: "0",
                  role: response.data.role,
                },
              }

              store.dispatch("expandLogin", expandData);
              store.dispatch('fetchAccessToken');
              __token_retry_tried = false;
              if (originalRequest.headers['Authorization']) {
                originalRequest.headers['Authorization'] = `Bearer ${store.state.auth.token}`;
                // originalRequest.headers['Authorization'] = `Bearer bozuk2-`;
                // originalRequest._fetchWasSuccessFull = false;
              }
              return axios(originalRequest);
            }).catch((error) => {
              console.log('an errorn on relogin');
              if (!originalRequest._fetchWasSuccessFull) {
                console.log(`token regain error: ${error}`);
                error.response.data = {};
                error.response.data.message = i18n.t("errors.noSessionOrTimeout");
                store.dispatch("doLogout");
                router.replace('/auth/login');
                return Promise.reject(error);
              } else {
                return Promise.reject(error);
              }
            });
          }

          //originalRequest.headers['Authorization'] = `Bearer ${store.state.auth.refresh_token}`;

          // console.log(originalRequest);

        } else if (originalRequest.url.endsWith(`/api/${endPointSelector()}/v1/oauth/login`)) {
          error.response.data.message = i18n.t("errors.wrongUsernameOrPassword");
          console.log(`noop, login page`);
        } else {
          console.log(`retired: do NOT try to regain token`);
          error.response.data = {};
          error.response.data.message = i18n.t("errors.noSessionOrTimeout");
          store.dispatch("doLogout");
          router.replace('/auth/login');
          return Promise.reject(error);
        }
        break;
      case 403:
        console.log("403");
        error.response.data = {};
        error.response.data.message = i18n.t("errors.youCanNotPerformThisOperation");
        break;
      case 404:
        console.log("404");
        error.response.data = {};
        error.response.data.message = i18n.t("errors.serviceNotFound", { service: `${error.config.url}` });
        break;
      default:
        console.log(`default: ${error.response.status}`);
        var s = i18n.t("errors.serviceReturnedAnUnknownError");
        if (!error.response.data || !error.response.data.message) {
          if (error.response.data && error.response.data.error_description) {
            s = error.response.data.error_description;
          } else {
            error.response.data = {};
          }
          error.response.data.message = s;
        }
    }
    var errLogMsg =  error && error.response && error.response.data && error.response.data.message;
    if (window._paq) {
      window._paq.push(['setDocumentTitle',  error.response.status+'/URL = ' +  encodeURIComponent(document.location.pathname+document.location.search) + '/MESSAGE = ' + encodeURIComponent(errLogMsg)]);
    }
    return Promise.reject(error);
  });

var plug = {};

plug.install = function (Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(plug)

export default plug;
