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
  SwitchProps,
  TimePickerDefaultProps,
} from 'element-plus'

export type IObject = Record<string, any>

// 删除操作按钮 参数只有id没有整条数据
export interface DeleteOperatBtn {
  auths?: string[]
  name: 'delete'
  text: string
  onClick?: (ids: string) => void
}

// 其他操作按钮
export interface OtherOperatBtn<T> {
  auths?: string[]
  name: string
  text: string
  onClick?: (params: T) => void
}

// 操作按钮联合类型
export type ToolOperatBtn<T> = DeleteOperatBtn | OtherOperatBtn<T>

export interface ValueEnum {
  value: any
  label?: string
  tagType?: 'primary' | 'success' | 'info' | 'warning' | 'danger'
  disabled?: boolean
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
  valueType?: keyof AttrsByValueType | 'image' | 'tool'
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
  /**
   * 显示溢出工具提示
   * https://element-plus.org/zh-CN/component/table#%E6%98%BE%E7%A4%BA%E6%BA%A2%E5%87%BA%E5%B7%A5%E5%85%B7%E6%8F%90%E7%A4%BA%E7%9A%84%E8%A1%A8%E6%A0%BC
   */
  showOverflowTooltip?: boolean
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
  'select-with-add': ISelectProps // 新增的类型，暂时复用 ISelectProps
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
  'switch': SwitchProps
  'input-tag': IObject
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
    // 控制formlist: maxLength/minLength
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
    addonAfter?: string | ((props: { 'close-drawer'?: () => void }) => any)
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
    // 监听函数-废弃
    watch?: (newValue: any, oldValue: any, data: T, items: ProFormColumn<T>[], formItemTool: IObject) => void
    watchCallback?: (newVals: any[], options: { oldVals: any[], formData: T, formItems: ProFormColumn<T>[], formItem: ProFormColumn<T> }) => void
    // 依赖字段配置，用于自动注册 watch
    dependency?: (string | string[])[]
    // 计算属性函数
    computed?: (data: T) => any
    // 初始化数据函数扩展
    initFn?: (item: ProFormColumn<T>) => void
  };
}[keyof AttrsByValueType]
