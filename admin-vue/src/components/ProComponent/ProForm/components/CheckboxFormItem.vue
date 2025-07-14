<script setup lang="ts">
import { ElCheckbox, ElCheckboxGroup } from 'element-plus'

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
  <ElCheckboxGroup v-model="modelValue" v-bind="attrs">
    <template v-for="option in valueEnum" :key="option.value">
      <ElCheckbox v-bind="option" />
    </template>
  </ElCheckboxGroup>
</template>
