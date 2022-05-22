<template>
  <div style="margin-top: 0px; margin-left: 0">
    <v-card flat tile>
      <v-breadcrumbs :items="items" divider="&gt;"></v-breadcrumbs>
    </v-card>
  </div>
</template>
<script>
export default {
  name: "a-breadcrumbs",
  props: {
    crumbs: {
      type: Array,
      default: () => [],
    },
    final: {
      type: String,
      default: () => null,
    },
  },
  data: (vm) => ({
    items: [
      {
        text: vm.$t("routes.home"),
        disabled: false,
        to: "/",
      },
    ],
  }),
  created() {
    this.crumbs.forEach((k) => {
      if (typeof k !== "object") {
        k = {
          text: k,
          check: "/an-invalid-url",
          to: null,
        };
      }
      var disabled = !k.check || !this.acl().has("POST", k.check);

      this.items.push({
        text: k.text,
        disabled: disabled,
        to: disabled ? null : k.to,
      });
    });
    if (this.final) {
      this.items.push({
        text: this.final,
        disabled: true,
        to: null,
      });
    }
  },
};
</script>