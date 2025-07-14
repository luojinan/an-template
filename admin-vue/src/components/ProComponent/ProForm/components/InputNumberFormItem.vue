<script setup lang="ts">
import { ElInputNumber } from 'element-plus'

defineProps<{
  attrs?: any
}>()
const modelValue = defineModel<any>('modelValue', { required: true })
</script>

<template>
  <ElInputNumber
    v-model="modelValue"
    controls-position="right"
    :style="{ width: '100%', flex: 1 }"
    v-bind="attrs"
  />
</template>
