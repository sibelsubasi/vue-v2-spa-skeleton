import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    auth: {}
  },
  mutations: {
    updateAuth: (state, data) => {
      if (!data || data == "null" || data == "undefined") {
        return state.auth = {};
      }
      state.auth = data;
    },
    updateUser: (state, data) => {
      if (!data || data == "null" || data == "undefined") {
        return state.user = {};
      }
      state.user = data;
    },
  },
  actions: {
    fetchAccessToken({ commit }) {
      var parsedAuth, parsedUser;
      try {
        parsedAuth = JSON.parse(localStorage.getItem('auth'));
        parsedUser = JSON.parse(localStorage.getItem('user'));
      } catch (e) {
        console.log(`json parse exception: ${e}`);
        parsedAuth = null;
        parsedUser = null;
      }
      // console.log(`fetchAccessToken, commiting updateAuth with: ${JSON.stringify(parsedAuth)}`);
      console.log(`fetchAccessToken, commiting updateAuth`);
      commit('updateAuth', parsedAuth);
      commit('updateUser', parsedUser);
    },
    doLogin({ commit }, authData) {
      //console.log(`Vuex:doLogin with data ${JSON.stringify(authData)}`);
      console.log(`Vuex:doLogin`);

      localStorage.setItem('auth', JSON.stringify(authData.auth));
      localStorage.setItem('user', JSON.stringify(authData.user));
      localStorage.setItem('userName', authData.user.username);

      commit('updateAuth', authData.auth);
      commit('updateUser', authData.user);

     // console.log(`after doLogin state.auth is: ${JSON.stringify(this.state.auth)}`);
    },
    expandLogin({ commit }, authData) {
      //console.log(`Vuex:expandLogin with data ${JSON.stringify(authData)}`);
      console.log(`Vuex:expandLogin`);

      localStorage.setItem('auth', JSON.stringify(authData.auth));

      commit('updateAuth', authData.auth);

      //console.log(`after expandLogin state.auth is: ${JSON.stringify(this.state.auth)}`);
    },
    updateUserData({ commit }, data) {
      var parsedUser = JSON.parse(localStorage.getItem('user'));
      for (var i in data) {
        parsedUser[i] = data[i];
      }

      localStorage.setItem('user', JSON.stringify(parsedUser));
      commit('updateUser', parsedUser);
    },
    doLogout({ commit }) {
      localStorage.removeItem('auth');
      localStorage.removeItem('userName');
      commit('updateAuth', null);
      commit('updateUser', null);
    },
  }
});