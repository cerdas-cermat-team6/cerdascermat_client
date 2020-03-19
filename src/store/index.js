import Vue from 'vue'
import Vuex from 'vuex'
import socket from '../config/socket.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    chats: [],
    questions: [],
    game: {
      started: false,
      poin: 0
    }
  },
  mutations: {
    SET_QUESTIONS (state, payload) {
      state.questions = payload
    },
    ADD_NEW_CHAT (state, payload) {
      state.chats.push(payload)
    }
  },
  actions: {
    fetchQuestions ({ commit }) {
      socket.emit('fetchQuestions')
      socket.on('questions', payload => {
        const notif = {
          message: `${payload.length} pertanyaan siap untuk dijauab`,
          type: 'notification'
        }
        if (payload.length === 0) {
          notif.message = 'Saat ini kami tidak punya pertanyaan'
        }
        commit('SET_QUESTIONS', payload)
        commit('ADD_NEW_CHAT', notif)
      })
    },
    sendChat (_, payload) {
      // console.log('chat dimasoooking ke server')
      socket.emit('sendChat', payload)
    }
  },
  getters: {
    randQuestion: state => {
      const id = Math.floor(Math.random() * state.questions.length)
      return state.questions[id]
    }
  }
})
