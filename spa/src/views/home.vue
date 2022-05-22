<template>
  <v-main>
    <a-header />
    <v-container fluid>
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          
          <v-skeleton-loader
            style="height: 105px"
            v-if="dummyLoading"
            type="list-item-avatar-three-line"
          ></v-skeleton-loader>
          <v-list three-line v-else>
            <v-list-item>
              <v-list-item-avatar>
                <v-img v-if="user.avatar" :src="user.avatar || ''"></v-img>
                <span v-else>
                  <!-- {{ user.name.substr(0, 1) + user.surname.substr(0, 1) }} -->
                </span>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>Hoş geldiniz,</v-list-item-title>
                <v-list-item-subtitle>
                  <!-- {{ user.name }} {{ user.surname }},
                  <br />
                  {{ user.activeRole.roleName }} -->
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <div style="height:900px;"></div>
        </v-col>
      </v-row>
    </v-container>
    <a-footer />
  </v-main>
</template>

<script>
import store from "@/store";

export default {
  name: "home",
  components: {},
  data: () => ({
    user: store.state.user,
    dummyLoading: true,
  }),
  computed: {},
  watch: {},
  mounted() {
    //To solve the cache problem, reload SPA once after login.
    if (!localStorage.getItem("reloaded")) {
      localStorage.setItem("reloaded", "1");
      location.reload();
    }

    setTimeout(() => (this.dummyLoading = false), 800);
  },
  created() {},
};
</script>