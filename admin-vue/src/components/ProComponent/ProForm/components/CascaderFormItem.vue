<script setup lang="ts">
import { ElCascader } from 'element-plus'

defineProps<{
  attrs?: any
}>()
const modelValue = defineModel<any>('modelValue', { required: true })
</script>

<template>
  <ElCascader
    v-model="modelValue"
    :style="{ width: '100%', flex: 1 }"
    clearable
    filterable
    v-bind="attrs"
  />
</template>
