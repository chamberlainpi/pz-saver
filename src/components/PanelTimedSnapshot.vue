<template>
  <div class="timed-snapshot mt-3 panel border-red-600border border-red-500">
    <div class="hbox items-center pb-4">
      <h1 class="mr-4 cursor-pointer"><icon name="camera p-2" />Timed Snapshot</h1>

      <div class="hbox items-center ml-auto">
        <i
          class="b px-2 py-1 border rounded-md border-transparent transition-colors duration-200"
          :class="{ 'border-green-500': isPZRunning }">
          Auto-Start
          <icon name="circle" :class="[isPZRunning ? 'animate-pulse text-green-500' : 'text-gray-500 opacity-50']" />
        </i>
        <ToggleButton v-model="isAutoStart" />
        <i class="b ml-3">Enabled</i>
        <ToggleButton v-model="isEnabled" />
      </div>
    </div>

    <template v-if="!isCompact">
      <div class="hbox border border-black rounded-md mb-2 p-1">
        <div id="progress" class="h-3 rounded-md" :class="isSnapping ? 'bg-yellow-400' : 'bg-green-600'"></div>
      </div>
      <div class="hbox items-center text-xl">
        <icon name="clock mr-1" />
        <i class="mr-2">Every:</i>
        <label
          v-for="period in periodChoices"
          :key="period"
          class="btn border-2 border-gray-400 px-3 py-1 rounded-xl text-white text-center mx-0 mr-1"
          :class="periodSelected == period ? 'bg-green-500 border-green-200' : 'bg-blue-400 border-blue-200'">
          <input type="radio" class="hidden" :value="period" v-model="periodSelected" />
          <i>{{ period }}</i>
        </label>
      </div>
    </template>

    <div class="hbox">
      <button
        class="btn w-full bg-red-900 text-white vbox all-center h-20"
        @click="onSaveBuffer('oldest')"
        title="Create a ZIP based on the oldest snapshot.">
        <i>SAVE PREVIOUS</i>
        <i class="text-xs opacity-50 font-mono">{{
          hasEnoughSnaps ? toDuration(snapshotPairs[0].dateZippedMS) : '[--:--:--]'
        }}</i>
      </button>
      <button
        class="btn w-full bg-yellow-700 text-white vbox all-center h-20"
        @click="onSaveBuffer('newest')"
        title="Create a ZIP based on the newest snapshot.">
        <i>SAVE RECENT</i>
        <i class="text-xs opacity-50 font-mono">{{
          hasEnoughSnaps ? toDuration(snapshotPairs[1].dateZippedMS) : '[--:--:--]'
        }}</i>
      </button>
      <button
        class="btn w-full bg-green-900 text-white vbox all-center h-20"
        @click="onSaveBuffer('instantly')"
        title="Create a new ZIP right now!">
        <i>SAVE INSTANTLY!</i>
        <i class="text-xs opacity-50 mt-2 hbox items-center">
          <b class="fa fa-exclamation-triangle text-2xl mr-2"></b>
          Quit to MainMenu <br />or Exit Game first!
        </i>
      </button>
    </div>
    <i class="border-4 border-double border-red-600 p-2" v-if="errorMessage">
      {{ errorMessage }}
    </i>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from '@vue/runtime-core'
import { toDuration } from '../utils/extensions'
import { status, isCompact } from '../store'
import _ from 'lodash'
import axios from 'axios'
import { cookies } from 'brownies'

var _twnAutoSave = null
const snapshotPairs = ref([])
const isSnapping = ref(false)
const hasEnoughSnaps = computed(() => snapshotPairs.value.length == 2)
const isEnabled = ref(false)
const isAutoStart = ref(cookies.isAutoStart ?? false)
const periodChoices = '2s 10s 30s 5m 20m 60m'.split(' ')
const periodSelected = ref('5m')
const errorMessage = ref('')
const isPZRunning = computed(() => status.value.isPZRunning)

watch(isAutoStart, bool => ((cookies.isAutoStart = bool), updateEnabled(bool)))
watch(isPZRunning, bool => updateEnabled(bool))

const updateEnabled = bool => isAutoStart.value && (isEnabled.value = bool)

const emit = defineEmits()

watch(isEnabled, bool => {
  autoSnapshot()
})

const units = { s: 1, m: 60 }
async function autoSnapshot() {
  if (!isEnabled.value) {
    TweenMax.set('#progress', { width: '0%' })
    _twnAutoSave && _twnAutoSave.kill()
    return
  }

  const [__, time, unit] = periodSelected.value.match(/([0-9]*)([a-z]*)/)
  const interval = time * units[unit]

  isSnapping.value = true
  TweenMax.set('#progress', { width: '100%' })

  let { data } = await axios.post('/buffer-snapshot')
  snapshotPairs.value = _.sortBy(data.pair, 'dateZippedMS')
  trace(snapshotPairs.value.map(p => p.name).join('\n'))

  isSnapping.value = false
  _twnAutoSave = TweenMax.fromTo(
    '#progress',
    interval,
    { width: '0%' },
    { width: '100%', ease: t => t, onComplete: autoSnapshot }
  )
}

async function onSaveBuffer(which) {
  errorMessage.value = ''
  let { data } = await axios.post('/buffer-write-current', { which })
  if (data.isError) {
    errorMessage.value = data.isError
    setTimeout(() => (errorMessage.value = ''), 3000)
    return
  }

  trace('onSaveBuffer', data)

  emit('save-buffer')
}

onBeforeUnmount(() => {
  trace('Killing the tween...')
  _twnAutoSave && _twnAutoSave.kill()
})
</script>
