<template>
  <i :class="`fa fa-` + name"></i>
</template>

<script setup>
defineProps({
  name: String,
})
</script>
