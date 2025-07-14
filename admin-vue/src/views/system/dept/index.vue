<script setup lang="ts">
import { ElButton, ElCard, ElDialog, ElForm, ElFormItem, ElInput, ElInputNumber, ElMessage, ElMessageBox, ElOption, ElRadio, ElRadioGroup, ElSelect, ElTable, ElTableColumn, ElTag, ElTreeSelect } from 'element-plus'
import DeptAPI from '@/api/dept'
import type { DeptForm, DeptQuery, DeptVO } from '@/api/dept/model'

defineOptions({
  name: 'Dept',
  inheritAttrs: false,
})

const queryFormRef = ref(ElForm)
const deptFormRef = ref(ElForm)

const loading = ref(false)
const ids = ref<number[]>([])
const dialog = reactive({
  title: '',
  visible: false,
})

const queryParams = reactive<DeptQuery>({})
const deptList = ref<DeptVO[]>()

const deptOptions = ref<OptionType[]>()

const formData = reactive<DeptForm>({
  status: 1,
  parentId: 0,
  sort: 1,
})

const rules = reactive({
  parentId: [{ required: true, message: '上级部门不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
  sort: [{ required: true, message: '显示排序不能为空', trigger: 'blur' }],
})

/** 查询 */
function handleQuery() {
  loading.value = true
  DeptAPI.getList(queryParams).then((data) => {
    deptList.value = data
    loading.value = false
  })
}

/** 重置查询 */
function resetQuery() {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id)
}

/** 获取部门下拉数据  */
async function loadDeptOptions() {
  DeptAPI.getOptions().then((data) => {
    deptOptions.value = [
      {
        value: 0,
        label: '顶级部门',
        children: data,
      },
    ]
  })
}

/**
 * 打开弹窗
 *
 * @param parentId 父部门ID
 * @param deptId 部门ID
 */
async function openDialog(parentId?: number, deptId?: number) {
  await loadDeptOptions()
  dialog.visible = true
  if (deptId) {
    dialog.title = '修改部门'
    DeptAPI.getFormData(deptId).then((data) => {
      Object.assign(formData, data)
    })
  }
  else {
    dialog.title = '新增部门'
    formData.parentId = parentId ?? 0
  }
}

/** 表单提交 */
function handleSubmit() {
  deptFormRef.value.validate((valid: any) => {
    if (valid) {
      const deptId = formData.id
      loading.value = true
      if (deptId) {
        DeptAPI.update(deptId, formData)
          .then(() => {
            ElMessage.success('修改成功')
            closeDialog()
            handleQuery()
          })
          .finally(() => (loading.value = false))
      }
      else {
        DeptAPI.add(formData)
          .then(() => {
            ElMessage.success('新增成功')
            closeDialog()
            handleQuery()
          })
          .finally(() => (loading.value = false))
      }
    }
  })
}

/** 删除部门 */
function handleDelete(deptId?: number) {
  const deptIds = [deptId || ids.value].join(',')

  if (!deptIds) {
    ElMessage.warning('请勾选删除项')
    return
  }

  ElMessageBox.confirm(`确认删除已选中的数据项?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    DeptAPI.deleteByIds(deptIds).then(() => {
      ElMessage.success('删除成功')
      resetQuery()
    })
  })
}

/** 关闭弹窗 */
function closeDialog() {
  dialog.visible = false
  resetForm()
}

/** 重置表单  */
function resetForm() {
  deptFormRef.value.resetFields()
  deptFormRef.value.clearValidate()

  formData.id = undefined
  formData.parentId = 0
  formData.status = 1
  formData.sort = 1
}

onMounted(() => {
  handleQuery()
})
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <ElForm ref="queryFormRef" :model="queryParams" :inline="true">
        <ElFormItem label="关键字" prop="keywords">
          <ElInput
            v-model="queryParams.keywords"
            placeholder="部门名称"
            @keyup.enter="handleQuery"
          />
        </ElFormItem>

        <ElFormItem label="部门状态" prop="status">
          <ElSelect
            v-model="queryParams.status"
            placeholder="全部"
            clearable
            class="!w-[100px]"
          >
            <ElOption :value="1" label="正常" />
            <ElOption :value="0" label="禁用" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem>
          <ElButton class="filter-item" type="primary" @click="handleQuery">
            <i-ep-search />
            搜索
          </ElButton>
          <ElButton @click="resetQuery">
            <i-ep-refresh />重置
          </ElButton>
        </ElFormItem>
      </ElForm>
    </div>

    <ElCard shadow="never" class="table-container">
      <template #header>
        <ElButton
          v-hasPerm="['sys:dept:add']"
          type="success"
          @click="openDialog(0, undefined)"
        >
          <i-ep-plus />新增
        </ElButton>
        <ElButton
          v-hasPerm="['sys:dept:delete']"
          type="danger"
          :disabled="ids.length === 0"
          @click="handleDelete()"
        >
          <i-ep-delete />删除
        </ElButton>
      </template>

      <ElTable
        v-loading="loading"
        :data="deptList"
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
      >
        <ElTableColumn type="selection" width="55" align="center" />
        <ElTableColumn prop="name" label="部门名称" min-width="200" />
        <ElTableColumn prop="status" label="状态" width="100">
          <template #default="scope">
            <ElTag v-if="scope.row.status == 1" type="success">
              正常
            </ElTag>
            <ElTag v-else type="info">
              禁用
            </ElTag>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="sort" label="排序" width="100" />

        <ElTableColumn label="操作" fixed="right" align="left" width="200">
          <template #default="scope">
            <ElButton
              v-hasPerm="['sys:dept:add']"
              type="primary"
              link
              size="small"
              @click.stop="openDialog(scope.row.id, undefined)"
            >
              <i-ep-plus />新增
            </ElButton>
            <ElButton
              v-hasPerm="['sys:dept:edit']"
              type="primary"
              link
              size="small"
              @click.stop="openDialog(scope.row.parentId, scope.row.id)"
            >
              <i-ep-edit />编辑
            </ElButton>
            <ElButton
              v-hasPerm="['sys:dept:delete']"
              type="primary"
              link
              size="small"
              @click.stop="handleDelete(scope.row.id)"
            >
              <i-ep-delete />删除
            </ElButton>
          </template>
        </ElTableColumn>
      </ElTable>
    </ElCard>

    <ElDialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="600px"
      @closed="closeDialog"
    >
      <ElForm
        ref="deptFormRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <ElFormItem label="上级部门" prop="parentId">
          <ElTreeSelect
            v-model="formData.parentId"
            placeholder="选择上级部门"
            :data="deptOptions"
            filterable
            check-strictly
            :render-after-expand="false"
          />
        </ElFormItem>
        <ElFormItem label="部门名称" prop="name">
          <ElInput v-model="formData.name" placeholder="请输入部门名称" />
        </ElFormItem>
        <ElFormItem label="显示排序" prop="sort">
          <ElInputNumber
            v-model="formData.sort"
            controls-position="right"
            style="width: 100px"
            :min="0"
          />
        </ElFormItem>
        <ElFormItem label="部门状态">
          <ElRadioGroup v-model="formData.status">
            <ElRadio :label="1">
              正常
            </ElRadio>
            <ElRadio :label="0">
              禁用
            </ElRadio>
          </ElRadioGroup>
        </ElFormItem>
      </ElForm>

      <template #footer>
        <div class="dialog-footer">
          <ElButton type="primary" @click="handleSubmit">
            确 定
          </ElButton>
          <ElButton @click="closeDialog">
            取 消
          </ElButton>
        </div>
      </template>
    </ElDialog>
  </div>
</template>
