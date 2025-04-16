<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { formColumns, tableColumns } from './config/column'
import type { ProTableColumn } from '@/components/ProComponent'
import { ProTable } from '@/components/ProComponent'
import TableSelect from '@/components/TableSelect/index.vue'

const tableRef = ref()
const formRef = ref()
const open = ref(false)
const editId = ref()

// 编辑
async function handleEditClick(row: any) {
  open.value = true
  formRef.value?.setFormData({
    startDate: '2024-01-01',
    endDate: '2024-03-01',
    status: 0,
    a: '1',
    name: '1',
    c: 1,
    input1: '123',
    input2: '321',
    b: ['https://dsjedu.oss-cn-shanghai.aliyuncs.com/VmqqQikun.webp'],
  })
  editId.value = row.id
}

function handleOff(data: any) {
  console.log(data)
  ElMessageBox.confirm(
    '确认下架吗？',
    '下架',
    { type: 'warning' },
  ).then(() => {
    ElMessage.success('下架成功')
  })
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
async function onSubmit(data: any) {
  await sleep(5000)
  if (editId.value) { console.log('提交表单', { id: editId.value, ...data }) }
  else { console.log('提交表单', data) }

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
    type: 'success',
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
    operat: (row) => {
      // console.log('操作列渲染条件语句', row)
      return row.id === 1
        ? [{
            name: 'offline',
            text: '下架',
            onClick: handleOff,
          }]
        : [{
            name: 'edit',
            text: '编辑',
            onClick: handleEditClick,
          }]
    },
    // operat: [
    //   {
    //     name: 'offline',
    //     text: '下架',
    //     onClick: handleOff,
    //   },
    //   {
    //     name: 'edit',
    //     text: '编辑',
    //     onClick: handleEditClick,
    //   },
    // ],
  },
]
async function getList(params: any) {
  console.log(params)
  return {
    total: 2,
    list: [
      {
        id: 1,
        a: '1',
        status: 1,
      },
      {
        id: 2,
        a: '2',
        status: 1,
      },
    ],
  }
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
          v-model:selectedItems="scope.formData[scope.prop]"
          :select-config="{
            // width: '600',
          }"
          :text="`${scope.formData[scope.prop]?.[0]?.id}`"
          :request="getList"
          :columns="tableColumns"
        />
      </template>
      <template #myslota="scope">
        <el-rate v-model="scope.formData[scope.prop]" />
      </template>
    </ProForm>
  </div>
</template>
