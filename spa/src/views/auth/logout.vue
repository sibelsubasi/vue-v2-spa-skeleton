<template>
  <v-main>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-progress-circular indeterminate color="green"></v-progress-circular>
      </v-layout>
    </v-container>
  </v-main>
</template>

<script>
import Vue from "vue";
import router from "./../../router";
import store from "./../../store";

export default {
  methods: {
    logout() {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("reloaded");
      setTimeout(() => {
        if (window._paq) {
          console.info(`Analytics: Setting User NULL`);
          window._paq.push(["setUserId", null]);
        }
      }, 100);
      store.dispatch("doLogout");
      router.push("/auth/login");

      // Vue.axios
      //   .post("/auth/logout", { username: this.username, password: this.password })
      //   .then(response => {
      //     console.log(response.data);
      //     store.dispatch("doLogout");
      //     router.push("/auth/login");
      //   })
      //   .catch(error => {
      //     router.push("/auth/login");
      //   });
    },
  },
  created() {
    return this.logout();
  },
};
</script>
