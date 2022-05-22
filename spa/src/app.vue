<template>
  <v-app>
    <v-system-bar
      color="orange"
      window
      app
      v-if="reconnecting || connectionError"
    >
      <v-icon>perm_scan_wifi</v-icon>
      <span v-if="reconnecting">{{ $t("app.reconnecting") }}...</span>
      <span v-else>{{ $t(reTryMessage, { sec: reConnectionTime }) }}</span>
      <v-btn x-small text :loading="reconnecting" @click="reconnect">{{
        $t("app.reTryNow")
      }}</v-btn>
    </v-system-bar>
    <v-dialog
      v-model="show"
      max-width="1000"
      :fullscreen="$vuetify.breakpoint.smAndDown"
    >
      <v-card>
        <v-card-title primary-title class="headline pa-0">
          <v-toolbar dark color="error" flat>
            <v-btn
              icon
              dark
              v-if="$vuetify.breakpoint.smAndDown"
              @click="show = false"
            >
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ $t("app.aScriptError") }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-switch
                class="mt-5"
                v-model="showErrors"
                :label="$t('app.showErrors')"
              ></v-switch>
            </v-toolbar-items>
          </v-toolbar>
        </v-card-title>
        <v-card-text>
          <p class="mt-4">
            <strong>{{ errorType }}</strong>
          </p>
          <pre>{{ computedErrorMessage }}</pre>
          <pre>{{ computedErrorInfo }}</pre>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- Sizes your content based upon application components -->
    <!-- Provides the application the proper gutter -->
    <!-- If using vue-router -->
    <router-view></router-view>
  </v-app>
</template>

<script>
import Vue from "vue";
import store from "@/store";
import router from "@/router";
export default {
  components: {},
  data: () => ({
    erorrCought: false,
    errorMessage: null,
    errorInfo: null,
    errorType: null,
    connectionError: false,
    reTryMessage: null,
    reConnectionTime: 0,
    reTriedCount: 0,
    minTimeToReTry: 10,
    maxTimeToReTry: 180,
    timerInterval: null,
    retryStep: 15,
    reconnecting: false,
    internalShowErrors:
      localStorage.getItem("errors-showGlobalErrors") == "false" ? false : true,
  }),
  computed: {
    computedErrorMessage() {
      return JSON.stringify(this.errorMessage, null, 2); // spacing level = 2
    },
    computedErrorInfo() {
      return JSON.stringify(this.errorInfo, null, 2); // spacing level = 2
    },
    show: {
      get() {
        return this.erorrCought;
      },
      set(value) {
        this.erorrCought = false;
        window.isJavaScriptErorrCought = false;
        window.coughtJavascriptError = {};
      },
    },
    showErrors: {
      get() {
        return this.internalShowErrors;
      },
      set(value) {
        this.internalShowErrors = !this.internalShowErrors;
        localStorage.setItem(
          "errors-showGlobalErrors",
          this.internalShowErrors
        );
      },
    },
  },
  watch: {
    reConnectionTime: {
      handler() {
        if (!this.connectionError || this.reConnectionTime > 0) {
          return;
        }
        this.reconnect();
      },
    },
    connectionError: {
      handler(val) {
        if (!val) {
          window.clearInterval(this.timerInterval);
          return;
        }
        var randToTen = Math.ceil(Math.random() * 10);
        this.reTriedCount = Math.min(this.reTriedCount, 5);

        console.log(
          `connectionErrorWatcher: ReTried:${this.reTriedCount}, randToTen: ${randToTen} `
        );

        this.reConnectionTime = this.reTriedCount * this.retryStep + randToTen;

        if (this.reConnectionTime > this.maxTimeToReTry) {
          console.log(`reConnectionTime > maxTimeToReTry`);
          this.reConnectionTime = this.maxTimeToReTry + randToTen;
        }
        if (this.reConnectionTime < this.minTimeToReTry) {
          console.log(`reConnectionTime < minTimeToReTry`);
          this.reConnectionTime = this.minTimeToReTry + randToTen;
        }
        window.clearInterval(this.timerInterval);

        this.timerInterval = window.setInterval(() => {
          this.reConnectionTime--;
          if (this.reConnectionTime <= 0) {
            window.clearInterval(this.timerInterval);
          }
        }, 1000);
      },
    },
  },
  methods: {
    async reconnect() {
      window.clearInterval(this.timerInterval);

      this.reconnecting = true;
      this.connectionError = false;

      var leReq = window._last_erorred_request;
      if (!leReq) {
        return;
      }
      if (typeof leReq.data != "object") {
        leReq.data = JSON.parse(leReq.data);
      }

      console.log(`reconnecting...`);
      console.log(leReq);

      try {
        await this.axios(leReq);
      } catch (e) {
        console.log(`retry error`);
      } finally {
        setTimeout(() => (this.reconnecting = false), 1000);
      }
    },
  },
  mounted() {
    console.log("app mounted");
    //setTimeout(() => this.axios.get(`/auth/check`), 2000);
  },
  created() {
    this.reTryMessage = "app.notConnectedReTryInSecs";
    if (process.env.VUE_APP_SHOW_NETWORK_MAYBE_CORS_WARNING == "true") {
      this.reTryMessage = "app.notConnectedReTryInSecsWithCors";
    }

    var showNetworkErrors = process.env.VUE_APP_SHOW_NETWORK_ERRORS === "true";

    var handleErrorsGlobally =
      process.env.VUE_APP_GLOBAL_ERROR_HANDLER === "true" &&
      this.internalShowErrors;

    if (!showNetworkErrors && !handleErrorsGlobally) {
      return;
    }

    if (!showNetworkErrors && !handleErrorsGlobally) {
      return;
    }

    console.log(
      `app created, listen global errors: ${handleErrorsGlobally}, showNetworkErrors:${showNetworkErrors}`
    );

    store.dispatch("fetchAccessToken");
    /** TEMPORARILY CLOSED FOR DEVELOPMENT
    if (!store.state.user || !store.state.user.permissions) {
      var secure = this.$route.fullPath.startsWith("/secure");
      if (secure) {
        localStorage.removeItem("accessToken");
        store.dispatch("doLogout");
        return router.push("/auth/login");
      }
    }
    */

    if (!window.erorHandlerHooked) {
      window.erorHandlerHooked = true;
      setInterval(() => {
        if (handleErrorsGlobally) {
          this.erorrCought = window.isJavaScriptErorrCought;
          this.errorMessage =
            window.coughtJavascriptError &&
            window.coughtJavascriptError["error"];
          this.errorInfo =
            window.coughtJavascriptError &&
            window.coughtJavascriptError["info"];
          this.errorType =
            window.coughtJavascriptError &&
            window.coughtJavascriptError["type"];
        }
        if (showNetworkErrors) {
          if (window.coughtConnectionError) {
            this.connectionError = window.coughtConnectionError;
            this.reTriedCount = window.coughtConnectionErrorReTryCount;
            window.coughtConnectionError = false;
          }
        }
      }, 1000);
    }
  },
};
</script>
