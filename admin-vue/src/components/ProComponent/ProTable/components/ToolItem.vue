<script setup lang="ts">
import { ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { useUserStore } from '@/store'

interface Props {
  col: any
  scope: any
}

defineProps<Props>()

const emit = defineEmits<{
  handleOperat: [params: any]
}>()

const userStore = useUserStore()

function getOperatBtnList(col: any, rowData: any) {
  // hasPerms
  if (Array.isArray(col.operat[0].dropdownBtns)) {
    return col.operat[0].dropdownBtns.filter((btn: any) => userStore.hasPerms(btn.auths || []))
  }

  if (typeof col.operat[0].dropdownBtns === 'function') {
    return col.operat[0].dropdownBtns(rowData).filter((btn: any) => userStore.hasPerms(btn.auths || []))
  }

  return []
}
</script>

<template>
  <template v-if="getOperatBtnList(col, scope.row).length">
    <ElDropdown>
      <div class="text-primary hover:text-primary-light cursor-pointer text-xs inline-flex items-center">
        更多
        <ElIcon class="el-icon--right">
          <ArrowDown />
        </ElIcon>
      </div>
      <template #dropdown>
        <!-- 下拉操作按钮 -->
        <ElDropdownMenu>
          <ElDropdownItem
            v-for="dropdownBtn in getOperatBtnList(col, scope.row)"
            :key="dropdownBtn.name"
            @click="
              emit('handleOperat', {
                name: dropdownBtn.name,
                onClick: dropdownBtn.onClick,
                row: scope.row,
                column: scope.column,
                $index: scope.$index,
              })
            "
          >
            {{ dropdownBtn.text }}
          </ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </template>
  <span v-else>-</span>
</template> 