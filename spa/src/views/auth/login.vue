<template>
  <v-main>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12" :loading="isLoading">
            <template slot="progress">
              <v-progress-linear
                height="6"
                indeterminate
                absolute
                style="margin-top: 62px"
              ></v-progress-linear>
            </template>
            <v-toolbar dark color="primary">
              <v-toolbar-title>
                {{ $t("pages.login.doLogin") }}
                <small
                  v-if="showEnv"
                  style="position: absolute; left: 17px; bottom: 4px"
                >
                  <small>
                    <small style="color: #e1bee7">[{{ envName }}]</small>
                  </small>
                </small>
              </v-toolbar-title>
              <v-spacer />
              <v-img
                :src="theme.assets.loginLogo || theme.assets.logo"
                max-width="80"
                max-height="50"
                contain
              ></v-img>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form" @keyup.native.enter="submit">
                <v-text-field
                  :disabled="isLoading"
                  v-model="username"
                  required
                  prepend-icon="person"
                  name="username"
                  :label="$t('pages.login.username')"
                  type="text"
                  :rules="
                    validation().required().toRules($t('pages.login.username'))
                  "
                ></v-text-field>
                <v-text-field
                  :disabled="isLoading"
                  v-model="password"
                  required
                  id="password"
                  prepend-icon="lock"
                  name="password"
                  :label="$t('pages.login.password')"
                  :rules="
                    validation().required().toRules($t('pages.login.password'))
                  "
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="inputType"
                  @click:append="
                    show = !show;
                    inputType = inputType == 'text' ? 'password' : 'text';
                  "
                ></v-text-field>
                <v-layout justify-end dense style="min-height: 50px">
                  <!-- <v-checkbox
                   :disabled='isLoading'
                    dense
                    v-model="remember"
                    :label="$t('pages.login.rememberMe')"
                  ></v-checkbox> -->
                </v-layout>
                <v-divider></v-divider>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="isLoading"
                to="/auth/forget"
                text
                small
                color="primary"
                >{{ $t("pages.login.forgotMyPassword") }}</v-btn
              >
              <v-btn :disabled="isLoading" color="primary" @click="submit">{{
                $t("pages.login.login")
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
import router from "@/router";
import store from "@/store";
import endPointSelector from "@/plugins/endpoint-selector";
import scopeSelector from "@/plugins/scope-selector";

export default {
  data() {
    return {
      isLoading: false,
      username: "",
      password: "",
      remember: false,
      showEnv: process.env.VUE_APP_ENV_SHOUT == "true",
      envName: process.env.VUE_APP_ENV_NAME,
      show: false,
      inputType: "password",
    };
  },
  methods: {
    async submit() {
      if (!this.$refs.form.validate()) {
        return false;
      }
      this.isLoading = true;

      var urlToLogin = `https://${endPointSelector(false)}.${
        process.env.VUE_APP_BASEURL
      }/api/${endPointSelector()}/v1/oauth/login`;
      var headersToLogin = {
        headers: {
          Authorization: `Basic ${process.env.VUE_APP_AUTH_BASIC_TOKEN}`,
        },
      };
      var paramsToLogin = {
        username: this.username,
        password: this.password,
      };

      try {
        var response = await this.axios.post(
          urlToLogin,
          paramsToLogin,
          headersToLogin
        );

        // TODO: I dont know exactly how it should be,
        // But it works for now to develop permissions:
        var userProperties = {
          auth: {
            scope: response.data.scope,
            token_type: response.data.token_type,
            token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            token_expires_in: response.data.expires_in,
            refresh_token_expires_in: response.data.expires_in,
            token_expires_on: "2021-11-28 22:41:28",
            refresh_token_expires_on: "2021-11-28 22:41:28",
            user_id: 1,
            revoked: "0",
            role: response.data.role,
          },
          user: {
            userId: 1,
            username: this.username,
            email: this.username,
            name: this.username,
            surname: this.username,
            zone: "APP",
            active: 1,
            deleted: 0,
            createdBy: 1,
            creationDate: "",
            lastUpdatedBy: 1,
            lastUpdateDate: "",
            lastLogin: "",
            avatar: "",
            permissions: {},
            roles: [
              {
                roleId: 1,
                role: "role",
                roleName: "scope",
              },
            ],
            activeRole: {
              roleId: 1,
              role: "role",
              roleName: "scope",
            },
          },
        };

        //console.log(JSON.stringify(userProperties, null, 2));
        store.dispatch("doLogin", userProperties);
        router.push("/secure/home");

        setTimeout(() => {
          if (window._paq) {
            var id = userProperties.user.username;
            console.info(`Analytics: Setting User: ${id}`);
            window._paq.push(["setUserId", id]);
          }
        }, 100);
      } catch (error) {
        this.$dialog.error({ text: error.response.data.message });
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>