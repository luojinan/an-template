<script setup lang="ts">
import { formColumns, tableColumns } from './config/column'
import EditDialog from './components/EditDialog.vue'
import DetailDialog from './components/DetailDialog.vue'
import agreementAPI from '@/api/agreement'
import type { ProTableColumn } from '@/components/ProComponent'

// 表格顶部新镇按钮
const toolbar = [
  {
    name: 'add',
    text: '新增',
    type: 'success',
    onClick: handleAddClick,
  },
]
const cols: ProTableColumn[] = [
  ...tableColumns,
  {
    label: '操作',
    fixed: 'right',
    width: 80,
    valueType: 'tool',
    operat: [
      {
        name: 'edit',
        text: '编辑',
        onClick: handleEditClick,
      },
      {
        name: 'delete',
        text: '删除',
      },
    ],
  },
]
const editModalRef = ref()
const tableRef = ref()
function getList(params) {
  return agreementAPI.getList(params)
}
function handleEditClick(obj) {
  editModalRef.value?.open(obj)
}
function reGetList() {
  tableRef.value?.fetchPageData()
}
function deleteItem(ids: string) {
  agreementAPI.deleteByIds(ids).then(() => {
    ElMessage.success('删除成功')
    reGetList()
  })
}
// 表单弹窗
function handleAddClick() {
  editModalRef.value?.open()
}
</script>

<template>
  <div class="app-container">
    <ProTable
      ref="tableRef"
      :columns="cols"
      :toolbar="toolbar"
      :request="getList"
      @delete-action="deleteItem"
      :search="false"
    />
    <!-- 新增 -->
    <EditDialog
      ref="editModalRef"
      @select-list="reGetList"
    />
    <!-- <DetailDialog
      ref="detailModalRef"
    /> -->
  </div>
</template>
