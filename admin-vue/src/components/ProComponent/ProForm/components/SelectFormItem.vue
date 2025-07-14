<script setup lang="ts">
import { ElOption, ElSelect } from 'element-plus'

defineProps<{
  attrs?: any
  valueEnum?: Array<{
    value: any
    label: string
    [key: string]: any
  }>
}>()
const modelValue = defineModel<any>('modelValue', { required: true })
</script>

<template>
  <ElSelect v-model="modelValue" clearable filterable v-bind="attrs">
    <template v-for="option in valueEnum" :key="option.value">
      <ElOption v-bind="option" />
    </template>
  </ElSelect>
</template>
