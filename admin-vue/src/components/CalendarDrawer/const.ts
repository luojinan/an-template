import type { ProFormColumn, ProTableColumn, ValueEnum } from '@/components/ProComponent'
import { getApiV1AdminCoursesList } from '@/proApi'

export enum BookingStatus {
  INIT = 'INIT', // 初始状态，未预约
  BOOKED = 'BOOKED', // 学生已预约
  STUDENT_CANCEL_PENDING = 'CANCEL_PENDING', // 学生取消预约，讲师未确认
  STUDENT_CANCEL_APPROVED = 'STUDENT_CANCEL_APPROVED', // 学生取消预约，讲师已确认
  STUDENT_CANCEL_REJECTED = 'STUDENT_CANCEL_REJECTED', // 学生取消预约，讲师已拒绝
  TEACHER_CANCEL_PENDING = 'TEACHER_CANCEL_PENDING', // 讲师取消预约，学生未确认
  TEACHER_CANCEL_APPROVED = 'TEACHER_CANCEL_APPROVED', // 讲师取消预约，学生已确认
  TEACHER_CANCEL_REJECTED = 'TEACHER_CANCEL_REJECTED', // 讲师取消预约，学生已拒绝
  COMPLETED = 'COMPLETED', // 讲师完成授课
}

interface StatusDescription {
  description: string
  actions: string[]
  tagType: ValueEnum['tagType']
}

export const statusMap = new Map<BookingStatus, StatusDescription>([
  [BookingStatus.INIT, { description: '待预约', tagType: 'primary', actions: ['取消预约'] }],
  [BookingStatus.BOOKED, { description: '待授课', tagType: 'warning', actions: ['授课完成', '取消预约'] }],
  [BookingStatus.STUDENT_CANCEL_PENDING, { description: '待审批-学生申请取消预约', tagType: 'danger', actions: ['同意取消', '拒绝取消'] }],
  [BookingStatus.STUDENT_CANCEL_APPROVED, { description: '已取消-已通过学生取消申请', tagType: 'info', actions: [] }],
  [BookingStatus.STUDENT_CANCEL_REJECTED, { description: '待授课-已拒绝学生取消申请', tagType: 'warning', actions: ['授课完成'] }],
  [BookingStatus.TEACHER_CANCEL_PENDING, { description: '取消预约-学生待确认', tagType: 'danger', actions: [] }],
  [BookingStatus.TEACHER_CANCEL_APPROVED, { description: '已取消-学生已通过取消申请', tagType: 'info', actions: [] }],
  [BookingStatus.TEACHER_CANCEL_REJECTED, { description: '待授课-学生拒绝取消申请', tagType: 'warning', actions: ['授课完成'] }],
  [BookingStatus.COMPLETED, { description: '已授课', tagType: 'success', actions: [] }],
])

function convertMapToObject(statusMap: Map<BookingStatus, StatusDescription>): ValueEnum[] {
  return Array.from(statusMap).map(([key, value]) => ({
    label: value.description,
    value: key,
    tagType: value.tagType,
  }))
}

export const formColumns: ProFormColumn[] = [
  {
    prop: 'handleType', // 标识表单是新增还是编辑
    hidden: true,
    watch: (newValue, oldValue, data, items) => {
      if (newValue === 'detail') {
        items.forEach((item) => {
          item.attrs.disabled = true
        })
      }
      else {
        items.forEach((item) => {
          item.attrs.disabled = false
        })
      }
    },
  },
  {
    prop: 'teacherId',
    hidden: true,
  },
  {
    prop: 'currentEvent',
    hidden: true,
  },
  {
    label: '课程类型',
    valueType: 'select',
    prop: 'courseType',
    initialValue: '2',
    rules: [{ required: true, trigger: 'blur' }],
    valueEnum: [{ label: '大课', value: 'bigCourse' }, { label: '一对一', value: 'oneByOne' }],
    watch: async (newValue, oldValue, data, items, formItemTool) => {
      const unMounted = newValue !== 'bigCourse' || data.handleType !== 'add'

      const courseIdFormItem = formItemTool.getFieldConfig('courseId')
      courseIdFormItem && (courseIdFormItem.unMounted = unMounted)
      if (!unMounted) {
        const res = await getApiV1AdminCoursesList({ teacherId: data.teacherId })
        courseIdFormItem.valueEnum = res.map((item: any) => ({ label: item.name, value: `${item.id}` }))
      }
    },
  },
  {
    label: '课程名称',
    valueType: 'select',
    prop: 'courseId',
    unMounted: true,
    rules: [{ required: true, trigger: 'blur' }],
  },
  {
    prop: 'table',
    valueType: 'custom',
    slotName: 'table',
  },
]

export const tableColumn: ProTableColumn[] = [
  {
    label: '开始时间',
    prop: 'start',
    valueType: 'date',
    dateFormat: 'HH:mm',
    width: 80,
  },
  {
    label: '结束时间',
    prop: 'end',
    valueType: 'date',
    dateFormat: 'HH:mm',
    width: 80,
  },
  {
    label: '状态',
    prop: 'status',
    valueType: 'select',
    width: '180px',
    valueEnum: convertMapToObject(statusMap),
  },
  {
    label: '学生',
    prop: 'studentName',
    valueType: 'custom',
    slotName: 'studentName',
  },
]
