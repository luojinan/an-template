<script setup lang="ts">
const modelValue = defineModel<any>('modelValue', { required: true })
defineProps<{
  attrs?: any
}>()
</script>

<template>
  <multi-upload
    v-model="modelValue"
    v-bind="attrs"
  />
</template>