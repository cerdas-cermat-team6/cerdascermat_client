<template>
  <div class="landing">
    <div class="landing-body">
      <div class="landing-title">
        <h1><i>Electric Boogaloo!</i></h1>
      </div>
      <div class="landing-loading">
        <landing-animation></landing-animation>
      </div>
      <div class="landing-username">
        <b-form @submit.prevent="join">
          <b-form-input v-model="username" required id="username-input" style="box-shadow: 2px 2px #3f72af;" type="text" placeholder="insert your username"></b-form-input>
          <br>
          <b-button type="submit" pill variant="primary">Let's play!</b-button>
        </b-form>
      </div>
    </div>
    <a id="vecteezy" href="https://www.vecteezy.com/free-vector/pattern">Pattern Vectors by Vecteezy</a>
  </div>
</template>

<script>
import LandingAnimation from '../components/LandingAnimation'
import join from '../assets/join.mp3'
import { BButton, BForm, BFormInput } from 'bootstrap-vue'

export default {
  data () {
    return {
      username: ''
    }
  },
  components: {
    LandingAnimation,
    BButton,
    BForm,
    BFormInput
  },
  methods: {
    join () {
      console.log('masoook', this.username)
      localStorage.setItem('username', this.username)
      this.$router.push('/quiz')
      new Audio(join).play()
    }
  },
  created () {
    this.$store.dispatch('fetchQuestions')
  }
}
</script>

<style scoped>
h1{
  color: #112d4e;
  font-weight: bold;
}
.landing{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url('../assets/background.png');
}
.landing a{
  bottom: 0;
  right: 0;
  position: fixed;
  font-size: 8px;
}
.landing-body{
  border: 5px #112d4e solid;
  width: fit-content;
  height: fit-content;
  padding: 15px;
  border-radius: 15px;
  background-color: #dbe2ef;
}
b-form{
  display: flex;
  flex-direction: column;
  margin: auto;
}
#username-input::placeholder{
  color: #3f72af;
}
button{
  width: 50%;
  background-color: #3f72af;
  color: white;
  font-weight: bold;
}
button:hover{
  background-color: #112d4e;
}
.landing{
  margin-top: 2rem;
  margin-bottom: 2rem;
  height: calc(100vh - 4rem);
}
.landing-title{
  margin-top: 10%;
}
</style>
