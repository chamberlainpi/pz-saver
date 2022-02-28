<template>
  <div class="bg-gray-400 grid grid-cols-2">
    <div class="rel w-72 h-40 scale-150">
      <img class="logo btn" alt="PZ logo" src="./assets/PzLogo.png" @click="shake('.logo', 0.5, 10)" />
    </div>

    <div class="vbox gap-2 z-10 p-2 bg-gray-200 bg-opacity-60">
      <p>Please provide path to your PZ Saves:</p>
      <div class="hbox items-center gap-2">
        <i>PZRoot:</i>
        <input
          class="rounded-md p-2 shadow-inner shadow-red-300 bg-opacity-70 bg-white w-full"
          type="text"
          v-model="configuration.pzRoot" />
      </div>

      <template v-if="configuration.pzRoot">
        <button class="btn bg-orange-400 text-white" @click="onLoadGameFolders">
          <icon name="copy px-2" />
          Load Game Folders
          <icon name="sync px-2" />
        </button>
      </template>

      <button class="btn bg-green-800 text-white" @click="setConfig">Set Config</button>
      <!-- <PZHello /> -->
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from '@vue/runtime-core'
import { shake } from './utils/fx'
import socket from './socket'
import { axiosRef } from './utils/extensions'
import axios from 'axios'

const configuration = axiosRef({ pzRoot: '' }, '/api/config')

async function setConfig() {
  const response = await axios.post('/api/config', configuration.value)
  trace(response)
}

async function onLoadGameFolders() {
  const { data } = await axios.get('/api/load-game-folders')
  trace(data)
}
</script>
