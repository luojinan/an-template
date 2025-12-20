# TanStack Start + shadcn/ui

This is a template for a new TanStack Start project with React, TypeScript, and shadcn/ui.

## 依赖

### vite + react 相关

```json

{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
  },
  "devDependencies": {
    "@types/node": "^22.10.2",
    "@types/react": "^19.2.0",
    "@types/react-dom": "^19.2.0",
    "@vitejs/plugin-react": "^5.0.4",
    "typescript": "^5.7.2",
    "vite": "^7.1.7"
    "vite-tsconfig-paths": "^5.1.4"
  }
}
```

### tanstack 相关

`@tanstack/router-plugin` 是什么，在tanstack的模板里没有
ssr query 和 query 是一个东西吗
各个 devtool 的作用

```json
{
  "dependencies": {
    "@tanstack/react-router": "^1.132.0",
    "@tanstack/router-plugin": "^1.132.0",
    "@tanstack/react-start": "^1.132.0",
    "@tanstack/react-router-ssr-query": "^1.131.7",
    // TanStack Start 使用的服务器引擎，提供服务端渲染、API 路由、中间件等全栈功能，自动集成到 TanStack Start，通过文件路由处理 SSR 和 API
    "nitro": "latest"
    // "@tanstack/react-router-devtools": "^1.132.0",
    // "@tanstack/react-devtools": "^0.7.0"
  },
  "devDependencies": {
    // "@tanstack/devtools-vite": "^0.3.11"
  }
}
```

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202512181349975.png?x-oss-process=image/format,webp/resize,w_640)

nitro 是 deployment adapter 的一个选项，其他是(Cloudflare/Netlify)云服务平台，但是 nitro 不是云服务平台，例如要部署到Cloundflare，还是需要安装Cloundflare的vite pluin，那nitro vite plugin 的作用是什么？

如果是包装一层 Cloudflare ，我宁愿直接用 cloudflare 吧

### shadcn 组件相关：

[shadcn 依赖tailwindcss](https://ui.shadcn.com/docs/installation/manual#add-dependencies)

```bash
pnpm add class-variance-authority clsx tailwind-merge tw-animate-css
```

tailwind👇

```json
{
  "dependencies": {
    "@tailwindcss/vite": "^4.0.6",
    "tailwindcss": "^4.0.6",
    // 用于创建类型安全的、基于变体的组件样式系统。简化 variants、sizes、colors 等不同状态的类名管理
    // const button = cva("base-class", { variants: { intent: { primary: "bg-blue", secondary: "bg-gray" } } })
    "class-variance-authority": "^0.7.1",
    // 用于条件性地组合类名字符串。支持字符串、对象、数组等多种格式
    // clsx('btn', { 'btn-active': isActive }, ['extra-class'])
    "clsx": "^2.1.1",
    // 智能合并 Tailwind CSS 类名，避免冲突（如 px-2 px-4 会保留后者）。常与 clsx 配合使用
    // twMerge('px-2 py-1', 'px-4') → 'py-1 px-4'
    "tailwind-merge": "^3.4.0",
    // 为 Tailwind CSS 提供预设的动画类（如淡入淡出、滑动等）
    "tw-animate-css": "^1.4.0"
  }
}
```

shadcn + icon 👇

```json
{
  "dependencies": {
    "@base-ui/react": "^1.0.0",
    "@fontsource-variable/inter": "^5.2.8",
    "@hugeicons/core-free-icons": "^3.0.0",
    "@hugeicons/react": "^1.1.2",
    "shadcn": "^3.6.2"
  }
}
```

### 编辑器相关

tanstack
脚本生成的文件添加 格式化禁止/搜索禁止/修改禁止... 标识给编辑器

`.vscode/settings.json`

```json
{
  "files.watcherExclude": {
    "**/routeTree.gen.ts": true
  },
  "search.exclude": {
    "**/routeTree.gen.ts": true
  },
  "files.readonlyInclude": {
    "**/routeTree.gen.ts": true
  }
}
```

`biome.json`

```json
{
  "files": {
    "ignoreUnknown": false,
    "includes": ["**/src/**/*", "!**/src/routeTree.gen.ts"]
  }
}
```

`.zed/settings.json`

```json
{
  // 1. 只有这个配置参数，且会导致目录看到该文件 2. 默认值不会继承需要手动复制再新增
  "file_scan_exclusions": ["src/routeTree.gen.ts"]
}
```

### 部署 cloudflare

[host Cloudflare](https://tanstack.com/start/latest/docs/framework/react/guide/hosting#cloudflare-workers--official-partner)

```json
{
  "scripts": {
    "deploy": "pnpm build && wrangler deploy"
  },
  "devDependencies": {
    "@cloudflare/vite-plugin": "^1.18.0",
    "wrangler": "^4.55.0"
  }
}
```

add `wrangler.jsonc` & set `cloudflare({ viteEnvironment: { name: 'ssr' } })` vite plugin

## shadcn 组件编写示例

在 shadcn 文档中找合适的组件之后，使用 pnpm 下载组件源码，pnpm会根据项目内指定的组件库（baseui）去下载对应的组件源码

```bash
pnpm dlx shadcn@latest add button
```

组件包含样式，在业务代码中和使用普通组件库相同的方式

```tsx
import { Button } from "@/components/ui/button";

export function ButtonDemo() {
  return <Button size="sm">按钮</Button>;
}
```

如果需要二次开发，是 `@/components/myUI/MyButton.tsx` 引入 `@/components/ui/button` ？还是直接修改 `@/components/ui/button`?

👇 增加业务逻辑，处理权限码的按钮，如下：

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202512181536208.png?x-oss-process=image/format,webp)

🤔 baseui 是一个只有属性/状态和事件的无样式组件库，例如button组件，只有disable状态控制
，内部没有任何button标签的样式，如：disable状态控制是否触发onclick、是否开启focusableWhenDisabled样式，但是样式是空的，基本无法直接使用

而shadcn则基于tailwindcss给baseui提供样式，编写一套带着样式，以及额外状态的组件源码，由用户通过pnpm下载到自己的业务代码中，此时为正常的基础组件（基础组件过于基础一般都要继承来额外开发 或者直接拉第三方继承shadcn基础组件二次开发过的组件源码...）

业务代码可以再继承一次添加业务状态和逻辑，变为业务组件
