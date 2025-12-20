<script setup lang="ts">
defineEmits<{
  showSearch: []
}>()
</script>

<template>
  <!-- 顶部导航栏 -->
  <div class="navbar-container">
    <!-- 导航栏左侧 -->
    <NavbarLeft />
    <!-- 导航栏右侧 -->
    <NavbarRight @show-search="$emit('showSearch')" />
  </div>
</template>

<style lang="scss" scoped>
.navbar-container {
  @apply flex-x-between;

  height: $navbar-height;
  background: var(--el-bg-color);
}
</style>
