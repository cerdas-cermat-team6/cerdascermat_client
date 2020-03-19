<template>
  <div class="container-fluid">
    <h4>Eat Bulaga: Electric Boogaloo</h4>
    <div class="row">
      <div class="col-md-3 p-3">
        <b-form class="border rounded p-2" @submit.prevent="onSubmit">
          <b-form-group label="Username:" description="your gamer tag" >
            <b-form-input v-model="username" type="text" required placeholder="Username" ></b-form-input>
          </b-form-group>
          <b-form-group label="Message:" description="your gamer screams" >
            <b-form-input v-model="message" type="text" required placeholder="Username" ></b-form-input>
          </b-form-group>
          <b-button type="submit" variant="primary">Submit</b-button>
        </b-form>
      </div>
      <div class="col-md-9 p-3">
        <b-card header="!join to start quiz" bg-variant="light" class="text-center">
          <div class="overflow-auto" style="height:400px" v-chat-scroll>
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
              <div v-if="item.type==='notification'" class="d-flex flex-column rounded p-1 bg-info" style="width:100%;">
                <div>
                  <b-card-text></b-card-text>
                </div>
                <div>
                  <b-card-text>
                    <p class="text-break m-0" style="font-weight:bold;">{{ item.message }}</p>
                    <p class="m-0" v-for="(notif, i) in item.items" :key="i">{{ notif.text }}: {{ notif.val }} poin</p>
                  </b-card-text>
                </div>
              </div>
            </div>
          </div>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import {
  BForm, BFormGroup, BButton, BFormInput,
  BCard, BCardText,
  BIconAt
} from 'bootstrap-vue'
import submitSfx from '../assets/blop.mp3'
// import completeSfx from '../assets/GTA.mp3'
// import simplebar from 'simplebar-vue'
// import 'simplebar/dist/simplebar.min.css'

export default {
  data () {
    return {
      chats: [
        { username: 'lele1', message: 'test01', type: 'chat' },
        { username: 'lele1', message: 'test01', type: 'chat' },
        {
          message: 'Server notification',
          type: 'notification',
          items: [
            { text: 'bambang', val: '10' },
            { text: 'bambang', val: '10' },
            { text: 'bambang', val: '10' },
            { text: 'bambang', val: '10' }
          ]
        },
        { username: 'lele1', message: 'test01', type: 'chat' },
        { username: 'lele1', message: 'test01', type: 'chat' }
      ],
      username: '',
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
    BIconAt
    // simplebar
  },
  methods: {
    onSubmit () {
      console.log('masoook')
      const message = {
        username: this.username,
        message: this.message
      }
      new Audio(submitSfx).play()
      this.chats.push(message)
      this.message = ''
    }
  }
}
</script>
