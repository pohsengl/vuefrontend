<script setup lang="ts">
import WelcomeItem from "./WelcomeItem.vue";
import ToolingIcon from "./icons/IconTooling.vue";
import audio from '../assets/audio1.wav'
import { ref } from "vue";
import axios from 'axios'


const textinput = ref('')
const showOutput = ref(false)
const audioURL = ref('')
const backendChoice = ref('')

function clearAll() {
  textinput.value = ''
  showOutput.value = false
  audioURL.value = ''
  backendChoice.value = ''
}


function submitText() {
  console.log(textinput.value)
  console.log("Post")
  postText(textinput.value, backendChoice.value)
}

async function postText(textinput: string, backendChoice: string) {

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
      showOutput.value = true
      console.log(response)
      audioURL.value = 'https://d20d6d2exg5ld3.cloudfront.net/' + response.data.audioURL
      //audioURL.value='https://d20d6d2exg5ld3.cloudfront.net/audio-f06e1ee6-099c-4278-a7c1-cc5e1c40b699.wav'
    }
  } catch (error) {
    console.error(error);
  }
}

</script>

<template>

  <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>Input Text</template>

    <textarea v-model="textinput" />
    <br>
    <div>
      <input type="radio" id="lambda" value="lambda" v-model="backendChoice" />
      <label for="lambda">Lambda</label>
    </div>
    <div>
      <input type="radio" id="ecs" value="ecs" v-model="backendChoice" />
      <label for="ecs">ECS</label>
    </div>
    <button type="button" @click="submitText">Submit</button>

  </WelcomeItem>
  <WelcomeItem v-if="showOutput">
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>Output Speech ({{ backendChoice }})</template>

    <audio controls :src="audioURL"></audio>
    <div>
      <button type="button" @click="clearAll">Submit</button>
    </div>
  </WelcomeItem>
</template>
