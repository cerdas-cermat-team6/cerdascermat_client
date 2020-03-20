import Vue from 'vue'
import Vuex from 'vuex'
import socket from '../config/socket.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
    chats: [],
    questions: [],
    game: {
      started: false,
      poin: 0
    },
    question: {},
    klasemen: []
  },
  mutations: {
    ADD_NEW_CHAT (state, payload) {
      state.chats.push(payload)
    },
    SET_QUESTION (state, payload) {
      state.question = payload
    },
    SET_USERNAME (state, name) {
      state.username = name
    },
    ADD_ONE_POINT (state) {
      state.game.poin += 1
    },
    RESET_POINT (state) {
      state.game.poin = 0
    },
    PRINT_QUESTION (state) {
      const q = {
        id: state.question.id,
        message: state.question.message,
        type: 'question'
      }
      state.chats.push(q)
    },
    PRINT_USER_POINT (state) {
      const notif = {
        type: 'notification',
        message: `Poin: +${state.game.poin}`
      }
      state.chats.push(notif)
    },
    START_GAME (state, _) {
      state.game.started = true
    },
    STOP_GAME (state) {
      state.game.started = false
      state.game.poin = 0
    },
    PICK_ANSWER (state, answer) {
      state.question.answers.splice(state.question.answers.indexOf(answer), 1)
    },
    FEED_LEADERBOARD (state, payload) {
      let id
      state.klasemen.forEach((item, i) => {
        if (item.username === payload.username) {
          id = i
        }
      })
      if (id === undefined) {
        if (payload.poin > 0) {
          state.klasemen.push(payload)
        }
      } else {
        state.klasemen[id].poin += payload.poin
      }
    }
  },
  actions: {
    sendChat ({ commit }, payload) {
      // console.log('chat dimasoooking ke server')
      socket.emit('sendChat', payload)
      commit('ADD_NEW_CHAT', payload)
    },
    sendPoint ({ commit, state }) {
      const payload = {
        username: state.username,
        poin: state.game.poin
      }
      let id
      console.log(payload, 'sendPoint')
      state.klasemen.forEach((item, i) => {
        if (item.username === payload.username) {
          id = i
        }
      })
      if (id === undefined) {
        state.klasemen.push(payload)
      } else {
        state.klasemen[id].poin += payload.poin
      }
      socket.emit('broadcastPoint', payload)
      commit('RESET_POINT')
    }
  },
  getters: {
    randQuestion: state => {
      const id = Math.floor(Math.random() * state.questions.length)
      return state.questions[id]
    },
    answerIsCorrect: state => answer => {
      return state.question.answers.includes(answer)
    },
    gameStatus: state => {
      return state.game.started
    }
  }
})
