<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { formColumns } from './config/column'

const formRef = ref()
const open = ref(true)
const editId = ref()

// setTimeout(() => {
//   formRef.value.setFormData({
//     groupformList: [
//       {
//         c: 3,
//       },
//       {
//         c: 2,
//       },
//     ],
//   })
// }, 1000)

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
async function onSubmit(data: any) {
  await sleep(2000)
  if (editId.value) { console.log('提交表单', { id: editId.value, ...data }) }
  else { console.log('提交表单', data) }

  open.value = false
  ElMessage.success('操作成功')
}
</script>

<template>
  <div class="app-container">
    <ProForm
      ref="formRef"
      v-model:open="open"
      type="drawer"
      :drawer-props="{ title: '课程分类信息' }"
      :columns="formColumns"
      :on-submit="onSubmit"
    >
      <template #myslota="scope">
        <el-rate v-model="scope.formData[scope.prop]" />
      </template>
    </ProForm>
  </div>
</template>
