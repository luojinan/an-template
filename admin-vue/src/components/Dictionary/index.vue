<script setup lang="ts">
import { onBeforeMount, ref, useAttrs, watch } from 'vue'
import type { Ref } from 'vue'
import { ElOption, ElSelect } from 'element-plus'
import DictAPI from '@/api/dict'

// 定义选项类型
interface OptionType {
  label: string
  value: string | number
}

const props = defineProps({
  /**
   * 字典类型编码(eg: 性别-gender)
   */
  typeCode: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [String, Number],
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['update:modelValue']) // 父组件监听事件，同步子组件值的变化给父组件

// 透传属性
const attrs = useAttrs()
const options: Ref<OptionType[]> = ref([]) // 字典下拉数据源

const selectedValue = ref<string | number | undefined>()

watch([options, () => props.modelValue], ([newOptions, newModelValue]: [OptionType[], any]) => {
  if (newOptions.length === 0) {
    return // 下拉数据源加载未完成不回显
  }
  if (newModelValue == undefined) {
    selectedValue.value = undefined
    return
  }
  if (Array.isArray(newModelValue)) {
    selectedValue.value = newModelValue
    return
  }
  if (typeof newOptions[0].value === 'number') {
    selectedValue.value = Number(newModelValue)
  }
  else if (typeof newOptions[0].value === 'string') {
    selectedValue.value = String(newModelValue)
  }
  else {
    selectedValue.value = newModelValue
  }
})

function handleChange(val?: string | number | undefined) {
  emits('update:modelValue', val)
}

onBeforeMount(() => {
  // 根据字典类型编码(typeCode)获取字典选项
  DictAPI.getDictOptions(props.typeCode).then((data) => {
    options.value = data
  })
})
</script>

<template>
  <ElSelect
    v-model="selectedValue"
    :placeholder="placeholder"
    :disabled="disabled"
    clearable
    v-bind="attrs"
    @change="handleChange"
  >
    <ElOption
      v-for="option in options"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    />
  </ElSelect>
</template>
