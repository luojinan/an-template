<script setup lang="ts">
import { ElRadio, ElRadioGroup } from 'element-plus'

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
  <ElRadioGroup v-model="modelValue" v-bind="attrs">
    <template v-for="option in valueEnum" :key="option.value">
      <ElRadio v-bind="option" />
    </template>
  </ElRadioGroup>
</template>
