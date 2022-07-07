<script setup lang="ts">
import WelcomeItem from "./WelcomeItem.vue";
import DocumentationIcon from "./icons/IconDocumentation.vue";
import ToolingIcon from "./icons/IconTooling.vue";
import EcosystemIcon from "./icons/IconEcosystem.vue";
import CommunityIcon from "./icons/IconCommunity.vue";
import SupportIcon from "./icons/IconSupport.vue";
import audio from '../assets/audio1.wav'
import { ref } from "vue";
import axios from 'axios'


const textinput=ref('')

function playAudio(){
  let a=new Audio(audio)
  a.play()
}

function submitText(){
  console.log(textinput.value)
  postText()
}

async function postText(){
  try{
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
    console.log(response);
  }catch (error) {
    console.error(error);
  }
}

</script>

<template>
  <input v-model="textinput" />
  <button type="button" @click="submitText">Submit</button>
  <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>Community</template>

    <button type="button" @click="playAudio">Click me</button>

  </WelcomeItem>
</template>
