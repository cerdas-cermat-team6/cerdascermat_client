<template>
  <div class="container-fluid vh-100 chat-room">
    <div class="row">
      <div class="col-md-3 col-sm-3 p-3" id="navigation-panel">
        <h4><i>Eat Bulaga: <br>Electric Boogaloo</i></h4>
        <b-form class="border rounded p-2" @submit.prevent="onSubmit">
          <b-form-group label="Username:" description="your gamer tag" >
            <b-form-input v-model="username" disabled type="text" ></b-form-input>
          </b-form-group>
          <b-form-group label="Message:" description="your gamer cry" >
            <b-form-input v-model="message" type="text" required placeholder="message" ></b-form-input>
          </b-form-group>
          <b-button class="nav-button" type="submit" pill variant="primary">Submit</b-button>
          <b-button class="nav-button" @click.prevent="logout" pill variant="danger">Logout</b-button>
        </b-form>
      </div>
      <div class="col-md-7 col-sm-7 p-3">
        <b-card header="!start to start quiz" bg-variant="light" class="text-center">
          <div class="overflow-auto" v-chat-scroll>
            <!-- chat -->
            <div v-for="(item,i) in chats" :key="i" class="d-flex border rounded mb-1">
              <div v-if="item.type==='chat'" class="d-flex p-1">
                <div>
                  <b-icon-at variant="success"></b-icon-at>
                </div>
                <div>
                  <b-card-text><span>{{ item.username }}:</span></b-card-text>
                </div>
                <div>
                  <b-card-text><p class="text-break m-0">{{ item.message }}</p></b-card-text>
                </div>
              </div>
              <!-- notification -->
              <div v-if="item.type==='notification'" class="d-flex flex-column rounded p-1 bg-info" style="width:100%;">
                <div>
                  <b-card-text>
                    <p class="text-break m-0 font-weight-bold">{{ item.message }}</p>
                  </b-card-text>
                </div>
              </div>
              <!-- question -->
              <div v-if="item.type==='question'" class="d-flex flex-column rounded p-1 bg-warning" style="width:100%;">
                <div>
                  <b-card-text>
                    <p class="text-break m-1 font-weight-bolder">Pertanyaan {{ item.id }}</p>
                    <p class="text-break m-1 font-italic">{{ item.message }}</p>
                  </b-card-text>
                </div>
              </div>
            </div>
          </div>
        </b-card>
      </div>
      <div class="col-md-2 col-sm-2 p-3 bg-light">
        <b-table striped hover :items="klasemen">
        </b-table>
      </div>
    </div>
    <a id="vecteezy" href="https://www.vecteezy.com/free-vector/pattern">Pattern Vectors by Vecteezy</a>
  </div>
</template>

<script>
import {
  BForm, BFormGroup, BButton, BFormInput,
  BCard, BCardText,
  BIconAt,
  BTable
} from 'bootstrap-vue'
import submitSfx from '../assets/blop.mp3'
import socket from '../config/socket.js'
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
import store from '../store'

export default {
  data () {
    return {
      message: ''
    }
  },
  components: {
    BForm,
    BFormGroup,
    BButton,
    BFormInput,
    BCard,
    BCardText,
    BIconAt,
    BTable
  },
  methods: {
    onSubmit () {
      console.log('masoook')
      const payload = {
        username: this.username,
        message: this.message,
        type: 'chat'
      }
      if (this.game.started) {
        console.log(payload.message, 'apaan toh')
        if (this.answerIsCorrect(payload.message)) {
          this.addOnePoint()
          this.pickAnswer()
        }
      }
      if (payload.message === '!start' && !this.game.started) {
        console.log('maen game cok')
        this.startGame()
        this.printQuestion()
      }
      if (payload.message === '!stop' && this.game.started) {
        console.log('game trooos')
        this.stopGame()
      }
      this.sendChat(payload)
      new Audio(submitSfx).play()
      this.message = ''
    },
    showQuestion (dbQuestion) {
      // socket receive notification from server
      const payload = {
        message: dbQuestion.question,
        type: 'question'
      }
      this.chats.push(payload)
      this.currentQuestions = { ...dbQuestion }
    },
    showNotification (msg) {
      const payload = {
        message: msg,
        type: 'notification'
      }
      this.chats.push(payload)
    },
    logout () {
      localStorage.clear()
      this.$router.replace('/')
    },
    ...mapActions({
      sendChat: 'sendChat',
      fetchQuestions: 'fetchQuestions'
    }),
    ...mapMutations({
      addNewChat: 'ADD_NEW_CHAT',
      startGame: 'START_GAME',
      stopGame: 'STOP_GAME',
      printQuestion: 'PRINT_QUESTION',
      setUsername: 'SET_USERNAME',
      pickAnswer: 'PICK_ANSWER',
      addOnePoint: 'ADD_ONE_POINT'
    })
  },
  created () {
    const name = localStorage.getItem('username')
    this.setUsername(name)
    socket.on('userChat', payload => {
      this.addNewChat(payload)
    })
  },
  computed: {
    ...mapState({
      chats: state => state.chats,
      game: state => state.game,
      question: state => state.question,
      username: state => state.username,
      klasemen: state => state.klasemen
    }),
    ...mapGetters({
      answerIsCorrect: 'answerIsCorrect'
    })
  }
}

socket.on('feedQuestion', payload => {
  // itung poin dan kasih feed poin di sini
  store.commit('SET_QUESTION', payload)
  if (store.getters.gameStatus) {
    store.commit('PRINT_USER_POINT')
    store.dispatch('sendPoint')
    store.commit('PRINT_QUESTION')
  }
  // console.log(store.state.question)
})
socket.on('addUserPoint', payload => {
  console.log(payload)
  store.commit('FEED_LEADERBOARD', payload)
})
</script>

<style scoped>
.chat-room {
  background-image: url('../assets/background.png');
}
.chat-room a{
  bottom: 0;
  right: 0;
  position: fixed;
  font-size: 8px;
}
.nav-button {
  width: 80%;
  margin-top: 5%;
  color: #f9f7f7;
  font-weight: bold;
}
.row{
  height: 100%;
}
.overflow-auto{
  height: 80vh;
}
#navigation-panel{
  margin-top: 25vh;
  margin-bottom: 25vh;
  background-color: white;
}
#navigation-panel h4{
  font-weight: bold;
  color: #112d4e;
}
</style>
