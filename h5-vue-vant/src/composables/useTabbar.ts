import { computed, onMounted, onUnmounted, readonly, ref } from 'vue'

// Shared state across all components
const tabbarVisible = ref(true)

export function useTabbar() {
  const showTabbar = computed(() => tabbarVisible.value)

  const setTabbarVisible = (visible: boolean) => {
    tabbarVisible.value = visible
  }

  const hideTabbar = () => {
    tabbarVisible.value = false
  }

  const displayTabbar = () => {
    tabbarVisible.value = true
  }

  return {
    showTabbar: readonly(showTabbar),
    setTabbarVisible,
    hideTabbar,
    displayTabbar,
  }
}

export function useTabbarHideInCurrentPage() {
  const { hideTabbar, displayTabbar } = useTabbar()

  onMounted(() => {
    hideTabbar()
  })

  onUnmounted(() => {
    displayTabbar()
  })
}
