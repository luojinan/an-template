<!-- 多图上传组件 -->
<script setup lang="ts">
import type {
  ElIcon,
  UploadFile,
  UploadProps,
  UploadRawFile,
  UploadRequestOptions,
  UploadUserFile,
} from 'element-plus'
import { ref, watch } from 'vue'
import { ElImageViewer, ElMessage, ElUpload } from 'element-plus'
import { uploadOss } from '@/utils'

const props = defineProps({
  /**
   * 文件路径集合
   */
  modelValue: {
    type: Array<{ url: string, name?: string }>,
    default: () => [],
  },
  /**
   * 文件上传数量限制
   */
  limit: {
    type: Number,
    default: 10,
  },
  accept: {
    type: String,
  },
  uploadResType: {
    type: String as PropType<'ossUrl' | 'base64'>,
    default: 'ossUrl',
  },
})

const emit = defineEmits(['update:modelValue', 'onChange'])

const viewVisible = ref(false)
const initialIndex = ref(0)

const viewFileList = ref([] as string[])

const fileList = ref([] as UploadUserFile[])
watch(
  () => props.modelValue,
  async (newVal: Array<UploadUserFile>) => {
    if (!newVal.length) {
      fileList.value = []
      return
    }
    const filePaths = fileList.value.map(file => file.url)
    // 监听modelValue文件集合值未变化时，跳过赋值
    if (
      filePaths.length > 0
      && filePaths.length === newVal.length
      && filePaths.every(x => newVal.every(({ url }) => x === url))
      && newVal.every(y => filePaths.includes(y.url))
    ) { return }
    fileList.value = newVal
  },
  { immediate: true },
)

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    let fileResult = ''
    reader.readAsDataURL(file)
    // 开始转
    reader.onload = () => {
      fileResult = reader.result
    }
    // 转 失败
    reader.onerror = (error) => {
      reject(error)
    }
    // 转 结束
    reader.onloadend = () => {
      resolve(fileResult)
    }
  })
}

/**
 * 自定义图片上传
 *
 * @param options
 */
async function handleUpload(options: UploadRequestOptions): Promise<any> {
  let data = null

  // 中间状态的value需要同步到form中，ready uploading
  emit(
    'update:modelValue',
    fileList.value,
  )
  emit('onChange', fileList.value)

  if (props.uploadResType === 'ossUrl') {
    // 上传API调用
    data = await uploadOss(options.file)
  }
  else {
    data = await getBase64(options.file)
  }

  // 上传成功需手动替换文件路径为远程URL，否则图片地址为预览地址 blob:http://
  const fileIndex = fileList.value.findIndex(
    file => file.uid == (options.file as any).uid,
  )
  fileList.value[fileIndex].url = data

  emit(
    'update:modelValue',
    fileList.value,
  )
  emit('onChange', fileList.value)
}

/**
 * 删除图片
 */
function handleBeforeRemove(removeFile: UploadFile) {
  return true // 删除都不调接口删除
  // const filePath = removeFile?.uploadRes?.id

  // if (filePath) {
  //   return FileAPI.deleteByPath(filePath).then(() => {
  //     // 删除成功回调
  //     emit(
  //       'update:modelValue',
  //       fileList.value.map(file => file.url),
  //     )
  //   })
  // }
  // else {
  //   return true
  // }
}
function handleRemove(file?: any) {
  fileList.value = fileList.value.filter(
    uploadFile => uploadFile !== file,
  )

  emit('update:modelValue', fileList.value)
  emit('onChange', fileList.value)
}

/**
 * 限制用户上传文件的格式和大小
 */
function handleBeforeUpload(file: UploadRawFile) {
  if (props.limit && props.limit <= fileList.value.length) {
    ElMessage.warning(`最多上传${props.limit}个`)
    return false
  }
  if (file.size > 10 * 1048 * 1048) {
    ElMessage.warning('上传文件不能大于10M')
    return false
  }
  return true
}

/**
 * 预览图片
 */
const previewImg: UploadProps['onPreview'] = (uploadFile: UploadFile) => {
  viewFileList.value = fileList.value.map(file => file.url!)
  initialIndex.value = fileList.value.findIndex(
    file => file.url === uploadFile.url,
  )
  viewVisible.value = true
}

/**
 * 关闭预览
 */
function closePreview() {
  viewVisible.value = false
}

defineExpose({ fileList })
</script>

<template>
  <ElUpload
    v-model:file-list="fileList"
    :accept="props.accept"
    list-type="picture-card"
    :class="
      fileList.length >= props.limit ? 'hide' : 'show'
    "
    :before-upload="handleBeforeUpload"
    :before-remove="handleBeforeRemove"
    :http-request="handleUpload"
    :on-remove="handleRemove"
    :on-preview="previewImg"
  >
    <i-ep-plus />
    <template #file="{ file }">
      <div v-if="file.url.includes('.mp4')">
        <video
          class="el-upload-list__item-thumbnail"
          controls
          :src="file.url"
        />
        <span class="el-upload-list__item-actions" :style="{ left: 'unset', right: '0', width: '40px', height: ' 40px' }">
          <span
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <ElIcon><Delete /></ElIcon>
          </span>
        </span>
      </div>
    </template>
  </ElUpload>

  <ElImageViewer
    v-if="viewVisible"
    :zoom-rate="1.2"
    :initial-index="initialIndex"
    :url-list="viewFileList"
    hide-on-click-modal
    @close="closePreview"
  />
</template>

<style lang="scss" scoped>
.hide {
  :deep(.el-upload--picture-card) {
    display: none;
  }
}

.show {
  :deep(.el-upload--picture-card) {
    display: flex;
  }
}
</style>
