/**
 * 防抖函数
 * @param fn 函数
 * @param delay 延迟时间
 * @returns
 */
const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
  let timer: number | null = null;
  return function (this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};


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

export { debounce };
