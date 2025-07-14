<script setup lang="ts">
import { type RouteLocationMatched, useRoute } from 'vue-router'
import { compile } from 'path-to-regexp'
import { onBeforeMount, ref, watch } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import router from '@/router'

const currentRoute = useRoute()
function pathCompile(path: string) {
  const { params } = currentRoute
  const toPath = compile(path)
  return toPath(params)
}

const breadcrumbs = ref<Array<RouteLocationMatched>>([])

function getBreadcrumb() {
  let matched = currentRoute.matched.filter(
    item => item.meta && item.meta.title,
  )
  const first = matched[0]
  if (!isDashboard(first)) {
    matched = [
      { path: '/dashboard' } as any,
    ].concat(matched)
  }
  breadcrumbs.value = matched.filter((item) => {
    return item.meta && item.meta.title && item.meta.breadcrumb !== false
  })
}

function isDashboard(route: RouteLocationMatched) {
  const name = route && route.name
  if (!name) { return false }

  return (
    name.toString().trim().toLocaleLowerCase()
    === 'Dashboard'.toLocaleLowerCase()
  )
}

function handleLink(item: any) {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect).catch((err) => {
      console.warn(err)
    })
    return
  }
  router.push(pathCompile(path)).catch((err) => {
    console.warn(err)
  })
}

watch(
  () => currentRoute.path,
  (path) => {
    if (path.startsWith('/redirect/')) { return }

    getBreadcrumb()
  },
)

onBeforeMount(() => {
  getBreadcrumb()
})
</script>

<template>
  <ElBreadcrumb class="flex-y-center">
    <transition-group enter-active-class="animate__animated animate__fadeInRight">
      <ElBreadcrumbItem v-for="(item, index) in breadcrumbs" :key="item.path">
        <span
          v-if="item.redirect === 'noredirect' || index === breadcrumbs.length - 1
          " class="color-gray-400"
        >{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">
          {{ item.meta.title }}
        </a>
      </ElBreadcrumbItem>
    </transition-group>
  </ElBreadcrumb>
</template>

<style lang="scss" scoped>
// 覆盖 element-plus 的样式
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}
</style>
