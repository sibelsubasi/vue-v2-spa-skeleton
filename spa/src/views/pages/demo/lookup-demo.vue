<template>
  <v-main>
    <a-header />
    <v-container fluid>
      Lookup Demo
      <!-- <v-row>
        <v-col cols="6">
          <p-search-combobox
            v-model="parsedSearchCombobox"
            :items="headersForFilters"
            :label="$t('actions.search')"
          />
        </v-col>
      </v-row> -->
      <v-row>
        <v-col>
          <p-lookup
            id="SelectCitiesInput"
            v-model="models.city"
            label="İl"
            :rules="validation().required().toRules('İl')"
            fetch="/v1/lookup/get/cities"
            outlined
            dense
          ></p-lookup>
        </v-col>
        <v-col class="pb-0">
          <p-lookup
            id="SelectTownsInput"
            v-model="models.district"
            label="İlçe"
            :rules="validation().required().toRules('İlçe')"
            fetch="/v1/lookup/get/towns"
            :depends="[
              { input: 'SelectCitiesInput', type: 'segment', field: 'key' },
            ]"
            outlined
            dense
          ></p-lookup>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <p>{{ models }}</p>
        </v-col>
      </v-row>
    </v-container>
    <a-footer />
  </v-main>
</template>

<script>
export default {
  name: "lookup-demo",
  components: {},
  data: () => ({
    parsedSearchCombobox: null,
    headersForFilters: [
      "İl",
      "İlçe",
      "Mahalle",
      "Test 1",
      "Test 2",
      "Test 3",
    ],
    models: {
      city: "AĞRI"
    },
    ilModel: null,
    ilceModel: null,
    semtModel: null,
    fetchOptions: {
      method: "get",
      auth: { username: "webportal", password: "Grt*portal19" },
    },
  }),
  watch: {
    parsedSearchCombobox: {
      handler(val) {
        console.log("PARSED SEARCH COMBO WATCHER:" + this.parsedSearchCombobox);
      },
    },
    ilModel: {
      handler(val) {
        console.log("ilModel:" + this.ilModel);
      },
    },
    ilceModel: {
      handler(val) {
        console.log("ilceModel:" + this.ilceModel);
      },
    },
    semtModel: {
      handler(val) {
        console.log("semtModel:" + this.semtModel);
      },
    },
  },
  methods: {},
  created() {},
};
</script>
