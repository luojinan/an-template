<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { editConfig, resetPasswordColumn, sortFormColumn, tableColumns } from './config/column'
import { ProForm, ProTable } from '@/components/ProComponent'
import type { ProTableColumn } from '@/components/ProComponent'
import CalendarDrawer from '@/components/CalendarDrawer/CalendarDrawer.vue'
import { deleteTeacherInfoRemoveByid, getTeacherInfoByid, getTeacherInfoList, getTeacherInfoPubpicture, patchApiV1UsersByuseridPassword, postTeacherInfoAdd, postTeacherInfoByteacheridSoaMember, postTeacherInfoEdit, postTeacherInfoEditSortnumber } from '@/utils/proProApi/admin'
import type { TeacherInfoVO, TeacherSortNumberForm } from '@/proApi/apiTypes'
import Editor from '@/components/WangEditor/index.vue'

const toolbar = [
  {
    auths: ['sys:teacher:add'],
    name: 'add',
    text: '新增导师',
    type: 'success',
    onClick: handleAddClick,
  },
]

// 表格项内容
const cols: ProTableColumn<TeacherInfoVO>[] = [
  ...tableColumns,
  {
    label: '操作',
    fixed: 'right',
    width: 80,
    valueType: 'tool',
    operat: [
      {
        auths: ['sys:teacher:edit'],
        name: 'edit',
        text: '修改导师',
        onClick: handleEditClick,
      },
      {
        auths: ['sys:teacher:sort'],
        name: 'sort',
        text: '推荐顺序',
        onClick: handleTJClick,
      },
      {
        auths: ['sys:teacher:pubPicture'],
        name: 'sort',
        text: '导师海报',
        onClick: handlePicClick,
      },
      {
        auths: ['sys:teacher:soa'],
        name: 'openSoa',
        text: '注册商户',
        onClick: handleSoaClick,
      },
      {
        auths: ['sys:user:password:reset'],
        name: 'resetPassword',
        text: '修改密码',
        onClick: handleResetPassword,
      },
      {
        auths: ['sys:teacher:distribution'],
        name: 'calendarDrawer',
        text: '导师分配',
        onClick: (data) => {
          personChose.value.open(data)
        },
      },
      {
        auths: ['sys:teacher:delete'],
        name: 'delete',
        text: '删除导师',
        onClick: handleDeleteClick,
      },
      {
        name: 'time',
        text: '排课信息',
        onClick: handleTimeClick,
      },
    ],
  },
]
/** ************************************** 新增、编辑 */
const tableRef = ref()
const editModalRef = ref()
const openEdit = ref(false)

async function handleEditClick(row: any) {
  const res = await getTeacherInfoByid({ id: row.id })
  editModalRef.value.setFormData({
    ...res,
    ...res.proofMaterials,
    ...res.introduction,
  })
  openEdit.value = true
}

function handleAddClick() {
  editModalRef.value.resetFormData()
  openEdit.value = true
}
const modalVisible = ref(false)
const imgList = ref<string[]>([])
async function handlePicClick(data: TeacherInfoVO) {
  const res = await getTeacherInfoPubpicture({ id: data.id })
  console.log(res)
  imgList.value = [`data: image/jpeg;base64,${res}`]
  modalVisible.value = true
}

async function onSave(editObj: any) {
  await editModalRef.value.validateForm()

  const {
    idCards,
    degreeCertificates,
    socialProofMaterials,
    detailedIntroduction,
    videoIntroductionUrl,
    ...baseInfo
  } = editObj

  const params = {
    ...baseInfo,
    introduction: { detailedIntroduction, videoIntroductionUrl },
    proofMaterials: { idCards, socialProofMaterials, degreeCertificates },
  }

  if (editObj.id) { await postTeacherInfoEdit(params) }
  else { await postTeacherInfoAdd(params) }

  ElMessage.success('操作成功')
  openEdit.value = false
  tableRef.value.fetchPageData()
}
const personChose = ref()
/** 分配用户 */

/** ************************************** 注册商户(开通拉卡拉) */
async function handleSoaClick(row: TeacherInfoVO) {
  await ElMessageBox.confirm(`确认注册商户吗?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  const res = await postTeacherInfoByteacheridSoaMember({ teacherId: row.id })
  if (res) {
    window.open(res.url)
    ElMessage.success('操作成功')
    tableRef.value?.fetchPageData()
  }
  else {
    ElMessage.warning('开通异常,请稍后重试')
  }
}

/** ************************************** 重置密码 */
const openResetPassword = ref(false)
const passwordFormRef = ref()
function handleResetPassword(data: any) {
  openResetPassword.value = true
  passwordFormRef.value?.setFormData({ ...data, password: '' })
}

async function onPasswordSubmit(data: any) {
  const { userId, password } = data
  await patchApiV1UsersByuseridPassword({ userId, password })

  ElMessage.success(`密码重置成功，新密码是：${password}`)
  openResetPassword.value = false
}

/** ************************************** 导师时间排课功能 */
const open = ref(false)
const editId = ref()
async function handleTimeClick(row: any) {
  editId.value = row.id
  open.value = true
}

/** ************************************** 修改推荐顺序 */
const openSortForm = ref(false)
const sortFormRef = ref()

function handleTJClick(row: any) {
  openSortForm.value = true
  sortFormRef.value.setFormData(row)
}
function reGetList() {
  tableRef.value?.fetchPageData()
}
async function ensure(data: TeacherSortNumberForm) {
  await postTeacherInfoEditSortnumber(data)
  ElMessage.success('修改成功')
  openSortForm.value = false
  tableRef.value.fetchPageData()
}

/** ************************************** 删除功能 */
async function handleDeleteClick(id: string) {
  await deleteTeacherInfoRemoveByid({ id })
  tableRef.value.fetchPageData()
}

function getList(params: any) {
  return getTeacherInfoList(params)
}
</script>

<template>
  <div class="app-container">
    <!-- 列表 -->
    <ProTable
      ref="tableRef"
      :columns="cols"
      :toolbar="toolbar"
      :request="getList"
    />
    <!-- 新增编辑导师信息 -->
    <ProForm
      ref="editModalRef"
      v-model:open="openEdit"
      class="teacher-edit-form"
      type="drawer"
      :drawer-props="{ title: '导师信息', size: '60%', inline: true }"
      :columns="editConfig"
      :on-submit="onSave"
    >
      <template #wangedit="scope">
        <Editor v-model="scope.formData[scope.prop]" />
      </template>
    </ProForm>
    <!-- 修改推荐顺序 -->
    <ProForm
      ref="sortFormRef"
      v-model:open="openSortForm"
      type="drawer"
      :drawer-props="{ title: '修改推荐顺序' }"
      :columns="sortFormColumn"
      :on-submit="ensure"
    />
    <!-- 修改密码 -->
    <ProForm
      ref="passwordFormRef"
      v-model:open="openResetPassword"
      type="drawer"
      :drawer-props="{ title: '修改密码' }"
      :columns="resetPasswordColumn"
      :on-submit="onPasswordSubmit"
    />
    <!-- 导师时间排课功能 -->
    <CalendarDrawer v-model:open="open" :teacher-id="editId" />
    <el-dialog
      v-model="modalVisible"
      title="查看导师照片信息"
      :align-center="true"
      :append-to-body="true"
      width="800"
      @close="() => { modalVisible = false }"
    >
      <!-- 滚动 -->
      <el-scrollbar max-height="70vh">
        <div class="imgS">
          <el-image
            :src="imgList"
            :preview-src-list="imgList"
            hide-on-click-modal
            :preview-teleported="true"
          />
        </div>

        <!-- <img class="imgS" text="2xl" :src="item"/> -->
      </el-scrollbar>
      <!-- 弹窗底部操作按钮 -->
      <template #footer>
        <div style="padding-right: var(--el-dialog-padding-primary)">
          <el-button @click="modalVisible = false">
            关闭
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.teacher-edit-form {
  .el-drawer__body {
    .el-form {
      .pro-form-item{
        flex: calc(50% - 3px);
      }
    }
  }
}

  .imgS{
   width: 100%;
   height: 560px;

  .el-image{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    img{
    width: auto !important;
    max-width: 100%;
    height: auto !important;
    max-height: 100%;
  }
  }
}
</style>
