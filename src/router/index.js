import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Home from '../views/Landing.vue'
import ChatRoom from '@/views/ChatRoom'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import VueChatScroll from 'vue-chat-scroll'

Vue.use(VueRouter)
Vue.use(VueChatScroll)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/quiz',
    name: 'Quiz',
    component: ChatRoom
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
