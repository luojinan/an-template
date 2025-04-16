<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable ts/no-unused-expressions -->
<script setup lang="ts">
import { ref } from 'vue'
import type { FormRules } from 'element-plus'
import MultiUpload from '@/components/Upload/MultiUpload.vue'
import agreementAPI from '@/api/agreement'
import editor from '@/components/WangEditor/index.vue'

const emit = defineEmits(['selectList'])
const formRef = ref(null)
const editContainer = ref()
const modalTitle = ref('新增协议')
const modalVisible = ref(false)
// 失去焦点事件
const formRules: FormRules = {
  title: [{ required: true, message: '请输入协议名称' }],
  contentData: [{ required: true, message: '请输入协议内容' }],
}
const formData = ref({
  id: 0,
  title: '',
  name: '',
  contentData: '',
  isDisplay: false,
})
// 关闭弹窗
function handleCloseModal() {
  formRef.value && formRef.value.resetFields()
  formData.value.contentData=''
  // console.log(editContainer.value.destroy())
  // quillT.value.setText('')
  modalVisible.value = false
}
// 提交产品
function handleSubmit() {
  formRef.value.validate((valid: any) => {
    if (valid) {
      formData.value.isDisplay = formData.value.isDisplay ? 1 : 0
      if (!formData.value.id) {
        agreementAPI.addAgreement(formData.value).then(() => {
          handleCloseModal()
          ElMessage({
            message: '新增协议成功',
            type: 'success',
          })
          emit('selectList')
        })
      }
      else {
        agreementAPI.editAgreement(formData.value.id, formData.value).then(() => {
          handleCloseModal()
          ElMessage({
            message: '修改协议成功',
            type: 'success',
          })
          emit('selectList')
        })
      }
    }
  })
}
function getValue(v) {
  formData.value.contentData = v
}
// 点开弹窗
async function open(obj) {
  modalVisible.value = true
  modalTitle.value = '新增协议'
  formData.value.id = undefined
  formData.value.contentData=''
  if (obj) {
    modalTitle.value = '编辑协议'
    agreementAPI.getFormData(obj.id).then((res) => {
      nextTick(() => {
        const editObj = { ...res }
        formData.value.title = editObj.title
        formData.value.contentData = editObj.contentData
        formData.value.id = editObj.id
        formData.value.isDisplay = editObj.isDisplay === 1
      })
    })
  }
}
defineExpose({ open })
</script>

<template>
  <el-dialog
    v-model="modalVisible"
    :title="modalTitle"
    :align-center="true"
    :append-to-body="true"
    width="1150"
    custom-class="artDialog"
    @close="handleCloseModal"
  >
    <!-- 滚动 -->
    <el-scrollbar max-height="60vh">
      <!-- 表单 -->
      <el-form
        ref="formRef"
        label-width="100px"
        style="padding-right: var(--el-dialog-padding-primary)"
        :model="formData"
        inline
        :rules="formRules"
      >
        <el-form-item label="名称" prop="title">
          <el-input v-model="formData.title" placeholder="请输入名称" :maxlength="20" />
        </el-form-item>
        <el-form-item label="是否展示" prop="isDisplay">
          <el-switch v-model="formData.isDisplay" />
        </el-form-item>
        <div v-if="modalVisible" class="inputT">
          <el-form-item label="协议内容" prop="contentData" class="inputT">
            <editor ref="editContainer" :model-value="formData.contentData" @update:model-value="getValue" />
          </el-form-item>
        </div>
      </el-form>
    </el-scrollbar>
    <!-- 弹窗底部操作按钮 -->
    <template #footer>
      <div style="padding-right: var(--el-dialog-padding-primary)">
        <el-button @click="handleCloseModal">
          取 消
        </el-button>
        <el-button type="primary" @click="handleSubmit">
          提 交
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.inputT{
  width: 1050px;
  height: 400px;
}

::v-deep{
  .el-form--inline .el-form-item{
    vertical-align: baseline;
  }

  .el-form-item__content{
    display: inline-block;
    width: 400px;
  }

  .el-form{
   height: 550px;
  }
}
</style>

<style lang="scss">
.artDialog{
  .el-dialog__body {
    height: 500px !important;
  }
}

.ql-editor {
  line-height: normal !important;
}

.ql-snow .ql-tooltip[data-mode='link']::before {
  content: '请输入链接地址:';
}

.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  padding-right: 0;
  content: '保存';
  border-right: 0;
}

.ql-snow .ql-tooltip[data-mode='video']::before {
  content: '请输入视频地址:';
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: '14px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='small']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='small']::before {
  content: '10px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='large']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='large']::before {
  content: '18px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='huge']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='huge']::before {
  content: '32px';
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '文本';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
  content: '标题1';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
  content: '标题2';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
  content: '标题3';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='4']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
  content: '标题4';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='5']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
  content: '标题5';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='6']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
  content: '标题6';
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: '标准字体';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='serif']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='serif']::before {
  content: '衬线字体';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='monospace']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='monospace']::before {
  content:'等宽字体';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='SimSun']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='SimSun']::before {
font-family:SimSun;
content:'宋体' !important;
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='SimHei']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='SimHei']::before {
font-family:SimHei;
content:'黑体' !important;
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='Microsoft-YaHei']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='Microsoft-YaHei']::before {
font-family:'Microsoft YaHei';
content:'微软雅黑' !important;
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='KaiTi']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='KaiTi']::before {
font-family:KaiTi;
content:'楷体' !important;
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='FangSong']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='FangSong']::before {
font-family:FangSong;
content:'仿宋' !important;
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='Arial']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='Arial']::before {
font-family:Arial;
content:'Arial' !important;
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='Times-New-Roman']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='Times-New-Roman']::before {
font-family:'Times New Roman';
content:'Times New Roman' !important;
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='sans-serif']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='sans-serif']::before {
font-family:sans-serif;
content: 'sans-serif' !important;
}

.ql-font-SimSun {
font-family:SimSun;
}

.ql-font-SimHei {
font-family:SimHei;
}

.ql-font-Microsoft-YaHei {
font-family:'Microsoft YaHei';
}

.ql-font-KaiTi {
font-family:KaiTi;
}

.ql-font-FangSong {
font-family:FangSong;
}

.ql-font-Arial {
font-family:Arial;
}

.ql-font-Times-New-Roman {
font-family:'Times New Roman';
}

.ql-font-sans-serif {
font-family:sans-serif;
}
</style>
