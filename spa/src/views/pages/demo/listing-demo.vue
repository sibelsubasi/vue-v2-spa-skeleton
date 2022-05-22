<template>
  <v-main>
    <a-header />
    <a-breadcrumbs :crumbs="crumbs" />
    <p-importer
      ref="importer"
      :label="$t('routes.dataListing')"
      module="importer-demo"
      :columns="importerColumns"
      :refreshHook="refreshDataGrid"
    />

    <p-form
      ref="dataform"
      caption="Demo Form"
      :actions="formActions"
      :models="models"
      :autoCloseAfter="true"
      :refreshHook="refreshDataGrid"
    >
      <template slot="content">
        <v-row>
          <v-col>
            <v-text-field
              v-model="models.ad"
              label="Ad"
              :rules="validation().required().alphaTr().toRules('Ad')"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="models.soyad"
              label="Soyad"
              :rules="validation().required().alphaTr().toRules('Soyad')"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <p-unique-textfield
              v-model="models.email"
              label="E-Posta"
              :rules="validation().required().email().toRules('E-Posta')"
              url="/demo/checkDemoEmail"
            ></p-unique-textfield>
          </v-col>
          <v-col>
            <v-select
              v-model="models.gender"
              :items="[{ value: 'K', text: 'Kadın' },{ value: 'E', text: 'Erkek' },{ value: 'B', text: 'Belirtilmemiş' }]"
              label="Cinsiyet"
              :rules="validation().required().toRules('Cinsiyet')"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="models.tckn"
              label="TCKN"
              :rules="validation().required().integer().charMin(11).charMax(11).toRules('TCKN')"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-select
              v-model="models.kangrubu"
              :items="['A+', 'A-', 'B+','B-','0+','0-','AB+','AB-']"
              label="Kan Grubu"
              :rules="validation().required().toRules('Kan Grubu')"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="models.tel" label="Telefon"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="models.faks" label="Faks"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-if="inEdit">
            <v-switch v-model="models.aktif" label="Aktif"></v-switch>
          </v-col>
          <v-col cols="6">
            <v-menu
              v-model="filterADateVisibility"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="models.adate"
                  label="Bir Tarih"
                  prepend-inner-icon="event"
                  v-on="on"
                  readonly
                ></v-text-field>
              </template>
              <v-date-picker v-model="models.adate" no-title @input="filterADateVisibility = false">
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="primary"
                  @click="filterADateVisibility = false; models.adate = null"
                >{{$t('actions.clear')}}</v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea v-model="models.adres" label="Adres"></v-textarea>
          </v-col>
        </v-row>
      </template>
    </p-form>

    <p-datagrid
      ref="datagridInstance"
      :url="gridUrl"
      :selectable="gridSelectable"
      :uniqueColumn="gridUniqueColumn"
      :headers="gridHeaders"
      :exportable="gridExportable"
      :clearable="gridClearable"
      :filters="gridFilters"
      :rowActions="gridRowActions"
      :massActions="gridMassActions"
      :actions="gridActions"
      :searchable="gridSearchable"
      :icon="gridIcon"
      :caption="gridCaption"
    />
    <a-footer />
  </v-main>
</template>

<script>
export default {
  name: "listing-demo",
  components: {},
  data: vm => ({
    inEdit: false,
    filterADateVisibility: false,
    models: {
      ad: null,
      soyad: null,
      email: null,
      gender: null,
      kangrubu: null,
      tckn: null,
      tel: null,
      faks: null,
      adres: null,
      aktif: null,
      adate: null
    },
    crumbs: ["Yetenekler", vm.$t("routes.dataListing")],

    //IMPORTER
    importerColumns: [
      { label: "Durum", source: "aktif" },
      { label: "Ad", source: "ad" },
      {
        label: "Soyad",
        source: "soyad"
        //validation: col => (col.length > 5 ? null : "En az 5 karakter olmalı")
      },
      { label: "TCKN", source: "tckn", required: true, format: "float" },
      { label: "Telefon", source: "tel" },
      { label: "Faks", source: "faks" },
      {
        label: "Bir Tarih",
        source: "adate",
        format: "date"
      },
      { label: "Kangrubu", source: "kangurubu" },
      { label: "Cinsiyet", source: "cinsiyet" },
      { label: "E-Posta", source: "email" }
    ],

    //FORM
    formActions: [
      {
        text: vm.$t("actions.save"),
        api: { url: "/demo", method: "put" },
        condition: null
      },
      {
        text: vm.$t("actions.update"),
        fetch: { url: "/demo", id: "id" },
        api: { url: "/demo", method: "patch" },
        condition: "edit"
      }
    ],

    //DATAGRID
    gridUrl: "/demo/list",
    gridClearable: true, // no-need,default is true
    gridSearchable: true, //no-need,default is true
    gridSelectable: true,
    gridExportable: true,
    gridUniqueColumn: "id",
    gridIcon: "format_list_numbered",
    gridCaption: vm.$t("routes.dataListing"),

    gridHeaders: [
      {
        text: "No",
        align: "center",
        sortable: false,
        unExportable: true,
        value: "ai",
        format: item => "font-weight-bold"
      },
      {
        text: "İşlemler",
        value: "action",
        sortable: false,
        unExportable: true
      },
      {
        text: "Durum",
        value: "aktif",
        format: item => (item.aktif ? "green--text" : "red--text"),
        callable: item => (item.aktif ? "Aktif" : "Pasif")
      },
      { text: "Ad", value: "ad", sortable: false },
      {
        text: "Soyad",
        value: "soyad",
        format: item => (item.ai % 2 == 0 ? "red--text" : "blue--text")
      },
      { text: "TCKN", value: "tckn" },
      { text: "Telefon", value: "tel" },
      { text: "Faks", value: "faks" },
      {
        text: "Bir Tarih",
        value: "adate",
        callable: item => item.adate && vm.utils.formatDate(item.adate)
      },
      { text: "Kan Grubu", value: "kangrubu", format: () => "red--text" },
      {
        text: "Cinsiyet",
        value: "gender",
        callable: item =>
          item.gender == "E"
            ? "Erkek"
            : item.gender == "K"
            ? "Kadın"
            : "Belirsiz"
      },
      {
        text: "E-Posta",
        value: "email"
      }
    ],

    gridFilters: [
      {
        type: "text",
        name: "soyad",
        label: "Soyad"
      },
      {
        type: "select",
        name: "gender",
        label: "Cinsiyet",
        large: true,
        lookups: [
          { value: "E", text: "Erkek" },
          { value: "K", text: "Kadın" },
          { value: "B", text: "Belirtilmemiş" }
        ]
      },
      {
        type: "select",
        name: "kangrubu",
        label: "Kan Grubu",
        multiple: true,
        large: true,
        lookups: [
          { value: "A-", text: "A Rh (-)" },
          { value: "A+", text: "A Rh (+)" },
          { value: "B-", text: "B Rh (-)" },
          { value: "B+", text: "B Rh (+)" },
          { value: "0-", text: "0 Rh (-)" },
          { value: "0+", text: "0 Rh (+)" },
          { value: "AB-", text: "AB Rh (-)" },
          { value: "AB+", text: "AB Rh (+)" }
        ]
      },
      {
        type: "date",
        name: "adate",
        label: "Bir Tarih"
      }
    ],
    gridMassActions: [
      {
        label: "Seçilileri Pasif Yap",
        icon: "delete",
        warn: true,
        action: async items => {
          try {
            var response = await vm.axios.post("demo/allPassive", items);
            vm.$dialog.notify.info(
              response.data.affected + " kayıt pasif yapıldı.",
              {
                position: "top-right"
              }
            );
            vm.$refs.datagridInstance.refresh();
          } catch (error) {
            vm.$dialog.error({ text: error.response.data.message });
          }
        }
      }
    ],
    gridRowActions: [
      {
        icon: "edit",
        hint: "Düzenle",
        color: "blue",
        action: item => {
          vm.inEdit = true;
          vm.$refs.dataform.showFetch(item, "edit", "Düzenle");
        }
      },
      {
        icon: "delete",
        hint: "Sil",
        color: "red",
        warn: true,
        action: async (item, self) => {
          try {
            await vm.axios.delete("demo/" + encodeURI(item.id));
            vm.$refs.datagridInstance.refresh();
          } catch (error) {
            vm.$dialog.error({ text: error.response.data.message });
          }
        },
        guard: (item, self) => {
          return item["aktif"];
        }
      }
    ],
    gridActions: [
      {
        // label: "Yeni Ekleler misin",
        // icon: "add_circle_outline",
        // color: "purple",
        // dark: true,
        action: () => {
          vm.inEdit = false;
          vm.$refs.dataform.show("Ekle");
        }
      },
      {
        label: "İçeri Aktar",
        icon: "cloud_upload",
        color: "purple",
        fab: false,
        small: true,
        dark: true,
        action: () => {
          vm.$refs.importer.show();
        }
      }
    ]
    //END OF DATAGRID
  }),
  watch: {
    models: {
      handler(val) {
        if (this.models.adate && !this.utils.checkDate(this.models.adate)) {
          this.models.adate = null;
        }
      },
      deep: true
    }
  },
  computed: {},
  methods: {
    refreshDataGrid() {
      this.$refs.datagridInstance.refresh();
    }
  },
  created() {},
  mounted() {}
};
</script>
