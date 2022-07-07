<script setup lang="ts">
import WelcomeItem from "./WelcomeItem.vue";
import ToolingIcon from "./icons/IconTooling.vue";
import audio from '../assets/audio1.wav'
import { ref } from "vue";
import axios from 'axios'


const textinput = ref('')
const showOutput = ref(false)
const audioURL=ref('')


function submitText() {
  console.log(textinput.value)
  postText(textinput.value)
}

async function postText(textinput: string) {
  try {
    const POSTURL = 'https://jsonplaceholder.typicode.com/todos'
    const data = {
      id: 1,
      text: textinput
    }
    const response = await axios.post(POSTURL, data);
    console.log(response);
    if (response.status === 201){
      showOutput.value = true
      audioURL.value="https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav"
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
    <button type="button" @click="submitText">Submit</button>

  </WelcomeItem>
  <WelcomeItem v-if="showOutput">
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>Output Speech</template>

    <audio controls :src="audioURL"></audio>

  </WelcomeItem>
</template>
