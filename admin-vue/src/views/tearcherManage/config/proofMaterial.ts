import type { TeacherForm } from '@/api/teacher/model'
import type { ProFormColumn } from '@/components/ProComponent'

export const proofMaterialColumn: ProFormColumn<TeacherForm>[] = [
  {
    label: '身份证正反面',
    valueType: 'upload',
    prop: 'idCards',
    attrs: {
      limit: 2,
      accept: 'image/*',
    },
    formTtemAttrs: {
      style: {
        marginLeft: '20px',
        flex: '100%',
      },
    },
    transform: (val = []) => {
      if (val.length === 0)
        return {}
      return {
        idCards: val.map(item => item?.url),
      }
    },
    convertValue: (val) => {
      if (!val)
        return []

      return val.map(item => ({ url: item }))
    },
  },
  {
    label: '学历证明',
    valueType: 'upload',
    prop: 'degreeCertificates',
    attrs: {
      accept: 'image/*',
    },
    formTtemAttrs: {
      style: {
        marginLeft: '20px',
        flex: '100%',
      },
    },
    transform: (val = []) => {
      if (val.length === 0)
        return {}
      return {
        degreeCertificates: val.map(item => item?.url),
      }
    },
    convertValue: (val) => {
      if (!val)
        return []

      return val.map(item => ({ url: item }))
    },
  },
  {
    // label: '社会保障卡正反面、驾照或护照',
    label: '其他资料',
    valueType: 'upload',
    tips: '社会保障卡正反面、驾照或护照',
    prop: 'socialProofMaterials',
    attrs: {
      accept: 'image/*',
    },
    formTtemAttrs: {
      style: {
        marginLeft: '20px',
        flex: '100%',
      },
    },
    transform: (val = []) => {
      if (val.length === 0)
        return {}
      return {
        socialProofMaterials: val.map(item => item?.url),
      }
    },
    convertValue: (val) => {
      if (!val)
        return []

      return val.map(item => ({ url: item }))
    },
  },
]
