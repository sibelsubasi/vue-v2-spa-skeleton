<style>
.dialog-subcaption.sm {
  left: 72px !important;
}
.dialog-subcaption {
  position: absolute;
  left: 16px;
  bottom: 2px;
  font-weight: normal;
}
</style>
<template>
  <v-dialog
    :fullscreen="$vuetify.breakpoint.smAndDown"
    :hide-overlay="$vuetify.breakpoint.smAndDown"
    :transition="
      $vuetify.breakpoint.smAndDown ? 'dialog-bottom-transition' : null
    "
    :persistent="!hasCancel || loading"
    v-model="visible"
    scrollable
    :max-width="maxWidth"
    :key="componentKey"
  >
    <v-card tile flat color="primary" dark v-if="openingFromServer">
      <v-card-text>
        {{ $t("messages.loadingPleaseStandBy") }}
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
    <v-card tile flat v-else style="min-height: 450px">
      <v-card-title primary-title class="headline pa-0">
        <v-toolbar dark color="primary" flat>
          <v-btn
            icon
            dark
            v-if="hasCancel && $vuetify.breakpoint.smAndDown"
            :disabled="loading"
            @click="hide"
          >
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>
            {{ caption }}
            <small
              class="dialog-subcaption"
              v-bind:class="{ sm: $vuetify.breakpoint.smAndDown }"
            >
              <small>
                <small>{{ subCaption }}</small>
              </small>
            </small>
          </v-toolbar-title>
          <v-spacer></v-spacer>

          <v-toolbar-items v-if="$vuetify.breakpoint.smAndDown">
            <div v-for="action in actions" :key="action.text">
              <v-btn
                dark
                text
                large
                style="height: 56px"
                v-if="
                  showActions &&
                  action.condition == shownCondition &&
                  !!action.text
                "
                :loading="loading"
                :color="action.color || null"
                @click="runAction(action)"
                >{{ action.text }}</v-btn
              >
            </div>
          </v-toolbar-items>
          <template v-slot:extension v-if="hasTab">
            <slot name="tabs"></slot>
          </template>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-overlay :value="loading" absolute></v-overlay>
          <v-container>
            <slot name="content"></slot>
            <!-- seee for bind!!! -->
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="mr-3"
          text
          v-if="hasCancel && $vuetify.breakpoint.mdAndUp"
          :disabled="loading"
          @click="hide"
          >{{ $t("actions.close") }}</v-btn
        >
        <div v-if="$vuetify.breakpoint.mdAndUp">
          <div v-for="action in actions" :key="action.text">
            <v-btn
              v-if="
                showActions &&
                action.condition == shownCondition &&
                !!action.text
              "
              :color="action.color || 'primary'"
              style="min-width: 100px"
              :loading="loading"
              @click="runAction(action)"
              >{{ action.text }}</v-btn
            >
          </div>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import Vue from "vue";

export default {
  name: "p-form",
  //   directives: {
  //     trops: {
  //       inserted: (el, binding, vnode) => {
  //         console.log("MY DIRECTIVE WORKED!");
  //         console.log(el);
  //         console.log(binding);
  //         console.log(vnode);
  //       }
  //     }
  //   },
  props: {
    defaultValues: {
      type: Object,
      required: false,
      default: null,
    },
    dataPartName: {
      type: String,
      required: false,
      default: null,
    },
    files: {
      type: Array,
      required: false,
      default: () => [],
    },
    purge: {
      type: Array,
      required: false,
      default: null,
    },
    refreshHook: {
      type: Function,
      required: false,
      default: null,
    },
    multipart: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasTab: {
      type: Boolean,
      required: false,
      default: false,
    },
    autoCloseAfter: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasCancel: {
      type: Boolean,
      required: false,
      default: true,
    },
    models: {
      type: Object,
      required: true,
      default: () => {},
    },
    actions: {
      type: Array,
      required: true,
      default: () => [],
    },
    caption: {
      type: String,
      required: true,
      default: "Dialog",
    },
    beforeFetch: {
      type: Function,
      required: false,
      default: null,
    },
    afterFetch: {
      type: Function,
      required: false,
      default: null,
    },
    beforeShow: {
      type: Function,
      required: false,
      default: null,
    },
    afterShow: {
      type: Function,
      required: false,
      default: null,
    },
    beforePost: {
      type: Function,
      required: false,
      default: null,
    },
    afterPost: {
      type: Function,
      required: false,
      default: null,
    },
    beforeHide: {
      type: Function,
      required: false,
      default: null,
    },
    afterHide: {
      type: Function,
      required: false,
      default: null,
    },
    onValidationError: {
      type: Function,
      required: false,
      default: null,
    },
    onValidationSuccess: {
      type: Function,
      required: false,
      default: null,
    },
    groupValidate: {
      type: Function,
      required: false,
      default: null,
    },
    maxWidth: {
      type: String,
      required: false,
      default: "800px",
    },
  },
  data: () => ({
    componentKey: 0,
    subCaption: "",
    visible: false,
    valid: false,
    loading: false,
    openingFromServer: false,
    shownCondition: null,
    showActions: true,
  }),
  computed: {},
  watch: {},
  methods: {
    purgeData(data) {
      if (!this.purge) {
        return data;
      }
      let ret = {};
      for (let i in data) {
        if (this.purge.indexOf(i) < 0) {
          ret[i] = data[i];
        }
      }
      return ret;
    },
    async fireEvent(callable) {
      if (!callable || typeof callable !== "function") {
        return;
      }
      const isAsync = callable.constructor.name === "AsyncFunction";
      if (isAsync) {
        return await callable(this);
      }
      return callable(this);
    },

    __clearModels() {
      for (let i in this.models) {
        let t = typeof this.models[i];
        if (Array.isArray(this.models[i])) {
          t = "array";
        }
        if (this.models[i] === null) {
          t = "string"; //backward compability
        }
        switch (t) {
          case "object":
            // console.log(`sees as object`);
            // console.log(`i: ${i}`);
            //console.log(this.models[i]);
            Vue.set(this.models, i, {});
            //this.models[i] = {};
            break;
          case "array":
            //this.models[i] = [];
            Vue.set(this.models, i, []);
            break;
          default:
            Vue.set(this.models, i, null);
          //this.models[i] = null;
        }
      }

      //this.models = Object.assign({}, this.models, {});
    },
    _applyDefaultValues() {
      if (!this.defaultValues) {
        return;
      }
      for (let i in this.defaultValues) {
        this.models[i] = this.defaultValues[i];
      }
      console.log("applied def.");
      console.log(this.models);
    },
    async show(subCaption) {
      await this.fireEvent(this.beforeShow);

      console.log(`show worked!!!!`);
      this.componentKey++; //trick to remount
      this.subCaption = subCaption;
      this.shownCondition = null;
      this.$nextTick(() => {
        if (this.$refs.form) {
          console.log(`nextTickClear:::`);
          this.$refs.form.reset();
          this.$refs.form.resetValidation();
          // for (var i in this.$refs.form.$children) {
          //   var el = this.$refs.form.$children[i];
          //   if (el.isUniqueInput) {
          //     console.log("setting except");
          //     el.except = null;
          //     el.lastChecked = null;
          //   }
          // }
          this._applyDefaultValues();
        }
      });
      this.__clearModels();
      this.visible = true;
      this.showActions = true;
      await this.fireEvent(this.afterShow);
    },
    async hide() {
      await this.fireEvent(this.beforeHide);
      if (this.$refs.form) {
        this.$refs.form.reset();
        this.$refs.form.resetValidation();
      }
      this.__clearModels();
      this.visible = false;
      await this.fireEvent(this.afterHide);
    },
    async showFetch(item, condition, subCaption, asPath = true) {
      await this.fireEvent(this.beforeShow);

      this.subCaption = subCaption;
      console.log("showFetch");
      let foundAction = null;
      this.actions.forEach((k) => {
        if (k.condition == condition) {
          foundAction = k;
          return;
        }
      });
      if (!foundAction || !foundAction.fetch || !foundAction.fetch.id) {
        console.error(`Action or fetch or fetch:id not found! in ${condition}`);
        return false;
      }
      // console.log(foundAction);
      if (item[foundAction.fetch.id] === undefined) {
        console.error(`column ${foundAction.fetch.id} not found in item data`);
        console.log(item);
        return false;
      }
      let id = item[foundAction.fetch.id];

      //alert(JSON.stringify(item));
      this.shownCondition = condition;
      this.showActions = true;
      if (this.$refs.form) {
        this.$refs.form.reset();
        this.$refs.form.resetValidation();
      }
      this.visible = true;

      this.loading = true;
      this.openingFromServer = true;

      let data = {};
      let url = foundAction.fetch.url;
      if (asPath) {
        if (url[url.length - 1] != "/") {
          url += "/";
        }
        url += encodeURI(id);
      } else {
        data[foundAction.fetch.id] = id;
      }
      if (foundAction.fetch.force) {
        let amp = url.indexOf("?") == -1 ? "?" : "&";
        url += amp + "__forceFetch=" + Math.random();
      }
      this.$pform.urlToFetch = url;
      this.$pform.dataToFetch = data;

      await this.fireEvent(this.beforeFetch);

      try {
        var response = await this.axios.get(this.$pform.urlToFetch, {
          params: this.$pform.dataToFetch,
        });

        this.$pform.lastFetchedResponse = response;
        // console.log(response);
        for (let k in response.data) {
          let v = response.data[k];
          this.models[k] = v;
        }
        await this.fireEvent(this.afterFetch);
      } catch (error) {
        // console.log(error);
        this.showActions = false;
        this.$dialog.error({ text: error.response.data.message });
      } finally {
        this.openingFromServer = false;
        this.loading = false;
      }

      await this.fireEvent(this.afterShow);
    },
    methodHasBody(action) {
      return (
        action.api.method == "post" ||
        action.api.method == "put" ||
        action.api.method == "patch"
      );
    },
    async runAction(action) {
      // console.log("runAction");
      if (!this.$refs.form.validate()) {
        await this.fireEvent(this.onValidationError);
        return false;
      }
      var isValidCustomInputs = true;
      for (var i in this.$refs.form.$children) {
        console.log("ele,emt loop");
        var el = this.$refs.form.$children[i];
        if (el["formBlocking"] == true) {
          console.log("sth is blocking...");
          console.log(el);
          isValidCustomInputs = false;
        }
      }
      if (!isValidCustomInputs) {
        await this.fireEvent(this.onValidationError);
        return false;
      }
      console.log(`has group validation: ${!!this.groupValidate}`);
      if (this.groupValidate && !this.groupValidate(this)) {
        await this.fireEvent(this.onValidationError);
        return false;
      }
      await this.fireEvent(this.onValidationSuccess);

      // console.log(this.$refs.form);
      if (!action.api) {
        console.error(`Method: action.api is not defined`);
        return false;
      }
      if (!action.api.method) {
        action.api.method = "post";
      }
      action.api.method = action.api.method.toLowerCase();

      if (!this.methodHasBody(action)) {
        console.error(`Method: ${action.api.method} not acceptable`);
        return false;
      }

      this.loading = true;

      console.log(action);
      console.log(this.models);

      this.$pform.methodToPost = action.api.method;
      this.$pform.urlToPost = action.api.url;
      this.$pform.dataToPost = this.purgeData(this.models);

      await this.fireEvent(this.beforePost);

      //   .post(this.url, this.options)
      try {
        var response = null;
        if (this.multipart) {
          const formData = new FormData();

          if (this.dataPartName !== null) {
            var jsonStr = JSON.stringify(this.$pform.dataToPost);
            var jsonBlob = new Blob([jsonStr], { type: "application/json" });
            formData.append(this.dataPartName, jsonBlob);
          } else {
            for (let i in this.$pform.dataToPost) {
              formData.append(i, this.$pform.dataToPost[i]);
            }
          }
          for (let i in this.files) {
            let f = this.files[i];
            formData.append(f.input, f.data, f.name);
          }

          var requestOptions = {
            headers: {
              "content-type": `multipart/form-data; boundary=${formData._boundary}`,
            },
          };

          response = await this.axios[this.$pform.methodToPost](
            this.$pform.urlToPost,
            formData,
            requestOptions
          );
        } else {
          response = await this.axios[this.$pform.methodToPost](
            this.$pform.urlToPost,
            this.$pform.dataToPost
          );
        }
        this.$pform.lastPostedResponse = response;

        await this.fireEvent(this.afterPost);

        this.$dialog.notify.info(
          response.data.message || this.$t("messages.success"),
          {
            position: "top-right",
          }
        );
        this.loading = false;
        if (this.autoCloseAfter) {
          this.hide();
        }
        this.refreshHook && this.refreshHook();
      } catch (error) {
        this.loading = false;
        this.$dialog.error({ text: error.response.data.message });
      }
    },
  },
  created() {
    // console.log('form create');
  },
  mounted() {
    this.$pform = {
      urlToFetch: null,
      dataToFetch: null,
      lastFetchedResponse: null,
      methodToPost: null,
      urlToPost: null,
      dataToPost: null,
      lastPostedResponse: null,
    };

    //  console.log('form mount');
  },
};
</script>