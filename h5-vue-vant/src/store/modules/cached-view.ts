import type { toRouteType } from '@/router'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { store } from '@/store'

export const useCachedViewStore = defineStore('cached-view', () => {
  // 缓存页面 keepAlive
  const cachedViewList = ref<string[]>([])

  const addCachedView = (view: toRouteType) => {
    // 不重复添加
    if (cachedViewList.value.includes(view.name as string)) { return }
    if (!view?.meta?.noCache) {
      cachedViewList.value.push(view.name as string)
    }
  }

  const delCachedView = (view: toRouteType) => {
    const index = cachedViewList.value.indexOf(view.name as string)
    if (index > -1) {
      cachedViewList.value.splice(index, 1)
    }
  }

  const delAllCachedViews = () => {
    cachedViewList.value = []
  }

  return {
    cachedViewList,
    addCachedView,
    delCachedView,
    delAllCachedViews,
  }
})

export function useCachedViewStoreHook() {
  return useCachedViewStore(store)
}
