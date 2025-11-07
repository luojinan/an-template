<script setup lang="ts">
import { ElInputTag } from 'element-plus'

defineProps<{
  attrs?: any
}>()
const modelValue = defineModel<string[]>('modelValue', { required: true })
</script>

<template>
  <ElInputTag
    v-model="modelValue"
    clearable
    aria-label="Please click the Enter key after input"
    v-bind="attrs"
  />
</template>
