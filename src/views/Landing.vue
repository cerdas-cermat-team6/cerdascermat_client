<template>
  <div class="landing">
    <div class="landing-title">
      <h1>Hi there! Welcome :)</h1>
    </div>
    <div class="landing-loading">
      <landing-animation></landing-animation>
    </div>
    <div class="landing-username">
      <form>
        <input type="text" placeholder="username">
        <button class="btn" @click.prevent >Let's play!</button>
      </form>
    </div>
  </div>
</template>

<script>
import LandingAnimation from '../components/LandingAnimation'

export default {
  components: {
    LandingAnimation
  },
  created () {
    this.$store.dispatch('fetchQuestions')
  }
}
</script>

<style scoped>
.landing{
  display: flex;
  flex-direction: column;
}
form{
  display: flex;
  flex-direction: column;
  width: 15%;
  margin: auto;
}
</style>
