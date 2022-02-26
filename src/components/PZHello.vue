<template>
  <div class="bg-gray-300 p-4 gap-2">
    <h1>
      Counting: {{ count }} - connected:
      <i :class="connectionStatus"></i>
    </h1>
    <button class="bg-green-300 text-white rounded-lg p-2" @click="socket.emit('increase')">Increase</button>
    <button class="bg-red-300 text-white rounded-lg p-2" @click="socket.emit('decrease')">Decrease</button>
  </div>
</template>

<script setup>
import socket from '../socket'
import { computed } from '@vue/runtime-core'
import { axiosRef, intervalRef } from '../utils/extensions'

const count = axiosRef(0, '/api/count')
const isConnected = intervalRef(false, () => socket.connected, 500)
const connectionStatus = computed(() => (isConnected.value ? 'fa fa-check text-green-500' : 'fa fa-times text-red-500'))

socket.on('count-update', newCount => {
  trace('Does this get triggered?')
  count.value = newCount
})
</script>
