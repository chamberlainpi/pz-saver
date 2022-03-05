<template>
  <div class="file-diffs p-2 panel mt-2">
    <div class="hbox all-center">
      <h1><icon name="down-left-and-up-right-to-center p-2" />File Diffs</h1>

      <div class="hbox all-center ml-auto">
        <i>Auto Save</i>
        <ToggleButton v-model="isAutoSaveActive" label="Auto-Save" />

        <button class="btn bg-yellow-500 text-white" @click="onFileDiffsCompare">
          <icon name="code-compare" />
          Compare
        </button>
        <button class="btn bg-green-500 text-white" @click="onSaveSnapshot">
          <icon name="camera" />
          Snapshot
        </button>
      </div>
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
</template>

<script setup>
import { ref } from '@vue/runtime-core'
import { status, checkStatuses } from '../store'

const emit = defineEmits()

const isAutoSaveActive = ref(false)

async function onFileDiffsCompare() {
  let { data } = await axios.get('/api/file-diffs-compare')

  trace('File diffs data:', data)
}

async function onSaveSnapshot() {
  let { data } = await axios.post('/api/save-snapshot')
  trace('Snapshot...', data)

  emit('save-snapshot')
}
</script>
