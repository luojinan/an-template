import InputFormItem from './InputFormItem.vue'
import SelectFormItem from './SelectFormItem.vue'
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

export const formItemComponentMap = {
  'input': InputFormItem,
  'select': SelectFormItem,
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
  undefined: InputFormItem,
}

export type FormItemComponentType = keyof typeof formItemComponentMap
