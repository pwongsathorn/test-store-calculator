// stores/cart.ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { cloneDeep } from 'lodash'

import type { ItemData, CartItem, OrderSummary, CalculatePayload } from '~/types/data'

export const useCartStore = defineStore('cart', () => {
  // --- State ---
  // const items = ref<CartItem[]>([])
  const calculating = ref<boolean>(false)
  const cartData = reactive<CalculatePayload>({
    item_list: [],
    member_code: '',
  })

  // --- Getters ---
  const totalItems = computed(() =>
    cartData.item_list.reduce((sum, item) => sum + item.quantity, 0)
  )

  function getItemQuantity(id: string): number {
    return cartData.item_list.find((i) => i.item_hash === id)?.quantity ?? 0
  }

  const isEmpty = computed(() => cartData.item_list.length === 0)
  // --- Actions ---
  function addItem(product: ItemData, quantity = 1) {
    const existing = cartData.item_list.find((i) => i.item_hash === product.item_hash)
    if (existing) {
      existing.quantity += quantity
    } else {
      cartData.item_list.push({
        item_hash: product.item_hash,
        item_name: product.item_name,
        item_price: product.item_price,
        quantity,
      })
    }
  }

  function removeItem(item_hash: string) {
    const existing = cartData.item_list.find((i) => i.item_hash === item_hash)
    if (existing && existing.quantity === 1) {
      cartData.item_list = cartData.item_list.filter((i) => i.item_hash !== item_hash)
    } else if (existing && existing.quantity > 1) {
      existing.quantity -= 1
    }
  }

  function clearCart() {
    cartData.item_list = []
  }
  function updateMember(member: string) {
    console.log('current member', cartData.member_code)
    cartData.member_code = member
  }

  function updateCartLoadState(state: boolean) {
    calculating.value = state
  }

  return {
    // State
    calculating,
    cartData,
    // calculatedCart,
    // Getters
    totalItems,
    isEmpty,
    getItemQuantity,
    // Actions
    addItem,
    removeItem,
    clearCart,
    updateCartLoadState,
    updateMember,
  }
})
