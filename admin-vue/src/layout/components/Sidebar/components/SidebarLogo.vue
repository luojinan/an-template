<script lang="ts" setup>
import defaultSettings from '@/settings'
import { useSettingsStore } from '@/store'

defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
})

const settingsStore = useSettingsStore()

// const logo = ref(new URL(`../../../../assets/logo.png`, import.meta.url).href)
const logo = 'https://dsjedu-assets.oss-cn-shanghai.aliyuncs.com/d681a33afced343e16991ccc94380beb.png'
</script>

<template>
  <div class="logo-container">
    <transition enter-active-class="animate__animated animate__fadeInLeft">
      <router-link v-if="collapse" class="wh-full flex-center" to="/">
        <img v-if="settingsStore.sidebarLogo" :src="logo" class="logo-image">
      </router-link>

      <router-link v-else class="wh-full flex-center" to="/">
        <img v-if="settingsStore.sidebarLogo" :src="logo" class="logo-image">
        <span class="logo-title"> {{ defaultSettings.title }}</span>
      </router-link>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.logo-container {
  width: 100%;
  height: $navbar-height;
  background-color: $sidebar-logo-background;

  .logo-image {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  .logo-title {
    flex-shrink: 0; /* 防止容器在空间不足时缩小 */
    margin-left: 10px;
    font-size: 16px;
    font-weight: bold;
    color: $menu-text;
  }
}

.layout-top,
.layout-mix {
  .logo-container {
    width: $sidebar-width;
  }

  &.hideSidebar {
    .logo-container {
      width: $sidebar-width-collapsed;
    }
  }
}
</style>
