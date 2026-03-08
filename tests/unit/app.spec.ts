// tests/unit/app.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { useSessionStore } from '../../app/stores/useSessionStore'
import { usePurchaseStore } from '../../app/stores/usePurchaseStore'
import App from '../../app/app.vue'
import type { SubscriptionCallbackMutation } from 'pinia'

const NuxtLayout = { template: '<div><slot /></div>', name: 'NuxtLayout' }
const NuxtPage = { template: '<div />', name: 'NuxtPage' }

describe('App.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  const mountApp = (sessionId = '') => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        sessionStore: { shop_session: { session_id: sessionId } }, // ✅ matches defineStore('sessionStore')
        purchase: { purchased_list: {} }, // ✅ matches defineStore('purchase')
      },
    })

    // ✅ spy on $subscribe BEFORE mount so app.vue's call is captured
    const purchaseStore = usePurchaseStore(pinia)
    const subscribeSpy = vi.spyOn(purchaseStore, '$subscribe')

    const wrapper = mount(App, {
      global: {
        components: { NuxtLayout, NuxtPage },
        stubs: { 'v-app': { template: '<div><slot /></div>' } },
        plugins: [pinia],
      },
    })

    return { wrapper, purchaseStore, subscribeSpy }
  }

  describe('session initialization', () => {
    it('calls createSession when session_id is missing', () => {
      mountApp()
      const sessionStore = useSessionStore()
      expect(sessionStore.createSession).toHaveBeenCalledOnce()
    })

    it('does NOT call createSession when session_id exists', () => {
      mountApp('existing-session-123')
      const sessionStore = useSessionStore()
      expect(sessionStore.createSession).not.toHaveBeenCalled()
    })
  })

  describe('purchaseStore subscription', () => {
    it('subscribes to purchaseStore on mount', () => {
      const { subscribeSpy } = mountApp('abc-123')
      expect(subscribeSpy).toHaveBeenCalledOnce()
    })

    it('persists state to localStorage on store change', () => {
      const { subscribeSpy } = mountApp('abc-123')

      const [[callback]] = subscribeSpy.mock.calls
      const fakeState = { purchased_list: { 'abc#123': { total: 100 } } }
      const fakeMutation = {
        storeId: 'purchase',
        type: 'direct',
        events: {} as any,
      } as SubscriptionCallbackMutation<typeof fakeState>
      callback(fakeMutation, fakeState)

      expect(localStorage.getItem('purchase')).toBe(JSON.stringify(fakeState))
    })
  })
})
