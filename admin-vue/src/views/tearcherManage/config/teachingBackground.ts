import type { TeacherForm } from '@/api/teacher/model'
import type { ProFormColumn } from '@/components/ProComponent'

const degreeMap = [
  { label: '博士后', value: '博士后' },
  { label: '博士', value: '博士' },
  { label: '硕士', value: '硕士' },
  { label: '学士', value: '学士' },
  { label: '高中', value: '高中' },
]

export const tearchingBackgroundColumn: ProFormColumn<TeacherForm>[] = [
  {
    valueType: 'formList',
    prop: 'educationBackgroundList',
    initialValue: [],
    columns: [
      {
        label: '学校名称',
        prop: 'schoolName',
        formTtemAttrs: {
          style: {
            padding: '0 20px',
          },
        },
      },
      {
        label: '所在国家',
        prop: 'country',
        formTtemAttrs: {
          style: {
            padding: '0 20px',
          },
        },
      },
      {
        label: '专业名称',
        prop: 'major',
        formTtemAttrs: {
          style: {
            padding: '0 20px',
          },
        },
      },
      {
        label: '学历',
        valueType: 'select',
        prop: 'degree',
        valueEnum: degreeMap,
        formTtemAttrs: {
          style: {
            padding: '0 20px',
          },
        },
      },
    ],
  },
]
