<template>
  <div class="game-folders panel">
    <div class="hbox items-center gap-1 font-bold">
      <h1 class="nowrap"><icon name="folder-open p-2" />Folders</h1>

      <label class="hbox gap-1 shrink items-center mx-2">
        <input type="checkbox" class="rel scale-150 -top-1 btn" v-model="isAutoSetCurrent" />
        <i class="">Auto Set Current</i>
      </label>

      <div class="ml-auto hbox flex-nowrap" v-if="!isCompact">
        <button class="btn bg-red-600 text-white" v-if="gameFoldersSelected.length" @click="deselectAll">
          <icon name="ban" />
        </button>

        <button
          class="path-current btn bg-green-600 text-white"
          :class="{ 'opacity-50': !oneSelected }"
          :disabled="!oneSelected"
          @click="onSetAsCurrent(gameFoldersSelected[0].path)">
          Set Current
        </button>

        <button class="btn bg-orange-400 text-white" @click="onLoadGameFolders">
          <icon name="sync" />
          Refresh
        </button>
      </div>
    </div>

    <div class="hbox items-center w-full text-2xl px-2" v-if="!isCompact">
      <i class="font-bold">Filters:</i>
      <label v-for="filter in FILTERS" :key="filter" class="px-2 btn nowrap" :title="filter.fullname">
        <input type="radio" :value="filter.fullname" v-model="selectedFilter" />
        {{ filter.alias }}
      </label>
    </div>

    <div v-for="gameFolder in gameFoldersFiltered" :key="gameFolder.path">
      <label class="hbox all-center text-lg gap-2 px-2 py-1">
        <input type="checkbox" class="rel scale-150 -top-1 btn" v-model="gameFolder.isSelected" v-if="!isCompact" />
        <i class="flex-shrink hbox all-center">
          <i
            :class="{
              'text-green-600': isCurrent(gameFolder),
            }">
            {{ selectedFilter === 'All' ? gameFolder.shortPath : gameFolder.shorterPath }}
          </i>
          <i class="small-tag bg-green-600" v-if="isCurrent(gameFolder)">C</i>
        </i>
        <i class="ml-auto opacity-50 font-mono" :title="gameFolder.date.mtimeMs">{{ gameFolder.ago.mtimeMs }}</i>
      </label>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import dayjs from 'dayjs'
import _ from 'lodash'
import { ref, computed, watch, onMounted } from 'vue'
import { cookies } from 'brownies'
import { configuration, status, checkStatuses, saveConfig, isCompact } from '../store'
import { toDuration } from '../utils/extensions'

const FILTERS = 'All, Build:Builder, Surv:Survivor, Sand:Sandbox, YH1D:You Have One Day'.split(', ').map(str => {
  let [alias, fullname] = str.split(':')
  if (!fullname) fullname = alias
  return { alias, fullname }
})

const selectedFilter = ref(cookies.filter || 'All')
const gameFolders = ref([])
const gameFoldersSelected = computed(() => gameFolders.value.filter(g => g.isSelected))
const oneSelected = computed(() => (gameFoldersSelected.value.length === 1 ? gameFoldersSelected.value[0] : null))
const isCurrent = game => configuration.value.current === game.path
const deselectAll = () => gameFolders.value.forEach(g => (g.isSelected = false))
const isAutoSetCurrent = ref(cookies.isAutoSetCurrent ?? false)

const gameFoldersFiltered = computed(() => {
  cookies.filter = selectedFilter.value

  if (selectedFilter.value === 'All') return gameFolders.value

  const filter = `/${selectedFilter.value}/`
  return gameFolders.value //
    .filter(g => g.path.includes(filter) && (!isCompact.value || isCurrent(g)))
    .map(g => {
      g.shorterPath = g.shortPath.split('/').pop()
      return g
    })
})

async function onSetAsCurrent(currentPath) {
  configuration.value.current = currentPath

  return await saveConfig()
}

async function onLoadGameFolders() {
  let { data } = await axios.get('/load-game-folders')

  const now = dayjs()

  data = data //
    .filter(d => !d.path.includes('Multiplayer'))
    .map(data => ({
      ...data, //
      shortPath: data.path.split('/Saves/').pop(),
      isSelected: false,
      date: _.mapValues(data.stat, ms => dayjs(ms).format('YYYY-MM-DD HH:mm:ss')),
      ago: _.mapValues(data.stat, ms => toDuration(ms, now)),
    }))

  data = _.sortBy(data, 'stat.mtimeMs').reverse()

  gameFolders.value = data

  return data
}

async function autoDetectSetCurrent() {
  const gameFolders = await onLoadGameFolders()
  const newCurrent = gameFolders[0].path

  if (configuration.value.current != newCurrent) {
    const savedCurrent = await onSetAsCurrent(gameFolders[0].path)
    trace('AUTO: NEW CURRENT GAME FOLDER ASSIGNED:', savedCurrent)
  }

  if (isAutoSetCurrent.value) {
    setTimeout(autoDetectSetCurrent, 1000 * 60 * 1) //1min
  }
}

watch(isAutoSetCurrent, newVal => {
  cookies.isAutoSetCurrent = newVal
  if (newVal) return autoDetectSetCurrent()
})

onMounted(() => {
  onLoadGameFolders()
  checkStatuses()

  if (isAutoSetCurrent.value) autoDetectSetCurrent()
})
////////////////////////////////
</script>
