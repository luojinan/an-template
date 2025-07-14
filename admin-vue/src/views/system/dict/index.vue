<!-- 字典类型 -->

<script setup lang="ts">
import { ElButton, ElCard, ElDialog, ElForm, ElFormItem, ElInput, ElMessage, ElMessageBox, ElRadio, ElRadioGroup, ElTable, ElTableColumn, ElTag } from 'element-plus'
import DictAPI from '@/api/dict'
import type { DictTypeForm, DictTypePageVO, DictTypeQuery } from '@/api/dict/model'

defineOptions({
  name: 'DictType',
  inheritAttrs: false,
})

const queryFormRef = ref(ElForm)
const dataFormRef = ref(ElForm)

const loading = ref(false)
const ids = ref<number[]>([])
const total = ref(0)

const queryParams = reactive<DictTypeQuery>({
  pageNum: 1,
  pageSize: 10,
})

const dictTypeList = ref<DictTypePageVO[]>()

const dialog = reactive({
  title: '',
  visible: false,
})

const formData = reactive<DictTypeForm>({
  status: 1,
})

const rules = reactive({
  name: [{ required: true, message: '请输入字典类型名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入字典类型编码', trigger: 'blur' }],
})

/** 查询 */
function handleQuery() {
  loading.value = true
  DictAPI.getDictTypePage(queryParams)
    .then((data) => {
      dictTypeList.value = data.records
      total.value = data.total
    })
    .finally(() => {
      loading.value = false
    })
}

/**
 * 重置查询
 */
function resetQuery() {
  queryFormRef.value.resetFields()
  queryParams.pageNum = 1
  handleQuery()
}

/** 行复选框选中  */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id)
}

/**
 * 打开字典类型表单弹窗
 *
 * @param dicTypeId 字典类型ID
 */
function openDialog(dicTypeId?: number) {
  dialog.visible = true
  if (dicTypeId) {
    dialog.title = '修改字典类型'
    DictAPI.getDictTypeForm(dicTypeId).then((data) => {
      Object.assign(formData, data)
    })
  }
  else {
    dialog.title = '新增字典类型'
  }
}

/** 字典类型表单提交 */
function handleSubmit() {
  dataFormRef.value.validate((isValid: boolean) => {
    if (isValid) {
      loading.value = false
      const dictTypeId = formData.id
      if (dictTypeId) {
        DictAPI.updateDictType(dictTypeId, formData)
          .then(() => {
            ElMessage.success('修改成功')
            closeDialog()
            handleQuery()
          })
          .finally(() => (loading.value = false))
      }
      else {
        DictAPI.addDictType(formData)
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

/** 关闭字典类型弹窗 */
function closeDialog() {
  dialog.visible = false
  resetForm()
}

/**  重置字典类型表单 */
function resetForm() {
  dataFormRef.value.resetFields()
  dataFormRef.value.clearValidate()

  formData.id = undefined
  formData.status = 1
}

/** 删除字典类型 */
function handleDelete(dictTypeId?: number) {
  const dictTypeIds = [dictTypeId || ids.value].join(',')
  if (!dictTypeIds) {
    ElMessage.warning('请勾选删除项')
    return
  }

  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    DictAPI.deleteDictTypes(dictTypeIds).then(() => {
      ElMessage.success('删除成功')
      resetQuery()
    })
  })
}

const dictDataDialog = reactive({
  title: '',
  visible: false,
})

const selectedDictType = reactive({ typeCode: '', typeName: '' }) // 当前选中的字典类型

/** 打开字典数据弹窗 */
function openDictDialog(row: DictTypePageVO) {
  dictDataDialog.visible = true
  dictDataDialog.title = `【${row.name}】字典数据`

  selectedDictType.typeCode = row.code
  selectedDictType.typeName = row.name
}

/**  关闭字典数据弹窗 */
function closeDictDialog() {
  dictDataDialog.visible = false
}

onMounted(() => {
  handleQuery()
})
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <ElForm ref="queryFormRef" :model="queryParams" :inline="true">
        <ElFormItem label="关键字" prop="name">
          <ElInput
            v-model="queryParams.keywords"
            placeholder="字典类型名称/编码"
            clearable
            @keyup.enter="handleQuery"
          />
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" @click="handleQuery()">
            <i-ep-search />搜索
          </ElButton>
          <ElButton @click="resetQuery()">
            <i-ep-refresh />重置
          </ElButton>
        </ElFormItem>
      </ElForm>
    </div>

    <ElCard shadow="never" class="table-container">
      <template #header>
        <ElButton
          v-hasPerm="['sys:dict_type:add']"
          type="success"
          @click="openDialog()"
        >
          <i-ep-plus />新增
        </ElButton>
        <ElButton
          type="danger"
          :disabled="ids.length === 0"
          @click="handleDelete()"
        >
          <i-ep-delete />删除
        </ElButton>
      </template>
      <ElTable
        v-loading="loading"
        highlight-current-row
        :data="dictTypeList"
        border
        @selection-change="handleSelectionChange"
      >
        <ElTableColumn type="selection" width="55" align="center" />
        <ElTableColumn label="字典类型名称" prop="name" width="200" />
        <ElTableColumn label="字典类型编码" prop="code" width="200" />
        <ElTableColumn label="状态" align="center" width="100">
          <template #default="scope">
            <ElTag v-if="scope.row.status === 1" type="success">
              启用
            </ElTag>
            <ElTag v-else type="info">
              禁用
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn label="备注" prop="remark" align="center" />
        <ElTableColumn fixed="right" label="操作" align="center" width="220">
          <template #default="scope">
            <ElButton
              type="primary"
              link
              size="small"
              @click.stop="openDictDialog(scope.row)"
            >
              <i-ep-Collection />字典数据
            </ElButton>
            <ElButton
              v-hasPerm="['sys:dict_type:edit']"
              type="primary"
              link
              size="small"
              @click.stop="openDialog(scope.row.id)"
            >
              <i-ep-edit />编辑
            </ElButton>
            <ElButton
              v-hasPerm="['sys:dict_type:delete']"
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

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery"
      />
    </ElCard>

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
        label-width="80px"
      >
        <ElFormItem label="字典名称" prop="name">
          <ElInput v-model="formData.name" placeholder="请输入字典名称" />
        </ElFormItem>
        <ElFormItem label="字典编码" prop="code">
          <ElInput v-model="formData.code" placeholder="请输入字典编码" />
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
          <ElInput
            v-model="formData.remark"
            type="textarea"
            placeholder="字典类型备注"
            :autosize="{ minRows: 2, maxRows: 4 }"
          />
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

    <!-- 字典数据弹窗 -->
    <ElDialog
      v-model="dictDataDialog.visible"
      :title="dictDataDialog.title"
      width="1000px"
      @close="closeDictDialog"
    >
      <dict-item
        v-model:type-code="selectedDictType.typeCode"
        v-model:type-name="selectedDictType.typeName"
      />
    </ElDialog>
  </div>
</template>
