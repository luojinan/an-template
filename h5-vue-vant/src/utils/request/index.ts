import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import Axios from 'axios'
import { showFailToast } from 'vant'
import NProgress from '../progress'
import 'vant/es/toast/style'

/**
 * @description: ContentType
 */
enum ContentTypeEnum {
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
  // json
  JSON = 'application/json;charset=UTF-8',
}

/**
 * @description: 与后端协定的状态 code
 */
enum ResultEnum {
  SUCCESS = 0,
  ERROR = 1,
}

// 默认 axios 实例请求配置
const configDefault = {
  headers: {
    'Content-Type': ContentTypeEnum.JSON,
  },
  timeout: 0,
  baseURL: import.meta.env.VITE_BASE_API,
  data: {},
}

// 当前实例
let axiosInstance: AxiosInstance
// 请求配置
let axiosConfigDefault: AxiosRequestConfig

// 请求拦截
function httpInterceptorsRequest(): void {
  axiosInstance.interceptors.request.use(
    (config) => {
      NProgress.start()
      // 发送请求前，可在此携带 token
      // if (token) {
      //   config.headers['token'] = token
      // }
      return config
    },
    (error: AxiosError) => {
      showFailToast(error.message)
      return Promise.reject(error)
    },
  )
}

// 响应拦截
function httpInterceptorsResponse(): void {
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      NProgress.done()
      // 与后端协定的返回字段
      const { code, result } = response.data
      // const { message } = response.data;
      // 判断请求是否成功
      const isSuccess
        = result
          && Reflect.has(response.data, 'code')
          && code === ResultEnum.SUCCESS
      if (isSuccess) {
        return result
      }
      else {
        // 处理请求错误
        // showFailToast(message);
        return Promise.reject(response.data)
      }
    },
    (error: AxiosError) => {
      NProgress.done()
      // 处理 HTTP 网络错误
      let message = ''
      const status = error.response?.status

      if (status >= 400 && status < 500) {
        message = '请求失败'
      }
      else if (status >= 500) {
        message = '服务器错误'
      }
      else {
        message = '网络连接故障'
      }

      showFailToast(message)
      return Promise.reject(error)
    },
  )
}

// 初始化 HTTP 实例
function initHttp(config: AxiosRequestConfig): void {
  axiosConfigDefault = config
  axiosInstance = Axios.create(config)
  httpInterceptorsRequest()
  httpInterceptorsResponse()
}

// 通用请求函数
function request<TData = any, TResult = any>(
  url: string,
  data?: TData,
  // options?: AxiosRequestConfig,
  options?: any,
): Promise<TResult> {
  const config: any = {
    ...axiosConfigDefault,
    url,
    data,
    ...options,
  }

  if (options?.requestType) {
    config.method = options.requestType.toLowerCase()
  }

  return new Promise((resolve, reject) => {
    axiosInstance
      .request(config)
      .then((response: any) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 初始化 HTTP 实例
initHttp(configDefault)

// 导出请求函数
export default request
