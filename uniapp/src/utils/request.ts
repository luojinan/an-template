// 将wx.request 从 callback 函数转成 Promise

import domain from './domain'
import needLoginAPI from './needLoginAPI'
import { IObject } from './proApi/apiTypes';
import { useUserStore } from '@/store/modules/user';
import { useLoadingStore } from '@/store/modules/loading';
import { clearToken, getToken, setToken } from './cache';

// 定义 wx 类型
declare const wx: {
  request: any;
  showLoading: (options: { mask: boolean; title: string }) => void;
  navigateTo: (options: { url: string }) => void;
  getStorageSync: (key: string) => string;
  setStorageSync: (key: string, value: string) => void;
  removeStorageSync: (key: string) => void;
  showModal: (options: { title: string; content: string; showCancel: boolean; success?: (res: any) => void }) => void;
  reLaunch: (options: { url: string }) => void;
};

// 定义请求响应类型
interface RequestResponse<T = any> {
  data: {
    code: string;
    msg: string;
    data: T;
    token?: string;
  };
}

// 定义登录响应类型
interface LoginResponse {
  token?: string;
  [key: string]: any;
}

function promisify(api: any) {
  return (options: any, ...params: any[]) => {
    return new Promise((resolve, reject) => {
      api(Object.assign({}, options,
        {
          success: (res: any) => {
            resolve(res)
          }, fail: reject
        }
      ), ...params);
    });
  }
}

let promisifyWXRequest = promisify(wx.request);

let linkUrl = domain; // 数据请求访问

/**
 * url：页面请求名称
 * requestType:请求类型
 * param:请求参数
 * callback：回调方法
 */
const request = <T, R>(url: string, param: T, { requestType = 'POST', showLoading = true, showError = true } = {}): Promise<{ data: R }> => {
  console.info('request', url, param)
  const userStore = useUserStore();
  const loadingStore = useLoadingStore();

  if (showLoading && !loadingStore.isOpenLoading) {
    wx.showLoading(
      {
        mask: true,
        title: "请稍候..."
      }
    );
    loadingStore.isOpenLoading = true;
  }

  showLoading && loadingStore.plusOne()

  return new Promise(async (resolve, reject) => {
    // 如果没有用户信息但是接口是属于需要用户信息的，跳转登录
    if (!userStore.userInfo) {
      for (let i = 0; i < needLoginAPI.length; i++) {
        var reg = new RegExp(needLoginAPI[i]); // TODO 确认下动态id的接口的正则有效性
        if (reg.test(url)) {
          wx.navigateTo({
            url: '/pages/login/login'
          })
          showLoading && loadingStore.minusOne()
          return reject({
            code: 'needUserInfo',
            msg: '接口需要用户信息'
          });
        }
      }
    }

    let urlLink = linkUrl + url;

    // 处理请求头
    const headerParam: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    let token = await getToken()
    if (token) {
      headerParam.Authorization = token;
    }

    // 对GET请求参数进行过滤，去除undefined值
    const filteredParam = requestType === 'GET' ? Object.fromEntries(
      Object.entries(param || {}).filter(([_, value]) => value !== undefined)
    ) : param;

    promisifyWXRequest({
      url: urlLink,
      method: requestType,
      data: filteredParam,
      header: headerParam,
      timeout: 600000
    }).then(async (res: unknown) => {
      const response = res as RequestResponse<R>;
      showLoading && loadingStore.minusOne();
      console.info(url + '接口的上送数据', param)
      console.info(url + '接口的返回数据', response)
      if (response.data.code != '00000') {
        // token 过期
        if (response.data.code == 'A0230') { // TODO 确认下错误码
          clearToken()
          userStore.userInfo = undefined;
          userStore.logout();

          // TODO 清理掉用户登录标识
          wx.showModal({
            title: '温馨提示',
            content: '登录会话失效',
            showCancel: false,
            success: (modalRes: any) => {
              console.error('准备回到首页了！！！')
              wx.reLaunch({
                url: '/pages/home/home?reLaunch=1',
              })
            }
          })
          return;
        }

        if (showError) {
          wx.showModal({
            title: '温馨提示',
            content: response.data.msg,
            showCancel: false,
          })
        }
        reject(response.data);
      } else {
        const loginResponse = response.data.data as LoginResponse;
        console.info('loginResponse', loginResponse)
        if (loginResponse.token) {
          await setToken(loginResponse.token)
          userStore.login({ username: '', password: '' });
          console.info('会话token:', loginResponse.token)
        }
        resolve(response.data);
      }
    }).catch(err => {
      loadingStore.minusOne();
      // wx.request 报错的错误信息
      let errMessage = err;
      errMessage.code = 'wxRequestFail';
      errMessage.msg = '微信请求失败'
      if (showError) {
        wx.showModal({
          title: '温馨提示',
          content: errMessage.msg,
          showCancel: false,
        })
      }
      reject(errMessage);
    })
  })
};

// 防止频繁请求的request，设置间隔500ms
// 目前为共享频繁请求结果使用，如需阻断频繁请求，再开发参数支持
export const requestWithInterval = () => {
  // 把参数json后作为key，每个key记忆500ms，在获取到值后多存一份，当500ms内频繁请求时，作为结果
  // 注意：频繁请求场景，首次请求1s内没返回，500ms内的后续频繁请求将取到空值，不会reject
  let requestInterval: IObject = {};
  return <T, R>(...arg: [url: string, param: T, option: any]): Promise<{ data: R }> => {
    let key = JSON.stringify(arg);
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
            resolve(requestInterval[key].res)
          }
        }, 1000);
      })
    } else {
      requestInterval[key] = { time: now };
      return new Promise((resolve, reject) => {
        request<any, R>(...arg).then(res => {
          requestInterval[key].res = res;
          resolve(res);
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
};

// export default requestWithInterval();
export default request;