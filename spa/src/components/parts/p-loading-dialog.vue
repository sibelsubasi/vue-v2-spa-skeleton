  <template>
    <v-dialog
      v-model="loading"
      persistent
      width="354"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text class="white--text pt-1 pb-4">
          {{$t(`messages.loadingPleaseStandBy`)}}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>  
<script>
import Vue from "vue";

export default {
  name: "p-loading-dialog",
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: () => false
    },
  },
  data: vm => ({}),
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {}
};
</script>