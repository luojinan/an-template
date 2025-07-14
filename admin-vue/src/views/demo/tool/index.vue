<script setup lang="ts">
import { ElIcon, ElMessage, ElUpload, type UploadRequestOptions } from 'element-plus'
import { ref } from 'vue'
import { ProTable } from '@/components/ProComponent'
import type { ProTableColumn } from '@/components/ProComponent'
import { postApiV1FileGetwxassets } from '@/utils/proApi/admin'
import { uploadOss } from '@/utils'

// 表格顶部新镇按钮
const tableRef = ref()

const tableColumn: ProTableColumn[] = [
  { prop: 'img', label: 'Img', valueType: 'image', width: 50 },
  { prop: 'url', label: 'URL' },
  {
    valueType: 'tool',
    label: 'Actions',
    fixed: 'right',
    width: 80,
    operat: [
      {
        name: 'copyUrl',
        text: 'Copy',
        onClick: record => copyToClipboard(record.url),
      },
    ],
  },
]

// Fetches table data
async function fetchTableData() {
  const assets = await postApiV1FileGetwxassets()
  return {
    total: assets.length,
    records: assets.map((asset: string) => ({ url: asset, img: asset })),
  }
}

// Handles file upload request
async function onUploadRequest(options: UploadRequestOptions) {
  await uploadOss(options.file, '/api/v1/file/uploadWxAssets')
  tableRef.value.fetchPageData()
  copyToClipboard('上传成功')
}

// Copies text to clipboard
function copyToClipboard(text: string) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'absolute'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  ElMessage.success('复制成功')
}
</script>

<template>
  <div class="app-container">
    <ElUpload
      drag
      :http-request="onUploadRequest"
      multiple
    >
      <ElIcon class="el-icon--upload">
        <upload-filled />
      </ElIcon>
      <div class="el-upload__text">
        拖拽上传 / <em>点击上传</em>
      </div>
    </ElUpload>

    <ProTable
      ref="tableRef"
      :search="false"
      :pagination="{ pageSize: 9999, disabled: true }"
      :columns="tableColumn"
      :request="fetchTableData"
    />
  </div>
</template>
