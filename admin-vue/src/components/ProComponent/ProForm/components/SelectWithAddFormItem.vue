<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElButton, ElInput, ElOption, ElSelect } from 'element-plus'

const props = defineProps<{
  attrs?: any
  valueEnum?: Array<{
    value: any
    label: string
    [key: string]: any
  }>
}>()

const modelValue = defineModel<any>('modelValue', { required: true })

// 本地选项列表，基于传入的 valueEnum
const localOptions = ref([...(props.valueEnum || [])])

// 添加状态和输入值
const isAdding = ref(false)
const newOptionLabel = ref('')

// 计算属性，用于合并本地选项和传入的选项（如果需要保持同步）
const computedOptions = computed(() => {
  // 这里简单地返回本地选项列表
  // 如果需要与 props.valueEnum 保持同步，可以添加 watch 或其他逻辑
  return localOptions.value
})

// 添加新选项
function addNewOption() {
  isAdding.value = true
}

// 确认添加新选项
function confirmAdd() {
  if (newOptionLabel.value.trim()) {
    const trimmedLabel = newOptionLabel.value.trim()
    // 检查是否已存在
    if (!localOptions.value.some(item => item.label === trimmedLabel || item.value === trimmedLabel)) {
      const newItem = { label: trimmedLabel, value: trimmedLabel }
      localOptions.value.push(newItem)
      // 如果需要同步到 props.valueEnum，这里可以 emit 事件或调用回调
    }
    newOptionLabel.value = ''
    isAdding.value = false
  }
}

// 取消添加新选项
function cancelAdd() {
  newOptionLabel.value = ''
  isAdding.value = false
}

// 当选择项改变时触发的事件处理器
function handleChange(value: any) {
  // 调用 attrs 中的 onChange（如果存在）
  props.attrs?.onChange?.(value)
}
</script>

<template>
  <ElSelect
    v-model="modelValue"
    clearable
    filterable
    v-bind="attrs"
    @change="handleChange"
  >
    <template v-for="option in computedOptions" :key="option.value">
      <ElOption v-bind="option" />
    </template>
    <template #footer>
      <div style="padding: 6px; text-align: center;">
        <ElButton v-if="!isAdding" text bg size="small" @click="addNewOption">
          添加新选项
        </ElButton>
        <div v-else style="display: flex; flex-direction: column; gap: 4px;">
          <ElInput
            v-model="newOptionLabel"
            placeholder="输入新选项名称"
            size="small"
            @keyup.enter="confirmAdd"
          />
          <div style="display: flex; justify-content: space-between;">
            <ElButton type="primary" size="small" @click="confirmAdd">
              确认
            </ElButton>
            <ElButton size="small" @click="cancelAdd">
              取消
            </ElButton>
          </div>
        </div>
      </div>
    </template>
  </ElSelect>
</template>
