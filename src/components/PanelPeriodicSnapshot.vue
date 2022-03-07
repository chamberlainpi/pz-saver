<template>
  <div class="periodic-snapshot mt-3 panel border-red-600border border-red-500">
    <div class="hbox items-center pb-4">
      <h1 class="mr-4"><icon name="camera p-2" />Periodic Snapshot</h1>

      <div class="hbox items-center ml-auto">
        <template v-if="!isCompact">
          <i
            class="b px-1 border rounded-md border-transparent transition-colors duration-200"
            :class="{ 'border-green-700': isPZRunning && isAutoStart }">
            Auto-Start
          </i>
          <ToggleButton v-model="isAutoStart" />
        </template>
        <i class="b">Enabled</i>
        <ToggleButton v-model="isEnabled" />
      </div>
    </div>

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

    <button class="btn w-full h-48 bg-red-900 text-white vbox all-center" @click="onSaveBufferNow('prev')">
      <i>SAVE PREVIOUS</i>
      <i class="text-xs opacity-50">I've just been bitten / died / lost all my XP and I don't like it!</i>
      <i class="text-xs opacity-50">{{
        hasEnoughSnaps ? toDuration(snapshotPairs[0].dateZippedMS) : '[not ready yet]'
      }}</i>
    </button>
    <button class="btn w-full h-20 bg-green-900 text-white vbox all-center" @click="onSaveBufferNow('now')">
      <i>SAVE NOW!</i>
      <i class="text-xs opacity-50">I'm satisfied with my progress and wish to save now.</i>
      <i class="text-xs opacity-50">{{
        hasEnoughSnaps ? toDuration(snapshotPairs[1].dateZippedMS) : '[not ready yet]'
      }}</i>
    </button>
    <i class="border-4 border-double border-red-600 p-2" v-if="errorMessage">
      {{ errorMessage }}
    </i>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from '@vue/runtime-core'
import { toDuration } from '../utils/extensions'
import { configuration, status, checkStatuses } from '../store'
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
const props = defineProps({
  isCompact: Boolean,
})

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

async function onSaveBufferNow(which) {
  errorMessage.value = ''
  let { data } = await axios.post('/buffer-write-current', { which })
  if (data.isError) {
    errorMessage.value = data.isError
    setTimeout(() => (errorMessage.value = ''), 3000)
    return
  }

  trace('onSaveBufferNow', data)

  emit('save-buffer')
}

onBeforeUnmount(() => {
  trace('Killing the tween...')
  _twnAutoSave && _twnAutoSave.kill()
})
</script>
