import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import type { CalendarApi, CalendarOptions, EventSourceFunc } from '@fullcalendar/core'
import type { Ref } from 'vue'
import { ref, watch } from 'vue'
import { mergeSchedules } from './utils'
import { getApiV1AdminCoursebookingSchedules } from '@/proApi'
import { useUserStore } from '@/store'
import { statusMap } from '@/components/CalendarDrawer/const'

const userStore = useUserStore()
export function useCalendar(showDialog: Ref<boolean>) {
  const refCalendar = ref()
  const selectRef = ref()
  const currentEvent = ref()
  const loading = ref(false)
  const formRef = ref()

  const teacherId = ref('')

  const calendarApi = ref<null | CalendarApi>(null)

  const removeEventInCalendar = (eventId: string) => {
    const _event = calendarApi.value?.getEventById(eventId)
    if (_event)
      _event.remove()
  }

  const refetchEvents = (id?: string) => {
    teacherId.value = id || ''
    calendarApi.value?.refetchEvents()
  }

  const removeEvent = (eventId: string) => {
    showDialog.value = false // set false and remove temp
    removeEventInCalendar(eventId)
  }

  const fetchEvents: EventSourceFunc = (info, successCallback) => {
    // 根据日历开始结束获取数据
    if (!info)
      return
    removeEvent('temp')
    getApiV1AdminCoursebookingSchedules({ teacherId: teacherId?.value || `${userStore.user.userId}` }).then((r) => {
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
      const res = r.map(({ startTime, endTime, ...item }) => {
        return {
          id: `${item.scheduleId}`,
          courseType: item.type,
          start: startTime,
          end: endTime,
          status: item.teachingStatus === 'COMPLETED' ? 'COMPLETED' : item.bookingStatus || item.teachingStatus,
          ...item,
        }
      })
      const test = mergeSchedules(res)
      successCallback(test)
    })
  }

  function handleDateSelect(selectInfo: any) {
    if (selectInfo.view.type !== 'timeGridWeek')
      return

    removeEvent('temp')
    showDialog.value = false // set false and remove temp

    // 开始时间小于当前时间不允许选择
    if (+selectInfo.start < new Date().getTime()) {
      ElMessage.warning('新增开始时间不可小于当前时间')
      return
    }

    // selectRef.value = selectInfo.jsEvent.srcElement // 选择有2个阶段，这个是dom会自动消失，不适合作悬浮窗的标准
    currentEvent.value = { ...selectInfo, handleType: 'add' }
    formRef.value?.setFormData({
      handleType: 'add',
      courseType: 'oneByOne',
      currentEvent: unref(currentEvent),
      teacherId: teacherId.value || '',
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
  // clickInfo.event.remove()
    selectRef.value = clickInfo.el
    currentEvent.value = { ...clickInfo, handleType: 'detail' }
    formRef.value?.setFormData({
      handleType: 'detail',
      courseType: currentEvent.value.event.extendedProps.courseType,
      currentEvent: unref(currentEvent),
      teacherId: teacherId.value || '',
    })
    showDialog.value = true
    removeEventInCalendar('temp')
  }
  function handleEvents(events) {
    console.log('点击事件块', events)
  }

  const calendarOptions = {
    height: '100%',
    firstDay: 1,
    plugins: [
      dayGridPlugin,
      timeGridPlugin,
      interactionPlugin, // needed for dateClick
    ],
    headerToolbar: {
      right: 'prev,next',
      center: 'title',
      left: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    initialView: 'timeGridWeek',
    events: fetchEvents,
    loading: val => loading.value = val,

    editable: false,
    navLinks: true,

    allDaySlot: false,
    selectable: true,
    locale: 'zh-cn',
    eventClassNames({ event: calendarEvent }) {
      const { status, courseType } = calendarEvent.extendedProps
      // TODO: courseType 大课设置一套浅色主题
      const className = statusMap.get(status)?.tagType
      return [
        courseType === 'bigCourse' ? `big-${className}` : `bg-${className}`,
      ]
    },

    select: handleDateSelect,
    eventClick: handleEventClick,
    eventsSet: handleEvents,

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
    refetchEvents,
    fetchEvents,
    removeEvent,
    jumpToDate,
  }
}
