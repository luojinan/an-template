import type { ProFormColumn } from '@/components/ProComponent'
import { getApiV1DictBytypecodeOptions, getNewApiV1InstitutionOptions } from '@/proApi'
import type { TeacherInfoForm } from '@/utils/proProApi/apiTypes'

export const baseInfoColumn: ProFormColumn<TeacherInfoForm>[] = [
  { label: '导师姓名', prop: 'name', rules: [{ required: true, trigger: 'blur' }] },
  {
    label: '所属机构',
    valueType: 'select',
    prop: 'institutionId',
    valueEnum: [],
    rules: [{ required: true, trigger: 'blur' }],
    initFn: async (formItem) => {
      formItem.valueEnum = await getNewApiV1InstitutionOptions()
    },
  },
  { label: '展示名称', prop: 'displayName' },
  { label: '内部称呼', prop: 'innerName' },
  { label: '英文名', prop: 'englishName' },
  {
    label: '首页标语',
    prop: 'homeSlogan',
    attrs: {
      type: 'textarea',
      autosize: {
        minRows: 2,
      },
    },
  },
  {
    label: '列表标语',
    prop: 'listSlogan',
    attrs: {
      type: 'textarea',
      autosize: {
        minRows: 2,
      },
    },
  },
  {
    label: '生日',
    valueType: 'date-picker',
    prop: 'birthday',
    attrs: {
      'value-format': 'YYYY-MM-DD',
    },
  },
  {
    label: '教龄',
    valueType: 'input-number',
    prop: 'teachingExperience',
    attrs: {
      min: 0,
      precision: 0,
    },
  },
  {
    label: '导师性别',
    valueType: 'radio',
    prop: 'gender',
    valueEnum: [],
    initFn: async (formItem) => {
      formItem.valueEnum = await getApiV1DictBytypecodeOptions({ typeCode: 'gender' })
    },
  },
  {
    prop: 'goodFields',
    label: '擅长领域',
    valueType: 'select',
    valueEnum: [],
    initFn: async (formItem) => {
      formItem.valueEnum = await getApiV1DictBytypecodeOptions({ typeCode: 'specialties' })
    },
    attrs: {
      multiple: true,
    },
  },
  { label: '擅长学科', prop: 'goodSubject' },
  { label: '国籍', prop: 'nationality' },
  { label: '毕业院校', prop: 'graduationSchool' },
  { label: '最高学历', prop: 'highestDegree' },
  { label: '所学专业', prop: 'major' },
  { label: '所授专业', prop: 'teachingMajor' },
  { label: '学生反馈', prop: 'slogan' },
  {
    label: '导师标签',
    valueType: 'select',
    prop: 'tag',
    valueEnum: [],
    attrs: {
      multiple: true,
      multipleLimit: 3,
    },
    async initFn(formItem) {
      formItem.valueEnum = await getApiV1DictBytypecodeOptions({ typeCode: 'tutorTag' })
    },
    convertValue: (value = '') => {
      return value ? value.split(',') : []
    },
    transform: (value = []) => {
      return {
        tag: value.join(','),
      }
    },
  },
  {
    label: '导师头衔',
    valueType: 'select',
    prop: 'titleCode',
    valueEnum: [],
    async initFn(formItem) {
      formItem.valueEnum = await getApiV1DictBytypecodeOptions({ typeCode: 'tutorTitle' })
    },
  },
  { label: '试听id', prop: 'trialLessonId' },
  {
    label: '备注',
    prop: 'mark',
    valueType: 'input',
    attrs: {
      type: 'textarea',
      autosize: {
        minRows: 3,
      },
    },
  },
]
