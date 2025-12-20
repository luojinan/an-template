import request from './request'

/**
 * Check if an element has a class
 * @param {HTMLElement} ele
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele: HTMLElement, cls: string) {
  return !!ele.className.match(new RegExp(`(\\s|^)${cls}(\\s|$)`))
}

/**
 * Add class to element
 * @param {HTMLElement} ele
 * @param {string} cls
 */
export function addClass(ele: HTMLElement, cls: string) {
  if (!hasClass(ele, cls)) { ele.className += ` ${cls}` }
}

/**
 * Remove class from element
 * @param {HTMLElement} ele
 * @param {string} cls
 */
export function removeClass(ele: HTMLElement, cls: string) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp(`(\\s|^)${cls}(\\s|$)`)
    ele.className = ele.className.replace(reg, ' ')
  }
}

/**
 * 判断是否是外部链接
 *
 * @param {string} path
 * @returns {boolean}
 */
export function isExternal(path: string) {
  const isExternal = /^(https?:|http?:|mailto:|tel:)/.test(path)
  return isExternal
}

export function generateUniqueId() {
  return Date.now() + Math.random().toString(36).substr(2, 9)
}

/**
 * 上传文件
 *
 * @param file
 */
export const uploadOss = (file: File, apiUrl?: string) => {
  const url = apiUrl || '/api/v1/file/uploadOss'
  const formData = new FormData()
  formData.append('file', file)
  return request<any, string>({
    url,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 判断是否oss图片链接，拼接webp转化
 */

export function setImageUrl(url?: string, size: number | string) {
  if (!url) {
    return url
  }

  const resize = size ? `/resize,w_${size}` : ''

  // 相对路径处理
  if (!url.startsWith('http')) {
    return `https://mzy-assets.oss-cn-shanghai.aliyuncs.com/${url}?x-oss-process=image/format,webp${resize}`
  }

  // http开头的绝对路径处理
  try {
    const urlObj = new URL(url)
    const isMzyOss = urlObj.hostname.includes('oss-cn-shanghai.aliyuncs.com')

    if (isMzyOss) {
      const ossProcess = urlObj.searchParams.get('x-oss-process')

      // 检查是否已有format参数
      if (!ossProcess || !ossProcess.includes('format')) {
        // 如果已有x-oss-process参数，追加format
        if (ossProcess) {
          urlObj.searchParams.set('x-oss-process', `${ossProcess}/format,webp${resize}`)
        }
        else {
          // 如果没有x-oss-process参数，新增
          urlObj.searchParams.set('x-oss-process', `image/format,webp${resize}`)
        }
        return urlObj.toString()
      }
    }

    return url
  }
  catch {
    // URL解析失败，直接返回原始URL
    return url
  }
}
