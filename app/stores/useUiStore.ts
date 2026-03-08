import { defineStore } from 'pinia'

export const useUiStore = defineStore('uiStore', () => {
  const showCartMenu = ref(false)
  const cartStore = useCartStore()
  const globalLoad = ref(false)
  const isLoading = computed(() => globalLoad.value)
  const toggleLoader = () => {
    globalLoad.value = !globalLoad.value
  }
  const { mdAndUp } = useDisplay()
  const toggleCartMenu = () => {
    showCartMenu.value = !showCartMenu.value
  }
  const clearState = () => {
    showCartMenu.value = false
  }
  const calcFooterHeight = computed(() => {
    if (!mdAndUp.value) {
      if (cartStore.cartData.member_code) {
        return 164
      } else {
        return 216
      }
    } else {
      return 128
    }
  })

  return { showCartMenu, isLoading, toggleLoader, toggleCartMenu, clearState, calcFooterHeight }
})
