<template>
  <div class="container-fluid vh-100 chat-room">
    <div class="row">
      <div class="col-md-3 p-3" id="navigation-panel">
        <h4><i>Eat Bulaga: <br>Electric Boogaloo</i></h4>
        <b-form class="border rounded p-2" @submit.prevent="onSubmit">
          <b-form-group label="Username:" description="your gamer tag" >
            <b-form-input v-model="username" disabled type="text" required placeholder="username" ></b-form-input>
          </b-form-group>
          <b-form-group label="Message:" description="your gamer screams" >
            <b-form-input v-model="message" type="text" required placeholder="message" ></b-form-input>
          </b-form-group>
          <b-button class="nav-button" type="submit" pill variant="primary">Submit</b-button>
          <b-button class="nav-button" @click.prevent="logout" pill variant="danger">Logout</b-button>
        </b-form>
      </div>
      <div class="col-md-9 p-3">
        <b-card header="!join to start quiz" bg-variant="light" class="text-center">
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
                    <p class="m-0" v-for="(notif, i) in item.items" :key="i">{{ notif.text }}: {{ notif.val }} poin</p>
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
    </div>
    <a id="vecteezy" href="https://www.vecteezy.com/free-vector/pattern">Pattern Vectors by Vecteezy</a>
  </div>
</template>

<script>
import {
  BForm, BFormGroup, BButton, BFormInput,
  BCard, BCardText,
  BIconAt
} from 'bootstrap-vue'
import submitSfx from '../assets/blop.mp3'
export default {
  data () {
    return {
      chats: [],
      username: '',
      message: '',
      questions: [],
      currentQuestions: {},
      questionTime: 1000,
      game: {
        started: false,
        poin: 0
      }
    }
  },
  components: {
    BForm,
    BFormGroup,
    BButton,
    BFormInput,
    BCard,
    BCardText,
    BIconAt
  },
  methods: {
    onSubmit () {
      console.log('masoook')
      const message = {
        username: this.username,
        message: this.message,
        type: 'chat'
      }
      new Audio(submitSfx).play()
      this.chats.push(message)
      if (this.message === '!join' && !this.game.started) {
        this.startGame()
      }
      if (this.game.started) {
        if (this.currentQuestions.answer.includes(this.message)) {
          this.game.poin += 1
          this.currentQuestions.answer.splice(this.currentQuestions.answer.indexOf(this.message), 1)
          console.log('betol!')
        }
      }
      this.message = ''
    },
    startGame () {
      this.showNotification('Mulai!')
      this.dummyFetchQuestions()
        .then(_ => {
          this.runGame()
        })
    },
    runGame (i = 0) {
      this.game.started = true
      if (i === this.questions.length) {
        this.showNotification('Game Over!')
        this.showNotification(`Poinmu ${this.game.poin}`)
        this.game.started = false
        this.game.poin = 0
      } else {
        const item = this.questions[i]
        this.showQuestion(item)
        setTimeout(() => {
          this.runGame(i + 1)
        }, this.questionTime)
      }
    },
    showQuestion (dbQuestion) {
      // socket receive notification from server
      const payload = {
        message: dbQuestion.question,
        type: 'question'
      }
      this.chats.push(payload)
      this.currentQuestions = { ...dbQuestion }
      // console.log(this.currentQuestions)
    },
    showNotification (msg) {
      const payload = {
        message: msg,
        type: 'notification'
      }
      this.chats.push(payload)
    },
    dummyFetchQuestions () {
      this.emptyQuestions()
      for (let i = 0; i < 10; i++) {
        this.questions.push(
          {
            id: i + 1,
            question: `${i + 1}Apa yang suka orang lakukan ketika hujan?`,
            answer: [
              'makan mie',
              'minum kopi',
              '*****',
              'tidur',
              'melamun'
            ]
          }
        )
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(1)
        }, 1000)
      })
    },
    emptyQuestions () {
      this.questions = []
    },
    logout () {
      localStorage.clear()
      this.$router.replace('/')
    }
  },
  created () {
    this.username = localStorage.getItem('username')
  }
}
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
