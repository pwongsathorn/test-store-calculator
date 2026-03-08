import { v4 as uuidv4 } from 'uuid'
import { defineStore } from 'pinia'

export type ShopSession = {
  session_id: string
  unix_date?: number
}

export const useSessionStore = defineStore('sessionStore', () => {
  const shop_session = reactive<ShopSession>({
    session_id: '',
  })

  const createSession = () => {
    const currentDate = new Date()
    shop_session.session_id = uuidv4()
    shop_session.unix_date = currentDate.valueOf()
  }
  const clearSession = () => {
    shop_session.session_id = ''
    delete shop_session.unix_date
  }

  return {
    // State
    shop_session,
    // Actions
    createSession,
    clearSession,
  }
})
