import type {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from 'vue-router'
import { useStorage } from '@vueuse/core'
import router from '@/router'
import { usePermissionStore, useUserStore } from '@/store'
import NProgress from '@/utils/nprogress'
import { TOKEN_KEY } from '@/enums/CacheEnum'

const resumeRouter = useStorage('resumeRouter', {})

/** 重定向到登录页 */
function redirectToLogin(
  to: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const params = new URLSearchParams(to.query as Record<string, string>)
  const queryString = params.toString()
  const redirect = queryString ? `${to.path}?${queryString}` : to.path
  next(`/login?redirect=${encodeURIComponent(redirect)}`)
}

// 是否有权限
export function hasAuth(
  value: string | string[],
  type: 'button' | 'role' = 'button',
) {
  const { roles, perms } = useUserStore().user
  // 「超级管理员」拥有所有的按钮权限
  if (type === 'button' && roles.includes('ROOT')) { return true }

  const auths = type === 'button' ? perms : roles
  return typeof value === 'string'
    ? auths.includes(value)
    : auths.some((perm) => {
        return value.includes(perm)
      })
}

export function setupPermission() {
  // 白名单路由
  const whiteList = ['/login', '/pdf']

  router.beforeEach(async (to, from, next) => {
    NProgress.start()
    const hasToken = localStorage.getItem(TOKEN_KEY)
    if (hasToken) {
      if (to.path === '/login') {
        // 如果已登录，跳转首页
        next({ path: '/' })
        NProgress.done()
      }
      else {
        const userStore = useUserStore()
        const hasRoles
          = userStore.user.roles && userStore.user.roles.length > 0

        // store中没有角色数据 证明还没生成动态路由，生成后会再进入当前if
        if (hasRoles) {
          // 未匹配到任何路由，跳转404
          if (to.matched.length === 0) {
            next(from.name ? { name: from.name } : '/404')
          }
          else {
            // 如果路由参数中有 title，覆盖路由元信息中的 title
            const title
              = (to.params.title as string) || (to.query.title as string)
            if (title) { to.meta.title = title }

            // 当路由path是空时，优先去缓存的路由，没有再去dashbord，有redirectedFrom
            // 注意区分，当路由是dashbord时，去dashboard而不是缓存的路由，没有redirectedFrom
            // if (to.fullPath === '/dashboard' && to.redirectedFrom?.fullPath === '/' && resumeRouter.value?.fullPath) {
            //   // 从缓存中获取要去的路由信息
            //   next(resumeRouter.value)
            // }
            // else {
            next()
            // }
          }
        }
        else {
          const permissionStore = usePermissionStore()
          try {
            const { roles } = await userStore.getUserInfo()
            const accessRoutes = await permissionStore.generateRoutes(roles)
            accessRoutes.forEach((route: RouteRecordRaw) => {
              router.addRoute(route)
            })
            next({ ...to, replace: true })
          }
          catch (error) {
            // 移除 token 并重定向到登录页，携带当前页面路由作为跳转参数
            await userStore.resetToken()
            redirectToLogin(to, next)
            NProgress.done()
          }
        }
      }
    }
    else {
      // 未登录
      if (whiteList.includes(to.path)) {
        next() // 在白名单，直接进入
      }
      else {
        // 不在白名单，重定向到登录页
        redirectToLogin(to, next)
        NProgress.done()
      }
    }
    localStorage.setItem('PATH', to.path)
  })

  router.afterEach((to) => {
    // 缓存记录当前路由，用于下次打开自动进入
    if (to.fullPath !== '/dashboard' && !to.fullPath.includes('login')) {
      resumeRouter.value = to
    }
    NProgress.done()
  })
}
