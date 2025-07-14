import TextItem from './TextItem.vue'
import ImageItem from './ImageItem.vue'
import SelectItem from './SelectItem.vue'
import ToolItem from './ToolItem.vue'

export {
  TextItem,
  ImageItem,
  SelectItem,
  ToolItem,
}

// 组件映射表
export const componentMap = {
  input: TextItem,
  image: ImageItem,
  select: SelectItem,
  tool: ToolItem,
} as const

export type ComponentType = keyof typeof componentMap
