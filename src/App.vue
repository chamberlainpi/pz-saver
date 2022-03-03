<template>
  <div class="vbox bg-gray-400 w-screen h-screen">
    <div class="rel w-72 h-32 self-center">
      <img class="logo btn" alt="PZ logo" src="./assets/PzLogo.png" @click="shake('.logo', 0.5, 10)" />
    </div>

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

        <div class="hbox items-center w-full text-2xl" v-if="configuration.pzRoot">
          <i class="font-bold">Filters:</i>
          <label v-for="filter in FILTERS" :key="filter" class="px-2 btn nowrap">
            <input type="radio" :value="filter" v-model="selectedFilter" />
            {{ filter }}
          </label>
        </div>
      </div>

      <template v-if="configuration.pzRoot">
        <div class="game-folders panel">
          <div class="hbox all-center font-bold mb-3">
            <h1 class="nowrap"><icon name="folder-open p-2" />Folders</h1>

            <div class="ml-auto">
              <button class="btn bg-red-600 text-white" v-if="gameFoldersSelected.length" @click="deselectAll">
                <icon name="ban" />
              </button>

              <button
                class="path-baseline btn bg-purple-600 text-white"
                :class="{ 'opacity-50': !oneSelected || isCurrent(oneSelected) }"
                :disabled="!oneSelected || isCurrent(oneSelected)"
                @click="onSetAsBaseline">
                Set Baseline
              </button>

              <button
                class="path-current btn bg-green-600 text-white"
                :class="{ 'opacity-50': !oneSelected || isBaseline(oneSelected) }"
                :disabled="!oneSelected || isBaseline(oneSelected)"
                @click="onSetAsCurrent">
                Set Current
              </button>

              <button class="btn bg-orange-400 text-white" @click="onLoadGameFolders">
                <icon name="sync" />
                Refresh
              </button>
            </div>
          </div>

          <div v-for="gameFolder in gameFoldersFiltered" :key="gameFolder.path">
            <label class="hbox all-center text-lg gap-2 px-2 py-1">
              <input type="checkbox" class="rel scale-150 -top-1 btn" v-model="gameFolder.isSelected" />
              <i class="flex-shrink hbox all-center">
                <i
                  :class="{
                    'text-purple-600': isBaseline(gameFolder),
                    'text-green-600': isCurrent(gameFolder),
                  }">
                  {{ selectedFilter === 'All' ? gameFolder.shortPath : gameFolder.shorterPath }}
                </i>
                <i class="small-tag bg-purple-600 hbox all-center gap-2" v-if="isBaseline(gameFolder)">
                  B
                  <icon
                    v-if="!status.isBaselineSnapped"
                    name="camera"
                    class="text-xl transition-transform duration-200 hover:scale-125 cursor-pointer"
                    @click.prevent.stop="onBaselineSnapshot" />
                </i>
                <i class="small-tag bg-green-600" v-if="isCurrent(gameFolder)">C</i>
              </i>
              <i class="ml-auto opacity-50 font-mono" :title="gameFolder.date.mtimeMs">{{ gameFolder.ago.mtimeMs }}</i>
            </label>
          </div>
        </div>

        <div class="file-diffs p-2 panel mt-2">
          <div class="hbox all-center">
            <h1><icon name="down-left-and-up-right-to-center p-2" />File Diffs</h1>

            <button class="btn bg-yellow-500 text-white ml-auto" @click="onFileDiffsCompare">
              <icon name="code-compare" />
              Compare
            </button>
            <button class="btn bg-green-500 text-white" @click="onSaveSnapshot">
              <icon name="camera" />
              Snapshot
            </button>
          </div>

          <div
            class="vbox p-2 bg-green-900 text-green-100 font-mono text-xs overflow-y-scroll overflow-x-hidden max-h-96"
            v-if="status.report">
            <i class="pre">Meta: {{ status.report.meta }}</i>
            <i>Added: {{ status.report.added.length }}</i>
            <i>Modified: {{ status.report.modified.length }}</i>
            <!-- <i>Accessed: {{ status.report.accessed.length }}</i>
            <i>Status Changed: {{ status.report.statusChanged.length }}</i> -->
          </div>
        </div>

        <div class="file-backups p-2 panel mt-2">
          <div class="hbox items-center">
            <h1><icon name="camera p-2" />Saved Snapshots</h1>
          </div>

          <div class="backup-list vbox border border-gray-300 rounded-md p-3 my-1">
            <div v-for="zipFile in backups" :key="zipFile.key" class="hbox all-center">
              <i>{{ zipFile.value.split('__').pop() }}</i>

              <div class="backup-buttons ml-auto">
                <button class="btn bg-blue-600 text-white" @click="onSnapshotRestore(zipFile)">
                  <icon name="trash-arrow-up" />
                  Restore
                </button>

                <button class="btn bg-red-600 text-white" @click="onSnapshotDelete(zipFile)">
                  <icon name="trash" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from '@vue/runtime-core'
import { shake } from './utils/fx'
import socket from './socket'
import { axiosRef, fixSlash } from './utils/extensions'
import axios from 'axios'
import { cookies } from 'brownies'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import _ from 'lodash'

dayjs.extend(duration)
dayjs.extend(relativeTime)

const status = ref({ isBaselineSnapped: false, isCurrentSnapped: false })
const backups = ref([])
const configuration = axiosRef({ pzRoot: '' }, '/api/config')
const selectedFilter = ref(cookies.filter || 'All')
const FILTERS = 'All, Builder, Survivor, Sandbox'.split(', ')
const gameFolders = ref([])
const gameFoldersSelected = computed(() => gameFolders.value.filter(g => g.isSelected))
const oneSelected = computed(() => (gameFoldersSelected.value.length === 1 ? gameFoldersSelected.value[0] : null))

const gameFoldersFiltered = computed(() => {
  cookies.filter = selectedFilter.value

  if (selectedFilter.value === 'All') return gameFolders.value

  const filter = `/${selectedFilter.value}/`
  return gameFolders.value //
    .filter(g => g.path.includes(filter))
    .map(g => {
      g.shorterPath = g.shortPath.split('/').pop()
      return g
    })
})

async function saveConfig() {
  const { data } = await axios.post('/api/config', configuration.value)
  trace(data)
}
async function setConfig() {
  configuration.value.pzRoot = fixSlash(configuration.value.pzRoot)
  await saveConfig()
}

async function onLoadGameFolders() {
  let { data } = await axios.get('/api/load-game-folders')

  const now = dayjs()
  const toDuration = ms =>
    dayjs //
      .duration(now.diff(dayjs(ms)))
      .format('D[d] HH:mm [ago]') // s[s]
      .replace('0d ', '')

  data = data //
    .filter(d => !d.path.includes('Multiplayer'))
    .map(data => ({
      ...data, //
      shortPath: data.path.split('/Saves/').pop(),
      isSelected: false,
      date: _.mapValues(data.stat, ms => dayjs(ms).format('YYYY-MM-DD HH:mm:ss')),
      ago: _.mapValues(data.stat, ms => toDuration(ms)),
    }))

  data = _.sortBy(data, 'stat.mtimeMs').reverse()

  gameFolders.value = data
}

async function onSetAsBaseline() {
  configuration.value.baseline = gameFoldersSelected.value[0].path

  await saveConfig()
}

async function onSetAsCurrent() {
  configuration.value.current = gameFoldersSelected.value[0].path

  await saveConfig()
}

async function onBaselineSnapshot() {
  trace('SNAP!', configuration.value.baseline)
}

async function onFileDiffsCompare() {
  let { data } = await axios.get('/api/file-diffs-compare')

  trace('File diffs data:', data)
}

async function checkStatuses() {
  let { data } = await axios.get('/api/status')
  status.value = data

  setTimeout(checkStatuses, 3000)
}

async function onSaveSnapshot() {
  let { data } = await axios.post('/api/save-snapshot')
  trace('Snapshot...', data)

  await updateBackupsList()
}

async function onSnapshotRestore(zipFile) {
  let { data } = await axios.put('/api/backup-restore/' + zipFile.key)
  trace(data)
}

async function onSnapshotDelete(zipFile) {
  let { data } = await axios.delete('/api/backup-delete/' + zipFile.key)
  trace(data)

  await updateBackupsList()
}

async function updateBackupsList() {
  let { data } = await axios.get('/api/backups')

  backups.value = data
}

const isBaseline = game => configuration.value.baseline === game.path
const isCurrent = game => configuration.value.current === game.path
const deselectAll = () => gameFolders.value.forEach(g => (g.isSelected = false))

setTimeout(() => {
  onLoadGameFolders()
  checkStatuses()
  updateBackupsList()
}, 1)
</script>
