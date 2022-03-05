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

          <PanelFileDiffs ref="panelFileDiffs" @save-snapshot="onSnapshotSaved" />

          <PanelSavedSnapshots ref="panelSavedSnapshots" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from '@vue/runtime-core'
import { axiosRef, fixSlash, wait, waitUntil } from './utils/extensions'
import { cookies } from 'brownies'
import { shake } from './utils/fx'
import socket from './socket'
import _ from 'lodash'
import axios from 'axios'
import { configuration } from './store'

const panelConfigGameFolders = ref(null)
const panelFileDiffs = ref(null)
const panelSavedSnapshots = ref(null)

async function onSnapshotSaved() {
  await panelSavedSnapshots.value.updateBackupsList()
}

onMounted(() => {
  gsap.to('.scanlines', 0.45, { '--scanline-y': '5px', repeat: -1, ease: t => t })
})
</script>
