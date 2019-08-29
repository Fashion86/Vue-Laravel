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
            .get('/events', {
            })
            .then(res => {
              res.data['events'].forEach(e => {
                e.backgroundColor = '#3788d8';
                // e.borderColor = 'transparent';
                // e.textColor = '#000';
                // if (e.type !== "event") {
                //   e.borderColor = 'transparent';
                //   e.textColor = 'blue';
                // }

              });
              commit('setEventsList', res.data['events'])
              resolve('success')
            })
            .catch(error => reject(error))
      })
    },

    createEvent({ commit, rootState }, formData) {
      return new Promise((resolve, reject) => {
        invoiceApi
            .post('/event', formData)
            .then(response => {console.log('ssss', response)
              if (response.status === 200) {
                commit('addEvent', response.data.event)
                resolve("created");
              }
            })
            .catch(e => {reject(e)})
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
          .delete(`/events/${id}`)
          .then(response => {
            if (response.status >= 200 && response.status <= 204) {
              commit('removeEvent', id);
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
