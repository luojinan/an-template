<script setup lang="ts">
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
  <el-scrollbar>
    <div class="mt-[12px] flex justify-end">
      <el-pagination
        v-bind="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-scrollbar>
</template>
