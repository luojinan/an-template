import { DataDictPageVO } from '../../utils/proApi/apiTypes';
import request from '../../utils/request'
import { dictQuery } from './model'
import { getAgreementsByidForm } from "../../utils/proApi/wx";
import { useUserStore } from '@/store/modules/user';
import { setUserInfo as setUserInfoCache } from '@/utils/cache';
import type { UserInfo } from '@/api/system/user';

function setUserInfo(newData: any): Promise<UserInfo> {
  return new Promise((resolve, reject) => {
    if (newData.disallowLogin == '1') {
      wx.showModal({
        title: '温馨提示',
        content: '暂无权限访问',
        showCancel: false,
        success(res: any) {
          if (res.confirm) {
            wx.exitMiniProgram({
              success: function (res: any) {
                // 成功退出小程序
                console.log('成功退出小程序');
              },
              fail: function (res: any) {
                // 退出小程序失败处理
                console.log('退出小程序失败', res);
              }
            });
          }
        }
      })
      reject()
    }

    const userStore = useUserStore();
    
    // 设置用户信息到 store
    const userInfo: UserInfo = {
      userId: Number(newData.id),
      username: newData.username || '',
      nickname: newData.nickname || '',
      avatar: newData.avatar || '',
      roles: [],
      perms: []
    };
    
    userStore.userInfo = userInfo;

    // 设置用户信息到缓存
    setUserInfoCache(userInfo);

    resolve(userInfo);
  })
}

class CommonAPI {
  static login(callback?: () => void) {
    return new Promise((resolve, reject) => {
      wx.login({
        success: async (res) => {
          const { data: getOpenIdRes } = await request('wechat/cust/getOpenId', { code: res.code }, { requestType: 'POST' });
          await setUserInfo(getOpenIdRes)
          resolve(getOpenIdRes)
        },
        fail: (err: any) => {
          console.log('wx.login 异常', err)
          reject({ code: 'wxLoginFail', msg: '微信登录失败' })
        }
      })
    })
  }

  static phoneLogin(params: any) {
    return new Promise((resolve, reject) => {
      request(
        'wechat/cust/getPhoneNumber',
        {
          ...params
        },
        { requestType: 'POST' }
      ).then(async userRes => {
        // NOTE 登陆成功，需要和app.ts保持一致的赋值
        await setUserInfo(userRes.data)
        resolve(userRes.data)
      }).catch(err => {
        reject(err)
      })
    })
  }

  static getSwiperData(typeCode: string) {
    return new Promise((resolve, reject) => {
      request(
        'api/v1/rotationCharts/list',
        { typeCode },
        { requestType: 'GET' }
      ).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }

  static getDictData(queryParams: dictQuery): Promise<DataDictPageVO> {
    return new Promise((resolve, reject) => {
      let key = `DICT_${queryParams.typeCode}_pageNum${queryParams.pageNum || '1'}_pageSize${queryParams.pageSize || '10'}`;
      let timestamp = new Date().getTime()
      try {
        var value = wx.getStorageSync(key)
        console.log(key, '获取到的缓存数据: ', value)
        if (value && timestamp - value.timestamp < 3600000) {
          console.log('不用再请求接口')
          // Do something with return value
          return resolve(value)
        }
      } catch (e) {
        // Do something when catch error
      }

      request(
        'api/v1/dict/page',
        {
          // TODO 字典可能分页超长，调用的地方后续如有必要继续优化
          pageNum: 1,
          pageSize: 10,
          ...queryParams
        },
        { requestType: 'GET' }
      ).then(res => {
        // 字典属于非常更新数据，可以本地缓存
        try {
          wx.setStorageSync(key, { timestamp, ...res.data })
        } catch (e) { }

        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }

  static getPrivacyAgreements() {
    return new Promise(async (resolve, reject) => {
      let key = `PRIVACY_AGREEMENT`;
      let timestamp = new Date().getTime()

      try {
        var value = wx.getStorageSync(key)
        console.log(key, '获取到的缓存数据: ', value)
        if (value && timestamp - value.timestamp < 3600000) {
          console.log('不用再请求接口')
          // Do something with return value
          return resolve(value)
        }
      } catch (e) {
        // Do something when catch error
      }

      // 在组件实例进入页面节点树时执行
      const { list: protocol } = await this.getDictData({ typeCode: 'xymc', pageSize: '3' })
      const item = protocol.find(ele => ele.name == '隐私政策')
      const remark = item.remark || ''
      const id = item.value
      const { contentData, title } = await getAgreementsByidForm({ id: id })

      // 字典属于非常更新数据，可以本地缓存
      try {
        wx.setStorageSync(key, {
          title: title,
          remark: remark,
          contentData: contentData,
          timestamp
        })
      } catch (e) { }

      resolve({
        title: title,
        remark: remark,
        contentData: contentData
      })
    })
  }
}

export default CommonAPI