  <template>
  <v-text-field
    ref="textfield"
    :label="label"
    :unique="unique"
    :value="value"
    :loading="loading"
    type="text"
    :disabled="disabled || loading"
    v-model="model"
    :rules="rules"
    :hint="hint"
    :persistent-hint="!!hint"
    :error="!unique"
    :error-messages="errorMessages"
    :success-messages="successMessages"
    @change="check"
    :outlined="outlined"
    :dense="dense"
  >
    <!-- v-on:input="updateValue($event.target.value)" -->
  </v-text-field>
</template>  
<script>
import Vue from "vue";
var _ = require("lodash");
import i18n from "@/plugins/vue-i18n";
export default {
  name: "p-unique-textfield", 
  props: {
    label: {
      type: String,
      required: true,
      default: () => "Heading"
    },
    value: {
      type: String,
      required: false
    },
    url: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean
    },
    fetchMode: {
      type: String,
      default: () => "segment"
    },
    outlined: {
      type: Boolean,
      default: () => false
    },
    dense: {
      type: Boolean,
      default: () => false
    },
    rules: Array
  },
  data: vm => ({
    isUniqueInput: true,
    except: null,
    formBlocking: false, //vm.disabled === true ? false : true,
    model: vm.value,
    unique: true,
    loading: false,
    lastChecked: null,
    successMessageText: ""
  }),
  computed: {
    hint() {
      return this.loading ? i18n.t("messages.checking") : null;
    },
    successMessages() {
      if (!this.unique || this.loading) {
        return "";
      }
      return this.successMessageText;
    },
    errorMessages() {
      if (this.unique || this.loading) {
        return "";
      }
      return i18n.t("validation.unique", { input: this.label });
      //return this.label + " alanı eşşiz olmalı";
    }
  },
  watch: {
    model: {
      handler(val) {
        this.updateValue(this.model);
        this.debouncedCheck();
      }
    }
  },
  methods: {
    updateValue: function(value) {
      this.$emit("input", value);
    },
    async check() {
      if (!this.model || this.model == this.lastChecked) {
        return;
      }
      if (this.$refs.textfield.errorBucket.length > 0) {
        this.unique = true;
        this.formBlocking = true;
        return; // an other validation errors
      }
      this.formBlocking = true;
      this.loading = true;
      try {
        this.lastChecked = this.model;
        var url =
          this.url + "/" + encodeURI(this.model) + "/" + encodeURI(this.except);
        var params = {};
        if (this.fetchMode != "segment") {
          url = this.url;
          params = { params: { name: this.model, except: this.except } };
        }
        const response = await this.axios.get(url, params);
        //dummy soa response
        this.unique = !response.data.exists || response.data.exists === "false";

        if (this.unique) {
          this.formBlocking = false;
          this.successMessageText = i18n.t("validation.uniqueOk", {
            input: this.model
          });
          var $dis = this;
          setTimeout(() => ($dis.successMessageText = ""), 2000);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    }
  },
  created() {
    this.debouncedCheck = _.debounce(() => this.check(), 1000);
  },
  mounted() {
    console.log(`unique input moutned with: value: ${this.value}`);
    this.except = this.value ? this.value + "" : null;
  }
};
</script>