  <template>
    <v-dialog
      v-model="show"
      persistent
      max-width="550"
    >
      <v-card
        class="pt-10 pb-3 px-4 text-left"
        color="primary"
        dark
      >
        <v-card-title class="black--text">
        </v-card-title>
        <v-card-text class="black--text pb-10">
          <v-row align="center">
            <v-col cols="2">
              <v-icon
                x-large
                color="black"
              >
                info_amber
              </v-icon>
            </v-col>
            <v-col cols="10">
              <v-row class="text-h6">
                {{title}} {{subtitle}}

                <div v-show="subtitle !== null && subtitle !== ''">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      dark
                      v-bind="attrs"
                      v-on="on"
                      color="primary"
                      style="top:-8px"
                      @click="copyTextToClipboard(subtitle)"
                    >
                      <v-icon small color="black">mdi-content-copy</v-icon>
                    </v-btn>
                  </template>
                  <span>{{copyText}}</span>
                </v-tooltip>
                </div>

              </v-row>
              <v-row class="text-body-1">{{message}}</v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-show="showCancel"
            color="black"
            text
            @click="cancel"
          >
            {{cancelText}}
          </v-btn>
          <v-btn
            v-show="showClick"
            color="black--text primary"
            @click="click"
          >
            {{clickText}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>  
<script>
import Vue from "vue";

export default {
  name: "p-actions-dialog",
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
    subtitle: {
      type: String,
      required: false,
      default: () => ""
    },
    message: {
      type: String,
      required: false,
      default: () => ""
    },
    showClick: {
      type: Boolean,
      required: false,
      default: () => true
    },
    showCancel: {
      type: Boolean,
      required: false,
      default: () => true
    },
    cancelText: {
      type: String,
      required: false,
      default: () => "Vazgeç"
    },
    clickText: {
      type: String,
      required: false,
      default: () => "Devam"
    },
  },
  data: (vm) => ({
    copyText: "Kopyala",
  }),
  computed: {},
  watch: {},
  methods: {
    cancel() {
      this.copyText = "Kopyala";
      this.$emit('cancel'); // emitting to parent
    },
    click() {
      this.copyText = "Kopyala";
      this.$emit('click'); // emitting to parent
    },
    copyTextToClipboard(text) {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text);
        this.copyText = "Kopyalandı";
        return;
      } 
      this.copyText = "Unable to copy";
      return;
      //return Promise.reject('The Clipboard Copy API is not available.');
    },
  },
  created() {},
  mounted() {}
};
</script>