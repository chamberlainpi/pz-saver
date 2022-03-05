<template>
  <label class="hbox items-center text-xs p-2 select-none cursor-pointer">
    <input type="checkbox" class="hidden" v-model="value" />
    <div
      class="hbox items-center px-2 pt-1 w-14 h-7 rel rounded-full m-0 text-white leading-5"
      :class="[value ? 'bg-green-500' : 'bg-red-900']">
      <i v-if="!value">OFF</i>
      <icon
        name="circle"
        class="abs right-1 top-0 text-lg transition-all opacity-80"
        :class="[value ? '-translate-x-7' : '']" />
      <i v-if="value" class="abs right-2">ON</i>
    </div>
  </label>
</template>

<script setup>
import { useModelWrapper } from '../utils/extensions'

const emit = defineEmits()
const props = defineProps({
  color: String,
  modelValue: Boolean,
})

const value = useModelWrapper(props, emit)
</script>
