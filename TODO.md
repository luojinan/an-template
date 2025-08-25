# 全栈开发模板规划 (fullstack-template)

## 技术栈概述
- **Monorepo 管理**: Turborepo
- **前端框架**: Next.js 15 + React 19
- **UI 组件库**: shadcn/ui + Tailwind CSS
- **后端 API**: Hono + Cloudflare Workers
- **数据库**: Supabase
- **构建工具**: Vite (用于共享包) + Next.js (用于前端应用)
- **包管理器**: pnpm
- **代码质量**: Biome (替代 ESLint + Prettier)

## 项目结构规划

```
fullstack-template/
├── README.md
├── package.json                    # 根包，定义 workspace
├── pnpm-workspace.yaml            # pnpm workspace 配置
├── turbo.json                     # Turborepo 构建配置
├── biome.json                     # 代码格式化和检查配置
├── .env.example                   # 环境变量示例
├── 
├── apps/                          # 应用程序目录
│   ├── web/                       # Next.js 前端应用
│   │   ├── package.json
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   ├── components.json        # shadcn/ui 配置
│   │   ├── src/
│   │   │   ├── app/              # App Router
│   │   │   ├── components/       # 应用组件
│   │   │   ├── lib/             # 工具函数
│   │   │   └── styles/          # 样式文件
│   │   └── public/              # 静态资源
│   │
│   └── api/                      # Hono API 服务 (Cloudflare Worker)
│       ├── package.json
│       ├── wrangler.toml         # Cloudflare Worker 配置
│       ├── src/
│       │   ├── index.ts          # API 入口
│       │   ├── routes/           # API 路由
│       │   ├── middleware/       # 中间件
│       │   ├── lib/             # 工具函数
│       │   └── types/           # 类型定义
│       └── migrations/          # 数据库迁移文件
│
├── packages/                     # 共享包目录
│   ├── ui/                       # 共享 UI 组件包
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   ├── src/
│   │   │   ├── components/       # 共享组件
│   │   │   ├── hooks/           # 共享 hooks
│   │   │   └── index.ts         # 导出入口
│   │   └── dist/                # 构建输出
│   │
│   ├── database/                 # Supabase 数据库配置
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── client.ts         # Supabase 客户端
│   │   │   ├── types.ts          # 数据库类型
│   │   │   └── queries/          # 数据库查询
│   │   └── migrations/           # 数据库迁移
│   │
│   ├── shared/                   # 共享工具和类型
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── types/            # 共享类型定义
│   │   │   ├── utils/            # 共享工具函数
│   │   │   ├── constants/        # 常量定义
│   │   │   └── validations/      # 数据验证 (Zod)
│   │   └── dist/
│   │
│   └── config/                   # 共享配置
│       ├── package.json
│       ├── src/
│       │   ├── tailwind/         # Tailwind 预设配置
│       │   ├── typescript/       # TypeScript 配置
│       │   └── biome/            # Biome 配置
│       └── dist/
│
```

## 初始化命令

### 使用工具链生成模板文件

#### 1. 创建项目根目录
```bash
mkdir fullstack-template
cd fullstack-template
```

#### 2. 初始化 Monorepo 基础结构
```bash
# 初始化根 package.json
pnpm init

# 创建 workspace 配置
echo "packages:" > pnpm-workspace.yaml
echo "  - 'apps/*'" >> pnpm-workspace.yaml
echo "  - 'packages/*'" >> pnpm-workspace.yaml

# 创建基本目录结构
mkdir -p apps packages
```

#### 3. 创建 Next.js Web 应用
```bash
# 使用 create-next-app 创建 Next.js 15 应用
cd apps
npx create-next-app@latest web \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-pnpm
```

#### 4. 初始化 shadcn/ui
```bash
cd web
npx shadcn@latest init
# 选择配置选项：
# - TypeScript: Yes
# - Tailwind CSS: Yes
# - src/ directory: Yes
# - App Router: Yes
# - Import alias: @/*
```

#### 5. 创建 Hono API 应用
```bash
cd ../.. # 回到根目录
cd apps
pnpm create hono@latest api
# 选择 Cloudflare Workers 模板
```

#### 6. 使用 Vite 创建共享包
```bash
cd ../packages

# 创建 UI 包
pnpm create vite ui --template react-ts
cd ui
# 配置为 library 模式，修改 vite.config.ts

# 创建 shared 包
cd ..
pnpm create vite shared --template vanilla-ts
cd shared
# 配置为 library 模式

# 创建 config 包
cd ..
pnpm create vite config --template vanilla-ts
cd config
# 配置为 library 模式
```

#### 7. 创建 database 包
```bash
cd ../packages
mkdir database
cd database
pnpm init
# 手动添加 Supabase 相关依赖
pnpm add @supabase/supabase-js
pnpm add -D typescript
```

#### 8. 安装 Turborepo
```bash
cd ../.. # 回到根目录
pnpm add -D turbo
```

#### 9. 配置 Biome
```bash
pnpm add -D @biomejs/biome
npx biome init
```

### 快速初始化脚本

可以创建一个自动化脚本 `init-fullstack-template.sh`：

```bash
#!/bin/bash

echo "🚀 创建全栈模板..."

# 1. 创建项目结构
mkdir fullstack-template && cd fullstack-template
mkdir -p apps packages

# 2. 初始化根 package.json
pnpm init -y

# 3. 创建 workspace 配置
cat > pnpm-workspace.yaml << EOF
packages:
  - 'apps/*'
  - 'packages/*'
EOF

# 4. 创建 Next.js 应用
cd apps
npx create-next-app@latest web \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-pnpm \
  --skip-install

# 5. 创建 Hono API
pnpm create hono@latest api --template cloudflare-workers --skip-install

# 6. 创建共享包
cd ../packages
pnpm create vite ui --template react-ts --skip-install
pnpm create vite shared --template vanilla-ts --skip-install
pnpm create vite config --template vanilla-ts --skip-install

mkdir database && cd database && pnpm init -y

# 7. 回到根目录，安装依赖
cd ../..
pnpm add -D turbo @biomejs/biome typescript

# 8. 安装所有依赖
pnpm install

echo "✅ 全栈模板初始化完成！"
echo "📁 项目结构已创建，请根据 TODO.md 继续配置"
```

## 详细规划

### 1. Monorepo 架构设计

#### 1.1 包管理策略
- **pnpm workspace**: 管理依赖和包版本
- **Turborepo**: 构建缓存和任务编排
- **内部包命名**: `@fullstack-template/ui`, `@fullstack-template/database` 等

#### 1.2 依赖管理原则
- 根包只包含开发工具依赖
- 各子包独立管理自己的依赖
- 共享依赖提升到根包
- 版本锁定策略确保一致性

### 2. 前端应用 (apps/web)

#### 2.1 Next.js 15 配置
- App Router 架构
- 服务端组件为主，客户端组件按需
- 图片优化和字体优化
- 支持 PWA (可选)

#### 2.2 shadcn/ui 集成
- 完整的组件库配置
- 深色模式支持
- 响应式设计
- 自定义主题配置

#### 2.3 状态管理
- 使用 React Server Components 减少客户端状态
- Zustand 用于复杂客户端状态
- React Query/TanStack Query 用于服务端状态

### 3. 后端 API (apps/api)

#### 3.1 Hono 框架配置
- 类型安全的路由定义
- 中间件集成 (认证、日志、CORS 等)
- 请求验证 (Zod)
- 错误处理机制

#### 3.2 Cloudflare Worker 集成
- 边缘计算优化
- 环境变量管理
- KV 存储集成 (可选)
- D1 数据库支持 (可选)

#### 3.3 API 设计原则
- RESTful API 设计
- 统一的响应格式
- API 文档生成 (OpenAPI)
- 版本控制策略

### 4. 数据库层 (packages/database)

#### 4.1 Supabase 集成
- 类型安全的数据库客户端
- 实时订阅功能
- 认证和授权集成
- 存储桶管理

#### 4.2 数据库设计
- 表结构设计
- 索引优化
- RLS (Row Level Security) 策略
- 触发器和函数

### 5. 共享包设计

#### 5.1 UI 包 (packages/ui)
- 基于 shadcn/ui 的扩展组件
- 构建优化 (Tree-shaking)

#### 5.2 共享工具包 (packages/shared)
- 类型定义共享
- 工具函数库
- 常量定义
- 数据验证 schema

### 6. 构建和部署策略

#### 6.1 Turborepo 配置
- 增量构建
- 并行任务执行
- 构建缓存策略
- 依赖图优化

#### 6.2 部署流程
- **前端**: Vercel 自动部署
- **API**: Cloudflare Workers 部署
- **数据库**: Supabase 托管
- **CI/CD**: 使用项目内置的 scripts，简化部署流程

### 7. 开发工具配置

#### 7.1 代码质量
- Biome 统一代码格式化
- TypeScript 严格模式

#### 7.2 开发体验
- 热重载配置
- 调试工具集成
- 环境变量管理
- 本地开发环境同步

## 核心文件规划

### package.json (根目录)
```json
{
  "name": "@fullstack-template/root",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "clean": "turbo run clean"
  },
  "devDependencies": {
    "@biomejs/biome": "latest",
    "turbo": "latest",
    "typescript": "latest"
  },
  "packageManager": "pnpm@8.0.0"
}
```

### turbo.json
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
  }
}
```

## 环境变量规划

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Cloudflare
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ACCOUNT_ID=

# Next.js
NEXT_PUBLIC_APP_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# API
API_BASE_URL=
```

## 开发命令规划

### 全局命令
- `pnpm dev` - 启动所有应用的开发服务器
- `pnpm build` - 构建所有包和应用
- `pnpm lint` - 运行所有项目的代码检查
- `pnpm clean` - 清理所有构建文件

### 应用特定命令
- `pnpm --filter web dev` - 只启动前端应用
- `pnpm --filter api dev` - 只启动 API 服务
- `pnpm --filter @fullstack-template/ui build` - 构建 UI 包

## 实施优先级

### Phase 1: 基础架构
1. 创建 monorepo 结构
2. 配置 Turborepo 和 pnpm workspace
3. 设置基础的 Next.js 应用
4. 配置 Biome 和代码规范

### Phase 2: 核心功能
1. 集成 shadcn/ui
2. 创建 Hono API 基础结构
3. 配置 Supabase 集成
4. 实现基础的认证系统

### Phase 3: 高级功能
1. 完善共享包设计
2. 优化构建和部署

### Phase 4: 文档和示例
1. 完善开发文档
2. 添加示例应用
3. 创建最佳实践指南
4. 性能优化指南

## 注意事项

1. **版本兼容性**: 确保所有依赖版本兼容
2. **类型安全**: 端到端类型安全，从数据库到前端
3. **性能优化**: 构建缓存、代码分割、图片优化
4. **安全考虑**: 环境变量管理、CORS 配置、认证授权
5. **可扩展性**: 模块化设计，易于添加新功能
6. **开发体验**: 快速启动、热重载、清晰的错误提示

这个全栈模板将提供一个现代化、类型安全、高性能的全栈开发起点，适合快速原型开发和生产级应用构建。