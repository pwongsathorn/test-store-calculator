<script setup lang="ts">
import ItemBox from '~/components/base/ItemBox.vue'
import type { ItemData } from '~/types/data'
const sessionStore = useSessionStore()
const session_id = computed(() => sessionStore.shop_session.session_id)
const loadState = ref(false)
const purchaseStore = usePurchaseStore()
const config = useRuntimeConfig()
const {
  data: ItemList,
  refresh,
  error,
} = await useAsyncData<ItemData[]>('get', () =>
  $fetch(`${config.public.apiBase}/item-list`, {
    method: 'GET',
    headers: {
      Authorization: session_id.value,
    },
    onRequest: () => {
      loadState.value = true
    },
    onResponse: ({ response }) => {
      loadState.value = false
    },
    onRequestError: () => {
      loadState.value = false
    },
    onResponseError: () => {
      loadState.value = false
    },
  })
)
if (error.value) console.error('async data failed', error.value)

async function refreshItemData() {
  refresh()
}

purchaseStore.$subscribe(() => {
  // persist the whole state to the local storage whenever it changes
  refresh()
})
</script>

<template>
  <v-row v-if="ItemList">
    <template v-for="(item, itemIndex) in ItemList" :key="`item-${itemIndex + 1}`">
      <v-col cols="12" md="6" lg="4">
        <ItemBox :id="`item-${itemIndex + 1}`" :item="item" @update:restock="refreshItemData" />
      </v-col>
    </template>
  </v-row>
  <v-sheet v-else class="h-100">
    <section
      height="100%"
      class="placeholder-section fill-height d-flex flex-column justify-center align-center"
    >
      <v-avatar size="120" variant="tonal" color="red">
        <v-icon size="64" icon="mdi-storefront-remove-outline"></v-icon>
      </v-avatar>
      <h1>Oops!</h1>
      <p>There is no available product right now.</p>
    </section>
  </v-sheet>
</template>
