<!-- 混合布局菜单(top) -->
<script lang="ts" setup>
import type { RouteRecordRaw } from 'vue-router'
import { ElIcon, ElMenu, ElMenuItem, ElScrollbar } from 'element-plus'
import { useAppStore, usePermissionStore } from '@/store'
import variables from '@/styles/variables.module.scss'

const appStore = useAppStore()
const permissionStore = usePermissionStore()
const router = useRouter()

const activePath = computed(() => appStore.activeTopMenuPath)

// 顶部菜单集合
const mixTopMenus = ref<RouteRecordRaw[]>([])

/**
 * 菜单选择事件
 */
function handleMenuSelect(routePath: string) {
  appStore.activeTopMenu(routePath)
  permissionStore.setMixLeftMenus(routePath)
  // 获取左侧菜单集合，默认跳转到第一个菜单
  const mixLeftMenus = permissionStore.mixLeftMenus
  goToFirstMenu(mixLeftMenus)
}

/**
 * 默认跳转到左侧第一个菜单
 */
function goToFirstMenu(menus: RouteRecordRaw[]) {
  if (menus.length === 0) { return }

  const [first] = menus

  if (first.children && first.children.length > 0) {
    goToFirstMenu(first.children as RouteRecordRaw[])
  }
  else if (first.name) {
    router.push({
      name: first.name,
    })
  }
}

// 初始化顶部菜单
onMounted(() => {
  mixTopMenus.value = permissionStore.routes.filter(
    item => !item.meta || !item.meta.hidden,
  )
})
</script>

<template>
  <ElScrollbar>
    <ElMenu
      mode="horizontal" :default-active="activePath" :background-color="variables['menu-background']"
      :text-color="variables['menu-text']" :active-text-color="variables['menu-active-text']"
      @select="handleMenuSelect"
    >
      <ElMenuItem v-for="route in mixTopMenus" :key="route.path" :index="route.path">
        <template #title>
          <template v-if="route.meta && route.meta.icon">
            <ElIcon v-if="route.meta.icon.startsWith('el-icon')" class="sub-el-icon">
              <component :is="route.meta.icon.replace('el-icon-', '')" />
            </ElIcon>
            <div v-else :class="`i-svg:${route.meta.icon}`" />
          </template>
          <span v-if="route.path === '/'"> 首页 </span>
          <template v-else>
            <span v-if="route.meta && route.meta.title" class="ml-1">
              {{ route.meta.title }}
            </span>
          </template>
        </template>
      </ElMenuItem>
    </ElMenu>
  </ElScrollbar>
</template>
