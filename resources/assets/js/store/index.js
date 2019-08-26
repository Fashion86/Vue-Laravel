import Vue from "vue";
import Vuex from "vuex";

import users from "./users";
import events from "./events";
import Api from "../services/api";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    userStore: users,
    eventStore: events,
  },
  state: {
    // Auth Token stores the token after user logs in
    authToken: null,
  },
  getters: {
    // Related Getters for the above states
    authToken: ({ authToken }) => authToken,
    isAuthenticated: ({ authToken }) => authToken !== null,
  },
  actions: {
    // login action that stores the authToken to the store
    login: ({ commit }, { email, password }) =>
      new Promise((resolve, reject) => {
        Api
          .post("/login", {
            email,
            password
          })
          .then(response => {console.log('data', response)
            if (response.status === 200) {
              const token = response.data.token;
              commit("setAuthToken", token);
              resolve("success");
            }
          })
          .catch(error => reject(error));
      }),

    logout: ({ commit }) =>
      new Promise(resolve => {
        commit("removeAuthToken");
        resolve("success");
      }),
  },

  mutations: {
    setAuthToken: (state, token) => {
      localStorage.setItem("token", token);
      state.authToken = token;
    },
    setUser: (state, id) => {
      localStorage.setItem("userID", id);
      state.userID = id;
    },
    removeAuthToken: state => {
      localStorage.removeItem("token");
      state.authToken = null;
    },
  }
});
