/**
 * API类型定义和请求函数生成脚本
 *
 * 此脚本从多个API文档源读取OpenAPI定义，并自动生成:
 * 1. 每个API源对应的TypeScript类型定义文件
 * 2. 每个API源对应的请求函数文件
 * 3. 通用类型定义文件（如IObject等）
 *
 * 使用方法:
 * 1. 在API_CONFIGS数组中配置API文档源，包括：
 *    - name: 用于标识和输出文件名
 *    - url: API文档URL
 *    - outputPath: 请求函数文件输出路径
 *    - typesPath: 类型定义文件输出路径
 *    - docBaseUrl: 文档基础URL
 * 2. 运行 node scripts/tsapi.js
 *
 * 依赖:
 * - Node.js 17+（使用了fetch API）
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

// 获取当前文件的 URL
const __filename = new URL(import.meta.url);
// 将 URL 转换为路径
const __dirname = path.dirname(fileURLToPath(__filename));

// 多API源配置
const API_CONFIGS = [
  {
    name: "wx", // 用于标识和输出文件名
    url: "https://dsjedu.com.cn/prod-api/v3/api-docs/小程序端", // API文档URL
    outputPath: "../src/utils/proApi/wx.ts", // 输出文件路径（相对于scripts目录）
    typesPath: "../src/utils/proApi/types/wxTypes.ts", // 类型定义文件路径
    docBaseUrl: "https://dsjedu.com.cn/prod-api/doc.html#/小程序端", // 文档基础URL（用于生成文档链接）
  },
  // {
  //   name: "system", // 用于标识和输出文件名
  //   url: "https://dsjedu.com.cn/prod-api/v3/api-docs/系统端", // API文档URL
  //   outputPath: "../src/utils/proApi/system.ts", // 输出文件路径（相对于scripts目录）
  //   typesPath: "../src/utils/proApi/types/systemTypes.ts", // 类型定义文件路径
  //   docBaseUrl: "https://dsjedu.com.cn/prod-api/doc.html#/系统端", // 文档基础URL（用于生成文档链接）
  // },
  // 可以添加更多API源配置
  // {
  //   name: 'client',
  //   url: 'https://tenvia.cn/client-api/v3/api-docs',
  //   outputPath: '../src/utils/proApi/client.ts',
  //   typesPath: '../src/utils/proApi/types/clientTypes.ts',
  //   docBaseUrl: 'https://tenvia.cn/client-api/doc.html',
  // },
];

// 定义共享类型定义文件的路径（仅包含通用类型，如IObject）
const COMMON_TYPES_PATH = "../src/utils/proApi/types/commonTypes.ts";

// 读取 JSON 文件
// const jsonData = fs.readFileSync(path.join(__dirname, 'api.json'), 'utf8')

// // 解析 JSON 数据
// const apiData = JSON.parse(jsonData)

// you need nodejs height version 17+ to use fetch api
async function fetchJson(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error(`😵 ${url} 接口文档读取失败！`, error);
    return null;
  }
}

// 定义将 Java 类型转换为 TypeScript 类型的函数
function convertType(javaType, itemsType) {
  switch (javaType) {
    case "integer":
      return "number";
    case "array":
      return itemsType ? `${convertType(itemsType)}[]` : "any[]";
    case "string":
      return "string";
    case "boolean":
      return "boolean";
    case "object": // TODO: object 取item定义
      return "IObject";
    default:
      return javaType;
  }
}

function generateMethodName(url, method) {
  // 移除 URL 中的斜杠并替换为驼峰命名法
  const segments = url
    .replace(/\//g, "-")
    .replace(/\{(\w+)\}/g, "By$1") // 替换 {xx} 为 Byxx
    .split("-")
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1).toLowerCase());

  // 拼接成最终的方法名
  const methodName = `${method}${segments.join("")}`;

  return methodName;
}

function convertUrlToTemplateString({ url }) {
  // 检查 URL 中是否存在花括号占位符
  if (!/\{.*?\}/.test(url)) return `'${url.slice(1)}'`;

  // 使用字符串拼接替代模板字符串，避免linter错误
  return `\`${url.replace(/\{(\w+)\}/g, "${params.$1}").slice(1)}\``;
}

// 定义生成 TypeScript 类型定义的函数
function generateTypeScriptTypes(apiData) {
  let tsTypes = "";

  // 存储所有类型定义
  const allTypes = {};

  // 遍历 components 中的 schemas
  Object.keys(apiData.components.schemas).forEach((schemaKey) => {
    const schema = apiData.components.schemas[schemaKey];
    tsTypes += `export interface ${schemaKey} {\n`;
    Object.keys(schema.properties)
      .sort()
      .forEach((propKey) => {
        const prop = schema.properties[propKey];
        let type = prop.type;
        const itemsType = prop.items ? prop.items.type || prop.items.$ref : "";

        if (prop.$ref) {
          type = prop.$ref.replace(/^#\/components\/schemas\//, "");
        } else {
          type = convertType(
            type,
            itemsType.replace(/^#\/components\/schemas\//, ""),
          );
        }

        tsTypes += `  ${prop.description
          ? `/**
   * ${prop.description || ""}
   */
  `
          : ""
          }${propKey}: ${type}
`;
      });
    tsTypes += `}\n\n`;
    allTypes[schemaKey] = schema;
  });

  return { tsTypes, allTypes };
}

// 定义生成前端请求函数的函数
function generateRequestFunctions(apiData, allTypes, docBaseUrl) {
  let requestFunctions = "";
  const importTypeList = new Set();

  // 遍历 paths 中的每个 API
  Object.keys(apiData.paths).forEach((pathKey) => {
    const pathItem = apiData.paths[pathKey];
    const methods = Object.keys(pathItem);
    methods.forEach((methodKey) => {
      const method = pathItem[methodKey];
      const operationId = method.operationId;
      const [tag] = method.tags || [];
      const summary = method.summary;
      const parameters = method.parameters || [];

      let responseType = "any";
      const content = method.responses["200"]?.content;
      if (content) {
        if (content["*/*"]?.schema?.$ref) {
          // 引用类型定义
          responseType = content["*/*"].schema.$ref.replace(
            /^#\/components\/schemas\//,
            "",
          );
          // 当响应数据结构是{code,data,msg}时取data
          const typeJson = allTypes[responseType];
          if (
            typeJson &&
            typeJson.type === "object" &&
            JSON.stringify(Object.keys(typeJson.properties)) ===
            JSON.stringify(["code", "data", "msg"])
          ) {
            responseType =
              typeJson.properties.data?.$ref?.replace(
                /^#\/components\/schemas\//,
                "",
              ) ||
              convertType(
                typeJson.properties.data.type,
                typeJson.properties.data.items
                  ? typeJson.properties.data.items.$ref?.replace(
                    /^#\/components\/schemas\//,
                    "",
                  ) || typeJson.properties.data.items.type
                  : "any",
              );
          }
        }
        // else { console.log(pathKey, content) } // TODO: 处理不是引用而是直接定义的类型 同上object todo
      }
      importTypeList.add(responseType.replace("[]", ""));

      const paramDefinitions = parameters
        .map((param) => {
          const type = param.schema.$ref
            ? allTypes[
              param.schema.$ref.replace(/^#\/components\/schemas\//, "")
            ].type
            : convertType(
              param.schema.type,
              param.schema.items ? param.schema.items.type : null,
            );
          return `${param.name}${param.required ? "" : "?"}: ${type}`;
        })
        .join(", ");

      const requestBody =
        method.requestBody?.content?.["application/json"] || {};
      let requestData = "";
      if (requestBody) {
        // 还有post请求参数是纯数组的 requestBody?.schema.type=array postApiV1AdminCoursebookingApprovalbooking
        if (requestBody?.schema?.$ref) {
          requestData = requestBody.schema.$ref.replace(
            /^#\/components\/schemas\//,
            "",
          );
          importTypeList.add(requestData);
        } else if (requestBody?.schema?.type === "array") {
          requestData = convertType(
            requestBody.schema.type,
            requestBody.schema.items ? requestBody.schema.items.type : null,
          );
        }
      }
      const argStr = `${paramDefinitions ? `params: { ${paramDefinitions} }` : ""},${requestData ? ` data: ${requestData},` : ""
        } options?: RequestOptions`;
      requestFunctions += `
/**
 * ${summary}
 *
 * 接口文档: ${docBaseUrl}/${tag}/${operationId}
 *
 * 请求头: ${methodKey} ${pathKey}
 */
export function ${generateMethodName(pathKey, methodKey)}(${argStr.replace(/^\s*,\s*/, "")}) {
  return request<any, ${responseType}>(
    ${convertUrlToTemplateString({ url: pathKey })},
    ${requestData ? "data" : paramDefinitions ? "params" : "{}"},
    { requestType: '${methodKey.toUpperCase()}', ...options }
  ).then(res => res)
}
`;
    });
  });

  // new Set数据转化为 import 语句
  const type = Array.from(importTypeList)
    .sort()
    .filter(
      (name) =>
        !["any", "object", "number", "string", "boolean"].includes(name),
    )
    .join(",\n  ");
  return {
    type,
    requestFunctions,
  };
}

// 合并多个API数据源的类型定义
async function processAllApiSources() {
  console.log("🕗 开始处理多个API数据源...");

  // 存储所有API数据和类型定义
  const apiDataCollection = [];
  const allSchemasBySource = {}; // 按源存储类型信息

  // 获取所有API数据
  for (const config of API_CONFIGS) {
    console.log(`🔍 正在读取 ${config.name} 接口文档内容: ${config.url}`);
    const apiData = await fetchJson(config.url);

    if (!apiData) {
      console.error(`❌ 无法获取 ${config.name} API文档数据，跳过此数据源`);
      continue;
    }

    // 提取类型定义
    const { allTypes } = generateTypeScriptTypes(apiData);

    // 保存API数据、配置和类型信息
    apiDataCollection.push({
      config,
      apiData,
      allTypes,
    });

    // 存储该源的类型信息
    allSchemasBySource[config.name] = allTypes;
  }

  if (apiDataCollection.length === 0) {
    console.error("❌ 没有成功获取任何API文档数据，程序终止");
    process.exit(1);
  }

  console.log(`✅ 成功获取了 ${apiDataCollection.length} 个API数据源`);

  // 生成通用类型定义文件（只包含IObject等通用类型）
  const commonTypesOutput = `// Generated by Node.js script
// !!!!! DO NOT EDIT !!!!!

export type IObject = Record<string, any>
`;

  // 确保类型目录存在
  const typesDirPath = path.dirname(
    path.join(__dirname, API_CONFIGS[0].typesPath),
  );
  if (!fs.existsSync(typesDirPath)) {
    fs.mkdirSync(typesDirPath, { recursive: true });
    console.log(`📁 创建类型定义目录: ${typesDirPath}`);
  }

  // 将生成的通用类型定义写入文件
  fs.writeFileSync(path.join(__dirname, COMMON_TYPES_PATH), commonTypesOutput);
  console.log(`📝 已生成通用类型定义文件: ${COMMON_TYPES_PATH}`);

  // 为每个API数据源生成独立的类型定义和请求函数
  for (const { config, apiData, allTypes } of apiDataCollection) {
    console.log(`🔧 正在为 ${config.name} 生成类型定义和API请求函数...`);

    // 生成当前数据源的类型定义
    let tsTypes = "";
    Object.keys(allTypes).forEach((schemaKey) => {
      const schema = allTypes[schemaKey];
      tsTypes += `export interface ${schemaKey} {\n`;

      if (schema.properties) {
        Object.keys(schema.properties)
          .sort()
          .forEach((propKey) => {
            const prop = schema.properties[propKey];
            let type = prop.type;
            const itemsType = prop.items
              ? prop.items.type || prop.items.$ref
              : "";

            if (prop.$ref) {
              type = prop.$ref.replace(/^#\/components\/schemas\//, "");
            } else {
              type = convertType(
                type,
                itemsType.replace(/^#\/components\/schemas\//, ""),
              );
            }

            tsTypes += `  ${prop.description
              ? `/**
   * ${prop.description || ""}
   */
  `
              : ""
              }${propKey}: ${type}
`;
          });
      } else {
        tsTypes += "  // Schema without properties\n";
      }

      tsTypes += `}\n\n`;
    });

    // 生成类型定义文件内容
    const typesOutput = `// Generated by Node.js script
// !!!!! DO NOT EDIT !!!!!

import type { IObject } from './commonTypes'

${tsTypes}`;

    // 将生成的类型定义写入文件
    fs.writeFileSync(path.join(__dirname, config.typesPath), typesOutput);
    console.log(`📝 已生成 ${config.name} 类型定义文件: ${config.typesPath}`);

    // 生成当前数据源的请求函数
    const { type, requestFunctions } = generateRequestFunctions(
      apiData,
      allTypes,
      config.docBaseUrl,
    );

    // 从相对路径计算类型文件的导入路径
    const outputDir = path.dirname(path.join(__dirname, config.outputPath));
    const typesDir = path.dirname(path.join(__dirname, config.typesPath));
    const typesFileName = path.basename(config.typesPath, ".ts");

    // 计算从API文件到类型文件的相对路径
    const relativeTypesPath = path
      .relative(outputDir, path.join(typesDir, typesFileName))
      .replace(/\\/g, "/");

    // 生成请求函数文件内容
    const apiOutput = `// Generated by Node.js script
// !!!!! DO NOT EDIT !!!!!

import type {
  ${type}
} from './${relativeTypesPath}'
import request from '@/utils/request'

type RequestOptions = {
  requestType?: 'GET' | 'POST' | 'PUT' | 'DELETE',
  showLoading?: boolean,
  showError?: boolean
}

${requestFunctions}
`;

    // 将生成的请求函数写入文件
    fs.writeFileSync(path.join(__dirname, config.outputPath), apiOutput);
    console.log(`🥳 已生成 ${config.name} 请求函数文件: ${config.outputPath}`);
  }

  console.log("🎉 所有API文件生成完成");
}

// 执行处理
processAllApiSources().catch((error) => {
  console.error("❌ 处理过程中出现错误:", error);
  process.exit(1);
});
