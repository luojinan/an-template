import AuthAPI from '@/api/auth'
import UserAPI from '@/api/user'
import { resetRouter } from '@/router'
import { store } from '@/store'

import type { LoginData } from '@/api/auth/model'
import type { UserInfo } from '@/api/user/model'
import { TOKEN_KEY } from '@/enums/CacheEnum'
import type { UserInfoVO } from '@/proApi/apiTypes'

export const useUserStore = defineStore('user', () => {
  const user = ref<UserInfoVO>({
    roles: [],
    perms: [],
  })

  /**
   * 登录
   *
   * @param {LoginData}
   * @returns
   */
  function login(loginData: LoginData) {
    return new Promise<void>((resolve, reject) => {
      AuthAPI.login(loginData)
        .then((data) => {
          const { tokenType, accessToken } = data
          localStorage.setItem(TOKEN_KEY, `${tokenType} ${accessToken}`) // Bearer eyJhbGciOiJIUzI1NiJ9.xxx.xxx
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  // 获取信息(用户昵称、头像、角色集合、权限集合)
  function getUserInfo() {
    return new Promise<UserInfo>((resolve, reject) => {
      UserAPI.getInfo()
        .then((data) => {
          if (!data) {
            reject('Verification failed, please Login again.')
            return
          }
          if (!data.roles || data.roles.length <= 0) {
            reject('getUserInfo: roles must be a non-null array!')
            return
          }
          Object.assign(user.value, { ...data })
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  // user logout
  function logout() {
    return new Promise<void>((resolve, reject) => {
      AuthAPI.logout()
        .then(() => {
          localStorage.setItem(TOKEN_KEY, '')
          location.reload() // 清空路由
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  // remove token
  function resetToken() {
    console.log('resetToken')
    return new Promise<void>((resolve) => {
      localStorage.setItem(TOKEN_KEY, '')
      resetRouter()
      resolve()
    })
  }

  function hasPerms(perms: string[]) {
    if(!perms.length) {
      return true // 不传目标权限码，则认为不要求权限
    }
    return user.value.perms.some(perm => perms.includes(perm))
  }

  return {
    user,
    login,
    getUserInfo,
    logout,
    resetToken,
    hasPerms
  }
})

// 非setup
export function useUserStoreHook() {
  return useUserStore(store)
}
