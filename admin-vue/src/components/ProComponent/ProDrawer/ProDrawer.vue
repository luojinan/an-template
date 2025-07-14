<script setup lang="ts">
import { ElButton, ElDrawer } from 'element-plus'

withDefaults(defineProps<{
  drawerProps?: any
  showFooter?: boolean
}>(), {
  showFooter: true,
})

const emit = defineEmits(['handleSubmit'])
function onSubmit() {
  emit('handleSubmit')
}

const open = defineModel('open')

function handleCloseModal() {
  open.value = false
}
</script>

<template>
  <ElDrawer
    v-model="open"
    :append-to-body="true"
    v-bind="{
      size: '40%',
      ...drawerProps,
    }"
    :style="{
      'border-radius': '10px 0 0 10px',
    }"
    @close="handleCloseModal"
  >
    <slot />
    <template v-if="showFooter" #footer>
      <div>
        <ElButton type="primary" @click="onSubmit">
          确 定
        </ElButton>
        <ElButton @click="handleCloseModal">
          取 消
        </ElButton>
      </div>
    </template>
  </ElDrawer>
</template>
