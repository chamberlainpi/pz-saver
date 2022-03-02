<template>
  <div class="vbox bg-gray-400 w-screen h-screen">
    <div class="rel w-72 h-40">
      <img class="logo btn" alt="PZ logo" src="./assets/PzLogo.png" @click="shake('.logo', 0.5, 10)" />
    </div>

    <div class="vbox p-4">
      <div class="vbox max-w-lg nowrap">
        <div class="hbox items-center gap-2">
          <i>PZ Root:</i>
          <input
            class="rounded-md p-2 shadow-inner shadow-red-300 bg-opacity-70 bg-white w-full"
            type="text"
            v-model="configuration.pzRoot" />
          <button class="btn bg-green-800 text-white px-8 font-bold" @click="setConfig">Save</button>
        </div>

        <template v-if="configuration.pzRoot">
          <button class="btn bg-orange-400 text-white" @click="onLoadGameFolders">
            <icon name="copy px-2" />
            Load Game Folders
            <icon name="sync px-2" />
          </button>

          <div class="hbox all-center">
            <label v-for="filter in FILTERS" :key="filter" class="px-2 btn nowrap">
              <input type="radio" :value="filter" v-model="selectedFilter" />
              {{ filter }}
            </label>
          </div>
        </template>
      </div>

      <template v-if="configuration.pzRoot">
        <div class="game-folders bg-purple-50 p-2 rounded-xl">
          <p class="p-2 font-bold">Selected games: {{ gameFoldersSelected.length }}</p>
          <div v-for="gameFolder in gameFoldersFiltered" :key="gameFolder.path">
            <label class="hbox all-center text-lg gap-2 px-2 py-1">
              <input type="checkbox" class="scale-150" v-model="gameFolder.isSelected" />
              <i
                class="flex-shrink"
                :class="{
                  'text-purple-600 font-semibold': isBaseline(gameFolder.path),
                  'border border-green-600 rounded-md px-2': isCurrent(gameFolder.path),
                }"
                >{{ selectedFilter === 'All' ? gameFolder.shortPath : gameFolder.shorterPath }}</i
              >
              <i class="ml-auto opacity-50 font-mono" :title="gameFolder.date.mtimeMs">{{ gameFolder.ago.mtimeMs }}</i>
            </label>
          </div>
        </div>

        <div class="hbox">
          <button
            class="baseline btn bg-purple-600 text-white"
            :class="{ 'opacity-50': !hasOneSelected }"
            :disabled="!hasOneSelected"
            @click="onSetAsBaseline">
            Set as Baseline
          </button>

          <button
            class="baseline btn bg-green-600 text-white"
            :class="{ 'opacity-50': !hasOneSelected }"
            :disabled="!hasOneSelected"
            @click="onSetAsCurrent">
            Set as Current
          </button>
        </div>
      </template>

      <!-- <PZHello /> -->
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

const configuration = axiosRef({ pzRoot: '' }, '/api/config')
const selectedFilter = ref(cookies.filter || 'All')
const FILTERS = 'All, Builder, Survivor, Sandbox'.split(', ')
const gameFolders = ref([])
const gameFoldersSelected = computed(() => gameFolders.value.filter(g => g.isSelected))
const hasOneSelected = computed(() => gameFoldersSelected.value.length === 1)
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

  trace(data[0])
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

const isBaseline = path => configuration.value.baseline === path
const isCurrent = path => configuration.value.current === path

setTimeout(onLoadGameFolders, 500)
</script>
