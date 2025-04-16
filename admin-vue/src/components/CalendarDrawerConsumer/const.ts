import type { ProFormColumn } from '@/components/ProComponent'
import { getApiV1AdminCoursesList, getApiV1AdminOrdersByidForm, getNewApiV1AdminCoursesList, getNewApiV1InstitutionOptions, getTeacherInfoOptions } from '@/proApi'
import { useUserStore } from '@/store'
import { getApiV1AdminCoursesOrderByorderidBydetailid } from '@/utils/proProApi/admin'

export const userStore = useUserStore()

export const adminFormColumns: ProFormColumn[] = [
  {
    prop: 'handleType', // 标识表单是新增还是编辑
    hidden: true,
  },
  {
    prop: 'id',
    hidden: true,
  },
  {
    prop: 'studentId',
    hidden: true,
  },
  {
    prop: 'currentEvent',
    hidden: true,
  },
  {
    prop: 'orderId',
    unMounted: true,
    watch: async (newValue, oldValue, data, items, formItemTool) => {
      const [editTypeForm, selectOrderCourseForm] = formItemTool.getFieldConfig(['editType', 'selectOrderCourse'])
      editTypeForm.valueEnum = newValue
        ? [
            { label: '手动输入', value: 'manual' },
            { label: '选择订单课程', value: 'selectorder' },
            { label: '选择其他课程', value: 'select' },
          ]
        : [
            { label: '手动输入', value: 'manual' },
            { label: '选择已有课程', value: 'select' },
          ]

      if (!newValue) { return }
      const res = await getApiV1AdminOrdersByidForm({ id: newValue })
      selectOrderCourseForm.valueEnum = res.orderDetails.map(item => ({ label: item.courseName, value: `${res.id}-${item.id}` }))
    },
  },
  {
    prop: 'editType',
    label: '录入方式',
    valueType: 'radio',
    convertValue: (value, alldata) => {
      return alldata.courseId ? 'select' : 'manual'
    },
    watch: (newValue, oldValue, data, items, formItemTool) => {
      const selectFormItems = formItemTool.getFieldConfig(['teacherId', 'courseId'])
      const selectOrderFormItems = formItemTool.getFieldConfig(['selectOrderCourse', 'selectOrderInstitutionId', 'selectOrderTeacherName'])
      const manualFormItems = formItemTool.getFieldConfig(['courseName', 'teacherName'])

      selectFormItems.forEach(item => item.unMounted = newValue !== 'select')
      manualFormItems.forEach(item => item.unMounted = newValue !== 'manual')
      selectOrderFormItems.forEach(item => item.unMounted = newValue !== 'selectorder')

      const [institutionIdFormItem] = formItemTool.getFieldConfig(['institutionId'])
      institutionIdFormItem.unMounted = newValue === 'selectorder'
      institutionIdFormItem.rules = newValue === 'select' ? [{ required: true, trigger: 'blur' }] : []
    },
  },
  {
    label: '课程类型',
    valueType: 'radio',
    prop: 'type',
    initialValue: '1',
    valueEnum: [{ label: '专属课程', value: '1' }, { label: '通用课程', value: '0' }],
    rules: [{ required: true, trigger: 'blur' }],
  },
  {
    // 如果是总公司，要显示机构选择，然后机构联动教师
    // 如果是机构，不需要机构选择显示，默认机构id，联动教师
    label: '机构名称',
    valueType: 'select',
    prop: 'institutionId',
    valueEnum: [],
    initFn: async (formItem) => {
      formItem.valueEnum = await getNewApiV1InstitutionOptions()
    },
    attrs: {},
    watch: async (value, old, formdata, formconfig, formItemTool) => {
      if (old && value) {
        formdata.teacherId = undefined
        formdata.courseId = undefined
      }
      if (old && !value) {
        formdata.teacherId = undefined
        formdata.courseId = undefined
      }
      const [teacherIdForm] = formItemTool.getFieldConfig(['teacherId'])
      if (value) {
        const { list } = await getTeacherInfoOptions({ institutionId: value, pageSize: '9999', pageNum: '1' })
        teacherIdForm.valueEnum = list.map((item: any) => ({ label: item.displayName, value: `${item.id}` }))
      }
      else {
        teacherIdForm.valueEnum = []
      }
    },
    convertValue: (value) => {
      // FIXME: 机构id 需要转成数字
      return value && +value
    },
    transform(val) {
      const institutionIdOptions = this.valueEnum || []
      const institution = institutionIdOptions.find((item: any) => item.value === val)
      return {
        institutionId: val || undefined,
        institutionName: institution?.label || undefined,
      }
    },
  },
  // 手动录入
  {
    prop: 'teacherName',
    label: '导师名称',
    unMounted: true,
  },
  {
    prop: 'courseName',
    label: '课程名称',
    unMounted: true,
    rules: [{ required: true, trigger: 'blur' }],
  },
  {
    label: '课程名称',
    valueType: 'select',
    prop: 'selectOrderCourse',
    unMounted: true,
    rules: [{ required: true, trigger: 'blur' }],
    watch: async (val: string, oldValue, data, items, formItemTool) => {
      if (!val) { return }
      const [orderId, detailId] = val.split('-')
      // 设置课程信息
      const { teacherId, teacherName, institutionId, institutionName } = await getApiV1AdminCoursesOrderByorderidBydetailid({ orderId, detailId })
      data.selectOrderTeacherName = teacherName
      data.selectOrderInstitutionId = institutionId
      data.selectOrderInstitutionName = institutionName
    },
    transform(val: string) {
      const courseIdOptions = this.valueEnum || []
      const course = courseIdOptions.find((item: any) => item.value === val)
      const [, detailId] = val.split('-')
      return {
        selectOrderCourseID: detailId || undefined,
        selectedCourseName: course?.label || undefined,
      }
    },
  },

  {
    prop: 'selectOrderTeacherName',
    label: '导师名称',
    unMounted: true,
    valueType: 'text',
  },
  {
    prop: 'selectOrderInstitutionName',
    label: '机构名称',
    unMounted: true,
    valueType: 'text',
  },
  // 选择录入
  {
    label: '导师名称',
    valueType: 'select',
    prop: 'teacherId',
    unMounted: true,
    valueEnum: [],
    attrs: {
      placeholder: '请先选择机构再选择导师',
    },
    rules: [{ required: true, trigger: 'blur' }],
    async initFn(formItem) {
      const { isInstitution, id } = userStore.user.dept
      if (isInstitution) {
        const { list } = await getTeacherInfoOptions({ institutionId: `${id}`, pageSize: '9999', pageNum: '1' })
        formItem.valueEnum = list.map((item: any) => ({ label: item.displayName, value: `${item.id}` }))
      }
    },
    watch: async (value, old, formdata, formconfig, formItemTool) => {
      if (old && value) { formdata.courseId = undefined }

      if (old && !value) { formdata.courseId = undefined }

      const [courseIdFormItem] = formItemTool.getFieldConfig(['courseId'])
      // courseIdFormItem.unMounted = !value || formdata.editType === 'manual'
      if (value) {
        const res = await getNewApiV1AdminCoursesList({ teacherId: value })
        courseIdFormItem.valueEnum = res.map((item: any) => ({ label: item.name, value: `${item.id}`, location: item.address }))
      }
      else {
        courseIdFormItem.valueEnum = []
      }
    },
    transform(val) {
      const teacherIdOptions = this.valueEnum || []
      const teacher = teacherIdOptions.find((item: any) => item.value === val)
      return {
        teacherId: val || undefined,
        selectedTeacherName: teacher?.label || undefined,
      }
    },
  },
  {
    label: '课程名称',
    valueType: 'select',
    prop: 'courseId',
    unMounted: true,
    attrs: {
      placeholder: '请先选择导师再选择课程',
    },
    rules: [{ required: true, trigger: 'blur' }],
    watch: (val, oldValue, data, items, formItemTool) => {
      const formItem = formItemTool.getFieldConfig('courseId')
      const courseIdOptions = formItem.valueEnum || []
      if (val) {
        const course = courseIdOptions.find((item: any) => item.value === val) || {}
        course.location && (data.location = course.location)
      }
    },
    transform(val) {
      const courseIdOptions = this.valueEnum || []
      const course = courseIdOptions.find((item: any) => item.value === val)
      return {
        courseId: val || undefined,
        selectedCourseName: course?.label || undefined,
      }
    },
  },
  {
    prop: 'location',
    label: '上课地点',
  },
  {
    prop: 'remark',
    label: '备注',
    attrs: {
      type: 'textarea',
      rows: 3,
    },
  },
  {
    prop: 'background',
    label: '背景颜色',
    valueType: 'custom',
    initialValue: '#3788d8',
    slotName: 'colorPicker',
  },
]

export const isInstitutionFormColumns: ProFormColumn[] = [
  {
    prop: 'handleType', // 标识表单是新增还是编辑
    hidden: true,
  },
  {
    prop: 'id',
    hidden: true,
  },
  {
    prop: 'studentId',
    hidden: true,
  },
  {
    prop: 'currentEvent',
    hidden: true,
  },
  {
    prop: 'institutionId',
    initialValue: userStore.user.dept.id,
    hidden: true,
  },
  // 选择录入
  {
    label: '导师名称',
    valueType: 'select',
    prop: 'teacherId',
    valueEnum: [],
    rules: [{ required: true, trigger: 'blur' }],

    async initFn(formItem) {
      const { isInstitution, id } = userStore.user.dept
      if (isInstitution) {
        const { list } = await getTeacherInfoOptions({ institutionId: `${id}`, pageSize: '9999', pageNum: '1' })
        formItem.valueEnum = list.map((item: any) => ({ label: item.displayName, value: `${item.id}` }))
      }
    },
    watch: async (value, old, formdata, formconfig, formItemTool) => {
      if (old && value) { formdata.courseId = undefined }

      const [courseIdFormItem] = formItemTool.getFieldConfig(['courseId'])
      courseIdFormItem.unMounted = !value || formdata.editType === 'manual'
      if (value) {
        const res = await getApiV1AdminCoursesList({ teacherId: value })
        courseIdFormItem.valueEnum = res.map((item: any) => ({ label: item.name, value: `${item.id}`, location: item.address }))
      }
      else {
        courseIdFormItem.valueEnum = []
      }
    },
    transform(val) {
      const teacherIdOptions = this.valueEnum || []
      const teacher = teacherIdOptions.find((item: any) => item.value === val)
      return {
        teacherId: val || undefined,
        selectedTeacherName: teacher?.label || undefined,
      }
    },
  },
  {
    label: '课程名称',
    valueType: 'select',
    prop: 'courseId',
    attrs: {
      placeholder: '请先选择导师再选择课程',
    },
    rules: [{ required: true, trigger: 'blur' }],
    watch: (val, oldValue, data, items, formItemTool) => {
      const formItem = formItemTool.getFieldConfig('courseId')
      const courseIdOptions = formItem.valueEnum || []
      if (val) {
        const course = courseIdOptions.find((item: any) => item.value === val) || {}
        if (course.location) { data.location = course.location }
      }
    },
    transform(val) {
      const courseIdOptions = this.valueEnum || []
      const course = courseIdOptions.find((item: any) => item.value === val)
      return {
        courseId: val || undefined,
        selectedCourseName: course?.label || undefined,
      }
    },
  },
  {
    prop: 'location',
    label: '上课地点',
  },
  {
    prop: 'remark',
    label: '备注',
    attrs: {
      type: 'textarea',
      rows: 3,
    },
  },
  {
    prop: 'background',
    label: '背景颜色',
    valueType: 'custom',
    initialValue: '#3788d8',
    slotName: 'colorPicker',
  },
]

export const predefineColors = [
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  '#ff69b4',
  '#ffb6c1',
  '#dcdcdc',
]
