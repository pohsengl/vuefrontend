<script setup lang="ts">
import WelcomeItem from "./WelcomeItem.vue";
import ToolingIcon from "./icons/IconTooling.vue";
import audio from '../assets/audio1.wav'
import { ref } from "vue";
import axios from 'axios'
import { useRoute, useRouter } from "vue-router";
import { saveCookie } from "@/auth";

const DEFAULT_AUDIO_URL = 'https://d20d6d2exg5ld3.cloudfront.net/audio-69b1e1ab-8647-4d5a-98bf-c313ffac2bf8.wav'
const LOGIN_URL='https://sileroapp.auth.us-west-2.amazoncognito.com/oauth2/authorize?client_id=4nfe005o4h7ms329j2m8vb5ru0&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fvue.lpssss.site'
const textinput = ref('')
const isGenerating = ref(false)
const audioURL = ref(DEFAULT_AUDIO_URL)
const backendChoice = ref('lambda')
const generateTime = ref(0.0)
const isAuthenticated = ref(false)
const router = useRouter()
const route = useRoute()

function checkAuth() {
  //TODO: check time validity
  if (document.cookie.split(';').some((item) =>
    item.trim().startsWith('access_token='))) {
    isAuthenticated.value = true
    console.log('Access token existed')
  }
  else {
    console.log('access token doesnt exist')
  }
}

async function getTokenFromCode() {
  console.log(route.query)

  if("code" in route.query){
    const params = new URLSearchParams({
        'grant_type': 'authorization_code',
        'client_id': '4nfe005o4h7ms329j2m8vb5ru0',
        'redirect_uri': 'https://vue.lpssss.site',
        'code': `${route.query['code']}`
      })
    const response= await axios({
      url: 'https://sileroapp.auth.us-west-2.amazoncognito.com/oauth2/token',
      method: 'post',
      data: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log(response)
    saveCookie(response.data["access_token"], response.data["refresh_token"])
    isAuthenticated.value=true
  }

}

function login() {
  window.location.href = LOGIN_URL
}

function clearAll() {
  textinput.value = ''
  isGenerating.value = false
  audioURL.value = DEFAULT_AUDIO_URL
  backendChoice.value = 'lambda'
}


function submitText() {
  isGenerating.value = true
  postText(textinput.value, backendChoice.value)
}

async function postText(textinput: string, backendChoice: string) {
  const startTime = performance.now()
  try {
    let POSTURL: string
    if (backendChoice === 'lambda') {
      POSTURL = 'https://cwi64lxsw0.execute-api.us-west-2.amazonaws.com/silero-lambda'
    }
    else if (backendChoice === 'ecs') {
      POSTURL = 'https://lpssss.site/tts/'
    }
    else {
      POSTURL = 'https://cwi64lxsw0.execute-api.us-west-2.amazonaws.com/silero-lambda'
    }
    const data = {
      text: textinput
    }
    const response = await axios.post(POSTURL, data);
    console.log(response);
    if (response.status === 201 || response.status === 200) {
      isGenerating.value = true
      console.log(response)
      audioURL.value = 'https://d20d6d2exg5ld3.cloudfront.net/' + response.data.audioURL
    }
  } catch (error) {
    console.error(error);
  }
  const endTime = performance.now()
  generateTime.value = Math.round(endTime - startTime)
}

  getTokenFromCode()
  checkAuth()
</script>

<template>

  <template v-if="isAuthenticated">
    <WelcomeItem>
      <template #icon>
        <ToolingIcon />
      </template>
      <template #heading>Input Text</template>

      <textarea maxlength="1000" rows="8" cols="30" style="resize: none" v-model="textinput" />
      <br>
      <div>
        <span style="padding:5px">
          <input type="radio" id="lambda" value="lambda" v-model="backendChoice" />
          <label for="lambda">Lambda</label>
        </span>
        <span style="padding:5px">
          <input type="radio" id="ecs" value="ecs" v-model="backendChoice" />
          <label for="ecs">ECS</label>
        </span>
      </div>
      <div>
        <span style="padding:2px">
          <button type="button" @click="submitText">Submit</button>
        </span><span style="padding:2px">
          <button type="button" @click="clearAll">Reset</button>
        </span>
      </div>
    </WelcomeItem>
    <WelcomeItem>
      <template #icon>
        <ToolingIcon />
      </template>
      <template #heading>Output Speech</template>
      <div>
        <div v-if="isGenerating">
          Generating Audio...
        </div>
        <div v-else>
          Audio Ready!
        </div>
      </div>
      <div>
        Time taken ({{ backendChoice }}): {{ generateTime }} ms
      </div>
      <div>
        <audio controls :src="audioURL"></audio>
      </div>
    </WelcomeItem>
  </template>
  <template v-else>
    <button style="padding: 10px" type="button" @click="login">Log In</button>
  </template>
</template>
