import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// 获取当前文件的 URL
const __filename = new URL(import.meta.url)
// 将 URL 转换为路径
const __dirname = path.dirname(fileURLToPath(__filename))

// 读取 JSON 文件
// const jsonData = fs.readFileSync(path.join(__dirname, 'api.json'), 'utf8')

// // 解析 JSON 数据
// const apiData = JSON.parse(jsonData)

// you need nodejs height version 17+ to use fetch api
async function fetchJson(url) {
  try {
    const response = await fetch(url)
    if (!response.ok)
      throw new Error(`HTTP error! status: ${response.status}`)

    const jsonData = await response.json()
    return jsonData
  }
  catch (error) {
    console.error('😵 https://dsjedu.com.cn/prod-api/doc.html 接口文档读取失败！', error)
  }
}
const apiName = 'https://dsjedu.com.cn/prod-api/v3/api-docs/管理端'
console.log('🕗 正在读取接口文档内容...')
const apiData = await fetchJson(apiName)
if (!apiData)
  process.exit(0)

console.log('🎉 接口文档读取完成')

// 定义将 Java 类型转换为 TypeScript 类型的函数
function convertType(javaType, itemsType) {
  switch (javaType) {
    case 'integer':
      return 'number'
    case 'array':
      return itemsType ? `${convertType(itemsType)}[]` : 'any[]'
    case 'string':
      return 'string'
    case 'boolean':
      return 'boolean'
    case 'object': // TODO: object 取item定义
      return 'IObject'
    default:
      return javaType
  }
}

function generateMethodName(url, method) {
  // 移除 URL 中的斜杠并替换为驼峰命名法
  const segments = url
    .replace(/\//g, '-')
    .replace(/\{(\w+)\}/g, 'By$1') // 替换 {xx} 为 Byxx
    .split('-')
    .map(seg => seg.charAt(0).toUpperCase() + seg.slice(1).toLowerCase())

  // 拼接成最终的方法名
  const methodName = `${method}${segments.join('')}`

  return methodName
}

function convertUrlToTemplateString({ url }) {
  // 检查 URL 中是否存在花括号占位符
  if (!/\{.*?\}/.test(url))
    return `'${url}'`

  return `\`${url.replace(/\{(\w+)\}/g, '${params.$1}')}\``
}

// 定义生成 TypeScript 类型定义的函数
function generateTypeScriptTypes(apiData) {
  let tsTypes = ''

  // 存储所有类型定义
  const allTypes = {}

  // 遍历 components 中的 schemas
  Object.keys(apiData.components.schemas).forEach((schemaKey) => {
    const schema = apiData.components.schemas[schemaKey]
    tsTypes += `export interface ${schemaKey} {\n`
    Object.keys(schema.properties).forEach((propKey) => {
      const prop = schema.properties[propKey]
      let type = prop.type
      const itemsType = prop.items ? prop.items.type || prop.items.$ref : ''

      if (prop.$ref)
        type = prop.$ref.replace(/^#\/components\/schemas\//, '')
      else
        type = convertType(type, itemsType.replace(/^#\/components\/schemas\//, ''))

      tsTypes += `  ${prop.description ? `/**
   * ${prop.description || ''}
   */
  ` : ''}${propKey}: ${type}
`
    })
    tsTypes += `}\n\n`
    allTypes[schemaKey] = schema
  })

  return { tsTypes, allTypes }
}

// 定义生成前端请求函数的函数
function generateRequestFunctions(apiData, allTypes) {
  let requestFunctions = ''
  const importTypeList = new Set()

  // 遍历 paths 中的每个 API
  Object.keys(apiData.paths).forEach((pathKey) => {
    const pathItem = apiData.paths[pathKey]
    const methods = Object.keys(pathItem)
    methods.forEach((methodKey) => {
      const method = pathItem[methodKey]
      const operationId = method.operationId
      const [tag] = method.tags || []
      const summary = method.summary
      const parameters = method.parameters || []

      let responseType = 'any'
      const content = method.responses['200'].content
      if (content) {
        if (content['*/*'].schema.$ref) { // 引用类型定义
          responseType = content['*/*'].schema.$ref.replace(/^#\/components\/schemas\//, '')
          // 当响应数据结构是{code,data,msg}时取data
          const typeJson = allTypes[responseType]
          if (typeJson && typeJson.type === 'object' && JSON.stringify(Object.keys(typeJson.properties)) === JSON.stringify(['code', 'data', 'msg']))
            responseType = typeJson.properties.data?.$ref?.replace(/^#\/components\/schemas\//, '') || convertType(typeJson.properties.data.type, typeJson.properties.data.items ? typeJson.properties.data.items.$ref?.replace(/^#\/components\/schemas\//, '') || typeJson.properties.data.items.type : 'any')
        }
        // else { console.log(pathKey, content) } // TODO: 处理不是引用而是直接定义的类型 同上object todo
      }
      importTypeList.add(responseType.replace('[]', ''))

      const paramDefinitions = parameters.map((param) => {
        const type = param.schema.$ref ? allTypes[param.schema.$ref.replace(/^#\/components\/schemas\//, '')].type : convertType(param.schema.type, param.schema.items ? param.schema.items.type : null)
        return `${param.name}${param.required ? '' : '?'}: ${type}`
      }).join(', ')

      const requestBody = method.requestBody?.content?.['application/json'] || {}
      let requestData = ''
      if (requestBody) {
        // 还有post请求参数是纯数组的 requestBody?.schema.type=array postApiV1AdminCoursebookingApprovalbooking
        if (requestBody?.schema?.$ref) {
          requestData = requestBody.schema.$ref.replace(/^#\/components\/schemas\//, '')
          importTypeList.add(requestData)
        }
        else if (requestBody?.schema?.type === 'array') {
          requestData = convertType(requestBody.schema.type, requestBody.schema.items ? requestBody.schema.items.type : null)
        }
      }
      const argStr = `${paramDefinitions ? `params: { ${paramDefinitions} }` : ''}${paramDefinitions && requestData ? ', ' : ''}${requestData ? `data: ${requestData}` : ''}`
      requestFunctions += `
/**
 * ${summary}
 *
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/管理端/${tag}/${operationId}
 * 
 * 请求头: ${methodKey} ${pathKey}
 */
export function ${generateMethodName(pathKey, methodKey)}(${argStr}) {
  return request<any, ${responseType}>({
    url: ${convertUrlToTemplateString({ url: pathKey })},
    method: '${methodKey}',${requestData
? `
    data,`
: ''}${paramDefinitions
? `
    params,`
: ''}
  })
}
`
    })
  })

  // new Set数据转化为 import 语句
  const type = Array.from(importTypeList).sort().filter(name => !['any', 'object', 'number', 'string', 'boolean'].includes(name)).join(',\n  ')
  return {
    type,
    requestFunctions,
  }
}

// 生成 TypeScript 类型定义
const { tsTypes, allTypes } = generateTypeScriptTypes(apiData)
// // 生成 TypeScript 类型定义文件内容
const typesOutput = `// Generated by Node.js script
// !!!!! DO NOT EDIT !!!!!

export type IObject = Record<string, any>

${tsTypes}`

// 将生成的 TypeScript 类型定义写入文件
fs.writeFileSync(path.join(__dirname, '../src/utils/proProApi/apiTypes.ts'), typesOutput)

// 生成前端请求函数
const { type, requestFunctions } = generateRequestFunctions(apiData, allTypes)

// 生成前端请求函数文件内容
const apiOutput = `// Generated by Node.js script
// !!!!! DO NOT EDIT !!!!!

import type {
  ${type}
} from './apiTypes'
import request from '@/utils/request'

${requestFunctions}
`

// 将生成的前端请求函数写入文件
fs.writeFileSync(path.join(__dirname, '../src/utils/proProApi/admin.ts'), apiOutput)

console.log('🥳 前端请求函数已生成并写入 src/utils/proProApi/admin.ts')
