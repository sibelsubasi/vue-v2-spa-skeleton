  <template>
  <v-select
    ref="select"
    :id="id"
    v-bind="$attrs"
    v-on:input="updateValue"
    :disabled="computedDisabled"
    :error="computedHasError"
    :error-messages="computedErrorMessages"
    :hide-details="computedHideDetails"
    :loading="computedLoading"
    :messages="computedMessages"
    :items="internalItems"
  ></v-select>
</template>  
<script>
import Vue from "vue";

const HIDDEN_VAL_ATTR = "_p_value";

export default {
  name: "p-lookup",
  props: {
    id: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: () => false,
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
    error: {
      type: Boolean,
      default: () => false,
    },
    hideDetails: {
      type: Boolean,
      default: () => false,
    },
    errorMessages: {
      default: () => [],
    },
    messages: {
      default: () => [],
    },
    fetch: {},
    fetchOptions: {
      default: function () {
        return {
          method: "get",
          auth: null,
        };
      },
    },
    responseManipulator: {},
    responseData: {},
    conditions: {},
    depends: {
      /* {
          input: $refs.input....,
          type: param / segment == works only get!!!
          field: Param name to inquery
          value: internal,do not use!
        };
      */
    },
    prependData: {
      type: Array,
    },
    appendData: {
      type: Array,
    },
  },
  data: (vm) => ({
    booted: false,
    internalLoading: false,
    internalError: null,
    internalItems: vm.items,
    loadingForPrevalue: false,
    preValue: null,
    inputElement: null,
    internalHideDetails: false,
  }),
  computed: {
    computedHideDetails() {
      return this.hideDetails || this.internalHideDetails;
    },
    computedMessages() {
      return (
        (this.messages && this.messages.length > 0) ||
        (this.loadingForPrevalue ? "Yükleniyor" : [])
      );
    },
    computedDisabled() {
      return this.disabled || this.loadingForPrevalue;
    },
    computedLoading() {
      return this.loading || this.internalLoading;
    },
    computedHasError() {
      return this.error || this.internalError !== null;
    },
    computedErrorMessages() {
      if (this.errorMessages && this.errorMessages.length > 0) {
        return this.errorMessages;
      }
      return this.internalError;
    },
  },
  watch: {},
  methods: {
    shouldParseToInt(row) {
      if (
        this.preValue === undefined ||
        this.preValue === null ||
        //this.preValue === "" ||
        row === undefined ||
        row === null ||
        row === ""
      ) {
        return false;
      }
      return !isNaN(this.preValue) &&  !isNaN(row);
    },
    async fireChange(value) {
      if (this.inputElement && !this.loadingForPrevalue) {
        for (let index = 0; index < 3; index++) {
          //max 3 times try
          if (!this.booted) {
            console.log(`waiting for select to boot ${index} to fire`);
            await this.utils.delay(50);
            continue;
          }
          console.log(`fireing change!!!`);

          //console.log("dispacting change event!");
          this.inputElement[HIDDEN_VAL_ATTR] = value;
          this.inputElement.dispatchEvent(new Event("change")); // Fire event
          break;
          //this.inputElement.dispatchEvent(new Event("change")); // Fire event
        }
      } else {
        console.log("noting to fire");
      }
    },
    updateValue: function (value) {
      console.log(`UPDATE  VALUE WORKED`);
      this.$listeners.input(value);
      this.fireChange(value);
    },
    applyPrependAppend(data) {
      if (this.prependData) {
        for (let i = this.prependData.length - 1; i >= 0; i--) {
          let row = this.prependData[i];
          let text = [row.text];
          let value = [row.value];
          data.unshift({ text: text, value: value });
        }
      }
      if (this.appendData) {
        for (let i = 0; i < this.appendData.length; i++) {
          let row = this.appendData[i];
          let text = [row.text];
          let value = [row.value];
          data.push({ text: text, value: value });
        }
      }
      return data;
    },
    //TODO: custom manipulators when needed!
    getResponseManipulator() {
      if (typeof this.responseManipulator === "function") {
        return this.responseManipulator;
      }
      switch (this.responseManipulator) {
        case "soa":
          return this.getSoaManipulator();
        case "data": // For this type of payload ==> { total: 1, data: [] }
          // For multiple keys and values which come from response.data.data,
          return this.getDataManipulator(
            this.responseData.text,
            this.responseData.value
          );
        case "noParse":
          return this.getCommonManipulatorWithNoParse();
        default:
          return this.getCommonManipulator();
      }
    },
    getSoaManipulator() {
      return function (response) {
        var ret = [];
        var firstKey = Object.keys(response)[0];

        //console.log(`getSoaManipulator with key: ${firstKey}`);

        for (var i in response[firstKey]) {
          var row = Object.values(response[firstKey][i]);
          let k = this.shouldParseToInt(row) ? parseInt(row) : row;
          ret.push({ text: row, value: k });
        }
        return ret;
      };
    },
    getCommonManipulator() {
      return (response) => {
        /*  console.log(`getCommonManipulator: `);
        console.log(response);*/
        var ret = [];
        response.forEach((r) => {
          let k = this.shouldParseToInt(r.key) ? parseInt(r.key) : r.key;
          //let k = r.key;
          ret.push({ text: r.value, value: k }); //
        });
        return ret;
      };
    },
    getCommonManipulatorWithNoParse() {
      return (response) => {
        /*  console.log(`getCommonManipulator: `);
        console.log(response);*/
        var ret = [];
        response.forEach((r) => {
          //let k = this.shouldParseToInt(r.key) ? parseInt(r.key) : r.key;
          let k = r.key;
          ret.push({ text: r.value, value: k }); //
        });
        return ret;
      };
    },
    getDataManipulator(text, value) {
      return (response) => {
        var ret = [];
        response.data.forEach((r) => {

          if(text.includes("+")){ //Concat multiple columns which is like {text: 'name+surname'}
            let _textArr = text.split("+");
            let _concatedText = "";

            for(var key in _textArr){
              _concatedText = `${_concatedText} ${r[_textArr[key]]}`;
            }
            let k = this.shouldParseToInt(r[value]) ? parseInt(r[value]) : r[value];
            ret.push({ text: _concatedText, value: k });

          }else{ //No need concat, just one text like {text: 'name'}                    
            let k = this.shouldParseToInt(r[value]) ? parseInt(r[value]) : r[value];
            ret.push({ text: r[text], value: k });
          }
          
        });
        return ret;
      };
    },
    async fetchData() {
      //console.log(`fetchDataaa`);
      var method = this.fetchOptions.method;
      var options = {};
      var filters = {};

      if (this.fetchOptions.auth) {
        options.auth = this.fetchOptions.auth;
      }

      let data = {};
      let url = this.fetch;

      if (this.depends) {
        options.params = {};
        //options.filters = {};
        var depends = this.depends;

        //console.log(depends);
        for (var i in depends) {
          var dep = depends[i];
          var depValue = dep.value; //this.multiple ? dep.value : dep.value && dep.value[0];

          if (dep.type == "segment") {
            if (url[url.length - 1] != "/") {
              url += "/";
            }
            url += encodeURI(depValue);
          } else if (dep.type == "param") {
            //console.log(`setting opt.params with ${dep.field} : ${depValue}, original: ${dep.value}` );
            options.params[dep.field] = depValue;
          } else if (dep.type == "filter") {
            //dep.type == "filter"
            filters[dep.field] = depValue;
          } else {
            //dep.type == "filterNoArray"
            Array.isArray(depValue) ? filters[dep.field] = depValue[0] : filters[dep.field] = depValue;
          }
        }
      }

      if (this.conditions) { //filter conditions if have, e.g. :conditions="[ { field: 'status', value: 'Active' }]"
        let conditions = this.conditions;
        //console.log(conditions);
        for (let i in conditions) {
          let condition = conditions[i];
          filters[condition.field] = condition.value;
        }
      }

      //console.log(`method is ${method} url: ${url}, and options: ${JSON.stringify(options)}`);

      this.internalLoading = true;

      // await this.utils.delay(1000); //

      try {
        // alert(`url: ${method} ${url}`);
        const response = await this.axios[method](url, {
          options,
          filters,
          page: 1,
          itemsPerPage: 999999,
        });
        // alert('got response');

        this.internalItems = this.applyPrependAppend(
          this.getResponseManipulator()(response.data)
        );

        console.log(`found internal items ${this.internalItems.length}`);
        // console.log(this.internalItems);
      } catch (error) {
        var errm = this.$t("errors.error");
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          errm = error.response.data.message;
        }
        // console.error(error);
        var $dis = this;
        $dis.internalError = errm;
        setTimeout(() => ($dis.internalError = null), 4000);
      } finally {
        if (this.loadingForPrevalue) {
          this.internalHideDetails = true;
          setTimeout(() => (this.internalHideDetails = false), 300);
        }
        this.loadingForPrevalue = false;
        this.internalLoading = false;
        if (this.preValue) {
          this.fireChange(this.preValue);
          this.preValue = null;
        }
      }
    },
  },
  created() {},
  async mounted() {
    console.info(`p-lookup mounted with id: ${this.id}`);
    if (!this.$refs.select) {
      console.warn("NO SUCH REF select!!!");
      return;
    }
    // console.log(this.$refs.select);

    this.inputElement =
      this.$children &&
      this.$children[0] &&
      this.$children[0].$refs &&
      this.$children[0].$refs.input;

    if (!this.fetch) {
      this.booted = true;
      return;
    }
    // console.log(this.$refs.select);

    for (let index = 0; index < 3; index++) {
      //max 3 times try
      /*** TODO: ??? 
      if (!this.$refs.select.isBooted) {
        console.log(`waiting for select to boot ${index}`);
        await this.utils.delay(50);
        continue;
      }
      */
      this.preValue = this.$refs.select.lazyValue;

      this.booted = true;
      if (!this.depends) {
        console.log(`does not depend anything just fetching`);
        return this.fetchData();
      }

      this.loadingForPrevalue = !!this.preValue;

      console.log(
        `mount time preval is: "${this.preValue}", booted: ${this.$refs.select.isBooted}`
      );

      //console.log(this.depends);
      var $dis = this;

      for (var i in $dis.depends) {
        var dep = $dis.depends[i];
        console.log(
          "hooking: " + dep.input + " for " + this.id + " with name " + "change"
        );
        var elm = document.getElementById(dep.input);

        elm &&
          elm.addEventListener("change", (evt) => {
            console.log("onchange: " + dep.input + " has been changed");
            var allDefined = true;
            for (var c in $dis.depends) {
              var d = $dis.depends[c];
              var e = document.getElementById(d.input);
              d.value = e[HIDDEN_VAL_ATTR];
              allDefined &=
                d.value !== undefined && d.value !== null && d.value !== "";
              // $dis.depends[c].value = d.value;
              // console.log(d);
              // console.log(e);
            }
            if (!allDefined) {
              $dis.internalItems = [];
              console.log("not all depending values set. skipping fetch!");
              return;
            }
            console.log(`shouldda fetch data!`);
            $dis.fetchData();
          });
      }

      break; //fetch later
    }
  },
};
</script>