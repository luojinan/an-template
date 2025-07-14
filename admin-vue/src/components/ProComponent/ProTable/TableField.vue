<script setup lang="ts">
import { computed } from 'vue'
import { ElTableColumn } from 'element-plus'
import { componentMap } from './components'

const { col = {}, tableProps = {} } = defineProps<{
  col: any
  tableProps?: any
}>()

const emit = defineEmits<{
  handleOperat: [params: any]
}>()

// 根据valueType确定要渲染的组件
const componentToRender = computed(() => {
  const valueType = col.valueType

  // 如果没有valueType，默认为input
  if (!valueType) {
    return componentMap.input
  }

  // 如果是已知的组件类型，直接返回
  if (valueType in componentMap) {
    return componentMap[valueType as keyof typeof componentMap]
  }

  // 默认返回input组件
  return componentMap.input
})
</script>

<template>
  <ElTableColumn v-bind="col">
    <template #default="scope">
      <template v-if="!col.formatFn && !['custom', 'tool'].includes(col.valueType) && !scope.row[col.prop] && typeof scope.row[col.prop] !== 'number'">
        {{ tableProps?.emptyText ?? '-' }}
      </template>
      <component
        :is="componentToRender"
        v-else
        :col="col"
        :scope="scope"
        :table-props="tableProps"
        @handle-operat="emit('handleOperat', $event)"
      />
    </template>
  </ElTableColumn>
</template>
