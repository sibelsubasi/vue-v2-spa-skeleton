<template>
  <v-main>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12" :loading="isLoading">
            <v-toolbar dark color="primary">
              <v-toolbar-title>{{
                $t("pages.forget.forgotMyPassword")
              }}</v-toolbar-title>
              <v-spacer />
              <v-img
                :src="theme.assets.loginLogo || theme.assets.logo"
                max-width="80"
                max-height="50"
                contain
              ></v-img>
            </v-toolbar>
            <v-card-text>
              <v-form
                ref="form"
                v-on:submit.prevent
                @keyup.native.enter="submit"
              >
                <v-text-field
                  v-model="email"
                  prepend-icon="email"
                  :label="$t('pages.forget.email')"
                  :rules="validation().required().email().toRules('E-Posta')"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="$router.go(-1)">{{
                $t("actions.back")
              }}</v-btn>
              <v-btn color="primary" @click="submit">{{
                $t("actions.send")
              }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-main>
</template>

<script>
import Vue from "vue";
import router from "./../../router";
import store from "./../../store";

export default {
  data() {
    return {
      isLoading: false,
      email: "",
    };
  },
  methods: {
    submit() {
      if (!this.$refs.form.validate()) {
        return false;
      }
      this.isLoading = "secondary";
      Vue.axios
        .post("/auth/forget", { email: this.email })
        .then((response) => {
          this.$dialog.notify.success(
            "Eğer bilgileriniz doğruysa bir kurtarma e-postası alacaksınız",
            {
              position: "top-right",
            }
          );

          router.push("/auth/reset");
        })
        .catch((error) => {
          this.$dialog.error({ text: error.response.data.message });
        })
        .then(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>
