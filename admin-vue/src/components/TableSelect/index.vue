<script lang="ts" setup>
import { ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { ElButton, ElIcon, ElInput, ElPopover } from 'element-plus'
import type { PopoverProps } from 'element-plus'

// 对象类型
export type IObject = Record<string, any>
// 定义接收的属性
export interface ISelectConfig {
  // 宽度
  width?: string
  // 占位符
  placeholder?: string
  // popover组件属性
  popover?: Partial<Omit<PopoverProps, 'visible' | 'v-model:visible'>>
  // 多选
  multiple?: boolean
}
const props = withDefaults(
  defineProps<{
    selectConfig: ISelectConfig
    text?: string
  }>(),
  {
    text: '',
  },
)

// 是否多选
const isMultiple = props.selectConfig.multiple === true
// 宽度
const width = props.selectConfig.width ?? '100%'
// 占位符
const placeholder = props.selectConfig.placeholder ?? '请选择'
// 是否显示弹出框
const popoverVisible = defineModel('popoverVisible')
// 计算popover的宽度
const tableSelectRef = ref()
const popoverWidth = ref(width)
useResizeObserver(tableSelectRef, (entries) => {
  // 没有指定width时跟随表单宽度
  if (width === '100%') { popoverWidth.value = `${entries[0].contentRect.width}px` }
})

// 列表操作
const tableRef = ref()
const selectedItems = defineModel<IObject[]>('selectedItems')

function onSelectChange(selection: any[]) {
  if (!isMultiple && selection.length > 1) {
    // 单选
    const item = selection[selection.length - 1]
    tableRef.value?.proTableCoreRef.clearSelection()
    nextTick(() => {
      tableRef.value?.proTableCoreRef.toggleRowSelection(item, true)
    })
  }
  selectedItems.value = selection
}

// 弹出框
const isInit = ref(false)
// 显示
function handleShow() {
  if (isInit.value === false) {
    isInit.value = true
    tableRef.value.fetchPageData()
  }
}
const popoverContentRef = ref()
</script>

<template>
  <div ref="tableSelectRef" class="w-full">
    <ElPopover
      :visible="popoverVisible"
      :width="popoverWidth"
      popper-class="max-h-4/5 overflow-y-auto"
      placement="left"
      v-bind="selectConfig.popover"
      @show="handleShow"
    >
      <template #reference>
        <!-- TODO: 点击其他地方时关闭 -->
        <div @click="popoverVisible = !popoverVisible">
          <slot>
            <ElInput
              class="reference"
              :model-value="text"
              :readonly="true"
              :placeholder="placeholder"
            >
              <template #suffix>
                <ElIcon
                  :style="{
                    transform: popoverVisible ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform .5s',
                  }"
                >
                  <ArrowDown />
                </ElIcon>
              </template>
            </ElInput>
          </slot>
        </div>
      </template>
      <!-- 弹出框内容 -->
      <div ref="popoverContentRef">
        <div class="feedback">
          <ElButton size="small" @click="popoverVisible = false">
            关 闭
          </ElButton>
        </div>
        <ProTable
          ref="tableRef"
          v-bind="$attrs"
          selection
          @selection-change="onSelectChange"
        />
      </div>
    </ElPopover>
  </div>
</template>

<style scoped lang="scss">
.reference :deep(.el-input__wrapper),
.reference :deep(.el-input__inner) {
  cursor: pointer;
}

.feedback {
  display: flex;
  justify-content: flex-end;
  margin-top: 6px;
}
// 隐藏全选按钮
.radio :deep(.el-table__header th.el-table__cell:nth-child(1) .el-checkbox) {
  visibility: hidden;
}
</style>
