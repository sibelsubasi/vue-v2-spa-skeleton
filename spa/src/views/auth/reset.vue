<template>
  <v-main>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12" :loading="isLoading">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Parola Kurtarma</v-toolbar-title>
              <v-spacer />
              <v-img
                :src="theme.assets.loginLogo || theme.assets.logo"
                max-width="80"
                max-height="50"
                contain
              ></v-img>
            </v-toolbar>
            <v-card-text>
              <p>
                <small
                  >Eğer bilgileri doğru girdiyseniz e-posta adresinize gelmiş
                  olan doğrulama kodu ile parolanızı sıfırlayabilirsiniz.</small
                >
              </p>
              <v-form
                ref="form"
                v-on:submit.prevent
                @keyup.native.enter="submit"
              >
                <v-text-field
                  v-model="code"
                  prepend-icon="code"
                  label="Doğrulama Kodu"
                  :rules="
                    validation().required().charMin(8).toRules('Doğrulama Kodu')
                  "
                ></v-text-field>
                <div style="padding: 0 13px">
                  <p-checked-texfield
                    prepend-icon="vpn_key"
                    v-model="password"
                    label="Yeni Parolanızı Belirleyin"
                    disabledLabel
                    rulesToAppyLabel="Parola"
                    type="password"
                    :rulesToApply="validation().required().password()"
                    :showCheckbox="false"
                  ></p-checked-texfield>
                </div>
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
      code: "",
      password: "",
    };
  },
  methods: {
    submit() {
      if (!this.$refs.form.validate()) {
        return false;
      }
      this.isLoading = "secondary";
      Vue.axios
        .post("/auth/reset", { code: this.code, password: this.password })
        .then((response) => {
          this.$dialog.notify.success("Parolanız başarıyla sıfırlandı", {
            position: "top-right",
          });

          router.push("/auth/login");
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
