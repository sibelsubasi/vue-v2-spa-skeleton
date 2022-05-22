  <template>
    <v-dialog
      v-model="show"
      persistent
      max-width="450"
    >
      <v-card
        class="pt-3 pb-3 px-4 text-left"
        color="primary"
        dark
      >
        <v-card-title class="black--text">
          {{title}}
        </v-card-title>
        <v-card-text class="black--text pb-2">
          <v-row align="center">
            <v-col cols="2">
              <v-icon
                x-large
                color="black"
              >
                warning_amber
              </v-icon>
            </v-col>
            <v-col class="text-subtitle-1">{{message}}</v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="black"
            text
            @click="close"
          >
            Tamam
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>  
<script>
import Vue from "vue";

export default {
  name: "p-warning-dialog",
  props: {
    show: {
      type: Boolean,
      required: false,
      default: () => false
    },
    title: {
      type: String,
      required: false,
      default: () => ""
    },
    message: {
      type: String,
      required: false,
      default: () => ""
    },
  },
  data: (vm) => ({}),
  computed: {},
  watch: {},
  methods: {
    close() {
      this.$emit('close'); // emitting to parent
    },
  },
  created() {},
  mounted() {}
};
</script>