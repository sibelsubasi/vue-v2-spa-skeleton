  <style scoped>

      .fit-label >>> .v-label {
        font-size: 14px !important;
        max-width: 100% !important;
      }
      .fit-label >>> .v-label--active {
        font-size: 16px !important;
        background-color: #fff !important;
        transform: translateY(-16px) scale(0.75) !important;
        max-width: 133% !important;
      }
    
  </style>

  <template>
  <!-- <input 
    type="text" 
    v-model="model" 
    @blur="isInputActive = false" 
    @focus="isInputActive = true"
  /> -->

  <v-text-field
    ref="textfield"
    :label="label"
    :value="value"
    :loading="loading"
    type="text"
    :disabled="disabled || loading"
    v-model="currency"
    :rules="rules"
    :hint="hint"
    :persistent-hint="!!hint"
    @blur="isInputActive = false" 
    @focus="isInputActive = true"
    @keypress="preventNonCurrencyInput($event)"
    :outlined="outlined"
    :dense="dense"
    :validate-on-blur="validateOnBlur"
    clearable
    :class="fitLabel ? 'fit-label' : ''"
    >
    </v-text-field>
</template>  
<script>
import Vue from "vue";
var _ = require("lodash");
import i18n from "@/plugins/vue-i18n";
export default {
  name: "p-currency-textfield", 
  props: {
    label: {
      type: String,
      required: false,
      default: () => ""
    },
    value: {
      // type: String,
      required: false,
      default: () => ""
    },
    hint: {
      type: String,
      required: false
    },
    disabled: {
      type: Boolean
    },
    outlined: {
      type: Boolean,
      default: () => false
    },
    dense: {
      type: Boolean,
      default: () => false
    },
    validateOnBlur: {
      type: Boolean,
      default: () => false
    },
    disableDecimal: {
      type: Boolean,
      required: false,
      default: () => false
    },
    fitLabel: {
      type: Boolean,
      required: false,
      default: () => false
    },
    rules: Array
  },
  data: vm => ({
    isInputActive: false,
    model: vm.value,
    loading: false,
    //currency: "",
  }),
  computed: {
    currency: {
        get: function() {
            if (this.isInputActive) {
                return this.value.toString();
            } else {

                if (!this.value) {
                  return "";
                }

                let fraction = this.disableDecimal ? 0 : 2;
                var temp = (Math.round(this.value * 100) / 100).toFixed(fraction).toString().replace(".", ",");
                temp = temp.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");

                //console.log("getter: " + temp);
                return temp;
            }
        },
        set: function(modifiedValue) {
          //console.log("modifiedValue: "+modifiedValue);
            if (!modifiedValue) {
              this.$emit('input', '');
              return;
            }
            var newValue = modifiedValue.replace(/[^0-9]\.]/g, '');
            if (isNaN(newValue)) {
                newValue ="";
            }

            //console.log("setter: " + newValue);
            this.$emit('input', newValue);
        }
    },
    // hint() {
    //   return this.loading ? i18n.t("messages.checking") : null;
    // },
  },
  watch: {
    currency: {
      handler(val) {
        console.log(val);
        //this.updateValue(val);
      }
    }
  },
  methods: {
    updateValue: function(value) {
      this.$emit("input", value);
    },
    preventNonCurrencyInput(event) {
      //    /^[1-9]\d{0,2}(\.\d{3})*(,\d+)?$/ test
      //    /^[0-9][.\d]*(,\d+)?$/ test
      let r = new RegExp(/^-?[0-9]\d*(\.\d+)?$/);
      let decimalCondition = this.disableDecimal ? true : event.key !== '.';
      if (!r.test(event.key) && decimalCondition) return event.preventDefault();
    },
  },
  created() {},
  mounted() {}
};
</script>