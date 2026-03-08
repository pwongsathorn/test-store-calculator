// tests/nuxt/ItemList.spec.ts
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { createTestingPinia } from '@pinia/testing'
import { usePurchaseStore } from '~/stores/usePurchaseStore'
import type { ItemData } from '~/types/data'

const mockRefresh = vi.fn()
const mockRuntimeConfig = {
  public: {
    apiBase: 'https://test-api-url.com',
  },
  // other private keys can be added here
}

// ✅ mockNuxtImport handles auto-imports correctly in nuxt environment
// mockNuxtImport('useAsyncData', () =>
//   vi.fn().mockReturnValue({
//     data: ref(null),
//     refresh: mockRefresh,
//     error: ref(null),
//   })
// )
const fakeItems: ItemData[] = [
  {
    item_hash: 'abc123',
    item_image: 'https://example.com/item1.png',
    item_name: 'Product A',
    item_stock: 10,
    item_price: 100,
  },
  {
    item_hash: 'def456',
    item_image: 'https://example.com/item2.png',
    item_name: 'Product B',
    item_stock: 5,
    item_price: 200,
  },
]
mockNuxtImport('useAsyncData', () => {
  return () => {
    return { data: fakeItems, error: { value: '' }, refresh: mockRefresh }
  }
})
// mockNuxtImport('useRuntimeConfig', () => vi.fn().mockReturnValue(mockRuntimeConfig))

describe('ItemList.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mountItemList = async (data: ItemData[] | null = null) => {
    // const { useAsyncData } = await import('#imports')

    // ;(useAsyncData as ReturnType<typeof vi.fn>).mockReturnValue({
    //   data: ref(data),
    //   refresh: mockRefresh,
    //   error: ref(null),
    // })

    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        sessionStore: { shop_session: { session_id: 'test-session-id' } },
        purchase: { purchased_list: {} },
      },
    })

    const purchaseStore = usePurchaseStore(pinia)
    const subscribeSpy = vi.spyOn(purchaseStore, '$subscribe')

    const wrapper = await mountSuspended((await import('~/components/ItemList.vue')).default, {
      global: {
        plugins: [pinia],
      },
    })

    return { wrapper, purchaseStore, subscribeSpy }
  }

  describe('renders item list when data exists', () => {
    it('renders an ItemBox for each item', async () => {
      const { wrapper } = await mountItemList(fakeItems)
      const itemBoxes = wrapper.findAll('[id^="item-"]')
      expect(itemBoxes).toHaveLength(fakeItems.length)
    })

    it('passes correct id to each ItemBox', async () => {
      const { wrapper } = await mountItemList(fakeItems)
      expect(wrapper.find('#item-1').exists()).toBe(true)
      expect(wrapper.find('#item-2').exists()).toBe(true)
    })
  })

  describe('purchaseStore $subscribe triggers refresh', () => {
    it('subscribes to purchaseStore on mount', async () => {
      const { subscribeSpy } = await mountItemList(fakeItems)
      expect(subscribeSpy).toHaveBeenCalledOnce()
    })

    it('calls refresh when purchaseStore changes', async () => {
      const { subscribeSpy } = await mountItemList(fakeItems)
      const [[callback]] = subscribeSpy.mock.calls
      callback()
      expect(mockRefresh).toHaveBeenCalledOnce()
    })
  })
})
