<!-- 左侧边菜单：包括左侧布局(left)、顶部布局(all)、混合布局(left) -->
<script lang="ts" setup>
import path from 'path-browserify'
import { useRoute } from 'vue-router'
import { ElMenu } from 'element-plus'
import { useAppStore, useSettingsStore } from '@/store'
import { isExternal } from '@/utils/index'
import variables from '@/styles/variables.module.scss'

const props = defineProps({
  menuList: {
    required: true,
    default: () => {
      return []
    },
    type: Array<any>,
  },
  basePath: {
    type: String,
    required: true,
  },
})
const settingsStore = useSettingsStore()
const appStore = useAppStore()
const currentRoute = useRoute()
const layout = computed(() => settingsStore.layout)
/**
 * 解析路径
 *
 * @param routePath 路由路径 /user
 */
function resolvePath(routePath: string) {
  if (isExternal(routePath)) { return routePath }

  if (isExternal(props.basePath)) { return props.basePath }

  // 完整绝对路径 = 父级路径(/system) + 路由路径(/user)
  const fullPath = path.resolve(props.basePath, routePath)
  return fullPath
}
</script>

<template>
  <ElMenu
    :default-active="currentRoute.path"
    :collapse="!appStore.sidebar.opened"
    :background-color="variables['menu-background']"
    :text-color="variables['menu-text']"
    :active-text-color="variables['menu-active-text']"
    :unique-opened="false"
    :collapse-transition="false"
    :style="`--el-menu-hover-bg-color: ${variables['menu-hover']};`"
    :mode="layout === 'top' ? 'horizontal' : 'vertical'"
  >
    <SidebarMenuItem
      v-for="route in menuList"
      :key="route.path"
      :item="route"
      :base-path="resolvePath(route.path)"
      :is-collapse="!appStore.sidebar.opened"
    />
  </ElMenu>
</template>
