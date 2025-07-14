import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import type { ConfigEnv } from 'vite'
import { defineConfig, loadEnv } from 'vite'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

import UnoCSS from 'unocss/vite'
import {
  dependencies,
  devDependencies,
  engines,
  name,
  version,
} from './package.json'
import insertDefineOptions from './scripts/insertDefineOptions'

/** 平台的名称、版本、运行所需的`node`版本、依赖、构建时间的类型提示 */
const __APP_INFO__ = {
  pkg: { name, version, engines, dependencies, devDependencies },
  buildTimestamp: Date.now(),
}

const pathSrc = resolve(__dirname, 'src')
//  https://cn.vitejs.dev/config
export default defineConfig(({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd())
  return {
    experimental: {
      // 导致样式文件丢失
      enableNativePlugin: false,
    },
    resolve: {
      alias: {
        '@': pathSrc,
      },
    },
    css: {
      // CSS 预处理器
      preprocessorOptions: {
        // 定义全局 SCSS 变量
        scss: {
          javascriptEnabled: true,
          additionalData: `
            @use "@/styles/variables.scss" as *;
          `,
        },
      },
    },
    server: {
      // 允许IP访问
      host: '0.0.0.0',
      // 应用端口 (默认:3000)
      port: Number(env.VITE_APP_PORT),
      // 运行是否自动打开浏览器
      open: true,
      proxy: {
        /** 代理前缀为 /dev-api 的请求  */
        [env.VITE_APP_BASE_API]: {
          changeOrigin: true,
          // 接口地址
          target: env.VITE_APP_API_URL,
          // secure: false,
          rewrite: path =>
            path.replace(new RegExp(`^${env.VITE_APP_BASE_API}`), ''),
        },
      },
    },
    preview: {
      host: '0.0.0.0',
      open: false,
      port: 5500,
      allowedHosts: true,
    },
    plugins: [
      insertDefineOptions(),
      vue(),
      vueJsx(),
      UnoCSS(),
      ElementPlus({
        // options
      }),
      // 自动导入参考： https://github.com/sxzz/element-plus-best-practices/blob/main/vite.config.ts
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ['vue', '@vueuse/core', 'pinia', 'vue-router'],
        resolvers: [
          // 自动导入图标组件
          IconsResolver({}),
        ],
        eslintrc: {
          // 是否自动生成 eslint 规则，建议生成之后设置 false
          enabled: false,
          // 指定自动导入函数 eslint 规则的文件
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true,
        },
        // 是否在 vue 模板中自动导入
        vueTemplate: true,
        // 指定自动导入函数TS类型声明文件路径 (false:关闭自动生成)
        dts: false,
        // dts: "src/typings/auto-imports.d.ts",
      }),
      Components({
        resolvers: [
          // 自动注册图标组件
          IconsResolver({
            // element-plus图标库，其他图标库 https://icon-sets.iconify.design/
            enabledCollections: ['ep'],
          }),
        ],
        // 指定自定义组件位置(默认:src/components)
        dirs: ['src/components', 'src/**/components'],
        // 指定自动导入组件TS类型声明文件路径 (false:关闭自动生成)
        dts: false,
        // dts: "src/typings/components.d.ts",
      }),
      Icons({
        // 自动安装图标库
        autoInstall: true,
      }),
    ],
    // 预加载项目必需的组件
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'axios',
        '@vueuse/core',
        'sortablejs',
        'path-to-regexp',
        'echarts',
        '@wangeditor/editor',
        '@wangeditor/editor-for-vue',
        'path-browserify',
        'element-plus/es/**',
      ],
    },
    // 构建配置
    build: {
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2000, // 消除打包大小超过500kb警告
      rollupOptions: {
        output: {
          // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
          entryFileNames: 'js/[name].[hash].js',
          // 用于命名代码拆分时创建的共享块的输出命名
          chunkFileNames: (chunkInfo) => {
            let name = ''
            const moduleIds = chunkInfo.moduleIds
            // 出现了空数组的 moduleIds 是业务组件
            if (moduleIds.length === 0) {
              return 'js/[name].[hash].js'
            }
            const lastModuleId = moduleIds[moduleIds.length - 1]
            if (lastModuleId.includes('node_modules')) {
              return 'js/vendor-[name].[hash].js'
            }
            if (
              lastModuleId.match(/src\/(.*)$/)
              && (chunkInfo.isDynamicEntry || chunkInfo.name === 'index')
            ) {
              const match = lastModuleId.match(/src\/(.*)$/)
              if (match && match[1]) {
                name = match[1].replace(/\//g, '-').replace(/\.[^/.]+$/, '')
              }
            }
            // 如果 name以index结尾则移除index
            if (name.endsWith('index')) {
              name = name.slice(0, -6)
            }
            return `js/${name || '[name]'}.[hash].js`
          },
          // 用于输出静态资源的命名，[ext]表示文件扩展名
          assetFileNames: (assetInfo: any) => {
            // console.log('assetInfo', Object.keys(assetInfo))
            // const info = assetInfo.name.split('.') // NOTE:不再有name {names:[''],originalFileNames:[''],source,type:'asset'}
            const info = assetInfo.names[0].split('.')
            let extType = info[info.length - 1]
            // console.log('文件信息', assetInfo.name)
            if (
              /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)
            ) { extType = 'media' }
            else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name)) { extType = 'img' }
            else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) { extType = 'fonts' }

            return `${extType}/[name].[hash].[ext]`
          },
          // 只有被多个入口使用才会被拆分，如editedialog的组件使用了1次大依赖，则不会出现在vendor逻辑里，如pinia、axios只在一个入口使用，不会被拆到vendor
          // FIXME: advancedChunks groups 导致 element-plus 变大
          advancedChunks: {
            groups: [
              // {
              //   name: 'vendor-axios',
              //   test: 'axios',
              // },
              // {
              //   name: 'vendor-pinia',
              //   test: 'pinia',
              // },
            ],
          },
        },
      },
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
  }
})
