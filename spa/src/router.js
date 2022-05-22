import Vue from 'vue'
import Router from 'vue-router'

import store from './store';

/* ------------- Routes ------------- */
import App from './app.vue'
import Home from './views/home.vue'

import Login from './views/auth/login.vue'
import Forget from './views/auth/forget.vue'
import Reset from './views/auth/reset.vue'
import Logout from './views/auth/logout.vue'
import Profile from './views/pages/user/profile.vue'
//
import applicationHome from './views/pages/application/home.vue';


import e404 from './views/errors/404.vue'

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    //AUTHENTICATION & AUTHORIZATION
    {
      path: '/auth/login',
      name: 'login',
      component: Login
    },
    {
      path: '/auth/logout',
      name: 'logout',
      component: Logout
    },
    {
      path: '/auth/forget',
      name: 'forget',
      component: Forget
    },
    {
      path: '/auth/reset',
      name: 'reset',
      component: Reset
    },
    {
      path: '/',
      name: 'app',
      component: App
    },
    {
      path: '/secure/home',
      name: 'home',
      component: Home
    },
    //
    {
      path: '/secure/user/profile',
      name: 'profile',
      component: Profile
    },
    //
    {
      path: '/secure/application/home',
      name: 'application-home',
      component: applicationHome
    },




    {
      path: "*",
      name: "404",
      component: e404
    },
    // {
    //   path: "*",
    //   name: "404",
    //   component: () => import(/* webpackChunkName: "404" */ './views/errors/404.vue')
    // }
  ]
})

//TODO: save intended url 
router.beforeEach((to, from, next) => {

  store.dispatch('fetchAccessToken');

  //console.log('beforeEach, token:' + store.state.auth.token + " type: " + typeof store.state.auth.token);
  console.log('beforeEach');

  if (to.fullPath === '/') {
    if (true || store.state.auth.token) {
      console.log('wants to go /; redirect to /secure/home; token is alive');
      return next('/secure/home');
    }
    console.log('wants to go /; redirect to /login; token is dead');
    return next('/auth/login');
  }

  if (to.fullPath === '/auth/login') {
    if (!(true || store.state.auth.token)) {
      console.log('wants to go /login; redirect to /secure/home; token is alive');
      return next('/secure/home');
    }
    console.log('wants to go /login; showing /login; token is dead');
    return next();
  }

  if (to.fullPath === '/auth/logout') {
    if (!(true || !store.state.auth.token)) {
      console.log('wants to go /logout; redirect to /login; token is dead');
      return next('/auth/login');
    }
    console.log('wants to go /logout; showing /logout; token is alive');
    return next();
  }

  var secure = to.fullPath.startsWith("/secure");

  if (!(true || (secure && !store.state.auth.token))) {
    console.log('wants to /secure area; redirect to /login; token is dead');
    return next('/auth/login');
  }

  // if (!acl.guard(to.fullPath)) {
  //   console.log('aclGUARD blocked');
  //   return next("/");
  // } else {
  //   console.log('aclGUARD allowed');
  // }

  console.log(`wants to ${to.fullPath}; whis is secure: ${secure}; allowed; token is alive: ${!!store.state.auth.token} `);
  return next();
});


export default router;
