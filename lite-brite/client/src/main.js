import Vue from 'vue';
import App from './App.vue';
import Vuex from 'vuex';

// Vue config
Vue.config.productionTip = false;

// Vuex store
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    authenticated: false,
    userAcctComponent: 'Login'
  },
  mutations: {
    /**
     * Set authenticated status
     * @param {boolean} authenticated - true for authenticated
     */
    setAuthenticated(state, authenticated) {
      state.authenticated = authenticated;
    },
    /**
     * Set active user controls component
     * @param {string} componentName - component name
     */
    setUserAcctComponent(state, componentName) {
      state.userAcctComponent = componentName;
    }
  },
  // Actions to call mutations of the same names
  actions: {
    setAuthenticated(context, authenticated) {
      context.commit('setAuthenticated', authenticated);
    },
    setUserAcctComponent(context, componentName) {
      context.commit('setUserAcctComponent', componentName);
    }
  },
  getters: {
    getAuthStatus: state =>  {
      return state.authenticated;
    },
    getUserAcctComponent: state => {
      return state.authenticated;
    }
  }
});

new Vue({
  render: h => h(App),
  store: store
}).$mount('#app');
