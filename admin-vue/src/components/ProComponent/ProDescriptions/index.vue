<script setup lang="ts">
import { ref } from 'vue'
import { ElDescriptions, ElDescriptionsItem, ElIcon, ElImage, ElMessage, ElTag } from 'element-plus'
import type { IObject, ProTableColumn } from '../type'
import { setImageUrl } from '@/utils/index'

defineOptions({
  name: 'ProDescriptions',
})

const props = defineProps<{
  dataSourse: IObject
  columns: ProTableColumn[]
}>()

const afTerColumns = ref<ProTableColumn[]>(props.columns)

afTerColumns.value.forEach((column: ProTableColumn) => {
  if (column.initFn) {
    column.initFn(column)
  }

  return column
})

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('复制成功')
  }
  catch (err) {
    ElMessage.error('复制失败')
  }
}
</script>

<template>
  <ElDescriptions
    v-bind="$attrs"
  >
    <ElDescriptionsItem v-for="column in afTerColumns" :key="column.prop" :label="column.label">
      <template v-if="!dataSourse[column.prop!]">
        -
      </template>
      <template v-else-if="column.valueType === 'image'">
        <template v-if="column.prop">
          <template v-if="Array.isArray(dataSourse[column.prop])">
            <template
              v-for="(item, index) in dataSourse[column.prop]"
              :key="item"
            >
              <ElImage
                :src="setImageUrl(item, column.imageWidth ?? 40)"
                :preview-src-list="dataSourse[column.prop]"
                :initial-index="index"
                hide-on-click-modal
                :preview-teleported="true"
                :style="`width: ${column.imageWidth ?? 40}px; height: ${column.imageHeight ?? 40}px`"
              />
            </template>
          </template>
          <template v-else>
            <ElImage
              :src="setImageUrl(dataSourse[column.prop])"
              :preview-src-list="[dataSourse[column.prop]]"
              hide-on-click-modal
              :preview-teleported="true"
              :style="`width: ${column.imageWidth ?? 40}px; height: ${column.imageHeight ?? 40}px`"
            />
          </template>
        </template>
      </template>
      <template v-else-if="column.formatFn">
        <span>
          {{ column.formatFn(column?.valueEnum?.find(item => item.value === dataSourse[column.prop!])?.label || dataSourse[column.prop!], dataSourse) }}
          <ElIcon v-if="column.copyable" color="#409efc" class="ml-1 cursor-pointer" @click="copyToClipboard(column.formatFn(dataSourse[column.prop!], dataSourse))">
            <CopyDocument />
          </ElIcon>
        </span>
      </template>
      <template v-else-if="column.valueEnum">
        <span>
          <ElTag :type="column.valueEnum.find(item => item.value === dataSourse[column.prop!])?.tagType">
            {{ column.valueEnum.find(item => item.value === dataSourse[column.prop!])?.label || dataSourse[column.prop!] }}
          </ElTag>
          <ElIcon v-if="column.copyable" color="#409efc" class="ml-1 cursor-pointer" @click="copyToClipboard(dataSourse[column.prop!])">
            <CopyDocument />
          </ElIcon>
        </span>
      </template>
      <template v-else>
        <span>
          {{ dataSourse[column.prop!] }}
          <ElIcon v-if="column.copyable" color="#409efc" class="ml-1 cursor-pointer" @click="copyToClipboard(dataSourse[column.prop!])">
            <CopyDocument />
          </ElIcon>
        </span>
      </template>
    </ElDescriptionsItem>
  </ElDescriptions>
</template>
