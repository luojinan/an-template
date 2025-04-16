<script setup lang="ts">
const modelValue = defineModel<any>('modelValue', { required: true })
defineProps<{
  attrs?: any
  valueEnum?: Array<{
    value: any
    label: string
    [key: string]: any
  }>
}>()
</script>

<template>
  <el-checkbox-group v-model="modelValue" v-bind="attrs">
    <template v-for="option in valueEnum" :key="option.value">
      <el-checkbox v-bind="option" />
    </template>
  </el-checkbox-group>
</template>