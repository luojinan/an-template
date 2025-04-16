import type { TeacherForm } from '@/api/teacher/model'
import type { ProFormColumn } from '@/components/ProComponent'

export const aboutMeColumn: ProFormColumn<TeacherForm['introduction']>[] = [
  {
    label: '导师头像',
    valueType: 'upload',
    prop: 'avatarUrl',
    attrs: {
      limit: 1,
      accept: 'image/*',
    },
    transform: (val) => {
      return {
        avatarUrl: val?.[0]?.url,
      }
    },
    convertValue: (val) => {
      if (!val) { return [] }

      return [{ url: val }]
    },
  },
]
