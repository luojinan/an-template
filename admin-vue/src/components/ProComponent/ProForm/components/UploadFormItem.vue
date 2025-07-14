<script setup lang="ts">
import MultiUpload from '@/components/Upload/MultiUpload.vue'

defineProps<{
  attrs?: any
}>()
const modelValue = defineModel<any>('modelValue', { required: true })
</script>

<template>
  <MultiUpload
    v-model="modelValue"
    v-bind="attrs"
  />
</template>
