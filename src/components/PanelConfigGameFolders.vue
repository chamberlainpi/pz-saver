<template>
  <div class="game-folders panel">
    <div class="hbox all-center font-bold">
      <h1 class="nowrap"><icon name="folder-open p-2" />Folders</h1>

      <div class="ml-auto">
        <button class="btn bg-red-600 text-white" v-if="gameFoldersSelected.length" @click="deselectAll">
          <icon name="ban" />
        </button>

        <button
          class="path-current btn bg-green-600 text-white"
          :class="{ 'opacity-50': !oneSelected }"
          :disabled="!oneSelected"
          @click="onSetAsCurrent">
          Set Current
        </button>

        <button class="btn bg-orange-400 text-white" @click="onLoadGameFolders">
          <icon name="sync" />
          Refresh
        </button>
      </div>
    </div>

    <div class="hbox items-center w-full text-2xl px-2">
      <i class="font-bold">Filters:</i>
      <label v-for="filter in FILTERS" :key="filter" class="px-2 btn nowrap">
        <input type="radio" :value="filter" v-model="selectedFilter" />
        {{ filter }}
      </label>
    </div>

    <div v-for="gameFolder in gameFoldersFiltered" :key="gameFolder.path">
      <label class="hbox all-center text-lg gap-2 px-2 py-1">
        <input type="checkbox" class="rel scale-150 -top-1 btn" v-model="gameFolder.isSelected" />
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
import { ref, computed, onMounted } from 'vue'
import { cookies } from 'brownies'
import { configuration, status, checkStatuses } from '../store'
import { toDuration } from '../utils/extensions'

const FILTERS = 'All, Builder, Survivor, Sandbox'.split(', ')
const selectedFilter = ref(cookies.filter || 'All')
const gameFolders = ref([])
const gameFoldersSelected = computed(() => gameFolders.value.filter(g => g.isSelected))
const oneSelected = computed(() => (gameFoldersSelected.value.length === 1 ? gameFoldersSelected.value[0] : null))
const isCurrent = game => configuration.value.current === game.path
const deselectAll = () => gameFolders.value.forEach(g => (g.isSelected = false))

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

async function onSetAsCurrent() {
  configuration.value.current = gameFoldersSelected.value[0].path

  await saveConfig()
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
}

onMounted(() => {
  onLoadGameFolders()
  checkStatuses()
})
////////////////////////////////
</script>
