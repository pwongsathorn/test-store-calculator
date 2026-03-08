<script setup lang="ts">
import Cart from '~/components/base/Cart.vue'
const uiStore = useUiStore()
const showCart = computed(() => uiStore.showCartMenu)
</script>
<template>
  <v-dialog
    transition="dialog-bottom-transition"
    fullscreen
    :model-value="showCart"
    @update:model-value="uiStore.toggleCartMenu"
  >
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <h3>Cart</h3>
        <v-btn icon="mdi-close" color="grey" variant="text" @click="uiStore.toggleCartMenu"></v-btn>
      </v-card-title>
      <v-divider />
      <Cart />
    </v-card>
  </v-dialog>
</template>
