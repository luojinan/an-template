import type {
  CascaderProps,
  CheckboxProps,
  DatePickerProps,
  FormItemRule,
  ISelectProps,
  InputNumberProps,
  InputProps,
  PaginationProps,
  RadioProps,
  TimePickerDefaultProps,
} from 'element-plus'

export type IObject = Record<string, any>

export interface ToolOperatBtn<T> {
  auths?: string[]
  name: string
  text: string
  onClick?: (params: T) => void
}

export interface ValueEnum {
  value: any
  label: string
  tagType?: 'primary' | 'success' | 'info' | 'warning' | 'danger'
}

// table组件列属性(额外的属性templet,operat,slotName)
export interface ProTableColumn<T = IObject> {
  type?: 'default' | 'selection' | 'index' | 'expand'
  label?: string
  prop?: keyof T
  width?: string | number
  hideInSearch?: boolean
  hideInTable?: boolean
  formatFn?: (val: any, allData: T) => string
  onClick?: (params: T) => void
  // 初始化数据函数
  initFn?: (item: ProTableColumn<T>) => void
  // 模板
  valueType?:
    | 'image'
    | 'select'
    | 'url'
    | 'switch'
    | 'input'
    | 'price'
    | 'percent'
    | 'icon'
    | 'date'
    | 'tool'
    | 'custom'
    | 'date-picker'
  // 组件可选项(适用于select,radio,checkbox组件)
  valueEnum?: ValueEnum[]
  // image模板相关参数
  imageWidth?: number
  imageHeight?: number
  // tool模板相关参数
  operat?: ToolOperatBtn<T>[] | ((params: T) => ToolOperatBtn<T>[] | undefined)
  // filter值拼接符
  filterJoin?: string
  columnKey?: string
  [key: string]: any
}

// pagination组件属性
export type Pagination = boolean
  | Partial<
        Omit<
          PaginationProps,
          'v-model:page-size' | 'v-model:current-page' | 'total' | 'currentPage'
        >
      >

interface AttrsByValueType {
  'input': InputProps
  'select': ISelectProps
  'radio': RadioProps
  'checkbox': CheckboxProps
  'tree-select': IObject
  'date-picker': DatePickerProps
  'time-picker': TimePickerDefaultProps
  'input-number': InputNumberProps
  'text': IObject
  'upload': IObject
  'formList': IObject
  'custom': IObject
  'cascader': CascaderProps
  'group': IObject
}

/**
 * 表单组件属性
 * column 为常量数据用于初始化表单，不支持响应式
 * 当需要动态修改column时，应该通过具体表单项中watch配置方法里抛出的items响应式数据修改
 * 当需要替换整个column重新生成表单时，应该使用v-if销毁重建表单
 */

// 定义一个条件类型，它将根据 type 的值来返回一个对象类型，该对象包含正确的 attrs 类型
export type ProFormColumn<T = any> = {
  [K in keyof AttrsByValueType]: {
    // 组件类型(如input,select,radio,custom等，默认input)
    valueType?: K
    // valueType对应的组件属性
    attrs?: Partial<AttrsByValueType[K]>
    /** ElFormItem的组件属性 */
    formTtemAttrs?: any
    columns?: ProFormColumn<T>[]
    // 组件可选项(适用于select,radio,checkbox组件)
    valueEnum?: ValueEnum[]
    // 插槽名(适用于组件类型为custom)
    slotName?: string
    // 标签文本
    label?: string
    // 标签提示
    tips?: string
    // 键名
    prop?: keyof T
    key?: string
    addonAfter?: string
    // 验证规则
    rules?: FormItemRule[]
    // 初始值
    initialValue?: any
    /**
     * 是否隐藏，类比vue的v-show，仅仅隐藏展示，最终根据form表单取值可以取到，且内部数据处理逻辑会触发
     *
     * 这在编辑表单时不展示id表单，但是可以设置id字段时非常有用，id字段将跟随你的表单数据，而不需要手动存取
     */
    hidden?: boolean
    /**
     * 是否销毁，类比vue的v-if，隐藏展示，在最终根据form表单取值时无法取到，如果你希望最终能取到该数据，应使用hidden，或使用todo
     * 仍会触发watch
     */
    unMounted?: boolean
    // 获取表单值时转化函数，不会作用于渲染值，仅作用于获取值
    transform?: (value: any, itemConfig: ProFormColumn<T>) => any
    // setformData 时对数据做的处理 v-model change时不会触发
    convertValue?: (value: any, alldata: T) => any
    // 监听函数
    watch?: (newValue: any, oldValue: any, data: T, items: ProFormColumn<T>[], formItemTool: IObject) => void
    // 计算属性函数
    computed?: (data: T) => any
    // 监听收集函数
    // watchEffect?: (data: T) => void
    // 初始化数据函数扩展
    initFn?: (item: ProFormColumn<T>) => void
  };
}[keyof AttrsByValueType]
