import invoiceApi from '../services/api'

export default {
  namespaced: true,

  state: {
    projects: []
  },

  getters: {
    projects: ({ projects }) => projects,
    getProject: ({ projects }) => username =>
        projects.find(user => user.username === username)
  },

  actions: {
    getProjectsFromApi({ commit, rootState }) {
      return new Promise((resolve, reject) => {
        invoiceApi
          .get('/projects', {
          })
          .then(res => {
            commit('setProjectList', res.data['projects'])
            resolve('success')
          })
          .catch(error => reject(error))
      })
    },

    createProject({ commit, rootState }, formData) {
      return new Promise((resolve, reject) => {
        const postData = {
          name: formData.name,
          user_id: rootState.userID
        }
        invoiceApi
          .post('/project', postData)
          .then(response => {
            if (response.status === 200) {
              commit('addProject', response.data.project)
              resolve("created");
            }
          })
          .catch(e => {reject(e)})
      })
    },
    //
    // updateProject({ commit, rootState }, { formData, id }) {
    //   return new Promise((resolve, reject) => {
    //     const data = { ...formData }
    //     invoiceApi
    //       .put(`/project/${id}/`, data, {
    //         headers: {
    //           Authorization: `Token ${rootState.authToken}`
    //         }
    //       })
    //       .then(response => {
    //         if (response.status === 200) {
    //           commit('updateProject', { data, id })
    //           resolve('updated')
    //         }
    //       })
    //       .catch(e => reject(e))
    //   })
    // },
    //
    // removeProject({ commit, rootState }, id) {
    //   new Promise((resolve, reject) => {
    //     invoiceApi
    //       .delete(`/project/${id}`, {
    //         headers: {
    //           Authorization: `Token ${rootState.authToken}`
    //         }
    //       })
    //       .then(response => {
    //         if (response.status >= 200 && response.status <= 204) {
    //           commit('removeProject', id)
    //           resolve('removed')
    //         } else reject('error')
    //       })
    //       .catch(e => reject(e))
    //   })
    // }
  },

  mutations: {
    setProjectList: (state, list) => (state.projects = list),
    addProject: (state, data) => state.projects.push(data),
    updateProject: (state, { data, id }) => {
      const index = state.projects.indexOf(u => u.id === id)
      state.projects[index] = { ...data }
    },
    removeProject: (state, id) =>
      (state.projects = state.projects.filter(project => project.id !== id))
  }
}
