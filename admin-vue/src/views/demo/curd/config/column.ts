import type { ProFormColumn, ProTableColumn } from '@/components/ProComponent'
import { useUserStore } from '@/store'
import { getApiV1DictBytypecodeOptions } from '@/utils/proApi/system'

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
    label: 'select',
    valueType: 'select',
    prop: 'status',
    valueEnum: [
      { label: '启用', value: 1, tagType: 'success' },
      { label: '禁用', value: 0, tagType: 'info' },
    ],
    hideInSearch: true,
  },
  {
    label: '接口数据select',
    prop: 'a',
    valueType: 'select',
    valueEnum: [],
    initFn: async (formItem) => {
      formItem.valueEnum = await getApiV1DictBytypecodeOptions({ typeCode: 'institutionType' })
    },
  },
  {
    label: '格式化数据',
    prop: 'keyFormat',
    formatFn: (value) => {
      return value ? `格式化数据${value}` : '-'
    },
    hideInSearch: true,
  },
  // {
  //   label: '插槽直接',
  //   prop: 'keySlot',
  //   valueType: 'custom',
  //   slotName: 'status', // TODO: 直接使用Vue组件实例
  //   hideInSearch: true,
  // },
  {
    label: '插槽',
    prop: 'status',
    valueType: 'custom',
    slotName: 'status',
    hideInSearch: true,
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
              formItem.valueEnum = [{ label: '选项', value: '1' }]
            },
            rules: [{ required: true, trigger: 'blur' }],
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
