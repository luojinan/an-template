import type { Plugin } from 'vite'

interface VueQuery {
  vue?: boolean
  src?: string
  type?: 'script' | 'template' | 'style' | 'custom'
  index?: number
  lang?: string
  raw?: boolean
  url?: boolean
  scoped?: boolean
  id?: string
}
function parseVueRequest(id: string): {
  filename: string
  query: VueQuery
} {
  const [filename, rawQuery] = id.split(`?`, 2)
  const query = Object.fromEntries(new URLSearchParams(rawQuery)) as VueQuery
  if (query.vue != null)
    query.vue = true

  if (query.index != null)
    query.index = Number(query.index)

  if (query.raw != null)
    query.raw = true

  if (query.url != null)
    query.url = true

  if (query.scoped != null)
    query.scoped = true

  return {
    filename,
    query,
  }
}

/**
 * 在Vue组件中自动插入defineOptions调用，以设置组件的选项名称
 * 匹配src/views目录下的Vue文件，根据文件路径生成一个唯一的选项名称
 * 当组件的<script>部分包含defineOptions调用时，插件不会进行处理，否则会在</script>标签前插入defineOptions调用
 *
 * @returns {Plugin} 返回一个Vite插件对象。
 */
const insertDefineOptions: () => Plugin = () => {
  // 匹配src/views目录下的Vue文件路径。
  const regex = /src\/views\/(.+?)\.vue$/

  return {
    name: 'vite-plugin-insert-define-options',
    async transform(code, id) {
      const { filename, query } = parseVueRequest(id)

      const match = filename.match(regex)

      if (match && query?.type !== 'style') {
        // 提取路径部分，并将斜杠替换为-
        const transformedPath = match[1].replace(/\//g, '-')
        // 如果代码中已经包含defineOptions调用，则不进行处理。
        if (/defineOptions\(/.test(code))
          return code

        // 在</script>标签前插入defineOptions调用
        const res = code.replace('</script>', `defineOptions({name:'${transformedPath}'})
</script>`)
        // console.log(transformedPath)
        return res
      }
      else {
        return code
      }
    },
  }
}

export default insertDefineOptions
