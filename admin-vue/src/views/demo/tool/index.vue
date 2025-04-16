<script setup lang="ts">
import type { UploadRequestOptions } from 'element-plus'
import { ProTable } from '@/components/ProComponent'
import type { ProTableColumn } from '@/components/ProComponent'
import { postApiV1FileGetwxassets } from '@/proApi'
import request from '@/utils/request'

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
    list: assets.map((asset: string) => ({ url: asset, img: asset })),
  }
}

// Uploads a file to OSS
async function uploadFileToOSS(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request<any, string>({
    url: '/api/v1/file/uploadWxAssets',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// Handles file upload request
async function onUploadRequest(options: UploadRequestOptions) {
  await uploadFileToOSS(options.file)
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
    <el-upload
      drag
      :http-request="onUploadRequest"
      multiple
    >
      <el-icon class="el-icon--upload">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text">
        拖拽上传 / <em>点击上传</em>
      </div>
    </el-upload>

    <ProTable
      ref="tableRef"
      :search="false"
      :pagination="{ pageSize: 9999, disabled: true }"
      :columns="tableColumn"
      :request="fetchTableData"
    />
  </div>
</template>
