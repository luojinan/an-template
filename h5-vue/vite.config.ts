import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import NutUIResolver from '@nutui/auto-import-resolver'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 开启 unplugin 插件，自动引入 NutUI 组件
    Components({
      resolvers: [NutUIResolver()],
      globs: [], // 关闭默认的 dirs src/components
      directives: false, // 关闭默认的 auto import 自定义directives
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
