<template>
  <div class="main-app vbox bg-gray-400 w-screen h-screen overflow-y-auto">
    <div class="abs inset-0 scanlines from-transparent to-black opacity-30 z-0"></div>

    <div class="rel w-72 h-32 self-center">
      <img class="logo btn" alt="PZ logo" src="./assets/PzLogo.png" @click="shake('.logo', 0.5, 10)" />
    </div>

    <div class="vbox rel z-10 bg-white bg-opacity-80">
      <div class="vbox p-4">
        <div class="vbox max-w-xl nowrap">
          <div class="hbox items-center gap-2">
            <i>PZ Root:</i>
            <input
              class="rounded-md p-2 shadow-inner shadow-red-300 bg-opacity-70 bg-white w-full"
              type="text"
              v-model="configuration.pzRoot" />

            <button class="btn bg-green-800 text-white w-48" @click="setConfig">
              <icon name="save mr-2" />
              Save
            </button>
          </div>
        </div>

        <template v-if="configuration.pzRoot">
          <PanelConfigGameFolders ref="panelConfigGameFolders" :config="configuration" />

          <!-- <PanelFileDiffs ref="panelFileDiffs" @save-snapshot="onSnapshotSaved" /> -->

          <div class="periodic-snapshot mt-3 panel border-red-600border border-red-500">
            <div class="hbox items-center pb-4">
              <h1 class="mr-4"><icon name="camera p-2" />Periodic Snapshot</h1>

              <div class="hbox items-center ml-auto">
                <i class="b">Enabled</i>
                <ToggleButton v-model="isAutoSaveActive" label="Auto-Save" />
              </div>
            </div>

            <div class="hbox border border-black rounded-md mb-2 p-1">
              <div id="progress" class="h-3 rounded-md" :class="isSnapping ? 'bg-yellow-400' : 'bg-green-600'"></div>
            </div>
            <div class="hbox gap-2 text-2xl">
              <icon name="clock" />
              <i class="mr-2">Every:</i>
              <label v-for="period in periodChoices" :key="period">
                <input type="radio" class="scale-150 mr-2 ml-4" :value="period" v-model="periodSelected" />
                <i>{{ period }}</i>
              </label>
            </div>

            <button class="btn w-full h-48 bg-red-900 text-white" @click="onSaveBufferNow"> SAVE NOW! </button>
          </div>

          <PanelSavedSnapshots ref="panelSavedSnapshots" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from '@vue/runtime-core'
import { axiosRef, fixSlash, wait, waitUntil } from './utils/extensions'
import { cookies } from 'brownies'
import { shake } from './utils/fx'
import socket from './socket'
import _ from 'lodash'
import axios from 'axios'
import { configuration, status } from './store'

const panelConfigGameFolders = ref(null)
const panelFileDiffs = ref(null)
const panelSavedSnapshots = ref(null)
const periodChoices = '2s 10s 30s 5m 20m 60m'.split(' ')
const periodSelected = ref('10s')
const isAutoSaveActive = ref(false)
const isSnapping = ref(false)
var _twnAutoSave = null

const units = { s: 1, m: 60 }
watch(isAutoSaveActive, bool => {
  autoSnapshot()
})

async function autoSnapshot() {
  if (!isAutoSaveActive.value) {
    _twnAutoSave && _twnAutoSave.kill()
    return
  }

  const [_, time, unit] = periodSelected.value.match(/([0-9]*)([a-z]*)/)
  const interval = time * units[unit]

  isSnapping.value = true
  TweenMax.set('#progress', { width: '100%' })

  let { data } = await axios.post('/api/buffer-snapshot')

  isSnapping.value = false
  _twnAutoSave = TweenMax.fromTo(
    '#progress',
    interval,
    { width: '0%' },
    { width: '100%', ease: t => t, onComplete: autoSnapshot }
  )
}

async function onSaveBufferNow() {
  let { data } = await axios.post('/api/buffer-write-current')
  trace('onSaveBufferNow', data)

  await panelSavedSnapshots.value.updateBackupsList()
}

async function onSnapshotSaved() {
  await panelSavedSnapshots.value.updateBackupsList()
}

onMounted(() => {
  gsap.to('.scanlines', 0.45, { '--scanline-y': '5px', repeat: -1, ease: t => t })
})
</script>
