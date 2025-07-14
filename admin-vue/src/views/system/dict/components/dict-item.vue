<!-- 字典数据 -->
<script setup lang="ts">
import { ElButton, ElCard, ElDialog, ElForm, ElFormItem, ElInput, ElInputNumber, ElMessage, ElMessageBox, ElRadio, ElRadioGroup, ElTable, ElTableColumn, ElTag } from 'element-plus'
import DictAPI from '@/api/dict'
import type { DictForm, DictPageVO, DictQuery } from '@/api/dict/model'

defineOptions({
  name: 'DictData',
  inheritAttrs: false,
})

const props = defineProps({
  typeCode: {
    type: String,
    default: () => {
      return ''
    },
  },
  typeName: {
    type: String,
    default: () => {
      return ''
    },
  },
})

watch(
  () => props.typeCode,
  (newVal: string) => {
    queryParams.typeCode = newVal
    formData.typeCode = newVal
    resetQuery()
  },
)

const queryFormRef = ref(ElForm)
const dataFormRef = ref(ElForm)

const loading = ref(false)
const ids = ref<number[]>([])
const total = ref(0)

const queryParams = reactive<DictQuery>({
  pageNum: 1,
  pageSize: 10,
  typeCode: props.typeCode,
})

const dictList = ref<DictPageVO[]>()

const dialog = reactive({
  title: '',
  visible: false,
})

const formData = reactive<DictForm>({
  status: 1,
  typeCode: props.typeCode,
  sort: 1,
})

const rules = reactive({
  name: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
  value: [{ required: true, message: '请输入字典值', trigger: 'blur' }],
})

/** 查询 */
function handleQuery() {
  if (queryParams.typeCode) {
    loading.value = true
    DictAPI.getDictPage(queryParams)
      .then((data) => {
        dictList.value = data.records
        total.value = data.total
      })
      .finally(() => (loading.value = false))
  }
}

/** 重置查询 */
function resetQuery() {
  queryFormRef.value.resetFields()
  queryParams.pageNum = 1
  handleQuery()
}

/**
 * 行checkbox change事件
 *
 * @param selection
 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id)
}

/**
 * 打开字典表单弹窗
 *
 * @param dictId 字典ID
 */
function openDialog(dictId?: number) {
  dialog.visible = true
  if (dictId) {
    dialog.title = '修改字典'
    DictAPI.getDictFormData(dictId).then((data) => {
      Object.assign(formData, data)
    })
  }
  else {
    dialog.title = '新增字典'
  }
}

/** 字典表单提交 */
function handleSubmit() {
  dataFormRef.value.validate((isValid: boolean) => {
    if (isValid) {
      loading.value = false
      const dictId = formData.id
      if (dictId) {
        DictAPI.updateDict(dictId, formData)
          .then(() => {
            ElMessage.success('修改成功')
            closeDialog()
            resetQuery()
          })
          .finally(() => (loading.value = false))
      }
      else {
        DictAPI.addDict(formData)
          .then(() => {
            ElMessage.success('新增成功')
            closeDialog()
            resetQuery()
          })
          .finally(() => (loading.value = false))
      }
    }
  })
}

/** 关闭弹窗 */
function closeDialog() {
  dialog.visible = false
  resetForm()
}

/** 重置表单 */
function resetForm() {
  dataFormRef.value.resetFields()
  dataFormRef.value.clearValidate()

  formData.id = undefined
  formData.status = 1
  formData.sort = 1
  formData.typeCode = props.typeCode
}

/** 删除字典 */
function handleDelete(dictId?: number) {
  const dictIds = [dictId || ids.value].join(',')
  if (!dictIds) {
    ElMessage.warning('请勾选删除项')
    return
  }

  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    DictAPI.deleteDictByIds(dictIds).then(() => {
      ElMessage.success('删除成功')
      resetQuery()
    })
  })
}

onMounted(() => {
  handleQuery()
})
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <!-- 搜索表单 -->
      <ElForm ref="queryFormRef" :model="queryParams" :inline="true">
        <ElFormItem label="关键字" prop="name">
          <ElInput
            v-model="queryParams.name"
            placeholder="字典名称"
            clearable
          />
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" @click="handleQuery">
            <i-ep-search />搜索
          </ElButton>
          <ElButton @click="resetQuery">
            <i-ep-refresh />重置
          </ElButton>
        </ElFormItem>
      </ElForm>
    </div>
    <ElCard shadow="never">
      <template #header>
        <ElButton
          v-hasPerm="['sys:dict:add']"
          type="success"
          @click="openDialog()"
        >
          <i-ep-plus />新增
        </ElButton>
        <ElButton
          v-hasPerm="['sys:dict:delete']"
          type="danger"
          :disabled="ids.length === 0"
          @click="handleDelete()"
        >
          <i-ep-delete />删除
        </ElButton>
      </template>

      <!-- 数据表格 -->
      <ElTable
        v-loading="loading"
        :data="dictList"
        border
        @selection-change="handleSelectionChange"
      >
        <ElTableColumn type="selection" width="50" />
        <ElTableColumn label="字典名称" prop="name" />
        <ElTableColumn label="字典值" prop="value" />
        <ElTableColumn label="状态" align="center">
          <template #default="scope">
            <ElTag v-if="scope.row.status === 1" type="success">
              启用
            </ElTag>
            <ElTag v-else type="info">
              禁用
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn fixed="right" label="操作" align="center">
          <template #default="scope">
            <ElButton
              v-hasPerm="['sys:dict:edit']"
              type="primary"
              link
              @click="openDialog(scope.row.id)"
            >
              <i-ep-edit />编辑
            </ElButton>
            <ElButton
              v-hasPerm="['sys:dict:delete']"
              type="primary"
              link
              @click.stop="handleDelete(scope.row.id)"
            >
              <i-ep-delete />删除
            </ElButton>
          </template>
        </ElTableColumn>
      </ElTable>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery"
      />
    </ElCard>

    <!-- 表单弹窗 -->
    <ElDialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="closeDialog"
    >
      <ElForm
        ref="dataFormRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <ElFormItem label="字典名称">
          {{ typeName }}
        </ElFormItem>
        <ElFormItem label="字典名称" prop="name">
          <ElInput v-model="formData.name" placeholder="请输入字典名称" />
        </ElFormItem>
        <ElFormItem label="字典值" prop="value">
          <ElInput v-model="formData.value" placeholder="字典值" />
        </ElFormItem>
        <ElFormItem label="排序" prop="sort">
          <ElInputNumber
            v-model="formData.sort"
            controls-position="right"
            :min="0"
          />
        </ElFormItem>
        <ElFormItem label="状态" prop="status">
          <ElRadioGroup v-model="formData.status">
            <ElRadio :label="1">
              正常
            </ElRadio>
            <ElRadio :label="0">
              停用
            </ElRadio>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem label="备注" prop="remark">
          <ElInput v-model="formData.remark" type="textarea" />
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
