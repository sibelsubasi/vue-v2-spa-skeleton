  <template>
  <v-row>
    <v-checkbox
      v-show="showCheckbox"
      v-model="enabled"
      :disabled="disabled"
      hide-details
      class="shrink mr-2 mt-4"
    ></v-checkbox>
    <v-text-field
      @focus="readonly=false"
      @blur="readonly=false"
      :readonly="readonly"
      :prepend-icon="prependIcon"
      v-model="model"
      :rules="rules"
      :disabled="disabled || !enabled"
      :label="computedLabel"
      :append-icon="type == 'password' ? (show ? 'mdi-eye' : 'mdi-eye-off') : ''"
      :type="inputType"
      :loading="enabled"
      autocomplete="new-password"
      :validate-on-blur="validateOnBlur"
      @click:append="show = !show; inputType = inputType == 'text' ? 'password' : 'text'"
    >
      <template v-slot:progress>
        <v-progress-linear :value="progress" :color="color" absolute height="3"></v-progress-linear>
      </template>
    </v-text-field>
  </v-row>
</template>  
<script>
import Vue from "vue";
var _ = require("lodash");
import i18n from "@/plugins/vue-i18n";
export default {
  name: "p-checked-texfield",
  
  props: {
    label: {
      type: String,
      required: true,
      default: () => "Heading"
    },
    disabledLabel: {
      type: String,
      required: true,
      default: () => "Click to edit"
    },
    type: {
      type: String,
      default: () => "text"
    },
    value: {
      type: String,
      required: false
    },
    disabled: {
      type: Boolean
    },
    showCheckbox: {
      type: Boolean,
      default: () => true
    },
    rulesToAppyLabel: String,
    rulesToApply: Object,
    prependIcon: {}
  },
  data: vm => ({
    model: vm.value,
    enabled: !vm.showCheckbox,
    inputType: vm.type,
    show: false,
    validateOnBlur: true,
    readonly: true
  }),
  computed: {
    computedLabel() {
      return this.enabled ? this.label : this.disabledLabel;
    },
    rules() {
      if (this.enabled) {
        return this.rulesToApply.toRules(this.rulesToAppyLabel);
      }
      return [];
    },
    progress() {
      return Math.min(100, (this.model || "").length * 10);
    },
    color() {
      var scr = this.scrore;
      if (scr < 10) {
        return "error";
      } else if (scr < 20) {
        return "red accent-2";
      } else if (scr < 30) {
        return "red accent-1";
      } else if (scr < 40) {
        return "red lighten-4";
      } else if (scr < 50) {
        return "warning";
      } else if (scr < 60) {
        return "yellow darken-1";
      } else if (scr < 70) {
        return "yellow lighten-1";
      } else if (scr < 80) {
        return "green lighten-3";
      } else if (scr < 90) {
        return "green lighten-2";
      }
      return "success";
      // return ["error", "warning", "success"][Math.floor(this.progress / 40)];
    },
    scrore() {
      var score = 0;
      var pass = this.model;
      if (!pass) return score;

      // award every unique letter until 5 repetitions
      var letters = new Object();
      for (var i = 0; i < pass.length; i++) {
        letters[pass[i]] = (letters[pass[i]] || 0) + 1;
        score += 5.0 / letters[pass[i]];
      }

      // bonus points for mixing it up
      var variations = {
        digits: /\d/.test(pass),
        lower: /[a-z]/.test(pass),
        upper: /[A-Z]/.test(pass),
        nonWords: /\W/.test(pass)
      };

      var variationCount = 0;
      for (var check in variations) {
        variationCount += variations[check] == true ? 1 : 0;
      }
      score += (variationCount - 1) * 10;

      return parseInt(score);
    }
  },
  watch: {
    model: {
      handler(val) {
        this.updateValue(this.model);
        if (this.model && this.model.length > 0) {
          this.validateOnBlur = false;
        }
      }
    },
    enabled: {
      handler(val) {
        this.model = "";
        this.validateOnBlur = true;
      }
    }
  },
  methods: {
    updateValue: function(value) {
      this.$emit("input", value);
    }
  },
  created() {},
  mounted() {}
};
</script>