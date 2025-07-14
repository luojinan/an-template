<script setup lang="ts">
import { ElTimePicker } from 'element-plus'

defineProps<{
  attrs?: any
}>()
const modelValue = defineModel<any>('modelValue', { required: true })
</script>

<template>
  <ElTimePicker
    v-model="modelValue"
    clearable
    v-bind="attrs"
  />
</template>
