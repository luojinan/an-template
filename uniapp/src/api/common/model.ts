/**
 * 分页查询参数
 */
export interface PageQuery {
  pageNum: number
  pageSize: number
}

/**
* 字典分页查询对象
*/
export interface dictQuery {
  keywords?: string
  typeCode?: string
  pageNum?: string
  pageSize?: string
}