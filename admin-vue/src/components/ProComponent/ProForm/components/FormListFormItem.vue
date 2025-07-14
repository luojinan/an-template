<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'
import { cloneDeep } from 'lodash-es'
import { ref, useId, watch } from 'vue'
import { ElButton } from 'element-plus'
import type { ProFormColumn } from '../../type'
import ProFormItem from '../FormItem.vue'

defineProps<{
  attrs?: any
}>()
const column = defineModel<ProFormColumn>('column', { required: true })
const itemData = defineModel<any>('itemData', { required: true, default: () => [] })
const realColumns = ref<ProFormColumn[][]>([])

function removeFormList(index: number) {
  itemData.value.splice(index, 1)
  realColumns.value?.splice(index, 1)
}

let templateColumns: ProFormColumn[] = []
if (column.value.columns) {
  templateColumns = column.value.columns
}

watch(
  () => itemData.value,
  (newVal, oldVal) => {
    if ((!oldVal || !oldVal.length) && newVal) {
      realColumns.value = newVal.map(() => {
        return cloneDeep(templateColumns)
      })
    }
  },
  { immediate: true },
)

function addFormListItem() {
  if (!itemData.value) {
    itemData.value = [{ _uid: useId() }]
  }
  else {
    itemData.value.push({ _uid: useId() })
    // 从无到有时，由watch触发realColumns的生成
    realColumns.value?.push(cloneDeep(templateColumns))
  }
}
</script>

<template>
  <div v-for="(formListItem, index) in realColumns" :key="itemData[index]" :class="`w-full ${!column.label ? 'border border-gray-200 rounded mb-2' : 'px-4'}`">
    <div class="flex justify-between items-center mb-[4px] ">
      <span class="text-sm">
        {{ column.label }}
      </span>
      <ElButton
        :icon="Delete" circle @click="removeFormList(index)"
      />
    </div>
    <div v-if="itemData.length === realColumns.length" class="flex flex-wrap gap-x-[6px]">
      <template v-for="(formListItemColumn, formIndex) in formListItem" :key="`${formListItemColumn.prop}`">
        <ProFormItem v-model:item-data="itemData[index][formListItemColumn.prop]" v-model:column="formListItem[formIndex]" :form-item-prop="`${column.prop}.${index}.`" :form-props="attrs" :form-data="itemData[index]" :form-items="formListItem">
          <template v-if="formListItemColumn.valueType == 'custom'" #[formListItemColumn.slotName!]="scope">
            <slot :name="formListItemColumn.slotName ?? formListItemColumn.prop" :form-data="itemData[index]" v-bind="scope" :column="formListItemColumn" />
          </template>
        </ProFormItem>
      </template>
    </div>
  </div>

  <ElButton plain type="success" style="width:80%;margin: auto;" @click="addFormListItem">
    新增{{ column.label }}
  </ElButton>
</template>
