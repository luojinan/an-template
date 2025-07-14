<script setup lang="ts">
import { ElConfigProvider, ElWatermark } from 'element-plus'
import { useAppStore, useSettingsStore } from '@/store'
import defaultSettings from '@/settings'
import { ThemeEnum } from '@/enums/ThemeEnum'
import type { SizeEnum } from '@/enums/SizeEnum'

const appStore = useAppStore()
const settingsStore = useSettingsStore()

const locale = computed(() => appStore.locale)
const size = computed(() => appStore.size as SizeEnum)
const watermarkEnabled = computed(() => settingsStore.watermarkEnabled)

// 明亮/暗黑主题水印字体颜色适配
const fontColor = computed(() => {
  return settingsStore.theme === ThemeEnum.DARK
    ? 'rgba(255, 255, 255, .15)'
    : 'rgba(0, 0, 0, .15)'
})
</script>

<template>
  <ElConfigProvider :locale="locale" :size="size">
    <!-- 开启水印 -->
    <ElWatermark
      v-if="watermarkEnabled"
      :font="{ color: fontColor }"
      :content="defaultSettings.watermarkContent"
      class="wh-full"
    >
      <router-view />
    </ElWatermark>
    <!-- 关闭水印 -->
    <router-view v-else />
  </ElConfigProvider>
</template>
