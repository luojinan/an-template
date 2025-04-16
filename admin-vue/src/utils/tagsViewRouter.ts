import { useTagsViewStore } from '@/store'
/**
 * 关闭当前标签页
 *
 * 在标签视图中关闭当前活动的标签页
 * 从标签视图存储中找到与当前路由匹配的标签页
 * 然后将其从存储中删除，最后将浏览器路由切换到指定的路径
 */
export async function closeCurrentTab(route) {
  const tagsViewStore = useTagsViewStore()

  const currentRouteFullPath = route.fullPath // useroute 不能在setup外使用
  const currentTagview = tagsViewStore.visitedViews.find(item => item.fullPath === currentRouteFullPath)!

  await tagsViewStore.delView(currentTagview)
}
