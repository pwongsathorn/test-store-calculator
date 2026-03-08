<script setup lang="ts">
import Cart from '~/components/base/Cart.vue'
</script>
<template>
  <v-navigation-drawer class="cart-drawer" width="356" location="right">
    <section class="navigation-wrapper d-flex flex-column fill-height">
      <h3 class="pa-4">Cart</h3>
      <v-divider />
      <Cart />
    </section>
  </v-navigation-drawer>
</template>
