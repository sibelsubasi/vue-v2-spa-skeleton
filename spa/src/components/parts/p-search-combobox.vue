<style>
.inner-autocomplete .v-input__control .v-input__slot .v-select__slot input {
  padding: 17px 0;
}
</style>
<template>
  <v-combobox
    :menu-props="{ maxHeight: '180' }"
    v-bind="$attrs"
    ref="combobox"
    v-model="model"
    :items="computedItems"
    :label="label"
    chips
    hide-selected
    multiple
    clearable
  >
    <template v-slot:selection="d">
      <v-chip
        close
        :key="JSON.stringify('__' + d.index)"
        v-bind="d.attrs"
        :input-value="d.selected"
        :disabled="d.disabled"
        @click.stop="$refs[`innerInput_${d.item.split(':')[0]}`].focus()"
        @click:close="d.parent.selectItem(d.item)"
      >
        <strong style="padding-right: 8px; color: #666"
          >{{ d.item.split(": ")[0] }}:</strong
        >
        <input
          v-if="!hasLookups(d.item.split(':')[0])"
          v-model="data[d.item.split(':')[0]]"
          :ref="`innerInput_${d.item.split(':')[0]}`"
          type="text"
          style="min-width: 30px; max-width: 150px; max-height: 30px"
          @keyup.enter="innerInputKeyUp(d.item.split(':')[0])"
          v-bind:style="{
            width: (data[d.item.split(':')[0]] + '').length * 8 + 'px',
          }"
        />
        <v-autocomplete
          v-else
          auto-select-first
          flat
          dense
          full-width
          :multiple="isMultipleLookups(d.item.split(':')[0])"
          @change="innerInputKeyUp(d.item.split(':')[0])"
          :menu-props="{
            closeOnClick: false,
            closeOnContentClick: true,
            openOnClick: false,
          }"
          v-model="data[d.item.split(':')[0]]"
          class="inner-autocomplete"
          style="min-width: 30px; max-width: 150px; max-height: 50px"
          :ref="`innerInput_${d.item.split(':')[0]}`"
          :items="dataTextSourceLookups[d.item.split(':')[0]]"
        >
          <template v-slot:selection="{ item, index }">
            <span v-if="index === 0">{{ item.text }}</span>
            <span v-if="index === 1" class="grey--text caption" style="padding-left:5px"
              >(+{{ data[d.item.split(':')[0]].length - 1 }})</span
            >
          </template>
        </v-autocomplete>
      </v-chip>
    </template>
  </v-combobox>
</template>  
<script>

import Vue from "vue";

export default {
  name: "p-search-combobox",
  props: {
    label: {
      type: String,
      required: true,
      default: () => "Ara..",
    },
    itemText: {
      type: String,
      required: false,
      default: () => "label",
    },
    itemValue: {
      type: String,
      required: false,
      default: () => "source",
    },
    value: {},
    columns: {
      type: Array,
      required: true,
    },
    allowSearchAll: {
      type: Boolean,
      required: false,
      default: () => true,
    },
    // items: {
    //   type: Array,
    //   default: () => []
    // },
    disabled: {
      type: Boolean,
      default: () => false,
    },
  },
  data: (vm) => ({
    data: {}, //vm.value,
    dataPositions: {},
    dataTextSourceMap: {},
    dataTextSourceLookups: {},
    dataTextSourceLookupsMultiple: {},
    items: [],
    combobox: null,
    semaphore: false,
    boxOpen: false,
    isBusy: false,
    ready: false,
  }),
  computed: {
    model: {
      get() {
        console.log(`model.get`);
        var ret = [].fill(null, 0, this.items.length);
        for (let i in this.data) {
          if (this.data[i] !== null) {
            var c = this.data[i];
            // console.log(`c: ${c} ii: ${i}`);
            c = c && c.trim ? c.trim() : c;

            ret[parseInt(this.dataPositions[i])] =
              c && c ? i + ": " + c : i + ": ";
            //ret.push(c && c.trim() ? i + ": " + c : i + ": ");
          }
        }
        // console.log(ret.filter(v => v != null));
        return ret.filter((v) => v != null);
      },
      set(value) {
        console.log(`model.set`);
        // console.log(value);
        for (let i in this.data) {
          this.$set(this.data, i, null);
          //  this.data[i] = null;
        }
        var indexB4 = null;
        var emptyValueHasB4 = false;
        var willFocusOnSth = false;

        for (let i in value) {
          console.log(`model.set ${i} in ${value}`);

          let valueAtIndex = value[i];
          let spl = valueAtIndex.split(":");

          let key = spl[0];

          key = key && key.trim ? key.trim() : key;

          var isLookup = !!this.dataTextSourceLookups[key];
          var isMultipleLookups = !!this.dataTextSourceLookupsMultiple[key];
          console.log(`isLookup ${isLookup}`);

          let splWoIndex0 = [];
          for (let j = 1; j < spl.length; j++) {
            splWoIndex0.push(spl[j]);
          }
          let val = splWoIndex0.length > 0 ? splWoIndex0.join(":").trim() : ""; //(spl[1] && spl[1].trim()) || "";
          if (isLookup && val.match(/^-?\d+$/)) {
            val = parseInt(val); //valid integer (positive or negative)
          } else if (isLookup && val.match(/^\d+\.\d+$/)) {
            val = parseFloat(val);
          } else {
            if (!isMultipleLookups) {
              val = ("" + val).trim();
            } else {
              if (typeof val == "string") {
                let ret = [];
                val.split(",").forEach((v) => {
                  v && ret.push(v);
                });
                val = ret;
              }
            }
          }

          // if (spl.length < 2) {
          //   val = key;
          //   key = "*";
          // } else {
          var itemIndex = this.items.findIndex((item) => {
            // console.log(`regexp check: ${key} in  ${item}`);
            return (
              item == key ||
              item == key + ":" ||
              (new RegExp(item, "i").test(key) && item.length == key.length) ||
              (new RegExp(item, "i").test(key + ":") &&
                item.length == key.length + 1) ||
              item.toLocaleLowerCase("tr-TR") ==
                key.toLocaleLowerCase("tr-TR") ||
              item.toLocaleLowerCase("tr-TR") ==
                key.toLocaleLowerCase("tr-TR") + ":"
            );
          });
          // console.log(`itemIndex: ${itemIndex}`);
          if (itemIndex == -1) {
            if (this.allowSearchAll) {
              // val = key; // + ": " + (val + "");
              if (val) {
                val = val + "";
              } else {
                val = key;
              }
              key = "*";
            } else {
              key = this.items[0];
            }
          } else {
            key = this.items[itemIndex];
          }
          // if (this.items.indexOf(key) == -1) {
          //   key = "*";
          // }
          // }
          // if (val) {
          //   val = val.replaceAll(":", ";");
          // }

          if (emptyValueHasB4 && indexB4) {
            // console.log(`keyb4: ${indexB4}`);
            this.$set(this.data, indexB4, null);
            this.$set(this.dataPositions, indexB4, null);
            // key = indexB4;
          }
          // console.log(`setting this.data with key: ${key} value: ${val} dataHasKeyB4: ${this.data[key] !== undefined}`);
          this.$set(this.data, key, val);
          this.$set(this.dataPositions, key, i);
          emptyValueHasB4 = !val;
          indexB4 = key;
          if (!val) {
            willFocusOnSth = true;
            this.$nextTick(() => {
              var ref = this.$refs[`innerInput_${key}`];
              console.log(`key to focus: ${key}, hasref: ${!!ref}`);
              //this.combobox.setSearch("");
              this.semaphore = true;

              // this.combobox.isMenuActive = false;
              this.combobox.isFocused = false;
              // this.combobox.selectedIndex = -1;
              // this.combobox.setMenuIndex(-1);

              // console.log(this.combobox);
              ref && ref.focus();
              ref && ref.activateMenu && ref.activateMenu();
              // console.log(ref);
              setTimeout(() => (this.semaphore = false), 100);
              this.combobox.lazySearch = "";
            });
          }
          if (key == "*") {
            this.$nextTick(() => {
              !willFocusOnSth && this.combobox.blur();
            });
          }
          // this.data[key] = val;
        }
      },
    },
    computedItems() {
      var ret = [];
      for (let i in this.items) {
        let it = this.items[i];
        // console.log(`computed items ${it} hasInData: ${this.data[it]}`);
        this.data[it] == null && ret.push(it + ": ");
      }
      return ret;
    },
  },
  watch: {
    model: {
      handler(val) {
        // console.log(`model handler: semaphore is ${this.semaphore}`);
        this.updateValue(this.model);
      },
      deep: true,
    },
  },
  methods: {
    isMultipleLookups(v) {
      return !!this.dataTextSourceLookupsMultiple[v];
    },
    hasLookups(v) {
      return !!this.dataTextSourceLookups[v];
    },
    bindNewValues(val) {
      // this.semaphore = true;
      // this.model = [];
      val.forEach((k) => {
        //console.log(`bind new values: ${k.label} to ${k.model}`);
        // k.model && this.model.push(k.label+": "+k.model);
        this.$set(this.data, k.label, k.model || null);
      });
      // console.log(`bind new values res: `);
      // console.log(this.data);
      // console.log(this.model);
      // this.semaphore = false;
    },
    setBusy(val) {
      this.isBusy = !!val;
    },
    canStartSearch() {
      if (this.isBusy || !this.ready) {
        return false;
      }
      return !this.boxOpen;
    },
    asSourceMapping() {
      var copyData = {};
      // console.log(this.dataTextSourceMap);
      for (let i in this.data) {
        let v = this.data[i];
        if (!v) {
          continue;
        }
        let key =
          this.dataTextSourceMap[i] === undefined
            ? "search"
            : this.dataTextSourceMap[i];
        copyData[key] = v;
      }
      // console.log(`copyData`);
      // console.log(copyData);
      return copyData;
    },
    innerInputKeyUp(index) {
      if (this.semaphore) {
        return;
      }
      // console.log(`innerInputKeyUp!`);
      this.$refs[`innerInput_${index}`].blur();
      this.$nextTick(() => {
        this.combobox.blur();
        //document.activeElement && document.activeElement.blur();
      });
    },
    updateValue: function (value) {
      var copyValue = [];
      for (let i in value) {
        if (value[i].split(": ")[1]) {
          copyValue.push(value[i]);
        }
      }
      if (!this.ready && value && value.length > 0) {
        console.log(`p-search-combo is ready`);
        console.log(value);
        this.ready = true;
      }
      this.$emit("input", copyValue);
    },
  },
  created() {},
  mounted() {
    this.combobox = this.$refs.combobox;

    var onMenuActiveChangeOrig = this.combobox.onMenuActiveChange;
    this.combobox.onMenuActiveChange = (e) => {
      // console.log(`onMenuActiveChange: gotcha!: ${e}`);
      this.boxOpen = e;
      if (!e) {
        var newModel = [];
        for (let i in this.model) {
          let spl = this.model[i].split(":");
          let key = spl[0];
          let value = spl[1] && spl[1];
          value = value && value.trim ? value.trim() : value;

          if (value) {
            let valToPush = key == "*" ? value : this.model[i];
            // console.log("pushingggg" + valToPush);
            newModel.push(valToPush);
          }
        }
        this.model = newModel;
      }
      return onMenuActiveChangeOrig && onMenuActiveChangeOrig(e);
    };

    for (let i in this.columns) {
      var col = this.columns[i];
      var label = col[this.itemText];
      var source = col[this.itemValue];

      this.items.push(label);
      this.dataTextSourceMap[label] = source;

      if (col.lookups) {
        this.dataTextSourceLookups[label] = col.lookups;
      }

      if (col.multiple) {
        this.dataTextSourceLookupsMultiple[label] = true;
      }
    }
    console.log(`generated items from coluns..`);
    console.log(this.items);
    console.log(this.dataTextSourceMap);
    console.log(this.dataTextSourceLookups);
    console.log(this.combobox);

    for (let i in this.items) {
      this.$set(this.data, this.items[i], null);
    }
    var c = 0;
    for (let i in this.data) {
      this.$set(this.dataPositions, i, c++);
    }
    console.log(this.data);
    console.log(this.dataPositions);
    console.log(this.model);
  },
};
</script>