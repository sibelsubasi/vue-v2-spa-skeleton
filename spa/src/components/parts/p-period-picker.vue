<style>
.p-period-picker .v-date-picker-header {
  font-weight: bold;
}
.p-period-picker .v-date-picker-title__year {
  display: none;
}
</style>
<template>
  <v-date-picker
    ref="dp"
    class="p-period-picker"
    :min="min"
    :max="max"
    v-model="model"
    :landscape="landscape"
    :multiple="multiple"
    :full-width="fullWidth"
    :title-date-format="titleDateFormat"
  ></v-date-picker>
  <!-- 
      :year-format="ym" 
    :day-format="df"
    :month-format="mf"
    :title-date-format="ym"
  -->
</template>  

<script>
import Vue from "vue";

export default {
  name: "p-period-picker",
  props: {
    value: {},
    landscape: {
      type: Boolean,
      default: () => false
    },
    titleDateFormat: {},
    multiple: {
      type: Boolean,
      default: () => false
    },
    fullWidth: {
      type: Boolean,
      default: () => false
    }
  },
  data: vm => ({
    thisYear: new Date().getFullYear(),
    model: vm.value,
    dp: null
  }),
  computed: {
    min() {
      return `${this.thisYear}-01-01`;
    },
    max() {
      return `${this.thisYear}-12-31`;
    }
  },
  watch: {
    model: {
      handler(val) {
        // console.log(`model watcher in p-period-picker`);
        // console.log(val);
        this.updateValue(this.model);
      },
      deep: true
    }
  },
  methods: {
    updateValue: function(value) {
      this.$emit("input", value);
    }
  },
  created() {},
  mounted() {
    console.log(`mounted with value: ${this.value} and model ${this.model}`);
    // this.$nextTick(() => {
    this.dp = this.$refs.dp;
    var he = this.dp.$children[0].$children[1];

    console.log(this.dp);
    //console.log(he);
    he.genHeader = () => {
      let s = this.dp.tableDate.split("-")[1];
      return this.$t(`periodPicker.${s}`);
    };
    he.isReversing = true;
    he.isReversing = false; //force to re-call genHeader();

    //console.log(`p-picker: value ${JSON.stringify(this.value)} `);
  }
};
</script>