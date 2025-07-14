<script setup lang="ts">
import { ElPagination, ElScrollbar } from 'element-plus'
import type { Pagination } from '../type'
// 定义接收的属性
defineProps<{
  pagination: Pagination
}>()
// 定义自定义事件
const emit = defineEmits<{
  sizeChange: [number]
  currentChange: [number]
}>()

function handleSizeChange(val) {
  emit('sizeChange', val)
}
function handleCurrentChange(val) {
  emit('currentChange', val)
}
</script>

<template>
  <ElScrollbar>
    <div class="mt-[12px] flex justify-end">
      <ElPagination
        v-bind="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </ElScrollbar>
</template>
