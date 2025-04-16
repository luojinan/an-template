import request from '@/utils/request'

class agreementAPI {
  /**
   * 获取角色分页数据
   *
   * @param queryParams
   */
  static getList(queryParams: any) {
    return request<any, any>({
      url: '/api/v1/agreements/page',
      method: 'get',
      params: queryParams,
    })
  }

  static addAgreement(data: any) {
    return request({
      url: '/api/v1/agreements',
      method: 'post',
      data,
    })
  }
  static getFormData(userId: number) {
    return request<any>({
      url: `/api/v1/agreements/${userId}/form`,
      method: 'get',
    })
  }

  static editAgreement(id: number,data:any) {
    return request({
      url:  `/api/v1/agreements/${id}`,
      method: 'put',
      data,
    })
  }
  static deleteByIds(ids: string) {
    return request({
      url: `/api/v1/agreements/${ids}`,
      method: 'delete',
    })
  }
}

export default agreementAPI
