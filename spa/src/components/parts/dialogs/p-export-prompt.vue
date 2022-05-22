<template>
  <div>
    <DialogCard
      :title="title"
      :actions="actions"
      :handler="handlerClick"
      :title-class="titleClass"
      ref="card"
    >
      <v-text-field
        ref="input"
        v-model="editedValue"
        :rules="rules"
        :label="text"
        v-bind="textField"
        @keyup.enter.stop="onEnter"
      />
      <v-radio-group v-model="exportOption" row mandatory>
        <v-radio label="EXCEL" value="excel" :disabled="onlyCSV"></v-radio>
        <v-radio label="CSV" value="csv"></v-radio>
      </v-radio-group>
      <small v-if="onlyCSV">{{limit}} satırın üzerinde yalnızca CSV çıktısı alabilirsiniz.</small>
    </DialogCard>
  </div>
</template>

<script>
import Confirmable from "vuedl/src/mixins/confirmable";
import DialogCard from "vuetify-dialog/src/components/DialogCard.vue"; //'./DialogCard.vue'
import { VTextField } from "vuetify/lib";
export default {
  components: {
    DialogCard,
    VTextField,
  },
  layout: "default",
  mixins: [Confirmable],
  props: {
    value: String,
    rules: Array,
    limit: Number,
    onlyCSV: Boolean,
    textField: Object,
    titleClass: [String, Object],
    autofocus: {
      type: Boolean,
      default: true,
    },
    option: String,
  },
  data() {
    return {
      editedValue: this.value,
      exportOption: this.option, 
      exportData: {},
    };
  },
  mounted() {
    if (this.autofocus) {
      setTimeout(() => {
        this.$refs.input.focus();
        if (this.onlyCSV) {
          this.exportOption = "csv";
        }
      }, 100);
    }
  },
  methods: {
    onEnter() {
      this.$refs.card.$refs.actions.trigger(true);
    },
    handlerClick(res, action) {
      if (!action.key) {
        this.$emit("submit", action.key);
      }
      const valid = this.rules ? this.$refs.input.validate() : true;
      if (!valid) {
        this.$refs.input.focus();
        return false;
      }
      this.exportData = {
        mail: this.editedValue,
        type: this.exportOption,
      };
      this.$emit("submit", action.key ? this.exportData : action.key);
    },
  },
};
</script>
