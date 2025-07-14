<script setup lang="ts">
import { ElTreeSelect } from 'element-plus'

defineProps<{
  attrs?: any
}>()
const modelValue = defineModel<any>('modelValue', { required: true })
</script>

<template>
  <ElTreeSelect
    v-model="modelValue"
    clearable
    v-bind="attrs"
  />
</template>
