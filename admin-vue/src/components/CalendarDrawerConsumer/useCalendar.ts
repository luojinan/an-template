import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import type { CalendarApi, CalendarOptions, EventSourceFunc } from '@fullcalendar/core'
import type { Ref } from 'vue'
import { ref, watch } from 'vue'
import { userStore } from './const'
import { getAdminStudentbookingList } from '@/proApi'
import {
  useSettingsStore
} from '@/store'
import { getApiV1DictBytypecodeOptions, postAdminStudentbookingEdit } from '@/utils/proProApi/admin'
import type { StudentBookingForm } from '@/utils/proProApi/apiTypes'
import { g, an } from '@fullcalendar/core/internal-common'
const settingStore = useSettingsStore()
function addFifteenMinutesdate(dateStr: string) {
  const date = new Date(dateStr)
  date.setMinutes(date.getMinutes() + 30)
  return date
}

export function useCalendar(showDialog: Ref<boolean>) {
  const refCalendar = ref()
  const selectRef = ref()
  const currentEvent = ref()
  const loading = ref(false)
  const formRef = ref()

  const studentId = ref('')
  const orderId = ref('')

  const calendarApi = ref<null | CalendarApi>(null)

  const removeEventInCalendar = (eventId: string) => {
    const _event = calendarApi.value?.getEventById(eventId)
    if (_event)
      _event.remove()
  }
  const setOption = (type: any,v: g | an | null | undefined) => {
    calendarApi.value?.setOption(type, v)
  }
  const refetchEvents = (id?: string, order?: string) => {
    studentId.value = id || ''
    orderId.value = order || ''
    calendarApi.value?.refetchEvents()
  }

  const removeEvent = (eventId: string) => {
    showDialog.value = false // set false and remove temp
    removeEventInCalendar(eventId)
  }
  const dateSet = (v: any) => {
    settingStore.isShow = v.view.type
    nextTick(() => {
      document.getElementsByClassName('fc-dayGridWeek-button')[0].innerHTML = '周排表'
      document.getElementsByClassName('fc-dayGridWeek-button')[0].title='周排表'
    })
  }

  const fetchEvents: EventSourceFunc = (info, successCallback) => {
    // 根据日历开始结束获取数据
    if (!info)
      return
    removeEvent('temp')
    getAdminStudentbookingList({ studentId: studentId?.value, startTime: +info.start, endTime: +info.end }).then((r) => {
      if (!r) {
        // 必须要添加一个？设置空数组不渲染内容
        successCallback([
          {
            id: '1',
            start: +new Date(2024, 6, 29, 12),
            end: +new Date(2024, 6, 29, 20),
            type: 'Family',
          },
        ])
        return
      }
      settingStore.setList(r)
      const res = r.map(({ startTime, endTime, ...item }) => {
        return {
          start: startTime,
          end: endTime,
          ...item,
        }
      })
      successCallback(res)
    })
  }

  function handleDateSelect(selectInfo: any) {
    if (selectInfo.view.type !== 'timeGridWeek')
      return

    removeEvent('temp')
    showDialog.value = false // set false and remove temp

    formRef.value?.resetFormData()
    // selectRef.value = selectInfo.jsEvent.srcElement // 选择有2个阶段，这个是dom会自动消失，不适合作悬浮窗的标准
    currentEvent.value = { ...selectInfo, handleType: 'add' }
    formRef.value?.setFormData({
      handleType: 'add',
      currentEvent: unref(currentEvent),
      studentId: studentId.value || '',
      orderId: orderId.value || '',
    })

    const calendarApi = selectInfo.view.calendar

    // calendarApi.unselect()

    // 新增临时时间段，否则操作悬浮表单会消失时间块
    calendarApi.addEvent({
      id: 'temp',
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
      className: 'undone',
    })

    selectRef.value = document.querySelector('.undone')
    showDialog.value = true
  }
  function handleEventClick(clickInfo: any) {
    if (clickInfo.event.id === 'temp')
      return
    // clickInfo.event.remove()
    // 判断机构权限 无法点击其他机构数据
    if (userStore.user.dept.isInstitution && (clickInfo.event.extendedProps.institutionId != userStore.user.dept.id || !clickInfo.event.extendedProps.courseId))
      return

    formRef.value?.resetFormData()
    nextTick(() => {
      selectRef.value = clickInfo.el
      currentEvent.value = { ...clickInfo, handleType: 'detail' }

      formRef.value?.setFormData({
        handleType: 'detail',
        // courseType: currentEvent.value.event.extendedProps.courseType,
        currentEvent: unref(currentEvent),
        studentId: studentId.value || '',
        orderId: orderId.value || '',
        id: currentEvent.value.event.id,
        ...currentEvent.value.event.extendedProps,
      })
      showDialog.value = true
      removeEventInCalendar('temp')
    })
  }
  // function handleEvents(events,view) {


  //   console.log('点击事件块', view)
  // }
  function handleClick(v: any) {
    console.log(v);
  }

  const calendarOptions = {
    height: '100%',
    firstDay: 1,
    plugins: [
      dayGridPlugin,
      timeGridPlugin,
      interactionPlugin, // needed for dateClick
      momentTimezonePlugin
    ],
    timeZone:'local',
    headerToolbar: {
      right: 'prev,next',
      center: 'title',
      left: 'timeGridWeek,dayGridMonth,dayGridWeek,dayGridDay',
    },
    buttonText:{
      week:'排课',
      month:"月排表",
      day:'日排表'
    },
    dayMaxEvents: true,
    navLinkDayClick(date, jsEvent) {
        console.log(date);

    },
    initialView: 'timeGridWeek',
    slotDuration: '00:30:00', // 设置每个时间格子的持续时间为5分钟
    slotLabelInterval: '01:00:00',

    events: fetchEvents,
    datesSet: dateSet, //lqy 获取选择的类型
    loading: val => loading.value = val,

    editable: true, // 开启拖拽修改
    // droppable: true,
    navLinks: true,
    eventOverlap: false, // 不可重叠，外部拖拽不受控制仍然可以重叠
    // eventBorderColor: 'unset', // 黑色 transparent-蓝色

    allDaySlot: false,
    selectable: true,
    locale: 'zh-cn',
    eventClassNames({ event }) {
      return []
    },
    select: handleDateSelect,
    drop: (selectInfo) => {
      console.log('drop', selectInfo)
      if (selectInfo.view.type !== 'timeGridWeek') {
        ElMessage.warning('请在周视图中放置常用课程')
        return
      }

      const calendarApi = selectInfo.view.calendar
      const list = calendarApi.getEvents()

      // 计算拖拽产生的结束时间
      const endDate = addFifteenMinutesdate(selectInfo.dateStr)

      // 检查目标时间是否有事件
      const eventsAtDropTime = list.filter(event =>
        (selectInfo.date >= event.start && selectInfo.date < event.end)
        || (endDate > event.start && endDate <= event.end),
      )

      if (eventsAtDropTime.length > 0) {
        ElMessage.warning('该时间段已有课程')
        return
      }

      removeEvent('temp')
      showDialog.value = false // set false and remove temp
      formRef.value?.resetFormData()

      currentEvent.value = {
        end: endDate,
        start: selectInfo.date,
        handleType: 'add',
      }
      formRef.value?.setFormData({
        handleType: 'add',
        currentEvent: unref(currentEvent),
        studentId: studentId.value || '',
        orderId: orderId.value || '',
        ...(JSON.parse(selectInfo?.draggedEl?.dataset?.eventdata || '{}')),
      })

      // 新增临时时间段，否则操作悬浮表单会消失时间块
      calendarApi.addEvent({
        id: 'temp',
        start: selectInfo.dateStr,
        end: endDate.toISOString(),
        allDay: selectInfo.allDay,
        className: 'undone',
        ...(JSON.parse(selectInfo?.draggedEl?.dataset?.eventdata || '{}')),
      })

      selectRef.value = document.querySelector('.undone')
      showDialog.value = true
    },
    eventChange: async (arg) => {
      console.log('------eventChange', arg)
      // 编辑已保存的时间块
      if (arg.event.id !== 'temp') {
        const extendedProps = arg.event.extendedProps
        const params: StudentBookingForm = {
          ...extendedProps,
          startTime: +arg.event.start!,
          endTime: +arg.event.end!,
          id: arg.event.id,
        }
        await postAdminStudentbookingEdit(params)
        ElMessage.success('修改成功')
        refetchEvents(extendedProps.studentId)
        return
      }

      // 拖拽新增的临时事件块
      currentEvent.value = {
        end: arg.event.end,
        start: arg.event.start,
        handleType: 'add',
      }
      formRef.value?.setFormItemData('currentEvent', unref(currentEvent))
      selectRef.value = document.querySelector('.undone')
    },
    eventClick: handleEventClick,


  } as CalendarOptions

  watch(refCalendar, (val) => {
    if (val)
      calendarApi.value = val.getApi()
  })



  // 允许外部控制打开指定的日期
  const jumpToDate = (currentDate: string) => {
    calendarApi.value?.gotoDate(new Date(currentDate))
  }

  return {
    refCalendar,
    calendarOptions,
    selectRef,
    formRef,
    currentEvent,
    loading,
    setOption,
    refetchEvents,
    fetchEvents,
    removeEvent,
    dateSet,
    jumpToDate,
  }
}

export function usePredefineColors() {
  const colors = ref<string[]>([])
  getApiV1DictBytypecodeOptions({ typeCode: 'commonColors' }).then((res) => {
    colors.value = res.map(item => item.label)
  })
  return {
    colors,
  }
}
