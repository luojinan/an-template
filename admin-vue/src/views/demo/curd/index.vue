<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { formColumns, tableColumns } from './config/column'
import { mockTableData, sleepFn } from './config/mockdata'
import type { ProTableColumn } from '@/components/ProComponent'
import { ProForm, ProTable } from '@/components/ProComponent'
import TableSelect from '@/components/TableSelect/index.vue'

const tableRef = ref()
const formRef = ref()
const open = ref(false)

// 编辑
async function handleEditClick(row: any) {
  open.value = true
  formRef.value?.setFormData(row)
}

async function onSubmit(data: any) {
  if (data.id) {
    console.log('编辑表单', data)
  }
  else {
    console.log('新增表单', data)
  }
  await sleepFn(3000)
  open.value = false
  ElMessage.success('操作成功')
  tableRef.value?.fetchPageData()
}

const handleAddClick = () => {
  formRef.value?.resetFormData()
  open.value = true
}

// 表格顶部新镇按钮
const toolbar = [
  {
    name: 'add',
    text: '新增',
    type: 'primary',
    onClick: handleAddClick,
  },
]
// 表格项内容
const cols: ProTableColumn<{ id: number, a: string, status: number }>[] = [
  ...tableColumns,
  {
    label: '操作',
    fixed: 'right',
    width: 80,
    valueType: 'tool',
    // 前往类型定义查看非函数类型定义方式
    operat: (row) => {
      console.log('row', row)
      return [{
        name: 'edit',
        text: '编辑',
        onClick: handleEditClick,
      }]
    },
  },
]
async function getList(params: any) {
  console.log('proTable 表格请求参数', params)
  return mockTableData
}
</script>

<template>
  <div class="app-container">
    <ProTable
      ref="tableRef"
      :columns="cols"
      :toolbar="toolbar"
      :request="getList"
    >
      <template #status="scope">
        <el-tag :type="scope.row[scope.prop] == 1 ? 'success' : 'info'">
          {{ scope.row[scope.prop] == 1 ? "启用" : "禁用" }}
        </el-tag>
      </template>
    </ProTable>

    <ProForm
      ref="formRef"
      v-model:open="open"
      type="drawer"
      :drawer-props="{ title: '课程分类信息' }"
      :columns="formColumns"
      :on-submit="onSubmit"
    >
      <template #tableSelect="scope">
        <TableSelect
          v-model:selected-items="scope.formData[scope.prop]"
          :select-config="{
            // width: '600',
          }"
          :text="`${scope.formData[scope.prop]?.[0]?.id}`"
          :request="getList"
          :columns="tableColumns"
        />
      </template>
    </ProForm>
  </div>
</template>
