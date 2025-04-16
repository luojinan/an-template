<script setup lang="ts">
defineProps<{
  attrs?: any
}>()
const modelValue = defineModel<any>('modelValue', { required: true })
</script>

<template>
  <el-text v-bind="attrs">
    {{ modelValue || modelValue === 0 ? modelValue : '-' }}
  </el-text>
</template>
