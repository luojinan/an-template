<script setup lang="ts">
import { ElTag } from 'element-plus'
import type { ValueEnum } from '../../type'

interface Props {
  col: any
  scope: any
}

defineProps<Props>()

function getValueByMap(options: ValueEnum[] = [], val: string | string[]) {
  const result: ValueEnum[] = []

  const valueArray = Array.isArray(val) ? val : [val]

  valueArray.forEach((value) => {
    const matchedOption = options.find(option => option.value === value)
    if (matchedOption) {
      result.push(matchedOption)
    }
    else {
      result.push({ label: value, value })
    }
  })
  return result
}
</script>

<template>
  <template v-if="col.prop">
    <template v-if="getValueByMap(col.valueEnum, scope.row[col.prop]).some(item => !!item.tagType)">
      <ElTag v-for="tag in getValueByMap(col.valueEnum, scope.row[col.prop])" :key="tag.value" :type="tag.tagType">
        {{ tag.label }}
      </ElTag>
    </template>
    <span v-else>{{ getValueByMap(col.valueEnum, scope.row[col.prop]).map(item => {
      if (col.formatFn) {
        return col.formatFn(item.label, scope.row)
      }
      return item.label
    }).join(',') }}</span>
  </template>
</template> 