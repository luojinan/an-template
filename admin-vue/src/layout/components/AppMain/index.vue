<script setup lang="ts">
import { useTagsViewStore } from '@/store'

const cachedViews = computed(() => useTagsViewStore().cachedViews) // 缓存页面集合
</script>

<template>
  <section class="app-main">
    <router-view>
      <template #default="{ Component, route }">
        <!-- TODO: 进入 讲师详情后 切换任意页面白屏，组件以及路由看上去没问题，可能动画样式影响了页面组件展示 -->
        <!-- <transition
          enter-active-class="animate__animated animate__fadeIn"
          mode="out-in"
        > -->
        <keep-alive :include="cachedViews">
          <component :is="Component" :key="route.path" />
        </keep-alive>
        <!-- </transition> -->
      </template>
    </router-view>
  </section>
</template>

<style lang="scss" scoped>
.app-main {
  position: absolute;
  width: 100%;
  height: 100%;
  min-height: calc(100vh - $navbar-height);
  overflow: hidden;
  background-color: var(--el-bg-color-page);
}

.hasTagsView .app-main {
  min-height: calc(100vh - $navbar-height - $tags-view-height);
}

.fixed-header + .app-main {
  min-height: 100vh;
  padding-top: $navbar-height;
}

.hasTagsView .fixed-header + .app-main {
  min-height: 100vh;
  padding-top: $navbar-height + $tags-view-height;
}

.layout-mix,
.layout-top {
  .fixed-header + .app-main {
    padding-top: 0;
  }
}

.layout-mix {
  .app-main {
    height: calc(100vh - $navbar-height);
    padding-top: 0;
    overflow-y: auto;
  }

  .hasTagsView .app-main {
    height: calc(100vh - $navbar-height - $tags-view-height);
    min-height: calc(100vh - $navbar-height - $tags-view-height);
  }

  .fixed-header + .app-main {
    min-height: calc(100vh - $navbar-height);
  }

  .hasTagsView .fixed-header + .app-main {
    height: calc(100vh - $navbar-height);
    min-height: calc(100vh - $navbar-height);
    padding-top: $tags-view-height;
  }
}

.layout-top {
  .hasTagsView .fixed-header + .app-main {
    padding-top: $tags-view-height;
  }
}
</style>
