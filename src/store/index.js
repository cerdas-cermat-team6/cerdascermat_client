import Vue from 'vue'
import Vuex from 'vuex'
import socket from '../config/socket.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    questions: []
  },
  mutations: {
    SET_QUESTIONS (state, payload) {
      state.questions = payload
    }
  },
  actions: {
    fetchQuestions ({ commit }) {
      socket.emit('fetchQuestions')
      socket.on('questions', payload => {
        commit('SET_QUESTIONS', payload)
      })
    }
  },
  getters: {}
})
