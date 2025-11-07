export const imageUploadValidator = (_rule: any, value: any, callback: any) => {
  if (value.some((item: { status: string }) => item.status !== 'success')) {
    callback(new Error('图片正在上传，请稍后'))
    return
  }
  callback()
}
