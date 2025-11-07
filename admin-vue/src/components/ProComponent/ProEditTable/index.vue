<script setup lang="ts" generic="T extends IObject">
import { nextTick, ref } from 'vue'
import { ElButton, ElTable, ElTableColumn } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'
import type { IObject, ProTableColumn } from '../type'
import { formItemComponentMap } from '../ProForm/components'
import type { FormItemComponentType } from '../ProForm/components'

defineOptions({ name: 'ProEditTable' })

const { columns, addText = '新增一行', tableProps } = defineProps<{
  columns: ProTableColumn<T>[]
  addText?: string
  tableProps?: any
}>()

// 使用 defineModel 简化 v-model 绑定
const model = defineModel<T[]>({ default: [] })

// 每个单元格的编辑显示状态，true: 显示文本，false: 显示编辑器
const cellShowState = ref<Record<string, Record<string, boolean>>>({})

// 记录每个处于编辑状态的单元格对应的组件实例，用于聚焦
const editCellRefs = ref<Record<string, any>>({})

function makeCellKey(rowIndex: string, prop: string) {
  return `${rowIndex}__${prop}`
}

function setEditRef(rowIndex: string, prop: string, el: any) {
  editCellRefs.value[makeCellKey(rowIndex, prop)] = el
}

function ensureRowState(rowIndex: string) {
  if (!cellShowState.value[rowIndex]) {
    const state: Record<string, boolean> = {}
    columns.forEach((c) => {
      if (c.prop) { state[String(c.prop)] = true }
    })
    cellShowState.value[rowIndex] = state
  }
}

function editCell(rowIndex: string, prop: string) {
  ensureRowState(rowIndex)
  cellShowState.value[rowIndex][prop] = false
  // 等待编辑组件渲染后尝试聚焦
  nextTick(() => {
    const refInst = editCellRefs.value[makeCellKey(rowIndex, prop)]
    // 优先调用组件的 focus 方法（Element Plus 组件普遍支持）
    if (refInst && typeof refInst.focus === 'function') {
      try { refInst.focus() }
      catch {}
      return
    }
    // 尝试聚焦到内部可聚焦的原生元素
    const el = (refInst && (refInst.$el || refInst)) as HTMLElement | undefined
    if (el) {
      const inputEl = el.querySelector?.('input, textarea, [tabindex], .el-input__inner, .el-select__input') as HTMLElement | null
      inputEl?.focus()
    }
  })
}

function endEdit(rowIndex: string, prop: string, row: T) {
  ensureRowState(rowIndex)
  cellShowState.value[rowIndex][prop] = true
}

function addRow() {
  const newRow = {} as T
  columns.forEach((c) => {
    if (!c.prop) {
      return
    }
    // 简单初始化为空字符，数字列可按需自行处理
    newRow[c.prop] = c.valueType === 'input-number' ? 0 : '' as any
  })
  model.value.push(newRow)
  nextTick(() => {
    const rk = `idx_${model.value.length - 1}`
    ensureRowState(rk)
  })
}

function getDisplayValue(col: ProTableColumn<T>, row: T) {
  const prop = col.prop as keyof T
  const raw = prop ? row[prop] : undefined
  if (col.formatFn && prop) { return col.formatFn(raw, row) }
  return raw || '-'
}

function getFormItemComponent(valueType: any) {
  return formItemComponentMap[valueType as FormItemComponentType] ?? formItemComponentMap.input
}

function buildEditAttrs(col: ProTableColumn<T>, rowIndex: string, prop: string, row: T) {
  const base: any = col.attrs ?? {}
  const onBlurBase = base.onBlur
  return {
    ...base,
    // 进入编辑时自动聚焦，确保 blur 能正常触发以退出编辑
    autofocus: true,
    onBlur: (e: any) => {
      onBlurBase?.(e)
      endEdit(rowIndex, prop, row)
    },
    clearable: false,
    style: { width: '100%', height: '100px', ...(base.style || {}) },
    size: base.size ?? 'small',
  }
}
</script>

<template>
  <div>
    <ElTable :data="model" style="width: 100%; margin-top: 16px;" v-bind="tableProps">
      <ElTableColumn
        v-for="col in columns"
        :key="String(col.prop ?? col.label)"
        :prop="(col.prop as string)"
        :label="col.label"
      >
        <template #default="{ row, $index }">
          <template v-if="col.prop">
            <!-- 显示状态 -->
            <span
              v-if="cellShowState[`idx_${$index}`]?.[String(col.prop)] !== false"
              @dblclick="editCell(`idx_${$index}`, String(col.prop))"
            >
              <!-- 支持 custom 类型的显示插槽 -->
              <template v-if="col.valueType === 'custom' && col.slotName">
                <slot
                  :name="col.slotName"
                  v-bind="{ row, $index, prop: col.prop, editMode: false, startEdit: () => editCell(`idx_${$index}`, String(col.prop)), endEdit: () => endEdit(`idx_${$index}`, String(col.prop), row) }"
                />
              </template>
              <template v-else>
                {{ getDisplayValue(col, row) }}
                <ElIcon
                  size="16px"
                  style="cursor: pointer; color: var(--el-color-primary); display: inline-block;"
                  @click.stop="editCell(`idx_${$index}`, String(col.prop))"
                >
                  <Edit />
                </ElIcon>
              </template>
            </span>
            <!-- 编辑状态 -->
            <template v-else>
              <!-- 支持 custom 类型的编辑插槽 -->
              <template v-if="col.valueType === 'custom' && col.slotName">
                <slot
                  :name="`${col.slotName}-edit`"
                  v-bind="{ row, $index, prop: col.prop, editMode: true, startEdit: () => editCell(`idx_${$index}`, String(col.prop)), endEdit: () => endEdit(`idx_${$index}`, String(col.prop), row) }"
                >
                  <!-- 如果没有提供编辑插槽，则回退到默认编辑器 -->
                  <component
                    :is="getFormItemComponent(col.valueType)"
                    :ref="(el: any) => setEditRef(`idx_${$index}`, String(col.prop), el)"
                    v-model="(row as any)[col.prop as string]"
                    :value-enum="col.valueEnum"
                    :attrs="buildEditAttrs(col, `idx_${$index}`, String(col.prop), row)"
                  />
                </slot>
              </template>
              <template v-else>
                <component
                  :is="getFormItemComponent(col.valueType)"
                  :ref="(el: any) => setEditRef(`idx_${$index}`, String(col.prop), el)"
                  v-model="(row as any)[col.prop as string]"
                  :value-enum="col.valueEnum"
                  :attrs="buildEditAttrs(col, `idx_${$index}`, String(col.prop), row)"
                />
              </template>
            </template>
          </template>
        </template>
      </ElTableColumn>
    </ElTable>

    <ElButton type="default" plain style="width: 100%;" @click="addRow">
      {{ addText }}
    </ElButton>
  </div>
</template>
