<script setup lang="ts">
import { ElButton, ElCheckbox, ElPopover, ElScrollbar } from 'element-plus'
import type { ProTableColumn, ToolbarBtn } from '../type'
import { useUserStore } from '@/store'

// 定义接收的属性
const props = defineProps<{
  toolbar?: string[] | ToolbarBtn[]
  defaultToolbar: string[]
  title?: string
}>()

// 定义自定义事件
const emit = defineEmits<{
  handleToolbar: [string]
}>()

const userStore = useUserStore()

const columns = defineModel<ProTableColumn>('columns')

function handleToolbar(item) {
  if (typeof item === 'object') {
    if (item.onClick) { item.onClick() }

    emit('handleToolbar', item.name)
  }
  else {
    emit('handleToolbar', item)
  }
}

const authsToolbar = computed(() => {
  if (props.toolbar && props.toolbar.length > 0) {
    return props.toolbar.filter(item => userStore.hasPerms(item.auths || []))
  }
  return []
})
</script>

<template>
  <!-- 表格工具栏 -->
  <div class="flex-x-between mb-[10px]">
    <!-- 左侧工具栏 -->
    <div>
      <span v-if="title">{{ title }}</span>
      <template v-for="item in authsToolbar" :key="item">
        <template v-if="typeof item === 'string'">
          <!-- 新增 -->
          <template v-if="item === 'add'">
            <ElButton
              type="success"
              icon="plus"
              @click="handleToolbar(item)"
            >
              新增
            </ElButton>
          </template>
          <!-- 删除 -->
          <template v-else-if="item === 'delete'">
            <ElButton
              type="danger"
              icon="delete"
              @click="handleToolbar(item)"
            >
              删除
            </ElButton>
          </template>
          <!-- 导出 -->
          <template v-else-if="item === 'export'">
            <ElButton
              type="primary"
              icon="download"
              @click="handleToolbar(item)"
            >
              导出
            </ElButton>
          </template>
        </template>
        <!-- 其他 -->
        <template v-else-if="typeof item === 'object'">
          <ElButton
            :icon="item.icon"
            :type="item.type ?? 'default'"
            @click="handleToolbar(item)"
          >
            {{ item.text }}
          </ElButton>
        </template>
      </template>
    </div>
    <!-- 右侧工具栏 -->
    <div>
      <template v-for="item in defaultToolbar" :key="item">
        <template v-if="typeof item === 'string'">
          <!-- 刷新 -->
          <template v-if="item === 'refresh'">
            <ElButton
              icon="refresh"
              link
              title="刷新"
              @click="handleToolbar(item)"
            />
          </template>
          <!-- 筛选列 -->
          <template v-else-if="item === 'filter'">
            <ElPopover placement="bottom" trigger="click">
              <template #reference>
                <ElButton icon="Operation" link title="筛选列" />
              </template>
              <ElScrollbar max-height="350px">
                <template v-for="col in columns" :key="col">
                  <ElCheckbox
                    v-if="col.prop"
                    v-model="col.show"
                    :label="col.label"
                  />
                </template>
              </ElScrollbar>
            </ElPopover>
          </template>
        </template>
        <!-- 其他 -->
        <template v-else-if="typeof item === 'object'">
          <ElButton
            :icon="item.icon"
            link
            :title="item.title"
            @click="handleToolbar(item)"
          />
        </template>
      </template>
    </div>
  </div>
</template>
