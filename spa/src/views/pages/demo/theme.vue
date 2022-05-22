<template>
  <v-main>
    <a-header />
    <v-container fluid>Tema Önizleme</v-container>
    <a-breadcrumbs :crumbs="[`Tema Önizleme`]" />
    <v-row>
      <v-col>
        <v-card elevation="2" class="mx-4" height="120">
          <v-card-title>Palet</v-card-title>
          <v-card-text>
            <v-chip color="primary">Primary</v-chip>
            <v-chip color="secondary" class="ml-2">Secondary</v-chip>
            <v-chip color="accent" class="ml-2">Accent</v-chip>
            <v-chip color="error" class="ml-2">Error</v-chip>
            <v-chip color="info" class="ml-2">Info</v-chip>
            <v-chip color="success" class="ml-2">Success</v-chip>
            <v-chip color="warning" class="ml-2">Warning</v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card elevation="2" class="ml-4" height="200" width="300" loading>
          <template slot="progress">
            <v-progress-linear
              color="secondary"
              indeterminate
            ></v-progress-linear>
          </template>
          <v-card-title>Loader</v-card-title>
          <v-card-text> Loader Example </v-card-text>
        </v-card>
      </v-col>
      <v-spacer/>
    </v-row>
    <a-footer />
  </v-main>
</template>

<script>
export default {
  name: "theme-preview",
  components: {},
  data: () => ({}),
  computed: {},
  watch: {},
  mounted() {},
  created() {},
};
</script>
