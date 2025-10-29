<script setup lang="ts">
import { computed } from 'vue'
import NavBar from '@/components/nav-bar/index.vue'
import tabbar from '@/components/tabbar/index.vue'
import { useTabbar } from '@/composables/useTabbar'
import { useDarkMode } from '@/composables/useToggleDarkMode'
import { useCachedViewStoreHook } from '@/store/modules/cached-view'
import { setImageUrl } from '@/utils/index'

const cachedViews = computed(() => {
  return useCachedViewStoreHook().cachedViewList
})

const { showTabbar } = useTabbar()
</script>

<template>
  <div class="app-wrapper">
    <van-config-provider :theme="useDarkMode() ? 'dark' : 'light'">
      <img
        :src="setImageUrl('top_bg@2x.png')"
        alt=""
        class="bg-image"
        mode="widthFix"
      >
      <NavBar />
      <router-view v-slot="{ Component }">
        <keep-alive :include="cachedViews">
          <component :is="Component" />
        </keep-alive>
      </router-view>
      <tabbar v-if="showTabbar" />
    </van-config-provider>
  </div>
</template>

<style scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}

.app-wrapper::after {
  content: "";
  display: table;
  clear: both;
}

.bg-image {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: auto;
}
</style>
