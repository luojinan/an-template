<script setup lang="ts">
import { ElDivider, ElDrawer, ElSwitch } from 'element-plus'
import { useAppStore, usePermissionStore, useSettingsStore } from '@/store'
import { LayoutEnum } from '@/enums/LayoutEnum'
import { ThemeEnum } from '@/enums/ThemeEnum'

const route = useRoute()
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const permissionStore = usePermissionStore()

const settingsVisible = computed({
  get() {
    return settingsStore.settingsVisible
  },
  set() {
    settingsStore.settingsVisible = false
  },
})

/**
 * 切换主题颜色
 */
function changeThemeColor(color: string) {
  settingsStore.changeThemeColor(color)
}

/**
 * 切换主题
 */
const isDark = ref<boolean>(settingsStore.theme === ThemeEnum.DARK)
function changeTheme(val: any) {
  isDark.value = val
  settingsStore.changeTheme(isDark.value ? ThemeEnum.DARK : ThemeEnum.LIGHT)
}

/**
 * 切换布局
 */
function changeLayout(layout: string) {
  settingsStore.changeLayout(layout)
  if (layout === LayoutEnum.MIX) { route.name && againActiveTop(route.name as string) }
  else if (layout === LayoutEnum.TOP) { appStore.openSideBar() }
}

function againActiveTop(newVal: string) {
  const parent = findOutermostParent(permissionStore.routes, newVal)
  if (appStore.activeTopMenu !== parent.path) { appStore.activeTopMenu(parent.path) }
}

function findOutermostParent(tree: any[], findName: string) {
  const parentMap: any = {}

  function buildParentMap(node: any, parent: any) {
    parentMap[node.name] = parent

    if (node.children) {
      for (let i = 0; i < node.children.length; i++) { buildParentMap(node.children[i], node) }
    }
  }

  for (let i = 0; i < tree.length; i++) { buildParentMap(tree[i], null) }

  let currentNode = parentMap[findName]
  while (currentNode) {
    if (!parentMap[currentNode.name]) { return currentNode }

    currentNode = parentMap[currentNode.name]
  }

  return null
}
</script>

<template>
  <ElDrawer v-model="settingsVisible" size="300" title="项目设置">
    <ElDivider>主题设置</ElDivider>

    <div class="flex-center">
      <ElSwitch v-model="isDark" active-icon="Moon" inactive-icon="Sunny" @change="changeTheme" />
    </div>

    <ElDivider>界面设置</ElDivider>

    <div class="settings-option">
      <span class="text-xs">主题颜色</span>
      <ThemeColorPicker v-model="settingsStore.themeColor" @update:model-value="changeThemeColor" />
    </div>

    <div class="settings-option">
      <span class="text-xs">开启 Tags-views</span>
      <ElSwitch v-model="settingsStore.tagsView" />
    </div>

    <div class="settings-option">
      <span class="text-xs">固定 Header</span>
      <ElSwitch v-model="settingsStore.fixedHeader" />
    </div>

    <div class="settings-option">
      <span class="text-xs">侧边栏 Logo</span>
      <ElSwitch v-model="settingsStore.sidebarLogo" />
    </div>

    <div class="settings-option">
      <span class="text-xs">开启水印</span>
      <ElSwitch v-model="settingsStore.watermarkEnabled" />
    </div>

    <ElDivider>{{ 'settings.navigation' }}</ElDivider>

    <LayoutSelect v-model="settingsStore.layout" @update:model-value="changeLayout" />
  </ElDrawer>
</template>

<style lang="scss" scoped>
.settings-option {
  @apply py-1 flex-x-between;
}
</style>
