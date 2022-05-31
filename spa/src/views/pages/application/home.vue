
<template>
  <v-main>
    <a-header />
    <a-stepper :currentStep="currentStep" />

    <!-- Dialog Boxes -->
    <p-loading-dialog :loading="isLoading"></p-loading-dialog>
    <p-warning-dialog :show="showError" @close="showError = false" :message="errorMessage"></p-warning-dialog>
    <p-info-dialog :show="showInfo" @close="showInfo = false" :message="infoMessage"></p-info-dialog>
    <p-actions-dialog 
      :show="showActions" 
      :showClick="showActionsClick"
      @click="click()"
      @cancel="cancel()" 
      :message="infoMessage"
      :title="infoTitle"
      :subtitle="infoSubTitle"
    ></p-actions-dialog>
    <!-- /Dialog Boxes -->

    <v-container fluid class="py-0">
      <v-row justify="center">
        <v-col cols="5" class="py-6 text-center">
        
          <v-form v-if="true && !showError" ref="dataForm" @submit.prevent="submitHandlerForm">
            <div>
              <v-row justify="center">
                <v-col cols="12" align="center" class="py-0">
                  <!-- 
                  <v-text-field
                    v-model="models.basvuruTarihi"
                    :label="$t(`pages.home.basvuruTarihi`)"
                    :rules="
                      validation()
                        .required()
                        .date('DD-MM-YYYY')
                        .toRules($t(`pages.home.basvuruTarihi`))
                    "
                    v-mask="'##-##-####'"
                    hint="gg-aa-yyyy"
                    validate-on-blur
                    :append-icon="'mdi-calendar-text'"
                    clearable
                    persistent-hint
                    outlined
                    dense
                    style="min-width: 304px; max-width: 304px;"
                  ></v-text-field>
                  -->
                  <v-menu
                    ref="basvuruTarihi"
                    v-model="basvuruTarihi"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    max-width="290px"
                    offset-y
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-on="on"
                        v-bind="attrs"
                        v-model="models.basvuruTarihi"
                        :label="$t(`pages.home.basvuruTarihi`)"
                        :rules="
                          validation()
                            .required()
                            .date('DD-MM-YYYY')
                            .toRules($t(`pages.home.basvuruTarihi`))
                        "
                        append-icon="mdi-calendar-text"
                        v-mask="'##-##-####'"
                        hint="gg-aa-yyyy"
                        autocomplete="off"
                        persistent-hint
                        clearable
                        outlined
                        dense
                        @blur="parsedDate = parseDate(models.basvuruTarihi)"
                        style="min-width: 304px; max-width: 304px;"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="parsedDate"
                      no-title
                      scrollable
                      @input="basvuruTarihi = false, models.basvuruTarihi = formatDate(parsedDate)"
                      first-day-of-week="1"
                      :weekday-format="weekdayFormat"
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="
                          models.basvuruTarihi = '';
                          basvuruTarihi = false;
                        "
                        >{{ $t("actions.clear") }}</v-btn
                      >
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" align="center" class="py-0">
                  <v-text-field
                    v-model="models.unvani"
                    :label="$t(`pages.home.unvani`)"
                    :rules="validation().toRules($t(`pages.home.unvani`))"
                    validate-on-blur
                    outlined
                    dense
                    readonly
                    :disabled="forceDisabled"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col cols="6" align="center" class="py-0">
                  <v-text-field
                    v-model="models.adi"
                    :label="$t(`pages.home.adi`)"
                    :rules="validation().required().alphaTr().charMin(3).toRules($t(`pages.home.adi`))"
                    validate-on-blur
                    outlined
                    dense
                    :disabled="forceDisabled"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" align="center" class="py-0">
                  <v-text-field
                    v-model="models.soyadi"
                    :label="$t(`pages.home.soyadi`)"
                    :rules="validation().required().alphaTr().toRules($t(`pages.home.soyadi`))"
                    validate-on-blur
                    outlined
                    dense
                    :disabled="forceDisabled"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col cols="6" align="center" class="py-0">
                  <p-currency-textfield 
                    v-model="models.aracKrediTutari"
                    :label="$t(`pages.home.aracKrediTutari`)"
                    :rules="validation().required().notVal(0).toRules($t(`pages.home.aracKrediTutari`))"
                    validate-on-blur
                    disableDecimal
                    dense
                    outlined
                    :disabled="forceDisabled"
                  >
                  </p-currency-textfield>
                </v-col>
                <v-col cols="6" align="center" class="py-0">
                  <v-text-field
                    v-model="models.vade"
                    :label="$t(`pages.home.vade`)"
                    :rules="validation().required().integer().max(60).toRules($t(`pages.home.vade`))"
                    validate-on-blur
                    outlined
                    dense
                    :disabled="forceDisabled"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col cols="6" align="left" class="py-0">
                  <p-currency-textfield 
                    v-model="models.aracFaturaTutari"
                    :label="$t(`pages.home.aracFaturaTutari`)"
                    :rules="
                        validation()
                        .required()
                        .notVal(0)
                        .toRules($t(`pages.home.aracFaturaTutari`))"
                    validate-on-blur
                    disableDecimal
                    dense
                    outlined
                    :disabled="forceDisabled"
                  >
                  </p-currency-textfield>
                </v-col>
                <v-col cols="6" align="left" class="py-0">
                  <v-btn
                    type="submit"
                    style="margin-top:2px;"
                    depressed
                    :disabled="isLoading"
                    color="primary black--text"
                    >{{ $t(`actions.query`) }}
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-form>

        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>    

<script>
import store from "@/store";
import router from "@/router";
import moment from "moment";

const GLOBAL_VALUE = 11;
const ANOTHER_GLOBAL_VALUE = 22;
const CURRENT_STEP = 1;

export default {
  name: "application-home",
  components: {},
  data: (vm) => ({
    GLOBAL_VALUE,
    ANOTHER_GLOBAL_VALUE,
    user: store.state.user,
    paramId: vm.$route.params.id, //comes from router.push from another pages
    paramName: vm.$route.params.name, //comes from router.push from another pages
    currentStep: CURRENT_STEP, //Set current screen step here..
    isLoading: false,
    forceDisabled: false,
    showError: false,
    showInfo: false,
    showActions: false,
    showActionsClick: false,
    errorMessage: "",
    infoMessage: "",
    infoTitle: "",
    infoSubTitle: "",
    
    models: {
      name: "",
      surname: "",
    },

    params: {
      id: "",
      name: "",
    },

    itemOptions: [
      //{ text: "Seçiniz", value: 'null' },
      { text: "Test 1", value: 1 },
      { text: "Test 2", value: 2 },
    ],
    basvuruTarihi: null, //datePicker
    parsedDate: null, //datePicker
  }),
  watch: {},
  computed: {
    cp_forceDisabled(){
      return true; // Some conditions here..
    }
  },
  methods: {
    weekdayFormat(d) {
      var daysOfWeek = this.$t("datePicker.daysOfWeek");
      let i = new Date(d).getDay(d);
      return daysOfWeek[i];
    },
    parseDate(date) {
      if (!date) return null;
      const [day, month, year] = date.split('-');
      let parsedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      let ret = moment(`${parsedDate}`, "YYYY-MM-DD", true).isValid() ? parsedDate : null;
      return ret;
    },
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');
      let formattedDate = `${day}-${month}-${year}`;
      let ret = moment(`${formattedDate}`, "DD-MM-YYYY", true).isValid() ? formattedDate : null;
      return ret;
    },

    click(){

    },

    cancel(){

    },

    async submitHandlerForm(){
      if (this.$refs.dataForm.validate()) {
        this.isLoading = true;
        this.showError = false;
        this.forceDisabled = true;

        try {
          await this.axios
          .post(`https://virtserver.swaggerhub.com/ssubasi/Scheduler/1.0.0/basvurugiris/sakla`, // dummy api
            {
              reqField1: "",
              reqField2: "",
            }
          )
          .then((response) => {
            var res = response.data;
            this.isLoading = false;

            // A number of processes.. bla bla...
            // ......
            this.forceDisabled = false;
            console.log("submitHandlerForm completed..");

          }).catch((error) => {
            this.forceDisabled = false;
            this.isLoading = false;
            this.$dialog.error({ text: this.$t("errors.serviceErrorOccured", { service: `${error.config.url}` }) });
            return;
          });
          
        } catch (error) {
          this.forceDisabled = false;
          this.isLoading = false;
          //this.$dialog.error({ text: this.$t(`errors.unknownNetworkError`) });
        }
      }
    },

    routerPush() {
      router.push({
        name: 'application-pagename',
        params: { id: this.params.id, name: this.params.name },
      });
    },

  },
  async mounted() {
    //await this.call_web_service();
  },
  created() {
    
  },
};
</script>