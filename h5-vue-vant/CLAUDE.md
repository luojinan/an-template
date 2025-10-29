# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production (runs type checking and build)
- `pnpm build-only` - Build without type checking
- `pnpm type-check` - Run TypeScript type checking
- `pnpm preview` - Preview production build

### Code Quality
- `pnpm lint:eslint` - Run ESLint with auto-fix
- `pnpm lint:prettier` - Format code with Prettier
- `pnpm release` - Create a new release using standard-version

### Package Manager
- **Use `pnpm` only** - Project is configured to use pnpm exclusively
- Node.js version 18+ is required

## Architecture Overview

### Technology Stack
- **Vue 3** with Composition API and `<script setup>`
- **TypeScript** with relaxed strictness settings
- **Vite 5** as build tool with hash routing
- **Pinia** for state management
- **Vue Router 4** with route caching system
- **Vant 4** UI components (auto-imported)
- **Tailwind CSS** for styling
- **PostCSS** with viewport adaptation (px to vmin)

### Project Structure
```
src/
├── components/         # Reusable UI components
│   ├── nav-bar/       # Navigation bar component
│   ├── tabbar/        # Bottom tab bar
│   ├── i-icon/        # Iconify icon wrapper
│   └── svg-icon/      # Local SVG icon component
├── views/             # Page components
│   ├── demo/          # Main page
│   ├── tools/         # Tools page
│   └── about/         # About page
├── layout/            # Main layout wrapper
├── router/            # Vue Router configuration
├── store/             # Pinia store modules
├── utils/             # Utility functions
├── styles/            # Global styles and variables
└── composables/       # Vue composables
```

### Key Patterns

#### Route Caching System
- Components are cached by default using `<keep-alive>`
- Component `name` must match route `name` exactly for caching to work
- Set `meta.noCache: true` to disable caching for specific routes

#### Component Auto-Import
- Vant components are auto-imported via `unplugin-vue-components`
- Custom components in `src/components/` are also auto-imported
- No need to manually register components in `main.ts`

#### Icon System
Two icon approaches available:
1. **Iconify (recommended)**: Use `<i-icon icon="icon-set:icon-name" />`
2. **Local SVG**: Place files in `src/icons/svg/` and use `<svg-icon name="filename" />`

#### Dark Mode
- Built-in dark mode support using Vant theme provider
- Toggle via `useDarkMode()` composable
- Persists across sessions

#### Mobile-First Design
- Viewport adaptation: px converts to vmin (375px base width)
- Tailwind CSS v4 for utility-first styling
- Vant components optimized for mobile
- NProgress integration for navigation loading indicators

#### CAAS Personality Test Feature
- Multi-page test flow: index → process → result
- Located in `src/views/caas/` with dedicated routes
- API integration via `src/api/caas.ts`
- Currently uses mocked API responses (TODO comments indicate real endpoints needed)

#### ProApi Integration
- WeChat/miniprogram API integration in `src/utils/proApi/`
- Includes wx.ts and type definitions for common types
- Integrated into the application ecosystem

#### Request/Http Architecture
- Axios-based HTTP client with interceptors (`src/utils/request/`)
- Request/response interceptors for progress tracking (NProgress) and error handling
- Default Content-Type: form-urlencoded
- Environment-based baseURL configuration via `VITE_BASE_API`
- Toast notifications for error handling using Vant

### Configuration Files

#### Build Configuration (vite.config.ts)
- Hash-based routing (`createWebHashHistory`)
- SVG icon system with `vite-plugin-svg-icons`
- Auto-import for Vant components via `unplugin-vue-components`
- Tailwind CSS v4 integration
- HTML injection for eruda debug console

#### TypeScript Configuration
- Relaxed strictness settings (`strict: false`)
- Path aliases: `@/*` → `src/*`
- Supports Vue SFCs and TypeScript files

#### ESLint Configuration
- Flat config format with `@antfu/eslint-config`
- Vue 3, TypeScript, and Prettier integration
- Auto-fix enabled for most rules
- Consistent type imports enforced

#### PostCSS Configuration
- PostCSS nested syntax support
- `cnjm-postcss-px-to-viewport` for mobile viewport adaptation (375px base, converts px → vmin)
- Autoprefixer for browser compatibility

### Environment Variables
- `.env.development` - Development settings
- `.env.production` - Production settings
- `VITE_BASE_API` - API base URL for backend requests
- `VITE_ENABLE_ERUDA` - Enable/disable eruda debug console in development
- `VITE_PUBLIC_PATH` - Deployment base path (default: "/")

### Application Pages
- **Demo** (`/demo`) - Main landing page
- **Tools** (`/tools`) - Tools and utilities page
- **About** (`/about`) - About page (no-cache)
- **CAAS** (`/caas`) - Personality test flow:
  - `/caas/index` - Test introduction (no-cache)
  - `/caas/process` - Test questions (no-cache)
  - `/caas/result` - Test results (no-cache)

### Pinia Store Modules
- **cached-view** (`src/store/modules/cached-view.ts`) - Manages route component caching with KeepAlive
- **dark-mode** (`src/store/modules/dark-mode.ts`) - Dark mode theme state management
