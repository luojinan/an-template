<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ElColorPicker } from 'element-plus'

const props = defineProps({
  modelValue: String,
})

const emit = defineEmits(['update:modelValue'])

// 定义颜色预设
const colorPresets = [
  '#1677ff',
  '#409EFF',
  '#ff4500',
  '#ff8c00',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsva(120, 40, 94)',
]

const currentColor = ref(props.modelValue)

watch(currentColor, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>

<template>
  <ElColorPicker
    v-model="currentColor"
    disabled
    :predefine="colorPresets"
    popper-class="theme-picker-dropdown"
  />
</template>

<style scoped>
:deep(.theme-picker-dropdown) {
  z-index: 99999 !important;
}
</style>
