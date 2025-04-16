import type { ProFormColumn, ProTableColumn } from '@/components/ProComponent'
import { getApiV1DictBytypecodeOptions, getNewApiV1InstitutionOptions, getTeacherInfoOptions } from '@/proApi'
import { useUserStore } from '@/store'

const userStore = useUserStore()

// 表格项配置，不含操作项
export const tableColumns: ProTableColumn<{ id: number, a: string, status: number }>[] = [
  { label: 'ID', prop: 'id', hideInSearch: true },
  {
    prop: 'keywords',
    label: '关键字',
    hideInTable: true,
  },
  {
    prop: 'status',
    label: '上架状态',
    valueType: 'select',
    attrs: {
      placeholder: '全部',
    },
    valueEnum: [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }],
    hideInTable: true,
  },
  {
    label: 'select支持tag样式',
    valueType: 'select',
    prop: 'status',
    valueEnum: [
      { label: '启用', value: 1, tagType: 'success' },
      { label: '禁用', value: 0, tagType: 'info' },
    ],
    hideInSearch: true,
  },
  {
    label: '上架状态插槽',
    prop: 'status',
    valueType: 'custom',
    slotName: 'status',
    hideInSearch: true,
  },
  {
    label: '字典枚举',
    prop: 'a',
    valueType: 'select',
    valueEnum: [],
    initFn: async (formItem) => {
      formItem.valueEnum = await getApiV1DictBytypecodeOptions({ typeCode: 'institutionType' })
    },
  },
]

// 新增编辑表单项配置
export const formColumns: ProFormColumn[] = [
  {
    valueType: 'group',
    columns: [
      {
        valueType: 'formList',
        prop: 'groupformList', // TODO: 不需要，或作为前置对象
        columns: [
          {
            label: '选择',
            valueType: 'select',
            prop: 'a',
            initFn: async (formItem) => {
              formItem.valueEnum = [
                { label: '选项', value: '1' },
              ]
              const { list } = await getTeacherInfoOptions({ institutionId: '264', pageSize: '9999', pageNum: '1' })
              formItem.valueEnum = list.map((item: any) => ({ label: item.displayName, value: `${item.id}` }))
            },
            watch(newValue, oldValue, data, items, formItemTool) {
              const [input2Form] = formItemTool.getFieldConfig(['input2'])
              input2Form.label = 'watch修改'
              data.input2 = 'watch修改'
            },
          },
          { label: '插槽', valueType: 'custom', prop: 'c', slotName: 'myslota' },
          {
            label: 'list表单项2',
            prop: 'input2',
          },

          {
            label: '机构名称',
            valueType: 'select',
            prop: 'institutionId',
            valueEnum: [],
            initFn: async (formItem) => {
              formItem.valueEnum = await getNewApiV1InstitutionOptions()
            },
            rules: [{ required: true, trigger: 'blur' }],
            watch: async (value, old, formdata, formconfig, formItemTool) => {
              const [teacherIdForm] = formItemTool.getFieldConfig(['institutionId', 'teacherId'])
              if (!userStore.user.dept.isInstitution && value) {
                const { list } = await getTeacherInfoOptions({ institutionId: value, pageSize: '9999', pageNum: '1' })
                teacherIdForm.valueEnum = list.map((item: any) => ({ label: item.displayName, value: `${item.id}` }))
              }
              else {
                teacherIdForm.valueEnum = []
              }

              // 没有值变为有值，为初始化不需要重置
              if (old) {
                formdata.teacherId = ''
                formdata.teacherName = ''
              }
            },
          },
          {
            label: '导师名称',
            valueType: 'select',
            prop: 'teacherId',
            valueEnum: [],
            watch(newValue, oldValue, data, items, formItemTool) {
              const [teacherIdForm] = formItemTool.getFieldConfig(['teacherId'])

              const teacherIdOptions = teacherIdForm.valueEnum || []
              const teacher = teacherIdOptions.find((item: any) => item.value === newValue)
              if (teacher && teacher?.label) {
                data.teacherName = teacher?.label || ''
              }
            },
          },
        ],
      },
    ],
  },
]
