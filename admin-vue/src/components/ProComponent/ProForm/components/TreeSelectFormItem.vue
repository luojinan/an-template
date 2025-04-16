<script setup lang="ts">
const modelValue = defineModel<any>('modelValue', { required: true })
defineProps<{
  attrs?: any
}>()
</script>

<template>
  <el-tree-select
    v-model="modelValue"
    clearable
    v-bind="attrs"
  />
</template>