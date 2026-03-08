// tests/mocks/imports.ts
import { vi } from 'vitest'
import { ref, computed, watch, reactive, toRef, toRefs, nextTick } from 'vue'

export { ref, computed, watch, reactive, toRef, toRefs, nextTick }

export const useAsyncData = vi.fn()
export const useRuntimeConfig = vi.fn(() => ({
  public: { apiBase: '' },
}))
export const useSessionStore = vi.fn()
export const usePurchaseStore = vi.fn()
export const navigateTo = vi.fn()
export const useRouter = vi.fn()
export const useRoute = vi.fn()
