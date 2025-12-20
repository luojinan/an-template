<!-- 图片裁剪组件 -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElButton, ElDialog } from 'element-plus'
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'

const props = defineProps({
  /**
   * 对话框显示控制
   */
  visible: {
    type: Boolean,
    default: false,
  },
  /**
   * 待裁剪的原始文件
   */
  imageFile: {
    type: File,
    default: null,
  },
  /**
   * 裁剪比例 [width, height]
   */
  aspectRatio: {
    type: Array as PropType<[number, number]>,
    default: () => [1, 1],
  },
  /**
   * 输出格式
   */
  outputType: {
    type: String as PropType<'jpeg' | 'png' | 'webp'>,
    default: 'jpeg',
  },
  /**
   * 输出质量 0.1 - 1
   */
  outputQuality: {
    type: Number,
    default: 1,
  },
  /**
   * 对话框标题
   */
  title: {
    type: String,
    default: '裁剪图片',
  },
})

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'crop-success', file: File): void
  (e: 'cancel'): void
}>()

const cropperRef = ref<InstanceType<typeof VueCropper> | null>(null)
const imageSrc = ref('')
const loading = ref(false)

// 计算裁剪比例
const fixedNumber = computed(() => props.aspectRatio)

// 监听文件变化，转换为可预览的 URL
watch(
  () => props.imageFile,
  (file) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        imageSrc.value = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
    else {
      imageSrc.value = ''
    }
  },
  { immediate: true },
)

/**
 * 关闭对话框
 */
function handleClose() {
  emit('update:visible', false)
  emit('cancel')
}

/**
 * 取消裁剪
 */
function handleCancel() {
  emit('update:visible', false)
  emit('cancel')
}

/**
 * 确认裁剪
 */
function handleConfirm() {
  if (!cropperRef.value)
    return

  loading.value = true

  cropperRef.value.getCropBlob((blob: Blob) => {
    // 将 Blob 转换为 File 对象，保留原始文件名
    const fileName = props.imageFile?.name || `cropped.${props.outputType}`
    const file = new File([blob], fileName, {
      type: `image/${props.outputType}`,
    })

    loading.value = false
    emit('crop-success', file)
    emit('update:visible', false)
  })
}

/**
 * 放大
 */
function zoomIn() {
  cropperRef.value?.changeScale(1)
}

/**
 * 缩小
 */
function zoomOut() {
  cropperRef.value?.changeScale(-1)
}

/**
 * 向左旋转
 */
function rotateLeft() {
  cropperRef.value?.rotateLeft()
}

/**
 * 向右旋转
 */
function rotateRight() {
  cropperRef.value?.rotateRight()
}
</script>

<template>
  <ElDialog
    :model-value="visible"
    :title="title"
    width="650px"
    :close-on-click-modal="false"
    destroy-on-close
    @close="handleClose"
  >
    <div class="cropper-wrapper">
      <div class="cropper-container">
        <VueCropper
          v-if="imageSrc"
          ref="cropperRef"
          :img="imageSrc"
          :auto-crop="true"
          :fixed="true"
          :fixed-number="fixedNumber"
          :center-box="true"
          :output-size="outputQuality"
          :output-type="outputType"
          :can-scale="true"
          :can-move="true"
          :can-move-box="true"
          mode="contain"
        />
      </div>
      <div class="cropper-toolbar">
        <ElButton size="small" @click="zoomIn">
          <i-ep-zoom-in />
        </ElButton>
        <ElButton size="small" @click="zoomOut">
          <i-ep-zoom-out />
        </ElButton>
        <ElButton size="small" @click="rotateLeft">
          <i-ep-refresh-left />
        </ElButton>
        <ElButton size="small" @click="rotateRight">
          <i-ep-refresh-right />
        </ElButton>
      </div>
    </div>
    <template #footer>
      <ElButton @click="handleCancel">
        取消
      </ElButton>
      <ElButton type="primary" :loading="loading" @click="handleConfirm">
        确认裁剪
      </ElButton>
    </template>
  </ElDialog>
</template>

<style lang="scss" scoped>
.cropper-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cropper-container {
  width: 100%;
  height: 400px;
  background-color: #f5f5f5;
}

.cropper-toolbar {
  display: flex;
  justify-content: center;
  gap: 8px;
}
</style>
