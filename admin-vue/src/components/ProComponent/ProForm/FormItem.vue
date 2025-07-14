<script setup lang="ts">
import { ElDivider, ElFormItem, ElIcon, ElTooltip } from 'element-plus'
import type { ProFormColumn } from '../type'
import { formItemComponentMap } from './components'
import FormListFormItem from './components/FormListFormItem.vue'
import { computed, watch } from 'vue'

defineOptions({
  name: 'ProFormItem',
})

const props = defineProps<{
  formProps?: any
  formData: any
  formItems: ProFormColumn<any>[]
  formItemProp?: string
}>()

const column = defineModel<ProFormColumn>('column', { required: true })
const itemData = defineModel<any>('itemData', { required: true })
const open = defineModel<any>('open')

const prepareFuncs: Array<() => void> = []

// 工具函数：安全获取嵌套属性
function getNested(obj: any, pathArr: string[]) {
  return pathArr.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj)
}

const formItemTool = {
  getFieldConfig: (prop: string | string[]) => {
    if (Array.isArray(prop)) { return prop.map(key => props.formItems.find(item => item.prop === key)) }

    return props.formItems.find(item => item.prop === prop) || {}
  },
}

function initFormItem() {
  if (column.value.valueType === 'group') { return }

  column.value.initFn && column.value.initFn(column.value)
  
  // 初始化基于 dependency 的 watch
  if (column.value.dependency && column.value.watchCallback) {
    prepareFuncs.push(() => {
      // 生成 getter 数组
      // TODO: 为了独立formlist 的item数据，使props.formdata 拿到的list[index] 数据，无法获取最外层的数据
      // formlist item既要能监听list[index]内的数据，也要监听外部的数据
      const sources = column.value.dependency!.map((dep: string | string[]) => {
        if (Array.isArray(dep)) {
          return () => getNested(props.formData, dep) // 嵌套路径
        } else {
          return () => props.formData[dep] // 普通 key
        }
      })

      watch(
        sources,
        (newVals, oldVals) => {
          column.value.watchCallback && column.value.watchCallback(newVals, {
            oldVals,
            formData: props.formData,
            formItems: props.formItems,
            formItem: column.value,
        })
        },
        { immediate: true },
      )
    })
  }
  
  // 初始化原有的 watch（保持向后兼容）
  if (column.value.watch && !column.value.dependency) {
    prepareFuncs.push(() => {
      watch(
        () => props.formData[column.value.prop as string],
        (newValue, oldValue) => {
          column.value.watch && column.value.watch(newValue, oldValue, props.formData, props.formItems, formItemTool)
        },
        { immediate: true },
      )
    })
  }
  // 初始化placehold
  // item.attrs = { placeholder: `请输入${item.label}`, ...item.attrs }
  // 🤮 解构会导致 reactive 数据丢失响应式
  if (!column.value.attrs) { column.value.attrs = { placeholder: `请${['select', 'tree-select', 'date-picker', 'time-picker', 'cascader'].includes(column.value.valueType || '') ? '选择' : '输入'}${column.value.label}` } }
  else if (column.value.attrs && !column.value.attrs.placeholder) { column.value.attrs.placeholder = `请${['select', 'tree-select', 'date-picker', 'time-picker', 'cascader'].includes(column.value.valueType || '') ? '选择' : '输入'}${column.value.label}` }

  // 立即执行watch watch 迁移到form item 中执行导致执行时机过早
  // 当hidden一开始是false时，init formitem 先执行watch操作其他未初始化的表单项控制hidden为true/false，此时 rules没被移除且后续切换hidden也移除不掉？
  // 应在formitems全部初始化完成后触发watch，且要留意异步formitem的watch
  // watch一旦创建就会一直监听，如果是动态表单，怎么移除watch，外部监听单项不合理，还是应该在form item 中消费watch
  setTimeout(() => {
    prepareFuncs.forEach(func => func())
  }, 300)
  // 设置表单初始值
  if (column.value?.convertValue) {
    itemData.value = column.value.convertValue(column.value.initialValue, props.formData)
  }
  else if (!itemData.value) {
    itemData.value = column.value.initialValue
  }
}

// 初始化 rule 中必填规则 补充message为label
const newRules = computed(() => {
  const rules = column.value.rules ?? []
  const name = column.value.label
  return rules.map((item) => {
    if (item.required && !item.message) { item.message = `${name || '当前项'}是必填项` }
    return item
  })
})

// 添加一个获取组件的方法
const getFormItemComponent = (type: string | undefined) => {
  return formItemComponentMap[type as keyof typeof formItemComponentMap]
}

const closeDrawer = () => {
  open.value = false
}

// 初始化表单项
initFormItem()
</script>

<template>
  <!-- formList 不用elform包裹 没有label -->
  <template v-if="column.valueType === 'formList'">
    <FormListFormItem v-model:item-data="itemData" v-model:column="column">
      <template v-for="(formListItemColumn, formIndex) in column?.columns?.filter?.(i => i.valueType === 'custom')" :key="formListItemColumn.slotName" #[formListItemColumn.slotName]="scope">
        <slot :name="formListItemColumn.slotName ?? formListItemColumn.prop" :form-data="itemData[formIndex]" v-bind="scope" :column="formListItemColumn" />
      </template>
    </FormListFormItem>
  </template>

  <template v-else>
    <ElFormItem
      v-if="!column.hidden && !column.unMounted"
      v-bind="column.formTtemAttrs"
      :label="column.label ? `${column.label}${column?.valueType === 'text' ? ' : ' : ''}` : undefined"
      :prop="`${formItemProp || ''}${String(column.prop)}`"
      class="pro-form-item"
      :rules="newRules"
    >
      <template v-if="column.tips" #label>
        <span>
          {{ column.label }}
          <ElTooltip
            placement="bottom"
            effect="light"
            :content="column.tips"
            :raw-content="true"
          >
            <ElIcon style="vertical-align: -0.15em" size="16">
              <QuestionFilled />
            </ElIcon>
          </ElTooltip>
        </span>
      </template>

      <!-- 使用动态组件替换所有条件渲染 -->
      <component
        :is="getFormItemComponent(column.valueType)"
        v-if="column.valueType !== 'group' && column.valueType !== 'custom' && column.valueType !== 'formList'"
        v-model="itemData"
        :attrs="column.attrs"
        :value-enum="column.valueEnum"
      />
      <template v-else-if="column.valueType === 'group'">
        <ElDivider>{{ column?.attrs?.dividerTitle || '' }}</ElDivider>

        <template v-for="(groupColumn, index) in column.columns" :key="index">
          <ProFormItem
            v-model:column="column.columns![index]"
            v-model:item-data="formData[groupColumn.prop as string]"
            :form-props="formProps"
            :form-data="formData"
            :form-items="formItems"
          >
            <template v-if="groupColumn.valueType == 'custom'" #[groupColumn.slotName!]="scope">
              <slot :name="groupColumn.slotName ?? groupColumn.prop" :form-data="formData" v-bind="scope" :column="groupColumn" />
            </template>
            <template v-for="slot in groupColumn?.columns?.filter?.(i => i.valueType === 'custom')" :key="slot.slotName" #[slot.slotName]="scope">
              <slot :name="slot.slotName ?? slot.prop" :form-data="formData" v-bind="scope" :column="groupColumn" />
            </template>
          </ProFormItem>
        </template>
      </template>
      <template v-else-if="column.valueType === 'custom'">
        <slot
          :name="column.slotName ?? column.prop"
          :prop="column.prop"
          :attrs="column.attrs"
        />
      </template>
      <template v-if="typeof column.addonAfter === 'function'">
        <component :is="column.addonAfter" :close-drawer="closeDrawer" />
      </template>
      <template v-else-if="column.addonAfter === 'string'">
        <span>{{ column.addonAfter }}</span>
      </template>
    </ElFormItem>
  </template>
</template>

<style scoped lang="scss">
.pro-form-item {
  // element ui 中form-item form-item 会设置为0px，而formgrop的实现就是嵌套form-item，偶现element css优先级在pro-form-item上
  margin-bottom: 18px !important;
  vertical-align: baseline;

  // 用于撑开搜索表单
  :deep(.el-form-item__content) {
    width: 180px;
    gap: 0 10px;
  }

  .el-card {
    width: 100%;
  }
}
</style>
