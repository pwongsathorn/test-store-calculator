import { defineStore } from 'pinia'
import { reactive } from 'vue'

import type { OrderSummary } from '~/types/data'

export const usePurchaseStore = defineStore('purchase', () => {
  // --- State ---
  const purchased_list = reactive<Record<string, OrderSummary>>({})
  function addPurchaseList(session: string, order: OrderSummary) {
    const date = new Date()
    const purchase_key = `${session}#${date.valueOf()}`
    purchased_list[purchase_key] = order
  }
  return {
    purchased_list,
    addPurchaseList,
  }
})
