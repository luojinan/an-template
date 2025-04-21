import { defineStore } from "pinia";

export const useLoadingStore = defineStore("loading", () => {
  const loadingCount = ref(0);
  const isOpenLoading = ref(false);
  
  const plusOne = () => {
    loadingCount.value++;
  };
  
  const minusOne = () => {
    loadingCount.value--;
    if (loadingCount.value <= 0) {
      loadingCount.value = 0;
      isOpenLoading.value = false;
      uni.hideLoading();
    }
  };
  
  return {
    loadingCount,
    isOpenLoading,
    plusOne,
    minusOne
  };
}); 