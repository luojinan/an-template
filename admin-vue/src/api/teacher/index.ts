import type { TeacherForm, TeacherQuery } from './model'
import request from '@/utils/request'

class TeacherAPI {
  static getList(queryParams?: TeacherQuery) {
    return request<any, any>({
      url: '/teacher/info/list',
      method: 'get',
      params: queryParams,
    })
  }

  static getTeacherDetail(id: string) {
    return request<any, any>({
      url: `/teacher/info/${id}`,
      method: 'get',
    })
  }
  static editTeacherNum(data:any) {
    return request<any, any>({
      url: `/teacher/info/edit/sortNumber`,
      method: 'post',
      data
    })
  }
  static updateTeacher(data: TeacherForm) {
    return request({
      url: '/teacher/info/edit',
      method: 'post',
      data,
    })
  }

  static addTeacher(data: TeacherForm) {
    return request({
      url: '/teacher/info/add',
      method: 'post',
      data,
    })
  }

  static removeTeacher(params: { id: string }) {
    return request({
      url: `/teacher/info/remove/${params.id}`,
      method: 'delete',
    })
  }

  static getTeacherAvail(id: string) {
    return request<any, any>({
      url: `/api/v1/teacherAvail/${id}`,
      method: 'get',
    })
  }

  static updateTeacherAvail(data: any) {
    return request({
      url: '/api/v1/teacherAvail/update',
      method: 'post',
      data,
    })
  }
}

export default TeacherAPI
