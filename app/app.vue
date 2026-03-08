<script lang="ts" setup>
const sessionStore = useSessionStore()
if (!sessionStore.shop_session.session_id) {
  sessionStore.createSession()
}

const purchaseStore = usePurchaseStore()

purchaseStore.$subscribe((mutation, state) => {
  // persist the whole state to the local storage whenever it changes
  localStorage.setItem(mutation.storeId, JSON.stringify(state))
})
</script>
<template>
  <v-app>
    <nuxt-layout>
      <nuxt-page />
    </nuxt-layout>
  </v-app>
</template>
