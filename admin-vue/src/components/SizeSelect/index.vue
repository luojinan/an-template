<script setup lang="ts">
import { ElDropdown, ElDropdownItem, ElDropdownMenu, ElMessage } from 'element-plus'
import { SizeEnum } from '@/enums/SizeEnum'
import { useAppStore } from '@/store/modules/app'

const sizeOptions = computed(() => {
  return [
    { label: 'sizeSelect.default', value: SizeEnum.DEFAULT },
    { label: 'sizeSelect.large', value: SizeEnum.LARGE },
    { label: 'sizeSelect.small', value: SizeEnum.SMALL },
  ]
})

const appStore = useAppStore()
function handleSizeChange(size: string) {
  appStore.changeSize(size)
  ElMessage.success('sizeSelect.message.success')
}
</script>

<template>
  <ElDropdown trigger="click" @command="handleSizeChange">
    <div>
      <div class="i-svg:size" />
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem
          v-for="item of sizeOptions" :key="item.value" :disabled="appStore.size == item.value"
          :command="item.value"
        >
          {{ item.label }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
