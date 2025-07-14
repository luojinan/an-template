<script setup lang="ts">
import { ElImage } from 'element-plus'
import { computed } from 'vue'

const { col = {}, scope = {} } = defineProps<{
  col: any
  scope: any
}>()

const images = computed(() => {
  if (!col.prop) { return [] }
  const value = scope.row[col.prop]
  if (Array.isArray(value) && value.length) {
    return value.map((item: string, index: number) => ({
      src: `${item}?x-oss-process=image/format,webp/resize,w_120`,
      previewList: value,
      initialIndex: index,
    }))
  }
  else if (value) {
    return [{
      src: `${value}?x-oss-process=image/format,webp/resize,w_80`,
      previewList: [value],
      initialIndex: 0,
    }]
  }
  return []
})
</script>

<template>
  <template v-for="img in images" :key="img.src">
    <ElImage
      :src="img.src"
      :preview-src-list="img.previewList"
      :initial-index="img.initialIndex"
      hide-on-click-modal
      :preview-teleported="true"
      :style="`width: ${col.imageWidth ?? 40}px; height: ${col.imageHeight ?? 40}px`"
    />
  </template>
</template>
