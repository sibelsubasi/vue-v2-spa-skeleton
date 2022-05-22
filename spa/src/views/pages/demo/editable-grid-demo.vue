<template>
  <v-main>
    <a-header />
    <a-breadcrumbs :crumbs="crumbs" />
    <v-container fluid>
      <v-row>
        <v-col>
          Editable Grid Demo
        </v-col>
      </v-row>
      <v-row class="text-right py-4" justify="end">
        <v-col>
          <v-btn small color="primary" @click="addRow()" class="mr-4">Yeni Satır</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>

          <v-data-table
            ref="editableGridInstance"
            :headers="editableGridHeaders"
            :items="lines"
            :loading="isLoading"
            class="elevation-2"
          >

          <template v-for="header in editableGridHeaders" v-slot:[concatItem(header.value)]="{ item }">
            <div :key="header.value">
              <v-select
                v-if="header.type == 'select'"
                v-model="item[header.value]"
                :items="taxPercentOptions"
                :item-text="item => item.text"
                :item-value="item => item.value"
                style="max-width:90px"
                hide-details
                dense
                :disabled="header.disable"
              ></v-select>

              <v-checkbox
                v-if="header.type == 'checkbox'"
                v-model="item[header.value]"
                v-bind:false-value="'N'"
                v-bind:true-value="'Y'"
                style="max-width:90px"
                hide-details
                dense
                :disabled="header.disable"
              ></v-checkbox>

              <v-text-field
                v-if="header.type == 'text'"
                v-model="item[header.value]"
                hide-details
                eager
                dense
                :disabled="header.disable"
              ></v-text-field>
            </div>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon
              small
              @click="deleteRow(item)"
            >
              clear
            </v-icon>
          </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>

    <a-footer />
  </v-main>
</template>

<script>
export default {
  name: "editable-grid-demo",
  components: {},
  data: (vm) => ({
    forcedGibUuid: 12345, //vm.$route.params.gibUuid,
    isLoading: false,
    editedIndex: -1,
    editedLine: {},
    crumbs: ["Yetenekler", "Editable Grid Demo"],
    models: {},
    headers: {},
    lines: [],

    editableGridHeaders: [
      { text: 'Satır', value: 'lineNumber', type: 'text', disable: true, width: 100 },
      { text: 'Tip', value: 'lineTypeLookupCode', type: 'text' },
      { text: 'Tutar', value: 'priceAmount', type: 'text' },
      { text: 'Vergi Kodu', value: 'taxCode', type: 'text' },
      { text: 'Vergi Oranı', value: 'taxPercent', type: 'select' },
      { text: 'Vergi Dahil', value: 'taxIncludedFlag', type: 'checkbox' },
      { text: 'Kaldır', value: 'actions', sortable: false },
    ],

    taxPercentOptions: [
      { text: "%18", value: "18" },
      { text: "%8", value: "8" }
    ],
         
  }),

  computed: {},
  watch: {
    "lines": {
        handler () {
          console.log("handler....");
          console.log(JSON.stringify(this.lines, null, 2));
        },
        deep: true,
      },
  },
  methods: {
    concatItem(s) {
      return "item." + s;
    },
    addRow(){
      let _defaultLine = {
        lineNumber: null,
        faturaId: this.headers.faturaID,
        Uuid: this.headers.gibUuid,
        lineTypeLookupCode: "",
        priceAmount: "",
        destSystemTaxCodeId: "",
        taxCode: "",
        taxPercent: "",
        taxIncludedFlag: "",
        taxRecoveryRate: "",
        glSegment1: "",
        glSegment2: "",
        glSegment3: "",
        glSegment4: "",
        glSegment5: "",
        glSegment6: "",
        glSegment7: "",
        glSegment8: "",
        note: "",
        invoicedQuantity: "",
        unitCode: "",
        taxAmount: "",
        unitPrice: "",
        supplierNote: "",
        brandName: "",
        modelName: "",
      };
      this.lines.push(_defaultLine);
    },
    deleteRow (item) {
      this.editedIndex = this.lines.indexOf(item);
      this.editedLine = Object.assign({}, item);
      this.$dialog
        .confirm({ text: this.$t("messages.areYouSure") })
        .then((t) => {
          return !t ? this.closeDelete(this) : this.deleteRowConfirm(this);
        });
    },
    deleteRowConfirm () {
      this.lines.splice(this.editedIndex, 1);
      this.closeDelete();
    },
	  closeDelete () {
        this.$nextTick(() => {
          //this.editedLine = Object.assign({}, this.defaultLine)
          this.editedIndex = -1
        });
    },
    refreshDataGrid() {
      this.fetchLines(this.forcedGibUuid);
    },

    //------------------------------------------------------------
    fetchLines(id) {
      console.log("fetchLines");
      this.isLoading = true;
      this.axios
        .get(`https://virtserver.swaggerhub.com/sibelsubasi/efa/1.0.0/efa/invoice/receivedApInvoice/` + encodeURI(this.id))
        .then((response) => {
          this.headers.faturaID = response.data.faturaID;
          this.headers.gibUuid = response.data.gibUuid;

          this.lines = response.data.line;

          // this.lines = [
          //   {
          //     "lineNumber": 1,
          //     "faturaId": "GIB20200000000001",
          //     "Uuid": "3f3eca24-66f9-4e91-ab53-6f7893475fd2",
          //     "lineTypeLookupCode": "ITEM",
          //     "priceAmount": "1916,36",
          //     "destSystemTaxCodeId": 12,
          //     "taxCode": "KATMA DEĞER VERGİSİ %18",
          //     "taxPercent": "18",
          //     "taxIncludedFlag": "Y",
          //     "taxRecoveryRate": "string",
          //     "glSegment1": "239",
          //     "glSegment2": "7700101",
          //     "glSegment3": "910",
          //     "glSegment4": "1013",
          //     "glSegment5": "000",
          //     "glSegment6": "0000",
          //     "glSegment7": "0000",
          //     "glSegment8": "0000",
          //     "note": "ATÖLYE ARITMA PRESİZİON DİŞLİ POMPA BAKIMI",
          //     "invoicedQuantity": "1",
          //     "unitCode": "C62",
          //     "taxAmount": "344,94",
          //     "unitPrice": "1916,36",
          //     "supplierNote": "Satır açıklaması gelecektir.",
          //     "brandName": "string",
          //     "modelName": "string"
          //   },
          //   {
          //     "lineNumber": 2,
          //     "faturaId": "GIB20200000000001",
          //     "Uuid": "3f3eca24-66f9-4e91-ab53-6f7893475fd2",
          //     "lineTypeLookupCode": "2ITEM",
          //     "priceAmount": "21916,36",
          //     "destSystemTaxCodeId": 212,
          //     "taxCode": "2KATMA DEĞER VERGİSİ %18",
          //     "taxPercent": "8",
          //     "taxIncludedFlag": "N",
          //     "taxRecoveryRate": "string",
          //     "glSegment1": "239",
          //     "glSegment2": "7700101",
          //     "glSegment3": "910",
          //     "glSegment4": "1013",
          //     "glSegment5": "000",
          //     "glSegment6": "0000",
          //     "glSegment7": "0000",
          //     "glSegment8": "0000",
          //     "note": "ATÖLYE ARITMA PRESİZİON DİŞLİ POMPA BAKIMI",
          //     "invoicedQuantity": "1",
          //     "unitCode": "C62",
          //     "taxAmount": "344,94",
          //     "unitPrice": "1916,36",
          //     "supplierNote": "Satır açıklaması gelecektir.",
          //     "brandName": "string",
          //     "modelName": "string"
          //   },
          // ];

          // console.log("--- lines ---");
          // console.log(JSON.stringify(this.lines, null, 2));
          this.isLoading = false;
        });
    },
  },
  mounted() {
    this.fetchLines(this.forcedGibUuid);
  },
  created() {}
};
</script>
