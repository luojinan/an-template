# h5 vue

使用 NutUI + vue3 的 h5 项目，以嵌入 uniapp 开发的小程序 webview 中，可以保持一定程度相同的组件外观和开发一致性

## Vite

使用 vite 的脚手架，手动选择技术栈，而不是使用 template

- Vue
- Ts
- VueRouter
- Pinia

### Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

### Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## NutUI

[NutUI-vue](https://nutui.jd.com/h5/vue/4x/#/zh-CN/guide/intro)
2024-09 后没有维护

[NutUI-react](https://github.com/jdf2e/nutui-react)
2025-05 都在更新 😅

根据指引安装，vite auto-import component plugin 和 NutUI resole，配置到 viteconfig

并关闭 component plugin 的默认配置，只使用组件库，不使用其他 auto-import 功能
