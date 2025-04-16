<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import { ref } from 'vue'
import { BookingStatus, formColumns, statusMap, tableColumn } from './const'
import type { ProTableColumn } from '@/components/ProComponent'
import { ProForm, ProTable } from '@/components/ProComponent'
import { useCalendar } from '@/hooks/useCalendar'
import { deleteApiV1AdminCoursebookingSchedulesByscheduleid, postApiV1AdminCoursebookingApplycancellationBydetailid, postApiV1AdminCoursebookingApprovalcancelBydetailid, postApiV1AdminCoursebookingRejectcancelBydetailid, postApiV1AdminCoursebookingSchedules, postApiV1AdminCoursebookingSubmitBydetailid } from '@/proApi'
import type { CourseScheduleForm, IObject } from '@/proApi/apiTypes'
import { useUserStore } from '@/store'

const props = defineProps(['teacherId'])
const emits = defineEmits(['toOtherPage'])
const userStore = useUserStore()
const visible = ref(false)

const router = useRouter()

function toCourseDetail(id: string) {
  emits('toOtherPage')
  router.push({
    name: 'courseManage-courseCenter-list', // src/view 后的路径文件路径
    query: { id },
  })
}

function toStudentDetail(data: any) {
  emits('toOtherPage')
  router.push(`/consumer/detail/${data.studentId}`)
}

const tableCol: ProTableColumn[] = [
  {
    label: '课程',
    prop: 'courseName',
    width: 120,
    showOverflowTooltip: true,
    onClick: (row) => {
      toCourseDetail(row.courseId)
    },
  },
  ...tableColumn,
  {
    label: '操作',
    fixed: 'right',
    width: 80,
    valueType: 'tool',
    operat: (row) => {
      const { actions = [] } = getFinalStatusAndActions(row.status) || []
      return actions.map((item) => {
        return {
          name: item,
          text: item,
          onClick: () => changeStatu(item, row),
        }
      })
    },
  },
]

// TODO: 整合 use和组件关联， useCalendar 关联 popover + popover 的表单 + popover的表单的插槽表格，这些关联都要通过ref操作...

const { refCalendar, selectRef, formRef, currentEvent, calendarOptions, removeEvent, refetchEvents } = useCalendar(visible)

async function onConfirm() {
  const { end, start } = currentEvent.value
  const formres = await formRef.value.validateForm()
  console.log(formres)
  await postApiV1AdminCoursebookingSchedules({
    teacherId: props.teacherId || `${userStore.user.userId}`,
    schedules: [
      {
        startTime: +start,
        endTime: +end,
        courseId: formres?.courseId,
        type: formres?.courseType,
      },
    ] as CourseScheduleForm[],
  })
  refetchEvents(props.teacherId)
  closePopover()
  ElMessage.success('添加成功')
}

const tableRef = ref()
watch([currentEvent, visible], () => {
  if (visible.value) {
    nextTick(() => {
      tableRef.value?.fetchPageData()
    })
  }
})

async function getList() {
  return currentEvent.value.event?.extendedProps?.list
}

const fnMap = new Map<string, (params: any) => Promise<IObject>>([
  [`${BookingStatus.INIT}-取消预约`, deleteApiV1AdminCoursebookingSchedulesByscheduleid],
  [`${BookingStatus.BOOKED}-取消预约`, postApiV1AdminCoursebookingApplycancellationBydetailid],
  [`${BookingStatus.STUDENT_CANCEL_PENDING}-同意取消`, postApiV1AdminCoursebookingApprovalcancelBydetailid],
  [`${BookingStatus.STUDENT_CANCEL_PENDING}-拒绝取消`, postApiV1AdminCoursebookingRejectcancelBydetailid],
  [`${BookingStatus.BOOKED}-授课完成`, postApiV1AdminCoursebookingSubmitBydetailid],
  [`${BookingStatus.STUDENT_CANCEL_REJECTED}-授课完成`, postApiV1AdminCoursebookingSubmitBydetailid],
  [`${BookingStatus.TEACHER_CANCEL_REJECTED}-授课完成`, postApiV1AdminCoursebookingSubmitBydetailid],
])

function changeStatu(actionText: string, row: CourseScheduleForm & { status: string }) {
  fnMap.get(`${row.status}-${actionText}`)?.({ scheduleId: row.scheduleId, detailId: row.detailId }).then(() => {
    ElMessage.success('操作成功')
    refetchEvents(props.teacherId)
  })
}

function getFinalStatusAndActions(status: BookingStatus): { description: string, actions: string[] } {
  const statusFromBooking = statusMap.get(status) || { description: '未知状态', actions: [] }
  return statusFromBooking
}

function closePopover() {
  visible.value = false
  formRef.value?.resetFormData()
}

defineExpose({ refetchEvents, closePopover })
</script>

<template>
  <FullCalendar
    ref="refCalendar"
    :options="calendarOptions"
  >
    <template #eventContent="arg">
      <template v-if="arg.view.type === 'dayGridMonth'">
        <div class="bg-blue w-full">
          <b>{{ new Date(arg.event.start).toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit', hour12: false }) }}-{{ new Date(arg.event.end).toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit', hour12: false }) }}</b>
        </div>
      </template>
      <template v-else>
        <b>{{ arg.timeText }}111</b>
        <b style="display: block;">{{ arg.event.extendedProps.courseType === 'bigCourse' ? '大课' : '一对一' }}{{ arg.event.extendedProps.courseName && `(${arg.event.extendedProps.courseName})` }}</b>
      </template>
    </template>
  </FullCalendar>

  <el-popover
    :visible="visible"
    placement="right"
    popper-class="max-h-screen overflow-y-auto"
    :virtual-ref="selectRef"
    :width="500"
    :title="currentEvent?.handleType === 'add' ? '新增排课' : '排课详情'"
    virtual-triggering
    @after-leave="removeEvent('temp')"
  >
    <ProForm
      ref="formRef"
      style="display: block;"
      :columns="formColumns"
    >
      <template #table>
        <ProTable
          v-if="currentEvent?.handleType === 'detail'"
          ref="tableRef"
          :search="false"
          :pagination="false"
          :request="getList"
          :columns="tableCol"
        >
          <template #studentName="{ row }">
            <el-button v-for="(studentItem, index) in row.students" :key="index" link type="primary" @click="toStudentDetail(studentItem)">
              {{ studentItem.studentName }}
            </el-button>
          </template>
        </ProTable>
      </template>
    </ProForm>

    <el-icon :style="{ position: 'absolute', top: '20px', right: '10px', cursor: 'pointer' }" @click="closePopover()">
      <CloseBold />
    </el-icon>

    <div v-if="currentEvent?.handleType === 'add'" style=" margin: 0;text-align: right">
      <el-button size="small" text @click="closePopover()">
        取消
      </el-button>
      <el-button size="small" type="primary" @click="onConfirm">
        确定
      </el-button>
    </div>
  </el-popover>
</template>

<style lang="scss">
.fc {
  .bg-primary{
    background-color: var(--el-color-primary);
  }

  .bg-success{
    background-color: var(--el-color-success);
  }

  .bg-info{
    background-color: var(--el-color-info);
  }

  .bg-warning{
    background-color: var(--el-color-warning);
  }

  .bg-danger{
    background-color: var(--el-color-danger);
  }

  .big-primary{
    background-color: var(--el-color-primary-light-3);
  }

  .big-success{
    background-color: var(--el-color-success-light-3);
  }

  .big-info{
    background-color: var(--el-color-info-light-3);
  }

  .big-warning{
    background-color: var(--el-color-warning-light-3);
  }

  .big-danger{
    background-color: var(--el-color-danger-light-3);
  }
}
</style>
