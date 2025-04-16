interface Schedule {
  scheduleId: number
  start: number
  end: number
  status: string
  courseId?: any
  courseName?: any
  studentId?: any
  studentName?: any
  list: Schedule[]
}

export function mergeSchedules(schedules: Schedule[]): Schedule[] {
  return schedules.reduce((res, next) => {
    const lastSchedule = res[res.length - 1]

    // 如果当前时间段与上一个时间段相连并且状态相等，则合并它们
    if (lastSchedule && next.start === lastSchedule.end && next.status === lastSchedule.status && next.courseType === lastSchedule.courseType && next.courseId === lastSchedule.courseId) {
      if (!lastSchedule.list)
        lastSchedule.list = [{ ...lastSchedule }]

      lastSchedule.list.push(next)
      lastSchedule.end = Math.max(lastSchedule.end, next.end)
    }
    else {
      // 如果不相连，则将当前时间段添加到累加器数组中
      res.push(next)
    }

    return res
  }, [] as Schedule[]).map((listItem) => {
    const { list, ...item } = listItem
    if (!list)
      return { ...item, list: [item] }
    return listItem
  })
}
