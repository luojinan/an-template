<script setup lang="ts">
import type { ValueEnum } from '../type'
import { useUserStore } from '@/store'

defineProps({
  col: {
    type: Object,
    default: () => ({}),
  },
  tableProps: {
    type: Object,
    default: () => ({}),
  },
})

defineEmits(['handleOperat'])

const userStore = useUserStore()

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

function getOperatBtnList(col, rowData) {
  // hasPerms
  if (Array.isArray(col.operat[0].dropdownBtns)) {
    return col.operat[0].dropdownBtns.filter(btn => userStore.hasPerms(btn.auths || []))
  }

  if (typeof col.operat[0].dropdownBtns === 'function') {
    return col.operat[0].dropdownBtns(rowData).filter(btn => userStore.hasPerms(btn.auths || []))
  }

  return []
}
</script>

<template>
  <el-table-column v-if="col.show" v-bind="col">
    <template #default="scope">
      <!-- 表格项value 文本展示 -->
      <template v-if="!col.formatFn && !['custom', 'tool'].includes(`${col.valueType}`) && (!scope.row[col.prop] && typeof scope.row[col.prop] !== 'number')">
        {{ tableProps?.emptyText ?? '-' }}
      </template>
      <!-- 表格项有点击事件 文本展示 -->
      <template v-else-if="!['custom', 'image', 'tool'].includes(`${col.valueType}`) && col.onClick">
        <a style="color: #409efc;" @click="col.onClick(scope.row)">
          {{ col.formatFn ? col.formatFn(scope.row[col.prop], scope.row) : scope.row[col.prop] }}
        </a>
      </template>
      <!-- 表格项value 文本展示 -->
      <template v-else-if="!['custom', 'image', 'tool'].includes(`${col.valueType}`) && col.formatFn">
        {{ col.formatFn(scope.row[col.prop], scope.row) }}
      </template>
      <!-- 显示图片 -->
      <template v-else-if="col.valueType === 'image'">
        <template v-if="col.prop">
          <template v-if="Array.isArray(scope.row[col.prop])">
            <template
              v-for="(item, index) in scope.row[col.prop]"
              :key="item"
            >
              <el-image
                :src="`${item}?x-oss-process=image/format,webp/resize,w_120`"
                :preview-src-list="scope.row[col.prop]"
                :initial-index="index"
                hide-on-click-modal
                :preview-teleported="true"
                :style="`width: ${col.imageWidth ?? 40}px; height: ${col.imageHeight ?? 40}px`"
              />
            </template>
          </template>
          <template v-else>
            <el-image
              :src="`${scope.row[col.prop]}?x-oss-process=image/format,webp/resize,w_80`"
              :preview-src-list="[scope.row[col.prop]]"
              hide-on-click-modal
              :preview-teleported="true"
              :style="`width: ${col.imageWidth ?? 40}px; height: ${col.imageHeight ?? 40}px`"
            />
          </template>
        </template>
      </template>
      <!-- 根据行的selectList属性返回对应列表值 -->
      <template v-else-if="col.valueType === 'select'">
        <template v-if="col.prop">
          <template v-if="getValueByMap(col.valueEnum, scope.row[col.prop]).some(item => !!item.tagType)">
            <el-tag v-for="tag in getValueByMap(col.valueEnum, scope.row[col.prop])" :key="tag.value" :type="tag.tagType">
              {{ tag.label }}
            </el-tag>
          </template>
          <span v-else>{{ getValueByMap(col.valueEnum, scope.row[col.prop]).map(item => item.label).join(',') }}</span>
        </template>
      </template>
      <!-- 列操作栏 -->
      <template v-else-if="col.valueType === 'tool'">
        <!-- 处理 col.operat为函数的场景 -->
        <template v-if="(getOperatBtnList(col, scope.row).length)">
          <el-dropdown>
            <div class="text-primary hover:text-primary-light cursor-pointer text-xs inline-flex items-center">
              更多
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </div>
            <template #dropdown>
              <!-- 下拉操作按钮 -->
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="dropdownBtn in getOperatBtnList(col, scope.row)"
                  :key="dropdownBtn.name"
                  @click="
                    $emit('handleOperat', {
                      name: dropdownBtn.name,
                      onClick: dropdownBtn.onClick,
                      row: scope.row,
                      column: scope.column,
                      $index: scope.$index,
                    })
                  "
                >
                  {{ dropdownBtn.text }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <span v-else>-</span>
      </template>
      <!-- 自定义 -->
      <template v-else-if="col.valueType === 'custom'">
        <slot
          :name="col.slotName ?? col.prop"
          :prop="col.prop"
          v-bind="scope"
        />
      </template>
    </template>
  </el-table-column>
</template>
