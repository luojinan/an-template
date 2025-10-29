export default function setPageTitle(routerTitle?: string): void {
  window.document.title = routerTitle
    ? `${routerTitle}`
    : ''
}
