<script setup lang="ts">
const modelValue = defineModel<any>('modelValue', { required: true })
defineProps<{
  attrs?: any
}>()
</script>

<template>
  <el-date-picker
    v-model="modelValue"
    :style="{ width: '100%', flex: 1 }"
    clearable
    v-bind="attrs"
  />
</template>