<style>
.menu-group .v-list-item__icon.v-list-group__header__append-icon {
  margin-left: 0 !important;
  min-width: auto !important;
}
.menu-item .v-list-item__title {
  white-space: normal !important;
}
.menu-sub-group .v-list-item__icon.v-list-group__header__prepend-icon {
  margin-right: 5px !important;
}
.menu-sub-group .v-list-item__icon.v-list-group__header__prepend-icon i {
  margin-left: 14px !important;
}
</style>
<style lang="scss" scoped>
.v-icon-rotate {
  transform: rotate(-180deg);
}
</style>
<template>
  <v-app-bar app shrink-on-scroll dark color="black">
    <v-container fill-height fluid style="max-width: 200px">
      <v-img
        style="margin: auto"
        src="/img/themes/common/logo-light.png"
        contain
        height="100%"
        max-height="60"
      ></v-img>
    </v-container>
    <v-container fill-height fluid style="padding: 0; margin: 0">
      <v-tabs
        height="50"
        background-color="black"
        dark
        hide-slider
        color="#fff"
      >
        <v-menu offset-y rounded="b-xl" transition="slide-y-transition">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              text
              class="align-self-center mr-4"
              v-bind="attrs"
              v-on="on"
              style="opacity: 0.8"
            >
              Kredi İşlemleri
              <v-icon right> mdi-menu-down </v-icon>
            </v-btn>
          </template>
          <v-list nav flat min-width="250">
            <!-- to="/secure/application/home" -->
            <v-list-item @click="$router.push({ path: '/secure/application/home' }).catch(err => { reload(); })" 
              >Başvuru Girişi</v-list-item
            >
            <v-list-item to="/secure/application/list"
              >Başvuru Sorgulama</v-list-item
            >
            <v-divider></v-divider>
            <v-list-item to="/secure/home">Tüm Başvurular</v-list-item>
          </v-list>
        </v-menu>

        <v-menu offset-y rounded="b-xl" transition="slide-y-transition">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              text
              class="align-self-center mr-4"
              v-bind="attrs"
              v-on="on"
              style="opacity: 0.8"
            >
              Raporlar
              <v-icon right> mdi-menu-down </v-icon>
            </v-btn>
          </template>
          <v-list nav flat min-width="250">
            <v-list-item to="/secure/repots/a">Bişey Raporları</v-list-item>
            <v-list-item to="/secure/repots/b"
              >Başka Bişey Raporları</v-list-item
            >
            <v-divider></v-divider>
            <v-list-item to="/secure/repots/c">Önemli Raporlar</v-list-item>
          </v-list>
        </v-menu>

        <v-tab class="white--text" style="opacity: 0.8" to="/secure/other-requests">Diğer Talepler</v-tab>
        <v-tab class="white--text" style="opacity: 0.8" to="/secure/contact-us">Bize Ulaşın</v-tab>
      </v-tabs>
    </v-container>
    <v-spacer></v-spacer>
    <v-container
      fill-height
      style="padding: 0; margin: 0; max-width: 200px; margin-right: 50px"
    >
      <v-row no-gutters>
        <v-col style="text-align:right">
          <v-icon>person_outline</v-icon>
          <small>Ali Veli Can</small>
          <h6>Marmara Bölge Müdürlüğü</h6>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>


<script>
import store from "@/store";

export default {
  name: "a-header",
  //https://material.io/resources/icons/?style=baseline
  data: (vm) => ({
    showEnv: process.env.VUE_APP_ENV_SHOUT == "true",
    envName: process.env.VUE_APP_ENV_NAME,
    showMainNotificationsMenu: false,
    rotatingClass: "",
    drawer: null,
    user: store.state.user,
    mini: false,
    notifierData: {},
    itemsDemo: [],
    items: [
      { icon: "home", text: vm.$t("routes.home"), route: "/" },
      { divider: true },

      //
      {
        icon: "account_balance",
        text: "Kredilendirme",
        route: "/secure/credit/home",
        children: [
          {
            text: "Başvuru",
            route: "/secure/credit/homemy",
            children: [
              {
                text: "Alt menusu",
                route: "/secure/credit/homemygir",
                check: true,
              },
            ],
          },
        ],
      },
      { divider: true },
      { icon: "logout", text: vm.$t("routes.logout"), route: "/auth/logout" },
    ],
  }),
  methods: {
    reload(){
      location.reload();
    },
    removeNotification(item) {
      // delete this.notifierData[item.id];
      this.notifier.remove(item.id, false);
    },
    getNotificationIconColor(item) {
      switch (item.type) {
        case "error":
          return "red";
        case "success":
          return "green";
        case "progress":
          return "blue";
        default:
          return "black";
      }
    },
    isEqualOrIsContains(pageRoute, targetRoute) {
      if (pageRoute == targetRoute) {
        return true;
      }
      if (!targetRoute || !targetRoute.endsWith("*") < 0) {
        return false;
      }
      let tr = targetRoute.substring(0, targetRoute.length - 1);
      let pr = pageRoute.substring(
        0,
        Math.min(targetRoute.length - 1, pageRoute.length - 1)
      );

      return tr == pr;
    },
    isGroupActive(item) {
      var p = this.$router.currentRoute.path;
      // console.log(`current: ${p}`);
      return (
        this.isEqualOrIsContains(p, item.route) ||
        (item.children &&
          item.children.filter((child) => {
            return (
              this.isEqualOrIsContains(p, child.route) ||
              (child.children &&
                child.children.filter((grandson) =>
                  this.isEqualOrIsContains(p, grandson.route)
                ).length > 0)
            );
          }).length > 0)
      );
    },
  },
  watch: {},
  computed: {
    itemsComputed() {
      const appender = (itemz, ret) => {
        for (let i in itemz) {
          var item = itemz[i];
          if (!item.children) {
            //console.log(`route: ${item.route}`);
            if (
              !item.route ||
              this.acl().has("POST", item.route) ||
              (item.check && this.acl().has("POST", item.check))
            ) {
              ret.push(item);
              continue;
            }
          } else {
            var children = [];
            for (let c in item.children) {
              var child = item.children[c];
              if (!child.children) {
                //console.log(`child.route: ${child.route}`);
                if (
                  !child.route ||
                  this.acl().has("POST", child.route) ||
                  (child.check && this.acl().has("POST", child.check))
                ) {
                  children.push(child);
                }
              } else {
                var grandsons = [];
                for (let g in child.children) {
                  var grandson = child.children[g];
                  if (
                    !grandson.route ||
                    this.acl().has("POST", grandson.route) ||
                    (grandson.check && this.acl().has("POST", grandson.check))
                  ) {
                    grandsons.push(grandson);
                  }
                }
                if (grandsons.length > 0) {
                  child.children = grandsons;
                  children.push(child);
                }
              }
            }
            if (children.length > 0) {
              item.children = children;
              ret.push(item);
            }
          }
        }
      };

      var includeDemoRoutes = process.env.VUE_APP_INCLUDE_DEMO_FUNCS === "true";

      const resultList = [];

      appender(this.items, resultList);
      console.log(resultList);

      if (includeDemoRoutes) {
        appender(this.itemsDemo, resultList);
      }
      return resultList;
    },
  },
  created() {},
  mounted() {
    console.log(`a-header mounted with theme: `);
    console.log(this.theme);
    setInterval(() => {
      if (this.notifier.changed) {
        console.log(`this.notifier.changed: ${this.notifier.changed}`);
        this.notifier.clearChangeStatus();
        if (this.$refs.showMainNotificationsMenuButtonRef) {
          this.utils.ripple(this.$refs.showMainNotificationsMenuButtonRef.$el);
        }
        this.showMainNotificationsMenu = true;
        setTimeout(() => (this.showMainNotificationsMenu = false), 5000);
      }

      this.notifierData = JSON.parse(JSON.stringify(this.notifier.data));
    }, 500);
    setInterval(
      () =>
        this.rotatingClass
          ? (this.rotatingClass = "")
          : (this.rotatingClass = "v-icon-rotate"),
      1000
    );
  },
};
</script>