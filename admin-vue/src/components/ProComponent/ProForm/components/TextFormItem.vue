<script setup lang="ts">
import { ElText } from 'element-plus'

defineProps<{
  attrs?: any
}>()
const modelValue = defineModel<any>('modelValue', { required: true })
</script>

<template>
  <ElText v-bind="attrs">
    {{ modelValue || modelValue === 0 ? modelValue : '-' }}
  </ElText>
</template>
