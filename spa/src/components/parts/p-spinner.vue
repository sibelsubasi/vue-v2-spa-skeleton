  <template>
  <v-text-field :label="label" :value="value" readonly type="text" :disabled="disabled">
    <!-- v-on:input="updateValue($event.target.value)" -->
    <template v-slot:append>
      <div style="position:relative; width:40px;height:28px">
        <v-btn
          @click="up"
          icon
          small
          absolute
          :disabled="disabled"
          style="right:0; top:-15px;background-color:#fff;z-index:1"
        >
          <v-icon small>keyboard_arrow_up</v-icon>
        </v-btn>
        <v-btn
          @click="down"
          icon
          small
          absolute
          :disabled="disabled"
          style="right:0; top:15px;background-color:#fff;z-index:1"
        >
          <v-icon small>keyboard_arrow_down</v-icon>
        </v-btn>
      </div>
    </template>
  </v-text-field>
</template>  
<script>
import Vue from "vue";

export default {
  name: "p-spinner", 
  props: {
    label: {
      type: String,
      required: true,
      default: () => "Heading"
    },
    value: {
      type: Number,
      required: false,
      default: () => 0
    },
    disabled: {
      type: Boolean
    },
    min: {
      type: Number,
      required: false,
      default: () => null
    },
    max: {
      type: Number,
      required: false,
      default: () => null
    },
    step: {
      type: Number,
      required: false,
      default: () => 1
    }
  },
  data: vm => ({
    model: (vm.value && parseInt(vm.value)) || 0,
    stepInt: parseInt(vm.step),
    minInt: vm.min == null ? null : parseInt(vm.min),
    maxInt: vm.max == null ? null : parseInt(vm.max)
  }),
  computed: {},
  watch: {},
  methods: {
    updateValue: function(value) {
      this.$emit("input", value);
    },
    down() {
      if (this.minInt === null || this.model - this.stepInt >= this.minInt) {
        this.model -= this.stepInt;
        this.updateValue(this.model);
      }
    },
    up() {
      if (this.maxInt === null || this.model + this.stepInt <= this.maxInt) {
        this.model += this.stepInt;
        this.updateValue(this.model);
      }
    }
  },
  created() {},
  mounted() {}
};
</script>