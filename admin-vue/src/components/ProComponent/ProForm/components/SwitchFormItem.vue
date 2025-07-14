```vue mzy-admin/src/components/ProComponent/ProForm/components/SwitchFormItem.vue
<script setup lang="ts">
import { ElSwitch } from 'element-plus'
import type { SwitchProps } from 'element-plus'

defineProps<{
  attrs?: SwitchProps
  valueEnum?: Array<{
    value: any
    label: string
    [key: string]: any
  }>
}>()

const modelValue = defineModel<any>('modelValue', { required: true })
</script>

<template>
  <ElSwitch
    v-model="modelValue"
    :active-value="valueEnum?.[1]?.value"
    :inactive-value="valueEnum?.[0]?.value"
    :active-text="valueEnum?.[1]?.label"
    :inactive-text="valueEnum?.[0]?.label"
    v-bind="attrs"
  />
</template>
