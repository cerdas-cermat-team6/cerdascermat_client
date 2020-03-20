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
    competition: {
      started: false,
      poin: 0
    },
    competition_question: {},
    question: {},
    klasemen: [],
    interval: 1500
  },
  mutations: {
    ADD_NEW_CHAT (state, payload) {
      state.chats.push(payload)
    },
    SET_QUESTION (state, payload) {
      state.question = payload
    },
    SET_QUESTIONS (state, payload) {
      state.questions = payload
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
    START_COMPETITION (state) {
      state.competition.started = true
    },
    STOP_COMPETITION (state) {
      state.competition.started = false
      state.competition.poin = 0
    },
    COMPETITION_POINT (state) {
      state.competition.poin += 1
    },
    RESET_COMPETITION_POIN (state) {
      state.competition.poin = 0
    },
    PICK_COMPETITION_ANSWER (state, answer) {
      state.competition_question.answers.splice(state.competition_question.answers.indexOf(answer), 1)
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
      state.klasemen.sort((a, b) => {
        return b - a
      })
    },
    COMPETITION_NOTIF (state) {
      // show notif
      state.chats.push({
        type: 'notification',
        message: `Mulai dalam ${state.interval / 1000} detik`
      })
    },
    COMPETITION_QUESTION (state, payload) {
      state.chats.push(payload)
    },
    COMPETITION_CURRENT_Q (state, payload) {
      state.competition_question = payload
    },
    COMP_PUSH_LEADERBOAR (state, payload) {}
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
    },
    competitionPoin ({ state, commit }) {
      const payload = {
        username: state.username + '@competition',
        poin: state.competition.poin
      }
      let id
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
      commit('RESET_COMPETITION_POIN')
    },
    fetchQuestions ({ commit }) {
      socket.emit('fetchQuestions')
      socket.on('questions', payload => {
        // !compete
        // nangkep questions
        commit('SET_QUESTIONS', payload)
        // console.log(state.questions, 'state bang')
      })
    },
    printQuestionInRandom ({ state, commit, dispatch }) {
      // setInterval questions "q"
      commit('COMPETITION_NOTIF')
      setInterval(() => {
        const idRand = Math.floor(Math.random() * state.questions.length)
        const q = state.questions[idRand]
        const question = {
          type: 'question',
          message: q.message,
          id: q.id || '#'
        }
        commit('COMPETITION_CURRENT_Q', q)
        commit('COMPETITION_QUESTION', question)
        dispatch('competitionPoin')
      }, state.interval)
      // console.log(q)
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
    competitionAnswerIsCorrect: state => answer => {
      return state.competition_question.answers.includes(answer)
    },
    gameStatus: state => {
      return state.game.started
    },
    competitionStatus: state => {
      return state.competition.started
    }
  }
})
