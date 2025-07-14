<script setup lang="ts">
import { ElDatePicker } from 'element-plus'

defineProps<{
  attrs?: any
}>()
const modelValue = defineModel<any>('modelValue', { required: true })
</script>

<template>
  <ElDatePicker
    v-model="modelValue"
    :style="{ width: '100%', flex: 1 }"
    clearable
    v-bind="attrs"
  />
</template>
