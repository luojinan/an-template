<script setup lang="ts">
import { ElPagination, ElScrollbar } from 'element-plus'

const props = defineProps({
  total: {
    required: true,
    type: Number as PropType<number>,
    default: 0,
  },
  page: {
    type: Number,
    default: 1,
  },
  limit: {
    type: Number,
    default: 20,
  },
  pageSizes: {
    type: Array as PropType<number[]>,
    default() {
      return [10, 20, 30, 50]
    },
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper',
  },
  background: {
    type: Boolean,
    default: true,
  },
  autoScroll: {
    type: Boolean,
    default: true,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['pagination', 'update:page', 'update:limit'])

const currentPage = useVModel(props, 'page', emit)

const pageSize = useVModel(props, 'limit', emit)

function handleSizeChange(val: number) {
  emit('pagination', { page: currentPage, limit: val })
}

function handleCurrentChange(val: number) {
  currentPage.value = val
  emit('pagination', { page: val, limit: props.limit })
}
</script>

<template>
  <ElScrollbar>
    <div :class="{ hidden }" class="pagination">
      <ElPagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :background="background"
        :layout="layout"
        :page-sizes="pageSizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </ElScrollbar>
</template>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: end;
  padding: 12px;

  &.hidden {
    display: none;
  }
}
</style>
