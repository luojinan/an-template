/**
 * 设置图片URL
 *
 * - 如果传入的URL参数非空且不以'http'开头，则认为是相对路径，需要进行拼接和处理。
 * - 对于需要处理的相对路径，将其置于预定义的OSS（阿里云对象存储服务）URL后，并添加特定的图片处理参数。
 * - 如果传入的URL参数为空或已是一个绝对路径（以'http'开头），则直接返回该URL。
 *
 * @param url 可能是相对路径或绝对路径的图片URL。可选参数。
 * @returns 处理后的图片URL地址。如果输入不需要处理，则原样返回。
 */
export function setImageUrl(url?: string) {
  if (!!url && !url.startsWith('http')) {
    return `https://dsjedu-assets.oss-cn-shanghai.aliyuncs.com/${url}?x-oss-process=image/format,webp`
  }
  // 直接返回原始URL
  return url
}

/**
 * @param {string} path
 * @returns {boolean} True if the provided path is an external link
 */
export function isExternal(path: string) {
  return /^(?:https?:|mailto:|tel:)/.test(path)
}
