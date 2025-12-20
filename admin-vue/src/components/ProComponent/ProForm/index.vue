<script setup lang="ts" generic="T extends IObject">
import type { DrawerProps, FormInstance } from 'element-plus'
import { reactive, ref, useId } from 'vue'
import { ElButton, ElDrawer, ElForm } from 'element-plus'
import type { IObject, ProFormColumn } from '../type'
import FormItem from './FormItem.vue'

defineOptions({
  name: 'ProForm',
})

// 定义接收的属性
const props = defineProps<{
  type?: 'drawer'
  columns: ProFormColumn<T>[]
  formProps?: InstanceType<typeof ElForm>['$props']
  drawerProps?: Partial<DrawerProps>
  unMountedValueType?: 'string' | 'undefined'
  onSubmit?: (formdata: T) => Promise<void>
}>()

const formRef = ref<FormInstance>()

const formItems = reactive(props.columns)
const formData = reactive<T>({})
const open = defineModel('open')

// 兼容 group表单配置
const allFormItems = computed<ProFormColumn[]>(() => {
  // 当formItems中的valueType是group，则取其columns，合并到整体的formItems中
  return formItems.reduce((acc, item) => {
    if (item.valueType === 'group') { acc.push(...item.columns) }

    else { acc.push(item) }

    return acc
  }, [])
})

// 改函数名限初始化用setInitFormData，初始化proform 数据，在formconfig初始化后使用调用，只初始化formconfig有的数据，其他丢弃
function setFormData(data: T) {
  resetFormData()
  setTimeout(() => {
    const res = data
    // 应循环formconfig，而不是循环formData，当formconfig由前端构建而不是从接口返回，此时希望仍触发formconfig的数据处理
    allFormItems.value.forEach((itemConfig) => {
      if (!itemConfig.prop) { return }
      const val = !res[itemConfig.prop] && typeof res[itemConfig.prop] !== 'number' ? itemConfig?.initialValue : res[itemConfig.prop]
      if (itemConfig?.convertValue) { formData[itemConfig.prop] = itemConfig.convertValue(val, data) }
      else { formData[itemConfig.prop] = val }
    })
  }, 0)
}

// 获取表单数据
async function getFormData(key?: string) {
  const monutedFormKeyList = allFormItems.value.filter(item => !item.unMounted).map(item => item.prop)
  if (key) { return monutedFormKeyList.includes(key) ? formData[key] : undefined }

  let res = {}
  for (const key in formData) {
    if (!monutedFormKeyList.includes(key)) {
      res[key] = props.unMountedValueType === 'undefined' ? undefined : '' // 课程相关传undefined 后端不会清除字段值，消息相关传空字符报错，改为组件外部决定unmountd的字段为什么值
    }
    else {
      const itemConfig = allFormItems.value.find(item => item.prop === key)
      if (itemConfig?.valueType === 'formList' && Array.isArray(formData[key])) {
        // 处理formList类型的数据
        res[key] = formData[key].map((item) => {
          const { _uid, ...rest } = item
          const transformedItem = { ...rest }
          // 遍历columns中的配置，处理每个字段的transform
          itemConfig.columns?.forEach((column) => {
            if (column.prop && column.transform && item[column.prop] !== undefined) {
              Object.assign(transformedItem, column.transform(item[column.prop], column))
            }
          })
          return transformedItem
        })
      }
      else if (itemConfig && itemConfig.transform) {
        res = {
          ...res,
          ...itemConfig.transform(formData[key], itemConfig),
        }
      }
      else {
        res[key] = formData[key]
      }
    }
  }

  return { ...res }
}
// 设置表单项值 允许强行设置数据(不遵从form配置)
function setFormItemData(key: string, value: any) {
  // console.log('setFormItemData', key, value)
  // initialValue 和 强行设置formList数据时 要设置uid
  const formConfig = allFormItems.value.find(item => item.prop === key) || {}
  if (formConfig.valueType === 'formList' && Array.isArray(value) && value.length > 0) {
    formData[key] = value.map(item => ({ _uid: useId(), ...item }))
    return
  }

  formData[key] = value
}

// elementui检验表单 并返回 transform后的数据
function validateForm(): Promise<T> {
  // FIXME: proform type !== drawer 时表单校验不通过
  return new Promise((resolve, reject) => {
    formRef?.value?.validate((valid, fields) => {
      if (valid) {
        getFormData().then((res) => {
          // console.log('after validate and use columnConfig transform data', res)
          // 过滤掉key中以_开头的字段
          const noInnerRes = Object.fromEntries(Object.entries(res).filter(([key]) => !key.startsWith('_')))
          resolve(noInnerRes as T)
        })
      }
      else { reject(fields) } // fields 是取到不通过校验的表单项
    })
  })
}

function resetFormData() {
  // for (const key in formData)
  // formData[key] = undefined // TODO: 设置初始值
  allFormItems.value.forEach((itemConfig) => {
    const val = itemConfig?.initialValue
    if (itemConfig?.convertValue) { formData[itemConfig.prop] = itemConfig.convertValue(val, {}) }
    else { formData[itemConfig.prop] = val }
  })
  setTimeout(() => {
    formRef.value?.clearValidate()
  }, 0)
}

function handleCloseModal() {
  open.value = false
}

const loading = ref(false)
async function handleSubmit() {
  loading.value = true
  try {
    const res = await validateForm()
    // emit 改为props参数，传递一个async函数进来，由子组件await执行
    await props.onSubmit(res)
  }
  catch (error) {}

  loading.value = false
}

// 设置loading状态
function setLoading(value: boolean) {
  loading.value = value
}

const slots = computed(() => {
  const customs = allFormItems.value.filter(item => item.valueType === 'custom' && item.slotName)
  const formListCustoms = allFormItems.value.filter(item => item.valueType === 'formList').reduce((acc, item) => {
    const list = item.columns.filter(item => item.valueType === 'custom' && item.slotName)
    return [...acc, ...list]
  }, [])
  return [...customs, ...formListCustoms]
})

// 暴露的属性和方法
defineExpose({ validateForm, getFormData, setFormData, setFormItemData, resetFormData, setLoading })
</script>

<template>
  <template v-if="type === 'drawer'">
    <ElDrawer
      v-model="open"
      class="proform-drawer"
      :append-to-body="true"
      :style="{
        'border-radius': '10px 0 0 10px',
      }"
      v-bind="{
        size: 450,
        ...drawerProps,
      }"
      @close="handleCloseModal"
    >
      <slot name="drawer-before-form" />
      <ElForm
        ref="formRef"
        v-loading="loading"
        label-width="auto"
        v-bind="formProps"
        :model="formData"
        scroll-to-error
      >
        <template v-for="(item, index) in formItems" :key="item.prop || item.key">
          <FormItem v-model:item-data="formData[item.prop]" v-model:column="formItems[index]" v-model:open="open" :form-props="formProps" :form-data="formData" :form-items="allFormItems">
            <template v-for="slot in slots" :key="slot.slotName" #[slot.slotName]="scope">
              <slot :name="slot.slotName ?? slot.prop" :form-data="formData" v-bind="scope" />
            </template>
          </FormItem>
        </template>
      </ElForm>
      <slot name="drawer-after-form" />

      <template #footer>
        <div>
          <ElButton @click="handleCloseModal">
            取 消
          </ElButton>
          <slot name="drawer-footer-btn" :form-data="formData" />
          <ElButton :disabled="formProps?.disabled" :loading="loading" type="primary" @click="handleSubmit">
            确 定
          </ElButton>
        </div>
      </template>
    </ElDrawer>
  </template>
  <template v-else>
    <ElForm
      ref="formRef"
      label-width="auto"
      v-bind="formProps"
      style="padding-right: var(--el-dialog-padding-primary)"
      :model="formData"
      class="baseForm"
    >
      <template v-for="(item, index) in formItems" :key="item.prop">
        <FormItem v-model:item-data="formData[item.prop]" v-model:column="formItems[index]" v-model:open="open" :form-props="formProps" :form-data="formData" :form-items="allFormItems">
          <template v-for="slot in slots" :key="slot.slotName" #[slot.slotName]="scope">
            <slot :name="slot.slotName ?? slot.prop" :form-data="formData" v-bind="scope" />
          </template>
        </FormItem>
      </template>
    </ElForm>
  </template>
</template>

<style lang="scss" scoped>
.baseForm{
  display: flex;
  flex-wrap: wrap;
}
</style>

<style lang="scss">
.proform-drawer{
  .el-drawer__header {
    margin-bottom: unset;

    .el-drawer__title {
      font-size: 18px;
      font-weight: bolder;
    }
  }
}
</style>
