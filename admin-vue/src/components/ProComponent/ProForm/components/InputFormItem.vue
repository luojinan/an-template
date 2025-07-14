<script setup lang="ts">
import { ElInput } from 'element-plus'

defineProps<{
  attrs?: any
}>()
const modelValue = defineModel<any>('modelValue', { required: true })
</script>

<template>
  <ElInput
    v-model="modelValue"
    clearable
    v-bind="attrs"
  />
</template>
