<template>
  <v-main>
    <a-header />
    <v-container fluid>
      <v-form ref="form">
        <v-card class="mx-auto" tile>
          <v-row>
            <v-col align-self="start" class="pl-4" cols="auto" style="position:relative">
              <p-single-photo-uploader saveUrl="/profile/photo" :afterLoad="afterImageLoad" />
              <v-avatar class="profile" color="grey" size="164">
                <v-img v-if="user.avatar" :src="user.avatar || ''"></v-img>
                <span
                  v-else
                  class="white--text headline"
                  style="font-size:4em !important"
                >{{user.name.substr(0, 1) + user.surname.substr(0, 1) }}</span>
              </v-avatar>
              <small style="display:block; text-align:center">
                <small>
                  <strong>Son Giriş:</strong>
                  {{utils.formatDateTime(user.lastLogin)}}
                </small>
              </small>
            </v-col>
            <v-col class="py-0" align-self="stretch">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="title">{{user.name}} {{user.surname}}</v-list-item-title>
                  <v-list-item-subtitle>{{user.activeRole.roleName}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-row class="px-4">
                <v-col cols="12" sm="6">
                  <p-unique-textfield
                    v-model="model.username"
                    disabled
                    label="Kullanıcı Adı"
                    url="/users/checkUserUsername"
                  ></p-unique-textfield>
                </v-col>
                <v-col cols="12" sm="6">
                  <p-unique-textfield
                    v-model="model.email"
                    disabled
                    label="E-Posta"
                    url="/users/checkUserEmail"
                    :rules="validation().required().email().toRules('E-Posta')"
                  ></p-unique-textfield>
                </v-col>
              </v-row>
              <v-row class="px-4">
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="model.name"
                    label="Ad"
                    :rules="validation().required().alphaTr().toRules('Ad')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="model.surname"
                    label="Soyad"
                    :rules="validation().required().alphaTr().toRules('Soyad')"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="px-4">
                <v-col cols="12" sm="6">
                  <p-checked-texfield
                    v-model="model.password"
                    label="Parolayı değiştirin"
                    disabledLabel="Parola aynı kalsın"
                    rulesToAppyLabel="Parola"
                    type="password"
                    :rulesToApply="validation().required().password()"
                  ></p-checked-texfield>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="model.activeRole"
                    :items="computedRoles"
                    :rules="validation().required().toRules('Aktif Yetki')"
                    label="Aktif Yetki"
                  ></v-select>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="primary" @click="save()" :loading="loading">Kaydet</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-container>
    <a-footer />
  </v-main>
</template>

<script>
import store from "@/store";
import validation from "@/plugins/validation";
import moment from "moment";

export default {
  name: "profile",
  components: {},
  data: vm => ({
    user: store.state.user,
    loading: false,
    model: {}
  }),
  computed: {
    computedRoles() {
      var ret = [];
      for (var i in this.user.roles) {
        var r = this.user.roles[i];
        ret.push({ value: r.role, text: r.roleName });
      }
      return ret;
    }
  },
  watch: {},
  methods: {
    afterImageLoad(avatar) {
      this.user.avatar = avatar;
    },
    save() {
      if (!this.$refs.form.validate()) {
        return false;
      }
      this.loading = true;
      this.axios
        .patch("/profile", this.model)
        .then(response => {
          store.dispatch("updateUserData", {
            name: this.model.name,
            surname: this.model.surname,
            activeRole: response.data.activeRole
          });
          this.user.activeRole = response.data.activeRole;
          this.$dialog.notify.info(
            response.data.message || this.$t("messages.success"),
            {
              position: "top-right"
            }
          );
          this.$router.go();
        })
        .catch(error => {
          this.$dialog.error({ text: error.response.data.message });
        })
        .then(() => (this.loading = false));
    }
  },
  mounted() {},
  created() {
    this.model.name = this.user.name;
    this.model.surname = this.user.surname;
    this.model.email = this.user.email;
    this.model.password = this.user.password;
    this.model.username = this.user.username;
    this.model.activeRole = this.user.activeRole.role;
    console.log("created model");
    console.log(this.model);
  }
};
</script>
