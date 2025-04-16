
import type { ProFormColumn, ProTableColumn } from '@/components/ProComponent'
// 表格项配置，不含操作项
export const tableColumns: ProTableColumn[] = [
  {
    prop: 'id',
    label: '协议ID',
    hideInSearch: true,
  },
  {
    prop: 'title',
    label: '名称',
    hideInSearch: true,
  },
  // {
  //   prop: 'contentData',
  //   label: '内容',
  //   hideInSearch: true,
  // },
  {
    prop: 'updateTime',
    label: '更新时间',
    hideInSearch: true,
  },
  // {
  //   prop: 'embershipLevelId',
  //   label: '适用用户',
  //   valueType: 'select',
  //   initFn: async (formItem) => {
  //     const res = await MarketingCentreAPI.getLevelRulePage()
  //     formItem.valueEnum = res.list.map((item: any) => ({ label: item.levelName, value: item.id }))
  //   },
  //   hideInSearch: true,
  // },
  // {
  //   prop: 'issueStartTime',
  //   label: '发放时间',
  //   hideInSearch: true,
  // },
  {
    prop: 'isDisplay',
    label: '是否展示',
    valueType: 'select',
    valueEnum: [
      { label: '是', value: 1, tagType: 'success' },
      { label: '否', value: 0, tagType: 'info' },
    ],
    hideInSearch: true,
  },
]