<template>
  <div class="main-app vbox bg-gray-400 w-screen h-screen overflow-y-auto">
    <div class="abs inset-0 scanlines from-transparent to-black opacity-30 z-0"></div>

    <div class="rel w-72 h-32 self-center">
      <img class="logo btn" alt="PZ logo" src="./assets/PzLogo.png" @click="shake('.logo', 0.5, 10)" />
    </div>

    <div class="vbox rel z-10 bg-white bg-opacity-80">
      <div class="vbox p-4 gap-2">
        <div class="hbox nowrap">
          <div class="hbox items-center gap-2" v-if="!isCompact">
            <i>PZ Root:</i>
            <input
              class="rounded-md p-2 shadow-inner shadow-gray-500 bg-opacity-70 bg-white w-full"
              type="text"
              v-model="configuration.pzRoot" />

            <button class="btn bg-green-800 text-white w-48" @click="setConfig">
              <icon name="save mr-2" />
              Save
            </button>
          </div>

          <div class="ml-auto" v-if="configuration.pzRoot">
            <button class="btn w-36 bg-gray-700 text-white" @click="isCompact = !isCompact">
              <icon name="gear" />
              {{ isCompact ? 'Advanced' : 'Compact' }}
            </button>
          </div>
        </div>

        <template v-if="configuration.pzRoot">
          <PanelPeriodicSnapshot ref="panelPeriodicSnapshot" :config="configuration" @save-buffer="onSnapshotSaved" />
          <PanelConfigGameFolders ref="panelConfigGameFolders" :config="configuration" v-if="!isCompact" />
          <PanelSavedSnapshots ref="panelSavedSnapshots" v-if="!isCompact" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from '@vue/runtime-core'
import { axiosRef, fixSlash, wait, waitUntil, toDuration } from './utils/extensions'
import { cookies } from 'brownies'
import { shake } from './utils/fx'
import _ from 'lodash'
import axios from 'axios'
import { configuration, status } from './store'

const panelConfigGameFolders = ref(null)
const panelFileDiffs = ref(null)
const panelSavedSnapshots = ref(null)
const panelPeriodicSnapshot = ref(null)
const isCompact = ref(true)

async function onSnapshotSaved() {
  if (!panelSavedSnapshots || !panelSavedSnapshots.value) return
  await panelSavedSnapshots.value.updateBackupsList()
}

onMounted(() => {
  gsap.to('.scanlines', 0.45, { '--scanline-y': '5px', repeat: -1, ease: t => t })
})
</script>
