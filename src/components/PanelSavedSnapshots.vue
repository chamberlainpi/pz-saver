<template>
  <div class="file-backups p-2 panel">
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

<script setup>
import { ref } from '@vue/reactivity'
import axios from 'axios'

const backups = ref([])

async function updateBackupsList() {
  let { data } = await axios.get('/api/backups')

  backups.value = data
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

defineExpose({ updateBackupsList })

updateBackupsList()
</script>
