<!-- 用户管理 -->
<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import type { UploadInstance } from 'element-plus'
import { ElButton, ElCard, ElCol, ElDatePicker, ElDialog, ElDropdown, ElDropdownItem, ElDropdownMenu, ElForm, ElFormItem, ElIcon, ElInput, ElMessage, ElMessageBox, ElOption, ElRadio, ElRadioGroup, ElRow, ElSelect, ElTable, ElTableColumn, ElTag, ElTreeSelect, ElUpload, genFileId } from 'element-plus'
import { useThrottleFn } from '@vueuse/core'
import UserAPI from '@/api/user'
import DeptAPI from '@/api/dept'
import { useUserStore } from '@/store'
import type { UserForm, UserPageVO } from '@/utils/proApi/types/systemTypes'
import { getApiV1RolesOptions } from '@/utils/proApi/system'
import { getAdminStorePage } from '@/utils/proApi/admin'
import UploadFormItem from '@/components/ProComponent/ProForm/components/UploadFormItem.vue'

defineOptions({
  name: 'User',
  inheritAttrs: false,
})

const userStore = useUserStore()

const queryFormRef = ref(ElForm) // 查询表单
const userFormRef = ref(ElForm) // 用户表单
const uploadRef = ref<UploadInstance>() // 上传组件

const loading = ref(false) //  加载状态
const removeIds = ref([]) // 删除用户ID集合 用于批量删除
const queryParams = reactive<any>({
  pageNum: 1,
  pageSize: 10,
})
const dateTimeRange = ref('')
const total = ref(0) // 数据总数
const pageData = ref<UserPageVO[]>() // 用户分页数据
const deptList = ref<OptionType[]>() // 部门下拉数据源
const roleList = ref<OptionType[]>() // 角色下拉数据源
const storeList = ref<OptionType[]>() // 门店下拉数据源

watch(dateTimeRange, (newVal) => {
  if (newVal) {
    queryParams.startTime = newVal[0]
    queryParams.endTime = newVal[1]
  }
})

// 弹窗对象
const dialog = reactive({
  visible: false,
  type: 'user-form',
  width: 800,
  title: '',
})

// 本地表单数据类型，将上传字段改为数组格式
interface LocalUserForm extends Omit<UserForm, 'avatar' | 'posterUrl'> {
  avatar: Array<{ url: string }> | []
  posterUrl: Array<{ url: string }> | []
}

// 用户表单数据
const formData = reactive<LocalUserForm>({
  status: 1,
  avatar: [],
  deptId: undefined,
  email: '',
  gender: undefined,
  id: undefined,
  introduction: '',
  mobile: '',
  nickname: '',
  posterUrl: [],
  roleIds: [],
  slogan: '',
  specialties: [],
  storeId: undefined,
  storeType: 'ALL',
  username: '',
})

// 用户导入数据
const importData = reactive({
  deptId: undefined,
  file: undefined,
  fileList: [],
})

// 校验规则
const rules = reactive({
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  nickname: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
  deptId: [{ required: true, message: '所属部门不能为空', trigger: 'blur' }],
  roleIds: [{ required: true, message: '用户角色不能为空', trigger: 'blur' }],
  email: [
    {
      pattern: /\w[-\w.+]*@([A-Z0-9][-A-Z0-9]+\.)+[A-Z]{2,14}/i,
      message: '请输入正确的邮箱地址',
      trigger: 'blur',
    },
  ],
  mobile: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    {
      pattern: /^1[3-9|]\d{9}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur',
    },
  ],
})

/** 查询 */
function handleQuery() {
  loading.value = true
  UserAPI.getPage(queryParams)
    .then((data) => {
      console.log('handleQuery', data)
      pageData.value = data.records
      total.value = data.total
    })
    .finally(() => {
      loading.value = false
    })
}

/** 重置查询 */
function resetQuery() {
  queryFormRef.value.resetFields()
  dateTimeRange.value = ''
  queryParams.pageNum = 1
  queryParams.deptId = undefined
  queryParams.startTime = undefined
  queryParams.endTime = undefined
  handleQuery()
}

/** 行选中 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id)
}

/** 重置密码 */
function resetPassword(row: { [key: string]: any }) {
  ElMessageBox.prompt(
    `请输入用户「${row.username}」的新密码`,
    '重置密码',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    },
  ).then(({ value }) => {
    if (!value || value.length < 6) {
      // 检查密码是否为空或少于6位
      ElMessage.warning('密码至少需要6位字符，请重新输入')
      return false
    }
    UserAPI.updatePassword(row.id, value).then(() => {
      ElMessage.success(`密码重置成功，新密码是：${value}`)
    })
  })
}

/** 加载角色下拉数据源 */
async function loadRoleOptions() {
  const data = await getApiV1RolesOptions()
  roleList.value = data
}

/** 加载部门下拉数据源 */
async function loadDeptOptions() {
  const data = await DeptAPI.getOptions()
  deptList.value = data
}

/** 加载门店下拉数据源 */
async function loadStoreOptions() {
  const data = await getAdminStorePage({
    pageNum: '1',
    pageSize: '1000',
  })
  storeList.value = data.records.map(item => ({
    label: item.name,
    value: item.id,
  }))
}

/**
 * 打开弹窗
 *
 * @param type 弹窗类型  用户表单：user-form | 用户导入：user-import
 * @param id 用户ID
 */
async function openDialog(type: string, id?: number) {
  dialog.visible = true
  dialog.type = type

  if (dialog.type === 'user-form') {
    // 用户表单弹窗
    await loadDeptOptions()
    await loadRoleOptions()
    await loadStoreOptions() // 加载门店选项
    if (id) {
      dialog.title = '修改用户'
      UserAPI.getFormData(id).then((data) => {
        // 转换上传组件数据格式：字符串 -> 数组
        const convertedData = {
          ...data,
          avatar: data.avatar ? [{ url: data.avatar }] : [],
          posterUrl: data.posterUrl ? [{ url: data.posterUrl }] : [],
        }
        Object.assign(formData, convertedData)
      })
    }
    else {
      dialog.title = '新增用户'
      // 重置表单数据
      Object.assign(formData, {
        status: 1,
        avatar: [],
        deptId: undefined,
        email: '',
        gender: undefined,
        id: undefined,
        introduction: '',
        mobile: '',
        nickname: '',
        posterUrl: [],
        roleIds: [],
        slogan: '',
        specialties: [],
        storeId: undefined,
        storeType: 'ALL',
        username: '',
      })
    }
  }
  else if (dialog.type === 'user-import') {
    // 用户导入弹窗
    dialog.title = '导入用户'
    dialog.width = 600
    loadDeptOptions()
  }
}

/**
 * 关闭弹窗
 *
 * @param type 弹窗类型  用户表单：user-form | 用户导入：user-import
 */
function closeDialog() {
  dialog.visible = false
  if (dialog.type === 'user-form') {
    userFormRef.value.resetFields()
    userFormRef.value.clearValidate()

    // 重置表单数据
    Object.assign(formData, {
      status: 1,
      avatar: [],
      deptId: undefined,
      email: '',
      gender: undefined,
      id: undefined,
      introduction: '',
      mobile: '',
      nickname: '',
      posterUrl: [],
      roleIds: [],
      slogan: '',
      specialties: [],
      storeId: undefined,
      storeType: 'ALL',
      username: '',
    })
  }
  else if (dialog.type === 'user-import') {
    importData.file = undefined
    importData.fileList = []
  }
}

/** 表单提交 */
const handleSubmit = useThrottleFn(() => {
  if (dialog.type === 'user-form') {
    userFormRef.value.validate((valid: any) => {
      if (valid) {
        const userId = formData.id
        loading.value = true

        // 转换上传组件数据格式：数组 -> 字符串
        const submitData = {
          ...formData,
          avatar: Array.isArray(formData.avatar) && formData.avatar.length > 0
            ? formData.avatar[0]?.url || ''
            : '',
          posterUrl: Array.isArray(formData.posterUrl) && formData.posterUrl.length > 0
            ? formData.posterUrl[0]?.url || ''
            : '',
        }

        if (userId) {
          UserAPI.update(userId, submitData)
            .then(() => {
              ElMessage.success('修改用户成功')
              closeDialog()
              resetQuery()
            })
            .finally(() => (loading.value = false))
        }
        else {
          UserAPI.add(submitData)
            .then(() => {
              ElMessage.success('新增用户成功')
              closeDialog()
              resetQuery()
            })
            .finally(() => (loading.value = false))
        }
      }
    })
  }
  else if (dialog.type === 'user-import') {
    if (!importData?.deptId) {
      ElMessage.warning('请选择部门')
      return false
    }
    if (!importData?.file) {
      ElMessage.warning('上传Excel文件不能为空')
      return false
    }
    UserAPI.import(importData?.deptId, importData?.file).then((data) => {
      ElMessage.success('导入用户成功')
      closeDialog()
      resetQuery()
    })
  }
}, 3000)

/** 删除用户 */
function handleDelete(id?: number) {
  const userIds = [id || removeIds.value].join(',')
  if (!userIds) {
    ElMessage.warning('请勾选删除项')
    return
  }

  ElMessageBox.confirm('确认删除用户?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    UserAPI.deleteByIds(userIds).then(() => {
      ElMessage.success('删除成功')
      resetQuery()
    })
  })
}

/** 下载导入模板 */
function downloadTemplate() {
  UserAPI.downloadTemplate().then((response: any) => {
    const fileData = response.data
    const fileName = decodeURI(
      response.headers['content-disposition'].split(';')[1].split('=')[1],
    )
    const fileType
      = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'

    const blob = new Blob([fileData], { type: fileType })
    const downloadUrl = window.URL.createObjectURL(blob)

    const downloadLink = document.createElement('a')
    downloadLink.href = downloadUrl
    downloadLink.download = fileName

    document.body.appendChild(downloadLink)
    downloadLink.click()

    document.body.removeChild(downloadLink)
    window.URL.revokeObjectURL(downloadUrl)
  })
}

/** Excel文件 Change */
function handleFileChange(file: any) {
  importData.file = file.raw
}

/** Excel文件 Exceed  */
function handleFileExceed(files: any) {
  uploadRef.value!.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  uploadRef.value!.handleStart(file)
  importData.file = file
}

/** 导出用户 */
function handleExport() {
  UserAPI.export(queryParams).then((response: any) => {
    const fileData = response.data
    const fileName = decodeURI(
      response.headers['content-disposition'].split(';')[1].split('=')[1],
    )
    const fileType
      = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'

    const blob = new Blob([fileData], { type: fileType })
    const downloadUrl = window.URL.createObjectURL(blob)

    const downloadLink = document.createElement('a')
    downloadLink.href = downloadUrl
    downloadLink.download = fileName

    document.body.appendChild(downloadLink)
    downloadLink.click()

    document.body.removeChild(downloadLink)
    window.URL.revokeObjectURL(downloadUrl)
  })
}

onMounted(() => {
  handleQuery()
})
</script>

<template>
  <div class="app-container">
    <ElRow :gutter="20">
      <!-- 部门树 -->
      <ElCol :lg="4" :xs="24" class="mb-[12px]">
        <dept-tree v-model="queryParams.deptId" @node-click="handleQuery" />
      </ElCol>

      <!-- 用户列表 -->
      <ElCol :lg="20" :xs="24">
        <div class="search-container">
          <ElForm ref="queryFormRef" :model="queryParams" :inline="true">
            <ElFormItem label="关键字" prop="keywords">
              <ElInput
                v-model="queryParams.keywords"
                placeholder="用户名/昵称/手机号"
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery"
              />
            </ElFormItem>

            <ElFormItem label="状态" prop="status">
              <ElSelect
                v-model="queryParams.status"
                placeholder="全部"
                clearable
                class="!w-[100px]"
              >
                <ElOption label="启用" value="1" />
                <ElOption label="禁用" value="0" />
              </ElSelect>
            </ElFormItem>

            <ElFormItem label="创建时间">
              <ElDatePicker
                v-model="dateTimeRange"
                class="!w-[240px]"
                type="daterange"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="截止时间"
                value-format="YYYY-MM-DD"
              />
            </ElFormItem>

            <ElFormItem>
              <ElButton type="primary" @click="handleQuery">
                <i-ep-search />搜索
              </ElButton>
              <ElButton @click="resetQuery">
                <i-ep-refresh />
                重置
              </ElButton>
            </ElFormItem>
          </ElForm>
        </div>

        <ElCard shadow="never" class="table-container">
          <template #header>
            <div class="flex justify-between">
              <div>
                <ElButton
                  v-hasPerm="['sys:user:add']"
                  type="success"
                  @click="openDialog('user-form')"
                >
                  <i-ep-plus />新增
                </ElButton>
                <ElButton
                  v-hasPerm="['sys:user:delete']"
                  type="danger"
                  :disabled="removeIds.length === 0"
                  @click="handleDelete()"
                >
                  <i-ep-delete />删除
                </ElButton>
              </div>
              <div>
                <ElDropdown split-button>
                  导入
                  <template #dropdown>
                    <ElDropdownMenu>
                      <ElDropdownItem @click="downloadTemplate">
                        <i-ep-download />下载模板
                      </ElDropdownItem>
                      <ElDropdownItem @click="openDialog('user-import')">
                        <i-ep-top />导入数据
                      </ElDropdownItem>
                    </ElDropdownMenu>
                  </template>
                </ElDropdown>
                <ElButton class="ml-3" @click="handleExport">
                  <template #icon>
                    <i-ep-download />
                  </template>导出
                </ElButton>
              </div>
            </div>
          </template>

          <ElTable
            v-loading="loading"
            :data="pageData"
            @selection-change="handleSelectionChange"
          >
            <ElTableColumn type="selection" width="50" align="center" />
            <ElTableColumn
              key="id"
              label="编号"
              align="center"
              prop="id"
              width="100"
            />
            <ElTableColumn
              key="username"
              label="用户名"
              align="center"
              prop="username"
            />
            <ElTableColumn
              label="用户昵称"
              width="120"
              align="center"
              prop="nickname"
            />

            <ElTableColumn
              label="性别"
              width="100"
              align="center"
              prop="genderLabel"
            />

            <ElTableColumn
              label="部门"
              width="120"
              align="center"
              prop="deptName"
            />
            <ElTableColumn
              label="手机号码"
              align="center"
              prop="mobile"
              width="120"
            />

            <ElTableColumn label="状态" align="center" prop="status">
              <template #default="scope">
                <ElTag :type="scope.row.status == 1 ? 'success' : 'info'">
                  {{
                    scope.row.status == 1 ? "启用" : "禁用"
                  }}
                </ElTag>
              </template>
            </ElTableColumn>
            <ElTableColumn
              label="创建时间"
              align="center"
              prop="createTime"
              width="180"
            />
            <ElTableColumn label="操作" fixed="right" width="220">
              <template #default="scope">
                <ElButton
                  v-hasPerm="['sys:user:password:reset']"
                  type="primary"
                  size="small"
                  link
                  @click="resetPassword(scope.row)"
                >
                  <i-ep-refresh-left />重置密码
                </ElButton>
                <ElButton
                  v-hasPerm="['sys:user:edit']"
                  type="primary"
                  link
                  size="small"
                  @click="openDialog('user-form', scope.row.id)"
                >
                  <i-ep-edit />编辑
                </ElButton>
                <ElButton
                  v-hasPerm="['sys:user:delete']"
                  type="primary"
                  link
                  size="small"
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
      </ElCol>
    </ElRow>

    <!-- 弹窗 -->
    <ElDialog
      v-model="dialog.visible"
      :title="dialog.title"
      :width="dialog.width"
      append-to-body
      @close="closeDialog"
    >
      <!-- 用户新增/编辑表单 -->
      <ElForm
        v-if="dialog.type === 'user-form'"
        ref="userFormRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <ElFormItem label="用户名" prop="username">
          <ElInput
            v-model="formData.username"
            :readonly="!!formData.id"
            placeholder="请输入用户名"
          />
        </ElFormItem>

        <ElFormItem label="用户昵称" prop="nickname">
          <ElInput v-model="formData.nickname" placeholder="请输入用户昵称" />
        </ElFormItem>
        <!-- 非总公司人员，不用选择，但要上送所属机构id -->
        <ElFormItem v-if="!userStore?.user.dept?.isInstitution" label="所属部门" prop="deptId">
          <ElTreeSelect
            v-model="formData.deptId"
            placeholder="请选择所属部门"
            :data="deptList"
            filterable
            check-strictly
            :render-after-expand="false"
          />
        </ElFormItem>
        <ElFormItem v-else label="所属部门" prop="deptId">
          <ElSelect v-model="formData.deptId">
            <ElOption
              :label="userStore?.user.dept?.name"
              :value="userStore?.user.dept?.id"
            />
          </ElSelect>
        </ElFormItem>

        <ElFormItem label="性别" prop="gender">
          <dictionary v-model="formData.gender" type-code="gender" />
        </ElFormItem>

        <ElFormItem label="角色" prop="roleIds">
          <ElSelect v-model="formData.roleIds" multiple placeholder="请选择">
            <ElOption
              v-for="item in roleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>

        <ElFormItem label="手机号码" prop="mobile">
          <ElInput
            v-model="formData.mobile"
            placeholder="请输入手机号码"
            maxlength="11"
          />
        </ElFormItem>

        <ElFormItem label="邮箱" prop="email">
          <ElInput
            v-model="formData.email"
            placeholder="请输入邮箱"
            maxlength="50"
          />
        </ElFormItem>

        <ElFormItem label="状态" prop="status">
          <ElRadioGroup v-model="formData.status">
            <ElRadio :label="1">
              正常
            </ElRadio>
            <ElRadio :label="0">
              禁用
            </ElRadio>
          </ElRadioGroup>
        </ElFormItem>

        <ElFormItem label="头像" prop="avatar">
          <UploadFormItem
            v-model="formData.avatar"
            :attrs="{
              limit: 1,
              accept: 'image/*',
            }"
          />
        </ElFormItem>

        <ElFormItem label="详细介绍" prop="introduction">
          <ElInput
            v-model="formData.introduction"
            type="textarea"
            :rows="3"
            placeholder="请输入详细介绍"
          />
        </ElFormItem>

        <ElFormItem label="海报" prop="posterUrl">
          <UploadFormItem
            v-model="formData.posterUrl"
            :attrs="{
              limit: 1,
              accept: 'image/*',
            }"
          />
        </ElFormItem>

        <ElFormItem label="宣传标语" prop="slogan">
          <ElInput
            v-model="formData.slogan"
            placeholder="请输入宣传标语"
          />
        </ElFormItem>

        <ElFormItem label="擅长领域" prop="specialties">
          <dictionary v-model="formData.specialties" type-code="specialties" :multiple="true" />
        </ElFormItem>

        <ElFormItem label="门店类型" prop="storeType">
          <ElRadioGroup v-model="formData.storeType">
            <ElRadio label="EXCLUSIVE">
              专属门店
            </ElRadio>
            <ElRadio label="ALL">
              全门店
            </ElRadio>
          </ElRadioGroup>
        </ElFormItem>

        <ElFormItem v-if="formData.storeType === 'EXCLUSIVE'" label="所属门店" prop="storeId">
          <ElSelect v-model="formData.storeId" placeholder="请选择所属门店" filterable>
            <ElOption
              v-for="item in storeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>
      </ElForm>

      <!-- 用户导入表单 -->
      <ElForm
        v-else-if="dialog.type === 'user-import'"
        :model="importData"
        label-width="100px"
      >
        <ElFormItem label="部门">
          <ElTreeSelect
            v-model="importData.deptId"
            placeholder="请选择部门"
            :data="deptList"
            filterable
            check-strictly
          />
        </ElFormItem>

        <ElFormItem label="Excel文件">
          <ElUpload
            ref="uploadRef"
            action=""
            drag
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            :limit="1"
            :auto-upload="false"
            :file-list="importData.fileList"
            :on-change="handleFileChange"
            :on-exceed="handleFileExceed"
          >
            <ElIcon class="el-icon--upload">
              <i-ep-upload-filled />
            </ElIcon>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <template #tip>
              <div>xls/xlsx files</div>
            </template>
          </ElUpload>
        </ElFormItem>
      </ElForm>
      <!-- 弹窗底部操作按钮 -->
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
