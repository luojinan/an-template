import { aboutMeColumn } from './aboutMe'
import { baseInfoColumn } from './baseInfo'
import { proofMaterialColumn } from './proofMaterial'
import { tearchingBackgroundColumn } from './teachingBackground'
import type { TeacherSortNumberForm } from '@/proApi/apiTypes'
import type { ProFormColumn, ProTableColumn, ValueEnum } from '@/components/ProComponent'
import { getNewApiV1InstitutionOptions } from '@/proApi'
import type { TeacherInfo, TeacherInfoVO } from '@/utils/proProApi/apiTypes'
import { getApiV1DictBytypecodeOptions } from '@/utils/proProApi/admin'

const showExcellentMap: ValueEnum[] = [
  {
    label: '展示',
    value: 1,
    tagType: 'success',
  },
  {
    label: '不展示',
    value: 0,
    tagType: 'info',
  },
]

// 表格项配置，不含操作项
export const tableColumns: ProTableColumn<TeacherInfoVO & { keys?: string }>[] = [
  {
    prop: 'avatarUrl',
    label: '导师头像',
    width: '80px',
    valueType: 'image',
    hideInSearch: true,
  },
  {
    prop: 'keys',
    label: '导师名称',
    attrs: {
      placeholder: '导师姓名/昵称/英文名',
    },
    hideInTable: true,
  },
  {
    prop: 'name',
    label: '内部称呼',
    width: '80px',
    hideInSearch: true,
  },
  {
    label: '所属机构',
    valueType: 'select',
    prop: 'institutionId',
    valueEnum: [],
    initFn: async (formItem) => {
      formItem.valueEnum = await getNewApiV1InstitutionOptions()
    },
  },
  {
    prop: 'institutionLevel',
    label: '机构等级',
    valueType: 'select',
    valueEnum: [],
    initFn: async (formItem) => {
      formItem.valueEnum = await getApiV1DictBytypecodeOptions({ typeCode: 'InstitutionLevel' })
    },
    hideInSearch: true,
  },
  {
    prop: 'titleName',
    label: '导师头衔',
    hideInSearch: true,
  },
  {
    prop: 'nationality',
    label: '国籍',
    hideInSearch: true,
  },
  {
    prop: 'teachingExperience',
    label: '教学年限',
    hideInSearch: true,
  },
  {
    prop: 'isShowExcellent',
    label: '首页展示',
    valueType: 'select',
    valueEnum: showExcellentMap,
    hideInSearch: true,
  },
  {
    prop: 'sortNumber',
    label: '推荐顺序',
    hideInSearch: true,
  },
  {
    prop: 'graduationSchool',
    label: '毕业院校',
  },
  {
    prop: 'createUserName',
    label: '创建人',
  },
  {
    prop: 'mark',
    label: '备注',
    showOverflowTooltip: true,
  },
]

export const sortFormColumn: ProFormColumn<TeacherSortNumberForm>[] = [
  {
    prop: 'id',
    hidden: true,
  },
  {
    prop: 'isShowExcellent',
    label: '首页展示',
    valueType: 'radio',
    valueEnum: showExcellentMap,
  },
  {
    prop: 'sortNumber',
    label: '推荐顺序',
    valueType: 'input-number',
    attrs: {
      min: 0,
      precision: 0,
    },
  },
]

export const resetPasswordColumn: ProFormColumn[] = [
  {
    prop: 'userId',
    valueType: 'text',
    label: '账号ID',
  },
  {
    prop: 'name',
    valueType: 'text',
    label: '内部称呼',
  },
  {
    prop: 'password',
    label: '新密码',
    attrs: {
      type: 'password',
      showPassword: true,
      minlength: 6,
    },
    rules: [
      { required: true, trigger: 'blur' },
      { min: 6, message: '密码至少需要6位字符，请重新输入', trigger: 'blur' },
    ],
  },
]

export const editConfig: ProFormColumn<TeacherInfo>[] = [
  {
    prop: 'id',
    hidden: true,
  },
  {
    valueType: 'group',
    attrs: {
      dividerTitle: '基本信息',
    },
    key: 'group1', // 用于作为group的vNode key，不作用于数据
    columns: baseInfoColumn,
  },
  {
    valueType: 'group',
    attrs: {
      dividerTitle: '运营设置',
    },
    key: 'group7', // 用于作为group的vNode key，不作用于数据
    columns: [
      {
        label: '展示详情页',
        prop: 'isShowDetail',
        valueType: 'radio',
        valueEnum: showExcellentMap,
      },
      {
        label: '搜索关键词',
        prop: 'searchKeywords',
        attrs: {
          type: 'textarea',
          autosize: {
            minRows: 2,
          },
        },
      },
    ],
  },
  {
    valueType: 'group',
    attrs: {
      dividerTitle: '自我介绍',
    },
    key: 'group3',
    columns: aboutMeColumn,
  },
  {
    valueType: 'group',
    attrs: {
      dividerTitle: '教育背景',
    },
    key: 'group4',
    columns: tearchingBackgroundColumn,
  },
  {
    valueType: 'group',
    attrs: {
      dividerTitle: '证明资料',
    },
    key: 'group2',
    columns: proofMaterialColumn,
  },
  {
    valueType: 'group',
    attrs: {
      dividerTitle: '导师简介',
    },
    key: 'group5', // 用于作为group的vNode key，不作用于数据
    columns: [
      {
        prop: 'detailedIntroduction',
        valueType: 'custom',
        slotName: 'wangedit',
        formTtemAttrs: {
          style: {
            flex: '100%',
          },
        },
      },
    ],
  },

  {
    valueType: 'group',
    attrs: {
      dividerTitle: '教学成果',
    },
    key: 'group6', // 用于作为group的vNode key，不作用于数据
    columns: [
      {
        prop: 'experience',
        valueType: 'custom',
        slotName: 'wangedit',
        formTtemAttrs: {
          style: {
            flex: '100%',
          },
        },
      },
    ],
  },
]
