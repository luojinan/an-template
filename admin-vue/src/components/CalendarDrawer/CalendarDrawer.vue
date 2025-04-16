<script setup lang="ts">
import CalendarCore from './CalendarCore.vue'

const props = defineProps(['teacherId'])
const open = defineModel<boolean>('open')

const calendarCore = ref()

function onClose() {
  calendarCore.value.closePopover()
}

watch(
  () => open.value,
  async (val) => {
    await nextTick()
    val && calendarCore.value.refetchEvents(props.teacherId)
  },
)
</script>

<template>
  <el-drawer
    v-model="open"
    :append-to-body="true"
    size="60%"
    @close="onClose"
  >
    <CalendarCore ref="calendarCore" :teacher-id="teacherId" @to-other-page="open = false" />
  </el-drawer>
</template>
