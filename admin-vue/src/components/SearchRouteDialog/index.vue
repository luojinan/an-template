<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElDialog, ElInput } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { usePermissionStoreHook } from '@/store/modules/permission'
import {
  type RouteInfo,
  getRecentRoutes,
  highlightMatch,
  recordRouteVisit,
  searchRoutes,
} from '@/utils/searchRoutes'

const router = useRouter()
const dialogVisible = ref(false)
const searchQuery = ref('')
const inputRef = ref<InstanceType<typeof ElInput> | null>(null)
const selectedIndex = ref(0)

// 计算所有可用路由
const permissionStore = usePermissionStoreHook()

const allRoutes = computed(() => {
  return permissionStore.routes
})

// 计算搜索结果
const searchResults = computed(() => {
  const query = searchQuery.value.trim()
  let results
  if (!query) {
    // 空查询显示最近访问
    results = getRecentRoutes(allRoutes.value)
  }
  else {
    results = searchRoutes(allRoutes.value, query)
  }
  console.log('搜索结果:', results)
  return results
})

// 处理搜索输入
function handleSearch(value: string) {
  searchQuery.value = value
  selectedIndex.value = 0 // 重置选中项
}

// 选中结果
function selectResult(result: RouteInfo) {
  dialogVisible.value = false
  searchQuery.value = ''
  selectedIndex.value = 0

  // 记录访问
  recordRouteVisit(result.fullPath)

  // 导航到路由
  if (result.name) {
    router.push({ name: result.name })
  }
  else {
    router.push(result.fullPath)
  }
}

// 处理键盘事件
function handleKeydown(e: KeyboardEvent) {
  if (!dialogVisible.value) { return }

  const results = searchResults.value

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, results.length - 1)
      break
    case 'ArrowUp':
      e.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
      break
    case 'Enter':
      e.preventDefault()
      if (results[selectedIndex.value]) {
        selectResult(results[selectedIndex.value])
      }
      break
    case 'Escape':
      e.preventDefault()
      dialogVisible.value = false
      break
  }
}

// 打开对话框
async function open() {
  dialogVisible.value = true
  await nextTick()

  // 聚焦输入框
  inputRef.value?.focus()

  // 全选文本
  nextTick(() => {
    inputRef.value?.select()
  })
}

// 关闭对话框
function close() {
  dialogVisible.value = false
  searchQuery.value = ''
  selectedIndex.value = 0
}

// 监听查询变化，重置选中索引
watch(searchResults, () => {
  selectedIndex.value = 0
})

// 监听弹窗打开，自动聚焦输入框
watch(dialogVisible, (visible) => {
  if (visible) {
    // 使用 setTimeout 确保 dialog 动画完成后再聚焦
    setTimeout(() => {
      inputRef.value?.focus()
    }, 100)
  }
})

// 暴露方法给父组件
defineExpose({
  open,
  close,
})

// 监听键盘快捷键
function onKeydown(e: KeyboardEvent) {
  const isKKey = e.key.toLowerCase() === 'k'
  const isCommandKey = e.metaKey || e.ctrlKey

  // Command/Ctrl + K
  if (isCommandKey && isKKey) {
    e.preventDefault()
    open()
  }
}

// 添加和移除事件监听
if (typeof window !== 'undefined') {
  try {
    window.removeEventListener('keydown', onKeydown)
  }
  catch {
    // 忽略错误
  }
  window.addEventListener('keydown', onKeydown)
}
</script>

<template>
  <!-- Teleport to body to avoid z-index issues -->
  <Teleport to="body">
    <ElDialog
      v-model="dialogVisible"
      :show-close="false"
      :modal="true"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      width="600px"
      top="8vh"
      class="search-route-dialog"
      @closed="close"
    >
      <div class="search-container">
        <!-- 搜索输入框 -->
        <div class="search-input-wrapper">
          <ElInput
            ref="inputRef"
            v-model="searchQuery"
            :placeholder="searchQuery ? '搜索路由...' : '输入关键词搜索页面（支持标题、路径）'"
            :prefix-icon="Search"
            clearable
            class="search-input"
            @input="handleSearch"
            @keydown="handleKeydown"
          />
        </div>

        <!-- 搜索结果列表 -->
        <div v-if="searchResults.length > 0" class="search-results">
          <div
            v-for="(result, index) in searchResults"
            :key="`${result.fullPath}-${index}`"
            class="search-item" :class="{
              'is-selected': index === selectedIndex,
            }"
            @click="selectResult(result)"
            @mouseenter="selectedIndex = index"
          >
            <div class="search-item-content">
              <!-- 图标 -->
              <svg-icon
                v-if="result.icon"
                :icon-class="result.icon"
                class="search-item-icon"
              />

              <!-- 标题和路径 -->
              <div class="search-item-info">
                <div class="search-item-title">
                  <span v-html="highlightMatch(result.title, searchQuery)" />
                  <span
                    v-if="result.parentTitles && result.parentTitles.length > 0"
                    class="search-item-parent"
                    v-html="` [${highlightMatch(result.parentTitles.join(' > '), searchQuery)}]`"
                  />
                </div>
                <div
                  class="search-item-path"
                  v-html="highlightMatch(result.fullPath, searchQuery)"
                />
              </div>

              <!-- Enter 提示 -->
              <div v-if="index === selectedIndex" class="search-item-hotkey">
                Enter
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="searchQuery" class="search-empty">
          <svg-icon icon-class="search" class="search-empty-icon" />
          <div class="search-empty-text">
            未找到匹配 "{{ searchQuery }}" 的结果
          </div>
        </div>

        <!-- 最近访问 -->
        <div v-else class="search-empty">
          <svg-icon icon-class="time" class="search-empty-icon" />
          <div class="search-empty-text">
            输入关键词搜索页面
          </div>
          <div class="search-empty-tip">
            提示：使用键盘 ↑↓ 键选择，Enter 键确认，ESC 键关闭
          </div>
        </div>
      </div>
    </ElDialog>
  </Teleport>
</template>

<style lang="scss" scoped>
.search-route-dialog {
  :deep(.el-dialog) {
    border-radius: 8px;
    overflow: hidden;
  }

  :deep(.el-dialog__header) {
    display: none;
  }

  :deep(.el-dialog__body) {
    padding: 0;
  }
}

.search-container {
  display: flex;
  flex-direction: column;
  max-height: 60vh;
  padding: 0;
}

.search-input-wrapper {

  .search-input {
    :deep(.el-input__wrapper) {
      border-radius: 6px;
      box-shadow: 0 0 0 1px var(--el-input-border-color) inset;

      &.is-focus {
        box-shadow: 0 0 0 1px var(--el-color-primary) inset;
      }
    }

    :deep(.el-input__prefix-inner) {
      svg {
        font-size: 16px;
        color: var(--el-text-color-placeholder);
      }
    }

    :deep(input) {
      font-size: 14px;
      height: 40px;
    }
  }
}

.search-results {
  max-height: 48vh;
  overflow-y: auto;
  padding: 8px 0;
}

.search-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover,
  &.is-selected {
    background-color: var(--el-fill-color-light);
    border-radius: 10px;
  }

  &.is-selected {
    background-color: var(--el-fill-color);
  }
}

.search-item-content {
  display: flex;
  align-items: center;
}

.search-item-icon {
  font-size: 20px;
  margin-right: 12px;
  color: var(--el-color-primary);
}

.search-item-info {
  flex: 1;
  min-width: 0;
}

.search-item-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;

  .search-item-parent {
    font-size: 13px;
    color: var(--el-text-color-secondary);
    font-weight: normal;
    margin-left: 8px;

    :deep(.search-highlight) {
      background-color: var(--el-color-primary-light-7);
      color: var(--el-color-primary);
      padding: 2px 4px;
      border-radius: 2px;
    }
  }

  :deep(.search-highlight) {
    background-color: var(--el-color-primary-light-7);
    color: var(--el-color-primary);
    padding: 2px 4px;
    border-radius: 2px;
  }
}

.search-item-path {
  font-size: 12px;
  color: var(--el-text-color-placeholder);
  font-family: monospace;

  :deep(.search-highlight) {
    background-color: var(--el-color-primary-light-9);
    padding: 2px 4px;
    border-radius: 2px;
  }
}

.search-item-hotkey {
  font-size: 12px;
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.search-empty {
  padding: 60px 16px;
  text-align: center;

  .search-empty-icon {
    font-size: 48px;
    color: var(--el-text-color-placeholder);
    margin-bottom: 16px;
    opacity: 0.5;
  }

  .search-empty-text {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    margin-bottom: 8px;
  }

  .search-empty-tip {
    font-size: 12px;
    color: var(--el-text-color-placeholder);
  }
}
</style>

<style lang="scss">
// 全局高亮样式
mark.search-highlight {
  background-color: var(--el-color-primary-light-7);
  color: var(--el-color-primary);
  padding: 2px 4px;
  border-radius: 2px;
  font-weight: 500;
}
</style>
