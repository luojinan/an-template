<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import momentZone from 'moment-timezone'
import { nextTick, ref, watch } from 'vue'
import { adminFormColumns, isInstitutionFormColumns, userStore } from './const'
import { useCalendar, usePredefineColors } from './useCalendar'
import { getAdminCustByid } from '@/utils/proProApi/admin'
import { deleteAdminStudentbookingByid, postAdminStudentbooking, postAdminStudentbookingEdit } from '@/proApi'
import { ProForm } from '@/components/ProComponent'

const props = defineProps(['studentId', 'timeName'])
const visible = ref(false)

// TODO: 整合 use和组件关联， useCalendar 关联 popover + popover 的表单 + popover的表单的插槽表格，这些关联都要通过ref操作...

const { refCalendar, selectRef, formRef, currentEvent, calendarOptions, setOption, removeEvent, refetchEvents, changeType } = useCalendar(visible)

// 拖拽常用课程填写信息后触发新增、常规拖拽日历填写信息触发新增、点击历史事件填写信息触发修改
async function onConfirm() {
  const { handleType, currentEvent, time, ...formres } = await formRef.value.validateForm()
  const courseId = formres.courseId || formres.selectOrderCourseID
  let timeParams = {}
  const selectedDate = currentEvent.start || currentEvent.event.start

  // Get timezone from calendar
  const calendarTimezone = refCalendar.value.getApi().getOption('timeZone') || 'local'

  if (time && selectedDate) {
    const startYear = selectedDate.getFullYear()
    const startMonth = selectedDate.getMonth()
    const startDay = selectedDate.getDate()

    // Create base date string
    const baseDateStr = `${startYear}-${String(startMonth + 1).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`

    // Parse times with timezone
    const [customerStart, customerEnd] = time
    const tz = calendarTimezone === 'local' ? 'Asia/Shanghai' : calendarTimezone
    const startDateTime = momentZone.tz(`${baseDateStr} ${customerStart}`, tz)
    const endDateTime = momentZone.tz(`${baseDateStr} ${customerEnd}`, tz)

    timeParams = {
      startTime: startDateTime.valueOf(),
      endTime: endDateTime.valueOf(),
    }
  }

  const { end, start } = currentEvent
  if (handleType === 'detail') {
    await postAdminStudentbookingEdit({
      studentId: props.studentId,
      courseId,
      ...formres,
      ...timeParams,
    })
  }
  else {
    await postAdminStudentbooking({
      startTime: timeParams.startTime || +start,
      endTime: timeParams.endTime || +end,
      courseId,
      ...formres,
      studentId: props.studentId,
    })
  }
  refetchEvents(props.studentId)
  closePopover()
  ElMessage.success(`${handleType === 'detail' ? '修改' : '添加'}成功`)
}
async function onDelect() {
  await ElMessageBox.confirm('确认删除吗?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  const id = await formRef.value.getFormData('id')
  await deleteAdminStudentbookingByid({ id })
  refetchEvents(props.studentId)
  ElMessage.success('操作成功')
}

const tableRef = ref()
watch([currentEvent, visible], () => {
  if (visible.value) {
    nextTick(() => {
      tableRef.value?.fetchPageData()
    })
  }
})

watch(() => props.studentId, async (val) => {
  await nextTick()
  // 使用document找到class为fc-toolbar-title的dom节点的父节点
  const titleNode = document.getElementsByClassName('fc-toolbar-title')[0]
  const parentNode = titleNode?.parentNode

  if (parentNode) {
    const res = await getAdminCustByid({ id: props.studentId })
    titleNode.style.display = 'inline-block'
    titleNode.style.marginLeft = '5px'
    titleNode.style.fontSize = '1.15em'

    // 查找已存在的h1标签
    const existingH1 = document.getElementById('calendar-title')
    if (existingH1) {
      // 如果已存在，则更新其内容
      existingH1.textContent = `${res.nickname}:(${props.timeName})`
    }
    else {
      // 如果不存在，则创建一个新的h1标签并插入该父节点
      const div = document.createElement('b')
      div.id = 'calendar-title' // 设置唯一的ID
      div.textContent = `${res.nickname}:(${props.timeName})`
      div.style.display = 'inline-block'
      div.style.fontSize = '1.15em'

      parentNode.insertBefore(div, parentNode.firstChild)
    }
  }
}, {
  immediate: true,
})

async function updateTime(name) {
  const titleNode = document.getElementsByClassName('fc-toolbar-title')[0]
  const parentNode = titleNode?.parentNode

  if (parentNode) {
    const res = await getAdminCustByid({ id: props.studentId })
    titleNode.style.display = 'inline-block'
    titleNode.style.marginLeft = '5px'
    titleNode.style.fontSize = '1.15em'

    // 查找已存在的h1标签
    const existingH1 = document.getElementById('calendar-title')
    if (existingH1) {
      // 如果已存在，则更新其内容
      existingH1.textContent = `${res.nickname}:(${name})`
    }
    else {
      // 如果不存在，则创建一个新的h1标签并插入该父节点
      const div = document.createElement('b')
      div.id = 'calendar-title' // 设置唯一的ID
      div.textContent = `${res.nickname}:(${name})`
      div.style.display = 'inline-block'
      div.style.fontSize = '1.15em'

      parentNode.insertBefore(div, parentNode.firstChild)
    }
  }
}

function closePopover() {
  visible.value = false
  formRef.value?.resetFormData()
}

const formColumns = userStore.user.dept.isInstitution ? isInstitutionFormColumns : adminFormColumns.filter(x => x.label !== '学生类型')

function getEventBackgroundColor(extendedProps: any) {
  let color = '#3788d8'
  // 判断机构权限 无法点击其他机构数据 用'{}'判断是否新增操作
  if (JSON.stringify(extendedProps) !== '{}' && userStore.user.dept.isInstitution && (extendedProps.institutionId != userStore.user.dept.id || !extendedProps.courseId)) { color = '#ccc' }
  else { color = extendedProps.background }

  return {
    background: color,
    padding: '4px',
    width: '100%',
    color: 'white',
  }
}

function getEventName(extendedProps: any) {
  let name = extendedProps.selectedCourseName || extendedProps.courseName
  // 判断机构权限 无法查看信息
  if (userStore.user.dept.isInstitution && extendedProps.institutionId != userStore.user.dept.id) { name = '已被占用' }
  else if (userStore.user.dept.isInstitution && !extendedProps.courseId) { name = '已被占用' }

  return name
}
function formData(zone: string, startTime: string | number | Date, endTime: string | number | Date) {
  let str = ''
  if (!zone || zone === 'local') {
    str = `${new Date(startTime).toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit', hour12: false })}-${new Date(endTime).toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit', hour12: false })}`
  }
  else {
    momentZone.tz(new Date(startTime), zone).format('HH:mm')
    str = `${momentZone.tz(new Date(startTime), zone).format('HH:mm')}-${momentZone.tz(new Date(endTime), zone).format('HH:mm')}`
  }
  return str
}

const { colors } = usePredefineColors()

defineExpose({ refetchEvents, closePopover, setOption, updateTime })
</script>

<template>
  <FullCalendar
    ref="refCalendar"
    :options="calendarOptions"
  >
    <template #eventContent="arg">
      <template v-if="arg.view.type === 'dayGridMonth'">
        <div class="w-full" :style="getEventBackgroundColor(arg.event.extendedProps)">
          <b>{{ formData(arg.view.dateEnv.timeZone, arg.event.start, arg.event.end) }}</b>
          <b style="display: block;white-space: break-spaces;">{{ getEventName(arg.event.extendedProps) }}</b>
        </div>
      </template>
      <!-- <el-tooltip
      v-else-if="arg.view.type === 'dayGridWeek'"
        class="box-item"
        effect="dark"
        :content="`${new Date(arg.event.start).toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit', hour12: false })}-${new Date(arg.event.end).toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit', hour12: false })}(${getEventName(arg.event.extendedProps)})`"
        placement="top-start"
      > -->
      <div v-else-if="arg.view.type === 'dayGridWeek'" class="h-full overflow-hidden" :style="getEventBackgroundColor(arg.event.extendedProps)">
        <!-- <b style="display: block;white-space: break-spaces;">{{ arg.view.dateEnv.timeZone }}</b> -->
        <!-- <b  v-if="arg.view.dateEnv.timeZone=='UTC'">{{dayjs(new Date(arg.event.start).toUTCString('default', { hour: '2-digit', minute: '2-digit', hour12: false })).format('HH:mm:ss')}}-{{ new Date(arg.event.end).toUTCString('default', { hour: '2-digit', minute: '2-digit', hour12: false }) }}</b> -->
        <!-- <b >{{ new Date(arg.event.start).toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit', hour12: false })}}-{{ new Date(arg.event.end).toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit', hour12: false }) }}</b> -->
        <b>{{ formData(arg.view.dateEnv.timeZone, arg.event.start, arg.event.end) }}</b>
        <b style="display: block;white-space: break-spaces;">{{ getEventName(arg.event.extendedProps) }}</b>
      </div>
      <!-- </el-tooltip> -->
      <el-tooltip
        v-else
        class="box-item"
        effect="dark"
        :content="arg.timeText ? `${formData(arg.view.dateEnv.timeZone, arg.event.start, arg.event.end)}(${getEventName(arg.event.extendedProps)})` : ''"
        placement="top-start"
      >
        <div class="h-full overflow-hidden" :style="getEventBackgroundColor(arg.event.extendedProps)">
          <b>{{ formData(arg.view.dateEnv.timeZone, arg.event.start, arg.event.end) }}</b>
          <!-- <b>{{ new Date(arg.event.start).toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit', hour12: false }) }}-{{ new Date(arg.event.end).toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit', hour12: false }) }}</b> -->
          <b style="display: block;white-space: break-spaces;">{{ getEventName(arg.event.extendedProps) }}</b>
        </div>
      </el-tooltip>
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
      :columns="[
        ...formColumns,
        {
          prop: 'time',
          label: '自定义时间段',
          tips: '填写后将以填写的时间段为准',
          valueType: 'time-picker',
          attrs: {
            isRange: true,
            rangeSeparator: '至',
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间',
            format: 'HH:mm',
            valueFormat: 'HH:mm:00',
          },
        },
      ]"
    >
      <template #colorPicker="scope">
        <el-color-picker :model-value="scope.formData[scope.prop]" :predefine="colors" @active-change="(v) => scope.formData[scope.prop] = v" />
      </template>
    </ProForm>

    <el-icon :style="{ position: 'absolute', top: '20px', right: '10px', cursor: 'pointer' }" @click="closePopover()">
      <CloseBold />
    </el-icon>

    <div style=" margin: 0;text-align: right">
      <el-button size="small" text @click="closePopover()">
        取消
      </el-button>
      <el-button v-if="currentEvent?.handleType === 'detail'" size="small" type="danger" @click="onDelect">
        删除
      </el-button>
      <el-button size="small" type="primary" @click="onConfirm">
        确定
      </el-button>
    </div>
  </el-popover>
</template>

<style lang="scss">
.fc {
  .fc-event-main {
    padding: 0;
  }
  .fc-dayGridDay-view{
    width: 40%;
    margin: 0 auto;
  }
}

.el-color-dropdown__btns {
  button {
    display: none;
  }
}
</style>

<style lang="scss" scoped>
 ::v-deep{
  .fc-toolbar{
    &-chunk{
      &:nth-of-type(2){
       width: auto;
        margin: 0 auto;
        white-space: nowrap;
        position: absolute;
        left:50%;
        transform: translateX(-50%);
      }
    }
  }
 }
</style>
