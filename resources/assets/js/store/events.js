import invoiceApi from '../services/api'

export default {
  namespaced: true,

  state: {
    // This state contains all the users after fetching them from API
    events: [],
    userLocation: {}
  },

  getters: {
    events: ({ events }) => events,
    getEvent: ({ events }) => id => events.find(event => event.id === id)
  },
  actions: {
    getEventsFromApi({ commit, rootState }) {
      return new Promise((resolve, reject) => {
        invoiceApi
          .get('/events/', {
            headers: {
              Authorization: `Token ${rootState.authToken}`
            }
          })
          .then(({ data }) => {
              let allevents = data;
              allevents.forEach(event => {
                event.backgroundColor = '#3788d8';
              });
              if (!rootState.is_admin) { // when user is not admin, filter only own events
                allevents = allevents.filter(event => {
                  if (event.employees.includes(rootState.userID)) {
                    return true;
                  }
                });
              }
            commit('setEventsList', allevents);
            resolve('success')
          })
          .catch(error => reject(error))
      })
    },

    addEvent({ commit, rootState }, postData) {
      return new Promise((resolve, reject) => {
        invoiceApi
          .post('/events/', postData, {
            headers: {
              Authorization: `Token ${rootState.authToken}`
            }
          })
          .then(response => {
            if (response.status === 201) {
              commit('addEvent', { ...response.data })
              // rootState.eventsCount++
              resolve('created')
            }
          })
          .catch(e => reject(e))
      })
    },

    updateEvent({ commit, rootState }, updateData) {
      return new Promise((resolve, reject) => {
        // const data = { ...formData }
        invoiceApi
          .put(`/events/${updateData.id}/`, updateData.data, {
            headers: {
              Authorization: `Token ${rootState.authToken}`
            }
          })
          .then(response => {
            if (response.status === 200) {
              commit('updateEvent', response.data)
              resolve('updated')
            }
          })
          .catch(e => reject(e))
      })
    },

    removeEvent({ commit, rootState }, id) {
      new Promise((resolve, reject) => {
        invoiceApi
          .delete(`/events/${id}`, {
            headers: {
              Authorization: `Token ${rootState.authToken}`
            }
          })
          .then(response => {
            if (response.status >= 200 && response.status <= 204) {
              commit('removeEvent', id);
              // rootState.eventssCount--
              resolve('removed')
            } else reject('error')
          })
          .catch(e => reject(e))
      })
    }
  },

  mutations: {
    setEventsList: (state, eventsList) => (state.events = eventsList),
    addEvent: (state, eventData) => state.events.push(eventData),
    updateEvent: (state, data) => {
      const index = state.events.findIndex(c => c.id === data.id);
      Object.assign(state.events[index], data);
    },
    removeEvent: (state, id) =>
        (state.events = state.events.filter(event => event.id !== id))
  }
}
