<script setup lang="ts">
import { ElScrollbar } from 'element-plus'
import { useAppStore, usePermissionStore, useSettingsStore } from '@/store'
import { LayoutEnum } from '@/enums/LayoutEnum'

const appStore = useAppStore()
const settingsStore = useSettingsStore()
const permissionStore = usePermissionStore()

const sidebarLogo = computed(() => settingsStore.sidebarLogo)
const layout = computed(() => settingsStore.layout)
</script>

<template>
  <div :class="{ 'has-logo': sidebarLogo }">
    <!-- 混合布局 -->
    <div v-if="layout == LayoutEnum.MIX" class="flex w-full">
      <SidebarLogo v-if="sidebarLogo" :collapse="!appStore.sidebar.opened" />
      <SidebarMixTopMenu class="flex-1" />
      <NavbarRight />
    </div>
    <!-- 左侧布局 || 顶部布局 -->
    <template v-else>
      <SidebarLogo v-if="sidebarLogo" :collapse="!appStore.sidebar.opened" />
      <ElScrollbar>
        <SidebarMenu :menu-list="permissionStore.routes" base-path="" />
      </ElScrollbar>
      <NavbarRight v-if="layout === LayoutEnum.TOP" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.has-logo {
  .el-scrollbar {
    height: calc(100vh - $navbar-height);
  }
}
</style>
