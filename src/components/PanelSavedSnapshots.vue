<template>
  <div class="file-backups p-2 panel">
    <div class="hbox items-center">
      <h1><icon name="camera p-2" />Saved Snapshots</h1>
    </div>

    <div
      class="backup-list vbox border border-gray-300 rounded-md my-1"
      :class="[isCompact ? 'text-sm grid grid-cols-3 p-1' : 'p-3', { 'opacity-50': isBusy }]">
      <div v-for="zipFile in backupsTrimmed" :key="zipFile.key" class="hbox all-center">
        <i class="break-words">{{ cleanFilename(zipFile.value) }}</i>

        <div class="backup-buttons" :class="{ 'ml-auto': !isCompact }">
          <button
            class="btn bg-blue-600 text-white"
            :class="{ 'sml-btn': isCompact }"
            @click="onSnapshotRestore(zipFile)">
            <icon name="trash-arrow-up" />
            <i v-if="!isCompact" class="ml-1">Restore</i>
          </button>

          <button
            class="btn bg-red-600 text-white"
            :class="{ 'sml-btn': isCompact }"
            @click="onSnapshotDelete(zipFile)">
            <icon name="trash" />
            <i v-if="!isCompact" class="ml-1">Delete</i>
          </button>

          <!-- <button class="btn bg-red-600 text-white" :class="{ 'sml-btn': isCompact }" @click="onSnapshotTest(zipFile)">
            <icon name="plus" />
            <i v-if="!isCompact" class="ml-1">Test</i>
          </button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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

  backups.value = data
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

async function onSnapshotTest(zipFile) {
  if (isBusy.value) return
  isBusy.value = true

  let { data } = await axios.put('/backup-test/' + zipFile.key)
  trace(data)
  isBusy.value = false
}

defineExpose({ updateBackupsList })

updateBackupsList()
</script>
