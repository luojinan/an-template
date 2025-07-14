<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElButton, ElCard, ElDialog, ElForm, ElFormItem, ElInput, ElInputNumber, ElMessage, ElMessageBox, ElOption, ElRadio, ElRadioGroup, ElScrollbar, ElSelect, ElTable, ElTableColumn, ElTag, ElTree } from 'element-plus'
import { getApiV1MenusOptions, getApiV1RolesByroleidForm, getApiV1RolesByroleidMenuids, getApiV1RolesPage, postApiV1Roles, putApiV1RolesByid, putApiV1RolesByroleidMenus } from '@/utils/proApi/system'

import type { RoleForm } from '@/utils/proApi/types/systemTypes'
import request from '@/utils/request'

interface OptionType {
  label: string
  value: number
  children?: OptionType[]
}

defineOptions({
  name: 'Role',
  inheritAttrs: false,
})

const queryFormRef = ref(ElForm)
const roleFormRef = ref(ElForm)
const menuRef = ref(ElTree)

const loading = ref(false)
const ids = ref<number[]>([])
const total = ref(0)

const queryParams = reactive({
  pageNum: '1',
  pageSize: '10',
  keywords: '',
})

const roleList = ref<RoleForm[]>([])

const dialog = reactive({
  title: '',
  visible: false,
})

const formData = reactive<Partial<RoleForm>>({
  sort: 1,
  status: 1,
  code: '',
  name: '',
})

const rules = reactive({
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
  dataScope: [{ required: true, message: '请选择数据权限', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
})

const menuDialogVisible = ref(false)

const menuList = ref<OptionType[]>([])

interface CheckedRole {
  id?: number
  name?: string
}
let checkedRole: CheckedRole = reactive({})

/** 查询 */
function handleQuery() {
  loading.value = true
  getApiV1RolesPage(queryParams)
    .then((data) => {
      roleList.value = data.records || []
      total.value = data.total || 0
    })
    .finally(() => {
      loading.value = false
    })
}
/** 重置查询 */
function resetQuery() {
  queryFormRef.value.resetFields()
  queryParams.pageNum = '1'
  handleQuery()
}

/** 行checkbox 选中事件 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id)
}

/** 打开角色表单弹窗 */
function openDialog(roleId?: number) {
  dialog.visible = true
  if (roleId) {
    dialog.title = '修改角色'
    getApiV1RolesByroleidForm({ roleId })
      .then((data) => {
        Object.assign(formData, data)
      })
  }
  else {
    dialog.title = '新增角色'
  }
}

/** 角色保存提交 */
function handleSubmit() {
  roleFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true
      const roleId = formData.id
      if (roleId) {
        // 修复这里的API调用，需要传入正确的参数
        putApiV1RolesByid(formData as RoleForm)
          .then(() => {
            ElMessage.success('修改成功')
            closeDialog()
            resetQuery()
          })
          .finally(() => (loading.value = false))
      }
      else {
        postApiV1Roles(formData as RoleForm)
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

/** 关闭表单弹窗 */
function closeDialog() {
  dialog.visible = false
  resetForm()
}

/** 重置表单 */
function resetForm() {
  roleFormRef.value.resetFields()
  roleFormRef.value.clearValidate()

  formData.id = undefined
  formData.sort = 1
  formData.status = 1
}

/** 删除角色 */
function handleDelete(roleId?: number) {
  const roleIds = [roleId || ids.value].join(',')
  if (!roleIds) {
    ElMessage.warning('请勾选删除项')
    return
  }

  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    loading.value = true
    // 接口文档自动生成的定义有误，手动编写
    request({
      url: `/api/v1/roles/${roleIds}`,
      method: 'delete',
    }).then(() => {
      ElMessage.success('删除成功')
      resetQuery()
    })
      .finally(() => (loading.value = false))
  })
}

/** 打开分配菜单弹窗 */
async function openMenuDialog(row: any) {
  const roleId = row.id
  if (roleId) {
    checkedRole = {
      id: roleId,
      name: row.name,
    }
    menuDialogVisible.value = true
    loading.value = true

    // 获取所有的菜单
    try {
      const menuOptions = await getApiV1MenusOptions()
      menuList.value = menuOptions
    }
    catch (error) {
      console.error('获取菜单选项失败', error)
    }

    // 回显角色已拥有的菜单
    getApiV1RolesByroleidMenuids({ roleId })
      .then((data) => {
        const checkedMenuIds = data
        checkedMenuIds.forEach((menuId: number) =>
          menuRef.value.setChecked(menuId, true, false),
        )
      })
      .finally(() => {
        loading.value = false
      })
  }
}

/** 角色分配菜单保存提交 */
function handleRoleMenuSubmit() {
  const roleId = checkedRole.id
  if (roleId) {
    const checkedMenuIds: number[] = menuRef.value
      .getCheckedNodes(false, true)
      .map((node: any) => node.value)

    loading.value = true
    putApiV1RolesByroleidMenus({ roleId }, checkedMenuIds)
      .then(() => {
        ElMessage.success('分配权限成功')
        menuDialogVisible.value = false
        resetQuery()
      })
      .finally(() => {
        loading.value = false
      })
  }
}

onMounted(() => {
  handleQuery()
})
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <ElForm ref="queryFormRef" :model="queryParams" :inline="true">
        <ElFormItem prop="keywords" label="关键字">
          <ElInput
            v-model="queryParams.keywords"
            placeholder="角色名称"
            clearable
            @keyup.enter="handleQuery"
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

    <ElCard shadow="never" class="table-container">
      <template #header>
        <ElButton type="success" @click="openDialog()">
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
        ref="dataTableRef"
        v-loading="loading"
        :data="roleList"
        highlight-current-row
        border
        @selection-change="handleSelectionChange"
      >
        <ElTableColumn type="selection" width="55" align="center" />
        <ElTableColumn label="角色名称" prop="name" min-width="100" />
        <ElTableColumn label="角色编码" prop="code" width="150" />

        <ElTableColumn label="状态" align="center" width="100">
          <template #default="scope">
            <ElTag v-if="scope.row.status === 1" type="success">
              正常
            </ElTag>
            <ElTag v-else type="info">
              禁用
            </ElTag>
          </template>
        </ElTableColumn>

        <ElTableColumn label="排序" align="center" width="80" prop="sort" />

        <ElTableColumn fixed="right" label="操作" width="220">
          <template #default="scope">
            <ElButton
              type="primary"
              size="small"
              link
              @click="openMenuDialog(scope.row)"
            >
              <i-ep-position />分配权限
            </ElButton>
            <ElButton
              type="primary"
              size="small"
              link
              @click="openDialog(scope.row.id)"
            >
              <i-ep-edit />编辑
            </ElButton>
            <ElButton
              type="primary"
              size="small"
              link
              @click="handleDelete(scope.row.id)"
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

    <!-- 角色表单弹窗 -->
    <ElDialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="closeDialog"
    >
      <ElForm
        ref="roleFormRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <ElFormItem label="角色名称" prop="name">
          <ElInput v-model="formData.name" placeholder="请输入角色名称" />
        </ElFormItem>

        <ElFormItem label="角色编码" prop="code">
          <ElInput v-model="formData.code" placeholder="请输入角色编码" />
        </ElFormItem>

        <ElFormItem label="数据权限" prop="dataScope">
          <ElSelect v-model="formData.dataScope">
            <ElOption :key="0" label="全部数据" :value="0" />
            <ElOption :key="1" label="部门及子部门数据" :value="1" />
            <ElOption :key="2" label="本部门数据" :value="2" />
            <ElOption :key="3" label="本人数据" :value="3" />
          </ElSelect>
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

        <ElFormItem label="排序" prop="sort">
          <ElInputNumber
            v-model="formData.sort"
            controls-position="right"
            :min="0"
            style="width: 100px"
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

    <!-- 分配菜单弹窗  -->
    <ElDialog
      v-model="menuDialogVisible"
      :title="`【${checkedRole.name}】权限分配`"
      width="800px"
    >
      <ElScrollbar v-loading="loading" max-height="600px">
        <ElTree
          ref="menuRef"
          node-key="value"
          show-checkbox
          :data="menuList"
          :default-expand-all="true"
        >
          <template #default="{ data }">
            {{ data.label }}
          </template>
        </ElTree>
      </ElScrollbar>

      <template #footer>
        <div class="dialog-footer">
          <ElButton type="primary" @click="handleRoleMenuSubmit">
            确 定
          </ElButton>
          <ElButton @click="menuDialogVisible = false">
            取 消
          </ElButton>
        </div>
      </template>
    </ElDialog>
  </div>
</template>
