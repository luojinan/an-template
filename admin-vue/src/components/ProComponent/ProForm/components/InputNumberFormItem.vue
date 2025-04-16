<script setup lang="ts">
const modelValue = defineModel<any>('modelValue', { required: true })
defineProps<{
  attrs?: any
}>()
</script>

<template>
  <el-input-number
    v-model="modelValue"
    controls-position="right"
    :style="{ width: '100%', flex: 1 }"
    v-bind="attrs"
  />
</template>