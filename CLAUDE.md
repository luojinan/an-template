# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a frontend template collection containing 6 different project templates for various development scenarios:

1. **admin-vue** - Vue 3 admin dashboard with Element Plus
2. **h5-vue** - Mobile H5 application with NutUI  
3. **uniapp** - Cross-platform mini-program/H5 app
4. **vue-mvp** - Minimal Vue 3 starter template
5. **react-mvp** - Minimal React TypeScript starter template
6. **fullstack-template** - Monorepo fullstack application (规划中)

## Development Commands

### Admin Vue Project (`/admin-vue`)
- **Start development**: `npm run dev` (port from env, default opens browser)
- **Build**: `npm run build` (includes TypeScript check)
- **Type check**: `npm run type-check` or `vue-tsc --noEmit`
- **Lint**: `npm run lint:eslint`
- **Generate API**: `npm run api` (runs scripts/tsapi.js)

### H5 Vue Project (`/h5-vue`)
- **Start development**: `npm run dev`
- **Build**: `npm run build` (includes type check)
- **Type check**: `npm run type-check`

### UniApp Project (`/uniapp`)
- **WeChat mini-program dev**: `npm run dev` 
- **H5 development**: `npm run dev:h5`
- **Build mini-program**: `npm run build`
- **Build H5**: `npm run build:h5`
- **Type check**: `npm run type-check`
- **Lint code**: `npm run lint:biome`
- **Lint styles**: `npm run lint:stylelint`

### Vue MVP (`/vue-mvp`)
- **Start development**: `npm run dev`
- **Build**: `npm run build`
- **Type check**: `npm run type-check`

### React MVP (`/react-mvp`)
- **Start development**: `npm run dev`
- **Build**: `npm run build` (includes TypeScript build)
- **Lint**: `npm run lint`

### Fullstack Template (`/fullstack-template`) - 规划中
详细规划请查看 [TODO.md](./TODO.md)，包含：
- **技术栈**: Monorepo + Turborepo + Next.js + shadcn/ui + Hono + Supabase + Cloudflare Worker
- **全局命令**: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm test`
- **应用特定**: `pnpm --filter web dev`, `pnpm --filter api dev`

## Architecture Overview

### Admin Vue (Enterprise Admin Dashboard)
- **Tech Stack**: Vue 3 + TypeScript + Element Plus + Vite + Pinia
- **Key Features**: Auto-import components/APIs, UnoCSS, request deduplication, file download handling
- **Request System**: Centralized error handling in `src/utils/request.ts` with automatic token management
- **Component System**: ProTable/ProForm/ProDrawer components for rapid CRUD development
- **API Pattern**: All API functions in `src/utils/proApi/` with unified error handling - **DO NOT wrap API calls in try-catch unless special handling needed**

### H5 Vue (Mobile Web)
- **Tech Stack**: Vue 3 + TypeScript + NutUI + Vite
- **Purpose**: Mobile-first web applications
- **Auto Import**: NutUI components are auto-imported

### UniApp (Cross-Platform Mini-Program)
- **Tech Stack**: Vue 3 + TypeScript + uni-app + NutUI-UniApp + UnoCSS
- **Platforms**: WeChat mini-program, H5, potentially other mini-programs
- **Component Usage**: Use `<nut-button>` syntax (kebab-case) for NutUI components
- **API Calls**: Use `uni.xxx()` instead of `wx.xxx()` for cross-platform compatibility
- **Request System**: Custom request wrapper in `src/utils/request.ts` with loading states and error handling

### Vue MVP (Minimal Starter)
- **Tech Stack**: Vue 3 + TypeScript + Vite + Tailwind CSS + DaisyUI
- **Purpose**: Lightweight starting point for Vue projects

### React MVP (Minimal Starter) 
- **Tech Stack**: React 19 + TypeScript + Vite + Tailwind CSS + DaisyUI + Supabase
- **Code Quality**: Biome for linting/formatting instead of ESLint/Prettier
- **Purpose**: Lightweight starting point for React projects

### Fullstack Template (Monorepo Fullstack) - 规划中
- **Tech Stack**: Turborepo + Next.js 15 + shadcn/ui + Hono + Supabase + Cloudflare Worker
- **Architecture**: Monorepo with shared packages for UI, database, and utilities
- **Frontend**: Next.js App Router + React Server Components + shadcn/ui
- **Backend**: Hono API deployed on Cloudflare Workers
- **Database**: Supabase with type-safe client and real-time features
- **Build System**: Turborepo with incremental builds and caching

## Key Development Patterns

### Admin Vue Specific Rules
1. **API Error Handling**: Do NOT use try-catch around API calls - errors are handled automatically in `request.ts`
2. **ProTable Usage**: `search` property defaults to `true`, only set `:search="false"` to disable
3. **Component Auto-Import**: Vue components, Element Plus, and Vue utilities are auto-imported
4. **File Downloads**: Automatic file download handling in response interceptor

### UniApp Specific Rules
1. **Cross-Platform APIs**: Always use `uni.xxx()` instead of platform-specific APIs
2. **Component Naming**: Use kebab-case in templates (`<nut-button>`) 
3. **Platform Detection**: Code can run on both mini-program and H5 environments
4. **Request Configuration**: Different proxy settings for H5 vs mini-program builds

### General Patterns
- All projects use **pnpm** as package manager (check lock files)
- **TypeScript** is used throughout with strict type checking
- **Auto-import** is configured for most dependencies and components
- **UnoCSS/Tailwind** for utility-first styling
- **Pinia** for state management in Vue projects

### Fullstack Template Specific Rules (规划中)
1. **Monorepo Management**: Use `pnpm --filter` for package-specific commands
2. **Type Safety**: End-to-end type safety from database to frontend
3. **Shared Packages**: Use internal packages (`@fullstack-template/*`) for shared logic
4. **Build Strategy**: Turborepo handles incremental builds and task dependencies
5. **Deployment**: Frontend on Vercel, API on Cloudflare Workers, Database on Supabase

## Mixed Development (Mini-Program + H5)
This template collection supports mixed development patterns where:
- Core functionality runs in mini-program (UniApp)
- Complex interactive pages run as H5 (embedded in WebView)
- Detailed implementation patterns and communication bridges are documented in the main README.md

## Build & Deployment Notes
- Admin Vue: Includes advanced chunk splitting and asset optimization
- UniApp: Different build outputs for mini-program vs H5 platforms  
- All projects: Use environment variables for API endpoints and build configuration
- Fullstack Template: Multi-stage deployment with Turborepo orchestration, detailed in TODO.md

## Template Implementation Status
- ✅ **admin-vue**: 完整实现，生产就绪
- ✅ **h5-vue**: 完整实现，生产就绪  
- ✅ **uniapp**: 完整实现，生产就绪
- ✅ **vue-mvp**: 完整实现，生产就绪
- ✅ **react-mvp**: 完整实现，生产就绪
- 🚧 **fullstack-template**: 规划阶段，详见 TODO.md