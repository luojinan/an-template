// 将wx.request 从 callback 函数转成 Promise

import { useLoadingStore } from '@/store/modules/loading';
import { useUserStore } from '@/store/modules/user';
import { clearToken, clearUserInfo, getToken, setToken } from './cache';
import domain from './domain'
import needLoginAPI from './needLoginAPI'
import type { IObject } from './proApi/apiTypes';

// 定义请求响应类型
interface RequestResponse<T = any> {
  code: string;
  msg: string;
  data: T;
  token?: string;
}

interface RequestOptions {
  requestType?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  showLoading?: boolean;
  showError?: boolean;
}

const showErrorModel = (msg: string) => {
  return uni.showModal({
    title: '温馨提示',
    content: msg,
    showCancel: false,
  })
}

/**
 * url：页面请求名称
 * param: 请求参数
 * options: 请求配置
 */
const request = async <T = any, R = any>(
  url: string, 
  param: T, 
  options: RequestOptions = {}
): Promise<RequestResponse<R>> => {
  const { requestType = 'POST', showLoading = true, showError = true } = options;
  console.info('request', url, param)
  const { userInfo } = useUserStore();
  const loadingStore = useLoadingStore();

  if (showLoading && !loadingStore.isOpenLoading) {
    uni.showLoading(
      {
        mask: true,
        title: "请稍候..."
      }
    );
    loadingStore.isOpenLoading = true;
  }

  showLoading && loadingStore.plusOne()

  // 如果没有用户信息但是接口是属于需要用户信息的，跳转登录
  if (!userInfo) {
    const needLogin = needLoginAPI.some(api => {
      const reg = new RegExp(api); // TODO 确认下动态id的接口的正则有效性
      return reg.test(url);
    });

    if (needLogin) {
      uni.navigateTo({
        url: '/pages/login/login'
      })
      showLoading && loadingStore.minusOne()
      return Promise.reject({
        code: 'needUserInfo',
        msg: '接口需要用户信息'
      });
    }
  }

  // 处理请求头
  const headerParam: IObject = {
    'Content-Type': 'application/json',
  }

  let token = getToken()
  if (token) {
    headerParam.Authorization = token;
  }

  // 对GET请求参数进行过滤，去除undefined值
  const filteredParam = requestType === 'GET' ? Object.fromEntries(
    Object.entries(param || {}).filter(([_, value]) => value !== undefined)
  ) : param;

  try {
    const { data: wxdata } = await uni.request({
      url: domain + url,
      method: requestType,
      data: filteredParam,
      header: headerParam,
      timeout: 600000
    })
    showLoading && loadingStore.minusOne();
    console.info(url + '接口的上送数据', param)
    console.info(url + '接口的返回数据', wxdata)
    const { code, data, msg } = wxdata as RequestResponse<R & { token?: string }>

    if (code === '00000') {
      console.info('loginResponse', data)
      if (data.token) {
        setToken(data.token)
        console.info('会话token:', data.token)
      }
      return wxdata;
    }
    // token 过期
    if (code === 'A0230') { // TODO 确认下错误码
      clearToken()
      clearUserInfo()

      await showErrorModel('登录会话失效')
      console.error('准备回到首页了！！！')
      uni.reLaunch({
        url: '/pages/home/home?reLaunch=1',
      })
      return Promise.reject(wxdata);
    }

    if (showError) {
      showErrorModel(msg)
    }
    return Promise.reject(wxdata);

  } catch (err) {
    loadingStore.minusOne();
    if (showError) {
      const error = err
      showErrorModel(error?.msg || '微信请求失败')
    }
    return Promise.reject(err);
  }
};

// 防止频繁请求的request，设置间隔500ms
// 目前为共享频繁请求结果使用，如需阻断频繁请求，再开发参数支持
export const requestWithInterval = () => {
  interface RequestCache {
    time: number;
    res?: RequestResponse<any>;
  }
  
  let requestInterval: Record<string, RequestCache> = {};
  
  return <T = any, R = any>(
    url: string, 
    param: T, 
    options: RequestOptions = {}
  ): Promise<RequestResponse<R>> => {
    let key = JSON.stringify([url, param, options]);
    let now = Date.now();
    // 确保频繁请求在接口慢时仍能去到记忆的结果，清除10s前的记录
    Object.keys(requestInterval).forEach(k => {
      if (now - requestInterval[k]?.time > 1000 * 10) {
        delete requestInterval[k];
      }
    })
    let last = requestInterval[key]?.time;
    if (last && now - last < 500) {
      console.log('请求太频繁，将自动延迟获取上次记录')
      return new Promise((resolve) => {
        setTimeout(() => {
          if (requestInterval[key]?.res) {
            resolve(requestInterval[key].res as RequestResponse<R>);
          }
        }, 1000);
      })
    } else {
      requestInterval[key] = { time: now };
      return new Promise((resolve, reject) => {
        request<T, R>(url, param, options).then(res => {
          requestInterval[key].res = res;
          resolve(res);
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
};

export default requestWithInterval();