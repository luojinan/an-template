<script setup lang="ts">
const modelValue = defineModel<any>('modelValue', { required: true })
defineProps<{
  attrs?: any
}>()
</script>

<template>
  <el-cascader
    v-model="modelValue"
    :style="{ width: '100%', flex: 1 }"
    clearable
    filterable
    v-bind="attrs"
  />
</template>