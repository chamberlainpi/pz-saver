<template>
  <div class="file-backups p-2 panel">
    <div class="hbox items-center">
      <h1><icon name="camera p-2" />Saved Snapshots</h1>
    </div>

    <div
      class="backup-list vbox border border-gray-300 rounded-md my-1"
      :class="[isCompact ? 'text-md grid grid-cols-3 p-1' : 'p-3', { 'opacity-50': isBusy }]">
      <div v-for="zipFile in backupsTrimmed" :key="zipFile.key" class="vbox all-center">
        <i class="break-words">{{ zipFile.cleanName }}</i>

        <div class="backup-buttons text-2xl" :class="{ 'ml-auto': !isCompact }">
          <button
            class="btn bg-blue-600 text-white p-3"
            :class="{ 'sml-btn': isCompact }"
            @click="onSnapshotRestore(zipFile)">
            <icon name="trash-arrow-up" />
            <i v-if="!isCompact" class="ml-1">Restore</i>
          </button>

          <button
            class="btn bg-red-600 text-white p-3"
            :class="{ 'sml-btn': isCompact }"
            @click="onSnapshotDelete(zipFile)">
            <icon name="trash" />
            <i v-if="!isCompact" class="ml-1">Delete</i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed } from 'vue'
import { isCompact } from '../store'
import axios from 'axios'

const isBusy = ref(false)
const backups = ref([])
const backupsTrimmed = computed(() => (isCompact.value ? backups.value.slice(backups.value.length - 3) : backups.value))

const cleanFilename = filename => {
  const name = filename.split('__').pop()
  return isCompact.value ? name.split('.')[0].replace('_', ' ') : name
}

async function updateBackupsList() {
  let { data } = await axios.get('/backups')

  data.forEach(zip => (zip.cleanName = cleanFilename(zip.value)))

  backups.value = _.sortBy(data, 'cleanName')
}

async function onSnapshotRestore(zipFile) {
  if (isBusy.value) return
  isBusy.value = true

  let { data } = await axios.put('/backup-restore/' + zipFile.key)
  trace(data)
  isBusy.value = false
}

async function onSnapshotDelete(zipFile) {
  if (isBusy.value) return
  isBusy.value = true

  let { data } = await axios.delete('/backup-delete/' + zipFile.key)
  trace(data)

  await updateBackupsList()
  isBusy.value = false
}

defineExpose({ updateBackupsList })

updateBackupsList()
</script>
