import type { FileInfo } from './model'
import request from '@/utils/request'

class FileAPI {
  /**
   * 上传文件
   *
   * @param file
   */
  static upload(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('filePath', '1')
    return request<any, FileInfo>({
      url: '/api/v1/file/upload',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  /**
   * 上传文件
   *
   * @param file
   */
  static uploadOss(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return request<any, string>({
      url: '/api/v1/file/uploadOss',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  /**
   * 删除文件
   *
   * @param filePath 文件完整路径
   */
  static deleteByPath(id) {
    return request({
      url: `/api/v1/file/${id}`,
      method: 'delete',
    })
  }

  static getFile(id: string) {
    return request<any, any>({
      url: `/api/v1/file/${id}`,
      method: 'get',
      responseType: 'blob',
    })
  }
}

export default FileAPI
