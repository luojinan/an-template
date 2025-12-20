<script setup lang="ts" generic="T, R extends IObject">
// 泛型T 为列表request的结果Item类型
// 泛型R 为columns配置项显式定义的Item类型 - 在template 中编写时会自动推断为T，当在ts中编写则需要显式定义
// ✨最佳实践：鼠标悬浮查看templace中<ProTable>的columns属性，显示内部推断的Item类型，复制到ts中显式定义按要求使用类型
import { reactive, ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { ElButton, ElCard, ElMessage, ElMessageBox, ElTable, ElTableColumn } from 'element-plus'
import type { IObject, ProTableColumn, ToolOperatBtn } from '../type'
import ProToolBar from './ProToolBar.vue'
import ProPagination from './ProPagination.vue'
import { ProForm } from '@/components/ProComponent'

defineOptions({
  name: 'ProTable',
})

// ProTable 组件接收的参数
const props = defineProps<{
  request: (params: any) => Promise<{ records: T[], total: number }>
  columns: ProTableColumn<R extends T ? R : T>[]
  rowKey?: string
  title?: string
  selection?: boolean
  tableProps?: any
  toolbar?: ToolOperatBtn<T>[]
  pagination?: any
  // pagination?: false | { pageSize: number, disabled: boolean }
  search?: any // TODO: vue3.5编译在any时产生的值会是true，而当指定boolean类型时，编译产生的值才会是false-符合直觉，问题容易出现在写any的prop类型
  shadow?: 'hover' | 'always' | 'never'
}>()
// 定义自定义事件
const emit = defineEmits<{
  addClick: []
  exportClick: []
  searchClick: []
  toolbarClick: [name: string]
  editClick: [row: IObject]
  deleteAction: [ids: string]
  operatClick: [data: IObject]
  filterChange: [data: IObject]
  selectionChange: [list: any[]]
}>()

/** ************************************* 设置配置默认值 */
// 主键
const rowKey = props.rowKey ?? 'id'
// 表格左侧工具栏
const toolbar = props.toolbar ?? []
// 表格右侧工具栏
const defaultToolbar = [
  'refresh',
  'filter',
]
// 加载状态
const loading = ref(false)
// 列表数据
const pageData = ref<T[]>([])
// 显示分页
const showPagination = props.pagination !== false
// 分页配置
const defalutPagination = {
  background: true,
  layout: 'total, sizes, prev, pager, next, jumper',
  pageSize: 20,
  pageSizes: [10, 20, 30, 50],
  total: 0,
  currentPage: 1,
}
const pagination = reactive(
  typeof props.pagination === 'object'
    ? { ...defalutPagination, ...props.pagination }
    : defalutPagination,
)
// 表格列 + 搜索栏
const initialCols = cloneDeep(props.columns).filter(item => !item.hideInTable).map((col) => {
  col.align = 'center'

  // 设置默认 show 参数
  if (col.show === undefined) { col.show = true }

  // 设置默认 columnKey 参数
  if (
    col.prop !== undefined
    && col.columnKey === undefined
    && col['column-key'] === undefined
  ) { col.columnKey = col.prop }

  // 折叠操作按钮 全部折叠
  if (col.valueType === 'tool' && col.operat) { col.operat = [{ dropdownBtns: col.operat }] }

  return col
})
const cols = ref(initialCols)
cols.value.forEach((col) => {
  col.initFn && col.initFn(col)
})

const searchCols = computed(() => {
  const list = cloneDeep(props.columns).filter((item) => {
    if (item.hideInSearch) { return false }
    if (item.valueType === 'tool') { return false }
    return true
  })
  list.push({
    prop: 'custom',
    valueType: 'custom',
    slotName: 'searchBtn',
  })
  return list
})
const searchFormRef = ref()
// 从表单中取值后调查询
async function handleQuery() {
  const { custom, ...res } = await searchFormRef.value.getFormData()
  console.log('搜索参数', res)
  fetchPageData(res)
}
// 重置表单数据后调查询
function handleReset() {
  searchFormRef.value.resetFormData()
  fetchPageData({})
}

// 删除
function handleDelete(id?: number | string, onClick?: (ids: string) => void) {
  const ids = id
  if (!ids) {
    ElMessage.warning('请勾选删除项')
    return
  }

  ElMessageBox.confirm('确认删除?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    emit('deleteAction', ids)
    await onClick?.(ids)
  })
}
// 操作栏
function handleToolbar(name: string) {
  const actions = new Map([
    ['refresh', () => fetchPageData()],
    ['search', () => emit('searchClick')],
    ['add', () => emit('addClick')],
    ['delete', handleDelete],
    ['export', () => emit('exportClick')],
  ])

  const action = actions.get(name)
  if (action) { action() }
  else { emit('toolbarClick', name) }
}

// 操作列
function handleOperat(data: IObject) {
  const actions = new Map<string, (data: IObject) => void>([
    ['edit', data => emit('editClick', data.row)],
    ['delete', data => handleDelete(data.row[rowKey], data.onClick)],
  ])

  const action = actions.get(data.name)
  if (action) {
    action(data)
    data.name !== 'delete' && data?.onClick?.(data.row)
  }
  else {
    emit('operatClick', data)
    data?.onClick?.(data.row)
  }
}

// 分页切换
function handleSizeChange(value: number) {
  pagination.pageSize = value
  fetchPageData(lastFormData)
}
function handleCurrentChange(value: number) {
  pagination.currentPage = value
  fetchPageData(lastFormData)
}

// 远程数据筛选
let filterParams: IObject = {}
function handleFilterChange(newFilters: any) {
  const filters: IObject = {}
  for (const key in newFilters) {
    const col = cols.value.find((col) => {
      return col.columnKey === key || col['column-key'] === key
    })
    if (col && col.filterJoin !== undefined) { filters[key] = newFilters[key].join(col.filterJoin) }

    else { filters[key] = newFilters[key] }
  }
  filterParams = { ...filterParams, ...filters }
  emit('filterChange', filterParams)
}

// 获取分页数据
let lastFormData = {}
async function fetchPageData(formData?: IObject, isRestart = false) {
  loading.value = true
  // 重置页码
  if (isRestart) { pagination.currentPage = 1 }

  const params
      = showPagination
        ? {
            pageNum: pagination.currentPage,
            pageSize: pagination.pageSize,
            ...formData || lastFormData,
          }
        : { ...formData || lastFormData }
  try {
    const data = await props.request(params)

    // 上一次搜索条件
    formData && (lastFormData = formData)

    pagination.total = data.total
    pageData.value = data.records
  }
  catch (error) {}
  loading.value = false
}
fetchPageData()

// 获取筛选属性 不取分页参数
async function getFilterParams() {
  const { custom, ...res } = await searchFormRef.value.getFormData()
  return res
}

function handleSelectionChange(list: any[]) {
  emit('selectionChange', list)
}

const proTableCoreRef = ref()
function clearSelect() {
  proTableCoreRef.value?.clearSelection()
}

// 暴露的属性和方法
defineExpose({ fetchPageData, getFilterParams, clearSelect, proTableCoreRef })
</script>

<template>
  <ElCard
    v-if="search !== false"
    :shadow="props.shadow"
    class="mb-[10px]"
    style="

--el-card-border-radius: 8px"
  >
    <ProForm
      ref="searchFormRef"
      :columns="searchCols"
      :form-props="{
        inline: true,
      }"
    >
      <template #searchBtn>
        <div class="flex justify-end">
          <ElButton type="primary" icon="search" @click="handleQuery">
            搜索
          </ElButton>
          <ElButton icon="refresh" @click="handleReset">
            重置
          </ElButton>
        </div>
      </template>
    </ProForm>
  </ElCard>
  <ElCard
    :shadow="props.shadow"
    class="protable"
    style="

--el-card-border-radius: 8px"
  >
    <!-- 表格顶部 左侧+右侧按钮区域 -->
    <ProToolBar
      v-model:columns="cols"
      :toolbar="toolbar"
      :title="title"
      :default-toolbar="defaultToolbar"
      @handle-toolbar="handleToolbar"
    />

    <!-- 表格 -->
    <ElTable
      v-bind="tableProps"
      ref="proTableCoreRef"
      v-loading="loading"
      :data="pageData"
      :row-key="rowKey"
      @selection-change="handleSelectionChange"
      @filter-change="handleFilterChange"
    >
      <ElTableColumn v-if="selection" type="selection" width="55" />
      <template v-for="col in cols" :key="col">
        <TableField v-if="col.valueType !== 'custom'" :col="col" :table-props="tableProps" @handle-operat="handleOperat" />
        <!-- 自定义 插槽跨层级传递不好实现 -->
        <ElTableColumn v-else v-bind="col">
          <template #default="scope">
            <slot
              :name="col.slotName ?? col.prop"
              :prop="col.prop"
              v-bind="scope"
              :attrs="col.attrs"
            />
          </template>
        </ElTableColumn>
      </template>
    </ElTable>

    <!-- 分页 -->
    <ProPagination
      v-if="showPagination"
      :pagination="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </ElCard>
</template>

<style lang="css">
.protable .el-popper {
  max-width: 400px;
}
</style>
