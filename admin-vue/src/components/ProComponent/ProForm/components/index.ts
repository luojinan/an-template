import InputFormItem from './InputFormItem.vue'
import SelectFormItem from './SelectFormItem.vue'
import SelectWithAddFormItem from './SelectWithAddFormItem.vue'
import CascaderFormItem from './CascaderFormItem.vue'
import RadioFormItem from './RadioFormItem.vue'
import CheckboxFormItem from './CheckboxFormItem.vue'
import InputNumberFormItem from './InputNumberFormItem.vue'
import TreeSelectFormItem from './TreeSelectFormItem.vue'
import DatePickerFormItem from './DatePickerFormItem.vue'
import TimePickerFormItem from './TimePickerFormItem.vue'
import TextFormItem from './TextFormItem.vue'
import UploadFormItem from './UploadFormItem.vue'
import SwitchFormItem from './SwitchFormItem.vue'
import InputTagFormItem from './InputTagFormItem.vue'

export const formItemComponentMap = {
  'input': InputFormItem,
  'select': SelectFormItem,
  'select-with-add': SelectWithAddFormItem, // 新增的组件类型
  'cascader': CascaderFormItem,
  'radio': RadioFormItem,
  'checkbox': CheckboxFormItem,
  'input-number': InputNumberFormItem,
  'tree-select': TreeSelectFormItem,
  'date-picker': DatePickerFormItem,
  'time-picker': TimePickerFormItem,
  'text': TextFormItem,
  'upload': UploadFormItem,
  'switch': SwitchFormItem,
  'input-tag': InputTagFormItem,
  undefined: InputFormItem,
}

export type FormItemComponentType = keyof typeof formItemComponentMap
