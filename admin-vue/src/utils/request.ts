import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { useRoute } from 'vue-router'
// 手动引入会导致样式丢失...🙄 autoimport 到底在做什么
// import { ElMessage, ElMessageBox } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ResultEnum } from '@/enums/ResultEnum'
import { TOKEN_KEY } from '@/enums/CacheEnum'
import { useUserStoreHook } from '@/store/modules/user'

const router = useRoute()
console.log(router)
// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
})

// 缓存对象
const pendingRequests = new Map<string, {
  timestamp: number
  controller: AbortController
  promise: Promise<any>
}>()

// 生成请求唯一标识（需考虑 GET 参数和 POST 数据）
function generateRequestKey(config: InternalAxiosRequestConfig): string {
  return [
    config.method,
    config.url,
    JSON.stringify(config.params),
    JSON.stringify(config.data),
  ].join('&')
}

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const key = generateRequestKey(config)
    const now = Date.now()
    const existingRequest = pendingRequests.get(key)

    // 创建新请求
    const controller = new AbortController()
    config.signal = controller.signal

    // 发现重复请求
    if (existingRequest) {
      // 300ms 内视为并发请求
      if (now - existingRequest.timestamp < 300) {
        controller.abort()
        return { ...config, __isRetry: true } // 标记为重复请求
      }
    }

    // 共享promise，由首次请求的响应拦截器触发promise的结果，因此塞入响应拦截器可以获取的config
    const promise = new Promise((resolve) => {
      // 在响应拦截器中完成 resolve
      config.__resolve = resolve
    })

    pendingRequests.set(key, {
      timestamp: now,
      controller,
      promise,
    })

    const accessToken = localStorage.getItem(TOKEN_KEY)
    if (accessToken) { config.headers.Authorization = accessToken }
    config.headers.route = localStorage.getItem('PATH') || ''

    return config
  },
  (error: any) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 检查是否为文件下载响应
    const contentType = response.headers['content-type']
    const isFileDownload = (
      response.config.responseType === 'blob'
      || response.config.responseType === 'arraybuffer'
      || contentType?.includes('application/vnd.openxmlformats-officedocument')
      || contentType?.includes('application/vnd.ms-excel')
    )

    if (isFileDownload) {
      const contentDisposition = response.headers['content-disposition']
      let filename = 'download'
      if (contentDisposition) {
        // 优先匹配filename*=UTF-8''格式
        const filenameMatch = contentDisposition.match(/filename\*=UTF-8''([^;\n]*)|filename=([^;\n]*)/)
        if (filenameMatch) {
          filename = filenameMatch[1] || filenameMatch[2] // 使用第一个匹配组（UTF-8编码）或第二个匹配组（普通格式）
          filename = decodeURIComponent(filename.replace(/['"]*/g, ''))
        }
      }
      const blob = new Blob([response.data])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
      return response
    }

    const { code, data, msg } = response.data
    if (code === ResultEnum.SUCCESS) {
      response.config?.__resolve?.(data)
      return data
    }

    ElMessage.error(msg || '系统出错')
    return Promise.reject(new Error(msg || 'Error'))
  },
  (error: any) => {
    if (error.code === 'ERR_CANCELED') {
      const key = generateRequestKey(error.config)
      const cached = pendingRequests.get(key)
      console.log('重复请求中断', key)
      return cached.promise
    }
    // 异常处理
    if (error.response.data) {
      const { code, msg } = error.response.data
      if (code === ResultEnum.TOKEN_INVALID) {
        ElMessageBox.confirm('当前页面已失效，请重新登录', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          const userStore = useUserStoreHook()
          userStore.resetToken().then(() => {
            location.reload()
          })
        })
      }
      else {
        ElMessage.error(msg || '系统出错')
      }
    }
    return Promise.reject(error.message)
  },
)

// 导出 axios 实例
export default service
